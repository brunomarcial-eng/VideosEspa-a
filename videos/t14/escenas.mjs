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
import { DECORADOS_T14, P, relojCocina, DELANTAL, PIJAMA_RAYAS, BOTE_CACAO_MANO, CAFE_MANO, PAN_MANO, BOLSO } from "../../diseno/desayuno.mjs";

export const ESTILO = "limpio";
const F_MIN = "Cálculo propio · INE (Encuesta de Presupuestos Familiares y Encuesta de Estructura Salarial)";
const F_SUB = "Cálculo propio · INE (Encuesta de Estructura Salarial, Encuesta Trimestral de Coste Laboral y Encuesta de Presupuestos Familiares)";

export function datos(d) {
  const p = d.productos, m = (k) => [p[k].minutos_mediana["2016"], p[k].minutos_mediana["2025"]];
  return {
    cacao: m("cacao"), cafe: m("cafe"), cafe19: p.cafe.minutos_mediana["2019"], huevos: m("huevos"), aceite: m("aceite"), pan: m("pan"),
    sueldoSube: d.sueldo.mediana_sube_pct, huevosSube: p.huevos.precio_sube_pct,
    sueldo: [d.sueldo.neto_hora_mediana["2016"], d.sueldo.neto_hora_mediana["2025"]], huevosEur: [p.huevos.precio_paquete_eur["2016"], p.huevos.precio_paquete_eur["2025"]],
    mas: d.mas_minutos_que_en_2016, igual: d.casi_igual, orden: d.orden_por_subida_en_minutos,
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

    // 2 · El hijo (cocina), con el bote vacío: «Mamá, ¡que no queda cacao!»
    { n: 2, set: "vacio",
      svg: gente("s2", "mh", { m: BOLSO, h: BOTE_CACAO_MANO }),
      tarjeta: tarjeta(2, "El hijo", `<div class="tit">«¡Que no queda <mark id="m2">cacao</mark>!»</div>`, { tono: "hoy" }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("cocinaDesayuno", null, t, 0);
        marca("m2", t, c["c2-cacao"]);
        const h = ruta(t, [[e.t0 + 0.05, 1250], [e.t0 + 0.9, 860]]);
        persona("s2-h", t, { x: h.x, y: 1440, s: 0.66, anda: h.anda, mira: -1, vivo: true, charla: e, salta: c["c2-cacao"] - 0.1, boca: habla(t, e, "grande"),
          brazo: [[0, "arriba"]], incl: [[0, 0], [c["c2-cacao"], -8]], espejo: true, fase: 2 });
        const sac = t > c["c2-cacao"] ? Math.sin((t - c["c2-cacao"]) * 22) * 10 * Math.max(0, 1 - (t - c["c2-cacao"]) * 0.8) : 0;
        attr("s2-h-mano", "transform", `rotate(${sac.toFixed(1)})`);
        persona("s2-m", t, { x: 300, y: 1440, s: 0.82, mira: 1, vivo: true, boca: [[0, "seria"], [c["c2-cacao"] + 0.3, "o"]], ojos: [[0, "normal"], [c["c2-cacao"] + 0.3, "grandes"]],
          brazo: [[0, "abajo"], [c["c2-cacao"] + 0.6, "sujeta"]], fase: 1 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c2-cacao"]], { acerca: 0.07 }); } },

    // 3 · La tendera (tienda): «Buenos días. El kilo de chocolate y cacao: 55 minutos de trabajo. En 2016, 40.»
    { n: 3, set: "vacio",
      svg: `${relojes(3, "cacao", D.cacao)}${gente("s3", "mt")}`,
      tarjeta: tarjeta(3, "Minutos de trabajo para pagar 1 kg de chocolate y cacao", `${vs(3, D.cacao.map((v) => es(v, 0) + "&nbsp;min"), ["en 2016", "en 2025"])}
        <div class="nota">Lo que pagan de media los hogares, con el sueldo neto mediano por hora</div>`, { fuente: F_MIN, icono: bandera(44) }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("tiendaBarrio", "cocinaDesayuno", t, e.t0);
        const R = 92, sector = (f) => { if (f < 0.002) return ""; if (f > 0.999) f = 0.999; const a = f * 2 * Math.PI; return `M0 0 L0 ${-R} A${R} ${R} 0 ${f > 0.5 ? 1 : 0} 1 ${(R * Math.sin(a)).toFixed(1)} ${(-R * Math.cos(a)).toFixed(1)} Z`; };
        const tt = [c["c3-40"] - 0.3, c["c3-55"] - 0.4];
        for (let i = 0; i < 2; i++) {
          const k = suave((t - tt[i]) / 0.9), f = D.cacao[i] / 60 * k;
          css(`s3-g${i}`, "opacity", clamp((t - tt[i] + 0.4) / 0.3)); attr(`s3-r${i}-v`, "d", sector(f)); attr(`s3-r${i}-ag`, "transform", `rotate(${(360 * f).toFixed(1)})`);
          css(`s3-v${i}`, "opacity", clamp((t - tt[i] - 0.8) / 0.3));
        }
        sube("c3-b", t, c["c3-55"]); sube("c3-a", t, c["c3-40"]);
        const w = ruta(t, [[e.t0 + 0.1, -300], [e.t0 + 1.3, 175]]);
        persona("s3-m", t, { x: w.x, y: 1440, s: 0.82, anda: w.anda, mira: 1, vivo: true, boca: [[0, "sonrisa"], [c["c3-55"] + 0.3, "o"]], brazo: [[0, "abajo"]], fase: 1 });
        persona("s3-t", t, { x: 935, y: 1440, s: 0.8, mira: -1, vivo: true, charla: e, boca: habla(t, e, "sonrisa"), brazo: [[0, "saluda"], [c["c3-55"] - 0.4, "senala"], [c["c3-40"], "hombros"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c3-55"], e.c["c3-40"]]); } },

    // 4 · El hijo (tienda), muy digno: «Pues me paso al café, como los mayores.»
    { n: 4, set: "vacio",
      svg: gente("s4", "mth", { h: CAFE_MANO }),
      tarjeta: tarjeta(4, "El hijo", `<div class="tit">«Me paso al <mark id="m4">café</mark>»</div>`, { tono: "hoy" }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("tiendaBarrio", null, t, 0);
        marca("m4", t, c["c4-cafe"]);
        persona("s4-m", t, { x: 175, y: 1440, s: 0.82, mira: 1, vivo: true, boca: [[0, "seria"], [c["c4-mayores"], "sonrisa"]], ojos: [[0, "normal"], [c["c4-mayores"], "felices"]], brazo: [[0, "abajo"]], fase: 1 });
        persona("s4-t", t, { x: 935, y: 1440, s: 0.8, mira: -1, vivo: true, boca: [[0, "seria"], [c["c4-mayores"] + 0.2, "o"]], brazo: [[0, "abajo"], [c["c4-mayores"], "piensa"]], espejo: true, fase: 2 });
        persona("s4-h", t, { x: 560, y: 1440, s: 0.66, mira: [[0, 1], [c["c4-mayores"], 0]], vivo: true, charla: e, boca: habla(t, e, "sonrisa"),
          brazo: [[0, "abajo"], [c["c4-cafe"] - 0.3, "arriba"]], incl: [[0, 0], [c["c4-mayores"], 8]], fase: 3 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c4-cafe"]], { acerca: 0.07 }); } },

    // 5 · La tendera (tienda): «Tampoco te libras: el paquete de café, 15 minutos. En 2016, 13.»
    { n: 5, set: "vacio",
      svg: `${relojes(5, "cafe", D.cafe)}${gente("s5", "mt")}`,
      tarjeta: tarjeta(5, "Minutos de trabajo para pagar un paquete de café de 250 g", `${vs(5, D.cafe.map((v) => es(v, 0) + "&nbsp;min"), ["en 2016", "en 2025"])}
        <div class="nota">En 2019 salía algo más barato: ${es(D.cafe19, 0)} minutos</div>`, { fuente: F_MIN, icono: bandera(44) }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("tiendaBarrio", null, t, 0);
        const R = 92, sector = (f) => { if (f < 0.002) return ""; if (f > 0.999) f = 0.999; const a = f * 2 * Math.PI; return `M0 0 L0 ${-R} A${R} ${R} 0 ${f > 0.5 ? 1 : 0} 1 ${(R * Math.sin(a)).toFixed(1)} ${(-R * Math.cos(a)).toFixed(1)} Z`; };
        const tt = [c["c5-13"] - 0.3, c["c5-15"] - 0.4];
        for (let i = 0; i < 2; i++) {
          const k = suave((t - tt[i]) / 0.8), f = D.cafe[i] / 60 * k;
          css(`s5-g${i}`, "opacity", clamp((t - tt[i] + 0.4) / 0.3)); attr(`s5-r${i}-v`, "d", sector(f)); attr(`s5-r${i}-ag`, "transform", `rotate(${(360 * f).toFixed(1)})`);
          css(`s5-v${i}`, "opacity", clamp((t - tt[i] - 0.7) / 0.3));
        }
        sube("c5-b", t, c["c5-15"]); sube("c5-a", t, c["c5-13"]);
        persona("s5-m", t, { x: 175, y: 1440, s: 0.82, mira: 1, vivo: true, boca: [[0, "seria"], [c["c5-15"] + 0.3, "o"]], brazo: [[0, "abajo"]], fase: 1 });
        persona("s5-t", t, { x: 935, y: 1440, s: 0.8, mira: -1, vivo: true, charla: e, boca: habla(t, e, "seria"), brazo: [[0, "abajo"], [c["c5-libras"], "hombros"], [c["c5-15"] - 0.3, "senala"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c5-15"], e.c["c5-13"]]); } },

    // 6 · La tendera (tienda): «Y la docena de huevos, 14 minutos. En 2016, 10.»
    { n: 6, set: "vacio",
      svg: `${relojes(6, "huevos", D.huevos)}${gente("s6", "mt")}`,
      tarjeta: tarjeta(6, "Minutos de trabajo para pagar una docena de huevos", `${vs(6, D.huevos.map((v) => es(v, 0) + "&nbsp;min"), ["en 2016", "en 2025"])}
        <div class="nota">Lo que pagan de media los hogares, con el sueldo neto mediano por hora</div>`, { fuente: F_MIN, icono: bandera(44) }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("tiendaBarrio", null, t, 0);
        const R = 92, sector = (f) => { if (f < 0.002) return ""; if (f > 0.999) f = 0.999; const a = f * 2 * Math.PI; return `M0 0 L0 ${-R} A${R} ${R} 0 ${f > 0.5 ? 1 : 0} 1 ${(R * Math.sin(a)).toFixed(1)} ${(-R * Math.cos(a)).toFixed(1)} Z`; };
        const tt = [c["c6-10"] - 0.3, c["c6-14"] - 0.4];
        for (let i = 0; i < 2; i++) {
          const k = suave((t - tt[i]) / 0.8), f = D.huevos[i] / 60 * k;
          css(`s6-g${i}`, "opacity", clamp((t - tt[i] + 0.4) / 0.3)); attr(`s6-r${i}-v`, "d", sector(f)); attr(`s6-r${i}-ag`, "transform", `rotate(${(360 * f).toFixed(1)})`);
          css(`s6-v${i}`, "opacity", clamp((t - tt[i] - 0.7) / 0.3));
        }
        sube("c6-b", t, c["c6-14"]); sube("c6-a", t, c["c6-10"]);
        persona("s6-m", t, { x: 175, y: 1440, s: 0.82, mira: 1, vivo: true, boca: [[0, "seria"], [c["c6-14"] + 0.3, "o"]], ojos: [[0, "normal"], [c["c6-14"] + 0.3, "grandes"]], brazo: [[0, "abajo"], [c["c6-10"], "piensa"]], fase: 1 });
        persona("s6-t", t, { x: 935, y: 1440, s: 0.8, mira: -1, vivo: true, charla: e, boca: habla(t, e, "seria"), brazo: [[0, "abajo"], [c["c6-docena"] - 0.2, "senala"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c6-14"], e.c["c6-10"]]); } },

    // 7 · La madre (tienda), con la nómina: «¡Pero si me han subido el sueldo!»
    { n: 7, set: "vacio",
      svg: gente("s7", "tm", { m: NOMINA_MANO }),
      tarjeta: tarjeta(7, "La madre", `<div class="tit">«¡Pero si me han subido el <mark id="m7">sueldo</mark>!»</div>`, { tono: "hoy" }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("tiendaBarrio", null, t, 0);
        marca("m7", t, c["c7-sueldo"]);
        persona("s7-t", t, { x: 935, y: 1440, s: 0.8, mira: -1, vivo: true, boca: [[0, "seria"], [c["c7-sueldo"] + 0.3, "sonrisa"]], brazo: [[0, "abajo"], [c["c7-sueldo"] + 0.3, "hombros"]], espejo: true, fase: 2 });
        persona("s7-m", t, { x: 380, y: 1440, s: 0.82, mira: 1, vivo: true, charla: e, salta: c["c7-sueldo"] - 0.15, boca: habla(t, e, "grande"), ojos: [[0, "grandes"]], brazo: [[0, "sujeta"], [c["c7-sueldo"] - 0.3, "arriba"]], fase: 1 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c7-sueldo"]], { acerca: 0.07 }); } },

    // 8 · La tendera (tienda): «Un 26 % por hora, sí. Pero los huevos, un 74 %.»
    { n: 8, set: "vacio",
      svg: `${panel(255, 820, 570, 400)}${rot(540, 880, "LO QUE HA SUBIDO DESDE 2016", 22, C.tinta)}
        ${[["SUELDO NETO POR HORA", D.sueldoSube, "#5E8C99"], ["DOCENA DE HUEVOS", D.huevosSube, "#D86B5B"]].map(([et, v, col], i) => `<g transform="translate(300 ${985 + i * 125})">
          ${rot(0, -18, et, 20, C.gris, "", "start")}<rect x="0" y="0" width="390" height="46" rx="12" fill="#EEF0F2"/><rect id="s8-b${i}" x="0" y="0" width="0" height="46" rx="12" fill="${col}"/>
          <g id="s8-v${i}">${rot(400, 36, "+" + Math.round(v) + " %", 30, i ? HOY : "#3F6672", "", "start")}</g></g>`).join("")}
        ${rot(540, 1206, "SUELDO NETO MEDIANO POR HORA Y PRECIO MEDIO DE LA DOCENA", 15, C.gris)}${gente("s8", "mt")}`,
      tarjeta: tarjeta(8, "Lo que ha subido desde 2016", `${vs(8, ["+" + Math.round(D.sueldoSube) + "&nbsp;%", "+" + Math.round(D.huevosSube) + "&nbsp;%"], ["sueldo neto por hora", "docena de huevos"])}
        <div class="nota">Sueldo neto mediano por hora: de ${es(D.sueldo[0], 2)}&nbsp;€ a ${es(D.sueldo[1], 2)}&nbsp;€. Docena de huevos: de ${es(D.huevosEur[0], 2)}&nbsp;€ a ${es(D.huevosEur[1], 2)}&nbsp;€</div>`, { fuente: F_SUB, icono: bandera(44) }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("tiendaBarrio", null, t, 0);
        const tt = [c["c8-26"] - 0.2, c["c8-74"] - 0.2], v = [D.sueldoSube, D.huevosSube];
        for (let i = 0; i < 2; i++) {
          attr(`s8-b${i}`, "width", (Math.min(390, v[i] / 74 * 380) * suave((t - tt[i]) / 0.7)).toFixed(1));
          css(`s8-v${i}`, "opacity", clamp((t - tt[i] - 0.6) / 0.3));
        }
        sube("c8-a", t, c["c8-26"]); sube("c8-b", t, c["c8-74"]);
        persona("s8-m", t, { x: 175, y: 1440, s: 0.82, mira: 1, vivo: true, boca: [[0, "seria"], [c["c8-74"] + 0.3, "o"]], ojos: [[0, "normal"], [c["c8-74"] + 0.3, "grandes"]], brazo: [[0, "abajo"]], fase: 1 });
        persona("s8-t", t, { x: 935, y: 1440, s: 0.8, mira: -1, vivo: true, charla: e, boca: habla(t, e, "seria"), brazo: [[0, "abajo"], [c["c8-26"] - 0.2, "hombros"], [c["c8-74"] - 0.2, "senala"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c8-26"], e.c["c8-74"]]); } },

    // 9 · La tendera (tienda): «Eso sí: el pan y el aceite cuestan casi los mismos minutos que en 2016.»
    { n: 9, set: "vacio",
      svg: `${relojes(9, "aceite", D.aceite, 1, `<g transform="translate(400 915)">${P.aceite(0.5)}</g>`)}<g id="s9-ig">${rot(540, 1062, "=", 70, C.tinta)}</g>
        <g id="s9-pan" transform="translate(640 900)">${P.pan(0.42)}${rot(0, 26, "PAN: " + es(D.pan[0]) + " = " + es(D.pan[1]) + " MIN", 17, C.gris)}</g>${gente("s9", "mt")}`,
      tarjeta: tarjeta(9, "Minutos de trabajo para pagar un litro de aceite de oliva", `${vs(9, D.aceite.map((v) => es(v) + "&nbsp;min"), ["en 2016", "en 2025"])}
        <div class="nota">La barra de pan de 250 g: ${es(D.pan[1])} minutos en 2016 y en 2025</div>`, { fuente: F_MIN, icono: bandera(44) }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("tiendaBarrio", null, t, 0);
        const R = 92, sector = (f) => { if (f < 0.002) return ""; if (f > 0.999) f = 0.999; const a = f * 2 * Math.PI; return `M0 0 L0 ${-R} A${R} ${R} 0 ${f > 0.5 ? 1 : 0} 1 ${(R * Math.sin(a)).toFixed(1)} ${(-R * Math.cos(a)).toFixed(1)} Z`; };
        const tt = [c["c9-aceite"] - 0.2, c["c9-aceite"] - 0.2];
        for (let i = 0; i < 2; i++) {
          const k = suave((t - tt[i]) / 0.9), f = D.aceite[i] / 60 * k;
          css(`s9-g${i}`, "opacity", clamp((t - tt[i] + 0.4) / 0.3)); attr(`s9-r${i}-v`, "d", sector(f)); attr(`s9-r${i}-ag`, "transform", `rotate(${(360 * f).toFixed(1)})`);
          css(`s9-v${i}`, "opacity", clamp((t - tt[i] - 0.8) / 0.3));
        }
        pop("s9-ig", t, c["c9-mismos"] - 0.1, 0, 0, { s: 1 });
        pop("s9-pan", t, c["c9-pan"] - 0.1, 640, 900, { s: 1 });
        sube("c9-a", t, c["c9-mismos"]); sube("c9-b", t, c["c9-mismos"] + 0.2);
        persona("s9-m", t, { x: 175, y: 1440, s: 0.82, mira: 1, vivo: true, boca: [[0, "seria"], [c["c9-mismos"] + 0.3, "sonrisa"]], ojos: [[0, "normal"], [c["c9-mismos"] + 0.3, "felices"]], brazo: [[0, "abajo"]], fase: 1 });
        persona("s9-t", t, { x: 935, y: 1440, s: 0.8, mira: -1, vivo: true, charla: e, boca: habla(t, e, "sonrisa"), brazo: [[0, "abajo"], [c["c9-pan"] - 0.2, "senala"], [c["c9-mismos"], "hombros"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c9-mismos"]]); } },

    // 10 · El hijo (tienda), con la barra bajo el brazo: «Pues pan con aceite, como el abuelo. Desayuno de lujo.»
    { n: 10, set: "vacio",
      svg: gente("s10", "mth", { h: PAN_MANO }),
      tarjeta: tarjeta(10, "El hijo", `<div class="tit">«Pan con aceite, como el <mark id="m10">abuelo</mark>»</div>`, { tono: "hoy" }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("tiendaBarrio", null, t, 0);
        marca("m10", t, c["c10-abuelo"]);
        persona("s10-m", t, { x: 175, y: 1440, s: 0.82, mira: 1, vivo: true, boca: [[0, "seria"], [c["c10-lujo"], "sonrisa"]], brazo: [[0, "abajo"], [c["c10-abuelo"], "piensa"]], incl: [[0, 0], [c["c10-abuelo"], 8]], fase: 1 });
        persona("s10-t", t, { x: 935, y: 1440, s: 0.8, mira: -1, vivo: true, boca: [[0, "seria"], [c["c10-lujo"], "sonrisa"]], ojos: [[0, "normal"], [c["c10-lujo"], "felices"]], brazo: [[0, "abajo"]], espejo: true, fase: 2 });
        persona("s10-h", t, { x: 560, y: 1440, s: 0.66, mira: [[0, 1], [c["c10-lujo"], 0]], vivo: true, charla: e, salta: c["c10-lujo"] - 0.1, boca: habla(t, e, "sonrisa"), ojos: [[0, "normal"], [c["c10-lujo"], "felices"]],
          brazo: [[0, "abajo"], [c["c10-pan"] - 0.2, "sujeta"]], fase: 3 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c10-lujo"]], { acerca: 0.07 }); } },

    // 11 · La madre, a cámara (cocina): «De nueve básicos del desayuno, seis cuestan más minutos que en 2016, y ninguno menos. ¿Tú has tenido que cambiar el desayuno?»
    { n: 11, set: "vacio",
      svg: `${panel(240, 800, 600, 440)}${D.orden.map((k, i) => { const x = 352 + (i % 3) * 188, y = 940 + Math.floor(i / 3) * 130, mas = D.mas.includes(k);
          return `<g id="s11-p${i}" transform="translate(${x} ${y})"><g transform="translate(-20 0)">${P[k === "naranjas" ? "naranja" : k](0.42)}</g>
            <g id="s11-c${i}" transform="translate(48 -40)"><circle r="26" fill="${mas ? "#D86B5B" : "#C9CED3"}"/><rect x="-3" y="-18" width="6" height="18" rx="3" fill="#FFFFFF"/><rect x="-3" y="-3" width="14" height="6" rx="3" fill="#FFFFFF"/></g>
            ${rot(14, 32, { cacao: "CACAO", huevos: "HUEVOS", naranjas: "NARANJAS", cafe: "CAFÉ", zumo: "ZUMO", leche: "LECHE", azucar: "AZÚCAR", aceite: "ACEITE", pan: "PAN" }[k], 16, mas ? HOY : C.gris)}</g>`; }).join("")}
        ${rot(540, 862, "MÁS MINUTOS QUE EN 2016 (ROJO) · CASI IGUAL (GRIS)", 16, C.gris)}${gente("s11", "h", { h: PAN_MANO })}${gente("s11", "m", { m: TAZA })}`,
      tarjeta: tarjeta(11, "Te toca", `<div class="tit" style="font-size:56px">Seis de nueve básicos del desayuno cuestan más minutos. ¿Has tenido que <mark id="m11">cambiar</mark> el tuyo?</div><div class="sub" id="c11-sub">Te leo en los comentarios.</div>`,
        { fuente: F_MIN }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("cocinaDesayuno", "tiendaBarrio", t, e.t0);
        for (let i = 0; i < 9; i++) {
          pop(`s11-p${i}`, t, c["c11-nueve"] - 0.2 + i * 0.07, 352 + (i % 3) * 188, 940 + Math.floor(i / 3) * 130, { s: 1 });
          css(`s11-c${i}`, "opacity", clamp((t - c["c11-seis"] - i * 0.06) / 0.2));
        }
        marca("m11", t, c["c11-cambiar"]); sube("c11-sub", t, c["c11-tu"]);
        persona("s11-h", t, { x: 135, y: 1440, s: 0.66, mira: 1, vivo: true, boca: [[0, "sonrisa"]], ojos: [[0, "felices"]], brazo: [[0, "sujeta"]], fase: 3 });
        persona("s11-m", t, { x: 925, y: 1440, s: 0.8, mira: [[0, -1], [c["c11-tu"] - 0.3, 0]], vivo: true, charla: e, boca: habla(t, e, "seria"),
          brazo: [[0, "sujeta"], [c["c11-tu"], "hombros"]], incl: [[0, 0], [c["c11-tu"], -6]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c11-seis"], e.c["c11-cambiar"]]); } },
  ];
}
