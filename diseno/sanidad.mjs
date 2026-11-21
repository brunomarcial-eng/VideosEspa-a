// Decorados y objetos de la sanidad (T11, Bruno 21-11-2026: entornos más descriptivos y muy relacionados con el tema).
// Todo dibujado con código, sin marcas ni logotipos reales y sin la cruz roja (emblema protegido): la sanidad va con una cruz verde.
// Los decorados son capas para ambientes() de sueno.mjs: el suelo empieza en y = 1300 y los personajes pisan en y = 1440.

import { C } from "./limpio.mjs";

const X0 = -400, ANCHO = 1900;
const txt = (x, y, t, tam, color, o = "") => `<text x="${x}" y="${y}" text-anchor="middle" font-family="Cap" font-weight="800" font-size="${tam}" fill="${color}" ${o}>${t}</text>`;
const VERDE = "#3F8F6B";
export const cruzVerde = (x, y, s = 1, col = VERDE) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-14" y="-40" width="28" height="80" rx="5" fill="${col}"/><rect x="-40" y="-14" width="80" height="28" rx="5" fill="${col}"/></g>`;
const suelo = (col, raya, y = 1300) => `<rect x="${X0}" y="${y}" width="${ANCHO}" height="${2300 - y}" fill="${col}"/>
  ${Array.from({ length: 16 }, (_, i) => `<line x1="${X0 + i * 130}" y1="${y}" x2="${X0 - 90 + i * 130}" y2="2300" stroke="${raya}" stroke-width="4"/>`).join("")}
  ${[1420, 1600, 1840].map((yy) => `<line x1="${X0}" y1="${yy}" x2="${X0 + ANCHO}" y2="${yy}" stroke="${raya}" stroke-width="3" opacity=".7"/>`).join("")}`;
// Silla de plástico de sala de espera. Origen: el suelo, en el centro.
const silla = (x, col = "#7FA4B0") => `<g transform="translate(${x} 1300)"><rect x="-44" y="-150" width="88" height="74" rx="16" fill="${col}"/><rect x="-48" y="-84" width="96" height="22" rx="9" fill="${col}"/>
  <rect x="-40" y="-64" width="8" height="64" fill="#8C969C"/><rect x="32" y="-64" width="8" height="64" fill="#8C969C"/><rect x="-50" y="-70" width="100" height="6" fill="#8C969C"/></g>`;
// Alguien esperando sentado (silueta suave, para que no compita con los protagonistas).
const esperando = (x, ropa, piel, pelo, inclina = 0) => `<g transform="translate(${x} 1300) rotate(${inclina} 0 -120)"><rect x="-34" y="-160" width="68" height="92" rx="26" fill="${ropa}"/>
  <rect x="-30" y="-78" width="60" height="22" rx="10" fill="#4A5A6A"/><rect x="18" y="-70" width="18" height="70" rx="8" fill="#4A5A6A"/><rect x="-36" y="-70" width="18" height="70" rx="8" fill="#4A5A6A"/>
  <circle cx="0" cy="-190" r="30" fill="${piel}"/><path d="M-30 -194 C-32 -224 -10 -228 0 -227 C16 -228 33 -220 30 -192 C22 -210 8 -214 0 -214 C-10 -214 -22 -210 -30 -194 Z" fill="${pelo}"/></g>`;

// ------------------------------------------------------------------ sala de espera del centro de salud
function sala() {
  return `<rect x="${X0}" y="-400" width="${ANCHO}" height="1720" fill="#E4EFE9"/>
    <rect x="${X0}" y="1010" width="${ANCHO}" height="290" fill="#C8DDD3"/><rect x="${X0}" y="1000" width="${ANCHO}" height="14" rx="5" fill="#A9C6B8"/>
    <!-- rótulo del centro -->
    <rect x="80" y="610" width="560" height="96" rx="14" fill="#FFFFFF"/>${cruzVerde(140, 658, 0.7)}${txt(390, 676, "CENTRO DE SALUD", 44, VERDE)}
    <!-- pantalla de turnos -->
    <g id="sala-pant"><rect x="690" y="740" width="330" height="170" rx="14" fill="#2B3440"/><rect x="706" y="756" width="298" height="138" rx="8" fill="#141A21"/>
      ${txt(855, 806, "SU TURNO", 30, "#F2B33D")}<g id="sala-pant-f"><path d="M790 838 h130 l-20 -14 M920 838 l-20 14" stroke="#F2B33D" stroke-width="8" fill="none" stroke-linecap="round"/></g>
      ${txt(855, 880, "CONSULTA", 26, "#9AE6B4")}</g>
    <!-- reloj de pared -->
    <g transform="translate(250 840)"><circle r="78" fill="#FFFFFF" stroke="#5B6470" stroke-width="10"/>${Array.from({ length: 12 }, (_, i) => `<rect x="-3" y="-68" width="6" height="14" fill="#5B6470" transform="rotate(${i * 30})"/>`).join("")}
      <rect id="sala-rh" x="-4" y="-44" width="8" height="48" rx="4" fill="${C.tinta}"/><rect id="sala-rm" x="-3" y="-62" width="6" height="66" rx="3" fill="${C.rojo}"/><circle r="8" fill="${C.tinta}"/></g>
    <!-- carteles -->
    <g transform="translate(470 760)"><rect x="-80" y="-60" width="160" height="200" rx="10" fill="#FFF7E6" stroke="#E3D6BF" stroke-width="4"/>${txt(0, -20, "CITA", 28, VERDE)}${txt(0, 12, "PREVIA", 28, VERDE)}
      <rect x="-26" y="40" width="52" height="80" rx="10" fill="${C.tinta}"/><rect x="-18" y="50" width="36" height="56" rx="4" fill="#9ED0E6"/></g>
    <!-- máquina de turnos -->
    <g transform="translate(1090 1300)"><rect x="-60" y="-330" width="120" height="330" rx="16" fill="#D7DEE2"/><rect x="-44" y="-300" width="88" height="70" rx="8" fill="#2B3440"/>
      <rect x="-30" y="-200" width="60" height="10" rx="4" fill="#2B3440"/><rect x="-24" y="-194" width="48" height="40" fill="#FFFFFF"/>${txt(0, -120, "TURNO", 20, C.gris)}</g>
    <!-- planta -->
    <g transform="translate(-120 1300)"><path d="M-40 0 h80 l-10 -110 h-60 Z" fill="#C98F6B"/>${[-50, -20, 10, 40].map((x, i) => `<ellipse cx="${x}" cy="${-150 - (i % 2) * 40}" rx="26" ry="70" fill="#6F9E76" transform="rotate(${x / 2} ${x} -110)"/>`).join("")}</g>
    ${[-20, 110, 240, 370, 500, 630].map((x) => silla(x)).join("")}
    ${esperando(110, "#B9A3C9", "#F1C9A5", "#5A3A26", -4)}${esperando(370, "#C9B37E", "#DCA883", "#2A1E16", 3)}${esperando(630, "#9FB8C9", "#F2CBA8", "#B8B0A6", -2)}
    ${suelo("#D9D2C3", "#C9C1B1")}`;
}

// ------------------------------------------------------------------ consulta del médico de familia
function consulta() {
  const rodilla = `<g transform="translate(860 820)"><rect x="-110" y="-150" width="220" height="300" rx="10" fill="#FFFFFF" stroke="#D9DEE2" stroke-width="4"/>
    <path d="M-22 -130 Q-34 -40 -18 20 L18 20 Q30 -40 20 -130 Z" fill="#F1E6D2" stroke="#C9B79B" stroke-width="4"/><ellipse cx="0" cy="30" rx="34" ry="24" fill="#F1E6D2" stroke="#C9B79B" stroke-width="4"/>
    <circle cx="26" cy="22" r="14" fill="#F6D9A0" stroke="#C9B79B" stroke-width="3"/><path d="M-18 50 Q-26 110 -16 140 L16 140 Q24 110 18 50 Z" fill="#F1E6D2" stroke="#C9B79B" stroke-width="4"/>
    <circle cx="0" cy="40" r="44" fill="none" stroke="${C.rojo}" stroke-width="5" stroke-dasharray="10 7"/></g>`;
  return `<rect x="${X0}" y="-400" width="${ANCHO}" height="1720" fill="#EEF2F4"/>
    <rect x="${X0}" y="1060" width="${ANCHO}" height="240" fill="#DDE5E9"/>
    <!-- ventana con persiana -->
    <rect x="40" y="640" width="360" height="330" rx="10" fill="#BFE0EE"/>${Array.from({ length: 11 }, (_, i) => `<rect x="40" y="${646 + i * 30}" width="360" height="16" fill="#F4F6F7" opacity=".85"/>`).join("")}
    <rect x="30" y="630" width="380" height="14" rx="5" fill="#C9CED3"/>
    ${rodilla}
    <!-- títulos colgados y estetoscopio en la percha -->
    <rect x="470" y="700" width="150" height="110" rx="6" fill="#FFFDF8" stroke="#C8902E" stroke-width="6"/><rect x="492" y="730" width="106" height="10" rx="4" fill="#C9CED3"/><rect x="492" y="752" width="80" height="10" rx="4" fill="#C9CED3"/>
    <!-- mesa con ordenador, teclado e impresora -->
    <rect x="200" y="1150" width="520" height="22" rx="8" fill="#C9A26B"/><rect x="216" y="1172" width="16" height="128" fill="#9AA6AE"/><rect x="688" y="1172" width="16" height="128" fill="#9AA6AE"/>
    <rect x="380" y="1000" width="200" height="130" rx="10" fill="${C.tinta}"/><rect x="392" y="1012" width="176" height="104" rx="5" fill="#E8F4F8"/>
    ${[0, 1, 2, 3].map((k) => `<rect x="404" y="${1028 + k * 22}" width="${[120, 150, 96, 136][k]}" height="10" rx="4" fill="#9AB6C4"/>`).join("")}
    <rect x="466" y="1130" width="28" height="20" fill="${C.tinta}"/><rect x="390" y="1140" width="180" height="10" rx="4" fill="#5B6470"/>
    <g transform="translate(640 1150)"><rect x="-50" y="-60" width="100" height="60" rx="8" fill="#D7DEE2"/><rect x="-36" y="-70" width="72" height="14" fill="#FFFFFF"/><rect id="cons-volante" x="-30" y="-18" width="60" height="0" fill="#FFFFFF"/></g>
    <!-- camilla con papel -->
    <g transform="translate(900 1300)"><rect x="-170" y="-150" width="340" height="40" rx="12" fill="#5E8C99"/><rect x="-150" y="-158" width="300" height="12" rx="5" fill="#FFFFFF"/>
      <rect x="-160" y="-110" width="14" height="110" fill="#9AA6AE"/><rect x="146" y="-110" width="14" height="110" fill="#9AA6AE"/><rect x="-170" y="-190" width="90" height="46" rx="14" fill="#5E8C99"/></g>
    <!-- lavabo -->
    <g transform="translate(-160 1150)"><rect x="-70" y="-10" width="140" height="40" rx="10" fill="#FFFFFF" stroke="#D9DEE2" stroke-width="4"/><path d="M0 -10 V-60 H30" stroke="#9AA6AE" stroke-width="10" fill="none" stroke-linecap="round"/></g>
    ${suelo("#DCD8CE", "#CBC6BA")}`;
}

// ------------------------------------------------------------------ pasillo del hospital, en perspectiva
function pasillo() {
  const F = [540, 880];  // punto de fuga
  const puerta = (x, y, w, h, et, col) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${col}"/><rect x="${x + w * 0.15}" y="${y + h * 0.12}" width="${w * 0.7}" height="${h * 0.22}" fill="#BFE0EE"/>
    <rect x="${x - 6}" y="${y - 44}" width="${w + 12}" height="36" rx="6" fill="#FFFFFF"/>${txt(x + w / 2, y - 18, et, Math.max(14, w * 0.17), C.tinta)}`;
  return `<rect x="${X0}" y="-400" width="${ANCHO}" height="1720" fill="#E9EEF0"/>
    <!-- paredes, techo y suelo en perspectiva -->
    <path d="M${X0} 300 L${F[0] - 170} ${F[1] - 150} L${F[0] - 170} ${F[1] + 150} L${X0} 1500 Z" fill="#DCE6E9"/>
    <path d="M1500 300 L${F[0] + 170} ${F[1] - 150} L${F[0] + 170} ${F[1] + 150} L1500 1500 Z" fill="#D3DFE3"/>
    <path d="M${X0} 300 L${F[0] - 170} ${F[1] - 150} H${F[0] + 170} L1500 300 V-400 H${X0} Z" fill="#F4F7F8"/>
    <path d="M${X0} 1500 L${F[0] - 170} ${F[1] + 150} H${F[0] + 170} L1500 1500 V2300 H${X0} Z" fill="#CFD8D6"/>
    ${[0, 1, 2, 3, 4].map((i) => { const k = 0.15 + i * 0.2, y = 300 + (F[1] - 150 - 300) * k, w = 520 * (1 - k * 0.85); return `<rect x="${F[0] - w / 2}" y="${y - 10}" width="${w}" height="${18 * (1 - k * 0.7)}" rx="6" fill="#FFFFFF" opacity=".95"/>`; }).join("")}
    ${[-1, 1].map((d) => `<path d="M${d < 0 ? X0 : 1500} 1160 L${F[0] + d * 170} ${F[1] + 60}" stroke="#9AA6AE" stroke-width="10"/>`).join("")}
    <!-- puertas laterales -->
    ${puerta(120, 760, 150, 380, "TRAUMATOLOGÍA", "#6F9EAF")}${puerta(820, 790, 120, 320, "CONSULTAS", "#6F9EAF")}
    <!-- quirófano al fondo -->
    <rect x="${F[0] - 150}" y="${F[1] - 140}" width="300" height="290" fill="#5E9E8F"/><line x1="${F[0]}" y1="${F[1] - 140}" x2="${F[0]}" y2="${F[1] + 150}" stroke="#4A8274" stroke-width="6"/>
    <circle cx="${F[0] - 70}" cy="${F[1] - 60}" r="30" fill="#BFE0EE"/><circle cx="${F[0] + 70}" cy="${F[1] - 60}" r="30" fill="#BFE0EE"/>
    <rect x="${F[0] - 120}" y="${F[1] - 200}" width="240" height="46" rx="8" fill="#2B3440"/>${txt(F[0], F[1] - 166, "QUIRÓFANO", 30, "#9AE6B4")}
    <!-- camillas aparcadas en el pasillo -->
    ${[[60, 1290, 1], [330, 1180, 0.7]].map(([x, y, s]) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-150" y="-110" width="300" height="34" rx="10" fill="#FFFFFF" stroke="#C9CED3" stroke-width="4"/>
      <rect x="-150" y="-140" width="60" height="34" rx="12" fill="#E8EEF0"/><rect x="-140" y="-76" width="10" height="66" fill="#9AA6AE"/><rect x="130" y="-76" width="10" height="66" fill="#9AA6AE"/>
      <circle cx="-135" cy="-6" r="10" fill="#5B6470"/><circle cx="135" cy="-6" r="10" fill="#5B6470"/></g>`).join("")}`;
}

// ------------------------------------------------------------------ recepción de una clínica privada (genérica, sin marca)
function clinica() {
  return `<rect x="${X0}" y="-400" width="${ANCHO}" height="1720" fill="#F2EBDD"/>
    ${Array.from({ length: 12 }, (_, i) => `<rect x="${X0 + i * 160}" y="600" width="6" height="700" fill="#E5DBC8"/>`).join("")}
    <rect x="200" y="640" width="680" height="110" rx="16" fill="#FFFFFF"/>${cruzVerde(270, 695, 0.75, "#8A6E4B")}${txt(580, 715, "CLÍNICA · RECEPCIÓN", 40, "#8A6E4B")}
    <!-- mostrador de madera -->
    <rect x="120" y="1060" width="840" height="240" rx="14" fill="#B98A5E"/><rect x="100" y="1040" width="880" height="34" rx="12" fill="#D4A373"/>
    ${[0, 1, 2, 3].map((i) => `<rect x="${150 + i * 205}" y="1100" width="180" height="170" rx="10" fill="#A9794F"/>`).join("")}
    <!-- cartel de seguros -->
    <g transform="translate(900 880)"><rect x="-110" y="-100" width="220" height="200" rx="12" fill="#FFFFFF" stroke="#E3D6BF" stroke-width="4"/>${txt(0, -48, "SEGUROS", 30, "#8A6E4B")}
      <rect x="-70" y="-20" width="140" height="88" rx="12" fill="#7C9A7E"/><rect x="-54" y="0" width="40" height="28" rx="4" fill="#F4D98B"/><rect x="0" y="40" width="54" height="10" rx="4" fill="#FFFFFF"/></g>
    <!-- sofá y planta -->
    <g transform="translate(-150 1300)"><rect x="-140" y="-150" width="280" height="90" rx="30" fill="#8FA893"/><rect x="-160" y="-80" width="320" height="70" rx="24" fill="#7C9A7E"/></g>
    <g transform="translate(1160 1300)"><path d="M-40 0 h80 l-10 -110 h-60 Z" fill="#FFFFFF" stroke="#E3D6BF" stroke-width="4"/>${[-40, -10, 20, 45].map((x, i) => `<ellipse cx="${x}" cy="${-160 - (i % 2) * 40}" rx="24" ry="72" fill="#6F9E76" transform="rotate(${x / 2} ${x} -110)"/>`).join("")}</g>
    ${suelo("#E3D6C1", "#D4C5AC")}`;
}
export const DECORADOS_T11 = { sala, consulta, pasillo, clinica };

// ------------------------------------------------------------------ personajes: ropa de trabajo
// Bata blanca abierta con solapas, bolsillo con bolis y estetoscopio al cuello (encima del cuerpo de persona()).
export const BATA = `<path d="M-82 -330 L-30 -378 L0 -300 L30 -378 L82 -330 V-176 H-82 Z" fill="none"/>
  <path d="M-30 -378 L0 -290 L-14 -176 H-82 V-300 Z" fill="#FFFFFF" opacity=".55"/><path d="M30 -378 L0 -290 L14 -176 H82 V-300 Z" fill="#FFFFFF" opacity=".35"/>
  <path d="M-8 -296 L0 -290 L8 -296 V-176 H-8 Z" fill="#8FB3C9"/>
  <rect x="34" y="-280" width="34" height="40" rx="6" fill="#E9ECE8"/><rect x="40" y="-300" width="6" height="26" rx="2" fill="#1F5F8B"/><rect x="52" y="-296" width="6" height="22" rx="2" fill="${C.tinta}"/>
  <path d="M-34 -372 Q-40 -300 -20 -262 Q0 -246 20 -262 Q40 -300 34 -372" fill="none" stroke="#5B6470" stroke-width="7" stroke-linecap="round"/>
  <circle cx="0" cy="-258" r="14" fill="#9AA6AE" stroke="#5B6470" stroke-width="4"/>`;
// Pijama de enfermería: cuello de pico y bolsillo.
export const PIJAMA = `<path d="M-30 -378 L0 -326 L30 -378" fill="none" stroke="#3E6F63" stroke-width="8" stroke-linejoin="round"/>
  <rect x="-66" y="-300" width="40" height="36" rx="6" fill="#4A8274"/><rect x="-58" y="-316" width="6" height="22" rx="2" fill="#FFFFFF"/>`;
// Muleta (en la mano del paciente).
export const MULETA = `<g transform="translate(8 0) rotate(4)"><rect x="-7" y="-100" width="14" height="300" rx="6" fill="#9AA6AE"/><rect x="-26" y="-110" width="52" height="16" rx="8" fill="#5B6470"/>
  <rect x="-16" y="-6" width="32" height="14" rx="6" fill="#5B6470"/><rect x="-9" y="196" width="18" height="16" rx="5" fill="${C.tinta}"/></g>`;
// Tarjeta del seguro privado (en la mano).
export const TARJETA_SEGURO = `<g transform="translate(6 -46) rotate(-14)"><rect x="-58" y="-38" width="116" height="76" rx="10" fill="#7C9A7E" stroke="#FFFFFF" stroke-width="4"/>
  <rect x="-44" y="-22" width="30" height="22" rx="4" fill="#F4D98B"/><rect x="-44" y="12" width="88" height="8" rx="4" fill="#FFFFFF" opacity=".8"/>${cruzVerde(30, -12, 0.3, "#FFFFFF")}</g>`;
// Volante de derivación (papel) en la mano.
export const VOLANTE = `<g transform="translate(6 -40) rotate(-8)"><rect x="-40" y="-52" width="80" height="104" rx="6" fill="#FFFFFF" stroke="#C9CED3" stroke-width="4"/>
  <rect x="-28" y="-38" width="56" height="10" rx="4" fill="${VERDE}"/>${[0, 1, 2, 3].map((k) => `<rect x="-28" y="${-18 + k * 16}" width="${k % 2 ? 40 : 56}" height="7" rx="3" fill="#C9CED3"/>`).join("")}</g>`;

// ------------------------------------------------------------------ objetos de los datos
// Calendario de espera: una hoja grande con «DÍAS DE ESPERA» y el número que corre (id «<id>-n»). Origen: centro.
export function calendarioEspera(id, inicial) {
  return `<g id="${id}"><rect x="-150" y="-150" width="300" height="300" rx="20" fill="#3C2814" opacity=".12" transform="translate(8 12)"/>
    <rect x="-150" y="-150" width="300" height="300" rx="20" fill="#FFFFFF"/><rect x="-150" y="-150" width="300" height="80" rx="20" fill="${VERDE}"/><rect x="-150" y="-100" width="300" height="30" fill="${VERDE}"/>
    ${txt(0, -98, "DÍAS DE ESPERA", 30, "#FFFFFF")}${[-90, -30, 30, 90].map((x) => `<rect x="${x - 7}" y="-170" width="14" height="40" rx="7" fill="#5B6470"/>`).join("")}
    <text id="${id}-n" x="0" y="70" text-anchor="middle" font-family="Cap" font-weight="800" font-size="130" fill="${C.tinta}">${inicial}</text></g>`;
}
// Balanza: brazo «<id>-b» que gira, platos «<id>-pi» (izquierda) y «<id>-pd» (derecha). Origen: el pie, en el suelo.
export function balanza(id, izq, der) {
  const plato = (lado, et, carga) => `<g id="${id}-p${lado}"><line x1="-70" y1="0" x2="0" y2="-150" stroke="#8A6E4B" stroke-width="5"/><line x1="70" y1="0" x2="0" y2="-150" stroke="#8A6E4B" stroke-width="5"/>
    <path d="M-100 0 H100 Q80 40 0 40 Q-80 40 -100 0 Z" fill="#C8902E"/>${carga}${txt(0, 84, et, 28, C.tinta)}</g>`;
  return `<g id="${id}"><path d="M-90 0 H90 L60 -30 H-60 Z" fill="#8A6E4B"/><rect x="-12" y="-420" width="24" height="400" rx="8" fill="#A9794F"/>
    <g id="${id}-b"><rect x="-300" y="-430" width="600" height="20" rx="10" fill="#8A6E4B"/><circle cx="0" cy="-420" r="22" fill="#C8902E"/></g>
    ${plato("i", izq[0], izq[1])}${plato("d", der[0], der[1])}</g>`;
}
