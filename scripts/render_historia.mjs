#!/usr/bin/env node
// Renderiza un Short narrado (escenas de videos/<id>/escenas.mjs) con Chromium y ffmpeg.
// Estilo «limpio» o «collage», según lo que exporte escenas.mjs. Salida: videos/<id>/render/<id>-<estilo>.mp4
//   node scripts/render_historia.mjs t1                 vídeo completo (4 partes en paralelo)
//   node scripts/render_historia.mjs t1 --hoja DIR      fotogramas de control (2 por plano) en DIR
//   node scripts/render_historia.mjs t1 --fotograma 12.5 --salida f.png
// Antes: voces.py (voz y tiempos) y sonido.py (música, efectos y momentos clave).

import { createRequire } from "node:module";
import { spawn } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync, rmSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { construirHistoria } from "../diseno/historia.mjs";
import { construirLimpio } from "../diseno/limpio.mjs";

const { chromium } = createRequire(import.meta.url)("playwright");
const YO = fileURLToPath(import.meta.url);
const RAIZ = path.resolve(path.dirname(YO), "..");
const args = process.argv.slice(2);
const id = args[0];
const val = (n, d) => { const i = args.indexOf(n); return i > 0 ? args[i + 1] : d; };
const FPS = 30;

const dir = path.join(RAIZ, "videos", id);
const leer = (f) => JSON.parse(readFileSync(f, "utf8"));
const guion = leer(path.join(dir, "guion.json"));
const linea = leer(path.join(dir, "audio", "linea_tiempo.json"));
const cues = leer(path.join(dir, "audio", "cues.json"));
const mod = await import(path.join(dir, "escenas.mjs"));
const D = mod.datos(leer(path.join(RAIZ, guion.datos)));
// El estilo lo decide el vídeo: escenas.mjs exporta ESTILO = "limpio" (tarjeta y subtítulo grande) o nada (collage).
const ESTILO = mod.ESTILO === "limpio" ? "limpio" : "collage";
const construir = ESTILO === "limpio" ? construirLimpio : construirHistoria;
const html = construir({ guion, linea, cues, escenas: mod.escenas(D), D });
mkdirSync(path.join(dir, "render"), { recursive: true });
const ficheroHtml = path.join(dir, "render", `${id}-historia.html`);

async function abrir() {
  const navegador = await chromium.launch();
  const pag = await navegador.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  pag.on("pageerror", (e) => { console.error("Error en la página:", e.message); process.exitCode = 1; });
  await pag.goto("file://" + ficheroHtml);
  const fuentes = ESTILO === "limpio" ? ["600 20px Cap", "800 20px Cap"]
    : ["700 20px Fraunces", "900 20px Fraunces", "400 20px Plex", "600 20px Plex", "700 20px Plex", "600 20px Cap", "800 20px Cap"];
  await pag.evaluate((fs) => Promise.all(fs.map((f) => document.fonts.load(f))), fuentes);
  return { navegador, pag };
}

if (args.includes("--hoja") || args.includes("--fotograma")) {
  writeFileSync(ficheroHtml, html);
  const { navegador, pag } = await abrir();
  if (args.includes("--fotograma")) {
    await pag.evaluate((t) => window.render(t), +val("--fotograma"));
    await pag.screenshot({ path: val("--salida", path.join(dir, "render", "fotograma.png")) });
  } else {
    const destino = val("--hoja");
    mkdirSync(destino, { recursive: true });
    for (const [i, p] of linea.planos.entries()) {
      const fin = i + 1 < linea.planos.length ? linea.planos[i + 1].ini - 0.2 : linea.duracion - 0.2;
      for (const [k, t] of [[0, p.ini + (p.fin - p.ini) * 0.4], [1, fin]]) {
        await pag.evaluate((tt) => window.render(tt), t);
        await pag.screenshot({ path: path.join(destino, `p${String(p.n).padStart(2, "0")}_${k}.png`) });
      }
    }
  }
  await navegador.close();
  process.exit(process.exitCode || 0);
}

const total = Math.round(linea.duracion * FPS);
if (args.includes("--parte")) {
  // Trabajador: renderiza su tramo de fotogramas a un vídeo sin sonido.
  const i = +val("--parte"), n = +val("--de");
  const desde = Math.floor((total * i) / n), hasta = Math.floor((total * (i + 1)) / n);
  const { navegador, pag } = await abrir();
  const ff = spawn("ffmpeg", ["-v", "error", "-y", "-f", "image2pipe", "-framerate", String(FPS), "-c:v", "mjpeg", "-i", "-",
    "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-pix_fmt", "yuv420p", "-r", String(FPS), path.join(dir, "render", `.parte-${i}.mp4`)],
    { stdio: ["pipe", "inherit", "inherit"] });
  for (let f = desde; f < hasta; f++) {
    await pag.evaluate((tt) => window.render(tt), f / FPS);
    const buf = await pag.screenshot({ type: "jpeg", quality: 93 });
    if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once("drain", r));
    if ((f - desde) % 100 === 0) console.log(`parte ${i}: ${f - desde}/${hasta - desde}`);
  }
  ff.stdin.end();
  await new Promise((r) => ff.on("close", r));
  await navegador.close();
  process.exit(process.exitCode || 0);
}

// Principal: reparte el trabajo, une las partes y añade el sonido.
writeFileSync(ficheroHtml, html);
const n = +val("--partes", 4), t0 = Date.now();
const codigos = await Promise.all(Array.from({ length: n }, (_, i) => new Promise((ok) => {
  spawn("node", [YO, id, "--parte", String(i), "--de", String(n)], { stdio: "inherit" }).on("close", ok);
})));
if (codigos.some((c) => c !== 0)) { console.error("Falló alguna parte:", codigos); process.exit(1); }
const lista = path.join(dir, "render", ".partes.txt");
writeFileSync(lista, Array.from({ length: n }, (_, i) => `file '.parte-${i}.mp4'`).join("\n"));
const salida = path.join(dir, "render", `${id}-${ESTILO}.mp4`);
await new Promise((ok) => spawn("ffmpeg", ["-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", lista, "-i", path.join(dir, "audio", "mezcla.wav"),
  "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-af", "loudnorm=I=-14:TP=-1.5:LRA=11", "-shortest", "-movflags", "+faststart", salida],
  { stdio: "inherit" }).on("close", ok));
for (let i = 0; i < n; i++) rmSync(path.join(dir, "render", `.parte-${i}.mp4`), { force: true });
rmSync(lista, { force: true });
console.log("vídeo", salida, `· ${((Date.now() - t0) / 1000).toFixed(0)} s`);
