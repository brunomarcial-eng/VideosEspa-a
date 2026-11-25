// Piezas de la casa para el estilo «limpio» (T3, padre contra hijo): cocina, iconos de gastos,
// foto antigua y foto de hoy con un bloque de pisos, billete, banco, ladrillo, tique y botones.
// Todo dibujado con código y sin marcas. Ningún dibujo lleva cifras salvo las que estén en la pantalla del guion.

import { C } from "./limpio.mjs";

const texto = (x, y, t, tam, color, o = "") => `<text x="${x}" y="${y}" text-anchor="middle" font-family="Cap" font-weight="800" font-size="${tam}" fill="${color}" ${o}>${t}</text>`;

// ------------------------------------------------------------------ cocina
// Pared, azulejos, muebles altos y bajos, nevera y ventana. El suelo empieza en y = 1300.
export function cocina(id) {
  const azulejos = Array.from({ length: 24 }, (_, i) => `<line x1="${-300 + i * 70}" x2="${-300 + i * 70}" y1="860" y2="1050" stroke="#D9CBB2" stroke-width="3"/>`).join("")
    + [895, 930, 965, 1000].map((y) => `<line x1="-300" x2="1400" y1="${y + 20}" y2="${y + 20}" stroke="#D9CBB2" stroke-width="3"/>`).join("");
  const altos = [0, 1, 2, 3].map((k) => `<rect x="${60 + k * 190}" y="560" width="176" height="230" rx="10" fill="#E9D8BE" stroke="#CDB894" stroke-width="5"/><rect x="${136 + k * 190}" y="760" width="24" height="10" rx="5" fill="#9AA6AE"/>`).join("");
  const bajos = [0, 1, 2, 3, 4].map((k) => `<rect x="${-20 + k * 210}" y="1080" width="196" height="220" rx="8" fill="#E2CFAE" stroke="#C6AE86" stroke-width="5"/><rect x="${70 + k * 210}" y="1100" width="24" height="10" rx="5" fill="#9AA6AE"/>`).join("");
  return `<g id="${id}"><rect x="-400" y="-400" width="1900" height="1720" fill="#F4EAD8"/>
    <rect x="-400" y="850" width="1900" height="210" fill="#EFE3CC"/>${azulejos}
    <g transform="translate(400 300)"><rect width="300" height="220" rx="10" fill="#FFFDF8"/><rect x="14" y="14" width="272" height="192" rx="6" fill="#B9D7E6"/>
      <line x1="150" y1="14" x2="150" y2="206" stroke="#FFFDF8" stroke-width="10"/></g>
    ${altos}
    <rect x="-40" y="1050" width="1160" height="34" rx="8" fill="#B98A5E"/>${bajos}
    <g transform="translate(905 640)"><rect width="200" height="660" rx="22" fill="#E6EBEE" stroke="#C9D1D6" stroke-width="5"/>
      <line x1="0" y1="230" x2="200" y2="230" stroke="#C9D1D6" stroke-width="5"/><rect x="18" y="120" width="12" height="80" rx="6" fill="#9AA6AE"/><rect x="18" y="260" width="12" height="110" rx="6" fill="#9AA6AE"/></g>
    <rect x="-400" y="1300" width="1900" height="1000" fill="#CDBBA0"/>
    ${Array.from({ length: 14 }, (_, i) => `<line x1="${-400 + i * 140}" y1="1300" x2="${-460 + i * 140}" y2="2300" stroke="#BEA98A" stroke-width="4"/>`).join("")}
  </g>`;
}

// ------------------------------------------------------------------ iconos de gastos (sin marcas)
export const ICONOS = {
  avion: `<circle r="62" fill="#FFFDF8" stroke="#E3D6BF" stroke-width="5"/><path d="M-40 6 L30 -26 L42 -20 L-2 6 L22 34 L12 36 L-12 14 L-34 20 Z" fill="${C.azul}"/>`,
  cana: `<circle r="62" fill="#FFFDF8" stroke="#E3D6BF" stroke-width="5"/><path d="M-22 -26 H22 L16 38 H-16 Z" fill="#E9B949"/><path d="M-26 -38 Q-14 -50 0 -40 Q14 -52 26 -38 L22 -24 H-22 Z" fill="#FFFFFF" stroke="#E3D6BF" stroke-width="3"/>`,
  tele: `<circle r="62" fill="#FFFDF8" stroke="#E3D6BF" stroke-width="5"/><rect x="-38" y="-28" width="76" height="50" rx="8" fill="${C.tinta}"/><path d="M-8 -14 L12 -3 L-8 8 Z" fill="#FFFDF8"/><rect x="-14" y="26" width="28" height="6" rx="3" fill="${C.tinta}"/>`,
  coche: `<circle r="62" fill="#FFFDF8" stroke="#E3D6BF" stroke-width="5"/><path d="M-40 14 Q-38 -6 -22 -8 L-12 -24 H14 L26 -8 Q40 -6 40 14 Z" fill="${C.tinta}"/><circle cx="-22" cy="16" r="9" fill="#5B6470"/><circle cx="22" cy="16" r="9" fill="#5B6470"/><rect x="-8" y="-20" width="16" height="10" rx="2" fill="#B9D7E6"/>`,
  plato: `<circle r="62" fill="#FFFDF8" stroke="#E3D6BF" stroke-width="5"/><circle r="34" fill="#F4EAD8" stroke="#D9CBB2" stroke-width="4"/><path d="M-46 -24 V24 M46 -24 V24" stroke="${C.gris}" stroke-width="6" stroke-linecap="round"/>`,
};
export function icono(id, nombre, s = 1) {
  return `<g id="${id}"><g transform="scale(${s})">${ICONOS[nombre]}</g></g>`;
}

// ------------------------------------------------------------------ fotos
// Bloque de pisos sencillo (coordenadas locales: 0..260 × 0..200, suelo en 200).
function bloque(antiguo) {
  const ladrillo = antiguo ? "#B98A5E" : "#E8E2D6", ventana = antiguo ? "#7D8C93" : "#9ED0E6";
  let v = "";
  for (let f = 0; f < 4; f++) for (let c = 0; c < 4; c++) v += `<rect x="${86 + c * 36}" y="${34 + f * 38}" width="22" height="24" rx="2" fill="${ventana}"/>`;
  const coche = antiguo
    ? `<g transform="translate(46 186)"><path d="M-36 0 V-16 L-26 -16 L-18 -30 H14 L22 -16 H36 V0 Z" fill="#C2A24E"/><circle cx="-20" cy="2" r="7" fill="${C.tinta}"/><circle cx="20" cy="2" r="7" fill="${C.tinta}"/></g>`
    : `<g transform="translate(46 186)"><path d="M-38 0 Q-38 -14 -26 -16 L-16 -30 H16 L28 -16 Q38 -14 38 0 Z" fill="#6F8FA6"/><circle cx="-20" cy="2" r="7" fill="${C.tinta}"/><circle cx="20" cy="2" r="7" fill="${C.tinta}"/></g>`;
  const arbol = antiguo ? "" : `<rect x="236" y="150" width="6" height="40" fill="#8A6A48"/><circle cx="239" cy="140" r="20" fill="#9CB89E"/>`;
  return `<rect width="260" height="200" fill="${antiguo ? "#E6D2AE" : "#CFE6F2"}"/><rect x="74" y="20" width="164" height="180" fill="${ladrillo}"/>${v}
    <rect x="140" y="170" width="30" height="30" fill="#6B4A32"/><rect y="194" width="260" height="10" fill="#9AA0A6"/>${coche}${arbol}`;
}
// Foto de esquinas blancas con el bloque y un pie («1986», «HOY»). Origen: centro de la foto.
export function foto(id, antiguo, pie) {
  const filtro = antiguo ? `filter="url(#${id}-sepia)"` : "";
  return `<g id="${id}"><defs><filter id="${id}-sepia"><feColorMatrix type="matrix" values=".39 .77 .19 0 0  .35 .69 .17 0 0  .27 .53 .13 0 0  0 0 0 1 0"/></filter></defs>
    <rect x="-142" y="-128" width="296" height="300" rx="8" fill="#3C2814" opacity=".14"/>
    <rect x="-150" y="-140" width="300" height="300" rx="8" fill="#FFFDF8"/>
    <g transform="translate(-130 -120)" ${filtro}>${bloque(antiguo)}</g>
    ${texto(0, 132, pie, 48, C.tinta)}</g>`;
}

// ------------------------------------------------------------------ dinero y ladrillo
export function billete(id) {
  return `<g id="${id}"><rect x="-70" y="-38" width="140" height="76" rx="8" fill="#9CB89E" stroke="#6F8F72" stroke-width="5"/><circle r="22" fill="#C9DCC9" stroke="#6F8F72" stroke-width="4"/>${texto(0, 12, "€", 32, "#4E6B51")}</g>`;
}
export function banco(id, etiqueta = "INTERESES") {
  return `<g id="${id}"><path d="M-110 -40 L0 -110 L110 -40 Z" fill="#8A9399"/><rect x="-100" y="-40" width="200" height="16" fill="#9AA6AE"/>
    ${[-70, -24, 24, 70].map((x) => `<rect x="${x - 12}" y="-22" width="24" height="96" fill="#C9CED3"/>`).join("")}<rect x="-110" y="74" width="220" height="20" fill="#8A9399"/>
    ${etiqueta ? texto(0, 140, etiqueta, 40, C.tinta) : ""}</g>`;
}
export function ladrillo(id) {
  return `<g id="${id}"><rect x="-150" y="-80" width="300" height="160" rx="10" fill="#B8613E"/><rect x="-150" y="-80" width="300" height="26" rx="10" fill="#C9744F"/>
    <circle cx="-70" cy="10" r="20" fill="#8E4529"/><circle cx="0" cy="10" r="20" fill="#8E4529"/><circle cx="70" cy="10" r="20" fill="#8E4529"/>
    ${texto(0, 150, "LADRILLO", 40, C.tinta)}</g>`;
}
// Tique de restaurante con el importe (la cifra está en la pantalla del guion).
export function tique(id, importe) {
  return `<g id="${id}"><path d="M-90 -130 H90 V120 L75 132 L60 120 L45 132 L30 120 L15 132 L0 120 L-15 132 L-30 120 L-45 132 L-60 120 L-75 132 L-90 120 Z" fill="#FFFDF8" stroke="#E3D6BF" stroke-width="4"/>
    ${texto(0, -86, "CENA", 34, C.tinta)}<rect x="-62" y="-60" width="124" height="8" rx="4" fill="#C9CED3"/><rect x="-62" y="-40" width="96" height="8" rx="4" fill="#C9CED3"/><rect x="-62" y="-20" width="110" height="8" rx="4" fill="#C9CED3"/>
    <line x1="-70" y1="10" x2="70" y2="10" stroke="${C.tinta}" stroke-width="3" stroke-dasharray="6 6"/>${texto(0, 76, importe, 64, C.tinta)}</g>`;
}
// Botón para votar en los comentarios.
export function boton(id, etiqueta, color) {
  return `<g id="${id}"><rect x="-130" y="-46" width="260" height="92" rx="46" fill="${color}"/><rect x="-130" y="-46" width="260" height="92" rx="46" fill="none" stroke="#FFFFFF" stroke-width="6" opacity=".6"/>
    ${texto(0, 16, etiqueta, 44, "#FFFDF8", 'letter-spacing="3"')}</g>`;
}
// Quesito pequeño con el porcentaje en el centro (el % lo pone la página en <id>-num).
export function quesito(id, cx, cy, r, w, color, pie) {
  const L = 2 * Math.PI * r;
  return `<g id="${id}"><circle cx="${cx}" cy="${cy}" r="${r + w / 2 + 8}" fill="#FFFDF8"/><circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#E6DFD2" stroke-width="${w}"/>
    <circle id="${id}-arco" cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${color}" stroke-width="${w}" stroke-dasharray="0 ${L.toFixed(1)}" transform="rotate(-90 ${cx} ${cy})"/>
    <text id="${id}-num" x="${cx}" y="${cy + 18}" text-anchor="middle" font-family="Cap" font-weight="800" font-size="50" fill="${color}"></text>
    ${texto(cx, cy + r + w / 2 + 56, pie, 40, C.tinta)}</g>`;
}

// ------------------------------------------------------------------ T4 (padre contra hijo, 2.ª parte)
// Más iconos de gastos, sin marcas: bolsa de reparto, pesa de gimnasio y nota de festival.
Object.assign(ICONOS, {
  reparto: `<circle r="62" fill="#FFFDF8" stroke="#E3D6BF" stroke-width="5"/><rect x="-32" y="-22" width="64" height="54" rx="6" fill="#E9B949"/><path d="M-14 -22 V-34 Q0 -46 14 -34 V-22" fill="none" stroke="${C.tinta}" stroke-width="6"/><rect x="-32" y="-4" width="64" height="8" fill="#C8902E"/>`,
  pesa: `<circle r="62" fill="#FFFDF8" stroke="#E3D6BF" stroke-width="5"/><rect x="-30" y="-5" width="60" height="10" rx="4" fill="${C.gris}"/><rect x="-44" y="-24" width="14" height="48" rx="5" fill="${C.tinta}"/><rect x="30" y="-24" width="14" height="48" rx="5" fill="${C.tinta}"/><rect x="-52" y="-14" width="8" height="28" rx="3" fill="${C.tinta}"/><rect x="44" y="-14" width="8" height="28" rx="3" fill="${C.tinta}"/>`,
  musica: `<circle r="62" fill="#FFFDF8" stroke="#E3D6BF" stroke-width="5"/><path d="M-10 22 V-30 L26 -38 V14" fill="none" stroke="${C.azul}" stroke-width="7" stroke-linejoin="round"/><ellipse cx="-20" cy="24" rx="13" ry="10" fill="${C.azul}"/><ellipse cx="16" cy="16" rx="13" ry="10" fill="${C.azul}"/>`,
});

// Casita (origen: centro del suelo de la casa). Con «color» se pinta entera; si no, solo el contorno.
export function casita(id, color, s = 1) {
  const relleno = color ?? "#FFFDF8", borde = color ?? "#C9BFAE";
  return `<g id="${id}"><g transform="scale(${s})"><path d="M-46 0 V-56 L0 -96 L46 -56 V0 Z" fill="${relleno}" stroke="${borde}" stroke-width="6" stroke-linejoin="round"/>
    <rect x="-11" y="-30" width="22" height="30" rx="3" fill="${color ? "#FFFDF8" : "#E6DFD2"}" opacity="${color ? 0.85 : 1}"/></g></g>`;
}
// Casa con dos figuritas dentro (dos sueldos).
export function casaDos(id) {
  const fig = (x, col) => `<circle cx="${x}" cy="-82" r="17" fill="#EDBE96"/><path d="M${x - 26} -6 V-40 Q${x - 26} -60 ${x} -60 Q${x + 26} -60 ${x + 26} -40 V-6 Z" fill="${col}"/>`;
  return `<g id="${id}"><path d="M-120 0 V-120 L0 -210 L120 -120 V0 Z" fill="#FFFDF8" stroke="#C9BFAE" stroke-width="8" stroke-linejoin="round"/>
    ${fig(-40, C.ocre)}${fig(40, C.azul)}<rect x="-130" y="-4" width="260" height="10" rx="5" fill="#C9BFAE"/></g>`;
}
// Barra de edad horizontal con su etiqueta (la barra crece desde x = 0; el ancho lo pone la página en <id>-b).
export function barraEdad(id, etiqueta, color, icono = "") {
  return `<g id="${id}"><g transform="translate(-20 0)">${icono}</g>
    <text x="0" y="-44" font-family="Cap" font-weight="800" font-size="36" fill="${C.tinta}">${etiqueta}</text>
    <rect x="0" y="-26" width="460" height="52" rx="26" fill="#E6DFD2"/><rect id="${id}-b" x="0" y="-26" width="0" height="52" rx="26" fill="${color}"/>
    <text id="${id}-n" x="0" y="16" font-family="Cap" font-weight="800" font-size="40" fill="#FFFDF8"></text></g>`;
}
// Bandera de la UE sencilla: azul con un círculo de doce estrellas (puntos).
export function banderaUE(alto = 40) {
  const w = alto * 1.5, r = alto * 0.33;
  const est = Array.from({ length: 12 }, (_, i) => `<circle cx="${(w / 2 + r * Math.cos(i * Math.PI / 6)).toFixed(1)}" cy="${(alto / 2 + r * Math.sin(i * Math.PI / 6)).toFixed(1)}" r="${(alto * 0.05).toFixed(1)}" fill="#FFCC00"/>`).join("");
  return `<g><rect width="${w}" height="${alto}" rx="4" fill="#003399"/>${est}</g>`;
}
// Bandera de España en SVG (franjas rojo-gualda-rojo, sin escudo).
export function banderaES(alto = 40) {
  const w = alto * 1.5;
  return `<g><rect width="${w}" height="${alto}" rx="4" fill="#AA151B"/><rect y="${alto / 4}" width="${w}" height="${alto / 2}" fill="#F1BF00"/></g>`;
}
// Regla de edades (de «desde» a «hasta») con una cuna que se desplaza. Origen: centro de la regla.
export function reglaEdad(id, desde, hasta, ancho) {
  const n = hasta - desde, paso = ancho / n;
  const marcas = Array.from({ length: n + 1 }, (_, i) => {
    const x = -ancho / 2 + i * paso, larga = (desde + i) % 5 === 0;
    return `<line x1="${x}" x2="${x}" y1="0" y2="${larga ? 34 : 18}" stroke="${C.tinta}" stroke-width="${larga ? 5 : 3}"/>${larga ? `<text x="${x}" y="76" text-anchor="middle" font-family="Cap" font-weight="800" font-size="34" fill="${C.gris}">${desde + i}</text>` : ""}`;
  }).join("");
  return `<g id="${id}"><rect x="${-ancho / 2 - 20}" y="-10" width="${ancho + 40}" height="110" rx="14" fill="#FFFDF8" stroke="#E3D6BF" stroke-width="4"/>${marcas}</g>`;
}
// Cuna con capota; con bebe = false, vacía.
export function cuna(id, color, bebe = true) {
  return `<g id="${id}"><path d="M-60 -20 H60 Q60 30 0 30 Q-60 30 -60 -20 Z" fill="${color}"/><path d="M-60 -20 Q-60 -70 -10 -70 V-20" fill="${color}" opacity=".7"/>
    ${bebe ? `<circle cx="20" cy="-34" r="16" fill="#F1C9A5"/>` : ""}<path d="M-30 30 L-40 48 M30 30 L40 48" stroke="${C.tinta}" stroke-width="6" stroke-linecap="round"/></g>`;
}
// Plato hondo con cocido (garbanzos) y vapor.
export function cocido(id) {
  const garb = [[-30, -12], [-10, -16], [12, -12], [30, -14], [-20, -4], [2, -6], [22, -4]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="9" fill="#E3B866"/>`).join("");
  return `<g id="${id}"><ellipse cx="0" cy="-8" rx="70" ry="16" fill="#C98A4B"/>${garb}<path d="M-80 -10 Q-76 40 0 42 Q76 40 80 -10 Z" fill="#FFFDF8" stroke="#D9CBB2" stroke-width="5"/>
    ${[0, 1, 2].map((k) => `<circle id="${id}-v${k}" cx="0" cy="-40" r="12" fill="#FFFFFF" opacity=".8"/>`).join("")}</g>`;
}
