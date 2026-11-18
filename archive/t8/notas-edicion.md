# T8 · Notas de edición (archivo por si hay apelación)

**Vídeo:** «¿Cuánto de tu sueldo se queda el Estado?», versión 2 · Short vertical 1080×1920, 65,8 s, −14,4 LUFS.
**Fichero:** `videos/t8/render/t8-limpio.mp4` · SHA-256 `73e3332727c3f4767f0d25e3d4970e83a596805fefe9f1f4fb8115ee8695f949`. (Versión 1, 76,7 s: SHA-256 `8fac021d9e04d83175a4bfa34bdcb73332e280101ae14aff8249ca4b504cb6f4`, no publicada.)
**Aprobación:** datos y borrador aprobados por el responsable del canal el 18-11-2026 (versión 3). El mismo día pidió rehacerlo centrado en lo que ha empeorado, con el carburante sin rebajas temporales y sin los ahorros, y dejó el resto en manos de Claude (versión 4 de `paso-1-datos.md`; contraste en `contraste.md`). Pendiente de su visto bueno final.

## Cómo se hizo
- **Guion:** discusión entre un padre de 62 años y su hijo de 31, personajes inventados; sin partidos ni causas. Acaba con una pregunta.
- **Cifras:** cálculo propio con las normas del BOE de 1986, 2006 y 2026: cotizaciones, IRPF (Madrid en 2026) e IVA; sueldo medio del INE (2024) e IPC del INE para pasar a euros de hoy; precio del gasóleo y la gasolina del boletín petrolero de la Comisión Europea, con los impuestos de la Ley 38/1992 en 2026. Detalle en `paso-1-datos.md`, `guion.md` y `t8_impuestos_sueldo.json`. Script: `scripts/calcular_t8.py`, que comprueba cada tipo y cada tramo contra el texto del BOE.
- **Ficheros originales:** `datos-crudos/`, con enlace, fecha y huella SHA-256 en `datos-crudos/MANIFEST.csv`.
- **Imagen:** dibujada con código (`escenas.mjs`, `diseno/tiendas.mjs`, `diseno/sueno.mjs`); sin marcas reales.
- **Voces:** Qwen3-TTS en local, las mismas de T3 a T7. Cada toma se revisa con Whisper, y en las frases del padre se elige la que más se parece a su voz en T3 (`voz-registro.txt`).
- **Música y efectos:** generados con código (`scripts/sonido.py`). Contenido sintético: sí.
