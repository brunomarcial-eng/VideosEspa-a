#!/usr/bin/env python3
"""Datos limpios de T18 v2: el coche que más se compra en España, en meses de sueldo, y lo mismo en Alemania (Bruno, 23-11-2026).

Todo oficial:
  · Precios en España: Agencia Tributaria (ranking de ventas 2025, precio medio real por modelo sin impuestos; coche nuevo medio
    con impuesto de matriculación), más el IVA de cada año. Sale de data/clean/t17_mas_vendido.json.
  · Sueldo para comparar países: Eurostat, ganancia neta anual de un soltero sin hijos con el sueldo medio (earn_nt_net,
    P1_NCH_AW100), España y Alemania. Es el MEDIO, no el mediano: Eurostat no da el mediano neto por país con la misma medida.
  · Precio del mismo coche en Alemania (estimado): el de España por la relación de los niveles de precios de Eurostat del
    «equipo de transporte personal» (prc_ppp_ind, A010701; el último año publicado).

Uso: python3 scripts/calcular_t18.py → data/clean/t18_alemania.json
"""
import json
import pathlib

RAIZ = pathlib.Path(__file__).resolve().parent.parent
RAW, CLEAN = RAIZ / "data" / "raw", RAIZ / "data" / "clean"


def eurostat(fichero):
    d = json.loads((RAW / fichero).read_text(encoding="utf-8"))
    ids, tam = d["id"], d["size"]
    cats = [list(d["dimension"][k]["category"]["index"].keys()) for k in ids]
    out = {}
    for pos, v in d["value"].items():
        pos, idx = int(pos), []
        for s in reversed(tam):
            idx.append(pos % s)
            pos //= s
        out[tuple(cats[i][j] for i, j in enumerate(idx[::-1]))] = v
    return ids, out


def main():
    t17 = json.loads((CLEAN / "t17_mas_vendido.json").read_text(encoding="utf-8"))
    _, net = eurostat("eurostat_earn_nt_net_es_de.json")
    _, pli = eurostat("eurostat_prc_ppp_ind_es_de.json")
    neto = {geo: {k[-1]: v for k, v in net.items() if k[4] == geo} for geo in ("ES", "DE")}
    anyo_pli = max(k[-1] for k in pli if k[2] == "A010701")
    nivel = {geo: pli[("A", "PLI_EU27_2020", "A010701", geo, anyo_pli)] for geo in ("ES", "DE")}
    rel = nivel["DE"] / nivel["ES"]
    mes = {geo: neto[geo]["2025"] / 12 for geo in ("ES", "DE")}
    top = {m["modelo"]: m for m in t17["top_modelos"]["2025"]["top"]}
    # el BMW más vendido en España (ranking de Hacienda): su precio medio real con IVA
    import html, re
    s = (RAW / "aeat_matriculaciones_2025_ranking_marca_modelo.html").read_text(encoding="utf-8")
    s = re.sub(r"(?s)<script.*?</script>|<style.*?</style>", "", s)
    c = [html.unescape(re.sub(r"<[^>]+>|\s+", " ", x)).strip() for x in re.findall(r"<t[dh][^>]*>(.*?)</t[dh]>", s, re.S)]
    i = c.index("BMW")
    bmw = {"modelo": c[i + 3], "matriculados": int(c[i + 4].replace(".", "")), "precio_medio_sin_impuestos": int(c[i + 5].replace(".", ""))}
    bmw["precio_con_iva"] = round(bmw["precio_medio_sin_impuestos"] * 1.21)

    def meses(precio_es):
        return {"precio_es": round(precio_es), "precio_de_estimado": round(precio_es * rel),
                "meses_es": round(precio_es / mes["ES"], 1), "meses_de": round(precio_es * rel / mes["DE"], 1)}

    nuevo = t17["coche_nuevo_medio"]
    out = {"tema": "El coche que más se compra en España, en meses de sueldo, frente a Alemania",
           "nota": "Sueldo neto MEDIO de un soltero sin hijos (Eurostat, earn_nt_net) para poder comparar países; precios de España de la "
                   "Agencia Tributaria con IVA; precio en Alemania estimado con los niveles de precios de Eurostat (vehículos).",
           "sueldo_neto_medio_anual": {geo: {a: round(neto[geo][a]) for a in ("2007", "2016", "2019", "2025")} for geo in ("ES", "DE")},
           "sueldo_neto_medio_mes_2025": {geo: round(mes[geo]) for geo in ("ES", "DE")},
           "sueldo_aleman_mas_pct": round(100 * (mes["DE"] / mes["ES"] - 1), 1),
           "nivel_precios_vehiculos": {"anyo": anyo_pli, **nivel, "alemania_mas_cara_pct": round(100 * (rel - 1), 1)},
           "sandero": {**meses(top["SANDERO"]["precio_con_iva"])},
           "bmw": {**bmw, **meses(bmw["precio_con_iva"])},
           "coche_nuevo_medio": {**meses(nuevo["2025"]["precio_con_impuestos"])},
           "coche_nuevo_medio_espana_meses_sueldo_medio": {a: round(nuevo[a]["precio_con_impuestos"] / (neto["ES"][a] / 12), 1) for a in ("2007", "2016", "2019", "2025")}}
    (CLEAN / "t18_alemania.json").write_text(json.dumps(out, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    print(json.dumps(out, ensure_ascii=False, indent=1))


if __name__ == "__main__":
    main()
