// Escenas de T20 («¿Lotería o invertir?») en estilo «limpio». Bruno, 24-11-2026: la diferencia entre jugar a la lotería
// (azar, probabilidades bajísimas) e invertir de forma constante, y lo que se lleva Hacienda ahora y antes. Datos: INE
// (gasto del hogar), Tribunal de Cuentas en el BOE (décimos sin premio), BCE (S&P 500 en euros) y BOE/AEAT (gravamen).
//   · «compi»: unos 40, el compañero que invierte cada mes; jersey verde agua (voz «hombre»).
//   · «veterana»: unos 60, la de administración que lleva treinta años organizando el décimo de la oficina; canas, gafas
//     y rebeca mostaza (voz «hostelera»).
// Decorados: la cola de Doña Manolita y la oficina en Navidad de diseno/loteria.mjs, y el salón de T17 con el árbol (la familia).
// v2 (Bruno, 24-11-2026): sin repetir «el doble», la cola de Doña Manolita al empezar y una familia que se pasa un décimo.
/* eslint-disable no-undef */

import { persona, tarjeta, selloOficial } from "../../diseno/limpio.mjs";
import { bandera } from "../../diseno/barrio.mjs";
import { ambientes } from "../../diseno/sueno.mjs";
import { DECORADOS_T20, COLA_MANOLITA, mesaTrabajo, decimo, diezDecimos, barritasGasto, graficaBolsa, premioHacienda } from "../../diseno/loteria.mjs";
import { DECORADOS_T17 } from "../../diseno/carnet.mjs";
import { arbol } from "../../diseno/navidad.mjs";

export const ESTILO = "limpio";
const F_INE = "INE · Encuesta de Presupuestos Familiares";
const F_TCU = "Tribunal de Cuentas, informe publicado en el BOE";
const F_BOLSA = "Cálculo propio · INE y BCE (S&P 500 en euros, sin dividendos)";
const F_HAC = "BOE (Ley del IRPF) y Agencia Tributaria";

const rnd = (v) => { const f = Math.floor(v), d = v - f; return Math.abs(d - 0.5) < 1e-9 ? (f % 2 === 0 ? f : f + 1) : Math.round(v); };
const miles = (v) => String(rnd(v)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");

export function datos(d) {
  const inv = d.invertir;
  return { gasto: Object.fromEntries(Object.entries(d.gasto_juegos_azar_eur.por_hogar).map(([a, v]) => [a, v])), ln: d.loteria_nacional_2022,
           inv, caida08: d.bolsa_2008_caida_pct, grav: d.gravamen_premios };
}

export const capas = () => ambientes({ ...DECORADOS_T20, salon: DECORADOS_T17.salon });

// ------------------------------------------------------------------ personajes (inventados), con volumen
const GAFAS = `<g fill="none" stroke="#4A4038" stroke-width="5"><circle cx="-34" cy="-487" r="24"/><circle cx="34" cy="-487" r="24"/><path d="M-10 -492 Q0 -498 10 -492"/><path d="M-58 -492 L-92 -500 M58 -492 L92 -500"/></g>`;
const REBECA = `<path d="M0 -374 V-172" stroke="#8A6418" stroke-width="6"/>${[-336, -290, -244, -198].map((y) => `<circle cx="13" cy="${y}" r="7" fill="#FFF3D6"/>`).join("")}`;
const COMPI = { pelo: "corto", canas: false, barba: false, colorPelo: "#3A2A1E", ropa: ["#5E7F7A", "#4A6763"], piel: "#F0C7A2", volumen: true };
const VETERANA = { pelo: "largo", canas: true, barba: false, colorPelo: "#BDB6AC", ropa: ["#C8902E", "#A9781F"], piel: "#EBC3A0", piel2: "#D9AE8C", volumen: true, gorro: GAFAS, encima: REBECA };
const ABUELA = { pelo: "largo", canas: true, barba: false, colorPelo: "#D8D2C6", ropa: ["#7A3E5A", "#64324A"], piel: "#EBC3A0", piel2: "#D9AE8C", volumen: true };
const NIETO = { pelo: "corto", canas: false, barba: false, colorPelo: "#5A3A22", ropa: ["#5E8F5C", "#4C7A4A"], piel: "#F2CBA8", volumen: true };
const QUIEN = { c: COMPI, v: VETERANA, a: ABUELA, n: NIETO };
const DECIMO_MANO = `<g transform="translate(18 -46) rotate(-8) scale(.34)">${decimo("dm", "58213")}</g>`;
const gente = (n, quien, manos = {}) => quien.split("").map((k) => persona(`${n}-${k}`, "hoy", { ...QUIEN[k], mano: manos[k] ? `<g id="${n}-${k}-mano">${manos[k]}</g>` : undefined })).join("");

// ------------------------------------------------------------------ tarjetas
const HOY = "#B3261E", VERDE = "#3F7A4A";
const cita = (n, quien, html, fuente) => tarjeta(n, quien, `<div class="tit" style="font-size:64px">${html}</div>`, { tono: "hoy", fuente });
const grande = (n, titulo, cifra, sub, nota, fuente, color = HOY) => tarjeta(n, titulo, `<div class="tit" style="font-size:110px;color:${color};line-height:1" id="c${n}-a">${cifra}</div>
  <div class="sub" id="c${n}-b" style="font-size:44px">${sub}</div>${nota ? `<div class="nota">${nota}</div>` : ""}`, { fuente, icono: bandera(44) });
const vs = (n, vals, labs) => `<div class="vs">${vals.map((v, i) => `<div class="col"><div class="v" id="c${n}-${"ab"[i]}" style="font-size:84px;color:${i ? VERDE : "#5B6470"}">${v}</div><div class="n">${labs[i]}</div></div>`).join("")}</div>`;

export function escenas(D) {
  void COLA_MANOLITA;   // 34 personas en la cola (en fn va el número tal cual: solo vale el runtime)
  const I7 = D.inv["2007"], I16 = D.inv["2016"], I19 = D.inv["2019"];
  const FIN = { jugado: I7.jugado_eur, en_bolsa: I7.en_bolsa_eur, jugado_txt: miles(I7.jugado_eur) + " €", en_bolsa_txt: miles(I7.en_bolsa_eur) + " €" };
  const grafica = (id, marcas = [], bache = "") => `<g transform="translate(540 1270)">${graficaBolsa(id, I7.por_anyo, FIN, { W: 760, H: 500, marcas, bache })}</g>`;
  const oficina = "ambiente(\"oficinaNavidad\", null, t, 0);";   // (recordatorio: en fn solo vale el runtime)
  void oficina;
  return [
    // 1 · Gancho, en la cola de Doña Manolita (Madrid). El compañero pasa por delante: «¿Cuánto llevas jugado a la lotería desde 2007? ¿Y si lo hubieras metido en bolsa?»
    { n: 1, set: "vacio",
      svg: `${gente("s1", "c")}${selloOficial("s1-sello")}`,
      tarjeta: tarjeta(1, "Navidad · 2007, 2016, 2019 y hoy", `<div class="tit" style="font-size:66px">¿Lotería o <mark id="m1">invertir</mark>?</div>`, { icono: bandera(44) }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("calleManolita", null, t, 0);
        for (let i = 0; i < 22; i++) { css("ml-a" + i, "opacity", 0.45 + 0.55 * ((Math.sin(t * 4 + i * 1.3) + 1) / 2)); if (i < 16) css("ml-b" + i, "opacity", 0.45 + 0.55 * ((Math.sin(t * 3 + i * 0.9) + 1) / 2)); }
        for (let i = 0; i < 34; i++) attr("ml-q" + i, "transform", `translate(${(Math.sin(t * 1.1 + i * 2.3) * 2).toFixed(1)} ${(Math.abs(Math.sin(t * 0.9 + i * 1.7)) * -3).toFixed(1)})`);
        marca("m1", t, c["c1-bolsa"]);
        selloAnim("s1-sello", t, c["c1-sello"], 300, 780, { s: 0.8, r: -9 });
        const w = ruta(t, [[0.1, 1260], [1.4, 860]]);
        persona("s1-c", t, { x: w.x, y: 1760, s: 0.9, anda: w.anda, mira: [[0, -1], [c["c1-jugado"], 0]], vivo: true, charla: e, boca: habla(t, e, "sonrisa"), brazo: [[0, "abajo"], [c["c1-jugado"] - 0.2, "senala"], [c["c1-bolsa"] + 0.3, "hombros"]], espejo: true, fase: 1 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c1-jugado"], e.c["c1-bolsa"]]); } },

    // 2 · Llega la veterana con el décimo de la oficina: «Venga hombre que es el décimo de la oficina… como toque y no estés te da algo.»
    { n: 2, set: "vacio",
      svg: `${gente("s2", "c")}<g transform="translate(830 1440)">${mesaTrabajo("s2-me")}</g>${gente("s2", "v", { v: DECIMO_MANO })}`,
      tarjeta: cita(2, "La del décimo de la oficina", `«Como toque y no <mark id="m2">estés</mark>…»`),
      fn: function (t, e) {
        const c = e.c;
        ambiente("oficinaNavidad", null, t, 0);
        vidaFondo("ol", t, { lamparas: 2, gente: 2, capa: "oficinaNavidad", y: 1080, s: 0.42 });
        for (let i = 0; i < 12; i++) css("ol-b" + i, "opacity", 0.4 + 0.6 * ((Math.sin(t * 3.2 + i * 1.7) + 1) / 2));
        marca("m2", t, c["c2-toque"] + 0.3);
        const w = ruta(t, [[e.t0, -160], [e.t0 + 1.1, 300]]);
        persona("s2-v", t, { x: w.x, y: 1440, s: 0.78, anda: w.anda, mira: 1, vivo: true, charla: e, boca: habla(t, e, "sonrisa"), brazo: [[0, "senala"], [c["c2-decimo"], "arriba"], [c["c2-toque"], "senala"]], fase: 2 });
        persona("s2-c", t, { x: 600, y: 1440, s: 0.82, mira: -1, vivo: true, boca: [[0, "sonrisa"], [c["c2-algo"], "seria"]], ojos: [[0, "normal"], [c["c2-algo"], "normal"]], brazo: [[0, "abajo"], [c["c2-algo"], "hombros"]], fase: 1 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c2-decimo"]]); } },

    // 3 · En casa, la abuela le da un décimo al nieto; luego, el gasto del hogar (INE): «Un hogar medio se deja 104 euros al año en loterías y apuestas. En 2007 eran 186.»
    { n: 3, set: "vacio",
      svg: `<g transform="translate(140 1300) scale(.7)">${arbol("s3-ar")}</g>${gente("s3", "a")}${gente("s3", "n")}
        <g id="s3-dec"><g transform="scale(.34)">${decimo("s3-d", "58213")}</g></g>
        <g transform="translate(540 1150)">${barritasGasto("s3-g", D.gasto, { 2007: rnd(D.gasto["2007"]) + "\u00A0€", 2025: rnd(D.gasto["2025"]) + "\u00A0€" }, { W: 470, H: 260 })}</g>`,
      tarjeta: grande(3, "Lo que gasta un hogar al año en loterías y apuestas", rnd(D.gasto["2025"]) + "&nbsp;€", "En 2007, " + rnd(D.gasto["2007"]) + "&nbsp;€",
        `En 2016, ${rnd(D.gasto["2016"])}&nbsp;€; en 2019, ${rnd(D.gasto["2019"])}&nbsp;€. Lo que declaran los hogares`, F_INE),
      fn: function (t, e) {
        const c = e.c;
        ambiente("salon", "oficinaNavidad", t, e.t0);
        vidaFondo("sl", t, { lamparas: 1, capa: "salon" });
        for (let i = 0; i < 16; i++) css("s3-ar-b" + i, "opacity", 0.35 + 0.65 * ((Math.sin(t * 3.4 + i * 1.7) + 1) / 2));
        // el décimo pasa de la mano de la abuela a la del nieto, en arco
        const k = suave(clamp((t - c["c3-hogar"]) / 1.1)), x = 248 + (832 - 248) * k, y = 1270 - Math.sin(k * Math.PI) * 140;
        T("s3-dec", x, y, { s: 1, r: -8 + 16 * k });
        pop("s3-g", t, c["c3-apuestas"], 0, 0, { s: 1 });
        for (let i = 0; i < 19; i++) css("s3-g-b" + i, "transform", `scaleY(${suave(clamp((t - c["c3-apuestas"] - 0.2 - i * 0.05) / 0.35)).toFixed(3)})`);
        sube("c3-a", t, c["c3-104"]); sube("c3-b", t, c["c3-2007"]);
        persona("s3-a", t, { x: 172, y: 1440, s: 0.76, mira: 1, vivo: true, boca: [[0, "sonrisa"]], ojos: [[0, "felices"], [c["c3-apuestas"], "normal"]], brazo: [[0, "senala"], [c["c3-hogar"] + 1.2, "abajo"]], fase: 2 });
        persona("s3-n", t, { x: 908, y: 1440, s: 0.8, mira: -1, vivo: true, boca: [[0, "sonrisa"], [c["c3-hogar"] + 1.1, "grande"], [c["c3-apuestas"], "sonrisa"]], ojos: [[0, "normal"], [c["c3-hogar"] + 1.1, "felices"]], brazo: [[0, "abajo"], [c["c3-hogar"] + 0.5, "senala"]], espejo: true, fase: 1 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c3-104"]]); } },

    // 4 · Diez décimos, siete sin premio (Tribunal de Cuentas): «Y de cada diez décimos siete no cobran nada. Ni el reintegro.»
    { n: 4, set: "vacio",
      svg: `<g transform="translate(540 1110) scale(.82)">${diezDecimos("s4-d")}</g>${gente("s4", "vc")}`,
      tarjeta: tarjeta(4, "Lotería Nacional, 2022", `<div class="tit" style="font-size:72px;line-height:1.05"><span id="c4-a" style="color:${HOY}">${D.ln.sin_premio_de_cada_10} de cada 10</span> décimos no cobran nada</div>
        <div class="nota">${String(D.ln.decimos_millones).replace(".", ",")} millones de décimos y ${String(D.ln.premios_num_millones).replace(".", ",")} millones de premios. Vuelve el ${rnd(D.ln.vuelve_pct)}&nbsp;% de lo jugado</div>`, { fuente: F_TCU, icono: bandera(44) }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("oficinaNavidad", null, t, 0);
        vidaFondo("ol", t, { lamparas: 2, gente: 2, capa: "oficinaNavidad", y: 1080, s: 0.42 });
        for (let i = 0; i < 10; i++) {
          pop(`s4-d-d${i}`, t, c["c4-diez"] - 0.3 + i * 0.07, 0, 0, { s: 1 });
          const k = clamp((t - c["c4-siete"] - i * 0.12) / 0.2);
          css(`s4-d-x${i}`, "opacity", k);
          if (i < 7) { const f = clamp((t - c["c4-reintegro"] - 0.2 - i * 0.05) / 0.5); attr(`s4-d-dd${i}`, "opacity", (1 - 0.6 * f).toFixed(2)); }
        }
        sube("c4-a", t, c["c4-siete"]);
        persona("s4-v", t, { x: 120, y: 1700, s: 0.62, mira: 1, vivo: true, boca: [[0, "seria"], [c["c4-siete"] + 0.4, "o"]], ojos: [[0, "normal"], [c["c4-siete"] + 0.4, "grandes"]], brazo: [[0, "abajo"]], fase: 2 });
        persona("s4-c", t, { x: 960, y: 1700, s: 0.64, mira: -1, vivo: true, charla: e, boca: habla(t, e, "seria"), brazo: [[0, "abajo"], [c["c4-diez"] - 0.2, "senala"]], espejo: true, fase: 1 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c4-siete"]]); } },

    // 5 · La ilusión: «Ya majo pero la ilusión no tiene precio.»
    { n: 5, set: "vacio",
      svg: `<g transform="translate(830 1440)">${mesaTrabajo("s5-me")}</g>${gente("s5", "c")}${gente("s5", "v", { v: DECIMO_MANO })}`,
      tarjeta: cita(5, "La del décimo de la oficina", `«La <mark id="m5">ilusión</mark> no tiene precio»`),
      fn: function (t, e) {
        const c = e.c;
        ambiente("oficinaNavidad", null, t, 0);
        vidaFondo("ol", t, { lamparas: 2, gente: 2, capa: "oficinaNavidad", y: 1080, s: 0.42 });
        for (let i = 0; i < 12; i++) css("ol-b" + i, "opacity", 0.4 + 0.6 * ((Math.sin(t * 3.2 + i * 1.7) + 1) / 2));
        marca("m5", t, c["c5-ilusion"]);
        persona("s5-v", t, { x: 300, y: 1440, s: 0.78, mira: 1, vivo: true, charla: e, boca: habla(t, e, "sonrisa"), ojos: [[0, "normal"], [c["c5-ilusion"], "felices"]], brazo: [[0, "sujeta"], [c["c5-ilusion"], "arriba"]], incl: [[0, 0], [c["c5-ilusion"], -5]], fase: 2 });
        persona("s5-c", t, { x: 600, y: 1440, s: 0.82, mira: -1, vivo: true, boca: [[0, "sonrisa"], [c["c5-ilusion"] + 0.3, "seria"]], brazo: [[0, "abajo"], [c["c5-ilusion"] + 0.3, "hombros"]], fase: 1 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c5-ilusion"]]); } },

    // 6 · La gráfica desde 2007: «Pues mira lo que cuesta. Si desde 2007 metes ese dinero en bolsa cada Navidad… casi tres mil euros hoy son trece mil.»
    { n: 6, set: "vacio",
      svg: `${grafica("s6-g")}${gente("s6", "vc")}`,
      tarjeta: tarjeta(6, "Si desde 2007 lo metes en bolsa", vs(6, [miles(I7.jugado_eur) + "&nbsp;€", miles(I7.en_bolsa_eur) + "&nbsp;€"], ["jugado", "en bolsa hoy"]), { fuente: F_BOLSA, icono: bandera(44) }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("oficinaNavidad", null, t, 0);
        vidaFondo("ol", t, { lamparas: 2, gente: 2, capa: "oficinaNavidad", y: 1080, s: 0.42 });
        pop("s6-g", t, e.t0 + 0.1, 0, 0, { s: 1 });
        const k = suave(clamp((t - c["c6-bolsa"]) / (c["c6-trece"] - c["c6-bolsa"] + 0.3)));
        for (const l of ["s6-g-lj", "s6-g-lb"]) { const L = +$(l).dataset.largo; attr(l, "stroke-dashoffset", (L * (1 - k)).toFixed(1)); }
        css("s6-g-fj", "opacity", clamp((t - c["c6-tres"]) / 0.3)); css("s6-g-fb", "opacity", clamp((t - c["c6-trece"]) / 0.3));
        sube("c6-a", t, c["c6-tres"]); sube("c6-b", t, c["c6-trece"]);
        persona("s6-v", t, { x: 120, y: 1890, s: 0.6, mira: 1, vivo: true, boca: [[0, "seria"], [c["c6-trece"] + 0.3, "o"]], ojos: [[0, "normal"], [c["c6-trece"] + 0.3, "grandes"]], brazo: [[0, "abajo"]], fase: 2 });
        persona("s6-c", t, { x: 960, y: 1890, s: 0.62, mira: -1, vivo: true, charla: e, boca: habla(t, e, "sonrisa"), brazo: [[0, "abajo"], [c["c6-bolsa"] - 0.2, "senala"]], espejo: true, fase: 1 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c6-trece"]], { acerca: 0.01 }); } },

    // 7 · La duda de 2008: «¿Y lo de 2008 qué? Que la bolsa también se hunde.»
    { n: 7, set: "vacio",
      svg: `${grafica("s7-g", [], "2008: −" + rnd(-D.caida08) + "\u00A0%")}${gente("s7", "vc")}`,
      tarjeta: cita(7, "La del décimo de la oficina", `«¿Y lo de <mark id="m7">2008</mark>?»`, F_BOLSA),
      fn: function (t, e) {
        const c = e.c;
        ambiente("oficinaNavidad", null, t, 0);
        vidaFondo("ol", t, { lamparas: 2, gente: 2, capa: "oficinaNavidad", y: 1080, s: 0.42 });
        css("s7-g-fj", "opacity", 1); css("s7-g-fb", "opacity", 1);
        css("s7-g-bache", "opacity", clamp((t - c["c7-2008"]) / 0.3));
        marca("m7", t, c["c7-2008"]);
        persona("s7-v", t, { x: 120, y: 1890, s: 0.6, mira: 1, vivo: true, charla: e, boca: habla(t, e, "seria"), brazo: [[0, "abajo"], [c["c7-2008"] - 0.2, "senala"]], incl: [[0, 0], [c["c7-hunde"], 5]], fase: 2 });
        persona("s7-c", t, { x: 960, y: 1890, s: 0.62, mira: -1, vivo: true, boca: [[0, "sonrisa"], [c["c7-hunde"], "seria"]], brazo: [[0, "abajo"]], espejo: true, fase: 1 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c7-2008"]], { acerca: 0.01 }); } },

    // 8 · Empieces cuando empieces: «Claro que se hunde… en 2008 un 36 %. Pero empieces cuando empieces gana. Desde 2016 el doble y desde 2019 casi el doble.»
    { n: 8, set: "vacio",
      svg: `${grafica("s8-g", [2016, 2019], "2008: −" + rnd(-D.caida08) + "\u00A0%")}${gente("s8", "vc")}`,
      tarjeta: tarjeta(8, "Si empiezas en 2016", `${vs(8, [miles(I16.jugado_eur) + "&nbsp;€", miles(I16.en_bolsa_eur) + "&nbsp;€"], ["jugado", "en bolsa hoy"])}
        <div class="nota">Desde 2019: ${I19.jugado_eur}&nbsp;€ jugados y ${miles(I19.en_bolsa_eur)}&nbsp;€ en bolsa. En 2008 la bolsa cayó un ${rnd(-D.caida08)}&nbsp;%</div>`, { fuente: F_BOLSA, icono: bandera(44) }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("oficinaNavidad", null, t, 0);
        vidaFondo("ol", t, { lamparas: 2, gente: 2, capa: "oficinaNavidad", y: 1080, s: 0.42 });
        css("s8-g-fj", "opacity", 1); css("s8-g-fb", "opacity", 1);
        css("s8-g-bache", "opacity", t < c["c8-empieces"] ? 1 : 1 - clamp((t - c["c8-empieces"]) / 0.4));
        css("s8-g-m2016", "opacity", clamp((t - c["c8-2016"]) / 0.3)); css("s8-g-m2019", "opacity", clamp((t - c["c8-2019"]) / 0.3));
        sube("c8-a", t, c["c8-2016"]); sube("c8-b", t, c["c8-2016"] + 0.3);
        persona("s8-v", t, { x: 120, y: 1890, s: 0.6, mira: 1, vivo: true, boca: [[0, "seria"], [c["c8-empieces"] + 0.4, "o"]], brazo: [[0, "abajo"]], fase: 2 });
        persona("s8-c", t, { x: 960, y: 1890, s: 0.62, mira: -1, vivo: true, charla: e, boca: habla(t, e, "sonrisa"), brazo: [[0, "abajo"], [c["c8-36"] - 0.2, "hombros"], [c["c8-empieces"], "senala"]], espejo: true, fase: 1 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c8-2016"]], { acerca: 0.01 }); } },

    // 9 · El sueño del Gordo: «¿Y si me toca el Gordo listo?»
    { n: 9, set: "vacio",
      svg: `<g transform="translate(830 1440)">${mesaTrabajo("s9-me")}</g>${gente("s9", "c")}${gente("s9", "v")}
        <g id="s9-nube"><ellipse rx="300" ry="170" fill="#FFFDF8" opacity=".95"/><circle cx="-150" cy="182" r="26" fill="#FFFDF8" opacity=".95"/><circle cx="-185" cy="232" r="16" fill="#FFFDF8" opacity=".95"/>
          <g transform="translate(-40 40) scale(.9)">${premioHacienda("s9-p")}</g></g>`,
      tarjeta: cita(9, "La del décimo de la oficina", `«¿Y si me toca el <mark id="m9">Gordo</mark>?»`),
      fn: function (t, e) {
        const c = e.c;
        ambiente("oficinaNavidad", null, t, 0);
        vidaFondo("ol", t, { lamparas: 2, gente: 2, capa: "oficinaNavidad", y: 1080, s: 0.42 });
        for (let i = 0; i < 12; i++) css("ol-b" + i, "opacity", 0.4 + 0.6 * ((Math.sin(t * 3.2 + i * 1.7) + 1) / 2));
        marca("m9", t, c["c9-gordo"]);
        ver("s9-p-s", false);
        pop("s9-nube", t, c["c9-gordo"] - 0.2, 600, 740, { s: 1 });
        persona("s9-v", t, { x: 300, y: 1440, s: 0.78, mira: 1, vivo: true, charla: e, boca: habla(t, e, "sonrisa"), ojos: [[0, "normal"], [c["c9-gordo"], "felices"]], brazo: [[0, "abajo"], [c["c9-gordo"], "arriba"]], salta: c["c9-gordo"] + 0.2, fase: 2 });
        persona("s9-c", t, { x: 600, y: 1440, s: 0.82, mira: -1, vivo: true, boca: [[0, "sonrisa"]], brazo: [[0, "abajo"]], fase: 1 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c9-gordo"]]); } },

    // 10 · Hacienda: «Pues Hacienda se queda el 20 % de lo que pase de 40.000 euros. En 2007 nada.»
    { n: 10, set: "vacio",
      svg: `<g transform="translate(470 1150)">${premioHacienda("s10-p")}</g>${gente("s10", "vc")}`,
      tarjeta: grande(10, "Premios de lotería: lo que se queda Hacienda", `${D.grav.tipo_pct}&nbsp;%`, `de lo que pase de ${miles(D.grav.exento_eur.hoy)}&nbsp;€`,
        `Desde 2013; en 2007, nada. Exento: ${miles(D.grav.exento_eur["2013-2017"])}&nbsp;€ hasta 2017 y ${miles(D.grav.exento_eur["2019"])}&nbsp;€ en 2019`, F_HAC),
      fn: function (t, e) {
        const c = e.c;
        ambiente("oficinaNavidad", null, t, 0);
        vidaFondo("ol", t, { lamparas: 2, gente: 2, capa: "oficinaNavidad", y: 1080, s: 0.42 });
        pop("s10-p", t, e.t0, 0, 0, { s: 1 });
        const k = suave(clamp((t - c["c10-20"] - 0.1) / 0.8));
        attr("s10-p-h", "transform", `translate(${(190 * k).toFixed(1)} ${(60 * k).toFixed(1)}) scale(${(1 - 0.55 * k).toFixed(3)})`);
        sube("c10-a", t, c["c10-20"]); sube("c10-b", t, c["c10-40000"]);
        persona("s10-v", t, { x: 120, y: 1700, s: 0.62, mira: 1, vivo: true, boca: [[0, "sonrisa"], [c["c10-20"] + 0.4, "o"]], ojos: [[0, "normal"], [c["c10-20"] + 0.4, "grandes"]], brazo: [[0, "abajo"]], fase: 2 });
        persona("s10-c", t, { x: 960, y: 1700, s: 0.64, mira: -1, vivo: true, charla: e, boca: habla(t, e, "seria"), brazo: [[0, "abajo"], [c["c10-20"] - 0.2, "senala"], [c["c10-nada"], "hombros"]], espejo: true, fase: 1 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c10-20"]]); } },

    // 11 · La pregunta: «¿Y tú qué haces este año décimo o bolsa? ¿Ilusión o impuesto voluntario?»
    { n: 11, set: "vacio",
      svg: `<g transform="translate(830 1440)">${mesaTrabajo("s11-me")}</g>${gente("s11", "c")}${gente("s11", "v", { v: DECIMO_MANO })}`,
      tarjeta: tarjeta(11, "Te toca", `<div class="tit" style="font-size:60px">¿Décimo o <mark id="m11">bolsa</mark>?</div><div class="sub" id="c11-sub" style="font-size:46px;font-weight:800">¿Ilusión o impuesto voluntario?</div>`),
      fn: function (t, e) {
        const c = e.c;
        ambiente("oficinaNavidad", null, t, 0);
        vidaFondo("ol", t, { lamparas: 2, gente: 2, capa: "oficinaNavidad", y: 1080, s: 0.42 });
        for (let i = 0; i < 12; i++) css("ol-b" + i, "opacity", 0.4 + 0.6 * ((Math.sin(t * 3.2 + i * 1.7) + 1) / 2));
        marca("m11", t, c["c11-bolsa"]); sube("c11-sub", t, c["c11-ilusion"]);
        persona("s11-v", t, { x: 300, y: 1440, s: 0.78, mira: [[0, 1], [c["c11-ilusion"], 0]], vivo: true, boca: [[0, "sonrisa"]], brazo: [[0, "abajo"], [c["c11-decimo"], "arriba"]], fase: 2 });
        persona("s11-c", t, { x: 600, y: 1440, s: 0.82, mira: [[0, -1], [c["c11-decimo"], 0]], vivo: true, charla: e, boca: habla(t, e, "sonrisa"), brazo: [[0, "abajo"], [c["c11-bolsa"], "senala"], [c["c11-ilusion"], "hombros"]], fase: 1 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c11-ilusion"]]); } },
  ];
}
