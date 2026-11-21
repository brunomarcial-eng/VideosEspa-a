// Decorados y objetos del transporte (T13, Bruno 21-11-2026: viajeros de avión y de tren, pilotos, azafatas, maquinistas,
// carreteras, peajes y conductores; entornos descriptivos y muy del tema). Todo dibujado con código, sin marcas, logotipos
// ni nombres de compañías reales. Capas para ambientes() de sueno.mjs: el suelo empieza en y = 1300 y los personajes pisan en y = 1440.

import { C } from "./limpio.mjs";

const X0 = -400, ANCHO = 1900;
const txt = (x, y, t, tam, color, o = "") => `<text x="${x}" y="${y}" text-anchor="middle" font-family="Cap" font-weight="800" font-size="${tam}" fill="${color}" ${o}>${t}</text>`;
const AMBAR = "#E9A23B", VERDE_T = "#5FA37A";
const suelo = (col, raya, y = 1300) => `<rect x="${X0}" y="${y}" width="${ANCHO}" height="${2300 - y}" fill="${col}"/>
  ${Array.from({ length: 16 }, (_, i) => `<line x1="${X0 + i * 130}" y1="${y}" x2="${X0 - 90 + i * 130}" y2="2300" stroke="${raya}" stroke-width="4"/>`).join("")}
  ${[1420, 1600, 1840].map((yy) => `<line x1="${X0}" y1="${yy}" x2="${X0 + ANCHO}" y2="${yy}" stroke="${raya}" stroke-width="3" opacity=".7"/>`).join("")}`;

// Avión de pasajeros visto de lado (blanco, con una franja verde azulada; sin marca). Origen: el centro del fuselaje.
export function avionLado(s = 1, o = "") {
  return `<g transform="scale(${s})" ${o}><path d="M-360 -10 Q-360 -60 -300 -62 H260 Q340 -60 380 -10 Q340 40 260 42 H-300 Q-360 40 -360 -10 Z" fill="#FFFFFF" stroke="#C9CED3" stroke-width="4"/>
    <path d="M-330 14 H330 Q320 30 260 32 H-300 Q-326 30 -330 14 Z" fill="#3E8E8A"/>
    <path d="M-300 -62 L-360 -170 H-300 L-200 -62 Z" fill="#3E8E8A"/><path d="M-40 10 L-160 120 H-100 L60 10 Z" fill="#DCE3E8" stroke="#C9CED3" stroke-width="3"/>
    ${Array.from({ length: 14 }, (_, i) => `<rect x="${-230 + i * 34}" y="-38" width="16" height="20" rx="7" fill="#5B6E7A"/>`).join("")}
    <path d="M320 -44 Q350 -40 366 -20 H316 Z" fill="#5B6E7A"/><rect x="-260" y="-40" width="26" height="60" rx="6" fill="none" stroke="#C9CED3" stroke-width="4"/>
    <ellipse cx="-40" cy="46" rx="56" ry="20" fill="#C9CED3"/></g>`;
}

// ------------------------------------------------------------------ terminal del aeropuerto: ventanal a la pista, panel de salidas y asientos
function terminal() {
  const fila = (y, destino, estado, col) => `<g transform="translate(0 ${y})"><rect x="-230" y="-26" width="460" height="44" rx="6" fill="#26323F"/>
    ${txt(-120, 6, destino, 24, "#F4F1EA")}<rect x="40" y="-18" width="176" height="30" rx="5" fill="${col}" opacity=".9"/>${txt(128, 6, estado, 20, "#1B232C")}</g>`;
  const asiento = (x) => `<g transform="translate(${x} 1300)"><rect x="-70" y="-120" width="140" height="24" rx="10" fill="#5E8C99"/><rect x="-70" y="-230" width="140" height="120" rx="16" fill="#7FA4B0"/>
    <rect x="-8" y="-96" width="16" height="96" fill="#8C969C"/><rect x="-60" y="-8" width="120" height="8" rx="4" fill="#8C969C"/></g>`;
  return `<rect x="${X0}" y="-400" width="${ANCHO}" height="1720" fill="#E7EAEC"/>
    <!-- ventanal con la pista y un avión aparcado -->
    <defs><linearGradient id="t13-cielo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#A9D4EA"/><stop offset="1" stop-color="#DDEFF6"/></linearGradient></defs>
    <rect x="${X0}" y="560" width="${ANCHO}" height="600" fill="url(#t13-cielo)"/><rect x="${X0}" y="1010" width="${ANCHO}" height="150" fill="#9AA6AE"/>
    <rect x="${X0}" y="1070" width="${ANCHO}" height="8" fill="#F4F1EA" opacity=".7"/>
    <g transform="translate(760 980)">${avionLado(0.95)}</g>
    <g opacity=".75"><ellipse cx="120" cy="680" rx="90" ry="26" fill="#FFFFFF"/><ellipse cx="170" cy="662" rx="60" ry="22" fill="#FFFFFF"/><ellipse cx="1260" cy="640" rx="110" ry="26" fill="#FFFFFF"/></g>
    ${Array.from({ length: 9 }, (_, i) => `<rect x="${X0 + i * 240 - 8}" y="560" width="16" height="600" fill="#5B6470"/>`).join("")}
    <rect x="${X0}" y="548" width="${ANCHO}" height="20" fill="#5B6470"/><rect x="${X0}" y="1152" width="${ANCHO}" height="20" fill="#5B6470"/>
    <!-- panel de salidas colgado -->
    <g transform="translate(330 700)"><rect x="-6" y="-200" width="12" height="80" fill="#5B6470"/><rect x="-260" y="-130" width="520" height="290" rx="14" fill="#1B232C"/>
      ${txt(-150, -86, "SALIDAS", 30, AMBAR)}<path d="M80 -98 l26 -14 l40 10 l-10 8 l-30 -4 l-20 14 Z" fill="${AMBAR}"/>
      ${fila(-34, "SEVILLA", "EMBARQUE", VERDE_T)}${fila(18, "BILBAO", "EN HORA", VERDE_T)}${fila(70, "PALMA", "EN HORA", VERDE_T)}${fila(122, "TENERIFE", "EN HORA", VERDE_T)}</g>
    <!-- puerta de embarque -->
    <g transform="translate(1020 760)"><rect x="-120" y="-70" width="240" height="120" rx="14" fill="#F4F1EA"/>${txt(0, -10, "PUERTA", 30, "#5B6470")}${txt(0, 36, "B", 44, C.tinta)}</g>
    ${[-260, -110, 40].map(asiento).join("")}
    ${suelo("#D5D9DC", "#C3C8CC")}`;
}

// ------------------------------------------------------------------ interior del avión: maleteros, ventanillas y filas de asientos
function avion() {
  const ventanilla = (x) => `<g transform="translate(${x} 870)"><rect x="-46" y="-70" width="92" height="140" rx="44" fill="#C9CED3"/><rect x="-34" y="-56" width="68" height="112" rx="34" fill="#9FD0EA"/>
    <ellipse cx="-8" cy="20" rx="26" ry="8" fill="#FFFFFF" opacity=".85"/><rect x="-34" y="-56" width="68" height="40" rx="20" fill="#E4E8EB" opacity=".9"/></g>`;
  const asiento = (x) => `<g transform="translate(${x} 1300)"><rect x="-30" y="-330" width="64" height="250" rx="26" fill="#3E5C76"/><rect x="-30" y="-330" width="64" height="70" rx="22" fill="#F4F1EA" opacity=".9"/>
    <rect x="-100" y="-110" width="150" height="40" rx="14" fill="#4E6E8A"/><rect x="-80" y="-70" width="12" height="70" fill="#8C969C"/></g>`;
  return `<rect x="${X0}" y="-400" width="${ANCHO}" height="1720" fill="#EDEFF1"/>
    <!-- techo curvo y maleteros -->
    <path d="M${X0} 520 Q540 430 ${X0 + ANCHO} 520 V560 H${X0} Z" fill="#DADFE3"/>
    <rect x="${X0}" y="560" width="${ANCHO}" height="170" fill="#F7F8F9"/><rect x="${X0}" y="720" width="${ANCHO}" height="16" fill="#C9CED3"/>
    ${Array.from({ length: 8 }, (_, i) => `<rect x="${X0 + 40 + i * 240}" y="580" width="220" height="130" rx="10" fill="#FFFFFF" stroke="#D6DBDF" stroke-width="4"/><rect x="${X0 + 120 + i * 240}" y="690" width="60" height="10" rx="5" fill="#B9C1C7"/>`).join("")}
    <!-- luces y señal del cinturón -->
    <g transform="translate(540 760)"><rect x="-70" y="-14" width="140" height="34" rx="10" fill="#26323F"/><circle cx="-36" cy="3" r="9" fill="${AMBAR}"/>
      <path d="M-4 -4 h20 a8 8 0 0 1 0 14 h-20 Z M24 3 h18" fill="none" stroke="${AMBAR}" stroke-width="5"/></g>
    ${[-260, 20, 300, 580, 860, 1140, 1420].map(ventanilla).join("")}
    ${[-120, 160, 440, 720, 1000, 1280].map(asiento).join("")}
    <!-- puerta de la cabina de mando, a la izquierda -->
    <g transform="translate(-140 1300)"><rect x="-120" y="-560" width="240" height="560" rx="10" fill="#C9CED3"/><rect x="-100" y="-540" width="200" height="520" rx="8" fill="#DADFE3"/>
      <circle cx="70" cy="-270" r="12" fill="#8C969C"/><rect x="-30" y="-470" width="60" height="40" rx="6" fill="#9AA6AE"/></g>
    ${suelo("#7E8D99", "#6F7D88")}<rect x="${X0}" y="1300" width="${ANCHO}" height="40" fill="#5E6C78" opacity=".5"/>`;
}

// ------------------------------------------------------------------ andén: tren de alta velocidad (sin marca), marquesina, reloj y panel de llegadas
export function trenLado(o = "") {
  return `<g ${o}><path d="M-40 -440 H1900 V0 H-40 Q-300 -10 -380 -180 Q-340 -380 -40 -440 Z" fill="#F7F8F9" stroke="#8C969C" stroke-width="6"/><rect x="-40" y="-440" width="1940" height="26" fill="#DDE2E6"/>
    <path d="M-330 -250 Q-280 -360 -80 -390 L-60 -250 Z" fill="#26323F"/>
    <rect x="-40" y="-70" width="1940" height="34" fill="#3E8E8A"/><path d="M-372 -150 Q-330 -60 -40 -70 V-36 Q-300 -36 -360 -120 Z" fill="#3E8E8A"/>
    <rect x="-40" y="-110" width="1940" height="14" fill="${AMBAR}"/>
    ${Array.from({ length: 9 }, (_, i) => `<rect x="${130 + i * 190}" y="-330" width="140" height="110" rx="20" fill="#3A4A58"/><rect x="${140 + i * 190}" y="-322" width="120" height="30" rx="12" fill="#FFFFFF" opacity=".18"/>`).join("")}
    <g transform="translate(20 0)"><rect x="0" y="-400" width="96" height="390" rx="12" fill="#F4F1EA" stroke="#C9CED3" stroke-width="5"/><rect x="18" y="-370" width="60" height="140" rx="10" fill="#3A4A58"/></g>
    <rect x="-40" y="-8" width="1940" height="20" fill="#5B6470"/></g>`;
}
function anden() {
  return `<rect x="${X0}" y="-400" width="${ANCHO}" height="1720" fill="#CFC8BA"/>
    <!-- marquesina metálica -->
    <rect x="${X0}" y="480" width="${ANCHO}" height="60" fill="#8C969C"/>${Array.from({ length: 10 }, (_, i) => `<path d="M${X0 + i * 200} 540 L${X0 + 100 + i * 200} 610 L${X0 + 200 + i * 200} 540" fill="none" stroke="#8C969C" stroke-width="10"/>`).join("")}
    <rect x="${X0}" y="600" width="${ANCHO}" height="120" fill="#CFD8DE"/>
    <!-- el tren, al fondo, con la cabina a la izquierda -->
    <g transform="translate(390 1270)">${trenLado()}</g>
    <!-- borde del andén y línea amarilla -->
    <rect x="${X0}" y="1270" width="${ANCHO}" height="40" fill="#B9BDB8"/>
    ${suelo("#C9C7C0", "#B8B5AD", 1300)}<rect x="${X0}" y="1318" width="${ANCHO}" height="22" fill="#F2C94C"/>
    ${Array.from({ length: 40 }, (_, i) => `<circle cx="${X0 + 20 + i * 48}" cy="1329" r="4" fill="#C9A43A"/>`).join("")}`;
}

// ------------------------------------------------------------------ peaje de autopista: marquesina, cabinas y barreras (sin marca de concesionaria)
function peaje() {
  const cabina = (x) => `<g transform="translate(${x} 1300)"><rect x="-70" y="-320" width="140" height="270" rx="12" fill="#F4F1EA" stroke="#C9CED3" stroke-width="5"/>
    <rect x="-52" y="-295" width="104" height="110" rx="10" fill="#9FD0EA"/><rect x="-90" y="-60" width="180" height="60" rx="8" fill="#F2C94C"/>
    ${[-60, -20, 20, 60].map((xx) => `<rect x="${xx - 10}" y="-60" width="20" height="60" fill="#26323F" opacity=".75"/>`).join("")}</g>`;
  return `<defs><linearGradient id="t13-cielo2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#A9D4EA"/><stop offset="1" stop-color="#E5F1F5"/></linearGradient></defs>
    <rect x="${X0}" y="-400" width="${ANCHO}" height="1720" fill="url(#t13-cielo2)"/>
    <path d="M${X0} 1080 Q100 930 520 1040 Q900 940 ${X0 + ANCHO} 1050 V1300 H${X0} Z" fill="#B7CFA6"/><path d="M${X0} 1150 Q300 1060 700 1130 Q1100 1060 ${X0 + ANCHO} 1140 V1300 H${X0} Z" fill="#9BBE8A"/>
    <!-- marquesina del peaje -->
    <rect x="${X0}" y="740" width="${ANCHO}" height="110" fill="#5E8C99"/><rect x="${X0}" y="850" width="${ANCHO}" height="18" fill="#3F6672"/>
    <g transform="translate(540 796)"><rect x="-150" y="-40" width="300" height="80" rx="12" fill="#FFFFFF"/>${txt(0, 20, "PEAJE", 52, "#3F6672")}</g>
    ${[-250, 230, 710, 1190].map((x) => `<rect x="${x - 16}" y="868" width="32" height="432" fill="#8C969C"/>`).join("")}
    ${[-10, 470, 950].map((x) => `<g transform="translate(${x} 920)"><rect x="-40" y="-40" width="80" height="80" rx="10" fill="#26323F"/><path d="M-22 0 L-6 16 L24 -16" fill="none" stroke="${VERDE_T}" stroke-width="10" stroke-linecap="round"/></g>`).join("")}
    ${[-250, 230, 710, 1190].map(cabina).join("")}
    <!-- asfalto -->
    <rect x="${X0}" y="1300" width="${ANCHO}" height="1000" fill="#6B7178"/>
    ${[1470, 1760].map((y) => Array.from({ length: 12 }, (_, i) => `<rect x="${X0 + 30 + i * 170}" y="${y}" width="100" height="14" rx="4" fill="#F4F1EA" opacity=".85"/>`).join("")).join("")}
    <rect x="${X0}" y="1300" width="${ANCHO}" height="14" fill="#F4F1EA" opacity=".6"/>`;
}
export const DECORADOS_T13 = { terminal, avion, anden, peaje };

// ------------------------------------------------------------------ ropa y objetos de los personajes
// Gorra de comandante (para persona({gorro})): copa azul marino, visera negra y emblema dorado.
export const GORRA_PILOTO = `<path d="M-104 -556 Q-110 -640 0 -650 Q110 -640 104 -556 Z" fill="#1F2F4A"/><rect x="-106" y="-574" width="212" height="30" rx="8" fill="#16213A"/>
  <rect x="-106" y="-566" width="212" height="8" fill="#C8A24A"/><path d="M-100 -548 Q0 -520 104 -548 L96 -532 Q0 -510 -92 -532 Z" fill="#111111"/>
  <path d="M-22 -612 Q0 -630 22 -612 Q0 -600 -22 -612 Z" fill="#C8A24A"/><circle cx="0" cy="-606" r="9" fill="#C8A24A"/>`;
// Chaqueta de comandante (persona({encima})): camisa blanca, corbata y alas doradas.
export const CHAQUETA_PILOTO = `<path d="M-34 -378 L0 -286 L34 -378 Z" fill="#FFFFFF"/><path d="M-10 -360 L0 -290 L10 -360 L0 -372 Z" fill="#16213A"/>
  <path d="M-42 -300 h28 l4 -6 l4 6 h28" fill="none" stroke="#C8A24A" stroke-width="6" stroke-linecap="round"/>
  ${[-200, -230].map((y) => `<circle cx="-12" cy="${y}" r="5" fill="#C8A24A"/><circle cx="12" cy="${y}" r="5" fill="#C8A24A"/>`).join("")}`;
// Pañuelo de la azafata (persona({encima})).
export const PANUELO = `<path d="M-40 -376 Q0 -340 40 -376 L26 -330 Q0 -314 -26 -330 Z" fill="${AMBAR}"/><path d="M-6 -336 L-24 -290 L-4 -300 Z M6 -336 L22 -292 L4 -300 Z" fill="#D08A2C"/>
  <rect x="38" y="-300" width="30" height="8" rx="3" fill="#C8A24A"/>`;
// Chaleco naranja del maquinista (persona({encima})), con bandas reflectantes.
export const CHALECO = `<path d="M-82 -330 Q-82 -380 -36 -380 L-14 -320 V-176 H-82 Z" fill="#F08A3C"/><path d="M82 -330 Q82 -380 36 -380 L14 -320 V-176 H82 Z" fill="#F08A3C"/>
  <rect x="-82" y="-250" width="68" height="14" fill="#E8EDF0"/><rect x="14" y="-250" width="68" height="14" fill="#E8EDF0"/>
  <rect x="-82" y="-214" width="68" height="14" fill="#E8EDF0"/><rect x="14" y="-214" width="68" height="14" fill="#E8EDF0"/>`;
// Telefonillo de megafonía del avión (en la mano).
export const TELEFONILLO = `<g transform="translate(-4 -30) rotate(-20)"><rect x="-12" y="-56" width="24" height="92" rx="10" fill="#26323F"/><rect x="-16" y="-64" width="32" height="20" rx="8" fill="#3A4A58"/>
  <path d="M0 36 q30 20 10 50 q-20 30 10 60" fill="none" stroke="#26323F" stroke-width="5"/></g>`;
// Billete de tren o tarjeta de embarque (en la mano).
export const BILLETE = `<g transform="translate(6 -40) rotate(-10)"><rect x="-54" y="-30" width="108" height="60" rx="8" fill="#FFFFFF" stroke="#C9CED3" stroke-width="4"/>
  <rect x="-54" y="-30" width="30" height="60" rx="8" fill="#3E8E8A"/><rect x="-14" y="-16" width="54" height="8" rx="3" fill="#C9CED3"/><rect x="-14" y="2" width="38" height="8" rx="3" fill="#C9CED3"/></g>`;
// Maleta de cabina con ruedas, de pie en el suelo. Origen: el suelo, en el centro.
export const maleta = (id, col = "#C77B5B") => `<g id="${id}"><rect x="-12" y="-330" width="10" height="120" fill="#8C969C"/><rect x="40" y="-330" width="10" height="120" fill="#8C969C"/><rect x="-18" y="-340" width="74" height="18" rx="8" fill="#5B6470"/>
  <rect x="-60" y="-220" width="180" height="200" rx="22" fill="${col}"/><rect x="-60" y="-220" width="180" height="200" rx="22" fill="#FFFFFF" opacity=".10"/>
  ${[-10, 30, 70].map((x) => `<rect x="${x}" y="-200" width="10" height="160" rx="5" fill="#000000" opacity=".12"/>`).join("")}
  <circle cx="-30" cy="-12" r="14" fill="${C.tinta}"/><circle cx="90" cy="-12" r="14" fill="${C.tinta}"/></g>`;
// Coche visto de lado (sin marca). Origen: el suelo, en el centro. «<id>-r0» y «<id>-r1»: las ruedas.
export const coche = (id, col = "#E0B04A") => `<g id="${id}"><ellipse cx="0" cy="6" rx="250" ry="18" fill="#000000" opacity=".22"/>
  <path fill-rule="evenodd" d="M-250 -60 Q-250 -130 -180 -140 L-120 -150 Q-70 -250 40 -250 Q140 -250 190 -150 Q250 -140 250 -60 V-40 H-250 Z M-100 -150 Q-60 -228 30 -228 V-150 Z M50 -228 Q130 -226 165 -150 H50 Z" fill="${col}"/>
  <path d="M-100 -150 Q-60 -228 30 -228 V-150 Z" fill="#BFE3F2" opacity=".28"/><path d="M50 -228 Q130 -226 165 -150 H50 Z" fill="#BFE3F2" opacity=".28"/>
  <rect x="-250" y="-70" width="500" height="16" fill="#FFFFFF" opacity=".18"/><rect x="226" y="-110" width="24" height="20" rx="6" fill="#FFF3C4"/><rect x="-250" y="-110" width="18" height="22" rx="6" fill="#D86B5B"/>
  ${[-150, 150].map((x, i) => `<g id="${id}-r${i}" transform="translate(${x} -40)"><circle r="46" fill="${C.tinta}"/><circle r="20" fill="#C9CED3"/><rect x="-4" y="-20" width="8" height="40" fill="#8C969C"/></g>`).join("")}</g>`;
// Barrera del peaje. «<id>-brazo» gira alrededor del poste. Origen: el pie del poste.
export const barrera = (id) => `<g id="${id}"><rect x="-22" y="-150" width="44" height="150" rx="8" fill="#F4F1EA" stroke="#C9CED3" stroke-width="4"/>
  <g id="${id}-brazo"><rect x="0" y="-130" width="420" height="22" rx="10" fill="#FFFFFF" stroke="#C9CED3" stroke-width="3"/>
    ${[60, 180, 300].map((x) => `<rect x="${x}" y="-130" width="60" height="22" fill="#D86B5B"/>`).join("")}</g><circle cx="0" cy="-119" r="16" fill="#5B6470"/></g>`;
// Avioncito para los gráficos (visto desde arriba). «<id>-p»: el cuerpo, que se pinta de rojo si se retrasa.
export const avioncito = (id) => `<g id="${id}"><path id="${id}-p" d="M0 -30 Q6 -30 6 -20 V-6 L30 6 V14 L6 8 V22 L14 28 V32 L0 29 L-14 32 V28 L-6 22 V8 L-30 14 V6 L-6 -6 V-20 Q-6 -30 0 -30 Z" fill="#9AA6AE"/></g>`;
// Trenecito para los gráficos (de lado). «<id>-p»: la caja, que se pinta de rojo si llega tarde.
export const trenecito = (id) => `<g id="${id}"><path id="${id}-p" d="M-34 -14 H24 Q38 -14 40 4 V12 H-34 Z" fill="#9AA6AE"/><rect x="-26" y="-8" width="10" height="8" rx="2" fill="#FFFFFF" opacity=".8"/>
  <rect x="-10" y="-8" width="10" height="8" rx="2" fill="#FFFFFF" opacity=".8"/><rect x="6" y="-8" width="10" height="8" rx="2" fill="#FFFFFF" opacity=".8"/>
  <circle cx="-22" cy="14" r="4" fill="${C.tinta}"/><circle cx="26" cy="14" r="4" fill="${C.tinta}"/></g>`;
// Traviesa de vía (para el gráfico del gasto). Origen: el centro.
export const traviesa = (id) => `<g id="${id}"><rect x="-14" y="-60" width="28" height="120" rx="5" fill="#8A6A48"/><rect x="-14" y="-60" width="28" height="18" rx="5" fill="#A9845E"/></g>`;
// Reloj de andén con un sector de color (gráfico de puntualidad): «<id>-v» es el sector verde, «<id>-r» el rojo.
export const relojAnden = (id, r = 120) => `<g id="${id}"><rect x="-8" y="${-r - 70}" width="16" height="60" fill="#5B6470"/><circle r="${r + 16}" fill="#26323F"/><circle r="${r}" fill="#FFFFFF"/>
  <path id="${id}-r" d="" fill="#D86B5B" opacity=".9"/><path id="${id}-v" d="" fill="${VERDE_T}" opacity=".9"/>
  ${Array.from({ length: 12 }, (_, i) => `<rect x="-4" y="${-r + 6}" width="8" height="${i % 3 ? 14 : 26}" fill="${C.tinta}" transform="rotate(${i * 30})"/>`).join("")}
  <g id="${id}-ag"><rect x="-5" y="${-r * 0.78}" width="10" height="${r * 0.78}" rx="5" fill="${C.tinta}"/></g><circle r="12" fill="${C.tinta}"/></g>`;
