#!/usr/bin/env python3
"""Ficha de subida de un vídeo aprobado: upload/<id>.json (para scripts/youtube/subir.py) y
upload/<id>.md (lo mismo, listo para copiar y pegar en YouTube Studio desde el móvil).

Uso: python3 scripts/ficha.py t1 [--publicar 2026-11-13T19:00] [--miniatura 27.5]

La descripción lleva las fuentes oficiales con enlace, la nota de método y los créditos de voz.
--miniatura N guarda el fotograma del segundo N como portada (upload/<id>-portada.png).
Hasta pasar la auditoría de la API, la subida es manual en Studio (CLAUDE.md, regla 10).
"""
import argparse
import json
import pathlib
import subprocess
from datetime import datetime
from zoneinfo import ZoneInfo

RAIZ = pathlib.Path(__file__).resolve().parent.parent

FUENTES = {
    "t1": [
        ("INE · Encuesta Anual de Estructura Salarial (tablas 28191 y 30046)", "https://www.ine.es/jaxiT3/Tabla.htm?t=28191"),
        ("INE · Índice de Precios de Consumo, alimentos y bebidas no alcohólicas (tabla 76125)", "https://www.ine.es/jaxiT3/Tabla.htm?t=76125"),
        ("INE · Encuesta de Presupuestos Familiares (tabla 73778)", "https://www.ine.es/jaxiT3/Tabla.htm?t=73778"),
        ("Eurostat · Ganancias netas por tipo de hogar (earn_nt_net)", "https://ec.europa.eu/eurostat/databrowser/view/earn_nt_net/default/table"),
    ],
    "t2": [
        ("INE · Encuesta de Población Activa, ocupados (tabla 65109)", "https://www.ine.es/jaxiT3/Tabla.htm?t=65109"),
        ("INE · EPA, parados (tabla 65218)", "https://www.ine.es/jaxiT3/Tabla.htm?t=65218"),
        ("INE · EPA, tasas de paro (tabla 65219)", "https://www.ine.es/jaxiT3/Tabla.htm?t=65219"),
        ("INE · EPA, tasas de empleo (tabla 65306)", "https://www.ine.es/jaxiT3/Tabla.htm?t=65306"),
    ],
}

# Texto de la descripción: con la voz del canal (clon-bruno), sin opiniones ni causas.
ENTRADA = {
    "t1": ("¿Llenar el carro te cuesta más o menos que hace 10 años? Ojo, que no lo medimos en euros: "
           "lo medimos en horas de trabajo.\n\n"
           "En 2016, la compra de comida de un mes le costaba a un sueldo mediano 12,8 horas de trabajo. "
           "Con el último dato oficial de salarios (2024), 14,5 horas. El sueldo neto por hora subió un 23 %; "
           "la misma compra, un 40 %.\n\n"
           "Veredicto: empeora. Casi dos horas más de trabajo cada mes por llevarte lo mismo. Y sale igual "
           "con 2016, 2018 o 2019 de referencia, y con el sueldo medio o el mediano, bruto o neto."),
}
METODO = {
    "t1": ("Cómo lo calculamos: la «compra del mes» es el gasto medio por persona en alimentos y bebidas sin alcohol "
           "(EPF 2025: 188 € al mes), llevada a los precios de cada año con el IPC de alimentos. Se divide entre el sueldo "
           "neto por hora del trabajador mediano (salario por hora de la EAES; neto según el modelo de impuestos de la "
           "OCDE publicado por Eurostat, soltero sin hijos). Es un cálculo propio con datos oficiales. 2024 es el último "
           "año con salarios oficiales del INE."),
}
CIERRE = {"t1": "¿Lo notas en tu carro? Te leo en los comentarios."}
ETIQUETAS = {
    "t1": ["cesta de la compra", "salarios", "IPC", "INE", "precios", "España", "horas de trabajo", "poder adquisitivo",
           "inflación", "sueldo"],
    "t2": ["empleo", "paro", "EPA", "INE", "crisis 2008", "España", "ocupados", "mercado laboral"],
}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("id")
    ap.add_argument("--estilo", default="limpio")
    ap.add_argument("--publicar", help="AAAA-MM-DDTHH:MM, hora de Madrid (si no, se decide en Studio)")
    ap.add_argument("--miniatura", type=float, help="segundo del vídeo que sirve de portada")
    a = ap.parse_args()
    vid = a.id
    g = json.loads((RAIZ / "videos" / vid / "guion.json").read_text(encoding="utf-8"))
    voces = json.loads((RAIZ / "diseno" / "voces.json").read_text(encoding="utf-8"))
    def credito(perfil):
        if perfil["motor"].startswith("qwen"):
            return voces["creditos"]["qwen:" + perfil["modelo"].split("/")[-1]]
        return voces["creditos"][f"{perfil['motor']}:{perfil['voz'].partition('#')[0]}"]
    creditos = "; ".join(sorted({credito(voces["perfiles"][p["genero"]]) for p in g["personajes"].values()}))
    video = f"videos/{vid}/render/{vid}-{a.estilo}.mp4"
    portada = f"upload/{vid}-portada.png" if (RAIZ / "upload" / f"{vid}-portada.png").exists() else None
    if a.miniatura is not None:
        portada = f"upload/{vid}-portada.png"
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", str(a.miniatura), "-i", str(RAIZ / video), "-frames:v", "1",
                        str(RAIZ / portada)], check=True)
    cuando = None
    if a.publicar:
        cuando = datetime.fromisoformat(a.publicar).replace(tzinfo=ZoneInfo("Europe/Madrid")).isoformat()
    fuentes = "\n".join(f"· {n}: {u}" for n, u in FUENTES[vid])
    desc = (f"{ENTRADA.get(vid, g['titulo'])}\n\n{METODO[vid]}\n\nFuentes oficiales:\n{fuentes}\n\n"
            f"Voz e imágenes generadas por ordenador; {g['protagonista']['nombre']} es un personaje inventado. {creditos}.\n\n"
            f"{CIERRE.get(vid, '')}\n\n#Shorts #economía #España")
    ficha = {
        "id": vid, "estilo": a.estilo, "video": video, "titulo": g["titulo"], "descripcion": desc,
        "etiquetas": ETIQUETAS[vid], "categoria": "27", "idioma": "es", "publicar_en": cuando, "miniatura": portada,
        "contenido_sintetico": True, "para_ninos": False,
        "nota_manual": "Subida manual en YouTube Studio hasta pasar la auditoría: programar la fecha y hora, marcar "
                       "«contenido alterado o sintético» y «no es contenido para niños».",
    }
    (RAIZ / "upload").mkdir(exist_ok=True)
    (RAIZ / "upload" / f"{vid}.json").write_text(json.dumps(ficha, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    md = [f"# Subida de {vid.upper()} a YouTube (manual, en Studio)", "",
          f"**Vídeo:** `{video}`  ", f"**Portada:** `{portada}`  " if portada else "**Portada:** elige un fotograma en Studio  ",
          f"**Publicar:** {cuando or 'la fecha y hora que decidas (hora de Madrid)'}", "",
          "## Título", "", "```", g["titulo"], "```", "",
          "## Descripción", "", "```", desc, "```", "",
          "## Etiquetas", "", "```", ", ".join(ETIQUETAS[vid]), "```", "",
          "## Casillas en Studio", "",
          "1. Público: **No, no es contenido creado para niños**.",
          "2. Detalles > Contenido alterado o sintético: **Sí** (la voz es sintética).",
          "3. Categoría: **Educación**. Idioma del vídeo: **Español (España)**.",
          "4. Visibilidad: **Programar** con la fecha y hora de arriba, o **Público** si lo publicas ya.",
          "5. Comentarios: activados (el vídeo cierra preguntando al espectador).", ""]
    (RAIZ / "upload" / f"{vid}.md").write_text("\n".join(md), encoding="utf-8")
    print(f"escrito upload/{vid}.json y upload/{vid}.md · título {len(g['titulo'])} caracteres · descripción {len(desc)}")


if __name__ == "__main__":
    main()
