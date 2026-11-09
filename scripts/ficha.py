#!/usr/bin/env python3
"""Genera la ficha de subida de cada Short del test (upload/<id>-<estilo>.json).

Calendario de docs/piloto-test.md: 6 días seguidos, misma franja horaria, orden rotado.
  Día 1 T1-A · Día 2 T2-B · Día 3 T1-C · Día 4 T2-A · Día 5 T1-B · Día 6 T2-C

Uso: python3 scripts/ficha.py --inicio 2026-11-16 --hora 19:00
La descripción lleva las fuentes con enlace, la nota de método y los créditos de voz.
El título es el mismo en los tres estilos de un tema (el test solo cambia el diseño).
"""
import argparse
import json
import pathlib
from datetime import date, datetime, timedelta
from zoneinfo import ZoneInfo

RAIZ = pathlib.Path(__file__).resolve().parent.parent
CALENDARIO = [("t1", "A"), ("t2", "B"), ("t1", "C"), ("t2", "A"), ("t1", "B"), ("t2", "C")]
ESTILOS = {"A": "pizarra", "B": "cápsula", "C": "baraja"}

FUENTES = {
    "t1": [
        ("INE · Encuesta Anual de Estructura Salarial (tablas 28191 y 30046)", "https://www.ine.es/jaxiT3/Tabla.htm?t=28191"),
        ("INE · Índice de Precios de Consumo, alimentos y bebidas no alcohólicas (tabla 76125)", "https://www.ine.es/jaxiT3/Tabla.htm?t=76125"),
        ("INE · Encuesta de Presupuestos Familiares (tabla 73778)", "https://www.ine.es/jaxiT3/Tabla.htm?t=73778"),
        ("Eurostat · Ganancias netas por tipo de hogar (earn_nt_net)", "https://ec.europa.eu/eurostat/databrowser/view/earn_nt_net/default/table"),
    ],
    "t2": [
        ("INE · Encuesta de Población Activa, ocupados (tabla 65109)", "https://www.ine.es/jaxiT3/Tabla.htm?t=65109"),
        ("INE · EPA, tasas de paro (tabla 65219)", "https://www.ine.es/jaxiT3/Tabla.htm?t=65219"),
        ("INE · EPA, tasas de empleo (tabla 65306)", "https://www.ine.es/jaxiT3/Tabla.htm?t=65306"),
    ],
}
METODO = {
    "t1": ("Cómo lo calculamos: la «compra del mes» es el gasto medio por persona en alimentos y bebidas sin alcohol "
           "(EPF 2025: 188 € al mes), llevada a los precios de cada año con el IPC de alimentos. Se divide entre el sueldo "
           "neto por hora del trabajador mediano (salario por hora de la EAES; neto según el modelo de impuestos de la "
           "OCDE publicado por Eurostat, soltero sin hijos). 2024 es el último año con salarios oficiales del INE. "
           "Con el sueldo medio o con el bruto la conclusión es la misma."),
    "t2": ("Cómo lo comparamos: tercer trimestre de cada año en la Encuesta de Población Activa (INE), para evitar la "
           "estacionalidad. «Hoy» es el 3.er trimestre de 2026. La población de 16 años o más se calcula como "
           "ocupados ÷ tasa de empleo. 2020 no se usa en ninguna comparación."),
}
ETIQUETAS = {
    "t1": ["cesta de la compra", "salarios", "IPC", "INE", "precios", "España", "horas de trabajo", "poder adquisitivo"],
    "t2": ["empleo", "paro", "EPA", "INE", "crisis 2008", "España", "ocupados", "mercado laboral"],
}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--inicio", required=True, help="fecha del día 1, AAAA-MM-DD")
    ap.add_argument("--hora", default="19:00", help="hora de publicación (Europe/Madrid)")
    a = ap.parse_args()
    voces = json.loads((RAIZ / "diseno" / "voces.json").read_text(encoding="utf-8"))
    creditos_voz = voces["creditos"]["kokoro"] if all(p["motor"] == "kokoro" for p in voces["perfiles"].values()) \
        else "; ".join(voces["creditos"].values())
    ini = date.fromisoformat(a.inicio)
    hh, mm = map(int, a.hora.split(":"))
    (RAIZ / "upload").mkdir(exist_ok=True)
    for dia, (vid, estilo) in enumerate(CALENDARIO, start=1):
        g = json.loads((RAIZ / "videos" / vid / "guion.json").read_text(encoding="utf-8"))
        cuando = datetime.combine(ini + timedelta(days=dia - 1), datetime.min.time()).replace(
            hour=hh, minute=mm, tzinfo=ZoneInfo("Europe/Madrid"))
        fuentes = "\n".join(f"· {n}: {u}" for n, u in FUENTES[vid])
        desc = (f"{g['titulo']}\n\n{g['cierre']['porque']}\n\n{METODO[vid]}\n\nFuentes oficiales:\n{fuentes}\n\n"
                f"Personajes y voces generados por ordenador; las personas son inventadas. {creditos_voz}.\n\n"
                f"#Shorts #economía #España")
        ficha = {
            "id": f"{vid}-{estilo}", "dia_test": dia, "estilo": f"{estilo} · {ESTILOS[estilo]}",
            "video": f"videos/{vid}/render/{vid}-{estilo}.mp4",
            "titulo": g["titulo"], "descripcion": desc, "etiquetas": ETIQUETAS[vid], "categoria": "27", "idioma": "es",
            "publicar_en": cuando.isoformat(), "miniatura": None, "contenido_sintetico": True, "para_ninos": False,
            "nota_manual": "Subida manual en YouTube Studio hasta pasar la auditoría: programar con la fecha y hora de "
                           "«publicar_en», marcar «contenido alterado o sintético» y «no es para niños».",
        }
        (RAIZ / "upload" / f"{vid}-{estilo}.json").write_text(json.dumps(ficha, ensure_ascii=False, indent=2) + "\n",
                                                             encoding="utf-8")
        print(f"día {dia}: {vid}-{estilo} · {cuando:%a %d/%m %H:%M} · {g['titulo']}")


if __name__ == "__main__":
    main()
