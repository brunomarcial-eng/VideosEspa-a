#!/usr/bin/env python3
"""Precio medio del litro de carburante que pagan los hogares, sacado de los microdatos oficiales de la EPF (T24).

La tabla publicada del INE con cantidades y «valor unitario» de la gasolina y el gasóleo (73844) empieza en 2016. Para
2007 y 2013 se calcula igual con los microdatos de la EPF base 2006 (ficheros de usuario, descarga libre del INE):

  · Fichero de gastos: código (columnas 10-14), GASTO elevado a la población (15-29, en céntimos) y CANTIDAD elevada
    (35-46, en centésimas de la unidad física: litros para los carburantes, kWh para la luz).
  · Carburantes de la EPF base 2006: código 07221 (gasolina, gasóleo y otros carburantes, todos juntos).
  · Valor unitario = Σ GASTO / Σ CANTIDAD; gasto y litros por hogar = Σ / Σ FACTOR de los hogares.
  · Comprobación: la luz (04511 + 04512) da el gasto por hogar de la tabla publicada 10629 al céntimo
    (479,33 € en 2007 y 745,35 € en 2013).

Uso: python3 scripts/extraer_epf_carburantes.py [carpeta_de_descarga] [años; por defecto 2007,2013]
Escribe data/raw/t24/epf_micro_carburantes_resumen.json. Los zip no se guardan en el repo (pesan 30 MB): URL y huella
en el resumen.
"""
import hashlib
import io
import json
import pathlib
import subprocess
import sys
import zipfile

RAIZ = pathlib.Path(__file__).resolve().parent.parent
OUT = RAIZ / "data" / "raw" / "t24"
URL = "https://www.ine.es/ftp/microdatos/epf2006/epf_{a}.zip"
CODIGOS = {"carburantes": ("07221",), "luz": ("04511", "04512")}


def bajar(a, carpeta):
    z = carpeta / f"epf_{a}.zip"
    if not z.exists():
        subprocess.run(["curl", "-s", "-m", "600", "-o", str(z), URL.format(a=a)], check=True)
    return z


def leer(z):
    interno = zipfile.ZipFile(z)
    while not any(n.startswith("Fichero de usuario de hogar") for n in interno.namelist()):   # zips dentro de zips
        interno = zipfile.ZipFile(io.BytesIO(interno.read(next(n for n in interno.namelist() if "datos" in n))))
    nombres = {n.split(" a")[0]: n for n in interno.namelist()}
    hogares = sum(int(l[17:28]) / 1e6 for l in io.TextIOWrapper(interno.open(nombres["Fichero de usuario de hogar"]), encoding="latin1"))
    suma = {k: [0.0, 0.0, 0] for k in CODIGOS}
    for l in io.TextIOWrapper(interno.open(nombres["Fichero de usuario de gastos"]), encoding="latin1"):
        for k, cods in CODIGOS.items():
            if l[9:14] in cods:
                q = l[34:46].strip()
                suma[k][0] += int(l[14:29]) / 100
                suma[k][1] += int(q) / 100 if q else 0.0
                suma[k][2] += 1
    return hogares, suma


def main():
    carpeta = pathlib.Path(sys.argv[1]) if len(sys.argv) > 1 else pathlib.Path("/tmp")
    carpeta.mkdir(parents=True, exist_ok=True)
    anos = [int(x) for x in sys.argv[2].split(",")] if len(sys.argv) > 2 else [2007, 2013]
    OUT.mkdir(parents=True, exist_ok=True)
    previo = OUT / "epf_micro_carburantes_resumen.json"
    resumen = json.loads(previo.read_text(encoding="utf-8")) if previo.exists() else {}
    for a in anos:
        z = bajar(a, carpeta)
        hogares, s = leer(z)
        g, q, n = s["carburantes"]
        resumen[str(a)] = {
            "url": URL.format(a=a), "sha256_zip": hashlib.sha256(z.read_bytes()).hexdigest(), "bytes_zip": z.stat().st_size,
            "hogares": round(hogares), "registros_carburantes": n,
            "carburantes_gasto_por_hogar": round(g / hogares, 2), "carburantes_litros_por_hogar": round(q / hogares, 1),
            "carburantes_euros_litro": round(g / q, 4),
            "comprobacion_luz_gasto_por_hogar": round(s["luz"][0] / hogares, 2),
        }
        print(a, resumen[str(a)])
    previo.write_text(json.dumps(resumen, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
