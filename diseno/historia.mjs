// Monta la página de un Short narrado: una escena completa por frase, subtítulo arriba
// palabra a palabra, una cifra grande por plano y el sello de fuente.
// Las escenas de cada vídeo viven en videos/<id>/escenas.mjs (imágenes hechas para cada frase).

import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { svgObjeto } from "./objetos.mjs";
import { DEFS_COLLAGE, CSS_TITERES } from "./titeres.mjs";
import { DEFS_ATREZO, CSS_ATREZO, T } from "./atrezo.mjs";

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const F = path.join(AQUI, "fuentes");
const RT_TITERES = readFileSync(path.join(AQUI, "titeres_runtime.js"), "utf8");
const RT_HISTORIA = readFileSync(path.join(AQUI, "historia_runtime.js"), "utf8");
const ADELANTO = 0.14; // la imagen cambia un pelín antes que la voz

const fuente = (fam, fich, peso) => `@font-face{font-family:${fam};src:url("file://${F}/${fich}");font-weight:${peso}}`;
const CSS = `
${fuente("Fraunces", "fraunces-latin-700-normal.woff2", 700)}${fuente("Fraunces", "fraunces-latin-900-normal.woff2", 900)}
${fuente("Plex", "ibm-plex-mono-latin-400-normal.woff2", 400)}${fuente("Plex", "ibm-plex-mono-latin-600-normal.woff2", 600)}
${fuente("Plex", "ibm-plex-mono-latin-700-normal.woff2", 700)}
${fuente("Cap", "montserrat-latin-600-normal.woff2", 600)}${fuente("Cap", "montserrat-latin-800-normal.woff2", 800)}
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:1080px;height:1920px;overflow:hidden;background:#111}
.marco{position:relative;width:1080px;height:1920px;overflow:hidden}
#lienzo{position:absolute;left:0;top:0}
${CSS_TITERES}${CSS_ATREZO}
#cap{position:absolute;left:60px;top:232px;width:960px;text-align:center;font:800 62px/1.24 Cap;color:${T.papel};
  letter-spacing:-.01em;text-shadow:0 3px 0 rgba(0,0,0,.4),0 0 22px rgba(0,0,0,.5);display:none}
#cap span{display:inline-block;padding:0 10px;margin:0 -4px;border-radius:12px}
#cap .dicha{opacity:.55}
#cap .ahora{background:var(--hl);color:${T.texto_papel};text-shadow:none}
#cap.tono-pasado{--hl:${T.ocre}} #cap.tono-hoy{--hl:${T.azul_tiza}} #cap.tono-neutro{--hl:${T.papel}}
.sello-v{position:absolute;left:0;top:0;display:none}
.sello{position:absolute;left:60px;width:880px;top:1388px;display:flex;gap:18px;align-items:center;background:${T.papel};color:${T.rojo};
  border:4px solid ${T.rojo};outline:2px solid ${T.rojo};outline-offset:5px;padding:12px 20px;font:600 29px/1.3 Plex;transform-origin:50% 50%}
.sello b{font-weight:700;letter-spacing:.04em}
.sello svg{flex:none;overflow:visible}
.sello svg .l{stroke:${T.rojo};stroke-width:12;fill:none;stroke-linecap:round;stroke-linejoin:round}
.sello svg .f,.sello svg .f2,.sello svg .f3{fill:none}`;

// Trozos de subtítulo: cada frase, partida en grupos cortos (unas dos líneas como mucho).
function subtitulos(planos, tonoDe) {
  const caps = [];
  for (const p of planos) {
    const frases = new Map();
    for (const w of p.pals) (frases.get(w.frase) ?? frases.set(w.frase, []).get(w.frase)).push(w);
    for (const pals of frases.values()) {
      let g = [], largo = 0;
      const cerrar = () => { if (g.length) caps.push({ t0: g[0].t0, t1: g.at(-1).t1, tono: tonoDe(p.n), w: g.map((x) => ({ p: x.p, t0: x.t0 })) }); g = []; largo = 0; };
      pals.forEach((w, i) => {
        if (g.length && largo + w.p.length + 1 > 36) cerrar();
        g.push(w); largo += w.p.length + 1;
        const quedan = pals.length - i - 1;
        if (/[,:;…]$/.test(w.p) && largo >= 14 && quedan >= 2) cerrar();
      });
      cerrar();
    }
  }
  return caps;
}

// Las cifras dibujadas en una escena tienen que estar en la «pantalla» de su plano del guion.
function comprobar(escenas, guion) {
  const fallos = [];
  for (const e of escenas) {
    const b = guion.beats.find((x) => x.n === e.n);
    const permitido = b.pantalla + " " + (b.nota || "");
    const textos = [...e.svg.matchAll(/<text[^>]*>([^<]*)<\/text>/g)].map((m) => m[1]).join(" ");
    for (const n of textos.match(/\d+(?:,\d+)?/g) || []) {
      if (/^20\d\d$/.test(n)) continue;
      if (!permitido.includes(n)) fallos.push(`escena ${e.n}: dibuja «${n}», que no está en la pantalla del guion`);
    }
  }
  if (fallos.length) throw new Error(fallos.join("\n"));
}

export function construirHistoria({ guion, linea, cues, escenas, D }) {
  comprobar(escenas, guion);
  const planos = linea.planos;
  const beats = planos.map((p) => {
    const b = guion.beats.find((x) => x.n === p.n);
    return { n: p.n, ini: p.ini, fin: p.fin, sello: b.sello || null, tSello: (cues[`c${p.n}-dato`] ?? p.ini + 0.4) + 0.3 };
  });
  const tonoDe = (n) => escenas.find((e) => e.n === n)?.tono ?? "neutro";
  const caps = subtitulos(planos, tonoDe);
  const inicio = (i) => (i === 0 ? 0 : planos[i].ini - ADELANTO);
  const esc = escenas.map((e, i) => `{n:${e.n},t0:${inicio(i).toFixed(3)},t1:${(i + 1 < escenas.length ? inicio(i + 1) : linea.duracion).toFixed(3)},b:${planos[i].ini},c:CUES,
    fn:${e.fn.toString()},cam:${e.cam ? e.cam.toString() : "null"}}`).join(",\n");
  const sellos = beats.filter((b) => b.sello).map((b) => `<div class="sello-v" id="sello-${b.n}"><div class="sello">${svgObjeto("reloj", 50)}<div>${
    b.sello.replace(/^(DATO OFICIAL|CÁLCULO PROPIO \(C\))/, "<b>$1</b>")}</div></div></div>`).join("");

  return `<!doctype html><html lang="es"><head><meta charset="utf-8"><style>${CSS}</style></head><body><div class="marco">
<svg id="lienzo" width="1080" height="1920" viewBox="0 0 1080 1920" xmlns="http://www.w3.org/2000/svg">
<defs>${DEFS_COLLAGE}${DEFS_ATREZO}</defs>
${escenas.map((e) => `<g id="esc-${e.n}" style="display:none"><g id="cam-${e.n}">${e.svg}</g></g>`).join("\n")}
<rect width="1080" height="1920" fill="url(#vineta)"/>
<rect width="1080" height="640" fill="url(#sombra-sub)"/>
<rect width="1080" height="1920" filter="url(#grano)"/>
</svg>
<div id="cap"></div>
<div id="sellos">${sellos}</div>
</div>
<script>
${RT_TITERES}
const D = ${JSON.stringify(D)};
const CUES = ${JSON.stringify(cues)};
const BEATS = ${JSON.stringify(beats)};
const CAPS = ${JSON.stringify(caps)};
const ESCENAS = [${esc}];
${RT_HISTORIA}
</script></body></html>`;
}
