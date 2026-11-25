# T4 · Notas de edición (archivo por si hay apelación)

**Vídeo:** «¿De verdad los jóvenes se lo gastan todo en Netflix?» · Short vertical 1080×1920, 63,5 s.
**Fichero publicado:** `videos/t4/render/t4-limpio.mp4` · SHA-256 `18dc6ee573e3bf4cf65cf7f0f8cd8be0fe9ecc4d36ff16b2343b88353c401ce4`.
**Aprobado para publicar:** por el responsable del canal, el 17-11-2026 («el vídeo T4 está bastante bien»).

## Qué hay en esta carpeta
| Fichero | Qué es |
|---|---|
| `guion.json` · `guion.md` | Guion v5 (padre contra hijo, 2.ª parte), con cada cifra contrastada contra los datos (`scripts/verificar_guion.py`) |
| `escaleta.md` | Escena a escena, con el decorado de cada frase |
| `paso-1-datos-v4.md` | Tabla de datos y veredicto sobre la hipótesis del responsable |
| `t4_netflix.json` | Datos limpios (`scripts/calcular_t4.py`) |
| `datos-crudos/` | Ficheros originales del INE (Anuario de 1989 y EPF), Eurostat y Banco de España, con su huella SHA-256 en `MANIFEST.csv` |
| `historia.json` | Momentos de imagen y sonido anclados a palabras |
| `voz-registro.txt` | Registro de las tomas de voz |

## Cómo se hizo (todo original y generado con código)
- **Guion:** discusión escrita para este vídeo entre un padre de 62 años y su hijo de 31, personajes inventados; sin partidos, sin políticos y sin atribuir causas.
- **Cifras («de cada 100 € que gasta un hogar»):**
  - 1986: Encuesta Continua de Presupuestos Familiares, Anuario Estadístico del INE de 1989, tabla 2.2.6 (V).
  - 2016 y 2025: Encuesta de Presupuestos Familiares del INE, gasto total, tablas 73778 y 73779 (V).
  - Ocio = ocio y cultura + restaurantes, cafés y hoteles + comunicaciones (C, suma de grupos).
  - El gasto total incluye el alquiler imputado en los dos años; la clasificación de grupos cambió, así que la comparación es aproximada (se dice en la descripción).
  - «¡Casi el doble!»: 33,2 / 18,8 = 1,77 (C).
  - Alquiler sobre la renta: media ponderada de Eurostat (ilc_mded02, 2025): una persona sola, 39 %; dos adultos, 27 %; UE, 29 % (V).
  - Emancipación: Eurostat (yth_demo_030, 2025): España 30,2; UE 26,3 (V).
- **Imagen:** ilustración plana dibujada con código (`diseno/limpio.mjs`, `diseno/casa.mjs`, `diseno/sueno.mjs`, `videos/t4/escenas.mjs`), renderizada con Chromium. Los decorados cambian con un filtro de ondas. Sin bancos de imágenes, sin IA de imagen y sin marcas.
- **Voces:** Qwen3-TTS (Apache-2.0) en local; dos voces inventadas a partir de una descripción (VoiceDesign) y fijadas clonando sus propias tomas (`diseno/voces/ref-padre.wav`, `ref-hijo.wav`). Las tomas se eligen por parecido con las voces aprobadas en T3.
- **Música y efectos:** generados con código (`scripts/sonido.py`).
- **Contenido alterado o sintético:** sí, se marca al subir.
