// Piezas del barrio para el estilo «limpio»: bandera, mapa de España, comercios con gente
// trabajando (por fuera y por dentro), tablón de ofertas de empleo, rosquilla y barras.
// Todo dibujado con código. El contorno de España sale de Natural Earth (dominio público), ver mapa_espana.json.
// Los personajes son inventados. Ningún dibujo lleva cifras: las cifras van en las tarjetas.

import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { C, persona, paseante, lupa } from "./limpio.mjs";

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const MAPA = JSON.parse(readFileSync(path.join(AQUI, "mapa_espana.json"), "utf8"));
const texto = (x, y, t, tam, color, o = "") => `<text x="${x}" y="${y}" text-anchor="middle" font-family="Cap" font-weight="800" font-size="${tam}" fill="${color}" ${o}>${t}</text>`;

// ------------------------------------------------------------------ bandera
// Bandera de España (rojo y gualda, 1:2:1), sin escudo, como icono de las tarjetas.
export const ROJO_ES = "#AA151B", GUALDA = "#F1BF00";
export function bandera(alto = 40) {
  return `<svg width="${alto * 1.5}" height="${alto}" viewBox="0 0 30 20"><rect width="30" height="20" fill="${ROJO_ES}"/><rect y="5" width="30" height="10" fill="${GUALDA}"/></svg>`;
}

// ------------------------------------------------------------------ gente
export const ROPAS = {
  blanco: ["#F4F1EA", "#D9D4C8"], salvia: [C.salvia, "#5F7D61"], vino: ["#9B5A5A", "#7D4444"], mostaza: ["#C2A24E", "#9E8236"],
  lila: ["#8E7CA8", "#6F5F88"], mono: ["#5D7A8C", "#46606F"], gris: ["#8A9199", "#6D747C"], teja: ["#C98F6B", "#A8724F"],
};
export const PIELES = ["#EDBE96", "#D9A47E", "#C68A62", "#F1C9A5", "#B97E58"];
// Delantal (encima del cuerpo) y gorros sencillos.
export const DELANTAL = (col = "#FFFDF8") => `<path d="M-60 -330 H60 V-150 Q60 -128 38 -128 H-38 Q-60 -128 -60 -150 Z" fill="${col}"/><path d="M-60 -330 L-40 -372 M60 -330 L40 -372" stroke="${col}" stroke-width="10"/>`;
export const GORRO_BLANCO = `<path d="M-86 -540 Q-90 -606 0 -610 Q90 -606 86 -540 Z" fill="#FFFDF8"/><rect x="-92" y="-552" width="184" height="22" rx="10" fill="#EEE9DF"/>`;
export const GORRA = (col) => `<path d="M-92 -530 Q-92 -612 0 -612 Q92 -612 92 -530 Z" fill="${col}"/><path d="M40 -536 H140 Q150 -530 140 -524 H40 Z" fill="${col}"/>`;
// Herramientas para la mano.
export const CUCHILLO = `<g transform="rotate(-20)"><rect x="-6" y="-20" width="12" height="40" rx="5" fill="${C.madera}"/><path d="M-30 -84 H24 V-18 H-30 Z" fill="#D9DEE2" stroke="#9AA6AE" stroke-width="4"/></g>`;
export const LLAVE = `<g transform="rotate(30)"><rect x="-7" y="-90" width="14" height="110" rx="6" fill="#9AA6AE"/><path d="M-22 -100 a22 22 0 1 1 44 0 l-10 0 l0 14 l-24 0 l0 -14 Z" fill="#9AA6AE"/></g>`;
export const CAMISETA = (col) => `<path d="M-46 -40 L-20 -52 Q0 -42 20 -52 L46 -40 L56 -14 L36 -8 V36 H-36 V-8 L-56 -14 Z" fill="${col}"/>`;
export const TAZA_P = `<g transform="translate(10 -6)"><rect x="-15" y="-34" width="30" height="36" rx="6" fill="#FFFDF8" stroke="#D9DEE2" stroke-width="3"/><path d="M15 -26 q14 0 14 11 q0 11 -14 11" fill="none" stroke="#FFFDF8" stroke-width="5"/></g>`;

// ------------------------------------------------------------------ mapa de España
// Puntos repartidos dentro de la península (para las figuritas de «habitantes»). Deterministas.
function anillos(d) {
  return d.split("M").filter(Boolean).map((r) => r.replace("Z", "").split("L").map((p) => p.trim().split(/\s+/).map(Number)));
}
function dentro(x, y, poli) {
  let c = false;
  for (let i = 0, j = poli.length - 1; i < poli.length; j = i++) {
    const [xi, yi] = poli[i], [xj, yj] = poli[j];
    if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c;
  }
  return c;
}
function azar(a, b) { const x = Math.sin(a * 127.1 + b * 311.7) * 43758.5453; return x - Math.floor(x); }
const PUNTOS = (() => {
  const pen = anillos(MAPA.peninsula).sort((a, b) => b.length - a.length)[0];
  const pts = [], paso = 45;
  for (let y = 40; y < MAPA.alto - 20; y += paso * 0.87)
    for (let x = 30 + ((Math.round(y / (paso * 0.87)) % 2) * paso) / 2; x < MAPA.ancho - 30; x += paso) {
      const px = x + (azar(x, y) - 0.5) * 14, py = y + (azar(y, x) - 0.5) * 14;
      // margen: el icono (unos 30 px de alto) cabe entero dentro
      if ([[0, 0], [-12, 0], [12, 0], [0, -30], [0, 6]].every(([dx, dy]) => dentro(px + dx, py + dy, pen))) pts.push([px, py]);
    }
  return pts.map((p, i) => [p, azar(i, 7)]).sort((a, b) => a[1] - b[1]).map((x) => x[0]);
})();
export const MAX_FIGURITAS = PUNTOS.length;

// Una «foto» con el mapa de España y n figuritas (habitantes). Origen: centro de la foto.
// Canarias, en un recuadro abajo a la derecha (en el mar, al este de Murcia).
export function fotoMapa(id, n, pie, o = {}) {
  const W = 900, H = 790, s = 0.95, mx = -W / 2 + (W - MAPA.ancho * s) / 2, my = -H / 2 + 40;
  const can = MAPA.canarias, cs = 0.85, cx = MAPA.ancho - can.ancho * cs - 6, cy = MAPA.alto - can.alto * cs - 4;
  const figs = PUNTOS.slice(0, n).map(([x, y], k) => `<g id="${id}-f${k}" transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(.3)"><rect x="-30" y="-50" width="60" height="50" rx="22"/><circle cx="0" cy="-74" r="22"/></g>`).join("");
  return `<g id="${id}"><g id="${id}-in">
    <rect x="${-W / 2 + 10}" y="${-H / 2 + 16}" width="${W}" height="${H}" rx="14" fill="#3C2814" opacity=".14"/>
    <rect x="${-W / 2}" y="${-H / 2}" width="${W}" height="${H}" rx="14" fill="#FFFDF8"/>
    <rect x="${-W / 2 + 26}" y="${-H / 2 + 26}" width="${W - 52}" height="${H - 140}" rx="6" fill="${o.fondo ?? "#DCEAF0"}"/>
    <g transform="translate(${mx} ${my}) scale(${s})">
      <path d="${MAPA.peninsula}" fill="${C.ocreClaro}" stroke="${C.tinta}" stroke-width="4" stroke-linejoin="round"/>
      <g transform="translate(${cx} ${cy})"><rect x="-10" y="-10" width="${can.ancho * cs + 20}" height="${can.alto * cs + 20}" rx="8" fill="none" stroke="${C.grisClaro}" stroke-width="3"/>
        <g transform="scale(${cs})"><path d="${can.d}" fill="${C.ocreClaro}" stroke="${C.tinta}" stroke-width="4"/></g></g>
      <g fill="${o.color ?? C.tinta}">${figs}</g>
    </g>
    ${texto(0, H / 2 - 40, pie, 64, o.colorPie ?? C.tinta)}
  </g></g>`;
}

// ------------------------------------------------------------------ calle y comercios
// Fachada de un comercio, de x a x+520. El escaparate deja ver a quien trabaja dentro (contenido).
// tipo: abierto o cerrado (persiana bajada y «Se alquila»). La persiana tiene id «<id>-pers» (para subirla).
const ESCAP = { x: 36, y: 880, w: 330, h: 380 };
export function fachada(id, x, o) {
  const { nombre, pared, rotulo, toldo, dentro: interior = "", fondo = "#F6EEDF", cerrado = false } = o;
  const rayas = Array.from({ length: 13 }, (_, i) => `<rect x="${x + 10 + i * 40}" y="788" width="20" height="74" fill="${toldo}"/>`).join("");
  const ondas = Array.from({ length: 13 }, (_, i) => `<path d="M${x + 10 + i * 40} 860 q10 22 20 0" fill="${toldo}"/><path d="M${x + 30 + i * 40} 860 q10 22 20 0" fill="#FFFDF8"/>`).join("");
  const ventanas = [-580, -130, 320].map((y) => [0, 1].map((k) => `<rect x="${x + 70 + k * 220}" y="${y}" width="150" height="190" rx="10" fill="#A9C2CE"/><rect x="${x + 60 + k * 220}" y="${y + 188}" width="170" height="16" rx="6" fill="#FFFDF8" opacity=".7"/>`).join("")).join("");
  const lamas = Array.from({ length: 14 }, (_, i) => `<line x1="${x + 30}" x2="${x + 490}" y1="${900 + i * 28}" y2="${900 + i * 28}" stroke="#7E858C" stroke-width="5"/>`).join("");
  return `<g id="${id}">
    <rect x="${x}" y="-1400" width="520" height="2700" fill="${pared}"/><rect x="${x + 516}" y="-1400" width="8" height="2700" fill="#000" opacity=".06"/>
    ${ventanas}
    <rect x="${x + 22}" y="682" width="476" height="96" rx="12" fill="${rotulo}"/>
    ${texto(x + 260, 748, nombre, nombre.length > 9 ? 46 : 54, "#FFFDF8", 'letter-spacing="4"')}
    <rect x="${x + 10}" y="788" width="500" height="74" fill="#FFFDF8"/>${rayas}${ondas}
    <clipPath id="${id}-clip"><rect x="${x + ESCAP.x}" y="${ESCAP.y}" width="${ESCAP.w}" height="${ESCAP.h}" rx="8"/></clipPath>
    <rect x="${x + ESCAP.x}" y="${ESCAP.y}" width="${ESCAP.w}" height="${ESCAP.h}" rx="8" fill="${fondo}"/>
    <g clip-path="url(#${id}-clip)"><g transform="translate(${x + ESCAP.x} ${ESCAP.y})">${interior}</g></g>
    <rect x="${x + ESCAP.x}" y="${ESCAP.y}" width="${ESCAP.w}" height="${ESCAP.h}" rx="8" fill="#FFFFFF" opacity=".10"/>
    <path d="M${x + ESCAP.x + 30} ${ESCAP.y + 30} l70 -0 l-90 120 l0 -70 Z" fill="#FFFFFF" opacity=".25"/>
    <rect x="${x + ESCAP.x - 8}" y="${ESCAP.y - 8}" width="${ESCAP.w + 16}" height="${ESCAP.h + 16}" rx="12" fill="none" stroke="${C.tinta}" stroke-width="10" opacity=".75"/>
    <rect x="${x + 388}" y="900" width="104" height="400" rx="8" fill="${rotulo}" opacity=".85"/><rect x="${x + 402}" y="916" width="76" height="220" rx="6" fill="#CFE0E8"/>
    <circle cx="${x + 404}" cy="1170" r="8" fill="${C.marcador}"/>
    <clipPath id="${id}-pclip"><rect x="${x + 20}" y="870" width="480" height="430"/></clipPath>
    <g clip-path="url(#${id}-pclip)"><g id="${id}-pers" ${cerrado ? "" : 'style="display:none"'}><rect x="${x + 20}" y="870" width="480" height="430" fill="#A7ADB3"/>${lamas}
      ${cerrado ? `<g transform="translate(${x + 260} 1060) rotate(-4)"><rect x="-150" y="-60" width="300" height="120" rx="6" fill="#FFFDF8"/>${texto(0, -8, "SE ALQUILA", 44, C.rojo)}<rect x="-100" y="18" width="200" height="12" rx="6" fill="#C9CED3"/></g>` : ""}</g></g>
  </g>`;
}
// Acera común a la calle de comercios.
export function acera(x0 = -1200, ancho = 3600) {
  return `<rect x="${x0}" y="1292" width="${ancho}" height="14" fill="#BFB3A2"/><rect x="${x0}" y="1300" width="${ancho}" height="2200" fill="#D9D2C5"/>
    <path d="${Array.from({ length: Math.ceil(ancho / 260) }, (_, i) => `M${x0 + i * 260} 1300 L${x0 + i * 260 - 120} 2200`).join(" ")} M${x0} 1560 H${x0 + ancho}" stroke="#C7BEAF" stroke-width="5" opacity=".7"/>`;
}

// Contenido del escaparate (coordenadas del escaparate: 330 × 380, suelo en y = 380).
// Cada uno con su trabajador; el id del trabajador es <id>-t.
export const ESCAPARATE = {
  carniceria: (id) => `<rect x="0" y="0" width="330" height="380" fill="#EAF2F4"/>${Array.from({ length: 8 }, (_, i) => `<line x1="${i * 44}" x2="${i * 44}" y1="0" y2="380" stroke="#D3E2E8" stroke-width="3"/><line x1="0" x2="330" y1="${i * 44}" y2="${i * 44}" stroke="#D3E2E8" stroke-width="3"/>`).join("")}
    <g transform="translate(200 470) scale(.42)">${persona(id + "-t", "hoy", { ropa: ROPAS.blanco, encima: DELANTAL("#FFFDF8"), gorro: GORRO_BLANCO, piel: PIELES[2], piel2: "#B5784F", mano: CUCHILLO })}</g>
    <rect x="0" y="290" width="330" height="90" fill="#C9D3D8"/><rect x="0" y="282" width="330" height="14" fill="#AEB9BF"/>
    ${[40, 110, 180, 250].map((x) => `<ellipse cx="${x}" cy="318" rx="28" ry="15" fill="#D9776B"/><path d="M${x - 20} 314 q20 -10 40 0" stroke="#F6E1DA" stroke-width="5" fill="none"/>`).join("")}`,
  ropa: (id) => `<rect x="0" y="0" width="330" height="380" fill="#F6EEDF"/><rect x="20" y="70" width="290" height="8" rx="4" fill="${C.madera}"/>
    ${["#C98F6B", C.salvia, "#8E7CA8", "#C2A24E", "#6F8FA6"].map((c, i) => `<path d="M${46 + i * 58} 78 v16" stroke="#9AA6AE" stroke-width="4"/><g transform="translate(${46 + i * 58} 140) scale(.62)">${CAMISETA(c)}</g>`).join("")}
    <g transform="translate(150 470) scale(.42)">${persona(id + "-t", "hoy", { pelo: "largo", ropa: ROPAS.lila, piel: PIELES[3], colorPelo: "#6B4A32", mano: `<g transform="translate(-60 10)">${CAMISETA("#E9C46A")}</g>` })}</g>
    <rect x="0" y="300" width="330" height="80" fill="${C.maderaClara}"/><rect x="-10" y="292" width="350" height="16" rx="6" fill="${C.madera}"/>
    ${[0, 1, 2].map((k) => `<rect x="${200 + k * 6}" y="${270 - k * 14}" width="90" height="14" rx="4" fill="${["#6F8FA6", "#C98F6B", C.salvia][k]}"/>`).join("")}`,
  cafeteria: (id) => `<rect x="0" y="0" width="330" height="380" fill="#F3E3CC"/><rect x="20" y="40" width="160" height="110" rx="8" fill="#2F3B35"/>
    ${texto(100, 84, "CAFÉ", 30, "#FFFDF8")}${texto(100, 124, "TOSTADA", 22, "#E7C47A")}
    <g transform="translate(240 470) scale(.42)">${persona(id + "-t", "hoy", { ropa: ROPAS.vino, encima: DELANTAL("#3B2A20"), piel: PIELES[1], colorPelo: "#1E1410" })}</g>
    <rect x="0" y="300" width="330" height="80" fill="${C.madera}"/><rect x="-10" y="292" width="350" height="16" rx="6" fill="${C.maderaClara}"/>
    <rect x="30" y="226" width="110" height="68" rx="10" fill="#B8C0C6"/><rect x="44" y="238" width="82" height="20" rx="5" fill="#8A9399"/>`,
  taller: (id) => `<rect x="0" y="0" width="330" height="380" fill="#D6D9DB"/><rect x="0" y="330" width="330" height="50" fill="#9AA0A6"/>
    <g transform="translate(60 210)"><path d="M-40 60 Q-36 10 10 4 L60 -30 H170 L220 4 Q262 10 266 60 Z" fill="#6F8FA6"/><circle cx="20" cy="66" r="30" fill="${C.tinta}"/><circle cx="200" cy="66" r="30" fill="${C.tinta}"/>
      <path d="M70 -22 H120 V4 H50 Z M128 -22 H164 L198 4 H128 Z" fill="#CFE0E8"/></g>
    <g transform="translate(250 470) scale(.42)">${persona(id + "-t", "hoy", { ropa: ROPAS.mono, piel: PIELES[4], colorPelo: "#2A1E16", gorro: GORRA("#46606F"), mano: LLAVE })}</g>`,
};

// ------------------------------------------------------------------ interiores (plano completo)
// Coordenadas del mundo: encuadre 0-1080; el suelo está en y = 1300; la protagonista pisa en y = 1410.
function suelo(col = "#CFC6B8") { return `<rect x="-400" y="1300" width="1880" height="900" fill="${col}"/><rect x="-400" y="1292" width="1880" height="12" fill="#000" opacity=".08"/>`; }
// Rótulo en la pared, a la izquierda y justo debajo de la tarjeta (para que se lea).
function rotuloPared(x, y, t, col) { return `<rect x="${x - 200}" y="${y - 54}" width="400" height="88" rx="14" fill="${col}"/>${texto(x, y + 6, t, 46, "#FFFDF8", 'letter-spacing="3"')}`; }

export function interiorCarniceria(id) {
  const azulejos = Array.from({ length: 40 }, (_, i) => `<line x1="${-400 + i * 70}" x2="${-400 + i * 70}" y1="-300" y2="1300" stroke="#D3E2E8" stroke-width="4"/><line x1="-400" x2="1480" y1="${-300 + i * 70}" y2="${-300 + i * 70}" stroke="#D3E2E8" stroke-width="4"/>`).join("");
  const chorizo = (x) => `<path d="M${x} 690 q-34 60 0 130 q34 60 0 120" fill="none" stroke="#9E3B2C" stroke-width="30" stroke-linecap="round"/><line x1="${x}" y1="660" x2="${x}" y2="690" stroke="#6B4A32" stroke-width="5"/>`;
  const jamon = (x) => `<g transform="translate(${x} 660)"><line x1="0" y1="0" x2="0" y2="40" stroke="#6B4A32" stroke-width="5"/><path d="M-10 40 h20 l14 40 q60 120 10 230 q-34 50 -68 0 q-50 -110 10 -230 Z" fill="#A85A3E"/><path d="M-10 40 h20 l10 30 h-40 Z" fill="#E9D7B0"/></g>`;
  return `<g id="${id}"><rect x="-400" y="-300" width="1880" height="1600" fill="#EAF2F4"/>${azulejos}${suelo()}
    ${rotuloPared(240, 770, "CARNICERÍA", "#7D4444")}
    <rect x="470" y="652" width="620" height="12" rx="6" fill="#8A9399"/>${chorizo(520)}${chorizo(590)}${jamon(900)}${chorizo(1010)}
    <g id="${id}-t" transform="translate(720 1300) scale(.8)">${persona(id + "-tp", "hoy", { ropa: ROPAS.blanco, encima: DELANTAL("#FFFDF8"), gorro: GORRO_BLANCO, piel: PIELES[2], piel2: "#B5784F", mano: CUCHILLO })}</g>
    <rect x="430" y="1060" width="740" height="250" fill="#C9D3D8"/><rect x="430" y="1040" width="740" height="26" rx="8" fill="#AEB9BF"/>
    <rect x="450" y="1086" width="700" height="110" rx="10" fill="#DCEFF5" opacity=".9"/>
    ${[520, 640, 760, 880, 1000].map((x, i) => `<ellipse cx="${x}" cy="1160" rx="48" ry="24" fill="${i % 2 ? "#D9776B" : "#C9604F"}"/><path d="M${x - 34} 1154 q34 -16 68 0" stroke="#F6E1DA" stroke-width="7" fill="none"/>`).join("")}
  </g>`;
}
export function interiorCafeteria(id) {
  return `<g id="${id}"><rect x="-400" y="-300" width="1880" height="1600" fill="#F3E3CC"/>${suelo("#C9B79A")}
    ${rotuloPared(240, 770, "CAFETERÍA", "#2F3B35")}
    <rect x="500" y="772" width="340" height="12" rx="6" fill="${C.madera}"/>${[540, 600, 660, 720, 780].map((x) => `<rect x="${x - 20}" y="732" width="40" height="40" rx="8" fill="#FFFDF8" stroke="#D9DEE2" stroke-width="3"/>`).join("")}
    <g id="${id}-t" transform="translate(800 1300) scale(.8)">${persona(id + "-tp", "hoy", { ropa: ROPAS.vino, encima: DELANTAL("#3B2A20"), piel: PIELES[1], colorPelo: "#1E1410", mano: TAZA_P })}</g>
    <rect x="560" y="900" width="200" height="170" rx="18" fill="#B8C0C6"/><rect x="580" y="920" width="160" height="44" rx="8" fill="#8A9399"/>
    <rect x="600" y="1000" width="22" height="40" fill="#5B6470"/><rect x="698" y="1000" width="22" height="40" fill="#5B6470"/>
    <g id="${id}-vapor" fill="#FFFFFF">${[0, 1, 2].map((k) => `<circle id="${id}-v${k}" cx="611" cy="980" r="16" opacity=".8"/>`).join("")}</g>
    <rect x="420" y="1070" width="900" height="240" fill="${C.madera}"/><rect x="400" y="1050" width="940" height="30" rx="10" fill="${C.maderaClara}"/>
  </g>`;
}
export function interiorOficina(id) {
  const mesa = (x, k) => `<g id="${id}-m${k}"><g transform="translate(${x} 1300) scale(.74)">${persona(`${id}-p${k}`, "hoy", { pelo: k ? "corto" : "largo", ropa: k ? ROPAS.teja : ROPAS.salvia, piel: PIELES[k ? 4 : 0], colorPelo: k ? "#2A1E16" : "#6B4A32" })}</g>
    <rect x="${x - 150}" y="1040" width="190" height="130" rx="12" fill="${C.tinta}"/><rect x="${x - 140}" y="1050" width="170" height="104" rx="6" fill="#8FC1E3"/>
    <rect x="${x - 70}" y="1170" width="30" height="40" fill="${C.tinta}"/>
    <rect x="${x - 230}" y="1200" width="420" height="24" rx="8" fill="${C.maderaClara}"/><rect x="${x - 210}" y="1222" width="380" height="90" fill="${C.madera}"/></g>`;
  return `<g id="${id}"><rect x="-400" y="-300" width="1880" height="1600" fill="#EEF0EC"/>${suelo("#BFC4C0")}
    ${rotuloPared(240, 770, "VIAJES", "#1F5F8B")}
    <g transform="translate(470 680) scale(.8)"><rect width="220" height="300" rx="10" fill="#FFFDF8"/><rect x="14" y="14" width="192" height="200" fill="#9ED0E6"/><circle cx="150" cy="70" r="30" fill="${C.marcador}"/>
      <path d="M14 160 q48 -30 96 0 q48 30 96 0 V214 H14 Z" fill="#E7C47A"/><rect x="40" y="236" width="140" height="16" rx="8" fill="#C9CED3"/></g>
    <g transform="translate(900 640) scale(.72)"><rect width="220" height="300" rx="10" fill="#FFFDF8"/><rect x="14" y="14" width="192" height="200" fill="#C7DDE8"/>
      <path d="M40 130 L170 90 L184 98 L120 130 L150 170 L138 172 L100 138 L60 150 Z" fill="${C.tinta}"/><rect x="40" y="236" width="140" height="16" rx="8" fill="#C9CED3"/></g>
    ${mesa(330, 0)}${mesa(830, 1)}
  </g>`;
}
export function interiorTaller(id) {
  const herr = [0, 1, 2, 3].map((k) => `<g transform="translate(${680 + k * 90} 740)">${k % 2 ? `<rect x="-8" y="-60" width="16" height="120" rx="6" fill="${C.gris}"/><rect x="-30" y="-70" width="60" height="26" rx="6" fill="${C.gris}"/>` : `<g transform="scale(1.1)">${LLAVE}</g>`}</g>`).join("");
  return `<g id="${id}"><rect x="-400" y="-300" width="1880" height="1600" fill="#D6D9DB"/>${suelo("#9AA0A6")}
    ${rotuloPared(240, 770, "TALLER", "#46606F")}
    <rect x="620" y="640" width="400" height="200" rx="10" fill="#B8BEC3"/>${herr}
    <rect x="560" y="1076" width="440" height="22" rx="6" fill="#5B6470"/><rect x="760" y="1096" width="40" height="210" fill="#5B6470"/>
    <g transform="translate(560 900)"><path d="M-60 120 Q-54 50 10 40 L90 -10 H260 L340 40 Q404 50 410 120 Z" fill="#6F8FA6"/>
      <path d="M100 0 H170 V40 H70 Z M180 0 H240 L300 40 H180 Z" fill="#CFE0E8"/><circle cx="30" cy="130" r="46" fill="${C.tinta}"/><circle cx="30" cy="130" r="18" fill="#9AA6AE"/>
      <circle cx="320" cy="130" r="46" fill="${C.tinta}"/><circle cx="320" cy="130" r="18" fill="#9AA6AE"/></g>
    <g id="${id}-t" transform="translate(470 1410) scale(.8)">${persona(id + "-tp", "hoy", { ropa: ROPAS.mono, piel: PIELES[4], colorPelo: "#2A1E16", gorro: GORRA("#46606F"), mano: LLAVE })}</g>
  </g>`;
}

// ------------------------------------------------------------------ tablón de ofertas de empleo
// Tablón en la pared de la calle. La gente que mira se dibuja aparte (paseantes de pie).
export function tablon(id) {
  const papeles = [[60, 120, -3], [210, 110, 2], [360, 124, -2], [90, 280, 2], [250, 270, -2], [400, 286, 3]]
    .map(([x, y, r]) => `<g transform="translate(${x} ${y}) rotate(${r})"><rect x="-56" y="-62" width="112" height="124" rx="4" fill="#FFFDF8"/><circle cx="0" cy="-52" r="7" fill="${C.rojo}"/>
      <rect x="-40" y="-30" width="80" height="10" rx="5" fill="${C.tinta}"/><rect x="-40" y="-8" width="66" height="8" rx="4" fill="#C9CED3"/><rect x="-40" y="10" width="74" height="8" rx="4" fill="#C9CED3"/><rect x="-40" y="28" width="52" height="8" rx="4" fill="#C9CED3"/></g>`).join("");
  return `<g id="${id}"><rect x="-400" y="-300" width="1880" height="1600" fill="#E3CDB0"/>
    ${[0, 1, 2, 3].map((k) => `<rect x="${-200 + k * 380}" y="260" width="170" height="210" rx="10" fill="#A9C2CE"/>`).join("")}
    <g transform="translate(300 690)"><rect x="-14" y="-14" width="508" height="440" rx="16" fill="${C.madera}"/><rect width="480" height="412" rx="8" fill="#C9A26B"/>
      <rect x="0" y="0" width="480" height="70" rx="8" fill="${C.tinta}"/>${texto(240, 48, "OFERTAS DE EMPLEO", 36, "#FFFDF8", 'letter-spacing="2"')}
      <g transform="translate(0 40)">${papeles}</g></g>
    ${acera()}
  </g>`;
}
// n personas de espaldas mirando el tablón, en fila (la primera con lupa).
export function colaParo(id, n) {
  let s = "";
  for (let k = n - 1; k >= 0; k--) s += paseante(`${id}-q${k}`, ["#8A9199", "#9B8E7E", "#7F8C94", "#A3907B", "#8E8A9A", "#998F80"][k % 6], PIELES[(k * 2) % 5], 1.4);
  return s + lupa(`${id}-lupa`, 1.6);
}

// ------------------------------------------------------------------ gráficos
// Rosquilla «de cada 100». Centro (cx, cy), radio r, grosor w. ids: -arco, -fant (marca del año de antes), -num.
export function rosquilla(id, cx, cy, r, w, color) {
  const L = 2 * Math.PI * r;
  return `<g id="${id}"><circle cx="${cx}" cy="${cy + 12}" r="${r + w / 2 + 10}" fill="#3C2814" opacity=".10"/>
    <circle cx="${cx}" cy="${cy}" r="${r + w / 2 + 10}" fill="#FFFDF8"/>
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#E6DFD2" stroke-width="${w}"/>
    <circle id="${id}-arco" cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${color}" stroke-width="${w}" stroke-dasharray="0 ${L.toFixed(1)}" transform="rotate(-90 ${cx} ${cy})"/>
    <g id="${id}-fant" style="display:none"><line x1="${cx}" y1="${cy - r - w / 2 - 22}" x2="${cx}" y2="${cy - r + w / 2 + 8}" stroke="${C.tinta}" stroke-width="8" stroke-linecap="round"/></g>
    <text id="${id}-num" x="${cx}" y="${cy + 46}" text-anchor="middle" font-family="Cap" font-weight="800" font-size="168" fill="${color}"></text>
    <text x="${cx}" y="${cy + 104}" text-anchor="middle" font-family="Cap" font-weight="800" font-size="40" fill="${C.gris}">trabajan</text></g>`;
}
export const LONG_ROSQUILLA = (r) => 2 * Math.PI * r;
