// Portada de un vídeo: un fotograma del render, sin subtítulo y SIEMPRE con el sello «SOLO DATOS OFICIALES»
// (Bruno, 22-11-2026: el sello va en el primer plano de cada vídeo y en la portada; es la señal del canal).
//   node scripts/portada.cjs t16 64.5 upload/t16-portada.png [--sello x,y,escala,giro]
// Toma videos/<id>/render/<id>-historia.html (lo deja render_historia.mjs). El sello se copia del primer plano
// (el elemento cuyo id acaba en «-sello») y se pinta encima de todo, por defecto abajo, donde iría el subtítulo.
const path = require("path");
const { chromium } = require("playwright");

(async () => {
  const [id, t, salida, ...resto] = process.argv.slice(2);
  if (!id || t === undefined || !salida) { console.error("uso: node scripts/portada.cjs <id> <segundo> <salida.png> [--sello x,y,escala,giro]"); process.exit(2); }
  const i = resto.indexOf("--sello");
  const [x, y, s, r] = (i >= 0 ? resto[i + 1] : "540,1640,1.15,-8").split(",").map(Number);
  const html = path.resolve(__dirname, "..", "videos", id, "render", `${id}-historia.html`);
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  await p.goto("file://" + html);
  await p.evaluate(() => Promise.all(["600 20px Cap", "800 20px Cap"].map((f) => document.fonts.load(f))));
  const ok = await p.evaluate(([tt, x, y, s, r]) => {
    window.render(tt);
    const sub = document.getElementById("sub"); if (sub) sub.style.display = "none";
    const orig = document.querySelector('[id$="-sello"]');
    if (!orig) return false;
    // copia con ids nuevos (la máscara de agujeros va por id) en una capa SVG por encima de todo
    const capa = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    capa.setAttribute("viewBox", "0 0 1080 1920");
    Object.assign(capa.style, { position: "fixed", left: "0", top: "0", width: "1080px", height: "1920px", zIndex: "99999", pointerEvents: "none" });
    capa.innerHTML = orig.outerHTML.replaceAll(orig.id, "portada-sello");
    const g = capa.firstElementChild;
    g.style.display = "inline";
    g.setAttribute("transform", `translate(${x} ${y}) rotate(${r}) scale(${s})`);
    g.style.transform = "";
    document.body.appendChild(capa);
    return true;
  }, [+t, x, y, s, r]);
  if (!ok) { console.error("no encuentro el sello (¿el primer plano llama a selloOficial()?)"); await b.close(); process.exit(1); }
  await p.screenshot({ path: salida });
  await b.close();
  console.log("portada", salida);
})();
