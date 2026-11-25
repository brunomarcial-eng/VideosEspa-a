# Producción de un Short (de guion a vídeo)

Todo es gratuito y local: sin APIs de pago. Los personajes, gráficos y efectos se generan con código; las voces, con modelos libres que permiten uso comercial.

## Flujo (vídeo narrado, estilo limpio)
```
1. Datos        python3 scripts/descargar_datos.py && python3 scripts/calcular_t1_t2.py
2. Guion        videos/<id>/guion.json  ->  python3 scripts/verificar_guion.py videos/<id>/guion.json
3. Historia     videos/<id>/historia.json (momentos clave anclados a palabras) y escenas.mjs (una escena por frase)
4. Voz          ~/.venv-qwen/bin/python scripts/voces.py videos/<id>/guion.json   [--rehacer 3,7]
5. Sonido       python3 scripts/sonido.py videos/<id>        (música, efectos y tiempos de los momentos)
6. Revisión     node scripts/render_historia.mjs <id> --hoja <carpeta>   (dos fotogramas por plano)
7. Vídeo        node scripts/render_historia.mjs <id>        (cuatro partes en paralelo)
```
Salida: `videos/<id>/render/<id>-limpio.mp4` (1080×1920, 30 fps, audio a −14 LUFS). El estilo lo decide `escenas.mjs`: si exporta `ESTILO = "limpio"` usa `diseno/limpio.mjs`; si no, el collage antiguo (`diseno/historia.mjs`).

Estilo limpio (como las referencias de Bruno): barra de progreso por capítulos arriba, tarjeta blanca con etiqueta roja y titular (o la cifra grande con su fuente), la escena en el centro y el subtítulo grande de dos o tres palabras justo debajo de los pies del personaje, para no taparle. Piezas en `diseno/limpio.mjs` (Dani, carro, productos, moneda, reloj, nómina, bocadillo, decorados) y `diseno/limpio_runtime.js` (movimiento, subtítulos, cámara). Colores del canal en `diseno/tokens.json`.

**La regla de oro:** el vídeo cuenta lo que dice la voz. Cada frase tiene su escena y las acciones ocurren en la palabra exacta (el pan cae al decir «pan»). Referencias visuales en `archive/referencias/`; storyboard de ejemplo en `videos/t1/storyboard.md`.

Piezas reutilizables:
- `diseno/atrezo.mjs`: decorados (súper, mostrador, papel, fondo oscuro) y objetos de papel (carro, caja registradora, moneda-reloj, calendario, nómina, tickets, sellos, fichas de cifra).
- `diseno/historia_runtime.js`: utilidades de animación (`pop`, `caer`, `ir`, `actor`), subtítulos palabra a palabra y sello de fuente.
- `scripts/sonido.py`: un efecto por tipo de acción y la base musical, todo sintetizado.

El flujo anterior (diálogo de dos bustos, `scripts/render_video.mjs` y `diseno/video.mjs`) queda como histórico: no contaba la historia con la imagen.

## Controles automáticos
| Paso | Qué comprueba | Si falla |
|---|---|---|
| `verificar_guion.py` | Cada cifra contra `data/clean`, sin números sueltos, sello en cada plano con cifras, máximo 2 cifras por imagen (3 en gráficos), sin 2020 ni vetados, cierre, 3 años, 45-60 s | No se genera `guion.md` |
| `diseno/video.mjs` | Las cifras de las tarjetas están en la pantalla del guion de ese plano | No se renderiza |
| `voces.py` | Whisper escucha cada toma: no puede faltar ninguna palabra, sobrar nada (repeticiones) ni faltar una cifra. Si falla, repite con otra semilla (hasta 5) | Sale con error y dice qué línea repetir |

## Voces
- **Narrador: la voz 3 del casting** (elegida por Bruno el 10-11-2026): Qwen3-TTS 0.6B (Apache-2.0, local y gratis) clonando la grabación humana `diseno/voces/ref-dave.wav` (CC0). Cada línea del guion se dice de una vez, con su entonación; Whisper la escucha y, si algo falla, se repite. Muestra del casting: `diseno/voces/casting-voz3.wav`.
- **Voz 5 del casting** (mujer, Qwen3-TTS 1.7B VoiceDesign, `diseno/voces/casting-voz5.wav`): a Bruno le hizo gracia su acento «ruso». Reservada para un segundo personaje o una aparición puntual. Antes de usarla hay que fijarla (una toma de referencia clonada con el modelo base), porque la voz diseñada cambia un poco en cada frase.
- Las tomas quedan en `videos/<id>/audio/tomas/` (semilla, lo que oyó Whisper y `registro.txt`). Una línea que no cambia no se vuelve a generar; `--rehacer N` la repite con otra semilla.
- Reserva: Piper `es_ES-davefx-medium` (CC0) y `es_ES-sharvard-medium` (CC BY 3.0, citar). **Kokoro, descartado:** suena a América.
- Las cifras se pasan a palabras antes de sintetizar («12,8» → «doce coma ocho»).
- Crédito en la descripción: «Voz: Qwen3-TTS (Apache-2.0) con timbre de una grabación CC0 del proyecto Piper».

## Personajes (estilos B y C)
Títeres de recortes de papel (`diseno/titeres.mjs` y `diseno/titeres_runtime.js`):
- **Piezas:** cuerpo, cuello, pelo detrás, cara, pelo delante y mano. Cada pieza tiene borde de papel rasgado y sombra sobre la de debajo; la cara lleva trama de imprenta para dar volumen.
- **Movimiento a 12 imágenes por segundo** (stop-motion), con un ligero temblor de papel.
- **Al hablar:** la boca sigue el volumen de la voz (cerrada, media, abierta) y la cabeza cabecea.
- **Al escuchar:** asiente y reacciona; parpadea cada 2,6-4,4 s.
- **Expresiones:** neutra, contenta, sorpresa, duda, seria y explicando. **Gestos:** abajo, explicar, arriba y saludo.
- **Protagonistas que rotan** de vídeo en vídeo (mujer, hombre…). Son personas inventadas; la misma en dos épocas lleva ropa ocre (antes) y azul (hoy).
- En C, cada personaje va pegado dentro de una carta con el año en la esquina.

Estilo A (pizarra): sin personas. El diálogo se escribe con tiza, con el nombre en el color de su época, y la cifra de hoy tacha la del pasado.

## Instalación en una sesión nueva
```
uv venv --python /usr/bin/python3.12 ~/.venv-qwen
UV_HTTP_TIMEOUT=300 uv pip install --python ~/.venv-qwen/bin/python qwen-tts faster-whisper soundfile
```
Tarda un buen rato (baja PyTorch con CUDA, unos 8 GB, porque el índice de PyTorch solo para CPU está bloqueado). Lánzalo en segundo plano. El modelo de voz (Qwen/Qwen3-TTS-12Hz-0.6B-Base) y Whisper `small` se bajan solos de Hugging Face la primera vez (con `HF_HUB_DISABLE_XET=1`, que el script ya pone). El entorno debe permitir `huggingface.co` y `us.aws.cdn.hf.co`. Chromium y Playwright ya vienen instalados.

Motores de reserva (Piper y Kokoro): `python3 -m venv ~/.venv-voces && ~/.venv-voces/bin/pip install piper-tts onnxruntime kokoro-onnx faster-whisper soundfile`, con los modelos en `~/.modelos-voz`.

## Tiempos
- Voz: unas 4-5 veces lo que dura (70 s de voz, unos 6 minutos), más las repeticiones.
- Vídeo: unos 0,3 s por fotograma repartidos en cuatro procesos; un Short de 70 s, unos 10 minutos. No lances la voz y el render a la vez: la máquina tiene 4 núcleos.
