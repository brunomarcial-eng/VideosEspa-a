// Escenas de T15 («¿Cuántas horas trabajas para la cena de Nochebuena?») en estilo «limpio».
// Bruno, 22 y 23-11-2026: la cena en casa en horas de trabajo, 2016 frente a hoy, con su lista de comidas de Navidad; tono y
// forma de T17 (aprobado): de calle, irónico, pocas cifras y grandes, cambio de escenario y un chiste que vuelve.
//   · «madre»: unos 45, pone la cena este año, jersey verde (voz «medica»).
//   · «abuela»: unos 75, canas, rebeca granate, «en mis tiempos…» (voz «hostelera»).
//   · «tendero»: unos 45, el del mercado, delantal y bigote (voz «profesora»).
// Decorados: el mercado de diseno/navidad.mjs y el salón de T17 (diseno/carnet.mjs) con el árbol.
/* eslint-disable no-undef */

import { C, persona, tarjeta, selloOficial } from "../../diseno/limpio.mjs";
import { bandera, DELANTAL } from "../../diseno/barrio.mjs";
import { ambientes } from "../../diseno/sueno.mjs";
import { relojCocina } from "../../diseno/desayuno.mjs";
import { DECORADOS_T17 } from "../../diseno/carnet.mjs";
import { DECORADOS_T15, mostradorPescado, mostradorCarne, arbol, mesaNochebuena, bandejaDulces, juguetes, NARANJA_MANO, CARRO_MANO, mapaPlatos, PLATOS } from "../../diseno/navidad.mjs";

export const ESTILO = "limpio";
const F = "Cálculo propio · INE (Presupuestos Familiares y Estructura Salarial)";
const F_IPC = "Cálculo propio · INE (IPC y Estructura Salarial)";

export function datos(d) {
  const p = d.platos, c = d.cena;
  return { marisco: [p.marisco.minutos["2016"], p.marisco.minutos["2025"]], cordero: [p.cordero.minutos["2016"], p.cordero.minutos["2025"]],
           cena: c.minutos, h: c.h, m: c.m, dulces: d.relativos.dulces, juguetes: d.relativos.juguetes, hora: d.sueldo.neto_hora_mediana, sube: d.sueldo.mediana_sube_pct };
}

export const capas = () => ambientes({ ...DECORADOS_T15, salon: DECORADOS_T17.salon });

// ------------------------------------------------------------------ personajes (inventados), con volumen
const MADRE = { pelo: "largo", canas: false, barba: false, colorPelo: "#4A2E20", ropa: ["#5E7F5A", "#4C6A49"], piel: "#F2CBA8", volumen: true };
const ABUELA = { pelo: "largo", canas: true, barba: false, colorPelo: "#D9D3C7", ropa: ["#8E3B4A", "#74303D"], piel: "#EBC3A0", volumen: true };
const TENDERO = { pelo: "corto", canas: false, barba: true, bigote: true, colorPelo: "#2B1D14", ropa: ["#FFFDF8", "#E9E2D5"], piel: "#DDAE86", piel2: "#C99A72", volumen: true, encima: DELANTAL("#3E8E8A") };
const QUIEN = { m: MADRE, a: ABUELA, t: TENDERO };
const gente = (n, quien, manos = {}) => quien.split("").map((k) => persona(`${n}-${k}`, "hoy", { ...QUIEN[k], mano: manos[k] ? `<g id="${n}-${k}-mano">${manos[k]}</g>` : undefined })).join("");

// ------------------------------------------------------------------ piezas
const HOY = "#B3261E";
const rot = (x, y, t, tam, color, id = "", ancla = "middle") => `<text ${id ? `id="${id}"` : ""} x="${x}" y="${y}" text-anchor="${ancla}" font-family="Cap" font-weight="800" font-size="${tam}" fill="${color}">${t}</text>`;
const es = (v, d = 1) => v.toFixed(d).replace(".", ",");
// Redondeo «del banquero», el mismo que usa el verificador (Python): 132,5 → 132, como dice el guion.
const rnd = (v) => { const f = Math.floor(v), d = v - f; return Math.abs(d - 0.5) < 1e-9 ? (f % 2 === 0 ? f : f + 1) : Math.round(v); };
const vs = (n, vals, labs, tam = 92) => `<div class="vs">${vals.map((v, i) => `<div class="col"><div class="v ${i ? "t-hoy" : "t-pasado"}" id="c${n}-${"ab"[i]}" style="font-size:${tam}px">${v}</div><div class="n">${labs[i]}</div></div>`).join("")}</div>`;
const cita = (n, quien, html) => tarjeta(n, quien, `<div class="tit" style="font-size:64px">${html}</div>`, { tono: "hoy" });
const grande = (n, cifra, sub, nota, fuente) => tarjeta(n, sub.titulo, `<div class="tit" style="font-size:110px;color:${HOY};line-height:1" id="c${n}-a">${cifra}</div>
  <div class="sub" id="c${n}-b" style="font-size:44px">${sub.texto}</div>${nota ? `<div class="nota">${nota}</div>` : ""}`, { fuente, icono: bandera(44) });

export function escenas(D) {
  return [
    // 1 · Mercado. La madre, con el carro: «¿Cuántas horas de curro te cuesta la cena de Nochebuena? Este año la pongo yo. Qué ilusión… o no.»
    { n: 1, set: "vacio",
      svg: `${gente("s1", "a")}${gente("s1", "m", { m: CARRO_MANO })}${selloOficial("s1-sello")}`,
      tarjeta: tarjeta(1, "Navidad · 2016, 2019 y hoy", `<div class="tit" style="font-size:62px">¿Cuántas <mark id="m1">horas</mark> cuesta la cena de Nochebuena?</div>`, { icono: bandera(44) }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("mercado", null, t, 0);
        vidaFondo("mn", t, { lamparas: 2, gente: 2, capa: "mercado", y: 1080, s: 0.42 });
        for (let i = 0; i < 22; i++) { css("mn-ba" + i, "opacity", 0.45 + 0.55 * ((Math.sin(t * 4 + i * 1.3) + 1) / 2)); if (i < 18) css("mn-bb" + i, "opacity", 0.45 + 0.55 * ((Math.sin(t * 3 + i * 0.9) + 1) / 2)); }
        marca("m1", t, c["c1-horas"]);
        selloAnim("s1-sello", t, c["c1-sello"], 300, 760, { s: 0.8, r: -9 });
        const w = ruta(t, [[0.1, 1250], [1.1, 860]]), w2 = ruta(t, [[0.3, 1380], [1.3, 640]]);
        persona("s1-m", t, { x: w.x, y: 1440, s: 0.8, anda: w.anda, mira: -1, vivo: true, charla: e, boca: habla(t, e, "sonrisa"), brazo: [[0, "sujeta"], [c["c1-ilusion"], "hombros"]], espejo: true, fase: 2 });
        persona("s1-a", t, { x: w2.x, y: 1440, s: 0.72, anda: w2.anda, mira: -1, vivo: true, boca: [[0, "sonrisa"], [c["c1-ilusion"] + 0.3, "grande"]], ojos: [[0, "normal"], [c["c1-ilusion"] + 0.3, "felices"]], brazo: [[0, "abajo"]], espejo: true, fase: 1 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c1-horas"], e.c["c1-ilusion"]]); } },

    // 2 · Pescadería. El tendero: «Un kilo de marisco, guapa: 54 minutos de tu sueldo. En 2016, 52.»
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
        cuna("s2-r-v", (m % 60) / 60 + (m >= 60 ? 0 : 0), 80); attr("s2-r-ag", "transform", `rotate(${(m * 6).toFixed(1)})`);
        sube("c2-a", t, c["c2-54"]); sube("c2-b", t, c["c2-2016"]);
        persona("s2-t", t, { x: 790, y: 1440, s: 0.8, mira: -1, vivo: true, charla: e, boca: habla(t, e, "sonrisa"), brazo: [[0, "abajo"], [c["c2-guapa"] - 0.2, "senala"], [c["c2-2016"], "abajo"]], espejo: true, fase: 2 });
        persona("s2-m", t, { x: 150, y: 1440, s: 0.78, mira: 1, vivo: true, boca: [[0, "seria"], [c["c2-54"] + 0.3, "o"]], ojos: [[0, "normal"], [c["c2-54"] + 0.3, "grandes"]], brazo: [[0, "abajo"]], fase: 1 });
        persona("s2-a", t, { x: 330, y: 1440, s: 0.7, mira: 1, vivo: true, boca: [[0, "seria"]], brazo: [[0, "abajo"]], fase: 1 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c2-54"]]); } },

    // 3 · La abuela: «¿Casi una hora por un kilo de gambas? En mis tiempos las pescaba tu abuelo.»
    { n: 3, set: "vacio",
      svg: `${gente("s3", "t")}<g transform="translate(770 1460)">${mostradorPescado("s3-mo")}</g>${gente("s3", "ma")}`,
      tarjeta: cita(3, "La abuela", `«En mis <mark id="m3">tiempos</mark>…»`),
      fn: function (t, e) {
        const c = e.c;
        ambiente("mercado", null, t, 0);
        vidaFondo("mn", t, { lamparas: 2, gente: 2, capa: "mercado", y: 1080, s: 0.42 });
        for (let i = 0; i < 22; i++) { css("mn-ba" + i, "opacity", 0.45 + 0.55 * ((Math.sin(t * 4 + i * 1.3) + 1) / 2)); if (i < 18) css("mn-bb" + i, "opacity", 0.45 + 0.55 * ((Math.sin(t * 3 + i * 0.9) + 1) / 2)); }
        marca("m3", t, c["c3-tiempos"]);
        persona("s3-t", t, { x: 790, y: 1440, s: 0.8, mira: -1, vivo: true, boca: [[0, "sonrisa"], [c["c3-abuelo"], "grande"]], brazo: [[0, "abajo"], [c["c3-abuelo"], "hombros"]], espejo: true, fase: 2 });
        persona("s3-m", t, { x: 150, y: 1440, s: 0.78, mira: 1, vivo: true, boca: [[0, "sonrisa"]], brazo: [[0, "abajo"]], fase: 1 });
        persona("s3-a", t, { x: 340, y: 1440, s: 0.72, mira: 1, vivo: true, charla: e, boca: habla(t, e, "seria"), brazo: [[0, "abajo"], [c["c3-gambas"] - 0.3, "senala"], [c["c3-tiempos"], "piensa"]], incl: [[0, 0], [c["c3-tiempos"], -6]], fase: 1 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c3-tiempos"]]); } },

    // 4 · Carnicería. El tendero: «Y la pierna de cordero: dos horas y doce minutos. En 2016, una hora cincuenta y tres.»
    { n: 4, set: "vacio",
      svg: `${gente("s4", "t")}<g transform="translate(770 1460)">${mostradorCarne("s4-mo")}</g>${gente("s4", "ma")}
        <g id="s4-rl">${relojCocina("s4-r", 80, HOY)}${rot(0, 150, rnd(D.cordero[1]) + " MIN", 44, HOY)}</g>`,
      tarjeta: grande(4, rnd(D.cordero[1]) + "&nbsp;min", { titulo: "Pierna de cordero, en tiempo de trabajo", texto: "En 2016, " + rnd(D.cordero[0]) }, "Cordero y cabrito, precio medio del año", F),
      fn: function (t, e) {
        const c = e.c;
        ambiente("mercado", null, t, 0);
        vidaFondo("mn", t, { lamparas: 2, gente: 2, capa: "mercado", y: 1080, s: 0.42 });
        for (let i = 0; i < 22; i++) { css("mn-ba" + i, "opacity", 0.45 + 0.55 * ((Math.sin(t * 4 + i * 1.3) + 1) / 2)); if (i < 18) css("mn-bb" + i, "opacity", 0.45 + 0.55 * ((Math.sin(t * 3 + i * 0.9) + 1) / 2)); }
        pop("s4-rl", t, c["c4-cordero"] - 0.1, 520, 990, { s: 0.85 });
        const m = D.cordero[1] * suave(clamp((t - c["c4-horas"] + 0.3) / 1.6));
        cuna("s4-r-v", (m % 60) / 60, 80); attr("s4-r-ag", "transform", `rotate(${(m * 6).toFixed(1)})`);
        sube("c4-a", t, c["c4-horas"]); sube("c4-b", t, c["c4-2016"]);
        persona("s4-t", t, { x: 790, y: 1440, s: 0.8, mira: -1, vivo: true, charla: e, boca: habla(t, e, "sonrisa"), brazo: [[0, "abajo"], [c["c4-cordero"] - 0.2, "senala"], [c["c4-2016"], "abajo"]], espejo: true, fase: 2 });
        persona("s4-m", t, { x: 150, y: 1440, s: 0.78, mira: 1, vivo: true, boca: [[0, "seria"], [c["c4-horas"] + 0.3, "o"]], ojos: [[0, "normal"], [c["c4-horas"] + 0.3, "grandes"]], brazo: [[0, "abajo"]], fase: 1 });
        persona("s4-a", t, { x: 330, y: 1440, s: 0.7, mira: 1, vivo: true, boca: [[0, "seria"], [c["c4-horas"] + 0.3, "o"]], brazo: [[0, "abajo"]], fase: 1 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c4-horas"]]); } },

    // 5 · La abuela: «¿Dos horas por un cordero? En mis tiempos lo criábamos en el corral.»
    { n: 5, set: "vacio",
      svg: `${gente("s5", "t")}<g transform="translate(770 1460)">${mostradorCarne("s5-mo")}</g>${gente("s5", "ma")}`,
      tarjeta: cita(5, "La abuela", `«En mis tiempos, en el <mark id="m5">corral</mark>»`),
      fn: function (t, e) {
        const c = e.c;
        ambiente("mercado", null, t, 0);
        vidaFondo("mn", t, { lamparas: 2, gente: 2, capa: "mercado", y: 1080, s: 0.42 });
        for (let i = 0; i < 22; i++) { css("mn-ba" + i, "opacity", 0.45 + 0.55 * ((Math.sin(t * 4 + i * 1.3) + 1) / 2)); if (i < 18) css("mn-bb" + i, "opacity", 0.45 + 0.55 * ((Math.sin(t * 3 + i * 0.9) + 1) / 2)); }
        marca("m5", t, c["c5-corral"]);
        persona("s5-t", t, { x: 790, y: 1440, s: 0.8, mira: -1, vivo: true, boca: [[0, "sonrisa"], [c["c5-corral"], "grande"]], brazo: [[0, "abajo"], [c["c5-corral"], "hombros"]], espejo: true, fase: 2 });
        persona("s5-m", t, { x: 150, y: 1440, s: 0.78, mira: 1, vivo: true, boca: [[0, "sonrisa"], [c["c5-corral"], "grande"]], ojos: [[0, "normal"], [c["c5-corral"], "felices"]], brazo: [[0, "abajo"]], fase: 1 });
        persona("s5-a", t, { x: 340, y: 1440, s: 0.72, mira: 1, vivo: true, charla: e, boca: habla(t, e, "sonrisa"), brazo: [[0, "abajo"], [c["c5-tiempos"] - 0.2, "arriba"]], salta: c["c5-corral"], fase: 1 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c5-corral"]]); } },

    // 6 · Casa. La madre: «Con jamón, queso y vino, la cena para cuatro: cuatro horas y once minutos. En 2016, tres cuarenta y cinco.»
    { n: 6, set: "vacio",
      svg: `<g transform="translate(150 1260) scale(.72)">${arbol("s6-ar")}</g><g transform="translate(560 1420) scale(.8)">${mesaNochebuena("s6-me")}</g>
        <g id="s6-rl">${relojCocina("s6-r", 92, HOY)}<g id="s6-vu" opacity="0">${rot(0, 162, D.h["2025"] + " H " + D.m["2025"] + " MIN", 46, HOY)}</g></g>${gente("s6", "am")}`,
      tarjeta: tarjeta(6, "La cena de Nochebuena para cuatro", `${vs(6, [`${D.h["2016"]}&nbsp;h&nbsp;${D.m["2016"]}`, `${D.h["2025"]}&nbsp;h&nbsp;${D.m["2025"]}`], ["en 2016", "hoy"])}
        <div class="nota">De trabajo. En 2019, ${D.h["2019"]}&nbsp;h&nbsp;${D.m["2019"]}. Mismas cantidades los tres años</div>`, { fuente: F, icono: bandera(44) }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("salon", "mercado", t, e.t0);
        vidaFondo("sl", t, { lamparas: 1, capa: "salon" });
        for (let i = 0; i < 16; i++) css("s6-ar-b" + i, "opacity", 0.35 + 0.65 * ((Math.sin(t * 3.4 + i * 1.7) + 1) / 2));
        pop("s6-rl", t, c["c6-cena"] - 0.3, 560, 860, { s: 1 });
        const m = D.cena["2025"] * suave(clamp((t - c["c6-cuatro"] + 0.2) / 2.0));
        cuna("s6-r-v", (m % 60) / 60, 92); attr("s6-r-ag", "transform", `rotate(${(m * 6).toFixed(1)})`); css("s6-vu", "opacity", clamp((t - c["c6-once"]) / 0.3));
        sube("c6-b", t, c["c6-once"]); sube("c6-a", t, c["c6-2016"]);
        persona("s6-a", t, { x: 120, y: 1440, s: 0.72, mira: 1, vivo: true, boca: [[0, "seria"], [c["c6-once"] + 0.3, "o"]], ojos: [[0, "normal"], [c["c6-once"] + 0.3, "grandes"]], brazo: [[0, "abajo"]], fase: 1 });
        persona("s6-m", t, { x: 960, y: 1440, s: 0.78, mira: -1, vivo: true, charla: e, boca: habla(t, e, "seria"), brazo: [[0, "abajo"], [c["c6-cena"] - 0.2, "senala"], [c["c6-2016"], "abajo"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c6-once"]]); } },

    // 7 · La abuela: «Media hora más de curro para cenar lo mismo. ¿Y el turrón, qué?»
    { n: 7, set: "vacio",
      svg: `<g transform="translate(150 1260) scale(.72)">${arbol("s7-ar")}</g><g transform="translate(560 1420) scale(.8)">${mesaNochebuena("s7-me")}</g>${gente("s7", "am")}`,
      tarjeta: cita(7, "La abuela", `«¿Y el <mark id="m7">turrón</mark>, qué?»`),
      fn: function (t, e) {
        const c = e.c;
        ambiente("salon", null, t, 0);
        vidaFondo("sl", t, { lamparas: 1, capa: "salon" });
        for (let i = 0; i < 16; i++) css("s7-ar-b" + i, "opacity", 0.35 + 0.65 * ((Math.sin(t * 3.4 + i * 1.7) + 1) / 2));
        marca("m7", t, c["c7-turron"]);
        persona("s7-a", t, { x: 130, y: 1440, s: 0.72, mira: 1, vivo: true, charla: e, boca: habla(t, e, "seria"), brazo: [[0, "abajo"], [c["c7-curro"], "hombros"], [c["c7-turron"], "senala"]], incl: [[0, 0], [c["c7-turron"], 6]], fase: 1 });
        persona("s7-m", t, { x: 960, y: 1440, s: 0.78, mira: -1, vivo: true, boca: [[0, "seria"], [c["c7-turron"], "sonrisa"]], brazo: [[0, "abajo"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c7-turron"]]); } },

    // 8 · La madre: «Turrón, mazapán y polvorones: un 18 % más de tu tiempo.»
    { n: 8, set: "vacio",
      svg: `<g transform="translate(150 1260) scale(.72)">${arbol("s8-ar")}</g><g transform="translate(560 1420) scale(.8)">${mesaNochebuena("s8-me")}</g><g id="s8-du">${bandejaDulces("s8-b")}</g>${gente("s8", "am")}`,
      tarjeta: grande(8, "+" + rnd(D.dulces.tiempo_sube_pct) + "&nbsp;%", { titulo: "Turrón y dulces, en tiempo de trabajo", texto: "más que en 2016" }, `Suben un ${rnd(D.dulces.precio_sube_pct)}&nbsp;%; el sueldo, un ${rnd(D.sube)}&nbsp;%`, F_IPC),
      fn: function (t, e) {
        const c = e.c;
        ambiente("salon", null, t, 0);
        vidaFondo("sl", t, { lamparas: 1, capa: "salon" });
        for (let i = 0; i < 16; i++) css("s8-ar-b" + i, "opacity", 0.35 + 0.65 * ((Math.sin(t * 3.4 + i * 1.7) + 1) / 2));
        const k = suave(clamp((t - c["c8-18"] + 0.2) / 0.6));
        pop("s8-du", t, c["c8-turron"] - 0.1, 560, 1040, { s: 1 + 0.18 * k });
        sube("c8-a", t, c["c8-18"]); sube("c8-b", t, c["c8-18"] + 0.2);
        persona("s8-a", t, { x: 130, y: 1440, s: 0.72, mira: 1, vivo: true, boca: [[0, "sonrisa"], [c["c8-18"] + 0.3, "o"]], brazo: [[0, "abajo"]], fase: 1 });
        persona("s8-m", t, { x: 960, y: 1440, s: 0.78, mira: -1, vivo: true, charla: e, boca: habla(t, e, "seria"), brazo: [[0, "abajo"], [c["c8-18"] - 0.2, "senala"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c8-18"]]); } },

    // 9 · La madre: «Lo único que baja: los juguetes de Reyes. Un 36 % menos.»
    { n: 9, set: "vacio",
      svg: `<g transform="translate(150 1260) scale(.72)">${arbol("s9-ar")}</g><g transform="translate(560 1420) scale(.8)">${mesaNochebuena("s9-me")}</g><g id="s9-ju">${juguetes("s9-j")}</g>${gente("s9", "am")}`,
      tarjeta: grande(9, "−" + rnd(-D.juguetes.tiempo_sube_pct) + "&nbsp;%", { titulo: "Juguetes, en tiempo de trabajo", texto: "menos que en 2016" }, `Bajan un ${rnd(-D.juguetes.precio_sube_pct)}&nbsp;%; el sueldo sube un ${rnd(D.sube)}&nbsp;%`, F_IPC),
      fn: function (t, e) {
        const c = e.c;
        ambiente("salon", null, t, 0);
        vidaFondo("sl", t, { lamparas: 1, capa: "salon" });
        for (let i = 0; i < 16; i++) css("s9-ar-b" + i, "opacity", 0.35 + 0.65 * ((Math.sin(t * 3.4 + i * 1.7) + 1) / 2));
        const k = suave(clamp((t - c["c9-36"] + 0.1) / 0.6));
        pop("s9-ju", t, c["c9-juguetes"] - 0.1, 560, 1060, { s: 1.1 - 0.35 * k });
        sube("c9-a", t, c["c9-36"]); sube("c9-b", t, c["c9-36"] + 0.2);
        persona("s9-a", t, { x: 130, y: 1440, s: 0.72, mira: 1, vivo: true, boca: [[0, "seria"], [c["c9-36"] + 0.3, "sonrisa"]], ojos: [[0, "normal"], [c["c9-36"] + 0.3, "felices"]], brazo: [[0, "abajo"]], fase: 1 });
        persona("s9-m", t, { x: 960, y: 1440, s: 0.78, mira: -1, vivo: true, charla: e, boca: habla(t, e, "sonrisa"), brazo: [[0, "abajo"], [c["c9-juguetes"] - 0.2, "senala"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c9-36"]]); } },

    // 10 · La abuela, con una naranja: «Pues este año cenamos juguetes. En mis tiempos, con una naranja ibas que te matabas.»
    { n: 10, set: "vacio",
      svg: `<g transform="translate(150 1260) scale(.72)">${arbol("s10-ar")}</g><g transform="translate(560 1420) scale(.8)">${mesaNochebuena("s10-me")}</g>${gente("s10", "a", { a: NARANJA_MANO })}${gente("s10", "m")}`,
      tarjeta: cita(10, "La abuela", `«En mis tiempos, una <mark id="m10">naranja</mark>»`),
      fn: function (t, e) {
        const c = e.c;
        ambiente("salon", null, t, 0);
        vidaFondo("sl", t, { lamparas: 1, capa: "salon" });
        for (let i = 0; i < 16; i++) css("s10-ar-b" + i, "opacity", 0.35 + 0.65 * ((Math.sin(t * 3.4 + i * 1.7) + 1) / 2));
        marca("m10", t, c["c10-naranja"]);
        persona("s10-a", t, { x: 300, y: 1440, s: 0.74, mira: 1, vivo: true, charla: e, boca: habla(t, e, "sonrisa"), brazo: [[0, "abajo"], [c["c10-naranja"] - 0.3, "arriba"]], salta: c["c10-matabas"], fase: 1 });
        persona("s10-m", t, { x: 960, y: 1440, s: 0.78, mira: -1, vivo: true, boca: [[0, "sonrisa"], [c["c10-juguetes"], "grande"]], ojos: [[0, "normal"], [c["c10-matabas"], "felices"]], brazo: [[0, "abajo"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c10-naranja"]]); } },

    // 11 · El mapa de platos. La madre: «Total: media hora más que en 2016 por la misma cena. ¿Y en tu casa, qué se come en Nochebuena?»
    { n: 11, set: "vacio",
      svg: `<g transform="translate(540 1075)">${mapaPlatos("s11-mp", 1.04)}</g>${gente("s11", "am")}`,
      tarjeta: tarjeta(11, "Te toca", `<div class="tit" style="font-size:56px">Media hora más de trabajo que en 2016 por la misma cena. ¿Qué se come en tu <mark id="m11">casa</mark> en Nochebuena?</div><div class="sub" id="c11-sub">Te leo en los comentarios.</div>`),
      fn: function (t, e) {
        const c = e.c;
        ambiente("salon", null, t, 0);
        vidaFondo("sl", t, { lamparas: 1, capa: "salon" });
        marca("m11", t, c["c11-casa"]); sube("c11-sub", t, c["c11-nochebuena"]);
        for (let i = 0; i < 12; i++) { const k = (t - e.t0 - 0.4 - i * 0.28) / 0.3; if (k < 0) ver(`s11-mp-p${i}`, false); else { ver(`s11-mp-p${i}`, true); css(`s11-mp-p${i}`, "opacity", clamp(k)); } }
        persona("s11-a", t, { x: 90, y: 1500, s: 0.6, mira: 1, vivo: true, boca: [[0, "sonrisa"]], brazo: [[0, "abajo"]], fase: 1 });
        persona("s11-m", t, { x: 990, y: 1500, s: 0.62, mira: [[0, -1], [c["c11-casa"], 0]], vivo: true, charla: e, boca: habla(t, e, "sonrisa"), brazo: [[0, "abajo"], [c["c11-casa"], "senala"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c11-casa"]]); } },
  ];
}
