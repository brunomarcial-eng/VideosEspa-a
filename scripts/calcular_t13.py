#!/usr/bin/env python3
"""Datos limpios de T13: infraestructuras y transporte, 2016 frente a hoy. Lo que pagamos frente al servicio que recibimos.

Todo oficial:
  · Impuestos y cotizaciones recaudados (Eurostat gov_10a_taxag), en euros de 2025 (IPC del INE) y por habitante (INE).
  · Gasto público en transporte (Eurostat COFOG GF0405), en euros de 2025 y por habitante. Último año: 2024.
  · Inversión en infraestructuras ferroviarias (OCDE/ITF), en euros de 2025. Último año: 2024.
  · Avión: retraso ATFM en ruta en el espacio aéreo español (EUROCONTROL, Performance Review Unit), enero-octubre
    de 2016 frente a enero-octubre de 2026 (mismo periodo, último mes completo).
  · Tren: puntualidad de los trenes de larga distancia por las líneas de alta velocidad (CNMC, con datos de Adif AV).
    No hay serie oficial pública de puntualidad desde 2016 con la misma definición: la CNMC la da para 2019 y 2024.
    Y la caída de viajeros del primer trimestre de 2026 (CNMC).

Uso: python3 scripts/calcular_t13.py → data/clean/t13_infraestructuras.json
     (también escribe data/raw/eurocontrol_atfm_en_ruta_espana.csv, el extracto de España del Excel de EUROCONTROL)
"""
import collections
import csv
import json
import pathlib
import re
import sys

import openpyxl

RAIZ = pathlib.Path(__file__).resolve().parent.parent
RAW, CLEAN = RAIZ / "data" / "raw", RAIZ / "data" / "clean"
sys.path.insert(0, str(RAIZ / "scripts"))
import calcular_t8 as T8  # noqa: E402
from calcular_t9 import eurostat_valor  # noqa: E402
from calcular_t11 import ipc_anual_desde_2002, pdf_texto, poblacion  # noqa: E402

CAUSAS = {"C": "capacidad del control aéreo", "S": "personal del control aéreo", "W": "meteorología", "I": "huelga del control aéreo",
          "T": "fallo de equipos del control", "O": "otras", "G": "aeropuerto", "E": "equipos del aeropuerto", "A": "accidente",
          "D": "eventos y desvíos", "M": "espacio aéreo militar", "N": "huelga ajena al control", "P": "evento especial",
          "R": "capacidad del aeropuerto", "V": "medio ambiente", "NA": "sin causa"}


def eurocontrol_espana():
    """Extracto diario de España del Excel de EUROCONTROL (hoja DATA); lo guarda en data/raw como CSV pequeño."""
    wb = openpyxl.load_workbook(RAW / "microdatos" / "eurocontrol_en_route_atfm_delay_fir.xlsx", read_only=True)
    filas = wb["DATA"].iter_rows(values_only=True)
    cab = next(filas)
    i = {k: n for n, k in enumerate(cab)}
    es = [f for f in filas if f[i["ENTITY_NAME"]] == "Spain"]
    with (RAW / "eurocontrol_atfm_en_ruta_espana.csv").open("w", newline="", encoding="utf-8") as fh:
        w = csv.writer(fh)
        w.writerow(cab)
        for f in es:
            w.writerow([x.date().isoformat() if hasattr(x, "date") else x for x in f])
    return cab, es


def suma(cab, filas, anyo, meses):
    i = {k: n for n, k in enumerate(cab)}
    a = collections.Counter()
    dias = 0
    for f in filas:
        if f[i["YEAR"]] == str(anyo) and f[i["MONTH_NUM"]] in meses:
            dias += 1
            for k in cab[6:-1]:
                a[k] += f[i[k]] or 0
    return a, dias


def itf(medida, modo, base, anyo):
    for f in csv.DictReader((RAW / "itf_inversion_infraestructuras_es.csv").read_text(encoding="utf-8-sig").splitlines()):
        if (f["MEASURE"], f["TRANSPORT_MODE"], f["PRICE_BASE"], f["UNIT_MEASURE"], f["TIME_PERIOD"]) == (medida, modo, base, "EUR", str(anyo)):
            return float(f["OBS_VALUE"])
    raise SystemExit(f"ITF sin {medida} {modo} {anyo}")


def main():
    ipc = T8.ipc_largo()                      # media anual, 2025 = 100
    real = lambda v, a, b="2025": v * ipc[b] / ipc[a]
    pct = lambda a, b: round(100 * (b / a - 1), 1)
    pob = {a: poblacion(a) for a in (2016, 2024, 2025)}

    # 1. Lo que pagamos (igual que en T11 y T12)
    imp = {a: eurostat_valor("eurostat_gov_10a_taxag_total_es.json", unit="MIO_EUR", time=str(a)) for a in range(2002, 2026)}
    ia = ipc_anual_desde_2002()
    serie_real = {a: imp[a] * ia[2025] / ia[a] for a in ia}
    pagamos = {
        "por_habitante_eur_de_2025": {"2016": round(real(imp[2016], "2016") * 1e6 / pob[2016]), "2025": round(imp[2025] * 1e6 / pob[2025])},
        "recaudacion_real_maxima_desde_2002": max(serie_real, key=serie_real.get),
    }
    pagamos["por_habitante_sube_real_pct"] = pct(*pagamos["por_habitante_eur_de_2025"].values())

    # 2. Lo que se gasta en transporte (Eurostat COFOG GF0405, todas las administraciones)
    gt = {a: eurostat_valor("eurostat_gov_10a_exp_cofog_es.json", unit="MIO_EUR", cofog99="GF0405", time=str(a)) for a in (2016, 2024)}
    gasto = {
        "mill_eur": {"2016": gt[2016], "2024": gt[2024]},
        "por_habitante_eur_de_2025": {"2016": round(real(gt[2016], "2016") * 1e6 / pob[2016]), "2024": round(real(gt[2024], "2024") * 1e6 / pob[2024])},
    }
    gasto["por_habitante_sube_real_pct"] = pct(*gasto["por_habitante_eur_de_2025"].values())

    # 3. Inversión en vías de tren (OCDE/ITF), en euros de 2025 con el IPC del INE; y a precios constantes del ITF, de contraste
    vias = {a: itf("INV", "RAIL", "V", a) for a in (2016, 2024)}
    inversion_tren = {
        "mill_eur": {str(a): round(v / 1e6) for a, v in vias.items()},
        "mill_eur_de_2025": {str(a): round(real(v, str(a)) / 1e6) for a, v in vias.items()},
        "precios_constantes_itf_mill_eur": {str(a): round(itf("INV", "RAIL", "Q", a) / 1e6) for a in (2016, 2024)},
    }
    inversion_tren["veces_real"] = round(inversion_tren["mill_eur_de_2025"]["2024"] / inversion_tren["mill_eur_de_2025"]["2016"], 2)
    inversion_tren["veces_precios_constantes_itf"] = round(
        inversion_tren["precios_constantes_itf_mill_eur"]["2024"] / inversion_tren["precios_constantes_itf_mill_eur"]["2016"], 2)

    # 4. Avión: retraso ATFM en ruta, espacio aéreo español, enero-octubre (último mes completo de 2026)
    cab, es = eurocontrol_espana()
    ene_oct = range(1, 11)
    avion = {"periodo": "enero-octubre"}
    for a in (2016, 2019, 2025, 2026):
        s, dias = suma(cab, es, a, ene_oct)
        avion[str(a)] = {
            "dias": dias,
            "vuelos": s["FLT_ERT_1"],
            "vuelos_con_retraso": s["FLT_ERT_1_DLY"],
            "vuelos_con_mas_de_15_min": s["FLT_ERT_1_DLY_15"],
            "minutos_de_retraso": s["DLY_ERT_1"],
            "pct_vuelos_con_retraso": round(100 * s["FLT_ERT_1_DLY"] / s["FLT_ERT_1"], 2),
            "minutos_por_vuelo": round(s["DLY_ERT_1"] / s["FLT_ERT_1"], 3),
            "causas_pct": {CAUSAS[k[8:-2]]: round(100 * v / s["DLY_ERT_1"], 1) for k, v in s.items()
                           if k.startswith("DLY_ERT_") and k != "DLY_ERT_1" and v and 100 * v / s["DLY_ERT_1"] >= 1},
        }
    assert avion["2016"]["dias"] == 305 and avion["2026"]["dias"] == 304, "faltan días de enero-octubre"
    v16, v26 = avion["2016"], avion["2026"]
    avion["vuelos_sube_pct"] = pct(v16["vuelos"], v26["vuelos"])
    avion["vuelos_con_retraso_veces"] = round(v26["vuelos_con_retraso"] / v16["vuelos_con_retraso"], 1)
    avion["minutos_veces"] = round(v26["minutos_de_retraso"] / v16["minutos_de_retraso"], 1)
    avion["uno_de_cada"] = {a: round(100 / avion[a]["pct_vuelos_con_retraso"]) for a in ("2016", "2026")}

    # 5. Tren: puntualidad (llegar con menos de 5 minutos de retraso, definición del Reglamento 2015/1100), CNMC
    t = re.sub(r"\s+", " ", pdf_texto("cnmc_balance_liberalizacion_ferroviaria_2024.pdf"))
    m1 = re.search(r"ancho variable\d*, en las que circularon ([\d.]+) trenes \(el (\d+)% del total.*?la puntualidad se situó en el (\d+)%, "
                   r"([\d,]+) p\.p\. menos que en 2023 y ([\d,]+) p\.p\. menos que en 2019", t)
    m2 = re.search(r"rutas con competencia, en las que circularon ([\d.]+) trenes \(el (\d+)% del total\), la puntualidad fue del ([\d,]+)%, "
                   r"([\d,]+) p\.p\. más que en 2023 y (\d+) p\.p\. menos que en 2019", t)
    m3 = re.search(r"En 2024 los servicios comerciales registraron (\d+) millones de viajeros", t)
    if not (m1 and m2 and m3):
        raise SystemExit("CNMC: no encuentro las frases de puntualidad")
    n = lambda s: float(s.replace(",", "."))
    tren = {
        "definicion": "llega con menos de 5 minutos de retraso (Reglamento (UE) 2015/1100)",
        "rutas_ancho_variable": {
            "rutas": "Madrid-Vigo/A Coruña, Madrid-Gijón, Madrid-Santander, Madrid-Cádiz/Huelva y Barcelona-Valencia",
            "trenes_2024": int(m1.group(1).replace(".", "")), "pct_de_los_trenes_de_alta_velocidad": int(m1.group(2)),
            "puntualidad_pct": {"2019": round(n(m1.group(3)) + n(m1.group(5)), 1), "2024": n(m1.group(3))},
        },
        "rutas_con_competencia": {
            "rutas": "Madrid-Barcelona, Madrid-Valencia, Madrid-Sevilla, Madrid-Málaga y Madrid-Alicante",
            "trenes_2024": int(m2.group(1).replace(".", "")), "pct_de_los_trenes_de_alta_velocidad": int(m2.group(2)),
            "puntualidad_pct": {"2019": round(n(m2.group(3)) + n(m2.group(5)), 1), "2024": n(m2.group(3))},
        },
        "viajeros_comerciales_2024_millones": int(m3.group(1)),
    }
    t26 = re.sub(r"\s+", " ", pdf_texto("cnmc_ferroviario_viajeros_1t2026.pdf"))
    m4 = re.search(r"Las plazas ofertadas han caído un (\d+) ?% interanual en la Larga Distancia en Alta Velocidad.*?"
                   r"En LD AV el número de viajeros muestra una caída interanual del (\d+) ?%", t26)
    if not (m4 and "PRIMER TRIMESTRE 2026" in t26 and "Los cortes de vía" in t26 and "8,05 M" in t26):
        raise SystemExit("CNMC 1T 2026: no encuentro las frases")
    tren["primer_trimestre_2026"] = {"viajeros_alta_velocidad_millones": 8.05, "viajeros_baja_pct": -int(m4.group(2)),
                                     "plazas_baja_pct": -int(m4.group(1)),
                                     "la_cnmc_dice": "Los cortes de vía, las limitaciones de velocidad y la reducción de circulaciones "
                                                     "han condicionado la prestación de los servicios."}

    out = {
        "tema": "Infraestructuras y transporte: 2016 frente a hoy",
        "nota": "Euros de 2025 con el IPC medio anual del INE. Avión: mismo periodo (enero-octubre) de 2016 y de 2026. "
                "Tren: la CNMC da la puntualidad de 2019 y de 2024; no hay serie oficial comparable desde 2016.",
        "pagamos": pagamos,
        "gasto_transporte": gasto,
        "inversion_vias_tren": inversion_tren,
        "avion_retraso_atfm_en_ruta": avion,
        "tren": tren,
    }
    CLEAN.mkdir(parents=True, exist_ok=True)
    (CLEAN / "t13_infraestructuras.json").write_text(json.dumps(out, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    print(json.dumps(out, ensure_ascii=False, indent=1))


if __name__ == "__main__":
    main()
