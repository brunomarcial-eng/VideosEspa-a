// Escenas de T3 (padre contra hijo) en estilo «limpio». Los dos discuten en la cocina: el padre a la
// izquierda y el hijo a la derecha; entre ellos aparece el dato de cada frase. Quien habla mueve la boca.
// Cada escena: decorado, dibujo (svg), tarjeta (HTML) y acción (fn, se ejecuta en la página con
// diseno/limpio_runtime.js). Los momentos e.c[...] salen de historia.json.
/* eslint-disable no-undef */

import { C, persona, bocadillo, tarjeta } from "../../diseno/limpio.mjs";
import { bandera } from "../../diseno/barrio.mjs";
import { cocina, icono, foto, billete, banco, ladrillo, tique, boton, quesito } from "../../diseno/casa.mjs";

export const ESTILO = "limpio";
const F_86 = "Banco de España (m² de 1986, sociedades de tasación) e INE (sueldo de 1986, anuarios). Cálculo propio";
const F_HOY = "Banco de España y Ministerio de Vivienda (m², 2026) e INE (sueldo medio, 2024). Cálculo propio";
const F_C = "Cálculo propio con datos del INE (IPC y salarios) y del Banco de España";
const F_BDE = "Dato oficial: Banco de España";

export function datos(t3) {
  const p = t3.padre_hijo, h = t3.hace_40_anos;
  return {
    pts86: h.piso_90m2_1986_pts / 1e6, anos86: p.anos_sueldo_medio_1986, piso: p.piso_hoy_eur, anosHoy: p.anos_sueldo_medio_hoy,
    anos06: p.anos_sueldo_medio_2006, sueldoReal: p.sueldo_medio_real_1986_2024_pct, pisoReal: p.piso_real_veces_1986_hoy,
    tipo89: p.tipo_hipoteca_1989_media_pct, esf87: p.esfuerzo_1987_pct, esfHoy: p.esfuerzo_hoy_pct,
    L: 2 * Math.PI * 92,
  };
}

// ------------------------------------------------------------------ personajes
const PADRE = { pelo: "corto", canas: true, barba: false, bigote: true, colorPelo: "#6F6A62", colorBigote: "#5E5952", ropa: ["#8C6F5A", "#6E5444"], piel: "#EDBE96" };
const HIJO = { pelo: "corto", canas: false, barba: false, colorPelo: "#3B2A20", ropa: ["#6F8FA6", "#56738A"], piel: "#F1C9A5" };
const PX = 200, HX = 880, PY = 1440, S = 0.62;   // sitio fijo de cada uno
const pareja = (p) => `${cocina(p + "-k")}${persona(p + "-padre", "hoy", PADRE)}${persona(p + "-hijo", "hoy", HIJO)}`;

export function escenas(D) {
  const es = (v, d = 1) => v.toFixed(d).replace(".", ",");
  const miles = (v) => Math.round(v / 1000).toLocaleString("es-ES") + ".000";
  // Lo que se repite en cada escena: los dos en su sitio; quien habla mueve la boca.
  // (Se escribe dentro de cada fn porque las funciones se ejecutan en la página.)
  return [
    // 1 · Padre: «¡Es que no ahorráis un duro! Tanto viajecito, cañas todos los findes, que si Netflix…»
    { n: 1, set: "vacio",
      svg: `${pareja("s1")}${["avion", "cana", "tele", "coche"].map((k, i) => icono("s1-i" + i, k, 1.1)).join("")}${icono("s1-plato", "plato", 1.1)}`,
      tarjeta: tarjeta(1, "Padre contra hijo", `<div class="tit" style="font-size:62px">¿Quién lo tuvo más difícil para comprar <mark id="m1">casa</mark>?</div>`, { icono: bandera(44) }),
      fn: function (t, e) {
        const c = e.c, cues = [c["c1-viaje"], c["c1-cana"], c["c1-netflix"], c["c1-uber"]];
        const P = [[640, 760], [800, 680], [960, 760], [1000, 900]];
        for (let i = 0; i < 4; i++) {
          const k = pop("s1-i" + i, t, cues[i], P[i][0], P[i][1] + Math.sin(t * 3 + i) * 6, { s: 1.1 });
          if (k >= 0 && t > c["c1-jarana"]) T("s1-i" + i, P[i][0] + Math.sin(t * 22 + i) * 5, P[i][1], { s: 1.1 });
        }
        if (pop("s1-plato", t, c["c1-mes"], 360, 760, { s: 1.1 }) >= 0) css("s1-plato", "opacity", (1 - clamp((t - c["c1-jarana"]) / 0.4)).toFixed(2));
        persona("s1-padre", t, { x: 210, y: 1440, s: 0.78, brazo: [[0, "senala"], [c["c1-mes"], "arriba"], [c["c1-jarana"], "senala"]], mira: 1, ojos: "normal",
          boca: habla(t, e, "seria"), incl: [[0, 0], [c["c1-jarana"], -4]], fase: 1 });
        persona("s1-hijo", t, { x: 870, y: 1440, s: 0.78, mira: [[0, 0], [c["c1-viaje"], -1]], ojos: [[0, "normal"], [c["c1-jarana"], "grandes"]], boca: [[0, "sonrisa"], [c["c1-jarana"], "o"]], fase: 2 });
        marca("m1", t, e.b + 0.6);
      } },

    // 2 · Hijo: «Pero papá, ¿qué me estás contando? En 1986, un piso de 90 metros costaba…»
    { n: 2, set: "vacio",
      svg: `${pareja("s2")}${foto("s2-f", true, "1986")}`,
      tarjeta: tarjeta(2, "1986 · Piso de 90 m²", `<div class="fila"><div class="num t-pasado" id="c2-num" style="min-width:250px">${es(D.pts86)}</div><div class="uni">millones de pesetas<small id="c2-anos" style="display:inline-block">= <b class="t-pasado">${es(D.anos86)} años</b> de sueldo medio</small></div></div>`,
        { tono: "pasado", fuente: F_86 }),
      fn: function (t, e) {
        const c = e.c, k = (t - c["c2-foto"]) / 0.5;
        T("s2-f", 540, 880 - 240 * (1 - fuera(k)), { s: 1.05, r: -4 + 8 * (1 - fuera(k)), op: clamp(k * 3) });
        sube("c2-num", t, c["c2-pts"]); sube("c2-anos", t, c["c2-anos"]);
        persona("s2-padre", t, { x: 210, y: 1440, s: 0.78, mira: 1, boca: "seria", brazo: "abajo", fase: 1 });
        persona("s2-hijo", t, { x: 870, y: 1440, s: 0.78, mira: -1, boca: habla(t, e), brazo: [[0, "abajo"], [c["c2-foto"], "senala"]], espejo: true, fase: 2 });
      } },

    // 3 · Padre: «¡Y me lo pagué a pulmón, chaval!»
    { n: 3, set: "vacio",
      svg: `${pareja("s3")}<g transform="translate(540 880) rotate(-4) scale(1.05)">${foto("s3-f", true, "1986")}</g>`,
      tarjeta: tarjeta(3, "Padre", `<div class="tit">«¡A pulmón, chaval!»</div>`, { tono: "pasado" }),
      fn: function (t, e) {
        persona("s3-padre", t, { x: 210, y: 1440, s: 0.78, mira: 1, boca: habla(t, e, "sonrisa"), brazo: [[0, "abajo"], [e.b + 0.2, "arriba"]], ojos: [[0, "normal"], [e.f, "felices"]], incl: [[0, -5]], fase: 1 });
        persona("s3-hijo", t, { x: 870, y: 1440, s: 0.78, mira: -1, boca: "seria", espejo: true, fase: 2 });
      } },

    // 4 · Hijo: «Ya. Pues hoy ese piso cuesta 210.000 pavos. Siete años de sueldo. El doble.»
    { n: 4, set: "vacio",
      svg: `${pareja("s4")}<g transform="translate(440 890) rotate(-6) scale(.82)">${foto("s4-v", true, "1986")}</g>${foto("s4-f", false, "HOY")}`,
      tarjeta: tarjeta(4, "Hoy · el mismo piso", `<div class="fila"><div class="num t-hoy" id="c4-num" style="min-width:470px">${miles(D.piso)} €</div></div>
        <div class="sub" id="c4-anos" style="margin-top:4px">= <b class="t-hoy">${es(D.anosHoy)} años</b> de sueldo medio · en 1986, ${es(D.anos86)}</div><div class="nota">En 2006, en plena burbuja: ${es(D.anos06)} años</div>`, { tono: "hoy", fuente: F_HOY }),
      fn: function (t, e) {
        const c = e.c, k = (t - c["c4-foto"]) / 0.5;
        T("s4-f", 650, 870 - 240 * (1 - fuera(k)), { s: 0.86, r: 4 - 8 * (1 - fuera(k)), op: clamp(k * 3) });
        sube("c4-num", t, c["c4-precio"]);
        sube("c4-anos", t, c["c4-anos"]);
        persona("s4-padre", t, { x: 210, y: 1440, s: 0.78, mira: 1, boca: [[0, "seria"], [c["c4-doble"], "o"]], ojos: [[0, "normal"], [c["c4-doble"], "grandes"]], fase: 1 });
        persona("s4-hijo", t, { x: 870, y: 1440, s: 0.78, mira: -1, boca: habla(t, e), brazo: [[0, "abajo"], [c["c4-precio"], "senala"]], espejo: true, fase: 2 });
      } },

    // 5 · Padre: «Venga, hombre, que ahora cobráis un pastón.»
    { n: 5, set: "vacio",
      svg: `${pareja("s5")}${[0, 1, 2].map((i) => billete("s5-b" + i)).join("")}`,
      tarjeta: tarjeta(5, "Padre", `<div class="tit">«Ahora cobráis un <mark id="m5">pastón</mark>»</div>`, { tono: "pasado" }),
      fn: function (t, e) {
        const c = e.c;
        for (let i = 0; i < 3; i++) pop("s5-b" + i, t, c["c5-paston"] + i * 0.12, 660 + i * 110, 820 - i * 60, { r: -10 + i * 12 });
        marca("m5", t, c["c5-paston"]);
        persona("s5-padre", t, { x: 210, y: 1440, s: 0.78, mira: 1, boca: habla(t, e, "sonrisa"), brazo: [[0, "abajo"], [e.b + 0.1, "empuja"]], fase: 1 });
        persona("s5-hijo", t, { x: 870, y: 1440, s: 0.78, mira: -1, boca: "seria", ojos: [[0, "normal"], [c["c5-paston"], "grandes"]], espejo: true, fase: 2 });
      } },

    // 6 · Hijo: «¿Un pastón? Quitando la inflación, el sueldo ha subido un 16 %. El piso, 2,3 veces.»
    { n: 6, set: "vacio",
      svg: `${pareja("s6")}<g id="s6-g">
        <line x1="380" x2="720" y1="1080" y2="1080" stroke="${C.tinta}" stroke-width="6"/>
        <line x1="380" x2="720" y1="${1080 - 130}" y2="${1080 - 130}" stroke="${C.gris}" stroke-width="4" stroke-dasharray="12 10"/>
        <text x="372" y="${1080 - 140}" text-anchor="end" font-family="Cap" font-weight="800" font-size="30" fill="${C.gris}">1986</text>
        <rect id="s6-s" x="410" y="1080" width="110" height="0" rx="12" fill="${C.ocre}"/><rect id="s6-p" x="580" y="1080" width="110" height="0" rx="12" fill="${C.azul}"/>
        <text x="465" y="1130" text-anchor="middle" font-family="Cap" font-weight="800" font-size="34" fill="${C.tinta}">Sueldo</text>
        <text x="635" y="1130" text-anchor="middle" font-family="Cap" font-weight="800" font-size="34" fill="${C.tinta}">Piso</text>
        <text id="s6-ts" x="465" y="0" text-anchor="middle" font-family="Cap" font-weight="800" font-size="46" fill="${C.ocre}">+${Math.round(D.sueldoReal)} %</text>
        <text id="s6-tp" x="635" y="0" text-anchor="middle" font-family="Cap" font-weight="800" font-size="46" fill="${C.azul}">×${es(D.pisoReal)}</text></g>`,
      tarjeta: tarjeta(6, "Desde 1986, descontada la inflación", `<div class="tit">Sueldo medio <mark id="m6a">+${Math.round(D.sueldoReal)} %</mark> · Piso <mark id="m6b">×${es(D.pisoReal)}</mark></div>`, { fuente: F_C }),
      fn: function (t, e) {
        const c = e.c, hs = 130 * (1 + D.sueldoReal / 100) * suave((t - c["c6-sueldo"]) / 0.6), hp = 130 * D.pisoReal * suave((t - c["c6-piso"]) / 0.8);
        attr("s6-s", "y", (1080 - hs).toFixed(1)); attr("s6-s", "height", hs.toFixed(1));
        attr("s6-p", "y", (1080 - hp).toFixed(1)); attr("s6-p", "height", hp.toFixed(1));
        attr("s6-ts", "y", (1066 - hs).toFixed(1)); css("s6-ts", "opacity", clamp((t - c["c6-sueldo"] - 0.4) / 0.3).toFixed(2));
        attr("s6-tp", "y", (1066 - hp).toFixed(1)); css("s6-tp", "opacity", clamp((t - c["c6-piso"] - 0.6) / 0.3).toFixed(2));
        marca("m6a", t, c["c6-sueldo"] + 0.4); marca("m6b", t, c["c6-veces"]);
        persona("s6-padre", t, { x: 210, y: 1440, s: 0.78, mira: 1, boca: [[0, "seria"], [c["c6-veces"], "o"]], ojos: [[0, "normal"], [c["c6-veces"], "grandes"]], fase: 1 });
        persona("s6-hijo", t, { x: 870, y: 1440, s: 0.78, mira: -1, boca: habla(t, e), brazo: [[0, "abajo"], [c["c6-piso"], "senala"]], espejo: true, fase: 2 });
      } },

    // 7 · Padre: «¡Pero yo pagaba la hipoteca al 15 %, que era un atraco!»
    { n: 7, set: "vacio",
      svg: `${pareja("s7")}<g id="s7-sello"><g transform="rotate(-8)"><rect x="-170" y="-90" width="340" height="180" rx="20" fill="none" stroke="${C.rojo}" stroke-width="12"/>
        <text x="0" y="40" text-anchor="middle" font-family="Cap" font-weight="800" font-size="130" fill="${C.rojo}">${Math.round(D.tipo89)} %</text></g></g>`,
      tarjeta: tarjeta(7, "Hipotecas en 1989", `<div class="fila"><div class="num t-pasado">${Math.round(D.tipo89)} %</div><div class="uni">de interés<small>media del año (la serie empieza en 1989)</small></div></div>`, { tono: "pasado", fuente: F_BDE }),
      fn: function (t, e) {
        const c = e.c;
        pop("s7-sello", t, c["c7-15"], 560, 820, { s: 1, d: 0.25 });
        persona("s7-padre", t, { x: 210, y: 1440, s: 0.78, mira: 1, boca: habla(t, e, "seria"), brazo: [[0, "abajo"], [c["c7-15"] - 0.15, "arriba"], [c["c7-15"] + 0.1, "empuja"]], ojos: [[0, "grandes"]], fase: 1 });
        persona("s7-hijo", t, { x: 870, y: 1440, s: 0.78, mira: -1, boca: "seria", espejo: true, fase: 2 });
      },
      cam: function (t, e) { const k = t - e.c["c7-15"], g = k >= 0 && k < 0.2; return { dx: g ? azar(5, Math.floor(t * 30)) * 10 : 0, dy: g ? azar(6, Math.floor(t * 30)) * 10 : 0 }; } },

    // 8 · Hijo: «Ahí te la compro: la cuota se comía casi la mitad de lo que entraba en casa. Hoy, el 38 %.»
    { n: 8, set: "vacio",
      svg: `${pareja("s8")}${quesito("s8-a", 420, 840, 92, 50, C.ocre, "1987")}${quesito("s8-b", 660, 840, 92, 50, C.azul, "HOY")}`,
      tarjeta: tarjeta(8, "La cuota se comía…", `<div class="vs"><div class="col"><div class="v t-pasado">${Math.round(D.esf87)} %</div><div class="n">en 1987</div></div>
        <div class="col" id="c8-hoy"><div class="v t-hoy">${Math.round(D.esf87 === 0 ? 0 : D.esfHoy)} %</div><div class="n">hoy</div></div></div><div class="nota">de la renta bruta del hogar</div>`, { fuente: F_BDE }),
      fn: function (t, e) {
        const c = e.c;
        const va = D.esf87 * suave((t - c["c8-mitad"]) / 0.6), vb = D.esfHoy * suave((t - c["c8-hoy"]) / 0.6);
        attr("s8-a-arco", "stroke-dasharray", (D.L * va / 100).toFixed(1) + " " + D.L.toFixed(1)); txt("s8-a-num", t < c["c8-mitad"] ? "" : Math.round(va) + " %");
        attr("s8-b-arco", "stroke-dasharray", (D.L * vb / 100).toFixed(1) + " " + D.L.toFixed(1)); txt("s8-b-num", t < c["c8-hoy"] ? "" : Math.round(vb) + " %");
        css("s8-b", "opacity", t < c["c8-hoy"] - 0.2 ? "0.25" : "1");
        sube("c8-hoy", t, c["c8-hoy"]);
        persona("s8-padre", t, { x: 210, y: 1440, s: 0.78, mira: 1, boca: [[0, "seria"], [c["c8-mitad"], "sonrisa"]], ojos: [[0, "normal"], [c["c8-mitad"], "felices"]], fase: 1 });
        persona("s8-hijo", t, { x: 870, y: 1440, s: 0.78, mira: -1, boca: habla(t, e), brazo: [[0, "hombros"], [c["c8-hoy"], "senala"]], espejo: true, fase: 2 });
      } },

    // 9 · Padre: «¿Lo ves? Y aun así, ahorrábamos.»
    { n: 9, set: "vacio",
      svg: `${pareja("s9")}`,
      tarjeta: tarjeta(9, "Padre", `<div class="tit">«¿Lo ves? Y aun así, <mark id="m9">ahorrábamos</mark>»</div>`, { tono: "pasado" }),
      fn: function (t, e) {
        marca("m9", t, e.b + 0.5);
        persona("s9-padre", t, { x: 210, y: 1440, s: 0.78, mira: 1, boca: habla(t, e, "grande"), brazo: [[0, "arriba"]], ojos: [[0, "felices"]], incl: [[0, -6]], fase: 1 });
        persona("s9-hijo", t, { x: 870, y: 1440, s: 0.78, mira: -1, boca: "seria", espejo: true, incl: [[0, 4]], fase: 2 });
      } },

    // 10 · Hijo: «Vosotros pagabais intereses. Nosotros pagamos ladrillo.»
    { n: 10, set: "vacio",
      svg: `${pareja("s10")}${banco("s10-banco")}${billete("s10-bill")}${ladrillo("s10-lad")}`,
      tarjeta: tarjeta(10, "Hijo", `<div class="tit">Antes, <mark id="m10a">intereses</mark>. Hoy, <mark id="m10b">ladrillo</mark>.</div>`, { tono: "hoy" }),
      fn: function (t, e) {
        const c = e.c;
        if (pop("s10-banco", t, e.b + 0.05, 420, 880, { s: 0.9 }) >= 0) {
          const k = clamp((t - c["c10-int"]) / 0.6);
          T("s10-bill", 300 + 120 * suave(k), 760 + 120 * suave(k), { s: 0.9 * (1 - 0.6 * k), op: t < c["c10-int"] - 0.3 ? 0 : 1 - k * 0.8 });
        } else ver("s10-bill", false);
        const kl = (t - c["c10-lad"]) / 0.35;
        if (kl < 0) ver("s10-lad", false); else T("s10-lad", 690, 860 - 300 * (1 - fuera(kl)), { s: 0.85, op: clamp(kl * 3) });
        marca("m10a", t, c["c10-int"]); marca("m10b", t, c["c10-lad"]);
        persona("s10-padre", t, { x: 210, y: 1440, s: 0.78, mira: 1, boca: [[0, "sonrisa"], [c["c10-lad"], "o"]], ojos: [[0, "normal"], [c["c10-lad"], "grandes"]], fase: 1 });
        persona("s10-hijo", t, { x: 870, y: 1440, s: 0.78, mira: 0, boca: habla(t, e), brazo: [[0, "abajo"], [c["c10-lad"], "hombros"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { const k = t - e.c["c10-lad"] - 0.3, g = k >= 0 && k < 0.18; return { dx: 0, dy: g ? azar(7, Math.floor(t * 30)) * 9 : 0 }; } },

    // 11 · Hijo: «O sea, ¿mejora o empeora? La casa, empeora: el doble de años de sueldo. La cuota, mejora.»
    { n: 11, set: "vacio",
      svg: `${pareja("s11")}`,
      tarjeta: tarjeta(11, "El veredicto · frente a 1986", `<div class="tit" style="font-size:58px">¿<mark id="m11a">Mejora</mark> o <mark id="m11b">empeora</mark>?</div>
        <div class="ops"><div class="op" id="c11-o0"><i></i><span class="lab" style="width:270px">Comprar casa</span><b>Empeora</b><span style="font:600 30px Cap;color:${C.gris};margin-left:6px;white-space:nowrap">${es(D.anos86)} → ${es(D.anosHoy)} años</span></div>
        <div class="op" id="c11-o1"><i></i><span class="lab" style="width:270px">La cuota</span><b>Mejora</b></div></div>`, { fuente: F_C }),
      fn: function (t, e) {
        const c = e.c;
        marca("m11a", t, c["c11-m"]); marca("m11b", t, c["c11-e"]);
        sube("c11-o0", t, c["c11-casa"] - 0.5); sube("c11-o1", t, c["c11-cuota"] - 0.6);
        $("c11-o0").className = "op" + (t >= c["c11-casa"] ? " si" : "");
        $("c11-o1").className = "op" + (t >= c["c11-cuota"] ? " si" : "");
        persona("s11-padre", t, { x: 210, y: 1440, s: 0.78, mira: 1, boca: [[0, "seria"], [c["c11-cuota"], "sonrisa"]], brazo: [[0, "abajo"], [c["c11-cuota"], "arriba"]], fase: 1 });
        persona("s11-hijo", t, { x: 870, y: 1440, s: 0.78, mira: 0, boca: habla(t, e), brazo: [[0, "abajo"], [c["c11-casa"], "senala"], [c["c11-cuota"], "hombros"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { const k = t - e.c["c11-casa"], g = k >= 0 && k < 0.22; return { dx: g ? azar(3, Math.floor(t * 30)) * 9 : 0, dy: g ? azar(4, Math.floor(t * 30)) * 9 : 0 }; } },

    // 12 · Padre: «Ya… ¿Y los 50 euros de la cena de anoche, qué, listillo?»
    { n: 12, set: "vacio",
      svg: `${pareja("s12")}${tique("s12-t", "50 €")}`,
      tarjeta: tarjeta(12, "Padre", `<div class="tit">«¿Y los 50 euros de la <mark id="m12">cena</mark>?»</div>`, { tono: "pasado" }),
      fn: function (t, e) {
        const c = e.c;
        pop("s12-t", t, c["c12-tique"], 430, 860, { r: -8, s: 1.1 });
        marca("m12", t, c["c12-tique"] + 0.3);
        persona("s12-padre", t, { x: 210, y: 1440, s: 0.78, mira: 1, boca: habla(t, e, "sonrisa"), brazo: [[0, "abajo"], [c["c12-tique"] - 0.1, "senala"]], ojos: [[0, "normal"], [c["c12-listillo"], "felices"]], fase: 1 });
        persona("s12-hijo", t, { x: 870, y: 1440, s: 0.78, mira: [[0, -1], [c["c12-listillo"], 0]], boca: [[0, "seria"], [c["c12-listillo"], "o"]], ojos: [[0, "normal"], [c["c12-listillo"], "grandes"]], incl: [[c["c12-listillo"], 8]], espejo: true, fase: 2 });
      } },

    // 13 · Hijo: «¿Quién tiene razón? Te leo.»
    { n: 13, set: "vacio",
      svg: `${pareja("s13")}${boton("s13-bp", "PADRE", "#8C6F5A")}${boton("s13-bh", "HIJO", "#56738A")}${bocadillo("s13-boc")}`,
      tarjeta: tarjeta(13, "Te toca", `<div class="tit">¿Quién tiene <mark id="m13">razón</mark>: el padre o el hijo?</div><div class="sub" id="c13-sub">Te leo en los comentarios.</div>`),
      fn: function (t, e) {
        const c = e.c;
        pop("s13-bp", t, c["c13-botones"], 220, 900); pop("s13-bh", t, c["c13-botones"] + 0.15, 860, 900);
        if (pop("s13-boc", t, c["c13-boc"], 540, 700, { s: 1.0 }) >= 0) for (let i = 0; i < 3; i++) attr("s13-boc-p" + i, "cy", (-6 - 16 * Math.max(0, Math.sin((t - c["c13-boc"]) * 8 - i * 0.9))).toFixed(1));
        marca("m13", t, c["c13-botones"] + 0.3); sube("c13-sub", t, c["c13-boc"] - 0.2);
        persona("s13-padre", t, { x: 210, y: 1440, s: 0.78, mira: 0, boca: "sonrisa", brazo: [[0, "abajo"], [c["c13-botones"], "arriba"]], fase: 1 });
        persona("s13-hijo", t, { x: 870, y: 1440, s: 0.78, mira: 0, boca: habla(t, e), brazo: [[0, "abajo"], [c["c13-botones"] + 0.15, "arriba"]], espejo: true, fase: 2 });
      } },
  ];
}
