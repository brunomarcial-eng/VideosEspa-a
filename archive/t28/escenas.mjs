// Escenas de T28 («¿Tener un bebé cuesta hoy más horas de trabajo?») en estilo «limpio». Bruno, 24-11-2026: rescatar
// los temas del principio; el cuarto, lo que cuesta un bebé. Guardería (INE, EPF) y alimentos para bebé (INE, IPC) en
// horas del sueldo neto mediano, e hijos por mujer (INE): 2007, la crisis (2013), 2016, 2019 y 2025.
//   · «hija»: unos 38, embarazada de su primer hijo, melena castaña oscura, vestido verde salvia (voz «medica»).
//   · «padre»: unos 62, canas y bigote, jersey gris; cree que criar hoy es un lujo (voz «padre»).
// Decorado (diseno/bebe.mjs): una tienda de cosas de bebé de barrio. Nada en la mano.
/* eslint-disable no-undef */

import { persona, tarjeta, selloOficial } from "../../diseno/limpio.mjs";
import { bandera } from "../../diseno/barrio.mjs";
import { ambientes } from "../../diseno/sueno.mjs";
import { columnasHoras } from "../../diseno/alquiler.mjs";
import { DECORADOS_T28, BARRIGA, mochila } from "../../diseno/bebe.mjs";

export const ESTILO = "limpio";
const F_EPF = "Cálculo propio · INE (Presupuestos Familiares y salarios)";
const F_IPC = "Cálculo propio · INE (IPC y salarios)";
const F_MNP = "INE · Indicadores demográficos";

const miles = (v) => String(Math.round(v)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
const coma = (v, d = 1) => v.toFixed(d).replace(".", ",");

export function datos(d) {
  const F = d.filas, A = d.anos;
  const t = A.map((a) => F[a].alimentos_bebe_coste_tiempo);
  return {
    A, guarde: ["2016", "2019", "2025"].map((a) => F[a].guarderia_horas), guardeEur: ["2016", "2019", "2025"].map((a) => F[a].guarderia_anual),
    tiempo: t.map((x) => x / t[4] * 100), vs: d.alimentos_bebe_hoy_frente_a_pct, hijos: A.map((a) => F[a].hijos_por_mujer),
  };
}

export const capas = () => ambientes({ tiendaBebe: DECORADOS_T28.tiendaBebe });

// ------------------------------------------------------------------ personajes (inventados), con volumen
const HIJA = { pelo: "largo", canas: false, barba: false, colorPelo: "#4A3020", ropa: ["#7C9A7E", "#647F66"], piel: "#F2CBA8", piel2: "#E0B48F", volumen: true, encima: BARRIGA };
const PADRE = { pelo: "corto", canas: true, barba: false, bigote: true, colorPelo: "#B8B0A4", colorBigote: "#C9C2B6", ropa: ["#6B7280", "#575E69"], piel: "#EBC3A0", piel2: "#D9AE8C", volumen: true };
const QUIEN = { h: HIJA, p: PADRE };
const gente = (n, quien) => quien.split("").map((k) => persona(`${n}-${k}`, "hoy", QUIEN[k])).join("");

// ------------------------------------------------------------------ tarjetas
const HOY = "#B3261E";
const cita = (n, quien, html) => tarjeta(n, quien, `<div class="tit" style="font-size:64px">${html}</div>`, { tono: "hoy" });
const grande = (n, titulo, cifra, sub, nota, fuente, color = HOY) => tarjeta(n, titulo, `<div class="tit" style="font-size:104px;color:${color};line-height:1" id="c${n}-a">${cifra}</div>
  <div class="sub" id="c${n}-b" style="font-size:42px">${sub}</div>${nota ? `<div class="nota">${nota}</div>` : ""}`, { fuente, icono: bandera(44) });
const vs = (n, titulo, vals, labs, nota, fuente, tam = 96) => tarjeta(n, titulo, `<div class="vs">${vals.map((v, i) => `<div class="col"><div class="v ${i ? "t-hoy" : "t-pasado"}" id="c${n}-${"ab"[i]}" style="font-size:${tam}px">${v}</div><div class="n">${labs[i]}</div></div>`).join("")}</div>
  <div class="nota">${nota}</div>`, { fuente, icono: bandera(44) });

// Dos filas de cunas pequeñas: hijos por cada 10 mujeres en 2007 y hoy («<id>-a<i>», «<id>-b<i>»). Origen: centro.
function cunas(id, a, b) {
  const fila = (k, n, y, rot) => `<text x="-400" y="${y - 70}" font-family="Cap" font-weight="800" font-size="34" fill="#14141E">${rot}</text>` +
    Array.from({ length: n }, (_, i) => { const col = ["#F4C7C3", "#BFDCEB", "#F7E3A3", "#CDE6C7", "#E3D3EE"][i % 5];
      return `<g id="${id}-${k}${i}" transform="translate(${-372 + i * 57} ${y})"><ellipse cx="0" cy="6" rx="24" ry="30" fill="${col}"/><circle cx="0" cy="-34" r="20" fill="#F2CBA8"/>
        <path d="M-20 -40 Q0 -64 20 -40 Z" fill="${col}"/><circle cx="-7" cy="-32" r="3" fill="#14141E"/><circle cx="7" cy="-32" r="3" fill="#14141E"/></g>`; }).join("");
  return `<g id="${id}"><rect x="-430" y="-230" width="860" height="420" rx="24" fill="#FFFDF8" opacity=".96"/>
    ${fila("a", a, -40, `2007: ${a} bebés por cada 10 mujeres`)}${fila("b", b, 150, `Hoy: ${b}`)}</g>`;
}

export function escenas(D) {
  const G = D.guarde, A = D.A;
  const pctTxt = (v) => `${v > 0 ? "+" : "−"}${coma(Math.abs(v))} %`;
  const etiquetas = [pctTxt(D.vs["2007"]), pctTxt(D.vs["2013"]), pctTxt(D.vs["2016"]), pctTxt(D.vs["2019"]), "hoy"];
  return [
    // 1 · Gancho. La hija: «¿Tener un bebé cuesta hoy más horas de trabajo que antes? Porque mi padre dice que criar un hijo hoy es un lujo.»
    { n: 1, set: "vacio",
      svg: `${gente("s1", "hp")}${selloOficial("s1-sello")}`,
      tarjeta: tarjeta(1, "Un bebé · de 2007 a hoy", `<div class="tit" style="font-size:64px">¿Tener un <mark id="m1">bebé</mark> cuesta hoy más horas de trabajo?</div>`, { icono: bandera(44) }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("tiendaBebe", null, t, 0);
        vidaFondo("tb", t, { capa: "tiendaBebe", lamparas: 1, balanceo: 1 });
        marca("m1", t, c["c1-bebe"]);
        selloAnim("s1-sello", t, c["c1-sello"], 545, 860, { s: 0.75, r: -9 });
        persona("s1-h", t, { x: 320, y: 1440, s: 0.78, mira: 0, vivo: true, charla: e, boca: habla(t, e, "sonrisa"), brazo: [[0, "abajo"], [c["c1-bebe"], "senala"], [c["c1-lujo"] - 0.4, "hombros"]], fase: 1 });
        persona("s1-p", t, { x: 800, y: 1440, s: 0.8, mira: 1, vivo: true, boca: [[0, "seria"]], brazo: [[0, "abajo"], [c["c1-lujo"], "hombros"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c1-bebe"], e.c["c1-lujo"]]); } },

    // 2 · Lo que cree el padre: «Hombre claro. Solo la guardería ya te cuesta un riñón ¿eh?»
    { n: 2, set: "vacio",
      svg: `<g transform="translate(560 1330) scale(.6)">${mochila("s2-m")}</g>${gente("s2", "hp")}`,
      tarjeta: cita(2, "El padre", `«Solo la <mark id="m2">guardería</mark> ya te cuesta un riñón»`),
      fn: function (t, e) {
        const c = e.c;
        ambiente("tiendaBebe", null, t, 0);
        vidaFondo("tb", t, { capa: "tiendaBebe", lamparas: 1, balanceo: 1 });
        pop("s2-m", t, c["c2-guarderia"] - 0.3, 0, 0, { s: 1 });
        marca("m2", t, c["c2-guarderia"]);
        persona("s2-h", t, { x: 300, y: 1440, s: 0.78, mira: 1, vivo: true, boca: [[0, "sonrisa"]], brazo: [[0, "abajo"]], fase: 1 });
        persona("s2-p", t, { x: 820, y: 1440, s: 0.8, mira: -1, vivo: true, charla: e, boca: habla(t, e, "seria"), brazo: [[0, "abajo"], [c["c2-guarderia"] - 0.2, "senala"], [c["c2-rinon"], "hombros"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c2-rinon"]]); } },

    // 3 · La guardería (EPF). La hija: «Pues los que la pagan gastan de media 1.675 euros al año… unas 129 horas de trabajo. En 2016 eran 156.»
    { n: 3, set: "vacio",
      svg: `<g transform="translate(540 1330)">${columnasHoras("s3-c", G, ["2016", "2019", "2025"], { W: 560, H: 360, tam: 40, fmt: (v) => `${Math.round(v)} h` })}</g>${gente("s3", "hp")}`,
      tarjeta: grande(3, "Guardería de 0 a 3 años", `${miles(D.guardeEur[2])}&nbsp;€`, `al año = ${Math.round(G[2])} horas de trabajo`,
        `Gasto medio de los hogares que la pagan (2025). 2016: ${miles(D.guardeEur[0])} € (${Math.round(G[0])} h); 2019: ${miles(D.guardeEur[1])} € (${Math.round(G[1])} h)`, F_EPF),
      fn: function (t, e) {
        const c = e.c;
        ambiente("tiendaBebe", null, t, 0);
        vidaFondo("tb", t, { capa: "tiendaBebe", lamparas: 1, balanceo: 1 });
        pop("s3-c", t, e.t0 + 0.05, 0, 0, { s: 1 });
        const cuando = [c["c3-156"] - 0.3, e.t0 + 0.4, c["c3-129"] - 0.3];
        for (let i = 0; i < 3; i++) {
          css(`s3-c-b${i}`, "transform", `scaleY(${suave(clamp((t - cuando[i]) / 0.5)).toFixed(3)})`); css(`s3-c-v${i}`, "opacity", clamp((t - cuando[i] - 0.35) / 0.25));
        }
        sube("c3-a", t, c["c3-1675"]); sube("c3-b", t, c["c3-129"]);
        persona("s3-h", t, { x: 130, y: 1700, s: 0.64, mira: 1, vivo: true, charla: e, boca: habla(t, e, "sonrisa"), brazo: [[0, "abajo"], [c["c3-1675"], "senala"], [c["c3-156"], "hombros"]], fase: 1 });
        persona("s3-p", t, { x: 950, y: 1700, s: 0.66, mira: -1, vivo: true, boca: [[0, "seria"], [c["c3-129"] + 0.3, "o"]], ojos: [[0, "normal"], [c["c3-129"] + 0.3, "grandes"]], brazo: [[0, "abajo"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c3-129"], e.c["c3-156"]]); } },

    // 4 · El padre: «Anda ya… ¿y la leche y los potitos?»
    { n: 4, set: "vacio",
      svg: `${gente("s4", "hp")}`,
      tarjeta: cita(4, "El padre", `«¿Y la leche y los <mark id="m4">potitos</mark>?»`),
      fn: function (t, e) {
        const c = e.c;
        ambiente("tiendaBebe", null, t, 0);
        vidaFondo("tb", t, { capa: "tiendaBebe", lamparas: 1, balanceo: 1 });
        marca("m4", t, c["c4-potitos"]);
        persona("s4-h", t, { x: 300, y: 1440, s: 0.78, mira: 1, vivo: true, boca: [[0, "sonrisa"]], brazo: [[0, "abajo"]], fase: 1 });
        persona("s4-p", t, { x: 800, y: 1440, s: 0.8, mira: -1, vivo: true, charla: e, boca: habla(t, e, "grande"), ojos: [[0, "grandes"]], brazo: [[0, "abajo"], [c["c4-anda"], "arriba"], [c["c4-potitos"], "senala"]], salta: c["c4-anda"], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c4-anda"]]); } },

    // 5 · La comida del bebé (IPC). La hija: «Cuestan un 9 % menos tiempo de trabajo que en 2007. Eso sí un 9 % más que en 2019.»
    { n: 5, set: "vacio",
      svg: `<g transform="translate(540 1330)">${columnasHoras("s5-c", D.tiempo, A, { W: 700, H: 340, tam: 32, fmt: (v) => etiquetas[D.tiempo.indexOf(v)] })}</g>${gente("s5", "hp")}`,
      tarjeta: vs(5, "Leche infantil y potitos, en tiempo de trabajo", [pctTxt(D.vs["2007"]), pctTxt(D.vs["2019"])], ["hoy frente a 2007", "hoy frente a 2019"],
        `Frente a 2013, ${pctTxt(D.vs["2013"])}; a 2016, ${pctTxt(D.vs["2016"])}. Precio (IPC de alimentos para bebé) entre el sueldo neto mediano por hora`, F_IPC, 84),
      fn: function (t, e) {
        const c = e.c;
        ambiente("tiendaBebe", null, t, 0);
        vidaFondo("tb", t, { capa: "tiendaBebe", lamparas: 1, balanceo: 1 });
        pop("s5-c", t, e.t0 + 0.05, 0, 0, { s: 1 });
        const cuando = [c["c5-2007"] - 0.4, e.t0 + 0.5, e.t0 + 0.6, c["c5-2019"] - 0.4, e.t0 + 0.3];
        for (let i = 0; i < 5; i++) {
          css(`s5-c-b${i}`, "transform", `scaleY(${suave(clamp((t - cuando[i]) / 0.5)).toFixed(3)})`); css(`s5-c-v${i}`, "opacity", clamp((t - cuando[i] - 0.35) / 0.25));
        }
        sube("c5-a", t, c["c5-2007"]); sube("c5-b", t, c["c5-2019"]);
        persona("s5-h", t, { x: 130, y: 1700, s: 0.64, mira: 1, vivo: true, charla: e, boca: habla(t, e, "sonrisa"), brazo: [[0, "abajo"], [c["c5-2007"], "senala"], [c["c5-2019"], "hombros"]], fase: 1 });
        persona("s5-p", t, { x: 950, y: 1700, s: 0.66, mira: -1, vivo: true, boca: [[0, "sonrisa"], [c["c5-2019"] + 0.3, "seria"]], brazo: [[0, "abajo"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c5-2007"], e.c["c5-2019"]]); } },

    // 6 · El padre: «Pues entonces criar sale más barato que en mis tiempos ¿no?»
    { n: 6, set: "vacio",
      svg: `${gente("s6", "hp")}`,
      tarjeta: cita(6, "El padre", `«Más barato que en mis <mark id="m6">tiempos</mark>»`),
      fn: function (t, e) {
        const c = e.c;
        ambiente("tiendaBebe", null, t, 0);
        vidaFondo("tb", t, { capa: "tiendaBebe", lamparas: 1, balanceo: 1 });
        marca("m6", t, c["c6-tiempos"]);
        persona("s6-h", t, { x: 300, y: 1440, s: 0.78, mira: 1, vivo: true, boca: [[0, "sonrisa"]], ojos: [[0, "felices"]], brazo: [[0, "abajo"]], fase: 1 });
        persona("s6-p", t, { x: 800, y: 1440, s: 0.8, mira: -1, vivo: true, charla: e, boca: habla(t, e, "sonrisa"), brazo: [[0, "abajo"], [c["c6-barato"], "hombros"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c6-barato"]]); } },

    // 7 · Los hijos (INE). La hija: «En horas sí. Y aun así nacen menos niños… en 2007 eran 1,38 hijos por mujer y hoy 1,11.»
    { n: 7, set: "vacio",
      svg: `<g transform="translate(540 1110)">${cunas("s7-k", Math.round(D.hijos[0] * 10), Math.round(D.hijos[4] * 10))}</g>${gente("s7", "hp")}`,
      tarjeta: vs(7, "Hijos por mujer", [coma(D.hijos[0], 2), coma(D.hijos[4], 2)], ["2007", "2025"],
        `2013: ${coma(D.hijos[1], 2)}; 2016: ${coma(D.hijos[2], 2)}; 2019: ${coma(D.hijos[3], 2)}`, F_MNP),
      fn: function (t, e) {
        const c = e.c;
        ambiente("tiendaBebe", null, t, 0);
        vidaFondo("tb", t, { capa: "tiendaBebe", lamparas: 1, balanceo: 1 });
        pop("s7-k", t, c["c7-ninos"] - 0.3, 0, 0, { s: 1 });
        sube("c7-a", t, c["c7-138"]); sube("c7-b", t, c["c7-111"]);
        persona("s7-h", t, { x: 130, y: 1700, s: 0.64, mira: 1, vivo: true, charla: e, boca: habla(t, e, "seria"), brazo: [[0, "abajo"], [c["c7-ninos"], "senala"], [c["c7-111"], "hombros"]], fase: 1 });
        persona("s7-p", t, { x: 950, y: 1700, s: 0.66, mira: -1, vivo: true, boca: [[0, "sonrisa"], [c["c7-ninos"], "seria"], [c["c7-111"] + 0.3, "o"]], brazo: [[0, "abajo"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c7-ninos"], e.c["c7-111"]]); } },

    // 8 · Veredicto y pregunta. El padre: «O sea que criar cuesta menos horas pero tenemos menos hijos. ¿Tú por qué crees que nacen menos niños?»
    { n: 8, set: "vacio",
      svg: `${gente("s8", "hp")}`,
      tarjeta: tarjeta(8, "Te toca", `<div class="tit" style="font-size:60px">¿Por qué crees que nacen menos <mark id="m8">niños</mark>?</div><div class="sub" id="c8-sub">Te leo en los comentarios.</div>`),
      fn: function (t, e) {
        const c = e.c;
        ambiente("tiendaBebe", null, t, 0);
        vidaFondo("tb", t, { capa: "tiendaBebe", lamparas: 1, balanceo: 1 });
        marca("m8", t, c["c8-ninos"] + 0.2);
        sube("c8-sub", t, c["c8-ninos"] + 0.7);
        persona("s8-h", t, { x: 300, y: 1440, s: 0.78, mira: 1, vivo: true, boca: [[0, "sonrisa"], [c["c8-hijos"], "seria"]], brazo: [[0, "abajo"]], fase: 1 });
        persona("s8-p", t, { x: 800, y: 1440, s: 0.8, mira: [[0, -1], [c["c8-hijos"] + 0.4, 0]], vivo: true, charla: e, boca: habla(t, e, "sonrisa"), brazo: [[0, "abajo"], [c["c8-menos"], "hombros"], [c["c8-ninos"] - 0.6, "senala"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c8-hijos"], e.c["c8-ninos"]]); } },
  ];
}
