"""Piezas comunes para hablar con la API de YouTube (solo biblioteca estándar).

Credenciales y tokens viven FUERA del repositorio, en ~/.config/cvth/
(o en la carpeta que diga la variable de entorno CVTH_CONFIG):
  cliente_oauth.json   JSON del cliente OAuth descargado de Google Cloud
  token.json           token de acceso y de refresco (se crea al autorizar)
  pendiente.json       estado temporal entre «iniciar» y «completar»

Nunca se suben a git (ver .gitignore).
"""
import json
import os
import pathlib
import time
import urllib.error
import urllib.parse
import urllib.request

CONFIG = pathlib.Path(os.environ.get("CVTH_CONFIG", pathlib.Path.home() / ".config" / "cvth"))
CLIENTE = CONFIG / "cliente_oauth.json"
TOKEN = CONFIG / "token.json"
PENDIENTE = CONFIG / "pendiente.json"

TOKEN_URL = "https://oauth2.googleapis.com/token"
DEVICE_URL = "https://oauth2.googleapis.com/device/code"
AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth"
API = "https://www.googleapis.com/youtube/v3"
UPLOAD = "https://www.googleapis.com/upload/youtube/v3"
ANALYTICS = "https://youtubeanalytics.googleapis.com/v2"

SCOPES = {
    "subir": "https://www.googleapis.com/auth/youtube.upload",
    "leer": "https://www.googleapis.com/auth/youtube.readonly",
    "analytics": "https://www.googleapis.com/auth/yt-analytics.readonly",
}

USER_AGENT = "cvth-youtube/1.0"


class ErrorAPI(RuntimeError):
    pass


def guardar_privado(ruta: pathlib.Path, datos: dict) -> None:
    """Escribe JSON con permisos 600 en una carpeta 700."""
    ruta.parent.mkdir(parents=True, exist_ok=True)
    os.chmod(ruta.parent, 0o700)
    tmp = ruta.with_suffix(".tmp")
    fd = os.open(tmp, os.O_WRONLY | os.O_CREAT | os.O_TRUNC, 0o600)
    with os.fdopen(fd, "w", encoding="utf-8") as f:
        json.dump(datos, f, ensure_ascii=False, indent=2)
    os.replace(tmp, ruta)


def leer_json(ruta: pathlib.Path) -> dict:
    return json.loads(ruta.read_text(encoding="utf-8"))


def cliente() -> dict:
    """client_id y client_secret del JSON descargado de Google Cloud."""
    if not CLIENTE.exists():
        raise SystemExit(
            f"Falta {CLIENTE}. Descarga el JSON del cliente OAuth (docs/youtube-api-conexion.md, paso 5) "
            "y cópialo ahí. No lo pongas dentro del repositorio.")
    d = leer_json(CLIENTE)
    d = d.get("installed") or d.get("web") or d
    if "client_id" not in d:
        raise SystemExit(f"{CLIENTE} no parece un JSON de cliente OAuth de Google.")
    return d


def peticion(url, datos=None, cabeceras=None, metodo=None, cuerpo=None, tiempo=120):
    """Petición HTTP. `datos` (dict) va como formulario; `cuerpo` como bytes tal cual.

    Devuelve (código, cabeceras, cuerpo decodificado como JSON si se puede).
    """
    cab = {"User-Agent": USER_AGENT}
    cab.update(cabeceras or {})
    if datos is not None:
        cuerpo = urllib.parse.urlencode(datos).encode()
        cab.setdefault("Content-Type", "application/x-www-form-urlencoded")
    req = urllib.request.Request(url, data=cuerpo, headers=cab, method=metodo)
    try:
        with urllib.request.urlopen(req, timeout=tiempo) as r:
            raw = r.read()
            codigo, hdrs = r.status, dict(r.headers)
    except urllib.error.HTTPError as e:
        raw, codigo, hdrs = e.read(), e.code, dict(e.headers)
    try:
        cuerpo_resp = json.loads(raw) if raw else {}
    except ValueError:
        cuerpo_resp = {"_texto": raw.decode("utf-8", "replace")[:2000]}
    return codigo, hdrs, cuerpo_resp


def guardar_token(resp: dict, previo: dict | None = None) -> dict:
    tok = dict(previo or {})
    tok.update({k: v for k, v in resp.items() if k in
                ("access_token", "refresh_token", "scope", "token_type", "expires_in")})
    tok["caduca"] = int(time.time()) + int(resp.get("expires_in", 3600)) - 60
    guardar_privado(TOKEN, tok)
    return tok


def token_acceso() -> str:
    """Token de acceso válido; lo refresca si ha caducado."""
    if not TOKEN.exists():
        raise SystemExit("No hay token. Ejecuta antes: python3 scripts/youtube/autorizar.py escritorio iniciar")
    tok = leer_json(TOKEN)
    if tok.get("caduca", 0) > time.time():
        return tok["access_token"]
    if not tok.get("refresh_token"):
        raise SystemExit("El token ha caducado y no hay token de refresco. Vuelve a autorizar.")
    c = cliente()
    codigo, _, resp = peticion(TOKEN_URL, datos={
        "client_id": c["client_id"], "client_secret": c.get("client_secret", ""),
        "refresh_token": tok["refresh_token"], "grant_type": "refresh_token"})
    if codigo != 200:
        raise SystemExit(f"No se pudo refrescar el token ({codigo}): {resp}. "
                         "Si la app está en modo «Prueba», los tokens caducan a los 7 días: vuelve a autorizar.")
    return guardar_token(resp, tok)["access_token"]


def api_get(ruta: str, params: dict, base: str = API) -> dict:
    url = f"{base}/{ruta}?{urllib.parse.urlencode(params, doseq=True)}"
    codigo, _, resp = peticion(url, cabeceras={"Authorization": f"Bearer {token_acceso()}"})
    if codigo != 200:
        raise ErrorAPI(f"GET {ruta} -> {codigo}: {json.dumps(resp, ensure_ascii=False)[:800]}")
    return resp
