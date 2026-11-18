#!/usr/bin/env python3
"""Datos limpios de T8 (¿cuánto de tu sueldo se queda el Estado? 1986, 2006 y 2026).

Dos trabajadores solteros, sin hijos, con contrato indefinido y sin otras rentas:
  · Un cajero de supermercado con el salario mínimo de cada año (14 pagas).
  · Un empleado de banca (oficial administrativo) que gana 40.000 € brutos en 2026; para 1986 y 2006,
    ese mismo sueldo pasado a precios de cada año con el IPC del INE.

Para cada uno se calcula, con las normas del BOE de cada año (cálculo propio, estado C):
  · Cotizaciones del trabajador y de la empresa (contingencias comunes, desempleo, FOGASA, formación
    profesional, accidentes de trabajo y, en 2026, el mecanismo de equidad intergeneracional).
  · IRPF de un año completo (1986: Ley 44/1978 reformada por la Ley 48/1985; 2006: texto refundido de 2004
    con las escalas de la Ley 30/2005; 2026: Ley 35/2006 con la escala autonómica de la Comunidad de Madrid).
  · Lo que cuesta a la empresa, lo que cobra el trabajador y la parte que va al Estado (cuña fiscal):
    (IRPF + cotizaciones del trabajador + cotizaciones de la empresa) / (sueldo bruto + cotizaciones de la empresa).

Cada parámetro se comprueba contra el fichero oficial de data/raw (la frase tiene que aparecer en el BOE).
Uso: python3 scripts/calcular_t8.py → data/clean/t8_impuestos_sueldo.json
"""
import html
import json
import pathlib
import re
import subprocess
import sys

RAIZ = pathlib.Path(__file__).resolve().parent.parent
RAW, CLEAN = RAIZ / "data" / "raw", RAIZ / "data" / "clean"
sys.path.insert(0, str(RAIZ / "scripts"))
from calcular_t3 import ipc_largo  # noqa: E402  (IPC del INE enlazado desde 1961)

PTS = 166.386  # pesetas por euro (tipo fijo de conversión)
_textos = {}


def texto(nombre):
    if nombre not in _textos:
        f = RAW / nombre
        if f.suffix == ".pdf":   # las dos lecturas: por columnas (texto corrido) y con la maqueta (tablas)
            t = " ".join(subprocess.run(["pdftotext", *op, str(f), "-"], capture_output=True, text=True).stdout for op in ([], ["-layout"]))
            t = t.replace("\xad ", "").replace("\xad", "")
        else:
            t = html.unescape(re.sub(r"<[^>]+>", " ", f.read_text(encoding="utf-8", errors="ignore")))
        _textos[nombre] = re.sub(r"\s+", " ", t)
    return _textos[nombre]


def comprueba(nombre, *frases):
    """Cada frase (con los espacios normalizados) tiene que estar en el fichero oficial."""
    t = texto(nombre)
    for f in frases:
        if re.sub(r"\s+", " ", f) not in t:
            raise SystemExit(f"no encuentro «{f}» en {nombre}")


def escala(base, tramos):
    """tramos: [(desde, tipo %), …] en orden; impuesto por tramos."""
    cuota = 0.0
    for i, (desde, tipo) in enumerate(tramos):
        hasta = tramos[i + 1][0] if i + 1 < len(tramos) else float("inf")
        if base > desde:
            cuota += (min(base, hasta) - desde) * tipo / 100
    return cuota


# ------------------------------------------------------------------ normas de cada año
def normas():
    n = {}
    # ---- 1986 (pesetas)
    f, o, l = "boe_rd_2474_2475_1985_smi_cotizacion_1986.pdf", "boe_orden_28_01_1986_cotizacion.pdf", "boe_ley_48_1985_irpf.pdf"
    comprueba(f, "40.140 pesetas/mes", "será de 247.590 pesetas mensuales")
    comprueba(f, "Oficiales Administrativos . 46.830 146.070")
    comprueba(o, "el 28,8 por 100, del que el 24 por 100 será a cargo de la Empresa, y el 4,8 por 100 a cargo del trabajador",
              "Desempleo: El 6,3 por 100, del que el 5,2 por 100 será a cargo de la Empresa y el 1,1 por 100 a cargo del trabajador",
              "Fondo de Garantía Salarial: El 1,1 por 100 a cargo de la Empresa",
              "0,60 por 100 será a cargo de la empresa y el 0,10 por 100 a cargo del trabajador",
              "reducida linealmente, en un 10 por 100, la tarifa de primas aprobada por Real Decreto 2930/1979")
    comprueba("boe_rd_2930_1979_tarifa_accidentes.pdf", "Empleados de comercio en general", "1,20 0,80 2,00")
    comprueba("boe_rd_2930_1979_tarifa_accidentes.pdf", "dos de oficina en general, no especificados en otros epígrafes")
    comprueba(l, "A) Con carácter general: 17.000 pesetas", "se deducirá la cantidad fija de 20.000 pesetas",
              "La cantidad que resulte de aplicar el 2 por 100 sobre el importe de los ingresos íntegros en concepto de gastos de difícil justificación")
    # Escala de 1986 (art. 28 de la Ley 44/1978, redactado por la Ley 48/1985): tramos desde, tipo marginal.
    esc86 = [(0, 8.00), (500_000, 16.85), (600_000, 21.29), (800_000, 27.20), (1_000_000, 33.10), (1_200_000, 22.13),
             (1_400_000, 23.74), (1_800_000, 25.90), (2_200_000, 28.06), (2_600_000, 30.22), (3_000_000, 32.38)]
    comprueba(l, "56.858", "99.442", "153.843", "220.060", "264.320", "359.280", "462.880", "575.120")
    n["1986"] = {
        "moneda": "pesetas", "smi_mes": 40_140, "pagas": 14,
        "cc": (24.0, 4.8), "desempleo": (5.2, 1.1), "fogasa": (1.1, 0.0), "fp": (0.6, 0.1), "mei": (0.0, 0.0),
        "at_ep": {"cajero": round(2.00 * 0.9, 3), "banca": round(1.10 * 0.9, 3)},
        "base_cc_min_mes": 46_830, "base_cc_max_mes_grupo5": 146_070, "tope_mes": 247_590,
        "irpf": {"escala": esc86, "gastos_pct": 2.0, "deducciones": 17_000 + 20_000},
    }
    # ---- 2006 (euros)
    comprueba("boe_rd_1613_2005_smi_2006.html", "540,90 euros/mes")
    o6, r6 = "boe_orden_tas_29_2006_cotizacion.html", "boe_rdl_5_2006_cotizacion_julio.html"
    comprueba(o6, "el 28,30 por 100, del que el 23,60 por 100 será a cargo de la empresa, y el 4,70 por 100 a cargo del trabajador",
              "7,55 por 100, del que el 6,00 por 100 será a cargo de la empresa y el 1,55 por 100 a cargo del trabajador",
              "2.2 Fondo de Garantía Salarial: el 0,40 por 100, a cargo de la empresa",
              "reducidos en un 10 por 100, los porcentajes de la tarifa de primas aprobada por el Real Decreto 2930/1979",
              "de 2.897,70 euros mensuales")
    comprueba(r6, "el 7,30 por ciento, del que el 5,75 por ciento será a cargo del empresario y el 1,55 por ciento a cargo del trabajador",
              "el 0,20 por ciento a cargo exclusivo de la empresa")
    l30, tr = "boe_ley_30_2005_pge_2006.html", "boe_rdleg_3_2004_irpf.html"
    comprueba(l30, "0,00 0,00 4.161,60 9,06 4.161,60 377,04 10.195,92 15,84 14.357,52 1.992,07 12.484,80 18,68 26.842,32 4.324,23 19.975,68 24,71 46.818,00 9.260,22 En adelante 29,16",
              "0,00 0,00 4.161,60 5,94 4.161,60 247,20 10.195,92 8,16 14.357,52 1.079,19 12.484,80 9,32 26.842,32 2.242,77 19.975,68 12,29 46.818,00 4.697,78 en adelante 15,84")
    comprueba(tr, "la cantidad de 3.400 euros anuales", "a) Contribuyentes con rendimientos netos del trabajo iguales o inferiores a 8.200 euros: 3.500 euros anuales",
              "multiplicar por 0,2291 la diferencia", "superiores a 6.500 euros: 2.400 euros anuales")
    tr6 = [0, 4161.60, 14357.52, 26842.32, 46818.00]
    n["2006"] = {
        "moneda": "euros", "smi_mes": 540.90, "pagas": 14,
        # De enero a junio y de julio a diciembre (Real Decreto-ley 5/2006): media del año.
        "cc": (23.60, 4.70), "desempleo": ((6.00 + 5.75) / 2, 1.55), "fogasa": ((0.40 + 0.20) / 2, 0.0), "fp": (0.60, 0.10), "mei": (0.0, 0.0),
        "at_ep": {"cajero": round(2.00 * 0.9, 3), "banca": round(1.10 * 0.9, 3)},
        "tope_mes": 2897.70,
        "irpf": {"estatal": list(zip(tr6, [9.06, 15.84, 18.68, 24.71, 29.16])), "autonomica": list(zip(tr6, [5.94, 8.16, 9.32, 12.29, 15.84])),
                 "minimo": 3400.0},
    }
    # ---- 2026 (euros, Comunidad de Madrid)
    comprueba("boe_rd_126_2026_smi.pdf", "40,70 euros/día o 1 221 euros/mes")
    o26 = "boe_orden_pjc_297_2026_cotizacion.html"
    comprueba(o26, "el 28,30 por ciento, del que el 23,60 por ciento será a cargo de la empresa y el 4,70 por ciento, a cargo de la persona trabajadora",
              "7,05 por ciento, del que el 5,5 por ciento será a cargo de la empresa y el 1,55 por ciento, a cargo de la persona trabajadora",
              "b) Fondo de Garantía Salarial: el 0,20 por ciento, a cargo de la empresa",
              "c) Formación profesional: el 0,70 por ciento, del que el 0,60 por ciento será a cargo de la empresa y el 0,10 por ciento, a cargo de la persona trabajadora",
              "tipo del 0,90 por ciento sobre la base de cotización por contingencias comunes, del que el 0,75 por ciento será a cargo del empleador y el 0,15 por ciento, a cargo de la persona trabajadora",
              "de 5.101,20 euros mensuales")
    comprueba("boe_lgss_rdleg_8_2015.html", "47 Comercio al por menor (Excepto 473, 4781, 4782 y 4783). 0,95 0,70 1,65",
              "64 Servicios financieros, excepto seguros y fondos de pensiones. 0,80 0,70 1,50")
    li, md = "boe_ley_35_2006_irpf.html", "boe_madrid_dleg_1_2010_tributos.html"
    comprueba(li, "f) En concepto de otros gastos distintos de los anteriores, 2.000 euros anuales",
              "a) Contribuyentes con rendimientos netos del trabajo iguales o inferiores a 14.852 euros: 7.302 euros anuales",
              "7.302 euros menos el resultado de multiplicar por 1,75 la diferencia",
              "2.364,34 euros menos el resultado de multiplicar por 1,14 la diferencia",
              "El mínimo del contribuyente será, con carácter general, de 5.550 euros anuales",
              "0,00 0,00 12.450,00 9,50 12.450,00 1.182,75 7.750,00 12,00 20.200,00 2.112,75 15.000,00 15,00 35.200,00 4.362,75 24.800,00 18,50 60.000,00 8.950,75 240.000,00 22,50 300.000,00 62.950,75 En adelante 24,50",
              "iguales o inferiores a 17.094 euros anuales: 590,89 euros anuales",
              "590,89 euros menos el resultado de multiplicar por 0,2 la diferencia")
    comprueba(md, "0 0 13.362,22 8,50 13.362,22 1.135,79 5.642,41 10,70 19.004,63 1.739,53 16.421,05 12,80 35.425,68 3.841,42 21.894,72 17,40 57.320,40 7.651,10 en adelante 20,50",
              "a) El mínimo del contribuyente será, con carácter general, de 5.956,65 euros anuales")
    n["2026"] = {
        "moneda": "euros", "smi_mes": 1221.0, "pagas": 14,
        "cc": (23.60, 4.70), "desempleo": (5.50, 1.55), "fogasa": (0.20, 0.0), "fp": (0.60, 0.10), "mei": (0.75, 0.15),
        "at_ep": {"cajero": 1.65, "banca": 1.50},
        "tope_mes": 5101.20,
        "irpf": {"estatal": [(0, 9.5), (12450, 12.0), (20200, 15.0), (35200, 18.5), (60000, 22.5), (300000, 24.5)],
                 "autonomica": [(0, 8.5), (13362.22, 10.7), (19004.63, 12.8), (35425.68, 17.4), (57320.40, 20.5)],
                 "minimo_estatal": 5550.0, "minimo_autonomico": 5956.65, "otros_gastos": 2000.0},
    }
    return n


# ------------------------------------------------------------------ cálculo
def cotizaciones(N, quien, bruto):
    tope = N["tope_mes"] * 12
    base = min(bruto, tope)
    base_cc = base
    if "base_cc_max_mes_grupo5" in N and quien == "banca":   # 1986: la base de contingencias comunes tenía tope por grupo
        base_cc = min(bruto, N["base_cc_max_mes_grupo5"] * 12)
    if "base_cc_min_mes" in N:
        base_cc = max(base_cc, N["base_cc_min_mes"] * 12)
    emp = {"contingencias_comunes": base_cc * N["cc"][0] / 100, "mei": base_cc * N["mei"][0] / 100,
           "desempleo": base * N["desempleo"][0] / 100, "fogasa": base * N["fogasa"][0] / 100,
           "formacion": base * N["fp"][0] / 100, "accidentes": base * N["at_ep"][quien] / 100}
    tra = {"contingencias_comunes": base_cc * N["cc"][1] / 100, "mei": base_cc * N["mei"][1] / 100,
           "desempleo": base * N["desempleo"][1] / 100, "formacion": base * N["fp"][1] / 100}
    return emp, tra


def irpf(anyo, N, bruto, cot_trab):
    P = N["irpf"]
    if anyo == "1986":
        base = bruto - cot_trab - bruto * P["gastos_pct"] / 100
        cuota = escala(base, P["escala"])
        return max(0.0, cuota - P["deducciones"]), {"base_imponible": base, "cuota_integra": cuota}
    if anyo == "2006":
        rn = bruto - cot_trab
        red = 3500 if rn <= 8200 else 3500 - 0.2291 * (rn - 8200) if rn <= 13000 else 2400
        bl = max(0.0, rn - P["minimo"] - min(red, rn))
        cuota = escala(bl, P["estatal"]) + escala(bl, P["autonomica"])
        return cuota, {"rendimiento_neto": rn, "reduccion_trabajo": red, "base_liquidable": bl}
    # 2026
    rn_previo = bruto - cot_trab
    red = (7302 if rn_previo <= 14852 else 7302 - 1.75 * (rn_previo - 14852) if rn_previo <= 17673.52
           else 2364.34 - 1.14 * (rn_previo - 17673.52) if rn_previo < 19747.5 else 0.0)
    bl = max(0.0, rn_previo - P["otros_gastos"] - red)
    est = max(0.0, escala(bl, P["estatal"]) - escala(min(bl, P["minimo_estatal"]), P["estatal"]))
    aut = max(0.0, escala(bl, P["autonomica"]) - escala(min(bl, P["minimo_autonomico"]), P["autonomica"]))
    ded = 590.89 if bruto <= 17094 else max(0.0, 590.89 - 0.2 * (bruto - 17094)) if bruto < 20048.45 else 0.0
    return max(0.0, est + aut - ded), {"rendimiento_neto": rn_previo - P["otros_gastos"], "reduccion_trabajo": red, "base_liquidable": bl,
                                        "cuota_estatal": est, "cuota_autonomica": aut, "deduccion_trabajo": min(ded, est + aut)}


# ------------------------------------------------------------------ después de cobrar: IVA y ahorro
def iva():
    """Tipos de IVA de cada año para cosas del día a día (leídos en el BOE)."""
    v85, a91, hoy = "boe_ley_30_1985_iva.pdf", "boe_ley_37_1992_iva_art91_2006.html", "boe_ley_37_1992_iva_vigente.html"
    comprueba(v85, "El impuesto se exigirá al tipo del 12 por 100", "Se aplicará el tipo del 6 por 100 a las operaciones siguientes",
              "Los productos susceptibles de ser habitual e idóneamente utilizados para la nutrición humana",
              "Los servicios de hostelería y acampamento, los de restau rantes", "Se aplicará el tipo del 33 por 100 a las siguientes operaciones",
              "Vehículos accionados a motor para circular por carretera")
    comprueba(a91, "El Impuesto se exigirá al tipo del 16 por 100", "Se aplicará el tipo del 7 por 100 a las operaciones siguientes",
              "Se aplicará el tipo del 4 por 100 a las operaciones siguientes", "El pan común",
              "Los servicios de hostelería, acampamento y balneario, los de restaurantes")
    comprueba(hoy, "El Impuesto se exigirá al tipo del 21 por ciento", "Se aplicará el tipo del 10 por ciento a las operaciones siguientes",
              "Se aplicará el tipo del 4 por ciento a las operaciones siguientes", "El pan común", "g) Los aceites de oliva")
    return {
        "pan_leche_huevos_fruta_verdura": {"1986": 6, "2006": 4, "2026": 4},
        "resto_de_la_comida_carne_pescado": {"1986": 6, "2006": 7, "2026": 10},
        "bar_y_restaurante": {"1986": 6, "2006": 7, "2026": 10},
        "ropa_y_calzado": {"1986": 12, "2006": 16, "2026": 21},
        "gasolina_y_gasoleo": {"1986": 12, "2006": 16, "2026": 21},
        "luz_movil_y_casi_todo_lo_demas": {"1986": 12, "2006": 16, "2026": 21},
        "coche": {"1986": 33, "2006": 16, "2026": 21},
        "nota": ("Tipo general: 12 % (1986), 16 % (2006) y 21 % (2026). Comida: en 1986 toda al 6 %; desde 1993 el pan, la leche, los huevos, las frutas "
                 "y verduras, al 4 % (hoy también el aceite de oliva), y el resto al 7 % (2006) y al 10 % (2026). La gasolina paga además "
                 "un impuesto especial por litro (ver «gasolina»). En 1986, los coches pagaban el tipo de lujo (33 %)."),
    }


def ahorro(N, casos):
    """Lo que pagan los intereses de una cuenta o un depósito (tipo marginal en 1986 y 2006; base del ahorro hoy)."""
    li = "boe_ley_35_2006_irpf.html"
    comprueba(li, "0 0 6.000 9,5 6.000,00 570 44.000 10,5 50.000,00 5.190 150.000 11,5 200.000,00 22.440 100.000 13,5 300.000,00 35.940 En adelante 15")
    comprueba("boe_rdleg_3_2004_irpf.html", "La base liquidable especial se gravará al tipo del 9,06 por ciento",
              "La base liquidable especial se gravará con el tipo del 5,94 por ciento",
              "La parte general de la renta del período impositivo estará constituida por la totalidad de la renta del contribuyente, excluidas las ganancias y pérdidas patrimoniales previstas en el artículo 40")
    comprueba("boe_ley_48_1985_irpf.pdf", "La base imponible se determinará mediante la suma de los rendimientos e incrementos de patrimonio")
    def marginal(tramos, base):
        t = tramos[0][1]
        for desde, tipo in tramos:
            if base >= desde:
                t = tipo
        return t
    out = {}
    for quien in ("cajero", "banca"):
        b86 = casos[quien]["1986"]["detalle_irpf"]["base_imponible"]
        b06 = casos[quien]["2006"]["detalle_irpf"]["base_liquidable"]
        out[quien] = {"1986": marginal(N["1986"]["irpf"]["escala"], b86),
                      "2006": round(marginal(N["2006"]["irpf"]["estatal"], b06) + marginal(N["2006"]["irpf"]["autonomica"], b06), 2),
                      "2026": 19.0}
    out["ganancias_al_vender_con_mas_de_un_ano_2006"] = 15.0
    out["nota"] = ("Intereses de una cuenta o un depósito, primeros euros. En 1986 y 2006 se sumaban al sueldo y pagaban al tipo marginal de cada uno; "
                   "desde 2007 van a la base del ahorro, con su propia escala (19 % hasta 6.000 €, 21 % hasta 50.000 €, 23 %, 27 % y 30 %). "
                   "En 2006, las ganancias por vender algo comprado hacía más de un año pagaban un 15 %.")
    return out


def gasolina(a_hoy):
    """Impuesto especial por litro de gasolina (además del IVA). 2006: en Madrid, con el impuesto sobre ventas minoristas."""
    comprueba("boe_ley_45_1985_impuestos_especiales.pdf", "Epígrafe 2.1.3: Gasolinas de automoción, 27,50 pesetas por litro")
    comprueba("boe_ley_38_1992_hidrocarburos_2006.html", "Epígrafe 1.2.2 Las demás gasolinas sin plomo: 371,69 euros por 1.000 litros")
    comprueba("boe_ley_24_2001_ivmdh_2006.html", "El tipo estatal será el siguiente: a) Gasolinas: 24 euros por 1.000 litros")
    comprueba("boe_madrid_ley_7_2002_ivmdh.pdf", "En el año 2004 y siguientes", "a) Gasolinas: 24 euros por 1.000 litros")
    comprueba("boe_ley_38_1992_hidrocarburos_vigente.html",
              "Epígrafe 1.2.2 Las demás gasolinas sin plomo: 400,69 euros por 1.000 litros de tipo general y 72 euros por 1.000 litros de tipo especial")
    litro = {"1986": 27.50 / PTS, "2006": (371.69 + 24 + 24) / 1000, "2026": (400.69 + 72) / 1000}
    return {
        "impuesto_por_litro": {"1986_pesetas": 27.50, "2006_euros": round(litro["2006"], 4), "2026_euros": round(litro["2026"], 4)},
        "impuesto_por_litro_en_euros_de_2026": {a: round(v * a_hoy[a], 3) for a, v in litro.items()},
        "iva_pct": {"1986": 12, "2006": 16, "2026": 21},
        "nota": ("Gasolina de 95 octanos (en 1986, «gasolinas de automoción»). 1986: impuesto sobre hidrocarburos de la Ley 45/1985; el Monopolio de "
                 "Petróleos cobraba además una renta que no se incluye. 2006: impuesto sobre hidrocarburos (371,69 €) + ventas minoristas, tramo estatal (24 €) "
                 "y de Madrid (24 €), por cada 1.000 litros. 2026: 400,69 € de tipo general + 72 € de tipo especial, igual en toda la península y Baleares. "
                 "En euros de 2026, con el IPC."),
    }


def gasoleo(I):
    """Precio del litro (boletín petrolero de la Comisión Europea, media de cada año) y su IVA, en euros de 2026.
    2026: precio medio antes de impuestos (enero a noviembre) con los impuestos que fija la ley (Ley 38/1992, art. 50, e IVA del 21 %).
    Versión 2 de T8 (Bruno, 18-11-2026): el balance se hace con los impuestos de la ley, sin rebajas temporales."""
    import openpyxl
    comprueba("boe_ley_38_1992_hidrocarburos_vigente.html",
              "Epígrafe 1.3 Gasóleos para uso general: 307 euros por 1.000 litros de tipo general y 72 euros por 1.000 litros de tipo especial",
              "Epígrafe 1.2.2 Las demás gasolinas sin plomo: 400,69 euros por 1.000 litros de tipo general y 72 euros por 1.000 litros de tipo especial")
    wb = openpyxl.load_workbook(RAW / "ce_boletin_petrolero_historico.xlsx", read_only=True, data_only=True)

    def serie(hoja, col):
        filas = list(wb[hoja].iter_rows(values_only=True))
        i = filas[0].index(col)
        return {r[0]: (r[i], r[i + 1]) for r in filas[3:] if hasattr(r[0], "year")}

    con, sin = serie("Prices with taxes", "ES_price_with_tax_euro95"), serie("Prices wo taxes", "ES_price_wo_tax_euro95")
    ley = {"gasoleo": (307 + 72) / 1000, "gasolina95": (400.69 + 72) / 1000}
    iva = {"2006": 16, "2016": 21, "2026": 21}
    out = {"nota": ("Comisión Europea, Weekly Oil Bulletin: media de los precios semanales de España de cada año (2026: de enero a noviembre). "
                    "2006 y 2016: precio con los impuestos de entonces. 2026: precio antes de impuestos más los impuestos que fija la ley "
                    "(gasóleo: 307 + 72 € por 1.000 litros; gasolina 95: 400,69 + 72; IVA del 21 %), sin las rebajas temporales de 2026. "
                    "IVA de cada litro = precio × IVA / (100 + IVA). En euros de 2026, con el IPC del INE.")}
    for prod, j in (("gasoleo", 1), ("gasolina95", 0)):
        d = {}
        for a in ("2006", "2016", "2026"):
            sem = [d_ for d_ in con if d_.year == int(a) and con[d_][j] and sin.get(d_) and sin[d_][j]]
            p_con = sum(con[x][j] for x in sem) / len(sem) / 1000
            p_sin = sum(sin[x][j] for x in sem) / len(sem) / 1000
            precio = (p_sin + ley[prod]) * (1 + iva[a] / 100) if a == "2026" else p_con
            f = I["2026"] / I[a]
            iva_l = precio * iva[a] / (100 + iva[a])
            d[a] = {"semanas": len(sem), "precio": round(precio, 4), "antes_de_impuestos": round(p_sin, 4), "iva_por_litro": round(iva_l, 4),
                    "impuestos_por_litro": round(precio - p_sin, 4), "iva_pct": iva[a],
                    "en_euros_de_2026": {"precio": round(precio * f, 3), "iva_por_litro": round(iva_l * f, 3),
                                         "impuestos_por_litro": round((precio - p_sin) * f, 3), "antes_de_impuestos": round(p_sin * f, 3)}}
        r26 = d["2026"]["en_euros_de_2026"]["precio"]
        d["sube_pct_real"] = {a: round(100 * (r26 / d[a]["en_euros_de_2026"]["precio"] - 1), 1) for a in ("2006", "2016")}
        out[prod] = d
    return out


def sueldo_medio(N, I):
    """El sueldo medio de hoy con las normas de 1986, 2006 y 2026: ¿cuánto le queda limpio con el mismo sueldo real?
    Sueldo medio: INE, Encuesta Anual de Estructura Salarial 2024 (último dato), pasado a euros de 2026 con el IPC."""
    t3 = json.loads((CLEAN / "t3_vivienda.json").read_text(encoding="utf-8"))
    bruto24 = t3["sueldos_eaes"]["media"]["2024"]
    real = bruto24 * I["2026"] / I["2024"]
    out = {"bruto_2024": bruto24, "bruto_en_euros_de_2026": round(real),
           "nota": ("Sueldo medio bruto de 2024 (INE, EAES), pasado a euros de 2026 con el IPC, y ese mismo poder de compra en 1986 y 2006. "
                    "Cotizaciones e IRPF de cada año, como en el resto de T8 (Madrid en 2026; accidentes de trabajo con la tarifa del comercio; "
                    "en 1986, sin el tope por categoría, que en todo caso habría dejado más neto en 1986).")}
    for a in ("1986", "2006", "2026"):
        f = I["2026"] / I[a]
        bruto = real / f * (PTS if a == "1986" else 1)
        n = N[a]
        emp, tra = cotizaciones(n, "cajero", bruto)
        ce, ct = sum(emp.values()), sum(tra.values())
        ir, _ = irpf(a, n, bruto, ct)
        k = f / (PTS if a == "1986" else 1)
        out[a] = {"bruto": round(bruto), "neto_en_euros_de_2026": round((bruto - ct - ir) * k), "al_estado_en_euros_de_2026": round((ir + ct + ce) * k),
                  "pct_estado_del_coste": round(100 * (ir + ct + ce) / (bruto + ce), 2), "pct_irpf_del_bruto": round(100 * ir / bruto, 2)}
    out["menos_que_1986"] = out["1986"]["neto_en_euros_de_2026"] - out["2026"]["neto_en_euros_de_2026"]
    out["menos_que_2006"] = out["2006"]["neto_en_euros_de_2026"] - out["2026"]["neto_en_euros_de_2026"]
    return out


def main():
    N = normas()
    I = ipc_largo()
    a_hoy = {a: I["2026"] / I[a] for a in ("1986", "2006", "2026")}   # euros de cada año → euros de 2026
    out = {"tema": "T8 — ¿cuánto de tu sueldo se queda el Estado? Cajero con el salario mínimo y empleado de banca, 1986, 2006 y 2026",
           "supuestos": ("Soltero, sin hijos, contrato indefinido, año completo, sin otras rentas ni deducciones personales. "
                         "Cajero de supermercado (CNAE 47) con el salario mínimo; empleado de banca (CNAE 64, oficial administrativo) con 40.000 € brutos en 2026 "
                         "y el equivalente con el IPC en 1986 y 2006. IRPF de 2026 con la escala de la Comunidad de Madrid; en 1986 no había tramo autonómico "
                         "y en 2006 Madrid usaba la escala complementaria general."),
           "ipc_media_anual": {a: I[a] for a in ("1986", "2006", "2026")},
           "euros_de_2026_por_euro": {a: round(v, 4) for a, v in a_hoy.items()}, "casos": {}}
    for quien in ("cajero", "banca"):
        for anyo in ("1986", "2006", "2026"):
            n = N[anyo]
            if quien == "cajero":
                bruto = n["smi_mes"] * n["pagas"]
            else:
                euros = 40000 / a_hoy[anyo]
                bruto = euros * PTS if anyo == "1986" else euros
                if anyo == "1986":
                    bruto = round(bruto, -3)   # redondeo a miles de pesetas
                else:
                    bruto = round(bruto)
            emp, tra = cotizaciones(n, quien, bruto)
            ce, ct = sum(emp.values()), sum(tra.values())
            ir, det = irpf(anyo, n, bruto, ct)
            coste = bruto + ce
            neto = bruto - ct - ir
            estado = ir + ct + ce
            a_eur = (1 / PTS if anyo == "1986" else 1) * a_hoy[anyo]   # a euros de 2026
            out["casos"].setdefault(quien, {})[anyo] = {
                "moneda": n["moneda"], "bruto": round(bruto, 2), "cotiz_empresa": round(ce, 2), "cotiz_trabajador": round(ct, 2), "irpf": round(ir, 2),
                "coste_empresa": round(coste, 2), "neto": round(neto, 2), "al_estado": round(estado, 2),
                "pct_estado_del_coste": round(100 * estado / coste, 2), "pct_irpf_del_bruto": round(100 * ir / bruto, 2),
                "pct_neto_del_coste": round(100 * neto / coste, 2),
                "detalle_empresa": {k: round(v, 2) for k, v in emp.items()}, "detalle_trabajador": {k: round(v, 2) for k, v in tra.items()},
                "detalle_irpf": {k: round(v, 2) for k, v in det.items()},
                "en_euros_de_2026": {k: round(v * a_eur) for k, v in (("bruto", bruto), ("coste_empresa", coste), ("neto", neto), ("al_estado", estado),
                                                                       ("irpf", ir), ("cotizaciones", ct + ce))},
            }
    out["iva_pct"] = iva()
    out["gasolina"] = gasolina(a_hoy)
    out["ahorro_intereses_tipo_pct"] = ahorro(N, out["casos"])
    out["sueldo_medio"] = sueldo_medio(N, I)
    out["carburante"] = gasoleo(I)
    out["nota"] = ("Cálculo propio (C) con las normas del BOE de cada año (ficheros en data/raw). Parte que va al Estado = IRPF + cotizaciones del "
                   "trabajador y de la empresa, sobre lo que le cuesta a la empresa. 1986: cotización por contingencias comunes con el tope del grupo 5 "
                   "(146.070 pesetas al mes); accidentes de trabajo con la tarifa de 1979 rebajada un 10 %. 2006: desempleo y FOGASA de la empresa "
                   "bajaron el 1 de julio (media del año). 2026: escala y mínimo autonómicos de Madrid; con otra comunidad, el IRPF del empleado de banca "
                   "cambia unos cientos de euros. IPC de 2026: media de los meses publicados.")
    (CLEAN / "t8_impuestos_sueldo.json").write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding="utf-8")
    for quien, d in out["casos"].items():
        for anyo, c in d.items():
            print(f"{quien:6} {anyo} bruto {c['bruto']:>12,.0f} {c['moneda'][:3]} · empresa paga {c['coste_empresa']:>12,.0f} · neto {c['neto']:>11,.0f} · "
                  f"IRPF {c['irpf']:>9,.0f} ({c['pct_irpf_del_bruto']:4.1f} % del bruto) · al Estado {c['pct_estado_del_coste']:4.1f} % del coste · "
                  f"en € de 2026: coste {c['en_euros_de_2026']['coste_empresa']:,} neto {c['en_euros_de_2026']['neto']:,}")
    print("IPC", out["ipc_media_anual"], out["euros_de_2026_por_euro"])
    print("IVA", {k: v for k, v in out["iva_pct"].items() if k != "nota"})
    print("Gasolina", out["gasolina"]["impuesto_por_litro_en_euros_de_2026"])
    print("Ahorro", {k: v for k, v in out["ahorro_intereses_tipo_pct"].items() if k != "nota"})


if __name__ == "__main__":
    main()
