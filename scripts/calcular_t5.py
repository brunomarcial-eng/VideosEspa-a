#!/usr/bin/env python3
"""Datos limpios de T5 («¿Y los nietos pa cuándo?», padre contra hijo, 3.ª parte): natalidad y envejecimiento.
Todo del INE (Indicadores Demográficos Básicos y Encuesta de Fecundidad 2018). Años: 1986, 2007, 2016, 2019 y el último.
Uso: python3 scripts/calcular_t5.py → data/clean/t5_natalidad.json"""
import json
import pathlib
import re
import subprocess

RAIZ = pathlib.Path(__file__).resolve().parent.parent
RAW, CLEAN = RAIZ / "data" / "raw", RAIZ / "data" / "clean"
ANYOS = ("1986", "2007", "2016", "2019", "2023", "2024", "2025")


def serie(fichero, cod):
    d = json.loads((RAW / fichero).read_text(encoding="utf-8"))
    s = next(x for x in d if x["COD"] == cod)
    v = {str(p["Anyo"]): p["Valor"] for p in s["Data"] if p["Valor"] is not None}
    return {a: v[a] for a in ANYOS if a in v}


def encuesta_fecundidad():
    """Frase literal de la nota del INE: «Casi tres de cada cuatro mujeres desearían tener al menos dos hijos»."""
    txt = subprocess.run(["pdftotext", "-layout", str(RAW / "ine_encuesta_fecundidad_2018_avance.pdf"), "-"], capture_output=True, text=True).stdout
    titular = re.search(r"Casi tres de cada cuatro mujeres desearían tener al menos dos hijos", txt)
    if not titular:
        raise SystemExit("no encuentro el titular de la Encuesta de Fecundidad 2018")
    return {"titular": titular.group(0), "anyo": 2018,
            "motivos_desde_35": "A partir de los 35 años, las razones laborales o de conciliación y las económicas son las más importantes por las que las mujeres han tenido menos hijos de los deseados (texto literal resumido de la nota del INE)"}


def main():
    out = {
        "tema": "T5 — ¿Y los nietos pa cuándo? (padre contra hijo, 3.ª parte): natalidad y envejecimiento",
        "hijos_por_mujer": serie("ine_1407_indicador_fecundidad.json", "IDB72160"),
        "edad_primer_hijo": serie("ine_1579_edad_media_maternidad.json", "IDB80626"),
        "edad_primer_matrimonio": serie("ine_1380_edad_primer_matrimonio.json", "IDB12844"),
        "natalidad_por_mil": serie("ine_1381_tasa_bruta_natalidad.json", "IDB37106"),
        "pct_mayores_64": serie("ine_1417_proporcion_mayores.json", "IDB55727"),
        "mayores_por_100_ninos": serie("ine_1418_indice_envejecimiento.json", "IDB53081"),
        "encuesta_fecundidad_2018": encuesta_fecundidad(),
        "nota": "Hijos por mujer = indicador coyuntural de fecundidad. Primer hijo = edad media de la madre al primer nacimiento. "
                "Matrimonio = edad media al primer matrimonio, ambos sexos. Mayores por cada 100 niños = índice de envejecimiento "
                "(mayores de 64 años por cada 100 menores de 16, a 1 de enero). Todo INE, Indicadores Demográficos Básicos.",
    }
    (CLEAN / "t5_natalidad.json").write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding="utf-8")
    print(json.dumps(out, ensure_ascii=False, indent=1))


if __name__ == "__main__":
    main()
