#!/usr/bin/env python3
"""Datos limpios de T21: el alquiler en horas de trabajo y quién alquila (Bruno, 24-11-2026).

  · Alquiler medio que pagan los hogares inquilinos (EPF del INE, alquileres reales de la vivienda principal):
      2016, 2019 y 2025: tabla 73827, «gasto medio por hogar» de los hogares con gasto en ese código (V).
      2007 a 2015: microdatos de la EPF (scripts/extraer_epf_alquiler.py): hogares en alquiler a precio de mercado o
      inferior (C). El gasto medio de todos los hogares cuadra al céntimo con la tabla 10630 cada año; con el mismo
      método, 2016 da 391,54 €/mes frente a 397,93 € de la tabla publicada (−1,6 %).
      Bruno, 24-11-2026: compararlo también con la crisis. Año de la crisis: 2013 (el peor año del paro).
  · Sueldo neto mediano por hora (T1: INE, Encuesta Anual de Estructura Salarial y ETCL; 2007 y 2025, C). De 2008 a
    2015, con el mismo método de T1 (scripts/calcular_t1_t2.py: EAES y neto de Eurostat earn_nt_net) (C).
  · Horas de trabajo al mes = alquiler medio mensual / sueldo neto mediano por hora (C).
  · Parte del sueldo = alquiler medio mensual / sueldo neto mediano mensual (T16) (C).
  · Quién alquila: hogares por régimen de tenencia y edad de la persona de referencia (INE, ECV, tabla 9994) (V).
  · Edad media a la que los jóvenes se van de casa de sus padres (Eurostat, yth_demo_030; corte de serie en 2021) (V).
  · Sobrecarga del coste de la vivienda de los inquilinos a precio de mercado, más del 40 % de la renta disponible
    del hogar (Eurostat, ilc_lvho07c) (V). De contexto: mide otra cosa (renta de todo el hogar, gastos de la vivienda).
"""
import json
import pathlib

RAIZ = pathlib.Path(__file__).resolve().parent.parent
CLEAN, RAW = RAIZ / "data" / "clean", RAIZ / "data" / "raw" / "t21"
ANOS = ("2007", "2013", "2016", "2019", "2025")
CRISIS = "2013"


def ine(fichero, nombre):
    for s in json.loads((RAW / fichero).read_text(encoding="utf-8")):
        if s["Nombre"].strip() == nombre:
            return {str(x["Anyo"]): x["Valor"] for x in s["Data"]}
    raise KeyError(nombre)


def eurostat(fichero, fijar):
    d = json.loads((RAW / fichero).read_text(encoding="utf-8"))
    ids, size, dims = d["id"], d["size"], d["dimension"]
    idx = {k: dims[k]["category"]["index"] for k in ids}
    out = {}
    for t, ti in idx["time"].items():
        pos = 0
        for k, n in zip(ids, size):
            pos = pos * n + (ti if k == "time" else idx[k][fijar[k]] if k in fijar else 0)
        if str(pos) in d["value"]:
            out[t] = d["value"][str(pos)]
    return out


def main():
    t1 = json.loads((CLEAN / "t1_cesta_horas.json").read_text(encoding="utf-8"))
    t16 = json.loads((CLEAN / "t16_coche.json").read_text(encoding="utf-8"))
    hora = {str(f["anyo"]): f["salario_neto_hora_mediana"] for f in t1["filas"]}
    neto_mes = dict(t16["sueldo"]["neto_mes"])
    # sueldo neto mediano de 2008 a 2015 con el método de T1
    import sys
    sys.path.insert(0, str(RAIZ / "scripts"))
    import calcular_t1_t2 as m
    med = m.anual(m.ine("ine_28191_eaes_medias_percentiles.json", "EAES738")[2])
    mea = m.anual(m.ine("ine_28191_eaes_medias_percentiles.json", "EAES741")[2])
    hor = m.anual(m.ine("ine_30046_eaes_salario_por_hora.json", "EAES2013")[2])
    ids, net = m.eurostat("eurostat_earn_nt_net.json")
    for a in range(2008, 2016):
        rn, _ = m.ratio_neto(a, med[a][0], ids, net)
        hora[str(a)] = round(hor[a][0] * med[a][0] / mea[a][0] * rn, 2)
        neto_mes[str(a)] = round(med[a][0] * rn / 12)
    assert abs(hor[2016][0] * med[2016][0] / mea[2016][0] * m.ratio_neto(2016, med[2016][0], ids, net)[0] - hora["2016"]) < 0.01
    micro = json.loads((RAW / "epf_micro_alquiler_resumen.json").read_text(encoding="utf-8"))

    tabla = ine("ine_73827_epf_pct_hogares_codigos.json", "Gasto medio por hogar. Alquileres reales (vivienda principal). Dato base.")
    pct_con_gasto = ine("ine_73827_epf_pct_hogares_codigos.json", "Porcentaje de hogares con gasto. Alquileres reales (vivienda principal). Dato base.")
    SERIE = [str(a) for a in range(2007, 2016)] + ["2016", "2017", "2018", "2019", "2021", "2022", "2023", "2024", "2025"]
    anual = {**{a: micro[a]["alquiler_medio_inquilino_anual"] for a in micro if a != "2016"}, **{a: tabla[a] for a in SERIE if a in tabla}}
    inquilinos_pct = {**{a: micro[a]["hogares_inquilinos_pct"] for a in micro if a != "2016"}, **{a: pct_con_gasto[a] for a in SERIE if a in pct_con_gasto}}
    alquiler = {}
    for a in [x for x in SERIE if x in hora and x in anual]:
        mes = anual[a] / 12
        alquiler[a] = {
            "alquiler_anual": round(anual[a], 2), "alquiler_mes": round(mes), "estado": "C" if int(a) < 2016 else "V",
            "neto_hora_mediana": hora[a], "horas_mes": round(mes / hora[a], 1),
            "neto_mes_mediano": neto_mes.get(a), "parte_sueldo_pct": round(100 * mes / neto_mes[a], 1) if a in neto_mes else None,
            "hogares_que_alquilan_pct": inquilinos_pct[a],
        }

    ecv = "ine_9994_ecv_tenencia_edad.json"
    jovenes = {k: ine(ecv, f"Ambos sexos. De 16 a 29 años. Total Nacional. {k}. Hogar.") for k in ("Propiedad", "Alquiler a precio de mercado")}
    treinta = {k: ine(ecv, f"Ambos sexos. De 30 a 44 años. Total Nacional. {k}. Hogar.") for k in ("Propiedad", "Alquiler a precio de mercado")}
    total = {k: ine(ecv, f"Ambos sexos. Total. Total Nacional. {k}. Hogar.") for k in ("Propiedad", "Alquiler a precio de mercado")}
    quien = {
        "16_29": {"propiedad_pct": {a: jovenes["Propiedad"][a] for a in ANOS}, "alquiler_mercado_pct": {a: jovenes["Alquiler a precio de mercado"][a] for a in ANOS}},
        "30_44": {"propiedad_pct": {a: treinta["Propiedad"][a] for a in ANOS}, "alquiler_mercado_pct": {a: treinta["Alquiler a precio de mercado"][a] for a in ANOS}},
        "todos": {"propiedad_pct": {a: total["Propiedad"][a] for a in ANOS}, "alquiler_mercado_pct": {a: total["Alquiler a precio de mercado"][a] for a in ANOS}},
        "nota": "Hogares según la edad de la persona de referencia (INE, Encuesta de Condiciones de Vida, tabla 9994).",
    }
    emancipacion = eurostat("eurostat_yth_demo_030_edad_emancipacion_es.json", {"sex": "T", "unit": "AVG"})
    sobrecarga = eurostat("eurostat_ilc_lvho07c_sobrecarga_tenencia_es.json", {"tenure": "RENT_MKT", "unit": "PC"})

    h = {a: alquiler[a]["horas_mes"] for a in ANOS}
    out = {
        "tema": "El alquiler en horas de trabajo y quién alquila: 2007, 2016, 2019 y hoy",
        "nota": "«Hoy» = 2025, último año de la EPF y de la ECV. El alquiler es la media de todos los hogares inquilinos de "
                "España (contratos viejos y nuevos, a precio de mercado o inferior), no el precio de un piso que se anuncia hoy.",
        "alquiler": alquiler,
        "metodo_2007": {"micro_2016_mes": micro["2016"]["alquiler_medio_inquilino_mes"], "tabla_2016_mes": round(tabla["2016"] / 12, 2),
                        "diferencia_pct": round(100 * (micro["2016"]["alquiler_medio_inquilino_anual"] / tabla["2016"] - 1), 1)},
        "horas_hoy_frente_a": {a: round(h["2025"] - h[a], 1) for a in ("2007", "2013", "2016", "2019")},
        "horas_al_anyo_mas_que_2016": round(12 * (h["2025"] - h["2016"]), 1),
        "crisis": CRISIS,
        "quien_alquila": quien,
        "edad_emancipacion": {a: emancipacion.get(a) for a in ANOS},
        "edad_emancipacion_nota": "Eurostat, yth_demo_030 (estimación a partir de la EU-SILC); corte de serie en 2021.",
        "sobrecarga_inquilinos_mercado_pct": {a: sobrecarga.get(a) for a in ANOS},
    }
    CLEAN.mkdir(parents=True, exist_ok=True)
    (CLEAN / "t21_alquiler.json").write_text(json.dumps(out, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    for a in ANOS:
        x = alquiler[a]
        print(a, f"{x['alquiler_mes']} €/mes · {x['horas_mes']} h · {x['parte_sueldo_pct']} % del sueldo · alquilan {x['hogares_que_alquilan_pct']} % ·"
              f" jóvenes: propiedad {quien['16_29']['propiedad_pct'][a]} %, alquiler {quien['16_29']['alquiler_mercado_pct'][a]} % ·"
              f" emancipación {emancipacion.get(a)} · sobrecarga {sobrecarga.get(a)} %")
    print("horas hoy frente a:", out["horas_hoy_frente_a"], "· método 2007:", out["metodo_2007"])


if __name__ == "__main__":
    main()
