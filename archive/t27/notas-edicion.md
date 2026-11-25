# T27 · Notas de edición (archivo por si hay apelación)

**Vídeo:** «¿Hay más pobres que antes?» · Short vertical 1080×1920, 53,8 s, −14,3 LUFS (v1).
**Fichero:** `videos/t27/render/t27-limpio.mp4` · SHA-256 `ff26af5b6accebc779de8fb166ecb1e4d7dca213b0237294b952d1edf6c06e2a`.
**Aprobación:** el responsable del canal pidió el 24-11-2026 rescatar los temas del principio («Todos. 4 vídeos… uno por uno»); este es el tercero («pobreza con umbral fijo»). v1: pendiente de su visto bueno.

## Cómo se hizo
- **Guion:** una madre voluntaria en un banco de alimentos de barrio y su hijo, inventados; hablan con la forma de hablar del responsable del canal (skill `clon-bruno`). Ella cree que está peor que en la crisis; él le enseña que con la vara de 2008 hay menos pobres que nunca y que con la vara de cada año seguimos igual, pero que lo básico (carne o pescado, un imprevisto) empeora. La conclusión cambia con la medida y se dice. Acaba con una pregunta («¿Y tú podrías pagar mañana un gasto que no esperabas?»). Sin causas ni partidos; el cartel del almacén es genérico («RECOGIDA DE ALIMENTOS») y el chaleco no lleva logotipos ni nombre de ninguna organización.
- **Cifras:** INE, Encuesta de Condiciones de Vida: tasa de riesgo de pobreza con umbral fijo en 2008 (tabla 59962), con el umbral de cada año (9958), umbral (9964), carencias (9967) y dificultad para llegar a fin de mes (9985). La renta de la ECV es la del año anterior a la entrevista (la de 2008 es la de 2007); las carencias, del año de la entrevista. Script: `scripts/calcular_t27.py`; detalle en `paso-1-datos.md`, `guion.md` y `t27_pobreza.json`.
- **Años:** 2008 (primer año de la serie; rentas de 2007), 2013 (plena crisis), 2016, 2019 y 2025.
- **Redondeos dichos en voz:** «casi el 30 %» (29,2 %), «uno de cada cinco» (19,5 %), «más del doble» (×2,45), «casi 4 de cada 10» (36,4 %), «en 2008 eran 3» (29,9 %).
- **Lo que no entra:** cuánta gente va a los bancos de alimentos (no hay serie oficial; la madre habla de lo que ve) y cualquier causa.
- **Ficheros originales:** `datos-crudos/`, con enlace, fecha y huella SHA-256 en `datos-crudos/MANIFEST.csv`.
- **Imagen:** dibujada con código (`escenas.mjs` y `diseno/pobreza.mjs`): el almacén en perspectiva (pared de ladrillo, estanterías con latas, botellas y paquetes sin marcas, cajas rotuladas, mesa de reparto con bolsas, lámpara, palé), la regla «la vara de 2008», columnas por año, cinco muñequitos y una hucha con una factura en la mesa. Nada pegado a la mano.
- **Voces:** Qwen3-TTS en local, del catálogo del canal: el hijo con «hijo» y la madre con «hostelera». Tres tomas buenas por línea y se elige la de más entonación (en el plano 4 solo salió una buena de siete); cada toma se revisa con Whisper (`voz-registro.txt`).
- **Música, efectos y ambiente:** generados con código (`scripts/sonido.py`, ambiente nuevo «almacen»: cajas, cinta de embalar y latas, sueltos). La música se corta con «lo básico». Contenido sintético: sí.
