// Escenas de T15 («¿Cuántas horas trabajas para la cena de Nochebuena?») en estilo «limpio».
// Bruno, 22 y 23-11-2026: la cena en casa en horas de trabajo, 2016 frente a hoy, con su lista de comidas de Navidad; tono y
// forma de T17 (aprobado): de calle, irónico, pocas cifras y grandes, cambio de escenario y un chiste que vuelve.
// v3 (Bruno, 23-11-2026): la abuela pasa a abuelo (su voz sonaba joven), la madre ya no lleva nada en la mano, el plato
// principal (la pierna de cordero) sustituye a los turrones con sus euros de 2016 y de hoy y su subida, y el mapa final es
// más grande, con la subida de cada plato debajo.
//   · «madre»: unos 45, pone la cena este año, jersey verde (voz «medica»).
//   · «abuelo»: unos 75, canas, calva, bigote blanco, gafas y rebeca marrón, «en mis tiempos…» (voz «padre»).
//   · «tendero»: unos 45, el del mercado, delantal y bigote (voz «profesora»).
// Decorados: el mercado de diseno/navidad.mjs y el salón de T17 (diseno/carnet.mjs) con el árbol.
/* eslint-disable no-undef */

import { persona, tarjeta, selloOficial } from "../../diseno/limpio.mjs";
import { bandera, DELANTAL } from "../../diseno/barrio.mjs";
import { ambientes } from "../../diseno/sueno.mjs";
import { relojCocina } from "../../diseno/desayuno.mjs";
import { DECORADOS_T17 } from "../../diseno/carnet.mjs";
import { DECORADOS_T15, mostradorPescado, mostradorCarne, arbol, mesaNochebuena, juguetes, NARANJA_MANO, mapaPlatos } from "../../diseno/navidad.mjs";

export const ESTILO = "limpio";
const F = "Cálculo propio · INE (Presupuestos Familiares y Estructura Salarial)";
const F_EPF = "Cálculo propio · INE (Encuesta de Presupuestos Familiares)";
const F_IPC = "Cálculo propio · INE (IPC y Estructura Salarial)";
const F_MAPA = "Cálculo propio · INE (Presupuestos Familiares e IPC)";

// Redondeo «del banquero», el mismo que usa el verificador (Python): 132,5 → 132, como dice el guion.
const rnd = (v) => { const f = Math.floor(v), d = v - f; return Math.abs(d - 0.5) < 1e-9 ? (f % 2 === 0 ? f : f + 1) : Math.round(v); };

export function datos(d) {
  const p = d.platos, c = d.cena;
  return { marisco: [p.marisco.minutos["2016"], p.marisco.minutos["2025"]], cordero: [p.cordero.minutos["2016"], p.cordero.minutos["2025"]],
           corderoEur: [p.cordero.eur["2016"], p.cordero.eur["2025"]], corderoSube: p.cordero.precio_sube_pct,
           cena: c.minutos, h: c.h, m: c.m, juguetes: d.relativos.juguetes, hora: d.sueldo.neto_hora_mediana, sube: d.sueldo.mediana_sube_pct,
           mapa: Object.fromEntries(Object.entries(d.mapa_subida_precio_pct).map(([k, v]) => [k, rnd(v.sube_pct)])) };
}

export const capas = () => ambientes({ ...DECORADOS_T15, salon: DECORADOS_T17.salon });

// ------------------------------------------------------------------ personajes (inventados), con volumen
// El abuelo: rebeca con botones, coronilla calva y gafas (encima de la cara, debajo de los ojos, que siguen parpadeando).
const REBECA = `<path d="M0 -374 V-172" stroke="#5A4128" stroke-width="6"/>${[-336, -290, -244, -198].map((y) => `<circle cx="13" cy="${y}" r="7" fill="#EFE8D8"/>`).join("")}`;
const CALVA_GAFAS = `<ellipse cx="0" cy="-552" rx="56" ry="30" fill="#EBC3A0"/><ellipse cx="-16" cy="-560" rx="20" ry="9" fill="#FFFFFF" opacity=".22"/>
  <g fill="none" stroke="#4A4038" stroke-width="5"><circle cx="-34" cy="-487" r="25"/><circle cx="34" cy="-487" r="25"/><path d="M-9 -492 Q0 -499 9 -492"/><path d="M-59 -492 L-92 -500 M59 -492 L92 -500"/></g>`;
const MADRE = { pelo: "largo", canas: false, barba: false, colorPelo: "#4A2E20", ropa: ["#5E7F5A", "#4C6A49"], piel: "#F2CBA8", volumen: true };
const ABUELO = { pelo: "corto", canas: false, barba: false, bigote: true, colorPelo: "#CFCAC0", colorBigote: "#ECE8E0", ropa: ["#8A6A48", "#6E5236"],
                 piel: "#EBC3A0", piel2: "#D8AE8C", volumen: true, encima: REBECA, gorro: CALVA_GAFAS };
const TENDERO = { pelo: "corto", canas: false, barba: true, bigote: true, colorPelo: "#2B1D14", ropa: ["#FFFDF8", "#E9E2D5"], piel: "#DDAE86", piel2: "#C99A72", volumen: true, encima: DELANTAL("#3E8E8A") };
const QUIEN = { m: MADRE, a: ABUELO, t: TENDERO };
const gente = (n, quien, manos = {}) => quien.split("").map((k) => persona(`${n}-${k}`, "hoy", { ...QUIEN[k], mano: manos[k] ? `<g id="${n}-${k}-mano">${manos[k]}</g>` : undefined })).join("");

// ------------------------------------------------------------------ piezas
const HOY = "#B3261E";
const rot = (x, y, t, tam, color, id = "", ancla = "middle") => `<text ${id ? `id="${id}"` : ""} x="${x}" y="${y}" text-anchor="${ancla}" font-family="Cap" font-weight="800" font-size="${tam}" fill="${color}">${t}</text>`;
const es = (v, d = 1) => v.toFixed(d).replace(".", ",");
const vs = (n, vals, labs, tam = 92) => `<div class="vs">${vals.map((v, i) => `<div class="col"><div class="v ${i ? "t-hoy" : "t-pasado"}" id="c${n}-${"ab"[i]}" style="font-size:${tam}px">${v}</div><div class="n">${labs[i]}</div></div>`).join("")}</div>`;
const cita = (n, quien, html) => tarjeta(n, quien, `<div class="tit" style="font-size:64px">${html}</div>`, { tono: "hoy" });
const grande = (n, cifra, sub, nota, fuente) => tarjeta(n, sub.titulo, `<div class="tit" style="font-size:110px;color:${HOY};line-height:1" id="c${n}-a">${cifra}</div>
  <div class="sub" id="c${n}-b" style="font-size:44px">${sub.texto}</div>${nota ? `<div class="nota">${nota}</div>` : ""}`, { fuente, icono: bandera(44) });

// La báscula del puesto con la pierna de cordero encima y el precio en la pantalla (se enciende al decirlo).
const bascula = (id, precio) => `<g id="${id}"><rect x="-130" y="-26" width="260" height="46" rx="12" fill="#C9CED3"/><rect x="-118" y="-44" width="236" height="20" rx="9" fill="#E9EDF0"/>
  <g transform="translate(-6 -78) rotate(-5)"><path d="M-96 0 Q-110 -52 -36 -60 Q52 -66 82 -14 Q84 26 30 28 L-62 24 Q-92 22 -96 0 Z" fill="#C9744F"/>
    <path d="M-70 -30 Q-10 -50 50 -24" fill="none" stroke="#E9A07A" stroke-width="10" stroke-linecap="round"/><rect x="78" y="-20" width="46" height="22" rx="11" fill="#F4F1EA"/></g>
  <g transform="translate(0 46)"><rect x="-122" y="-22" width="244" height="70" rx="12" fill="#26332B"/>
    <g id="${id}-pr" opacity="0">${rot(0, 28, precio, 50, "#9BE37A")}</g></g></g>`;

export function escenas(D) {
  const mapa = (id, y) => `<g transform="translate(540 ${y})">${mapaPlatos(id, 1.2, D.mapa, ["Bajo cada plato, lo", "que sube el precio", "de su ingrediente", "principal (2016-2025)", `El sueldo: +${rnd(D.sube)}\u00A0%`])}</g>`;
  return [
    // 1 · Mercado. La madre llega con el abuelo, con las manos libres: «¿Cuántas horas de curro te cuesta la cena de Nochebuena? Este año la pongo yo… qué ilusión. O no.»
    { n: 1, set: "vacio",
      svg: `${gente("s1", "a")}${gente("s1", "m")}${selloOficial("s1-sello")}`,
      tarjeta: tarjeta(1, "Navidad · 2016, 2019 y hoy", `<div class="tit" style="font-size:62px">¿Cuántas <mark id="m1">horas</mark> cuesta la cena de Nochebuena?</div>`, { icono: bandera(44) }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("mercado", null, t, 0);
        vidaFondo("mn", t, { lamparas: 2, gente: 2, capa: "mercado", y: 1080, s: 0.42 });
        for (let i = 0; i < 22; i++) { css("mn-ba" + i, "opacity", 0.45 + 0.55 * ((Math.sin(t * 4 + i * 1.3) + 1) / 2)); if (i < 18) css("mn-bb" + i, "opacity", 0.45 + 0.55 * ((Math.sin(t * 3 + i * 0.9) + 1) / 2)); }
        marca("m1", t, c["c1-horas"]);
        selloAnim("s1-sello", t, c["c1-sello"], 300, 760, { s: 0.8, r: -9 });
        const w = ruta(t, [[0.1, 1250], [1.1, 860]]), w2 = ruta(t, [[0.3, 1400], [1.3, 620]]);
        persona("s1-m", t, { x: w.x, y: 1440, s: 0.8, anda: w.anda, mira: -1, vivo: true, charla: e, boca: habla(t, e, "sonrisa"), brazo: [[0, "abajo"], [c["c1-ilusion"] - 0.1, "hombros"], [c["c1-no"] + 0.5, "abajo"]], espejo: true, fase: 2 });
        persona("s1-a", t, { x: w2.x, y: 1440, s: 0.74, anda: w2.anda, mira: -1, vivo: true, boca: [[0, "sonrisa"], [c["c1-no"], "grande"]], ojos: [[0, "normal"], [c["c1-no"], "felices"]], brazo: [[0, "abajo"]], espejo: true, fase: 1 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c1-horas"], e.c["c1-no"]]); } },

    // 2 · Pescadería. El tendero: «Un kilo de marisco guapa son 54 minutos. En 2016 eran 52… o sea casi igual.»
    { n: 2, set: "vacio",
      svg: `${gente("s2", "t")}<g transform="translate(770 1460)">${mostradorPescado("s2-mo")}</g>${gente("s2", "ma")}
        <g id="s2-rl"><g transform="translate(0 0)">${relojCocina("s2-r", 80, HOY)}</g>${rot(0, 150, rnd(D.marisco[1]) + " MIN", 44, HOY)}</g>`,
      tarjeta: grande(2, rnd(D.marisco[1]) + "&nbsp;min", { titulo: "Kilo de marisco, en tiempo de trabajo", texto: "En 2016, " + rnd(D.marisco[0]) }, `Precio medio del año, todo tipo de marisco. Sueldo neto mediano: ${es(D.hora["2025"], 2)}&nbsp;€ la hora`, F),
      fn: function (t, e) {
        const c = e.c;
        ambiente("mercado", null, t, 0);
        vidaFondo("mn", t, { lamparas: 2, gente: 2, capa: "mercado", y: 1080, s: 0.42 });
        for (let i = 0; i < 22; i++) { css("mn-ba" + i, "opacity", 0.45 + 0.55 * ((Math.sin(t * 4 + i * 1.3) + 1) / 2)); if (i < 18) css("mn-bb" + i, "opacity", 0.45 + 0.55 * ((Math.sin(t * 3 + i * 0.9) + 1) / 2)); }
        pop("s2-rl", t, c["c2-54"] - 0.3, 520, 990, { s: 0.85 });
        const m = D.marisco[1] * suave(clamp((t - c["c2-54"] + 0.2) / 1.2));
        cuna("s2-r-v", (m % 60) / 60, 80); attr("s2-r-ag", "transform", `rotate(${(m * 6).toFixed(1)})`);
        sube("c2-a", t, c["c2-54"]); sube("c2-b", t, c["c2-2016"]);
        persona("s2-t", t, { x: 790, y: 1440, s: 0.8, mira: -1, vivo: true, charla: e, boca: habla(t, e, "sonrisa"), brazo: [[0, "abajo"], [c["c2-guapa"] - 0.2, "senala"], [c["c2-2016"], "abajo"], [c["c2-igual"] - 0.2, "hombros"]], incl: [[0, 0], [c["c2-igual"], -5]], espejo: true, fase: 2 });
        persona("s2-m", t, { x: 150, y: 1440, s: 0.78, mira: 1, vivo: true, boca: [[0, "seria"], [c["c2-54"] + 0.3, "o"], [c["c2-igual"], "seria"]], ojos: [[0, "normal"], [c["c2-54"] + 0.3, "grandes"], [c["c2-igual"], "normal"]], brazo: [[0, "abajo"]], fase: 1 });
        persona("s2-a", t, { x: 340, y: 1440, s: 0.74, mira: 1, vivo: true, boca: [[0, "seria"], [c["c2-54"] + 0.4, "o"]], ojos: [[0, "normal"], [c["c2-54"] + 0.4, "grandes"]], brazo: [[0, "abajo"]], fase: 1 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c2-54"]]); } },

    // 3 · El abuelo: «¿Una hora por unas gambas? Anda ya… en mis tiempos las pescaba yo.»
    { n: 3, set: "vacio",
      svg: `${gente("s3", "t")}<g transform="translate(770 1460)">${mostradorPescado("s3-mo")}</g>${gente("s3", "ma")}`,
      tarjeta: cita(3, "El abuelo", `«En mis <mark id="m3">tiempos</mark>…»`),
      fn: function (t, e) {
        const c = e.c;
        ambiente("mercado", null, t, 0);
        vidaFondo("mn", t, { lamparas: 2, gente: 2, capa: "mercado", y: 1080, s: 0.42 });
        for (let i = 0; i < 22; i++) { css("mn-ba" + i, "opacity", 0.45 + 0.55 * ((Math.sin(t * 4 + i * 1.3) + 1) / 2)); if (i < 18) css("mn-bb" + i, "opacity", 0.45 + 0.55 * ((Math.sin(t * 3 + i * 0.9) + 1) / 2)); }
        marca("m3", t, c["c3-tiempos"]);
        persona("s3-t", t, { x: 790, y: 1440, s: 0.8, mira: -1, vivo: true, boca: [[0, "sonrisa"], [c["c3-tiempos"] + 0.4, "grande"]], ojos: [[0, "normal"], [c["c3-tiempos"] + 0.4, "felices"]], brazo: [[0, "abajo"], [c["c3-tiempos"] + 0.4, "hombros"]], espejo: true, fase: 2 });
        persona("s3-m", t, { x: 150, y: 1440, s: 0.78, mira: 1, vivo: true, boca: [[0, "sonrisa"]], ojos: [[0, "normal"], [c["c3-tiempos"] + 0.4, "felices"]], brazo: [[0, "abajo"]], fase: 1 });
        persona("s3-a", t, { x: 350, y: 1440, s: 0.74, mira: 1, vivo: true, charla: e, boca: habla(t, e, "sonrisa"), brazo: [[0, "abajo"], [c["c3-gambas"] - 0.3, "senala"], [c["c3-ya"], "hombros"], [c["c3-tiempos"], "arriba"]], incl: [[0, 0], [c["c3-ya"], -6], [c["c3-tiempos"], 0]], salta: c["c3-tiempos"] + 0.2, fase: 1 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c3-tiempos"]]); } },

    // 4 · Carnicería: el plato principal. El tendero: «Y el plato fuerte… la pierna de cordero. Veintiocho euros y pico. En 2016 diecinueve. Un 48 % más.»
    { n: 4, set: "vacio",
      svg: `${gente("s4", "t")}<g transform="translate(770 1460)">${mostradorCarne("s4-mo")}</g><g id="s4-ba">${bascula("s4-b", es(D.corderoEur[1], 2) + " €")}</g>${gente("s4", "ma")}`,
      tarjeta: tarjeta(4, "El plato principal: pierna de cordero", `${vs(4, [es(D.corderoEur[0], 2) + "&nbsp;€", es(D.corderoEur[1], 2) + "&nbsp;€"], ["en 2016", "hoy"], 84)}
        <div class="tit" id="c4-p" style="font-size:92px;color:${HOY};line-height:1;margin-top:6px">+${rnd(D.corderoSube)}&nbsp;%</div>
        <div class="nota">Kilo y medio; precio medio del año (cordero y cabrito)</div>`, { fuente: F_EPF, icono: bandera(44) }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("mercado", null, t, 0);
        vidaFondo("mn", t, { lamparas: 2, gente: 2, capa: "mercado", y: 1080, s: 0.42 });
        for (let i = 0; i < 22; i++) { css("mn-ba" + i, "opacity", 0.45 + 0.55 * ((Math.sin(t * 4 + i * 1.3) + 1) / 2)); if (i < 18) css("mn-bb" + i, "opacity", 0.45 + 0.55 * ((Math.sin(t * 3 + i * 0.9) + 1) / 2)); }
        pop("s4-ba", t, c["c4-pierna"] - 0.15, 600, 1150, { s: 1 });
        const dp = t - c["c4-veintiocho"];
        css("s4-b-pr", "opacity", dp < 0 ? 0 : dp < 0.5 ? (Math.floor(dp * 8) % 2 ? 0.35 : 1) : 1);
        sube("c4-b", t, c["c4-veintiocho"]); sube("c4-a", t, c["c4-2016"]); sube("c4-p", t, c["c4-48"]);
        persona("s4-t", t, { x: 830, y: 1440, s: 0.8, mira: -1, vivo: true, charla: e, boca: habla(t, e, "sonrisa"), brazo: [[0, "abajo"], [c["c4-pierna"] - 0.3, "senala"], [c["c4-2016"], "abajo"], [c["c4-48"], "arriba"]], espejo: true, fase: 2 });
        persona("s4-m", t, { x: 150, y: 1440, s: 0.78, mira: 1, vivo: true, boca: [[0, "seria"], [c["c4-48"] + 0.2, "o"]], ojos: [[0, "normal"], [c["c4-48"] + 0.2, "grandes"]], brazo: [[0, "abajo"]], fase: 1 });
        persona("s4-a", t, { x: 340, y: 1440, s: 0.74, mira: 1, vivo: true, boca: [[0, "seria"], [c["c4-48"] + 0.3, "o"]], ojos: [[0, "normal"], [c["c4-48"] + 0.3, "grandes"]], brazo: [[0, "abajo"]], incl: [[0, 0], [c["c4-48"] + 0.3, 5]], fase: 1 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c4-veintiocho"], e.c["c4-48"]]); } },

    // 5 · La madre hace la cuenta en tiempo: «O sea dos horas y doce minutos de curro. En 2016 ni dos.»
    { n: 5, set: "vacio",
      svg: `${gente("s5", "t")}<g transform="translate(770 1460)">${mostradorCarne("s5-mo")}</g>${gente("s5", "ma")}
        <g id="s5-rl">${relojCocina("s5-r", 80, HOY)}<rect x="-96" y="112" width="192" height="52" rx="26" fill="#FFFDF8"/>${rot(0, 152, rnd(D.cordero[1]) + " MIN", 44, HOY)}</g>`,
      tarjeta: grande(5, rnd(D.cordero[1]) + "&nbsp;min", { titulo: "La pierna de cordero, en tiempo de trabajo", texto: "En 2016, " + rnd(D.cordero[0]) }, `El cordero sube un ${rnd(D.corderoSube)}&nbsp;%; el sueldo, un ${rnd(D.sube)}&nbsp;%`, F),
      fn: function (t, e) {
        const c = e.c;
        ambiente("mercado", null, t, 0);
        vidaFondo("mn", t, { lamparas: 2, gente: 2, capa: "mercado", y: 1080, s: 0.42 });
        for (let i = 0; i < 22; i++) { css("mn-ba" + i, "opacity", 0.45 + 0.55 * ((Math.sin(t * 4 + i * 1.3) + 1) / 2)); if (i < 18) css("mn-bb" + i, "opacity", 0.45 + 0.55 * ((Math.sin(t * 3 + i * 0.9) + 1) / 2)); }
        pop("s5-rl", t, c["c5-sea"] - 0.1, 560, 960, { s: 0.85 });
        const m = D.cordero[1] * suave(clamp((t - c["c5-sea"]) / 1.6));
        cuna("s5-r-v", (m % 60) / 60, 80); attr("s5-r-ag", "transform", `rotate(${(m * 6).toFixed(1)})`);
        sube("c5-a", t, c["c5-doce"]); sube("c5-b", t, c["c5-2016"]);
        persona("s5-t", t, { x: 830, y: 1440, s: 0.8, mira: -1, vivo: true, boca: [[0, "sonrisa"], [c["c5-doce"] + 0.3, "seria"]], brazo: [[0, "abajo"], [c["c5-2016"] + 0.3, "hombros"]], espejo: true, fase: 2 });
        persona("s5-m", t, { x: 150, y: 1440, s: 0.78, mira: 1, vivo: true, charla: e, boca: habla(t, e, "seria"), brazo: [[0, "abajo"], [c["c5-sea"], "piensa"], [c["c5-doce"] + 0.2, "senala"], [c["c5-2016"] + 0.4, "abajo"]], incl: [[0, 0], [c["c5-sea"], -5], [c["c5-doce"], 0]], fase: 1 });
        persona("s5-a", t, { x: 340, y: 1440, s: 0.74, mira: 1, vivo: true, boca: [[0, "seria"], [c["c5-doce"] + 0.3, "o"]], ojos: [[0, "normal"], [c["c5-doce"] + 0.3, "grandes"]], brazo: [[0, "abajo"]], fase: 1 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c5-doce"]]); } },

    // 6 · El abuelo: «¿Dos horas por una pierna? En mis tiempos el cordero lo teníamos en el corral hombre.»
    { n: 6, set: "vacio",
      svg: `${gente("s6", "t")}<g transform="translate(770 1460)">${mostradorCarne("s6-mo")}</g>${gente("s6", "ma")}`,
      tarjeta: cita(6, "El abuelo", `«En mis tiempos, en el <mark id="m6">corral</mark>»`),
      fn: function (t, e) {
        const c = e.c;
        ambiente("mercado", null, t, 0);
        vidaFondo("mn", t, { lamparas: 2, gente: 2, capa: "mercado", y: 1080, s: 0.42 });
        for (let i = 0; i < 22; i++) { css("mn-ba" + i, "opacity", 0.45 + 0.55 * ((Math.sin(t * 4 + i * 1.3) + 1) / 2)); if (i < 18) css("mn-bb" + i, "opacity", 0.45 + 0.55 * ((Math.sin(t * 3 + i * 0.9) + 1) / 2)); }
        marca("m6", t, c["c6-corral"]);
        persona("s6-t", t, { x: 830, y: 1440, s: 0.8, mira: -1, vivo: true, boca: [[0, "sonrisa"], [c["c6-hombre"], "grande"]], ojos: [[0, "normal"], [c["c6-hombre"], "felices"]], brazo: [[0, "abajo"], [c["c6-corral"], "hombros"]], espejo: true, fase: 2 });
        persona("s6-m", t, { x: 150, y: 1440, s: 0.78, mira: 1, vivo: true, boca: [[0, "sonrisa"], [c["c6-hombre"], "grande"]], ojos: [[0, "normal"], [c["c6-hombre"], "felices"]], brazo: [[0, "abajo"]], fase: 1 });
        persona("s6-a", t, { x: 350, y: 1440, s: 0.74, mira: 1, vivo: true, charla: e, boca: habla(t, e, "sonrisa"), brazo: [[0, "abajo"], [c["c6-pierna"] - 0.2, "senala"], [c["c6-tiempos"], "abajo"], [c["c6-corral"] - 0.2, "arriba"]], salta: c["c6-corral"], fase: 1 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c6-corral"]]); } },

    // 7 · Casa. La madre: «Y con jamón, queso y vino la cena para cuatro… cuatro horas y once minutos. En 2016 tres cuarenta y cinco.»
    { n: 7, set: "vacio",
      svg: `<g transform="translate(150 1260) scale(.72)">${arbol("s7-ar")}</g><g transform="translate(560 1420) scale(.8)">${mesaNochebuena("s7-me")}</g>
        <g id="s7-rl">${relojCocina("s7-r", 92, HOY)}<g id="s7-vu" opacity="0">${rot(0, 162, D.h["2025"] + " H " + D.m["2025"] + " MIN", 46, HOY)}</g></g>${gente("s7", "am")}`,
      tarjeta: tarjeta(7, "La cena de Nochebuena para cuatro", `${vs(7, [`${D.h["2016"]}&nbsp;h&nbsp;${D.m["2016"]}`, `${D.h["2025"]}&nbsp;h&nbsp;${D.m["2025"]}`], ["en 2016", "hoy"])}
        <div class="nota">De trabajo. En 2019, ${D.h["2019"]}&nbsp;h&nbsp;${D.m["2019"]}. Mismas cantidades los tres años</div>`, { fuente: F, icono: bandera(44) }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("salon", "mercado", t, e.t0);
        vidaFondo("sl", t, { lamparas: 1, capa: "salon" });
        for (let i = 0; i < 16; i++) css("s7-ar-b" + i, "opacity", 0.35 + 0.65 * ((Math.sin(t * 3.4 + i * 1.7) + 1) / 2));
        pop("s7-rl", t, c["c7-cena"] - 0.3, 560, 860, { s: 1 });
        const m = D.cena["2025"] * suave(clamp((t - c["c7-cuatro"] + 0.2) / 2.0));
        cuna("s7-r-v", (m % 60) / 60, 92); attr("s7-r-ag", "transform", `rotate(${(m * 6).toFixed(1)})`); css("s7-vu", "opacity", clamp((t - c["c7-once"]) / 0.3));
        sube("c7-b", t, c["c7-once"]); sube("c7-a", t, c["c7-2016"]);
        persona("s7-a", t, { x: 120, y: 1440, s: 0.74, mira: 1, vivo: true, boca: [[0, "seria"], [c["c7-once"] + 0.3, "o"]], ojos: [[0, "normal"], [c["c7-once"] + 0.3, "grandes"]], brazo: [[0, "abajo"]], fase: 1 });
        persona("s7-m", t, { x: 960, y: 1440, s: 0.78, mira: -1, vivo: true, charla: e, boca: habla(t, e, "seria"), brazo: [[0, "abajo"], [c["c7-cena"] - 0.2, "senala"], [c["c7-2016"], "abajo"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c7-once"]]); } },

    // 8 · La madre: «Y lo único que baja… los juguetes de Reyes. Un 36 % menos.»
    { n: 8, set: "vacio",
      svg: `<g transform="translate(150 1260) scale(.72)">${arbol("s8-ar")}</g><g transform="translate(560 1420) scale(.8)">${mesaNochebuena("s8-me")}</g><g id="s8-ju">${juguetes("s8-j")}</g>${gente("s8", "am")}`,
      tarjeta: grande(8, "−" + rnd(-D.juguetes.tiempo_sube_pct) + "&nbsp;%", { titulo: "Juguetes, en tiempo de trabajo", texto: "menos que en 2016" }, `Bajan un ${rnd(-D.juguetes.precio_sube_pct)}&nbsp;%; el sueldo sube un ${rnd(D.sube)}&nbsp;%`, F_IPC),
      fn: function (t, e) {
        const c = e.c;
        ambiente("salon", null, t, 0);
        vidaFondo("sl", t, { lamparas: 1, capa: "salon" });
        for (let i = 0; i < 16; i++) css("s8-ar-b" + i, "opacity", 0.35 + 0.65 * ((Math.sin(t * 3.4 + i * 1.7) + 1) / 2));
        const k = suave(clamp((t - c["c8-36"] + 0.1) / 0.6));
        pop("s8-ju", t, c["c8-juguetes"] - 0.1, 560, 1060, { s: 1.1 - 0.35 * k });
        sube("c8-a", t, c["c8-36"]); sube("c8-b", t, c["c8-36"] + 0.2);
        persona("s8-a", t, { x: 130, y: 1440, s: 0.74, mira: 1, vivo: true, boca: [[0, "seria"], [c["c8-36"] + 0.3, "sonrisa"]], ojos: [[0, "normal"], [c["c8-36"] + 0.3, "felices"]], brazo: [[0, "abajo"]], fase: 1 });
        persona("s8-m", t, { x: 960, y: 1440, s: 0.78, mira: -1, vivo: true, charla: e, boca: habla(t, e, "sonrisa"), brazo: [[0, "abajo"], [c["c8-baja"], "hombros"], [c["c8-juguetes"] - 0.2, "senala"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c8-36"]]); } },

    // 9 · El abuelo, con una naranja: «Pues este año cenamos juguetes. En mis tiempos con una naranja ibas que te matabas.»
    { n: 9, set: "vacio",
      svg: `<g transform="translate(150 1260) scale(.72)">${arbol("s9-ar")}</g><g transform="translate(560 1420) scale(.8)">${mesaNochebuena("s9-me")}</g>${gente("s9", "a", { a: NARANJA_MANO })}${gente("s9", "m")}`,
      tarjeta: cita(9, "El abuelo", `«En mis tiempos, una <mark id="m9">naranja</mark>»`),
      fn: function (t, e) {
        const c = e.c;
        ambiente("salon", null, t, 0);
        vidaFondo("sl", t, { lamparas: 1, capa: "salon" });
        for (let i = 0; i < 16; i++) css("s9-ar-b" + i, "opacity", 0.35 + 0.65 * ((Math.sin(t * 3.4 + i * 1.7) + 1) / 2));
        marca("m9", t, c["c9-naranja"]);
        ver("s9-a-mano", t >= c["c9-naranja"] - 0.3);   // la naranja sale cuando la levanta, no va pegada a la mano todo el plano
        persona("s9-a", t, { x: 300, y: 1440, s: 0.76, mira: 1, vivo: true, charla: e, boca: habla(t, e, "sonrisa"), brazo: [[0, "abajo"], [c["c9-juguetes"] - 0.2, "hombros"], [c["c9-naranja"] - 0.3, "arriba"]], salta: c["c9-matabas"], fase: 1 });
        persona("s9-m", t, { x: 960, y: 1440, s: 0.78, mira: -1, vivo: true, boca: [[0, "sonrisa"], [c["c9-juguetes"], "grande"]], ojos: [[0, "normal"], [c["c9-matabas"], "felices"]], brazo: [[0, "abajo"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c9-naranja"]]); } },

    // 10 · El mapa grande, con lo que sube cada plato. La madre: «Total media hora más que en 2016 por la misma cena. Y mira cómo sube lo típico de cada sitio.»
    { n: 10, set: "vacio",
      svg: `${mapa("s10-mp", 1045)}${gente("s10", "am")}`,
      tarjeta: tarjeta(10, "Nochebuena, frente a 2016", `<div class="tit" style="font-size:54px">Media hora más de trabajo por la <mark id="m10">misma</mark> cena</div>`, { fuente: F_MAPA, icono: bandera(44) }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("salon", null, t, 0);
        vidaFondo("sl", t, { lamparas: 1, capa: "salon" });
        marca("m10", t, c["c10-misma"]);
        for (let i = 0; i < 12; i++) {
          const k = (t - e.t0 - 0.3 - i * 0.22) / 0.3; ver(`s10-mp-p${i}`, k >= 0); if (k >= 0) css(`s10-mp-p${i}`, "opacity", clamp(k));
          const q = (t - c["c10-sube"] - i * 0.16) / 0.25; ver(`s10-mp-q${i}`, q >= 0);
          if (q >= 0) { const s = 0.4 + 0.6 * clamp(q) + 0.12 * Math.sin(clamp(q) * Math.PI); attr(`s10-mp-q${i}`, "transform", `translate(0 82) scale(${s.toFixed(3)}) translate(0 -82)`); }
        }
        persona("s10-a", t, { x: 150, y: 1890, s: 0.6, mira: 1, vivo: true, boca: [[0, "seria"], [c["c10-sube"] + 1.2, "o"]], ojos: [[0, "normal"], [c["c10-sube"] + 1.2, "grandes"]], brazo: [[0, "abajo"]], fase: 1 });
        persona("s10-m", t, { x: 930, y: 1890, s: 0.62, mira: -1, vivo: true, charla: e, boca: habla(t, e, "seria"), brazo: [[0, "abajo"], [c["c10-mira"] - 0.1, "senala"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [], { acerca: 0 }); } },   // el mapa, quieto: sin salto entre los planos 10 y 11

    // 11 · La pregunta, con el mapa entero: «¿Y en tu casa qué se come en Nochebuena? ¿Te ha subido tanto?»
    { n: 11, set: "vacio",
      svg: `${mapa("s11-mp", 1045)}${gente("s11", "am")}`,
      tarjeta: tarjeta(11, "Te toca", `<div class="tit" style="font-size:54px">¿Qué se come en tu <mark id="m11">casa</mark> en Nochebuena?</div><div class="sub" id="c11-sub" style="font-size:42px;font-weight:800">¿Te ha subido tanto?</div>`, { fuente: F_MAPA }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("salon", null, t, 0);
        vidaFondo("sl", t, { lamparas: 1, capa: "salon" });
        marca("m11", t, c["c11-casa"]); sube("c11-sub", t, c["c11-tanto"]);
        persona("s11-a", t, { x: 150, y: 1890, s: 0.6, mira: 1, vivo: true, boca: [[0, "sonrisa"]], brazo: [[0, "abajo"], [c["c11-tanto"], "hombros"]], fase: 1 });
        persona("s11-m", t, { x: 930, y: 1890, s: 0.62, mira: [[0, -1], [c["c11-casa"], 0]], vivo: true, charla: e, boca: habla(t, e, "sonrisa"), brazo: [[0, "abajo"], [c["c11-casa"], "senala"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [], { acerca: 0 }); } },   // el mapa, quieto: sin salto entre los planos 10 y 11
  ];
}
