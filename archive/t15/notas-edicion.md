# T15 · Notas de edición (archivo por si hay apelación)

**Vídeo:** «¿Cuántas horas trabajas para la cena de Nochebuena?» (serie «¿Cuántas horas…?») · Short vertical 1080×1920, 71,2 s, −14,0 LUFS (v1).
**Fichero:** `videos/t15/render/t15-limpio.mp4` · SHA-256 `cb7311cac48369d04b8cb8bb570bf1dd8ec98e4f8d4f321f994188104284dd92`.
**Aprobación:** el responsable del canal eligió la cena de Navidad el 22-11-2026 y el 23-11-2026 mandó una lista de comidas típicas de Navidad por regiones. La cena lleva lo que sale en toda España y tiene precio oficial por kilo; los platos de cada región van en el mapa final. Tono y forma como T17, aprobado ese mismo día: de calle, irónico, pocas cifras y grandes, cambio de escenario y un chiste que vuelve («en mis tiempos…»). v1 pendiente de su visto bueno.

## Cómo se hizo
- **Guion:** una madre que pone la cena este año, la abuela y el del mercado, inventados. Del mercado (marisco y cordero) a la casa (la cena entera, el turrón y los juguetes) y al mapa de platos por regiones. Cierra con una pregunta. No da causas ni nombra partidos ni marcas.
- **Cifras:** precio medio que pagan los hogares por kilo o litro en todo el año (INE, Encuesta de Presupuestos Familiares, 2016, 2019 y 2025), IPC de confitería y de juguetes (INE) y sueldo neto mediano por hora de T1 y T14 (INE y Eurostat). Script y detalle: `scripts/calcular_t15.py`, `guion.md` y `t15_navidad.json`. El sueldo de T14 se archiva en `datos-crudos/t14_desayuno.json` (y sus originales, en `archive/t1/` y `archive/t14/`).
- **Redondeo:** el cordero son 132,5 minutos; el vídeo dice 132, con el mismo redondeo que el verificador.
- **Ficheros originales:** `datos-crudos/`, con enlace, fecha y huella SHA-256 en `datos-crudos/MANIFEST.csv`.
- **Imagen:** dibujada con código (`escenas.mjs` y `diseno/navidad.mjs`): un mercado con guirnaldas de bombillas, la pescadería y la carnicería, el salón de T17 con el árbol de Navidad y el mapa de España (contorno de Natural Earth, dominio público) con los platos de cada región.
- **Voces:** Qwen3-TTS en local, del catálogo de voces del canal: la madre con «medica», la abuela con «hostelera» y el tendero con «profesora». Cada toma se revisa con Whisper (`voz-registro.txt`).
- **Música, efectos y ambiente:** generados con código (`scripts/sonido.py`), sin ruido de fondo continuo y con la música sin bajo grave. Contenido sintético: sí.
