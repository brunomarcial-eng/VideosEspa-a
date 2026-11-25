// Escenas de T16 («¿Cuántos meses trabajas para pagar tu coche?», coches, vídeo A) en estilo «limpio».
// Bruno, 22-11-2026: concesionario con un vendedor y una clienta; calendario que pasa los meses y estaciones que cambian
// por los ventanales hasta pagar el coche; al contado y financiado; cuánto son impuestos. Voces del catálogo:
//   · «clienta»: unos 35 años, chaqueta terracota (voz «viajera»).
//   · «vendedor»: unos 45 años, traje gris y corbata verde (voz «profesora», de hombre).
// Decorado nuevo (diseno/concesionario.mjs), en perspectiva y con vida de fondo.
/* eslint-disable no-undef */

import { C, persona, tarjeta, selloOficial } from "../../diseno/limpio.mjs";
import { bandera } from "../../diseno/barrio.mjs";
import { ambientes } from "../../diseno/sueno.mjs";
import { monedaEuro } from "../../diseno/limpio.mjs";
import { BOLSO } from "../../diseno/desayuno.mjs";
import { DECORADOS_T16, estaciones, MARCOS, calendario, hoja, TRAJE, LLAVES, bici } from "../../diseno/concesionario.mjs";

export const ESTILO = "limpio";
const F_SUELDO = "Cálculo propio · INE (Encuesta de Estructura Salarial y Encuesta Trimestral de Coste Laboral) · Eurostat (impuestos sobre el salario)";
const F_PRECIO = "Cálculo propio · Agencia Tributaria (estadística del impuesto de matriculación) · BOE (IVA del 21 %)";
const F_MESES = "Cálculo propio · Agencia Tributaria · INE";
const F_FIN = "Cálculo propio · Banco de España · Agencia Tributaria · INE";
const F_TAE = "Dato oficial: Banco de España (tipos de interés de nuevas operaciones)";
const F_07 = "Cálculo propio · Agencia Tributaria · Banco de España · INE";

export function datos(d) {
  const c = d.coche_medio;
  return {
    bruto: [d.sueldo.bruto_anual["2016"], d.sueldo.bruto_anual["2025"]], neto: [d.sueldo.neto_anual["2016"], d.sueldo.neto_anual["2025"]], mes: [d.sueldo.neto_mes["2016"], d.sueldo.neto_mes["2025"]],
    precio: [c["2016"].precio_con_impuestos, c["2025"].precio_con_impuestos], precioSube: d.coche_medio_sube_pct, sueldoSube: d.sueldo_neto_sube_pct,
    impuestos: c["2025"].impuestos, impuestosPct: c["2025"].impuestos_pct, matric: c["2025"].matriculacion,
    contado: [c["2016"].contado_meses_de_sueldo, c["2025"].contado_meses_de_sueldo], contado19: c["2019"].contado_meses_de_sueldo, fin19: c["2019"].prestamo.meses_de_sueldo,
    contado07: c["2007"].contado_meses_de_sueldo, fin07: c["2007"].prestamo.meses_de_sueldo, tae07: d.tae_consumo_media_anual["2007"],
    fin: [c["2016"].prestamo.meses_de_sueldo, c["2025"].prestamo.meses_de_sueldo], intereses: c["2025"].prestamo.intereses,
    cuota: c["2025"].prestamo.cuota, cuotaPct: c["2025"].prestamo.cuota_pct_sueldo, tercio: d.escenario_tercio.coche_maximo,
    tae: [d.tae_consumo_media_anual["2016"], d.tae_consumo_media_anual["2025"]], taeUlt: d.tae_consumo_ultimo_mes.tae,
  };
}

export const capas = () => ambientes(DECORADOS_T16);

// ------------------------------------------------------------------ personajes (inventados), con volumen
const CLIENTA = { pelo: "largo", canas: false, barba: false, colorPelo: "#3B2A20", ropa: ["#C77B5B", "#A86347"], piel: "#F2CBA8", volumen: true };
const VENDEDOR = { pelo: "corto", canas: true, barba: false, colorPelo: "#4A3A2E", ropa: ["#6B7480", "#59616C"], piel: "#EBC3A0", volumen: true, encima: TRAJE };
const QUIEN = { c: CLIENTA, v: VENDEDOR };
const gente = (n, quien, manos = {}) => quien.split("").map((k) => persona(`${n}-${k}`, "hoy", { ...QUIEN[k], mano: manos[k] ? `<g id="${n}-${k}-mano">${manos[k]}</g>` : undefined })).join("");

// ------------------------------------------------------------------ piezas de los datos
const ANTES_T = "#8A6316", HOY = "#B3261E";
const panel = (x, y, w, h) => `<rect x="${x + 8}" y="${y + 12}" width="${w}" height="${h}" rx="26" fill="#3C2814" opacity=".10"/><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="26" fill="#FFFDF8" opacity=".96"/>`;
const rot = (x, y, t, tam, color, id = "", ancla = "middle") => `<text ${id ? `id="${id}"` : ""} x="${x}" y="${y}" text-anchor="${ancla}" font-family="Cap" font-weight="800" font-size="${tam}" fill="${color}">${t}</text>`;
const miles = (v) => String(Math.round(v)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
const es = (v, d = 1) => v.toFixed(d).replace(".", ",");
const vs = (n, vals, labs, tam = 72) => `<div class="vs">${vals.map((v, i) => `<div class="col"><div class="v ${i ? "t-hoy" : "t-pasado"}" id="c${n}-${"ab"[i]}" style="font-size:${tam}px">${v}</div><div class="n">${labs[i]}</div></div>`).join("")}</div>`;
// Calendario en el pilar central y dos barras de meses de sueldo (2016 y 2025), escenas 6 y 7. Escala de 0 a 21 meses.
// Cada barra: parte sólida = precio del coche; parte clara = intereses del préstamo.
const MESES_X = 350, MESES_W = 380, MESES_MAX = 21, FILA_Y = [1180, 1236, 1292], GRIS19 = "#6B7480";
const mx = (v) => +(v / MESES_MAX * MESES_W).toFixed(1);
const meses = (n, filas, leyenda = false) => `${estaciones(`s${n}-x`)}${MARCOS}
  <g transform="translate(540 905) scale(.66)"><rect x="-170" y="-200" width="340" height="370" rx="22" fill="#3C2814" opacity=".12" transform="translate(8 10)"/>${calendario(`s${n}-cal`)}</g>
  ${panel(250, 1100, 580, 232)}
  ${rot(272, 1142, "MESES DE SUELDO", 20, C.gris, "", "start")}
  ${leyenda ? `<rect x="560" y="1126" width="20" height="20" rx="5" fill="${HOY}"/>${rot(588, 1142, "PRECIO", 18, C.gris, "", "start")}<rect x="676" y="1126" width="20" height="20" rx="5" fill="${HOY}" opacity=".4"/>${rot(704, 1142, "INTERESES", 18, C.gris, "", "start")}` : ""}
  ${filas.map((f, i) => `${rot(268, FILA_Y[i] + 10, f.anyo, 26, f.col, "", "start")}
    <rect x="${MESES_X}" y="${FILA_Y[i] - 16}" width="${MESES_W}" height="32" rx="16" fill="#EEF0F2"/>
    <rect id="s${n}-i${i}" x="${MESES_X}" y="${FILA_Y[i] - 16}" width="0" height="32" rx="16" fill="${f.col}" opacity=".4"/>
    <rect id="s${n}-b${i}" x="${MESES_X}" y="${FILA_Y[i] - 16}" width="0" height="32" rx="16" fill="${f.col}"/>
    <g id="s${n}-v${i}" opacity="0">${rot(MESES_X + mx(f.total) + 12, FILA_Y[i] + 10, f.etiqueta, 28, f.col, "", "start")}</g>`).join("")}
  ${Array.from({ length: 22 }, (_, k) => hoja(`s${n}-hj${k}`)).join("")}`;

export function escenas(D) {
  return [
    // 1 · La clienta entra en el concesionario: «¿Cuántos meses de tu vida trabajas para pagar un coche? Vengo a comprarme uno. A ver qué me cuentan.»
    { n: 1, set: "vacio",
      svg: `${gente("s1", "v", { v: LLAVES })}${gente("s1", "c", { c: BOLSO })}${selloOficial("s1-sello")}`,
      tarjeta: tarjeta(1, "Coches · 2007, 2016 y hoy", `<div class="tit" style="font-size:64px">¿Cuántos <mark id="m1">meses</mark> trabajas para pagar tu coche?</div>`, { icono: bandera(44) }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("concesionario", null, t, 0);
        vidaFondo("cc", t, { gente: 2, capa: "concesionario", y: 1150, s: 0.55, W: 1300 });
        marca("m1", t, c["c1-meses"]);
        selloAnim("s1-sello", t, c["c1-sello"], 330, 860, { s: 0.85, r: -9 });
        const w = ruta(t, [[0.2, -250], [1.8, 190]]);
        persona("s1-c", t, { x: w.x, y: 1440, s: 0.8, anda: w.anda, mira: [[0, 1], [c["c1-meses"], 0]], vivo: true, charla: e, boca: habla(t, e, "seria"),
          brazo: [[0, "abajo"], [c["c1-vengo"], "senala"], [c["c1-cuentan"], "hombros"]], fase: 1 });
        persona("s1-v", t, { x: 935, y: 1440, s: 0.8, mira: -1, vivo: true, boca: [[0, "sonrisa"]], ojos: [[0, "felices"]], brazo: [[0, "abajo"], [c["c1-vengo"] + 0.3, "saluda"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c1-meses"]]); } },

    // 2 · La clienta (voz) y la tabla grande del sueldo: «Yo cobro el sueldo mediano: 1.702 euros netos al mes. En 2016 eran 1.332.»
    { n: 2, set: "vacio",
      svg: `${panel(45, 720, 990, 640)}${rot(650, 800, "2016", 40, C.gris)}${rot(895, 800, "2025*", 40, C.gris)}
        ${[["BRUTO AL AÑO", D.bruto.map((v) => miles(v) + " €")], ["NETO AL AÑO", D.neto.map((v) => miles(v) + " €")], ["NETO AL MES", D.mes.map((v) => miles(v) + " €")]].map(([et, vals], i) => `<g id="s2-f${i}" transform="translate(0 ${920 + i * 125})">
          <rect x="75" y="-62" width="930" height="104" rx="20" fill="${i === 2 ? "#FFF3C4" : "#F3EFE6"}"/>${rot(105, 6, et, 32, C.tinta, "", "start")}
          ${rot(650, 10, vals[0], 42, ANTES_T)}${rot(895, 10, vals[1], 42, HOY)}</g>`).join("")}
        ${rot(540, 1325, "SUELDO MEDIANO, EN 12 PAGAS · *2025 ESTIMADO", 24, C.gris)}`,
      tarjeta: tarjeta(2, "Sueldo neto mediano al mes (en 12 pagas)", `<div class="tit" style="font-size:50px">El sueldo con el que contamos los meses</div>
        <div class="nota">Bruto al año: ${miles(D.bruto[0])}&nbsp;€ y ${miles(D.bruto[1])}&nbsp;€. Neto al año: ${miles(D.neto[0])}&nbsp;€ y ${miles(D.neto[1])}&nbsp;€. 2025, estimado: el último dato del INE es de 2024</div>`, { fuente: F_SUELDO, icono: bandera(44) }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("concesionario", null, t, 0);
        vidaFondo("cc", t, { gente: 2, capa: "concesionario", y: 1150, s: 0.55, W: 1300 });
        const tt = [c["c2-mediano"] - 0.1, c["c2-mediano"] + 0.3, c["c2-1702"] - 0.2];
        for (let i = 0; i < 3; i++) {
          const k = clamp((t - tt[i]) / 0.35);
          css(`s2-f${i}`, "opacity", k); attr(`s2-f${i}`, "transform", `translate(${(60 * (1 - fuera(k))).toFixed(1)} ${920 + i * 125})`);
        }
        const kd = t - c["c2-1702"];
        if (kd > 0 && kd < 0.8) attr("s2-f2", "transform", `translate(0 ${920 + 2 * 125}) scale(${(1 + 0.04 * Math.sin(kd / 0.8 * Math.PI)).toFixed(3)})`);
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c2-1702"]], { acerca: 0.02 }); } },

    // 3 · El vendedor presenta el coche: «Bienvenida. El coche medio que se compra en España cuesta 28.661 euros. En 2016, 20.252.»
    { n: 3, set: "vacio",
      svg: `<g id="s3-et"><rect x="-150" y="-62" width="300" height="124" rx="16" fill="#FFFFFF" stroke="${HOY}" stroke-width="6"/>${rot(0, 6, miles(D.precio[1]) + " €", 52, HOY)}${rot(0, 44, "CON IVA Y MATRICULACIÓN", 16, C.gris)}
          <path d="M0 62 V120" stroke="${C.gris}" stroke-width="4"/></g>${gente("s3", "cv")}`,
      tarjeta: tarjeta(3, "Precio medio de un coche, con IVA y matriculación", `${vs(3, D.precio.map((v) => miles(v) + "&nbsp;€"), ["en 2016", "en 2025"], 66)}
        <div class="nota">Lo que se paga de media por los turismos que se matriculan, con los extras que cada uno elige: uno básico, sin extras, sale más barato. Sube un ${Math.round(D.precioSube)}&nbsp;%; el sueldo neto, un ${Math.round(D.sueldoSube)}&nbsp;%</div>`,
        { fuente: F_PRECIO, icono: bandera(44) }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("concesionario", null, t, 0);
        vidaFondo("cc", t, { gente: 2, capa: "concesionario", y: 1150, s: 0.55, W: 1300 });
        pop("s3-et", t, c["c3-28661"] - 0.15, 540, 930, { s: 1 });
        sube("c3-b", t, c["c3-28661"]); sube("c3-a", t, c["c3-20252"]);
        persona("s3-c", t, { x: 160, y: 1440, s: 0.8, mira: 1, vivo: true, boca: [[0, "seria"], [c["c3-28661"] + 0.3, "o"]], ojos: [[0, "normal"], [c["c3-28661"] + 0.3, "grandes"]], brazo: [[0, "abajo"]], fase: 1 });
        persona("s3-v", t, { x: 930, y: 1440, s: 0.8, mira: -1, vivo: true, charla: e, boca: habla(t, e, "sonrisa"), brazo: [[0, "saluda"], [c["c3-coche"] - 0.2, "senala"], [c["c3-20252"], "hombros"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c3-28661"], e.c["c3-20252"]]); } },

    // 4 · La clienta, mirando la etiqueta: «¿Y cuánto de eso son impuestos?»
    { n: 4, set: "vacio",
      svg: `<g transform="translate(540 930)"><rect x="-150" y="-62" width="300" height="124" rx="16" fill="#FFFFFF" stroke="${HOY}" stroke-width="6"/>${rot(0, 18, "PRECIO", 46, HOY)}<path d="M0 62 V120" stroke="${C.gris}" stroke-width="4"/></g>${gente("s4", "vc")}`,
      tarjeta: tarjeta(4, "La clienta", `<div class="tit">«¿Y cuánto son <mark id="m4">impuestos</mark>?»</div>`, { tono: "hoy" }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("concesionario", null, t, 0);
        vidaFondo("cc", t, { gente: 2, capa: "concesionario", y: 1150, s: 0.55, W: 1300 });
        marca("m4", t, c["c4-impuestos"]);
        const w = ruta(t, [[e.t0 + 0.1, 160], [e.t0 + 0.9, 330]]);
        persona("s4-c", t, { x: w.x, y: 1440, s: 0.8, anda: w.anda, mira: 1, vivo: true, charla: e, boca: habla(t, e, "seria"), brazo: [[0, "abajo"], [c["c4-impuestos"] - 0.2, "piensa"]], incl: [[0, 0], [c["c4-impuestos"], 8]], fase: 1 });
        persona("s4-v", t, { x: 930, y: 1440, s: 0.8, mira: -1, vivo: true, boca: [[0, "sonrisa"], [c["c4-impuestos"] + 0.2, "seria"]], brazo: [[0, "abajo"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c4-impuestos"]], { acerca: 0.07 }); } },

    // 5 · El vendedor: «5.473 euros: el 19 % del precio. IVA y matriculación.»
    { n: 5, set: "vacio",
      svg: `${panel(235, 830, 610, 380)}${rot(540, 895, "EL PRECIO DEL COCHE MEDIO", 24, C.tinta)}
        <g transform="translate(275 960)"><rect x="0" y="0" width="530" height="90" rx="20" fill="#9AA6AE"/><rect id="s5-imp" x="${(530 * (1 - D.impuestosPct / 100)).toFixed(1)}" y="0" width="${(530 * D.impuestosPct / 100).toFixed(1)}" height="90" rx="20" fill="${HOY}"/>
          ${rot(200, 58, "EL COCHE", 30, "#FFFFFF")}</g>
        <g id="s5-et">${rot(700, 1105, es(D.impuestosPct) + " %", 44, HOY)}${rot(700, 1150, "IMPUESTOS: " + miles(D.impuestos) + " €", 24, HOY)}${rot(700, 1185, "IVA + MATRICULACIÓN", 18, C.gris)}</g>
        ${gente("s5", "cv")}`,
      tarjeta: tarjeta(5, "Impuestos del coche medio (IVA y matriculación)", `${vs(5, [miles(D.impuestos) + "&nbsp;€", es(D.impuestosPct) + "&nbsp;%"], ["en euros", "del precio"], 66)}
        <div class="nota">IVA del 21&nbsp;% sobre el precio sin impuestos y el impuesto de matriculación medio (${D.matric}&nbsp;€; según las emisiones de CO₂, del 0 al 14,75&nbsp;%; más de la mitad de los coches no lo paga)</div>`, { fuente: F_PRECIO, icono: bandera(44) }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("concesionario", null, t, 0);
        vidaFondo("cc", t, { gente: 2, capa: "concesionario", y: 1150, s: 0.55, W: 1300 });
        const k = suave((t - c["c5-5473"] + 0.1) / 0.6);
        css("s5-imp", "opacity", k.toFixed(2)); attr("s5-imp", "transform", `translate(0 ${(-30 * (1 - k)).toFixed(1)})`);
        css("s5-et", "opacity", clamp((t - c["c5-19"]) / 0.3));
        sube("c5-a", t, c["c5-5473"]); sube("c5-b", t, c["c5-19"]);
        persona("s5-c", t, { x: 150, y: 1440, s: 0.8, mira: 1, vivo: true, boca: [[0, "seria"], [c["c5-19"] + 0.2, "o"]], ojos: [[0, "normal"], [c["c5-19"] + 0.2, "grandes"]], brazo: [[0, "abajo"]], fase: 1 });
        persona("s5-v", t, { x: 935, y: 1440, s: 0.8, mira: -1, vivo: true, charla: e, boca: habla(t, e, "seria"), brazo: [[0, "abajo"], [c["c5-5473"] - 0.2, "senala"], [c["c5-matriculacion"], "hombros"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c5-5473"], e.c["c5-19"]]); } },

    // 6 · El vendedor: «Si lo pagas al contado: casi diecisiete meses de tu sueldo entero. En 2016, quince.»
    // Bruno: un calendario que pasa los meses y las estaciones que cambian por los ventanales.
    { n: 6, set: "vacio",
      svg: `${meses(6, [{ anyo: "2016", col: ANTES_T, total: D.contado[0], etiqueta: es(D.contado[0]) }, { anyo: "2019", col: GRIS19, total: D.contado19, etiqueta: es(D.contado19) }, { anyo: "2025", col: HOY, total: D.contado[1], etiqueta: es(D.contado[1]) }])}${gente("s6", "cv")}`,
      tarjeta: tarjeta(6, "Meses de sueldo neto para pagar el coche medio al contado", `${vs(6, D.contado.map((v) => es(v)), ["en 2016", "en 2025"])}
        <div class="nota">Todo el sueldo, sin gastar nada más</div>`, { fuente: F_MESES, icono: bandera(44) }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("concesionario", null, t, 0);
        vidaFondo("cc", t, { gente: 2, capa: "concesionario", y: 1150, s: 0.55, W: 1300 });
        const NOM = ["JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE", "ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO"];
        const EST = [0, 0, 1, 1, 1, 2, 2, 2, 3, 3, 3, 0];   // verano, otoño, invierno, primavera según el mes (empieza en julio)
        const t0 = c["c6-contado"], t1 = c["c6-diecisiete"] + 0.6, objetivo = D.contado[1];
        const m = objetivo * suave(clamp((t - t0) / (t1 - t0)));
        attr("s6-b2", "width", (m / 21 * 380).toFixed(1));
        const g16 = suave(clamp((t - c["c6-2016"] + 0.1) / 0.5)); attr("s6-b0", "width", (g16 * D.contado[0] / 21 * 380).toFixed(1)); attr("s6-b1", "width", (g16 * D.contado19 / 21 * 380).toFixed(1));
        txt("s6-cal-m", NOM[Math.floor(m) % 12]);
        // estaciones: funde la del mes en curso con la siguiente
        const mi = Math.floor(m) % 12, est = EST[mi], sig = EST[(mi + 1) % 12], f = m - Math.floor(m);
        for (let s = 0; s < 4; s++) css(`s6-x-e${s}`, "opacity", s === est ? (est === sig ? 1 : 1 - f) : s === sig ? f : 0);
        for (let k = 0; k < 10; k++) { const kk = (t * 0.5 + k / 10) % 1; T(`s6-x-h${k}`, 140 + ((k * 83) % 800), 520 + kk * 480, { r: kk * 400, s: 1 }); }
        for (let k = 0; k < 16; k++) { const kk = (t * 0.35 + k / 16) % 1; T(`s6-x-n${k}`, 130 + ((k * 61) % 820) + Math.sin(t * 2 + k) * 10, 480 + kk * 540, { s: 1 }); }
        // hojas arrancadas: una por mes, caen al suelo
        for (let k = 0; k < 22; k++) {
          const tk = t0 + (t1 - t0) * k / objetivo;
          if (k >= Math.floor(objetivo) || t < tk) { ver(`s6-hj${k}`, false); continue; }
          cae(`s6-hj${k}`, t, tk, 300 + ((k * 137) % 480), 1380 + (k % 3) * 14, { alto: 420, r0: 40 + k * 7, s: 0.55, r: (k % 2 ? 1 : -1) * (6 + k % 5) });
        }
        css("s6-v0", "opacity", clamp((t - c["c6-2016"] - 0.4) / 0.3)); css("s6-v1", "opacity", clamp((t - c["c6-2016"] - 0.4) / 0.3)); css("s6-v2", "opacity", clamp((t - t1 + 0.2) / 0.3));
        sube("c6-b", t, c["c6-diecisiete"]); sube("c6-a", t, c["c6-2016"]);
        persona("s6-c", t, { x: 150, y: 1440, s: 0.8, mira: 1, vivo: true, boca: [[0, "seria"], [c["c6-diecisiete"] + 0.3, "o"]], ojos: [[0, "normal"], [c["c6-diecisiete"] + 0.3, "grandes"]], brazo: [[0, "abajo"]], fase: 1 });
        persona("s6-v", t, { x: 935, y: 1440, s: 0.8, mira: -1, vivo: true, charla: e, boca: habla(t, e, "seria"), brazo: [[0, "abajo"], [c["c6-2016"], "hombros"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c6-diecisiete"]], { acerca: 0.03 }); } },

    // 7 · El vendedor: «¿Financiado a cinco años, al tipo medio de los bancos? 5.780 euros de intereses: veinte meses de sueldo.»
    { n: 7, set: "vacio",
      svg: `${meses(7, [{ anyo: "2016", col: ANTES_T, total: D.fin[0], etiqueta: es(D.fin[0]) }, { anyo: "2019", col: GRIS19, total: D.fin19, etiqueta: es(D.fin19) }, { anyo: "2025", col: HOY, total: D.fin[1], etiqueta: es(D.fin[1]) }], true)}
        <g id="s7-int"><rect x="350" y="1046" width="380" height="44" rx="22" fill="#FFFDF8" opacity=".94"/>${rot(540, 1078, "INTERESES: " + miles(D.intereses) + " €", 30, HOY)}</g>
        ${Array.from({ length: 8 }, (_, k) => `<g id="s7-mo${k}">${monedaEuro(`s7-me${k}`, 20)}</g>`).join("")}${gente("s7", "cv")}`,
      tarjeta: tarjeta(7, "Meses de sueldo neto para pagar el coche medio financiado a cinco años", `${vs(7, D.fin.map((v) => es(v)), ["en 2016", "en 2025"])}
        <div class="nota">Intereses: ${miles(D.intereses)}&nbsp;€. Préstamo de todo el precio, a la TAE media del consumo: ${es(D.tae[1], 2)}&nbsp;% en 2025 y ${es(D.tae[0], 2)}&nbsp;% en 2016</div>`,
        { fuente: F_FIN, icono: bandera(44) }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("concesionario", null, t, 0);
        vidaFondo("cc", t, { gente: 2, capa: "concesionario", y: 1150, s: 0.55, W: 1300 });
        const NOM = ["JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE", "ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO"];
        const EST = [0, 0, 1, 1, 1, 2, 2, 2, 3, 3, 3, 0];
        const t0 = c["c7-intereses"] - 0.6, t1 = c["c7-veinte"] + 0.6, a = D.contado[1], b = D.fin[1];
        const m = a + (b - a) * suave(clamp((t - t0) / (t1 - t0)));
        attr("s7-b2", "width", (a / 21 * 380).toFixed(1)); attr("s7-i2", "width", (m / 21 * 380).toFixed(1));
        const g16 = suave(clamp((t - c["c7-veinte"] - 0.2) / 0.5)); attr("s7-b0", "width", (g16 * D.contado[0] / 21 * 380).toFixed(1)); attr("s7-i0", "width", (g16 * D.fin[0] / 21 * 380).toFixed(1));
        attr("s7-b1", "width", (g16 * D.contado19 / 21 * 380).toFixed(1)); attr("s7-i1", "width", (g16 * D.fin19 / 21 * 380).toFixed(1));
        txt("s7-cal-m", NOM[Math.floor(m) % 12]);
        const mi = Math.floor(m) % 12, est = EST[mi], sig = EST[(mi + 1) % 12], f = m - Math.floor(m);
        for (let s = 0; s < 4; s++) css(`s7-x-e${s}`, "opacity", s === est ? (est === sig ? 1 : 1 - f) : s === sig ? f : 0);
        for (let k = 0; k < 10; k++) { const kk = (t * 0.5 + k / 10) % 1; T(`s7-x-h${k}`, 140 + ((k * 83) % 800), 520 + kk * 480, { r: kk * 400, s: 1 }); }
        for (let k = 0; k < 16; k++) { const kk = (t * 0.35 + k / 16) % 1; T(`s7-x-n${k}`, 130 + ((k * 61) % 820) + Math.sin(t * 2 + k) * 10, 480 + kk * 540, { s: 1 }); }
        for (let k = 0; k < 22; k++) {
          const lleno = k < Math.floor(a), tk = lleno ? -9 : t0 + (t1 - t0) * (k - a) / (b - a);
          if (k >= Math.floor(b) || (!lleno && t < tk)) { ver(`s7-hj${k}`, false); continue; }
          if (lleno) { T(`s7-hj${k}`, 300 + ((k * 137) % 480), 1380 + (k % 3) * 14, { s: 0.55, r: (k % 2 ? 1 : -1) * (6 + k % 5) }); continue; }
          cae(`s7-hj${k}`, t, tk, 300 + ((k * 137) % 480), 1380 + (k % 3) * 14, { alto: 420, r0: 40 + k * 7, s: 0.55, r: (k % 2 ? 1 : -1) * (6 + k % 5) });
        }
        // monedas que se van a los intereses
        for (let k = 0; k < 8; k++) { const kk = (t - c["c7-intereses"] - k * 0.12) / 0.7; if (kk < 0 || kk > 1) { ver(`s7-mo${k}`, false); continue; }
          T(`s7-mo${k}`, 300 + kk * 380 + Math.sin(k) * 20, 1290 - 170 * Math.sin(kk * Math.PI), { s: 1, r: kk * 300, op: 1 - kk * 0.3 }); }
        pop("s7-int", t, c["c7-intereses"], 0, 0, { s: 1 });
        css("s7-v0", "opacity", clamp((t - c["c7-veinte"] - 0.6) / 0.3)); css("s7-v1", "opacity", clamp((t - c["c7-veinte"] - 0.6) / 0.3)); css("s7-v2", "opacity", clamp((t - t1 + 0.2) / 0.3));
        sube("c7-b", t, c["c7-veinte"]); sube("c7-a", t, c["c7-veinte"] + 0.3);
        persona("s7-c", t, { x: 150, y: 1440, s: 0.8, mira: 1, vivo: true, boca: [[0, "seria"], [c["c7-veinte"] + 0.3, "o"]], ojos: [[0, "normal"], [c["c7-veinte"] + 0.3, "grandes"]], brazo: [[0, "abajo"], [c["c7-veinte"] + 0.3, "piensa"]], fase: 1 });
        persona("s7-v", t, { x: 935, y: 1440, s: 0.8, mira: -1, vivo: true, charla: e, boca: habla(t, e, "seria"), brazo: [[0, "abajo"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c7-intereses"], e.c["c7-veinte"]], { acerca: 0.03 }); } },

    // 8 · El vendedor: «La cuota: 574 euros al mes. Un tercio de tu sueldo, cinco años.»
    { n: 8, set: "vacio",
      svg: `${panel(255, 810, 570, 420)}${rot(540, 870, "TU SUELDO DEL MES", 24, C.tinta)}
        <g transform="translate(430 1040)"><circle r="130" fill="#C9CED3"/><path id="s8-q" d="" fill="${HOY}"/><circle r="56" fill="#FFFDF8"/></g>
        <g id="s8-et">${rot(690, 1000, miles(D.cuota) + " €", 46, HOY)}${rot(690, 1040, "AL MES DE CUOTA", 18, C.gris)}${rot(690, 1100, es(D.cuotaPct) + " %", 40, HOY)}${rot(690, 1135, "DEL SUELDO NETO", 18, C.gris)}</g>
        ${gente("s8", "cv")}`,
      tarjeta: tarjeta(8, "Cuota mensual del coche medio financiado a cinco años", `${vs(8, [miles(D.cuota) + "&nbsp;€", es(D.cuotaPct) + "&nbsp;%"], ["al mes", "del sueldo neto"], 66)}
        <div class="nota">Un tercio del sueldo a la cuota durante cinco años da justo para el coche medio: unos 28.300&nbsp;€ (escenario propio, no es una recomendación oficial)</div>`, { fuente: F_FIN, icono: bandera(44) }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("concesionario", null, t, 0);
        vidaFondo("cc", t, { gente: 2, capa: "concesionario", y: 1150, s: 0.55, W: 1300 });
        const R = 130, f = D.cuotaPct / 100 * suave((t - c["c8-574"] + 0.2) / 0.8);
        if (f > 0.002) { const a = f * 2 * Math.PI; attr("s8-q", "d", `M0 0 L0 ${-R} A${R} ${R} 0 ${f > 0.5 ? 1 : 0} 1 ${(R * Math.sin(a)).toFixed(1)} ${(-R * Math.cos(a)).toFixed(1)} Z`); }
        css("s8-et", "opacity", clamp((t - c["c8-574"]) / 0.3));
        sube("c8-a", t, c["c8-574"]); sube("c8-b", t, c["c8-tercio"]);
        persona("s8-c", t, { x: 150, y: 1440, s: 0.8, mira: 1, vivo: true, boca: [[0, "seria"], [c["c8-tercio"] + 0.2, "o"]], brazo: [[0, "abajo"]], fase: 1 });
        persona("s8-v", t, { x: 935, y: 1440, s: 0.8, mira: -1, vivo: true, charla: e, boca: habla(t, e, "seria"), brazo: [[0, "abajo"], [c["c8-574"] - 0.2, "senala"], [c["c8-cinco"], "hombros"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c8-574"], e.c["c8-tercio"]]); } },

    // 9 · La clienta, con sorna: «Vale. ¿Y las bicicletas, dónde las tienen?»
    { n: 9, set: "vacio",
      svg: `${bici("s9-bici")}${gente("s9", "vc", { c: BOLSO })}`,
      tarjeta: tarjeta(9, "La clienta", `<div class="tit">«¿Y las <mark id="m9">bicicletas</mark>?»</div>`, { tono: "hoy" }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("concesionario", null, t, 0);
        vidaFondo("cc", t, { gente: 2, capa: "concesionario", y: 1150, s: 0.55, W: 1300 });
        marca("m9", t, c["c9-bicicletas"]);
        pop("s9-bici", t, c["c9-bicicletas"] - 0.1, 560, 1290, { s: 1 });
        persona("s9-c", t, { x: 200, y: 1440, s: 0.8, mira: [[0, 1], [c["c9-bicicletas"], -1], [c["c9-tienen"], 0]], vivo: true, charla: e, boca: habla(t, e, "sonrisa"), ojos: [[0, "normal"], [c["c9-tienen"], "felices"]],
          brazo: [[0, "abajo"], [c["c9-bicicletas"] - 0.2, "hombros"]], fase: 1 });
        persona("s9-v", t, { x: 935, y: 1440, s: 0.8, mira: -1, vivo: true, boca: [[0, "sonrisa"]], ojos: [[0, "felices"], [c["c9-bicicletas"] + 0.2, "grandes"]], brazo: [[0, "abajo"]], incl: [[0, 0], [c["c9-tienen"], -8]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c9-bicicletas"]], { acerca: 0.07 }); } },

    // 10 · El vendedor: «Eso sí: en 2007, antes de la crisis, era peor. Casi dieciocho meses al contado, y los préstamos, casi al 10 %.»
    // La conclusión cambia con el año (regla 2 del canal): frente a 2007 hoy cuesta menos meses, y se dice.
    { n: 10, set: "vacio",
      svg: `${[[0, "2007", D.contado07, D.tae07, ANTES_T, "#F3EFE6"], [1, "2025", D.contado[1], D.tae[1], HOY, "#FFFFFF"]].map(([i, a, m, tae, col, fondo]) => `<g id="s10-c${i}"><rect x="-160" y="-125" width="320" height="250" rx="20" fill="${fondo}" stroke="${col}" stroke-width="7"/>
          ${rot(0, -72, a, 34, C.gris)}${rot(0, 12, es(m), 76, col)}${rot(0, 50, "MESES AL CONTADO", 18, C.gris)}${rot(0, 96, "PRÉSTAMOS AL " + es(tae, 2) + " %", 20, col)}</g>`).join("")}
        ${gente("s10", "cv")}`,
      tarjeta: tarjeta(10, "Meses de sueldo neto para pagar el coche medio al contado", `${vs(10, [es(D.contado07), es(D.contado[1])], ["en 2007", "en 2025"])}
        <div class="nota">Financiado a cinco años: ${es(D.fin07)} meses en 2007 y ${es(D.fin[1])} en 2025. Préstamos al consumo (TAE media): ${es(D.tae07, 2)}&nbsp;% en 2007 y ${es(D.tae[1], 2)}&nbsp;% en 2025. IVA del 16&nbsp;% en 2007</div>`, { fuente: F_07, icono: bandera(44) }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("concesionario", null, t, 0);
        vidaFondo("cc", t, { gente: 2, capa: "concesionario", y: 1150, s: 0.55, W: 1300 });
        pop("s10-c1", t, e.t0 + 0.25, 700, 980, { s: 1, r: 3 });
        // el cartel de 2007 cae desde arriba y rebota junto al de hoy
        const k0 = (t - c["c10-2007"]) / 0.45;
        if (k0 < 0) ver("s10-c0", false);
        else { const kk = Math.min(1, k0), bote = k0 > 1 && k0 < 1.6 ? -18 * Math.sin((k0 - 1) / 0.6 * Math.PI) : 0;
          T("s10-c0", 375, 980 - 700 * (1 - kk) * (1 - kk) + bote, { s: 1, r: -4 - 10 * (1 - kk), op: clamp(k0 * 3) }); }
        sube("c10-a", t, c["c10-dieciocho"]); sube("c10-b", t, e.t0 + 0.3);
        persona("s10-c", t, { x: 150, y: 1440, s: 0.8, mira: 1, vivo: true, boca: [[0, "seria"], [c["c10-dieciocho"], "o"]], ojos: [[0, "normal"], [c["c10-dieciocho"], "grandes"]], brazo: [[0, "abajo"]], fase: 1 });
        persona("s10-v", t, { x: 935, y: 1440, s: 0.8, mira: -1, vivo: true, charla: e, boca: habla(t, e, "sonrisa"), brazo: [[0, "abajo"], [c["c10-2007"] - 0.2, "hombros"], [c["c10-10"], "abajo"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c10-2007"], e.c["c10-10"]]); } },

    // 11 · La clienta, a cámara: «El coche medio: casi diecisiete meses de sueldo al contado y veinte financiado. Más que en 2016, menos que en 2007. ¿Cuántos meses trabajaste tú para pagar el tuyo?»
    { n: 11, set: "vacio",
      svg: `${Array.from({ length: 20 }, (_, k) => `<g transform="translate(${300 + ((k * 137) % 460)} ${1335 + (k % 3) * 12}) rotate(${(k % 2 ? 1 : -1) * (6 + k % 5)}) scale(.55)">${hoja(`s11-hj${k}`)}</g>`).join("")}
        ${gente("s11", "vc", { v: LLAVES })}`,
      tarjeta: tarjeta(11, "Te toca", `<div class="tit" style="font-size:54px">Más meses de sueldo que en 2016 y en 2019; menos que en 2007. ¿Cuántos te <mark id="m11">costó</mark> el tuyo?</div><div class="sub" id="c11-sub">Te leo en los comentarios.</div>`),
      fn: function (t, e) {
        const c = e.c;
        ambiente("concesionario", null, t, 0);
        vidaFondo("cc", t, { gente: 2, capa: "concesionario", y: 1150, s: 0.55, W: 1300 });
        marca("m11", t, c["c11-tuyo"] - 0.4); sube("c11-sub", t, c["c11-tuyo"]);
        persona("s11-v", t, { x: 960, y: 1440, s: 0.76, mira: -1, vivo: true, boca: [[0, "sonrisa"]], brazo: [[0, "sujeta"]], espejo: true, fase: 2 });
        persona("s11-c", t, { x: 230, y: 1440, s: 0.82, mira: [[0, 1], [c["c11-cuantos"], 0]], vivo: true, charla: e, boca: habla(t, e, "seria"),
          brazo: [[0, "abajo"], [c["c11-diecisiete"] - 0.2, "senala"], [c["c11-cuantos"], "hombros"]], incl: [[0, 0], [c["c11-cuantos"], 6]], fase: 1 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c11-diecisiete"], e.c["c11-cuantos"]]); } },
  ];
}
