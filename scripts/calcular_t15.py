#!/usr/bin/env python3
"""Datos limpios de T15: ¿cuántas horas trabajas para la cena de Nochebuena? 2016 frente a hoy (serie «¿Cuántas horas…?», Bruno, 22-11-2026).

Todo oficial (INE):
  · Precios: lo que pagan de media los hogares por kilo o litro (EPF base 2016, «valor unitario»), 2016, 2019 y 2025 (último año).
    La EPF no separa el cordero (va con el cabrito: «ovino y caprino») ni las gambas y langostinos (van con el resto del
    marisco fresco): se dice en pantalla.
  · Cena para cuatro con cantidades declaradas (receta), igual en los dos años.
  · Turrón y dulces de Navidad: el INE no da precio en euros; sí el IPC de «azúcar, confitura, miel, chocolate y confitería».
    Juguetes: IPC de «juegos, juguetes y aficiones». Se dan como «más o menos tiempo de trabajo» (subida del precio frente
    a la del sueldo neto por hora).
  · Sueldo: el de T1 y T14 (neto mediano por hora del INE; 2025 = EAES 2024 × ETCL 2025/2024).

Uso: python3 scripts/calcular_t15.py → data/clean/t15_navidad.json
"""
import json
import pathlib

RAIZ = pathlib.Path(__file__).resolve().parent.parent
RAW, CLEAN = RAIZ / "data" / "raw", RAIZ / "data" / "clean"
ANOS = (2016, 2019, 2025)

# Plato: (grupo de la EPF, kilos o litros para cuatro, cómo se dice)
CENA = {
    "cordero": ("Carne de ovino y caprino", 1.5, "una pierna de cordero de kilo y medio"),
    "marisco": ("Mariscos frescos o refrigerados", 1.0, "un kilo de marisco fresco"),
    "jamon": ("Charcutería y carne seca, salada o ahumada", 0.3, "300 g de jamón y embutido"),
    "queso": ("Queso y requesón de origen animal y no animal", 0.3, "300 g de queso"),
    "vino": ("Vinos de uva", 1.5, "dos botellas de vino"),
}


def vu(nombre):
    for s in json.loads((RAW / "ine_73844_epf_cantidades.json").read_text(encoding="utf-8")):
        if s["Nombre"].startswith(f"{nombre}. Valor unitario"):
            return {x["Anyo"]: x["Valor"] for x in s["Data"]}
    raise SystemExit(f"EPF sin valor unitario de «{nombre}»")


def ipc(rubrica):
    for s in json.loads((RAW / "ine_50936_ipc_rubricas_media_anual.json").read_text(encoding="utf-8")):
        if s["Nombre"].startswith(f"Nacional. {rubrica}. Media anual"):
            return {x["Anyo"]: x["Valor"] for x in s["Data"]}
    raise SystemExit(f"IPC sin la rúbrica «{rubrica}»")


def main():
    pct = lambda a, b: round(100 * (b / a - 1), 1)
    t14 = json.loads((CLEAN / "t14_desayuno.json").read_text(encoding="utf-8"))
    sueldo = {k: t14["sueldo"][k] for k in ("neto_hora_mediana", "bruto_anual_mediano", "neto_anual_mediano", "mediana_sube_pct", "neto_real_sube_pct", "estado_2025")}
    h = sueldo["neto_hora_mediana"]
    sube_sueldo = h["2025"] / h["2016"]

    platos, total = {}, {str(a): 0.0 for a in ANOS}
    for k, (grupo, cant, dicho) in CENA.items():
        v = vu(grupo)
        eur = {str(a): v[a] * cant for a in ANOS}
        for a in eur:
            total[a] += eur[a]
        platos[k] = {"grupo_epf": grupo, "cantidad": cant, "dicho": dicho, "precio_kg_o_l": {str(a): v[a] for a in ANOS},
                     "eur": {a: round(x, 2) for a, x in eur.items()},
                     "minutos": {a: round(eur[a] / h[a] * 60, 1) for a in eur},
                     "precio_sube_pct": pct(eur["2016"], eur["2025"]),
                     "minutos_sube_pct": pct(eur["2016"] / h["2016"], eur["2025"] / h["2025"])}
    cena = {"eur": {a: round(x, 2) for a, x in total.items()},
            "minutos": {a: round(total[a] / h[a] * 60) for a in total},
            "precio_sube_pct": pct(total["2016"], total["2025"]),
            "minutos_sube_pct": pct(total["2016"] / h["2016"], total["2025"] / h["2025"])}
    cena["horas_y_minutos"] = {a: f"{m // 60} h {m % 60:02d} min" for a, m in cena["minutos"].items()}
    cena["minutos_mas"] = cena["minutos"]["2025"] - cena["minutos"]["2016"]

    relativos = {}
    for k, rub in (("dulces", "Azúcar, confitura, miel, chocolate y confitería"), ("juguetes", "Juegos, juguetes y aficiones")):
        i = ipc(rub)
        relativos[k] = {"rubrica_ipc": rub, "ipc_media_anual": {str(a): i[a] for a in ANOS}, "precio_sube_pct": pct(i[2016], i[2025]),
                        "tiempo_sube_pct": round(100 * ((i[2025] / i[2016]) / sube_sueldo - 1), 1)}

    out = {
        "tema": "¿Cuántas horas trabajas para la cena de Nochebuena? 2016 frente a hoy",
        "nota": "Cena para cuatro con las mismas cantidades en los dos años. Precio = lo que pagan de media los hogares (EPF del INE), con marcas blancas y ofertas. "
                "Horas con el sueldo neto mediano por hora (T1 y T14). 2025 es el último año de la EPF.",
        "sueldo": sueldo, "platos": platos, "cena": cena, "relativos": relativos,
        "orden_por_subida_en_minutos": sorted(platos, key=lambda k: -platos[k]["minutos_sube_pct"]),
    }
    CLEAN.mkdir(parents=True, exist_ok=True)
    (CLEAN / "t15_navidad.json").write_text(json.dumps(out, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    print(f"cena para cuatro: {cena['eur']} € · {cena['horas_y_minutos']} ({cena['minutos_sube_pct']:+} % de tiempo, +{cena['minutos_mas']} min)")
    for k in out["orden_por_subida_en_minutos"]:
        p = platos[k]
        print(f"  {k:8} {p['eur']['2016']:6.2f} → {p['eur']['2025']:6.2f} € · {p['minutos']['2016']:6.1f} → {p['minutos']['2025']:6.1f} min ({p['minutos_sube_pct']:+5.1f} %)")
    for k, r in relativos.items():
        print(f"  {k}: precio {r['precio_sube_pct']:+} % · tiempo {r['tiempo_sube_pct']:+} %")


if __name__ == "__main__":
    main()
