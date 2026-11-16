// Escenas de T4 v4 (padre contra hijo, 2.ª parte) en estilo «limpio». Los dos discuten y el decorado cambia
// con lo que dicen, como en un sueño: cocina → bar → súper → calle → piso vacío → el cuarto de siempre →
// cocina. El padre sigue a la izquierda y el hijo a la derecha; quien habla mueve la boca.
// Cada escena: dibujo (svg), tarjeta (HTML) y acción (fn, se ejecuta en la página con diseno/limpio_runtime.js).
// Los decorados son capas compartidas (diseno/sueno.mjs); los momentos e.c[...] salen de historia.json.
/* eslint-disable no-undef */

import { C, persona, bocadillo, tarjeta, producto, carro } from "../../diseno/limpio.mjs";
import { bandera, ROPAS, PIELES, PELOS, DELANTAL } from "../../diseno/barrio.mjs";
import { icono, billete, boton, quesito, barraEdad, cocido } from "../../diseno/casa.mjs";
import { ambientes, cana, BANDEJA, mesaAlta, hucha, bloque, cartel, cajaMudanza, osito } from "../../diseno/sueno.mjs";

export const ESTILO = "limpio";
const F_GASTO = "INE, Encuesta de Presupuestos Familiares (1986 y 2025)";
const F_EUR = "Dato oficial: Eurostat (alquiler sobre la renta del hogar, 2025)";
const F_EMA = "Dato oficial: Eurostat (2025)";

export function datos(t4) {
  const g = (o, casa) => ({ comida: o.alimentos_y_bebidas_no_alcoholicas, casa: o[casa], ocio: o.ocio_restaurantes_comunicaciones });
  return {
    g86: g(t4.gasto_1986_pct, "vivienda_calefaccion_alumbrado"), gHoy: g(t4.gasto_total_pct["2025"], "vivienda_agua_electricidad_gas"),
    g16: g(t4.gasto_total_pct["2016"], "vivienda_agua_electricidad_gas"),
    alqSolo: t4.alquiler_pct_renta.una_persona_ES["2025"], alqPareja: t4.alquiler_pct_renta.dos_adultos_ES["2025"],
    alqSolo16: t4.alquiler_pct_renta.una_persona_ES["2016"], alqUE: t4.alquiler_pct_renta.una_persona_UE["2025"],
    emaES: t4.edad_emancipacion.ES_2025, emaUE: t4.edad_emancipacion.UE_2025,
    L: 2 * Math.PI * 80,
  };
}

// Los decorados (capas compartidas) y el filtro del cambio «de sueño».
export const capas = () => ambientes();

// ------------------------------------------------------------------ personajes (todos inventados)
const PADRE = { pelo: "corto", canas: true, barba: false, bigote: true, colorPelo: "#6F6A62", colorBigote: "#5E5952", ropa: ["#8C6F5A", "#6E5444"], piel: "#EDBE96" };
const HIJO = { pelo: "corto", canas: false, barba: false, colorPelo: "#3B2A20", ropa: ["#6F8FA6", "#56738A"], piel: "#F1C9A5" };
const CAMARERA = { pelo: "largo", canas: false, barba: false, ropa: ROPAS.vino, encima: DELANTAL("#3B2A20"), piel: PIELES[3], colorPelo: PELOS[3], mano: BANDEJA };
const PAREJA = { pelo: "largo", canas: false, barba: false, ropa: ROPAS.mostaza, piel: PIELES[0], colorPelo: PELOS[0] };
const COMP1 = { pelo: "corto", canas: false, barba: false, ropa: ROPAS.salvia, piel: PIELES[4], colorPelo: PELOS[3] };
const COMP2 = { pelo: "largo", canas: false, barba: false, ropa: ROPAS.lila, piel: PIELES[2], colorPelo: PELOS[4] };
const dos = (p) => `${persona(p + "-padre", "hoy", PADRE)}${persona(p + "-hijo", "hoy", HIJO)}`;

// Tarjeta «de cada 100 €»: la barra del gasto (comida, casa, ocio y el resto) y las dos cifras del trozo resaltado.
function tarjeta100(n, titulo, v86, vHoy, nota, extra = "") {
  const trozo = (x, color) => `<i id="c${n}-s-${x}" style="width:0;flex:none;background:${color};display:flex;align-items:center;justify-content:center;overflow:hidden;font:800 27px Cap;font-style:normal;color:#fff;white-space:nowrap">${x}</i>`;
  return tarjeta(n, "De cada 100 € que gasta un hogar", `
    <div style="display:flex;height:64px;border-radius:18px;overflow:hidden;background:#E6DFD2;margin:4px 0 12px">${trozo("comida", C.ocre)}${trozo("casa", C.rojo)}${trozo("ocio", C.salvia)}</div>
    <div class="vs"><div class="col"><div class="v t-pasado" id="c${n}-a">${v86} €</div><div class="n">en 1986</div></div>
      <div class="col"><div class="v t-hoy" id="c${n}-b">${vHoy} €</div><div class="n">hoy</div></div></div>
    <div class="nota"><b>${titulo}</b> · ${nota}</div>${extra}`, { fuente: F_GASTO, icono: bandera(44) });
}

export function escenas(D) {
  const es = (v, d = 1) => v.toFixed(d).replace(".", ",");
  const r = (v) => Math.round(v);
  return [
    // 1 · Padre (cocina): «¡Es que os lo fundís todo! Netflix, Glovo, el gimnasio, festivales… ¡Así no hay quien ahorre!»
    { n: 1, set: "vacio",
      svg: `${hucha("s1-hucha")}${dos("s1")}${["tele", "reparto", "pesa", "musica"].map((k, i) => icono("s1-i" + i, k, 1.0)).join("")}`,
      tarjeta: tarjeta(1, "Padre contra hijo · Segunda parte", `<div class="tit" style="font-size:64px">¿De verdad os lo gastáis todo en <mark id="m1">Netflix</mark>?</div>`, { icono: bandera(44) }),
      fn: function (t, e) {
        const c = e.c, cues = [c["c1-netflix"], c["c1-glovo"], c["c1-gim"], c["c1-fest"]];
        ambiente("cocina", null, t, 0);
        // Los iconos saltan y luego dan vueltas sobre la cabeza del hijo.
        const X0 = [600, 760, 940, 450], Y0 = [890, 800, 870, 800];
        for (let i = 0; i < 4; i++) {
          const a = t * 1.5 + i * Math.PI / 2, gira = suave((t - cues[i] - 0.45) / 0.7);
          pop("s1-i" + i, t, cues[i], X0[i] + (840 + Math.cos(a) * 170 - X0[i]) * gira, Y0[i] + (850 + Math.sin(a) * 80 - Y0[i]) * gira, { s: 1.0 });
        }
        // La hucha, vacía, se tambalea con el «así no hay quien ahorre».
        const kh = t - c["c1-ahorre"];
        T("s1-hucha", 540, 1440, { s: 1.15, r: kh > 0 ? Math.sin(kh * 16) * 16 * Math.exp(-kh * 1.4) : 0 });
        marca("m1", t, c["c1-netflix"]);
        persona("s1-padre", t, { x: 210 + 80 * suave((t - e.b - 0.2) / 0.7), y: 1440, s: 0.78, anda: [[e.b + 0.2, true], [e.b + 0.9, false]],
          brazo: [[0, "abajo"], [e.b + 0.3, "hombros"], [c["c1-netflix"], "senala"], [c["c1-ahorre"], "arriba"]], mira: 1, boca: habla(t, e, "seria"), incl: [[0, 0], [c["c1-ahorre"], -4]], fase: 1 });
        persona("s1-hijo", t, { x: 870, y: 1440, s: 0.78, mira: [[0, -1]], ojos: [[0, "normal"], [c["c1-gim"], "grandes"]], boca: [[0, "seria"], [c["c1-ahorre"], "o"]], espejo: true, fase: 2 });
      } },

    // 2 · Hijo (bar): «Vale, ahí te doy algo. De cada 100 euros, en ocio, bares y móvil se iban 12 en 1986. Hoy, 17.»
    { n: 2, set: "vacio",
      svg: `${persona("s2-cam", "hoy", CAMARERA)}${mesaAlta("s2-mesa")}${cana("s2-c1")}${cana("s2-c2")}${dos("s2")}`,
      tarjeta: tarjeta100(2, "Ocio, bares y móvil", r(D.g86.ocio), r(D.gHoy.ocio), `en 2016: ${r(D.g16.ocio)}`),
      fn: function (t, e) {
        const c = e.c;
        ambiente("bar", "cocina", t, e.t0);
        T("s2-mesa", 540, 1440);
        // Las cañas llegan a la mesa y, cuando el padre se sale con la suya («Hoy, 17»), brindan solas.
        const kb = Math.sin(clamp((t - c["c2-17"] - 0.25) / 0.5) * Math.PI);
        if (pop("s2-c1", t, e.t0 + 0.55, 492, 1110) >= 0.4) T("s2-c1", 492 + 30 * kb, 1110 - 90 * kb, { r: 16 * kb });
        if (pop("s2-c2", t, e.t0 + 0.7, 590, 1110) >= 0.4) T("s2-c2", 590 - 30 * kb, 1110 - 90 * kb, { r: -16 * kb });
        // La camarera cruza por detrás con la bandeja.
        persona("s2-cam", t, { x: -170 + 215 * Math.max(0, t - e.t0 - 0.5), y: 1392, s: 0.7, anda: true, brazo: "sujeta", mira: 1, boca: "sonrisa", fase: 3 });
        barra100("c2", D.g86, D.gHoy, suave((t - c["c2-hoy"]) / 0.9), "ocio");
        sube("c2-a", t, c["c2-86"]); sube("c2-b", t, c["c2-17"] - 0.1);
        const bote = t > c["c2-17"] + 0.15 ? Math.abs(Math.sin((t - c["c2-17"] - 0.15) * 9.4)) * 28 * Math.exp(-(t - c["c2-17"]) * 1.2) : 0;
        persona("s2-padre", t, { x: 210, y: 1440, s: 0.78, sube: bote, mira: 1, boca: [[0, "seria"], [c["c2-17"], "grande"]], ojos: [[0, "normal"], [c["c2-17"], "felices"]], brazo: [[0, "abajo"], [c["c2-17"] + 0.1, "arriba"]], fase: 1 });
        persona("s2-hijo", t, { x: 870, y: 1440, s: 0.78, mira: -1, boca: habla(t, e), brazo: [[0, "abajo"], [e.b, "hombros"], [c["c2-86"], "senala"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camSueno(t, e.t0); } },

    // 4 · Hijo (súper): «Pero vente al súper. En 1986, la comida se llevaba 28 de cada 100. Hoy, 16.»
    { n: 4, set: "vacio",
      svg: `${producto("leche", "s4-p0", 0.9)}${producto("pan", "s4-p1", 0.8)}${producto("manzana", "s4-p2", 0.9)}${dos("s4")}${carro("s4-carro", false)}`,
      tarjeta: tarjeta100(4, "Comida", r(D.g86.comida), r(D.gHoy.comida), `en 2016: ${r(D.g16.comida)}`),
      fn: function (t, e) {
        const c = e.c;
        ambiente("super", "bar", t, e.t0);
        // El carro entra rodando y tres productos saltan de la estantería al carro.
        T("s4-carro", 1300 - 760 * fuera((t - c["c4-super"]) / 0.9), 1470, { s: 0.9 });
        const P = [[190, 800, -46], [560, 990, 6], [900, 800, 52]];
        for (let i = 0; i < 3; i++) salto("s4-p" + i, t, c["c4-p" + i], P[i][0], P[i][1], 540 + P[i][2], 1252, { alto: 230, d: 0.5, r: 40 });
        barra100("c4", D.g86, D.gHoy, suave((t - c["c4-hoy"]) / 0.9), "comida");
        sube("c4-a", t, c["c4-28"]); sube("c4-b", t, c["c4-16"] - 0.1);
        persona("s4-padre", t, { x: 210, y: 1440, s: 0.78, mira: 1, boca: [[0, "sonrisa"], [c["c4-16"], "o"]], ojos: [[0, "normal"], [c["c4-16"], "grandes"]], fase: 1 });
        persona("s4-hijo", t, { x: 870, y: 1440, s: 0.78, mira: -1, boca: habla(t, e), brazo: [[0, "abajo"], [c["c4-super"], "empuja"], [c["c4-28"], "senala"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camSueno(t, e.t0); } },

    // 5 · Padre (súper): «¡Pues mejor me lo pones! ¿Dónde se os va la pasta?»
    { n: 5, set: "vacio",
      svg: `${producto("leche", "s5-p0", 0.9)}${producto("pan", "s5-p1", 0.8)}${producto("manzana", "s5-p2", 0.9)}${dos("s5")}${carro("s5-carro", false)}${[0, 1, 2].map((i) => billete("s5-b" + i)).join("")}`,
      tarjeta: tarjeta(5, "Padre", `<div class="tit">«¿Dónde se os va la <mark id="m5">pasta</mark>?»</div>`, { tono: "pasado" }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("super", null, t, 0);
        T("s5-carro", 540, 1470, { s: 0.9 });
        T("s5-p0", 494, 1252); T("s5-p1", 546, 1252); T("s5-p2", 592, 1252);
        // Los billetes salen volando del carro, hacia arriba: se van a otro sitio.
        for (let i = 0; i < 3; i++) {
          const k = (t - c["c5-pasta"] - i * 0.16) / 1.2;
          if (k < 0) { ver("s5-b" + i, false); continue; }
          T("s5-b" + i, 540 + (i - 1) * 60 + k * (120 + i * 70), 1230 - 620 * fuera(k), { r: -20 + 60 * k + Math.sin(t * 14 + i) * 14, s: 0.95, op: 1 - clamp((k - 0.75) / 0.25) });
        }
        marca("m5", t, c["c5-pasta"]);
        persona("s5-padre", t, { x: 210, y: 1440, s: 0.78, mira: 1, boca: habla(t, e, "seria"), brazo: [[0, "abajo"], [e.b + 0.1, "hombros"], [c["c5-pasta"] - 0.3, "arriba"]], fase: 1 });
        persona("s5-hijo", t, { x: 870, y: 1440, s: 0.78, mira: [[0, -1], [c["c5-pasta"] + 0.3, 0]], boca: "seria", ojos: [[0, "normal"], [c["c5-pasta"] + 0.2, "grandes"]], espejo: true, fase: 2 });
      } },

    // 6 · Hijo (calle): «En la casa, papá. En 1986, 19 de cada 100. Hoy, 33. Un tercio de todo lo que gastas.»
    { n: 6, set: "vacio",
      svg: `${bloque("s6-blo", 7)}${[0, 1, 2].map((i) => billete("s6-b" + i)).join("")}${dos("s6")}`,
      tarjeta: tarjeta100(6, "Alquiler real o estimado, luz, agua y gas", r(D.g86.casa), r(D.gHoy.casa), `en 2016: ${r(D.g16.casa)}`,
        `<div class="sub" id="c6-sub" style="margin-top:6px">Un <mark id="m6">tercio</mark> de todo lo que gasta</div>`),
      fn: function (t, e) {
        const c = e.c;
        ambiente("calle", "super", t, e.t0);
        // El bloque crece planta a planta: 4 plantas en 1986 y 7 hoy (la misma proporción que 19 y 33).
        T("s6-blo", 540, 1300);
        let alto = 0;
        for (let k = 0; k < 7; k++) {
          const t0 = k < 4 ? c["c6-casa"] + k * 0.1 : c["c6-hoy"] + 0.25 + (k - 4) * 0.32, v = fuera((t - t0) / 0.24);
          if (t < t0) { ver("s6-blo-p" + k, false); continue; }
          T("s6-blo-p" + k, 0, -70 * k, { sx: 1, sy: Math.max(0.02, v) });
          alto += 70 * v;
        }
        if (alto > 0) T("s6-blo-tejado", 0, -alto); else ver("s6-blo-tejado", false);
        // Los billetes que salieron volando del súper caen aquí: se los traga el portal.
        for (let i = 0; i < 3; i++) {
          const k = (t - c["c6-casa"] + 0.5 - i * 0.16) / 0.8;
          if (k < 0 || k > 1) { ver("s6-b" + i, false); continue; }
          T("s6-b" + i, 250 + i * 60 + (540 - 250 - i * 60) * k, 640 + (1262 - 640) * k * k, { r: 60 - 60 * k + Math.sin(t * 14 + i) * 12, s: 0.95 * (1 - 0.6 * k), op: 1 - clamp((k - 0.8) / 0.2) });
        }
        barra100("c6", D.g86, D.gHoy, suave((t - c["c6-hoy"]) / 1.2), "casa");
        sube("c6-a", t, c["c6-19"]); sube("c6-b", t, c["c6-33"] - 0.1); sube("c6-sub", t, c["c6-tercio"] - 0.2); marca("m6", t, c["c6-tercio"]);
        persona("s6-padre", t, { x: 210, y: 1440, s: 0.78, mira: 1, boca: [[0, "seria"], [c["c6-33"], "o"]], ojos: [[0, "normal"], [c["c6-hoy"] + 0.3, "grandes"]], incl: [[0, 0], [c["c6-hoy"] + 0.3, -7]], fase: 1 });
        persona("s6-hijo", t, { x: 870, y: 1440, s: 0.78, mira: -1, boca: habla(t, e), brazo: [[0, "abajo"], [c["c6-casa"], "senala"], [c["c6-tercio"], "hombros"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) {
        const k = t - e.c["c6-33"], g = k >= 0 && k < 0.3;
        return { z: camSueno(t, e.t0).z, dx: g ? azar(5, Math.floor(t * 30)) * 12 : 0, dy: g ? azar(6, Math.floor(t * 30)) * 12 : 0 };
      } },

    // 7 · Padre (calle): «Pues alquila algo, que no es para tanto.»
    { n: 7, set: "vacio",
      svg: `${bloque("s7-blo", 7)}${cartel("s7-cartel", "SE ALQUILA", "#B5651D")}${dos("s7")}`,
      tarjeta: tarjeta(7, "Padre", `<div class="tit">«Pues <mark id="m7">alquila</mark> algo»</div>`, { tono: "pasado" }),
      fn: function (t, e) {
        const c = e.c, k = t - c["c7-alquila"];
        ambiente("calle", null, t, 0);
        T("s7-blo", 540, 1300);
        for (let i = 0; i < 7; i++) T("s7-blo-p" + i, 0, -70 * i);
        T("s7-blo-tejado", 0, -490);
        // El cartel baja colgando y se queda balanceándose.
        if (k < 0) ver("s7-cartel", false); else T("s7-cartel", 540, 430 - 520 * (1 - fuera(k / 0.45)), { r: 8 * Math.sin(k * 5.5) * Math.exp(-k * 0.8) });
        marca("m7", t, c["c7-alquila"]);
        persona("s7-padre", t, { x: 210, y: 1440, s: 0.78, mira: 1, boca: habla(t, e, "sonrisa"), brazo: [[0, "abajo"], [c["c7-alquila"] - 0.1, "senala"]], fase: 1 });
        persona("s7-hijo", t, { x: 870, y: 1440, s: 0.78, mira: -1, boca: "seria", ojos: [[0, "normal"], [c["c7-alquila"] + 0.5, "grandes"]], espejo: true, fase: 2 });
      } },

    // 8 · Hijo (piso vacío): «¿Solo? El alquiler se come el 39 % de lo que ganas. En pareja, el 27. O pareja… o piso compartido.»
    { n: 8, set: "vacio",
      svg: `${quesito("s8-q", 400, 800, 80, 44, C.rojo, "ALQUILER")}${persona("s8-comp1", "hoy", COMP1)}${persona("s8-comp2", "hoy", COMP2)}${cajaMudanza("s8-caja")}
        ${persona("s8-padre", "hoy", PADRE)}${persona("s8-pareja", "hoy", PAREJA)}${persona("s8-hijo", "hoy", HIJO)}`,
      tarjeta: tarjeta(8, "El alquiler se come…", `<div class="vs"><div class="col"><div class="v t-hoy" id="c8-a">${r(D.alqSolo)} %</div><div class="n">si vives solo</div></div>
        <div class="col"><div class="v t-hoy" id="c8-b">${r(D.alqPareja)} %</div><div class="n">en pareja</div></div></div>
        <div class="nota">de lo que entra en casa, de media (2025) · En 2016, solo: ${r(D.alqSolo16)}&nbsp;% · UE: ${r(D.alqUE)}&nbsp;%</div>`, { tono: "hoy", fuente: F_EUR, icono: bandera(44) }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("piso", "calle", t, e.t0);
        // El quesito del alquiler: 39 % si vive solo; baja al 27 % cuando llega la pareja.
        const v = D.alqSolo * suave((t - c["c8-39"]) / 0.6) + (D.alqPareja - D.alqSolo) * suave((t - c["c8-27"]) / 0.6);
        attr("s8-q-arco", "stroke-dasharray", (D.L * v / 100).toFixed(1) + " " + D.L.toFixed(1)); txt("s8-q-num", t < c["c8-39"] ? "" : Math.round(v) + " %");
        css("s8-q", "opacity", clamp((t - c["c8-39"] + 0.4) / 0.3).toFixed(2));
        sube("c8-a", t, c["c8-39"]); sube("c8-b", t, c["c8-27"]);
        // La pareja entra andando y saluda.
        const tp = c["c8-pareja"];
        persona("s8-pareja", t, { oculto: t < tp, x: 1260 - 565 * suave((t - tp) / 0.9), y: 1440, s: 0.76, anda: [[tp, true], [tp + 0.9, false]], espejo: true, mira: -1,
          boca: "sonrisa", ojos: "felices", brazo: [[0, "abajo"], [tp + 0.95, "saluda"], [tp + 1.9, "abajo"]], fase: 4 });
        // «O piso compartido»: aparecen dos compañeros de piso, con su caja.
        const tc = c["c8-compartido"], k1 = (t - tc) / 0.32, k2 = (t - tc - 0.2) / 0.32;
        persona("s8-comp1", t, { oculto: k1 < 0, x: 566, y: 1404, s: 0.7 * (0.3 + 0.7 * rebote(k1)), mira: 1, boca: "sonrisa", brazo: [[0, "abajo"], [tc + 0.3, "saluda"]], fase: 5 });
        persona("s8-comp2", t, { oculto: k2 < 0, x: 1012, y: 1404, s: 0.7 * (0.3 + 0.7 * rebote(k2)), espejo: true, mira: -1, boca: "sonrisa", ojos: "felices", fase: 6 });
        pop("s8-caja", t, tc + 0.1, 470, 1440, { s: 0.9 });
        persona("s8-padre", t, { x: 210, y: 1440, s: 0.78, mira: 1, boca: [[0, "seria"], [c["c8-39"], "o"], [tp + 0.6, "sonrisa"], [tc, "o"]], ojos: [[0, "normal"], [c["c8-39"], "grandes"], [tp + 0.6, "normal"], [tc, "grandes"]], fase: 1 });
        persona("s8-hijo", t, { x: 870, y: 1440, s: 0.78, mira: [[0, -1], [tc + 0.2, 0]], boca: habla(t, e), brazo: [[0, "hombros"], [c["c8-39"], "senala"], [tp, "abajo"], [tc, "hombros"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camSueno(t, e.t0); } },

    // 9 · Padre (el cuarto de siempre): «¿Y por eso seguís en casa con treinta tacos?»
    { n: 9, set: "vacio",
      svg: `${osito("s9-oso")}${dos("s9")}`,
      tarjeta: tarjeta(9, "Padre", `<div class="tit">«¿Y seguís en casa con treinta <mark id="m9">tacos</mark>?»</div>`, { tono: "pasado" }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("cuarto", "piso", t, e.t0);
        pop("s9-oso", t, c["c9-tacos"], 610, 1150, { s: 1.0 });
        marca("m9", t, c["c9-tacos"]);
        persona("s9-padre", t, { x: 210 + 70 * suave((t - e.b) / 0.7), y: 1440, s: 0.78, anda: [[e.b, true], [e.b + 0.7, false]], mira: 1, boca: habla(t, e, "sonrisa"), brazo: [[0, "abajo"], [e.b + 0.3, "senala"]], fase: 1 });
        persona("s9-hijo", t, { x: 870, y: 1440, s: 0.78, mira: -1, boca: "seria", ojos: [[0, "normal"], [c["c9-tacos"], "grandes"]], incl: [[0, 0], [c["c9-tacos"], 4]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camSueno(t, e.t0); } },

    // 10 · Hijo (cuarto): «Con 30,2 de media. En Europa, a los 26.»
    { n: 10, set: "vacio",
      svg: `${osito("s10-oso")}<rect id="s10-panel" x="290" y="716" width="540" height="296" rx="28" fill="#FFFDF8" opacity=".93"/>${barraEdad("s10-es", "España", C.ocre)}${barraEdad("s10-ue", "Unión Europea", C.azul)}${dos("s10")}`,
      tarjeta: tarjeta(10, "Edad media al irse de casa", `<div class="vs"><div class="col"><div class="v t-hoy" id="c10-a">${es(D.emaES)}</div><div class="n">España</div></div>
        <div class="col"><div class="v t-hoy" id="c10-b">${es(D.emaUE)}</div><div class="n">Unión Europea</div></div></div>`, { tono: "hoy", fuente: F_EMA, icono: bandera(44) }),
      fn: function (t, e) {
        const c = e.c, ancho = (edad) => 460 * edad / 35;
        ambiente("cuarto", null, t, 0);
        T("s10-oso", 610, 1150);
        T("s10-es", 330, 810); T("s10-ue", 330, 950);
        const wa = ancho(D.emaES) * suave((t - c["c10-es"]) / 0.7), wb = ancho(D.emaUE) * suave((t - c["c10-ue"]) / 0.6);
        attr("s10-es-b", "width", wa.toFixed(1)); attr("s10-ue-b", "width", wb.toFixed(1));
        txt("s10-es-n", t < c["c10-es"] + 0.5 ? "" : es(D.emaES)); attr("s10-es-n", "x", (wa - 100).toFixed(1));
        txt("s10-ue-n", t < c["c10-ue"] + 0.4 ? "" : es(D.emaUE)); attr("s10-ue-n", "x", (wb - 100).toFixed(1));
        sube("c10-a", t, c["c10-es"]); sube("c10-b", t, c["c10-ue"]);
        persona("s10-padre", t, { x: 280, y: 1440, s: 0.78, mira: 1, boca: [[0, "seria"], [c["c10-ue"] + 0.3, "o"]], ojos: [[0, "normal"], [c["c10-ue"] + 0.3, "grandes"]], fase: 1 });
        persona("s10-hijo", t, { x: 870, y: 1440, s: 0.78, mira: -1, boca: habla(t, e), brazo: [[0, "abajo"], [c["c10-es"], "senala"]], espejo: true, fase: 2 });
      } },

    // 13 · Padre (cocina): «Pues aquí estás muy bien, majo. Y comes caliente.»
    { n: 13, set: "vacio",
      svg: `${dos("s13")}${cocido("s13-plato")}`,
      tarjeta: tarjeta(13, "Padre", `<div class="tit">«Aquí estás muy bien, <mark id="m13">majo</mark>»</div>`, { tono: "pasado" }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("cocina", "cuarto", t, e.t0);
        // El padre saca un plato de cocido y se lo pasa.
        if (t < c["c13-comes"]) pop("s13-plato", t, e.b + 0.5, 350, 1180, { s: 1.2 });
        else salto("s13-plato", t, c["c13-comes"], 350, 1180, 720, 1190, { s: 1.2, alto: 130, d: 0.6 });
        for (let k = 0; k < 3; k++) {
          const f = ((t * 0.8 + k / 3) % 1);
          attr("s13-plato-v" + k, "cx", (Math.sin((t + k) * 3) * 10 + (k - 1) * 22).toFixed(1)); attr("s13-plato-v" + k, "cy", (-30 - f * 110).toFixed(1));
          attr("s13-plato-v" + k, "r", (8 + f * 16).toFixed(1)); css("s13-plato-v" + k, "opacity", (0.85 * (1 - f)).toFixed(2));
        }
        marca("m13", t, e.b + 1.0);
        persona("s13-padre", t, { x: 210, y: 1440, s: 0.78, mira: 1, boca: habla(t, e, "sonrisa"), brazo: [[0, "abajo"], [e.b + 0.4, "sujeta"], [c["c13-comes"], "empuja"], [c["c13-comes"] + 0.7, "abajo"]], ojos: [[0, "felices"]], fase: 1 });
        persona("s13-hijo", t, { x: 870, y: 1440, s: 0.78, mira: -1, boca: [[0, "seria"], [c["c13-comes"] + 0.6, "sonrisa"]], brazo: [[0, "abajo"], [c["c13-comes"] + 0.3, "sujeta"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camSueno(t, e.t0); } },

    // 14 · Hijo, a cámara (cocina): «¿Quién tiene razón? ¿Tú qué opinas?»
    { n: 14, set: "vacio",
      svg: `${dos("s14")}${boton("s14-bp", "PADRE", "#8C6F5A")}${boton("s14-bh", "HIJO", "#56738A")}${bocadillo("s14-boc")}`,
      tarjeta: tarjeta(14, "Te toca", `<div class="tit">¿Quién tiene <mark id="m14">razón</mark>: el padre o el hijo?</div><div class="sub" id="c14-sub">¿Tú qué opinas? Te leo en los comentarios.</div>`),
      fn: function (t, e) {
        const c = e.c;
        ambiente("cocina", null, t, 0);
        pop("s14-bp", t, c["c14-botones"], 220, 900); pop("s14-bh", t, c["c14-botones"] + 0.15, 860, 900);
        if (pop("s14-boc", t, c["c14-boc"], 540, 700, { s: 1.0 }) >= 0) for (let i = 0; i < 3; i++) attr("s14-boc-p" + i, "cy", (-6 - 16 * Math.max(0, Math.sin((t - c["c14-boc"]) * 8 - i * 0.9))).toFixed(1));
        marca("m14", t, c["c14-botones"] + 0.3); sube("c14-sub", t, c["c14-boc"] - 0.2);
        persona("s14-padre", t, { x: 210, y: 1440, s: 0.78, mira: 0, boca: "sonrisa", brazo: [[0, "abajo"], [c["c14-botones"], "arriba"]], fase: 1 });
        persona("s14-hijo", t, { x: 870, y: 1440, s: 0.78, mira: 0, boca: habla(t, e), brazo: [[0, "abajo"], [c["c14-botones"] + 0.15, "arriba"]], espejo: true, fase: 2 });
      } },
  ];
}
