// Decorados y objetos de la educación (T12, Bruno 21-11-2026: entornos descriptivos y muy del tema).
// Todo dibujado con código, sin marcas ni nombres de centros reales. Capas para ambientes() de sueno.mjs:
// el suelo empieza en y = 1300 y los personajes pisan en y = 1440.

import { C } from "./limpio.mjs";

const X0 = -400, ANCHO = 1900;
const txt = (x, y, t, tam, color, o = "") => `<text x="${x}" y="${y}" text-anchor="middle" font-family="Cap" font-weight="800" font-size="${tam}" fill="${color}" ${o}>${t}</text>`;
const tiza = (x, y, t, tam, o = "") => `<text x="${x}" y="${y}" text-anchor="middle" font-family="Cap" font-weight="600" font-size="${tam}" fill="#F4F1EA" opacity=".9" ${o}>${t}</text>`;
const suelo = (col, raya, y = 1300) => `<rect x="${X0}" y="${y}" width="${ANCHO}" height="${2300 - y}" fill="${col}"/>
  ${Array.from({ length: 16 }, (_, i) => `<line x1="${X0 + i * 130}" y1="${y}" x2="${X0 - 90 + i * 130}" y2="2300" stroke="${raya}" stroke-width="4"/>`).join("")}
  ${[1420, 1600, 1840].map((yy) => `<line x1="${X0}" y1="${yy}" x2="${X0 + ANCHO}" y2="${yy}" stroke="${raya}" stroke-width="3" opacity=".7"/>`).join("")}`;
// Pupitre visto de frente con su silla. Origen: el suelo, en el centro.
const pupitre = (x, y = 1300, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-80" y="-150" width="160" height="16" rx="5" fill="#C9A26B"/>
  <rect x="-74" y="-134" width="10" height="134" fill="#8C969C"/><rect x="64" y="-134" width="10" height="134" fill="#8C969C"/><rect x="-60" y="-134" width="120" height="40" rx="4" fill="#A9794F" opacity=".6"/>
  <rect x="-40" y="-210" width="80" height="60" rx="10" fill="#5E8C99"/></g>`;

// ------------------------------------------------------------------ pasillo del instituto: taquillas, tablón y la puerta de la clase
function pasilloInsti() {
  const cols = ["#E07A5F", "#81B29A", "#F2CC8F", "#7FA4B0", "#C9A0C2"];
  const taquilla = (x, i) => `<g transform="translate(${x} 1300)"><rect x="0" y="-560" width="96" height="560" fill="${cols[i % cols.length]}" stroke="#5B6470" stroke-width="4"/>
    <rect x="12" y="-540" width="72" height="250" rx="4" fill="#FFFFFF" opacity=".18"/><rect x="12" y="-270" width="72" height="250" rx="4" fill="#FFFFFF" opacity=".18"/>
    ${[0, 1, 2, 3].map((k) => `<rect x="24" y="${-520 + k * 14}" width="48" height="6" rx="3" fill="#1F2A37" opacity=".35"/>`).join("")}<circle cx="80" cy="-300" r="7" fill="#5B6470"/></g>`;
  return `<rect x="${X0}" y="-400" width="${ANCHO}" height="1720" fill="#EDE6D6"/><rect x="${X0}" y="1000" width="${ANCHO}" height="300" fill="#D9CDB5"/>
    ${[-380, -280, -180, -80].map((x, i) => taquilla(x, i)).join("")}
    <!-- tablón de anuncios -->
    <g transform="translate(240 820)"><rect x="-150" y="-110" width="300" height="220" rx="10" fill="#C79A63" stroke="#8A6A48" stroke-width="8"/>
      ${[[-90, -50, "#FFFFFF", -6], [10, -60, "#FFE58A", 4], [90, -40, "#BFE0EE", -3], [-70, 40, "#F2B3AC", 5], [40, 40, "#FFFFFF", -4]].map(([x, y, c, r]) => `<g transform="translate(${x} ${y}) rotate(${r})"><rect x="-44" y="-36" width="88" height="72" fill="${c}"/><circle cy="-30" r="6" fill="${C.rojo}"/><rect x="-30" y="-14" width="60" height="6" fill="#C9CED3"/><rect x="-30" y="0" width="44" height="6" fill="#C9CED3"/></g>`).join("")}
      ${txt(0, -126, "AVISOS", 26, "#8A6A48")}</g>
    <!-- puerta de la clase -->
    <g transform="translate(620 1300)"><rect x="-110" y="-470" width="220" height="470" rx="6" fill="#A9794F"/><rect x="-90" y="-440" width="80" height="140" rx="4" fill="#BFE0EE"/>
      <circle cx="80" cy="-230" r="10" fill="#E7C47A"/><rect x="-100" y="-540" width="200" height="56" rx="8" fill="#FFFFFF"/>${txt(0, -500, "4.º ESO · B", 30, C.tinta)}</g>
    <!-- fuente de agua y papelera -->
    <g transform="translate(860 1300)"><rect x="-40" y="-200" width="80" height="200" rx="10" fill="#C9CED3"/><rect x="-50" y="-220" width="100" height="30" rx="10" fill="#9AA6AE"/></g>
    <g transform="translate(1000 1300)"><path d="M-36 0 L-44 -110 H44 L36 0 Z" fill="#7C9A7E"/></g>
    ${[1080, 1180].map((x, i) => taquilla(x, i + 2)).join("")}
    ${suelo("#D7D0C2", "#C6BDAC")}`;
}

// ------------------------------------------------------------------ aula: pizarra, mesa de la tutora, ventanas y pupitres
function aula() {
  return `<rect x="${X0}" y="-400" width="${ANCHO}" height="1720" fill="#F3EEE2"/><rect x="${X0}" y="1060" width="${ANCHO}" height="240" fill="#E3D8C2"/>
    <!-- pizarra con tiza -->
    <rect x="70" y="600" width="900" height="430" rx="14" fill="#8A6A48"/><rect x="88" y="618" width="864" height="394" rx="8" fill="#2F4A3E"/>
    ${tiza(300, 690, "Comprensión lectora", 34)}<path d="M150 712 H450" stroke="#F4F1EA" stroke-width="4" opacity=".6"/>
    ${tiza(700, 690, "x² − 4 = 0", 38)}${tiza(720, 760, "x = ±2", 32)}
    <rect x="120" y="1010" width="260" height="14" rx="5" fill="#C9B79B"/><rect x="150" y="996" width="40" height="14" rx="4" fill="#F4F1EA"/>
    <!-- reloj y ventana -->
    <g transform="translate(1100 700)"><circle r="56" fill="#FFFFFF" stroke="#5B6470" stroke-width="8"/><rect x="-3" y="-38" width="6" height="40" fill="${C.tinta}"/><rect x="-3" y="-3" width="30" height="6" fill="${C.tinta}"/></g>
    <rect x="-330" y="620" width="320" height="380" rx="8" fill="#BFE0EE"/><line x1="-170" y1="620" x2="-170" y2="1000" stroke="#FFFFFF" stroke-width="10"/><line x1="-330" y1="810" x2="-10" y2="810" stroke="#FFFFFF" stroke-width="10"/>
    <!-- mesa de la tutora con libros y bola del mundo -->
    <g transform="translate(250 1300)"><rect x="-170" y="-170" width="340" height="20" rx="6" fill="#A9794F"/><rect x="-160" y="-150" width="320" height="150" fill="#8E6644"/>
      ${[["#B3261E", -120], ["#1F5F8B", -96], ["#C8902E", -72]].map(([c, x]) => `<rect x="${x}" y="-230" width="22" height="60" rx="3" fill="${c}"/>`).join("")}
      <g transform="translate(100 -210)"><circle r="34" fill="#6AADDF"/><path d="M-20 -14 q12 -8 22 4 q6 12 -6 18 q-14 4 -16 -8 Z M8 10 q10 -2 14 8 q-6 8 -14 2 Z" fill="#7C9A7E"/><rect x="-4" y="34" width="8" height="26" fill="#5B6470"/></g></g>
    ${[600, 790, 980].map((x) => pupitre(x, 1300, 0.9)).join("")}
    ${suelo("#D9CDB8", "#C8BCA5")}`;
}

// ------------------------------------------------------------------ academia de refuerzo (genérica, sin marca)
function academia() {
  return `<rect x="${X0}" y="-400" width="${ANCHO}" height="1720" fill="#EEF3F6"/><rect x="${X0}" y="1060" width="${ANCHO}" height="240" fill="#DCE5EA"/>
    <rect x="180" y="610" width="720" height="110" rx="16" fill="#FFFFFF"/>${txt(540, 685, "ACADEMIA · CLASES DE REFUERZO", 38, "#5E8C99")}
    <!-- pizarra blanca con ecuaciones -->
    <rect x="120" y="760" width="560" height="300" rx="10" fill="#FFFFFF" stroke="#C9CED3" stroke-width="8"/>
    <text x="160" y="840" font-family="Cap" font-weight="600" font-size="36" fill="#1F5F8B">3x + 5 = 20</text><text x="160" y="900" font-family="Cap" font-weight="600" font-size="36" fill="#1F5F8B">x = 5</text>
    <text x="160" y="970" font-family="Cap" font-weight="600" font-size="30" fill="${C.rojo}">¡Repasa!</text>
    <!-- cartel de matrícula y mostrador -->
    <g transform="translate(900 860)"><rect x="-110" y="-90" width="220" height="180" rx="12" fill="#FFE58A"/>${txt(0, -30, "MATRÍCULA", 30, "#8A6316")}${txt(0, 14, "ABIERTA", 30, "#8A6316")}
      <rect x="-60" y="40" width="120" height="14" rx="6" fill="#E7C47A"/></g>
    <g transform="translate(900 1300)"><rect x="-200" y="-210" width="400" height="210" rx="12" fill="#5E8C99"/><rect x="-216" y="-226" width="432" height="26" rx="10" fill="#7FA4B0"/>
      <rect x="60" y="-280" width="90" height="56" rx="8" fill="${C.tinta}"/><rect x="70" y="-272" width="70" height="36" rx="4" fill="#9AE6B4"/></g>
    ${[-160, 60].map((x) => `<g transform="translate(${x} 1300)"><rect x="-90" y="-140" width="180" height="16" rx="5" fill="#C9A26B"/><rect x="-80" y="-124" width="10" height="124" fill="#8C969C"/><rect x="70" y="-124" width="10" height="124" fill="#8C969C"/></g>`).join("")}
    ${suelo("#DADFE2", "#C9CFD3")}`;
}
export const DECORADOS_T12 = { pasilloInsti, aula, academia };

// ------------------------------------------------------------------ objetos en la mano
export const MOVIL = `<g transform="translate(6 -40)"><rect x="-30" y="-56" width="60" height="112" rx="12" fill="${C.tinta}"/><rect x="-24" y="-46" width="48" height="88" rx="6" fill="#7FB3A0"/>
  <rect x="-16" y="-36" width="32" height="8" rx="3" fill="#FFFFFF" opacity=".8"/><rect x="-16" y="-22" width="24" height="8" rx="3" fill="#FFFFFF" opacity=".6"/></g>`;
export const BOLETIN = `<g transform="translate(6 -40) rotate(-8)"><rect x="-44" y="-56" width="88" height="112" rx="6" fill="#FFFFFF" stroke="#C9CED3" stroke-width="4"/>
  <rect x="-32" y="-42" width="64" height="10" rx="4" fill="#5E8C99"/>${[0, 1, 2, 3].map((k) => `<rect x="-32" y="${-22 + k * 18}" width="40" height="7" rx="3" fill="#C9CED3"/><rect x="16" y="${-24 + k * 18}" width="16" height="11" rx="3" fill="${k % 2 ? C.rojo : "#7C9A7E"}"/>`).join("")}</g>`;
export const MOCHILA = `<g transform="translate(-30 -40)"><rect x="-40" y="-60" width="80" height="110" rx="20" fill="#E07A5F"/><rect x="-30" y="0" width="60" height="40" rx="10" fill="#C7684E"/></g>`;
// Pupitre pequeño con alumno (para la fila de «uno de cada seis»): «<id>-a» es el alumno (cambia de color si no llega).
export function alumnito(id) {
  return `<g id="${id}"><rect x="-26" y="-12" width="52" height="10" rx="3" fill="#C9A26B"/><rect x="-22" y="-2" width="6" height="22" fill="#8C969C"/><rect x="16" y="-2" width="6" height="22" fill="#8C969C"/>
    <g id="${id}-a"><rect x="-16" y="-48" width="32" height="34" rx="12" fill="#7FA35B"/><circle cy="-60" r="13" fill="#EBC3A0"/></g><g id="${id}-q" style="display:none">${txt(22, -66, "?", 30, "#B3261E")}</g></g>`;
}
// Libro (de un montón). Origen: el centro.
export const libro = (id, col) => `<g id="${id}"><rect x="-56" y="-12" width="112" height="24" rx="4" fill="${col}"/><rect x="-50" y="-8" width="100" height="16" rx="2" fill="#FFFDF8" opacity=".85"/><rect x="-56" y="-12" width="10" height="24" rx="3" fill="${col}"/></g>`;
// Profesor pequeño con cartera (filas de profesorado). Origen: los pies.
export const profe = (id) => `<g id="${id}"><rect x="-16" y="-58" width="32" height="44" rx="12" fill="#C77B5B"/><circle cy="-70" r="12" fill="#EBC3A0"/>
  <rect x="-12" y="-14" width="10" height="14" rx="4" fill="#4A5A6A"/><rect x="2" y="-14" width="10" height="14" rx="4" fill="#4A5A6A"/><rect x="12" y="-36" width="18" height="14" rx="3" fill="#8A6A48"/></g>`;
