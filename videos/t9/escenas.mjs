// Escenas de T9 (padre contra hijo, 7.ª parte: «¿Cuántas horas te cuesta vivir?») en estilo «limpio».
// Novedad de T9: personajes con volumen (luces y sombras) y más vivos (respiran, asienten y gesticulan al hablar, saltan),
// y cámara que se acerca y da un golpe de zoom en cada dato. Todo se cuenta en tiempo de trabajo: días, años y horas.
// Decorados como en un sueño: cocina → oficina → calle → gasolinera → salón → súper → cocina.
/* eslint-disable no-undef */

import { C, persona, bocadillo, tarjeta, carro } from "../../diseno/limpio.mjs";
import { bandera } from "../../diseno/barrio.mjs";
import { ambientes, bloque, cartel } from "../../diseno/sueno.mjs";
import { DECORADOS_T8 } from "../../diseno/tiendas.mjs";
import { calendario, filaRelojes, anyoIcono, bombilla, contadorLuz, boton, PERIODICO, LLAVES } from "../../diseno/horas.mjs";

export const ESTILO = "limpio";
const F_EST = "Cálculo propio con las normas del BOE de cada año (Madrid en 2026) · INE: sueldo medio";
const F_PISO = "Cálculo propio · Banco de España (valor tasado) · INE (sueldo medio) · BOE (IRPF y cotizaciones)";
const F_GAS = "BOE (precios de 1986) · Comisión Europea (boletín petrolero) · cálculo propio con el sueldo medio del INE";
const F_LUZ = "Dato oficial: Eurostat (luz de los hogares) · cálculo propio con el sueldo medio del INE";
const F_COM = "Cálculo propio · INE (presupuestos familiares, IPC de alimentos y sueldo medio)";

export function datos(d) {
  const A = ["1986", "2006", "2026"], B = ["2006", "2016", "2026"];
  return {
    estado: A.map((y) => d.estado_dias[y]), estadoPct: A.map((y) => d.estado_dias[y].pct_del_coste),
    piso: A.map((y) => d.piso_90m2[y].anos_de_sueldo_neto), piso16: d.piso_90m2["2016"].anos_de_sueldo_neto,
    deposito: A.map((y) => d.deposito_gasoleo_50l[y].horas), deposito16: d.deposito_gasoleo_50l["2016"].horas,
    luz: ["2006", "2016", "2025"].map((y) => d.luz_3500kwh[y].horas_ano),
    compra: B.map((y) => d.compra_mes_persona[y].horas),
  };
}

export const capas = () => ambientes(DECORADOS_T8);

// ------------------------------------------------------------------ personajes (los de T3 a T8, ahora con volumen)
const PADRE = { pelo: "corto", canas: true, barba: false, bigote: true, colorPelo: "#6F6A62", colorBigote: "#5E5952", ropa: ["#8C6F5A", "#6E5444"], piel: "#EDBE96", volumen: true };
const HIJO = { pelo: "corto", canas: false, barba: false, colorPelo: "#3B2A20", ropa: ["#6F8FA6", "#56738A"], piel: "#F1C9A5", volumen: true };
const dos = (p, mp = "", mh = "") => `${persona(p + "-padre", "hoy", { ...PADRE, mano: mp ? `<g id="${p}-mp">${mp}</g>` : undefined })}${persona(p + "-hijo", "hoy", { ...HIJO, mano: mh ? `<g id="${p}-mh">${mh}</g>` : undefined })}`;
const vs3 = (n, vals, labs, tonos = ["t-pasado", "t-pasado", "t-hoy"], tam = 72) => `<div class="vs">${vals.map((v, i) => `<div class="col"><div class="v ${tonos[i]}" id="c${n}-${"abc"[i]}" style="font-size:${tam}px">${v}</div><div class="n">${labs[i]}</div></div>`).join("")}</div>`;
const panel = (x, y, w, h) => `<rect x="${x + 8}" y="${y + 12}" width="${w}" height="${h}" rx="26" fill="#3C2814" opacity=".10"/><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="26" fill="#FFFDF8" opacity=".96"/>`;
const rot = (x, y, t, tam, color, id = "", ancla = "middle") => `<text ${id ? `id="${id}"` : ""} x="${x}" y="${y}" text-anchor="${ancla}" font-family="Cap" font-weight="800" font-size="${tam}" fill="${color}">${t}</text>`;
const MANGUERA = `<g transform="rotate(20)"><rect x="-8" y="-6" width="16" height="44" rx="6" fill="${C.tinta}"/><path d="M0 -6 L28 -28" stroke="${C.tinta}" stroke-width="10" stroke-linecap="round"/></g>`;
const es = (v, d = 1) => v.toFixed(d).replace(".", ",");

// Filas de relojes (una por año): cada fila tiene tantos relojes como horas, y el último se llena a medias.
const filas = (p, vals, labs, o) => `${vals.map((v, i) => `<g transform="translate(${o.x0} ${o.y0 + i * o.dy})">${rot(-24, 12, labs[i], 26, C.gris, "", "end")}
    ${filaRelojes(`${p}-f${i}`, Math.ceil(v), o.r, o.paso, i === 2 ? C.azul : "#D9A75A")}
    <g id="${p}-v${i}">${rot(o.xv, 12, es(v) + " h", 30, i === 2 ? C.azul : "#8A6316", "", "end")}</g></g>`).join("")}`;

export function escenas(D) {
  return [
    // 1 · Padre (cocina): «Los jóvenes os quejáis de vicio. ¡En mis tiempos también costaba todo!»
    { n: 1, set: "vacio",
      svg: `${dos("s1", PERIODICO)}`,
      tarjeta: tarjeta(1, "Padre contra hijo · Séptima parte", `<div class="tit" style="font-size:68px">¿Cuántas <mark id="m1">horas</mark> te cuesta vivir?</div>`, { icono: bandera(44) }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("cocina", null, t, 0);
        const p = ruta(t, [[0.15, 60], [1.1, 290]]);
        marca("m1", t, c["c1-quejais"]);
        persona("s1-padre", t, { x: p.x, y: 1440, s: 0.8, anda: p.anda, mira: 1, vivo: true, charla: e, salta: c["c1-costaba"], boca: habla(t, e, "seria"),
          brazo: [[0, "abajo"], [1.1, "senala"], [c["c1-tiempos"], "arriba"], [c["c1-costaba"] + 0.6, "hombros"]], incl: [[0, 0], [c["c1-costaba"] + 0.6, -6]], fase: 1 });
        persona("s1-hijo", t, { x: 860, y: 1440, s: 0.8, mira: -1, vivo: true, boca: [[0, "sonrisa"], [c["c1-costaba"], "o"]], ojos: [[0, "normal"], [c["c1-costaba"], "grandes"]],
          brazo: [[0, "abajo"], [c["c1-costaba"] + 0.4, "piensa"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c1-costaba"]]); } },

    // 2 · Hijo (oficina): «Pues vamos a contarlo en horas de trabajo. Hoy trabajas para el Estado hasta el 31 de mayo. En 1986, hasta el 25.»
    { n: 2, set: "vacio",
      svg: `<g id="s2-cal" transform="translate(540 1040)">${calendario("s2-c")}</g>
        <g id="s2-banda"><rect x="-230" y="-34" width="460" height="68" rx="34" fill="${C.rojo}"/>${rot(0, 14, "TRABAJAS PARA EL ESTADO", 30, "#FFFDF8")}</g>
        <g id="s2-nota"><rect x="-150" y="-50" width="300" height="100" rx="14" fill="#FFE58A" transform="rotate(-4)"/>${rot(0, -6, "EN 1986:", 26, "#8A6316")}${rot(0, 34, "25 DE MAYO", 34, "#8A6316")}</g>${dos("s2")}`,
      tarjeta: tarjeta(2, "Trabajas para el Estado hasta el…", `${vs3(2, D.estado.map((x) => x.dia + "&nbsp;de&nbsp;mayo"), ["en 1986", "en 2006", "en 2026"], undefined, 44)}
        <div class="nota">Sueldo medio. IRPF y cotizaciones: ${es(D.estadoPct[0])} % de lo que cuesta en 1986, ${es(D.estadoPct[1])} % en 2006 y ${es(D.estadoPct[2])} % hoy</div>`, { fuente: F_EST, icono: bandera(44) }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("oficina", "cocina", t, e.t0);
        // El calendario pasa hojas del 1 de enero al 31 de mayo (151 días), cada vez más despacio.
        const MESES = ["ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO"], LARGO = [31, 28, 31, 30, 31];
        const total = D.estado[2].dias - 1, a = c["c2-estado"] - 0.6, b = c["c2-31"];
        const k = fuera((t - a) / (b - a)), f = k * total, dia = Math.floor(f);
        const fecha = (n) => { let m = 0; while (m < 4 && n >= LARGO[m]) { n -= LARGO[m]; m++; } return [MESES[m], n + 1]; };
        const [mes, d] = fecha(Math.min(dia, total));
        txt("s2-c-mes", mes); txt("s2-c-dia", String(d)); txt("s2-c-fijo-t", String(d));
        const fr = f - dia;
        if (t < a || k >= 1) ver("s2-c-hoja", false);
        else { ver("s2-c-hoja", true); txt("s2-c-hoja-t", String(fecha(Math.max(0, dia - 1))[1])); attr("s2-c-hoja", "transform", `translate(${(fr * 120).toFixed(1)} ${(-fr * 300).toFixed(1)}) rotate(${(-fr * 40).toFixed(1)})`); css("s2-c-hoja", "opacity", (1 - fr).toFixed(2)); }
        pop("s2-cal", t, e.t0 + 0.3, 540, 1040, { s: 1 });
        T("s2-cal", 540, 1040, { s: 1 + (t > b && t < b + 0.4 ? 0.06 * Math.sin((t - b) / 0.4 * Math.PI) : 0) });
        pop("s2-banda", t, c["c2-estado"], 540, 1262, { s: 0.85 });
        sube("c2-c", t, c["c2-31"]); sube("c2-a", t, c["c2-25"]); sube("c2-b", t, c["c2-25"] + 0.3);
        pop("s2-nota", t, c["c2-25"] - 0.1, 545, 1350, { s: 0.8, r: -4 });
        persona("s2-padre", t, { x: 200, y: 1440, s: 0.8, mira: 1, vivo: true, boca: [[0, "seria"], [c["c2-31"], "o"]], ojos: [[0, "normal"], [c["c2-31"], "grandes"]],
          brazo: [[0, "abajo"], [c["c2-31"] + 0.3, "piensa"]], incl: [[0, 0], [c["c2-31"], 6]], fase: 1 });
        persona("s2-hijo", t, { x: 880, y: 1440, s: 0.8, mira: -1, vivo: true, charla: e, boca: habla(t, e),
          brazo: [[0, "abajo"], [c["c2-horas"], "hombros"], [c["c2-estado"], "senala"], [c["c2-25"], "arriba"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c2-31"], e.c["c2-25"]]); } },

    // 3 · Padre (calle, con un bloque en venta): «¿Y el piso? ¡Yo me dejé los cuernos para pagarlo!»
    { n: 3, set: "vacio",
      svg: `<g id="s3-bl" transform="translate(620 1300)">${bloque("s3-b", 7, 320)}</g><g id="s3-car">${cartel("s3-cv", "SE VENDE", C.rojo)}</g>${dos("s3", LLAVES)}`,
      tarjeta: tarjeta(3, "Padre", `<div class="tit">«¿Y el <mark id="m3">piso</mark>?»</div>`, { tono: "pasado" }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("calle", "oficina", t, e.t0);
        for (let k = 0; k < 7; k++) attr(`s3-b-p${k}`, "transform", `translate(0 ${-k * 70})`); attr("s3-b-tejado", "transform", "translate(0 -490)");
        T("s3-car", 620, 700 + 6 * Math.sin(t * 2), { s: 0.62, r: 2 * Math.sin(t * 1.7) });
        marca("m3", t, c["c3-piso"]);
        const p = ruta(t, [[e.t0 + 0.1, 40], [e.t0 + 1.0, 230]]);
        persona("s3-padre", t, { x: p.x, y: 1440, s: 0.8, anda: p.anda, mira: 1, vivo: true, charla: e, salta: c["c3-cuernos"], boca: habla(t, e, "seria"),
          brazo: [[0, "abajo"], [c["c3-piso"], "arriba"], [c["c3-cuernos"] + 0.6, "senala"]], fase: 1 });
        const h = ruta(t, [[e.t0 + 0.3, 1120], [e.t0 + 1.2, 880]]);
        persona("s3-hijo", t, { x: h.x, y: 1440, s: 0.8, anda: h.anda, mira: -1, vivo: true, boca: "sonrisa", brazo: [[0, "abajo"], [c["c3-cuernos"], "hombros"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camSueno(t, e.t0); } },

    // 4 · Hijo (calle): «Tú lo pagabas con 4 años de sueldo. Yo, con 8 y medio. Y en 2006, con la burbuja, eran 11.»
    { n: 4, set: "vacio",
      svg: `<g transform="translate(860 1300) scale(.55)">${bloque("s4-b", 7, 320)}</g>${panel(250, 800, 580, 380)}
        ${D.piso.map((v, i) => `<g transform="translate(330 ${900 + i * 110})">${rot(-14, -14, ["1986", "2006", "2026"][i], 26, C.gris, "", "end")}
          ${Array.from({ length: Math.ceil(v) }, (_, k) => `<g id="s4-a${i}-${k}" transform="translate(${k * 30} 0) scale(.48)">${anyoIcono(`s4-ai${i}-${k}`, i === 2 ? C.azul : "#D9A75A")}</g>`).join("")}
          <g id="s4-v${i}">${rot(480, -12, es(v) + " años", 30, i === 2 ? C.azul : "#8A6316", "", "end")}</g></g>`).join("")}
        ${rot(540, 1158, "AÑOS DE SUELDO LIMPIO POR UN PISO DE 90 M²", 20, C.gris)}${dos("s4")}`,
      tarjeta: tarjeta(4, "Piso de 90 m², en años de sueldo limpio", `${vs3(4, D.piso.map((v) => es(v)), ["en 1986", "en 2006", "en 2026"])}
        <div class="nota">En 2016, ${es(D.piso16)} años. Sueldo medio neto de cada año; valor tasado de la vivienda</div>`, { fuente: F_PISO, icono: bandera(44) }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("calle", null, t, 0);
        for (let k = 0; k < 7; k++) attr(`s4-b-p${k}`, "transform", `translate(0 ${-k * 70})`); attr("s4-b-tejado", "transform", "translate(0 -490)");
        const tt = [c["c4-4"], c["c4-11"], c["c4-8"]];
        for (let i = 0; i < 3; i++) {
          const v = D.piso[i], n = Math.ceil(v);
          for (let k = 0; k < n; k++) {
            const t0 = tt[i] + k * 0.04, kk = (t - t0) / 0.22, ancho = k === n - 1 ? v - k : 1;
            if (kk < 0) { ver(`s4-a${i}-${k}`, false); continue; }
            ver(`s4-a${i}-${k}`, true);
            attr(`s4-a${i}-${k}`, "transform", `translate(${k * 30} ${(-50 * (1 - fuera(kk))).toFixed(1)}) scale(${(0.48 * ancho).toFixed(3)} ${(0.48 * rebote(kk)).toFixed(3)})`);
          }
          css(`s4-v${i}`, "opacity", clamp((t - tt[i] - 0.2) / 0.3));
        }
        sube("c4-a", t, tt[0]); sube("c4-b", t, tt[1]); sube("c4-c", t, tt[2]);
        persona("s4-padre", t, { x: 145, y: 1440, s: 0.8, mira: 1, vivo: true, boca: [[0, "sonrisa"], [c["c4-8"], "o"], [c["c4-11"], "seria"]], ojos: [[0, "normal"], [c["c4-8"], "grandes"]],
          brazo: [[0, "abajo"], [c["c4-8"] + 0.2, "piensa"]], fase: 1 });
        persona("s4-hijo", t, { x: 910, y: 1440, s: 0.8, mira: -1, vivo: true, charla: e, boca: habla(t, e), brazo: [[0, "abajo"], [c["c4-4"] - 0.2, "senala"], [c["c4-8"], "arriba"], [c["c4-11"], "hombros"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c4-8"], e.c["c4-11"]]); } },

    // 5 · Padre (gasolinera): «Bueno, pero llenar el depósito…»
    { n: 5, set: "vacio",
      svg: `<g id="s5-pant"><rect x="-40" y="-14" width="80" height="22" rx="4" fill="#7FB3A0"/></g>${dos("s5", MANGUERA)}`,
      tarjeta: tarjeta(5, "Padre", `<div class="tit">«¿Y llenar el <mark id="m5">depósito</mark>?»</div>`, { tono: "pasado" }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("gasolinera", "calle", t, e.t0);
        const p = ruta(t, [[e.t0 + 0.1, 60], [e.t0 + 0.9, 230]]);
        ver("s5-mp", t > e.t0 + 0.9);
        T("s5-pant", 330, 1010, { op: t > e.t0 + 0.9 ? (0.5 + 0.5 * Math.abs(Math.sin(t * 14))).toFixed(2) : 0 });
        marca("m5", t, c["c5-deposito"]);
        persona("s5-padre", t, { x: p.x, y: 1440, s: 0.8, anda: p.anda, mira: 1, vivo: true, charla: e, boca: habla(t, e, "sonrisa"), brazo: [[0, "abajo"], [e.t0 + 0.9, "empuja"]], fase: 1 });
        persona("s5-hijo", t, { x: 880, y: 1440, s: 0.8, mira: -1, vivo: true, boca: "sonrisa", brazo: [[0, "abajo"], [c["c5-deposito"], "piensa"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camSueno(t, e.t0); } },

    // 6 · Hijo (gasolinera): «Un depósito de gasóleo: 5 horas de trabajo en 1986. Hoy, casi 6.»
    { n: 6, set: "vacio",
      svg: `${panel(270, 830, 540, 380)}${filas("s6", D.deposito, ["1986", "2006", "2026"], { x0: 395, y0: 930, dy: 105, r: 25, paso: 58, xv: 415 })}
        ${rot(540, 1190, "HORAS DE TRABAJO PARA 50 LITROS DE GASÓLEO", 20, C.gris)}${dos("s6", MANGUERA)}`,
      tarjeta: tarjeta(6, "Llenar el depósito de gasóleo, en horas de trabajo", `${vs3(6, D.deposito.map((v) => es(v) + "&nbsp;h"), ["en 1986", "en 2006", "en 2026"])}
        <div class="nota">50 litros. En 2016, ${es(D.deposito16)} horas. 2026, con los impuestos de la ley</div>`, { fuente: F_GAS, icono: bandera(44) }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("gasolinera", null, t, 0);
        const tt = [c["c6-5"], c["c6-1986"] + 0.2, c["c6-6"]];
        for (let i = 0; i < 3; i++) {
          const v = D.deposito[i], k = fuera((t - tt[i]) / 0.6) * v;
          for (let j = 0; j < Math.ceil(v); j++) cuna(`s6-f${i}-${j}-w`, k - j, 25 * 0.84);
          css(`s6-v${i}`, "opacity", clamp((t - tt[i] - 0.3) / 0.3));
        }
        sube("c6-a", t, tt[0]); sube("c6-b", t, tt[1]); sube("c6-c", t, tt[2]);
        persona("s6-padre", t, { x: 145, y: 1440, s: 0.8, mira: 1, vivo: true, boca: [[0, "seria"], [c["c6-6"] + 0.2, "o"]], ojos: [[0, "normal"], [c["c6-6"] + 0.2, "grandes"]], brazo: [[0, "empuja"], [c["c6-6"] + 0.3, "abajo"]], fase: 1 });
        persona("s6-hijo", t, { x: 910, y: 1440, s: 0.8, mira: -1, vivo: true, charla: e, boca: habla(t, e), brazo: [[0, "abajo"], [c["c6-gasoleo"], "senala"], [c["c6-6"], "arriba"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c6-6"]]); } },

    // 7 · Padre (salón): «¿Y la factura de la luz?»
    { n: 7, set: "vacio",
      svg: `<g id="s7-bom" transform="translate(560 720) scale(.9)">${bombilla("s7-b")}</g>${dos("s7")}`,
      tarjeta: tarjeta(7, "Padre", `<div class="tit">«¿Y la <mark id="m7">luz</mark>?»</div>`, { tono: "pasado" }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("cuarto", "gasolinera", t, e.t0);
        const on = t > c["c7-luz"];
        css("s7-b-halo", "opacity", on ? (0.55 + 0.05 * Math.sin(t * 20)).toFixed(2) : 0);
        attr("s7-b-fil", "stroke", on ? "#F2B33D" : "#B8A47A");
        T("s7-bom", 560 + 10 * Math.sin(t * 1.8), 720, { s: 0.9, r: 3 * Math.sin(t * 1.8) });
        marca("m7", t, c["c7-luz"]);
        const p = ruta(t, [[e.t0 + 0.1, 80], [e.t0 + 0.9, 230]]);
        persona("s7-padre", t, { x: p.x, y: 1440, s: 0.8, anda: p.anda, mira: 1, vivo: true, charla: e, boca: habla(t, e, "seria"), brazo: [[0, "abajo"], [c["c7-luz"] - 0.2, "arriba"]], fase: 1 });
        persona("s7-hijo", t, { x: 880, y: 1440, s: 0.8, mira: -1, vivo: true, boca: "sonrisa", ojos: [[0, "normal"], [c["c7-luz"], "felices"]], brazo: [[0, "abajo"], [c["c7-luz"] + 0.2, "hombros"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camSueno(t, e.t0); } },

    // 8 · Hijo (salón): «47 horas de trabajo al año en 2006. Hoy, 61. Algo menos que en 2016, eso sí.»
    { n: 8, set: "vacio",
      svg: `${panel(250, 800, 580, 420)}<g transform="translate(340 1010) scale(.62)">${contadorLuz("s8-ct")}</g>
        ${D.luz.map((v, i) => `<rect id="s8-r${i}" x="${470 + i * 110}" y="${1130 - v * 4}" width="80" height="${v * 4}" rx="10" fill="${i === 2 ? C.azul : "#D9A75A"}"/>
          <g id="s8-v${i}">${rot(510 + i * 110, 1116 - v * 4, Math.round(v) + " h", 30, i === 2 ? C.azul : "#8A6316")}</g>${rot(510 + i * 110, 1166, ["2006", "2016", "2025"][i], 24, C.gris)}`).join("")}
        ${rot(540, 1204, "HORAS DE TRABAJO PARA LA LUZ DE UN AÑO", 20, C.gris)}${dos("s8")}`,
      tarjeta: tarjeta(8, "La luz de casa de un año, en horas de trabajo", `${vs3(8, D.luz.map((v) => Math.round(v) + "&nbsp;h"), ["en 2006", "en 2016", "en 2025"])}
        <div class="nota">Una casa que gasta 3.500 kWh al año. 2025, último año entero</div>`, { fuente: F_LUZ, icono: bandera(44) }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("cuarto", null, t, 0);
                attr("s8-ct-disco", "transform", `rotate(${(t * 240) % 360} 0 40) translate(0 0)`);
        const tt = [c["c8-47"], c["c8-2016"] - 0.1, c["c8-61"]];
        for (let i = 0; i < 3; i++) { const k = suave((t - tt[i]) / 0.5), h = D.luz[i] * 4 * k; attr(`s8-r${i}`, "y", (1130 - h).toFixed(1)); attr(`s8-r${i}`, "height", h.toFixed(1)); css(`s8-v${i}`, "opacity", clamp((t - tt[i] - 0.3) / 0.3)); }
        sube("c8-a", t, tt[0]); sube("c8-b", t, tt[1]); sube("c8-c", t, tt[2]);
        persona("s8-padre", t, { x: 145, y: 1440, s: 0.8, mira: 1, vivo: true, boca: [[0, "seria"], [c["c8-61"], "o"], [c["c8-2016"], "sonrisa"]], ojos: [[0, "normal"], [c["c8-61"], "grandes"], [c["c8-2016"], "normal"]],
          brazo: [[0, "abajo"], [c["c8-2016"] + 0.2, "senala"]], fase: 1 });
        persona("s8-hijo", t, { x: 910, y: 1440, s: 0.8, mira: -1, vivo: true, charla: e, boca: habla(t, e), brazo: [[0, "abajo"], [c["c8-47"], "senala"], [c["c8-2016"], "hombros"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c8-61"]]); } },

    // 9 · Padre (súper, con el carro): «Hombre, la compra estará igual.»
    { n: 9, set: "vacio",
      svg: `<g id="s9-carro">${carro("s9-c")}</g>${dos("s9")}`,
      tarjeta: tarjeta(9, "Padre", `<div class="tit">«La <mark id="m9">compra</mark> estará igual»</div>`, { tono: "pasado" }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("super", "cuarto", t, e.t0);
        const p = ruta(t, [[e.t0 + 0.1, -60], [c["c9-compra"] + 0.4, 260]]);
        T("s9-carro", p.x + 210, 1452, { s: 0.75 });
        marca("m9", t, c["c9-compra"]);
        persona("s9-padre", t, { x: p.x, y: 1440, s: 0.8, anda: p.anda, mira: 1, vivo: true, charla: e, boca: habla(t, e, "sonrisa"), brazo: [[0, "empuja"], [c["c9-compra"] + 0.5, "hombros"]], fase: 1 });
        const h = ruta(t, [[e.t0 + 0.4, 1120], [e.t0 + 1.3, 880]]);
        persona("s9-hijo", t, { x: h.x, y: 1440, s: 0.8, anda: h.anda, mira: -1, vivo: true, boca: "seria", espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camSueno(t, e.t0); } },

    // 10 · Hijo (súper): «La comida de un mes: 11 horas de trabajo en 2006. Hoy, 12.»
    { n: 10, set: "vacio",
      svg: `${panel(250, 830, 600, 380)}${filas("s10", D.compra, ["2006", "2016", "2026"], { x0: 350, y0: 930, dy: 105, r: 14, paso: 30, xv: 462 })}
        ${rot(540, 1190, "HORAS DE TRABAJO PARA LA COMIDA DE UN MES", 20, C.gris)}<g transform="translate(-40 1452) scale(.75)">${carro("s10-c")}</g>${dos("s10")}`,
      tarjeta: tarjeta(10, "La comida de un mes por persona, en horas de trabajo", `${vs3(10, D.compra.map((v) => es(v) + "&nbsp;h"), ["en 2006", "en 2016", "en 2026"])}
        <div class="nota">La misma cesta en todos los años: el gasto medio en comida de 2025, con los precios de cada año</div>`, { fuente: F_COM, icono: bandera(44) }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("super", null, t, 0);
        const tt = [c["c10-11"], c["c10-2006"] + 0.2, c["c10-12"]];
        for (let i = 0; i < 3; i++) {
          const v = D.compra[i], k = fuera((t - tt[i]) / 0.6) * v;
          for (let j = 0; j < Math.ceil(v); j++) cuna(`s10-f${i}-${j}-w`, k - j, 14 * 0.84);
          css(`s10-v${i}`, "opacity", clamp((t - tt[i] - 0.3) / 0.3));
        }
        sube("c10-a", t, tt[0]); sube("c10-b", t, tt[1]); sube("c10-c", t, tt[2]);
        persona("s10-padre", t, { x: 150, y: 1440, s: 0.8, mira: 1, vivo: true, boca: [[0, "sonrisa"], [c["c10-12"], "o"]], ojos: [[0, "normal"], [c["c10-12"], "grandes"]], brazo: [[0, "empuja"], [c["c10-12"], "abajo"]], fase: 1 });
        persona("s10-hijo", t, { x: 935, y: 1440, s: 0.8, mira: -1, vivo: true, charla: e, boca: habla(t, e), brazo: [[0, "abajo"], [c["c10-comida"], "senala"], [c["c10-12"], "arriba"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c10-12"]]); } },

    // 11 · Hijo, a cámara (cocina): «¿Quién lo tiene más difícil, tus padres o tú? ¿Tú qué opinas?»
    { n: 11, set: "vacio",
      svg: `${boton("s11-b1", "PADRES", "#C8902E", 300)}${boton("s11-b2", "HIJOS", "#1F5F8B", 260)}${bocadillo("s11-boc")}${dos("s11")}`,
      tarjeta: tarjeta(11, "Te toca", `<div class="tit" style="font-size:62px">¿Quién lo tiene <mark id="m11">más difícil</mark>: tus padres o tú?</div><div class="sub" id="c11-sub">¿Tú qué opinas? Te leo en los comentarios.</div>`),
      fn: function (t, e) {
        const c = e.c;
        ambiente("cocina", "super", t, e.t0);
        pop("s11-b1", t, c["c11-padres"], 320, 880, { s: 0.9 }); pop("s11-b2", t, c["c11-tu"], 760, 880, { s: 0.9 });
        if (pop("s11-boc", t, c["c11-boc"], 540, 1120, { s: 0.75 }) >= 0) for (let i = 0; i < 3; i++) attr("s11-boc-p" + i, "cy", (-6 - 16 * Math.max(0, Math.sin((t - c["c11-boc"]) * 8 - i * 0.9))).toFixed(1));
        marca("m11", t, c["c11-dificil"]); sube("c11-sub", t, c["c11-boc"] - 0.2);
        const p = ruta(t, [[e.t0 + 0.2, 150], [e.t0 + 0.9, 230]]), h = ruta(t, [[e.t0 + 0.2, 900], [e.t0 + 0.9, 850]]);
        persona("s11-padre", t, { x: p.x, y: 1440, s: 0.8, anda: p.anda, mira: [[0, 1], [c["c11-boc"], 0]], vivo: true, salta: c["c11-padres"] + 0.1, boca: "sonrisa", brazo: [[0, "abajo"], [c["c11-padres"], "senala"], [c["c11-boc"], "hombros"]], fase: 1 });
        persona("s11-hijo", t, { x: h.x, y: 1440, s: 0.8, anda: h.anda, mira: [[0, -1], [c["c11-boc"], 0]], vivo: true, charla: e, salta: c["c11-tu"] + 0.1, boca: habla(t, e), brazo: [[0, "abajo"], [c["c11-tu"], "senala"], [c["c11-boc"], "arriba"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c11-padres"], e.c["c11-tu"]]); } },
  ];
}
