// Títeres de recortes (collage) para los estilos B y C.
// Cada personaje es un muñeco de papel articulado: cuerpo, cuello, cabeza (pelo detrás,
// cara, pelo delante) y una mano que gesticula. Cada pieza tiene borde de papel rasgado
// y sombra sobre la de debajo (filtros #recorte1-3), y la cara lleva trama de imprenta
// para dar volumen. El movimiento lo pone titeres_runtime.js.
// Diseño propio: personas genéricas, inventadas, que no representan a nadie real.

const TINTA = "#2B201A";

// ------------------------------------------------------------------ piezas de cara
const CARA = {
  mujer: {
    cara: "M300 180 C392 180 432 250 430 330 C428 405 392 468 300 480 C208 468 172 405 170 330 C168 250 208 180 300 180 Z",
    orejas: [[172, 342, 20, 32], [428, 342, 20, 32]],
    ojos: [245, 355], ojoY: 325, cejaY: 274, bocaY: 425,
  },
  hombre: {
    cara: "M300 172 C400 172 442 244 442 330 C442 412 406 480 300 490 C194 480 158 412 158 330 C158 244 200 172 300 172 Z",
    orejas: [[160, 338, 24, 36], [440, 338, 24, 36]],
    ojos: [243, 357], ojoY: 322, cejaY: 268, bocaY: 428,
  },
};

const PELO = {
  "mujer-antes": {
    atras: `<path d="M300 148 C186 148 136 230 142 332 C148 440 116 530 150 606 C204 628 236 560 234 480 L366 480 C364 560 396 628 450 606 C484 530 452 440 458 332 C464 230 414 148 300 148 Z"/>`,
    delante: `<path d="M168 334 C156 230 220 160 306 160 C392 160 444 220 434 306 C414 252 374 224 332 230 C300 246 248 256 212 302 C194 324 184 344 168 334 Z"/>
      <path class="brillo" d="M246 196 C286 178 340 176 384 196" />`,
  },
  "mujer-hoy": {
    atras: `<circle cx="300" cy="150" r="54"/>`,
    delante: `<path d="M170 322 C162 226 218 168 300 168 C382 168 438 226 430 322 C412 252 362 222 300 222 C238 222 188 252 170 322 Z"/>
      <path class="canas" d="M334 176 C370 188 400 214 414 252"/>`,
  },
  "hombre-antes": {
    atras: "",
    delante: `<path d="M158 322 C146 220 208 156 300 154 C396 154 452 214 442 316 C430 272 412 246 384 236 C364 254 334 246 318 228 C292 250 252 246 232 230 C202 248 178 274 158 322 Z"/>
      <path class="brillo" d="M232 186 C272 170 330 168 372 184"/>`,
  },
  "hombre-hoy": {
    atras: "",
    delante: `<path d="M162 304 C158 216 214 166 300 164 C386 166 442 216 438 304 C426 270 406 248 376 240 C350 226 322 222 300 228 C278 222 250 226 224 240 C194 248 174 270 162 304 Z"/>
      <path class="canas" d="M166 300 C164 276 170 256 182 240"/><path class="canas" d="M434 300 C436 276 430 256 418 240"/>`,
  },
};

const BOCAS = (y) => `
  <g data-boca="cerrada"><path d="M264 ${y} Q300 ${y + 14} 336 ${y}" fill="none" stroke="#7A3E2E" stroke-width="7" stroke-linecap="round"/></g>
  <g data-boca="sonrisa"><path d="M256 ${y - 8} Q300 ${y + 36} 344 ${y - 8} Q300 ${y + 10} 256 ${y - 8} Z" fill="#5A2A22"/>
     <path d="M266 ${y - 4} Q300 ${y + 8} 334 ${y - 4} L330 ${y + 4} Q300 ${y + 14} 270 ${y + 4} Z" fill="#FBF7EE"/></g>
  <g data-boca="media"><path d="M266 ${y - 6} Q300 ${y + 2} 334 ${y - 6} Q326 ${y + 24} 300 ${y + 26} Q274 ${y + 24} 266 ${y - 6} Z" fill="#5A2A22"/>
     <path d="M272 ${y - 4} Q300 ${y + 2} 328 ${y - 4} L326 ${y + 3} Q300 ${y + 8} 274 ${y + 3} Z" fill="#FBF7EE"/></g>
  <g data-boca="abierta"><path d="M262 ${y - 12} Q300 ${y - 4} 338 ${y - 12} Q330 ${y + 42} 300 ${y + 46} Q270 ${y + 42} 262 ${y - 12} Z" fill="#5A2A22"/>
     <path d="M270 ${y - 10} Q300 ${y - 4} 330 ${y - 10} L328 ${y - 1} Q300 ${y + 5} 272 ${y - 1} Z" fill="#FBF7EE"/>
     <ellipse cx="300" cy="${y + 32}" rx="20" ry="9" fill="#C0675A"/></g>
  <g data-boca="O"><ellipse cx="300" cy="${y + 6}" rx="17" ry="24" fill="#5A2A22"/></g>
  <g data-boca="torcida"><path d="M270 ${y + 6} Q300 ${y + 4} 334 ${y - 8}" fill="none" stroke="#7A3E2E" stroke-width="7" stroke-linecap="round"/></g>`;

function ojo(id, lado, cx, cy, mujer) {
  const almendra = `M${cx - 38} ${cy} Q${cx} ${cy - 28} ${cx + 38} ${cy} Q${cx} ${cy + 20} ${cx - 38} ${cy} Z`;
  return `
  <clipPath id="${id}-clip-${lado}"><path d="${almendra}"/></clipPath>
  <path d="${almendra}" fill="#FBF7EE"/>
  <g clip-path="url(#${id}-clip-${lado})"><g id="${id}-iris-${lado}">
    <circle cx="${cx}" cy="${cy - 2}" r="14" fill="#4A3426"/><circle cx="${cx}" cy="${cy - 2}" r="6.5" fill="#140E0A"/>
    <circle cx="${cx + 5}" cy="${cy - 7}" r="4" fill="#FFFFFF"/></g></g>
  <path id="${id}-parpado-${lado}" d="${almendra}" fill="var(--piel)" data-cx="${cx}" data-cy="${cy}"/>
  <path d="M${cx - 40} ${cy - 1} Q${cx} ${cy - 31} ${cx + 40} ${cy - 3}" fill="none" stroke="${TINTA}" stroke-width="6" stroke-linecap="round"/>
  ${mujer ? `<path d="M${lado === "i" ? cx - 40 : cx + 40} ${cy - 2} l${lado === "i" ? -10 : 10} -8" stroke="${TINTA}" stroke-width="5" stroke-linecap="round"/>` : ""}`;
}

// ------------------------------------------------------------------ constructor
export function titereSVG({ id, genero, epoca, piel, pelo, ropa, ropaOscura }) {
  const c = CARA[genero];
  const p = PELO[`${genero}-${epoca}`];
  const [ox1, ox2] = c.ojos;
  const torso = genero === "mujer"
    ? "M95 820 C95 660 175 592 300 590 C425 592 505 660 505 820 Z"
    : "M66 820 C66 652 160 586 300 584 C440 586 534 652 534 820 Z";
  const detalleRopa = {
    "mujer-antes": `<path d="M236 590 L300 700 L364 590 Q300 604 236 590 Z" fill="url(#periodico)"/>`,
    "mujer-hoy": `<path d="M228 592 L300 720 L260 600 Z" fill="${ropaOscura}"/><path d="M372 592 L300 720 L340 600 Z" fill="${ropaOscura}"/>
                  <rect x="372" y="660" width="70" height="40" rx="4" fill="url(#periodico)" transform="rotate(-6 407 680)"/>`,
    "hombre-antes": `<path d="M248 588 Q300 640 352 588" fill="none" stroke="${ropaOscura}" stroke-width="16"/>
                     <rect x="340" y="660" width="86" height="96" rx="6" fill="url(#periodico)" transform="rotate(4 383 708)"/>`,
    "hombre-hoy": `<path d="M244 586 L300 650 L270 690 Z" fill="#F4EDE0"/><path d="M356 586 L300 650 L330 690 Z" fill="#F4EDE0"/>
                   <path d="M290 650 L310 650 L318 790 L300 812 L282 790 Z" fill="url(#periodico)"/>`,
  }[`${genero}-${epoca}`];
  const barba = genero === "hombre" && epoca === "hoy"
    ? `<path d="M172 360 C178 440 230 488 300 494 C370 488 422 440 428 360 C414 420 380 452 342 448 C322 440 278 440 258 448 C220 452 186 420 172 360 Z" fill="url(#trama-barba)"/>
       <path d="M262 ${c.bocaY - 20} Q300 ${c.bocaY - 34} 338 ${c.bocaY - 20} Q300 ${c.bocaY - 12} 262 ${c.bocaY - 20} Z" fill="#5E554C"/>`
    : "";
  const gafas = genero === "mujer" && epoca === "hoy"
    ? `<g fill="rgba(255,255,255,.16)" stroke="${TINTA}" stroke-width="7"><rect x="200" y="300" width="92" height="54" rx="18"/>
       <rect x="308" y="300" width="92" height="54" rx="18"/></g><path d="M292 322 Q300 314 308 322" fill="none" stroke="${TINTA}" stroke-width="6"/>`
    : "";
  const arrugas = epoca === "hoy"
    ? `<path d="M196 ${c.ojoY + 6} q-12 4 -16 14 M404 ${c.ojoY + 6} q12 4 16 14" fill="none" stroke="#B98B6A" stroke-width="4" stroke-linecap="round"/>
       <path d="M250 ${c.bocaY - 34} q-14 18 -6 40 M350 ${c.bocaY - 34} q14 18 6 40" fill="none" stroke="#C99A78" stroke-width="4" stroke-linecap="round" opacity=".7"/>`
    : "";
  const cejaGrosor = genero === "hombre" ? 15 : 11;

  return `
<g id="${id}" class="titere" style="--piel:${piel}">
 <g id="${id}-cuerpo" filter="url(#recorte1)">
   <path d="${torso}" fill="${ropa}"/>
   <path d="${torso}" fill="url(#trama-pliegue)" opacity=".55" clip-path="url(#${id}-clip-sombra-cuerpo)"/>
   <clipPath id="${id}-clip-sombra-cuerpo"><rect x="360" y="580" width="200" height="260"/><rect x="40" y="740" width="560" height="100"/></clipPath>
   ${detalleRopa}
 </g>
 <g id="${id}-cabeza">
   <path d="M262 452 L338 452 L346 600 Q300 618 254 600 Z" fill="${piel}"/>
   <path d="M262 470 Q300 506 338 470 L338 452 L262 452 Z" fill="url(#trama-sombra)" opacity=".8"/>
   ${p.atras ? `<g id="${id}-peloatras" filter="url(#recorte2)" fill="${pelo}">${p.atras}</g>` : ""}
   <g id="${id}-cara" filter="url(#recorte1)">
     ${c.orejas.map(([x, y, rx, ry]) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${piel}"/>
        <path d="M${x} ${y - ry * 0.5} q${x < 300 ? 8 : -8} ${ry * 0.5} 0 ${ry}" fill="none" stroke="#B98B6A" stroke-width="4"/>`).join("")}
     <path d="${c.cara}" fill="${piel}"/>
     <clipPath id="${id}-clip-cara"><path d="${c.cara}"/></clipPath>
     <g clip-path="url(#${id}-clip-cara)">
       <rect x="350" y="150" width="120" height="360" fill="url(#trama-sombra)" opacity=".55"/>
       <ellipse cx="300" cy="190" rx="170" ry="58" fill="url(#trama-sombra)" opacity=".5"/>
       <ellipse cx="300" cy="500" rx="160" ry="40" fill="url(#trama-sombra)" opacity=".5"/>
     </g>
     ${arrugas}
     <circle cx="${ox1 - 14}" cy="${c.ojoY + 52}" r="30" fill="url(#trama-rubor)"/>
     <circle cx="${ox2 + 14}" cy="${c.ojoY + 52}" r="30" fill="url(#trama-rubor)"/>
     <path d="M300 ${c.ojoY + 6} Q291 ${c.ojoY + 50} 298 ${c.ojoY + 60} Q308 ${c.ojoY + 66} 320 ${c.ojoY + 58}" fill="none" stroke="#A8775A" stroke-width="5" stroke-linecap="round"/>
     ${ojo(id, "i", ox1, c.ojoY, genero === "mujer")}${ojo(id, "d", ox2, c.ojoY, genero === "mujer")}
     ${barba}
     <g id="${id}-ceja-i"><path d="M${ox1 - 36} ${c.cejaY + 8} Q${ox1} ${c.cejaY - 10} ${ox1 + 36} ${c.cejaY + 4}" fill="none" stroke="${pelo}" stroke-width="${cejaGrosor}" stroke-linecap="round"/></g>
     <g id="${id}-ceja-d"><path d="M${ox2 - 36} ${c.cejaY + 4} Q${ox2} ${c.cejaY - 10} ${ox2 + 36} ${c.cejaY + 8}" fill="none" stroke="${pelo}" stroke-width="${cejaGrosor}" stroke-linecap="round"/></g>
     <g id="${id}-boca">${BOCAS(c.bocaY)}</g>
     ${gafas}
   </g>
   <g id="${id}-pelodelante" filter="url(#recorte3)" fill="${pelo}">${p.delante}</g>
 </g>
 <g id="${id}-mano" filter="url(#recorte2)">
   <path d="M432 830 L438 640 Q470 620 502 640 L508 830 Z" fill="${ropa}"/>
   <path d="M432 830 L438 640 Q470 620 502 640 L508 830 Z" fill="url(#trama-pliegue)" opacity=".4"/>
   <g fill="${piel}">
     <ellipse cx="470" cy="600" rx="44" ry="52"/>
     <rect x="432" y="530" width="20" height="56" rx="10"/><rect x="454" y="518" width="20" height="64" rx="10"/>
     <rect x="476" y="522" width="20" height="62" rx="10"/><rect x="496" y="536" width="18" height="52" rx="9"/>
     <path d="M428 600 Q398 588 392 560 Q404 552 420 566 L440 586 Z"/>
   </g>
   <path d="M444 640 Q470 652 498 640" fill="none" stroke="#B98B6A" stroke-width="4"/>
 </g>
</g>`;
}

// ------------------------------------------------------------------ definiciones comunes
export const DEFS_COLLAGE = `
${[1, 2, 3].map((s) => `
<filter id="recorte${s}" x="-12%" y="-12%" width="124%" height="124%" color-interpolation-filters="sRGB">
  <feMorphology in="SourceAlpha" operator="dilate" radius="${5 + s}" result="borde"/>
  <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" seed="${s * 7}" result="ruido"/>
  <feDisplacementMap in="borde" in2="ruido" scale="${9 + s * 2}" xChannelSelector="R" yChannelSelector="G" result="roto"/>
  <feFlood flood-color="#FBF7EE"/><feComposite in2="roto" operator="in" result="papel"/>
  <feGaussianBlur in="roto" stdDeviation="3"/><feOffset dx="8" dy="10"/>
  <feComponentTransfer result="sombra"><feFuncA type="linear" slope="0.32"/></feComponentTransfer>
  <feMerge><feMergeNode in="sombra"/><feMergeNode in="papel"/><feMergeNode in="SourceGraphic"/></feMerge>
</filter>`).join("")}
<pattern id="trama-sombra" width="11" height="11" patternUnits="userSpaceOnUse" patternTransform="rotate(30)">
  <circle cx="5.5" cy="5.5" r="2.6" fill="#8E5E44" opacity=".55"/></pattern>
<pattern id="trama-rubor" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(15)">
  <circle cx="4.5" cy="4.5" r="2.4" fill="#D9776A" opacity=".55"/></pattern>
<pattern id="trama-pliegue" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
  <circle cx="6" cy="6" r="3" fill="#1E1E1E" opacity=".35"/></pattern>
<pattern id="trama-barba" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(20)">
  <circle cx="3.5" cy="3.5" r="1.7" fill="#3B342D" opacity=".75"/></pattern>
<pattern id="periodico" width="240" height="160" patternUnits="userSpaceOnUse">
  <rect width="240" height="160" fill="#ECE6DA"/>
  <rect x="10" y="10" width="140" height="14" fill="#5A5650"/>
  ${Array.from({ length: 13 }, (_, i) => `<rect x="10" y="${34 + i * 9}" width="${70 + ((i * 37) % 40)}" height="4" fill="#8A857C"/>
  <rect x="124" y="${34 + i * 9}" width="${66 + ((i * 53) % 44)}" height="4" fill="#8A857C"/>`).join("")}
</pattern>
<pattern id="papel-grano" width="200" height="200" patternUnits="userSpaceOnUse">
  <rect width="200" height="200" fill="#FBF7EE"/></pattern>`;

export const CSS_TITERES = `
.titere .brillo{fill:none;stroke:rgba(255,255,255,.22);stroke-width:12;stroke-linecap:round}
.titere .canas{fill:none;stroke:#D8D2C6;stroke-width:14;stroke-linecap:round}
.titere [data-boca]{display:none}
.titere [data-boca="cerrada"]{display:inline}`;
