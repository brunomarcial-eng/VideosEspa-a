// Biblioteca de objetos del canal, dibujados con código (SVG, viewBox 0 0 200 200).
// Clases: .l = trazo · .f = relleno principal · .f2 = relleno secundario · .f3 = detalle.
// Cada estilo da su propio tratamiento (tiza, cartón plano o litografía) con CSS y filtros.
// Diseño propio: nada copiado de barajas, series ni canales existentes.

export const OBJETOS = {
  carrito: `
    <path class="l" d="M18 42 H44 L68 138 H158 L178 64 H52"/>
    <path class="f2 l" d="M56 64 H178 L162 124 H70 Z"/>
    <path class="l" d="M86 64 L92 124 M118 64 L118 124 M150 64 L142 124 M62 94 H170"/>
    <circle class="f l" cx="82" cy="164" r="13"/><circle class="f l" cx="146" cy="164" r="13"/>`,
  reloj: `
    <rect class="f2 l" x="88" y="14" width="24" height="16" rx="4"/>
    <circle class="f l" cx="100" cy="112" r="76"/>
    <circle class="f2 l" cx="100" cy="112" r="62"/>
    <path class="l" d="M100 56 V66 M100 158 V168 M44 112 H54 M146 112 H156"/>
    <path class="l" d="M100 112 V72 M100 112 L130 126"/><circle class="f3" cx="100" cy="112" r="6"/>`,
  pan: `
    <path class="f l" d="M24 138 C14 112 150 52 176 70 C192 82 70 168 24 138 Z"/>
    <path class="l" d="M62 118 L78 102 M92 104 L108 88 M122 90 L138 74"/>`,
  leche: `
    <path class="f l" d="M62 66 H130 V178 H62 Z"/>
    <path class="f2 l" d="M62 66 L80 30 H148 L130 66 Z"/>
    <path class="f3 l" d="M130 66 L148 30 V150 L130 178 Z"/>
    <path class="l" d="M62 112 Q80 100 96 112 T130 112"/>
    <path class="l" d="M106 30 V16 H122 V30"/>`,
  huevos: `
    <ellipse class="f2 l" cx="64" cy="92" rx="26" ry="34"/>
    <ellipse class="f2 l" cx="136" cy="92" rx="26" ry="34"/>
    <ellipse class="f2 l" cx="100" cy="84" rx="26" ry="34"/>
    <path class="f l" d="M18 112 H182 L170 172 H30 Z"/>
    <path class="l" d="M54 112 Q64 136 74 112 M90 112 Q100 136 110 112 M126 112 Q136 136 146 112"/>`,
  aceite: `
    <path class="f3 l" d="M88 14 H112 V34 H88 Z"/>
    <path class="f l" d="M88 34 H112 C112 46 136 56 136 84 V172 Q136 184 124 184 H76 Q64 184 64 172 V84 C64 56 88 46 88 34 Z"/>
    <path class="f2 l" d="M64 108 H136 V152 H64 Z"/>
    <path class="l" d="M100 116 C90 132 92 142 100 144 C108 142 110 132 100 116 Z"/>`,
  manzana: `
    <path class="f l" d="M100 62 C62 38 26 76 40 124 C50 160 82 182 100 166 C118 182 150 160 160 124 C174 76 138 38 100 62 Z"/>
    <path class="l" d="M100 62 C100 46 104 32 114 22"/>
    <path class="f2 l" d="M108 40 C120 22 146 24 152 32 C140 46 120 48 108 40 Z"/>`,
  ticket: `
    <path class="f l" d="M48 14 H152 V176 L139 186 L126 176 L113 186 L100 176 L87 186 L74 176 L61 186 L48 176 Z"/>
    <path class="l" d="M64 44 H136 M64 68 H120 M64 88 H128 M64 108 H112 M64 140 H136"/>
    <path class="l" d="M64 158 H96"/>`,
  nomina: `
    <path class="f l" d="M36 18 H150 L170 38 V182 H36 Z"/>
    <path class="f2 l" d="M150 18 V38 H170"/>
    <path class="l" d="M54 50 H130 M54 74 H152 M54 94 H152 M54 114 H152"/>
    <rect class="f2 l" x="96" y="138" width="56" height="26"/>`,
  etiqueta: `
    <path class="f l" d="M30 64 L94 16 H176 V112 H94 Z" transform="rotate(20 100 100)"/>
    <circle class="f2 l" cx="76" cy="58" r="10" transform="rotate(20 100 100)"/>
    <path class="l" d="M110 52 H160 M110 80 H150" transform="rotate(20 100 100)"/>`,
  capsula: `
    <path class="f3 l" d="M30 92 L52 70 H148 L170 92 Z"/>
    <path class="f2 l" d="M30 92 L52 70 L18 34 L2 58 Z"/>
    <path class="f2 l" d="M170 92 L148 70 L182 34 L198 58 Z"/>
    <path class="f l" d="M30 92 H170 V182 H30 Z"/>
    <path class="l" d="M30 92 L100 112 L170 92"/>
    <rect class="f2 l" x="70" y="126" width="60" height="34" rx="4"/>`,
  taza: `
    <path class="f l" d="M38 70 H142 V128 Q142 170 90 170 Q38 170 38 128 Z"/>
    <path class="l" d="M142 86 Q178 86 176 112 Q174 134 142 132"/>
    <path class="f2 l" d="M24 172 H156"/>
    <path class="l" d="M66 54 Q58 40 68 28 M92 54 Q84 38 94 24 M118 54 Q110 40 120 28"/>`,
  llave: `
    <circle class="f l" cx="58" cy="100" r="36"/><circle class="f2 l" cx="58" cy="100" r="12"/>
    <path class="f l" d="M92 90 H180 V110 H92 Z"/>
    <path class="l" d="M150 110 V132 M168 110 V126"/>`,
  calendario: `
    <rect class="f l" x="24" y="34" width="152" height="146" rx="8"/>
    <path class="f2 l" d="M24 34 H176 V72 H24 Z"/>
    <path class="l" d="M58 20 V48 M142 20 V48"/>
    <path class="l" d="M44 98 H156 M44 124 H156 M44 150 H156 M72 82 V170 M100 82 V170 M128 82 V170"/>`,
  tiza: `
    <path class="f l" d="M30 150 L140 40 L164 64 L54 174 Z"/>
    <path class="f2 l" d="M140 40 L164 64 L176 52 L152 28 Z"/>`,
  persona: `
    <circle class="f l" cx="100" cy="50" r="26"/>
    <path class="f2 l" d="M52 180 V128 Q52 88 100 88 Q148 88 148 128 V180 Z"/>`,
  oros: `
    <circle class="f l" cx="100" cy="100" r="78"/>
    <circle class="f2 l" cx="100" cy="100" r="58"/>
    <path class="l" d="M100 48 V60 M100 140 V152 M48 100 H60 M140 100 H152 M137 63 L129 71 M63 137 L71 129 M137 137 L129 129 M63 63 L71 71"/>
    <path class="l" d="M100 100 V70 M100 100 L122 112"/>`,
  copas: `
    <path class="f l" d="M48 30 H152 Q152 104 100 112 Q48 104 48 30 Z"/>
    <path class="f2 l" d="M92 112 H108 V150 H92 Z"/>
    <path class="f l" d="M58 176 Q60 150 100 150 Q140 150 142 176 Z"/>
    <path class="l" d="M60 54 H140"/>`,
  espadas: `
    <path class="f l" d="M92 20 H108 V128 H92 Z"/>
    <path class="f2 l" d="M56 128 H144 V144 H56 Z"/>
    <path class="f l" d="M93 144 H107 V172 H93 Z"/>
    <circle class="f2 l" cx="100" cy="182" r="10"/>
    <path class="l" d="M100 28 V120"/>`,
  bastos: `
    <path class="f l" d="M82 18 Q100 10 118 18 L112 184 Q100 190 88 184 Z"/>
    <path class="f2 l" d="M78 56 Q100 46 122 56 Q100 66 78 56 Z M80 106 Q100 96 120 106 Q100 116 80 106 Z M84 150 Q100 140 116 150 Q100 160 84 150 Z"/>`,
  sota: `
    <circle class="f l" cx="100" cy="56" r="24"/>
    <path class="f2 l" d="M62 184 V132 Q62 96 100 96 Q138 96 138 132 V184 Z"/>
    <path class="f l" d="M126 104 Q160 106 158 150 L138 150"/>`,
  caballo: `
    <circle class="f l" cx="76" cy="54" r="24"/>
    <path class="f2 l" d="M38 184 V130 Q38 92 76 92 Q114 92 114 130 V184 Z"/>
    <circle class="f l" cx="146" cy="104" r="16"/>
    <path class="f2 l" d="M120 184 V150 Q120 128 146 128 Q172 128 172 150 V184 Z"/>`,
  rey: `
    <path class="f3 l" d="M70 40 L80 16 L92 34 L100 12 L108 34 L120 16 L130 40 Z"/>
    <circle class="f l" cx="100" cy="66" r="24"/>
    <path class="f2 l" d="M56 184 V140 Q56 100 100 100 Q144 100 144 140 V184 Z"/>
    <path class="l" d="M100 104 V184"/>`,
  reverso: `
    <rect class="f l" x="34" y="14" width="132" height="172" rx="12"/>
    <rect class="f2 l" x="48" y="28" width="104" height="144" rx="6"/>
    <circle class="l" cx="100" cy="100" r="30"/><path class="l" d="M100 100 V80 M100 100 L114 108"/>
    <circle class="l" cx="72" cy="52" r="10"/><circle class="l" cx="128" cy="52" r="10"/>
    <circle class="l" cx="72" cy="148" r="10"/><circle class="l" cx="128" cy="148" r="10"/>`,
};

export function svgObjeto(nombre, tam = 200, extra = "") {
  const cuerpo = OBJETOS[nombre];
  if (!cuerpo) throw new Error(`objeto desconocido: ${nombre}`);
  return `<svg class="obj obj-${nombre} ${extra}" viewBox="0 0 200 200" width="${tam}" height="${tam}" aria-hidden="true">${cuerpo}</svg>`;
}
