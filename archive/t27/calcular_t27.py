#!/usr/bin/env python3
"""Datos limpios de T27: ¿hay más pobres que antes? (Bruno, 24-11-2026: rescatar los temas del principio; el tercero,
«pobreza con umbral fijo»).

Todo de la Encuesta de Condiciones de Vida del INE (ECV, base 2013; la serie empieza en 2008):
  · Tasa de riesgo de pobreza con umbral fijo en 2008 (tabla 59962) (V): el umbral de pobreza de 2008, actualizado
    solo con la inflación. Mide la pobreza con la misma vara de poder de compra todos los años.
  · Tasa de riesgo de pobreza con el umbral de cada año (60 % de la mediana; tabla 9958) (V).
  · Umbral de riesgo de pobreza de cada año para una persona que vive sola (tabla 9964) (V).
  · Carencias (tabla 9967, personas) (V): no puede permitirse una comida de carne, pollo o pescado al menos cada dos días;
    no tiene capacidad para afrontar gastos imprevistos; no puede permitirse ir de vacaciones una semana al año.
  · Dificultad para llegar a fin de mes: «con mucha dificultad» (tabla 9985, personas) (V).
  · Ojo con los años: en la ECV, la renta (y la pobreza) es la del año anterior a la entrevista (ECV 2008 = renta de
    2007); las carencias, del año de la entrevista. Años: 2008, 2013 (plena crisis), 2016, 2019 y 2025.

Uso: python3 scripts/calcular_t27.py → data/clean/t27_pobreza.json
"""
import json
import pathlib

RAIZ = pathlib.Path(__file__).resolve().parent.parent
RAW, CLEAN = RAIZ / "data" / "raw" / "t27", RAIZ / "data" / "clean"
ANOS = ("2008", "2013", "2016", "2019", "2025")


def serie(fichero, filtro):
    for s in json.loads((RAW / fichero).read_text(encoding="utf-8")):
        if filtro(s["Nombre"]):
            return {str(x["Anyo"]): x["Valor"] for x in s["Data"] if x["Valor"] is not None}
    raise KeyError(fichero)


def main():
    fija = serie("ine_59962_ecv_pobreza_umbral_fijo_2008.json", lambda n: n.startswith("Total Nacional. Ambos sexos. Total. Tasa de riesgo de pobreza con umbral fijo año 2008 (renta"))
    fija_men = serie("ine_59962_ecv_pobreza_umbral_fijo_2008.json", lambda n: "Ambos sexos. Menores de 16 años. Tasa de riesgo de pobreza con umbral fijo año 2008 (renta" in n)
    fija_65 = serie("ine_59962_ecv_pobreza_umbral_fijo_2008.json", lambda n: "Ambos sexos. 65 y más años. Tasa de riesgo de pobreza con umbral fijo año 2008 (renta" in n)
    rel = serie("ine_9958_ecv_riesgo_pobreza_edad.json", lambda n: n.startswith("Ambos sexos. Total. Total Nacional. Tasa de riesgo de pobreza (renta"))
    umbral = serie("ine_9964_ecv_umbral_pobreza.json", lambda n: n.startswith("Total Nacional. Total. Hogar unipersonal. Umbral de riesgo de pobreza. Base"))
    carne = serie("ine_9967_ecv_carencia_edad.json", lambda n: n.startswith("Ambos sexos. Total. No puede permitirse una comida de carne"))
    impre = serie("ine_9967_ecv_carencia_edad.json", lambda n: n.startswith("Ambos sexos. Total. No tiene capacidad para afrontar gastos imprevistos"))
    vaca = serie("ine_9967_ecv_carencia_edad.json", lambda n: n.startswith("Ambos sexos. Total. No puede permitirse ir de vacaciones"))
    mucha = serie("ine_9985_ecv_fin_de_mes.json", lambda n: n.startswith("Ambos sexos. Total. Total Nacional. Con mucha dificultad. Personas"))
    filas = {a: {"pobreza_umbral_fijo_2008_pct": fija[a], "pobreza_relativa_pct": rel[a], "umbral_1_persona_eur": round(umbral[a]),
                 "no_carne_pescado_pct": carne[a], "no_imprevistos_pct": impre[a], "no_vacaciones_pct": vaca[a],
                 "fin_de_mes_mucha_dificultad_pct": mucha[a],
                 "pobreza_fija_menores16_pct": fija_men.get(a), "pobreza_fija_65_pct": fija_65.get(a)} for a in ANOS}
    hoy = filas["2025"]
    out = {
        "nota": __doc__.strip().splitlines()[0], "anos": list(ANOS), "hoy": "2025", "filas": filas,
        "serie_umbral_fijo": dict(sorted(fija.items())), "serie_relativa": dict(sorted(rel.items())),
        "minimo_umbral_fijo": min(fija.items(), key=lambda x: x[1]),
        "carne_veces_2008": round(hoy["no_carne_pescado_pct"] / filas["2008"]["no_carne_pescado_pct"], 2),
        "estado": {"todo": "V (INE, Encuesta de Condiciones de Vida)"},
    }
    (CLEAN / "t27_pobreza.json").write_text(json.dumps(out, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    for a in ANOS:
        print(a, filas[a])
    print("mínimo con umbral fijo:", out["minimo_umbral_fijo"], "· carne ×", out["carne_veces_2008"])


if __name__ == "__main__":
    main()
