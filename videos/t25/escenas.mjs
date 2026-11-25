// Escenas de T25 («¿En qué tramo de sueldo estás tú?») en estilo «limpio». Bruno, 24-11-2026: los tramos de sueldo que
// propuso al principio. Asalariados por tramos de salario de la Agencia Tributaria (2025) y el sueldo medio en euros de
// hoy desde 2007.
//   · «cliente»: unos 40, pelo castaño, jersey beis; se cree «clase media normalita» con 40.000 € (voz «hombre»).
//   · «gestora»: unos 45, melena castaña oscura y gafas, chaqueta verde; tiene los papeles de Hacienda (voz «medica»).
// Decorado (diseno/tramos.mjs): una gestoría de barrio por la mañana.
/* eslint-disable no-undef */

import { persona, tarjeta, selloOficial } from "../../diseno/limpio.mjs";
import { bandera } from "../../diseno/barrio.mjs";
import { ambientes } from "../../diseno/sueno.mjs";
import { columnasHoras } from "../../diseno/alquiler.mjs";
import { GAFAS } from "../../diseno/calefaccion.mjs";
import { DECORADOS_T25, escaleraTramos, tele, balancin } from "../../diseno/tramos.mjs";

export const ESTILO = "limpio";
const F_AEAT = "Agencia Tributaria · Mercado de trabajo y pensiones (2025)";
const F_REAL = "Cálculo propio · Agencia Tributaria e INE (IPC)";

const miles = (v) => String(Math.round(v)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
const coma = (v, d = 1) => v.toFixed(d).replace(".", ",");

export function datos(d) {
  const H = d.filas[d.hoy], R = d.hoy_resumen, A = d.anos;
  const pct = H.grupos.map((g) => Math.round(g.pct * 10) / 10);
  const L = [R.limite_1smi, R.limite_2smi, R.limite_3smi, R.limite_5smi, R.limite_7_5smi].map(miles);
  return {
    tramos: [
      { rotulo: `Menos de ${L[0]} €`, pct: Math.round(pct[0]) }, { rotulo: `${L[0]} a ${L[1]} €`, pct: Math.round(pct[1]) },
      { rotulo: `${L[1]} a ${L[2]} €`, pct: Math.round(pct[2]) }, { rotulo: `${L[2]} a ${L[3]} €`, pct: pct[3] },
      { rotulo: `${L[3]} a ${L[4]} €`, pct: pct[4] }, { rotulo: `Más de ${L[4]} €`, pct: pct[5] },
    ],
    L, R, media: H.salario_medio, bajo: H.cobran_menos_que_la_media_pct_min,
    real: A.map((a) => d.filas[a].salario_medio_euros_2025), anos: A, vs: d.salario_medio_real_vs_hoy_pct,
  };
}

export const capas = () => ambientes({ gestoria: DECORADOS_T25.gestoria });

// ------------------------------------------------------------------ personajes (inventados), con volumen
const CLIENTE = { pelo: "corto", canas: false, barba: false, bigote: false, colorPelo: "#5A3A22", ropa: ["#C9A27A", "#A9845E"], piel: "#F0C9A8", piel2: "#DDB18E", volumen: true };
const GESTORA = { pelo: "largo", canas: false, barba: false, colorPelo: "#4A3020", ropa: ["#3F6B5A", "#335849"], piel: "#EBC3A0", piel2: "#D9AE8C", volumen: true, gorro: GAFAS };
const QUIEN = { c: CLIENTE, g: GESTORA };
const gente = (n, quien) => quien.split("").map((k) => persona(`${n}-${k}`, "hoy", QUIEN[k])).join("");

// ------------------------------------------------------------------ tarjetas
const HOY = "#B3261E";
const cita = (n, quien, html) => tarjeta(n, quien, `<div class="tit" style="font-size:64px">${html}</div>`, { tono: "hoy" });
const grande = (n, titulo, cifra, sub, nota, fuente, color = HOY) => tarjeta(n, titulo, `<div class="tit" style="font-size:104px;color:${color};line-height:1" id="c${n}-a">${cifra}</div>
  <div class="sub" id="c${n}-b" style="font-size:42px">${sub}</div>${nota ? `<div class="nota">${nota}</div>` : ""}`, { fuente, icono: bandera(44) });
const vs = (n, titulo, vals, labs, nota, fuente, tam = 96) => tarjeta(n, titulo, `<div class="vs">${vals.map((v, i) => `<div class="col"><div class="v ${i ? "t-hoy" : "t-pasado"}" id="c${n}-${"ab"[i]}" style="font-size:${tam}px">${v}</div><div class="n">${labs[i]}</div></div>`).join("")}</div>
  <div class="nota">${nota}</div>`, { fuente, icono: bandera(44) });

export function escenas(D) {
  const T = D.tramos, L = D.L;
  const ESC = (id, ver, o) => escaleraTramos(id, T, ver, o);
  return [
    // 1 · Gancho. El cliente: «¿En qué tramo de sueldo estás tú? Porque yo con 40.000 euros al año me veo clase media normalita ¿eh?»
    { n: 1, set: "vacio",
      svg: `${gente("s1", "cg")}${selloOficial("s1-sello")}`,
      tarjeta: tarjeta(1, "Los sueldos · de 2007 a hoy", `<div class="tit" style="font-size:64px">¿En qué <mark id="m1">tramo</mark> de sueldo estás tú?</div>`, { icono: bandera(44) }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("gestoria", null, t, 0);
        vidaFondo("ge", t, { capa: "gestoria", lamparas: 1, balanceo: 1 });
        marca("m1", t, c["c1-tramo"]);
        selloAnim("s1-sello", t, c["c1-sello"], 545, 860, { s: 0.75, r: -9 });
        persona("s1-c", t, { x: 300, y: 1440, s: 0.8, mira: 0, vivo: true, charla: e, boca: habla(t, e, "sonrisa"), brazo: [[0, "abajo"], [c["c1-tramo"], "senala"], [c["c1-normalita"] - 0.4, "hombros"]], fase: 1 });
        persona("s1-g", t, { x: 800, y: 1440, s: 0.78, mira: -1, vivo: true, boca: [[0, "sonrisa"], [c["c1-normalita"], "o"]], ojos: [[0, "normal"], [c["c1-normalita"], "grandes"]], brazo: [[0, "abajo"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c1-tramo"], e.c["c1-normalita"]]); } },

    // 2 · El tramo de abajo (AEAT). La gestora: «¿Normalita? Casi 4 de cada 10 cobran menos de 16.500 euros al año… contando a los de media jornada.»
    { n: 2, set: "vacio",
      svg: `<g transform="translate(540 1060) scale(.9)">${ESC("s2-e", [0])}</g>${gente("s2", "cg")}`,
      tarjeta: grande(2, `Cobran menos de ${L[0]} € al año`, `${T[0].pct}&nbsp;%`, "de los asalariados: casi 4 de cada 10",
        "Cuenta a todo el que cobró un sueldo en 2025, aunque fuera a media jornada o solo unos meses", F_AEAT),
      fn: function (t, e) {
        const c = e.c;
        ambiente("gestoria", null, t, 0);
        vidaFondo("ge", t, { capa: "gestoria", lamparas: 1, balanceo: 1 });
        pop("s2-e", t, e.t0 + 0.05, 0, 0, { s: 1 });
        for (let i = 1; i < 6; i++) css(`s2-e-b${i}`, "transform", "scaleX(1)");
        css("s2-e-b0", "transform", `scaleX(${suave(clamp((t - c["c2-4"] + 0.1) / 0.7)).toFixed(3)})`);
        css("s2-e-v0", "opacity", clamp((t - c["c2-4"] - 0.4) / 0.3));
        sube("c2-a", t, c["c2-4"]); sube("c2-b", t, c["c2-16500"]);
        persona("s2-c", t, { x: 130, y: 1700, s: 0.66, mira: 1, vivo: true, boca: [[0, "sonrisa"], [c["c2-16500"], "o"]], ojos: [[0, "normal"], [c["c2-16500"], "grandes"]], brazo: [[0, "abajo"]], fase: 1 });
        persona("s2-g", t, { x: 950, y: 1700, s: 0.64, mira: -1, vivo: true, charla: e, boca: habla(t, e, "sonrisa"), brazo: [[0, "abajo"], [c["c2-4"] - 0.2, "senala"], [c["c2-jornada"], "hombros"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c2-4"], e.c["c2-16500"]]); } },

    // 3 · Tres de cada cuatro. La gestora: «Y otros tantos hasta 33.000. O sea que 3 de cada 4 cobran menos de 33.000.»
    { n: 3, set: "vacio",
      svg: `<g transform="translate(540 1060) scale(.9)">${ESC("s3-e", [0, 1])}</g>${gente("s3", "cg")}`,
      tarjeta: grande(3, `Cobran menos de ${L[1]} € al año`, `${Math.round(D.R.menos_2smi_pct)}&nbsp;%`, "3 de cada 4 asalariados",
        `Menos de ${L[0]} €, el ${T[0].pct}&nbsp;%; de ${L[0]} a ${L[1]} €, otro ${T[1].pct}&nbsp;%`, F_AEAT),
      fn: function (t, e) {
        const c = e.c;
        ambiente("gestoria", null, t, 0);
        vidaFondo("ge", t, { capa: "gestoria", lamparas: 1, balanceo: 1 });
        for (let i = 2; i < 6; i++) css(`s3-e-b${i}`, "transform", "scaleX(1)");
        css("s3-e-b0", "transform", "scaleX(1)"); css("s3-e-v0", "opacity", 1);
        css("s3-e-b1", "transform", `scaleX(${suave(clamp((t - c["c3-tantos"] + 0.1) / 0.7)).toFixed(3)})`);
        css("s3-e-v1", "opacity", clamp((t - c["c3-tantos"] - 0.4) / 0.3));
        sube("c3-a", t, c["c3-3"]); sube("c3-b", t, c["c3-3"] + 0.3);
        persona("s3-c", t, { x: 130, y: 1700, s: 0.66, mira: 1, vivo: true, boca: [[0, "o"], [c["c3-3"], "seria"]], brazo: [[0, "abajo"]], fase: 1 });
        persona("s3-g", t, { x: 950, y: 1700, s: 0.64, mira: -1, vivo: true, charla: e, boca: habla(t, e, "sonrisa"), brazo: [[0, "abajo"], [c["c3-tantos"], "senala"], [c["c3-3"], "hombros"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c3-3"]]); } },

    // 4 · El cliente no se lo cree: «Anda ya… ¿y los de 40.000 como yo?»
    { n: 4, set: "vacio",
      svg: `${gente("s4", "cg")}`,
      tarjeta: cita(4, "El cliente", `«¿Y los de cuarenta mil como <mark id="m4">yo</mark>?»`),
      fn: function (t, e) {
        const c = e.c;
        ambiente("gestoria", null, t, 0);
        vidaFondo("ge", t, { capa: "gestoria", lamparas: 1, balanceo: 1 });
        marca("m4", t, c["c4-yo"]);
        persona("s4-c", t, { x: 300, y: 1440, s: 0.8, mira: 1, vivo: true, charla: e, boca: habla(t, e, "grande"), ojos: [[0, "grandes"]], brazo: [[0, "abajo"], [c["c4-anda"], "arriba"], [c["c4-yo"], "senala"]], salta: c["c4-anda"], fase: 1 });
        persona("s4-g", t, { x: 800, y: 1440, s: 0.78, mira: -1, vivo: true, boca: [[0, "sonrisa"]], ojos: [[0, "felices"]], brazo: [[0, "abajo"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c4-anda"]]); } },

    // 5 · El tramo del cliente. La gestora: «De 33.000 a 50.000 solo el 15 %. Tú ya estás en la cuarta parte que más gana.»
    { n: 5, set: "vacio",
      svg: `<g transform="translate(540 1060) scale(.9)">${ESC("s5-e", [0, 1, 2], { tu: 2, colores: { 2: "#3F7A4A" } })}</g>${gente("s5", "cg")}`,
      tarjeta: grande(5, `De ${L[1]} a ${L[2]} € al año`, `${T[2].pct}&nbsp;%`, `Por encima de ${L[1]} €, el ${Math.round(D.R.mas_2smi_pct)}&nbsp;%: la cuarta parte que más gana`, null, F_AEAT, "#3F7A4A"),
      fn: function (t, e) {
        const c = e.c;
        ambiente("gestoria", null, t, 0);
        vidaFondo("ge", t, { capa: "gestoria", lamparas: 1, balanceo: 1 });
        for (let i = 0; i < 6; i++) if (i !== 2) css(`s5-e-b${i}`, "transform", "scaleX(1)");
        css("s5-e-v0", "opacity", 1); css("s5-e-v1", "opacity", 1);
        css("s5-e-b2", "transform", `scaleX(${suave(clamp((t - c["c5-15"] + 0.2) / 0.7)).toFixed(3)})`);
        css("s5-e-v2", "opacity", clamp((t - c["c5-15"] - 0.3) / 0.3));
        pop("s5-e-tu", t, c["c5-cuarta"] - 0.2, 0, 0, { s: 1 });
        sube("c5-a", t, c["c5-15"]); sube("c5-b", t, c["c5-cuarta"]);
        persona("s5-c", t, { x: 130, y: 1700, s: 0.66, mira: 1, vivo: true, boca: [[0, "seria"], [c["c5-gana"], "sonrisa"]], ojos: [[0, "normal"], [c["c5-gana"], "felices"]], brazo: [[0, "abajo"]], fase: 1 });
        persona("s5-g", t, { x: 950, y: 1700, s: 0.64, mira: -1, vivo: true, charla: e, boca: habla(t, e, "sonrisa"), brazo: [[0, "abajo"], [c["c5-15"] - 0.2, "senala"], [c["c5-cuarta"], "hombros"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c5-15"], e.c["c5-cuarta"]]); } },

    // 6 · Los de arriba. La gestora: «Y de 83.000 para arriba ni 3 de cada 100.»
    { n: 6, set: "vacio",
      svg: `<g transform="translate(540 1060) scale(.9)">${ESC("s6-e", [3, 4, 5], { colores: { 3: "#C8902E", 4: "#B3261E", 5: "#B3261E" } })}</g>${gente("s6", "cg")}`,
      tarjeta: grande(6, `Más de ${L[3]} € al año`, `${coma(D.R.mas_5smi_pct)}&nbsp;%`, "ni 3 de cada 100", `Más de ${L[4]} €, el ${coma(D.R.mas_7_5smi_pct)}&nbsp;%`, F_AEAT),
      fn: function (t, e) {
        const c = e.c;
        ambiente("gestoria", null, t, 0);
        vidaFondo("ge", t, { capa: "gestoria", lamparas: 1, balanceo: 1 });
        for (let i = 0; i < 3; i++) css(`s6-e-b${i}`, "transform", "scaleX(1)");
        for (let i = 3; i < 6; i++) {
          const x = c["c6-83000"] - 0.3 + (i - 3) * 0.3;
          css(`s6-e-b${i}`, "transform", `scaleX(${suave(clamp((t - x) / 0.6)).toFixed(3)})`); css(`s6-e-v${i}`, "opacity", clamp((t - x - 0.4) / 0.3));
        }
        sube("c6-a", t, c["c6-83000"]); sube("c6-b", t, c["c6-3"]);
        persona("s6-c", t, { x: 130, y: 1700, s: 0.66, mira: 1, vivo: true, boca: [[0, "seria"], [c["c6-3"], "o"]], ojos: [[0, "normal"], [c["c6-3"], "grandes"]], brazo: [[0, "abajo"]], fase: 1 });
        persona("s6-g", t, { x: 950, y: 1700, s: 0.64, mira: -1, vivo: true, charla: e, boca: habla(t, e, "sonrisa"), brazo: [[0, "abajo"], [c["c6-83000"] - 0.2, "senala"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c6-3"]]); } },

    // 7 · La media. El cliente: «Pues el sueldo medio ese de casi 26.000 euros que sale en la tele…»
    { n: 7, set: "vacio",
      svg: `<g transform="translate(540 1040) scale(.95)">${tele("s7-t", "SUELDO MEDIO", `${miles(D.media)} €`)}</g>${gente("s7", "cg")}`,
      tarjeta: grande(7, "Sueldo medio", `${miles(D.media)}&nbsp;€`, "al año, en bruto (2025)", "Salarios entre asalariados", F_AEAT, "#5B6470"),
      fn: function (t, e) {
        const c = e.c;
        ambiente("gestoria", null, t, 0);
        vidaFondo("ge", t, { capa: "gestoria", lamparas: 1, balanceo: 1 });
        pop("s7-t", t, c["c7-medio"] - 0.3, 0, 0, { s: 1 });
        sube("c7-a", t, c["c7-26000"]); sube("c7-b", t, c["c7-26000"] + 0.3);
        persona("s7-c", t, { x: 130, y: 1700, s: 0.66, mira: 1, vivo: true, charla: e, boca: habla(t, e, "sonrisa"), brazo: [[0, "abajo"], [c["c7-tele"] - 0.3, "senala"]], fase: 1 });
        persona("s7-g", t, { x: 950, y: 1700, s: 0.64, mira: -1, vivo: true, boca: [[0, "seria"]], brazo: [[0, "abajo"], [c["c7-tele"], "hombros"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c7-26000"]]); } },

    // 8 · La media engaña. La gestora: «Engaña. Más de 6 de cada 10 cobran menos que la media… los que ganan mucho tiran de ella para arriba.»
    { n: 8, set: "vacio",
      svg: `<g transform="translate(540 1240)"><rect x="-380" y="-330" width="760" height="420" rx="24" fill="#FFFDF8" opacity=".95"/>${balancin("s8-b")}</g>${gente("s8", "cg")}`,
      tarjeta: grande(8, "Cobran menos que la media", `${Math.round(D.bajo)}&nbsp;%`, "más de 6 de cada 10", `Los tramos enteros por debajo de ${miles(D.media)} €. Los que ganan mucho suben la media`, F_AEAT),
      fn: function (t, e) {
        const c = e.c;
        ambiente("gestoria", null, t, 0);
        vidaFondo("ge", t, { capa: "gestoria", lamparas: 1, balanceo: 1 });
        pop("s8-b", t, e.t0 + 0.05, 0, 0, { s: 1 });
        const k = suave(clamp((t - c["c8-tiran"] + 0.2) / 0.8));
        attr("s8-b-t", "transform", `rotate(${(-6 + 16 * k).toFixed(2)} 0 -99)`);
        sube("c8-a", t, c["c8-6"]); sube("c8-b", t, c["c8-6"] + 0.3);
        persona("s8-c", t, { x: 130, y: 1700, s: 0.66, mira: 1, vivo: true, boca: [[0, "seria"], [c["c8-6"], "o"]], ojos: [[0, "normal"], [c["c8-6"], "grandes"]], brazo: [[0, "abajo"]], fase: 1 });
        persona("s8-g", t, { x: 950, y: 1700, s: 0.64, mira: -1, vivo: true, charla: e, boca: habla(t, e, "seria"), brazo: [[0, "abajo"], [c["c8-engana"], "senala"], [c["c8-tiran"], "arriba"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c8-engana"], e.c["c8-tiran"]]); } },

    // 9 · El cliente: «¿Y por lo menos ganamos más que antes de la crisis?»
    { n: 9, set: "vacio",
      svg: `${gente("s9", "cg")}`,
      tarjeta: cita(9, "El cliente", `«¿Ganamos más que antes de la <mark id="m9">crisis</mark>?»`),
      fn: function (t, e) {
        const c = e.c;
        ambiente("gestoria", null, t, 0);
        vidaFondo("ge", t, { capa: "gestoria", lamparas: 1, balanceo: 1 });
        marca("m9", t, c["c9-crisis"]);
        persona("s9-c", t, { x: 300, y: 1440, s: 0.8, mira: 1, vivo: true, charla: e, boca: habla(t, e, "sonrisa"), brazo: [[0, "abajo"], [c["c9-crisis"] - 0.4, "piensa"]], fase: 1 });
        persona("s9-g", t, { x: 800, y: 1440, s: 0.78, mira: -1, vivo: true, boca: [[0, "seria"]], brazo: [[0, "abajo"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c9-crisis"]]); } },

    // 10 · El sueldo medio en euros de hoy (AEAT e IPC). La gestora: «Con los precios de hoy compra lo mismo que en 2007. Eso sí un 11 % más que en plena crisis.»
    { n: 10, set: "vacio",
      svg: `<g transform="translate(540 1330)">${columnasHoras("s10-c", D.real, D.anos, { W: 740, H: 360, tam: 34, fmt: (v) => `${miles(v)} €` })}</g>${gente("s10", "cg")}`,
      tarjeta: vs(10, "Sueldo medio en euros de hoy", [`${miles(D.real[0])}&nbsp;€`, `${miles(D.real[4])}&nbsp;€`], ["2007", "2025"],
        `Plena crisis (2013): ${miles(D.real[1])} €; hoy, un ${Math.round(D.vs["2013"])}&nbsp;% más. 2016: ${miles(D.real[2])} €; 2019: ${miles(D.real[3])} €`, F_REAL, 80),
      fn: function (t, e) {
        const c = e.c;
        ambiente("gestoria", null, t, 0);
        vidaFondo("ge", t, { capa: "gestoria", lamparas: 1, balanceo: 1 });
        pop("s10-c", t, e.t0 + 0.05, 0, 0, { s: 1 });
        const cuando = [c["c10-2007"] - 0.3, c["c10-crisis"] - 0.4, e.t0 + 0.5, e.t0 + 0.6, c["c10-2007"] + 0.1];
        for (let i = 0; i < 5; i++) {
          const k = suave(clamp((t - cuando[i]) / 0.5));
          css(`s10-c-b${i}`, "transform", `scaleY(${k.toFixed(3)})`);
          css(`s10-c-v${i}`, "opacity", clamp((t - cuando[i] - 0.35) / 0.25));
        }
        sube("c10-a", t, c["c10-2007"]); sube("c10-b", t, c["c10-2007"] + 0.3);
        persona("s10-c", t, { x: 130, y: 1700, s: 0.66, mira: 1, vivo: true, boca: [[0, "seria"], [c["c10-11"], "sonrisa"]], brazo: [[0, "abajo"]], fase: 1 });
        persona("s10-g", t, { x: 950, y: 1700, s: 0.64, mira: -1, vivo: true, charla: e, boca: habla(t, e, "sonrisa"), brazo: [[0, "abajo"], [c["c10-2007"] - 0.2, "senala"], [c["c10-11"], "hombros"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c10-2007"], e.c["c10-11"]]); } },

    // 11 · Veredicto y pregunta. El cliente: «O sea que dieciocho años después igual… ¿Y tú en qué tramo estás?»
    { n: 11, set: "vacio",
      svg: `${gente("s11", "cg")}`,
      tarjeta: tarjeta(11, "Te toca", `<div class="tit" style="font-size:60px">¿Y tú en qué <mark id="m11">tramo</mark> estás?</div><div class="sub" id="c11-sub">Te leo en los comentarios.</div>`),
      fn: function (t, e) {
        const c = e.c;
        ambiente("gestoria", null, t, 0);
        vidaFondo("ge", t, { capa: "gestoria", lamparas: 1, balanceo: 1 });
        marca("m11", t, c["c11-tramo"] + 0.2);
        sube("c11-sub", t, c["c11-tramo"] + 0.7);
        persona("s11-c", t, { x: 300, y: 1440, s: 0.8, mira: [[0, 1], [c["c11-igual"] + 0.4, 0]], vivo: true, charla: e, boca: habla(t, e, "sonrisa"), brazo: [[0, "abajo"], [c["c11-igual"], "hombros"], [c["c11-tramo"] - 0.6, "senala"]], fase: 1 });
        persona("s11-g", t, { x: 800, y: 1440, s: 0.78, mira: -1, vivo: true, boca: [[0, "seria"], [c["c11-tramo"], "sonrisa"]], brazo: [[0, "abajo"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c11-igual"], e.c["c11-tramo"]]); } },
  ];
}
