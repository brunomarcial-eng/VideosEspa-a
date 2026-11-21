# T11 · Notas de edición (archivo por si hay apelación)

**Vídeo:** «¿Pagamos más para esperar más?» (sanidad, 2016 frente a hoy) · Short vertical 1080×1920, 68,6 s, −14,4 LUFS.
**Fichero:** `videos/t11/render/t11-limpio.mp4` · SHA-256 `6ef56f1afc0ddb96a347539cdf048b9e950a0757f1d2775ec78b3572498b12ad`.
**Aprobación:** el 21-11-2026, el responsable del canal pidió tres vídeos (sanidad, educación e infraestructuras), solo 2016 frente a hoy y contundentes. Debían protagonizarlos los profesionales y los implicados, contar una historia y poner frente a frente lo que pagamos en impuestos y el servicio que recibimos. Primer render pendiente de su visto bueno.

## Cómo se hizo
- **Guion:** un paciente inventado recorre el sistema: sala de espera, consulta, pasillo del hospital y clínica privada. La médica y el enfermero dan los datos. Acaba con «impuestos de récord y más espera que en 2016» y una pregunta. No da causas ni nombra partidos ni comunidades.
- **Cifras:**
  - **Listas de espera:** Ministerio de Sanidad (SISLE-SNS), a 31 de diciembre de 2016 y de 2025 (versión rectificada).
  - **Impuestos y gasto en sanidad:** Eurostat, en euros de 2025 con el IPC del INE y por habitante con la población del INE.
  - **Médicos:** Eurostat.
  - **Seguros de salud:** INE, Encuesta de Presupuestos Familiares.
  - **Script y detalle:** `scripts/calcular_t11.py`, `paso-1-datos.md`, `guion.md` y `t11_sanidad.json`.
- **Ficheros originales:** `datos-crudos/`, con enlace, fecha y huella SHA-256 en `datos-crudos/MANIFEST.csv`.
- **Imagen:** dibujada con código (`escenas.mjs` y `diseno/sanidad.mjs`), sin marcas reales. Sin la cruz roja, que es un emblema protegido: la sanidad va con una cruz verde.
- **Voces:** Qwen3-TTS en local.
  - **Paciente:** la voz del padre (T3 a T8).
  - **Enfermero:** la voz del hijo.
  - **Médica:** voz nueva inventada a partir de una descripción (casting de T11, opción B, provisional hasta que el responsable elija).
  - **Revisión:** cada toma se revisa con Whisper (`voz-registro.txt`).
- **Música y efectos:** generados con código (`scripts/sonido.py`). Contenido sintético: sí.
