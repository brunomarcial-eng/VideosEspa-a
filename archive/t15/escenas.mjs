// Escenas de T15 («¿Cuántas horas trabajas para la cena de Nochebuena?») en estilo «limpio».
// Bruno, 22 y 23-11-2026: la cena en casa en horas de trabajo, 2016 frente a hoy, con su lista de comidas de Navidad; tono y
// forma de T17 (aprobado): de calle, irónico, pocas cifras y grandes, cambio de escenario y un chiste que vuelve.
// v3: la abuela pasa a abuelo, la madre ya no lleva nada en la mano, el plato principal (la pierna de cordero) sustituye a
// los turrones y el mapa final lleva la subida de cada plato.
// v4 (Bruno, 23-11-2026): el mapa abre el vídeo (y es la portada), más grande; fuera los juguetes y la naranja; la cena se
// entiende: una mesa para ocho vista desde arriba, plato a plato con su tiempo de trabajo, y todo junto.
//   · «madre»: unos 45, pone la cena este año, jersey verde (voz «medica»).
//   · «abuelo»: unos 75, canas, calva, bigote blanco, gafas y rebeca marrón, «en mis tiempos…» (voz «padre»).
//   · «tendero»: unos 45, el del mercado, delantal y bigote (voz «profesora»).
// Decorados: el mercado y la mesa de diseno/navidad.mjs y el salón de T17 (diseno/carnet.mjs).
/* eslint-disable no-undef */

import { persona, tarjeta, selloOficial } from "../../diseno/limpio.mjs";
import { bandera, DELANTAL } from "../../diseno/barrio.mjs";
import { ambientes } from "../../diseno/sueno.mjs";
import { relojCocina } from "../../diseno/desayuno.mjs";
import { DECORADOS_T17 } from "../../diseno/carnet.mjs";
import { DECORADOS_T15, mostradorPescado, mostradorCarne, mapaPlatos, mesaCenital } from "../../diseno/navidad.mjs";

export const ESTILO = "limpio";
const F = "Cálculo propio · INE (Presupuestos Familiares y Estructura Salarial)";
const F_EPF = "Cálculo propio · INE (Encuesta de Presupuestos Familiares)";
const F_MAPA = "Cálculo propio · INE (Presupuestos Familiares e IPC)";

// Redondeo «del banquero», el mismo que usa el verificador (Python): 132,5 → 132, como dice el guion.
const rnd = (v) => { const f = Math.floor(v), d = v - f; return Math.abs(d - 0.5) < 1e-9 ? (f % 2 === 0 ? f : f + 1) : Math.round(v); };

export function datos(d) {
  const p = d.platos, c = d.cena;
  return { marisco: [p.marisco.minutos["2016"], p.marisco.minutos["2025"]], cordero: [p.cordero.minutos["2016"], p.cordero.minutos["2025"]],
           corderoEur: [p.cordero.eur["2016"], p.cordero.eur["2025"]], corderoSube: p.cordero.precio_sube_pct,
           cena: c.minutos, h: c.h, m: c.m, eur: c.eur, mesa: c.platos, hora: d.sueldo.neto_hora_mediana, sube: d.sueldo.mediana_sube_pct,
           mapa: Object.fromEntries(Object.entries(d.mapa_subida_precio_pct).map(([k, v]) => [k, rnd(v.sube_pct)])) };
}

export const capas = () => ambientes({ ...DECORADOS_T15, salon: DECORADOS_T17.salon });

// ------------------------------------------------------------------ personajes (inventados), con volumen
// El abuelo: rebeca con botones, coronilla calva y gafas (encima de la cara, debajo de los ojos, que siguen parpadeando).
const REBECA = `<path d="M0 -374 V-172" stroke="#5A4128" stroke-width="6"/>${[-336, -290, -244, -198].map((y) => `<circle cx="13" cy="${y}" r="7" fill="#EFE8D8"/>`).join("")}`;
const CALVA_GAFAS = `<ellipse cx="0" cy="-552" rx="56" ry="30" fill="#EBC3A0"/><ellipse cx="-16" cy="-560" rx="20" ry="9" fill="#FFFFFF" opacity=".22"/>
  <g fill="none" stroke="#4A4038" stroke-width="5"><circle cx="-34" cy="-487" r="25"/><circle cx="34" cy="-487" r="25"/><path d="M-9 -492 Q0 -499 9 -492"/><path d="M-59 -492 L-92 -500 M59 -492 L92 -500"/></g>`;
const MADRE = { pelo: "largo", canas: false, barba: false, colorPelo: "#4A2E20", ropa: ["#5E7F5A", "#4C6A49"], piel: "#F2CBA8", volumen: true };
const ABUELO = { pelo: "corto", canas: false, barba: false, bigote: true, colorPelo: "#CFCAC0", colorBigote: "#ECE8E0", ropa: ["#8A6A48", "#6E5236"],
                 piel: "#EBC3A0", piel2: "#D8AE8C", volumen: true, encima: REBECA, gorro: CALVA_GAFAS };
const TENDERO = { pelo: "corto", canas: false, barba: true, bigote: true, colorPelo: "#2B1D14", ropa: ["#FFFDF8", "#E9E2D5"], piel: "#DDAE86", piel2: "#C99A72", volumen: true, encima: DELANTAL("#3E8E8A") };
const QUIEN = { m: MADRE, a: ABUELO, t: TENDERO };
const gente = (n, quien) => quien.split("").map((k) => persona(`${n}-${k}`, "hoy", QUIEN[k])).join("");

// ------------------------------------------------------------------ piezas
const HOY = "#B3261E";
const rot = (x, y, t, tam, color, id = "", ancla = "middle") => `<text ${id ? `id="${id}"` : ""} x="${x}" y="${y}" text-anchor="${ancla}" font-family="Cap" font-weight="800" font-size="${tam}" fill="${color}">${t}</text>`;
const es = (v, d = 1) => v.toFixed(d).replace(".", ",");
const hm = (h, m) => `${h}&nbsp;h&nbsp;${String(m).padStart(2, "0")}`;
const vs = (n, vals, labs, tam = 92) => `<div class="vs">${vals.map((v, i) => `<div class="col"><div class="v ${i ? "t-hoy" : "t-pasado"}" id="c${n}-${"ab"[i]}" style="font-size:${tam}px">${v}</div><div class="n">${labs[i]}</div></div>`).join("")}</div>`;
const cita = (n, quien, html) => tarjeta(n, quien, `<div class="tit" style="font-size:64px">${html}</div>`, { tono: "hoy" });
const grande = (n, cifra, sub, nota, fuente) => tarjeta(n, sub.titulo, `<div class="tit" style="font-size:110px;color:${HOY};line-height:1" id="c${n}-a">${cifra}</div>
  <div class="sub" id="c${n}-b" style="font-size:44px">${sub.texto}</div>${nota ? `<div class="nota">${nota}</div>` : ""}`, { fuente, icono: bandera(44) });

// La báscula del puesto con la pierna de cordero encima y el precio en la pantalla (se enciende al decirlo).
const bascula = (id, precio) => `<g id="${id}"><rect x="-130" y="-26" width="260" height="46" rx="12" fill="#C9CED3"/><rect x="-118" y="-44" width="236" height="20" rx="9" fill="#E9EDF0"/>
  <g transform="translate(-6 -78) rotate(-5)"><path d="M-96 0 Q-110 -52 -36 -60 Q52 -66 82 -14 Q84 26 30 28 L-62 24 Q-92 22 -96 0 Z" fill="#C9744F"/>
    <path d="M-70 -30 Q-10 -50 50 -24" fill="none" stroke="#E9A07A" stroke-width="10" stroke-linecap="round"/><rect x="78" y="-20" width="46" height="22" rx="11" fill="#F4F1EA"/></g>
  <g transform="translate(0 46)"><rect x="-122" y="-22" width="244" height="70" rx="12" fill="#26332B"/>
    <g id="${id}-pr" opacity="0">${rot(0, 28, precio, 50, "#9BE37A")}</g></g></g>`;

export function escenas(D) {
  // El mapa grande (v4: más protagonismo): ocupa todo el ancho, con la subida de cada plato en rojo debajo.
  const NOTA_MAPA = ["Bajo cada plato, lo", "que sube el precio", "de su ingrediente", "principal (2016-2025)", `El sueldo: +${rnd(D.sube)} %`];
  const mapa = (id, y) => `<g transform="translate(540 ${y})">${mapaPlatos(id, 1.32, D.mapa, NOTA_MAPA, 8)}</g>`;
  const Y_MAPA = 1000;
  // La mesa para ocho: cada plato con su nombre y su tiempo de trabajo de hoy (suman el total de la tarjeta).
  const M = D.mesa;
  const ETIQ = { cordero: ["Cordero, 3 kg", hm(M.cordero.h["2025"], M.cordero.m["2025"])], marisco: ["Marisco, 2 kg", hm(M.marisco.h["2025"], M.marisco.m["2025"])],
                 jamon: ["Jamón, 600 g", M.jamon.minutos["2025"] + "&nbsp;min"], queso: ["Queso, 600 g", M.queso.minutos["2025"] + "&nbsp;min"], vino: ["Vino, 3 l", M.vino.minutos["2025"] + "&nbsp;min"] };
  return [
    // 1 · Gancho y portada: el mapa grande desde el primer fotograma. La madre: «¿Cuántas horas de curro te cuesta la cena de Nochebuena? Mira cómo ha subido lo típico de cada sitio.»
    { n: 1, set: "vacio",
      svg: `${mapa("s1-mp", Y_MAPA)}${gente("s1", "am")}${selloOficial("s1-sello")}`,
      tarjeta: tarjeta(1, "Navidad · 2016 y hoy", `<div class="tit" style="font-size:60px">¿Cuánto ha <mark id="m1">subido</mark> la cena de Nochebuena?</div>`, { fuente: F_MAPA, icono: bandera(44) }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("salon", null, t, 0);
        vidaFondo("sl", t, { lamparas: 1, capa: "salon" });
        marca("m1", t, c["c1-subido"]);
        selloAnim("s1-sello", t, c["c1-sello"], 540, 1650, { s: 0.95, r: -8 });
        for (let i = 0; i < 12; i++) {   // las pastillas laten una a una cuando dice «subido»
          const q = t - c["c1-subido"] - i * 0.12, s = q > 0 && q < 0.4 ? 1 + 0.18 * Math.sin(q / 0.4 * Math.PI) : 1;
          attr(`s1-mp-q${i}`, "transform", `translate(0 84) scale(${s.toFixed(3)}) translate(0 -84)`);
        }
        persona("s1-a", t, { x: 150, y: 1890, s: 0.6, mira: 1, vivo: true, boca: [[0, "sonrisa"], [c["c1-subido"] + 0.8, "o"]], ojos: [[0, "normal"], [c["c1-subido"] + 0.8, "grandes"]], brazo: [[0, "abajo"]], fase: 1 });
        persona("s1-m", t, { x: 930, y: 1890, s: 0.62, mira: [[0, 0], [c["c1-mira"], -1]], vivo: true, charla: e, boca: habla(t, e, "sonrisa"), brazo: [[0, "abajo"], [c["c1-mira"] - 0.1, "senala"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [], { acerca: 0 }); } },

    // 2 · Mercado. La madre llega con el abuelo, con las manos libres: «Este año la cena la pongo yo… qué ilusión. O no.»
    { n: 2, set: "vacio",
      svg: `${gente("s2", "a")}${gente("s2", "m")}`,
      tarjeta: cita(2, "La madre", `«Este año la cena la pongo <mark id="m2">yo</mark>»`),
      fn: function (t, e) {
        const c = e.c;
        ambiente("mercado", "salon", t, e.t0);
        vidaFondo("mn", t, { lamparas: 2, gente: 2, capa: "mercado", y: 1080, s: 0.42 });
        for (let i = 0; i < 22; i++) { css("mn-ba" + i, "opacity", 0.45 + 0.55 * ((Math.sin(t * 4 + i * 1.3) + 1) / 2)); if (i < 18) css("mn-bb" + i, "opacity", 0.45 + 0.55 * ((Math.sin(t * 3 + i * 0.9) + 1) / 2)); }
        marca("m2", t, c["c2-yo"]);
        const w = ruta(t, [[e.t0, 1250], [e.t0 + 1.0, 860]]), w2 = ruta(t, [[e.t0 + 0.2, 1400], [e.t0 + 1.2, 620]]);
        persona("s2-m", t, { x: w.x, y: 1440, s: 0.8, anda: w.anda, mira: -1, vivo: true, charla: e, boca: habla(t, e, "sonrisa"), brazo: [[0, "abajo"], [c["c2-ilusion"] - 0.1, "hombros"], [c["c2-no"] + 0.5, "abajo"]], espejo: true, fase: 2 });
        persona("s2-a", t, { x: w2.x, y: 1440, s: 0.74, anda: w2.anda, mira: -1, vivo: true, boca: [[0, "sonrisa"], [c["c2-no"], "grande"]], ojos: [[0, "normal"], [c["c2-no"], "felices"]], brazo: [[0, "abajo"]], espejo: true, fase: 1 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c2-no"]]); } },

    // 3 · Pescadería. El tendero: «Un kilo de marisco guapa son 54 minutos. En 2016 eran 52… o sea casi igual.»
    { n: 3, set: "vacio",
      svg: `${gente("s3", "t")}<g transform="translate(770 1460)">${mostradorPescado("s3-mo")}</g>${gente("s3", "ma")}
        <g id="s3-rl"><g transform="translate(0 0)">${relojCocina("s3-r", 80, HOY)}</g>${rot(0, 150, rnd(D.marisco[1]) + " MIN", 44, HOY)}</g>`,
      tarjeta: grande(3, rnd(D.marisco[1]) + "&nbsp;min", { titulo: "Kilo de marisco, en tiempo de trabajo", texto: "En 2016, " + rnd(D.marisco[0]) }, `Precio medio del año, todo tipo de marisco. Sueldo neto mediano: ${es(D.hora["2025"], 2)}&nbsp;€ la hora`, F),
      fn: function (t, e) {
        const c = e.c;
        ambiente("mercado", null, t, 0);
        vidaFondo("mn", t, { lamparas: 2, gente: 2, capa: "mercado", y: 1080, s: 0.42 });
        for (let i = 0; i < 22; i++) { css("mn-ba" + i, "opacity", 0.45 + 0.55 * ((Math.sin(t * 4 + i * 1.3) + 1) / 2)); if (i < 18) css("mn-bb" + i, "opacity", 0.45 + 0.55 * ((Math.sin(t * 3 + i * 0.9) + 1) / 2)); }
        pop("s3-rl", t, c["c3-54"] - 0.3, 520, 990, { s: 0.85 });
        const m = D.marisco[1] * suave(clamp((t - c["c3-54"] + 0.2) / 1.2));
        cuna("s3-r-v", (m % 60) / 60, 80); attr("s3-r-ag", "transform", `rotate(${(m * 6).toFixed(1)})`);
        sube("c3-a", t, c["c3-54"]); sube("c3-b", t, c["c3-2016"]);
        persona("s3-t", t, { x: 790, y: 1440, s: 0.8, mira: -1, vivo: true, charla: e, boca: habla(t, e, "sonrisa"), brazo: [[0, "abajo"], [c["c3-guapa"] - 0.2, "senala"], [c["c3-2016"], "abajo"], [c["c3-igual"] - 0.2, "hombros"]], incl: [[0, 0], [c["c3-igual"], -5]], espejo: true, fase: 2 });
        persona("s3-m", t, { x: 150, y: 1440, s: 0.78, mira: 1, vivo: true, boca: [[0, "seria"], [c["c3-54"] + 0.3, "o"], [c["c3-igual"], "seria"]], ojos: [[0, "normal"], [c["c3-54"] + 0.3, "grandes"], [c["c3-igual"], "normal"]], brazo: [[0, "abajo"]], fase: 1 });
        persona("s3-a", t, { x: 340, y: 1440, s: 0.74, mira: 1, vivo: true, boca: [[0, "seria"], [c["c3-54"] + 0.4, "o"]], ojos: [[0, "normal"], [c["c3-54"] + 0.4, "grandes"]], brazo: [[0, "abajo"]], fase: 1 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c3-54"]]); } },

    // 4 · El abuelo: «¿Una hora por unas gambas? Anda ya… en mis tiempos las pescaba yo.»
    { n: 4, set: "vacio",
      svg: `${gente("s4", "t")}<g transform="translate(770 1460)">${mostradorPescado("s4-mo")}</g>${gente("s4", "ma")}`,
      tarjeta: cita(4, "El abuelo", `«En mis <mark id="m4">tiempos</mark>…»`),
      fn: function (t, e) {
        const c = e.c;
        ambiente("mercado", null, t, 0);
        vidaFondo("mn", t, { lamparas: 2, gente: 2, capa: "mercado", y: 1080, s: 0.42 });
        for (let i = 0; i < 22; i++) { css("mn-ba" + i, "opacity", 0.45 + 0.55 * ((Math.sin(t * 4 + i * 1.3) + 1) / 2)); if (i < 18) css("mn-bb" + i, "opacity", 0.45 + 0.55 * ((Math.sin(t * 3 + i * 0.9) + 1) / 2)); }
        marca("m4", t, c["c4-tiempos"]);
        persona("s4-t", t, { x: 790, y: 1440, s: 0.8, mira: -1, vivo: true, boca: [[0, "sonrisa"], [c["c4-tiempos"] + 0.4, "grande"]], ojos: [[0, "normal"], [c["c4-tiempos"] + 0.4, "felices"]], brazo: [[0, "abajo"], [c["c4-tiempos"] + 0.4, "hombros"]], espejo: true, fase: 2 });
        persona("s4-m", t, { x: 150, y: 1440, s: 0.78, mira: 1, vivo: true, boca: [[0, "sonrisa"]], ojos: [[0, "normal"], [c["c4-tiempos"] + 0.4, "felices"]], brazo: [[0, "abajo"]], fase: 1 });
        persona("s4-a", t, { x: 350, y: 1440, s: 0.74, mira: 1, vivo: true, charla: e, boca: habla(t, e, "sonrisa"), brazo: [[0, "abajo"], [c["c4-gambas"] - 0.3, "senala"], [c["c4-ya"], "hombros"], [c["c4-tiempos"], "arriba"]], incl: [[0, 0], [c["c4-ya"], -6], [c["c4-tiempos"], 0]], salta: c["c4-tiempos"] + 0.2, fase: 1 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c4-tiempos"]]); } },

    // 5 · Carnicería: el plato principal. El tendero: «Y el plato fuerte… la pierna de cordero. Veintiocho euros y pico. En 2016 diecinueve. Un 48 % más.»
    { n: 5, set: "vacio",
      svg: `${gente("s5", "t")}<g transform="translate(770 1460)">${mostradorCarne("s5-mo")}</g><g id="s5-ba">${bascula("s5-b", es(D.corderoEur[1], 2) + " €")}</g>${gente("s5", "ma")}`,
      tarjeta: tarjeta(5, "El plato principal: pierna de cordero", `${vs(5, [es(D.corderoEur[0], 2) + "&nbsp;€", es(D.corderoEur[1], 2) + "&nbsp;€"], ["en 2016", "hoy"], 84)}
        <div class="tit" id="c5-p" style="font-size:92px;color:${HOY};line-height:1;margin-top:6px">+${rnd(D.corderoSube)}&nbsp;%</div>
        <div class="nota">Kilo y medio; precio medio del año (cordero y cabrito)</div>`, { fuente: F_EPF, icono: bandera(44) }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("mercado", null, t, 0);
        vidaFondo("mn", t, { lamparas: 2, gente: 2, capa: "mercado", y: 1080, s: 0.42 });
        for (let i = 0; i < 22; i++) { css("mn-ba" + i, "opacity", 0.45 + 0.55 * ((Math.sin(t * 4 + i * 1.3) + 1) / 2)); if (i < 18) css("mn-bb" + i, "opacity", 0.45 + 0.55 * ((Math.sin(t * 3 + i * 0.9) + 1) / 2)); }
        pop("s5-ba", t, c["c5-pierna"] - 0.15, 600, 1150, { s: 1 });
        const dp = t - c["c5-veintiocho"];
        css("s5-b-pr", "opacity", dp < 0 ? 0 : dp < 0.5 ? (Math.floor(dp * 8) % 2 ? 0.35 : 1) : 1);
        sube("c5-b", t, c["c5-veintiocho"]); sube("c5-a", t, c["c5-2016"]); sube("c5-p", t, c["c5-48"]);
        persona("s5-t", t, { x: 830, y: 1440, s: 0.8, mira: -1, vivo: true, charla: e, boca: habla(t, e, "sonrisa"), brazo: [[0, "abajo"], [c["c5-pierna"] - 0.3, "senala"], [c["c5-2016"], "abajo"], [c["c5-48"], "arriba"]], espejo: true, fase: 2 });
        persona("s5-m", t, { x: 150, y: 1440, s: 0.78, mira: 1, vivo: true, boca: [[0, "seria"], [c["c5-48"] + 0.2, "o"]], ojos: [[0, "normal"], [c["c5-48"] + 0.2, "grandes"]], brazo: [[0, "abajo"]], fase: 1 });
        persona("s5-a", t, { x: 340, y: 1440, s: 0.74, mira: 1, vivo: true, boca: [[0, "seria"], [c["c5-48"] + 0.3, "o"]], ojos: [[0, "normal"], [c["c5-48"] + 0.3, "grandes"]], brazo: [[0, "abajo"]], incl: [[0, 0], [c["c5-48"] + 0.3, 5]], fase: 1 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c5-veintiocho"], e.c["c5-48"]]); } },

    // 6 · La madre hace la cuenta en tiempo: «O sea dos horas y doce minutos de curro. En 2016 ni dos.»
    { n: 6, set: "vacio",
      svg: `${gente("s6", "t")}<g transform="translate(770 1460)">${mostradorCarne("s6-mo")}</g>${gente("s6", "ma")}
        <g id="s6-rl">${relojCocina("s6-r", 80, HOY)}<rect x="-96" y="112" width="192" height="52" rx="26" fill="#FFFDF8"/>${rot(0, 152, rnd(D.cordero[1]) + " MIN", 44, HOY)}</g>`,
      tarjeta: grande(6, rnd(D.cordero[1]) + "&nbsp;min", { titulo: "La pierna de cordero, en tiempo de trabajo", texto: "En 2016, " + rnd(D.cordero[0]) }, `El cordero sube un ${rnd(D.corderoSube)}&nbsp;%; el sueldo, un ${rnd(D.sube)}&nbsp;%`, F),
      fn: function (t, e) {
        const c = e.c;
        ambiente("mercado", null, t, 0);
        vidaFondo("mn", t, { lamparas: 2, gente: 2, capa: "mercado", y: 1080, s: 0.42 });
        for (let i = 0; i < 22; i++) { css("mn-ba" + i, "opacity", 0.45 + 0.55 * ((Math.sin(t * 4 + i * 1.3) + 1) / 2)); if (i < 18) css("mn-bb" + i, "opacity", 0.45 + 0.55 * ((Math.sin(t * 3 + i * 0.9) + 1) / 2)); }
        pop("s6-rl", t, c["c6-sea"] - 0.1, 560, 960, { s: 0.85 });
        const m = D.cordero[1] * suave(clamp((t - c["c6-sea"]) / 1.6));
        cuna("s6-r-v", (m % 60) / 60, 80); attr("s6-r-ag", "transform", `rotate(${(m * 6).toFixed(1)})`);
        sube("c6-a", t, c["c6-doce"]); sube("c6-b", t, c["c6-2016"]);
        persona("s6-t", t, { x: 830, y: 1440, s: 0.8, mira: -1, vivo: true, boca: [[0, "sonrisa"], [c["c6-doce"] + 0.3, "seria"]], brazo: [[0, "abajo"], [c["c6-2016"] + 0.3, "hombros"]], espejo: true, fase: 2 });
        persona("s6-m", t, { x: 150, y: 1440, s: 0.78, mira: 1, vivo: true, charla: e, boca: habla(t, e, "seria"), brazo: [[0, "abajo"], [c["c6-sea"], "piensa"], [c["c6-doce"] + 0.2, "senala"], [c["c6-2016"] + 0.4, "abajo"]], incl: [[0, 0], [c["c6-sea"], -5], [c["c6-doce"], 0]], fase: 1 });
        persona("s6-a", t, { x: 340, y: 1440, s: 0.74, mira: 1, vivo: true, boca: [[0, "seria"], [c["c6-doce"] + 0.3, "o"]], ojos: [[0, "normal"], [c["c6-doce"] + 0.3, "grandes"]], brazo: [[0, "abajo"]], fase: 1 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c6-doce"]]); } },

    // 7 · El abuelo: «¿Dos horas por una pierna? En mis tiempos el cordero lo teníamos en el corral hombre.»
    { n: 7, set: "vacio",
      svg: `${gente("s7", "t")}<g transform="translate(770 1460)">${mostradorCarne("s7-mo")}</g>${gente("s7", "ma")}`,
      tarjeta: cita(7, "El abuelo", `«En mis tiempos, en el <mark id="m7">corral</mark>»`),
      fn: function (t, e) {
        const c = e.c;
        ambiente("mercado", null, t, 0);
        vidaFondo("mn", t, { lamparas: 2, gente: 2, capa: "mercado", y: 1080, s: 0.42 });
        for (let i = 0; i < 22; i++) { css("mn-ba" + i, "opacity", 0.45 + 0.55 * ((Math.sin(t * 4 + i * 1.3) + 1) / 2)); if (i < 18) css("mn-bb" + i, "opacity", 0.45 + 0.55 * ((Math.sin(t * 3 + i * 0.9) + 1) / 2)); }
        marca("m7", t, c["c7-corral"]);
        persona("s7-t", t, { x: 830, y: 1440, s: 0.8, mira: -1, vivo: true, boca: [[0, "sonrisa"], [c["c7-hombre"], "grande"]], ojos: [[0, "normal"], [c["c7-hombre"], "felices"]], brazo: [[0, "abajo"], [c["c7-corral"], "hombros"]], espejo: true, fase: 2 });
        persona("s7-m", t, { x: 150, y: 1440, s: 0.78, mira: 1, vivo: true, boca: [[0, "sonrisa"], [c["c7-hombre"], "grande"]], ojos: [[0, "normal"], [c["c7-hombre"], "felices"]], brazo: [[0, "abajo"]], fase: 1 });
        persona("s7-a", t, { x: 350, y: 1440, s: 0.74, mira: 1, vivo: true, charla: e, boca: habla(t, e, "sonrisa"), brazo: [[0, "abajo"], [c["c7-pierna"] - 0.2, "senala"], [c["c7-tiempos"], "abajo"], [c["c7-corral"] - 0.2, "arriba"]], salta: c["c7-corral"], fase: 1 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c7-corral"]]); } },

    // 8 · La mesa de Nochebuena para ocho, desde arriba: cada plato sale cuando se nombra, con su tiempo de trabajo.
    //     La madre: «Y la cena para ocho todo junto… dos piernas de cordero, dos kilos de marisco, jamón, queso y cuatro botellas de vino.»
    { n: 8, set: "vacio",
      svg: mesaCenital("s8-me", ETIQ),
      tarjeta: tarjeta(8, "La cena de Nochebuena para ocho", `<div class="tit" style="font-size:54px">Cordero, marisco, jamón, queso y vino, <mark id="m8">todo junto</mark></div>`, { fuente: F, icono: bandera(44) }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("salon", "mercado", t, e.t0);
        marca("m8", t, c["c8-junto"]);
        const k = ["cordero", "marisco", "jamon", "queso", "vino"];
        for (const p of k) { pop(`s8-me-d-${p}`, t, c[`c8-${p}`] - 0.1, 0, 0, { s: 1 }); pop(`s8-me-l-${p}`, t, c[`c8-${p}`] + 0.35, 0, 0, { s: 1 }); }
      },
      cam: function (t, e) { return camVivo(t, e, [], { acerca: 0.03 }); } },

    // 9 · Todo junto. La madre: «Todo junto ciento ocho euros. O sea ocho horas y veintiún minutos de curro. En 2016 siete y media… casi una hora más por la misma cena.»
    { n: 9, set: "vacio",
      svg: mesaCenital("s9-me", ETIQ),
      tarjeta: tarjeta(9, "Todo junto: la cena para ocho", `${vs(9, [hm(D.h["2016"], D.m["2016"]), hm(D.h["2025"], D.m["2025"])], ["en 2016", "hoy"], 88)}
        <div class="nota">De trabajo. ${es(D.eur["2025"], 2)}&nbsp;€ hoy y ${es(D.eur["2016"], 2)}&nbsp;€ en 2016. En 2019, ${hm(D.h["2019"], D.m["2019"])}</div>`, { fuente: F, icono: bandera(44) }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("salon", null, t, 0);
        sube("c9-b", t, c["c9-veintiun"]); sube("c9-a", t, c["c9-2016"]);
        const k = ["cordero", "marisco", "jamon", "queso", "vino"];
        k.forEach((p, i) => {   // los cinco tiempos laten seguidos al decir «todo junto»: se suman
          const q = t - c["c9-todo"] - i * 0.14, s = q > 0 && q < 0.4 ? 1 + 0.14 * Math.sin(q / 0.4 * Math.PI) : 1;
          attr(`s9-me-l-${p}`, "transform", `scale(${s.toFixed(3)})`);
        });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c9-veintiun"]], { acerca: 0.02 }); } },

    // 10 · El abuelo, de la mesa llena a un pollo: «¿Una jornada entera por una cena? En mis tiempos con un pollo cenábamos diez.»
    { n: 10, set: "vacio",
      svg: mesaCenital("s10-me", ETIQ),
      tarjeta: tarjeta(10, "El abuelo", `<div class="tit" style="font-size:64px">«En mis tiempos, un <mark id="m10">pollo</mark> para diez»</div>`, { tono: "hoy", fuente: F }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("salon", null, t, 0);
        marca("m10", t, c["c10-pollo"]);
        const k = clamp((t - c["c10-pollo"] + 0.3) / 0.35);
        for (const p of ["cordero", "marisco", "jamon", "queso", "vino"]) { css(`s10-me-d-${p}`, "opacity", 1 - k); css(`s10-me-l-${p}`, "opacity", 1 - k); }
        ver("s10-me-pollo", t >= c["c10-pollo"]); pop("s10-me-pollo", t, c["c10-pollo"], 0, 0, { s: 1 });
      },
      cam: function (t, e) { return camVivo(t, e, [e.c["c10-pollo"]], { acerca: 0.02 }); } },

    // 11 · La pregunta, con el mapa grande otra vez: «¿Y en tu casa qué se come en Nochebuena? ¿Te ha subido tanto?»
    { n: 11, set: "vacio",
      svg: `${mapa("s11-mp", Y_MAPA)}${gente("s11", "am")}`,
      tarjeta: tarjeta(11, "Te toca", `<div class="tit" style="font-size:60px">¿Qué se come en tu <mark id="m11">casa</mark>?</div><div class="sub" id="c11-sub" style="font-size:42px;font-weight:800">¿Te ha subido tanto?</div>`, { fuente: F_MAPA }),
      fn: function (t, e) {
        const c = e.c;
        ambiente("salon", null, t, 0);
        vidaFondo("sl", t, { lamparas: 1, capa: "salon" });
        marca("m11", t, c["c11-casa"]); sube("c11-sub", t, c["c11-tanto"]);
        persona("s11-a", t, { x: 150, y: 1890, s: 0.6, mira: 1, vivo: true, boca: [[0, "sonrisa"]], brazo: [[0, "abajo"], [c["c11-tanto"], "hombros"]], fase: 1 });
        persona("s11-m", t, { x: 930, y: 1890, s: 0.62, mira: [[0, -1], [c["c11-casa"], 0]], vivo: true, charla: e, boca: habla(t, e, "sonrisa"), brazo: [[0, "abajo"], [c["c11-casa"], "senala"]], espejo: true, fase: 2 });
      },
      cam: function (t, e) { return camVivo(t, e, [], { acerca: 0 }); } },
  ];
}
