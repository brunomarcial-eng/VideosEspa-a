#!/usr/bin/env python3
"""Datos limpios de T23: ¿cuántas horas trabajas para tener la casa caliente? (Bruno eligió la calefacción, 24-11-2026).

Todo oficial (INE):
  · Gasto medio por hogar en «Electricidad, gas y otros combustibles» (luz, gas natural y butano, gasóleo de
    calefacción, leña…): Encuesta de Presupuestos Familiares (EPF).
      2007 y 2013: EPF base 2006, tabla 10628 (subgrupos, 3 dígitos) (V).
      2016, 2019 y 2025: EPF base 2016, tabla 73779 (subgrupos, «gasto total») (V).
      Cambio de base en 2016: 2015 da 1.110,40 € (base 2006) y 2016, 1.054,75 € (base 2016). Se dice en la ficha.
      Desglose (4 dígitos): tablas 10629 (base 2006) y 73780 (base 2016).
  · Sueldo neto mediano por hora: el de T1 y T21 (INE, EAES y ETCL; 2013 con el método de T1; 2025 = EAES 2024 ×
    ETCL 2025/2024) (C). Se lee de data/clean/t21_alquiler.json.
  · Horas de trabajo al año = gasto anual / sueldo neto mediano por hora (C).
  · Personas que no pueden permitirse mantener la vivienda con una temperatura adecuada: Encuesta de Condiciones de
    Vida (ECV), tabla 9967 (por edad y sexo) y tabla 9973 (por decil de renta por unidad de consumo; desde 2008) (V).
  · Personas en número: % de la ECV × población residente (INE, ECP, media de 2025) (C, orientativo).
  · Años: 2007 (antes de la crisis), 2013 (plena crisis, como en T21), 2016, 2019 y hoy (2025, último año de la EPF y la ECV).

Uso: python3 scripts/calcular_t23.py → data/clean/t23_calefaccion.json
"""
import json
import pathlib

RAIZ = pathlib.Path(__file__).resolve().parent.parent
RAW, CLEAN = RAIZ / "data" / "raw" / "t23", RAIZ / "data" / "clean"
ANOS = ("2007", "2013", "2016", "2019", "2025")
CRISIS, HOY = "2013", "2025"


def ine(fichero, nombre):
    for s in json.loads((RAW / fichero).read_text(encoding="utf-8")):
        if s["Nombre"].strip() == nombre:
            return {str(x["Anyo"]): x["Valor"] for x in s["Data"] if x["Valor"] is not None}
    raise KeyError(f"{fichero}: {nombre}")


def main():
    pct = lambda a, b: round(100 * (b / a - 1), 1)
    hora = {a: v["neto_hora_mediana"] for a, v in json.loads((CLEAN / "t21_alquiler.json").read_text(encoding="utf-8"))["alquiler"].items()}

    b06 = ine("ine_10628_epf2006_subgrupos.json", "Base 2006. Anual. Total Nacional. Electricidad, gas y otros combustibles. Gasto medio por hogar. Dato base.")
    b16 = ine("ine_73779_epf_subgrupos.json", "Electricidad, gas y otros combustibles. Dato base. Gasto total. Gasto medio por hogar. Precios corrientes.")
    gasto = {**b06, **b16}
    # desglose (4 dígitos)
    partes06 = {k: ine("ine_10629_epf2006_4digitos.json", f"Base 2006. Anual. Total Nacional. {k}. Gasto medio por hogar. Dato base.")
                for k in ("Electricidad", "Gas", "Combustibles líquidos", "Combustibles sólidos")}
    partes16 = {k: ine("ine_73780_epf_4digitos.json", f"{k}. Dato base. Gasto total. Gasto medio por hogar. Precios corrientes.")
                for k in ("Electricidad", "Gas", "Combustibles líquidos", "Combustibles sólidos")}

    frio = ine("ine_9967_ecv_carencia_edad.json",
               "Ambos sexos. Total. No puede permitirse mantener la vivienda con una temperatura adecuada. Personas. Total Nacional.")
    frio65 = ine("ine_9967_ecv_carencia_edad.json",
                 "Ambos sexos. 65 y más años. No puede permitirse mantener la vivienda con una temperatura adecuada. Personas. Total Nacional.")
    frio_men = ine("ine_9967_ecv_carencia_edad.json",
                   "Ambos sexos. Menores de 16 años. No puede permitirse mantener la vivienda con una temperatura adecuada. Personas. Total Nacional.")
    DEC = ("Primer", "Segundo", "Tercer", "Cuarto", "Quinto", "Sexto", "Septimo", "Octavo", "Noveno", "Décimo")
    decil = {d: ine("ine_9973_ecv_carencia_decil.json",
                    f"No puede permitirse mantener la vivienda con una temperatura adecuada. Total Nacional. Total. {d} decil. Personas.")
             for d in DEC}

    pob = json.loads((RAIZ / "data" / "raw" / "ine_ecp320_poblacion.json").read_text(encoding="utf-8"))
    pob = pob[0] if isinstance(pob, list) else pob
    p25 = [x["Valor"] for x in pob["Data"] if x["Anyo"] == 2025]
    poblacion_2025 = sum(p25) / len(p25)

    filas = {}
    for a in ANOS:
        g = gasto[a]
        partes = partes06 if int(a) < 2016 else partes16
        filas[a] = {
            "gasto_anual": round(g, 2), "gasto_mes": round(g / 12, 1), "base_epf": 2006 if int(a) < 2016 else 2016,
            "luz": round(partes["Electricidad"][a], 2), "gas": round(partes["Gas"][a], 2),
            "gasoleo": round(partes["Combustibles líquidos"][a], 2), "lena_carbon": round(partes["Combustibles sólidos"][a], 2),
            "neto_hora_mediana": hora[a],
            "horas_anyo": round(g / hora[a], 2), "horas_mes": round(g / 12 / hora[a], 2),
            "no_puede_calentar_pct": frio[a],
            "no_puede_calentar_65_pct": frio65[a], "no_puede_calentar_menores16_pct": frio_men[a],
            "no_puede_calentar_decil5_pct": decil["Quinto"].get(a), "no_puede_calentar_decil1_pct": decil["Primer"].get(a),
        }
    hoy = filas[HOY]
    out = {
        "nota": __doc__.strip().splitlines()[0],
        "anos": list(ANOS), "crisis": CRISIS, "hoy": HOY,
        "filas": filas,
        "serie_gasto_anual": {a: round(v, 2) for a, v in sorted(gasto.items())},
        "serie_no_puede_calentar_pct": dict(sorted(frio.items())),
        "serie_decil5_pct": dict(sorted(decil["Quinto"].items())),
        "deciles_hoy_pct": {d: decil[d].get(HOY) for d in DEC},
        "deciles_2019_pct": {d: decil[d].get("2019") for d in DEC},
        "pico_no_puede_calentar": max(frio.items(), key=lambda x: x[1]),
        "factura_sube_pct": {a: pct(filas[a]["gasto_anual"], hoy["gasto_anual"]) for a in ANOS if a != HOY},
        "sueldo_hora_sube_pct": {a: pct(filas[a]["neto_hora_mediana"], hoy["neto_hora_mediana"]) for a in ANOS if a != HOY},
        "horas_menos_que": {a: round(filas[a]["horas_anyo"] - hoy["horas_anyo"], 1) for a in ANOS if a != HOY},
        "veces_no_puede_calentar": {a: round(hoy["no_puede_calentar_pct"] / filas[a]["no_puede_calentar_pct"], 2) for a in ANOS if a != HOY},
        "veces_decil5": {a: round(hoy["no_puede_calentar_decil5_pct"] / filas[a]["no_puede_calentar_decil5_pct"], 2)
                         for a in ("2016", "2019") if filas[a]["no_puede_calentar_decil5_pct"]},
        "poblacion_2025": round(poblacion_2025),
        "personas_no_puede_calentar_hoy": round(poblacion_2025 * hoy["no_puede_calentar_pct"] / 100, -4),
        "cambio_base_epf": {"2015_base2006": round(b06["2015"], 2), "2016_base2016": round(b16["2016"], 2)},
        "estado": {
            "gasto": "V (INE, EPF)", "sueldo_hora": "C (método de T1)", "horas": "C",
            "no_puede_calentar": "V (INE, ECV)", "personas": "C (orientativo: % de la ECV × población media de 2025)",
        },
    }
    (CLEAN / "t23_calefaccion.json").write_text(json.dumps(out, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    for a in ANOS:
        f = filas[a]
        print(a, f"{f['gasto_anual']:8.2f} €/año  {f['gasto_mes']:6.1f} €/mes  {f['horas_anyo']:6.1f} h/año  {f['horas_mes']:4.1f} h/mes"
                 f"  frío {f['no_puede_calentar_pct']:4.1f} %  decil5 {f['no_puede_calentar_decil5_pct']}")
    for k in ("factura_sube_pct", "sueldo_hora_sube_pct", "horas_menos_que", "veces_no_puede_calentar", "veces_decil5",
              "pico_no_puede_calentar", "personas_no_puede_calentar_hoy", "cambio_base_epf", "deciles_hoy_pct", "deciles_2019_pct"):
        print(k, out[k])


if __name__ == "__main__":
    main()
