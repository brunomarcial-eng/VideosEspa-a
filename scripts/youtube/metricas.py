#!/usr/bin/env python3
"""Métricas del test de estilos (docs/piloto-test.md) desde YouTube Analytics.

Lee los vídeos de upload/*.resultado.json (o los que se pasen con --videos) y
escribe data/metricas/test-<fecha>.csv con: visualizaciones, «me gusta»,
«me gusta» por visualización, comentarios, duración media vista, % medio visto
y retención al 50 % del vídeo (la métrica que decide el test).

  python3 scripts/youtube/metricas.py --desde 2026-11-20 --hasta 2026-11-27
  python3 scripts/youtube/metricas.py --desde ... --hasta ... --videos ID1,ID2

Necesita la autorización en modo «escritorio» (incluye el permiso de Analytics).
La retención a 3 s («vistos frente a omitidos» de los Shorts) no está en la API:
se apunta a mano desde Studio.
Analytics tarda 48-72 h en tener datos.
"""
import argparse
import csv
import json
import pathlib
import sys
from datetime import date

from yt_comun import ANALYTICS, ErrorAPI, api_get

RAIZ = pathlib.Path(__file__).resolve().parents[2]


def videos_del_test() -> dict:
    out = {}
    for p in sorted((RAIZ / "upload").glob("*.resultado.json")):
        d = json.loads(p.read_text(encoding="utf-8"))
        if d.get("id_video"):
            out[d["id_video"]] = p.name.replace(".resultado.json", "")
    return out


def retencion_50(video: str, desde: str, hasta: str):
    resp = api_get("reports", {
        "ids": "channel==MINE", "startDate": desde, "endDate": hasta,
        "metrics": "audienceWatchRatio", "dimensions": "elapsedVideoTimeRatio",
        "filters": f"video=={video}"}, base=ANALYTICS)
    filas = resp.get("rows") or []
    if not filas:
        return None
    return min(filas, key=lambda r: abs(r[0] - 0.5))[1]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--desde", required=True)
    ap.add_argument("--hasta", required=True)
    ap.add_argument("--videos", help="ids separados por comas")
    a = ap.parse_args()
    vids = {v: v for v in a.videos.split(",")} if a.videos else videos_del_test()
    if not vids:
        print("No hay vídeos: pasa --videos o sube alguno con subir.py.")
        return 1
    metricas = "views,likes,comments,averageViewDuration,averageViewPercentage"
    resp = api_get("reports", {
        "ids": "channel==MINE", "startDate": a.desde, "endDate": a.hasta, "metrics": metricas,
        "dimensions": "video", "filters": "video==" + ",".join(vids), "sort": "-views"}, base=ANALYTICS)
    cab = [c["name"] for c in resp.get("columnHeaders", [])]
    salida = RAIZ / "data" / "metricas" / f"test-{date.today().isoformat()}.csv"
    salida.parent.mkdir(parents=True, exist_ok=True)
    with salida.open("w", newline="", encoding="utf-8") as fh:
        w = csv.writer(fh)
        w.writerow(["pieza", "video", "desde", "hasta", *cab[1:], "likes_por_vista", "retencion_50"])
        for fila in resp.get("rows", []):
            d = dict(zip(cab, fila))
            try:
                r50 = retencion_50(d["video"], a.desde, a.hasta)
            except ErrorAPI as e:
                print("Aviso:", e)
                r50 = None
            lpv = round(d["likes"] / d["views"], 4) if d.get("views") else None
            w.writerow([vids.get(d["video"], ""), d["video"], a.desde, a.hasta,
                        *[d[c] for c in cab[1:]], lpv, r50])
    print("Escrito", salida)
    return 0


if __name__ == "__main__":
    sys.exit(main())
