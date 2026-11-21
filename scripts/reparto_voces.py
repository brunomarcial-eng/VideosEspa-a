#!/usr/bin/env python3
"""Reparto de voces (docs/voces-catalogo.md): qué voz del catálogo ha salido en cada vídeo y cuál lleva más tiempo sin salir.

Bruno, 21-11-2026: no se hacen más castings; se reutilizan las voces ya elegidas, alternándolas.
Lee videos/t*/guion.json («personajes.<quien>.voz», o «genero» en los guiones antiguos).

Uso: python3 scripts/reparto_voces.py
"""
import json
import pathlib
import re

RAIZ = pathlib.Path(__file__).resolve().parent.parent
CATALOGO = ["hombre", "padre", "hijo", "profesora", "comandante", "maquinista", "alumno", "viajera", "medica", "hostelera"]


def main():
    guiones = sorted((RAIZ / "videos").glob("t*/guion.json"), key=lambda p: int(re.sub(r"\D", "", p.parent.name) or 0))
    usos = {v: [] for v in CATALOGO}
    orden = []
    for g in guiones:
        d = json.loads(g.read_text(encoding="utf-8"))
        vid = d["id"]
        orden.append(vid)
        for quien, p in (d.get("personajes") or {}).items():
            voz = p["voz"] if p.get("voz") in CATALOGO else p.get("genero")
            if voz in usos and vid not in [u[0] for u in usos[voz]]:
                usos[voz].append((vid, quien))
    pos = {v: i for i, v in enumerate(orden)}
    ultimo = {v: max((pos[u[0]] for u in usos[v]), default=-1) for v in CATALOGO}
    print(f"{'voz':<12} {'vídeos':>6}  {'último':<7} papeles")
    for v in sorted(CATALOGO, key=lambda v: (ultimo[v], len(usos[v]))):
        papeles = ", ".join(f"{a} ({q})" for a, q in usos[v])
        print(f"{v:<12} {len(usos[v]):>6}  {orden[ultimo[v]] if ultimo[v] >= 0 else '—':<7} {papeles}")
    print("\nArriba, las que llevan más tiempo sin salir: son las primeras candidatas para el próximo vídeo (si encajan con el papel).")


if __name__ == "__main__":
    main()
