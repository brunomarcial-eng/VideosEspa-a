#!/usr/bin/env python3
"""Genera la voz de un guion con modelos libres y la línea de tiempo del vídeo.

Para cada línea (plano) del guion:
  1. Pasa las cifras a palabras («12,8» -> «doce coma ocho»), para que se lean igual siempre.
  2. Sintetiza con el perfil de diseno/voces.json. Motores, todos libres y en local:
     - «qwen-clon»: Qwen3-TTS 0.6B clonando una grabación humana de España (la voz 3 del casting,
       la elegida por Bruno el 10-11-2026). Dice la línea entera de una vez, con su entonación.
     - «piper» y «kokoro»: los de antes, frase a frase.
  3. Recorta los silencios de los bordes y acorta los huecos largos dentro de la frase.
  4. Whisper escucha la toma. Si falta una palabra, sobra algo (repeticiones) o no oye una cifra,
     la toma se repite con otra semilla. Se queda la primera buena o, si ninguna lo es, la mejor.
  5. Alinea cada palabra del guion con lo que oye Whisper: así la imagen y el sonido caen en la
     palabra exacta.
  6. Calcula la envolvente de volumen a 30 fps.

Las tomas se guardan en videos/<id>/audio/tomas/: si una línea no cambia, no se vuelve a generar.
Salida en videos/<id>/audio/: voz_NN.wav, voz.wav (todo junto) y linea_tiempo.json.
Sale con código 1 si alguna línea no tiene una toma buena.

Uso:  ~/.venv-qwen/bin/python scripts/voces.py videos/t1/guion.json [--rehacer 3,7] [--todo]
      ~/.venv-qwen/bin/python scripts/voces.py --muestra "texto" salida.wav [--perfil hombre]
Requisitos: docs/produccion.md (entorno ~/.venv-qwen con qwen-tts, faster-whisper y soundfile).
"""
import difflib
import hashlib
import json
import os
import pathlib
import re
import subprocess
import sys
import unicodedata

import numpy as np
import soundfile as sf

RAIZ = pathlib.Path(__file__).resolve().parent.parent
MODELOS = pathlib.Path(os.environ.get("CVTH_MODELOS_VOZ", "/home/user/.modelos-voz"))
SR = 24000
FPS = 30
ENTRADA_S, COLA_S = 0.35, 1.2
os.environ.setdefault("HF_HUB_DISABLE_XET", "1")

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


def letras(s: str) -> str:
    """Forma hablada de un texto, solo letras y sin tildes (para comparar con Whisper)."""
    s = re.sub(r"(\d)[.](\d)", r"\1,\2", s)
    s = re.sub(r"(\d)\.(?=\d{3}\b)", r"\1", s)
    s = unicodedata.normalize("NFD", normalizar(s).lower())
    return re.sub(r"[^a-zñ]", "", "".join(c for c in s if unicodedata.category(c) != "Mn" or c == "̃"))


# ------------------------------------------------------------ motores
_kokoro, _qwen = None, {}


def a_sr(ruta, filtro=None, sr_in=None) -> np.ndarray:
    cmd = ["ffmpeg", "-v", "error", "-i", str(ruta)]
    if filtro:
        cmd += ["-af", filtro]
    cmd += ["-ac", "1", "-ar", str(SR), "-f", "f32le", "-"]
    return np.frombuffer(subprocess.run(cmd, capture_output=True, check=True).stdout, np.float32).copy()


def qwen(perfil):
    clave = perfil["modelo"]
    if clave not in _qwen:
        import torch
        from qwen_tts import Qwen3TTSModel
        torch.set_num_threads(os.cpu_count() or 4)
        m = Qwen3TTSModel.from_pretrained(clave, device_map="cpu", dtype=torch.float32)
        ref = str(RAIZ / perfil["ref"])
        txt = (RAIZ / perfil["ref_txt"]).read_text(encoding="utf-8").strip()
        prompt = m.create_voice_clone_prompt(ref_audio=ref, ref_text=txt) if hasattr(m, "create_voice_clone_prompt") else None
        _qwen[clave] = (m, ref, txt, prompt)
    return _qwen[clave]


def sintetizar(perfil: dict, texto: str, semilla: int = 0, velocidad: float = 1.0) -> np.ndarray:
    global _kokoro
    motor = perfil["motor"]
    if motor == "qwen-clon":
        import torch
        m, ref, txt, prompt = qwen(perfil)
        torch.manual_seed(semilla)
        extra = dict(perfil.get("generacion", {}))
        if prompt is not None:
            wavs, sr = m.generate_voice_clone(text=texto, language="Spanish", voice_clone_prompt=prompt, **extra)
        else:
            wavs, sr = m.generate_voice_clone(text=texto, language="Spanish", ref_audio=ref, ref_text=txt, **extra)
        a = np.asarray(wavs[0], dtype=np.float32)
        if sr != SR:
            tmp = RAIZ / ".tmp_qwen.wav"
            sf.write(tmp, a, sr)
            a = a_sr(tmp)
            tmp.unlink()
        return a
    if motor == "kokoro":
        if _kokoro is None:
            from kokoro_onnx import Kokoro
            d = MODELOS / "kokoro"
            _kokoro = Kokoro(str(d / "model_quantized.onnx"), str(d / "voces-es.bin"))
        audio, sr = _kokoro.create(texto, voice=perfil["voz"], speed=velocidad, lang="es")
        assert sr == SR
        return audio.astype(np.float32)
    if motor == "piper":
        modelo, _, hablante = perfil["voz"].partition("#")
        tmp = RAIZ / ".tmp_piper.wav"
        extra = []
        if "noise_scale" in perfil:
            extra += ["--noise-scale", str(perfil["noise_scale"])]
        if "noise_w" in perfil:
            extra += ["--noise-w-scale", str(perfil["noise_w"])]
        subprocess.run([sys.executable, "-m", "piper", "-m", str(MODELOS / f"{modelo}.onnx"),
                        "-s", hablante or "0", "--length-scale", str(1 / velocidad), *extra, "-f", str(tmp)],
                       input=texto.encode(), check=True, capture_output=True)
        return a_sr(tmp)
    raise ValueError(motor)


def edad(audio: np.ndarray, tono: float, tempo: float, formantes: str = "shifted") -> np.ndarray:
    tmp = RAIZ / ".tmp_edad.wav"
    sf.write(tmp, audio, SR)
    out = a_sr(tmp, f"rubberband=pitch={tono}:tempo={tempo}:formant={formantes}:pitchq=quality")
    tmp.unlink()
    return out


# ------------------------------------------------------------ limpieza de la toma
def rms_tramos(a: np.ndarray, paso_s=0.02) -> np.ndarray:
    paso = int(paso_s * SR)
    n = len(a) // paso
    return np.sqrt((a[: n * paso].reshape(n, paso) ** 2).mean(axis=1) + 1e-12)


def limpiar(a: np.ndarray, hueco_max=0.5, hueco_queda=0.38) -> np.ndarray:
    """Quita silencio de los bordes y acorta los huecos internos largos (el modelo a veces se queda callado)."""
    if not len(a):
        return a
    r = rms_tramos(a)
    umbral = max(0.006, np.percentile(r, 95) * 0.05)
    voz = np.where(r > umbral)[0]
    if not len(voz):
        return a
    paso = int(0.02 * SR)
    a = a[max(0, voz[0] * paso - int(0.04 * SR)): min(len(a), (voz[-1] + 1) * paso + int(0.12 * SR))]
    r = rms_tramos(a)
    callado = r <= umbral
    trozos, i, ini = [], 0, 0
    while i < len(callado):
        if callado[i]:
            j = i
            while j < len(callado) and callado[j]:
                j += 1
            if (j - i) * 0.02 > hueco_max and i > 0 and j < len(callado):
                corte_ini = i * paso + int(hueco_queda / 2 * SR)
                corte_fin = j * paso - int(hueco_queda / 2 * SR)
                trozos.append(a[ini:corte_ini])
                ini = corte_fin
            i = j
        else:
            i += 1
    trozos.append(a[ini:])
    return np.concatenate(trozos)


def envolvente(a: np.ndarray) -> np.ndarray:
    paso = SR // FPS
    n = int(np.ceil(len(a) / paso))
    a = np.pad(a, (0, n * paso - len(a)))
    return np.sqrt((a.reshape(n, paso) ** 2).mean(axis=1))


# ------------------------------------------------------------ escuchar y alinear
def escuchar(asr, a: np.ndarray):
    a16 = np.interp(np.arange(0, len(a), SR / 16000), np.arange(len(a)), a).astype(np.float32)
    segs, _ = asr.transcribe(a16, language="es", beam_size=5, word_timestamps=True, vad_filter=False,
                             condition_on_previous_text=False)
    segs = list(segs)
    oido = " ".join(s.text.strip() for s in segs)
    ww = [(w.word.strip(), float(w.start), float(w.end)) for s in segs for w in (s.words or [])]
    return oido, ww


def alinear(tokens, ww, dur):
    """Tiempo de cada palabra del guion a partir de lo que oye Whisper (letra a letra).
    Devuelve (t0, t1, parte_oida) por palabra; las que Whisper no oye se reparten entre sus vecinas."""
    A, ia, B, ib, tb = [], [], [], [], []
    for i, tok in enumerate(tokens):
        lt = letras(tok)
        A += lt
        ia += [i] * len(lt)
    for j, (w, s, e) in enumerate(ww):
        lw = letras(w)
        for k, c in enumerate(lw):
            B.append(c)
            ib.append(j)
            tb.append((s + (e - s) * k / max(1, len(lw)), s + (e - s) * (k + 1) / max(1, len(lw))))
    largo = [max(1, len(letras(t))) for t in tokens]
    t0, t1, vistos = [None] * len(tokens), [None] * len(tokens), [0] * len(tokens)
    usados_b = 0
    for a, b, n in difflib.SequenceMatcher(None, A, B, autojunk=False).get_matching_blocks():
        usados_b += n
        for k in range(n):
            i = ia[a + k]
            s, e = tb[b + k]
            vistos[i] += 1
            t0[i] = s if t0[i] is None else min(t0[i], s)
            t1[i] = e if t1[i] is None else max(t1[i], e)
    # palabras sin oír: entre la anterior y la siguiente, según su largo
    i = 0
    while i < len(tokens):
        if t0[i] is not None:
            i += 1
            continue
        j = i
        while j < len(tokens) and t0[j] is None:
            j += 1
        desde = t1[i - 1] if i > 0 else 0.0
        hasta = t0[j] if j < len(tokens) else dur
        tot = sum(largo[i:j])
        acc = 0
        for k in range(i, j):
            t0[k] = desde + (hasta - desde) * acc / tot
            acc += largo[k]
            t1[k] = desde + (hasta - desde) * acc / tot
        i = j
    for k in range(1, len(tokens)):
        t0[k] = max(t0[k], t0[k - 1])
        t1[k] = max(t1[k], t0[k])
    sobra = len(B) - usados_b
    return t0, t1, [v / largo[k] for k, v in enumerate(vistos)], sobra


def cifras_ok(texto, oido):
    fallos = []
    oido_c = oido.replace(".", ",")
    for c in re.findall(r"\d+(?:,\d+)?", texto):
        if letras(c) not in letras(oido_c):
            fallos.append(c)
    return fallos


def evaluar(asr, a, texto):
    """Nota de una toma (más es mejor) y si vale."""
    tokens = texto.split()
    oido, ww = escuchar(asr, a)
    dur = len(a) / SR
    t0, t1, vistos, sobra = alinear(tokens, ww, dur)
    perdidas = [tok for tok, v in zip(tokens, vistos) if v < 0.6 and len(letras(tok)) >= 3]
    cifras = cifras_ok(texto, oido)
    ritmo = len(letras(texto)) / max(0.1, dur)          # letras por segundo
    problemas = []
    if perdidas:
        problemas.append("no oigo: " + ", ".join(perdidas))
    if sobra > 6:
        problemas.append(f"sobran {sobra} letras (¿repite?)")
    if cifras:
        problemas.append("cifras no oídas: " + ", ".join(cifras))
    if not 8 <= ritmo <= 19:
        problemas.append(f"ritmo raro ({ritmo:.1f} letras/s)")
    parecido = difflib.SequenceMatcher(None, letras(texto), letras(oido), autojunk=False).ratio()
    nota = parecido - 0.15 * len(perdidas) - 0.01 * max(0, sobra - 6) - 0.3 * len(cifras) - (0.2 if problemas and "ritmo" in problemas[-1] else 0)
    return {"ok": not problemas, "nota": round(nota, 4), "oido": oido, "parecido": round(parecido, 3),
            "problemas": problemas, "t0": t0, "t1": t1, "ritmo": round(ritmo, 1)}


# ------------------------------------------------------------ una línea del guion
def frases_de(texto):
    return [x for x in re.split(r"(?<=[.?!…])\s+", texto) if x.strip()]


def generar_linea(perfil, cfg, texto, semilla_base, asr, registro):
    """Mejor toma de una línea: (audio, evaluación, semilla)."""
    intentos = cfg.get("intentos", 5) if perfil["motor"] == "qwen-clon" else 1
    mejor = None
    for k in range(intentos):
        semilla = semilla_base + k
        if perfil["motor"] == "qwen-clon":
            a = sintetizar(perfil, normalizar(texto), semilla)
        else:
            partes = []
            for i, fr in enumerate(frases_de(texto)):
                partes.append(limpiar(sintetizar(perfil, normalizar(fr), semilla, cfg.get("velocidad_base", 1.0))))
                if i < len(frases_de(texto)) - 1:
                    p = cfg.get("pausa_duda_s", 0.4) if fr.endswith("…") else cfg.get("pausa_frase_s", 0.25)
                    partes.append(np.zeros(int(p * SR), np.float32))
            a = np.concatenate(partes)
        a = limpiar(a, cfg.get("hueco_max_s", 0.5), cfg.get("hueco_queda_s", 0.38))
        ev = evaluar(asr, a, texto)
        registro.append(f"    toma {k + 1} (semilla {semilla}): {'BUENA' if ev['ok'] else 'mala'} · {ev['parecido']} · "
                        f"{len(a) / SR:.1f} s · {ev['ritmo']} l/s · «{ev['oido']}»" + (f" · {'; '.join(ev['problemas'])}" if ev["problemas"] else ""))
        print(registro[-1], flush=True)
        if mejor is None or (ev["ok"], ev["nota"]) > (mejor[1]["ok"], mejor[1]["nota"]):
            mejor = (a, ev, semilla)
        if ev["ok"]:
            break
    return mejor


def huella(perfil, texto, cfg):
    claves = {k: cfg.get(k) for k in ("intentos", "hueco_max_s", "hueco_queda_s", "velocidad_base", "pausa_frase_s", "pausa_duda_s")}
    return hashlib.sha1(json.dumps([perfil, texto, claves], sort_keys=True, ensure_ascii=False).encode()).hexdigest()[:16]


def nivelar(a, objetivo_db=-20.0):
    """Mismo volumen percibido en todas las líneas (RMS de las partes con voz), sin pasar de 0,89 de pico."""
    r = rms_tramos(a)
    voz = r[r > np.percentile(r, 95) * 0.1]
    g = 10 ** (objetivo_db / 20) / (np.sqrt(np.mean(voz ** 2)) + 1e-9) if len(voz) else 1.0
    a = a * g
    pico = np.abs(a).max()
    return (a * (0.89 / pico) if pico > 0.89 else a).astype(np.float32)


def cargar_asr():
    from faster_whisper import WhisperModel
    return WhisperModel(os.environ.get("CVTH_WHISPER", "small"), device="cpu", compute_type="int8")


# ------------------------------------------------------------ principal
def muestra(argv):
    texto, salida = argv[2], pathlib.Path(argv[3])
    cfg = json.loads((RAIZ / "diseno" / "voces.json").read_text(encoding="utf-8"))
    nombre = argv[argv.index("--perfil") + 1] if "--perfil" in argv else "hombre"
    a, ev, sem = generar_linea(cfg["perfiles"][nombre], cfg, texto, 7, cargar_asr(), [])
    sf.write(salida, nivelar(a), SR)
    print(f"{salida}: {len(a) / SR:.1f} s · {'BUENA' if ev['ok'] else 'con problemas'} · semilla {sem}")
    return 0 if ev["ok"] else 1


def main(argv):
    if len(argv) > 1 and argv[1] == "--muestra":
        return muestra(argv)
    ruta = pathlib.Path(argv[1])
    g = json.loads(ruta.read_text(encoding="utf-8"))
    cfg = json.loads((RAIZ / "diseno" / "voces.json").read_text(encoding="utf-8"))
    out = ruta.parent / "audio"
    tomas = out / "tomas"
    tomas.mkdir(parents=True, exist_ok=True)
    rehacer = set()
    if "--rehacer" in argv:
        rehacer = {int(x) for x in argv[argv.index("--rehacer") + 1].split(",")}
    todo = "--todo" in argv

    asr = None
    pistas, planos, t, previo, previo_dato, fallos, registro = [], [], ENTRADA_S, None, False, [], []
    pistas.append(np.zeros(int(ENTRADA_S * SR), np.float32))
    for b in g["beats"]:
        quien = b["quien"]
        perfil = cfg["perfiles"][g["personajes"][quien]["genero"]]
        ed = cfg["edad"][quien]
        matiz = b.get("actuacion", {})
        if previo is not None:
            pausa = matiz.get("pausa_antes", cfg["pausa_turno_s"] if quien != previo else cfg["pausa_mismo_s"])
            if previo_dato:   # la tarjeta con cifra se queda un poco más, para que dé tiempo a leerla
                pausa = max(pausa, cfg.get("pausa_tras_dato_s", 0))
            pistas.append(np.zeros(int(pausa * SR), np.float32))
            t += pausa
        texto = b["voz"]
        hu = huella(perfil, texto, cfg)
        fj, fw = tomas / f"{b['n']:02d}.json", tomas / f"{b['n']:02d}.wav"
        guardada = json.loads(fj.read_text(encoding="utf-8")) if fj.exists() and fw.exists() else None
        registro.append(f"plano {b['n']}: «{texto}»")
        print(registro[-1], flush=True)
        if guardada and guardada["huella"] == hu and not todo and b["n"] not in rehacer:
            a, _ = sf.read(fw, dtype="float32")
            ev = guardada["ev"]
            registro.append(f"    toma guardada (semilla {guardada['semilla']}): {'BUENA' if ev['ok'] else 'mala'} · «{ev['oido']}»")
            print(registro[-1])
        else:
            if asr is None:
                asr = cargar_asr()
            sem0 = 1000 * b["n"] + (guardada["semilla"] % 1000 + 1 if guardada and b["n"] in rehacer else 0)
            a, ev, sem = generar_linea(perfil, cfg, texto, sem0, asr, registro)
            a = nivelar(a)
            sf.write(fw, a, SR)
            fj.write_text(json.dumps({"huella": hu, "semilla": sem, "texto": texto, "ev": ev}, ensure_ascii=False, indent=1), encoding="utf-8")
        if not ev["ok"]:
            fallos.append(f"plano {b['n']}: " + "; ".join(ev["problemas"]))

        t0s, t1s = ev["t0"], ev["t1"]
        tono_f, tempo_f = ed["tono"] * matiz.get("tono", 1.0), ed["velocidad"] * matiz.get("velocidad", 1.0)
        if abs(tono_f - 1) > 1e-3 or abs(tempo_f - 1) > 1e-3:
            largo = len(a)
            a = edad(a, tono_f, tempo_f, cfg.get("formantes", "shifted"))
            k = len(a) / largo
            t0s, t1s = [x * k for x in t0s], [x * k for x in t1s]
        sf.write(out / f"voz_{b['n']:02d}.wav", a, SR)
        dur = len(a) / SR
        # palabras con su tiempo (absoluto) y la frase a la que pertenecen
        pals, nf = [], 0
        for i, tok in enumerate(texto.split()):
            pals.append({"p": tok, "t0": round(t + t0s[i], 3), "t1": round(t + t1s[i], 3), "frase": nf})
            if re.search(r"[.?!…]$", tok):
                nf += 1
        planos.append({"n": b["n"], "quien": quien, "ini": round(t, 3), "fin": round(t + dur, 3),
                       "texto": texto, "dicho": normalizar(texto), "oido": ev["oido"], "parecido": ev["parecido"],
                       "pals": pals, "_env": envolvente(a)})
        pistas.append(a)
        t += dur
        previo, previo_dato = quien, bool(b.get("sello"))

    pistas.append(np.zeros(int(COLA_S * SR), np.float32))
    voz = np.concatenate(pistas)
    sf.write(out / "voz.wav", voz, SR)
    for quien in {p["quien"] for p in planos}:
        ref = np.percentile(np.concatenate([p["_env"] for p in planos if p["quien"] == quien]), 95)
        for p in planos:
            if p["quien"] == quien:
                p["env"] = [round(float(min(1.0, v / ref)), 2) for v in p.pop("_env")]
    linea = {"id": g["id"], "fps": FPS, "duracion": round(len(voz) / SR, 3), "entrada": ENTRADA_S,
             "voces": {q: cfg["perfiles"][g["personajes"][q]["genero"]] | cfg["edad"][q] for q in g["personajes"]},
             "planos": planos}
    (out / "linea_tiempo.json").write_text(json.dumps(linea, ensure_ascii=False, indent=1), encoding="utf-8")
    (out / "tomas" / "registro.txt").write_text("\n".join(registro) + "\n", encoding="utf-8")
    print(f"duración total {linea['duracion']:.1f} s · escrito {out / 'linea_tiempo.json'}")
    if fallos:
        print("FALLA (escucha esas líneas o repítelas con --rehacer N):\n- " + "\n- ".join(fallos))
        return 1
    if not 45 <= linea["duracion"] <= 80:
        print(f"AVISO: duración {linea['duracion']:.1f} s fuera de 45-80 s")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
