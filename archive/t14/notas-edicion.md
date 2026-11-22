# T14 · Notas de edición (archivo por si hay apelación)

**Vídeo:** «¿Cuántos minutos trabajas para desayunar?» (serie «¿Cuántas horas…?», 2016 frente a hoy) · Short vertical 1080×1920, 60,2 s, −13,9 LUFS.
**Fichero:** `videos/t14/render/t14-limpio.mp4` · SHA-256 `01e08e2010e1e5435a5c4436ba90647ff04edff5c0fef128223dec12f3557c35`.
**Aprobación:** el responsable del canal pidió el 22-11-2026 el siguiente vídeo de la serie «¿Cuántas horas…?» (horas de trabajo para pagar algo concreto frente a 2016). El objeto, el desayuno, se eligió con los datos oficiales disponibles. Primer render pendiente de su visto bueno.

## Cómo se hizo
- **Guion:** una madre, su hijo de 15 años y la tendera de una tienda de barrio, todos inventados. Pasa por la cocina de casa y la tienda; acaba con el recuento («seis de nueve básicos cuestan más minutos que en 2016, y ninguno menos») y una pregunta. No da causas ni nombra partidos ni marcas.
- **Cifras:** precios medios que pagan los hogares (INE, Encuesta de Presupuestos Familiares 2016, 2019 y 2025) y sueldo neto mediano por hora (el de T1: INE, Encuesta Anual de Estructura Salarial y Encuesta Trimestral de Coste Laboral, con el IRPF y las cotizaciones de cada año). Script y detalle: `scripts/calcular_t14.py`, `paso-1-datos.md`, `guion.md` y `t14_desayuno.json`. El sueldo de T1 se archiva en `datos-crudos/t1_cesta_horas.json` (sus ficheros originales están en `archive/t1/`).
- **Ficheros originales:** `datos-crudos/`, con enlace, fecha y huella SHA-256 en `datos-crudos/MANIFEST.csv`.
- **Imagen:** dibujada con código (`escenas.mjs` y `diseno/desayuno.mjs`), sin marcas.
- **Voces:** Qwen3-TTS en local, del catálogo de voces del canal (`docs/voces-catalogo.md`; desde el 21-11-2026 no se hacen castings nuevos): la madre con la voz «medica», el hijo con «alumno» y la tendera con «hostelera». Cada toma se revisa con Whisper (`voz-registro.txt`).
- **Música, efectos y ambiente:** generados con código (`scripts/sonido.py`): tictac, cafetera y pájaros en la cocina; murmullo, nevera, bolsas y monedas en la tienda. Contenido sintético: sí.
