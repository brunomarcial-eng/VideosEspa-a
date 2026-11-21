"""Genera varias tomas de unas líneas y se queda con la que más se parece a su personaje y menos al otro.
Uso: ~/.venv-qwen/bin/python scripts/pruebas/elegir_toma.py videos/t3/guion.json 10,11 --otro padre --n 8"""
import json, pathlib, sys
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent.parent))
import numpy as np, soundfile as sf
import voces
args = sys.argv
ruta = pathlib.Path(args[1]); lineas = [int(x) for x in args[2].split(",")]
otro = args[args.index("--otro") + 1]; N = int(args[args.index("--n") + 1]) if "--n" in args else 8
g = json.loads(ruta.read_text(encoding="utf-8"))
cfg = json.loads((voces.RAIZ / "diseno" / "voces.json").read_text(encoding="utf-8")); cfg.update(g.get("voz_pausas", {}))
asr = voces.cargar_asr()
p_otro = cfg["perfiles"][otro]
for b in g["beats"]:
    if b["n"] not in lineas:
        continue
    perfil = cfg["perfiles"][g["personajes"][b["quien"]]["genero"]]
    mejor = None
    for k in range(N):
        sem = 1000 * b["n"] + 100 + k
        a = voces.limpiar(voces.sintetizar(perfil, voces.normalizar(b["voz"]), sem), cfg.get("hueco_max_s", 0.5), cfg.get("hueco_queda_s", 0.38))
        ev = voces.evaluar(asr, a, b["voz"])
        s_yo, s_otro = voces.parecido_voz(perfil, a), voces.parecido_voz(p_otro, a)
        marca = (ev["ok"], round(s_yo - s_otro, 3))
        print(b["n"], sem, "ok" if ev["ok"] else "mala", f"yo {s_yo:.3f} otro {s_otro:.3f}", ev["oido"][:60], flush=True)
        if mejor is None or marca > mejor[0]:
            mejor = (marca, a, ev, sem, s_yo)
    marca, a, ev, sem, s_yo = mejor
    a = voces.nivelar(a)
    tomas = ruta.parent / "audio" / "tomas"
    sf.write(tomas / f"{b['n']:02d}.wav", a, voces.SR)
    ev["voz"] = round(s_yo, 3)
    (tomas / f"{b['n']:02d}.json").write_text(json.dumps({"huella": voces.huella(perfil, b["voz"], cfg), "semilla": sem, "texto": b["voz"], "ev": ev,
        "eleccion": f"la más parecida a su voz y menos a la de {otro} entre {N} tomas (diferencia {marca[1]})"}, ensure_ascii=False, indent=1), encoding="utf-8")
    print("elegida", b["n"], sem, marca, flush=True)
