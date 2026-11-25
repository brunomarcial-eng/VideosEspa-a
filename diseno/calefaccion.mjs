// Decorados y objetos de T23 (¿cuántas horas trabajas para tener la casa caliente?; Bruno, 24-11-2026):
//   · salonInvierno: el salón de un piso antiguo en invierno, en perspectiva: papel pintado, ventana con cortinas por la
//     que nieva («si-n0…») y se ve el bloque de enfrente (vecinos con manta «si-vp0…», ocultos al principio), radiador
//     bajo la ventana, caldera en la pared con su luz («si-led»), termómetro de pared, sofá con manta, mesa camilla con
//     faldas y lámpara de techo («si-l0»). Primer plano «si-fg»: la caja de herramientas del técnico y el orejero.
//     Prefijo para vidaFondo: «si». Los personajes pisan en y = 1440 (escena entera) o en y = 1700 (en las esquinas).
// Objetos: la factura de la luz y el gas, cien personas en una rejilla (las que pasan frío se pintan de azul) y diez
// barras de renta que crecen de 2019 a hoy. Sin cifras dibujadas salvo las que se pasan (van en la pantalla del guion).

import { C } from "./limpio.mjs";

const X0 = -400, ANCHO = 1900, VX = 540, VY = 720;
const txt = (x, y, t, tam, color, o = "", ancla = "middle") => `<text x="${x}" y="${y}" text-anchor="${ancla}" font-family="Cap" font-weight="800" font-size="${tam}" fill="${color}" ${o}>${t}</text>`;
const enX = (x0, y0, x) => VY + (y0 - VY) * (x - VX) / (x0 - VX);
const ROJO = "#B3261E", OCRE = "#C8902E", FRIO = "#2F6FA8", GRIS = "#DADFE3";
export const COLOR_FRIO = FRIO;

// Ventana del bloque de enfrente: 4 × 3 ventanas; en las de «conManta» hay un vecino con manta y gorro («si-vp<i>»).
const CON_MANTA = [1, 4, 6, 9, 11];
function bloqueEnfrente() {
  const v = [];
  for (let f = 0; f < 3; f++) for (let k = 0; k < 4; k++) {
    const i = f * 4 + k, x = 362 + k * 96, y = 628 + f * 96;
    const vecino = CON_MANTA.includes(i) ? `<g id="si-vp${i}" opacity="0" transform="translate(${x + 30} ${y + 62})">
        <path d="M-22 0 Q-24 -34 0 -38 Q24 -34 22 0 Z" fill="${["#9E3D3D", "#5E7F6E", "#C8902E", "#7C5C8E", "#8C6F5A"][CON_MANTA.indexOf(i)]}"/>
        <circle cx="0" cy="-46" r="13" fill="#F0C8A4"/><path d="M-14 -50 Q0 -70 14 -50 Z" fill="${FRIO}"/><circle cx="0" cy="-66" r="5" fill="#FFFFFF"/></g>` : "";
    v.push(`<rect x="${x}" y="${y}" width="60" height="64" rx="4" fill="${CON_MANTA.includes(i) ? "#F6E7B8" : "#E6EBEF"}"/>
      <rect x="${x}" y="${y + 60}" width="60" height="8" fill="#FFFFFF"/>${vecino}`);
  }
  return `<rect x="340" y="600" width="400" height="320" fill="#C9B9A6"/><rect x="334" y="592" width="412" height="16" fill="#FFFFFF"/>${v.join("")}`;
}

// ------------------------------------------------------------------ el salón en invierno
function salonInvierno() {
  const yIzqT = enX(140, 440, X0), yIzqS = enX(140, 1060, X0), yDerT = enX(940, 440, X0 + ANCHO), yDerS = enX(940, 1060, X0 + ANCHO);
  const tablas = Array.from({ length: 13 }, (_, i) => { const xb = 160 + i * 64; return `<line x1="${xb}" y1="1060" x2="${(VX + (xb - VX) * 4.2).toFixed(0)}" y2="2300" stroke="#A9865E" stroke-width="3" opacity=".6"/>`; }).join("");
  const juntas = [1100, 1170, 1270, 1420, 1650, 1990].map((y) => `<line x1="${X0}" y1="${y}" x2="${X0 + ANCHO}" y2="${y}" stroke="#A9865E" stroke-width="3" opacity=".45"/>`).join("");
  const rayas = Array.from({ length: 20 }, (_, i) => `<rect x="${150 + i * 40}" y="440" width="14" height="420" fill="#DCC9A8" opacity=".55"/>`).join("");
  const copos = Array.from({ length: 26 }, (_, i) => `<circle id="si-n${i}" cx="${340 + (i * 151) % 400}" cy="${520 + (i * 97) % 380}" r="${4 + (i % 3) * 2}" fill="#FFFFFF" opacity=".95"/>`).join("");
  const lampara = `<g id="si-l0" data-x="540" data-y="-400"><line x1="540" y1="-400" x2="540" y2="250" stroke="#5B4636" stroke-width="5"/>
    <path d="M470 250 H610 L650 320 H430 Z" fill="#E8D2A8"/><path d="M430 320 H650" stroke="#C8902E" stroke-width="6"/>
    <circle cx="540" cy="330" r="18" fill="#FFF3C4"/><circle cx="540" cy="330" r="80" fill="#FFF7D6" opacity=".16"/></g>`;
  const mesaCamilla = `<g transform="translate(540 1215)">
      <ellipse cx="0" cy="40" rx="260" ry="34" fill="#3C2814" opacity=".16"/>
      <path d="M-230 -120 Q-246 -40 -258 30 Q-200 52 -130 44 Q-60 56 0 48 Q60 56 130 44 Q200 52 258 30 Q246 -40 230 -120 Z" fill="#8E3B46"/>
      ${[-170, -100, -30, 40, 110, 180].map((x) => `<path d="M${x} -110 Q${x - 6} -40 ${x - 12} 40" stroke="#7A2F3A" stroke-width="10" fill="none" opacity=".6"/>`).join("")}
      <path d="M-258 30 Q-200 52 -130 44 Q-60 56 0 48 Q60 56 130 44 Q200 52 258 30" stroke="#E0B04A" stroke-width="8" fill="none"/>
      <ellipse cx="0" cy="-122" rx="236" ry="52" fill="#9E4652"/><ellipse cx="0" cy="-128" rx="190" ry="40" fill="#FFFDF8" opacity=".9"/>
      ${Array.from({ length: 16 }, (_, i) => { const a = i / 16 * Math.PI * 2; return `<circle cx="${(Math.cos(a) * 178).toFixed(1)}" cy="${(-128 + Math.sin(a) * 36).toFixed(1)}" r="9" fill="none" stroke="#E3D6BF" stroke-width="3"/>`; }).join("")}
      <!-- un jarrón con flores secas y un plato de mandarinas -->
      <g transform="translate(-90 -140)"><path d="M-22 0 Q-30 -40 -12 -62 H12 Q30 -40 22 0 Z" fill="#5E7F6E"/>
        ${[[-18, -120], [0, -132], [18, -118]].map(([x, y]) => `<line x1="0" y1="-60" x2="${x}" y2="${y}" stroke="#8E6644" stroke-width="4"/><circle cx="${x}" cy="${y}" r="10" fill="#D9A55B"/>`).join("")}</g>
      <g transform="translate(90 -136)"><ellipse cx="0" cy="0" rx="62" ry="14" fill="#E8E1D4"/>
        ${[[-26, -10], [0, -16], [26, -10], [-12, -30], [14, -30]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="15" fill="#E98A2E"/>`).join("")}</g></g>`;
  const sofa = `<g transform="translate(-60 1150)"><rect x="-300" y="-230" width="420" height="150" rx="30" fill="#7C6A58"/>
      <rect x="-320" y="-100" width="460" height="110" rx="26" fill="#8D7966"/><rect x="100" y="-170" width="70" height="180" rx="24" fill="#7C6A58"/>
      <path d="M-120 -230 Q-40 -250 40 -226 L60 -60 Q-20 -40 -110 -70 Z" fill="#B85C4A"/>
      ${[-90, -50, -10, 30].map((x) => `<line x1="${x}" y1="-236" x2="${x + 14}" y2="-50" stroke="#E8D2A8" stroke-width="7" opacity=".7"/>`).join("")}
      ${[-190, -120, -70].map((y) => `<line x1="-114" y1="${y}" x2="54" y2="${y + 10}" stroke="#E8D2A8" stroke-width="7" opacity=".7"/>`).join("")}</g>`;
  const termometro = `<g transform="translate(236 700)"><rect x="-34" y="-130" width="68" height="260" rx="14" fill="#A97E56"/>
      <rect x="-9" y="-108" width="18" height="190" rx="9" fill="#FFFDF8"/><circle cx="0" cy="96" r="20" fill="${FRIO}"/>
      <rect id="si-term" x="-5" y="20" width="10" height="70" rx="5" fill="${FRIO}"/>
      ${[-90, -60, -30, 0, 30, 60].map((y) => `<line x1="14" y1="${y}" x2="24" y2="${y}" stroke="#FFFDF8" stroke-width="4"/>`).join("")}</g>`;
  const caldera = `<g transform="translate(858 650)"><rect x="-62" y="-120" width="124" height="200" rx="14" fill="#F4F1EA" stroke="#C9CED3" stroke-width="5"/>
      <rect x="-40" y="-20" width="80" height="44" rx="8" fill="#3B4A57"/><circle id="si-led" cx="22" cy="2" r="9" fill="#7C8790"/>
      <rect x="-32" y="-6" width="34" height="14" rx="4" fill="#5D6E7C"/>
      ${[-30, -10, 10, 30].map((x) => `<line x1="${x}" y1="80" x2="${x}" y2="${x % 20 ? 200 : 170}" stroke="#B9A07A" stroke-width="9" stroke-linecap="round"/>`).join("")}</g>`;
  return `<rect x="${X0}" y="-400" width="${ANCHO}" height="2700" fill="#E4DCCB"/>
    <path d="M${X0} -400 H${X0 + ANCHO} V${yDerT} L940 440 H140 L${X0} ${yIzqT} Z" fill="#EFE8DA"/>
    <!-- pared del fondo con papel pintado, zócalo y la ventana -->
    <rect x="140" y="440" width="800" height="620" fill="#E9DCC3"/>${rayas}
    <rect x="140" y="860" width="800" height="200" fill="#CDB693"/><rect x="140" y="852" width="800" height="12" fill="#A97E56"/>
    <g><clipPath id="si-ventana"><rect x="340" y="520" width="400" height="380"/></clipPath>
      <g clip-path="url(#si-ventana)"><rect x="340" y="520" width="400" height="380" fill="#A9B8C6"/>${bloqueEnfrente()}${copos}
        <path d="M340 900 V860 Q400 830 470 852 Q560 870 640 846 Q700 836 740 852 V900 Z" fill="#FFFFFF" opacity=".55"/></g></g>
    <rect x="328" y="508" width="424" height="18" fill="#FFFDF8"/><rect x="328" y="896" width="424" height="20" fill="#FFFDF8"/>
    <rect x="328" y="508" width="18" height="406" fill="#FFFDF8"/><rect x="734" y="508" width="18" height="406" fill="#FFFDF8"/><rect x="531" y="508" width="18" height="406" fill="#FFFDF8"/>
    <rect x="312" y="912" width="456" height="16" rx="4" fill="#E8E1D4"/>
    <!-- cortinas -->
    <path d="M270 480 H352 Q336 700 360 930 H262 Q250 700 270 480 Z" fill="#9E3D3D"/><path d="M728 480 H810 Q830 700 818 930 H720 Q744 700 728 480 Z" fill="#9E3D3D"/>
    ${[290, 316, 748, 776].map((x) => `<line x1="${x}" y1="490" x2="${x + (x < 500 ? 4 : -4)}" y2="920" stroke="#7A2F3A" stroke-width="7" opacity=".55"/>`).join("")}
    <rect x="250" y="468" width="580" height="16" rx="8" fill="#8E6644"/>
    <!-- radiador de hierro, frío -->
    <rect x="392" y="940" width="296" height="96" rx="10" fill="#D8D1C2" stroke="#BDB3A2" stroke-width="4"/>
    ${Array.from({ length: 8 }, (_, i) => `<rect x="${404 + i * 36}" y="948" width="24" height="80" rx="12" fill="#E4DED2"/>`).join("")}
    ${termometro}${caldera}
    <!-- paredes laterales: un cuadro a la izquierda y la puerta a la derecha -->
    <path d="M${X0} ${yIzqT} L140 440 L140 1060 L${X0} ${yIzqS} Z" fill="#E0D2B8"/>
    <path d="M940 440 L${X0 + ANCHO} ${yDerT} L${X0 + ANCHO} ${yDerS} L940 1060 Z" fill="#DCCDB1"/>
    <path d="M-120 ${enX(140, 560, -120).toFixed(0)} L60 ${enX(140, 560, 60).toFixed(0)} L60 ${enX(140, 740, 60).toFixed(0)} L-120 ${enX(140, 740, -120).toFixed(0)} Z" fill="#C8902E"/>
    <path d="M-104 ${enX(140, 578, -104).toFixed(0)} L44 ${enX(140, 578, 44).toFixed(0)} L44 ${enX(140, 722, 44).toFixed(0)} L-104 ${enX(140, 722, -104).toFixed(0)} Z" fill="#A9C2CF"/>
    <path d="M-104 ${enX(140, 700, -104).toFixed(0)} L-30 ${enX(140, 640, -30).toFixed(0)} L44 ${enX(140, 690, 44).toFixed(0)} L44 ${enX(140, 722, 44).toFixed(0)} L-104 ${enX(140, 722, -104).toFixed(0)} Z" fill="#7DA06A"/>
    <path d="M990 ${enX(940, 560, 990).toFixed(0)} L1130 ${enX(940, 560, 1130).toFixed(0)} L1130 ${enX(940, 1060, 1130).toFixed(0)} L990 ${enX(940, 1060, 990).toFixed(0)} Z" fill="#8E6644"/>
    <circle cx="1110" cy="${enX(940, 820, 1110).toFixed(0)}" r="8" fill="#E0B04A"/>
    <!-- suelo de tarima con alfombra -->
    <path d="M${X0} ${yIzqS} L140 1060 H940 L${X0 + ANCHO} ${yDerS} V2300 H${X0} Z" fill="#C9A97E"/>${tablas}${juntas}
    <ellipse cx="540" cy="1270" rx="470" ry="120" fill="#B85C4A" opacity=".55"/><ellipse cx="540" cy="1270" rx="420" ry="96" fill="none" stroke="#E8D2A8" stroke-width="8" opacity=".6"/>
    ${sofa}${mesaCamilla}${lampara}
    <!-- primer plano: el orejero con su manta y la caja de herramientas del técnico -->
    <g id="si-fg"><g transform="translate(-40 2040)"><rect x="-200" y="-330" width="300" height="330" rx="60" fill="#6E8A7C"/><rect x="40" y="-260" width="110" height="260" rx="40" fill="#5E7A6C"/>
        <path d="M-160 -300 Q-60 -330 60 -290 L80 -40 Q-40 -10 -150 -40 Z" fill="#C8902E" opacity=".9"/>
        ${[-110, -50, 10].map((x) => `<line x1="${x}" y1="-310" x2="${x + 10}" y2="-30" stroke="#8E3B46" stroke-width="10" opacity=".7"/>`).join("")}</g>
      <g transform="translate(1040 1560)"><rect x="-120" y="-90" width="240" height="90" rx="10" fill="#B3402E"/><rect x="-120" y="-90" width="240" height="22" rx="8" fill="#8E3324"/>
        <path d="M-50 -90 V-124 H50 V-90" fill="none" stroke="#3B4A57" stroke-width="12" stroke-linecap="round"/>
        <rect x="-80" y="-104" width="70" height="16" rx="4" fill="#9AA6AE" transform="rotate(-12 -45 -96)"/></g></g>`;
}

export const DECORADOS_T23 = { salonInvierno };

// ------------------------------------------------------------------ ropa de los personajes
// Bufanda de lana sobre el abrigo de la vecina (va en «encima» de persona()).
export const BUFANDA = `<path d="M-66 -368 Q0 -334 66 -368 L68 -334 Q0 -300 -68 -334 Z" fill="#5E7F6E"/>
  <path d="M26 -344 L56 -220 L26 -216 L4 -336 Z" fill="#5E7F6E"/>${[0, 12, 24].map((d) => `<line x1="${30 + d * 0.6}" y1="-222" x2="${30 + d * 0.6}" y2="-202" stroke="#5E7F6E" stroke-width="5"/>`).join("")}
  <path d="M-40 -354 L-38 -322 M-10 -346 L-9 -314 M20 -348 L21 -316" stroke="#E8D2A8" stroke-width="5" opacity=".7"/>
  <circle cx="-30" cy="-300" r="8" fill="#3B2A20" opacity=".7"/><circle cx="-30" cy="-250" r="8" fill="#3B2A20" opacity=".7"/>`;
// Gafas de la vecina (van en «gorro», encima del pelo y debajo de los ojos).
export const GAFAS = `<g fill="none" stroke="#6E5444" stroke-width="5"><circle cx="-34" cy="-486" r="26"/><circle cx="34" cy="-486" r="26"/><path d="M-8 -488 Q0 -494 8 -488"/></g>`;
// Mono de trabajo del técnico: bolsillo, cremallera y una banda clara (sin marcas).
export const MONO = `<line x1="0" y1="-372" x2="0" y2="-180" stroke="#3E505A" stroke-width="5"/>
  <rect x="18" y="-330" width="44" height="40" rx="6" fill="#4A5E68"/><rect x="-82" y="-250" width="164" height="14" fill="#E8E1D4" opacity=".75"/>`;

// Las tres nubecitas del vaho de un personaje (las anima vaho() del runtime).
export const vahoSVG = (p) => [0, 1, 2].map((k) => `<circle id="${p}${k}" r="8" fill="#F6FAFC" stroke="#AFC2D0" stroke-width="3" opacity="0"/>`).join("");
export const N_COPOS = 26;

// ------------------------------------------------------------------ objetos
// La factura de la luz y el gas: cabecera, iconos (bombilla, llama y bidón), renglones y el total del año. Origen: centro.
export function facturaLuz(id, total, pie = "al año") {
  return `<g id="${id}"><rect x="-250" y="-300" width="500" height="600" rx="18" fill="#FFFDF8" stroke="#D9DEE2" stroke-width="5"/>
    <rect x="-250" y="-300" width="500" height="86" rx="18" fill="#5E7F6E"/><rect x="-250" y="-240" width="500" height="26" fill="#5E7F6E"/>
    ${txt(0, -242, "LUZ, GAS Y GASÓLEO", 38, "#FFFFFF")}
    <g transform="translate(-150 -130)"><circle cx="0" cy="-10" r="30" fill="#FFE07A"/><rect x="-14" y="18" width="28" height="22" rx="4" fill="#9AA6AE"/></g>
    <g transform="translate(0 -130)"><path d="M0 -44 Q30 -10 22 18 Q14 40 0 40 Q-14 40 -22 18 Q-30 -10 0 -44 Z" fill="#E98A2E"/><path d="M0 -6 Q12 10 8 24 Q4 32 0 32 Q-4 32 -8 24 Q-12 10 0 -6 Z" fill="#FFE07A"/></g>
    <g transform="translate(150 -130)"><rect x="-26" y="-36" width="52" height="76" rx="8" fill="#8C6F5A"/><rect x="-12" y="-46" width="24" height="12" rx="3" fill="#6E5444"/></g>
    ${[-40, 0, 40, 80].map((y, i) => `<rect x="-200" y="${y}" width="${[300, 240, 270, 200][i]}" height="16" rx="8" fill="#E3E7EA"/><rect x="140" y="${y}" width="60" height="16" rx="8" fill="#E3E7EA"/>`).join("")}
    <line x1="-200" y1="140" x2="200" y2="140" stroke="${C.tinta}" stroke-width="4"/>
    ${txt(-200, 220, "TOTAL", 40, C.tinta, "", "start")}${txt(200, 222, total, 66, ROJO, "", "end")}${txt(200, 266, pie, 30, "#8C969C", "", "end")}</g>`;
}

// Cien personas en una rejilla de 10 × 10 («<id>-p0…p99»), en gris; el guion pinta de azul las que pasan frío en un
// orden salteado (ORDEN_FRIO). Rótulo encima. Origen: centro.
export const ORDEN_FRIO = Array.from({ length: 100 }, (_, i) => (i * 37 + 11) % 100);
export function cienPersonas(id, rotulo, o = {}) {
  const paso = o.paso ?? 32;
  const p = Array.from({ length: 100 }, (_, i) => { const x = -paso * 4.5 + (i % 10) * paso, y = -paso * 4.5 + Math.floor(i / 10) * paso;
    return `<g id="${id}-p${i}" fill="${GRIS}"><circle cx="${x}" cy="${y - paso * 0.2}" r="${paso * 0.22}"/><rect x="${x - paso * 0.3}" y="${y + paso * 0.04}" width="${paso * 0.6}" height="${paso * 0.42}" rx="${paso * 0.18}"/></g>`; }).join("");
  const fondo = `<rect x="${-paso * 5.4}" y="${-paso * 7}" width="${paso * 10.8}" height="${paso * 12}" rx="22" fill="#FFFDF8" opacity=".96"/>`;
  return `<g id="${id}">${fondo}${txt(0, -paso * 5.5, rotulo, o.tam ?? 38, C.tinta)}${p}</g>`;
}

// Diez barras de renta (de los que menos ganan a los que más): «<id>-d0…d9», con la altura de 2019 en data-a y la de
// hoy en data-b (en píxeles); la del medio («d4», el quinto decil) va en rojo con su valor de 2019 («<id>-va») y el de
// hoy («<id>-vb»). Origen: centro de la base.
export function decilesFrio(id, a, b, etiquetas) {
  const W = 700, H = 400, max = Math.max(...a, ...b), paso = W / 10;
  const barras = a.map((v, i) => { const x = -W / 2 + i * paso + paso * 0.16, w = paso * 0.68, ha = v / max * H, hb = b[i] / max * H;
    return `<rect id="${id}-d${i}" data-a="${ha.toFixed(1)}" data-b="${hb.toFixed(1)}" x="${x.toFixed(1)}" y="${(-ha).toFixed(1)}" width="${w.toFixed(1)}" height="${ha.toFixed(1)}" rx="8" fill="${i === 4 ? ROJO : OCRE}" opacity="${i === 4 ? 1 : 0.55}"/>`; }).join("");
  const xm = -W / 2 + 4.5 * paso;
  return `<g id="${id}"><rect x="${-W / 2 - 40}" y="${-H - 130}" width="${W + 80}" height="${H + 200}" rx="24" fill="#FFFDF8" opacity=".95"/>
    ${barras}<line x1="${-W / 2}" y1="0" x2="${W / 2}" y2="0" stroke="${C.tinta}" stroke-width="4"/>
    <g id="${id}-va">${txt(xm, -(a[4] / max * H) - 62, "renta media", 30, ROJO)}${txt(xm, -(a[4] / max * H) - 18, etiquetas[0], 40, ROJO)}</g>
    <g id="${id}-vb" opacity="0">${txt(xm, -(b[4] / max * H) - 70, "renta media", 30, ROJO)}${txt(xm, -(b[4] / max * H) - 20, etiquetas[1], 48, ROJO)}</g>
    ${txt(-W / 2, 44, "← menos renta", 30, "#5B6470", "", "start")}${txt(W / 2, 44, "más renta →", 30, "#5B6470", "", "end")}</g>`;
}
