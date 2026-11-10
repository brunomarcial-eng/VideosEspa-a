# Estado del proyecto y traspaso (10-11-2026)

Todo el trabajo está en la rama **`ccr-81547d47-rj6s55`** (no está en `main`). Léelo junto con `CLAUDE.md` y `docs/produccion.md`.

## 1. Dónde estamos
| Pieza | Estado |
|---|---|
| Datos T1 y T2 (INE, Eurostat) | **Aprobados** por Bruno. `videos/piloto/paso-1-datos.md`, `data/clean/` |
| Guion T1 **v5** (narración, voz de Bruno al 100 %) | Escrito y verificado. **Pendiente de que Bruno lo apruebe**. `videos/t1/guion.md` |
| Voz | **Sin resolver.** Bruno rechazó Kokoro (acento de América), Piper davefx y la primera prueba de Chatterbox («muy malas»). Hay un casting nuevo enviado: `videos/casting/casting-voces.mp4`. **Falta que elija** |
| Imagen, estilo «limpio» (como sus referencias) | **Código escrito y sin probar**: `diseno/limpio.mjs`, `diseno/limpio_runtime.js`, `videos/t1/escenas.mjs` |
| Sonido (música y efectos por código) | A Bruno **le gusta**. `scripts/sonido.py`. Los momentos de la v5 ya están en `videos/t1/historia.json` |
| YouTube | Código y guías listos (`scripts/youtube/`, `docs/youtube-api-conexion.md`). Falta que Bruno adjunte el JSON del cliente OAuth |
| T2, pizarra y baraja | **Aparcados** hasta que un vídeo de T1 esté bien |

## 2. Lo que Bruno ha pedido (no repetir errores)
1. **El vídeo cuenta lo que dice la voz.** Nada de diapositivas con audio. Referencias en `archive/referencias/` (ref-1 a ref-9): escena por frase, tarjeta blanca con etiqueta y titular, subtítulo grande de 2-3 palabras, barra de progreso, personaje sencillo en un sitio fijo.
2. **Voz natural y de España.** Es lo que peor está. Él decide de oído: mandar **muestras cortas y esperar** su respuesta antes de renderizar.
3. **Solo gratis.** Ni ElevenLabs ni ninguna API de pago.
4. **Texto con su voz** (`/anthropic-skills:clon-bruno` al 100 %), de persona normal, con gancho llamativo: «¿llenar el carro te cuesta más o menos que hace 10 años?». Sin sus opiniones políticas.
5. **Más tranquilo y menos cargado.** Dijo que iba demasiado rápido, que los datos no daban tiempo a leerse y que la imagen estaba saturada. Una idea por escena.
6. **No le generan retención**: preguntas más llamativas al empezar.
7. **De uno en uno**: solo T1 hasta que esté bien.
8. Lee en el **móvil**: mensajes cortos y con el resultado primero.

Versiones rechazadas: v1 (tarjetas y bustos, tres estilos), v2 collage (`videos/t1/render/t1-collage.mp4`: «tiene que mejorar mucho», voces malas, rápido y saturado).

## 3. Siguiente paso, en orden
1. **Voz.** Preguntar a Bruno qué número del casting prefiere (1-5). Si ninguna le vale, probar Orpheus en español (abajo) u ofrecerle las opciones que no son locales. Integrar el motor elegido en `scripts/voces.py` como un motor más: frase a frase, comprobando cada toma con Whisper y repitiendo si falla.
2. **Conectar el estilo limpio.** `scripts/render_historia.mjs` todavía llama a `construirHistoria` (collage). Hay que usar `construirLimpio` de `diseno/limpio.mjs` cuando `escenas.mjs` exporte `ESTILO = "limpio"`.
3. Generar voz y sonido de la v5: `voces.py` y luego `sonido.py videos/t1`.
4. **Revisar fotogramas** con `node scripts/render_historia.mjs t1 --hoja <carpeta>` y corregir: las 13 escenas nuevas no se han ejecutado nunca.
5. Renderizar, revisar el vídeo fotograma a fotograma y enviarlo. Pedir aprobación del guion v5 y del render.

## 4. Voces: lo probado
| Motor | Licencia | Resultado |
|---|---|---|
| Kokoro (`ef_dora`, `em_alex`) | Apache-2.0 | Rechazado: suena a América |
| Piper `es_ES-davefx-medium` | CC0 | Rechazado: robótico |
| Chatterbox multilingüe clonando a Piper | MIT | «Quizás un poco mejor», pero mala. Repite palabras y deja silencios largos |
| **Casting 1 y 2:** Chatterbox clonando una **grabación humana** | MIT | Pendiente de oír. La toma 2 dijo «euros» donde tocaba «horas»: hacen falta repeticiones |
| **Casting 3:** Qwen3-TTS 0.6B clonando la grabación humana | Apache-2.0 | Pendiente de oír. 15 s de audio en 67 s |
| **Casting 4 y 5:** Qwen3-TTS 1.7B, voz diseñada (hombre y mujer) | Apache-2.0 | Pendiente de oír. 20 s de audio en 105 s |
| Orpheus español (`lex-au/Orpheus-3b-Italian_Spanish-FT-Q8_0.gguf`) | Apache-2.0 | Sin probar. Voces javi, sergio y maria |

- **Grabación humana de referencia:** `diseno/voces/ref-dave.mp3` (original; también `ref-dave.wav` y su texto en `ref-dave.txt`; 8,5 s, CC0, donante de voz español del proyecto de Nabu Casa). Texto: «Detrás de las medallas y grandes triunfos que se logran en unas olimpiadas, se esconden otras que se consiguen mucho antes de llegar hasta la competición.»
- **Prueba de acento:** generar «Cinco cervezas, doce zapatos…» y la misma frase con eses. Si la primera tiene mucha menos sibilancia (4,5-10 kHz), el motor distingue z/c de s. Piper y Chatterbox la pasan.
- **Fuera de las reglas o a consultar:** ElevenLabs (de pago, prohibido). Edge-TTS es gratis pero usa un servicio de Microsoft de forma no oficial: no se ha probado; preguntar a Bruno antes. La vía oficial gratuita (Azure, nivel F0) exige cuenta con tarjeta.
- **No puedo oír:** elegí Kokoro sin detectar el acento. Whisper solo comprueba que se entiende.

## 5. Montar el entorno en una sesión nueva
Usar el entorno **«VideosEspa-a»** (permite INE, Eurostat, Hugging Face y la API de YouTube). Los modelos y entornos de Python no se conservan:
```
python3 -m venv ~/.venv-voces && ~/.venv-voces/bin/pip install piper-tts onnxruntime kokoro-onnx faster-whisper soundfile
uv venv --python /usr/bin/python3.11 ~/.venv-chatterbox && uv pip install --python ~/.venv-chatterbox/bin/python chatterbox-tts faster-whisper
uv venv --python /usr/bin/python3.12 ~/.venv-qwen && uv pip install --python ~/.venv-qwen/bin/python qwen-tts
```
- Poner siempre `HF_HUB_DISABLE_XET=1` (el otro servidor de Hugging Face está bloqueado).
- Chatterbox: si `perth.PerthImplicitWatermarker` es `None`, sustituirlo por `perth.DummyWatermarker`.
- Guiones de prueba listos: `scripts/pruebas/cb_cast.py` y `scripts/pruebas/qwen_cast.py`.
- Disco justo (unos 6 GB libres con todo instalado): instalar solo el motor que se vaya a usar.

## 6. Trampas conocidas
- Lanzar varios renders o voces a la vez los ralentiza todos (4 núcleos).
- `voces.py` da el tiempo de cada palabra; `historia.json` ancla a esas palabras la imagen y el sonido. Si cambia el texto, revisar los anclajes.
- El verificador (`scripts/verificar_guion.py`) exige fuente en cada plano con cifras y un máximo de 2 cifras por imagen (3 en gráficos).
- «Hoy» es 2024, el último año con salarios del INE: decirlo siempre en pantalla.
- Nada de commits con `videos/*/audio/*.wav` (están en `.gitignore`).
- La clave de ElevenLabs sigue guardada en el entorno y no se usa: Bruno puede borrarla en los ajustes del entorno.
