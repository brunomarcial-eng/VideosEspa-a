// Decorados y objetos de T17 («Papá, ya tengo el carnet», coches B con padre e hijo; Bruno, 22-11-2026):
// el salón de casa en perspectiva (ventana a la calle con coches que pasan, lámpara que se mece, sofá y fotos) y un
// compraventa de coches usados al aire libre (banderines, carteles de «OCASIÓN» sin cifras, caseta). Capas para
// ambientes() de sueno.mjs: los personajes pisan en y = 1440. Prefijos para vidaFondo: «sl» (salón) y «cv» (compraventa).

import { C, paseante } from "./limpio.mjs";
import { coche } from "./transporte.mjs";

const X0 = -400, ANCHO = 1900, VX = 540, VY = 720;
const txt = (x, y, t, tam, color, o = "") => `<text x="${x}" y="${y}" text-anchor="middle" font-family="Cap" font-weight="800" font-size="${tam}" fill="${color}" ${o}>${t}</text>`;
const enX = (x0, y0, x) => VY + (y0 - VY) * (x - VX) / (x0 - VX);   // altura en x de una línea que fuga desde (x0, y0)

// ------------------------------------------------------------------ el salón
function salon() {
  const yIzqT = enX(140, 440, X0), yIzqS = enX(140, 1060, X0), yDerT = enX(940, 440, X0 + ANCHO), yDerS = enX(940, 1060, X0 + ANCHO);
  // parqué en perspectiva: tablas que fugan y juntas horizontales
  const tablas = Array.from({ length: 17 }, (_, i) => { const xb = 140 + i * 50; return `<line x1="${xb}" y1="1060" x2="${(VX + (xb - VX) * 4.2).toFixed(0)}" y2="2300" stroke="#B98F58" stroke-width="3" opacity=".7"/>`; }).join("");
  const juntas = [1090, 1135, 1200, 1295, 1440, 1660, 1980].map((y) => `<line x1="${X0}" y1="${y}" x2="${X0 + ANCHO}" y2="${y}" stroke="#B98F58" stroke-width="3" opacity=".55"/>`).join("");
  // calle por la ventana: edificios, acera y dos coches que pasan («sl-c0», «sl-c1»)
  const edificio = (x, w, h, col) => `<rect x="${x}" y="${930 - h}" width="${w}" height="${h}" fill="${col}"/>${Array.from({ length: Math.floor(h / 70) }, (_, f) =>
    Array.from({ length: Math.floor(w / 50) }, (_, k) => `<rect x="${x + 14 + k * 50}" y="${930 - h + 18 + f * 70}" width="24" height="34" rx="3" fill="#FFFDF8" opacity=".75"/>`).join("")).join("")}`;
  const lampara = `<g id="sl-l0" data-x="540" data-y="-400"><line x1="540" y1="-400" x2="540" y2="330" stroke="#5B4636" stroke-width="5"/>
    <path d="M470 330 H610 L580 270 H500 Z" fill="#E9C46A"/><circle cx="540" cy="340" r="16" fill="#FFF3C4"/><ellipse cx="540" cy="420" rx="160" ry="60" fill="#FFF7D6" opacity=".14"/></g>`;
  const marco = (x, y, w, h, dentro) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="#8E6644"/><rect x="${x + 10}" y="${y + 10}" width="${w - 20}" height="${h - 20}" fill="#F4F1EA"/>${dentro}`;
  return `<rect x="${X0}" y="-400" width="${ANCHO}" height="2700" fill="#F1E9DD"/>
    <!-- techo -->
    <path d="M${X0} -400 H${X0 + ANCHO} V${yDerT} L940 440 H140 L${X0} ${yIzqT} Z" fill="#FAF6F0"/>
    <!-- pared del fondo con la ventana a la calle -->
    <rect x="140" y="440" width="800" height="620" fill="#EADFCD"/>
    <g><clipPath id="sl-ventana"><rect x="300" y="520" width="480" height="420"/></clipPath>
      <g clip-path="url(#sl-ventana)"><rect x="300" y="520" width="480" height="420" fill="#BFE3F2"/>
        ${edificio(290, 160, 300, "#D9C7B0")}${edificio(460, 120, 360, "#C9B6A0")}${edificio(590, 200, 260, "#DCCDB8")}
        <rect x="300" y="880" width="480" height="60" fill="#9AA6AE"/><rect x="300" y="872" width="480" height="10" fill="#C9CED3"/>
        <g id="sl-c0"><g transform="scale(.32)">${coche("sl-c0-a", "#3E8E8A")}</g></g>
        <g id="sl-c1"><g transform="scale(.3)">${coche("sl-c1-a", "#E0B04A")}</g></g></g></g>
    <rect x="290" y="510" width="500" height="20" fill="#FFFDF8"/><rect x="290" y="930" width="500" height="22" fill="#FFFDF8"/>
    <rect x="290" y="510" width="20" height="440" fill="#FFFDF8"/><rect x="770" y="510" width="20" height="440" fill="#FFFDF8"/><rect x="530" y="510" width="20" height="440" fill="#FFFDF8"/>
    <path d="M270 500 H330 V960 Q300 940 270 960 Z" fill="#C77B5B" opacity=".85"/><path d="M810 500 H750 V960 Q780 940 810 960 Z" fill="#C77B5B" opacity=".85"/>
    <!-- paredes laterales -->
    <path d="M${X0} ${yIzqT} L140 440 L140 1060 L${X0} ${yIzqS} Z" fill="#E2D5C1"/>
    <path d="M940 440 L${X0 + ANCHO} ${yDerT} L${X0 + ANCHO} ${yDerS} L940 1060 Z" fill="#DCCDB6"/>
    <!-- fotos en la pared izquierda (en perspectiva) -->
    <g transform="translate(-60 ${enX(140, 640, -60).toFixed(0)}) skewY(-27)">${marco(-70, -80, 140, 120, `<circle cx="0" cy="-30" r="20" fill="#E9BE98"/><rect x="-26" y="-8" width="52" height="40" rx="14" fill="#7C9A7E"/>`)}</g>
    <g transform="translate(60 ${enX(140, 600, 60).toFixed(0)}) skewY(-27)">${marco(-50, -60, 100, 90, `<path d="M-30 18 L-6 -20 L14 4 L24 -8 L36 18 Z" fill="#9BC77A"/>`)}</g>
    <!-- mueble de la tele a la izquierda y planta -->
    <g transform="translate(250 1110)"><rect x="-120" y="-90" width="240" height="90" rx="8" fill="#8E6644"/><rect x="-110" y="-80" width="105" height="70" rx="4" fill="#A97E56"/><rect x="5" y="-80" width="105" height="70" rx="4" fill="#A97E56"/>
      <rect x="-90" y="-210" width="180" height="110" rx="6" fill="${C.tinta}"/><rect x="-82" y="-202" width="164" height="94" rx="3" fill="#3B4A57"/><rect x="-8" y="-100" width="16" height="12" fill="${C.tinta}"/></g>
    <g transform="translate(110 1130)"><rect x="-34" y="-70" width="68" height="70" rx="10" fill="#C77B5B"/>
      ${[[-40, -150], [0, -190], [40, -150], [-20, -120], [24, -118]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="26" ry="52" fill="#5F9F4A" transform="rotate(${x / 2} ${x} ${y})"/>`).join("")}</g>
    <!-- sofá a la derecha -->
    <g transform="translate(860 1150)"><rect x="-190" y="-170" width="380" height="110" rx="34" fill="#5F8F86"/><rect x="-200" y="-90" width="400" height="90" rx="26" fill="#6FA197"/>
      <rect x="-230" y="-120" width="60" height="120" rx="24" fill="#5F8F86"/><rect x="170" y="-120" width="60" height="120" rx="24" fill="#5F8F86"/>
      <rect x="-120" y="-150" width="90" height="70" rx="20" fill="#E9C46A"/><rect x="-170" y="0" width="16" height="14" fill="#5B4636"/><rect x="154" y="0" width="16" height="14" fill="#5B4636"/></g>
    <!-- suelo de parqué y alfombra -->
    <path d="M${X0} ${yIzqS} L140 1060 H940 L${X0 + ANCHO} ${yDerS} V2300 H${X0} Z" fill="#D9BC92"/>${tablas}${juntas}
    <path d="M300 1180 H780 L900 1420 H180 Z" fill="#C98F6B" opacity=".55"/><path d="M330 1200 H750 L850 1400 H230 Z" fill="none" stroke="#FFFDF8" stroke-width="6" opacity=".5"/>
    ${lampara}
    <!-- primer plano: una hoja de planta desenfocada en la esquina (se mueve al revés que el fondo) -->
    <g id="sl-fg" opacity=".9"><ellipse cx="-40" cy="1820" rx="120" ry="260" fill="#4E8A3E" transform="rotate(28 -40 1820)"/><ellipse cx="60" cy="1900" rx="90" ry="220" fill="#5F9F4A" transform="rotate(48 60 1900)"/></g>`;
}

// ------------------------------------------------------------------ el compraventa
function compraventa() {
  const filaCoches = (y, s, cols, x0, paso) => cols.map((col, i) => {
    const x = x0 + i * paso;
    return `<g transform="translate(${x} ${y}) scale(${s})">${coche(`cv-a${y}-${i}`, col)}
      <g transform="translate(-60 -190)"><rect x="-58" y="-26" width="116" height="52" rx="8" fill="#FFFDF8" stroke="#E0B04A" stroke-width="6"/>${txt(0, 12, "OCASIÓN", 26, "#B3261E")}</g></g>`;
  }).join("");
  const banderines = (y0, n) => Array.from({ length: n }, (_, i) => {
    const x = -300 + i * 96, y = y0 + 30 * Math.sin(i / (n - 1) * Math.PI);
    return `<path d="M${x} ${y.toFixed(0)} L${x + 96} ${(y0 + 30 * Math.sin((i + 1) / (n - 1) * Math.PI)).toFixed(0)} L${x + 48} ${(y + 70).toFixed(0)} Z" fill="${["#E0B04A", "#3E8E8A", "#C77B5B", "#7C9A7E"][i % 4]}"/>`;
  }).join("");
  const plazas = Array.from({ length: 12 }, (_, i) => { const xb = 120 + i * 80; return `<line x1="${xb}" y1="1000" x2="${(VX + (xb - VX) * 3.6).toFixed(0)}" y2="2300" stroke="#FFFFFF" stroke-width="5" opacity=".6"/>`; }).join("");
  return `<rect x="${X0}" y="-400" width="${ANCHO}" height="2700" fill="#BFE3F2"/>
    <circle cx="860" cy="260" r="70" fill="#FFE7A3"/>
    <ellipse cx="200" cy="300" rx="140" ry="40" fill="#FFFFFF" opacity=".8"/><ellipse cx="620" cy="200" rx="110" ry="32" fill="#FFFFFF" opacity=".7"/>
    <!-- ciudad al fondo -->
    ${[[-300, 260, 420], [-60, 200, 520], [160, 240, 380], [420, 180, 560], [620, 260, 430], [900, 220, 500], [1140, 260, 400]].map(([x, w, h]) =>
      `<rect x="${x}" y="${1000 - h}" width="${w}" height="${h}" fill="${["#D9C7B0", "#C9B6A0", "#DCCDB8"][Math.abs(x) % 3]}" opacity=".9"/>`).join("")}
    <!-- caseta del compraventa con su letrero (sin marca) -->
    <g transform="translate(830 1000)"><rect x="-150" y="-230" width="300" height="230" rx="10" fill="#F4F1EA" stroke="#C9CED3" stroke-width="5"/>
      <rect x="-110" y="-170" width="120" height="100" rx="6" fill="#BFE3F2"/><rect x="40" y="-170" width="80" height="170" rx="6" fill="#8E6644"/>
      <rect x="-190" y="-320" width="380" height="80" rx="12" fill="#3F6B5A"/>${txt(0, -266, "COMPRAVENTA", 46, "#FFFFFF")}</g>
    <!-- suelo de asfalto con plazas pintadas -->
    <path d="M${X0} 1000 H${X0 + ANCHO} V2300 H${X0} Z" fill="#8C969C"/>${plazas}
    <rect x="${X0}" y="994" width="${ANCHO}" height="12" fill="#C9CED3"/>
    <!-- banderines -->
    <line x1="-300" y1="560" x2="1380" y2="560" stroke="#5B6470" stroke-width="4"/>
    <g id="cv-band">${banderines(560, 18)}</g>
    <!-- coches en venta a dos profundidades -->
    ${filaCoches(1090, 0.42, ["#9AA6AE", "#3E8E8A", "#E0B04A", "#C9A0C2"], 80, 260)}
    ${filaCoches(1250, 0.6, ["#7C9A7E", "#D9A23B"], -120, 1240)}
    <!-- gente mirando coches -->
    ${paseante("cv-w0", "#7C9A7E", "#F2CBA8", 1)}${paseante("cv-w1", "#C9A0C2", "#E9BE98", 1)}
    <!-- primer plano: un cono a la izquierda -->
    <g id="cv-fg"><path d="M-30 1900 L30 1700 L90 1900 Z" fill="#E07A3F"/><rect x="-50" y="1890" width="160" height="26" rx="8" fill="#E07A3F"/><path d="M8 1772 L52 1772 L60 1806 L0 1806 Z" fill="#FFFFFF"/></g>`;
}
export const DECORADOS_T17 = { salon, compraventa };

// ------------------------------------------------------------------ objetos
// El papel del examen: «APTO» en verde (en la mano del hijo con PAPEL_MANO).
export const papel = (id, s = 1) => `<g id="${id}"><g transform="scale(${s})"><rect x="-90" y="-120" width="180" height="240" rx="10" fill="#FFFFFF" stroke="#C9CED3" stroke-width="5"/>
  ${[-80, -54, -28].map((y) => `<rect x="-62" y="${y}" width="124" height="10" rx="5" fill="#D9DEE2"/>`).join("")}
  <g transform="translate(0 46) rotate(-12)"><rect x="-74" y="-34" width="148" height="68" rx="10" fill="none" stroke="#2E8B57" stroke-width="8"/>${txt(0, 18, "APTO", 50, "#2E8B57")}</g></g></g>`;
export const PAPEL_MANO = `<g transform="translate(10 -110) scale(.55)">${papel("pm-x").replace('id="pm-x"', "")}</g>`;
// Foto enmarcada del primo con su coche nuevo y un lazo. Origen: el centro.
export const fotoPrimo = (id) => `<g id="${id}"><rect x="-200" y="-150" width="400" height="300" rx="14" fill="#8E6644"/><rect x="-184" y="-134" width="368" height="268" fill="#DFF0F7"/>
  <rect x="-184" y="70" width="368" height="64" fill="#9BC77A"/>
  <g transform="translate(40 96) scale(.48)">${coche(id + "-c", "#3E8E8A")}</g>
  <path d="M20 -20 l-36 -26 v52 Z M20 -20 l36 -26 v52 Z" fill="#B3261E" transform="translate(40 30)"/><circle cx="60" cy="10" r="12" fill="#B3261E"/>
  <g transform="translate(-120 96)"><rect x="-26" y="-90" width="52" height="70" rx="20" fill="#E0B04A"/><circle cx="0" cy="-110" r="24" fill="#F2CBA8"/>
    <path d="M-24 -116 C-26 -138 -8 -142 0 -141 C12 -142 26 -136 24 -114 C16 -128 6 -130 0 -130 C-8 -130 -18 -128 -24 -116 Z" fill="#3B2A20"/>
    <path d="M-10 -104 Q0 -96 10 -104" fill="none" stroke="#7A3E2E" stroke-width="4" stroke-linecap="round"/><rect x="-22" y="-20" width="18" height="40" rx="8" fill="#34495E"/><rect x="4" y="-20" width="18" height="40" rx="8" fill="#34495E"/></g></g>`;
// Etiqueta de precio que cuelga de un coche. «<id>-t» es el texto.
export const etiqueta = (id, texto) => `<g id="${id}"><path d="M-110 -40 H90 L130 0 L90 40 H-110 Z" fill="#FFFDF8" stroke="#B3261E" stroke-width="6"/><circle cx="96" cy="0" r="9" fill="#B3261E"/>
  <text id="${id}-t" x="-10" y="16" text-anchor="middle" font-family="Cap" font-weight="800" font-size="44" fill="#B3261E">${texto}</text></g>`;
// Álbum de fotos abierto. Origen: el centro.
export const album = (id, anyo) => `<g id="${id}"><path d="M-260 -150 Q-130 -180 0 -150 Q130 -180 260 -150 V160 Q130 130 0 160 Q-130 130 -260 160 Z" fill="#8E6644"/>
  <path d="M-244 -136 Q-122 -162 -6 -136 V146 Q-122 120 -244 146 Z" fill="#FFFDF8"/><path d="M6 -136 Q122 -162 244 -136 V146 Q122 120 6 146 Z" fill="#FFFDF8"/>
  <rect x="-214" y="-100" width="180" height="140" fill="#D9C7B0"/><rect x="36" y="-100" width="180" height="140" fill="#C9D9E2"/>
  <g transform="translate(126 20) scale(.3)">${coche(id + "-c", "#C9A0C2")}</g>${txt(-124, 100, anyo, 40, "#8A6316")}${txt(126, 100, anyo, 40, "#8A6316")}</g>`;
// Icono de coche pequeño para los pictogramas (de lado). Origen: el centro de las ruedas.
export const iconoCoche = (id, col) => `<g id="${id}"><path d="M-36 -6 Q-36 -18 -26 -20 L-16 -22 Q-8 -36 6 -36 Q20 -36 28 -22 Q36 -20 36 -8 V0 H-36 Z" fill="${col}"/>
  <circle cx="-20" cy="0" r="8" fill="${C.tinta}"/><circle cx="20" cy="0" r="8" fill="${C.tinta}"/></g>`;
// Sudadera del hijo (persona({encima})): capucha y cordones.
export const SUDADERA = `<path d="M-60 -384 Q0 -340 60 -384 Q50 -360 0 -350 Q-50 -360 -60 -384 Z" fill="#2F6F69" opacity=".7"/>
  <line x1="-14" y1="-352" x2="-16" y2="-300" stroke="#FFFDF8" stroke-width="5" stroke-linecap="round"/><line x1="14" y1="-352" x2="16" y2="-300" stroke="#FFFDF8" stroke-width="5" stroke-linecap="round"/>
  <rect x="-46" y="-250" width="92" height="44" rx="14" fill="#2F6F69" opacity=".45"/>`;
// Llaves (las da el padre al final).
export { LLAVES, calendario, hoja } from "./concesionario.mjs";

// ------------------------------------------------------------------ T17 v2 (Bruno, 23-11-2026)
// Sello «A MEDIAS» (el chiste que se repite: «la mitad la pones tú»). Mismo estilo que el sello oficial; se anima con selloAnim.
export function selloMedias(id) {
  const rojo = "#C62828";
  return `<g id="${id}" style="display:none"><g opacity=".93"><rect x="-210" y="-96" width="420" height="192" rx="24" fill="#FFFFFF" fill-opacity=".6" stroke="${rojo}" stroke-width="13"/>
    <rect x="-190" y="-76" width="380" height="152" rx="14" fill="none" stroke="${rojo}" stroke-width="5"/>
    ${txt(0, -8, "A MEDIAS", 66, rojo, 'letter-spacing="2"')}${txt(0, 58, "½ Y ½", 44, rojo)}</g></g>`;
}
// Destello de coche nuevo (estrella de cuatro puntas). Se anima en la escena (escala y opacidad).
export const destello = (id, s = 1) => `<g id="${id}"><circle r="${30 * s}" fill="#FFE27A" opacity=".35"/><path transform="scale(${s})" d="M0 -46 Q7 -7 46 0 Q7 7 0 46 Q-7 7 -46 0 Q-7 -7 0 -46 Z" fill="#F2C14E" stroke="#FFFFFF" stroke-width="3"/><circle r="${7 * s}" fill="#FFFFFF"/></g>`;
// Móvil con la foto del primo y su coche nuevo (sus padres se lo compraron en 2016).
export const movilPrimo = (id) => `<g id="${id}"><rect x="-130" y="-230" width="260" height="460" rx="34" fill="${C.tinta}"/><rect x="-114" y="-200" width="228" height="400" rx="16" fill="#DFF0F7"/>
  <g transform="translate(0 -10) scale(.52)">${fotoPrimo(id + "-f")}</g><rect x="-40" y="-218" width="80" height="10" rx="5" fill="#3B4A57"/></g>`;
