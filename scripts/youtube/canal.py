#!/usr/bin/env python3
"""Comprueba la conexión: muestra el canal autorizado y revisa el anonimato.

Uso: python3 scripts/youtube/canal.py
"""
import sys

from yt_comun import api_get

# Texto que nunca debe aparecer en el canal (regla 7 de CLAUDE.md).
PROHIBIDO = ["bruno", "marcial"]


def main():
    resp = api_get("channels", {"part": "snippet,status,statistics,brandingSettings", "mine": "true"})
    items = resp.get("items", [])
    if not items:
        print("La cuenta autorizada no tiene canal de YouTube. Créalo en youtube.com y vuelve a probar.")
        return 1
    ch = items[0]
    sn, st, stats = ch["snippet"], ch.get("status", {}), ch.get("statistics", {})
    print("Canal:", sn.get("title"))
    print("Handle:", sn.get("customUrl", "(sin @handle)"))
    print("Id:", ch["id"])
    print("País:", sn.get("country", "(sin país)"))
    print("Vídeos largos (>15 min):", st.get("longUploadsStatus"), "— «allowed» = canal verificado por teléfono")
    print("Vídeos:", stats.get("videoCount"), "· Suscriptores:", stats.get("subscriberCount"))
    texto = " ".join([sn.get("title", ""), sn.get("description", ""), sn.get("customUrl", ""),
                      str(ch.get("brandingSettings", {}).get("channel", {}))]).lower()
    fallos = [p for p in PROHIBIDO if p in texto]
    if fallos:
        print("ALERTA DE ANONIMATO: el canal contiene", fallos)
        return 1
    print("Anonimato: sin datos personales en título, descripción ni handle.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
