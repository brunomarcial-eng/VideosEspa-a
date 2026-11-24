#!/usr/bin/env python3
"""Alquiler que pagan los hogares inquilinos, sacado de los microdatos oficiales de la EPF del INE (T21).

La tabla publicada del INE con el gasto medio de los hogares que pagan alquiler (73827) empieza en 2016. Para 2007 se
calcula con los microdatos de ese año (ficheros de usuario de la EPF base 2006, descarga libre del INE), y para 2016
también, para comprobar que el método da lo mismo que la tabla publicada.

  · Hogares inquilinos: régimen de tenencia (REGTEN) 3 «alquiler» y 4 «alquiler a precio inferior al de mercado».
  · Alquiler: código de gasto de los alquileres reales de la vivienda principal (04111 en 2007, 04110 en 2016).
    El GASTO del fichero ya va elevado a la población (por el FACTOR del hogar).
  · Alquiler medio anual = Σ GASTO de los inquilinos / Σ FACTOR de los inquilinos.

Uso: python3 scripts/extraer_epf_alquiler.py [carpeta_de_descarga] [años separados por comas; por defecto 2007-2016]
Escribe data/raw/t21/epf_micro_alquiler_<año>.csv (un hogar por fila: número, factor, régimen, alquiler anual) y
data/raw/t21/epf_micro_alquiler_resumen.json. Los zip no se guardan en el repo (pesan 30 MB): URL y huella en el resumen.
"""
import collections
import csv
import hashlib
import io
import json
import pathlib
import subprocess
import sys
import zipfile

RAIZ = pathlib.Path(__file__).resolve().parent.parent
OUT = RAIZ / "data" / "raw" / "t21"
URL = "https://www.ine.es/ftp/microdatos/epf2006/epf_{a}.zip"
# posiciones (desde 0) según el diseño de registro del INE de cada año
# (de 2007 a 2010 REGTEN va en la columna 155; de 2011 a 2016, en la 189). El código del alquiler se busca en el fichero.
DISENO = {a: {"factor": (17, 28), "regten": (154, 155) if a <= 2010 else (188, 189)} for a in range(2007, 2017)}
CODIGOS_ALQUILER = ("04111", "04110")


def bajar(a, carpeta):
    z = carpeta / f"epf_{a}.zip"
    if not z.exists():
        subprocess.run(["curl", "-s", "-m", "600", "-o", str(z), URL.format(a=a)], check=True)
    return z


def leer(z, a):
    d = DISENO[a]
    interno = zipfile.ZipFile(z)
    while not any(n.startswith("Fichero de usuario de hogar") for n in interno.namelist()):   # zips dentro de zips
        interno = zipfile.ZipFile(io.BytesIO(interno.read(next(n for n in interno.namelist() if "datos" in n))))
    nombres = {n.split(" a")[0]: n for n in interno.namelist()}
    hog = {}
    for l in io.TextIOWrapper(interno.open(nombres["Fichero de usuario de hogar"]), encoding="latin1"):
        hog[l[4:9]] = [int(l[d["factor"][0]:d["factor"][1]]) / 1e6, l[d["regten"][0]:d["regten"][1]], 0.0]
    por_cod = {c: 0 for c in CODIGOS_ALQUILER}
    for l in io.TextIOWrapper(interno.open(nombres["Fichero de usuario de gastos"]), encoding="latin1"):
        if l[9:14] in por_cod:
            hog[l[4:9]][2] += int(l[14:29]) / 100          # gasto elevado
            por_cod[l[9:14]] += 1
    codigo = max(por_cod, key=por_cod.get)
    assert min(por_cod.values()) == 0, por_cod             # un solo código de alquiler por año
    return hog, codigo


def main():
    carpeta = pathlib.Path(sys.argv[1]) if len(sys.argv) > 1 else pathlib.Path("/tmp")
    carpeta.mkdir(parents=True, exist_ok=True)
    anos = [int(x) for x in sys.argv[2].split(",")] if len(sys.argv) > 2 else list(DISENO)
    previo = OUT / "epf_micro_alquiler_resumen.json"
    resumen = json.loads(previo.read_text(encoding="utf-8")) if previo.exists() else {}
    for a in anos:
        z = bajar(a, carpeta)
        hog, codigo = leer(z, a)
        tot = sum(h[0] for h in hog.values())
        inq = [h for h in hog.values() if h[1] in ("3", "4")]
        w = sum(h[0] for h in inq)
        anual = sum(h[2] for h in inq) / w
        por_reg = collections.defaultdict(lambda: [0.0, 0.0])
        for h in hog.values():
            por_reg[h[1]][0] += h[0]
            por_reg[h[1]][1] += h[2]
        resumen[str(a)] = {
            "url": URL.format(a=a), "sha256_zip": hashlib.sha256(z.read_bytes()).hexdigest(), "bytes_zip": z.stat().st_size,
            "codigo_alquiler": codigo, "hogares_muestra": len(hog), "hogares_elevados": round(tot),
            "hogares_inquilinos_pct": round(100 * w / tot, 2),
            "alquiler_medio_inquilino_anual": round(anual, 2), "alquiler_medio_inquilino_mes": round(anual / 12, 2),
            "alquiler_medio_todos_los_hogares_anual": round(sum(h[2] for h in hog.values()) / tot, 2),
            "por_regimen": {r: {"pct_hogares": round(100 * f / tot, 2), "alquiler_medio_anual": round(g / f, 2)} for r, (f, g) in sorted(por_reg.items())},
        }
        if a not in (2007, 2013, 2016):   # extracto por hogar solo de los años del vídeo (2007 y 2013) y de la comprobación (2016)
            print(a, resumen[str(a)]["alquiler_medio_inquilino_mes"], "€/mes ·", resumen[str(a)]["hogares_inquilinos_pct"], "% inquilinos")
            continue
        with open(OUT / f"epf_micro_alquiler_{a}.csv", "w", newline="", encoding="utf-8") as f:
            wr = csv.writer(f)
            wr.writerow(["numero", "factor", "regten", "alquiler_anual_elevado"])
            for n, h in sorted(hog.items()):
                wr.writerow([n, f"{h[0]:.6f}", h[1], f"{h[2]:.2f}"])
        print(a, resumen[str(a)]["alquiler_medio_inquilino_mes"], "€/mes ·", resumen[str(a)]["hogares_inquilinos_pct"], "% inquilinos")
    resumen = dict(sorted(resumen.items()))
    (OUT / "epf_micro_alquiler_resumen.json").write_text(json.dumps(resumen, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
