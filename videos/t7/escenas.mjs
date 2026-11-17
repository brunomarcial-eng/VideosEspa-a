// Escenas de T7 (padre contra hijo, 5.ª parte: «¿Gastamos más en caprichos que nuestros padres?») en estilo «limpio».
// El decorado cambia con la conversación, como en un sueño: cocina → tienda de ropa → peluquería → gimnasio →
// tienda de discos → cine → concierto → calle → cocina. Más movimiento que en T6: los dos andan, se cruzan,
// cogen cosas, bailan y se apartan; cada dato tiene su dibujo (montones, botes, pilas de discos, relojes, cajas).
// Cada escena: dibujo (svg), tarjeta (HTML) y acción (fn, se ejecuta en la página con diseno/limpio_runtime.js).
/* eslint-disable no-undef */

import { C, persona, bocadillo, tarjeta } from "../../diseno/limpio.mjs";
import { bandera } from "../../diseno/barrio.mjs";
import { ambientes, figurita, pelota } from "../../diseno/sueno.mjs";
import {
  DECORADOS_T7, CAMISETA, CAMISETA_MANO, PAQUETE_MANO, PESA_MANO, VINILO_MANO, MOVIL_MANO, PALOMITAS_MANO, ENTRADA_MANO,
  papelera, etiqueta, bote, cinta, pilaDiscos, nota, recibo, relojMin, foco, publico, repartidor, paquete, bolsaComida,
} from "../../diseno/tiendas.mjs";

export const ESTILO = "limpio";
const F_EPF = "Dato oficial: INE (Encuesta de Presupuestos Familiares de 1986, 2006 y 2025)";
const F_IPC = "Dato oficial: INE (IPC). Cálculo propio: precio de la ropa entre el IPC general";
const F_DEP = "Dato oficial: Ministerio de Educación, FP y Deportes (Encuesta de Hábitos Deportivos 2024/25)";
const F_DIS = "Dato oficial: INE (Encuesta de Presupuestos Familiares) y Eurostat";
const F_CIN = "Dato oficial: Ministerio de Cultura e INE (precio medio y salario por hora). Cálculo propio";
const F_CON = "Dato oficial: Ministerio de Cultura (Encuesta de Hábitos y Prácticas Culturales)";
const F_WEB = "Dato oficial: Eurostat (compras por internet de las personas de 16 a 74 años)";

export function datos(d) {
  const m = d.musica_cine, rp = d.reparto_gasto_pct, ci = d.compras_internet_pct;
  return {
    ropa: [rp.ropa_calzado["1986"], rp.ropa_calzado["2006"], rp.ropa_calzado["2025"]],
    ropaReal06: d.ipc_variacion_real_pct["Vestido y calzado"]["2006_2025"], ropaReal16: d.ipc_variacion_real_pct["Vestido y calzado"]["2016_2025"],
    cuid: [rp.cuidado_personal_y_complementos["1986"], rp.cuidado_personal_y_complementos["2006"], rp.cuidado_personal_y_complementos["2025"]],
    dep15: d.deporte.practica_anual_pct["2015"], dep25: d.deporte.practica_anual_pct["2024_25"], dep22: d.deporte.practica_anual_pct["2022"], gim: d.deporte.abonados_gimnasio_pct,
    discos: [m.discos_gasto_hogar_eur.soportes_imagen_sonido_2006, m.discos_gasto_hogar_eur.soportes_imagen_sonido_2015, m.discos_gasto_hogar_eur.bienes_culturales_2025],
    streaming: ci.suscripcion_musica["2025"],
    cineMin: [m.cine_minutos_de_trabajo["1986"], m.cine_minutos_de_trabajo["2016"], m.cine_minutos_de_trabajo["2024"]],
    cinePts86: m.cine_gasto_medio_espectador["1986_pts"], cine24: m.cine_gasto_medio_espectador["2024_eur"],
    hora86: m.salario_hora["1986_pts"], hora24: m.salario_hora["2024_eur"],
    conc: [m.asistieron_ultimo_ano_pct.conciertos_musica_actual["2015"], m.asistieron_ultimo_ano_pct.conciertos_musica_actual["2019"], m.asistieron_ultimo_ano_pct.conciertos_musica_actual["2025"]],
    web: [ci.ultimos_3_meses["2006"], ci.ultimos_3_meses["2016"], ci.ultimos_3_meses["2025"]], comida: ci.comida_a_domicilio_restaurantes["2024"],
  };
}

export const capas = () => ambientes(DECORADOS_T7);

// ------------------------------------------------------------------ personajes (los de T3 a T6)
const PADRE = { pelo: "corto", canas: true, barba: false, bigote: true, colorPelo: "#6F6A62", colorBigote: "#5E5952", ropa: ["#8C6F5A", "#6E5444"], piel: "#EDBE96" };
const HIJO = { pelo: "corto", canas: false, barba: false, colorPelo: "#3B2A20", ropa: ["#6F8FA6", "#56738A"], piel: "#F1C9A5" };
// mp / mh: lo que lleva cada uno en la mano (con id «<p>-mp» / «<p>-mh» para poder esconderlo).
const dos = (p, mp = "", mh = "") => `${persona(p + "-padre", "hoy", { ...PADRE, mano: mp ? `<g id="${p}-mp">${mp}</g>` : undefined })}${persona(p + "-hijo", "hoy", { ...HIJO, mano: mh ? `<g id="${p}-mh">${mh}</g>` : undefined })}`;
const vs3 = (n, vals, labs, tonos = ["t-pasado", "t-pasado", "t-hoy"], tam = 72) => `<div class="vs">${vals.map((v, i) => `<div class="col"><div class="v ${tonos[i]}" id="c${n}-${"abc"[i]}" style="font-size:${tam}px">${v}</div><div class="n">${labs[i]}</div></div>`).join("")}</div>`;
const panel = (x, y, w, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="26" fill="#FFFDF8" opacity=".95"/>`;
const rot = (x, y, t, tam, color, id = "") => `<text ${id ? `id="${id}"` : ""} x="${x}" y="${y}" text-anchor="middle" font-family="Cap" font-weight="800" font-size="${tam}" fill="${color}">${t}</text>`;
const burbuja = (id, dentro) => `<g id="${id}"><circle r="70" fill="#FFFDF8" stroke="#E3D6BF" stroke-width="5"/>${dentro}</g>`;
const boton2 = (id, et, color, w) => `<g id="${id}"><rect x="${-w / 2}" y="-48" width="${w}" height="96" rx="48" fill="${color}"/><rect x="${-w / 2}" y="-48" width="${w}" height="96" rx="48" fill="none" stroke="#FFFFFF" stroke-width="6" opacity=".6"/>
  ${rot(0, 16, et, 42, "#FFFDF8", "")}</g>`;

export function escenas(D) {
  const es = (v, d = 1) => v.toFixed(d).replace(".", ",");
  const r = (v) => Math.round(v);
  // Montones de ropa (barras con una camiseta encima): alto proporcional a la parte del gasto.
  const montones = (p) => D.ropa.map((v, i) => {
    const x = 400 + i * 140, h = 230 * v / D.ropa[0];
    return `<g id="${p}-m${i}"><rect x="${x - 50}" y="${1190 - h}" width="100" height="${h}" rx="12" fill="${["#C8902E", "#D9A75A", "#1F5F8B"][i]}"/>
      <g transform="translate(${x} ${1190 - h - 40})">${CAMISETA(["#E9C4A6", "#E9C4A6", "#9ED0E6"][i], 0.62)}</g>
      ${rot(x, 1190 - h - 92, r(v), 50, i === 2 ? C.azul : "#8A6316")}</g>${rot(x, 1234, ["1986", "2006", "HOY"][i], 30, C.gris)}
      <rect x="${x - 50}" y="1186" width="100" height="6" rx="3" fill="#E3D6BF"/>`;
  }).join("");
  const botes = (p) => D.cuid.map((v, i) => `<g transform="translate(${400 + i * 140} 1190)"><g id="${p}-b${i}">${bote(p + "-bb" + i, ["#F2B3AC", "#E9C4A6", "#9ED0E6"][i])}</g>
      ${rot(0, 44, ["1986", "2006", "HOY"][i], 30, C.gris)}<g id="${p}-v${i}">${rot(0, -10, es(v), 46, i === 2 ? C.azul : "#8A6316")}</g></g>`).join("");
  const pilas = (p) => D.discos.map((v, i) => `<g transform="translate(${425 + i * 135} 1200)"><g id="${p}-p${i}">${pilaDiscos(p + "-pp" + i, ["#9B5A5A", "#C98F6B", "#5D7A8C"][i])}</g>
      ${rot(0, 40, ["2006", "2015", "HOY"][i], 30, C.gris)}<g id="${p}-v${i}">${rot(0, 0, r(v) + " €", 44, i === 2 ? C.azul : "#8A6316")}</g></g>`).join("");
  const relojes = (p) => D.cineMin.map((v, i) => `<g transform="translate(${330 + i * 210} 847) scale(.56)">${relojMin(p + "-r" + i, i === 2 ? C.azul : C.ocre)}
      ${rot(0, 150, ["1986", "2016", "2024"][i], 38, C.gris)}<g id="${p}-v${i}">${rot(0, 202, r(v) + " min", 46, i === 2 ? C.azul : "#8A6316")}</g></g>`).join("");
  const diez = (p, y) => Array.from({ length: 10 }, (_, i) => figurita(`${p}-f${i}`, 370 + i * 38, y, 1.25)).join("");
  return [
    // 1 · Padre (cocina): «¡Otro paquete! Ropa, cremas… ¡Yo con un chándal tenía para diez años!»
    { n: 1, set: "vacio",
      svg: `${burbuja("s1-i0", `<g transform="translate(0 6)">${CAMISETA("#E9C4A6", 0.8)}</g>`)}${burbuja("s1-i1", `<g transform="translate(0 50) scale(.55)">${bote("s1-ib", "#F2B3AC")}</g>`)}
        ${burbuja("s1-i2", `<g transform="scale(1.3)">${PESA_MANO}</g>`)}${dos("s1", "", PAQUETE_MANO)}`,
      tarjeta: tarjeta(1, "Padre contra hijo · Quinta parte", `<div class="tit" style="font-size:66px">¿Gastamos más en <mark id="m1">caprichos</mark> que nuestros padres?</div>`, { icono: bandera(44) }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("cocina", null, t, 0);
        // El hijo entra con el paquete; el padre va hacia él y enumera con los dedos.
        const h = ruta(t, [[0.2, 1180], [1.3, 860]]);
        const p = ruta(t, [[c["c1-paquete"], 200], [c["c1-paquete"] + 0.9, 360]]);
        pop("s1-i0", t, c["c1-ropa"], 400, 800, { s: 0.9 }); pop("s1-i1", t, c["c1-cremas"], 560, 760, { s: 0.9 }); pop("s1-i2", t, c["c1-cremas"] + 0.45, 720, 800, { s: 0.9 });
        marca("m1", t, c["c1-chandal"]);
        const bote = t > c["c1-chandal"] ? Math.abs(Math.sin((t - c["c1-chandal"]) * 8)) * 18 * Math.exp(-(t - c["c1-chandal"]) * 1.4) : 0;
        persona("s1-padre", t, { x: p.x, y: 1440, s: 0.78, anda: p.anda, sube: bote, mira: 1, boca: habla(t, e, "seria"),
          brazo: [[0, "abajo"], [c["c1-paquete"] - 0.1, "senala"], [c["c1-ropa"], "empuja"], [c["c1-cremas"], "senala"], [c["c1-chandal"] - 0.1, "arriba"]],
          ojos: [[0, "normal"], [c["c1-paquete"], "grandes"]], incl: [[0, 0], [c["c1-chandal"], -6]], fase: 1 });
        persona("s1-hijo", t, { x: h.x, y: 1440, s: 0.78, anda: h.anda, mira: -1, boca: [[0, "sonrisa"], [c["c1-chandal"] + 0.4, "seria"]], brazo: "sujeta", espejo: true, fase: 2 });
      },
      cam: function (t, e) { return { z: 1, fx: 540 + 40 * Math.sin(t * 0.6) }; } },

    // 2 · Hijo (tienda de ropa): «La ropa pesa cada vez menos: de cada 100 euros, 11 en 1986 y hoy, 4.»
    { n: 2, set: "vacio",
      svg: `${panel(320, 800, 440, 470)}${montones("s2")}${dos("s2", "", PAQUETE_MANO)}`,
      tarjeta: tarjeta(2, "Ropa y calzado, de cada 100 € que gasta un hogar", `${vs3(2, D.ropa.map(r), ["en 1986", "en 2006", "hoy (2025)"])}
        <div class="nota">De todo lo que gasta un hogar. La clasificación ha cambiado desde 1986: comparación aproximada</div>`, { fuente: F_EPF, icono: bandera(44) }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("ropa", "cocina", t, e.t0);
        ver("s2-mh", t < e.t0 + 0.5);
        // Los tres montones salen uno detrás de otro; el de hoy, con un «pinza» de sorpresa.
        const tt = [c["c2-1986"], c["c2-1986"] + 0.55, c["c2-4"]];
        for (let i = 0; i < 3; i++) {
          const k = (t - tt[i]) / 0.45;
          if (k < 0) ver("s2-m" + i, false);
          else { ver("s2-m" + i, true); T("s2-m" + i, 0, 1190 * (1 - rebote(k)), { sy: rebote(k), s: 1 }); }
        }
        sube("c2-a", t, c["c2-11"]); sube("c2-b", t, c["c2-hoy"] - 0.3); sube("c2-c", t, c["c2-4"]);
        // El padre se pasea por los percheros; el hijo se acerca al gráfico.
        const p = ruta(t, [[e.t0, 360], [e.t0 + 1.2, 180], [c["c2-4"], 180], [c["c2-4"] + 0.6, 230]]);
        const h = ruta(t, [[e.t0 + 0.2, 860], [e.t0 + 1.0, 900]]);
        persona("s2-padre", t, { x: p.x, y: 1440, s: 0.78, anda: p.anda, espejo: p.dir < 0, mira: p.dir < 0 ? 1 : 1, boca: [[0, "seria"], [c["c2-4"] + 0.3, "o"]],
          brazo: [[0, "abajo"], [e.t0 + 1.2, "piensa"], [c["c2-4"], "abajo"]], ojos: [[0, "normal"], [c["c2-4"] + 0.3, "grandes"]], fase: 1 });
        persona("s2-hijo", t, { x: h.x, y: 1440, s: 0.78, anda: h.anda, mira: -1, boca: habla(t, e), brazo: [[0, "abajo"], [c["c2-11"] - 0.2, "senala"], [c["c2-4"], "empuja"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camSueno(t, e.t0); } },

    // 3 · Padre (tienda de ropa): «¡Porque es de usar y tirar!»
    { n: 3, set: "vacio",
      svg: `<g transform="translate(560 1440)">${papelera("s3-pap")}</g><g id="s3-cam">${CAMISETA("#F2B3AC", 0.9)}</g>${dos("s3", CAMISETA_MANO)}`,
      tarjeta: tarjeta(3, "Padre", `<div class="tit">«¡Es de <mark id="m3">usar y tirar</mark>!»</div>`, { tono: "pasado" }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("ropa", null, t, 0);
        const p = ruta(t, [[e.t0, 230], [e.t0 + 0.7, 330]]);
        // Coge una camiseta, la estira y la tira a la papelera.
        const tira = c["c3-tirar"];
        ver("s3-mp", t < tira);
        salto("s3-cam", t, tira, p.x + 70, 1180, 560, 1330, { alto: 230, s: 0.9, r: 260, d: 0.45 });
        if (t > tira + 0.45) ver("s3-cam", false);
        const sac = t > tira + 0.45 && t < tira + 0.75 ? Math.sin((t - tira - 0.45) * 30) * 4 : 0;
        T("s3-pap", 0, 0, { r: sac });
        marca("m3", t, tira - 0.3);
        persona("s3-padre", t, { x: p.x, y: 1440, s: 0.78, anda: p.anda, mira: 1, boca: habla(t, e, "seria"), incl: [[0, -4], [tira, 4]],
          brazo: [[0, "sujeta"], [tira - 0.45, "arriba"], [tira - 0.05, "empuja"], [tira + 0.5, "hombros"]], fase: 1 });
        persona("s3-hijo", t, { x: 900, y: 1440, s: 0.78, mira: -1, boca: [[0, "sonrisa"], [tira + 0.3, "seria"]], incl: [[0, 0], [tira + 0.3, 6]], ojos: [[0, "normal"], [tira + 0.1, "grandes"]], espejo: true, fase: 2 });
      } },

    // 4 · Hijo (tienda de ropa): «Puede. Pero desde 2006 es un 22 % más barata, quitando la inflación.»
    { n: 4, set: "vacio",
      svg: `${panel(320, 820, 440, 450)}
        <rect x="380" y="930" width="130" height="260" rx="12" fill="#D9A75A"/><rect id="s4-b" x="570" y="930" width="130" height="260" rx="12" fill="#1F5F8B"/>
        ${rot(445, 1234, "2006", 30, C.gris)}${rot(635, 1234, "2025", 30, C.gris)}
        <g id="s4-et">${etiqueta("s4-etq", `−${r(-D.ropaReal06)} %`)}</g>${dos("s4")}`,
      tarjeta: tarjeta(4, "Ropa y calzado: precio sin inflación", `<div class="fila"><div class="num t-hoy" id="c4-a">−${r(-D.ropaReal06)}&nbsp;%</div><div class="uni">más barata<small>de 2006 a 2025</small></div></div>
        <div class="nota">Desde 2016: −${r(-D.ropaReal16)} %</div>`, { fuente: F_IPC, icono: bandera(44) }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("ropa", null, t, 0);
        // La barra de hoy baja como un ascensor y la etiqueta baja con ella.
        const k = suave((t - c["c4-22"]) / 0.9), alto = 260 * (1 - (-D.ropaReal06 / 100) * k);
        attr("s4-b", "y", (1190 - alto).toFixed(1)); attr("s4-b", "height", alto.toFixed(1));
        if (t < c["c4-2006"]) ver("s4-et", false); else T("s4-et", 635, 1190 - alto - 110 + 12 * Math.sin((t - c["c4-2006"]) * 5) * Math.exp(-(t - c["c4-2006"]) * 2), { s: 0.62 + 0.0 * k, r: 3 * Math.sin(t * 3) });
        sube("c4-a", t, c["c4-22"]);
        const h = ruta(t, [[e.b + 0.3, 930], [e.b + 1.1, 870]]);
        persona("s4-padre", t, { x: 200, y: 1440, s: 0.78, mira: 1, boca: [[0, "seria"], [c["c4-22"] + 0.4, "o"]], ojos: [[0, "normal"], [c["c4-22"] + 0.4, "grandes"]], brazo: [[0, "hombros"], [c["c4-22"] + 0.2, "abajo"]], fase: 1 });
        persona("s4-hijo", t, { x: h.x, y: 1440, s: 0.78, anda: h.anda, mira: -1, boca: habla(t, e), brazo: [[0, "hombros"], [c["c4-2006"], "senala"], [c["c4-inflacion"], "empuja"]], espejo: true, fase: 2 });
      } },

    // 5 · Padre (peluquería): «¿Y las cremas y la peluquería, qué?»
    { n: 5, set: "vacio",
      svg: `<g id="s5-aire">${[0, 1, 2, 3].map((i) => `<path id="s5-a${i}" d="M0 0 Q30 -14 60 0 T120 0" fill="none" stroke="#9ED0E6" stroke-width="8" stroke-linecap="round"/>`).join("")}</g>${dos("s5", `<g transform="translate(0 30) scale(.5)">${bote("s5-bt", "#F2B3AC")}</g>`)}`,
      tarjeta: tarjeta(5, "Padre", `<div class="tit">«¿Y las cremas y la <mark id="m5">peluquería</mark>?»</div>`, { tono: "pasado" }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("peluqueria", "ropa", t, e.t0);
        // El padre cruza hasta el espejo con un bote de crema; el secador le sopla.
        const p = ruta(t, [[e.t0 + 0.2, 330], [e.t0 + 1.2, 250]]);
        marca("m5", t, c["c5-pelu"]);
        for (let i = 0; i < 4; i++) {
          const f = ((t * 1.6 + i / 4) % 1);
          T("s5-a" + i, 120 + f * 140, 900 + i * 30, { op: (t > c["c5-pelu"] ? 0.8 : 0) * (1 - f) });
        }
        persona("s5-padre", t, { x: p.x, y: 1440, s: 0.78, anda: p.anda, espejo: p.anda, mira: 1, boca: habla(t, e, "seria"), brazo: [[0, "sujeta"], [c["c5-pelu"], "arriba"]], incl: [[0, 0], [c["c5-pelu"], -8]], fase: 1 });
        persona("s5-hijo", t, { x: 880, y: 1440, s: 0.78, mira: -1, boca: "sonrisa", brazo: [[0, "abajo"], [e.b + 0.4, "hombros"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camSueno(t, e.t0); } },

    // 6 · Hijo (peluquería): «Ahí tienes razón: es el doble que en 1986.»
    { n: 6, set: "vacio",
      svg: `${panel(320, 800, 440, 470)}${botes("s6")}${dos("s6", `<g transform="translate(0 30) scale(.5)">${bote("s6-bt", "#F2B3AC")}</g>`)}`,
      tarjeta: tarjeta(6, "Peluquería, cremas y complementos, de cada 100 €", vs3(6, D.cuid.map((v) => es(v)), ["en 1986", "en 2006", "hoy (2025)"]), { fuente: F_EPF, icono: bandera(44) }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("peluqueria", null, t, 0);
        // Los botes crecen hasta su parte del gasto: el de hoy, el doble que el de 1986.
        const tt = [c["c6-razon"], c["c6-doble"], c["c6-doble"] + 0.35];
        for (let i = 0; i < 3; i++) {
          const k = (t - tt[i]) / 0.5, alto = D.cuid[i] / D.cuid[1] * 1.3;
          if (k < 0) { ver("s6-b" + i, false); ver("s6-v" + i, false); continue; }
          ver("s6-b" + i, true); ver("s6-v" + i, true);
          T("s6-b" + i, 0, 0, { sx: 1.05, sy: alto * rebote(k) });
          T("s6-v" + i, 0, -(alto * 190 + 18) * rebote(k), { op: clamp(k * 2) });
        }
        sube("c6-a", t, c["c6-razon"]); sube("c6-b", t, c["c6-doble"]); sube("c6-c", t, c["c6-1986"]);
        // El padre lo celebra: salta y baila un poco.
        const fiesta = t > c["c6-razon"] ? 1 : 0, kk = t - c["c6-razon"];
        persona("s6-padre", t, { x: 190, y: 1440, s: 0.78, sube: fiesta * Math.abs(Math.sin(kk * 7)) * 22 * Math.exp(-kk * 0.6), rot: fiesta * 6 * Math.sin(kk * 7) * Math.exp(-kk * 0.6),
          mira: 1, boca: [[0, "seria"], [c["c6-razon"], "grande"], [c["c6-razon"] + 1.2, "sonrisa"]], ojos: [[0, "normal"], [c["c6-razon"], "felices"]], brazo: [[0, "sujeta"], [c["c6-razon"], "arriba"]], fase: 1 });
        persona("s6-hijo", t, { x: 880, y: 1440, s: 0.78, mira: -1, boca: habla(t, e), brazo: [[0, "hombros"], [c["c6-doble"] - 0.2, "senala"]], incl: [[0, 6]], espejo: true, fase: 2 });
      } },

    // 7 · Padre (gimnasio): «¡Y pagando por hacer deporte! Yo jugaba al frontón gratis.»
    { n: 7, set: "vacio",
      svg: `<g transform="translate(880 1440) scale(-1 1)">${cinta("s7-cinta")}</g><g id="s7-pel">${pelota("s7-pelota")}</g>${dos("s7")}`,
      tarjeta: tarjeta(7, "Padre", `<div class="tit">«¡Yo jugaba al <mark id="m7">frontón</mark> gratis!»</div>`, { tono: "pasado" }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("gimnasio", "peluqueria", t, e.t0);
        // El padre da golpes de frontón con la mano y la pelota va y vuelve contra el cristal.
        const g1 = c["c7-fronton"], g2 = c["c7-gratis"];
        let golpe = g1;
        if (t >= g2) golpe = g2;
        const k = (t - golpe) / 0.7;
        if (t < g1 - 0.7) ver("s7-pel", false);
        else if (t < g1) T("s7-pel", 340, 1050, { s: 0.6 });
        else { const ida = k < 0.5, kk = ida ? k * 2 : (k - 0.5) * 2;
          const x = ida ? 340 + 200 * kk : 540 - 200 * kk, y = ida ? 1050 - 120 * kk : 930 + 120 * kk;
          T("s7-pel", x, y - Math.sin(kk * Math.PI) * 60, { s: ida ? 0.6 - 0.2 * kk : 0.4 + 0.2 * kk, r: t * 400 }); }
        attr("s7-cinta-banda", "stroke-dashoffset", (t * 160).toFixed(1));
        marca("m7", t, g1);
        persona("s7-padre", t, { x: 260, y: 1440, s: 0.78, mira: 1, boca: habla(t, e, "sonrisa"), rot: t > g1 ? -4 * Math.exp(-(t - golpe) * 4) : 0,
          brazo: [[0, "abajo"], [e.b + 0.2, "senala"], [g1 - 0.25, "arriba"], [g1, "empuja"], [g2 - 0.25, "arriba"], [g2, "empuja"]], fase: 1 });
        // El hijo, en la cinta: anda sin moverse.
        persona("s7-hijo", t, { x: 880, y: 1410, s: 0.78, anda: true, mira: -1, boca: [[0, "sonrisa"], [g2, "o"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camSueno(t, e.t0); } },

    // 8 · Hijo (gimnasio): «Seis de cada diez hacen deporte. Y casi uno de cada tres paga gimnasio.»
    { n: 8, set: "vacio",
      svg: `${panel(330, 790, 420, 300)}${diez("s8", 990)}${[0, 1, 2].map((i) => `<g id="s8-c${i}"><rect x="-22" y="-15" width="44" height="30" rx="5" fill="#C8902E"/><rect x="-22" y="-8" width="44" height="6" fill="#8A6316"/></g>`).join("")}
        ${rot(540, 1060, "DE CADA DIEZ", 30, C.gris)}
        <g transform="translate(880 1440) scale(-1 1)">${cinta("s8-cinta")}</g>${dos("s8", PESA_MANO)}`,
      tarjeta: tarjeta(8, "Hacen deporte (en el último año)", `${vs3(8, [es(D.dep15) + "&nbsp;%", es(D.dep25) + "&nbsp;%", es(D.gim) + "&nbsp;%"], ["en 2015", "hoy", "pagan gimnasio"], ["t-pasado", "t-hoy", "t-hoy"], 66)}
        <div class="nota">En 2022: ${es(D.dep22)} %</div>`, { fuente: F_DEP, icono: bandera(44) }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("gimnasio", null, t, 0);
        attr("s8-cinta-banda", "stroke-dashoffset", (t * 160).toFixed(1));
        // De 10 figuras se encienden 6 (hacen deporte); a 3 les cae un carné de gimnasio.
        const n = Math.floor(6 * clamp((t - c["c8-seis"]) / 0.9));
        for (let i = 0; i < 10; i++) pinta("s8-f" + i, i < n ? "#7C9A7E" : "#D5D9DD");
        for (let i = 0; i < 3; i++) salto("s8-c" + i, t, c["c8-tres"] + i * 0.15, 540, 760, 370 + i * 38, 925, { alto: 80, d: 0.4 });
        sube("c8-a", t, c["c8-seis"] - 0.3); sube("c8-b", t, c["c8-seis"]); sube("c8-c", t, c["c8-gim"] - 0.4);
        // El padre levanta la pesa a ritmo; el hijo corre en la cinta mientras habla.
        trabaja("s8-padre", t, { x: 250, y: 1440, s: 0.78, a: "arriba", b: "sujeta", ritmo: 0.55, mira: 1, boca: t > c["c8-gim"] ? "o" : "seria", ojos: t > c["c8-gim"] ? "grandes" : "normal" });
        persona("s8-hijo", t, { x: 880, y: 1410, s: 0.78, anda: true, mira: -1, boca: habla(t, e), brazo: [[0, "abajo"], [c["c8-seis"], "senala"]], espejo: true, fase: 2 });
      } },

    // 9 · Padre (tienda de discos): «¡Y pagando la música cada mes! Yo me compraba mis vinilos.»
    { n: 9, set: "vacio",
      svg: `<g id="s9-rec">${recibo("s9-recibo")}</g>${dos("s9", VINILO_MANO, MOVIL_MANO)}`,
      tarjeta: tarjeta(9, "Padre", `<div class="tit">«¡Yo me compraba mis <mark id="m9">vinilos</mark>!»</div>`, { tono: "pasado" }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("discos", "gimnasio", t, e.t0);
        // El padre pasa por los cajones de discos buscando y saca uno, orgulloso.
        const p = ruta(t, [[e.t0 + 0.1, 120], [c["c9-vinilos"] - 0.4, 330]]);
        ver("s9-mp", t > c["c9-vinilos"] - 0.35);
        pop("s9-rec", t, c["c9-mes"], 760, 850, { s: 0.8, r: -6 });
        marca("m9", t, c["c9-vinilos"]);
        const busca = p.anda ? (Math.floor(t * 4) % 2 ? "empuja" : "senala") : null;
        persona("s9-padre", t, { x: p.x, y: 1440, s: 0.78, anda: p.anda, mira: 1, boca: habla(t, e, "sonrisa"),
          brazo: t < c["c9-vinilos"] - 0.4 ? (busca || "abajo") : [[0, "abajo"], [c["c9-vinilos"] - 0.4, "arriba"]],
          ojos: [[0, "normal"], [c["c9-vinilos"], "felices"]], incl: [[0, 0], [c["c9-vinilos"], -6]], fase: 1 });
        persona("s9-hijo", t, { x: 880, y: 1440, s: 0.78, mira: -1, boca: "sonrisa", brazo: [[0, "sujeta"], [c["c9-mes"], "empuja"]], incl: [[0, 0], [c["c9-mes"], 5]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camSueno(t, e.t0); } },

    // 10 · Hijo (tienda de discos): «En 2006, cada hogar gastaba 72 euros al año en discos y DVD. Hoy, 10. Y casi uno de cada cinco paga por escuchar música.»
    { n: 10, set: "vacio",
      svg: `${panel(345, 830, 430, 450)}${pilas("s10")}${[0, 1, 2, 3, 4].map((i) => `<g id="s10-n${i}">${nota("s10-nn" + i, ["#1F5F8B", "#7C9A7E", "#C8902E", "#9B5A5A", "#5D7A8C"][i])}</g>`).join("")}
        ${dos("s10", VINILO_MANO, MOVIL_MANO)}`,
      tarjeta: tarjeta(10, "Discos y DVD: euros al año por hogar", `${vs3(10, D.discos.map((v) => r(v) + "&nbsp;€"), ["en 2006", "en 2015", "hoy (2025)"])}
        <div class="nota">Desde 2016 incluye también descargas e instrumentos. Pagan música por internet: ${r(D.streaming)} % (2025)</div>`, { fuente: F_DIS, icono: bandera(44) }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("discos", null, t, 0);
        // Pilas de discos: alto proporcional al gasto (2006, 2015 y hoy).
        const tt = [c["c10-72"], c["c10-72"] + 0.7, c["c10-10"]];
        for (let i = 0; i < 3; i++) {
          const k = (t - tt[i]) / 0.5, alto = 0.85 * D.discos[i] / D.discos[0];
          if (k < 0) { ver("s10-p" + i, false); ver("s10-v" + i, false); continue; }
          ver("s10-p" + i, true); ver("s10-v" + i, true);
          T("s10-p" + i, 0, 0, { sx: 1, sy: alto * rebote(k) });
          T("s10-v" + i, 0, -(alto * 290 + 30) * rebote(k), { op: clamp(k * 2) });
        }
        sube("c10-a", t, c["c10-72"]); sube("c10-b", t, c["c10-72"] + 0.7); sube("c10-c", t, c["c10-10"]);
        // Del móvil del hijo salen notas: la música, ahora, por suscripción.
        for (let i = 0; i < 5; i++) {
          const k0 = c["c10-musica"] - 0.6 + i * 0.22, f = ((t - k0) * 0.55) % 1;
          if (t < k0) { ver("s10-n" + i, false); continue; }
          T("s10-n" + i, 800 - f * 200 + Math.sin((t + i) * 4) * 20, 1000 - f * 260, { s: 0.7 + 0.3 * f, op: (1 - f).toFixed(2) });
        }
        persona("s10-padre", t, { x: 190, y: 1440, s: 0.78, mira: 1, boca: [[0, "sonrisa"], [c["c10-10"], "o"]], ojos: [[0, "normal"], [c["c10-10"], "grandes"]],
          brazo: [[0, "arriba"], [c["c10-72"], "sujeta"], [c["c10-10"] + 0.3, "abajo"]], incl: [[0, 0], [c["c10-10"], -7]], fase: 1 });
        persona("s10-hijo", t, { x: 880, y: 1440, s: 0.78, mira: -1, boca: habla(t, e), brazo: [[0, "sujeta"], [c["c10-72"] - 0.2, "senala"], [c["c10-musica"] - 0.7, "arriba"]], espejo: true, fase: 2 });
      } },

    // 11 · Padre (cine): «¿Y el cine? ¡Ahora es un lujo!»
    { n: 11, set: "vacio",
      svg: `<g id="s11-peli"><rect x="170" y="560" width="740" height="420" fill="#BFE0F0"/><circle id="s11-sol" cx="300" cy="700" r="50" fill="#FFE08A"/>
        <path d="M170 980 L330 800 L450 900 L600 720 L780 900 L910 820 V980 Z" fill="#8FAE92"/><path d="M170 980 L300 880 L420 940 L560 860 L700 960 L910 900 V980 Z" fill="#7C9A7E"/>
        <g id="s11-pajaro"><path d="M-30 0 Q-15 -16 0 0 Q15 -16 30 0" fill="none" stroke="${C.tinta}" stroke-width="6" stroke-linecap="round"/></g></g>${dos("s11", PALOMITAS_MANO, ENTRADA_MANO)}`,
      tarjeta: tarjeta(11, "Padre", `<div class="tit">«¡El cine es un <mark id="m11">lujo</mark>!»</div>`, { tono: "pasado" }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("cine", "discos", t, e.t0);
        css("s11-peli", "opacity", (0.88 + 0.08 * Math.sin(t * 23)).toFixed(2));
        T("s11-pajaro", 300 + ((t * 120) % 600), 650 + 20 * Math.sin(t * 3), { s: 1 }); attr("s11-sol", "cy", (700 - 10 * Math.sin(t * 0.8)).toFixed(1));
        // Entran a la sala: el padre con palomitas, el hijo con la entrada.
        const p = ruta(t, [[e.t0 + 0.1, 60], [e.t0 + 1.0, 250]]);
        const h = ruta(t, [[e.t0 + 0.2, 1040], [e.t0 + 1.1, 870]]);
        marca("m11", t, c["c11-lujo"]);
        persona("s11-padre", t, { x: p.x, y: 1440, s: 0.78, anda: p.anda, mira: 1, boca: habla(t, e, "seria"), brazo: [[0, "sujeta"], [c["c11-lujo"] - 0.1, "senala"]], incl: [[0, 0], [c["c11-lujo"], -5]], fase: 1 });
        persona("s11-hijo", t, { x: h.x, y: 1440, s: 0.78, anda: h.anda, mira: -1, boca: "sonrisa", brazo: [[0, "abajo"], [c["c11-lujo"], "sujeta"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camSueno(t, e.t0); } },

    // 12 · Hijo (cine): «Cuesta casi lo mismo: 23 minutos de trabajo en 1986. Hoy, 21.»
    { n: 12, set: "vacio",
      svg: `${relojes("s12")}${dos("s12", PALOMITAS_MANO, ENTRADA_MANO)}`,
      tarjeta: tarjeta(12, "Entrada de cine, en minutos de trabajo", `${vs3(12, D.cineMin.map((v) => r(v) + "&nbsp;min"), ["en 1986", "en 2016", "en 2024"])}
        <div class="nota">Precio medio pagado: ${r(D.cinePts86)} pesetas en 1986 y ${es(D.cine24)} € en 2024. Salario medio por hora: ${D.hora86} pesetas y ${es(D.hora24, 2)} €</div>`, { fuente: F_CIN, icono: bandera(44) }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("cine", null, t, 0);
        // En la pantalla, tres relojes: cada uno se llena hasta los minutos de trabajo que costaba la entrada.
        const tt = [c["c12-23"], c["c12-1986"] + 0.35, c["c12-21"]];
        for (let i = 0; i < 3; i++) {
          const k = suave((t - tt[i]) / 0.8), a = 2 * Math.PI * D.cineMin[i] / 60 * k, R = 96;
          const x = R * Math.sin(a), y = -R * Math.cos(a);
          attr("s12-r" + i + "-w", "d", k <= 0 ? "M0 0 Z" : `M0 0 L0 ${-R} A${R} ${R} 0 ${a > Math.PI ? 1 : 0} 1 ${x.toFixed(1)} ${y.toFixed(1)} Z`);
          attr("s12-r" + i + "-a", "x2", (84 * Math.sin(a)).toFixed(1)); attr("s12-r" + i + "-a", "y2", (-84 * Math.cos(a)).toFixed(1));
          css("s12-v" + i, "opacity", clamp((t - tt[i] - 0.6) / 0.3));
        }
        sube("c12-a", t, c["c12-23"]); sube("c12-b", t, c["c12-1986"] + 0.35); sube("c12-c", t, c["c12-21"]);
        persona("s12-padre", t, { x: 250, y: 1440, s: 0.78, mira: 1, boca: [[0, "seria"], [c["c12-21"] + 0.3, "o"]], ojos: [[0, "normal"], [c["c12-21"] + 0.3, "grandes"]],
          brazo: [[0, "sujeta"], [c["c12-21"] + 0.6, "hombros"]], incl: [[0, 0], [c["c12-21"] + 0.6, 6]], fase: 1 });
        persona("s12-hijo", t, { x: 870, y: 1440, s: 0.78, mira: -1, boca: habla(t, e), brazo: [[0, "sujeta"], [c["c12-23"] - 0.2, "senala"]], espejo: true, fase: 2 });
      } },

    // 13 · Hijo (concierto): «Y a conciertos va uno de cada tres, más que hace diez años.»
    { n: 13, set: "vacio",
      svg: `${foco("s13-f0", "#FFE08A")}${foco("s13-f1", "#9ED0E6")}${foco("s13-f2", "#F2B3AC")}
        <g transform="translate(0 1280) scale(1 .8)">${publico("s13-pub", 9)}</g>${dos("s13")}`,
      tarjeta: tarjeta(13, "Fueron a un concierto (pop, rock…) en un año", vs3(13, D.conc.map((v) => es(v) + "&nbsp;%"), ["en 2015", "en 2019", "en 2025"], ["t-pasado", "t-pasado", "t-hoy"], 66),
        { fuente: F_CON, icono: bandera(44) }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("concierto", "cine", t, e.t0);
        // Focos que barren el escenario; el público salta; uno de cada tres se ilumina.
        for (let i = 0; i < 3; i++) T("s13-f" + i, 200 + i * 340, 440, { r: 22 * Math.sin(t * 1.3 + i * 2.1) });
        for (let i = 0; i < 9; i++) {
          const salta = Math.abs(Math.sin(t * 6.5 + i * 1.3)) * 26;
          attr("s13-pub-" + i, "transform", `translate(${(-120 + i * 165).toFixed(1)} ${(-salta).toFixed(1)})`);
          const g = document.querySelector(`#s13-pub-${i} > g`);
          if (g) g.setAttribute("fill", t > c["c13-tres"] && i % 3 === 1 ? "#8C7A4E" : ["#3A3F4C", "#454B5E", "#2F3445"][i % 3]);
        }
        sube("c13-a", t, c["c13-conc"]); sube("c13-b", t, c["c13-tres"]); sube("c13-c", t, c["c13-diez"]);
        // Los dos bailan: el cuerpo se balancea, saltan y levantan los brazos.
        const b = (f) => ({ rot: 7 * Math.sin(t * 6.5 + f), sube: Math.abs(Math.sin(t * 6.5 + f)) * 16 });
        const bp = b(0), bh = b(1.6), act = t > c["c13-conc"];
        persona("s13-padre", t, { x: 250, y: 1440, s: 0.78, rot: act ? bp.rot : 0, sube: act ? bp.sube : 0, mira: 1, boca: [[0, "sonrisa"], [c["c13-conc"], "grande"]], ojos: [[0, "normal"], [c["c13-conc"], "felices"]],
          brazo: act ? (Math.floor(t * 2.2) % 2 ? "arriba" : "saluda") : "abajo", fase: 1 });
        persona("s13-hijo", t, { x: 870, y: 1440, s: 0.78, rot: act ? bh.rot * 0.7 : 0, sube: act ? bh.sube * 0.7 : 0, mira: -1, boca: habla(t, e), brazo: [[0, "abajo"], [c["c13-conc"], "arriba"], [c["c13-tres"], "senala"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return { z: camSueno(t, e.t0).z, dx: 6 * Math.sin(t * 6.5) }; } },

    // 14 · Padre (calle): «¡Y todo a domicilio!»
    { n: 14, set: "vacio",
      svg: `<g id="s14-bici">${repartidor("s14-rep")}</g>${dos("s14")}`,
      tarjeta: tarjeta(14, "Padre", `<div class="tit">«¡Y todo a <mark id="m14">domicilio</mark>!»</div>`, { tono: "pasado" }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("calle", "concierto", t, e.t0);
        // Pasa un repartidor en bici a toda prisa; el padre se aparta de un salto.
        const k = t - c["c14-bici"] + 0.4;
        if (k < 0) ver("s14-bici", false);
        else { T("s14-bici", 1400 - 1100 * k, 1460, { s: -0.72, sy: 0.72 }); for (const w of [0, 1]) attr("s14-rep-r" + w, "transform", `rotate(${(-t * 900).toFixed(0)})`); }
        const pasa = c["c14-bici"] + 0.35;
        const p = ruta(t, [[e.t0, 250], [pasa - 0.1, 250], [pasa + 0.3, 150]]);
        const brinco = t > pasa - 0.15 && t < pasa + 0.45 ? Math.sin((t - pasa + 0.15) / 0.6 * Math.PI) * 60 : 0;
        marca("m14", t, c["c14-bici"] + 0.2);
        persona("s14-padre", t, { x: p.x, y: 1440, s: 0.78, sube: brinco, rot: brinco ? -8 : 0, mira: 1, boca: habla(t, e, "o"), ojos: [[0, "normal"], [pasa - 0.2, "grandes"]], brazo: [[0, "abajo"], [pasa - 0.2, "arriba"], [pasa + 0.6, "senala"]], fase: 1 });
        persona("s14-hijo", t, { x: 880, y: 1440, s: 0.78, mira: -1, boca: [[0, "sonrisa"], [pasa, "grande"]], ojos: [[0, "normal"], [pasa + 0.2, "felices"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camSueno(t, e.t0); } },

    // 15 · Hijo (calle): «Comprar por internet: en 2006, uno de cada diez; hoy, seis. Y uno de cada cuatro pide comida a casa.»
    { n: 15, set: "vacio",
      svg: `<rect x="390" y="760" width="300" height="540" rx="14" fill="#8A6A48"/><rect x="410" y="780" width="260" height="520" rx="8" fill="#A9794F"/><circle cx="640" cy="1060" r="12" fill="#E9C46A"/>
        ${Array.from({ length: 10 }, (_, i) => `<g id="s15-k${i}">${paquete("s15-pq" + i, 0.74)}</g>`).join("")}<g id="s15-bol">${bolsaComida("s15-bolsa")}</g>
        ${rot(540, 840, "DE CADA DIEZ", 30, "#FFFDF8")}${dos("s15")}`,
      tarjeta: tarjeta(15, "Compraron por internet en tres meses", `${vs3(15, D.web.map((v) => r(v) + "&nbsp;%"), ["en 2006", "en 2016", "en 2025"])}
        <div class="nota">Piden comida de restaurantes por internet: ${r(D.comida)} % (2024). Personas de 16 a 74 años</div>`, { fuente: F_WEB, icono: bandera(44) }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("calle", null, t, 0);
        // Delante del portal se apilan cajas: 1 de 10 en 2006, 6 de 10 hoy. Luego cae la bolsa de comida.
        const sitio = (i) => [356 + (i % 5) * 92, 1296 - Math.floor(i / 5) * 68];
        const n = t < c["c15-2006"] ? 0 : t < c["c15-seis"] ? 1 : 1 + Math.floor(5 * clamp((t - c["c15-seis"]) / 0.8) + 0.999);
        for (let i = 0; i < 10; i++) {
          const [x, y] = sitio(i), t0 = i === 0 ? c["c15-2006"] : c["c15-seis"] + (i - 1) * 0.16;
          if (i >= n) { ver("s15-k" + i, false); continue; }
          salto("s15-k" + i, t, t0, x, 700, x, y, { alto: 30, d: 0.32 });
        }
        salto("s15-bol", t, c["c15-comida"], 900, 900, 540, 1160, { alto: 160, d: 0.45, s: 0.75 });
        sube("c15-a", t, c["c15-2006"]); sube("c15-b", t, c["c15-2006"] + 0.5); sube("c15-c", t, c["c15-seis"]);
        const h = ruta(t, [[e.t0 + 0.1, 880], [e.t0 + 0.9, 840], [c["c15-cuatro"], 840], [c["c15-cuatro"] + 0.6, 900]]);
        persona("s15-padre", t, { x: 170, y: 1440, s: 0.78, mira: 1, boca: [[0, "seria"], [c["c15-seis"] + 0.4, "o"]], ojos: [[0, "normal"], [c["c15-seis"] + 0.4, "grandes"]], brazo: [[0, "hombros"], [c["c15-comida"], "piensa"]], fase: 1 });
        persona("s15-hijo", t, { x: h.x, y: 1440, s: 0.78, anda: h.anda, espejo: h.dir <= 0, mira: -1, boca: habla(t, e), brazo: [[0, "abajo"], [c["c15-2006"] - 0.2, "senala"], [c["c15-comida"], "empuja"]], fase: 2 });
      } },

    // 16 · Hijo, a cámara (cocina): «¿Caprichos o la vida de hoy? ¿Tú qué opinas?»
    { n: 16, set: "vacio",
      svg: `${boton2("s16-b1", "CAPRICHOS", "#C8902E", 330)}${boton2("s16-b2", "LA VIDA DE HOY", "#1F5F8B", 400)}${bocadillo("s16-boc")}${dos("s16")}`,
      tarjeta: tarjeta(16, "Te toca", `<div class="tit" style="font-size:64px">¿<mark id="m16">Caprichos</mark> o la vida de hoy?</div><div class="sub" id="c16-sub">¿Tú qué opinas? Te leo en los comentarios.</div>`),
      fn: function (t, e) {
        const c = e.c;
        ambiente("cocina", "calle", t, e.t0);
        pop("s16-b1", t, c["c16-cap"], 300, 860, { s: 0.85 }); pop("s16-b2", t, c["c16-vida"], 770, 860, { s: 0.85 });
        if (pop("s16-boc", t, c["c16-boc"], 540, 1110, { s: 0.75 }) >= 0) for (let i = 0; i < 3; i++) attr("s16-boc-p" + i, "cy", (-6 - 16 * Math.max(0, Math.sin((t - c["c16-boc"]) * 8 - i * 0.9))).toFixed(1));
        marca("m16", t, c["c16-cap"]); sube("c16-sub", t, c["c16-boc"] - 0.2);
        // Cada uno se pone junto a su botón y, al final, los dos miran a cámara.
        const p = ruta(t, [[e.t0 + 0.2, 150], [e.t0 + 0.9, 230]]), h = ruta(t, [[e.t0 + 0.2, 900], [e.t0 + 0.9, 850]]);
        persona("s16-padre", t, { x: p.x, y: 1440, s: 0.78, anda: p.anda, mira: [[0, 1], [c["c16-boc"], 0]], boca: "sonrisa", brazo: [[0, "abajo"], [c["c16-cap"], "senala"], [c["c16-boc"], "hombros"]], fase: 1 });
        persona("s16-hijo", t, { x: h.x, y: 1440, s: 0.78, anda: h.anda, mira: [[0, -1], [c["c16-boc"], 0]], boca: habla(t, e), brazo: [[0, "abajo"], [c["c16-vida"], "senala"], [c["c16-boc"], "arriba"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camSueno(t, e.t0); } },
  ];
}
