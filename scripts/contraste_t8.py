"""Contraste de T8 que pidió Bruno el 18-11-2026: ¿estamos mejor o peor que hace 10, 20 y 40 años?

Lee de data/raw (todo oficial):
- Comisión Europea, Weekly Oil Bulletin: precio semanal de la gasolina 95 y del gasóleo en España, con y sin impuestos (desde 2005).
- BOE, Reales Decretos-ley 7/2026, 18/2026 y 25/2026: rebajas temporales del impuesto de los carburantes en 2026.
- INE: sueldos (Encuesta de Salarios 1986, EES 2006, EAES 2016-2024), ETCL hasta el 2.º trimestre de 2026 e IPC.
Usa el mismo motor de impuestos que T8 (scripts/calcular_t8.py).

Escribe data/clean/t8_contraste.json.
"""
import collections
import html
import json
import re
from pathlib import Path

import openpyxl

import calcular_t8 as T

RAIZ = Path(__file__).resolve().parent.parent
RAW, CLEAN = RAIZ / "data" / "raw", RAIZ / "data" / "clean"


def boe(fichero, *frases):
    """Comprueba que cada frase está literalmente en el texto del BOE."""
    t = (RAW / fichero).read_text(encoding="utf-8", errors="replace")
    t = re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", t)))
    for f in frases:
        if f not in t:
            raise SystemExit(f"No encuentro en {fichero}: «{f}»")


def carburantes(ipc):
    wb = openpyxl.load_workbook(RAW / "ce_boletin_petrolero_historico.xlsx", read_only=True, data_only=True)

    def serie(hoja, col):
        filas = list(wb[hoja].iter_rows(values_only=True))
        i = filas[0].index(col)
        return {r[0]: (r[i], r[i + 1]) for r in filas[3:] if hasattr(r[0], "year")}

    con = serie("Prices with taxes", "ES_price_with_tax_euro95")
    sin = serie("Prices wo taxes", "ES_price_wo_tax_euro95")
    acc = collections.defaultdict(lambda: [[], [], [], []])
    for d in con:
        if con[d][0] and sin.get(d) and sin[d][0]:
            a = acc[str(d.year)]
            a[0].append(con[d][0]); a[1].append(sin[d][0]); a[2].append(con[d][1]); a[3].append(sin[d][1])
    media = lambda l: sum(l) / len(l) / 1000
    ult = max(d for d in con if con[d][0])
    out = {"ultima_semana": str(ult.date())}
    # tipos de la Ley 38/1992 sin rebaja (gasolina 95: 400,69 + 72; gasóleo: 307 + 72) e IVA del 21 %
    ley = {"gasolina95": 0.47269, "gasoleo": 0.379}
    for prod, j in (("gasolina95", 0), ("gasoleo", 2)):
        d = {}
        for a in ("2006", "2016", "2022", "2026"):
            p, s = media(acc[a][j]), media(acc[a][j + 1])
            f = ipc["2026"] / ipc[a]
            d[a] = {"semanas": len(acc[a][j]), "precio": round(p, 3), "sin_impuestos": round(s, 3), "impuestos": round(p - s, 3),
                    "pct_impuestos": round(100 * (p - s) / p, 1),
                    "en_euros_de_2026": {"precio": round(p * f, 3), "sin_impuestos": round(s * f, 3), "impuestos": round((p - s) * f, 3)}}
        jj = 0 if j == 0 else 1
        p, s = con[ult][jj] / 1000, sin[ult][jj] / 1000
        sin_rebaja = (s + ley[prod]) * 1.21
        d["ultima_semana"] = {"precio": round(p, 3), "sin_impuestos": round(s, 3), "impuestos": round(p - s, 3),
                              "pct_impuestos": round(100 * (p - s) / p, 1),
                              "si_no_hubiera_rebaja": {"precio": round(sin_rebaja, 3), "impuestos": round(sin_rebaja - s, 3),
                                                       "pct_impuestos": round(100 * (sin_rebaja - s) / sin_rebaja, 1)}}
        out[prod] = d
    return out


def sueldos(N, ipc):
    t3 = json.loads((CLEAN / "t3_vivienda.json").read_text(encoding="utf-8"))
    eaes = t3["sueldos_eaes"]
    etcl = json.loads((RAW / "ine_etcl_coste_salarial_t6038.json").read_text(encoding="utf-8"))
    nombre = ("Ambas jornadas. Industria, construcción y servicios (excepto actividades de los hogares como empleadores y de "
              "organizaciones y organismos extraterritoriales). Coste salarial total. Costes salariales. Total Nacional. Euros.")
    s = next(x for x in etcl if x["Nombre"].strip() == nombre)
    v = {(x["Anyo"], x["FK_Periodo"]): x["Valor"] for x in s["Data"]}   # 19 = T1, 20 = T2
    crec = (v[(2026, 19)] + v[(2026, 20)]) / (v[(2024, 19)] + v[(2024, 20)])
    h = lambda a: ipc["2026"] / ipc[a]
    out = {"crecimiento_etcl_1s2024_1s2026": round(crec, 4),
           "nota": ("Sueldo bruto anual. 1986: Encuesta de Salarios del INE (retribución por hora × jornada pactada; industria y servicios). "
                    "2006: Encuesta de Estructura Salarial. 2016 y 2024: Encuesta Anual de Estructura Salarial. 2026: el último dato anual (2024) "
                    "por lo que han subido los sueldos según la ETCL del INE entre el primer semestre de 2024 y el de 2026 (estimación, C)."),
           "bruto_en_euros_de_2026": {}, "neto_en_euros_de_2026": {}, "mismo_sueldo_real": {}}
    bruto = {"media": {"1986": t3["hace_40_anos"]["sueldo_1986"]["anual_pts"], "2006": 19686.0, "2016": eaes["media"]["2016"],
                       "2024": eaes["media"]["2024"], "2026": round(eaes["media"]["2024"] * crec)},
             "mediana": {"2006": 15739.0, "2016": eaes["mediana"]["2016"], "2024": eaes["mediana"]["2024"],
                         "2026": round(eaes["mediana"]["2024"] * crec)}}

    def neto(a, b):
        n = N[a]
        emp, tra = T.cotizaciones(n, "cajero", b)
        ce, ct = sum(emp.values()), sum(tra.values())
        ir, _ = T.irpf(a, n, b, ct)
        k = h(a) / (T.PTS if a == "1986" else 1)
        return {"neto": round((b - ct - ir) * k), "al_estado": round((ir + ct + ce) * k),
                "pct_estado_del_coste": round(100 * (ir + ct + ce) / (b + ce), 1), "pct_irpf_del_bruto": round(100 * ir / b, 1)}

    for k, d in bruto.items():
        out["bruto_en_euros_de_2026"][k] = {a: round(b * h(a) / (T.PTS if a == "1986" else 1)) for a, b in d.items()}
        out["neto_en_euros_de_2026"][k] = {a: neto(a, b) for a, b in d.items() if a in N}
        hoy = out["bruto_en_euros_de_2026"][k]["2026"]   # el mismo sueldo real que hoy, con las normas de cada año
        out["mismo_sueldo_real"][k] = {"bruto_en_euros_de_2026": hoy,
                                       **{a: neto(a, hoy / h(a) * (T.PTS if a == "1986" else 1)) for a in ("1986", "2006", "2026")}}
    return out


def main():
    N, I = T.normas(), T.ipc_largo()
    t3 = json.loads((CLEAN / "t3_vivienda.json").read_text(encoding="utf-8"))
    ipc = dict(t3["hace_40_anos"]["ipc_media_anual"])
    ipc.update({a: I[a] for a in ("1986", "2006", "2026")})
    ipc["2022"] = t3["ipc"]["2022"]["media"]
    boe("boe_rdl_7_2026_oriente_medio.html",
        "Epígrafe 1.2.2 Las demás gasolinas sin plomo: 304,32 euros por 1.000 litros de tipo general y 54,68 euros por 1.000 litros de tipo especial.",
        "Con efectos desde la entrada en vigor de este real decreto-ley y vigencia hasta el 30 de junio de 2026, se aplicará el tipo del 10 por ciento del Impuesto sobre el Valor Añadido")
    boe("boe_rdl_25_2026_oriente_medio.html",
        "de 20 céntimos de euro por litro en el mes de octubre, de 13 céntimos de euro por litro en el mes de noviembre y de 6 céntimos de euro por litro en el mes de diciembre",
        "Epígrafe 1.2.2 Las demás gasolinas sin plomo: 231,15 euros por 1.000 litros de tipo general y 41,54 euros por 1.000 litros de tipo especial.")
    out = {"tema": "Contraste de T8: ¿estamos mejor o peor que hace 10, 20 y 40 años? (Bruno, 18-11-2026)",
           "ipc_media_anual": ipc,
           "carburantes": carburantes(ipc),
           "rebajas_2026": {
               "gasolina95_por_litro": {"ley_38_1992": 0.47269, "21mar_30jun": 0.359, "octubre": 0.27269},
               "iva_carburantes": {"21mar_30jun": 10, "resto": 21},
               "nota": ("Real Decreto-ley 7/2026 (desde su entrada en vigor, en marzo, hasta el 30-6-2026): gasolina 95 a 304,32 + 54,68 € por 1.000 litros "
                        "e IVA del 10 %. Real Decreto-ley 18/2026: retirada gradual en julio, agosto y septiembre, con salvaguarda si el IPC de la gasolina sube "
                        "más de un 15 %. Real Decreto-ley 25/2026: 20 céntimos menos por litro en octubre (231,15 + 41,54), y 13 y 6 en noviembre y diciembre, "
                        "o 20 si el IPC de la gasolina o del gasóleo de septiembre u octubre supera en más de un 15 % el del año anterior. El boletín de la "
                        "Comisión Europea da 272,69 € por 1.000 litros desde el 12-10-2026.")},
           "sueldos": sueldos(N, ipc)}
    (CLEAN / "t8_contraste.json").write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding="utf-8")
    c = out["carburantes"]
    for prod in ("gasolina95", "gasoleo"):
        for a, d in c[prod].items():
            print(prod, a, d)
    for k, d in out["sueldos"].items():
        print(k, d)


if __name__ == "__main__":
    main()
