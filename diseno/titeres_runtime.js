// Motor de movimiento de los títeres de recortes (se ejecuta dentro de la página).
// Todo es determinista: el mismo t da siempre el mismo fotograma.
(function () {
  const FPS_RECORTE = 12; // stop-motion: las piezas se mueven a 12 imágenes por segundo

  // Pseudoaleatorio estable en [-1, 1]
  function azar(a, b) {
    const x = Math.sin(a * 127.1 + b * 311.7) * 43758.5453;
    return (x - Math.floor(x)) * 2 - 1;
  }
  const suave = (x) => x * x * (3 - 2 * x);
  const lerp = (a, b, k) => a + (b - a) * k;

  const EXPR = {
    neutra:     { incl: 0,  ci: 0,   cd: 0,   ri: 0,  rd: 0,  boca: "cerrada", parp: 0 },
    contenta:   { incl: -3, ci: -5,  cd: -5,  ri: -4, rd: 4,  boca: "sonrisa", parp: 0.12 },
    sorpresa:   { incl: -6, ci: -18, cd: -18, ri: -6, rd: 6,  boca: "O",       parp: -0.1 },
    duda:       { incl: 7,  ci: 6,   cd: -14, ri: 8,  rd: -6, boca: "torcida", parp: 0.22 },
    seria:      { incl: 2,  ci: 5,   cd: 5,   ri: 9,  rd: -9, boca: "cerrada", parp: 0.15 },
    explicando: { incl: -2, ci: -8,  cd: -3,  ri: -3, rd: 3,  boca: "cerrada", parp: 0 },
  };
  const GESTO = {
    abajo:    (tq) => 24,
    explicar: (tq) => 20 + 9 * Math.sin(tq * 3.6),
    arriba:   (tq) => 8 + 4 * Math.sin(tq * 6),
    saludo:   (tq) => 26 + 16 * Math.sin(tq * 8),
  };

  const estadoPrevio = {};

  function poner(el, attr, val) { if (el && el.getAttribute(attr) !== val) el.setAttribute(attr, val); }

  // estado: {x, y, s, espejo, t, visible, entrada, hablando, amp, ampOtro, expr, exprPrev, kExpr, gesto, gestoPrev, kGesto, mirada, semilla}
  function actualizar(id, e) {
    const raiz = document.getElementById(id);
    if (!raiz) return;
    if (!e.visible) { raiz.style.display = "none"; return; }
    raiz.style.display = "";
    const paso = Math.floor(e.t * FPS_RECORTE);
    const tq = paso / FPS_RECORTE;
    const j = (k, amp) => azar(paso + e.semilla * 101, k) * amp; // temblor de recorte

    const ex0 = EXPR[e.exprPrev] || EXPR.neutra, ex1 = EXPR[e.expr] || EXPR.neutra;
    const k = suave(Math.min(1, Math.max(0, e.kExpr)));
    const ex = {};
    for (const c of ["incl", "ci", "cd", "ri", "rd", "parp"]) ex[c] = lerp(ex0[c], ex1[c], k);

    // Raíz: entrada desde abajo con rebote y temblor
    const ent = e.entrada >= 1 ? 1 : suave(Math.max(0, e.entrada));
    const rebote = e.entrada < 1 ? 0 : 0;
    const sx = e.espejo ? -e.s : e.s;
    const x = e.x + (e.espejo ? 600 * e.s : 0) + j(1, 2);
    const y = e.y + (1 - ent) * 760 + j(2, 2) + rebote;
    poner(raiz, "transform", `translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${sx} ${e.s}) rotate(${(j(3, 0.5)).toFixed(2)} 300 820)`);

    // Respiración del cuerpo
    const resp = 1 + 0.012 * Math.sin((tq * 2 * Math.PI) / 3.6 + e.semilla);
    poner(document.getElementById(`${id}-cuerpo`), "transform",
      `translate(${j(4, 1.5).toFixed(1)} ${j(5, 1.5).toFixed(1)}) translate(300 820) scale(1 ${resp.toFixed(4)}) translate(-300 -820)`);

    // Cabeza: inclinación por expresión, cabeceo al hablar, asentir al escuchar
    const habla = e.hablando ? e.amp : 0;
    const cabeceo = e.hablando ? habla * 4.5 * Math.sin(tq * 8.7 + e.semilla) + habla * 2 : 1.6 * (e.ampOtro || 0) * Math.sin(tq * 5.1);
    const ang = ex.incl + cabeceo + j(6, 0.9);
    const dy = e.hablando ? -habla * 6 : 0;
    poner(document.getElementById(`${id}-cabeza`), "transform",
      `translate(${j(7, 1.5).toFixed(1)} ${(dy + j(8, 1.5)).toFixed(1)}) rotate(${ang.toFixed(2)} 300 470)`);

    // Cejas: expresión + énfasis al hablar
    const enf = e.hablando ? -habla * 7 : 0;
    const ci = document.getElementById(`${id}-ceja-i`), cd = document.getElementById(`${id}-ceja-d`);
    poner(ci, "transform", `translate(0 ${(ex.ci + enf + j(9, 1)).toFixed(1)}) rotate(${ex.ri.toFixed(1)} 245 270)`);
    poner(cd, "transform", `translate(0 ${(ex.cd + enf + j(10, 1)).toFixed(1)}) rotate(${ex.rd.toFixed(1)} 355 270)`);

    // Ojos: mirada y parpadeo (cada 2,6-4,4 s, dos fotogramas cerrados)
    for (const lado of ["i", "d"]) {
      poner(document.getElementById(`${id}-iris-${lado}`), "transform", `translate(${(e.mirada * 8).toFixed(1)} ${e.mirada === 0 ? 1 : 0})`);
    }
    let parp = Math.max(0, ex.parp);
    const ciclo = 2.6 + 1.8 * ((azar(e.semilla, Math.floor(tq / 3.5)) + 1) / 2);
    const fase = (tq + e.semilla * 0.37) % ciclo;
    if (fase < 0.17) parp = 1;
    for (const lado of ["i", "d"]) {
      const p = document.getElementById(`${id}-parpado-${lado}`);
      if (!p) continue;
      const cx = +p.dataset.cx, cy = +p.dataset.cy;
      const fondo = cy - 28 + parp * 50;
      poner(p, "d", `M${cx - 39} ${cy} Q${cx} ${cy - 29} ${cx + 39} ${cy} Q${cx} ${fondo.toFixed(1)} ${cx - 39} ${cy} Z`);
    }

    // Boca: por volumen de voz al hablar; si no, la de la expresión
    let boca = (e.kExpr > 0.5 ? ex1 : ex0).boca;
    if (e.hablando) boca = habla > 0.62 ? "abierta" : habla > 0.3 ? "media" : habla > 0.08 ? "cerrada" : boca === "O" ? "O" : "cerrada";
    const gb = document.getElementById(`${id}-boca`);
    if (gb && estadoPrevio[id] !== boca) {
      for (const v of gb.children) v.style.display = v.dataset.boca === boca ? "inline" : "none";
      estadoPrevio[id] = boca;
    }

    // Mano: gesto con transición
    const g0 = (GESTO[e.gestoPrev] || GESTO.abajo)(tq), g1 = (GESTO[e.gesto] || GESTO.abajo)(tq);
    const kg = suave(Math.min(1, Math.max(0, e.kGesto)));
    const ag = lerp(g0, g1, kg) + j(11, 1.2);
    // Bajar o subir la mano = deslizarla en vertical (no barre la pantalla)
    const baja = (g) => (g === "abajo" ? 420 : 0);
    const dyMano = lerp(baja(e.gestoPrev), baja(e.gesto), kg);
    const mano = document.getElementById(`${id}-mano`);
    poner(mano, "transform", `translate(0 ${dyMano.toFixed(1)}) rotate(${ag.toFixed(2)} 470 830)`);
    // Con el brazo bajado del todo, la mano se esconde (no asoma por debajo del cuerpo)
    if (mano) mano.style.display = e.gesto === "abajo" && e.kGesto >= 1 ? "none" : "";
  }

  window.Titeres = { actualizar, azar, suave, FPS_RECORTE };
})();
