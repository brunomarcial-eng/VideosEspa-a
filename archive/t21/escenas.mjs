// Escenas de T21 v2 («¿Alquilar hoy cuesta más horas de trabajo que en plena crisis?») en estilo «limpio». Bruno, 24-11-2026:
// el alquiler medio de los hogares inquilinos en horas del sueldo neto mediano (2007, la crisis de 2013, 2016, 2019 y hoy),
// quién alquila (hogares de 30 a 44 años con casa propia o de alquiler, INE) y a qué edad se van de casa (Eurostat).
//   · «hermano»: unos 32, pelo corto oscuro, sudadera mostaza; vive de alquiler y acaba de mudarse (voz «hijo»).
//   · «hermana»: unos 45, media melena castaña, jersey malva; alquiló en 2007 y luego compró (voz «medica»).
// Decorados (diseno/alquiler.mjs): el piso de alquiler con cajas y la calle de barrio con los dos bloques de pisos.
/* eslint-disable no-undef */

import { persona, tarjeta, selloOficial } from "../../diseno/limpio.mjs";
import { bandera } from "../../diseno/barrio.mjs";
import { ambientes } from "../../diseno/sueno.mjs";
import { DECORADOS_T21, cajaMudanza, sobre, semana, columnasHoras, bloque, caminosCasa } from "../../diseno/alquiler.mjs";

export const ESTILO = "limpio";
const F_2013 = "Cálculo propio · Microdatos de la EPF del INE y Estructura Salarial";
const F_HOY = "INE · EPF y Estructura Salarial · Cálculo propio";
const F_HORAS = "Cálculo propio · INE";
const F_ECV = "INE · Encuesta de Condiciones de Vida";
const F_EUROSTAT = "Eurostat · Edad media de emancipación";

const es = (v, d = 1) => v.toFixed(d).replace(".", ",");

export function datos(d) {
  const A = d.alquiler, q = d.quien_alquila["30_44"], ANOS = ["2007", "2013", "2016", "2019", "2025"];
  return { A, prop: q.propiedad_pct, merc: q.alquiler_mercado_pct, horas: ANOS.map((a) => A[a].horas_mes), edad: d.edad_emancipacion, extra: d.horas_al_anyo_mas_que_2016 };
}

export const capas = () => ambientes({ pisoAlquiler: DECORADOS_T21.pisoAlquiler, barrioBloques: DECORADOS_T21.barrioBloques });

// ------------------------------------------------------------------ personajes (inventados), con volumen
const HERMANO = { pelo: "corto", canas: false, barba: false, colorPelo: "#2A1E16", ropa: ["#D9A23B", "#B9862C"], piel: "#E4B48F", piel2: "#D4A07A", volumen: true };
const HERMANA = { pelo: "largo", canas: false, barba: false, colorPelo: "#7A5236", ropa: ["#8E6F9E", "#765A85"], piel: "#F2CBA8", volumen: true };
const QUIEN = { o: HERMANO, a: HERMANA };
const gente = (n, quien) => quien.split("").map((k) => persona(`${n}-${k}`, "hoy", QUIEN[k])).join("");

// ------------------------------------------------------------------ tarjetas
const HOY = "#B3261E";
const grande = (n, titulo, cifra, sub, nota, fuente, color = HOY) => tarjeta(n, titulo, `<div class="tit" style="font-size:104px;color:${color};line-height:1" id="c${n}-a">${cifra}</div>
  <div class="sub" id="c${n}-b" style="font-size:42px">${sub}</div>${nota ? `<div class="nota">${nota}</div>` : ""}`, { fuente, icono: bandera(44) });
const vs = (n, titulo, vals, labs, nota, fuente) => tarjeta(n, titulo, `<div class="vs">${vals.map((v, i) => `<div class="col"><div class="v ${i ? "t-hoy" : "t-pasado"}" id="c${n}-${"ab"[i]}" style="font-size:96px">${v}</div><div class="n">${labs[i]}</div></div>`).join("")}</div>
  <div class="nota">${nota}</div>`, { fuente, icono: bandera(44) });

export function escenas(D) {
  const h = D.horas.map((x) => Math.round(x));          // 2007, 2013, 2016, 2019, hoy
  const pct = (v) => `${Math.round(v)}&nbsp;%`;
  const cajas = (n) => `<g transform="translate(540 1330)">${cajaMudanza(`s${n}-cj`, 240, 170, "")}</g>`;
  const COLS = (id) => columnasHoras(id, D.horas, ["2007", "2013", "2016", "2019", "Hoy"], { W: 690, H: 360 });
  const TIT_H = "Horas de trabajo para pagar un mes de alquiler";
  const notaHoras = "Alquiler medio de los hogares inquilinos entre el sueldo neto mediano por hora";
  const bloques = (n, alquila) => `<g transform="translate(290 1335) scale(.86)">${bloque(`s${n}-x`, "2007", 15, alquila ? 3 : 0)}</g><g transform="translate(790 1335) scale(.86)">${bloque(`s${n}-y`, "Hoy", 11, alquila ? 6 : 0, "#D6C3A8")}</g>`;
  return [
    // 1 · Gancho. El piso de alquiler con cajas. El hermano: «¿Alquilar hoy te cuesta más horas de curro que en plena crisis? Porque mi hermana dice que ni de broma…»
    { n: 1, set: "vacio",
      svg: `${cajas(1)}${gente("s1", "ao")}${selloOficial("s1-sello")}`,
      tarjeta: tarjeta(1, "El alquiler · de la crisis a hoy", `<div class="tit" style="font-size:64px">¿El alquiler te cuesta hoy más <mark id="m1">horas</mark> que en plena crisis?</div>`, { icono: bandera(44) }),
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

    // 2 · En plena crisis (2013, microdatos de la EPF). La hermana: «Hombre… en 2013 el alquiler medio eran 399 euros y con el sueldo mediano salían 40 horas de curro al mes.»
    { n: 2, set: "vacio",
      svg: `${cajas(2)}<g transform="translate(540 1110)">${sobre("s2-s", "ALQUILER", 2, 0.9)}</g>
        <g id="s2-y"><g transform="translate(820 1010) rotate(8)"><rect x="-90" y="-40" width="180" height="80" rx="14" fill="#5B6470"/><text x="0" y="18" text-anchor="middle" font-family="Cap" font-weight="800" font-size="48" fill="#FFFFFF">2013</text></g></g>
        ${gente("s2", "ao")}`,
      tarjeta: grande(2, "En plena crisis (2013)", `${D.A["2013"].alquiler_mes}&nbsp;€ al mes`, `= <b style="color:${HOY}">${h[1]} horas de trabajo</b>`,
        `Lo que pagaban de media los hogares inquilinos. Sueldo neto mediano: ${es(D.A["2013"].neto_hora_mediana, 2)}&nbsp;€ la hora`, F_2013, "#5B6470"),
      fn: function (t, e) {
        const c = e.c;
        ambiente("pisoAlquiler", null, t, 0);
        vidaFondo("pa", t, { lamparas: 1, capa: "pisoAlquiler" });
        pop("s2-y", t, c["c2-2013"] - 0.2, 0, 0, { s: 1 });
        pop("s2-s", t, c["c2-399"] - 0.3, 0, 0, { s: 1 });
        sube("c2-a", t, c["c2-399"]); sube("c2-b", t, c["c2-40"]);
        persona("s2-a", t, { x: 130, y: 1700, s: 0.64, mira: 1, vivo: true, charla: e, boca: habla(t, e, "sonrisa"), brazo: [[0, "abajo"], [c["c2-399"] - 0.3, "senala"], [c["c2-40"] + 0.4, "hombros"]], fase: 1 });
        persona("s2-o", t, { x: 950, y: 1700, s: 0.66, mira: -1, vivo: true, boca: [[0, "seria"]], brazo: [[0, "abajo"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c2-399"]]); } },

    // 3 · Hoy, más que en la crisis. El hermano: «Ya pero hoy son 534. O sea 41 horas al mes… más que en plena crisis.»
    { n: 3, set: "vacio",
      svg: `<g transform="translate(540 900)">${sobre("s3-s", "ALQUILER", 4, 0.85)}</g><g transform="translate(540 1270) scale(.92)">${semana("s3-w")}</g>${gente("s3", "ao")}`,
      tarjeta: grande(3, "El alquiler hoy", `${D.A["2025"].alquiler_mes}&nbsp;€ al mes`, `= <b style="color:${HOY}">${h[4]} horas de trabajo</b>`,
        `Sueldo neto mediano: ${es(D.A["2025"].neto_hora_mediana, 2)}&nbsp;€ la hora; el alquiler se lleva el ${Math.round(D.A["2025"].parte_sueldo_pct)}&nbsp;% del sueldo. Es la media de todos los inquilinos, con contratos viejos y nuevos`, F_HOY),
      fn: function (t, e) {
        const c = e.c;
        ambiente("pisoAlquiler", null, t, 0);
        vidaFondo("pa", t, { lamparas: 1, capa: "pisoAlquiler" });
        pop("s3-s", t, c["c3-534"] - 0.3, 0, 0, { s: 1 });
        pop("s3-w", t, c["c3-41"] - 0.3, 0, 0, { s: 1 });
        for (let i = 0; i < 5; i++) css(`s3-w-x${i}`, "opacity", clamp((t - c["c3-41"] - 0.2 - i * 0.2) / 0.15));
        sube("c3-a", t, c["c3-534"]); sube("c3-b", t, c["c3-41"]);
        persona("s3-a", t, { x: 130, y: 1700, s: 0.64, mira: 1, vivo: true, boca: [[0, "seria"], [c["c3-crisis"], "o"]], ojos: [[0, "normal"], [c["c3-crisis"], "grandes"]], brazo: [[0, "abajo"]], fase: 1 });
        persona("s3-o", t, { x: 950, y: 1700, s: 0.66, mira: -1, vivo: true, charla: e, boca: habla(t, e, "seria"), brazo: [[0, "abajo"], [c["c3-534"] - 0.2, "senala"], [c["c3-crisis"], "hombros"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c3-41"]]); } },

    // 4 · Frente a 2007, algo menos. La hermana: «Bueno pero en 2007 eran 42 ¿eh? Más que ahora.»
    { n: 4, set: "vacio",
      svg: `<g transform="translate(540 1330)">${COLS("s4-h")}</g>${gente("s4", "ao")}`,
      tarjeta: vs(4, TIT_H, [`${h[0]}&nbsp;h`, `${h[4]}&nbsp;h`], ["en 2007", "hoy"], `2013: ${h[1]} · 2016: ${h[2]} · 2019: ${h[3]}. ${notaHoras}`, F_HORAS),
      fn: function (t, e) {
        const c = e.c;
        ambiente("pisoAlquiler", null, t, 0);
        vidaFondo("pa", t, { lamparas: 1, capa: "pisoAlquiler" });
        pop("s4-h", t, e.t0 + 0.05, 0, 0, { s: 1 });
        const dim = suave(clamp((t - c["c4-42"]) / 0.5));
        for (let i = 0; i < 5; i++) {
          const k = suave(clamp((t - e.t0 - 0.2 - i * 0.18) / 0.5));
          css(`s4-h-b${i}`, "transform", `scaleY(${k.toFixed(3)})`);
          const o = i === 0 || i === 4 ? 1 : 1 - 0.65 * dim;
          css(`s4-h-b${i}`, "opacity", o); css(`s4-h-v${i}`, "opacity", k * o);
        }
        sube("c4-a", t, c["c4-42"]); sube("c4-b", t, c["c4-ahora"]);
        persona("s4-a", t, { x: 130, y: 1700, s: 0.64, mira: 1, vivo: true, charla: e, boca: habla(t, e, "sonrisa"), brazo: [[0, "abajo"], [c["c4-42"] - 0.2, "senala"], [c["c4-ahora"], "hombros"]], fase: 1 });
        persona("s4-o", t, { x: 950, y: 1700, s: 0.66, mira: -1, vivo: true, boca: [[0, "seria"]], ojos: [[0, "normal"]], brazo: [[0, "abajo"], [c["c4-ahora"] + 0.2, "piensa"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c4-42"]]); } },

    // 5 · Frente a 2016, peor. El hermano: «Ya y en 2016 eran 39. O sea casi cuatro días más de curro al año que entonces.»
    { n: 5, set: "vacio",
      svg: `<g transform="translate(540 1330)">${COLS("s5-h")}</g>
        <g id="s5-x"><g transform="translate(320 1110)"><rect x="-150" y="-48" width="300" height="96" rx="20" fill="${HOY}"/><text x="0" y="16" text-anchor="middle" font-family="Cap" font-weight="800" font-size="44" fill="#FFFFFF">+${Math.round(D.extra)} h al año</text></g></g>
        ${gente("s5", "ao")}`,
      tarjeta: vs(5, TIT_H, [`${h[2]}&nbsp;h`, `${h[4]}&nbsp;h`], ["en 2016", "hoy"], `Al año, ${Math.round(D.extra)} horas más que en 2016. 2007: ${h[0]} · 2013: ${h[1]} · 2019: ${h[3]}`, F_HORAS),
      fn: function (t, e) {
        const c = e.c;
        ambiente("pisoAlquiler", null, t, 0);
        vidaFondo("pa", t, { lamparas: 1, capa: "pisoAlquiler" });
        const dim = suave(clamp((t - c["c5-2016"]) / 0.5));
        for (let i = 0; i < 5; i++) {
          const o = i === 2 || i === 4 ? 1 : 1 - 0.65 * dim;
          css(`s5-h-b${i}`, "opacity", o); css(`s5-h-v${i}`, "opacity", o);
        }
        pop("s5-x", t, c["c5-cuatro"], 0, 0, { s: 1 });
        sube("c5-a", t, c["c5-39"]); sube("c5-b", t, c["c5-cuatro"]);
        persona("s5-a", t, { x: 130, y: 1700, s: 0.64, mira: 1, vivo: true, boca: [[0, "seria"], [c["c5-cuatro"] + 0.3, "o"]], ojos: [[0, "normal"], [c["c5-cuatro"] + 0.3, "grandes"]], brazo: [[0, "abajo"]], fase: 1 });
        persona("s5-o", t, { x: 950, y: 1700, s: 0.66, mira: -1, vivo: true, charla: e, boca: habla(t, e, "seria"), brazo: [[0, "abajo"], [c["c5-2016"] - 0.2, "senala"], [c["c5-cuatro"], "arriba"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c5-cuatro"]]); } },

    // 6 · Quién tiene casa propia (ECV). La hermana: «Eso sí… en 2007 tres de cada cuatro de tu edad tenían piso propio y hoy poco más de la mitad.»
    { n: 6, set: "vacio",
      svg: `${bloques(6, false)}${gente("s6", "ao")}`,
      tarjeta: vs(6, "Hogares de 30 a 44 años con casa en propiedad", [pct(D.prop["2007"]), pct(D.prop["2025"])], ["en 2007", "hoy"],
        `2013: ${pct(D.prop["2013"])} · 2016: ${pct(D.prop["2016"])} · 2019: ${pct(D.prop["2019"])}`, F_ECV),
      fn: function (t, e) {
        const c = e.c;
        ambiente("barrioBloques", "pisoAlquiler", t, e.t0);
        vidaFondo("bb", t, { capa: "barrioBloques" });
        for (let i = 0; i < 20; i++) {
          css(`s6-x-k${i}`, "opacity", clamp((t - c["c6-2007"] - (i % 15) * 0.05) / 0.2));
          css(`s6-y-k${i}`, "opacity", clamp((t - c["c6-hoy"] - (i % 11) * 0.05) / 0.2));
        }
        sube("c6-a", t, c["c6-2007"]); sube("c6-b", t, c["c6-mitad"]);
        persona("s6-a", t, { x: 120, y: 1800, s: 0.5, mira: 1, vivo: true, charla: e, boca: habla(t, e, "seria"), brazo: [[0, "abajo"], [c["c6-2007"] - 0.2, "senala"], [c["c6-mitad"], "hombros"]], fase: 1 });
        persona("s6-o", t, { x: 960, y: 1800, s: 0.52, mira: -1, vivo: true, boca: [[0, "seria"], [c["c6-mitad"] + 0.3, "o"]], ojos: [[0, "normal"]], brazo: [[0, "abajo"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c6-mitad"]]); } },

    // 7 · Quién alquila (ECV). El hermano: «Y los que alquilamos a precio de mercado nos hemos duplicado… del 16 al 32 %.»
    { n: 7, set: "vacio",
      svg: `${bloques(7, true)}${gente("s7", "ao")}`,
      tarjeta: vs(7, "Hogares de 30 a 44 años de alquiler a precio de mercado", [pct(D.merc["2007"]), pct(D.merc["2025"])], ["en 2007", "hoy"],
        `2013: ${pct(D.merc["2013"])} · 2016: ${pct(D.merc["2016"])} · 2019: ${pct(D.merc["2019"])}`, F_ECV),
      fn: function (t, e) {
        const c = e.c;
        ambiente("barrioBloques", null, t, 0);
        vidaFondo("bb", t, { capa: "barrioBloques" });
        for (let i = 0; i < 20; i++) {
          css(`s7-x-k${i}`, "opacity", 1); css(`s7-y-k${i}`, "opacity", 1);
          css(`s7-x-a${i}`, "opacity", clamp((t - c["c7-16"] - (i % 3) * 0.12) / 0.2));
          css(`s7-y-a${i}`, "opacity", clamp((t - c["c7-32"] - (i % 6) * 0.1) / 0.2));
        }
        sube("c7-a", t, c["c7-16"]); sube("c7-b", t, c["c7-32"]);
        persona("s7-a", t, { x: 120, y: 1800, s: 0.5, mira: 1, vivo: true, boca: [[0, "seria"], [c["c7-32"] + 0.2, "o"]], ojos: [[0, "normal"], [c["c7-32"] + 0.2, "grandes"]], brazo: [[0, "abajo"]], fase: 1 });
        persona("s7-o", t, { x: 960, y: 1800, s: 0.52, mira: -1, vivo: true, charla: e, boca: habla(t, e, "seria"), brazo: [[0, "abajo"], [c["c7-alquilamos"], "senala"], [c["c7-32"] + 0.3, "hombros"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c7-32"]]); } },

    // 8 · A qué edad se van de casa (Eurostat). La hermana: «Y encima os vais de casa a los 30… casi dos años más tarde que en 2007.»
    { n: 8, set: "vacio",
      svg: `<g transform="translate(540 1160) scale(.92)">${caminosCasa("s8-c", [D.edad["2007"], D.edad["2025"]], ["2007", "Hoy"])}</g>${gente("s8", "ao")}`,
      tarjeta: vs(8, "Edad media a la que los jóvenes se van de casa de sus padres", [es(D.edad["2007"]), es(D.edad["2025"])], ["en 2007", "hoy"],
        `2013: ${es(D.edad["2013"])} · 2016: ${es(D.edad["2016"])} · 2019: ${es(D.edad["2019"])}. La serie cambió de método a mitad de camino`, F_EUROSTAT),
      fn: function (t, e) {
        const c = e.c;
        ambiente("barrioBloques", null, t, 0);
        vidaFondo("bb", t, { capa: "barrioBloques" });
        pop("s8-c", t, e.t0 + 0.05, 0, 0, { s: 1 });
        [[0, c["c8-casa"]], [1, c["c8-30"]]].forEach(([i, t0]) => {
          const m = $(`s8-c-m${i}`); if (!m) return;
          const k = suave(clamp((t - t0) / 1.1)), x = +m.dataset.a + (+m.dataset.b - +m.dataset.a) * k;
          m.setAttribute("transform", `translate(${x.toFixed(1)} ${(-Math.abs(Math.sin(k * Math.PI * 5)) * 8).toFixed(1)})`);
          css(`s8-c-f${i}`, "opacity", clamp((t - t0 - 0.9) / 0.3));
        });
        sube("c8-a", t, c["c8-casa"] + 0.9); sube("c8-b", t, c["c8-30"] + 0.9);
        persona("s8-a", t, { x: 130, y: 1700, s: 0.64, mira: 1, vivo: true, charla: e, boca: habla(t, e, "seria"), brazo: [[0, "abajo"], [c["c8-30"] - 0.2, "senala"], [c["c8-2007"], "hombros"]], fase: 1 });
        persona("s8-o", t, { x: 950, y: 1700, s: 0.66, mira: -1, vivo: true, boca: [[0, "seria"], [c["c8-30"] + 0.4, "o"]], ojos: [[0, "normal"]], brazo: [[0, "abajo"], [c["c8-2007"], "hombros"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c8-30"]]); } },

    // 9 · Veredicto y pregunta. El hermano: «Total que alquilar cuesta como en plena crisis y tener piso propio mucho más difícil. ¿Tú alquilas porque quieres o porque no te queda otra?»
    { n: 9, set: "vacio",
      svg: `${cajas(9)}${gente("s9", "ao")}`,
      tarjeta: tarjeta(9, "Te toca", `<div class="tit" style="font-size:60px">¿Alquilas porque quieres o porque no te queda <mark id="m9">otra</mark>?</div><div class="sub" id="c9-sub">Te leo en los comentarios.</div>`),
      fn: function (t, e) {
        const c = e.c;
        ambiente("pisoAlquiler", "barrioBloques", t, e.t0);
        vidaFondo("pa", t, { lamparas: 1, capa: "pisoAlquiler" });
        marca("m9", t, c["c9-tu"] + 0.8);
        sube("c9-sub", t, c["c9-tu"] + 1.2);
        persona("s9-a", t, { x: 300, y: 1440, s: 0.78, mira: 1, vivo: true, boca: [[0, "seria"], [c["c9-tu"], "sonrisa"]], ojos: [[0, "normal"]], brazo: [[0, "abajo"], [c["c9-dificil"], "hombros"]], fase: 1 });
        persona("s9-o", t, { x: 790, y: 1440, s: 0.8, mira: [[0, -1], [c["c9-tu"] - 0.2, 0]], vivo: true, charla: e, boca: habla(t, e, "sonrisa"), brazo: [[0, "abajo"], [c["c9-crisis"], "hombros"], [c["c9-tu"], "senala"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c9-dificil"], e.c["c9-tu"]]); } },
  ];
}
