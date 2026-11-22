#!/usr/bin/env python3
"""Datos limpios de T16: ¿cuántos meses trabajas para pagar tu coche? (coches, vídeo A; Bruno, 22-11-2026).

Todo oficial:
  · Precio medio de los coches matriculados (Agencia Tributaria, estadística del Impuesto sobre la Matriculación, modelo 576):
    base imponible media (sin IVA ni impuesto de matriculación) y con el impuesto de matriculación, 2007, 2016, 2019 y 2025.
    En 2007 el impuesto iba por cilindrada (7 % o 12 %) y la tabla es por tipo de combustible; la fila Total es la misma medida.
    Turismos y todoterrenos, nuevos y usados importados que se matriculan por primera vez en España. Es lo que se compra de
    verdad, con los extras que cada uno elige.
  · IVA (Ley 37/1992, art. 90) sobre la base, sin el impuesto de matriculación: 16 % en 2007, 21 % desde septiembre de 2012.
  · Tipo de los préstamos al consumo (Banco de España, Boletín Estadístico 19.6, TAE de nuevas operaciones, hogares,
    consumo): media de cada año.
  · Sueldo: el neto mediano anual de T1 y T14 (INE y Eurostat), en 12 mensualidades.
  · Escenario propio (no es una recomendación oficial: el Banco de España no da una cifra): dedicar un tercio del sueldo a la
    cuota durante cinco años.

Uso: python3 scripts/calcular_t16.py → data/clean/t16_coche.json
"""
import csv
import html
import json
import pathlib
import re

RAIZ = pathlib.Path(__file__).resolve().parent.parent
RAW, CLEAN = RAIZ / "data" / "raw", RAIZ / "data" / "clean"
IVA = {2007: 0.16, 2016: 0.21, 2019: 0.21, 2025: 0.21}
MESES_PRESTAMO = 60
ANYOS = (2007, 2016, 2019, 2025)
FICHERO = {2007: "aeat_matriculaciones_2007_combustible.html"}


def aeat_total(fichero):
    """Fila «Total» de la tabla económica por epígrafe: vehículos, base imponible y precio medio sin y con IEDMT."""
    s = (RAW / fichero).read_text(encoding="utf-8", errors="ignore")
    t = re.sub(r"(?s)<script.*?</script>|<style.*?</style>", "", s)
    t = re.sub(r"</t[dh]>", " | ", t)
    t = html.unescape(re.sub(r"<[^>]+>", "", t))
    t = re.sub(r"\s+", " ", t)
    m = re.search(r"Total \| ([\d.]+) \| 100,00% \| (\d+) \| ([\d.]+) \| 100,00% \|[^E]*?\| ([\d.]+) \| ([\d.]+) \| Epígrafe 1º", t)
    n = lambda x: int(x.replace(".", "").replace(",", ""))
    if not m:   # 2007: tabla por combustible, sin columna de CO2 y con comas de millares
        m = re.search(r"Total \| ([\d,]+) \| 100\.00% \| ([\d,]+) \| 100\.00% \|[^G]*?\| ([\d,]+) \| ([\d,]+) \| Gasolina", t)
        return {"vehiculos": n(m.group(1)), "co2_g_km": None, "base_total_eur": n(m.group(2)),
                "precio_medio_sin_iedmt": n(m.group(3)), "precio_medio_con_iedmt": n(m.group(4))}
    return {"vehiculos": n(m.group(1)), "co2_g_km": int(m.group(2)), "base_total_eur": n(m.group(3)),
            "precio_medio_sin_iedmt": n(m.group(4)), "precio_medio_con_iedmt": n(m.group(5))}


def tae_consumo():
    """TAE media anual de los préstamos al consumo nuevos (Banco de España, BE_19_6.2)."""
    filas = list(csv.reader((RAW / "bde_be1906_tae_nuevas_operaciones.csv").read_text(encoding="latin-1").splitlines()))
    alias = next(f for f in filas if f and f[0].startswith("ALIAS"))
    col = alias.index("BE_19_6.2")
    por_anyo, ultimo = {}, None
    for f in filas:
        m = re.fullmatch(r"([A-Z]{3}) (\d{4})", f[0]) if f else None
        if m and f[col] not in ("", "_"):
            por_anyo.setdefault(int(m.group(2)), []).append(float(f[col]))
            ultimo = (f[0], float(f[col]))
    return {a: round(sum(v) / len(v), 2) for a, v in por_anyo.items() if len(v) == 12}, ultimo


def cuota(capital, tae, meses):
    i = (1 + tae / 100) ** (1 / 12) - 1
    return capital * i / (1 - (1 + i) ** -meses)


def main():
    t14 = json.loads((CLEAN / "t14_desayuno.json").read_text(encoding="utf-8"))["sueldo"]
    fila = {f["anyo"]: f for f in json.loads((CLEAN / "t1_cesta_horas.json").read_text(encoding="utf-8"))["filas"]}
    # neto anual mediano = bruto mediano × relación neto / bruto (T1); para 2016 y 2025 coincide con T14
    neto = {str(a): fila[a]["ganancia_anual_mediana"] * fila[a]["ratio_neto_bruto_mediana"] for a in ANYOS}
    assert all(abs(neto[a] - t14["neto_anual_mediano"][a]) < 1 for a in ("2016", "2025"))
    tae, ultimo = tae_consumo()
    out = {"tema": "¿Cuántos meses trabajas para pagar tu coche? 2016 frente a hoy",
           "nota": "Precio medio real de los coches matriculados (Agencia Tributaria), con IVA y matriculación; sueldo neto mediano en 12 mensualidades; "
                   "préstamo del 100 % a cinco años a la TAE media de los préstamos al consumo del Banco de España.",
           "sueldo": {"bruto_anual": {str(a): round(fila[a]["ganancia_anual_mediana"]) for a in ANYOS},
                      "neto_anual": {a: round(v) for a, v in neto.items()},
                      "neto_mes": {a: round(v / 12) for a, v in neto.items()}},
           "tae_consumo_media_anual": {str(a): tae[a] for a in (2007, 2016, 2019, 2024, 2025) if a in tae},
           "tae_consumo_ultimo_mes": {"mes": ultimo[0], "tae": ultimo[1]}}
    coche = {}
    for a in map(str, ANYOS):
        x = aeat_total(FICHERO.get(int(a), f"aeat_matriculaciones_{a}_epigrafe.html"))
        base, con = x["precio_medio_sin_iedmt"], x["precio_medio_con_iedmt"]
        iedmt, iva = con - base, base * IVA[int(a)]
        pvp = base + iedmt + iva
        neto_mes = neto[a] / 12
        c = cuota(pvp, tae[int(a)], MESES_PRESTAMO)
        total = c * MESES_PRESTAMO
        coche[a] = {"aeat": x, "iva_tipo_pct": round(100 * IVA[int(a)]), "precio_sin_impuestos": base, "matriculacion": iedmt, "iva": round(iva), "precio_con_impuestos": round(pvp),
                    "impuestos": round(iedmt + iva), "impuestos_pct": round(100 * (iedmt + iva) / pvp, 1),
                    "contado_meses_de_sueldo": round(pvp / neto_mes, 1),
                    "prestamo": {"tae": tae[int(a)], "meses": MESES_PRESTAMO, "cuota": round(c), "total": round(total), "intereses": round(total - pvp),
                                 "cuota_pct_sueldo": round(100 * c / neto_mes, 1), "meses_de_sueldo": round(total / neto_mes, 1)}}
    out["coche_medio"] = coche
    out["coche_medio_sube_pct"] = round(100 * (coche["2025"]["precio_con_impuestos"] / coche["2016"]["precio_con_impuestos"] - 1), 1)
    out["sueldo_neto_sube_pct"] = round(100 * (neto["2025"] / neto["2016"] - 1), 1)
    # Escenario propio: un tercio del sueldo a la cuota, cinco años, a la TAE media de 2025
    n25 = neto["2025"] / 12
    i = (1 + tae[2025] / 100) ** (1 / 12) - 1
    tercio = n25 / 3
    out["escenario_tercio"] = {"cuota": round(tercio), "coche_maximo": round(tercio * (1 - (1 + i) ** -MESES_PRESTAMO) / i),
                               "nota": "Escenario propio, no oficial: un tercio del sueldo neto mediano a la cuota, cinco años, TAE media de 2025"}
    CLEAN.mkdir(parents=True, exist_ok=True)
    (CLEAN / "t16_coche.json").write_text(json.dumps(out, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    print(json.dumps(out, ensure_ascii=False, indent=1))


if __name__ == "__main__":
    main()
