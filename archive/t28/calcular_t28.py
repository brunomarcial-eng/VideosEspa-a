#!/usr/bin/env python3
"""Datos limpios de T28: ¿tener un bebé cuesta hoy más horas de trabajo que antes? (Bruno, 24-11-2026: rescatar los
temas del principio; el cuarto, «familias con hijos: lo que cuesta un bebé»).

  · Guardería (primer ciclo de Educación Infantil, 0-3 años): gasto medio por hogar de los hogares que la pagan
    (INE, Encuesta de Presupuestos Familiares, tabla 73827; empieza en 2016) (V), en horas del sueldo neto mediano (C).
  · Alimentos para bebé (leche infantil, potitos, papillas): IPC de la subclase (INE, tabla 79184, media anual, base
    2025 = 100; desde 2007) (V). Horas = índice de precio / sueldo neto mediano por hora, relativo a hoy (C): «cuesta un
    X % más o menos tiempo de trabajo que hoy» (no hay precio oficial de un bote concreto).
  · Hijos por mujer (indicador coyuntural de fecundidad, tabla 1407) y nacimientos por cada mil habitantes (tasa bruta
    de natalidad, tabla 1381) (V).
  · Sueldo neto mediano por hora: el de T1 y T21 (INE, EAES y ETCL; C).
  · Años: 2007, 2013 (plena crisis), 2016, 2019 y 2025.

Uso: python3 scripts/calcular_t28.py → data/clean/t28_bebe.json
"""
import collections
import json
import pathlib

RAIZ = pathlib.Path(__file__).resolve().parent.parent
RAW, CLEAN = RAIZ / "data" / "raw" / "t28", RAIZ / "data" / "clean"
ANOS = ("2007", "2013", "2016", "2019", "2025")


def serie(fichero, filtro, anual=False):
    for s in json.loads((RAW / fichero).read_text(encoding="utf-8")):
        if filtro(s["Nombre"]):
            if not anual:
                return {str(x["Anyo"]): x["Valor"] for x in s["Data"] if x["Valor"] is not None}
            m = collections.defaultdict(list)
            for x in s["Data"]:
                if x["Valor"] is not None:
                    m[str(x["Anyo"])].append(x["Valor"])
            return {a: sum(v) / len(v) for a, v in m.items() if len(v) == 12}
    raise KeyError(fichero)


def main():
    pct = lambda a, b: round(100 * (b / a - 1), 1)
    hora = {a: v["neto_hora_mediana"] for a, v in json.loads((CLEAN / "t21_alquiler.json").read_text(encoding="utf-8"))["alquiler"].items()}
    guarde = serie("ine_73827_epf_hogares_con_gasto.json", lambda n: n.startswith("Gasto medio por hogar. Primer ciclo de Enseñanza Infantil (0-3 años). Dato base"))
    guarde_pct = serie("ine_73827_epf_hogares_con_gasto.json", lambda n: n.startswith("Porcentaje de hogares con gasto. Primer ciclo de Enseñanza Infantil"))
    bebe = serie("ine_79184_ipc_subclases.json", lambda n: n.startswith("Nacional. Alimentos para bebé. Índice"), anual=True)
    ipc = serie("ine_79184_ipc_subclases.json", lambda n: n.startswith("Nacional. Índice general. Índice"), anual=True)
    fecund = serie("ine_1407_indicador_fecundidad.json", lambda n: n.startswith("Fecundidad. Total Nacional. Ambas nacionalidades"))
    natal = serie("ine_1381_tasa_bruta_natalidad.json", lambda n: n.startswith("Fecundidad. Total Nacional"))

    filas = {}
    for a in ANOS:
        f = {"neto_hora_mediana": hora[a], "alimentos_bebe_ipc": round(bebe[a], 3), "ipc_general": round(ipc[a], 3),
             "hijos_por_mujer": fecund[a], "natalidad_por_mil": natal[a]}
        if a in guarde:
            f |= {"guarderia_anual": guarde[a], "guarderia_horas": round(guarde[a] / hora[a], 1), "guarderia_hogares_pct": guarde_pct[a]}
        f["alimentos_bebe_coste_tiempo"] = bebe[a] / hora[a]
        filas[a] = f
    hoy = filas["2025"]
    for a in ANOS:
        filas[a]["alimentos_bebe_horas_vs_hoy_pct"] = pct(hoy["alimentos_bebe_coste_tiempo"], filas[a]["alimentos_bebe_coste_tiempo"])
        filas[a]["alimentos_bebe_coste_tiempo"] = round(filas[a]["alimentos_bebe_coste_tiempo"], 4)
    out = {
        "nota": __doc__.strip().splitlines()[0], "anos": list(ANOS), "hoy": "2025", "filas": filas,
        "guarderia_serie": {a: guarde[a] for a in sorted(guarde)},
        # cuánto tiempo de trabajo cuestan hoy los alimentos para bebé frente a cada año (negativo: hoy menos tiempo)
        "alimentos_bebe_hoy_frente_a_pct": {a: pct(filas[a]["alimentos_bebe_coste_tiempo"], hoy["alimentos_bebe_coste_tiempo"]) for a in ANOS if a != "2025"},
        "alimentos_bebe_precio_sube_pct": {a: pct(bebe[a], bebe["2025"]) for a in ANOS if a != "2025"},
        "sueldo_hora_sube_pct": {a: pct(hora[a], hora["2025"]) for a in ANOS if a != "2025"},
        "guarderia_horas_menos_que": {a: round(filas[a]["guarderia_horas"] - hoy["guarderia_horas"], 1) for a in ("2016", "2019")},
        "estado": {"guarderia": "V (INE, EPF)", "guarderia_horas": "C", "alimentos_bebe": "V (IPC) / C (en tiempo de trabajo)", "natalidad": "V (INE)"},
    }
    (CLEAN / "t28_bebe.json").write_text(json.dumps(out, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    for a in ANOS:
        print(a, {k: v for k, v in filas[a].items()})
    for k in ("alimentos_bebe_hoy_frente_a_pct", "alimentos_bebe_precio_sube_pct", "sueldo_hora_sube_pct", "guarderia_horas_menos_que", "guarderia_serie"):
        print(k, out[k])


if __name__ == "__main__":
    main()
