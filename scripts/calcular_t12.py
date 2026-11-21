#!/usr/bin/env python3
"""Datos limpios de T12: educación, 2016 frente a hoy. Lo que pagamos frente a lo que aprenden los alumnos (Bruno, 21-11-2026).

  · Lo que aprenden: PISA (alumnado de 15 años). 2015, la edición más cercana a 2016 (OCDE, Volume I), frente a 2025, la última
    (Ministerio de Educación, informe español PISA 2025: tablas de datos). Puntuación media y porcentaje de alumnos que no llegan
    al nivel 2 (el nivel básico de competencia) en lectura y matemáticas.
  · Lo que se pone: gasto público en educación (Eurostat COFOG GF09) por habitante en euros de 2025; profesores de la ESO
    (CINE 2) y alumnos por profesor (Eurostat).
  · Lo que pagan además las familias: gasto medio por hogar en enseñanza secundaria (INE, EPF), en euros de 2025.
  · Lo que pagamos: el mismo bloque de impuestos y cotizaciones que T11 (data/clean/t11_sanidad.json).

Necesita `unar` para abrir el .rar de las tablas de PISA 2025 y `pdftotext` para el informe de 2015.
Uso: python3 scripts/calcular_t12.py → data/clean/t12_educacion.json
"""
import csv
import json
import pathlib
import re
import subprocess
import sys
import tempfile

import openpyxl

RAIZ = pathlib.Path(__file__).resolve().parent.parent
RAW, CLEAN = RAIZ / "data" / "raw", RAIZ / "data" / "clean"
sys.path.insert(0, str(RAIZ / "scripts"))
import calcular_t8 as T8  # noqa: E402
from calcular_t9 import eurostat_valor  # noqa: E402
from calcular_t11 import poblacion, epf  # noqa: E402


def pisa_2025():
    """España en PISA 2025 (informe español): medias 2015-2025 y reparto por niveles en 2025."""
    with tempfile.TemporaryDirectory() as tmp:
        subprocess.run(["unar", "-q", "-o", tmp, str(RAW / "educacion_pisa2025_tablas.rar")], check=True)
        f = next(pathlib.Path(tmp).rglob("Tablas_cap_2.xlsx"))
        wb = openpyxl.load_workbook(f, read_only=True, data_only=True)
        fila = lambda hoja: next(r for r in wb[hoja].iter_rows(values_only=True) if r and r[0] == "España")
        out = {}
        for materia, hoja in (("lectura", "Figura 2.17"), ("matematicas", "Figura 2.21"), ("ciencias", "Figura 2.9")):
            v = [x for x in fila(hoja)[1:] if x is not None][::2]     # valor, ET, valor, ET…
            # Lectura no tiene dato de España en 2018 (la OCDE no lo publicó): 2015, 2022 y 2025.
            anos = ["2015", "2022", "2025"] if materia == "lectura" else ["2015", "2018", "2022", "2025"]
            out[materia] = {"media": dict(zip(anos, [round(x, 1) for x in v]))}
        niv = lambda hoja, n: sum(x for x in [c for c in fila(hoja)[1:] if c is not None][: 2 * n : 2])
        out["lectura"]["bajo_nivel_2_pct_2025"] = round(niv("Figura 2.15", 3), 1)      # < 1b, 1b y 1a
        out["matematicas"]["bajo_nivel_2_pct_2025"] = round(niv("Figura 2.19", 2), 1)  # < 1a y 1a
        ocde = lambda hoja: next(r for r in wb[hoja].iter_rows(values_only=True) if r and r[0] == "Promedio OCDE-35")
        for materia, hoja in (("lectura", "Figura 2.17"), ("matematicas", "Figura 2.21")):
            v = [x for x in ocde(hoja)[1:] if x is not None][::2]
            out[materia]["media_ocde35"] = {"2015": round(v[0], 1), "2025": round(v[-1], 1)}
        return out


def pisa_2015():
    """España en PISA 2015 (OCDE, Volume I): medias y alumnos por debajo del nivel 2. Se comprueba la fila del informe."""
    t = subprocess.run(["pdftotext", "-layout", str(RAW / "ocde_pisa2015_resultados_vol1.pdf"), "-"], capture_output=True, text=True, check=True).stdout
    filas = {
        # Tabla resumen: ciencias, tendencia, lectura, tendencia, matemáticas, tendencia…
        "medias": r"Spain\s+493\s+2\s+496\s+7\s+486\s+1\s",
        # Tabla I.4.1a (lectura): por debajo de 1b, 1b, 1a, 2…
        "lectura": r"Spain\s+0\.7\s+\(0\.2\)\s+3\.5\s+\(0\.4\)\s+12\.0\s+\(0\.7\)\s+24\.4\s+\(0\.8\)",
        # Tabla I.5.1a (matemáticas): por debajo de 1, 1, 2…
        "matematicas": r"Spain\s+7\.2\s+\(0\.5\)\s+15\.0\s+\(0\.8\)\s+24\.9\s+\(0\.8\)",
    }
    for k, pat in filas.items():
        if not re.search(pat, t):
            raise SystemExit(f"PISA 2015: no encuentro la fila de España ({k})")
    return {"lectura": {"media": 496, "bajo_nivel_2_pct": round(0.7 + 3.5 + 12.0, 1)},
            "matematicas": {"media": 486, "bajo_nivel_2_pct": round(7.2 + 15.0, 1)},
            "ciencias": {"media": 493}}


def main():
    ipc = T8.ipc_largo()
    real = lambda v, a: v * ipc["2025"] / ipc[a]
    pct = lambda a, b: round(100 * (b / a - 1), 1)
    pob = {a: poblacion(a) for a in (2016, 2024)}

    p25, p15 = pisa_2025(), pisa_2015()
    for m in ("lectura", "matematicas"):
        if abs(p25[m]["media"]["2015"] - p15[m]["media"]) > 1:
            raise SystemExit(f"PISA: la media de 2015 de {m} no cuadra entre los dos informes")
    aprenden = {m: {"media": {"2015": p15[m]["media"], "2025": round(p25[m]["media"]["2025"])},
                    "puntos_menos": round(p15[m]["media"] - p25[m]["media"]["2025"]),
                    "bajo_nivel_2_pct": {"2015": p15[m]["bajo_nivel_2_pct"], "2025": p25[m]["bajo_nivel_2_pct_2025"]},
                    "ocde35": p25[m]["media_ocde35"]}
                for m in ("lectura", "matematicas")}
    aprenden["ciencias"] = {"media": {"2015": p15["ciencias"]["media"], "2025": round(p25["ciencias"]["media"]["2025"])}}

    ge = {a: eurostat_valor("eurostat_gov_10a_exp_cofog_es.json", unit="MIO_EUR", cofog99="GF09", time=str(a)) for a in (2016, 2024)}
    gasto = {"mill_eur": {"2016": ge[2016], "2024": ge[2024]},
             "por_habitante_eur_de_2025": {"2016": round(real(ge[2016], "2016") * 1e6 / pob[2016]), "2024": round(real(ge[2024], "2024") * 1e6 / pob[2024])}}
    gasto["por_habitante_sube_real_pct"] = pct(*gasto["por_habitante_eur_de_2025"].values())

    prof = lambda a: eurostat_valor("eurostat_educ_uoe_perp01_es.json", isced11="ED2", age="TOTAL", sex="T", time=str(a))
    ratio = lambda a: eurostat_valor("eurostat_educ_uoe_perp04_es.json", isced11="ED2", time=str(a))
    profes = {"eso": {"2016": prof(2016), "2024": prof(2024)}, "alumnos_por_profesor_eso": {"2016": ratio(2016), "2024": ratio(2024)}}
    profes["eso"]["sube_pct"] = pct(profes["eso"]["2016"], profes["eso"]["2024"])

    # Alumnos por clase en la ESO (CINE 2), todos los centros: España frente a la media de 25 países de la UE (OCDE, Education at a Glance)
    filas = list(csv.DictReader((RAW / "ocde_eag_tamano_clase.csv").read_text(encoding="utf-8").splitlines()))
    clase = lambda area, ano: next(round(float(r["OBS_VALUE"]), 1) for r in filas if r["REF_AREA"] == area and r["EDUCATION_LEV"] == "ISCED11_2"
                                   and r["INST_TYPE_EDU"] == "INST_EDU" and r["TIME_PERIOD"] == str(ano) and r["OBS_VALUE"])
    profes["alumnos_por_clase_eso"] = {"espana": {"2016": clase("ESP", 2016), "2024": clase("ESP", 2024)},
                                       "ue25": {"2016": clase("EU25", 2016), "2024": clase("EU25", 2024)},
                                       "ocde": {"2016": clase("OECD", 2016), "2024": clase("OECD", 2024)}}
    # Ranking de la UE en alumnos por clase (2024; países de la UE con datos de la OCDE). 1 = clases menos llenas.
    UE = {"AUT", "BEL", "BGR", "HRV", "CZE", "DNK", "EST", "FIN", "FRA", "DEU", "GRC", "HUN", "IRL", "ITA", "LVA", "LTU", "LUX", "NLD", "POL", "PRT", "ROU", "SVK", "SVN", "ESP", "SWE", "CYP", "MLT"}
    NOMBRE = {"HRV": "Croacia", "LUX": "Luxemburgo", "GRC": "Grecia", "FRA": "Francia", "HUN": "Hungría", "NLD": "Países Bajos", "LVA": "Letonia",
              "POL": "Polonia", "DEU": "Alemania", "ESP": "España"}
    ranking = {}
    for etapa, lev in (("primaria", "ISCED11_1"), ("eso", "ISCED11_2")):
        v = {r["REF_AREA"]: round(float(r["OBS_VALUE"]), 1) for r in filas if r["EDUCATION_LEV"] == lev and r["INST_TYPE_EDU"] == "INST_EDU"
             and r["TIME_PERIOD"] == "2024" and r["OBS_VALUE"] and r["REF_AREA"] in UE}
        orden = sorted(v, key=lambda k: (v[k], k))
        ranking[etapa] = {"paises": [{"pais": k, "alumnos": v[k]} for k in orden], "n": len(orden), "puesto_espana": orden.index("ESP") + 1,
                          "espana": v["ESP"], "mejor": {"pais": NOMBRE.get(orden[0], orden[0]), "alumnos": v[orden[0]]},
                          "peor": {"pais": NOMBRE.get(orden[-1], orden[-1]), "alumnos": v[orden[-1]]},
                          "ue25": next(round(float(r["OBS_VALUE"]), 1) for r in filas if r["REF_AREA"] == "EU25" and r["EDUCATION_LEV"] == lev
                                       and r["INST_TYPE_EDU"] == "INST_EDU" and r["TIME_PERIOD"] == "2024" and r["OBS_VALUE"])}
        ranking[etapa]["paises_con_mas_alumnos_que_espana"] = [NOMBRE.get(k, k) for k in orden[orden.index("ESP") + 1:]]
    profes["ranking_clase_2024"] = ranking
    # Contraste (no va en el vídeo): alumnos por profesor en las cuatro etapas, España frente a la UE (Eurostat)
    import calcular_t9  # noqa: E402
    def perp(nivel, geo):
        try:
            return calcular_t9.eurostat_valor("eurostat_educ_uoe_perp04_ue.json", isced11=nivel, geo=geo, time="2024")
        except KeyError:
            return None
    profes["alumnos_por_profesor_2024"] = {et: {"espana": perp(n, "ES"), "ue27": perp(n, "EU27_2020")} for et, n in
                                           (("0_3", "ED01"), ("3_6", "ED02"), ("primaria", "ED1"), ("eso", "ED2"))}
    profes["alumnos_por_clase_eso"]["mas_que_ue_2024"] = round(profes["alumnos_por_clase_eso"]["espana"]["2024"] - profes["alumnos_por_clase_eso"]["ue25"]["2024"], 1)

    fam = {a: epf("Enseñanza Secundaria y Postsecundaria no superior", a) for a in (2016, 2025)}
    familias = {"secundaria_por_hogar_eur_corrientes": {str(a): v for a, v in fam.items()},
                "secundaria_por_hogar_eur_de_2025": {"2016": round(real(fam[2016], "2016")), "2025": round(fam[2025])}}
    familias["sube_real_pct"] = pct(*familias["secundaria_por_hogar_eur_de_2025"].values())
    # Para el contraste (no va en el vídeo): primaria y libros de texto
    familias["contraste"] = {k: {"2016": round(real(epf(n, 2016), "2016")), "2025": round(epf(n, 2025))}
                             for k, n in (("infantil_y_primaria", "Enseñanza Infantil y Primaria"), ("libros", "Libros"))}

    t11 = json.loads((CLEAN / "t11_sanidad.json").read_text(encoding="utf-8"))
    out = {
        "tema": "T12 — educación, 2016 frente a hoy: lo que pagamos frente a lo que aprenden los alumnos",
        "pagamos": t11["pagamos"], "aprenden": aprenden, "gasto_educacion": gasto, "profesores": profes, "familias": familias,
        "nota": ("PISA: alumnado de 15 años. 2015 es la edición más cercana a 2016; 2025, la última. Bajo el nivel 2 = no llega al nivel básico de "
                 "competencia que fija la OCDE. Lectura de España en 2018: sin dato (la OCDE no lo publicó). La media de la OCDE también baja "
                 "(OCDE-35: lectura de 490 a 463 y matemáticas de 487 a 465), pero menos que España. Gasto en educación: todas las administraciones "
                 "(Eurostat COFOG GF09), 2024 último año. Profesores y alumnos por profesor: ESO (CINE 2), Eurostat. Alumnos por clase: ESO, todos los centros, OCDE (Education at a Glance); «UE» = media de 25 países de la UE que da la OCDE. Familias: gasto medio por hogar "
                 "en enseñanza secundaria y postsecundaria no superior (INE, EPF); en primaria y en libros gastan menos que en 2016."),
    }
    (CLEAN / "t12_educacion.json").write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding="utf-8")
    print(json.dumps({k: out[k] for k in ("aprenden", "gasto_educacion", "profesores", "familias")}, ensure_ascii=False, indent=1))


if __name__ == "__main__":
    main()
