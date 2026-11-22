#!/usr/bin/env python3
"""Datos limpios de T14: ¿cuántos minutos trabajas para desayunar? 2016 frente a hoy (serie «¿Cuántas horas…?», Bruno, 22-11-2026).

Todo oficial (INE):
  · Precio que pagan de media los hogares por kilo, litro o unidad: el «valor unitario» de la EPF (INE), o gasto medio
    por hogar (códigos de 5 dígitos) / cantidad media consumida por hogar cuando eso da más decimales (huevos).
    2016, 2019 y 2025 (último año; la EPF base 2016 empieza en 2016).
  · Sueldo neto por hora: el de T1 (INE, Encuesta Anual de Estructura Salarial; 2025 = EAES 2024 × ETCL 2025/2024;
    neto con el IRPF y las cotizaciones de cada año). Mediana como dato principal y media de contraste
    (docs/metodologia-horas.md).
  · Minutos = precio del paquete / sueldo neto por hora × 60.

Uso: python3 scripts/calcular_t14.py → data/clean/t14_desayuno.json
"""
import json
import pathlib
import re

RAIZ = pathlib.Path(__file__).resolve().parent.parent
RAW, CLEAN = RAIZ / "data" / "raw", RAIZ / "data" / "clean"
ANOS = (2016, 2019, 2025)

# Producto: (nombre en la EPF, paquete del vídeo, cantidad del paquete en la unidad de la EPF)
PRODUCTOS = {
    "cacao": ("Chocolate, cacao y productos a base de cacao", "el kilo de chocolate y cacao", 1.0),
    "huevos": ("Huevos", "la docena de huevos", 12),
    "cafe": ("Café, no en cápsulas y sustitutivos del café", "el paquete de café de 250 g", 0.25),
    "naranjas": ("Cítricos (frescos o refrigerados)", "el kilo de naranjas y otros cítricos", 1.0),
    "zumo": ("Zumos de frutas y/o vegetales sin leche añadida", "el litro de zumo", 1.0),
    "leche": ("Leche entera de origen animal", "el litro de leche entera", 1.0),
    "azucar": ("Azúcar (de caña y remolacha)", "el kilo de azúcar", 1.0),
    "aceite": ("Aceite de oliva", "el litro de aceite de oliva", 1.0),
    "pan": ("Pan", "la barra de pan de 250 g", 0.25),
}


def serie(fichero, nombre, medida):
    for s in json.loads((RAW / fichero).read_text(encoding="utf-8")):
        if s["Nombre"].startswith(f"{nombre}. {medida}"):
            return {x["Anyo"]: x["Valor"] for x in s["Data"]}
    raise SystemExit(f"{fichero}: no encuentro «{nombre}. {medida}»")


def main():
    pct = lambda a, b: round(100 * (b / a - 1), 1)
    t1 = json.loads((CLEAN / "t1_cesta_horas.json").read_text(encoding="utf-8"))
    fila = {f["anyo"]: f for f in t1["filas"]}
    sueldo = {
        "neto_hora_mediana": {str(a): fila[a]["salario_neto_hora_mediana"] for a in ANOS},
        "neto_hora_media": {str(a): fila[a]["salario_neto_hora_media"] for a in ANOS},
        "estado_2025": "C: EAES 2024 × ETCL 2025/2024 (la EAES 2025 aún no está publicada)",
    }
    sueldo["mediana_sube_pct"] = pct(sueldo["neto_hora_mediana"]["2016"], sueldo["neto_hora_mediana"]["2025"])
    sueldo["media_sube_pct"] = pct(sueldo["neto_hora_media"]["2016"], sueldo["neto_hora_media"]["2025"])

    productos = {}
    for k, (nombre, paquete, cant) in PRODUCTOS.items():
        gasto = serie("ine_73781_epf_gasto_5digitos.json", nombre, "Gasto total. Gasto medio por hogar. Precios corrientes")
        cantidad = serie("ine_73844_epf_cantidades.json", nombre, "Cantidad consumida media por hogar")
        vu = serie("ine_73844_epf_cantidades.json", nombre, "Valor unitario")
        # El INE publica el valor unitario con 2 decimales y la cantidad con 1: se usa lo más preciso de cada año.
        # Huevos (0,15 € por huevo): gasto / cantidad (317,0 huevos). Café (4,0 kg al año): el valor unitario (8,87 €/kg).
        precio_u, metodo = {}, {}
        for a in ANOS:
            gc = gasto[a] / cantidad[a]
            err_vu, err_gc = 0.005 / vu[a], 0.05 / cantidad[a] + 0.005 / gasto[a]
            assert abs(gc - vu[a]) <= (err_vu + err_gc) * vu[a] * 1.05, (k, a, gc, vu[a])   # los dos cuadran
            precio_u[str(a)], metodo[str(a)] = (vu[a], "valor unitario del INE") if err_vu <= err_gc else (gc, "gasto / cantidad")
        precio = {a: precio_u[a] * cant for a in precio_u}
        minutos = {a: precio[a] / sueldo["neto_hora_mediana"][a] * 60 for a in precio}
        minutos_media = {a: precio[a] / sueldo["neto_hora_media"][a] * 60 for a in precio}
        productos[k] = {
            "nombre_epf": nombre, "paquete": paquete,
            "precio_unidad_epf_eur": {a: round(v, 3) for a, v in precio_u.items()},
            "valor_unitario_ine": {str(a): vu[a] for a in ANOS},
            "precio_calculado_con": metodo,
            "precio_paquete_eur": {a: round(v, 2) for a, v in precio.items()},
            "minutos_mediana": {a: round(v, 1) for a, v in minutos.items()},
            "minutos_media": {a: round(v, 1) for a, v in minutos_media.items()},
            "precio_sube_pct": pct(precio["2016"], precio["2025"]),
            "minutos_sube_pct": pct(minutos["2016"], minutos["2025"]),
        }
    orden = sorted(productos, key=lambda k: -productos[k]["minutos_sube_pct"])
    out = {
        "tema": "¿Cuántos minutos trabajas para desayunar? 2016 frente a hoy",
        "nota": "Precio = lo que pagan de media los hogares (gasto / cantidad de la EPF del INE), no un precio de catálogo: incluye marcas blancas y ofertas. "
                "Minutos con el sueldo neto mediano por hora de T1. 2025 es el último año de la EPF.",
        "sueldo": sueldo,
        "productos": productos,
        "orden_por_subida_en_minutos": orden,
        "mas_minutos_que_en_2016": [k for k in orden if productos[k]["minutos_sube_pct"] > 5],
        "casi_igual": [k for k in orden if -5 <= productos[k]["minutos_sube_pct"] <= 5],
        "menos_minutos": [k for k in orden if productos[k]["minutos_sube_pct"] < -5],
    }
    CLEAN.mkdir(parents=True, exist_ok=True)
    (CLEAN / "t14_desayuno.json").write_text(json.dumps(out, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    print(f"sueldo neto mediano por hora: {sueldo['neto_hora_mediana']} (+{sueldo['mediana_sube_pct']} %)")
    for k in orden:
        p = productos[k]
        print(f"{k:9} {p['paquete']:38} {p['precio_paquete_eur']['2016']:6.2f} € → {p['precio_paquete_eur']['2025']:6.2f} € (+{p['precio_sube_pct']:5.1f} %) · "
              f"{p['minutos_mediana']['2016']:5.1f} → {p['minutos_mediana']['2025']:5.1f} min ({p['minutos_sube_pct']:+5.1f} %)")


if __name__ == "__main__":
    main()
