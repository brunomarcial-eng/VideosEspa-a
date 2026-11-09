#!/usr/bin/env python3
"""Descarga los ficheros crudos oficiales de los temas T1 y T2 a data/raw/.

Cada descarga queda registrada en data/raw/MANIFEST.csv con el enlace, la
fecha de consulta y la huella SHA-256, para poder demostrar de dónde sale cada
cifra si hay una apelación.

Uso: python3 scripts/descargar_datos.py
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
    for fichero, url, desc, web in DESCARGAS:
        try:
            datos = bajar(url)
            json.loads(datos)  # comprobar que es JSON válido
        except Exception as e:  # noqa: BLE001
            print(f"ERROR {fichero}: {e}", file=sys.stderr)
            errores += 1
            continue
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
