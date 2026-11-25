#!/usr/bin/env python3
"""Datos limpios de T7 (consumo hace 40 años, hace 20 y hoy: servicios, ropa y belleza).
- Reparto del gasto total de los hogares: 1986 (Encuesta Continua de Presupuestos Familiares, Anuario del INE de 1989),
  2006 (EPF base 2006, tabla 10628) y 2016/2025 (EPF base 2016, tablas 73778 y 73779). Los cuatro incluyen el alquiler imputado.
- Precios: IPC por grupos (INE), variación real = (grupo / general) − 1.
- Compras por internet: Eurostat (isoc_ec_ibuy hasta 2019; isoc_ec_ib20 e isoc_ec_ibgs desde 2020).
- Deporte: Encuesta de Hábitos Deportivos 2024/25 (Ministerio de Educación, FP y Deportes).
- Música y cine: EPF por subclases (tablas 10630 y 73781), Anuarios del INE (cine) y Anuario de Estadísticas Culturales 2025 (Ministerio de Cultura).
Uso: python3 scripts/calcular_t7.py → data/clean/t7_consumo.json"""
import json
import pathlib
import re
import subprocess

RAIZ = pathlib.Path(__file__).resolve().parent.parent
RAW, CLEAN = RAIZ / "data" / "raw", RAIZ / "data" / "clean"


def pdf(nombre):
    return subprocess.run(["pdftotext", "-layout", str(RAW / nombre), "-"], capture_output=True, text=True).stdout


def ecpf_1986():
    txt = pdf("ine_anuario1989_ecpf_1986_grupos.pdf")
    def pm(etiqueta):
        for linea in txt.splitlines():
            if etiqueta in linea:
                cols = [c for c in re.split(r"\s{2,}", linea.split(etiqueta, 1)[1].strip()) if c]
                return round(float(cols[1].replace(" ", "").replace(".", "").replace(",", ".")) / 10, 2)
        raise SystemExit(f"no encuentro «{etiqueta}»")
    return {"ropa_calzado": pm("2. Vestido y calzado"), "cuidado_personal_y_complementos": pm("8 .1 . Cuidados y efectos personales"),
            "restaurantes_cafes_hoteles": pm("8 .3 . Gastos en restaurantes, cafés y hoteles"), "comunicaciones": pm("6 .4 . Correos y comunicaciones"),
            "servicios_transporte": pm("6 .3. Compras de servicios de transporte"), "esparcimiento_espectaculos_cultura": pm("7 .2 . Esparcimiento, espectáculos y cultura")}


def epf(fichero, filtro_nombre, anyo):
    out = {}
    for s in json.loads((RAW / fichero).read_text(encoding="utf-8")):
        n = s["Nombre"]
        if filtro_nombre in n:
            v = {str(p["Anyo"]): p["Valor"] for p in s["Data"] if p["Valor"] is not None}
            if anyo in v:
                clave = n.replace("Base 2006. Anual. Total Nacional. ", "").split(". ")[0] if "Base 2006" in n else n.split(". Dato base")[0].strip()
                out[clave] = v[anyo]
    return out


def ipc_real():
    d = json.loads((RAW / "ine_76125_ipc_grupos.json").read_text(encoding="utf-8"))
    idx = {}
    for s in d:
        n = s["Nombre"]
        if n.rstrip().endswith("Índice."):
            idx[n.split(". ")[1]] = {str(p["Anyo"]): p["Valor"] for p in s["Data"]}
    g = idx["Índice general"]
    res = {}
    for k in ("Vestido y calzado", "Restaurantes y servicios de alojamiento", "Cuidado personal, protección social, y bienes y servicios diversos",
              "Información y comunicaciones", "Actividades recreativas, deporte y cultura"):
        v = idx[k]
        res[k] = {f"{a}_{b}": round(100 * ((v[b] / v[a]) / (g[b] / g[a]) - 1), 1) for a, b in (("2006", "2025"), ("2016", "2025"))}
    res["general_nominal_2006_2025_pct"] = round(100 * (g["2025"] / g["2006"] - 1), 1)
    return res


def eurostat(fichero, indic):
    d = json.loads((RAW / fichero).read_text(encoding="utf-8"))
    dims, size, idx = d["id"], d["size"], {k: d["dimension"][k]["category"]["index"] for k in d["id"]}
    out = {}
    for t in idx["time"]:
        pos = 0
        for k, n in zip(dims, size):
            c = t if k == "time" else {"indic_is": indic, "geo": "ES", "unit": "PC_IND", "ind_type": "IND_TOTAL"}.get(k, next(iter(idx[k])))
            if c not in idx[k]:
                return out
            pos = pos * n + idx[k][c]
        v = d["value"].get(str(pos))
        if v is not None:
            out[t] = v
    return out


def deporte():
    txt = re.sub(r"\s+", " ", pdf("mecd_encuesta_habitos_deportivos_2024_25_nota.pdf"))
    def busca(patron):
        m = re.search(patron, txt)
        if not m:
            raise SystemExit(f"no encuentro «{patron}» en la Encuesta de Hábitos Deportivos")
        return float(m.group(1).replace(",", "."))
    return {"practica_anual_pct": {"2015": busca(r"el (53,5)% en 2015"), "2022": busca(r"frente al (57,3)% registrado en 2022"), "2024_25": busca(r"tasa de práctica deportiva anual en un (62,7)%")},
            "abonados_gimnasio_pct": busca(r"Un (30,7)% de las personas investigadas están abonadas o son socias de gimnasios"),
            "padel_anual_pct": busca(r"pádel con 36,5% frente al (9,7) % de la población general")}


def musica_cine():
    """Discos, cine y conciertos: lo que pagaban los padres frente a hoy."""
    # Cine: gasto medio por espectador (precio medio pagado por entrada)
    t88 = pdf("ine_anuario1988_cine_1986.pdf")
    m = re.search(r"Por espectador y sesi[oó]n((?:\s+[\d,\s]+?)+)$", t88, re.M)
    cols = re.findall(r"\d+,\s?\d+", m.group(1))
    cine_1986_pts = float(cols[-1].replace(" ", "").replace(",", "."))
    t08 = pdf("ine_anuario2008_cultura.pdf")
    fila = re.search(r"GASTO MEDIO POR ESPECTADOR \(€\)\s+(.+)", t08).group(1)
    v08 = [float(x.replace(",", ".")) for x in fila.split()]          # 2000…2007
    cine_2006 = v08[6]
    t20 = pdf("ine_anuario2020_cultura.pdf")
    bloque = t20.split("GASTO MEDIO (euros)", 1)[1]
    v20 = [float(x.replace(",", ".")) for x in re.search(r"Por espectador\s+(.+)", bloque).group(1).split()]   # 2011…2018
    cine_2016, cine_2018 = v20[5], v20[7]
    tac = pdf("mcu_anuario_estadisticas_culturales_2025.pdf")
    bloque = tac.split("GASTO MEDIO POR ESPECTADOR", 1)[1]
    tot = re.search(r"\nTOTAL\s+([\d,]+)\s+([\d,]+)", bloque)
    cine_2023, cine_2024 = (float(tot.group(i).replace(",", ".")) for i in (1, 2))
    # Salario por hora: 1986 Encuesta de Salarios (de T3); 2016 y 2024 EAES
    hora_1986 = json.loads((CLEAN / "t3_vivienda.json").read_text(encoding="utf-8"))["hace_40_anos"]["sueldo_1986"]["retribucion_hora_pts"]
    eaes = {str(p["Anyo"]): p["Valor"] for s in json.loads((RAW / "ine_30046_eaes_salario_por_hora.json").read_text(encoding="utf-8"))
            if s.get("COD") == "EAES2013" for p in s["Data"]}
    minutos = {"1986": round(60 * cine_1986_pts / hora_1986, 1), "2016": round(60 * cine_2016 / eaes["2016"], 1),
               "2024": round(60 * cine_2024 / eaes["2024"], 1)}
    # Discos: gasto medio por hogar (EPF, euros corrientes)
    def serie(fichero, etiqueta, filtro):
        for s in json.loads((RAW / fichero).read_text(encoding="utf-8")):
            if s["Nombre"].startswith(etiqueta) or f"Total Nacional. {etiqueta}." in s["Nombre"]:
                if filtro in s["Nombre"]:
                    return {str(p["Anyo"]): p["Valor"] for p in s["Data"] if p["Valor"] is not None}
        raise SystemExit(f"no encuentro «{etiqueta}»")
    soportes = serie("ine_10630_epf2006_5digitos.json", "Soporte para el registro de imagen, sonido y datos", "Gasto medio por hogar")
    instrumentos = serie("ine_10630_epf2006_5digitos.json", "Instrumentos musicales", "Gasto medio por hogar")
    culturales = serie("ine_73781_epf_5digitos.json", "Bienes culturales (instrumentos musicales, CD's, DVD's, descarga de contenido audiovisual...)",
                       "Gasto total. Gasto medio por hogar")
    espect06 = serie("ine_10630_epf2006_5digitos.json", "Bailes, cines, teatros y espectáculos", "Gasto medio por hogar")
    espect25 = serie("ine_73781_epf_5digitos.json", "Cines, teatros y espectáculos", "Gasto total. Gasto medio por hogar")
    # Conciertos y cine: % que asistió en el último año (Encuesta de Hábitos y Prácticas Culturales, tabla 9.1)
    t91 = tac.split("9.1. Personas que realizaron o suelen realizar actividades culturales", 2)[2] if tac.count("9.1. Personas que realizaron") > 1 else tac.split("9.1. Personas que realizaron", 1)[1]
    def ehpc(etiqueta):
        v = re.search(re.escape(etiqueta) + r"\s+([\d,]+)\s+([\d,]+)\s+([\d,]+)\s+([\d,]+)\s+([\d,]+)", t91)
        return dict(zip(("2011", "2015", "2019", "2022", "2025"), (float(x.replace(",", ".")) for x in v.groups())))
    return {
        "cine_gasto_medio_espectador": {"1986_pts": cine_1986_pts, "2006_eur": cine_2006, "2016_eur": cine_2016, "2018_eur": cine_2018,
                                        "2023_eur": cine_2023, "2024_eur": cine_2024},
        "salario_hora": {"1986_pts": hora_1986, "2016_eur": eaes["2016"], "2024_eur": eaes["2024"]},
        "cine_minutos_de_trabajo": minutos,
        "discos_gasto_hogar_eur": {"soportes_imagen_sonido_2006": soportes["2006"], "soportes_imagen_sonido_2015": soportes["2015"],
                                   "instrumentos_2006": instrumentos["2006"],
                                   "bienes_culturales_2016": culturales["2016"], "bienes_culturales_2019": culturales["2019"],
                                   "bienes_culturales_2025": culturales["2025"]},
        "espectaculos_gasto_hogar_eur": {"2006": espect06["2006"], "2015": espect06["2015"], "2016": espect25["2016"], "2025": espect25["2025"]},
        "asistieron_ultimo_ano_pct": {"conciertos_musica_actual": ehpc("Conciertos de música actual"), "cine": ehpc("CINE (Asistieron)")},
        "nota": ("Cine: gasto medio por espectador (recaudación / espectadores), Ministerio de Cultura vía Anuarios del INE (1988, 2008, 2020) "
                 "y Anuario de Estadísticas Culturales 2025. Minutos = precio / salario medio bruto por hora × 60 (C); 1986: Encuesta de Salarios "
                 "(industria y servicios), 2016 y 2024: Encuesta Anual de Estructura Salarial; son encuestas distintas, la comparación es aproximada. "
                 "Discos: EPF, gasto medio por hogar en euros corrientes; 2006-2015 «soportes de imagen, sonido y datos» (CD, DVD y cintas, grabados o vírgenes); "
                 "desde 2016 «bienes culturales», que además incluye instrumentos y descargas. Conciertos: % de personas de 15 años o más que fueron en el último año "
                 "(2022, año COVID, no se usa)."),
    }


def main():
    sub25 = epf("ine_73779_epf_subgrupos.json", "Dato base. Gasto total. Distribución porcentual", "2025")
    sub06 = epf("ine_10628_epf2006_subgrupos.json", "Distribución porcentual. Dato base", "2006")
    g86 = ecpf_1986()
    reparto = {
        "ropa_calzado": {"1986": g86["ropa_calzado"], "2006": round(sub06["Artículos de vestir"] + sub06["Calzado"], 2),
                         "2025": round(sub25["Artículos de vestir"] + sub25["Calzado"], 2)},
        "cuidado_personal_y_complementos": {"1986": g86["cuidado_personal_y_complementos"],
                                            "2006": round(sub06["Cuidados personales"] + sub06["Efectos personales no declarados anteriormente"], 2),
                                            "2025": round(sub25["Cuidados personales"] + sub25["Efectos personales no declarados anteriormente"], 2)},
        "restaurantes_cafes_y_alojamiento": {"1986": g86["restaurantes_cafes_hoteles"], "2006": round(sub06["Comidas y bebidas fuera del hogar"] + sub06["Servicios de alojamiento"], 2),
                                             "2025": round(sub25["Restauración"] + sub25["Servicios de alojamiento"], 2)},
        "telefono_internet": {"1986": g86["comunicaciones"], "2006": round(sub06["Servicios postales"] + sub06["Equipos de teléfono y fax"] + sub06["Servicios de teléfono, telégrafo y fax"], 2),
                              "2025": round(sub25["Equipos de información y de comunicaciones y software"] + sub25["Servicios de información y comunicaciones"], 2)},
        "servicios_recreativos_deportivos_culturales": {"1986": g86["esparcimiento_espectaculos_cultura"], "2006": sub06["Servicios recreativos y culturales"],
                                                        "2025": round(sub25["Servicios recreativos y deportivos y juegos de azar"] + sub25["Servicios culturales"], 2)},
    }
    out = {
        "tema": "T7 — consumo hace 40 años, hace 20 y hoy: servicios, ropa y belleza",
        "reparto_gasto_pct": reparto,
        "ipc_variacion_real_pct": ipc_real(),
        "compras_internet_pct": {"ultimos_3_meses": {**{k: v for k, v in eurostat("eurostat_isoc_ec_ibuy_es.json", "I_BUY3").items() if k in ("2006", "2016", "2019")},
                                                     **{k: v for k, v in eurostat("eurostat_isoc_ec_ib20_es.json", "I_BUY3").items() if k in ("2023", "2024", "2025")}},
                                 "ropa": {**{k: v for k, v in eurostat("eurostat_isoc_ec_ibuy_es.json", "I_BCLOT").items() if k in ("2006", "2016", "2019")},
                                          **{k: v for k, v in eurostat("eurostat_isoc_ec_ibgs_es.json", "I_BCLOT1").items() if k in ("2023", "2024")}},
                                 "comida_a_domicilio_restaurantes": {k: v for k, v in eurostat("eurostat_isoc_ec_ibgs_es.json", "I_BFDR").items() if k in ("2023", "2024")},
                                 "suscripcion_series_peliculas": {k: v for k, v in eurostat("eurostat_isoc_ec_ibgs_es.json", "I_BFLMS2").items() if k in ("2024", "2025")},
                                 "suscripcion_musica": {k: v for k, v in eurostat("eurostat_isoc_ec_ibgs_es.json", "I_BMUSS2").items() if k in ("2024", "2025")}},
        "deporte": deporte(),
        "musica_cine": musica_cine(),
        "nota": "Reparto del gasto total de los hogares (con alquiler imputado), en % (= € de cada 100). 1986: 8.1 «cuidados y efectos personales» y 8.3 «restaurantes, cafés y hoteles» del Anuario de 1989; la clasificación ha cambiado, la comparación es aproximada. Compras por internet: % de personas de 16 a 74 años en los últimos 3 meses; la serie de ropa cambia de definición en 2020.",
    }
    (CLEAN / "t7_consumo.json").write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding="utf-8")
    print(json.dumps(out, ensure_ascii=False, indent=1))


if __name__ == "__main__":
    main()
