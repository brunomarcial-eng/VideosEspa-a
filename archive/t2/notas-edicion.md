# T2 · Notas de edición (archivo por si hay apelación)

**Vídeo:** «¿Hay más gente en paro o trabajando que antes de la crisis?» · Short vertical 1080×1920, 96 s (versión 4).
**Fichero publicado:** `videos/t2/render/t2-limpio.mp4` · SHA-256 `d48c8140801e5c6dbdfe53b30d85d5143e922540f4705e7fa6b12166415ef9d4`.
**Aprobado para publicar:** por el responsable del canal, el 14-11-2026. La v3 (80 s) se aprobó el 12-11-2026, pero se retiró antes de subirla porque no se entendía bien. La sustituye esta.

## Qué hay en esta carpeta
| Fichero | Qué es |
|---|---|
| `guion.json` · `guion.md` | Guion v4, plano a plano, con cada cifra contrastada contra los datos (lo genera `scripts/verificar_guion.py`) |
| `escaleta.md` | Escena a escena: lo que se oye, la tarjeta, lo que se ve y el sonido |
| `fuentes-y-datos.md` | Tabla de datos aprobada (sección T2), con las fuentes oficiales, su enlace, la fecha de consulta y el estado V/C. La población residente está al final |
| `t2_empleo.json` | Datos limpios usados por el vídeo |
| `datos-crudos/` | Respuestas originales de la API del INE (EPA y población residente), con su huella SHA-256 en `MANIFEST.csv` |
| `historia.json` | Momentos de imagen y sonido anclados a palabras de la narración |
| `voz-registro.txt` | Última pasada de la voz: semilla de cada línea, lo que entendió Whisper y si se aceptó |

## Cómo se hizo (todo original y generado con código)
- **Guion:** escrito para este vídeo, narrado por una sola voz. Son tres «fotos» de España (2007, 2016 y hoy) con las mismas tres cifras en cada una. No es una plantilla.
- **Datos:** solo fuentes oficiales del INE.
  - **Trabajando (ocupados) y en paro (parados):** Encuesta de Población Activa, siempre el 3.er trimestre (estado V).
  - **Habitantes:** población residente a 1 de julio, serie ECP320 (V). El dato de 2026 es provisional.
  - **Variaciones en %, «de cada 100 habitantes, trabajan…» y «seis menos»:** cálculo propio (C).
  - **«Récord»:** 22.852,6 miles en el 3.er trimestre de 2026 es el valor más alto de los 99 trimestres de la serie EPA387796 (2002-2026).
- **Imagen:** ilustración plana dibujada con código (SVG y HTML: `diseno/limpio.mjs`, `diseno/barrio.mjs` y `videos/t2/escenas.mjs`) y renderizada con Chromium. No hay bancos de imágenes ni IA de imagen.
  - Marta y la gente del barrio son personajes inventados.
  - El contorno de España sale de Natural Earth (dominio público), vía `world-atlas` (ISC).
  - En el mapa, cada figurita es medio millón de habitantes (90, 93 y 100).
  - En el tablón de ofertas, cada persona son unos 0,87 millones de parados (2, 5 y 3).
  - Ninguna de las dos escalas va rotulada: son ilustraciones proporcionales.
- **Voz:** sintética, generada en local con Qwen3-TTS 0.6B (Apache-2.0) y el timbre de una grabación de un donante de voz español publicada con licencia CC0 (proyecto Piper/Nabu Casa). Se marca «contenido alterado o sintético» en YouTube.
- **Música y efectos:** sintetizados con código (`scripts/sonido.py`). Sin pistas de terceros.
- **Tipografía:** Montserrat (licencia OFL).
- **Neutralidad:**
  - Sin partidos, sin políticos y sin atribuir causas. No se habla de reformas, Gobiernos ni inmigración.
  - Veredicto: frente a 2016, mejora (−40 % de parados); frente a 2007, empeora (+43 % de parados).
  - La pregunta final («¿Cómo puede ser? ¿Tú cómo te lo explicas?») se deja abierta para los comentarios.

## Cifras en pantalla y su origen
| Cifra | Qué es | Estado | Origen |
|---|---|---|---|
| 45,2 · 46,4 · 49,8 millones | Habitantes a 1 de julio de 2007, 2016 y 2026 (provisional) | V | `mismo_trimestre.<año>T3.poblacion_total_miles` |
| 20,8 · 18,5 · 22,9 millones | Ocupados, 3.er trimestre | V | `mismo_trimestre.<año>T3.ocupados_miles` |
| 1,8 · 4,3 · 2,6 millones | Parados, 3.er trimestre | V | `mismo_trimestre.<año>T3.parados_miles` |
| +3 % · −11 % · +139 % | 2016 frente a 2007: habitantes, ocupados, parados | C | variación porcentual |
| +10 % · +10 % · +43 % | Hoy frente a 2007: habitantes, ocupados, parados | C | variación porcentual |
| −40 % | Parados, hoy frente a 2016 | C | variación porcentual |
| 46 · 40 · 46 de cada 100 | Ocupados ÷ habitantes × 100 (no es la tasa de empleo oficial) | C | `pct_de(ocupados, poblacion_total)` |

Cada tarjeta con cifras lleva en pantalla «Dato oficial: INE, …» o «Cálculo propio con datos del INE (EPA y población)».
