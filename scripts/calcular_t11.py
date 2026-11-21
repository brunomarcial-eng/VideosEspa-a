#!/usr/bin/env python3
"""Datos limpios de T11: sanidad, 2016 frente a hoy. Lo que pagamos frente al servicio que recibimos (Bruno, 21-11-2026).

Solo 2016 frente al último dato. Todo oficial:
  · Impuestos y cotizaciones recaudados (Eurostat gov_10a_taxag), en euros de 2025 con el IPC del INE y por habitante (INE).
  · Gasto público en sanidad (Eurostat COFOG GF07), en euros de 2025 y por habitante. Último año: 2024.
  · Médicos y enfermeras en ejercicio por 100.000 habitantes (Eurostat hlth_rs_prs2). Último año: 2024.
  · Listas de espera del SNS a 31 de diciembre (Ministerio de Sanidad, SISLE-SNS): 2016 frente a 2025 (versión rectificada).
  · Gasto de los hogares en seguros de enfermedad y en médicos de pago (INE, Encuesta de Presupuestos Familiares).

Uso: python3 scripts/calcular_t11.py → data/clean/t11_sanidad.json
"""
import csv
import json
import pathlib
import re
import subprocess
import sys

RAIZ = pathlib.Path(__file__).resolve().parent.parent
RAW, CLEAN = RAIZ / "data" / "raw", RAIZ / "data" / "clean"
sys.path.insert(0, str(RAIZ / "scripts"))
import calcular_t8 as T8  # noqa: E402
from calcular_t9 import eurostat_valor  # noqa: E402


def poblacion(anyo):
    """Población residente a 1 de enero (INE, Cifras de población)."""
    for linea in (RAW / "ine_56934_poblacion_sexo_edad_desde_1971.csv").read_text(encoding="utf-8-sig").splitlines():
        if linea.startswith(f"Todas las edades;Total;1 de enero de {anyo};"):
            return int(linea.split(";")[-1].replace(".", ""))
    raise SystemExit(f"sin población de {anyo}")


def ipc_anual_desde_2002():
    """IPC general, media anual de cada año (INE, base 2021), de 2002 a 2025."""
    num = lambda x: float(x.replace(".", "").replace(",", "."))
    idx = {}
    for f in csv.reader((RAW / "ine_24077_ipc_indice.csv").read_text(encoding="utf-8-sig").splitlines(), delimiter=";"):
        if len(f) >= 4 and f[1] == "Índice" and f[3].strip() not in ("", '""'):
            idx[f[2]] = num(f[3])
    return {y: sum(idx[f"{y}M{m:02d}"] for m in range(1, 13)) / 12 for y in range(2002, 2026)}


def pdf_texto(nombre):
    return subprocess.run(["pdftotext", "-layout", str(RAW / nombre), "-"], capture_output=True, text=True, check=True).stdout


def sisle(nombre, anyo):
    """Totales de la lista de espera quirúrgica y de consultas a 31 de diciembre, leídos del informe del ministerio."""
    t = pdf_texto(nombre)
    if f"31 DE DICIEMBRE DE {anyo}" not in t.upper():
        raise SystemExit(f"{nombre}: no es el informe de diciembre de {anyo}")
    n = lambda s: float(s.replace(".", "").replace(",", "."))
    # Quirúrgica, por especialidades: TOTAL pacientes … tasa por 1.000 · % más de 6 meses · tiempo medio (días)
    q = re.search(r"\n\s*TOTAL\s+([\d.]+)\s+(-?[\d.]+)\s+(?:(-?[\d.]+)\s+)?([\d,]+)\s+([\d,]+)\s+(\d+)\s", t)
    # Consultas externas, total: TOTAL tasa por 1.000 … tiempo medio (días) … % con más de 60 días
    c = re.search(r"Total primeras consultas.*?\n\s*TOTAL\s+([\d,]+)\s+(-?[\d,]+)\s+([\d,]+)\s+(\d+)", t, re.S) if anyo == 2016 else \
        re.search(r"Distribución por comunidades autónomas.*?\n\s*TOTAL\s+([\d,]+)\s+(\d+)\s+([\d,]+)", t[t.find("CONSULTAS DEL SNS"):], re.S)
    out = {"quirurgica": {"pacientes": int(q.group(1).replace(".", "")), "por_1000_hab": n(q.group(4)), "mas_de_6_meses_pct": n(q.group(5)), "dias": int(q.group(6))}}
    if anyo == 2016:
        out["consultas"] = {"por_1000_hab": n(c.group(1)), "mas_de_60_dias_pct": n(c.group(3)), "dias": int(c.group(4))}
    else:
        out["consultas"] = {"por_1000_hab": n(c.group(1)), "dias": int(c.group(2)), "mas_de_60_dias_pct": n(c.group(3))}
    return out


def epf(nombre, anyo):
    """Gasto medio por hogar (euros corrientes) de un grupo de la EPF del INE (tabla 73780)."""
    for s in json.loads((RAW / "ine_73780_epf_gasto_4digitos.json").read_text(encoding="utf-8")):
        if s["Nombre"].startswith(f"{nombre}. Dato base. Gasto total. Gasto medio por hogar."):
            return next(x["Valor"] for x in s["Data"] if x["Anyo"] == anyo)
    raise SystemExit(f"EPF sin «{nombre}»")


def main():
    ipc = T8.ipc_largo()                      # media anual, 2025 = 100
    real = lambda v, a, b="2025": v * ipc[b] / ipc[a]
    pct = lambda a, b: round(100 * (b / a - 1), 1)
    pob = {a: poblacion(a) for a in (2016, 2024, 2025)}

    # 1. Lo que pagamos: impuestos y cotizaciones sociales (Eurostat), en euros de 2025
    imp = {a: eurostat_valor("eurostat_gov_10a_taxag_total_es.json", unit="MIO_EUR", time=str(a)) for a in range(1995, 2026)}
    presion = {a: eurostat_valor("eurostat_gov_10a_taxag_total_es.json", unit="PC_GDP", time=str(a)) for a in (2007, 2016, 2025)}
    imp_real = {a: real(v, str(a)) if str(a) in ipc else None for a, v in imp.items()}
    pagamos = {
        "total_mill_eur": {"2016": imp[2016], "2025": imp[2025]},
        "total_mill_eur_de_2025": {"2016": round(imp_real[2016]), "2025": round(imp_real[2025])},
        "sube_real_pct": pct(imp_real[2016], imp_real[2025]),
        "por_habitante_eur_de_2025": {"2016": round(imp_real[2016] * 1e6 / pob[2016]), "2025": round(imp_real[2025] * 1e6 / pob[2025])},
        "presion_fiscal_pct_pib": {str(a): v for a, v in presion.items()},
    }
    pagamos["por_habitante_sube_real_pct"] = pct(*pagamos["por_habitante_eur_de_2025"].values())
    # ¿Récord? La presión fiscal más alta de la serie (desde 1995)
    serie_pib = {a: eurostat_valor("eurostat_gov_10a_taxag_total_es.json", unit="PC_GDP", time=str(a)) for a in range(1995, 2026)}
    pagamos["presion_fiscal_maxima_de_la_serie"] = {"anos": [a for a, v in serie_pib.items() if v == max(serie_pib.values())], "pct_pib": max(serie_pib.values())}
    # ¿Récord en euros de hoy? Recaudación real de cada año desde 2002 (IPC medio anual del INE)
    ia = ipc_anual_desde_2002()
    serie_real = {a: imp[a] * ia[2025] / ia[a] for a in ia}
    pagamos["recaudacion_real_maxima_desde_2002"] = max(serie_real, key=serie_real.get)
    pagamos["anterior_maximo_real"] = {"ano": max((a for a in serie_real if a < 2016), key=serie_real.get)}
    pagamos["anterior_maximo_real"]["mill_eur_de_2025"] = round(serie_real[pagamos["anterior_maximo_real"]["ano"]])

    # 2. Lo que se gasta en sanidad (Eurostat COFOG GF07, todas las administraciones), en euros de 2025
    gs = {a: eurostat_valor("eurostat_gov_10a_exp_cofog_es.json", unit="MIO_EUR", cofog99="GF07", time=str(a)) for a in (2016, 2024)}
    gs_real = {a: real(v, str(a)) for a, v in gs.items()}
    gasto = {
        "mill_eur": {"2016": gs[2016], "2024": gs[2024]},
        "sube_real_pct": pct(gs_real[2016], gs_real[2024]),
        "por_habitante_eur_de_2025": {"2016": round(gs_real[2016] * 1e6 / pob[2016]), "2024": round(gs_real[2024] * 1e6 / pob[2024])},
    }
    gasto["por_habitante_sube_real_pct"] = pct(*gasto["por_habitante_eur_de_2025"].values())

    # 3. Personal: médicos y enfermeras en ejercicio por 100.000 habitantes
    prof = lambda esp, a: eurostat_valor("eurostat_hlth_rs_prs2_es.json", unit="P_HTHAB", wstatus="PRACT", med_spec=esp, time=str(a))
    personal = {k: {"2016": prof(e, 2016), "2024": prof(e, 2024)} for k, e in (("medicos", "PHYS"), ("enfermeras", "NRS"))}
    for k in personal:
        personal[k]["sube_pct"] = pct(personal[k]["2016"], personal[k]["2024"])

    # 4. Lo que recibimos: listas de espera del SNS a 31 de diciembre
    le = {"2016": sisle("sanidad_sisle_dic2016.pdf", 2016), "2025": sisle("sanidad_sisle_dic2025.pdf", 2025)}
    espera = {
        "quirurgica_dias": {a: le[a]["quirurgica"]["dias"] for a in le},
        "quirurgica_pacientes": {a: le[a]["quirurgica"]["pacientes"] for a in le},
        "quirurgica_por_1000": {a: le[a]["quirurgica"]["por_1000_hab"] for a in le},
        "quirurgica_mas_de_6_meses_pct": {a: le[a]["quirurgica"]["mas_de_6_meses_pct"] for a in le},
        "consultas_dias": {a: le[a]["consultas"]["dias"] for a in le},
        "consultas_por_1000": {a: le[a]["consultas"]["por_1000_hab"] for a in le},
    }
    espera["quirurgica_pacientes_mas"] = espera["quirurgica_pacientes"]["2025"] - espera["quirurgica_pacientes"]["2016"]
    espera["quirurgica_pacientes_sube_pct"] = pct(*espera["quirurgica_pacientes"].values())
    espera["consultas_dias_mas"] = espera["consultas_dias"]["2025"] - espera["consultas_dias"]["2016"]
    espera["quirurgica_dias_mas"] = espera["quirurgica_dias"]["2025"] - espera["quirurgica_dias"]["2016"]

    # 5. Y además pagas de tu bolsillo: gasto medio por hogar (INE, EPF), en euros de 2025
    bolsillo = {}
    for k, nombre in (("seguro_de_enfermedad", "Seguros de enfermedad"), ("medicos_de_pago", "Servicios médicos (ambulatorios y hospitalarios)")):
        v = {a: epf(nombre, a) for a in (2016, 2025)}
        bolsillo[k] = {"eur_corrientes": {str(a): x for a, x in v.items()}, "eur_de_2025": {"2016": round(real(v[2016], "2016")), "2025": round(v[2025])}}
        bolsillo[k]["sube_real_pct"] = pct(*bolsillo[k]["eur_de_2025"].values())

    out = {
        "tema": "T11 — sanidad, 2016 frente a hoy: lo que pagamos frente al servicio que recibimos",
        "ipc_media_anual": {a: ipc[a] for a in ("2016", "2024", "2025")}, "poblacion_1_enero": {str(a): v for a, v in pob.items()},
        "pagamos": pagamos, "gasto_sanidad": gasto, "personal": personal, "espera": espera, "bolsillo": bolsillo,
        "nota": ("Impuestos: todos los impuestos y cotizaciones sociales recaudados por las administraciones (Eurostat). Euros de 2025 con el IPC "
                 "medio anual del INE. Gasto en sanidad y personal: último año, 2024. Listas de espera: situación a 31 de diciembre de 2016 y de 2025 "
                 "(versión rectificada por el ministerio). En consultas, el informe de 2025 cuenta también a quien lleva más de 60 días sin cita: "
                 "por eso el porcentaje de más de 60 días no se compara; el tiempo medio sí. Seguros y médicos de pago: gasto medio por hogar de la EPF."),
    }
    (CLEAN / "t11_sanidad.json").write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding="utf-8")
    print(json.dumps({k: out[k] for k in ("pagamos", "gasto_sanidad", "personal", "espera", "bolsillo")}, ensure_ascii=False, indent=1))


if __name__ == "__main__":
    main()
