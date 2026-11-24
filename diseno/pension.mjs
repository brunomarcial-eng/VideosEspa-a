// Decorados y objetos de T22 (la pensión media frente al sueldo de un joven; Bruno, 24-11-2026):
//   · parquePlaza: un parque de barrio por la tarde, en perspectiva: paseo de tierra que fuga, bancos, farolas, árboles,
//     bloques al fondo y palomas que picotean («pq-p0…»). Primer plano: «pq-fg». Los personajes pisan en y = 1440.
// Objetos: la carta de la pensión, catorce sobres (las catorce pagas), dos montones de billetes, barras horizontales de
// subidas y dos carros de la compra.

import { C, carro, PRODUCTOS } from "./limpio.mjs";

const X0 = -400, ANCHO = 1900, VX = 540, VY = 760;
const txt = (x, y, t, tam, color, o = "", ancla = "middle") => `<text x="${x}" y="${y}" text-anchor="${ancla}" font-family="Cap" font-weight="800" font-size="${tam}" fill="${color}" ${o}>${t}</text>`;
const ROJO = "#B3261E", OCRE = "#C8902E", VERDE = "#3F7A4A", GRIS = "#8C969C";

// ------------------------------------------------------------------ el parque
function parquePlaza() {
  const arbol = (x, y, s, col) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-14" y="-260" width="28" height="260" rx="10" fill="#8E6644"/>
    <circle cx="0" cy="-300" r="120" fill="${col}"/><circle cx="-80" cy="-250" r="80" fill="${col}"/><circle cx="80" cy="-240" r="86" fill="${col}"/></g>`;
  const farola = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-7" y="-330" width="14" height="330" fill="#4A5560"/>
    <path d="M-30 -330 H30 L20 -380 H-20 Z" fill="#4A5560"/><circle cx="0" cy="-350" r="14" fill="#FFF3C4"/></g>`;
  const banco = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-150" y="-120" width="300" height="22" rx="8" fill="#A97E56"/>
    <rect x="-150" y="-160" width="300" height="20" rx="8" fill="#A97E56"/><rect x="-150" y="-72" width="300" height="26" rx="8" fill="#B98F64"/>
    <rect x="-130" y="-46" width="16" height="46" fill="#4A5560"/><rect x="114" y="-46" width="16" height="46" fill="#4A5560"/></g>`;
  const bloques = [[-300, 220, 330], [-60, 180, 420], [140, 200, 300], [360, 170, 380], [560, 220, 320], [800, 200, 400], [1020, 240, 340], [1260, 200, 380]]
    .map(([x, w, h], i) => `<rect x="${x}" y="${VY - h}" width="${w}" height="${h}" fill="${["#E3D2BD", "#D8C6AE", "#E8DACA"][i % 3]}"/>` +
      Array.from({ length: Math.floor(h / 60) }, (_, f) => Array.from({ length: Math.floor(w / 46) }, (_, k) =>
        `<rect x="${x + 12 + k * 46}" y="${VY - h + 14 + f * 60}" width="22" height="30" rx="3" fill="#FFFDF8" opacity=".7"/>`).join("")).join("")).join("");
  const paloma = (i, x, y) => `<g id="pq-p${i}" transform="translate(${x} ${y})"><g id="pq-p${i}-c"><ellipse cx="0" cy="-18" rx="26" ry="16" fill="#9AA6AE"/>
    <circle cx="22" cy="-30" r="10" fill="#7C8790"/><path d="M30 -30 l10 3 l-10 3 Z" fill="#E0B04A"/><path d="M-22 -20 l-16 -6 l4 12 Z" fill="#7C8790"/></g>
    <path d="M-4 -4 v6 M6 -4 v6" stroke="#C77B5B" stroke-width="3"/></g>`;
  return `<rect x="${X0}" y="-400" width="${ANCHO}" height="2700" fill="#D7ECF5"/>
    <circle cx="860" cy="250" r="80" fill="#FFE7A3" opacity=".9"/><circle cx="860" cy="250" r="140" fill="#FFE7A3" opacity=".25"/>
    <ellipse cx="200" cy="300" rx="150" ry="40" fill="#FFFFFF" opacity=".85"/><ellipse cx="620" cy="170" rx="120" ry="32" fill="#FFFFFF" opacity=".75"/>
    ${bloques}
    <!-- césped y paseo de tierra en perspectiva -->
    <path d="M${X0} ${VY} H${X0 + ANCHO} V2300 H${X0} Z" fill="#A9C98F"/>
    <path d="M460 ${VY} H620 L1400 2300 H-320 Z" fill="#E8D6AC"/>
    ${Array.from({ length: 10 }, (_, i) => { const y = VY + 30 + i * i * 16; return `<ellipse cx="${540 + (i % 2 ? 60 : -80) * (1 + i / 3)}" cy="${y}" rx="${10 + i * 4}" ry="${2 + i}" fill="#D9C491" opacity=".7"/>`; }).join("")}
    ${arbol(-60, 1090, 1.15, "#6FA35A")}${arbol(1120, 1060, 1.2, "#5F9F4A")}${arbol(230, 860, 0.55, "#7DB066")}${arbol(860, 850, 0.5, "#6FA35A")}
    ${farola(330, 980, 0.8)}${farola(760, 960, 0.75)}
    ${banco(170, 1150, 0.95)}${banco(930, 1140, 0.85)}
    <!-- palomas en el paseo -->
    ${paloma(0, 600, 1240)}${paloma(1, 690, 1270)}${paloma(2, 470, 1300)}
    <!-- primer plano: un seto desenfocado en la esquina -->
    <g id="pq-fg"><ellipse cx="-60" cy="1960" rx="260" ry="150" fill="#5F9F4A"/><ellipse cx="1150" cy="1990" rx="240" ry="140" fill="#6FA35A"/></g>`;
}

export const DECORADOS_T22 = { parquePlaza };

// ------------------------------------------------------------------ objetos
// Carta de la pensión con su importe. Origen: centro.
export function cartaPension(id, importe) {
  return `<g id="${id}"><rect x="-230" y="-150" width="460" height="300" rx="18" fill="#FFFDF8" stroke="#D9DEE2" stroke-width="5"/>
    <rect x="-230" y="-150" width="460" height="64" rx="18" fill="#3F6B5A"/><rect x="-230" y="-110" width="460" height="24" fill="#3F6B5A"/>
    ${txt(0, -106, "PENSIÓN DE JUBILACIÓN", 32, "#FFFFFF")}
    ${[-50, -20].map((y) => `<rect x="-190" y="${y}" width="220" height="12" rx="6" fill="#E3E7EA"/>`).join("")}
    ${txt(180, 90, importe, 64, C.tinta, "", "end")}${txt(-190, 90, "al mes", 30, GRIS, "", "start")}</g>`;
}

// Catorce sobres en dos filas (doce meses y dos pagas extra, «<id>-s0…s13»). Origen: centro.
export function catorcePagas(id) {
  const sobre = (i) => { const f = i < 7 ? 0 : 1, k = i % 7, x = -330 + k * 110, y = f * 120, extra = i >= 12;
    return `<g transform="translate(${x} ${y})"><g id="${id}-s${i}"><rect x="-46" y="-34" width="92" height="68" rx="8" fill="${extra ? "#FFF3C4" : "#FFFDF8"}" stroke="${extra ? OCRE : "#C9CED3"}" stroke-width="4"/>
      <path d="M-46 -34 L0 4 L46 -34" fill="none" stroke="${extra ? OCRE : "#C9CED3"}" stroke-width="4"/></g></g>`; };
  return `<g id="${id}">${Array.from({ length: 14 }, (_, i) => sobre(i)).join("")}</g>`;
}

// Dos montones de billetes con su rótulo y su cifra (alto proporcional al valor). Origen: centro de la base.
export function dosMontones(id, valores, rotulos, cifras, colores = ["#5B6470", "#A9781F"]) {
  const max = Math.max(...valores);
  return `<g id="${id}">${valores.map((v, i) => { const n = Math.round(12 * v / max), x = i ? 210 : -210;
    return `<g id="${id}-m${i}" transform="translate(${x} 0)">${Array.from({ length: n }, (_, k) => `<rect x="-130" y="${-40 - k * 30}" width="260" height="34" rx="6" fill="${k % 2 ? "#9BC77A" : "#8DBB6B"}" stroke="#5F8F4A" stroke-width="3"/>`).join("")}
      <g id="${id}-r${i}">${txt(0, -70 - n * 30, cifras[i], 52, colores[i])}</g>${txt(0, 50, rotulos[i], 36, C.tinta)}</g>`; }).join("")}</g>`;
}

// Barras horizontales de subida (+%), una por fila («<id>-b0…», cifras «<id>-v0…»). items: [{rotulo, valor, color}]. Origen: centro.
export function barrasSubida(id, items, o = {}) {
  const W = o.W ?? 470, max = Math.max(...items.map((x) => x.valor)), alto = 92, paso = 132;
  return `<g id="${id}"><rect x="-390" y="-100" width="780" height="${items.length * paso + 50}" rx="24" fill="#FFFDF8" opacity=".95"/>
    ${items.map((it, i) => { const y = -40 + i * paso, w = it.valor / max * W;
      return `${txt(-350, y - 6, it.rotulo, 36, C.tinta, "", "start")}<rect id="${id}-b${i}" x="-350" y="${y + 6}" width="${w.toFixed(1)}" height="${alto - 40}" rx="12" fill="${it.color}" style="transform-box:fill-box;transform-origin:0 50%"/>
        <g id="${id}-v${i}">${txt(-350 + w + 20, y + 48, `+${Math.round(it.valor)}&nbsp;%`, 46, it.color, "", "start")}</g>`; }).join("")}</g>`;
}

// Dos carros de la compra («<id>-a» y «<id>-b») con productos que se pueden añadir («<id>-a-x0…»). Origen: centro.
export function dosCarros(id, rotulos, extra = 3) {
  const prods = ["pan", "leche", "manzana", "huevos", "aceite"];
  const mas = (k) => Array.from({ length: extra }, (_, j) => `<g id="${id}-${k}-x${j}" opacity="0"><g transform="translate(${-60 + j * 60} ${-300 - (j % 2) * 30}) scale(.8)">${PRODUCTOS[prods[j % prods.length]]}</g></g>`).join("");
  return `<g id="${id}"><g transform="translate(-230 0) scale(.95)">${carro(`${id}-a`, true)}${mas("a")}</g>${txt(-230, 80, rotulos[0], 38, C.tinta)}
    <g transform="translate(230 0) scale(.95)">${carro(`${id}-b`, true)}</g>${txt(230, 80, rotulos[1], 38, C.tinta)}</g>`;
}
