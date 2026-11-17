// Escenas de T6 (padre contra hijo, 4.ª parte: «¿Nacen menos niños porque ahora trabajan ellas?») en estilo «limpio».
// El decorado cambia con la conversación, como en un sueño: cocina → oficina → parque → sala de cunas → cocina.
// El padre a la izquierda y el hijo a la derecha; quien habla mueve la boca.
// Cada escena: dibujo (svg), tarjeta (HTML) y acción (fn, se ejecuta en la página con diseno/limpio_runtime.js).
/* eslint-disable no-undef */

import { C, persona, bocadillo, tarjeta } from "../../diseno/limpio.mjs";
import { bandera } from "../../diseno/barrio.mjs";
import { boton } from "../../diseno/casa.mjs";
import { ambientes, retrato, figurita, carrito } from "../../diseno/sueno.mjs";

export const ESTILO = "limpio";
const F_EMP = "INE (EPA de 1986, Anuario de 1988) y Eurostat (hoy). Cálculo propio para 1986";
const F_EUR = "Dato oficial: Eurostat (empleo de las mujeres de 25 a 54 años e hijos por mujer)";
const F_BOE = "Dato oficial: BOE (Estatuto de los Trabajadores de 1980 y Real Decreto-ley 9/2025)";
const F_EUR2 = "Dato oficial: Eurostat (hijos por mujer)";

export function datos(t5) {
  const s = t5.europa_empleo_mujeres_y_fecundidad.espana_serie;
  const tramo = (anyos) => anyos.map((a) => ({ a: +a, emp: s[a].empleo_mujeres_25_54, icf: s[a].hijos_por_mujer }));
  return {
    m86: t5.empleo_1986.mujeres.tasa_empleo_pct, mHoy: s["2025"].empleo_mujeres_15_64,
    h86: t5.empleo_1986.hombres.tasa_empleo_pct, hHoy: s["2025"].empleo_hombres_15_64, m07: s["2007"].empleo_mujeres_15_64, m16: s["2016"].empleo_mujeres_15_64,
    subida: tramo(["1995", "1998", "2001", "2004", "2007", "2008"]),
    bajada: tramo(["2008", "2010", "2013", "2016", "2019", "2022", "2024"]),
    padreDias: t5.permisos["1986"].padre_dias, madreSem: t5.permisos["1986"].madre_semanas, hoySem: t5.permisos.hoy.cada_progenitor_semanas,
  };
}

export const capas = () => ambientes();

// ------------------------------------------------------------------ personajes (los de T3 a T5)
const PADRE = { pelo: "corto", canas: true, barba: false, bigote: true, colorPelo: "#6F6A62", colorBigote: "#5E5952", ropa: ["#8C6F5A", "#6E5444"], piel: "#EDBE96" };
const HIJO = { pelo: "corto", canas: false, barba: false, colorPelo: "#3B2A20", ropa: ["#6F8FA6", "#56738A"], piel: "#F1C9A5" };
const dos = (p) => `${persona(p + "-padre", "hoy", PADRE)}${persona(p + "-hijo", "hoy", HIJO)}`;
const vs = (n, a, b, la, lb, colA = "t-pasado", colB = "t-hoy") => `<div class="vs"><div class="col"><div class="v ${colA}" id="c${n}-a">${a}</div><div class="n">${la}</div></div>
  <div class="col"><div class="v ${colB}" id="c${n}-b">${b}</div><div class="n">${lb}</div></div></div>`;

// Pizarra con un gráfico de líneas. Origen: arriba a la izquierda del panel (480 × 400).
function pizarra(id, lineas, desde, hasta, etiquetas) {
  const x = (a) => 50 + (a - desde) / (hasta - desde) * 390;
  return `<g id="${id}"><rect x="0" y="0" width="480" height="400" rx="20" fill="#FFFDF8" stroke="#C9CED3" stroke-width="6"/>
    <line x1="50" y1="330" x2="440" y2="330" stroke="${C.tinta}" stroke-width="4"/>
    <text x="50" y="372" text-anchor="middle" font-family="Cap" font-weight="800" font-size="28" fill="${C.gris}">${desde}</text>
    <text x="440" y="372" text-anchor="middle" font-family="Cap" font-weight="800" font-size="28" fill="${C.gris}">${hasta}</text>
    ${lineas.map((l, i) => `<path id="${id}-l${i}" d="${l.d(x)}" fill="none" stroke="${l.color}" stroke-width="9" stroke-linecap="round" stroke-linejoin="round" pathLength="1" stroke-dasharray="0 1"/>
      <text id="${id}-t${i}" x="${l.tx}" y="${l.ty}" font-family="Cap" font-weight="800" font-size="27" fill="${l.color}">${etiquetas[i]}</text>`).join("")}</g>`;
}

export function escenas(D) {
  const es = (v, d = 1) => v.toFixed(d).replace(".", ",");
  const r = (v) => Math.round(v);
  // Líneas de la pizarra: cada serie con su propia escala (se ve si suben o bajan, no su nivel).
  const linea = (datos, campo, lo, hi) => (x) => datos.map((p, i) => `${i ? "L" : "M"}${x(p.a).toFixed(1)} ${(330 - (p[campo] - lo) / (hi - lo) * 270).toFixed(1)}`).join(" ");
  const L1 = [{ d: linea(D.subida, "emp", 35, 70), color: C.ocre, tx: 60, ty: 50 }, { d: linea(D.subida, "icf", 1.05, 1.5), color: C.azul, tx: 60, ty: 86 }];
  const L2 = [{ d: linea(D.bajada, "icf", 1.0, 1.5), color: C.azul, tx: 60, ty: 50 }];
  const rejilla = Array.from({ length: 100 }, (_, i) => figurita("s2-f" + i, 362 + (i % 10) * 40, 820 + Math.floor(i / 10) * 44, 0.95)).join("");
  return [
    // 1 · Padre (cocina): «¡Es que antes tu madre se quedaba en casa con los niños!»
    { n: 1, set: "vacio",
      svg: `${retrato("s1-ret")}${dos("s1")}`,
      tarjeta: tarjeta(1, "Padre contra hijo · Cuarta parte", `<div class="tit" style="font-size:62px">¿Nacen menos niños porque ahora <mark id="m1">trabajan ellas</mark>?</div>`, { icono: bandera(44) }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("cocina", null, t, 0);
        // Un retrato antiguo, en sepia, cae colgado y se balancea.
        const k = t - c["c1-madre"];
        if (k < 0) ver("s1-ret", false); else T("s1-ret", 540, 860 - 380 * (1 - fuera(k / 0.45)), { s: 0.95, r: 7 * Math.sin(k * 5) * Math.exp(-k * 0.9) });
        marca("m1", t, c["c1-casa"]);
        persona("s1-padre", t, { x: 210, y: 1440, s: 0.78, mira: 1, boca: habla(t, e, "seria"), brazo: [[0, "abajo"], [c["c1-madre"] - 0.1, "senala"]], incl: [[0, -3]], fase: 1 });
        persona("s1-hijo", t, { x: 870, y: 1440, s: 0.78, mira: -1, boca: "seria", ojos: [[0, "normal"], [c["c1-casa"], "grandes"]], espejo: true, fase: 2 });
      } },

    // 2 · Hijo (oficina): «En 1986 trabajaban 26 de cada 100 mujeres. Hoy, 63.»
    { n: 2, set: "vacio",
      svg: `<rect x="330" y="760" width="420" height="500" rx="24" fill="#FFFDF8" opacity=".94"/>${rejilla}${dos("s2")}`,
      tarjeta: tarjeta(2, "Mujeres de 16 a 64 años con trabajo, de cada 100", `${vs(2, r(D.m86), r(D.mHoy), "en 1986", "hoy (2025)")}
        <div class="nota">Hombres: ${r(D.h86)} en 1986 y ${r(D.hHoy)} hoy · en 2007: ${r(D.m07)} · en 2016: ${r(D.m16)}</div>`, { fuente: F_EMP, icono: bandera(44) }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("oficina", "cocina", t, e.t0);
        // Rejilla de 100: se colorean 26 (1986, ocre) y luego hasta 63 (hoy, azul).
        const n86 = Math.round(D.m86), nHoy = Math.round(D.mHoy);
        const a = Math.floor(n86 * clamp((t - c["c2-26"]) / 0.8)), b = Math.floor(nHoy * clamp((t - c["c2-63"] + 0.2) / 1.0));
        for (let i = 0; i < 100; i++) {
          const el = document.getElementById("s2-f" + i);
          if (!el) continue;
          const col = i < b ? "#1F5F8B" : i < a ? "#C8902E" : "#D5D9DD";
          if (el.getAttribute("fill") !== col) el.setAttribute("fill", col);
        }
        sube("c2-a", t, c["c2-26"]); sube("c2-b", t, c["c2-63"]);
        persona("s2-padre", t, { x: 210, y: 1440, s: 0.78, mira: 1, boca: [[0, "seria"], [c["c2-63"] + 0.5, "o"]], ojos: [[0, "normal"], [c["c2-63"] + 0.5, "grandes"]], fase: 1 });
        persona("s2-hijo", t, { x: 870, y: 1440, s: 0.78, mira: -1, boca: habla(t, e), brazo: [[0, "abajo"], [c["c2-26"], "senala"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camSueno(t, e.t0); } },

    // 3 · Padre (oficina): «¡Pues ahí lo tienes!»
    { n: 3, set: "vacio",
      svg: `<rect x="330" y="760" width="420" height="500" rx="24" fill="#FFFDF8" opacity=".94"/>${rejilla.replace(/s2-f/g, "s3-f")}${dos("s3")}`,
      tarjeta: tarjeta(3, "Padre", `<div class="tit">«¡Pues <mark id="m3">ahí lo tienes</mark>!»</div>`, { tono: "pasado" }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("oficina", null, t, 0);
        const nHoy = Math.round(D.mHoy);
        for (let i = 0; i < 100; i++) {
          const el = document.getElementById("s3-f" + i);
          // Las figuras azules dan un saltito cuando el padre las señala.
          if (el) { el.setAttribute("fill", i < nHoy ? "#1F5F8B" : "#D5D9DD"); }
        }
        marca("m3", t, c["c3-ahi"]);
        const bote = t > c["c3-ahi"] ? Math.abs(Math.sin((t - c["c3-ahi"]) * 9.4)) * 22 * Math.exp(-(t - c["c3-ahi"]) * 1.5) : 0;
        persona("s3-padre", t, { x: 210, y: 1440, s: 0.78, sube: bote, mira: 1, boca: habla(t, e, "sonrisa"), brazo: [[0, "abajo"], [c["c3-ahi"] - 0.15, "senala"]], ojos: [[0, "felices"]], fase: 1 });
        persona("s3-hijo", t, { x: 870, y: 1440, s: 0.78, mira: -1, boca: "seria", incl: [[0, 0], [c["c3-ahi"] + 0.3, 5]], espejo: true, fase: 2 });
      } },

    // 4 · Hijo (oficina): «No tan rápido. Entre 1995 y 2008 trabajaban cada vez más mujeres… y nacían más niños: de 1,16 a 1,45 hijos por mujer.»
    { n: 4, set: "vacio",
      svg: `${pizarra("s4-piz", L1, 1995, 2008, ["Mujeres con trabajo", "Hijos por mujer"])}${dos("s4")}`,
      tarjeta: tarjeta(4, "De 1995 a 2008", `${vs(4, es(D.subida[0].icf, 2), es(D.subida.at(-1).icf, 2), "hijos por mujer en 1995", "en 2008", "t-hoy", "t-hoy")}
        <div class="nota">Mujeres de 25 a 54 años con trabajo: del ${es(D.subida[0].emp)}&nbsp;% al ${es(D.subida.at(-1).emp)}&nbsp;%</div>`, { fuente: F_EUR, icono: bandera(44) }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("oficina", null, t, 0);
        pop("s4-piz", t, e.b + 0.2, 300, 760, { s: 1 });
        // Las dos líneas se dibujan a la vez y suben juntas: primero el empleo y, con «niños», los hijos por mujer.
        const k1 = suave((t - c["c4-1995"]) / (c["c4-2008"] - c["c4-1995"] + 0.8)), k2 = suave((t - c["c4-ninos"]) / 1.2);
        attr("s4-piz-l0", "stroke-dasharray", k1.toFixed(3) + " 1"); attr("s4-piz-l1", "stroke-dasharray", k2.toFixed(3) + " 1");
        css("s4-piz-t0", "opacity", clamp((t - c["c4-1995"]) / 0.3)); css("s4-piz-t1", "opacity", clamp((t - c["c4-ninos"]) / 0.3));
        sube("c4-a", t, c["c4-116"]); sube("c4-b", t, c["c4-145"]);
        persona("s4-padre", t, { x: 210, y: 1440, s: 0.78, mira: 1, boca: [[0, "sonrisa"], [c["c4-ninos"], "o"]], ojos: [[0, "felices"], [c["c4-ninos"], "grandes"]], fase: 1 });
        persona("s4-hijo", t, { x: 870, y: 1440, s: 0.78, mira: -1, boca: habla(t, e), brazo: [[0, "abajo"], [e.b, "empuja"], [c["c4-1995"], "senala"]], espejo: true, fase: 2 });
      } },

    // 5 · Padre (oficina): «¿Entonces qué ha cambiado?»
    { n: 5, set: "vacio",
      svg: `${pizarra("s5-piz", L1, 1995, 2008, ["Mujeres con trabajo", "Hijos por mujer"])}${dos("s5")}`,
      tarjeta: tarjeta(5, "Padre", `<div class="tit">«¿Entonces qué ha <mark id="m5">cambiado</mark>?»</div>`, { tono: "pasado" }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("oficina", null, t, 0);
        T("s5-piz", 300, 760); attr("s5-piz-l0", "stroke-dasharray", "1 1"); attr("s5-piz-l1", "stroke-dasharray", "1 1");
        marca("m5", t, c["c5-cambiado"]);
        persona("s5-padre", t, { x: 210, y: 1440, s: 0.78, mira: 1, boca: habla(t, e, "seria"), brazo: [[0, "abajo"], [e.b + 0.1, "piensa"]], incl: [[0, -6]], fase: 1 });
        persona("s5-hijo", t, { x: 870, y: 1440, s: 0.78, mira: -1, boca: "sonrisa", espejo: true, fase: 2 });
      } },

    // 6 · Hijo (parque): «En 1986, el padre tenía 2 días de permiso y la madre, 14 semanas. Hoy, 19 semanas cada uno.»
    { n: 6, set: "vacio",
      svg: `<rect x="300" y="740" width="480" height="430" rx="26" fill="#FFFDF8" opacity=".95"/>
        <text x="330" y="800" font-family="Cap" font-weight="800" font-size="34" fill="#8A6316">1986</text>
        <text x="330" y="990" font-family="Cap" font-weight="800" font-size="34" fill="${C.azul}">HOY</text>
        ${[["s6-p86", 820, "Padre"], ["s6-m86", 885, "Madre"], ["s6-phoy", 1010, "Padre"], ["s6-mhoy", 1075, "Madre"]].map(([id, y, et]) => `
          <text x="330" y="${y + 30}" font-family="Cap" font-weight="800" font-size="28" fill="${C.gris}">${et}</text>
          <rect x="440" y="${y}" width="310" height="42" rx="21" fill="#EDE7DC"/><rect id="${id}" x="440" y="${y}" width="0" height="42" rx="21" fill="${et === "Padre" ? "#56738A" : "#9B5A5A"}"/>`).join("")}
        ${dos("s6")}`,
      tarjeta: tarjeta(6, "Permiso por nacimiento", `<div class="vs"><div class="col"><div class="v t-pasado" id="c6-a" style="font-size:52px">${D.padreDias} días · ${D.madreSem} sem.</div><div class="n">1986: padre · madre</div></div>
        <div class="col"><div class="v t-hoy" id="c6-b" style="font-size:52px">${D.hoySem} semanas</div><div class="n">hoy, cada uno</div></div></div>`, { fuente: F_BOE, icono: bandera(44) }),
      fn: function (t, e) {
        const c = e.c, W = (sem) => 310 * sem / D.hoySem;
        ambiente("parque", "oficina", t, e.t0);
        attr("s6-p86", "width", (Math.max(10, W(D.padreDias / 7)) * suave((t - c["c6-2"]) / 0.4)).toFixed(1));
        attr("s6-m86", "width", (W(D.madreSem) * suave((t - c["c6-14"]) / 0.7)).toFixed(1));
        attr("s6-phoy", "width", (W(D.hoySem) * suave((t - c["c6-19"]) / 0.9)).toFixed(1));
        attr("s6-mhoy", "width", (W(D.hoySem) * suave((t - c["c6-19"] - 0.15) / 0.9)).toFixed(1));
        sube("c6-a", t, c["c6-2"]); sube("c6-b", t, c["c6-19"]);
        persona("s6-padre", t, { x: 210, y: 1440, s: 0.78, mira: 1, boca: [[0, "seria"], [c["c6-19"] + 0.5, "o"]], ojos: [[0, "normal"], [c["c6-19"] + 0.5, "grandes"]], fase: 1 });
        persona("s6-hijo", t, { x: 870, y: 1440, s: 0.78, mira: -1, boca: habla(t, e), brazo: [[0, "abajo"], [c["c6-2"], "senala"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camSueno(t, e.t0); } },

    // 7 · Padre (parque): «¡Diecinueve semanas! Yo, cuando naciste tú, tuve dos días y de vuelta al tajo.»
    { n: 7, set: "vacio",
      svg: `${carrito("s7-car")}${dos("s7")}`,
      tarjeta: tarjeta(7, "Padre", `<div class="tit">«¡Yo tuve <mark id="m7">dos días</mark>!»</div>`, { tono: "pasado" }),
      fn: function (t, e) {
        const c = e.c, k = t - e.t0;
        ambiente("parque", null, t, 0);
        // Un carrito cruza el parque por detrás.
        T("s7-car", -150 + 210 * k, 1330, { s: 0.9, r: Math.sin(k * 10) * 1.5 });
        marca("m7", t, c["c7-dos"]);
        persona("s7-padre", t, { x: 210, y: 1440, s: 0.78, mira: 1, boca: habla(t, e, "grande"), brazo: [[0, "arriba"], [c["c7-dos"] - 0.1, "senala"], [c["c7-tajo"], "hombros"]], ojos: [[0, "grandes"], [c["c7-dos"], "normal"]], fase: 1 });
        persona("s7-hijo", t, { x: 870, y: 1440, s: 0.78, mira: -1, boca: [[0, "seria"], [c["c7-tajo"], "sonrisa"]], espejo: true, fase: 2 });
      } },

    // 8 · Hijo (sala de cunas): «Y aun así, desde 2008 hemos bajado de 1,45 a 1,1 hijos por mujer.»
    { n: 8, set: "vacio",
      svg: `${pizarra("s8-piz", L2, 2008, 2024, ["Hijos por mujer"])}${dos("s8")}`,
      tarjeta: tarjeta(8, "Hijos por mujer", `${vs(8, es(D.bajada[0].icf, 2), es(D.bajada.at(-1).icf, 2), "en 2008", "en 2024", "t-hoy", "t-hoy")}
        <div class="nota">en 2016: ${es(D.bajada[3].icf, 2)}</div>`, { fuente: F_EUR2, icono: bandera(44) }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("cunas", "parque", t, e.t0);
        pop("s8-piz", t, e.t0 + 0.7, 300, 760, { s: 1 });
        attr("s8-piz-l0", "stroke-dasharray", suave((t - c["c8-145"]) / (c["c8-11"] - c["c8-145"] + 0.6)).toFixed(3) + " 1");
        css("s8-piz-t0", "opacity", clamp((t - c["c8-145"]) / 0.3));
        sube("c8-a", t, c["c8-145"]); sube("c8-b", t, c["c8-11"]);
        persona("s8-padre", t, { x: 210, y: 1440, s: 0.78, mira: 1, boca: [[0, "sonrisa"], [c["c8-11"], "seria"]], ojos: [[0, "normal"], [c["c8-11"] + 0.2, "grandes"]], fase: 1 });
        persona("s8-hijo", t, { x: 870, y: 1440, s: 0.78, mira: -1, boca: habla(t, e), brazo: [[0, "abajo"], [c["c8-145"], "senala"], [c["c8-11"] + 0.5, "hombros"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { const k = t - e.c["c8-11"] - 0.05, g = k >= 0 && k < 0.18; return { z: camSueno(t, e.t0).z, dx: 0, dy: g ? azar(7, Math.floor(t * 30)) * 8 : 0 }; } },

    // 9 · Hijo, a cámara (cocina): «¿Qué hace falta para tener hijos: tiempo, dinero o casa? ¿Tú qué opinas?»
    { n: 9, set: "vacio",
      svg: `${dos("s9")}${boton("s9-b1", "TIEMPO", "#7C9A7E")}${boton("s9-b2", "DINERO", "#C8902E")}${boton("s9-b3", "CASA", "#56738A")}${bocadillo("s9-boc")}`,
      tarjeta: tarjeta(9, "Te toca", `<div class="tit" style="font-size:60px">¿Qué hace falta para tener hijos: <mark id="m9">tiempo, dinero o casa</mark>?</div><div class="sub" id="c9-sub">¿Tú qué opinas? Te leo en los comentarios.</div>`),
      fn: function (t, e) {
        const c = e.c;
        ambiente("cocina", "cunas", t, e.t0);
        pop("s9-b1", t, c["c9-tiempo"], 540, 860, { s: 0.85 }); pop("s9-b2", t, c["c9-dinero"], 540, 960, { s: 0.85 }); pop("s9-b3", t, c["c9-casa"], 540, 1060, { s: 0.85 });
        if (pop("s9-boc", t, c["c9-boc"], 540, 700, { s: 0.9 }) >= 0) for (let i = 0; i < 3; i++) attr("s9-boc-p" + i, "cy", (-6 - 16 * Math.max(0, Math.sin((t - c["c9-boc"]) * 8 - i * 0.9))).toFixed(1));
        marca("m9", t, c["c9-tiempo"]); sube("c9-sub", t, c["c9-boc"] - 0.2);
        persona("s9-padre", t, { x: 210, y: 1440, s: 0.78, mira: 0, boca: "sonrisa", brazo: [[0, "abajo"], [c["c9-casa"], "arriba"]], fase: 1 });
        persona("s9-hijo", t, { x: 870, y: 1440, s: 0.78, mira: 0, boca: habla(t, e), brazo: [[0, "abajo"], [c["c9-tiempo"], "arriba"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camSueno(t, e.t0); } },
  ];
}
