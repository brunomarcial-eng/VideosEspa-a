"""Muestras de voz para T12 (educación): la profesora y el alumno de 15 años (Qwen3-TTS 1.7B VoiceDesign, Apache-2.0).
Voces inventadas a partir de una descripción, sin clonar a nadie. Uso: ~/.venv-qwen/bin/python scripts/pruebas/educacion_voces.py SALIDA_DIR"""
import os
import sys
os.environ.setdefault("HF_HUB_DISABLE_XET", "1")
import numpy as np
import soundfile as sf
import torch
from qwen_tts import Qwen3TTSModel

TEXTOS = {
    "profesora": "Siéntese, por favor. Le enseño los resultados: en lectura, uno de cada tres alumnos de quince años no llega al nivel básico. En dos mil quince era uno de cada seis.",
    "alumno": "Papá, que yo estudio, ¿eh? Pero es que en clase somos un montón y no me da tiempo a enterarme de nada.",
}
VOCES = {
    "profesora": {
        "A": "Mujer española de 40 años, profesora de instituto de Madrid. Acento castellano de España (pronuncia la zeta y la ce). Voz clara, cercana y firme, de tutora que habla con los padres. Ritmo natural, con pausas.",
        "B": "Mujer española de unos 45 años, profesora de lengua en un instituto público, castellana de España (pronuncia la zeta y la ce). Voz cálida y algo grave, seria y directa, con un punto de cansancio. Ritmo pausado.",
        "C": "Mujer española de 35 años, profesora joven de matemáticas, de Madrid, acento castellano de España (pronuncia la zeta y la ce). Voz enérgica y expresiva, convencida, que habla con pasión. Ritmo natural.",
    },
    "alumno": {
        "A": "Chico adolescente español de 15 años, de Madrid, acento castellano de España (pronuncia la zeta y la ce). Voz joven, todavía algo aguda, un poco quejica y despreocupada. Habla rápido y natural.",
        "B": "Chico español de 15 años que estudia cuarto de la ESO, castellano de España (pronuncia la zeta y la ce). Voz de adolescente que ya cambió, algo grave para su edad, tímida y sincera. Ritmo natural.",
        "C": "Chaval español de 15 años, de barrio, acento castellano de España (pronuncia la zeta y la ce). Voz juvenil y simpática, con energía, un poco chulesca pero buena gente. Ritmo natural y expresivo.",
    },
}
salida = sys.argv[1]
os.makedirs(salida, exist_ok=True)
torch.set_num_threads(os.cpu_count() or 4)
m = Qwen3TTSModel.from_pretrained("Qwen/Qwen3-TTS-12Hz-1.7B-VoiceDesign", device_map="cpu", dtype=torch.float32)
for rol, voces in VOCES.items():
    for k, ins in voces.items():
        f = os.path.join(salida, f"{rol}_{k}.wav")
        if os.path.exists(f):
            continue
        torch.manual_seed(11)
        wavs, sr = m.generate_voice_design(text=TEXTOS[rol], language="Spanish", instruct=ins, max_new_tokens=600)
        a = np.asarray(wavs[0], dtype=np.float32).squeeze()
        a = a / (np.abs(a).max() + 1e-9) * 0.89
        sf.write(f, a, sr)
        print(rol, k, f"{len(a) / sr:.1f} s", flush=True)
