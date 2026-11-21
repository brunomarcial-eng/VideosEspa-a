"""Muestras de voz para la médica de T11 (Qwen3-TTS 1.7B VoiceDesign, Apache-2.0): voz inventada a partir de
una descripción, sin clonar a nadie. Uso: ~/.venv-qwen/bin/python scripts/pruebas/medica_voz.py SALIDA_DIR"""
import os
import sys
os.environ.setdefault("HF_HUB_DISABLE_XET", "1")
import numpy as np
import soundfile as sf
import torch
from qwen_tts import Qwen3TTSModel

TEXTO = ("Lo de su rodilla es cosa del traumatólogo, así que le derivo. "
         "Para la primera cita con el especialista, ciento dos días de media. En dos mil dieciséis eran setenta y dos.")
VOCES = {
    "A": "Mujer española de 45 años, médica de familia de Madrid. Acento castellano de España (pronuncia la zeta y la ce). Voz serena, clara y cercana, profesional, con un punto de cansancio. Ritmo natural, sin prisa.",
    "B": "Mujer española de unos 40 años, doctora de un centro de salud, castellana de España (pronuncia la zeta y la ce). Voz firme y directa, segura, algo grave. Habla claro y con autoridad, con pausas naturales.",
    "C": "Mujer española de 50 años, médica veterana de la sanidad pública, de Madrid, acento castellano de España (pronuncia la zeta y la ce). Voz cálida y algo ronca, sincera, con un tono de queja contenida. Ritmo natural.",
}
salida = sys.argv[1]
os.makedirs(salida, exist_ok=True)
torch.set_num_threads(os.cpu_count() or 4)
m = Qwen3TTSModel.from_pretrained("Qwen/Qwen3-TTS-12Hz-1.7B-VoiceDesign", device_map="cpu", dtype=torch.float32)
for k, ins in VOCES.items():
    if os.path.exists(os.path.join(salida, f"medica_{k}.wav")):
        continue
    torch.manual_seed(11)
    wavs, sr = m.generate_voice_design(text=TEXTO, language="Spanish", instruct=ins, max_new_tokens=600)
    a = np.asarray(wavs[0], dtype=np.float32).squeeze()
    a = a / (np.abs(a).max() + 1e-9) * 0.89
    sf.write(os.path.join(salida, f"medica_{k}.wav"), a, sr)
    print(k, f"{len(a) / sr:.1f} s", flush=True)
