# Estado del proyecto y traspaso (12-11-2026)

Todo el trabajo está en la rama **`ccr-03be754b-81ccws`** (viene de `ccr-81547d47-rj6s55`; no está en `main`). Léelo junto con `CLAUDE.md` y `docs/produccion.md`.

## 1. Dónde estamos
| Pieza | Estado |
|---|---|
| Datos T1 y T2 (INE, Eurostat) | **Aprobados** por Bruno. `videos/piloto/paso-1-datos.md`, `data/clean/` |
| **T1** | **Aprobado para publicar** (Bruno, 12-11-2026). Vídeo `videos/t1/render/t1-limpio.mp4`. Ficha para Studio `upload/t1.md` (título, descripción con fuentes, etiquetas, casillas), portada `upload/t1-portada.png`. Archivo para apelaciones `archive/t1/`. **La subida la hace Bruno a mano en Studio** |
| **T2** | Guion **v3** narrado (voz de Bruno, verificado: 13 cifras, unos 78 s) y escaleta escena a escena. **Pendiente de que Bruno los apruebe.** `videos/t2/guion.md`, `videos/t2/escaleta.md` |
| Voz | **Resuelta: la voz 3 del casting** («nuestra voz, definitivamente», Bruno, 10-11-2026). Qwen3-TTS 0.6B clonando `diseno/voces/ref-dave.wav`. Integrada en `scripts/voces.py` con control de cada toma por Whisper |
| Voz 5 del casting | A Bruno le hizo gracia (acento «ruso»). **Reservada** para un segundo personaje o una aparición puntual. Perfil `secundario` en `diseno/voces.json`; muestra en `diseno/voces/casting-voz5.wav` |
| Imagen, estilo «limpio» | **Conectado y probado**: `render_historia.mjs` lo usa cuando `escenas.mjs` exporta `ESTILO = "limpio"`. Fotogramas de las 13 escenas revisados y corregidos |
| Sonido (música y efectos por código) | A Bruno **le gusta**. `scripts/sonido.py` |
| YouTube | Código y guías listos (`scripts/youtube/`, `docs/youtube-api-conexion.md`). Falta que Bruno adjunte el JSON del cliente OAuth |
| Pizarra y baraja | Aparcados. El estilo del canal es el limpio |

## 2. Lo que Bruno ha pedido (no repetir errores)
1. **El vídeo cuenta lo que dice la voz.** Nada de diapositivas con audio. Referencias en `archive/referencias/` (ref-1 a ref-9): escena por frase, tarjeta blanca con etiqueta y titular, subtítulo grande de 2-3 palabras, barra de progreso, personaje sencillo en un sitio fijo.
2. **Voz natural y de España.** Ya eligió la 3. Si hay que cambiar algo de la voz, mandar **muestras cortas y esperar** su respuesta.
3. **Solo gratis.** Ni ElevenLabs ni ninguna API de pago.
4. **Texto con su voz** (`/anthropic-skills:clon-bruno` al 100 %), de persona normal, con gancho llamativo. Sin sus opiniones políticas.
5. **Más tranquilo y menos cargado.** Una idea por escena. No recortar las pausas naturales de la voz; cada tarjeta con dato se queda en pantalla un segundo más.
6. **Retención**: preguntas llamativas al empezar.
7. **De uno en uno**: ahora T2, hasta que esté bien.
8. Lee en el **móvil**: mensajes cortos y con el resultado primero. Revisar los fotogramas antes de enviar nada.

Versiones rechazadas: v1 (tarjetas y bustos, tres estilos), v2 collage (`videos/t1/render/t1-collage.mp4`: «tiene que mejorar mucho», voces malas, rápido y saturado).

## 3. Siguiente paso, en orden
1. Esperar a que Bruno apruebe el **guion v3 de T2** y la **escaleta** (y si quiere la voz 5 en la escena 9).
2. Voz de T2: `~/.venv-qwen/bin/python scripts/voces.py videos/t2/guion.json`.
3. Escenas de T2 en estilo limpio (`videos/t2/escenas.mjs` con `ESTILO = "limpio"`) y `videos/t2/historia.json` (momentos anclados a palabras). Piezas nuevas en la escaleta: calle, Marta, multitud, rejilla de 100, contador, línea del paro.
4. Sonido (`sonido.py videos/t2`), revisar fotogramas, render, revisar fotograma a fotograma y enviar.
5. Al aprobarlo: `python3 scripts/ficha.py t2` (añadir antes su entrada, método y cierre en `ficha.py`) y `archive/t2/`.
6. Si Bruno publica T1 y conecta la API (JSON del cliente OAuth), leer métricas con `scripts/youtube/metricas.py`.

## 4. Lo que se hizo en esta sesión
- `diseno/tokens.json` no estaba en git (lo ignoraba la regla `token*.json`) y el render fallaba: se reconstruyó desde `diseno/contraste.md` y se versiona.
- Estilo limpio: decorado más ancho que el encuadre (sin bordes negros al hacer zoom), subtítulo bajo los pies de Dani (no le tapa), ancho máximo del subtítulo para no meterse bajo los botones de Shorts, gráfico de barras que cabe en la tarjeta, la pantalla de la caja solo enseña cifras donde toca (antes dependía del orden de render), menos rótulos sueltos.
- `scripts/voces.py`: motor `qwen-clon`; Whisper escucha cada toma (palabras que faltan, repeticiones, cifras, ritmo y pausa tras «…») y repite con otra semilla; alinea cada palabra con lo que oye Whisper; caché de tomas por línea en `videos/t1/audio/tomas/` con `registro.txt`.
- Voz de T1 generada: las 13 líneas válidas, 69 s en total. La línea 11 («cada mes… para llevarte lo mismo») no hacía la pausa con ninguna semilla: se dice en dos trozos unidos por una pausa de 0,45 s.
- Primer render limpio: `videos/t1/render/t1-limpio.mp4` (69 s, −14,7 LUFS). Revisado a un fotograma por segundo antes de enviarlo.

## 5. Voces: lo probado
| Motor | Licencia | Resultado |
|---|---|---|
| Kokoro (`ef_dora`, `em_alex`) | Apache-2.0 | Rechazado: suena a América |
| Piper `es_ES-davefx-medium` | CC0 | Rechazado: robótico |
| Chatterbox multilingüe (casting 1 y 2) | MIT | No elegidas |
| **Qwen3-TTS 0.6B clonando la grabación humana (casting 3)** | Apache-2.0 | **Elegida** |
| Qwen3-TTS 1.7B voz diseñada, hombre (casting 4) | Apache-2.0 | No elegida |
| Qwen3-TTS 1.7B voz diseñada, mujer (casting 5) | Apache-2.0 | Reservada para un personaje secundario |

- **Grabación humana de referencia:** `diseno/voces/ref-dave.wav` (8,5 s, CC0, donante de voz español del proyecto de Nabu Casa) y su texto en `ref-dave.txt`.
- **No puedo oír.** Whisper solo comprueba que se entiende y que no faltan ni sobran palabras. El acento y la naturalidad los juzga Bruno.

## 6. Montar el entorno en una sesión nueva
Usar el entorno **«VideosEspa-a»** (permite INE, Eurostat, Hugging Face y la API de YouTube). Los modelos y entornos de Python no se conservan:
```
uv venv --python /usr/bin/python3.12 ~/.venv-qwen
UV_HTTP_TIMEOUT=300 uv pip install --python ~/.venv-qwen/bin/python qwen-tts faster-whisper soundfile
```
- Tarda bastante (unos 8 GB de PyTorch con CUDA; el índice de PyTorch para CPU está bloqueado). Lanzarlo en segundo plano con un tiempo máximo largo.
- `HF_HUB_DISABLE_XET=1` (el script ya lo pone): el otro servidor de Hugging Face está bloqueado.
- Las tomas de voz (`videos/t1/audio/tomas/*.wav`) no están en git: hay que regenerarlas (unos 6 minutos).

## 7. Trampas conocidas
- Lanzar la voz y el render a la vez los ralentiza (4 núcleos).
- `voces.py` da el tiempo de cada palabra; `historia.json` ancla a esas palabras la imagen y el sonido. Si cambia el texto, revisar los anclajes (`sonido.py` avisa si una palabra ya no está).
- El verificador (`scripts/verificar_guion.py`) exige fuente en cada plano con cifras y un máximo de 2 cifras por imagen (3 en gráficos).
- «Hoy» es 2024, el último año con salarios del INE: decirlo siempre en pantalla.
- Nada de commits con `.wav` de `videos/*/audio/` (están en `.gitignore`).
- Qwen3-TTS: con «…» a mitad de frase a veces no hace pausa (`voces.py` lo detecta y parte la frase). Sin tope, una toma puede desbocarse hasta 2048 pasos (casi 3 minutos de audio): `voces.py` pone `max_new_tokens` según el largo del texto.
- Cualquier estado que una escena deje en un elemento compartido (como la pantalla de la caja) hay que fijarlo en cada fotograma: el vídeo se renderiza en cuatro partes y cada una empieza en un sitio distinto.
- La clave de ElevenLabs sigue guardada en el entorno y no se usa: Bruno puede borrarla en los ajustes del entorno.
