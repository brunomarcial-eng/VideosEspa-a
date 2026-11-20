// Escenas de T10 («¿Montar un bar hoy es más difícil que en 1986?») en estilo «limpio», con personajes con volumen y vivos.
// Dos personajes nuevos (inventados):
//   · «veterana»: hostelera de unos 62 años que abrió su bar en 1986 (pelo largo con canas, blusa ciruela y delantal).
//   · «nuevo»: unos 28 años, abre otro bar enfrente hoy (jersey verde azulado).
// Ella le dicta la lista de obligaciones que en 1986 no existían: cada una cae como un papel con su año y su sello,
// y el contador de la tarjeta sube. Luego, la cuenta por años, el camarero y el IVA de la caña.
// Decorados: la calle con los dos locales («fachada», nuevo) y el bar de ella (el de T4).
/* eslint-disable no-undef */

import { C, persona, bocadillo, tarjeta, monedaEuro } from "../../diseno/limpio.mjs";
import { bandera, DELANTAL } from "../../diseno/barrio.mjs";
import { ambientes, cana, BANDEJA } from "../../diseno/sueno.mjs";
import { billete } from "../../diseno/casa.mjs";
import { boton, LLAVES } from "../../diseno/horas.mjs";

export const ESTILO = "limpio";
const F_LEYES = (s) => "Dato oficial: BOE (" + s + ")";
const F_CUENTA = "Cálculo propio con el BOE: 16 normas, cada una con su fecha";
const F_CAM = "Cálculo propio · BOE (salario mínimo y cotizaciones de cada año) · INE (IPC)";
const F_IVA = "Dato oficial: BOE (tipo de IVA de la hostelería de cada año)";

export function datos(d) {
  const c = d.camarero_salario_minimo;
  return {
    cont: d.contador_por_plano, cuantas: d.cuantas,
    camarero: ["1986", "2006", "2026"].map((a) => c[a].coste_empresa_en_euros_de_2026), camSube: d.camarero_sube_pct["1986"],
    iva: ["1986", "2006", "2026"].map((a) => d.iva_bar_pct[a]),
  };
}

// ------------------------------------------------------------------ decorado nuevo: la calle con los dos locales
const X0 = -400, ANCHO = 1900;
const rotulo = (x, y, t, tam, color, o = "") => `<text x="${x}" y="${y}" text-anchor="middle" font-family="Cap" font-weight="800" font-size="${tam}" fill="${color}" ${o}>${t}</text>`;
function fachada() {
  const ventanas = [0, 1].map((f) => Array.from({ length: 8 }, (_, i) => `<rect x="${X0 + 120 + i * 240}" y="${180 + f * 260}" width="120" height="170" rx="8" fill="#B9CCD6"/>
    <rect x="${X0 + 110 + i * 240}" y="${350 + f * 260}" width="140" height="16" rx="4" fill="#D8C7AA"/>`).join("")).join("");
  const ondas = (x0, x1, y, col) => Array.from({ length: Math.ceil((x1 - x0) / 60) }, (_, i) => `<path d="M${x0 + i * 60} ${y} q30 34 60 0 Z" fill="${col}"/>`).join("");
  const rayas = (x0, x1, y0, h) => Array.from({ length: Math.ceil((x1 - x0) / 60) }, (_, i) => `<rect x="${x0 + i * 60}" y="${y0}" width="30" height="${h}" fill="#EDE3C8"/>`).join("");
  return `<rect x="${X0}" y="-400" width="${ANCHO}" height="1720" fill="#E7D8BF"/>${ventanas}
    <rect x="${X0}" y="720" width="${ANCHO}" height="20" fill="#CDB894"/>
    <!-- el bar de ella -->
    <rect x="-60" y="760" width="560" height="100" rx="10" fill="#3F5B45"/>${rotulo(220, 830, "BAR", 64, "#F4EAD2", 'letter-spacing="10"')}
    ${rotulo(410, 834, "DESDE 1986", 22, "#E7C47A")}
    <rect x="-60" y="860" width="560" height="70" fill="#5F7F62"/>${rayas(-60, 500, 860, 70)}${ondas(-60, 500, 930, "#5F7F62")}
    <rect x="-40" y="960" width="330" height="300" rx="10" fill="#6E5444"/><rect x="-26" y="974" width="302" height="272" rx="6" fill="#F6D9A0"/>
    ${[0, 1, 2, 3, 4].map((i) => `<rect x="${10 + i * 52}" y="1060" width="22" height="58" rx="6" fill="${["#7C9A7E", "#E9C46A", "#9B5A5A", "#C98F6B", "#7C9A7E"][i]}"/>`).join("")}
    <rect x="-26" y="1120" width="302" height="16" fill="#B98A5E"/>
    <rect x="320" y="960" width="160" height="340" rx="8" fill="#7A5638"/><rect x="340" y="980" width="120" height="160" rx="6" fill="#F6D9A0"/><circle cx="452" cy="1180" r="8" fill="#E7C47A"/>
    <!-- el local vacío -->
    <rect x="560" y="760" width="640" height="100" rx="10" fill="#CFC6B8"/>
    <rect x="590" y="880" width="580" height="420" rx="6" fill="#3B3530"/>
    <rect x="590" y="880" width="580" height="250" fill="#A9A49D"/>${Array.from({ length: 12 }, (_, i) => `<rect x="590" y="${890 + i * 20}" width="580" height="5" fill="#8F8A84"/>`).join("")}
    <rect x="590" y="1124" width="580" height="12" fill="#77726C"/>
    <g transform="translate(880 922) rotate(-3)"><rect x="-120" y="-44" width="240" height="88" rx="10" fill="#F2B33D"/>${rotulo(0, 14, "SE ALQUILA", 34, C.tinta)}</g>
    <rect x="${X0}" y="1300" width="${ANCHO}" height="1000" fill="#D3CEC5"/>
    ${Array.from({ length: 16 }, (_, i) => `<line x1="${X0 + i * 130}" y1="1300" x2="${X0 - 80 + i * 130}" y2="2300" stroke="#C2BCB2" stroke-width="4"/>`).join("")}
    <rect x="${X0}" y="1292" width="${ANCHO}" height="14" fill="#BDB6AA"/>`;
}
export const capas = () => ambientes({ fachada });

// ------------------------------------------------------------------ personajes nuevos (inventados), con volumen
const VET = { pelo: "largo", canas: true, barba: false, colorPelo: "#8B7B6E", ropa: ["#8E5A7A", "#73485F"], encima: DELANTAL("#F4EFE6"), piel: "#F2CBA8", volumen: true };
const NUE = { pelo: "corto", canas: false, barba: false, colorPelo: "#3B2A20", ropa: ["#4F8A8B", "#3D6E6F"], piel: "#E2B48C", volumen: true };
// Un camarero imaginario (aparece en transparencia cuando el nuevo pregunta por él).
const CAMARERO = { pelo: "corto", canas: false, barba: false, colorPelo: "#2A1E16", ropa: ["#FFFDF8", "#E3DDD2"], encima: DELANTAL("#3B2A20"), piel: "#EDBE96", volumen: true, mano: BANDEJA };
const LIBRETA = `<g transform="translate(6 -34) rotate(-10)"><rect x="-36" y="-48" width="72" height="96" rx="6" fill="#F4F1EA" stroke="#C9C2B3" stroke-width="4"/>
  <rect x="-36" y="-48" width="14" height="96" rx="4" fill="#C8902E"/>${[0, 1, 2, 3].map((k) => `<rect x="-14" y="${-28 + k * 18}" width="${k % 2 ? 30 : 40}" height="6" rx="3" fill="#C9CED3"/>`).join("")}</g>`;
const CANA = `<g transform="translate(16 -4) scale(.9)"><path d="M-24 -84 H24 L18 0 H-18 Z" fill="#E9B949"/><path d="M-28 -98 Q-14 -112 0 -100 Q14 -114 28 -98 L24 -80 H-24 Z" fill="#FFFFFF" stroke="#E3D6BF" stroke-width="3"/></g>`;
const dos = (p, mv = "", mn = "") => `${persona(p + "-v", "hoy", { ...VET, mano: mv ? `<g id="${p}-mv">${mv}</g>` : undefined })}${persona(p + "-n", "hoy", { ...NUE, mano: mn ? `<g id="${p}-mn">${mn}</g>` : undefined })}`;

// ------------------------------------------------------------------ objetos
const TINTA_SELLO = "#9B3B2E", SELLO_FUTURO = "#C8902E";
const panel = (x, y, w, h) => `<rect x="${x + 8}" y="${y + 12}" width="${w}" height="${h}" rx="26" fill="#3C2814" opacity=".10"/><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="26" fill="#FFFDF8" opacity=".96"/>`;
const rot = (x, y, t, tam, color, id = "", ancla = "middle") => `<text ${id ? `id="${id}"` : ""} x="${x}" y="${y}" text-anchor="${ancla}" font-family="Cap" font-weight="800" font-size="${tam}" fill="${color}">${t}</text>`;
const es = (v, d = 1) => v.toFixed(d).replace(".", ",");
const miles = (v) => Math.round(v).toLocaleString("es-ES").replace(/,/g, ".");

// Un papel de la lista: dos líneas de texto y el sello con el año. Origen: el centro del papel.
function papel(id, l1, l2, anyo, futuro = false) {
  const tam = Math.max(l1.length, l2.length) > 11 ? 25 : 30, col = futuro ? SELLO_FUTURO : TINTA_SELLO;
  return `<g id="${id}"><rect x="-122" y="-84" width="252" height="184" rx="12" fill="#3C2814" opacity=".14"/>
    <rect x="-130" y="-92" width="260" height="184" rx="12" fill="#FFFDF8" stroke="#E3D6BF" stroke-width="3"/>
    <rect x="-130" y="-92" width="260" height="14" rx="7" fill="${col}" opacity=".85"/>
    ${rot(0, -36, l1, tam, C.tinta)}${rot(0, -4, l2, tam, C.tinta)}
    <g id="${id}-st"><rect x="-62" y="-24" width="124" height="48" rx="8" fill="none" stroke="${col}" stroke-width="5"/>${rot(0, 12, anyo, 32, col)}</g></g>`;
}
const PAPELES = {
  4: [["PROTECCIÓN", "DE DATOS", 1993], ["RIESGOS", "LABORALES", 1996], ["CONTROL", "DE HIGIENE", 1996], ["SEGURO", "OBLIGATORIO", 1998]],
  5: [["PROTOCOLO", "ANTIACOSO", 2007], ["PROHIBIDO", "FUMAR", 2011], ["CARTA DE", "ALÉRGENOS", 2015], ["DESCONEXIÓN", "DIGITAL", 2018]],
  6: [["REGISTRO", "DE JORNADA", 2019], ["REGISTRO", "DE SUELDOS", 2021], ["AGUA DEL GRIFO", "GRATIS", 2022], ["TÁPER PARA", "LAS SOBRAS", 2025]],
  7: [["IMPUESTO", "DEL PLÁSTICO", 2023], ["COTIZACIÓN", "MEI", 2023], ["CUOTA SEGÚN", "INGRESOS", 2023]],
  8: [["FACTURACIÓN", "ANTIFRAUDE", 2027]],
};
const papeles = (n) => PAPELES[n].map(([a, b, y], i) => papel(`s${n}-p${i}`, a, b, y, y > 2026)).join("");
// Montón de papeles visto de lado (16 hojas). Origen: el suelo, en el centro.
function monton(id, n, grueso = 26) {
  return `<g id="${id}">${Array.from({ length: n }, (_, k) => {
    const dx = ((k * 37) % 7 - 3) * 5, r = ((k * 53) % 5 - 2) * 1.1, col = k === n - 1 ? SELLO_FUTURO : TINTA_SELLO;
    return `<g id="${id}-h${k}" transform="translate(${dx} ${-k * grueso - grueso / 2}) rotate(${r})"><rect x="-150" y="${-grueso / 2 + 2}" width="300" height="${grueso - 4}" rx="4" fill="#FFFDF8" stroke="#D8CCB6" stroke-width="3"/>
      <rect x="96" y="${-grueso / 2 + 5}" width="38" height="${grueso - 10}" rx="3" fill="${col}" opacity=".8"/></g>`;
  }).join("")}</g>`;
}
// Tarjeta de cada plano de la lista: el contador grande de obligaciones nuevas.
const lista = (n, total, sub, fuente, nota = "") => tarjeta(n, "Lo que no existía en 1986",
  `<div class="tit" style="font-size:68px"><span id="c${n}-n" style="display:inline-block;color:${TINTA_SELLO}">${total}</span> obligaciones nuevas</div>
   <div class="sub">${sub}</div>${nota ? `<div class="nota">${nota}</div>` : ""}`, { fuente, icono: bandera(44) });
const vs3 = (n, vals, labs, tam = 64) => `<div class="vs">${vals.map((v, i) => `<div class="col"><div class="v ${i === vals.length - 1 ? "t-hoy" : "t-pasado"}" id="c${n}-${"abc"[i]}" style="font-size:${tam}px">${v}</div><div class="n">${labs[i]}</div></div>`).join("")}</div>`;
// Posiciones de los papeles en el centro (2 × 2, 3 o 1).
const SITIO = { 4: [[400, 905], [680, 905], [400, 1125], [680, 1125]], 3: [[400, 905], [680, 905], [540, 1125]], 1: [[540, 1010]] };

export function escenas(D) {
  // Cada plano de la lista: los papeles caen al nombrarlos y el contador sube.
  const planoLista = (n, set, antes) => ({
    fn: new Function("t", "e", `
      const c = e.c, n = ${n}, k = ${PAPELES[n].length};
      ambiente("bar", ${antes ? `"${antes}"` : "null"}, t, e.t0);
      const sitio = ${JSON.stringify(SITIO[PAPELES[n].length])}, gira = [-4, 3, 2, -3];
      const tiempos = [];
      for (let i = 0; i < k; i++) {
        const t0 = c["c" + n + "-" + (i + 1)] - 0.05;
        tiempos.push(t0 + 0.42);
        cae("s" + n + "-p" + i, t, t0, sitio[i][0], sitio[i][1], { r: gira[i], s: k === 1 ? 1.35 : 1 });
        pop("s" + n + "-p" + i + "-st", t, t0 + 0.42, 0, 46, { s: 1, r: -7 });
      }
      cuenta("c" + n + "-n", t, D.cont[String(n - 1)] || 0, tiempos);
      persona("s" + n + "-v", t, { x: 150, y: 1440, s: 0.8, mira: 1, vivo: true, charla: e, boca: habla(t, e), brazo: [[0, "abajo"], [c["c" + n + "-1"] - 0.2, "senala"], [c["c" + n + "-" + k] + 0.3, "arriba"]], fase: 1 });
      persona("s" + n + "-n", t, { x: 930, y: 1440, s: 0.8, mira: -1, vivo: true, boca: [[0, "seria"], [c["c" + n + "-" + k] + 0.4, "o"]], ojos: [[0, "normal"], [c["c" + n + "-" + k] + 0.4, "grandes"]],
        brazo: [[0, "sujeta"], [c["c" + n + "-1"] + 0.2, "empuja"], [c["c" + n + "-2"] + 0.2, "sujeta"], [c["c" + n + "-" + k] + 0.2, "empuja"]], espejo: true, fase: 2 });
    `),
    cam: new Function("t", "e", `return camVivo(t, e, [e.c["c${n}-${PAPELES[n].length}"] + 0.4]);`),
  });

  return [
    // 1 · El nuevo (calle): «¡Vecina! Abro un bar aquí enfrente. ¿Algún consejo?»
    { n: 1, set: "vacio",
      svg: dos("s1", "", LLAVES),
      tarjeta: tarjeta(1, "Una hostelera de 1986 y uno que abre hoy", `<div class="tit" style="font-size:66px">¿Montar un bar hoy es <mark id="m1">más difícil</mark> que en 1986?</div>`, { icono: bandera(44) }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("fachada", null, t, 0);
        marca("m1", t, c["c1-consejo"]);
        const v = ruta(t, [[0.1, 1250], [1.5, 880]]);
        persona("s1-n", t, { x: v.x, y: 1440, s: 0.8, anda: v.anda, mira: -1, vivo: true, charla: e, boca: habla(t, e, "sonrisa"), ojos: [[0, "normal"], [c["c1-vecina"], "felices"], [c["c1-enfrente"], "normal"]],
          brazo: [[0, "abajo"], [c["c1-vecina"] - 0.2, "saluda"], [c["c1-enfrente"] - 0.1, "senala"], [c["c1-consejo"], "hombros"]], espejo: true, fase: 2 });
        persona("s1-v", t, { x: 400, y: 1440, s: 0.8, mira: [[0, 0], [c["c1-vecina"] + 0.2, 1]], vivo: true, salta: c["c1-vecina"] + 0.2, boca: [[0, "seria"], [c["c1-vecina"] + 0.3, "sonrisa"]], ojos: [[0, "normal"], [c["c1-consejo"], "felices"]],
          brazo: [[0, "abajo"], [c["c1-vecina"] + 0.4, "saluda"], [c["c1-enfrente"] + 0.4, "abajo"]], fase: 1 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c1-vecina"]]); } },

    // 2 · La veterana (calle): «Yo abrí el mío en 1986: licencias, altas y a servir cañas. Tú, apunta.»
    { n: 2, set: "vacio",
      svg: `<g id="s2-l1">${papel("s2-pa", "LICENCIA", "DEL BAR", 1986)}</g><g id="s2-l2">${papel("s2-pb", "ALTA DE", "AUTÓNOMA", 1986)}</g>
        <g id="s2-ca">${cana("s2-c", 1.3)}</g><g id="s2-lib">${LIBRETA}</g>${dos("s2", LIBRETA, LIBRETA)}`,
      tarjeta: tarjeta(2, "La hostelera", `<div class="tit">«En 1986: licencias, altas y a <mark id="m2">servir</mark>»</div>`, { tono: "pasado" }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("fachada", null, t, 0);
        marca("m2", t, c["c2-canas"]);
        pop("s2-l1", t, c["c2-licencias"], 520, 940, { s: 0.8, r: -6 }); pop("s2-l2", t, c["c2-altas"], 600, 1110, { s: 0.8, r: 5 });
        pop("s2-pa-st", t, c["c2-licencias"] + 0.3, 0, 46, { r: -7 }); pop("s2-pb-st", t, c["c2-altas"] + 0.3, 0, 46, { r: -7 });
        pop("s2-ca", t, c["c2-canas"], 110, 1040, { s: 1.1 });
        ver("s2-mv", t < c["c2-apunta"]);
        salto("s2-lib", t, c["c2-apunta"], 330, 1110, 830, 1140, { d: 0.5, alto: 220, r: 300 });
        if (t >= c["c2-apunta"] + 0.5) ver("s2-lib", false);
        ver("s2-mn", t >= c["c2-apunta"] + 0.5);
        persona("s2-v", t, { x: 260, y: 1440, s: 0.8, mira: 1, vivo: true, charla: e, boca: habla(t, e, "sonrisa"), ojos: [[0, "felices"], [c["c2-licencias"], "normal"], [c["c2-apunta"], "felices"]],
          brazo: [[0, "sujeta"], [c["c2-licencias"] - 0.2, "senala"], [c["c2-canas"] - 0.1, "arriba"], [c["c2-apunta"] - 0.25, "sujeta"], [c["c2-apunta"], "senala"]], fase: 1 });
        persona("s2-n", t, { x: 880, y: 1440, s: 0.8, mira: -1, vivo: true, boca: [[0, "sonrisa"], [c["c2-apunta"] + 0.3, "o"]], ojos: [[0, "normal"], [c["c2-apunta"] + 0.3, "grandes"]],
          brazo: [[0, "abajo"], [c["c2-apunta"] + 0.2, "sujeta"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c2-licencias"]]); } },

    // 3 · El nuevo (calle), con la libreta: «¿Tanto ha cambiado?»
    { n: 3, set: "vacio",
      svg: dos("s3", "", LIBRETA),
      tarjeta: tarjeta(3, "El nuevo", `<div class="tit">«¿Tanto ha <mark id="m3">cambiado</mark>?»</div>`, { tono: "hoy" }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("fachada", null, t, 0);
        marca("m3", t, c["c3-cambiado"]);
        persona("s3-v", t, { x: 260, y: 1440, s: 0.8, mira: 1, vivo: true, boca: [[0, "sonrisa"], [c["c3-cambiado"] + 0.3, "grande"]], ojos: [[0, "normal"], [c["c3-cambiado"] + 0.3, "felices"]],
          brazo: [[0, "senala"], [c["c3-cambiado"] + 0.3, "hombros"]], fase: 1 });
        persona("s3-n", t, { x: 880, y: 1440, s: 0.8, mira: -1, vivo: true, charla: e, salta: c["c3-cambiado"] - 0.1, boca: habla(t, e, "o"), ojos: [[0, "grandes"]],
          brazo: [[0, "sujeta"]], incl: [[0, 0], [c["c3-cambiado"], 7]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c3-cambiado"]]); } },

    // 4 a 8 · La lista (bar): los papeles caen y el contador sube.
    { n: 4, set: "vacio", svg: `${papeles(4)}${dos("s4", "", LIBRETA)}`,
      tarjeta: lista(4, D.cont["4"], "ya en 2006", F_LEYES("leyes de protección de datos y de riesgos laborales, norma de higiene de los alimentos y ley de espectáculos de Madrid")),
      ...planoLista(4, "bar", "fachada") },
    { n: 5, set: "vacio", svg: `${papeles(5)}${dos("s5", "", LIBRETA)}`,
      tarjeta: lista(5, D.cont["5"], "ya van 8", F_LEYES("ley de igualdad, ley del tabaco, norma de alérgenos y ley de protección de datos")),
      ...planoLista(5, "bar") },
    { n: 6, set: "vacio", svg: `${papeles(6)}${dos("s6", "", LIBRETA)}`,
      tarjeta: lista(6, D.cont["6"], "ya van 12", F_LEYES("registro de jornada, igualdad retributiva, ley de residuos y ley del desperdicio alimentario")),
      ...planoLista(6, "bar") },
    { n: 7, set: "vacio", svg: `${papeles(7)}${dos("s7", "", LIBRETA)}`,
      tarjeta: lista(7, D.cont["7"], "hoy: ya van 15", F_LEYES("ley de residuos, reforma de las pensiones y cotización de los autónomos")),
      ...planoLista(7, "bar") },
    { n: 8, set: "vacio", svg: `${papeles(8)}${dos("s8", "", LIBRETA)}`,
      tarjeta: lista(8, D.cont["8"], "y van 16 en 2027", F_LEYES("reglamento de los programas de facturación y su aplazamiento"), "Para quien factura con ordenador o caja informática"),
      ...planoLista(8, "bar") },

    // 9 · El nuevo (bar), ante el montón: «Pero… ¿cuántas son?»
    { n: 9, set: "vacio",
      svg: `<g transform="translate(540 1300)">${monton("s9-m", 16)}</g>${dos("s9", "", LIBRETA)}`,
      tarjeta: tarjeta(9, "El nuevo", `<div class="tit">«¿<mark id="m9">Cuántas</mark> son?»</div>`, { tono: "hoy" }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("bar", null, t, 0);
        marca("m9", t, c["c9-cuantas"]);
        for (let k = 0; k < 16; k++) { const t0 = e.t0 + 0.05 + k * 0.05; css("s9-m-h" + k, "opacity", t < t0 ? 0 : 1); }
        const tb = Math.max(0, t - c["c9-cuantas"]);
        attr("s9-m", "transform", `rotate(${(tb < 1.2 ? 1.5 * Math.sin(tb * 9) * (1 - tb / 1.2) : 0).toFixed(2)} 0 -200)`);
        persona("s9-v", t, { x: 150, y: 1440, s: 0.8, mira: 1, vivo: true, boca: "sonrisa", brazo: [[0, "hombros"]], fase: 1 });
        persona("s9-n", t, { x: 930, y: 1440, s: 0.8, mira: -1, vivo: true, charla: e, boca: habla(t, e, "o"), ojos: [[0, "grandes"]], brazo: [[0, "sujeta"], [c["c9-cuantas"], "piensa"]],
          incl: [[0, 0], [c["c9-cuantas"], -8]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c9-cuantas"]], { acerca: 0.07 }); } },

    // 10 · La veterana (bar): «15 que en 1986 no existían, 16 en 2027. Y 11, nuevas desde 2006.»
    { n: 10, set: "vacio",
      svg: `${panel(220, 790, 640, 470)}
        ${[["1986", 0], ["2006", D.cuantas["2006"]], ["HOY", D.cuantas["2026"]], ["2027", D.cuantas["2027"]]].map(([et, v], i) => `<g transform="translate(${330 + i * 140} 1180)">
          ${Array.from({ length: v }, (_, k) => `<rect id="s10-c${i}-${k}" x="-46" y="${-k * 15 - 13}" width="92" height="12" rx="3" fill="${k === 15 ? SELLO_FUTURO : i === 2 ? TINTA_SELLO : "#C9B79B"}"/>`).join("")}
          ${v ? `<g id="s10-v${i}">${rot(0, -v * 15 - 26, String(v), 40, i >= 2 ? TINTA_SELLO : C.gris)}</g>` : `<rect x="-46" y="-6" width="92" height="6" rx="3" fill="#C9B79B"/>`}
          ${rot(0, 46, et, 28, C.gris)}</g>`).join("")}
        <g id="s10-llave"><path d="M570 1118 H552 V958 H570" fill="none" stroke="${TINTA_SELLO}" stroke-width="5"/>${rot(542, 1050, "+11", 34, TINTA_SELLO, "", "end")}</g>
        ${rot(540, 1250, "OBLIGACIONES QUE EN 1986 NO EXISTÍAN", 19, C.gris)}${dos("s10")}`,
      tarjeta: tarjeta(10, "Obligaciones de un bar que no existían en 1986", `${vs3(10, [D.cuantas["2006"], D.cuantas["2026"], D.cuantas["2027"]], ["en 2006", "hoy", "en 2027"], 80)}
        <div class="nota">De ellas, ${D.cuantas["nuevas_desde_2006_hoy"]} nuevas desde 2006. Cada una, con su norma y su fecha en el BOE</div>`, { fuente: F_CUENTA, icono: bandera(44) }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("bar", null, t, 0);
        const tt = [e.t0, e.t0 + 0.2, c["c10-15"], c["c10-16"]], N = [0, D.cuantas["2006"], D.cuantas["2026"], D.cuantas["2027"]];
        for (let i = 1; i < 4; i++) {
          for (let k = 0; k < N[i]; k++) { const t0 = (i === 3 ? tt[2] : tt[i]) + (i === 3 && k < 15 ? 0 : k * 0.04 + (i === 3 ? 0.0 : 0)); css(`s10-c${i}-${k}`, "opacity", i === 3 && k === 15 ? clamp((t - tt[3]) / 0.2) : clamp((t - t0) / 0.15)); }
          css(`s10-v${i}`, "opacity", clamp((t - (i === 3 ? tt[3] : tt[i] + N[i] * 0.04)) / 0.25));
        }
        css("s10-llave", "opacity", clamp((t - c["c10-11"]) / 0.3));
        sube("c10-a", t, e.t0 + 0.3); sube("c10-b", t, c["c10-15"]); sube("c10-c", t, c["c10-16"]);
        persona("s10-v", t, { x: 120, y: 1440, s: 0.8, mira: 1, vivo: true, charla: e, boca: habla(t, e), brazo: [[0, "abajo"], [c["c10-15"] - 0.2, "senala"], [c["c10-11"], "arriba"]], fase: 1 });
        persona("s10-n", t, { x: 960, y: 1440, s: 0.8, mira: -1, vivo: true, boca: [[0, "seria"], [c["c10-15"] + 0.2, "o"]], ojos: [[0, "normal"], [c["c10-15"] + 0.2, "grandes"]], salta: c["c10-16"] + 0.1,
          brazo: [[0, "sujeta"], [c["c10-11"] + 0.3, "piensa"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c10-15"], e.c["c10-16"]]); } },

    // 11 · El nuevo (bar): «¿Y si contrato a un camarero?»
    { n: 11, set: "vacio",
      svg: `<g id="s11-cam" style="opacity:0">${persona("s11-cm", "hoy", CAMARERO)}</g><g id="s11-q">${rot(0, 0, "?", 110, C.gris)}</g>${dos("s11", "", LIBRETA)}`,
      tarjeta: tarjeta(11, "El nuevo", `<div class="tit">«¿Y si contrato a un <mark id="m11">camarero</mark>?»</div>`, { tono: "hoy" }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("bar", null, t, 0);
        marca("m11", t, c["c11-camarero"]);
        css("s11-cam", "opacity", (0.72 * clamp((t - c["c11-camarero"] + 0.1) / 0.3)).toFixed(2));
        persona("s11-cm", t, { x: 545, y: 1390, s: 0.68, mira: 0, vivo: true, salta: c["c11-camarero"] + 0.1, boca: "sonrisa", brazo: [[0, "sujeta"]], fase: 3 });
        pop("s11-q", t, c["c11-camarero"] + 0.3, 545, 900, { s: 1 });
        persona("s11-v", t, { x: 150, y: 1440, s: 0.8, mira: 1, vivo: true, boca: [[0, "sonrisa"], [c["c11-camarero"] + 0.3, "seria"]], brazo: [[0, "abajo"], [c["c11-camarero"] + 0.3, "hombros"]], fase: 1 });
        persona("s11-n", t, { x: 930, y: 1440, s: 0.8, mira: -1, vivo: true, charla: e, boca: habla(t, e), brazo: [[0, "sujeta"], [c["c11-camarero"] - 0.2, "senala"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c11-camarero"]]); } },

    // 12 · La veterana (bar): «Con el salario mínimo, un 48 % más caro que en 1986, ya descontada la inflación.»
    { n: 12, set: "vacio",
      svg: `${panel(230, 780, 620, 470)}${D.camarero.map((v, i) => { const nb = Math.round(v / 1500); return `<g transform="translate(${380 + i * 160} 1160)">
          ${Array.from({ length: nb }, (_, k) => `<g id="s12-b${i}-${k}" transform="translate(0 ${-k * 18}) scale(.66)">${billete(`s12-bb${i}-${k}`)}</g>`).join("")}
          <g id="s12-v${i}">${rot(0, -nb * 18 - 40, miles(v) + " €", 27, i === 2 ? TINTA_SELLO : C.gris)}</g>${rot(0, 62, ["1986", "2006", "HOY"][i], 28, C.gris)}</g>`; }).join("")}
        ${rot(540, 1238, "LO QUE CUESTA AL BAR UN CAMARERO AL AÑO", 19, C.gris)}${dos("s12", "", LIBRETA)}`,
      tarjeta: tarjeta(12, "Un camarero con el salario mínimo, al año, en euros de hoy", `${vs3(12, D.camarero.map((v) => miles(v) + "&nbsp;€"), ["en 1986", "en 2006", "en 2026"], 52)}
        <div class="nota">Sueldo y cotizaciones de la empresa, con las normas de cada año</div>`, { fuente: F_CAM, icono: bandera(44) }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("bar", null, t, 0);
        const tt = [c["c12-salario"], c["c12-salario"] + 0.35, c["c12-48"] - 0.1];
        for (let i = 0; i < 3; i++) {
          const nb = Math.round(D.camarero[i] / 1500);
          for (let k = 0; k < nb; k++) {
            const t0 = tt[i] + k * 0.04, kk = (t - t0) / 0.22;
            if (kk < 0) { ver(`s12-b${i}-${k}`, false); continue; }
            ver(`s12-b${i}-${k}`, true);
            attr(`s12-b${i}-${k}`, "transform", `translate(0 ${(-k * 18 - 110 * (1 - fuera(kk))).toFixed(1)}) scale(.66)`);
          }
          css(`s12-v${i}`, "opacity", clamp((t - tt[i] - nb * 0.04) / 0.3));
          sube(`c12-${"abc"[i]}`, t, tt[i]);
        }
        persona("s12-v", t, { x: 120, y: 1440, s: 0.8, mira: 1, vivo: true, charla: e, boca: habla(t, e), brazo: [[0, "abajo"], [c["c12-salario"], "senala"], [c["c12-48"], "arriba"]], fase: 1 });
        persona("s12-n", t, { x: 960, y: 1440, s: 0.8, mira: -1, vivo: true, boca: [[0, "seria"], [c["c12-48"] + 0.2, "o"]], ojos: [[0, "normal"], [c["c12-48"] + 0.2, "grandes"]], brazo: [[0, "sujeta"], [c["c12-inflacion"], "piensa"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c12-48"]]); } },

    // 13 · La veterana (bar): «Y el IVA de la caña, del 6 al 10 %.»
    { n: 13, set: "vacio",
      svg: `${panel(240, 790, 600, 450)}${D.iva.map((v, i) => `<g transform="translate(${380 + i * 160} 1150)">
          <g transform="translate(-24 0)">${cana(`s13-c${i}`, 1.3)}</g>
          <g id="s13-m${i}">${Array.from({ length: v }, (_, k) => `<g id="s13-m${i}-${k}" transform="translate(44 ${-k * 11 - 12}) scale(1 .5)">${monedaEuro(`s13-me${i}-${k}`, 20)}</g>`).join("")}</g>
          <g id="s13-v${i}">${rot(0, -190, `IVA ${v} %`, 30, i === 2 ? TINTA_SELLO : C.gris)}</g>${rot(0, 56, ["1986", "2006", "HOY"][i], 28, C.gris)}</g>`).join("")}
        ${rot(540, 1226, "IVA DE LO QUE SE TOMA EN UN BAR", 19, C.gris)}${dos("s13", CANA, LIBRETA)}`,
      tarjeta: tarjeta(13, "IVA de lo que se toma en un bar", `${vs3(13, D.iva.map((v) => v + "&nbsp;%"), ["en 1986", "en 2006", "en 2026"], 80)}`, { fuente: F_IVA, icono: bandera(44) }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("bar", null, t, 0);
        const tt = [c["c13-6"], c["c13-6"] + 0.4, c["c13-10"]];
        for (let i = 0; i < 3; i++) {
          for (let k = 0; k < D.iva[i]; k++) { const t0 = tt[i] + k * 0.05; css(`s13-m${i}-${k}`, "opacity", clamp((t - t0) / 0.12)); }
          css(`s13-v${i}`, "opacity", clamp((t - tt[i] - D.iva[i] * 0.05) / 0.25));
          sube(`c13-${"abc"[i]}`, t, tt[i]);
        }
        persona("s13-v", t, { x: 130, y: 1440, s: 0.8, mira: 1, vivo: true, charla: e, boca: habla(t, e), brazo: [[0, "sujeta"], [c["c13-iva"], "arriba"], [c["c13-10"] + 0.3, "sujeta"]], fase: 1 });
        persona("s13-n", t, { x: 950, y: 1440, s: 0.8, mira: -1, vivo: true, boca: [[0, "seria"], [c["c13-10"] + 0.2, "o"]], brazo: [[0, "sujeta"], [c["c13-10"] + 0.3, "hombros"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c13-10"]]); } },

    // 14 · La veterana (bar), junto al montón: «Más papeles, más impuestos y más coste: hoy es más difícil que en 1986 y que en 2006.»
    { n: 14, set: "vacio",
      svg: `<g transform="translate(560 1300)">${monton("s14-m", 16, 30)}</g>
        ${[["PAPELES", "#5F7F62"], ["IMPUESTOS", TINTA_SELLO], ["COSTE", "#B8863A"]].map(([et, col], i) => `<g id="s14-e${i}"><rect x="-120" y="-34" width="240" height="68" rx="34" fill="${col}"/>${rot(0, 12, et, 30, "#FFFDF8")}</g>`).join("")}
        ${dos("s14", "", LIBRETA)}`,
      tarjeta: tarjeta(14, "La hostelera", `<div class="tit">Hoy, <mark id="m14">más difícil</mark> que en 1986 y que en 2006</div>`, { tono: "pasado" }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("bar", null, t, 0);
        marca("m14", t, c["c14-dificil"]);
        pop("s14-e0", t, c["c14-papeles"], 560, 860, { s: 1, r: -4 }); pop("s14-e1", t, c["c14-impuestos"], 560, 960, { s: 1, r: 3 }); pop("s14-e2", t, c["c14-coste"], 560, 1060, { s: 1, r: -2 });
        const tb = t - c["c14-dificil"];
        attr("s14-m", "transform", `rotate(${(tb > 0 && tb < 1.2 ? 1.2 * Math.sin(tb * 9) * (1 - tb / 1.2) : 0).toFixed(2)} 0 -240)`);
        persona("s14-v", t, { x: 230, y: 1440, s: 0.8, mira: 1, vivo: true, charla: e, boca: habla(t, e, "seria"), brazo: [[0, "abajo"], [c["c14-papeles"] - 0.2, "senala"], [c["c14-dificil"], "arriba"]], incl: [[0, 0], [c["c14-dificil"], 5]], fase: 1 });
        persona("s14-n", t, { x: 930, y: 1440, s: 0.8, mira: -1, vivo: true, boca: [[0, "seria"], [c["c14-dificil"] + 0.3, "o"]], ojos: [[0, "normal"], [c["c14-dificil"] + 0.3, "grandes"]], brazo: [[0, "sujeta"], [c["c14-dificil"] + 0.3, "piensa"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c14-dificil"]]); } },

    // 15 · El nuevo, a cámara (calle): «¿Merece la pena montar un negocio hoy en España? ¿Tú qué harías?»
    { n: 15, set: "vacio",
      svg: `${boton("s15-b1", "SÍ", "#5F7F62", 200)}${boton("s15-b2", "NO", "#B8863A", 200)}${bocadillo("s15-boc")}${dos("s15", "", LLAVES)}`,
      tarjeta: tarjeta(15, "Te toca", `<div class="tit" style="font-size:60px">¿Merece la <mark id="m15">pena</mark> montar un negocio hoy en España?</div><div class="sub" id="c15-sub">¿Tú qué harías? Te leo en los comentarios.</div>`),
      fn: function (t, e) {
        const c = e.c;
        ambiente("fachada", "bar", t, e.t0);
        pop("s15-b1", t, c["c15-pena"], 370, 900, { s: 0.9 }); pop("s15-b2", t, c["c15-pena"] + 0.25, 710, 900, { s: 0.9 });
        if (pop("s15-boc", t, c["c15-tu"], 540, 1110, { s: 0.7 }) >= 0) for (let i = 0; i < 3; i++) attr("s15-boc-p" + i, "cy", (-6 - 16 * Math.max(0, Math.sin((t - c["c15-tu"]) * 8 - i * 0.9))).toFixed(1));
        marca("m15", t, c["c15-pena"]); sube("c15-sub", t, c["c15-tu"] - 0.2);
        persona("s15-v", t, { x: 260, y: 1440, s: 0.8, mira: [[0, 1], [c["c15-tu"], 0]], vivo: true, boca: "sonrisa", brazo: [[0, "abajo"], [c["c15-espana"], "hombros"]], fase: 1 });
        persona("s15-n", t, { x: 840, y: 1440, s: 0.8, mira: [[0, -1], [c["c15-espana"], 0]], vivo: true, charla: e, boca: habla(t, e), brazo: [[0, "sujeta"], [c["c15-pena"], "senala"], [c["c15-tu"], "hombros"]], incl: [[0, 0], [c["c15-espana"], -6], [c["c15-tu"], 0]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c15-pena"]]); } },
  ];
}
