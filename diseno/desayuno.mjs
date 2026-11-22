// Decorados y objetos del desayuno (T14, «¿Cuántos minutos trabajas para desayunar?»): la cocina de casa por la mañana
// y la tienda de barrio (ultramarinos). Todo dibujado con código, sin marcas. Capas para ambientes() de sueno.mjs:
// el suelo empieza en y = 1300 y los personajes pisan en y = 1440.

import { C, paseante } from "./limpio.mjs";

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

// ------------------------------------------------------------------ tienda de barrio (ultramarinos), sin marca, en perspectiva
// (Bruno, 22-11-2026: «algo de profundidad para acercarlo a un 3D»). Punto de fuga en (540, 700): pared del fondo entre
// x = 120 y 960; paredes laterales, techo y suelo fugan hacia él. Lámparas «tb-l0…», clientes al fondo «tb-w0…» y cajas
// de naranjas en primer plano «tb-fg», que anima vidaFondo().
function tienda() {
  const VX = 540, VY = 700;
  const enX = (x0, y0, x) => VY + (y0 - VY) * (x - VX) / (x0 - VX);   // altura en x de una línea que fuga desde (x0, y0)
  const balda = (y, cosas) => `<rect x="130" y="${y}" width="820" height="14" rx="4" fill="#8A6A48"/>${cosas.map(([x, k, s]) => `<g transform="translate(${x} ${y})">${P[k](s)}</g>`).join("")}`;
  // Balda de una pared lateral: va de la pared del fondo (x = xb) al borde de la imagen (x = xf) con su escorzo.
  const baldaLado = (xb, xf, yb, cols) => {
    const yf = enX(xb, yb, xf);
    let out = `<path d="M${xb} ${yb} L${xf} ${yf} L${xf} ${yf + 22 * (yf - VY) / (yb - VY)} L${xb} ${yb + 10} Z" fill="#8A6A48"/>`;
    for (let i = 0; i < cols.length; i++) {
      const u = (i + 0.5) / cols.length, x = xb + (xf - xb) * u, y = yb + (yf - yb) * u, sc = (y - VY) / (yb - VY);
      out += `<rect x="${(x - 16 * sc).toFixed(1)}" y="${(y - 70 * sc).toFixed(1)}" width="${(32 * sc).toFixed(1)}" height="${(70 * sc).toFixed(1)}" rx="${(6 * sc).toFixed(1)}" fill="${cols[i]}"/>`;
    }
    return out;
  };
  const colores = ["#B9B23A", "#7FA4B0", "#C8902E", "#8A4F2C", "#E07A5F", "#F2CC8F", "#7C9A7E", "#C9A0C2"];
  const lampara = (i, x, y, s) => `<g id="tb-l${i}" data-x="${x}" data-y="-400"><line x1="${x}" y1="-400" x2="${x}" y2="${y}" stroke="#5B4636" stroke-width="${4 * s}"/>
    <path d="M${x - 60 * s} ${y + 50 * s} Q${x} ${y - 40 * s} ${x + 60 * s} ${y + 50 * s} Z" fill="#3F6B5A"/><circle cx="${x}" cy="${y + 56 * s}" r="${18 * s}" fill="#FFE9A8"/>
    <circle cx="${x}" cy="${y + 90 * s}" r="${120 * s}" fill="#FFE9A8" opacity=".13"/></g>`;
  const naranjas = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-120" y="-130" width="240" height="130" rx="8" fill="#B98A5B"/><rect x="-120" y="-84" width="240" height="14" fill="#A9794F"/>
    ${[-80, -26, 28, 82].map((xx, k) => `<circle cx="${xx}" cy="${-140 - (k % 2) * 10}" r="34" fill="#F08A3C"/><circle cx="${xx - 10}" cy="${-152 - (k % 2) * 10}" r="8" fill="#FFFFFF" opacity=".3"/>`).join("")}</g>`;
  const yIzqT = enX(120, 470, X0), yIzqS = enX(120, 1040, X0), yDerT = enX(960, 470, X0 + ANCHO), yDerS = enX(960, 1040, X0 + ANCHO);
  // Suelo: líneas que fugan y líneas horizontales cada vez más separadas
  const fugas = Array.from({ length: 15 }, (_, i) => { const xb = 120 + i * 60; return `<line x1="${xb}" y1="1040" x2="${(VX + (xb - VX) * 4.6).toFixed(0)}" y2="2300" stroke="#C4B394" stroke-width="3"/>`; }).join("");
  const horiz = [1068, 1110, 1172, 1262, 1390, 1580, 1860].map((y) => `<line x1="${X0}" y1="${y}" x2="${X0 + ANCHO}" y2="${y}" stroke="#C4B394" stroke-width="3"/>`).join("");
  return `<rect x="${X0}" y="-400" width="${ANCHO}" height="2700" fill="#E8D8BC"/>
    <!-- techo -->
    <path d="M${X0} -400 H${X0 + ANCHO} V${yDerT} L960 470 H120 L${X0} ${yIzqT} Z" fill="#F4EBDA"/>
    <!-- pared del fondo con el rótulo y las baldas -->
    <rect x="120" y="470" width="840" height="570" fill="#F3E6CF"/>
    <rect x="160" y="490" width="760" height="70" rx="12" fill="#3F6B5A"/><text x="540" y="540" text-anchor="middle" font-family="Cap" font-weight="800" font-size="34" fill="#F4F1EA">ULTRAMARINOS · FRUTA · PAN</text>
    <rect x="130" y="580" width="820" height="460" fill="#E3CDA6"/>
    ${balda(720, [[180, "aceite", 0.5], [240, "aceite", 0.5], [320, "leche", 0.55], [380, "leche", 0.55], [460, "zumo", 0.55], [540, "azucar", 0.6], [620, "cafe", 0.62], [690, "cafe", 0.62], [780, "cacao", 0.6], [860, "cacao", 0.6]])}
    ${balda(870, [[200, "huevos", 0.48], [330, "huevos", 0.48], [470, "pan", 0.45], [610, "pan", 0.45], [740, "leche", 0.55], [820, "zumo", 0.55], [890, "azucar", 0.55]])}
    ${balda(1020, [])}
    <!-- pared izquierda, con baldas en escorzo -->
    <path d="M${X0} ${yIzqT} L120 470 L120 1040 L${X0} ${yIzqS} Z" fill="#E6CFA8"/>
    ${[640, 800, 960].map((y, k) => baldaLado(120, X0, y, colores.slice(k, k + 6))).join("")}
    <!-- pared derecha, con el mostrador en escorzo, la báscula y la caja -->
    <path d="M960 470 L${X0 + ANCHO} ${yDerT} L${X0 + ANCHO} ${yDerS} L960 1040 Z" fill="#DCC29A"/>
    ${baldaLado(960, X0 + ANCHO, 640, colores.slice(2, 8))}
    <path d="M960 ${1040 - 150} L${X0 + ANCHO} ${(enX(960, 890, X0 + ANCHO)).toFixed(0)} L${X0 + ANCHO} ${yDerS} L960 1040 Z" fill="#5E8C99"/>
    <path d="M940 ${1040 - 170} L${X0 + ANCHO} ${(enX(960, 870, X0 + ANCHO)).toFixed(0)} L${X0 + ANCHO} ${(enX(960, 890, X0 + ANCHO) + 10).toFixed(0)} L960 ${1040 - 150} Z" fill="#7FA4B0"/>
    <g transform="translate(1000 862) scale(.7)"><rect x="-50" y="-60" width="100" height="60" rx="8" fill="${C.tinta}"/><rect x="-40" y="-52" width="80" height="30" rx="4" fill="#9AE6B4"/></g>
    <!-- suelo en perspectiva -->
    <path d="M${X0} ${yIzqS} L120 1040 H960 L${X0 + ANCHO} ${yDerS} V2300 H${X0} Z" fill="#D8CBB4"/>${fugas}${horiz}
    <!-- clientes al fondo -->
    ${[["#C77B5B", "#E9BE98"], ["#7C9A7E", "#F2CBA8"]].map(([c, piel], i) => paseante(`tb-w${i}`, c, piel, 1)).join("")}
    <!-- lámparas colgantes a distintas profundidades -->
    ${lampara(0, 330, 430, 0.8)}${lampara(1, 750, 430, 0.8)}${lampara(2, -150, 260, 1.3)}${lampara(3, 1230, 260, 1.3)}
    <!-- primer plano: cajas de naranjas cerca de la cámara -->
    <g id="tb-fg">${naranjas(-40, 1880, 1.7)}${naranjas(1150, 1900, 1.8)}</g>`;
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
