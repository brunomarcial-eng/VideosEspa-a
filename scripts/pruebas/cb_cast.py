import os, sys, re, time, difflib
os.environ["HF_HUB_DISABLE_XET"] = "1"
import numpy as np, torch, torchaudio as ta
import perth
if perth.PerthImplicitWatermarker is None:
    perth.PerthImplicitWatermarker = perth.DummyWatermarker
from chatterbox.mtl_tts import ChatterboxMultilingualTTS
from faster_whisper import WhisperModel
torch.set_num_threads(4)
REF = "diseno/voces/ref-dave.wav"
m = ChatterboxMultilingualTTS.from_pretrained(device="cpu")
asr = WhisperModel("small", device="cpu", compute_type="int8")
sr = m.sr
norm = lambda s: re.sub(r"[^a-záéíóúñü0-9 ]", "", s.lower())
def recorta(a, umbral=0.012):
    idx = np.where(np.abs(a) > umbral)[0]
    return a if not len(idx) else a[max(0, idx[0] - int(0.04 * sr)): idx[-1] + int(0.12 * sr)]
def di(texto, exag, cfg, intentos=4):
    mejor = None
    for k in range(intentos):
        torch.manual_seed(1000 + k * 17 + len(texto))
        w = recorta(m.generate(texto, language_id="es", audio_prompt_path=REF, exaggeration=exag, cfg_weight=cfg).squeeze().numpy())
        a16 = np.interp(np.arange(0, len(w), sr / 16000), np.arange(len(w)), w).astype(np.float32)
        oido = " ".join(s.text.strip() for s in asr.transcribe(a16, language="es", beam_size=5)[0])
        sim = difflib.SequenceMatcher(None, norm(texto), norm(oido)).ratio()
        largo_ok = len(w) / sr < 0.6 + 0.105 * len(texto)
        nota = sim - (0 if largo_ok else 0.3)
        if mejor is None or nota > mejor[0]:
            mejor = (nota, w, oido, k)
        if sim > 0.9 and largo_ok:
            break
    return mejor
frases = ["A ver, pregunta rápida.", "Llenar el carro de la compra… ¿te cuesta hoy más, o menos, que hace diez años?",
          "Ojo, que no te hablo de euros. Te hablo de horas de tu trabajo.",
          "En dos mil dieciséis, la compra del mes le costaba doce coma ocho horas de trabajo."]
for nombre, exag, cfg in [("A1", 0.5, 0.5), ("A2", 0.7, 0.3)]:
    partes, t0 = [], time.time()
    for f in frases:
        nota, w, oido, k = di(f, exag, cfg)
        print(nombre, f"nota {nota:.2f} intento {k} dur {len(w)/sr:.1f}s ·", oido, flush=True)
        partes += [w.astype(np.float32), np.zeros(int(0.3 * sr), np.float32)]
    a = np.concatenate(partes); a = a / np.abs(a).max() * 0.9
    ta.save(f"{nombre}.wav", torch.from_numpy(a).unsqueeze(0), sr)
    print(nombre, "total", round(len(a) / sr, 1), "s · cálculo", round(time.time() - t0), "s", flush=True)
