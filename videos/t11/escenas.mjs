// Escenas de T11 («¿Pagamos más para esperar más?», sanidad 2016 frente a hoy) en estilo «limpio».
// Bruno, 21-11-2026: entornos más descriptivos y del tema, protagonistas del área, historia y no solo datos, contundente:
// lo que pagamos en impuestos frente al servicio que recibimos. Personajes inventados, con volumen y vivos:
//   · «paciente»: unos 58 años, rodilla mal, muleta (cazadora marrón, bigote y canas).
//   · «medica»: médica de familia de unos 45 años (bata blanca y estetoscopio).
//   · «enfermero»: enfermero de planta de unos 32 años (pijama verde).
// Decorados nuevos (diseno/sanidad.mjs): sala de espera del centro de salud → consulta → pasillo del hospital → clínica privada → sala.
/* eslint-disable no-undef */

import { C, persona, tarjeta, nomina, monedaEuro } from "../../diseno/limpio.mjs";
import { bandera } from "../../diseno/barrio.mjs";
import { ambientes } from "../../diseno/sueno.mjs";
import { billete } from "../../diseno/casa.mjs";
import { DECORADOS_T11, BATA, PIJAMA, MULETA, TARJETA_SEGURO, VOLANTE, calendarioEspera, balanza, cruzVerde } from "../../diseno/sanidad.mjs";

export const ESTILO = "limpio";
const F_LE = "Dato oficial: Ministerio de Sanidad (listas de espera del Sistema Nacional de Salud)";
const F_IMP = "Cálculo propio · Eurostat (impuestos y cotizaciones recaudados) · INE (IPC y población)";
const F_GAS = "Cálculo propio · Eurostat (gasto de las administraciones por funciones) · INE (IPC y población)";
const F_MED = "Dato oficial: Eurostat (profesionales sanitarios)";
const F_SEG = "Cálculo propio · INE (Encuesta de Presupuestos Familiares e IPC)";

export function datos(d) {
  const e = d.espera;
  return {
    consultas: [e.consultas_dias["2016"], e.consultas_dias["2025"]], quirurgica: [e.quirurgica_dias["2016"], e.quirurgica_dias["2025"]],
    pacientes: [e.quirurgica_pacientes["2016"], e.quirurgica_pacientes["2025"]],
    impuestos: [d.pagamos.por_habitante_eur_de_2025["2016"], d.pagamos.por_habitante_eur_de_2025["2025"]],
    gasto: [d.gasto_sanidad.por_habitante_eur_de_2025["2016"], d.gasto_sanidad.por_habitante_eur_de_2025["2024"]],
    medicos: [d.personal.medicos["2016"], d.personal.medicos["2024"]],
    seguro: [d.bolsillo.seguro_de_enfermedad.eur_de_2025["2016"], d.bolsillo.seguro_de_enfermedad.eur_de_2025["2025"]],
  };
}

export const capas = () => ambientes(DECORADOS_T11);

// ------------------------------------------------------------------ personajes nuevos (inventados), con volumen
const PACIENTE = { pelo: "corto", canas: true, barba: false, bigote: true, colorPelo: "#7A6E66", colorBigote: "#8C8279", ropa: ["#9C6B3C", "#7E5530"], piel: "#EFC3A0", volumen: true };
const MEDICA = { pelo: "largo", canas: false, barba: false, colorPelo: "#5A3A26", ropa: ["#F7F8F5", "#DADFDB"], encima: BATA, piel: "#F3CDAF", volumen: true };
const ENFERMERO = { pelo: "corto", canas: false, barba: false, colorPelo: "#2A1E16", ropa: ["#5E9E8F", "#4A8274"], encima: PIJAMA, piel: "#D9A882", volumen: true };
const QUIEN = { p: PACIENTE, m: MEDICA, e: ENFERMERO };
// Personajes de un plano: «<plano>-<p|m|e>», con lo que lleven en la mano en el grupo «<plano>-<p|m|e>-mano».
const gente = (n, quien, manos = {}) => quien.split("").map((k) => persona(`${n}-${k}`, "hoy", { ...QUIEN[k], mano: manos[k] ? `<g id="${n}-${k}-mano">${manos[k]}</g>` : undefined })).join("");
const NOMINA_MANO = `<g transform="translate(10 -50) scale(.6)">${nomina("nm11")}</g>`;

// ------------------------------------------------------------------ piezas de los datos
const VERDE = "#3F8F6B", ANTES = "#C8902E", ANTES_T = "#8A6316", HOY = "#B3261E";
const panel = (x, y, w, h) => `<rect x="${x + 8}" y="${y + 12}" width="${w}" height="${h}" rx="26" fill="#3C2814" opacity=".10"/><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="26" fill="#FFFDF8" opacity=".96"/>`;
const rot = (x, y, t, tam, color, id = "", ancla = "middle") => `<text ${id ? `id="${id}"` : ""} x="${x}" y="${y}" text-anchor="${ancla}" font-family="Cap" font-weight="800" font-size="${tam}" fill="${color}">${t}</text>`;
const miles = (v) => String(Math.round(v)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
const vs = (n, vals, labs, tam = 72) => `<div class="vs">${vals.map((v, i) => `<div class="col"><div class="v ${i ? "t-hoy" : "t-pasado"}" id="c${n}-${"ab"[i]}" style="font-size:${tam}px">${v}</div><div class="n">${labs[i]}</div></div>`).join("")}</div>`;
// Figura pequeña de una cola (cada una, 50.000 personas). Origen: los pies.
const fig = (id, col) => `<g id="${id}"><rect x="-13" y="-46" width="26" height="34" rx="10" fill="${col}"/><circle cx="0" cy="-58" r="11" fill="#EBC3A0"/><rect x="-11" y="-14" width="9" height="14" rx="4" fill="#4A5A6A"/><rect x="2" y="-14" width="9" height="14" rx="4" fill="#4A5A6A"/></g>`;
// Bata blanca pequeña (médicos por habitante).
const bata = (id) => `<g id="${id}"><rect x="-18" y="-58" width="36" height="46" rx="12" fill="#FFFFFF" stroke="#9AA6AE" stroke-width="3"/><path d="M-6 -58 L0 -40 L6 -58" fill="none" stroke="#9AA6AE" stroke-width="3"/>
  <circle cx="0" cy="-72" r="13" fill="#EBC3A0"/><rect x="-14" y="-14" width="11" height="14" rx="4" fill="#4A5A6A"/><rect x="3" y="-14" width="11" height="14" rx="4" fill="#4A5A6A"/></g>`;
// Tarjeta de seguro pequeña (de un montón).
const tarjetita = (id) => `<g id="${id}"><rect x="-56" y="-18" width="112" height="36" rx="7" fill="#7C9A7E" stroke="#FFFFFF" stroke-width="3"/><rect x="-44" y="-10" width="22" height="14" rx="3" fill="#F4D98B"/></g>`;

export function escenas(D) {
  return [
    // 1 · El paciente (sala de espera): «¿Pagas más impuestos que en 2016? Yo sí. Y aquí sigo, esperando.»
    { n: 1, set: "vacio",
      svg: gente("s1", "p", { p: MULETA }),
      tarjeta: tarjeta(1, "Sanidad · 2016 frente a hoy", `<div class="tit" style="font-size:70px">¿Pagamos <mark id="m1">más</mark> para esperar más?</div>`, { icono: bandera(44) }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("sala", null, t, 0);
        marca("m1", t, c["c1-impuestos"]);
        // El reloj de la sala corre: el tiempo de espera pasa volando.
        attr("sala-rm", "transform", `rotate(${(t * 220) % 360})`); attr("sala-rh", "transform", `rotate(${(t * 18) % 360})`);
        css("sala-pant-f", "opacity", Math.floor(t * 2) % 2 ? 1 : 0.25);
        const v = ruta(t, [[0.1, 1220], [1.4, 860]]);
        persona("s1-p", t, { x: v.x, y: 1440, s: 0.8, anda: v.anda, mira: -1, vivo: true, charla: e, boca: habla(t, e, "seria"), ojos: [[0, "normal"], [c["c1-si"], "felices"], [c["c1-esperando"] - 0.3, "normal"]],
          brazo: [[0, "sujeta"], [c["c1-si"] - 0.1, "senala"], [c["c1-esperando"] - 0.2, "hombros"]], incl: [[0, 0], [c["c1-esperando"], -6]], espejo: true, fase: 1 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c1-si"]]); } },

    // 2 · La médica (consulta): «Lo de su rodilla es del traumatólogo. Le derivo.»
    { n: 2, set: "vacio",
      svg: gente("s2", "mp", { p: MULETA }),
      tarjeta: tarjeta(2, "La médica de familia", `<div class="tit">«Le derivo al <mark id="m2">traumatólogo</mark>»</div>`, { tono: "pasado" }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("consulta", "sala", t, e.t0);
        marca("m2", t, c["c2-derivo"]);
        attr("cons-volante", "height", (80 * clamp((t - c["c2-derivo"]) / 0.8)).toFixed(1));
        persona("s2-m", t, { x: 230, y: 1440, s: 0.8, mira: 1, vivo: true, charla: e, boca: habla(t, e), brazo: [[0, "abajo"], [c["c2-rodilla"] - 0.2, "senala"], [c["c2-derivo"], "sujeta"]], fase: 1 });
        persona("s2-p", t, { x: 880, y: 1440, s: 0.8, mira: -1, vivo: true, boca: [[0, "seria"], [c["c2-derivo"] + 0.3, "o"]], brazo: [[0, "sujeta"]], incl: [[0, 0], [c["c2-rodilla"], 5]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c2-derivo"]]); } },

    // 3 · El paciente (consulta), con el volante: «¿Y cuánto tardan?»
    { n: 3, set: "vacio",
      svg: gente("s3", "mp", { p: VOLANTE }),
      tarjeta: tarjeta(3, "El paciente", `<div class="tit">«¿Y cuánto <mark id="m3">tardan</mark>?»</div>`, { tono: "hoy" }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("consulta", null, t, 0);
        marca("m3", t, c["c3-tardan"]);
        attr("cons-volante", "height", 0);
        persona("s3-m", t, { x: 230, y: 1440, s: 0.8, mira: 1, vivo: true, boca: [[0, "sonrisa"], [c["c3-tardan"] + 0.2, "seria"]], brazo: [[0, "sujeta"], [c["c3-tardan"] + 0.2, "hombros"]], fase: 1 });
        persona("s3-p", t, { x: 880, y: 1440, s: 0.8, mira: -1, vivo: true, charla: e, boca: habla(t, e, "o"), brazo: [[0, "sujeta"], [c["c3-tardan"] - 0.2, "arriba"]], incl: [[0, 0], [c["c3-tardan"], 7]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c3-tardan"]]); } },

    // 4 · La médica (consulta): «Para la primera cita con el especialista, 102 días de media. En 2016 eran 72.»
    { n: 4, set: "vacio",
      svg: `<g id="s4-cal">${calendarioEspera("s4-c", D.consultas[1])}</g>
        <g id="s4-nota"><rect x="-150" y="-52" width="300" height="104" rx="14" fill="#FFE58A" transform="rotate(-4)"/>${rot(0, -8, "EN 2016:", 28, ANTES_T)}${rot(0, 36, D.consultas[0] + " DÍAS", 38, ANTES_T)}</g>
        ${gente("s4", "mp", { p: VOLANTE })}`,
      tarjeta: tarjeta(4, "Espera para la primera cita con el especialista", `${vs(4, D.consultas.map((v) => v + "&nbsp;días"), ["en 2016", "en 2025"])}
        <div class="nota">Media del Sistema Nacional de Salud, a final de cada año</div>`, { fuente: F_LE, icono: bandera(44) }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("consulta", null, t, 0);
        // El calendario corre de 0 a 102 días; al decir «72», aparece la nota de 2016.
        const a = c["c4-cita"], b = c["c4-102"] + 0.2, k = fuera((t - a) / (b - a)), n = Math.round(k * D.consultas[1]);
        txt("s4-c-n", String(Math.max(0, n)));
        pop("s4-cal", t, e.t0 + 0.2, 540, 1010, { s: 1 });
        if (t > b && t < b + 0.4) T("s4-cal", 540, 1010, { s: 1 + 0.06 * Math.sin((t - b) / 0.4 * Math.PI) });
        pop("s4-nota", t, c["c4-72"] - 0.1, 560, 1250, { s: 0.85, r: -4 });
        sube("c4-b", t, c["c4-102"]); sube("c4-a", t, c["c4-72"]);
        persona("s4-m", t, { x: 170, y: 1440, s: 0.8, mira: 1, vivo: true, charla: e, boca: habla(t, e), brazo: [[0, "abajo"], [c["c4-cita"], "senala"], [c["c4-72"], "arriba"]], fase: 1 });
        persona("s4-p", t, { x: 920, y: 1440, s: 0.8, mira: -1, vivo: true, salta: c["c4-102"] + 0.3, boca: [[0, "seria"], [c["c4-102"] + 0.2, "o"]], ojos: [[0, "normal"], [c["c4-102"] + 0.2, "grandes"]],
          brazo: [[0, "sujeta"], [c["c4-102"] + 0.4, "arriba"], [c["c4-72"] + 0.3, "piensa"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c4-102"], e.c["c4-72"]]); } },

    // 5 · El enfermero (pasillo del hospital): «Y si hay que operar, 122 días de media. En 2016, 115.»
    { n: 5, set: "vacio",
      svg: `${panel(220, 980, 590, 250)}${D.quirurgica.map((v, i) => `<g transform="translate(0 ${1060 + i * 100})">${rot(325, 12, ["2016", "2025"][i], 28, C.gris, "", "end")}
          <rect id="s5-r${i}" x="340" y="-24" width="0" height="48" rx="10" fill="${i ? HOY : ANTES}"/><g id="s5-v${i}">${rot(790, 12, v + " días", 30, i ? HOY : ANTES_T, "", "end")}</g></g>`).join("")}
        ${rot(540, 1212, "DÍAS DE ESPERA PARA OPERARSE", 19, C.gris)}${gente("s5", "ep", { p: VOLANTE })}`,
      tarjeta: tarjeta(5, "Espera para operarse", `${vs(5, D.quirurgica.map((v) => v + "&nbsp;días"), ["en 2016", "en 2025"])}
        <div class="nota">Media del Sistema Nacional de Salud, a final de cada año</div>`, { fuente: F_LE, icono: bandera(44) }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("pasillo", "consulta", t, e.t0);
        const tt = [c["c5-115"], c["c5-122"]];
        for (let i = 0; i < 2; i++) { attr(`s5-r${i}`, "width", (D.quirurgica[i] * 2.4 * suave((t - tt[i]) / 0.5)).toFixed(1)); css(`s5-v${i}`, "opacity", clamp((t - tt[i] - 0.3) / 0.3)); }
        sube("c5-b", t, c["c5-122"]); sube("c5-a", t, c["c5-115"]);
        persona("s5-e", t, { x: 150, y: 1440, s: 0.8, mira: 1, vivo: true, charla: e, boca: habla(t, e), brazo: [[0, "abajo"], [c["c5-operar"], "senala"], [c["c5-115"], "hombros"]], fase: 1 });
        const q = ruta(t, [[e.t0 + 0.1, 1180], [e.t0 + 1.0, 975]]);
        persona("s5-p", t, { x: q.x, y: 1440, s: 0.8, anda: q.anda, mira: -1, vivo: true, boca: [[0, "seria"], [c["c5-122"] + 0.2, "o"]], brazo: [[0, "sujeta"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c5-122"]]); } },

    // 6 · El enfermero (pasillo): «Y en la lista para operarse ya hay casi 854.000 personas: 240.000 más que en 2016.»
    { n: 6, set: "vacio",
      svg: `${panel(210, 930, 660, 320)}${D.pacientes.map((v, i) => { const n = Math.round(v / 50000); return `<g transform="translate(0 ${1060 + i * 120})">${rot(300, -10, ["2016", "2025"][i], 28, C.gris, "", "end")}
          ${Array.from({ length: n }, (_, k) => `<g transform="translate(${336 + k * 31} 0)">${fig(`s6-f${i}-${k}`, i ? "#C77B6B" : "#C9B37E")}</g>`).join("")}</g>`; }).join("")}
        ${rot(540, 1232, "CADA FIGURA, 50.000 PERSONAS EN LISTA PARA OPERARSE", 18, C.gris)}${gente("s6", "ep", { p: VOLANTE })}`,
      tarjeta: tarjeta(6, "Personas en lista de espera para operarse", `${vs(6, D.pacientes.map(miles), ["en 2016", "en 2025"], 68)}
        <div class="nota">Cada figura, 50.000 personas</div>`, { fuente: F_LE, icono: bandera(44) }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("pasillo", null, t, 0);
        const tt = [c["c6-lista"], c["c6-854"] - 0.1];
        for (let i = 0; i < 2; i++) {
          const n = Math.round(D.pacientes[i] / 50000);
          for (let k = 0; k < n; k++) {
            const t0 = tt[i] + k * 0.06, kk = (t - t0) / 0.25;
            if (kk < 0) { ver(`s6-f${i}-${k}`, false); continue; }
            T(`s6-f${i}-${k}`, 0, -40 * (1 - fuera(kk)) - (k >= 12 && i === 1 && t > c["c6-240"] ? 6 * Math.abs(Math.sin((t - k * 0.1) * 6)) : 0), { s: 1, op: clamp(kk * 3) });
          }
        }
        sube("c6-b", t, c["c6-854"]); sube("c6-a", t, c["c6-240"]);
        persona("s6-e", t, { x: 120, y: 1440, s: 0.8, mira: 1, vivo: true, charla: e, boca: habla(t, e), brazo: [[0, "abajo"], [c["c6-lista"], "senala"], [c["c6-240"], "arriba"]], fase: 1 });
        persona("s6-p", t, { x: 960, y: 1440, s: 0.8, mira: -1, vivo: true, boca: [[0, "seria"], [c["c6-854"] + 0.2, "o"]], ojos: [[0, "normal"], [c["c6-854"] + 0.2, "grandes"]], brazo: [[0, "sujeta"], [c["c6-240"] + 0.2, "piensa"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c6-854"], e.c["c6-240"]]); } },

    // 7 · El paciente (pasillo), con la nómina: «¡Pero si pago más que nunca!»
    { n: 7, set: "vacio",
      svg: `${[0, 1, 2, 3, 4, 5].map((k) => `<g id="s7-mo${k}">${monedaEuro(`s7-me${k}`, 22)}</g>`).join("")}${gente("s7", "ep", { p: NOMINA_MANO })}`,
      tarjeta: tarjeta(7, "El paciente", `<div class="tit">«¡Pero si pago <mark id="m7">más que nunca</mark>!»</div>`, { tono: "hoy" }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("pasillo", null, t, 0);
        marca("m7", t, c["c7-nunca"]);
        // De la nómina caen monedas.
        for (let k = 0; k < 6; k++) { const t0 = c["c7-pago"] + k * 0.12, kk = t - t0; if (kk < 0) { ver(`s7-mo${k}`, false); continue; } T(`s7-mo${k}`, 840 - k * 26 + Math.sin(k * 7) * 30, Math.min(1420, 1010 + 900 * kk * kk), { s: 1, r: kk * 400 }); }
        persona("s7-e", t, { x: 150, y: 1440, s: 0.8, mira: 1, vivo: true, boca: [[0, "seria"], [c["c7-nunca"] + 0.2, "o"]], brazo: [[0, "abajo"], [c["c7-nunca"] + 0.3, "hombros"]], fase: 1 });
        persona("s7-p", t, { x: 880, y: 1440, s: 0.8, mira: -1, vivo: true, charla: e, salta: c["c7-pago"] - 0.1, boca: habla(t, e, "grande"), ojos: [[0, "grandes"]], brazo: [[0, "sujeta"], [c["c7-pago"] - 0.2, "arriba"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c7-pago"]], { acerca: 0.07 }); } },

    // 8 · La médica (consulta): «Ya. Por habitante, se recauda un 25 % más que en 2016, ya descontada la inflación. Es récord.»
    { n: 8, set: "vacio",
      svg: `${panel(300, 800, 480, 420)}${D.impuestos.map((v, i) => { const n = Math.round(v / 750); return `<g transform="translate(${430 + i * 220} 1130)">${Array.from({ length: n }, (_, k) => `<g id="s8-b${i}-${k}" transform="translate(0 ${-k * 15}) scale(.62)">${billete(`s8-bb${i}${k}`)}</g>`).join("")}
          <g id="s8-v${i}">${rot(0, -n * 15 - 40, miles(v) + " €", 28, i ? HOY : ANTES_T)}</g>${rot(0, 62, ["2016", "2025"][i], 30, C.gris)}</g>`; }).join("")}
        <g id="s8-rec"><rect x="-130" y="-46" width="260" height="92" rx="12" fill="none" stroke="${HOY}" stroke-width="9"/>${rot(0, 20, "RÉCORD", 56, HOY)}</g>
        ${rot(540, 1206, "IMPUESTOS Y COTIZACIONES POR HABITANTE, EN EUROS DE HOY", 17, C.gris)}${gente("s8", "me")}`,
      tarjeta: tarjeta(8, "Impuestos y cotizaciones por habitante, en euros de 2025", `${vs(8, D.impuestos.map((v) => miles(v) + "&nbsp;€"), ["en 2016", "en 2025"], 66)}
        <div class="nota">La recaudación más alta de la serie, también descontada la inflación</div>`, { fuente: F_IMP, icono: bandera(44) }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("consulta", "pasillo", t, e.t0);
        const tt = [c["c8-25"] - 0.3, c["c8-25"] + 0.2];
        for (let i = 0; i < 2; i++) {
          const n = Math.round(D.impuestos[i] / 750);
          for (let k = 0; k < n; k++) {
            const t0 = tt[i] + k * 0.04, kk = (t - t0) / 0.22;
            if (kk < 0) { ver(`s8-b${i}-${k}`, false); continue; }
            ver(`s8-b${i}-${k}`, true);
            attr(`s8-b${i}-${k}`, "transform", `translate(0 ${(-k * 15 - 110 * (1 - fuera(kk))).toFixed(1)}) scale(.62)`);
          }
          css(`s8-v${i}`, "opacity", clamp((t - tt[i] - n * 0.04) / 0.3));
        }
        pop("s8-rec", t, c["c8-record"] - 0.05, 650, 1010, { s: 1, r: -10, d: 0.25 });
        sube("c8-a", t, tt[0]); sube("c8-b", t, tt[1]);
        persona("s8-m", t, { x: 150, y: 1440, s: 0.8, mira: 1, vivo: true, charla: e, boca: habla(t, e, "seria"), brazo: [[0, "abajo"], [c["c8-25"] - 0.2, "senala"], [c["c8-record"], "arriba"]], fase: 1 });
        persona("s8-e", t, { x: 930, y: 1440, s: 0.8, mira: -1, vivo: true, boca: [[0, "seria"], [c["c8-record"] + 0.2, "o"]], brazo: [[0, "abajo"], [c["c8-record"] + 0.2, "hombros"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c8-25"], e.c["c8-record"]]); } },

    // 9 · El enfermero (consulta): «Y en sanidad se gasta un 17 % más por habitante.»
    { n: 9, set: "vacio",
      svg: `${panel(320, 800, 440, 430)}${D.gasto.map((v, i) => `<g transform="translate(${450 + i * 180} 1130)"><rect id="s9-r${i}" x="-60" y="0" width="120" height="0" rx="14" fill="${i ? HOY : ANTES}"/>
          <g id="s9-x${i}">${cruzVerde(0, 0, 0.45, "#FFFFFF")}</g><g id="s9-v${i}">${rot(0, -v * 0.13 - 30, miles(v) + " €", 28, i ? HOY : ANTES_T)}</g>${rot(0, 52, ["2016", "2024"][i], 30, C.gris)}</g>`).join("")}
        ${rot(540, 1214, "GASTO PÚBLICO EN SANIDAD POR HABITANTE", 18, C.gris)}${gente("s9", "me")}`,
      tarjeta: tarjeta(9, "Gasto público en sanidad por habitante, en euros de 2025", `${vs(9, D.gasto.map((v) => miles(v) + "&nbsp;€"), ["en 2016", "en 2024"], 66)}
        <div class="nota">Todas las administraciones. 2024, último año</div>`, { fuente: F_GAS, icono: bandera(44) }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("consulta", null, t, 0);
        const tt = [c["c9-17"] - 0.2, c["c9-17"] + 0.3];
        for (let i = 0; i < 2; i++) {
          const h = D.gasto[i] * 0.13 * suave((t - tt[i]) / 0.5);
          attr(`s9-r${i}`, "y", (-h).toFixed(1)); attr(`s9-r${i}`, "height", h.toFixed(1));
          T(`s9-x${i}`, 0, -h + 34, { s: 1, op: h > 60 ? 1 : 0 });
          css(`s9-v${i}`, "opacity", clamp((t - tt[i] - 0.4) / 0.3));
        }
        sube("c9-a", t, tt[0]); sube("c9-b", t, tt[1]);
        persona("s9-m", t, { x: 150, y: 1440, s: 0.8, mira: 1, vivo: true, boca: "seria", brazo: [[0, "abajo"], [c["c9-17"] + 0.3, "piensa"]], fase: 1 });
        persona("s9-e", t, { x: 930, y: 1440, s: 0.8, mira: -1, vivo: true, charla: e, boca: habla(t, e), brazo: [[0, "abajo"], [c["c9-sanidad"], "senala"], [c["c9-17"] + 0.3, "arriba"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c9-17"]]); } },

    // 10 · La médica (consulta): «Y hay un 21 % más de médicos. Aun así, se espera más.»
    { n: 10, set: "vacio",
      svg: `${panel(240, 850, 600, 360)}${D.medicos.map((v, i) => { const n = Math.ceil(v / 50); return `<g transform="translate(0 ${1010 + i * 140})">${rot(330, -20, ["2016", "2024"][i], 28, C.gris, "", "end")}
          ${Array.from({ length: n }, (_, k) => `<g transform="translate(${370 + k * 36} 0)">${bata(`s10-b${i}-${k}`)}</g>`).join("")}<g id="s10-v${i}">${rot(820, -20, Math.round(v), 32, i ? HOY : ANTES_T, "", "end")}</g></g>`; }).join("")}
        ${rot(540, 1192, "MÉDICOS EN EJERCICIO POR CADA 100.000 HABITANTES", 18, C.gris)}${gente("s10", "me")}`,
      tarjeta: tarjeta(10, "Médicos en ejercicio por 100.000 habitantes", `${vs(10, D.medicos.map((v) => Math.round(v)), ["en 2016", "en 2024"])}
        <div class="nota">2024, último año</div>`, { fuente: F_MED, icono: bandera(44) }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("consulta", null, t, 0);
        const tt = [c["c10-21"] - 0.3, c["c10-21"] + 0.2];
        for (let i = 0; i < 2; i++) {
          const n = Math.ceil(D.medicos[i] / 50);
          for (let k = 0; k < n; k++) { const t0 = tt[i] + k * 0.05; if (t < t0) { ver(`s10-b${i}-${k}`, false); continue; } T(`s10-b${i}-${k}`, 0, -30 * (1 - fuera((t - t0) / 0.25)), { s: 1, op: clamp((t - t0) * 6) }); }
          css(`s10-v${i}`, "opacity", clamp((t - tt[i] - 0.4) / 0.3));
        }
        sube("c10-a", t, tt[0]); sube("c10-b", t, tt[1]);
        persona("s10-m", t, { x: 150, y: 1440, s: 0.8, mira: 1, vivo: true, charla: e, boca: habla(t, e, "seria"), brazo: [[0, "abajo"], [c["c10-21"] - 0.2, "senala"], [c["c10-espera"], "hombros"]], incl: [[0, 0], [c["c10-espera"], 6]], fase: 1 });
        persona("s10-e", t, { x: 930, y: 1440, s: 0.8, mira: -1, vivo: true, boca: [[0, "seria"]], brazo: [[0, "abajo"], [c["c10-espera"], "piensa"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c10-21"]]); } },

    // 11 · El paciente (clínica privada), con la tarjeta del seguro: «Total, que me hice un seguro privado. Pago dos veces.»
    { n: 11, set: "vacio",
      svg: gente("s11", "ep", { p: TARJETA_SEGURO }),
      tarjeta: tarjeta(11, "El paciente", `<div class="tit">«Pago <mark id="m11">dos veces</mark>»</div>`, { tono: "hoy" }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("clinica", "consulta", t, e.t0);
        marca("m11", t, c["c11-dos"]);
        ver("s11-p-mano", t > c["c11-seguro"] - 0.3);
        persona("s11-e", t, { x: 170, y: 1440, s: 0.8, mira: 1, vivo: true, boca: [[0, "sonrisa"], [c["c11-dos"], "seria"]], brazo: [[0, "abajo"], [c["c11-dos"] + 0.2, "hombros"]], fase: 1 });
        const q = ruta(t, [[e.t0 + 0.1, 1150], [e.t0 + 1.0, 860]]);
        persona("s11-p", t, { x: q.x, y: 1440, s: 0.8, anda: q.anda, mira: -1, vivo: true, charla: e, boca: habla(t, e, "seria"), brazo: [[0, "abajo"], [c["c11-seguro"] - 0.3, "arriba"], [c["c11-dos"], "senala"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c11-dos"]]); } },

    // 12 · El enfermero (clínica privada): «Como tantos: los hogares gastan un 34 % más en seguros de salud que en 2016.»
    { n: 12, set: "vacio",
      svg: `${panel(300, 820, 480, 400)}${D.seguro.map((v, i) => { const n = Math.round(v / 25); return `<g transform="translate(${440 + i * 200} 1120)">${Array.from({ length: n }, (_, k) => `<g transform="translate(${(k % 2) * 6 - 3} ${-k * 16})">${tarjetita(`s12-t${i}-${k}`)}</g>`).join("")}
          <g id="s12-v${i}">${rot(0, -n * 16 - 34, miles(v) + " €", 30, i ? HOY : ANTES_T)}</g>${rot(0, 62, ["2016", "2025"][i], 30, C.gris)}</g>`; }).join("")}
        ${rot(540, 1206, "GASTO MEDIO POR HOGAR EN SEGUROS DE SALUD", 18, C.gris)}${gente("s12", "ep", { p: TARJETA_SEGURO })}`,
      tarjeta: tarjeta(12, "Gasto medio por hogar en seguros de salud, en euros de 2025", `${vs(12, D.seguro.map((v) => miles(v) + "&nbsp;€"), ["en 2016", "en 2025"])}`, { fuente: F_SEG, icono: bandera(44) }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("clinica", null, t, 0);
        const tt = [c["c12-34"] - 0.3, c["c12-34"] + 0.2];
        for (let i = 0; i < 2; i++) {
          const n = Math.round(D.seguro[i] / 25);
          for (let k = 0; k < n; k++) { const t0 = tt[i] + k * 0.045; if (t < t0) { ver(`s12-t${i}-${k}`, false); continue; } T(`s12-t${i}-${k}`, 0, -90 * (1 - fuera((t - t0) / 0.22)), { s: 1, op: clamp((t - t0) * 6) }); }
          css(`s12-v${i}`, "opacity", clamp((t - tt[i] - n * 0.045) / 0.3));
        }
        sube("c12-a", t, tt[0]); sube("c12-b", t, tt[1]);
        persona("s12-e", t, { x: 150, y: 1440, s: 0.8, mira: 1, vivo: true, charla: e, boca: habla(t, e), brazo: [[0, "abajo"], [c["c12-34"] - 0.2, "senala"], [c["c12-seguros"], "arriba"]], fase: 1 });
        persona("s12-p", t, { x: 930, y: 1440, s: 0.8, mira: -1, vivo: true, boca: [[0, "seria"]], brazo: [[0, "sujeta"], [c["c12-34"] + 0.3, "hombros"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c12-34"]]); } },

    // 13 · El paciente, a cámara (sala de espera): «Impuestos de récord y más espera que en 2016. ¿Nos tenemos que conformar? ¿Tú qué opinas?»
    { n: 13, set: "vacio",
      svg: `<g id="s13-bal" transform="translate(470 1300) scale(.8)">${balanza("s13-b", ["LO QUE PAGAS", `${[0, 1, 2].map((k) => `<g transform="translate(${(k - 1) * 46} ${-20 - k * 6}) scale(.5)">${billete("s13-bi" + k)}</g>`).join("")}`],
          ["LO QUE RECIBES", `<g transform="translate(0 -40)"><circle r="34" fill="#FFFFFF" stroke="#5B6470" stroke-width="6"/><rect id="s13-rm" x="-2" y="-28" width="4" height="30" fill="${C.rojo}"/></g>`])}</g>
        ${gente("s13", "p", { p: MULETA })}`,
      tarjeta: tarjeta(13, "Te toca", `<div class="tit" style="font-size:58px">Impuestos de récord y más espera. ¿Nos tenemos que <mark id="m13">conformar</mark>?</div><div class="sub" id="c13-sub">¿Tú qué opinas? Te leo en los comentarios.</div>`),
      fn: function (t, e) {
        const c = e.c;
        ambiente("sala", "clinica", t, e.t0);
        attr("sala-rm", "transform", `rotate(${(t * 220) % 360})`); attr("sala-rh", "transform", `rotate(${(t * 18) % 360})`);
        attr("s13-rm", "transform", `rotate(${(t * 300) % 360} 0 0)`);
        // La balanza: con «récord», el plato de lo que pagas baja; con «espera», el de lo que recibes sube.
        const a = -14 * rebote(clamp((t - c["c13-record"]) / 0.6)) + 1.5 * Math.sin(t * 3) * (t > c["c13-record"] ? 1 : 0), r = a * Math.PI / 180;
        attr("s13-b-b", "transform", `rotate(${a.toFixed(2)} 0 -420)`);
        T("s13-b-pi", -300 * Math.cos(r), -420 - 300 * Math.sin(r) + 150, {}); T("s13-b-pd", 300 * Math.cos(r), -420 + 300 * Math.sin(r) + 150, {});
        marca("m13", t, c["c13-conformar"]); sube("c13-sub", t, c["c13-tu"] - 0.2);
        persona("s13-p", t, { x: 860, y: 1440, s: 0.8, mira: [[0, -1], [c["c13-conformar"], 0]], vivo: true, charla: e, boca: habla(t, e, "seria"),
          brazo: [[0, "sujeta"], [c["c13-record"] - 0.2, "senala"], [c["c13-tu"], "hombros"]], incl: [[0, 0], [c["c13-conformar"], -6], [c["c13-tu"], 0]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c13-record"], e.c["c13-conformar"]]); } },
  ];
}
