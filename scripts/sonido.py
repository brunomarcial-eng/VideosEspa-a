#!/usr/bin/env python3
"""Banda sonora de un Short: música y efectos sintetizados con código, sin bancos de sonido.

1. Resuelve los momentos clave de videos/<id>/historia.json (anclados a palabras de la
   narración) y los escribe en audio/cues.json. La imagen usa esos mismos tiempos.
2. Compone una base musical ligera (marimba, bajo, shaker y bombo suaves) que se
   aparta cuando habla la voz y se corta en seco con el sello del veredicto.
3. Sintetiza un efecto por acción: carro, monedas, caja, hojas de calendario, etc.
4. Añade el ambiente de fondo de cada escenario y los avisos por megafonía («ambientes» y «avisos»
   de historia.json; las voces de los avisos salen del catálogo, docs/voces-catalogo.md).
5. Mezcla voz + música + efectos + fondo en audio/mezcla.wav (48 kHz, estéreo).

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


def s_sueno(dur=1.0, **_):
    """Cambio de decorado «como en un sueño»: un arpegio de campanitas que sube y un soplo de aire."""
    n = int(dur * SR)
    y = np.zeros(n)
    for i, f in enumerate((1047, 1319, 1568, 1976, 2349, 3136)):      # do-mi-sol-si-re-sol, hacia arriba
        nota = campana(f, 0.7, [(1, 1, 0.22), (2.0, 0.35, 0.12), (3.01, 0.15, 0.07)]) * (0.9 - 0.08 * i)
        i0 = int((0.05 + 0.085 * i) * SR)
        m = min(len(nota), n - i0)
        if m > 0:
            y[i0:i0 + m] += nota[:m]
    t = tiempo(dur)
    soplo = ruido(dur, 700, 5200)[:n] * np.sin(np.pi * t[:n] / dur) ** 2 * 0.35
    return bordes(norm(y + soplo), 0.004, 0.08)


def s_timbre(**_):
    """Timbre de casa: din-don."""
    y = np.zeros(int(1.2 * SR), np.float32)
    for k, f in enumerate((988, 784)):
        c = campana(f, 0.9, [(1, 1, 0.35), (2.0, 0.25, 0.15), (3.0, 0.1, 0.08)])
        i = int(k * 0.32 * SR)
        y[i:i + len(c)] += c[: len(y) - i] * (1 - 0.15 * k)
    return norm(y)


def s_rasgado(**_):
    """Aguja que rasca un vinilo (scratch corto, de ida y vuelta)."""
    t = tiempo(0.32)
    vel = np.sin(2 * np.pi * 3.1 * t) ** 2
    y = ruido(0.32, 400, 5000) * vel + np.sin(2 * np.pi * np.cumsum(180 + 900 * vel) / SR) * 0.35 * vel
    return bordes(norm(y), 0.003, 0.04)


def s_publico(dur=1.6, **_):
    """Público de un concierto que aplaude y grita: ruido que crece y palmas sueltas."""
    t = tiempo(dur)
    y = ruido(dur, 500, 4500) * 0.5 * np.sin(np.pi * t / dur) ** 0.7
    tp = tiempo(0.03)
    palma = ruido(0.03, 900, 6000) * np.exp(-tp / 0.006)
    for tt in rng.uniform(0, dur - 0.05, int(dur * 40)):
        i = int(tt * SR)
        y[i:i + len(palma)] += palma * rng.uniform(0.2, 0.6)
    return bordes(norm(y), 0.05, 0.25)


def s_bici(**_):
    """Timbre de bicicleta: dos «ring» rápidos."""
    y = np.zeros(int(0.7 * SR), np.float32)
    for k in range(2):
        c = campana(3520, 0.45, [(1, 1, 0.12), (1.5, 0.5, 0.08), (2.7, 0.3, 0.05)])
        c = c * (0.6 + 0.4 * np.sin(2 * np.pi * 38 * tiempo(0.45)[: len(c)]))
        i = int(k * 0.16 * SR)
        y[i:i + len(c)] += c[: len(y) - i]
    return norm(y)


def s_megafonia(**_):
    """Aviso de megafonía de avión o aeropuerto: tres notas de campana que suben (sol-si-re)."""
    y = np.zeros(int(1.5 * SR), np.float32)
    for k, f in enumerate((784, 988, 1175)):
        c = campana(f, 1.0, [(1, 1, 0.45), (2.0, 0.22, 0.2), (3.0, 0.08, 0.1)])
        i = int(k * 0.28 * SR)
        y[i:i + len(c)] += c[: len(y) - i] * (1 - 0.1 * k)
    return norm(y)


def s_avion(dur=1.4, **_):
    """Avión que pasa: soplo grave que crece y se va, con un silbido de turbina."""
    t = tiempo(dur)
    env = np.sin(np.pi * t / dur) ** 1.5
    silbido = np.sin(2 * np.pi * np.cumsum(2200 - 500 * t / dur) / SR) * 0.08
    y = (ruido(dur, 80, 900) + ruido(dur, 900, 3000) * 0.3 + silbido) * env
    return bordes(norm(y), 0.05, 0.15)


def s_tren(**_):
    """Bocina de tren de alta velocidad: dos tonos a la vez, corta, y el traqueteo de las ruedas."""
    dur = 1.3
    t = tiempo(dur)
    toque = np.where(t < 0.55, 1.0, 0.0) * np.minimum(1, t / 0.03)
    y = sum(np.sign(np.sin(2 * np.pi * f * t)) * 0.18 + np.sin(2 * np.pi * f * t) * 0.5 for f in (330, 415)) * toque
    tp = tiempo(0.05)
    clac = ruido(0.05, 500, 3000) * np.exp(-tp / 0.01)
    for tt in (0.6, 0.72, 0.95, 1.07):
        i = int(tt * SR)
        y[i:i + len(clac)] += clac * 0.6
    return bordes(norm(y), 0.01, 0.08)


def s_claxon(**_):
    """Claxon de coche: dos bocinazos cortos."""
    y = np.zeros(int(0.75 * SR), np.float32)
    tp = tiempo(0.2)
    b = sum(np.sign(np.sin(2 * np.pi * f * tp)) * 0.25 + np.sin(2 * np.pi * f * tp) for f in (400, 500)) * np.minimum(1, tp / 0.01)
    b = bordes(b, 0.005, 0.03)
    for k in range(2):
        i = int(k * 0.3 * SR)
        y[i:i + len(b)] += b[: len(y) - i]
    return norm(y)


def s_campana_estacion(**_):
    """Sintonía de aviso de estación: cuatro notas de campana (mi-do-re-sol), más larga que la del avión."""
    y = np.zeros(int(2.0 * SR), np.float32)
    for k, f in enumerate((659, 523, 587, 784)):
        c = campana(f, 1.1, [(1, 1, 0.5), (2.0, 0.2, 0.2), (3.0, 0.07, 0.1)])
        i = int(k * 0.3 * SR)
        y[i:i + len(c)] += c[: len(y) - i] * 0.9
    return norm(y)


# ------------------------------------------------------------------ ambientes de fondo (Bruno, 21-11-2026: «ruidos de fondo referentes a cada cosa»)
def lazo(fn, dur, **kw):
    """Repite un fragmento de ambiente hasta cubrir dur, con fundidos cruzados para que no se note el corte."""
    trozo = fn(**kw)
    n, m, x = int(dur * SR), len(trozo), int(0.4 * SR)
    y = np.zeros(n + m, np.float32)
    rampa = np.linspace(0, 1, x, dtype=np.float32)
    t = 0
    while t < n:
        p = trozo.copy()
        p[:x] *= rampa
        p[-x:] *= rampa[::-1]
        y[t:t + m] += p
        t += m - x
    return y[:n]


def amb_aeropuerto(**_):
    """Terminal: murmullo de gente, pasos y alguna maleta de ruedas."""
    dur = 6.0
    t = tiempo(dur)
    y = ruido(dur, 220, 1800) * 0.35 * (0.75 + 0.25 * np.sin(2 * np.pi * 0.31 * t))
    tp = tiempo(0.06)
    paso = np.sin(2 * np.pi * 110 * tp) * np.exp(-tp / 0.015) + ruido(0.06, 700, 3500) * np.exp(-tp / 0.006) * 0.3
    for tt in np.arange(0.1, dur - 0.1, 0.43) + rng.uniform(-0.05, 0.05, len(np.arange(0.1, dur - 0.1, 0.43))):
        i = int(tt * SR)
        y[i:i + len(paso)] += paso * 0.35
    for t0 in (0.8, 3.9):                       # maleta de ruedas que pasa: traqueteo rápido en las juntas del suelo
        r = ruido(1.6, 300, 2500) * np.abs(np.sin(2 * np.pi * 7 * tiempo(1.6))) ** 4 * np.sin(np.pi * tiempo(1.6) / 1.6) * 0.5
        i = int(t0 * SR)
        y[i:i + len(r)] += r
    return norm(y)


def amb_cabina(**_):
    """Dentro del avión: zumbido grave y constante de los motores y el aire."""
    dur = 5.0
    t = tiempo(dur)
    y = ruido(dur, 35, 420) * 0.8 + ruido(dur, 1500, 5000) * 0.10
    y += 0.10 * np.sin(2 * np.pi * 117 * t) + 0.05 * np.sin(2 * np.pi * 234 * t)
    return norm(y * (0.93 + 0.07 * np.sin(2 * np.pi * 0.2 * t)))


def amb_anden(**_):
    """Andén: retumbar de un tren que circula despacio y el traqueteo de las ruedas en las juntas de la vía."""
    dur = 8.0
    t = tiempo(dur)
    pasa = 0.35 + 0.65 * np.sin(np.pi * t / dur) ** 2
    y = ruido(dur, 30, 220) * 0.7 * pasa + ruido(dur, 600, 3000) * 0.06
    tp = tiempo(0.09)
    clac = (ruido(0.09, 400, 2800) * np.exp(-tp / 0.012) + np.sin(2 * np.pi * 75 * tp) * np.exp(-tp / 0.03)) * 0.8
    for base in np.arange(0.2, dur - 0.4, 0.95):   # ta-ta … ta-ta: cada junta, dos ejes
        for d in (0.0, 0.13):
            i = int((base + d) * SR)
            y[i:i + len(clac)] += clac * pasa[min(i, len(pasa) - 1)]
    return norm(y)


def amb_trafico(**_):
    """Carretera y peaje: motores al ralentí, coches que pasan y algún bocinazo lejano de atasco."""
    dur = 9.0
    t = tiempo(dur)
    y = ruido(dur, 28, 140) * 0.6 * (0.8 + 0.2 * np.sin(2 * np.pi * 9 * t)) + ruido(dur, 300, 1500) * 0.08
    for t0 in (0.6, 3.4, 6.1):                  # coches que pasan
        d = 1.8
        w = ruido(d, 120, 2600) * np.sin(np.pi * tiempo(d) / d) ** 3 * 0.55
        i = int(t0 * SR)
        y[i:i + len(w)] += w[: len(y) - i]
    for t0, tono in ((2.2, 0.85), (7.4, 1.1)):   # bocinazos lejanos
        tp = tiempo(0.35)
        b = sum(np.sin(2 * np.pi * f * tono * tp) for f in (400, 500)) * np.minimum(1, tp / 0.02) * np.minimum(1, (0.35 - tp) / 0.05)
        i = int(t0 * SR)
        y[i:i + len(b)] += banda(b.astype(np.float32), 300, 2000) * 0.22
    return norm(y)


AMBIENTES = {"aeropuerto": amb_aeropuerto, "cabina": amb_cabina, "anden": amb_anden, "trafico": amb_trafico}
NIVEL_AMB = {"aeropuerto": 0.07, "cabina": 0.08, "anden": 0.09, "trafico": 0.08}


def megafonia(y):
    """Voz por megafonía: banda de teléfono (300-3.400 Hz), un poco saturada y con el eco de una sala grande."""
    y = banda(y, 300, 3400)
    y = np.tanh(y * 2.2) / np.tanh(2.2)
    out = np.zeros(len(y) + int(0.6 * SR), np.float32)
    for retardo, g in ((0.0, 1.0), (0.09, 0.42), (0.21, 0.26), (0.37, 0.14)):
        i = int(retardo * SR)
        out[i:i + len(y)] += y * g
    return norm(out)


EFECTOS = {"calle": s_calle, "pop": s_pop, "estacion": s_campana_estacion, "megafonia": s_megafonia, "avion": s_avion, "tren": s_tren, "claxon": s_claxon, "ting": s_ting, "ding": s_ding, "moneda": s_moneda, "papel": s_papel, "hojas": s_hojas,
           "carro": s_carro, "beep": s_beep, "conteo": s_conteo, "caja": s_caja, "sube": s_sube, "pinza": s_pinza,
           "desenrolla": s_desenrolla, "sello": s_sello, "notif": s_notif, "fwip": s_fwip,
           "campanilla": s_campanilla, "persiana": s_persiana, "vapor": s_vapor, "golpe": s_golpe, "sueno": s_sueno,
           "timbre": s_timbre, "rasgado": s_rasgado, "publico": s_publico, "bici": s_bici}
# Ganancia de cada efecto para que ninguno tape la voz
NIVEL = {"calle": 0.22, "pop": 0.30, "estacion": 0.24, "megafonia": 0.24, "avion": 0.18, "tren": 0.20, "claxon": 0.18, "ting": 0.22, "ding": 0.20, "moneda": 0.16, "papel": 0.26, "hojas": 0.22, "carro": 0.20,
         "beep": 0.12, "conteo": 0.16, "caja": 0.30, "sube": 0.13, "pinza": 0.26, "desenrolla": 0.22,
         "sello": 0.40, "notif": 0.24, "fwip": 0.10, "campanilla": 0.18, "persiana": 0.16, "vapor": 0.10, "golpe": 0.22, "sueno": 0.20,
         "timbre": 0.22, "rasgado": 0.18, "publico": 0.16, "bici": 0.16}


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
    orden = linea["planos"]   # las capas entran en el 2.º, 3.er y 5.º plano (por orden: un guion puede saltarse números)
    t_corte = cues[m["corte"]]
    mus = Pista(dur)
    musica(mus, 0.0, t_corte, m["bpm"], {"bajo": orden[1]["ini"], "shaker": orden[2]["ini"], "bombo": orden[min(4, len(orden) - 1)]["ini"]})
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

    # ---- ambientes de fondo de cada escenario y avisos por megafonía (historia.json: «ambientes» y «avisos»)
    planos = {p["n"]: p for p in linea["planos"]}
    lista = linea["planos"]
    amb = Pista(dur)
    for a in historia.get("ambientes", []):
        i0 = lista.index(planos[a["desde"]])
        i1 = lista.index(planos[a["hasta"]])
        t0 = 0.0 if i0 == 0 else lista[i0]["ini"] - 0.35
        t1 = dur if i1 + 1 >= len(lista) else lista[i1 + 1]["ini"] - 0.35
        y = lazo(AMBIENTES[a["tipo"]], t1 - t0 + 0.6)
        x = int(0.6 * SR)
        y[:x] *= np.linspace(0, 1, x)
        y[-x:] *= np.linspace(1, 0, x)
        amb.poner(y, t0 - (0.3 if t0 > 0 else 0), NIVEL_AMB[a["tipo"]] * a.get("vol", 1.0) * 2, pan=a.get("pan", 0.0))
    avisos = Pista(dur)
    for a in historia.get("avisos", []):
        p = planos[a["beat"]]
        t = (p["ini"] if a.get("en", "inicio") == "inicio" else p["fin"]) + a.get("dt", 0)
        if a.get("campana"):
            avisos.poner(EFECTOS[a["campana"]](), t, NIVEL[a["campana"]] * a.get("vol", 1.0) * 1.6)
            t += a.get("tras_campana_s", 1.3)
        y = megafonia(leer(d / a["fichero"]))
        avisos.poner(y, t, 0.16 * a.get("vol", 1.0), pan=a.get("pan", 0.0))
    # el fondo también se aparta cuando habla la voz (algo menos que la música; los avisos, algo más)
    amb_b = amb.b[:n] * (1 - 0.45 * suave)[:, None] + avisos.b[:n] * (1 - 0.6 * suave)[:, None]

    mezcla = np.stack([voz, voz], axis=1) + mus_b + fx.b[:n] + amb_b
    pico = np.abs(mezcla).max()
    if pico > 0.97:
        mezcla *= 0.97 / pico
    salida = d / "audio" / "mezcla.wav"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "f32le", "-ar", str(SR), "-ac", "2", "-i", "-", str(salida)],
                   input=mezcla.astype(np.float32).tobytes(), check=True)

    def db(x):
        return 20 * np.log10(np.sqrt(np.mean(x ** 2)) + 1e-9)
    print(f"escrito {salida} · {dur:.1f} s · {len(cues)} momentos")
    print(f"niveles (dB RMS): voz {db(voz):.1f} · música {db(mus_b):.1f} · efectos {db(fx.b[:n]):.1f} · fondo {db(amb_b):.1f} · pico {pico:.2f}")
    print(f"corte de música en {t_corte:.2f} s, vuelve en {t_vuelve:.2f} s")


if __name__ == "__main__":
    main(sys.argv)
