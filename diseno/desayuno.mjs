// Decorados y objetos del desayuno (T14, «¿Cuántos minutos trabajas para desayunar?»): la cocina de casa por la mañana
// y la tienda de barrio (ultramarinos). Todo dibujado con código, sin marcas. Capas para ambientes() de sueno.mjs:
// el suelo empieza en y = 1300 y los personajes pisan en y = 1440.

import { C } from "./limpio.mjs";

const X0 = -400, ANCHO = 1900;
const txt = (x, y, t, tam, color, o = "") => `<text x="${x}" y="${y}" text-anchor="middle" font-family="Cap" font-weight="800" font-size="${tam}" fill="${color}" ${o}>${t}</text>`;

// ------------------------------------------------------------------ productos del desayuno (origen: abajo, en el centro)
export const P = {
  cacao: (s = 1) => `<g transform="scale(${s})"><rect x="-46" y="-150" width="92" height="150" rx="16" fill="#8A4F2C"/><rect x="-50" y="-166" width="100" height="26" rx="10" fill="#F2CC8F"/>
    <rect x="-46" y="-110" width="92" height="56" fill="#F2CC8F"/>${txt(0, -74, "CACAO", 22, "#6B3A1F")}<circle cx="0" cy="-30" r="12" fill="#6B3A1F" opacity=".5"/></g>`,
  cafe: (s = 1) => `<g transform="scale(${s})"><path d="M-44 0 V-120 L-36 -150 H36 L44 -120 V0 Z" fill="#5A3A26"/><path d="M-36 -150 H36 L30 -166 H-30 Z" fill="#3E281A"/>
    <rect x="-44" y="-100" width="88" height="44" fill="#C8902E"/>${txt(0, -70, "CAFÉ", 22, "#3E281A")}</g>`,
  huevos: (s = 1) => `<g transform="scale(${s})"><rect x="-90" y="-60" width="180" height="60" rx="12" fill="#D9C7A6"/><path d="M-90 -60 L-80 -90 H80 L90 -60 Z" fill="#E8DCC2"/>
    ${[-60, -20, 20, 60].map((x) => `<ellipse cx="${x}" cy="-82" rx="17" ry="21" fill="#F2E2C6" stroke="#C9B48E" stroke-width="3"/>`).join("")}</g>`,
  naranja: (s = 1) => `<g transform="scale(${s})"><circle cx="0" cy="-40" r="40" fill="#F08A3C"/><circle cx="-12" cy="-54" r="10" fill="#FFFFFF" opacity=".25"/><path d="M0 -80 q10 -14 24 -10 q-8 12 -24 10" fill="#5F8F4A"/></g>`,
  zumo: (s = 1) => `<g transform="scale(${s})"><rect x="-38" y="-150" width="76" height="150" rx="6" fill="#FFFFFF" stroke="#E2E6E9" stroke-width="4"/><path d="M-38 -150 L0 -174 L38 -150 Z" fill="#F2CC8F"/>
    <circle cx="0" cy="-70" r="24" fill="#F08A3C"/>${txt(0, -24, "ZUMO", 18, "#C7684E")}</g>`,
  leche: (s = 1) => `<g transform="scale(${s})"><rect x="-38" y="-150" width="76" height="150" rx="6" fill="#FFFFFF" stroke="#E2E6E9" stroke-width="4"/><path d="M-38 -150 L0 -174 L38 -150 Z" fill="#7FA4B0"/>
    <rect x="-38" y="-110" width="76" height="40" fill="#7FA4B0"/>${txt(0, -82, "LECHE", 18, "#FFFFFF")}</g>`,
  azucar: (s = 1) => `<g transform="scale(${s})"><rect x="-44" y="-130" width="88" height="130" rx="8" fill="#F4F1EA" stroke="#E2E6E9" stroke-width="4"/>
    <rect x="-44" y="-96" width="88" height="40" fill="#C9A0C2"/>${txt(0, -68, "AZÚCAR", 16, "#FFFFFF")}</g>`,
  aceite: (s = 1) => `<g transform="scale(${s})"><path d="M-30 0 V-130 Q-30 -150 -14 -160 V-190 H14 V-160 Q30 -150 30 -130 V0 Z" fill="#B9B23A" opacity=".9"/><rect x="-16" y="-206" width="32" height="20" rx="4" fill="#5F8F4A"/>
    <rect x="-30" y="-100" width="60" height="50" fill="#F4F1EA"/>${txt(0, -68, "OLIVA", 14, "#5F8F4A")}</g>`,
  tostada: (s = 1) => `<g transform="scale(${s})"><path d="M-80 0 Q-90 -70 -40 -84 Q0 -96 40 -84 Q90 -70 80 0 Z" fill="#D9A45B"/><path d="M-70 -8 Q-78 -62 -36 -74 Q0 -84 36 -74 Q78 -62 70 -8 Z" fill="#F1D3A0"/>
    <path d="M-62 -20 Q-60 -58 -20 -66 Q20 -70 52 -56 Q66 -40 60 -20 Z" fill="#F4F1EA"/>${[-36, 0, 34].map((x, i) => `<ellipse cx="${x}" cy="${-42 + (i % 2) * 6}" rx="20" ry="12" fill="#8DB05A" stroke="#5F8F4A" stroke-width="4"/>`).join("")}
    ${[-18, 18].map((x) => `<path d="M${x - 22} -40 q22 -20 44 0 q-22 10 -44 0" fill="#F08A6A" stroke="#E07A5F" stroke-width="3"/>`).join("")}</g>`,
  churros: (s = 1) => `<g transform="scale(${s})"><ellipse cx="0" cy="-8" rx="110" ry="20" fill="#FFFFFF" stroke="#E2E6E9" stroke-width="4"/>
    ${[-40, 0, 40].map((x, i) => `<path d="M${x - 50} -${24 + i * 6} q50 -${30 + i * 4} 100 0" fill="none" stroke="#D9A45B" stroke-width="22" stroke-linecap="round"/><path d="M${x - 50} -${24 + i * 6} q50 -${30 + i * 4} 100 0" fill="none" stroke="#B98235" stroke-width="22" stroke-linecap="round" stroke-dasharray="4 10" opacity=".5"/>`).join("")}</g>`,
  cafeConLeche: (s = 1) => `<g transform="scale(${s})"><ellipse cx="0" cy="-4" rx="62" ry="12" fill="#E2E6E9"/><path d="M-44 -96 H44 L36 -12 Q0 0 -36 -12 Z" fill="#FFFFFF" stroke="#E2E6E9" stroke-width="4"/>
    <ellipse cx="0" cy="-96" rx="44" ry="10" fill="#C8A06B"/><path d="M44 -80 q30 0 26 26 q-4 20 -30 16" fill="none" stroke="#FFFFFF" stroke-width="10"/></g>`,
  pan: (s = 1) => `<g transform="scale(${s})"><path d="M-110 -18 Q-120 -60 -70 -64 H70 Q120 -60 110 -18 Q100 0 70 0 H-70 Q-100 0 -110 -18 Z" fill="#D9A45B"/>
    ${[-60, -20, 20, 60].map((x) => `<path d="M${x - 16} -52 q16 -14 32 0" fill="none" stroke="#B98235" stroke-width="7" stroke-linecap="round"/>`).join("")}</g>`,
};

// Reloj de cocina para los minutos de trabajo: «<id>-v» es el sector de los minutos (de 0 a 60), «<id>-ag» la aguja.
export const relojCocina = (id, r = 110, borde = "#C8902E") => `<g id="${id}"><circle r="${r + 18}" fill="${borde}"/><circle r="${r}" fill="#FFFFFF"/>
  <path id="${id}-v" d="" fill="${borde}" opacity=".55"/>
  ${Array.from({ length: 12 }, (_, i) => `<rect x="-4" y="${-r + 8}" width="8" height="${i % 3 ? 14 : 26}" rx="3" fill="${C.tinta}" transform="rotate(${i * 30})"/>`).join("")}
  <g id="${id}-ag"><rect x="-5" y="${-r * 0.82}" width="10" height="${r * 0.82}" rx="5" fill="${C.tinta}"/></g><circle r="12" fill="${C.tinta}"/>
  <rect x="-14" y="${-r - 34}" width="28" height="20" rx="6" fill="${borde}"/></g>`;

const suelo = (a, b, y = 1300) => `<rect x="${X0}" y="${y}" width="${ANCHO}" height="${2300 - y}" fill="${a}"/>
  ${Array.from({ length: 15 }, (_, i) => Array.from({ length: 8 }, (_, j) => (i + j) % 2 ? `<rect x="${X0 + i * 130}" y="${y + j * 130}" width="130" height="130" fill="${b}"/>` : "").join("")).join("")}`;

// ------------------------------------------------------------------ cocina de casa por la mañana
function cocina() {
  const azulejos = Array.from({ length: 16 }, (_, i) => Array.from({ length: 4 }, (_, j) =>
    `<rect x="${X0 + i * 120 + 4}" y="${830 + j * 62 + 4}" width="112" height="54" rx="4" fill="${(i + j) % 3 ? "#E3EEF0" : "#CFE3E6"}"/>`).join("")).join("");
  return `<rect x="${X0}" y="-400" width="${ANCHO}" height="1720" fill="#F6EEDC"/>
    <rect x="${X0}" y="830" width="${ANCHO}" height="250" fill="#BFD6DA"/>${azulejos}
    <!-- ventana con luz de mañana -->
    <rect x="560" y="560" width="420" height="300" rx="10" fill="#FFFFFF"/><rect x="576" y="576" width="388" height="268" rx="6" fill="#FFE7B3"/>
    <circle cx="880" cy="640" r="44" fill="#FFD27A"/><path d="M576 800 Q680 740 780 790 Q880 740 964 790 V844 H576 Z" fill="#B7CFA6"/>
    <line x1="770" y1="576" x2="770" y2="844" stroke="#FFFFFF" stroke-width="12"/><line x1="576" y1="710" x2="964" y2="710" stroke="#FFFFFF" stroke-width="12"/>
    <g transform="translate(640 860)"><rect x="-34" y="-44" width="68" height="44" rx="8" fill="#C77B5B"/><path d="M0 -44 q-30 -40 -10 -70 M0 -44 q20 -46 34 -60 M0 -44 q4 -40 0 -76" fill="none" stroke="#5F8F4A" stroke-width="8" stroke-linecap="round"/></g>
    <!-- armarios altos -->
    <rect x="-400" y="520" width="900" height="250" rx="10" fill="#E9D3AE"/>${[-380, -160, 60, 280].map((x) => `<rect x="${x}" y="540" width="200" height="210" rx="8" fill="#F1E0C2"/><rect x="${x + 170}" y="630" width="10" height="40" rx="5" fill="#B98A5B"/>`).join("")}
    <!-- encimera con fogón, cafetera, tostadora y frutero -->
    <rect x="${X0}" y="1080" width="${ANCHO}" height="34" fill="#C8B79B"/><rect x="${X0}" y="1114" width="${ANCHO}" height="186" fill="#E9D3AE"/>
    ${[-380, -100, 180, 460, 740, 1020, 1300].map((x) => `<rect x="${x}" y="1130" width="260" height="150" rx="8" fill="#F1E0C2"/><rect x="${x + 110}" y="1140" width="40" height="10" rx="5" fill="#B98A5B"/>`).join("")}
    <g transform="translate(330 1080)"><rect x="-90" y="-16" width="180" height="16" rx="4" fill="#3A3A3A"/>
      <g id="cafetera" transform="translate(0 -16)"><path d="M-40 0 L-30 -70 H30 L40 0 Z" fill="#B9C1C7"/><path d="M-30 -70 L-40 -140 H40 L30 -70 Z" fill="#CDD3D7"/><rect x="-14" y="-160" width="28" height="22" rx="6" fill="#3A3A3A"/>
      <path d="M40 -130 q30 6 24 46" fill="none" stroke="#3A3A3A" stroke-width="10" stroke-linecap="round"/></g></g>
    <g transform="translate(540 1080)"><rect x="-80" y="-110" width="160" height="110" rx="26" fill="#E07A5F"/><rect x="-50" y="-126" width="30" height="20" rx="4" fill="#3A3A3A"/><rect x="20" y="-126" width="30" height="20" rx="4" fill="#3A3A3A"/>
      <rect x="66" y="-70" width="24" height="12" rx="4" fill="#3A3A3A"/></g>
    <g transform="translate(1180 1080)"><path d="M-90 0 Q-90 -50 0 -50 Q90 -50 90 0 Z" fill="#7FA4B0"/>
      ${[-46, 0, 46].map((x, i) => `<circle cx="${x}" cy="-70" r="32" fill="${i === 1 ? "#E9C46A" : "#F08A3C"}"/>`).join("")}</g>
    ${suelo("#E8E0D0", "#D8CDB8")}`;
}

// ------------------------------------------------------------------ tienda de barrio (ultramarinos), sin marca
function tienda() {
  const balda = (y, cosas) => `<rect x="-380" y="${y}" width="1180" height="20" rx="4" fill="#8A6A48"/>${cosas.map(([x, k, s]) => `<g transform="translate(${x} ${y})">${P[k](s)}</g>`).join("")}`;
  return `<rect x="${X0}" y="-400" width="${ANCHO}" height="1720" fill="#F3E6CF"/>
    <!-- rótulo de la tienda -->
    <rect x="-380" y="520" width="1180" height="96" rx="14" fill="#3F6B5A"/>${txt(210, 586, "ULTRAMARINOS · FRUTA · PAN", 44, "#F4F1EA")}
    <!-- estantería con productos del desayuno -->
    <rect x="-390" y="620" width="1200" height="480" fill="#C9A26B"/><rect x="-370" y="640" width="1160" height="440" fill="#E3CDA6"/>
    ${balda(800, [[-300, "aceite", 0.62], [-230, "aceite", 0.62], [-160, "aceite", 0.62], [-60, "leche", 0.7], [10, "leche", 0.7], [80, "leche", 0.7], [180, "zumo", 0.7], [250, "zumo", 0.7], [360, "azucar", 0.75], [440, "azucar", 0.75], [560, "cafe", 0.8], [640, "cafe", 0.8], [720, "cafe", 0.8]])}
    ${balda(960, [[-300, "cacao", 0.72], [-220, "cacao", 0.72], [-140, "cacao", 0.72], [-20, "huevos", 0.6], [120, "huevos", 0.6], [260, "huevos", 0.6], [420, "pan", 0.55], [580, "pan", 0.55], [720, "leche", 0.7]])}
    ${balda(1080, [])}
    <!-- cajas de naranjas en el suelo, a la derecha -->
    ${[880, 1080].map((x) => `<g transform="translate(${x} 1300)"><rect x="-90" y="-110" width="180" height="110" rx="6" fill="#B98A5B"/><rect x="-90" y="-70" width="180" height="12" fill="#A9794F"/>
      ${[-55, 0, 55].map((xx) => `<circle cx="${xx}" cy="-120" r="30" fill="#F08A3C"/>`).join("")}</g>`).join("")}
    <!-- campanilla de la puerta y báscula -->
    <g transform="translate(1000 700)"><rect x="-4" y="-60" width="8" height="40" fill="#8C969C"/><path d="M-26 0 Q-26 -30 0 -30 Q26 -30 26 0 Z" fill="#E9C46A"/><circle cy="6" r="7" fill="#C8902E"/></g>
    ${suelo("#D8CBB4", "#CBBC9F")}`;
}
export const DECORADOS_T14 = { cocinaDesayuno: cocina, tiendaBarrio: tienda };

// ------------------------------------------------------------------ ropa y objetos en la mano
export const DELANTAL = `<path d="M-60 -330 H60 V-170 H-60 Z" fill="#F4F1EA"/><path d="M-60 -330 Q0 -300 60 -330" fill="none" stroke="#E2E6E9" stroke-width="6"/>
  <rect x="-34" y="-250" width="68" height="40" rx="6" fill="#E3CDA6"/><path d="M-60 -330 L-40 -378 M60 -330 L40 -378" stroke="#F4F1EA" stroke-width="10" stroke-linecap="round"/>`;
export const PIJAMA_RAYAS = `${[-330, -290, -250, -210].map((y) => `<rect x="-82" y="${y}" width="164" height="14" fill="#FFFFFF" opacity=".28"/>`).join("")}`;
export const BOTE_CACAO_MANO = `<g transform="translate(4 -10) rotate(180)">${P.cacao(0.55)}</g>`;
export const CAFE_MANO = `<g transform="translate(6 30)">${P.cafe(0.6)}</g>`;
export const CHURRO_MANO = `<g transform="translate(0 10) rotate(-60)"><path d="M-60 0 q60 -40 120 0" fill="none" stroke="#D9A45B" stroke-width="20" stroke-linecap="round"/></g>`;
export const PAN_MANO = `<g transform="translate(0 30) rotate(-70)">${P.pan(0.6)}</g>`;
export const BOLSO = `<g transform="translate(0 40)"><path d="M-30 -20 Q0 -70 30 -20" fill="none" stroke="#6B3A1F" stroke-width="8"/><rect x="-46" y="-24" width="92" height="76" rx="14" fill="#8A4F2C"/></g>`;
