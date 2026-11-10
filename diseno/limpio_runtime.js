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
  const bote = anda ? Math.abs(Math.sin(t * 9)) * 9 : Math.sin(t * 2.2 + fase) * 2.5;
  el.setAttribute("transform", `translate(${o.x.toFixed(1)} ${o.y.toFixed(1)}) scale(${(dir * s * (o.sx ?? 1)).toFixed(3)} ${s.toFixed(3)})`);
  attr(id + "-c", "transform", `translate(0 ${(-bote - (o.sube ?? 0)).toFixed(1)})`);
  const paso = anda ? Math.sin(t * 9) * 24 : 0;
  attr(id + "-pi", "transform", `rotate(${paso.toFixed(1)} -28 -190)`);
  attr(id + "-pd", "transform", `rotate(${(-paso).toFixed(1)} 28 -190)`);
  const b = vigente(o.brazo, t, "abajo"), k = suave((t - b.tc) / 0.28);
  const [i0, d0] = BRAZOS[b.prev], [i1, d1] = BRAZOS[b.cur];
  const onda = b.cur === "saluda" ? Math.sin(t * 11) * 15 : b.cur === "hombros" ? Math.sin(t * 3) * 3 : 0;
  attr(id + "-bi", "transform", `rotate(${(i0 + (i1 - i0) * k + (anda ? -paso * 0.6 : 0)).toFixed(1)} -80 -348)`);
  attr(id + "-bd", "transform", `rotate(${(d0 + (d1 - d0) * k + onda + (anda && b.cur === "abajo" ? paso * 0.6 : 0)).toFixed(1)} 80 -348)`);
  const incl = vigente(o.incl, t, 0).cur;
  attr(id + "-h", "transform", `rotate(${(Math.sin(t * 1.6 + fase) * 1.8 + incl).toFixed(2)} 0 -400)`);
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
  ver("set-super", e.set === "super"); ver("set-liso", e.set !== "super");
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
  e.fn(t, e);
  subtitulos(t);
  progreso(t);
};
