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


def num(x):
    return float(x.replace(" ", "").replace(".", "").replace(",", "."))


def epa_1986():
    """Ocupados de 1986 por sexo, a partir del Anuario del INE de 1988 (EPA, media de 1986):
    activos = parados / tasa de paro; ocupados = activos − parados. Se divide entre la población de 16 a 64 años
    a 1 de julio de 1986 (INE, tabla 56934). Cálculo propio (C); incluye a los pocos ocupados de 65 o más años."""
    txt = subprocess.run(["pdftotext", "-layout", str(RAW / "ine_anuario1988_epa_1978_1987.pdf"), "-"], capture_output=True, text=True).stdout
    lineas = txt.splitlines()
    def bloque(titulo, sexo, etiqueta):
        i = next(k for k, l in enumerate(lineas) if titulo in l)
        j = next(k for k in range(i, len(lineas)) if lineas[k].strip().replace(" ", "").upper().startswith(sexo))
        for k in range(j + 1, len(lineas)):
            l = lineas[k].strip()
            if l.replace(" ", "").lower().startswith(etiqueta.replace(" ", "").lower()):
                cols = [c for c in re.split(r"\s{2,}", l)[1:] if c.strip()]
                return num(cols[8])   # columnas 1978…1987: la novena es 1986
        raise SystemExit(f"no encuentro {titulo}/{sexo}/{etiqueta}")
    import csv
    pob = {}
    for r in csv.reader(open(RAW / "ine_56934_poblacion_sexo_edad_desde_1971.csv", encoding="utf-8-sig"), delimiter=";"):
        if len(r) == 4 and r[2] == "1 de julio de 1986" and r[3].strip():
            m = re.match(r"(\d+) año", r[0])
            if m and 16 <= int(m.group(1)) <= 64:
                pob[r[1]] = pob.get(r[1], 0) + int(r[3].replace(".", ""))
    out = {}
    for sexo, clave, nombre in (("VARONES", "Hombres", "hombres"), ("MUJERES", "Mujeres", "mujeres")):
        parados = bloque("DISTRIBUCION DEL DESEMPLEO POR SEXO", sexo, "Total") * 1000
        tasa = bloque("TASA DE PARO POR SEXO", sexo, "Total")
        activos = parados / (tasa / 100)
        ocupados = activos - parados
        out[nombre] = {"parados": round(parados), "tasa_paro_pct": tasa, "ocupados": round(ocupados),
                       "poblacion_16_64": pob[clave], "tasa_empleo_pct": round(100 * ocupados / pob[clave], 1)}
        p20 = bloque("DISTRIBUCION DEL DESEMPLEO POR SEXO", sexo, "20 a 24 años") * 1000
        t20 = bloque("TASA DE PARO POR SEXO", sexo, "20 a 24 años")
        out[nombre]["paro_20_24"] = {"parados": p20, "tasa_pct": t20, "activos": round(p20 / (t20 / 100))}
    h, m = out["hombres"]["paro_20_24"], out["mujeres"]["paro_20_24"]
    out["paro_20_24_ambos_pct"] = round(100 * (h["parados"] + m["parados"]) / (h["activos"] + m["activos"]), 1)
    return out


def eurostat(fichero):
    d = json.loads((RAW / fichero).read_text(encoding="utf-8"))
    dims, size, idx = d["id"], d["size"], {k: d["dimension"][k]["category"]["index"] for k in d["id"]}
    def val(filtro):
        res = {}
        for t in idx["time"]:
            pos = 0
            for k, n in zip(dims, size):
                c = t if k == "time" else filtro.get(k, next(iter(idx[k])))
                if c not in idx[k]:
                    return res
                pos = pos * n + idx[k][c]
            v = d["value"].get(str(pos))
            if v is not None:
                res[t] = v
        return res
    return val


UE27 = ["BE", "BG", "CZ", "DK", "DE", "EE", "IE", "EL", "ES", "FR", "HR", "IT", "CY", "LV", "LT", "LU", "HU", "MT", "NL", "AT", "PL", "PT", "RO", "SI", "SK", "FI", "SE"]


def europa():
    emp, tfr = eurostat("eurostat_lfsa_ergan_mujeres_ue.json"), eurostat("eurostat_demo_find_ue.json")
    res = {}
    for a in ("2019", "2023", "2024"):
        pares = [(g, emp({"geo": g, "age": "Y25-54", "sex": "F"}).get(a), tfr({"geo": g}).get(a)) for g in UE27]
        pares = [p for p in pares if p[1] is not None and p[2] is not None]
        xs, ys = [p[1] for p in pares], [p[2] for p in pares]
        mx, my = sum(xs) / len(xs), sum(ys) / len(ys)
        r = sum((x - mx) * (y - my) for x, y in zip(xs, ys)) / (sum((x - mx) ** 2 for x in xs) * sum((y - my) ** 2 for y in ys)) ** 0.5
        res[a] = {"paises": len(pares), "correlacion": round(r, 2), "datos": {g: {"empleo_mujeres_25_54": e, "hijos_por_mujer": f} for g, e, f in pares}}
    es_emp = eurostat("eurostat_lfsa_ergan_es.json")
    res["espana_serie"] = {a: {"empleo_mujeres_25_54": emp({"geo": "ES", "age": "Y25-54", "sex": "F"}).get(a),
                               "empleo_mujeres_15_64": es_emp({"geo": "ES", "sex": "F"}).get(a),
                               "empleo_hombres_15_64": es_emp({"geo": "ES", "sex": "M"}).get(a),
                               "hijos_por_mujer": tfr({"geo": "ES"}).get(a)}
                           for a in ("1995", "1998", "2001", "2004", "2007", "2008", "2010", "2013", "2016", "2019", "2022", "2023", "2024", "2025")}
    return res


def vivienda_bde():
    """Precio del piso medio en años de renta bruta de un hogar (Banco de España, ya calculado para T4)."""
    t4 = json.loads((CLEAN / "t4_netflix.json").read_text(encoding="utf-8"))["bde_accesibilidad"]["precio_entre_renta_hogar_anos"]
    return {"1987": t4["1987"], "2006": t4["2006"], "2016": t4["2016"], "2019": t4["2019"], "2026": t4["2026_ultimo"]}


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
        "empleo_1986": epa_1986(),
        "europa_empleo_mujeres_y_fecundidad": europa(),
        "paro_20_24_eurostat": eurostat("eurostat_lfsa_urgan_es_20_24.json")({"geo": "ES"}),
        "vivienda_bde": vivienda_bde(),
        "permisos": {
            "1986": {"padre_dias": 2, "madre_semanas": 14, "fuente": "Ley 8/1980, Estatuto de los Trabajadores, arts. 37.3.b y 48.4 (BOE 14-03-1980)"},
            "hoy": {"cada_progenitor_semanas": 19, "fuente": "Real Decreto-ley 9/2025, de 29 de julio (BOE-A-2025-15741)"},
        },
        "nota": "Hijos por mujer = indicador coyuntural de fecundidad. Primer hijo = edad media de la madre al primer nacimiento. "
                "Matrimonio = edad media al primer matrimonio, ambos sexos. Mayores por cada 100 niños = índice de envejecimiento "
                "(mayores de 64 años por cada 100 menores de 16, a 1 de enero). Todo INE, Indicadores Demográficos Básicos.",
    }
    (CLEAN / "t5_natalidad.json").write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding="utf-8")
    print(json.dumps(out, ensure_ascii=False, indent=1))


if __name__ == "__main__":
    main()
