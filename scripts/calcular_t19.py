#!/usr/bin/env python3
"""Datos limpios de T19: ¿para cuánto te da hoy el Gordo? (Bruno, 23 y 24-11-2026).

Lo que te queda de un décimo premiado con el Gordo en 2007 y hoy, y para qué da: años de sueldo neto mediano, pisos
de 90 m² y lo que se queda Hacienda.
  · 2007: programa de premios del Sorteo Extraordinario de Navidad del 22-12-2007 (BOE-A-2007-21550): décimo de 20 €
    y primer premio de 3.000.000 € por serie, 300.000 € por décimo. Sin gravamen (en vigor desde 2013).
  · Hoy (2026): programa de premios de la Lotería de Navidad de 2026, de la web de Loterías y Apuestas del Estado
    (lo copió Bruno el 24-11-2026; `data/raw/t19/selae_programa_navidad_2026.txt`): 4.000.000 € por serie,
    400.000 € por décimo. Gravamen: 20 % de lo que pase de 40.000 € (Ley del IRPF, DA 33.ª; AEAT).
  · 2016 y 2019: el BOE dejó de publicar los programas en 2011 y la web de Loterías no se puede leer desde aquí.
    Se calculan solo si hay programa oficial de esos años (PROGRAMAS abajo); si no, quedan fuera.
  · Sueldo neto mediano anual (INE y Eurostat, de T16) y precio medio del metro cuadrado de la vivienda libre tasada
    (Ministerio de Vivienda, vía Banco de España, de T3). IPC general, media anual (INE, tabla 24077).
"""
import json
import pathlib
import statistics

RAIZ = pathlib.Path(__file__).resolve().parent.parent
CLEAN, RAW = RAIZ / "data" / "clean", RAIZ / "data" / "raw"

# Primer premio por décimo y su fuente oficial. 2016 y 2019: None hasta que haya programa oficial.
PROGRAMAS = {
    "2007": {"decimo_eur": 20, "gordo_decimo": 300_000, "exento": None, "fuente": "BOE-A-2007-21550", "estado": "V"},
    "2016": None,
    "2019": None,
    "hoy": {"decimo_eur": 20, "gordo_decimo": 400_000, "exento": 40_000, "fuente": "Loterías y Apuestas del Estado, programa de premios de 2026 (copiado por Bruno)", "estado": "V"},
}
EXENTO = {"2016": 2_500, "2019": 20_000}
PISO_M2 = 90


def main():
    t16 = json.loads((CLEAN / "t16_coche.json").read_text(encoding="utf-8"))
    t3 = json.loads((CLEAN / "t3_vivienda.json").read_text(encoding="utf-8"))
    neto = {a: t16["sueldo"]["neto_anual"][a] for a in ("2007", "2016", "2019", "2025")}
    m2 = {a: t3["bde_vivienda"]["precio_m2_tasado"]["por_anyo"][a]["media"] for a in ("2007", "2016", "2019", "2025")}
    ipc_s = json.loads((RAW / "ine_24077_ipc_desde_1961.json").read_text(encoding="utf-8"))[0]["Data"]
    por = {}
    for x in ipc_s:
        por.setdefault(x["Anyo"], []).append(x["Valor"])
    ipc = {str(a): statistics.mean(v) for a, v in por.items() if len(v) == 12}

    out = {"tema": "¿Para cuánto te da hoy el Gordo? 2007 frente a hoy", "piso_m2": PISO_M2,
           "nota": "«Hoy»: el Gordo de 2026 con el sueldo, el piso y el IPC del último año completo (2025).",
           "sueldo_neto_anual": neto, "precio_m2": m2, "anyos": {}}
    for clave, prog in PROGRAMAS.items():
        a = "2025" if clave == "hoy" else clave
        if prog is None:
            if clave in EXENTO:
                out["anyos"][clave] = {"sin_programa_oficial": True, "exento_eur": EXENTO[clave]}
            continue
        g = prog["gordo_decimo"]
        hacienda = 0 if prog["exento"] is None else round(0.2 * (g - prog["exento"]))
        queda = g - hacienda
        piso = m2[a] * PISO_M2
        out["anyos"][clave] = {
            "fuente_premio": prog["fuente"], "estado": prog["estado"], "decimo_eur": prog["decimo_eur"], "gordo_decimo": g,
            "exento_eur": prog["exento"], "hacienda_eur": hacienda, "hacienda_pct": round(100 * hacienda / g, 1), "te_queda": queda,
            "euros_por_euro_jugado": g // prog["decimo_eur"],
            "anyos_sueldo": round(queda / neto[a], 1), "piso_90m2_eur": round(piso), "pisos": round(queda / piso, 1),
            "te_queda_en_euros_de_2025": round(queda * ipc["2025"] / ipc[a]),
        }
    h, v = out["anyos"]["hoy"], out["anyos"]["2007"]
    out["hoy_frente_2007"] = {"anyos_sueldo_menos": round(v["anyos_sueldo"] - h["anyos_sueldo"], 1),
                              "valor_real_pct": round(100 * (h["te_queda_en_euros_de_2025"] / v["te_queda_en_euros_de_2025"] - 1), 1)}
    CLEAN.mkdir(parents=True, exist_ok=True)
    (CLEAN / "t19_gordo.json").write_text(json.dumps(out, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    for k, x in out["anyos"].items():
        print(k, x)
    print(out["hoy_frente_2007"])


if __name__ == "__main__":
    main()
