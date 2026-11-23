// Escenas de T18 v2 («El coche que más se compra en España es el más barato. ¿Y en Alemania?», coches B con dos cuñados).
// Bruno, 23-11-2026 (sobre la v1, «muy flojo»): marcas visibles, explicar el porqué del ranking (lo más vendido cuesta la mitad
// que el coche medio y aun así son muchos meses) y comparar con Alemania. Las marcas van en placas con su nombre (sin copiar
// logotipos); la causa («¿vamos justos?») es la pregunta final, no una conclusión del vídeo (regla 3).
//   · «luis»: unos 50, polo verde, canas (voz «padre»).   · «javi»: unos 45, camisa terracota (voz «maquinista»).
// Decorado: el bar de barrio de diseno/barcunados.mjs.
/* eslint-disable no-undef */

import { C, persona, tarjeta, selloOficial } from "../../diseno/limpio.mjs";
import { bandera } from "../../diseno/barrio.mjs";
import { ambientes } from "../../diseno/sueno.mjs";
import { coche } from "../../diseno/transporte.mjs";
import { DECORADOS_T18, podioMarcas, placa, banderaDE, banderaES, balanza, CANA_MANO, mesaAlta } from "../../diseno/barcunados.mjs";
import { etiqueta, calendario, hoja } from "../../diseno/carnet.mjs";

export const ESTILO = "limpio";
const F_TOP = "Dato oficial: DGT (coches nuevos matriculados)";
const F_PRE = "Cálculo propio · Agencia Tributaria";
const F_DE = "Cálculo propio · Agencia Tributaria · Eurostat";

export function datos(d) {
  return { san: d.sandero, bmw: d.bmw, medio: d.coche_nuevo_medio, mes: d.sueldo_neto_medio_mes_2025, mas: d.sueldo_aleman_mas_pct,
           caro: d.nivel_precios_vehiculos.alemania_mas_cara_pct, tiempo: d.coche_nuevo_medio_espana_meses_sueldo_medio };
}

export const capas = () => ambientes(DECORADOS_T18);

// ------------------------------------------------------------------ personajes (inventados), con volumen
const LUIS = { pelo: "corto", canas: true, barba: false, colorPelo: "#5A4A3E", ropa: ["#7C9A7E", "#647F66"], piel: "#EBC3A0", volumen: true };
const JAVI = { pelo: "corto", canas: false, barba: false, colorPelo: "#241A14", ropa: ["#C77B5B", "#A86347"], piel: "#D9A77E", piel2: "#C4916A", volumen: true };
const QUIEN = { l: LUIS, j: JAVI };
const gente = (n, quien, manos = {}) => quien.split("").map((k) => persona(`${n}-${k}`, "hoy", { ...QUIEN[k], mano: manos[k] ? `<g id="${n}-${k}-mano">${manos[k]}</g>` : undefined })).join("");
const cunados = (n) => gente(n, "lj", { l: CANA_MANO, j: CANA_MANO });

// ------------------------------------------------------------------ piezas
const ANTES_T = "#8A6316", HOY = "#B3261E", GRIS19 = "#6B7480";
const panel = (x, y, w, h) => `<rect x="${x + 8}" y="${y + 12}" width="${w}" height="${h}" rx="26" fill="#3C2814" opacity=".10"/><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="26" fill="#FFFDF8" opacity=".96"/>`;
const rot = (x, y, t, tam, color, id = "", ancla = "middle") => `<text ${id ? `id="${id}"` : ""} x="${x}" y="${y}" text-anchor="${ancla}" font-family="Cap" font-weight="800" font-size="${tam}" fill="${color}">${t}</text>`;
const miles = (v) => String(Math.round(v)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
const es = (v, d = 1) => v.toFixed(d).replace(".", ",");
const vs = (n, vals, labs, tam = 92) => `<div class="vs">${vals.map((v, i) => `<div class="col"><div class="v ${i ? "t-hoy" : "t-pasado"}" id="c${n}-${"ab"[i]}" style="font-size:${tam}px">${v}</div><div class="n">${labs[i]}</div></div>`).join("")}</div>`;
const cita = (n, quien, html) => tarjeta(n, quien, `<div class="tit" style="font-size:60px">${html}</div>`, { tono: "hoy" });
const mesa = `<g transform="translate(540 1440) scale(.9)">${mesaAlta("mesa")}</g>`;
const P16 = [{ marca: "SEAT", modelo: "LEÓN", col: "#C8902E", coche: "#5B6470", s: 0.5 }, { marca: "SEAT", modelo: "IBIZA", col: "#C8902E", coche: "#E0B04A", s: 0.44 }, { marca: "VOLKSWAGEN", modelo: "GOLF", col: "#5B6470", coche: "#9AA6AE", s: 0.5 }];
const P25 = [{ marca: "DACIA", modelo: "SANDERO", col: "#5E7F5A", coche: "#C9A0C2", s: 0.42 }, { marca: "RENAULT", modelo: "CLIO", col: "#D9A23B", coche: "#3E8E8A", s: 0.42 }, { marca: "MG", modelo: "ZS", col: "#8E5B4A", coche: "#D9A23B", s: 0.46 }];
// Calendario con banderita y número grande debajo (escenas 6, 8 y 10).
const cal = (id, x, y, s, titulo, valor, col, bandera = "") => `<g id="${id}" opacity="0"><g transform="translate(${x} ${y}) scale(${s})">${calendario(`${id}-c`)}</g>
  ${bandera ? `<g transform="translate(${x - 50} ${y - 150 * s - 70})">${bandera}</g>` : ""}${rot(x, y + 200 * s + 20, valor, 76, col)}${rot(x, y + 200 * s + 64, titulo, 26, C.gris)}</g>`;

export function escenas(D) {
  const ES_ = banderaES(100), DE_ = banderaDE(100);
  return [
    // 1 · Javi llega con las cañas: «¿Sabes qué coche es el que más se compra en España? El más barato, tío.»
    { n: 1, set: "vacio",
      svg: `${mesa}${cunados("s1")}${selloOficial("s1-sello")}`,
      tarjeta: tarjeta(1, "Coches · 2007, 2016 y hoy", `<div class="tit" style="font-size:62px">¿Cuál es el coche <mark id="m1">más vendido</mark> en España?</div>`, { icono: bandera(44) }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("barBarrio", null, t, 0);
        vidaFondo("bb", t, { lamparas: 3, gente: 2, capa: "barBarrio", y: 1080, s: 0.42 });
        T("bb-c0", 600, 870, { s: 1 }); T("bb-camion", 1400, 880, { s: 1 });
        marca("m1", t, c["c1-barato"]);
        selloAnim("s1-sello", t, c["c1-sello"], 300, 760, { s: 0.8, r: -9 });
        const w = ruta(t, [[0.1, 1250], [1.0, 880]]);
        persona("s1-j", t, { x: w.x, y: 1440, s: 0.8, anda: w.anda, mira: -1, vivo: true, charla: e, boca: habla(t, e, "sonrisa"), brazo: [[0, "sujeta"], [c["c1-barato"] - 0.2, "senala"]], espejo: true, fase: 2 });
        persona("s1-l", t, { x: 200, y: 1440, s: 0.8, mira: 1, vivo: true, boca: [[0, "sonrisa"], [c["c1-barato"], "o"]], ojos: [[0, "normal"], [c["c1-barato"], "grandes"]], brazo: [[0, "sujeta"]], fase: 1 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c1-barato"]]); } },

    // 2 · Luis: «¡Anda ya! Si en 2016 era el León.» Podio de 2016 con placas.
    { n: 2, set: "vacio",
      svg: `<g transform="translate(540 1350) scale(.68)">${podioMarcas("s2-po", P16)}</g>${cunados("s2")}`,
      tarjeta: tarjeta(2, "Los más vendidos en 2016", `<div class="tit" style="font-size:58px">León · Ibiza · Golf</div>`, { fuente: F_TOP, icono: bandera(44) }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("barBarrio", null, t, 0);
        vidaFondo("bb", t, { lamparas: 3, gente: 2, capa: "barBarrio", y: 1080, s: 0.42 });
        T("bb-c0", 600, 870, { s: 1 }); T("bb-camion", 1400, 880, { s: 1 });
        const tt = [c["c2-leon"] - 0.1, c["c2-leon"] + 0.25, c["c2-leon"] + 0.5];
        for (let i = 0; i < 3; i++) { const k = (t - tt[i]) / 0.4; if (k < 0) ver(`s2-po-k${i}`, false); else T(`s2-po-k${i}`, 0, -300 * Math.max(0, 1 - k) ** 2, { s: 1, op: clamp(k * 3) }); }
        persona("s2-l", t, { x: 110, y: 1440, s: 0.74, mira: 1, vivo: true, charla: e, boca: habla(t, e, "grande"), brazo: [[0, "abajo"], [c["c2-anda"], "arriba"], [c["c2-leon"], "abajo"]], fase: 1 });
        persona("s2-j", t, { x: 975, y: 1440, s: 0.74, mira: -1, vivo: true, boca: [[0, "sonrisa"]], brazo: [[0, "abajo"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c2-leon"]]); } },

    // 3 · Javi: «Pues hoy gana el Dacia Sandero. Y detrás, el Clio y el MG.» Podio de hoy.
    { n: 3, set: "vacio",
      svg: `<g transform="translate(540 1350) scale(.68)">${podioMarcas("s3-po", P25)}</g>${cunados("s3")}`,
      tarjeta: tarjeta(3, "Los más vendidos en 2025", `<div class="tit" style="font-size:58px">Sandero · Clio · MG ZS</div>`, { fuente: F_TOP, icono: bandera(44) }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("barBarrio", null, t, 0);
        vidaFondo("bb", t, { lamparas: 3, gente: 2, capa: "barBarrio", y: 1080, s: 0.42 });
        T("bb-c0", 600, 870, { s: 1 }); T("bb-camion", 1400, 880, { s: 1 });
        const tt = [c["c3-sandero"], c["c3-clio"], c["c3-mg"]];
        for (let i = 0; i < 3; i++) { const k = (t - tt[i] + 0.1) / 0.4; if (k < 0) ver(`s3-po-k${i}`, false); else T(`s3-po-k${i}`, 0, -300 * Math.max(0, 1 - k) ** 2, { s: 1, op: clamp(k * 3) }); }
        persona("s3-l", t, { x: 110, y: 1440, s: 0.74, mira: 1, vivo: true, boca: [[0, "sonrisa"], [c["c3-sandero"], "o"]], ojos: [[0, "normal"], [c["c3-sandero"], "grandes"]], brazo: [[0, "abajo"]], fase: 1 });
        persona("s3-j", t, { x: 975, y: 1440, s: 0.74, mira: -1, vivo: true, charla: e, boca: habla(t, e, "seria"), brazo: [[0, "abajo"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c3-sandero"]]); } },

    // 4 · Javi: «El Sandero, 15.752 euros. Y el coche nuevo medio, 31.555. ¡La mitad!»
    { n: 4, set: "vacio",
      svg: `<g id="s4-a"><g transform="scale(.42)">${coche("s4-ca", "#C9A0C2")}</g><g transform="translate(0 -170)">${placa("s4-pa", "DACIA", "SANDERO", "#5E7F5A", 230)}</g></g>
        <g id="s4-b"><g transform="scale(.66)">${coche("s4-cb", "#5B6470")}</g><g transform="translate(0 -230)"><rect x="-150" y="-40" width="300" height="80" rx="16" fill="#FFFDF8" stroke="${HOY}" stroke-width="7"/>${rot(0, 14, "COCHE MEDIO", 38, HOY)}</g></g>
        ${cunados("s4")}`,
      tarjeta: tarjeta(4, "Precio medio con IVA (2025)", vs(4, [miles(D.san.precio_es) + "&nbsp;€", miles(D.medio.precio_es) + "&nbsp;€"], ["Dacia Sandero", "coche nuevo medio"], 76), { fuente: F_PRE, icono: bandera(44) }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("barBarrio", null, t, 0);
        vidaFondo("bb", t, { lamparas: 3, gente: 2, capa: "barBarrio", y: 1080, s: 0.42 });
        T("bb-c0", 600, 870, { s: 1 }); T("bb-camion", 1400, 880, { s: 1 });
        pop("s4-a", t, c["c4-sandero"] - 0.1, 350, 1320, { s: 1.25 });
        pop("s4-b", t, c["c4-medio"] - 0.1, 730, 1330, { s: 1.05 });
        const km = t - c["c4-mitad"]; if (km > 0 && km < 0.6) T("s4-a", 350, 1320 - 30 * Math.sin(km / 0.6 * Math.PI), { s: 1.25 + 0.15 * Math.sin(km / 0.6 * Math.PI) });
        sube("c4-a", t, c["c4-sandero"]); sube("c4-b", t, c["c4-medio"]);
        persona("s4-l", t, { x: 80, y: 1440, s: 0.7, mira: 1, vivo: true, boca: [[0, "sonrisa"], [c["c4-mitad"], "o"]], ojos: [[0, "normal"], [c["c4-mitad"], "grandes"]], brazo: [[0, "abajo"]], fase: 1 });
        persona("s4-j", t, { x: 1000, y: 1440, s: 0.7, mira: -1, vivo: true, charla: e, boca: habla(t, e, "grande"), brazo: [[0, "abajo"], [c["c4-mitad"] - 0.2, "arriba"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c4-sandero"], e.c["c4-mitad"]]); } },

    // 5 · Luis, con sorna: «Hombre, pues barato, ¿no?»
    { n: 5, set: "vacio",
      svg: `${mesa}${cunados("s5")}`,
      tarjeta: cita(5, "Luis", `«Pues <mark id="m5">barato</mark>, ¿no?»`),
      fn: function (t, e) {
        const c = e.c;
        ambiente("barBarrio", null, t, 0);
        vidaFondo("bb", t, { lamparas: 3, gente: 2, capa: "barBarrio", y: 1080, s: 0.42 });
        T("bb-c0", 600, 870, { s: 1 }); T("bb-camion", 1400, 880, { s: 1 });
        marca("m5", t, c["c5-barato"]);
        persona("s5-l", t, { x: 210, y: 1440, s: 0.8, mira: 1, vivo: true, charla: e, boca: habla(t, e, "sonrisa"), brazo: [[0, "sujeta"], [c["c5-barato"] - 0.2, "hombros"]], incl: [[0, 0], [c["c5-barato"], -6]], fase: 1 });
        persona("s5-j", t, { x: 900, y: 1440, s: 0.8, mira: -1, vivo: true, boca: [[0, "seria"]], brazo: [[0, "sujeta"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c5-barato"]]); } },

    // 6 · Javi: «¿Barato? Siete meses de sueldo enterito.»
    { n: 6, set: "vacio",
      svg: `${panel(250, 780, 580, 520)}${cal("s6-k", 540, 950, 0.66, "MESES DE SUELDO", es(D.san.meses_es), HOY)}
        ${Array.from({ length: 7 }, (_, k) => hoja(`s6-hj${k}`)).join("")}${cunados("s6")}`,
      tarjeta: tarjeta(6, "Dacia Sandero, con el sueldo neto medio", `<div class="tit" style="font-size:96px;color:${HOY};line-height:1" id="c6-a">${es(D.san.meses_es)} meses</div>
        <div class="nota">Sueldo neto medio (Eurostat): ${miles(D.mes.ES)}&nbsp;€ al mes</div>`, { fuente: F_DE, icono: bandera(44) }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("barBarrio", null, t, 0);
        vidaFondo("bb", t, { lamparas: 3, gente: 2, capa: "barBarrio", y: 1080, s: 0.42 });
        T("bb-c0", 600, 870, { s: 1 }); T("bb-camion", 1400, 880, { s: 1 });
        css("s6-k", "opacity", clamp((t - c["c6-barato"]) / 0.3)); txt("s6-k-c-m", "SANDERO");
        const t0 = c["c6-siete"] - 0.2, t1 = c["c6-enterito"] + 0.2;
        for (let k = 0; k < 7; k++) { const tk = t0 + (t1 - t0) * k / 7; if (t < tk) { ver(`s6-hj${k}`, false); continue; } cae(`s6-hj${k}`, t, tk, 330 + ((k * 137) % 420), 1385 + (k % 3) * 14, { alto: 520, r0: 40 + k * 9, s: 0.5, r: (k % 2 ? 1 : -1) * (6 + k % 5) }); }
        sube("c6-a", t, c["c6-siete"]);
        persona("s6-l", t, { x: 150, y: 1440, s: 0.78, mira: 1, vivo: true, boca: [[0, "sonrisa"], [c["c6-siete"], "o"]], brazo: [[0, "abajo"]], fase: 1 });
        persona("s6-j", t, { x: 935, y: 1440, s: 0.78, mira: -1, vivo: true, charla: e, boca: habla(t, e, "seria"), brazo: [[0, "abajo"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c6-siete"]]); } },

    // 7 · Luis: «¿Y en Alemania, listo?»
    { n: 7, set: "vacio",
      svg: `${mesa}<g id="s7-de"><g transform="translate(-90 -54) scale(1.8)">${banderaDE(100)}</g></g>${cunados("s7")}`,
      tarjeta: cita(7, "Luis", `«¿Y en <mark id="m7">Alemania</mark>, listo?»`),
      fn: function (t, e) {
        const c = e.c;
        ambiente("barBarrio", null, t, 0);
        vidaFondo("bb", t, { lamparas: 3, gente: 2, capa: "barBarrio", y: 1080, s: 0.42 });
        T("bb-c0", 600, 870, { s: 1 }); T("bb-camion", 1400, 880, { s: 1 });
        marca("m7", t, c["c7-alemania"]);
        pop("s7-de", t, c["c7-alemania"] - 0.1, 540, 960, { s: 1, r: -4 });
        persona("s7-l", t, { x: 210, y: 1440, s: 0.8, mira: 1, vivo: true, charla: e, boca: habla(t, e, "seria"), brazo: [[0, "sujeta"], [c["c7-alemania"] - 0.2, "senala"]], fase: 1 });
        persona("s7-j", t, { x: 900, y: 1440, s: 0.8, mira: -1, vivo: true, boca: [[0, "seria"], [c["c7-listo"], "sonrisa"]], brazo: [[0, "sujeta"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c7-alemania"]]); } },

    // 8 · Javi: «Allí cobran un 35 % más. El mismo Sandero, cinco meses y medio.»
    { n: 8, set: "vacio",
      svg: `${panel(200, 760, 680, 560)}${cal("s8-e", 380, 980, 0.42, "ESPAÑA", es(D.san.meses_es), HOY, ES_)}${cal("s8-d", 700, 980, 0.42, "ALEMANIA", es(D.san.meses_de), GRIS19, DE_)}
        ${rot(540, 1290, "DACIA SANDERO · MESES DE SUELDO", 24, C.gris)}${cunados("s8")}`,
      tarjeta: tarjeta(8, "Dacia Sandero, meses de sueldo neto medio", `${vs(8, [es(D.san.meses_es), es(D.san.meses_de)], ["España", "Alemania"])}
        <div class="nota">Allí se cobra un ${Math.round(D.mas)}&nbsp;% más (${miles(D.mes.ES)}&nbsp;€ y ${miles(D.mes.DE)}&nbsp;€ al mes) y los coches cuestan un ${es(D.caro)}&nbsp;% más</div>`, { fuente: F_DE, icono: bandera(44) }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("barBarrio", null, t, 0);
        vidaFondo("bb", t, { lamparas: 3, gente: 2, capa: "barBarrio", y: 1080, s: 0.42 });
        T("bb-c0", 600, 870, { s: 1 }); T("bb-camion", 1400, 880, { s: 1 });
        css("s8-e", "opacity", clamp((t - e.t0 - 0.2) / 0.3)); css("s8-d", "opacity", clamp((t - c["c8-sandero"]) / 0.3));
        txt("s8-e-c-m", "ESPAÑA"); txt("s8-d-c-m", "ALEMANIA");
        sube("c8-a", t, e.t0 + 0.3); sube("c8-b", t, c["c8-cinco"]);
        persona("s8-l", t, { x: 130, y: 1440, s: 0.76, mira: 1, vivo: true, boca: [[0, "seria"], [c["c8-cinco"], "o"]], brazo: [[0, "abajo"]], fase: 1 });
        persona("s8-j", t, { x: 955, y: 1440, s: 0.76, mira: -1, vivo: true, charla: e, boca: habla(t, e, "seria"), brazo: [[0, "abajo"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c8-35"], e.c["c8-cinco"]], { acerca: 0.03 }); } },

    // 9 · Javi: «Y un BMW X1, catorce meses: lo que aquí te cuesta un coche normalito.» Balanza igualada.
    { n: 9, set: "vacio",
      svg: `<g transform="translate(540 1330)">${balanza("s9-bz")}</g>
        <g id="s9-i"><g transform="scale(.36)">${coche("s9-ci", "#1E3A44")}</g><g transform="translate(0 -150)">${placa("s9-pi", "BMW", "X1", "#3B4A57", 180)}</g><g transform="translate(-50 -290)">${banderaDE(100)}</g></g>
        <g id="s9-d"><g transform="scale(.36)">${coche("s9-cd", "#9AA6AE")}</g><g transform="translate(0 -150)"><rect x="-120" y="-40" width="240" height="80" rx="16" fill="#FFFDF8" stroke="${HOY}" stroke-width="7"/>${rot(0, 12, "COCHE MEDIO", 30, HOY)}</g><g transform="translate(-50 -290)">${banderaES(100)}</g></g>
        ${cunados("s9")}`,
      tarjeta: tarjeta(9, "Meses de sueldo neto medio", `${vs(9, [es(D.bmw.meses_de), es(D.medio.meses_es)], ["BMW X1 en Alemania", "coche medio en España"])}
        <div class="nota">BMW X1: ${miles(D.bmw.precio_es)}&nbsp;€ con IVA en España</div>`, { fuente: F_DE, icono: bandera(44) }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("barBarrio", null, t, 0);
        vidaFondo("bb", t, { lamparas: 3, gente: 2, capa: "barBarrio", y: 1080, s: 0.42 });
        T("bb-c0", 600, 870, { s: 1 }); T("bb-camion", 1400, 880, { s: 1 });
        // la balanza oscila y se queda igualada cuando sale el coche normal
        const k = clamp((t - c["c9-normalito"] + 0.3) / 1.2), ang = (1 - k) * 9 * Math.cos((t - e.t0) * 5) * (t > c["c9-bmw"] ? 1 : 0);
        attr("s9-bz-b", "transform", `rotate(${ang.toFixed(2)} 0 -306)`);
        const dy = 250 * Math.sin(ang * Math.PI / 180);
        T("s9-i", 540 - 250, 1330 - 306 - 10 + dy, { s: 1, op: clamp((t - c["c9-bmw"] + 0.2) / 0.3) });
        T("s9-d", 540 + 250, 1330 - 306 - 10 - dy, { s: 1, op: clamp((t - c["c9-normalito"] + 0.4) / 0.3) });
        sube("c9-a", t, c["c9-catorce"]); sube("c9-b", t, c["c9-normalito"]);
        persona("s9-l", t, { x: 80, y: 1440, s: 0.68, mira: 1, vivo: true, boca: [[0, "seria"], [c["c9-normalito"], "o"]], ojos: [[0, "normal"], [c["c9-normalito"], "grandes"]], brazo: [[0, "abajo"]], fase: 1 });
        persona("s9-j", t, { x: 1000, y: 1440, s: 0.68, mira: -1, vivo: true, charla: e, boca: habla(t, e, "seria"), brazo: [[0, "abajo"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c9-bmw"], e.c["c9-normalito"]]); } },

    // 10 · Javi: «Y aquí, el coche normal: en 2016, doce meses. Hoy, catorce. En 2007, quince.»
    { n: 10, set: "vacio",
      svg: `${panel(170, 780, 740, 520)}${[["s10-a", 320, "2007", D.tiempo["2007"], GRIS19], ["s10-b", 540, "2016", D.tiempo["2016"], ANTES_T], ["s10-c", 760, "HOY", D.tiempo["2025"], HOY]].map(([id, x, a, v, col]) => cal(id, x, 960, 0.36, a, es(v), col)).join("")}
        ${rot(540, 1270, "COCHE NUEVO MEDIO EN ESPAÑA · MESES DE SUELDO", 22, C.gris)}${cunados("s10")}`,
      tarjeta: tarjeta(10, "Coche nuevo medio en España, meses de sueldo", `${vs(10, [es(D.tiempo["2016"]), es(D.tiempo["2025"])], ["en 2016", "hoy"])}
        <div class="nota">En 2007, ${es(D.tiempo["2007"])}. Sueldo neto medio (Eurostat)</div>`, { fuente: F_DE, icono: bandera(44) }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("barBarrio", null, t, 0);
        vidaFondo("bb", t, { lamparas: 3, gente: 2, capa: "barBarrio", y: 1080, s: 0.42 });
        T("bb-c0", 600, 870, { s: 1 }); T("bb-camion", 1400, 880, { s: 1 });
        txt("s10-a-c-m", "2007"); txt("s10-b-c-m", "2016"); txt("s10-c-c-m", "HOY");
        css("s10-b", "opacity", clamp((t - c["c10-2016"]) / 0.3)); css("s10-c", "opacity", clamp((t - c["c10-catorce"] + 0.2) / 0.3)); css("s10-a", "opacity", clamp((t - c["c10-2007"]) / 0.3));
        sube("c10-a", t, c["c10-doce"]); sube("c10-b", t, c["c10-catorce"]);
        persona("s10-l", t, { x: 110, y: 1440, s: 0.74, mira: 1, vivo: true, boca: [[0, "seria"]], brazo: [[0, "abajo"]], fase: 1 });
        persona("s10-j", t, { x: 975, y: 1440, s: 0.74, mira: -1, vivo: true, charla: e, boca: habla(t, e, "seria"), brazo: [[0, "abajo"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c10-2016"], e.c["c10-catorce"]], { acerca: 0.03 }); } },

    // 11 · Luis, a cámara: «O sea, que con lo que aquí pagas un coche normal, allí se compran un BMW. ¿Vamos justos o somos más apañados?»
    { n: 11, set: "vacio",
      svg: `${mesa}${cunados("s11")}`,
      tarjeta: tarjeta(11, "Te toca", `<div class="tit" style="font-size:54px">Peor que en 2016 y que en Alemania; algo mejor que en 2007. ¿Vamos <mark id="m11">justos</mark> o somos más apañados?</div><div class="sub" id="c11-sub">Te leo en los comentarios.</div>`),
      fn: function (t, e) {
        const c = e.c;
        ambiente("barBarrio", null, t, 0);
        vidaFondo("bb", t, { lamparas: 3, gente: 2, capa: "barBarrio", y: 1080, s: 0.42 });
        T("bb-c0", 600, 870, { s: 1 }); T("bb-camion", 1400, 880, { s: 1 });
        marca("m11", t, c["c11-justos"]); sube("c11-sub", t, c["c11-apanados"]);
        persona("s11-l", t, { x: 230, y: 1440, s: 0.82, mira: [[0, 1], [c["c11-vamos"], 0]], vivo: true, charla: e, boca: habla(t, e, "sonrisa"),
          brazo: [[0, "sujeta"], [c["c11-bmw"], "arriba"], [c["c11-vamos"], "senala"]], fase: 1 });
        persona("s11-j", t, { x: 900, y: 1440, s: 0.8, mira: [[0, -1], [c["c11-vamos"], 0]], vivo: true, boca: [[0, "sonrisa"]], brazo: [[0, "sujeta"], [c["c11-bmw"], "arriba"], [c["c11-vamos"], "sujeta"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c11-bmw"], e.c["c11-vamos"]]); } },
  ];
}
