"""Casting 2 de motores de voz: las mismas dos frases de T2 con cada candidato libre.

Uso:
  ~/.venv-qwen/bin/python scripts/pruebas/casting2.py qwen17 SALIDA_DIR
  ~/.venv-chatterbox/bin/python scripts/pruebas/casting2.py chatterbox SALIDA_DIR
Cada modo deja SALIDA_DIR/<modo>_1.wav y <modo>_2.wav (24 kHz). La voz 3 actual ya está en
videos/t2/audio/tomas/01.wav y 13.wav.
"""
import os
import sys
import time

os.environ.setdefault("HF_HUB_DISABLE_XET", "1")
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
import numpy as np  # noqa: E402
import soundfile as sf  # noqa: E402

RAIZ = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
REF = os.path.join(RAIZ, "diseno/voces/ref-dave.wav")
REF_TXT = open(os.path.join(RAIZ, "diseno/voces/ref-dave.txt"), encoding="utf-8").read().strip()
FRASES = [
    "¿Hoy trabaja en España más gente que antes de la crisis... o menos? Piénsalo, que tiene truco.",
    "Más gente trabajando que nunca. Y más paro que en dos mil siete. Las dos cosas son verdad.",
]


def guardar(ruta, a, sr):
    a = np.asarray(a, dtype=np.float32).squeeze()
    a = a / (np.abs(a).max() + 1e-9) * 0.89
    sf.write(ruta, a, sr)
    print(os.path.basename(ruta), f"{len(a) / sr:.1f} s", flush=True)


def qwen17(salida):
    import torch
    from qwen_tts import Qwen3TTSModel
    torch.set_num_threads(os.cpu_count() or 4)
    m = Qwen3TTSModel.from_pretrained("Qwen/Qwen3-TTS-12Hz-1.7B-Base", device_map="cpu", dtype=torch.float32)
    prompt = m.create_voice_clone_prompt(ref_audio=REF, ref_text=REF_TXT)
    for i, f in enumerate(FRASES, 1):
        t0 = time.time()
        torch.manual_seed(7 + i)
        wavs, sr = m.generate_voice_clone(text=f, language="Spanish", voice_clone_prompt=prompt, max_new_tokens=400)
        guardar(os.path.join(salida, f"qwen17_{i}.wav"), wavs[0], sr)
        print("  cálculo", round(time.time() - t0), "s", flush=True)


def chatterbox(salida):
    import torch
    import perth
    if getattr(perth, "PerthImplicitWatermarker", None) is None:
        perth.PerthImplicitWatermarker = perth.DummyWatermarker
    from chatterbox.mtl_tts import ChatterboxMultilingualTTS
    from huggingface_hub import hf_hub_download
    # El paquete 0.1.7 carga la V2. La V3 está en el mismo repositorio con otros nombres:
    # se monta una carpeta con los nombres que espera el cargador.
    d = os.path.join(os.path.expanduser("~"), ".modelos-voz", "chatterbox-v3")
    os.makedirs(d, exist_ok=True)
    s3 = os.path.join(d, "s3gen.pt")
    if os.path.islink(s3):
        os.unlink(s3)
    if not os.path.exists(s3):   # el vocoder V3 viene sin dos tablas fijas (filtros mel y ventana): se toman de la V2
        v3 = torch.load(hf_hub_download("ResembleAI/chatterbox", "s3gen_v3.pt"), map_location="cpu", weights_only=True)
        v2 = torch.load(hf_hub_download("ResembleAI/chatterbox", "s3gen.pt"), map_location="cpu", weights_only=True)
        for k in v2:
            v3.setdefault(k, v2[k])
        torch.save(v3, s3)
    for origen, destino in [("t3_mtl23ls_v3.safetensors", "t3_mtl23ls_v2.safetensors"), ("ve.pt", "ve.pt"),
                            ("grapheme_mtl_merged_expanded_v1.json", "grapheme_mtl_merged_expanded_v1.json"), ("conds.pt", "conds.pt"),
                            ("Cangjie5_TC.json", "Cangjie5_TC.json")]:
        f = hf_hub_download("ResembleAI/chatterbox", origen)
        if not os.path.exists(os.path.join(d, destino)):
            os.symlink(f, os.path.join(d, destino))
    torch.manual_seed(int(os.environ.get("SEMILLA", 7)))
    m = ChatterboxMultilingualTTS.from_local(d, device="cpu")
    solo = os.environ.get("SOLO")
    for i, f in enumerate(FRASES, 1):
        if solo and str(i) != solo:
            continue
        t0 = time.time()
        wav = m.generate(f, language_id="es", audio_prompt_path=REF)
        guardar(os.path.join(salida, f"chatterbox_{i}.wav"), wav.cpu().numpy(), m.sr)
        print("  cálculo", round(time.time() - t0), "s", flush=True)


if __name__ == "__main__":
    modo, salida = sys.argv[1], sys.argv[2]
    os.makedirs(salida, exist_ok=True)
    {"qwen17": qwen17, "chatterbox": chatterbox}[modo](salida)
