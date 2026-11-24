// Escenas de T22 («¿Quién cobra más: un jubilado o un joven que trabaja?») en estilo «limpio». Bruno, 24-11-2026:
// la pensión media de jubilación (Seguridad Social, INE) frente al salario medio de 25 a 34 años (INE, EAES), en bruto:
// hoy, 2007, la crisis (2013), 2016 y 2018; y cuánto ha subido cada uno desde 2007 frente a los precios.
//   · «abuelo»: unos 75, canas y bigote, cárdigan marrón; jubilado, cree que cobra la mitad que su nieta (voz «padre»).
//   · «nieta»: unos 29, melena castaña oscura, chaqueta verde salvia; trabaja y lo comprueba todo (voz «viajera»).
// Decorado (diseno/pension.mjs): un parque de barrio por la tarde, con bancos, farolas y palomas.
/* eslint-disable no-undef */

import { persona, tarjeta, selloOficial } from "../../diseno/limpio.mjs";
import { bandera } from "../../diseno/barrio.mjs";
import { ambientes } from "../../diseno/sueno.mjs";
import { columnasHoras } from "../../diseno/alquiler.mjs";
import { DECORADOS_T22, cartaPension, catorcePagas, dosMontones, barrasSubida, dosCarros } from "../../diseno/pension.mjs";

export const ESTILO = "limpio";
const F_SS = "Seguridad Social · Pensiones contributivas en vigor";
const F_HOY = "Seguridad Social · INE (Encuesta de Estructura Salarial)";
const F_RATIO = "Cálculo propio · INE y Seguridad Social";
const F_IPC = "Cálculo propio · Seguridad Social e INE (IPC)";

const miles = (v) => String(Math.round(v)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");

export function datos(d) {
  const F = d.filas, A = ["2007", "2013", "2016", "2018", "2024"];
  return { F, ratio: A.map((a) => F[a].pension_sobre_joven_pct), sube: d.desde_2007 };
}

export const capas = () => ambientes({ parquePlaza: DECORADOS_T22.parquePlaza });

// ------------------------------------------------------------------ personajes (inventados), con volumen
const ABUELO = { pelo: "corto", canas: true, barba: false, bigote: true, colorPelo: "#B8B0A4", colorBigote: "#C9C2B6", ropa: ["#8C6F5A", "#6E5444"], piel: "#EBC3A0", piel2: "#D9AE8C", volumen: true };
const NIETA = { pelo: "largo", canas: false, barba: false, colorPelo: "#4A3020", ropa: ["#7C9A7E", "#647F66"], piel: "#F2CBA8", volumen: true };
const QUIEN = { b: ABUELO, n: NIETA };
const gente = (n, quien) => quien.split("").map((k) => persona(`${n}-${k}`, "hoy", QUIEN[k])).join("");

// ------------------------------------------------------------------ tarjetas
const HOY = "#B3261E";
const cita = (n, quien, html) => tarjeta(n, quien, `<div class="tit" style="font-size:64px">${html}</div>`, { tono: "hoy" });
const grande = (n, titulo, cifra, sub, nota, fuente, color = HOY) => tarjeta(n, titulo, `<div class="tit" style="font-size:104px;color:${color};line-height:1" id="c${n}-a">${cifra}</div>
  <div class="sub" id="c${n}-b" style="font-size:42px">${sub}</div>${nota ? `<div class="nota">${nota}</div>` : ""}`, { fuente, icono: bandera(44) });
const vs = (n, titulo, vals, labs, nota, fuente, tam = 96) => tarjeta(n, titulo, `<div class="vs">${vals.map((v, i) => `<div class="col"><div class="v ${i ? "t-hoy" : "t-pasado"}" id="c${n}-${"ab"[i]}" style="font-size:${tam}px">${v}</div><div class="n">${labs[i]}</div></div>`).join("")}</div>
  <div class="nota">${nota}</div>`, { fuente, icono: bandera(44) });

export function escenas(D) {
  const pct = (v) => `${Math.round(v)}&nbsp;%`;
  const r = D.ratio.map((x) => Math.round(x));      // 2007, 2013, 2016, 2018, hoy
  const COLS = (id) => columnasHoras(id, D.ratio, ["2007", "2013", "2016", "2018", "Hoy"], { W: 690, H: 360, fmt: (v) => `${Math.round(v)} %` });
  const TIT_R = "La pensión media, en % del sueldo de un joven";
  return [
    // 1 · Gancho. El parque. La nieta: «¿Quién cobra más hoy: un jubilado o un joven que curra? Porque mi abuelo dice que él ni la mitad que yo…»
    { n: 1, set: "vacio",
      svg: `${gente("s1", "bn")}${selloOficial("s1-sello")}`,
      tarjeta: tarjeta(1, "Pensiones y sueldos · de 2007 a hoy", `<div class="tit" style="font-size:64px">¿Quién cobra más: un <mark id="m1">jubilado</mark> o un joven que trabaja?</div>`, { icono: bandera(44) }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("parquePlaza", null, t, 0);
        vidaFondo("pq", t, { capa: "parquePlaza" });
        for (let i = 0; i < 3; i++) attr(`pq-p${i}-c`, "transform", `rotate(${(Math.max(0, Math.sin(t * 3 + i * 2)) * 18).toFixed(1)} 20 -20)`);
        marca("m1", t, c["c1-jubilado"]);
        selloAnim("s1-sello", t, c["c1-sello"], 545, 860, { s: 0.75, r: -9 });
        persona("s1-b", t, { x: 300, y: 1440, s: 0.8, mira: 1, vivo: true, boca: [[0, "sonrisa"], [c["c1-mitad"], "grande"]], ojos: [[0, "normal"], [c["c1-mitad"], "felices"]], brazo: [[0, "abajo"], [c["c1-mitad"], "hombros"]], fase: 1 });
        persona("s1-n", t, { x: 790, y: 1440, s: 0.78, mira: [[0, 0], [c["c1-abuelo"] - 0.2, -1]], vivo: true, charla: e, boca: habla(t, e, "sonrisa"), brazo: [[0, "abajo"], [c["c1-jubilado"] - 0.2, "senala"], [c["c1-abuelo"], "hombros"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c1-jubilado"], e.c["c1-mitad"]]); } },

    // 2 · La pensión media (Seguridad Social). El abuelo: «Hombre… la pensión media de jubilación son 1.451 euros al mes y tú cobras mucho más.»
    { n: 2, set: "vacio",
      svg: `<g transform="translate(540 950)">${cartaPension("s2-c", `${miles(D.F["2024"].pension_mes)} €`)}</g><g transform="translate(540 1230) scale(.78)">${catorcePagas("s2-p")}</g>${gente("s2", "bn")}`,
      tarjeta: grande(2, "Pensión media de jubilación", `${miles(D.F["2024"].pension_mes)}&nbsp;€`, "al mes, en bruto", "En 14 pagas. Todo el sistema de la Seguridad Social, a final de 2024", F_SS),
      fn: function (t, e) {
        const c = e.c;
        ambiente("parquePlaza", null, t, 0);
        vidaFondo("pq", t, { capa: "parquePlaza" });
        pop("s2-c", t, c["c2-pension"] - 0.2, 0, 0, { s: 1 });
        for (let i = 0; i < 14; i++) pop(`s2-p-s${i}`, t, c["c2-1451"] + 0.3 + i * 0.07, 0, 0, { s: 1 });
        sube("c2-a", t, c["c2-1451"]); sube("c2-b", t, c["c2-1451"] + 0.3);
        persona("s2-b", t, { x: 130, y: 1700, s: 0.66, mira: 1, vivo: true, charla: e, boca: habla(t, e, "sonrisa"), brazo: [[0, "abajo"], [c["c2-1451"] - 0.3, "senala"], [c["c2-mas"], "hombros"]], fase: 1 });
        persona("s2-n", t, { x: 950, y: 1700, s: 0.64, mira: -1, vivo: true, boca: [[0, "seria"]], brazo: [[0, "abajo"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c2-1451"]]); } },

    // 3 · Al año (EAES y Seguridad Social). La nieta: «Ya pero un joven de mi edad cobra de media más de 25.000 euros al año y tú unos 20.000… el 81 % de lo mío.»
    { n: 3, set: "vacio",
      svg: `<g transform="translate(540 1330)">${dosMontones("s3-m", [D.F["2024"].pension_anual, D.F["2024"].joven_anual], ["Pensión", "Joven"], [`${miles(D.F["2024"].pension_anual)} €`, `${miles(D.F["2024"].joven_anual)} €`])}</g>${gente("s3", "bn")}`,
      tarjeta: vs(3, "Al año, en bruto", [`${miles(D.F["2024"].pension_anual)}&nbsp;€`, `${miles(D.F["2024"].joven_anual)}&nbsp;€`], ["pensión media", "joven de 25 a 34 años"],
        `La pensión es el ${r[4]}&nbsp;% del sueldo de un joven. Pensión media × 14 pagas y salario medio de 25 a 34 años (2024)`, F_HOY, 84),
      fn: function (t, e) {
        const c = e.c;
        ambiente("parquePlaza", null, t, 0);
        vidaFondo("pq", t, { capa: "parquePlaza" });
        pop("s3-m-m1", t, c["c3-25000"] - 0.2, 210, 0, { s: 1 });
        pop("s3-m-m0", t, c["c3-20000"] - 0.2, -210, 0, { s: 1 });
        sube("c3-b", t, c["c3-25000"]); sube("c3-a", t, c["c3-20000"]);
        persona("s3-b", t, { x: 130, y: 1700, s: 0.66, mira: 1, vivo: true, boca: [[0, "seria"], [c["c3-81"] + 0.2, "o"]], ojos: [[0, "normal"], [c["c3-81"] + 0.2, "grandes"]], brazo: [[0, "abajo"]], fase: 1 });
        persona("s3-n", t, { x: 950, y: 1700, s: 0.64, mira: -1, vivo: true, charla: e, boca: habla(t, e, "seria"), brazo: [[0, "abajo"], [c["c3-25000"] - 0.2, "senala"], [c["c3-81"], "hombros"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c3-81"]]); } },

    // 4 · El abuelo se sorprende: «¿El 81 %? Anda ya… en 2007 era poco más de la mitad.»
    { n: 4, set: "vacio",
      svg: `${gente("s4", "bn")}`,
      tarjeta: cita(4, "El abuelo", `«Antes era poco más de la <mark id="m4">mitad</mark>»`),
      fn: function (t, e) {
        const c = e.c;
        ambiente("parquePlaza", null, t, 0);
        vidaFondo("pq", t, { capa: "parquePlaza" });
        for (let i = 0; i < 3; i++) attr(`pq-p${i}-c`, "transform", `rotate(${(Math.max(0, Math.sin(t * 3 + i * 2)) * 18).toFixed(1)} 20 -20)`);
        marca("m4", t, c["c4-mitad"]);
        persona("s4-b", t, { x: 330, y: 1440, s: 0.82, mira: 1, vivo: true, charla: e, boca: habla(t, e, "grande"), ojos: [[0, "grandes"]], brazo: [[0, "abajo"], [c["c4-anda"], "arriba"], [c["c4-2007"], "senala"]], salta: c["c4-anda"], fase: 1 });
        persona("s4-n", t, { x: 790, y: 1440, s: 0.78, mira: -1, vivo: true, boca: [[0, "sonrisa"]], brazo: [[0, "abajo"], [c["c4-mitad"], "hombros"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c4-anda"]]); } },

    // 5 · La pensión en % del sueldo joven, año a año. La nieta: «Eso. En 2007 el 58 % y hoy el 81 %… y en plena crisis ya el 76 %.»
    { n: 5, set: "vacio",
      svg: `<g transform="translate(540 1330)">${COLS("s5-h")}</g>${gente("s5", "bn")}`,
      tarjeta: vs(5, TIT_R, [pct(D.ratio[0]), pct(D.ratio[4])], ["en 2007", "hoy"], `2013: ${r[1]}&nbsp;% · 2016: ${r[2]}&nbsp;% · 2018: ${r[3]}&nbsp;%. En bruto; el sueldo de 2007 está estimado con la evolución del coste salarial`, F_RATIO),
      fn: function (t, e) {
        const c = e.c;
        ambiente("parquePlaza", null, t, 0);
        vidaFondo("pq", t, { capa: "parquePlaza" });
        pop("s5-h", t, e.t0 + 0.05, 0, 0, { s: 1 });
        const aparece = [c["c5-58"], c["c5-76"], c["c5-81"], c["c5-81"] + 0.15, c["c5-81"] + 0.3];
        for (let i = 0; i < 5; i++) {
          const k = suave(clamp((t - aparece[i] + 0.1) / 0.5));
          css(`s5-h-b${i}`, "transform", `scaleY(${k.toFixed(3)})`); css(`s5-h-v${i}`, "opacity", k);
        }
        sube("c5-a", t, c["c5-58"]); sube("c5-b", t, c["c5-81"]);
        persona("s5-b", t, { x: 130, y: 1700, s: 0.66, mira: 1, vivo: true, boca: [[0, "seria"]], ojos: [[0, "normal"]], brazo: [[0, "abajo"], [c["c5-76"], "piensa"]], fase: 1 });
        persona("s5-n", t, { x: 950, y: 1700, s: 0.64, mira: -1, vivo: true, charla: e, boca: habla(t, e, "seria"), brazo: [[0, "abajo"], [c["c5-58"] - 0.2, "senala"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c5-81"]]); } },

    // 6 · Desde 2016, igual. El abuelo: «Bueno pero desde 2016 está igual ¿no?»
    { n: 6, set: "vacio",
      svg: `<g transform="translate(540 1330)">${COLS("s6-h")}</g>${gente("s6", "bn")}`,
      tarjeta: vs(6, TIT_R, [pct(D.ratio[2]), pct(D.ratio[4])], ["en 2016", "hoy"], `2007: ${r[0]}&nbsp;% · 2013: ${r[1]}&nbsp;% · 2018: ${r[3]}&nbsp;%`, F_RATIO),
      fn: function (t, e) {
        const c = e.c;
        ambiente("parquePlaza", null, t, 0);
        vidaFondo("pq", t, { capa: "parquePlaza" });
        const dim = suave(clamp((t - c["c6-2016"]) / 0.5));
        for (let i = 0; i < 5; i++) { const o = i === 2 || i === 4 ? 1 : 1 - 0.65 * dim; css(`s6-h-b${i}`, "opacity", o); css(`s6-h-v${i}`, "opacity", o); }
        sube("c6-a", t, e.t0 - 1); sube("c6-b", t, e.t0 - 1);   // las dos cifras desde el principio: el plano es corto
        persona("s6-b", t, { x: 130, y: 1700, s: 0.66, mira: 1, vivo: true, charla: e, boca: habla(t, e, "sonrisa"), brazo: [[0, "abajo"], [c["c6-2016"] - 0.2, "senala"], [c["c6-igual"], "hombros"]], fase: 1 });
        persona("s6-n", t, { x: 950, y: 1700, s: 0.64, mira: -1, vivo: true, boca: [[0, "seria"], [c["c6-igual"] + 0.3, "sonrisa"]], brazo: [[0, "abajo"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c6-2016"]]); } },

    // 7 · Cuánto sube cada uno desde 2007. La nieta: «Lo gordo viene de antes. Desde 2007 tu pensión sube un 91 % y el sueldo joven un 37 %… y los precios un 39 %.»
    { n: 7, set: "vacio",
      svg: `<g transform="translate(540 1010)">${barrasSubida("s7-s", [
        { rotulo: "Pensión media", valor: D.sube.pension_sube_pct, color: "#C8902E" },
        { rotulo: "Sueldo de un joven", valor: D.sube.joven_sube_pct, color: "#3F7A4A" },
        { rotulo: "Precios (IPC)", valor: D.sube.precios_suben_pct, color: "#8C969C" }])}</g>${gente("s7", "bn")}`,
      tarjeta: vs(7, "Desde 2007, en euros de cada año", [`+${Math.round(D.sube.pension_sube_pct)}&nbsp;%`, `+${Math.round(D.sube.joven_sube_pct)}&nbsp;%`], ["pensión", "sueldo de un joven"],
        `Los precios (IPC), +${Math.round(D.sube.precios_suben_pct)}&nbsp;%`, "Cálculo propio · Seguridad Social e INE"),
      fn: function (t, e) {
        const c = e.c;
        ambiente("parquePlaza", null, t, 0);
        vidaFondo("pq", t, { capa: "parquePlaza" });
        pop("s7-s", t, e.t0 + 0.05, 0, 0, { s: 1 });
        [c["c7-91"], c["c7-37"], c["c7-39"]].forEach((x, i) => {
          const k = suave(clamp((t - x + 0.1) / 0.6));
          css(`s7-s-b${i}`, "transform", `scaleX(${k.toFixed(3)})`); css(`s7-s-v${i}`, "opacity", clamp((t - x - 0.3) / 0.3));
        });
        sube("c7-a", t, c["c7-91"]); sube("c7-b", t, c["c7-37"]);
        persona("s7-b", t, { x: 130, y: 1700, s: 0.66, mira: 1, vivo: true, boca: [[0, "seria"], [c["c7-91"] + 0.3, "sonrisa"]], ojos: [[0, "normal"]], brazo: [[0, "abajo"]], fase: 1 });
        persona("s7-n", t, { x: 950, y: 1700, s: 0.64, mira: -1, vivo: true, charla: e, boca: habla(t, e, "seria"), brazo: [[0, "abajo"], [c["c7-91"] - 0.2, "senala"], [c["c7-39"], "hombros"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c7-37"]]); } },

    // 8 · En euros de hoy (IPC). El abuelo: «O sea que en euros de hoy yo gano más de un tercio y tú… lo mismo que en 2007.»
    { n: 8, set: "vacio",
      svg: `<g transform="translate(540 1250)">${dosCarros("s8-k", ["Pensión", "Sueldo joven"])}</g>${gente("s8", "bn")}`,
      tarjeta: vs(8, "En euros de hoy, desde 2007", [`+${Math.round(D.sube.pension_real_pct)}&nbsp;%`, "igual"], ["pensión", "sueldo de un joven"],
        `Con el IPC del INE: pensión de ${miles(D.F["2007"].pension_mes_euros_2024)}&nbsp;€ a ${miles(D.F["2024"].pension_mes)}&nbsp;€ al mes; sueldo joven de ${miles(D.F["2007"].joven_anual_euros_2024)}&nbsp;€ a ${miles(D.F["2024"].joven_anual)}&nbsp;€ al año`, F_IPC),
      fn: function (t, e) {
        const c = e.c;
        ambiente("parquePlaza", null, t, 0);
        vidaFondo("pq", t, { capa: "parquePlaza" });
        pop("s8-k", t, e.t0 + 0.05, 0, 0, { s: 1 });
        for (let j = 0; j < 3; j++) pop(`s8-k-a-x${j}`, t, c["c8-tercio"] + j * 0.15, 0, 0, { s: 1 });
        sube("c8-a", t, c["c8-tercio"]); sube("c8-b", t, c["c8-mismo"]);
        persona("s8-b", t, { x: 130, y: 1700, s: 0.66, mira: 1, vivo: true, charla: e, boca: habla(t, e, "sonrisa"), brazo: [[0, "abajo"], [c["c8-tercio"] - 0.2, "senala"], [c["c8-mismo"], "hombros"]], fase: 1 });
        persona("s8-n", t, { x: 950, y: 1700, s: 0.64, mira: -1, vivo: true, boca: [[0, "seria"], [c["c8-mismo"] + 0.2, "o"]], ojos: [[0, "normal"], [c["c8-mismo"] + 0.2, "grandes"]], brazo: [[0, "abajo"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c8-mismo"]]); } },

    // 9 · Veredicto y pregunta. La nieta: «Total que el jubilado gana poder de compra y el joven se queda igual. ¿Y en tu casa quién llega mejor a fin de mes?»
    { n: 9, set: "vacio",
      svg: `${gente("s9", "bn")}`,
      tarjeta: tarjeta(9, "Te toca", `<div class="tit" style="font-size:60px">¿En tu casa quién llega mejor a fin de <mark id="m9">mes</mark>?</div><div class="sub" id="c9-sub">Te leo en los comentarios.</div>`),
      fn: function (t, e) {
        const c = e.c;
        ambiente("parquePlaza", null, t, 0);
        vidaFondo("pq", t, { capa: "parquePlaza" });
        for (let i = 0; i < 3; i++) attr(`pq-p${i}-c`, "transform", `rotate(${(Math.max(0, Math.sin(t * 3 + i * 2)) * 18).toFixed(1)} 20 -20)`);
        marca("m9", t, c["c9-casa"] + 0.8);
        sube("c9-sub", t, c["c9-casa"] + 1.2);
        persona("s9-b", t, { x: 300, y: 1440, s: 0.8, mira: 1, vivo: true, boca: [[0, "seria"], [c["c9-casa"], "sonrisa"]], ojos: [[0, "normal"]], brazo: [[0, "abajo"], [c["c9-igual"], "hombros"]], fase: 1 });
        persona("s9-n", t, { x: 790, y: 1440, s: 0.78, mira: [[0, -1], [c["c9-casa"] - 0.2, 0]], vivo: true, charla: e, boca: habla(t, e, "sonrisa"), brazo: [[0, "abajo"], [c["c9-igual"], "hombros"], [c["c9-casa"], "senala"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c9-igual"], e.c["c9-casa"]]); } },
  ];
}
