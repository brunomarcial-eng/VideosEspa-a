// Escenas de T9, versión 2 («¿Se vive mejor que hace 10 años?») en estilo «limpio». Solo 2016 frente a hoy (Bruno, 20-11-2026).
// Dos amigos de 35 años, personajes nuevos con volumen y vivos (respiran, asienten y gesticulan al hablar, saltan):
//   · «quedo»: se independizó en 2016 (jersey verde, piel clara).
//   · «vuelve»: vuelve con la maleta tras 10 años fuera (chaqueta mostaza, piel algo más morena).
// Todo se cuenta en tiempo de trabajo. Decorados como en un sueño: bar → calle → gasolinera → salón → súper → oficina → bar.
/* eslint-disable no-undef */

import { C, persona, bocadillo, tarjeta, carro, nomina } from "../../diseno/limpio.mjs";
import { bandera } from "../../diseno/barrio.mjs";
import { ambientes, bloque } from "../../diseno/sueno.mjs";
import { DECORADOS_T8 } from "../../diseno/tiendas.mjs";
import { billete } from "../../diseno/casa.mjs";
import { calendario, filaRelojes, anyoIcono, bombilla, boton, maleta } from "../../diseno/horas.mjs";

export const ESTILO = "limpio";
const F_SUE = "Cálculo propio · INE (sueldo medio e IPC) · OCDE (sueldo neto del trabajador medio)";
const F_PISO = "Cálculo propio · Banco de España (valor tasado) · INE (sueldo medio) · OCDE (sueldo neto)";
const F_GAS = "Dato oficial: Comisión Europea (boletín petrolero) · cálculo propio con el sueldo medio del INE y la OCDE";
const F_LUZ = "Dato oficial: Eurostat (luz de los hogares) · cálculo propio con el sueldo medio del INE y la OCDE";
const F_COM = "Cálculo propio · INE (presupuestos familiares, IPC de alimentos y sueldo medio) · OCDE";
const F_EST = "Dato oficial: OCDE (Taxing Wages: IRPF y cotizaciones del trabajador medio)";

export function datos(d) {
  const z = d.diez_anos;
  return {
    neto: [z.neto_anual_2016_en_euros_de_2026, z.neto_anual_eur["2026"]], netoSube: z.neto_real_sube_pct,
    piso: [z.piso_anos["2016"], z.piso_anos["2026"]], deposito: [z.deposito_horas["2016"], z.deposito_horas["2026"]],
    luz: [z.luz_horas_ano["2016"], z.luz_horas_ano["2025"]], compra: [z.compra_horas["2016"], z.compra_horas["2026"]],
    estado: [z.estado["2016"], z.estado["2025"]],
  };
}

export const capas = () => ambientes(DECORADOS_T8);

// ------------------------------------------------------------------ personajes nuevos (inventados), con volumen
const QUEDO = { pelo: "corto", canas: false, barba: false, colorPelo: "#6B4A32", ropa: ["#7C9A7E", "#5F7F62"], piel: "#F1C9A5", volumen: true };
const VUELVE = { pelo: "corto", canas: false, barba: false, colorPelo: "#2A1E16", ropa: ["#D9A75A", "#B8863A"], piel: "#DCA883", volumen: true };
const dos = (p, mq = "", mv = "") => `${persona(p + "-q", "hoy", { ...QUEDO, mano: mq ? `<g id="${p}-mq">${mq}</g>` : undefined })}${persona(p + "-v", "hoy", { ...VUELVE, mano: mv ? `<g id="${p}-mv">${mv}</g>` : undefined })}`;
const vs = (n, vals, labs, tam = 72) => `<div class="vs">${vals.map((v, i) => `<div class="col"><div class="v ${i ? "t-hoy" : "t-pasado"}" id="c${n}-${"ab"[i]}" style="font-size:${tam}px">${v}</div><div class="n">${labs[i]}</div></div>`).join("")}</div>`;
const panel = (x, y, w, h) => `<rect x="${x + 8}" y="${y + 12}" width="${w}" height="${h}" rx="26" fill="#3C2814" opacity=".10"/><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="26" fill="#FFFDF8" opacity=".96"/>`;
const rot = (x, y, t, tam, color, id = "", ancla = "middle") => `<text ${id ? `id="${id}"` : ""} x="${x}" y="${y}" text-anchor="${ancla}" font-family="Cap" font-weight="800" font-size="${tam}" fill="${color}">${t}</text>`;
const MANGUERA = `<g transform="rotate(20)"><rect x="-8" y="-6" width="16" height="44" rx="6" fill="${C.tinta}"/><path d="M0 -6 L28 -28" stroke="${C.tinta}" stroke-width="10" stroke-linecap="round"/></g>`;
const NOMINA_MANO = `<g transform="translate(10 -50) scale(.6)">${nomina("nm")}</g>`;
const es = (v, d = 1) => v.toFixed(d).replace(".", ",");
const miles = (v) => Math.round(v).toLocaleString("es-ES").replace(/,/g, ".");
const ORO = "#D9A75A", ORO_T = "#8A6316";

// Dos filas de relojes (2016 y hoy): tantos relojes como horas; el último se llena a medias.
const filas = (p, vals, labs, o) => `${vals.map((v, i) => `<g transform="translate(${o.x0} ${o.y0 + i * o.dy})">${rot(-24, 12, labs[i], 28, C.gris, "", "end")}
    ${filaRelojes(`${p}-f${i}`, Math.ceil(v), o.r, o.paso, i ? C.azul : ORO)}
    <g id="${p}-v${i}">${rot(o.xv, 12, es(v) + " h", 32, i ? C.azul : ORO_T, "", "end")}</g></g>`).join("")}`;

export function escenas(D) {
  return [
    // 1 · El que se quedó (bar): «¡Diez años fuera! ¿Vuelves para quedarte?»
    { n: 1, set: "vacio",
      svg: `<g id="s1-mal">${maleta("s1-m")}</g>${dos("s1")}`,
      tarjeta: tarjeta(1, "Dos amigos · 10 años después", `<div class="tit" style="font-size:68px">¿Se vive <mark id="m1">mejor</mark> que hace 10 años?</div>`, { icono: bandera(44) }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("bar", null, t, 0);
        // El que vuelve entra por la derecha arrastrando la maleta.
        const v = ruta(t, [[0.1, 1250], [1.6, 860]]);
        T("s1-mal", v.x + 150, 1440, { s: 0.8, r: v.anda ? -14 : -6 });
        marca("m1", t, c["c1-quedarte"]);
        persona("s1-q", t, { x: 210, y: 1440, s: 0.8, mira: 1, vivo: true, charla: e, salta: c["c1-anos"] - 0.2, boca: habla(t, e, "sonrisa"), ojos: [[0, "felices"], [c["c1-quedarte"], "normal"]],
          brazo: [[0, "saluda"], [c["c1-quedarte"], "senala"]], fase: 1 });
        persona("s1-v", t, { x: v.x, y: 1440, s: 0.8, anda: v.anda, mira: -1, vivo: true, boca: "sonrisa", ojos: [[0, "normal"], [1.7, "felices"]],
          brazo: [[0, "empuja"], [1.6, "saluda"], [c["c1-quedarte"] + 0.4, "abajo"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c1-anos"]]); } },

    // 2 · El que vuelve (bar): «Si me llega el sueldo… Tú lo tuviste más fácil: te independizaste en 2016.»
    { n: 2, set: "vacio",
      svg: `<g id="s2-mal" transform="translate(1010 1440) scale(.8) rotate(-6)">${maleta("s2-m")}</g>${dos("s2")}`,
      tarjeta: tarjeta(2, "El que vuelve", `<div class="tit">«Tú lo tuviste <mark id="m2">más fácil</mark>»</div>`, { tono: "hoy" }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("bar", null, t, 0);
        marca("m2", t, c["c2-facil"]);
        persona("s2-q", t, { x: 210, y: 1440, s: 0.8, mira: 1, vivo: true, boca: [[0, "sonrisa"], [c["c2-facil"], "o"]], ojos: [[0, "normal"], [c["c2-facil"], "grandes"]],
          brazo: [[0, "abajo"], [c["c2-facil"] + 0.3, "piensa"]], incl: [[0, 0], [c["c2-facil"], 6]], fase: 1 });
        persona("s2-v", t, { x: 860, y: 1440, s: 0.8, mira: -1, vivo: true, charla: e, boca: habla(t, e, "seria"),
          brazo: [[0, "hombros"], [c["c2-facil"] - 0.4, "senala"]], incl: [[0, 0], [c["c2-facil"], -5]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c2-facil"]]); } },

    // 3 · El que se quedó (bar): «¿Más fácil? ¡Si hoy se cobra más!»
    { n: 3, set: "vacio",
      svg: `<g id="s3-mal" transform="translate(1010 1440) scale(.8) rotate(-6)">${maleta("s3-m")}</g>${dos("s3", NOMINA_MANO)}`,
      tarjeta: tarjeta(3, "El que se quedó", `<div class="tit">«¡Hoy se <mark id="m3">cobra más</mark>!»</div>`, { tono: "pasado" }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("bar", null, t, 0);
        marca("m3", t, c["c3-cobra"]);
        ver("s3-mq", t > c["c3-cobra"] - 0.3);
        persona("s3-q", t, { x: 230, y: 1440, s: 0.8, mira: 1, vivo: true, charla: e, salta: c["c3-cobra"] - 0.1, boca: habla(t, e, "sonrisa"),
          brazo: [[0, "hombros"], [c["c3-cobra"] - 0.3, "arriba"]], fase: 1 });
        persona("s3-v", t, { x: 860, y: 1440, s: 0.8, mira: -1, vivo: true, boca: [[0, "seria"], [c["c3-cobra"] + 0.3, "sonrisa"]], brazo: [[0, "abajo"], [c["c3-cobra"] + 0.5, "piensa"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c3-cobra"]]); } },

    // 4 · El que vuelve (bar): «Un 2 % más que en 2016, ya descontada la inflación. Vamos a contarlo en horas de trabajo.»
    { n: 4, set: "vacio",
      svg: `${panel(330, 800, 420, 420)}${D.neto.map((v, i) => `<g transform="translate(${450 + i * 180} 1120)">${Array.from({ length: Math.round(v / 1500) }, (_, k) => `<g id="s4-f${i}-${k}" transform="translate(0 ${-k * 15}) scale(.62)">${billete("s4-bb" + i + k)}</g>`).join("")}
        <g id="s4-v${i}">${rot(0, -Math.round(v / 1500) * 15 - 40, miles(v) + " €", 26, i ? C.azul : ORO_T)}</g>${rot(0, 58, ["2016", "2026"][i], 30, C.gris)}</g>`).join("")}
        ${rot(540, 1206, "LIMPIO AL AÑO, EN EUROS DE HOY", 19, C.gris)}<g id="s4-mal" transform="translate(1010 1440) scale(.8) rotate(-6)">${maleta("s4-m")}</g>${dos("s4")}`,
      tarjeta: tarjeta(4, "Sueldo medio limpio al año, en euros de hoy", `${vs(4, D.neto.map((v) => miles(v) + "&nbsp;€"), ["en 2016", "en 2026"], 64)}
        <div class="nota">Neto, después de IRPF y cotizaciones: un ${es(D.netoSube)} % más que en 2016</div>`, { fuente: F_SUE, icono: bandera(44) }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("bar", null, t, 0);
        const tt = [c["c4-2"] - 0.3, c["c4-2"] + 0.3];
        for (let i = 0; i < 2; i++) {
          const n = Math.round(D.neto[i] / 1500);
          for (let k = 0; k < n; k++) {
            const t0 = tt[i] + k * 0.04, kk = (t - t0) / 0.22;
            if (kk < 0) { ver(`s4-f${i}-${k}`, false); continue; }
            ver(`s4-f${i}-${k}`, true);
            attr(`s4-f${i}-${k}`, "transform", `translate(0 ${(-k * 15 - 110 * (1 - fuera(kk))).toFixed(1)}) scale(.62)`);
          }
          css(`s4-v${i}`, "opacity", clamp((t - tt[i] - n * 0.04) / 0.3));
        }
        sube("c4-a", t, tt[0]); sube("c4-b", t, tt[1]);
        persona("s4-q", t, { x: 190, y: 1440, s: 0.8, mira: 1, vivo: true, boca: [[0, "sonrisa"], [c["c4-inflacion"], "seria"]], brazo: [[0, "abajo"], [c["c4-inflacion"], "piensa"]], fase: 1 });
        persona("s4-v", t, { x: 880, y: 1440, s: 0.8, mira: -1, vivo: true, charla: e, boca: habla(t, e), brazo: [[0, "abajo"], [c["c4-2"] - 0.2, "senala"], [c["c4-horas"], "hombros"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c4-2"]]); } },

    // 5 · El que vuelve (calle, bloque en venta): «Un piso: 7 años y medio de sueldo en 2016. Hoy, más de 8 y medio.»
    { n: 5, set: "vacio",
      svg: `<g transform="translate(870 1300) scale(.55)">${bloque("s5-b", 7, 320)}</g>${panel(250, 840, 610, 300)}
        ${D.piso.map((v, i) => `<g transform="translate(365 ${960 + i * 120})">${rot(-14, -14, ["2016", "2026"][i], 28, C.gris, "", "end")}
          ${Array.from({ length: Math.ceil(v) }, (_, k) => `<g id="s5-a${i}-${k}" transform="translate(${k * 34} 0) scale(.52)">${anyoIcono(`s5-ai${i}-${k}`, i ? C.azul : ORO)}</g>`).join("")}
          <g id="s5-v${i}">${rot(455, -12, es(v) + " años", 30, i ? C.azul : ORO_T, "", "end")}</g></g>`).join("")}
        ${rot(540, 1120, "AÑOS DE SUELDO LIMPIO POR UN PISO DE 90 M²", 19, C.gris)}${dos("s5")}`,
      tarjeta: tarjeta(5, "Piso de 90 m², en años de sueldo limpio", `${vs(5, D.piso.map((v) => es(v)), ["en 2016", "en 2026"])}
        <div class="nota">Valor tasado de la vivienda y sueldo medio neto de cada año</div>`, { fuente: F_PISO, icono: bandera(44) }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("calle", "bar", t, e.t0);
        for (let k = 0; k < 7; k++) attr(`s5-b-p${k}`, "transform", `translate(0 ${-k * 70})`); attr("s5-b-tejado", "transform", "translate(0 -490)");
                const tt = [c["c5-7"], c["c5-8"]];
        for (let i = 0; i < 2; i++) {
          const v = D.piso[i], n = Math.ceil(v);
          for (let k = 0; k < n; k++) {
            const t0 = tt[i] + k * 0.05, kk = (t - t0) / 0.22, ancho = k === n - 1 ? v - k : 1;
            if (kk < 0) { ver(`s5-a${i}-${k}`, false); continue; }
            ver(`s5-a${i}-${k}`, true);
            attr(`s5-a${i}-${k}`, "transform", `translate(${k * 34} ${(-50 * (1 - fuera(kk))).toFixed(1)}) scale(${(0.52 * ancho).toFixed(3)} ${(0.52 * rebote(kk)).toFixed(3)})`);
          }
          css(`s5-v${i}`, "opacity", clamp((t - tt[i] - 0.25) / 0.3));
        }
        sube("c5-a", t, tt[0]); sube("c5-b", t, tt[1]);
        const q = ruta(t, [[e.t0 + 0.1, 40], [e.t0 + 0.9, 140]]);
        persona("s5-q", t, { x: q.x, y: 1440, s: 0.8, anda: q.anda, mira: 1, vivo: true, boca: [[0, "sonrisa"], [c["c5-8"], "o"]], ojos: [[0, "normal"], [c["c5-8"], "grandes"]], brazo: [[0, "abajo"], [c["c5-8"] + 0.2, "piensa"]], fase: 1 });
        persona("s5-v", t, { x: 945, y: 1440, s: 0.8, mira: -1, vivo: true, charla: e, boca: habla(t, e), brazo: [[0, "abajo"], [c["c5-piso"], "senala"], [c["c5-8"] + 0.6, "hombros"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c5-8"]]); } },

    // 6 · El que vuelve (gasolinera): «Llenar el depósito: 4 horas de trabajo en 2016. Hoy, casi 6.»
    { n: 6, set: "vacio",
      svg: `${panel(260, 860, 560, 290)}${filas("s6", D.deposito, ["2016", "2026"], { x0: 395, y0: 960, dy: 110, r: 26, paso: 58, xv: 412 })}
        ${rot(540, 1128, "HORAS DE TRABAJO PARA 50 LITROS DE GASÓLEO", 19, C.gris)}${dos("s6", MANGUERA)}`,
      tarjeta: tarjeta(6, "Llenar el depósito de gasóleo, en horas de trabajo", `${vs(6, D.deposito.map((v) => es(v) + "&nbsp;h"), ["en 2016", "en 2026"])}
        <div class="nota">50 litros. 2026, con los impuestos de la ley</div>`, { fuente: F_GAS, icono: bandera(44) }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("gasolinera", "calle", t, e.t0);
        const tt = [c["c6-4"], c["c6-6"]];
        for (let i = 0; i < 2; i++) {
          const v = D.deposito[i], k = fuera((t - tt[i]) / 0.6) * v;
          for (let j = 0; j < Math.ceil(v); j++) cuna(`s6-f${i}-${j}-w`, k - j, 26 * 0.84);
          css(`s6-v${i}`, "opacity", clamp((t - tt[i] - 0.3) / 0.3));
        }
        sube("c6-a", t, tt[0]); sube("c6-b", t, tt[1]);
        const q = ruta(t, [[e.t0 + 0.1, 40], [e.t0 + 0.9, 150]]);
        ver("s6-mq", t > e.t0 + 0.9);
        persona("s6-q", t, { x: q.x, y: 1440, s: 0.8, anda: q.anda, mira: 1, vivo: true, boca: [[0, "sonrisa"], [c["c6-6"] + 0.1, "o"]], ojos: [[0, "normal"], [c["c6-6"] + 0.1, "grandes"]], brazo: [[0, "abajo"], [e.t0 + 0.9, "empuja"]], fase: 1 });
        persona("s6-v", t, { x: 950, y: 1440, s: 0.8, mira: -1, vivo: true, charla: e, boca: habla(t, e), brazo: [[0, "abajo"], [c["c6-deposito"], "senala"], [c["c6-6"], "arriba"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c6-6"]]); } },

    // 7 · El que se quedó (salón, su dato a favor): «Pues la luz me cuesta menos: 67 horas al año en 2016. Hoy, 62.»
    { n: 7, set: "vacio",
      svg: `${panel(300, 830, 480, 360)}<g id="s7-bom" transform="translate(405 935) scale(.5)">${bombilla("s7-b")}</g>
        ${D.luz.map((v, i) => `<rect id="s7-r${i}" x="${520 + i * 120}" y="${1120 - v * 3.6}" width="86" height="${v * 3.6}" rx="10" fill="${i ? C.azul : ORO}"/>
          <g id="s7-v${i}">${rot(563 + i * 120, 1106 - v * 3.6, Math.round(v) + " h", 30, i ? C.azul : ORO_T)}</g>${rot(563 + i * 120, 1156, ["2016", "2025"][i], 24, C.gris)}`).join("")}
        ${rot(540, 1180, "HORAS DE TRABAJO PARA LA LUZ DE UN AÑO", 19, C.gris)}${dos("s7")}`,
      tarjeta: tarjeta(7, "La luz de casa de un año, en horas de trabajo", `${vs(7, D.luz.map((v) => Math.round(v) + "&nbsp;h"), ["en 2016", "en 2025"])}
        <div class="nota">Una casa que gasta 3.500 kWh al año. 2025, último año entero</div>`, { fuente: F_LUZ, icono: bandera(44) }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("cuarto", "gasolinera", t, e.t0);
        const on = t > c["c7-luz"];
        css("s7-b-halo", "opacity", on ? (0.55 + 0.05 * Math.sin(t * 20)).toFixed(2) : 0); attr("s7-b-fil", "stroke", on ? "#F2B33D" : "#B8A47A");
        T("s7-bom", 405 + 6 * Math.sin(t * 1.8), 935, { s: 0.5, r: 3 * Math.sin(t * 1.8) });
        const tt = [c["c7-67"], c["c7-62"]];
        for (let i = 0; i < 2; i++) { const k = suave((t - tt[i]) / 0.5), h = D.luz[i] * 3.6 * k; attr(`s7-r${i}`, "y", (1120 - h).toFixed(1)); attr(`s7-r${i}`, "height", h.toFixed(1)); css(`s7-v${i}`, "opacity", clamp((t - tt[i] - 0.3) / 0.3)); }
        sube("c7-a", t, tt[0]); sube("c7-b", t, tt[1]);
        persona("s7-q", t, { x: 170, y: 1440, s: 0.8, mira: 1, vivo: true, charla: e, salta: c["c7-62"] + 0.1, boca: habla(t, e, "sonrisa"), ojos: [[0, "normal"], [c["c7-62"] + 0.3, "felices"]],
          brazo: [[0, "abajo"], [c["c7-luz"] - 0.2, "arriba"], [c["c7-67"], "senala"]], fase: 1 });
        persona("s7-v", t, { x: 920, y: 1440, s: 0.8, mira: -1, vivo: true, boca: [[0, "sonrisa"], [c["c7-62"], "seria"]], brazo: [[0, "abajo"], [c["c7-62"] + 0.2, "hombros"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c7-62"]]); } },

    // 8 · El que vuelve (súper): «Ya, pero la comida del mes: 11 horas en 2016. Hoy, 12.»
    { n: 8, set: "vacio",
      svg: `${panel(250, 860, 600, 290)}${filas("s8", D.compra, ["2016", "2026"], { x0: 345, y0: 960, dy: 110, r: 14, paso: 29, xv: 462 })}
        ${rot(550, 1128, "HORAS DE TRABAJO PARA LA COMIDA DE UN MES", 19, C.gris)}<g id="s8-carro">${carro("s8-c")}</g>${dos("s8")}`,
      tarjeta: tarjeta(8, "La comida de un mes por persona, en horas de trabajo", `${vs(8, D.compra.map((v) => es(v) + "&nbsp;h"), ["en 2016", "en 2026"])}
        <div class="nota">La misma cesta en los dos años: el gasto medio en comida de 2025, con los precios de cada año</div>`, { fuente: F_COM, icono: bandera(44) }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("super", "cuarto", t, e.t0);
        const tt = [c["c8-11"], c["c8-12"]];
        for (let i = 0; i < 2; i++) {
          const v = D.compra[i], k = fuera((t - tt[i]) / 0.6) * v;
          for (let j = 0; j < Math.ceil(v); j++) cuna(`s8-f${i}-${j}-w`, k - j, 14 * 0.84);
          css(`s8-v${i}`, "opacity", clamp((t - tt[i] - 0.3) / 0.3));
        }
        sube("c8-a", t, tt[0]); sube("c8-b", t, tt[1]);
        const q = ruta(t, [[e.t0 + 0.1, -80], [e.t0 + 1.0, 140]]);
        T("s8-carro", q.x + 190, 1452, { s: 0.7 });
        persona("s8-q", t, { x: q.x, y: 1440, s: 0.8, anda: q.anda, mira: 1, vivo: true, boca: [[0, "sonrisa"], [c["c8-12"], "o"]], brazo: [[0, "empuja"], [c["c8-12"] + 0.2, "abajo"]], fase: 1 });
        persona("s8-v", t, { x: 955, y: 1440, s: 0.8, mira: -1, vivo: true, charla: e, boca: habla(t, e), brazo: [[0, "hombros"], [c["c8-comida"], "senala"], [c["c8-12"], "arriba"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c8-12"]]); } },

    // 9 · El que vuelve (oficina, calendario): «Y para el Estado trabajas hasta el 31 de mayo. En 2016, hasta el 24.»
    { n: 9, set: "vacio",
      svg: `<g id="s9-cal" transform="translate(540 1040)">${calendario("s9-c")}</g>
        <g id="s9-banda"><rect x="-230" y="-34" width="460" height="68" rx="34" fill="${C.rojo}"/>${rot(0, 14, "TRABAJAS PARA EL ESTADO", 30, "#FFFDF8")}</g>
        <g id="s9-nota"><rect x="-150" y="-50" width="300" height="100" rx="14" fill="#FFE58A" transform="rotate(-4)"/>${rot(0, -6, "EN 2016:", 26, ORO_T)}${rot(0, 34, D.estado[0].dia + " DE MAYO", 34, ORO_T)}</g>${dos("s9")}`,
      tarjeta: tarjeta(9, "Trabajas para el Estado hasta el…", `${vs(9, D.estado.map((x) => x.dia + "&nbsp;de&nbsp;mayo"), ["en 2016", "en 2025"], 52)}
        <div class="nota">IRPF y cotizaciones del trabajador y de la empresa: ${es(D.estado[0].cuna_pct)} % de lo que cuesta el sueldo medio en 2016 y ${es(D.estado[1].cuna_pct)} % en 2025</div>`, { fuente: F_EST, icono: bandera(44) }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("oficina", "super", t, e.t0);
        const MESES = ["ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO"], LARGO = [31, 28, 31, 30, 31];
        const total = 150, a = c["c9-estado"] - 0.6, b = c["c9-31"];
        const k = fuera((t - a) / (b - a)), f = k * total, dia = Math.floor(f);
        const fecha = (n) => { let m = 0; while (m < 4 && n >= LARGO[m]) { n -= LARGO[m]; m++; } return [MESES[m], n + 1]; };
        const [mes, d] = fecha(Math.min(dia, total));
        txt("s9-c-mes", mes); txt("s9-c-dia", String(d)); txt("s9-c-fijo-t", String(d));
        const fr = f - dia;
        if (t < a || k >= 1) ver("s9-c-hoja", false);
        else { ver("s9-c-hoja", true); txt("s9-c-hoja-t", String(fecha(Math.max(0, dia - 1))[1])); attr("s9-c-hoja", "transform", `translate(${(fr * 120).toFixed(1)} ${(-fr * 300).toFixed(1)}) rotate(${(-fr * 40).toFixed(1)})`); css("s9-c-hoja", "opacity", (1 - fr).toFixed(2)); }
        pop("s9-cal", t, e.t0 + 0.3, 540, 1040, { s: 1 });
        T("s9-cal", 540, 1040, { s: 1 + (t > b && t < b + 0.4 ? 0.06 * Math.sin((t - b) / 0.4 * Math.PI) : 0) });
        pop("s9-banda", t, c["c9-estado"], 540, 1262, { s: 0.85 });
        pop("s9-nota", t, c["c9-24"] - 0.1, 545, 1350, { s: 0.8, r: -4 });
        sube("c9-b", t, c["c9-31"]); sube("c9-a", t, c["c9-24"]);
        persona("s9-q", t, { x: 190, y: 1440, s: 0.8, mira: 1, vivo: true, boca: [[0, "seria"], [c["c9-31"], "o"]], ojos: [[0, "normal"], [c["c9-31"], "grandes"]], brazo: [[0, "abajo"], [c["c9-31"] + 0.3, "piensa"]], incl: [[0, 0], [c["c9-31"], 6]], fase: 1 });
        persona("s9-v", t, { x: 890, y: 1440, s: 0.8, mira: -1, vivo: true, charla: e, boca: habla(t, e), brazo: [[0, "abajo"], [c["c9-estado"], "senala"], [c["c9-24"], "arriba"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c9-31"], e.c["c9-24"]]); } },

    // 10 · El que se quedó (bar): «Bueno… ¡Bienvenido a casa!»
    { n: 10, set: "vacio",
      svg: `<g id="s10-mal" transform="translate(1010 1440) scale(.8) rotate(-6)">${maleta("s10-m")}</g>${dos("s10")}`,
      tarjeta: tarjeta(10, "El que se quedó", `<div class="tit">«¡Bienvenido a <mark id="m10">casa</mark>!»</div>`, { tono: "pasado" }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("bar", "oficina", t, e.t0);
        marca("m10", t, c["c10-bienvenido"]);
        const q = ruta(t, [[c["c10-bienvenido"] - 0.2, 220], [c["c10-bienvenido"] + 0.5, 620]]);
        persona("s10-q", t, { x: q.x, y: 1440, s: 0.8, anda: q.anda, mira: 1, vivo: true, charla: e, boca: habla(t, e, "sonrisa"), ojos: [[0, "normal"], [c["c10-bienvenido"], "felices"]],
          brazo: [[0, "hombros"], [c["c10-bienvenido"] + 0.4, "arriba"]], fase: 1 });
        persona("s10-v", t, { x: 860, y: 1440, s: 0.8, mira: -1, vivo: true, salta: c["c10-bienvenido"] + 0.55, boca: [[0, "seria"], [c["c10-bienvenido"] + 0.5, "grande"]], ojos: [[0, "normal"], [c["c10-bienvenido"] + 0.5, "felices"]],
          brazo: [[0, "abajo"], [c["c10-bienvenido"] + 0.5, "hombros"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camSueno(t, e.t0); } },

    // 11 · El que vuelve, a cámara (bar): «¿Se vive mejor que hace 10 años? ¿Tú qué opinas?»
    { n: 11, set: "vacio",
      svg: `${boton("s11-b1", "MEJOR", "#5F7F62", 280)}${boton("s11-b2", "PEOR", "#B8863A", 260)}${bocadillo("s11-boc")}<g id="s11-mal" transform="translate(1010 1440) scale(.8) rotate(-6)">${maleta("s11-m")}</g>${dos("s11")}`,
      tarjeta: tarjeta(11, "Te toca", `<div class="tit" style="font-size:64px">¿Se vive <mark id="m11">mejor</mark> que hace 10 años?</div><div class="sub" id="c11-sub">¿Tú qué opinas? Te leo en los comentarios.</div>`),
      fn: function (t, e) {
        const c = e.c;
        ambiente("bar", null, t, 0);
        pop("s11-b1", t, c["c11-mejor"], 320, 880, { s: 0.9 }); pop("s11-b2", t, c["c11-mejor"] + 0.35, 760, 880, { s: 0.9 });
        if (pop("s11-boc", t, c["c11-boc"], 540, 1120, { s: 0.75 }) >= 0) for (let i = 0; i < 3; i++) attr("s11-boc-p" + i, "cy", (-6 - 16 * Math.max(0, Math.sin((t - c["c11-boc"]) * 8 - i * 0.9))).toFixed(1));
        marca("m11", t, c["c11-mejor"]); sube("c11-sub", t, c["c11-boc"] - 0.2);
        persona("s11-q", t, { x: 210, y: 1440, s: 0.8, mira: [[0, 1], [c["c11-boc"], 0]], vivo: true, salta: c["c11-mejor"] + 0.1, boca: "sonrisa",
          brazo: [[0, "abajo"], [c["c11-mejor"], "senala"], [c["c11-boc"], "hombros"]], fase: 1 });
        persona("s11-v", t, { x: 860, y: 1440, s: 0.8, mira: [[0, -1], [c["c11-boc"], 0]], vivo: true, charla: e, salta: c["c11-mejor"] + 0.45, boca: habla(t, e),
          brazo: [[0, "abajo"], [c["c11-mejor"] + 0.35, "senala"], [c["c11-boc"], "arriba"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c11-mejor"]]); } },
  ];
}
