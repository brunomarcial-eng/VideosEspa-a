#!/usr/bin/env python3
"""Comprueba el contraste WCAG de cada pareja de colores de diseno/tokens.json.

Umbrales (WCAG 2.x):
  texto  >= 4,5:1 (AA texto normal; la identidad lo exige a todo el texto)
  grafico >= 3,0:1 (AA para elementos gráficos y texto muy grande)

Uso:
  python3 scripts/contraste.py                 # informe; sale con 1 si algo falla
  python3 scripts/contraste.py --proponer      # además propone el tono más cercano que pasa
Escribe el informe en diseno/contraste.md.
"""
import colorsys
import json
import pathlib
import sys

RAIZ = pathlib.Path(__file__).resolve().parent.parent
TOKENS = RAIZ / "diseno" / "tokens.json"
UMBRAL = {"texto": 4.5, "grafico": 3.0}


def lum(hexcol: str) -> float:
    h = hexcol.lstrip("#")
    r, g, b = (int(h[i:i + 2], 16) / 255 for i in (0, 2, 4))
    f = lambda c: c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)


def ratio(a: str, b: str) -> float:
    la, lb = sorted([lum(a), lum(b)], reverse=True)
    return (la + 0.05) / (lb + 0.05)


def proponer(color: str, fondo: str, minimo: float) -> str:
    """Tono más cercano (misma tonalidad y saturación) que alcanza el mínimo."""
    h = color.lstrip("#")
    r, g, b = (int(h[i:i + 2], 16) / 255 for i in (0, 2, 4))
    hh, ll, ss = colorsys.rgb_to_hls(r, g, b)
    oscuro = lum(fondo) > 0.18
    for paso in range(1, 101):
        l2 = max(0.0, ll - paso / 100) if oscuro else min(1.0, ll + paso / 100)
        rr, gg, bb = colorsys.hls_to_rgb(hh, l2, ss)
        cand = "#{:02X}{:02X}{:02X}".format(round(rr * 255), round(gg * 255), round(bb * 255))
        if ratio(cand, fondo) >= minimo:
            return cand
    return "(ninguno)"


def main(argv):
    t = json.loads(TOKENS.read_text(encoding="utf-8"))
    col = t["colores"]
    lineas = ["# Contraste de la paleta (WCAG)", "",
              "Generado por `scripts/contraste.py` desde `diseno/tokens.json`. Texto ≥ 4,5:1; gráficos ≥ 3:1.", ""]
    fallos = 0
    for estilo, pares in t["parejas"].items():
        lineas += [f"## {estilo}", "", "| Primer plano | Fondo | Uso | Contraste | Mínimo | Resultado |", "|---|---|---|---|---|---|"]
        for fg, bg, uso in pares:
            r = ratio(col[fg], col[bg])
            ok = r >= UMBRAL[uso]
            fallos += not ok
            extra = ""
            if not ok and "--proponer" in argv:
                extra = f" → propuesta {proponer(col[fg], col[bg], UMBRAL[uso])}"
            lineas.append(f"| {fg} `{col[fg]}` | {bg} `{col[bg]}` | {uso} | {r:.2f}:1 | {UMBRAL[uso]}:1 | "
                          f"{'PASA' if ok else 'FALLA' + extra} |")
        lineas.append("")
    (RAIZ / "diseno" / "contraste.md").write_text("\n".join(lineas), encoding="utf-8")
    print("\n".join(lineas))
    print(f"\n{'TODO PASA' if not fallos else f'{fallos} pareja(s) fallan'}")
    return 1 if fallos else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
