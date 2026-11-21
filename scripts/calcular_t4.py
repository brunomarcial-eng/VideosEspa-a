#!/usr/bin/env python3
"""Datos limpios de T4 («¿De verdad os lo gastáis todo en Netflix?», padre contra hijo, 2.ª parte).
Reutiliza data/clean/t3_vivienda.json (aprobado el 14-11-2026) y añade natalidad (INE, Indicadores Demográficos Básicos).
Uso: python3 scripts/calcular_t4.py → data/clean/t4_netflix.json"""
import json
import pathlib
import re
import subprocess

RAIZ = pathlib.Path(__file__).resolve().parent.parent
RAW, CLEAN = RAIZ / "data" / "raw", RAIZ / "data" / "clean"


def serie(fichero, cod):
    d = json.loads((RAW / fichero).read_text(encoding="utf-8"))
    s = next(x for x in d if x["COD"] == cod)
    return {str(p["Anyo"]): p["Valor"] for p in s["Data"] if p["Valor"] is not None}


def ecpf_1986():
    """Gasto de los hogares en 1986 (Encuesta Continua de Presupuestos Familiares), del Anuario del INE de 1989.
    Devuelve el «tanto por mil» de cada línea de la tabla 2.2.6 pasado a porcentaje."""
    txt = subprocess.run(["pdftotext", "-layout", str(RAW / "ine_anuario1989_ecpf_1986_grupos.pdf"), "-"], capture_output=True, text=True).stdout
    def pm(etiqueta):
        for linea in txt.splitlines():
            if etiqueta in linea:
                cols = [c for c in re.split(r"\s{2,}", linea.split(etiqueta, 1)[1].strip()) if c]
                return round(float(cols[1].replace(" ", "").replace(".", "").replace(",", ".")) / 10, 2)
        raise SystemExit(f"no encuentro «{etiqueta}» en la tabla de 1986")
    g = {
        "alimentos": pm("1 .1 . Alimentos"), "bebidas_no_alcoholicas": pm("1 .2 . Bebidas no alcohólicas"),
        "vestido_calzado": pm("2. Vestido y calzado"), "vivienda_calefaccion_alumbrado": pm("3. Vivienda, calefacción y alumbrado"),
        "utilizacion_vehiculos": pm("6 .2. Gastos de utilización de vehículos"), "comunicaciones": pm("6 .4 . Correos y comunicaciones"),
        "esparcimiento_cultura_ensenanza": pm("7. Esparcimiento, espectáculos, enseñanza y cultura"), "ensenanza": pm("7 .4 . Enseñanza"),
        "restaurantes_cafes_hoteles": pm("8 .3 . Gastos en restaurantes, cafés y hoteles"), "viajes_todo_incluido": pm("8 .4 . Viajes turísticos todo incluido"),
    }
    g["alimentos_y_bebidas_no_alcoholicas"] = round(g["alimentos"] + g["bebidas_no_alcoholicas"], 2)
    g["ocio_restaurantes_comunicaciones"] = round(g["esparcimiento_cultura_ensenanza"] - g["ensenanza"] + g["restaurantes_cafes_hoteles"] + g["viajes_todo_incluido"] + g["comunicaciones"], 2)
    return g


def epf_total(anyos=("2016", "2019", "2025")):
    """Reparto del gasto total (con alquiler imputado, como en 1986) de la EPF base 2016, tablas 73778 y 73779."""
    def leer(fichero):
        out = {}
        for x in json.loads((RAW / fichero).read_text(encoding="utf-8")):
            if "Dato base. Gasto total. Distribución porcentual" in x["Nombre"]:
                out[x["Nombre"].split(". Dato base")[0].strip()] = {str(p["Anyo"]): p["Valor"] for p in x["Data"] if p["Valor"] is not None}
        return out
    G, S = leer("ine_73778_epf_gasto_grupos.json"), leer("ine_73779_epf_subgrupos.json")
    res = {}
    for a in anyos:
        r = {
            "alimentos_y_bebidas_no_alcoholicas": G["Alimentos y bebidas no alcohólicas"][a],
            "vivienda_agua_electricidad_gas": G["Vivienda, agua, electricidad, gas y otros combustibles"][a],
            "vestido_calzado": G["Vestido y calzado"][a],
            "restaurantes_alojamiento": G["Restaurantes y servicios de alojamiento"][a],
            "ocio_restaurantes_comunicaciones": round(G["Actividades recreativas, deporte y cultura"][a] + G["Restaurantes y servicios de alojamiento"][a] + G["Información y comunicaciones"][a], 2),
        }
        if a in S.get("Utilización de vehículos personales", {}):
            r["utilizacion_vehiculos"] = S["Utilización de vehículos personales"][a]
            r["alquileres_reales"] = S["Alquileres reales de la vivienda"][a]
            r["alquileres_imputados"] = S["Alquileres imputados de la vivienda"][a]
        res[a] = r
    return res


def eurostat(fichero, filtros):
    d = json.loads((RAW / fichero).read_text(encoding="utf-8"))
    dims, size, idx = d["id"], d["size"], {k: d["dimension"][k]["category"]["index"] for k in d["id"]}
    out = {}
    for t in idx["time"]:
        pos = 0
        for k, n in zip(dims, size):
            c = t if k == "time" else filtros.get(k, next(iter(idx[k])))
            pos = pos * n + idx[k][c]
        v = d["value"].get(str(pos))
        if v is not None:
            out[t] = v
    return out


def bde_accesibilidad():
    """Banco de España (si_1_5): esfuerzo teórico sin deducciones y precio/renta bruta por hogar. Media de cada año; 2026, último trimestre."""
    import csv
    filas = list(csv.reader(open(RAW / "bde_si_1_5_vivienda.csv", encoding="latin-1")))
    col = {filas[2][i]: i for i in range(len(filas[2]))}
    out = {}
    for alias, nombre in (("SI_1_5.44", "esfuerzo_teorico_pct"), ("SI_1_5.43", "precio_entre_renta_hogar_anos")):
        i, por = col[alias], {}
        for r in filas[6:]:
            if re.match(r"^[A-Z]{3} \d{4}$", r[0]) and i < len(r) and r[i].strip() not in ("", "_"):
                por.setdefault(r[0][-4:], []).append(float(r[i]))
        out[nombre] = {a: round(sum(v) / len(v), 2) for a, v in por.items() if a in ("1987", "1990", "2006", "2016", "2019", "2025")}
        out[nombre]["2026_ultimo"] = por["2026"][-1]
    out["entrada_20pct_anos_renta"] = {a: round(0.2 * out["precio_entre_renta_hogar_anos"][a], 2) for a in ("1987", "2006", "2016")}
    out["entrada_20pct_anos_renta"]["2026_ultimo"] = round(0.2 * out["precio_entre_renta_hogar_anos"]["2026_ultimo"], 2)
    return out


def main():
    t3 = json.loads((CLEAN / "t3_vivienda.json").read_text(encoding="utf-8"))
    O, H, B = t3["gasto_hogares_epf"], t3["hogares_epa"], t3["bde_vivienda"]
    moda = t3["calculos"]["sueldo_bruto_anual"]["moda"]
    real = t3["calculos"]["variacion_real_pct"]
    em = t3["edad_emancipacion_eurostat"]
    mat = serie("ine_1579_edad_media_maternidad.json", "IDB80626")      # primer hijo
    isf = serie("ine_1407_indicador_fecundidad.json", "IDB72160")       # hijos por mujer
    out = {
        "tema": "T4 — ¿De verdad os lo gastáis todo en Netflix? (padre contra hijo, 2.ª parte)",
        "ocio_pct_gasto": {"2006": O["2006"]["pct_ocio_sobre_gasto"], "2025": O["2025"]["pct_ocio_sobre_gasto"]},
        "ocio_real_2006_2025_pct": real["ocio_hogar_2006_2025"],
        "dos_sueldos_pct": {"2006": H["2006T3"]["pct_dos_o_mas_entre_hogares_con_ocupados"], "2026": H["2026T3"]["pct_dos_o_mas_entre_hogares_con_ocupados"]},
        "hipotecas_mas_80_pct": {"2006": B["pct_prestamos_rpv_mas_80"]["por_anyo"]["2006"]["media"], "2026": B["pct_prestamos_rpv_mas_80"]["por_anyo"]["2026"]["media"]},
        "sueldo_mas_frecuente": {"2006": moda["2006"], "2022": moda["2022"], "real_2006_2022_pct": real["moda"]["2022"]},
        "edad_emancipacion": {"ES_2006": em["ES"]["2006"], "ES_2025": em["ES"]["2025"], "UE_2025": em["EU27_2020"]["2025"]},
        "edad_primer_hijo": {"1986": mat["1986"], "2006": mat["2006"], "2024": mat["2024"]},
        "hijos_por_mujer": {"1986": isf["1986"], "2006": isf["2006"], "2024": isf["2024"]},
        "gasto_1986_pct": ecpf_1986(),
        "gasto_total_pct": epf_total(),
        "alquiler_pct_renta": {
            "una_persona_ES": eurostat("eurostat_ilc_mded02.json", {"hhcomp": "A1", "geo": "ES"}),
            "dos_adultos_ES": eurostat("eurostat_ilc_mded02.json", {"hhcomp": "A2", "geo": "ES"}),
            "una_persona_UE": eurostat("eurostat_ilc_mded02.json", {"hhcomp": "A1", "geo": "EU27_2020"}),
        },
        "sobrecarga_inquilinos_mercado_pct": eurostat("eurostat_ilc_lvho07c.json", {"tenure": "RENT_MKT", "geo": "ES"}),
        "bde_accesibilidad": bde_accesibilidad(),
        "nota": "Ocio = ocio y cultura + restaurantes y hoteles + comunicaciones (gasto monetario de los hogares, EPF). Dos sueldos = hogares con 2 o más ocupados entre los hogares con algún ocupado (EPA, 3.er trimestre). Hipotecas de más del 80 % del valor (Banco de España, media del año; 2026: dos trimestres). Sueldo más frecuente: microdatos de la Encuesta de Estructura Salarial (INE). Emancipación: Eurostat. Primer hijo e hijos por mujer: INE.",
    }
    (CLEAN / "t4_netflix.json").write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding="utf-8")
    print(json.dumps(out, ensure_ascii=False, indent=1))


if __name__ == "__main__":
    main()
