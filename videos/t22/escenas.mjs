// Escenas de T22 («¿Quién cobra más: un jubilado o un joven que trabaja?») en estilo «limpio». Bruno, 24-11-2026:
// la pensión media de jubilación (Seguridad Social, INE) frente al salario medio de 25 a 34 años (INE, EAES), en bruto:
// hoy, 2007, la crisis (2013), 2016 y 2018; los menores de 25 años (Bruno, 24-11-2026); y cuánto ha subido cada uno desde 2007.
//   · «abuelo»: unos 75, canas y bigote, cárdigan marrón; jubilado, cree que cobra la mitad que su nieta (voz «padre»).
//   · «nieta»: unos 29, melena castaña oscura, chaqueta verde salvia; trabaja y lo comprueba todo (voz «viajera»).
// Decorado (diseno/pension.mjs): un parque de barrio por la tarde, con bancos, farolas y palomas.
/* eslint-disable no-undef */

import { persona, tarjeta, selloOficial } from "../../diseno/limpio.mjs";
import { bandera } from "../../diseno/barrio.mjs";
import { ambientes } from "../../diseno/sueno.mjs";
import { columnasHoras } from "../../diseno/alquiler.mjs";
import { DECORADOS_T22, cartaPension, catorcePagas, dosMontones, barrasSubida } from "../../diseno/pension.mjs";

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
const HERMANO = { pelo: "corto", canas: false, barba: false, colorPelo: "#3B2A20", ropa: ["#3E8E8A", "#33746F"], piel: "#F1C9A5", volumen: true };   // solo en la foto
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
  const BARRAS = (id, o = {}) => barrasSubida(id, [
    { rotulo: "Pensión media", valor: D.sube.pension_sube_pct, color: "#C8902E" },
    { rotulo: "Sueldo de un joven", valor: D.sube.joven_sube_pct, color: "#3F7A4A" },
    { rotulo: "Precios (IPC)", valor: D.sube.precios_suben_pct, color: "#8C969C" }], o);
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

    // 6 · Desde 2016, igual; y el hermano pequeño. El abuelo: «Bueno desde 2016 igual… y a tu hermano el de 22 le gano.»
    { n: 6, set: "vacio",
      svg: `<g transform="translate(540 1330)">${COLS("s6-h")}</g>
        <g id="s6-f"><g transform="translate(330 1010) rotate(-5)"><rect x="-110" y="-140" width="220" height="250" rx="12" fill="#8E6644"/><rect x="-94" y="-124" width="188" height="200" fill="#DDEFF7"/>
          <g transform="translate(0 70) scale(.3)">${persona("s6-fh", "hoy", HERMANO)}</g>${`<text x="0" y="100" text-anchor="middle" font-family="Cap" font-weight="800" font-size="30" fill="#FFFFFF">22 años</text>`}</g></g>
        ${gente("s6", "bn")}`,
      tarjeta: vs(6, TIT_R, [pct(D.ratio[2]), pct(D.ratio[4])], ["en 2016", "hoy"], `2007: ${r[0]}&nbsp;% · 2013: ${r[1]}&nbsp;% · 2018: ${r[3]}&nbsp;%`, F_RATIO),
      fn: function (t, e) {
        const c = e.c;
        ambiente("parquePlaza", null, t, 0);
        vidaFondo("pq", t, { capa: "parquePlaza" });
        const dim = suave(clamp((t - c["c6-2016"]) / 0.5));
        for (let i = 0; i < 5; i++) { const o = i === 2 || i === 4 ? 1 : 1 - 0.65 * dim; css(`s6-h-b${i}`, "opacity", o); css(`s6-h-v${i}`, "opacity", o); }
        pop("s6-f", t, c["c6-hermano"] - 0.1, 0, 0, { s: 1 });
        sube("c6-a", t, e.t0 - 1); sube("c6-b", t, e.t0 - 1);
        persona("s6-b", t, { x: 130, y: 1700, s: 0.66, mira: 1, vivo: true, charla: e, boca: habla(t, e, "sonrisa"), brazo: [[0, "abajo"], [c["c6-2016"] - 0.2, "senala"], [c["c6-hermano"], "arriba"]], fase: 1 });
        persona("s6-n", t, { x: 950, y: 1700, s: 0.64, mira: -1, vivo: true, boca: [[0, "seria"], [c["c6-hermano"] + 0.3, "sonrisa"]], brazo: [[0, "abajo"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c6-hermano"]]); } },

    // 7 · Los menores de 25 años (EAES). La nieta: «Eso sí. Los menores de 25 cobran de media 15.136 euros y tu pensión un 34 % más… en 2007 al revés.»
    { n: 7, set: "vacio",
      svg: `<g transform="translate(540 1330)">${dosMontones("s7-m", [D.F["2024"].pension_anual, D.F["2024"].menor25_anual], ["Pensión", "Menor de 25"], [`${miles(D.F["2024"].pension_anual)} €`, `${miles(D.F["2024"].menor25_anual)} €`])}</g>
        <g id="s7-r"><g transform="translate(540 765) rotate(-4)"><rect x="-230" y="-48" width="460" height="96" rx="18" fill="#5B6470"/><text x="0" y="16" text-anchor="middle" font-family="Cap" font-weight="800" font-size="40" fill="#FFFFFF">En 2007, al revés</text></g></g>
        ${gente("s7", "bn")}`,
      tarjeta: vs(7, "Al año, en bruto", [`${miles(D.F["2024"].pension_anual)}&nbsp;€`, `${miles(D.F["2024"].menor25_anual)}&nbsp;€`], ["pensión media", "menores de 25 años"],
        `La pensión es un ${Math.round(D.F["2024"].pension_mas_que_menor25_pct)}&nbsp;% más. En 2007, al revés: un menor de 25 cobraba un ${Math.round(D.F["2007"].menor25_mas_que_pension_pct)}&nbsp;% más que la pensión media. En bruto; el sueldo incluye jornada parcial`, F_HOY, 84),
      fn: function (t, e) {
        const c = e.c;
        ambiente("parquePlaza", null, t, 0);
        vidaFondo("pq", t, { capa: "parquePlaza" });
        pop("s7-m-m1", t, c["c7-15136"] - 0.2, 210, 0, { s: 1 });
        pop("s7-m-m0", t, c["c7-34"] - 0.3, -210, 0, { s: 1 });
        pop("s7-r", t, c["c7-reves"] - 0.1, 0, 0, { s: 1 });
        sube("c7-b", t, c["c7-15136"]); sube("c7-a", t, c["c7-34"]);
        persona("s7-b", t, { x: 130, y: 1700, s: 0.66, mira: 1, vivo: true, boca: [[0, "sonrisa"], [c["c7-reves"] + 0.2, "o"]], ojos: [[0, "felices"], [c["c7-reves"] + 0.2, "grandes"]], brazo: [[0, "abajo"]], fase: 1 });
        persona("s7-n", t, { x: 950, y: 1700, s: 0.64, mira: -1, vivo: true, charla: e, boca: habla(t, e, "seria"), brazo: [[0, "abajo"], [c["c7-15136"] - 0.2, "senala"], [c["c7-reves"], "hombros"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c7-34"]]); } },

    // 8 · La subida de la pensión. El abuelo: «Hombre… es que desde 2007 mi pensión ha subido un 91 %.»
    { n: 8, set: "vacio",
      svg: `<g transform="translate(540 1010)">${BARRAS("s8-s", { conValor: [0] })}</g>${gente("s8", "bn")}`,
      tarjeta: grande(8, "Desde 2007, la pensión media", `+${Math.round(D.sube.pension_sube_pct)}&nbsp;%`, "en euros de cada año", `De ${miles(D.F["2007"].pension_mes)}&nbsp;€ a ${miles(D.F["2024"].pension_mes)}&nbsp;€ al mes`, "Cálculo propio · Seguridad Social e INE", "#A9781F"),
      fn: function (t, e) {
        const c = e.c;
        ambiente("parquePlaza", null, t, 0);
        vidaFondo("pq", t, { capa: "parquePlaza" });
        pop("s8-s", t, e.t0 + 0.05, 0, 0, { s: 1 });
        const k = suave(clamp((t - c["c8-91"] + 0.2) / 0.7));
        css("s8-s-b0", "transform", `scaleX(${k.toFixed(3)})`); css("s8-s-v0", "opacity", clamp((t - c["c8-91"]) / 0.3));
        for (const i of [1, 2]) { css(`s8-s-b${i}`, "transform", "scaleX(0)"); css(`s8-s-v${i}`, "opacity", 0); }
        sube("c8-a", t, c["c8-91"]); sube("c8-b", t, c["c8-91"] + 0.3);
        persona("s8-b", t, { x: 130, y: 1700, s: 0.66, mira: 1, vivo: true, charla: e, boca: habla(t, e, "sonrisa"), brazo: [[0, "abajo"], [c["c8-91"] - 0.3, "senala"]], fase: 1 });
        persona("s8-n", t, { x: 950, y: 1700, s: 0.64, mira: -1, vivo: true, boca: [[0, "seria"]], brazo: [[0, "abajo"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c8-91"]]); } },

    // 9 · El sueldo joven y los precios. La nieta: «Y el sueldo joven un 37 %… con los precios un 39 % más caros.»
    { n: 9, set: "vacio",
      svg: `<g transform="translate(540 1010)">${BARRAS("s9-s")}</g>${gente("s9", "bn")}`,
      tarjeta: vs(9, "Desde 2007, en euros de cada año", [`+${Math.round(D.sube.joven_sube_pct)}&nbsp;%`, `+${Math.round(D.sube.precios_suben_pct)}&nbsp;%`], ["sueldo de un joven", "precios (IPC)"],
        `Pensión, +${Math.round(D.sube.pension_sube_pct)}&nbsp;%. En euros de hoy: pensión +${Math.round(D.sube.pension_real_pct)}&nbsp;% y sueldo de un joven, igual`, F_IPC),
      fn: function (t, e) {
        const c = e.c;
        ambiente("parquePlaza", null, t, 0);
        vidaFondo("pq", t, { capa: "parquePlaza" });
        css("s9-s-b0", "transform", "scaleX(1)"); css("s9-s-v0", "opacity", 1);
        [[1, c["c9-37"]], [2, c["c9-39"]]].forEach(([i, x]) => {
          const k = suave(clamp((t - x + 0.1) / 0.6));
          css(`s9-s-b${i}`, "transform", `scaleX(${k.toFixed(3)})`); css(`s9-s-v${i}`, "opacity", clamp((t - x - 0.3) / 0.3));
        });
        sube("c9-a", t, c["c9-37"]); sube("c9-b", t, c["c9-39"]);
        persona("s9-b", t, { x: 130, y: 1700, s: 0.66, mira: 1, vivo: true, boca: [[0, "sonrisa"], [c["c9-39"] + 0.3, "seria"]], ojos: [[0, "normal"]], brazo: [[0, "abajo"]], fase: 1 });
        persona("s9-n", t, { x: 950, y: 1700, s: 0.64, mira: -1, vivo: true, charla: e, boca: habla(t, e, "seria"), brazo: [[0, "abajo"], [c["c9-37"] - 0.2, "senala"], [c["c9-39"], "hombros"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c9-39"]]); } },

    // 10 · Veredicto y pregunta. La nieta: «Total que el jubilado gana poder de compra y el joven se queda igual. ¿Y en tu casa quién llega mejor a fin de mes?»
    { n: 10, set: "vacio",
      svg: `${gente("s10", "bn")}`,
      tarjeta: tarjeta(10, "Te toca", `<div class="tit" style="font-size:60px">¿En tu casa quién llega mejor a fin de <mark id="m10">mes</mark>?</div><div class="sub" id="c10-sub">Te leo en los comentarios.</div>`),
      fn: function (t, e) {
        const c = e.c;
        ambiente("parquePlaza", null, t, 0);
        vidaFondo("pq", t, { capa: "parquePlaza" });
        for (let i = 0; i < 3; i++) attr(`pq-p${i}-c`, "transform", `rotate(${(Math.max(0, Math.sin(t * 3 + i * 2)) * 18).toFixed(1)} 20 -20)`);
        marca("m10", t, c["c10-casa"] + 0.8);
        sube("c10-sub", t, c["c10-casa"] + 1.2);
        persona("s10-b", t, { x: 300, y: 1440, s: 0.8, mira: 1, vivo: true, boca: [[0, "seria"], [c["c10-casa"], "sonrisa"]], ojos: [[0, "normal"]], brazo: [[0, "abajo"], [c["c10-igual"], "hombros"]], fase: 1 });
        persona("s10-n", t, { x: 790, y: 1440, s: 0.78, mira: [[0, -1], [c["c10-casa"] - 0.2, 0]], vivo: true, charla: e, boca: habla(t, e, "sonrisa"), brazo: [[0, "abajo"], [c["c10-igual"], "hombros"], [c["c10-casa"], "senala"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c10-igual"], e.c["c10-casa"]]); } },
  ];
}
