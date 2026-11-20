#!/usr/bin/env python3
"""Datos limpios de T9: ¿cuántas horas de trabajo te cuesta vivir? 1986, 2006, 2016 y hoy.

Todo se mide en tiempo de trabajo del trabajador medio (sueldo medio; en 1986 solo hay media):
  · Días del año que trabajas para el Estado: (IRPF + cotizaciones del trabajador y de la empresa) / lo que cuesta
    el trabajador a la empresa, por 365 días. Mismo motor que T8 (scripts/calcular_t8.py).
  · Piso de 90 m²: años de sueldo neto (precio de T3 / sueldo neto anual medio).
  · Depósito de 50 litros de gasóleo: horas de trabajo (precio / sueldo neto por hora).
  · Luz de una casa (3.500 kWh al año, Eurostat): horas de trabajo al año.
  · Compra de comida de un mes por persona (cesta fija de T1): horas de trabajo.

Sueldo por hora, bruto (media):
  1986: retribución media por hora trabajada (INE, Encuesta de Salarios; industria y servicios), V.
  2006: EAES 2008 × ETCL 2006/2008 (como el 2007 de T1), C.  2016: EAES, V.
  2026: EAES 2024 × ETCL (1.er semestre de 2026 / 1.er semestre de 2024), C.
Neto/bruto del sueldo medio: motor de T8 en 1986, 2006 y 2026; en 2016, Eurostat (earn_nt_net), como T1.
Carburante de 2026 con los impuestos de la ley (sin rebajas temporales), como T8. Luz: 2025, último año entero sin rebajas.

Uso: python3 scripts/calcular_t9.py → data/clean/t9_horas.json
"""
import datetime
import html
import json
import pathlib
import re
import sys

RAIZ = pathlib.Path(__file__).resolve().parent.parent
RAW, CLEAN = RAIZ / "data" / "raw", RAIZ / "data" / "clean"
sys.path.insert(0, str(RAIZ / "scripts"))
import calcular_t1_t2 as T1  # noqa: E402
import calcular_t8 as T8  # noqa: E402

PTS = T8.PTS


def boe(fichero, *frases):
    t = re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", (RAW / fichero).read_text(encoding="utf-8", errors="replace"))))
    for f in frases:
        if f not in t:
            raise SystemExit(f"no encuentro «{f}» en {fichero}")


def r(x, n=2):
    return round(x, n)


def carburante_1986():
    """Precios de venta al público fijados por el Gobierno (Monopolio de Petróleos), pesetas por litro, impuestos incluidos."""
    boe("boe_orden_09_01_1985_carburantes.html", "GASOLEO A/62")
    boe("boe_orden_11_12_1985_carburantes.html", "A PARTIR DE LAS CERO HORAS DEL DIA 13 DE DICIEMBRE DE 1985",
        "GASOLINA AUTO 97 I.O. SUPER 87")
    boe("boe_orden_28_02_1986_carburantes.html", "A PARTIR DE LAS CERO HORAS DEL DIA 1 DE MARZO DE 1986",
        "GASOLINA AUTO I.O. 97 (SUPER) 82,00", "GASOLEO A 60,00")
    ene_feb, resto = 31 + 28, 365 - 31 - 28
    return {"gasoleo_a_pts": r((62 * ene_feb + 60 * resto) / 365, 2), "gasolina_super_pts": r((87 * ene_feb + 82 * resto) / 365, 2),
            "nota": ("Media del año ponderada por días: gasóleo A a 62 pesetas el litro en enero y febrero (Orden de 9-1-1985) y a 60 desde el 1 de marzo "
                     "(Orden de 28-2-1986); gasolina súper a 87 (Orden de 11-12-1985) y a 82. Impuestos incluidos.")}


def luz():
    """Eurostat nrg_pc_204: precio de la electricidad de los hogares, todos los impuestos, € por kWh (semestral)."""
    d = json.loads((RAW / "eurostat_nrg_pc_204_es.json").read_text(encoding="utf-8"))
    dims, size = d["id"], d["size"]
    idx = {k: d["dimension"][k]["category"]["index"] for k in dims}

    def v(banda, t):
        c = {"freq": "S", "siec": "E7000", "nrg_cons": banda, "unit": "KWH", "tax": "I_TAX", "currency": "EUR", "geo": "ES", "time": t}
        flat = 0
        for k, s in zip(dims, size):
            flat = flat * s + idx[k][c[k]]
        return d["value"][str(flat)]

    antigua = (v("KWH3500", "2006-S1") + v("KWH3500", "2006-S2")) / 2
    enlace = v("KWH2500-4999", "2007-S2") / v("KWH3500", "2007-S2")   # cambio de método en 2007: se enlaza en el semestre que coinciden
    kwh = {"2006": antigua * enlace, "2016": (v("KWH2500-4999", "2016-S1") + v("KWH2500-4999", "2016-S2")) / 2,
           "2025": (v("KWH2500-4999", "2025-S1") + v("KWH2500-4999", "2025-S2")) / 2}
    return {"euros_kwh": {a: r(x, 4) for a, x in kwh.items()}, "consumo_kwh_ano": 3500,
            "factura_ano": {a: r(x * 3500, 2) for a, x in kwh.items()},
            "enlace_2007": r(enlace, 4), "kwh_2006_metodo_antiguo": r(antigua, 4),
            "nota": ("Eurostat, nrg_pc_204: hogares, con todos los impuestos. Hasta 2007, consumidor tipo de 3.500 kWh al año; desde el 2.º semestre de 2007, "
                     "tramo de 2.500 a 5.000 kWh. 2006 se enlaza con el semestre en que coinciden los dos métodos (2007-S2). 2025: último año entero "
                     "(en 2026 hubo rebajas temporales del IVA y del impuesto de la electricidad).")}


def ocde():
    """OCDE, Taxing Wages: soltero sin hijos con el sueldo medio (AW100). Cuña fiscal (% del coste laboral) y neto / bruto."""
    import csv
    v = {}
    with (RAW / "oecd_taxing_wages_esp.csv").open(encoding="utf-8") as f:
        for r in csv.DictReader(f):
            if r["HOUSEHOLD_TYPE"] == "S_C0" and r["INCOME_PRINCIPAL"] == "AW100":
                v[(r["MEASURE"], r["UNIT_MEASURE"], r["TIME_PERIOD"])] = float(r["OBS_VALUE"])
    return {a: {"cuna_pct": v[("AV_TW", "PT_COS_LB", a)], "neto_bruto": v[("NIAT", "XDC", a)] / v[("GEBT", "XDC", a)],
                "bruto_ocde": v[("GEBT", "XDC", a)], "neto_ocde": v[("NIAT", "XDC", a)]} for a in ("2016", "2025")}


def diez_anos(t1, t3, bruto_h, anual, piso, dep, L, f25, compra):
    """T9, versión 2016 frente a hoy (Bruno, 20-11-2026): todo con el neto / bruto de la OCDE, para que los dos años
    se midan igual. «Hoy» = 2026 donde hay dato de 2026 y 2025 donde no (OCDE y luz)."""
    O = ocde()
    rn = {"2016": O["2016"]["neto_bruto"], "2026": O["2025"]["neto_bruto"]}
    neto_h = {a: bruto_h[a] * rn[a] for a in ("2016", "2026")}
    neto_anual = {a: anual[a] * rn[a] for a in ("2016", "2026")}
    ipc = t3["hace_40_anos"]["ipc_media_anual"]
    real16 = neto_anual["2016"] * ipc["2026"] / ipc["2016"]
    luz_h25 = f25["salario_bruto_hora_media"] * O["2025"]["neto_bruto"]
    dia = lambda pct: datetime.date(2026, 1, 1) + datetime.timedelta(days=round(365 * pct / 100) - 1)
    est = {a: {"cuna_pct": r(O[a]["cuna_pct"], 2), "dias": r(365 * O[a]["cuna_pct"] / 100, 1), "dia": dia(O[a]["cuna_pct"]).day,
               "mes": dia(O[a]["cuna_pct"]).month} for a in ("2016", "2025")}
    pisos = {a: r(piso[a] / neto_anual[a], 1) for a in ("2016", "2026")}
    depo = {a: r(dep[a]["deposito_eur"] / neto_h[a], 1) for a in ("2016", "2026")}
    luzh = {"2016": r(L["factura_ano"]["2016"] / neto_h["2016"], 1), "2025": r(L["factura_ano"]["2025"] / luz_h25, 1)}
    com = {a: r(compra[a]["euros_mes"] / neto_h[a], 1) for a in ("2016", "2026")}
    pct = lambda a, b: r(100 * (b / a - 1), 1)
    return {
        "nota": ("Neto / bruto y cuña fiscal del trabajador medio soltero sin hijos: OCDE, Taxing Wages (2016 y 2025, último año). "
                 "Sueldo bruto por hora y anual: INE (EAES 2016; 2026 = EAES 2024 por la ETCL). Precios como en el resto de T9."),
        "neto_bruto": {a: r(x, 4) for a, x in rn.items()}, "neto_hora_eur": {a: r(x) for a, x in neto_h.items()},
        "neto_hora_2025_luz": r(luz_h25), "neto_anual_eur": {a: r(x, 0) for a, x in neto_anual.items()},
        "neto_anual_2016_en_euros_de_2026": r(real16, 0), "neto_real_sube_pct": pct(real16, neto_anual["2026"]),
        "bruto_anual_real_sube_pct": pct(anual["2016"] * ipc["2026"] / ipc["2016"], anual["2026"]),
        "estado": est, "piso_anos": pisos, "deposito_horas": depo, "luz_horas_ano": luzh, "compra_horas": com,
        "sube_pct": {"estado_dias": pct(est["2016"]["dias"], est["2025"]["dias"]), "piso": pct(pisos["2016"], pisos["2026"]),
                     "deposito": pct(depo["2016"], depo["2026"]), "luz": pct(luzh["2016"], luzh["2025"]), "compra": pct(com["2016"], com["2026"])},
    }


def main():
    N, I = T8.normas(), T8.ipc_largo()
    t3 = json.loads((CLEAN / "t3_vivienda.json").read_text(encoding="utf-8"))
    t1 = json.loads((CLEAN / "t1_cesta_horas.json").read_text(encoding="utf-8"))
    t8 = json.loads((CLEAN / "t8_impuestos_sueldo.json").read_text(encoding="utf-8"))
    tc = json.loads((CLEAN / "t8_contraste.json").read_text(encoding="utf-8"))

    # --- sueldo bruto por hora (media)
    _, _, hor = T1.ine("ine_30046_eaes_salario_por_hora.json", "EAES2013")
    _, _, e93 = T1.ine("ine_6078_etcl_coste_salarial_hora.json", nombre=lambda n: n.startswith(
        "Ambas jornadas. Industria, construcción y servicios") and "total por hora" in n)
    _, _, e09 = T1.ine("ine_6040_etcl_coste_salarial_hora_2008.json", nombre=lambda n: n.startswith(
        "Ambas jornadas. Industria, construcción y servicios") and "total por hora" in n)
    hor_a, e93_a, e09_a = T1.anual(hor), T1.anual(e93), T1.anual(e09)
    sem = lambda pts, a: sum(p["Valor"] for p in pts if p["Anyo"] == a and p["T3_Periodo"] in ("T1", "T2")) / 2
    f06 = e93_a[2006][0] / e09_a[2008][0]
    f26 = sem(e09, 2026) / sem(e09, 2024)
    h86 = t3["hace_40_anos"]["sueldo_1986"]["retribucion_hora_pts"]
    bruto_h = {"1986": h86 / PTS, "2006": hor_a[2008][0] * f06, "2016": hor_a[2016][0], "2026": hor_a[2024][0] * f26}

    # --- sueldo anual medio y neto/bruto
    anual = {"1986": t3["hace_40_anos"]["sueldo_1986"]["anual_pts"], "2006": 19686.0, "2016": t3["sueldos_eaes"]["media"]["2016"],
             "2026": tc["sueldos"]["bruto_en_euros_de_2026"]["media"]["2026"]}   # 2026: EAES 2024 × ETCL (estimación de T8)
    ratio, estado = {}, {}
    for a in ("1986", "2006", "2026"):
        n = N[a]
        emp, tra = T8.cotizaciones(n, "cajero", anual[a])
        ce, ct = sum(emp.values()), sum(tra.values())
        ir, _ = T8.irpf(a, n, anual[a], ct)
        ratio[a] = (anual[a] - ct - ir) / anual[a]
        estado[a] = (ir + ct + ce) / (anual[a] + ce)
    ratio["2016"] = next(f["ratio_neto_bruto_media"] for f in t1["filas"] if f["anyo"] == 2016)
    neto_h = {a: bruto_h[a] * ratio[a] for a in bruto_h}
    neto_anual = {a: anual[a] * ratio[a] / (PTS if a == "1986" else 1) for a in anual}

    # --- 1. días para el Estado
    def fecha(dias):
        d = datetime.date(2026, 1, 1) + datetime.timedelta(days=round(dias) - 1)
        return f"{d.day} de {['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'][d.month - 1]}"
    dia = lambda dias: (datetime.date(2026, 1, 1) + datetime.timedelta(days=round(dias) - 1))
    estado_out = {a: {"pct_del_coste": r(100 * estado[a], 2), "dias": r(365 * estado[a], 1), "hasta_el": fecha(365 * estado[a]),
                      "dia": dia(365 * estado[a]).day, "mes": dia(365 * estado[a]).month} for a in estado}

    # --- 2. piso de 90 m² (T3)
    piso = {"1986": t3["hace_40_anos"]["piso_90m2_1986_eur"], **{a: t3["calculos"]["vivienda_90m2"][a] for a in ("2006", "2016", "2026")}}
    piso_out = {a: {"precio_eur": r(piso[a], 0), "anos_de_sueldo_neto": r(piso[a] / neto_anual[a], 1)} for a in piso}

    # --- 3. depósito de 50 litros de gasóleo
    c86 = carburante_1986()
    litro = {"1986": c86["gasoleo_a_pts"] / PTS, **{a: t8["carburante"]["gasoleo"][a]["precio"] for a in ("2006", "2016", "2026")}}
    dep = {a: {"litro_eur": r(litro[a], 4), "deposito_eur": r(50 * litro[a], 2), "horas": r(50 * litro[a] / neto_h[a], 1)} for a in litro}
    super86 = 50 * c86["gasolina_super_pts"] / PTS / neto_h["1986"]
    gas95 = {a: r(50 * t8["carburante"]["gasolina95"][a]["precio"] / neto_h[a], 1) for a in ("2006", "2016", "2026")}

    # --- 4. luz (3.500 kWh al año); 2025 con el sueldo de 2025 de T1
    L = luz()
    f25 = next(f for f in t1["filas"] if f["anyo"] == 2025)
    neto_h_luz = {"2006": neto_h["2006"], "2016": neto_h["2016"], "2025": f25["salario_neto_hora_media"]}
    luz_out = {a: {"factura_ano": L["factura_ano"][a], "horas_ano": r(L["factura_ano"][a] / neto_h_luz[a], 1)} for a in ("2006", "2016", "2025")}

    # --- 5. compra de comida de un mes por persona (cesta fija de T1: EPF 2025 / 12 con el IPC de alimentos)
    _, _, ali = T1.ine("ine_76125_ipc_grupos.json", "IPC290755")
    ali_a = T1.anual(ali)
    cesta = {a: t1["cesta_2025_euros_mes"] * ali_a[int(a)][0] / ali_a[2025][0] for a in ("2006", "2016", "2026")}
    compra = {a: {"euros_mes": r(cesta[a]), "horas": r(cesta[a] / neto_h[a], 1)} for a in cesta}

    out = {
        "tema": "T9 — ¿Cuántas horas de trabajo te cuesta vivir? 1986, 2006, 2016 y hoy (trabajador medio)",
        "sueldo": {"bruto_hora_eur": {a: r(x) for a, x in bruto_h.items()}, "neto_bruto": {a: r(x, 4) for a, x in ratio.items()},
                   "neto_hora_eur": {a: r(x) for a, x in neto_h.items()}, "neto_hora_2025_luz": r(neto_h_luz["2025"]),
                   "bruto_anual": {a: r(x, 0) for a, x in anual.items()}, "neto_anual_eur": {a: r(x, 0) for a, x in neto_anual.items()},
                   "etcl_2006_2008": r(f06, 4), "etcl_1s2026_1s2024": r(f26, 4),
                   "nota": ("Media (en 1986 no hay mediana). 1986: 740 pesetas por hora (INE, Encuesta de Salarios, industria y servicios). "
                            "2006: EAES 2008 por la ETCL 2006/2008. 2016: EAES. 2026: EAES 2024 por la ETCL del 1.er semestre de 2026 frente al de 2024. "
                            "Neto: IRPF y cotizaciones del trabajador con las normas del BOE de cada año (motor de T8; Madrid en 2026); 2016, Eurostat.")},
        "estado_dias": estado_out,
        "piso_90m2": piso_out,
        "deposito_gasoleo_50l": dep,
        "deposito_gasolina_50l_horas": {"1986_super": r(super86, 1), **gas95},
        "carburante_1986": c86,
        "luz_3500kwh": {**luz_out, "detalle": L},
        "compra_mes_persona": compra,
        "sube_pct": {
            "estado_dias": {a: r(100 * (estado["2026"] / estado[a] - 1), 1) for a in ("1986", "2006")},
            "piso": {a: r(100 * (piso_out["2026"]["anos_de_sueldo_neto"] / piso_out[a]["anos_de_sueldo_neto"] - 1), 1) for a in ("1986", "2006", "2016")},
            "deposito": {a: r(100 * (dep["2026"]["horas"] / dep[a]["horas"] - 1), 1) for a in ("1986", "2006", "2016")},
            "luz": {a: r(100 * (luz_out["2025"]["horas_ano"] / luz_out[a]["horas_ano"] - 1), 1) for a in ("2006", "2016")},
            "compra": {a: r(100 * (compra["2026"]["horas"] / compra[a]["horas"] - 1), 1) for a in ("2006", "2016")},
        },
    }
    out["diez_anos"] = diez_anos(t1, t3, bruto_h, anual, piso, dep, L, f25, compra)
    (CLEAN / "t9_horas.json").write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding="utf-8")
    print("diez_anos", json.dumps(out["diez_anos"], ensure_ascii=False))
    for k in ("sueldo", "estado_dias", "piso_90m2", "deposito_gasoleo_50l", "deposito_gasolina_50l_horas", "luz_3500kwh", "compra_mes_persona", "sube_pct"):
        v = dict(out[k]); v.pop("detalle", None); v.pop("nota", None)
        print(k, json.dumps(v, ensure_ascii=False))


if __name__ == "__main__":
    main()
