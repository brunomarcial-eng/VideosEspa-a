// Escenas de T14 («¿Cuántos minutos trabajas para desayunar?», serie «¿Cuántas horas…?», 2016 frente a hoy) en estilo «limpio».
// Bruno, 22-11-2026. Personajes inventados, con voces del catálogo (docs/voces-catalogo.md):
//   · «madre»: unos 45 años, jersey mostaza (voz «medica»).
//   · «hijo»: 15 años, en pijama de rayas, más bajo (voz «alumno»).
//   · «tendera»: unos 62 años, con canas y delantal (voz «hostelera»).
// Decorados nuevos (diseno/desayuno.mjs): cocina → tienda de barrio → cocina. Los minutos se cuentan con relojes de cocina.
/* eslint-disable no-undef */

import { C, persona, tarjeta, nomina, TAZA } from "../../diseno/limpio.mjs";
import { bandera } from "../../diseno/barrio.mjs";
import { ambientes } from "../../diseno/sueno.mjs";
import { DECORADOS_T14, P, relojCocina, DELANTAL, PIJAMA_RAYAS, BOTE_CACAO_MANO, CAFE_MANO, PAN_MANO, CHURRO_MANO, BOLSO } from "../../diseno/desayuno.mjs";

export const ESTILO = "limpio";
const F_MIN = "Cálculo propio · INE (Encuesta de Presupuestos Familiares y Encuesta de Estructura Salarial)";
const F_SUB = "Cálculo propio · INE (Encuesta de Estructura Salarial, Encuesta Trimestral de Coste Laboral y Encuesta de Presupuestos Familiares)";
const F_SUELDO = "Cálculo propio · INE (Encuesta de Estructura Salarial y Encuesta Trimestral de Coste Laboral) · Eurostat (impuestos sobre el salario)";
const F_BAR = "Cálculo propio · INE (IPC y Encuesta de Estructura Salarial)";

export function datos(d) {
  const p = d.productos, m = (k) => [p[k].minutos_mediana["2016"], p[k].minutos_mediana["2025"]];
  return {
    cacao: m("cacao"), cafe: m("cafe"), cafe19: p.cafe.minutos_mediana["2019"], huevos: m("huevos"), aceite: m("aceite"), pan: m("pan"),
    sueldoSube: d.sueldo.mediana_sube_pct, huevosSube: p.huevos.precio_sube_pct,
    sueldo: [d.sueldo.neto_hora_mediana["2016"], d.sueldo.neto_hora_mediana["2025"]], huevosEur: [p.huevos.precio_paquete_eur["2016"], p.huevos.precio_paquete_eur["2025"]],
    mas: d.mas_minutos_que_en_2016, igual: d.casi_igual, orden: d.orden_por_subida_en_minutos,
    bruto: [d.sueldo.bruto_anual_mediano["2016"], d.sueldo.bruto_anual_mediano["2025"]], bruto24: d.sueldo.bruto_anual_mediano["2024"],
    neto: [d.sueldo.neto_anual_mediano["2016"], d.sueldo.neto_anual_mediano["2025"]],
    tostada: [d.tostada_aguacate_salmon.minutos_mediana["2016"], d.tostada_aguacate_salmon.minutos_mediana["2025"]], aguacate: d.tostada_aguacate_salmon.subida_precio_grupo_pct.aguacate,
    barSube: d.bar.precios_suben_pct, barTiempo: d.bar.tiempo_sube_pct,
  };
}

export const capas = () => ambientes(DECORADOS_T14);

// ------------------------------------------------------------------ personajes (inventados), con volumen
const MADRE = { pelo: "largo", canas: false, barba: false, colorPelo: "#4A2E22", ropa: ["#E0B04A", "#C4962F"], piel: "#F2CBA8", volumen: true };
const HIJO = { pelo: "corto", canas: false, barba: false, colorPelo: "#3B2A20", ropa: ["#7FA4B0", "#668A96"], piel: "#EBC3A0", volumen: true, encima: PIJAMA_RAYAS };
const TENDERA = { pelo: "largo", canas: true, barba: false, colorPelo: "#8E857A", ropa: ["#5E8C99", "#4A7480"], piel: "#E9BE98", volumen: true, encima: DELANTAL };
const QUIEN = { m: MADRE, h: HIJO, t: TENDERA };
const gente = (n, quien, manos = {}) => quien.split("").map((k) => persona(`${n}-${k}`, "hoy", { ...QUIEN[k], mano: manos[k] ? `<g id="${n}-${k}-mano">${manos[k]}</g>` : undefined })).join("");
const NOMINA_MANO = `<g transform="translate(10 -50) scale(.6)">${nomina("nm14")}</g>`;

// ------------------------------------------------------------------ piezas de los datos
const ANTES = "#C8902E", ANTES_T = "#8A6316", HOY = "#B3261E";
const panel = (x, y, w, h) => `<rect x="${x + 8}" y="${y + 12}" width="${w}" height="${h}" rx="26" fill="#3C2814" opacity=".10"/><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="26" fill="#FFFDF8" opacity=".96"/>`;
const rot = (x, y, t, tam, color, id = "", ancla = "middle") => `<text ${id ? `id="${id}"` : ""} x="${x}" y="${y}" text-anchor="${ancla}" font-family="Cap" font-weight="800" font-size="${tam}" fill="${color}">${t}</text>`;
const es = (v, d = 1) => v.toFixed(d).replace(".", ",");
const miles = (v) => String(Math.round(v)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
const vs = (n, vals, labs, tam = 72) => `<div class="vs">${vals.map((v, i) => `<div class="col"><div class="v ${i ? "t-hoy" : "t-pasado"}" id="c${n}-${"ab"[i]}" style="font-size:${tam}px">${v}</div><div class="n">${labs[i]}</div></div>`).join("")}</div>`;
// Dos relojes de cocina (2016 y 2025) con el producto en medio. Los minutos se pintan al decir cada cifra.
const relojes = (n, prod, vals, dec = 0, arriba = null) => `${panel(255, 790, 570, 450)}
  ${arriba ?? `<g transform="translate(540 905)">${P[prod](0.62)}</g>`}
  ${[0, 1].map((i) => `<g id="s${n}-g${i}" transform="translate(${400 + i * 280} 1040)">${relojCocina(`s${n}-r${i}`, 92, i ? "#D86B5B" : ANTES)}
    ${rot(0, 138, ["2016", "2025"][i], 26, C.gris)}<g id="s${n}-v${i}">${rot(0, 176, es(vals[i], dec) + " MIN", 28, i ? HOY : ANTES_T)}</g></g>`).join("")}`;

export function escenas(D) {
  return [
    // 1 · La madre (cocina): «¿Cuántos minutos tienes que trabajar para pagarte el desayuno? Te lo adelanto: más que en 2016.»
    { n: 1, set: "vacio",
      svg: `${Array.from({ length: 6 }, (_, k) => `<circle id="s1-h${k}" r="${10 + k * 3}" fill="#FFFFFF" opacity="0"/>`).join("")}${gente("s1", "m", { m: TAZA })}`,
      tarjeta: tarjeta(1, "Desayuno · 2016 frente a hoy", `<div class="tit" style="font-size:64px">¿Cuántos <mark id="m1">minutos</mark> trabajas para desayunar?</div>`, { icono: bandera(44) }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("cocinaDesayuno", null, t, 0);
        marca("m1", t, c["c1-minutos"]);
        // Vapor de la cafetera
        for (let k = 0; k < 6; k++) { const kk = (t * 0.7 + k / 6) % 1; T(`s1-h${k}`, 376 + Math.sin(kk * 6 + k) * 14, 930 - kk * 200, { s: 0.6 + kk, op: (0.55 * (1 - kk)).toFixed(2) }); }
        persona("s1-m", t, { x: 760, y: 1440, s: 0.82, mira: [[0, -1], [c["c1-minutos"], 0]], vivo: true, charla: e, boca: habla(t, e, "sonrisa"),
          ojos: [[0, "normal"], [c["c1-2016"], "grandes"]], brazo: [[0, "sujeta"], [c["c1-2016"] - 0.3, "hombros"]], fase: 1 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c1-minutos"], e.c["c1-2016"]]); } },

    // 2 · La madre (cocina), con la nómina: «Ojo: contamos con el sueldo mediano: 19.400 euros brutos al año en 2016 y 25.300 hoy. Si ganas el doble, la mitad de minutos.»
    { n: 2, set: "vacio",
      svg: `${panel(110, 790, 640, 450)}${rot(430, 850, "SUELDO MEDIANO: LA MITAD GANA MÁS", 22, C.tinta)}${rot(530, 900, "2016", 26, C.gris)}${rot(680, 900, "2025*", 26, C.gris)}
        ${[["BRUTO AL AÑO", D.bruto.map((v) => miles(v) + " €")], ["NETO AL AÑO", D.neto.map((v) => miles(v) + " €")], ["NETO POR HORA", D.sueldo.map((v) => es(v, 2) + " €")]].map(([et, vals], i) => `<g id="s2-f${i}" transform="translate(0 ${975 + i * 82})">
          <rect x="130" y="-46" width="600" height="68" rx="14" fill="${i === 2 ? "#FFF3C4" : "#F3EFE6"}"/>${rot(150, 0, et, 20, C.tinta, "", "start")}
          ${rot(530, 2, vals[0], 25, ANTES_T)}${rot(680, 2, vals[1], 25, HOY)}</g>`).join("")}
        ${rot(430, 1222, "*2025, ESTIMADO (2024: " + miles(D.bruto24) + " €)", 17, C.gris)}
        ${gente("s2", "m", { m: NOMINA_MANO })}`,
      tarjeta: tarjeta(2, "Sueldo bruto mediano al año", `${vs(2, D.bruto.map((v) => miles(v) + "&nbsp;€"), ["en 2016", "en 2025"], 66)}
        <div class="nota">Neto: ${miles(D.neto[0])}&nbsp;€ y ${miles(D.neto[1])}&nbsp;€ al año; ${es(D.sueldo[0], 2)}&nbsp;€ y ${es(D.sueldo[1], 2)}&nbsp;€ por hora. 2025, estimado: el último dato del INE es de 2024 (${miles(D.bruto24)}&nbsp;€)</div>`, { fuente: F_SUELDO, icono: bandera(44) }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("cocinaDesayuno", null, t, 0);
        const tt = [c["c2-19400"] - 0.2, c["c2-25300"] - 0.6, c["c2-25300"] + 0.2];
        for (let i = 0; i < 3; i++) css(`s2-f${i}`, "opacity", clamp((t - tt[i]) / 0.3));
        sube("c2-a", t, c["c2-19400"]); sube("c2-b", t, c["c2-25300"]);
        persona("s2-m", t, { x: 940, y: 1440, s: 0.8, mira: -1, vivo: true, charla: e, boca: habla(t, e, "seria"),
          brazo: [[0, "abajo"], [c["c2-mediano"] - 0.3, "arriba"], [c["c2-doble"] - 0.2, "hombros"]], espejo: true, fase: 1 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c2-19400"], e.c["c2-25300"]]); } },

    // 3 · El hijo (cocina), con el bote vacío: «Mamá, ¡que no queda cacao!»
    { n: 3, set: "vacio",
      svg: gente("s3", "mh", { m: BOLSO, h: BOTE_CACAO_MANO }),
      tarjeta: tarjeta(3, "El hijo", `<div class="tit">«¡Que no queda <mark id="m3">cacao</mark>!»</div>`, { tono: "hoy" }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("cocinaDesayuno", null, t, 0);
        marca("m3", t, c["c3-cacao"]);
        const h = ruta(t, [[e.t0 + 0.05, 1250], [e.t0 + 0.9, 860]]);
        persona("s3-h", t, { x: h.x, y: 1440, s: 0.66, anda: h.anda, mira: -1, vivo: true, charla: e, salta: c["c3-cacao"] - 0.1, boca: habla(t, e, "grande"),
          brazo: [[0, "arriba"]], incl: [[0, 0], [c["c3-cacao"], -8]], espejo: true, fase: 2 });
        const sac = t > c["c3-cacao"] ? Math.sin((t - c["c3-cacao"]) * 22) * 10 * Math.max(0, 1 - (t - c["c3-cacao"]) * 0.8) : 0;
        attr("s3-h-mano", "transform", `rotate(${sac.toFixed(1)})`);
        persona("s3-m", t, { x: 300, y: 1440, s: 0.82, mira: 1, vivo: true, boca: [[0, "seria"], [c["c3-cacao"] + 0.3, "o"]], ojos: [[0, "normal"], [c["c3-cacao"] + 0.3, "grandes"]],
          brazo: [[0, "abajo"], [c["c3-cacao"] + 0.6, "sujeta"]], fase: 1 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c3-cacao"]], { acerca: 0.07 }); } },

    // 4 · La tendera (tienda): «Buenos días. El kilo de chocolate y cacao: 55 minutos de trabajo. En 2016, 40.»
    { n: 4, set: "vacio",
      svg: `${relojes(4, "cacao", D.cacao)}${gente("s4", "mt")}`,
      tarjeta: tarjeta(4, "Minutos de trabajo para pagar 1 kg de chocolate y cacao", `${vs(4, D.cacao.map((v) => es(v, 0) + "&nbsp;min"), ["en 2016", "en 2025"])}
        <div class="nota">Lo que pagan de media los hogares, con el sueldo neto mediano por hora</div>`, { fuente: F_MIN, icono: bandera(44) }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("tiendaBarrio", "cocinaDesayuno", t, e.t0);
        const R = 92, sector = (f) => { if (f < 0.002) return ""; if (f > 0.999) f = 0.999; const a = f * 2 * Math.PI; return `M0 0 L0 ${-R} A${R} ${R} 0 ${f > 0.5 ? 1 : 0} 1 ${(R * Math.sin(a)).toFixed(1)} ${(-R * Math.cos(a)).toFixed(1)} Z`; };
        const tt = [c["c4-40"] - 0.3, c["c4-55"] - 0.4];
        for (let i = 0; i < 2; i++) {
          const k = suave((t - tt[i]) / 0.9), f = D.cacao[i] / 60 * k;
          css(`s4-g${i}`, "opacity", clamp((t - tt[i] + 0.4) / 0.3)); attr(`s4-r${i}-v`, "d", sector(f)); attr(`s4-r${i}-ag`, "transform", `rotate(${(360 * f).toFixed(1)})`);
          css(`s4-v${i}`, "opacity", clamp((t - tt[i] - 0.8) / 0.3));
        }
        sube("c4-b", t, c["c4-55"]); sube("c4-a", t, c["c4-40"]);
        const w = ruta(t, [[e.t0 + 0.1, -300], [e.t0 + 1.3, 175]]);
        persona("s4-m", t, { x: w.x, y: 1440, s: 0.82, anda: w.anda, mira: 1, vivo: true, boca: [[0, "sonrisa"], [c["c4-55"] + 0.3, "o"]], brazo: [[0, "abajo"]], fase: 1 });
        persona("s4-t", t, { x: 935, y: 1440, s: 0.8, mira: -1, vivo: true, charla: e, boca: habla(t, e, "sonrisa"), brazo: [[0, "saluda"], [c["c4-55"] - 0.4, "senala"], [c["c4-40"], "hombros"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c4-55"], e.c["c4-40"]]); } },

    // 5 · El hijo (tienda), muy digno: «Pues me paso al café, como los mayores.»
    { n: 5, set: "vacio",
      svg: gente("s5", "mth", { h: CAFE_MANO }),
      tarjeta: tarjeta(5, "El hijo", `<div class="tit">«Me paso al <mark id="m5">café</mark>»</div>`, { tono: "hoy" }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("tiendaBarrio", null, t, 0);
        marca("m5", t, c["c5-cafe"]);
        persona("s5-m", t, { x: 175, y: 1440, s: 0.82, mira: 1, vivo: true, boca: [[0, "seria"], [c["c5-mayores"], "sonrisa"]], ojos: [[0, "normal"], [c["c5-mayores"], "felices"]], brazo: [[0, "abajo"]], fase: 1 });
        persona("s5-t", t, { x: 935, y: 1440, s: 0.8, mira: -1, vivo: true, boca: [[0, "seria"], [c["c5-mayores"] + 0.2, "o"]], brazo: [[0, "abajo"], [c["c5-mayores"], "piensa"]], espejo: true, fase: 2 });
        persona("s5-h", t, { x: 560, y: 1440, s: 0.66, mira: [[0, 1], [c["c5-mayores"], 0]], vivo: true, charla: e, boca: habla(t, e, "sonrisa"),
          brazo: [[0, "abajo"], [c["c5-cafe"] - 0.3, "arriba"]], incl: [[0, 0], [c["c5-mayores"], 8]], fase: 3 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c5-cafe"]], { acerca: 0.07 }); } },

    // 6 · La tendera (tienda): «Tampoco te libras: el paquete de café, 15 minutos. En 2016, 13.»
    { n: 6, set: "vacio",
      svg: `${relojes(6, "cafe", D.cafe)}${gente("s6", "mt")}`,
      tarjeta: tarjeta(6, "Minutos de trabajo para pagar un paquete de café de 250 g", `${vs(6, D.cafe.map((v) => es(v, 0) + "&nbsp;min"), ["en 2016", "en 2025"])}
        <div class="nota">En 2019 salía algo más barato: ${es(D.cafe19, 0)} minutos</div>`, { fuente: F_MIN, icono: bandera(44) }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("tiendaBarrio", null, t, 0);
        const R = 92, sector = (f) => { if (f < 0.002) return ""; if (f > 0.999) f = 0.999; const a = f * 2 * Math.PI; return `M0 0 L0 ${-R} A${R} ${R} 0 ${f > 0.5 ? 1 : 0} 1 ${(R * Math.sin(a)).toFixed(1)} ${(-R * Math.cos(a)).toFixed(1)} Z`; };
        const tt = [c["c6-13"] - 0.3, c["c6-15"] - 0.4];
        for (let i = 0; i < 2; i++) {
          const k = suave((t - tt[i]) / 0.8), f = D.cafe[i] / 60 * k;
          css(`s6-g${i}`, "opacity", clamp((t - tt[i] + 0.4) / 0.3)); attr(`s6-r${i}-v`, "d", sector(f)); attr(`s6-r${i}-ag`, "transform", `rotate(${(360 * f).toFixed(1)})`);
          css(`s6-v${i}`, "opacity", clamp((t - tt[i] - 0.7) / 0.3));
        }
        sube("c6-b", t, c["c6-15"]); sube("c6-a", t, c["c6-13"]);
        persona("s6-m", t, { x: 175, y: 1440, s: 0.82, mira: 1, vivo: true, boca: [[0, "seria"], [c["c6-15"] + 0.3, "o"]], brazo: [[0, "abajo"]], fase: 1 });
        persona("s6-t", t, { x: 935, y: 1440, s: 0.8, mira: -1, vivo: true, charla: e, boca: habla(t, e, "seria"), brazo: [[0, "abajo"], [c["c6-libras"], "hombros"], [c["c6-15"] - 0.3, "senala"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c6-15"], e.c["c6-13"]]); } },

    // 7 · La tendera (tienda): «Y la docena de huevos, 14 minutos. En 2016, 10.»
    { n: 7, set: "vacio",
      svg: `${relojes(7, "huevos", D.huevos)}${gente("s7", "mt")}`,
      tarjeta: tarjeta(7, "Minutos de trabajo para pagar una docena de huevos", `${vs(7, D.huevos.map((v) => es(v, 0) + "&nbsp;min"), ["en 2016", "en 2025"])}
        <div class="nota">Lo que pagan de media los hogares, con el sueldo neto mediano por hora</div>`, { fuente: F_MIN, icono: bandera(44) }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("tiendaBarrio", null, t, 0);
        const R = 92, sector = (f) => { if (f < 0.002) return ""; if (f > 0.999) f = 0.999; const a = f * 2 * Math.PI; return `M0 0 L0 ${-R} A${R} ${R} 0 ${f > 0.5 ? 1 : 0} 1 ${(R * Math.sin(a)).toFixed(1)} ${(-R * Math.cos(a)).toFixed(1)} Z`; };
        const tt = [c["c7-10"] - 0.3, c["c7-14"] - 0.4];
        for (let i = 0; i < 2; i++) {
          const k = suave((t - tt[i]) / 0.8), f = D.huevos[i] / 60 * k;
          css(`s7-g${i}`, "opacity", clamp((t - tt[i] + 0.4) / 0.3)); attr(`s7-r${i}-v`, "d", sector(f)); attr(`s7-r${i}-ag`, "transform", `rotate(${(360 * f).toFixed(1)})`);
          css(`s7-v${i}`, "opacity", clamp((t - tt[i] - 0.7) / 0.3));
        }
        sube("c7-b", t, c["c7-14"]); sube("c7-a", t, c["c7-10"]);
        persona("s7-m", t, { x: 175, y: 1440, s: 0.82, mira: 1, vivo: true, boca: [[0, "seria"], [c["c7-14"] + 0.3, "o"]], ojos: [[0, "normal"], [c["c7-14"] + 0.3, "grandes"]], brazo: [[0, "abajo"], [c["c7-10"], "piensa"]], fase: 1 });
        persona("s7-t", t, { x: 935, y: 1440, s: 0.8, mira: -1, vivo: true, charla: e, boca: habla(t, e, "seria"), brazo: [[0, "abajo"], [c["c7-docena"] - 0.2, "senala"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c7-14"], e.c["c7-10"]]); } },

    // 8 · La madre (tienda), con la nómina: «¡Pero si me han subido el sueldo!»
    { n: 8, set: "vacio",
      svg: gente("s8", "tm", { m: NOMINA_MANO }),
      tarjeta: tarjeta(8, "La madre", `<div class="tit">«¡Pero si me han subido el <mark id="m8">sueldo</mark>!»</div>`, { tono: "hoy" }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("tiendaBarrio", null, t, 0);
        marca("m8", t, c["c8-sueldo"]);
        persona("s8-t", t, { x: 935, y: 1440, s: 0.8, mira: -1, vivo: true, boca: [[0, "seria"], [c["c8-sueldo"] + 0.3, "sonrisa"]], brazo: [[0, "abajo"], [c["c8-sueldo"] + 0.3, "hombros"]], espejo: true, fase: 2 });
        persona("s8-m", t, { x: 380, y: 1440, s: 0.82, mira: 1, vivo: true, charla: e, salta: c["c8-sueldo"] - 0.15, boca: habla(t, e, "grande"), ojos: [[0, "grandes"]], brazo: [[0, "sujeta"], [c["c8-sueldo"] - 0.3, "arriba"]], fase: 1 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c8-sueldo"]], { acerca: 0.07 }); } },

    // 9 · La tendera (tienda): «Un 26 % por hora, sí. Pero los huevos, un 74 %.»
    { n: 9, set: "vacio",
      svg: `${panel(255, 820, 570, 400)}${rot(540, 880, "LO QUE HA SUBIDO DESDE 2016", 22, C.tinta)}
        ${[["SUELDO NETO POR HORA", D.sueldoSube, "#5E8C99"], ["DOCENA DE HUEVOS", D.huevosSube, "#D86B5B"]].map(([et, v, col], i) => `<g transform="translate(300 ${985 + i * 125})">
          ${rot(0, -18, et, 20, C.gris, "", "start")}<rect x="0" y="0" width="390" height="46" rx="12" fill="#EEF0F2"/><rect id="s9-b${i}" x="0" y="0" width="0" height="46" rx="12" fill="${col}"/>
          <g id="s9-v${i}">${rot(400, 36, "+" + Math.round(v) + " %", 30, i ? HOY : "#3F6672", "", "start")}</g></g>`).join("")}
        ${rot(540, 1206, "SUELDO NETO MEDIANO POR HORA Y PRECIO MEDIO DE LA DOCENA", 15, C.gris)}${gente("s9", "mt")}`,
      tarjeta: tarjeta(9, "Lo que ha subido desde 2016", `${vs(9, ["+" + Math.round(D.sueldoSube) + "&nbsp;%", "+" + Math.round(D.huevosSube) + "&nbsp;%"], ["sueldo neto por hora", "docena de huevos"])}
        <div class="nota">Sueldo neto mediano por hora: de ${es(D.sueldo[0], 2)}&nbsp;€ a ${es(D.sueldo[1], 2)}&nbsp;€. Docena de huevos: de ${es(D.huevosEur[0], 2)}&nbsp;€ a ${es(D.huevosEur[1], 2)}&nbsp;€</div>`, { fuente: F_SUB, icono: bandera(44) }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("tiendaBarrio", null, t, 0);
        const tt = [c["c9-26"] - 0.2, c["c9-74"] - 0.2], v = [D.sueldoSube, D.huevosSube];
        for (let i = 0; i < 2; i++) {
          attr(`s9-b${i}`, "width", (Math.min(390, v[i] / 74 * 380) * suave((t - tt[i]) / 0.7)).toFixed(1));
          css(`s9-v${i}`, "opacity", clamp((t - tt[i] - 0.6) / 0.3));
        }
        sube("c9-a", t, c["c9-26"]); sube("c9-b", t, c["c9-74"]);
        persona("s9-m", t, { x: 175, y: 1440, s: 0.82, mira: 1, vivo: true, boca: [[0, "seria"], [c["c9-74"] + 0.3, "o"]], ojos: [[0, "normal"], [c["c9-74"] + 0.3, "grandes"]], brazo: [[0, "abajo"]], fase: 1 });
        persona("s9-t", t, { x: 935, y: 1440, s: 0.8, mira: -1, vivo: true, charla: e, boca: habla(t, e, "seria"), brazo: [[0, "abajo"], [c["c9-26"] - 0.2, "hombros"], [c["c9-74"] - 0.2, "senala"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c9-26"], e.c["c9-74"]]); } },

    // 10 · La tendera (tienda): «Eso sí: el pan y el aceite cuestan casi los mismos minutos que en 2016.»
    { n: 10, set: "vacio",
      svg: `${relojes(10, "aceite", D.aceite, 1, `<g transform="translate(400 915)">${P.aceite(0.5)}</g>`)}<g id="s10-ig">${rot(540, 1062, "=", 70, C.tinta)}</g>
        <g id="s10-pan" transform="translate(640 900)">${P.pan(0.42)}${rot(0, 26, "PAN: " + es(D.pan[0]) + " = " + es(D.pan[1]) + " MIN", 17, C.gris)}</g>${gente("s10", "mt")}`,
      tarjeta: tarjeta(10, "Minutos de trabajo para pagar un litro de aceite de oliva", `${vs(10, D.aceite.map((v) => es(v) + "&nbsp;min"), ["en 2016", "en 2025"])}
        <div class="nota">La barra de pan de 250 g: ${es(D.pan[1])} minutos en 2016 y en 2025</div>`, { fuente: F_MIN, icono: bandera(44) }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("tiendaBarrio", null, t, 0);
        const R = 92, sector = (f) => { if (f < 0.002) return ""; if (f > 0.999) f = 0.999; const a = f * 2 * Math.PI; return `M0 0 L0 ${-R} A${R} ${R} 0 ${f > 0.5 ? 1 : 0} 1 ${(R * Math.sin(a)).toFixed(1)} ${(-R * Math.cos(a)).toFixed(1)} Z`; };
        const tt = [c["c10-aceite"] - 0.2, c["c10-aceite"] - 0.2];
        for (let i = 0; i < 2; i++) {
          const k = suave((t - tt[i]) / 0.9), f = D.aceite[i] / 60 * k;
          css(`s10-g${i}`, "opacity", clamp((t - tt[i] + 0.4) / 0.3)); attr(`s10-r${i}-v`, "d", sector(f)); attr(`s10-r${i}-ag`, "transform", `rotate(${(360 * f).toFixed(1)})`);
          css(`s10-v${i}`, "opacity", clamp((t - tt[i] - 0.8) / 0.3));
        }
        pop("s10-ig", t, c["c10-mismos"] - 0.1, 0, 0, { s: 1 });
        pop("s10-pan", t, c["c10-pan"] - 0.1, 640, 900, { s: 1 });
        sube("c10-a", t, c["c10-mismos"]); sube("c10-b", t, c["c10-mismos"] + 0.2);
        persona("s10-m", t, { x: 175, y: 1440, s: 0.82, mira: 1, vivo: true, boca: [[0, "seria"], [c["c10-mismos"] + 0.3, "sonrisa"]], ojos: [[0, "normal"], [c["c10-mismos"] + 0.3, "felices"]], brazo: [[0, "abajo"]], fase: 1 });
        persona("s10-t", t, { x: 935, y: 1440, s: 0.8, mira: -1, vivo: true, charla: e, boca: habla(t, e, "sonrisa"), brazo: [[0, "abajo"], [c["c10-pan"] - 0.2, "senala"], [c["c10-mismos"], "hombros"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c10-mismos"]]); } },

    // 11 · El hijo (tienda), con la barra bajo el brazo: «Pues pan con aceite, como el abuelo. Desayuno de lujo.»
    { n: 11, set: "vacio",
      svg: gente("s11", "mth", { h: PAN_MANO }),
      tarjeta: tarjeta(11, "El hijo", `<div class="tit">«Pan con aceite, como el <mark id="m11">abuelo</mark>»</div>`, { tono: "hoy" }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("tiendaBarrio", null, t, 0);
        marca("m11", t, c["c11-abuelo"]);
        persona("s11-m", t, { x: 175, y: 1440, s: 0.82, mira: 1, vivo: true, boca: [[0, "seria"], [c["c11-lujo"], "sonrisa"]], brazo: [[0, "abajo"], [c["c11-abuelo"], "piensa"]], incl: [[0, 0], [c["c11-abuelo"], 8]], fase: 1 });
        persona("s11-t", t, { x: 935, y: 1440, s: 0.8, mira: -1, vivo: true, boca: [[0, "seria"], [c["c11-lujo"], "sonrisa"]], ojos: [[0, "normal"], [c["c11-lujo"], "felices"]], brazo: [[0, "abajo"]], espejo: true, fase: 2 });
        persona("s11-h", t, { x: 560, y: 1440, s: 0.66, mira: [[0, 1], [c["c11-lujo"], 0]], vivo: true, charla: e, salta: c["c11-lujo"] - 0.1, boca: habla(t, e, "sonrisa"), ojos: [[0, "normal"], [c["c11-lujo"], "felices"]],
          brazo: [[0, "abajo"], [c["c11-pan"] - 0.2, "sujeta"]], fase: 3 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c11-lujo"]], { acerca: 0.07 }); } },

    // 12 · La tendera (tienda): «¿Y la tostada de moda, con aguacate y salmón? 7,3 minutos. En 2016, 6,3.»
    { n: 12, set: "vacio",
      svg: `${relojes(12, "tostada", D.tostada, 1)}${gente("s12", "mt")}`,
      tarjeta: tarjeta(12, "Minutos de trabajo para pagar una tostada de aguacate, queso crema y salmón", `${vs(12, D.tostada.map((v) => es(v) + "&nbsp;min"), ["en 2016", "en 2025"])}
        <div class="nota">Receta: 50&nbsp;g de pan, 80&nbsp;g de aguacate, 25&nbsp;g de queso crema y 30&nbsp;g de salmón. Precio medio de cada grupo del INE: el aguacate va con el mango y otras tropicales (+${Math.round(D.aguacate)}&nbsp;%) y el salmón, con otros pescados ahumados o salados</div>`,
        { fuente: F_MIN, icono: bandera(44) }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("tiendaBarrio", null, t, 0);
        const R = 92, sector = (f) => { if (f < 0.002) return ""; if (f > 0.999) f = 0.999; const a = f * 2 * Math.PI; return `M0 0 L0 ${-R} A${R} ${R} 0 ${f > 0.5 ? 1 : 0} 1 ${(R * Math.sin(a)).toFixed(1)} ${(-R * Math.cos(a)).toFixed(1)} Z`; };
        const tt = [c["c12-63"] - 0.3, c["c12-73"] - 0.4];
        for (let i = 0; i < 2; i++) {
          const k = suave((t - tt[i]) / 0.8), f = D.tostada[i] / 60 * k;
          css(`s12-g${i}`, "opacity", clamp((t - tt[i] + 0.4) / 0.3)); attr(`s12-r${i}-v`, "d", sector(f)); attr(`s12-r${i}-ag`, "transform", `rotate(${(360 * f).toFixed(1)})`);
          css(`s12-v${i}`, "opacity", clamp((t - tt[i] - 0.7) / 0.3));
        }
        sube("c12-b", t, c["c12-73"]); sube("c12-a", t, c["c12-63"]);
        persona("s12-m", t, { x: 175, y: 1440, s: 0.82, mira: 1, vivo: true, boca: [[0, "seria"], [c["c12-moda"] + 0.2, "sonrisa"]], ojos: [[0, "normal"], [c["c12-moda"] + 0.2, "felices"]], brazo: [[0, "abajo"]], fase: 1 });
        persona("s12-t", t, { x: 935, y: 1440, s: 0.8, mira: -1, vivo: true, charla: e, boca: habla(t, e, "sonrisa"), brazo: [[0, "abajo"], [c["c12-moda"] - 0.2, "hombros"], [c["c12-73"] - 0.3, "senala"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c12-73"], e.c["c12-63"]]); } },

    // 13 · La madre (bar), con churros y café: «¿Y en el bar, con churros? Los precios han subido un 33 %; el sueldo, un 26.»
    { n: 13, set: "vacio",
      svg: `${panel(255, 820, 570, 400)}<g transform="translate(470 935)">${P.churros(0.55)}</g><g transform="translate(640 935)">${P.cafeConLeche(0.6)}</g>
        ${[["BARES, CAFETERÍAS Y RESTAURANTES", D.barSube, "#D86B5B"], ["SUELDO NETO POR HORA", D.sueldoSube, "#5E8C99"]].map(([et, v, col], i) => `<g transform="translate(300 ${1030 + i * 105})">
          ${rot(0, -16, et, 19, C.gris, "", "start")}<rect x="0" y="0" width="390" height="42" rx="12" fill="#EEF0F2"/><rect id="s13-b${i}" x="0" y="0" width="0" height="42" rx="12" fill="${col}"/>
          <g id="s13-v${i}">${rot(400, 33, "+" + Math.round(v) + " %", 28, i ? "#3F6672" : HOY, "", "start")}</g></g>`).join("")}
        ${gente("s13", "h", { h: CHURRO_MANO })}${gente("s13", "m")}`,
      tarjeta: tarjeta(13, "Lo que ha subido desde 2016", `${vs(13, ["+" + Math.round(D.barSube) + "&nbsp;%", "+" + Math.round(D.sueldoSube) + "&nbsp;%"], ["bares, cafeterías y restaurantes", "sueldo neto por hora"])}
        <div class="nota">Desayunar fuera cuesta un ${es(D.barTiempo)}&nbsp;% más de tu tiempo que en 2016. El INE no da el precio del café con churros: es el IPC de la restauración</div>`, { fuente: F_BAR, icono: bandera(44) }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("bar", "tiendaBarrio", t, e.t0);
        const tt = [c["c13-33"] - 0.2, c["c13-26"] - 0.2], v = [D.barSube, D.sueldoSube];
        for (let i = 0; i < 2; i++) {
          attr(`s13-b${i}`, "width", (v[i] / 33.3 * 370 * suave((t - tt[i]) / 0.7)).toFixed(1));
          css(`s13-v${i}`, "opacity", clamp((t - tt[i] - 0.6) / 0.3));
        }
        sube("c13-a", t, c["c13-33"]); sube("c13-b", t, c["c13-26"]);
        persona("s13-h", t, { x: 950, y: 1440, s: 0.66, mira: -1, vivo: true, boca: [[0, "sonrisa"]], ojos: [[0, "felices"]], brazo: [[0, "sujeta"]], espejo: true, fase: 3 });
        persona("s13-m", t, { x: 145, y: 1440, s: 0.82, mira: 1, vivo: true, charla: e, boca: habla(t, e, "seria"), brazo: [[0, "abajo"], [c["c13-26"], "hombros"]], fase: 1 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c13-33"], e.c["c13-26"]]); } },

    // 14 · La madre, a cámara (cocina): «De nueve básicos del desayuno, seis cuestan más minutos que en 2016, y ninguno menos. ¿Tú has tenido que cambiar el desayuno?»
    { n: 14, set: "vacio",
      svg: `${panel(240, 800, 600, 440)}${D.orden.map((k, i) => { const x = 352 + (i % 3) * 188, y = 940 + Math.floor(i / 3) * 130, mas = D.mas.includes(k);
          return `<g id="s14-p${i}" transform="translate(${x} ${y})"><g transform="translate(-20 0)">${P[k === "naranjas" ? "naranja" : k](0.42)}</g>
            <g id="s14-c${i}" transform="translate(48 -40)"><circle r="26" fill="${mas ? "#D86B5B" : "#C9CED3"}"/><rect x="-3" y="-18" width="6" height="18" rx="3" fill="#FFFFFF"/><rect x="-3" y="-3" width="14" height="6" rx="3" fill="#FFFFFF"/></g>
            ${rot(14, 32, { cacao: "CACAO", huevos: "HUEVOS", naranjas: "NARANJAS", cafe: "CAFÉ", zumo: "ZUMO", leche: "LECHE", azucar: "AZÚCAR", aceite: "ACEITE", pan: "PAN" }[k], 16, mas ? HOY : C.gris)}</g>`; }).join("")}
        ${rot(540, 862, "MÁS MINUTOS QUE EN 2016 (ROJO) · CASI IGUAL (GRIS)", 16, C.gris)}${gente("s14", "h", { h: PAN_MANO })}${gente("s14", "m", { m: TAZA })}`,
      tarjeta: tarjeta(14, "Te toca", `<div class="tit" style="font-size:56px">Seis de nueve básicos del desayuno cuestan más minutos. ¿Has tenido que <mark id="m14">cambiar</mark> el tuyo?</div><div class="sub" id="c14-sub">Te leo en los comentarios.</div>`,
        { fuente: F_MIN }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("cocinaDesayuno", "bar", t, e.t0);
        for (let i = 0; i < 9; i++) {
          pop(`s14-p${i}`, t, c["c14-nueve"] - 0.2 + i * 0.07, 352 + (i % 3) * 188, 940 + Math.floor(i / 3) * 130, { s: 1 });
          css(`s14-c${i}`, "opacity", clamp((t - c["c14-seis"] - i * 0.06) / 0.2));
        }
        marca("m14", t, c["c14-cambiar"]); sube("c14-sub", t, c["c14-tu"]);
        persona("s14-h", t, { x: 135, y: 1440, s: 0.66, mira: 1, vivo: true, boca: [[0, "sonrisa"]], ojos: [[0, "felices"]], brazo: [[0, "sujeta"]], fase: 3 });
        persona("s14-m", t, { x: 925, y: 1440, s: 0.8, mira: [[0, -1], [c["c14-tu"] - 0.3, 0]], vivo: true, charla: e, boca: habla(t, e, "seria"),
          brazo: [[0, "sujeta"], [c["c14-tu"], "hombros"]], incl: [[0, 0], [c["c14-tu"], -6]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c14-seis"], e.c["c14-cambiar"]]); } },
  ];
}
