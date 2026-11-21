// Escenas de T1 (guion v5) en estilo «limpio»: una idea por escena, una tarjeta por dato.
// Cada escena: decorado (set), dibujo (svg), tarjeta (HTML) y acción (fn, se ejecuta en la página
// con las utilidades de diseno/limpio_runtime.js). Los momentos e.c[...] salen de historia.json.
/* eslint-disable no-undef */

import { C, persona, peon, producto, carro, monedaEuro, reloj, nomina, bocadillo, tarjeta } from "../../diseno/limpio.mjs";

export const ESTILO = "limpio";
const FUENTE = "Cálculo propio con datos del INE y de Eurostat";

export function datos(t1) {
  const f = (a) => t1.filas.find((x) => x.anyo === a);
  const es = (v, d = 1) => v.toFixed(d).replace(".", ",");
  const sueldo = 100 * (f(2024).salario_neto_hora_mediana / f(2016).salario_neto_hora_mediana - 1);
  const compra = 100 * (f(2024).cesta_euros_mes / f(2016).cesta_euros_mes - 1);
  return {
    h2016n: f(2016).horas_neto_mediana, h2019n: f(2019).horas_neto_mediana, h2024n: f(2024).horas_neto_mediana,
    h2016: es(f(2016).horas_neto_mediana), h2019: es(f(2019).horas_neto_mediana), h2024: es(f(2024).horas_neto_mediana),
    sueldon: sueldo, compran: compra, sueldo: es(sueldo, 0), compra: es(compra, 0),
    dif: es(f(2024).horas_neto_mediana - f(2016).horas_neto_mediana),
    c: { ocre: C.ocre, azul: C.azul, ocreTxt: "#8A6316" },
  };
}

const jornadas = (id, tono, texto) => `<div class="jor" id="${id}"><div class="jb"><b class="t-${tono}" id="${id}0"></b></div><div class="jb"><b class="t-${tono}" id="${id}1"></b></div><span>${texto}</span></div>`;

export function escenas(D) {
  const ALT = [70, 120, 170, 230, 300, 390, 500];   // fila de sueldos, de menos a más
  return [
    // 1 · «A ver, pregunta rápida. Llenar el carro de la compra… ¿te cuesta hoy más, o menos, que hace diez años?»
    { n: 1, set: "super",
      svg: `${persona("s1-dani", "hoy")}${carro("s1-carro")}`,
      tarjeta: tarjeta(1, "La pregunta", `<div class="tit">¿Llenar el carro cuesta <mark id="m1a">más</mark> o <mark id="m1b">menos</mark> que hace 10 años?</div>`),
      fn: function (t, e) {
        const fin = e.c["c1-para"], x = ir(t, e.t0, fin - e.t0, 160, 650);
        T("s1-carro", x, 1410, { s: 1.12 });
        persona("s1-dani", t, { x: x - 420, y: 1410, anda: [[0, true], [fin, false]], brazo: [[0, "empuja"], [fin + 0.6, "hombros"]],
          ojos: [[0, "normal"], [fin + 0.6, "grandes"]], boca: [[0, "sonrisa"], [fin + 0.6, "seria"]], mira: [[0, 1], [fin + 0.2, 0]], fase: 1 });
        marca("m1a", t, e.c["c1-mas"]); marca("m1b", t, e.c["c1-menos"]);
      } },

    // 2 · «Y ojo, que no te lo cuento en euros. Te lo cuento en horas de tu trabajo.»
    { n: 2, set: "liso",
      svg: `${monedaEuro("s2-euro", 210)}${reloj("s2-reloj", 210)}`,
      tarjeta: tarjeta(2, "La regla", `<div class="tit">No en euros.<br>En <mark id="m2">horas de trabajo</mark>.</div>`),
      fn: function (t, e) {
        const cn = e.c["c2-no"], cg = e.c["c2-giro"], k = t - e.t0;
        const y = 380 + 640 * fuera(k / 0.45) - Math.max(0, Math.sin((k - 0.45) * 9)) * 40 * Math.exp(-Math.max(0, k - 0.45) * 4);
        const g = clamp((t - cg) / 0.42), cara = g < 0.5;
        const no = t >= cn && t < cn + 0.7 ? Math.sin((t - cn) * 18) * 11 * (1 - (t - cn) / 0.7) : 0;   // la moneda dice que no
        ver("s2-euro", cara); ver("s2-reloj", !cara);
        T(cara ? "s2-euro" : "s2-reloj", 540, y, { sx: Math.max(0.04, Math.abs(Math.cos(g * Math.PI))), sy: 1, r: no });
        attr("s2-reloj-m", "transform", "rotate(" + (Math.max(0, t - cg) * 70).toFixed(1) + ")");
        marca("m2", t, cg + 0.25);
      } },

    // 3 · «Este es Dani. Cobra un sueldo normal, de los del medio.»
    { n: 3, set: "liso",
      svg: `${ALT.map((h, i) => `<g id="s3-b${i}"><rect x="-52" y="${-h}" width="104" height="${h}" rx="14" fill="${i === 3 ? C.ocre : "#DCE1E5"}"/></g>`).join("")}
        ${ALT.map((h, i) => (i === 3 ? "" : peon("s3-p" + i, 120 + i * 140, 1410 - h))).join("")}${persona("s3-dani", "antes")}`,
      tarjeta: tarjeta(3, "El protagonista", `<div class="tit">Dani cobra el <mark id="m3">sueldo mediano</mark></div>
        <div class="sub" id="c3-sub">La mitad cobra más que él. La otra mitad, menos.</div>`),
      fn: function (t, e) {
        const H = [70, 120, 170, 230, 300, 390, 500], cm = e.c["c3-medio"], cd = e.c["c3-dani"];
        for (let i = 0; i < 7; i++) {
          const k = fuera((t - e.c["c3-fila"] - i * 0.07) / 0.45), x = 120 + i * 140;
          attr("s3-b" + i, "transform", "translate(" + x + " 1410) scale(1 " + Math.max(0.001, k).toFixed(3) + ")");
          if (i !== 3) { const p = $("s3-p" + i); p.setAttribute("transform", "translate(" + x + " " + (1410 - H[i] * k).toFixed(1) + ")"); p.style.opacity = t >= cm ? 0.5 : 1; }
          if (i !== 3) $("s3-b" + i).style.opacity = t >= cm ? 0.6 : 1;
        }
        persona("s3-dani", t, { x: 540, y: 1410 - 230, s: 0.37 * (0.3 + 0.7 * rebote((t - cd) / 0.35)), oculto: t < cd,
          brazo: [[cd + 0.25, "saluda"], [cd + 1.7, "abajo"]], ojos: "felices", boca: "grande", fase: 2 });
        marca("m3", t, cm); sube("c3-sub", t, cm + 0.3);
      } },

    // 4 · «En 2016, la compra del mes le costaba 12,8 horas de trabajo. Día y medio largo, para entendernos.»
    { n: 4, set: "super",
      svg: `${carro("s4-carro", false)}${persona("s4-dani", "antes")}${["pan", "leche", "huevos", "aceite"].map((p, i) => producto(p, "s4-i" + i)).join("")}`,
      tarjeta: tarjeta(4, "2016", `<div class="fila"><div class="num t-pasado" id="c4-num"></div><div class="uni">horas de trabajo<small>la compra de un mes</small></div></div>
        ${jornadas("c4-j", "pasado", "día y medio largo")}`, { tono: "pasado", fuente: FUENTE }),
      fn: function (t, e) {
        const cc = e.c["c4-cuenta"], cd = e.c["c4-dato"], cj = e.c["c4-dia"], k = suave((t - cc) / (cd - cc));
        T("s4-carro", 300, 1410, { s: 1.1 });
        persona("s4-dani", t, { x: 520, y: 1410, brazo: [[0, "abajo"], [cd + 0.25, "senala"], [cj + 1.2, "abajo"]], mira: [[0, 1], [cj, 0]],
          ojos: [[0, "normal"], [cd, "felices"], [cj, "normal"]], boca: [[0, "sonrisa"], [cd, "grande"], [cj, "sonrisa"]], fase: 2 });
        for (let i = 0; i < 4; i++) salto("s4-i" + i, t, e.c["c4-p" + i], 300, 1170, 742 + i * 56, 1016, { s: 0.6, r: -40 });
        txt("caja-num", t < cc ? "" : es(D.h2016n * k));
        txt("c4-num", t < cc ? "?" : es(D.h2016n * k));
        sube("c4-j", t, cj - 0.1);
        crece("c4-j0", "width", t, cj, 0.4, 150); crece("c4-j1", "width", t, cj + 0.4, 0.35, 150 * (D.h2016n / 8 - 1));
      },
      cam: function () { return { z: 1.12, fx: 640, fy: 1160 }; } },

    // 5 · «Ahora, avance rápido. Mismo Dani, misma compra, último dato oficial.»
    { n: 5, set: "super",
      svg: `${persona("s5-antes", "antes")}${persona("s5-hoy", "hoy")}${carro("s5-carro")}`,
      tarjeta: tarjeta(5, "Avance rápido", `<div class="tit"><span id="c5-anyo">2016</span><br><mark id="m5">último dato oficial</mark></div>
        <div class="sub" id="c5-sub">Mismo Dani. Misma compra.</div>`),
      fn: function (t, e) {
        const cf = e.c["c5-ff"], cd = e.c["c5-dani"], A = [2016, 2017, 2018, 2019, 2021, 2022, 2023, 2024];
        const ka = clamp((t - cf - 0.15) / 0.95);
        txt("c5-anyo", String(A[Math.round(ka * (A.length - 1))]));
        css("c5-anyo", "color", ka >= 1 ? D.c.azul : D.c.ocreTxt);
        T("s5-carro", 690, 1410, { s: 1.12 });
        const g = clamp((t - cd) / 0.45), sx = Math.max(0.05, Math.abs(Math.cos(g * Math.PI)));   // Dani se da la vuelta y ya es el de hoy
        persona("s5-antes", t, { x: 300, y: 1410, oculto: g >= 0.5, sx: sx, fase: 2 });
        persona("s5-hoy", t, { x: 300, y: 1410, oculto: g < 0.5, sx: sx, brazo: [[cd + 0.5, "saluda"], [cd + 1.7, "abajo"]], ojos: "felices", boca: "grande", fase: 1 });
        sube("c5-sub", t, cd); marca("m5", t, e.c["c5-dato"]);
      } },

    // 6 · «¿Cuánto? 14,5 horas. Casi dos días.»
    { n: 6, set: "super",
      svg: `${carro("s6-carro", false)}${persona("s6-dani", "hoy")}${["pan", "leche", "huevos", "aceite"].map((p, i) => producto(p, "s6-i" + i)).join("")}`,
      tarjeta: tarjeta(6, "2024 · último dato", `<div class="fila"><div class="num t-hoy" id="c6-num"></div><div class="uni">horas de trabajo<small>en 2016 eran ${D.h2016} h</small></div></div>
        ${jornadas("c6-j", "hoy", "casi dos jornadas")}`, { tono: "hoy", fuente: FUENTE }),
      fn: function (t, e) {
        const cc = e.c["c6-cuenta"], cd = e.c["c6-dato"], cj = e.c["c6-dias"], k = suave((t - cc) / (cd - cc));
        T("s6-carro", 300, 1410, { s: 1.1 });
        persona("s6-dani", t, { x: 520, y: 1410, brazo: [[0, "abajo"], [cd, "arriba"], [cj + 0.8, "hombros"]], mira: [[0, 1], [cd + 0.7, 0]],
          ojos: [[0, "normal"], [cc + 0.4, "grandes"]], boca: [[0, "sonrisa"], [cc + 0.4, "seria"], [cd, "o"]], fase: 1 });
        for (let i = 0; i < 4; i++) T("s6-i" + i, 742 + i * 56, 1016, { s: 0.6 });
        const v = D.h2016n + (D.h2024n - D.h2016n) * k;
        txt("caja-num", es(v)); txt("c6-num", t < cc ? "?" : es(v));
        sube("c6-j", t, cj - 0.1);
        crece("c6-j0", "width", t, cj, 0.4, 150); crece("c6-j1", "width", t, cj + 0.4, 0.4, 150 * (D.h2024n / 8 - 1));
      },
      cam: function (t, e) { return { z: 1.12 + 0.05 * suave((t - e.c["c6-dato"]) / 0.3), fx: 640, fy: 1160 }; } },

    // 7 · «Y eso que Dani ahora cobra más, ¿eh? Un 23 % más por hora, ya limpio.»
    { n: 7, set: "super",
      svg: `${persona("s7-dani", "hoy")}${nomina("s7-nomina")}`,
      tarjeta: tarjeta(7, "Su sueldo", `<div class="fila"><div class="num t-hoy" id="c7-num" style="min-width:400px"></div><div class="uni">más por hora<small>neto · sueldo mediano · 2016 → 2024</small></div></div>`, { fuente: FUENTE }),
      fn: function (t, e) {
        const cn = e.c["c7-nomina"], cs = e.c["c7-sube"], cd = e.c["c7-dato"];
        persona("s7-dani", t, { x: 440, y: 1410, brazo: [[cn, "piensa"]], ojos: [[0, "normal"], [cn + 0.2, "felices"]], boca: [[0, "sonrisa"], [cn + 0.2, "grande"]], fase: 1 });
        pop("s7-nomina", t, cn + 0.25, 612, 880, { r: 8 });
        txt("c7-num", t < cs ? "" : "+" + Math.round(D.sueldon * suave((t - cs) / (cd - cs))) + " %");
      } },

    // 8 · «¿El problema? Que la misma compra ha subido un 40.»
    { n: 8, set: "super",
      svg: `${persona("s8-dani", "hoy")}${carro("s8-carro")}<g id="s8-etq"><path d="M-74 -52 H46 L92 0 L46 52 H-74 Z" fill="${C.marcador}"/><circle cx="54" cy="0" r="10" fill="#fff"/>
        <text x="-18" y="26" text-anchor="middle" class="rot" font-size="70" fill="${C.tinta}">€</text></g>`,
      tarjeta: tarjeta(8, "Desde 2016", `<div class="vs"><div class="col"><div class="v" style="color:${C.azulClaro}">+${D.sueldo} %</div><div class="barra" id="c8-b1" style="background:${C.azulClaro}"></div><div class="n">Sueldo por hora</div></div>
        <div class="contra">vs</div><div class="col"><div class="v t-hoy" id="c8-v2"></div><div class="barra" id="c8-b2" style="background:${C.azul}"></div><div class="n">La misma compra</div></div></div>`, { fuente: FUENTE }),
      fn: function (t, e) {
        const cs = e.c["c8-sube"], cd = e.c["c8-dato"], k = suave((t - cs) / (cd - cs));
        persona("s8-dani", t, { x: 300, y: 1410, mira: 1, ojos: [[0, "normal"], [cs, "grandes"]], boca: [[0, "seria"], [cd, "o"]], brazo: [[cd, "arriba"]], incl: [[cs, -6]], fase: 1 });
        T("s8-carro", 700, 1410, { s: 1.12 });
        T("s8-etq", 716, 990 - 40 * k, { s: 1 + (D.compran / 100) * k, r: -10 + Math.sin(t * 2.4) * 3 });   // la etiqueta del precio crece un 40 %
        css("c8-b1", "height", (D.sueldon * 4.2).toFixed(0) + "px"); css("c8-b2", "height", (D.compran * 4.2 * k).toFixed(0) + "px");
        txt("c8-v2", t < cs ? "" : "+" + Math.round(D.compran * k) + " %");
      } },

    // 9 · «¿Y fue poco a poco? Qué va. En 2019 le costaba 12,6. El salto vino después.»
    { n: 9, set: "super",
      svg: `${persona("s9-dani", "hoy")}${carro("s9-carro")}`,
      tarjeta: tarjeta(9, "Año a año", `<div class="b3"><div class="ref" id="c9-ref"></div>
        ${[0, 1, 2].map((i) => `<div class="col"><div class="v ${i < 2 ? "t-pasado" : "t-hoy"}" id="c9-v${i}"></div><div class="barra" id="c9-b${i}" style="background:${i < 2 ? C.ocre : C.azul}"></div></div>`).join("")}</div>
        <div class="b3a"><div>2016</div><div>2019</div><div>2024</div></div>`, { fuente: FUENTE }),
      fn: function (t, e) {
        const c = e.c, px = 160 / D.h2024n;
        persona("s9-dani", t, { x: 330, y: 1410, brazo: [[c["c9-b19"], "piensa"], [c["c9-b24"], "arriba"]], ojos: [[0, "normal"], [c["c9-b24"] + 0.2, "grandes"]],
          boca: [[0, "sonrisa"], [c["c9-b24"] + 0.2, "o"]], fase: 1 });
        T("s9-carro", 720, 1410, { s: 1.12 });
        const b = (i, t0, d, h, val) => { const k = suave((t - t0) / d); css("c9-b" + i, "height", (h * px * k).toFixed(0) + "px"); txt("c9-v" + i, k >= 1 ? val : ""); };
        b(0, c["c9-b16"], 0.4, D.h2016n, D.h2016 + " h");
        b(1, c["c9-b19"], Math.max(0.3, c["c9-d19"] - c["c9-b19"]), D.h2019n, D.h2019 + " h");
        b(2, c["c9-b24"], Math.max(0.45, c["c9-d24"] - c["c9-b24"]), D.h2024n, D.h2024 + " h");
        css("c9-ref", "bottom", (D.h2016n * px).toFixed(0) + "px"); css("c9-ref", "opacity", clamp((t - c["c9-b16"] - 0.4) * 4));
      } },

    // 10 · «Entonces, ¿mejora, empeora o depende? Esta vez, empeora.»
    { n: 10, set: "super",
      svg: `${persona("s10-dani", "hoy")}${carro("s10-carro")}`,
      tarjeta: tarjeta(10, "El veredicto", `<div class="ops">${["Mejora", "Empeora", "Depende"].map((p, i) => `<div class="op" id="c10-o${i}"><i></i>${p}</div>`).join("")}</div>`),
      fn: function (t, e) {
        const c = e.c, cs = c["c10-sello"];
        ["c10-m", "c10-e", "c10-d"].forEach(function (q, i) { sube("c10-o" + i, t, c[q]); $("c10-o" + i).className = "op" + (t >= cs ? (i === 1 ? " si" : " no") : ""); });
        persona("s10-dani", t, { x: 330, y: 1410, brazo: [[0, "hombros"], [cs, "abajo"]], ojos: [[0, "grandes"], [cs, "normal"]], boca: "seria", incl: [[0, 6], [cs, 0]], fase: 1 });
        T("s10-carro", 720, 1410, { s: 1.12 });
      },
      cam: function (t, e) { const k = t - e.c["c10-sello"], g = k >= 0 && k < 0.22; return { dx: g ? azar(3, Math.floor(t * 30)) * 9 : 0, dy: g ? azar(4, Math.floor(t * 30)) * 9 : 0 }; } },

    // 11 · «Casi dos horas más de trabajo cada mes… para llevarte lo mismo.»
    { n: 11, set: "super",
      svg: `${persona("s11-dani", "hoy")}${carro("s11-carro")}${reloj("s11-r0", 78, C.azul)}${reloj("s11-r1", 78, C.azul)}`,
      tarjeta: tarjeta(11, "Empeora", `<div class="fila" id="c11-fila"><div class="num t-hoy">+${D.dif}</div><div class="uni">horas de trabajo<small>más cada mes, por la misma compra</small></div></div>
        <div class="nota" id="c11-nota">Sale igual con 2016, 2018 o 2019 de referencia, y con el sueldo medio o el mediano, bruto o neto.</div>`, { fuente: FUENTE }),
      fn: function (t, e) {
        const cd = e.c["c11-dato"];
        sube("c11-fila", t, cd - 0.2); sube("c11-nota", t, cd + 0.9);
        persona("s11-dani", t, { x: 300, y: 1410, mira: 1, brazo: [[cd, "senala"]], boca: "seria", fase: 1 });
        T("s11-carro", 700, 1410, { s: 1.12 });
        pop("s11-r0", t, e.c["c11-r1"], 640, 960); pop("s11-r1", t, e.c["c11-r2"], 810, 985, { s: 0.7 });   // una hora entera y casi otra
      } },

    // 12 · «El sueldo sube por la escalera. La compra, en ascensor.»
    { n: 12, set: "liso",
      svg: `${[0, 1, 2, 3, 4].map((i) => `<rect x="${110 + i * 80}" y="${1410 - (i + 1) * 46}" width="${400 - i * 80}" height="46" fill="${i % 2 ? "#D9BC8F" : "#CFAE7C"}"/>`).join("")}
        <rect x="640" y="900" width="280" height="510" rx="18" fill="#E3E8EB" stroke="#B4BEC5" stroke-width="6"/><path d="M780 900 V1180" stroke="#B4BEC5" stroke-width="6"/>
        <g id="s12-cabina"><rect x="-122" y="-232" width="244" height="232" rx="14" fill="${C.blanco}" stroke="#9AA6AE" stroke-width="6"/><g transform="translate(6 -10) scale(.6)">${carro("s12-carro").replace(/<ellipse[^>]*opacity="\.16"\/>/, "")}</g></g>
        ${persona("s12-dani", "hoy")}`,
      tarjeta: tarjeta(12, "En resumen", `<div class="tit">El sueldo, por la <mark id="m12a">escalera</mark>.<br>La compra, en <mark id="m12b">ascensor</mark>.</div>`),
      fn: function (t, e) {
        const c1 = e.c["c12-esc"], c2 = e.c["c12-esc2"], ca = e.c["c12-asc"], P = [c1, (c1 + c2) / 2, c2];
        let x = 70, y = 1410, bote = 0;                      // Dani sube tres peldaños, uno a uno
        P.forEach(function (tp, i) { const k = clamp((t - tp) / 0.32); if (k > 0) { const x0 = i === 0 ? 70 : 150 + (i - 1) * 80; x = x0 + (150 + i * 80 - x0) * suave(k); y = 1410 - i * 46 - 46 * suave(k); bote = Math.sin(k * Math.PI) * 30; } });
        persona("s12-dani", t, { x: x, y: y, s: 0.42, sube: bote / 0.42, mira: 1, brazo: [[ca + 0.3, "arriba"]], ojos: [[0, "normal"], [ca + 0.25, "grandes"]], boca: [[0, "sonrisa"], [ca + 0.25, "o"]], fase: 1 });
        T("s12-cabina", 780, 1410 - 240 * suave((t - ca) / 0.7));   // el carro sube 40 por cada 23 de Dani
        marca("m12a", t, c2 - 0.15); marca("m12b", t, e.c["c12-fin"] - 0.25);
      } },

    // 13 · «¿Y tú? ¿Lo notas en tu carro… o soy yo, que me fijo mucho? Te leo.»
    { n: 13, set: "super",
      svg: `${persona("s13-dani", "hoy")}${carro("s13-carro")}${bocadillo("s13-boc")}`,
      tarjeta: tarjeta(13, "Te toca", `<div class="tit">¿Lo notas en <mark id="m13">tu carro</mark>?</div><div class="sub" id="c13-sub">Te leo en los comentarios.</div>`),
      fn: function (t, e) {
        const cb = e.c["c13-boc"];
        persona("s13-dani", t, { x: 320, y: 1410, brazo: [[e.t0 + 0.2, "saluda"], [e.t0 + 2.2, "hombros"], [cb, "senala"]], ojos: [[0, "normal"], [cb, "felices"]], boca: [[0, "sonrisa"], [cb, "grande"]], fase: 1 });
        T("s13-carro", 710, 1410, { s: 1.12 });
        marca("m13", t, e.b + 0.9); sube("c13-sub", t, cb - 0.2);
        if (pop("s13-boc", t, cb, 690, 790) >= 0) for (let i = 0; i < 3; i++) attr("s13-boc-p" + i, "cy", (-6 - 16 * Math.max(0, Math.sin((t - cb) * 8 - i * 0.9))).toFixed(1));
      } },
  ];
}
