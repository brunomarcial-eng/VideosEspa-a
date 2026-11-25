#!/usr/bin/env python3
"""Línea de tiempo de PRUEBA (sin voz) para ver las escenas antes de grabar: estima cuánto dura cada palabra.

Uso: python3 scripts/pruebas/linea_prueba.py videos/t9 DIR_SALIDA
     node scripts/render_historia.mjs t9 --linea DIR_SALIDA/linea.json --cues DIR_SALIDA/cues.json --hoja DIR
Escribe DIR_SALIDA/linea.json y DIR_SALIDA/cues.json. No sirve para el vídeo final: los tiempos salen de voces.py.
"""
import json
import pathlib
import sys

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent.parent))
import sonido  # noqa: E402
import voces  # noqa: E402


def main(argv):
    d, out = pathlib.Path(argv[1]), pathlib.Path(argv[2])
    out.mkdir(parents=True, exist_ok=True)
    g = json.loads((d / "guion.json").read_text(encoding="utf-8"))
    t, planos, previo = 0.35, [], None
    for b in g["beats"]:
        if previo is not None:
            t += 0.35
        previo = b["quien"]
        ini, pals = t, []
        for w in b["voz"].split():
            dicho = voces.normalizar(w)
            dur = 0.06 + 0.062 * len(dicho.replace(" ", ""))
            pals.append({"p": w, "t0": round(t, 3), "t1": round(t + dur, 3), "frase": 0})
            t += dur + (0.18 if w[-1] in ".,?!:…" else 0.02)
        planos.append({"n": b["n"], "quien": b["quien"], "ini": round(ini, 3), "fin": round(t, 3), "texto": b["voz"], "pals": pals, "env": []})
    linea = {"id": g["id"], "fps": 30, "duracion": round(t + 1.2, 2), "entrada": 0.35, "voces": {}, "planos": planos}
    (out / "linea.json").write_text(json.dumps(linea, ensure_ascii=False), encoding="utf-8")
    historia = json.loads((d / "historia.json").read_text(encoding="utf-8"))
    (out / "cues.json").write_text(json.dumps(sonido.resolver_cues(historia, linea), ensure_ascii=False), encoding="utf-8")
    print(f"prueba: {linea['duracion']} s, {len(planos)} planos → {out}")


if __name__ == "__main__":
    main(sys.argv)
