"""Muestras de voz para el padre de T3 (Qwen3-TTS 1.7B VoiceDesign, Apache-2.0): voz inventada a partir de una
descripción, sin clonar a nadie. Uso: ~/.venv-qwen/bin/python scripts/pruebas/padre_voz.py SALIDA_DIR"""
import os
import sys
os.environ.setdefault("HF_HUB_DISABLE_XET", "1")
import numpy as np
import soundfile as sf
import torch
from qwen_tts import Qwen3TTSModel

TEXTO = ("¡Es que no ahorráis nada! Bali, Netflix, cañas, restaurantes… Así, normal que no os compréis una casa. "
         "¡Pero yo pagaba la hipoteca al quince por ciento!")
VOCES = {
    "A": "Hombre español de 62 años, de Madrid, con acento castellano de España (pronuncia la zeta y la ce). Voz grave y un poco ronca, de padre que regaña a su hijo, indignado pero con cariño. Habla con energía y ritmo natural.",
    "B": "Hombre español de unos 65 años, de Valladolid, castellano de España (pronuncia la zeta y la ce). Voz madura y firme, algo cascada por la edad, tono de padre protestón y socarrón. Ritmo natural, con pausas.",
    "C": "Hombre español de 60 años, acento castellano de España (pronuncia la zeta y la ce). Voz profunda y pausada, seria, de padre de los de antes que no se deja convencer. Enfadado y algo sarcástico, sin gritar.",
}
salida = sys.argv[1]
os.makedirs(salida, exist_ok=True)
torch.set_num_threads(os.cpu_count() or 4)
m = Qwen3TTSModel.from_pretrained("Qwen/Qwen3-TTS-12Hz-1.7B-VoiceDesign", device_map="cpu", dtype=torch.float32)
for k, ins in VOCES.items():
    if os.path.exists(os.path.join(salida, f"padre_{k}.wav")):
        continue
    torch.manual_seed(11)
    wavs, sr = m.generate_voice_design(text=TEXTO, language="Spanish", instruct=ins, max_new_tokens=500)
    a = np.asarray(wavs[0], dtype=np.float32).squeeze()
    a = a / (np.abs(a).max() + 1e-9) * 0.89
    sf.write(os.path.join(salida, f"padre_{k}.wav"), a, sr)
    print(k, f"{len(a) / sr:.1f} s", flush=True)
