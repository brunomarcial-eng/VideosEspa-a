// Motor de escenas (se ejecuta dentro de la página). Determinista: mismo t, mismo fotograma.
// Los recortes se mueven a 12 imágenes por segundo (stop-motion); la cámara, suave.
/* global Titeres, BEATS, CAPS, CUES, ESCENAS, D */
const FR = 12;
const $ = (id) => document.getElementById(id);
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const suave = (x) => x * x * (3 - 2 * x);
const q = (t) => Math.floor(t * FR + 1e-6) / FR;
function azar(a, b) { const x = Math.sin(a * 127.1 + b * 311.7) * 43758.5453; return (x - Math.floor(x)) * 2 - 1; }
function semilla(s) { let h = 7; for (const c of s) h = (h * 31 + c.charCodeAt(0)) % 9973; return h; }
const boil = (id, t, amp = 1) => azar(semilla(id), Math.floor(t * FR)) * amp;
const es = (v, d = 1) => v.toFixed(d).replace(".", ",");

// Coloca un grupo SVG: posición, giro y escala.
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

// Movimiento a 12 fps con arranque y frenada suaves.
const ir = (t, t0, d, a, b) => a + (b - a) * suave(clamp((q(t) - t0) / d));
// Movimiento continuo (para la cámara).
const lin = (t, t0, d, a, b) => a + (b - a) * clamp((t - t0) / d);

// Un recorte «se pega» en su sitio: aparece grande, rebota y se queda temblando un poco.
function pop(id, t, t0, x, y, o = {}) {
  const k = q(t) - t0;
  if (k < 0) { ver(id, false); return -1; }
  const s = k < 1 / FR ? 0.55 : k < 2 / FR ? 1.16 : k < 3 / FR ? 0.95 : 1;
  const giro = k < 3 / FR ? azar(semilla(id), 3) * 6 : 0;
  T(id, x, y, { s: (o.s ?? 1) * s, r: (o.r ?? 0) + giro + boil(id, t, o.boil ?? 0.5) });
  return k;
}

// Un objeto cae en parábola hasta su sitio y da un botecito.
function caer(id, t, t0, xf, yf, o = {}) {
  const d = o.d ?? 0.34, k = (q(t) - t0) / d;
  if (k < 0) { ver(id, false); return; }
  if (k < 1) {
    const x = xf + (o.dx ?? 260) * (1 - k), y = (o.y0 ?? 330) + (yf - (o.y0 ?? 330)) * k * k;
    T(id, x, y, { r: (o.r ?? 0) + (1 - k) * (o.giro ?? 140), s: o.s ?? 1 });
  } else {
    const kb = q(t) - t0 - d;
    const sy = kb < 1 / FR ? 0.86 : kb < 2 / FR ? 1.06 : 1;
    T(id, xf, yf, { r: (o.r ?? 0) + boil(id, t, 0.4), sx: (o.s ?? 1) * (2 - sy), sy: (o.s ?? 1) * sy });
  }
}

// Personaje de recortes: aparece subiendo, cambia de expresión y de gesto según la lista.
function actor(id, t, o) {
  const visible = t >= o.apar && (o.sale === undefined || t < o.sale + 0.35);
  let ex = "neutra", exP = "neutra", tE = -9;
  for (const [te, n] of o.expr || []) if (t >= te) { exP = ex; ex = n; tE = te; }
  let ge = "abajo", geP = "abajo", tG = -9;
  for (const [tg, n] of o.gesto || []) if (t >= tg) { geP = ge; ge = n; tG = tg; }
  let mi = typeof o.mirada === "number" ? o.mirada : 0;
  if (Array.isArray(o.mirada)) for (const [tm, v] of o.mirada) if (t >= tm) mi = v;
  let entrada = (t - o.apar) / 0.4;
  if (o.sale !== undefined && t >= o.sale) entrada = 1 - (t - o.sale) / 0.3;
  entrada = entrada >= 1 ? 1 : Math.floor(Math.max(0, entrada) * 5) / 5;
  Titeres.actualizar(id, {
    x: o.x, y: o.y, s: o.s ?? 0.95, espejo: !!o.espejo, t, visible, entrada, hablando: false, amp: 0, ampOtro: 0,
    expr: ex, exprPrev: exP, kExpr: (t - tE) / 0.22, gesto: ge, gestoPrev: geP, kGesto: (t - tG) / 0.3, mirada: mi,
    semilla: o.semilla ?? 3,
  });
}

// ------------------------------------------------------------------ subtítulos
let capPrev = "";
function subtitulos(t) {
  const el = $("cap");
  let g = -1;
  for (let i = 0; i < CAPS.length; i++) if (t >= CAPS[i].t0 - 0.1) g = i;
  if (g < 0 || t > CAPS[g].t1 + 0.3) { if (capPrev !== "") { el.innerHTML = ""; capPrev = ""; } el.style.display = "none"; return; }
  const c = CAPS[g];
  let actual = -1;
  for (let i = 0; i < c.w.length; i++) if (t >= c.w[i].t0 - 0.03) actual = i;
  const clave = g + ":" + actual;
  if (clave === capPrev) return;
  capPrev = clave;
  el.style.display = "block";
  el.className = "tono-" + c.tono;
  el.innerHTML = c.w.map((w, i) => `<span class="${i < actual ? "dicha" : i === actual ? "ahora" : ""}">${w.p}</span>`).join(" ");
}

// ------------------------------------------------------------------ sello de fuente
function sellos(t, n) {
  document.querySelectorAll(".sello-v").forEach((s) => (s.style.display = "none"));
  const b = BEATS[n];
  if (!b.sello) return;
  const k = q(t) - b.tSello;
  if (k < 0) return;
  const el = $("sello-" + b.n);
  el.style.display = "block";
  const s = k < 1 / FR ? 1.3 : k < 2 / FR ? 0.95 : 1;
  el.firstElementChild.style.transform = `rotate(${(-1.2 + boil("sello", t, 0.25)).toFixed(2)}deg) scale(${s})`;
}

// ------------------------------------------------------------------ bucle
window.render = function (t) {
  let n = 0;
  for (let i = 0; i < ESCENAS.length; i++) if (t >= ESCENAS[i].t0) n = i;
  const e = ESCENAS[n];
  for (let i = 0; i < ESCENAS.length; i++) $("esc-" + ESCENAS[i].n).style.display = i === n ? "" : "none";
  // Cámara: acercamiento lento y continuo; al entrar, la escena «cae» como un papel.
  const cam = e.cam ? e.cam(t, e) : {};
  const kin = q(t) - e.t0;
  const golpe = n > 0 && kin < 2 / FR ? (kin < 1 / FR ? 1.045 : 1.015) : 1;
  const z = (cam.z ?? lin(t, e.t0, e.t1 - e.t0, 1, 1.045)) * golpe;
  const cx = cam.cx ?? 540, cy = cam.cy ?? 900;
  const giro = (n > 0 && kin < 2 / FR ? azar(e.n, 5) * 0.9 : 0) + (cam.r ?? 0);
  const dx = cam.dx ?? 0, dy = cam.dy ?? 0;
  $("cam-" + e.n).setAttribute("transform",
    `translate(${(cx + dx).toFixed(1)} ${(cy + dy).toFixed(1)}) rotate(${giro.toFixed(2)}) scale(${z.toFixed(4)}) translate(${-cx} ${-cy})`);
  e.fn(t, e);
  subtitulos(t);
  sellos(t, n);
};
