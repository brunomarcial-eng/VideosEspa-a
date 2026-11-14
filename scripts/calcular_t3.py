#!/usr/bin/env python3
"""Datos limpios de T3: comprar casa y coste de la vida, 2006 frente a hoy (y 2016 de control).

Lee solo ficheros de data/raw/ (bajados con descargar_datos.py) y escribe data/clean/t3_vivienda.json.
Estados: V = leído en la fuente oficial · C = cálculo propio (con su fórmula en el JSON).

Sueldos de 2006 y 2022: microdatos de la Encuesta Cuatrienal de Estructura Salarial del INE, con el
método que publica el INE para la ganancia anual (salario bruto anual + especie, elevado a año completo
con los días pagados). Con ese método, la media y la mediana de 2022 coinciden con las tablas del INE.
El «sueldo más frecuente» (moda) es la cumbre del histograma ponderado, suavizado con una campana de
1.000 € (se dan también las de 500 y 1.500 € para ver lo que se mueve).

Uso: python3 scripts/calcular_t3.py
"""
import csv
import io
import json
import pathlib
import re
import zipfile
from collections import defaultdict

import numpy as np

RAIZ = pathlib.Path(__file__).resolve().parent.parent
RAW = RAIZ / "data" / "raw"
CLEAN = RAIZ / "data" / "clean"
M2 = 90            # vivienda tipo (supuesto)
ENTRADA = 0.20     # parte del precio que no financia el banco (préstamo del 80 %)
GASTOS = 0.10      # impuestos y gastos de compra (supuesto: entre el 8 y el 12 % según la comunidad)


def r(x, n=2):
    return None if x is None else round(float(x), n)


# ------------------------------------------------------------------ sueldos (microdatos EES)
def leer_zip(fichero, nombre):
    with zipfile.ZipFile(RAW / "microdatos" / fichero) as z:
        miembro = next(m for m in z.namelist() if m.endswith(nombre))
        texto = z.read(miembro).decode("latin-1")
    return list(csv.DictReader(io.StringIO(texto), delimiter="\t"))


def num(filas, col):
    out = np.zeros(len(filas))
    for i, f in enumerate(filas):
        try:
            out[i] = float((f.get(col) or "0").strip() or 0)
        except ValueError:
            out[i] = 0
    return out


def cuantil(x, w, q):
    i = np.argsort(x)
    c = np.cumsum(w[i]) / w.sum()
    return float(np.interp(q, c, x[i]))


def moda(x, w, bw=1000, paso=50, lo=3000, hi=80000):
    g = np.arange(lo, hi, paso)
    h, _ = np.histogram(x, bins=np.append(g, hi), weights=w)
    k = np.exp(-0.5 * (np.arange(-4 * bw, 4 * bw + paso, paso) / bw) ** 2)
    s = np.convolve(h, k / k.sum(), mode="same")
    return float(g[np.argmax(s)] + paso / 2)


def resumen(sal, w):
    return {"media": r(np.average(sal, weights=w), 0), "mediana": r(cuantil(sal, w, 0.5), 0),
            "moda": r(moda(sal, w), 0), "moda_bw500": r(moda(sal, w, bw=500), 0), "moda_bw1500": r(moda(sal, w, bw=1500), 0),
            "trabajadores_millones": r(w.sum() / 1e6, 2), "registros": int(len(sal))}


def sueldos():
    f6 = leer_zip("ees_cuatrienal_2006.zip", "EES_cuatrienal_2006.csv")
    dias = num(f6, "MESCOMA") * 30.42 + num(f6, "DIACOMA")
    dias = np.where(dias <= 0, 365, np.minimum(dias, 365))
    s06 = (365 / dias) * (num(f6, "SALBRUTO") + num(f6, "VESP"))
    f22 = leer_zip("ees_cuatrienal_2022.zip", "EES_2022.tab")
    dias = np.minimum(num(f22, "DRELABAM") * 30.42 + num(f22, "DRELABAD"), 365) - num(f22, "DSIESPA2") - num(f22, "DSIESPA4")
    dias = np.where(dias <= 0, 365, dias)
    s22 = (365 / dias) * (num(f22, "RETRINOIN") + num(f22, "RETRIIN") + num(f22, "VESPNOIN") + num(f22, "VESPIN"))
    return {"2006": resumen(s06, num(f6, "FACTOTAL")), "2022": resumen(s22, num(f22, "FACTOTAL")),
            "metodo": "ganancia anual = (365 / días pagados) × (salario bruto anual + especie); ponderado con FACTOTAL",
            "estado": "C (cálculo propio con microdatos oficiales del INE)"}


def eaes():
    d = json.loads((RAW / "ine_28191_eaes_medias_percentiles.json").read_text(encoding="utf-8"))
    out = {}
    for s in d:
        n = s["Nombre"]
        if n.startswith("Ambos sexos. Total Nacional. Dato base."):
            k = n.split(".")[3].strip().lower()
            out[k] = {str(p["Anyo"]): p["Valor"] for p in s["Data"] if p["Valor"] is not None}
    return out


# ------------------------------------------------------------------ IPC
def ipc():
    d = json.loads((RAW / "ine_76125_ipc_grupos.json").read_text(encoding="utf-8"))
    s = next(x for x in d if x["Nombre"].startswith("Nacional. Índice general. Índice"))
    acc = defaultdict(list)
    for p in s["Data"]:
        if p["Valor"] is not None:
            acc[p["Anyo"]].append(p["Valor"])
    return {str(a): {"media": r(sum(v) / len(v), 3), "meses": len(v)} for a, v in acc.items()}


# ------------------------------------------------------------------ Banco de España
def bde():
    filas = list(csv.reader((RAW / "bde_si_1_5_vivienda.csv").read_text(encoding="latin-1").splitlines()))
    desc = filas[3]
    datos = [f for f in filas[6:] if f and re.match(r"[A-Z]{3} \d{4}$", f[0].strip())]
    def serie(texto):
        j = next(i for i, t in enumerate(desc) if texto in t)
        out = defaultdict(list)
        for f in datos:
            v = f[j].strip()
            if v and v != "_":
                out[f[0].strip()[-4:]].append((f[0].strip()[:3], float(v)))
        return desc[j].strip(), out
    claves = {
        "precio_m2_tasado": "Precio medio m2 de viviendas libres tasadas. Total nacional",
        "precio_renta_hogar_anos": "Precio de la vivienda/renta bruta por hogar",
        "esfuerzo_teorico_pct": "Esfuerzo teórico anual sin deducciones",
        "tipo_prestamos_vivienda_pct": "Tipo de los préstamos libres para adquisición de vivienda de hogares",
        "plazo_hipotecas_meses": "Plazo medio de las hipotecas. Meses",
        "pct_prestamos_rpv_mas_80": "Porcentaje de préstamos con RPV>80%",
        "tenencia_propiedad_pct": "Régimen de tenencia de la vivienda principal. Propiedad",
        "tenencia_alquiler_pct": "Régimen de tenencia de la vivienda principal. Alquiler",
    }
    out = {}
    for k, texto in claves.items():
        nombre, s = serie(texto)
        out[k] = {"serie": nombre, "por_anyo": {a: {"media": r(sum(v for _, v in s[a]) / len(s[a]), 2), "n": len(s[a]),
                                                     "ultimo": f"{s[a][-1][0]} {a}: {s[a][-1][1]}"} for a in sorted(s) if a >= "2005"}}
    return out


# ------------------------------------------------------------------ EPA hogares, EPF, Eurostat
def hogares():
    d = json.loads((RAW / "ine_65270_epa_hogares_ocupados.json").read_text(encoding="utf-8"))
    V = {}
    for s in d:
        p = [x.strip() for x in s["Nombre"].split(".") if x.strip()]
        if p[1] == "Total Nacional" and p[3] == "Total":
            V[p[4]] = {(x["Anyo"], x.get("T3_Periodo")): x["Valor"] for x in s["Data"] if x["Valor"] is not None}
    out = {}
    for a in (2006, 2016, 2026):
        k = (a, "T3")
        tot, o0, o1 = V["Total"][k], V["0"][k], V["1"][k]
        o2 = tot - o0 - o1
        out[f"{a}T3"] = {"hogares_miles": r(tot, 1), "sin_ocupados_miles": r(o0, 1), "un_ocupado_miles": r(o1, 1),
                         "dos_o_mas_ocupados_miles": r(o2, 1), "pct_dos_o_mas_entre_hogares_con_ocupados": r(100 * o2 / (tot - o0), 1),
                         "pct_un_ocupado_entre_hogares_con_ocupados": r(100 * o1 / (tot - o0), 1)}
    return out


def epf():
    def tabla(fichero, filtro):
        d = json.loads((RAW / fichero).read_text(encoding="utf-8"))
        return {s["Nombre"]: {p["Anyo"]: p["Valor"] for p in s["Data"] if p["Valor"] is not None} for s in d if filtro(s["Nombre"])}
    a = tabla("ine_10627_epf2006_grupos.json", lambda n: "Dato base" in n and "Gasto medio por hogar" in n)
    b = tabla("ine_73778_epf_gasto_grupos.json", lambda n: "Dato base. Gasto monetario. Gasto medio por hogar" in n)
    def g(t, texto, anyo):
        return next(v[anyo] for n, v in t.items() if texto in n)
    ocio06 = {"ocio_cultura": g(a, "Grupo 9.", 2006), "restaurantes_hoteles": g(a, "Grupo 11.", 2006), "comunicaciones": g(a, "Grupo 8.", 2006)}
    ocio25 = {"ocio_cultura": g(b, "Actividades recreativas", 2025), "restaurantes_hoteles": g(b, "Restaurantes y servicios", 2025),
              "comunicaciones": g(b, "Información y comunicaciones", 2025)}
    tot06, tot25 = g(a, "Total. Gasto medio por hogar", 2006), g(b, "Índice general", 2025)
    return {"2006": {"gasto_monetario_hogar": tot06, **ocio06, "suma_ocio": r(sum(ocio06.values()), 2),
                     "pct_ocio_sobre_gasto": r(100 * sum(ocio06.values()) / tot06, 2)},
            "2025": {"gasto_monetario_hogar": tot25, **ocio25, "suma_ocio": r(sum(ocio25.values()), 2),
                     "pct_ocio_sobre_gasto": r(100 * sum(ocio25.values()) / tot25, 2)},
            "nota": "EPF base 2006 (COICOP) y base 2016 (ECOICOP): los grupos no son idénticos. «Ocio» = ocio y cultura + restaurantes y hoteles + comunicaciones. Gasto monetario (sin alquiler imputado)."}


def emancipacion():
    d = json.loads((RAW / "eurostat_yth_demo_030.json").read_text(encoding="utf-8"))
    geo = d["dimension"]["geo"]["category"]["index"]
    tm = {v: k for k, v in d["dimension"]["time"]["category"]["index"].items()}
    nt = len(tm)
    return {g: {tm[i]: d["value"].get(str(gi * nt + i)) for i in range(nt)} for g, gi in geo.items()}


# ------------------------------------------------------------------ cálculos
def main():
    S, E, I, B = sueldos(), eaes(), ipc(), bde()
    def precio(a):
        return B["precio_m2_tasado"]["por_anyo"][a]["media"] * M2
    def deflactor(a, b):
        return I[b]["media"] / I[a]["media"]
    hoy = max(B["precio_m2_tasado"]["por_anyo"])
    calc = {"vivienda_90m2": {a: r(precio(a), 0) for a in ("2006", "2016", "2022", "2024", hoy)},
            "entrada_y_gastos": {a: r(precio(a) * (ENTRADA + GASTOS), 0) for a in ("2006", "2016", "2022", "2024", hoy)}}
    sueldo = {"media": {"2006": S["2006"]["media"], "2022": S["2022"]["media"], "2024": E["media"]["2024"]},
              "mediana": {"2006": S["2006"]["mediana"], "2022": S["2022"]["mediana"], "2024": E["mediana"]["2024"]},
              "moda": {"2006": S["2006"]["moda"], "2022": S["2022"]["moda"]}}
    anos = {}
    for k, v in sueldo.items():
        anos[k] = {a: {"vivienda": r(precio(a) / s, 1), "entrada_y_gastos": r(precio(a) * (ENTRADA + GASTOS) / s, 1)} for a, s in v.items()}
    real = {k: {a: r(100 * (v[a] / (v["2006"] * deflactor("2006", a)) - 1), 1) for a in v if a != "2006"} for k, v in sueldo.items()}
    real["vivienda_90m2"] = {a: r(100 * (precio(a) / (precio("2006") * deflactor("2006", a)) - 1), 1) for a in ("2016", "2024", hoy)}
    O = epf()
    real["ocio_hogar_2006_2025"] = r(100 * (O["2025"]["suma_ocio"] / (O["2006"]["suma_ocio"] * deflactor("2006", "2025")) - 1), 1)
    out = {
        "tema": "T3 — ¿Comprar casa es más difícil hoy que hace 20 años? (2006 frente a hoy; 2016 de control)",
        "supuestos": {"vivienda_m2": M2, "entrada_pct": 100 * ENTRADA, "gastos_compra_pct": 100 * GASTOS},
        "sueldos_ees_microdatos": S, "sueldos_eaes": {k: {a: v.get(a) for a in ("2008", "2016", "2022", "2023", "2024")} for k, v in E.items()},
        "ipc": {a: I[a] for a in ("2006", "2016", "2022", "2024", "2025", "2026")},
        "deflactor_desde_2006": {a: r(deflactor("2006", a), 3) for a in ("2016", "2022", "2024", "2025", "2026")},
        "bde_vivienda": B, "hoy_vivienda": hoy,
        "calculos": {**calc, "sueldo_bruto_anual": sueldo, "anos_de_sueldo_bruto": anos, "variacion_real_pct": real},
        "hogares_epa": hogares(), "gasto_hogares_epf": O, "edad_emancipacion_eurostat": emancipacion(),
    }
    CLEAN.mkdir(parents=True, exist_ok=True)
    (CLEAN / "t3_vivienda.json").write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding="utf-8")
    print("escrito", CLEAN / "t3_vivienda.json")


if __name__ == "__main__":
    main()
