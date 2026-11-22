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

  · Tostada de moda (aguacate, queso crema y salmón ahumado), con receta declarada y precios medios de cada grupo de la EPF.
  · Desayunar en el bar: IPC de la restauración (INE, rúbricas, media anual) frente al sueldo neto por hora.

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
    # Tabla del sueldo para el vídeo (Bruno, 22-11-2026: que se vea en qué sueldo se basan los minutos).
    # Bruto anual mediano (INE, EAES; 2025 = EAES 2024 × ETCL 2025/2024), neto anual con la relación neto / bruto de T1.
    sueldo["bruto_anual_mediano"] = {str(a): round(fila[a]["ganancia_anual_mediana"]) for a in (2016, 2024, 2025)}
    sueldo["neto_anual_mediano"] = {str(a): round(fila[a]["ganancia_anual_mediana"] * fila[a]["ratio_neto_bruto_mediana"]) for a in (2016, 2025)}
    ipc = {a: fila[a]["ipc_general_media_anual"] for a in (2016, 2025)}
    sueldo["neto_anual_2016_en_euros_de_2025"] = round(sueldo["neto_anual_mediano"]["2016"] * ipc[2025] / ipc[2016])
    sueldo["neto_real_sube_pct"] = pct(sueldo["neto_anual_2016_en_euros_de_2025"], sueldo["neto_anual_mediano"]["2025"])

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

    # Desayuno de moda: tostada de aguacate, queso crema y salmón ahumado (receta declarada; precios medios de cada grupo de la EPF).
    # La EPF no separa el aguacate (va con el mango y otras tropicales) ni el salmón ahumado (va con otros pescados ahumados o salados).
    receta = {"pan": ("Pan", 0.05), "aguacate": ("Aguacate, mango y otras frutas tropicales (frescas o refrigeradas)", 0.08),
              "queso_crema": ("Queso y requesón de origen animal y no animal", 0.025),
              "salmon": ("Pescados y mariscos secos, salados, en salmuera o ahumados", 0.03)}
    tost = {"receta_kg": {k: v[1] for k, v in receta.items()}, "grupo_epf": {k: v[0] for k, v in receta.items()}, "precio_kg": {}, "subida_precio_grupo_pct": {}}
    coste = {str(a): 0.0 for a in ANOS}
    for k, (nombre, kg) in receta.items():
        vu = serie("ine_73844_epf_cantidades.json", nombre, "Valor unitario")
        tost["precio_kg"][k] = {str(a): vu[a] for a in ANOS}
        tost["subida_precio_grupo_pct"][k] = pct(vu[2016], vu[2025])
        for a in ANOS:
            coste[str(a)] += vu[a] * kg
    tost["precio_eur"] = {a: round(v, 2) for a, v in coste.items()}
    tost["minutos_mediana"] = {a: round(coste[a] / sueldo["neto_hora_mediana"][a] * 60, 1) for a in coste}
    tost["precio_sube_pct"] = pct(coste["2016"], coste["2025"])
    tost["minutos_sube_pct"] = pct(coste["2016"] / sueldo["neto_hora_mediana"]["2016"], coste["2025"] / sueldo["neto_hora_mediana"]["2025"])

    # Desayunar en el bar: el INE no da un precio en euros del café con churros o con tostada; da el IPC de la restauración
    # (bares, cafeterías y restaurantes). Tiempo de trabajo: subida de los precios frente a la del sueldo neto por hora.
    for s_ in json.loads((RAW / "ine_50936_ipc_rubricas_media_anual.json").read_text(encoding="utf-8")):
        if s_["Nombre"].startswith("Nacional. Restauración. Media anual"):
            rest = {x["Anyo"]: x["Valor"] for x in s_["Data"]}
    bar = {"ipc_restauracion_media_anual": {str(a): rest[a] for a in ANOS}, "precios_suben_pct": pct(rest[2016], rest[2025])}
    bar["tiempo_sube_pct"] = round(100 * ((rest[2025] / rest[2016]) / (sueldo["neto_hora_mediana"]["2025"] / sueldo["neto_hora_mediana"]["2016"]) - 1), 1)
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
        "tostada_aguacate_salmon": tost,
        "bar": bar,
    }
    CLEAN.mkdir(parents=True, exist_ok=True)
    (CLEAN / "t14_desayuno.json").write_text(json.dumps(out, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    print(f"sueldo neto mediano por hora: {sueldo['neto_hora_mediana']} (+{sueldo['mediana_sube_pct']} %)")
    print(f"bruto anual {sueldo['bruto_anual_mediano']} · neto anual {sueldo['neto_anual_mediano']} · neto 2016 en € de 2025 {sueldo['neto_anual_2016_en_euros_de_2025']} ({sueldo['neto_real_sube_pct']:+} %)")
    print(f"tostada: {tost['precio_eur']} € · {tost['minutos_mediana']} min ({tost['minutos_sube_pct']:+} %) · grupos {tost['subida_precio_grupo_pct']}")
    print(f"bar: precios {bar['precios_suben_pct']:+} % · tiempo {bar['tiempo_sube_pct']:+} %")
    for k in orden:
        p = productos[k]
        print(f"{k:9} {p['paquete']:38} {p['precio_paquete_eur']['2016']:6.2f} € → {p['precio_paquete_eur']['2025']:6.2f} € (+{p['precio_sube_pct']:5.1f} %) · "
              f"{p['minutos_mediana']['2016']:5.1f} → {p['minutos_mediana']['2025']:5.1f} min ({p['minutos_sube_pct']:+5.1f} %)")


if __name__ == "__main__":
    main()
