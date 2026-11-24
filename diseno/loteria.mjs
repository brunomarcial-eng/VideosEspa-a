// Decorado y objetos de T20 («¿Lotería o invertir?», Bruno 24-11-2026): una oficina en Navidad en perspectiva (ventanales
// con la ciudad en invierno, mesas con ordenadores, espumillón, un arbolito con luces y el corcho con la lista del décimo
// de la oficina), un décimo genérico (sin logotipos ni marcas), los diez décimos del dato del Tribunal de Cuentas, la
// gráfica de lo jugado frente a lo invertido y el sobre de Hacienda. Todo dibujado con código.
// Capa para ambientes() de sueno.mjs; prefijo para vidaFondo: «ol». Los personajes pisan en y = 1440.

import { C, paseante } from "./limpio.mjs";

const X0 = -400, ANCHO = 1900, VX = 540, VY = 700;
const txt = (x, y, t, tam, color, o = "", ancla = "middle") => `<text x="${x}" y="${y}" text-anchor="${ancla}" font-family="Cap" font-weight="800" font-size="${tam}" fill="${color}" ${o}>${t}</text>`;
const enX = (x0, y0, x) => VY + (y0 - VY) * (x - VX) / (x0 - VX);
const VERDE = "#3F7A4A", GRIS = "#8C969C", ROJO = "#B3261E";

// ------------------------------------------------------------------ la oficina en Navidad
function oficinaNavidad() {
  const yIzqT = enX(120, 430, X0), yIzqS = enX(120, 1040, X0), yDerT = enX(960, 430, X0 + ANCHO), yDerS = enX(960, 1040, X0 + ANCHO);
  const fugas = Array.from({ length: 15 }, (_, i) => { const xb = 120 + i * 60; return `<line x1="${xb}" y1="1040" x2="${(VX + (xb - VX) * 4.6).toFixed(0)}" y2="2300" stroke="#B9C1C7" stroke-width="3"/>`; }).join("");
  const horiz = [1068, 1110, 1172, 1262, 1390, 1580, 1860].map((y) => `<line x1="${X0}" y1="${y}" x2="${X0 + ANCHO}" y2="${y}" stroke="#B9C1C7" stroke-width="3"/>`).join("");
  // ciudad en invierno por los ventanales
  const edificio = (x, w, h, col) => `<rect x="${x}" y="${1000 - h}" width="${w}" height="${h}" fill="${col}"/>${Array.from({ length: Math.floor(h / 46) }, (_, r) => Array.from({ length: Math.floor(w / 34) }, (_, k) => `<rect x="${x + 10 + k * 34}" y="${1000 - h + 14 + r * 46}" width="16" height="22" fill="#F7E7A6" opacity="${(r + k) % 3 ? 0.9 : 0.35}"/>`).join("")).join("")}`;
  const lampara = (i, x, y) => `<g id="ol-l${i}" data-x="${x}" data-y="-400"><line x1="${x}" y1="-400" x2="${x}" y2="${y}" stroke="#5B6470" stroke-width="4"/>
    <rect x="${x - 110}" y="${y}" width="220" height="22" rx="10" fill="#E9EDF0"/><rect x="${x - 100}" y="${y + 20}" width="200" height="8" rx="4" fill="#FFF7D6"/></g>`;
  // mesas del fondo con ordenadores (en perspectiva, más pequeñas)
  const mesaFondo = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-150" y="-110" width="300" height="20" rx="6" fill="#B98A5E"/><rect x="-140" y="-90" width="14" height="90" fill="#9AA6AE"/><rect x="126" y="-90" width="14" height="90" fill="#9AA6AE"/>
    <rect x="-70" y="-210" width="140" height="94" rx="8" fill="${C.tinta}"/><rect x="-62" y="-202" width="124" height="74" rx="4" fill="#9ED0E6"/><rect x="-10" y="-118" width="20" height="10" fill="${C.tinta}"/><rect x="60" y="-140" width="26" height="30" rx="6" fill="#FFFDF8"/></g>`;
  // espumillón (guirnalda) a lo largo de la pared del fondo
  const espumillon = (y0, col) => `<path d="M120 ${y0} ${Array.from({ length: 6 }, (_, i) => `Q${190 + i * 140} ${y0 + 46} ${260 + i * 140} ${y0}`).join(" ")}" fill="none" stroke="${col}" stroke-width="14" stroke-linecap="round" stroke-dasharray="4 7"/>`;
  return `<rect x="${X0}" y="-400" width="${ANCHO}" height="2700" fill="#EEF1F3"/>
    <path d="M${X0} -400 H${X0 + ANCHO} V${yDerT} L960 430 H120 L${X0} ${yIzqT} Z" fill="#F7F8F9"/>
    ${lampara(0, 300, 200)}${lampara(1, 780, 200)}
    <!-- pared del fondo: ventanales con la ciudad, de noche y con luces -->
    <rect x="120" y="430" width="840" height="610" fill="#E2E7EA"/>
    <rect x="160" y="470" width="760" height="420" fill="#6F8FA8"/>${edificio(170, 150, 300, "#4E6578")}${edificio(340, 120, 380, "#5A7287")}${edificio(480, 170, 260, "#4A6175")}${edificio(670, 120, 340, "#56708A")}${edificio(800, 110, 230, "#4E6578")}
    ${Array.from({ length: 22 }, (_, k) => `<circle cx="${180 + (k * 71) % 730}" cy="${490 + (k * 37) % 260}" r="${3 + (k % 3)}" fill="#FFFFFF" opacity=".85"/>`).join("")}
    ${[160, 413, 666, 920].map((x) => `<rect x="${x - 8}" y="470" width="16" height="420" fill="#5B6470"/>`).join("")}<rect x="152" y="462" width="776" height="16" fill="#5B6470"/><rect x="152" y="884" width="776" height="16" fill="#5B6470"/>
    ${espumillon(452, "#D9A23B")}
    <!-- paredes laterales: corcho con la lista del décimo de la oficina y la máquina de café -->
    <path d="M${X0} ${yIzqT} L120 430 L120 1040 L${X0} ${yIzqS} Z" fill="#DDE3E8"/>
    <path d="M960 430 L${X0 + ANCHO} ${yDerT} L${X0 + ANCHO} ${yDerS} L960 1040 Z" fill="#D5DCE2"/>
    <path d="M-250 ${enX(120, 560, -250).toFixed(0)} L60 ${enX(120, 560, 60).toFixed(0)} L60 ${enX(120, 820, 60).toFixed(0)} L-250 ${enX(120, 820, -250).toFixed(0)} Z" fill="#C9A27A"/>
    <text transform="translate(-95 ${enX(120, 620, -95).toFixed(0)}) skewY(-31)" text-anchor="middle" font-family="Cap" font-weight="800" font-size="34" fill="#FFFFFF">DÉCIMO</text>
    ${[0, 1, 2, 3, 4].map((r) => `<line x1="-200" y1="${(enX(120, 680 + r * 26, -200)).toFixed(0)}" x2="20" y2="${(enX(120, 680 + r * 26, 20)).toFixed(0)}" stroke="#FFFDF8" stroke-width="10" stroke-linecap="round"/>`).join("")}
    <g transform="translate(1180 ${enX(960, 1000, 1180).toFixed(0)})"><rect x="-70" y="-260" width="140" height="260" rx="12" fill="#5B6470"/><rect x="-50" y="-235" width="100" height="70" rx="6" fill="#2E3A44"/><rect x="-30" y="-120" width="60" height="50" rx="6" fill="#2E3A44"/><rect x="-14" y="-96" width="28" height="30" rx="4" fill="#FFFDF8"/></g>
    <!-- suelo en perspectiva -->
    <path d="M${X0} ${yIzqS} L120 1040 H960 L${X0 + ANCHO} ${yDerS} V2300 H${X0} Z" fill="#D9DEE2"/>${fugas}${horiz}
    <!-- mesas del fondo y el arbolito con luces («ol-b<i>») -->
    ${mesaFondo(300, 1110, 0.55)}${mesaFondo(780, 1120, 0.6)}
    <g transform="translate(930 1150) scale(.42)"><rect x="-22" y="-60" width="44" height="60" fill="#8A6A48"/>${[[-560, 90], [-440, 140], [-310, 190], [-170, 240]].map(([y, w]) => `<path d="M0 ${y} L${w} ${y + 190} H${-w} Z" fill="#3F7A4A"/>`).join("")}
      <path d="M0 -610 l14 30 32 3 -24 21 8 31 -30 -16 -30 16 8 -31 -24 -21 32 -3 Z" fill="#F2C14E"/>
      ${Array.from({ length: 12 }, (_, i) => { const y = -470 + (i % 6) * 60, w = 70 + (i % 6) * 28, x = ((i * 37) % (2 * w)) - w; return `<circle id="ol-b${i}" cx="${x}" cy="${y + 40}" r="16" fill="${["#F2C14E", "#E07A3F", "#FFFDF8", "#7FB3D5"][i % 4]}"/>`; }).join("")}</g>
    ${paseante("ol-w0", "#7C9A7E", "#F2CBA8", 1)}${paseante("ol-w1", "#C9A0C2", "#E9BE98", 1)}`;
}
export const DECORADOS_T20 = { oficinaNavidad };

// ------------------------------------------------------------------ objetos
// Mesa de trabajo de delante (con su ordenador y una taza). Origen: el suelo, en el centro.
export const mesaTrabajo = (id) => `<g id="${id}"><rect x="-230" y="-250" width="460" height="24" rx="8" fill="#B98A5E"/><rect x="-215" y="-226" width="18" height="226" fill="#9AA6AE"/><rect x="197" y="-226" width="18" height="226" fill="#9AA6AE"/>
  <rect x="-110" y="-430" width="220" height="150" rx="10" fill="${C.tinta}"/><rect x="-98" y="-418" width="196" height="122" rx="6" fill="#9ED0E6"/>
  <path d="M-80 -320 L-40 -350 L0 -335 L40 -380 L80 -400" fill="none" stroke="${VERDE}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
  <rect x="-16" y="-282" width="32" height="34" fill="${C.tinta}"/><rect x="120" y="-292" width="46" height="44" rx="8" fill="#FFFDF8"/><path d="M166 -282 q18 4 0 22" fill="none" stroke="#FFFDF8" stroke-width="7"/></g>`;

// Décimo genérico (inventado: sin logotipos, sin escudo y sin precio). Origen: el centro. Mide 300 × 150.
export const decimo = (id, numero = "58213") => `<g id="${id}"><rect x="-150" y="-75" width="300" height="150" rx="10" fill="#F6EFD8" stroke="#C9A27A" stroke-width="4"/>
  <rect x="-138" y="-63" width="276" height="126" rx="6" fill="none" stroke="#3F7A4A" stroke-width="3" stroke-dasharray="10 6"/>
  <path d="M-108 -30 l6 12 13 2 -10 9 3 13 -12 -7 -12 7 3 -13 -10 -9 13 -2 Z" fill="#D9A23B"/>
  <circle cx="-118" cy="30" r="9" fill="${ROJO}"/><circle cx="-102" cy="36" r="9" fill="${ROJO}"/><path d="M-130 22 q14 -16 30 -4" fill="none" stroke="${VERDE}" stroke-width="6"/>
  ${txt(30, -26, "NAVIDAD", 26, "#3F7A4A")}${txt(30, 34, numero, 52, C.tinta, 'letter-spacing="4"')}</g>`;

// Diez décimos pequeños en dos filas («<id>-d<i>»); los siete primeros llevan una cruz («<id>-x<i>») que sale cuando no cobran.
export function diezDecimos(id) {
  return `<g id="${id}">${Array.from({ length: 10 }, (_, i) => { const x = -400 + (i % 5) * 200, y = -95 + Math.floor(i / 5) * 190;
    return `<g transform="translate(${x} ${y})"><g id="${id}-d${i}"><g transform="scale(.56)">${decimo(`${id}-dd${i}`, "")}</g>
      ${i < 7 ? `<g id="${id}-x${i}" opacity="0"><rect x="-84" y="-42" width="168" height="84" rx="6" fill="#FFFFFF" opacity=".55"/><path d="M-40 -32 L40 32 M40 -32 L-40 32" stroke="${ROJO}" stroke-width="14" stroke-linecap="round"/></g>`
        : `<g id="${id}-x${i}" opacity="0"><circle r="30" fill="${VERDE}"/><path d="M-14 0 l10 11 18 -20" fill="none" stroke="#FFFFFF" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/></g>`}</g></g>`; }).join("")}</g>`;
}

// Hucha y barritas del gasto del hogar en loterías y apuestas, de 2007 a 2025 («<id>-b<i>» crece cada una).
// gasto: {año: euros}. Solo se rotulan el primer y el último año (las cifras van en la tarjeta).
export function barritasGasto(id, gasto, rotulos = {}, o = {}) {
  const anyos = Object.keys(gasto).map(Number).sort(), max = Math.max(...Object.values(gasto)), W = o.W ?? 820, H = o.H ?? 330, paso = W / anyos.length;
  return `<g id="${id}"><rect x="${-W / 2 - 40}" y="${-H - 70}" width="${W + 80}" height="${H + 150}" rx="24" fill="#FFFDF8" opacity=".94"/>
    ${anyos.map((a, i) => { const h = gasto[a] / max * H, x = -W / 2 + i * paso + 6;
      return `<rect id="${id}-b${i}" x="${x.toFixed(1)}" y="${(-h).toFixed(1)}" width="${(paso - 12).toFixed(1)}" height="${h.toFixed(1)}" rx="5" fill="${i === anyos.length - 1 ? ROJO : "#C8902E"}" style="transform-box:fill-box;transform-origin:50% 100%"/>`; }).join("")}
    <line x1="${-W / 2}" y1="0" x2="${W / 2}" y2="0" stroke="${C.tinta}" stroke-width="4"/>
    ${txt(-W / 2 + paso / 2, 44, anyos[0], 30, C.tinta)}${txt(W / 2 - paso / 2, 44, anyos[anyos.length - 1], 30, C.tinta)}
    ${Object.entries(rotulos).map(([a, t]) => { const i = anyos.indexOf(Number(a)), h = gasto[a] / max * H; return txt(-W / 2 + i * paso + paso / 2, -h - 16, t, 34, i === anyos.length - 1 ? ROJO : C.tinta); }).join("")}</g>`;
}

// Gráfica de lo jugado (gris) frente a lo que valdría en bolsa (verde), año a año, con la última valoración.
// serie: {año: {jugado, en_bolsa}}; final: {etiqueta, jugado, en_bolsa}. Las líneas se dibujan con stroke-dashoffset
// («<id>-lj» y «<id>-lb», largo en data-largo); «<id>-bache» marca 2008; «<id>-fj» y «<id>-fb», las cifras finales.
export function graficaBolsa(id, serie, final, o = {}) {
  const anyos = Object.keys(serie).map(Number).sort(), W = o.W ?? 860, H = o.H ?? 560, top = Math.max(final.en_bolsa, ...anyos.map((a) => serie[a].en_bolsa)) * 1.08;
  const X = (i) => -W / 2 + i * (W / anyos.length), Y = (v) => -v / top * H;
  const pts = (k) => [...anyos.map((a, i) => [X(i), Y(serie[a][k])]), [X(anyos.length), Y(final[k])]];
  const largo = (p) => p.slice(1).reduce((s, q, i) => s + Math.hypot(q[0] - p[i][0], q[1] - p[i][1]), 0);
  const camino = (p) => "M" + p.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(" L");
  const pj = pts("jugado"), pb = pts("en_bolsa"), i08 = anyos.indexOf(2008);
  const marca = (a) => { const i = anyos.indexOf(a); return `<g id="${id}-m${a}" opacity="0"><line x1="${X(i).toFixed(1)}" y1="0" x2="${X(i).toFixed(1)}" y2="${-H}" stroke="${C.tinta}" stroke-width="3" stroke-dasharray="8 8"/>${txt(X(i), -H - 14, a, 30, C.tinta)}</g>`; };
  return `<g id="${id}"><rect x="${-W / 2 - 50}" y="${-H - 70}" width="${W + 160}" height="${H + 140}" rx="24" fill="#FFFDF8" opacity=".95"/>
    <line x1="${-W / 2}" y1="0" x2="${W / 2 + 30}" y2="0" stroke="${C.tinta}" stroke-width="4"/>
    ${[2007, 2016, 2025].map((a) => { const i = anyos.indexOf(a); return i < 0 ? "" : txt(X(i), 44, a, 30, C.tinta); }).join("")}
    ${(o.marcas ?? []).map(marca).join("")}
    <path id="${id}-lj" d="${camino(pj)}" fill="none" stroke="${GRIS}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" data-largo="${largo(pj).toFixed(0)}" stroke-dasharray="${largo(pj).toFixed(0)}"/>
    <path id="${id}-lb" d="${camino(pb)}" fill="none" stroke="${VERDE}" stroke-width="14" stroke-linecap="round" stroke-linejoin="round" data-largo="${largo(pb).toFixed(0)}" stroke-dasharray="${largo(pb).toFixed(0)}"/>
    <g id="${id}-bache" opacity="0"><circle cx="${X(i08).toFixed(1)}" cy="${Y(serie[2008].en_bolsa).toFixed(1)}" r="42" fill="none" stroke="${ROJO}" stroke-width="8"/>
      ${o.bache ? `<rect x="${(X(i08) + 40).toFixed(1)}" y="${(Y(serie[2008].en_bolsa) - 120).toFixed(1)}" width="230" height="58" rx="14" fill="${ROJO}"/>${txt(X(i08) + 155, Y(serie[2008].en_bolsa) - 79, o.bache, 34, "#FFFFFF")}` : ""}</g>
    <g id="${id}-fj" opacity="0">${txt(X(anyos.length) - 10, Y(final.jugado) - 26, final.jugado_txt, 40, "#5B6470", "", "end")}</g>
    <g id="${id}-fb" opacity="0">${txt(X(anyos.length) - 10, Y(final.en_bolsa) - 30, final.en_bolsa_txt, 52, VERDE, "", "end")}</g>
    <g transform="translate(${-W / 2 + 10} ${-H + 10})"><rect x="0" y="-26" width="28" height="12" rx="6" fill="${VERDE}"/>${txt(40, -12, "En bolsa", 28, VERDE, "", "start")}
      <rect x="0" y="14" width="28" height="12" rx="6" fill="${GRIS}"/>${txt(40, 28, "Jugado", 28, "#5B6470", "", "start")}</g></g>`;
}

// Montón de billetes (el premio soñado) con la porción de Hacienda («<id>-h»), que se separa y entra en el sobre («<id>-s»).
export function premioHacienda(id) {
  const billete = (x, y, r) => `<g transform="translate(${x} ${y}) rotate(${r})"><rect x="-90" y="-46" width="180" height="92" rx="8" fill="#9CC59A" stroke="#5E8F5C" stroke-width="4"/><circle r="24" fill="#7FB07D"/><rect x="-74" y="-32" width="148" height="64" rx="4" fill="none" stroke="#5E8F5C" stroke-width="3"/></g>`;
  return `<g id="${id}"><g id="${id}-m">${[[-120, 20, -8], [0, 0, 4], [120, 24, -3], [-60, -50, 10], [70, -60, -6], [0, -110, 2]].map(([x, y, r]) => billete(x, y, r)).join("")}</g>
    <g id="${id}-h">${billete(230, -30, 8)}${billete(250, 10, -6)}</g>
    <g id="${id}-s" transform="translate(420 40)"><rect x="-120" y="-80" width="240" height="160" rx="10" fill="#F4F1EA" stroke="#9AA6AE" stroke-width="5"/><path d="M-120 -80 L0 10 L120 -80" fill="none" stroke="#9AA6AE" stroke-width="5"/>${txt(0, 58, "HACIENDA", 32, C.tinta)}</g></g>`;
}
