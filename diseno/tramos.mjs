// Decorados y objetos de T25 (¿en qué tramo de sueldo estás tú?; Bruno, 24-11-2026):
//   · gestoria: una gestoría de barrio por la mañana, en perspectiva: pared con ventana a la calle, estanterías de
//     archivadores de colores, un reloj de pared sin números, una planta, la mesa con el ordenador, carpetas y una
//     lámpara («ge-l0»). Primer plano «ge-fg». Prefijo para vidaFondo: «ge». Los personajes pisan en y = 1440 (escena
//     entera) o en y = 1700 (en las esquinas).
// Objetos: la escalera de los seis tramos de sueldo (solo se escriben los tramos que el plano enseña), una tele con el
// titular del sueldo medio y un balancín (muchos que ganan poco frente a unos pocos que ganan mucho).

import { C } from "./limpio.mjs";

const X0 = -400, ANCHO = 1900, VX = 540, VY = 720;
const txt = (x, y, t, tam, color, o = "", ancla = "middle") => `<text x="${x}" y="${y}" text-anchor="${ancla}" font-family="Cap" font-weight="800" font-size="${tam}" fill="${color}" ${o}>${t}</text>`;
const enX = (x0, y0, x) => VY + (y0 - VY) * (x - VX) / (x0 - VX);
const ROJO = "#B3261E", OCRE = "#C8902E", VERDE = "#3F7A4A", GRIS = "#C9CED3";

// ------------------------------------------------------------------ la gestoría
function gestoria() {
  const yIzqT = enX(140, 440, X0), yIzqS = enX(140, 1060, X0), yDerT = enX(940, 440, X0 + ANCHO), yDerS = enX(940, 1060, X0 + ANCHO);
  const baldosas = Array.from({ length: 13 }, (_, i) => { const xb = 160 + i * 64; return `<line x1="${xb}" y1="1060" x2="${(VX + (xb - VX) * 4.2).toFixed(0)}" y2="2300" stroke="#B9BFC5" stroke-width="3" opacity=".6"/>`; }).join("");
  const juntas = [1100, 1170, 1270, 1420, 1650, 1990].map((y) => `<line x1="${X0}" y1="${y}" x2="${X0 + ANCHO}" y2="${y}" stroke="#B9BFC5" stroke-width="3" opacity=".5"/>`).join("");
  const edificio = (x, w, h, col) => `<rect x="${x}" y="${900 - h}" width="${w}" height="${h}" fill="${col}"/>${Array.from({ length: Math.floor(h / 60) }, (_, f) =>
    Array.from({ length: Math.floor(w / 46) }, (_, k) => `<rect x="${x + 12 + k * 46}" y="${900 - h + 14 + f * 60}" width="22" height="30" rx="3" fill="#FFFDF8" opacity=".75"/>`).join("")).join("")}`;
  const COLS = ["#3F6B5A", "#C8902E", "#7C5C8E", "#5B6470", "#9E3D3D", "#4F86B8"];
  const estante = (x, y, n, sem) => `<rect x="${x}" y="${y + 150}" width="${n * 34 + 20}" height="14" fill="#8E6644"/>` +
    Array.from({ length: n }, (_, i) => { const h = 120 + ((i * 7 + sem) % 3) * 12; return `<rect x="${x + 10 + i * 34}" y="${y + 150 - h}" width="30" height="${h}" rx="4" fill="${COLS[(i + sem) % COLS.length]}"/><rect x="${x + 16 + i * 34}" y="${y + 150 - h + 20}" width="18" height="26" rx="3" fill="#FFFDF8" opacity=".8"/>`; }).join("");
  const lampara = `<g id="ge-l0" data-x="540" data-y="-400"><line x1="540" y1="-400" x2="540" y2="260" stroke="#3B3B3B" stroke-width="4"/>
    <path d="M470 260 H610 L630 300 H450 Z" fill="#E3E7EA"/><rect x="450" y="300" width="180" height="10" rx="5" fill="#FFF7D6"/><path d="M450 310 L360 640 H720 L630 310 Z" fill="#FFF7D6" opacity=".10"/></g>`;
  const reloj = `<g transform="translate(240 560)"><circle r="54" fill="#FFFDF8" stroke="#5B6470" stroke-width="8"/>
    ${Array.from({ length: 12 }, (_, i) => `<line x1="0" y1="-44" x2="0" y2="${i % 3 ? -38 : -32}" transform="rotate(${i * 30})" stroke="#5B6470" stroke-width="4"/>`).join("")}
    <line x1="0" y1="0" x2="0" y2="-30" stroke="${C.tinta}" stroke-width="6" stroke-linecap="round"/><line x1="0" y1="0" x2="22" y2="10" stroke="${C.tinta}" stroke-width="6" stroke-linecap="round"/></g>`;
  const mesa = `<g transform="translate(540 1215)"><ellipse cx="0" cy="40" rx="330" ry="26" fill="#3C2814" opacity=".14"/>
      <rect x="-320" y="-150" width="640" height="34" rx="8" fill="#A97E56"/><rect x="-300" y="-116" width="600" height="150" fill="#8E6644"/>
      <rect x="-280" y="-100" width="170" height="120" rx="6" fill="#A97E56"/><circle cx="-195" cy="-40" r="8" fill="#E0B04A"/>
      <!-- ordenador, carpetas y una taza -->
      <rect x="40" y="-330" width="230" height="150" rx="12" fill="#2B2F33"/><rect x="52" y="-318" width="206" height="122" rx="6" fill="#CFE3EC"/>
      <rect x="140" y="-180" width="30" height="30" fill="#5B6470"/><rect x="100" y="-156" width="110" height="10" rx="5" fill="#5B6470"/>
      ${[0, 1, 2].map((i) => `<rect x="${-250 + i * 6}" y="${-178 - i * 14}" width="190" height="16" rx="4" fill="${COLS[i + 1]}"/>`).join("")}
      <rect x="-30" y="-196" width="40" height="46" rx="8" fill="#FFFDF8" stroke="#D9DEE2" stroke-width="3"/></g>`;
  return `<rect x="${X0}" y="-400" width="${ANCHO}" height="2700" fill="#E9ECE6"/>
    <path d="M${X0} -400 H${X0 + ANCHO} V${yDerT} L940 440 H140 L${X0} ${yIzqT} Z" fill="#F4F4EF"/>
    <rect x="140" y="440" width="800" height="620" fill="#E3E8E2"/><rect x="140" y="900" width="800" height="160" fill="#D5DCD3"/>
    <!-- ventana a la calle -->
    <g><clipPath id="ge-ventana"><rect x="560" y="500" width="330" height="330"/></clipPath>
      <g clip-path="url(#ge-ventana)"><rect x="560" y="500" width="330" height="330" fill="#BFE3F2"/>${edificio(560, 120, 260, "#D9C7B0")}${edificio(690, 100, 300, "#C9B6A0")}${edificio(800, 110, 220, "#DCCDB8")}</g></g>
    <rect x="550" y="490" width="350" height="16" fill="#FFFDF8"/><rect x="550" y="822" width="350" height="16" fill="#FFFDF8"/>
    <rect x="550" y="490" width="16" height="348" fill="#FFFDF8"/><rect x="884" y="490" width="16" height="348" fill="#FFFDF8"/><rect x="717" y="490" width="16" height="348" fill="#FFFDF8"/>
    ${reloj}
    <!-- estanterías de archivadores -->
    ${estante(170, 640, 9, 0)}${estante(170, 800, 9, 2)}
    <!-- paredes laterales -->
    <path d="M${X0} ${yIzqT} L140 440 L140 1060 L${X0} ${yIzqS} Z" fill="#DCE1DA"/>
    <path d="M940 440 L${X0 + ANCHO} ${yDerT} L${X0 + ANCHO} ${yDerS} L940 1060 Z" fill="#D6DBD4"/>
    <path d="M-160 ${enX(140, 600, -160).toFixed(0)} L40 ${enX(140, 600, 40).toFixed(0)} L40 ${enX(140, 760, 40).toFixed(0)} L-160 ${enX(140, 760, -160).toFixed(0)} Z" fill="#FFFDF8" stroke="#C9CED3" stroke-width="4"/>
    <path d="M990 ${enX(940, 560, 990).toFixed(0)} L1130 ${enX(940, 560, 1130).toFixed(0)} L1130 ${enX(940, 1060, 1130).toFixed(0)} L990 ${enX(940, 1060, 990).toFixed(0)} Z" fill="#A97E56"/>
    <circle cx="1110" cy="${enX(940, 820, 1110).toFixed(0)}" r="8" fill="#E0B04A"/>
    <!-- suelo -->
    <path d="M${X0} ${yIzqS} L140 1060 H940 L${X0 + ANCHO} ${yDerS} V2300 H${X0} Z" fill="#CDD2CC"/>${baldosas}${juntas}
    <!-- planta -->
    <g transform="translate(90 1120)"><path d="M-40 0 L-30 -80 H30 L40 0 Z" fill="#C77B5B"/>
      ${[[-40, -200], [0, -240], [40, -200], [-20, -160], [24, -170]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="22" ry="70" fill="#5F9F4A" transform="rotate(${x / 2} ${x} ${y})"/>`).join("")}</g>
    ${mesa}${lampara}
    <!-- primer plano: el respaldo de una silla y una papelera -->
    <g id="ge-fg"><g transform="translate(-60 2000)"><rect x="-150" y="-300" width="300" height="300" rx="50" fill="#3B4A57"/></g>
      <g transform="translate(1160 2010)"><path d="M-70 -200 H70 L56 0 H-56 Z" fill="#5B6470"/></g></g>`;
}

export const DECORADOS_T25 = { gestoria };

// ------------------------------------------------------------------ objetos
// Escalera de los seis tramos: una barra por tramo (de abajo arriba: de menos a más sueldo), con su rótulo y su %.
// Solo se escriben y se colorean los tramos de «ver» (índices); los demás, en gris y sin texto. Barras «<id>-b<i>»
// (crecen con scaleX desde la izquierda) y valores «<id>-v<i>». «tu»: índice del tramo donde va la flecha «tú».
// Origen: centro.
export function escaleraTramos(id, tramos, ver, o = {}) {
  const X = -20, W = 340, alto = 64, paso = 96, n = tramos.length, max = Math.max(...tramos.map((t) => t.pct));
  const y0 = (n - 1) * paso / 2;
  return `<g id="${id}"><rect x="-430" y="${-y0 - 90}" width="880" height="${n * paso + 70}" rx="24" fill="#FFFDF8" opacity=".96"/>
    ${tramos.map((t, i) => { const y = y0 - i * paso, si = ver.includes(i), w = Math.max(14, t.pct / max * W), col = o.colores?.[i] ?? (i === 0 ? ROJO : OCRE);
      return `<g transform="translate(0 ${y})">
        ${si ? txt(-400, 10, t.rotulo, 28, C.tinta, "", "start") : `<rect x="-400" y="-12" width="200" height="20" rx="10" fill="#E3E7EA"/>`}
        <rect x="${X}" y="${-alto / 2}" width="${W}" height="${alto}" rx="12" fill="#EEF1F3"/>
        <rect id="${id}-b${i}" x="${X}" y="${-alto / 2}" width="${w.toFixed(1)}" height="${alto}" rx="12" fill="${si ? col : GRIS}" style="transform-box:fill-box;transform-origin:0 50%"/>
        <g id="${id}-v${i}">${si ? txt(X + w + 12, 14, `${String(t.pct).replace(".", ",")}&nbsp;%`, 38, col, "", "start") : ""}</g></g>`; }).join("")}
    ${o.tu !== undefined ? `<g transform="translate(${X + tramos[o.tu].pct / max * W + 120} ${y0 - o.tu * paso})"><g id="${id}-tu"><path d="M0 0 l36 -24 v48 Z" fill="${VERDE}"/>${txt(76, 14, "tú", 38, VERDE)}</g></g>` : ""}</g>`;
}

// Una tele de las de antes en la estantería con un titular (texto que se pasa). Origen: centro.
export function tele(id, titular, cifra) {
  return `<g id="${id}"><rect x="-230" y="-170" width="460" height="320" rx="30" fill="#5B6470"/><rect x="-200" y="-140" width="400" height="250" rx="20" fill="#1E2A30"/>
    <rect x="-200" y="40" width="400" height="70" fill="#B3261E"/>${txt(0, 88, titular, 36, "#FFFFFF")}
    ${txt(0, -20, cifra, 76, "#FFFDF8")}<rect x="-80" y="150" width="160" height="24" rx="8" fill="#3B4A57"/></g>`;
}

// Balancín: a la izquierda, muchos muñequitos pequeños; a la derecha, tres grandes que lo inclinan («<id>-t», la tabla
// que gira). Origen: el punto de apoyo.
export function balancin(id) {
  const peq = (x) => `<g transform="translate(${x} -40)"><circle cx="0" cy="-34" r="13" fill="#8C969C"/><rect x="-14" y="-20" width="28" height="30" rx="10" fill="#8C969C"/></g>`;
  const gra = (x) => `<g transform="translate(${x} -60)"><circle cx="0" cy="-58" r="24" fill="${OCRE}"/><rect x="-26" y="-34" width="52" height="56" rx="16" fill="${OCRE}"/></g>`;
  return `<g id="${id}"><path d="M-40 0 L0 -90 L40 0 Z" fill="#5B6470"/>
    <g id="${id}-t"><rect x="-330" y="-110" width="660" height="22" rx="10" fill="#8E6644"/>
      <g transform="translate(0 -88)">${Array.from({ length: 9 }, (_, i) => peq(-310 + i * 32)).join("")}${[220, 270, 315].map(gra).join("")}</g></g></g>`;
}
