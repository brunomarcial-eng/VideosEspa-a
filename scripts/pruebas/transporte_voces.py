"""Muestras de voz para T13 (infraestructuras): la viajera, el comandante y el maquinista (Qwen3-TTS 1.7B VoiceDesign, Apache-2.0).
Voces inventadas a partir de una descripción, sin clonar a nadie. Uso: ~/.venv-qwen/bin/python scripts/pruebas/transporte_voces.py SALIDA_DIR"""
import os
import sys
os.environ.setdefault("HF_HUB_DISABLE_XET", "1")
import numpy as np
import soundfile as sf
import torch
from qwen_tts import Qwen3TTSModel

TEXTOS = {
    "viajera": "¡Cinco veces! Eso no lo suben ni los impuestos. Me voy en tren. Bueno… o sea, que el horario es orientativo.",
    "comandante": "Señores pasajeros, les habla el comandante. Tenemos un retraso por el control del tráfico aéreo. Nada raro: este año le pasa a uno de cada diez vuelos.",
    "maquinista": "Súbase, señora. En las líneas de alta velocidad con más trenes, llegan en hora ochenta y seis de cada cien. En dos mil diecinueve, noventa y cinco.",
}
VOCES = {
    "viajera": {
        "A": "Mujer española de 35 años, de Madrid, acento castellano de España (pronuncia la zeta y la ce). Voz natural y cercana, con chispa y un punto irónico, de persona normal que viaja por trabajo. Ritmo natural y expresivo.",
        "B": "Mujer española de unos 40 años, castellana de España (pronuncia la zeta y la ce). Voz cálida y algo grave, directa, un poco harta pero con humor. Ritmo natural, con pausas.",
        "C": "Mujer española joven, de 30 años, de Madrid, acento castellano de España (pronuncia la zeta y la ce). Voz clara y enérgica, simpática y sarcástica. Habla rápido y con gracia.",
    },
    "comandante": {
        "A": "Hombre español de 55 años, comandante de avión, acento castellano de España (pronuncia la zeta y la ce). Voz grave, tranquila y segura, de anuncio por megafonía a los pasajeros. Ritmo pausado y profesional.",
        "B": "Hombre español de unos 50 años, piloto de línea, castellano de España (pronuncia la zeta y la ce). Voz cálida y serena, amable, con un punto de resignación. Ritmo pausado.",
        "C": "Hombre español de 60 años, comandante veterano, acento castellano de España (pronuncia la zeta y la ce). Voz profunda y algo ronca, con autoridad y calma. Ritmo lento y claro.",
    },
    "maquinista": {
        "A": "Hombre español de 40 años, maquinista de tren, de Madrid, acento castellano de España (pronuncia la zeta y la ce). Voz llana y campechana, de trabajador de toda la vida, directa. Ritmo natural.",
        "B": "Hombre español de unos 45 años, ferroviario, castellano de España (pronuncia la zeta y la ce). Voz media, seria y franca, con un punto de cansancio. Ritmo natural, con pausas.",
        "C": "Hombre español de 38 años, maquinista, acento castellano de España (pronuncia la zeta y la ce). Voz algo aguda y simpática, cercana y con energía. Ritmo natural y expresivo.",
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
        wavs, sr = m.generate_voice_design(text=TEXTOS[rol], language="Spanish", instruct=ins, max_new_tokens=700)
        a = np.asarray(wavs[0], dtype=np.float32).squeeze()
        a = a / (np.abs(a).max() + 1e-9) * 0.89
        sf.write(f, a, sr)
        print(rol, k, f"{len(a) / sr:.1f} s", flush=True)
