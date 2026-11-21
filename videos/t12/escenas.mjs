// Escenas de T12 («¿Pagamos más para que aprendan menos?», educación 2016 frente a hoy) en estilo «limpio».
// Bruno, 21-11-2026: protagonistas del área (profesores, alumnos y padres), historia, entornos descriptivos, contundente:
// lo que pagamos en impuestos frente a lo que aprenden los alumnos. Personajes inventados, con volumen y vivos:
//   · «profesora» (clave interna): el tutor de 4.º de ESO, un hombre de unos 45 años (rebeca terracota). La voz A del casting, elegida por Bruno, es masculina.
//   · «padre»: unos 45 años (camisa gris azulada).
//   · «alumno»: 15 años, 4.º de ESO (sudadera verde), más bajo.
// Decorados nuevos (diseno/educacion.mjs): pasillo del instituto → aula → academia de refuerzo → pasillo.
/* eslint-disable no-undef */

import { C, persona, tarjeta, nomina, monedaEuro } from "../../diseno/limpio.mjs";
import { bandera } from "../../diseno/barrio.mjs";
import { ambientes } from "../../diseno/sueno.mjs";
import { billete } from "../../diseno/casa.mjs";
import { balanza } from "../../diseno/sanidad.mjs";
import { DECORADOS_T12, MOVIL, MOCHILA, alumnito, libro, profe } from "../../diseno/educacion.mjs";

export const ESTILO = "limpio";
const F_PISA = "Dato oficial: OCDE (PISA 2015) · Ministerio de Educación (informe español PISA 2025)";
const F_IMP = "Cálculo propio · Eurostat (impuestos y cotizaciones recaudados) · INE (IPC y población)";
const F_GAS = "Cálculo propio · Eurostat (gasto de las administraciones por funciones) · INE (IPC y población)";
const F_PROF = "Dato oficial: Eurostat (profesorado y alumnos por profesor)";
const F_FAM = "Cálculo propio · INE (Encuesta de Presupuestos Familiares e IPC)";
const F_CLASE = "Dato oficial: OCDE (Education at a Glance: tamaño medio de la clase)";

export function datos(d) {
  const a = d.aprenden;
  return {
    lectura: [a.lectura.bajo_nivel_2_pct["2015"], a.lectura.bajo_nivel_2_pct["2025"]],
    mates: [a.matematicas.bajo_nivel_2_pct["2015"], a.matematicas.bajo_nivel_2_pct["2025"]],
    puntos: [a.lectura.media["2015"], a.lectura.media["2025"]], ocde: [Math.round(a.lectura.ocde35["2015"]), Math.round(a.lectura.ocde35["2025"])],
    impuestos: [d.pagamos.por_habitante_eur_de_2025["2016"], d.pagamos.por_habitante_eur_de_2025["2025"]],
    gasto: [d.gasto_educacion.por_habitante_eur_de_2025["2016"], d.gasto_educacion.por_habitante_eur_de_2025["2024"]],
    profes: [d.profesores.eso["2016"], d.profesores.eso["2024"]], ratio: [d.profesores.alumnos_por_profesor_eso["2016"], d.profesores.alumnos_por_profesor_eso["2024"]],
    familias: [d.familias.secundaria_por_hogar_eur_de_2025["2016"], d.familias.secundaria_por_hogar_eur_de_2025["2025"]],
    clase: [d.profesores.alumnos_por_clase_eso.espana["2016"], d.profesores.alumnos_por_clase_eso.espana["2024"], d.profesores.alumnos_por_clase_eso.ue25["2024"]],
    rank: d.profesores.ranking_clase_2024,
  };
}

export const capas = () => ambientes(DECORADOS_T12);

// ------------------------------------------------------------------ personajes nuevos (inventados), con volumen
const PROFESORA = { pelo: "corto", canas: false, barba: false, colorPelo: "#5A3A26", ropa: ["#C77B5B", "#A86347"], piel: "#F2CBA8", volumen: true };   // el tutor (hombre)
const PADRE = { pelo: "corto", canas: true, barba: false, colorPelo: "#4A3A2E", ropa: ["#6E8FA8", "#5A7790"], piel: "#E9BE98", volumen: true };
const ALUMNO = { pelo: "corto", canas: false, barba: false, colorPelo: "#3B2A20", ropa: ["#7FA35B", "#668A47"], piel: "#DCA883", volumen: true };
const QUIEN = { f: PROFESORA, p: PADRE, a: ALUMNO };
const gente = (n, quien, manos = {}) => quien.split("").map((k) => persona(`${n}-${k}`, "hoy", { ...QUIEN[k], mano: manos[k] ? `<g id="${n}-${k}-mano">${manos[k]}</g>` : undefined })).join("");
const NOMINA_MANO = `<g transform="translate(10 -50) scale(.6)">${nomina("nm12")}</g>`;
const SA = 0.66;   // el alumno, más bajo

// ------------------------------------------------------------------ piezas de los datos
const ANTES = "#C8902E", ANTES_T = "#8A6316", HOY = "#B3261E";
const panel = (x, y, w, h) => `<rect x="${x + 8}" y="${y + 12}" width="${w}" height="${h}" rx="26" fill="#3C2814" opacity=".10"/><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="26" fill="#FFFDF8" opacity=".96"/>`;
const rot = (x, y, t, tam, color, id = "", ancla = "middle") => `<text ${id ? `id="${id}"` : ""} x="${x}" y="${y}" text-anchor="${ancla}" font-family="Cap" font-weight="800" font-size="${tam}" fill="${color}">${t}</text>`;
const miles = (v) => String(Math.round(v)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
const es = (v, d = 1) => v.toFixed(d).replace(".", ",");
const vs = (n, vals, labs, tam = 72) => `<div class="vs">${vals.map((v, i) => `<div class="col"><div class="v ${i ? "t-hoy" : "t-pasado"}" id="c${n}-${"ab"[i]}" style="font-size:${tam}px">${v}</div><div class="n">${labs[i]}</div></div>`).join("")}</div>`;

export function escenas(D) {
  return [
    // 1 · El padre (pasillo del instituto): «¿Pagamos más impuestos para que nuestros hijos aprendan menos? Vamos a la tutoría.»
    { n: 1, set: "vacio",
      svg: gente("s1", "ap", { a: MOCHILA }),
      tarjeta: tarjeta(1, "Educación · 2016 frente a hoy", `<div class="tit" style="font-size:66px">¿Pagamos <mark id="m1">más</mark> para que aprendan menos?</div>`, { icono: bandera(44) }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("pasilloInsti", null, t, 0);
        marca("m1", t, c["c1-menos"]);
        const v = ruta(t, [[0.1, 1250], [1.5, 920]]), w = ruta(t, [[0.3, 1350], [1.8, 700]]);
        persona("s1-p", t, { x: v.x, y: 1440, s: 0.8, anda: v.anda, mira: [[0, -1], [c["c1-impuestos"], 1]], vivo: true, charla: e, boca: habla(t, e, "seria"),
          brazo: [[0, "abajo"], [c["c1-impuestos"], "hombros"], [c["c1-tutoria"] - 0.2, "senala"]], espejo: true, fase: 1 });
        persona("s1-a", t, { x: w.x, y: 1440, s: 0.66, anda: w.anda, mira: -1, vivo: true, boca: [[0, "seria"], [c["c1-tutoria"] + 0.2, "o"]], ojos: [[0, "normal"], [c["c1-tutoria"] + 0.2, "grandes"]],
          brazo: [[0, "sujeta"]], incl: [[0, 0], [c["c1-tutoria"], 6]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c1-menos"]]); } },

    // 2 · El tutor (aula): «Siéntense. En lectura, casi uno de cada tres alumnos de 15 años no llega al nivel básico. En 2015, uno de cada seis.»
    { n: 2, set: "vacio",
      svg: `${panel(250, 900, 560, 330)}${[0, 1].map((i) => `<g transform="translate(40 ${1050 + i * 130})">${rot(290, -24, ["2015", "2025"][i], 26, C.gris, "", "end")}
          ${Array.from({ length: 6 }, (_, k) => `<g transform="translate(${335 + k * 58} 0) scale(1.2)">${alumnito(`s2-r${i}-${k}`)}</g>`).join("")}
          <g id="s2-v${i}">${rot(760, -24, es(D.lectura[i]) + " %", 30, i ? HOY : ANTES_T, "", "end")}</g></g>`).join("")}
        ${rot(530, 1220, "NO LLEGAN AL NIVEL BÁSICO DE LECTURA", 18, C.gris)}${gente("s2", "fap")}`,
      tarjeta: tarjeta(2, "Alumnos de 15 años que no llegan al nivel básico de lectura", `${vs(2, D.lectura.map((v) => es(v) + "&nbsp;%"), ["en 2015", "en 2025"])}
        <div class="nota">PISA: el nivel básico es el nivel 2 de la OCDE</div>`, { fuente: F_PISA, icono: bandera(44) }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("aula", "pasilloInsti", t, e.t0);
        // Fila de 2025 al decir «lectura»; dos de cada seis no llegan («tres»). Fila de 2015 con «2015»; uno de cada seis («seis»).
        const ap = [c["c2-2015"], c["c2-lectura"]], mal = [c["c2-seis"], c["c2-tres"]], n = [1, 2];
        for (let i = 0; i < 2; i++) for (let k = 0; k < 6; k++) {
          const t0 = ap[i] + k * 0.06; if (t < t0) { ver(`s2-r${i}-${k}`, false); continue; }
          T(`s2-r${i}-${k}`, 0, -20 * (1 - fuera((t - t0) / 0.25)), { s: 1, op: clamp((t - t0) * 5) }); attr(`s2-r${i}-${k}`, "transform", `translate(0 ${(-20 * (1 - fuera((t - t0) / 0.25))).toFixed(1)})`);
          const no = k >= 6 - n[i] && t > mal[i];
          css(`s2-r${i}-${k}-a`, "opacity", no ? 0.28 : 1); ver(`s2-r${i}-${k}-q`, no);
        }
        css("s2-v0", "opacity", clamp((t - c["c2-seis"]) / 0.3)); css("s2-v1", "opacity", clamp((t - c["c2-tres"]) / 0.3));
        sube("c2-b", t, c["c2-tres"]); sube("c2-a", t, c["c2-seis"]);
        persona("s2-f", t, { x: 140, y: 1440, s: 0.8, mira: 1, vivo: true, charla: e, boca: habla(t, e, "seria"), brazo: [[0, "abajo"], [c["c2-lectura"], "senala"], [c["c2-seis"], "hombros"]], fase: 1 });
        persona("s2-a", t, { x: 870, y: 1440, s: 0.66, mira: -1, vivo: true, boca: [[0, "seria"], [c["c2-tres"] + 0.2, "o"]], ojos: [[0, "normal"], [c["c2-tres"] + 0.2, "grandes"]], brazo: [[0, "abajo"]], espejo: true, fase: 2 });
        persona("s2-p", t, { x: 995, y: 1440, s: 0.8, mira: -1, vivo: true, boca: [[0, "seria"], [c["c2-tres"] + 0.3, "o"]], brazo: [[0, "abajo"], [c["c2-tres"] + 0.4, "piensa"]], espejo: true, fase: 3 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c2-tres"], e.c["c2-seis"]]); } },

    // 3 · El alumno (aula), con el móvil: «¡Pero si yo leo un montón! En el móvil…»
    { n: 3, set: "vacio",
      svg: gente("s3", "fap", { a: MOVIL }),
      tarjeta: tarjeta(3, "El alumno", `<div class="tit">«¡Pero si yo leo <mark id="m3">un montón</mark>!»</div>`, { tono: "hoy" }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("aula", null, t, 0);
        marca("m3", t, c["c3-monton"]);
        persona("s3-f", t, { x: 160, y: 1440, s: 0.8, mira: 1, vivo: true, boca: [[0, "seria"], [c["c3-movil"] + 0.3, "o"]], ojos: [[0, "normal"], [c["c3-movil"] + 0.3, "grandes"]], brazo: [[0, "abajo"], [c["c3-movil"] + 0.4, "hombros"]], fase: 1 });
        persona("s3-a", t, { x: 560, y: 1440, s: 0.66, mira: 1, vivo: true, charla: e, salta: c["c3-monton"] - 0.1, boca: habla(t, e, "sonrisa"), ojos: [[0, "felices"]], brazo: [[0, "abajo"], [c["c3-movil"] - 0.3, "arriba"]], fase: 2 });
        persona("s3-p", t, { x: 940, y: 1440, s: 0.8, mira: -1, vivo: true, boca: [[0, "seria"]], ojos: [[0, "normal"], [c["c3-movil"] + 0.2, "felices"]], brazo: [[0, "abajo"], [c["c3-movil"] + 0.2, "piensa"]], incl: [[0, 0], [c["c3-movil"] + 0.2, -8]], espejo: true, fase: 3 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c3-movil"]], { acerca: 0.07 }); } },

    // 4 · El tutor (aula): «Y en matemáticas, del 22 % al 33 %. Uno de cada tres tampoco llega.»
    { n: 4, set: "vacio",
      svg: `${panel(300, 800, 440, 430)}${D.mates.map((v, i) => `<g transform="translate(${430 + i * 180} 1130)"><rect id="s4-r${i}" x="-60" y="0" width="120" height="0" rx="14" fill="${i ? HOY : ANTES}"/>
          <g id="s4-v${i}">${rot(0, -v * 7 - 24, es(v) + " %", 30, i ? HOY : ANTES_T)}</g>${rot(0, 52, ["2015", "2025"][i], 30, C.gris)}</g>`).join("")}
        ${rot(520, 1214, "NO LLEGAN AL NIVEL BÁSICO DE MATEMÁTICAS", 18, C.gris)}${gente("s4", "fap")}`,
      tarjeta: tarjeta(4, "Alumnos de 15 años que no llegan al nivel básico de matemáticas", `${vs(4, D.mates.map((v) => es(v) + "&nbsp;%"), ["en 2015", "en 2025"])}
        <div class="nota">PISA: el nivel básico es el nivel 2 de la OCDE</div>`, { fuente: F_PISA, icono: bandera(44) }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("aula", null, t, 0);
        const tt = [c["c4-22"], c["c4-33"]];
        for (let i = 0; i < 2; i++) { const h = D.mates[i] * 7 * suave((t - tt[i]) / 0.5); attr(`s4-r${i}`, "y", (-h).toFixed(1)); attr(`s4-r${i}`, "height", h.toFixed(1)); css(`s4-v${i}`, "opacity", clamp((t - tt[i] - 0.4) / 0.3)); }
        sube("c4-a", t, tt[0]); sube("c4-b", t, tt[1]);
        persona("s4-f", t, { x: 150, y: 1440, s: 0.8, mira: 1, vivo: true, charla: e, boca: habla(t, e, "seria"), brazo: [[0, "abajo"], [c["c4-22"] - 0.2, "senala"], [c["c4-tres"], "hombros"]], fase: 1 });
        persona("s4-a", t, { x: 830, y: 1440, s: 0.66, mira: -1, vivo: true, boca: [[0, "seria"]], brazo: [[0, "abajo"]], incl: [[0, 0], [c["c4-tres"], 7]], espejo: true, fase: 2 });
        persona("s4-p", t, { x: 970, y: 1440, s: 0.8, mira: -1, vivo: true, boca: [[0, "seria"], [c["c4-33"] + 0.2, "o"]], brazo: [[0, "abajo"], [c["c4-33"] + 0.3, "piensa"]], espejo: true, fase: 3 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c4-33"]]); } },

    // 5 · El tutor (aula): «España ha perdido 45 puntos en lectura desde 2015. Más que la media de la OCDE.»
    { n: 5, set: "vacio",
      svg: `${panel(250, 830, 540, 400)}${(() => {
          const y = (v) => 1180 - (v - 440) * 4.2, X = [340, 640];
          const linea = (id, vals, col, et) => `<g id="${id}"><line id="${id}-l" x1="${X[0]}" y1="${y(vals[0])}" x2="${X[0]}" y2="${y(vals[0])}" stroke="${col}" stroke-width="10" stroke-linecap="round"/>
            <circle cx="${X[0]}" cy="${y(vals[0])}" r="12" fill="${col}"/><circle id="${id}-p" cx="${X[1]}" cy="${y(vals[1])}" r="12" fill="${col}" opacity="0"/>
            <g id="${id}-v0">${rot(X[0] - 22, y(vals[0]) + (et === "OCDE" ? 30 : -6), vals[0], 28, col, "", "end")}</g><g id="${id}-v1">${rot(X[1] + 22, y(vals[1]) + 10, vals[1], 28, col, "", "start")}</g>
            <g id="${id}-et">${rot(X[0] + 24, y(vals[0]) + (et === "OCDE" ? 52 : -26), et, 24, col, "", "start")}</g></g>`;
          return `${linea("s5-o", D.ocde, "#9AA6AE", "OCDE")}${linea("s5-e", D.puntos, HOY, "ESPAÑA")}${rot(X[0], 1214, "2015", 26, C.gris)}${rot(X[1], 1214, "2025", 26, C.gris)}`;
        })()}
        ${gente("s5", "fap")}`,
      tarjeta: tarjeta(5, "Puntuación media de España en lectura (PISA)", `${vs(5, D.puntos, ["en 2015", "en 2025"])}
        <div class="nota">La media de la OCDE también baja, pero menos: de ${D.ocde[0]} a ${D.ocde[1]}</div>`, { fuente: F_PISA, icono: bandera(44) }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("aula", null, t, 0);
        const y = (v) => 1180 - (v - 440) * 4.2, X = [340, 640];
        const pinta1 = (id, vals, t0) => {
          const k = suave((t - t0) / 0.8);
          attr(id + "-l", "x2", (X[0] + (X[1] - X[0]) * k).toFixed(1)); attr(id + "-l", "y2", (y(vals[0]) + (y(vals[1]) - y(vals[0])) * k).toFixed(1));
          css(id + "-p", "opacity", k >= 1 ? 1 : 0); css(id + "-v1", "opacity", clamp((t - t0 - 0.8) / 0.3)); css(id + "-et", "opacity", clamp((t - t0 - 0.4) / 0.3));
          css(id + "-v0", "opacity", clamp((t - t0 + 0.3) / 0.3)); css(id, "opacity", t < t0 - 0.3 ? 0 : 1);
        };
        pinta1("s5-e", D.puntos, c["c5-45"] - 0.2); pinta1("s5-o", D.ocde, c["c5-ocde"] - 0.4);
        sube("c5-a", t, c["c5-45"] - 0.2); sube("c5-b", t, c["c5-45"] + 0.5);
        persona("s5-f", t, { x: 140, y: 1440, s: 0.8, mira: 1, vivo: true, charla: e, boca: habla(t, e, "seria"), brazo: [[0, "abajo"], [c["c5-45"] - 0.2, "senala"], [c["c5-ocde"], "hombros"]], fase: 1 });
        persona("s5-a", t, { x: 870, y: 1440, s: 0.66, mira: -1, vivo: true, boca: [[0, "o"]], ojos: [[0, "grandes"]], brazo: [[0, "abajo"]], espejo: true, fase: 2 });
        persona("s5-p", t, { x: 995, y: 1440, s: 0.8, mira: -1, vivo: true, boca: [[0, "seria"]], brazo: [[0, "piensa"]], espejo: true, fase: 3 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c5-45"]]); } },

    // 6 · El padre (aula), con la nómina: «¡Pero si pagamos más que nunca!»
    { n: 6, set: "vacio",
      svg: `${[0, 1, 2, 3, 4, 5].map((k) => `<g id="s6-mo${k}">${monedaEuro(`s6-me${k}`, 22)}</g>`).join("")}${gente("s6", "fap", { p: NOMINA_MANO })}`,
      tarjeta: tarjeta(6, "El padre", `<div class="tit">«¡Pero si pagamos <mark id="m6">más que nunca</mark>!»</div>`, { tono: "hoy" }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("aula", null, t, 0);
        marca("m6", t, c["c6-nunca"]);
        for (let k = 0; k < 6; k++) { const t0 = c["c6-pagamos"] + k * 0.12, kk = t - t0; if (kk < 0) { ver(`s6-mo${k}`, false); continue; } T(`s6-mo${k}`, 860 - k * 26 + Math.sin(k * 7) * 30, Math.min(1420, 1010 + 900 * kk * kk), { s: 1, r: kk * 400 }); }
        persona("s6-f", t, { x: 150, y: 1440, s: 0.8, mira: 1, vivo: true, boca: [[0, "seria"], [c["c6-nunca"] + 0.2, "o"]], brazo: [[0, "abajo"], [c["c6-nunca"] + 0.3, "hombros"]], fase: 1 });
        persona("s6-a", t, { x: 560, y: 1440, s: 0.66, mira: 1, vivo: true, boca: [[0, "o"]], ojos: [[0, "grandes"]], brazo: [[0, "abajo"]], fase: 2 });
        persona("s6-p", t, { x: 900, y: 1440, s: 0.8, mira: -1, vivo: true, charla: e, salta: c["c6-pagamos"] - 0.1, boca: habla(t, e, "grande"), ojos: [[0, "grandes"]], brazo: [[0, "sujeta"], [c["c6-pagamos"] - 0.2, "arriba"]], espejo: true, fase: 3 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c6-pagamos"]], { acerca: 0.07 }); } },

    // 7 · El tutor (aula): «Es verdad. Por habitante, se recauda un 25 % más que en 2016, ya descontada la inflación. Récord.»
    { n: 7, set: "vacio",
      svg: `${panel(300, 800, 480, 420)}${D.impuestos.map((v, i) => { const n = Math.round(v / 750); return `<g transform="translate(${430 + i * 220} 1130)">${Array.from({ length: n }, (_, k) => `<g id="s7-b${i}-${k}" transform="translate(0 ${-k * 15}) scale(.62)">${billete(`s7-bb${i}${k}`)}</g>`).join("")}
          <g id="s7-v${i}">${rot(0, -n * 15 - 40, miles(v) + " €", 28, i ? HOY : ANTES_T)}</g>${rot(0, 62, ["2016", "2025"][i], 30, C.gris)}</g>`; }).join("")}
        <g id="s7-rec"><rect x="-130" y="-46" width="260" height="92" rx="12" fill="none" stroke="${HOY}" stroke-width="9"/>${rot(0, 20, "RÉCORD", 56, HOY)}</g>
        ${rot(540, 1206, "IMPUESTOS Y COTIZACIONES POR HABITANTE, EN EUROS DE HOY", 17, C.gris)}${gente("s7", "fp")}`,
      tarjeta: tarjeta(7, "Impuestos y cotizaciones por habitante, en euros de 2025", `${vs(7, D.impuestos.map((v) => miles(v) + "&nbsp;€"), ["en 2016", "en 2025"], 66)}
        <div class="nota">La recaudación más alta de la serie, también descontada la inflación</div>`, { fuente: F_IMP, icono: bandera(44) }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("aula", null, t, 0);
        const tt = [c["c7-25"] - 0.3, c["c7-25"] + 0.2];
        for (let i = 0; i < 2; i++) {
          const n = Math.round(D.impuestos[i] / 750);
          for (let k = 0; k < n; k++) {
            const t0 = tt[i] + k * 0.04, kk = (t - t0) / 0.22;
            if (kk < 0) { ver(`s7-b${i}-${k}`, false); continue; }
            ver(`s7-b${i}-${k}`, true);
            attr(`s7-b${i}-${k}`, "transform", `translate(0 ${(-k * 15 - 110 * (1 - fuera(kk))).toFixed(1)}) scale(.62)`);
          }
          css(`s7-v${i}`, "opacity", clamp((t - tt[i] - n * 0.04) / 0.3));
        }
        pop("s7-rec", t, c["c7-record"] - 0.05, 650, 1010, { s: 1, r: -10, d: 0.25 });
        sube("c7-a", t, tt[0]); sube("c7-b", t, tt[1]);
        persona("s7-f", t, { x: 150, y: 1440, s: 0.8, mira: 1, vivo: true, charla: e, boca: habla(t, e, "seria"), brazo: [[0, "abajo"], [c["c7-25"] - 0.2, "senala"], [c["c7-record"], "arriba"]], fase: 1 });
        persona("s7-p", t, { x: 930, y: 1440, s: 0.8, mira: -1, vivo: true, boca: [[0, "seria"], [c["c7-record"] + 0.2, "o"]], brazo: [[0, "abajo"], [c["c7-record"] + 0.2, "hombros"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c7-25"], e.c["c7-record"]]); } },

    // 8 · El tutor (aula): «Y en educación se gasta un 12 % más por habitante.»
    { n: 8, set: "vacio",
      svg: `${panel(320, 800, 440, 430)}${D.gasto.map((v, i) => { const n = Math.round(v / 100); return `<g transform="translate(${450 + i * 180} 1130)">${Array.from({ length: n }, (_, k) => `<g transform="translate(${(k % 3) * 4 - 4} ${-k * 24 - 12})">${libro(`s8-l${i}-${k}`, ["#5E8C99", "#C8902E", "#7C9A7E", "#C77B5B"][k % 4])}</g>`).join("")}
          <g id="s8-v${i}">${rot(0, -n * 24 - 36, miles(v) + " €", 28, i ? HOY : ANTES_T)}</g>${rot(0, 52, ["2016", "2024"][i], 30, C.gris)}</g>`; }).join("")}
        ${rot(540, 1214, "GASTO PÚBLICO EN EDUCACIÓN POR HABITANTE", 18, C.gris)}${gente("s8", "fp")}`,
      tarjeta: tarjeta(8, "Gasto público en educación por habitante, en euros de 2025", `${vs(8, D.gasto.map((v) => miles(v) + "&nbsp;€"), ["en 2016", "en 2024"], 66)}
        <div class="nota">Todas las administraciones. 2024, último año</div>`, { fuente: F_GAS, icono: bandera(44) }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("aula", null, t, 0);
        const tt = [c["c8-12"] - 0.3, c["c8-12"] + 0.2];
        for (let i = 0; i < 2; i++) {
          const n = Math.round(D.gasto[i] / 100);
          for (let k = 0; k < n; k++) { const t0 = tt[i] + k * 0.05; if (t < t0) { ver(`s8-l${i}-${k}`, false); continue; } T(`s8-l${i}-${k}`, 0, -80 * (1 - fuera((t - t0) / 0.22)), { s: 1, op: clamp((t - t0) * 6) }); }
          css(`s8-v${i}`, "opacity", clamp((t - tt[i] - n * 0.05) / 0.3));
        }
        sube("c8-a", t, tt[0]); sube("c8-b", t, tt[1]);
        persona("s8-f", t, { x: 150, y: 1440, s: 0.8, mira: 1, vivo: true, charla: e, boca: habla(t, e), brazo: [[0, "abajo"], [c["c8-educacion"], "senala"], [c["c8-12"] + 0.3, "arriba"]], fase: 1 });
        persona("s8-p", t, { x: 930, y: 1440, s: 0.8, mira: -1, vivo: true, boca: "seria", brazo: [[0, "abajo"], [c["c8-12"] + 0.3, "piensa"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c8-12"]]); } },

    // 9 · El tutor (aula): «Y en la ESO hay un 19 % más de profesores. Aun así, aprenden menos.»
    { n: 9, set: "vacio",
      svg: `${panel(240, 850, 600, 360)}${D.profes.map((v, i) => { const n = Math.round(v / 10000); return `<g transform="translate(0 ${1010 + i * 140})">${rot(375, -22, ["2016", "2024"][i], 28, C.gris, "", "end")}
          ${Array.from({ length: n }, (_, k) => `<g transform="translate(${400 + k * 26} 0) scale(.8)">${profe(`s9-p${i}-${k}`)}</g>`).join("")}<g id="s9-v${i}">${rot(375, 14, miles(v), 22, i ? HOY : ANTES_T, "", "end")}</g></g>`; }).join("")}
        ${rot(540, 1192, "PROFESORES DE LA ESO · CADA FIGURA, 10.000", 18, C.gris)}${gente("s9", "fp")}`,
      tarjeta: tarjeta(9, "Profesores de la ESO", `${vs(9, D.profes.map(miles), ["en 2016", "en 2024"], 68)}
        <div class="nota">Alumnos por profesor: de ${es(D.ratio[0])} a ${es(D.ratio[1])}</div>`, { fuente: F_PROF, icono: bandera(44) }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("aula", null, t, 0);
        const tt = [c["c9-19"] - 0.3, c["c9-19"] + 0.2];
        for (let i = 0; i < 2; i++) {
          const n = Math.round(D.profes[i] / 10000);
          for (let k = 0; k < n; k++) { const t0 = tt[i] + k * 0.05; if (t < t0) { ver(`s9-p${i}-${k}`, false); continue; } T(`s9-p${i}-${k}`, 0, -30 * (1 - fuera((t - t0) / 0.25)), { s: 1, op: clamp((t - t0) * 6) }); }
          css(`s9-v${i}`, "opacity", clamp((t - tt[i] - 0.4) / 0.3));
        }
        sube("c9-a", t, tt[0]); sube("c9-b", t, tt[1]);
        persona("s9-f", t, { x: 125, y: 1440, s: 0.8, mira: 1, vivo: true, charla: e, boca: habla(t, e, "seria"), brazo: [[0, "abajo"], [c["c9-19"] - 0.2, "senala"], [c["c9-menos"], "hombros"]], incl: [[0, 0], [c["c9-menos"], 6]], fase: 1 });
        persona("s9-p", t, { x: 930, y: 1440, s: 0.8, mira: -1, vivo: true, boca: [[0, "seria"], [c["c9-menos"] + 0.2, "o"]], brazo: [[0, "abajo"], [c["c9-menos"], "piensa"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c9-19"]]); } },

    // 10 · El tutor (aula): «Y las clases, a reventar: 25 alumnos en la ESO. En la Unión Europea, solo Francia las tiene más llenas.»
    { n: 10, set: "vacio",
      svg: `${panel(225, 790, 630, 450)}${[["PRIMARIA", D.rank.primaria, 1000], ["ESO", D.rank.eso, 1205]].map(([et, r, yb], j) => `<g id="s10-g${j}">
          ${rot(250, yb - 150, et, 24, C.tinta, "", "start")}
          <line x1="262" y1="${yb - r.ue25 * 5.2}" x2="${262 + r.paises.length * 21}" y2="${yb - r.ue25 * 5.2}" stroke="#5E8C99" stroke-width="3" stroke-dasharray="8 6"/>
          ${rot(262 + r.paises.length * 21 + 6, yb - r.ue25 * 5.2 + 6, "UE " + es(r.ue25), 18, "#5E8C99", "", "start")}
          ${r.paises.map((q, k) => `<rect id="s10-b${j}-${k}" x="${262 + k * 21}" y="${yb}" width="15" height="0" rx="4" fill="${q.pais === "ESP" ? HOY : k === 0 ? "#7C9A7E" : k === r.paises.length - 1 ? "#5B6470" : "#C9CED3"}"/>`).join("")}
          <g id="s10-e${j}">${rot(262 + (r.puesto_espana - 1) * 21 + 8, yb - r.espana * 5.2 - 12, "ESPAÑA " + es(r.espana), 20, HOY, "", "end")}</g>
          <g id="s10-x${j}">${rot(262, yb + 26, r.mejor.pais.toUpperCase() + " " + es(r.mejor.alumnos), 16, "#5F7F62", "", "start")}${rot(262 + r.paises.length * 21 - 6, yb + 26, r.peor.pais.toUpperCase() + " " + es(r.peor.alumnos), 16, C.gris, "", "end")}</g></g>`).join("")}
        ${gente("s10", "fp")}`,
      tarjeta: tarjeta(10, "Alumnos por clase en la ESO (2024)", `<div class="vs">${[[es(D.rank.eso.espana), "España"], [es(D.rank.eso.ue25), "media de la UE"], [es(D.rank.eso.peor.alumnos), "Francia, la última"]].map(([v, l], i) => `<div class="col"><div class="v ${i === 0 ? "t-hoy" : "t-pasado"}" id="c10-${"abc"[i]}" style="font-size:62px">${v}</div><div class="n">${l}</div></div>`).join("")}</div>
        <div class="nota">De ${D.rank.eso.n} países de la UE con datos, solo Francia tiene clases más llenas. España en 2016: ${es(D.clase[0])}</div>`, { fuente: F_CLASE, icono: bandera(44) }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("aula", null, t, 0);
        const tt = [c["c10-reventar"] - 0.2, c["c10-25"] - 0.2], R = [D.rank.primaria, D.rank.eso], YB = [1000, 1205];
        for (let j = 0; j < 2; j++) {
          const r = R[j];
          for (let k = 0; k < r.paises.length; k++) {
            const h = r.paises[k].alumnos * 5.2 * suave((t - tt[j] - k * 0.03) / 0.35);
            attr(`s10-b${j}-${k}`, "y", (YB[j] - h).toFixed(1)); attr(`s10-b${j}-${k}`, "height", Math.max(0, h).toFixed(1));
          }
          css(`s10-g${j}`, "opacity", clamp((t - tt[j] + 0.2) / 0.3));
          const ke = t - (tt[j] + r.paises.length * 0.03 + 0.3);
          css(`s10-e${j}`, "opacity", clamp(ke / 0.3)); css(`s10-x${j}`, "opacity", clamp(ke / 0.3));
        }
        // Al decir «Francia», la barra de España late.
        const kf = t - c["c10-francia"];
        if (kf > 0 && kf < 1.2) attr(`s10-b1-${D.rank.eso.puesto_espana - 1}`, "width", (15 + 5 * Math.abs(Math.sin(kf * 8))).toFixed(1));
        sube("c10-a", t, c["c10-25"]); sube("c10-b", t, c["c10-25"] + 0.3); sube("c10-c", t, c["c10-francia"]);
        persona("s10-f", t, { x: 120, y: 1440, s: 0.8, mira: 1, vivo: true, charla: e, boca: habla(t, e, "seria"), brazo: [[0, "abajo"], [c["c10-25"] - 0.2, "senala"], [c["c10-francia"], "hombros"]], fase: 1 });
        persona("s10-p", t, { x: 960, y: 1440, s: 0.8, mira: -1, vivo: true, boca: [[0, "seria"], [c["c10-francia"] + 0.2, "o"]], ojos: [[0, "normal"], [c["c10-francia"] + 0.2, "grandes"]], brazo: [[0, "abajo"], [c["c10-francia"] + 0.3, "piensa"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c10-25"], e.c["c10-francia"]]); } },

    // 11 · El padre (aula), con sorna: «¡Mira! Subcampeones de Europa en algo.»
    { n: 11, set: "vacio",
      svg: `<g id="s11-podio" transform="translate(600 1300) scale(1.05)">
          ${[[-150, 150, "ESPAÑA", HOY], [0, 210, "FRANCIA", "#5B6470"], [150, 110, "ALEMANIA", "#9AA6AE"]].map(([x, h, et, col]) => `<rect x="${x - 72}" y="${-h}" width="144" height="${h}" rx="8" fill="${col}"/>${rot(x, -h + 40, et, 22, "#FFFDF8")}`).join("")}
          ${rot(0, 40, "MÁS ALUMNOS POR CLASE EN LA ESO", 18, C.gris)}
          <g id="s11-med" transform="translate(-150 -200)"><path d="M-14 -40 L0 -10 L14 -40" fill="none" stroke="#1F5F8B" stroke-width="8"/><circle r="24" fill="#C9CED3" stroke="#9AA6AE" stroke-width="5"/></g></g>
        ${Array.from({ length: 24 }, (_, k) => `<rect id="s11-cf${k}" x="-6" y="-3" width="12" height="6" rx="2" fill="${["#E07A5F", "#F2CC8F", "#81B29A", "#7FA4B0"][k % 4]}"/>`).join("")}
        ${gente("s11", "ap")}`,
      tarjeta: tarjeta(11, "El padre", `<div class="tit">«¡<mark id="m11">Subcampeones</mark> de Europa!»</div>`, { tono: "hoy" }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("aula", null, t, 0);
        marca("m11", t, c["c11-subcampeones"]);
        pop("s11-podio", t, e.t0 + 0.1, 600, 1300, { s: 1.05 });
        const km = t - c["c11-subcampeones"];
        T("s11-med", -150, -178 - (km > 0 ? 0 : 60), { s: km > 0 ? 1 + 0.15 * Math.max(0, 1 - km * 3) : 0.01 });
        for (let k = 0; k < 24; k++) { const kk = t - c["c11-subcampeones"] - (k % 6) * 0.05; if (kk < 0) { ver(`s11-cf${k}`, false); continue; }
          T(`s11-cf${k}`, 300 + ((k * 97) % 480) + Math.sin(kk * 4 + k) * 20, 760 + kk * 260 + (k % 5) * 30, { s: 1, r: kk * 300 + k * 40, op: clamp(2 - kk) }); }
        persona("s11-a", t, { x: 150, y: 1440, s: 0.66, mira: 1, vivo: true, boca: [[0, "o"], [c["c11-subcampeones"] + 0.3, "sonrisa"]], ojos: [[0, "grandes"], [c["c11-subcampeones"] + 0.3, "felices"]], brazo: [[0, "abajo"]], fase: 1 });
        persona("s11-p", t, { x: 995, y: 1440, s: 0.8, mira: -1, vivo: true, charla: e, boca: habla(t, e, "sonrisa"), ojos: [[0, "felices"]],
          brazo: [[0, "abajo"], [c["c11-mira"], "arriba"], [c["c11-subcampeones"], "hombros"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c11-subcampeones"]], { acerca: 0.07 }); } },

    // 12 · El alumno (academia): «Y encima, mi padre me paga una academia.»
    { n: 12, set: "vacio",
      svg: gente("s12", "ap", { a: MOCHILA }),
      tarjeta: tarjeta(12, "El alumno", `<div class="tit">«Y encima, <mark id="m12">academia</mark>»</div>`, { tono: "hoy" }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("academia", "aula", t, e.t0);
        marca("m12", t, c["c12-academia"]);
        const w = ruta(t, [[e.t0 + 0.1, -100], [e.t0 + 1.1, 300]]);
        persona("s12-a", t, { x: w.x, y: 1440, s: 0.66, anda: w.anda, mira: 1, vivo: true, charla: e, boca: habla(t, e, "seria"), brazo: [[0, "sujeta"], [c["c12-academia"] - 0.2, "hombros"]], fase: 1 });
        persona("s12-p", t, { x: 830, y: 1440, s: 0.8, mira: -1, vivo: true, boca: [[0, "seria"]], brazo: [[0, "abajo"], [c["c12-academia"], "empuja"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c12-academia"]]); } },

    // 13 · El padre (academia): «Pago dos veces. Y como yo, muchos: los hogares gastan un 26 % más en la secundaria de sus hijos que en 2016.»
    { n: 13, set: "vacio",
      svg: `${panel(300, 820, 480, 400)}${D.familias.map((v, i) => { const n = Math.round(v / 10); return `<g transform="translate(${440 + i * 200} 1120)">${Array.from({ length: n }, (_, k) => `<g id="s13-m${i}-${k}" transform="translate(0 ${-k * 16}) scale(1.6 .7)">${monedaEuro(`s13-me${i}-${k}`, 20)}</g>`).join("")}
          <g id="s13-v${i}">${rot(0, -n * 16 - 34, miles(v) + " €", 30, i ? HOY : ANTES_T)}</g>${rot(0, 62, ["2016", "2025"][i], 30, C.gris)}</g>`; }).join("")}
        ${rot(540, 1206, "GASTO MEDIO POR HOGAR EN ENSEÑANZA SECUNDARIA", 17, C.gris)}${gente("s13", "ap")}`,
      tarjeta: tarjeta(13, "Gasto medio por hogar en enseñanza secundaria, en euros de 2025", `${vs(13, D.familias.map((v) => miles(v) + "&nbsp;€"), ["en 2016", "en 2025"])}
        <div class="nota">ESO, bachillerato y FP de grado medio</div>`, { fuente: F_FAM, icono: bandera(44) }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("academia", null, t, 0);
        const tt = [c["c13-26"] - 0.3, c["c13-26"] + 0.2];
        for (let i = 0; i < 2; i++) {
          const n = Math.round(D.familias[i] / 10);
          for (let k = 0; k < n; k++) { const t0 = tt[i] + k * 0.05; if (t < t0) { ver(`s13-m${i}-${k}`, false); continue; } T(`s13-m${i}-${k}`, 0, -k * 16 - 90 * (1 - fuera((t - t0) / 0.22)), { sx: 1.6, sy: 0.7, op: clamp((t - t0) * 6) }); }
          css(`s13-v${i}`, "opacity", clamp((t - tt[i] - n * 0.05) / 0.3));
        }
        sube("c13-a", t, tt[0]); sube("c13-b", t, tt[1]);
        persona("s13-a", t, { x: 170, y: 1440, s: 0.66, mira: 1, vivo: true, boca: [[0, "seria"]], brazo: [[0, "abajo"], [c["c13-26"] + 0.3, "hombros"]], fase: 1 });
        persona("s13-p", t, { x: 930, y: 1440, s: 0.8, mira: -1, vivo: true, charla: e, boca: habla(t, e, "seria"), brazo: [[0, "abajo"], [c["c13-dos"], "arriba"], [c["c13-26"] - 0.2, "senala"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c13-dos"], e.c["c13-26"]]); } },

    // 14 · El alumno, a cámara (pasillo del instituto): «Impuestos de récord y aprendemos menos que en 2015. ¿Nos tenemos que conformar? ¿Tú qué opinas?»
    { n: 14, set: "vacio",
      svg: `<g id="s14-bal" transform="translate(420 1300) scale(.75)">${balanza("s14-b", ["LO QUE PAGAS", `${[0, 1, 2].map((k) => `<g transform="translate(${(k - 1) * 46} ${-20 - k * 6}) scale(.5)">${billete("s14-bi" + k)}</g>`).join("")}`],
          ["LO QUE APRENDEN", `<g transform="translate(0 -26)">${libro("s14-li", "#5E8C99")}</g>`])}</g>
        ${gente("s14", "a", { a: MOCHILA })}`,
      tarjeta: tarjeta(14, "Te toca", `<div class="tit" style="font-size:58px">Impuestos de récord y aprendemos menos. ¿Nos tenemos que <mark id="m14">conformar</mark>?</div><div class="sub" id="c14-sub">¿Tú qué opinas? Te leo en los comentarios.</div>`),
      fn: function (t, e) {
        const c = e.c;
        ambiente("pasilloInsti", "academia", t, e.t0);
        const a = -14 * rebote(clamp((t - c["c14-record"]) / 0.6)) + 1.5 * Math.sin(t * 3) * (t > c["c14-record"] ? 1 : 0), r = a * Math.PI / 180;
        attr("s14-b-b", "transform", `rotate(${a.toFixed(2)} 0 -420)`);
        T("s14-b-pi", -300 * Math.cos(r), -420 - 300 * Math.sin(r) + 150, {}); T("s14-b-pd", 300 * Math.cos(r), -420 + 300 * Math.sin(r) + 150, {});
        marca("m14", t, c["c14-conformar"]); sube("c14-sub", t, c["c14-tu"] - 0.2);
        persona("s14-a", t, { x: 900, y: 1440, s: 0.74, mira: [[0, -1], [c["c14-conformar"], 0]], vivo: true, charla: e, boca: habla(t, e, "seria"),
          brazo: [[0, "sujeta"], [c["c14-record"] - 0.2, "senala"], [c["c14-tu"], "hombros"]], incl: [[0, 0], [c["c14-conformar"], -6], [c["c14-tu"], 0]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c14-record"], e.c["c14-conformar"]]); } },
  ];
}
