// Escenas de T13 («¿Pagamos más para llegar más tarde?», infraestructuras 2016 frente a hoy) en estilo «limpio».
// Bruno, 21-11-2026: protagonistas del área (viajeros de avión y de tren, pilotos, azafatas, maquinistas, carreteras, peajes y
// conductores), historia, entornos descriptivos, contundente: lo que pagamos frente al servicio que recibimos. Personajes inventados:
//   · «viajera»: unos 35 años, viaja por trabajo con su maleta de cabina (chaqueta verde azulada).
//   · «comandante»: unos 55 años, con gorra y chaqueta de piloto (azul marino), sin marca de compañía.
//   · «maquinista»: unos 45 años, con bigote y chaleco naranja.
//   · la azafata (no habla): uniforme ciruela y pañuelo.
// Decorados nuevos (diseno/transporte.mjs): terminal → interior del avión → andén → peaje.
/* eslint-disable no-undef */

import { C, persona, tarjeta, reloj } from "../../diseno/limpio.mjs";
import { bandera } from "../../diseno/barrio.mjs";
import { ambientes } from "../../diseno/sueno.mjs";
import { billete } from "../../diseno/casa.mjs";
import { balanza } from "../../diseno/sanidad.mjs";
import { DECORADOS_T13, GORRA_PILOTO, CHAQUETA_PILOTO, PANUELO, CHALECO, TELEFONILLO, maleta, coche, barrera, avioncito, trenecito, traviesa, relojAnden } from "../../diseno/transporte.mjs";

export const ESTILO = "limpio";
const F_ATFM = "Dato oficial: EUROCONTROL (retraso ATFM en ruta, espacio aéreo español)";
const F_CNMC = "Dato oficial: CNMC (balance de la liberalización ferroviaria, con datos de Adif)";
const F_IMP = "Cálculo propio · Eurostat (impuestos y cotizaciones recaudados) · INE (IPC y población)";
const F_GAS = "Cálculo propio · Eurostat (gasto de las administraciones por funciones) · OCDE/ITF (inversión) · INE (IPC y población)";

export function datos(d) {
  const a = d.avion_retraso_atfm_en_ruta, tr = d.tren;
  return {
    pct: [a["2016"].pct_vuelos_con_retraso, a["2026"].pct_vuelos_con_retraso],
    ret: [a["2016"].vuelos_con_retraso, a["2026"].vuelos_con_retraso],
    masVuelos: a.vuelos_sube_pct,
    comp: [tr.rutas_con_competencia.puntualidad_pct["2019"], tr.rutas_con_competencia.puntualidad_pct["2024"]],
    ancho: [tr.rutas_ancho_variable.puntualidad_pct["2019"], tr.rutas_ancho_variable.puntualidad_pct["2024"]],
    impuestos: [d.pagamos.por_habitante_eur_de_2025["2016"], d.pagamos.por_habitante_eur_de_2025["2025"]],
    gasto: [d.gasto_transporte.por_habitante_eur_de_2025["2016"], d.gasto_transporte.por_habitante_eur_de_2025["2024"]],
    vias: [d.inversion_vias_tren.mill_eur_de_2025["2016"], d.inversion_vias_tren.mill_eur_de_2025["2024"]],
  };
}

export const capas = () => ambientes(DECORADOS_T13);

// ------------------------------------------------------------------ personajes (inventados), con volumen
const VIAJERA = { pelo: "largo", canas: false, barba: false, colorPelo: "#6B4A2E", ropa: ["#3E8E7E", "#2F7366"], piel: "#F2CBA8", volumen: true };
const COMANDANTE = { pelo: "corto", canas: true, barba: false, colorPelo: "#5A5048", ropa: ["#1F2F4A", "#16213A"], piel: "#EBC3A0", volumen: true, gorro: GORRA_PILOTO, encima: CHAQUETA_PILOTO };
const AZAFATA = { pelo: "largo", canas: false, barba: false, colorPelo: "#2E211A", ropa: ["#7A4E6E", "#643F5A"], piel: "#E0B08A", volumen: true, encima: PANUELO };
const MAQUINISTA = { pelo: "corto", canas: false, barba: false, bigote: true, colorPelo: "#3B2A20", ropa: ["#7E8C9A", "#66737F"], piel: "#DCA883", volumen: true, encima: CHALECO };
const QUIEN = { v: VIAJERA, c: COMANDANTE, z: AZAFATA, m: MAQUINISTA };
const gente = (n, quien, manos = {}) => quien.split("").map((k) => persona(`${n}-${k}`, "hoy", { ...QUIEN[k], mano: manos[k] ? `<g id="${n}-${k}-mano">${manos[k]}</g>` : undefined })).join("");

// ------------------------------------------------------------------ piezas de los datos
const ANTES = "#C8902E", ANTES_T = "#8A6316", HOY = "#B3261E";
const panel = (x, y, w, h) => `<rect x="${x + 8}" y="${y + 12}" width="${w}" height="${h}" rx="26" fill="#3C2814" opacity=".10"/><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="26" fill="#FFFDF8" opacity=".96"/>`;
const rot = (x, y, t, tam, color, id = "", ancla = "middle") => `<text ${id ? `id="${id}"` : ""} x="${x}" y="${y}" text-anchor="${ancla}" font-family="Cap" font-weight="800" font-size="${tam}" fill="${color}">${t}</text>`;
const miles = (v) => String(Math.round(v)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
const es = (v, d = 1) => v.toFixed(d).replace(".", ",");
const vs = (n, vals, labs, tam = 72) => `<div class="vs">${vals.map((v, i) => `<div class="col"><div class="v ${i ? "t-hoy" : "t-pasado"}" id="c${n}-${"ab"[i]}" style="font-size:${tam}px">${v}</div><div class="n">${labs[i]}</div></div>`).join("")}</div>`;
// Iconos pequeños de la portada del viaje: avión, tren y coche.
const icono = (id, dentro) => `<g id="${id}"><circle r="58" fill="#FFFDF8" stroke="${C.tinta}" stroke-opacity=".12" stroke-width="6"/>${dentro}</g>`;
// Fila del panel de salidas para el vuelo de la viajera: «EN HORA» se da la vuelta y queda «RETRASADO».
const FILA_VUELO = `<g transform="translate(330 718)"><rect x="-236" y="-30" width="472" height="52" rx="8" fill="#26323F" stroke="#E9A23B" stroke-width="4"/>
  ${rot(-120, 8, "VALENCIA", 24, "#F4F1EA")}<g transform="translate(128 -3)"><g id="s1-fl"><g id="s1-st0"><rect x="-88" y="-15" width="176" height="30" rx="5" fill="#5FA37A"/>${rot(0, 9, "EN HORA", 20, "#1B232C")}</g>
  <g id="s1-st1" style="opacity:0"><rect x="-88" y="-15" width="176" height="30" rx="5" fill="#D86B5B"/>${rot(0, 9, "RETRASADO", 20, "#FFFFFF")}</g></g></g></g>`;
// Panel de llegadas del andén (escena 9): cada fila pasa de «EN HORA» a «RETRASO».
const LLEGADAS = `<g transform="translate(540 790)"><rect x="-8" y="-150" width="16" height="70" fill="#5B6470"/><rect x="-280" y="-90" width="560" height="300" rx="16" fill="#1B232C"/>
  ${rot(-150, -40, "LLEGADAS", 32, "#E9A23B")}
  ${["A CORUÑA", "GIJÓN", "SANTANDER", "VIGO"].map((d, i) => `<g transform="translate(0 ${10 + i * 50})"><rect x="-250" y="-24" width="500" height="42" rx="6" fill="#26323F"/>${rot(-110, 6, d, 22, "#F4F1EA")}
    <g transform="translate(150 -3)"><g id="s9-f${i}"><g id="s9-a${i}"><rect x="-80" y="-15" width="160" height="30" rx="5" fill="#5FA37A"/>${rot(0, 9, "EN HORA", 19, "#1B232C")}</g>
    <g id="s9-b${i}" style="opacity:0"><rect x="-80" y="-15" width="160" height="30" rx="5" fill="#D86B5B"/>${rot(0, 9, "RETRASO", 19, "#FFFFFF")}</g></g></g></g>`).join("")}</g>`;

export function escenas(D) {
  return [
    // 1 · La viajera (terminal): «¿Pagamos más impuestos que nunca para llegar más tarde? Vamos a verlo: en avión, en tren y en coche.»
    { n: 1, set: "vacio",
      svg: `${FILA_VUELO}${maleta("s1-mz", "#5E8C99")}${gente("s1", "z")}${maleta("s1-mv", "#C77B5B")}${gente("s1", "v")}
        ${icono("s1-i0", `<g transform="rotate(90) scale(1.3)">${avioncito("s1-av")}</g>`)}${icono("s1-i1", `<g transform="scale(1.1)">${trenecito("s1-tr")}</g>`)}
        ${icono("s1-i2", `<g transform="translate(0 26) scale(.18)">${coche("s1-co", "#E0B04A")}</g>`)}`,
      tarjeta: tarjeta(1, "Transporte · 2016 frente a hoy", `<div class="tit" style="font-size:66px">¿Pagamos más para llegar <mark id="m1">más tarde</mark>?</div>`, { icono: bandera(44) }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("terminal", null, t, 0);
        marca("m1", t, c["c1-tarde"]);
        // El vuelo de la viajera se da la vuelta en el panel y queda RETRASADO.
        const kf = clamp((t - c["c1-tarde"]) / 0.32);
        css("s1-st0", "opacity", kf < 0.5 ? 1 : 0); css("s1-st1", "opacity", kf < 0.5 ? 0 : 1);
        attr("s1-fl", "transform", `scale(1 ${Math.max(0.04, Math.abs(Math.cos(kf * Math.PI))).toFixed(3)})`);
        pop("s1-i0", t, c["c1-avion"] - 0.05, 640, 1000); pop("s1-i1", t, c["c1-tren"] - 0.05, 790, 1000); pop("s1-i2", t, c["c1-coche"] - 0.05, 940, 1000);
        // La azafata cruza al fondo con su maleta; la viajera entra con la suya.
        const z = ruta(t, [[0.2, 1350], [e.t1, -350]]);
        persona("s1-z", t, { x: z.x, y: 1405, s: 0.74, anda: z.anda, mira: -1, vivo: true, boca: "sonrisa", brazo: [[0, "abajo"]], espejo: true, fase: 3 });
        T("s1-mz", z.x - 90, 1405, { s: 0.66 });
        const v = ruta(t, [[0.1, -250], [1.7, 430]]);
        persona("s1-v", t, { x: v.x, y: 1440, s: 0.8, anda: v.anda, mira: [[0, 1], [c["c1-impuestos"], 0], [c["c1-tarde"], 1]], vivo: true, charla: e, boca: habla(t, e, "seria"),
          ojos: [[0, "normal"], [c["c1-tarde"] + 0.3, "grandes"], [c["c1-avion"], "normal"]], brazo: [[0, "abajo"], [c["c1-tarde"] + 0.2, "hombros"], [c["c1-avion"] - 0.3, "senala"]], fase: 1 });
        T("s1-mv", v.x - 150, 1440, { s: 0.8 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c1-tarde"]]); } },

    // 2 · El comandante (dentro del avión): «Les habla el comandante: tenemos retraso por el control del tráfico aéreo.»
    { n: 2, set: "vacio",
      svg: `<circle id="s2-luz" cx="504" cy="763" r="22" fill="#E9A23B" opacity="0"/>${gente("s2", "cz", { c: TELEFONILLO })}${maleta("s2-mv", "#C77B5B")}${gente("s2", "v")}`,
      tarjeta: tarjeta(2, "El comandante", `<div class="tit">«Les habla el <mark id="m2">comandante</mark>»</div>`, { tono: "hoy" }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("avion", "terminal", t, e.t0);
        marca("m2", t, c["c2-comandante"]);
        css("s2-luz", "opacity", t > c["c2-retraso"] ? (0.35 + 0.35 * Math.sin(t * 8)).toFixed(2) : 0);
        persona("s2-c", t, { x: 185, y: 1440, s: 0.8, mira: 1, vivo: true, charla: e, boca: habla(t, e, "seria"), brazo: [[0, "piensa"]], fase: 1 });
        persona("s2-z", t, { x: 470, y: 1440, s: 0.74, mira: 1, vivo: true, boca: "sonrisa", brazo: [[0, "abajo"], [c["c2-retraso"] - 0.2, "senala"]], incl: [[0, 0], [c["c2-retraso"], -6]], fase: 2 });
        persona("s2-v", t, { x: 930, y: 1440, s: 0.8, mira: -1, vivo: true, boca: [[0, "seria"], [c["c2-retraso"] + 0.2, "o"]], ojos: [[0, "normal"], [c["c2-retraso"] + 0.2, "grandes"]],
          brazo: [[0, "abajo"], [c["c2-retraso"] + 0.4, "hombros"]], espejo: true, fase: 3 });
        T("s2-mv", 1080, 1440, { s: 0.8 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c2-retraso"]]); } },

    // 3 · El comandante (avión): «Nada raro: este año, uno de cada diez vuelos se retrasa por eso. En 2016, uno de cada cuarenta.»
    { n: 3, set: "vacio",
      svg: `${panel(250, 790, 580, 450)}${[0, 1].map((i) => `<g id="s3-g${i}" transform="translate(0 ${872 + i * 190})">${rot(300, -26, ["2016", "2026"][i], 28, C.gris, "", "start")}
          <g id="s3-v${i}">${rot(800, -26, es(D.pct[i]) + " %", 30, i ? HOY : ANTES_T, "", "end")}</g>
          ${Array.from({ length: 40 }, (_, k) => `<g transform="translate(${328 + (k % 10) * 50} ${16 + Math.floor(k / 10) * 36}) scale(.52)">${avioncito(`s3-a${i}-${k}`)}</g>`).join("")}</g>`).join("")}
        ${rot(560, 1228, "VUELOS CON RETRASO POR EL CONTROL AÉREO", 17, C.gris)}${gente("s3", "cv", { c: TELEFONILLO })}`,
      tarjeta: tarjeta(3, "Vuelos retrasados por el control del tráfico aéreo, de enero a octubre", `${vs(3, D.pct.map((v) => es(v) + "&nbsp;%"), ["en 2016", "en 2026"])}
        <div class="nota">Espacio aéreo español. Retraso por las regulaciones del tráfico en ruta (ATFM). El mismo periodo de cada año</div>`, { fuente: F_ATFM, icono: bandera(44) }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("avion", null, t, 0);
        // 2026 al decir «diez» (cuatro de cuarenta, en rojo); 2016 con «2016» (uno de cuarenta, con «cuarenta»).
        const ap = [c["c3-2016"] - 0.2, c["c3-diez"] - 0.5], rojo = [c["c3-cuarenta"], c["c3-diez"]], malos = [[17], [3, 14, 26, 37]];
        for (let i = 0; i < 2; i++) {
          css(`s3-g${i}`, "opacity", clamp((t - ap[i]) / 0.25));
          for (let k = 0; k < 40; k++) {
            const t0 = ap[i] + k * 0.012;
            css(`s3-a${i}-${k}`, "opacity", clamp((t - t0) * 6));
            attr(`s3-a${i}-${k}-p`, "fill", malos[i].includes(k) && t > rojo[i] ? "#D86B5B" : "#9AA6AE");
          }
          css(`s3-v${i}`, "opacity", clamp((t - rojo[i]) / 0.3));
        }
        sube("c3-b", t, c["c3-diez"]); sube("c3-a", t, c["c3-cuarenta"]);
        persona("s3-c", t, { x: 170, y: 1440, s: 0.8, mira: 1, vivo: true, charla: e, boca: habla(t, e, "seria"), brazo: [[0, "abajo"], [c["c3-diez"] - 0.3, "senala"], [c["c3-cuarenta"], "hombros"]], fase: 1 });
        persona("s3-v", t, { x: 960, y: 1440, s: 0.8, mira: -1, vivo: true, boca: [[0, "seria"], [c["c3-diez"] + 0.2, "o"]], ojos: [[0, "normal"], [c["c3-diez"] + 0.2, "grandes"]], brazo: [[0, "abajo"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c3-diez"], e.c["c3-cuarenta"]]); } },

    // 4 · La viajera (avión): «Ya, pero es que ahora vuela más gente.»
    { n: 4, set: "vacio",
      svg: gente("s4", "cv", { c: TELEFONILLO }),
      tarjeta: tarjeta(4, "La viajera", `<div class="tit">«Ahora vuela <mark id="m4">más gente</mark>»</div>`, { tono: "hoy" }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("avion", null, t, 0);
        marca("m4", t, c["c4-gente"]);
        persona("s4-c", t, { x: 180, y: 1440, s: 0.8, mira: 1, vivo: true, boca: [[0, "seria"]], brazo: [[0, "abajo"], [c["c4-gente"], "piensa"]], incl: [[0, 0], [c["c4-gente"], 6]], fase: 1 });
        persona("s4-v", t, { x: 880, y: 1440, s: 0.8, mira: -1, vivo: true, charla: e, boca: habla(t, e, "seria"), brazo: [[0, "abajo"], [c["c4-gente"] - 0.3, "hombros"]], incl: [[0, 0], [c["c4-gente"], -6]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c4-gente"]], { acerca: 0.07 }); } },

    // 5 · El comandante (avión): «Hay un 36 % más de vuelos, sí. Pero retrasados, más de cinco veces más.»
    { n: 5, set: "vacio",
      svg: `${panel(230, 830, 630, 400)}<g id="s5-mas" transform="translate(540 900)"><rect x="-190" y="-34" width="380" height="64" rx="32" fill="#E8EEF2"/>${rot(0, 12, "VUELOS: +" + Math.round(D.masVuelos) + " %", 30, "#3F6672")}</g>
        ${D.ret.map((v, i) => { const n = Math.round(v / 10000); return `<g transform="translate(0 ${1010 + i * 125})">${rot(392, 10, ["2016", "2026"][i], 26, C.gris, "", "end")}
          ${Array.from({ length: n }, (_, k) => `<g transform="translate(${418 + k * 20.5} 0) rotate(90) scale(.46)">${avioncito(`s5-a${i}-${k}`)}</g>`).join("")}
          <g id="s5-v${i}">${rot(404, -32, miles(v), 26, i ? HOY : ANTES_T, "", "start")}</g></g>`; }).join("")}
        ${rot(545, 1212, "CADA AVIÓN, 10.000 VUELOS RETRASADOS", 18, C.gris)}${gente("s5", "cv", { c: TELEFONILLO })}`,
      tarjeta: tarjeta(5, "Vuelos retrasados por el control del tráfico aéreo, de enero a octubre", `${vs(5, D.ret.map(miles), ["en 2016", "en 2026"], 66)}
        <div class="nota">Vuelos en el espacio aéreo español: un ${Math.round(D.masVuelos)}&nbsp;% más que en 2016</div>`, { fuente: F_ATFM, icono: bandera(44) }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("avion", null, t, 0);
        pop("s5-mas", t, c["c5-36"] - 0.1, 540, 900);
        const tt = [c["c5-retrasados"] - 0.1, c["c5-cinco"] - 0.4];
        for (let i = 0; i < 2; i++) {
          const n = Math.round(D.ret[i] / 10000);
          for (let k = 0; k < n; k++) {
            const t0 = tt[i] + k * 0.05;
            css(`s5-a${i}-${k}`, "opacity", clamp((t - t0) * 6));
            attr(`s5-a${i}-${k}-p`, "fill", i ? "#D86B5B" : "#C8902E");
          }
          css(`s5-v${i}`, "opacity", clamp((t - tt[i] - n * 0.05) / 0.3));
        }
        sube("c5-a", t, tt[0]); sube("c5-b", t, c["c5-cinco"]);
        persona("s5-c", t, { x: 165, y: 1440, s: 0.8, mira: 1, vivo: true, charla: e, boca: habla(t, e, "seria"), brazo: [[0, "abajo"], [c["c5-36"] - 0.2, "hombros"], [c["c5-retrasados"], "senala"]], fase: 1 });
        persona("s5-v", t, { x: 965, y: 1440, s: 0.8, mira: -1, vivo: true, boca: [[0, "seria"], [c["c5-cinco"] + 0.3, "o"]], ojos: [[0, "normal"], [c["c5-cinco"] + 0.3, "grandes"]], brazo: [[0, "abajo"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c5-36"], e.c["c5-cinco"]]); } },

    // 6 · La viajera (avión), con sorna: «¡Más de cinco veces! Eso no lo suben ni los impuestos. Me voy en tren.»
    { n: 6, set: "vacio",
      svg: `${gente("s6", "c", { c: TELEFONILLO })}${maleta("s6-mv", "#C77B5B")}${gente("s6", "v")}`,
      tarjeta: tarjeta(6, "La viajera", `<div class="tit">«Eso no lo suben ni los <mark id="m6">impuestos</mark>»</div>`, { tono: "hoy" }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("avion", null, t, 0);
        marca("m6", t, c["c6-impuestos"]);
        persona("s6-c", t, { x: 180, y: 1440, s: 0.8, mira: 1, vivo: true, boca: [[0, "seria"], [c["c6-tren"] + 0.2, "o"]], ojos: [[0, "normal"], [c["c6-tren"] + 0.2, "grandes"]], brazo: [[0, "piensa"], [c["c6-impuestos"], "hombros"]], fase: 1 });
        const v = ruta(t, [[c["c6-tren"] + 0.1, 760], [c["c6-tren"] + 1.6, 1500]]);
        persona("s6-v", t, { x: v.x, y: 1440, s: 0.8, anda: v.anda, mira: [[0, -1], [c["c6-tren"], 1]], vivo: true, charla: e, salta: c["c6-cinco"] - 0.1, boca: habla(t, e, "grande"), ojos: [[0, "grandes"], [c["c6-impuestos"], "felices"]],
          brazo: [[0, "abajo"], [c["c6-cinco"] - 0.2, "arriba"], [c["c6-impuestos"], "hombros"], [c["c6-tren"] - 0.2, "abajo"]], espejo: v.x < 700 || t < c["c6-tren"], fase: 2 });
        T("s6-mv", v.x + (t < c["c6-tren"] ? 150 : -150), 1440, { s: 0.8 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c6-cinco"], e.c["c6-impuestos"]], { acerca: 0.07 }); } },

    // 7 · El maquinista (andén): «Súbase. En la alta velocidad, llegan en hora 86 de cada 100. En 2019, 95.»
    { n: 7, set: "vacio",
      svg: `${panel(250, 840, 580, 390)}${[0, 1].map((i) => `<g id="s7-g${i}" transform="translate(0 ${930 + i * 160})">${rot(300, -24, ["2019", "2024"][i], 28, C.gris, "", "start")}
          <g id="s7-v${i}">${rot(800, -24, es(D.comp[i]) + " % EN HORA", 26, i ? HOY : ANTES_T, "", "end")}</g>
          ${Array.from({ length: 20 }, (_, k) => `<g transform="translate(${334 + (k % 10) * 50} ${16 + Math.floor(k / 10) * 46}) scale(.62)">${trenecito(`s7-t${i}-${k}`)}</g>`).join("")}</g>`).join("")}
        ${rot(570, 1214, "ROJO: LLEGA TARDE (MÁS DE 5 MINUTOS)", 17, C.gris)}${gente("s7", "m")}${maleta("s7-mv", "#C77B5B")}${gente("s7", "v")}`,
      tarjeta: tarjeta(7, "Trenes de alta velocidad que llegan en hora (menos de 5 minutos tarde), rutas con más trenes", `${vs(7, D.comp.map((v) => es(v) + "&nbsp;%"), ["en 2019", "en 2024"])}
        <div class="nota">Madrid con Barcelona, Valencia, Sevilla, Málaga y Alicante. La CNMC no da la serie desde 2016</div>`, { fuente: F_CNMC, icono: bandera(44) }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("anden", "avion", t, e.t0);
        const ap = [c["c7-2019"] - 0.2, c["c7-86"] - 0.5], rojo = [c["c7-95"], c["c7-86"] + 0.1], malos = [[13], [4, 11, 17]];
        for (let i = 0; i < 2; i++) {
          css(`s7-g${i}`, "opacity", clamp((t - ap[i]) / 0.25));
          for (let k = 0; k < 20; k++) {
            css(`s7-t${i}-${k}`, "opacity", clamp((t - ap[i] - k * 0.02) * 6));
            attr(`s7-t${i}-${k}-p`, "fill", malos[i].includes(k) && t > rojo[i] ? "#D86B5B" : "#7FA4B0");
          }
          css(`s7-v${i}`, "opacity", clamp((t - rojo[i]) / 0.3));
        }
        sube("c7-b", t, c["c7-86"]); sube("c7-a", t, c["c7-95"]);
        persona("s7-m", t, { x: 180, y: 1440, s: 0.8, mira: 1, vivo: true, charla: e, boca: habla(t, e, "seria"), brazo: [[0, "saluda"], [c["c7-86"] - 0.3, "senala"], [c["c7-95"], "hombros"]], fase: 1 });
        const v = ruta(t, [[e.t0 + 0.2, 1350], [e.t0 + 1.6, 960]]);
        persona("s7-v", t, { x: v.x, y: 1440, s: 0.8, anda: v.anda, mira: -1, vivo: true, boca: [[0, "seria"], [c["c7-86"] + 0.2, "o"]], brazo: [[0, "abajo"]], espejo: true, fase: 2 });
        T("s7-mv", v.x + 150, 1440, { s: 0.8 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c7-86"], e.c["c7-95"]]); } },

    // 8 · El maquinista (andén): «Y hacia Galicia o Asturias, poco más de la mitad. En 2019, tres de cada cuatro.»
    { n: 8, set: "vacio",
      svg: `${panel(250, 800, 580, 440)}${[0, 1].map((i) => `<g id="s8-g${i}" transform="translate(${400 + i * 280} 985)">${relojAnden(`s8-r${i}`, 100)}
          ${rot(0, 152, ["2019", "2024"][i], 28, C.gris)}<g id="s8-v${i}">${rot(0, 190, es(D.ancho[i], i ? 0 : 1) + " % EN HORA", 24, i ? HOY : ANTES_T)}</g></g>`).join("")}
        ${rot(570, 1228, "HACIA GALICIA, ASTURIAS Y CANTABRIA", 17, C.gris)}${gente("s8", "m")}${maleta("s8-mv", "#C77B5B")}${gente("s8", "v")}`,
      tarjeta: tarjeta(8, "Trenes que llegan en hora, rutas de larga distancia de ancho variable", `${vs(8, D.ancho.map((v, i) => es(v, i ? 0 : 1) + "&nbsp;%"), ["en 2019", "en 2024"])}
        <div class="nota">Madrid con Galicia, Asturias, Cantabria, Huelva y Cádiz, y Barcelona-Valencia</div>`, { fuente: F_CNMC, icono: bandera(44) }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("anden", null, t, 0);
        const tt = [c["c8-cuatro"] - 0.5, c["c8-mitad"] - 0.6], R = 100;
        const sector = (a0, a1) => {
          if (a1 - a0 < 0.002) return "";
          const p = (a) => [(R * Math.sin(a * 2 * Math.PI)).toFixed(1), (-R * Math.cos(a * 2 * Math.PI)).toFixed(1)];
          const [x0, y0] = p(a0), [x1, y1] = p(a1);
          return `M0 0 L${x0} ${y0} A${R} ${R} 0 ${a1 - a0 > 0.5 ? 1 : 0} 1 ${x1} ${y1} Z`;
        };
        for (let i = 0; i < 2; i++) {
          const f = D.ancho[i] / 100, k = suave((t - tt[i]) / 1.0);
          css(`s8-g${i}`, "opacity", clamp((t - tt[i] + 0.3) / 0.25));
          attr(`s8-r${i}-v`, "d", sector(0, f * k)); attr(`s8-r${i}-r`, "d", k > 0.02 ? sector(f * k, f * k + (1 - f) * k) : "");
          attr(`s8-r${i}-ag`, "transform", `rotate(${(360 * k).toFixed(1)})`);
          css(`s8-v${i}`, "opacity", clamp((t - tt[i] - 0.9) / 0.3));
        }
        sube("c8-b", t, c["c8-mitad"]); sube("c8-a", t, c["c8-cuatro"]);
        persona("s8-m", t, { x: 175, y: 1440, s: 0.8, mira: 1, vivo: true, charla: e, boca: habla(t, e, "seria"), brazo: [[0, "abajo"], [c["c8-mitad"] - 0.5, "senala"], [c["c8-cuatro"], "hombros"]], fase: 1 });
        persona("s8-v", t, { x: 960, y: 1440, s: 0.8, mira: -1, vivo: true, boca: [[0, "seria"], [c["c8-mitad"] + 0.2, "o"]], ojos: [[0, "normal"], [c["c8-mitad"] + 0.2, "grandes"]], brazo: [[0, "abajo"]], espejo: true, fase: 2 });
        T("s8-mv", 1110, 1440, { s: 0.8 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c8-mitad"], e.c["c8-cuatro"]]); } },

    // 9 · La viajera (andén), con sorna: «O sea, que el horario es orientativo.»
    { n: 9, set: "vacio",
      svg: `${LLEGADAS}${gente("s9", "m")}${maleta("s9-mv", "#C77B5B")}${gente("s9", "v")}`,
      tarjeta: tarjeta(9, "La viajera", `<div class="tit">«El horario es <mark id="m9">orientativo</mark>»</div>`, { tono: "hoy" }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("anden", null, t, 0);
        marca("m9", t, c["c9-orientativo"]);
        for (let i = 0; i < 4; i++) {
          const kf = clamp((t - (e.t0 + 0.4 + i * 0.38)) / 0.3);
          css(`s9-a${i}`, "opacity", kf < 0.5 ? 1 : 0); css(`s9-b${i}`, "opacity", kf < 0.5 ? 0 : 1);
          attr(`s9-f${i}`, "transform", `scale(1 ${Math.max(0.04, Math.abs(Math.cos(kf * Math.PI))).toFixed(3)})`);
        }
        persona("s9-m", t, { x: 180, y: 1440, s: 0.8, mira: 1, vivo: true, boca: [[0, "seria"]], ojos: [[0, "normal"], [c["c9-orientativo"], "felices"]], brazo: [[0, "abajo"], [c["c9-orientativo"] - 0.2, "piensa"]], incl: [[0, 0], [c["c9-orientativo"], 8]], fase: 1 });
        persona("s9-v", t, { x: 900, y: 1440, s: 0.8, mira: [[0, -1], [c["c9-orientativo"], 0]], vivo: true, charla: e, boca: habla(t, e, "sonrisa"), ojos: [[0, "normal"], [c["c9-orientativo"], "felices"]], brazo: [[0, "abajo"], [c["c9-orientativo"] - 0.3, "hombros"]], espejo: true, fase: 2 });
        T("s9-mv", 1050, 1440, { s: 0.8 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c9-orientativo"]], { acerca: 0.07 }); } },

    // 10 · La viajera (peaje), dentro del coche: «Pues en coche. ¡Y eso que pagamos más que nunca!»
    { n: 10, set: "vacio",
      svg: `<clipPath id="s10-clip"><rect x="-700" y="-400" width="2600" height="1792"/></clipPath><g clip-path="url(#s10-clip)">${gente("s10", "v")}</g>${coche("s10-co", "#E0B04A")}<g transform="translate(1000 1440) scale(-1 1)">${barrera("s10-ba")}</g>
        ${Array.from({ length: 5 }, (_, k) => `<circle id="s10-h${k}" r="${18 + k * 6}" fill="#C9CED3" opacity="0"/>`).join("")}`,
      tarjeta: tarjeta(10, "La viajera", `<div class="tit">«¡Y pagamos <mark id="m10">más que nunca</mark>!»</div>`, { tono: "hoy" }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("peaje", "anden", t, e.t0);
        marca("m10", t, c["c10-nunca"]);
        const a = ruta(t, [[e.t0 + 0.1, -520], [e.t0 + 1.5, 330]]), gira = (a.x + 520) * 0.9;
        T("s10-co", a.x, 1440, { s: 1 });
        attr("s10-co-r0", "transform", `translate(-150 -40) rotate(${gira.toFixed(1)})`); attr("s10-co-r1", "transform", `translate(150 -40) rotate(${gira.toFixed(1)})`);
        // Humo del tubo de escape mientras llega.
        for (let k = 0; k < 5; k++) { const kk = ((t * 1.6 + k * 0.2) % 1); T(`s10-h${k}`, a.x - 270 - kk * 90, 1400 - kk * 40, { s: 0.6 + kk, op: a.anda ? (0.5 * (1 - kk)).toFixed(2) : 0 }); }
        persona("s10-v", t, { x: a.x + 105, y: 1440, s: 0.38, mira: [[0, 1], [c["c10-nunca"] - 0.4, 0]], vivo: true, charla: e, boca: habla(t, e, "grande"), ojos: [[0, "normal"], [c["c10-nunca"], "grandes"]], brazo: [[0, "abajo"]], fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c10-nunca"]], { acerca: 0.07 }); } },

    // 11 · La viajera (peaje, fuera del coche): «Se recauda un 25 % más por habitante que en 2016, ya sin inflación. Récord.»
    { n: 11, set: "vacio",
      svg: `${coche("s11-co", "#E0B04A")}<g transform="translate(1000 1440) scale(-1 1)">${barrera("s11-ba")}</g>
        ${panel(280, 790, 520, 430)}${D.impuestos.map((v, i) => { const n = Math.round(v / 750); return `<g transform="translate(${430 + i * 220} 1120)">${Array.from({ length: n }, (_, k) => `<g id="s11-b${i}-${k}" transform="translate(0 ${-k * 15}) scale(.62)">${billete(`s11-bb${i}${k}`)}</g>`).join("")}
          <g id="s11-v${i}">${rot(0, -n * 15 - 40, miles(v) + " €", 28, i ? HOY : ANTES_T)}</g>${rot(0, 62, ["2016", "2025"][i], 30, C.gris)}</g>`; }).join("")}
        <g id="s11-rec"><rect x="-130" y="-46" width="260" height="92" rx="12" fill="none" stroke="${HOY}" stroke-width="9"/>${rot(0, 20, "RÉCORD", 56, HOY)}</g>
        ${rot(540, 1206, "IMPUESTOS Y COTIZACIONES POR HABITANTE, EN EUROS DE HOY", 17, C.gris)}${gente("s11", "v")}`,
      tarjeta: tarjeta(11, "Impuestos y cotizaciones por habitante, en euros de 2025", `${vs(11, D.impuestos.map((v) => miles(v) + "&nbsp;€"), ["en 2016", "en 2025"], 66)}
        <div class="nota">La recaudación más alta de la serie, también descontada la inflación</div>`, { fuente: F_IMP, icono: bandera(44) }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("peaje", null, t, 0);
        T("s11-co", 330, 1440, { s: 1 });
        const tt = [c["c11-25"] - 0.3, c["c11-25"] + 0.2];
        for (let i = 0; i < 2; i++) {
          const n = Math.round(D.impuestos[i] / 750);
          for (let k = 0; k < n; k++) {
            const t0 = tt[i] + k * 0.04, kk = (t - t0) / 0.22;
            if (kk < 0) { ver(`s11-b${i}-${k}`, false); continue; }
            ver(`s11-b${i}-${k}`, true);
            attr(`s11-b${i}-${k}`, "transform", `translate(0 ${(-k * 15 - 110 * (1 - fuera(kk))).toFixed(1)}) scale(.62)`);
          }
          css(`s11-v${i}`, "opacity", clamp((t - tt[i] - n * 0.04) / 0.3));
        }
        pop("s11-rec", t, c["c11-record"] - 0.05, 650, 1000, { s: 1, r: -10, d: 0.25 });
        sube("c11-a", t, tt[0]); sube("c11-b", t, tt[1]);
        persona("s11-v", t, { x: 940, y: 1440, s: 0.8, mira: -1, vivo: true, charla: e, boca: habla(t, e, "seria"), brazo: [[0, "abajo"], [c["c11-25"] - 0.2, "senala"], [c["c11-record"], "arriba"]], espejo: true, fase: 1 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c11-25"], e.c["c11-record"]]); } },

    // 12 · La viajera (peaje): «Y en transporte se gasta un 38 % más por habitante. En vías de tren, el doble.»
    { n: 12, set: "vacio",
      svg: `${coche("s12-co", "#E0B04A")}<g transform="translate(1000 1440) scale(-1 1)">${barrera("s12-ba")}</g>
        ${panel(250, 800, 600, 425)}${D.gasto.map((v, i) => { const n = Math.round(v / 50); return `<g transform="translate(0 ${995 + i * 140})">${rot(300, -62, ["2016", "2024"][i], 26, C.gris, "", "start")}
          ${Array.from({ length: n }, (_, k) => `<g transform="translate(${330 + k * 42} 0) scale(.5)">${traviesa(`s12-t${i}-${k}`)}</g>`).join("")}
          <rect id="s12-ra${i}" x="314" y="-22" width="0" height="8" rx="4" fill="#5B6470"/><rect id="s12-rb${i}" x="314" y="14" width="0" height="8" rx="4" fill="#5B6470"/>
          <g id="s12-v${i}">${rot(820, -62, miles(v) + " €", 28, i ? HOY : ANTES_T, "", "end")}</g></g>`; }).join("")}
        <g id="s12-dob"><rect x="-150" y="-30" width="300" height="60" rx="30" fill="#E8EEF2"/>${rot(0, 11, "VÍAS DE TREN: EL DOBLE", 22, "#3F6672")}</g>
        ${rot(550, 1206, "GASTO PÚBLICO EN TRANSPORTE POR HABITANTE", 18, C.gris)}${gente("s12", "v")}`,
      tarjeta: tarjeta(12, "Gasto público en transporte por habitante, en euros de 2025", `${vs(12, D.gasto.map((v) => miles(v) + "&nbsp;€"), ["en 2016", "en 2024"], 66)}
        <div class="nota">Inversión en vías de tren: de ${miles(D.vias[0])} a ${miles(D.vias[1])} millones de euros de 2025. 2024, último año</div>`, { fuente: F_GAS, icono: bandera(44) }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("peaje", null, t, 0);
        T("s12-co", 330, 1440, { s: 1 });
        const tt = [c["c12-38"] - 0.4, c["c12-38"] + 0.1];
        for (let i = 0; i < 2; i++) {
          const n = Math.round(D.gasto[i] / 50);
          for (let k = 0; k < n; k++) { const t0 = tt[i] + k * 0.06; if (t < t0) { ver(`s12-t${i}-${k}`, false); continue; } ver(`s12-t${i}-${k}`, true); css(`s12-t${i}-${k}`, "opacity", clamp((t - t0) * 6)); }
          const w = Math.max(0, Math.min(n, (t - tt[i]) / 0.06)) * 42;
          attr(`s12-ra${i}`, "width", w.toFixed(1)); attr(`s12-rb${i}`, "width", w.toFixed(1));
          css(`s12-v${i}`, "opacity", clamp((t - tt[i] - n * 0.06) / 0.3));
        }
        pop("s12-dob", t, c["c12-doble"] - 0.1, 550, 856);
        sube("c12-a", t, tt[0]); sube("c12-b", t, tt[1]);
        persona("s12-v", t, { x: 950, y: 1440, s: 0.8, mira: -1, vivo: true, charla: e, boca: habla(t, e, "seria"), brazo: [[0, "abajo"], [c["c12-38"] - 0.2, "senala"], [c["c12-doble"], "hombros"]], espejo: true, fase: 1 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c12-38"], e.c["c12-doble"]]); } },

    // 13 · La viajera, a cámara (peaje): «Pagamos más, se gasta más… y llegamos más tarde. ¿Nos tenemos que conformar? ¿Tú qué opinas?»
    { n: 13, set: "vacio",
      svg: `<g id="s13-bal" transform="translate(360 1300) scale(.75)">${balanza("s13-b", ["LO QUE PAGAS", `${[0, 1, 2].map((k) => `<g transform="translate(${(k - 1) * 46} ${-20 - k * 6}) scale(.5)">${billete("s13-bi" + k)}</g>`).join("")}`],
          ["LO QUE RECIBES", `<g transform="translate(0 -44)">${reloj("s13-re", 40, "#D86B5B")}</g>`])}</g>
        ${gente("s13", "v")}`,
      tarjeta: tarjeta(13, "Te toca", `<div class="tit" style="font-size:58px">Pagamos más y llegamos más tarde. ¿Nos tenemos que <mark id="m13">conformar</mark>?</div><div class="sub" id="c13-sub">¿Tú qué opinas? Te leo en los comentarios.</div>`),
      fn: function (t, e) {
        const c = e.c;
        ambiente("peaje", null, t, 0);
        const a = -14 * rebote(clamp((t - c["c13-tarde"]) / 0.6)) + 1.5 * Math.sin(t * 3) * (t > c["c13-tarde"] ? 1 : 0), r = a * Math.PI / 180;
        attr("s13-b-b", "transform", `rotate(${a.toFixed(2)} 0 -420)`);
        T("s13-b-pi", -300 * Math.cos(r), -420 - 300 * Math.sin(r) + 150, {}); T("s13-b-pd", 300 * Math.cos(r), -420 + 300 * Math.sin(r) + 150, {});
        attr("s13-re-m", "transform", `rotate(${(t * 240).toFixed(1)})`);
        marca("m13", t, c["c13-conformar"]); sube("c13-sub", t, c["c13-tu"] - 0.2);
        persona("s13-v", t, { x: 900, y: 1440, s: 0.8, mira: [[0, -1], [c["c13-conformar"], 0]], vivo: true, charla: e, boca: habla(t, e, "seria"),
          brazo: [[0, "abajo"], [c["c13-pagamos"], "senala"], [c["c13-tu"], "hombros"]], incl: [[0, 0], [c["c13-conformar"], -6], [c["c13-tu"], 0]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c13-tarde"], e.c["c13-conformar"]]); } },
  ];
}
