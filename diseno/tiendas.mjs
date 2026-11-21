// Decorados de T7 (consumo: ropa, belleza, deporte, música y cine) para los cambios «como en un sueño».
// Mismo sistema que diseno/sueno.mjs: cada decorado es una capa «amb-<nombre>» (se registra con ambientes(extra)).
// Todo dibujado con código, sin marcas, sin artistas reales y sin cifras. El suelo empieza en y = 1300.

import { C } from "./limpio.mjs";

const X0 = -400, ANCHO = 1900;
const txt = (x, y, t, tam, color, o = "") => `<text x="${x}" y="${y}" text-anchor="middle" font-family="Cap" font-weight="800" font-size="${tam}" fill="${color}" ${o}>${t}</text>`;
const pared = (color) => `<rect x="${X0}" y="-400" width="${ANCHO}" height="1720" fill="${color}"/>`;
const tarima = (color, raya) => `<rect x="${X0}" y="1300" width="${ANCHO}" height="1000" fill="${color}"/>
  ${Array.from({ length: 9 }, (_, i) => `<line x1="${X0}" y1="${1340 + i * 90}" x2="${X0 + ANCHO}" y2="${1340 + i * 90}" stroke="${raya}" stroke-width="4"/>`).join("")}`;
const zocalo = (color) => `<rect x="${X0}" y="1276" width="${ANCHO}" height="26" fill="${color}"/>`;

// Camiseta (para perchas, montones y la mano). Origen: hombros, centro.
export const CAMISETA = (col, s = 1) => `<g transform="scale(${s})"><path d="M-46 -40 L-20 -52 Q0 -42 20 -52 L46 -40 L60 -12 L38 -4 V44 H-38 V-4 L-60 -12 Z" fill="${col}"/><path d="M-20 -52 Q0 -36 20 -52" fill="none" stroke="#FFFFFF" stroke-width="4" opacity=".5"/></g>`;
const percha = (x, y, col) => `<g transform="translate(${x} ${y})"><path d="M0 -20 Q0 -34 10 -34 Q18 -34 16 -26" fill="none" stroke="#9AA6AE" stroke-width="5" stroke-linecap="round"/>
  <path d="M-40 -2 L0 -20 L40 -2" fill="none" stroke="#9AA6AE" stroke-width="5" stroke-linejoin="round"/><g transform="translate(0 50)">${CAMISETA(col)}</g></g>`;

// ------------------------------------------------------------------ tienda de ropa
function ropa() {
  const cols = ["#E9C4A6", "#7C9A7E", "#F4F1EA", "#9B5A5A", "#6AADDF", "#E9C46A", "#C98F6B", "#5D7A8C", "#F2B3AC", "#B7D1A8"];
  const barra = (x0, x1, y, n) => `<rect x="${x0}" y="${y - 6}" width="${x1 - x0}" height="12" rx="6" fill="#9AA6AE"/>
    <rect x="${x0 + 10}" y="${y}" width="10" height="${1300 - y}" fill="#9AA6AE"/><rect x="${x1 - 20}" y="${y}" width="10" height="${1300 - y}" fill="#9AA6AE"/>
    ${Array.from({ length: n }, (_, i) => percha(x0 + 60 + i * ((x1 - x0 - 120) / (n - 1)), y + 26, cols[(i * 3 + Math.abs(x0)) % cols.length])).join("")}`;
  const maniqui = (x) => `<g transform="translate(${x} 1300)"><rect x="-6" y="-120" width="12" height="120" fill="${C.gris}"/><ellipse cx="0" cy="-4" rx="60" ry="10" fill="${C.gris}"/>
    <path d="M-60 -420 Q0 -440 60 -420 L50 -230 Q0 -210 -50 -230 Z" fill="#7C9A7E"/><rect x="-14" y="-460" width="28" height="44" rx="10" fill="#E3D6BF"/><circle cx="0" cy="-490" r="40" fill="#E3D6BF"/>
    <path d="M-50 -230 L-40 -120 H40 L50 -230 Z" fill="#5D7A8C"/></g>`;
  return `${pared("#F6ECE6")}
    ${Array.from({ length: 8 }, (_, i) => `<rect x="${X0 + i * 260}" y="-400" width="130" height="1680" fill="#F1E2D8" opacity=".6"/>`).join("")}
    <rect x="290" y="540" width="500" height="120" rx="60" fill="#9B5A5A"/>${txt(540, 620, "MODA", 64, "#FFFDF8", 'letter-spacing="12"')}
    ${barra(-200, 420, 760, 6)}${barra(680, 1280, 760, 6)}
    ${maniqui(540)}
    ${zocalo("#E3CFC0")}${tarima("#E7CFAE", "#D9BE98")}`;
}

// ------------------------------------------------------------------ peluquería
function peluqueria() {
  const azulejos = Array.from({ length: 13 }, (_, i) => Array.from({ length: 4 }, (_, j) =>
    `<rect x="${X0 + i * 150 + 4}" y="${1000 + j * 75 + 4}" width="142" height="67" rx="6" fill="${(i + j) % 2 ? "#DCEBE8" : "#E9F3F1"}"/>`).join("")).join("");
  const espejo = (x) => `<rect x="${x - 120}" y="560" width="240" height="330" rx="120" fill="#C9CED3"/><rect x="${x - 104}" y="576" width="208" height="298" rx="104" fill="#E6F2F6"/>
    <path d="M${x - 60} 640 L${x - 20} 600 M${x - 50} 700 L${x + 10} 640" stroke="#FFFFFF" stroke-width="10" stroke-linecap="round" opacity=".8"/>`;
  const sillon = (x) => `<g transform="translate(${x} 1300)"><rect x="-10" y="-140" width="20" height="140" fill="${C.gris}"/><ellipse cx="0" cy="-6" rx="70" ry="12" fill="${C.gris}"/>
    <rect x="-90" y="-250" width="180" height="110" rx="26" fill="#3B4A5C"/><rect x="-80" y="-420" width="160" height="190" rx="30" fill="#4A5C70"/><rect x="-110" y="-280" width="34" height="90" rx="14" fill="#3B4A5C"/><rect x="76" y="-280" width="34" height="90" rx="14" fill="#3B4A5C"/></g>`;
  const secador = `<g transform="translate(60 1300)"><rect x="-8" y="-420" width="16" height="420" fill="#9AA6AE"/><ellipse cx="0" cy="-6" rx="60" ry="10" fill="#9AA6AE"/>
    <path d="M-110 -500 Q-110 -620 0 -620 Q110 -620 110 -500 Q110 -470 80 -470 H-80 Q-110 -470 -110 -500 Z" fill="#E9C4A6"/><rect x="-14" y="-472" width="28" height="60" fill="#C9A089"/></g>`;
  const botes = [["#F2B3AC", 70], ["#9ED0E6", 90], ["#B7D1A8", 60], ["#E9C46A", 80], ["#C98F6B", 66], ["#F4F1EA", 84]]
    .map(([c, h], i) => `<rect x="${720 + i * 54}" y="${930 - h}" width="38" height="${h}" rx="10" fill="${c}"/><rect x="${728 + i * 54}" y="${918 - h}" width="22" height="16" rx="4" fill="${C.gris}" opacity=".6"/>`).join("");
  return `${pared("#F1F6F5")}${azulejos}
    ${espejo(330)}${espejo(780)}
    <rect x="690" y="930" width="380" height="16" rx="6" fill="#B98A5E"/>${botes}
    <rect x="200" y="930" width="300" height="16" rx="6" fill="#B98A5E"/>
    <path d="M250 930 L262 880 H290 L302 930 Z" fill="#9AA6AE"/><rect x="330" y="880" width="18" height="50" rx="6" fill="#C98F6B"/><rect x="380" y="890" width="60" height="40" rx="10" fill="#F2B3AC"/>
    ${secador}${sillon(330)}${sillon(780)}
    ${zocalo("#D4E4E1")}
    <rect x="${X0}" y="1300" width="${ANCHO}" height="1000" fill="#EDEFF1"/>
    ${Array.from({ length: 22 }, (_, i) => Array.from({ length: 10 }, (_, j) => (i + j) % 2 ? `<rect x="${X0 + i * 90}" y="${1300 + j * 90}" width="90" height="90" fill="#D5D9DD"/>` : "").join("")).join("")}`;
}

// ------------------------------------------------------------------ gimnasio (con pista de pádel detrás del cristal)
function gimnasio() {
  const pesas = Array.from({ length: 6 }, (_, i) => `<g transform="translate(${-180 + i * 70} 1120)"><rect x="-26" y="-8" width="52" height="16" rx="6" fill="${C.gris}"/>
    <rect x="-34" y="-22" width="16" height="44" rx="5" fill="${C.tinta}"/><rect x="18" y="-22" width="16" height="44" rx="5" fill="${C.tinta}"/></g>`).join("");
  return `${pared("#E8EDF1")}
    <rect x="80" y="480" width="920" height="560" rx="18" fill="#9AA6AE"/><rect x="96" y="496" width="888" height="528" rx="10" fill="#CFE6F2"/>
    <rect x="96" y="820" width="888" height="204" fill="#5D8CB5"/>
    <path d="M180 1024 L250 820 H830 L900 1024 Z" fill="#4D7FA9"/><path d="M540 820 V1024 M215 922 H865" stroke="#FFFFFF" stroke-width="5" opacity=".9"/>
    <rect x="200" y="905" width="680" height="10" fill="#2C3E50" opacity=".7"/><path d="M200 905 V860 H880 V905" fill="none" stroke="#2C3E50" stroke-width="5" opacity=".6"/>
    ${Array.from({ length: 6 }, (_, i) => `<line x1="${96 + i * 178}" y1="496" x2="${96 + i * 178}" y2="1024" stroke="#FFFFFF" stroke-width="6" opacity=".55"/>`).join("")}
    <path d="M130 540 L230 500 M150 600 L300 540" stroke="#FFFFFF" stroke-width="10" stroke-linecap="round" opacity=".6"/>
    <rect x="-260" y="1080" width="440" height="16" rx="6" fill="#5B6470"/>${pesas}
    <rect x="${X0}" y="1040" width="${ANCHO}" height="20" fill="#C9D3DA"/>
    ${zocalo("#C9D3DA")}
    <rect x="${X0}" y="1300" width="${ANCHO}" height="1000" fill="#4A5563"/>
    ${Array.from({ length: 10 }, (_, i) => `<line x1="${X0}" y1="${1340 + i * 90}" x2="${X0 + ANCHO}" y2="${1340 + i * 90}" stroke="#55606E" stroke-width="5"/>`).join("")}`;
}

// ------------------------------------------------------------------ tienda de discos
function discos() {
  const cols = ["#9B5A5A", "#E9C46A", "#5D7A8C", "#7C9A7E", "#F2B3AC", "#C98F6B", "#6AADDF", "#F4F1EA"];
  const funda = (x, y, i, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-44" y="-44" width="88" height="88" rx="4" fill="${cols[i % cols.length]}"/>
    <circle r="${10 + (i % 3) * 8}" fill="#FFFFFF" opacity=".35"/><circle r="5" fill="${C.tinta}" opacity=".5"/></g>`;
  const balda = (y, n0) => `<rect x="-160" y="${y}" width="1400" height="14" fill="#8A6A48"/>${Array.from({ length: 12 }, (_, i) => funda(-100 + i * 112, y - 50, n0 + i, 0.95)).join("")}`;
  const cajon = (x, n0) => `<g transform="translate(${x} 1300)"><rect x="-150" y="-200" width="300" height="200" rx="10" fill="#A9794F"/>
    ${Array.from({ length: 6 }, (_, i) => `<rect x="${-130 + i * 44}" y="${-250 + (i % 2) * 8}" width="40" height="70" rx="3" fill="${cols[(n0 + i) % cols.length]}"/>`).join("")}
    <rect x="-150" y="-200" width="300" height="200" rx="10" fill="#A9794F"/><rect x="-130" y="-170" width="260" height="10" rx="5" fill="#8A6A48"/></g>`;
  const poster = (x, y, c1, c2) => `<rect x="${x}" y="${y}" width="160" height="220" rx="8" fill="${c1}"/><circle cx="${x + 80}" cy="${y + 90}" r="50" fill="${c2}"/>
    <path d="M${x + 60} ${y + 170} V${y + 120} L${x + 110} ${y + 110} V${y + 160}" fill="none" stroke="#FFFDF8" stroke-width="8"/><circle cx="${x + 52}" cy="${y + 172}" r="12" fill="#FFFDF8"/><circle cx="${x + 102}" cy="${y + 162}" r="12" fill="#FFFDF8"/>`;
  return `${pared("#F3E6D6")}
    <rect x="300" y="470" width="480" height="110" rx="20" fill="${C.tinta}"/>${txt(540, 548, "DISCOS", 64, "#E9C46A", 'letter-spacing="14"')}
    ${poster(30, 430, "#5D7A8C", "#E9C46A")}${poster(890, 430, "#9B5A5A", "#F2B3AC")}
    ${balda(760, 0)}${balda(930, 5)}
    <rect x="${X0}" y="1000" width="${ANCHO}" height="300" fill="#EAD9C3"/>
    ${cajon(160, 2)}${cajon(540, 4)}${cajon(920, 1)}
    ${zocalo("#D9C3A6")}${tarima("#C9A27A", "#B98F68")}`;
}

// ------------------------------------------------------------------ sala de cine
function cine() {
  const butaca = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-44" y="-120" width="88" height="110" rx="20" fill="#9B4A4A"/><rect x="-50" y="-30" width="100" height="40" rx="12" fill="#7E3B3B"/></g>`;
  const fila = (y, s, n, x0, paso) => Array.from({ length: n }, (_, i) => butaca(x0 + i * paso, y, s)).join("");
  return `${pared("#2B2E3A")}
    <path d="M${X0} -400 H120 Q60 300 160 1300 H${X0} Z" fill="#6E3B3B"/><path d="M1500 -400 H960 Q1020 300 920 1300 H1500 Z" fill="#6E3B3B"/>
    ${Array.from({ length: 5 }, (_, i) => `<path d="M${-300 + i * 90} -400 Q${-330 + i * 90} 400 ${-280 + i * 90} 1300" stroke="#5A2F2F" stroke-width="10" fill="none"/>`).join("")}
    ${Array.from({ length: 5 }, (_, i) => `<path d="M${1060 + i * 90} -400 Q${1090 + i * 90} 400 ${1040 + i * 90} 1300" stroke="#5A2F2F" stroke-width="10" fill="none"/>`).join("")}
    <rect id="amb-cine-pan" x="170" y="560" width="740" height="420" rx="10" fill="#F4F1EA"/>
    <rect x="170" y="560" width="740" height="420" rx="10" fill="url(#g-cine)" opacity=".55"/>
    <defs><linearGradient id="g-cine" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#C9D6E2"/></linearGradient></defs>
    ${fila(1130, 0.8, 9, 40, 125)}${fila(1220, 0.9, 8, 100, 125)}${fila(1310, 1, 8, 60, 140)}
    <rect x="${X0}" y="1300" width="${ANCHO}" height="1000" fill="#3A2F35"/>
    <path d="M${X0} 1300 H1500" stroke="#E9C46A" stroke-width="6" stroke-dasharray="6 40" opacity=".6"/>`;
}

// ------------------------------------------------------------------ concierto
function concierto() {
  const altavoz = (x) => `<g transform="translate(${x} 1060)"><rect x="-70" y="-220" width="140" height="220" rx="12" fill="#1B1E26"/><circle cy="-150" r="38" fill="#3A3F4C"/><circle cy="-150" r="14" fill="#1B1E26"/><circle cy="-60" r="26" fill="#3A3F4C"/></g>`;
  return `${pared("#1E2130")}
    ${Array.from({ length: 40 }, (_, i) => `<circle cx="${-300 + ((i * 397) % 1700)}" cy="${-300 + ((i * 251) % 1100)}" r="${2 + (i % 3)}" fill="#FFFFFF" opacity=".35"/>`).join("")}
    <rect x="-300" y="430" width="1680" height="26" fill="#3A3F4C"/>${Array.from({ length: 8 }, (_, i) => `<rect x="${40 + i * 140}" y="452" width="34" height="40" rx="8" fill="#5B6470"/>`).join("")}
    <rect x="-300" y="1040" width="1680" height="260" fill="#2C3040"/><rect x="-300" y="1040" width="1680" height="20" fill="#454B5E"/>
    ${altavoz(30)}${altavoz(1050)}
    <g transform="translate(540 1040)"><rect x="-6" y="-300" width="12" height="300" fill="#9AA6AE"/><rect x="-14" y="-330" width="28" height="44" rx="12" fill="#5B6470"/><ellipse cx="0" cy="-4" rx="50" ry="10" fill="#9AA6AE"/></g>
    <rect x="${X0}" y="1300" width="${ANCHO}" height="1000" fill="#262A38"/>`;
}

export const DECORADOS_T7 = { ropa, peluqueria, gimnasio, discos, cine, concierto };

// ------------------------------------------------------------------ objetos
export function papelera(id) {
  return `<g id="${id}"><path d="M-56 -150 H56 L44 0 H-44 Z" fill="#9AA6AE"/><rect x="-62" y="-160" width="124" height="20" rx="8" fill="#5B6470"/>
    ${[-24, 0, 24].map((x) => `<line x1="${x}" y1="-130" x2="${x * 0.8}" y2="-16" stroke="#7E8A93" stroke-width="5"/>`).join("")}</g>`;
}
// Etiqueta de precio (cuelga de un hilo). El texto lo pone la escena.
export function etiqueta(id, texto, color = C.rojo) {
  return `<g id="${id}"><line x1="0" y1="-60" x2="0" y2="-2" stroke="${C.gris}" stroke-width="4"/>
    <path d="M-110 0 H90 L130 50 L90 100 H-110 Q-126 100 -126 84 V16 Q-126 0 -110 0 Z" fill="${color}"/><circle cx="96" cy="50" r="10" fill="#FFFDF8"/>
    <text x="-10" y="70" text-anchor="middle" font-family="Cap" font-weight="800" font-size="52" fill="#FFFDF8">${texto}</text></g>`;
}
// Bote de crema (alto variable: se escala en y). Origen: base.
export function bote(id, color) {
  return `<g id="${id}"><rect x="-50" y="-160" width="100" height="160" rx="22" fill="${color}"/><rect x="-36" y="-188" width="72" height="34" rx="8" fill="${C.gris}"/>
    <rect x="-34" y="-110" width="68" height="50" rx="8" fill="#FFFDF8" opacity=".75"/></g>`;
}
// Cinta de correr: el personaje anda encima sin moverse.
export function cinta(id) {
  return `<g id="${id}"><rect x="-150" y="-30" width="300" height="34" rx="14" fill="${C.tinta}"/><rect id="${id}-banda" x="-140" y="-24" width="280" height="10" rx="5" fill="#5B6470" stroke-dasharray="20 14" stroke="#9AA6AE" stroke-width="3"/>
    <path d="M120 -30 L150 -330" stroke="${C.gris}" stroke-width="16" stroke-linecap="round"/><rect x="100" y="-370" width="110" height="60" rx="12" fill="#3A3F4C"/><rect x="112" y="-360" width="86" height="40" rx="6" fill="#7FB3A0"/></g>`;
}
export const PESA_MANO = `<g transform="translate(0 4)"><rect x="-30" y="-6" width="60" height="12" rx="5" fill="${C.gris}"/><rect x="-40" y="-20" width="16" height="40" rx="5" fill="${C.tinta}"/><rect x="24" y="-20" width="16" height="40" rx="5" fill="${C.tinta}"/></g>`;
export const RAQUETA_MANO = `<g transform="rotate(-30) translate(0 -10)"><rect x="-7" y="-10" width="14" height="60" rx="6" fill="${C.tinta}"/><ellipse cx="0" cy="-60" rx="42" ry="52" fill="#E9C46A"/>${[-20, 0, 20].map((x) => `<circle cx="${x}" cy="-70" r="5" fill="#C8902E"/><circle cx="${x}" cy="-48" r="5" fill="#C8902E"/>`).join("")}</g>`;
export const CAMISETA_MANO = `<g transform="translate(10 40) rotate(-10)">${CAMISETA("#F2B3AC", 0.9)}</g>`;
export const VINILO_MANO = `<g transform="translate(0 -40)"><circle cx="34" r="58" fill="#1B1E26"/><circle cx="34" r="20" fill="#E9C46A"/><circle cx="34" r="4" fill="#1B1E26"/>
  <rect x="-60" y="-62" width="124" height="124" rx="4" fill="#9B5A5A"/><circle cx="2" r="34" fill="#F2B3AC" opacity=".6"/></g>`;
export const MOVIL_MANO = `<g transform="translate(6 -40)"><rect x="-30" y="-56" width="60" height="112" rx="12" fill="${C.tinta}"/><rect x="-24" y="-46" width="48" height="88" rx="6" fill="#7FB3A0"/>
  <path d="M-6 -22 V12 M-6 -22 L14 -26 V8" stroke="#FFFDF8" stroke-width="5" fill="none"/><circle cx="-10" cy="14" r="6" fill="#FFFDF8"/><circle cx="10" cy="10" r="6" fill="#FFFDF8"/></g>`;
export const PALOMITAS_MANO = `<g transform="translate(0 -30)"><path d="M-34 -50 H34 L24 40 H-24 Z" fill="#FFFDF8"/>${[-22, -6, 10, 26].map((x) => `<rect x="${x - 4}" y="-50" width="10" height="90" fill="#B3261E" opacity=".8" transform="skewX(${x / 6})"/>`).join("")}
  ${[[-24, -56], [-8, -66], [8, -60], [22, -54], [0, -52], [-14, -48]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="13" fill="#FFF3C4"/>`).join("")}</g>`;
export const ENTRADA_MANO = `<g transform="rotate(-12) translate(0 -26)"><rect x="-50" y="-26" width="100" height="52" rx="6" fill="#E9C46A"/><circle cx="-50" cy="0" r="10" fill="#C8902E"/><circle cx="50" cy="0" r="10" fill="#C8902E"/><path d="M-26 -10 H26 M-26 8 H14" stroke="#8A6316" stroke-width="5"/></g>`;
// Pila de discos (CD con su caja): se escala en y según el gasto. Origen: base.
export function pilaDiscos(id, color) {
  return `<g id="${id}">${Array.from({ length: 12 }, (_, i) => `<rect x="-70" y="${-24 - i * 24}" width="140" height="20" rx="4" fill="${i % 2 ? color : "#FFFDF8"}" stroke="#C9CED3" stroke-width="2"/>`).join("")}</g>`;
}
// Nota musical que flota (sale del móvil).
export function nota(id, color = C.azul) {
  return `<g id="${id}"><path d="M0 0 V-60 L36 -70 V-12" fill="none" stroke="${color}" stroke-width="8" stroke-linejoin="round"/><ellipse cx="-10" cy="2" rx="14" ry="11" fill="${color}"/><ellipse cx="26" cy="-10" rx="14" ry="11" fill="${color}"/></g>`;
}
// Recibo que se repite cada mes (sin cifras).
export function recibo(id) {
  return `<g id="${id}"><path d="M-80 -110 H80 V96 L64 110 L48 96 L32 110 L16 96 L0 110 L-16 96 L-32 110 L-48 96 L-64 110 L-80 96 Z" fill="#FFFDF8" stroke="#E3D6BF" stroke-width="4"/>
    ${txt(0, -60, "CADA MES", 30, C.rojo)}<path d="M-56 -20 H56 M-56 10 H40 M-56 40 H56" stroke="#C9CED3" stroke-width="8" stroke-linecap="round"/>
    <circle cx="44" cy="70" r="22" fill="none" stroke="${C.azul}" stroke-width="6"/><path d="M44 56 V70 L54 76" stroke="${C.azul}" stroke-width="5" fill="none" stroke-linecap="round"/></g>`;
}
// Reloj de «minutos de trabajo»: la cuña se rellena hasta los minutos que toque (la escena cambia «-w»).
export function relojMin(id, color) {
  return `<g id="${id}"><circle r="104" fill="#FFFDF8" stroke="${C.tinta}" stroke-width="10"/>
    ${Array.from({ length: 12 }, (_, i) => `<line x1="0" y1="-90" x2="0" y2="-76" stroke="${C.gris}" stroke-width="6" transform="rotate(${i * 30})"/>`).join("")}
    <path id="${id}-w" d="M0 0 Z" fill="${color}" opacity=".85"/><circle r="10" fill="${C.tinta}"/>
    <line id="${id}-a" x1="0" y1="0" x2="0" y2="-84" stroke="${C.tinta}" stroke-width="8" stroke-linecap="round"/></g>`;
}
// Haz de luz de un foco (se mueve en la escena).
export function foco(id, color) {
  return `<g id="${id}"><path d="M-20 0 L20 0 L180 700 L-180 700 Z" fill="${color}" opacity=".28"/><rect x="-26" y="-30" width="52" height="40" rx="10" fill="#3A3F4C"/></g>`;
}
// Público de un concierto: cabezas y brazos en silueta (cada uno salta por su cuenta en la escena).
export function publico(id, n) {
  const cols = ["#3A3F4C", "#454B5E", "#2F3445"];
  return `<g id="${id}">${Array.from({ length: n }, (_, i) => `<g id="${id}-${i}" transform="translate(${-120 + i * (1320 / (n - 1))} 0)"><g fill="${cols[i % 3]}">
    <rect x="-46" y="-150" width="92" height="190" rx="40"/><circle cy="-188" r="42"/>${i % 3 === 0 ? `<rect x="22" y="-300" width="22" height="150" rx="11" transform="rotate(14 33 -150)"/>` : ""}</g></g>`).join("")}</g>`;
}
// Repartidor en bici con la mochila cúbica (sin marca).
export function repartidor(id) {
  const rueda = (x) => `<g transform="translate(${x} -60)"><circle r="58" fill="none" stroke="${C.tinta}" stroke-width="10"/><g id="${id}-r${x > 0 ? 1 : 0}">${[0, 60, 120].map((a) => `<line x1="-50" y1="0" x2="50" y2="0" stroke="${C.gris}" stroke-width="4" transform="rotate(${a})"/>`).join("")}</g></g>`;
  return `<g id="${id}">${rueda(-110)}${rueda(110)}
    <path d="M-110 -60 L-30 -60 L40 -170 L110 -60 M-30 -60 L-60 -170 M30 -180 H60" fill="none" stroke="#7C9A7E" stroke-width="12" stroke-linejoin="round" stroke-linecap="round"/>
    <g id="${id}-c"><path d="M-62 -180 L-20 -330" stroke="#2C3E50" stroke-width="30" stroke-linecap="round"/><rect x="-60" y="-420" width="80" height="120" rx="34" fill="#5D7A8C" transform="rotate(16 -20 -360)"/>
    <rect x="-140" y="-440" width="110" height="110" rx="12" fill="#7FB3A0"/><rect x="-140" y="-440" width="110" height="20" rx="6" fill="#6A9C89"/>
    <circle cx="10" cy="-466" r="40" fill="#EDBE96"/><path d="M-30 -478 Q10 -530 50 -478 Z" fill="#7FB3A0"/>
    <path d="M10 -380 L60 -190" stroke="#5D7A8C" stroke-width="22" stroke-linecap="round"/></g></g>`;
}
// Caja de paquetería pequeña y bolsa de comida a domicilio.
export function paquete(id, s = 1) {
  return `<g id="${id}"><g transform="scale(${s})"><rect x="-60" y="-90" width="120" height="90" rx="6" fill="#C9A26B"/><rect x="-60" y="-90" width="120" height="20" fill="#B98F58"/>
    <rect x="-10" y="-90" width="20" height="90" fill="#E6D2AE" opacity=".7"/></g></g>`;
}
export function bolsaComida(id) {
  return `<g id="${id}"><path d="M-60 -120 H60 L70 0 H-70 Z" fill="#7FB3A0"/><path d="M-30 -120 Q-30 -160 0 -160 Q30 -160 30 -120" fill="none" stroke="#5E8C7B" stroke-width="10"/>
    <circle cx="0" cy="-60" r="26" fill="#FFFDF8" opacity=".8"/><path d="M-12 -66 H12 M-12 -54 H8" stroke="#5E8C7B" stroke-width="5"/></g>`;
}
export const PAQUETE_MANO = `<g transform="translate(-10 50)"><rect x="-70" y="-100" width="140" height="100" rx="6" fill="#C9A26B"/><rect x="-70" y="-100" width="140" height="22" fill="#B98F58"/><rect x="-12" y="-100" width="24" height="100" fill="#E6D2AE" opacity=".7"/></g>`;

// ------------------------------------------------------------------ T8: banco y gasolinera
function banco() {
  const columna = (x) => `<rect x="${x - 34}" y="420" width="68" height="880" fill="#E6E1D6"/><rect x="${x - 46}" y="400" width="92" height="30" rx="6" fill="#D6D0C2"/><rect x="${x - 46}" y="1270" width="92" height="30" rx="6" fill="#D6D0C2"/>`;
  const ventanilla = (x) => `<rect x="${x - 120}" y="760" width="240" height="250" rx="10" fill="#CFE6F2" stroke="#9AA6AE" stroke-width="8"/><rect x="${x - 40}" y="960" width="80" height="20" rx="8" fill="#9AA6AE"/>`;
  return `${pared("#F1EEE7")}
    <rect x="200" y="520" width="680" height="110" rx="16" fill="#1F5F8B"/>${txt(540, 600, "BANCO", 70, "#FFFDF8", 'letter-spacing="18"')}
    ${columna(70)}${columna(1010)}
    ${ventanilla(330)}${ventanilla(750)}
    <rect x="${X0}" y="1010" width="${ANCHO}" height="290" fill="#B98A5E"/><rect x="${X0}" y="1000" width="${ANCHO}" height="24" rx="8" fill="#8A6A48"/>
    ${Array.from({ length: 10 }, (_, i) => `<rect x="${X0 + 30 + i * 200}" y="1050" width="160" height="220" rx="10" fill="#A9794F"/>`).join("")}
    ${zocalo("#D9D3C6")}
    <rect x="${X0}" y="1300" width="${ANCHO}" height="1000" fill="#E4DED2"/>
    ${Array.from({ length: 22 }, (_, i) => Array.from({ length: 10 }, (_, j) => (i + j) % 2 ? `<rect x="${X0 + i * 90}" y="${1300 + j * 90}" width="90" height="90" fill="#D6CFC0"/>` : "").join("")).join("")}`;
}

function gasolinera() {
  const surtidor = (x) => `<g transform="translate(${x} 1300)"><rect x="-70" y="-330" width="140" height="330" rx="16" fill="#E9EEF1" stroke="#9AA6AE" stroke-width="6"/>
    <rect x="-50" y="-300" width="100" height="70" rx="8" fill="${C.tinta}"/><rect x="-40" y="-290" width="80" height="22" rx="4" fill="#7FB3A0" opacity=".8"/><rect x="-40" y="-262" width="56" height="16" rx="4" fill="#7FB3A0" opacity=".5"/>
    <rect x="-56" y="-200" width="112" height="60" rx="10" fill="#7C9A7E"/><path d="M70 -180 Q110 -170 104 -80 L96 -20" fill="none" stroke="${C.tinta}" stroke-width="10" stroke-linecap="round"/>
    <rect x="62" y="-200" width="24" height="60" rx="6" fill="${C.tinta}"/><rect x="-80" y="-10" width="160" height="14" rx="6" fill="#9AA6AE"/></g>`;
  return `<rect x="${X0}" y="-400" width="${ANCHO}" height="1720" fill="#CFE6F2"/>
    <ellipse cx="900" cy="560" rx="130" ry="42" fill="#FFFFFF" opacity=".85"/><ellipse cx="160" cy="620" rx="110" ry="38" fill="#FFFFFF" opacity=".8"/>
    <rect x="-260" y="640" width="1600" height="90" rx="10" fill="#7C9A7E"/><rect x="-260" y="730" width="1600" height="26" fill="#5F7D61"/>
    ${[40, 1040].map((x) => `<rect x="${x - 22}" y="756" width="44" height="544" fill="#9AA6AE"/>`).join("")}
    ${[150, 300, 450, 600, 750, 900].map((x) => `<rect x="${x - 40}" y="752" width="80" height="12" rx="6" fill="#FFF3C4"/>`).join("")}
    <rect x="${X0}" y="1060" width="${ANCHO}" height="240" fill="#E6E0D3" opacity=".0"/>
    ${surtidor(330)}${surtidor(750)}
    <rect x="${X0}" y="1300" width="${ANCHO}" height="1000" fill="#BFC5CB"/>
    ${Array.from({ length: 8 }, (_, i) => `<rect x="${-300 + i * 220}" y="1500" width="120" height="16" rx="6" fill="#FFFDF8" opacity=".7"/>`).join("")}`;
}

function cajaSuper() {
  const balda = (y, i0) => Array.from({ length: 9 }, (_, i) => `<rect x="${-120 + i * 150}" y="${y - 90 - ((i + i0) % 3) * 14}" width="${70 + ((i + i0) % 2) * 30}" height="${90 + ((i + i0) % 3) * 14}" rx="10" fill="${["#F1D9A8", "#DCE7DD", "#E9C4A6", "#F6EBD6", "#C9DCC9"][(i + i0) % 5]}"/>`).join("") + `<rect x="-200" y="${y}" width="1480" height="16" fill="${C.salvia}"/>`;
  return `${pared("#EEF2EC")}
    <rect x="-200" y="640" width="1480" height="440" fill="#B4C7B6"/>${balda(780, 0)}${balda(940, 2)}${balda(1080, 4)}
    <rect x="300" y="470" width="480" height="100" rx="20" fill="#7C9A7E"/>${txt(540, 540, "CAJA", 58, "#FFFDF8", 'letter-spacing="16"')}
    ${zocalo("#D2CDBE")}
    <rect x="${X0}" y="1300" width="${ANCHO}" height="1000" fill="#E4E0D4"/>
    ${Array.from({ length: 14 }, (_, i) => `<line x1="${X0 + i * 140}" y1="1300" x2="${X0 - 60 + i * 140}" y2="2300" stroke="#D2CDBE" stroke-width="4"/>`).join("")}`;
}

export const DECORADOS_T8 = { banco, gasolinera, caja: cajaSuper };

// Caja registradora con cinta (delante del cajero).
export function cajaRegistradora(id) {
  return `<g id="${id}"><rect x="-220" y="-170" width="440" height="170" rx="14" fill="#9AA6AE"/><rect x="-220" y="-190" width="440" height="30" rx="10" fill="${C.tinta}"/>
    <rect id="${id}-cinta" x="-200" y="-186" width="300" height="22" rx="8" fill="#5B6470" stroke="#9AA6AE" stroke-width="3" stroke-dasharray="18 12"/>
    <rect x="120" y="-300" width="90" height="110" rx="10" fill="#3A3F4C"/><rect x="130" y="-290" width="70" height="40" rx="6" fill="#7FB3A0"/>
    <rect x="130" y="-244" width="70" height="44" rx="6" fill="#C9CED3"/></g>`;
}
// Filete (para la etiqueta del IVA de la carne).
export const FILETE = `<g><path d="M-60 -10 Q-70 -50 -20 -56 Q40 -64 62 -30 Q78 10 30 30 Q-40 50 -60 -10 Z" fill="#C46B5E"/>
  <path d="M-40 -16 Q0 -40 40 -20" fill="none" stroke="#F2D3CC" stroke-width="8" stroke-linecap="round"/><circle cx="34" cy="0" r="10" fill="#F2D3CC"/></g>`;
// Gota de impuesto (gasolina): se escala según el impuesto por litro.
export function gota(id, color) {
  return `<g id="${id}"><path d="M0 -150 Q70 -50 70 0 A70 70 0 0 1 -70 0 Q-70 -50 0 -150 Z" fill="${color}"/><ellipse cx="-24" cy="-10" rx="14" ry="24" fill="#FFFFFF" opacity=".35"/></g>`;
}
// Billete partido: barra de 100 € con la parte del Estado (la escena ajusta el ancho de «-e»).
export function barraBillete(id, ancho = 420) {
  return `<g id="${id}"><rect x="0" y="-34" width="${ancho}" height="68" rx="10" fill="#9CB89E" stroke="#6F8F72" stroke-width="5"/>
    <rect id="${id}-e" x="0" y="-34" width="0" height="68" rx="10" fill="#5B6470"/><circle cx="${ancho - 40}" cy="0" r="20" fill="#C9DCC9" opacity=".8"/></g>`;
}
