# T5 · Notas de edición (archivo por si hay apelación)

**Vídeo:** «¿Y los nietos pa cuándo?» · Short vertical 1080×1920, 52,4 s.
**Fichero publicado:** `videos/t5/render/t5-limpio.mp4` · SHA-256 `7ac590edb28098f895aae3fd33abc0a00f394b4e0dcbec517648e15e56c9a496`.
**Aprobado para publicar:** por el responsable del canal, el 17-11-2026 («Está perfecto. T5 check»).

## Qué hay en esta carpeta
| Fichero | Qué es |
|---|---|
| `guion.json` · `guion.md` | Guion (padre contra hijo, 3.ª parte), con cada cifra contrastada contra los datos (`scripts/verificar_guion.py`) |
| `escaleta.md` | Escena a escena, con el decorado de cada frase |
| `paso-1-datos.md` | Tabla de datos aprobada y contraste de las hipótesis del responsable |
| `t5_natalidad.json` | Datos limpios (`scripts/calcular_t5.py`) |
| `datos-crudos/` | Ficheros originales del INE (Indicadores Demográficos Básicos y Encuesta de Fecundidad 2018) y del Banco de España, con su huella SHA-256 en `MANIFEST.csv` |
| `historia.json` | Momentos de imagen y sonido anclados a palabras |

## Cómo se hizo (todo original y generado con código)
- **Guion:** discusión escrita para este vídeo entre un padre de 62 años y su hijo de 31, personajes inventados; sin partidos ni causas. Lo que «dicen ellas» es literal de la nota del INE sobre la Encuesta de Fecundidad 2018.
- **Cifras:**
  - Piso medio en años de renta bruta de un hogar: 3,1 (1987) y 8,4 (junio de 2026), Banco de España (V).
  - Edad media al primer matrimonio: 26,0 (1986) y 36,2 (2024), INE (V).
  - Edad media de la madre al primer hijo: 25,9 (1986) y 31,5 (2024), INE (V).
  - Hijos por mujer: 1,55 (1986) y 1,10 (2024), INE (V).
  - «Casi tres de cada cuatro mujeres desearían tener al menos dos hijos» y los motivos a partir de los 35 años: INE, Encuesta de Fecundidad 2018 (V).
- **Imagen:** ilustración plana dibujada con código (`diseno/sueno.mjs`, `videos/t5/escenas.mjs`), renderizada con Chromium. Sin bancos de imágenes, sin IA de imagen y sin marcas.
- **Voces:** Qwen3-TTS (Apache-2.0) en local, las mismas voces inventadas de T3 y T4.
- **Música y efectos:** generados con código (`scripts/sonido.py`).
- **Contenido alterado o sintético:** sí, se marca al subir.
