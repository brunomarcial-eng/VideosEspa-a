// Escenas de T21 («¿El alquiler te cuesta más horas de trabajo que en 2007?») en estilo «limpio». Bruno, 24-11-2026:
// el alquiler medio de los hogares inquilinos en horas del sueldo neto mediano (2007, 2016, 2019 y hoy) y quién alquila
// (hogares de 30 a 44 años con casa propia o de alquiler, INE).
//   · «hermano»: unos 32, pelo corto oscuro, sudadera mostaza; vive de alquiler y acaba de mudarse (voz «hijo»).
//   · «hermana»: unos 45, media melena castaña, jersey malva; alquiló en 2007 y luego compró (voz «medica»).
// Decorados (diseno/alquiler.mjs): el piso de alquiler con cajas y la calle de barrio con los dos bloques de pisos.
/* eslint-disable no-undef */

import { persona, tarjeta, selloOficial } from "../../diseno/limpio.mjs";
import { bandera } from "../../diseno/barrio.mjs";
import { ambientes } from "../../diseno/sueno.mjs";
import { DECORADOS_T21, cajaMudanza, sobre, semana, columnasHoras, bloque, movil } from "../../diseno/alquiler.mjs";

export const ESTILO = "limpio";
const F_2007 = "Cálculo propio · Microdatos de la EPF del INE";
const F_HOY = "INE · EPF y Estructura Salarial · Cálculo propio";
const F_HORAS = "Cálculo propio · INE";
const F_ECV = "INE · Encuesta de Condiciones de Vida";

const miles = (v) => String(Math.round(v)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
const es = (v, d = 1) => v.toFixed(d).replace(".", ",");

export function datos(d) {
  const A = d.alquiler, q = d.quien_alquila["30_44"];
  return { A, prop: q.propiedad_pct, merc: q.alquiler_mercado_pct, horas: ["2007", "2016", "2019", "2025"].map((a) => A[a].horas_mes) };
}

export const capas = () => ambientes({ pisoAlquiler: DECORADOS_T21.pisoAlquiler, barrioBloques: DECORADOS_T21.barrioBloques });

// ------------------------------------------------------------------ personajes (inventados), con volumen
const HERMANO = { pelo: "corto", canas: false, barba: false, colorPelo: "#2A1E16", ropa: ["#D9A23B", "#B9862C"], piel: "#E4B48F", piel2: "#D4A07A", volumen: true };
const HERMANA = { pelo: "largo", canas: false, barba: false, colorPelo: "#7A5236", ropa: ["#8E6F9E", "#765A85"], piel: "#F2CBA8", volumen: true };
const QUIEN = { o: HERMANO, a: HERMANA };
const gente = (n, quien) => quien.split("").map((k) => persona(`${n}-${k}`, "hoy", QUIEN[k])).join("");

// ------------------------------------------------------------------ tarjetas
const HOY = "#B3261E";
const cita = (n, quien, html) => tarjeta(n, quien, `<div class="tit" style="font-size:64px">${html}</div>`, { tono: "hoy" });
const grande = (n, titulo, cifra, sub, nota, fuente, color = HOY) => tarjeta(n, titulo, `<div class="tit" style="font-size:104px;color:${color};line-height:1" id="c${n}-a">${cifra}</div>
  <div class="sub" id="c${n}-b" style="font-size:42px">${sub}</div>${nota ? `<div class="nota">${nota}</div>` : ""}`, { fuente, icono: bandera(44) });
const vs = (n, titulo, vals, labs, nota, fuente) => tarjeta(n, titulo, `<div class="vs">${vals.map((v, i) => `<div class="col"><div class="v ${i ? "t-hoy" : "t-pasado"}" id="c${n}-${"ab"[i]}" style="font-size:96px">${v}</div><div class="n">${labs[i]}</div></div>`).join("")}</div>
  <div class="nota">${nota}</div>`, { fuente, icono: bandera(44) });

export function escenas(D) {
  const h = D.horas.map((x) => Math.round(x));
  const pct = (v) => `${Math.round(v)}&nbsp;%`;
  const cajas = (n) => `<g transform="translate(540 1330)">${cajaMudanza(`s${n}-cj`, 240, 170, "")}</g>`;
  const COLS = (id) => columnasHoras(id, D.horas, ["2007", "2016", "2019", "Hoy"], { W: 760, H: 380 });
  const notaHoras = (a, b) => `${a}. Alquiler medio de los hogares inquilinos entre el sueldo neto mediano por hora`;
  return [
    // 1 · Gancho. El piso de alquiler con cajas. El hermano: «¿Pagar el alquiler te cuesta hoy más horas de curro que en 2007? Porque mi hermana dice que no…»
    { n: 1, set: "vacio",
      svg: `${cajas(1)}${gente("s1", "ao")}${selloOficial("s1-sello")}`,
      tarjeta: tarjeta(1, "El alquiler · 2007, 2016, 2019 y hoy", `<div class="tit" style="font-size:64px">¿El alquiler te cuesta hoy más <mark id="m1">horas</mark> que en 2007?</div>`, { icono: bandera(44) }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("pisoAlquiler", null, t, 0);
        vidaFondo("pa", t, { lamparas: 1, capa: "pisoAlquiler" });
        marca("m1", t, c["c1-horas"]);
        selloAnim("s1-sello", t, c["c1-sello"], 300, 780, { s: 0.8, r: -9 });
        persona("s1-a", t, { x: 300, y: 1440, s: 0.78, mira: 1, vivo: true, boca: [[0, "sonrisa"], [c["c1-hermana"], "seria"]], ojos: [[0, "normal"]], brazo: [[0, "abajo"], [c["c1-hermana"] + 0.4, "hombros"]], fase: 1 });
        persona("s1-o", t, { x: 790, y: 1440, s: 0.8, mira: [[0, 0], [c["c1-hermana"] - 0.2, -1]], vivo: true, charla: e, boca: habla(t, e, "sonrisa"), brazo: [[0, "abajo"], [c["c1-horas"] - 0.2, "senala"], [c["c1-hermana"], "abajo"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c1-horas"], e.c["c1-hermana"]]); } },

    // 2 · El alquiler de 2007 (microdatos de la EPF). La hermana: «Hombre… en 2007 el alquiler medio eran 369 euros y se cobraba bastante menos ¿eh?»
    { n: 2, set: "vacio",
      svg: `${cajas(2)}<g transform="translate(540 1110)">${sobre("s2-s", "ALQUILER", 2, 0.9)}</g>${gente("s2", "ao")}`,
      tarjeta: grande(2, "El alquiler en 2007", `${D.A["2007"].alquiler_mes}&nbsp;€`, "al mes, de media",
        `Lo que pagaban de media los hogares inquilinos. Sueldo neto mediano: ${miles(D.A["2007"].neto_mes_mediano)}&nbsp;€ al mes`, F_2007),
      fn: function (t, e) {
        const c = e.c;
        ambiente("pisoAlquiler", null, t, 0);
        vidaFondo("pa", t, { lamparas: 1, capa: "pisoAlquiler" });
        pop("s2-s", t, c["c2-369"] - 0.3, 0, 0, { s: 1 });
        sube("c2-a", t, c["c2-369"]); sube("c2-b", t, c["c2-369"] + 0.3);
        persona("s2-a", t, { x: 130, y: 1700, s: 0.64, mira: 1, vivo: true, charla: e, boca: habla(t, e, "sonrisa"), brazo: [[0, "abajo"], [c["c2-369"] - 0.3, "senala"], [c["c2-menos"], "hombros"]], fase: 1 });
        persona("s2-o", t, { x: 950, y: 1700, s: 0.66, mira: -1, vivo: true, boca: [[0, "seria"]], brazo: [[0, "abajo"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c2-369"]]); } },

    // 3 · Hoy, en horas (EPF y sueldo neto mediano por hora). El hermano: «Ya pero hoy son 534. O sea 41 horas de curro al mes con el sueldo mediano… una semana entera.»
    { n: 3, set: "vacio",
      svg: `<g transform="translate(540 900)">${sobre("s3-s", "ALQUILER", 4, 0.85)}</g><g transform="translate(540 1270) scale(.92)">${semana("s3-w")}</g>${gente("s3", "ao")}`,
      tarjeta: grande(3, "El alquiler hoy", `${D.A["2025"].alquiler_mes}&nbsp;€`, `al mes = <b style="color:${HOY}">${h[3]} horas de trabajo</b>`,
        `Sueldo neto mediano: ${es(D.A["2025"].neto_hora_mediana, 2)}&nbsp;€ la hora. Es la media de todos los inquilinos, con contratos viejos y nuevos`, F_HOY),
      fn: function (t, e) {
        const c = e.c;
        ambiente("pisoAlquiler", null, t, 0);
        vidaFondo("pa", t, { lamparas: 1, capa: "pisoAlquiler" });
        pop("s3-s", t, c["c3-534"] - 0.3, 0, 0, { s: 1 });
        pop("s3-w", t, c["c3-41"] - 0.2, 0, 0, { s: 1 });
        for (let i = 0; i < 5; i++) css(`s3-w-x${i}`, "opacity", clamp((t - c["c3-semana"] - i * 0.22) / 0.15));
        sube("c3-a", t, c["c3-534"]); sube("c3-b", t, c["c3-41"]);
        persona("s3-a", t, { x: 130, y: 1700, s: 0.64, mira: 1, vivo: true, boca: [[0, "seria"], [c["c3-semana"] + 0.3, "o"]], ojos: [[0, "normal"]], brazo: [[0, "abajo"]], fase: 1 });
        persona("s3-o", t, { x: 950, y: 1700, s: 0.66, mira: -1, vivo: true, charla: e, boca: habla(t, e, "seria"), brazo: [[0, "abajo"], [c["c3-534"] - 0.2, "senala"], [c["c3-semana"], "hombros"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c3-41"]]); } },

    // 4 · Las horas en los cuatro años. La hermana: «Pues en 2007 eran 42. Las mismas horas más o menos fíjate.»
    { n: 4, set: "vacio",
      svg: `<g transform="translate(540 1290)">${COLS("s4-h")}</g>${gente("s4", "ao")}`,
      tarjeta: vs(4, "Horas de trabajo para pagar un mes de alquiler", [`${h[0]}&nbsp;h`, `${h[3]}&nbsp;h`], ["en 2007", "hoy"], notaHoras(`2016: ${h[1]} · 2019: ${h[2]}`), F_HORAS),
      fn: function (t, e) {
        const c = e.c;
        ambiente("pisoAlquiler", null, t, 0);
        vidaFondo("pa", t, { lamparas: 1, capa: "pisoAlquiler" });
        pop("s4-h", t, e.t0 + 0.05, 0, 0, { s: 1 });
        for (let i = 0; i < 4; i++) {
          const k = suave(clamp((t - c["c4-2007"] - i * 0.28) / 0.5));
          css(`s4-h-b${i}`, "transform", `scaleY(${k.toFixed(3)})`); css(`s4-h-v${i}`, "opacity", k);
        }
        sube("c4-a", t, c["c4-42"]); sube("c4-b", t, c["c4-mismas"]);
        persona("s4-a", t, { x: 130, y: 1700, s: 0.64, mira: 1, vivo: true, charla: e, boca: habla(t, e, "sonrisa"), brazo: [[0, "abajo"], [c["c4-42"] - 0.2, "senala"], [c["c4-mismas"], "hombros"]], fase: 1 });
        persona("s4-o", t, { x: 950, y: 1700, s: 0.66, mira: -1, vivo: true, boca: [[0, "seria"], [c["c4-mismas"] + 0.3, "o"]], ojos: [[0, "normal"], [c["c4-mismas"] + 0.3, "grandes"]], brazo: [[0, "abajo"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c4-42"]]); } },

    // 5 · El hermano no se lo cree: «Anda ya… ¿y por qué todos mis amigos dicen que no llegan?»
    { n: 5, set: "vacio",
      svg: `${cajas(5)}<g transform="translate(560 1020) scale(1.12)">${movil("s5-m")}</g>${gente("s5", "ao")}`,
      tarjeta: cita(5, "El hermano", `«¿Y por qué no <mark id="m5">llegan</mark>?»`),
      fn: function (t, e) {
        const c = e.c;
        ambiente("pisoAlquiler", null, t, 0);
        vidaFondo("pa", t, { lamparas: 1, capa: "pisoAlquiler" });
        pop("s5-m", t, c["c5-amigos"] - 0.4, 0, 0, { s: 1 });
        [c["c5-amigos"], c["c5-amigos"] + 0.6, c["c5-llegan"]].forEach((x, i) => css(`s5-m-m${i}`, "opacity", clamp((t - x) / 0.2)));
        marca("m5", t, c["c5-llegan"]);
        persona("s5-a", t, { x: 130, y: 1700, s: 0.64, mira: 1, vivo: true, boca: [[0, "sonrisa"]], brazo: [[0, "abajo"], [c["c5-llegan"] + 0.3, "hombros"]], fase: 1 });
        persona("s5-o", t, { x: 950, y: 1700, s: 0.66, mira: -1, vivo: true, charla: e, boca: habla(t, e, "seria"), brazo: [[0, "abajo"], [c["c5-anda"], "arriba"], [c["c5-amigos"], "senala"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c5-anda"]]); } },

    // 6 · Frente a 2016, peor. La hermana: «Bueno desde 2016 sí que ha subido… eran 39.»
    { n: 6, set: "vacio",
      svg: `<g transform="translate(540 1290)">${COLS("s6-h")}</g>${gente("s6", "ao")}`,
      tarjeta: vs(6, "Horas de trabajo para pagar un mes de alquiler", [`${h[1]}&nbsp;h`, `${h[3]}&nbsp;h`], ["en 2016", "hoy"], notaHoras(`2007: ${h[0]} · 2019: ${h[2]}`), F_HORAS),
      fn: function (t, e) {
        const c = e.c;
        ambiente("pisoAlquiler", null, t, 0);
        vidaFondo("pa", t, { lamparas: 1, capa: "pisoAlquiler" });
        const k = suave(clamp((t - c["c6-2016"]) / 0.5));
        for (const i of [0, 2]) { css(`s6-h-b${i}`, "opacity", 1 - 0.65 * k); css(`s6-h-v${i}`, "opacity", 1 - 0.65 * k); }
        const b = suave(clamp((t - c["c6-subido"]) / 0.4));
        css("s6-h-b1", "transform", `scaleX(${(1 + 0.12 * Math.sin(Math.PI * clamp((t - c["c6-2016"]) / 0.5))).toFixed(3)})`);
        css("s6-h-b3", "transform", `scaleX(${(1 + 0.12 * Math.sin(Math.PI * b)).toFixed(3)})`);
        sube("c6-a", t, e.t0 - 1); sube("c6-b", t, e.t0 - 1);
        persona("s6-a", t, { x: 130, y: 1700, s: 0.64, mira: 1, vivo: true, charla: e, boca: habla(t, e, "seria"), brazo: [[0, "piensa"], [c["c6-2016"], "senala"]], incl: [[0, -5], [c["c6-2016"], 0]], fase: 1 });
        persona("s6-o", t, { x: 950, y: 1700, s: 0.66, mira: -1, vivo: true, boca: [[0, "seria"], [c["c6-subido"] + 0.2, "sonrisa"]], ojos: [[0, "normal"]], brazo: [[0, "abajo"], [c["c6-subido"] + 0.2, "hombros"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c6-subido"]]); } },

    // 7 · Quién tiene casa propia (ECV). El hermano: «Y porque alquilamos muchos más. En 2007 tres de cada cuatro de mi edad tenían piso propio y hoy poco más de la mitad.»
    { n: 7, set: "vacio",
      svg: `<g transform="translate(290 1335) scale(.86)">${bloque("s7-x", "2007", 15, 0)}</g><g transform="translate(790 1335) scale(.86)">${bloque("s7-y", "Hoy", 11, 0, "#D6C3A8")}</g>${gente("s7", "ao")}`,
      tarjeta: vs(7, "Hogares de 30 a 44 años con casa en propiedad", [pct(D.prop["2007"]), pct(D.prop["2025"])], ["en 2007", "hoy"],
        `2016: ${pct(D.prop["2016"])} · 2019: ${pct(D.prop["2019"])}`, F_ECV),
      fn: function (t, e) {
        const c = e.c;
        ambiente("barrioBloques", "pisoAlquiler", t, e.t0);
        vidaFondo("bb", t, { capa: "barrioBloques" });
        for (let i = 0; i < 20; i++) {
          css(`s7-x-k${i}`, "opacity", clamp((t - c["c7-2007"] - (i % 15) * 0.05) / 0.2));
          css(`s7-y-k${i}`, "opacity", clamp((t - c["c7-hoy"] - (i % 11) * 0.05) / 0.2));
        }
        sube("c7-a", t, c["c7-2007"]); sube("c7-b", t, c["c7-mitad"]);
        persona("s7-a", t, { x: 120, y: 1800, s: 0.5, mira: 1, vivo: true, boca: [[0, "seria"], [c["c7-mitad"] + 0.3, "o"]], ojos: [[0, "normal"]], brazo: [[0, "abajo"]], fase: 1 });
        persona("s7-o", t, { x: 960, y: 1800, s: 0.52, mira: -1, vivo: true, charla: e, boca: habla(t, e, "seria"), brazo: [[0, "abajo"], [c["c7-2007"] - 0.2, "senala"], [c["c7-mitad"], "hombros"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c7-mitad"]]); } },

    // 8 · Quién alquila (ECV). La hermana: «Eso sí. Y los que alquilan a precio de mercado se han duplicado… del 16 al 32 %.»
    { n: 8, set: "vacio",
      svg: `<g transform="translate(290 1335) scale(.86)">${bloque("s8-x", "2007", 15, 3)}</g><g transform="translate(790 1335) scale(.86)">${bloque("s8-y", "Hoy", 11, 6, "#D6C3A8")}</g>${gente("s8", "ao")}`,
      tarjeta: vs(8, "Hogares de 30 a 44 años de alquiler a precio de mercado", [pct(D.merc["2007"]), pct(D.merc["2025"])], ["en 2007", "hoy"],
        `2016: ${pct(D.merc["2016"])} · 2019: ${pct(D.merc["2019"])}`, F_ECV),
      fn: function (t, e) {
        const c = e.c;
        ambiente("barrioBloques", null, t, 0);
        vidaFondo("bb", t, { capa: "barrioBloques" });
        for (let i = 0; i < 20; i++) {
          css(`s8-x-k${i}`, "opacity", 1); css(`s8-y-k${i}`, "opacity", 1);
          css(`s8-x-a${i}`, "opacity", clamp((t - c["c8-16"] - (i % 3) * 0.12) / 0.2));
          css(`s8-y-a${i}`, "opacity", clamp((t - c["c8-32"] - (i % 6) * 0.1) / 0.2));
        }
        sube("c8-a", t, c["c8-16"]); sube("c8-b", t, c["c8-32"]);
        persona("s8-a", t, { x: 120, y: 1800, s: 0.5, mira: 1, vivo: true, charla: e, boca: habla(t, e, "seria"), brazo: [[0, "abajo"], [c["c8-alquilan"], "senala"], [c["c8-32"] + 0.3, "hombros"]], fase: 1 });
        persona("s8-o", t, { x: 960, y: 1800, s: 0.52, mira: -1, vivo: true, boca: [[0, "seria"], [c["c8-32"] + 0.2, "o"]], ojos: [[0, "normal"], [c["c8-32"] + 0.2, "grandes"]], brazo: [[0, "abajo"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c8-32"]]); } },

    // 9 · Veredicto y pregunta. El hermano: «Total que en horas casi igual que en 2007 pero para tener casa propia bastante peor. ¿Y tú alquilas porque quieres o porque no te queda otra?»
    { n: 9, set: "vacio",
      svg: `${cajas(9)}${gente("s9", "ao")}`,
      tarjeta: tarjeta(9, "Te toca", `<div class="tit" style="font-size:60px">¿Alquilas porque quieres o porque no te queda <mark id="m9">otra</mark>?</div><div class="sub" id="c9-sub">Te leo en los comentarios.</div>`),
      fn: function (t, e) {
        const c = e.c;
        ambiente("pisoAlquiler", "barrioBloques", t, e.t0);
        vidaFondo("pa", t, { lamparas: 1, capa: "pisoAlquiler" });
        marca("m9", t, c["c9-tu"] + 0.8);
        sube("c9-sub", t, c["c9-tu"] + 1.2);
        persona("s9-a", t, { x: 300, y: 1440, s: 0.78, mira: 1, vivo: true, boca: [[0, "seria"], [c["c9-tu"], "sonrisa"]], ojos: [[0, "normal"]], brazo: [[0, "abajo"], [c["c9-peor"], "hombros"]], fase: 1 });
        persona("s9-o", t, { x: 790, y: 1440, s: 0.8, mira: [[0, -1], [c["c9-tu"] - 0.2, 0]], vivo: true, charla: e, boca: habla(t, e, "sonrisa"), brazo: [[0, "abajo"], [c["c9-igual"], "hombros"], [c["c9-tu"], "senala"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c9-peor"], e.c["c9-tu"]]); } },
  ];
}
