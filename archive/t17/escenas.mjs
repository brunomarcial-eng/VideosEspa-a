// Escenas de T17 («Papá, ya tengo el carnet», coches B con padre e hijo) en estilo «limpio».
// Bruno, 22-11-2026: el hijo acaba de cumplir 18 y de aprobar el carnet; le enseña el papel al padre y le pide un coche
// nuevo; debate con datos (el primo, hace diez años; 2007) y acaban eligiendo uno de segunda mano. Voces del catálogo:
//   · «hijo»: 18 años, sudadera verde azulada (voz «hijo»).
//   · «padre»: unos 50, jersey ocre, canas y bigote (voz «comandante»).
// Decorados nuevos (diseno/carnet.mjs): el salón de casa y un compraventa, en perspectiva y con vida de fondo.
/* eslint-disable no-undef */

import { C, persona, tarjeta, selloOficial } from "../../diseno/limpio.mjs";
import { bandera } from "../../diseno/barrio.mjs";
import { ambientes } from "../../diseno/sueno.mjs";
import { coche } from "../../diseno/transporte.mjs";
import { DECORADOS_T17, papel, PAPEL_MANO, fotoPrimo, etiqueta, album, iconoCoche, SUDADERA, LLAVES, calendario, hoja } from "../../diseno/carnet.mjs";

export const ESTILO = "limpio";
const F_NUEVO = "Cálculo propio · Agencia Tributaria · INE";
const F_USADO = "Dato oficial: DGT (cambios de titularidad y matriculaciones) · Agencia Tributaria";
const F_07 = "Cálculo propio · Agencia Tributaria · DGT · INE";

export function datos(d) {
  const n = d.coche_nuevo_medio, u = d.segunda_mano;
  const A = ["2007", "2016", "2019", "2025"];
  return {
    precio: Object.fromEntries(A.map((a) => [a, n[a].precio_con_impuestos])), meses: Object.fromEntries(A.map((a) => [a, n[a].meses_de_sueldo])),
    sinImp: [n["2016"].precio_sin_iedmt, n["2025"].precio_sin_iedmt], mes: d.sueldo_neto_mes,
    sube: d.coche_nuevo_medio_sube_pct, subeS: d.sueldo_neto_sube_pct,
    ratio: Object.fromEntries(A.map((a) => [a, u[a].usados_por_cada_matriculado])), imp: { 2016: u["2016"].usados_importados_pct, 2025: u["2025"].usados_importados_pct },
  };
}

export const capas = () => ambientes(DECORADOS_T17);

// ------------------------------------------------------------------ personajes (inventados), con volumen
const HIJO = { pelo: "corto", canas: false, barba: false, colorPelo: "#2B1D14", ropa: ["#3E8E8A", "#2F6F69"], piel: "#F2CBA8", volumen: true, encima: SUDADERA };
const PADRE = { pelo: "corto", canas: true, barba: false, bigote: true, colorPelo: "#4A3A2E", colorBigote: "#5A4A3E", ropa: ["#C8902E", "#A9781F"], piel: "#DDAE86", piel2: "#C99A72", volumen: true };
const QUIEN = { h: HIJO, p: PADRE };
const gente = (n, quien, manos = {}) => quien.split("").map((k) => persona(`${n}-${k}`, "hoy", { ...QUIEN[k], mano: manos[k] ? `<g id="${n}-${k}-mano">${manos[k]}</g>` : undefined })).join("");

// ------------------------------------------------------------------ piezas de los datos
const ANTES_T = "#8A6316", HOY = "#B3261E", GRIS19 = "#6B7480";
const panel = (x, y, w, h) => `<rect x="${x + 8}" y="${y + 12}" width="${w}" height="${h}" rx="26" fill="#3C2814" opacity=".10"/><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="26" fill="#FFFDF8" opacity=".96"/>`;
const rot = (x, y, t, tam, color, id = "", ancla = "middle") => `<text ${id ? `id="${id}"` : ""} x="${x}" y="${y}" text-anchor="${ancla}" font-family="Cap" font-weight="800" font-size="${tam}" fill="${color}">${t}</text>`;
const miles = (v) => String(Math.round(v)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
const es = (v, d = 1) => v.toFixed(d).replace(".", ",");
const vs = (n, vals, labs, tam = 72) => `<div class="vs">${vals.map((v, i) => `<div class="col"><div class="v ${i ? "t-hoy" : "t-pasado"}" id="c${n}-${"ab"[i]}" style="font-size:${tam}px">${v}</div><div class="n">${labs[i]}</div></div>`).join("")}</div>`;
const cita = (n, quien, html) => tarjeta(n, quien, `<div class="tit">${html}</div>`, { tono: "hoy" });

// Barras de meses de sueldo (escena 4): de 0 a 20 meses.
const BX = 350, BW = 400, BMAX = 20;
const barras = (n, filas, titulo) => `${panel(250, 1100, 580, 232)}${rot(272, 1142, titulo, 20, C.gris, "", "start")}
  ${filas.map((f, i) => { const y = 1188 + i * 56; return `${rot(268, y + 10, f.anyo, 26, f.col, "", "start")}
    <rect x="${BX}" y="${y - 16}" width="${BW}" height="32" rx="16" fill="#EEF0F2"/><rect id="s${n}-b${i}" x="${BX}" y="${y - 16}" width="0" height="32" rx="16" fill="${f.col}"/>
    <g id="s${n}-v${i}" opacity="0">${rot(BX + (f.v / BMAX * BW) + 12, y + 10, es(f.v), 28, f.col, "", "start")}</g>`; }).join("")}`;
// Pictograma de la segunda mano: un coche matriculado → tantos usados que cambian de dueño (el último, partido).
const picto = (n, filas, y0, paso, titulo) => `${panel(250, y0 - 88, 580, 70 + paso * filas.length)}${rot(272, y0 - 46, titulo, 20, C.gris, "", "start")}
  ${filas.map((f, i) => { const y = y0 + i * paso, enteros = Math.floor(f.v), resto = f.v - enteros;
    return `<g id="s${n}-p${i}" opacity="0">${rot(266, y + 4, f.anyo, 30, f.col, "", "start")}
      <g transform="translate(372 ${y + 4})">${iconoCoche(`s${n}-pn${i}`, HOY)}</g>${rot(428, y + 4, "→", 30, C.gris)}
      ${Array.from({ length: enteros }, (_, k) => `<g id="s${n}-pu${i}-${k}" transform="translate(${490 + k * 80} ${y + 4})">${iconoCoche(`s${n}-pux${i}-${k}`, "#9AA6AE")}</g>`).join("")}
      <clipPath id="s${n}-cp${i}"><rect x="${490 + enteros * 80 - 38}" y="${y - 40}" width="${(76 * resto).toFixed(1)}" height="60"/></clipPath>
      <g id="s${n}-pu${i}-${enteros}" clip-path="url(#s${n}-cp${i})"><g transform="translate(${490 + enteros * 80} ${y + 4})">${iconoCoche(`s${n}-pux${i}-x`, "#9AA6AE")}</g></g>
      ${rot(812, y + 8, es(f.v, 2), 34, f.col, "", "end")}</g>`; }).join("")}`;

export function escenas(D) {
  return [
    // 1 · El hijo entra con el papel del aprobado: «¡Papá! ¡Aprobado a la primera! ¿Me compras un coche nuevo?»
    { n: 1, set: "vacio",
      svg: `<g id="s1-pg">${papel("s1-pg-p", 1.25)}</g>${gente("s1", "p")}${gente("s1", "h", { h: PAPEL_MANO })}${selloOficial("s1-sello")}`,
      tarjeta: tarjeta(1, "Coches · 2007, 2016 y hoy", `<div class="tit" style="font-size:64px">¿Nuevo o de <mark id="m1">segunda mano</mark>?</div>`, { icono: bandera(44) }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("salon", null, t, 0);
        vidaFondo("sl", t, { lamparas: 1, capa: "salon" });
        for (let i = 0; i < 2; i++) { const v = i ? -95 : 120, x = ((((t * v + i * 380) % 760) + 760) % 760) + 160; T("sl-c" + i, x, 932, { sx: i ? -1 : 1, sy: 1 }); }
        marca("m1", t, c["c1-nuevo"]);
        selloAnim("s1-sello", t, c["c1-sello"], 290, 770, { s: 0.8, r: -9 });
        pop("s1-pg", t, c["c1-aprobado"] - 0.1, 620, 980, { s: 1, r: 6 });
        const w = ruta(t, [[0.1, -220], [1.0, 190]]);
        persona("s1-h", t, { x: w.x, y: 1440, s: 0.8, anda: w.anda, mira: 1, vivo: true, charla: e, boca: habla(t, e, "grande"), ojos: [[0, "felices"]],
          brazo: [[0, "saluda"], [c["c1-nuevo"], "senala"]], salta: c["c1-aprobado"], fase: 1 });
        persona("s1-p", t, { x: 920, y: 1440, s: 0.8, mira: -1, vivo: true, boca: [[0, "sonrisa"], [c["c1-nuevo"] + 0.2, "o"]], ojos: [[0, "normal"], [c["c1-nuevo"] + 0.2, "grandes"]], brazo: [[0, "abajo"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c1-aprobado"], e.c["c1-nuevo"]]); } },

    // 2 · El padre: «¿Nuevo? Hijo, un coche nuevo cuesta hoy 31.555 euros de media: dieciocho meses y medio de sueldo.»
    { n: 2, set: "vacio",
      svg: `<g transform="translate(540 925) scale(.5)"><rect x="-170" y="-200" width="340" height="370" rx="22" fill="#3C2814" opacity=".12" transform="translate(8 10)"/>${calendario("s2-cal")}</g>
        <g transform="translate(540 1290) scale(.72)">${coche("s2-co", "#D9DEE2")}<rect x="-180" y="-232" width="40" height="40" rx="8" fill="#FFFFFF" opacity=".5"/></g>
        <g id="s2-et">${etiqueta("s2-et-e", miles(D.precio["2025"]) + " €")}</g>
        ${Array.from({ length: 19 }, (_, k) => hoja(`s2-hj${k}`)).join("")}${gente("s2", "hp")}`,
      tarjeta: tarjeta(2, "Coche nuevo medio, con impuestos (2025)", `<div class="tit" style="font-size:76px;color:${HOY}" id="c2-a">${miles(D.precio["2025"])}&nbsp;€</div>
        <div class="sub" id="c2-b">${es(D.meses["2025"])} meses de sueldo neto</div>
        <div class="nota">Comprado nuevo en España, con IVA y matriculación. Sueldo neto mediano: ${miles(D.mes["2025"])}&nbsp;€ al mes</div>`, { fuente: F_NUEVO, icono: bandera(44) }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("salon", null, t, 0);
        vidaFondo("sl", t, { lamparas: 1, capa: "salon" });
        for (let i = 0; i < 2; i++) { const v = i ? -95 : 120, x = ((((t * v + i * 380) % 760) + 760) % 760) + 160; T("sl-c" + i, x, 932, { sx: i ? -1 : 1, sy: 1 }); }
        pop("s2-et", t, c["c2-31555"] - 0.15, 560, 1052, { s: 0.9, r: -4 });
        sube("c2-a", t, c["c2-31555"]); sube("c2-b", t, c["c2-dieciocho"]);
        const NOM = ["ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO", "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"];
        const t0 = c["c2-dieciocho"] - 0.3, t1 = c["c2-sueldo"] + 0.4, obj = D.meses["2025"];
        const m = obj * suave(clamp((t - t0) / (t1 - t0)));
        txt("s2-cal-m", t > t1 - 0.05 ? es(obj) + " MESES" : NOM[Math.floor(m) % 12]);
        for (let k = 0; k < 19; k++) {
          const tk = t0 + (t1 - t0) * k / obj;
          if (k >= Math.floor(obj) || t < tk) { ver(`s2-hj${k}`, false); continue; }
          cae(`s2-hj${k}`, t, tk, 300 + ((k * 137) % 480), 1385 + (k % 3) * 14, { alto: 520, r0: 40 + k * 7, s: 0.5, r: (k % 2 ? 1 : -1) * (6 + k % 5) });
        }
        persona("s2-h", t, { x: 170, y: 1440, s: 0.8, mira: 1, vivo: true, boca: [[0, "sonrisa"], [c["c2-31555"] + 0.2, "o"]], ojos: [[0, "felices"], [c["c2-31555"] + 0.2, "grandes"]], brazo: [[0, "abajo"]], fase: 1 });
        persona("s2-p", t, { x: 920, y: 1440, s: 0.8, mira: -1, vivo: true, charla: e, boca: habla(t, e, "seria"), brazo: [[0, "abajo"], [c["c2-31555"] - 0.2, "senala"], [c["c2-sueldo"], "hombros"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c2-31555"], e.c["c2-sueldo"]]); } },

    // 3 · El hijo señala la foto del primo: «¡Pues al primo Dani se lo comprasteis nuevo!»
    { n: 3, set: "vacio",
      svg: `<g id="s3-f">${fotoPrimo("s3-fp")}</g>${gente("s3", "hp")}`,
      tarjeta: cita(3, "El hijo", `«¡Al <mark id="m3">primo</mark> se lo comprasteis nuevo!»`),
      fn: function (t, e) {
        const c = e.c;
        ambiente("salon", null, t, 0);
        vidaFondo("sl", t, { lamparas: 1, capa: "salon" });
        for (let i = 0; i < 2; i++) { const v = i ? -95 : 120, x = ((((t * v + i * 380) % 760) + 760) % 760) + 160; T("sl-c" + i, x, 932, { sx: i ? -1 : 1, sy: 1 }); }
        marca("m3", t, c["c3-primo"]);
        pop("s3-f", t, c["c3-primo"] - 0.2, 540, 900, { s: 1, r: -3 });
        persona("s3-h", t, { x: 170, y: 1440, s: 0.8, mira: 1, vivo: true, charla: e, boca: habla(t, e, "grande"), brazo: [[0, "abajo"], [c["c3-primo"] - 0.3, "senala"]], incl: [[0, 0], [c["c3-nuevo"], 6]], fase: 1 });
        persona("s3-p", t, { x: 920, y: 1440, s: 0.8, mira: -1, vivo: true, boca: [[0, "seria"], [c["c3-nuevo"], "sonrisa"]], brazo: [[0, "abajo"], [c["c3-nuevo"] + 0.1, "hombros"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c3-primo"]]); } },

    // 4 · El padre: «Eso fue en 2016: quince meses y medio de sueldo.» Barras de 2016, 2019 y hoy.
    { n: 4, set: "vacio",
      svg: `<g id="s4-f"><g transform="scale(.62)">${fotoPrimo("s4-fp")}</g>${rot(0, 128, "2016", 40, ANTES_T)}</g>
        ${barras(4, [{ anyo: "2016", col: ANTES_T, v: D.meses["2016"] }, { anyo: "2019", col: GRIS19, v: D.meses["2019"] }, { anyo: "2025", col: HOY, v: D.meses["2025"] }], "MESES DE SUELDO PARA UN COCHE NUEVO")}
        ${gente("s4", "hp")}`,
      tarjeta: tarjeta(4, "Meses de sueldo neto para pagar el coche nuevo medio", `${vs(4, [es(D.meses["2016"]), es(D.meses["2025"])], ["en 2016", "en 2025"])}
        <div class="nota">En 2019, ${es(D.meses["2019"])}. 2016: ${miles(D.precio["2016"])}&nbsp;€ con impuestos y un sueldo neto mediano de ${miles(D.mes["2016"])}&nbsp;€ al mes</div>`, { fuente: F_NUEVO, icono: bandera(44) }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("salon", null, t, 0);
        vidaFondo("sl", t, { lamparas: 1, capa: "salon" });
        for (let i = 0; i < 2; i++) { const v = i ? -95 : 120, x = ((((t * v + i * 380) % 760) + 760) % 760) + 160; T("sl-c" + i, x, 932, { sx: i ? -1 : 1, sy: 1 }); }
        T("s4-f", 540, 860, { s: 1, r: -3 });
        const tt = [c["c4-2016"], c["c4-quince"] + 0.2, c["c4-quince"] + 0.5], vv = [D.meses["2016"], D.meses["2019"], D.meses["2025"]];
        for (let i = 0; i < 3; i++) {
          const k = suave(clamp((t - tt[i]) / 0.6));
          attr(`s4-b${i}`, "width", (k * vv[i] / 20 * 400).toFixed(1)); css(`s4-v${i}`, "opacity", clamp((t - tt[i] - 0.5) / 0.3));
        }
        sube("c4-a", t, c["c4-quince"]); sube("c4-b", t, c["c4-quince"] + 0.5);
        persona("s4-h", t, { x: 170, y: 1440, s: 0.8, mira: 1, vivo: true, boca: [[0, "seria"]], brazo: [[0, "abajo"]], fase: 1 });
        persona("s4-p", t, { x: 920, y: 1440, s: 0.8, mira: -1, vivo: true, charla: e, boca: habla(t, e, "seria"), brazo: [[0, "abajo"], [c["c4-2016"] - 0.2, "piensa"], [c["c4-quince"] + 0.4, "abajo"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c4-2016"], e.c["c4-quince"]], { acerca: 0.03 }); } },

    // 5 · El hijo: «¿Y los sueldos no han subido?»
    { n: 5, set: "vacio",
      svg: `<g id="s5-n"><rect x="-120" y="-150" width="240" height="300" rx="12" fill="#FFFFFF" stroke="#C9CED3" stroke-width="5"/>${rot(0, -96, "NÓMINA", 40, C.tinta)}
        ${[-50, -20, 10, 40].map((y) => `<rect x="-86" y="${y}" width="172" height="12" rx="6" fill="#D9DEE2"/>`).join("")}<rect x="-86" y="86" width="172" height="30" rx="8" fill="#F3EFE6"/></g>${gente("s5", "hp")}`,
      tarjeta: cita(5, "El hijo", `«¿Y los <mark id="m5">sueldos</mark> no han subido?»`),
      fn: function (t, e) {
        const c = e.c;
        ambiente("salon", null, t, 0);
        vidaFondo("sl", t, { lamparas: 1, capa: "salon" });
        for (let i = 0; i < 2; i++) { const v = i ? -95 : 120, x = ((((t * v + i * 380) % 760) + 760) % 760) + 160; T("sl-c" + i, x, 932, { sx: i ? -1 : 1, sy: 1 }); }
        marca("m5", t, c["c5-sueldos"]);
        pop("s5-n", t, c["c5-sueldos"] - 0.1, 540, 960, { s: 0.9, r: 5 });
        persona("s5-h", t, { x: 170, y: 1440, s: 0.8, mira: 1, vivo: true, charla: e, boca: habla(t, e, "seria"), brazo: [[0, "abajo"], [c["c5-sueldos"] - 0.2, "hombros"]], fase: 1 });
        persona("s5-p", t, { x: 920, y: 1440, s: 0.8, mira: -1, vivo: true, boca: [[0, "seria"]], brazo: [[0, "abajo"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c5-sueldos"]]); } },

    // 6 · El padre: «Sí: un 28 %. Pero el coche nuevo, un 51 %.» Dos columnas que suben.
    { n: 6, set: "vacio",
      svg: `${panel(250, 790, 580, 550)}<line x1="290" y1="1270" x2="790" y2="1270" stroke="#C9CED3" stroke-width="5"/>
        <rect id="s6-c0" x="340" y="1270" width="160" height="0" rx="14" fill="${ANTES_T}"/><rect id="s6-c1" x="580" y="1270" width="160" height="0" rx="14" fill="${HOY}"/>
        <g id="s6-l0" opacity="0">${rot(420, 0, "+" + Math.round(D.subeS) + " %", 54, ANTES_T)}</g><g id="s6-l1" opacity="0">${rot(660, 0, "+" + Math.round(D.sube) + " %", 54, HOY)}</g>
        ${rot(420, 1314, "SUELDO NETO", 26, C.tinta)}${rot(660, 1314, "COCHE NUEVO", 26, C.tinta)}
        ${gente("s6", "hp")}`,
      tarjeta: tarjeta(6, "Subida desde 2016", `${vs(6, ["+" + Math.round(D.subeS) + "&nbsp;%", "+" + Math.round(D.sube) + "&nbsp;%"], ["sueldo neto", "coche nuevo"])}
        <div class="nota">Sueldo neto mediano: de ${miles(D.mes["2016"])}&nbsp;€ a ${miles(D.mes["2025"])}&nbsp;€ al mes. Coche nuevo medio sin impuestos: de ${miles(D.sinImp[0])}&nbsp;€ a ${miles(D.sinImp[1])}&nbsp;€</div>`, { fuente: F_NUEVO, icono: bandera(44) }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("salon", null, t, 0);
        vidaFondo("sl", t, { lamparas: 1, capa: "salon" });
        const hs = [D.subeS * 7.8, D.sube * 7.8], tt = [c["c6-28"] - 0.2, c["c6-51"] - 0.2];
        for (let i = 0; i < 2; i++) {
          const k = suave(clamp((t - tt[i]) / 0.8)), h = k * hs[i];
          attr(`s6-c${i}`, "y", (1270 - h).toFixed(1)); attr(`s6-c${i}`, "height", h.toFixed(1));
          T(`s6-l${i}`, 0, 1270 - h - 22, { s: 1 }); css(`s6-l${i}`, "opacity", clamp((t - tt[i] - 0.5) / 0.3));
        }
        sube("c6-a", t, c["c6-28"]); sube("c6-b", t, c["c6-51"]);
        persona("s6-h", t, { x: 150, y: 1440, s: 0.78, mira: 1, vivo: true, boca: [[0, "seria"], [c["c6-51"] + 0.3, "o"]], ojos: [[0, "normal"], [c["c6-51"] + 0.3, "grandes"]], brazo: [[0, "abajo"]], fase: 1 });
        persona("s6-p", t, { x: 935, y: 1440, s: 0.78, mira: -1, vivo: true, charla: e, boca: habla(t, e, "seria"), brazo: [[0, "abajo"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c6-28"], e.c["c6-51"]]); } },

    // 7 · El padre: «Y hoy, por cada coche que se matricula, dos y medio de segunda mano cambian de dueño. En 2016, dos.»
    { n: 7, set: "vacio",
      svg: `${picto(7, [{ anyo: "2016", col: ANTES_T, v: D.ratio["2016"] }, { anyo: "2019", col: GRIS19, v: D.ratio["2019"] }, { anyo: "2025", col: HOY, v: D.ratio["2025"] }], 1130, 72, "USADOS POR CADA COCHE MATRICULADO")}
        ${gente("s7", "hp")}`,
      tarjeta: tarjeta(7, "Turismos usados que cambian de dueño por cada turismo matriculado", `${vs(7, [es(D.ratio["2016"], 2), es(D.ratio["2025"], 2)], ["en 2016", "en 2025"])}
        <div class="nota">En 2019, ${es(D.ratio["2019"], 2)}. Cuenta también los que pasan por un compraventa. Usados traídos de fuera: el ${es(D.imp["2016"])}&nbsp;% de las matriculaciones en 2016 y el ${es(D.imp["2025"])}&nbsp;% en 2025</div>`, { fuente: F_USADO, icono: bandera(44) }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("salon", null, t, 0);
        vidaFondo("sl", t, { lamparas: 1, capa: "salon" });
        for (let i = 0; i < 2; i++) { const v = i ? -95 : 120, x = ((((t * v + i * 380) % 760) + 760) % 760) + 160; T("sl-c" + i, x, 932, { sx: i ? -1 : 1, sy: 1 }); }
        const tt = [c["c7-2016"], c["c7-2016"] + 0.3, c["c7-medio"] - 0.4];
        for (let i = 0; i < 3; i++) {
          css(`s7-p${i}`, "opacity", clamp((t - tt[i]) / 0.3));
          for (let k = 0; k < 3; k++) { const kk = clamp((t - tt[i] - 0.15 - k * 0.18) / 0.25); css(`s7-pu${i}-${k}`, "opacity", kk); }
        }
        sube("c7-b", t, c["c7-medio"]); sube("c7-a", t, c["c7-2016"]);
        persona("s7-h", t, { x: 150, y: 1440, s: 0.78, mira: 1, vivo: true, boca: [[0, "seria"]], brazo: [[0, "abajo"], [c["c7-medio"], "piensa"]], fase: 1 });
        persona("s7-p", t, { x: 935, y: 1440, s: 0.78, mira: -1, vivo: true, charla: e, boca: habla(t, e, "seria"), brazo: [[0, "abajo"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c7-medio"], e.c["c7-2016"]], { acerca: 0.03 }); } },

    // 8 · El hijo abre el álbum: «¿Y antes de la crisis, en 2007?»
    { n: 8, set: "vacio",
      svg: `<g id="s8-al">${album("s8-alb", "2007")}</g>${gente("s8", "hp")}`,
      tarjeta: cita(8, "El hijo", `«¿Y en <mark id="m8">2007</mark>?»`),
      fn: function (t, e) {
        const c = e.c;
        ambiente("salon", null, t, 0);
        vidaFondo("sl", t, { lamparas: 1, capa: "salon" });
        for (let i = 0; i < 2; i++) { const v = i ? -95 : 120, x = ((((t * v + i * 380) % 760) + 760) % 760) + 160; T("sl-c" + i, x, 932, { sx: i ? -1 : 1, sy: 1 }); }
        marca("m8", t, c["c8-2007"]);
        pop("s8-al", t, c["c8-crisis"] - 0.2, 540, 980, { s: 0.95, r: -2 });
        persona("s8-h", t, { x: 170, y: 1440, s: 0.8, mira: 1, vivo: true, charla: e, boca: habla(t, e, "seria"), brazo: [[0, "abajo"], [c["c8-crisis"] - 0.3, "piensa"]], fase: 1 });
        persona("s8-p", t, { x: 920, y: 1440, s: 0.8, mira: -1, vivo: true, boca: [[0, "sonrisa"]], brazo: [[0, "abajo"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c8-2007"]]); } },

    // 9 · El padre: «Casi los mismos meses que hoy: dieciocho. Pero se vendía menos segunda mano: uno y medio por coche matriculado.»
    { n: 9, set: "vacio",
      svg: `<g id="s9-al"><g transform="scale(.55)">${album("s9-alb", "2007")}</g></g>
        ${picto(9, [{ anyo: "2007", col: ANTES_T, v: D.ratio["2007"] }, { anyo: "2025", col: HOY, v: D.ratio["2025"] }], 1190, 76, "USADOS POR CADA COCHE MATRICULADO")}
        ${gente("s9", "hp")}`,
      tarjeta: tarjeta(9, "Meses de sueldo neto para pagar el coche nuevo medio", `${vs(9, [es(D.meses["2007"]), es(D.meses["2025"])], ["en 2007", "en 2025"])}
        <div class="nota">Usados que cambian de dueño por cada turismo matriculado: ${es(D.ratio["2007"], 2)} en 2007 y ${es(D.ratio["2025"], 2)} en 2025. IVA del 16&nbsp;% en 2007</div>`, { fuente: F_07, icono: bandera(44) }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("salon", null, t, 0);
        vidaFondo("sl", t, { lamparas: 1, capa: "salon" });
        for (let i = 0; i < 2; i++) { const v = i ? -95 : 120, x = ((((t * v + i * 380) % 760) + 760) % 760) + 160; T("sl-c" + i, x, 932, { sx: i ? -1 : 1, sy: 1 }); }
        T("s9-al", 540, 900, { s: 1, r: -2 });
        const tt = [c["c9-uno"] - 0.2, c["c9-uno"] + 0.2];
        for (let i = 0; i < 2; i++) {
          css(`s9-p${i}`, "opacity", clamp((t - tt[i]) / 0.3));
          for (let k = 0; k < 3; k++) { const kk = clamp((t - tt[i] - 0.15 - k * 0.18) / 0.25); css(`s9-pu${i}-${k}`, "opacity", kk); }
        }
        sube("c9-a", t, c["c9-dieciocho"]); sube("c9-b", t, c["c9-dieciocho"] + 0.3);
        persona("s9-h", t, { x: 150, y: 1440, s: 0.78, mira: 1, vivo: true, boca: [[0, "seria"], [c["c9-dieciocho"], "o"]], brazo: [[0, "abajo"]], fase: 1 });
        persona("s9-p", t, { x: 935, y: 1440, s: 0.78, mira: -1, vivo: true, charla: e, boca: habla(t, e, "seria"), brazo: [[0, "abajo"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c9-dieciocho"], e.c["c9-uno"]], { acerca: 0.03 }); } },

    // 10 · En el compraventa, el hijo señala un utilitario: «Vale, vale... ¿Y ese de segunda mano?»
    { n: 10, set: "vacio",
      svg: `<g id="s10-co"><g transform="scale(.66)">${coche("s10-cc", "#E0B04A")}<g transform="translate(-60 -190)"><rect x="-58" y="-26" width="116" height="52" rx="8" fill="#FFFDF8" stroke="#E0B04A" stroke-width="6"/>${rot(0, 12, "OCASIÓN", 26, HOY)}</g></g></g>
        ${gente("s10", "hp")}`,
      tarjeta: cita(10, "El hijo", `«¿Y ese de <mark id="m10">segunda mano</mark>?»`),
      fn: function (t, e) {
        const c = e.c;
        ambiente("compraventa", "salon", t, e.t0);
        vidaFondo("cv", t, { gente: 2, capa: "compraventa", y: 1150, s: 0.55, W: 1300 });
        T("cv-band", 0, Math.sin(t * 2) * 4, { s: 1 });
        marca("m10", t, c["c10-mano"]);
        const kb = t - c["c10-ese"], bote = kb > 0 && kb < 0.5 ? -16 * Math.sin(kb / 0.5 * Math.PI) : 0;
        T("s10-co", 560, 1330 + bote, { s: 1 });
        const w = ruta(t, [[e.t0, 60], [e.t0 + 0.8, 230]]);
        persona("s10-h", t, { x: w.x, y: 1440, s: 0.8, anda: w.anda, mira: 1, vivo: true, charla: e, boca: habla(t, e, "sonrisa"), brazo: [[0, "abajo"], [c["c10-ese"] - 0.3, "senala"]], fase: 1 });
        persona("s10-p", t, { x: 920, y: 1440, s: 0.8, mira: -1, vivo: true, boca: [[0, "seria"], [c["c10-mano"], "sonrisa"]], brazo: [[0, "abajo"], [c["c10-ese"], "piensa"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c10-ese"]]); } },

    // 11 · El padre le da las llaves: «Ese. Hoy, un coche nuevo cuesta más meses que en 2016, como en 2007. Y la mitad la pones tú. ¿Tu primer coche fue nuevo o de segunda mano?»
    { n: 11, set: "vacio",
      svg: `<g transform="translate(560 1330) scale(.66)">${coche("s11-cc", "#E0B04A")}<g transform="translate(-60 -190)"><rect x="-58" y="-26" width="116" height="52" rx="8" fill="#FFFDF8" stroke="#2E8B57" stroke-width="6"/>${rot(0, 12, "VENDIDO", 26, "#2E8B57")}</g></g>
        ${gente("s11", "h")}${gente("s11", "p", { p: LLAVES })}`,
      tarjeta: tarjeta(11, "Te toca", `<div class="tit" style="font-size:54px">Más meses de sueldo que en 2016, como en 2007, y más segunda mano. ¿Tu primer coche fue <mark id="m11">nuevo o usado</mark>?</div><div class="sub" id="c11-sub">Te leo en los comentarios.</div>`),
      fn: function (t, e) {
        const c = e.c;
        ambiente("compraventa", null, t, 0);
        vidaFondo("cv", t, { gente: 2, capa: "compraventa", y: 1150, s: 0.55, W: 1300 });
        T("cv-band", 0, Math.sin(t * 2) * 4, { s: 1 });
        marca("m11", t, c["c11-primer"]); sube("c11-sub", t, c["c11-mano"]);
        persona("s11-h", t, { x: 200, y: 1440, s: 0.8, mira: [[0, 1], [c["c11-primer"], 0]], vivo: true, boca: [[0, "sonrisa"], [c["c11-mitad"], "o"], [c["c11-mitad"] + 0.8, "sonrisa"]], ojos: [[0, "felices"]],
          brazo: [[0, "abajo"], [c["c11-ese"] + 0.2, "saluda"], [c["c11-mitad"], "abajo"]], salta: c["c11-ese"] + 0.2, fase: 1 });
        persona("s11-p", t, { x: 900, y: 1440, s: 0.8, mira: [[0, -1], [c["c11-primer"], 0]], vivo: true, charla: e, boca: habla(t, e, "sonrisa"),
          brazo: [[0, "sujeta"], [c["c11-mitad"], "senala"], [c["c11-primer"], "abajo"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c11-ese"], e.c["c11-primer"]]); } },
  ];
}
