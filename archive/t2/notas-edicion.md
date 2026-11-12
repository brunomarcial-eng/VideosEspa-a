# T2 · Notas de edición (archivo por si hay apelación)

**Vídeo:** «¿Hay más gente en paro o trabajando que antes de la crisis?» · Short vertical 1080×1920, 80 s.
**Fichero publicado:** `videos/t2/render/t2-limpio.mp4` · SHA-256 `ab9db8724a252c6a58d648b5d2c5f2c01bd2761652a34f915eb7c3006c2d81bd`.
**Aprobado para publicar:** por el responsable del canal, el 12-11-2026.

## Qué hay en esta carpeta
| Fichero | Qué es |
|---|---|
| `guion.json` · `guion.md` | Guion v3, plano a plano, con cada cifra contrastada contra los datos (lo genera `scripts/verificar_guion.py`) |
| `escaleta.md` | Escena a escena: lo que se oye, la tarjeta, lo que se ve y el sonido |
| `fuentes-y-datos.md` | Tabla de datos aprobada (sección T2): fuentes oficiales con enlace, fecha de consulta, estado V/C, qué se puede y qué no se puede decir |
| `t2_empleo.json` | Datos limpios usados por el vídeo |
| `datos-crudos/` | Respuestas originales de la API del INE (EPA), con su huella SHA-256 en `MANIFEST.csv` |
| `historia.json` | Momentos de imagen y sonido anclados a palabras de la narración |
| `voz-registro.txt` | Última pasada de la voz: semilla de cada línea, lo que entendió Whisper y si se aceptó |

## Cómo se hizo (todo original y generado con código)
- **Guion:** escrito para este vídeo, en narración de una sola voz. No es una plantilla.
- **Datos:** solo fuentes oficiales: INE, Encuesta de Población Activa. Siempre el 3.er trimestre de cada año (2007, 2016 y 2026).
  - Ocupados, tasas de empleo y tasas de paro: leídos en la fuente (estado V).
  - Población de 16 años o más: cálculo propio (estado C), ocupados ÷ tasa de empleo.
  - «Récord de la serie»: 22.852,6 miles en el 3.er trimestre de 2026 es el valor más alto de los 99 trimestres de la serie EPA387796 (2002-2026) en `datos-crudos/ine_65109_epa_ocupados.json`.
- **Imagen:** ilustración plana dibujada con código (SVG y HTML, `diseno/limpio.mjs` y `videos/t2/escenas.mjs`), renderizada con Chromium. Sin bancos de imágenes ni IA de imagen. Marta es un personaje inventado.
  - En la calle, cada persona que pasa representa unos 2 millones de ocupados: 10, 9 y 11. No se rotula; es una ilustración proporcional.
- **Voz:** sintética, Qwen3-TTS 0.6B (Apache-2.0) en local, con el timbre de una grabación de un donante de voz español publicada con licencia CC0 (proyecto Piper/Nabu Casa). Se marca «contenido alterado o sintético» en YouTube.
- **Música y efectos:** sintetizados con código (`scripts/sonido.py`); sin pistas de terceros.
- **Tipografía:** Montserrat (licencia OFL).
- **Neutralidad:** sin partidos, sin políticos, sin atribuir causas. No se habla de reformas, Gobiernos ni inmigración. Cierre «mejora / empeora / depende» con el porqué: frente a 2016, mejora; frente a 2007, depende.

## Cifras en pantalla y su origen
| Cifra | Qué es | Estado | Origen |
|---|---|---|---|
| 20,75 millones (2007) | Ocupados, 3.er trimestre | V | `mismo_trimestre.2007T3.ocupados_miles` |
| 18,53 millones (2016) | Ocupados, 3.er trimestre | V | `mismo_trimestre.2016T3.ocupados_miles` |
| 22,85 millones (hoy) | Ocupados, 3.er trimestre de 2026 | V | `mismo_trimestre.2026T3.ocupados_miles` |
| +4,8 millones | Personas de 16 años o más, 2007 → 2026 | C | ocupados ÷ tasa de empleo, resta |
| 67 · 61 · 69 de cada 100 | Tasa de empleo de 16 a 64 años | V | `tasa_empleo_16_64_pct` |
| 8,0 % · 18,9 % · 10,2 % | Tasa de paro | V | `tasa_paro_pct` |

Cada tarjeta con cifras lleva en pantalla «Dato oficial: INE, Encuesta de Población Activa» o «Cálculo propio con datos del INE (EPA)».
