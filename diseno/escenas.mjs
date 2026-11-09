// Escenas de los tres estilos del test (A pizarra, B cápsula, C baraja), 1080×1920.
// Cada función devuelve una página HTML completa que Chromium convierte en fotograma.
// Las cifras llegan desde data/clean (nunca escritas a mano aquí).

import { svgObjeto } from "./objetos.mjs";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const FUENTES = path.join(AQUI, "fuentes");
const T = JSON.parse(readFileSync(path.join(AQUI, "tokens.json"), "utf8")).colores;

export const num = (v, d = 1) => v.toLocaleString("es-ES", { minimumFractionDigits: d, maximumFractionDigits: d });

// ---------------------------------------------------------------- base común
const CSS_BASE = `
@font-face{font-family:Fraunces;src:url("file://${FUENTES}/fraunces-latin-700-normal.woff2");font-weight:700}
@font-face{font-family:Fraunces;src:url("file://${FUENTES}/fraunces-latin-900-normal.woff2");font-weight:900}
@font-face{font-family:Fraunces;src:url("file://${FUENTES}/fraunces-latin-400-normal.woff2");font-weight:400}
@font-face{font-family:Plex;src:url("file://${FUENTES}/ibm-plex-mono-latin-400-normal.woff2");font-weight:400}
@font-face{font-family:Plex;src:url("file://${FUENTES}/ibm-plex-mono-latin-600-normal.woff2");font-weight:600}
@font-face{font-family:Plex;src:url("file://${FUENTES}/ibm-plex-mono-latin-700-normal.woff2");font-weight:700}
@font-face{font-family:Mano;src:url("file://${FUENTES}/caveat-brush-latin-400-normal.woff2")}
:root{--ocre:${T.ocre};--azul:${T.azul};--papel:${T.papel};--pizarra:${T.pizarra};--tp:${T.texto_papel};
--tz:${T.texto_pizarra};--salvia:${T.salvia};--gris:${T.gris};--rojo:${T.rojo};--ocre-t:${T.ocre_texto_papel};
--azul-tiza:${T.azul_tiza};--gris-t:${T.gris_texto_papel};--gris-tiza:${T.gris_tiza};--salvia-tiza:${T.salvia_tiza};
--papel2:#E7DCC8;--carton:#CDBB98}
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:1080px;height:1920px;overflow:hidden}
.marco{position:relative;width:1080px;height:1920px;overflow:hidden}
.abs{position:absolute}
.sello{position:absolute;left:70px;width:860px;top:1385px;display:flex;gap:18px;align-items:center;
  background:var(--papel);color:var(--rojo);border:4px solid var(--rojo);outline:2px solid var(--rojo);outline-offset:5px;
  padding:14px 20px;font:600 30px/1.3 Plex;transform:rotate(-1.2deg)}
.sello b{font-weight:700;letter-spacing:.04em}
.sello svg{flex:none}
.sello svg .l{stroke:var(--rojo);stroke-width:12;fill:none}
.sello svg .f,.sello svg .f2,.sello svg .f3{fill:none}
.ficha{display:inline-block;padding:6px 26px 10px;border-radius:14px;font-family:Plex;font-weight:700}
.pasado.ficha{background:var(--ocre);color:var(--tp)}
.hoy.ficha{background:var(--azul);color:var(--papel)}
.obj{overflow:visible}
.obj .l{stroke-linecap:round;stroke-linejoin:round}
`;

function sello(texto) {
  return `<div class="sello">${svgObjeto("reloj", 54)}<div>${texto}</div></div>`;
}

function pagina(estilo, cuerpo, css = "", defs = "") {
  return `<!doctype html><html lang="es"><head><meta charset="utf-8"><style>${CSS_BASE}${ESTILOS[estilo].css}${css}</style></head>
<body><svg width="0" height="0" style="position:absolute">${ESTILOS[estilo].defs}${defs}</svg>
<div class="marco estilo-${estilo}">${ESTILOS[estilo].fondo}${cuerpo}</div></body></html>`;
}

// ---------------------------------------------------------------- estilos
const ESTILOS = {
  A: {
    defs: `
<filter id="tiza" x="-10%" y="-10%" width="120%" height="120%">
  <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" seed="7" result="r"/>
  <feColorMatrix in="r" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 -2.4 1.75" result="g"/>
  <feComposite in="SourceGraphic" in2="g" operator="in" result="t"/>
  <feDisplacementMap in="t" in2="r" scale="3" xChannelSelector="R" yChannelSelector="G"/>
</filter>
<filter id="borron"><feTurbulence type="fractalNoise" baseFrequency="0.004" numOctaves="3" seed="2"/>
  <feColorMatrix type="matrix" values="0 0 0 0 0.96 0 0 0 0 0.93 0 0 0 0 0.88 0 0 0 0.09 0"/></filter>
${["tiza", "ocre", "azul"].map((n) => `<pattern id="rayado-${n}" width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
  <line x1="0" y1="0" x2="0" y2="16" stroke="${{ tiza: T.texto_pizarra, ocre: T.ocre, azul: T.azul_tiza }[n]}" stroke-width="5"/></pattern>`).join("")}`,
    fondo: `<svg class="abs" width="1080" height="1920" style="left:0;top:0"><rect width="1080" height="1920" fill="${T.pizarra}"/>
<rect width="1080" height="1920" filter="url(#borron)"/></svg>`,
    css: `
.estilo-A{color:var(--tz);font-family:Mano}
.estilo-A .tiza{filter:url(#tiza)}
.estilo-A .obj .l{stroke:currentColor;stroke-width:6;fill:none}
.estilo-A .obj .f{fill:none}
.estilo-A .obj .f2{fill:url(#rayado-tiza);opacity:.55}
.estilo-A .obj .f3{fill:currentColor;opacity:.8}
.estilo-A .pasado{color:var(--ocre)} .estilo-A .hoy{color:var(--azul-tiza)} .estilo-A .tenue{color:var(--gris-tiza)}`,
  },
  B: {
    defs: `
<filter id="grano" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="4"/>
  <feColorMatrix type="matrix" values="0 0 0 0 0.12 0 0 0 0 0.1 0 0 0 0 0.08 0 0 0 0.10 0"/></filter>
<filter id="carton"><feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="2" seed="9" result="r"/>
  <feColorMatrix in="r" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.35 0" result="m"/>
  <feComposite in="SourceGraphic" in2="m" operator="arithmetic" k1="0" k2="1" k3="-0.25" k4="0"/></filter>`,
    fondo: `<svg class="abs" width="1080" height="1920" style="left:0;top:0"><rect width="1080" height="1920" fill="${T.papel}"/>
<rect width="1080" height="1920" filter="url(#grano)"/></svg>`,
    css: `
.estilo-B{color:var(--tp);font-family:Plex}
.estilo-B h1{font:900 82px/1.04 Fraunces;letter-spacing:-.01em}
.estilo-B .obj{filter:url(#carton)}
.estilo-B .obj .l{stroke:var(--tp);stroke-width:5}
.estilo-B .obj .f{fill:var(--papel2)} .estilo-B .obj .f2{fill:var(--salvia)} .estilo-B .obj .f3{fill:var(--carton)}
.estilo-B .obj path.l:not(.f):not(.f2):not(.f3),.estilo-B .obj circle.l:not(.f):not(.f2):not(.f3){fill:none}
.estilo-B .t-pasado{color:var(--ocre-t)} .estilo-B .t-hoy{color:var(--azul)} .estilo-B .tenue{color:var(--gris-t)}`,
  },
  C: {
    defs: `
<filter id="grano" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="4"/>
  <feColorMatrix type="matrix" values="0 0 0 0 0.12 0 0 0 0 0.1 0 0 0 0 0.08 0 0 0 0.08 0"/></filter>
<pattern id="trama-ocre" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
  <rect width="9" height="9" fill="${T.papel}"/><line x1="0" y1="0" x2="0" y2="9" stroke="${T.ocre}" stroke-width="5"/></pattern>
<pattern id="trama-azul" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)">
  <rect width="9" height="9" fill="${T.papel}"/><line x1="0" y1="0" x2="0" y2="9" stroke="${T.azul}" stroke-width="5"/></pattern>
<pattern id="trama-gris" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
  <rect width="10" height="10" fill="${T.papel}"/><line x1="0" y1="0" x2="0" y2="10" stroke="${T.gris}" stroke-width="3"/></pattern>`,
    fondo: `<svg class="abs" width="1080" height="1920" style="left:0;top:0"><rect width="1080" height="1920" fill="${T.papel}"/>
<rect width="1080" height="1920" filter="url(#grano)"/></svg>`,
    css: `
.estilo-C{color:var(--tp);font-family:Plex}
.estilo-C h1{font:700 66px/1.08 Fraunces}
.carta{position:absolute;background:var(--papel);border:5px solid var(--tp);border-radius:30px;box-shadow:10px 12px 0 rgba(30,30,30,.18)}
.carta::before{content:"";position:absolute;inset:14px;border:2px solid var(--tp);border-radius:20px}
.carta .indice{position:absolute;display:flex;flex-direction:column;align-items:center;gap:4px;font:700 38px/1 Plex}
.carta .indice.sup{left:30px;top:30px} .carta .indice.inf{right:30px;bottom:30px;transform:rotate(180deg)}
.estilo-C .obj .l{stroke:var(--tp);stroke-width:4.5}
.estilo-C .obj path.l:not(.f):not(.f2):not(.f3),.estilo-C .obj circle.l:not(.f):not(.f2):not(.f3){fill:none}
.estilo-C .pasado .obj .f,.estilo-C .pasado .obj .f3{fill:url(#trama-ocre)} .estilo-C .pasado .obj .f2{fill:var(--papel)}
.estilo-C .hoy .obj .f,.estilo-C .hoy .obj .f3{fill:url(#trama-azul)} .estilo-C .hoy .obj .f2{fill:var(--papel)}
.estilo-C .neutro .obj .f,.estilo-C .neutro .obj .f3{fill:url(#trama-gris)} .estilo-C .neutro .obj .f2{fill:var(--papel)}
.estilo-C .t-pasado{color:var(--ocre-t)} .estilo-C .t-hoy{color:var(--azul)} .estilo-C .tenue{color:var(--gris-t)}`,
  },
};

// ---------------------------------------------------------------- piezas
const TITULO_T1 = "¿Cuántas horas de trabajo cuesta la comida de un mes?";

function barrasGeom(horas, { x0, base, ancho, hueco, alto16 }) {
  return horas.map((h, i) => ({ ...h, x: x0 + i * (ancho + hueco), alto: (h.valor / 16) * alto16 }));
}

// ---------------------------------------------------------------- A · pizarra
const A = {
  gancho: () => pagina("A", `
<div class="abs tiza" style="left:70px;top:230px;width:940px;font-size:108px;line-height:1.02">${TITULO_T1}</div>
<div class="abs tiza" style="left:60px;top:800px">${svgObjeto("carrito", 640)}</div>
<div class="abs tiza" style="left:270px;top:830px">${svgObjeto("pan", 220)}</div>
<div class="abs tiza" style="left:470px;top:790px">${svgObjeto("leche", 210)}</div>
<div class="abs tiza" style="left:170px;top:880px">${svgObjeto("manzana", 150)}</div>
<div class="abs tiza" style="left:690px;top:600px">${svgObjeto("reloj", 300)}</div>
<div class="abs tiza tenue" style="left:880px;top:820px">${svgObjeto("tiza", 120)}</div>`),

  tachado: (d) => pagina("A", `
<div class="abs tiza tenue" style="left:80px;top:230px;width:920px;font-size:66px;line-height:1.05">Horas de trabajo para pagar la comida de un mes</div>
<div class="abs tiza pasado" style="left:100px;top:440px;font-size:78px">2016</div>
<div class="abs tiza pasado" style="left:90px;top:500px;font-size:250px;line-height:1">${num(d.h2016)} h</div>
<svg class="abs tiza" style="left:70px;top:560px" width="720" height="200"><path d="M10 150 C200 120 480 70 700 30" stroke="${T.texto_pizarra}" stroke-width="16" fill="none" stroke-linecap="round"/></svg>
<svg class="abs tiza" style="left:300px;top:800px" width="160" height="160"><path d="M20 10 C30 80 70 120 140 140 M100 110 L140 140 L96 156" stroke="${T.texto_pizarra}" stroke-width="10" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>
<div class="abs tiza hoy" style="left:470px;top:860px;font-size:78px">2024</div>
<div class="abs tiza hoy" style="left:330px;top:920px;font-size:270px;line-height:1">${num(d.h2024)} h</div>
<svg class="abs tiza" style="left:340px;top:1185px" width="640" height="60"><path d="M10 20 C200 12 420 14 620 18 M30 46 C220 38 420 40 600 44" stroke="${T.azul_tiza}" stroke-width="9" fill="none" stroke-linecap="round"/></svg>
<div class="abs tiza tenue" style="left:90px;top:1270px;font-size:46px">2024: último año con salarios oficiales del INE</div>
${sello(d.selloHoras)}`),

  grafico: (d) => {
    const g = barrasGeom(d.serie, { x0: 110, base: 1250, ancho: 160, hueco: 60, alto16: 640 });
    const barras = g.map((b) => `
<svg class="abs tiza ${b.hoy ? "hoy" : "pasado"}" style="left:${b.x}px;top:${1250 - b.alto}px" width="${160}" height="${b.alto}">
  <rect x="5" y="5" width="150" height="${b.alto - 5}" fill="url(#rayado-${b.hoy ? "azul" : "ocre"})" stroke="currentColor" stroke-width="8"/></svg>
<div class="abs tiza ${b.hoy ? "hoy" : "pasado"}" style="left:${b.x - 10}px;width:180px;text-align:center;top:${1250 - b.alto - 100}px;font-size:80px">${num(b.valor)}</div>
<div class="abs tiza" style="left:${b.x}px;width:160px;text-align:center;top:1268px;font-size:62px">${b.anyo}</div>`).join("");
    return pagina("A", `
<div class="abs tiza" style="left:80px;top:230px;width:920px;font-size:84px;line-height:1.02">Horas de trabajo · comida de un mes</div>
<svg class="abs tiza" style="left:70px;top:1245px" width="940" height="20"><path d="M5 8 H930" stroke="${T.texto_pizarra}" stroke-width="8" stroke-linecap="round"/></svg>
${barras}
${sello(d.selloHoras)}`);
  },

  cierre: (d) => pagina("A", `
<div class="abs tiza" style="left:70px;top:250px;width:940px;text-align:center;font-size:112px;line-height:1">¿Mejora, empeora o depende?</div>
<div class="abs tiza tenue" style="left:0;width:1080px;text-align:center;top:600px;font-size:130px">mejora</div>
<div class="abs tiza" style="left:0;width:1080px;text-align:center;top:820px;font-size:150px">EMPEORA</div>
<svg class="abs tiza" style="left:170px;top:800px" width="740" height="230"><ellipse cx="370" cy="115" rx="350" ry="98" stroke="${T.texto_pizarra}" stroke-width="10" fill="none" transform="rotate(-3 370 115)"/></svg>
<div class="abs tiza tenue" style="left:0;width:1080px;text-align:center;top:1080px;font-size:130px">depende</div>
<div class="abs tiza tenue" style="left:110px;width:860px;text-align:center;top:1300px;font-size:52px;line-height:1.1">${d.motivoCierre}</div>`),
};

// ---------------------------------------------------------------- B · cápsula y carrito
const B = {
  gancho: (d) => pagina("B", `
<h1 class="abs" style="left:70px;top:220px;width:940px">${TITULO_T1}</h1>
<div class="abs" style="left:160px;top:640px">${svgObjeto("carrito", 540)}</div>
<div class="abs" style="left:300px;top:580px">${svgObjeto("pan", 190)}</div>
<div class="abs" style="left:480px;top:550px">${svgObjeto("leche", 180)}</div>
<div class="abs" style="left:240px;top:630px">${svgObjeto("manzana", 130)}</div>
<div class="abs" style="left:610px;top:575px">${svgObjeto("aceite", 170)}</div>
<div class="abs" style="left:770px;top:470px">${svgObjeto("reloj", 200)}</div>
<div class="abs" style="left:200px;top:1165px"><span class="ficha hoy" style="font-size:80px">${num(d.cesta2025, 0)} € al mes</span></div>
<div class="abs" style="left:200px;top:1280px;font:600 36px Plex">gasto medio por persona · 2025</div>
${sello(d.selloCesta)}`),

  capsulas: (d) => pagina("B", `
<h1 class="abs" style="left:70px;top:220px;width:940px;font-size:74px">La misma comida, en horas de trabajo</h1>
<div class="abs" style="left:60px;top:500px">${svgObjeto("capsula", 440)}</div>
<div class="abs" style="left:575px;top:500px">${svgObjeto("capsula", 440)}</div>
<div class="abs" style="left:207px;top:770px"><span class="ficha pasado" style="font-size:50px">2016</span></div>
<div class="abs" style="left:722px;top:770px"><span class="ficha hoy" style="font-size:50px">2024</span></div>
<div class="abs" style="left:150px;top:470px">${svgObjeto("pan", 150)}</div>
<div class="abs" style="left:285px;top:455px">${svgObjeto("leche", 130)}</div>
<div class="abs" style="left:665px;top:470px">${svgObjeto("pan", 150)}</div>
<div class="abs" style="left:800px;top:455px">${svgObjeto("leche", 130)}</div>
<div class="abs" style="left:90px;top:985px"><span class="ficha pasado" style="font-size:100px">${num(d.h2016)} h</span></div>
<div class="abs" style="left:610px;top:985px"><span class="ficha hoy" style="font-size:100px">${num(d.h2024)} h</span></div>
<div class="abs tenue" style="left:110px;top:1185px;width:860px;font:600 36px/1.35 Plex">Sueldo neto por hora, mediana.<br>2024: último año con salarios oficiales del INE</div>
${sello(d.selloHoras)}`),

  tickets: (d) => {
    const g = barrasGeom(d.serie, { x0: 110, ancho: 170, hueco: 55, alto16: 700 });
    const t = g.map((b) => `
<div class="abs" style="left:${b.x}px;top:470px;width:170px;text-align:center"><span class="ficha ${b.hoy ? "hoy" : "pasado"}" style="font-size:44px;padding:4px 14px 8px">${b.anyo}</span></div>
<svg class="abs" style="left:${b.x}px;top:550px;filter:url(#carton)" width="170" height="${b.alto + 20}">
  <path d="M4 0 H166 V${b.alto} ${Array.from({ length: 8 }, (_, k) => `L${166 - (k * 2 + 1) * 10.125} ${b.alto + (k % 2 ? 0 : 16)}`).join(" ")} L4 ${b.alto} Z"
    fill="${T.papel}" stroke="${b.hoy ? T.azul : T.texto_papel}" stroke-width="${b.hoy ? 8 : 5}" stroke-linejoin="round"/>
  ${Array.from({ length: Math.floor((b.alto - 140) / 40) }, (_, k) => `<line x1="26" x2="${120 - (k % 3) * 22}" y1="${40 + k * 40}" y2="${40 + k * 40}" stroke="${T.gris}" stroke-width="6" stroke-linecap="round"/>`).join("")}
</svg>
<div class="abs ${b.hoy ? "t-hoy" : "t-pasado"}" style="left:${b.x}px;width:170px;text-align:center;top:${550 + b.alto - 100}px;font:700 58px Plex">${num(b.valor)}</div>`).join("");
    return pagina("B", `
<h1 class="abs" style="left:70px;top:220px;width:940px;font-size:70px">Horas de trabajo para la comida de un mes</h1>
${t}
<div class="abs tenue" style="left:110px;top:1300px;font:600 34px Plex">horas · sueldo neto por hora, mediana</div>
${sello(d.selloHoras)}`);
  },

  cierre: (d) => {
    const tag = (txt, top, activo) => `<div class="abs" style="left:${activo ? 210 : 250}px;top:${top}px;width:${activo ? 660 : 580}px;height:${activo ? 200 : 160}px;
background:${activo ? T.papel : "#E7DCC8"};border:${activo ? 9 : 4}px solid ${activo ? T.texto_papel : T.gris};border-radius:24px;
display:flex;align-items:center;justify-content:center;font:900 ${activo ? 104 : 80}px Fraunces;color:${activo ? T.texto_papel : T.gris_texto_papel};
transform:rotate(${activo ? -2 : 0}deg);box-shadow:${activo ? "12px 14px 0 rgba(30,30,30,.25)" : "none"};filter:url(#carton)">${txt}</div>`;
    return pagina("B", `
<h1 class="abs" style="left:70px;top:230px;width:940px;text-align:center;font-size:96px">¿Mejora, empeora o depende?</h1>
${tag("MEJORA", 560, false)}${tag("EMPEORA", 780, true)}${tag("DEPENDE", 1040, false)}
<div class="abs tenue" style="left:110px;width:860px;text-align:center;top:1260px;font:600 38px/1.35 Plex">${d.motivoCierre}</div>`);
  },
};

// ---------------------------------------------------------------- C · baraja
function carta({ x, y, w, h, rot = 0, tono, anyo, palo = "oros", centro = "", extra = "" }) {
  const cls = tono === "hoy" ? "hoy" : tono === "pasado" ? "pasado" : "neutro";
  const tcls = tono === "hoy" ? "t-hoy" : tono === "pasado" ? "t-pasado" : "tenue";
  const ind = `<div class="indice ${tcls}">${anyo}${svgObjeto(palo, 54)}</div>`;
  return `<div class="carta ${cls}" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px;transform:rotate(${rot}deg)${extra}">
${ind.replace('class="indice', 'class="indice sup')}${ind.replace('class="indice', 'class="indice inf')}${centro}</div>`;
}

const C = {
  as: (d) => pagina("C", `
<h1 class="abs" style="left:70px;top:220px;width:940px">La comida de un mes, en horas de trabajo</h1>
${carta({ x: 220, y: 390, w: 640, h: 940, tono: "hoy", anyo: "2024", centro: `
<div class="abs hoy" style="left:140px;top:150px">${svgObjeto("oros", 360)}</div>
<div class="abs t-hoy" style="left:0;width:630px;text-align:center;top:560px;font:700 150px Plex">${num(d.h2024)} h</div>
<div class="abs tenue" style="left:0;width:630px;text-align:center;top:745px;font:700 40px Fraunces">AS · el dato clave</div>` })}
${sello(d.selloHoras)}`),

  dosCartas: (d) => pagina("C", `
<h1 class="abs" style="left:70px;top:220px;width:940px">La misma comida: 2016 frente a 2024</h1>
${carta({ x: 70, y: 500, w: 450, h: 680, rot: -4, tono: "pasado", anyo: "2016", centro: `
<div class="abs pasado" style="left:105px;top:130px">${svgObjeto("oros", 230)}</div>
<div class="abs t-pasado" style="left:0;width:440px;text-align:center;top:410px;font:700 104px Plex">${num(d.h2016)} h</div>` })}
${carta({ x: 560, y: 530, w: 450, h: 680, rot: 4, tono: "hoy", anyo: "2024", centro: `
<div class="abs hoy" style="left:105px;top:130px">${svgObjeto("oros", 230)}</div>
<div class="abs t-hoy" style="left:0;width:440px;text-align:center;top:410px;font:700 104px Plex">${num(d.h2024)} h</div>` })}
<div class="abs tenue" style="left:90px;top:1280px;font:600 34px Plex">2024: último año con salarios oficiales del INE</div>
${sello(d.selloHoras)}`),

  mano: (d) => {
    const cartas = d.serie.map((b, i) => {
      const alto = (b.valor / 16) * 380;
      return carta({ x: 70 + i * 235, y: 560, w: 215, h: 520, tono: b.hoy ? "hoy" : "pasado", anyo: b.anyo, centro: `
<div class="abs" style="left:28px;bottom:28px;width:149px;height:${alto}px;background:url(#x);border:4px solid ${T.texto_papel};border-radius:8px;
background-image:repeating-linear-gradient(${b.hoy ? -45 : 45}deg,${b.hoy ? T.azul : T.ocre} 0 5px,${T.papel} 5px 11px)"></div>` })
        + `<div class="abs ${b.hoy ? "t-hoy" : "t-pasado"}" style="left:${70 + i * 235}px;width:215px;text-align:center;top:1110px;font:700 50px Plex;white-space:nowrap">${num(b.valor)} h</div>`;
    }).join("");
    return pagina("C", `
<h1 class="abs" style="left:70px;top:220px;width:940px">Horas de trabajo · comida de un mes</h1>
${cartas}
<div class="abs tenue" style="left:90px;top:1260px;font:600 34px Plex">sueldo neto por hora, mediana</div>
${sello(d.selloHoras)}`);
  },

  cierre: (d) => {
    const c = (txt, i, activo) => `<div class="carta ${activo ? "" : "neutro"}" style="left:${55 + i * 330}px;top:${activo ? 560 : 640}px;width:310px;height:470px;
${activo ? "border-width:9px" : "opacity:.75"}"><div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;
font:900 ${activo ? 46 : 40}px Fraunces;color:${activo ? T.texto_papel : T.gris_texto_papel}">${txt}</div></div>`;
    return pagina("C", `
<h1 class="abs" style="left:70px;top:240px;width:940px;text-align:center;font:900 92px/1.04 Fraunces">¿Mejora, empeora o depende?</h1>
${c("MEJORA", 0, false)}${c("EMPEORA", 1, true)}${c("DEPENDE", 2, false)}
<div class="abs tenue" style="left:110px;width:860px;text-align:center;top:1200px;font:600 38px/1.35 Plex">${d.motivoCierre}</div>`);
  },
};

// ---------------------------------------------------------------- hojas de objetos
const LISTAS = {
  A: ["taza", "pan", "llave", "carrito", "reloj", "huevos", "aceite", "manzana", "calendario", "tiza"],
  B: ["capsula", "carrito", "reloj", "ticket", "nomina", "etiqueta", "pan", "leche", "huevos", "aceite"],
  C: ["oros", "copas", "espadas", "bastos", "sota", "caballo", "rey", "reverso", "reloj", "carrito"],
};
const NOMBRES = { taza: "café", pan: "barra de pan", llave: "llave", carrito: "carrito", reloj: "reloj", huevos: "huevos",
  aceite: "aceite", manzana: "fruta", calendario: "calendario", tiza: "tiza", capsula: "cápsula", ticket: "ticket",
  nomina: "nómina", etiqueta: "etiqueta de precio", leche: "leche", oros: "oros · sueldos y precios", copas: "copas · comida y ocio",
  espadas: "espadas · impuestos", bastos: "bastos · vivienda", sota: "sota · joven que empieza", caballo: "caballo · adulto con familia",
  rey: "rey · ingresos altos", reverso: "reverso" };

function hojaObjetos(estilo) {
  const tono = (i) => (estilo === "C" ? (i % 2 ? "hoy" : "pasado") : "");
  const celdas = LISTAS[estilo].map((o, i) => `
<div class="abs ${estilo === "A" ? "tiza" : ""} ${tono(i)}" style="left:${70 + (i % 2) * 480}px;top:${200 + Math.floor(i / 2) * 300}px;width:460px;height:290px;
display:flex;align-items:center;gap:22px">${svgObjeto(o, 220)}<div style="font:${estilo === "A" ? "52px Mano" : "600 34px/1.2 Plex"}">${NOMBRES[o]}</div></div>`).join("");
  const titulo = { A: "Estilo A · la pizarra", B: "Estilo B · la cápsula y el carrito", C: "Estilo C · la baraja" }[estilo];
  return pagina(estilo, `<div class="abs ${estilo === "A" ? "tiza" : ""}" style="left:70px;top:90px;font:${estilo === "A" ? "84px Mano" : "900 66px Fraunces"}">${titulo} · objetos base</div>${celdas}
<div class="abs ${estilo === "A" ? "tiza tenue" : "tenue"}" style="left:70px;top:1720px;width:940px;font:${estilo === "A" ? "44px Mano" : "600 30px Plex"}">${estilo === "C" ? "Ocre = pasado · azul = hoy. Diseño propio; el rey no representa a ningún monarca." : "Objetos en tonos neutros: ocre y azul se reservan para marcar pasado y hoy."}</div>`);
}

export const COMPOSICIONES = {
  A: [["1-gancho", A.gancho], ["2-tachado", A.tachado], ["3-grafico", A.grafico], ["4-cierre", A.cierre]],
  B: [["1-carrito", B.gancho], ["2-capsulas", B.capsulas], ["3-tickets", B.tickets], ["4-cierre", B.cierre]],
  C: [["1-as", C.as], ["2-dos-cartas", C.dosCartas], ["3-mano", C.mano], ["4-cierre", C.cierre]],
};
export { hojaObjetos };
