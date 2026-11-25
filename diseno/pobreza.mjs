// Decorados y objetos de T27 (¿hay más pobres que antes?; Bruno, 24-11-2026):
//   · almacen: el almacén de un banco de alimentos de barrio, en perspectiva: pared de ladrillo, estanterías con latas,
//     botellas y paquetes, cajas de cartón rotuladas, un cartel genérico «RECOGIDA DE ALIMENTOS», la mesa de reparto con
//     bolsas y una lámpara («ba-l0»). Primer plano «ba-fg»: un palé con cajas. Prefijo para vidaFondo: «ba».
//     Los personajes pisan en y = 1440 (escena entera) o en y = 1700 (en las esquinas).
// Objetos: el chaleco de voluntaria, una regla «vara de 2008», cinco muñequitos (uno encendido) y una hucha vacía.

import { C } from "./limpio.mjs";
import { cajaMudanza } from "./alquiler.mjs";

const X0 = -400, ANCHO = 1900, VX = 540, VY = 720;
const txt = (x, y, t, tam, color, o = "", ancla = "middle") => `<text x="${x}" y="${y}" text-anchor="${ancla}" font-family="Cap" font-weight="800" font-size="${tam}" fill="${color}" ${o}>${t}</text>`;
const enX = (x0, y0, x) => VY + (y0 - VY) * (x - VX) / (x0 - VX);
const ROJO = "#B3261E", OCRE = "#C8902E", GRIS = "#C9CED3";

// ------------------------------------------------------------------ el almacén
function almacen() {
  const yIzqT = enX(140, 440, X0), yIzqS = enX(140, 1060, X0), yDerT = enX(940, 440, X0 + ANCHO), yDerS = enX(940, 1060, X0 + ANCHO);
  const ladrillos = Array.from({ length: 15 }, (_, f) => Array.from({ length: 12 }, (_, k) =>
    `<rect x="${140 + k * 70 + (f % 2 ? 35 : 0)}" y="${440 + f * 42}" width="64" height="36" rx="3" fill="${["#C98B6A", "#BF7F5E", "#D29676"][(f + k) % 3]}"/>`).join("")).join("");
  const lata = (x, y, col) => `<rect x="${x}" y="${y - 44}" width="30" height="44" rx="4" fill="${col}"/><rect x="${x}" y="${y - 34}" width="30" height="12" fill="#FFFDF8" opacity=".85"/>`;
  const botella = (x, y) => `<rect x="${x + 6}" y="${y - 70}" width="14" height="16" rx="3" fill="#E3E7EA"/><rect x="${x}" y="${y - 58}" width="26" height="58" rx="8" fill="#F4F1EA" stroke="#D9DEE2" stroke-width="2"/>`;
  const paquete = (x, y, col) => `<rect x="${x}" y="${y - 52}" width="36" height="52" rx="4" fill="${col}"/><rect x="${x + 6}" y="${y - 40}" width="24" height="14" rx="3" fill="#FFFDF8" opacity=".8"/>`;
  const estanteria = (x, y) => `<g transform="translate(${x} ${y})"><rect x="0" y="-420" width="14" height="420" fill="#5B6470"/><rect x="346" y="-420" width="14" height="420" fill="#5B6470"/>
    ${[0, 1, 2].map((f) => { const yy = -20 - f * 140; return `<rect x="0" y="${yy}" width="360" height="12" fill="#7C8790"/>` +
      Array.from({ length: 9 }, (_, i) => { const xx = 18 + i * 37; return f === 0 ? paquete(xx, yy, ["#C8902E", "#E3C06A", "#9E3D3D"][i % 3]) : f === 1 ? lata(xx + 2, yy, ["#B3261E", "#3F7A4A", "#C8902E"][i % 3]) : botella(xx + 4, yy); }).join(""); }).join("")}</g>`;
  const lampara = `<g id="ba-l0" data-x="540" data-y="-400"><line x1="540" y1="-400" x2="540" y2="260" stroke="#3B3B3B" stroke-width="4"/>
    <path d="M480 260 H600 L640 320 H440 Z" fill="#3F6B5A"/><circle cx="540" cy="324" r="16" fill="#FFF3C4"/><path d="M440 320 L360 640 H720 L640 320 Z" fill="#FFF7D6" opacity=".10"/></g>`;
  const mesa = `<g transform="translate(540 1215)"><ellipse cx="0" cy="40" rx="340" ry="26" fill="#3C2814" opacity=".14"/>
      <rect x="-330" y="-150" width="660" height="30" rx="6" fill="#B98F64"/><rect x="-310" y="-120" width="20" height="160" fill="#7C8790"/><rect x="290" y="-120" width="20" height="160" fill="#7C8790"/>
      ${[-220, -60, 100, 240].map((x, i) => `<g transform="translate(${x} -150)"><path d="M-50 0 L-40 -110 H40 L50 0 Z" fill="${i % 2 ? "#E8D7B4" : "#F4F1EA"}" stroke="#D9C9A6" stroke-width="3"/>
        <path d="M-24 -110 Q0 -150 24 -110" fill="none" stroke="#D9C9A6" stroke-width="6"/>${i % 2 ? `<rect x="-20" y="-150" width="16" height="44" rx="5" fill="#3F7A4A"/>` : `<circle cx="10" cy="-120" r="16" fill="#E98A2E"/>`}</g>`).join("")}</g>`;
  return `<rect x="${X0}" y="-400" width="${ANCHO}" height="2700" fill="#E6E2DA"/>
    <path d="M${X0} -400 H${X0 + ANCHO} V${yDerT} L940 440 H140 L${X0} ${yIzqT} Z" fill="#EFECE6"/>
    <!-- pared de ladrillo con el cartel -->
    <g><clipPath id="ba-pared"><rect x="140" y="440" width="800" height="620"/></clipPath><g clip-path="url(#ba-pared)"><rect x="140" y="440" width="800" height="620" fill="#B9775A"/>${ladrillos}</g></g>
    <g transform="translate(540 520)"><rect x="-250" y="-46" width="500" height="92" rx="12" fill="#FFFDF8" stroke="#3F6B5A" stroke-width="8"/>${txt(0, 16, "RECOGIDA DE ALIMENTOS", 38, "#3F6B5A")}</g>
    ${estanteria(160, 1040)}${estanteria(560, 1040)}
    <!-- paredes laterales -->
    <path d="M${X0} ${yIzqT} L140 440 L140 1060 L${X0} ${yIzqS} Z" fill="#D8D2C8"/>
    <path d="M940 440 L${X0 + ANCHO} ${yDerT} L${X0 + ANCHO} ${yDerS} L940 1060 Z" fill="#D2CCC1"/>
    <path d="M990 ${enX(940, 520, 990).toFixed(0)} L1170 ${enX(940, 520, 1170).toFixed(0)} L1170 ${enX(940, 1060, 1170).toFixed(0)} L990 ${enX(940, 1060, 990).toFixed(0)} Z" fill="#8C969C"/>
    ${Array.from({ length: 8 }, (_, i) => `<line x1="990" y1="${(enX(940, 520, 990) + 30 + i * 60).toFixed(0)}" x2="1170" y2="${(enX(940, 520, 1170) + 30 + i * 60 * 1.1).toFixed(0)}" stroke="#7C8790" stroke-width="5"/>`).join("")}
    <!-- suelo de cemento -->
    <path d="M${X0} ${yIzqS} L140 1060 H940 L${X0 + ANCHO} ${yDerS} V2300 H${X0} Z" fill="#C9C6BE"/>
    ${[1100, 1200, 1350, 1600, 1950].map((y) => `<line x1="${X0}" y1="${y}" x2="${X0 + ANCHO}" y2="${y}" stroke="#B6B2A9" stroke-width="3"/>`).join("")}
    <path d="M${X0} 1200 H${X0 + ANCHO}" stroke="#E0B04A" stroke-width="10" opacity=".6"/>
    <!-- cajas al fondo, a los lados -->
    <g transform="translate(60 1160)">${cajaMudanza("ba-k0", 210, 150, "LEGUMBRES")}<g transform="translate(0 -150)">${cajaMudanza("ba-k1", 180, 120, "", -3)}</g></g>
    <g transform="translate(1040 1170)">${cajaMudanza("ba-k2", 220, 160, "ACEITE")}<g transform="translate(-10 -160)">${cajaMudanza("ba-k3", 170, 120, "", 4)}</g></g>
    ${mesa}${lampara}
    <!-- primer plano: un palé con cajas -->
    <g id="ba-fg"><g transform="translate(-40 2020)"><rect x="-200" y="-40" width="400" height="40" fill="#B98F64"/><rect x="-200" y="-8" width="400" height="8" fill="#8E6644"/>
      <g transform="translate(-80 -40)">${cajaMudanza("ba-fg0", 200, 170, "")}</g><g transform="translate(110 -40)">${cajaMudanza("ba-fg1", 170, 140, "", 3)}</g></g></g>`;
}

export const DECORADOS_T27 = { almacen };

// ------------------------------------------------------------------ objetos
// Chaleco de voluntaria (encima del cuerpo, sin logotipos).
export const CHALECO = `<path d="M-82 -372 Q-60 -380 -30 -372 L-24 -180 H-82 Z" fill="#E98A2E"/><path d="M82 -372 Q60 -380 30 -372 L24 -180 H82 Z" fill="#E98A2E"/>
  <rect x="-82" y="-270" width="58" height="10" fill="#F4F1EA" opacity=".9"/><rect x="24" y="-270" width="58" height="10" fill="#F4F1EA" opacity=".9"/>`;

// Cinco muñequitos en fila; el primero, encendido («<id>-p0»; los demás, gris). Rótulo debajo. Origen: centro.
export function cincoPersonas(id, rotulo, col = ROJO) {
  const p = (i) => `<g id="${id}-p${i}" fill="${i === 0 ? col : GRIS}" transform="translate(${-240 + i * 120} 0)"><circle cx="0" cy="-110" r="34"/><rect x="-46" y="-70" width="92" height="110" rx="34"/></g>`;
  return `<g id="${id}"><rect x="-340" y="-190" width="680" height="320" rx="24" fill="#FFFDF8" opacity=".95"/>${Array.from({ length: 5 }, (_, i) => p(i)).join("")}${txt(0, 100, rotulo, 34, C.tinta)}</g>`;
}

// Una regla de madera con la marca «vara de 2008» (para medir las columnas). Origen: el extremo izquierdo.
export function regla(id, largo = 700) {
  return `<g id="${id}"><rect x="0" y="-26" width="${largo}" height="52" rx="8" fill="#E0B04A" stroke="#A97E56" stroke-width="4"/>
    ${Array.from({ length: Math.floor(largo / 35) }, (_, i) => `<line x1="${20 + i * 35}" y1="-26" x2="${20 + i * 35}" y2="${i % 2 ? -10 : 2}" stroke="#8E6644" stroke-width="4"/>`).join("")}
    ${txt(largo / 2, 18, "LA VARA DE 2008", 26, "#5B4636")}</g>`;
}

// Hucha de cerdito vacía, con una factura que cae («<id>-f»). Origen: centro de la base.
export function hucha(id) {
  return `<g id="${id}"><ellipse cx="0" cy="-90" rx="130" ry="96" fill="#F0A8B8"/><circle cx="110" cy="-110" r="40" fill="#F0A8B8"/><ellipse cx="140" cy="-104" rx="20" ry="16" fill="#E68FA3"/>
    <circle cx="96" cy="-130" r="8" fill="${C.tinta}"/><path d="M60 -170 l20 -34 l20 30 Z" fill="#E68FA3"/><rect x="-40" y="-192" width="70" height="12" rx="6" fill="#B85C74"/>
    ${[-80, -30, 30, 80].map((x) => `<rect x="${x - 14}" y="-14" width="28" height="22" rx="6" fill="#E68FA3"/>`).join("")}
    <g id="${id}-f"><g transform="translate(-260 -240) rotate(-12)"><rect x="-80" y="-100" width="160" height="200" rx="10" fill="#FFFDF8" stroke="#D9DEE2" stroke-width="4"/>
      <rect x="-80" y="-100" width="160" height="40" rx="10" fill="${ROJO}"/>${txt(0, -72, "FACTURA", 22, "#FFFFFF")}
      ${[-30, 0, 30].map((y) => `<rect x="-56" y="${y}" width="112" height="12" rx="6" fill="#E3E7EA"/>`).join("")}</g></g></g>`;
}
