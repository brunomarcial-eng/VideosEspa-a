// Decorado y objetos de T18 («¿Cuál es el coche más vendido?», coches B con dos cuñados en un bar; Bruno, 22-11-2026):
// un bar de barrio en perspectiva, con la barra a la izquierda, botellas, la tele, lámparas que se mecen, gente al fondo y
// una ventana al fondo que da a la calle (por ella pasa el camión portacoches) y la pizarra del menú a la derecha. Distinto del bar de T10 y T14.
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
    <clipPath id="bb-cristal"><rect x="500" y="500" width="380" height="380"/></clipPath>
    <g clip-path="url(#bb-cristal)"><rect x="500" y="500" width="380" height="380" fill="#BFE3F2"/>
      ${[[490, 120, 250, "#D9C7B0"], [620, 110, 300, "#C9B6A0"], [740, 150, 220, "#DCCDB8"]].map(([x, w, h, col]) => `<rect x="${x}" y="${830 - h}" width="${w}" height="${h}" fill="${col}"/>${Array.from({ length: Math.floor(h / 60) }, (_, f) => `<rect x="${x + 16}" y="${830 - h + 16 + f * 60}" width="${w - 32}" height="26" rx="3" fill="#FFFDF8" opacity=".6"/>`).join("")}`).join("")}
      <rect x="500" y="830" width="380" height="50" fill="#9AA6AE"/><rect x="500" y="824" width="380" height="8" fill="#C9CED3"/>
      <g id="bb-c0"><g transform="scale(.28)">${coche("bb-c0-a", "#5B6470")}</g></g>
      <g id="bb-camion"><g transform="scale(.42)"><rect x="-260" y="-190" width="420" height="16" fill="#5B6470"/><rect x="-260" y="-100" width="420" height="16" fill="#5B6470"/>
        <rect x="160" y="-170" width="110" height="140" rx="12" fill="#E0B04A"/><rect x="190" y="-150" width="60" height="50" rx="6" fill="#BFE3F2"/>
        ${[-200, -60].map((x) => `<g transform="translate(${x + 60} -190) scale(.26)">${coche(`bb-cm${x}`, "#C9A0C2")}</g><g transform="translate(${x + 60} -100) scale(.26)">${coche(`bb-cn${x}`, "#9AA6AE")}</g>`).join("")}
        ${[-220, -40, 120, 230].map((x) => `<circle cx="${x}" cy="-14" r="26" fill="${C.tinta}"/>`).join("")}</g></g></g>
    <rect x="490" y="490" width="400" height="20" fill="#8E6644"/><rect x="490" y="870" width="400" height="20" fill="#8E6644"/><rect x="490" y="490" width="20" height="400" fill="#8E6644"/><rect x="870" y="490" width="20" height="400" fill="#8E6644"/><rect x="680" y="490" width="16" height="400" fill="#8E6644"/>
    <!-- barra a la izquierda, en perspectiva, con grifos y cafetera -->
    <path d="M${X0} ${enX(160, 880, X0).toFixed(0)} L300 ${enX(160, 880, 300).toFixed(0)} L300 ${enX(160, 1040, 300).toFixed(0)} L${X0} ${enX(160, 1040, X0).toFixed(0)} Z" fill="#8E6644"/>
    <path d="M${X0} ${(enX(160, 880, X0) - 40).toFixed(0)} L300 ${(enX(160, 880, 300) - 14).toFixed(0)} L300 ${enX(160, 880, 300).toFixed(0)} L${X0} ${enX(160, 880, X0).toFixed(0)} Z" fill="#C99A6B"/>
    <g transform="translate(120 ${(enX(160, 880, 120) - 20).toFixed(0)})"><rect x="-10" y="-90" width="20" height="90" fill="#C9CED3"/><rect x="-40" y="-110" width="80" height="26" rx="10" fill="#C9CED3"/>
      <rect x="-34" y="-84" width="10" height="34" fill="#9AA6AE"/><rect x="24" y="-84" width="10" height="34" fill="#9AA6AE"/></g>
    <g transform="translate(-140 ${(enX(160, 880, -140) - 24).toFixed(0)})"><rect x="-90" y="-150" width="180" height="150" rx="14" fill="#B8BFC6"/><rect x="-70" y="-130" width="140" height="60" rx="8" fill="#5B6470"/>
      <rect x="-60" y="-40" width="30" height="40" fill="#5B6470"/><rect x="30" y="-40" width="30" height="40" fill="#5B6470"/></g>
    <!-- pared derecha con la pizarra del menú (sin precios) -->
    <path d="M900 460 L${X0 + ANCHO} ${yDerT} L${X0 + ANCHO} ${yDerS} L900 1040 Z" fill="#DCCBAE"/>
    <path d="M950 ${enX(900, 600, 950).toFixed(0)} L1250 ${enX(900, 600, 1250).toFixed(0)} L1250 ${enX(900, 860, 1250).toFixed(0)} L950 ${enX(900, 860, 950).toFixed(0)} Z" fill="#2F3B35"/>
    <text transform="translate(1060 ${enX(900, 700, 1060).toFixed(0)}) skewY(-22)" text-anchor="middle" font-family="Cap" font-weight="800" font-size="34" fill="#FFFDF8">HOY</text>
    <text transform="translate(1060 ${enX(900, 770, 1060).toFixed(0)}) skewY(-22)" text-anchor="middle" font-family="Cap" font-weight="800" font-size="30" fill="#F4D06F">TORTILLA</text>
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
export function podio(id, coches, numeros = true) {
  const pos = [[0, 200, 1], [-300, 130, 2], [300, 80, 3]];
  return `<g id="${id}">${pos.map(([x, h, n], i) => `<rect x="${x - 140}" y="${-h}" width="280" height="${h}" rx="10" fill="${["#E0B04A", "#C9CED3", "#C98F6B"][i]}"/>${numeros ? txt(x, -h + 70, n + "º", 60, "#FFFDF8") : ""}`).join("")}
    ${coches.map((c, i) => { const [x, h] = pos[i]; return `<g id="${id}-k${i}"><g transform="translate(${x} ${-h - 10}) scale(${c.s ?? 0.48})">${coche(`${id}-c${i}`, c.col)}</g>
      <rect x="${x - 125}" y="${-h - 230}" width="250" height="58" rx="12" fill="#FFFDF8" stroke="${c.col}" stroke-width="6"/>${txt(x, -h - 190, c.nombre, 30, C.tinta)}</g>`; }).join("")}</g>`;
}
// Caña para la mano.
export { CANA_MANO, mesaAlta } from "./sueno.mjs";

// ------------------------------------------------------------------ T18 v2 (Bruno, 23-11-2026: «mete las marcas»)
// Placa con la marca y el modelo en grande (sin copiar logotipos: el nombre, en una placa con color propio).
export const placa = (id, marca, modelo, col, w = 250) => `<g id="${id}"><rect x="${-w / 2}" y="-62" width="${w}" height="124" rx="18" fill="#FFFDF8" stroke="${col}" stroke-width="9"/>
  <rect x="${-w / 2}" y="-62" width="${w}" height="50" rx="18" fill="${col}"/><rect x="${-w / 2}" y="-30" width="${w}" height="18" fill="${col}"/>
  ${txt(0, -24, marca, 34, "#FFFDF8")}${txt(0, 44, modelo, modelo.length > 7 ? 40 : 48, C.tinta)}</g>`;
// Podio con placas grandes. items: [{marca, modelo, col, coche, s}] en orden 1.º, 2.º, 3.º. «<id>-k<i>»: cada puesto.
export function podioMarcas(id, items, numeros = true) {
  const pos = [[0, 200, 1], [-300, 130, 2], [300, 80, 3]];
  return `<g id="${id}">${pos.map(([x, h, n], i) => `<rect x="${x - 140}" y="${-h}" width="280" height="${h}" rx="10" fill="${["#E0B04A", "#C9CED3", "#C98F6B"][i]}"/>${numeros ? txt(x, -h + 70, n + "º", 60, "#FFFDF8") : ""}`).join("")}
    ${items.map((c, i) => { const [x, h] = pos[i]; return `<g id="${id}-k${i}"><g transform="translate(${x} ${-h - 10}) scale(${c.s ?? 0.48})">${coche(`${id}-c${i}`, c.coche)}</g>
      <g transform="translate(${x} ${-h - 210})">${placa(`${id}-p${i}`, c.marca, c.modelo, c.col)}</g></g>`; }).join("")}</g>`;
}
// Bandera de Alemania (tres franjas). Origen: arriba a la izquierda.
export const banderaDE = (w = 120) => `<g><rect width="${w}" height="${w * 0.6}" rx="6" fill="#1E1E1E"/><rect y="${w * 0.2}" width="${w}" height="${w * 0.2}" fill="#C8302E"/><rect y="${w * 0.4}" width="${w}" height="${w * 0.2}" rx="0" fill="#F2C14E"/></g>`;
export const banderaES = (w = 120) => `<g><rect width="${w}" height="${w * 0.6}" rx="6" fill="#C8302E"/><rect y="${w * 0.15}" width="${w}" height="${w * 0.3}" fill="#F2C14E"/></g>`;
// Balanza: «<id>-b» es el brazo (gira), «<id>-i» y «<id>-d» los platos (se cuelgan del brazo en la escena).
export const balanza = (id) => `<g id="${id}"><rect x="-14" y="-300" width="28" height="300" rx="10" fill="#8E6644"/><rect x="-110" y="-18" width="220" height="26" rx="12" fill="#8E6644"/>
  <g id="${id}-b"><rect x="-260" y="-316" width="520" height="20" rx="10" fill="#5B4636"/><circle cy="-306" r="20" fill="#C8902E"/></g></g>`;
