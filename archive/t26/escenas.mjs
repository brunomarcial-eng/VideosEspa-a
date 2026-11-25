// Escenas de T26 («¿Somos más ricos o más pobres que los europeos?») en estilo «limpio». Bruno, 24-11-2026: rescatar
// los temas del principio; el segundo, España frente a Europa. PIB por habitante en paridad de poder adquisitivo
// (Eurostat), UE-27 = 100: 2007, la crisis (2013), 2016, 2019 y 2024; el puesto de España, y Polonia y Chequia.
//   · «hija»: unos 35, melena castaña clara, abrigo burdeos; trabaja en Alemania y vuelve por Navidad (voz «viajera»).
//   · «padre»: unos 60, canas y bigote, chaquetón marrón; la recoge en el aeropuerto (voz «comandante»).
// Decorado (diseno/europa.mjs): la sala de llegadas de un aeropuerto en Navidad. La maleta va en el suelo.
/* eslint-disable no-undef */

import { persona, tarjeta, selloOficial } from "../../diseno/limpio.mjs";
import { bandera as banderaEs } from "../../diseno/barrio.mjs";
import { ambientes } from "../../diseno/sueno.mjs";
import { columnasHoras } from "../../diseno/alquiler.mjs";
import { maleta } from "../../diseno/horas.mjs";
import { DECORADOS_T26, tamanoEconomia, fila27, barrasPaises } from "../../diseno/europa.mjs";

export const ESTILO = "limpio";
const F_PPA = "Eurostat · PIB por habitante en paridad de poder adquisitivo";
const F_PIB = "Eurostat · Cuentas nacionales (PIB a precios corrientes)";

export function datos(d) {
  const F = d.filas, A = d.anos, P = (a, g) => F[a].pib[g];
  return {
    es: A.map((a) => P(a, "ES")), anos: A, puesto: F["2024"].pib_puesto_es, paises: F["2024"].pib_paises,
    total: d.pib_total["2025"], P: Object.fromEntries(["ES", "DE", "FR", "IT", "PL", "CZ"].map((g) => [g, { antes: P("2007", g), hoy: P("2024", g) }])),
  };
}

export const capas = () => ambientes({ llegadas: DECORADOS_T26.llegadas });

// ------------------------------------------------------------------ personajes (inventados), con volumen
const HIJA = { pelo: "largo", canas: false, barba: false, colorPelo: "#7A5236", ropa: ["#8E3B46", "#74303A"], piel: "#F2CBA8", piel2: "#E0B48F", volumen: true };
const PADRE = { pelo: "corto", canas: true, barba: false, bigote: true, colorPelo: "#B8B0A4", colorBigote: "#C9C2B6", ropa: ["#6E5444", "#5A4436"], piel: "#EBC3A0", piel2: "#D9AE8C", volumen: true };
const QUIEN = { h: HIJA, p: PADRE };
const gente = (n, quien) => quien.split("").map((k) => persona(`${n}-${k}`, "hoy", QUIEN[k])).join("");
const MALETA = (n, x = 170, y = 1450, s = 0.8) => `<g transform="translate(${x} ${y}) scale(${s})">${maleta(`${n}-m`, "#2F6F6A")}</g>`;

// ------------------------------------------------------------------ tarjetas
const HOY = "#B3261E";
const cita = (n, quien, html) => tarjeta(n, quien, `<div class="tit" style="font-size:64px">${html}</div>`, { tono: "hoy" });
const grande = (n, titulo, cifra, sub, nota, fuente, color = HOY) => tarjeta(n, titulo, `<div class="tit" style="font-size:104px;color:${color};line-height:1" id="c${n}-a">${cifra}</div>
  <div class="sub" id="c${n}-b" style="font-size:42px">${sub}</div>${nota ? `<div class="nota">${nota}</div>` : ""}`, { fuente, icono: banderaEs(44) });
const vs = (n, titulo, vals, labs, nota, fuente, tam = 96) => tarjeta(n, titulo, `<div class="vs">${vals.map((v, i) => `<div class="col"><div class="v ${i ? "t-hoy" : "t-pasado"}" id="c${n}-${"ab"[i]}" style="font-size:${tam}px">${v}</div><div class="n">${labs[i]}</div></div>`).join("")}</div>
  <div class="nota">${nota}</div>`, { fuente, icono: banderaEs(44) });

export function escenas(D) {
  const P = D.P, es = D.es;
  const NOMBRE = { ES: "España", DE: "Alemania", FR: "Francia", IT: "Italia", PL: "Polonia", CZ: "Chequia" };
  const fila = (g, color) => ({ pais: g, nombre: NOMBRE[g], antes: P[g].antes, hoy: P[g].hoy, color });
  return [
    // 1 · Gancho. La hija: «¿Somos más ricos o más pobres que los europeos? Porque mi padre dice que como en España no se vive en ningún sitio.»
    { n: 1, set: "vacio",
      svg: `${MALETA("s1")}${gente("s1", "hp")}${selloOficial("s1-sello")}`,
      tarjeta: tarjeta(1, "España y Europa · de 2007 a hoy", `<div class="tit" style="font-size:64px">¿Somos más <mark id="m1">ricos</mark> o más pobres que los europeos?</div>`, { icono: banderaEs(44) }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("llegadas", null, t, 0);
        vidaFondo("ll", t, { capa: "llegadas" });
        marca("m1", t, c["c1-ricos"]);
        selloAnim("s1-sello", t, c["c1-sello"], 545, 860, { s: 0.75, r: -9 });
        persona("s1-h", t, { x: 330, y: 1440, s: 0.78, mira: 0, vivo: true, charla: e, boca: habla(t, e, "sonrisa"), brazo: [[0, "abajo"], [c["c1-ricos"], "senala"], [c["c1-sitio"] - 0.4, "hombros"]], fase: 1 });
        persona("s1-p", t, { x: 790, y: 1440, s: 0.8, mira: -1, vivo: true, boca: [[0, "sonrisa"]], ojos: [[0, "felices"], [c["c1-sitio"], "normal"]], brazo: [[0, "saluda"], [c["c1-ricos"], "abajo"], [c["c1-sitio"], "hombros"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c1-ricos"], e.c["c1-sitio"]]); } },

    // 2 · Lo que cree el padre (Eurostat, PIB total). El padre: «Hombre claro. Y encima somos la cuarta economía de Europa ¿o no?»
    { n: 2, set: "vacio",
      svg: `<g transform="translate(540 1230)">${tamanoEconomia("s2-t", ["DE", "FR", "IT", "ES"].map((g) => ({ pais: g, nombre: NOMBRE[g], valor: D.total.primeros.find((x) => x[0] === g)[1] })))}</g>${gente("s2", "hp")}`,
      tarjeta: grande(2, "Por tamaño de la economía", "4.ª", "de la UE: detrás de Alemania, Francia e Italia",
        `PIB de 2025: ${(D.total.es_meur / 1e6).toFixed(2).replace(".", ",")} billones de euros`, F_PIB, "#5B6470"),
      fn: function (t, e) {
        const c = e.c;
        ambiente("llegadas", null, t, 0);
        vidaFondo("ll", t, { capa: "llegadas" });
        pop("s2-t", t, e.t0 + 0.05, 0, 0, { s: 1 });
        for (let i = 0; i < 4; i++) css(`s2-t-b${i}`, "transform", `scaleY(${suave(clamp((t - e.t0 - 0.2 - i * 0.18) / 0.5)).toFixed(3)})`);
        css("s2-t-c", "opacity", clamp((t - c["c2-cuarta"]) / 0.3));
        sube("c2-a", t, c["c2-cuarta"]); sube("c2-b", t, c["c2-cuarta"] + 0.3);
        persona("s2-h", t, { x: 130, y: 1700, s: 0.64, mira: 1, vivo: true, boca: [[0, "sonrisa"], [c["c2-cuarta"], "seria"]], brazo: [[0, "abajo"]], fase: 1 });
        persona("s2-p", t, { x: 950, y: 1700, s: 0.66, mira: -1, vivo: true, charla: e, boca: habla(t, e, "sonrisa"), brazo: [[0, "abajo"], [c["c2-claro"], "hombros"], [c["c2-cuarta"], "senala"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c2-cuarta"]]); } },

    // 3 · El puesto por persona (Eurostat, PPA). La hija: «La cuarta en tamaño sí… pero por persona y con lo que cuestan las cosas aquí estamos en el puesto 14 de 27.»
    { n: 3, set: "vacio",
      svg: `<g transform="translate(540 1150)">${fila27("s3-f", D.puesto)}</g>${gente("s3", "hp")}`,
      tarjeta: grande(3, "Por persona", `puesto ${D.puesto}`, `de ${D.paises} países de la UE`, "PIB por habitante ajustado a lo que cuestan las cosas en cada país (paridad de poder adquisitivo), 2024", F_PPA),
      fn: function (t, e) {
        const c = e.c;
        ambiente("llegadas", null, t, 0);
        vidaFondo("ll", t, { capa: "llegadas" });
        pop("s3-f", t, e.t0 + 0.05, 0, 0, { s: 1 });
        pop("s3-f-es", t, c["c3-14"] - 0.3, 0, 0, { s: 1 });
        pop("s3-f-f", t, c["c3-14"] - 0.1, 0, 0, { s: 1 });
        sube("c3-a", t, c["c3-14"]); sube("c3-b", t, c["c3-27"]);
        persona("s3-h", t, { x: 130, y: 1700, s: 0.64, mira: 1, vivo: true, charla: e, boca: habla(t, e, "sonrisa"), brazo: [[0, "abajo"], [c["c3-tamano"], "hombros"], [c["c3-14"] - 0.2, "senala"]], fase: 1 });
        persona("s3-p", t, { x: 950, y: 1700, s: 0.66, mira: -1, vivo: true, boca: [[0, "sonrisa"], [c["c3-14"] + 0.3, "o"]], ojos: [[0, "normal"], [c["c3-14"] + 0.3, "grandes"]], brazo: [[0, "abajo"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c3-14"]]); } },

    // 4 · El padre no se lo cree: «Anda ya… ¿y eso desde cuándo?»
    { n: 4, set: "vacio",
      svg: `${MALETA("s4")}${gente("s4", "hp")}`,
      tarjeta: cita(4, "El padre", `«¿Y eso desde <mark id="m4">cuándo</mark>?»`),
      fn: function (t, e) {
        const c = e.c;
        ambiente("llegadas", null, t, 0);
        vidaFondo("ll", t, { capa: "llegadas" });
        marca("m4", t, c["c4-cuando"]);
        persona("s4-h", t, { x: 330, y: 1440, s: 0.78, mira: 1, vivo: true, boca: [[0, "sonrisa"]], brazo: [[0, "abajo"]], fase: 1 });
        persona("s4-p", t, { x: 790, y: 1440, s: 0.8, mira: -1, vivo: true, charla: e, boca: habla(t, e, "grande"), ojos: [[0, "grandes"]], brazo: [[0, "abajo"], [c["c4-anda"], "arriba"], [c["c4-cuando"], "hombros"]], salta: c["c4-anda"], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c4-anda"]]); } },

    // 5 · 2007 frente a hoy. La hija: «En 2007 estábamos un 4 % por encima de la media europea. Hoy un 8 % por debajo.»
    { n: 5, set: "vacio",
      svg: `<g transform="translate(540 1330)">${columnasHoras("s5-c", [es[0], es[4]], ["2007", "Hoy"], { W: 420, H: 380, tam: 44, fmt: (v) => String(v) })}
          <line x1="-250" y1="${(-100 / es[0] * 380).toFixed(1)}" x2="250" y2="${(-100 / es[0] * 380).toFixed(1)}" stroke="#14141E" stroke-width="4" stroke-dasharray="14 10" opacity=".7"/>
          <text x="-252" y="${(-100 / es[0] * 380 + 8).toFixed(1)}" text-anchor="end" font-family="Cap" font-weight="800" font-size="26" fill="#14141E">media UE</text></g>${gente("s5", "hp")}`,
      tarjeta: vs(5, "Riqueza por persona (media de la UE = 100)", [String(es[0]), String(es[4])], ["2007: un 4&nbsp;% por encima", "hoy: un 8&nbsp;% por debajo"],
        `Plena crisis (2013): ${es[1]}; 2016: ${es[2]}; 2019: ${es[3]}. Ajustada a lo que cuestan las cosas (PPA)`, F_PPA),
      fn: function (t, e) {
        const c = e.c;
        ambiente("llegadas", null, t, 0);
        vidaFondo("ll", t, { capa: "llegadas" });
        pop("s5-c", t, e.t0 + 0.05, 0, 0, { s: 1 });
        [[0, c["c5-2007"] - 0.2], [1, c["c5-8"] - 0.6]].forEach(([i, x]) => {
          css(`s5-c-b${i}`, "transform", `scaleY(${suave(clamp((t - x) / 0.5)).toFixed(3)})`); css(`s5-c-v${i}`, "opacity", clamp((t - x - 0.35) / 0.25));
        });
        sube("c5-a", t, c["c5-4"]); sube("c5-b", t, c["c5-8"]);
        persona("s5-h", t, { x: 130, y: 1700, s: 0.64, mira: 1, vivo: true, charla: e, boca: habla(t, e, "seria"), brazo: [[0, "abajo"], [c["c5-2007"], "senala"], [c["c5-8"], "hombros"]], fase: 1 });
        persona("s5-p", t, { x: 950, y: 1700, s: 0.66, mira: -1, vivo: true, boca: [[0, "seria"], [c["c5-8"] + 0.3, "o"]], ojos: [[0, "normal"], [c["c5-8"] + 0.3, "grandes"]], brazo: [[0, "abajo"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c5-4"], e.c["c5-8"]]); } },

    // 6 · Desde la crisis. La hija: «Y desde la crisis estamos ahí parados… en 2016 igual que hoy.»
    { n: 6, set: "vacio",
      svg: `<g transform="translate(540 1330)">${columnasHoras("s6-c", es, D.anos, { W: 680, H: 380, tam: 40, fmt: (v) => String(v) })}
          <line x1="-360" y1="${(-100 / es[0] * 380).toFixed(1)}" x2="360" y2="${(-100 / es[0] * 380).toFixed(1)}" stroke="#14141E" stroke-width="4" stroke-dasharray="14 10" opacity=".55"/></g>${gente("s6", "hp")}`,
      tarjeta: grande(6, "Desde 2016", `${es[2]}&nbsp;%`, "de la media de la UE, igual que hoy", `2007: ${es[0]} · 2013: ${es[1]} · 2019: ${es[3]} · 2024: ${es[4]}`, F_PPA),
      fn: function (t, e) {
        const c = e.c;
        ambiente("llegadas", null, t, 0);
        vidaFondo("ll", t, { capa: "llegadas" });
        for (let i = 0; i < 5; i++) {
          const x = i === 0 ? e.t0 : i === 1 ? c["c6-crisis"] - 0.3 : i === 2 ? c["c6-2016"] - 0.3 : e.t0 + 0.4;
          css(`s6-c-b${i}`, "transform", `scaleY(${suave(clamp((t - x) / 0.5)).toFixed(3)})`); css(`s6-c-v${i}`, "opacity", clamp((t - x - 0.3) / 0.25));
        }
        sube("c6-a", t, c["c6-2016"]); sube("c6-b", t, c["c6-2016"] + 0.3);
        persona("s6-h", t, { x: 130, y: 1700, s: 0.64, mira: 1, vivo: true, charla: e, boca: habla(t, e, "seria"), brazo: [[0, "abajo"], [c["c6-2016"], "senala"]], fase: 1 });
        persona("s6-p", t, { x: 950, y: 1700, s: 0.66, mira: -1, vivo: true, boca: [[0, "seria"]], brazo: [[0, "abajo"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c6-2016"]]); } },

    // 7 · El padre: «Bueno pero Italia y Francia también han bajado ¿no?»
    { n: 7, set: "vacio",
      svg: `<g transform="translate(540 1160)">${barrasPaises("s7-b", [fila("IT", "#5B6470"), fila("FR", "#5B6470")])}</g>${gente("s7", "hp")}`,
      tarjeta: tarjeta(7, "El padre", `<div class="tit" style="font-size:60px">«Italia y Francia también han <mark id="m7">bajado</mark>»</div>
        <div class="nota">Italia, de ${P.IT.antes} a ${P.IT.hoy}; Francia, de ${P.FR.antes} a ${P.FR.hoy} (2007 y 2024; media de la UE = 100)</div>`, { tono: "hoy", fuente: F_PPA }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("llegadas", null, t, 0);
        vidaFondo("ll", t, { capa: "llegadas" });
        pop("s7-b", t, e.t0 + 0.05, 0, 0, { s: 1 });
        [[0, c["c7-italia"]], [1, c["c7-francia"]]].forEach(([i, x]) => {
          css(`s7-b-b${i}`, "transform", `scaleX(${suave(clamp((t - x) / 0.6)).toFixed(3)})`); css(`s7-b-v${i}`, "opacity", clamp((t - x - 0.4) / 0.3));
        });
        marca("m7", t, c["c7-bajado"]);
        persona("s7-h", t, { x: 130, y: 1700, s: 0.64, mira: 1, vivo: true, boca: [[0, "sonrisa"]], brazo: [[0, "abajo"]], fase: 1 });
        persona("s7-p", t, { x: 950, y: 1700, s: 0.66, mira: -1, vivo: true, charla: e, boca: habla(t, e, "sonrisa"), brazo: [[0, "abajo"], [c["c7-italia"], "senala"], [c["c7-bajado"], "hombros"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c7-bajado"]]); } },

    // 8 · Los que suben. La hija: «Sí… pero mira Polonia: en 2007 estaba al 54 % de la media y hoy al 79. Y Chequia ya está al 91… casi como nosotros.»
    { n: 8, set: "vacio",
      svg: `<g transform="translate(540 1130)">${barrasPaises("s8-b", [fila("PL", "#3F7A4A"), fila("CZ", "#3F7A4A"), fila("ES", "#B3261E")])}</g>${gente("s8", "hp")}`,
      tarjeta: vs(8, "Riqueza por persona (media de la UE = 100)", [`${P.PL.antes}`, `${P.PL.hoy}`], ["Polonia, 2007", "Polonia, hoy"],
        `Chequia, de ${P.CZ.antes} a ${P.CZ.hoy}; España, de ${P.ES.antes} a ${P.ES.hoy}`, F_PPA),
      fn: function (t, e) {
        const c = e.c;
        ambiente("llegadas", null, t, 0);
        vidaFondo("ll", t, { capa: "llegadas" });
        pop("s8-b", t, e.t0 + 0.05, 0, 0, { s: 1 });
        [[0, c["c8-79"] - 0.3], [1, c["c8-91"] - 0.3], [2, e.t0 + 0.4]].forEach(([i, x]) => {
          css(`s8-b-b${i}`, "transform", `scaleX(${suave(clamp((t - x) / 0.6)).toFixed(3)})`); css(`s8-b-v${i}`, "opacity", clamp((t - x - 0.4) / 0.3));
        });
        sube("c8-a", t, c["c8-54"]); sube("c8-b", t, c["c8-79"]);
        persona("s8-h", t, { x: 130, y: 1700, s: 0.64, mira: 1, vivo: true, charla: e, boca: habla(t, e, "sonrisa"), brazo: [[0, "abajo"], [c["c8-polonia"], "senala"], [c["c8-chequia"], "hombros"]], fase: 1 });
        persona("s8-p", t, { x: 950, y: 1700, s: 0.66, mira: -1, vivo: true, boca: [[0, "seria"], [c["c8-91"] + 0.3, "o"]], ojos: [[0, "normal"], [c["c8-91"] + 0.3, "grandes"]], brazo: [[0, "abajo"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c8-79"], e.c["c8-91"]]); } },

    // 9 · El padre: «Pues sí que nos están pillando…»
    { n: 9, set: "vacio",
      svg: `${MALETA("s9")}${gente("s9", "hp")}`,
      tarjeta: cita(9, "El padre", `«Pues sí que nos están <mark id="m9">pillando</mark>»`),
      fn: function (t, e) {
        const c = e.c;
        ambiente("llegadas", null, t, 0);
        vidaFondo("ll", t, { capa: "llegadas" });
        marca("m9", t, c["c9-pillando"]);
        persona("s9-h", t, { x: 330, y: 1440, s: 0.78, mira: 1, vivo: true, boca: [[0, "sonrisa"]], brazo: [[0, "abajo"]], fase: 1 });
        persona("s9-p", t, { x: 790, y: 1440, s: 0.8, mira: -1, vivo: true, charla: e, boca: habla(t, e, "seria"), brazo: [[0, "abajo"], [c["c9-pillando"] - 0.3, "piensa"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c9-pillando"]]); } },

    // 10 · Veredicto y pregunta. El padre: «O sea que en 2007 éramos más ricos que la media y hoy estamos por debajo. ¿Y tú dónde crees que se vive mejor?»
    { n: 10, set: "vacio",
      svg: `${MALETA("s10")}${gente("s10", "hp")}`,
      tarjeta: tarjeta(10, "Te toca", `<div class="tit" style="font-size:60px">¿Dónde crees que se vive <mark id="m10">mejor</mark>?</div><div class="sub" id="c10-sub">Te leo en los comentarios.</div>`),
      fn: function (t, e) {
        const c = e.c;
        ambiente("llegadas", null, t, 0);
        vidaFondo("ll", t, { capa: "llegadas" });
        marca("m10", t, c["c10-mejor"] + 0.2);
        sube("c10-sub", t, c["c10-mejor"] + 0.7);
        persona("s10-h", t, { x: 330, y: 1440, s: 0.78, mira: 1, vivo: true, boca: [[0, "sonrisa"], [c["c10-debajo"], "seria"]], brazo: [[0, "abajo"]], fase: 1 });
        persona("s10-p", t, { x: 790, y: 1440, s: 0.8, mira: [[0, -1], [c["c10-debajo"] + 0.4, 0]], vivo: true, charla: e, boca: habla(t, e, "sonrisa"), brazo: [[0, "abajo"], [c["c10-debajo"], "hombros"], [c["c10-mejor"] - 0.6, "senala"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c10-debajo"], e.c["c10-mejor"]]); } },
  ];
}
