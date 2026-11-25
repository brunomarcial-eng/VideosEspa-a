#!/usr/bin/env python3
"""Sube un vídeo como PRIVADO con publicación programada, a partir de su ficha.

Por defecto solo valida la ficha y enseña lo que enviaría (simulación).
Para subir de verdad hay que añadir --enviar.

  python3 scripts/youtube/subir.py upload/t1-A.json            # simulación
  python3 scripts/youtube/subir.py upload/t1-A.json --enviar   # sube

Ficha (upload/<id>.json):
{
  "id": "t1-A",
  "video": "videos/t1-A/render/t1-A.mp4",
  "titulo": "¿Cuántas horas de trabajo cuesta la compra del mes?",
  "descripcion": "... con fuentes ...",
  "etiquetas": ["IPC", "salarios", "INE"],
  "categoria": "27",                       # 27 = Educación
  "idioma": "es",
  "publicar_en": "2026-11-20T18:00:00+01:00",
  "miniatura": null,                       # ruta a PNG/JPG o null
  "contenido_sintetico": true,             # voz sintética => true
  "para_ninos": false
}

Regla del proyecto: hasta pasar la auditoría de la API, la subida válida es la
manual en Studio. Este script sirve para probar la conexión con un vídeo
privado y para cuando la auditoría esté aprobada.
"""
import json
import mimetypes
import pathlib
import sys
from datetime import datetime, timezone

from yt_comun import UPLOAD, peticion, token_acceso

RAIZ = pathlib.Path(__file__).resolve().parents[2]
PROHIBIDO = ["bruno", "marcial"]


def validar(f: dict) -> list[str]:
    errores = []
    for campo in ["id", "video", "titulo", "descripcion", "publicar_en"]:
        if not f.get(campo):
            errores.append(f"falta «{campo}»")
    if errores:
        return errores
    if len(f["titulo"]) > 100:
        errores.append(f"título de {len(f['titulo'])} caracteres (máximo 100)")
    if len(f["descripcion"]) > 5000:
        errores.append("descripción de más de 5.000 caracteres")
    for campo in ["titulo", "descripcion"]:
        if "<" in f[campo] or ">" in f[campo]:
            errores.append(f"«{campo}» no puede llevar < ni >")
    if len(",".join(f.get("etiquetas", []))) > 500:
        errores.append("las etiquetas suman más de 500 caracteres")
    if not (RAIZ / f["video"]).exists():
        errores.append(f"no existe el vídeo {f['video']}")
    if f.get("miniatura") and not (RAIZ / f["miniatura"]).exists():
        errores.append(f"no existe la miniatura {f['miniatura']}")
    try:
        cuando = datetime.fromisoformat(f["publicar_en"])
        if cuando.tzinfo is None:
            errores.append("«publicar_en» necesita zona horaria, p. ej. +01:00")
        elif cuando <= datetime.now(timezone.utc):
            errores.append("«publicar_en» está en el pasado (YouTube lo publicaría al momento)")
    except ValueError:
        errores.append("«publicar_en» no es una fecha ISO 8601")
    texto = " ".join([f["titulo"], f["descripcion"], " ".join(f.get("etiquetas", []))]).lower()
    for p in PROHIBIDO:
        if p in texto:
            errores.append(f"anonimato: la ficha contiene «{p}»")
    return errores


def cuerpo(f: dict) -> dict:
    publicar = datetime.fromisoformat(f["publicar_en"]).astimezone(timezone.utc)
    return {
        "snippet": {
            "title": f["titulo"],
            "description": f["descripcion"],
            "tags": f.get("etiquetas", []),
            "categoryId": str(f.get("categoria", "27")),
            "defaultLanguage": f.get("idioma", "es"),
            "defaultAudioLanguage": f.get("idioma", "es"),
        },
        "status": {
            "privacyStatus": "private",  # publishAt exige privado
            "publishAt": publicar.strftime("%Y-%m-%dT%H:%M:%SZ"),
            "selfDeclaredMadeForKids": bool(f.get("para_ninos", False)),
            "containsSyntheticMedia": bool(f.get("contenido_sintetico", True)),
            "embeddable": True,
            "license": "youtube",
        },
    }


def subir(f: dict) -> dict:
    video = RAIZ / f["video"]
    tam = video.stat().st_size
    tipo = mimetypes.guess_type(video.name)[0] or "video/mp4"
    token = token_acceso()
    url = f"{UPLOAD}/videos?uploadType=resumable&part=snippet,status"
    codigo, cab, resp = peticion(url, cuerpo=json.dumps(cuerpo(f)).encode(), metodo="POST", cabeceras={
        "Authorization": f"Bearer {token}", "Content-Type": "application/json; charset=UTF-8",
        "X-Upload-Content-Type": tipo, "X-Upload-Content-Length": str(tam)})
    destino = cab.get("Location") or cab.get("location")
    if codigo != 200 or not destino:
        raise SystemExit(f"YouTube no abrió la subida ({codigo}): {resp}")
    with video.open("rb") as fh:
        codigo, _, resp = peticion(destino, cuerpo=fh, metodo="PUT", tiempo=1800, cabeceras={
            "Authorization": f"Bearer {token}", "Content-Type": tipo, "Content-Length": str(tam)})
    if codigo not in (200, 201):
        raise SystemExit(f"Falló la subida ({codigo}): {resp}")
    if f.get("miniatura"):
        mini = RAIZ / f["miniatura"]
        c2, _, r2 = peticion(f"{UPLOAD}/thumbnails/set?videoId={resp['id']}", cuerpo=mini.read_bytes(),
                             metodo="POST", cabeceras={
                                 "Authorization": f"Bearer {token}",
                                 "Content-Type": mimetypes.guess_type(mini.name)[0] or "image/png"})
        if c2 != 200:
            print(f"Aviso: no se pudo poner la miniatura ({c2}): {r2}. "
                  "¿Está el canal verificado por teléfono?")
    return resp


def main(argv):
    if len(argv) < 2:
        print(__doc__)
        return 2
    ruta = pathlib.Path(argv[1])
    f = json.loads(ruta.read_text(encoding="utf-8"))
    errores = validar(f)
    if errores:
        print("Ficha no válida:\n- " + "\n- ".join(errores))
        return 1
    if "--enviar" not in argv:
        print("SIMULACIÓN (añade --enviar para subir). Se enviaría:")
        print(json.dumps(cuerpo(f), ensure_ascii=False, indent=2))
        return 0
    resp = subir(f)
    salida = ruta.with_name(f"{f['id']}.resultado.json")
    salida.write_text(json.dumps({
        "id_video": resp.get("id"), "url": f"https://youtu.be/{resp.get('id')}",
        "status": resp.get("status"), "subido_utc": datetime.now(timezone.utc).isoformat(timespec="seconds"),
    }, ensure_ascii=False, indent=2), encoding="utf-8")
    print("Subido:", f"https://youtu.be/{resp.get('id')}", "·", resp.get("status"))
    print("Resultado guardado en", salida)
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
