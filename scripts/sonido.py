#!/usr/bin/env python3
"""Banda sonora de un Short: música y efectos sintetizados con código, sin bancos de sonido.

1. Resuelve los momentos clave de videos/<id>/historia.json (anclados a palabras de la
   narración) y los escribe en audio/cues.json. La imagen usa esos mismos tiempos.
2. Compone una base musical ligera (marimba, bajo, shaker y bombo suaves) que se
   aparta cuando habla la voz y se corta en seco con el sello del veredicto.
3. Sintetiza un efecto por acción: carro, monedas, caja, hojas de calendario, etc.
4. Mezcla voz + música + efectos en audio/mezcla.wav (48 kHz, estéreo).

Uso: python3 scripts/sonido.py videos/t1
Todo el sonido se genera aquí: no hay licencias que citar ni nada de pago.
"""
import json
import pathlib
import re
import subprocess
import sys

import numpy as np

SR = 48000
rng = np.random.default_rng(11)


# ------------------------------------------------------------------ utilidades
def leer(ruta, filtro=None):
    cmd = ["ffmpeg", "-v", "error", "-i", str(ruta)]
    if filtro:
        cmd += ["-af", filtro]
    cmd += ["-ac", "1", "-ar", str(SR), "-f", "f32le", "-"]
    return np.frombuffer(subprocess.run(cmd, capture_output=True, check=True).stdout, np.float32).copy()


def tiempo(dur):
    return np.arange(int(dur * SR)) / SR


def banda(x, lo, hi):
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1 / SR)
    X[(f < lo) | (f > hi)] = 0
    return np.fft.irfft(X, len(x)).astype(np.float32)


def ruido(dur, lo, hi):
    n = int(dur * SR)
    r = banda(rng.standard_normal(n).astype(np.float32), lo, hi)
    return r / (np.abs(r).max() + 1e-9)


def bordes(y, a=0.004, r=0.01):
    n = len(y)
    env = np.ones(n, np.float32)
    na, nr = min(n, int(a * SR)), min(n, int(r * SR))
    env[:na] = np.linspace(0, 1, na)
    env[n - nr:] *= np.linspace(1, 0, nr)
    return (y * env).astype(np.float32)


def norm(y):
    return (y / (np.abs(y).max() + 1e-9)).astype(np.float32)


def hz(midi):
    return 440.0 * 2 ** ((midi - 69) / 12)


class Pista:
    """Pista estéreo donde se van colocando sonidos mono con su posición."""

    def __init__(self, dur):
        self.b = np.zeros((int(dur * SR) + SR, 2), np.float32)

    def poner(self, y, t, vol=1.0, pan=0.0):
        i = int(round(t * SR))
        if i < 0:
            y, i = y[-i:], 0
        f = min(len(self.b), i + len(y))
        if f <= i:
            return
        izq, der = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
        self.b[i:f, 0] += y[: f - i] * vol * izq * 1.414
        self.b[i:f, 1] += y[: f - i] * vol * der * 1.414


# ------------------------------------------------------------------ instrumentos
def marimba(f, vel=1.0, dur=1.1):
    t = tiempo(dur)
    y = (np.sin(2 * np.pi * f * t) * np.exp(-t / 0.26)
         + 0.33 * np.sin(2 * np.pi * 4 * f * t) * np.exp(-t / 0.06)
         + 0.10 * np.sin(2 * np.pi * 10 * f * t) * np.exp(-t / 0.025))
    return bordes(y * vel, 0.003, 0.05)


def bajo(f, dur):
    t = tiempo(dur)
    y = (np.sin(2 * np.pi * f * t) + 0.22 * np.sin(4 * np.pi * f * t)) * np.exp(-t / 0.5)
    return bordes(y, 0.012, 0.06)


def bombo():
    t = tiempo(0.22)
    f = 48 + 70 * np.exp(-t / 0.035)
    return bordes(np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.09), 0.002, 0.03)


def shaker(vel=1.0):
    y = ruido(0.07, 6000, 12000) * np.exp(-tiempo(0.07) / 0.022)
    return bordes(y * vel, 0.004, 0.01)


def palmada():
    t = tiempo(0.11)
    y = ruido(0.11, 1400, 5200) * np.exp(-t / 0.03)
    return bordes(y, 0.001, 0.02)


# Progresión I–vi–IV–V en do mayor: suena ligera y curiosa, sin dramatismo.
ACORDES = [
    {"bajo": 36, "arp": [60, 67, 76, 67, 74, 67, 76, 67]},   # Do
    {"bajo": 33, "arp": [57, 64, 72, 64, 71, 64, 72, 64]},   # La menor
    {"bajo": 41, "arp": [65, 69, 72, 69, 67, 69, 72, 69]},   # Fa
    {"bajo": 43, "arp": [67, 71, 74, 71, 69, 71, 74, 71]},   # Sol
]


def musica(pista, t0, t1, bpm, capas_desde, fundido_fin=0.0):
    """Coloca la base entre t0 y t1. capas_desde = {capa: tiempo absoluto desde el que suena}."""
    negra = 60 / bpm
    compas, t = 0, t0
    while t < t1 - 0.05:
        ac = ACORDES[compas % 4]
        for i in range(8):                       # ocho corcheas por compás
            tt = t + i * negra / 2
            if tt >= t1:
                break
            vel = (1.0 if i % 4 == 0 else 0.62 if i % 2 == 0 else 0.5) * (0.92 + 0.16 * rng.random())
            pista.poner(marimba(hz(ac["arp"][i]), vel), tt, 0.5, pan=-0.25 if i % 2 else 0.25)
            if tt >= capas_desde.get("shaker", 1e9):
                pista.poner(shaker(0.9 if i % 2 else 0.55), tt, 0.10, pan=0.4)
        for golpe, largo in ((0, 1.4), (2, 0.9), (3.5, 0.45)):
            tt = t + golpe * negra
            if capas_desde.get("bajo", 1e9) <= tt < t1:
                pista.poner(bajo(hz(ac["bajo"]), largo * negra), tt, 0.62)
        for golpe in (0, 2):
            tt = t + golpe * negra
            if capas_desde.get("bombo", 1e9) <= tt < t1:
                pista.poner(bombo(), tt, 0.5)
        for golpe in (1, 3):
            tt = t + golpe * negra
            if capas_desde.get("bombo", 1e9) <= tt < t1:
                pista.poner(palmada(), tt, 0.13, pan=-0.2)
        t += 4 * negra
        compas += 1
    # corte limpio en t1 (o fundido)
    i1 = int(t1 * SR)
    if fundido_fin > 0:
        n = int(fundido_fin * SR)
        pista.b[i1 - n:i1] *= np.linspace(1, 0, n)[:, None]
    else:
        n = int(0.02 * SR)
        pista.b[i1 - n:i1] *= np.linspace(1, 0, n)[:, None]
    pista.b[i1:] = 0


# ------------------------------------------------------------------ efectos
def s_pop(tono=1.0, **_):
    t = tiempo(0.1)
    f = 190 * tono + 380 * tono * np.exp(-t / 0.018)
    return bordes(np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.035), 0.001, 0.02)


def campana(f0, dur, parciales):
    t = tiempo(dur)
    y = sum(a * np.sin(2 * np.pi * f0 * m * t) * np.exp(-t / tau) for m, a, tau in parciales)
    return bordes(norm(y), 0.001, 0.05)


def s_ting(tono=1.0, **_):
    return campana(2093 * tono, 0.8, [(1, 1, 0.3), (2.76, 0.45, 0.16), (5.4, 0.2, 0.08)])


def s_ding(tono=1.0, **_):
    return campana(1568 * tono, 0.7, [(1, 1, 0.28), (2.0, 0.3, 0.18), (3.0, 0.12, 0.1)])


def s_moneda(**_):
    t = tiempo(0.45)
    y = (np.sin(2 * np.pi * 4200 * t) + 0.6 * np.sin(2 * np.pi * 6300 * t)) * (0.55 + 0.45 * np.sin(2 * np.pi * 26 * t))
    return bordes(norm(y * np.exp(-t / 0.16)), 0.002, 0.05)


def s_papel(**_):
    t = tiempo(0.2)
    y = ruido(0.2, 900, 7000) * np.sin(np.pi * t / 0.2) ** 1.5 * (1 + 0.5 * np.sin(2 * np.pi * 11 * t))
    golpe = np.sin(2 * np.pi * 105 * t) * np.exp(-t / 0.03) * 0.8
    return bordes(norm(y * 0.7 + golpe), 0.002, 0.03)


def s_hojas(**_):
    y = np.zeros(int(0.62 * SR), np.float32)
    for k in range(7):
        r = ruido(0.05, 1400 + 250 * k, 6500) * np.sin(np.pi * tiempo(0.05) / 0.05)
        i = int(k * 0.08 * SR)
        y[i:i + len(r)] += r * (0.6 + 0.4 * (k % 2))
    return norm(y)


def s_carro(dur=0.8, **_):
    t = tiempo(dur)
    traqueteo = 0.5 + 0.5 * np.sign(np.sin(2 * np.pi * 13 * t)) * 0.8
    y = ruido(dur, 250, 2400) * traqueteo * np.sin(np.pi * t / dur) ** 0.7
    for _k in range(6):
        tt = rng.uniform(0.05, dur - 0.1)
        tc = tiempo(0.06)
        tintineo = np.sin(2 * np.pi * rng.uniform(3000, 4300) * tc) * np.exp(-tc / 0.015) * 0.5
        i = int(tt * SR)
        y[i:i + len(tintineo)] += tintineo
    return bordes(norm(y), 0.01, 0.08)


def s_beep(**_):
    t = tiempo(0.075)
    return bordes(np.sin(2 * np.pi * 2637 * t) + 0.3 * np.sin(2 * np.pi * 7911 * t), 0.004, 0.006) * 0.8


def s_conteo(dur=0.8, tono=1.0, **_):
    y = np.zeros(int((dur + 0.05) * SR), np.float32)
    tc = tiempo(0.012)
    clic = np.sin(2 * np.pi * 2200 * tono * tc) * np.exp(-tc / 0.003)
    for k, tt in enumerate(np.arange(0, dur, 1 / 22)):
        i = int(tt * SR)
        y[i:i + len(clic)] += clic * (0.5 + 0.5 * tt / dur)
    return y


def s_caja(tono=1.0, **_):
    y = np.zeros(int(0.9 * SR), np.float32)
    t = tiempo(0.1)
    cajon = np.sin(2 * np.pi * 140 * t) * np.exp(-t / 0.04) * 0.9 + ruido(0.1, 400, 3000) * np.exp(-t / 0.012) * 0.5
    y[: len(cajon)] += cajon
    for k, f in enumerate((1318.5, 1975.5)):
        c = campana(f * tono, 0.75, [(1, 1, 0.3), (2.4, 0.4, 0.15), (4.1, 0.15, 0.08)])
        i = int((0.03 + 0.085 * k) * SR)
        y[i:i + len(c)] += c[: len(y) - i] * 0.8
    return norm(y)


def s_sube(dur=0.6, hasta=1.3, **_):
    t = tiempo(dur)
    f = 300 * (1 + (1 + (hasta - 1) * 3 - 1) * (t / dur) ** 1.4) * (1 + 0.012 * np.sin(2 * np.pi * 7 * t))
    fase = 2 * np.pi * np.cumsum(f) / SR
    y = np.sin(fase) + 0.18 * np.sin(3 * fase)
    return bordes(norm(y) * (0.5 + 0.5 * t / dur), 0.02, 0.04)


def s_pinza(**_):
    t = tiempo(0.03)
    c = (np.sin(2 * np.pi * 1300 * t) + 0.6 * np.sin(2 * np.pi * 2650 * t)) * np.exp(-t / 0.006)
    y = np.zeros(int(0.1 * SR), np.float32)
    y[: len(c)] += c
    i = int(0.045 * SR)
    y[i:i + len(c)] += c * 0.7
    return norm(y)


def s_desenrolla(dur=0.5, **_):
    t = tiempo(dur)
    y = ruido(dur, 1200, 6500) * np.sin(np.pi * t / dur) * (0.6 + 0.4 * np.sin(2 * np.pi * 31 * t))
    return bordes(norm(y), 0.01, 0.03)


def s_sello(**_):
    t = tiempo(0.3)
    golpe = np.sin(2 * np.pi * (60 + 50 * np.exp(-t / 0.02)) * t) * np.exp(-t / 0.07)
    y = golpe + ruido(0.3, 150, 2600) * np.exp(-t / 0.018) * 0.6
    tr = tiempo(0.25)
    y2 = np.zeros(int(0.6 * SR), np.float32)
    y2[: len(y)] += y
    temblor = ruido(0.25, 300, 1800) * np.exp(-tr / 0.06) * (0.5 + 0.5 * np.sin(2 * np.pi * 40 * tr)) * 0.18
    i = int(0.07 * SR)
    y2[i:i + len(temblor)] += temblor
    return norm(y2)


def s_notif(**_):
    y = np.zeros(int(0.4 * SR), np.float32)
    for k, (f, d) in enumerate(((784, 0.1), (1046.5, 0.22))):
        t = tiempo(d)
        n = bordes(np.sin(2 * np.pi * f * t) * np.exp(-t / (d * 0.7)), 0.004, 0.02)
        i = int(k * 0.1 * SR)
        y[i:i + len(n)] += n
    return norm(y)


def s_fwip(**_):
    t = tiempo(0.11)
    return bordes(ruido(0.11, 1800, 9000) * np.sin(np.pi * t / 0.11) ** 2, 0.003, 0.01)


def s_calle(dur=1.6, **_):
    """Gente andando por la acera: pasos suaves que se cruzan y un murmullo de fondo."""
    y = ruido(dur, 250, 1800) * 0.12 * (0.7 + 0.3 * np.sin(2 * np.pi * 0.7 * tiempo(dur)))
    tp = tiempo(0.07)
    paso = (np.sin(2 * np.pi * 95 * tp) * np.exp(-tp / 0.018) + ruido(0.07, 600, 3500) * np.exp(-tp / 0.008) * 0.35)
    for voz, ritmo in enumerate((0.48, 0.55, 0.62)):
        for tt in np.arange(rng.uniform(0, 0.3), dur - 0.08, ritmo):
            i = int(tt * SR)
            y[i:i + len(paso)] += paso * (0.5 - 0.12 * voz)
    return bordes(norm(y) * np.minimum(1, np.minimum(tiempo(dur), dur - tiempo(dur)) / 0.25), 0.01, 0.05)


def s_campanilla(**_):
    """Campanilla de la puerta de una tienda: dos golpes de campana pequeña."""
    y = np.zeros(int(0.9 * SR), np.float32)
    for k, f in enumerate((2637, 3136)):
        c = campana(f, 0.7, [(1, 1, 0.22), (2.3, 0.35, 0.1), (3.9, 0.15, 0.05)])
        i = int(k * 0.12 * SR)
        y[i:i + len(c)] += c[: len(y) - i] * (1 - 0.3 * k)
    return norm(y)


def s_persiana(dur=1.0, **_):
    """Persiana metálica que sube: traqueteo de lamas."""
    t = tiempo(dur)
    lamas = 0.55 + 0.45 * np.sign(np.sin(2 * np.pi * (18 + 8 * t / dur) * t))
    y = ruido(dur, 300, 4000) * lamas * np.sin(np.pi * t / dur) ** 0.6
    return bordes(norm(y), 0.02, 0.08)


def s_vapor(dur=0.9, **_):
    """Vaporizador de la cafetera."""
    t = tiempo(dur)
    y = ruido(dur, 2500, 9000) * (np.minimum(1, t / 0.08)) * np.exp(-np.maximum(0, t - dur * 0.6) / 0.08)
    return bordes(norm(y), 0.01, 0.05)


def s_golpe(**_):
    """Golpe seco (el cuchillo de carnicero en la tabla)."""
    t = tiempo(0.18)
    y = np.sin(2 * np.pi * (90 + 70 * np.exp(-t / 0.015)) * t) * np.exp(-t / 0.04) + ruido(0.18, 300, 3000) * np.exp(-t / 0.01) * 0.5
    return bordes(norm(y), 0.001, 0.03)


EFECTOS = {"calle": s_calle, "pop": s_pop, "ting": s_ting, "ding": s_ding, "moneda": s_moneda, "papel": s_papel, "hojas": s_hojas,
           "carro": s_carro, "beep": s_beep, "conteo": s_conteo, "caja": s_caja, "sube": s_sube, "pinza": s_pinza,
           "desenrolla": s_desenrolla, "sello": s_sello, "notif": s_notif, "fwip": s_fwip,
           "campanilla": s_campanilla, "persiana": s_persiana, "vapor": s_vapor, "golpe": s_golpe}
# Ganancia de cada efecto para que ninguno tape la voz
NIVEL = {"calle": 0.22, "pop": 0.30, "ting": 0.22, "ding": 0.20, "moneda": 0.16, "papel": 0.26, "hojas": 0.22, "carro": 0.20,
         "beep": 0.12, "conteo": 0.16, "caja": 0.30, "sube": 0.13, "pinza": 0.26, "desenrolla": 0.22,
         "sello": 0.40, "notif": 0.24, "fwip": 0.10, "campanilla": 0.18, "persiana": 0.16, "vapor": 0.10, "golpe": 0.22}


# ------------------------------------------------------------------ cues
def limpia(p):
    return re.sub(r"[^\wáéíóúñü,]", "", p.lower()).strip(",")


def resolver_cues(historia, linea):
    planos = {p["n"]: p for p in linea["planos"]}
    out = {}
    for c in historia["cues"]:
        p = planos[c["beat"]]
        if "palabra" in c:
            objetivo = limpia(c["palabra"])
            hallados = [w for w in p["pals"] if limpia(w["p"]) == objetivo]
            if not hallados:
                raise SystemExit(f"cue {c['id']}: «{c['palabra']}» no está en el plano {c['beat']}: {p['texto']}")
            t = hallados[min(c.get("n", 1), len(hallados)) - 1]["t0"]
        else:
            t = p["ini"] if c.get("en", "inicio") == "inicio" else p["fin"]
        out[c["id"]] = round(t + c.get("dt", 0), 3)
    return out


# ------------------------------------------------------------------ principal
def main(argv):
    d = pathlib.Path(argv[1])
    linea = json.loads((d / "audio" / "linea_tiempo.json").read_text(encoding="utf-8"))
    historia = json.loads((d / "historia.json").read_text(encoding="utf-8"))
    cues = resolver_cues(historia, linea)
    (d / "audio" / "cues.json").write_text(json.dumps(cues, ensure_ascii=False, indent=1), encoding="utf-8")

    dur = linea["duracion"]
    voz = leer(d / "audio" / "voz.wav", "highpass=f=70,acompressor=threshold=-21dB:ratio=2.5:attack=8:release=140:makeup=2")
    voz = np.pad(voz, (0, max(0, int(dur * SR) - len(voz))))[: int(dur * SR)]
    voz = voz / (np.abs(voz).max() + 1e-9) * 0.9

    # ---- música: entra sola, suma capas y se corta en seco con el sello
    m = historia["musica"]
    planos = {p["n"]: p for p in linea["planos"]}
    t_corte = cues[m["corte"]]
    mus = Pista(dur)
    musica(mus, 0.0, t_corte, m["bpm"], {"bajo": planos[2]["ini"], "shaker": planos[3]["ini"], "bombo": planos[5]["ini"]})
    fin = Pista(dur)
    t_vuelve = t_corte + m["silencio_s"]
    musica(fin, t_vuelve, dur - 0.05, m["bpm"], {"bajo": t_vuelve, "shaker": t_vuelve}, fundido_fin=1.2)
    mus.b[: len(fin.b)] += fin.b
    # la música se aparta cuando habla la voz
    ventana = int(0.03 * SR)
    env = np.sqrt(np.convolve(voz ** 2, np.ones(ventana) / ventana, mode="same"))
    env = np.clip(env / 0.08, 0, 1)
    suave = np.empty_like(env)
    a_sube, a_baja, v = np.exp(-1 / (0.04 * SR)), np.exp(-1 / (0.35 * SR)), 0.0
    for i, x in enumerate(env):           # ataque rápido, vuelta lenta
        v = a_sube * v + (1 - a_sube) * x if x > v else a_baja * v + (1 - a_baja) * x
        suave[i] = v
    aparta = 1 - 0.55 * suave
    n = int(dur * SR)
    mus_b = mus.b[:n] * aparta[:, None] * 0.17

    # ---- efectos
    fx = Pista(dur)
    for c in historia["cues"]:
        if "sfx" not in c:
            continue
        y = EFECTOS[c["sfx"]](**{k: c[k] for k in ("tono", "dur", "hasta") if k in c})
        fx.poner(y, cues[c["id"]], NIVEL[c["sfx"]] * c.get("vol", 0.5) * 2, pan=c.get("pan", 0.0))
    for p in linea["planos"][1:]:           # cada cambio de escena, un roce de papel
        fx.poner(s_fwip(), p["ini"] - 0.14, NIVEL["fwip"], pan=rng.uniform(-0.3, 0.3))

    mezcla = np.stack([voz, voz], axis=1) + mus_b + fx.b[:n]
    pico = np.abs(mezcla).max()
    if pico > 0.97:
        mezcla *= 0.97 / pico
    salida = d / "audio" / "mezcla.wav"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "f32le", "-ar", str(SR), "-ac", "2", "-i", "-", str(salida)],
                   input=mezcla.astype(np.float32).tobytes(), check=True)

    def db(x):
        return 20 * np.log10(np.sqrt(np.mean(x ** 2)) + 1e-9)
    print(f"escrito {salida} · {dur:.1f} s · {len(cues)} momentos")
    print(f"niveles (dB RMS): voz {db(voz):.1f} · música {db(mus_b):.1f} · efectos {db(fx.b[:n]):.1f} · pico {pico:.2f}")
    print(f"corte de música en {t_corte:.2f} s, vuelve en {t_vuelve:.2f} s")


if __name__ == "__main__":
    main(sys.argv)
