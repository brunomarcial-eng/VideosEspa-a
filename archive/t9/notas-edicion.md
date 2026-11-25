# T9 · Notas de edición (archivo por si hay apelación)

**Vídeo:** «¿Se vive mejor que hace 10 años?» · Short vertical 1080×1920, 68,6 s, −14,5 LUFS.
**Fichero:** `videos/t9/render/t9-limpio.mp4` · SHA-256 `64e1687dfce0ea38d88a959e7da2fae745343322e122c75bd17bd9f3a67a6d58`. (Versión anterior, 53,7 s, sin el año sumado: `79684e88…`, no publicada.) (Primer render, 52,8 s, con la pregunta «¿Se vive mejor que hace 10 años?»: `146b13d0…`, no publicado.)
**Aprobación:** el responsable del canal pidió el 19-11-2026 un vídeo en horas de trabajo con personajes más vivos y con volumen; el 20-11-2026 lo dejó en 2016 frente a hoy y eligió dos amigos de 35 años. Tras ver el primer render, cambió la pregunta final: «Tal y como está España… ¿me quedo o me vuelvo a marchar?». Después pidió contrastar lo de trabajar para el Estado «hasta agosto» y sumar el año de trabajo (Estado, comida, carburante y recibos): versión 3 de `paso-1-datos.md`. Pendiente de su visto bueno final.

## Cómo se hizo
- **Guion:** conversación entre dos amigos inventados de 35 años; cada uno trae su dato (el que se quedó, el de la luz, que ha mejorado). Sin partidos ni causas. Acaba con una pregunta.
- **Cifras:** horas de trabajo = precio / sueldo neto por hora del trabajador medio (INE y OCDE). Precios del Banco de España, Eurostat, la Comisión Europea y el INE. Detalle en `paso-1-datos.md`, `guion.md` y `t9_horas.json` (bloque `diez_anos`). Script: `scripts/calcular_t9.py`.
- **Ficheros originales:** `datos-crudos/`, con enlace, fecha y huella SHA-256 en `datos-crudos/MANIFEST.csv`.
- **Imagen:** dibujada con código (`escenas.mjs`, `diseno/horas.mjs`, `diseno/limpio.mjs` con volumen y `diseno/limpio_runtime.js` con movimiento); sin marcas reales.
- **Voces:** Qwen3-TTS en local. El que se quedó: la voz del hijo de T3 a T8 (inventada a partir de una descripción). El que vuelve: la voz del narrador (timbre de una grabación CC0 del proyecto Piper/Nabu Casa). Cada toma se revisa con Whisper (`voz-registro.txt`).
- **Música y efectos:** generados con código (`scripts/sonido.py`). Contenido sintético: sí.
