# T26 · Notas de edición (archivo por si hay apelación)

**Vídeo:** «¿Somos más ricos o más pobres que los europeos?» · Short vertical 1080×1920, 58,3 s, −14,2 LUFS (v1).
**Fichero:** `videos/t26/render/t26-limpio.mp4` · SHA-256 `0083b0c29ae370743ad92ae4a008cab692635b81bdf1e093ed883990e2c708e9`.
**Aprobación:** el responsable del canal pidió el 24-11-2026 rescatar los temas del principio («Todos. 4 vídeos… uno por uno»); este es el segundo. v1: pendiente de su visto bueno.

## Cómo se hizo
- **Guion:** una hija que vuelve por Navidad de trabajar en Alemania y su padre, inventados, en la sala de llegadas de un aeropuerto; hablan con la forma de hablar del responsable del canal (skill `clon-bruno`). El padre presume de «cuarta economía de Europa»; la hija le enseña que por persona España es la 14.ª de 27, que en 2007 estaba por encima de la media de la UE y hoy por debajo, y que Polonia y Chequia suben. Acaba con una pregunta («¿Y tú dónde crees que se vive mejor?»). Sin causas, partidos ni marcas; el panel de llegadas solo lleva ciudades y estados, sin aerolíneas.
- **Cifras:** Eurostat, índice de volumen del PIB por habitante en paridad de poder adquisitivo (prc_ppp_ind, UE-27 = 100): España 104 (2007), 90 (2013), 92 (2016), 91 (2019), 92 (2024; también 92 en 2025 según tec00114). Puesto entre los 27 ordenando el índice (empates en contra de España). PIB total (nama_10_gdp): 4.º de la UE. Script: `scripts/calcular_t26.py`; detalle en `paso-1-datos.md`, `guion.md` y `t26_europa.json`.
- **Años:** 2007, 2013 (plena crisis), 2016, 2019 y 2024 (último año completo de la serie).
- **Redondeos dichos en voz:** «un 4 % por encima» (104), «un 8 % por debajo» (92), «casi como nosotros» (Chequia 91 frente a 92).
- **Lo que no entra:** «se vive mejor» como dato (el índice mide producción por persona ajustada a precios; queda como pregunta), y cualquier causa (población, productividad, gobiernos).
- **Ficheros originales:** `datos-crudos/`, con enlace, fecha y huella SHA-256 en `datos-crudos/MANIFEST.csv`.
- **Imagen:** dibujada con código (`escenas.mjs` y `diseno/europa.mjs`): la sala de llegadas en perspectiva (cristalera con un avión sin marca, panel de llegadas, guirnalda y árbol de Navidad, barandilla, carrito de maletas), la maleta en el suelo, banderas sencillas, barras del tamaño de la economía, la fila de los 27 países, columnas de España frente a la línea de la media y barras por país de 2007 y de hoy. Nada pegado a la mano.
- **Voces:** Qwen3-TTS en local, del catálogo del canal: la hija con «viajera» y el padre con «comandante». Tres tomas buenas por línea y se elige la de más entonación; cada toma se revisa con Whisper (`voz-registro.txt`).
- **Música, efectos y ambiente:** generados con código (`scripts/sonido.py`, ambiente nuevo «llegadas»: pasos, una maleta de ruedas y el aviso de megafonía, sueltos; el de «aeropuerto» se descartó porque tiene murmullo continuo). La música se corta con el «8 % por debajo». Contenido sintético: sí.
