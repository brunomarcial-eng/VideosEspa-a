# T7 · Notas de edición (archivo por si hay apelación)

**Vídeo:** «¿Gastamos más en caprichos que nuestros padres?» · Short vertical 1080×1920, 77,7 s, −14,6 LUFS.
**Fichero:** `videos/t7/render/t7-limpio.mp4` · SHA-256 `c939e6ce450c5ba7540d122a82ae25a73615af96bdfc2fef5cdbc7f70f97caee`.
**Aprobación:** el responsable del canal aprobó datos y borrador el 17-11-2026 y pidió añadir música, discos, cine y conciertos sin nueva aprobación. Pendiente de su visto bueno final.

## Cómo se hizo
- **Guion:** discusión entre un padre de 62 años y su hijo de 31, personajes inventados; sin partidos ni causas. El vídeo enseña datos y pregunta. 16 planos; texto, cifras y comprobaciones en `guion.json` y `guion.md`.
- **Cifras (todas oficiales; detalle en `paso-1-datos.md` y `t7_consumo.json`):**
  - Reparto del gasto de los hogares (INE: Encuesta Continua de Presupuestos Familiares de 1986, en el Anuario de 1989; EPF de 2006 y 2025).
  - Precio real de la ropa (INE, IPC por grupos; cálculo propio).
  - Deporte (Ministerio de Educación, FP y Deportes, Encuesta de Hábitos Deportivos 2024/25).
  - Discos (INE, EPF por subclases) y música por internet (Eurostat).
  - Cine: gasto medio por espectador (Ministerio de Cultura, vía Anuarios del INE de 1988 y 2020 y Anuario de Estadísticas Culturales 2025) entre el salario por hora (INE); cálculo propio.
  - Conciertos (Ministerio de Cultura, Encuesta de Hábitos y Prácticas Culturales).
  - Compras por internet (Eurostat).
- **Ficheros originales:** `datos-crudos/`, con enlace, fecha y huella SHA-256 en `datos-crudos/MANIFEST.csv`.
- **Imagen:** dibujada con código (`escenas.mjs`, `diseno/tiendas.mjs`, `diseno/sueno.mjs`). Sin marcas, sin artistas reales.
- **Voces:** Qwen3-TTS en local, las mismas de T3 a T6; cada toma revisada con Whisper y, en las frases cortas del padre, elegida por parecido con su voz en T3 (`voz-registro.txt`).
- **Música y efectos:** generados con código (`scripts/sonido.py`). Contenido sintético: sí.
