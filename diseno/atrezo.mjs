// Atrezo de collage: decorados y objetos de papel recortado, dibujados con código (SVG).
// Cada objeto se devuelve centrado en (0,0) dentro de un <g id="…"> que la escena mueve.
// Filtros: #rc = recorte limpio (borde blanco + sombra); #rcr = papel rasgado.
// Diseño propio y genérico: sin marcas, logos ni personas reales.

import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { OBJETOS } from "./objetos.mjs";
import { titereSVG } from "./titeres.mjs";

const AQUI = path.dirname(fileURLToPath(import.meta.url));
export const T = JSON.parse(readFileSync(path.join(AQUI, "tokens.json"), "utf8")).colores;
const TINTA = T.texto_papel, BLANCO = "#FBF7EE", MADERA = "#7A5C43";

const TONOS = {
  pasado: { pared: "#EBD9B4", tabla: "#A8956F", suelo: "#C9B48C", prods: ["#D9C49A", "#C9B48C", "#B8C2A0", "#E6D7B8", "#BFAE8A"], color: T.ocre, claro: "#E3BC6C", sobre: TINTA },
  hoy: { pared: "#D7E2E8", tabla: "#8FA2AD", suelo: "#AEBFC8", prods: ["#BFD0DA", "#A9BDC8", "#C7D3C6", "#E1E8EA", "#9FB3BF"], color: T.azul, claro: "#5E8FB0", sobre: T.papel },
  neutro: { pared: "#EFE6D6", tabla: "#A8A093", suelo: "#CDBB98", prods: ["#DDD2BE", "#CFC5B2", "#C3CCB9", "#E9E1D2", "#B9B0A0"], color: "#CDBB98", claro: T.papel, sobre: TINTA },
};
export const tono = (n) => TONOS[n];

// Pseudoaleatorio estable para repartir cosas por el decorado.
const rnd = (a, b) => { const x = Math.sin(a * 127.1 + b * 311.7) * 43758.5453; return x - Math.floor(x); };
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");

// ------------------------------------------------------------------ objetos sueltos
export function obj(nombre, id, tam, clase = "") {
  const k = tam / 200;
  return `<g id="${id}"><g filter="url(#rc)" class="atz ${clase}"><g transform="scale(${k}) translate(-100 -100)">${OBJETOS[nombre]}</g></g></g>`;
}

export function carroLleno(id, tam, lleno = true) {
  const k = tam / 200;
  const pieza = (n, x, y, r, s) => `<g class="atz c-${n}" transform="translate(${x} ${y}) rotate(${r}) scale(${s}) translate(-100 -100)">${OBJETOS[n]}</g>`;
  const dentro = lleno ? `<g filter="url(#rc)"><g transform="scale(${k})">
    ${pieza("leche", 6, -62, -4, 0.4)}${pieza("aceite", 40, -64, 5, 0.4)}${pieza("pan", -26, -52, -22, 0.44)}
    ${pieza("huevos", 60, -44, 6, 0.36)}${pieza("manzana", -2, -40, 0, 0.27)}</g></g>` : "";
  return `<g id="${id}">${dentro}<g filter="url(#rc)" class="atz c-carro"><g transform="scale(${k}) translate(-100 -100)">${OBJETOS.carrito}</g></g></g>`;
}

export function dani(id, epoca) {
  return titereSVG({ id, genero: "hombre", epoca, piel: epoca === "antes" ? "#DDAB88" : "#D5A07C", pelo: epoca === "antes" ? "#2E2620" : "#3A322B",
    ropa: epoca === "antes" ? T.ocre : T.azul, ropaOscura: epoca === "antes" ? "#9C6E1F" : "#174A6C" });
}

// Moneda-reloj: la unidad del canal (una moneda = una hora de trabajo).
export function moneda(id, r, t = "neutro") {
  const c = TONOS[t], manos = t === "hoy" ? T.papel : TINTA;
  const marcas = Array.from({ length: 12 }, (_, i) => `<line x1="0" y1="${-r * 0.7}" x2="0" y2="${-r * (i % 3 ? 0.63 : 0.56)}" transform="rotate(${i * 30})" stroke="${manos}" stroke-width="${r * 0.035}" stroke-linecap="round"/>`).join("");
  return `<g id="${id}"><g filter="url(#rc)">
    <circle r="${r}" fill="${c.color}" stroke="${TINTA}" stroke-width="5"/>
    <circle r="${r * 0.8}" fill="${c.claro}" stroke="${TINTA}" stroke-width="3"/>${marcas}
    <g id="${id}-aguja"><line x1="0" y1="0" x2="0" y2="${-r * 0.5}" stroke="${manos}" stroke-width="${r * 0.06}" stroke-linecap="round"/></g>
    <line x1="0" y1="0" x2="${r * 0.3}" y2="${r * 0.16}" stroke="${manos}" stroke-width="${r * 0.07}" stroke-linecap="round"/>
    <circle r="${r * 0.06}" fill="${manos}"/></g></g>`;
}

export function euro(id, r) {
  return `<g id="${id}"><g filter="url(#rc)">
    <circle r="${r}" fill="#CDBB98" stroke="${TINTA}" stroke-width="5"/>
    <circle r="${r * 0.8}" fill="${T.papel}" stroke="${TINTA}" stroke-width="3"/>
    <text x="0" y="${r * 0.36}" text-anchor="middle" font-family="Fraunces" font-weight="900" font-size="${r * 1.05}" fill="${TINTA}">€</text></g></g>`;
}

// Caja registradora cuya pantalla marca horas en vez de euros. El ticket sale por arriba.
export function caja(id, t = "pasado") {
  const teclas = Array.from({ length: 12 }, (_, i) => `<rect x="${-228 + (i % 4) * 66}" y="${-8 + Math.floor(i / 4) * 54}" width="54" height="40" rx="8" fill="#E7DCC8"/>`).join("");
  return `<g id="${id}">
    <g id="${id}-ticket"><rect id="${id}-ticket-r" x="118" y="-272" width="112" height="0" fill="${BLANCO}" stroke="${TINTA}" stroke-width="3"/>
      <rect id="${id}-ticket-l" x="118" y="-272" width="112" height="0" fill="url(#lin-ticket-c)"/></g>
    <g filter="url(#rc)">
      <rect x="-280" y="-30" width="560" height="290" rx="26" fill="#40504A"/>
      <path d="M-236 -30 L-214 -272 H214 L236 -30 Z" fill="#2D3A35"/>
      <rect x="-190" y="-246" width="380" height="158" rx="14" fill="#0F1512"/>
      ${teclas}
      <rect x="58" y="-8" width="170" height="148" rx="12" fill="${TONOS[t].color}"/>
      <rect x="-252" y="176" width="504" height="64" rx="10" fill="#2A3530"/><rect x="-62" y="198" width="124" height="18" rx="9" fill="#8A8378"/>
    </g>
    <text id="${id}-num" x="0" y="-146" text-anchor="middle" font-family="Plex" font-weight="700" font-size="98" fill="${t === "hoy" ? T.azul_tiza : T.ocre}">¿?</text>
    <text x="0" y="-108" text-anchor="middle" font-family="Plex" font-weight="600" font-size="24" fill="${T.gris_tiza}" letter-spacing="2">HORAS DE TRABAJO</text>
  </g>`;
}

export function hojaCal(id, anyo, t = "pasado") {
  const c = TONOS[t];
  return `<g id="${id}"><g filter="url(#rc)">
    <rect x="-140" y="-160" width="280" height="320" rx="14" fill="${BLANCO}"/>
    <path d="M-140 -74 V-146 a14 14 0 0 1 14 -14 H126 a14 14 0 0 1 14 14 V-74 Z" fill="${c.color}"/>
    <circle cx="-72" cy="-160" r="14" fill="${TINTA}"/><circle cx="72" cy="-160" r="14" fill="${TINTA}"/>
    <text x="0" y="80" text-anchor="middle" font-family="Plex" font-weight="700" font-size="104" fill="${TINTA}">${esc(anyo)}</text></g></g>`;
}

// Nómina con la barra del sueldo por hora: base de 2016 en ocre y lo que ha subido, en azul.
export function nomina(id) {
  const lineas = [0, 1, 2].map((i) => `<rect x="-170" y="${-168 + i * 26}" width="${[300, 240, 280][i]}" height="8" rx="4" fill="#B9B2A5"/>`).join("");
  return `<g id="${id}"><g filter="url(#rcr)">
    <rect x="-220" y="-300" width="440" height="600" fill="${BLANCO}"/>
    <text x="-170" y="-222" font-family="Fraunces" font-weight="900" font-size="58" fill="${TINTA}">NÓMINA</text>${lineas}
    <rect x="-85" y="-40" width="170" height="290" fill="url(#rayas-ocre)" stroke="${TINTA}" stroke-width="4"/>
    <rect id="${id}-sube" x="-85" y="-40" width="170" height="0" fill="url(#rayas-azul)" stroke="${TINTA}" stroke-width="4"/>
    <line x1="-190" y1="-40" x2="190" y2="-40" stroke="${TINTA}" stroke-width="4" stroke-dasharray="14 10"/>
    <text x="-190" y="-54" font-family="Plex" font-weight="600" font-size="26" fill="${T.gris_texto_papel}">2016</text>
    <line x1="-190" y1="250" x2="190" y2="250" stroke="${TINTA}" stroke-width="5"/></g></g>`;
}

export function selloCaucho(id) {
  return `<g id="${id}"><g filter="url(#rc)">
    <rect x="-36" y="-232" width="72" height="156" rx="32" fill="${MADERA}"/><rect x="-22" y="-218" width="14" height="110" rx="7" fill="#9A7A5E"/>
    <rect x="-52" y="-90" width="104" height="34" rx="8" fill="#3A2E25"/>
    <rect x="-108" y="-60" width="216" height="62" rx="10" fill="#2B201A"/><rect x="-108" y="2" width="216" height="14" rx="4" fill="#8A8378"/></g></g>`;
}

export function marcaSello(id, palabra) {
  return `<g id="${id}"><g filter="url(#tinta)">
    <rect x="-320" y="-92" width="640" height="184" rx="16" fill="none" stroke="${TINTA}" stroke-width="14"/>
    <text x="0" y="40" text-anchor="middle" font-family="Fraunces" font-weight="900" font-size="112" fill="${TINTA}">${esc(palabra)}</text></g></g>`;
}

export function bocadillo(id) {
  const puntos = [0, 1, 2].map((i) => `<circle id="${id}-p${i}" cx="${-70 + i * 70}" cy="0" r="18" fill="#8A8378"/>`).join("");
  return `<g id="${id}"><g filter="url(#rcr)"><rect x="-190" y="-112" width="380" height="224" rx="72" fill="${BLANCO}"/>
    <path d="M-110 96 L-150 190 L-30 104 Z" fill="${BLANCO}"/></g>${puntos}</g>`;
}

// Ticket tendido de una cuerda: su largo es el dato. (0,0) es el punto de la pinza.
export function ticketCuerda(id, anyo, t) {
  const c = TONOS[t];
  return `<g id="${id}"><g filter="url(#rc)">
    <rect id="${id}-r" x="-105" y="0" width="210" height="80" fill="${BLANCO}"/>
    <rect id="${id}-l" x="-105" y="112" width="210" height="0" fill="url(#lin-ticket)"/>
    <rect id="${id}-x" x="-105" y="0" width="210" height="0" fill="url(#rayas-azul)"/>
    <path id="${id}-z" d="M-105 0 ${Array.from({ length: 7 }, (_, i) => `L${-105 + (i * 2 + 1) * 15} 16 L${-105 + (i * 2 + 2) * 15} 0`).join(" ")} Z" fill="${BLANCO}"/>
    <rect x="-105" y="0" width="210" height="100" fill="${c.color}"/>
    <text x="0" y="86" text-anchor="middle" font-family="Plex" font-weight="700" font-size="48" fill="${c.sobre}">${esc(anyo)}</text></g>
    <text id="${id}-v" x="0" y="0" text-anchor="middle" font-family="Plex" font-weight="700" font-size="52" fill="${t === "hoy" ? T.azul : T.ocre_texto_papel}"></text>
    <g filter="url(#rc)"><rect x="-15" y="-36" width="30" height="66" rx="6" fill="${MADERA}"/><rect x="-15" y="-8" width="30" height="8" fill="#3A2E25"/></g></g>`;
}

export function ticketLargo(id, titulo) {
  const w = 520, h = 620;
  return `<g id="${id}"><g filter="url(#rcr)">
    <path d="M${-w / 2} ${-h / 2} H${w / 2} V${h / 2} ${Array.from({ length: 13 }, (_, i) => `L${w / 2 - (i * 2 + 1) * 20} ${h / 2 + 18} L${w / 2 - (i * 2 + 2) * 20} ${h / 2}`).join(" ")} Z" fill="${BLANCO}"/>
    <rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="92" fill="${T.azul}"/>
    <text x="0" y="${-h / 2 + 62}" text-anchor="middle" font-family="Plex" font-weight="700" font-size="46" fill="${T.papel}">${esc(titulo)}</text>
    <rect x="${-w / 2}" y="${-h / 2 + 110}" width="${w}" height="${h - 130}" fill="url(#lin-ticket-g)"/></g></g>`;
}

// Etiqueta de papel con una o varias líneas de texto (ancho estimado por nº de letras).
export function etiq(id, lineas, o = {}) {
  const ls = Array.isArray(lineas) ? lineas : [lineas];
  const tam = o.tam ?? 34, fuente = o.fuente ?? "Plex", peso = o.peso ?? (fuente === "Plex" ? 600 : 900);
  const factor = fuente === "Plex" ? 0.6 : 0.66;
  const w = o.ancho ?? Math.max(...ls.map((l) => l.length)) * tam * factor + (o.pad ?? 44), alto = ls.length * tam * 1.28 + (o.pad ?? 44) * 0.7;
  const textos = ls.map((l, i) => `<text x="0" y="${-alto / 2 + (o.pad ?? 44) * 0.35 + tam * 0.98 + i * tam * 1.28}" text-anchor="middle" font-family="${fuente}" font-weight="${peso}" font-size="${tam}" fill="${o.color ?? TINTA}">${esc(l)}</text>`).join("");
  return `<g id="${id}"><g filter="url(#${o.filtro ?? "rcr"})"><rect x="${-w / 2}" y="${-alto / 2}" width="${w}" height="${alto}" rx="${o.rx ?? 0}" fill="${o.fondo ?? BLANCO}"/></g>${textos}</g>`;
}

// Ficha de cifra: ocre con texto negro (pasado) o azul con texto claro (hoy).
export function chip(id, texto, t, tam = 110) {
  const c = TONOS[t], w = texto.length * tam * 0.6 + tam * 0.7, h = tam * 1.3;
  return `<g id="${id}"><g filter="url(#rc)"><rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="${tam * 0.16}" fill="${t === "neutro" ? BLANCO : c.color}"/></g>
    <text x="0" y="${tam * 0.35}" text-anchor="middle" font-family="Plex" font-weight="700" font-size="${tam}" fill="${c.sobre}">${esc(texto)}</text></g>`;
}

// ------------------------------------------------------------------ decorados
export function fondoSuper(t, id = "") {
  const c = TONOS[t];
  let s = `<g ${id ? `id="${id}"` : ""}><rect width="1080" height="1920" fill="${c.pared}"/>`;
  [640, 880, 1120].forEach((y, fila) => {
    let x = -10, i = 0;
    while (x < 1090) {
      const w = 52 + rnd(fila, i) * 58, h = 96 + rnd(i, fila + 9) * 96, col = c.prods[Math.floor(rnd(i + 3, fila) * c.prods.length)];
      s += `<rect x="${x.toFixed(0)}" y="${(y - h).toFixed(0)}" width="${w.toFixed(0)}" height="${h.toFixed(0)}" rx="7" fill="${col}"/>`;
      if (rnd(i, fila + 4) > 0.45) s += `<rect x="${(x + 8).toFixed(0)}" y="${(y - h * 0.62).toFixed(0)}" width="${(w - 16).toFixed(0)}" height="${(h * 0.26).toFixed(0)}" rx="4" fill="${c.pared}" opacity=".75"/>`;
      x += w + 9; i++;
    }
    s += `<rect x="0" y="${y}" width="1080" height="20" fill="${c.tabla}"/><rect x="0" y="${y + 20}" width="1080" height="8" fill="${TINTA}" opacity=".12"/>`;
  });
  return s + `<rect width="1080" height="1920" fill="url(#trama-fondo)" opacity=".5"/></g>`;
}

// Primer término del súper: dos cajas de fruta en las esquinas de abajo, para dar profundidad.
export function primerTermino(t) {
  const c = TONOS[t];
  const cajon = (x, giro) => {
    const frutas = Array.from({ length: 7 }, (_, i) => `<circle cx="${40 + i * 52 + (i % 2) * 8}" cy="${-18 - (i % 3) * 16}" r="34" fill="${["#A9BF98", "#C9B48C", "#B9C9A6"][i % 3]}" stroke="${TINTA}" stroke-width="4"/>`).join("");
    return `<g transform="translate(${x} 1700) rotate(${giro})"><g filter="url(#rc)">${frutas}
      <rect x="0" y="0" width="400" height="260" fill="${c.tabla}"/><rect x="0" y="46" width="400" height="14" fill="${TINTA}" opacity=".22"/>
      <rect x="0" y="118" width="400" height="14" fill="${TINTA}" opacity=".22"/><rect x="0" y="190" width="400" height="14" fill="${TINTA}" opacity=".22"/></g></g>`;
  };
  return cajon(-90, -4) + cajon(770, 5);
}

export function suelo(t, y = 1290) {
  const c = TONOS[t];
  const borde = Array.from({ length: 19 }, (_, i) => `L${i * 60} ${y + (rnd(i, 7) - 0.5) * 12}`).join(" ");
  const juntas = Array.from({ length: 6 }, (_, i) => `<line x1="${-100 + i * 240}" y1="${y + 14}" x2="${-260 + i * 300}" y2="1920" stroke="${TINTA}" stroke-width="3" opacity=".14"/>`).join("");
  return `<g filter="url(#rcr)"><path d="M-20 ${y} ${borde} L1100 ${y} V1940 H-20 Z" fill="${c.suelo}"/></g>${juntas}`;
}

export function fondoPapel(t) {
  const c = TONOS[t];
  return `<rect width="1080" height="1920" fill="${c.pared}"/>
    <rect x="640" y="430" width="560" height="380" fill="url(#periodico)" opacity=".5" transform="rotate(7 900 600)"/>
    <rect x="-120" y="1180" width="520" height="420" fill="url(#periodico)" opacity=".45" transform="rotate(-6 140 1380)"/>
    <circle cx="180" cy="700" r="260" fill="url(#trama-fondo)" opacity=".9"/>
    <rect width="1080" height="1920" fill="url(#trama-fondo)" opacity=".35"/>`;
}

export function fondoOscuro() {
  return `<rect width="1080" height="1920" fill="${T.pizarra}"/><rect width="1080" height="1920" fill="url(#foco)"/>
    <rect width="1080" height="1920" fill="url(#trama-clara)" opacity=".5"/>`;
}

export function mostrador(y = 1090) {
  return `<g filter="url(#rc)"><rect x="-20" y="${y}" width="1120" height="860" fill="#4A3F35"/></g>
    <rect x="-20" y="${y}" width="1120" height="26" fill="#6E5D4C"/><rect x="-20" y="${y + 26}" width="1120" height="10" fill="${TINTA}" opacity=".25"/>
    ${[1, 2, 3, 4].map((i) => `<rect x="-20" y="${y + 36 + i * 170}" width="1120" height="6" fill="${TINTA}" opacity=".16"/>`).join("")}`;
}

// ------------------------------------------------------------------ definiciones
export const DEFS_ATREZO = `
<filter id="rc" x="-25%" y="-25%" width="150%" height="150%" color-interpolation-filters="sRGB">
  <feMorphology in="SourceAlpha" operator="dilate" radius="6" result="borde"/>
  <feFlood flood-color="${BLANCO}"/><feComposite in2="borde" operator="in" result="papel"/>
  <feGaussianBlur in="borde" stdDeviation="3.5"/><feOffset dx="7" dy="9"/>
  <feComponentTransfer result="sombra"><feFuncA type="linear" slope="0.34"/></feComponentTransfer>
  <feMerge><feMergeNode in="sombra"/><feMergeNode in="papel"/><feMergeNode in="SourceGraphic"/></feMerge>
</filter>
<filter id="rcr" x="-12%" y="-25%" width="124%" height="150%" color-interpolation-filters="sRGB">
  <feMorphology in="SourceAlpha" operator="dilate" radius="7" result="borde"/>
  <feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves="2" seed="5" result="ruido"/>
  <feDisplacementMap in="borde" in2="ruido" scale="13" xChannelSelector="R" yChannelSelector="G" result="roto"/>
  <feFlood flood-color="${BLANCO}"/><feComposite in2="roto" operator="in" result="papel"/>
  <feGaussianBlur in="roto" stdDeviation="3.5"/><feOffset dx="7" dy="9"/>
  <feComponentTransfer result="sombra"><feFuncA type="linear" slope="0.34"/></feComponentTransfer>
  <feMerge><feMergeNode in="sombra"/><feMergeNode in="papel"/><feMergeNode in="SourceGraphic"/></feMerge>
</filter>
<filter id="tinta" x="-10%" y="-20%" width="120%" height="140%">
  <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="3" result="r"/>
  <feColorMatrix in="r" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 -3.2 2.3" result="g"/>
  <feComposite in="SourceGraphic" in2="g" operator="in"/>
</filter>
<filter id="grano" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="1" seed="4"/>
  <feColorMatrix type="matrix" values="0 0 0 0 0.1 0 0 0 0 0.09 0 0 0 0 0.08 0 0 0 0.16 0"/></filter>
<pattern id="trama-fondo" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(28)"><circle cx="7" cy="7" r="2.2" fill="${TINTA}" opacity=".12"/></pattern>
<pattern id="trama-clara" width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(28)"><circle cx="8" cy="8" r="2.4" fill="${T.papel}" opacity=".1"/></pattern>
<pattern id="rayas-ocre" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="12" height="12" fill="#E3BC6C"/><rect width="6" height="12" fill="${T.ocre}"/></pattern>
<pattern id="rayas-azul" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)"><rect width="12" height="12" fill="#5E8FB0"/><rect width="6" height="12" fill="${T.azul}"/></pattern>
<pattern id="lin-ticket" width="210" height="34" patternUnits="userSpaceOnUse" x="-105"><rect x="22" y="12" width="112" height="7" rx="3" fill="#C4BDB0"/><rect x="156" y="12" width="32" height="7" rx="3" fill="#C4BDB0"/></pattern>
<pattern id="lin-ticket-c" width="112" height="26" patternUnits="userSpaceOnUse" x="118"><rect x="14" y="10" width="56" height="5" rx="2" fill="#C4BDB0"/><rect x="80" y="10" width="18" height="5" rx="2" fill="#C4BDB0"/></pattern>
<pattern id="lin-ticket-g" width="520" height="52" patternUnits="userSpaceOnUse" x="-260"><rect x="50" y="20" width="270" height="10" rx="5" fill="#C4BDB0"/><rect x="390" y="20" width="80" height="10" rx="5" fill="#C4BDB0"/></pattern>
<radialGradient id="foco" cx="50%" cy="46%" r="55%"><stop offset="0" stop-color="#4A5E55" stop-opacity=".9"/><stop offset="1" stop-color="${T.pizarra}" stop-opacity="0"/></radialGradient>
<radialGradient id="vineta" cx="50%" cy="50%" r="75%"><stop offset=".62" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".38"/></radialGradient>
<linearGradient id="sombra-sub" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#141C19" stop-opacity=".94"/><stop offset=".62" stop-color="#141C19" stop-opacity=".72"/><stop offset="1" stop-color="#141C19" stop-opacity="0"/></linearGradient>`;

export const CSS_ATREZO = `
.atz .l{stroke:${TINTA};stroke-width:5;stroke-linecap:round;stroke-linejoin:round;vector-effect:non-scaling-stroke}
.atz .f{fill:#E7DCC8}.atz .f2{fill:${T.salvia}}.atz .f3{fill:#CDBB98}
.atz path.l:not(.f):not(.f2):not(.f3),.atz circle.l:not(.f):not(.f2):not(.f3),.atz ellipse.l:not(.f):not(.f2):not(.f3){fill:none}
.c-carro .f2{fill:#B9B2A5}.c-carro .f{fill:#3A3A3A}
.c-pan .f{fill:#E3C792}.c-leche .f{fill:${BLANCO}}.c-leche .f2{fill:#C9D6CC}.c-leche .f3{fill:#DCD3C2}
.c-huevos .f2{fill:#F3E7CF}.c-huevos .f{fill:#B9A27C}
.c-aceite .f{fill:#CFC97F}.c-aceite .f2{fill:${BLANCO}}.c-aceite .f3{fill:#3A3A3A}
.c-manzana .f{fill:#A9BF98}.c-manzana .f2{fill:${T.salvia}}`;
