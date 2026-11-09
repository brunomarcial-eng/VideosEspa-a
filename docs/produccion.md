# Producción de un Short (de guion a vídeo)

Todo es gratuito y local: sin APIs de pago. Los personajes, gráficos y efectos se generan con código; las voces, con modelos libres que permiten uso comercial.

## Flujo
```
1. Datos        python3 scripts/descargar_datos.py && python3 scripts/calcular_t1_t2.py
2. Guion        videos/<id>/guion.json  ->  python3 scripts/verificar_guion.py videos/<id>/guion.json
3. Dirección    videos/<id>/direccion.json (tarjeta y actuación por plano)
4. Voz          ~/.venv-voces/bin/python scripts/voces.py videos/<id>/guion.json
5. Efectos      python3 scripts/mezcla.py videos/<id>
6. Vídeo        node scripts/render_video.mjs <id> A|B|C          (un fotograma: --fotograma 12.5)
```
Salida: `videos/<id>/render/<id>-<estilo>.mp4` (1080×1920, 30 fps, audio a −14 LUFS).

## Controles automáticos
| Paso | Qué comprueba | Si falla |
|---|---|---|
| `verificar_guion.py` | Cada cifra contra `data/clean`, sin números sueltos, sello en cada plano con cifras, máximo 2 cifras por imagen (3 en gráficos), sin 2020 ni vetados, cierre, 3 años, 45-60 s | No se genera `guion.md` |
| `diseno/video.mjs` | Las cifras de las tarjetas están en la pantalla del guion de ese plano | No se renderiza |
| `voces.py` | Whisper transcribe cada frase y debe oír cada cifra del guion | Sale con error |

## Voces
- **Kokoro-82M** (Apache-2.0): `ef_dora` (mujer), `em_alex` y `em_santa` (hombre). Es la opción por defecto.
- **Piper** (`es_ES-davefx-medium`, CC0; `es_ES-sharvard-medium`, CC BY 3.0 → citar en la descripción).
- La misma persona en dos épocas usa la misma voz: la de antes, tono ×1,05 y algo más rápida; la de hoy, tono ×0,97. Configuración en `diseno/voces.json`.
- Las cifras se pasan a palabras antes de sintetizar («12,8» → «doce coma ocho»).

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
python3 -m venv ~/.venv-voces
~/.venv-voces/bin/pip install piper-tts onnxruntime kokoro-onnx faster-whisper soundfile
# Modelos en ~/.modelos-voz (Hugging Face; con HF_HUB_DISABLE_XET=1):
#   kokoro/model_quantized.onnx y voices/{ef_dora,em_alex,em_santa}.bin  (onnx-community/Kokoro-82M-v1.0-ONNX)
#   es_ES-davefx-medium.onnx(.json), es_ES-sharvard-medium.onnx(.json)   (rhasspy/piper-voices)
```
Para descargar los modelos, el entorno debe permitir `huggingface.co` y `us.aws.cdn.hf.co`. Chromium y Playwright ya vienen instalados.

## Tiempos
Un Short de 50 s tarda unos 8 minutos por estilo (0,3 s por fotograma). Los tres estilos se pueden renderizar en paralelo.
