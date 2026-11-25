#!/usr/bin/env python3
"""Datos limpios de T24: ¿cuántas horas trabajas para llenar el depósito? (Bruno lo eligió el 24-11-2026).

Todo oficial (INE):
  · Precio medio del litro de carburante (gasolina y gasóleo juntos) que pagan los hogares = gasto / litros:
      2007 y 2013: microdatos de la EPF base 2006, código 07221 «carburantes y lubricantes»
        (scripts/extraer_epf_carburantes.py; el gasto por hogar cuadra al céntimo con la tabla publicada 10629) (C).
      2016, 2019 y 2025: EPF base 2016, gasto medio por hogar en gasóleo y gasolina (tabla 73781) entre litros por
        hogar (tabla 73844) (C, con datos V). Cada carburante por separado, también.
      Hoy (octubre de 2026): precio de 2025 de cada carburante × IPC de octubre de 2026 / IPC medio de 2025 (INE, IPC
        de subclases ECOICOP v2, base 2025, tabla 76128), juntando gasóleo y gasolina con los litros de 2025 (C).
  · Depósito de 50 litros (un coche compacto; supuesto del vídeo, se dice).
  · Sueldo neto mediano por hora: el de T1 y T21 (INE, EAES y ETCL; 2013 con el método de T1; 2025 = EAES 2024 ×
    ETCL). Octubre de 2026: el de 2025 × coste salarial total por hora de la ETCL del primer semestre de 2026 frente
    al de 2025 (tabla 6040; el tercer trimestre aún no está publicado) (C).
  · Litros por hogar al año: 2007 y 2013, microdatos; 2016+, tabla 73844 (V).

Uso: python3 scripts/calcular_t24.py → data/clean/t24_deposito.json
"""
import json
import pathlib

RAIZ = pathlib.Path(__file__).resolve().parent.parent
RAW, CLEAN = RAIZ / "data" / "raw" / "t24", RAIZ / "data" / "clean"
DEPOSITO = 50
ANOS = ("2007", "2013", "2016", "2019", "2025", "hoy")


def ine(fichero, nombre):
    for s in json.loads((RAW / fichero).read_text(encoding="utf-8")):
        if s["Nombre"].strip() == nombre:
            return s["Data"]
    raise KeyError(f"{fichero}: {nombre}")


def anual(data):
    return {str(x["Anyo"]): x["Valor"] for x in data if x["Valor"] is not None}


def main():
    pct = lambda a, b: round(100 * (b / a - 1), 1)
    hora = {a: v["neto_hora_mediana"] for a, v in json.loads((CLEAN / "t21_alquiler.json").read_text(encoding="utf-8"))["alquiler"].items()}
    micro = json.loads((RAW / "epf_micro_carburantes_resumen.json").read_text(encoding="utf-8"))

    g = {k: anual(ine("ine_73781_epf_gasto_5digitos.json", f"{k}. Gasto total. Gasto medio por hogar. Precios corrientes. Dato base."))
         for k in ("Gasóleo", "Gasolina")}
    q = {k: anual(ine("ine_73844_epf_cantidades.json", f"{k}. Cantidad consumida media por hogar. Dato base.")) for k in ("Gasóleo", "Gasolina")}

    # IPC mensual (base 2025 = 100): octubre de 2026 y media de 2025
    def ipc(nombre):
        d = ine("ine_76128_ipc_subclases_ecoicop2.json", f"Nacional. {nombre}. Índice.")
        m = {(x["Anyo"], x["FK_Periodo"]): x["Valor"] for x in d}
        media25 = sum(m[(2025, p)] for p in range(1, 13)) / 12
        ultimo = max(k for k in m if k[0] == 2026)
        return m[ultimo] / media25, ultimo, m[ultimo], media25
    ipc_go, mes, i_go, _ = ipc("Gasóleo")
    ipc_ga, mes2, i_ga, _ = ipc("Gasolina")
    assert mes == mes2 == (2026, 10), mes

    # Sueldo de octubre de 2026: 2025 × ETCL (coste salarial total por hora) 1.er semestre 2026 / 1.er semestre 2025
    et = ine("ine_6040_etcl_coste_salarial_hora.json", "Ambas jornadas. Industria, construcción y servicios (excepto actividades de los hogares como empleadores y de organizaciones y organismos extraterritoriales). Coste salarial total por hora. Total Nacional. Costes salariales. Euros.")
    import datetime
    mes_de = lambda f: f[:7] if isinstance(f, str) else datetime.datetime.fromtimestamp(f / 1000, datetime.timezone(datetime.timedelta(hours=2))).strftime("%Y-%m")
    tri = {mes_de(x["Fecha"]): x["Valor"] for x in et}
    s26 = tri["2026-01"] + tri["2026-04"]
    s25 = tri["2025-01"] + tri["2025-04"]
    assert "2026-07" not in tri, "ya está el tercer trimestre de 2026: usarlo"
    etcl_26 = s26 / s25
    hora["hoy"] = round(hora["2025"] * etcl_26, 2)

    precio, litros_hogar, precio_go, precio_ga = {}, {}, {}, {}
    for a in ("2007", "2013"):
        precio[a] = micro[a]["carburantes_euros_litro"]
        litros_hogar[a] = micro[a]["carburantes_litros_por_hogar"]
    for a in ("2016", "2019", "2025"):
        precio_go[a] = g["Gasóleo"][a] / q["Gasóleo"][a]
        precio_ga[a] = g["Gasolina"][a] / q["Gasolina"][a]
        precio[a] = (g["Gasóleo"][a] + g["Gasolina"][a]) / (q["Gasóleo"][a] + q["Gasolina"][a])
        litros_hogar[a] = q["Gasóleo"][a] + q["Gasolina"][a]
    precio_go["hoy"] = precio_go["2025"] * ipc_go
    precio_ga["hoy"] = precio_ga["2025"] * ipc_ga
    precio["hoy"] = (precio_go["hoy"] * q["Gasóleo"]["2025"] + precio_ga["hoy"] * q["Gasolina"]["2025"]) / (q["Gasóleo"]["2025"] + q["Gasolina"]["2025"])

    filas = {}
    for a in ANOS:
        lleno = precio[a] * DEPOSITO
        h = lleno / hora[a]
        filas[a] = {"euros_litro": round(precio[a], 4), "deposito_euros": round(lleno, 2), "neto_hora_mediana": hora[a],
                    "horas_deposito": round(h, 3), "horas_y_minutos": f"{int(h)} h {round((h - int(h)) * 60):02d} min",
                    "h": int(h), "min": round((h - int(h)) * 60),
                    "jornada_pct": round(100 * h / 8, 1)}
        if a in precio_go:
            filas[a] |= {"gasoleo_euros_litro": round(precio_go[a], 4), "gasolina_euros_litro": round(precio_ga[a], 4)}
        if a in litros_hogar:
            filas[a]["litros_por_hogar"] = round(litros_hogar[a], 1)
    hoy = filas["hoy"]
    out = {
        "nota": __doc__.strip().splitlines()[0],
        "deposito_litros": DEPOSITO, "anos": list(ANOS), "hoy": "octubre de 2026", "crisis": "2013",
        "filas": filas,
        "ipc_octubre_2026_sobre_media_2025": {"gasoleo": round(i_go, 3), "gasolina": round(i_ga, 3)},
        "sube_desde_2025_pct": {"gasoleo": pct(1, ipc_go), "gasolina": pct(1, ipc_ga), "sueldo": pct(1, etcl_26)},
        "etcl_semestre": {"2025": round(s25, 2), "2026": round(s26, 2)},
        "horas_mas_que": {a: round(hoy["horas_deposito"] - filas[a]["horas_deposito"], 2) for a in ANOS if a != "hoy"},
        "litros_por_hogar_baja_desde_2007_pct": pct(litros_hogar["2007"], litros_hogar["2025"]),
        "estado": {"precio_2007_2013": "C (microdatos EPF)", "precio_2016_2025": "C (tablas EPF: gasto / litros)",
                   "precio_hoy": "C (EPF 2025 × IPC)", "sueldo": "C (método de T1; hoy con la ETCL)", "litros_2016_2025": "V"},
    }
    (CLEAN / "t24_deposito.json").write_text(json.dumps(out, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    for a in ANOS:
        f = filas[a]
        print(f"{a:5} {f['euros_litro']:.3f} €/L  {f['deposito_euros']:6.2f} €  {f['neto_hora_mediana']:5.2f} €/h  {f['horas_deposito']:.2f} h ({f['horas_y_minutos']})"
              f"  {f.get('litros_por_hogar', '')}  go {f.get('gasoleo_euros_litro', '')} ga {f.get('gasolina_euros_litro', '')}")
    for k in ("ipc_octubre_2026_sobre_media_2025", "sube_desde_2025_pct", "etcl_semestre", "horas_mas_que", "litros_por_hogar_baja_desde_2007_pct"):
        print(k, out[k])


if __name__ == "__main__":
    main()
