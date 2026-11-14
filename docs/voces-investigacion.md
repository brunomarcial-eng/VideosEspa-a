# Voces más naturales: investigación (12-11-2026)

Lo que pidió Bruno: motores con voz más natural que la voz 3, **gratis** y con API, para España.
Regla del proyecto: nada de pago ni pruebas que luego cobren. El canal se monetizará, así que **el uso tiene que ser comercial**.

## Resumen
- Las voces que suenan «de locutor» en otros canales casi siempre son **ElevenLabs** o servicios parecidos de pago.
- **Gratis y comerciales de verdad** solo hay dos caminos:
  1. **Modelos libres en local**, como ahora: Qwen3-TTS en grande, Chatterbox V3 (tiene un modelo para España) y CosyVoice 3.
  2. **El tramo gratis permanente de Google Cloud** (voces Chirp 3 HD). Pide abrir una cuenta de Google Cloud con tarjeta, aunque no cobra si no se pasa del límite.
- Lo que propusiste no sirve, por precio o licencia: Synthesia, Kits.ai y Fish Audio (detalle abajo).
- **Siguiente paso:** casting 2 con los motores locales y dos frases de T2. Si quieres, también una muestra de Google.

## Lo que propusiste
| Servicio | Qué es | ¿Sirve? |
|---|---|---|
| **Synthesia** | Vídeos con avatar | **No.** El plan gratis lleva marca de agua y limita el uso comercial y la API (las fuentes no coinciden en el detalle). Lo serio es de pago |
| **Kits.ai** | Voces para música (conversión de voz) | **No.** El texto a voz solo está en los planes de pago y lo quitaron de la API en septiembre de 2025 |
| **Fish Audio** (¿el «Fit.ai»?) | Texto a voz muy natural | **No.** El plan gratis es solo para uso personal y la API es de pago. Su modelo abierto (OpenAudio S1-mini) es **no comercial** (CC BY-NC-SA) |
| «Voz de locutores» (Murf, Play.ht, ElevenLabs…) | Voces profesionales | **No.** Son de pago, o gratis solo sin uso comercial |

## Motores libres en local (gratis, uso comercial permitido)
| Motor | Licencia | Español de España | Nota |
|---|---|---|---|
| **Qwen3-TTS 1.7B** (el actual es el 0.6B) | Apache-2.0 | Sí (clona la voz) | Según sus autores, «más natural» que el 0.6B. Va 1,7 veces más lento. **Probar** |
| **Chatterbox Multilingual V3** (Resemble AI) | MIT | Tiene un modelo **es-ES (castellano)** | La versión que probamos antes era vieja (repetía palabras y dejaba silencios). La V3 dice corregir eso. **Probar** |
| **CosyVoice 3** (Alibaba) | Apache-2.0 | Sí, entre sus 9 idiomas | Instalación más pesada. Probar después |
| Fish Speech / OpenAudio S1-mini, XTTS-v2, F5-TTS, Spark-TTS | No comerciales | — | **Descartados** por licencia |

**La referencia importa tanto como el motor.** La voz 3 clona una grabación neutra de 8,5 s leída para un banco de voces. Una referencia más viva, de alguien que haya cedido su voz para síntesis, puede ganar más naturalidad que cambiar de motor. No se clona a nadie que no lo haya autorizado (derecho a la propia voz).

## En la nube, con tramo gratis
| Servicio | Gratis | Uso comercial | ¿Sirve? |
|---|---|---|---|
| **Google Cloud TTS, Chirp 3 HD** | Unos 1 M de caracteres al mes según fuentes no oficiales; **por confirmar** en la página de Google. Standard: 4 M al mes (oficial). Un Short gasta unos 1.000 | Sí, según las condiciones de Google Cloud (confirmar) | **Sí, si aceptas** abrir una cuenta de Google Cloud con tarjeta. Es un tramo mensual, no una prueba. Hay que darme una clave y permitir el dominio en el entorno |
| **Gemini TTS** (Google AI Studio) | Las fuentes no coinciden: parece gratis en la versión 3.1 Flash, en preview | Por confirmar | Es muy expresivo (se le pide el tono por texto), pero no está claro que tenga acento de España. **Menos seguro** |
| **Azure F0** (Microsoft) | 0,5 M de caracteres al mes | Según las condiciones de Microsoft, solo en el plan de pago | **No** |
| **Edge-TTS** | Gratis | Uso no oficial; Microsoft dice que el uso comercial puede incumplir sus condiciones | **No** |

## Propuesta
1. **Casting 2 en local**, con las mismas dos frases de T2:
   - (a) la voz 3 actual;
   - (b) Qwen3-TTS 1.7B con la misma referencia;
   - (c) Chatterbox V3 con el modelo de España.
   Bruno elige de oído.
2. **Si Bruno quiere**, una muestra de Google Chirp 3 HD en español de España. Necesita su cuenta de Google Cloud, una clave de API y permitir `texttospeech.googleapis.com` en el entorno.
3. Mientras tanto, T1 y T2 siguen con la voz 3. Si sale una voz mejor, se rehace la voz de T2 antes de publicarlo: se reutilizan las escenas.

## Fuentes consultadas
- Modelos libres: [BentoML](https://www.bentoml.com/blog/exploring-the-world-of-open-source-text-to-speech-models), [tts.ai](https://tts.ai/blog/open-source-text-to-speech-guide-2026/), [Qwen3-TTS en Hugging Face](https://huggingface.co/Qwen/Qwen3-TTS-12Hz-1.7B-Base), [modelos de Qwen3-TTS](https://www.mintlify.com/QwenLM/Qwen3-TTS/concepts/models), [Chatterbox Multilingual](https://www.resemble.ai/learn/models/chatterbox-multilingual), [ficha de NVIDIA](https://build.nvidia.com/resembleai/chatterbox-multilingual-tts/modelcard), [CosyVoice 3](https://huggingface.co/cstr/cosyvoice3-0.5b-2512-GGUF)
- Fish Audio: [precios de la API](https://docs.fish.audio/docs/models-pricing/pricing-and-rate-limits), [análisis de planes](https://smallest.ai/blog/fish-audio-pricing-plans-api-billing-commercial-use-in-2026), [OpenAudio S1-mini](https://huggingface.co/cocktailpeanut/oa)
- Kits.ai: [precios](https://kits.ai/pricing), [API](https://kits.ai/api)
- Synthesia: [precios 2026](https://creatify.ai/blog/synthesia-pricing-(2026)-plans-credits-and-what-you-ll-actually-pay), [plan gratis](https://costbench.com/software/ai-video-generators/synthesia/free-plan)
- Microsoft: [límites de Azure Speech](https://learn.microsoft.com/en-gb/azure/ai-services/speech-service/speech-services-quotas-and-limits), [uso comercial en F0](https://learn.microsoft.com/en-us/answers/questions/5805156/please-clarify-the-conflicting-information-regardi), [Edge-TTS](https://learn.microsoft.com/en-us/answers/questions/2088770/are-opensource-edge-tts-free-for-commercial-use)
- Google: [precios de Text-to-Speech](https://cloud.google.com/text-to-speech/pricing), [plan gratis (terceros)](https://costbench.com/software/ai-voice-tools/google-cloud-text-to-speech/free-plan/), [Gemini TTS](https://invideo.io/blog/gemini-tts-ai-voice/)
