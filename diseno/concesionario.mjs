// Decorado y objetos del concesionario (T16, «¿Cuántos meses trabajas para pagar tu coche?», Bruno 22-11-2026):
// exposición con ventanales por los que pasan las estaciones, coches sin marca a distintas profundidades, suelo brillante
// en perspectiva y la mesa del vendedor. Capas para ambientes() de sueno.mjs: el suelo de delante empieza en y = 1300 y los
// personajes pisan en y = 1440.

import { C, paseante } from "./limpio.mjs";
import { coche } from "./transporte.mjs";

const X0 = -400, ANCHO = 1900, VX = 540, VY = 700;
const txt = (x, y, t, tam, color, o = "") => `<text x="${x}" y="${y}" text-anchor="middle" font-family="Cap" font-weight="800" font-size="${tam}" fill="${color}" ${o}>${t}</text>`;
const enX = (x0, y0, x) => VY + (y0 - VY) * (x - VX) / (x0 - VX);   // altura en x de una línea que fuga desde (x0, y0)

// Todoterreno (variante alta del coche de transporte.mjs). Origen: el suelo, en el centro.
export const todoterreno = (id, col) => `<g id="${id}"><g transform="scale(1.08 1.22)">${coche(id + "-c", col)}</g><rect x="-200" y="-322" width="400" height="14" rx="6" fill="#3A4A58" opacity=".7"/></g>`;

// Exterior que se ve por los ventanales, en cuatro estaciones («<id>-e0» verano … «<id>-e3» primavera), para fundirlas.
export function estaciones(id) {
  const arbol = (x, copa, tronco = "#7A5638", extra = "") => `<rect x="${x - 12}" y="900" width="24" height="130" fill="${tronco}"/>${copa ? `<circle cx="${x}" cy="880" r="80" fill="${copa}"/><circle cx="${x - 50}" cy="910" r="55" fill="${copa}"/><circle cx="${x + 52}" cy="905" r="58" fill="${copa}"/>` : `<path d="M${x} 900 l-50 -70 M${x} 880 l45 -80 M${x} 930 l-60 -30" stroke="${tronco}" stroke-width="10" stroke-linecap="round"/>`}${extra}`;
  const capa = (n, cielo, suelo, cosas) => `<g id="${id}-e${n}" opacity="${n ? 0 : 1}"><rect x="120" y="470" width="840" height="570" fill="${cielo}"/>
    <rect x="120" y="960" width="840" height="80" fill="${suelo}"/>${cosas}</g>`;
  return `<g id="${id}">
    ${capa(0, "#9FD3F0", "#9BC77A", `<circle cx="820" cy="580" r="54" fill="#FFD95A"/>${arbol(300, "#5F9F4A")}${arbol(700, "#6BAA52")}`)}
    ${capa(1, "#C9D9E2", "#C9A15B", `${arbol(300, "#E07A3F")}${arbol(700, "#D9A23B")}${Array.from({ length: 10 }, (_, k) => `<ellipse id="${id}-h${k}" cx="0" cy="0" rx="9" ry="5" fill="${k % 2 ? "#E07A3F" : "#D9A23B"}"/>`).join("")}`)}
    ${capa(2, "#B8C3CC", "#F4F6F8", `${arbol(300, null, "#6E5444")}${arbol(700, null, "#6E5444")}<path d="M120 960 Q300 930 540 955 Q760 930 960 960 V1040 H120 Z" fill="#FFFFFF"/>
      ${Array.from({ length: 16 }, (_, k) => `<circle id="${id}-n${k}" r="${5 + (k % 3) * 2}" fill="#FFFFFF"/>`).join("")}`)}
    ${capa(3, "#BFE6F7", "#A9D47F", `${arbol(300, "#F4B6C8")}${arbol(700, "#F7C9D6")}${[200, 420, 560, 860].map((x) => `<circle cx="${x}" cy="985" r="10" fill="#F2CC4C"/><circle cx="${x + 30}" cy="995" r="9" fill="#E77FA5"/>`).join("")}`)}
  </g>`;
}
// Marcos de los ventanales (encima del exterior).
export const MARCOS = `${[120, 330, 540, 750, 960].map((x) => `<rect x="${x - 9}" y="470" width="18" height="570" fill="#5B6470"/>`).join("")}<rect x="111" y="462" width="858" height="18" fill="#5B6470"/><rect x="111" y="1032" width="858" height="16" fill="#5B6470"/>`;

function concesionario() {
  const yIzqT = enX(120, 470, X0), yIzqS = enX(120, 1040, X0), yDerT = enX(960, 470, X0 + ANCHO), yDerS = enX(960, 1040, X0 + ANCHO);
  const fugas = Array.from({ length: 15 }, (_, i) => { const xb = 120 + i * 60; return `<line x1="${xb}" y1="1040" x2="${(VX + (xb - VX) * 4.6).toFixed(0)}" y2="2300" stroke="#C9CED3" stroke-width="3"/>`; }).join("");
  const horiz = [1068, 1110, 1172, 1262, 1390, 1580, 1860].map((y) => `<line x1="${X0}" y1="${y}" x2="${X0 + ANCHO}" y2="${y}" stroke="#C9CED3" stroke-width="3"/>`).join("");
  const foco = (x, y, s) => `<circle cx="${x}" cy="${y}" r="${16 * s}" fill="#FFF7D6"/><circle cx="${x}" cy="${y + 40 * s}" r="${90 * s}" fill="#FFF7D6" opacity=".12"/>`;
  const reflejo = (x, y, s, col) => `<ellipse cx="${x}" cy="${y + 16 * s}" rx="${220 * s}" ry="${26 * s}" fill="${col}" opacity=".18"/>`;
  return `<rect x="${X0}" y="-400" width="${ANCHO}" height="2700" fill="#EEF1F3"/>
    <!-- techo con focos -->
    <path d="M${X0} -400 H${X0 + ANCHO} V${yDerT} L960 470 H120 L${X0} ${yIzqT} Z" fill="#F7F8F9"/>
    ${foco(330, 400, 0.8)}${foco(750, 400, 0.8)}${foco(-100, 250, 1.2)}${foco(1180, 250, 1.2)}
    <!-- pared del fondo: ventanales (el exterior de verano; las estaciones van encima en la escena) -->
    <rect x="120" y="470" width="840" height="570" fill="#9FD3F0"/><rect x="120" y="960" width="840" height="80" fill="#9BC77A"/>
    <circle cx="820" cy="580" r="54" fill="#FFD95A"/>
    ${MARCOS}
    <!-- paredes laterales con carteles -->
    <path d="M${X0} ${yIzqT} L120 470 L120 1040 L${X0} ${yIzqS} Z" fill="#DDE3E8"/>
    <path d="M960 470 L${X0 + ANCHO} ${yDerT} L${X0 + ANCHO} ${yDerS} L960 1040 Z" fill="#D5DCE2"/>
    <path d="M-330 ${enX(120, 560, -330).toFixed(0)} L60 ${enX(120, 560, 60).toFixed(0)} L60 ${enX(120, 700, 60).toFixed(0)} L-330 ${enX(120, 700, -330).toFixed(0)} Z" fill="#3F6B5A"/>
    <text transform="translate(-140 ${enX(120, 640, -140).toFixed(0)}) skewY(-31)" text-anchor="middle" font-family="Cap" font-weight="800" font-size="44" fill="#FFFFFF">EXPOSICIÓN</text>
    <path d="M1020 ${enX(960, 560, 1020).toFixed(0)} L1420 ${enX(960, 560, 1420).toFixed(0)} L1420 ${enX(960, 700, 1420).toFixed(0)} L1020 ${enX(960, 700, 1020).toFixed(0)} Z" fill="#C8902E"/>
    <text transform="translate(1220 ${enX(960, 640, 1220).toFixed(0)}) skewY(31)" text-anchor="middle" font-family="Cap" font-weight="800" font-size="44" fill="#FFFFFF">FINANCIACIÓN</text>
    <!-- suelo brillante en perspectiva -->
    <path d="M${X0} ${yIzqS} L120 1040 H960 L${X0 + ANCHO} ${yDerS} V2300 H${X0} Z" fill="#E3E7EA"/>${fugas}${horiz}
    <!-- coches expuestos a distintas profundidades -->
    ${reflejo(300, 1110, 0.5, "#3E8E8A")}<g transform="translate(300 1110) scale(.5)">${coche("cc-a", "#3E8E8A")}</g>
    ${reflejo(780, 1120, 0.55, "#5B6470")}<g transform="translate(780 1120) scale(.55)">${todoterreno("cc-b", "#9AA6AE")}</g>
    ${reflejo(540, 1300, 0.95, "#C77B5B")}<g transform="translate(540 1300) scale(.95)">${coche("cc-c", "#C77B5B")}</g>
    <!-- mesa del vendedor, a la derecha -->
    <g transform="translate(1180 1330)"><rect x="-170" y="-150" width="340" height="18" rx="6" fill="#5B6470"/><rect x="-150" y="-132" width="14" height="132" fill="#8C969C"/><rect x="136" y="-132" width="14" height="132" fill="#8C969C"/>
      <rect x="-60" y="-260" width="120" height="90" rx="8" fill="${C.tinta}"/><rect x="-50" y="-252" width="100" height="70" rx="4" fill="#9FD3F0"/><rect x="-10" y="-170" width="20" height="20" fill="#5B6470"/></g>
    <!-- clientes mirando coches al fondo -->
    ${paseante("cc-w0", "#7C9A7E", "#F2CBA8", 1)}${paseante("cc-w1", "#C9A0C2", "#E9BE98", 1)}`;
}
export const DECORADOS_T16 = { concesionario };

// Calendario de pared: «<id>-m» es el nombre del mes (texto) y «<id>-h» la hoja que se arranca.
export function calendario(id) {
  return `<g id="${id}"><rect x="-150" y="-170" width="300" height="320" rx="18" fill="#FFFFFF" stroke="#C9CED3" stroke-width="5"/>
    <rect x="-150" y="-170" width="300" height="80" rx="18" fill="#B3261E"/><rect x="-150" y="-110" width="300" height="20" fill="#B3261E"/>
    ${[-90, -30, 30, 90].map((x) => `<rect x="${x - 7}" y="-190" width="14" height="40" rx="7" fill="#5B6470"/>`).join("")}
    <text id="${id}-m" x="0" y="-115" text-anchor="middle" font-family="Cap" font-weight="800" font-size="38" fill="#FFFFFF">ENERO</text>
    ${Array.from({ length: 5 }, (_, r) => Array.from({ length: 7 }, (_, k) => `<rect x="${-128 + k * 37}" y="${-70 + r * 42}" width="28" height="28" rx="5" fill="#EEF0F2"/>`).join("")).join("")}
    <g id="${id}-h"><path d="M-150 -90 H150 V150 H-150 Z" fill="#FFFFFF" opacity="0"/></g></g>`;
}
// Hoja de calendario arrancada (cae al suelo). Origen: el centro.
export const hoja = (id) => `<g id="${id}"><rect x="-70" y="-75" width="140" height="150" rx="8" fill="#FFFFFF" stroke="#C9CED3" stroke-width="4"/><rect x="-70" y="-75" width="140" height="34" rx="8" fill="#B3261E"/></g>`;
// Traje del vendedor (persona({encima})): camisa blanca y corbata verde (nada de rojo y azul juntos).
export const TRAJE = `<path d="M-34 -378 L0 -286 L34 -378 Z" fill="#FFFFFF"/><path d="M-10 -360 L0 -290 L10 -360 L0 -372 Z" fill="#3F6B5A"/>
  <path d="M-34 -378 L-6 -300 L-40 -250 Z M34 -378 L6 -300 L40 -250 Z" fill="#4A5562" opacity=".6"/><rect x="34" y="-300" width="30" height="8" rx="3" fill="#FFFFFF" opacity=".8"/>`;
// Llaves del coche (en la mano).
export const LLAVES = `<g transform="translate(6 -30)"><circle r="14" fill="none" stroke="#C9CED3" stroke-width="5"/><rect x="-10" y="10" width="20" height="34" rx="6" fill="${C.tinta}"/><rect x="-4" y="44" width="8" height="26" fill="#C9CED3"/></g>`;
// Bicicleta (para la sorna de la clienta). Origen: el suelo, en el centro.
export const bici = (id) => `<g id="${id}"><circle cx="-70" cy="-60" r="58" fill="none" stroke="${C.tinta}" stroke-width="10"/><circle cx="70" cy="-60" r="58" fill="none" stroke="${C.tinta}" stroke-width="10"/>
  <path d="M-70 -60 L-20 -140 L50 -140 L70 -60 M-20 -140 L0 -60 L50 -140 M-30 -160 H0 M50 -140 L40 -175 H70" fill="none" stroke="#3E8E8A" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/></g>`;
