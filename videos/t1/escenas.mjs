// Escenas de T1 «¿Te cunde el carro igual que antes?» — una por frase de la narración.
// Cada escena tiene su decorado (svg) y su acción (fn), que se ejecuta en la página con
// las utilidades de diseno/historia_runtime.js. Los momentos e.c[...] salen de historia.json.
/* eslint-disable no-undef */

import { obj, carroLleno, dani, moneda, euro, caja, hojaCal, nomina, selloCaucho, marcaSello, bocadillo, ticketCuerda,
  ticketLargo, etiq, chip, fondoSuper, primerTermino, suelo, fondoPapel, fondoOscuro, mostrador, T as TK } from "../../diseno/atrezo.mjs";

export function datos(t1) {
  const f = (a) => t1.filas.find((x) => x.anyo === a);
  const es = (v, d = 1) => v.toFixed(d).replace(".", ",");
  const sueldo = 100 * (f(2024).salario_neto_hora_mediana / f(2016).salario_neto_hora_mediana - 1);
  const compra = 100 * (f(2024).cesta_euros_mes / f(2016).cesta_euros_mes - 1);
  return {
    h2016n: f(2016).horas_neto_mediana, h2019n: f(2019).horas_neto_mediana, h2024n: f(2024).horas_neto_mediana,
    h2016: es(f(2016).horas_neto_mediana), h2019: es(f(2019).horas_neto_mediana), h2024: es(f(2024).horas_neto_mediana),
    sueldon: sueldo, compran: compra, sueldo: es(sueldo, 0), compra: es(compra, 0),
    dif: es(f(2024).horas_neto_mediana - f(2016).horas_neto_mediana),
    c: { ocre: TK.ocre, azulTiza: TK.azul_tiza },
  };
}

export function escenas(D) {
  const REF = 590 + D.h2016n * 40; // hasta dónde llega el ticket de 2016 en el tendedero
  return [
    // 1 · «Oye, una pregunta: ¿a ti el carro te cunde igual que antes?»
    { n: 1, tono: "neutro",
      svg: `${fondoSuper("neutro")}${dani("s1-dani", "hoy")}${suelo("neutro")}${primerTermino("neutro")}${carroLleno("s1-carro", 560)}`,
      fn: function (t, e) {
        const rueda = q(t) - e.t0 < 0.8, x = ir(t, e.t0, 0.8, -420, 720);
        T("s1-carro", x, 1092 - (rueda ? Math.abs(boil("bote", t, 7)) : 0), { r: boil("s1c", t, rueda ? 1.6 : 0.3) });
        const a = e.c["c1-dani"];
        actor("s1-dani", t, { x: x - 760, y: 521, espejo: true, apar: e.t0 - 1, expr: [[0, "contenta"], [a + 1.1, "duda"]],
          gesto: [[a, "saludo"], [a + 1.0, "explicar"]], mirada: [[0, -1], [a - 0.15, 0]], semilla: 8 });
      } },

    // 2 · «Vamos a comprobarlo. Pero sin euros, ¿eh? En horas de curro.»
    { n: 2, tono: "neutro",
      svg: `${fondoOscuro()}${euro("s2-euro", 250)}${moneda("s2-reloj", 250, "neutro")}
        <text id="s2-rot" x="540" y="1290" text-anchor="middle" font-family="Plex" font-weight="700" font-size="64" fill="${TK.papel}">euros</text>`,
      fn: function (t, e) {
        const cm = e.c["c2-moneda"], cn = e.c["c2-no"], cg = e.c["c2-giro"], k = q(t) - cm;
        if (k < 0) { ver("s2-euro", false); ver("s2-reloj", false); ver("s2-rot", false); return; }
        const kc = clamp(k / 0.3);
        const y = kc < 1 ? 250 + 650 * kc * kc : 900 - Math.max(0, 70 * Math.sin((k - 0.3) * 11)) * Math.exp(-(k - 0.3) * 5);
        const g = clamp((q(t) - cg) / 0.35), cara = g < 0.5;
        const no = q(t) >= cn && q(t) < cn + 0.6 ? 13 * Math.sin((q(t) - cn) * 21) : 0;   // la moneda niega con la cabeza
        ver("s2-euro", cara); ver("s2-reloj", !cara);
        T(cara ? "s2-euro" : "s2-reloj", 540, y, { sx: Math.max(0.05, Math.abs(Math.cos(g * Math.PI))), sy: 1, r: no + boil("s2m", t, 0.5) });
        attr("s2-reloj-aguja", "transform", "rotate(" + Math.floor(Math.max(0, t - cg) * FR) * 30 + ")");
        ver("s2-rot", k > 0.4);
        txt("s2-rot", cara ? "euros" : "horas de trabajo");
      } },

    // 3 · «Este es Dani. Año 2016.»
    { n: 3, tono: "pasado",
      svg: `${fondoSuper("pasado")}${hojaCal("s3-cal", "2016", "pasado")}${dani("s3-dani", "antes")}${suelo("pasado")}${primerTermino("pasado")}
        ${carroLleno("s3-carro", 420, false)}${etiq("s3-nombre", "DANI", { fuente: "Fraunces", tam: 60, pad: 50 })}`,
      fn: function (t, e) {
        const cd = e.c["c3-dani"], cc = e.c["c3-cal"];
        actor("s3-dani", t, { x: ir(t, cd, 0.4, -640, 40), y: 521, apar: e.t0 - 1, expr: [[0, "contenta"]], gesto: [[cd + 0.2, "saludo"], [cd + 1.7, "abajo"]], mirada: 0, semilla: 3 });
        pop("s3-nombre", t, cd + 0.4, 300, 1190, { r: -5 });
        pop("s3-cal", t, cc, 800, 690, { r: 7, s: 1.2 });
        T("s3-carro", ir(t, e.t0, 0.6, 1400, 820), 1110, { r: boil("s3c", t, 0.3) });
      } },

    // 4 · «Hace la compra del mes: pan, leche, huevos, aceite… lo de siempre.»
    { n: 4, tono: "pasado",
      svg: `${fondoSuper("pasado")}${suelo("pasado")}${primerTermino("pasado")}${obj("leche", "s4-leche", 240, "c-leche")}${obj("aceite", "s4-aceite", 240, "c-aceite")}
        ${obj("pan", "s4-pan", 250, "c-pan")}${obj("huevos", "s4-huevos", 220, "c-huevos")}${obj("manzana", "s4-fruta", 170, "c-manzana")}
        ${carroLleno("s4-carro", 780, false)}${etiq("s4-nota", ["Comida y bebida sin alcohol", "gasto medio por persona"], { tam: 32 })}`,
      fn: function (t, e) {
        T("s4-carro", 540, 1010, { r: boil("s4c", t, 0.25) });
        caer("s4-leche", t, e.c["c4-leche"], 600, 770, { dx: -280, r: -3, giro: -120 });
        caer("s4-aceite", t, e.c["c4-aceite"], 700, 760, { dx: 300, r: 5 });
        caer("s4-pan", t, e.c["c4-pan"], 455, 815, { dx: 300, r: -22 });
        caer("s4-huevos", t, e.c["c4-huevos"], 780, 830, { dx: -260, r: 6, giro: -90 });
        caer("s4-fruta", t, e.c["c4-fruta"], 545, 850, { dx: 240, r: 0 });
        pop("s4-nota", t, e.b + 0.5, 540, 1392, { r: -1.5 });
      } },

    // 5 · «¿Y cuánto le cuesta? 12,8 horas de trabajo.»
    { n: 5, tono: "pasado",
      svg: `${fondoSuper("pasado")}${dani("s5-dani", "antes")}${mostrador()}${caja("s5-caja", "pasado")}
        ${[0, 1, 2].map((i) => moneda("s5-m" + i, 44, "pasado")).join("")}
        ${etiq("s5-anyo", "2016", { tam: 46, peso: 700 })}${chip("s5-chip", D.h2016 + " h", "pasado", 130)}`,
      fn: function (t, e) {
        const cc = e.c["c5-cuenta"], cd = e.c["c5-dato"], k = clamp((q(t) - cc) / (cd - cc));
        actor("s5-dani", t, { x: 470, y: 521, apar: e.t0 - 1, expr: [[0, "neutra"], [cd + 0.1, "contenta"]],
          gesto: [[cd + 0.15, "arriba"], [cd + 1.5, "abajo"]], mirada: [[0, -1], [cd + 0.6, 0]], semilla: 3 });
        T("s5-caja", 360, 850 + (q(t) - cd >= 0 && q(t) - cd < 1 / FR ? 8 : 0));
        txt("s5-caja-num", t < cc ? "¿?" : es(D.h2016n * suave(k)) + " h");
        const h = clamp((q(t) - cd - 0.1) / 0.5) * 170;
        for (const p of ["r", "l"]) { attr("s5-caja-ticket-" + p, "y", -272 - h); attr("s5-caja-ticket-" + p, "height", h); }
        for (let i = 0; i < 3; i++) pop("s5-m" + i, t, cd + 0.2 + i * 0.16, 720 + i * 92, 1050, { r: (i - 1) * 9 });
        pop("s5-anyo", t, cd, 250, 1150, { r: -5 });
        pop("s5-chip", t, cd, 560, 1262);
      },
      cam: function (t, e) { return { z: lin(t, e.t0, e.t1 - e.t0, 1, 1.06), cx: 420, cy: 800 }; } },

    // 6 · «Ahora, el mismo Dani, con el último dato oficial. Mismo carro, ¿vale?»
    { n: 6, tono: "hoy",
      svg: `${fondoSuper("pasado")}${fondoSuper("hoy", "s6-fondo-hoy")}${hojaCal("s6-h24", "2024", "hoy")}${hojaCal("s6-h19", "2019", "pasado")}
        ${hojaCal("s6-h16", "2016", "pasado")}<g id="s6-giro">${dani("s6-antes", "antes")}${dani("s6-hoy", "hoy")}</g>${suelo("neutro")}${primerTermino("neutro")}
        ${carroLleno("s6-carro", 400)}${etiq("s6-dato", ["último dato oficial", "de salarios"], { tam: 32 })}${etiq("s6-mismo", "el mismo carro", { tam: 36 })}`,
      fn: function (t, e) {
        const ch = e.c["c6-hojas"], cd = e.c["c6-dani"], c24 = e.c["c6-2024"], cc = e.c["c6-carro"];
        $("s6-fondo-hoy").style.opacity = suave(clamp((q(t) - cd) / 0.4));
        const g = clamp((q(t) - cd) / 0.34);
        actor("s6-antes", t, { x: 40, y: 521, apar: e.t0 - 1, expr: [[0, "contenta"]], mirada: 1, semilla: 3 });
        actor("s6-hoy", t, { x: 40, y: 521, apar: e.t0 - 1, expr: [[0, "contenta"]], gesto: [[cd + 0.5, "saludo"], [cd + 1.7, "abajo"]], mirada: 0, semilla: 8 });
        ver("s6-antes", g < 0.5); ver("s6-hoy", g >= 0.5);
        attr("s6-giro", "transform", "translate(325 0) scale(" + Math.max(0.05, Math.abs(Math.cos(g * Math.PI))).toFixed(3) + " 1) translate(-325 0)");
        const vuela = (id, t0, dir) => {
          const k = clamp((q(t) - t0) / 0.4);
          if (k >= 1) { ver(id, false); return; }
          T(id, 800 + dir * 560 * k * k, 630 - 300 * k, { r: 6 + dir * 80 * k, s: 1.15 });
        };
        T("s6-h24", 800, 630, { r: 6 + boil("h24", t, 0.4), s: 1.15 });
        vuela("s6-h19", ch + 0.55, 1);
        vuela("s6-h16", ch + 0.1, -1);
        pop("s6-dato", t, c24, 800, 868, { r: -3 });
        if (q(t) < cc) ver("s6-carro", false); else T("s6-carro", ir(t, cc, 0.6, 1500, 830), 1150, { r: boil("s6c", t, 0.4) });
        pop("s6-mismo", t, cc + 0.7, 800, 1400, { r: 2 });
      } },

    // 7 · «Pues… 14,5 horas.»
    { n: 7, tono: "hoy",
      svg: `${fondoSuper("hoy")}${dani("s7-dani", "hoy")}${mostrador()}${caja("s7-caja", "hoy")}
        ${chip("s7-antes", "2016 · " + D.h2016 + " h", "pasado", 44)}${[0, 1, 2, 3].map((i) => moneda("s7-m" + i, 44, "hoy")).join("")}
        ${etiq("s7-anyo", "2024", { tam: 46, peso: 700 })}${chip("s7-chip", D.h2024 + " h", "hoy", 130)}`,
      fn: function (t, e) {
        const cc = e.c["c7-cuenta"], cd = e.c["c7-dato"], k = clamp((q(t) - cc) / (cd - cc));
        actor("s7-dani", t, { x: 470, y: 521, apar: e.t0 - 1, expr: [[0, "neutra"], [cc + 0.3, "duda"], [cd, "sorpresa"]],
          gesto: [[cd + 0.1, "arriba"]], mirada: [[0, -1], [cd + 0.9, 0]], semilla: 8 });
        T("s7-caja", 360, 850 + (q(t) - cd >= 0 && q(t) - cd < 1 / FR ? 10 : 0));
        txt("s7-caja-num", es(D.h2016n + (D.h2024n - D.h2016n) * suave(k)) + " h");
        attr("s7-caja-num", "fill", k > 0 ? D.c.azulTiza : D.c.ocre);
        pop("s7-antes", t, e.t0 + 0.15, 330, 522, { r: -4 });
        for (let i = 0; i < 4; i++) pop("s7-m" + i, t, cd + 0.2 + i * 0.14, 690 + i * 84, 1050, { r: (i - 1.5) * 8 });
        pop("s7-anyo", t, cd, 250, 1150, { r: -5 });
        pop("s7-chip", t, cd, 560, 1262);
      },
      cam: function (t, e) {
        return { z: lin(t, e.t0, e.t1 - e.t0, 1, 1.03) + 0.09 * suave(clamp((t - e.c["c7-dato"]) / 0.2)), cx: 620, cy: 960 };
      } },

    // 8 · «Y ojo, que Dani ahora cobra más: un 23 % más por hora, ya limpio.»
    { n: 8, tono: "hoy",
      svg: `${fondoPapel("hoy")}${dani("s8-dani", "hoy")}${suelo("hoy")}${nomina("s8-nomina")}
        ${chip("s8-chip", "+" + D.sueldo + " %", "hoy", 100)}${etiq("s8-nota", "Sueldo neto por hora (mediana)", { tam: 30 })}`,
      fn: function (t, e) {
        const cn = e.c["c8-nomina"], cs = e.c["c8-sube"], cd = e.c["c8-dato"];
        actor("s8-dani", t, { x: -20, y: 521, apar: e.t0 - 1, expr: [[0, "contenta"]], gesto: [[cn + 0.3, "arriba"]], mirada: [[0, 0], [cs - 0.2, 1]], semilla: 8 });
        pop("s8-nomina", t, cn, 775, 835, { r: 3 });
        const h = 290 * (D.sueldon / 100) * clamp((q(t) - cs) / (cd - cs));
        attr("s8-nomina-sube", "y", -40 - h); attr("s8-nomina-sube", "height", h);
        pop("s8-chip", t, cd, 775, 1222);
        pop("s8-nota", t, cd + 0.35, 540, 1338, { r: -1 });
      } },

    // 9 · «Lo que pasa es que la compra, la misma, ha subido un 40.»
    { n: 9, tono: "hoy",
      svg: `${fondoPapel("hoy")}
        <g filter="url(#rc)"><rect x="210" y="850" width="220" height="300" fill="url(#rayas-ocre)" stroke="${TK.texto_papel}" stroke-width="4"/>
          <rect x="210" y="${(850 - 3 * D.sueldon).toFixed(1)}" width="220" height="${(3 * D.sueldon).toFixed(1)}" fill="url(#rayas-azul)" stroke="${TK.texto_papel}" stroke-width="4"/></g>
        <g id="s9-col" filter="url(#rc)"><rect x="610" y="850" width="220" height="300" fill="url(#rayas-ocre)" stroke="${TK.texto_papel}" stroke-width="4"/>
          <rect id="s9-sube" x="610" y="850" width="220" height="0" fill="url(#rayas-azul)" stroke="${TK.texto_papel}" stroke-width="4"/></g>
        <line x1="120" y1="850" x2="960" y2="850" stroke="${TK.texto_papel}" stroke-width="5" stroke-dasharray="16 12"/>
        <text x="120" y="834" font-family="Plex" font-weight="600" font-size="30" fill="${TK.gris_texto_papel}">2016</text>
        <line x1="120" y1="1150" x2="960" y2="1150" stroke="${TK.texto_papel}" stroke-width="6"/>
        ${obj("nomina", "s9-nom", 170)}${carroLleno("s9-carro", 240)}
        ${etiq("s9-e1", "sueldo por hora", { tam: 30 })}${etiq("s9-e2", "la misma compra", { tam: 30 })}
        ${chip("s9-c23", "+" + D.sueldo + " %", "hoy", 70)}${chip("s9-c40", "+" + D.compra + " %", "hoy", 100)}`,
      fn: function (t, e) {
        const cc = e.c["c9-carro"], cs = e.c["c9-sube"], cd = e.c["c9-dato"];
        T("s9-nom", 320, 850 - 3 * D.sueldon - 92, { r: -4 + boil("s9n", t, 0.4) });
        T("s9-e1", 320, 1200, { r: -1 }); T("s9-c23", 320, 1292, { r: boil("s9a", t, 0.3) });
        const h = 3 * D.compran * clamp((q(t) - cs) / (cd - cs));
        attr("s9-sube", "y", 850 - h); attr("s9-sube", "height", h);
        ver("s9-col", q(t) >= cc);
        pop("s9-e2", t, cc + 0.2, 720, 1200, { r: 1 });
        if (q(t) < cc) ver("s9-carro", false); else T("s9-carro", ir(t, cc, 0.4, 1300, 720), 850 - h - 94, { r: boil("s9c", t, 0.5) });
        pop("s9-c40", t, cd, 720, 1296);
      } },

    // 10 · «¿Y sabes qué? En 2019 todavía le costaba 12,6. El salto vino después.»
    { n: 10, tono: "neutro",
      svg: `${fondoPapel("neutro")}<path d="M-20 596 H1100" stroke="#000" stroke-width="10" opacity=".14"/><path d="M-20 590 H1100" stroke="#7A5C43" stroke-width="9"/>
        <line x1="70" y1="${REF.toFixed(1)}" x2="1010" y2="${REF.toFixed(1)}" stroke="${TK.texto_papel}" stroke-width="5" stroke-dasharray="16 12"/>
        ${ticketCuerda("s10-t16", "2016", "pasado")}${ticketCuerda("s10-t19", "2019", "pasado")}${ticketCuerda("s10-t24", "2024", "hoy")}`,
      fn: function (t, e) {
        const pon = (id, x, largo, k, valor, ref) => {
          if (k <= 0) { ver(id, false); return; }
          const total = Math.max(80, largo * k);
          T(id, x, 590, { r: boil(id, t, 0.45) });
          attr(id + "-r", "height", total); attr(id + "-l", "height", Math.max(0, total - 100));
          attr(id + "-z", "transform", "translate(0 " + total.toFixed(1) + ")");
          const exceso = ref ? Math.max(0, total - ref) : 0;
          attr(id + "-x", "y", total - exceso); attr(id + "-x", "height", exceso);
          attr(id + "-v", "y", total - 26 - (exceso > 0 ? exceso : 0)); txt(id + "-v", k >= 1 ? valor : "");
        };
        const c = e.c;
        pon("s10-t16", 215, D.h2016n * 40, clamp((q(t) - c["c10-t16"]) / 0.35 + 0.001), D.h2016 + " h");
        pon("s10-t19", 540, D.h2019n * 40, clamp((q(t) - c["c10-t19"]) / Math.max(0.3, c["c10-dato19"] - c["c10-t19"])), D.h2019 + " h");
        pon("s10-t24", 865, D.h2024n * 40, clamp((q(t) - c["c10-t24"]) / Math.max(0.4, c["c10-dato24"] - c["c10-t24"])), D.h2024 + " h", D.h2016n * 40);
      } },

    // 11 · «Entonces, ¿qué? ¿Mejora, empeora o depende?»
    { n: 11, tono: "neutro",
      svg: `${fondoOscuro()}<g filter="url(#rc)"><rect x="-20" y="1040" width="1120" height="46" fill="#6E5D4C"/></g>
        ${[0, 1, 2].map((i) => selloCaucho("s11-s" + i)).join("")}
        ${["MEJORA", "EMPEORA", "DEPENDE"].map((p, i) => etiq("s11-e" + i, p, { fuente: "Fraunces", tam: 44 })).join("")}`,
      fn: function (t, e) {
        const cs = [e.c["c11-m"], e.c["c11-e"], e.c["c11-d"]];
        for (let i = 0; i < 3; i++) {
          const k = q(t) - cs[i], salto = k >= 0 && k < 3 / FR ? [46, 22, 6][Math.round(k * FR)] : 0;
          if (pop("s11-s" + i, t, e.c["c11-ini"] + 0.08 + i * 0.09, 215 + i * 325, 1040 - salto, { s: 1.45, r: salto ? (i - 1) * 4 : 0 }) < 0) continue;
          pop("s11-e" + i, t, cs[i], 215 + i * 325, 1180, { r: (i - 1) * 3 });
        }
      } },

    // 12 · «Esta vez, empeora. Casi dos horas más de curro al mes… por lo mismo.»
    { n: 12, tono: "hoy",
      svg: `${fondoOscuro()}${ticketLargo("s12-ticket", "TICKET · 2024")}${marcaSello("s12-marca", "EMPEORA")}${selloCaucho("s12-sello")}
        ${chip("s12-chip", "+" + D.dif + " h al mes", "hoy", 76)}
        <g id="s12-nota" font-family="Plex" font-weight="600" font-size="27" fill="${TK.papel}" text-anchor="middle">
          <text x="540" y="1316">Con 2016, 2018 o 2019 como referencia</text><text x="540" y="1350">Con sueldo medio o mediano, bruto o neto</text></g>`,
      fn: function (t, e) {
        const cs = e.c["c12-sello"], cd = e.c["c12-dato"], k = q(t) - cs;
        T("s12-ticket", 540, 850, { r: -3 + boil("s12t", t, 0.25) });
        let x = 770, y = 560 + 12 * Math.sin(q(t) * 5), r = 12;          // el sello espera en alto…
        if (k >= -1 / FR && k < 0) { x = 640; y = 770; r = 2; }           // …baja…
        else if (k >= 0 && k < 3 / FR) { x = 540; y = 930; r = -8; }      // …golpea…
        else if (k >= 3 / FR) { const u = suave(clamp((k - 3 / FR) / 0.45)); x = 540 + 420 * u; y = 930 - 420 * u; r = -8 + 30 * u; } // …y se retira
        T("s12-sello", x, y, { s: 2, r });
        if (k >= 0) T("s12-marca", 540, 900, { r: -8, s: 0.82 }); else ver("s12-marca", false);
        pop("s12-chip", t, cd, 540, 1232);
        ver("s12-nota", q(t) >= cd + 0.3);
      },
      cam: function (t, e) {
        const k = q(t) - e.c["c12-sello"], g = k >= 0 && k < 3 / FR, p = Math.floor(t * FR);
        return { z: 1.02 + (g ? 0.03 : 0), dx: g ? azar(3, p) * 16 : 0, dy: g ? azar(4, p) * 16 : 0, r: g ? azar(5, p) * 0.8 : 0 };
      } },

    // 13 · «¿Y a ti? ¿Te cunde más o menos? Te leo.»
    { n: 13, tono: "hoy",
      svg: `${fondoSuper("hoy")}${dani("s13-dani", "hoy")}${suelo("hoy")}${primerTermino("hoy")}${carroLleno("s13-carro", 440)}${bocadillo("s13-boc")}
        ${etiq("s13-q", "¿Y a ti?", { fuente: "Fraunces", tam: 96, pad: 60 })}`,
      fn: function (t, e) {
        actor("s13-dani", t, { x: 40, y: 521, apar: e.t0 - 1, expr: [[0, "contenta"]], gesto: [[e.t0 + 0.2, "saludo"]], mirada: 0, semilla: 8 });
        T("s13-carro", ir(t, e.t0, 0.5, 1400, 840), 1130, { r: boil("s13c", t, 0.3) });
        pop("s13-q", t, e.c["c13-ini"] + 0.25, 540, 1392, { r: -2 });
        const cb = e.c["c13-bocadillo"];
        if (pop("s13-boc", t, cb, 800, 700, { r: 3 }) >= 0)
          for (let i = 0; i < 3; i++) attr("s13-boc-p" + i, "cy", -16 * Math.max(0, Math.sin((q(t) - cb) * 9 - i * 0.9)));
      } },
  ];
}
