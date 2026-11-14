#!/usr/bin/env python3
"""Mezcla la voz con efectos sintetizados (sin bancos de sonido ni licencias).

- Tic-tac de reloj muy bajo durante todo el vídeo (la marca del canal es la hora).
- Roce de papel cuando entra una tarjeta.
- Golpe de sello cuando se estampa el sello o se marca el veredicto.
Los momentos salen de videos/<id>/direccion.json y audio/linea_tiempo.json, con las
mismas reglas que diseno/video.mjs. Es la misma mezcla para los tres estilos.

Uso: python3 scripts/mezcla.py videos/t1
Salida: videos/<id>/audio/mezcla.wav
"""
import json
import pathlib
import subprocess
import sys

import numpy as np

SR = 24000
rng = np.random.default_rng(7)


def leer_wav(ruta):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", str(ruta), "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"],
                         capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.float32).copy()


def filtro_paso_banda(x, lo, hi):
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1 / SR)
    X[(f < lo) | (f > hi)] = 0
    return np.fft.irfft(X, len(x)).astype(np.float32)


def clic(frec_lo, frec_hi, dur=0.035):
    n = int(dur * SR)
    r = filtro_paso_banda(rng.standard_normal(n).astype(np.float32), frec_lo, frec_hi)
    env = np.exp(-np.linspace(0, 9, n))
    return (r * env / (np.abs(r).max() + 1e-6)).astype(np.float32)


def papel(dur=0.22):
    n = int(dur * SR)
    r = filtro_paso_banda(rng.standard_normal(n).astype(np.float32), 900, 7000)
    t = np.linspace(0, 1, n)
    env = np.sin(np.pi * t) ** 1.5 * (1 + 0.6 * np.sin(2 * np.pi * 9 * t))
    return (r * env / (np.abs(r).max() + 1e-6)).astype(np.float32)


def sello(dur=0.18):
    n = int(dur * SR)
    t = np.arange(n) / SR
    golpe = np.sin(2 * np.pi * 85 * t) * np.exp(-t * 28)
    ruido = filtro_paso_banda(rng.standard_normal(n).astype(np.float32), 200, 2500) * np.exp(-t * 60) * 0.5
    s = golpe + ruido
    return (s / np.abs(s).max()).astype(np.float32)


def poner(pista, sonido, t, gan):
    i = int(t * SR)
    if i < 0 or i >= len(pista):
        return
    f = min(len(pista), i + len(sonido))
    pista[i:f] += sonido[: f - i] * gan


def main(argv):
    d = pathlib.Path(argv[1])
    linea = json.loads((d / "audio" / "linea_tiempo.json").read_text(encoding="utf-8"))
    direccion = json.loads((d / "direccion.json").read_text(encoding="utf-8"))
    voz = leer_wav(d / "audio" / "voz.wav")
    efectos = np.zeros_like(voz)

    # Tic-tac: un golpe por segundo, alternando tic (agudo) y tac (grave)
    tic, tac = clic(2500, 6000), clic(1200, 3000)
    for k, t in enumerate(np.arange(0.5, len(voz) / SR, 1.0)):
        poner(efectos, tic if k % 2 == 0 else tac, t, 0.035)

    for p in linea["planos"]:
        dp = direccion["planos"].get(str(p["n"]), {})
        tipo = dp.get("tarjeta", {}).get("tipo", "mantener")
        if tipo != "mantener":
            poner(efectos, papel(), p["ini"] - 0.18, 0.10)
        if dp.get("sello"):
            poner(efectos, sello(), p["ini"] + 0.35, 0.20)
        if tipo == "cierre" and dp["tarjeta"].get("marcar"):
            poner(efectos, sello(), p["ini"] - 0.15 + 0.3, 0.28)

    mezcla = voz + efectos
    mezcla /= max(1.0, np.abs(mezcla).max() / 0.95)
    salida = d / "audio" / "mezcla.wav"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "f32le", "-ar", str(SR), "-ac", "1", "-i", "-", str(salida)],
                   input=mezcla.astype(np.float32).tobytes(), check=True)
    print("escrito", salida, f"{len(mezcla) / SR:.1f} s")


if __name__ == "__main__":
    main(sys.argv)
