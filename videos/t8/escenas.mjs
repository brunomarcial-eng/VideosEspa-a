// Escenas de T8, versión 2 (padre contra hijo, 6.ª parte: «¿Cuánto de tu sueldo se queda el Estado?») en estilo «limpio».
// Decorados como en un sueño: cocina → banco → pasillo del súper → gasolinera → cocina. Con el mismo sueldo, hoy queda menos.
// Como en T7, los personajes andan, empujan el carro, echan gasolina y gesticulan; cada dato tiene su dibujo
// (fajos de billetes, billetes partidos, etiquetas de IVA que cambian, barras y gotas de IVA).
/* eslint-disable no-undef */

import { C, persona, bocadillo, tarjeta, carro, nomina, PRODUCTOS } from "../../diseno/limpio.mjs";
import { bandera } from "../../diseno/barrio.mjs";
import { billete } from "../../diseno/casa.mjs";
import { ambientes, moneda } from "../../diseno/sueno.mjs";
import { DECORADOS_T8, CAMISETA, FILETE, gota, barraBillete } from "../../diseno/tiendas.mjs";

export const ESTILO = "limpio";
const F_COT = "Cálculo propio con las normas del BOE de cada año (cotizaciones e IRPF; Madrid en 2026)";
const F_MED = "Cálculo propio con las normas del BOE de cada año (Madrid en 2026) · INE: sueldo medio e IPC";
const F_IVA = "Dato oficial: BOE (leyes del IVA de 1985 y de 1992)";
const F_GAS = "Dato oficial: Comisión Europea, boletín petrolero (media de cada año) · impuestos de la ley · cálculo propio con el IPC del INE";

export function datos(d) {
  const c = d.casos, iva = d.iva_pct, m = d.sueldo_medio, g = d.carburante;
  const anyos = ["1986", "2006", "2026"], ag = ["2006", "2016", "2026"];
  return {
    bancaEstado: anyos.map((y) => c.banca[y].pct_estado_del_coste),
    menos: c.banca["1986"].en_euros_de_2026.neto - c.banca["2026"].en_euros_de_2026.neto,
    bancaBruto: [c.banca["1986"].bruto, c.banca["2006"].bruto, c.banca["2026"].bruto],
    medioNeto: anyos.map((y) => m[y].neto_en_euros_de_2026), medioMenos: [m.menos_que_1986, m.menos_que_2006], medioBruto: m.bruto_en_euros_de_2026,
    ivaCarne: anyos.map((y) => iva.resto_de_la_comida_carne_pescado[y]), ivaRopa: anyos.map((y) => iva.ropa_y_calzado[y]),
    gasoleo: ag.map((y) => g.gasoleo[y].en_euros_de_2026.precio), gasolina: ag.map((y) => g.gasolina95[y].en_euros_de_2026.precio),
    ivaLitro: ag.map((y) => g.gasoleo[y].en_euros_de_2026.iva_por_litro), ivaPct: ag.map((y) => g.gasoleo[y].iva_pct),
  };
}

export const capas = () => ambientes(DECORADOS_T8);

// ------------------------------------------------------------------ personajes (los de T3 a T7)
const PADRE = { pelo: "corto", canas: true, barba: false, bigote: true, colorPelo: "#6F6A62", colorBigote: "#5E5952", ropa: ["#8C6F5A", "#6E5444"], piel: "#EDBE96" };
const HIJO = { pelo: "corto", canas: false, barba: false, colorPelo: "#3B2A20", ropa: ["#6F8FA6", "#56738A"], piel: "#F1C9A5" };
const dos = (p, mp = "", mh = "") => `${persona(p + "-padre", "hoy", { ...PADRE, mano: mp ? `<g id="${p}-mp">${mp}</g>` : undefined })}${persona(p + "-hijo", "hoy", { ...HIJO, mano: mh ? `<g id="${p}-mh">${mh}</g>` : undefined })}`;
const vs3 = (n, vals, labs, tonos = ["t-pasado", "t-pasado", "t-hoy"], tam = 72) => `<div class="vs">${vals.map((v, i) => `<div class="col"><div class="v ${tonos[i]}" id="c${n}-${"abc"[i]}" style="font-size:${tam}px">${v}</div><div class="n">${labs[i]}</div></div>`).join("")}</div>`;
const panel = (x, y, w, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="26" fill="#FFFDF8" opacity=".95"/>`;
const rot = (x, y, t, tam, color, id = "", ancla = "middle") => `<text ${id ? `id="${id}"` : ""} x="${x}" y="${y}" text-anchor="${ancla}" font-family="Cap" font-weight="800" font-size="${tam}" fill="${color}">${t}</text>`;
const boton2 = (id, et, color, w) => `<g id="${id}"><rect x="${-w / 2}" y="-48" width="${w}" height="96" rx="48" fill="${color}"/><rect x="${-w / 2}" y="-48" width="${w}" height="96" rx="48" fill="none" stroke="#FFFFFF" stroke-width="6" opacity=".6"/>${rot(0, 16, et, 42, "#FFFDF8")}</g>`;
// Etiqueta de IVA con el número cambiable (texto «<id>-t»).
const etiquetaIva = (id, texto, color = C.rojo, tam = 44) => `<g id="${id}"><line x1="0" y1="-50" x2="0" y2="-4" stroke="${C.gris}" stroke-width="4"/>
  <path d="M-80 0 H60 L92 40 L60 80 H-80 Q-94 80 -94 66 V14 Q-94 0 -80 0 Z" fill="${color}"/><circle cx="66" cy="40" r="8" fill="#FFFDF8"/>
  ${rot(-14, 40 + tam * 0.4, texto, tam, "#FFFDF8", id + "-t")}</g>`;
const MANGUERA = `<g transform="rotate(20)"><rect x="-8" y="-6" width="16" height="44" rx="6" fill="${C.tinta}"/><path d="M0 -6 L28 -28" stroke="${C.tinta}" stroke-width="10" stroke-linecap="round"/></g>`;
const NOMINA_MANO = `<g transform="translate(10 -50) scale(.6)">${nomina("nm")}</g>`;

export function escenas(D) {
  const es = (v, d = 1) => v.toFixed(d).replace(".", ",");
  const r = (v) => Math.round(v);
  const miles = (v) => Math.round(v).toLocaleString("es-ES").replace(/,/g, ".");
  const Y = ["1986", "2006", "2026"], YG = ["2006", "2016", "2026"];
  // Tres billetes partidos (barras de 100 €) con la parte del Estado en gris.
  const billetes = (p, vals, valores = true, y0 = 770) => `${panel(300, y0, 480, 330)}${vals.map((v, i) => `
    ${rot(318, y0 + 70 + i * 100, Y[i], 30, C.gris, "", "start")}<g transform="translate(420 ${y0 + 60 + i * 100}) scale(.66)">${barraBillete(`${p}-b${i}`, 420)}${rot(10, 12, "ESTADO", 26, "#FFFDF8", "", "start")}</g>
    ${valores ? `<g id="${p}-v${i}">${rot(768, y0 + 72 + i * 100, r(v), 40, i === 2 ? C.azul : "#8A6316", "", "end")}</g>` : ""}`).join("")}
    ${rot(540, y0 + 315, "AL ESTADO, DE CADA 100 €", 26, C.gris)}`;
  return [
    // 1 · Padre (cocina): «¡Menuda nómina! En mis tiempos Hacienda no te sangraba así.»
    { n: 1, set: "vacio",
      svg: `<g id="s1-nom"><g transform="scale(1.6)">${nomina("s1-n")}</g><g id="s1-sello" transform="rotate(-14)"><rect x="-135" y="-40" width="270" height="80" rx="12" fill="none" stroke="${C.rojo}" stroke-width="10"/>${rot(0, 14, "RETENCIONES", 30, C.rojo)}</g></g>${dos("s1", NOMINA_MANO)}`,
      tarjeta: tarjeta(1, "Padre contra hijo · Sexta parte", `<div class="tit" style="font-size:66px">¿Cuánto de tu <mark id="m1">sueldo</mark> se queda el Estado?</div>`, { icono: bandera(44) }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("cocina", null, t, 0);
        const p = ruta(t, [[0.2, 140], [1.2, 300]]);
        ver("s1-mp", t < c["c1-nomina"]);
        pop("s1-nom", t, c["c1-nomina"], 560, 900, { s: 0.95, r: 4 * Math.sin(t * 3) });
        const ks = (t - c["c1-hacienda"]) / 0.25;
        if (ks < 0) ver("s1-sello", false); else { ver("s1-sello", true); attr("s1-sello", "transform", `rotate(-14) scale(${(1.8 - 0.8 * Math.min(1, ks)).toFixed(2)})`); }
        marca("m1", t, c["c1-sangraba"]);
        persona("s1-padre", t, { x: p.x, y: 1440, s: 0.78, anda: p.anda, mira: 1, boca: habla(t, e, "seria"),
          brazo: t < c["c1-nomina"] ? (Math.floor(t * 3) % 2 ? "arriba" : "senala") : [[0, "senala"], [c["c1-sangraba"], "hombros"]], incl: [[0, 0], [c["c1-sangraba"], -6]], fase: 1 });
        persona("s1-hijo", t, { x: 880, y: 1440, s: 0.78, mira: -1, boca: [[0, "sonrisa"], [c["c1-sangraba"], "o"]], ojos: [[0, "normal"], [c["c1-sangraba"], "grandes"]], brazo: [[0, "abajo"], [c["c1-sangraba"] + 0.3, "hombros"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return { z: 1, fx: 540 + 30 * Math.sin(t * 0.7) }; } },

    // 2 · Hijo (cocina): «Pues tienes razón: con el mismo sueldo, hoy me quedan 625 € menos al año que en 2006, y 405 menos que en 1986.»
    { n: 2, set: "vacio",
      svg: `${panel(300, 830, 480, 380)}${D.medioNeto.map((v, i) => `<g transform="translate(${390 + i * 150} 1120)">${Array.from({ length: Math.round(v / 1500) }, (_, k) => `<g id="s2-f${i}-${k}" transform="translate(0 ${-k * 14}) scale(.62)">${billete("s2-bb" + i + k)}</g>`).join("")}
        <g id="s2-v${i}">${rot(0, -Math.round(v / 1500) * 14 - 40, miles(v) + " €", 26, i === 2 ? C.azul : "#8A6316")}</g>${rot(0, 58, Y[i], 30, C.gris)}</g>`).join("")}
        <g id="s2-vuela"><g transform="scale(.62)">${billete("s2-bv")}</g></g>
        <g id="s2-l1">${rot(0, 0, "−" + miles(D.medioMenos[1]) + " € frente a 2006", 34, C.rojo)}</g><g id="s2-l2">${rot(0, 0, "−" + miles(D.medioMenos[0]) + " € frente a 1986", 30, C.rojo)}</g>${dos("s2")}`,
      tarjeta: tarjeta(2, "Lo que te queda limpio al año, en euros de hoy", `${vs3(2, D.medioNeto.map((v) => miles(v) + "&nbsp;€"), ["en 1986", "en 2006", "en 2026"], undefined, 58)}
        <div class="nota">Con el sueldo medio de hoy: ${miles(D.medioBruto)} € brutos (INE). Hoy, ${miles(D.medioMenos[1])} € menos que en 2006 y ${miles(D.medioMenos[0])} menos que en 1986</div>`, { fuente: F_MED, icono: bandera(44) }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("cocina", null, t, 0);
        const tt = [c["c2-sueldo"], c["c2-sueldo"] + 0.45, c["c2-sueldo"] + 0.9];
        for (let i = 0; i < 3; i++) {
          const n = Math.round(D.medioNeto[i] / 1500);
          for (let k = 0; k < n; k++) {
            const t0 = tt[i] + k * 0.04, kk = (t - t0) / 0.22;
            if (kk < 0) { ver(`s2-f${i}-${k}`, false); continue; }
            ver(`s2-f${i}-${k}`, true);
            attr(`s2-f${i}-${k}`, "transform", `translate(0 ${(-k * 14 - 110 * (1 - fuera(kk))).toFixed(1)}) scale(.62)`);
          }
          css(`s2-v${i}`, "opacity", clamp((t - tt[i] - n * 0.04) / 0.3));
        }
        sube("c2-a", t, tt[0]); sube("c2-b", t, tt[1]); sube("c2-c", t, tt[2]);
        // Del fajo de hoy se escapa un billete.
        const kb = t - c["c2-625"], top = 1120 - Math.round(D.medioNeto[2] / 1500) * 14;
        if (kb < 0) ver("s2-vuela", false);
        else { ver("s2-vuela", true); T("s2-vuela", 690 + 330 * Math.min(1, kb / 1.1), top - 150 * Math.sin(Math.min(1, kb / 1.1) * Math.PI) + 40 * kb, { r: kb * 260, op: 1 - clamp((kb - 0.9) / 0.4) }); }
        if (kb < 0) ver("s2-l1", false); else T("s2-l1", 540, 1250, { op: clamp(kb / 0.3) });
        const k2 = t - c["c2-405"];
        if (k2 < 0) ver("s2-l2", false); else T("s2-l2", 540, 1300, { op: clamp(k2 / 0.3) });
        persona("s2-padre", t, { x: 210, y: 1440, s: 0.78, mira: 1, boca: [[0, "seria"], [c["c2-razon"], "sonrisa"]], ojos: [[0, "normal"], [c["c2-razon"], "felices"]],
          brazo: [[0, "abajo"], [c["c2-razon"], "hombros"], [c["c2-625"] + 0.4, "senala"]], incl: t > c["c2-razon"] ? 6 * Math.sin((t - c["c2-razon"]) * 8) * Math.exp(-(t - c["c2-razon"]) * 2) : 0, fase: 1 });
        persona("s2-hijo", t, { x: 880, y: 1440, s: 0.78, mira: -1, boca: habla(t, e), brazo: [[0, "abajo"], [c["c2-razon"] - 0.2, "hombros"], [c["c2-sueldo"], "senala"]], espejo: true, fase: 2 });
      } },

    // 3 · Padre (banco): «¿Y uno de banca, que gana bien?»
    { n: 3, set: "vacio",
      svg: `${dos("s3")}`,
      tarjeta: tarjeta(3, "Padre", `<div class="tit">«¿Y uno de <mark id="m3">banca</mark>?»</div>`, { tono: "pasado" }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("banco", "cocina", t, e.t0);
        const p = ruta(t, [[e.t0 + 0.1, 100], [e.t0 + 1.0, 260]]);
        const h = ruta(t, [[e.t0 + 0.2, 1080], [e.t0 + 1.1, 880]]);
        marca("m3", t, c["c3-banca"]);
        persona("s3-padre", t, { x: p.x, y: 1440, s: 0.78, anda: p.anda, mira: 1, boca: habla(t, e, "sonrisa"), brazo: [[0, "abajo"], [c["c3-banca"] - 0.1, "piensa"]], incl: [[0, 0], [c["c3-banca"], -6]], fase: 1 });
        persona("s3-hijo", t, { x: h.x, y: 1440, s: 0.78, anda: h.anda, mira: -1, boca: "sonrisa", espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camSueno(t, e.t0); } },

    // 4 · Hijo (banco): «Con 40.000 € de hoy, el Estado se quedaba 40 de cada 100 en 1986. Hoy, 43: 960 € menos en su bolsillo.»
    { n: 4, set: "vacio",
      svg: `${billetes("s4", D.bancaEstado, true, 840)}<g id="s4-mon">${moneda("s4-m")}</g><g id="s4-menos">${rot(0, 0, "−" + r(D.menos) + " € al año", 40, C.rojo)}</g>${dos("s4")}`,
      tarjeta: tarjeta(4, "Empleado de banca · al Estado, de cada 100 € que cuesta", `${vs3(4, D.bancaEstado.map(r), ["en 1986", "en 2006", "en 2026"])}
        <div class="nota">Gana ${miles(D.bancaBruto[2])} € brutos de hoy (con el IPC: ${miles(D.bancaBruto[0])} pesetas en 1986 y ${miles(D.bancaBruto[1])} € en 2006). En euros de hoy le llegan ${r(D.menos)} € menos que en 1986</div>`, { fuente: F_COT, icono: bandera(44) }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("banco", null, t, 0);
        const tt = [c["c4-40"], c["c4-40"] + 0.8, c["c4-43"]];
        for (let i = 0; i < 3; i++) {
          const k = suave((t - tt[i]) / 0.7);
          attr(`s4-b${i}-e`, "width", (420 * D.bancaEstado[i] / 100 * k).toFixed(1));
          css(`s4-v${i}`, "opacity", clamp((t - tt[i] - 0.3) / 0.3));
        }
        sube("c4-a", t, tt[0]); sube("c4-b", t, tt[1]); sube("c4-c", t, tt[2]);
        // Una moneda se le escapa del bolsillo y rueda por el suelo.
        const km = t - c["c4-960"];
        if (km < 0) { ver("s4-mon", false); ver("s4-menos", false); }
        else {
          const x = 840 - 380 * Math.min(1, km / 1.4), y = km < 0.4 ? 1230 + 170 * (km / 0.4) ** 2 : 1400 - Math.abs(Math.sin((km - 0.4) * 7)) * 40 * Math.exp(-(km - 0.4) * 2);
          T("s4-mon", x, y, { s: 0.55, r: -km * 500 }); T("s4-menos", 540, 1240, { op: clamp(km / 0.3) });
        }
        persona("s4-padre", t, { x: 175, y: 1440, s: 0.78, mira: 1, boca: [[0, "seria"], [c["c4-960"], "o"]], ojos: [[0, "normal"], [c["c4-960"], "grandes"]], brazo: [[0, "piensa"], [c["c4-43"], "abajo"]], fase: 1 });
        persona("s4-hijo", t, { x: 880, y: 1440, s: 0.78, mira: -1, boca: habla(t, e), brazo: [[0, "abajo"], [c["c4-40"] - 0.2, "senala"], [c["c4-960"], "hombros"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { const k = t - e.c["c4-43"], g = k >= 0 && k < 0.18; return { z: 1, dx: 0, dy: g ? azar(5, Math.floor(t * 30)) * 7 : 0 }; } },

    // 5 · Padre (pasillo del súper, con el carro): «¡Y luego vas a la compra y otra vez a pagar!»
    { n: 5, set: "vacio",
      svg: `<g id="s5-carro">${carro("s5-c")}</g>${dos("s5")}`,
      tarjeta: tarjeta(5, "Padre", `<div class="tit">«¡Y luego, <mark id="m5">la compra</mark>!»</div>`, { tono: "pasado" }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("super", "banco", t, e.t0);
        // Empuja el carro por el pasillo.
        const p = ruta(t, [[e.t0 + 0.1, -60], [c["c5-pagar"], 300]]);
        T("s5-carro", p.x + 200, 1452, { s: 0.75 });
        marca("m5", t, c["c5-compra"]);
        persona("s5-padre", t, { x: p.x, y: 1440, s: 0.78, anda: p.anda, mira: 1, boca: habla(t, e, "seria"), brazo: [[0, "empuja"], [c["c5-pagar"] + 0.1, "arriba"]], fase: 1 });
        const h = ruta(t, [[e.t0 + 0.4, 1100], [e.t0 + 1.4, 880]]);
        persona("s5-hijo", t, { x: h.x, y: 1440, s: 0.78, anda: h.anda, mira: -1, boca: "sonrisa", espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camSueno(t, e.t0); } },

    // 6 · Hijo (súper): «La carne y el pescado pagaban un 6 % de IVA en 1986. Hoy, un 10.»
    { n: 6, set: "vacio",
      svg: `${panel(300, 770, 480, 430)}<g id="s6-car" transform="translate(430 1000) scale(1.7)">${FILETE}</g><g id="s6-t">${etiquetaIva("s6-e", "6 %")}</g>
        ${D.ivaCarne.map((v, i) => `<rect id="s6-r${i}" x="${582 + i * 62}" y="${1150 - v * 20}" width="40" height="${v * 20}" rx="6" fill="${i === 2 ? C.azul : "#D9A75A"}"/>${rot(602 + i * 62, 1182, Y[i], 18, C.gris)}`).join("")}
        ${rot(470, 1110, "CARNE Y PESCADO", 22, C.gris)}<g transform="translate(-40 1452) scale(.75)">${carro("s6-c")}</g>${dos("s6")}`,
      tarjeta: tarjeta(6, "IVA de la carne y el pescado", `${vs3(6, D.ivaCarne.map((v) => v + "&nbsp;%"), ["en 1986", "en 2006", "en 2026"])}
        <div class="nota">También el resto de la comida que no es básica y el bar</div>`, { fuente: F_IVA, icono: bandera(44) }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("super", null, t, 0);
        T("s6-car", 430, 1000, { s: 1.7, r: 3 * Math.sin(t * 2.4) });
        pop("s6-t", t, c["c6-carne"], 470, 860, { s: 0.85 });
        const tt = [c["c6-6"], c["c6-1986"] + 0.2, c["c6-10"]];
        txt("s6-e-t", (t < tt[1] ? D.ivaCarne[0] : t < tt[2] ? D.ivaCarne[1] : D.ivaCarne[2]) + " %");
        for (let i = 0; i < 3; i++) { const k = suave((t - tt[i]) / 0.45), h = D.ivaCarne[i] * 20 * k; attr(`s6-r${i}`, "y", (1150 - h).toFixed(1)); attr(`s6-r${i}`, "height", h.toFixed(1)); }
        sube("c6-a", t, tt[0]); sube("c6-b", t, tt[1]); sube("c6-c", t, tt[2]);
        persona("s6-padre", t, { x: 200, y: 1440, s: 0.78, mira: 1, boca: [[0, "seria"], [c["c6-10"], "o"]], ojos: [[0, "normal"], [c["c6-10"], "grandes"]], brazo: [[0, "empuja"], [c["c6-carne"], "abajo"], [c["c6-10"] + 0.3, "hombros"]], fase: 1 });
        persona("s6-hijo", t, { x: 880, y: 1440, s: 0.78, mira: -1, boca: habla(t, e), brazo: [[0, "abajo"], [c["c6-carne"] - 0.1, "senala"]], espejo: true, fase: 2 });
      } },

    // 7 · Hijo (súper): «Y la ropa, del 12 al 21.»
    { n: 7, set: "vacio",
      svg: `${panel(300, 770, 480, 430)}<g id="s7-cam" transform="translate(440 990)">${CAMISETA("#9ED0E6", 1.6)}</g><g id="s7-t">${etiquetaIva("s7-e", "12 %")}</g>
        ${D.ivaRopa.map((v, i) => `<rect id="s7-r${i}" x="${582 + i * 62}" y="${1150 - v * 12}" width="40" height="${v * 12}" rx="6" fill="${i === 2 ? C.azul : "#D9A75A"}"/>${rot(602 + i * 62, 1182, Y[i], 18, C.gris)}`).join("")}
        <g transform="translate(-40 1452) scale(.75)">${carro("s7-c")}</g>${dos("s7")}`,
      tarjeta: tarjeta(7, "IVA de la ropa", `${vs3(7, D.ivaRopa.map((v) => v + "&nbsp;%"), ["en 1986", "en 2006", "en 2026"])}
        <div class="nota">El 12, 16 y 21 % es el tipo general: también la luz, el móvil y casi todo lo demás</div>`, { fuente: F_IVA, icono: bandera(44) }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("super", null, t, 0);
        T("s7-cam", 440, 990, { r: 3 * Math.sin(t * 2.4) });
        pop("s7-t", t, c["c7-ropa"], 470, 860, { s: 0.85 });
        const v = t < c["c7-12"] + 0.4 ? D.ivaRopa[0] : t < c["c7-21"] ? D.ivaRopa[1] : D.ivaRopa[2];
        txt("s7-e-t", v + " %");
        const tt = [c["c7-12"], c["c7-12"] + 0.4, c["c7-21"]];
        for (let i = 0; i < 3; i++) { const k = suave((t - tt[i]) / 0.45), h = D.ivaRopa[i] * 12 * k; attr(`s7-r${i}`, "y", (1150 - h).toFixed(1)); attr(`s7-r${i}`, "height", h.toFixed(1)); }
        sube("c7-a", t, tt[0]); sube("c7-b", t, tt[1]); sube("c7-c", t, tt[2]);
        persona("s7-padre", t, { x: 200, y: 1440, s: 0.78, mira: 1, boca: [[0, "sonrisa"], [c["c7-21"], "o"]], ojos: [[0, "normal"], [c["c7-21"], "grandes"]], incl: [[0, 0], [c["c7-21"], -7]], fase: 1 });
        persona("s7-hijo", t, { x: 880, y: 1440, s: 0.78, mira: -1, boca: habla(t, e), brazo: [[0, "abajo"], [c["c7-ropa"] - 0.1, "senala"], [c["c7-21"], "arriba"]], espejo: true, fase: 2 });
      } },

    // 8 · Padre (gasolinera): «¡Y la gasolina, que es todo impuestos!»
    { n: 8, set: "vacio",
      svg: `<g id="s8-pant"><rect x="-40" y="-14" width="80" height="22" rx="4" fill="#7FB3A0"/></g>${dos("s8", MANGUERA)}`,
      tarjeta: tarjeta(8, "Padre", `<div class="tit">«¡La gasolina es todo <mark id="m8">impuestos</mark>!»</div>`, { tono: "pasado" }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("gasolinera", "super", t, e.t0);
        // El padre llega al surtidor, coge la manguera y el contador se pone a correr.
        const p = ruta(t, [[e.t0 + 0.1, 80], [e.t0 + 1.0, 230]]);
        ver("s8-mp", t > e.t0 + 1.0);
        T("s8-pant", 330, 1010, { op: t > e.t0 + 1.0 ? (0.5 + 0.5 * Math.abs(Math.sin(t * 14))).toFixed(2) : 0 });
        marca("m8", t, c["c8-impuestos"]);
        persona("s8-padre", t, { x: p.x, y: 1440, s: 0.78, anda: p.anda, mira: 1, boca: habla(t, e, "seria"),
          brazo: [[0, "abajo"], [e.t0 + 1.0, "empuja"], [c["c8-impuestos"], "arriba"]], incl: [[0, 0], [c["c8-impuestos"], -6]], fase: 1 });
        persona("s8-hijo", t, { x: 880, y: 1440, s: 0.78, mira: -1, boca: "sonrisa", brazo: [[0, "abajo"], [c["c8-impuestos"], "hombros"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camSueno(t, e.t0); } },

    // 9 · Hijo (gasolinera): «Y cada vez más cara: el gasóleo, ya descontada la inflación, cuesta un 27 % más que en 2006 y un 39 % más que en 2016.»
    { n: 9, set: "vacio",
      svg: `${panel(300, 790, 480, 420)}${D.gasoleo.map((v, i) => `<rect id="s9-r${i}" x="${385 + i * 120}" y="${1130 - v * 150}" width="70" height="${v * 150}" rx="8" fill="${i === 2 ? C.azul : "#D9A75A"}"/>
          <g id="s9-v${i}">${rot(420 + i * 120, 1112 - v * 150, es(v, 2) + " €", 30, i === 2 ? C.azul : "#8A6316")}</g>${rot(420 + i * 120, 1168, YG[i], 26, C.gris)}`).join("")}
        ${rot(540, 1198, "LITRO DE GASÓLEO, EN EUROS DE HOY", 20, C.gris)}<g id="s9-pant"><rect x="-40" y="-14" width="80" height="22" rx="4" fill="#7FB3A0"/></g>${dos("s9", MANGUERA)}`,
      tarjeta: tarjeta(9, "Litro de gasóleo, en euros de hoy", `${vs3(9, D.gasoleo.map((v) => es(v, 2) + "&nbsp;€"), ["en 2006", "en 2016", "en 2026"])}
        <div class="nota">Gasolina 95: ${es(D.gasolina[0], 2)} € en 2006, ${es(D.gasolina[1], 2)} € en 2016 y ${es(D.gasolina[2], 2)} € en 2026. Media de cada año</div>`, { fuente: F_GAS, icono: bandera(44) }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("gasolinera", null, t, 0);
        T("s9-pant", 330, 1010, { op: (0.5 + 0.5 * Math.abs(Math.sin(t * 14))).toFixed(2) });
        const tt = [c["c9-gasoleo"], c["c9-gasoleo"] + 0.5, c["c9-27"]];
        for (let i = 0; i < 3; i++) { const k = suave((t - tt[i]) / 0.5), h = D.gasoleo[i] * 150 * k; attr(`s9-r${i}`, "y", (1130 - h).toFixed(1)); attr(`s9-r${i}`, "height", h.toFixed(1)); css(`s9-v${i}`, "opacity", clamp((t - tt[i] - 0.3) / 0.3)); }
        sube("c9-a", t, tt[0]); sube("c9-b", t, tt[1]); sube("c9-c", t, tt[2]);
        persona("s9-padre", t, { x: 230, y: 1440, s: 0.78, mira: 1, boca: [[0, "seria"], [c["c9-27"], "o"]], ojos: [[0, "normal"], [c["c9-27"], "grandes"], [c["c9-39"] + 0.4, "normal"]],
          brazo: [[0, "empuja"], [c["c9-39"], "arriba"]], incl: [[0, 0], [c["c9-39"], -7]], fase: 1 });
        persona("s9-hijo", t, { x: 890, y: 1440, s: 0.78, mira: -1, boca: habla(t, e), brazo: [[0, "abajo"], [c["c9-cara"] - 0.1, "arriba"], [c["c9-gasoleo"], "senala"]], espejo: true, fase: 2 });
      } },

    // 10 · Hijo (gasolinera): «Y como el IVA va en porcentaje, cuanto más cara, más se lleva Hacienda: 20 céntimos de hoy por litro en 2006, y 32 ahora.»
    { n: 10, set: "vacio",
      svg: `${panel(300, 800, 480, 450)}${D.ivaLitro.map((v, i) => `<g transform="translate(${390 + i * 150} 1110)"><g id="s10-g${i}">${gota("s10-gg" + i, i === 2 ? C.azul : "#C8902E")}</g>
          <g id="s10-v${i}">${rot(0, -150 * 0.8 * Math.sqrt(v / D.ivaLitro[1]) - 16, es(v, 2) + " €", 30, i === 2 ? C.azul : "#8A6316")}</g>${rot(0, 104, YG[i], 28, C.gris)}</g>`).join("")}
        <g id="s10-t">${etiquetaIva("s10-e", "IVA " + D.ivaPct[0] + " %", C.rojo, 32)}</g>${dos("s10", MANGUERA)}`,
      tarjeta: tarjeta(10, "IVA de cada litro de gasóleo, en euros de hoy", `${vs3(10, D.ivaLitro.map((v) => es(v, 2) + "&nbsp;€"), ["en 2006", "en 2016", "en 2026"])}
        <div class="nota">IVA del ${D.ivaPct[0]} % en 2006 y del ${D.ivaPct[2]} % hoy, sobre un litro cada vez más caro</div>`, { fuente: F_GAS, icono: bandera(44) }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("gasolinera", null, t, 0);
        if (pop("s10-t", t, c["c10-iva"], 560, 860, { s: 0.95, r: -6 }) >= 0) txt("s10-e-t", t < c["c10-32"] ? "IVA " + D.ivaPct[0] + " %" : "IVA " + D.ivaPct[2] + " %");
        // Gotas de IVA que caen del surtidor y crecen con el precio del litro.
        const tt = [c["c10-20"], c["c10-20"] + 0.6, c["c10-32"]];
        for (let i = 0; i < 3; i++) {
          const k = (t - tt[i]) / 0.5, s = 0.8 * Math.sqrt(D.ivaLitro[i] / D.ivaLitro[1]);   // área proporcional al IVA
          if (k < 0) { ver(`s10-g${i}`, false); ver(`s10-v${i}`, false); continue; }
          ver(`s10-g${i}`, true); ver(`s10-v${i}`, true);
          T(`s10-g${i}`, 0, -60 * (1 - fuera(k)), { s: s * rebote(k) }); css(`s10-v${i}`, "opacity", clamp((t - tt[i] - 0.3) / 0.3));
        }
        sube("c10-a", t, tt[0]); sube("c10-b", t, tt[1]); sube("c10-c", t, tt[2]);
        persona("s10-padre", t, { x: 230, y: 1440, s: 0.78, mira: 1, boca: [[0, "seria"], [c["c10-hacienda"], "o"]], ojos: [[0, "normal"], [c["c10-32"], "grandes"]],
          brazo: [[0, "empuja"], [c["c10-hacienda"], "abajo"], [c["c10-32"] + 0.2, "hombros"]], fase: 1 });
        persona("s10-hijo", t, { x: 900, y: 1440, s: 0.78, mira: -1, boca: habla(t, e), brazo: [[0, "abajo"], [c["c10-iva"] - 0.1, "senala"], [c["c10-hacienda"], "arriba"], [c["c10-20"], "senala"]], espejo: true, fase: 2 });
      } },

    // 11 · Hijo, a cámara (cocina): «¿Pagamos mucho o poco al Estado? ¿Tú qué opinas?»
    { n: 11, set: "vacio",
      svg: `${boton2("s11-b1", "MUCHO", "#C8902E", 280)}${boton2("s11-b2", "POCO", "#1F5F8B", 260)}${bocadillo("s11-boc")}${dos("s11")}`,
      tarjeta: tarjeta(11, "Te toca", `<div class="tit" style="font-size:64px">¿Pagamos <mark id="m11">mucho o poco</mark> al Estado?</div><div class="sub" id="c11-sub">¿Tú qué opinas? Te leo en los comentarios.</div>`),
      fn: function (t, e) {
        const c = e.c;
        ambiente("cocina", "gasolinera", t, e.t0);
        pop("s11-b1", t, c["c11-mucho"], 320, 860, { s: 0.9 }); pop("s11-b2", t, c["c11-poco"], 760, 860, { s: 0.9 });
        if (pop("s11-boc", t, c["c11-boc"], 540, 1110, { s: 0.75 }) >= 0) for (let i = 0; i < 3; i++) attr("s11-boc-p" + i, "cy", (-6 - 16 * Math.max(0, Math.sin((t - c["c11-boc"]) * 8 - i * 0.9))).toFixed(1));
        marca("m11", t, c["c11-mucho"]); sube("c11-sub", t, c["c11-boc"] - 0.2);
        const p = ruta(t, [[e.t0 + 0.2, 150], [e.t0 + 0.9, 230]]), h = ruta(t, [[e.t0 + 0.2, 900], [e.t0 + 0.9, 850]]);
        persona("s11-padre", t, { x: p.x, y: 1440, s: 0.78, anda: p.anda, mira: [[0, 1], [c["c11-boc"], 0]], boca: "sonrisa", brazo: [[0, "abajo"], [c["c11-mucho"], "senala"], [c["c11-boc"], "hombros"]], fase: 1 });
        persona("s11-hijo", t, { x: h.x, y: 1440, s: 0.78, anda: h.anda, mira: [[0, -1], [c["c11-boc"], 0]], boca: habla(t, e), brazo: [[0, "abajo"], [c["c11-poco"], "hombros"], [c["c11-boc"], "arriba"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camSueno(t, e.t0); } },
  ];
}
