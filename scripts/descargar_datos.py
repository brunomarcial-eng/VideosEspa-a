#!/usr/bin/env python3
"""Descarga los ficheros crudos oficiales de los temas T1 y T2 a data/raw/.

Cada descarga queda registrada en data/raw/MANIFEST.csv con el enlace, la
fecha de consulta y la huella SHA-256, para poder demostrar de dónde sale cada
cifra si hay una apelación.

Uso: python3 scripts/descargar_datos.py [fichero ...]
Sin argumentos baja todo; con nombres de fichero, solo esos (los demás no se tocan).
"""
import csv
import hashlib
import json
import pathlib
import sys
import urllib.request
from datetime import datetime, timezone

RAIZ = pathlib.Path(__file__).resolve().parent.parent
RAW = RAIZ / "data" / "raw"

INE = "https://servicios.ine.es/wstempus/js/ES/DATOS_TABLA/{id}?tip=A&nult={n}"
EUROSTAT = ("https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/"
            "{ds}?format=JSON&lang=EN&geo=ES&geo=EU27_2020{extra}")

# (fichero, url, descripción, tabla en la web del INE o Eurostat)
DESCARGAS = [
    # --- T1: salarios ---
    ("ine_28191_eaes_medias_percentiles.json", INE.format(id=28191, n=40),
     "INE EAES. Ganancia anual por trabajador: medias y percentiles por sexo y CCAA",
     "https://www.ine.es/jaxiT3/Tabla.htm?t=28191"),
    ("ine_30046_eaes_salario_por_hora.json", INE.format(id=30046, n=40),
     "INE EAES. Ingreso medio por hora por sexo y sectores",
     "https://www.ine.es/jaxiT3/Tabla.htm?t=30046"),
    ("ine_28187_eaes_tipo_jornada.json", INE.format(id=28187, n=40),
     "INE EAES. Ganancia media anual por sexo y tipo de jornada",
     "https://www.ine.es/jaxiT3/Tabla.htm?t=28187"),
    ("ine_6078_etcl_coste_salarial_hora.json", INE.format(id=6078, n=120),
     "INE ETCL. Coste salarial por hora efectiva, tipo de jornada y sectores (desde 2000)",
     "https://www.ine.es/jaxiT3/Tabla.htm?t=6078"),
    ("ine_6040_etcl_coste_salarial_hora_2008.json", INE.format(id=6040, n=80),
     "INE ETCL. Coste salarial por hora efectiva, tipo de jornada y sectores (CNAE-09, desde 2008)",
     "https://www.ine.es/jaxiT3/Tabla.htm?t=6040"),
    # --- T1: precios ---
    ("ine_76125_ipc_grupos.json", INE.format(id=76125, n=320),
     "INE IPC. Índices nacionales: general y grupos ECOICOP ver.2 (mensual, desde 2002)",
     "https://www.ine.es/jaxiT3/Tabla.htm?t=76125"),
    ("ine_76126_ipc_subgrupos.json", INE.format(id=76126, n=320),
     "INE IPC. Índices nacionales de subgrupos ECOICOP ver.2 (mensual, desde 2002)",
     "https://www.ine.es/jaxiT3/Tabla.htm?t=76126"),
    # --- T1: gasto en euros (EPF) ---
    ("ine_73778_epf_gasto_grupos.json", INE.format(id=73778, n=20),
     "INE EPF base 2016. Gasto por grupos de gasto (2 dígitos)",
     "https://www.ine.es/jaxiT3/Tabla.htm?t=73778"),
    # --- T2: EPA ---
    ("ine_65109_epa_ocupados.json", INE.format(id=65109, n=110),
     "INE EPA. Ocupados por sexo y grupo de edad (miles, trimestral)",
     "https://www.ine.es/jaxiT3/Tabla.htm?t=65109"),
    ("ine_65218_epa_parados.json", INE.format(id=65218, n=110),
     "INE EPA. Parados por sexo y grupo de edad (miles, trimestral)",
     "https://www.ine.es/jaxiT3/Tabla.htm?t=65218"),
    ("ine_65219_epa_tasa_paro.json", INE.format(id=65219, n=110),
     "INE EPA. Tasas de paro por sexo y grupo de edad (trimestral)",
     "https://www.ine.es/jaxiT3/Tabla.htm?t=65219"),
    ("ine_65306_epa_tasa_empleo.json", INE.format(id=65306, n=110),
     "INE EPA. Tasas de empleo de 16 y más y de 16 a 64 años por sexo y CCAA (trimestral)",
     "https://www.ine.es/jaxiT3/Tabla.htm?t=65306"),
    # --- T2: población residente (Estadística Continua de Población; antes, Cifras de Población) ---
    ("ine_ecp320_poblacion.json", "https://servicios.ine.es/wstempus/js/ES/DATOS_SERIE/ECP320?tip=A&nult=300",
     "INE ECP. Población residente en España, total nacional, todas las edades (serie ECP320, semestral desde 1971 y trimestral desde 2021)",
     "https://www.ine.es/jaxiT3/Tabla.htm?t=56934"),
    # --- T3: vivienda y coste de la vida, 2006 frente a hoy ---
    ("bde_si_1_5_vivienda.csv", "https://www.bde.es/webbe/es/estadisticas/compartido/datos/csv/si_1_5.csv",
     "Banco de España. Indicadores del mercado de la vivienda (precio m2 tasado, precio/renta por hogar, esfuerzo teórico, tipos, plazos, tenencia)",
     "https://www.bde.es/webbe/es/estadisticas/temas/vivienda.html"),
    ("mivau_35103500_valor_tasado_municipios.xls", "https://apps.fomento.gob.es/BoletinOnline2/sedal/35103500.XLS",
     "Ministerio de Vivienda. Valor tasado medio de vivienda libre en municipios de más de 25.000 habitantes (€/m², trimestral desde 2005)",
     "https://www.mivau.gob.es/el-ministerio/informacion-estadistica/vivienda-suelo-y-urbanismo/valor-tasado-de-la-vivienda"),
    ("ine_25171_ipv_ccaa.json", INE.format(id=25171, n=90),
     "INE. Índice de Precios de Vivienda (compraventas ante notario, ajustado por calidad), por comunidad autónoma, base 2015, 2007-2025",
     "https://www.ine.es/jaxiT3/Tabla.htm?t=25171"),
    ("ine_24077_ipc_desde_1961.json", INE.format(id=24077, n=800),
     "INE IPC. Índice general nacional, series enlazadas desde enero de 1961 (mensual)",
     "https://www.ine.es/jaxiT3/Tabla.htm?t=24077"),
    ("ine_24079_ipc_alquiler_desde_1961.json", INE.format(id=24079, n=800),
     "INE IPC. Índice nacional de la vivienda en alquiler, series desde enero de 1961 (mensual)",
     "https://www.ine.es/jaxiT3/Tabla.htm?t=24079"),
    ("ine_24077_ipc_indice.csv", "https://www.ine.es/jaxiT3/files/t/es/csv_bdsc/24077.csv",
     "INE IPC. Índice general nacional (base 2025), CSV completo: con índice desde 2002",
     "https://www.ine.es/jaxiT3/Tabla.htm?t=24077"),
    ("ine_76134_ipc_variaciones_desde_1961.csv", "https://www.ine.es/jaxiT3/files/t/es/csv_bdsc/76134.csv",
     "INE IPC. Tasas de variación del índice general nacional desde enero de 1961 (para enlazar el IPC hacia atrás)",
     "https://www.ine.es/jaxiT3/Tabla.htm?t=76134"),
    ("ine_anuario1987_salarios_1986.pdf", "https://www.ine.es/inebaseweb/pdfDispacher.do?td=159526&ext=.pdf",
     "INE. Anuario Estadístico de España 1987, cap. VIII: retribución media por hora trabajada, año 1986 (Encuesta de Salarios)",
     "https://www.ine.es/inebaseweb/treeNavigation.do?tn=158970"),
    ("ine_anuario1987_smi_1980_1987.pdf", "https://www.ine.es/inebaseweb/pdfDispacher.do?td=159527&ext=.pdf",
     "INE. Anuario Estadístico de España 1987: evolución del salario mínimo interprofesional 1980-1987 (fuente: Ministerio de Trabajo)",
     "https://www.ine.es/inebaseweb/treeNavigation.do?tn=158970"),
    ("ine_anuario1988_convenios_jornada.pdf", "https://www.ine.es/inebaseweb/pdfDispacher.do?td=134655&ext=.pdf",
     "INE. Anuario Estadístico de España 1988, cap. VII: convenios colectivos, aumento salarial y jornada media pactada 1981-1987",
     "https://www.ine.es/inebaseweb/treeNavigation.do?tn=133343"),
    # --- T4/T5: natalidad ---
    ("ine_1579_edad_media_maternidad.json", INE.format(id=1579, n=60),
     "INE IDB. Edad media a la maternidad por orden del nacimiento y nacionalidad de la madre (anual, desde 1975)",
     "https://www.ine.es/jaxiT3/Tabla.htm?t=1579"),
    ("ine_1407_indicador_fecundidad.json", INE.format(id=1407, n=60),
     "INE IDB. Indicador coyuntural de fecundidad (hijos por mujer) por orden del nacimiento y nacionalidad de la madre (anual, desde 1975)",
     "https://www.ine.es/jaxiT3/Tabla.htm?t=1407"),
    ("ine_1380_edad_primer_matrimonio.json", INE.format(id=1380, n=60),
     "INE IDB. Edad media al primer matrimonio por sexo y nacionalidad (anual, desde 1976)",
     "https://www.ine.es/jaxiT3/Tabla.htm?t=1380"),
    ("ine_65270_epa_hogares_ocupados.json", INE.format(id=65270, n=100),
     "INE EPA. Hogares por número de ocupados y número de personas (miles, trimestral)",
     "https://www.ine.es/jaxiT3/Tabla.htm?t=65270"),
    ("ine_10627_epf2006_grupos.json", INE.format(id=10627, n=20),
     "INE EPF base 2006. Gasto total monetario y gastos medios por grupos de gasto (2006-2015)",
     "https://www.ine.es/jaxiT3/Tabla.htm?t=10627"),
    ("eurostat_yth_demo_030.json",
     "https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/yth_demo_030?format=JSON&lang=EN&geo=ES&geo=EU27_2020&sex=T",
     "Eurostat. Edad media a la que los jóvenes se van de casa de sus padres",
     "https://ec.europa.eu/eurostat/databrowser/view/yth_demo_030/default/table"),
    # --- T4 v4: en qué se gasta (1986 frente a hoy) y cuánto se lleva la vivienda ---
    ("ine_anuario1989_ecpf_1986_grupos.pdf", "https://www.ine.es/inebaseweb/pdfDispacher.do?td=135770&ext=.pdf",
     "INE. Anuario Estadístico de España 1989, cap. VIII, 2.2.6: gasto anual en bienes y servicios por grupos de gasto (Encuesta Continua de Presupuestos Familiares, año 1986)",
     "https://www.ine.es/inebaseweb/treeNavigation.do?tn=135187"),
    ("ine_anuario1989_epf_evolucion_1958_1986.pdf", "https://www.ine.es/inebaseweb/pdfDispacher.do?td=135765&ext=.pdf",
     "INE. Anuario Estadístico de España 1989, cap. VIII, 2.2.1: evolución del gasto anual medio por persona según antiguos grupos de gasto (1958-1986)",
     "https://www.ine.es/inebaseweb/treeNavigation.do?tn=135187"),
    ("ine_73779_epf_subgrupos.json", INE.format(id=73779, n=10),
     "INE EPF base 2016. Gasto por subgrupos de gasto (3 dígitos COICOP 2018/EPF)",
     "https://www.ine.es/jaxiT3/Tabla.htm?t=73779"),
    ("eurostat_ilc_mded02.json", EUROSTAT.format(ds="ilc_mded02", extra=""),
     "Eurostat (EU-SILC). Peso del alquiler en la renta disponible del hogar, por tipo de hogar",
     "https://ec.europa.eu/eurostat/databrowser/view/ilc_mded02/default/table"),
    ("eurostat_ilc_mded01.json", EUROSTAT.format(ds="ilc_mded01", extra=""),
     "Eurostat (EU-SILC). Peso de los costes de la vivienda en la renta disponible del hogar, por tipo de hogar",
     "https://ec.europa.eu/eurostat/databrowser/view/ilc_mded01/default/table"),
    ("eurostat_ilc_lvho07c.json", EUROSTAT.format(ds="ilc_lvho07c", extra=""),
     "Eurostat (EU-SILC). Sobrecarga de gastos de vivienda (más del 40 % de la renta disponible) por régimen de tenencia",
     "https://ec.europa.eu/eurostat/databrowser/view/ilc_lvho07c/default/table"),
    # --- T5: natalidad y envejecimiento ---
    ("ine_1381_tasa_bruta_natalidad.json", INE.format(id=1381, n=60),
     "INE IDB. Tasa bruta de natalidad (nacimientos por cada 1.000 habitantes, anual, desde 1975)",
     "https://www.ine.es/jaxiT3/Tabla.htm?t=1381"),
    ("ine_1417_proporcion_mayores.json", INE.format(id=1417, n=60),
     "INE IDB. Proporción de personas mayores de cierta edad (anual, desde 1975)",
     "https://www.ine.es/jaxiT3/Tabla.htm?t=1417"),
    ("ine_1418_indice_envejecimiento.json", INE.format(id=1418, n=60),
     "INE IDB. Índice de envejecimiento: mayores de 64 años por cada 100 menores de 16 (anual, desde 1975)",
     "https://www.ine.es/jaxiT3/Tabla.htm?t=1418"),
    ("ine_encuesta_fecundidad_2018_avance.pdf", "https://www.ine.es/prensa/ef_2018_a.pdf",
     "INE. Encuesta de Fecundidad 2018, datos avance (nota de prensa del 28-11-2018): fecundidad deseada, barreras e incentivos",
     "https://www.ine.es/dyngs/INEbase/es/operacion.htm?c=Estadistica_C&cid=1254736177006&menu=resultados&idp=1254735573002"),
    # --- T5/T6: mujer y trabajo, permisos, Europa ---
    ("ine_anuario1988_epa_1978_1987.pdf", "https://www.ine.es/inebaseweb/pdfDispacher.do?td=134643&ext=.pdf",
     "INE. Anuario Estadístico de España 1988, cap. VII, 1.1: Encuesta de Población Activa 1978-1987 (paro y tasa de paro por sexo y edad)",
     "https://www.ine.es/inebaseweb/treeNavigation.do?tn=133343"),
    ("ine_56934_poblacion_sexo_edad_desde_1971.csv", "https://www.ine.es/jaxiT3/files/t/es/csv_bdsc/56934.csv",
     "INE ECP. Población residente por fecha, sexo y edad (desde 1971)",
     "https://www.ine.es/jaxiT3/Tabla.htm?t=56934"),
    ("eurostat_lfsa_ergan_mujeres_ue.json",
     "https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/lfsa_ergan?format=JSON&lang=EN&sex=F&age=Y15-64&age=Y25-54&citizen=TOTAL&unit=PC&sinceTimePeriod=1995",
     "Eurostat. Tasa de empleo de las mujeres (15-64 y 25-54 años), todos los países, desde 1995",
     "https://ec.europa.eu/eurostat/databrowser/view/lfsa_ergan/default/table"),
    ("eurostat_lfsa_ergan_es.json",
     "https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/lfsa_ergan?format=JSON&lang=EN&geo=ES&sex=F&sex=M&age=Y15-64&citizen=TOTAL&unit=PC&sinceTimePeriod=1995",
     "Eurostat. Tasa de empleo por sexo (15-64 años), España, desde 1995",
     "https://ec.europa.eu/eurostat/databrowser/view/lfsa_ergan/default/table"),
    ("eurostat_demo_find_ue.json",
     "https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/demo_find?format=JSON&lang=EN&indic_de=TOTFERRT&sinceTimePeriod=1995",
     "Eurostat. Indicador coyuntural de fecundidad (hijos por mujer), todos los países, desde 1995",
     "https://ec.europa.eu/eurostat/databrowser/view/demo_find/default/table"),
    ("eurostat_lfsa_urgan_es_20_24.json",
     "https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/lfsa_urgan?format=JSON&lang=EN&geo=ES&sex=T&age=Y20-24&citizen=TOTAL&unit=PC&sinceTimePeriod=2005",
     "Eurostat. Tasa de paro de 20 a 24 años, España",
     "https://ec.europa.eu/eurostat/databrowser/view/lfsa_urgan/default/table"),
    ("boe_ley_8_1980_estatuto_trabajadores.pdf", "https://www.boe.es/boe/dias/1980/03/14/pdfs/A05799-05815.pdf",
     "BOE. Ley 8/1980, Estatuto de los Trabajadores (art. 37.3.b: dos días por nacimiento de hijo; art. 48.4: catorce semanas por parto)",
     "https://www.boe.es/eli/es/l/1980/03/10/8"),
    ("boe_rdl_9_2025_permiso_nacimiento.html", "https://www.boe.es/diario_boe/txt.php?id=BOE-A-2025-15741",
     "BOE. Real Decreto-ley 9/2025: permiso de nacimiento y cuidado de 19 semanas por progenitor",
     "https://www.boe.es/diario_boe/txt.php?id=BOE-A-2025-15741"),
    # --- Consulta de Bruno (17-11-2026): natalidad e inmigración (solo datos, no va al vídeo de momento) ---
    ("eurostat_demo_facbc_fr_es.json",
     "https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/demo_facbc?format=JSON&lang=EN&geo=FR&geo=ES&age=TOTAL&sinceTimePeriod=2005",
     "Eurostat. Nacidos vivos según el país de nacimiento de la madre (Francia y España)",
     "https://ec.europa.eu/eurostat/databrowser/view/demo_facbc/default/table"),
    ("boe_rdleg_1_1995_estatuto_trabajadores.pdf", "https://www.boe.es/boe/dias/1995/03/29/pdfs/A09654-09688.pdf",
     "BOE. Real Decreto Legislativo 1/1995, texto refundido del Estatuto de los Trabajadores (art. 37.3.b: dos días por nacimiento de hijo)",
     "https://www.boe.es/buscar/doc.php?id=BOE-A-1995-7730"),
    # --- T7: consumo (servicios, ropa y belleza) ---
    ("ine_10628_epf2006_subgrupos.json", INE.format(id=10628, n=20),
     "INE EPF base 2006. Gasto total y gastos medios por subgrupos de gasto (3 dígitos), 2006-2015",
     "https://www.ine.es/jaxiT3/Tabla.htm?t=10628"),
    ("eurostat_isoc_ec_ibuy_es.json",
     "https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/isoc_ec_ibuy?format=JSON&lang=EN&geo=ES&ind_type=IND_TOTAL&unit=PC_IND",
     "Eurostat. Compras por internet de las personas (hasta 2019)",
     "https://ec.europa.eu/eurostat/databrowser/view/isoc_ec_ibuy/default/table"),
    ("eurostat_isoc_ec_ib20_es.json",
     "https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/isoc_ec_ib20?format=JSON&lang=EN&geo=ES&ind_type=IND_TOTAL&unit=PC_IND",
     "Eurostat. Compras por internet de las personas (desde 2020)",
     "https://ec.europa.eu/eurostat/databrowser/view/isoc_ec_ib20/default/table"),
    ("eurostat_isoc_ec_ibgs_es.json",
     "https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/isoc_ec_ibgs?format=JSON&lang=EN&geo=ES&ind_type=IND_TOTAL&unit=PC_IND",
     "Eurostat. Qué se compra por internet: ropa, comida a domicilio, suscripciones (desde 2020)",
     "https://ec.europa.eu/eurostat/databrowser/view/isoc_ec_ibgs/default/table"),
    ("mecd_encuesta_habitos_deportivos_2024_25_nota.pdf",
     "https://www.educacionfpydeportes.gob.es/dam/jcr:16f3890c-024a-477a-8267-637d68ab1add/ehd-2024-25-nota-resumen.pdf",
     "Ministerio de Educación, FP y Deportes. Encuesta de Hábitos Deportivos en España 2024/25, nota resumen (enero de 2026)",
     "https://www.educacionfpydeportes.gob.es/servicios-al-ciudadano/estadisticas/deporte/encuesta-habitos-deportivos-en-espana.html"),
    # --- T7: música, discos y cine ---
    ("ine_10630_epf2006_5digitos.json", INE.format(id=10630, n=20),
     "INE EPF base 2006. Gasto por subclases (5 dígitos), 2006-2015: soportes de imagen y sonido, instrumentos musicales, espectáculos",
     "https://www.ine.es/jaxiT3/Tabla.htm?t=10630"),
    ("ine_73781_epf_5digitos.json", INE.format(id=73781, n=20),
     "INE EPF. Gasto por subclases (5 dígitos), 2016-2025: bienes culturales (CD, DVD, descargas, instrumentos), cines y espectáculos",
     "https://www.ine.es/jaxiT3/Tabla.htm?t=73781"),
    ("ine_anuario1988_cine_1986.pdf", "https://www.ine.es/inebaseweb/pdfDispacher.do?td=134793&ext=.pdf",
     "INE. Anuario Estadístico de España 1988: serie anual de la actividad de las salas de proyección (gasto medio por espectador de 1986)",
     "https://www.ine.es/inebaseweb/libros.do?tntp=25687"),
    ("ine_anuario2008_cultura.pdf", "https://www.ine.es/prodyser/pubweb/anuario08/anu08_04cultu.pdf",
     "INE. Anuario Estadístico de España 2008, cap. 4 Cultura y ocio (tabla 4.3.2: gasto medio por espectador de cine 2000-2007)",
     "https://www.ine.es/prodyser/pubweb/anuarios_mnu.htm"),
    ("ine_anuario2020_cultura.pdf", "https://www.ine.es/prodyser/pubweb/anuario20/anu20_04cultu.pdf",
     "INE. Anuario Estadístico de España 2020, cap. 4 Cultura y ocio (tabla 4.3.2: gasto medio por espectador de cine 2011-2018)",
     "https://www.ine.es/prodyser/pubweb/anuarios_mnu.htm"),
    ("mcu_anuario_estadisticas_culturales_2025.pdf",
     "https://www.cultura.gob.es/dam/jcr:daa6c0f8-9abb-48a8-8af3-7d54746d6e4a/anuario-de-estadisticas-culturales-2025.pdf",
     "Ministerio de Cultura. Anuario de Estadísticas Culturales 2025 (cine 2024: gasto medio por espectador; Encuesta de Hábitos y Prácticas Culturales 2024-2025: asistencia a conciertos)",
     "https://www.cultura.gob.es/servicios-a-la-ciudadania/estadisticas/cultura/mc/aec.html"),
    # --- T8: impuestos del sueldo (salario mínimo, cotizaciones e IRPF de 1986, 2006 y 2026) ---
    ("boe_rd_2474_2475_1985_smi_cotizacion_1986.pdf", "https://www.boe.es/boe/dias/1986/01/02/pdfs/A00729-00731.pdf",
     "BOE. Real Decreto 2474/1985 (salario mínimo de 1986) y Real Decreto 2475/1985 (cotización de 1986: topes y bases por grupo)",
     "https://www.boe.es/eli/es/rd/1985/12/27/2475"),
    ("boe_orden_28_01_1986_cotizacion.pdf", "https://www.boe.es/boe/dias/1986/02/01/pdfs/A04406-04411.pdf",
     "BOE. Orden de 28 de enero de 1986: tipos de cotización de 1986 (contingencias comunes, desempleo, FOGASA y formación profesional)",
     "https://www.boe.es/boe/dias/1986/02/01/"),
    ("boe_ley_48_1985_irpf.pdf", "https://www.boe.es/boe/dias/1985/12/30/pdfs/A40737-40743.pdf",
     "BOE. Ley 48/1985, de reforma parcial del IRPF: escala de 1986, deducciones y gastos del trabajo",
     "https://www.boe.es/boe/dias/1985/12/30/"),
    ("boe_rd_2930_1979_tarifa_accidentes.pdf", "https://www.boe.es/boe/dias/1980/01/08/pdfs/A00456-00462.pdf",
     "BOE. Real Decreto 2930/1979, tarifa de primas de accidentes de trabajo (epígrafes 101, comercio, y 113, oficinas)",
     "https://www.boe.es/eli/es/rd/1979/12/29/2930"),
    ("boe_rd_1613_2005_smi_2006.html", "https://www.boe.es/diario_boe/txt.php?id=BOE-A-2005-21610",
     "BOE. Real Decreto 1613/2005, salario mínimo de 2006 (540,90 euros al mes)",
     "https://www.boe.es/diario_boe/txt.php?id=BOE-A-2005-21610"),
    ("boe_orden_tas_29_2006_cotizacion.html", "https://www.boe.es/buscar/doc.php?id=BOE-A-2006-842",
     "BOE. Orden TAS/29/2006: tipos de cotización de 2006",
     "https://www.boe.es/buscar/doc.php?id=BOE-A-2006-842"),
    ("boe_rdl_5_2006_cotizacion_julio.html", "https://www.boe.es/buscar/doc.php?id=BOE-A-2006-10562",
     "BOE. Real Decreto-ley 5/2006: desde el 1 de julio de 2006, desempleo de la empresa 5,75 % y FOGASA 0,20 %",
     "https://www.boe.es/buscar/doc.php?id=BOE-A-2006-10562"),
    ("boe_ley_30_2005_pge_2006.html", "https://www.boe.es/buscar/act.php?id=BOE-A-2005-21525",
     "BOE. Ley 30/2005 de Presupuestos para 2006: escalas estatal y complementaria del IRPF de 2006 (arts. 58 y 59)",
     "https://www.boe.es/buscar/act.php?id=BOE-A-2005-21525"),
    ("boe_rdleg_3_2004_irpf.html", "https://www.boe.es/buscar/act.php?id=BOE-A-2004-4347",
     "BOE. Real Decreto Legislativo 3/2004, texto refundido del IRPF vigente en 2006: gastos (art. 18), mínimo personal (art. 42) y reducción del trabajo (art. 51)",
     "https://www.boe.es/buscar/act.php?id=BOE-A-2004-4347"),
    ("boe_rd_126_2026_smi.pdf", "https://www.boe.es/boe/dias/2026/02/19/pdfs/BOE-A-2026-3815.pdf",
     "BOE. Real Decreto 126/2026, salario mínimo de 2026 (1.221 euros al mes)",
     "https://www.boe.es/buscar/act.php?id=BOE-A-2026-3815"),
    ("boe_orden_pjc_297_2026_cotizacion.html", "https://www.boe.es/diario_boe/txt.php?id=BOE-A-2026-7296",
     "BOE. Orden PJC/297/2026: tipos y topes de cotización de 2026 (incluido el mecanismo de equidad intergeneracional)",
     "https://www.boe.es/diario_boe/txt.php?id=BOE-A-2026-7296"),
    ("boe_lgss_rdleg_8_2015.html", "https://www.boe.es/buscar/act.php?id=BOE-A-2015-11724",
     "BOE. Ley General de la Seguridad Social, disposición adicional 61.ª: tarifa de accidentes de trabajo de hoy (CNAE 47 y 64)",
     "https://www.boe.es/buscar/act.php?id=BOE-A-2015-11724"),
    ("boe_ley_35_2006_irpf.html", "https://www.boe.es/buscar/act.php?id=BOE-A-2006-20764",
     "BOE. Ley 35/2006 del IRPF vigente: gastos (art. 19), reducción del trabajo (art. 20), mínimo (art. 57), escala estatal (art. 63) y deducción por rendimientos del trabajo (DA 61.ª)",
     "https://www.boe.es/buscar/act.php?id=BOE-A-2006-20764"),
    ("boe_madrid_dleg_1_2010_tributos.html", "https://www.boe.es/buscar/act.php?id=BOCM-m-2010-90068",
     "BOE. Comunidad de Madrid, texto refundido de tributos cedidos: escala autonómica del IRPF (art. 1) y mínimo autonómico (art. 2)",
     "https://www.boe.es/buscar/act.php?id=BOCM-m-2010-90068"),
    # --- T8: IVA y ahorro ---
    ("boe_ley_30_1985_iva.pdf", "https://www.boe.es/boe/dias/1985/08/09/pdfs/A25214-25243.pdf",
     "BOE. Ley 30/1985 del IVA (en vigor desde 1986): tipos del 12, 6 y 33 % (arts. 27 a 29) y enseñanza exenta (art. 8)",
     "https://www.boe.es/boe/dias/1985/08/09/"),
    ("boe_ley_37_1992_iva_art90_2006.html", "https://www.boe.es/buscar/act.php?id=BOE-A-1992-28740&b=123&tn=1&p=19951230",
     "BOE. Ley 37/1992 del IVA, artículo 90 (tipo general del 16 %) en la redacción vigente en 2006",
     "https://www.boe.es/buscar/act.php?id=BOE-A-1992-28740"),
    ("boe_ley_37_1992_iva_art91_2006.html", "https://www.boe.es/buscar/act.php?id=BOE-A-1992-28740&b=124&tn=1&p=20051230",
     "BOE. Ley 37/1992 del IVA, artículo 91 (tipos del 7 y 4 %) en la redacción vigente en 2006",
     "https://www.boe.es/buscar/act.php?id=BOE-A-1992-28740"),
    ("boe_ley_37_1992_iva_vigente.html", "https://www.boe.es/buscar/act.php?id=BOE-A-1992-28740",
     "BOE. Ley 37/1992 del IVA vigente: tipos del 21, 10 y 4 % y exenciones",
     "https://www.boe.es/buscar/act.php?id=BOE-A-1992-28740"),
    # --- T8: impuesto de la gasolina ---
    ("boe_ley_45_1985_impuestos_especiales.pdf", "https://www.boe.es/boe/dias/1985/12/24/pdfs/A40415-40424.pdf",
     "BOE. Ley 45/1985 de Impuestos Especiales: gasolinas de automoción, 27,50 pesetas por litro en 1986 (art. 33)",
     "https://www.boe.es/boe/dias/1985/12/24/"),
    ("boe_ley_38_1992_hidrocarburos_2006.html", "https://www.boe.es/buscar/act.php?id=BOE-A-1992-28741&b=61&tn=1&p=20051119",
     "BOE. Ley 38/1992 de Impuestos Especiales, artículo 50 en la redacción vigente en 2006 (gasolina sin plomo 95: 371,69 euros por 1.000 litros)",
     "https://www.boe.es/buscar/act.php?id=BOE-A-1992-28741"),
    ("boe_ley_38_1992_hidrocarburos_vigente.html", "https://www.boe.es/buscar/act.php?id=BOE-A-1992-28741",
     "BOE. Ley 38/1992 de Impuestos Especiales vigente, artículo 50 (gasolina sin plomo 95: 400,69 + 72 euros por 1.000 litros)",
     "https://www.boe.es/buscar/act.php?id=BOE-A-1992-28741"),
    ("boe_ley_24_2001_ivmdh_2006.html", "https://www.boe.es/buscar/act.php?id=BOE-A-2001-24965&b=21&tn=1&p=20031231",
     "BOE. Ley 24/2001, impuesto sobre las ventas minoristas de determinados hidrocarburos en 2006: tipo estatal de 24 euros por 1.000 litros",
     "https://www.boe.es/buscar/act.php?id=BOE-A-2001-24965"),
    ("boe_madrid_ley_7_2002_ivmdh.pdf", "https://www.boe.es/boe/dias/2002/08/23/pdfs/A31256-31257.pdf",
     "BOE. Comunidad de Madrid, Ley 7/2002: tipo autonómico del impuesto sobre ventas minoristas de hidrocarburos (24 euros por 1.000 litros desde 2004)",
     "https://www.boe.es/boe/dias/2002/08/23/"),
    # --- Contraste de T8 (Bruno, 18-11-2026): precio de los carburantes, rebajas de 2026 y sueldos ---
    ("ce_boletin_petrolero_historico.xlsx",
     "https://energy.ec.europa.eu/document/download/906e60ca-8b6a-44e7-8589-652854d2fd3f_en?filename=Weekly_Oil_Bulletin_Prices_History_maticni_4web.xlsx",
     "Comisión Europea. Weekly Oil Bulletin, histórico semanal desde 2005: precio de la gasolina 95 y del gasóleo en España con y sin impuestos",
     "https://energy.ec.europa.eu/data-and-analysis/weekly-oil-bulletin_en"),
    ("ce_boletin_petrolero_impuestos.xlsx",
     "https://energy.ec.europa.eu/document/download/ccdc6e96-6792-40cb-b0b4-b6609f1e30d0_en?filename=Oil_Bulletin_Duties_and_taxes.xlsx",
     "Comisión Europea. Weekly Oil Bulletin, impuestos vigentes: España, gasolina 272,69 € por 1.000 litros desde el 12-10-2026 e IVA del 21 %",
     "https://energy.ec.europa.eu/data-and-analysis/weekly-oil-bulletin_en"),
    ("boe_rdl_7_2026_oriente_medio.html", "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-6544",
     "BOE. Real Decreto-ley 7/2026: art. 38, gasolina 95 a 304,32 + 54,68 € por 1.000 litros, y art. 42, IVA de los carburantes al 10 %, hasta el 30-6-2026",
     "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-6544"),
    ("boe_rdl_18_2026_oriente_medio.html", "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-14112",
     "BOE. Real Decreto-ley 18/2026: arts. 5 a 7, impuesto de la gasolina de julio a septiembre de 2026 (retirada gradual con salvaguarda por el IPC)",
     "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-14112"),
    ("boe_rdl_25_2026_oriente_medio.html", "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-20265",
     "BOE. Real Decreto-ley 25/2026: rebaja del impuesto de la gasolina y el gasóleo de 20 céntimos por litro en octubre de 2026 (13 y 6 en noviembre y diciembre, o 20 si el IPC sube más de un 15 %)",
     "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-20265"),
    ("ine_etcl_coste_salarial_t6038.json", "https://servicios.ine.es/wstempus/js/ES/DATOS_TABLA/6038?nult=14",
     "INE. Encuesta Trimestral de Coste Laboral: coste salarial total por trabajador y mes (para estimar el sueldo medio de 2026)",
     "https://www.ine.es/jaxiT3/Tabla.htm?t=6038"),
    # --- T9: horas de trabajo (carburante de 1986 y luz) ---
    ("boe_orden_09_01_1985_carburantes.html", "https://www.boe.es/buscar/doc.php?id=BOE-A-1985-504",
     "BOE. Orden de 9-1-1985, precios de venta al público de los productos petrolíferos: gasóleo A a 62 pesetas el litro (vigente hasta el 28-2-1986)",
     "https://www.boe.es/buscar/doc.php?id=BOE-A-1985-504"),
    ("boe_orden_11_12_1985_carburantes.html", "https://www.boe.es/buscar/doc.php?id=BOE-A-1985-25907",
     "BOE. Orden de 11-12-1985: gasolina súper a 87 pesetas el litro desde el 13-12-1985",
     "https://www.boe.es/buscar/doc.php?id=BOE-A-1985-25907"),
    ("boe_orden_27_12_1985_carburantes.html", "https://www.boe.es/buscar/doc.php?id=BOE-A-1985-26964",
     "BOE. Orden de 27-12-1985 (desde el 1-1-1986): solo cambia el gasóleo B y C; la gasolina y el gasóleo A siguen igual",
     "https://www.boe.es/buscar/doc.php?id=BOE-A-1985-26964"),
    ("boe_orden_28_02_1986_carburantes.html", "https://www.boe.es/buscar/doc.php?id=BOE-A-1986-5436",
     "BOE. Orden de 28-2-1986 (desde el 1-3-1986): gasolina súper a 82 pesetas el litro y gasóleo A a 60",
     "https://www.boe.es/buscar/doc.php?id=BOE-A-1986-5436"),
    ("boe_orden_01_08_1986_carburantes.html", "https://www.boe.es/buscar/doc.php?id=BOE-A-1986-20802",
     "BOE. Orden de 1-8-1986: cambia gases licuados; no la gasolina ni el gasóleo A",
     "https://www.boe.es/buscar/doc.php?id=BOE-A-1986-20802"),
    ("boe_orden_07_11_1986_carburantes.html", "https://www.boe.es/buscar/doc.php?id=BOE-A-1986-29539",
     "BOE. Orden de 7-11-1986: cambia gases licuados y gasóleo B; no la gasolina ni el gasóleo A",
     "https://www.boe.es/buscar/doc.php?id=BOE-A-1986-29539"),
    ("eurostat_nrg_pc_204_es.json",
     "https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/nrg_pc_204?format=JSON&lang=EN&geo=ES",
     "Eurostat. Precio de la electricidad para los hogares (España, semestral, desde 1991): con y sin impuestos",
     "https://ec.europa.eu/eurostat/databrowser/view/nrg_pc_204/default/table"),
    ("microdatos/ees_cuatrienal_2006.zip", "https://www.ine.es/ftp/microdatos/salarial/datos_salarial06.zip",
     "INE. Encuesta Cuatrienal de Estructura Salarial 2006, microdatos (no se versiona: 72 MB)",
     "https://www.ine.es/dyngs/INEbase/es/operacion.htm?c=Estadistica_C&cid=1254736177025&menu=resultados&idp=1254735976596"),
    ("microdatos/ees_cuatrienal_2022.zip", "https://www.ine.es/ftp/microdatos/salarial/datos_2022.zip",
     "INE. Encuesta Cuatrienal de Estructura Salarial 2022, microdatos (no se versiona: 77 MB)",
     "https://www.ine.es/dyngs/INEbase/es/operacion.htm?c=Estadistica_C&cid=1254736177025&menu=resultados&idp=1254735976596"),
    # --- Eurostat (contraste) ---
    ("eurostat_lfsi_emp_a.json",
     EUROSTAT.format(ds="lfsi_emp_a", extra="&age=Y20-64&sex=T&indic_em=EMP_LFS&unit=PC_POP"),
     "Eurostat. Tasa de empleo 20-64 años (anual)",
     "https://ec.europa.eu/eurostat/databrowser/view/lfsi_emp_a/default/table"),
    ("eurostat_une_rt_a.json",
     EUROSTAT.format(ds="une_rt_a", extra="&age=Y15-74&sex=T&unit=PC_ACT"),
     "Eurostat. Tasa de paro 15-74 años (anual)",
     "https://ec.europa.eu/eurostat/databrowser/view/une_rt_a/default/table"),
    ("eurostat_earn_nt_net.json",
     EUROSTAT.format(ds="earn_nt_net", extra="&currency=EUR"),
     "Eurostat. Ganancias netas anuales por tipo de hogar (para contrastar el cálculo del neto)",
     "https://ec.europa.eu/eurostat/databrowser/view/earn_nt_net/default/table"),
]


def bajar(url: str) -> bytes:
    req = urllib.request.Request(url, headers={"User-Agent": "cvth-datos/1.0"})
    with urllib.request.urlopen(req, timeout=180) as r:
        return r.read()


def main() -> int:
    RAW.mkdir(parents=True, exist_ok=True)
    manifest = RAW / "MANIFEST.csv"
    filas = []
    if manifest.exists():
        with manifest.open(newline="", encoding="utf-8") as f:
            filas = list(csv.DictReader(f))
    por_fichero = {r["fichero"]: r for r in filas}
    errores = 0
    solo = set(sys.argv[1:])
    for fichero, url, desc, web in DESCARGAS:
        if solo and fichero not in solo:
            continue
        try:
            datos = bajar(url)
            if fichero.endswith(".json"):
                json.loads(datos)  # comprobar que es JSON válido
        except Exception as e:  # noqa: BLE001
            print(f"ERROR {fichero}: {e}", file=sys.stderr)
            errores += 1
            continue
        (RAW / fichero).parent.mkdir(parents=True, exist_ok=True)
        (RAW / fichero).write_bytes(datos)
        por_fichero[fichero] = {
            "fichero": fichero,
            "descripcion": desc,
            "url_api": url,
            "url_web": web,
            "consultado_utc": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
            "sha256": hashlib.sha256(datos).hexdigest(),
            "bytes": len(datos),
        }
        print(f"ok {fichero} ({len(datos):,} bytes)")
    campos = ["fichero", "descripcion", "url_api", "url_web", "consultado_utc", "sha256", "bytes"]
    with manifest.open("w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=campos)
        w.writeheader()
        for k in sorted(por_fichero):
            w.writerow(por_fichero[k])
    return 1 if errores else 0


if __name__ == "__main__":
    sys.exit(main())
