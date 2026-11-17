// Escenas de T5 (padre contra hijo, 3.ª parte: «¿Y los nietos pa cuándo?») en estilo «limpio».
// El decorado cambia con la conversación, como en un sueño: cocina → calle → boda → sala de cunas → cocina.
// El padre a la izquierda y el hijo a la derecha; quien habla mueve la boca.
// Cada escena: dibujo (svg), tarjeta (HTML) y acción (fn, se ejecuta en la página con diseno/limpio_runtime.js).
// Los decorados son capas compartidas (diseno/sueno.mjs); los momentos e.c[...] salen de historia.json.
/* eslint-disable no-undef */

import { C, persona, bocadillo, tarjeta } from "../../diseno/limpio.mjs";
import { bandera } from "../../diseno/barrio.mjs";
import { boton, reglaEdad, cuna } from "../../diseno/casa.mjs";
import { ambientes, bloque, anillo, contador, bebe, mujer, maletin, moneda } from "../../diseno/sueno.mjs";

export const ESTILO = "limpio";
const F_BDE = "Dato oficial: Banco de España (precio de la vivienda entre la renta bruta de un hogar)";
const F_INE = "Dato oficial: INE (Indicadores Demográficos Básicos)";
const F_EF = "Dato oficial: INE (Encuesta de Fecundidad 2018)";

export function datos(t5) {
  return {
    casa87: t5.vivienda_bde["1987"], casaHoy: t5.vivienda_bde["2026"], casa06: t5.vivienda_bde["2006"], casa16: t5.vivienda_bde["2016"],
    boda86: t5.edad_primer_matrimonio["1986"], bodaHoy: t5.edad_primer_matrimonio["2024"], boda07: t5.edad_primer_matrimonio["2007"], boda16: t5.edad_primer_matrimonio["2016"],
    hijo86: t5.edad_primer_hijo["1986"], hijoHoy: t5.edad_primer_hijo["2024"], hijo07: t5.edad_primer_hijo["2007"], hijo16: t5.edad_primer_hijo["2016"],
    icf86: t5.hijos_por_mujer["1986"], icfHoy: t5.hijos_por_mujer["2024"], icf07: t5.hijos_por_mujer["2007"], icf16: t5.hijos_por_mujer["2016"],
  };
}

// Los decorados (capas compartidas) y el filtro del cambio «de sueño».
export const capas = () => ambientes();

// ------------------------------------------------------------------ personajes (los de T3 y T4)
const PADRE = { pelo: "corto", canas: true, barba: false, bigote: true, colorPelo: "#6F6A62", colorBigote: "#5E5952", ropa: ["#8C6F5A", "#6E5444"], piel: "#EDBE96" };
const HIJO = { pelo: "corto", canas: false, barba: false, colorPelo: "#3B2A20", ropa: ["#6F8FA6", "#56738A"], piel: "#F1C9A5" };
const dos = (p) => `${persona(p + "-padre", "hoy", PADRE)}${persona(p + "-hijo", "hoy", HIJO)}`;
const vs = (n, a, b, la, lb, colA = "t-pasado", colB = "t-hoy") => `<div class="vs"><div class="col"><div class="v ${colA}" id="c${n}-a">${a}</div><div class="n">${la}</div></div>
  <div class="col"><div class="v ${colB}" id="c${n}-b">${b}</div><div class="n">${lb}</div></div></div>`;

export function escenas(D) {
  const es = (v, d = 1) => v.toFixed(d).replace(".", ",");
  const r = (v) => Math.round(v);
  return [
    // 1 · Padre (cocina): «¿Y los nietos pa cuándo, eh? ¡Que tu madre y yo, a tu edad, ya te teníamos en brazos!»
    { n: 1, set: "vacio",
      svg: `${dos("s1")}<g id="s1-nube"><circle cx="0" cy="0" r="120" fill="#FFFDF8" stroke="#E3D6BF" stroke-width="6"/>
        <circle cx="-96" cy="118" r="22" fill="#FFFDF8" stroke="#E3D6BF" stroke-width="5"/><circle cx="-130" cy="160" r="12" fill="#FFFDF8" stroke="#E3D6BF" stroke-width="4"/>
        <g transform="translate(0 40) scale(1.1)">${cuna("s1-cuna", C.azulClaro)}</g></g>`,
      tarjeta: tarjeta(1, "Padre contra hijo · Tercera parte", `<div class="tit" style="font-size:66px">¿Y los <mark id="m1">nietos</mark> pa cuándo?</div>`, { icono: bandera(44) }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("cocina", null, t, 0);
        // Una nube de pensamiento con una cuna que se mece, sobre el padre.
        if (pop("s1-nube", t, c["c1-brazos"], 420, 820, { s: 0.95 }) >= 0.35) T("s1-nube", 420, 820 + 6 * Math.sin(t * 2.5), { s: 0.95, r: 3 * Math.sin(t * 3) });
        marca("m1", t, c["c1-nietos"]);
        persona("s1-padre", t, { x: 210, y: 1440, s: 0.78, mira: 1, boca: habla(t, e, "sonrisa"), brazo: [[0, "abajo"], [c["c1-nietos"], "senala"], [c["c1-brazos"] - 0.2, "sujeta"]],
          ojos: [[0, "normal"], [c["c1-brazos"], "felices"]], incl: [[0, 0], [c["c1-brazos"], Math.sin(t * 4) * 6]], fase: 1 });
        persona("s1-hijo", t, { x: 870, y: 1440, s: 0.78, mira: -1, boca: [[0, "sonrisa"], [c["c1-nietos"] + 0.3, "seria"]], ojos: [[0, "normal"], [c["c1-brazos"], "grandes"]], espejo: true, fase: 2 });
      } },

    // 2 · Hijo (calle): «Papá, primero hace falta casa. En 1987, un piso costaba 3 años de lo que ganaba un hogar. Hoy, más de 8.»
    { n: 2, set: "vacio",
      svg: `${bloque("s2-blo", 8)}${dos("s2")}`,
      tarjeta: tarjeta(2, "Un piso, en años de lo que gana un hogar", `${vs(2, es(D.casa87), es(D.casaHoy), "en 1987", "hoy")}
        <div class="nota">Una planta, un año · en 2006: ${es(D.casa06)} · en 2016: ${es(D.casa16)}</div>`, { fuente: F_BDE, icono: bandera(44) }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("calle", "cocina", t, e.t0);
        // El bloque crece planta a planta: 3 plantas en 1987 y 8 hoy (una planta = un año de ingresos del hogar).
        T("s2-blo", 540, 1300);
        let alto = 0;
        for (let k = 0; k < 8; k++) {
          const t0 = k < 3 ? c["c2-3"] + k * 0.12 : c["c2-8"] + (k - 3) * 0.16, v = fuera((t - t0) / 0.22);
          if (t < t0) { ver("s2-blo-p" + k, false); continue; }
          T("s2-blo-p" + k, 0, -70 * k, { sx: 1, sy: Math.max(0.02, v) });
          alto += 70 * v;
        }
        if (alto > 0) T("s2-blo-tejado", 0, -alto); else ver("s2-blo-tejado", false);
        sube("c2-a", t, c["c2-3"]); sube("c2-b", t, c["c2-8"]);
        persona("s2-padre", t, { x: 210, y: 1440, s: 0.78, mira: 1, boca: [[0, "seria"], [c["c2-8"] + 0.6, "o"]], ojos: [[0, "normal"], [c["c2-8"] + 0.6, "grandes"]], incl: [[0, 0], [c["c2-8"] + 0.6, -6]], fase: 1 });
        persona("s2-hijo", t, { x: 870, y: 1440, s: 0.78, mira: -1, boca: habla(t, e), brazo: [[0, "abajo"], [c["c2-3"], "senala"], [c["c2-8"] + 0.9, "hombros"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { const k = t - e.c["c2-8"] - 0.85, g = k >= 0 && k < 0.2; return { z: camSueno(t, e.t0).z, dx: 0, dy: g ? azar(5, Math.floor(t * 30)) * 9 : 0 }; } },

    // 3 · Padre (calle): «¡Pues casaos y a vivir!»
    { n: 3, set: "vacio",
      svg: `${bloque("s3-blo", 8)}${dos("s3")}${anillo("s3-a1")}${anillo("s3-a2")}`,
      tarjeta: tarjeta(3, "Padre", `<div class="tit">«¡Pues <mark id="m3">casaos</mark>!»</div>`, { tono: "pasado" }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("calle", null, t, 0);
        T("s3-blo", 540, 1300);
        for (let k = 0; k < 8; k++) T("s3-blo-p" + k, 0, -70 * k);
        T("s3-blo-tejado", 0, -560);
        // Dos anillos saltan, se juntan y giran.
        const k = (t - c["c3-casaos"]) / 0.6, gira = t * 2.4;
        if (pop("s3-a1", t, c["c3-casaos"], 470, 1000) >= 0.3) T("s3-a1", 520 - 50 * (1 - fuera(k)) + Math.cos(gira) * 8, 1000 + Math.sin(gira) * 8, { s: 1.4 });
        if (pop("s3-a2", t, c["c3-casaos"] + 0.12, 610, 1000) >= 0.3) T("s3-a2", 560 + 50 * (1 - fuera(k)) - Math.cos(gira) * 8, 1000 - Math.sin(gira) * 8, { s: 1.4 });
        marca("m3", t, c["c3-casaos"]);
        persona("s3-padre", t, { x: 210, y: 1440, s: 0.78, mira: 1, boca: habla(t, e, "sonrisa"), brazo: [[0, "abajo"], [c["c3-casaos"] - 0.2, "arriba"]], ojos: [[0, "felices"]], fase: 1 });
        persona("s3-hijo", t, { x: 870, y: 1440, s: 0.78, mira: -1, boca: "seria", espejo: true, fase: 2 });
      } },

    // 4 · Hijo (boda): «Vosotros os casabais a los 26. Ahora, a los 36.»
    { n: 4, set: "vacio",
      svg: `${contador("s4-cont", "EDAD DE LA BODA")}${dos("s4")}`,
      tarjeta: tarjeta(4, "Edad media al primer matrimonio", `${vs(4, r(D.boda86), es(D.bodaHoy), "en 1986", "hoy")}
        <div class="nota">en 2007: ${r(D.boda07)} · en 2016: ${r(D.boda16)}</div>`, { fuente: F_INE, icono: bandera(44) }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("boda", "calle", t, e.t0);
        // El contador marca 26 y luego sube, año a año, hasta 36.
        pop("s4-cont", t, c["c4-26"] - 0.1, 540, 1040, { s: 1 });
        const edad = Math.round(D.boda86 + (D.bodaHoy - D.boda86) * clamp((t - c["c4-36"] + 0.6) / 0.8));
        txt("s4-cont-n", t < c["c4-26"] ? "" : String(edad));
        attr("s4-cont-n", "fill", t > c["c4-36"] ? "#B3261E" : "#1F5F8B");
        sube("c4-a", t, c["c4-26"]); sube("c4-b", t, c["c4-36"]);
        persona("s4-padre", t, { x: 210, y: 1440, s: 0.78, mira: 1, boca: [[0, "sonrisa"], [c["c4-36"] + 0.3, "o"]], ojos: [[0, "felices"], [c["c4-36"] + 0.3, "grandes"]], fase: 1 });
        persona("s4-hijo", t, { x: 870, y: 1440, s: 0.78, mira: -1, boca: habla(t, e), brazo: [[0, "abajo"], [c["c4-26"], "senala"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camSueno(t, e.t0); } },

    // 5 · Padre (boda): «¡Si es que ahora las bodas son un festival!»
    { n: 5, set: "vacio",
      svg: `${dos("s5")}${Array.from({ length: 26 }, (_, i) => `<rect id="s5-cf${i}" x="-9" y="-5" width="18" height="10" rx="3" fill="${["#E9C46A", "#F2B3AC", "#9ED0E6", "#B7D1A8", "#C98F6B"][i % 5]}"/>`).join("")}
        ${[0, 1, 2].map((i) => `<g id="s5-n${i}"><path d="M-8 22 V-30 L26 -38 V14" fill="none" stroke="${C.azul}" stroke-width="7" stroke-linejoin="round"/><ellipse cx="-18" cy="24" rx="12" ry="9" fill="${C.azul}"/><ellipse cx="16" cy="16" rx="12" ry="9" fill="${C.azul}"/></g>`).join("")}`,
      tarjeta: tarjeta(5, "Padre", `<div class="tit">«¡Las bodas son un <mark id="m5">festival</mark>!»</div>`, { tono: "pasado" }),
      fn: function (t, e) {
        const c = e.c, k0 = c["c5-festival"];
        ambiente("boda", null, t, 0);
        // Las luces de la guirnalda parpadean, cae confeti y saltan notas.
        for (let i = 0; i <= 12; i++) css("amb-boda-l" + i, "opacity", t < k0 ? "1" : (0.35 + 0.65 * (Math.sin(t * 9 + i * 1.7) > 0 ? 1 : 0)).toFixed(2));
        for (let i = 0; i < 26; i++) {
          const k = t - k0 - (i % 7) * 0.08;
          if (k < 0) { ver("s5-cf" + i, false); continue; }
          T("s5-cf" + i, ((i * 97) % 1100) + Math.sin(t * 3 + i) * 30 - 10, 560 + ((k * 260 + (i * 53) % 120) % 760), { r: t * 200 + i * 40 });
        }
        for (let i = 0; i < 3; i++) pop("s5-n" + i, t, k0 + 0.15 + i * 0.15, 420 + i * 120, 900 - (i % 2) * 70 + 10 * Math.sin(t * 5 + i), { s: 1.2 });
        marca("m5", t, k0);
        const bote = t > k0 ? Math.abs(Math.sin((t - k0) * 9.4)) * 26 : 0;
        persona("s5-padre", t, { x: 210, y: 1440, s: 0.78, sube: bote, mira: 1, boca: habla(t, e, "grande"), brazo: [[0, "abajo"], [k0 - 0.2, "arriba"]], ojos: [[0, "grandes"]], fase: 1 });
        persona("s5-hijo", t, { x: 870, y: 1440, s: 0.78, mira: -1, boca: [[0, "seria"], [k0 + 0.4, "sonrisa"]], ojos: [[0, "normal"], [k0 + 0.4, "felices"]], espejo: true, fase: 2 });
      } },

    // 6 · Hijo (sala de cunas): «El primer hijo llegaba a los 26. Hoy, a los treinta y uno y medio.»
    { n: 6, set: "vacio",
      svg: `${reglaEdad("s6-regla", 20, 35, 600)}${cuna("s6-cuna", C.azulClaro)}
        <g id="s6-p86"><circle r="12" fill="#8A6316"/><text y="-28" text-anchor="middle" font-family="Cap" font-weight="800" font-size="34" fill="#8A6316">1986</text></g>${dos("s6")}`,
      tarjeta: tarjeta(6, "Edad media de la madre al primer hijo", `${vs(6, r(D.hijo86) + " años", es(D.hijoHoy) + " años", "en 1986", "hoy (2024)")}
        <div class="nota">en 2007: ${es(D.hijo07)} · en 2016: ${es(D.hijo16)}</div>`, { fuente: F_INE, icono: bandera(44) }),
      fn: function (t, e) {
        const c = e.c, RX = (edad) => 240 + (edad - 20) * 40;   // la misma escala que reglaEdad(20, 35, 600)
        ambiente("cunas", "boda", t, e.t0);
        pop("s6-regla", t, e.t0 + 0.6, 540, 850, { s: 1 });
        const x = RX(D.hijo86) + (RX(D.hijoHoy) - RX(D.hijo86)) * suave((t - c["c6-hoy"]) / 1.0);
        pop("s6-cuna", t, c["c6-26"], x, 782, { s: 1.15 });
        if (t >= c["c6-hoy"]) T("s6-p86", RX(D.hijo86), 838, { op: 1 }); else ver("s6-p86", false);
        sube("c6-a", t, c["c6-26"]); sube("c6-b", t, c["c6-hoy"] + 0.4);
        persona("s6-padre", t, { x: 210, y: 1440, s: 0.78, mira: 1, boca: [[0, "sonrisa"], [c["c6-hoy"] + 0.5, "o"]], ojos: [[0, "normal"], [c["c6-hoy"] + 0.5, "grandes"]], fase: 1 });
        persona("s6-hijo", t, { x: 870, y: 1440, s: 0.78, mira: -1, boca: habla(t, e), brazo: [[0, "abajo"], [c["c6-26"], "senala"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camSueno(t, e.t0); } },

    // 7 · Hijo (sala de cunas): «Y de 1,55 hijos por mujer hemos pasado a 1,1.»
    { n: 7, set: "vacio",
      svg: `<rect id="s7-panel" x="250" y="690" width="580" height="420" rx="30" fill="#FFFDF8" opacity=".94"/>
        <text id="s7-l1" x="300" y="830" font-family="Cap" font-weight="800" font-size="38" fill="#8A6316">1986</text>
        <text id="s7-l2" x="300" y="1030" font-family="Cap" font-weight="800" font-size="38" fill="${C.azul}">HOY</text>
        ${bebe("s7-a0")}${bebe("s7-a1")}${bebe("s7-b0")}${bebe("s7-b1")}${dos("s7")}`,
      tarjeta: tarjeta(7, "Hijos por mujer", `${vs(7, es(D.icf86, 2), es(D.icfHoy, 2), "en 1986", "hoy (2024)")}
        <div class="nota">en 2007: ${es(D.icf07, 2)} · en 2016: ${es(D.icf16, 2)}</div>`, { fuente: F_INE, icono: bandera(44) }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("cunas", null, t, 0);
        // Bebés por mujer: uno entero y la parte que toque del segundo (se recorta de izquierda a derecha).
        const fila = (p, y, valor, t0) => {
          for (let i = 0; i < 2; i++) {
            const k = pop(p + i, t, t0 + i * 0.25, 500 + i * 130, y, { s: 0.9 });
            if (k < 0) continue;
            const parte = clamp(valor - i), w = 120 * parte * suave(k / 0.6);
            attr(p + i + "-r", "width", (i === 0 ? 120 * suave(k / 0.4) : w).toFixed(1));
          }
        };
        fila("s7-a", 860, D.icf86, c["c7-155"]);
        fila("s7-b", 1060, D.icfHoy, c["c7-11"]);
        css("s7-l1", "opacity", t < c["c7-155"] ? 0 : 1); css("s7-l2", "opacity", t < c["c7-11"] ? 0 : 1);
        sube("c7-a", t, c["c7-155"]); sube("c7-b", t, c["c7-11"]);
        persona("s7-padre", t, { x: 210, y: 1440, s: 0.78, mira: 1, boca: [[0, "seria"], [c["c7-11"] + 0.4, "o"]], ojos: [[0, "normal"], [c["c7-11"] + 0.4, "grandes"]], fase: 1 });
        persona("s7-hijo", t, { x: 870, y: 1440, s: 0.78, mira: -1, boca: habla(t, e), brazo: [[0, "abajo"], [c["c7-155"], "senala"]], espejo: true, fase: 2 });
      } },

    // 8 · Padre (sala de cunas): «¡Eso es que no queréis, hombre!»
    { n: 8, set: "vacio",
      svg: `${dos("s8")}`,
      tarjeta: tarjeta(8, "Padre", `<div class="tit">«¡Eso es que no <mark id="m8">queréis</mark>!»</div>`, { tono: "pasado" }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("cunas", null, t, 0);
        marca("m8", t, c["c8-quereis"]);
        persona("s8-padre", t, { x: 210 + 60 * suave((t - e.b) / 0.5), y: 1440, s: 0.78, anda: [[e.b, true], [e.b + 0.5, false]], mira: 1, boca: habla(t, e, "seria"), brazo: [[0, "abajo"], [e.b + 0.1, "senala"]], incl: [[0, 4]], fase: 1 });
        // El hijo niega con la cabeza.
        persona("s8-hijo", t, { x: 870, y: 1440, s: 0.78, mira: -1, boca: "seria", incl: t > c["c8-quereis"] ? Math.sin((t - c["c8-quereis"]) * 14) * 8 * Math.exp(-(t - c["c8-quereis"]) * 1.5) : 0, espejo: true, fase: 2 });
      } },

    // 9 · Hijo (sala de cunas): «Casi tres de cada cuatro mujeres querrían al menos dos. Y las que tienen menos de los que querían,
    //     a partir de los 35, dicen que es por el trabajo y el dinero.»
    { n: 9, set: "vacio",
      svg: `<rect x="300" y="800" width="480" height="440" rx="30" fill="#FFFDF8" opacity=".94"/>
        ${[0, 1, 2, 3].map((i) => mujer("s9-m" + i, "#C9CED3")).join("")}
        <g id="s9-boc"><path d="M-120 -60 H120 a30 30 0 0 1 30 30 V30 a30 30 0 0 1 -30 30 H-20 L-60 100 L-56 60 H-120 a30 30 0 0 1 -30 -30 V-30 a30 30 0 0 1 30 -30 Z" fill="#FFFDF8" stroke="#E3D6BF" stroke-width="5"/>
          <g transform="translate(-50 46) scale(.62)">${bebe("s9-b0", "#F2B3AC")}</g><g transform="translate(50 46) scale(.62)">${bebe("s9-b1", "#9ED0E6")}</g></g>
        ${maletin("s9-mal")}${moneda("s9-mon")}${dos("s9")}`,
      tarjeta: tarjeta(9, "Lo que dicen ellas", `<div class="tit" style="font-size:50px"><mark id="m9">Casi 3 de cada 4</mark> mujeres querrían tener al menos dos hijos</div>
        <div class="sub" id="c9-sub" style="font-size:29px">Desde los 35, las que tienen menos de los que querían señalan razones laborales o de conciliación, y económicas</div>`, { fuente: F_EF, icono: bandera(44) }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("cunas", null, t, 0);
        // Cuatro mujeres: casi tres se colorean (la tercera, no del todo) y sale un bocadillo con dos bebés.
        const col = ["#C98F6B", "#8E7CA8", "#C2A24E"];
        for (let i = 0; i < 4; i++) {
          pop("s9-m" + i, t, e.b + 0.1 + i * 0.1, 375 + i * 110, 1220, { s: 0.8 });
          const k = clamp((t - c["c9-tres"] - i * 0.2) / 0.3) * (i === 2 ? 0.85 : 1);
          const el = document.querySelector("#s9-m" + i + " path");
          if (el) el.setAttribute("fill", i < 3 && k > 0 ? col[i] : "#C9CED3");
          if (el) el.style.opacity = i < 3 ? (0.5 + 0.5 * k).toFixed(2) : "0.5";
        }
        if (pop("s9-boc", t, c["c9-dos"], 540, 900, { s: 0.85 }) >= 0) { attr("s9-b0-r", "width", "120"); attr("s9-b1-r", "width", "120"); }
        // «El trabajo y el dinero»: aparecen un maletín y una moneda; el bocadillo se va.
        if (t > c["c9-trabajo"]) T("s9-boc", 540, 900, { s: 0.85, op: 1 - clamp((t - c["c9-trabajo"]) / 0.3) });
        pop("s9-mal", t, c["c9-trabajo"], 450, 900, { s: 1.0 }); pop("s9-mon", t, c["c9-dinero"], 630, 900, { s: 1.0 });
        marca("m9", t, c["c9-tres"]); sube("c9-sub", t, c["c9-menos"]);
        persona("s9-padre", t, { x: 210, y: 1440, s: 0.78, mira: 1, boca: [[0, "seria"], [c["c9-dos"] + 0.4, "o"]], ojos: [[0, "normal"], [c["c9-dos"] + 0.4, "grandes"]], fase: 1 });
        persona("s9-hijo", t, { x: 870, y: 1440, s: 0.78, mira: -1, boca: habla(t, e), brazo: [[0, "abajo"], [c["c9-tres"], "senala"], [c["c9-trabajo"], "hombros"]], espejo: true, fase: 2 });
      } },

    // 10 · Hijo, a cámara (cocina): «Casa, boda, hijos… todo llega más tarde. ¿Casualidad? ¿Tú qué opinas?»
    { n: 10, set: "vacio",
      svg: `${dos("s10")}${boton("s10-bp", "PADRE", "#8C6F5A")}${boton("s10-bh", "HIJO", "#56738A")}${bocadillo("s10-boc")}`,
      tarjeta: tarjeta(10, "Te toca", `<div class="tit" style="font-size:60px">Casa, boda, hijos: todo llega más <mark id="m10">tarde</mark>. ¿Casualidad?</div><div class="sub" id="c10-sub">¿Tú qué opinas? Te leo en los comentarios.</div>`),
      fn: function (t, e) {
        const c = e.c;
        ambiente("cocina", "cunas", t, e.t0);
        pop("s10-bp", t, c["c10-cas"], 220, 900); pop("s10-bh", t, c["c10-cas"] + 0.15, 860, 900);
        if (pop("s10-boc", t, c["c10-boc"], 540, 700, { s: 1.0 }) >= 0) for (let i = 0; i < 3; i++) attr("s10-boc-p" + i, "cy", (-6 - 16 * Math.max(0, Math.sin((t - c["c10-boc"]) * 8 - i * 0.9))).toFixed(1));
        marca("m10", t, c["c10-tarde"]); sube("c10-sub", t, c["c10-boc"] - 0.2);
        persona("s10-padre", t, { x: 210, y: 1440, s: 0.78, mira: 0, boca: "sonrisa", brazo: [[0, "abajo"], [c["c10-cas"], "arriba"]], fase: 1 });
        persona("s10-hijo", t, { x: 870, y: 1440, s: 0.78, mira: 0, boca: habla(t, e), brazo: [[0, "abajo"], [c["c10-cas"] + 0.15, "arriba"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camSueno(t, e.t0); } },
  ];
}
