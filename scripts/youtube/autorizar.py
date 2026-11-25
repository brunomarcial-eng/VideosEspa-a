#!/usr/bin/env python3
"""Conecta el canal con la API de YouTube (OAuth 2.0), en dos pasos.

Modo «escritorio» (recomendado; necesita un cliente «Aplicación de escritorio»):
  python3 scripts/youtube/autorizar.py escritorio iniciar
      -> imprime un enlace. Ábrelo con la cuenta del canal y acepta.
         Al final el navegador muestra un error de 127.0.0.1: es normal.
         Copia la dirección completa de esa página.
  python3 scripts/youtube/autorizar.py escritorio completar "<dirección copiada>"

Modo «dispositivo» (necesita un cliente «TV y dispositivos de entrada limitada»;
no sirve para Analytics):
  python3 scripts/youtube/autorizar.py dispositivo iniciar
      -> imprime una web y un código. Entra en la web desde el móvil y escribe el código.
  python3 scripts/youtube/autorizar.py dispositivo completar

El token queda en ~/.config/cvth/token.json, fuera del repositorio.
"""
import base64
import hashlib
import secrets
import sys
import time
import urllib.parse

from yt_comun import (AUTH_URL, DEVICE_URL, PENDIENTE, SCOPES, TOKEN_URL, cliente,
                      guardar_privado, guardar_token, leer_json, peticion)

REDIRECT = "http://127.0.0.1:8765/"


def escritorio_iniciar():
    c = cliente()
    verificador = secrets.token_urlsafe(64)
    reto = base64.urlsafe_b64encode(hashlib.sha256(verificador.encode()).digest()).rstrip(b"=").decode()
    estado = secrets.token_urlsafe(16)
    scopes = " ".join([SCOPES["subir"], SCOPES["leer"], SCOPES["analytics"]])
    guardar_privado(PENDIENTE, {"modo": "escritorio", "verificador": verificador, "estado": estado,
                                "creado": int(time.time())})
    url = AUTH_URL + "?" + urllib.parse.urlencode({
        "client_id": c["client_id"], "redirect_uri": REDIRECT, "response_type": "code",
        "scope": scopes, "state": estado, "code_challenge": reto,
        "code_challenge_method": "S256", "access_type": "offline", "prompt": "consent"})
    print("Abre este enlace con la cuenta del canal (no con tu cuenta personal):\n")
    print(url)
    print("\nAl terminar verás un error de 127.0.0.1. Copia la dirección completa de esa página.")


def escritorio_completar(direccion: str):
    pend = leer_json(PENDIENTE)
    if pend.get("modo") != "escritorio":
        raise SystemExit("No hay una autorización de escritorio pendiente. Ejecuta «escritorio iniciar».")
    q = urllib.parse.parse_qs(urllib.parse.urlparse(direccion.strip()).query)
    if "error" in q:
        raise SystemExit(f"Google devolvió un error: {q['error'][0]}")
    if q.get("state", [""])[0] != pend["estado"]:
        raise SystemExit("El parámetro «state» no coincide. Vuelve a empezar con «escritorio iniciar».")
    codigo_auth = q.get("code", [""])[0]
    if not codigo_auth:
        raise SystemExit("No encuentro «code=» en la dirección pegada.")
    c = cliente()
    codigo, _, resp = peticion(TOKEN_URL, datos={
        "client_id": c["client_id"], "client_secret": c.get("client_secret", ""),
        "code": codigo_auth, "code_verifier": pend["verificador"],
        "grant_type": "authorization_code", "redirect_uri": REDIRECT})
    if codigo != 200:
        raise SystemExit(f"No se pudo canjear el código ({codigo}): {resp}")
    tok = guardar_token(resp)
    PENDIENTE.unlink(missing_ok=True)
    print("Conectado. Permisos concedidos:", tok.get("scope"))
    if not tok.get("refresh_token"):
        print("Aviso: Google no ha dado token de refresco; habrá que autorizar de nuevo cuando caduque.")


def dispositivo_iniciar():
    c = cliente()
    scopes = " ".join([SCOPES["subir"], SCOPES["leer"]])
    codigo, _, resp = peticion(DEVICE_URL, datos={"client_id": c["client_id"], "scope": scopes})
    if codigo != 200:
        raise SystemExit(f"Google rechazó la petición ({codigo}): {resp}. "
                         "¿El cliente es de tipo «TV y dispositivos de entrada limitada»?")
    guardar_privado(PENDIENTE, {"modo": "dispositivo", **resp, "creado": int(time.time())})
    print(f"Entra en {resp['verification_url']} con la cuenta del canal y escribe este código:\n")
    print(f"    {resp['user_code']}\n")
    print(f"Caduca en {int(resp['expires_in']) // 60} minutos. Después ejecuta «dispositivo completar».")


def dispositivo_completar(espera_max=600):
    pend = leer_json(PENDIENTE)
    if pend.get("modo") != "dispositivo":
        raise SystemExit("No hay una autorización de dispositivo pendiente.")
    c = cliente()
    intervalo = int(pend.get("interval", 5))
    limite = min(pend["creado"] + int(pend["expires_in"]), time.time() + espera_max)
    while time.time() < limite:
        codigo, _, resp = peticion(TOKEN_URL, datos={
            "client_id": c["client_id"], "client_secret": c.get("client_secret", ""),
            "device_code": pend["device_code"],
            "grant_type": "urn:ietf:params:oauth:grant-type:device_code"})
        if codigo == 200:
            tok = guardar_token(resp)
            PENDIENTE.unlink(missing_ok=True)
            print("Conectado. Permisos concedidos:", tok.get("scope"))
            return
        err = resp.get("error")
        if err == "authorization_pending":
            time.sleep(intervalo)
        elif err == "slow_down":
            intervalo += 5
            time.sleep(intervalo)
        else:
            raise SystemExit(f"Autorización fallida: {resp}")
    raise SystemExit("Se acabó el tiempo. Vuelve a empezar con «dispositivo iniciar».")


def main(argv):
    if len(argv) < 3:
        print(__doc__)
        return 2
    modo, accion = argv[1], argv[2]
    if (modo, accion) == ("escritorio", "iniciar"):
        escritorio_iniciar()
    elif (modo, accion) == ("escritorio", "completar"):
        if len(argv) < 4:
            raise SystemExit("Falta la dirección copiada del navegador.")
        escritorio_completar(argv[3])
    elif (modo, accion) == ("dispositivo", "iniciar"):
        dispositivo_iniciar()
    elif (modo, accion) == ("dispositivo", "completar"):
        dispositivo_completar()
    else:
        print(__doc__)
        return 2
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
