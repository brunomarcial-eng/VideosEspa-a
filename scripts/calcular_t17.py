#!/usr/bin/env python3
"""Datos limpios de T17: el coche más vendido, 2016 frente a hoy (coches, vídeo B; Bruno, 22-11-2026).

Todo oficial:
  · Top de modelos: DGT, microdatos mensuales de matriculaciones (un registro por vehículo). Turismos y todoterrenos
    NUEVOS (tipo 40 y 25, indicador N). El modelo se agrupa por familia: «LEON ST» cuenta como León y «CLIO E-TECH
    HYBRID» como Clio; los modelos con nombre propio («YARIS CROSS», «C3 AIRCROSS») van aparte.
  · Precio de los modelos de hoy: Agencia Tributaria, ranking de ventas por marca y modelo de 2025 (precio medio real,
    base imponible: sin IVA ni impuesto de matriculación). Solo existe desde 2022: no hay precio oficial por modelo de 2016.
  · Coche nuevo medio: Agencia Tributaria, tabla por origen, fila «Nuevo y adquirido en España»: precio medio sin y con
    impuesto de matriculación; más el IVA de cada año (16 % en 2007, 21 % desde 2012) sobre el precio sin impuestos.
  · Segunda mano: DGT, cambios de titularidad de turismos frente a turismos matriculados (series históricas), y
    Agencia Tributaria, usados importados sobre el total matriculado.
  · Sueldo: el neto mediano al mes de T16 (INE y Eurostat).

Uso: python3 scripts/calcular_t17.py → data/clean/t17_mas_vendido.json
Necesita los microdatos de la DGT en data/raw/microdatos/ (python3 scripts/descargar_datos.py los baja).
"""
import collections
import html
import io
import json
import pathlib
import re
import zipfile

import openpyxl

RAIZ = pathlib.Path(__file__).resolve().parent.parent
RAW, CLEAN = RAIZ / "data" / "raw", RAIZ / "data" / "clean"
ANYOS_TOP = (2016, 2019, 2025)
ANYOS = (2007, 2016, 2019, 2025)
IVA = {2007: 0.16, 2016: 0.21, 2019: 0.21, 2025: 0.21}
DISTINTO = {"CROSS", "AIRCROSS", "CROSSLAND", "COUPE", "CABRIO"}


def familia(marca, modelo):
    """Familia de modelo a partir del texto de la DGT: quita la marca y «NUEVO», y se queda con el primer nombre."""
    toks = modelo.split()
    m1 = marca.split()[0].split("-")[0]
    while toks and (toks[0] in ("NUEVO", "NEW", "NUEVA") or toks[0].startswith(m1)):
        toks = toks[1:]
    if not toks:
        return modelo
    f = toks[0]
    if f.startswith("CORSA"):          # «CORSA-E» es la generación E del Corsa, no el eléctrico
        f = "CORSA"
    if len(toks) > 1 and toks[1] in DISTINTO:
        f += " " + toks[1]
    return f


def top_dgt(anyo, n=10):
    """Turismos y todoterrenos nuevos matriculados en el año, por marca y familia de modelo (DGT, microdatos)."""
    c, total = collections.Counter(), 0
    for m in range(1, 13):
        z = zipfile.ZipFile(RAW / "microdatos" / f"dgt_matriculaciones_{anyo}{m:02d}.zip")
        with z.open(z.namelist()[0]) as f:
            for i, linea in enumerate(io.TextIOWrapper(f, encoding="latin-1")):
                if i == 0 or linea[91:93] not in ("40", "25") or linea[178:179] != "N":
                    continue
                marca = linea[17:47].strip()
                c[(marca, familia(marca, linea[47:69].strip()))] += 1
                total += 1
    return total, [{"marca": k[0], "modelo": k[1], "matriculados": v} for k, v in c.most_common(n)]


def celdas(fichero, cod="utf-8"):
    s = (RAW / fichero).read_text(encoding=cod, errors="ignore")
    s = re.sub(r"(?s)<script.*?</script>|<style.*?</style>", "", s)
    return [html.unescape(re.sub(r"<[^>]+>|\s+", " ", c)).strip() for c in re.findall(r"<t[dh][^>]*>(.*?)</t[dh]>", s, re.S)]


def num(x):
    return int(x.replace(".", "").replace(",", ""))


def ranking_aeat_2025():
    """Ranking de Hacienda 2025: por marca, el modelo más vendido con su número y precio medio (base imponible)."""
    c = celdas("aeat_matriculaciones_2025_ranking_marca_modelo.html")
    i = c.index("Marca")
    cuerpo = c[i + 6:]
    out = {}
    for k in range(0, len(cuerpo) - 5, 6):
        marca, nm, pm, modelo, n, p = cuerpo[k:k + 6]
        out[(marca, modelo)] = {"marca_matriculados": num(nm), "marca_precio_medio": num(pm), "matriculados": num(n), "precio_medio_sin_impuestos": num(p)}
    return out


def origen_aeat(anyo):
    """Filas de la tabla por origen: vehículos, precio medio sin y con impuesto de matriculación."""
    cod = "latin-1" if anyo == 2007 else "utf-8"
    c = celdas(f"aeat_matriculaciones_{anyo}_origen_valor.html", cod)
    out = {}
    for etiqueta in ("Total", "Nuevo y adquirido en España", "Nuevo y adquirido fuera de España", "Usado"):
        i = c.index(etiqueta)
        fila = c[i + 1:i + (10 if anyo == 2007 else 11)]   # 2007 no tiene la columna de CO2
        # vehículos, %, [CO2], base, %, base reducida, %, %, precio sin, precio con
        out[etiqueta] = {"vehiculos": num(fila[0]), "precio_sin_iedmt": num(fila[-2]), "precio_con_iedmt": num(fila[-1])}
    return out


def serie_dgt(fichero, hoja_col):
    wb = openpyxl.load_workbook(RAW / fichero, read_only=True, data_only=True)
    ws = wb.worksheets[0]
    cab, out = None, {}
    for fila in ws.iter_rows(values_only=True):
        if fila and fila[0] in ("Año", "Años"):
            cab = [str(x).replace("\n", " ") if x else "" for x in fila]
        elif cab and fila and isinstance(fila[0], (int, float)):
            out[int(fila[0])] = fila[cab.index(hoja_col)]
    return out


def main():
    t16 = json.loads((CLEAN / "t16_coche.json").read_text(encoding="utf-8"))
    neto_mes = {int(a): v for a, v in t16["sueldo"]["neto_mes"].items()}
    rk = ranking_aeat_2025()
    out = {"tema": "El coche más vendido, 2016 frente a hoy, y la segunda mano",
           "nota": "Top de turismos y todoterrenos nuevos (DGT, microdatos); precio medio real de 2025 por modelo (Agencia Tributaria, ranking de ventas, "
                   "solo desde 2022); coche nuevo medio (Agencia Tributaria); segunda mano (DGT y Agencia Tributaria); sueldo neto mediano al mes (T16).",
           "sueldo_neto_mes": {str(a): neto_mes[a] for a in ANYOS}}
    tops = {}
    for a in ANYOS_TOP:
        total, top = top_dgt(a)
        tops[str(a)] = {"nuevos_total": total, "top": top}
    for m in tops["2025"]["top"]:
        r = rk.get((m["marca"], m["modelo"]))
        if r:
            pvp = r["precio_medio_sin_impuestos"] * (1 + IVA[2025])
            m.update({"aeat": r, "precio_con_iva": round(pvp), "meses_de_sueldo": round(pvp / neto_mes[2025], 1)})
    out["top_modelos"] = tops
    nuevo, usados = {}, {}
    for a in ANYOS:
        o = origen_aeat(a)
        n = o["Nuevo y adquirido en España"]
        pvp = n["precio_con_iedmt"] + n["precio_sin_iedmt"] * IVA[a]
        nuevo[str(a)] = {**n, "iva_pct": round(100 * IVA[a]), "precio_con_impuestos": round(pvp), "meses_de_sueldo": round(pvp / neto_mes[a], 1)}
        usados[str(a)] = {"usados_importados": o["Usado"]["vehiculos"], "total_matriculados_aeat": o["Total"]["vehiculos"],
                          "usados_importados_pct": round(100 * o["Usado"]["vehiculos"] / o["Total"]["vehiculos"], 1)}
    out["coche_nuevo_medio"] = nuevo
    out["coche_nuevo_medio_sube_pct"] = round(100 * (nuevo["2025"]["precio_sin_iedmt"] / nuevo["2016"]["precio_sin_iedmt"] - 1), 1)
    out["sueldo_neto_sube_pct"] = round(100 * (neto_mes[2025] / neto_mes[2016] - 1), 1)
    matr = serie_dgt("dgt_matriculaciones_series_historicas_2025.xlsx", "Turismos")
    camb = serie_dgt("dgt_cambios_titularidad_series_historicas_2025.xlsx", "Turismos")
    for a in ANYOS:
        usados[str(a)].update({"turismos_matriculados_dgt": matr[a], "cambios_titularidad_turismos_dgt": camb[a],
                               "usados_por_cada_matriculado": round(camb[a] / matr[a], 2),
                               "segunda_mano_pct": round(100 * camb[a] / (camb[a] + matr[a]), 1)})
    out["segunda_mano"] = usados
    CLEAN.mkdir(parents=True, exist_ok=True)
    (CLEAN / "t17_mas_vendido.json").write_text(json.dumps(out, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    print(json.dumps(out, ensure_ascii=False, indent=1))


if __name__ == "__main__":
    main()
