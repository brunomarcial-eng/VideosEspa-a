#!/usr/bin/env python3
"""Datos limpios de T10: montar un bar en Madrid en 1986, 2006 y hoy (Bruno, 20-11-2026).

Lo que pide Bruno: dejar claro, sin ambigüedad, que hoy hay muchos más trámites, obligaciones, impuestos y costes que en 1986.
Cada obligación lleva la norma que la creó (BOE) y el año, y el script comprueba que la frase clave está en el texto oficial
(data/raw/boe_t10_*.html). Los costes salen de las normas de cada año (BOE) y del motor de T8.

Uso: python3 scripts/calcular_t10.py → data/clean/t10_bar.json
"""
import html
import json
import pathlib
import re

RAIZ = pathlib.Path(__file__).resolve().parent.parent
RAW, CLEAN = RAIZ / "data" / "raw", RAIZ / "data" / "clean"

# Obligación, desde cuándo se exige, norma, fichero del BOE y frase que tiene que aparecer en él.
OBLIGACIONES = [
    ("Evaluación de riesgos laborales y plan de prevención", 1996, "Ley 31/1995 de Prevención de Riesgos Laborales",
     "BOE-A-1995-24292", "la evaluación inicial de los riesgos inherentes al trabajo"),
    ("Autocontrol de higiene de los alimentos (APPCC)", 1996, "Real Decreto 2207/1995 de higiene de los productos alimenticios",
     "BOE-A-1996-4449", "dichas empresas deberán realizar actividades de autocontrol"),
    ("Seguro obligatorio de incendio y responsabilidad civil", 1998, "Ley 17/1997 de Espectáculos Públicos y Actividades Recreativas de la Comunidad de Madrid",
     "BOE-A-1998-9648", "Los locales y establecimientos deberán tener suscrito contrato de seguro"),
    ("Protección de datos personales", 2000, "Ley Orgánica 15/1999; hoy, Ley Orgánica 3/2018 y el Reglamento europeo",
     "BOE-A-1999-23750", "Protección de Datos de Carácter Personal"),
    ("Prohibido fumar en el local", 2011, "Ley 28/2005 (en parte) y Ley 42/2010 (en toda la hostelería)",
     "BOE-A-2010-20138", "trabajadores del sector de la hostelería"),
    ("Información de alérgenos de todo lo que se sirve", 2015, "Real Decreto 126/2015 (y Reglamento europeo 1169/2011)",
     "BOE-A-2015-2293", "siempre debe facilitarse al consumidor la información sobre los alérgenos potenciales"),
    ("Registro diario de la jornada de cada empleado", 2019, "Real Decreto-ley 8/2019",
     "BOE-A-2019-3481", "La empresa garantizará el registro diario de jornada"),
    ("Registro de los sueldos de toda la plantilla", 2021, "Real Decreto 902/2020 de igualdad retributiva",
     "BOE-A-2020-12215", "todas las empresas deben tener un registro retributivo de toda su plantilla"),
    ("Medidas y procedimiento contra el acoso sexual", 2022, "Ley Orgánica 10/2022, artículo 12",
     "BOE-A-2022-14630", "Las empresas deberán promover condiciones de trabajo que eviten la comisión de delitos"),
    ("Ofrecer agua del grifo gratis", 2022, "Ley 7/2022 de residuos, artículo 18",
     "BOE-A-2022-5809", "la posibilidad de consumo de agua no envasada de manera gratuita"),
    ("Impuesto sobre los envases de plástico", 2023, "Ley 7/2022 de residuos",
     "BOE-A-2022-5809", "Impuesto especial sobre los envases de plástico no reutilizables"),
    ("Cotización nueva de equidad intergeneracional (MEI)", 2023, "Real Decreto-ley 2/2023",
     "BOE-A-2023-6967", "nuevo mecanismo para la preservación de la equidad intergeneracional"),
    ("Cuota de autónomo según lo que ganes, con regularización", 2023, "Real Decreto-ley 13/2022",
     "BOE-A-2022-12482", "nuevo sistema de cotización para los trabajadores por cuenta propia o autónomos"),
    ("Tasa de basuras obligatoria en todos los ayuntamientos", 2025, "Ley 7/2022 de residuos, artículo 11",
     "BOE-A-2022-5809", "las entidades locales establecerán, en el plazo de tres años a contar desde la entrada en vigor de esta ley, una tasa"),
    ("Dejar llevarse lo que no se come, sin cobrar", 2025, "Ley 1/2025 de prevención de las pérdidas y el desperdicio alimentario",
     "BOE-A-2025-6597", "tendrán la obligación de facilitar al consumidor que pueda llevarse, sin coste adicional"),
    ("Programa de facturación que vigila Hacienda (VERI*FACTU)", 2027, "Real Decreto 1007/2023 y Real Decreto-ley 15/2025 (autónomos, desde el 1-7-2027)",
     "BOE-A-2025-24446", "y para el resto de los obligados del artículo 3.1: 1 de julio de 2027"),
]

_cache = {}


def texto(boe_id):
    if boe_id not in _cache:
        t = (RAW / f"boe_t10_{boe_id}.html").read_text(encoding="utf-8", errors="ignore")
        _cache[boe_id] = re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", t)))
    return _cache[boe_id]


def main():
    obl = []
    for nombre, desde, norma, boe, frase in OBLIGACIONES:
        if frase not in texto(boe):
            raise SystemExit(f"no encuentro «{frase}» en {boe}")
        obl.append({"obligacion": nombre, "desde": desde, "norma": norma, "boe": boe, "frase_comprobada": frase})
    n = lambda a: sum(1 for o in obl if o["desde"] <= a)
    t8 = json.loads((CLEAN / "t8_impuestos_sueldo.json").read_text(encoding="utf-8"))
    caj = t8["casos"]["cajero"]
    out = {
        "tema": "T10 — montar un bar en Madrid en 1986, 2006 y hoy: obligaciones, impuestos y costes",
        "obligaciones": obl,
        "cuantas": {"1986": n(1986), "2006": n(2006), "2026": n(2026), "2027": n(2027), "nuevas_desde_1986": n(2027), "nuevas_desde_2006": n(2027) - n(2006)},
        "camarero_salario_minimo": {
            a: {"coste_empresa_en_euros_de_2026": caj[a]["en_euros_de_2026"]["coste_empresa"], "al_estado_pct": caj[a]["pct_estado_del_coste"]}
            for a in ("1986", "2006", "2026")},
        "iva_bar_pct": t8["iva_pct"]["bar_y_restaurante"],
        "nota": ("Cada obligación se comprueba contra el texto del BOE (data/raw/boe_t10_*.html). «desde» = primer año en que se exige a un bar "
                 "(la ley de prevención de riesgos entró en vigor en 1996; la de protección de datos de 1999, en 2000; el registro retributivo, en 2021; "
                 "la tasa de basuras, en abril de 2025, tres años después de la Ley 7/2022; el programa de facturación, en 2027). Camarero: salario "
                 "mínimo de cada año y cotizaciones del BOE (motor de T8, tarifa de accidentes del comercio)."),
    }
    c = out["camarero_salario_minimo"]
    out["camarero_sube_pct"] = {a: round(100 * (c["2026"]["coste_empresa_en_euros_de_2026"] / c[a]["coste_empresa_en_euros_de_2026"] - 1), 1) for a in ("1986", "2006")}
    (CLEAN / "t10_bar.json").write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding="utf-8")
    for o in obl:
        print(o["desde"], o["obligacion"], "·", o["norma"])
    print(out["cuantas"], out["camarero_sube_pct"], out["iva_bar_pct"])


if __name__ == "__main__":
    main()
