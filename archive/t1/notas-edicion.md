# T1 · Notas de edición (archivo por si hay apelación)

**Vídeo:** «¿Llenar el carro te cuesta más o menos que hace 10 años?» · Short vertical 1080×1920, 69 s.
**Fichero publicado:** `videos/t1/render/t1-limpio.mp4` · SHA-256 `3a8682809082d9525acd9b84d7dde7b55320dc78307b6fda5b43a2a5d1e10f2d`.
**Aprobado para publicar:** por el responsable del canal, el 12-11-2026.

## Qué hay en esta carpeta
| Fichero | Qué es |
|---|---|
| `guion.json` · `guion.md` | Guion v5, plano a plano, con cada cifra contrastada contra los datos (lo genera `scripts/verificar_guion.py`) |
| `fuentes-y-datos.md` | Tabla de datos aprobada: fuentes oficiales con enlace, fecha de consulta, estado V/C, qué se puede y qué no se puede decir |
| `t1_cesta_horas.json` | Datos limpios usados por el vídeo |
| `datos-crudos/` | Respuestas originales de las APIs del INE y de Eurostat, con su huella SHA-256 en `MANIFEST.csv` |
| `historia.json` | Momentos de imagen y sonido anclados a palabras de la narración |
| `voz-registro.txt` | Cada toma de voz: semilla, lo que entendió Whisper y si se aceptó |

## Cómo se hizo (todo original y generado con código)
- **Guion:** escrito para este vídeo, en narración de una sola voz. No es una plantilla.
- **Datos:** solo fuentes oficiales (INE: EAES, IPC y EPF; Eurostat: `earn_nt_net`). Las horas son un cálculo propio (estado C) con fórmula publicada en la descripción: compra del mes ÷ sueldo neto por hora mediano.
- **Imagen:** ilustración plana dibujada con código (SVG y HTML, `diseno/limpio.mjs` y `videos/t1/escenas.mjs`), renderizada con Chromium. Sin bancos de imágenes ni IA de imagen. Dani es un personaje inventado.
- **Voz:** sintética, Qwen3-TTS 0.6B (Apache-2.0) en local, con el timbre de una grabación de un donante de voz español publicada con licencia CC0 (proyecto Piper/Nabu Casa). No es la voz de nadie del canal. Se marca «contenido alterado o sintético» en YouTube.
- **Música y efectos:** sintetizados con código (`scripts/sonido.py`); sin pistas de terceros.
- **Tipografía:** Montserrat (licencia OFL).
- **Neutralidad:** sin partidos, sin políticos, sin atribuir causas. Cierre «mejora / empeora / depende» con el porqué.

## Cifras en pantalla y su origen
| Cifra | Valor | Estado | Origen |
|---|---|---|---|
| 12,8 h (2016) | horas de trabajo de la compra del mes | C | `filas[anyo=2016].horas_neto_mediana` |
| 12,6 h (2019) | ídem | C | `filas[anyo=2019].horas_neto_mediana` |
| 14,5 h (2024) | ídem | C | `filas[anyo=2024].horas_neto_mediana` |
| +23 % | sueldo neto por hora mediano 2016 → 2024 | C | variación de `salario_neto_hora_mediana` |
| +40 % | la misma compra 2016 → 2024 | C | variación de `cesta_euros_mes` |
| +1,7 h | horas de más cada mes | C | 14,5 − 12,8 |

Cada tarjeta con cifras lleva en pantalla «Cálculo propio con datos del INE y de Eurostat».
