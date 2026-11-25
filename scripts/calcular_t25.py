#!/usr/bin/env python3
"""Datos limpios de T25: ¿en qué tramo de sueldo estás tú? (los tramos que propuso Bruno al principio; vídeo pedido
el 24-11-2026: «Todos. 4 vídeos… uno por uno»).

  · Asalariados por tramos de salario (Agencia Tributaria, «Mercado de trabajo y pensiones en las fuentes
    tributarias», tabla de asalariados, percepciones y salarios por tramos de salario, edad y sexo) (V). Hacienda da
    los tramos en veces el salario mínimo (SMI) de cada año; en 2025 (SMI 16.576 € al año) quedan casi en los tramos de
    Bruno (14.000, 30.000, 50.000, 80.000 y 120.000 €):
        menos de 1 SMI (16.576 €) · 1-2 SMI (hasta 33.152 €) · 2-3 SMI (hasta 49.728 €) · 3-5 SMI (hasta 82.880 €) ·
        5-7,5 SMI (hasta 124.320 €) · más de 7,5 SMI.
    Asalariado: toda persona que cobró algún salario en el año (también a tiempo parcial o solo unos meses).
  · Salario medio anual (Agencia Tributaria, misma tabla: salarios / asalariados) en euros de cada año y en euros de
    2025 con el IPC medio anual (INE, tabla 24077) (C). Años: 2007, 2013 (plena crisis), 2016, 2019 y 2025.
  · Parte que cobra menos que el salario medio: como mínimo, los tramos que quedan enteros por debajo de la media (C).

Uso: python3 scripts/calcular_t25.py → data/clean/t25_tramos.json
"""
import collections
import json
import pathlib

RAIZ = pathlib.Path(__file__).resolve().parent.parent
RAW, CLEAN = RAIZ / "data" / "raw" / "t25", RAIZ / "data" / "clean"
ANOS = ("2007", "2013", "2016", "2019", "2025")
HOY = "2025"
GRUPOS = [("menos de 1 SMI", 0, 1), ("de 1 a 2 SMI", 1, 2), ("de 2 a 3 SMI", 2, 3), ("de 3 a 5 SMI", 3, 5),
          ("de 5 a 7,5 SMI", 5, 7.5), ("más de 7,5 SMI", 7.5, 99)]


def limites(tramo):
    t = tramo.replace(",", ".")
    if t.startswith("Más de"):
        return float(t.split()[2]), 99
    a, b = t.replace("De ", "").replace(" SMI", "").split(" a ")
    return float(a), float(b)


def main():
    pct = lambda a, b: round(100 * (b / a - 1), 1)
    aeat = json.loads((RAW / "aeat_tramos.json").read_text(encoding="utf-8"))
    ipc = json.loads((RAW / "ine_24077_ipc_desde_1961.json").read_text(encoding="utf-8"))[0]["Data"]
    m = collections.defaultdict(list)
    for x in ipc:
        if x["Valor"] is not None:
            m[str(x["Anyo"])].append(x["Valor"])
    I = {a: sum(v) / len(v) for a, v in m.items() if len(v) == 12}

    smi = {a: float(aeat[a]["smi"].replace(".", "").replace(",", ".")) for a in aeat if aeat[a]["smi"]}
    smi.setdefault("2019", 900 * 14)          # la página de 2019 no lo escribe: 900 € × 14 pagas (BOE, RD 1462/2018)

    filas = {}
    for a in ANOS + ("2024",):
        f = aeat[a]["filas"]
        total = f[0]
        tramos = [dict(x, lim=limites(x["tramo"])) for x in f[1:]]
        grupos = []
        for nombre, lo, hi in GRUPOS:
            n = sum(x["asalariados"] for x in tramos if x["lim"][0] >= lo and x["lim"][1] <= hi)
            grupos.append({"grupo": nombre, "desde_eur": round(lo * smi[a]), "hasta_eur": round(hi * smi[a]) if hi < 99 else None,
                           "asalariados": n, "pct": round(100 * n / total["asalariados"], 2)})
        assert abs(sum(g["asalariados"] for g in grupos) - total["asalariados"]) <= 2, a   # la AEAT redondea: a veces 1 de diferencia
        media = total["salarios"] / total["asalariados"]
        bajo_media = sum(x["asalariados"] for x in tramos if x["lim"][1] * smi[a] <= media)
        filas[a] = {
            "smi_anual": smi[a], "asalariados": total["asalariados"], "salario_medio": round(media),
            "salario_medio_euros_2025": round(media * I[HOY] / I[a]) if a in I else None,
            "grupos": grupos, "cobran_menos_que_la_media_pct_min": round(100 * bajo_media / total["asalariados"], 1),
        }
    hoy = filas[HOY]
    g = {x["grupo"]: x for x in hoy["grupos"]}
    out = {
        "nota": __doc__.strip().splitlines()[0], "hoy": HOY, "anos": list(ANOS), "filas": filas,
        "hoy_resumen": {
            "menos_1smi_pct": g["menos de 1 SMI"]["pct"], "de1a2_pct": g["de 1 a 2 SMI"]["pct"],
            "menos_2smi_pct": round(g["menos de 1 SMI"]["pct"] + g["de 1 a 2 SMI"]["pct"], 1),
            "de2a3_pct": g["de 2 a 3 SMI"]["pct"], "de3a5_pct": g["de 3 a 5 SMI"]["pct"],
            "mas_5smi_pct": round(g["de 5 a 7,5 SMI"]["pct"] + g["más de 7,5 SMI"]["pct"], 2),
            "mas_7_5smi_pct": g["más de 7,5 SMI"]["pct"], "mas_7_5smi_personas": g["más de 7,5 SMI"]["asalariados"],
            "mas_3smi_pct": round(g["de 3 a 5 SMI"]["pct"] + g["de 5 a 7,5 SMI"]["pct"] + g["más de 7,5 SMI"]["pct"], 1),
            "mas_2smi_pct": round(100 - g["menos de 1 SMI"]["pct"] - g["de 1 a 2 SMI"]["pct"], 1),
            "de5a7_5_pct": g["de 5 a 7,5 SMI"]["pct"],
            "limite_1smi": round(smi[HOY]), "limite_2smi": round(2 * smi[HOY]), "limite_3smi": round(3 * smi[HOY]),
            "limite_5smi": round(5 * smi[HOY]), "limite_7_5smi": round(7.5 * smi[HOY]),
        },
        "salario_medio_real_vs_hoy_pct": {a: pct(filas[a]["salario_medio_euros_2025"], hoy["salario_medio_euros_2025"]) for a in ANOS if a != HOY},
        "ipc_media_anual": {a: round(I[a], 3) for a in ANOS},
        "estado": {"tramos": "V (Agencia Tributaria)", "agrupacion_en_euros": "C (veces el SMI de cada año)",
                   "salario_medio": "V (Agencia Tributaria)", "salario_medio_real": "C (IPC del INE)", "cobran_menos_que_la_media": "C"},
    }
    (CLEAN / "t25_tramos.json").write_text(json.dumps(out, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    for a in ANOS:
        f = filas[a]
        print(a, f"SMI {f['smi_anual']:9.1f}  asalariados {f['asalariados']:>10}  medio {f['salario_medio']:>6} € ({f['salario_medio_euros_2025']} € de 2025)"
                 f"  bajo la media ≥{f['cobran_menos_que_la_media_pct_min']} %")
        print("    ", [(x["grupo"], x["desde_eur"], x["hasta_eur"], x["pct"]) for x in f["grupos"]])
    print(out["hoy_resumen"]); print(out["salario_medio_real_vs_hoy_pct"])


if __name__ == "__main__":
    main()
