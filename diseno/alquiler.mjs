// Decorados y objetos de T21 (el alquiler en horas de trabajo y quién alquila; Bruno, 24-11-2026):
//   · pisoAlquiler: el piso de alquiler recién estrenado, en perspectiva: paredes desnudas, bombilla sin lámpara que se
//     mece («pa-l0»), ventana a la calle, radiador y cajas de mudanza rotuladas a mano. Primer plano: «pa-fg».
//   · barrioBloques: calle de barrio a pleno día (cielo, nubes, ciudad al fondo, acera). Primer plano: «bb-fg».
// Objetos: el sobre del alquiler, una semana de curro que se tacha, columnas de horas, un bloque de pisos con veinte
// ventanas (llaves para los propietarios y carteles de «SE ALQUILA») y un móvil con mensajes.
// Los personajes pisan en y = 1440 (escena entera) o en y = 1700 (en las esquinas, con un objeto en medio).

import { C } from "./limpio.mjs";
import { maleta } from "./horas.mjs";

const X0 = -400, ANCHO = 1900, VX = 540, VY = 720;
const txt = (x, y, t, tam, color, o = "", ancla = "middle") => `<text x="${x}" y="${y}" text-anchor="${ancla}" font-family="Cap" font-weight="800" font-size="${tam}" fill="${color}" ${o}>${t}</text>`;
const enX = (x0, y0, x) => VY + (y0 - VY) * (x - VX) / (x0 - VX);   // altura en x de una línea que fuga desde (x0, y0)
const ROJO = "#B3261E", OCRE = "#C8902E", CARTON = "#C9A26B", CARTON2 = "#B98F58";

// Caja de mudanza con su cinta y un rótulo a rotulador. Origen: centro de la base.
export function cajaMudanza(id, w = 190, h = 150, rotulo = "", giro = 0) {
  return `<g id="${id}" transform="rotate(${giro})"><rect x="${-w / 2}" y="${-h}" width="${w}" height="${h}" rx="6" fill="${CARTON}"/>
    <rect x="${-w / 2}" y="${-h}" width="${w}" height="${h * 0.2}" fill="${CARTON2}"/><rect x="-14" y="${-h}" width="28" height="${h * 0.42}" fill="#E8D7B4" opacity=".9"/>
    <path d="M${-w / 2} ${-h} L${-w / 2 + 16} ${-h - 14} H${w / 2 - 16} L${w / 2} ${-h} Z" fill="#D8B47E"/>
    ${rotulo ? txt(0, -h * 0.36, rotulo, Math.min(32, w / 6), "#5B4636", `font-family="Cap" transform="rotate(-3 0 ${-h * 0.36})"`) : ""}</g>`;
}

// ------------------------------------------------------------------ el piso de alquiler
function pisoAlquiler() {
  const yIzqT = enX(140, 440, X0), yIzqS = enX(140, 1060, X0), yDerT = enX(940, 440, X0 + ANCHO), yDerS = enX(940, 1060, X0 + ANCHO);
  const tablas = Array.from({ length: 13 }, (_, i) => { const xb = 160 + i * 64; return `<line x1="${xb}" y1="1060" x2="${(VX + (xb - VX) * 4.2).toFixed(0)}" y2="2300" stroke="#BDB3A2" stroke-width="3" opacity=".7"/>`; }).join("");
  const juntas = [1100, 1170, 1270, 1420, 1650, 1990].map((y) => `<line x1="${X0}" y1="${y}" x2="${X0 + ANCHO}" y2="${y}" stroke="#BDB3A2" stroke-width="3" opacity=".5"/>`).join("");
  const edificio = (x, w, h, col) => `<rect x="${x}" y="${930 - h}" width="${w}" height="${h}" fill="${col}"/>${Array.from({ length: Math.floor(h / 70) }, (_, f) =>
    Array.from({ length: Math.floor(w / 50) }, (_, k) => `<rect x="${x + 14 + k * 50}" y="${930 - h + 18 + f * 70}" width="24" height="34" rx="3" fill="#FFFDF8" opacity=".75"/>`).join("")).join("")}`;
  const bombilla = `<g id="pa-l0" data-x="540" data-y="-400"><line x1="540" y1="-400" x2="540" y2="300" stroke="#3B3B3B" stroke-width="4"/>
    <rect x="528" y="296" width="24" height="22" rx="3" fill="#9AA6AE"/><circle cx="540" cy="340" r="26" fill="#FFF3C4"/><circle cx="540" cy="340" r="70" fill="#FFF7D6" opacity=".18"/></g>`;
  return `<rect x="${X0}" y="-400" width="${ANCHO}" height="2700" fill="#ECEDE8"/>
    <path d="M${X0} -400 H${X0 + ANCHO} V${yDerT} L940 440 H140 L${X0} ${yIzqT} Z" fill="#F7F7F3"/>
    <!-- pared del fondo con la ventana sin cortinas -->
    <rect x="140" y="440" width="800" height="620" fill="#E4E6E0"/>
    <g><clipPath id="pa-ventana"><rect x="330" y="520" width="420" height="400"/></clipPath>
      <g clip-path="url(#pa-ventana)"><rect x="330" y="520" width="420" height="400" fill="#BFE3F2"/>
        ${edificio(320, 150, 300, "#D9C7B0")}${edificio(480, 110, 340, "#C9B6A0")}${edificio(600, 170, 250, "#DCCDB8")}</g></g>
    <rect x="320" y="510" width="440" height="18" fill="#FFFDF8"/><rect x="320" y="912" width="440" height="20" fill="#FFFDF8"/>
    <rect x="320" y="510" width="18" height="422" fill="#FFFDF8"/><rect x="742" y="510" width="18" height="422" fill="#FFFDF8"/><rect x="531" y="510" width="18" height="422" fill="#FFFDF8"/>
    <!-- radiador -->
    <rect x="390" y="960" width="300" height="80" rx="10" fill="#F4F1EA" stroke="#D9DEE2" stroke-width="4"/>
    ${Array.from({ length: 7 }, (_, i) => `<line x1="${414 + i * 42}" y1="970" x2="${414 + i * 42}" y2="1030" stroke="#D9DEE2" stroke-width="7" stroke-linecap="round"/>`).join("")}
    <!-- paredes laterales: la de la derecha con la puerta -->
    <path d="M${X0} ${yIzqT} L140 440 L140 1060 L${X0} ${yIzqS} Z" fill="#DFE1DA"/>
    <path d="M940 440 L${X0 + ANCHO} ${yDerT} L${X0 + ANCHO} ${yDerS} L940 1060 Z" fill="#D8DAD2"/>
    <path d="M990 ${enX(940, 560, 990).toFixed(0)} L1130 ${enX(940, 560, 1130).toFixed(0)} L1130 ${enX(940, 1060, 1130).toFixed(0)} L990 ${enX(940, 1060, 990).toFixed(0)} Z" fill="#A97E56"/>
    <circle cx="1110" cy="${enX(940, 820, 1110).toFixed(0)}" r="8" fill="#E0B04A"/>
    <!-- enchufe y una marca de cuadro que ya no está -->
    <rect x="200" y="${enX(140, 1000, 200).toFixed(0)}" width="22" height="30" rx="4" fill="#FFFDF8" stroke="#C9CED3" stroke-width="3" transform="skewY(-27)"/>
    <rect x="-150" y="${enX(140, 600, -150).toFixed(0)}" width="150" height="120" fill="none" stroke="#C9CED3" stroke-width="4" stroke-dasharray="10 8" opacity=".7" transform="skewY(-27)"/>
    <!-- suelo laminado -->
    <path d="M${X0} ${yIzqS} L140 1060 H940 L${X0 + ANCHO} ${yDerS} V2300 H${X0} Z" fill="#D8CFBF"/>${tablas}${juntas}
    <!-- cajas de mudanza al fondo, a los lados -->
    <g transform="translate(200 1150)">${cajaMudanza("pa-k0", 200, 150, "COCINA")}<g transform="translate(10 -150)">${cajaMudanza("pa-k1", 170, 130, "LIBROS", -3)}</g></g>
    <g transform="translate(880 1170)">${cajaMudanza("pa-k2", 220, 160, "ROPA")}<g transform="translate(-20 -160)">${cajaMudanza("pa-k3", 150, 110, "", 4)}</g>
      <g transform="translate(-10 -276)"><rect x="-26" y="-56" width="52" height="56" rx="8" fill="#C77B5B"/>
        ${[[-26, -100], [0, -126], [26, -100]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="16" ry="36" fill="#5F9F4A" transform="rotate(${x} ${x} ${y})"/>`).join("")}</g></g>
    <!-- un colchón de pie contra la pared -->
    <g transform="translate(40 1090) skewY(-8)"><rect x="-70" y="-300" width="140" height="300" rx="26" fill="#F4F1EA" stroke="#D9DEE2" stroke-width="5"/>
      ${[-230, -160, -90].map((y) => `<line x1="-50" y1="${y}" x2="50" y2="${y}" stroke="#D9DEE2" stroke-width="4"/>`).join("")}</g>
    ${bombilla}
    <!-- primer plano: la esquina de una caja abierta -->
    <g id="pa-fg"><g transform="translate(-20 1980) rotate(-8)"><rect x="-160" y="-260" width="320" height="260" rx="8" fill="${CARTON}"/>
      <path d="M-160 -260 L-220 -330 L-60 -330 L0 -260 Z" fill="#D8B47E"/><path d="M160 -260 L200 -320 L60 -330 L0 -260 Z" fill="${CARTON2}"/></g></g>`;
}

// ------------------------------------------------------------------ la calle de los bloques
function barrioBloques() {
  const ciudad = [[-300, 240, 360], [-80, 180, 460], [100, 220, 330], [330, 160, 500], [500, 240, 380], [760, 200, 470], [960, 260, 350], [1220, 200, 420]]
    .map(([x, w, h], i) => `<rect x="${x}" y="${1060 - h}" width="${w}" height="${h}" fill="${["#D6DDE2", "#CCD5DB", "#DDE3E7"][i % 3]}"/>`).join("");
  return `<rect x="${X0}" y="-400" width="${ANCHO}" height="2700" fill="#CFE8F3"/>
    <circle cx="880" cy="230" r="70" fill="#FFE7A3"/>
    <ellipse cx="160" cy="300" rx="140" ry="38" fill="#FFFFFF" opacity=".85"/><ellipse cx="640" cy="190" rx="110" ry="30" fill="#FFFFFF" opacity=".75"/>
    ${ciudad}
    <rect x="${X0}" y="1060" width="${ANCHO}" height="40" fill="#C9CED3"/>
    <path d="M${X0} 1100 H${X0 + ANCHO} V2300 H${X0} Z" fill="#DCD6CB"/>
    ${Array.from({ length: 9 }, (_, i) => `<line x1="${X0 + i * 260}" y1="1100" x2="${X0 + i * 260 - 160}" y2="2300" stroke="#CBC4B7" stroke-width="4"/>`).join("")}
    ${[1240, 1460, 1760].map((y) => `<line x1="${X0}" y1="${y}" x2="${X0 + ANCHO}" y2="${y}" stroke="#CBC4B7" stroke-width="4"/>`).join("")}
    <!-- primer plano: un árbol de acera a la derecha -->
    <g id="bb-fg"><rect x="1010" y="1300" width="34" height="620" rx="12" fill="#8E6644"/>
      <circle cx="1030" cy="1260" r="150" fill="#6FA35A"/><circle cx="930" cy="1320" r="100" fill="#5F9F4A"/><circle cx="1120" cy="1350" r="110" fill="#5F9F4A"/></g>`;
}

export const DECORADOS_T21 = { pisoAlquiler, barrioBloques };

// ------------------------------------------------------------------ objetos
// El sobre del alquiler con billetes asomando («<id>-b0…»). Origen: centro.
export function sobre(id, rotulo = "ALQUILER", billetes = 3, s = 1) {
  const b = Array.from({ length: billetes }, (_, i) => `<g id="${id}-b${i}"><rect x="${-110 + i * 26}" y="${-120 - i * 10}" width="200" height="96" rx="8" fill="#9BC77A" stroke="#5F8F4A" stroke-width="4" transform="rotate(${-6 + i * 5} 0 -70)"/>
    <circle cx="${-10 + i * 26}" cy="${-72 - i * 10}" r="20" fill="none" stroke="#5F8F4A" stroke-width="4"/></g>`).join("");
  return `<g id="${id}"><g transform="scale(${s})">${b}<rect x="-170" y="-90" width="340" height="200" rx="14" fill="#FFFDF8" stroke="#D9DEE2" stroke-width="5"/>
    <path d="M-170 -90 L0 20 L170 -90" fill="none" stroke="#D9DEE2" stroke-width="5"/>${txt(0, 84, rotulo, 40, C.tinta)}</g></g>`;
}

// Una semana de curro de lunes a viernes; cada día se tacha con una cruz roja («<id>-x0…x4»). Origen: centro.
export function semana(id) {
  const dias = ["L", "M", "X", "J", "V"];
  return `<g id="${id}"><rect x="-330" y="-150" width="660" height="300" rx="22" fill="#FFFDF8" stroke="#D9DEE2" stroke-width="5"/>
    <rect x="-330" y="-150" width="660" height="70" rx="22" fill="${OCRE}"/><rect x="-330" y="-100" width="660" height="20" fill="${OCRE}"/>
    ${txt(0, -102, "UNA SEMANA DE CURRO", 34, "#FFFFFF")}
    ${dias.map((d, i) => { const x = -256 + i * 128; return `<g transform="translate(${x} 30)"><rect x="-54" y="-70" width="108" height="150" rx="12" fill="#F4F1EA"/>${txt(0, -24, d, 44, C.tinta)}
      <g id="${id}-x${i}" opacity="0"><path d="M-36 0 L36 64 M36 0 L-36 64" stroke="${ROJO}" stroke-width="14" stroke-linecap="round"/></g></g>`; }).join("")}</g>`;
}

// Columnas de horas de trabajo por año (barras «<id>-b0…», cifras «<id>-v0…», años debajo). Origen: centro de la base.
export function columnasHoras(id, horas, rotulos, o = {}) {
  const W = o.W ?? 820, H = o.H ?? 420, n = horas.length, paso = W / n, max = Math.max(...horas);
  return `<g id="${id}"><rect x="${-W / 2 - 40}" y="${-H - 120}" width="${W + 80}" height="${H + 210}" rx="24" fill="#FFFDF8" opacity=".95"/>
    ${horas.map((h, i) => { const alto = h / max * H, x = -W / 2 + i * paso + paso / 2, col = i === n - 1 ? ROJO : OCRE;
      return `<rect id="${id}-b${i}" x="${(x - paso * 0.32).toFixed(1)}" y="${(-alto).toFixed(1)}" width="${(paso * 0.64).toFixed(1)}" height="${alto.toFixed(1)}" rx="10" fill="${col}" style="transform-box:fill-box;transform-origin:50% 100%"/>
        <g id="${id}-v${i}">${txt(x, -alto - 22, o.fmt ? o.fmt(h) : `${Math.round(h)} h`, o.tam ?? 46, col)}</g>
        ${txt(x, 50, rotulos[i], 36, C.tinta)}`; }).join("")}
    <line x1="${-W / 2}" y1="0" x2="${W / 2}" y2="0" stroke="${C.tinta}" stroke-width="4"/></g>`;
}

// Bloque de pisos con 20 ventanas (5 plantas × 4): «llaves» ventanas con llave (propietarios, «<id>-k…») y
// «alquila» con cartel de SE ALQUILA («<id>-a…»); el resto, luz normal. El orden de las ventanas es fijo y mezclado.
const ORDEN = [5, 12, 0, 17, 9, 3, 14, 7, 19, 1, 10, 16, 6, 2, 13, 18, 8, 11, 4, 15];
export function bloque(id, rotulo, llaves, alquila, col = "#E3C9A6") {
  const ventana = (i) => {
    const f = Math.floor(i / 4), k = i % 4, x = -150 + k * 100, y = -640 + f * 116;
    const r = ORDEN.indexOf(i), tipo = r < llaves ? "k" : r < llaves + alquila ? "a" : "";
    const llave = `<g id="${id}-k${i}" opacity="0"><circle cx="0" cy="-14" r="14" fill="none" stroke="#C8902E" stroke-width="7"/><rect x="-4" y="-2" width="8" height="34" rx="3" fill="#C8902E"/><rect x="4" y="18" width="12" height="7" fill="#C8902E"/><rect x="4" y="6" width="9" height="7" fill="#C8902E"/></g>`;
    const cartel = `<g id="${id}-a${i}" opacity="0"><rect x="-38" y="-26" width="76" height="52" rx="6" fill="#FFFFFF" stroke="${ROJO}" stroke-width="5"/>
      ${txt(0, -4, "SE", 18, ROJO)}${txt(0, 18, "ALQUILA", 16, ROJO)}</g>`;
    return `<g transform="translate(${x} ${y})"><rect x="-40" y="-44" width="80" height="88" rx="6" fill="${tipo === "k" ? "#FFF3C4" : "#E9EDF0"}" id="${id}-w${i}"/>
      <rect x="-40" y="34" width="80" height="10" fill="#FFFDF8"/>${tipo === "k" ? llave : tipo === "a" ? cartel : ""}</g>`;
  };
  return `<g id="${id}"><rect x="-210" y="-720" width="420" height="720" rx="8" fill="${col}"/><rect x="-224" y="-736" width="448" height="30" rx="8" fill="#B98F58"/>
    ${Array.from({ length: 20 }, (_, i) => ventana(i)).join("")}
    <rect x="-44" y="-96" width="88" height="96" rx="6" fill="#8E6644"/><circle cx="26" cy="-46" r="6" fill="#E0B04A"/>
    <rect x="-130" y="10" width="260" height="70" rx="16" fill="${C.tinta}"/>${txt(0, 60, rotulo, 44, "#FFFFFF")}</g>`;
}
export const BLOQUE_ORDEN = ORDEN;

// Móvil con tres mensajes del grupo de amigos («<id>-m0…m2»). Origen: centro.
export function movil(id, mensajes = ["No llego a fin de mes", "Yo tampoco", "¿Y quién llega?"]) {
  return `<g id="${id}"><rect x="-150" y="-280" width="300" height="560" rx="40" fill="${C.tinta}"/><rect x="-132" y="-250" width="264" height="500" rx="24" fill="#EEF2F4"/>
    <rect x="-40" y="-268" width="80" height="12" rx="6" fill="#3B4A57"/>
    ${mensajes.map((m, i) => { const y = -170 + i * 130, der = i % 2 === 1;
      return `<g id="${id}-m${i}" opacity="0"><rect x="${der ? -60 : -116}" y="${y}" width="176" height="96" rx="20" fill="${der ? "#D8F0C8" : "#FFFFFF"}" stroke="#D9DEE2" stroke-width="3"/>
        <foreignObject x="${der ? -52 : -108}" y="${y + 8}" width="160" height="84"><div xmlns="http://www.w3.org/1999/xhtml" style="font:800 27px Cap;color:${C.tinta};line-height:1.12">${m}</div></foreignObject></g>`; }).join("")}</g>`;
}

// Dos caminos desde la casa de los padres (2007 y hoy): la maleta («<id>-m0», «<id>-m1») sale de la casa y llega a la
// edad media a la que los jóvenes se van (bandera «<id>-f0/f1» con su edad). La escala va de 25 a 32 años, sin números
// (solo las dos edades). En data-a y data-b, la x de salida y de llegada de cada maleta. Origen: centro.
export function caminosCasa(id, edades, rotulos, o = {}) {
  const W = o.W ?? 780, x0 = -W / 2 + 170, x1 = W / 2 - 50, desde = 25, hasta = 32;
  const X = (e) => x0 + (e - desde) / (hasta - desde) * (x1 - x0);
  const fila = (i) => { const y = i ? 150 : -90, xe = X(edades[i]), col = i ? ROJO : OCRE;
    return `<g transform="translate(0 ${y})">${txt(-W / 2 + 14, -132, rotulos[i], 38, col, "", "start")}
      <g transform="translate(${-W / 2 + 78} 0) scale(.72)"><rect x="-60" y="-110" width="120" height="110" rx="6" fill="#E3C9A6"/><path d="M-74 -110 L0 -170 L74 -110 Z" fill="#B3261E" opacity=".85"/>
        <rect x="-18" y="-64" width="36" height="64" rx="4" fill="#8E6644"/></g>
      <line x1="${x0 - 30}" y1="6" x2="${x1}" y2="6" stroke="#9AA6AE" stroke-width="8" stroke-dasharray="22 16" stroke-linecap="round"/>
      <g id="${id}-f${i}" opacity="0"><line x1="${xe.toFixed(1)}" y1="6" x2="${xe.toFixed(1)}" y2="-118" stroke="${col}" stroke-width="7"/>
        <path d="M${xe.toFixed(1)} -118 h70 l-14 22 l14 22 h-70 Z" fill="${col}"/>${txt(xe, -136, `${String(edades[i]).replace(".", ",")} años`, 40, col)}</g>
      <g id="${id}-m${i}" data-a="${x0}" data-b="${(xe - 46).toFixed(1)}" transform="translate(${x0} 0)"><g transform="scale(.36)">${maleta(`${id}-mm${i}`, i ? "#7C5C8E" : "#5F7F62")}</g></g></g>`; };
  return `<g id="${id}"><rect x="${-W / 2 - 30}" y="-300" width="${W + 60}" height="520" rx="24" fill="#FFFDF8" opacity=".95"/>${fila(0)}${fila(1)}</g>`;
}
