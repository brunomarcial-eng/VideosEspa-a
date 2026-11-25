// Decorados y objetos de T28 (¿tener un bebé cuesta hoy más horas de trabajo?; Bruno, 24-11-2026):
//   · tiendaBebe: una tienda de cosas de bebé de barrio, en perspectiva: escaparate a la calle, estanterías con botes
//     de leche, potitos y paquetes de pañales (sin marcas), ropita colgada, una cuna y un carrito en exposición, un
//     tablón de anuncios y una lámpara («tb-l0»). Primer plano «tb-fg»: un peluche y una caja de regalo.
//     Prefijo para vidaFondo: «tb». Los personajes pisan en y = 1440 (escena entera) o en y = 1700 (en las esquinas).
// Objetos: la barriga de la embarazada, una mochila de guardería, una fila de cunas (llenas o vacías).

import { C } from "./limpio.mjs";

const X0 = -400, ANCHO = 1900, VX = 540, VY = 720;
const txt = (x, y, t, tam, color, o = "", ancla = "middle") => `<text x="${x}" y="${y}" text-anchor="${ancla}" font-family="Cap" font-weight="800" font-size="${tam}" fill="${color}" ${o}>${t}</text>`;
const enX = (x0, y0, x) => VY + (y0 - VY) * (x - VX) / (x0 - VX);
const ROJO = "#B3261E", OCRE = "#C8902E", GRIS = "#C9CED3";
const PASTEL = ["#F4C7C3", "#BFDCEB", "#F7E3A3", "#CDE6C7", "#E3D3EE"];

// Cuna de barrotes (de frente). Origen: centro del suelo. «bebe»: si hay un bebé dormido dentro.
export function cuna(id, col = "#F4F1EA", bebe = false) {
  return `<g id="${id}"><ellipse cx="0" cy="4" rx="150" ry="16" fill="#3C2814" opacity=".14"/>
    <rect x="-140" y="-250" width="16" height="250" rx="6" fill="#B98F64"/><rect x="124" y="-250" width="16" height="250" rx="6" fill="#B98F64"/>
    <rect x="-130" y="-120" width="260" height="70" rx="10" fill="${col}"/>
    ${bebe ? `<g id="${id}-b"><ellipse cx="10" cy="-128" rx="70" ry="24" fill="#BFDCEB"/><circle cx="-56" cy="-136" r="24" fill="#F2CBA8"/><path d="M-66 -138 q6 -4 12 0" stroke="#5A3A22" stroke-width="3" fill="none"/></g>` : ""}
    ${Array.from({ length: 9 }, (_, i) => `<rect x="${-112 + i * 27}" y="-220" width="8" height="160" rx="4" fill="#D9C2A0"/>`).join("")}
    <rect x="-140" y="-230" width="280" height="14" rx="7" fill="#B98F64"/><rect x="-140" y="-64" width="280" height="14" rx="7" fill="#B98F64"/></g>`;
}

// ------------------------------------------------------------------ la tienda
function tiendaBebe() {
  const yIzqT = enX(140, 440, X0), yIzqS = enX(140, 1060, X0), yDerT = enX(940, 440, X0 + ANCHO), yDerS = enX(940, 1060, X0 + ANCHO);
  const tablas = Array.from({ length: 13 }, (_, i) => { const xb = 160 + i * 64; return `<line x1="${xb}" y1="1060" x2="${(VX + (xb - VX) * 4.2).toFixed(0)}" y2="2300" stroke="#D9C9A6" stroke-width="3" opacity=".7"/>`; }).join("");
  const bote = (x, y, col) => `<rect x="${x}" y="${y - 56}" width="34" height="56" rx="6" fill="#FFFDF8" stroke="#D9DEE2" stroke-width="2"/><rect x="${x}" y="${y - 56}" width="34" height="12" rx="5" fill="${col}"/><circle cx="${x + 17}" cy="${y - 24}" r="8" fill="${col}" opacity=".7"/>`;
  const potito = (x, y, col) => `<rect x="${x}" y="${y - 36}" width="26" height="36" rx="5" fill="#F4E9D4"/><rect x="${x - 2}" y="${y - 42}" width="30" height="10" rx="4" fill="${col}"/>`;
  const panales = (x, y, col) => `<rect x="${x}" y="${y - 70}" width="62" height="70" rx="8" fill="${col}"/><rect x="${x + 10}" y="${y - 52}" width="42" height="26" rx="6" fill="#FFFDF8" opacity=".85"/>`;
  const estante = (x) => `<g transform="translate(${x} 1040)"><rect x="0" y="-430" width="300" height="430" fill="#F4F1EA" stroke="#D9DEE2" stroke-width="4"/>
    ${[0, 1, 2].map((f) => { const yy = -16 - f * 140; return `<rect x="0" y="${yy}" width="300" height="12" fill="#D9C9A6"/>` +
      (f === 0 ? [0, 1, 2, 3].map((i) => panales(12 + i * 72, yy, PASTEL[i])).join("") : f === 1 ? Array.from({ length: 7 }, (_, i) => bote(12 + i * 41, yy, PASTEL[i % 5])).join("") : Array.from({ length: 9 }, (_, i) => potito(12 + i * 32, yy, PASTEL[(i + 2) % 5])).join("")); }).join("")}</g>`;
  const ropita = [0, 1, 2, 3].map((i) => { const x = 680 + i * 60; return `<line x1="${x}" y1="560" x2="${x}" y2="590" stroke="#8C969C" stroke-width="3"/>
    <path d="M${x - 24} 590 l-14 20 l12 8 l2 50 h48 l2 -50 l12 -8 l-14 -20 Z" fill="${PASTEL[i]}"/>`; }).join("");
  const lampara = `<g id="tb-l0" data-x="540" data-y="-400"><line x1="540" y1="-400" x2="540" y2="280" stroke="#8C969C" stroke-width="4"/>
    <circle cx="540" cy="310" r="40" fill="#F7E3A3"/><circle cx="540" cy="310" r="100" fill="#FFF7D6" opacity=".18"/></g>`;
  return `<rect x="${X0}" y="-400" width="${ANCHO}" height="2700" fill="#F3EEE6"/>
    <path d="M${X0} -400 H${X0 + ANCHO} V${yDerT} L940 440 H140 L${X0} ${yIzqT} Z" fill="#F8F4EE"/>
    <rect x="140" y="440" width="800" height="620" fill="#E9F1F4"/>
    ${Array.from({ length: 16 }, (_, i) => `<circle cx="${180 + (i % 8) * 100}" cy="${480 + Math.floor(i / 8) * 40}" r="8" fill="${PASTEL[i % 5]}"/>`).join("")}
    <!-- escaparate a la calle -->
    <rect x="640" y="520" width="280" height="0" fill="none"/>
    ${estante(160)}${estante(470)}
    <rect x="660" y="540" width="260" height="10" rx="5" fill="#8C969C"/>${ropita}
    <!-- tablón de anuncios -->
    <g transform="translate(830 780)"><rect x="-80" y="-80" width="160" height="200" rx="8" fill="#C9A26B"/>
      <rect x="-64" y="-64" width="70" height="80" fill="#FFFDF8" transform="rotate(-4)"/><rect x="0" y="-40" width="64" height="70" fill="${PASTEL[1]}" transform="rotate(5)"/>
      <rect x="-50" y="40" width="96" height="64" fill="${PASTEL[2]}" transform="rotate(-2)"/></g>
    <!-- paredes laterales: escaparate a la izquierda -->
    <path d="M${X0} ${yIzqT} L140 440 L140 1060 L${X0} ${yIzqS} Z" fill="#E4EDF1"/>
    <path d="M-300 ${enX(140, 520, -300).toFixed(0)} L100 ${enX(140, 520, 100).toFixed(0)} L100 ${enX(140, 960, 100).toFixed(0)} L-300 ${enX(140, 960, -300).toFixed(0)} Z" fill="#CFE3EE" stroke="#FFFDF8" stroke-width="10"/>
    <path d="M940 440 L${X0 + ANCHO} ${yDerT} L${X0 + ANCHO} ${yDerS} L940 1060 Z" fill="#E1E9ED"/>
    <!-- suelo de madera clara -->
    <path d="M${X0} ${yIzqS} L140 1060 H940 L${X0 + ANCHO} ${yDerS} V2300 H${X0} Z" fill="#E8D9BE"/>${tablas}
    <ellipse cx="540" cy="1280" rx="430" ry="90" fill="#BFDCEB" opacity=".45"/>
    <!-- cuna y carrito de exposición -->
    <g transform="translate(990 1190) scale(.9)">${cuna("tb-cuna", "#F4C7C3")}</g>
    <g transform="translate(60 1190)"><path d="M-110 -160 A110 110 0 0 1 0 -270 V-160 Z" fill="#7C9A7E"/><rect x="-120" y="-160" width="200" height="70" rx="30" fill="#8FB291"/>
      <path d="M80 -150 L130 -240" stroke="#5B6470" stroke-width="10" stroke-linecap="round"/><circle cx="-80" cy="-40" r="34" fill="none" stroke="#5B6470" stroke-width="10"/><circle cx="50" cy="-40" r="34" fill="none" stroke="#5B6470" stroke-width="10"/></g>
    ${lampara}
    <!-- primer plano: un peluche y una caja de regalo -->
    <g id="tb-fg"><g transform="translate(-60 2010)"><circle cx="0" cy="-150" r="80" fill="#C9A26B"/><circle cx="-60" cy="-220" r="30" fill="#C9A26B"/><circle cx="60" cy="-220" r="30" fill="#C9A26B"/>
      <ellipse cx="0" cy="-60" rx="100" ry="80" fill="#C9A26B"/><circle cx="-26" cy="-160" r="8" fill="${C.tinta}"/><circle cx="26" cy="-160" r="8" fill="${C.tinta}"/></g>
      <g transform="translate(1140 2010)"><rect x="-100" y="-170" width="200" height="170" rx="10" fill="${PASTEL[1]}"/><rect x="-14" y="-170" width="28" height="170" fill="${PASTEL[0]}"/>
        <path d="M0 -170 q-60 -60 -40 -10 M0 -170 q60 -60 40 -10" stroke="${PASTEL[0]}" stroke-width="16" fill="none"/></g></g>`;
}

export const DECORADOS_T28 = { tiendaBebe };

// ------------------------------------------------------------------ objetos
// Barriga de embarazada (va en «encima» de persona(), por delante del cuerpo).
export const BARRIGA = `<ellipse cx="6" cy="-236" rx="74" ry="66" fill="#7C9A7E"/><path d="M-60 -230 Q6 -300 72 -230" fill="none" stroke="#647F66" stroke-width="5" opacity=".6"/><ellipse cx="-16" cy="-262" rx="28" ry="18" fill="#FFFFFF" opacity=".16"/>`;

// Mochila de guardería con un osito. Origen: centro de la base.
export function mochila(id) {
  return `<g id="${id}"><path d="M-110 -40 Q-120 -240 0 -250 Q120 -240 110 -40 Q110 0 70 0 H-70 Q-110 0 -110 -40 Z" fill="#F7C95A"/>
    <rect x="-70" y="-120" width="140" height="90" rx="22" fill="#F4A259"/><path d="M-60 -250 Q0 -310 60 -250" fill="none" stroke="#C8902E" stroke-width="16"/>
    <circle cx="0" cy="-180" r="34" fill="#C9A26B"/><circle cx="-26" cy="-206" r="12" fill="#C9A26B"/><circle cx="26" cy="-206" r="12" fill="#C9A26B"/>
    <circle cx="-10" cy="-184" r="5" fill="${C.tinta}"/><circle cx="10" cy="-184" r="5" fill="${C.tinta}"/></g>`;
}

// Fila de cunas: «llenas» con bebé de «n» (las de «<id>-c<i>»), el resto vacías. Rótulo encima. Origen: centro.
export function filaCunas(id, n, llenas, rotulo) {
  const paso = 150;
  return `<g id="${id}">${txt(0, -300, rotulo, 34, C.tinta)}${Array.from({ length: n }, (_, i) => `<g transform="translate(${-(n - 1) * paso / 2 + i * paso} 0) scale(.5)">${cuna(`${id}-c${i}`, PASTEL[i % 5], i < llenas)}</g>`).join("")}</g>`;
}
