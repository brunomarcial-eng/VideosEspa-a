// Escenas de T27 («¿Hay más pobres que antes?») en estilo «limpio». Bruno, 24-11-2026: rescatar los temas del
// principio; el tercero, la pobreza con umbral fijo. INE, Encuesta de Condiciones de Vida: pobreza con el umbral de
// 2008 y con el de cada año, y carencias básicas: 2008, la crisis (2013), 2016, 2019 y 2025.
//   · «hijo»: unos 30, pelo castaño, sudadera verde azulado; ha mirado los datos (voz «hijo»).
//   · «madre»: unos 62, pelo corto canoso, chaleco naranja de voluntaria sin logotipos (voz «hostelera»).
// Decorado (diseno/pobreza.mjs): el almacén de un banco de alimentos de barrio.
/* eslint-disable no-undef */

import { persona, tarjeta, selloOficial } from "../../diseno/limpio.mjs";
import { bandera } from "../../diseno/barrio.mjs";
import { ambientes } from "../../diseno/sueno.mjs";
import { columnasHoras } from "../../diseno/alquiler.mjs";
import { DECORADOS_T27, CHALECO, cincoPersonas, regla, hucha } from "../../diseno/pobreza.mjs";

export const ESTILO = "limpio";
const F_ECV = "INE · Encuesta de Condiciones de Vida";

const coma = (v, d = 1) => v.toFixed(d).replace(".", ",");
const pct = (v) => `${coma(v)}&nbsp;%`;

export function datos(d) {
  const F = d.filas, A = d.anos;
  return {
    A, fija: A.map((a) => F[a].pobreza_umbral_fijo_2008_pct), rel: A.map((a) => F[a].pobreza_relativa_pct), umbral: F["2025"].umbral_1_persona_eur,
    carne: [F["2008"].no_carne_pescado_pct, F["2025"].no_carne_pescado_pct], impre: A.map((a) => F[a].no_imprevistos_pct),
  };
}

export const capas = () => ambientes({ almacen: DECORADOS_T27.almacen });

// ------------------------------------------------------------------ personajes (inventados), con volumen
const HIJO = { pelo: "corto", canas: false, barba: false, bigote: false, colorPelo: "#4A3020", ropa: ["#3E8E8A", "#33746F"], piel: "#F1C9A5", piel2: "#DDB18E", volumen: true };
const MADRE = { pelo: "corto", canas: true, barba: false, bigote: false, colorPelo: "#C9C2B6", ropa: ["#8C969C", "#737D83"], piel: "#EBC3A0", piel2: "#D9AE8C", volumen: true, encima: CHALECO };
const QUIEN = { h: HIJO, m: MADRE };
const gente = (n, quien) => quien.split("").map((k) => persona(`${n}-${k}`, "hoy", QUIEN[k])).join("");

// ------------------------------------------------------------------ tarjetas
const HOY = "#B3261E";
const cita = (n, quien, html) => tarjeta(n, quien, `<div class="tit" style="font-size:64px">${html}</div>`, { tono: "hoy" });
const grande = (n, titulo, cifra, sub, nota, fuente, color = HOY) => tarjeta(n, titulo, `<div class="tit" style="font-size:104px;color:${color};line-height:1" id="c${n}-a">${cifra}</div>
  <div class="sub" id="c${n}-b" style="font-size:42px">${sub}</div>${nota ? `<div class="nota">${nota}</div>` : ""}`, { fuente, icono: bandera(44) });
const vs = (n, titulo, vals, labs, nota, fuente, tam = 96) => tarjeta(n, titulo, `<div class="vs">${vals.map((v, i) => `<div class="col"><div class="v ${i ? "t-hoy" : "t-pasado"}" id="c${n}-${"ab"[i]}" style="font-size:${tam}px">${v}</div><div class="n">${labs[i]}</div></div>`).join("")}</div>
  <div class="nota">${nota}</div>`, { fuente, icono: bandera(44) });

export function escenas(D) {
  const A = D.A, fmt = (v) => `${coma(v)} %`;
  return [
    // 1 · Gancho. El hijo: «¿Hay más pobres que antes? Porque mi madre lleva veinte años en el banco de alimentos y dice que cada vez viene más gente.»
    { n: 1, set: "vacio",
      svg: `${gente("s1", "hm")}${selloOficial("s1-sello")}`,
      tarjeta: tarjeta(1, "La pobreza · de 2008 a hoy", `<div class="tit" style="font-size:64px">¿Hay más <mark id="m1">pobres</mark> que antes?</div>`, { icono: bandera(44) }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("almacen", null, t, 0);
        vidaFondo("ba", t, { capa: "almacen", lamparas: 1, balanceo: 1.5 });
        marca("m1", t, c["c1-pobres"]);
        selloAnim("s1-sello", t, c["c1-sello"], 545, 860, { s: 0.75, r: -9 });
        persona("s1-h", t, { x: 300, y: 1440, s: 0.8, mira: 0, vivo: true, charla: e, boca: habla(t, e, "sonrisa"), brazo: [[0, "abajo"], [c["c1-pobres"], "senala"], [c["c1-gente"] - 0.4, "hombros"]], fase: 1 });
        trabaja("s1-m", t, { x: 800, y: 1440, s: 0.78, ritmo: 0.6, a: "sujeta", b: "empuja", espejo: true, mira: -1, boca: "seria" });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c1-pobres"], e.c["c1-gente"]]); } },

    // 2 · Lo que cree la madre: «Hombre claro hijo. Esto está peor que en la crisis.»
    { n: 2, set: "vacio",
      svg: `${gente("s2", "hm")}`,
      tarjeta: cita(2, "La madre", `«Esto está peor que en la <mark id="m2">crisis</mark>»`),
      fn: function (t, e) {
        const c = e.c;
        ambiente("almacen", null, t, 0);
        vidaFondo("ba", t, { capa: "almacen", lamparas: 1, balanceo: 1.5 });
        marca("m2", t, c["c2-crisis"]);
        persona("s2-h", t, { x: 300, y: 1440, s: 0.8, mira: 1, vivo: true, boca: [[0, "sonrisa"], [c["c2-crisis"], "seria"]], brazo: [[0, "abajo"]], fase: 1 });
        persona("s2-m", t, { x: 800, y: 1440, s: 0.78, mira: -1, vivo: true, charla: e, boca: habla(t, e, "seria"), brazo: [[0, "abajo"], [c["c2-claro"], "hombros"], [c["c2-crisis"], "senala"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c2-crisis"]]); } },

    // 3 · La pobreza con la vara de 2008. El hijo: «Pues mira. Con la misma vara de 2008 hay menos pobres que nunca… el 17,5 %. En 2016 casi el 30 %.»
    { n: 3, set: "vacio",
      svg: `<g transform="translate(540 1330)">${columnasHoras("s3-c", D.fija, A, { W: 700, H: 340, tam: 32, fmt })}<g transform="translate(-350 -470) scale(.95)">${regla("s3-r", 735)}</g></g>${gente("s3", "hm")}`,
      tarjeta: grande(3, "Pobreza con el umbral de 2008", pct(D.fija[4]), "hoy: el mínimo de la serie",
        `El umbral de 2008, actualizado solo con la inflación. 2008: ${pct(D.fija[0])}; 2013: ${pct(D.fija[1])}; 2016: ${pct(D.fija[2])}; 2019: ${pct(D.fija[3])}`, F_ECV, "#3F7A4A"),
      fn: function (t, e) {
        const c = e.c;
        ambiente("almacen", null, t, 0);
        vidaFondo("ba", t, { capa: "almacen", lamparas: 1, balanceo: 1.5 });
        pop("s3-c", t, e.t0 + 0.05, 0, 0, { s: 1 });
        pop("s3-r", t, c["c3-2008"] - 0.3, 0, 0, { s: 1 });
        const cuando = [c["c3-2008"], e.t0 + 0.5, c["c3-2016"] - 0.3, e.t0 + 0.6, c["c3-17"] - 0.3];
        for (let i = 0; i < 5; i++) {
          css(`s3-c-b${i}`, "transform", `scaleY(${suave(clamp((t - cuando[i]) / 0.5)).toFixed(3)})`);
          css(`s3-c-v${i}`, "opacity", clamp((t - cuando[i] - 0.35) / 0.25));
        }
        sube("c3-a", t, c["c3-17"]); sube("c3-b", t, c["c3-17"] + 0.3);
        persona("s3-h", t, { x: 130, y: 1700, s: 0.66, mira: 1, vivo: true, charla: e, boca: habla(t, e, "sonrisa"), brazo: [[0, "abajo"], [c["c3-2008"], "senala"], [c["c3-30"], "hombros"]], fase: 1 });
        persona("s3-m", t, { x: 950, y: 1700, s: 0.64, mira: -1, vivo: true, boca: [[0, "seria"], [c["c3-17"] + 0.3, "o"]], ojos: [[0, "normal"], [c["c3-17"] + 0.3, "grandes"]], brazo: [[0, "abajo"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c3-17"], e.c["c3-30"]]); } },

    // 4 · La madre no se lo cree: «Anda ya… ¿y entonces quién viene aquí?»
    { n: 4, set: "vacio",
      svg: `${gente("s4", "hm")}`,
      tarjeta: cita(4, "La madre", `«¿Y entonces quién viene <mark id="m4">aquí</mark>?»`),
      fn: function (t, e) {
        const c = e.c;
        ambiente("almacen", null, t, 0);
        vidaFondo("ba", t, { capa: "almacen", lamparas: 1, balanceo: 1.5 });
        marca("m4", t, c["c4-aqui"]);
        persona("s4-h", t, { x: 300, y: 1440, s: 0.8, mira: 1, vivo: true, boca: [[0, "sonrisa"]], brazo: [[0, "abajo"]], fase: 1 });
        persona("s4-m", t, { x: 800, y: 1440, s: 0.78, mira: -1, vivo: true, charla: e, boca: habla(t, e, "grande"), ojos: [[0, "grandes"]], brazo: [[0, "abajo"], [c["c4-anda"], "arriba"], [c["c4-aqui"], "senala"]], salta: c["c4-anda"], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c4-anda"]]); } },

    // 5 · La pobreza con la vara de cada año. El hijo: «Con la vara de cada año seguimos como en 2008… uno de cada cinco.»
    { n: 5, set: "vacio",
      svg: `<g transform="translate(540 1200)">${cincoPersonas("s5-p", "uno de cada cinco, en 2008 y hoy")}</g>${gente("s5", "hm")}`,
      tarjeta: vs(5, "Pobreza con el umbral de cada año", [pct(D.rel[0]), pct(D.rel[4])], ["2008", "2025"],
        `Umbral de 2025 para una persona sola: ${String(D.umbral).replace(/\B(?=(\d{3})+(?!\d))/g, ".")} € al año (el 60&nbsp;% de la mediana)`, F_ECV),
      fn: function (t, e) {
        const c = e.c;
        ambiente("almacen", null, t, 0);
        vidaFondo("ba", t, { capa: "almacen", lamparas: 1, balanceo: 1.5 });
        pop("s5-p", t, e.t0 + 0.05, 0, 0, { s: 1 });
        pop("s5-p-p0", t, c["c5-cinco"] - 0.3, -240, 0, { s: 1 });
        sube("c5-a", t, c["c5-vara"]); sube("c5-b", t, c["c5-cinco"]);
        persona("s5-h", t, { x: 130, y: 1700, s: 0.66, mira: 1, vivo: true, charla: e, boca: habla(t, e, "seria"), brazo: [[0, "abajo"], [c["c5-cinco"] - 0.3, "senala"]], fase: 1 });
        persona("s5-m", t, { x: 950, y: 1700, s: 0.64, mira: -1, vivo: true, boca: [[0, "seria"]], brazo: [[0, "abajo"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c5-cinco"]]); } },

    // 6 · Lo básico: la comida. El hijo: «Y lo que ha empeorado es lo básico. Los que no pueden comer carne o pescado cada dos días son más del doble que en 2008.»
    { n: 6, set: "vacio",
      svg: `<g transform="translate(540 1330)">${columnasHoras("s6-c", D.carne, ["2008", "2025"], { W: 440, H: 340, tam: 44, fmt })}</g>${gente("s6", "hm")}`,
      tarjeta: vs(6, "No pueden comer carne o pescado cada dos días", [pct(D.carne[0]), pct(D.carne[1])], ["2008", "2025"], "Más del doble. Personas que no pueden permitirse carne, pollo o pescado al menos cada dos días", F_ECV),
      fn: function (t, e) {
        const c = e.c;
        ambiente("almacen", null, t, 0);
        vidaFondo("ba", t, { capa: "almacen", lamparas: 1, balanceo: 1.5 });
        pop("s6-c", t, c["c6-carne"] - 0.4, 0, 0, { s: 1 });
        [[0, c["c6-carne"]], [1, c["c6-doble"] - 0.3]].forEach(([i, x]) => {
          css(`s6-c-b${i}`, "transform", `scaleY(${suave(clamp((t - x) / 0.5)).toFixed(3)})`); css(`s6-c-v${i}`, "opacity", clamp((t - x - 0.35) / 0.25));
        });
        sube("c6-a", t, c["c6-carne"]); sube("c6-b", t, c["c6-doble"]);
        persona("s6-h", t, { x: 130, y: 1700, s: 0.66, mira: 1, vivo: true, charla: e, boca: habla(t, e, "seria"), brazo: [[0, "abajo"], [c["c6-basico"], "hombros"], [c["c6-doble"], "senala"]], fase: 1 });
        persona("s6-m", t, { x: 950, y: 1700, s: 0.64, mira: -1, vivo: true, boca: [[0, "seria"]], brazo: [[0, "abajo"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c6-basico"], e.c["c6-doble"]]); } },

    // 7 · Lo básico: un imprevisto. El hijo: «Y casi 4 de cada 10 no podrían pagar un gasto imprevisto. En 2008 eran 3.»
    { n: 7, set: "vacio",
      svg: `<g transform="translate(540 1330)">${columnasHoras("s7-c", D.impre, A, { W: 700, H: 340, tam: 32, fmt })}</g>${gente("s7", "hm")}`,
      tarjeta: vs(7, "Sin dinero para un gasto imprevisto", [pct(D.impre[0]), pct(D.impre[4])], ["2008", "2025"],
        `Casi 4 de cada 10. 2013: ${pct(D.impre[1])}; 2016: ${pct(D.impre[2])}; 2019: ${pct(D.impre[3])}`, F_ECV),
      fn: function (t, e) {
        const c = e.c;
        ambiente("almacen", null, t, 0);
        vidaFondo("ba", t, { capa: "almacen", lamparas: 1, balanceo: 1.5 });
        pop("s7-c", t, e.t0 + 0.05, 0, 0, { s: 1 });
        const cuando = [c["c7-3"] - 0.4, e.t0 + 0.4, e.t0 + 0.5, e.t0 + 0.6, c["c7-4"] - 0.3];
        for (let i = 0; i < 5; i++) {
          css(`s7-c-b${i}`, "transform", `scaleY(${suave(clamp((t - cuando[i]) / 0.5)).toFixed(3)})`);
          css(`s7-c-v${i}`, "opacity", clamp((t - cuando[i] - 0.35) / 0.25));
        }
        sube("c7-a", t, c["c7-3"]); sube("c7-b", t, c["c7-4"]);
        persona("s7-h", t, { x: 130, y: 1700, s: 0.66, mira: 1, vivo: true, charla: e, boca: habla(t, e, "seria"), brazo: [[0, "abajo"], [c["c7-4"], "senala"], [c["c7-3"], "hombros"]], fase: 1 });
        persona("s7-m", t, { x: 950, y: 1700, s: 0.64, mira: -1, vivo: true, boca: [[0, "seria"], [c["c7-imprevisto"], "o"]], brazo: [[0, "abajo"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c7-4"]]); } },

    // 8 · La madre: «¿Ves? Eso es lo que yo veo aquí todos los días.»
    { n: 8, set: "vacio",
      svg: `<g transform="translate(700 1066) scale(.42)">${hucha("s8-u")}</g>${gente("s8", "hm")}`,
      tarjeta: cita(8, "La madre", `«Eso es lo que yo veo aquí todos los <mark id="m8">días</mark>»`),
      fn: function (t, e) {
        const c = e.c;
        ambiente("almacen", null, t, 0);
        vidaFondo("ba", t, { capa: "almacen", lamparas: 1, balanceo: 1.5 });
        marca("m8", t, c["c8-dias"]);
        persona("s8-h", t, { x: 300, y: 1440, s: 0.8, mira: 1, vivo: true, boca: [[0, "seria"]], brazo: [[0, "abajo"]], fase: 1 });
        persona("s8-m", t, { x: 820, y: 1440, s: 0.78, mira: -1, vivo: true, charla: e, boca: habla(t, e, "seria"), brazo: [[0, "abajo"], [c["c8-ves"], "senala"], [c["c8-dias"], "hombros"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c8-ves"]]); } },

    // 9 · Veredicto y pregunta. La madre: «O sea que hay menos pobres en la estadística pero más gente que no llega a lo básico. ¿Y tú podrías pagar mañana un gasto que no esperabas?»
    { n: 9, set: "vacio",
      svg: `<g transform="translate(700 1066) scale(.42)">${hucha("s9-u")}</g>${gente("s9", "hm")}`,
      tarjeta: tarjeta(9, "Te toca", `<div class="tit" style="font-size:56px">¿Podrías pagar mañana un gasto que no <mark id="m9">esperabas</mark>?</div><div class="sub" id="c9-sub">Te leo en los comentarios.</div>`),
      fn: function (t, e) {
        const c = e.c;
        ambiente("almacen", null, t, 0);
        vidaFondo("ba", t, { capa: "almacen", lamparas: 1, balanceo: 1.5 });
        marca("m9", t, c["c9-esperabas"] + 0.2);
        sube("c9-sub", t, c["c9-esperabas"] + 0.7);
        persona("s9-h", t, { x: 300, y: 1440, s: 0.8, mira: 1, vivo: true, boca: [[0, "seria"], [c["c9-esperabas"], "sonrisa"]], brazo: [[0, "abajo"]], fase: 1 });
        persona("s9-m", t, { x: 820, y: 1440, s: 0.78, mira: [[0, -1], [c["c9-basico"] + 0.4, 0]], vivo: true, charla: e, boca: habla(t, e, "sonrisa"), brazo: [[0, "abajo"], [c["c9-estadistica"], "hombros"], [c["c9-esperabas"] - 0.6, "senala"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c9-basico"], e.c["c9-esperabas"]]); } },
  ];
}
