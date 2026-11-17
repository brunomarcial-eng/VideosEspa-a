// Decorados que cambian «como en un sueño» (T4 v4): la conversación salta de la cocina a un bar, al súper,
// a la calle, a un piso vacío, al cuarto de siempre y a un parque. Cada decorado es una capa compartida
// (class="capa", id «amb-<nombre>») dentro del grupo «amb»; el cambio lo hace ambiente() en limpio_runtime.js.
// Todo dibujado con código, sin marcas y sin cifras. El suelo empieza en y = 1300, como en la cocina.

import { C, persona } from "./limpio.mjs";
import { cocina } from "./casa.mjs";

const X0 = -400, ANCHO = 1900;
const txt = (x, y, t, tam, color, o = "") => `<text x="${x}" y="${y}" text-anchor="middle" font-family="Cap" font-weight="800" font-size="${tam}" fill="${color}" ${o}>${t}</text>`;
const pared = (color) => `<rect x="${X0}" y="-400" width="${ANCHO}" height="1720" fill="${color}"/>`;
const suelo = (color, raya) => `<rect x="${X0}" y="1300" width="${ANCHO}" height="1000" fill="${color}"/>
  ${Array.from({ length: 14 }, (_, i) => `<line x1="${X0 + i * 140}" y1="1300" x2="${X0 - 60 + i * 140}" y2="2300" stroke="${raya}" stroke-width="4"/>`).join("")}`;

// ------------------------------------------------------------------ bar
function bar() {
  const botellas = ["#7C9A7E", "#E9C46A", "#9B5A5A", "#F4F1EA", "#C98F6B", "#7C9A7E", "#E9C46A", "#F4F1EA"];
  const fila = (y) => botellas.map((c, i) => `<rect x="${352 + i * 48}" y="${y - 70}" width="26" height="70" rx="7" fill="${c}"/><rect x="${360 + i * 48}" y="${y - 96}" width="10" height="30" rx="4" fill="${c}"/>`).join("");
  const lampara = (x) => `<line x1="${x}" y1="-400" x2="${x}" y2="250" stroke="#5B4636" stroke-width="6"/><path d="M${x - 70} 320 Q${x} 200 ${x + 70} 320 Z" fill="#C8902E"/>
    <circle cx="${x}" cy="330" r="22" fill="#FFE9A8"/><circle cx="${x}" cy="360" r="150" fill="#FFE9A8" opacity=".16"/>`;
  return `${pared("#EBD3B5")}
    <rect x="${X0}" y="860" width="${ANCHO}" height="440" fill="#A9794F"/><rect x="${X0}" y="852" width="${ANCHO}" height="16" fill="#8E6644"/>
    ${[200, 540, 880].map(lampara).join("")}
    <rect x="320" y="520" width="440" height="330" rx="14" fill="#7A5638"/><rect x="336" y="536" width="408" height="298" rx="8" fill="#5B3F2A"/>
    <rect x="336" y="676" width="408" height="14" fill="#7A5638"/>${fila(676)}${fila(834)}
    <rect x="40" y="610" width="220" height="210" rx="12" fill="#6E5444"/><rect x="54" y="624" width="192" height="182" rx="6" fill="#2F3B35"/>
    ${txt(150, 690, "TAPAS", 40, "#F4F1EA", 'letter-spacing="4"')}<path d="M84 724 H216 M84 752 H190 M84 780 H206" stroke="#F4F1EA" stroke-width="5" stroke-linecap="round" opacity=".6"/>
    <rect x="${X0}" y="1050" width="${ANCHO}" height="250" fill="#8E6644"/><rect x="${X0}" y="1020" width="${ANCHO}" height="40" rx="10" fill="#C99A6B"/>
    ${Array.from({ length: 9 }, (_, i) => `<rect x="${X0 + 40 + i * 215}" y="1090" width="170" height="180" rx="10" fill="#7F5A3B"/>`).join("")}
    <rect x="968" y="900" width="26" height="124" rx="8" fill="#9AA6AE"/><rect x="940" y="884" width="82" height="26" rx="10" fill="#C9CED3"/><rect x="972" y="850" width="18" height="44" rx="8" fill="${C.tinta}"/>
    ${suelo("#C4AE8E", "#B39B79")}`;
}

// ------------------------------------------------------------------ súper
function superMercado() {
  const col = ["#F1D9A8", "#DCE7DD", "#E9C4A6", "#F6EBD6", "#EAD7B7", "#C9DCC9", "#F0D2C4"];
  const balda = (y, semilla) => {
    let s = "", x = -20, i = semilla;
    while (x < 1090) {
      const w = 46 + ((i * 37) % 5) * 12, h = 90 + ((i * 53) % 4) * 16;
      s += `<rect x="${x}" y="${y - h}" width="${w}" height="${h}" rx="9" fill="${col[i % col.length]}"/>${i % 3 === 0 ? `<rect x="${x + w * 0.3}" y="${y - h - 14}" width="${w * 0.4}" height="16" rx="5" fill="${C.gris}" opacity=".5"/>` : ""}`;
      x += w + 14; i++;
    }
    return s + `<rect x="-60" y="${y}" width="1200" height="18" fill="${C.salvia}"/>`;
  };
  return `${pared("#EEF2EC")}
    ${[120, 540, 960].map((x) => `<rect x="${x - 130}" y="150" width="260" height="26" rx="13" fill="#FFFFFF"/><rect x="${x - 130}" y="176" width="260" height="60" fill="#FFFFFF" opacity=".25"/>`).join("")}
    <line x1="400" y1="-400" x2="400" y2="700" stroke="#9AA6AE" stroke-width="5"/><line x1="680" y1="-400" x2="680" y2="700" stroke="#9AA6AE" stroke-width="5"/>
    <rect x="-60" y="700" width="1200" height="600" rx="16" fill="#8FA893"/><rect x="-44" y="716" width="1168" height="584" fill="#B4C7B6"/>
    ${balda(900, 1)}${balda(1090, 4)}${balda(1280, 8)}
    ${suelo("#E4E0D4", "#D2CDBE")}`;
}

// ------------------------------------------------------------------ calle
function calle() {
  const edificio = (x, w, alto, color) => {
    let v = "";
    for (let y = 1300 - alto + 50; y < 1180; y += 130) for (let xx = x + 30; xx + 60 <= x + w - 20; xx += 100) v += `<rect x="${xx}" y="${y}" width="60" height="80" rx="6" fill="#9EB9C7"/>`;
    return `<rect x="${x}" y="${1300 - alto}" width="${w}" height="${alto}" fill="${color}"/>${v}`;
  };
  return `<rect x="${X0}" y="-400" width="${ANCHO}" height="1720" fill="#CFE6F2"/>
    <ellipse cx="180" cy="520" rx="130" ry="44" fill="#FFFFFF" opacity=".85"/><ellipse cx="270" cy="490" rx="90" ry="40" fill="#FFFFFF" opacity=".85"/>
    <ellipse cx="900" cy="640" rx="120" ry="40" fill="#FFFFFF" opacity=".8"/>
    ${edificio(-400, 330, 640, "#E6D2AE")}${edificio(-70, 300, 470, "#DCC7AA")}${edificio(830, 290, 520, "#E9D8BE")}${edificio(1120, 380, 700, "#DCC7AA")}
    <rect x="250" y="1150" width="14" height="150" fill="#8A6A48"/><circle cx="257" cy="1110" r="62" fill="#9CB89E"/><circle cx="300" cy="1150" r="40" fill="#8FAE92"/>
    <rect x="760" y="900" width="12" height="400" fill="#5B6470"/><path d="M766 900 Q766 860 806 860" fill="none" stroke="#5B6470" stroke-width="12"/><rect x="796" y="850" width="50" height="22" rx="8" fill="#FFE9A8"/>
    <rect x="${X0}" y="1290" width="${ANCHO}" height="22" fill="#BFB3A2"/>
    <rect x="${X0}" y="1300" width="${ANCHO}" height="1000" fill="#D9D2C5"/>
    <path d="M-146 2120 L300 1306 M1226 2120 L780 1306 M540 2120 V1306 M${X0} 1560 H1500" stroke="#C7BEAF" stroke-width="5" opacity=".7"/>`;
}

// ------------------------------------------------------------------ piso vacío
function piso() {
  const caja = (x, y, w, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="#C9A26B"/><rect x="${x}" y="${y}" width="${w}" height="${h * 0.22}" fill="#B98F58"/><rect x="${x + w / 2 - 12}" y="${y}" width="24" height="${h}" fill="#E6D2AE" opacity=".7"/>`;
  return `${pared("#E6EBEE")}
    <line x1="540" y1="-400" x2="540" y2="330" stroke="#5B6470" stroke-width="5"/><circle cx="540" cy="350" r="26" fill="#FFE9A8"/><rect x="528" y="316" width="24" height="20" fill="#9AA6AE"/>
    <rect x="330" y="470" width="420" height="440" rx="12" fill="#FFFDF8"/><rect x="348" y="488" width="384" height="404" rx="6" fill="#B9D7E6"/>
    <path d="M348 892 V760 H420 V700 H500 V790 H590 V660 H680 V740 H732 V892 Z" fill="#9EB9C7" opacity=".7"/>
    <line x1="540" y1="488" x2="540" y2="892" stroke="#FFFDF8" stroke-width="12"/><line x1="348" y1="690" x2="732" y2="690" stroke="#FFFDF8" stroke-width="12"/>
    <rect x="380" y="960" width="320" height="150" rx="14" fill="#F4F1EA" stroke="#D9DEE2" stroke-width="5"/>
    ${Array.from({ length: 8 }, (_, i) => `<line x1="${410 + i * 37}" y1="972" x2="${410 + i * 37}" y2="1098" stroke="#D9DEE2" stroke-width="8" stroke-linecap="round"/>`).join("")}
    <rect x="${X0}" y="1276" width="${ANCHO}" height="26" fill="#FFFDF8"/>
    ${suelo("#D9BC92", "#C7A77C")}
    ${caja(-10, 1130, 190, 170)}${caja(20, 990, 150, 140)}${caja(930, 1150, 170, 150)}`;
}

// ------------------------------------------------------------------ el cuarto de siempre
function cuarto() {
  const estrellas = [[90, 520], [250, 380], [860, 430], [990, 600], [700, 360], [130, 760], [960, 820]]
    .map(([x, y], i) => `<path transform="translate(${x} ${y}) scale(${i % 2 ? 1 : 0.7})" d="M0 -20 L6 -6 L21 -6 L9 3 L13 18 L0 9 L-13 18 L-9 3 L-21 -6 L-6 -6 Z" fill="#F4D06F"/>`).join("");
  const copa = (x, y) => `<path d="M${x - 22} ${y - 60} H${x + 22} Q${x + 22} ${y - 26} ${x} ${y - 24} Q${x - 22} ${y - 26} ${x - 22} ${y - 60} Z" fill="#E9C46A"/><rect x="${x - 5}" y="${y - 26}" width="10" height="16" fill="#E9C46A"/><rect x="${x - 18}" y="${y - 12}" width="36" height="12" rx="4" fill="#8A6A48"/>`;
  return `${pared("#DCE8F0")}${estrellas}
    <rect x="360" y="500" width="200" height="260" rx="8" fill="#FFFDF8"/><rect x="374" y="514" width="172" height="232" fill="#2C3E50"/>
    <path d="M460 560 Q490 600 484 668 H436 Q430 600 460 560 Z" fill="#F4F1EA"/><circle cx="460" cy="620" r="13" fill="#6AADDF"/><path d="M436 660 L414 692 H436 Z M484 660 L506 692 H484 Z" fill="#C98F6B"/><path d="M446 672 H474 L460 716 Z" fill="#E9C46A"/>
    <rect x="620" y="640" width="300" height="18" rx="6" fill="#B98A5E"/>${copa(670, 640)}${copa(730, 640)}
    ${[0, 1, 2, 3].map((i) => `<rect x="${790 + i * 28}" y="${570 + (i % 2) * 10}" width="22" height="${70 - (i % 2) * 10}" rx="3" fill="${["#9B5A5A", "#7C9A7E", "#C8902E", "#5D7A8C"][i]}"/>`).join("")}
    <path d="M640 720 L760 740 L640 770 Z" fill="#9B5A5A"/>
    <rect x="${X0}" y="1276" width="${ANCHO}" height="26" fill="#FFFDF8"/>
    ${suelo("#CDBBA0", "#BEA98A")}
    <ellipse cx="540" cy="1420" rx="330" ry="70" fill="#9FB7C9" opacity=".55"/>
    <rect x="330" y="1010" width="34" height="300" rx="10" fill="#8A6A48"/><rect x="716" y="1090" width="30" height="220" rx="10" fill="#8A6A48"/>
    <rect x="346" y="1150" width="386" height="130" rx="18" fill="#FFFDF8"/>
    <rect x="460" y="1136" width="272" height="150" rx="18" fill="#6F8FA6"/>${[0, 1, 2].map((i) => `<rect x="${500 + i * 80}" y="1136" width="36" height="150" fill="#FFFDF8" opacity=".55"/>`).join("")}
    <rect x="356" y="1104" width="110" height="60" rx="26" fill="#F4F1EA" stroke="#D9DEE2" stroke-width="4"/>`;
}

// ------------------------------------------------------------------ parque
function parque() {
  const arbol = (x, s) => `<g transform="translate(${x} 1300) scale(${s})"><rect x="-12" y="-220" width="24" height="220" fill="#8A6A48"/><circle cx="0" cy="-260" r="90" fill="#9CB89E"/><circle cx="-60" cy="-210" r="56" fill="#8FAE92"/><circle cx="62" cy="-214" r="60" fill="#A9C4A2"/></g>`;
  return `<rect x="${X0}" y="-400" width="${ANCHO}" height="1720" fill="#CFE9F5"/>
    <circle cx="170" cy="470" r="70" fill="#FFE08A"/><circle cx="170" cy="470" r="110" fill="#FFE08A" opacity=".25"/>
    <ellipse cx="820" cy="560" rx="130" ry="42" fill="#FFFFFF" opacity=".85"/><ellipse cx="910" cy="530" rx="80" ry="36" fill="#FFFFFF" opacity=".85"/>
    <ellipse cx="200" cy="1330" rx="620" ry="190" fill="#B7D1A8"/><ellipse cx="980" cy="1340" rx="560" ry="160" fill="#A9C4A2"/>
    ${arbol(40, 1.1)}${arbol(1040, 1.25)}
    <path d="M880 1300 L880 1040 H960 V1300" fill="none" stroke="#C98F6B" stroke-width="14"/><path d="M880 1060 Q800 1180 740 1290" fill="none" stroke="#E9C46A" stroke-width="30" stroke-linecap="round"/>
    <path d="M364 1300 L436 650 M716 1300 L644 650 M420 650 H660" fill="none" stroke="#8A6A48" stroke-width="18" stroke-linecap="round"/>
    <rect x="${X0}" y="1290" width="${ANCHO}" height="20" fill="#9CB89E"/>
    <rect x="${X0}" y="1300" width="${ANCHO}" height="1000" fill="#E8D6AC"/>
    ${Array.from({ length: 16 }, (_, i) => `<ellipse cx="${-300 + i * 120 + (i % 3) * 30}" cy="${1380 + (i % 4) * 90}" rx="40" ry="8" fill="#D9C491" opacity=".7"/>`).join("")}`;
}

// ------------------------------------------------------------------ boda (jardín con arco de flores)
function boda() {
  const flor = (x, y, c, r = 18) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}"/><circle cx="${x}" cy="${y}" r="${r * 0.35}" fill="#F4D06F"/>`;
  const flores = Array.from({ length: 22 }, (_, i) => {
    const a = Math.PI * (i / 21), x = 540 - Math.cos(a) * 250, y = 900 - Math.sin(a) * 300;
    return flor(x, y, ["#F2B3AC", "#FFFDF8", "#E79C96", "#F4E4C8"][i % 4], 20 + (i % 3) * 4);
  }).join("");
  const guirnalda = (y0, y1) => {
    let d = "", b = "";
    for (let i = 0; i <= 12; i++) {
      const x = -60 + i * 100, y = y0 + Math.sin(i * 0.9) * 12 + (y1 - y0) * (i / 12);
      d += (i ? " L" : "M") + x + " " + y;
      b += `<circle id="amb-boda-l${i}" cx="${x}" cy="${y + 16}" r="11" fill="${["#E9C46A", "#F2B3AC", "#9ED0E6", "#B7D1A8"][i % 4]}"/>`;
    }
    return `<path d="${d}" fill="none" stroke="#8A6A48" stroke-width="4"/>${b}`;
  };
  return `<rect x="${X0}" y="-400" width="${ANCHO}" height="1720" fill="#DDEFF6"/>
    <ellipse cx="200" cy="1340" rx="700" ry="200" fill="#C9DDB9"/><ellipse cx="960" cy="1350" rx="640" ry="180" fill="#BCD3AC"/>
    ${guirnalda(470, 520)}
    <path d="M290 1300 V900 A250 300 0 0 1 790 900 V1300" fill="none" stroke="#FFFDF8" stroke-width="26"/>${flores}
    <rect x="80" y="1110" width="150" height="16" rx="6" fill="#FFFDF8"/><rect x="92" y="1126" width="12" height="174" fill="#E3D6BF"/><rect x="206" y="1126" width="12" height="174" fill="#E3D6BF"/>
    <rect x="98" y="1050" width="114" height="60" rx="8" fill="#FFFDF8" stroke="#E3D6BF" stroke-width="4"/><rect x="116" y="1000" width="78" height="50" rx="8" fill="#FFFDF8" stroke="#E3D6BF" stroke-width="4"/>
    <rect x="132" y="964" width="46" height="36" rx="8" fill="#FFFDF8" stroke="#E3D6BF" stroke-width="4"/>${flor(155, 958, "#F2B3AC", 12)}
    <rect x="${X0}" y="1300" width="${ANCHO}" height="1000" fill="#E9DFC8"/>
    <rect x="390" y="1300" width="300" height="1000" fill="#F2B3AC" opacity=".55"/>`;
}

// ------------------------------------------------------------------ sala de cunas (casi vacía)
function cunas() {
  const cunita = (x, y, llena) => `<g transform="translate(${x} ${y})"><rect x="-56" y="-60" width="112" height="60" rx="10" fill="#FFFDF8" stroke="#C9D1D6" stroke-width="5"/>
    ${[-36, -12, 12, 36].map((d) => `<line x1="${d}" y1="-60" x2="${d}" y2="0" stroke="#C9D1D6" stroke-width="4"/>`).join("")}
    <rect x="-60" y="0" width="10" height="34" fill="#C9D1D6"/><rect x="50" y="0" width="10" height="34" fill="#C9D1D6"/>
    ${llena ? `<circle cx="0" cy="-74" r="20" fill="#F1C9A5"/><path d="M-30 -60 Q0 -96 30 -60 Z" fill="#9ED0E6"/>` : ""}</g>`;
  return `${pared("#EAF2F7")}
    <rect x="${X0}" y="860" width="${ANCHO}" height="440" fill="#DDE9F0"/>
    <rect x="300" y="380" width="480" height="300" rx="18" fill="#FFFDF8"/><rect x="318" y="398" width="444" height="264" rx="10" fill="#CFE6F2"/>
    <line x1="540" y1="398" x2="540" y2="662" stroke="#FFFDF8" stroke-width="10"/>
    ${[0, 1, 2, 3, 4, 5].map((i) => `<circle cx="${100 + i * 180}" cy="300" r="16" fill="${["#F2B3AC", "#9ED0E6", "#F4D06F"][i % 3]}"/>`).join("")}
    ${[-200, 30, 260, 490, 720, 950, 1180].map((x, i) => cunita(x, 1060, i === 3)).join("")}
    <rect x="${X0}" y="1300" width="${ANCHO}" height="1000" fill="#E4E9EC"/>
    ${Array.from({ length: 14 }, (_, i) => `<line x1="${X0 + i * 140}" y1="1300" x2="${X0 - 60 + i * 140}" y2="2300" stroke="#D2D9DE" stroke-width="4"/>`).join("")}`;
}

// ------------------------------------------------------------------ oficina (mesas, ventanales y una pizarra)
function oficina() {
  const mesa = (x) => `<rect x="${x - 110}" y="1150" width="220" height="16" rx="6" fill="#B98A5E"/><rect x="${x - 100}" y="1166" width="12" height="134" fill="#9AA6AE"/><rect x="${x + 88}" y="1166" width="12" height="134" fill="#9AA6AE"/>
    <rect x="${x - 50}" y="1070" width="100" height="70" rx="6" fill="${C.tinta}"/><rect x="${x - 44}" y="1076" width="88" height="56" rx="4" fill="#9ED0E6"/><rect x="${x - 8}" y="1140" width="16" height="12" fill="${C.tinta}"/>`;
  return `${pared("#EEF1F3")}
    ${[0, 1, 2, 3].map((i) => `<rect x="${-260 + i * 420}" y="300" width="360" height="520" rx="10" fill="#CFE6F2"/><line x1="${-80 + i * 420}" y1="300" x2="${-80 + i * 420}" y2="820" stroke="#FFFFFF" stroke-width="10"/>`).join("")}
    <rect x="${X0}" y="820" width="${ANCHO}" height="480" fill="#E2E7EA"/>
    ${[-160, 540, 1240].map(mesa).join("")}
    <circle cx="80" cy="1060" r="44" fill="#9CB89E"/><rect x="66" y="1090" width="28" height="60" rx="6" fill="#C98F6B"/>
    <rect x="${X0}" y="1300" width="${ANCHO}" height="1000" fill="#C9CED3"/>
    ${Array.from({ length: 14 }, (_, i) => `<line x1="${X0 + i * 140}" y1="1300" x2="${X0 - 60 + i * 140}" y2="2300" stroke="#B9BFC5" stroke-width="4"/>`).join("")}`;
}

// Todas las capas de decorado, con el filtro de ondas y la bruma del cambio. Va en «capas» de escenas.mjs.
export function ambientes() {
  const capa = (nombre, dibujo) => `<g id="amb-${nombre}" class="capa">${dibujo}</g>`;
  return `<defs><filter id="f-sueno" x="-5%" y="-5%" width="110%" height="110%">
      <feTurbulence id="f-sueno-t" type="fractalNoise" baseFrequency="0.004 0.009" numOctaves="2" seed="7" result="ruido"/>
      <feDisplacementMap id="f-sueno-d" in="SourceGraphic" in2="ruido" scale="0" xChannelSelector="R" yChannelSelector="G"/></filter>
    <radialGradient id="g-bruma"><stop offset="0" stop-color="#FFFFFF" stop-opacity="1"/><stop offset="1" stop-color="#FFFFFF" stop-opacity=".35"/></radialGradient></defs>
    <g id="amb">${capa("cocina", cocina("amb-cocina-d"))}${capa("bar", bar())}${capa("super", superMercado())}${capa("calle", calle())}
      ${capa("piso", piso())}${capa("cuarto", cuarto())}${capa("parque", parque())}
      ${capa("boda", boda())}${capa("cunas", cunas())}${capa("oficina", oficina())}</g>
    <rect id="amb-bruma" class="capa" x="${X0}" y="-400" width="${ANCHO}" height="2700" fill="url(#g-bruma)" opacity="0"/>`;
}

// ------------------------------------------------------------------ objetos de las escenas
// Caña de cerveza. Origen: centro de la base.
export function cana(id, s = 1) {
  return `<g id="${id}"><g transform="scale(${s})"><path d="M-24 -84 H24 L18 0 H-18 Z" fill="#E9B949"/><path d="M-28 -98 Q-14 -112 0 -100 Q14 -114 28 -98 L24 -80 H-24 Z" fill="#FFFFFF" stroke="#E3D6BF" stroke-width="3"/>
    <path d="M-24 -84 H24 L18 0 H-18 Z" fill="none" stroke="#FFFFFF" stroke-width="4" opacity=".7"/></g></g>`;
}
// La misma caña para la mano de un personaje (persona(..., {mano: CANA_MANO})).
export const CANA_MANO = `<g transform="translate(16 -4) scale(.9)"><path d="M-24 -84 H24 L18 0 H-18 Z" fill="#E9B949"/><path d="M-28 -98 Q-14 -112 0 -100 Q14 -114 28 -98 L24 -80 H-24 Z" fill="#FFFFFF" stroke="#E3D6BF" stroke-width="3"/></g>`;
// La bandeja va girada 98° porque el brazo que la lleva («sujeta») gira −98°: así queda horizontal.
export const BANDEJA = `<g transform="rotate(98) translate(10 -30)"><ellipse cx="0" cy="0" rx="74" ry="14" fill="#9AA6AE"/><ellipse cx="0" cy="-4" rx="74" ry="14" fill="#C9CED3"/>
  <g transform="translate(-30 -6) scale(.6)"><path d="M-24 -84 H24 L18 0 H-18 Z" fill="#E9B949"/><path d="M-28 -98 Q0 -116 28 -98 L24 -80 H-24 Z" fill="#FFFFFF"/></g>
  <g transform="translate(26 -6) scale(.6)"><path d="M-24 -84 H24 L18 0 H-18 Z" fill="#E9B949"/><path d="M-28 -98 Q0 -116 28 -98 L24 -80 H-24 Z" fill="#FFFFFF"/></g></g>`;
// Mesa alta de bar. Origen: el suelo, en el centro. El tablero queda a 330 px del suelo.
export function mesaAlta(id) {
  return `<g id="${id}"><ellipse cx="0" cy="4" rx="90" ry="14" fill="#3C2814" opacity=".16"/><rect x="-60" y="-14" width="120" height="16" rx="8" fill="#5B6470"/><rect x="-9" y="-320" width="18" height="310" fill="#5B6470"/>
    <ellipse cx="0" cy="-322" rx="130" ry="24" fill="#8E6644"/><ellipse cx="0" cy="-330" rx="130" ry="24" fill="#C99A6B"/></g>`;
}
// Hucha (cerdito). Origen: el suelo.
export function hucha(id) {
  return `<g id="${id}"><ellipse cx="0" cy="4" rx="80" ry="10" fill="#3C2814" opacity=".14"/><rect x="-50" y="-30" width="18" height="34" rx="8" fill="#E79C96"/><rect x="34" y="-30" width="18" height="34" rx="8" fill="#E79C96"/>
    <ellipse cx="0" cy="-70" rx="84" ry="58" fill="#F2B3AC"/><path d="M-50 -116 L-62 -146 L-28 -124 Z" fill="#E79C96"/><ellipse cx="74" cy="-74" rx="22" ry="18" fill="#E79C96"/>
    <circle cx="68" cy="-74" r="4" fill="#B56C66"/><circle cx="80" cy="-74" r="4" fill="#B56C66"/><circle cx="40" cy="-94" r="6" fill="${C.tinta}"/><rect x="-22" y="-126" width="44" height="9" rx="4" fill="#B56C66"/>
    <path d="M-84 -76 q-18 -6 -12 -22" fill="none" stroke="#E79C96" stroke-width="7" stroke-linecap="round"/></g>`;
}
// Bloque de pisos que crece planta a planta. Origen: centro de la base. Cada planta mide ALTO_PLANTA.
export const ALTO_PLANTA = 70;
export function bloque(id, plantas, ancho = 300) {
  const planta = (k) => `<g id="${id}-p${k}"><rect x="${-ancho / 2}" y="${-ALTO_PLANTA}" width="${ancho}" height="${ALTO_PLANTA}" fill="${k % 2 ? "#E8E2D6" : "#EFE9DD"}" stroke="#CFC6B4" stroke-width="3"/>
    ${k === 0 ? `<rect x="-24" y="-54" width="48" height="54" rx="6" fill="#6B4A32"/><rect x="${-ancho / 2 + 30}" y="-54" width="60" height="34" rx="5" fill="#9ED0E6"/><rect x="${ancho / 2 - 90}" y="-54" width="60" height="34" rx="5" fill="#9ED0E6"/>`
      : [-1, 0, 1].map((c) => `<rect x="${c * 92 - 28}" y="-54" width="56" height="34" rx="5" fill="#9ED0E6"/><rect x="${c * 92 - 34}" y="-20" width="68" height="7" rx="3" fill="#FFFDF8"/>`).join("")}</g>`;
  return `<g id="${id}"><ellipse cx="0" cy="6" rx="${ancho * 0.6}" ry="16" fill="#3C2814" opacity=".14"/>${Array.from({ length: plantas }, (_, k) => planta(k)).join("")}
    <g id="${id}-tejado"><rect x="${-ancho / 2 - 12}" y="-22" width="${ancho + 24}" height="22" rx="6" fill="#B8613E"/><rect x="${ancho / 2 - 70}" y="-62" width="34" height="44" fill="#9AA0A6"/></g></g>`;
}
// Cartel que cuelga de dos cuerdas. Origen: el punto del que cuelga (arriba, en el centro).
export function cartel(id, texto, color) {
  return `<g id="${id}"><line x1="-120" y1="0" x2="-120" y2="150" stroke="#8A6A48" stroke-width="6"/><line x1="120" y1="0" x2="120" y2="150" stroke="#8A6A48" stroke-width="6"/>
    <rect x="-200" y="150" width="400" height="130" rx="18" fill="#FFFDF8" stroke="${color}" stroke-width="10"/>${txt(0, 236, texto, 58, color, 'letter-spacing="2"')}</g>`;
}
// Caja de mudanza. Origen: centro de la base.
export function cajaMudanza(id) {
  return `<g id="${id}"><rect x="-70" y="-110" width="140" height="110" rx="6" fill="#C9A26B"/><rect x="-70" y="-110" width="140" height="26" fill="#B98F58"/><rect x="-12" y="-110" width="24" height="110" fill="#E6D2AE" opacity=".7"/></g>`;
}
// Columpio: dos cuerdas y el asiento. Origen: el travesaño del que cuelga.
export function columpio(id) {
  return `<g id="${id}"><line x1="-56" y1="0" x2="-56" y2="420" stroke="#6B5A48" stroke-width="7"/><line x1="56" y1="0" x2="56" y2="420" stroke="#6B5A48" stroke-width="7"/>
    <rect x="-80" y="418" width="160" height="24" rx="10" fill="#C98F6B"/></g>`;
}
// Pelota de playa. Origen: el centro.
export function pelota(id) {
  return `<g id="${id}"><circle r="42" fill="#FFFDF8" stroke="#E3D6BF" stroke-width="4"/><path d="M0 -42 A42 42 0 0 1 36 21 L0 0 Z" fill="#E9C46A"/><path d="M0 -42 A42 42 0 0 0 -36 21 L0 0 Z" fill="#C98F6B"/><circle r="8" fill="#FFFDF8"/></g>`;
}
// Osito de peluche. Origen: centro de la base.
export function osito(id) {
  return `<g id="${id}"><ellipse cx="0" cy="-44" rx="44" ry="46" fill="#B98A5E"/><circle cx="0" cy="-112" r="38" fill="#C99A6B"/><circle cx="-30" cy="-142" r="15" fill="#B98A5E"/><circle cx="30" cy="-142" r="15" fill="#B98A5E"/>
    <ellipse cx="0" cy="-100" rx="16" ry="12" fill="#F4E4C8"/><circle cx="-13" cy="-118" r="5" fill="${C.tinta}"/><circle cx="13" cy="-118" r="5" fill="${C.tinta}"/><circle cx="0" cy="-104" r="5" fill="#5A2A22"/>
    <ellipse cx="-44" cy="-50" rx="14" ry="26" fill="#C99A6B" transform="rotate(20 -44 -50)"/><ellipse cx="44" cy="-50" rx="14" ry="26" fill="#C99A6B" transform="rotate(-20 44 -50)"/></g>`;
}

export { persona };

// Anillo de boda. Origen: el centro.
export function anillo(id) {
  return `<g id="${id}"><circle r="34" fill="none" stroke="#E9C46A" stroke-width="12"/><path d="M-12 -40 L0 -58 L12 -40 Z" fill="#CFE6F2" stroke="#FFFFFF" stroke-width="3"/></g>`;
}
// Contador grande de edad (el número lo pone la página en <id>-n). Origen: el centro.
export function contador(id, rotulo) {
  return `<g id="${id}"><rect x="-150" y="-90" width="300" height="190" rx="24" fill="#FFFDF8" stroke="#E3D6BF" stroke-width="6"/>
    <text x="0" y="-46" text-anchor="middle" font-family="Cap" font-weight="800" font-size="30" fill="${C.gris}" letter-spacing="3">${rotulo}</text>
    <text id="${id}-n" x="0" y="62" text-anchor="middle" font-family="Cap" font-weight="800" font-size="118" fill="${C.azul}"></text></g>`;
}
// Bebé (cabeza y mantita). Origen: la base. Con clip, se puede enseñar solo una parte (0..1) de izquierda a derecha.
export function bebe(id, color = "#9ED0E6") {
  return `<g id="${id}"><defs><clipPath id="${id}-clip"><rect id="${id}-r" x="-60" y="-140" width="120" height="150"/></clipPath></defs>
    <g clip-path="url(#${id}-clip)"><ellipse cx="0" cy="-40" rx="52" ry="42" fill="${color}"/><circle cx="0" cy="-98" r="36" fill="#F1C9A5"/>
    <circle cx="-12" cy="-102" r="5" fill="${C.tinta}"/><circle cx="12" cy="-102" r="5" fill="${C.tinta}"/><path d="M-10 -86 Q0 -78 10 -86" fill="none" stroke="#7A3E2E" stroke-width="4" stroke-linecap="round"/></g>
    <g opacity=".22"><ellipse cx="0" cy="-40" rx="52" ry="42" fill="${C.gris}"/><circle cx="0" cy="-98" r="36" fill="${C.gris}"/></g></g>`;
}
// Mujer (figura sencilla). Origen: los pies.
export function mujer(id, color) {
  return `<g id="${id}"><path d="M-46 0 L-34 -150 Q0 -176 34 -150 L46 0 Z" fill="${color}"/><circle cx="0" cy="-196" r="34" fill="#EDBE96"/>
    <path d="M-36 -196 Q-40 -244 0 -242 Q40 -244 36 -196 Q30 -222 0 -222 Q-30 -222 -36 -196 Z" fill="#6B4A32"/></g>`;
}
// Maletín (trabajo) y moneda (dinero). Origen: el centro.
export function maletin(id) {
  return `<g id="${id}"><rect x="-70" y="-46" width="140" height="96" rx="14" fill="#8A6A48"/><rect x="-26" y="-66" width="52" height="24" rx="8" fill="none" stroke="#6B5A48" stroke-width="10"/><rect x="-70" y="-6" width="140" height="10" fill="#6B4A32"/></g>`;
}
export function moneda(id) {
  return `<g id="${id}"><circle r="54" fill="#E9C46A" stroke="#C8902E" stroke-width="8"/><text y="22" text-anchor="middle" font-family="Cap" font-weight="800" font-size="64" fill="#8A6316">€</text></g>`;
}

// Retrato antiguo (sepia) de una madre en casa con su bebé. Origen: el centro.
export function retrato(id) {
  return `<g id="${id}"><defs><filter id="${id}-sepia"><feColorMatrix type="matrix" values=".39 .77 .19 0 0  .35 .69 .17 0 0  .27 .53 .13 0 0  0 0 0 1 0"/></filter></defs>
    <rect x="-150" y="-180" width="300" height="340" rx="10" fill="#8A6A48"/><rect x="-130" y="-160" width="260" height="300" fill="#F4EAD8"/>
    <g filter="url(#${id}-sepia)"><rect x="-130" y="-160" width="260" height="300" fill="#E6D2AE"/>
      <g transform="translate(-20 130) scale(.9)"><path d="M-46 0 L-34 -150 Q0 -176 34 -150 L46 0 Z" fill="#9B5A5A"/><circle cx="0" cy="-196" r="34" fill="#EDBE96"/>
        <path d="M-36 -196 Q-40 -244 0 -242 Q40 -244 36 -196 Q30 -222 0 -222 Q-30 -222 -36 -196 Z" fill="#6B4A32"/></g>
      <g transform="translate(40 60) scale(.55)"><ellipse cx="0" cy="-40" rx="52" ry="42" fill="#9ED0E6"/><circle cx="0" cy="-98" r="36" fill="#F1C9A5"/></g></g></g>`;
}
// Figurita para la rejilla de 100 (cabeza y cuerpo). Origen: los pies.
export function figurita(id, x, y, s = 1) {
  return `<g id="${id}" transform="translate(${x} ${y}) scale(${s})" fill="#D5D9DD"><path d="M-14 0 L-11 -26 Q0 -32 11 -26 L14 0 Z"/><circle cx="0" cy="-36" r="9"/></g>`;
}
// Carrito de bebé. Origen: el suelo, en el centro.
export function carrito(id) {
  return `<g id="${id}"><path d="M-70 -70 H70 Q70 -10 0 -10 Q-70 -10 -70 -70 Z" fill="#6F8FA6"/><path d="M-70 -70 Q-70 -140 0 -140 V-70 Z" fill="#56738A"/>
    <path d="M70 -70 L100 -110" stroke="${C.tinta}" stroke-width="8" stroke-linecap="round"/><circle cx="-44" cy="0" r="16" fill="${C.tinta}"/><circle cx="44" cy="0" r="16" fill="${C.tinta}"/></g>`;
}
