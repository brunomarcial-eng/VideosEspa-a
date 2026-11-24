#!/usr/bin/env python3
"""Datos limpios de T22: la pensión media de jubilación frente al sueldo de un joven (Bruno, 24-11-2026).

  · Pensión media de jubilación del sistema de la Seguridad Social (€/mes, 14 pagas, en bruto):
      2007, 2013, 2016 y 2018: medias anuales del INE, Anuario Estadístico de España (tabla 7.3.5, con datos del
      Ministerio de Trabajo y Seguridad Social): ediciones 2009, 2015 y 2020 (V).
      Hoy (2024): Seguridad Social, pensiones en vigor a 31 de diciembre de 2024 (serie S_Total del fichero de octubre
      de 2026) (V). Es el dato de diciembre, no la media del año (la media sería un 0,7 % menor).
  · Sueldo de un joven: salario medio bruto anual de 25 a 34 años (INE, Encuesta Anual de Estructura Salarial,
    tabla 28201) de 2013, 2016, 2018 y 2024 (V; 2024 es el último año publicado). 2007 no existe (la EAES empieza en
    2008): EAES 2008 × ETCL 2007/2008 (12.713/13.33), como en T1 (C).
  · IPC general, media anual (INE, tabla 24077), para pasar a euros de hoy (C).
  · Años: 2007 (antes de la crisis), 2013 (la crisis), 2016, 2018 y hoy (2024, el último año de la EAES).
"""
import json
import pathlib
import re
import statistics
import subprocess

RAIZ = pathlib.Path(__file__).resolve().parent.parent
CLEAN, RAW = RAIZ / "data" / "clean", RAIZ / "data" / "raw"
ANOS = ("2007", "2013", "2016", "2018", "2024")
ETCL_2007_2008 = 12.713 / 13.33          # T1 (data/clean/t1_cesta_horas.json, nota del salario de 2007)


def anuario(pdf):
    """Pensión media de jubilación (total del sistema) por año en la tabla 7.3.5 de un Anuario del INE."""
    txt = subprocess.run(["pdftotext", "-layout", str(pdf), "-"], capture_output=True, text=True, check=True).stdout
    i = txt.index("pensión media según régimen y clase. Medias anuales")
    bloque = txt[i:i + 3000].splitlines()
    anos = next(re.findall(r"\b(20\d\d)\b", l) for l in bloque if len(re.findall(r"\b20\d\d\b", l)) >= 3)
    jub = next(l for l in bloque if l.strip().startswith("Jubilación"))
    nums = [float(x.replace(".", "").replace(",", ".")) for x in re.findall(r"\d[\d.]*,\d+", jub)]
    return {a: nums[2 * k + 1] for k, a in enumerate(anos)}


def main():
    pension = {}
    for ed in (2009, 2015, 2020):
        pension.update(anuario(RAW / "t22" / f"ine_anuario{ed}_cap07_condiciones_vida.pdf"))
    import openpyxl
    ws = openpyxl.load_workbook(RAW / "t22" / "ss_S202610_series.xlsx", read_only=True, data_only=True)["S_Total"]
    dic = {}
    for r in ws.iter_rows(values_only=True):   # la primera tabla de la hoja (importes); debajo vienen las variaciones
        if isinstance(r[0], int) and "diciembre" in str(r[1]):
            dic.setdefault(str(r[0]), r[10])
    pension["2024"] = dic["2024"]
    pension["2025"] = dic["2025"]

    eaes = json.loads((RAW / "t22" / "ine_28201_eaes_sexo_edad.json").read_text(encoding="utf-8"))
    serie = next(s for s in eaes if s["Nombre"].startswith("Ambos sexos. De 25 a 34 años. Dato base. Total Nacional"))
    joven = {str(x["Anyo"]): x["Valor"] for x in serie["Data"]}
    joven["2007"] = joven["2008"] * ETCL_2007_2008

    ipc_s = json.loads((RAW / "ine_24077_ipc_desde_1961.json").read_text(encoding="utf-8"))[0]["Data"]
    por = {}
    for x in ipc_s:
        por.setdefault(str(x["Anyo"]), []).append(x["Valor"])
    ipc = {a: statistics.mean(v) for a, v in por.items() if len(v) == 12}

    filas = {}
    for a in ANOS:
        p_anual = pension[a] * 14
        filas[a] = {
            "pension_mes": round(pension[a], 2), "pension_anual": round(p_anual), "estado_pension": "V",
            "joven_anual": round(joven[a]), "joven_mes_14": round(joven[a] / 14), "estado_joven": "C" if a == "2007" else "V",
            "pension_sobre_joven_pct": round(100 * p_anual / joven[a], 1),
            "joven_cobra_mas_pct": round(100 * (joven[a] / p_anual - 1), 1),
            "ipc": round(ipc[a], 3),
            "pension_mes_euros_2024": round(pension[a] * ipc["2024"] / ipc[a]),
            "joven_anual_euros_2024": round(joven[a] * ipc["2024"] / ipc[a]),
        }
    v, h = filas["2007"], filas["2024"]
    out = {
        "tema": "La pensión media de jubilación frente al sueldo de un joven de 25 a 34 años: 2007, 2013, 2016, 2018 y hoy",
        "nota": "En bruto. Pensión en 14 pagas; sueldo anual de la EAES (con pagas extra). «Hoy» = 2024, último año de la EAES; la pensión de 2024 es la de diciembre.",
        "filas": filas,
        "desde_2007": {
            "pension_sube_pct": round(100 * (h["pension_mes"] / v["pension_mes"] - 1), 1),
            "joven_sube_pct": round(100 * (h["joven_anual"] / v["joven_anual"] - 1), 1),
            "precios_suben_pct": round(100 * (ipc["2024"] / ipc["2007"] - 1), 1),
            "pension_real_pct": round(100 * (h["pension_mes"] / v["pension_mes_euros_2024"] - 1), 1),
            "joven_real_pct": round(100 * (h["joven_anual"] / v["joven_anual_euros_2024"] - 1), 1),
        },
        "pension_dic_2025": round(pension["2025"], 2),
    }
    CLEAN.mkdir(parents=True, exist_ok=True)
    (CLEAN / "t22_pension_joven.json").write_text(json.dumps(out, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    for a, x in filas.items():
        print(a, x)
    print(out["desde_2007"])


if __name__ == "__main__":
    main()
