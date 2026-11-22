// Motor del estilo «limpio» (se ejecuta en la página). Movimiento suave y tranquilo.
/* global D, CUES, TROZOS, CAPS, ESCENAS */
const $ = (id) => document.getElementById(id);
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const suave = (x) => { x = clamp(x); return x * x * (3 - 2 * x); };
const fuera = (x) => 1 - Math.pow(1 - clamp(x), 3);
const rebote = (x) => { x = clamp(x); const c = 1.70158; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };
const lin = (t, t0, d, a, b) => a + (b - a) * clamp((t - t0) / d);
const ir = (t, t0, d, a, b) => a + (b - a) * suave((t - t0) / d);
const es = (v, d = 1) => v.toFixed(d).replace(".", ",");
function azar(a, b) { const x = Math.sin(a * 127.1 + b * 311.7) * 43758.5453; return (x - Math.floor(x)) * 2 - 1; }

function T(id, x, y, o = {}) {
  const el = $(id);
  if (!el) return;
  el.style.display = "";
  const s = o.s ?? 1, sx = o.sx ?? s, sy = o.sy ?? s;
  el.setAttribute("transform", `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${(o.r ?? 0).toFixed(2)}) scale(${sx.toFixed(3)} ${sy.toFixed(3)})`);
  if (o.op !== undefined) el.style.opacity = o.op;
}
function ver(id, si) { const el = $(id); if (el) el.style.display = si ? "" : "none"; }
function txt(id, s) { const el = $(id); if (el && el.textContent !== s) el.textContent = s; }
function attr(id, k, v) { const el = $(id); if (el) el.setAttribute(k, v); }
function css(id, k, v) { const el = typeof id === "string" ? $(id) : id; if (el) el.style[k] = v; }

// Un elemento SVG aparece con un pequeño rebote.
function pop(id, t, t0, x, y, o = {}) {
  const k = (t - t0) / (o.d ?? 0.32);
  if (k < 0) { ver(id, false); return -1; }
  T(id, x, y, { s: (o.s ?? 1) * (0.3 + 0.7 * rebote(k)), r: o.r ?? 0, op: clamp(k * 4) });
  return t - t0;
}
// Un elemento HTML (parte de una tarjeta) aparece subiendo un poco.
function sube(id, t, t0, d = 0.3) {
  const el = typeof id === "string" ? $(id) : id;
  if (!el) return -1;
  const k = (t - t0) / d;
  el.style.opacity = clamp(k * 2.5);
  el.style.transform = `translateY(${((1 - fuera(k)) * 22).toFixed(1)}px)`;
  return t - t0;
}
// Rotulador amarillo que subraya una palabra de la tarjeta.
function marca(id, t, t0, d = 0.38) { const el = $(id); if (el) el.style.setProperty("--m", (fuera((t - t0) / d) * 100).toFixed(1) + "%"); }
// Barra o bloque que crece (alto o ancho en px).
function crece(id, prop, t, t0, d, hasta) { const el = $(id); if (el) el.style[prop] = (suave((t - t0) / d) * hasta).toFixed(1) + "px"; }
// Un objeto salta en arco de un sitio a otro.
function salto(id, t, t0, x0, y0, x1, y1, o = {}) {
  const k = clamp((t - t0) / (o.d ?? 0.42));
  if (t < t0 && !o.antes) { ver(id, false); return; }
  const x = x0 + (x1 - x0) * suave(k), y = y0 + (y1 - y0) * k - Math.sin(k * Math.PI) * (o.alto ?? 150);
  T(id, x, y, { s: o.s ?? 1, r: (o.r ?? 0) * (1 - k) });
}

// Busca en una lista [[tiempo, valor], …] el valor vigente y el anterior.
function vigente(lista, t, defecto) {
  let cur = defecto, prev = defecto, tc = -9;
  if (!Array.isArray(lista)) return { cur: lista ?? defecto, prev: lista ?? defecto, tc };
  for (const [ti, v] of lista) if (t >= ti) { prev = cur; cur = v; tc = ti; }
  return { cur, prev, tc };
}
const BRAZOS = {
  abajo: [5, -5], saluda: [5, -150], empuja: [5, -74], senala: [5, -118], arriba: [150, -150], hombros: [34, -34],
  sujeta: [5, -98], piensa: [5, -160],
};
// Dani: postura, pasos, brazos, ojos y boca. Todo con transiciones suaves.
function persona(id, t, o) {
  const el = $(id);
  if (!el) return;
  if (o.oculto) { el.style.display = "none"; return; }
  el.style.display = "";
  const s = o.s ?? 1, dir = o.espejo ? -1 : 1, fase = o.fase ?? 0;
  const anda = vigente(o.anda, t, false).cur;
  // «vivo» (T9 en adelante): respira, se balancea, gesticula y asiente mientras habla, y puede dar saltos.
  const V = !!o.vivo;
  const charla = V && o.charla && t >= o.charla.b && t <= o.charla.f;
  let salto = 0, aplasta = 0;
  for (const ts of (V ? [].concat(o.salta ?? []) : [])) {
    const k = (t - ts) / 0.5;
    if (k >= -0.12 && k < 0) aplasta = Math.max(aplasta, 0.07 * (1 + k / 0.12));       // se agacha antes de saltar
    else if (k >= 0 && k <= 1) salto = Math.max(salto, Math.sin(k * Math.PI) * 120);
    else if (k > 1 && k < 1.3) aplasta = Math.max(aplasta, 0.06 * (1 - (k - 1) / 0.3)); // y aterriza
  }
  const bote = anda ? Math.abs(Math.sin(t * 9)) * (V ? 14 : 9) : Math.sin(t * 2.2 + fase) * (V ? 3.5 : 2.5) + (charla ? Math.abs(Math.sin(t * 6.5)) * 5 : 0);
  const respira = V ? 1 + 0.014 * Math.sin(t * 2.6 + fase) : 1;
  const pasoSq = V && anda ? 0.035 * Math.max(0, Math.cos(t * 18)) : 0;
  const sy = respira * (1 - aplasta - pasoSq), sxx = 1 + (aplasta + pasoSq) * 0.6;
  const balanceo = V ? Math.sin(t * 1.3 + fase) * 1.4 + (charla ? 2.2 : 0) + (anda ? Math.sin(t * 9) * 2 : 0) : 0;
  el.setAttribute("transform", `translate(${o.x.toFixed(1)} ${o.y.toFixed(1)}) rotate(${((o.rot ?? 0) + balanceo * dir).toFixed(2)}) scale(${(dir * s * (o.sx ?? 1)).toFixed(3)} ${s.toFixed(3)})`);
  attr(id + "-c", "transform", `translate(0 ${(-bote - salto - (o.sube ?? 0)).toFixed(1)}) scale(${sxx.toFixed(3)} ${sy.toFixed(3)})`);
  const paso = anda ? Math.sin(t * 9) * (V ? 30 : 24) : (salto > 0 ? 14 * Math.min(1, salto / 40) : 0);   // al saltar, piernas abiertas
  attr(id + "-pi", "transform", `rotate(${paso.toFixed(1)} -28 -190)`);
  attr(id + "-pd", "transform", `rotate(${(-paso).toFixed(1)} 28 -190)`);
  const b = vigente(o.brazo, t, "abajo"), k = V ? clamp(rebote(clamp((t - b.tc) / 0.32)), 0, 1.12) : suave((t - b.tc) / 0.28);
  const [i0, d0] = BRAZOS[b.prev], [i1, d1] = BRAZOS[b.cur];
  const gesto = charla ? Math.sin(t * 4.2 + fase) * 9 : 0;
  const onda = b.cur === "saluda" ? Math.sin(t * 11) * 15 : b.cur === "hombros" ? Math.sin(t * 3) * 3 : 0;
  attr(id + "-bi", "transform", `rotate(${(i0 + (i1 - i0) * k + (anda ? -paso * 0.6 : 0) - gesto * 0.6).toFixed(1)} -80 -348)`);
  attr(id + "-bd", "transform", `rotate(${(d0 + (d1 - d0) * k + onda + gesto + (anda && b.cur === "abajo" ? paso * 0.6 : 0)).toFixed(1)} 80 -348)`);
  const incl = vigente(o.incl, t, 0).cur;
  const asiente = charla ? Math.sin(t * 7.5) * 3.2 : 0;
  attr(id + "-h", "transform", `rotate(${(Math.sin(t * 1.6 + fase) * (V ? 2.6 : 1.8) + incl + asiente).toFixed(2)} 0 -400)`);
  const ojos = vigente(o.ojos, t, "normal").cur;
  const ciclo = 3.3 + (fase % 1.2), cerr = (t + fase) % ciclo < 0.12 ? 0.12 : 1;
  const eo = ojos === "grandes" ? 1.32 : 1, mx = (vigente(o.mira, t, 0).cur) * 7;
  ver(id + "-of", ojos === "felices");
  for (const [p, x] of [["oi", -34], ["od", 34]]) {
    const g = $(id + "-" + p);
    g.style.display = ojos === "felices" ? "none" : "";
    g.setAttribute("transform", `translate(${x + mx} -488) scale(${eo} ${(eo * cerr).toFixed(2)})`);
  }
  attr(id + "-cj", "transform", `translate(0 ${ojos === "grandes" ? -13 : ojos === "felices" ? -4 : 0})`);
  const boca = vigente(o.boca, t, "sonrisa").cur;
  for (const m of $(id + "-b").children) m.style.display = m.dataset.b === boca ? "" : "none";
}

// Cámara con vida (T9): se acerca despacio durante el plano y da un pequeño golpe de zoom en cada dato.
function camVivo(t, e, golpes = [], o = {}) {
  const k = clamp((t - e.t0) / Math.max(0.5, (e.t1 ?? e.t0 + 4) - e.t0));
  let z = 1 + (o.acerca ?? 0.045) * suave(k);
  for (const g of golpes) { const d = t - g; if (d >= 0 && d < 0.6) z += 0.05 * Math.sin(Math.min(1, d / 0.12) * Math.PI / 2) * Math.exp(-d * 5); }
  return { z, fx: (o.fx ?? 540) + Math.sin(t * 0.6) * 18, fy: o.fy, dx: Math.sin(t * 0.9) * 6, dy: Math.cos(t * 0.7) * 4 };
}

// Alguien trabajando (carnicero, camarera, mecánico…): alterna dos posturas del brazo a un ritmo fijo.
// El personaje está dibujado dentro de un grupo que ya lo coloca: por eso x = y = 0 y s = 1 por defecto.
function trabaja(id, t, o = {}) {
  const per = o.ritmo ?? 0.5, fa = o.fase ?? 0, f = Math.floor((t + fa) / per), t1 = f * per - fa;
  const a = o.a ?? "empuja", b = o.b ?? "senala";
  persona(id, t, { x: o.x ?? 0, y: o.y ?? 0, s: o.s ?? 1, espejo: o.espejo, oculto: o.oculto,
    brazo: [[t1 - per, f % 2 ? a : b], [t1, f % 2 ? b : a]], mira: o.mira ?? 0, ojos: o.ojos ?? "normal",
    boca: o.boca ?? "sonrisa", incl: o.incl ?? 0, fase: fa });
}
// Boca de quien habla: se abre y se cierra mientras suena su frase (e.b → e.f); si no, sonríe o lo que se pida.
function habla(t, e, quieto) {
  if (t < e.b || t > e.f) return quieto ?? "sonrisa";
  const k = Math.floor((t - e.b) * 8.5) % 4;
  return k === 0 ? "o" : k === 1 ? "grande" : k === 2 ? "o" : "seria";
}
// Vapor que sube (cafetera): círculos que suben, crecen y se desvanecen.
function vapor(p, n, t, x, y) {
  for (let k = 0; k < n; k++) {
    const f = ((t * 0.9 + k / n) % 1);
    attr(p + k, "cx", (x + Math.sin((t + k) * 3) * 8).toFixed(1)); attr(p + k, "cy", (y - f * 170).toFixed(1));
    attr(p + k, "r", (12 + f * 22).toFixed(1)); css(p + k, "opacity", (0.8 * (1 - f)).toFixed(2));
  }
}
// Recorrido de un personaje: [[t, x], …]. Entre dos puntos con distinta x anda; con la misma x, se queda quieto.
// Devuelve {x, anda, dir} (dir: −1 si va hacia la izquierda, 1 a la derecha, 0 parado) para pasárselo a persona().
function ruta(t, pts) {
  if (t <= pts[0][0]) return { x: pts[0][1], anda: false, dir: 0 };
  for (let i = 1; i < pts.length; i++) {
    const [ta, xa] = pts[i - 1], [tb, xb] = pts[i];
    if (t < tb) {
      const k = clamp((t - ta) / (tb - ta)), kk = 0.75 * k + 0.25 * suave(k);
      return { x: xa + (xb - xa) * kk, anda: xb !== xa, dir: Math.sign(xb - xa) };
    }
  }
  return { x: pts[pts.length - 1][1], anda: false, dir: 0 };
}
// Persona que cruza andando: entra por un lado y sale por el otro (o se para en «hasta»).
// o: {x0, v (px/s), y, t0 (cuándo empieza a andar), hasta (x donde se para, opcional), fase}
function andar(id, t, o) {
  const el = $(id);
  if (!el) return;
  const dt = t - (o.t0 ?? 0);
  if (dt < 0 && !o.antes) { el.style.display = "none"; return; }
  el.style.display = "";
  let x = o.x0 + o.v * Math.max(0, dt), parado = false;
  if (o.hasta !== undefined && (o.v > 0 ? x >= o.hasta : x <= o.hasta)) { x = o.hasta; parado = true; }
  const f = (o.fase ?? 0) + t * 8.5, paso = parado ? 0 : Math.sin(f) * 22;
  const s = o.s ?? 1;
  el.setAttribute("transform", `translate(${x.toFixed(1)} ${o.y}) scale(${((o.dir ?? o.v) < 0 ? -s : s).toFixed(3)} ${s.toFixed(3)})`);
  attr(id + "-c", "transform", `translate(0 ${parado ? 0 : (-Math.abs(Math.sin(f)) * 6).toFixed(1)})`);
  attr(id + "-pi", "transform", `rotate(${paso.toFixed(1)} -12 -86)`);
  attr(id + "-pd", "transform", `rotate(${(-paso).toFixed(1)} 12 -86)`);
  if (o.op !== undefined) el.style.opacity = o.op;
}
// Gente que cruza la calle en dos carriles (ida y vuelta). Cada persona tiene su sitio en un bucle de ancho W.
// o.op(i): opacidad de la persona i (para que alguien entre o se vaya).
function gentio(p, n, t, o = {}) {
  const W = o.W ?? 1500;
  for (let i = 0; i < n; i++) {
    const carril = i % 2, v = carril ? -58 : 66, y = carril ? 1338 : 1300, s = carril ? 1.06 : 0.96;
    const x0 = ((i * 0.618034 + carril * 0.31) % 1) * W;
    const x = ((((x0 + v * t) % W) + W) % W) - 210;
    andar(p + "-w" + i, t, { x0: x, v: 0, dir: v, y: y, s: s, fase: i * 1.7, op: o.op ? o.op(i) : 1 });
  }
}
// Cambio de decorado «como en un sueño»: el decorado anterior se deshace en ondas mientras aparece el nuevo.
// Los decorados son capas compartidas (class="capa") con id «amb-<nombre>» dentro del grupo «amb», que lleva
// el filtro de ondas «f-sueno»; «amb-bruma» es un velo blanco. Devuelve el avance del cambio (0..1).
function ambiente(actual, anterior, t, t0, d = 0.9) {
  const a = $("amb-" + actual), grupo = $("amb"), bruma = $("amb-bruma");
  if (!a) return 1;
  a.style.display = ""; a.style.opacity = 1;
  const k = anterior ? clamp((t - t0) / d) : 1;
  if (k >= 1) { if (grupo) grupo.removeAttribute("filter"); return 1; }
  const p = $("amb-" + anterior);
  p.style.display = "";
  // El que va después en el dibujo queda encima: ese es el que se funde.
  if (a.compareDocumentPosition(p) & 4) p.style.opacity = (1 - suave(k)).toFixed(3);
  else { p.style.opacity = 1; a.style.opacity = suave(k).toFixed(3); }
  const onda = Math.sin(k * Math.PI);
  grupo.setAttribute("filter", "url(#f-sueno)");
  attr("f-sueno-d", "scale", (120 * onda).toFixed(1));
  attr("f-sueno-t", "baseFrequency", (0.004 + 0.002 * k).toFixed(4) + " " + (0.009 + 0.004 * k).toFixed(4));
  if (bruma) { bruma.style.display = ""; bruma.style.opacity = (0.6 * onda).toFixed(3); }
  return k;
}
// La cámara respira con el cambio de decorado: se acerca un poco y vuelve.
function camSueno(t, t0, d = 0.9) { return { z: 1 + 0.08 * Math.sin(clamp((t - t0) / d) * Math.PI) }; }
// Barra «de cada 100 €» de una tarjeta: reparte el ancho entre comida, casa y ocio (el resto queda de fondo).
// a y b: {comida, casa, ocio} en %; k: avance de a hacia b (0..1); foco: el trozo que se resalta.
function barra100(p, a, b, k, foco) {
  for (const x of ["comida", "casa", "ocio"]) {
    const el = $(p + "-s-" + x);
    if (!el) continue;
    el.style.width = (a[x] + (b[x] - a[x]) * k).toFixed(2) + "%";
    el.style.opacity = x === foco ? 1 : 0.28;
  }
}
// Cambia el color de una figura de la rejilla.
function pinta(id, color) { const el = $(id); if (el && el.getAttribute("fill") !== color) el.setAttribute("fill", color); }

// ------------------------------------------------------------------ capas fijas
// El subtítulo va justo debajo de los pies del personaje (no encima de él) y nunca pasa de
// SUB_ANCHO, para no meterse bajo los botones de la derecha de Shorts.
const SUB_ANCHO = 800;
let subPrev = -2, subEscala = 1;
function subtitulos(t) {
  const el = $("sub"), tx = $("sub-t");
  let g = -1;
  for (let i = 0; i < TROZOS.length; i++) if (t >= TROZOS[i].t0 - 0.04) g = i;
  if (g >= 0 && t > TROZOS[g].t1 + 0.35) g = -1;
  if (g < 0) { el.style.display = "none"; subPrev = -2; return; }
  el.style.display = "block";
  if (g !== subPrev) { tx.textContent = TROZOS[g].txt; subPrev = g; subEscala = Math.min(1, SUB_ANCHO / tx.offsetWidth); }
  const k = (t - (TROZOS[g].t0 - 0.04)) / 0.12;
  el.style.transform = `scale(${(subEscala * (0.88 + 0.12 * rebote(k))).toFixed(3)})`;
}
function progreso(t) {
  const barras = $("prog").children;
  for (let i = 0; i < CAPS.length; i++) barras[i].firstElementChild.style.width = (clamp((t - CAPS[i].t0) / (CAPS[i].t1 - CAPS[i].t0)) * 100).toFixed(1) + "%";
}

// Todo el decorado sube un poco: los pies quedan en y = 1360 y el subtítulo cabe debajo.
const SUBE = -50;
window.render = function (t) {
  let n = 0;
  for (let i = 0; i < ESCENAS.length; i++) if (t >= ESCENAS[i].t0) n = i;
  const e = ESCENAS[n];
  for (let i = 0; i < ESCENAS.length; i++) {
    $("esc-" + ESCENAS[i].n).style.display = i === n ? "" : "none";
    $("card-" + ESCENAS[i].n).style.display = i === n ? "block" : "none";
  }
  for (const s of SETS) ver("set-" + s, e.set === s);
  // Cámara: encuadre de la escena y un acercamiento muy lento.
  const cam = e.cam ? e.cam(t, e) : {};
  const z = (cam.z ?? 1) * lin(t, e.t0, e.t1 - e.t0, 1, 1.03) * (1 + 0.02 * (1 - fuera((t - e.t0) / 0.35)));
  const fx = cam.fx ?? 540, fy = cam.fy ?? 1150;
  $("mundo").setAttribute("transform", `translate(${(cam.sx ?? 540) + (cam.dx ?? 0)} ${(cam.sy ?? fy) + SUBE + (cam.dy ?? 0)}) scale(${z.toFixed(4)}) translate(${-fx} ${-fy})`);
  // La tarjeta baja suavemente al empezar la escena.
  const card = $("card-" + e.n), kc = (t - e.t0 - 0.05) / 0.32;
  card.style.opacity = clamp(kc * 2.2);
  card.style.transform = `translateY(${((1 - fuera(kc)) * -34).toFixed(1)}px)`;
  txt("caja-num", "");   // la pantalla de la caja solo enseña cifras en las escenas que la usan
  for (const el of document.querySelectorAll(".capa")) el.style.display = "none";   // las capas compartidas, solo si la escena las pide
  e.fn(t, e);
  subtitulos(t);
  progreso(t);
};

// Cuña de un reloj de «horas de trabajo» (T9): rellena la fracción f (0..1) de la esfera, desde las 12 en el sentido de las agujas.
function cuna(id, f, r) {
  f = clamp(f, 0, 1);
  if (f <= 0) { attr(id, "d", "M0 0 Z"); return; }
  if (f >= 0.995) { attr(id, "d", `M0 ${-r} A${r} ${r} 0 1 1 0 ${r} A${r} ${r} 0 1 1 0 ${-r} Z`); return; }
  const a = f * 2 * Math.PI, x = r * Math.sin(a), y = -r * Math.cos(a);
  attr(id, "d", `M0 0 L0 ${-r} A${r} ${r} 0 ${f > 0.5 ? 1 : 0} 1 ${x.toFixed(1)} ${y.toFixed(1)} Z`);
}

// Un papel (u otro objeto) cae desde arriba girando y aterriza con un pequeño rebote (T10).
function cae(id, t, t0, x, y, o = {}) {
  const d = o.d ?? 0.42, k = (t - t0) / d;
  if (k < 0) { ver(id, false); return -1; }
  const tras = (t - t0 - d) / 0.2, golpe = tras >= 0 && tras < 1 ? 0.06 * Math.sin(tras * Math.PI) : 0;
  T(id, x, y - (o.alto ?? 520) * (1 - fuera(k)), { s: (o.s ?? 1) * (1 + golpe), r: (o.r ?? 0) + (o.r0 ?? 24) * (1 - suave(k)), op: clamp(k * 3) });
  return t - t0;
}
// Contador que sube de uno en uno en los momentos dados y late al cambiar (T10). Devuelve la cuenta.
function cuenta(id, t, base, tiempos) {
  let n = base, ult = -9;
  for (const ti of tiempos) if (t >= ti) { n++; ult = ti; }
  txt(id, String(n));
  const d = t - ult;
  css(id, "transform", `scale(${(1 + (d >= 0 && d < 0.35 ? 0.28 * Math.sin(d / 0.35 * Math.PI) : 0)).toFixed(3)})`);
  return n;
}

// Sello rojo «SOLO DATOS OFICIALES» (Bruno, 22-11-2026: en las primeras viñetas de cada vídeo). Cae de golpe desde
// grande, gira un poco, rebota y se queda; opcionalmente se va con «hasta».
function selloAnim(id, t, t0, x, y, o = {}) {
  const k = (t - t0) / 0.3;
  if (k < 0 || (o.hasta !== undefined && t > o.hasta + 0.3)) { ver(id, false); return; }
  const golpe = k >= 1 && k < 2 ? 0.07 * Math.sin((k - 1) * Math.PI) : 0;
  const sale = o.hasta !== undefined ? clamp((t - o.hasta) / 0.3) : 0;
  T(id, x, y, { s: (o.s ?? 1) * (k < 1 ? 2.6 - 1.6 * fuera(k) : 1 - golpe), r: (o.r ?? -10) + (k < 1 ? -14 * (1 - k) : 0), op: clamp(k * 3) * (1 - sale) });
}
// Vida de fondo de un decorado (T14): lámparas que se balancean («<p>-l0», «<p>-l1»…, colgadas de su punto más alto),
// gente que pasa al fondo («<p>-w0»…, hechas con paseante()), un primer plano «<p>-fg» y el propio decorado «amb-<capa>»
// que se mueven distinto con la cámara para que se note la profundidad.
function vidaFondo(p, t, o = {}) {
  for (let i = 0; i < (o.lamparas ?? 0); i++) {
    const el = $(p + "-l" + i);
    if (el) el.setAttribute("transform", `rotate(${(Math.sin(t * 1.3 + i * 1.9) * (o.balanceo ?? 3)).toFixed(2)} ${el.dataset.x} ${el.dataset.y})`);
  }
  for (let i = 0; i < (o.gente ?? 0); i++) {
    const W = o.W ?? 1400, v = i % 2 ? -46 : 52, x0 = ((i * 0.618 + 0.2) % 1) * W;
    const x = ((((x0 + v * t) % W) + W) % W) - 200;
    andar(p + "-w" + i, t, { x0: x, v: 0, dir: v, y: o.y ?? 1090, s: o.s ?? 0.5, fase: i * 1.3 });
  }
  const deriva = Math.sin(t * 0.6);
  if (o.capa) attr("amb-" + o.capa, "transform", `translate(${(deriva * 10).toFixed(1)} 0)`);
  const fg = $(p + "-fg");
  if (fg) fg.setAttribute("transform", `translate(${(-deriva * 16).toFixed(1)} 0)`);
}
