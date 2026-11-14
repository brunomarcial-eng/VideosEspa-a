// Escenas de T2 (guion v4) en estilo «limpio». Tres «fotos» de España (2007, 2016 y hoy) con las
// mismas tres cifras: habitantes (mapa), trabajando (un comercio con alguien trabajando) y en paro
// (tablón de ofertas de empleo), y un gráfico de un vistazo en cada foto (rosquilla o barras).
// Cada escena: decorado (set), dibujo (svg), tarjeta (HTML) y acción (fn, se ejecuta en la página
// con las utilidades de diseno/limpio_runtime.js). Los momentos e.c[...] salen de historia.json.
/* eslint-disable no-undef */

import { C, persona, bocadillo, tarjeta } from "../../diseno/limpio.mjs";
import { bandera, fotoMapa, MAX_FIGURITAS, fachada, acera, ESCAPARATE, interiorCarniceria, interiorCafeteria,
  interiorOficina, interiorTaller, tablon, colaParo, rosquilla } from "../../diseno/barrio.mjs";

export const ESTILO = "limpio";
const F_POB = (a, prov = "") => `Dato oficial: INE, población a 1 de julio de ${a}${prov}`;
const F_EPA = (a) => `Dato oficial: INE, EPA, 3.er trimestre de ${a}`;
const F_C = "Cálculo propio con datos del INE (EPA y población)";

export function datos(t2) {
  const m = t2.mismo_trimestre, A = ["2007T3", "2016T3", "2026T3"].map((k) => m[k]);
  const pob = A.map((x) => x.poblacion_total_miles / 1000), ocu = A.map((x) => x.ocupados_miles / 1000), par = A.map((x) => x.parados_miles / 1000);
  const v = (a, b) => 100 * (b / a - 1);
  const D = {
    pob, ocu, par,
    c100: A.map((x) => Math.round((100 * x.ocupados_miles) / x.poblacion_total_miles)),   // trabajan de cada 100 habitantes: 46, 40, 46
    fig: pob.map((p) => Math.round(p * 2)),          // figuritas en el mapa: una por cada medio millón de habitantes
    cola: par.map((p) => Math.round(p / 0.87)),      // personas ante el tablón: una por cada 0,87 millones de parados (2, 5 y 3)
    vPob16: v(pob[0], pob[1]), vOcu16: v(ocu[0], ocu[1]), vPar16: v(par[0], par[1]),
    vPob: v(pob[0], pob[2]), vOcu: v(ocu[0], ocu[2]), vPar: v(par[0], par[2]), vPar2616: v(par[1], par[2]),
    R: 250, L: 2 * Math.PI * 250,
    c: { ocre: C.ocre, azul: C.azul, salvia: C.salvia, gris: "#5B6470" },
  };
  if (Math.max(...D.fig) > MAX_FIGURITAS) throw new Error(`El mapa solo tiene sitio para ${MAX_FIGURITAS} figuritas`);
  return D;
}

// ------------------------------------------------------------------ piezas de T2
const MARTA = { pelo: "largo" };
const TIENDAS = {
  car: { nombre: "CARNICERÍA", pared: "#E9D8C2", rotulo: "#7D4444", toldo: "#B06A5E", fondo: "#EAF2F4", tipo: "carniceria" },
  rop: { nombre: "MODA", pared: "#E6D6CF", rotulo: "#6F5F88", toldo: "#8E7CA8", tipo: "ropa" },
  caf: { nombre: "CAFETERÍA", pared: "#EBC9A6", rotulo: "#2F3B35", toldo: C.salvia, tipo: "cafeteria" },
  tal: { nombre: "TALLER", pared: "#D3D7DA", rotulo: "#46606F", toldo: "#5D7A8C", tipo: "taller" },
  cer: { nombre: "", pared: "#DCCFC0", rotulo: "#9AA0A6", toldo: "#B8BEC3", cerrado: true },
};
// La calle del barrio: comercios uno al lado de otro (lista de [tienda, x]).
function calle(p, lista) {
  let s = `<rect x="-1400" y="-1400" width="3900" height="2700" fill="#D8C6AE"/>`;
  for (const [k, x] of lista) {
    const o = TIENDAS[k];
    s += fachada(`${p}-${k}`, x, { ...o, dentro: o.tipo ? ESCAPARATE[o.tipo](`${p}-${k}`) : "" });
  }
  return s + acera(-1400, 3900);
}
const BARRIO = [["car", -500], ["rop", 20], ["caf", 540], ["tal", 1060]];
const num = (id, tono, uni, small, ancho = 330) =>
  `<div class="fila"><div class="num t-${tono}" id="${id}" style="min-width:${ancho}px"></div><div class="uni">${uni}<small>${small}</small></div></div>`;

export function escenas(D) {
  const es = (v, d = 1) => v.toFixed(d).replace(".", ",");
  const pc = (v) => `${v > 0 ? "+" : "−"}${Math.abs(Math.round(v))} %`;
  return [
    // 1 · «¿Hay más gente en paro o trabajando que antes de la crisis? Hablamos de España. Y te lo enseño en tres fotos.»
    { n: 1, set: "vacio",
      svg: `${calle("s1", BARRIO)}${persona("s1-marta", "hoy", MARTA)}`,
      tarjeta: tarjeta(1, "España", `<div class="tit" style="font-size:62px">¿Hay más gente en <mark id="m1a">paro</mark> o <mark id="m1b">trabajando</mark> que antes de la crisis?</div>`,
        { icono: bandera(56) }),
      fn: function (t, e) {
        const c = e.c;
        ["car", "rop", "caf", "tal"].forEach(function (k, i) {   // abren los comercios: suben las persianas
          T("s1-" + k + "-pers", 0, -440 * suave((t - c["c1-pers"] - i * 0.22) / 0.9));
        });
        trabaja("s1-car-t", t, { ritmo: 0.42 }); trabaja("s1-rop-t", t, { ritmo: 0.7, a: "abajo", b: "sujeta", fase: 0.3 });
        trabaja("s1-caf-t", t, { ritmo: 0.6, a: "sujeta", b: "empuja", fase: 0.1 }); trabaja("s1-tal-t", t, { ritmo: 0.35, a: "sujeta", b: "senala", fase: 0.2 });
        const k = suave((t - e.t0 - 0.3) / 2.4);
        persona("s1-marta", t, { x: 1350 - 750 * k, y: 1420, s: 1, anda: [[0, true], [e.t0 + 2.7, false]],
          mira: [[0, -1], [e.t0 + 2.7, 0]], ojos: [[0, "normal"], [c["c1-espana"], "grandes"], [c["c1-fotos"], "felices"]],
          boca: [[0, "sonrisa"], [c["c1-espana"], "o"], [c["c1-fotos"], "grande"]], brazo: [[0, "abajo"], [c["c1-fotos"], "saluda"]], fase: 1 });
        marca("m1a", t, c["c1-paro"]); marca("m1b", t, c["c1-trab"]);
      },
      cam: function (t, e) { return { z: 0.5 + 0.05 * suave((t - e.t0) / 6) }; } },

    // 2 · «Foto uno: 2007, justo antes de la crisis. En España vivíamos 45,2 millones de personas.»
    { n: 2, set: "vacio",
      svg: fotoMapa("s2-f", D.fig[0], "2007"),
      tarjeta: tarjeta(2, "España · 2007", num("c2-num", "pasado", "millones", "de habitantes", 300), { tono: "pasado", icono: bandera(34), fuente: F_POB(2007) }),
      fn: function (t, e) {
        const cf = e.c["c2-foto"], cc = e.c["c2-cuenta"], cd = e.c["c2-dato"];
        const k = (t - cf) / 0.5;   // cae la foto
        T("s2-f", 540, 1035 - 260 * (1 - fuera(k)), { s: 0.95, r: -2 + 6 * (1 - fuera(k)), op: clamp(k * 3) });
        for (let i = 0; i < D.fig[0]; i++) css("s2-f-f" + i, "opacity", clamp((t - (cc + (cd - cc) * i / D.fig[0])) / 0.12));
        txt("c2-num", t < cc ? "" : es(D.pob[0] * suave((t - cc) / (cd - cc))));
      } },

    // 3 · «De esas, trabajando: 20,8 millones.»
    { n: 3, set: "vacio",
      svg: `${interiorCarniceria("s3-c")}${persona("s3-marta", "antes", MARTA)}`,
      tarjeta: tarjeta(3, "2007 · Trabajando", num("c3-num", "pasado", "millones", "de personas trabajando"), { tono: "pasado", fuente: F_EPA(2007) }),
      fn: function (t, e) {
        trabaja("s3-c-tp", t, { ritmo: 0.42, mira: -1 });
        const k = suave((t - e.t0) / 1.3);
        persona("s3-marta", t, { x: -160 + 420 * k, y: 1420, s: 0.9, anda: [[0, true], [e.t0 + 1.3, false]], mira: [[0, 1]],
          ojos: [[0, "normal"], [e.c["c3-dato"], "felices"]], boca: [[0, "sonrisa"], [e.c["c3-dato"], "grande"]], fase: 2 });
        txt("c3-num", t < e.c["c3-dato"] - 0.05 ? "" : es(D.ocu[0]));
        sube("c3-num", t, e.c["c3-dato"] - 0.05);
      } },

    // 4 · «Y en paro, 1,8 millones.»
    { n: 4, set: "vacio",
      svg: `${tablon("s4-t")}${colaParo("s4-q", D.cola[0])}`,
      tarjeta: tarjeta(4, "2007 · En paro", num("c4-num", "pasado", "millones", "de personas en paro"), { tono: "pasado", fuente: F_EPA(2007) }),
      fn: function (t, e) {
        for (let k = 0; k < D.cola[0]; k++) andar("s4-q-q" + k, t, { x0: 1300 + k * 140, v: -620, hasta: 400 + k * 140, y: 1440, t0: e.t0 + k * 0.15, fase: k });
        T("s4-q-lupa", 452, 1066 + Math.sin(t * 3) * 6, { r: -10 + Math.sin(t * 2) * 8, op: clamp((t - e.t0 - 1.4) / 0.3) });
        txt("c4-num", t < e.c["c4-dato"] - 0.05 ? "" : es(D.par[0]));
        sube("c4-num", t, e.c["c4-dato"] - 0.05);
      } },

    // 5 · «O sea, de cada 100 habitantes, trabajaban 46.»
    { n: 5, set: "vacio",
      svg: rosquilla("s5-r", 540, 1010, D.R, 110, C.ocre),
      tarjeta: tarjeta(5, "2007 · De cada 100 habitantes", `<div class="tit">Trabajan <mark id="m5"><span id="c5-n" style="display:inline-block">${D.c100[0]}</span></mark></div><div class="sub">El resto: niños, estudiantes, jubilados, parados…</div>`,
        { tono: "pasado", fuente: F_C }),
      fn: function (t, e) {
        const c0 = e.c["c5-46"], c1 = e.c["c5-dato"], v = D.c100[0] * suave((t - c0) / (c1 - c0));
        attr("s5-r-arco", "stroke-dasharray", (D.L * v / 100).toFixed(1) + " " + D.L.toFixed(1));
        txt("s5-r-num", t < c0 ? "" : String(Math.round(v)));
        marca("m5", t, c1); sube("c5-n", t, c1 - 0.1);
      } },

    // 6 · «Foto dos: 2016. Ya somos 46,4 millones. Un 3 % más.»
    { n: 6, set: "vacio",
      svg: `<g transform="translate(500 1060) rotate(-6) scale(.95)">${fotoMapa("s6-v", D.fig[0], "2007")}</g>${fotoMapa("s6-f", D.fig[1], "2016")}`,
      tarjeta: tarjeta(6, "España · 2016", num("c6-num", "pasado", "millones", `de habitantes<b class="t-pasado" id="c6-pct" style="display:inline-block">&nbsp;· ${pc(D.vPob16)}</b>`, 300),
        { tono: "pasado", icono: bandera(34), fuente: F_POB(2016) }),
      fn: function (t, e) {
        const cf = e.c["c6-foto"], cc = e.c["c6-cuenta"], cd = e.c["c6-dato"], k = (t - cf) / 0.5;
        T("s6-f", 560, 1035 - 260 * (1 - fuera(k)), { s: 0.95, r: 3 - 6 * (1 - fuera(k)), op: clamp(k * 3) });
        for (let i = 0; i < D.fig[1]; i++) css("s6-f-f" + i, "opacity", i < D.fig[0] ? 1 : clamp((t - cd - (i - D.fig[0]) * 0.12) / 0.12));
        txt("c6-num", es(D.pob[0] + (D.pob[1] - D.pob[0]) * suave((t - cc) / (cd - cc))));
        sube("c6-pct", t, e.c["c6-pct"]);
      } },

    // 7 · «Pero trabajando, solo 18,5 millones. Un 11 % menos.»
    { n: 7, set: "vacio",
      svg: `${calle("s7", [["car", -500], ["rop", 20], ["cer", 540], ["tal", 1060]])}${persona("s7-marta", "antes", MARTA)}`,
      tarjeta: tarjeta(7, "2016 · Trabajando", num("c7-num", "pasado", "millones", `de personas trabajando<b class="t-pasado" id="c7-pct" style="display:inline-block">&nbsp;· ${pc(D.vOcu16)}</b>`),
        { tono: "pasado", fuente: F_EPA(2016) }),
      fn: function (t, e) {
        trabaja("s7-rop-t", t, { ritmo: 0.7, a: "abajo", b: "sujeta" }); trabaja("s7-car-t", t, { ritmo: 0.42 }); trabaja("s7-tal-t", t, { ritmo: 0.35, a: "sujeta", b: "senala" });
        const ce = e.c["c7-entra"], k = suave((t - e.t0) / (ce - e.t0 - 0.2));
        persona("s7-marta", t, { x: 1250 - 790 * k, y: 1420, s: 0.95, anda: [[0, true], [ce - 0.2, false]], mira: [[0, -1]], fase: 2 });
        css("s7-marta", "opacity", (1 - clamp((t - ce) / 0.35)).toFixed(2));   // entra en la tienda
        txt("c7-num", t < e.c["c7-dato"] - 0.05 ? "" : es(D.ocu[1]));
        sube("c7-num", t, e.c["c7-dato"] - 0.05); sube("c7-pct", t, e.c["c7-pct"]);
      },
      cam: function () { return { z: 0.9, fx: 560 }; } },

    // 8 · «¿Y en paro? 4,3 millones. Más del doble.»
    { n: 8, set: "vacio",
      svg: `${tablon("s8-t")}${colaParo("s8-q", D.cola[1])}`,
      tarjeta: tarjeta(8, "2016 · En paro", num("c8-num", "pasado", "millones", `de personas en paro<b class="t-pasado" id="c8-pct" style="display:inline-block">&nbsp;· ${pc(D.vPar16)}</b>`),
        { tono: "pasado", fuente: F_EPA(2016) }),
      fn: function (t, e) {
        for (let k = 0; k < D.cola[1]; k++) andar("s8-q-q" + k, t, { x0: 1300 + k * 140, v: -700, hasta: 400 + k * 140, y: 1440, t0: e.t0 + k * 0.18, fase: k });
        T("s8-q-lupa", 452, 1066 + Math.sin(t * 3) * 6, { r: -10 + Math.sin(t * 2) * 8, op: clamp((t - e.t0 - 1.4) / 0.3) });
        txt("c8-num", t < e.c["c8-dato"] - 0.05 ? "" : es(D.par[1]));
        sube("c8-num", t, e.c["c8-dato"] - 0.05); sube("c8-pct", t, e.c["c8-doble"]);
      } },

    // 9 · «De cada 100 habitantes, trabajan 40. Seis menos.»
    { n: 9, set: "vacio",
      svg: rosquilla("s9-r", 540, 1010, D.R, 110, C.ocre),
      tarjeta: tarjeta(9, "2016 · De cada 100 habitantes", `<div class="tit">Trabajan <mark id="m9"><span id="c9-n" style="display:inline-block">${D.c100[1]}</span></mark></div><div class="sub" id="c9-sub">En 2007: ${D.c100[0]}</div>`,
        { tono: "pasado", fuente: F_C }),
      fn: function (t, e) {
        const c0 = e.c["c9-40"], c1 = e.c["c9-dato"], v = D.c100[0] + (D.c100[1] - D.c100[0]) * suave((t - c0) / (c1 - c0));
        attr("s9-r-arco", "stroke-dasharray", (D.L * v / 100).toFixed(1) + " " + D.L.toFixed(1));
        txt("s9-r-num", String(Math.round(v)));
        attr("s9-r-fant", "transform", "rotate(" + (D.c100[0] * 3.6).toFixed(1) + " 540 1010)"); ver("s9-r-fant", t >= c0);
        marca("m9", t, c1); sube("c9-n", t, c1 - 0.1); sube("c9-sub", t, e.c["c9-seis"]);
      } },

    // 10 · «Foto tres: hoy. Somos 49,8 millones. Un 10 % más que en 2007.»
    { n: 10, set: "vacio",
      svg: `<g transform="translate(490 1070) rotate(-7) scale(.93)">${fotoMapa("s10-v", D.fig[0], "2007")}</g><g transform="translate(570 1050) rotate(4) scale(.94)">${fotoMapa("s10-w", D.fig[1], "2016")}</g>${fotoMapa("s10-f", D.fig[2], "HOY")}`,
      tarjeta: tarjeta(10, "España · hoy (2026)", num("c10-num", "hoy", "millones", `de habitantes<span id="c10-pct" style="display:inline-block">&nbsp;· <b class="t-hoy">${pc(D.vPob)}</b> desde 2007</span>`, 300),
        { tono: "hoy", icono: bandera(34), fuente: F_POB(2026, " (provisional)") }),
      fn: function (t, e) {
        const cf = e.c["c10-foto"], cc = e.c["c10-cuenta"], cd = e.c["c10-dato"], k = (t - cf) / 0.5;
        T("s10-f", 540, 1035 - 260 * (1 - fuera(k)), { s: 0.95, r: -1 + 6 * (1 - fuera(k)), op: clamp(k * 3) });
        for (let i = 0; i < D.fig[2]; i++) css("s10-f-f" + i, "opacity", i < D.fig[1] ? 1 : clamp((t - cd - (i - D.fig[1]) * 0.08) / 0.12));
        txt("c10-num", es(D.pob[1] + (D.pob[2] - D.pob[1]) * suave((t - cc) / (cd - cc))));
        sube("c10-pct", t, e.c["c10-pct"]);
      } },

    // 11 · «Trabajando, 22,9 millones. Récord. Y también un 10 % más.»
    { n: 11, set: "vacio",
      svg: `<g id="s11-a">${interiorCafeteria("s11-ca")}${persona("s11-marta", "hoy", MARTA)}</g><g id="s11-b">${interiorOficina("s11-of")}</g><g id="s11-c">${interiorTaller("s11-ta")}</g>`,
      tarjeta: tarjeta(11, "Hoy · Trabajando", num("c11-num", "hoy", "millones", `<span id="c11-rec" style="display:inline-block">récord de la EPA (serie desde 2002)</span><b class="t-hoy" id="c11-pct" style="display:inline-block">&nbsp;· ${pc(D.vOcu)}</b>`),
        { tono: "hoy", fuente: F_EPA(2026) }),
      fn: function (t, e) {
        const cr = e.c["c11-record"], ct = e.c["c11-tambien"], cual = t < cr ? 0 : t < ct ? 1 : 2;
        ver("s11-a", cual === 0); ver("s11-b", cual === 1); ver("s11-c", cual === 2);
        if (cual === 0) {
          trabaja("s11-ca-tp", t, { ritmo: 0.6, a: "sujeta", b: "empuja", mira: -1 });
          vapor("s11-ca-v", 3, t, 611, 990);
          persona("s11-marta", t, { x: 260, y: 1420, s: 0.9, mira: [[0, 1]], ojos: [[0, "normal"], [e.c["c11-dato"], "felices"]], boca: [[0, "sonrisa"], [e.c["c11-dato"], "grande"]], fase: 1 });
        } else if (cual === 1) {
          trabaja("s11-of-p0", t, { ritmo: 0.22, a: "empuja", b: "sujeta" }); trabaja("s11-of-p1", t, { ritmo: 0.26, a: "sujeta", b: "empuja", fase: 0.1 });
        } else trabaja("s11-ta-tp", t, { ritmo: 0.32, a: "sujeta", b: "senala", mira: 1 });
        txt("c11-num", t < e.c["c11-dato"] - 0.05 ? "" : es(D.ocu[2]));
        sube("c11-num", t, e.c["c11-dato"] - 0.05); sube("c11-rec", t, cr); sube("c11-pct", t, e.c["c11-pct"]);
      } },

    // 12 · «En paro, 2,6 millones. Un 43 % más que antes de la crisis.»
    { n: 12, set: "vacio",
      svg: `${tablon("s12-t")}${colaParo("s12-q", D.cola[2])}`,
      tarjeta: tarjeta(12, "Hoy · En paro", num("c12-num", "hoy", "millones", `de personas en paro<span id="c12-pct" style="display:inline-block">&nbsp;· <b class="t-hoy">${pc(D.vPar)}</b> desde 2007</span>`),
        { tono: "hoy", fuente: F_EPA(2026) }),
      fn: function (t, e) {
        for (let k = 0; k < D.cola[2]; k++) andar("s12-q-q" + k, t, { x0: 1300 + k * 140, v: -650, hasta: 400 + k * 140, y: 1440, t0: e.t0 + k * 0.16, fase: k });
        T("s12-q-lupa", 452, 1066 + Math.sin(t * 3) * 6, { r: -10 + Math.sin(t * 2) * 8, op: clamp((t - e.t0 - 1.4) / 0.3) });
        txt("c12-num", t < e.c["c12-dato"] - 0.05 ? "" : es(D.par[2]));
        sube("c12-num", t, e.c["c12-dato"] - 0.05); sube("c12-pct", t, e.c["c12-pct"]);
      } },

    // 13 · «Mira las barras: población y trabajo crecen lo mismo. El paro, mucho más.»
    { n: 13, set: "vacio",
      svg: `${[["Habitantes", C.salvia, D.vPob], ["Trabajando", C.azul, D.vOcu], ["En paro", "#5B6470", D.vPar]].map(([l, col, v], i) =>
        `<text x="90" y="${770 + i * 236}" font-family="Cap" font-weight="800" font-size="54" fill="${C.tinta}">${l}</text>
        <rect x="90" y="${792 + i * 236}" width="${(43 * 15 + 40).toFixed(0)}" height="118" rx="20" fill="#E6DFD2" opacity=".6"/>
        <rect id="s13-b${i}" x="90" y="${792 + i * 236}" width="0" height="118" rx="20" fill="${col}"/>
        <text id="s13-v${i}" x="0" y="${872 + i * 236}" font-family="Cap" font-weight="800" font-size="66" fill="${col}">${pc(v)}</text>`).join("")}
        <g id="s13-ig">${[[778, 924], [1014, 1160]].map(([a, b]) => `<line x1="${90 + D.vPob * 15}" x2="${90 + D.vPob * 15}" y1="${a}" y2="${b}" stroke="${C.tinta}" stroke-width="7" stroke-dasharray="16 11"/>`).join("")}
          <path d="M${90 + D.vPob * 15 + 238} 850 q44 0 44 44 v150 q0 44 -44 44" fill="none" stroke="${C.tinta}" stroke-width="7" stroke-linecap="round"/>
          <text x="${90 + D.vPob * 15 + 300}" y="986" font-family="Cap" font-weight="800" font-size="50" fill="${C.tinta}">¡Lo mismo!</text></g>`,
      tarjeta: tarjeta(13, "Desde 2007 · España", `<div class="tit">¿Cuánto ha crecido cada cosa?</div>`, { fuente: F_C }),
      fn: function (t, e) {
        const cb = e.c["c13-barras"], cm = e.c["c13-mismo"], cp = e.c["c13-paro"];
        const V = [D.vPob, D.vOcu, D.vPar];
        for (let i = 0; i < 3; i++) {
          let v = Math.min(V[i], 10.1) * suave((t - cb) / 0.8);
          if (i === 2) v += (V[2] - 10.1) * suave((t - cp) / 0.9);
          attr("s13-b" + i, "width", (v * 15).toFixed(1));
          attr("s13-v" + i, "x", (112 + v * 15).toFixed(1));
          css("s13-v" + i, "opacity", i < 2 ? clamp((t - cb - 0.6) / 0.3) : clamp((t - cp - 0.7) / 0.3));
        }
        css("s13-ig", "opacity", clamp((t - cm) / 0.3));
      } },

    // 14 · «Por eso hoy, de cada 100 habitantes, vuelven a trabajar 46. Como en 2007.»
    { n: 14, set: "vacio",
      svg: rosquilla("s14-r", 540, 1010, D.R, 110, C.azul),
      tarjeta: tarjeta(14, "Hoy · De cada 100 habitantes", `<div class="tit">Trabajan <mark id="m14"><span id="c14-n" style="display:inline-block">${D.c100[2]}</span></mark></div><div class="sub" id="c14-sub">En 2007: ${D.c100[0]}. Igual.</div>`,
        { tono: "hoy", fuente: F_C }),
      fn: function (t, e) {
        const c0 = e.c["c14-46"], c1 = e.c["c14-dato"], v = D.c100[1] + (D.c100[2] - D.c100[1]) * suave((t - c0) / (c1 - c0));
        attr("s14-r-arco", "stroke-dasharray", (D.L * v / 100).toFixed(1) + " " + D.L.toFixed(1));
        txt("s14-r-num", String(Math.round(v)));
        attr("s14-r-fant", "transform", "rotate(" + (D.c100[0] * 3.6).toFixed(1) + " 540 1010)"); ver("s14-r-fant", true);
        marca("m14", t, c1); sube("c14-n", t, c1 - 0.1); sube("c14-sub", t, e.c["c14-como"]);
      } },

    // 15 · «¿Mejora o empeora? Frente a 2016, mejora: un 40 % menos de paro. Frente a 2007, empeora: un 43 % más de paro.»
    { n: 15, set: "vacio",
      svg: `${calle("s15", BARRIO)}${persona("s15-marta", "hoy", MARTA)}`,
      tarjeta: tarjeta(15, "El veredicto", `<div class="tit" style="font-size:60px">¿<mark id="m15a">Mejora</mark> o <mark id="m15b">empeora</mark>?</div>
        <div class="ops"><div class="op" id="c15-o0"><i></i><span class="lab" style="width:290px">Frente a 2016</span><b>Mejora</b><span style="font:600 30px Cap;color:${C.gris};margin-left:4px;white-space:nowrap">${pc(D.vPar2616)} de paro</span></div>
        <div class="op" id="c15-o1"><i></i><span class="lab" style="width:290px">Frente a 2007</span><b>Empeora</b><span style="font:600 30px Cap;color:${C.gris};margin-left:4px;white-space:nowrap">${pc(D.vPar)} de paro</span></div></div>`, { fuente: F_C }),
      fn: function (t, e) {
        const c = e.c, cs = c["c15-sello"];
        trabaja("s15-car-t", t, { ritmo: 0.42 }); trabaja("s15-rop-t", t, { ritmo: 0.7, a: "abajo", b: "sujeta" });
        trabaja("s15-caf-t", t, { ritmo: 0.6, a: "sujeta", b: "empuja" }); trabaja("s15-tal-t", t, { ritmo: 0.35, a: "sujeta", b: "senala" });
        marca("m15a", t, c["c15-m"]); marca("m15b", t, c["c15-e"]);
        sube("c15-o0", t, c["c15-16"]); sube("c15-o1", t, c["c15-07"]);
        $("c15-o0").className = "op" + (t >= c["c15-mejora"] ? " si" : "");
        $("c15-o1").className = "op" + (t >= cs ? " si" : "");
        persona("s15-marta", t, { x: 540, y: 1420, s: 1, brazo: [[0, "abajo"], [c["c15-mejora"], "arriba"], [cs, "abajo"]],
          ojos: [[0, "normal"], [c["c15-mejora"], "felices"], [cs, "normal"]], boca: [[0, "seria"], [c["c15-mejora"], "grande"], [cs, "seria"]], incl: [[cs, -5]], fase: 1 });
      },
      cam: function (t, e) { const k = t - e.c["c15-sello"], g = k >= 0 && k < 0.22; return { z: 0.56, dx: g ? azar(3, Math.floor(t * 30)) * 9 : 0, dy: g ? azar(4, Math.floor(t * 30)) * 9 : 0 }; } },

    // 16 · «Más gente trabajando que nunca. Y más parados que antes de la crisis. ¿Cómo puede ser? ¿Tú cómo te lo explicas?»
    { n: 16, set: "vacio",
      svg: `${calle("s16", BARRIO)}${persona("s16-marta", "hoy", MARTA)}${bocadillo("s16-boc")}`,
      tarjeta: tarjeta(16, "Te toca", `<div class="tit">Más gente trabajando que <mark id="m16a">nunca</mark>. Y más parados que <mark id="m16b">antes de la crisis</mark>.</div>
        <div class="sub" id="c16-sub" style="font-weight:800;color:${C.tinta}">¿Cómo puede ser? Te leo en los comentarios.</div>`),
      fn: function (t, e) {
        const c = e.c, cb = c["c16-boc"], cc = c["c16-como"];
        trabaja("s16-car-t", t, { ritmo: 0.42 }); trabaja("s16-rop-t", t, { ritmo: 0.7, a: "abajo", b: "sujeta" });
        trabaja("s16-caf-t", t, { ritmo: 0.6, a: "sujeta", b: "empuja" }); trabaja("s16-tal-t", t, { ritmo: 0.35, a: "sujeta", b: "senala" });
        persona("s16-marta", t, { x: 420, y: 1420, s: 1, mira: [[0, 0], [c["c16-trab"], -1], [c["c16-paro"], 1], [cc, 0]],
          brazo: [[0, "abajo"], [cc, "hombros"], [cb, "abajo"]], ojos: [[0, "normal"], [cc, "grandes"], [cb, "felices"]], boca: [[0, "sonrisa"], [cc, "o"], [cb, "grande"]],
          incl: [[cc, 6], [cb, 0]], fase: 1 });
        marca("m16a", t, c["c16-trab"] + 0.5); marca("m16b", t, c["c16-paro"] + 0.5); sube("c16-sub", t, cc - 0.1);
        if (pop("s16-boc", t, cb, 900, 1000, { s: 1.5 }) >= 0) for (let i = 0; i < 3; i++) attr("s16-boc-p" + i, "cy", (-6 - 16 * Math.max(0, Math.sin((t - cb) * 8 - i * 0.9))).toFixed(1));
      },
      cam: function () { return { z: 0.56 }; } },
  ];
}
