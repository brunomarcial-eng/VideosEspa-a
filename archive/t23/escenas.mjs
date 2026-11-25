// Escenas de T23 («¿Cuántas horas trabajas para tener la casa caliente?») en estilo «limpio». Bruno eligió la
// calefacción el 24-11-2026. Gasto medio por hogar en luz, gas y gasóleo (INE, EPF) en horas del sueldo neto mediano:
// 2007, la crisis (2013), 2016, 2019 y hoy (2025); y las personas que no pueden tener la casa caliente (INE, ECV).
//   · «vecina»: unos 68, pelo corto canoso, gafas, abrigo camel y bufanda verde; en casa con el abrigo puesto y la
//     calefacción apagada (voz «hostelera»).
//   · «tecnico»: unos 45, moreno, mono de trabajo gris; viene a revisar la caldera (voz «profesora»).
// Decorado (diseno/calefaccion.mjs): el salón de un piso antiguo en invierno, con nieve por la ventana y mesa camilla.
// Hace frío en casa: a los dos les sale vaho al hablar (vaho() del runtime).
/* eslint-disable no-undef */

import { persona, tarjeta, selloOficial } from "../../diseno/limpio.mjs";
import { bandera } from "../../diseno/barrio.mjs";
import { ambientes } from "../../diseno/sueno.mjs";
import { columnasHoras } from "../../diseno/alquiler.mjs";
import { barrasSubida } from "../../diseno/pension.mjs";
import { DECORADOS_T23, BUFANDA, GAFAS, MONO, vahoSVG, facturaLuz, cienPersonas, decilesFrio, ORDEN_FRIO, COLOR_FRIO } from "../../diseno/calefaccion.mjs";

export const ESTILO = "limpio";
const F_EPF = "INE · Encuesta de Presupuestos Familiares y Estructura Salarial";
const F_HORAS = "Cálculo propio · INE (Presupuestos Familiares y salarios)";
const F_ECV = "INE · Encuesta de Condiciones de Vida";

const miles = (v) => String(Math.round(v)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
const coma = (v, d = 1) => v.toFixed(d).replace(".", ",");

export function datos(d) {
  const F = d.filas, A = ["2007", "2013", "2016", "2019", "2025"];
  return {
    F, horas: A.map((a) => F[a].horas_anyo), sube: { factura: d.factura_sube_pct["2016"], sueldo: d.sueldo_hora_sube_pct["2016"] },
    dec19: Object.values(d.deciles_2019_pct), decHoy: Object.values(d.deciles_hoy_pct),
    frioHoy: Math.round(F["2025"].no_puede_calentar_pct), frioCrisis: Math.round(F["2013"].no_puede_calentar_pct),
    millones: Math.round(d.personas_no_puede_calentar_hoy / 1e6), orden: ORDEN_FRIO, azul: COLOR_FRIO,
  };
}

export const capas = () => ambientes({ salonInvierno: DECORADOS_T23.salonInvierno });

// ------------------------------------------------------------------ personajes (inventados), con volumen
const VECINA = { pelo: "corto", canas: true, barba: false, bigote: false, colorPelo: "#D2CCC2", ropa: ["#A9845E", "#8A6A4F"], piel: "#F0C9A8", piel2: "#DDB18E", volumen: true, encima: BUFANDA, gorro: GAFAS };
const TECNICO = { pelo: "corto", canas: false, barba: false, bigote: false, colorPelo: "#2E2420", ropa: ["#6B7F88", "#55676F"], piel: "#D9A77E", piel2: "#C79470", volumen: true, encima: MONO };
const QUIEN = { v: VECINA, t: TECNICO };
const gente = (n, quien) => quien.split("").map((k) => persona(`${n}-${k}`, "hoy", QUIEN[k])).join("") + vahoSVG(`${n}-hv`) + vahoSVG(`${n}-ht`);

// ------------------------------------------------------------------ tarjetas
const HOY = "#B3261E";
const cita = (n, quien, html) => tarjeta(n, quien, `<div class="tit" style="font-size:64px">${html}</div>`, { tono: "hoy" });
const grande = (n, titulo, cifra, sub, nota, fuente, color = HOY) => tarjeta(n, titulo, `<div class="tit" style="font-size:104px;color:${color};line-height:1" id="c${n}-a">${cifra}</div>
  <div class="sub" id="c${n}-b" style="font-size:42px">${sub}</div>${nota ? `<div class="nota">${nota}</div>` : ""}`, { fuente, icono: bandera(44) });
const vs = (n, titulo, vals, labs, nota, fuente, tam = 96) => tarjeta(n, titulo, `<div class="vs">${vals.map((v, i) => `<div class="col"><div class="v ${i ? "t-hoy" : "t-pasado"}" id="c${n}-${"ab"[i]}" style="font-size:${tam}px">${v}</div><div class="n">${labs[i]}</div></div>`).join("")}</div>
  <div class="nota">${nota}</div>`, { fuente, icono: bandera(44) });

// Vida del salón en cada escena: el decorado, la nieve por la ventana, la luz de la caldera y los vecinos con manta
// del bloque de enfrente (aparecen en el plano 8). Se escribe en cada fn porque las fn se serializan.
export function escenas(D) {
  const h = D.horas.map((x) => Math.round(x));      // 2007, 2013, 2016, 2019, hoy
  const pct = (v) => `${coma(v)}&nbsp;%`;
  return [
    // 1 · Gancho. La vecina: «¿Cuántas horas trabajas al año para tener la casa calentita? Porque yo estoy en casa con el abrigo puesto.»
    { n: 1, set: "vacio",
      svg: `${gente("s1", "vt")}${selloOficial("s1-sello")}`,
      tarjeta: tarjeta(1, "La calefacción · de 2007 a hoy", `<div class="tit" style="font-size:64px">¿Cuántas horas trabajas para tener la casa <mark id="m1">caliente</mark>?</div>`, { icono: bandera(44) }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("salonInvierno", null, t, 0);
        vidaFondo("si", t, { capa: "salonInvierno", lamparas: 1, balanceo: 1.5 });
        nieva("si-n", 26, t, 340, 520, 400, 380);
        pinta("si-led", "#7C8790");
        for (const i of [1, 4, 6, 9, 11]) css(`si-vp${i}`, "opacity", 0);
        marca("m1", t, c["c1-calentita"]);
        selloAnim("s1-sello", t, c["c1-sello"], 545, 860, { s: 0.75, r: -9 });
        const habla1 = t >= e.b && t <= e.f;
        persona("s1-v", t, { x: 330, y: 1440, s: 0.8, mira: 0, vivo: true, charla: e, boca: habla(t, e, "seria"), brazo: [[0, "abajo"], [c["c1-horas"], "senala"], [c["c1-abrigo"] - 0.2, "hombros"]], fase: 1 });
        trabaja("s1-t", t, { x: 860, y: 1440, s: 0.74, ritmo: 0.55, a: "sujeta", b: "piensa", mira: 1, boca: "seria" });
        vaho("s1-hv", t, 330, 1086, habla1, 1);
        vaho("s1-ht", t, 860, 1110, false, -1);
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c1-calentita"], e.c["c1-abrigo"]]); } },

    // 2 · La caldera funciona. El técnico: «Pues la caldera está perfecta señora… ¿por qué no la enciende?»
    { n: 2, set: "vacio",
      svg: `${gente("s2", "vt")}`,
      tarjeta: cita(2, "El técnico", `«La caldera, <mark id="m2">perfecta</mark>»`),
      fn: function (t, e) {
        const c = e.c;
        ambiente("salonInvierno", null, t, 0);
        vidaFondo("si", t, { capa: "salonInvierno", lamparas: 1, balanceo: 1.5 });
        nieva("si-n", 26, t, 340, 520, 400, 380);
        pinta("si-led", t >= c["c2-perfecta"] - 0.1 ? "#46B05A" : "#7C8790");
        for (const i of [1, 4, 6, 9, 11]) css(`si-vp${i}`, "opacity", 0);
        marca("m2", t, c["c2-perfecta"]);
        persona("s2-v", t, { x: 300, y: 1440, s: 0.8, mira: 1, vivo: true, boca: [[0, "seria"]], brazo: [[0, "abajo"], [c["c2-enciende"] + 0.3, "hombros"]], fase: 1 });
        persona("s2-t", t, { x: 800, y: 1440, s: 0.78, mira: [[0, 1], [c["c2-perfecta"] + 0.2, -1]], vivo: true, charla: e, boca: habla(t, e, "sonrisa"), brazo: [[0, "sujeta"], [c["c2-perfecta"], "senala"], [c["c2-enciende"], "hombros"]], espejo: true, fase: 2 });
        vaho("s2-hv", t, 300, 1086, false, 1);
        vaho("s2-ht", t, 800, 1095, t >= e.b && t <= e.f, -1);
      },
      cam: function (t, e) {
        const k = suave(clamp((t - e.t0) / 1.2));
        return { z: 1 + 0.18 * k, fx: 540 + 200 * k, fy: 1150 - 300 * k, sy: 1150 - 300 * k };
      } },

    // 3 · Lo que cree la vecina: «¿Con lo que cuesta hoy? Hijo eso cuesta más que en la crisis seguro.»
    { n: 3, set: "vacio",
      svg: `${gente("s3", "vt")}`,
      tarjeta: cita(3, "La vecina", `«Más que en la <mark id="m3">crisis</mark>, seguro»`),
      fn: function (t, e) {
        const c = e.c;
        ambiente("salonInvierno", null, t, 0);
        vidaFondo("si", t, { capa: "salonInvierno", lamparas: 1, balanceo: 1.5 });
        nieva("si-n", 26, t, 340, 520, 400, 380);
        pinta("si-led", "#46B05A");
        for (const i of [1, 4, 6, 9, 11]) css(`si-vp${i}`, "opacity", 0);
        marca("m3", t, c["c3-crisis"]);
        persona("s3-v", t, { x: 300, y: 1440, s: 0.8, mira: 1, vivo: true, charla: e, boca: habla(t, e, "seria"), ojos: [[0, "normal"], [c["c3-crisis"], "grandes"]], brazo: [[0, "abajo"], [c["c3-cuesta"], "arriba"], [c["c3-seguro"], "hombros"]], fase: 1 });
        persona("s3-t", t, { x: 800, y: 1440, s: 0.78, mira: -1, vivo: true, boca: [[0, "sonrisa"]], brazo: [[0, "abajo"]], espejo: true, fase: 2 });
        vaho("s3-hv", t, 300, 1086, t >= e.b && t <= e.f, 1);
        vaho("s3-ht", t, 800, 1095, false, -1);
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c3-crisis"]]); } },

    // 4 · La factura en horas (INE, EPF). El técnico: «A ver… un hogar gasta de media 1.255 euros al año en luz gas y gasóleo. Unas 97 horas de trabajo.»
    { n: 4, set: "vacio",
      svg: `<g transform="translate(540 1010) scale(.64)">${facturaLuz("s4-f", `${miles(D.F["2025"].gasto_anual)} €`)}</g>
        <g id="s4-h"><g transform="translate(540 1250)"><rect x="-260" y="-56" width="520" height="112" rx="56" fill="#B3261E"/>
          <text x="0" y="20" text-anchor="middle" font-family="Cap" font-weight="800" font-size="54" fill="#FFFFFF">= ${h[4]} horas de trabajo</text></g></g>
        ${gente("s4", "vt")}`,
      tarjeta: grande(4, "Luz, gas y gasóleo de un hogar", `${miles(D.F["2025"].gasto_anual)}&nbsp;€`, `al año = ${h[4]} horas de trabajo`,
        `Gasto medio por hogar (2025) en horas del sueldo neto mediano: unas ${Math.round(D.F["2025"].horas_mes)} horas al mes`, F_EPF),
      fn: function (t, e) {
        const c = e.c;
        ambiente("salonInvierno", null, t, 0);
        vidaFondo("si", t, { capa: "salonInvierno", lamparas: 1, balanceo: 1.5 });
        nieva("si-n", 26, t, 340, 520, 400, 380);
        pinta("si-led", "#46B05A");
        for (const i of [1, 4, 6, 9, 11]) css(`si-vp${i}`, "opacity", 0);
        pop("s4-f", t, e.t0 + 0.1, 0, 0, { s: 1 });
        pop("s4-h", t, c["c4-97"] - 0.1, 0, 0, { s: 1 });
        sube("c4-a", t, c["c4-1255"]); sube("c4-b", t, c["c4-97"]);
        persona("s4-v", t, { x: 130, y: 1700, s: 0.66, mira: 1, vivo: true, boca: [[0, "seria"], [c["c4-97"] + 0.3, "o"]], ojos: [[0, "normal"], [c["c4-97"] + 0.3, "grandes"]], brazo: [[0, "abajo"]], fase: 1 });
        persona("s4-t", t, { x: 950, y: 1700, s: 0.64, mira: -1, vivo: true, charla: e, boca: habla(t, e, "sonrisa"), brazo: [[0, "abajo"], [c["c4-1255"] - 0.2, "senala"], [c["c4-97"] + 0.4, "hombros"]], espejo: true, fase: 2 });
        vaho("s4-hv", t, 130, 1408, false, 1);
        vaho("s4-ht", t, 950, 1417, t >= e.b && t <= e.f, -1);
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c4-1255"], e.c["c4-97"]]); } },

    // 5 · Las horas de cada año. El técnico: «Y en plena crisis eran 118 horas… y en 2016 103. Hoy cuesta menos tiempo.»
    { n: 5, set: "vacio",
      svg: `<g transform="translate(540 1330)">${columnasHoras("s5-c", D.horas, ["2007", "2013", "2016", "2019", "Hoy"], { W: 690, H: 360 })}</g>${gente("s5", "vt")}`,
      tarjeta: vs(5, "Horas de trabajo al año para la luz y el gas", [`${h[1]}&nbsp;h`, `${h[4]}&nbsp;h`], ["en plena crisis (2013)", "hoy"],
        `2007: ${h[0]} h · 2016: ${h[2]} h · 2019: ${h[3]} h. Gasto medio por hogar entre el sueldo neto mediano por hora`, F_HORAS),
      fn: function (t, e) {
        const c = e.c;
        ambiente("salonInvierno", null, t, 0);
        vidaFondo("si", t, { capa: "salonInvierno", lamparas: 1, balanceo: 1.5 });
        nieva("si-n", 26, t, 340, 520, 400, 380);
        pinta("si-led", "#46B05A");
        for (const i of [1, 4, 6, 9, 11]) css(`si-vp${i}`, "opacity", 0);
        pop("s5-c", t, e.t0 + 0.05, 0, 0, { s: 1 });
        const cuando = [e.t0 + 0.3, c["c5-118"] - 0.25, c["c5-103"] - 0.25, e.t0 + 0.45, c["c5-menos"] - 0.3];
        for (let i = 0; i < 5; i++) {
          const k = suave(clamp((t - cuando[i]) / 0.5));
          css(`s5-c-b${i}`, "transform", `scaleY(${k.toFixed(3)})`);
          css(`s5-c-v${i}`, "opacity", clamp((t - cuando[i] - 0.35) / 0.25));
        }
        sube("c5-a", t, c["c5-118"]); sube("c5-b", t, c["c5-menos"]);
        persona("s5-v", t, { x: 130, y: 1700, s: 0.66, mira: 1, vivo: true, boca: [[0, "seria"], [c["c5-menos"], "o"]], ojos: [[0, "normal"], [c["c5-menos"], "grandes"]], brazo: [[0, "abajo"]], fase: 1 });
        persona("s5-t", t, { x: 950, y: 1700, s: 0.64, mira: -1, vivo: true, charla: e, boca: habla(t, e, "sonrisa"), brazo: [[0, "abajo"], [c["c5-118"] - 0.2, "senala"], [c["c5-menos"], "hombros"]], espejo: true, fase: 2 });
        vaho("s5-hv", t, 130, 1408, false, 1);
        vaho("s5-ht", t, 950, 1417, t >= e.b && t <= e.f, -1);
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c5-118"], e.c["c5-menos"]]); } },

    // 6 · La vecina no se lo cree: «Anda ya… ¿y eso cómo puede ser?»
    { n: 6, set: "vacio",
      svg: `${gente("s6", "vt")}`,
      tarjeta: cita(6, "La vecina", `«¿Y eso cómo puede <mark id="m6">ser</mark>?»`),
      fn: function (t, e) {
        const c = e.c;
        ambiente("salonInvierno", null, t, 0);
        vidaFondo("si", t, { capa: "salonInvierno", lamparas: 1, balanceo: 1.5 });
        nieva("si-n", 26, t, 340, 520, 400, 380);
        pinta("si-led", "#46B05A");
        for (const i of [1, 4, 6, 9, 11]) css(`si-vp${i}`, "opacity", 0);
        marca("m6", t, c["c6-ser"]);
        persona("s6-v", t, { x: 300, y: 1440, s: 0.8, mira: 1, vivo: true, charla: e, boca: habla(t, e, "grande"), ojos: [[0, "grandes"]], brazo: [[0, "abajo"], [c["c6-anda"], "arriba"], [c["c6-ser"], "hombros"]], salta: c["c6-anda"], fase: 1 });
        persona("s6-t", t, { x: 800, y: 1440, s: 0.78, mira: -1, vivo: true, boca: [[0, "sonrisa"]], ojos: [[0, "normal"], [c["c6-ser"] + 0.2, "felices"]], brazo: [[0, "abajo"]], espejo: true, fase: 2 });
        vaho("s6-hv", t, 300, 1086, t >= e.b && t <= e.f, 1);
        vaho("s6-ht", t, 800, 1095, false, -1);
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c6-anda"]]); } },

    // 7 · El porqué y 2007. El técnico: «Porque desde 2016 la factura ha subido un 19 % y el sueldo un 26. Eso sí… en 2007 eran 93, algo menos.»
    { n: 7, set: "vacio",
      svg: `<g transform="translate(540 1010)">${barrasSubida("s7-s", [{ rotulo: "La factura", valor: D.sube.factura, color: "#C8902E" }, { rotulo: "El sueldo", valor: D.sube.sueldo, color: "#3F7A4A" }])}</g>
        <g id="s7-p"><g transform="translate(540 1280)"><rect x="-300" y="-52" width="600" height="104" rx="52" fill="#5B6470"/>
          <text x="0" y="18" text-anchor="middle" font-family="Cap" font-weight="800" font-size="46" fill="#FFFFFF">En 2007: ${h[0]} horas al año</text></g></g>
        ${gente("s7", "vt")}`,
      tarjeta: vs(7, "Desde 2016", [`+${Math.round(D.sube.factura)}&nbsp;%`, `+${Math.round(D.sube.sueldo)}&nbsp;%`], ["la factura", "el sueldo neto por hora"],
        `En 2007, ${h[0]} horas al año: algo menos que hoy (${h[4]})`, F_HORAS),
      fn: function (t, e) {
        const c = e.c;
        ambiente("salonInvierno", null, t, 0);
        vidaFondo("si", t, { capa: "salonInvierno", lamparas: 1, balanceo: 1.5 });
        nieva("si-n", 26, t, 340, 520, 400, 380);
        pinta("si-led", "#46B05A");
        for (const i of [1, 4, 6, 9, 11]) css(`si-vp${i}`, "opacity", 0);
        pop("s7-s", t, e.t0 + 0.05, 0, 0, { s: 1 });
        [[0, c["c7-19"]], [1, c["c7-26"]]].forEach(([i, x]) => {
          const k = suave(clamp((t - x + 0.15) / 0.6));
          css(`s7-s-b${i}`, "transform", `scaleX(${k.toFixed(3)})`); css(`s7-s-v${i}`, "opacity", clamp((t - x - 0.25) / 0.3));
        });
        pop("s7-p", t, c["c7-2007"] - 0.1, 0, 0, { s: 1 });
        sube("c7-a", t, c["c7-19"]); sube("c7-b", t, c["c7-26"]);
        persona("s7-v", t, { x: 130, y: 1700, s: 0.66, mira: 1, vivo: true, boca: [[0, "seria"], [c["c7-26"] + 0.3, "sonrisa"]], brazo: [[0, "abajo"], [c["c7-93"], "hombros"]], fase: 1 });
        persona("s7-t", t, { x: 950, y: 1700, s: 0.64, mira: -1, vivo: true, charla: e, boca: habla(t, e, "sonrisa"), brazo: [[0, "abajo"], [c["c7-19"] - 0.2, "senala"], [c["c7-2007"], "hombros"]], espejo: true, fase: 2 });
        vaho("s7-hv", t, 130, 1408, false, 1);
        vaho("s7-ht", t, 950, 1417, t >= e.b && t <= e.f, -1);
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c7-26"], e.c["c7-2007"]]); } },

    // 8 · El giro. La vecina: «Pues explícame por qué en mi bloque hay cada vez más vecinos pasando frío.»
    //     La cámara se acerca a la ventana: en el bloque de enfrente, vecinos con manta y gorro.
    { n: 8, set: "vacio",
      svg: `${gente("s8", "vt")}`,
      tarjeta: cita(8, "La vecina", `«Cada vez más vecinos pasando <mark id="m8">frío</mark>»`),
      fn: function (t, e) {
        const c = e.c;
        ambiente("salonInvierno", null, t, 0);
        vidaFondo("si", t, { capa: "salonInvierno", lamparas: 1, balanceo: 1.5 });
        nieva("si-n", 26, t, 340, 520, 400, 380);
        pinta("si-led", "#46B05A");
        [1, 4, 6, 9, 11].forEach((i, j) => css(`si-vp${i}`, "opacity", clamp((t - c["c8-vecinos"] + 0.2 - j * 0.18) / 0.25)));
        marca("m8", t, c["c8-frio"]);
        persona("s8-v", t, { x: 300, y: 1440, s: 0.8, mira: 1, vivo: true, charla: e, boca: habla(t, e, "seria"), brazo: [[0, "abajo"], [c["c8-bloque"] - 0.3, "senala"], [c["c8-frio"] + 0.2, "hombros"]], fase: 1 });
        persona("s8-t", t, { x: 800, y: 1440, s: 0.78, mira: -1, vivo: true, boca: [[0, "sonrisa"], [c["c8-frio"], "seria"]], brazo: [[0, "abajo"]], espejo: true, fase: 2 });
        vaho("s8-hv", t, 300, 1086, t >= e.b && t <= e.f, 1);
        vaho("s8-ht", t, 800, 1095, false, -1);
      },
      cam: function (t, e) {
        const k = suave(clamp((t - e.c["c8-bloque"] + 0.3) / 1.0));
        return { z: 1 + 0.55 * k, fx: 540, fy: 1150 - 430 * k, sy: 1150 - 330 * k };
      } },

    // 9 · La gente que pasa frío (INE, ECV). El técnico: «Ahí sí tiene razón. Hoy casi 16 de cada 100 personas no pueden tener la casa caliente… el doble que en la crisis.»
    { n: 9, set: "vacio",
      svg: `<g transform="translate(345 1080)">${cienPersonas("s9-a", "2013 · plena crisis", { paso: 33, tam: 32 })}</g>
        <g transform="translate(735 1080)">${cienPersonas("s9-b", "Hoy", { paso: 33, tam: 40 })}</g>${gente("s9", "vt")}`,
      tarjeta: grande(9, "No pueden tener la casa caliente", pct(D.F["2025"].no_puede_calentar_pct), `de la gente: casi ${D.millones} millones`,
        `En 2007 y en plena crisis (2013), el ${Math.round(D.F["2013"].no_puede_calentar_pct)}&nbsp;%; en 2019, el ${pct(D.F["2019"].no_puede_calentar_pct)}`, F_ECV),
      fn: function (t, e) {
        const c = e.c;
        ambiente("salonInvierno", null, t, 0);
        vidaFondo("si", t, { capa: "salonInvierno", lamparas: 1, balanceo: 1.5 });
        nieva("si-n", 26, t, 340, 520, 400, 380);
        pinta("si-led", "#46B05A");
        for (const i of [1, 4, 6, 9, 11]) css(`si-vp${i}`, "opacity", 1);
        const O = D.orden;
        for (let j = 0; j < 100; j++) {
          pinta(`s9-b-p${O[j]}`, j < D.frioHoy && t >= c["c9-16"] - 0.2 + j * 0.06 ? D.azul : "#DADFE3");
          pinta(`s9-a-p${O[j]}`, j < D.frioCrisis && t >= c["c9-doble"] - 0.2 + j * 0.06 ? D.azul : "#DADFE3");
        }
        sube("c9-a", t, c["c9-16"]); sube("c9-b", t, c["c9-16"] + 0.4);
        persona("s9-v", t, { x: 130, y: 1700, s: 0.66, mira: 1, vivo: true, boca: [[0, "seria"], [c["c9-doble"] + 0.2, "o"]], ojos: [[0, "normal"], [c["c9-doble"] + 0.2, "grandes"]], brazo: [[0, "abajo"]], fase: 1 });
        persona("s9-t", t, { x: 950, y: 1700, s: 0.64, mira: -1, vivo: true, charla: e, boca: habla(t, e, "seria"), brazo: [[0, "abajo"], [c["c9-16"] - 0.2, "senala"], [c["c9-doble"], "hombros"]], espejo: true, fase: 2 });
        vaho("s9-hv", t, 130, 1408, false, 1);
        vaho("s9-ht", t, 950, 1417, t >= e.b && t <= e.f, -1);
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c9-16"], e.c["c9-doble"]]); } },

    // 10 · La renta media (INE, ECV, por deciles). El técnico: «Y en los hogares de renta media el triple que en 2019.»
    { n: 10, set: "vacio",
      svg: `<g transform="translate(540 1250)">${decilesFrio("s10-d", D.dec19, D.decHoy, [pct(D.dec19[4]), pct(D.decHoy[4])])}</g>${gente("s10", "vt")}`,
      tarjeta: vs(10, "Renta media: no pueden tener la casa caliente", [pct(D.dec19[4]), pct(D.decHoy[4])], ["2019", "hoy"],
        "Personas del decil de renta del medio (el quinto): el triple", F_ECV),
      fn: function (t, e) {
        const c = e.c;
        ambiente("salonInvierno", null, t, 0);
        vidaFondo("si", t, { capa: "salonInvierno", lamparas: 1, balanceo: 1.5 });
        nieva("si-n", 26, t, 340, 520, 400, 380);
        pinta("si-led", "#46B05A");
        for (const i of [1, 4, 6, 9, 11]) css(`si-vp${i}`, "opacity", 1);
        pop("s10-d", t, e.t0 + 0.05, 0, 0, { s: 1 });
        const k = suave(clamp((t - c["c10-triple"] + 0.1) / 0.8));
        for (let i = 0; i < 10; i++) {
          const el = $(`s10-d-d${i}`);
          if (!el) continue;
          const a = +el.dataset.a, b = +el.dataset.b, hh = a + (b - a) * k;
          el.setAttribute("y", (-hh).toFixed(1)); el.setAttribute("height", hh.toFixed(1));
        }
        css("s10-d-va", "opacity", 1 - clamp(k * 2));
        css("s10-d-vb", "opacity", clamp((k - 0.8) * 5));
        sube("c10-a", t, c["c10-renta"]); sube("c10-b", t, c["c10-triple"]);
        persona("s10-v", t, { x: 130, y: 1700, s: 0.66, mira: 1, vivo: true, boca: [[0, "seria"], [c["c10-triple"] + 0.2, "o"]], ojos: [[0, "normal"], [c["c10-triple"] + 0.2, "grandes"]], brazo: [[0, "abajo"]], fase: 1 });
        persona("s10-t", t, { x: 950, y: 1700, s: 0.64, mira: -1, vivo: true, charla: e, boca: habla(t, e, "seria"), brazo: [[0, "abajo"], [c["c10-renta"] - 0.2, "senala"], [c["c10-triple"], "hombros"]], espejo: true, fase: 2 });
        vaho("s10-hv", t, 130, 1408, false, 1);
        vaho("s10-ht", t, 950, 1417, t >= e.b && t <= e.f, -1);
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c10-triple"]]); } },

    // 11 · Veredicto y pregunta. La vecina: «O sea que la factura cuesta menos horas pero hay el doble de gente pasando frío. ¿Y tú enciendes la calefacción o tiras de manta?»
    { n: 11, set: "vacio",
      svg: `${gente("s11", "vt")}`,
      tarjeta: tarjeta(11, "Te toca", `<div class="tit" style="font-size:60px">¿Enciendes la calefacción o tiras de <mark id="m11">manta</mark>?</div><div class="sub" id="c11-sub">Te leo en los comentarios.</div>`),
      fn: function (t, e) {
        const c = e.c;
        ambiente("salonInvierno", null, t, 0);
        vidaFondo("si", t, { capa: "salonInvierno", lamparas: 1, balanceo: 1.5 });
        nieva("si-n", 26, t, 340, 520, 400, 380);
        pinta("si-led", "#46B05A");
        for (const i of [1, 4, 6, 9, 11]) css(`si-vp${i}`, "opacity", 1);
        marca("m11", t, c["c11-manta"] + 0.2);
        sube("c11-sub", t, c["c11-manta"] + 0.7);
        persona("s11-v", t, { x: 330, y: 1440, s: 0.8, mira: [[0, 1], [c["c11-doble"] + 0.4, 0]], vivo: true, charla: e, boca: habla(t, e, "sonrisa"), brazo: [[0, "abajo"], [c["c11-menos"], "hombros"], [c["c11-manta"] - 0.6, "senala"]], fase: 1 });
        persona("s11-t", t, { x: 820, y: 1440, s: 0.78, mira: -1, vivo: true, boca: [[0, "seria"], [c["c11-manta"], "sonrisa"]], brazo: [[0, "abajo"], [c["c11-doble"], "hombros"]], espejo: true, fase: 2 });
        vaho("s11-hv", t, 330, 1086, t >= e.b && t <= e.f, 1);
        vaho("s11-ht", t, 820, 1095, false, -1);
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c11-doble"], e.c["c11-manta"]]); } },
  ];
}
