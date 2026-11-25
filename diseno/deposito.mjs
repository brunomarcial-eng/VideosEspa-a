// Decorados y objetos de T24 (¿cuántas horas trabajas para llenar el depósito?; Bruno, 24-11-2026):
//   · gasolinera: una gasolinera de barrio al atardecer, en perspectiva: cielo naranja, ciudad al fondo, carretera
//     con coches que pasan («gs-c0», «gs-c1»), marquesina con luces, isla con el surtidor («gs-disp-e» y «gs-disp-l»:
//     importe y litros, que escribe el guion), tótem sin precios y el coche familiar con la manguera puesta (nada en la
//     mano). Primer plano «gs-fg». Prefijo para vidaFondo: «gs». Los personajes pisan en y = 1440 (escena entera) o
//     en y = 1700 (en las esquinas).
// Objetos: la pantalla del surtidor en grande, la barra de una jornada de trabajo que se llena, una foto de 2007 y dos
// bidones de litros por hogar. Sin cifras dibujadas salvo las que se pasan (van en la pantalla del guion).

import { C } from "./limpio.mjs";

const X0 = -400, ANCHO = 1900;
const txt = (x, y, t, tam, color, o = "", ancla = "middle") => `<text x="${x}" y="${y}" text-anchor="${ancla}" font-family="Cap" font-weight="800" font-size="${tam}" fill="${color}" ${o}>${t}</text>`;
const ROJO = "#B3261E", OCRE = "#C8902E", VERDE = "#3F7A4A", TEAL = "#2F6F6A";

// Coche compacto de perfil, mirando a la derecha. Origen: centro del suelo bajo el coche. Tapón del depósito en (-150, -150).
export function coche(id, col = "#4F8A7A", o = {}) {
  const rueda = (x) => `<g transform="translate(${x} -34)"><circle r="46" fill="#2B2F33"/><circle r="24" fill="#AEB6BC"/><circle r="8" fill="#5B6470"/></g>`;
  return `<g id="${id}"><ellipse cx="0" cy="4" rx="300" ry="20" fill="#2B2F33" opacity=".22"/>
    <path d="M-270 -40 Q-282 -120 -230 -140 L-150 -160 Q-90 -250 0 -254 L80 -254 Q150 -250 200 -170 L260 -150 Q292 -130 286 -60 L280 -40 Z" fill="${col}"/>
    <path d="M-130 -168 Q-80 -236 -6 -238 L-6 -168 Z" fill="#CFE3EC"/><path d="M14 -238 L70 -238 Q130 -234 172 -168 L14 -168 Z" fill="#CFE3EC"/>
    <path d="M-270 -90 H286" stroke="#FFFFFF" stroke-opacity=".25" stroke-width="10"/>
    <rect x="236" y="-120" width="40" height="22" rx="8" fill="#FFF3C4"/><rect x="-272" y="-118" width="26" height="22" rx="6" fill="#E06A4E"/>
    <rect x="-40" y="-150" width="40" height="10" rx="5" fill="#2B2F33" opacity=".5"/><rect x="100" y="-150" width="40" height="10" rx="5" fill="#2B2F33" opacity=".5"/>
    <rect x="-168" y="-158" width="34" height="28" rx="6" fill="${o.tapon ?? "#2B2F33"}" opacity=".85"/>
    ${rueda(-170)}${rueda(170)}</g>`;
}

// Surtidor con su pantalla («<id>-e» importe y «<id>-l» litros, texto que escribe el guion) y la manguera.
function surtidor(x, y, s, id) {
  return `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-90" y="-420" width="180" height="420" rx="16" fill="#F4F1EA" stroke="#C9CED3" stroke-width="5"/>
    <rect x="-90" y="-420" width="180" height="60" rx="16" fill="${TEAL}"/><rect x="-90" y="-380" width="180" height="20" fill="${TEAL}"/>
    <rect x="-66" y="-330" width="132" height="110" rx="10" fill="#1E2A30"/>
    ${txt(52, -290, "€", 26, "#8FE3A8", "", "end")}<text id="${id}-e" x="40" y="-288" text-anchor="end" font-family="Cap" font-weight="800" font-size="34" fill="#8FE3A8"></text>
    ${txt(52, -238, "L", 26, "#8FE3A8", "", "end")}<text id="${id}-l" x="36" y="-236" text-anchor="end" font-family="Cap" font-weight="800" font-size="34" fill="#8FE3A8"></text>
    <rect x="-60" y="-190" width="120" height="70" rx="8" fill="#E3E7EA"/><circle cx="-30" cy="-155" r="16" fill="${OCRE}"/><circle cx="30" cy="-155" r="16" fill="${VERDE}"/>
    <rect x="70" y="-250" width="34" height="80" rx="10" fill="#2B2F33"/></g>`;
}

// ------------------------------------------------------------------ la gasolinera al atardecer
function gasolinera() {
  const ciudad = [[-340, 200, 260], [-120, 160, 330], [60, 220, 240], [300, 150, 380], [470, 230, 280], [720, 170, 350], [900, 240, 260], [1160, 200, 320]]
    .map(([x, w, h], i) => `<rect x="${x}" y="${900 - h}" width="${w}" height="${h}" fill="${["#B98E8A", "#A98382", "#C29C93"][i % 3]}" opacity=".75"/>` +
      Array.from({ length: Math.floor(h / 70) }, (_, f) => Array.from({ length: Math.floor(w / 50) }, (_, k) =>
        (k + f) % 3 ? "" : `<rect x="${x + 14 + k * 50}" y="${900 - h + 18 + f * 70}" width="22" height="30" rx="3" fill="#FFE9A8" opacity=".85"/>`).join("")).join("")).join("");
  const cocheCalle = (i, col, y) => `<g id="gs-c${i}" transform="translate(${i ? 1400 : -300} ${y}) scale(.42 .42)">${coche(`gs-cc${i}`, col)}</g>`;
  const luces = [140, 380, 620, 860].map((x) => `<rect x="${x - 60}" y="512" width="120" height="16" rx="6" fill="#FFF7D6"/><path d="M${x - 70} 528 L${x - 150} 1000 H${x + 150} L${x + 70} 528 Z" fill="#FFF7D6" opacity=".10"/>`).join("");
  return `<defs><linearGradient id="gs-cielo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E9A27A"/><stop offset=".55" stop-color="#F4C795"/><stop offset="1" stop-color="#F8DDB0"/></linearGradient></defs>
    <rect x="${X0}" y="-400" width="${ANCHO}" height="2700" fill="url(#gs-cielo)"/>
    <circle cx="820" cy="640" r="110" fill="#FBE3A6" opacity=".9"/><circle cx="820" cy="640" r="200" fill="#FBE3A6" opacity=".25"/>
    <ellipse cx="160" cy="240" rx="170" ry="34" fill="#F7D9C4" opacity=".8"/><ellipse cx="660" cy="150" rx="130" ry="28" fill="#F7D9C4" opacity=".7"/>
    ${ciudad}
    <!-- carretera al fondo con coches que pasan -->
    <rect x="${X0}" y="900" width="${ANCHO}" height="120" fill="#6E747A"/>
    ${Array.from({ length: 12 }, (_, i) => `<rect x="${X0 + 40 + i * 170}" y="956" width="90" height="8" rx="4" fill="#F4F1EA" opacity=".8"/>`).join("")}
    ${cocheCalle(0, "#C8902E", 990)}${cocheCalle(1, "#8C969C", 960)}
    <!-- explanada de la gasolinera -->
    <path d="M${X0} 1020 H${X0 + ANCHO} V2300 H${X0} Z" fill="#C9C6BE"/>
    ${[1080, 1180, 1330, 1560, 1900].map((y) => `<line x1="${X0}" y1="${y}" x2="${X0 + ANCHO}" y2="${y}" stroke="#B6B2A9" stroke-width="4"/>`).join("")}
    ${Array.from({ length: 10 }, (_, i) => `<line x1="${-200 + i * 160}" y1="1020" x2="${-200 + (i - 4.5) * 420 + 540}" y2="2300" stroke="#B6B2A9" stroke-width="4"/>`).join("")}
    <ellipse cx="360" cy="1300" rx="90" ry="18" fill="#8E8A82" opacity=".35"/><ellipse cx="880" cy="1520" rx="70" ry="14" fill="#8E8A82" opacity=".3"/>
    <!-- marquesina -->
    <rect x="${X0 + 100}" y="420" width="${ANCHO - 200}" height="96" fill="#F4F1EA"/><rect x="${X0 + 100}" y="470" width="${ANCHO - 200}" height="30" fill="${TEAL}"/>
    <rect x="${X0 + 100}" y="512" width="${ANCHO - 200}" height="10" fill="#B6B2A9"/>${luces}
    <rect x="60" y="522" width="44" height="640" fill="#E3E0D8"/><rect x="1000" y="522" width="44" height="640" fill="#E3E0D8"/>
    <!-- tótem sin precios -->
    <g transform="translate(1210 1060)"><rect x="-18" y="-60" width="36" height="60" fill="#5B6470"/><rect x="-110" y="-470" width="220" height="410" rx="16" fill="${TEAL}"/>
      <circle cx="0" cy="-400" r="44" fill="#F4F1EA"/><path d="M0 -430 Q24 -398 18 -382 Q12 -366 0 -366 Q-12 -366 -18 -382 Q-24 -398 0 -430 Z" fill="${OCRE}"/>
      ${["GASÓLEO", "GASOLINA"].map((t, i) => `<rect x="-92" y="${-330 + i * 120}" width="184" height="96" rx="10" fill="#F4F1EA"/>${txt(0, -268 + i * 120, t, 30, C.tinta)}`).join("")}</g>
    <!-- isla con el surtidor, la manguera y el coche -->
    <rect x="250" y="1160" width="300" height="40" rx="12" fill="#E3E0D8"/><rect x="250" y="1196" width="300" height="14" rx="6" fill="#B6B2A9"/>
    ${surtidor(400, 1165, 1, "gs-disp")}
    <g transform="translate(760 1250)">${coche("gs-coche", "#4F8A7A")}</g>
    <path d="M492 920 Q470 1120 560 1150 Q600 1160 612 1108" fill="none" stroke="#2B2F33" stroke-width="12" stroke-linecap="round"/>
    <path d="M598 1096 l30 -6 l6 22 l-30 6 Z" fill="${OCRE}"/>
    <!-- primer plano: la papelera y el aire de las ruedas -->
    <g id="gs-fg"><g transform="translate(-60 1980)"><rect x="-70" y="-200" width="140" height="200" rx="18" fill="${TEAL}"/><rect x="-80" y="-220" width="160" height="30" rx="10" fill="#244F4B"/></g>
      <g transform="translate(1150 2010)"><rect x="-60" y="-300" width="120" height="300" rx="14" fill="#E3E0D8"/><circle cx="0" cy="-220" r="34" fill="#F4F1EA" stroke="#5B6470" stroke-width="6"/>
        <path d="M60 -160 Q120 -120 90 -40" fill="none" stroke="#2B2F33" stroke-width="10"/></g></g>`;
}

export const DECORADOS_T24 = { gasolinera };

// ------------------------------------------------------------------ objetos
// La pantalla del surtidor en grande: importe («<id>-e») y litros («<id>-l»), que escribe el guion. Origen: centro.
export function pantallaSurtidor(id) {
  return `<g id="${id}"><rect x="-300" y="-190" width="600" height="380" rx="30" fill="#F4F1EA" stroke="#C9CED3" stroke-width="6"/>
    <rect x="-250" y="-150" width="500" height="300" rx="18" fill="#1E2A30"/>
    ${txt(-220, -70, "IMPORTE", 30, "#5E9C77", "", "start")}${txt(220, 40, "€", 60, "#8FE3A8", "", "end")}
    <text id="${id}-e" x="160" y="40" text-anchor="end" font-family="Cap" font-weight="800" font-size="110" fill="#8FE3A8"></text>
    <line x1="-230" y1="70" x2="230" y2="70" stroke="#3B4A57" stroke-width="4"/>
    ${txt(-220, 126, "LITROS", 30, "#5E9C77", "", "start")}<text id="${id}-l" x="220" y="128" text-anchor="end" font-family="Cap" font-weight="800" font-size="56" fill="#8FE3A8"></text></g>`;
}

// Barra de una jornada de trabajo (de 8 horas, con una marca por hora y sin números) que se llena hasta la fracción que
// pide el guion («<id>-f», con transform-origin a la izquierda). Rótulo encima y valor a la derecha («<id>-v»). Origen: centro.
export function jornada(id, rotulo, valor, col = ROJO, W = 640, fondo = false) {
  return `<g id="${id}">${fondo ? `<rect x="${-W / 2 - 30}" y="-100" width="${W + 60}" height="160" rx="22" fill="#FFFDF8" opacity=".95"/>` : ""}${txt(-W / 2, -46, rotulo, 36, C.tinta, "", "start")}
    <rect x="${-W / 2}" y="-28" width="${W}" height="64" rx="14" fill="#E3E7EA"/>
    <rect id="${id}-f" x="${-W / 2}" y="-28" width="${W}" height="64" rx="14" fill="${col}" style="transform-box:fill-box;transform-origin:0 50%;transform:scaleX(0)"/>
    ${Array.from({ length: 7 }, (_, i) => `<line x1="${-W / 2 + (i + 1) * W / 8}" y1="-28" x2="${-W / 2 + (i + 1) * W / 8}" y2="36" stroke="#FFFFFF" stroke-width="4" opacity=".8"/>`).join("")}
    <g id="${id}-v" opacity="0">${txt(W / 2, -46, valor, 40, col, "", "end")}</g></g>`;
}

// Foto de 2007 (marco de papel, en sepia): la gasolinera de entonces con el coche nuevo y el surtidor con su importe. Origen: centro.
export function foto2007(id, importe, pie) {
  return `<g id="${id}"><g transform="rotate(-4)"><rect x="-300" y="-260" width="600" height="560" rx="10" fill="#FFFDF8" stroke="#E3DCCB" stroke-width="5"/>
    <clipPath id="${id}-c"><rect x="-270" y="-230" width="540" height="420"/></clipPath>
    <g clip-path="url(#${id}-c)" filter="url(#${id}-sepia)"><rect x="-270" y="-230" width="540" height="420" fill="#E9C9A0"/>
      <rect x="-270" y="-120" width="540" height="40" fill="#5E9C77"/><rect x="-270" y="80" width="540" height="110" fill="#BDB6A6"/>
      <g transform="translate(-170 80) scale(.55)">${surtidor(0, 0, 1, `${id}-s`)}</g>
      ${txt(-170, -110, importe, 40, C.tinta)}
      <g transform="translate(90 120) scale(.62)">${coche(`${id}-car`, "#7C9A7E")}</g></g>
    ${txt(0, 260, pie, 44, C.tinta)}</g>
    <defs><filter id="${id}-sepia"><feColorMatrix type="matrix" values=".39 .77 .19 0 0  .35 .69 .17 0 0  .27 .53 .13 0 0  0 0 0 1 0"/></filter></defs></g>`;
}

// Bidón de carburante, con su altura proporcional a los litros. Origen: centro de la base.
export function bidon(id, alto, col, rotulo, valor) {
  const w = 220;
  return `<g id="${id}"><g id="${id}-b" style="transform-box:fill-box;transform-origin:50% 100%">
      <path d="M${-w / 2} 0 V${-alto + 40} Q${-w / 2} ${-alto} ${-w / 2 + 40} ${-alto} H${w / 2 - 70} L${w / 2} ${-alto + 60} V0 Z" fill="${col}"/>
      <rect x="${w / 2 - 70}" y="${-alto - 40}" width="44" height="50" rx="8" fill="#2B2F33"/>
      <path d="M${-w / 2 + 30} ${-alto + 30} H${w / 2 - 90}" stroke="#FFFFFF" stroke-opacity=".35" stroke-width="14" stroke-linecap="round"/>
      <path d="M${-w / 2 + 40} ${-alto * 0.55} L${w / 2 - 40} ${-alto * 0.25} M${w / 2 - 40} ${-alto * 0.55} L${-w / 2 + 40} ${-alto * 0.25}" stroke="#000000" stroke-opacity=".12" stroke-width="14"/></g>
    ${txt(0, 56, rotulo, 40, C.tinta)}<g id="${id}-v">${txt(0, -alto - 56, valor, 46, col)}</g></g>`;
}
