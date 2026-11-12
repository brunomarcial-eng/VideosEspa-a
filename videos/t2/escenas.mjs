// Escenas de T2 (guion v3) en estilo «limpio»: una idea por escena, una tarjeta por dato.
// Cada escena: decorado (set), dibujo (svg), tarjeta (HTML) y acción (fn, se ejecuta en la página
// con las utilidades de diseno/limpio_runtime.js). Los momentos e.c[...] salen de historia.json.
// La rejilla de 100 personas es una capa compartida por las escenas 6 a 10 (capas()).
/* eslint-disable no-undef */

import { C, persona, figura, paseante, lupa, TAZA, bocadillo, tarjeta } from "../../diseno/limpio.mjs";

export const ESTILO = "limpio";
const FUENTE = "Dato oficial: INE, Encuesta de Población Activa";
const FUENTE_C = "Cálculo propio con datos del INE (EPA)";

export function datos(t2) {
  const m = t2.mismo_trimestre;
  return {
    o07: m["2007T3"].ocupados_miles / 1000, o16: m["2016T3"].ocupados_miles / 1000, o26: m["2026T3"].ocupados_miles / 1000,
    pob: (m["2026T3"].poblacion_16_mas_miles - m["2007T3"].poblacion_16_mas_miles) / 1000,
    e07: Math.round(m["2007T3"].tasa_empleo_16_64_pct), e16: Math.round(m["2016T3"].tasa_empleo_16_64_pct),
    e26: Math.round(m["2026T3"].tasa_empleo_16_64_pct),
    p07: m["2007T3"].tasa_paro_pct, p16: m["2016T3"].tasa_paro_pct, p26: m["2026T3"].tasa_paro_pct,
    // Gente por la calle: una persona por cada 2 millones de ocupados (10, 9 y 11).
    n07: Math.round(m["2007T3"].ocupados_miles / 2000), n16: Math.round(m["2016T3"].ocupados_miles / 2000),
    n26: Math.round(m["2026T3"].ocupados_miles / 2000),
    c: { ocre: C.ocre, azul: C.azul, gris: "#C9CED3", ocreTxt: "#8A6316" },
  };
}

// ------------------------------------------------------------------ piezas de T2
const CAMISAS = ["#C98F6B", "#7C9A7E", "#8E7CA8", "#C2A24E", "#6F8FA6", "#B5706A"];
const PIELES = ["#EDBE96", "#D9A47E", "#C68A62", "#F1C9A5"];
// Gente andando: primero el carril del fondo y luego el de delante, para que no se pisen.
function gente(p, n) {
  const orden = [...Array(n).keys()].sort((a, b) => (a % 2) - (b % 2) || a - b);
  return orden.map((i) => paseante(`${p}-w${i}`, CAMISAS[i % CAMISAS.length], PIELES[(i * 3) % PIELES.length])).join("");
}
const MARTA = { pelo: "largo" };

// Rejilla de 10 × 10 (capa compartida). Marta es la figura 44: lleva el pelo largo y un aro amarillo.
export const MARTA_I = 44;
const RX = (i) => 162 + (i % 10) * 84, RY = (i) => 744 + Math.floor(i / 10) * 72;
export function capas() {
  const pelo = `<path d="M-27 -76 C-29 -104 -10 -108 0 -107 C12 -108 29 -102 27 -76 L31 -42 Q31 -36 25 -36 H-25 Q-31 -36 -31 -42 Z" fill="${C.pelo}"/>`;
  let s = `<g id="rejilla" class="capa" style="display:none">`;
  for (let i = 0; i < 100; i++) {
    if (i === MARTA_I) s += `<circle id="rj-aro" cx="${RX(i)}" cy="${RY(i) - 30}" r="42" fill="none" stroke="${C.marcador}" stroke-width="7"/>`;
    s += figura(`rj${i}`, RX(i), RY(i), 0.6, "#C9CED3", i === MARTA_I ? pelo : "");
  }
  s += `<g id="rj-brazo"><rect x="-8" y="-52" width="16" height="50" rx="8" fill="#9AA6AE"/></g>`;
  s += `<g id="rj-pregunta"><circle r="36" fill="#FFFDF8" stroke="#E3D6BF" stroke-width="5"/><text y="17" text-anchor="middle" font-family="Cap" font-weight="800" font-size="52" fill="${C.tinta}">?</text></g>`;
  for (let k = 0; k < 10; k++) s += lupa(`rj-l${k}`, 0.8);
  return s + `</g>`;
}

// Gráfico de la tasa de paro (dentro de la tarjeta 11): 2007, 2016 y hoy.
function graficoParo(D) {
  const X = [120, 430, 740], y = (v) => 252 - v * 9, V = [D.p07, D.p16, D.p26];
  const P = V.map((v, i) => [X[i], y(v)]), col = [C.ocre, C.ocre, C.azul];
  const es = (v) => v.toFixed(1).replace(".", ",");
  return `<svg class="linea" width="860" height="320" viewBox="0 0 860 320">
    <line id="c11-ref" x1="40" x2="830" y1="${P[0][1]}" y2="${P[0][1]}" stroke="${C.ocre}" stroke-width="5" stroke-dasharray="14 12" opacity="0"/>
    <path id="c11-l1" d="M${P[0]} L${P[1]}" fill="none" stroke="${C.tinta}" stroke-width="9" stroke-linecap="round"/>
    <path id="c11-l2" d="M${P[1]} L${P[2]}" fill="none" stroke="${C.tinta}" stroke-width="9" stroke-linecap="round"/>
    ${P.map((p, i) => `<g id="c11-p${i}"><circle cx="${p[0]}" cy="${p[1]}" r="17" fill="${col[i]}" stroke="#FFFDF8" stroke-width="5"/>
      <text x="${p[0]}" y="${p[1] - 30}" text-anchor="middle" font-family="Cap" font-weight="800" font-size="42" fill="${i === 2 ? C.azul : "#8A6316"}">${es(V[i])} %</text></g>`).join("")}
    ${["2007", "2016", "Hoy"].map((a, i) => `<text x="${X[i]}" y="310" text-anchor="middle" font-family="Cap" font-weight="800" font-size="38" fill="${C.tinta}">${a}</text>`).join("")}
  </svg>`;
}

export function escenas(D) {
  const es = (v, d = 2) => v.toFixed(d).replace(".", ",");
  return [
    // 1 · «¿Hoy trabaja en España más gente que antes de la crisis… o menos? Piénsalo, que tiene truco.»
    { n: 1, set: "calle",
      svg: `${gente("s1", 4)}${persona("s1-marta", "hoy", { ...MARTA, mano: TAZA })}`,
      tarjeta: tarjeta(1, "La pregunta", `<div class="tit">¿Trabaja <mark id="m1a">más</mark> gente o <mark id="m1b">menos</mark> que antes de la crisis?</div>`),
      fn: function (t, e) {
        gentio("s1", 4, t);
        const k = suave((t - e.t0 - 0.2) / 2.0);       // sale del portal y se acerca
        persona("s1-marta", t, { x: 255 + 265 * k, y: 1290 + 120 * k, s: 0.5 + 0.45 * k, anda: [[0, true], [e.t0 + 2.2, false]],
          mira: [[0, 1], [e.t0 + 2.2, 0]], ojos: [[0, "normal"], [e.c["c1-truco"], "grandes"]], boca: [[0, "sonrisa"], [e.c["c1-truco"], "o"]],
          brazo: [[0, "abajo"]], incl: [[e.c["c1-truco"], 5]], fase: 1 });
        marca("m1a", t, e.c["c1-mas"]); marca("m1b", t, e.c["c1-menos"]);
      } },

    // 2 · «2007, justo antes de la crisis: 20,75 millones de personas trabajando.»
    { n: 2, set: "calle",
      svg: `${gente("s2", D.n07)}${persona("s2-marta", "antes", MARTA)}`,
      tarjeta: tarjeta(2, "2007 · 3.er trimestre", `<div class="fila"><div class="num t-pasado" id="c2-num" style="min-width:440px"></div><div class="uni">millones<small>de personas trabajando</small></div></div>`,
        { tono: "pasado", fuente: FUENTE }),
      fn: function (t, e) {
        gentio("s2", D.n07, t, { op: (i) => clamp((t - e.b - i * 0.12) / 0.3) });   // la calle se va llenando
        persona("s2-marta", t, { x: 760, y: 1410, s: 0.9, mira: [[0, -1], [e.c["c2-dato"], 0]], ojos: [[0, "normal"], [e.c["c2-dato"], "felices"]],
          boca: [[0, "sonrisa"], [e.c["c2-dato"], "grande"]], fase: 2 });
        const cc = e.c["c2-cuenta"], cd = e.c["c2-dato"];
        txt("c2-num", t < cc ? "" : es(D.o07 * suave((t - cc) / (cd - cc)), 2));
      } },

    // 3 · «En 2016, 18,53 millones.»
    { n: 3, set: "calle",
      svg: `${gente("s3", D.n07)}${persona("s3-marta", "antes", MARTA)}`,
      tarjeta: tarjeta(3, "2016 · 3.er trimestre", `<div class="fila"><div class="num t-pasado" id="c3-num" style="min-width:440px"></div><div class="uni">millones<small>de personas trabajando</small></div></div>`,
        { tono: "pasado", fuente: FUENTE }),
      fn: function (t, e) {
        const cc = e.c["c3-cuenta"], cd = e.c["c3-dato"];
        gentio("s3", D.n07, t, { op: (i) => (i >= D.n16 ? 1 - clamp((t - cc) / 0.6) : 1) });   // alguien deja de pasar
        persona("s3-marta", t, { x: 760, y: 1410, s: 0.9, mira: [[0, 0], [cc, -1]], ojos: "normal", boca: [[0, "sonrisa"], [cd, "seria"]], fase: 2 });
        txt("c3-num", es(D.o07 + (D.o16 - D.o07) * suave((t - cc) / (cd - cc)), 2));
      } },

    // 4 · «¿Y hoy? 22,85 millones. Récord de la serie.»
    { n: 4, set: "calle",
      svg: `${gente("s4", D.n26)}${persona("s4-antes", "antes", MARTA)}${persona("s4-hoy", "hoy", MARTA)}`,
      tarjeta: tarjeta(4, "Hoy · 3.er trimestre de 2026", `<div class="fila"><div class="num t-hoy" id="c4-num" style="min-width:440px"></div><div class="uni">millones<small id="c4-rec">récord desde 2002</small></div></div>`,
        { tono: "hoy", fuente: FUENTE }),
      fn: function (t, e) {
        const ch = e.c["c4-hoy"], cc = e.c["c4-cuenta"], cd = e.c["c4-dato"], cr = e.c["c4-record"];
        gentio("s4", D.n26, t, { op: (i) => (i >= D.n16 ? clamp((t - cc) / 0.6) : 1) });   // entra más gente
        const g = clamp((t - ch) / 0.45), sx = Math.max(0.05, Math.abs(Math.cos(g * Math.PI)));   // Marta se da la vuelta y ya es la de hoy
        persona("s4-antes", t, { x: 760, y: 1410, s: 0.9, oculto: g >= 0.5, sx: sx, fase: 2 });
        persona("s4-hoy", t, { x: 760, y: 1410, s: 0.9, oculto: g < 0.5, sx: sx, ojos: [[0, "normal"], [cr, "grandes"]], boca: [[0, "sonrisa"], [cr, "o"]],
          brazo: [[0, "abajo"], [cr, "arriba"]], fase: 1 });
        txt("c4-num", es(D.o16 + (D.o26 - D.o16) * suave((t - cc) / (cd - cc)), 2));
        sube("c4-rec", t, cr - 0.1);
      } },

    // 5 · «Ojo, que también somos más: 4,8 millones más de personas de 16 años o más.»
    { n: 5, set: "calle",
      svg: `${gente("s5", D.n26)}${paseante("s5-x0", "#A9A39A", PIELES[1], 1.1)}${paseante("s5-x1", "#B7A88F", PIELES[3], 1.1)}${persona("s5-marta", "hoy", MARTA)}`,
      tarjeta: tarjeta(5, "Desde 2007", `<div class="fila"><div class="num t-hoy">+${es(D.pob, 1)}</div><div class="uni">millones de personas más<small>de 16 años o más</small></div></div>`,
        { fuente: FUENTE_C }),
      fn: function (t, e) {
        gentio("s5", D.n26, t);
        const cd = e.c["c5-dato"];
        [[-30, 1350], [1110, 1350]].forEach(function (p, i) {   // dos personas más, de pie, una a cada lado
          if (t < cd + i * 0.2) { ver("s5-x" + i, false); return; }
          andar("s5-x" + i, t, { x0: p[0], v: 0, hasta: p[0], dir: i ? -1 : 1, y: p[1], s: 1.1 * (0.4 + 0.6 * rebote((t - cd - i * 0.2) / 0.35)) });
        });
        persona("s5-marta", t, { x: 540, y: 1410, s: 0.9, mira: [[0, 0], [e.c["c5-zoom"], -1], [cd + 0.5, 1], [cd + 1.3, 0]], ojos: "normal",
          boca: [[0, "sonrisa"], [e.c["c5-ojo"], "seria"]], fase: 1 });
      },
      cam: function (t, e) { return { z: 1 - 0.18 * suave((t - e.c["c5-zoom"]) / 0.8) }; } },

    // 6 · «Así que, en proporción: imagina 100 personas de 16 a 64 años.»
    { n: 6, set: "vacio", svg: "",
      tarjeta: tarjeta(6, "De cada 100", `<div class="tit">Imagina <mark id="m6">100 personas</mark></div><div class="sub">de 16 a 64 años</div>`),
      fn: function (t, e) {
        ver("rejilla", true);
        const c0 = e.c["c6-cien"];
        for (let i = 0; i < 100; i++) {   // aparecen de fila en fila
          const k = (t - c0 - i * 0.011) / 0.25, el = $("rj" + i);
          pinta("rj" + i, D.c.gris);
          el.style.opacity = clamp(k * 3);
          el.setAttribute("transform", "translate(" + (162 + (i % 10) * 84) + " " + (744 + Math.floor(i / 10) * 72) + ") scale(" + (0.6 * (0.4 + 0.6 * rebote(k))).toFixed(3) + ")");
        }
        $("rj-aro").style.opacity = clamp((t - c0 - 1.0) / 0.3);
        ver("rj-brazo", false); ver("rj-pregunta", false);
        for (let k = 0; k < 10; k++) ver("rj-l" + k, false);
        marca("m6", t, c0);
      } },

    // 7 · «En 2007 trabajaban 67. En 2016, 61.»
    { n: 7, set: "vacio", svg: "",
      tarjeta: tarjeta(7, "Trabajan, de cada 100", `<div class="vs"><div class="col" id="c7-a"><div class="v t-pasado">${D.e07}</div><div class="n">en 2007</div></div>
        <div class="col" id="c7-b"><div class="v t-pasado">${D.e16}</div><div class="n">en 2016</div></div></div>`, { tono: "pasado", fuente: FUENTE }),
      fn: function (t, e) {
        ver("rejilla", true); ver("rj-brazo", false); ver("rj-pregunta", false);
        for (let k = 0; k < 10; k++) ver("rj-l" + k, false);
        const c67 = e.c["c7-67"], c61 = e.c["c7-61"];
        for (let i = 0; i < 100; i++) {
          const on = t >= c67 + i * 0.009 && i < D.e07 && !(t >= c61 + (D.e07 - 1 - i) * 0.05 && i >= D.e16);
          pinta("rj" + i, on ? D.c.ocre : D.c.gris);
          $("rj" + i).style.opacity = 1;
          $("rj" + i).setAttribute("transform", "translate(" + (162 + (i % 10) * 84) + " " + (744 + Math.floor(i / 10) * 72) + ") scale(0.6)");
        }
        $("rj-aro").style.opacity = 1;
        sube("c7-a", t, c67 + 0.55); sube("c7-b", t, c61);
      } },

    // 8 · «¿Y hoy? 69. Más que antes de la crisis.»
    { n: 8, set: "vacio", svg: "",
      tarjeta: tarjeta(8, "Hoy, de cada 100", `<div class="fila"><div class="num t-hoy" id="c8-num" style="min-width:230px"></div><div class="uni">trabajan<small>en 2007: ${D.e07} · de 16 a 64 años</small></div></div>`,
        { tono: "hoy", fuente: FUENTE }),
      fn: function (t, e) {
        ver("rejilla", true); ver("rj-brazo", false); ver("rj-pregunta", false);
        for (let k = 0; k < 10; k++) ver("rj-l" + k, false);
        const c69 = e.c["c8-69"], cm = e.c["c8-mas"];
        let n = 0;
        for (let i = 0; i < 100; i++) {
          const azul = t >= c69 + i * 0.009 && i < D.e26;
          if (azul) n++;
          pinta("rj" + i, azul ? D.c.azul : i < D.e16 ? D.c.ocre : D.c.gris);
          // los que hoy trabajan y en 2007 no (67 y 68) saltan un poco al decir «Más»
          const salto = i >= D.e07 && i < D.e26 && t > cm ? Math.max(0, Math.sin((t - cm) * 9)) * 16 * Math.exp(-(t - cm) * 2.5) : 0;
          $("rj" + i).style.opacity = 1;
          $("rj" + i).setAttribute("transform", "translate(" + (162 + (i % 10) * 84) + " " + (744 + Math.floor(i / 10) * 72 - salto).toFixed(1) + ") scale(0.6)");
        }
        $("rj-aro").style.opacity = 1;
        txt("c8-num", t < c69 ? "" : String(n));
      } },

    // 9 · «Hasta aquí, todo mejora. Pero… ¿y el paro?»
    { n: 9, set: "vacio", svg: "",
      tarjeta: tarjeta(9, "Hasta aquí, todo mejora", `<div class="tit">¿Y el <mark id="m9">paro</mark>?</div>`),
      fn: function (t, e) {
        ver("rejilla", true);
        for (let k = 0; k < 10; k++) ver("rj-l" + k, false);
        const cm = e.c["c9-mano"], Q = 87;   // una de las figuras grises levanta la mano
        for (let i = 0; i < 100; i++) {
          pinta("rj" + i, i < D.e26 ? D.c.azul : D.c.gris);
          $("rj" + i).style.opacity = t >= e.c["c9-pero"] && i < D.e26 ? 0.45 : 1;
          $("rj" + i).setAttribute("transform", "translate(" + (162 + (i % 10) * 84) + " " + (744 + Math.floor(i / 10) * 72) + ") scale(0.6)");
        }
        $("rj-aro").style.opacity = t >= e.c["c9-pero"] ? 0.45 : 1;
        const k = suave((t - cm) / 0.25), x = 162 + (Q % 10) * 84 + 26, y = 744 + Math.floor(Q / 10) * 72 - 36;
        $("rj" + Q).setAttribute("transform", "translate(" + (162 + (Q % 10) * 84) + " " + (744 + Math.floor(Q / 10) * 72) + ") scale(" + (0.6 * (1 + 0.3 * k)).toFixed(3) + ")");
        T("rj-brazo", x, y, { r: 20 - 30 * k, op: t < cm ? 0 : 1 });
        if (pop("rj-pregunta", t, cm + 0.1, x + 34, y - 70) < 0) ver("rj-pregunta", false);
        marca("m9", t, cm);
      } },

    // 10 · «De cada 100 que trabajan o buscan trabajo, hoy 10 no lo encuentran. En 2007, 8.»
    { n: 10, set: "vacio", svg: "",
      tarjeta: tarjeta(10, "Paro · de cada 100 que trabajan o buscan trabajo", `<div class="fila"><div class="num t-hoy">${es(D.p26, 1)} %</div><div class="uni">no encuentran trabajo<small id="c10-07">en 2007: ${es(D.p07, 1)} %</small></div></div>`, { fuente: FUENTE }),
      fn: function (t, e) {
        ver("rejilla", true); ver("rj-brazo", false); ver("rj-pregunta", false);
        const ca = e.c["c10-activos"], c10 = e.c["c10-10"], c8 = e.c["c10-8"], P = 100 - Math.round(D.p26);
        for (let i = 0; i < 100; i++) {   // una rejilla nueva: quienes trabajan o buscan
          const k = (t - ca - i * 0.008) / 0.2;
          pinta("rj" + i, i < P && k >= 0.5 ? D.c.azul : D.c.gris);
          $("rj" + i).style.opacity = 1;
          $("rj" + i).setAttribute("transform", "translate(" + (162 + (i % 10) * 84) + " " + (744 + Math.floor(i / 10) * 72) + ") scale(" + (0.6 * (0.85 + 0.15 * rebote(k))).toFixed(3) + ")");
        }
        $("rj-aro").style.opacity = 1;
        for (let k = 0; k < 10; k++) {   // una lupa sobre cada una de las 10 que buscan; en 2007 eran 8
          const i = P + k, x = 162 + (i % 10) * 84 + 12, y = 744 + Math.floor(i / 10) * 72 - 44;
          if (pop("rj-l" + k, t, c10 + k * 0.06, x, y, { s: 1 }) >= 0) $("rj-l" + k).style.opacity = k >= Math.round(D.p07) && t >= c8 ? 0.2 : 1;
        }
        sube("c10-07", t, c8 - 0.1);
      } },

    // 11 · «En 2016 eran 19. Ha bajado mucho… pero no ha vuelto a 2007.»
    { n: 11, set: "liso",
      svg: persona("s11-marta", "hoy", MARTA),
      tarjeta: tarjeta(11, "Paro · 3.er trimestre", graficoParo(D), { fuente: FUENTE }),
      fn: function (t, e) {
        const cs = e.c["c11-sube"], cb = e.c["c11-baja"], cr = e.c["c11-ref"];
        const traza = (id, t0, d) => { const el = $(id), L = el.getTotalLength(); el.style.strokeDasharray = L; el.style.strokeDashoffset = (L * (1 - suave((t - t0) / d))).toFixed(1); };
        traza("c11-l1", cs, 0.6); traza("c11-l2", cb, 0.7);
        $("c11-p0").style.opacity = 1; $("c11-p1").style.opacity = clamp((t - cs - 0.5) * 5); $("c11-p2").style.opacity = clamp((t - cb - 0.6) * 5);
        $("c11-ref").style.opacity = clamp((t - cr) * 4);
        persona("s11-marta", t, { x: 540, y: 1410, s: 0.95, brazo: [[0, "senala"], [cr, "hombros"]], ojos: [[0, "normal"], [cs + 0.4, "grandes"], [cb, "normal"]],
          boca: [[0, "sonrisa"], [cs + 0.4, "o"], [cb, "sonrisa"], [cr, "seria"]], incl: [[cr, 6]], fase: 1 });
      } },

    // 12 · «Entonces, ¿mejora, empeora o depende? Frente a 2016, mejora. Frente a 2007… depende.»
    { n: 12, set: "calle",
      svg: `${gente("s12", 4)}${persona("s12-marta", "hoy", MARTA)}`,
      tarjeta: tarjeta(12, "El veredicto", `<div class="tit" style="font-size:56px">¿<mark id="m12a">Mejora</mark>, <mark id="m12b">empeora</mark> o <mark id="m12c">depende</mark>?</div>
        <div class="ops"><div class="op" id="c12-o0"><i></i><span class="lab">Frente a 2016</span><b>Mejora</b></div>
        <div class="op" id="c12-o1"><i></i><span class="lab">Frente a 2007</span><b>Depende</b></div></div>`),
      fn: function (t, e) {
        const c = e.c, cs = c["c12-sello"];
        gentio("s12", 4, t);
        marca("m12a", t, c["c12-m"]); marca("m12b", t, c["c12-e"]); marca("m12c", t, c["c12-d"]);
        sube("c12-o0", t, c["c12-16"]); sube("c12-o1", t, c["c12-07"]);
        $("c12-o0").className = "op" + (t >= c["c12-mejora"] ? " si" : "");
        $("c12-o1").className = "op" + (t >= cs ? " si" : "");
        persona("s12-marta", t, { x: 540, y: 1410, s: 0.95, brazo: [[0, "abajo"], [c["c12-mejora"], "arriba"], [cs, "hombros"]],
          ojos: [[0, "normal"], [c["c12-mejora"], "felices"], [cs, "normal"]], boca: [[0, "seria"], [c["c12-mejora"], "grande"], [cs, "seria"]], incl: [[cs, 6]], fase: 1 });
      },
      cam: function (t, e) { const k = t - e.c["c12-sello"], g = k >= 0 && k < 0.22; return { dx: g ? azar(3, Math.floor(t * 30)) * 9 : 0, dy: g ? azar(4, Math.floor(t * 30)) * 9 : 0 }; } },

    // 13 · «Más gente trabajando que nunca. Y más paro que en 2007. Las dos cosas son verdad.»
    { n: 13, set: "liso",
      svg: `${Array.from({ length: 8 }, (_, i) => figura("s13-a" + i, 110 + (i % 4) * 78, 1250 + Math.floor(i / 4) * 110, 0.62, C.azul)).join("")}
        ${[0, 1].map((i) => figura("s13-b" + i, 830 + i * 110, 1300, 0.62, "#C9CED3") + lupa("s13-l" + i, 0.9)).join("")}
        ${persona("s13-marta", "hoy", MARTA)}`,
      tarjeta: tarjeta(13, "En resumen", `<div class="tit">Más gente trabajando que <mark id="m13a">nunca</mark>.<br>Más paro que en <mark id="m13b">2007</mark>.</div>`),
      fn: function (t, e) {
        const ca = e.c["c13-trab"], cb = e.c["c13-paro"], cv = e.c["c13-verdad"];
        for (let i = 0; i < 8; i++) pop("s13-a" + i, t, ca + i * 0.05, 110 + (i % 4) * 78, 1250 + Math.floor(i / 4) * 110, { s: 0.62 });
        for (let i = 0; i < 2; i++) { pop("s13-b" + i, t, cb + i * 0.08, 830 + i * 110, 1300, { s: 0.62 }); pop("s13-l" + i, t, cb + 0.2 + i * 0.08, 852 + i * 110, 1180); }
        persona("s13-marta", t, { x: 540, y: 1410, s: 0.85, mira: [[0, 0], [ca, -1], [cb, 1], [cv, 0]], brazo: [[0, "abajo"], [cv, "hombros"]],
          ojos: [[0, "normal"], [cv, "felices"]], boca: [[0, "sonrisa"], [cv, "grande"]], fase: 1 });
        marca("m13a", t, ca + 0.4); marca("m13b", t, cb + 0.4);
      } },

    // 14 · «¿Y tú? ¿Lo notas a tu alrededor… o no tanto? Te leo.»
    { n: 14, set: "calle",
      svg: `${gente("s14", 4)}${persona("s14-marta", "hoy", { ...MARTA, mano: TAZA })}${bocadillo("s14-boc")}`,
      tarjeta: tarjeta(14, "Te toca", `<div class="tit">¿Lo notas a tu <mark id="m14">alrededor</mark>?</div><div class="sub" id="c14-sub">Te leo en los comentarios.</div>`),
      fn: function (t, e) {
        const cb = e.c["c14-boc"];
        gentio("s14", 4, t);
        persona("s14-marta", t, { x: 400, y: 1410, s: 0.95, brazo: [[0, "abajo"]], ojos: [[0, "normal"], [cb, "felices"]], boca: [[0, "sonrisa"], [cb, "grande"]],
          incl: [[e.b + 1.2, -5], [cb, 0]], fase: 1 });
        marca("m14", t, e.b + 1.0); sube("c14-sub", t, cb - 0.2);
        if (pop("s14-boc", t, cb, 760, 820) >= 0) for (let i = 0; i < 3; i++) attr("s14-boc-p" + i, "cy", (-6 - 16 * Math.max(0, Math.sin((t - cb) * 8 - i * 0.9))).toFixed(1));
      } },
  ];
}
