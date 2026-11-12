#!/usr/bin/env python3
"""Calcula los datos limpios de T1 (cesta en horas) y T2 (empleo) del test.

Lee solo ficheros de data/raw/ (descargados con descargar_datos.py) y escribe:
  data/clean/t1_cesta_horas.json
  data/clean/t2_empleo.json

Estados: V = leído en la fuente oficial · C = cálculo propio (fórmula en el JSON).
Nunca se usa 2020. Metodología: docs/metodologia-horas.md.

Uso: python3 scripts/calcular_t1_t2.py
"""
import csv
import json
import pathlib
from collections import defaultdict

RAIZ = pathlib.Path(__file__).resolve().parent.parent
RAW = RAIZ / "data" / "raw"
CLEAN = RAIZ / "data" / "clean"

ANYOS_T1 = [2016, 2018, 2019, 2024]          # años con salario oficial (EAES)
ANYOS_T2 = [2007, 2016, 2018, 2019]          # + «hoy»
EXCLUIDOS = {2020}


# ---------------------------------------------------------------- lectura
def manifest():
    with (RAW / "MANIFEST.csv").open(encoding="utf-8") as f:
        return {r["fichero"]: r for r in csv.DictReader(f)}


def ine(fichero, cod=None, nombre=None):
    """Devuelve (nombre, lista de puntos) de una serie del INE por código o por texto."""
    for s in json.loads((RAW / fichero).read_text(encoding="utf-8")):
        if (cod and s["COD"] == cod) or (nombre and nombre(s["Nombre"])):
            return s["COD"], s["Nombre"].strip(), s["Data"]
    raise KeyError(f"{fichero}: serie no encontrada ({cod})")


def anual(puntos):
    """Valor anual (si la serie es anual) o media de los periodos del año."""
    acc = defaultdict(list)
    for p in puntos:
        if p["Valor"] is not None:
            acc[p["Anyo"]].append(p["Valor"])
    return {a: (sum(v) / len(v), len(v)) for a, v in acc.items()}


def periodo(puntos, anyo, per):
    for p in puntos:
        if p["Anyo"] == anyo and p.get("T3_Periodo") == per:
            return p["Valor"]
    return None


def eurostat(fichero):
    """JSON-stat de Eurostat -> {tupla de categorías: valor}."""
    d = json.loads((RAW / fichero).read_text(encoding="utf-8"))
    ids, size = d["id"], d["size"]
    cats = [sorted(d["dimension"][i]["category"]["index"],
                   key=lambda k, i=i: d["dimension"][i]["category"]["index"][k]) for i in ids]
    out = {}
    for pos, val in d["value"].items():
        p, coords = int(pos), []
        for s in reversed(size):
            coords.append(p % s)
            p //= s
        coords.reverse()
        out[tuple(cats[j][c] for j, c in enumerate(coords))] = val
    return ids, out


def ratio_neto(anyo, bruto, ids, net):
    """Neto/bruto de un soltero sin hijos con ese bruto anual.

    Interpolación lineal entre los casos de Eurostat earn_nt_net
    (50, 67, 80, 100, 125 y 167 % del salario medio), que aplican el modelo
    de impuestos y cotizaciones de la OCDE de cada año.
    """
    g = ids.index("geo"); t = ids.index("time"); e = ids.index("estruct"); c = ids.index("ecase")
    puntos = []
    for caso in ["P1_NCH_AW50", "P1_NCH_AW67", "P1_NCH_AW80", "P1_NCH_AW100",
                 "P1_NCH_AW125", "P1_NCH_AW167"]:
        def v(est):
            for k, val in net.items():
                if k[g] == "ES" and k[t] == str(anyo) and k[e] == est and k[c] == caso:
                    return val
            return None
        if v("GRS") and v("NET"):
            puntos.append((v("GRS"), v("NET"), caso))
    puntos.sort()
    for (g0, n0, c0), (g1, n1, c1) in zip(puntos, puntos[1:]):
        if g0 <= bruto <= g1:
            neto = n0 + (n1 - n0) * (bruto - g0) / (g1 - g0)
            return neto / bruto, {"entre": [c0, c1], "bruto": [g0, g1], "neto": [n0, n1]}
    raise ValueError(f"{anyo}: bruto {bruto} fuera de rango {puntos}")


def r(x, n=2):
    return None if x is None else round(x, n)


# ---------------------------------------------------------------- T1
def t1(man):
    _, n_med, med = ine("ine_28191_eaes_medias_percentiles.json", "EAES738")
    _, n_mea, mea = ine("ine_28191_eaes_medias_percentiles.json", "EAES741")
    _, n_hor, hor = ine("ine_30046_eaes_salario_por_hora.json", "EAES2013")
    _, n_ali, ali = ine("ine_76125_ipc_grupos.json", "IPC290755")
    _, n_gen, gen = ine("ine_76125_ipc_grupos.json", "IPC290751")
    _, n_epf, epf = ine("ine_73778_epf_gasto_grupos.json", "EPF534996")
    c93, n_e93, e93 = ine("ine_6078_etcl_coste_salarial_hora.json", nombre=lambda n: n.startswith(
        "Ambas jornadas. Industria, construcción y servicios") and "total por hora" in n)
    c09, n_e09, e09 = ine("ine_6040_etcl_coste_salarial_hora_2008.json", nombre=lambda n: n.startswith(
        "Ambas jornadas. Industria, construcción y servicios") and "total por hora" in n)
    ids, net = eurostat("eurostat_earn_nt_net.json")

    med, mea, hor = anual(med), anual(mea), anual(hor)
    ali_a, gen_a, epf = anual(ali), anual(gen), anual(epf)
    e93, e09 = anual(e93), anual(e09)

    # Cesta fija: gasto medio por persona en alimentos y bebidas no alcohólicas (EPF 2025) / 12
    cesta_2025 = epf[2025][0] / 12

    def fila(anyo, bruto_h_media, med_anual, mea_anual, estado_sal, nota_sal):
        ratio_mm = med_anual / mea_anual
        bruto_h_mediana = bruto_h_media * ratio_mm
        rn_med, det_med = ratio_neto(anyo, med_anual, ids, net)
        rn_mea, det_mea = ratio_neto(anyo, mea_anual, ids, net)
        neto_h_mediana = bruto_h_mediana * rn_med
        neto_h_media = bruto_h_media * rn_mea
        precio = cesta_2025 * ali_a[anyo][0] / ali_a[2025][0]
        return {
            "anyo": anyo,
            "ipc_alimentos_media_anual": r(ali_a[anyo][0], 3),
            "ipc_general_media_anual": r(gen_a[anyo][0], 3),
            "cesta_euros_mes": r(precio),
            "salario_bruto_hora_media": r(bruto_h_media),
            "ganancia_anual_mediana": r(med_anual),
            "ganancia_anual_media": r(mea_anual),
            "ratio_mediana_media": r(ratio_mm, 4),
            "salario_bruto_hora_mediana": r(bruto_h_mediana),
            "ratio_neto_bruto_mediana": r(rn_med, 4),
            "ratio_neto_bruto_media": r(rn_mea, 4),
            "interpolacion_neto_mediana": det_med,
            "salario_neto_hora_mediana": r(neto_h_mediana),
            "salario_neto_hora_media": r(neto_h_media),
            "horas_neto_mediana": r(precio / neto_h_mediana, 1),
            "horas_neto_media": r(precio / neto_h_media, 1),
            "horas_bruto_mediana": r(precio / bruto_h_mediana, 1),
            "estado_salario": estado_sal,
            "nota_salario": nota_sal,
        }

    filas = []
    for a in ANYOS_T1:
        assert a not in EXCLUIDOS
        filas.append(fila(a, hor[a][0], med[a][0], mea[a][0], "V",
                          "EAES: salario medio por hora y ganancia anual (V)"))

    # 2007 (opcional, C): la EAES empieza en 2008. Se retropola con la ETCL
    # (coste salarial total por hora efectiva), que cambia de CNAE-93 a CNAE-09 en 2008.
    f07 = e93[2007][0] / e09[2008][0]
    filas.insert(0, fila(2007, hor[2008][0] * f07, med[2008][0] * f07, mea[2008][0] * f07, "C",
                         f"EAES 2008 x ETCL 2007/2008 ({r(e93[2007][0],3)}/{r(e09[2008][0],3)}); "
                         "corte de serie CNAE-93 -> CNAE-09"))
    # 2025 (opcional, C): EAES 2025 aún no publicada. Se extiende 2024 con la ETCL.
    f25 = e09[2025][0] / e09[2024][0]
    filas.append(fila(2025, hor[2024][0] * f25, med[2024][0] * f25, mea[2024][0] * f25, "C",
                      f"EAES 2024 x ETCL 2025/2024 ({r(e09[2025][0],3)}/{r(e09[2024][0],3)})"))

    # Contraste: gasto real de cada año (EPF del propio año, no cesta fija).
    # Mezcla precio y cantidad; la EPF base 2016 no tiene 2007 comparable.
    for f in filas:
        a = f["anyo"]
        if a in epf and f["estado_salario"] == "V" or a == 2025:
            gasto_mes = epf[a][0] / 12
            f["epf_gasto_real_mes"] = r(gasto_mes)
            f["horas_neto_mediana_gasto_real"] = r(gasto_mes / f["salario_neto_hora_mediana"], 1)

    # Últimos 12 meses de IPC alimentos (para decir si 2026 sigue subiendo)
    ult = sorted(ali, key=lambda p: p["Fecha"])
    ult12 = [p["Valor"] for p in ult[-12:]]
    ult_mes = ult[-1]
    mismo_mes_antes = next(p for p in ult if p["Anyo"] == ult_mes["Anyo"] - 1
                           and p["T3_Periodo"] == ult_mes["T3_Periodo"])

    fuentes = {k: {"descripcion": v["descripcion"], "web": v["url_web"], "api": v["url_api"],
                   "consultado": v["consultado_utc"], "sha256": v["sha256"]}
               for k, v in man.items()
               if k.startswith(("ine_28191", "ine_30046", "ine_76125", "ine_73778",
                                "ine_6078", "ine_6040", "eurostat_earn"))}
    return {
        "tema": "T1 — ¿Cuántas horas de trabajo cuesta la compra de comida de un mes?",
        "definicion_cesta": ("Gasto medio por persona en alimentos y bebidas no alcohólicas "
                             "(EPF 2025, gasto total) / 12, a precios de cada año con el IPC de "
                             "alimentos y bebidas no alcohólicas (misma cesta, cambia el precio)."),
        "cesta_2025_euros_mes": r(cesta_2025),
        "epf_gasto_anual_persona": {a: r(epf[a][0]) for a in sorted(epf) if a not in EXCLUIDOS},
        "formulas": {
            "cesta_euros_mes(año)": "EPF2025/12 x IPCalim(año)/IPCalim(2025)",
            "salario_bruto_hora_mediana": "salario medio por hora (EAES) x mediana anual / media anual (EAES)",
            "ratio_neto_bruto": "neto/bruto de soltero sin hijos con la ganancia anual mediana, interpolado en Eurostat earn_nt_net",
            "horas": "cesta_euros_mes / salario_neto_hora_mediana",
        },
        "series": {"EAES738": n_med, "EAES741": n_mea, "EAES2013": n_hor, "IPC290755": n_ali,
                   "IPC290751": n_gen, "EPF534996": n_epf, c93: n_e93, c09: n_e09},
        "filas": filas,
        "ipc_alimentos_ultimo_mes": {"fecha": ult_mes["Fecha"][:7], "indice": ult_mes["Valor"],
                                      "var_interanual_pct": r(100 * (ult_mes["Valor"] / mismo_mes_antes["Valor"] - 1), 1)},
        "ipc_alimentos_ultimos_12_meses_media": r(sum(ult12) / 12, 3),
        "fuentes": fuentes,
    }


# ---------------------------------------------------------------- T2
def t2(man):
    series = {
        "ocupados_miles": ("ine_65109_epa_ocupados.json", "EPA387796"),
        "parados_miles": ("ine_65218_epa_parados.json", "EPA387800"),
        "tasa_paro_pct": ("ine_65219_epa_tasa_paro.json", "EPA423474"),
        "tasa_empleo_16_mas_pct": ("ine_65306_epa_tasa_empleo.json", "EPA441060"),
        "tasa_empleo_16_64_pct": ("ine_65306_epa_tasa_empleo.json", "EPA441257"),
    }
    datos, nombres = {}, {}
    for k, (f, cod) in series.items():
        _, nombres[cod], pts = ine(f, cod)
        datos[k] = pts
    ult = max(datos["ocupados_miles"], key=lambda p: p["Fecha"])
    hoy_anyo, hoy_per = ult["Anyo"], ult["T3_Periodo"]

    def bloque(anyo, per=None):
        out = {}
        for k, pts in datos.items():
            if per:
                out[k] = periodo(pts, anyo, per)
            else:
                v, n = anual(pts)[anyo]
                assert n == 4, (k, anyo, n)
                out[k] = r(v, 2)
        out["poblacion_16_mas_miles"] = r(out["ocupados_miles"] / out["tasa_empleo_16_mas_pct"] * 100, 1)
        return out

    trimestre = {f"{a}{hoy_per}": bloque(a, hoy_per) for a in ANYOS_T2 + [hoy_anyo]}
    # Habitantes de España (todas las edades) a 1 de julio, el primer día del 3.er trimestre.
    pob = json.loads((RAW / "ine_ecp320_poblacion.json").read_text(encoding="utf-8"))
    nombres[pob["COD"]] = pob["Nombre"].strip()
    for a in ANYOS_T2 + [hoy_anyo]:
        p = next(x for x in pob["Data"] if x["Anyo"] == a and x["T3_Periodo"] == "1 de julio de")
        trimestre[f"{a}{hoy_per}"]["poblacion_total_miles"] = r(p["Valor"] / 1000, 3)
        trimestre[f"{a}{hoy_per}"]["poblacion_total_dato"] = f"1 de julio de {a} ({p['T3_TipoDato'].lower()})"
    media_anual = {str(a): bloque(a) for a in ANYOS_T2 + [hoy_anyo - 1]}

    ids, eu_emp = eurostat("eurostat_lfsi_emp_a.json")
    _, eu_par = eurostat("eurostat_une_rt_a.json")
    def eu(tab, geo, anyo):
        for k, v in tab.items():
            if k[-2] == geo and k[-1] == str(anyo):
                return v
        return None
    contraste = {str(a): {"tasa_empleo_20_64_ES": eu(eu_emp, "ES", a), "tasa_empleo_20_64_UE27": eu(eu_emp, "EU27_2020", a),
                          "tasa_paro_15_74_ES": eu(eu_par, "ES", a), "tasa_paro_15_74_UE27": eu(eu_par, "EU27_2020", a)}
                 for a in [2016, 2018, 2019, hoy_anyo - 1]}

    fuentes = {k: {"descripcion": v["descripcion"], "web": v["url_web"], "api": v["url_api"],
                   "consultado": v["consultado_utc"], "sha256": v["sha256"]}
               for k, v in man.items() if k.startswith(("ine_65", "ine_ecp", "eurostat_lfsi", "eurostat_une"))}
    return {
        "tema": "T2 — ¿Hay más gente trabajando ahora que antes de la crisis?",
        "ultimo_dato": f"{hoy_anyo} {hoy_per}",
        "comparacion_principal": f"Mismo trimestre ({hoy_per}) de cada año, para evitar la estacionalidad",
        "series": nombres,
        "mismo_trimestre": trimestre,
        "media_anual": media_anual,
        "eurostat_contraste": contraste,
        "nota_poblacion": "poblacion_16_mas = ocupados / tasa de empleo 16+ (C). poblacion_total = habitantes de todas las edades a 1 de julio (INE, ECP320, V)",
        "fuentes": fuentes,
    }


def main():
    CLEAN.mkdir(parents=True, exist_ok=True)
    man = manifest()
    for nombre, datos in [("t1_cesta_horas.json", t1(man)), ("t2_empleo.json", t2(man))]:
        (CLEAN / nombre).write_text(json.dumps(datos, ensure_ascii=False, indent=2), encoding="utf-8")
        print("escrito", CLEAN / nombre)


if __name__ == "__main__":
    main()
