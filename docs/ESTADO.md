# Estado del proyecto y traspaso (12-11-2026)

Todo el trabajo está en la rama **`ccr-03be754b-81ccws`** (viene de `ccr-81547d47-rj6s55`; no está en `main`). Léelo junto con `CLAUDE.md` y `docs/produccion.md`.

## 1. Dónde estamos
| Pieza | Estado |
|---|---|
| Datos T1 y T2 (INE, Eurostat) | **Aprobados** por Bruno. `videos/piloto/paso-1-datos.md`, `data/clean/`. Para T2 v4 se añade la población residente a 1 de julio (INE, serie ECP320, `data/raw/ine_ecp320_poblacion.json`): **pendiente de aprobar** |
| **T1** | **Aprobado para publicar** (Bruno, 12-11-2026). Vídeo `videos/t1/render/t1-limpio.mp4`. Ficha para Studio `upload/t1.md` (título, descripción con fuentes, etiquetas, casillas), portada `upload/t1-portada.png`. Archivo para apelaciones `archive/t1/`. **La subida la hace Bruno a mano en Studio** |
| **T2** | **Rehecho (v4), pendiente de aprobar.** Bruno la ve «mucho mejor» (12-11-2026); pidió quitar barbas, aclarar pieles y cambiar el final (hecho). Bruno aprobó la v3 y luego la rechazó el 12-11-2026: no se entendía. Faltaba decir que es España y la bandera, las cifras no tenían base («¿4,8 millones más sobre cuánto?») y la gente paseando no aportaba. La v4 son tres «fotos» (2007, 2016 y hoy) con habitantes, trabajando y en paro en cifras absolutas, comercios con gente trabajando, un tablón de empleo, rosquillas y barras. Guion `videos/t2/guion.md`, escaleta `videos/t2/escaleta.md`, vídeo `videos/t2/render/t2-limpio.mp4` (94 s). **No subir hasta que Bruno apruebe la v4.** `archive/t2/` aún tiene la v3 |
| **Voz** | Tras el casting 2 de motores (`videos/casting/casting-motores.mp4`), Bruno **se queda con la voz 1, la actual** (voz 3 del primer casting, Qwen3-TTS 0.6B), el 12-11-2026. Investigación en `docs/voces-investigacion.md`. Queda abierta la prueba de Google Chirp 3 HD si Bruno da una clave de Google Cloud |
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
7. **De uno en uno**: T1 aprobado; T2 rehecho y pendiente; el siguiente vídeo, cuando Bruno lo elija.
10. **Personajes y final (T2 v4, 12-11-2026):** piel sobre todo clara, algún hispanoamericano; sin barbas sin bigote (solo el carnicero). Nada de «depende» por defecto: veredicto claro (mejora o empeora) y una pregunta final que abra debate («¿Cómo puede ser? ¿Tú cómo te lo explicas?»).
9. **Que se entienda (T2, 12-11-2026):** decir siempre de qué país hablamos (España, con la bandera al empezar). Cifras absolutas con su base («antes éramos X, ahora Y»). Gráficos que se lean de un vistazo (rosquilla, quesito, barras). Escenas que enseñen la idea (gente trabajando en comercios, no gente paseando). El título exacto que diga Bruno.
8. Lee en el **móvil**: mensajes cortos y con el resultado primero. Revisar los fotogramas antes de enviar nada.

Versiones rechazadas: v1 (tarjetas y bustos, tres estilos), v2 collage (`videos/t1/render/t1-collage.mp4`: «tiene que mejorar mucho», voces malas, rápido y saturado).

## 3. Siguiente paso, en orden
1. Bruno revisa la v4 de T2 (vídeo, datos nuevos de población y guion). Si la aprueba: `python3 scripts/ficha.py t2`, portada y `archive/t2/` con la v4.
1. Bruno sube T1 (y T2 cuando esté aprobado) a mano en Studio con `upload/<id>.md` (contenido sintético: sí; no es para niños).
2. Elegir con Bruno el tercer vídeo del backlog (`docs/backlog-videos.md`) y repetir el flujo: datos → guion (clon-bruno) y escaleta → aprobación → voz, escenas, sonido → fotogramas → render.
3. Si Bruno quiere probar Google Chirp 3 HD: necesita su cuenta de Google Cloud, una clave de API y permitir `texttospeech.googleapis.com` en el entorno.
4. La voz 5 (personaje secundario) está fijada en `diseno/voces/ref-voz5.wav`; se usará cuando Bruno lo pida, con una muestra previa.
5. Cuando Bruno conecte la API de YouTube (JSON del cliente OAuth), leer métricas con `scripts/youtube/metricas.py`.

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

## 8. Piezas nuevas (T2 v4)
- `diseno/barrio.mjs`: bandera (icono de tarjeta), mapa de España con figuritas (`diseno/mapa_espana.json`, Natural Earth, dominio público), fachadas de comercio con alguien trabajando en el escaparate y persiana, interiores (carnicería, cafetería, agencia de viajes, taller), tablón de ofertas de empleo con cola, rosquilla «de cada 100».
- `persona()` admite ropa, delantal, gorro, piel y pelo propios; el runtime tiene `trabaja()` (alterna posturas del brazo) y `vapor()`.
- `sonido.py`: campanilla de puerta, persiana, vapor y golpe.
- `verificar_guion.py`: operación `pct_de` (a como % de b) y `duracion_max_s` por guion.
- `descargar_datos.py` acepta nombres de fichero para bajar solo esos.
