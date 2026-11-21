# T12 · Notas de edición (archivo por si hay apelación)

**Vídeo:** «¿Pagamos más para que aprendan menos?» (educación, 2016 frente a hoy) · Short vertical 1080×1920, 75,3 s, −14,1 LUFS.
**Fichero:** `videos/t12/render/t12-limpio.mp4` · SHA-256 `7c378fcf020149da7ed64cebb2e7092363f0041f011e65361ea17c342021b2db`.
**Aprobación:** es el segundo de los tres vídeos de lo que pagamos frente a lo que recibimos que pidió el responsable del canal el 21-11-2026. Ese mismo día eligió las voces (profesor A, alumno B) y pidió añadir las ratios por aula. Después pidió comparar las ratios de las cuatro etapas con Europa y algún sarcasmo más: entra el ranking de la UE de alumnos por clase en primaria y ESO y el «¡Subcampeones de Europa!» del padre (0-3 y 3-6 no entran; ver `paso-1-datos.md`). Primer render pendiente de su visto bueno.

## Cómo se hizo
- **Guion:** tutoría de 4.º de ESO con un tutor, un padre y su hijo de 15 años, todos inventados. Pasa por el pasillo del instituto, el aula y una academia de refuerzo. Acaba con «impuestos de récord y aprendemos menos que en 2015» y una pregunta. No da causas ni nombra partidos ni comunidades.
- **Cifras:**
  - **PISA:** 2015 de la OCDE (Volume I) y 2025 del Ministerio de Educación (tablas del informe español).
  - **Impuestos, gasto en educación y profesorado:** Eurostat.
  - **Alumnos por clase:** OCDE (Education at a Glance), ranking de los países de la UE con datos.
  - **Gasto de los hogares:** INE (EPF).
  - **Script y detalle:** `scripts/calcular_t12.py`, `paso-1-datos.md`, `guion.md` y `t12_educacion.json`.
- **Ficheros originales:** `datos-crudos/`, con enlace, fecha y huella SHA-256 en `datos-crudos/MANIFEST.csv`.
- **Imagen:** dibujada con código (`escenas.mjs` y `diseno/educacion.mjs`), sin marcas ni centros reales.
- **Voces:** Qwen3-TTS en local.
  - **Padre:** la voz del narrador (timbre de una grabación CC0 del proyecto Piper/Nabu Casa).
  - **Tutor:** la voz A del casting de T12, inventada a partir de una descripción. Salió masculina, así que el personaje es un hombre.
  - **Alumno:** la voz B del casting, inventada a partir de una descripción.
  - **Revisión:** cada toma se revisa con Whisper (`voz-registro.txt`).
- **Música y efectos:** generados con código (`scripts/sonido.py`). Contenido sintético: sí.
