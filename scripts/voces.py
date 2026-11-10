#!/usr/bin/env python3
"""Genera la voz de un guion con modelos libres y la línea de tiempo del vídeo.

Para cada plano del guion:
  1. Pasa las cifras a palabras («12,8» -> «doce coma ocho»), para que se lean igual siempre.
  2. Sintetiza con la voz del perfil (diseno/voces.json): Kokoro o Piper, sin APIs de pago.
  3. Aplica la «edad» (la de antes, algo más aguda y rápida; la de hoy, más grave y pausada).
  4. Calcula la envolvente de volumen a 30 fps (para mover la boca de los títeres).
  5. Transcribe con Whisper (palabras con tiempos) y comprueba que dice las cifras del guion.

Salida en videos/<id>/audio/: voz_NN.wav, voz.wav (mezcla) y linea_tiempo.json.
Sale con código 1 si Whisper no oye alguna cifra del guion.

Uso: /home/user/.venv-voces/bin/python scripts/voces.py videos/t1/guion.json
Requisitos: entorno con kokoro-onnx, piper-tts, faster-whisper, soundfile (ver docs/produccion.md).
"""
import json
import os
import pathlib
import re
import subprocess
import sys
import difflib

import numpy as np
import soundfile as sf

RAIZ = pathlib.Path(__file__).resolve().parent.parent
MODELOS = pathlib.Path(os.environ.get("CVTH_MODELOS_VOZ", "/home/user/.modelos-voz"))
SR = 24000
FPS = 30
ENTRADA_S, COLA_S = 0.35, 1.2

# ------------------------------------------------------------ números a palabras
U = ("cero uno dos tres cuatro cinco seis siete ocho nueve diez once doce trece catorce quince dieciséis "
     "diecisiete dieciocho diecinueve veinte veintiuno veintidós veintitrés veinticuatro veinticinco "
     "veintiséis veintisiete veintiocho veintinueve").split()
DEC = {3: "treinta", 4: "cuarenta", 5: "cincuenta", 6: "sesenta", 7: "setenta", 8: "ochenta", 9: "noventa"}
CEN = {1: "ciento", 2: "doscientos", 3: "trescientos", 4: "cuatrocientos", 5: "quinientos",
       6: "seiscientos", 7: "setecientos", 8: "ochocientos", 9: "novecientos"}


def palabras(n: int) -> str:
    if n < 30:
        return U[n]
    if n < 100:
        d, r = divmod(n, 10)
        return DEC[d] + (f" y {U[r]}" if r else "")
    if n == 100:
        return "cien"
    if n < 1000:
        c, r = divmod(n, 100)
        return CEN[c] + (f" {palabras(r)}" if r else "")
    if n < 1_000_000:
        m, r = divmod(n, 1000)
        pre = "mil" if m == 1 else palabras(m).replace("uno", "ún").replace("veintiún", "veintiún") + " mil"
        pre = re.sub(r"\bún mil", "un mil", pre)
        return pre + (f" {palabras(r)}" if r else "")
    raise ValueError(n)


def decir_numero(txt: str) -> str:
    ent, _, dec = txt.partition(",")
    s = palabras(int(ent))
    if dec:
        s += " coma " + (" ".join(U[int(c)] for c in dec) if dec.startswith("0") else palabras(int(dec)))
    return s


def normalizar(texto: str) -> str:
    texto = re.sub(r"(\d+(?:,\d+)?)\s*%", lambda m: decir_numero(m.group(1)) + " por ciento", texto)
    texto = re.sub(r"(\d+(?:,\d+)?)\s*€", lambda m: decir_numero(m.group(1)) + " euros", texto)
    texto = re.sub(r"\d+(?:,\d+)?", lambda m: decir_numero(m.group(0)), texto)
    return texto.replace("…", "...")


# ------------------------------------------------------------ motores
_kokoro = None


def sintetizar(motor: str, voz: str, texto: str, velocidad: float, perfil: dict | None = None) -> np.ndarray:
    global _kokoro
    if motor == "kokoro":
        if _kokoro is None:
            from kokoro_onnx import Kokoro
            d = MODELOS / "kokoro"
            _kokoro = Kokoro(str(d / "model_quantized.onnx"), str(d / "voces-es.bin"))
        audio, sr = _kokoro.create(texto, voice=voz, speed=velocidad, lang="es")
        assert sr == SR
        return audio.astype(np.float32)
    if motor == "piper":
        modelo, _, hablante = voz.partition("#")
        tmp = RAIZ / ".tmp_piper.wav"
        extra = []
        if perfil and "noise_scale" in perfil:
            extra += ["--noise-scale", str(perfil["noise_scale"])]
        if perfil and "noise_w" in perfil:
            extra += ["--noise-w-scale", str(perfil["noise_w"])]
        if perfil and "silencio_frase" in perfil:
            extra += ["--sentence-silence", str(perfil["silencio_frase"])]
        subprocess.run([sys.executable, "-m", "piper", "-m", str(MODELOS / f"{modelo}.onnx"),
                        "-s", hablante or "0", "--length-scale", str(1 / velocidad), *extra, "-f", str(tmp)],
                       input=texto.encode(), check=True, capture_output=True)
        return a_sr(tmp)
    raise ValueError(motor)


def a_sr(ruta, filtro=None) -> np.ndarray:
    cmd = ["ffmpeg", "-v", "error", "-i", str(ruta)]
    if filtro:
        cmd += ["-af", filtro]
    cmd += ["-ac", "1", "-ar", str(SR), "-f", "f32le", "-"]
    return np.frombuffer(subprocess.run(cmd, capture_output=True, check=True).stdout, np.float32).copy()


def edad(audio: np.ndarray, tono: float, tempo: float, formantes: str = "shifted") -> np.ndarray:
    tmp = RAIZ / ".tmp_edad.wav"
    sf.write(tmp, audio, SR)
    out = a_sr(tmp, f"rubberband=pitch={tono}:tempo={tempo}:formant={formantes}:pitchq=quality")
    tmp.unlink()
    return out


def recortar_silencio(a: np.ndarray, umbral=0.01) -> np.ndarray:
    idx = np.where(np.abs(a) > umbral)[0]
    if not len(idx):
        return a
    ini, fin = max(0, idx[0] - int(0.03 * SR)), min(len(a), idx[-1] + int(0.08 * SR))
    return a[ini:fin]


def envolvente(a: np.ndarray) -> np.ndarray:
    paso = SR // FPS
    n = int(np.ceil(len(a) / paso))
    a = np.pad(a, (0, n * paso - len(a)))
    return np.sqrt((a.reshape(n, paso) ** 2).mean(axis=1))


# ------------------------------------------------------------ principal
def main(argv):
    ruta = pathlib.Path(argv[1])
    g = json.loads(ruta.read_text(encoding="utf-8"))
    cfg = json.loads((RAIZ / "diseno" / "voces.json").read_text(encoding="utf-8"))
    out = ruta.parent / "audio"
    out.mkdir(exist_ok=True)

    from faster_whisper import WhisperModel
    os.environ.setdefault("HF_HUB_DISABLE_XET", "1")
    asr = WhisperModel("small", device="cpu", compute_type="int8")

    pistas, planos, t, previo, fallos = [], [], ENTRADA_S, None, []
    pistas.append(np.zeros(int(ENTRADA_S * SR), np.float32))
    for b in g["beats"]:
        quien = b["quien"]
        genero = g["personajes"][quien]["genero"]
        perfil, ed = cfg["perfiles"][genero], cfg["edad"][quien]
        matiz = b.get("actuacion", {})  # matices de interpretación del plano
        if previo is not None:
            pausa = matiz.get("pausa_antes", cfg["pausa_turno_s"] if quien != previo else cfg["pausa_mismo_s"])
            pistas.append(np.zeros(int(pausa * SR), np.float32))
            t += pausa
        texto = normalizar(b["voz"])
        # Frase a frase: cada una con su entonación y una pausa detrás (más larga tras «…»).
        # Se guarda cuándo empieza cada frase para saber cuándo suena cada palabra.
        frases = [x for x in re.split(r"(?<=[.?!…])\s+", b["voz"]) if x.strip()]
        partes, cortes, pos = [], [], 0
        for i, frase in enumerate(frases):
            x = recortar_silencio(sintetizar(perfil["motor"], perfil["voz"], normalizar(frase),
                                             cfg.get("velocidad_base", 1.0), perfil))
            cortes.append((frase, pos, pos + len(x)))
            partes.append(x)
            pos += len(x)
            if i < len(frases) - 1:
                pausa_f = cfg.get("pausa_duda_s", 0.4) if frase.endswith("…") else cfg.get("pausa_frase_s", 0.25)
                partes.append(np.zeros(int(pausa_f * SR), np.float32))
                pos += int(pausa_f * SR)
        a = np.concatenate(partes)
        tono_f, tempo_f = ed["tono"] * matiz.get("tono", 1.0), ed["velocidad"] * matiz.get("velocidad", 1.0)
        if abs(tono_f - 1) > 1e-3 or abs(tempo_f - 1) > 1e-3:
            largo = len(a)
            a = edad(a, tono_f, tempo_f, cfg.get("formantes", "shifted"))
            cortes = [(f, int(i0 * len(a) / largo), int(i1 * len(a) / largo)) for f, i0, i1 in cortes]
        # Tiempo de cada palabra: reparto dentro de su frase según lo que tarda en decirse
        pals = []
        for nf, (frase, i0, i1) in enumerate(cortes):
            toks = frase.split()
            pesos = [len(re.sub(r"[^a-záéíóúñü]", "", normalizar(x).lower())) + 1 for x in toks]
            acc, tot = 0, sum(pesos)
            for tok, w in zip(toks, pesos):
                pals.append({"p": tok, "t0": round(t + (i0 + (i1 - i0) * acc / tot) / SR, 3),
                             "t1": round(t + (i0 + (i1 - i0) * (acc + w) / tot) / SR, 3), "frase": nf})
                acc += w
        a = a / max(1e-6, np.abs(a).max()) * 0.89
        sf.write(out / f"voz_{b['n']:02d}.wav", a, SR)
        dur = len(a) / SR

        a16 = np.interp(np.arange(0, len(a), SR / 16000), np.arange(len(a)), a).astype(np.float32)
        segs, _ = asr.transcribe(a16, language="es", beam_size=5, word_timestamps=True)
        segs = list(segs)
        oido = " ".join(s.text.strip() for s in segs)
        palabras_t = [{"p": w.word.strip(), "ini": round(t + w.start, 3), "fin": round(t + w.end, 3)}
                      for s in segs for w in (s.words or [])]
        cifras_guion = re.findall(r"\d+(?:,\d+)?", b["voz"])
        norm = lambda s: re.sub(r"[^\w,]", "", s.lower().replace(".", ","))
        cifras_oidas = re.findall(r"\d+(?:,\d+)?", oido.replace(".", ","))
        oido_plano = re.sub(r"[^0-9,]", " ", oido.replace(".", ","))
        for c in cifras_guion:
            if c not in cifras_oidas and decir_numero(c) not in oido.lower() and not re.search(rf"(?<!\d){re.escape(c)}(?!\d)", oido_plano):
                fallos.append(f"plano {b['n']}: Whisper no oye «{c}» (oído: «{oido}»)")
        parecido = difflib.SequenceMatcher(None, norm(b["voz"]), norm(oido)).ratio()

        planos.append({"n": b["n"], "quien": quien, "ini": round(t, 3), "fin": round(t + dur, 3),
                       "texto": b["voz"], "dicho": texto, "oido": oido, "parecido": round(parecido, 3),
                       "palabras": palabras_t, "pals": pals, "_env": envolvente(a)})
        pistas.append(a)
        t += dur
        previo = quien
        print(f"plano {b['n']:2d} {quien:5s} {dur:5.2f} s · parecido {parecido:.2f} · {oido}")

    pistas.append(np.zeros(int(COLA_S * SR), np.float32))
    voz = np.concatenate(pistas)
    sf.write(out / "voz.wav", voz, SR)
    # Envolvente normalizada por personaje (percentil 95 = boca abierta del todo)
    for quien in {p["quien"] for p in planos}:
        ref = np.percentile(np.concatenate([p["_env"] for p in planos if p["quien"] == quien]), 95)
        for p in planos:
            if p["quien"] == quien:
                p["env"] = [round(float(min(1.0, v / ref)), 2) for v in p.pop("_env")]
    linea = {"id": g["id"], "fps": FPS, "duracion": round(len(voz) / SR, 3), "entrada": ENTRADA_S,
             "voces": {q: cfg["perfiles"][g["personajes"][q]["genero"]] | cfg["edad"][q] for q in g["personajes"]},
             "planos": planos}
    (out / "linea_tiempo.json").write_text(json.dumps(linea, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"duración total {linea['duracion']:.1f} s · escrito {out / 'linea_tiempo.json'}")
    if fallos:
        print("FALLA:\n- " + "\n- ".join(fallos))
        return 1
    if not 45 <= linea["duracion"] <= 61:
        print(f"AVISO: duración {linea['duracion']:.1f} s fuera de 45-60 s")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
