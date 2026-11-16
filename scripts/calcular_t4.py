#!/usr/bin/env python3
"""Datos limpios de T4 («¿De verdad os lo gastáis todo en Netflix?», padre contra hijo, 2.ª parte).
Reutiliza data/clean/t3_vivienda.json (aprobado el 14-11-2026) y añade natalidad (INE, Indicadores Demográficos Básicos).
Uso: python3 scripts/calcular_t4.py → data/clean/t4_netflix.json"""
import json
import pathlib

RAIZ = pathlib.Path(__file__).resolve().parent.parent
RAW, CLEAN = RAIZ / "data" / "raw", RAIZ / "data" / "clean"


def serie(fichero, cod):
    d = json.loads((RAW / fichero).read_text(encoding="utf-8"))
    s = next(x for x in d if x["COD"] == cod)
    return {str(p["Anyo"]): p["Valor"] for p in s["Data"] if p["Valor"] is not None}


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
        "nota": "Ocio = ocio y cultura + restaurantes y hoteles + comunicaciones (gasto monetario de los hogares, EPF). Dos sueldos = hogares con 2 o más ocupados entre los hogares con algún ocupado (EPA, 3.er trimestre). Hipotecas de más del 80 % del valor (Banco de España, media del año; 2026: dos trimestres). Sueldo más frecuente: microdatos de la Encuesta de Estructura Salarial (INE). Emancipación: Eurostat. Primer hijo e hijos por mujer: INE.",
    }
    (CLEAN / "t4_netflix.json").write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding="utf-8")
    print(json.dumps(out, ensure_ascii=False, indent=1))


if __name__ == "__main__":
    main()
