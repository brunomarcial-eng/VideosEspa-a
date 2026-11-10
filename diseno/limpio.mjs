// Estilo «limpio»: ilustración plana y sencilla, tarjeta blanca con etiqueta y titular,
// subtítulo grande de dos o tres palabras y barra de progreso por capítulos.
// Inspirado en las referencias de Bruno (archive/referencias/ref-4 a ref-9), con dibujo,
// personaje y marca propios. Todo se dibuja con código; nada de bancos de imágenes.

import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const F = path.join(AQUI, "fuentes");
const RT = readFileSync(path.join(AQUI, "limpio_runtime.js"), "utf8");
const ADELANTO = 0.12;

export const C = {
  tinta: "#1F2A37", gris: "#5B6470", grisClaro: "#9AA6AE", blanco: "#FFFDF8",
  ocre: "#C8902E", ocreClaro: "#E7C47A", azul: "#1F5F8B", azulClaro: "#6AADDF", rojo: "#B3261E", marcador: "#FFD84D",
  pared1: "#FCF4E6", pared2: "#F4E4C8", suelo: "#EBD2AA", zocalo: "#D8BC92", madera: "#B98A5E", maderaClara: "#D4A373",
  salvia: "#7C9A7E", piel: "#EDBE96", piel2: "#DCA67C", pelo: "#3B2A20", pantalon: "#2C3E50",
};
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");

// ------------------------------------------------------------------ personaje
// Dani de cuerpo entero. El origen (0,0) está entre los pies. Mide unos 600 px.
export function persona(id, epoca) {
  const [cam, cam2] = epoca === "antes" ? [C.ocre, "#A9781F"] : [C.azul, "#184B6E"];
  const hoy = epoca !== "antes";
  return `<g id="${id}">
  <ellipse cx="0" cy="4" rx="120" ry="18" fill="#3C2814" opacity=".16"/>
  <g id="${id}-c">
    <g id="${id}-pi"><rect x="-50" y="-196" width="44" height="186" rx="22" fill="${C.pantalon}"/><rect x="-64" y="-26" width="68" height="28" rx="14" fill="${C.tinta}"/></g>
    <g id="${id}-pd"><rect x="6" y="-196" width="44" height="186" rx="22" fill="#34495E"/><rect x="-4" y="-26" width="68" height="28" rx="14" fill="${C.tinta}"/></g>
    <g id="${id}-bi"><rect x="-98" y="-362" width="36" height="152" rx="18" fill="${cam2}"/><circle cx="-80" cy="-204" r="21" fill="${C.piel2}"/></g>
    <rect x="-82" y="-380" width="164" height="212" rx="58" fill="${cam}"/>
    <path d="M-82 -236 Q0 -208 82 -236 V-226 Q82 -168 24 -168 H-24 Q-82 -168 -82 -226 Z" fill="${cam2}" opacity=".5"/>
    <rect x="-22" y="-406" width="44" height="42" rx="12" fill="${C.piel2}"/>
    <g id="${id}-h">
      <circle cx="-93" cy="-482" r="19" fill="${C.piel2}"/><circle cx="93" cy="-482" r="19" fill="${C.piel2}"/>
      <circle cx="0" cy="-486" r="96" fill="${C.piel}"/>
      ${hoy ? `<path d="M-86 -456 C-84 -404 -44 -386 0 -386 C44 -386 84 -404 86 -456 C66 -428 34 -420 0 -420 C-34 -420 -66 -428 -86 -456 Z" fill="${C.pelo}"/>` : ""}
      <path d="M-97 -498 C-106 -592 -44 -602 0 -600 C52 -604 110 -578 97 -492 C84 -540 44 -554 4 -550 C-36 -554 -82 -538 -97 -498 Z" fill="${C.pelo}"/>
      ${hoy ? `<path d="M-97 -498 C-99 -520 -94 -538 -84 -552 C-86 -534 -86 -516 -90 -500 Z" fill="#C4BDB0"/><path d="M97 -492 C99 -516 94 -536 84 -550 C86 -532 87 -514 90 -496 Z" fill="#C4BDB0"/>` : ""}
      <circle cx="-58" cy="-454" r="15" fill="#F0977F" opacity=".45"/><circle cx="58" cy="-454" r="15" fill="#F0977F" opacity=".45"/>
      <g id="${id}-cj"><path d="M-50 -518 Q-34 -528 -18 -520" fill="none" stroke="${C.pelo}" stroke-width="8" stroke-linecap="round"/>
        <path d="M18 -520 Q34 -528 50 -518" fill="none" stroke="${C.pelo}" stroke-width="8" stroke-linecap="round"/></g>
      <g id="${id}-oi"><ellipse rx="11" ry="14" fill="${C.tinta}"/><circle cx="4" cy="-5" r="4" fill="#fff"/></g>
      <g id="${id}-od"><ellipse rx="11" ry="14" fill="${C.tinta}"/><circle cx="4" cy="-5" r="4" fill="#fff"/></g>
      <g id="${id}-of" style="display:none" fill="none" stroke="${C.tinta}" stroke-width="8" stroke-linecap="round">
        <path d="M-47 -484 Q-34 -500 -21 -484"/><path d="M21 -484 Q34 -500 47 -484"/></g>
      <g id="${id}-b">
        <path data-b="sonrisa" d="M-24 -452 Q0 -430 24 -452" fill="none" stroke="#7A3E2E" stroke-width="7" stroke-linecap="round"/>
        <path data-b="grande" d="M-28 -456 Q0 -446 28 -456 Q22 -420 0 -418 Q-22 -420 -28 -456 Z" fill="#5A2A22" style="display:none"/>
        <ellipse data-b="o" cx="0" cy="-442" rx="12" ry="16" fill="#5A2A22" style="display:none"/>
        <path data-b="seria" d="M-18 -444 H18" fill="none" stroke="#7A3E2E" stroke-width="7" stroke-linecap="round" style="display:none"/>
      </g>
    </g>
    <g id="${id}-bd"><rect x="62" y="-362" width="36" height="152" rx="18" fill="${cam}"/><circle cx="80" cy="-204" r="21" fill="${C.piel}"/></g>
  </g></g>`;
}

// Figura genérica (peón), para la fila de «todos los sueldos».
export function peon(id, x, y, color = "#C9CED3") {
  return `<g id="${id}" transform="translate(${x} ${y})"><rect x="-26" y="-74" width="52" height="74" rx="24" fill="${color}"/><circle cx="0" cy="-98" r="26" fill="${color}"/></g>`;
}

// ------------------------------------------------------------------ objetos
export const PRODUCTOS = {
  pan: `<g transform="rotate(-28)"><rect x="-70" y="-22" width="140" height="44" rx="22" fill="#E2B77A"/>
    <path d="M-36 -10 l14 20 M-6 -10 l14 20 M24 -10 l14 20" stroke="#C4955A" stroke-width="7" stroke-linecap="round"/></g>`,
  leche: `<path d="M-34 -40 L-18 -70 H18 L34 -40 V62 H-34 Z" fill="#FFFFFF"/><rect x="-34" y="-8" width="68" height="34" fill="${C.salvia}"/>
    <path d="M-34 -40 H34" stroke="#D9DEE2" stroke-width="5"/>`,
  huevos: `<rect x="-62" y="-6" width="124" height="46" rx="12" fill="#C9AE84"/>
    <circle cx="-36" cy="-12" r="20" fill="#FBF1DC"/><circle cx="0" cy="-12" r="20" fill="#FBF1DC"/><circle cx="36" cy="-12" r="20" fill="#FBF1DC"/>`,
  aceite: `<rect x="-12" y="-78" width="24" height="26" rx="5" fill="${C.tinta}"/><path d="M-12 -54 H12 Q30 -34 30 -8 V56 Q30 68 18 68 H-18 Q-30 68 -30 56 V-8 Q-30 -34 -12 -54 Z" fill="#CFC872"/>
    <rect x="-30" y="2" width="60" height="32" fill="#FFFDF8"/>`,
  manzana: `<circle r="30" fill="#A7C08F"/><path d="M0 -28 q4 -14 14 -18" stroke="#6B4A32" stroke-width="6" fill="none" stroke-linecap="round"/>`,
};
export function producto(nombre, id, s = 1) {
  return `<g id="${id}"><g transform="scale(${s})">${PRODUCTOS[nombre]}</g></g>`;
}

// Carro de la compra. Origen (0,0): entre las ruedas, en el suelo.
export function carro(id, lleno = true) {
  const dentro = lleno ? `<g transform="translate(-52 -262) scale(.9)">${PRODUCTOS.leche}</g><g transform="translate(18 -268) scale(.9)">${PRODUCTOS.aceite}</g>
    <g transform="translate(-10 -246)">${PRODUCTOS.pan}</g><g transform="translate(70 -236) scale(.8)">${PRODUCTOS.huevos}</g>
    <g transform="translate(-86 -238) scale(.8)">${PRODUCTOS.manzana}</g>` : "";
  return `<g id="${id}"><ellipse cx="0" cy="4" rx="150" ry="16" fill="#3C2814" opacity=".16"/>
    <g id="${id}-carga">${dentro}</g>
    <path d="M-134 -232 L-176 -262" stroke="${C.gris}" stroke-width="14" stroke-linecap="round"/><circle cx="-180" cy="-265" r="13" fill="${C.tinta}"/>
    <path d="M-134 -232 H134 L106 -92 H-106 Z" fill="#DCE2E6" stroke="#9AA6AE" stroke-width="7" stroke-linejoin="round"/>
    <path d="M-66 -232 L-52 -92 M0 -232 V-92 M66 -232 L52 -92 M-120 -162 H120" stroke="#9AA6AE" stroke-width="6"/>
    <path d="M-100 -92 L-88 -44 H88 L100 -92" fill="none" stroke="${C.gris}" stroke-width="10" stroke-linejoin="round"/>
    <circle cx="-76" cy="-22" r="22" fill="${C.tinta}"/><circle cx="-76" cy="-22" r="8" fill="${C.grisClaro}"/>
    <circle cx="76" cy="-22" r="22" fill="${C.tinta}"/><circle cx="76" cy="-22" r="8" fill="${C.grisClaro}"/></g>`;
}

// Moneda grande: por un lado el euro, por el otro el reloj (la unidad del canal).
export function monedaEuro(id, r) {
  return `<g id="${id}"><circle r="${r}" fill="#E9C46A"/><circle r="${r * 0.82}" fill="#F4D98B"/>
    <text x="0" y="${r * 0.36}" text-anchor="middle" font-family="Cap" font-weight="800" font-size="${r * 1.05}" fill="#B98A2E">€</text></g>`;
}
export function reloj(id, r, color = C.tinta) {
  const marcas = Array.from({ length: 12 }, (_, i) => `<line x1="0" y1="${-r * 0.74}" x2="0" y2="${-r * (i % 3 ? 0.66 : 0.58)}" transform="rotate(${i * 30})" stroke="${C.tinta}" stroke-width="${r * 0.04}" stroke-linecap="round"/>`).join("");
  return `<g id="${id}"><circle r="${r}" fill="${color}"/><circle r="${r * 0.84}" fill="${C.blanco}"/>${marcas}
    <g id="${id}-m"><line x1="0" y1="0" x2="0" y2="${-r * 0.56}" stroke="${C.tinta}" stroke-width="${r * 0.07}" stroke-linecap="round"/></g>
    <line x1="0" y1="0" x2="${r * 0.32}" y2="${r * 0.18}" stroke="${C.tinta}" stroke-width="${r * 0.08}" stroke-linecap="round"/><circle r="${r * 0.07}" fill="${C.rojo}"/></g>`;
}

export function nomina(id) {
  return `<g id="${id}"><rect x="-74" y="-96" width="148" height="192" rx="12" fill="${C.blanco}" stroke="#D9DEE2" stroke-width="4"/>
    <rect x="-52" y="-72" width="74" height="14" rx="7" fill="${C.tinta}"/><rect x="-52" y="-42" width="104" height="9" rx="4" fill="#C9CED3"/>
    <rect x="-52" y="-20" width="84" height="9" rx="4" fill="#C9CED3"/><rect x="-52" y="2" width="96" height="9" rx="4" fill="#C9CED3"/>
    <rect x="-52" y="36" width="104" height="36" rx="8" fill="${C.marcador}"/></g>`;
}

export function bocadillo(id) {
  return `<g id="${id}"><path d="M-150 -90 H150 a40 40 0 0 1 40 40 V40 a40 40 0 0 1 -40 40 H-40 L-110 140 L-96 80 H-150 a40 40 0 0 1 -40 -40 V-50 a40 40 0 0 1 40 -40 Z" fill="${C.blanco}" stroke="#E3D6BF" stroke-width="4"/>
    ${[0, 1, 2].map((i) => `<circle id="${id}-p${i}" cx="${-64 + i * 64}" cy="-6" r="17" fill="${C.grisClaro}"/>`).join("")}</g>`;
}

// ------------------------------------------------------------------ decorados
// Pared y suelo, más anchos que el encuadre para que la cámara nunca enseñe el borde.
const FONDO = `<rect x="-300" y="-300" width="1680" height="1572" fill="url(#g-pared)"/>
    <rect x="-300" y="1270" width="1680" height="900" fill="${C.suelo}"/><rect x="-300" y="1262" width="1680" height="14" fill="${C.zocalo}"/>`;
// El súper: una estantería a la izquierda, la caja a la derecha y poco más.
export function setSuper() {
  const prod = (x, base, w, h, col, tapa) => `<rect x="${x}" y="${base - h}" width="${w}" height="${h}" rx="9" fill="${col}"/>${tapa ? `<rect x="${x + w * 0.3}" y="${base - h - 14}" width="${w * 0.4}" height="16" rx="5" fill="${C.gris}" opacity=".55"/>` : ""}`;
  return `<g id="set-super">
    ${FONDO}
    <path d="M-146 2120 L300 1276 M1226 2120 L780 1276 M540 2120 V1276" stroke="${C.zocalo}" stroke-width="5" opacity=".55"/>
    <rect x="22" y="700" width="330" height="566" rx="16" fill="#8FA893"/><rect x="38" y="716" width="298" height="534" rx="8" fill="#B4C7B6"/>
    ${prod(56, 884, 74, 112, "#F1D9A8")}${prod(146, 884, 46, 126, "#DCE7DD", 1)}${prod(210, 884, 100, 94, "#E9C4A6")}
    ${prod(58, 1064, 52, 118, "#F6EBD6", 1)}${prod(126, 1064, 92, 100, "#EAD7B7")}${prod(236, 1064, 66, 124, "#DCE7DD")}
    ${prod(60, 1244, 96, 104, "#E9C4A6")}${prod(172, 1244, 60, 120, "#F1D9A8", 1)}${prod(248, 1244, 62, 96, "#F6EBD6")}
    <rect x="38" y="884" width="298" height="16" fill="${C.salvia}"/><rect x="38" y="1064" width="298" height="16" fill="${C.salvia}"/><rect x="38" y="1244" width="298" height="16" fill="${C.salvia}"/>
    <rect x="950" y="928" width="96" height="116" fill="#34495E"/>
    <rect x="872" y="792" width="200" height="150" rx="20" fill="${C.pantalon}"/><rect x="888" y="808" width="168" height="100" rx="12" fill="#111922"/>
    <text id="caja-num" x="972" y="876" text-anchor="middle" font-family="Cap" font-weight="800" font-size="50" fill="${C.blanco}"></text>
    <text x="972" y="930" text-anchor="middle" font-family="Cap" font-weight="800" font-size="17" fill="${C.grisClaro}" letter-spacing="3">HORAS</text>
    <rect x="706" y="1080" width="700" height="190" fill="${C.madera}"/><rect x="690" y="1046" width="720" height="38" rx="12" fill="${C.maderaClara}"/>
    <rect x="700" y="1034" width="236" height="18" rx="9" fill="#3A4654"/>
  </g>`;
}
export function setLiso() {
  return `<g id="set-liso">${FONDO}</g>`;
}

// ------------------------------------------------------------------ tarjetas (HTML)
export const fuenteHTML = (texto) => `<div class="fuente"><i></i>${esc(texto)}</div>`;
export function tarjeta(n, etiqueta, cuerpo, o = {}) {
  return `<div class="card" id="card-${n}"><div class="kick ${o.tono ? "k-" + o.tono : ""}">${esc(etiqueta)}</div>${cuerpo}${o.fuente ? fuenteHTML(o.fuente) : ""}</div>`;
}
// Jornadas de 8 h: bloques que se llenan (uno entero y la parte que toque del segundo).
export function jornadas(id, tono) {
  return `<div class="jor" id="${id}"><div class="jb"><b class="t-${tono}"></b></div><div class="jb"><b class="t-${tono}"></b></div><span></span></div>`;
}

// ------------------------------------------------------------------ página
const fuente = (fam, fich, peso) => `@font-face{font-family:${fam};src:url("file://${F}/${fich}");font-weight:${peso}}`;
const CSS = `
${fuente("Cap", "montserrat-latin-600-normal.woff2", 600)}${fuente("Cap", "montserrat-latin-800-normal.woff2", 800)}
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:1080px;height:1920px;overflow:hidden;background:#111}
.marco{position:relative;width:1080px;height:1920px;overflow:hidden;font-family:Cap;color:${C.tinta}}
#lienzo{position:absolute;left:0;top:0}
#prog{position:absolute;left:56px;top:148px;width:968px;height:14px;display:flex;gap:12px}
#prog div{flex:var(--f,1);height:14px;border-radius:7px;background:rgba(31,42,55,.16);overflow:hidden}
#prog div i{display:block;height:100%;width:0;border-radius:7px;background:linear-gradient(90deg,${C.ocre},#E2603A)}
.card{position:absolute;left:64px;top:262px;width:952px;background:${C.blanco};border-radius:36px;padding:36px 46px 36px;
  box-shadow:0 22px 44px rgba(60,40,20,.20),0 3px 0 rgba(60,40,20,.06);display:none}
.kick{font:800 30px Cap;letter-spacing:.13em;text-transform:uppercase;color:${C.rojo};margin-bottom:12px}
.k-pasado{color:#8A6316}.k-hoy{color:${C.azul}}
.tit{font:800 72px/1.14 Cap;letter-spacing:-.02em}
.tit mark,.sub mark{background:linear-gradient(${C.marcador},${C.marcador}) no-repeat 0 82%/var(--m,0%) 44%;color:inherit;padding:0 8px;margin:0 -8px}
.sub{font:600 37px/1.3 Cap;color:${C.gris};margin-top:14px}
.fuente{font:600 26px Cap;color:#7A7368;margin-top:18px;display:flex;gap:10px;align-items:center}
.fuente i{width:13px;height:13px;border-radius:50%;background:${C.rojo};flex:none}
.fila{display:flex;align-items:center;gap:26px}
.num{font:800 148px/1 Cap;letter-spacing:-.04em;white-space:nowrap}
.t-pasado{color:#8A6316}.t-hoy{color:${C.azul}}
.uni{font:800 46px/1.1 Cap}.uni small{display:block;font:600 32px Cap;color:${C.gris};margin-top:6px}
.jor{display:flex;align-items:center;gap:12px;margin-top:18px;height:56px}
.jb{width:150px;height:50px;border-radius:14px;background:#ECE6DA;overflow:hidden}
.jb b{display:block;height:100%;width:0;border-radius:14px}
.jb b.t-pasado{background:${C.ocre}}.jb b.t-hoy{background:${C.azul}}
.jor span{font:600 31px Cap;color:${C.gris};margin-left:8px}
.vs{display:flex;align-items:flex-end;gap:22px;margin-top:6px}
.vs .col{flex:1;text-align:center}
.vs .barra{width:150px;margin:10px auto 0;border-radius:18px 18px 6px 6px;height:0}
.vs .v{font:800 84px/1 Cap;letter-spacing:-.03em}
.vs .n{font:600 32px Cap;color:${C.gris};margin-top:10px}
.vs .contra{width:86px;height:86px;border-radius:50%;background:${C.tinta};color:#fff;font:800 32px/86px Cap;text-align:center;flex:none;margin-bottom:120px}
.b3{display:flex;align-items:flex-end;gap:34px;height:230px;position:relative;margin-top:4px;border-bottom:6px solid ${C.tinta}}
.b3 .col{flex:1;text-align:center;position:relative;height:100%;display:flex;flex-direction:column;justify-content:flex-end}
.b3 .barra{border-radius:16px 16px 0 0;height:0}
.b3 .v{font:800 48px/1 Cap;letter-spacing:-.02em;margin-bottom:8px}
.b3 .ref{position:absolute;left:0;right:0;border-top:5px dashed ${C.grisClaro}}
.b3a{display:flex;gap:34px;margin-top:8px}.b3a div{flex:1;text-align:center;font:800 38px/1.1 Cap}
.ops{margin-top:4px}
.op{display:flex;align-items:center;gap:22px;font:800 62px Cap;padding:13px 0;border-top:3px solid #EFE7D8}
.op:first-child{border-top:0}
.op i{width:52px;height:52px;border-radius:50%;border:6px solid #C9CED3;flex:none;position:relative}
.op.si i{background:${C.tinta};border-color:${C.tinta}}
.op.si i::after{content:"";position:absolute;left:13px;top:5px;width:13px;height:24px;border:solid #fff;border-width:0 6px 6px 0;transform:rotate(42deg)}
.op.no{color:#B9BEC4}
.nota{font:600 28px/1.35 Cap;color:${C.gris};margin-top:12px}
#sub{position:absolute;left:0;width:1080px;top:1404px;text-align:center;font:800 94px/1.08 Cap;letter-spacing:-.02em;color:#fff;white-space:nowrap;
  -webkit-text-stroke:16px ${C.tinta};paint-order:stroke fill;text-shadow:0 8px 0 rgba(31,42,55,.35);display:none}
#sub span{display:inline-block}
.rot{font-family:Cap;font-weight:800}`;

const DEFS = `<linearGradient id="g-pared" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.pared1}"/><stop offset="1" stop-color="${C.pared2}"/></linearGradient>`;

// Trozos de subtítulo: dos o tres palabras, cortando en la puntuación.
function trozos(planos) {
  const out = [];
  for (const p of planos) {
    let g = [], largo = 0;
    const cerrar = () => { if (g.length) out.push({ t0: g[0].t0, t1: g.at(-1).t1, txt: g.map((w) => w.p).join(" ") }); g = []; largo = 0; };
    p.pals.forEach((w, i) => {
      const sig = p.pals[i + 1];
      if (g.length && (largo + w.p.length > 15 || g.length >= 3 || (sig === undefined ? false : w.frase !== g[0].frase))) cerrar();
      g.push(w); largo += w.p.length + 1;
      if (/[.,?!…:;]$/.test(w.p)) cerrar();
    });
    cerrar();
  }
  return out;
}

// Toda cifra dibujada debe estar en la «pantalla» del guion, y toda tarjeta con cifras lleva su fuente.
function comprobar(escenas, guion) {
  const fallos = [];
  for (const e of escenas) {
    const b = guion.beats.find((x) => x.n === e.n);
    const permitido = b.pantalla + " " + (b.nota || "") + " " + (guion.no_dato || []).join(" ");
    const texto = (e.tarjeta + " " + e.svg).replace(/<style[\s\S]*?<\/style>/g, "").replace(/<[^>]+>/g, " ");
    const nums = (texto.match(/\d+(?:,\d+)?/g) || []).filter((n) => !/^20\d\d$/.test(n));
    for (const n of nums) if (!permitido.includes(n)) fallos.push(`escena ${e.n}: muestra «${n}», que no está en la pantalla del guion`);
    if (nums.some((n) => !(guion.no_dato || []).includes(n)) && !e.tarjeta.includes('class="fuente"')) fallos.push(`escena ${e.n}: hay cifras y falta la fuente en la tarjeta`);
  }
  if (fallos.length) throw new Error(fallos.join("\n"));
}

export function construirLimpio({ guion, linea, cues, escenas, D }) {
  comprobar(escenas, guion);
  const planos = linea.planos;
  const inicio = (i) => (i === 0 ? 0 : planos[i].ini - ADELANTO);
  const esc2 = escenas.map((e, i) => `{n:${e.n},set:${JSON.stringify(e.set || "super")},t0:${inicio(i).toFixed(3)},t1:${(i + 1 < escenas.length ? inicio(i + 1) : linea.duracion).toFixed(3)},b:${planos[i].ini},c:CUES,
    fn:${e.fn.toString()},cam:${e.cam ? e.cam.toString() : "null"}}`).join(",\n");
  const caps = (guion.capitulos || [{ beats: planos.map((p) => p.n) }]).map((c, i, arr) => {
    const t0 = i === 0 ? 0 : planos.find((p) => p.n === c.beats[0]).ini - ADELANTO;
    const t1 = i + 1 < arr.length ? planos.find((p) => p.n === arr[i + 1].beats[0]).ini - ADELANTO : linea.duracion;
    return { t0: +t0.toFixed(3), t1: +t1.toFixed(3) };
  });
  return `<!doctype html><html lang="es"><head><meta charset="utf-8"><style>${CSS}</style></head><body><div class="marco">
<svg id="lienzo" width="1080" height="1920" viewBox="0 0 1080 1920" xmlns="http://www.w3.org/2000/svg"><defs>${DEFS}</defs>
<g id="mundo">${setSuper()}${setLiso()}
${escenas.map((e) => `<g id="esc-${e.n}" style="display:none">${e.svg}</g>`).join("\n")}</g></svg>
<div id="prog">${caps.map((c) => `<div style="--f:${(c.t1 - c.t0).toFixed(2)}"><i></i></div>`).join("")}</div>
${escenas.map((e) => e.tarjeta).join("\n")}
<div id="sub"><span id="sub-t"></span></div></div>
<script>
const D = ${JSON.stringify(D)};
const CUES = ${JSON.stringify(cues)};
const TROZOS = ${JSON.stringify(trozos(planos))};
const CAPS = ${JSON.stringify(caps)};
const ESCENAS = [${esc2}];
${RT}
</script></body></html>`;
}
