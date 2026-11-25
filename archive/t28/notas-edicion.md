# T28 · Notas de edición (archivo por si hay apelación)

**Vídeo:** «¿Tener un bebé cuesta hoy más horas de trabajo?» · Short vertical 1080×1920, 54,6 s, −14,2 LUFS (v1).
**Fichero:** `videos/t28/render/t28-limpio.mp4` · SHA-256 `1697fc3f35e549f9a64ae167199af15ef57321dc5f4e502aa2c978b0361104ff`.
**Aprobación:** el responsable del canal pidió el 24-11-2026 rescatar los temas del principio («Todos. 4 vídeos… uno por uno»); este es el cuarto (familias con hijos: lo que cuesta un bebé). v1: pendiente de su visto bueno.

## Cómo se hizo
- **Guion:** una hija embarazada y su padre, inventados, en una tienda de cosas de bebé; hablan con la forma de hablar del responsable del canal (skill `clon-bruno`). El padre cree que criar hoy es un lujo; la hija le enseña que la guardería y la comida del bebé cuestan menos horas de trabajo (la comida, más que en 2019), y que aun así nacen menos niños. Acaba con una pregunta («¿Tú por qué crees que nacen menos niños?») sin dar la causa. Sin partidos ni marcas (los productos de la tienda no llevan marca).
- **Cifras:** guardería, gasto medio de los hogares que pagan el primer ciclo de Educación Infantil (INE, EPF, tabla 73827; desde 2016); alimentos para bebé, IPC de la subclase (tabla 79184) frente al sueldo neto mediano por hora (método de T1); hijos por mujer (tabla 1407) y tasa bruta de natalidad (tabla 1381). Script: `scripts/calcular_t28.py`; detalle en `paso-1-datos.md`, `guion.md` y `t28_bebe.json`.
- **Años:** 2007, 2013 (plena crisis), 2016, 2019 y 2025 (la guardería, solo 2016, 2019 y 2025: la tabla empieza en 2016).
- **Redondeos dichos en voz:** «unas 129 horas» (129,1), «156» (156,1), «un 9 % menos que en 2007» (−9,4 %), «un 9 % más que en 2019» (+9,2 %).
- **Lo que no entra:** pañales (el IPC no los separa), precios de productos concretos, quién tiene plaza gratuita de guardería y cualquier causa de la baja natalidad.
- **Ficheros originales:** `datos-crudos/`, con enlace, fecha y huella SHA-256 en `datos-crudos/MANIFEST.csv`.
- **Imagen:** dibujada con código (`escenas.mjs` y `diseno/bebe.mjs`): la tienda en perspectiva (estanterías con botes, potitos y pañales sin marca, ropita colgada, cuna y carrito de exposición, tablón, escaparate), la mochila de guardería en el suelo, columnas de horas por año y dos filas de bebés (por cada 10 mujeres, 14 en 2007 y 11 hoy). Nada pegado a la mano.
- **Voces:** Qwen3-TTS en local, del catálogo del canal: la hija con «medica» y el padre con «padre». Tres tomas buenas por línea y se elige la de más entonación; cada toma se revisa con Whisper (`voz-registro.txt`).
- **Música, efectos y ambiente:** generados con código (`scripts/sonido.py`, ambiente «tienda»: pasos, bolsa, monedas y caja, sueltos). La música se corta con «nacen menos niños». Contenido sintético: sí.
