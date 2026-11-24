#!/usr/bin/env python3
"""Datos limpios de T20: ¿lotería o invertir? (Bruno, 24-11-2026).

Lo que un hogar medio se gasta al año en loterías y apuestas, frente a lo que tendría si ese mismo dinero lo hubiera
metido cada diciembre en bolsa. Solo datos oficiales, guardados en data/raw/t19/:
  · INE, Encuesta de Presupuestos Familiares: gasto medio por hogar y por persona en «juegos de azar» (todas las
    loterías y apuestas; lo que declaran los hogares). Base 2006 para 2007-2015 (tabla 10630) y base 2016 para
    2016-2025 (tabla 73781), a precios corrientes.
  · Tribunal de Cuentas, informe de fiscalización de los premios de SELAE, ejercicio 2022, asumido por las Cortes y
    publicado en el BOE (BOE-A-2025-14671): décimos jugados y premiados y euros jugados y repartidos en premios.
  · BCE (Statistical Data Warehouse): índice S&P 500 (media mensual, sin dividendos, en dólares) y tipo de cambio
    dólar/euro (media mensual). El S&P 500 en euros = índice / dólares por euro.
  · Gravamen especial sobre los premios: Ley 35/2006 del IRPF, DA 33.ª y DT 35.ª (BOE), y AEAT.

Cálculo (C): cada diciembre se «invierte» el gasto de ese año comprando el índice a su media de diciembre; el valor se
mide con la última media mensual publicada. Sin dividendos ni comisiones ni impuestos: es una cifra a la baja para la
bolsa (los dividendos del S&P 500 son en torno a un 1,5-2 % al año).
"""
import csv
import json
import pathlib
import re
import subprocess

RAIZ = pathlib.Path(__file__).resolve().parent.parent
RAW, CLEAN = RAIZ / "data" / "raw" / "t19", RAIZ / "data" / "clean"


def epf(fichero, empieza):
    out = {}
    for s in json.loads((RAW / fichero).read_text(encoding="utf-8")):
        n = s["Nombre"]
        if n.startswith("Juegos de azar") or ("Juegos de azar" in n and "Base 2006" in n):
            for clave, etiqueta in (("hogar", "Gasto medio por hogar"), ("persona", "Gasto medio por persona")):
                if etiqueta in n and empieza(n):
                    out.setdefault(clave, {}).update({x["Anyo"]: x["Valor"] for x in s["Data"]})
    return out


def ecb(fichero):
    return {r["TIME_PERIOD"]: float(r["OBS_VALUE"]) for r in csv.DictReader((RAW / fichero).open(encoding="utf-8"))}


def num(s):
    return float(s.replace(".", "").replace(",", "."))


def main():
    # 1 · gasto en juegos de azar (INE, EPF): base 2006 hasta 2015, base 2016 desde 2016
    b06 = epf("ine_10630_epf_base2006_gasto_5digitos.json", lambda n: "Dato base" in n and "Gasto medio" in n)
    b16 = epf("ine_73781_epf_gasto_5digitos_corrientes.json", lambda n: n.startswith("Juegos de azar. Gasto total."))
    gasto = {k: {a: v for a, v in b06[k].items() if 2007 <= a <= 2015} | {a: v for a, v in b16[k].items() if a >= 2016} for k in ("hogar", "persona")}

    # 2 · Tribunal de Cuentas (BOE-A-2025-14671), cuadro n.º 4, ejercicio 2022
    txt = subprocess.run(["pdftotext", "-layout", str(RAW / "boe_BOE-A-2025-14671_tcu_premios_selae_2022.pdf"), "-"],
                         capture_output=True, text=True, check=True).stdout
    m = re.search(r"Lotería Nacional\s+([\d.]+)\s+([\d.,]+)\s+([\d.]+)\s+([\d.,]+)", txt)
    t = re.search(r"TOTAL\s+([\d.]+)\s+([\d.,]+)\s+([\d.]+)\s+([\d.,]+)", txt)
    ln = {"decimos_jugados": int(num(m.group(1))), "jugado_millones": num(m.group(2)), "premios": int(num(m.group(3))), "premios_millones": num(m.group(4))}
    ln["vuelve_pct"] = round(100 * ln["premios_millones"] / ln["jugado_millones"], 1)
    ln["sin_premio_pct"] = round(100 * (1 - ln["premios"] / ln["decimos_jugados"]), 1)
    ln["sin_premio_de_cada_10"] = round(10 * (1 - ln["premios"] / ln["decimos_jugados"]))
    ln["decimos_millones"] = round(ln["decimos_jugados"] / 1e6, 1)
    ln["premios_num_millones"] = round(ln["premios"] / 1e6, 1)
    todos = {"jugado_millones": num(t.group(2)), "premios_millones": num(t.group(4))}
    todos["vuelve_pct"] = round(100 * todos["premios_millones"] / todos["jugado_millones"], 1)

    # 3 · S&P 500 en euros (BCE)
    sp, fx = ecb("ecb_fm_sp500_mensual.csv"), ecb("ecb_exr_usd_eur_mensual.csv")
    sp_eur = {k: sp[k] / fx[k] for k in sp if k in fx}
    ultimo = max(sp_eur)

    def invertir(desde, hasta=2025):
        aportado, partes, serie = 0.0, 0.0, {}
        for a in range(desde, hasta + 1):
            aportado += gasto["hogar"][a]
            partes += gasto["hogar"][a] / sp_eur[f"{a}-12"]
            serie[a] = {"jugado": round(aportado), "en_bolsa": round(partes * sp_eur[f"{a}-12"])}
        valor = partes * sp_eur[ultimo]
        return {"desde": desde, "hasta_aportacion": hasta, "valorado_en": ultimo, "jugado_eur": round(aportado), "en_bolsa_eur": round(valor),
                "veces": round(valor / aportado, 1), "por_anyo": serie}

    out = {
        "tema": "¿Lotería o invertir? Lo que un hogar medio se gasta en loterías y apuestas frente a meterlo en bolsa (S&P 500)",
        "gasto_juegos_azar_eur": {"fuente": "INE, Encuesta de Presupuestos Familiares (lo que declaran los hogares; todas las loterías y apuestas)",
                                  "por_hogar": {str(a): v for a, v in sorted(gasto["hogar"].items())},
                                  "por_persona": {str(a): v for a, v in sorted(gasto["persona"].items())}},
        "loteria_nacional_2022": {"fuente": "Tribunal de Cuentas, BOE-A-2025-14671, cuadro n.º 4", **ln},
        "todos_los_juegos_selae_2022": todos,
        "sp500_eur": {"fuente": "BCE: FM.M.US.USD.DS.EI.S_PCOMP.HSTA y EXR.M.USD.EUR.SP00.A (medias mensuales)",
                      **{k: round(sp_eur[k], 1) for k in (f"{a}-12" for a in (2007, 2016, 2019, 2025))}, ultimo: round(sp_eur[ultimo], 1)},
        "invertir": {str(d): invertir(d) for d in (2007, 2016, 2019)},
        "bolsa_2008_caida_pct": round(100 * (sp_eur["2008-12"] / sp_eur["2007-12"] - 1), 1),
        "gravamen_premios": {"fuente": "Ley 35/2006 del IRPF, DA 33.ª y DT 35.ª (BOE); AEAT", "tipo_pct": 20,
                             "exento_eur": {"2007": None, "2013-2017": 2500, "2018 (desde el 5-7)": 10000, "2019": 20000, "hoy": 40000},
                             "nota": "En 2007 los premios de lotería no pagaban impuestos: el gravamen está en vigor desde el 1-1-2013. «hoy»: desde el ejercicio que sigue a 2019 (40.000 €)."},
    }
    CLEAN.mkdir(parents=True, exist_ok=True)
    (CLEAN / "t20_loteria_invertir.json").write_text(json.dumps(out, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    print(f"gasto por hogar: 2007 {gasto['hogar'][2007]} · 2016 {gasto['hogar'][2016]} · 2019 {gasto['hogar'][2019]} · 2025 {gasto['hogar'][2025]} €")
    print(f"Lotería Nacional 2022: vuelve el {ln['vuelve_pct']} %; sin premio el {ln['sin_premio_pct']} % de los décimos")
    for d, v in out["invertir"].items():
        print(f"desde {d}: jugado {v['jugado_eur']} € → en bolsa {v['en_bolsa_eur']} € ({v['veces']} veces), valorado en {ultimo}")


if __name__ == "__main__":
    main()
