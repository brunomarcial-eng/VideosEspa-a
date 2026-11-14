// Construye la página HTML de un Short (1080×1920) con window.render(t).
// Estilos B (cápsula, papel) y C (baraja) llevan títeres de recortes; A (pizarra) no.
// Las cifras de las tarjetas se comprueban contra la «pantalla» del guion de cada plano.

import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { pagina, sello as selloHTML } from "./escenas.mjs";
import { svgObjeto } from "./objetos.mjs";
import { titereSVG, DEFS_COLLAGE, CSS_TITERES } from "./titeres.mjs";

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const T = JSON.parse(readFileSync(path.join(AQUI, "tokens.json"), "utf8")).colores;
const RUNTIME = readFileSync(path.join(AQUI, "titeres_runtime.js"), "utf8");

const ROPA = { antes: [T.ocre, "#9C6E1F"], hoy: [T.azul, "#174A6C"] };

// ---------------------------------------------------------------- comprobaciones
function comprobarCifras(guion, direccion) {
  const fallos = [];
  for (const b of guion.beats) {
    const d = direccion.planos[String(b.n)];
    if (!d) continue;
    // Solo los textos que se ven: texto, valor, sub, nota, etq, desde, anyo
    const visibles = [];
    const recorrer = (o) => {
      if (Array.isArray(o)) return o.forEach(recorrer);
      if (o && typeof o === "object")
        for (const [k, v] of Object.entries(o)) {
          if (["texto", "valor", "sub", "nota", "etq", "desde", "anyo"].includes(k)) visibles.push(String(v));
          else recorrer(v);
        }
    };
    recorrer(d.tarjeta);
    const nums = visibles.join(" ").match(/\d+(?:,\d+)?/g) || [];
    for (const n of nums) {
      if (/^20\d\d$/.test(n)) continue;
      if (!(b.pantalla + " " + (b.nota || "")).includes(n))
        fallos.push(`plano ${b.n}: la tarjeta usa «${n}», que no está en la pantalla del guion`);
    }
  }
  if (fallos.length) throw new Error(fallos.join("\n"));
}

// ---------------------------------------------------------------- palabras con tiempos
function largoHablado(p) {
  return p.replace(/\d/g, "xxxx").replace(/[^\wáéíóúñü]/gi, "").length + 1;
}
function palabrasConTiempo(plano) {
  const toks = plano.texto.split(/\s+/).filter(Boolean);
  const ini = plano.palabras?.[0]?.ini ?? plano.ini;
  const fin = plano.palabras?.at(-1)?.fin ?? plano.fin;
  const pesos = toks.map(largoHablado);
  const total = pesos.reduce((a, b) => a + b, 0);
  let acc = 0;
  return toks.map((p, i) => {
    const t0 = ini + ((fin - ini) * acc) / total;
    acc += pesos[i];
    return { p, t0: +t0.toFixed(3) };
  });
}
function trozos(pals) {
  const out = []; let cur = [];
  pals.forEach((w, i) => {
    cur.push(i);
    const corte = /[.?!:;…]$/.test(w.p) || cur.length >= 6 || (/,$/.test(w.p) && cur.length >= 3);
    if (corte) { out.push(cur); cur = []; }
  });
  if (cur.length) out.push(cur);
  return out;
}

// ---------------------------------------------------------------- tarjetas
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");

function tarjetaHTML(estilo, t, n) {
  const papel = estilo === "C" ? "carta-papel" : "recorte-papel";
  const tono = (x) => (x === "pasado" ? "pasado" : x === "hoy" ? "hoy" : "tinta");
  switch (t.tipo) {
    case "pregunta":
      return `<div class="tarjeta ${papel} t-pregunta" style="left:80px;top:300px;width:920px">
        <div class="tp-texto">${esc(t.texto)}</div>${t.objeto ? `<div class="tp-obj">${svgObjeto(t.objeto, 230)}</div>` : ""}</div>`;
    case "cifra":
      return `<div class="tarjeta t-cifra" style="left:0;top:270px;width:1080px">
        ${t.previa ? `<div class="tc-previa t-pasado">${esc(t.previa.anyo)} · <span class="tachable">${esc(t.previa.valor)}<svg class="raya" viewBox="0 0 300 60" preserveAspectRatio="none"><path d="M6 46 C90 34 200 22 294 10"/></svg></span></div>` : ""}
        <div class="tc-anyo ${papel}">${esc(t.anyo)}</div>
        <div class="tc-ficha ficha-${tono(t.tono)}">${esc(t.valor)}</div>
        ${t.sub ? `<div class="tc-sub">${esc(t.sub)}</div>` : ""}
        ${t.nota ? `<div class="tc-nota">${esc(t.nota)}</div>` : ""}</div>`;
    case "dos":
      return `<div class="tarjeta t-dos" style="left:40px;top:280px;width:1000px">
        ${[t.a, t.b].map((x) => `<div class="td-col"><div class="tc-anyo ${papel}">${esc(x.anyo)}</div>
          <div class="td-ficha ficha-${tono(x.tono)}">${esc(x.valor)}</div></div>`).join('<div class="td-flecha">→</div>')}
        ${t.sub ? `<div class="tc-sub" style="width:100%;text-align:center">${esc(t.sub)}</div>` : ""}</div>`;
    case "barras2": {
      const max = Math.max(...t.filas.map((f) => f.num));
      return `<div class="tarjeta t-barras2" style="left:80px;top:290px;width:920px">
        ${t.filas.map((f, i) => `<div class="tb-etq">${esc(f.etq)}</div>
          <div class="tb-fila"><div class="tb-barra ficha-${tono(f.tono)} crece" data-ancho="${Math.round((f.num / max) * 640)}"></div>
          <div class="tb-valor">${esc(f.valor)}</div></div>`).join("")}
        <div class="tb-desde">${esc(t.desde || "")}</div></div>`;
    }
    case "grafico3": {
      const escala = Math.max(16, ...t.barras.map((b) => b.num * 1.1));
      const alto = (v) => Math.round((v / escala) * 380);
      return `<div class="tarjeta t-grafico3" style="left:110px;top:250px;width:860px;height:520px">
        ${t.barras.map((b, i) => `<div class="tg-col" style="left:${40 + i * 280}px">
          <div class="tg-valor t-${tono(b.tono)}" style="bottom:${alto(b.num) + 70}px">${esc(b.texto)}</div>
          <div class="tg-barra ficha-${tono(b.tono)} crece-alto" data-alto="${alto(b.num)}" style="bottom:62px"></div>
          <div class="tg-anyo">${esc(b.anyo)}</div></div>`).join("")}
        <div class="tg-base"></div></div>`;
    }
    case "cierre":
      return `<div class="tarjeta t-cierre" style="left:0;top:250px;width:1080px">
        ${["MEJORA", "EMPEORA", "DEPENDE"].map((p, i) => {
          const m = (t.marcas || []).find((x) => x.palabra === p);
          return `<div class="tq ${papel} ${t.marcar === p || m ? "tq-marcada" : ""}" style="top:${i * 172}px">${p}${m ? `<span class="tq-por">${esc(m.texto)}</span>` : ""}</div>`;
        }).join("")}</div>`;
    default:
      return "";
  }
}

// ---------------------------------------------------------------- CSS de vídeo
function cssVideo(estilo) {
  const ink = estilo === "A" ? T.texto_pizarra : T.texto_papel;
  return `
${CSS_TITERES}
.tarjeta{position:absolute;display:none;transform-origin:50% 40%}
.recorte-papel{background:#FBF7EE;filter:url(#recorte1)}
.carta-papel{background:#FBF7EE;border:5px solid ${T.texto_papel};border-radius:26px;box-shadow:10px 12px 0 rgba(30,30,30,.2)}
.ficha-pasado{background:${T.ocre};color:${T.texto_papel}}
.ficha-hoy{background:${T.azul};color:${T.papel}}
.ficha-tinta{background:${T.gris};color:${T.papel}}
.t-pasado{color:${estilo === "A" ? T.ocre : T.ocre_texto_papel}} .t-hoy{color:${estilo === "A" ? T.azul_tiza : T.azul}} .t-tinta{color:${ink}}
.t-pregunta{padding:44px 50px;transform:rotate(-1.5deg)}
.tp-texto{font:900 84px/1.04 Fraunces;color:${T.texto_papel}}
.tp-obj{display:flex;justify-content:flex-end;margin-top:-10px}
.t-cifra{display:none;text-align:center}
.tc-anyo{display:inline-block;padding:8px 34px 12px;font:700 60px Plex;color:${T.texto_papel};transform:rotate(-3deg)}
.carta-papel.tc-anyo{border-width:4px}
.tc-ficha{margin:18px auto 0;display:table;padding:2px 46px 12px;border-radius:18px;font:700 170px/1.05 Plex;filter:url(#recorte2)}
.tc-sub{margin-top:10px;font:700 46px Fraunces;color:${ink}}
.tc-nota{margin:10px auto 0;width:940px;font:600 28px/1.3 Plex;color:${estilo === "A" ? T.gris_tiza : T.gris_texto_papel}}
.t-barras2 .tb-etq{font:700 44px/1.1 Fraunces;color:${ink};margin:28px 0 12px}
.tb-fila{display:flex;align-items:center;gap:24px}
.tb-barra{height:96px;border-radius:10px;filter:url(#recorte2);width:0}
.tb-valor{font:700 74px Plex;color:${ink}}
.tb-desde{margin-top:26px;font:600 34px Plex;color:${estilo === "A" ? T.gris_tiza : T.gris_texto_papel}}
.tg-col{position:absolute;top:0;width:200px;height:520px}
.tg-barra{position:absolute;left:20px;width:160px;height:0;filter:url(#recorte2)}
.tg-valor{position:absolute;left:-30px;width:260px;text-align:center;font:700 62px Plex}
.tg-anyo{position:absolute;bottom:0;width:200px;text-align:center;font:700 50px Plex;color:${ink}}
.tg-base{position:absolute;left:20px;right:20px;bottom:60px;height:6px;background:${ink}}
.t-cierre{height:560px}
.tq{position:absolute;left:260px;width:560px;height:140px;display:flex;align-items:center;justify-content:center;
  font:900 74px Fraunces;color:${T.gris_texto_papel};opacity:.8}
.tq-marcada{color:${T.texto_papel};opacity:1;flex-direction:column}
.tq-por{display:block;font:600 30px Plex;color:${estilo === "A" ? T.gris_tiza : T.gris_texto_papel};margin-top:-4px}
.t-dos{text-align:center}
.td-col{display:flex;flex-direction:row;justify-content:center;align-items:center;gap:26px;margin:0 0 30px}
.td-col .tc-anyo{min-width:170px}
.td-ficha{padding:4px 28px 10px;border-radius:16px;font:700 76px/1.1 Plex;filter:url(#recorte2)}
.td-flecha{display:none}
.sello-v{position:absolute;left:0;top:0;display:none}
.sello-v .sello{top:792px}
#bocadillo{position:absolute;top:915px;width:860px;padding:22px 34px 26px;background:#FBF7EE;filter:url(#recorte1);
  font:700 48px/1.14 Fraunces;color:${T.gris_texto_papel};display:none}
#bocadillo::after{content:"";position:absolute;bottom:-36px;border-left:26px solid transparent;border-right:26px solid transparent;border-top:40px solid #FBF7EE}
#bocadillo.izq{left:50px} #bocadillo.izq::after{left:120px}
#bocadillo.der{left:170px} #bocadillo.der::after{right:120px}
#bocadillo .dicha{color:${T.texto_papel}}
#bocadillo .ahora{color:${T.texto_papel};text-decoration:underline;text-decoration-thickness:6px;text-underline-offset:8px}
#bocadillo.antes .ahora{text-decoration-color:${T.ocre}} #bocadillo.hoy .ahora{text-decoration-color:${T.azul}}
.etq-anyo{position:absolute;top:1092px;display:none;padding:2px 22px 6px;font:700 44px Plex;filter:url(#recorte3)}
.decor{position:absolute;filter:url(#recorte3);opacity:.9}
${estilo === "C" ? CSS_C : ""}${estilo === "A" ? CSS_A : ""}`;
}

// Estilo C: tarjetas y bocadillo con forma de carta; los títeres van dentro de cartas.
const CSS_C = `
#bocadillo{filter:none;background:#FBF7EE;border:5px solid ${T.texto_papel};border-radius:26px;box-shadow:8px 10px 0 rgba(30,30,30,.18)}
#bocadillo::after{border-top-color:${T.texto_papel};bottom:-42px}
.etq-anyo{display:none !important}
.tc-ficha{filter:none;border:5px solid ${T.texto_papel};box-shadow:8px 10px 0 rgba(30,30,30,.2)}
.tb-barra,.tg-barra{filter:none;border:5px solid ${T.texto_papel}}
.td-ficha{filter:none;border:5px solid ${T.texto_papel};box-shadow:6px 8px 0 rgba(30,30,30,.2)}
.tb-barra.ficha-pasado,.tg-barra.ficha-pasado{background:repeating-linear-gradient(45deg,${T.ocre} 0 6px,#FBF7EE 6px 12px)}
.tb-barra.ficha-hoy,.tg-barra.ficha-hoy{background:repeating-linear-gradient(-45deg,${T.azul} 0 6px,#FBF7EE 6px 12px)}
.tb-barra.ficha-tinta{background:repeating-linear-gradient(45deg,${T.gris} 0 6px,#FBF7EE 6px 12px)}
.tq{width:300px;height:400px;font-size:48px}
.t-cierre .tq:nth-child(1){left:40px;top:90px !important} .t-cierre .tq:nth-child(2){left:390px;top:70px !important}
.t-cierre .tq:nth-child(3){left:740px;top:90px !important}`;

// Estilo A: todo escrito con tiza; sin papel, sin personas.
const CSS_A = `
.estilo-A .tarjeta{filter:url(#tiza)}
.estilo-A .recorte-papel,.estilo-A .carta-papel{background:none;filter:none;border:0;box-shadow:none}
.estilo-A .tp-texto{font:110px/1.02 Mano;color:${T.texto_pizarra}}
.estilo-A .tp-obj .obj .l{stroke:${T.texto_pizarra};stroke-width:6;fill:none}
.estilo-A .tp-obj .obj .f,.estilo-A .tp-obj .obj .f3{fill:none} .estilo-A .tp-obj .obj .f2{fill:url(#rayado-tiza);opacity:.5}
.estilo-A .tc-anyo{font:84px Mano;color:${T.texto_pizarra};padding:0}
.estilo-A .tc-ficha{background:none !important;filter:none;font:230px/1 Mano;padding:0 20px}
.estilo-A .tc-ficha.ficha-pasado{color:${T.ocre}} .estilo-A .tc-ficha.ficha-hoy{color:${T.azul_tiza}}
.estilo-A .tc-sub{font:60px Mano;color:${T.texto_pizarra}}
.estilo-A .tc-nota{font:34px/1.05 Mano;color:${T.gris_tiza}}
.estilo-A .sello-v .sello{top:870px}
.estilo-A .tc-previa{font:76px Mano;margin-bottom:6px}
.tachable{position:relative;display:inline-block}
.raya{position:absolute;left:-8%;top:-10%;width:116%;height:120%;overflow:visible}
.raya path{fill:none;stroke:${T.texto_pizarra};stroke-width:10;stroke-linecap:round;stroke-dasharray:400;stroke-dashoffset:400}
.estilo-A .tb-etq{font:60px/1.05 Mano;color:${T.texto_pizarra}}
.estilo-A .tb-valor{font:96px Mano;color:${T.texto_pizarra}}
.estilo-A .tb-desde{font:48px Mano}
.estilo-A .tb-barra,.estilo-A .tg-barra{filter:none;border:7px solid currentColor;background:none !important}
.estilo-A .tb-barra.ficha-tinta,.estilo-A .tg-barra.ficha-tinta{color:${T.texto_pizarra};background:repeating-linear-gradient(35deg,rgba(244,237,224,.55) 0 5px,transparent 5px 16px) !important}
.estilo-A .tb-barra.ficha-pasado,.estilo-A .tg-barra.ficha-pasado{color:${T.ocre};background:repeating-linear-gradient(35deg,${T.ocre} 0 5px,transparent 5px 16px) !important}
.estilo-A .tb-barra.ficha-hoy,.estilo-A .tg-barra.ficha-hoy{color:${T.azul_tiza};background:repeating-linear-gradient(35deg,${T.azul_tiza} 0 5px,transparent 5px 16px) !important}
.estilo-A .tg-valor{font:84px Mano} .estilo-A .tg-anyo{font:68px Mano}
.estilo-A .tg-base{height:8px;border-radius:4px}
.estilo-A .tq{font:120px Mano;color:${T.gris_tiza};opacity:1;background:none;filter:none;border:0}
.estilo-A .tq-marcada{color:${T.texto_pizarra};border-radius:50% !important}
#pizarra-dialogo{position:absolute;left:70px;top:1030px;width:940px;display:none;filter:url(#tiza)}
#pizarra-dialogo .quien{font:64px Mano}
#pizarra-dialogo .linea{font:84px/1.04 Mano;color:${T.gris_tiza}}
#pizarra-dialogo .linea .dicha,#pizarra-dialogo .linea .ahora{color:${T.texto_pizarra}}
#pizarra-dialogo .linea .ahora{text-decoration:underline;text-decoration-thickness:6px;text-underline-offset:10px}
#pizarra-dialogo.antes .quien,#pizarra-dialogo.antes .ahora{color:${T.ocre};text-decoration-color:${T.ocre}}
#pizarra-dialogo.hoy .quien,#pizarra-dialogo.hoy .ahora{color:${T.azul_tiza};text-decoration-color:${T.azul_tiza}}
.estilo-A #bocadillo{display:none !important}
.estilo-A .td-ficha{background:none !important;filter:none;font:120px/1 Mano}
.estilo-A .td-ficha.ficha-pasado{color:${T.ocre}} .estilo-A .td-ficha.ficha-hoy{color:${T.azul_tiza}}
.estilo-A .td-flecha{font:90px Mano} .estilo-A .tq-por{font:44px Mano}`;

// ---------------------------------------------------------------- página
export function construirPagina({ estilo, guion, linea, direccion }) {
  comprobarCifras(guion, direccion);
  const conTiteres = estilo !== "A";
  const beats = guion.beats.map((b) => {
    const p = linea.planos.find((x) => x.n === b.n);
    const d = direccion.planos[String(b.n)] || {};
    const pals = palabrasConTiempo(p);
    return { n: b.n, quien: b.quien, ini: p.ini, fin: p.fin, env: p.env, sello: d.sello ? b.sello : null,
      tarjeta: d.tarjeta || { tipo: "mantener" }, actores: d.actores || {}, pals, trozos: trozos(pals) };
  });

  // Tarjeta visible por plano («mantener» = la anterior)
  let ultima = null;
  beats.forEach((b) => { if (b.tarjeta.tipo !== "mantener") ultima = b.n; b.tarjetaDe = ultima; });

  // Pizarra: la cifra de hoy tacha la del pasado que acaba de salir (la firma del estilo A)
  if (estilo === "A") {
    let previa = null;
    beats.forEach((b) => {
      const t = b.tarjeta;
      if (t.tipo !== "cifra") return;
      if (t.tono === "hoy" && previa) b.tarjeta = { ...t, previa };
      if (t.tono === "pasado" && /\d/.test(t.valor)) previa = { anyo: t.anyo, valor: t.valor };
    });
  }

  const tarjetas = beats.filter((b) => b.tarjeta.tipo !== "mantener")
    .map((b) => tarjetaHTML(estilo, b.tarjeta, b.n).replace('class="tarjeta', `id="tarjeta-${b.n}" class="tarjeta`)).join("");
  const sellos = beats.filter((b) => b.sello)
    .map((b) => `<div class="sello-v" id="sello-${b.n}">${selloHTML(b.sello.replace(/^(DATO OFICIAL|CÁLCULO PROPIO \(C\))/, "<b>$1</b>"))}</div>`).join("");

  // Títeres (B: sueltos; C: pegados dentro de dos cartas)
  const S = estilo === "C" ? 0.8 : 0.95;
  const pos = estilo === "C"
    ? { antes: { x: 40, y: 1130, espejo: false }, hoy: { x: 560, y: 1130, espejo: true } }
    : { antes: { x: -70, y: 1000, espejo: false }, hoy: { x: 1080 - 600 * S + 70, y: 1000, espejo: true } };
  const CARTAS = { antes: { x: 38, y: 1110, rot: -3 }, hoy: { x: 562, y: 1120, rot: 3 } };
  const titere = (q, p) => titereSVG({
    id: `pj-${q}`, genero: p.genero, epoca: q, piel: direccion.personajes[q].piel, pelo: direccion.personajes[q].pelo,
    ropa: ROPA[q][0], ropaOscura: ROPA[q][1] });
  const enCarta = (q, p) => {
    const c = CARTAS[q], w = 480, h = 760;
    const tr = `rotate(${c.rot} ${c.x + w / 2} ${c.y + h / 2})`;
    const color = q === "antes" ? T.ocre_texto_papel : T.azul;
    const indice = q === "antes" ? guion.personajes.antes.anyo : "HOY";
    return `<clipPath id="clip-carta-${q}"><rect x="${c.x}" y="${c.y}" width="${w}" height="${h}" rx="30" transform="${tr}"/></clipPath>
      <g id="carta-${q}" style="display:none">
        <rect x="${c.x + 10}" y="${c.y + 12}" width="${w}" height="${h}" rx="30" fill="rgba(30,30,30,.2)" transform="${tr}"/>
        <rect x="${c.x}" y="${c.y}" width="${w}" height="${h}" rx="30" fill="#FBF7EE" transform="${tr}"/>
        <g clip-path="url(#clip-carta-${q})">
          <rect x="${c.x}" y="${c.y}" width="${w}" height="${h}" fill="url(#trama-${q === "antes" ? "ocre" : "azul"})" opacity=".18" transform="${tr}"/>
          ${titere(q, p)}</g>
        <rect x="${c.x}" y="${c.y}" width="${w}" height="${h}" rx="30" fill="none" stroke="${T.texto_papel}" stroke-width="6" transform="${tr}"/>
        <rect x="${c.x + 14}" y="${c.y + 14}" width="${w - 28}" height="${h - 28}" rx="20" fill="none" stroke="${T.texto_papel}" stroke-width="2" transform="${tr}"/>
        <text x="${c.x + 34}" y="${c.y + 70}" transform="${tr}" font-family="Plex" font-weight="700" font-size="44" fill="${color}">${indice}</text>
      </g>`;
  };
  const titeres = !conTiteres ? "" : Object.entries(guion.personajes)
    .map(([q, p]) => (estilo === "C" ? enCarta(q, p) : titere(q, p))).join("");
  const etiquetas = conTiteres ? `
    <div class="etq-anyo ficha-pasado" id="etq-antes" style="left:130px">${esc(guion.personajes.antes.anyo)}</div>
    <div class="etq-anyo ficha-hoy" id="etq-hoy" style="left:830px">HOY</div>` : "";

  const decor = estilo === "B" ? `
    <div class="decor" style="left:-40px;top:120px;width:360px;height:70px;background:url(#x);background:#ECE6DA;transform:rotate(-4deg)"></div>
    <div class="decor" style="left:820px;top:1720px;width:320px;height:90px;background:#E7DCC8;transform:rotate(5deg)"></div>` : "";

  const cuerpo = `
${decor}
<div id="tarjetas">${tarjetas}</div>
<div id="sellos">${sellos}</div>
<svg id="escena" class="abs" width="1080" height="1920" style="left:0;top:0;overflow:visible">${titeres}</svg>
${etiquetas}
<div id="bocadillo"></div>
${estilo === "A" ? `<div id="pizarra-dialogo"><div class="quien"></div><div class="linea"></div></div>
<div class="abs tiza" style="left:650px;top:1330px;opacity:.7">${svgObjeto("reloj", 280)}</div>
<div class="abs tiza" style="left:70px;top:1360px;opacity:.7">${svgObjeto("carrito", 300)}</div>` : ""}
<script>
const ESTILO = ${JSON.stringify(estilo)};
const NOMBRE = ${JSON.stringify({ antes: guion.personajes.antes.anyo, hoy: "Hoy" })};
${RUNTIME}
const BEATS = ${JSON.stringify(beats)};
const POS = ${JSON.stringify(pos)};
const S = ${S};
const CON_TITERES = ${conTiteres};
const SEMILLA = ${JSON.stringify(Object.fromEntries(Object.entries(direccion.personajes).map(([q, p]) => [q, p.semilla])))};
const FR = Titeres.FPS_RECORTE;
const q12 = (t) => Math.floor(t * FR) / FR;

function beatEn(t) { let k = 0; for (let i = 0; i < BEATS.length; i++) if (t >= BEATS[i].ini - 0.15) k = i; return k; }
function estadoActor(q, t, k) {
  let expr = "neutra", exprPrev = "neutra", tExpr = -9, gesto = "abajo", gestoPrev = "abajo", tGesto = -9, mirada = 1, aparece = null;
  for (let i = 0; i <= k; i++) {
    const a = BEATS[i].actores[q];
    if (!a) continue;
    if (aparece === null) aparece = BEATS[i].ini - 0.25;
    if (a.expr && a.expr !== expr) { exprPrev = expr; expr = a.expr; tExpr = BEATS[i].ini - 0.1; }
    const g = a.gesto || (BEATS[i].quien === q ? "explicar" : "abajo");
    if (g !== gesto) { gestoPrev = gesto; gesto = g; tGesto = BEATS[i].ini - 0.1; }
    mirada = a.mirada ?? 1;
    if (i < k && BEATS[i + 1] && !BEATS[i + 1].actores[q]) mirada = 1;
  }
  return { expr, exprPrev, kExpr: (t - tExpr) / 0.3, gesto, gestoPrev, kGesto: (t - tGesto) / 0.35, mirada, aparece };
}
function amp(b, t) {
  if (!b || t < b.ini || t > b.fin) return 0;
  const i = Math.floor((t - b.ini) * 30);
  return b.env[Math.min(b.env.length - 1, Math.max(0, i))] || 0;
}
function sello(t, b) {
  document.querySelectorAll(".sello-v").forEach((s) => (s.style.display = "none"));
  if (!b.sello) return;
  const el = document.getElementById("sello-" + b.n);
  const k = q12(t) - (b.ini + 0.35);
  if (k < 0) return;
  el.style.display = "block";
  const s = k < 0.09 ? 1.35 : k < 0.17 ? 0.94 : 1;
  el.firstElementChild.style.transform = "rotate(-1.2deg) scale(" + s + ")";
}
function tarjeta(t, b) {
  document.querySelectorAll(".tarjeta").forEach((x) => (x.style.display = "none"));
  if (b.tarjetaDe === null) return;
  const el = document.getElementById("tarjeta-" + b.tarjetaDe);
  const base = BEATS.find((x) => x.n === b.tarjetaDe);
  const k = q12(t) - (base.ini - 0.15);
  el.style.display = "block";
  const r = Titeres.azar(base.n, Math.floor(t * FR)) * 0.5;
  const s = k < 0.09 ? 1.18 : k < 0.17 ? 0.97 : 1;
  const rot = (k < 0.17 ? Titeres.azar(base.n, 1) * 4 : 0) + r;
  el.style.transform = (el.dataset.base || "") + " scale(" + s + ") rotate(" + rot.toFixed(2) + "deg)";
  const crece = Math.min(1, Math.max(0, (k - 0.25) / 0.8));
  const kq = Math.floor(crece * 10) / 10;
  el.querySelectorAll(".crece").forEach((x) => (x.style.width = (x.dataset.ancho * kq) + "px"));
  el.querySelectorAll(".crece-alto").forEach((x, i) => {
    const ki = Math.min(1, Math.max(0, (k - 0.25 - i * 0.35) / 0.6));
    x.style.height = (x.dataset.alto * Math.floor(ki * 10) / 10) + "px";
  });
  el.querySelectorAll(".tg-valor").forEach((x, i) => { x.style.opacity = (k - 0.25 - i * 0.35) > 0.6 ? 1 : 0; });
  el.querySelectorAll(".tb-valor").forEach((x) => { x.style.opacity = crece >= 1 ? 1 : 0; });
  el.querySelectorAll(".tq-marcada").forEach((x) => {
    const km = k - 0.3;
    const sm = km < 0 ? 1 : km < 0.09 ? 1.3 : km < 0.17 ? 1.05 : 1.12;
    x.style.transform = (ESTILO === "C" ? "translateY(" + (km < 0 ? 0 : -60) + "px) " : "rotate(-2deg) ") + "scale(" + sm + ")";
    x.style.border = km < 0 ? "" : (ESTILO === "A" ? "9px solid ${T.texto_pizarra}" : "9px solid ${T.texto_papel}");
  });
  if (ESTILO === "A") {
    // Tiza: el texto se escribe de izquierda a derecha y la cifra vieja se tacha
    const kw = Math.min(1, Math.max(0, k / 0.7));
    el.style.clipPath = "inset(0 " + ((1 - Math.floor(kw * 12) / 12) * 100).toFixed(1) + "% 0 0)";
    el.querySelectorAll(".raya path").forEach((p) => {
      const kr = Math.min(1, Math.max(0, (k - 0.15) / 0.35));
      p.style.strokeDashoffset = (400 * (1 - Math.floor(kr * 8) / 8)).toFixed(0);
    });
  }
}
function pizarraDialogo(t, b) {
  const el = document.getElementById("pizarra-dialogo");
  if (t < b.ini - 0.05 || t > b.fin + 0.4) { el.style.display = "none"; return; }
  let tz = 0;
  for (let i = 0; i < b.trozos.length; i++) if (b.pals[b.trozos[i][0]].t0 <= t + 0.05) tz = i;
  el.className = b.quien;
  el.querySelector(".quien").textContent = NOMBRE[b.quien] + ":";
  el.querySelector(".linea").innerHTML = b.trozos[tz].map((i) => {
    const w = b.pals[i], sig = b.pals[i + 1];
    const cls = w.t0 <= t ? ((sig && sig.t0 <= t) || t > b.fin ? "dicha" : "ahora") : "";
    return '<span class="' + cls + '">' + w.p + "</span>";
  }).join(" ");
  el.style.display = "block";
}
function bocadillo(t, b) {
  const el = document.getElementById("bocadillo");
  if (t < b.ini - 0.05 || t > b.fin + 0.4) { el.style.display = "none"; return; }
  let tz = 0;
  for (let i = 0; i < b.trozos.length; i++) if (b.pals[b.trozos[i][0]].t0 <= t + 0.05) tz = i;
  const idx = b.trozos[tz];
  el.className = (b.quien === "antes" ? "izq " : "der ") + b.quien;
  el.innerHTML = idx.map((i) => {
    const w = b.pals[i], sig = b.pals[i + 1];
    const cls = w.t0 <= t ? ((sig && sig.t0 <= t) || t > b.fin ? "dicha" : "ahora") : "";
    return '<span class="' + cls + '">' + w.p + "</span>";
  }).join(" ");
  el.style.display = "block";
  const j = Titeres.azar(b.n, Math.floor(t * FR));
  el.style.transform = "rotate(" + (j * 0.6).toFixed(2) + "deg)";
}
window.render = function (t) {
  const k = beatEn(t);
  const b = BEATS[k];
  tarjeta(t, b);
  sello(t, b);
  if (ESTILO === "A") { pizarraDialogo(t, b); return; }
  bocadillo(t, b);
  if (!CON_TITERES) return;
  for (const q of ["antes", "hoy"]) {
    const e = estadoActor(q, t, k);
    const visible = e.aparece !== null && t >= e.aparece;
    const habla = b.quien === q && t >= b.ini && t <= b.fin;
    const otro = b.quien !== q ? amp(b, t) : 0;
    const otroVisible = (() => { const o = estadoActor(q === "antes" ? "hoy" : "antes", t, k); return o.aparece !== null && t >= o.aparece; })();
    let entrada = visible ? (t - e.aparece) / 0.5 : 0;
    const carta = document.getElementById("carta-" + q);
    if (carta) {
      // En la baraja entra la carta entera (con su figura dentro), repartida desde abajo
      carta.style.display = visible ? "" : "none";
      const kc = Titeres.suave(Math.min(1, Math.max(0, Math.floor(entrada * 6) / 6)));
      const jj = Titeres.azar(SEMILLA[q] * 7, Math.floor(t * FR));
      carta.setAttribute("transform", "translate(" + (jj * 1.2).toFixed(1) + " " + ((1 - kc) * 900).toFixed(0) + ") rotate(" + ((1 - kc) * (q === "antes" ? -12 : 12)).toFixed(1) + " 540 1500)");
      entrada = 1;
    }
    Titeres.actualizar("pj-" + q, { ...POS[q], s: S, t, visible, entrada,
      hablando: habla, amp: habla ? amp(b, t) : 0, ampOtro: otro, expr: e.expr, exprPrev: e.exprPrev, kExpr: e.kExpr,
      gesto: e.gesto, gestoPrev: e.gestoPrev, kGesto: e.kGesto, mirada: otroVisible ? e.mirada : 0, semilla: SEMILLA[q] });
    const etq = document.getElementById("etq-" + q);
    if (etq) {
      etq.style.display = visible && (t - e.aparece) > 0.4 ? "block" : "none";
      const jj = Titeres.azar(SEMILLA[q] * 13, Math.floor(t * FR));
      etq.style.transform = "rotate(" + ((q === "antes" ? -4 : 3) + jj * 0.8).toFixed(2) + "deg)";
    }
  }
};
</script>`;
  return pagina(estilo, cuerpo, cssVideo(estilo), DEFS_COLLAGE);
}
