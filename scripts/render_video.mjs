#!/usr/bin/env node
// Renderiza un Short: página HTML con render(t) -> fotogramas con Chromium -> ffmpeg con la voz.
// Uso: node scripts/render_video.mjs <id> <estilo A|B|C> [--desde s] [--hasta s] [--fotograma s]
//   --fotograma s  : solo guarda un PNG de ese instante (para revisar)
// Salida: videos/<id>/render/<id>-<estilo>.mp4

import { createRequire } from "node:module";
import { spawn } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { construirPagina } from "../diseno/video.mjs";

const { chromium } = createRequire(import.meta.url)("playwright");
const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const [id, estilo] = process.argv.slice(2);
const arg = (n, d) => { const i = process.argv.indexOf(n); return i > 0 ? +process.argv[i + 1] : d; };

const dir = path.join(RAIZ, "videos", id);
const guion = JSON.parse(readFileSync(path.join(dir, "guion.json"), "utf8"));
const linea = JSON.parse(readFileSync(path.join(dir, "audio", "linea_tiempo.json"), "utf8"));
const direccion = JSON.parse(readFileSync(path.join(dir, "direccion.json"), "utf8"));
const FPS = 30;

const html = construirPagina({ estilo, guion, linea, direccion });
mkdirSync(path.join(dir, "render"), { recursive: true });
const ficheroHtml = path.join(dir, "render", `${id}-${estilo}.html`);
writeFileSync(ficheroHtml, html);

const navegador = await chromium.launch();
const pag = await navegador.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
pag.on("pageerror", (e) => { console.error("Error en la página:", e.message); process.exitCode = 1; });
await pag.goto("file://" + ficheroHtml);
await pag.evaluate(() => document.fonts.ready);

const unico = arg("--fotograma", null);
if (unico !== null) {
  await pag.evaluate((t) => window.render(t), unico);
  const png = path.join(dir, "render", `${id}-${estilo}-t${unico}.png`);
  await pag.screenshot({ path: png });
  console.log("fotograma", png);
  await navegador.close();
  process.exit(process.exitCode || 0);
}

const desde = arg("--desde", 0), hasta = arg("--hasta", linea.duracion);
const n = Math.round((hasta - desde) * FPS);
const salida = path.join(dir, "render", `${id}-${estilo}${desde || hasta < linea.duracion ? `-prueba` : ""}.mp4`);
const voz = existsSync(path.join(dir, "audio", "mezcla.wav")) ? path.join(dir, "audio", "mezcla.wav") : path.join(dir, "audio", "voz.wav");
const ff = spawn("ffmpeg", ["-v", "error", "-y", "-f", "image2pipe", "-framerate", String(FPS), "-c:v", "mjpeg", "-i", "-",
  "-ss", String(desde), "-t", String(hasta - desde), "-i", voz,
  "-c:v", "libx264", "-preset", "medium", "-crf", "19", "-pix_fmt", "yuv420p", "-r", String(FPS),
  "-c:a", "aac", "-b:a", "160k", "-af", "loudnorm=I=-14:TP=-1.5:LRA=11", "-shortest", "-movflags", "+faststart", salida],
  { stdio: ["pipe", "inherit", "inherit"] });

const t0 = Date.now();
for (let i = 0; i < n; i++) {
  const t = desde + i / FPS;
  await pag.evaluate((tt) => window.render(tt), t);
  const buf = await pag.screenshot({ type: "jpeg", quality: 92 });
  if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once("drain", r));
  if (i % 150 === 0) console.log(`fotograma ${i}/${n} · ${((Date.now() - t0) / 1000).toFixed(0)} s`);
}
ff.stdin.end();
await new Promise((r) => ff.on("close", r));
await navegador.close();
console.log("vídeo", salida, `· ${((Date.now() - t0) / 1000).toFixed(0)} s`);
