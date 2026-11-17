"""Genera varias tomas de unas líneas y se queda con la que más se parece a la voz de SU personaje en un vídeo
ya aprobado (el «centro» de todas sus frases allí) y menos a la del otro personaje.
Mide mejor que comparar con la grabación de referencia, sobre todo en frases cortas.
Uso: ~/.venv-qwen/bin/python scripts/pruebas/elegir_toma_centro.py videos/t4/guion.json 7,9 --ref videos/t3 --n 6"""
import json, pathlib, sys
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent.parent))
import numpy as np, soundfile as sf
import voces
from resemblyzer import VoiceEncoder, preprocess_wav

args = sys.argv
ruta = pathlib.Path(args[1]); lineas = [int(x) for x in args[2].split(",")]
ref = pathlib.Path(args[args.index("--ref") + 1]); N = int(args[args.index("--n") + 1]) if "--n" in args else 6
enc = VoiceEncoder("cpu", verbose=False)
emb = lambda a, sr: enc.embed_utterance(preprocess_wav(a if a.ndim == 1 else a.mean(1), source_sr=sr))

# Centro de la voz de cada personaje en el vídeo de referencia.
gr = json.loads((ref / "guion.json").read_text(encoding="utf-8"))
centro = {}
for b in gr["beats"]:
    a, sr = sf.read(str(ref / "audio" / f"voz_{b['n']:02d}.wav"), dtype="float32")
    centro.setdefault(b["quien"], []).append(emb(a, sr))
centro = {q: (lambda c: c / np.linalg.norm(c))(np.mean(v, axis=0)) for q, v in centro.items()}

g = json.loads(ruta.read_text(encoding="utf-8"))
cfg = json.loads((voces.RAIZ / "diseno" / "voces.json").read_text(encoding="utf-8")); cfg.update(g.get("voz_pausas", {}))
asr = voces.cargar_asr()
for b in g["beats"]:
    if b["n"] not in lineas:
        continue
    perfil = cfg["perfiles"][g["personajes"][b["quien"]]["genero"]]
    otro = next(q for q in centro if q != b["quien"])
    mejor = None
    for k in range(N):
        sem = 1000 * b["n"] + 200 + k
        a = voces.limpiar(voces.sintetizar(perfil, voces.normalizar(b["voz"]), sem), cfg.get("hueco_max_s", 0.5), cfg.get("hueco_queda_s", 0.38))
        ev = voces.evaluar(asr, a, b["voz"])
        e = emb(a.astype("float32"), voces.SR)
        s_yo, s_otro = float(e @ centro[b["quien"]]), float(e @ centro[otro])
        marca = (ev["ok"], round(s_yo - s_otro, 3))
        print(b["n"], sem, "ok" if ev["ok"] else "mala", f"yo {s_yo:.3f} otro {s_otro:.3f}", ev["oido"][:60], flush=True)
        if mejor is None or marca > mejor[0]:
            mejor = (marca, a, ev, sem, s_yo)
    marca, a, ev, sem, s_yo = mejor
    a = voces.nivelar(a)
    tomas = ruta.parent / "audio" / "tomas"
    sf.write(tomas / f"{b['n']:02d}.wav", a, voces.SR)
    ev["voz"] = round(voces.parecido_voz(perfil, a) or 0, 3)
    (tomas / f"{b['n']:02d}.json").write_text(json.dumps({"huella": voces.huella(perfil, b["voz"], cfg), "semilla": sem, "texto": b["voz"], "ev": ev,
        "eleccion": f"la más parecida a la voz de {b['quien']} en {ref.name} y menos a la de {otro}, entre {N} tomas (diferencia {marca[1]})"}, ensure_ascii=False, indent=1), encoding="utf-8")
    print("elegida", b["n"], sem, marca, flush=True)
