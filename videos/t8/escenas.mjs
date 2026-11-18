// Escenas de T8 (padre contra hijo, 6.ª parte: «¿Cuánto de tu sueldo se queda el Estado?») en estilo «limpio».
// Decorados como en un sueño: cocina → caja del súper → banco → pasillo del súper → gasolinera → banco → cocina.
// Como en T7, los personajes andan, empujan el carro, echan gasolina y gesticulan; cada dato tiene su dibujo
// (billetes partidos, fajos, etiquetas de IVA que cambian, gotas de impuesto, una hucha).
/* eslint-disable no-undef */

import { C, persona, bocadillo, tarjeta, carro, nomina, PRODUCTOS } from "../../diseno/limpio.mjs";
import { bandera } from "../../diseno/barrio.mjs";
import { billete } from "../../diseno/casa.mjs";
import { ambientes, hucha, moneda } from "../../diseno/sueno.mjs";
import { DECORADOS_T8, CAMISETA, cajaRegistradora, FILETE, gota, barraBillete } from "../../diseno/tiendas.mjs";

export const ESTILO = "limpio";
const F_COT = "Cálculo propio con las normas del BOE de cada año (salario mínimo, cotizaciones e IRPF; Madrid en 2026)";
const F_NET = "Cálculo propio con las normas del BOE e IPC del INE (euros de 2026)";
const F_IVA = "Dato oficial: BOE (Ley 30/1985 y Ley 37/1992 del IVA)";
const F_GAS = "Dato oficial: BOE (impuestos especiales de 1985 y 1992 y ventas minoristas). Cálculo propio con el IPC del INE";
const F_AHO = "Dato oficial: BOE (leyes del IRPF de 1985, 2004 y 2006). Cálculo propio";

export function datos(d) {
  const c = d.casos, g = d.gasolina.impuesto_por_litro_en_euros_de_2026, a = d.ahorro_intereses_tipo_pct, iva = d.iva_pct;
  const anyos = ["1986", "2006", "2026"];
  return {
    cajeroEstado: anyos.map((y) => c.cajero[y].pct_estado_del_coste), bancaEstado: anyos.map((y) => c.banca[y].pct_estado_del_coste),
    cajeroNeto: anyos.map((y) => c.cajero[y].en_euros_de_2026.neto),
    menos: c.banca["1986"].en_euros_de_2026.neto - c.banca["2026"].en_euros_de_2026.neto,
    bancaBruto: [c.banca["1986"].bruto, c.banca["2006"].bruto, c.banca["2026"].bruto],
    ivaBasico: anyos.map((y) => iva.pan_leche_huevos_fruta_verdura[y]), ivaCarne: anyos.map((y) => iva.resto_de_la_comida_carne_pescado[y]),
    ivaRopa: anyos.map((y) => iva.ropa_y_calzado[y]),
    gas: anyos.map((y) => g[y]),
    ahorroBanca: anyos.map((y) => a.banca[y]), ahorroCajero: anyos.map((y) => a.cajero[y]),
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
const etiquetaIva = (id, texto, color = C.rojo) => `<g id="${id}"><line x1="0" y1="-50" x2="0" y2="-4" stroke="${C.gris}" stroke-width="4"/>
  <path d="M-80 0 H60 L92 40 L60 80 H-80 Q-94 80 -94 66 V14 Q-94 0 -80 0 Z" fill="${color}"/><circle cx="66" cy="40" r="8" fill="#FFFDF8"/>
  ${rot(-14, 58, texto, 44, "#FFFDF8", id + "-t")}</g>`;
const MANGUERA = `<g transform="rotate(20)"><rect x="-8" y="-6" width="16" height="44" rx="6" fill="${C.tinta}"/><path d="M0 -6 L28 -28" stroke="${C.tinta}" stroke-width="10" stroke-linecap="round"/></g>`;
const NOMINA_MANO = `<g transform="translate(10 -50) scale(.6)">${nomina("nm")}</g>`;

export function escenas(D) {
  const es = (v, d = 1) => v.toFixed(d).replace(".", ",");
  const r = (v) => Math.round(v);
  const miles = (v) => Math.round(v).toLocaleString("es-ES").replace(/,/g, ".");
  const Y = ["1986", "2006", "2026"];
  // Tres billetes partidos (barras de 100 €) con la parte del Estado en gris.
  const billetes = (p, vals) => `${panel(300, 770, 480, 330)}${vals.map((v, i) => `
    ${rot(318, 840 + i * 100, Y[i], 30, C.gris, "", "start")}<g transform="translate(420 ${830 + i * 100}) scale(.78)">${barraBillete(`${p}-b${i}`, 420)}</g>
    <g id="${p}-v${i}">${rot(760, 842 + i * 100, r(v), 40, i === 2 ? C.azul : "#8A6316", "", "end")}</g>`).join("")}
    ${rot(540, 1085, "AL ESTADO, DE CADA 100 €", 26, C.gris)}`;
  return [
    // 1 · Padre (cocina): «¡Menuda nómina! En mis tiempos Hacienda no te sangraba así.»
    { n: 1, set: "vacio",
      svg: `<g id="s1-nom"><g transform="scale(1.6)">${nomina("s1-n")}</g><g id="s1-sello" transform="rotate(-14)"><rect x="-120" y="-40" width="240" height="80" rx="12" fill="none" stroke="${C.rojo}" stroke-width="10"/>${rot(0, 16, "RETENCIONES", 34, C.rojo)}</g></g>${dos("s1", NOMINA_MANO)}`,
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

    // 2 · Hijo (caja del súper): «Un cajero con el salario mínimo: de cada 100 € que pagaba la empresa, 30 iban al Estado en 1986. Hoy, 29.»
    { n: 2, set: "vacio",
      svg: `${billetes("s2", D.cajeroEstado)}${dos("s2")}<g transform="translate(850 1450)">${cajaRegistradora("s2-caja")}</g>`,
      tarjeta: tarjeta(2, "Cajero con el salario mínimo · al Estado, de cada 100 € que cuesta", `${vs3(2, D.cajeroEstado.map(r), ["en 1986", "en 2006", "en 2026"])}
        <div class="nota">IRPF + cotizaciones del trabajador y de la empresa. Hoy, con el salario mínimo, no paga IRPF</div>`, { fuente: F_COT, icono: bandera(44) }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("caja", "cocina", t, e.t0);
        attr("s2-caja-cinta", "stroke-dashoffset", (-t * 90).toFixed(1));
        const tt = [c["c2-30"], c["c2-1986"] + 0.45, c["c2-29"]];
        for (let i = 0; i < 3; i++) {
          const k = suave((t - tt[i]) / 0.7);
          attr(`s2-b${i}-e`, "width", (420 * D.cajeroEstado[i] / 100 * k).toFixed(1));
          css(`s2-v${i}`, "opacity", clamp((t - tt[i] - 0.3) / 0.3));
        }
        sube("c2-a", t, c["c2-30"]); sube("c2-b", t, c["c2-1986"] + 0.45); sube("c2-c", t, c["c2-29"]);
        const p = ruta(t, [[e.t0 + 0.2, 300], [e.t0 + 1.0, 200]]);
        persona("s2-padre", t, { x: p.x, y: 1440, s: 0.78, anda: p.anda, espejo: p.anda, mira: 1, boca: "seria", brazo: [[0, "abajo"], [c["c2-29"], "piensa"]], fase: 1 });
        // El hijo, de cajero: pasa productos por la cinta y luego señala.
        const pasa = t < c["c2-30"] - 0.2 ? (Math.floor(t * 2.5) % 2 ? "empuja" : "sujeta") : null;
        persona("s2-hijo", t, { x: 880, y: 1440, s: 0.78, mira: -1, boca: habla(t, e), brazo: pasa || [[0, "abajo"], [c["c2-30"] - 0.2, "senala"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camSueno(t, e.t0); } },

    // 3 · Padre (caja): «¿Ves? Lo mismo.»
    { n: 3, set: "vacio",
      svg: `${billetes("s3", D.cajeroEstado)}${dos("s3")}<g transform="translate(850 1450)">${cajaRegistradora("s3-caja")}</g>`,
      tarjeta: tarjeta(3, "Padre", `<div class="tit">«¿Ves? <mark id="m3">Lo mismo</mark>.»</div>`, { tono: "pasado" }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("caja", null, t, 0);
        for (let i = 0; i < 3; i++) attr(`s3-b${i}-e`, "width", (420 * D.cajeroEstado[i] / 100).toFixed(1));
        marca("m3", t, c["c3-mismo"]);
        const p = ruta(t, [[e.t0, 200], [e.t0 + 0.6, 260]]);
        const asiente = t > c["c3-mismo"] ? 7 * Math.sin((t - c["c3-mismo"]) * 9) * Math.exp(-(t - c["c3-mismo"]) * 2) : 0;
        persona("s3-padre", t, { x: p.x, y: 1440, s: 0.78, anda: p.anda, mira: 1, boca: habla(t, e, "sonrisa"), ojos: [[0, "felices"]], brazo: [[0, "senala"], [c["c3-mismo"], "hombros"]], incl: asiente, fase: 1 });
        persona("s3-hijo", t, { x: 880, y: 1440, s: 0.78, mira: -1, boca: "seria", incl: [[0, 0], [c["c3-mismo"], 6]], espejo: true, fase: 2 });
      } },

    // 4 · Hijo (caja): «Lo mismo, pero hoy cobra mucho más: 10.700 € al año en 1986, en euros de hoy, y 16.000 ahora.»
    { n: 4, set: "vacio",
      svg: `${panel(300, 760, 480, 440)}${D.cajeroNeto.map((v, i) => `<g transform="translate(${390 + i * 150} 1110)">${Array.from({ length: Math.round(v / 1500) }, (_, k) => `<g id="s4-f${i}-${k}" transform="translate(0 ${-k * 26}) scale(.62)">${billete("s4-bb" + i + k)}</g>`).join("")}
        <g id="s4-v${i}">${rot(0, -Math.round(v / 1500) * 26 - 40, miles(v) + " €", 32, i === 2 ? C.azul : "#8A6316")}</g>${rot(0, 60, Y[i], 30, C.gris)}</g>`).join("")}
        ${dos("s4")}<g transform="translate(850 1450)">${cajaRegistradora("s4-caja")}</g>`,
      tarjeta: tarjeta(4, "Lo que le llega al cajero al año, en euros de hoy", vs3(4, D.cajeroNeto.map((v) => miles(v) + "&nbsp;€"), ["en 1986", "en 2006", "en 2026"], undefined, 62), { fuente: F_NET, icono: bandera(44) }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("caja", null, t, 0);
        const tt = [c["c4-10700"], c["c4-10700"] + 0.6, c["c4-16000"]];
        for (let i = 0; i < 3; i++) {
          const n = Math.round(D.cajeroNeto[i] / 1500);
          for (let k = 0; k < n; k++) {
            const t0 = tt[i] + k * 0.06, kk = (t - t0) / 0.25;
            if (kk < 0) { ver(`s4-f${i}-${k}`, false); continue; }
            ver(`s4-f${i}-${k}`, true);
            attr(`s4-f${i}-${k}`, "transform", `translate(0 ${(-k * 26 - 120 * (1 - fuera(kk))).toFixed(1)}) scale(.62)`);
          }
          css(`s4-v${i}`, "opacity", clamp((t - tt[i] - n * 0.06) / 0.3));
        }
        sube("c4-a", t, tt[0]); sube("c4-b", t, tt[1]); sube("c4-c", t, tt[2]);
        persona("s4-padre", t, { x: 210, y: 1440, s: 0.78, mira: 1, boca: [[0, "sonrisa"], [c["c4-16000"] + 0.3, "o"]], ojos: [[0, "normal"], [c["c4-16000"] + 0.3, "grandes"]], brazo: [[0, "hombros"], [c["c4-16000"], "abajo"]], fase: 1 });
        persona("s4-hijo", t, { x: 880, y: 1440, s: 0.78, mira: -1, boca: habla(t, e), brazo: [[0, "abajo"], [c["c4-mas"], "senala"], [c["c4-16000"], "arriba"]], espejo: true, fase: 2 });
      } },

    // 5 · Padre (banco): «¿Y uno de banca, que gana bien?»
    { n: 5, set: "vacio",
      svg: `${dos("s5")}`,
      tarjeta: tarjeta(5, "Padre", `<div class="tit">«¿Y uno de <mark id="m5">banca</mark>?»</div>`, { tono: "pasado" }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("banco", "caja", t, e.t0);
        const p = ruta(t, [[e.t0 + 0.1, 100], [e.t0 + 1.0, 260]]);
        const h = ruta(t, [[e.t0 + 0.2, 1080], [e.t0 + 1.1, 880]]);
        marca("m5", t, c["c5-banca"]);
        persona("s5-padre", t, { x: p.x, y: 1440, s: 0.78, anda: p.anda, mira: 1, boca: habla(t, e, "sonrisa"), brazo: [[0, "abajo"], [c["c5-banca"] - 0.1, "piensa"]], incl: [[0, 0], [c["c5-banca"], -6]], fase: 1 });
        persona("s5-hijo", t, { x: h.x, y: 1440, s: 0.78, anda: h.anda, mira: -1, boca: "sonrisa", espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camSueno(t, e.t0); } },

    // 6 · Hijo (banco): «Con 40.000 € de hoy, el Estado se quedaba 40 de cada 100 en 1986. Hoy, 43: 960 € menos en su bolsillo.»
    { n: 6, set: "vacio",
      svg: `${billetes("s6", D.bancaEstado)}<g id="s6-mon">${moneda("s6-m")}</g><g id="s6-menos">${rot(0, 0, "−" + r(D.menos) + " € al año", 40, C.rojo)}</g>${dos("s6")}`,
      tarjeta: tarjeta(6, "Empleado de banca · al Estado, de cada 100 € que cuesta", `${vs3(6, D.bancaEstado.map(r), ["en 1986", "en 2006", "en 2026"])}
        <div class="nota">Gana ${miles(D.bancaBruto[2])} € brutos de hoy (con el IPC: ${miles(D.bancaBruto[0])} pesetas en 1986 y ${miles(D.bancaBruto[1])} € en 2006). En euros de hoy le llegan ${r(D.menos)} € menos que en 1986</div>`, { fuente: F_COT, icono: bandera(44) }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("banco", null, t, 0);
        const tt = [c["c6-40"], c["c6-40"] + 0.8, c["c6-43"]];
        for (let i = 0; i < 3; i++) {
          const k = suave((t - tt[i]) / 0.7);
          attr(`s6-b${i}-e`, "width", (420 * D.bancaEstado[i] / 100 * k).toFixed(1));
          css(`s6-v${i}`, "opacity", clamp((t - tt[i] - 0.3) / 0.3));
        }
        sube("c6-a", t, tt[0]); sube("c6-b", t, tt[1]); sube("c6-c", t, tt[2]);
        // Una moneda se le escapa del bolsillo y rueda por el suelo.
        const km = t - c["c6-960"];
        if (km < 0) { ver("s6-mon", false); ver("s6-menos", false); }
        else {
          const x = 840 - 380 * Math.min(1, km / 1.4), y = km < 0.4 ? 1230 + 170 * (km / 0.4) ** 2 : 1400 - Math.abs(Math.sin((km - 0.4) * 7)) * 40 * Math.exp(-(km - 0.4) * 2);
          T("s6-mon", x, y, { s: 0.55, r: -km * 500 }); T("s6-menos", 540, 1190, { op: clamp(km / 0.3) });
        }
        persona("s6-padre", t, { x: 260, y: 1440, s: 0.78, mira: 1, boca: [[0, "seria"], [c["c6-960"], "o"]], ojos: [[0, "normal"], [c["c6-960"], "grandes"]], brazo: [[0, "piensa"], [c["c6-43"], "abajo"]], fase: 1 });
        persona("s6-hijo", t, { x: 880, y: 1440, s: 0.78, mira: -1, boca: habla(t, e), brazo: [[0, "abajo"], [c["c6-40"] - 0.2, "senala"], [c["c6-960"], "hombros"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { const k = t - e.c["c6-43"], g = k >= 0 && k < 0.18; return { z: 1, dx: 0, dy: g ? azar(5, Math.floor(t * 30)) * 7 : 0 }; } },

    // 7 · Padre (pasillo del súper, con el carro): «¡Y luego vas a la compra y otra vez a pagar!»
    { n: 7, set: "vacio",
      svg: `<g id="s7-carro">${carro("s7-c")}</g>${dos("s7")}`,
      tarjeta: tarjeta(7, "Padre", `<div class="tit">«¡Y luego, <mark id="m7">la compra</mark>!»</div>`, { tono: "pasado" }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("super", "banco", t, e.t0);
        // Empuja el carro por el pasillo.
        const p = ruta(t, [[e.t0 + 0.1, -60], [c["c7-pagar"], 300]]);
        T("s7-carro", p.x + 200, 1452, { s: 0.75 });
        marca("m7", t, c["c7-compra"]);
        persona("s7-padre", t, { x: p.x, y: 1440, s: 0.78, anda: p.anda, mira: 1, boca: habla(t, e, "seria"), brazo: [[0, "empuja"], [c["c7-pagar"] + 0.1, "arriba"]], fase: 1 });
        const h = ruta(t, [[e.t0 + 0.4, 1100], [e.t0 + 1.4, 880]]);
        persona("s7-hijo", t, { x: h.x, y: 1440, s: 0.78, anda: h.anda, mira: -1, boca: "sonrisa", espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camSueno(t, e.t0); } },

    // 8 · Hijo (súper): «El IVA del pan, la leche y la fruta ha bajado: del 6 al 4 %. Pero la carne, del 6 al 10.»
    { n: 8, set: "vacio",
      svg: `${panel(300, 770, 480, 430)}<g id="s8-pan" transform="translate(370 1080) scale(.8)">${PRODUCTOS.pan}</g><g id="s8-leche" transform="translate(455 1060) scale(.8)">${PRODUCTOS.leche}</g>
        <g id="s8-fruta" transform="translate(530 1090) scale(.9)">${PRODUCTOS.manzana}</g><g id="s8-carne" transform="translate(680 1080) scale(.9)">${FILETE}</g>
        <g id="s8-t1">${etiquetaIva("s8-e1", "6 %", "#7C9A7E")}</g><g id="s8-t2">${etiquetaIva("s8-e2", "6 %")}</g>
        ${rot(450, 1170, "PAN, LECHE Y FRUTA", 24, C.gris)}${rot(680, 1170, "CARNE", 24, C.gris)}
        <g transform="translate(-40 1452) scale(.75)">${carro("s8-c")}</g>${dos("s8")}`,
      tarjeta: tarjeta(8, "IVA del pan, la leche y la fruta", `${vs3(8, [D.ivaBasico[0] + "&nbsp;%", D.ivaBasico[2] + "&nbsp;%"], ["en 1986", "en 2026"], ["t-pasado", "t-hoy"])}
        <div class="nota">Carne, pescado y el resto de la comida: ${D.ivaCarne[0]} % en 1986, ${D.ivaCarne[1]} % en 2006 y ${D.ivaCarne[2]} % hoy. Pan, leche y fruta en 2006: ${D.ivaBasico[1]} %</div>`, { fuente: F_IVA, icono: bandera(44) }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("super", null, t, 0);
        pop("s8-pan", t, c["c8-pan"], 370, 1080, { s: 0.8 }); pop("s8-leche", t, c["c8-leche"], 455, 1060, { s: 0.8 }); pop("s8-fruta", t, c["c8-fruta"], 530, 1090, { s: 0.9 });
        pop("s8-carne", t, c["c8-carne"], 680, 1080, { s: 0.9 });
        // Etiquetas: la de lo básico baja de 6 a 4; la de la carne sube de 6 a 10.
        if (pop("s8-t1", t, c["c8-pan"] + 0.2, 450, 860, { s: 0.8 }) >= 0) txt("s8-e1-t", t < c["c8-4"] ? D.ivaBasico[0] + " %" : D.ivaBasico[2] + " %");
        if (pop("s8-t2", t, c["c8-carne"] + 0.1, 680, 860, { s: 0.8 }) >= 0) txt("s8-e2-t", t < c["c8-10"] ? D.ivaCarne[0] + " %" : D.ivaCarne[2] + " %");
        const sal = (k) => k >= 0 && k < 0.3 ? Math.sin(k / 0.3 * Math.PI) * 18 : 0;
        T("s8-t1", 450, 860 - sal(t - c["c8-4"]), { s: 0.8 }); if (t >= c["c8-carne"] + 0.1) T("s8-t2", 680, 860 - sal(t - c["c8-10"]), { s: 0.8 });
        sube("c8-a", t, c["c8-pan"]); sube("c8-b", t, c["c8-4"]);
        persona("s8-padre", t, { x: 200, y: 1440, s: 0.78, mira: 1, boca: [[0, "seria"], [c["c8-4"], "sonrisa"], [c["c8-10"], "o"]], ojos: [[0, "normal"], [c["c8-4"], "felices"], [c["c8-10"], "grandes"]], brazo: [[0, "empuja"], [c["c8-pan"], "abajo"]], fase: 1 });
        persona("s8-hijo", t, { x: 880, y: 1440, s: 0.78, mira: -1, boca: habla(t, e), brazo: [[0, "abajo"], [c["c8-pan"] - 0.2, "senala"], [c["c8-carne"], "empuja"]], espejo: true, fase: 2 });
      } },

    // 9 · Hijo (súper): «Y la ropa, del 12 al 21.»
    { n: 9, set: "vacio",
      svg: `${panel(300, 770, 480, 430)}<g id="s9-cam" transform="translate(440 990)">${CAMISETA("#9ED0E6", 1.6)}</g><g id="s9-t">${etiquetaIva("s9-e", "12 %")}</g>
        ${D.ivaRopa.map((v, i) => `<rect id="s9-r${i}" x="${600 + i * 50}" y="${1150 - v * 12}" width="36" height="${v * 12}" rx="6" fill="${i === 2 ? C.azul : "#D9A75A"}"/>${rot(618 + i * 50, 1182, Y[i], 18, C.gris)}`).join("")}
        <g transform="translate(-40 1452) scale(.75)">${carro("s9-c")}</g>${dos("s9")}`,
      tarjeta: tarjeta(9, "IVA de la ropa", `${vs3(9, D.ivaRopa.map((v) => v + "&nbsp;%"), ["en 1986", "en 2006", "en 2026"])}
        <div class="nota">El 12, 16 y 21 % es el tipo general: también la luz, el móvil y casi todo lo demás</div>`, { fuente: F_IVA, icono: bandera(44) }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("super", null, t, 0);
        T("s9-cam", 440, 990, { r: 3 * Math.sin(t * 2.4) });
        pop("s9-t", t, c["c9-ropa"], 470, 860, { s: 0.85 });
        const v = t < c["c9-12"] + 0.4 ? D.ivaRopa[0] : t < c["c9-21"] ? D.ivaRopa[1] : D.ivaRopa[2];
        txt("s9-e-t", v + " %");
        const tt = [c["c9-12"], c["c9-12"] + 0.4, c["c9-21"]];
        for (let i = 0; i < 3; i++) { const k = suave((t - tt[i]) / 0.45), h = D.ivaRopa[i] * 12 * k; attr(`s9-r${i}`, "y", (1150 - h).toFixed(1)); attr(`s9-r${i}`, "height", h.toFixed(1)); }
        sube("c9-a", t, tt[0]); sube("c9-b", t, tt[1]); sube("c9-c", t, tt[2]);
        persona("s9-padre", t, { x: 200, y: 1440, s: 0.78, mira: 1, boca: [[0, "sonrisa"], [c["c9-21"], "o"]], ojos: [[0, "normal"], [c["c9-21"], "grandes"]], incl: [[0, 0], [c["c9-21"], -7]], fase: 1 });
        persona("s9-hijo", t, { x: 880, y: 1440, s: 0.78, mira: -1, boca: habla(t, e), brazo: [[0, "abajo"], [c["c9-ropa"] - 0.1, "senala"], [c["c9-21"], "arriba"]], espejo: true, fase: 2 });
      } },

    // 10 · Padre (gasolinera): «¡Y la gasolina, que es todo impuestos!»
    { n: 10, set: "vacio",
      svg: `<g id="s10-pant"><rect x="-40" y="-14" width="80" height="22" rx="4" fill="#7FB3A0"/></g>${dos("s10", MANGUERA)}`,
      tarjeta: tarjeta(10, "Padre", `<div class="tit">«¡La gasolina es todo <mark id="m10">impuestos</mark>!»</div>`, { tono: "pasado" }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("gasolinera", "super", t, e.t0);
        // El padre llega al surtidor, coge la manguera y el contador se pone a correr.
        const p = ruta(t, [[e.t0 + 0.1, 80], [e.t0 + 1.0, 230]]);
        ver("s10-mp", t > e.t0 + 1.0);
        T("s10-pant", 330, 1010, { op: t > e.t0 + 1.0 ? (0.5 + 0.5 * Math.abs(Math.sin(t * 14))).toFixed(2) : 0 });
        marca("m10", t, c["c10-impuestos"]);
        persona("s10-padre", t, { x: p.x, y: 1440, s: 0.78, anda: p.anda, mira: 1, boca: habla(t, e, "seria"),
          brazo: [[0, "abajo"], [e.t0 + 1.0, "empuja"], [c["c10-impuestos"], "arriba"]], incl: [[0, 0], [c["c10-impuestos"], -6]], fase: 1 });
        persona("s10-hijo", t, { x: 880, y: 1440, s: 0.78, mira: -1, boca: "sonrisa", brazo: [[0, "abajo"], [c["c10-impuestos"], "hombros"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camSueno(t, e.t0); } },

    // 11 · Hijo (gasolinera): «Paga un impuesto por cada litro: 56 céntimos de hoy en 1986, y 47 ahora. Pero el IVA ha subido del 12 al 21 %.»
    { n: 11, set: "vacio",
      svg: `${panel(300, 770, 480, 430)}${D.gas.map((v, i) => `<g transform="translate(${390 + i * 150} 1100)"><g id="s11-g${i}">${gota("s11-gg" + i, i === 2 ? C.azul : "#C8902E")}</g>
          <g id="s11-v${i}">${rot(0, -240 * v / D.gas[1] + 20, es(v, 2) + " €", 34, i === 2 ? C.azul : "#8A6316")}</g>${rot(0, 60, Y[i], 30, C.gris)}</g>`).join("")}
        ${rot(540, 800, "IMPUESTO POR LITRO, EN EUROS DE HOY", 22, C.gris)}<g id="s11-t">${etiquetaIva("s11-e", "IVA 12 %")}</g>${dos("s11", "", "")}`,
      tarjeta: tarjeta(11, "Impuesto por litro de gasolina, en euros de hoy", `${vs3(11, D.gas.map((v) => es(v, 2) + "&nbsp;€"), ["en 1986", "en 2006", "en 2026"])}
        <div class="nota">Y encima, el IVA: 12 % en 1986, 16 % en 2006 y 21 % hoy. 2006, en Madrid</div>`, { fuente: F_GAS, icono: bandera(44) }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("gasolinera", null, t, 0);
        // Gotas que caen y crecen hasta el impuesto por litro de cada año.
        const tt = [c["c11-56"], c["c11-56"] + 0.6, c["c11-47"]];
        for (let i = 0; i < 3; i++) {
          const k = (t - tt[i]) / 0.5, s = 1.2 * D.gas[i] / D.gas[1];
          if (k < 0) { ver(`s11-g${i}`, false); ver(`s11-v${i}`, false); continue; }
          ver(`s11-g${i}`, true); ver(`s11-v${i}`, true);
          T(`s11-g${i}`, 0, -60 * (1 - fuera(k)), { s: s * rebote(k) }); css(`s11-v${i}`, "opacity", clamp((t - tt[i] - 0.3) / 0.3));
        }
        sube("c11-a", t, tt[0]); sube("c11-b", t, tt[1]); sube("c11-c", t, tt[2]);
        if (pop("s11-t", t, c["c11-iva"], 820, 930, { s: 0.7, r: -6 }) >= 0) txt("s11-e-t", t < c["c11-21"] ? "IVA 12 %" : "IVA 21 %");
        persona("s11-padre", t, { x: 210, y: 1440, s: 0.78, mira: 1, boca: [[0, "seria"], [c["c11-47"], "sonrisa"], [c["c11-21"], "o"]], ojos: [[0, "normal"], [c["c11-21"], "grandes"]], brazo: [[0, "empuja"], [c["c11-56"], "abajo"]], fase: 1 });
        persona("s11-hijo", t, { x: 900, y: 1440, s: 0.78, mira: -1, boca: habla(t, e), brazo: [[0, "abajo"], [c["c11-litro"] - 0.2, "senala"], [c["c11-iva"], "arriba"]], espejo: true, fase: 2 });
      } },

    // 12 · Hijo (banco, con una hucha): «¿Y los ahorros? Los intereses del de banca pagaban un 26 % en 1986. Hoy, un 19 %.»
    { n: 12, set: "vacio",
      svg: `${panel(320, 770, 440, 300)}${D.ahorroBanca.map((v, i) => `<rect id="s12-r${i}" x="${400 + i * 130}" y="${1020 - v * 7}" width="70" height="${v * 7}" rx="8" fill="${i === 2 ? C.azul : "#D9A75A"}"/>
          <g id="s12-v${i}">${rot(435 + i * 130, 1010 - v * 7, es(v, v % 1 ? 1 : 0) + " %", 30, i === 2 ? C.azul : "#8A6316")}</g>${rot(435 + i * 130, 1055, Y[i], 26, C.gris)}`).join("")}
        <g id="s12-hucha" transform="translate(540 1300) scale(1.2)">${hucha("s12-h")}</g>${[0, 1, 2, 3].map((i) => `<g id="s12-m${i}">${moneda("s12-mm" + i)}</g>`).join("")}${dos("s12")}`,
      tarjeta: tarjeta(12, "Lo que pagan los intereses del ahorro · empleado de banca", `${vs3(12, D.ahorroBanca.map((v) => es(v, v % 1 ? 1 : 0) + "&nbsp;%"), ["en 1986", "en 2006", "en 2026"])}
        <div class="nota">El cajero: ${es(D.ahorroCajero[0], 2)} % en 1986, ${r(D.ahorroCajero[1])} % en 2006 y ${r(D.ahorroCajero[2])} % hoy</div>`, { fuente: F_AHO, icono: bandera(44) }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("banco", "gasolinera", t, e.t0);
        // De la hucha saltan monedas (los intereses).
        for (let i = 0; i < 4; i++) salto(`s12-m${i}`, t, c["c12-ahorros"] + i * 0.18, 540, 1180, 380 + i * 110, 900 - (i % 2) * 40, { alto: 160, s: 0.45, d: 0.5 });
        for (let i = 0; i < 4; i++) if (t > c["c12-26"]) ver(`s12-m${i}`, false);
        const tt = [c["c12-26"], c["c12-26"] + 0.6, c["c12-19"]];
        for (let i = 0; i < 3; i++) { const k = suave((t - tt[i]) / 0.5), h = D.ahorroBanca[i] * 7 * k; attr(`s12-r${i}`, "y", (1020 - h).toFixed(1)); attr(`s12-r${i}`, "height", h.toFixed(1)); css(`s12-v${i}`, "opacity", clamp((t - tt[i] - 0.3) / 0.3)); }
        sube("c12-a", t, tt[0]); sube("c12-b", t, tt[1]); sube("c12-c", t, tt[2]);
        T("s12-hucha", 540, 1300, { s: 1.2, r: t > c["c12-ahorros"] && t < c["c12-ahorros"] + 0.8 ? 8 * Math.sin((t - c["c12-ahorros"]) * 25) : 0 });
        const p = ruta(t, [[e.t0 + 0.1, 120], [e.t0 + 0.9, 220]]);
        persona("s12-padre", t, { x: p.x, y: 1440, s: 0.78, anda: p.anda, mira: 1, boca: [[0, "sonrisa"], [c["c12-19"], "o"]], ojos: [[0, "normal"], [c["c12-19"], "grandes"]], fase: 1 });
        persona("s12-hijo", t, { x: 880, y: 1440, s: 0.78, mira: -1, boca: habla(t, e), brazo: [[0, "abajo"], [c["c12-ahorros"] - 0.2, "senala"], [c["c12-19"], "arriba"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camSueno(t, e.t0); } },

    // 13 · Hijo, a cámara (cocina): «¿Pagamos mucho o poco al Estado? ¿Tú qué opinas?»
    { n: 13, set: "vacio",
      svg: `${boton2("s13-b1", "MUCHO", "#C8902E", 280)}${boton2("s13-b2", "POCO", "#1F5F8B", 260)}${bocadillo("s13-boc")}${dos("s13")}`,
      tarjeta: tarjeta(13, "Te toca", `<div class="tit" style="font-size:64px">¿Pagamos <mark id="m13">mucho o poco</mark> al Estado?</div><div class="sub" id="c13-sub">¿Tú qué opinas? Te leo en los comentarios.</div>`),
      fn: function (t, e) {
        const c = e.c;
        ambiente("cocina", "banco", t, e.t0);
        pop("s13-b1", t, c["c13-mucho"], 320, 860, { s: 0.9 }); pop("s13-b2", t, c["c13-poco"], 760, 860, { s: 0.9 });
        if (pop("s13-boc", t, c["c13-boc"], 540, 1110, { s: 0.75 }) >= 0) for (let i = 0; i < 3; i++) attr("s13-boc-p" + i, "cy", (-6 - 16 * Math.max(0, Math.sin((t - c["c13-boc"]) * 8 - i * 0.9))).toFixed(1));
        marca("m13", t, c["c13-mucho"]); sube("c13-sub", t, c["c13-boc"] - 0.2);
        const p = ruta(t, [[e.t0 + 0.2, 150], [e.t0 + 0.9, 230]]), h = ruta(t, [[e.t0 + 0.2, 900], [e.t0 + 0.9, 850]]);
        persona("s13-padre", t, { x: p.x, y: 1440, s: 0.78, anda: p.anda, mira: [[0, 1], [c["c13-boc"], 0]], boca: "sonrisa", brazo: [[0, "abajo"], [c["c13-mucho"], "senala"], [c["c13-boc"], "hombros"]], fase: 1 });
        persona("s13-hijo", t, { x: h.x, y: 1440, s: 0.78, anda: h.anda, mira: [[0, -1], [c["c13-boc"], 0]], boca: habla(t, e), brazo: [[0, "abajo"], [c["c13-poco"], "hombros"], [c["c13-boc"], "arriba"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camSueno(t, e.t0); } },
  ];
}
