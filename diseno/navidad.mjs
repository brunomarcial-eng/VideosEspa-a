// Decorados y objetos de T15 («¿Cuántas horas trabajas para la cena de Nochebuena?»; Bruno, 22 y 23-11-2026):
// un mercado de abastos en Navidad (puestos con toldos, guirnaldas de bombillas, lámparas y gente al fondo), los mostradores
// de pescadería y carnicería, el árbol con luces, la mesa de Nochebuena, los dulces, los juguetes y el mapa de España con los
// platos de cada región (la lista que mandó Bruno el 23-11-2026). Todo dibujado con código y sin marcas.
// Capa para ambientes() de sueno.mjs; prefijo para vidaFondo: «mn». Los personajes pisan en y = 1440.

import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { C, paseante } from "./limpio.mjs";

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const MAPA = JSON.parse(readFileSync(path.join(AQUI, "mapa_espana.json"), "utf8"));
const X0 = -400, ANCHO = 1900, VX = 540, VY = 700;
const txt = (x, y, t, tam, color, o = "") => `<text x="${x}" y="${y}" text-anchor="middle" font-family="Cap" font-weight="800" font-size="${tam}" fill="${color}" ${o}>${t}</text>`;
const enX = (x0, y0, x) => VY + (y0 - VY) * (x - VX) / (x0 - VX);

// ------------------------------------------------------------------ el mercado
function mercado() {
  const yIzqT = enX(150, 430, X0), yIzqS = enX(150, 1040, X0), yDerT = enX(930, 430, X0 + ANCHO), yDerS = enX(930, 1040, X0 + ANCHO);
  const baldosas = Array.from({ length: 16 }, (_, i) => { const xb = 150 + i * 52; return `<line x1="${xb}" y1="1040" x2="${(VX + (xb - VX) * 4.4).toFixed(0)}" y2="2300" stroke="#C9BFAE" stroke-width="3"/>`; }).join("")
    + [1075, 1125, 1195, 1300, 1460, 1700].map((y) => `<line x1="${X0}" y1="${y}" x2="${X0 + ANCHO}" y2="${y}" stroke="#C9BFAE" stroke-width="3"/>`).join("");
  // puestos del fondo: toldo a rayas, mostrador y género
  const puesto = (x, w, col, genero) => `<g transform="translate(${x} 1040)"><rect x="${-w / 2}" y="-300" width="${w}" height="300" fill="#F4F1EA"/>
    ${Array.from({ length: Math.round(w / 40) }, (_, i) => `<path d="M${-w / 2 + i * 40} -330 h40 v50 q-20 18 -40 0 Z" fill="${i % 2 ? "#FFFDF8" : col}"/>`).join("")}
    <rect x="${-w / 2}" y="-120" width="${w}" height="120" fill="${col}" opacity=".85"/><rect x="${-w / 2}" y="-130" width="${w}" height="16" fill="#E9E2D5"/>${genero}</g>`;
  const naranjas = Array.from({ length: 9 }, (_, i) => `<circle cx="${-80 + (i % 5) * 38}" cy="${-150 - Math.floor(i / 5) * 30}" r="17" fill="#E9923B"/>`).join("");
  const peces = Array.from({ length: 4 }, (_, i) => `<path d="M${-90 + i * 50} -150 q22 -16 44 0 q-22 16 -44 0 Z m44 0 l12 -10 v20 Z" fill="#9AA6AE"/>`).join("");
  const jamones = [-60, 0, 60].map((x) => `<path d="M${x} -280 v30 m0 0 q-24 6 -20 60 q4 30 20 34 q16 -4 20 -34 q4 -54 -20 -60 Z" fill="#9B4A3A" stroke="#5B3A2A" stroke-width="3"/>`).join("");
  // guirnalda de bombillas: «mn-b<i>» parpadean en la escena
  const bombillas = (y0, n, fase) => Array.from({ length: n }, (_, i) => { const x = -300 + i * (1700 / n), y = y0 + 40 * Math.sin(i / (n - 1) * Math.PI);
    return `<circle id="mn-b${fase}${i}" cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="11" fill="${["#F2C14E", "#E07A3F", "#7C9A7E", "#FFFDF8"][i % 4]}"/>`; }).join("");
  const lampara = (i, x, y, s) => `<g id="mn-l${i}" data-x="${x}" data-y="-400"><line x1="${x}" y1="-400" x2="${x}" y2="${y}" stroke="#5B4636" stroke-width="${4 * s}"/>
    <path d="M${x - 50 * s} ${y + 40 * s} H${x + 50 * s} L${x + 26 * s} ${y} H${x - 26 * s} Z" fill="#8E3B2F"/><circle cx="${x}" cy="${y + 44 * s}" r="${12 * s}" fill="#FFF3C4"/></g>`;
  return `<rect x="${X0}" y="-400" width="${ANCHO}" height="2700" fill="#EDE4D3"/>
    <path d="M${X0} -400 H${X0 + ANCHO} V${yDerT} L930 430 H150 L${X0} ${yIzqT} Z" fill="#D9CDB8"/>
    ${Array.from({ length: 7 }, (_, i) => `<line x1="${150 + i * 130}" y1="430" x2="${(VX + (150 + i * 130 - VX) * 4).toFixed(0)}" y2="-400" stroke="#BFB09A" stroke-width="10"/>`).join("")}
    <rect x="150" y="430" width="780" height="610" fill="#E6DCC8"/>
    <rect x="300" y="470" width="480" height="150" rx="10" fill="#BFE3F2" opacity=".8"/>${[420, 540, 660].map((x) => `<rect x="${x - 6}" y="470" width="12" height="150" fill="#BFB09A"/>`).join("")}
    ${puesto(270, 220, "#3E8E8A", peces)}${puesto(540, 240, "#8E3B2F", jamones)}${puesto(810, 220, "#D9A23B", naranjas)}
    <path d="M${X0} ${yIzqT} L150 430 L150 1040 L${X0} ${yIzqS} Z" fill="#DCCFB8"/><path d="M930 430 L${X0 + ANCHO} ${yDerT} L${X0 + ANCHO} ${yDerS} L930 1040 Z" fill="#D5C7AE"/>
    <path d="M${X0} ${yIzqS} L150 1040 H930 L${X0 + ANCHO} ${yDerS} V2300 H${X0} Z" fill="#E3DACB"/>${baldosas}
    ${paseante("mn-w0", "#7C9A7E", "#F2CBA8", 1)}${paseante("mn-w1", "#C9A0C2", "#E9BE98", 1)}
    <path d="M-300 360 Q540 440 1400 360" fill="none" stroke="#5B4636" stroke-width="4"/>${bombillas(360, 22, "a")}
    <path d="M-300 230 Q540 300 1400 230" fill="none" stroke="#5B4636" stroke-width="4"/>${bombillas(230, 18, "b")}
    ${lampara(0, 300, 120, 1)}${lampara(1, 780, 120, 1)}`;
}
export const DECORADOS_T15 = { mercado };

// ------------------------------------------------------------------ mostradores (delante del tendero)
const mostrador = (id, col, genero) => `<g id="${id}"><rect x="-300" y="-250" width="600" height="250" rx="14" fill="${col}"/><rect x="-300" y="-250" width="600" height="30" rx="10" fill="#FFFDF8" opacity=".5"/>
  <rect x="-320" y="-290" width="640" height="48" rx="12" fill="#E9EDF0"/>${genero}<rect x="-300" y="-160" width="600" height="14" fill="#FFFFFF" opacity=".25"/></g>`;
const gamba = (x, y, s = 1, col = "#F08A6B") => `<path transform="translate(${x} ${y}) scale(${s})" d="M-22 0 Q-24 -26 2 -30 Q26 -30 28 -10 Q22 -16 12 -14 Q-4 -12 -6 6 Z" fill="${col}" stroke="#C25A44" stroke-width="2"/>`;
export const mostradorPescado = (id) => mostrador(id, "#3E8E8A", `<rect x="-290" y="-300" width="580" height="20" rx="8" fill="#FFFFFF"/>
  ${Array.from({ length: 10 }, (_, i) => gamba(-250 + i * 34, -300 - (i % 2) * 8, 1.1)).join("")}
  <g transform="translate(130 -310)"><ellipse rx="56" ry="34" fill="#D86B4B"/>${[-1, 1].map((d) => `<path d="M${d * 40} -10 q${d * 40} -30 ${d * 60} 0 M${d * 44} 6 q${d * 40} 10 ${d * 56} 30" stroke="#C25A44" stroke-width="7" fill="none" stroke-linecap="round"/>`).join("")}<circle cx="-14" cy="-26" r="6" fill="${C.tinta}"/><circle cx="14" cy="-26" r="6" fill="${C.tinta}"/></g>
  <path d="M200 -300 q40 -26 80 0 q-40 26 -80 0 Z m80 0 l18 -14 v28 Z" fill="#E7A0A0"/>`);
export const mostradorCarne = (id) => mostrador(id, "#8E3B2F", `<rect x="-290" y="-300" width="580" height="20" rx="8" fill="#FFFFFF"/>
  ${[-200, -90].map((x) => `<g transform="translate(${x} -330) rotate(-12)"><path d="M-60 0 Q-70 -40 -20 -46 Q40 -50 60 -10 Q60 20 20 22 L-40 18 Q-58 16 -60 0 Z" fill="#C9744F"/><rect x="56" y="-14" width="34" height="16" rx="8" fill="#F4F1EA"/></g>`).join("")}
  <g transform="translate(140 -330)"><ellipse rx="92" ry="36" fill="#E9A07A"/><circle cx="84" cy="-10" r="26" fill="#E9A07A"/><circle cx="96" cy="-14" r="4" fill="${C.tinta}"/><path d="M-92 -6 q-20 -10 -16 -26" stroke="#E9A07A" stroke-width="8" fill="none"/></g>`);

// ------------------------------------------------------------------ casa: árbol, mesa, dulces, juguetes, naranja
export const arbol = (id) => `<g id="${id}"><rect x="-22" y="-60" width="44" height="60" fill="#8A6A48"/><rect x="-60" y="-20" width="120" height="40" rx="8" fill="#B3261E" opacity=".85"/>
  ${[[0, -560, 90], [0, -440, 140], [0, -310, 190], [0, -170, 240]].map(([x, y, w]) => `<path d="M${x} ${y} L${x + w} ${y + 190} H${x - w} Z" fill="#3F7A4A"/>`).join("")}
  <path d="M0 -610 l14 30 32 3 -24 21 8 31 -30 -16 -30 16 8 -31 -24 -21 32 -3 Z" fill="#F2C14E"/>
  ${Array.from({ length: 16 }, (_, i) => { const y = -480 + (i % 8) * 50, w = 60 + (i % 8) * 24, x = ((i * 37) % (2 * w)) - w; return `<circle id="${id}-b${i}" cx="${x}" cy="${y + 40}" r="13" fill="${["#F2C14E", "#E07A3F", "#FFFDF8", "#7FB3D5"][i % 4]}"/>`; }).join("")}</g>`;
export const mesaNochebuena = (id) => `<g id="${id}"><ellipse cx="0" cy="10" rx="330" ry="30" fill="#3C2814" opacity=".15"/>
  <rect x="-300" y="-170" width="600" height="170" rx="12" fill="#8E6644"/><path d="M-320 -190 H320 L300 -60 H-300 Z" fill="#FFFDF8"/><path d="M-320 -190 H320 V-170 H-320 Z" fill="#E9E2D5"/>
  <path d="M-300 -60 L-320 -190 M300 -60 L320 -190" stroke="#B3261E" stroke-width="10"/>
  <g transform="translate(-170 -205)"><ellipse rx="80" ry="22" fill="#E9EDF0"/><path d="M-50 -8 Q-60 -40 -10 -44 Q40 -46 54 -12 Q50 8 20 8 L-34 6 Z" fill="#B8653F"/></g>
  <g transform="translate(0 -205)"><ellipse rx="80" ry="22" fill="#E9EDF0"/>${Array.from({ length: 6 }, (_, i) => gamba(-50 + i * 20, -8 - (i % 2) * 6, 0.8)).join("")}</g>
  <g transform="translate(160 -205)"><ellipse rx="70" ry="20" fill="#E9EDF0"/><path d="M-40 -6 l30 -20 l30 20 Z" fill="#F2D27A"/><path d="M0 -8 q20 -16 40 0 Z" fill="#B3463A"/></g>
  ${[250, 280].map((x, i) => `<g transform="translate(${x} -200)"><rect x="-12" y="-90" width="24" height="90" rx="6" fill="${i ? "#5B2A2A" : "#3F5E3A"}"/><rect x="-6" y="-118" width="12" height="30" fill="${i ? "#5B2A2A" : "#3F5E3A"}"/></g>`).join("")}
  ${[-260, 90].map((x) => `<g transform="translate(${x} -200)"><path d="M-12 -50 H12 L6 -20 H-6 Z" fill="#E7C9C9" opacity=".8"/><rect x="-2" y="-20" width="4" height="18" fill="#C9CED3"/></g>`).join("")}</g>`;
export const bandejaDulces = (id) => `<g id="${id}"><ellipse rx="230" ry="50" fill="#C9CED3"/><ellipse cy="-8" rx="230" ry="50" fill="#E9EDF0"/>
  <g transform="translate(-110 -30) rotate(-8)"><rect x="-70" y="-26" width="140" height="52" rx="6" fill="#F2DFA7"/>${Array.from({ length: 6 }, (_, i) => `<ellipse cx="${-50 + i * 20}" cy="${-4 + (i % 2) * 10}" rx="7" ry="5" fill="#C8902E"/>`).join("")}</g>
  <g transform="translate(40 -30) rotate(6)"><rect x="-60" y="-24" width="120" height="48" rx="6" fill="#8A5A3A"/><rect x="-60" y="-24" width="120" height="12" rx="6" fill="#A97E56"/></g>
  ${[[150, -40], [190, -20], [160, 0]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="24" fill="#F4EEDD" stroke="#E2D6B8" stroke-width="3"/>`).join("")}</g>`;
export const juguetes = (id) => `<g id="${id}">${[[-150, 0, 120, 100, "#B3261E", "#F2C14E"], [10, 0, 140, 120, "#3E8E8A", "#FFFDF8"], [150, 0, 100, 80, "#C8902E", "#B3261E"]].map(([x, y, w, h, c1, c2]) => `<g transform="translate(${x} ${y})"><rect x="${-w / 2}" y="${-h}" width="${w}" height="${h}" rx="8" fill="${c1}"/><rect x="-8" y="${-h}" width="16" height="${h}" fill="${c2}"/><path d="M0 ${-h} q-30 -30 -40 -6 q20 10 40 6 q30 -30 40 -6 q-20 10 -40 6" fill="${c2}"/></g>`).join("")}
  <g transform="translate(-40 40)"><rect x="-70" y="-40" width="140" height="40" rx="12" fill="#7FB3D5"/><circle cx="-40" cy="2" r="16" fill="${C.tinta}"/><circle cx="40" cy="2" r="16" fill="${C.tinta}"/></g></g>`;
export const NARANJA_MANO = `<g transform="translate(10 -40)"><circle r="30" fill="#E9923B"/><path d="M0 -30 q8 -12 18 -10" stroke="#3F7A4A" stroke-width="6" fill="none"/></g>`;
export const CARRO_MANO = `<g transform="translate(20 40)"><rect x="-40" y="-70" width="80" height="110" rx="12" fill="#3E8E8A"/><rect x="-6" y="-120" width="12" height="60" fill="#5B6470"/><circle cx="-24" cy="46" r="14" fill="${C.tinta}"/><circle cx="24" cy="46" r="14" fill="${C.tinta}"/></g>`;

// ------------------------------------------------------------------ el mapa de platos (la lista de Bruno, 23-11-2026)
// Posición aproximada (lon, lat) → coordenadas del mapa (equirrectangular a 40° N, de −9,30 a 4,33 de longitud y de 43,79 a 36,0 de latitud).
const xy = (lon, lat) => [((lon + 9.3) / 13.63) * MAPA.ancho, ((43.79 - lat) / 7.79) * MAPA.alto];
const icono = {
  pez: (c = "#E7A0A0") => `<path d="M-26 0 q26 -20 52 0 q-26 20 -52 0 Z m52 0 l14 -12 v24 Z" fill="${c}"/><circle cx="-14" cy="-3" r="3" fill="${C.tinta}"/>`,
  cangrejo: () => `<ellipse rx="22" ry="14" fill="#D86B4B"/><path d="M-18 -4 q-14 -14 -24 -2 M18 -4 q14 -14 24 -2" stroke="#C25A44" stroke-width="5" fill="none"/>`,
  asado: () => `<path d="M-26 6 Q-32 -16 -6 -20 Q22 -22 28 -2 Q28 12 10 12 L-16 10 Z" fill="#B8653F"/><rect x="24" y="-8" width="14" height="8" rx="4" fill="#F4F1EA"/>`,
  cerdito: () => `<ellipse rx="26" ry="14" fill="#E9A07A"/><circle cx="24" cy="-4" r="10" fill="#E9A07A"/><circle cx="28" cy="-6" r="2" fill="${C.tinta}"/>`,
  olla: () => `<path d="M-24 -6 H24 V8 Q24 18 14 18 H-14 Q-24 18 -24 8 Z" fill="#8E3B2F"/><rect x="-28" y="-10" width="56" height="8" rx="4" fill="#5B2A2A"/>`,
  turron: () => `<rect x="-24" y="-12" width="48" height="24" rx="4" fill="#F2DFA7"/>${[-14, 0, 14].map((x) => `<ellipse cx="${x}" cy="0" rx="5" ry="4" fill="#C8902E"/>`).join("")}`,
  gamba: () => gamba(0, 10, 1.1),
  ave: () => `<path d="M-24 8 Q-26 -18 4 -18 Q24 -16 24 4 Q18 14 -4 14 Z" fill="#C98A4B"/><rect x="18" y="-4" width="14" height="6" rx="3" fill="#F4F1EA"/>`,
  bacalao: () => `<path d="M-30 -8 Q-4 -20 26 -14 L34 0 L26 14 Q-4 20 -30 8 Q-36 0 -30 -8 Z" fill="#EFE8D8" stroke="#9AA6AE" stroke-width="3"/><path d="M-26 -8 Q-2 -18 24 -12" fill="none" stroke="#6F7C86" stroke-width="5" stroke-linecap="round"/>`,
  dulce: () => `<circle cx="-10" r="12" fill="#F4EEDD" stroke="#E2D6B8" stroke-width="3"/><circle cx="12" cy="2" r="12" fill="#F4EEDD" stroke="#E2D6B8" stroke-width="3"/>`,
};
// v3 (Bruno, 23-11-2026): solo platos cuyo ingrediente principal tiene una categoría oficial de precio (INE); los que no la
// tienen (cocido, escudella, perdiz) se cambian por otro de su lista de la misma región. El último campo es la clave de
// la subida (datos de calcular_t15.py, «mapa_subida_precio_pct»). Posiciones aproximadas, colocadas para que nada se pise.
export const PLATOS = [
  ["GALICIA", "Centollo", -8.0, 42.75, "cangrejo", "marisco"], ["PAÍS VASCO", "Bacalao", -2.2, 43.2, "bacalao", "bacalao"],
  ["CASTILLA Y LEÓN", "Lechazo", -5.8, 42.25, "asado", "cordero"], ["SEGOVIA", "Cochinillo", -3.4, 41.3, "cerdito", "cerdo"],
  ["ARAGÓN", "Ternasco", -0.8, 41.35, "asado", "cordero"], ["CATALUÑA", "Pularda", 1.75, 41.95, "ave", "ave"],
  ["MADRID", "Besugo", -3.75, 39.42, "pez", "pescado"], ["EXTREMADURA", "Caldereta", -6.3, 39.25, "olla", "cordero"],
  ["ALICANTE", "Turrón", -0.6, 38.55, "turron", "dulces"], ["HUELVA", "Gambas", -6.95, 37.4, "gamba", "marisco"],
  ["ESTEPA", "Polvorones", -4.3, 37.35, "dulce", "dulces"], ["BALEARES", "Escaldums", 2.95, 39.6, "ave", "ave"],
];
// Mapa grande con los platos: «<id>-p<i>» es cada plato y «<id>-q<i>» la pastilla roja con su subida (aparecen por separado
// en la escena). subidas: {clave: porcentaje entero}; sin ellas, el mapa de v1 (solo platos). nota: líneas de texto en el mar,
// abajo a la derecha (qué es la cifra). Origen: centro del mapa.
export function mapaPlatos(id, s = 1.15, subidas = null, nota = null, margen = 30) {
  const w = MAPA.ancho * s, h = MAPA.alto * s, mg = margen;
  const anchoNombre = (t) => Math.max(t.length * 13.2 + 18, 96);
  return `<g id="${id}"><rect x="${-w / 2 - mg}" y="${-h / 2 - mg}" width="${w + 2 * mg}" height="${h + 2 * mg}" rx="24" fill="#DCEAF0"/>
    <g transform="translate(${-w / 2} ${-h / 2}) scale(${s})"><path d="${MAPA.peninsula}" fill="${C.ocreClaro}" stroke="${C.tinta}" stroke-width="3" stroke-linejoin="round"/>
    ${PLATOS.map(([reg, plato, lon, lat, ic, clave], i) => { const [x, y] = xy(lon, lat), an = anchoNombre(plato); return `<g transform="translate(${x.toFixed(0)} ${y.toFixed(0)})">
      <g id="${id}-p${i}"><circle r="30" fill="#FFFDF8" stroke="${C.tinta}" stroke-width="2"/><g transform="scale(.9)">${icono[ic]()}</g>
      <rect x="${(-an / 2).toFixed(0)}" y="32" width="${an.toFixed(0)}" height="30" rx="10" fill="#FFFDF8" opacity=".96"/>${txt(0, 54, plato, 22, C.tinta)}</g>
      ${subidas ? `<g id="${id}-q${i}"><rect x="-54" y="65" width="108" height="37" rx="18" fill="#B3261E"/>${txt(0, 93, `+${subidas[clave]}\u00A0%`, 28, "#FFFFFF")}</g>` : ""}</g>`; }).join("")}
    ${nota ? `<g id="${id}-nota"><rect x="580" y="452" width="212" height="${nota.length * 22 + 16}" rx="12" fill="#FFFDF8" opacity=".9"/>${nota.map((l, i) => `<text x="592" y="${476 + i * 22}" font-family="Cap" font-weight="${i === nota.length - 1 ? 800 : 600}" font-size="16" fill="${i === nota.length - 1 ? "#B3261E" : C.tinta}">${l}</text>`).join("")}</g>` : ""}</g></g>`;
}


// ------------------------------------------------------------------ la mesa de Nochebuena, vista desde arriba (v4, Bruno, 23-11-2026)
// «Una vista cenital en la que se ve la mesa con los platos que se cenan. Una mesa grande para 8 o 10 personas.»
// Ocupa toda la pantalla (1080 × 1920). Ocho cubiertos, cuatro por lado; en el centro, cada plato de la cena dentro de
// «<id>-d-<clave>» (dibujado en su origen: la escena lo hace aparecer con pop en 0,0) y su etiqueta en «<id>-l-<clave>»
// (nombre y tiempo de trabajo). «<id>-pollo»: el pollo del chiste del abuelo (oculto hasta que lo saca la escena).
// La franja de los subtítulos (y 1404-1505) queda para el centro de mesa: ahí no hay comida ni cifras.
export const PLATOS_MESA = { cordero: [540, 770], marisco: [540, 1030], jamon: [420, 1590], queso: [660, 1590], vino: [540, 1260] };
const ESCALA_MESA = { cordero: 0.9, marisco: 0.86 };
const plato = (x, y, r) => `<g transform="translate(${x} ${y}) rotate(${r})"><circle r="48" fill="#FFFFFF" stroke="#D9DEE2" stroke-width="4"/><circle r="32" fill="none" stroke="#E9EDF0" stroke-width="3"/>
  <rect x="-66" y="-30" width="8" height="60" rx="4" fill="#B9C0C6"/><rect x="58" y="-30" width="8" height="60" rx="4" fill="#B9C0C6"/>
  <circle cx="0" cy="-74" r="17" fill="#FFFFFF" stroke="#D9DEE2" stroke-width="3"/><circle cx="0" cy="-74" r="11" fill="#7A1F2B"/>
  <path d="M30 40 l26 0 l-13 22 Z" fill="#B3261E" opacity=".85"/></g>`;
const silla = (x, y, r) => `<g transform="translate(${x} ${y}) rotate(${r})"><rect x="-58" y="-46" width="116" height="92" rx="18" fill="#7A5232"/><rect x="-58" y="-62" width="116" height="22" rx="10" fill="#5E3E24"/></g>`;
const pierna = (x, y, r) => `<g transform="translate(${x} ${y}) rotate(${r})"><path d="M-70 0 Q-74 -34 -20 -40 Q46 -44 64 -10 Q66 18 30 24 L-40 26 Q-68 24 -70 0 Z" fill="#B8653F"/>
  <path d="M-50 -14 Q0 -30 44 -12" fill="none" stroke="#D88A5E" stroke-width="9" stroke-linecap="round"/><rect x="58" y="-12" width="36" height="18" rx="9" fill="#F4F1EA"/></g>`;
const DISH = {
  cordero: () => `<ellipse rx="160" ry="88" fill="#C9CED3"/><ellipse rx="146" ry="76" fill="#E9EDF0"/>${pierna(-20, -26, -8)}${pierna(10, 30, 172)}
    ${[[-110, 20], [-96, 46], [104, -30], [120, -2], [92, 40]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="15" fill="#E8C26A" stroke="#C9A24A" stroke-width="3"/>`).join("")}
    <path d="M-40 60 l20 -8 M-30 66 l18 -12 M60 -62 l18 6" stroke="#5E7F5A" stroke-width="5" stroke-linecap="round"/>`,
  marisco: () => `<circle r="122" fill="#C9CED3"/><circle r="112" fill="#F4FAFD"/>${Array.from({ length: 14 }, (_, i) => { const a = i * 360 / 14;
      return `<g transform="rotate(${a}) translate(0 -80) rotate(90)"><path d="M-24 0 Q-26 -26 2 -30 Q28 -30 30 -10 Q24 -16 12 -14 Q-4 -12 -6 6 Z" fill="#F08A6B" stroke="#C25A44" stroke-width="2"/></g>`; }).join("")}
    <g><ellipse rx="42" ry="34" fill="#D86B4B"/>${[-1, 1].map((d) => [-20, -4, 12, 26].map((y) => `<path d="M${d * 38} ${y} q${d * 22} ${y / 3} ${d * 34} ${y / 2 + 10}" stroke="#C25A44" stroke-width="6" fill="none" stroke-linecap="round"/>`).join("")).join("")}
      <ellipse cx="0" cy="-6" rx="26" ry="18" fill="#E58A62"/></g>`,
  jamon: () => `<rect x="-92" y="-58" width="184" height="116" rx="16" fill="#B98A5A"/><rect x="-82" y="-48" width="164" height="96" rx="10" fill="#C99A68"/>
    ${[-56, -22, 12, 46].map((x, i) => `<path transform="translate(${x} ${i % 2 ? 6 : -4}) rotate(${-14 + i * 8})" d="M-26 -30 Q6 -38 22 -16 Q30 10 8 30 Q-20 34 -28 8 Z" fill="#B3463A" stroke="#F3E3D3" stroke-width="7"/>`).join("")}`,
  queso: () => `<circle r="78" fill="#B98A5A"/><circle r="68" fill="#C99A68"/>${[0, 72, 144, 216, 288].map((a) => `<g transform="rotate(${a})"><path d="M8 -6 L58 -22 Q62 0 58 22 Z" fill="#F2D27A" stroke="#D9A23B" stroke-width="5" stroke-linejoin="round"/></g>`).join("")}
    <circle r="12" fill="#E9EDF0"/>`,
  vino: () => [-96, -32, 32, 96].map((x) => `<g transform="translate(${x} 0)"><circle r="27" fill="#2F4A2A"/><circle r="27" fill="none" stroke="#4F6E48" stroke-width="5"/><circle r="12" fill="#B3261E"/><circle r="5" fill="#E3B23C"/></g>`).join(""),
};
const POLLO = `<circle r="150" fill="#FFFFFF" stroke="#D9DEE2" stroke-width="5"/><ellipse rx="96" ry="72" fill="#C98A4B"/><ellipse cx="-14" cy="-12" rx="62" ry="40" fill="#D9A062"/>
  ${[-1, 1].map((d) => `<path d="M${d * 70} 40 q${d * 40} 30 ${d * 54} 66" stroke="#B9783E" stroke-width="30" fill="none" stroke-linecap="round"/><circle cx="${d * 126}" cy="106" r="12" fill="#F4F1EA"/>`).join("")}
  <path d="M-40 -20 Q0 -44 40 -20" fill="none" stroke="#E8B77A" stroke-width="8" stroke-linecap="round"/>`;
export function mesaCenital(id, etiquetas) {
  const tablon = Array.from({ length: 13 }, (_, i) => `<line x1="${i * 90}" y1="0" x2="${i * 90}" y2="1920" stroke="#B48A5E" stroke-width="4"/>`).join("")
    + Array.from({ length: 13 }, (_, i) => Array.from({ length: 7 }, (_, j) => `<line x1="${i * 90}" y1="${(j * 320 + (i % 2) * 160) % 1920}" x2="${i * 90 + 90}" y2="${(j * 320 + (i % 2) * 160) % 1920}" stroke="#B48A5E" stroke-width="3"/>`).join("")).join("");
  const lados = [760, 1030, 1460, 1840];   // los cubiertos, al lado de cada plato y fuera de las filas de etiquetas
  // Etiqueta: nombre (blanco) y tiempo de trabajo (rojo). En los platos del centro, uno al lado del otro (así caben tres filas encima de
  // los subtítulos); en el jamón y el queso, que van de dos en dos, el tiempo debajo del nombre.
  const etiqueta = (k) => { const [x, y] = PLATOS_MESA[k], [nom, tiempo] = etiquetas[k], dy = { cordero: 90, marisco: 116, jamon: 72, queso: 92, vino: 40 }[k];
    const an = Math.max(nom.length * 16 + 28, 150), lado = ["cordero", "marisco", "vino"].includes(k), nx = lado ? -an / 2 - 4 : 0, tx = lado ? 76 : 0, ty = lado ? 0 : 48;
    return `<g transform="translate(${x} ${y + dy})"><g id="${id}-l-${k}"><rect x="${nx - an / 2}" y="0" width="${an}" height="44" rx="14" fill="#FFFDF8" stroke="#1F2A33" stroke-opacity=".12" stroke-width="2"/>${txt(nx, 32, nom, 27, C.tinta)}
      <rect x="${tx - 72}" y="${ty}" width="144" height="46" rx="23" fill="#B3261E"/>${txt(tx, ty + 34, tiempo, 33, "#FFFFFF")}</g></g>`; };
  return `<g id="${id}"><rect x="-200" y="-200" width="1480" height="2320" fill="#C89F72"/>${tablon}
    ${lados.map((y) => silla(178, y, -90) + silla(902, y, 90)).join("")}
    <rect x="236" y="620" width="608" height="1330" rx="26" fill="#3C2814" opacity=".18" transform="translate(10 12)"/>
    <rect x="236" y="620" width="608" height="1330" rx="26" fill="#FFFDF8"/><rect x="236" y="620" width="608" height="1330" rx="26" fill="none" stroke="#E9E2D5" stroke-width="10"/>
    <rect x="478" y="620" width="124" height="1330" fill="#3F7A4A" opacity=".9"/><rect x="478" y="620" width="124" height="1330" fill="none" stroke="#E3B23C" stroke-width="4"/>
    ${lados.map((y) => plato(296, y, 90) + plato(784, y, -90)).join("")}
    <g transform="translate(540 1455)"><circle r="62" fill="none" stroke="#2F5E37" stroke-width="30"/>${[0, 120, 240].map((a) => `<g transform="rotate(${a}) translate(0 -62)"><circle r="14" fill="#B3261E"/><circle r="5" fill="#F2C14E"/></g>`).join("")}</g>
    ${Object.keys(PLATOS_MESA).map((k) => `<g transform="translate(${PLATOS_MESA[k][0]} ${PLATOS_MESA[k][1]})"><g id="${id}-d-${k}"><g transform="scale(${ESCALA_MESA[k] ?? 1})">${DISH[k]()}</g></g></g>`).join("")}
    ${Object.keys(PLATOS_MESA).map(etiqueta).join("")}
    <g transform="translate(540 1100)"><g id="${id}-pollo" style="display:none">${POLLO}</g></g></g>`;
}
