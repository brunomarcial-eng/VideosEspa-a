import os, time, sys
os.environ["HF_HUB_DISABLE_XET"] = "1"
import torch, soundfile as sf, numpy as np
torch.set_num_threads(4)
from qwen_tts import Qwen3TTSModel
REF = "diseno/voces/ref-dave.wav"
REF_TXT = "Detrás de las medallas y grandes triunfos que se logran en unas olimpiadas, se esconden otras que se consiguen mucho antes de llegar hasta la competición."
TEXTO = ("A ver, pregunta rápida. Llenar el carro de la compra… ¿te cuesta hoy más, o menos, que hace diez años? "
         "Ojo, que no te hablo de euros. Te hablo de horas de tu trabajo. "
         "En dos mil dieciséis, la compra del mes le costaba doce coma ocho horas de trabajo.")
def guarda(nombre, wavs, sr, t0):
    a = np.asarray(wavs[0], dtype=np.float32)
    sf.write(f"{nombre}.wav", a / (np.abs(a).max() + 1e-9) * 0.9, sr)
    print(nombre, "audio", round(len(a) / sr, 1), "s · cálculo", round(time.time() - t0), "s", flush=True)
que = sys.argv[1]
if que == "clon":
    t0 = time.time()
    m = Qwen3TTSModel.from_pretrained("Qwen/Qwen3-TTS-12Hz-0.6B-Base", device_map="cpu", dtype=torch.float32)
    print("modelo base cargado", round(time.time() - t0), "s", flush=True)
    t0 = time.time()
    wavs, sr = m.generate_voice_clone(text=TEXTO, language="Spanish", ref_audio=REF, ref_text=REF_TXT)
    guarda("B_qwen_clon", wavs, sr, t0)
else:
    t0 = time.time()
    m = Qwen3TTSModel.from_pretrained("Qwen/Qwen3-TTS-12Hz-1.7B-VoiceDesign", device_map="cpu", dtype=torch.float32)
    print("modelo diseño cargado", round(time.time() - t0), "s", flush=True)
    for nombre, ins in [
        ("C_qwen_hombre", "Hombre español de unos 38 años, con acento castellano de Madrid (español de España, pronuncia la zeta y la ce). Voz cálida y cercana, natural, como un amigo que te cuenta algo curioso en un bar. Ritmo tranquilo, con pausas, entonación viva pero sin exagerar."),
        ("D_qwen_mujer", "Mujer española de unos 35 años, con acento castellano de Madrid (español de España, pronuncia la zeta y la ce). Voz clara, cercana y natural, como una amiga que te explica algo curioso. Ritmo tranquilo, con pausas, entonación viva pero sin exagerar."),
    ]:
        t0 = time.time()
        wavs, sr = m.generate_voice_design(text=TEXTO, language="Spanish", instruct=ins)
        guarda(nombre, wavs, sr, t0)
