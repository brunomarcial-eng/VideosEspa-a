// BOCETO de personajes (Paso 3 bis): la misma persona en dos épocas.
// «antes» = la de 2016/2007 (ocre) · «hoy» = la de ahora (azul).
// Se reconoce que es la misma persona por la cara y el lunar; cambian peinado, gafas y canas.
// Clases: .l trazo · .piel · .pelo · .ropa · .ojo · .canas · .vidrio
// Diseño propio y genérico: no representa a nadie real.

const CUERPO = `
  <path class="ropa l" d="M58 440 V352 Q58 278 150 278 Q242 278 242 352 V440 Z"/>
  <path class="piel l" d="M130 236 H170 V286 Q150 300 130 286 Z"/>
  <ellipse class="piel l" cx="150" cy="172" rx="72" ry="82"/>
  <circle class="ojo" cx="196" cy="206" r="3.5"/>`; // lunar: la marca de que es la misma persona

const CARAS = {
  // Joven: pelo largo y suelto; cara de sorpresa.
  antes: `
  <path class="pelo l" d="M76 180 Q66 78 150 80 Q234 78 224 180 L236 270 Q214 262 210 206 Q204 132 150 124 Q96 132 90 206 Q86 262 64 270 Z"/>
  <ellipse class="ojo" cx="124" cy="176" rx="9" ry="11"/><ellipse class="ojo" cx="176" cy="176" rx="9" ry="11"/>
  <path class="l" d="M104 142 Q122 126 140 138 M160 138 Q178 126 196 142"/>
  <ellipse class="boca l" cx="150" cy="218" rx="13" ry="16"/>`,
  // Hoy: moño, mechón de canas, gafas; explicando.
  hoy: `
  <path class="pelo l" d="M78 176 Q72 86 150 84 Q228 86 222 176 Q214 126 150 118 Q92 124 78 176 Z"/>
  <circle class="pelo l" cx="150" cy="70" r="26"/>
  <path class="canas" d="M164 88 Q182 100 196 128"/>
  <rect class="vidrio l" x="102" y="158" width="44" height="36" rx="12"/><rect class="vidrio l" x="154" y="158" width="44" height="36" rx="12"/>
  <path class="l" d="M146 172 H154"/>
  <ellipse class="ojo" cx="124" cy="177" rx="7" ry="8"/><ellipse class="ojo" cx="176" cy="177" rx="7" ry="8"/>
  <path class="l" d="M104 148 Q122 142 140 148 M160 142 Q178 128 196 138"/>
  <path class="boca l" d="M130 214 Q150 234 170 214 Q150 222 130 214 Z"/>`,
};

export function svgPersonaje(quien, alto = 440, extra = "") {
  return `<svg class="pj pj-${quien} ${extra}" viewBox="0 0 300 440" width="${(alto * 300) / 440}" height="${alto}" aria-hidden="true">
${CUERPO}${CARAS[quien]}</svg>`;
}
