// Escenas de T4 (padre contra hijo, 2.ª parte) en estilo «limpio». La misma cocina y los mismos dos
// personajes de T3: el padre a la izquierda y el hijo a la derecha; entre ellos, el dato de cada frase.
// Cada escena: decorado, dibujo (svg), tarjeta (HTML) y acción (fn, se ejecuta en la página con
// diseno/limpio_runtime.js). Los momentos e.c[...] salen de historia.json.
/* eslint-disable no-undef */

import { C, persona, bocadillo, tarjeta, nomina } from "../../diseno/limpio.mjs";
import { bandera } from "../../diseno/barrio.mjs";
import { cocina, icono, banco, boton, quesito, casita, barraEdad, reglaEdad, cuna, cocido } from "../../diseno/casa.mjs";

export const ESTILO = "limpio";
const F_EPF = "INE, Encuesta de Presupuestos Familiares (gasto por hogar). Cálculo propio";
const F_BDE = "Dato oficial: Banco de España (préstamos para vivienda)";
const F_EES = "INE, microdatos de la Encuesta de Estructura Salarial 2006 y 2022. Cálculo propio";
const F_EUR = "Dato oficial: Eurostat (2025)";
const F_INE = "Dato oficial: INE (Indicadores Demográficos Básicos)";

export function datos(t4) {
  return {
    ocio06: t4.ocio_pct_gasto["2006"], ocioHoy: t4.ocio_pct_gasto["2025"], ocioReal: t4.ocio_real_2006_2025_pct,
    hip06: t4.hipotecas_mas_80_pct["2006"], hipHoy: t4.hipotecas_mas_80_pct["2026"],
    moda: t4.sueldo_mas_frecuente["2022"], modaReal: t4.sueldo_mas_frecuente.real_2006_2022_pct,
    emaES: t4.edad_emancipacion.ES_2025, emaUE: t4.edad_emancipacion.UE_2025,
    hijo86: t4.edad_primer_hijo["1986"], hijoHoy: t4.edad_primer_hijo["2024"],
    L: 2 * Math.PI * 70,
  };
}

// ------------------------------------------------------------------ personajes (los de T3)
const PADRE = { pelo: "corto", canas: true, barba: false, bigote: true, colorPelo: "#6F6A62", colorBigote: "#5E5952", ropa: ["#8C6F5A", "#6E5444"], piel: "#EDBE96" };
const HIJO = { pelo: "corto", canas: false, barba: false, colorPelo: "#3B2A20", ropa: ["#6F8FA6", "#56738A"], piel: "#F1C9A5" };
const pareja = (p) => `${cocina(p + "-k")}${persona(p + "-padre", "hoy", PADRE)}${persona(p + "-hijo", "hoy", HIJO)}`;

// Regla de edades del plano 12: de 20 a 35 años en 600 px, centrada en x = 540.
const R0 = 20, R1 = 35, RW = 600;

export function escenas(D) {
  const es = (v, d = 1) => v.toFixed(d).replace(".", ",");
  const pct = (v) => Math.round(v) + " %";
  const miles = (v) => (Math.round(v / 100) * 100).toLocaleString("es-ES");
  const fila = (p, n, y) => Array.from({ length: n }, (_, i) => casita(`${p}${i}`, i === 0 ? C.rojo : null, 0.72)).join("");
  return [
    // 1 · Padre: «Vale, la casa está cara. ¡Pero es que os lo fundís todo! Netflix, Disney, Glovo, el gimnasio, festivales…»
    { n: 1, set: "vacio",
      svg: `${pareja("s1")}${["tele", "reparto", "pesa", "musica"].map((k, i) => icono("s1-i" + i, k, 1.05)).join("")}`,
      tarjeta: tarjeta(1, "Padre contra hijo · Segunda parte", `<div class="tit" style="font-size:64px">¿De verdad os lo gastáis todo en <mark id="m1">Netflix</mark>?</div>`, { icono: bandera(44) }),
      fn: function (t, e) {
        const c = e.c, cues = [c["c1-netflix"], c["c1-glovo"], c["c1-gim"], c["c1-fest"]];
        const P = [[600, 880], [780, 790], [960, 860], [440, 790]];
        for (let i = 0; i < 4; i++) {
          const k = pop("s1-i" + i, t, cues[i], P[i][0], P[i][1] + Math.sin(t * 3 + i) * 6, { s: 1.05 });
          if (k >= 0 && t > c["c1-ahorre"]) T("s1-i" + i, P[i][0] + Math.sin(t * 22 + i) * 5, P[i][1], { s: 1.05 });
        }
        marca("m1", t, c["c1-netflix"]);
        persona("s1-padre", t, { x: 210, y: 1440, s: 0.78, brazo: [[0, "abajo"], [e.b + 0.4, "hombros"], [c["c1-netflix"], "senala"], [c["c1-ahorre"], "arriba"]], mira: 1,
          boca: habla(t, e, "seria"), incl: [[0, 0], [c["c1-ahorre"], -4]], fase: 1 });
        persona("s1-hijo", t, { x: 870, y: 1440, s: 0.78, mira: [[0, -1]], ojos: [[0, "normal"], [c["c1-gim"], "grandes"]], boca: [[0, "seria"], [c["c1-ahorre"], "o"]], espejo: true, fase: 2 });
      } },

    // 2 · Hijo: «¿Seguro? Hoy las familias gastan en ocio, bares, hoteles y teléfono el 22 %… En 2006, el 24 %. Y quitando la inflación, un 30 % menos.»
    { n: 2, set: "vacio",
      svg: `${pareja("s2")}${quesito("s2-a", 430, 1010, 70, 40, C.ocre, "2006")}${quesito("s2-b", 650, 1010, 70, 40, C.azul, "HOY")}
        <g id="s2-baja"><path d="M0 -60 V40 M-34 8 L0 44 L34 8" fill="none" stroke="${C.rojo}" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/></g>`,
      tarjeta: tarjeta(2, "Ocio, bares, hoteles y teléfono", `<div class="vs"><div class="col" id="c2-a"><div class="v t-pasado">${pct(D.ocio06)}</div><div class="n">en 2006</div></div>
        <div class="col" id="c2-b"><div class="v t-hoy">${pct(D.ocioHoy)}</div><div class="n">hoy</div></div></div>
        <div class="sub" id="c2-real" style="margin-top:10px">del gasto de las familias · descontada la inflación, <mark id="m2">−${Math.abs(Math.round(D.ocioReal))} %</mark> por hogar</div>`, { fuente: F_EPF }),
      fn: function (t, e) {
        const c = e.c;
        const vb = D.ocioHoy * suave((t - c["c2-hoy"]) / 0.6), va = D.ocio06 * suave((t - c["c2-2006"]) / 0.6);
        attr("s2-a-arco", "stroke-dasharray", (D.L * va / 100).toFixed(1) + " " + D.L.toFixed(1)); txt("s2-a-num", t < c["c2-2006"] ? "" : Math.round(va) + " %");
        attr("s2-b-arco", "stroke-dasharray", (D.L * vb / 100).toFixed(1) + " " + D.L.toFixed(1)); txt("s2-b-num", t < c["c2-hoy"] ? "" : Math.round(vb) + " %");
        css("s2-a", "opacity", t < c["c2-2006"] - 0.2 ? "0.25" : "1"); css("s2-b", "opacity", t < c["c2-hoy"] - 0.2 ? "0.25" : "1");
        sube("c2-b", t, c["c2-hoy"]); sube("c2-a", t, c["c2-2006"]); sube("c2-real", t, c["c2-30"] - 0.3);
        pop("s2-baja", t, c["c2-30"], 750, 900 + 10 * Math.sin(t * 4), { s: 0.8 });
        marca("m2", t, c["c2-30"] + 0.1);
        persona("s2-padre", t, { x: 210, y: 1440, s: 0.78, mira: 1, boca: [[0, "seria"], [c["c2-30"], "o"]], ojos: [[0, "normal"], [c["c2-30"], "grandes"]], fase: 1 });
        persona("s2-hijo", t, { x: 870, y: 1440, s: 0.78, mira: -1, boca: habla(t, e), brazo: [[0, "abajo"], [c["c2-hoy"], "senala"], [c["c2-30"] + 0.6, "hombros"]], espejo: true, fase: 2 });
      } },

    // 5 · Padre: «Pues pedid la hipoteca, que el banco os la da.»
    { n: 5, set: "vacio",
      svg: `${pareja("s5")}${banco("s5-banco", "")}`,
      tarjeta: tarjeta(5, "Padre", `<div class="tit">«Que el <mark id="m5">banco</mark> os la da»</div>`, { tono: "pasado" }),
      fn: function (t, e) {
        const c = e.c;
        pop("s5-banco", t, c["c5-banco"], 540, 880, { s: 1.0 });
        marca("m5", t, c["c5-banco"]);
        persona("s5-padre", t, { x: 210, y: 1440, s: 0.78, mira: 1, boca: habla(t, e, "sonrisa"), brazo: [[0, "abajo"], [c["c5-banco"] - 0.1, "senala"]], fase: 1 });
        persona("s5-hijo", t, { x: 870, y: 1440, s: 0.78, mira: -1, boca: "seria", ojos: [[0, "normal"], [c["c5-banco"] + 0.3, "grandes"]], espejo: true, fase: 2 });
      } },

    // 6 · Hijo: «En 2006, una de cada seis hipotecas pasaba del 80 % del valor del piso. Hoy, una de cada diez…»
    { n: 6, set: "vacio",
      svg: `${pareja("s6")}<g id="s6-f1">${fila("s6-a", 6)}</g><g id="s6-f2">${fila("s6-b", 10)}</g>
        <text id="s6-l1" x="0" y="0" font-family="Cap" font-weight="800" font-size="38" fill="#8A6316">2006</text>
        <text id="s6-l2" x="0" y="0" font-family="Cap" font-weight="800" font-size="38" fill="${C.azul}">HOY</text>`,
      tarjeta: tarjeta(6, "Hipotecas de más del 80 % del valor", `<div class="vs"><div class="col" id="c6-a"><div class="v t-pasado" style="font-size:66px">1 de cada 6</div><div class="n">en 2006 (${pct(D.hip06)})</div></div>
        <div class="col" id="c6-b"><div class="v t-hoy" style="font-size:66px">1 de cada 10</div><div class="n">hoy (${pct(D.hipHoy)})</div></div></div>`, { fuente: F_BDE }),
      fn: function (t, e) {
        const c = e.c;
        // Fila de 2006 (6 casas) y fila de hoy (10 casas); la primera de cada fila, en rojo.
        for (let i = 0; i < 6; i++) pop("s6-a" + i, t, c["c6-seis"] + i * 0.06, 300 + i * 72, 800, { s: 1 });
        for (let i = 0; i < 10; i++) pop("s6-b" + i, t, c["c6-diez"] + i * 0.05, 300 + i * 72, 930, { s: 1 });
        T("s6-l1", 150, 790, { op: t < c["c6-seis"] ? 0 : 1 }); T("s6-l2", 160, 920, { op: t < c["c6-diez"] ? 0 : 1 });
        sube("c6-a", t, c["c6-seis"]); sube("c6-b", t, c["c6-diez"]);
        persona("s6-padre", t, { x: 210, y: 1440, s: 0.78, mira: 1, boca: [[0, "seria"], [c["c6-pulmon"] + 0.5, "sonrisa"]], ojos: [[0, "normal"], [c["c6-pulmon"] + 0.5, "felices"]], fase: 1 });
        persona("s6-hijo", t, { x: 870, y: 1440, s: 0.78, mira: -1, boca: habla(t, e), brazo: [[0, "abajo"], [c["c6-seis"], "senala"], [c["c6-pulmon"], "hombros"]], espejo: true, fase: 2 });
      } },

    // 7 · Padre: «¿Y cuánto cobras tú, listo?»
    { n: 7, set: "vacio",
      svg: `${pareja("s7")}`,
      tarjeta: tarjeta(7, "Padre", `<div class="tit">«¿Y cuánto cobras tú, <mark id="m7">listo</mark>?»</div>`, { tono: "pasado" }),
      fn: function (t, e) {
        const c = e.c;
        marca("m7", t, c["c7-listo"]);
        persona("s7-padre", t, { x: 210, y: 1440, s: 0.78, mira: 1, boca: habla(t, e, "seria"), brazo: [[0, "abajo"], [e.b + 0.1, "empuja"]], incl: [[0, 3]], fase: 1 });
        persona("s7-hijo", t, { x: 870, y: 1440, s: 0.78, mira: -1, boca: "seria", espejo: true, fase: 2 });
      } },

    // 8 · Hijo: «El sueldo más común en España: unos 16.900 euros brutos al año. Quitando la inflación, un 9 % menos que en 2006.»
    { n: 8, set: "vacio",
      svg: `${pareja("s8")}${nomina("s8-nom")}<text id="s8-menos" x="0" y="0" text-anchor="middle" font-family="Cap" font-weight="800" font-size="80" fill="${C.rojo}">−${Math.abs(Math.round(D.modaReal))} %</text>`,
      tarjeta: tarjeta(8, "El sueldo más frecuente en España", `<div class="fila"><div class="num t-hoy" id="c8-num" style="font-size:132px">${miles(D.moda)} €</div><div class="uni">brutos<small>al año (2022)</small></div></div>
        <div class="sub" id="c8-real">Descontada la inflación: <mark id="m8">−${Math.abs(Math.round(D.modaReal))} %</mark> frente a 2006</div>`, { tono: "hoy", fuente: F_EES }),
      fn: function (t, e) {
        const c = e.c, k = suave((t - c["c8-9"]) / 0.7);
        pop("s8-nom", t, c["c8-nomina"], 520, 860, { s: 1.5 * (1 + D.modaReal / 100 * k) });
        if (t >= c["c8-9"]) T("s8-menos", 700, 800 + 8 * Math.sin(t * 4), { s: 0.4 + 0.6 * fuera((t - c["c8-9"]) / 0.3) }); else ver("s8-menos", false);
        sube("c8-num", t, c["c8-nomina"]); sube("c8-real", t, c["c8-9"] - 0.2); marca("m8", t, c["c8-9"] + 0.2);
        persona("s8-padre", t, { x: 210, y: 1440, s: 0.78, mira: 1, boca: [[0, "seria"], [c["c8-9"], "o"]], ojos: [[0, "normal"], [c["c8-9"], "grandes"]], fase: 1 });
        persona("s8-hijo", t, { x: 870, y: 1440, s: 0.78, mira: -1, boca: habla(t, e), brazo: [[0, "abajo"], [c["c8-nomina"], "senala"]], espejo: true, fase: 2 });
      } },

    // 9 · Padre: «¿Y por eso seguís en casa con treinta tacos?»
    { n: 9, set: "vacio",
      svg: `${pareja("s9")}${casita("s9-casa", null, 1.3)}`,
      tarjeta: tarjeta(9, "Padre", `<div class="tit">«¿Y seguís en casa con treinta <mark id="m9">tacos</mark>?»</div>`, { tono: "pasado" }),
      fn: function (t, e) {
        const c = e.c;
        pop("s9-casa", t, c["c9-tacos"], 870, 920, { s: 1 });
        marca("m9", t, c["c9-tacos"]);
        persona("s9-padre", t, { x: 210, y: 1440, s: 0.78, mira: 1, boca: habla(t, e, "sonrisa"), brazo: [[0, "abajo"], [e.b + 0.3, "senala"]], fase: 1 });
        persona("s9-hijo", t, { x: 870, y: 1440, s: 0.78, mira: -1, boca: "seria", ojos: [[0, "normal"], [c["c9-tacos"], "grandes"]], espejo: true, fase: 2 });
      } },

    // 10 · Hijo: «Con 30,2 de media. En Europa, a los 26.»
    { n: 10, set: "vacio",
      svg: `${pareja("s10")}${barraEdad("s10-es", "España", C.rojo)}${barraEdad("s10-ue", "Unión Europea", C.azul)}`,
      tarjeta: tarjeta(10, "Edad media al irse de casa", `<div class="vs"><div class="col" id="c10-a"><div class="v t-hoy">${es(D.emaES)}</div><div class="n">España</div></div>
        <div class="col" id="c10-b"><div class="v t-hoy">${es(D.emaUE)}</div><div class="n">Unión Europea</div></div></div>`, { tono: "hoy", fuente: F_EUR, icono: bandera(44) }),
      fn: function (t, e) {
        const c = e.c, ancho = (edad) => 460 * edad / 35;
        T("s10-es", 330, 800); T("s10-ue", 330, 960);
        const wa = ancho(D.emaES) * suave((t - c["c10-es"]) / 0.7), wb = ancho(D.emaUE) * suave((t - c["c10-ue"]) / 0.6);
        attr("s10-es-b", "width", wa.toFixed(1)); attr("s10-ue-b", "width", wb.toFixed(1));
        txt("s10-es-n", t < c["c10-es"] + 0.5 ? "" : es(D.emaES)); attr("s10-es-n", "x", (wa - 100).toFixed(1));
        txt("s10-ue-n", t < c["c10-ue"] + 0.4 ? "" : es(D.emaUE)); attr("s10-ue-n", "x", (wb - 100).toFixed(1));
        sube("c10-a", t, c["c10-es"]); sube("c10-b", t, c["c10-ue"]);
        persona("s10-padre", t, { x: 210, y: 1440, s: 0.78, mira: 1, boca: [[0, "seria"], [c["c10-ue"] + 0.3, "o"]], ojos: [[0, "normal"], [c["c10-ue"] + 0.3, "grandes"]], fase: 1 });
        persona("s10-hijo", t, { x: 870, y: 1440, s: 0.78, mira: -1, boca: habla(t, e), brazo: [[0, "abajo"], [c["c10-es"], "senala"]], espejo: true, fase: 2 });
      } },

    // 11 · Padre: «¿Y los nietos pa cuándo, eh?»
    { n: 11, set: "vacio",
      svg: `${pareja("s11")}${cuna("s11-cuna", C.azulClaro, false)}`,
      tarjeta: tarjeta(11, "Padre", `<div class="tit">«¿Y los <mark id="m11">nietos</mark> pa cuándo?»</div>`, { tono: "pasado" }),
      fn: function (t, e) {
        const c = e.c;
        if (pop("s11-cuna", t, c["c11-nietos"], 540, 900, { s: 1.4 }) >= 0 && t > c["c11-nietos"] + 0.32) T("s11-cuna", 540, 900, { s: 1.4, r: 6 * Math.sin((t - c["c11-nietos"]) * 4) });
        marca("m11", t, c["c11-nietos"]);
        persona("s11-padre", t, { x: 210, y: 1440, s: 0.78, mira: 1, boca: habla(t, e, "sonrisa"), brazo: [[0, "abajo"], [e.b + 0.2, "sujeta"]], ojos: [[0, "felices"]], incl: [[0, -5]], fase: 1 });
        persona("s11-hijo", t, { x: 870, y: 1440, s: 0.78, mira: -1, boca: "seria", ojos: [[0, "normal"], [c["c11-nietos"] + 0.2, "grandes"]], espejo: true, fase: 2 });
      } },

    // 12 · Hijo: «¿Nietos? En 1986, el primer hijo llegaba a los 26 años. Hoy, a los treinta y uno y medio. ¿Casualidad?»
    { n: 12, set: "vacio",
      svg: `${pareja("s12")}${reglaEdad("s12-regla", R0, R1, RW)}${cuna("s12-cuna", C.azulClaro)}
        <g id="s12-p86"><circle r="12" fill="#8A6316"/><text y="-28" text-anchor="middle" font-family="Cap" font-weight="800" font-size="34" fill="#8A6316">1986</text></g>`,
      tarjeta: tarjeta(12, "Edad media al tener el primer hijo", `<div class="vs"><div class="col" id="c12-a"><div class="v t-pasado">${Math.round(D.hijo86)} años</div><div class="n">en 1986</div></div>
        <div class="col" id="c12-b"><div class="v t-hoy">${es(D.hijoHoy)} años</div><div class="n">hoy (2024)</div></div></div>`, { fuente: F_INE }),
      fn: function (t, e) {
        const c = e.c, RX = (edad) => 240 + (edad - 20) * 40;   // la misma escala que reglaEdad(20, 35, 600)
        pop("s12-regla", t, c["c12-86"], 540, 820, { s: 1 });
        const x = RX(D.hijo86) + (RX(D.hijoHoy) - RX(D.hijo86)) * suave((t - c["c12-hoy"]) / 1.0);
        pop("s12-cuna", t, c["c12-26"], x, 750, { s: 1.15 });
        if (t >= c["c12-hoy"]) T("s12-p86", RX(D.hijo86), 808, { op: 1 }); else ver("s12-p86", false);
        sube("c12-a", t, c["c12-26"]); sube("c12-b", t, c["c12-hoy"] + 0.4);
        persona("s12-padre", t, { x: 210, y: 1440, s: 0.78, mira: 1, boca: [[0, "sonrisa"], [c["c12-hoy"], "seria"], [c["c12-cas"], "o"]], ojos: [[0, "felices"], [c["c12-hoy"], "normal"], [c["c12-cas"], "grandes"]], fase: 1 });
        persona("s12-hijo", t, { x: 870, y: 1440, s: 0.78, mira: [[0, -1], [c["c12-cas"], 0]], boca: habla(t, e), brazo: [[0, "abajo"], [c["c12-26"], "senala"], [c["c12-cas"], "hombros"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { const k = t - e.c["c12-cas"] - 0.05, g = k >= 0 && k < 0.18; return { dx: 0, dy: g ? azar(7, Math.floor(t * 30)) * 8 : 0 }; } },

    // 13 · Padre: «Pues aquí estás muy bien, majo. Y comes caliente.»
    { n: 13, set: "vacio",
      svg: `${pareja("s13")}${cocido("s13-plato")}`,
      tarjeta: tarjeta(13, "Padre", `<div class="tit">«Aquí estás muy bien, <mark id="m13">majo</mark>»</div>`, { tono: "pasado" }),
      fn: function (t, e) {
        const c = e.c;
        if (pop("s13-plato", t, c["c13-comes"], 560, 960, { s: 1.3 }) >= 0) {
          for (let k = 0; k < 3; k++) {
            const f = ((t * 0.8 + k / 3) % 1);
            attr("s13-plato-v" + k, "cx", (Math.sin((t + k) * 3) * 10 + (k - 1) * 22).toFixed(1)); attr("s13-plato-v" + k, "cy", (-30 - f * 110).toFixed(1));
            attr("s13-plato-v" + k, "r", (8 + f * 16).toFixed(1)); css("s13-plato-v" + k, "opacity", (0.85 * (1 - f)).toFixed(2));
          }
        }
        marca("m13", t, e.b + 1.0);
        persona("s13-padre", t, { x: 210, y: 1440, s: 0.78, mira: 1, boca: habla(t, e, "sonrisa"), brazo: [[0, "abajo"], [c["c13-comes"] - 0.2, "empuja"]], ojos: [[0, "felices"]], fase: 1 });
        persona("s13-hijo", t, { x: 870, y: 1440, s: 0.78, mira: [[0, -1], [c["c13-comes"] + 0.3, 0]], boca: [[0, "seria"], [c["c13-comes"] + 0.4, "sonrisa"]], espejo: true, fase: 2 });
      } },

    // 14 · Hijo, a cámara: «¿Quién tiene razón? ¿Tú qué opinas?»
    { n: 14, set: "vacio",
      svg: `${pareja("s14")}${boton("s14-bp", "PADRE", "#8C6F5A")}${boton("s14-bh", "HIJO", "#56738A")}${bocadillo("s14-boc")}`,
      tarjeta: tarjeta(14, "Te toca", `<div class="tit">¿Quién tiene <mark id="m14">razón</mark>: el padre o el hijo?</div><div class="sub" id="c14-sub">¿Tú qué opinas? Te leo en los comentarios.</div>`),
      fn: function (t, e) {
        const c = e.c;
        pop("s14-bp", t, c["c14-botones"], 220, 900); pop("s14-bh", t, c["c14-botones"] + 0.15, 860, 900);
        if (pop("s14-boc", t, c["c14-boc"], 540, 700, { s: 1.0 }) >= 0) for (let i = 0; i < 3; i++) attr("s14-boc-p" + i, "cy", (-6 - 16 * Math.max(0, Math.sin((t - c["c14-boc"]) * 8 - i * 0.9))).toFixed(1));
        marca("m14", t, c["c14-botones"] + 0.3); sube("c14-sub", t, c["c14-boc"] - 0.2);
        persona("s14-padre", t, { x: 210, y: 1440, s: 0.78, mira: 0, boca: "sonrisa", brazo: [[0, "abajo"], [c["c14-botones"], "arriba"]], fase: 1 });
        persona("s14-hijo", t, { x: 870, y: 1440, s: 0.78, mira: 0, boca: habla(t, e), brazo: [[0, "abajo"], [c["c14-botones"] + 0.15, "arriba"]], espejo: true, fase: 2 });
      } },
  ];
}
