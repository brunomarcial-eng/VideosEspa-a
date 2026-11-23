// Escenas de T18 («¿Cuál es el coche más vendido en España?», coches B con dos cuñados en un bar) en estilo «limpio».
// Bruno, 22-11-2026: versión B de la prueba de coches B. Luis se compró en 2016 el coche más vendido; Javi se va a comprar
// uno hoy y casi prefiere uno usado. Ángulo propio: el top 3 de cada año y los usados traídos de fuera. Voces del catálogo:
//   · «luis»: unos 50, polo verde, canas (voz «padre»).
//   · «javi»: unos 45, camisa terracota, algo más moreno (voz «maquinista»).
// Decorado nuevo (diseno/barcunados.mjs): bar de barrio en perspectiva, con lámparas, gente al fondo y la calle por la ventana.
/* eslint-disable no-undef */

import { C, persona, tarjeta, selloOficial } from "../../diseno/limpio.mjs";
import { bandera } from "../../diseno/barrio.mjs";
import { ambientes } from "../../diseno/sueno.mjs";
import { coche } from "../../diseno/transporte.mjs";
import { DECORADOS_T18, podio, CANA_MANO, mesaAlta } from "../../diseno/barcunados.mjs";
import { etiqueta } from "../../diseno/carnet.mjs";

export const ESTILO = "limpio";
const F_TOP = "Dato oficial: DGT (microdatos de matriculaciones), turismos y todoterrenos nuevos";
const F_PRE = "Cálculo propio · Agencia Tributaria (ranking de ventas 2025) · INE";
const F_NUEVO = "Cálculo propio · Agencia Tributaria · INE";
const F_IMP = "Dato oficial: Agencia Tributaria (estadística del impuesto de matriculación)";

export function datos(d) {
  const top = (a) => d.top_modelos[a].top, n = d.coche_nuevo_medio, u = d.segunda_mano;
  const m25 = Object.fromEntries(top("2025").slice(0, 3).map((m) => [m.modelo, m]));
  return {
    top16: top("2016").slice(0, 3).map((m) => m.matriculados), top25: top("2025").slice(0, 3).map((m) => m.matriculados),
    pvp: ["SANDERO", "CLIO", "ZS"].map((k) => m25[k].precio_con_iva), meses: ["SANDERO", "CLIO", "ZS"].map((k) => m25[k].meses_de_sueldo),
    nuevo: Object.fromEntries(["2007", "2016", "2019", "2025"].map((a) => [a, n[a].meses_de_sueldo])), precio25: n["2025"].precio_con_impuestos,
    imp: Object.fromEntries(["2007", "2016", "2019", "2025"].map((a) => [a, u[a].usados_importados_pct])), mes: d.sueldo_neto_mes["2025"],
  };
}

export const capas = () => ambientes(DECORADOS_T18);

// ------------------------------------------------------------------ personajes (inventados), con volumen
const LUIS = { pelo: "corto", canas: true, barba: false, colorPelo: "#5A4A3E", ropa: ["#7C9A7E", "#647F66"], piel: "#EBC3A0", volumen: true };
const JAVI = { pelo: "corto", canas: false, barba: false, colorPelo: "#241A14", ropa: ["#C77B5B", "#A86347"], piel: "#D9A77E", piel2: "#C4916A", volumen: true };
const QUIEN = { l: LUIS, j: JAVI };
const gente = (n, quien, manos = {}) => quien.split("").map((k) => persona(`${n}-${k}`, "hoy", { ...QUIEN[k], mano: manos[k] ? `<g id="${n}-${k}-mano">${manos[k]}</g>` : undefined })).join("");
const cunados = (n) => gente(n, "lj", { l: CANA_MANO, j: CANA_MANO });

// ------------------------------------------------------------------ piezas de los datos
const ANTES_T = "#8A6316", HOY = "#B3261E", GRIS19 = "#6B7480";
const panel = (x, y, w, h) => `<rect x="${x + 8}" y="${y + 12}" width="${w}" height="${h}" rx="26" fill="#3C2814" opacity=".10"/><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="26" fill="#FFFDF8" opacity=".96"/>`;
const rot = (x, y, t, tam, color, id = "", ancla = "middle") => `<text ${id ? `id="${id}"` : ""} x="${x}" y="${y}" text-anchor="${ancla}" font-family="Cap" font-weight="800" font-size="${tam}" fill="${color}">${t}</text>`;
const miles = (v) => String(Math.round(v)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
const es = (v, d = 1) => v.toFixed(d).replace(".", ",");
const vs = (n, vals, labs, tam = 72) => `<div class="vs">${vals.map((v, i) => `<div class="col"><div class="v ${i ? "t-hoy" : "t-pasado"}" id="c${n}-${"ab"[i]}" style="font-size:${tam}px">${v}</div><div class="n">${labs[i]}</div></div>`).join("")}</div>`;
const cita = (n, quien, html) => tarjeta(n, quien, `<div class="tit">${html}</div>`, { tono: "hoy" });
const mesa = `<g transform="translate(540 1440) scale(.9)">${mesaAlta("mesa")}</g>`;
// Barras horizontales: filas [{et, v, col}] en un panel; «s<n>-b<i>» crecen (de 0 a 290 px = max) y «s<n>-v<i>» es el número.
const BX = 440, BW = 290;
const barras = (n, filas, y0, paso, max, titulo, sufijo = "") => `${panel(250, y0 - 92, 580, 60 + paso * filas.length)}${rot(272, y0 - 52, titulo, 20, C.gris, "", "start")}
  ${filas.map((f, i) => { const y = y0 + i * paso; return `<g id="s${n}-f${i}">${rot(268, y + 9, f.et, 24, f.col, "", "start")}
    <rect x="${BX}" y="${y - 16}" width="${BW}" height="32" rx="16" fill="#EEF0F2"/><rect id="s${n}-b${i}" x="${BX}" y="${y - 16}" width="0" height="32" rx="16" fill="${f.col}"/>
    <g id="s${n}-v${i}" opacity="0">${rot(814, y + 11, es(f.v) + sufijo, 30, f.col, "", "end")}</g></g>`; }).join("")}`;

export function escenas(D) {
  const P16 = [{ nombre: "LEÓN", col: "#5B6470", s: 0.5 }, { nombre: "IBIZA", col: "#E0B04A", s: 0.44 }, { nombre: "GOLF", col: "#9AA6AE", s: 0.5 }];
  const P25 = [{ nombre: "SANDERO", col: "#C9A0C2", s: 0.42 }, { nombre: "CLIO", col: "#3E8E8A", s: 0.42 }, { nombre: "MG ZS", col: "#D9A23B", s: 0.46 }];
  return [
    // 1 · Javi llega a la mesa: «¿Tú sabes cuál es el coche más vendido en España? Que me quiero comprar uno.»
    { n: 1, set: "vacio",
      svg: `${mesa}${cunados("s1")}${selloOficial("s1-sello")}`,
      tarjeta: tarjeta(1, "Coches · 2007, 2016 y hoy", `<div class="tit" style="font-size:62px">¿Cuál es el coche <mark id="m1">más vendido</mark> en España?</div>`, { icono: bandera(44) }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("barBarrio", null, t, 0);
        vidaFondo("bb", t, { lamparas: 3, gente: 2, capa: "barBarrio", y: 1080, s: 0.42 });
        T("bb-c0", 600, 870, { s: 1 }); T("bb-camion", 1400, 880, { s: 1 });
        marca("m1", t, c["c1-vendido"]);
        selloAnim("s1-sello", t, c["c1-sello"], 300, 760, { s: 0.8, r: -9 });
        const w = ruta(t, [[0.1, 1250], [1.0, 880]]);
        persona("s1-j", t, { x: w.x, y: 1440, s: 0.8, anda: w.anda, mira: -1, vivo: true, charla: e, boca: habla(t, e, "sonrisa"), brazo: [[0, "sujeta"], [c["c1-comprar"], "senala"]], espejo: true, fase: 2 });
        persona("s1-l", t, { x: 200, y: 1440, s: 0.8, mira: 1, vivo: true, boca: [[0, "sonrisa"]], brazo: [[0, "sujeta"]], fase: 1 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c1-vendido"]]); } },

    // 2 · Luis, con el podio de 2016: «¡El mío! Un León, en 2016: el más vendido de aquel año.»
    { n: 2, set: "vacio",
      svg: `<g transform="translate(540 1340) scale(.7)">${podio("s2-po", P16)}</g>${cunados("s2")}`,
      tarjeta: tarjeta(2, "Los más vendidos en 2016", `<div class="tit" style="font-size:46px">1.º SEAT León · 2.º SEAT Ibiza · 3.º Volkswagen Golf</div>
        <div class="nota">Turismos y todoterrenos nuevos: ${D.top16.map(miles).join(", ").replace(/, ([^,]*)$/, " y $1")}. En 2019: SEAT León, Dacia Sandero y Nissan Qashqai</div>`, { fuente: F_TOP, icono: bandera(44) }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("barBarrio", null, t, 0);
        vidaFondo("bb", t, { lamparas: 3, gente: 2, capa: "barBarrio", y: 1080, s: 0.42 });
        T("bb-c0", 600, 870, { s: 1 }); T("bb-camion", 1400, 880, { s: 1 });
        const tt = [c["c2-leon"], c["c2-leon"] + 0.5, c["c2-leon"] + 0.8];
        for (let i = 0; i < 3; i++) { const k = (t - tt[i]) / 0.4; if (k < 0) ver(`s2-po-k${i}`, false); else T(`s2-po-k${i}`, 0, -260 * Math.max(0, 1 - k) * Math.max(0, 1 - k), { s: 1, op: clamp(k * 3) }); }
        persona("s2-l", t, { x: 120, y: 1440, s: 0.76, mira: 1, vivo: true, charla: e, boca: habla(t, e, "grande"), ojos: [[0, "felices"]], brazo: [[0, "abajo"], [c["c2-mio"], "arriba"]], incl: [[0, 0], [c["c2-mio"], -6]], fase: 1 });
        persona("s2-j", t, { x: 965, y: 1440, s: 0.76, mira: -1, vivo: true, boca: [[0, "sonrisa"]], brazo: [[0, "abajo"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c2-mio"], e.c["c2-leon"]]); } },

    // 3 · Javi, con el podio de hoy: «Ya no. Hoy gana el Dacia Sandero. Luego, el Clio y el MG ZS.»
    { n: 3, set: "vacio",
      svg: `<g transform="translate(540 1340) scale(.7)">${podio("s3-po", P25)}</g>${cunados("s3")}`,
      tarjeta: tarjeta(3, "Los más vendidos en 2025", `<div class="tit" style="font-size:46px">1.º Dacia Sandero · 2.º Renault Clio · 3.º MG ZS</div>
        <div class="nota">Turismos y todoterrenos nuevos: ${D.top25.map(miles).join(", ").replace(/, ([^,]*)$/, " y $1")}. El Yaris Cross cuenta aparte del Yaris</div>`, { fuente: F_TOP, icono: bandera(44) }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("barBarrio", null, t, 0);
        vidaFondo("bb", t, { lamparas: 3, gente: 2, capa: "barBarrio", y: 1080, s: 0.42 });
        T("bb-c0", 600, 870, { s: 1 }); T("bb-camion", 1400, 880, { s: 1 });
        const tt = [c["c3-sandero"], c["c3-clio"], c["c3-mg"]];
        for (let i = 0; i < 3; i++) { const k = (t - tt[i] + 0.1) / 0.4; if (k < 0) ver(`s3-po-k${i}`, false); else T(`s3-po-k${i}`, 0, -260 * Math.max(0, 1 - k) * Math.max(0, 1 - k), { s: 1, op: clamp(k * 3) }); }
        persona("s3-l", t, { x: 120, y: 1440, s: 0.76, mira: 1, vivo: true, boca: [[0, "sonrisa"], [c["c3-sandero"], "o"]], ojos: [[0, "normal"], [c["c3-sandero"], "grandes"]], brazo: [[0, "abajo"]], fase: 1 });
        persona("s3-j", t, { x: 965, y: 1440, s: 0.76, mira: -1, vivo: true, charla: e, boca: habla(t, e, "seria"), brazo: [[0, "abajo"], [c["c3-sandero"] - 0.2, "senala"], [c["c3-mg"] - 0.3, "abajo"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c3-sandero"]]); } },

    // 4 · Luis: «¿Y eso cuánto cuesta?»
    { n: 4, set: "vacio",
      svg: `${mesa}<g transform="translate(540 1300) scale(.5)" opacity=".55">${podio("s4-po", P25, false)}</g><g id="s4-et">${etiqueta("s4-et-e", "¿€?")}</g>${cunados("s4")}`,
      tarjeta: cita(4, "Luis", `«¿Y eso cuánto <mark id="m4">cuesta</mark>?»`),
      fn: function (t, e) {
        const c = e.c;
        ambiente("barBarrio", null, t, 0);
        vidaFondo("bb", t, { lamparas: 3, gente: 2, capa: "barBarrio", y: 1080, s: 0.42 });
        T("bb-c0", 600, 870, { s: 1 }); T("bb-camion", 1400, 880, { s: 1 });
        marca("m4", t, c["c4-cuesta"]);
        pop("s4-et", t, c["c4-cuesta"] - 0.1, 540, 1000, { s: 1.1, r: -6 });
        persona("s4-l", t, { x: 210, y: 1440, s: 0.8, mira: 1, vivo: true, charla: e, boca: habla(t, e, "seria"), brazo: [[0, "sujeta"], [c["c4-cuesta"] - 0.2, "piensa"]], incl: [[0, 0], [c["c4-cuesta"], 8]], fase: 1 });
        persona("s4-j", t, { x: 900, y: 1440, s: 0.8, mira: -1, vivo: true, boca: [[0, "sonrisa"]], brazo: [[0, "sujeta"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c4-cuesta"]]); } },

    // 5 · Javi: «El Sandero, unos 15.750 euros: nueve meses de sueldo. El Clio, diez y medio. El MG, doce.»
    { n: 5, set: "vacio",
      svg: `${mesa}${barras(5, [{ et: "SANDERO", v: D.meses[0], col: HOY }, { et: "CLIO", v: D.meses[1], col: "#3E8E8A" }, { et: "MG ZS", v: D.meses[2], col: "#D9A23B" }], 1170, 64, 20, "MESES DE SUELDO NETO (2025)")}${cunados("s5")}`,
      tarjeta: tarjeta(5, "Meses de sueldo neto para comprarlos (2025)", `<div class="tit" style="font-size:60px;color:${HOY}" id="c5-a">Sandero: ${es(D.meses[0])} meses</div>
        <div class="nota">Precio medio real con IVA (Hacienda, 2025): ${D.pvp.map((v) => miles(v) + "&nbsp;€").join(", ").replace(/, ([^,]*)$/, " y $1")}, sin el impuesto de matriculación. Sueldo neto mediano: ${miles(D.mes)}&nbsp;€ al mes</div>`, { fuente: F_PRE, icono: bandera(44) }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("barBarrio", null, t, 0);
        vidaFondo("bb", t, { lamparas: 3, gente: 2, capa: "barBarrio", y: 1080, s: 0.42 });
        T("bb-c0", 600, 870, { s: 1 }); T("bb-camion", 1400, 880, { s: 1 });
        const tt = [c["c5-nueve"], c["c5-clio"], c["c5-mg"]], vv = D.meses;
        for (let i = 0; i < 3; i++) { const k = suave(clamp((t - tt[i] + 0.1) / 0.6)); attr(`s5-b${i}`, "width", (k * vv[i] / 20 * 290).toFixed(1)); css(`s5-v${i}`, "opacity", clamp((t - tt[i] - 0.4) / 0.3)); }
        sube("c5-a", t, c["c5-nueve"]);
        persona("s5-l", t, { x: 160, y: 1440, s: 0.78, mira: 1, vivo: true, boca: [[0, "seria"]], brazo: [[0, "abajo"]], fase: 1 });
        persona("s5-j", t, { x: 925, y: 1440, s: 0.78, mira: -1, vivo: true, charla: e, boca: habla(t, e, "seria"), brazo: [[0, "abajo"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c5-nueve"], e.c["c5-mg"]], { acerca: 0.03 }); } },

    // 6 · Luis señala un coche grande por la ventana: «¿Y un coche nuevo normal?»
    { n: 6, set: "vacio",
      svg: `${mesa}<g id="s6-fl"><path d="M0 -60 V-10 M-20 -32 L0 -8 L20 -32" fill="none" stroke="${HOY}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/></g>${cunados("s6")}`,
      tarjeta: cita(6, "Luis", `«¿Y un coche nuevo <mark id="m6">normal</mark>?»`),
      fn: function (t, e) {
        const c = e.c;
        ambiente("barBarrio", null, t, 0);
        vidaFondo("bb", t, { lamparas: 3, gente: 2, capa: "barBarrio", y: 1080, s: 0.42 });
        T("bb-c0", 600, 870, { s: 1.35 }); T("bb-camion", 1400, 880, { s: 1 });
        marca("m6", t, c["c6-normal"]);
        const k = t - c["c6-normal"] + 0.2;
        if (k < 0) ver("s6-fl", false); else T("s6-fl", 640, 760 + 10 * Math.sin(k * 8), { s: 1, op: clamp(k * 4) });
        persona("s6-l", t, { x: 210, y: 1440, s: 0.8, mira: 1, vivo: true, charla: e, boca: habla(t, e, "seria"), brazo: [[0, "sujeta"], [c["c6-normal"] - 0.3, "arriba"]], fase: 1 });
        persona("s6-j", t, { x: 900, y: 1440, s: 0.8, mira: -1, vivo: true, boca: [[0, "sonrisa"]], brazo: [[0, "sujeta"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c6-normal"]]); } },

    // 7 · Javi: «De media, 31.555 euros: dieciocho meses y medio. En 2016, quince y medio. En 2007, dieciocho.»
    { n: 7, set: "vacio",
      svg: `${mesa}${barras(7, [{ et: "SANDERO", v: D.meses[0], col: "#C9CED3" }, { et: "CLIO", v: D.meses[1], col: "#C9CED3" }, { et: "MG ZS", v: D.meses[2], col: "#C9CED3" }, { et: "COCHE MEDIO", v: D.nuevo["2025"], col: HOY }], 1110, 60, 20, "MESES DE SUELDO NETO (2025)")}${cunados("s7")}`,
      tarjeta: tarjeta(7, "Meses de sueldo para el coche nuevo medio", `${vs(7, [es(D.nuevo["2016"]), es(D.nuevo["2025"])], ["en 2016", "en 2025"])}
        <div class="nota">En 2007, ${es(D.nuevo["2007"])}; en 2019, ${es(D.nuevo["2019"])}. Comprado nuevo en España, con IVA y matriculación: ${miles(D.precio25)}&nbsp;€ en 2025</div>`, { fuente: F_NUEVO, icono: bandera(44) }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("barBarrio", null, t, 0);
        vidaFondo("bb", t, { lamparas: 3, gente: 2, capa: "barBarrio", y: 1080, s: 0.42 });
        T("bb-c0", 600, 870, { s: 1 }); T("bb-camion", 1400, 880, { s: 1 });
        const vv = [D.meses[0], D.meses[1], D.meses[2], D.nuevo["2025"]];
        for (let i = 0; i < 3; i++) { attr(`s7-b${i}`, "width", (vv[i] / 20 * 290).toFixed(1)); css(`s7-v${i}`, "opacity", 1); }
        const k = suave(clamp((t - c["c7-31555"] + 0.1) / 0.8));
        attr("s7-b3", "width", (k * vv[3] / 20 * 290).toFixed(1)); css("s7-v3", "opacity", clamp((t - c["c7-dieciocho"]) / 0.3));
        sube("c7-b", t, c["c7-dieciocho"]); sube("c7-a", t, c["c7-2016"]);
        persona("s7-l", t, { x: 160, y: 1440, s: 0.78, mira: 1, vivo: true, boca: [[0, "seria"], [c["c7-dieciocho"], "o"]], ojos: [[0, "normal"], [c["c7-dieciocho"], "grandes"]], brazo: [[0, "abajo"]], fase: 1 });
        persona("s7-j", t, { x: 925, y: 1440, s: 0.78, mira: -1, vivo: true, charla: e, boca: habla(t, e, "seria"), brazo: [[0, "abajo"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c7-31555"], e.c["c7-2016"]], { acerca: 0.03 }); } },

    // 8 · Luis: «O sea, que lo que más se vende cuesta bastante menos que el coche medio.»
    { n: 8, set: "vacio",
      svg: `<g transform="translate(405 1340) scale(.45)">${podio("s8-po", P25, false)}</g>
        <g id="s8-cm"><g transform="scale(.62)">${coche("s8-cmc", "#5B6470")}</g><rect x="-110" y="-240" width="220" height="56" rx="12" fill="#FFFDF8" stroke="${HOY}" stroke-width="6"/>${rot(0, -200, "COCHE MEDIO", 28, HOY)}</g>${cunados("s8")}`,
      tarjeta: cita(8, "Luis", `«Lo que más se vende cuesta <mark id="m8">bastante menos</mark> que el coche medio»`),
      fn: function (t, e) {
        const c = e.c;
        ambiente("barBarrio", null, t, 0);
        vidaFondo("bb", t, { lamparas: 3, gente: 2, capa: "barBarrio", y: 1080, s: 0.42 });
        T("bb-c0", 600, 870, { s: 1 }); T("bb-camion", 1400, 880, { s: 1 });
        marca("m8", t, c["c8-menos"]);
        pop("s8-cm", t, c["c8-medio"] - 0.3, 745, 1330, { s: 0.85 });
        persona("s8-l", t, { x: 130, y: 1440, s: 0.76, mira: 1, vivo: true, charla: e, boca: habla(t, e, "seria"), brazo: [[0, "sujeta"], [c["c8-vende"], "piensa"]], fase: 1 });
        persona("s8-j", t, { x: 965, y: 1440, s: 0.76, mira: -1, vivo: true, boca: [[0, "seria"], [c["c8-menos"], "sonrisa"]], brazo: [[0, "abajo"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c8-menos"]]); } },

    // 9 · Javi: «Y aun así, me miro uno usado. Hoy, casi uno de cada cinco matriculados es usado traído de fuera. En 2016, uno de cada once.»
    { n: 9, set: "vacio",
      svg: `${mesa}${barras(9, [{ et: "2007", v: D.imp["2007"], col: ANTES_T }, { et: "2016", v: D.imp["2016"], col: GRIS19 }, { et: "2025", v: D.imp["2025"], col: HOY }], 1170, 64, 25, "USADOS DE FUERA, % DE LAS MATRICULACIONES", " %")}${cunados("s9")}`,
      tarjeta: tarjeta(9, "Usados traídos de fuera, % de las matriculaciones", `${vs(9, [es(D.imp["2016"]) + "&nbsp;%", es(D.imp["2025"]) + "&nbsp;%"], ["en 2016", "en 2025"])}
        <div class="nota">En 2007, ${es(D.imp["2007"])}&nbsp;%; en 2019, ${es(D.imp["2019"])}&nbsp;%. Coches usados de otros países que se matriculan por primera vez en España</div>`, { fuente: F_IMP, icono: bandera(44) }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("barBarrio", null, t, 0);
        vidaFondo("bb", t, { lamparas: 3, gente: 2, capa: "barBarrio", y: 1080, s: 0.42 });
        T("bb-c0", 600, 870, { s: 1 });
        T("bb-camion", 1000 - (t - e.t0) * 120, 880, { s: 1 });
        const tt = [c["c9-2016"] + 0.3, c["c9-2016"], c["c9-cinco"] - 0.2], vv = [D.imp["2007"], D.imp["2016"], D.imp["2025"]];
        for (let i = 0; i < 3; i++) { const k = suave(clamp((t - tt[i]) / 0.6)); attr(`s9-b${i}`, "width", (k * vv[i] / 25 * 290).toFixed(1)); css(`s9-v${i}`, "opacity", clamp((t - tt[i] - 0.4) / 0.3)); }
        sube("c9-b", t, c["c9-cinco"]); sube("c9-a", t, c["c9-2016"]);
        persona("s9-l", t, { x: 160, y: 1440, s: 0.78, mira: 1, vivo: true, boca: [[0, "seria"]], brazo: [[0, "abajo"]], fase: 1 });
        persona("s9-j", t, { x: 925, y: 1440, s: 0.78, mira: -1, vivo: true, charla: e, boca: habla(t, e, "seria"), brazo: [[0, "abajo"], [c["c9-usado"], "hombros"], [c["c9-cinco"], "abajo"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c9-cinco"], e.c["c9-2016"]], { acerca: 0.03 }); } },

    // 10 · Luis, a cámara: «En 2007 ya eran muchos, ¿eh? Hoy, más meses que en 2016, y lo más vendido, de lo más barato. ¿Tú qué te comprarías: nuevo barato o usado?»
    { n: 10, set: "vacio",
      svg: `${mesa}${cunados("s10")}`,
      tarjeta: tarjeta(10, "Te toca", `<div class="tit" style="font-size:54px">Más meses de sueldo que en 2016 y lo más vendido, de lo más barato. ¿<mark id="m10">Nuevo barato o usado</mark>?</div><div class="sub" id="c10-sub">Te leo en los comentarios.</div>`),
      fn: function (t, e) {
        const c = e.c;
        ambiente("barBarrio", null, t, 0);
        vidaFondo("bb", t, { lamparas: 3, gente: 2, capa: "barBarrio", y: 1080, s: 0.42 });
        T("bb-c0", 600, 870, { s: 1 }); T("bb-camion", 1400, 880, { s: 1 });
        marca("m10", t, c["c10-comprarias"]); sube("c10-sub", t, c["c10-usado"]);
        persona("s10-l", t, { x: 230, y: 1440, s: 0.82, mira: [[0, 1], [c["c10-comprarias"], 0]], vivo: true, charla: e, boca: habla(t, e, "sonrisa"),
          brazo: [[0, "sujeta"], [c["c10-hoy"], "arriba"], [c["c10-comprarias"], "senala"]], fase: 1 });
        persona("s10-j", t, { x: 900, y: 1440, s: 0.8, mira: [[0, -1], [c["c10-comprarias"], 0]], vivo: true, boca: [[0, "sonrisa"]], brazo: [[0, "sujeta"], [c["c10-hoy"], "arriba"], [c["c10-comprarias"], "sujeta"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c10-hoy"], e.c["c10-comprarias"]]); } },
  ];
}
