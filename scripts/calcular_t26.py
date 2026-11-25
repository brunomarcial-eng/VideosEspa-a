#!/usr/bin/env python3
"""Datos limpios de T26: ¿somos más ricos o más pobres que los europeos? (Bruno, 24-11-2026: rescatar los temas del
principio; «España frente a Europa», segundo de los cuatro).

  · PIB por habitante en paridad de poder adquisitivo (PPA), índice de volumen, media de la UE-27 = 100 (Eurostat,
    prc_ppp_ind, VI_PPS_EU27_2020_HAB, GDP) (V): cuánto produce cada país por persona, ajustado a lo que cuestan las
    cosas en cada uno. También el consumo individual efectivo por habitante (A01), de contraste (V).
  · Puesto de España entre los 27 (C: ordenando el índice; si hay empate, cuenta como por delante el que tiene el
    mismo índice y aparece antes en la tabla de Eurostat, es decir, el puesto es el peor posible).
  · PIB total a precios corrientes (Eurostat, nama_10_gdp, B1GQ, CP_MEUR) y su puesto (V/C).
  · Años: 2007, 2013 (plena crisis), 2016, 2019 y 2024 (último año completo de prc_ppp_ind; Eurostat da para 2025 el
    mismo 92 en tec00114).

Uso: python3 scripts/calcular_t26.py → data/clean/t26_europa.json
"""
import json
import pathlib

RAIZ = pathlib.Path(__file__).resolve().parent.parent
RAW, CLEAN = RAIZ / "data" / "raw" / "t26", RAIZ / "data" / "clean"
ANOS = ("2007", "2013", "2016", "2019", "2024")
EU27 = ["BE", "BG", "CZ", "DK", "DE", "EE", "IE", "EL", "ES", "FR", "HR", "IT", "CY", "LV", "LT", "LU", "HU", "MT", "NL",
        "AT", "PL", "PT", "RO", "SI", "SK", "FI", "SE"]
NOMBRE = {"ES": "España", "DE": "Alemania", "FR": "Francia", "IT": "Italia", "PT": "Portugal", "PL": "Polonia",
          "CZ": "Chequia", "EL": "Grecia", "CY": "Chipre", "SI": "Eslovenia", "LT": "Lituania", "MT": "Malta"}


def cubo(fichero):
    d = json.loads((RAW / fichero).read_text(encoding="utf-8"))
    ids, size, dims = d["id"], d["size"], d["dimension"]
    idx = {k: dims[k]["category"]["index"] for k in ids}

    def val(**f):
        pos = 0
        for k, n in zip(ids, size):
            pos = pos * n + (idx[k][f[k]] if k in f else 0)
        return d["value"].get(str(pos))
    return val, idx


def main():
    val, idx = cubo("eurostat_prc_ppp_ind_vi_pps_hab.json")
    gval, gidx = cubo("eurostat_nama_10_gdp_cp_meur.json")
    tval, _ = cubo("eurostat_tec00114_pib_pc_pps.json")
    filas = {}
    for a in ANOS:
        fila = {}
        for cat, clave in (("GDP", "pib"), ("A01", "consumo")):
            v = {g: val(ppp_cat=cat, geo=g, time=a) for g in EU27}
            v = {g: x for g, x in v.items() if x is not None}
            orden = sorted(v, key=lambda g: (-v[g], g != "ES"))   # empates: España detrás (peor puesto posible)
            orden = sorted(v, key=lambda g: (-v[g], 0 if g != "ES" else 1))
            fila[clave] = {g: v[g] for g in NOMBRE}
            fila[f"{clave}_puesto_es"] = orden.index("ES") + 1
            fila[f"{clave}_paises"] = len(v)
        filas[a] = fila
    pib_total = {}
    for a in ("2007", "2024", "2025"):
        v = {g: gval(geo=g, time=a) for g in EU27}
        v = {g: x for g, x in v.items() if x is not None}
        orden = sorted(v, key=lambda g: -v[g])
        pib_total[a] = {"puesto_es": orden.index("ES") + 1, "es_meur": v["ES"], "primeros": [(g, round(v[g])) for g in orden[:5]]}
    es = {a: filas[a]["pib"]["ES"] for a in ANOS}
    out = {
        "nota": __doc__.strip().splitlines()[0], "anos": list(ANOS), "hoy": "2024", "filas": filas,
        "es_pib_pc": es, "es_sobre_media_pct": {a: es[a] - 100 for a in ANOS},
        "es_2025_tec00114": tval(geo="ES", time="2025"),
        "cambio_desde_2007": {g: filas["2024"]["pib"][g] - filas["2007"]["pib"][g] for g in NOMBRE},
        "pib_total": pib_total,
        "estado": {"indices": "V (Eurostat)", "puesto": "C (ordenando el índice; empates en contra de España)", "pib_total": "V (Eurostat)"},
    }
    (CLEAN / "t26_europa.json").write_text(json.dumps(out, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    for a in ANOS:
        f = filas[a]
        print(a, "PIB pc", {g: f["pib"][g] for g in ("ES", "DE", "FR", "IT", "PT", "PL", "CZ", "EL")}, "puesto", f["pib_puesto_es"], "| consumo ES", f["consumo"]["ES"], "puesto", f["consumo_puesto_es"])
    print("cambio 2007-2024", out["cambio_desde_2007"]); print("PIB total", pib_total); print("ES 2025 (tec00114)", out["es_2025_tec00114"])


if __name__ == "__main__":
    main()
