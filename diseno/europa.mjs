// Decorados y objetos de T26 (¿somos más ricos o más pobres que los europeos?; Bruno, 24-11-2026):
//   · llegadas: la sala de llegadas de un aeropuerto en Navidad, en perspectiva: cristalera al fondo con un avión en la
//     pista, panel de llegadas con ciudades de Europa y su estado (sin horas ni números), guirnalda, un árbol de
//     Navidad, barandilla de espera y un carrito de maletas en primer plano («ll-fg»). Prefijo para vidaFondo: «ll».
//     Los personajes pisan en y = 1440 (escena entera) o en y = 1700 (en las esquinas).
// Objetos: banderas sencillas, barras de tamaño de la economía, la fila de los 27 países con España encendida y barras por
// país de 2007 (fantasma) y de hoy (llena), con la línea de la media de la UE.

import { C } from "./limpio.mjs";

const X0 = -400, ANCHO = 1900, VX = 540, VY = 720;
const txt = (x, y, t, tam, color, o = "", ancla = "middle") => `<text x="${x}" y="${y}" text-anchor="${ancla}" font-family="Cap" font-weight="800" font-size="${tam}" fill="${color}" ${o}>${t}</text>`;
const enX = (x0, y0, x) => VY + (y0 - VY) * (x - VX) / (x0 - VX);
const ROJO = "#B3261E", OCRE = "#C8902E", GRIS = "#C9CED3";

// Banderas sencillas (rectángulo de w × h, origen arriba a la izquierda).
export function bandera(pais, w = 60, h = 40) {
  const v = (cs) => cs.map((c, i) => `<rect x="${i * w / 3}" y="0" width="${w / 3 + 0.5}" height="${h}" fill="${c}"/>`).join("");
  const hz = (cs, p = [1, 1, 1]) => { const t = p.reduce((a, b) => a + b, 0); let y = 0; return cs.map((c, i) => { const r = `<rect x="0" y="${y}" width="${w}" height="${h * p[i] / t + 0.5}" fill="${c}"/>`; y += h * p[i] / t; return r; }).join(""); };
  const cuerpo = {
    ES: hz(["#AA151B", "#F1BF00", "#AA151B"], [1, 2, 1]), DE: hz(["#1E1E1E", "#DD0000", "#FFCE00"]), FR: v(["#0055A4", "#FFFFFF", "#EF4135"]),
    IT: v(["#009246", "#FFFFFF", "#CE2B37"]), PL: hz(["#FFFFFF", "#DC143C"], [1, 1]), PT: `<rect width="${w * 0.4}" height="${h}" fill="#046A38"/><rect x="${w * 0.4}" width="${w * 0.6}" height="${h}" fill="#DA291C"/><circle cx="${w * 0.4}" cy="${h / 2}" r="${h * 0.22}" fill="#FFE900"/>`,
    CZ: `${hz(["#FFFFFF", "#D7141A"], [1, 1])}<path d="M0 0 L${w * 0.5} ${h / 2} L0 ${h} Z" fill="#11457E"/>`,
  }[pais] ?? `<rect width="${w}" height="${h}" fill="${GRIS}"/>`;
  return `<g><rect x="-2" y="-2" width="${w + 4}" height="${h + 4}" rx="4" fill="#FFFFFF" stroke="#D9DEE2" stroke-width="2"/>${cuerpo}</g>`;
}

// ------------------------------------------------------------------ la sala de llegadas
function llegadas() {
  const yIzqT = enX(140, 440, X0), yIzqS = enX(140, 1060, X0), yDerT = enX(940, 440, X0 + ANCHO), yDerS = enX(940, 1060, X0 + ANCHO);
  const baldosas = Array.from({ length: 13 }, (_, i) => { const xb = 160 + i * 64; return `<line x1="${xb}" y1="1060" x2="${(VX + (xb - VX) * 4.2).toFixed(0)}" y2="2300" stroke="#C9CED3" stroke-width="3" opacity=".6"/>`; }).join("");
  const juntas = [1100, 1170, 1270, 1420, 1650, 1990].map((y) => `<line x1="${X0}" y1="${y}" x2="${X0 + ANCHO}" y2="${y}" stroke="#C9CED3" stroke-width="3" opacity=".5"/>`).join("");
  const avion = `<g transform="translate(700 860) scale(.9)"><path d="M-220 0 Q-200 -40 -120 -44 H160 Q220 -40 240 -10 Q230 6 160 10 H-160 Q-210 10 -220 0 Z" fill="#F4F6F8"/>
    <path d="M-160 -40 L-190 -110 H-150 L-100 -42 Z" fill="#2F6F6A"/><path d="M-20 -6 L-90 60 H-50 L60 -4 Z" fill="#DDE2E6"/>
    ${Array.from({ length: 9 }, (_, i) => `<circle cx="${-80 + i * 26}" cy="-24" r="6" fill="#5B6470"/>`).join("")}</g>`;
  const filas = [["MÚNICH", "LLEGADO"], ["PARÍS", "LLEGADO"], ["VARSOVIA", "EN HORA"], ["PRAGA", "EN HORA"], ["LISBOA", "RETRASADO"], ["ROMA", "EN HORA"]];
  const panel = `<g transform="translate(-60 500) scale(.92)"><rect x="0" y="0" width="330" height="330" rx="12" fill="#1E2A30"/>
    <rect x="0" y="0" width="330" height="54" rx="12" fill="#2F6F6A"/><rect x="0" y="40" width="330" height="14" fill="#2F6F6A"/>${txt(165, 38, "LLEGADAS", 30, "#FFFFFF")}
    ${filas.map(([c, e], i) => `${txt(18, 96 + i * 44, c, 24, "#F4E3A1", "", "start")}${txt(312, 96 + i * 44, e, 18, e === "RETRASADO" ? "#F28B82" : "#8FE3A8", "", "end")}`).join("")}</g>`;
  const guirnalda = `<path d="M140 450 Q340 500 540 450 Q740 500 940 450" fill="none" stroke="#3F7A4A" stroke-width="16"/>` +
    [200, 290, 390, 480, 600, 690, 790, 880].map((x, i) => `<circle cx="${x}" cy="${470 + (i % 2) * 12}" r="12" fill="${[ROJO, OCRE, "#F4F1EA"][i % 3]}"/>`).join("");
  const arbol = `<g transform="translate(1180 1150)"><rect x="-16" y="-60" width="32" height="60" fill="#8E6644"/>
    <path d="M0 -420 L130 -60 H-130 Z" fill="#3F7A4A"/><path d="M0 -420 L100 -200 H-100 Z" fill="#4F8A5A"/>
    ${[[-50, -140, ROJO], [40, -230, OCRE], [-20, -300, "#4F86B8"], [70, -110, OCRE], [-80, -90, "#4F86B8"]].map(([x, y, c]) => `<circle cx="${x}" cy="${y}" r="14" fill="${c}"/>`).join("")}
    <path d="M0 -450 l10 22 h24 l-19 14 l7 23 l-22 -14 l-22 14 l7 -23 l-19 -14 h24 Z" fill="#F1BF00"/></g>`;
  return `<rect x="${X0}" y="-400" width="${ANCHO}" height="2700" fill="#E6EAEE"/>
    <path d="M${X0} -400 H${X0 + ANCHO} V${yDerT} L940 440 H140 L${X0} ${yIzqT} Z" fill="#F2F4F6"/>
    <!-- cristalera al fondo con la pista y un avión -->
    <rect x="140" y="440" width="800" height="620" fill="#CFE3EE"/>
    <rect x="140" y="860" width="800" height="200" fill="#9AA6AE"/><rect x="140" y="930" width="800" height="10" fill="#F4F1EA" opacity=".7"/>
    ${avion}
    ${[140, 340, 540, 740, 940].map((x) => `<rect x="${x - 8}" y="440" width="16" height="620" fill="#5B6470"/>`).join("")}<rect x="140" y="760" width="800" height="10" fill="#5B6470"/>
    ${guirnalda}
    <!-- paredes laterales -->
    <path d="M${X0} ${yIzqT} L140 440 L140 1060 L${X0} ${yIzqS} Z" fill="#DDE2E6"/>
    <path d="M940 440 L${X0 + ANCHO} ${yDerT} L${X0 + ANCHO} ${yDerS} L940 1060 Z" fill="#D6DBDF"/>
    ${panel}
    <!-- suelo brillante -->
    <path d="M${X0} ${yIzqS} L140 1060 H940 L${X0 + ANCHO} ${yDerS} V2300 H${X0} Z" fill="#E3E6E8"/>${baldosas}${juntas}
    <ellipse cx="540" cy="1300" rx="420" ry="60" fill="#FFFFFF" opacity=".35"/>
    <!-- barandilla de espera -->
    <g opacity=".9">${[-60, 200, 880, 1140].map((x) => `<rect x="${x - 8}" y="1080" width="16" height="110" fill="#9AA6AE"/>`).join("")}
      <rect x="-80" y="1080" width="300" height="12" rx="6" fill="#B9C2C8"/><rect x="860" y="1080" width="300" height="12" rx="6" fill="#B9C2C8"/></g>
    ${arbol}
    <!-- primer plano: un carrito de maletas -->
    <g id="ll-fg"><g transform="translate(1120 2010)"><rect x="-150" y="-60" width="300" height="20" rx="8" fill="#7C8790"/>
      <rect x="-130" y="-240" width="160" height="180" rx="18" fill="#7C5C8E"/><rect x="40" y="-200" width="110" height="140" rx="14" fill="#C8902E"/>
      <circle cx="-110" cy="-20" r="20" fill="#2B2F33"/><circle cx="110" cy="-20" r="20" fill="#2B2F33"/></g></g>`;
}

export const DECORADOS_T26 = { llegadas };

// ------------------------------------------------------------------ objetos
// Tamaño de la economía: cuatro barras verticales proporcionales (sin cifras), con su bandera y el nombre; la de España
// en rojo con «4.ª» encima («<id>-b<i>», crecen desde abajo). Origen: centro de la base.
export function tamanoEconomia(id, paises) {
  const max = Math.max(...paises.map((p) => p.valor)), H = 400, paso = 170;
  return `<g id="${id}"><rect x="-380" y="${-H - 150}" width="760" height="${H + 280}" rx="24" fill="#FFFDF8" opacity=".95"/>
    ${paises.map((p, i) => { const x = -255 + i * paso, h = p.valor / max * H, es = p.pais === "ES";
      return `<rect id="${id}-b${i}" x="${x - 55}" y="${-h}" width="110" height="${h}" rx="12" fill="${es ? ROJO : "#8C969C"}" style="transform-box:fill-box;transform-origin:50% 100%"/>
        <g transform="translate(${x - 30} 20)">${bandera(p.pais)}</g>${txt(x, 100, p.nombre, 30, C.tinta)}
        ${es ? `<g id="${id}-c">${txt(x, -h - 24, "4.ª", 56, ROJO)}</g>` : ""}`; }).join("")}</g>`;
}

// La fila de los 27 países de la UE (casillas sin nombre, de más a menos riqueza por persona) con España encendida en
// su puesto y una flecha «España» encima («<id>-es», «<id>-f»). Origen: centro.
export function fila27(id, puesto) {
  const paso = 30, x0 = -13 * paso;
  return `<g id="${id}"><rect x="-440" y="-170" width="880" height="300" rx="24" fill="#FFFDF8" opacity=".95"/>
    ${txt(x0 - 14, 90, "más rico", 26, "#5B6470", "", "start")}${txt(-x0 + 14, 90, "menos rico", 26, "#5B6470", "", "end")}
    ${Array.from({ length: 27 }, (_, i) => { const x = x0 + i * paso, es = i === puesto - 1;
      return es ? `<g id="${id}-es"><g transform="translate(${x - 13} -20)">${bandera("ES", 26, 40)}</g></g>` : `<rect x="${x - 12}" y="-18" width="24" height="36" rx="5" fill="${GRIS}"/>`; }).join("")}
    <g id="${id}-f"><path d="M${x0 + (puesto - 1) * paso} -40 l-18 -30 h36 Z" fill="${ROJO}"/>${txt(x0 + (puesto - 1) * paso, -84, `España: puesto ${puesto}`, 36, ROJO)}</g></g>`;
}

// Barras por país: la de 2007, fina y en gris («<id>-g<i>»), y la de hoy, gruesa y de color («<id>-b<i>», crece desde la
// izquierda), con sus valores («<id>-vg<i>», «<id>-v<i>») y la línea vertical de la media de la UE (= 100). Origen: centro.
export function barrasPaises(id, filas, o = {}) {
  const W = o.W ?? 430, max = o.max ?? 125, paso = 118, X = -150, n = filas.length, y0 = -(n - 1) * paso / 2;
  const xm = X + 100 / max * W;
  return `<g id="${id}"><rect x="-430" y="${y0 - 110}" width="860" height="${n * paso + 130}" rx="24" fill="#FFFDF8" opacity=".95"/>
    ${filas.map((f, i) => { const y = y0 + i * paso, wa = f.antes / max * W, wb = f.hoy / max * W, col = f.color ?? OCRE;
      return `<g transform="translate(0 ${y})"><g transform="translate(-400 -26)">${bandera(f.pais, 54, 36)}</g>${txt(-336, 2, f.nombre, 30, C.tinta, "", "start")}
        <rect id="${id}-g${i}" x="${X}" y="-40" width="${wa.toFixed(1)}" height="22" rx="8" fill="${GRIS}"/>
        <g id="${id}-vg${i}">${txt(X + wa + 10, -21, `${f.antes} (2007)`, 22, "#8C969C", "", "start")}</g>
        <rect id="${id}-b${i}" x="${X}" y="-10" width="${wb.toFixed(1)}" height="44" rx="10" fill="${col}" style="transform-box:fill-box;transform-origin:0 50%"/>
        <g id="${id}-v${i}">${txt(X + wb + 12, 26, String(f.hoy), 38, col, "", "start")}</g></g>`; }).join("")}
    <line x1="${xm.toFixed(1)}" y1="${y0 - 80}" x2="${xm.toFixed(1)}" y2="${y0 + (n - 1) * paso + 50}" stroke="${C.tinta}" stroke-width="4" stroke-dasharray="12 10"/>
    ${txt(xm, y0 - 86, "media UE = 100", 24, C.tinta)}</g>`;
}
