// Decorado y objetos de T18 («¿Cuál es el coche más vendido?», coches B con dos cuñados en un bar; Bruno, 22-11-2026):
// un bar de barrio en perspectiva, con la barra a la izquierda, botellas, la tele, lámparas que se mecen, gente al fondo y
// una cristalera a la derecha que da a la calle (por ella pasan coches y el camión portacoches). Distinto del bar de T10 y T14.
// Capa para ambientes() de sueno.mjs; prefijo para vidaFondo: «bb». Los personajes pisan en y = 1440.

import { C, paseante } from "./limpio.mjs";
import { coche } from "./transporte.mjs";

const X0 = -400, ANCHO = 1900, VX = 520, VY = 700;
const txt = (x, y, t, tam, color, o = "") => `<text x="${x}" y="${y}" text-anchor="middle" font-family="Cap" font-weight="800" font-size="${tam}" fill="${color}" ${o}>${t}</text>`;
const enX = (x0, y0, x) => VY + (y0 - VY) * (x - VX) / (x0 - VX);

function barBarrio() {
  const yIzqT = enX(160, 460, X0), yIzqS = enX(160, 1040, X0), yDerT = enX(900, 460, X0 + ANCHO), yDerS = enX(900, 1040, X0 + ANCHO);
  const baldosas = Array.from({ length: 16 }, (_, i) => { const xb = 160 + i * 50; return `<line x1="${xb}" y1="1040" x2="${(VX + (xb - VX) * 4.4).toFixed(0)}" y2="2300" stroke="#B9AFA0" stroke-width="3"/>`; }).join("")
    + [1075, 1125, 1195, 1300, 1460, 1700].map((y) => `<line x1="${X0}" y1="${y}" x2="${X0 + ANCHO}" y2="${y}" stroke="#B9AFA0" stroke-width="3"/>`).join("");
  const botellas = (dy) => Array.from({ length: 9 }, (_, i) => `<rect x="${200 + i * 30}" y="${(i % 2 ? 560 : 566) + dy}" width="18" height="${i % 2 ? 60 : 54}" rx="6" fill="${["#5F9F4A", "#8E6644", "#C8902E", "#9AA6AE"][(i + dy / 80) % 4]}"/><rect x="${205 + i * 30}" y="${(i % 2 ? 546 : 552) + dy}" width="8" height="16" fill="#5B4636"/>`).join("");
  const lampara = (i, x, y, s) => `<g id="bb-l${i}" data-x="${x}" data-y="-400"><line x1="${x}" y1="-400" x2="${x}" y2="${y}" stroke="#5B4636" stroke-width="${4 * s}"/>
    <path d="M${x - 50 * s} ${y + 40 * s} H${x + 50 * s} L${x + 26 * s} ${y} H${x - 26 * s} Z" fill="#3F6B5A"/><circle cx="${x}" cy="${y + 44 * s}" r="${12 * s}" fill="#FFF3C4"/>
    <ellipse cx="${x}" cy="${y + 110 * s}" rx="${120 * s}" ry="${50 * s}" fill="#FFF7D6" opacity=".12"/></g>`;
  return `<rect x="${X0}" y="-400" width="${ANCHO}" height="2700" fill="#EFE3CF"/>
    <path d="M${X0} -400 H${X0 + ANCHO} V${yDerT} L900 460 H160 L${X0} ${yIzqT} Z" fill="#F6EEE2"/>
    <!-- pared del fondo: estantes con botellas, la tele y la pizarra (sin precios) -->
    <rect x="160" y="460" width="740" height="580" fill="#E4D3B8"/>
    <rect x="180" y="620" width="300" height="12" fill="#8E6644"/><rect x="180" y="700" width="300" height="12" fill="#8E6644"/>${botellas(0)}${botellas(80)}
    <rect x="560" y="520" width="200" height="120" rx="8" fill="${C.tinta}"/><rect x="570" y="530" width="180" height="100" rx="4" fill="#3E8E8A" opacity=".85"/><path d="M600 610 l40 -50 l30 30 l20 -20 l40 40 Z" fill="#9BC77A" opacity=".8"/>
    <rect x="560" y="680" width="200" height="150" rx="6" fill="#2F3B35"/>${txt(660, 730, "HOY", 30, "#FFFDF8")}${txt(660, 780, "TORTILLA", 26, "#F4D06F")}
    <!-- barra a la izquierda, en perspectiva, con grifos y cafetera -->
    <path d="M${X0} ${enX(160, 880, X0).toFixed(0)} L300 ${enX(160, 880, 300).toFixed(0)} L300 ${enX(160, 1040, 300).toFixed(0)} L${X0} ${enX(160, 1040, X0).toFixed(0)} Z" fill="#8E6644"/>
    <path d="M${X0} ${(enX(160, 880, X0) - 40).toFixed(0)} L300 ${(enX(160, 880, 300) - 14).toFixed(0)} L300 ${enX(160, 880, 300).toFixed(0)} L${X0} ${enX(160, 880, X0).toFixed(0)} Z" fill="#C99A6B"/>
    <g transform="translate(120 ${(enX(160, 880, 120) - 20).toFixed(0)})"><rect x="-10" y="-90" width="20" height="90" fill="#C9CED3"/><rect x="-40" y="-110" width="80" height="26" rx="10" fill="#C9CED3"/>
      <rect x="-34" y="-84" width="10" height="34" fill="#9AA6AE"/><rect x="24" y="-84" width="10" height="34" fill="#9AA6AE"/></g>
    <g transform="translate(-140 ${(enX(160, 880, -140) - 24).toFixed(0)})"><rect x="-90" y="-150" width="180" height="150" rx="14" fill="#B8BFC6"/><rect x="-70" y="-130" width="140" height="60" rx="8" fill="#5B6470"/>
      <rect x="-60" y="-40" width="30" height="40" fill="#5B6470"/><rect x="30" y="-40" width="30" height="40" fill="#5B6470"/></g>
    <!-- cristalera a la derecha: calle con un coche aparcado y los que pasan («bb-c0», «bb-camion») -->
    <path d="M900 460 L${X0 + ANCHO} ${yDerT} L${X0 + ANCHO} ${yDerS} L900 1040 Z" fill="#DCCBAE"/>
    <clipPath id="bb-cristal"><path d="M940 ${enX(900, 520, 940).toFixed(0)} L1400 ${enX(900, 520, 1400).toFixed(0)} L1400 ${enX(900, 1000, 1400).toFixed(0)} L940 ${enX(900, 1000, 940).toFixed(0)} Z"/></clipPath>
    <g clip-path="url(#bb-cristal)"><rect x="900" y="200" width="600" height="1100" fill="#BFE3F2"/><rect x="900" y="900" width="600" height="400" fill="#9AA6AE"/>
      <g id="bb-c0"><g transform="scale(.42)">${coche("bb-c0-a", "#5B6470")}</g></g>
      <g id="bb-camion"><rect x="-260" y="-190" width="420" height="16" fill="#5B6470"/><rect x="-260" y="-100" width="420" height="16" fill="#5B6470"/>
        <rect x="160" y="-170" width="110" height="140" rx="12" fill="#E0B04A"/><rect x="190" y="-150" width="60" height="50" rx="6" fill="#BFE3F2"/>
        ${[-200, -60].map((x) => `<g transform="translate(${x + 60} -190) scale(.26)">${coche(`bb-cm${x}`, "#C9A0C2")}</g><g transform="translate(${x + 60} -100) scale(.26)">${coche(`bb-cn${x}`, "#9AA6AE")}</g>`).join("")}
        ${[-220, -40, 120, 230].map((x) => `<circle cx="${x}" cy="-14" r="26" fill="${C.tinta}"/>`).join("")}</g></g>
    <path d="M940 ${enX(900, 520, 940).toFixed(0)} L1400 ${enX(900, 520, 1400).toFixed(0)}" stroke="#5B4636" stroke-width="14"/><path d="M940 ${enX(900, 1000, 940).toFixed(0)} L1400 ${enX(900, 1000, 1400).toFixed(0)}" stroke="#5B4636" stroke-width="18"/>
    <rect x="932" y="${enX(900, 520, 940).toFixed(0)}" width="16" height="${(enX(900, 1000, 940) - enX(900, 520, 940)).toFixed(0)}" fill="#5B4636"/>
    <!-- suelo de baldosas -->
    <path d="M${X0} ${yIzqS} L160 1040 H900 L${X0 + ANCHO} ${yDerS} V2300 H${X0} Z" fill="#D7CDBE"/>${baldosas}
    <!-- mesas altas al fondo con gente -->
    ${[[420, 1080, 0.42], [700, 1090, 0.45]].map(([x, y, s]) => `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cx="0" cy="4" rx="90" ry="14" fill="#3C2814" opacity=".16"/><rect x="-60" y="-14" width="120" height="16" rx="8" fill="#5B6470"/><rect x="-9" y="-320" width="18" height="310" fill="#5B6470"/><ellipse cx="0" cy="-330" rx="130" ry="24" fill="#C99A6B"/></g>`).join("")}
    ${paseante("bb-w0", "#7C9A7E", "#F2CBA8", 1)}${paseante("bb-w1", "#C9A0C2", "#E9BE98", 1)}
    ${lampara(0, 330, 300, 0.9)}${lampara(1, 720, 300, 0.9)}${lampara(2, 520, 120, 1.2)}
    <!-- primer plano: el borde de una mesa alta, desenfocado -->
    <g id="bb-fg"><ellipse cx="1060" cy="1860" rx="260" ry="60" fill="#8E6644"/><ellipse cx="1060" cy="1844" rx="260" ry="60" fill="#C99A6B"/><rect x="1046" y="1880" width="28" height="400" fill="#5B6470"/></g>`;
}
export const DECORADOS_T18 = { barBarrio };

// Podio de tres escalones con un coche y un cartel con el nombre en cada uno. «<id>-k0..2» son los grupos de cada puesto.
export function podio(id, coches) {
  const pos = [[0, -200, 1], [-300, -130, 2], [300, -80, 3]];
  return `<g id="${id}">${pos.map(([x, h, n], i) => `<rect x="${x - 140}" y="${-h}" width="280" height="${h}" rx="10" fill="${["#E0B04A", "#C9CED3", "#C98F6B"][i]}"/>${txt(x, -h + 70, n + "º", 60, "#FFFDF8")}`).join("")}
    ${coches.map((c, i) => { const [x, h] = pos[i]; return `<g id="${id}-k${i}"><g transform="translate(${x} ${-h - 10}) scale(${c.s ?? 0.48})">${coche(`${id}-c${i}`, c.col)}</g>
      <rect x="${x - 125}" y="${-h - 230}" width="250" height="58" rx="12" fill="#FFFDF8" stroke="${c.col}" stroke-width="6"/>${txt(x, -h - 190, c.nombre, 30, C.tinta)}</g>`; }).join("")}</g>`;
}
// Caña para la mano.
export { CANA_MANO, mesaAlta } from "./sueno.mjs";
