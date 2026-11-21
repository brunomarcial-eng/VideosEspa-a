"""Muestras de voz para la hostelera veterana de T10 (Qwen3-TTS 1.7B VoiceDesign, Apache-2.0): voz inventada a partir de
una descripción, sin clonar a nadie. Uso: ~/.venv-qwen/bin/python scripts/pruebas/hostelera_voz.py SALIDA_DIR"""
import os
import sys
os.environ.setdefault("HF_HUB_DISABLE_XET", "1")
import numpy as np
import soundfile as sf
import torch
from qwen_tts import Qwen3TTSModel

TEXTO = ("¡Yo abrí este bar en mil novecientos ochenta y seis, con una licencia y cuatro duros! "
         "¿Y tú, enfrente, ahora? Pues prepárate, que esto ha cambiado mucho.")
VOCES = {
    "A": "Mujer española de 62 años, de Madrid, dueña de un bar de barrio de toda la vida. Acento castellano de España (pronuncia la zeta y la ce). Voz cálida y algo ronca, con mucho carácter, campechana y directa. Habla con energía y ritmo natural.",
    "B": "Mujer española de unos 60 años, castellana de España (pronuncia la zeta y la ce). Voz firme y clara, madura, de mujer trabajadora y segura de sí misma, con un punto socarrón. Ritmo natural, con pausas.",
    "C": "Mujer española de 65 años, de Madrid, acento castellano de España (pronuncia la zeta y la ce). Voz grave y pausada, de hostelera veterana que lo ha visto todo, cariñosa pero sin pelos en la lengua.",
}
salida = sys.argv[1]
os.makedirs(salida, exist_ok=True)
torch.set_num_threads(os.cpu_count() or 4)
m = Qwen3TTSModel.from_pretrained("Qwen/Qwen3-TTS-12Hz-1.7B-VoiceDesign", device_map="cpu", dtype=torch.float32)
for k, ins in VOCES.items():
    if os.path.exists(os.path.join(salida, f"hostelera_{k}.wav")):
        continue
    torch.manual_seed(11)
    wavs, sr = m.generate_voice_design(text=TEXTO, language="Spanish", instruct=ins, max_new_tokens=500)
    a = np.asarray(wavs[0], dtype=np.float32).squeeze()
    a = a / (np.abs(a).max() + 1e-9) * 0.89
    sf.write(os.path.join(salida, f"hostelera_{k}.wav"), a, sr)
    print(k, f"{len(a) / sr:.1f} s", flush=True)
