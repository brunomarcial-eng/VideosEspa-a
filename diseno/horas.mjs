// Objetos de T9 («¿Cuántas horas te cuesta vivir?»): todo se mide en horas, días o años de trabajo.
// Dibujados con código, sin marcas y sin cifras fijas (las pone la escena). Origen de cada objeto: su centro, salvo que se diga.

import { C } from "./limpio.mjs";

const txt = (x, y, t, tam, color, o = "") => `<text x="${x}" y="${y}" text-anchor="middle" font-family="Cap" font-weight="800" font-size="${tam}" fill="${color}" ${o}>${t}</text>`;

// Calendario de pared con anillas: mes arriba (texto «-mes»), día grande (texto «-dia») y una hoja suelta («-hoja», con su «-hoja-t»)
// que la escena hace volar para pasar los días.
export function calendario(id) {
  const hoja = (h, extra = "") => `<rect x="-150" y="-110" width="300" height="250" rx="16" fill="#FFFDF8" stroke="#E3D6BF" stroke-width="5"/>
    <text id="${h}-t" x="0" y="80" text-anchor="middle" font-family="Cap" font-weight="800" font-size="150" fill="${C.tinta}">1</text>${extra}`;
  return `<g id="${id}"><rect x="-162" y="-196" width="324" height="352" rx="24" fill="#3C2814" opacity=".14" transform="translate(10 14)"/>
    <rect x="-162" y="-196" width="324" height="352" rx="24" fill="#FFFDF8"/>
    <rect x="-162" y="-196" width="324" height="96" rx="24" fill="${C.rojo}"/><rect x="-162" y="-120" width="324" height="20" fill="${C.rojo}"/>
    <text id="${id}-mes" x="0" y="-132" text-anchor="middle" font-family="Cap" font-weight="800" font-size="44" letter-spacing="4" fill="#FFFDF8">ENERO</text>
    ${[-90, -30, 30, 90].map((x) => `<rect x="${x - 7}" y="-214" width="14" height="40" rx="7" fill="${C.gris}"/>`).join("")}
    <g transform="translate(0 6)">${hoja(id + "-fijo")}</g>
    <text id="${id}-dia" x="0" y="86" text-anchor="middle" font-family="Cap" font-weight="800" font-size="150" fill="${C.tinta}">1</text>
    <g id="${id}-hoja"><g transform="translate(0 6)">${hoja(id + "-hoja")}</g></g></g>`;
}

// Reloj pequeño de «una hora de trabajo»: la cuña «-w» se rellena con cuna(id + "-w", fracción, r * 0.84).
export function relojHora(id, r = 34, color = C.azul) {
  return `<g id="${id}"><circle r="${r}" fill="#FFFDF8" stroke="${C.tinta}" stroke-width="${r * 0.12}"/>
    <path id="${id}-w" d="M0 0 Z" fill="${color}" opacity=".9"/><circle r="${r * 0.12}" fill="${C.tinta}"/>
    <line x1="0" y1="0" x2="0" y2="${-r * 0.62}" stroke="${C.tinta}" stroke-width="${r * 0.1}" stroke-linecap="round"/></g>`;
}
// Fila de n relojes (ids «<id>-0», «<id>-1»…). Origen: centro del primero.
export function filaRelojes(id, n, r = 34, paso = 80, color = C.azul) {
  return `<g id="${id}">${Array.from({ length: n }, (_, k) => `<g transform="translate(${k * paso} 0)">${relojHora(`${id}-${k}`, r, color)}</g>`).join("")}</g>`;
}

// Calendario pequeño: «un año de sueldo» (filas de años para el piso). Origen: abajo a la izquierda (para estirarlo en x).
export function anyoIcono(id, color = C.azul) {
  return `<g id="${id}"><rect x="0" y="-64" width="56" height="64" rx="8" fill="#FFFDF8" stroke="${color}" stroke-width="5"/>
    <rect x="0" y="-64" width="56" height="18" rx="6" fill="${color}"/>
    ${[0, 1, 2].map((f) => [0, 1, 2].map((c) => `<rect x="${9 + c * 14}" y="${-38 + f * 11}" width="9" height="7" rx="2" fill="${C.grisClaro}"/>`).join("")).join("")}</g>`;
}

// Bombilla de techo con su halo («-halo») y el filamento («-fil»). Origen: el casquillo.
export function bombilla(id) {
  return `<g id="${id}"><line x1="0" y1="-420" x2="0" y2="-40" stroke="${C.tinta}" stroke-width="6"/>
    <circle id="${id}-halo" cx="0" cy="70" r="190" fill="#FFE9A3" opacity="0"/>
    <rect x="-34" y="-40" width="68" height="50" rx="10" fill="#9AA6AE"/><rect x="-34" y="-22" width="68" height="8" fill="#7C8790"/>
    <path d="M-34 10 Q-96 60 -86 120 Q-74 190 0 196 Q74 190 86 120 Q96 60 34 10 Z" fill="#FFF6D6" stroke="#E3C26A" stroke-width="6"/>
    <path id="${id}-fil" d="M-22 40 Q-14 110 -6 70 Q0 130 6 70 Q14 110 22 40" fill="none" stroke="#E2A43A" stroke-width="7" stroke-linecap="round"/>
    <path d="M-50 70 Q-50 40 -26 30" fill="none" stroke="#FFFFFF" stroke-width="10" stroke-linecap="round" opacity=".7"/></g>`;
}

// Contador de la luz con su disco que gira («-disco»). Origen: centro.
export function contadorLuz(id) {
  return `<g id="${id}"><rect x="-110" y="-150" width="220" height="300" rx="22" fill="#E9E4DA" stroke="#BFB7A8" stroke-width="6"/>
    <rect x="-80" y="-120" width="160" height="70" rx="10" fill="#1F2A37"/>
    ${[0, 1, 2, 3].map((k) => `<rect x="${-68 + k * 36}" y="-108" width="28" height="46" rx="4" fill="#FFFDF8"/>`).join("")}
    <ellipse cx="0" cy="40" rx="78" ry="22" fill="#C9CED3"/><g id="${id}-disco"><rect x="-6" y="22" width="12" height="36" rx="4" fill="${C.rojo}"/></g>
    ${txt(0, 118, "kWh", 30, C.gris)}</g>`;
}

// Botón redondo con rótulo (PADRES / HIJOS).
export function boton(id, et, color, w) {
  return `<g id="${id}"><rect x="${-w / 2}" y="-48" width="${w}" height="96" rx="48" fill="${color}"/><rect x="${-w / 2}" y="-48" width="${w}" height="96" rx="48" fill="none" stroke="#FFFFFF" stroke-width="6" opacity=".6"/>
    ${txt(0, 16, et, 42, "#FFFDF8")}</g>`;
}

// Periódico doblado (en la mano del padre).
export const PERIODICO = `<g transform="translate(10 -40) rotate(-8)"><rect x="-60" y="-80" width="120" height="150" rx="6" fill="#F4F1EA" stroke="#C9C2B3" stroke-width="4"/>
  <rect x="-46" y="-64" width="92" height="16" rx="4" fill="${C.tinta}"/>${[0, 1, 2, 3, 4].map((k) => `<rect x="-46" y="${-36 + k * 18}" width="${k % 2 ? 70 : 92}" height="8" rx="4" fill="#C9CED3"/>`).join("")}</g>`;
// Llaves de casa (en la mano).
export const LLAVES = `<g transform="translate(6 -10) rotate(20)"><circle r="20" fill="none" stroke="#C8902E" stroke-width="8"/>
  <rect x="-6" y="16" width="12" height="70" rx="5" fill="#C8902E"/><rect x="6" y="60" width="18" height="10" rx="3" fill="#C8902E"/><rect x="6" y="74" width="12" height="10" rx="3" fill="#C8902E"/></g>`;

// Maleta de viaje con ruedas y asa extensible (la arrastra quien vuelve). Origen: el suelo, en el centro.
export function maleta(id, color = "#5F7F62") {
  return `<g id="${id}"><ellipse cx="0" cy="4" rx="80" ry="12" fill="#3C2814" opacity=".18"/>
    <rect x="-28" y="-290" width="10" height="90" rx="4" fill="#7C8790"/><rect x="18" y="-290" width="10" height="90" rx="4" fill="#7C8790"/><rect x="-34" y="-300" width="68" height="16" rx="8" fill="${C.tinta}"/>
    <rect x="-74" y="-210" width="148" height="190" rx="22" fill="${color}"/><rect x="-74" y="-210" width="148" height="190" rx="22" fill="none" stroke="#14141E" stroke-opacity=".12" stroke-width="5"/>
    ${[-36, 0, 36].map((x) => `<rect x="${x - 4}" y="-196" width="8" height="162" rx="4" fill="#14141E" opacity=".12"/>`).join("")}
    <rect x="-58" y="-200" width="40" height="160" rx="16" fill="#FFFFFF" opacity=".14"/>
    <circle cx="-48" cy="-10" r="12" fill="${C.tinta}"/><circle cx="48" cy="-10" r="12" fill="${C.tinta}"/></g>`;
}
