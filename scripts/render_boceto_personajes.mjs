#!/usr/bin/env node
// BOCETO (no aprobado): plano de diálogo con la misma persona en dos épocas, en los tres estilos.
// Escribe archive/style-{A,B,C}/referencias/{A,B,C}-5-dialogo-boceto.png
// Uso: node scripts/render_boceto_personajes.mjs

import { createRequire } from "node:module";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { pagina, sello, num } from "../diseno/escenas.mjs";
import { svgPersonaje } from "../diseno/personajes.mjs";

const { chromium } = createRequire(import.meta.url)("playwright");
const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const T = JSON.parse(readFileSync(path.join(RAIZ, "diseno/tokens.json"), "utf8")).colores;
const t1 = JSON.parse(readFileSync(path.join(RAIZ, "data/clean/t1_cesta_horas.json"), "utf8"));
const guion = JSON.parse(readFileSync(path.join(RAIZ, "videos/t1/guion.json"), "utf8"));
const h = (a) => num(t1.filas.find((f) => f.anyo === a).horas_neto_mediana);
const selloHoras = guion.beats.find((b) => b.n === 5).sello.replace(/^(CÁLCULO PROPIO \(C\))/, "<b>$1</b>");

const FRASE_ANTES = `¿${h(2024)} horas para la compra del mes? Yo la pagaba con ${h(2016)}.`;
const FRASE_HOY = "Ya. Ahora cobro más por hora… pero la compra ha subido más.";

// Colores solo de personaje (fuera de los datos): piel estilizada, pelo y boca.
const PJ = { piel: "#D8B894", pelo: "#4A3F35", boca: "#6B3A2E" };

const CSS = {
  A: `.pj .l{stroke:${T.texto_pizarra};stroke-width:6;fill:none;stroke-linecap:round;stroke-linejoin:round}
.pj .piel{fill:none} .pj .pelo{fill:url(#rayado-tiza);opacity:.6} .pj .ojo{fill:${T.texto_pizarra}}
.pj .canas{stroke:${T.gris_tiza};stroke-width:8;fill:none;stroke-linecap:round} .pj .vidrio{fill:none}
.pj-antes .ropa{fill:url(#rayado-ocre)} .pj-hoy .ropa{fill:url(#rayado-azul)} .pj .boca{fill:none}
.burbuja{position:absolute;border:7px solid ${T.texto_pizarra};border-radius:46px;padding:26px 34px;font:58px/1.08 Mano;color:${T.texto_pizarra};filter:url(#tiza)}`,
  B: `.pj .l{stroke:${T.texto_papel};stroke-width:5;stroke-linejoin:round;stroke-linecap:round}
.pj .piel{fill:${PJ.piel}} .pj .pelo{fill:${PJ.pelo}} .pj .ojo{fill:${T.texto_papel}} .pj .boca{fill:${PJ.boca}}
.pj .canas{stroke:#E7DCC8;stroke-width:9;fill:none;stroke-linecap:round} .pj .vidrio{fill:rgba(244,237,224,.35)}
.pj-antes .ropa{fill:${T.ocre}} .pj-hoy .ropa{fill:${T.azul}} .pj{filter:url(#carton)}
.burbuja{position:absolute;background:${T.papel};border:5px solid ${T.texto_papel};border-radius:40px;padding:24px 32px;
font:700 46px/1.15 Fraunces;color:${T.texto_papel};box-shadow:10px 12px 0 rgba(30,30,30,.18)}`,
  C: `.pj .l{stroke:${T.texto_papel};stroke-width:4.5;stroke-linejoin:round;stroke-linecap:round}
.pj .piel{fill:${T.papel}} .pj .pelo{fill:url(#trama-gris)} .pj .ojo{fill:${T.texto_papel}} .pj .boca{fill:${T.papel}}
.pj .canas{stroke:${T.papel};stroke-width:9;fill:none;stroke-linecap:round} .pj .vidrio{fill:none}
.pj-antes .ropa{fill:url(#trama-ocre)} .pj-hoy .ropa{fill:url(#trama-azul)}
.burbuja{position:absolute;background:${T.papel};border:5px solid ${T.texto_papel};outline:2px solid ${T.texto_papel};outline-offset:-14px;
border-radius:28px;padding:30px 36px;font:700 44px/1.15 Fraunces;color:${T.texto_papel}}`,
};

const COLA_CSS = (color) => `.burbuja::after{content:"";position:absolute;bottom:-44px;left:var(--cola);border-left:24px solid transparent;
border-right:24px solid transparent;border-top:44px solid ${color}}`;

function plano(estilo) {
  const tiza = estilo === "A" ? "tiza" : "";
  const fichaCls = (q) => (estilo === "A" ? `abs ${tiza} ${q === "antes" ? "pasado" : "hoy"}` : "abs");
  const ficha = (q, anyo, x) => estilo === "A"
    ? `<div class="${fichaCls(q)}" style="left:${x}px;top:880px;font-size:70px">${anyo}</div>`
    : `<div class="abs" style="left:${x}px;top:890px"><span class="ficha ${q === "antes" ? "pasado" : "hoy"}" style="font-size:46px">${anyo}</span></div>`;
  const colaColor = estilo === "A" ? T.texto_pizarra : T.texto_papel;
    const tituloCss = estilo === "A" ? "font:76px/1.02 Mano" : "font:900 60px/1.05 Fraunces";
  let personajes;
  if (estilo === "C") {
    const carta = (q, x, rot, anyo) => `<div class="carta ${q === "antes" ? "pasado" : "hoy"}" style="left:${x}px;top:850px;width:430px;height:560px;transform:rotate(${rot}deg);overflow:hidden">
<div class="indice sup ${q === "antes" ? "t-pasado" : "t-hoy"}">${anyo}</div>
<div class="abs" style="left:50px;top:80px">${svgPersonaje(q, 480)}</div></div>`;
    personajes = carta("antes", 60, -3, "2016") + carta("hoy", 590, 3, "2024");
  } else {
    personajes = `<div class="abs ${tiza}" style="left:60px;top:900px">${svgPersonaje("antes", 480)}</div>
<div class="abs ${tiza}" style="left:640px;top:900px">${svgPersonaje("hoy", 480)}</div>
${ficha("antes", "2016", 60)}${ficha("hoy", "2024", 640)}`;
  }
  return pagina(estilo, `
<div class="abs ${tiza} ${estilo === "A" ? "" : "tenue"}" style="left:70px;top:210px;width:940px;${tituloCss}">La comida de un mes, en horas de trabajo</div>
<div class="burbuja" style="left:60px;top:370px;width:640px;--cola:90px">${FRASE_ANTES}</div>
<div class="burbuja" style="left:390px;top:610px;width:630px;--cola:430px">${FRASE_HOY}</div>
${personajes}
${sello(selloHoras)}`, CSS[estilo] + COLA_CSS(colaColor));
}

const navegador = await chromium.launch();
const pag = await navegador.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
for (const estilo of ["A", "B", "C"]) {
  const dir = path.join(RAIZ, "archive", `style-${estilo}`, "referencias");
  mkdirSync(path.join(dir, "html"), { recursive: true });
  const f = path.join(dir, "html", "5-dialogo-boceto.html");
  writeFileSync(f, plano(estilo));
  await pag.goto("file://" + f);
  await pag.evaluate(() => document.fonts.ready);
  await pag.screenshot({ path: path.join(dir, `${estilo}-5-dialogo-boceto.png`) });
  console.log("ok", estilo);
}
await navegador.close();
