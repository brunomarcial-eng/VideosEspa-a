#!/usr/bin/env python3
"""Verificador de guiones (agente «Verificador» de docs/agentes-y-pipeline.md).

Comprueba un videos/<id>/guion.json y, si pasa, escribe videos/<id>/guion.md:
  1. Cada cifra declarada coincide con data/clean/ (mismo redondeo).
  2. Ningún número de voz o pantalla queda sin cifra declarada (salvo años y
     los números de la lista «no_dato», como «16 a 64 años»).
  3. Ninguna cifra en estado P o X.
  4. Todo plano con cifras lleva sello de fuente.
  5. Nada de 2020, ni nombres vetados, ni partidos, ni atribución de causas.
  6. Cierre «¿Mejora, empeora o depende?» y al menos tres años en pantalla.
  7. Duración estimada de la voz entre 45 y 85 s (ritmo tranquilo: cada dato necesita su tiempo).

Uso: python3 scripts/verificar_guion.py videos/t1/guion.json [--ritmo 2.6]
Sale con código 1 si algo falla.
"""
import json
import pathlib
import re
import sys

RAIZ = pathlib.Path(__file__).resolve().parent.parent
RITMO = 2.6  # palabras por segundo de la voz sintética en español (ajustar con el primer render)
PAUSA_TURNO = 0.35  # segundos de pausa cuando cambia quien habla

VETADO = {
    "2020": "año excluido",
    "bruno": "anonimato", "marcial": "anonimato",
    "psoe": "partido", "pp ": "partido", "vox": "partido", "sumar": "partido", "podemos": "partido",
    "gobierno": "atribución política", "gracias a": "atribución de causa",
    "por culpa": "atribución de causa", "debido a": "atribución de causa",
}


# ------------------------------------------------------------ datos
def resolver(datos, ruta):
    actual = datos
    for parte in ruta.split("."):
        m = re.fullmatch(r"(\w+)\[(\w+)=(\w+)\]", parte)
        if m:
            lista, clave, valor = m.groups()
            actual = next(x for x in actual[lista] if str(x[clave]) == valor)
        else:
            actual = actual[parte]
    return actual


def valor_cifra(datos, c):
    if c.get("op") == "var_pct":
        a, b = (resolver(datos, r) for r in c["rutas"])
        v = 100 * (b / a - 1)
    elif c.get("op") == "resta":
        a, b = (resolver(datos, r) for r in c["rutas"])
        v = b - a
    else:
        v = resolver(datos, c["ruta"])
    return v * c.get("escala", 1)


def es_num(v, dec):
    return f"{v:.{dec}f}".replace(".", ",")


# ------------------------------------------------------------ duración
def palabras_entero(n):
    if n < 30:
        return 1
    if n < 100:
        return 1 if n % 10 == 0 else 3
    if n < 1000:
        return 1 + (palabras_entero(n % 100) if n % 100 else 0)
    m, r = divmod(n, 1000)
    return (0 if m == 1 else palabras_entero(m)) + 1 + (palabras_entero(r) if r else 0)


def palabras_habladas(texto):
    total = 0
    for tok in texto.split():
        nums = re.findall(r"\d+(?:,\d+)?", tok)
        if not nums:
            total += 1 if re.search(r"\w", tok) else 0
            continue
        for n in nums:
            ent, _, dec = n.partition(",")
            total += palabras_entero(int(ent)) + ((1 + palabras_entero(int(dec))) if dec else 0)
        if "%" in tok:
            total += 2
    return total


# ------------------------------------------------------------ verificación
def verificar(ruta_guion, ritmo=RITMO):
    g = json.loads(pathlib.Path(ruta_guion).read_text(encoding="utf-8"))
    datos = json.loads((RAIZ / g["datos"]).read_text(encoding="utf-8"))
    fallos, avisos, filas_cifras = [], [], []

    texto_total = " ".join(b["voz"] + " " + b["pantalla"] + " " + b.get("nota", "") for b in g["beats"])

    # 1 y 3: cifras
    declaradas = set()
    for c in g["cifras"]:
        v = valor_cifra(datos, c)
        if c.get("estado") in ("P", "X"):
            fallos.append(f"cifra «{c['texto']}» en estado {c['estado']}")
        if "aprox" in c:
            ok = abs(v - c["aprox"]) <= c["aprox"] * c.get("tolerancia_pct", 5) / 100
            leido = f"{v:.1f} (dicho «{c['texto']}» ≈ {c['aprox']})"
        else:
            leido = es_num(v, c.get("decimales", 0))
            ok = leido == c["texto"]
            declaradas.add(c["texto"])
        if not ok:
            fallos.append(f"cifra «{c['texto']}» no cuadra con los datos: {leido}")
        if c["texto"] not in texto_total:
            fallos.append(f"cifra «{c['texto']}» declarada pero no aparece en voz ni pantalla")
        filas_cifras.append((c["texto"], leido, c.get("estado"), c.get("ruta") or f"{c['op']}({', '.join(c['rutas'])})"))

    # 2 y 4: números sin declarar y sellos
    permitidos = set(g.get("no_dato", []))
    for b in g["beats"]:
        nums = re.findall(r"\d+(?:,\d+)?", b["voz"] + " " + b["pantalla"] + " " + b.get("nota", ""))
        datos_b = [n for n in nums if not (len(n) == 4 and n.startswith("20")) and n not in permitidos]
        for n in datos_b:
            if n not in declaradas:
                fallos.append(f"plano {b['n']}: el número «{n}» no tiene cifra declarada")
        if datos_b and not b.get("sello"):
            fallos.append(f"plano {b['n']}: tiene cifras y no lleva sello de fuente")
        # Pocas cifras por imagen: 2, o 3 si el plano es un gráfico.
        en_pantalla = [n for n in re.findall(r"\d+(?:,\d+)?", b["pantalla"])
                       if not (len(n) == 4 and n.startswith("20")) and n not in permitidos]
        maximo = 3 if b.get("grafico") else 2
        if len(en_pantalla) > maximo:
            fallos.append(f"plano {b['n']}: {len(en_pantalla)} cifras en pantalla (máximo {maximo})")

    # 5: vetados
    todo = (texto_total + " " + " ".join(b.get("sello") or "" for b in g["beats"])).lower() + " "
    for palabra, motivo in VETADO.items():
        if palabra in todo:
            fallos.append(f"contiene «{palabra.strip()}» ({motivo})")
    if "2021" in todo and "rebote" not in todo:
        fallos.append("usa 2021 sin marcarlo como año de rebote")

    # 6: cierre y años
    if not any("mejora, empeora o depende?" in b["voz"].lower() for b in g["beats"]):
        fallos.append("falta el cierre «¿Mejora, empeora o depende?» en la voz")
    anyos = sorted(set(re.findall(r"\b20\d\d\b", texto_total)))
    if len(anyos) < 3:
        fallos.append(f"solo aparecen {len(anyos)} años: {anyos}")

    # 7: duración
    tiempos, t, previo = [], 0.0, None
    for b in g["beats"]:
        if previo is not None and b.get("quien") != previo:
            t += PAUSA_TURNO
        previo = b.get("quien")
        d = palabras_habladas(b["voz"]) / ritmo
        tiempos.append((t, t + d))
        t += d
    if not 45 <= t <= 85:
        fallos.append(f"duración estimada {t:.0f} s (debe estar entre 45 y 85)")

    return g, fallos, avisos, filas_cifras, tiempos, t, anyos


def a_markdown(g, filas_cifras, tiempos, total, anyos, ritmo):
    l = [f"# Guion {g['id'].upper()} — {g['titulo']}", "",
         f"Pregunta: {g['pregunta']}  ",
         f"Datos: `{g['datos']}` · {g['aprobacion_datos']}  ",
         f"Duración estimada de la voz: **{total:.0f} s** (a {ritmo} palabras/s) · Años en pantalla: {', '.join(anyos)}  ",
         "Un solo guion para los tres estilos (A pizarra, B cápsula, C baraja). La columna «Imagen» es la idea del plano; cada estilo la dibuja a su manera en el Paso 3.",
         "", "| # | Tiempo | Quién | Voz | En pantalla | Sello de fuente | Imagen |", "|---|---|---|---|---|---|---|"]
    quien = {k: f"{k} ({v['anyo']})" for k, v in g.get("personajes", {}).items()}
    for b, (a, z) in zip(g["beats"], tiempos):
        pant = b["pantalla"] + (f" <br>_{b['nota']}_" if b.get("nota") else "")
        l.append(f"| {b['n']} | {a:.0f}-{z:.0f} s | {quien.get(b.get('quien'), b.get('quien', 'voz'))} | {b['voz']} | {pant} | "
                 f"{b.get('sello') or '—'} | {b['imagen']} |")
    l += ["", f"**Cierre:** {g['cierre']['veredicto']}. {g['cierre']['porque']}", "",
          "## Cifras verificadas contra los datos", "", "| En el guion | Valor en los datos | Estado | Origen |", "|---|---|---|---|"]
    for texto, leido, estado, origen in filas_cifras:
        l.append(f"| {texto} | {leido} | {estado} | `{origen}` |")
    l += ["", "Generado por `scripts/verificar_guion.py`. No editar a mano: se edita `guion.json` y se vuelve a ejecutar.", ""]
    return "\n".join(l)


def main(argv):
    if len(argv) < 2:
        print(__doc__)
        return 2
    ritmo = float(argv[argv.index("--ritmo") + 1]) if "--ritmo" in argv else RITMO
    ruta = pathlib.Path(argv[1])
    g, fallos, avisos, filas, tiempos, total, anyos = verificar(ruta, ritmo)
    print(f"{g['id']}: duración estimada {total:.1f} s · {len(g['cifras'])} cifras · años {anyos}")
    for a in avisos:
        print("AVISO:", a)
    if fallos:
        print("FALLA:\n- " + "\n- ".join(fallos))
        return 1
    ruta.with_name("guion.md").write_text(a_markdown(g, filas, tiempos, total, anyos, ritmo), encoding="utf-8")
    print("PASA. Escrito", ruta.with_name("guion.md"))
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
