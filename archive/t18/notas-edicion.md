# T18 · Notas de edición (archivo por si hay apelación)

**Vídeo:** «¿Cuál es el coche más vendido en España? 2016 frente a hoy» (coches B, versión B de la prueba: dos cuñados en un bar) · Short vertical 1080×1920, 64,3 s, −14,3 LUFS (v1).
**Fichero:** `videos/t18/render/t18-limpio.mp4` · SHA-256 `614a828f7c6ef08f6fbc2743a6cb60b68c7810a872f56ca54e9d60477b5269d1`.
**Aprobación:** el responsable del canal propuso el 22-11-2026 dos enfoques de coches B para ver cuál funciona mejor (padre e hijo, T17; dos cuñados en un bar, este). Se acordó que cada uno tuviera su ángulo para no repetir contenido: este va del top 3 de cada año y los usados traídos de fuera. Cuestionó que el Yaris fuera el 2.º en 2025: tenía razón, se había sumado el Yaris Cross; contados aparte, el top 3 es Sandero, Clio y MG ZS. v1 pendiente de su visto bueno.

## Cómo se hizo
- **Guion:** dos cuñados en un bar, inventados. Luis se compró en 2016 el coche más vendido aquel año; Javi se va a comprar uno hoy. Comparan el top 3 de 2016 y de 2025, lo que cuestan hoy en meses de sueldo frente al coche nuevo medio, y los usados traídos de fuera. Cierra con una pregunta. No da causas ni nombra partidos. Se nombran los modelos más vendidos (dato oficial), pero los coches se dibujan sin marcas.
- **Cifras:** matriculaciones de turismos y todoterrenos nuevos por modelo (DGT, microdatos mensuales de 2016, 2019 y 2025); precio medio real por modelo (Agencia Tributaria, ranking de ventas 2025) más IVA; coche nuevo medio (Agencia Tributaria, tabla por origen) con matriculación e IVA de cada año; usados traídos de fuera (Agencia Tributaria); sueldo neto mediano de T1 y T16 (INE y Eurostat). Script y detalle: `scripts/calcular_t17.py`, `paso-1-datos.md`, `guion.md` y `t17_mas_vendido.json` (los datos son los mismos que los de T17).
- **Sin precio de 2016 por modelo:** el ranking con precios de Hacienda empieza en 2022; los precios de catálogo no son oficiales y no se usan.
- **Ficheros originales:** `datos-crudos/`, con enlace, fecha y huella SHA-256 en `datos-crudos/MANIFEST.csv`. Los microdatos mensuales de la DGT no se guardan aquí: su enlace y huella están en el MANIFEST.
- **Imagen:** dibujada con código (`escenas.mjs` y `diseno/barcunados.mjs`): un bar de barrio nuevo, distinto del de T10 y T14, con un podio para los más vendidos.
- **Voces:** Qwen3-TTS en local, del catálogo de voces del canal (`docs/voces-catalogo.md`): Luis con la voz «padre» y Javi con «maquinista». Cada toma se revisa con Whisper (`voz-registro.txt`). El plano 3 se queda con la mejor de cinco tomas: el texto lo oye entero, pero va algo lento al deletrear «MG ZS».
- **Música, efectos y ambiente:** generados con código (`scripts/sonido.py`): tazas, cucharilla y monedas del bar, sin murmullo continuo. Contenido sintético: sí.
