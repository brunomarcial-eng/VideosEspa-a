# T3 · Notas de edición (archivo por si hay apelación)

**Vídeo:** «¿Quién lo tuvo más difícil para comprar casa: tu padre o tú?» · Short vertical 1080×1920, 62 s.
**Fichero publicado:** `videos/t3/render/t3-limpio.mp4` · SHA-256 `5d40f42e53af97069f286dccb53f4fb7ad4319bcb877b99df85a86921dbd3413`.
**Aprobado para publicar:** por el responsable del canal, el 16-11-2026.

## Qué hay en esta carpeta
| Fichero | Qué es |
|---|---|
| `guion.json` · `guion.md` | Guion v4 (discusión padre-hijo), con cada cifra contrastada contra los datos (`scripts/verificar_guion.py`) |
| `escaleta.md` | Escena a escena (versión 1; luego se acortó: ver el historial del guion) |
| `paso-1-datos.md` | Tabla de datos aprobada, con las comprobaciones (índice de precios del INE frente al valor tasado) |
| `t3_vivienda.json` | Datos limpios (`scripts/calcular_t3.py`) |
| `datos-crudos/` | Ficheros originales del Banco de España, del Ministerio de Vivienda y del INE (incluidos los PDF de los anuarios de 1987 y 1988), con su huella SHA-256 en `MANIFEST.csv`. Los microdatos de la Encuesta de Estructura Salarial de 2006 (72 MB) no se copian: enlace y huella en el MANIFEST |
| `historia.json` | Momentos de imagen y sonido anclados a palabras |
| `voz-registro.txt` | Última pasada de la voz |

## Cómo se hizo (todo original y generado con código)
- **Guion:**
  - Discusión escrita para este vídeo entre un padre de 62 años y su hijo de 31, personajes inventados.
  - Cada uno defiende su postura con un dato oficial.
  - Sin partidos, sin políticos y sin atribuir causas.
- **Cifras:**
  - **Piso de 90 m²:** supuesto.
  - **1986:**
    - Precio: 301,5 €/m², media de junio y diciembre de 1986, sociedades de tasación (Banco de España, V). Por 90 m² salen 27.135 €, unos 4,5 millones de pesetas (C).
    - Sueldo: 740 pesetas por hora trabajada en la industria y los servicios (Anuario del INE de 1987, V), por 1.786,8 horas de jornada pactada en convenio en 1986 (Anuario de 1988, V). Salen 1.322.232 pesetas ≈ 7.947 € (C).
    - Resultado: 3,4 años de sueldo (C).
  - **Hoy:**
    - Precio: valor tasado medio de la vivienda libre en España, 1.er semestre de 2026 (Ministerio de Vivienda vía Banco de España, V). Por 90 m² salen 210.182 € (C).
    - Sueldo: sueldo medio de 2024, 29.540 € (Encuesta Anual de Estructura Salarial, INE, V).
    - Resultado: 7,1 años de sueldo (C).
  - **Descontando la inflación (IPC del INE enlazado desde 1961):** el sueldo medio sube un 16 % y el piso se multiplica por 2,3 (C).
  - **Hipotecas al 15 %:** tipo medio de los préstamos para vivienda en 1989, primer año de la serie (Banco de España, V).
  - **La cuota se comía el 47 % y hoy el 38 %:** esfuerzo teórico sin deducciones, media de 1987 y junio de 2026 (Banco de España, V).
  - **En 2006, 8,9 años:** sale en pantalla, en pequeño. Precio de 2006 (Banco de España) entre el sueldo medio de 2006 (microdatos de la Encuesta de Estructura Salarial del INE) (C).
- **Imagen:** ilustración plana dibujada con código (`diseno/limpio.mjs`, `diseno/casa.mjs`, `videos/t3/escenas.mjs`) y renderizada con Chromium. Sin bancos de imágenes ni IA de imagen. Sin marcas.
- **Voces:**
  - Generadas en local con Qwen3-TTS (Apache-2.0). Las dos son inventadas a partir de una descripción (VoiceDesign), sin clonar a ninguna persona.
  - Se fijan clonando sus propias tomas: `diseno/voces/ref-padre.wav` y `ref-hijo.wav`.
  - Se marca «contenido alterado o sintético».
- **Música y efectos:** sintetizados con código (`scripts/sonido.py`).
- **Final:** por decisión del responsable del canal (15-11-2026), el vídeo no dice el veredicto en voz alta y acaba con una pregunta abierta. El veredicto está en la descripción: comprar casa cuesta el doble de años de sueldo que en 1986; pagar la cuota, algo menos.
