# T10 · Notas de edición (archivo por si hay apelación)

**Vídeo:** «¿Montar un bar hoy es más difícil que en 1986?» · Short vertical 1080×1920, 76,3 s, −14,1 LUFS.
**Fichero:** `videos/t10/render/t10-limpio.mp4` · SHA-256 `b8e289c1ec64b7962009942b028586eed30f56258718cf7b409ff4050de1f710`.
**Aprobación:** el 20-11-2026, el responsable del canal eligió los años (1986, 2006 y hoy), los personajes (una hostelera veterana y uno nuevo) y la voz de ella (la C del casting). Pidió dejar claro, sin ambigüedad, que hoy hay muchos más trámites, obligaciones, impuestos y costes. Primer render pendiente de su visto bueno.

## Cómo se hizo
- **Guion:** conversación entre dos personajes inventados. Ella le dicta las obligaciones que en 1986 no existían. Da el veredicto («más difícil que en 1986 y que en 2006») y él acaba con una pregunta. Sin partidos ni causas.
- **Cifras:**
  - **Obligaciones:** 16, cada una con la norma que la crea y el año en que se exige a un bar. `scripts/calcular_t10.py` busca en el texto archivado del BOE la frase que la crea y se para si no la encuentra.
  - **Camarero con el salario mínimo:** motor de T8 (salario mínimo y cotizaciones del BOE, IPC del INE).
  - **IVA de la hostelería:** BOE de cada año.
  - **Detalle:** `paso-1-datos.md`, `guion.md` y `t10_bar.json`.
- **Fuera de la lista, por prudencia:** la tasa de basuras. La Ley 7/2022 la hace obligatoria en todos los ayuntamientos desde 2025, pero en Madrid los negocios quizá ya pagaban una antes.
- **Ficheros originales:** `datos-crudos/`, con enlace, fecha y huella SHA-256 en `datos-crudos/MANIFEST.csv`.
- **Imagen:** dibujada con código (`escenas.mjs`, `diseno/limpio.mjs` y `diseno/limpio_runtime.js`, con `cae()` y `cuenta()` nuevos). Sin marcas reales.
- **Voces:** Qwen3-TTS en local.
  - **Ella:** voz inventada a partir de una descripción (casting de T10, opción C) y fijada clonando esa toma.
  - **Él:** la voz del hijo de T3 a T9.
  - **Revisión:** cada toma, con Whisper (`voz-registro.txt`). En la frase 6, Whisper oye «las obras» por «las sobras»: es la unión de las dos eses y el subtítulo lo escribe bien.
- **Música y efectos:** generados con código (`scripts/sonido.py`). Contenido sintético: sí.
