#!/usr/bin/env node
// Renderiza las imágenes de referencia de las biblias de estilo (Paso 3).
// Lee las cifras de data/clean y los sellos de videos/t1/guion.json; escribe
// archive/style-{A,B,C}/referencias/*.png (1080×1920) y el HTML de cada una.
// Uso: node scripts/render_referencias.mjs

import { createRequire } from "node:module";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { COMPOSICIONES, hojaObjetos } from "../diseno/escenas.mjs";

// Playwright viene preinstalado como módulo CommonJS global.
const { chromium } = createRequire(import.meta.url)("playwright");
const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const t1 = JSON.parse(readFileSync(path.join(RAIZ, "data/clean/t1_cesta_horas.json"), "utf8"));
const guion = JSON.parse(readFileSync(path.join(RAIZ, "videos/t1/guion.json"), "utf8"));
const fila = (a) => t1.filas.find((f) => f.anyo === a);
const sello = (n) => guion.beats.find((b) => b.n === n).sello.replace(/^(DATO OFICIAL|CÁLCULO PROPIO \(C\))/, "<b>$1</b>");

const d = {
  h2016: fila(2016).horas_neto_mediana,
  h2024: fila(2024).horas_neto_mediana,
  cesta2025: t1.cesta_2025_euros_mes,
  serie: [2016, 2018, 2019, 2024].map((a) => ({ anyo: a, valor: fila(a).horas_neto_mediana, hoy: a === 2024 })),
  selloCesta: sello(2),
  selloHoras: sello(5),
  motivoCierre: "Con 2016, 2018 o 2019 como referencia, y con cualquier forma de medir el sueldo",
};

const navegador = await chromium.launch();
const pag = await navegador.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
for (const [estilo, lista] of Object.entries(COMPOSICIONES)) {
  const dir = path.join(RAIZ, "archive", `style-${estilo}`, "referencias");
  mkdirSync(path.join(dir, "html"), { recursive: true });
  for (const [nombre, fn] of [...lista, ["0-objetos", () => hojaObjetos(estilo)]]) {
    const html = fn(d);
    const ficheroHtml = path.join(dir, "html", `${nombre}.html`);
    writeFileSync(ficheroHtml, html);
    await pag.goto("file://" + ficheroHtml);
    await pag.evaluate(() => document.fonts.ready);
    await pag.screenshot({ path: path.join(dir, `${estilo}-${nombre}.png`) });
    console.log("ok", estilo, nombre);
  }
}
await navegador.close();
