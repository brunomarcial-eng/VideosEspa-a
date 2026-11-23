// Escenas de T17 v2 («Papá, ya tengo el carnet», coches B con padre e hijo) en estilo «limpio».
// Bruno, 23-11-2026 (sobre la v1): más coloquial e irónico, menos datos y más grandes, el primo se lo compraron SUS padres,
// repetir «la mitad la pones tú» y cambiar de escenario: casa → concesionario de coches nuevos relucientes → compraventa.
//   · «hijo»: 18 años, sudadera verde azulada (voz «hijo»).
//   · «padre»: unos 50, jersey ocre, canas y bigote (voz «comandante»).
// Decorados: salón y compraventa (diseno/carnet.mjs) y el concesionario de T16 (diseno/concesionario.mjs).
/* eslint-disable no-undef */

import { C, persona, tarjeta, selloOficial } from "../../diseno/limpio.mjs";
import { bandera } from "../../diseno/barrio.mjs";
import { ambientes } from "../../diseno/sueno.mjs";
import { coche } from "../../diseno/transporte.mjs";
import { DECORADOS_T16 } from "../../diseno/concesionario.mjs";
import { DECORADOS_T17, papel, PAPEL_MANO, etiqueta, iconoCoche, SUDADERA, LLAVES, calendario, hoja, selloMedias, destello, movilPrimo } from "../../diseno/carnet.mjs";

export const ESTILO = "limpio";
const F_NUEVO = "Cálculo propio · Agencia Tributaria · INE";
const F_USADO = "Dato oficial: DGT";

export function datos(d) {
  const n = d.coche_nuevo_medio, u = d.segunda_mano;
  const A = ["2007", "2016", "2019", "2025"];
  return {
    precio: Object.fromEntries(A.map((a) => [a, n[a].precio_con_impuestos])), meses: Object.fromEntries(A.map((a) => [a, n[a].meses_de_sueldo])),
    mes: d.sueldo_neto_mes, sube: d.coche_nuevo_medio_sube_pct, subeS: d.sueldo_neto_sube_pct,
    ratio: Object.fromEntries(A.map((a) => [a, u[a].usados_por_cada_matriculado])),
  };
}

export const capas = () => ambientes({ ...DECORADOS_T17, ...DECORADOS_T16 });

// ------------------------------------------------------------------ personajes (inventados), con volumen
const HIJO = { pelo: "corto", canas: false, barba: false, colorPelo: "#2B1D14", ropa: ["#3E8E8A", "#2F6F69"], piel: "#F2CBA8", volumen: true, encima: SUDADERA };
const PADRE = { pelo: "corto", canas: true, barba: false, bigote: true, colorPelo: "#4A3A2E", colorBigote: "#5A4A3E", ropa: ["#C8902E", "#A9781F"], piel: "#DDAE86", piel2: "#C99A72", volumen: true };
const QUIEN = { h: HIJO, p: PADRE };
const gente = (n, quien, manos = {}) => quien.split("").map((k) => persona(`${n}-${k}`, "hoy", { ...QUIEN[k], mano: manos[k] ? `<g id="${n}-${k}-mano">${manos[k]}</g>` : undefined })).join("");

// ------------------------------------------------------------------ piezas
const ANTES_T = "#8A6316", HOY = "#B3261E", GRIS19 = "#6B7480";
const panel = (x, y, w, h) => `<rect x="${x + 8}" y="${y + 12}" width="${w}" height="${h}" rx="26" fill="#3C2814" opacity=".10"/><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="26" fill="#FFFDF8" opacity=".96"/>`;
const rot = (x, y, t, tam, color, id = "", ancla = "middle") => `<text ${id ? `id="${id}"` : ""} x="${x}" y="${y}" text-anchor="${ancla}" font-family="Cap" font-weight="800" font-size="${tam}" fill="${color}">${t}</text>`;
const miles = (v) => String(Math.round(v)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
const es = (v, d = 1) => v.toFixed(d).replace(".", ",");
const vs = (n, vals, labs, tam = 96) => `<div class="vs">${vals.map((v, i) => `<div class="col"><div class="v ${i ? "t-hoy" : "t-pasado"}" id="c${n}-${"ab"[i]}" style="font-size:${tam}px">${v}</div><div class="n">${labs[i]}</div></div>`).join("")}</div>`;
const cita = (n, quien, html) => tarjeta(n, quien, `<div class="tit" style="font-size:60px">${html}</div>`, { tono: "hoy" });
const brillos = (n) => [[560, 1095, 1.5], [705, 1150, 1.8], [480, 1215, 1.3], [640, 1245, 1.2], [770, 1075, 1.4]].map(([x, y, s], i) => `<g transform="translate(${x} ${y})">${destello(`s${n}-d${i}`, s)}</g>`).join("");
// Pictograma de la segunda mano: un coche matriculado → tantos usados vendidos (el último, partido).
const picto = (n, filas, y0, paso) => `${panel(220, y0 - 70, 640, 40 + paso * filas.length)}
  ${filas.map((f, i) => { const y = y0 + i * paso, enteros = Math.floor(f.v), resto = f.v - enteros;
    return `<g id="s${n}-p${i}" opacity="0">${rot(240, y + 6, f.anyo, 34, f.col, "", "start")}
      <g transform="translate(372 ${y + 6}) scale(1.25)">${iconoCoche(`s${n}-pn${i}`, HOY)}</g>${rot(438, y + 8, "→", 36, C.gris)}
      ${Array.from({ length: enteros }, (_, k) => `<g id="s${n}-pu${i}-${k}" transform="translate(${505 + k * 92} ${y + 6}) scale(1.25)">${iconoCoche(`s${n}-pux${i}-${k}`, "#9AA6AE")}</g>`).join("")}
      <clipPath id="s${n}-cp${i}"><rect x="${505 + enteros * 92 - 46}" y="${y - 50}" width="${(92 * resto).toFixed(1)}" height="70"/></clipPath>
      <g clip-path="url(#s${n}-cp${i})"><g transform="translate(${505 + enteros * 92} ${y + 6}) scale(1.25)">${iconoCoche(`s${n}-pux${i}-x`, "#9AA6AE")}</g></g>
      ${rot(840, y + 14, es(f.v, 2), 44, f.col, "", "end")}</g>`; }).join("")}`;

export function escenas(D) {
  return [
    // 1 · Casa. El hijo entra con el aprobado: «¡Papá! ¡Aprobado a la primera! Ya me puedes comprar un coche, ¿no?»
    { n: 1, set: "vacio",
      svg: `<g id="s1-pg">${papel("s1-pg-p", 1.25)}</g>${gente("s1", "p")}${gente("s1", "h", { h: PAPEL_MANO })}${selloOficial("s1-sello")}`,
      tarjeta: tarjeta(1, "Coches · 2007, 2016 y hoy", `<div class="tit" style="font-size:66px">¿Nuevo o de <mark id="m1">segunda mano</mark>?</div>`, { icono: bandera(44) }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("salon", null, t, 0);
        vidaFondo("sl", t, { lamparas: 1, capa: "salon" });
        for (let i = 0; i < 2; i++) { const v = i ? -95 : 120, x = ((((t * v + i * 380) % 760) + 760) % 760) + 160; T("sl-c" + i, x, 932, { sx: i ? -1 : 1, sy: 1 }); }
        marca("m1", t, c["c1-comprar"]);
        selloAnim("s1-sello", t, c["c1-sello"], 290, 770, { s: 0.8, r: -9 });
        pop("s1-pg", t, c["c1-aprobado"] - 0.1, 620, 980, { s: 1, r: 6 });
        const w = ruta(t, [[0.1, -220], [1.0, 190]]);
        persona("s1-h", t, { x: w.x, y: 1440, s: 0.8, anda: w.anda, mira: 1, vivo: true, charla: e, boca: habla(t, e, "grande"), ojos: [[0, "felices"]],
          brazo: [[0, "saluda"], [c["c1-comprar"], "senala"]], salta: c["c1-aprobado"], fase: 1 });
        persona("s1-p", t, { x: 920, y: 1440, s: 0.8, mira: -1, vivo: true, boca: [[0, "sonrisa"], [c["c1-comprar"] + 0.2, "o"]], ojos: [[0, "normal"], [c["c1-comprar"] + 0.2, "grandes"]], brazo: [[0, "abajo"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c1-aprobado"], e.c["c1-comprar"]]); } },

    // 2 · Casa. El padre: «¿Comprarte? Querrás decir pagarlo a medias, campeón.» (primer «a medias»)
    { n: 2, set: "vacio",
      svg: `${gente("s2", "hp")}${selloMedias("s2-med")}`,
      tarjeta: cita(2, "El padre", `«¿Comprarte? Querrás decir <mark id="m2">a medias</mark>»`),
      fn: function (t, e) {
        const c = e.c;
        ambiente("salon", null, t, 0);
        vidaFondo("sl", t, { lamparas: 1, capa: "salon" });
        for (let i = 0; i < 2; i++) { const v = i ? -95 : 120, x = ((((t * v + i * 380) % 760) + 760) % 760) + 160; T("sl-c" + i, x, 932, { sx: i ? -1 : 1, sy: 1 }); }
        marca("m2", t, c["c2-medias"]);
        selloAnim("s2-med", t, c["c2-medias"], 540, 960, { s: 1.1, r: -8 });
        persona("s2-h", t, { x: 190, y: 1440, s: 0.8, mira: 1, vivo: true, boca: [[0, "sonrisa"], [c["c2-medias"] + 0.2, "seria"]], ojos: [[0, "felices"], [c["c2-medias"] + 0.2, "normal"]], brazo: [[0, "abajo"]], fase: 1 });
        persona("s2-p", t, { x: 920, y: 1440, s: 0.8, mira: -1, vivo: true, charla: e, boca: habla(t, e, "sonrisa"), brazo: [[0, "abajo"], [c["c2-medias"] - 0.2, "senala"]], incl: [[0, 0], [c["c2-comprarte"], -6]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c2-medias"]]); } },

    // 3 · Concesionario de coches nuevos. El hijo: «¡Hala, qué maravilla! ¿Nos llevamos este, nuevecito?»
    { n: 3, set: "vacio",
      svg: `${brillos(3)}${gente("s3", "hp")}`,
      tarjeta: cita(3, "El hijo", `«¿Nos llevamos este, <mark id="m3">nuevecito</mark>?»`),
      fn: function (t, e) {
        const c = e.c;
        ambiente("concesionario", "salon", t, e.t0);
        vidaFondo("cc", t, { gente: 2, capa: "concesionario", y: 1150, s: 0.55, W: 1300 });
        for (let i = 0; i < 5; i++) { const k = (Math.sin(t * 3 + i * 1.7) + 1) / 2; css(`s3-d${i}`, "opacity", 0.45 + 0.55 * k); attr(`s3-d${i}`, "transform", `scale(${(0.7 + 0.5 * k).toFixed(2)}) rotate(${((t * 40 + i * 30) % 90).toFixed(1)})`); }
        marca("m3", t, c["c3-nuevecito"]);
        const w = ruta(t, [[e.t0, 120], [e.t0 + 0.9, 330]]);
        persona("s3-h", t, { x: w.x, y: 1440, s: 0.8, anda: w.anda, mira: 1, vivo: true, charla: e, boca: habla(t, e, "grande"), ojos: [[0, "felices"]], brazo: [[0, "abajo"], [c["c3-maravilla"], "arriba"], [c["c3-este"], "senala"]], salta: c["c3-maravilla"], fase: 1 });
        persona("s3-p", t, { x: 930, y: 1440, s: 0.8, mira: -1, vivo: true, boca: [[0, "seria"]], brazo: [[0, "abajo"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c3-maravilla"]]); } },

    // 4 · El padre: «Este, de media, 31.555 euros. Dieciocho meses y medio de sueldo, chaval. Y la mitad la pones tú.»
    { n: 4, set: "vacio",
      svg: `<g transform="translate(540 905) scale(.5)"><rect x="-170" y="-200" width="340" height="370" rx="22" fill="#3C2814" opacity=".12" transform="translate(8 10)"/>${calendario("s4-cal")}</g>
        <g id="s4-et">${etiqueta("s4-et-e", miles(D.precio["2025"]) + " €")}</g>
        ${Array.from({ length: 19 }, (_, k) => hoja(`s4-hj${k}`)).join("")}${gente("s4", "hp")}${selloMedias("s4-med")}`,
      tarjeta: tarjeta(4, "Coche nuevo medio, con impuestos", `<div class="tit" style="font-size:104px;color:${HOY};line-height:1" id="c4-a">${miles(D.precio["2025"])}&nbsp;€</div>
        <div class="sub" id="c4-b" style="font-size:48px">${es(D.meses["2025"])} meses de sueldo</div>`, { fuente: F_NUEVO, icono: bandera(44) }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("concesionario", null, t, 0);
        vidaFondo("cc", t, { gente: 2, capa: "concesionario", y: 1150, s: 0.55, W: 1300 });
        pop("s4-et", t, c["c4-31555"] - 0.15, 560, 1060, { s: 1, r: -4 });
        sube("c4-a", t, c["c4-31555"]); sube("c4-b", t, c["c4-dieciocho"]);
        const NOM = ["ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO", "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"];
        const t0 = c["c4-dieciocho"] - 0.3, t1 = c["c4-chaval"] + 0.2, obj = D.meses["2025"];
        const m = obj * suave(clamp((t - t0) / (t1 - t0)));
        txt("s4-cal-m", t > t1 - 0.05 ? es(obj) + " MESES" : NOM[Math.floor(m) % 12]);
        for (let k = 0; k < 19; k++) {
          const tk = t0 + (t1 - t0) * k / obj;
          if (k >= Math.floor(obj) || t < tk) { ver(`s4-hj${k}`, false); continue; }
          cae(`s4-hj${k}`, t, tk, 300 + ((k * 137) % 480), 1385 + (k % 3) * 14, { alto: 520, r0: 40 + k * 7, s: 0.5, r: (k % 2 ? 1 : -1) * (6 + k % 5) });
        }
        selloAnim("s4-med", t, c["c4-mitad"], 560, 1180, { s: 0.9, r: 8 });
        persona("s4-h", t, { x: 170, y: 1440, s: 0.8, mira: 1, vivo: true, boca: [[0, "sonrisa"], [c["c4-31555"] + 0.2, "o"], [c["c4-mitad"] + 0.3, "seria"]], ojos: [[0, "felices"], [c["c4-31555"] + 0.2, "grandes"]], brazo: [[0, "abajo"]], fase: 1 });
        persona("s4-p", t, { x: 920, y: 1440, s: 0.8, mira: -1, vivo: true, charla: e, boca: habla(t, e, "seria"), brazo: [[0, "abajo"], [c["c4-31555"] - 0.2, "senala"], [c["c4-mitad"], "hombros"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c4-31555"], e.c["c4-mitad"]]); } },

    // 5 · El hijo, con el móvil: «¡Pero si al primo Dani sus padres se lo compraron nuevo!»
    { n: 5, set: "vacio",
      svg: `<g id="s5-mv">${movilPrimo("s5-m")}</g>${gente("s5", "hp")}`,
      tarjeta: cita(5, "El hijo", `«¡Al primo se lo <mark id="m5">compraron nuevo</mark>!»`),
      fn: function (t, e) {
        const c = e.c;
        ambiente("concesionario", null, t, 0);
        vidaFondo("cc", t, { gente: 2, capa: "concesionario", y: 1150, s: 0.55, W: 1300 });
        marca("m5", t, c["c5-nuevo"] - 0.3);
        pop("s5-mv", t, c["c5-primo"] - 0.2, 520, 960, { s: 1, r: -5 });
        persona("s5-h", t, { x: 190, y: 1440, s: 0.8, mira: 1, vivo: true, charla: e, boca: habla(t, e, "grande"), brazo: [[0, "abajo"], [c["c5-primo"] - 0.3, "senala"]], incl: [[0, 0], [c["c5-nuevo"], 6]], fase: 1 });
        persona("s5-p", t, { x: 920, y: 1440, s: 0.8, mira: -1, vivo: true, boca: [[0, "seria"], [c["c5-nuevo"], "sonrisa"]], brazo: [[0, "abajo"], [c["c5-nuevo"] + 0.1, "hombros"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c5-primo"]]); } },

    // 6 · El padre: «Ya, en 2016. Entonces eran quince meses y medio, no dieciocho. Qué tiempos.» Tres calendarios.
    { n: 6, set: "vacio",
      svg: `${panel(170, 800, 680, 420)}${[[0, 300, "2007", D.meses["2007"], GRIS19, 0.36], [1, 510, "2016", D.meses["2016"], ANTES_T, 0.36], [2, 720, "HOY", D.meses["2025"], HOY, 0.36]].map(([i, x, a, m, col, s]) => `<g id="s6-k${i}" opacity="0">
          <g transform="translate(${x} 930) scale(${s})">${calendario(`s6-cal${i}`)}</g>${rot(x, 1120, es(m), 72, col)}${rot(x, 1166, "MESES", 26, C.gris)}</g>`).join("")}
        ${gente("s6", "hp")}`,
      tarjeta: tarjeta(6, "Meses de sueldo para un coche nuevo", vs(6, [es(D.meses["2016"]), es(D.meses["2025"])], ["en 2016", "hoy"]), { fuente: F_NUEVO, icono: bandera(44) }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("concesionario", null, t, 0);
        vidaFondo("cc", t, { gente: 2, capa: "concesionario", y: 1150, s: 0.55, W: 1300 });
        txt("s6-cal0-m", "2007"); txt("s6-cal1-m", "2016"); txt("s6-cal2-m", "HOY");
        const tt = [c["c6-2016"] + 0.4, c["c6-2016"], c["c6-dieciocho"] - 0.2];
        for (let i = 0; i < 3; i++) css(`s6-k${i}`, "opacity", clamp((t - tt[i]) / 0.3));
        sube("c6-a", t, c["c6-quince"]); sube("c6-b", t, c["c6-dieciocho"]);
        persona("s6-h", t, { x: 120, y: 1440, s: 0.76, mira: 1, vivo: true, boca: [[0, "seria"]], brazo: [[0, "abajo"]], fase: 1 });
        persona("s6-p", t, { x: 960, y: 1440, s: 0.76, mira: -1, vivo: true, charla: e, boca: habla(t, e, "seria"), brazo: [[0, "abajo"], [c["c6-tiempos"] - 0.2, "piensa"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c6-2016"], e.c["c6-dieciocho"]], { acerca: 0.03 }); } },

    // 7 · El hijo, de brazos cruzados: «¿Y a ti no te han subido el sueldo, o qué?»
    { n: 7, set: "vacio",
      svg: `${gente("s7", "hp")}`,
      tarjeta: cita(7, "El hijo", `«¿Y a ti no te han subido el <mark id="m7">sueldo</mark>?»`),
      fn: function (t, e) {
        const c = e.c;
        ambiente("concesionario", null, t, 0);
        vidaFondo("cc", t, { gente: 2, capa: "concesionario", y: 1150, s: 0.55, W: 1300 });
        marca("m7", t, c["c7-sueldo"]);
        persona("s7-h", t, { x: 200, y: 1440, s: 0.8, mira: 1, vivo: true, charla: e, boca: habla(t, e, "seria"), brazo: [[0, "abajo"], [c["c7-sueldo"] - 0.3, "hombros"]], incl: [[0, 0], [c["c7-sueldo"], 6]], fase: 1 });
        persona("s7-p", t, { x: 920, y: 1440, s: 0.8, mira: -1, vivo: true, boca: [[0, "seria"], [c["c7-sueldo"] + 0.3, "o"]], brazo: [[0, "abajo"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c7-sueldo"]]); } },

    // 8 · El padre: «Un 28 %. Y el coche, un 51 %. Haz cuentas, que para algo has estudiado.»
    { n: 8, set: "vacio",
      svg: `${panel(250, 760, 580, 590)}<line x1="290" y1="1270" x2="790" y2="1270" stroke="#C9CED3" stroke-width="5"/>
        <rect id="s8-c0" x="330" y="1270" width="180" height="0" rx="16" fill="${ANTES_T}"/><rect id="s8-c1" x="570" y="1270" width="180" height="0" rx="16" fill="${HOY}"/>
        <g id="s8-l0" opacity="0">${rot(420, 0, "+" + Math.round(D.subeS) + " %", 66, ANTES_T)}</g><g id="s8-l1" opacity="0">${rot(660, 0, "+" + Math.round(D.sube) + " %", 66, HOY)}</g>
        ${rot(420, 1318, "SUELDO", 30, C.tinta)}${rot(660, 1318, "COCHE", 30, C.tinta)}${gente("s8", "hp")}`,
      tarjeta: tarjeta(8, "Subida desde 2016", vs(8, ["+" + Math.round(D.subeS) + "&nbsp;%", "+" + Math.round(D.sube) + "&nbsp;%"], ["sueldo", "coche nuevo"]), { fuente: F_NUEVO, icono: bandera(44) }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("concesionario", null, t, 0);
        vidaFondo("cc", t, { gente: 2, capa: "concesionario", y: 1150, s: 0.55, W: 1300 });
        const hs = [D.subeS * 7.6, D.sube * 7.6], tt = [c["c8-28"] - 0.2, c["c8-51"] - 0.2];
        for (let i = 0; i < 2; i++) {
          const k = suave(clamp((t - tt[i]) / 0.8)), h = k * hs[i];
          attr(`s8-c${i}`, "y", (1270 - h).toFixed(1)); attr(`s8-c${i}`, "height", h.toFixed(1));
          T(`s8-l${i}`, 0, 1270 - h - 24, { s: 1 }); css(`s8-l${i}`, "opacity", clamp((t - tt[i] - 0.5) / 0.3));
        }
        sube("c8-a", t, c["c8-28"]); sube("c8-b", t, c["c8-51"]);
        persona("s8-h", t, { x: 150, y: 1440, s: 0.78, mira: 1, vivo: true, boca: [[0, "seria"], [c["c8-51"] + 0.3, "o"]], ojos: [[0, "normal"], [c["c8-51"] + 0.3, "grandes"]], brazo: [[0, "abajo"]], fase: 1 });
        persona("s8-p", t, { x: 935, y: 1440, s: 0.78, mira: -1, vivo: true, charla: e, boca: habla(t, e, "sonrisa"), brazo: [[0, "abajo"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c8-28"], e.c["c8-51"]]); } },

    // 9 · Compraventa. El padre: «Anda, vámonos. Bienvenido al mundo real.»
    { n: 9, set: "vacio",
      svg: `${gente("s9", "hp")}`,
      tarjeta: cita(9, "El padre", `«Bienvenido al <mark id="m9">mundo real</mark>»`),
      fn: function (t, e) {
        const c = e.c;
        ambiente("compraventa", "concesionario", t, e.t0);
        vidaFondo("cv", t, { gente: 2, capa: "compraventa", y: 1150, s: 0.55, W: 1300 });
        T("cv-band", 0, Math.sin(t * 2) * 4, { s: 1 });
        marca("m9", t, c["c9-real"] - 0.3);
        const w1 = ruta(t, [[e.t0, -160], [e.t0 + 1.2, 190]]), w2 = ruta(t, [[e.t0, 1240], [e.t0 + 1.2, 910]]);
        persona("s9-h", t, { x: w1.x, y: 1440, s: 0.8, anda: w1.anda, mira: 1, vivo: true, boca: [[0, "seria"]], brazo: [[0, "abajo"]], fase: 1 });
        persona("s9-p", t, { x: w2.x, y: 1440, s: 0.8, anda: w2.anda, mira: -1, vivo: true, charla: e, boca: habla(t, e, "sonrisa"), brazo: [[0, "abajo"], [c["c9-real"] - 0.2, "arriba"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c9-real"]]); } },

    // 10 · El padre: «Hoy, por cada coche que se matricula, se venden dos y medio de segunda mano. En 2007, uno y medio.»
    { n: 10, set: "vacio",
      svg: `${picto(10, [{ anyo: "2007", col: ANTES_T, v: D.ratio["2007"] }, { anyo: "2016", col: GRIS19, v: D.ratio["2016"] }, { anyo: "HOY", col: HOY, v: D.ratio["2025"] }], 1110, 86)}
        ${gente("s10", "hp")}`,
      tarjeta: tarjeta(10, "Usados vendidos por cada coche matriculado", `${vs(10, [es(D.ratio["2007"], 2), es(D.ratio["2025"], 2)], ["en 2007", "hoy"])}
        <div class="nota">En 2016, ${es(D.ratio["2016"], 2)}. Incluye los que pasan por un compraventa</div>`, { fuente: F_USADO, icono: bandera(44) }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("compraventa", null, t, 0);
        vidaFondo("cv", t, { gente: 2, capa: "compraventa", y: 1150, s: 0.55, W: 1300 });
        T("cv-band", 0, Math.sin(t * 2) * 4, { s: 1 });
        const tt = [c["c10-2007"], c["c10-2007"] + 0.35, c["c10-medio"] - 0.4];
        for (let i = 0; i < 3; i++) {
          css(`s10-p${i}`, "opacity", clamp((t - tt[i]) / 0.3));
          for (let k = 0; k < 3; k++) css(`s10-pu${i}-${k}`, "opacity", clamp((t - tt[i] - 0.15 - k * 0.18) / 0.25));
        }
        sube("c10-b", t, c["c10-medio"]); sube("c10-a", t, c["c10-2007"]);
        persona("s10-h", t, { x: 130, y: 1440, s: 0.76, mira: 1, vivo: true, boca: [[0, "seria"]], brazo: [[0, "abajo"]], fase: 1 });
        persona("s10-p", t, { x: 955, y: 1440, s: 0.76, mira: -1, vivo: true, charla: e, boca: habla(t, e, "seria"), brazo: [[0, "abajo"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c10-medio"], e.c["c10-2007"]], { acerca: 0.03 }); } },

    // 11 · El hijo señala un utilitario: «Vale, vale... ¿Y ese de ahí? Pocos kilómetros y está muy bien.»
    { n: 11, set: "vacio",
      svg: `<g id="s11-co"><g transform="scale(.66)">${coche("s11-cc", "#E0B04A")}<g transform="translate(-60 -190)"><rect x="-58" y="-26" width="116" height="52" rx="8" fill="#FFFDF8" stroke="#E0B04A" stroke-width="6"/>${rot(0, 12, "OCASIÓN", 26, HOY)}</g></g></g>
        ${gente("s11", "hp")}`,
      tarjeta: cita(11, "El hijo", `«¿Y ese de <mark id="m11">ahí</mark>?»`),
      fn: function (t, e) {
        const c = e.c;
        ambiente("compraventa", null, t, 0);
        vidaFondo("cv", t, { gente: 2, capa: "compraventa", y: 1150, s: 0.55, W: 1300 });
        T("cv-band", 0, Math.sin(t * 2) * 4, { s: 1 });
        marca("m11", t, c["c11-ahi"]);
        const kb = t - c["c11-ese"], bote = kb > 0 && kb < 0.5 ? -16 * Math.sin(kb / 0.5 * Math.PI) : 0;
        T("s11-co", 560, 1330 + bote, { s: 1 });
        persona("s11-h", t, { x: 200, y: 1440, s: 0.8, mira: 1, vivo: true, charla: e, boca: habla(t, e, "sonrisa"), brazo: [[0, "abajo"], [c["c11-ese"] - 0.3, "senala"]], fase: 1 });
        persona("s11-p", t, { x: 920, y: 1440, s: 0.8, mira: -1, vivo: true, boca: [[0, "seria"], [c["c11-bien"], "sonrisa"]], brazo: [[0, "abajo"], [c["c11-ese"], "piensa"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c11-ese"]]); } },

    // 12 · El padre da las llaves: «Ese. Más meses de sueldo que en 2016, pero ese. Y la mitad, ya sabes quién la pone. ¿Tu primer coche fue nuevo o de segunda mano?»
    { n: 12, set: "vacio",
      svg: `<g transform="translate(560 1330) scale(.66)">${coche("s12-cc", "#E0B04A")}<g transform="translate(-60 -190)"><rect x="-58" y="-26" width="116" height="52" rx="8" fill="#FFFDF8" stroke="#2E8B57" stroke-width="6"/>${rot(0, 12, "VENDIDO", 26, "#2E8B57")}</g></g>
        ${gente("s12", "h")}${gente("s12", "p", { p: LLAVES })}${selloMedias("s12-med")}`,
      tarjeta: tarjeta(12, "Te toca", `<div class="tit" style="font-size:54px">Más meses de sueldo que en 2016, como en 2007, y más segunda mano. ¿Tu primer coche, <mark id="m12">nuevo o usado</mark>?</div><div class="sub" id="c12-sub">Te leo en los comentarios.</div>`),
      fn: function (t, e) {
        const c = e.c;
        ambiente("compraventa", null, t, 0);
        vidaFondo("cv", t, { gente: 2, capa: "compraventa", y: 1150, s: 0.55, W: 1300 });
        T("cv-band", 0, Math.sin(t * 2) * 4, { s: 1 });
        marca("m12", t, c["c12-primer"]); sube("c12-sub", t, c["c12-mano"]);
        selloAnim("s12-med", t, c["c12-mitad"], 560, 1150, { s: 0.9, r: -10 });
        persona("s12-h", t, { x: 200, y: 1440, s: 0.8, mira: [[0, 1], [c["c12-primer"], 0]], vivo: true, boca: [[0, "sonrisa"], [c["c12-mitad"], "o"], [c["c12-primer"], "sonrisa"]], ojos: [[0, "felices"], [c["c12-mitad"], "grandes"], [c["c12-primer"], "felices"]],
          brazo: [[0, "abajo"], [c["c12-ese"] + 0.2, "saluda"], [c["c12-mitad"], "abajo"]], salta: c["c12-ese"] + 0.2, fase: 1 });
        persona("s12-p", t, { x: 900, y: 1440, s: 0.8, mira: [[0, -1], [c["c12-primer"], 0]], vivo: true, charla: e, boca: habla(t, e, "sonrisa"),
          brazo: [[0, "sujeta"], [c["c12-mitad"], "senala"], [c["c12-primer"], "abajo"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c12-ese"], e.c["c12-mitad"]]); } },
  ];
}
