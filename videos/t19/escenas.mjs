// Escenas de T19 («¿Para cuánto te da hoy el Gordo?») en estilo «limpio». Bruno, 23 y 24-11-2026: lo que te deja hoy un
// décimo con el Gordo frente a 2007, lo que se queda Hacienda, y para cuántos años de sueldo y cuántos pisos da (él creía
// que antes daba «para diez casas»: contrastado). Excepción suya a la regla de los tres años: solo 2007 y hoy.
//   · «padre»: unos 60, canas y bigote, jersey gris pardo; convencido de los diez pisos (voz «comandante»).
//   · «hija»: unos 35, melena castaña, jersey verde agua; lo comprueba todo (voz «viajera»).
// Decorados: el salón de T17 con el árbol y la tele del sorteo, la calle de sueno.mjs (los pisos) y la oficina de T20 (el curro).
/* eslint-disable no-undef */

import { persona, tarjeta, selloOficial } from "../../diseno/limpio.mjs";
import { bandera } from "../../diseno/barrio.mjs";
import { ambientes } from "../../diseno/sueno.mjs";
import { DECORADOS_T17 } from "../../diseno/carnet.mjs";
import { arbol } from "../../diseno/navidad.mjs";
import { DECORADOS_T20, decimo, premioHacienda, teleSorteo, filaPisos, filaCalendarios } from "../../diseno/loteria.mjs";

export const ESTILO = "limpio";
const F_BOE07 = "BOE · Programa de premios del sorteo de Navidad de 2007";
const F_HOY = "Loterías y Apuestas del Estado (programa de 2026) · BOE (Ley del IRPF)";
const F_PISO = "Cálculo propio · BOE, Loterías y Ministerio de Vivienda (Banco de España)";
const F_SUELDO = "Cálculo propio · BOE, Loterías e INE";
const F_IPC = "Cálculo propio · BOE e INE (IPC)";

const miles = (v) => String(Math.round(v)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
const es = (v, d = 1) => v.toFixed(d).replace(".", ",");

export function datos(d) {
  return { v: d.anyos["2007"], h: d.anyos.hoy, m2: d.precio_m2, neto: d.sueldo_neto_anual, real: d.hoy_frente_2007 };
}

export const capas = () => ambientes({ salon: DECORADOS_T17.salon, oficinaNavidad: DECORADOS_T20.oficinaNavidad });

// ------------------------------------------------------------------ personajes (inventados), con volumen
const PADRE = { pelo: "corto", canas: true, barba: false, bigote: true, colorPelo: "#B8B0A4", colorBigote: "#C9C2B6", ropa: ["#6E6A60", "#5A5650"], piel: "#EBC3A0", piel2: "#D9AE8C", volumen: true };
const HIJA = { pelo: "largo", canas: false, barba: false, colorPelo: "#5A3A22", ropa: ["#3E8E8A", "#33746F"], piel: "#F2CBA8", volumen: true };
const QUIEN = { p: PADRE, h: HIJA };
const gente = (n, quien) => quien.split("").map((k) => persona(`${n}-${k}`, "hoy", QUIEN[k])).join("");

// ------------------------------------------------------------------ tarjetas
const HOY = "#B3261E", VERDE = "#3F7A4A";
const cita = (n, quien, html) => tarjeta(n, quien, `<div class="tit" style="font-size:64px">${html}</div>`, { tono: "hoy" });
const grande = (n, titulo, cifra, sub, nota, fuente, color = HOY) => tarjeta(n, titulo, `<div class="tit" style="font-size:104px;color:${color};line-height:1" id="c${n}-a">${cifra}</div>
  <div class="sub" id="c${n}-b" style="font-size:42px">${sub}</div>${nota ? `<div class="nota">${nota}</div>` : ""}`, { fuente, icono: bandera(44) });
const vs = (n, titulo, vals, labs, nota, fuente) => tarjeta(n, titulo, `<div class="vs">${vals.map((v, i) => `<div class="col"><div class="v ${i ? "t-hoy" : "t-pasado"}" id="c${n}-${"ab"[i]}" style="font-size:96px">${v}</div><div class="n">${labs[i]}</div></div>`).join("")}</div>
  <div class="nota">${nota}</div>`, { fuente, icono: bandera(44) });

export function escenas(D) {
  const salon = (n, tele = true) => `<g transform="translate(150 1290) scale(.7)">${arbol(`s${n}-ar`)}</g>${tele ? `<g transform="translate(830 1300)">${teleSorteo(`s${n}-tv`)}</g>` : ""}`;
  return [
    // 1 · Gancho. El salón con el sorteo en la tele. La hija: «¿Para cuánto te da hoy el Gordo? Porque mi padre dice que en 2007 te comprabas diez pisos…»
    { n: 1, set: "vacio",
      svg: `${salon(1)}${gente("s1", "ph")}${selloOficial("s1-sello")}`,
      tarjeta: tarjeta(1, "Lotería de Navidad · 2007 y hoy", `<div class="tit" style="font-size:64px">¿Para cuánto te da hoy el <mark id="m1">Gordo</mark>?</div>`, { icono: bandera(44) }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("salon", null, t, 0);
        vidaFondo("sl", t, { lamparas: 1, capa: "salon" });
        for (let i = 0; i < 16; i++) css("s1-ar-b" + i, "opacity", 0.35 + 0.65 * ((Math.sin(t * 3.4 + i * 1.7) + 1) / 2));
        attr("s1-tv-bombo", "transform", `rotate(${(t * 90) % 360})`);
        marca("m1", t, c["c1-gordo"]);
        selloAnim("s1-sello", t, c["c1-sello"], 300, 780, { s: 0.8, r: -9 });
        persona("s1-h", t, { x: 300, y: 1440, s: 0.8, mira: [[0, 0], [c["c1-diez"] - 0.3, 1]], vivo: true, charla: e, boca: habla(t, e, "sonrisa"), brazo: [[0, "abajo"], [c["c1-gordo"] - 0.2, "senala"], [c["c1-diez"] - 0.3, "hombros"]], fase: 1 });
        persona("s1-p", t, { x: 560, y: 1440, s: 0.82, mira: 1, vivo: true, boca: [[0, "sonrisa"], [c["c1-diez"], "grande"]], ojos: [[0, "normal"], [c["c1-diez"], "felices"]], brazo: [[0, "abajo"], [c["c1-diez"], "arriba"]], fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c1-gordo"], e.c["c1-diez"]]); } },

    // 2 · El Gordo de 2007 (BOE). El padre: «Hombre claro… en 2007 te tocaban 300.000 euros por décimo y ni un duro para Hacienda.»
    { n: 2, set: "vacio",
      svg: `${salon(2, false)}<g transform="translate(500 1120)">${premioHacienda("s2-m")}</g><g transform="translate(540 860) rotate(-6) scale(.7)">${decimo("s2-d", "58213")}</g>${gente("s2", "hp")}`,
      tarjeta: grande(2, "El Gordo en 2007", miles(D.v.gordo_decimo) + "&nbsp;€", "por décimo, y sin impuestos", `Décimo de ${D.v.decimo_eur}&nbsp;€. Primer premio: 3.000.000&nbsp;€ por serie`, F_BOE07),
      fn: function (t, e) {
        const c = e.c;
        ambiente("salon", null, t, 0);
        vidaFondo("sl", t, { lamparas: 1, capa: "salon" });
                ver("s2-m-h", false); ver("s2-m-s", false);
        pop("s2-m", t, c["c2-300000"] - 0.3, 0, 0, { s: 1 });
        sube("c2-a", t, c["c2-300000"]); sube("c2-b", t, c["c2-hacienda"]);
        persona("s2-h", t, { x: 130, y: 1700, s: 0.64, mira: 1, vivo: true, boca: [[0, "seria"]], brazo: [[0, "abajo"]], fase: 1 });
        persona("s2-p", t, { x: 950, y: 1700, s: 0.66, mira: -1, vivo: true, charla: e, boca: habla(t, e, "sonrisa"), brazo: [[0, "abajo"], [c["c2-300000"] - 0.3, "senala"], [c["c2-hacienda"], "hombros"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c2-300000"]]); } },

    // 3 · Hoy: 400.000, Hacienda 72.000 (programa de 2026 y Ley del IRPF). La hija: «Ya pero hoy son 400.000. Lo que pasa es que Hacienda se queda 72.000… y te quedan 328.000.»
    { n: 3, set: "vacio",
      svg: `${salon(3, false)}<g transform="translate(400 1110) scale(1.08)">${premioHacienda("s3-m")}</g>${gente("s3", "hp")}`,
      tarjeta: grande(3, "El Gordo hoy", miles(D.h.gordo_decimo) + "&nbsp;€", `Hacienda se queda <b style="color:${HOY}">${miles(D.h.hacienda_eur)}&nbsp;€</b>; te quedan ${miles(D.h.te_queda)}&nbsp;€`,
        `El 20&nbsp;% de lo que pase de ${miles(D.h.exento_eur)}&nbsp;€. Programa de premios de 2026`, F_HOY),
      fn: function (t, e) {
        const c = e.c;
        ambiente("salon", null, t, 0);
        vidaFondo("sl", t, { lamparas: 1, capa: "salon" });
                pop("s3-m", t, e.t0 + 0.1, 0, 0, { s: 1 });
        const k = suave(clamp((t - c["c3-72000"] + 0.2) / 0.8));
        attr("s3-m-h", "transform", `translate(${(190 * k).toFixed(1)} ${(60 * k).toFixed(1)}) scale(${(1 - 0.55 * k).toFixed(3)})`);
        sube("c3-a", t, c["c3-400000"]); sube("c3-b", t, c["c3-72000"]);
        persona("s3-h", t, { x: 130, y: 1700, s: 0.64, mira: 1, vivo: true, charla: e, boca: habla(t, e, "seria"), brazo: [[0, "abajo"], [c["c3-400000"] - 0.2, "senala"], [c["c3-328000"], "hombros"]], fase: 1 });
        persona("s3-p", t, { x: 950, y: 1700, s: 0.66, mira: -1, vivo: true, boca: [[0, "sonrisa"], [c["c3-72000"] + 0.3, "o"]], ojos: [[0, "normal"], [c["c3-72000"] + 0.3, "grandes"]], brazo: [[0, "abajo"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c3-72000"]]); } },

    // 4 · El padre, erre que erre: «¿Ves? Más que en 2007. Diez pisos por lo menos.»
    { n: 4, set: "vacio",
      svg: `${salon(4)}<g transform="translate(540 1000) scale(.9)">${filaPisos("s4-f", 10, "")}</g>${gente("s4", "hp")}`,
      tarjeta: cita(4, "El padre", `«Diez <mark id="m4">pisos</mark> por lo menos»`),
      fn: function (t, e) {
        const c = e.c;
        ambiente("salon", null, t, 0);
        vidaFondo("sl", t, { lamparas: 1, capa: "salon" });
        attr("s4-tv-bombo", "transform", `rotate(${(t * 90) % 360})`);
        marca("m4", t, c["c4-diez"] + 0.3);
        for (let i = 0; i < 10; i++) pop(`s4-f-p${i}`, t, c["c4-diez"] - 0.1 + i * 0.09, 0, 0, { s: 1 });
        persona("s4-h", t, { x: 150, y: 1440, s: 0.76, mira: 1, vivo: true, boca: [[0, "seria"]], ojos: [[0, "normal"]], brazo: [[0, "abajo"], [c["c4-diez"] + 0.5, "hombros"]], fase: 1 });
        persona("s4-p", t, { x: 930, y: 1440, s: 0.8, mira: -1, vivo: true, charla: e, boca: habla(t, e, "sonrisa"), ojos: [[0, "felices"]], brazo: [[0, "abajo"], [c["c4-diez"] - 0.2, "arriba"]], salta: c["c4-diez"] + 0.2, espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c4-diez"]]); } },

    // 5 · Los pisos de verdad (en la calle). La hija: «¿Diez pisos? Anda ya papá. En 2007 te daba para piso y medio… y hoy igual.»
    { n: 5, set: "vacio",
      svg: `<g transform="translate(580 940) scale(.92)">${filaPisos("s5-a", D.v.pisos, "2007")}</g><g transform="translate(580 1200) scale(.92)">${filaPisos("s5-b", D.h.pisos, "Hoy")}</g>${gente("s5", "hp")}`,
      tarjeta: vs(5, "Pisos de 90 m² con lo que te queda", [es(D.v.pisos), es(D.h.pisos)], ["en 2007", "hoy"],
        `Valor tasado medio de la vivienda libre: ${miles(D.m2["2007"])}&nbsp;€/m² en 2007 y ${miles(D.m2["2025"])}&nbsp;€/m² en 2025`, F_PISO),
      fn: function (t, e) {
        const c = e.c;
        ambiente("calle", "salon", t, e.t0);
        for (const f of ["s5-a", "s5-b"]) { const k = clamp((t - c["c5-anda"]) / 0.6); css(f + "-diez", "opacity", 1 - k); css(f + "-luz", "opacity", k); }
        sube("c5-a", t, c["c5-2007"]); sube("c5-b", t, c["c5-hoy"]);
        persona("s5-h", t, { x: 130, y: 1700, s: 0.64, mira: 1, vivo: true, charla: e, boca: habla(t, e, "sonrisa"), brazo: [[0, "abajo"], [c["c5-anda"] - 0.1, "hombros"], [c["c5-2007"], "senala"]], fase: 1 });
        persona("s5-p", t, { x: 950, y: 1700, s: 0.66, mira: -1, vivo: true, boca: [[0, "sonrisa"], [c["c5-anda"] + 0.3, "o"]], ojos: [[0, "felices"], [c["c5-anda"] + 0.3, "grandes"]], brazo: [[0, "abajo"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c5-anda"]]); } },

    // 6 · El padre recula: «Bueno… piso y medio. Pero es que antes los sueldos eran otros.»
    { n: 6, set: "vacio",
      svg: `<g transform="translate(580 940) scale(.92)">${filaPisos("s6-a", D.v.pisos, "2007")}</g><g transform="translate(580 1200) scale(.92)">${filaPisos("s6-b", D.h.pisos, "Hoy")}</g>${gente("s6", "hp")}`,
      tarjeta: tarjeta(6, "El padre", `<div class="tit" style="font-size:64px">«Antes los <mark id="m6">sueldos</mark> eran otros»</div>`, { tono: "hoy", fuente: F_PISO }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("calle", null, t, 0);
        for (const f of ["s6-a", "s6-b"]) { css(f + "-diez", "opacity", 0); css(f + "-luz", "opacity", 1); }
        marca("m6", t, c["c6-sueldos"]);
        persona("s6-h", t, { x: 130, y: 1700, s: 0.64, mira: 1, vivo: true, boca: [[0, "sonrisa"]], brazo: [[0, "abajo"]], fase: 1 });
        persona("s6-p", t, { x: 950, y: 1700, s: 0.66, mira: -1, vivo: true, charla: e, boca: habla(t, e, "seria"), brazo: [[0, "piensa"], [c["c6-sueldos"] - 0.2, "senala"]], incl: [[0, -5], [c["c6-sueldos"], 0]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c6-sueldos"]]); } },

    // 7 · Años de sueldo (en la oficina: años de curro). La hija: «Eso sí. En 2007 eran 21 años de sueldo y hoy 16. Cinco años menos de vida resuelta.»
    { n: 7, set: "vacio",
      svg: `<g transform="translate(560 930)">${filaCalendarios("s7-a", 21, "2007", "#C8902E")}</g><g transform="translate(560 1170)">${filaCalendarios("s7-b", 16, "Hoy", HOY)}</g>${gente("s7", "hp")}`,
      tarjeta: vs(7, "Lo que te queda, en años de sueldo", [es(D.v.anyos_sueldo), es(D.h.anyos_sueldo)], ["en 2007", "hoy"],
        `Sueldo neto mediano: ${miles(D.neto["2007"])}&nbsp;€ al año en 2007 y ${miles(D.neto["2025"])}&nbsp;€ en 2025`, F_SUELDO),
      fn: function (t, e) {
        const c = e.c;
        ambiente("oficinaNavidad", "calle", t, e.t0);
        vidaFondo("ol", t, { lamparas: 2, gente: 2, capa: "oficinaNavidad", y: 1080, s: 0.42 });
        for (let i = 0; i < 21; i++) pop(`s7-a-c${i}`, t, c["c7-21"] - 0.4 + i * 0.05, 0, 0, { s: 1 });
        for (let i = 0; i < 16; i++) pop(`s7-b-c${i}`, t, c["c7-16"] - 0.3 + i * 0.05, 0, 0, { s: 1 });
        sube("c7-a", t, c["c7-21"]); sube("c7-b", t, c["c7-16"]);
        persona("s7-h", t, { x: 130, y: 1700, s: 0.64, mira: 1, vivo: true, charla: e, boca: habla(t, e, "seria"), brazo: [[0, "abajo"], [c["c7-21"] - 0.2, "senala"], [c["c7-cinco"], "hombros"]], fase: 1 });
        persona("s7-p", t, { x: 950, y: 1700, s: 0.66, mira: -1, vivo: true, boca: [[0, "seria"], [c["c7-cinco"] + 0.3, "o"]], ojos: [[0, "normal"], [c["c7-cinco"] + 0.3, "grandes"]], brazo: [[0, "abajo"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c7-16"]]); } },

    // 8 · En euros de hoy (IPC). El padre: «Vamos que aquel Gordo hoy serían casi 430.000 euros.»
    { n: 8, set: "vacio",
      svg: `${salon(8, false)}<g id="s8-a"><g transform="scale(1.2)">${premioHacienda("s8-ma")}</g></g><g id="s8-b"><g transform="scale(.92)">${premioHacienda("s8-mb")}</g></g>
        <g id="s8-la" opacity="0"><rect x="-150" y="-36" width="300" height="72" rx="20" fill="#5B6470"/><text x="0" y="16" text-anchor="middle" font-family="Cap" font-weight="800" font-size="40" fill="#FFFFFF">${miles(D.v.te_queda_en_euros_de_2025)}&nbsp;€</text></g>
        <g id="s8-lb" opacity="0"><rect x="-150" y="-36" width="300" height="72" rx="20" fill="${VERDE}"/><text x="0" y="16" text-anchor="middle" font-family="Cap" font-weight="800" font-size="40" fill="#FFFFFF">${miles(D.h.te_queda)}&nbsp;€</text></g>
        ${gente("s8", "hp")}`,
      tarjeta: grande(8, "El Gordo de 2007, en euros de hoy", miles(D.v.te_queda_en_euros_de_2025) + "&nbsp;€", `Hoy te quedan ${miles(D.h.te_queda)}&nbsp;€: un ${Math.round(-D.real.valor_real_pct)}&nbsp;% menos`, "Con el IPC del INE", F_IPC, "#5B6470"),
      fn: function (t, e) {
        const c = e.c;
        ambiente("salon", "oficinaNavidad", t, e.t0);
        vidaFondo("sl", t, { lamparas: 1, capa: "salon" });
                for (const x of ["s8-ma", "s8-mb"]) { ver(x + "-h", false); ver(x + "-s", false); }
        pop("s8-a", t, c["c8-gordo"] - 0.2, 300, 1060, { s: 1 }); pop("s8-b", t, c["c8-gordo"] + 0.2, 790, 1100, { s: 1 });
        T("s8-la", 300, 1250, {}); T("s8-lb", 790, 1250, {});
        css("s8-la", "opacity", clamp((t - c["c8-430000"]) / 0.3)); css("s8-lb", "opacity", clamp((t - c["c8-430000"] - 0.4) / 0.3));
        sube("c8-a", t, c["c8-430000"]); sube("c8-b", t, c["c8-430000"] + 0.5);
        persona("s8-h", t, { x: 120, y: 1700, s: 0.64, mira: 1, vivo: true, boca: [[0, "seria"], [c["c8-430000"] + 0.3, "o"]], brazo: [[0, "abajo"]], fase: 1 });
        persona("s8-p", t, { x: 960, y: 1700, s: 0.66, mira: -1, vivo: true, charla: e, boca: habla(t, e, "seria"), brazo: [[0, "abajo"], [c["c8-gordo"] - 0.2, "senala"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c8-430000"]]); } },

    // 9 · Veredicto y pregunta. La hija: «Total que para Hacienda más y para ti menos años. ¿Y tú con el Gordo de hoy dejarías el curro?»
    { n: 9, set: "vacio",
      svg: `${salon(9)}${gente("s9", "ph")}`,
      tarjeta: tarjeta(9, "Te toca", `<div class="tit" style="font-size:60px">¿Con el Gordo de hoy dejarías de <mark id="m9">trabajar</mark>?</div><div class="sub" id="c9-sub">Te leo en los comentarios.</div>`),
      fn: function (t, e) {
        const c = e.c;
        ambiente("salon", null, t, 0);
        vidaFondo("sl", t, { lamparas: 1, capa: "salon" });
        for (let i = 0; i < 16; i++) css("s9-ar-b" + i, "opacity", 0.35 + 0.65 * ((Math.sin(t * 3.4 + i * 1.7) + 1) / 2));
        attr("s9-tv-bombo", "transform", `rotate(${(t * 90) % 360})`);
        marca("m9", t, c["c9-curro"]); sube("c9-sub", t, c["c9-curro"] + 0.3);
        persona("s9-h", t, { x: 300, y: 1440, s: 0.8, mira: [[0, 1], [c["c9-curro"] - 0.8, 0]], vivo: true, charla: e, boca: habla(t, e, "sonrisa"), brazo: [[0, "abajo"], [c["c9-hacienda"], "hombros"], [c["c9-curro"] - 0.6, "senala"]], fase: 1 });
        persona("s9-p", t, { x: 560, y: 1440, s: 0.82, mira: [[0, -1], [c["c9-curro"] - 0.5, 0]], vivo: true, boca: [[0, "seria"], [c["c9-curro"], "sonrisa"]], brazo: [[0, "abajo"], [c["c9-curro"], "hombros"]], fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c9-curro"]]); } },
  ];
}
