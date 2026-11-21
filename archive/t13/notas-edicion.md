# T13 · Notas de edición (archivo por si hay apelación)

**Vídeo:** «¿Pagamos más para llegar más tarde?» (transporte, 2016 frente a hoy) · Short vertical 1080×1920, 75,7 s, −14,3 LUFS.
**Fichero:** `videos/t13/render/t13-limpio.mp4` · SHA-256 `1a1012672f4814c32d3d5833a30250b733529f965d21a16b826312bd97f63299`.
**Aprobación:** es el tercero de los vídeos de lo que pagamos frente a lo que recibimos que pidió el responsable del canal el 21-11-2026 (con viajeros de tren y de avión, maquinistas, pilotos, azafatas, carreteras, peajes y conductores). Ese mismo día autorizó consultar las webs de transporte y eligió las voces A del casting (viajera, comandante y maquinista). Primer render pendiente de su visto bueno.

## Cómo se hizo
- **Guion:** una viajera inventada cruza España en avión, en tren y en coche. Hablan con ella un comandante (con una azafata al lado) y un maquinista, también inventados. Pasa por la terminal de un aeropuerto, el interior de un avión, el andén de una estación y el peaje de una autopista, sin marcas, compañías ni lugares reales reconocibles. Acaba con «pagamos más, se gasta más… y llegamos más tarde» y una pregunta. No da causas ni nombra partidos.
- **Cifras:**
  - **Avión:** EUROCONTROL (retraso ATFM en ruta del espacio aéreo español), de enero a octubre de 2016 y de 2026. Del Excel completo (28 MB, no se versiona) se guarda el extracto de España en `datos-crudos/eurocontrol_atfm_en_ruta_espana.csv`.
  - **Tren:** CNMC, balance de la liberalización ferroviaria (puntualidad de 2019 y 2024, con datos de Adif). Se dice en pantalla que no hay serie desde 2016.
  - **Impuestos y gasto en transporte:** Eurostat, en euros de 2025 con el IPC del INE y por habitante con la población del INE.
  - **Inversión en vías de tren:** OCDE/ITF.
  - **Script y detalle:** `scripts/calcular_t13.py`, `paso-1-datos.md`, `guion.md` y `t13_infraestructuras.json`.
- **Ficheros originales:** `datos-crudos/`, con enlace, fecha y huella SHA-256 en `datos-crudos/MANIFEST.csv`.
- **Imagen:** dibujada con código (`escenas.mjs` y `diseno/transporte.mjs`), sin logotipos ni marcas de aerolíneas, operadores ferroviarios ni concesionarias.
- **Voces:** Qwen3-TTS en local, inventadas a partir de una descripción, sin clonar a nadie (voces A del casting de T13, `scripts/pruebas/transporte_voces.py`). Cada toma se revisa con Whisper (`voz-registro.txt`).
- **Música y efectos:** generados con código (`scripts/sonido.py`; nuevos: megafonía, avión, bocina de tren y claxon). Contenido sintético: sí.
