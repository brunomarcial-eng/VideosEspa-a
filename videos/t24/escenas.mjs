// Escenas de T24 («¿Cuántas horas trabajas para llenar el depósito?») en estilo «limpio». Bruno lo eligió el
// 24-11-2026. Precio medio del litro que pagan los hogares (gasolina y gasóleo; INE, EPF y, para octubre de 2026, IPC)
// por un depósito de 50 litros, en horas del sueldo neto mediano: 2007, la crisis (2013), 2016, 2019 y hoy.
//   · «hijo»: 15 años, pelo castaño, sudadera mostaza; lo mira todo en los datos (voz «alumno»).
//   · «padre»: unos 45, bigote y algunas canas, forro polar verde oliva; conductor de toda la vida (voz «maquinista»).
// Decorado (diseno/deposito.mjs): una gasolinera de barrio al atardecer, con el coche familiar en el surtidor y la
// manguera puesta (nada en la mano). El surtidor va contando euros y litros hasta llenar los 50 litros.
/* eslint-disable no-undef */

import { persona, tarjeta, selloOficial } from "../../diseno/limpio.mjs";
import { bandera } from "../../diseno/barrio.mjs";
import { ambientes } from "../../diseno/sueno.mjs";
import { columnasHoras } from "../../diseno/alquiler.mjs";
import { barrasSubida } from "../../diseno/pension.mjs";
import { DECORADOS_T24, pantallaSurtidor, jornada, foto2007, bidon } from "../../diseno/deposito.mjs";

export const ESTILO = "limpio";
const F_DEP = "Cálculo propio · INE (Presupuestos Familiares, IPC y salarios)";
const F_EPF = "INE · Encuesta de Presupuestos Familiares";
const F_IPC = "INE · IPC y Encuesta Trimestral de Coste Laboral";

const miles = (v) => String(Math.round(v)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");

export function datos(d) {
  const F = d.filas, A = ["2007", "2013", "2016", "2019", "hoy"];
  return {
    F, horas: A.map((a) => F[a].horas_deposito), hm: A.map((a) => `${F[a].h} h ${F[a].min}`),
    euros: F.hoy.deposito_euros, litros: d.deposito_litros, precio: F.hoy.euros_litro, sube: d.sube_desde_2025_pct,
    litros07: F["2007"].litros_por_hogar, litros25: F["2025"].litros_por_hogar, baja: -d.litros_por_hogar_baja_desde_2007_pct,
  };
}

export const capas = () => ambientes({ gasolinera: DECORADOS_T24.gasolinera });

// ------------------------------------------------------------------ personajes (inventados), con volumen
const PADRE = { pelo: "corto", canas: true, barba: false, bigote: true, colorPelo: "#3B2A20", colorBigote: "#3B2A20", ropa: ["#6E7B4E", "#5A6640"], piel: "#EDC09A", piel2: "#D9AA84", volumen: true };
const HIJO = { pelo: "corto", canas: false, barba: false, bigote: false, colorPelo: "#5A3A22", ropa: ["#D9A441", "#B8862E"], piel: "#F3CDA9", piel2: "#E0B48F", volumen: true };
const QUIEN = { h: HIJO, p: PADRE };
const gente = (n, quien) => quien.split("").map((k) => persona(`${n}-${k}`, "hoy", QUIEN[k])).join("");

// ------------------------------------------------------------------ tarjetas
const HOY = "#B3261E";
const cita = (n, quien, html) => tarjeta(n, quien, `<div class="tit" style="font-size:64px">${html}</div>`, { tono: "hoy" });
const grande = (n, titulo, cifra, sub, nota, fuente, color = HOY) => tarjeta(n, titulo, `<div class="tit" style="font-size:104px;color:${color};line-height:1" id="c${n}-a">${cifra}</div>
  <div class="sub" id="c${n}-b" style="font-size:42px">${sub}</div>${nota ? `<div class="nota">${nota}</div>` : ""}`, { fuente, icono: bandera(44) });
const vs = (n, titulo, vals, labs, nota, fuente, tam = 96) => tarjeta(n, titulo, `<div class="vs">${vals.map((v, i) => `<div class="col"><div class="v ${i ? "t-hoy" : "t-pasado"}" id="c${n}-${"ab"[i]}" style="font-size:${tam}px">${v}</div><div class="n">${labs[i]}</div></div>`).join("")}</div>
  <div class="nota">${nota}</div>`, { fuente, icono: bandera(44) });

// En cada escena: el decorado, los coches que pasan por la carretera y el surtidor, que cuenta euros y litros desde el
// principio del vídeo hasta llenar los 50 litros (se escribe en cada fn porque las fn se serializan).
export function escenas(D) {
  const hm = D.hm;     // 2007, 2013, 2016, 2019, hoy: «5 h 42»…
  return [
    // 1 · Gancho. El hijo: «¿Cuántas horas tienes que trabajar para llenar el depósito? Porque mi padre ya no lo llena nunca.»
    { n: 1, set: "vacio",
      svg: `${gente("s1", "hp")}${selloOficial("s1-sello")}`,
      tarjeta: tarjeta(1, "El carburante · de 2007 a hoy", `<div class="tit" style="font-size:64px">¿Cuántas horas trabajas para llenar el <mark id="m1">depósito</mark>?</div>`, { icono: bandera(44) }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("gasolinera", null, t, 0);
        vidaFondo("gs", t, { capa: "gasolinera" });
        attr("gs-c0", "transform", `translate(${(-300 + ((t * 260) % 2200)).toFixed(0)} 990) scale(.42)`);
        attr("gs-c1", "transform", `translate(${(1500 - ((t * 200 + 900) % 2200)).toFixed(0)} 960) scale(-.42 .42)`);
        const eur = Math.min(D.euros, Math.max(0, (t - 0.8) * 6.6));
        txt("gs-disp-e", String(Math.round(eur))); txt("gs-disp-l", String(Math.round(eur / D.euros * D.litros)));
        marca("m1", t, c["c1-deposito"]);
        selloAnim("s1-sello", t, c["c1-sello"], 545, 860, { s: 0.75, r: -9 });
        persona("s1-h", t, { x: 250, y: 1440, s: 0.72, mira: 0, vivo: true, charla: e, boca: habla(t, e, "sonrisa"), brazo: [[0, "abajo"], [c["c1-horas"], "senala"], [c["c1-nunca"] - 0.3, "hombros"]], fase: 1 });
        persona("s1-p", t, { x: 900, y: 1440, s: 0.8, mira: -1, vivo: true, boca: [[0, "seria"]], ojos: [[0, "normal"], [c["c1-nunca"], "grandes"]], brazo: [[0, "abajo"], [c["c1-nunca"] + 0.2, "hombros"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c1-deposito"], e.c["c1-nunca"]]); } },

    // 2 · Lo que cree el padre: «Hombre es que llenarlo hoy es como en plena crisis ¿eh? Una barbaridad.»
    { n: 2, set: "vacio",
      svg: `${gente("s2", "hp")}`,
      tarjeta: cita(2, "El padre", `«Como en plena <mark id="m2">crisis</mark>»`),
      fn: function (t, e) {
        const c = e.c;
        ambiente("gasolinera", null, t, 0);
        vidaFondo("gs", t, { capa: "gasolinera" });
        attr("gs-c0", "transform", `translate(${(-300 + ((t * 260) % 2200)).toFixed(0)} 990) scale(.42)`);
        attr("gs-c1", "transform", `translate(${(1500 - ((t * 200 + 900) % 2200)).toFixed(0)} 960) scale(-.42 .42)`);
        const eur = Math.min(D.euros, Math.max(0, (t - 0.8) * 6.6));
        txt("gs-disp-e", String(Math.round(eur))); txt("gs-disp-l", String(Math.round(eur / D.euros * D.litros)));
        marca("m2", t, c["c2-crisis"]);
        persona("s2-h", t, { x: 250, y: 1440, s: 0.72, mira: 1, vivo: true, boca: [[0, "sonrisa"], [c["c2-barbaridad"], "seria"]], brazo: [[0, "abajo"]], fase: 1 });
        persona("s2-p", t, { x: 880, y: 1440, s: 0.8, mira: -1, vivo: true, charla: e, boca: habla(t, e, "seria"), brazo: [[0, "abajo"], [c["c2-crisis"] - 0.3, "senala"], [c["c2-barbaridad"], "arriba"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) {
        const k = suave(clamp((t - e.t0) / 1.2));
        return { z: 1 + 0.16 * k, fx: 540 - 120 * k, fy: 1150 - 180 * k, sy: 1150 - 180 * k };
      } },

    // 3 · El depósito hoy (C). El hijo: «A ver… 50 litros hoy son unos 89 euros. Unas 6 horas y media de curro.»
    { n: 3, set: "vacio",
      svg: `<g transform="translate(540 950) scale(.86)">${pantallaSurtidor("s3-s")}</g>
        <g transform="translate(540 1270)">${jornada("s3-j", "Tu jornada", "6 horas y media", undefined, 700, true)}</g>${gente("s3", "hp")}`,
      tarjeta: grande(3, "Llenar el depósito hoy", `${Math.round(D.euros)}&nbsp;€`, "= 6 horas y media de trabajo",
        `${D.litros} litros a ${D.precio.toFixed(2).replace(".", ",")} € el litro: gasolina y gasóleo, precio medio de los hogares en octubre de 2026. Sueldo neto mediano por hora`, F_DEP),
      fn: function (t, e) {
        const c = e.c;
        ambiente("gasolinera", null, t, 0);
        vidaFondo("gs", t, { capa: "gasolinera" });
        attr("gs-c0", "transform", `translate(${(-300 + ((t * 260) % 2200)).toFixed(0)} 990) scale(.42)`);
        attr("gs-c1", "transform", `translate(${(1500 - ((t * 200 + 900) % 2200)).toFixed(0)} 960) scale(-.42 .42)`);
        txt("gs-disp-e", String(Math.round(D.euros))); txt("gs-disp-l", String(D.litros));
        pop("s3-s", t, e.t0 + 0.05, 0, 0, { s: 1 });
        const k = clamp((t - e.t0 - 0.2) / Math.max(0.3, c["c3-89"] - e.t0 - 0.2));
        txt("s3-s-e", String(Math.round(k * D.euros))); txt("s3-s-l", String(Math.round(k * D.litros)));
        pop("s3-j", t, c["c3-6"] - 0.4, 0, 0, { s: 1 });
        css("s3-j-f", "transform", `scaleX(${(suave(clamp((t - c["c3-6"] + 0.2) / 0.9)) * D.horas[4] / 8).toFixed(3)})`);
        css("s3-j-v", "opacity", clamp((t - c["c3-6"] - 0.5) / 0.3));
        sube("c3-a", t, c["c3-89"]); sube("c3-b", t, c["c3-6"]);
        persona("s3-h", t, { x: 130, y: 1700, s: 0.6, mira: 1, vivo: true, charla: e, boca: habla(t, e, "sonrisa"), brazo: [[0, "abajo"], [c["c3-89"] - 0.2, "senala"], [c["c3-curro"], "hombros"]], fase: 1 });
        persona("s3-p", t, { x: 950, y: 1700, s: 0.66, mira: -1, vivo: true, boca: [[0, "seria"], [c["c3-6"] + 0.3, "o"]], ojos: [[0, "normal"], [c["c3-6"] + 0.3, "grandes"]], brazo: [[0, "abajo"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c3-89"], e.c["c3-6"]]); } },

    // 4 · El padre se reafirma: «¿Ves? Lo que yo te digo… como en la crisis.»
    { n: 4, set: "vacio",
      svg: `${gente("s4", "hp")}`,
      tarjeta: cita(4, "El padre", `«¿Ves? Como en la <mark id="m4">crisis</mark>»`),
      fn: function (t, e) {
        const c = e.c;
        ambiente("gasolinera", null, t, 0);
        vidaFondo("gs", t, { capa: "gasolinera" });
        attr("gs-c0", "transform", `translate(${(-300 + ((t * 260) % 2200)).toFixed(0)} 990) scale(.42)`);
        attr("gs-c1", "transform", `translate(${(1500 - ((t * 200 + 900) % 2200)).toFixed(0)} 960) scale(-.42 .42)`);
        txt("gs-disp-e", String(Math.round(D.euros))); txt("gs-disp-l", String(D.litros));
        marca("m4", t, c["c4-crisis"]);
        persona("s4-h", t, { x: 250, y: 1440, s: 0.72, mira: 1, vivo: true, boca: [[0, "seria"]], brazo: [[0, "abajo"]], fase: 1 });
        persona("s4-p", t, { x: 880, y: 1440, s: 0.8, mira: -1, vivo: true, charla: e, boca: habla(t, e, "sonrisa"), ojos: [[0, "normal"], [c["c4-crisis"], "felices"]], brazo: [[0, "abajo"], [c["c4-ves"], "senala"], [c["c4-crisis"], "hombros"]], salta: c["c4-ves"], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c4-ves"]]); } },

    // 5 · Las horas de cada año. El hijo: «Casi. En plena crisis eran casi 7 horas… pero en 2016 poco más de 5.»
    { n: 5, set: "vacio",
      svg: `<g transform="translate(540 1330)">${columnasHoras("s5-c", D.horas, ["2007", "2013", "2016", "2019", "Hoy"], { W: 740, H: 360, tam: 36, fmt: (v) => hm[D.horas.indexOf(v)] })}</g>${gente("s5", "hp")}`,
      tarjeta: vs(5, "Horas de trabajo para llenar 50 litros", [hm[1], hm[4]], ["en plena crisis (2013)", "hoy (octubre de 2026)"],
        `2007: ${hm[0]} · 2016: ${hm[2]} · 2019: ${hm[3]}. Sueldo neto mediano por hora`, F_DEP, 84),
      fn: function (t, e) {
        const c = e.c;
        ambiente("gasolinera", null, t, 0);
        vidaFondo("gs", t, { capa: "gasolinera" });
        attr("gs-c0", "transform", `translate(${(-300 + ((t * 260) % 2200)).toFixed(0)} 990) scale(.42)`);
        attr("gs-c1", "transform", `translate(${(1500 - ((t * 200 + 900) % 2200)).toFixed(0)} 960) scale(-.42 .42)`);
        txt("gs-disp-e", String(Math.round(D.euros))); txt("gs-disp-l", String(D.litros));
        pop("s5-c", t, e.t0 + 0.05, 0, 0, { s: 1 });
        const cuando = [e.t0 + 0.3, c["c5-7"] - 0.25, c["c5-5"] - 0.3, e.t0 + 0.45, e.t0 + 0.6];
        for (let i = 0; i < 5; i++) {
          const k = suave(clamp((t - cuando[i]) / 0.5));
          css(`s5-c-b${i}`, "transform", `scaleY(${k.toFixed(3)})`);
          css(`s5-c-v${i}`, "opacity", clamp((t - cuando[i] - 0.35) / 0.25));
        }
        sube("c5-a", t, c["c5-7"]); sube("c5-b", t, e.t0 + 0.8);
        persona("s5-h", t, { x: 130, y: 1700, s: 0.6, mira: 1, vivo: true, charla: e, boca: habla(t, e, "sonrisa"), brazo: [[0, "abajo"], [c["c5-7"] - 0.2, "senala"], [c["c5-2016"], "hombros"]], fase: 1 });
        persona("s5-p", t, { x: 950, y: 1700, s: 0.66, mira: -1, vivo: true, boca: [[0, "sonrisa"], [c["c5-5"], "seria"]], brazo: [[0, "abajo"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c5-7"], e.c["c5-5"]]); } },

    // 6 · El recuerdo del padre: «Pues yo en 2007 lo llenaba con 50 euros…»
    { n: 6, set: "vacio",
      svg: `<g transform="translate(540 1040) scale(.86)">${foto2007("s6-f", "50 €", "2007")}</g>${gente("s6", "hp")}`,
      tarjeta: grande(6, "En 2007", "50&nbsp;€", "por llenar 50 litros (1,00 € el litro)", null, F_EPF, "#8C6F5A"),
      fn: function (t, e) {
        const c = e.c;
        ambiente("gasolinera", null, t, 0);
        vidaFondo("gs", t, { capa: "gasolinera" });
        attr("gs-c0", "transform", `translate(${(-300 + ((t * 260) % 2200)).toFixed(0)} 990) scale(.42)`);
        attr("gs-c1", "transform", `translate(${(1500 - ((t * 200 + 900) % 2200)).toFixed(0)} 960) scale(-.42 .42)`);
        txt("gs-disp-e", String(Math.round(D.euros))); txt("gs-disp-l", String(D.litros));
        pop("s6-f", t, c["c6-2007"] - 0.3, 0, 0, { s: 1 });
        sube("c6-a", t, c["c6-50"]); sube("c6-b", t, c["c6-50"] + 0.3);
        persona("s6-h", t, { x: 130, y: 1700, s: 0.6, mira: 1, vivo: true, boca: [[0, "sonrisa"]], brazo: [[0, "abajo"]], fase: 1 });
        persona("s6-p", t, { x: 950, y: 1700, s: 0.66, mira: -1, vivo: true, charla: e, boca: habla(t, e, "sonrisa"), ojos: [[0, "normal"], [c["c6-50"], "felices"]], brazo: [[0, "abajo"], [c["c6-2007"], "piensa"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c6-50"]]); } },

    // 7 · 2007 en horas. El hijo: «Ya pero cobrabas menos. Eran 5 horas y 42 minutos… casi una hora menos que hoy.»
    { n: 7, set: "vacio",
      svg: `<g transform="translate(540 1010)">
          <rect x="-370" y="-170" width="740" height="380" rx="24" fill="#FFFDF8" opacity=".95"/>
          <g transform="translate(0 -40)">${jornada("s7-a", "2007", `${hm[0]} min`, "#8C6F5A")}</g>
          <g transform="translate(0 120)">${jornada("s7-b", "Hoy", `${hm[4]} min`)}</g></g>${gente("s7", "hp")}`,
      tarjeta: vs(7, "Horas para llenar el depósito", [hm[0], hm[4]], ["en 2007", "hoy"], "Casi una hora más", F_DEP),
      fn: function (t, e) {
        const c = e.c;
        ambiente("gasolinera", null, t, 0);
        vidaFondo("gs", t, { capa: "gasolinera" });
        attr("gs-c0", "transform", `translate(${(-300 + ((t * 260) % 2200)).toFixed(0)} 990) scale(.42)`);
        attr("gs-c1", "transform", `translate(${(1500 - ((t * 200 + 900) % 2200)).toFixed(0)} 960) scale(-.42 .42)`);
        txt("gs-disp-e", String(Math.round(D.euros))); txt("gs-disp-l", String(D.litros));
        const ka = suave(clamp((t - c["c7-5"] + 0.2) / 0.8)), kb = suave(clamp((t - c["c7-hora"] + 0.3) / 0.8));
        css("s7-a-f", "transform", `scaleX(${(ka * D.horas[0] / 8).toFixed(3)})`); css("s7-a-v", "opacity", clamp((t - c["c7-42"]) / 0.3));
        css("s7-b-f", "transform", `scaleX(${(kb * D.horas[4] / 8).toFixed(3)})`); css("s7-b-v", "opacity", clamp((t - c["c7-hora"] - 0.4) / 0.3));
        sube("c7-a", t, c["c7-42"]); sube("c7-b", t, c["c7-hora"]);
        persona("s7-h", t, { x: 130, y: 1700, s: 0.6, mira: 1, vivo: true, charla: e, boca: habla(t, e, "sonrisa"), brazo: [[0, "abajo"], [c["c7-menos"], "hombros"], [c["c7-5"], "senala"]], fase: 1 });
        persona("s7-p", t, { x: 950, y: 1700, s: 0.66, mira: -1, vivo: true, boca: [[0, "sonrisa"], [c["c7-hora"], "o"]], ojos: [[0, "normal"], [c["c7-hora"], "grandes"]], brazo: [[0, "abajo"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c7-42"], e.c["c7-hora"]]); } },

    // 8 · El porqué con datos (IPC y ETCL). El hijo: «Es que desde el año pasado el gasóleo ha subido un 34 % y la gasolina un 19… y el sueldo un 5.»
    { n: 8, set: "vacio",
      svg: `<g transform="translate(540 1000)">${barrasSubida("s8-s", [
          { rotulo: "Gasóleo", valor: D.sube.gasoleo, color: "#B3261E" }, { rotulo: "Gasolina", valor: D.sube.gasolina, color: "#C8902E" },
          { rotulo: "Sueldo", valor: D.sube.sueldo, color: "#3F7A4A" }])}</g>${gente("s8", "hp")}`,
      tarjeta: vs(8, "Desde la media de 2025", [`+${Math.round(D.sube.gasoleo)}&nbsp;%`, `+${Math.round(D.sube.sueldo)}&nbsp;%`], ["el gasóleo", "el sueldo"],
        `La gasolina, +${Math.round(D.sube.gasolina)}&nbsp;%. Octubre de 2026 frente a la media de 2025; el sueldo, coste salarial por hora (ETCL)`, F_IPC),
      fn: function (t, e) {
        const c = e.c;
        ambiente("gasolinera", null, t, 0);
        vidaFondo("gs", t, { capa: "gasolinera" });
        attr("gs-c0", "transform", `translate(${(-300 + ((t * 260) % 2200)).toFixed(0)} 990) scale(.42)`);
        attr("gs-c1", "transform", `translate(${(1500 - ((t * 200 + 900) % 2200)).toFixed(0)} 960) scale(-.42 .42)`);
        txt("gs-disp-e", String(Math.round(D.euros))); txt("gs-disp-l", String(D.litros));
        pop("s8-s", t, e.t0 + 0.05, 0, 0, { s: 1 });
        [[0, c["c8-34"]], [1, c["c8-19"]], [2, c["c8-5"]]].forEach(([i, x]) => {
          const k = suave(clamp((t - x + 0.15) / 0.6));
          css(`s8-s-b${i}`, "transform", `scaleX(${k.toFixed(3)})`); css(`s8-s-v${i}`, "opacity", clamp((t - x - 0.25) / 0.3));
        });
        sube("c8-a", t, c["c8-34"]); sube("c8-b", t, c["c8-5"]);
        persona("s8-h", t, { x: 130, y: 1700, s: 0.6, mira: 1, vivo: true, charla: e, boca: habla(t, e, "seria"), brazo: [[0, "abajo"], [c["c8-34"] - 0.2, "senala"], [c["c8-5"], "hombros"]], fase: 1 });
        persona("s8-p", t, { x: 950, y: 1700, s: 0.66, mira: -1, vivo: true, boca: [[0, "seria"], [c["c8-34"] + 0.3, "o"]], ojos: [[0, "normal"], [c["c8-34"] + 0.3, "grandes"]], brazo: [[0, "abajo"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c8-34"], e.c["c8-5"]]); } },

    // 9 · El padre: «Por eso cojo menos el coche.»
    { n: 9, set: "vacio",
      svg: `${gente("s9", "hp")}`,
      tarjeta: cita(9, "El padre", `«Por eso cojo menos el <mark id="m9">coche</mark>»`),
      fn: function (t, e) {
        const c = e.c;
        ambiente("gasolinera", null, t, 0);
        vidaFondo("gs", t, { capa: "gasolinera" });
        attr("gs-c0", "transform", `translate(${(-300 + ((t * 260) % 2200)).toFixed(0)} 990) scale(.42)`);
        attr("gs-c1", "transform", `translate(${(1500 - ((t * 200 + 900) % 2200)).toFixed(0)} 960) scale(-.42 .42)`);
        txt("gs-disp-e", String(Math.round(D.euros))); txt("gs-disp-l", String(D.litros));
        marca("m9", t, c["c9-coche"]);
        persona("s9-h", t, { x: 250, y: 1440, s: 0.72, mira: 1, vivo: true, boca: [[0, "sonrisa"]], brazo: [[0, "abajo"]], fase: 1 });
        persona("s9-p", t, { x: 880, y: 1440, s: 0.8, mira: -1, vivo: true, charla: e, boca: habla(t, e, "seria"), brazo: [[0, "abajo"], [c["c9-coche"] - 0.3, "hombros"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c9-coche"]]); } },

    // 10 · Los litros por hogar (INE, EPF). El hijo: «Y no eres el único. Un hogar echa hoy un 39 % menos de litros que en 2007.»
    { n: 10, set: "vacio",
      svg: `<g transform="translate(540 1250)"><rect x="-370" y="-470" width="740" height="580" rx="24" fill="#FFFDF8" opacity=".95"/>
          <g transform="translate(-170 0)">${bidon("s10-a", 320, "#C8902E", "2007", `${miles(D.litros07)} l`)}</g>
          <g transform="translate(170 0)">${bidon("s10-b", 320 * D.litros25 / D.litros07, "#B3261E", "2025", `${Math.round(D.litros25)} l`)}</g></g>${gente("s10", "hp")}`,
      tarjeta: vs(10, "Litros de carburante al año por hogar", [miles(D.litros07), String(Math.round(D.litros25))], ["2007", "2025"],
        `Gasolina y gasóleo: un ${Math.round(D.baja)}&nbsp;% menos`, F_EPF),
      fn: function (t, e) {
        const c = e.c;
        ambiente("gasolinera", null, t, 0);
        vidaFondo("gs", t, { capa: "gasolinera" });
        attr("gs-c0", "transform", `translate(${(-300 + ((t * 260) % 2200)).toFixed(0)} 990) scale(.42)`);
        attr("gs-c1", "transform", `translate(${(1500 - ((t * 200 + 900) % 2200)).toFixed(0)} 960) scale(-.42 .42)`);
        txt("gs-disp-e", String(Math.round(D.euros))); txt("gs-disp-l", String(D.litros));
        pop("s10-a", t, e.t0 + 0.1, 0, 0, { s: 1 });
        pop("s10-b", t, c["c10-39"] - 0.2, 0, 0, { s: 1 });
        sube("c10-a", t, e.t0 + 0.3); sube("c10-b", t, c["c10-39"]);
        persona("s10-h", t, { x: 130, y: 1700, s: 0.6, mira: 1, vivo: true, charla: e, boca: habla(t, e, "sonrisa"), brazo: [[0, "abajo"], [c["c10-unico"], "hombros"], [c["c10-39"] - 0.2, "senala"]], fase: 1 });
        persona("s10-p", t, { x: 950, y: 1700, s: 0.66, mira: -1, vivo: true, boca: [[0, "seria"], [c["c10-39"] + 0.3, "sonrisa"]], brazo: [[0, "abajo"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c10-39"]]); } },

    // 11 · Veredicto y pregunta. El padre: «O sea que llenar el depósito cuesta casi como en plena crisis. ¿Y tú coges menos el coche que antes?»
    { n: 11, set: "vacio",
      svg: `${gente("s11", "hp")}`,
      tarjeta: tarjeta(11, "Te toca", `<div class="tit" style="font-size:60px">¿Coges menos el <mark id="m11">coche</mark> que antes?</div><div class="sub" id="c11-sub">Te leo en los comentarios.</div>`),
      fn: function (t, e) {
        const c = e.c;
        ambiente("gasolinera", null, t, 0);
        vidaFondo("gs", t, { capa: "gasolinera" });
        attr("gs-c0", "transform", `translate(${(-300 + ((t * 260) % 2200)).toFixed(0)} 990) scale(.42)`);
        attr("gs-c1", "transform", `translate(${(1500 - ((t * 200 + 900) % 2200)).toFixed(0)} 960) scale(-.42 .42)`);
        txt("gs-disp-e", String(Math.round(D.euros))); txt("gs-disp-l", String(D.litros));
        marca("m11", t, c["c11-coche"] + 0.2);
        sube("c11-sub", t, c["c11-coche"] + 0.7);
        persona("s11-h", t, { x: 250, y: 1440, s: 0.72, mira: 1, vivo: true, boca: [[0, "sonrisa"]], brazo: [[0, "abajo"], [c["c11-crisis"], "hombros"]], fase: 1 });
        persona("s11-p", t, { x: 860, y: 1440, s: 0.8, mira: [[0, -1], [c["c11-crisis"] + 0.4, 0]], vivo: true, charla: e, boca: habla(t, e, "sonrisa"), brazo: [[0, "abajo"], [c["c11-crisis"] - 0.3, "hombros"], [c["c11-coche"] - 0.6, "senala"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c11-crisis"], e.c["c11-coche"]]); } },
  ];
}
