# Estado del proyecto y traspaso (12-11-2026)

Todo el trabajo está en la rama **`ccr-03be754b-81ccws`** (viene de `ccr-81547d47-rj6s55`; no está en `main`). Léelo junto con `CLAUDE.md` y `docs/produccion.md`.

## 1. Dónde estamos
| Pieza | Estado |
|---|---|
| Datos T1 y T2 (INE, Eurostat) | **Aprobados** por Bruno. `videos/piloto/paso-1-datos.md`, `data/clean/`. T2 v4 añade la población residente a 1 de julio (INE, serie ECP320), aprobada el 14-11-2026 |
| **T1** | **Aprobado para publicar** (Bruno, 12-11-2026). Vídeo `videos/t1/render/t1-limpio.mp4`. Ficha para Studio `upload/t1.md` (título, descripción con fuentes, etiquetas, casillas), portada `upload/t1-portada.png`. Archivo para apelaciones `archive/t1/`. **La subida la hace Bruno a mano en Studio** |
| **T2** | **Aprobado para publicar** (Bruno, 14-11-2026), versión 4: tres «fotos» de España con habitantes, trabajando y en paro; comercios, tablón de empleo, rosquillas y barras; veredicto «frente a 2016 mejora, frente a 2007 empeora» y pregunta de debate. Vídeo `videos/t2/render/t2-limpio.mp4` (96 s). Ficha `upload/t2.md`, portada `upload/t2-portada.png`, archivo `archive/t2/` (v4). **La subida la hace Bruno a mano en Studio** |
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
7. **De uno en uno**: T1, T2, T3 y T4 aprobados (T4, el 17-11-2026). T5 aprobado el 17-11-2026; T6 («¿Nacen menos niños porque ahora trabajan ellas?») aprobado el 17-11-2026 (archive/t6/). T7 en producción (Bruno: «no hace falta mi aprobación»). **Próximos (orden de Bruno, 17-11-2026):** T7 consumo (servicios, ropa y belleza; 1986, 2006 y hoy) → T8 impuestos 1: ¿cuánto de tu sueldo se queda el Estado? (cajero con salario mínimo y empleado de banca con 40.000 € de hoy ajustados por IPC; con la parte que paga la empresa) → T9 impuestos 2: montar un bar en Madrid en 1986, 2006 y hoy (impuestos, tasas y licencias) → T10 educación, sanidad e infraestructuras (rankings y cambios en 40 y 10 años).
10. **Personajes y final (T2 v4, 12-11-2026):** piel sobre todo clara, algún hispanoamericano; sin barbas sin bigote (solo el carnicero). Nada de «depende» por defecto: veredicto claro (mejora o empeora) y una pregunta final que abra debate («¿Cómo puede ser? ¿Tú cómo te lo explicas?»).
9. **Que se entienda (T2, 12-11-2026):** decir siempre de qué país hablamos (España, con la bandera al empezar). Cifras absolutas con su base («antes éramos X, ahora Y»). Gráficos que se lean de un vistazo (rosquilla, quesito, barras). Escenas que enseñen la idea (gente trabajando en comercios, no gente paseando). El título exacto que diga Bruno.
8. Lee en el **móvil**: mensajes cortos y con el resultado primero. Revisar los fotogramas antes de enviar nada.

Versiones rechazadas: v1 (tarjetas y bustos, tres estilos), v2 collage (`videos/t1/render/t1-collage.mp4`: «tiene que mejorar mucho», voces malas, rápido y saturado).

## 3. Siguiente paso, en orden
1. Bruno sube T1 (y T2 cuando esté aprobado) a mano en Studio con `upload/<id>.md` (contenido sintético: sí; no es para niños).
2. **T3 aprobado (16-11-2026):** «¿Quién lo tuvo más difícil para comprar casa: tu padre o tú?», 62 s. Ficha `upload/t3.md`, portada `upload/t3-portada.png`, archivo `archive/t3/`. Siguiente: T4, propuesto el 16-11-2026.
3. **T4 v5 aprobado para subir (17-11-2026):** «¿De verdad los jóvenes se lo gastan todo en Netflix?», 63,5 s.
   - Bruno pidió quitar las hipotecas (repetían T3), contar en qué se gasta el dinero y cuánto se lleva la vivienda, y que el decorado cambie con la conversación, «como en un sueño».
   - Cifra común: «de cada 100 € que gasta un hogar», 1986 frente a hoy (INE): ocio, 12 → 17; comida, 28 → 16; casa, 19 → 33. Alquiler: 39 % de los ingresos si vives solo, 27 % en pareja (Eurostat). Emancipación: 30,2 años (UE: 26,3).
   - Decorados en `diseno/sueno.mjs`: cocina, bar, súper, calle, piso, cuarto y vuelta a la cocina. Tabla de datos en `videos/t4/paso-1-datos-v4.md`. Ficha `upload/t4.md`, portada `upload/t4-portada.png`.
   - Los nietos (edad al primer hijo) pasan a T5, natalidad. Después: T6 y T7, consumo hace 40 años frente a hoy (sin Uber).
   - Archivo para apelaciones: `archive/t4/`.
   - **T5, natalidad (17-11-2026):** Bruno pide dar contexto al «por qué» (emancipación, pareja, casa, trabajo de las mujeres, permisos, bodas). Datos en `videos/t5/paso-1-datos.md`; Bruno aprobó partirlo en dos (T5, la cadena «todo llega más tarde»; T6, mujer y trabajo, sin el ejemplo de Francia).
   - **T5 hecho (17-11-2026):** «¿Y los nietos pa cuándo?», 52,4 s. Decorados nuevos: boda y sala de cunas. Ficha `upload/t5.md`, portada `upload/t5-portada.png`. **Aprobado (17-11-2026)**; archivo `archive/t5/`.
   - **T6 hecho (17-11-2026):** «¿Nacen menos niños porque ahora trabajan ellas?», 51,2 s. Decorado nuevo: oficina. Ficha `upload/t6.md`, portada `upload/t6-portada.png`. Pendiente de Bruno.
   - **Ideas pendientes** (recordadas a Bruno el 17-11-2026): consumo de servicios y ropa hace 40 años; serie «¿cuántas horas para…?»; esperas en la sanidad; tu vida en impuestos; tramos de ingresos; ¿estamos mejor que en 2007?; pobreza, recaudación, deuda; educación, sanidad, infraestructuras; cooperación e inmigración; vídeo de presentación.
   - Nota aparte, solo datos: natalidad e inmigración en Francia y España (`videos/t5/nota-inmigracion-natalidad.md`).
   - **T7 hecho (17-11-2026):** «¿Gastamos más en caprichos que nuestros padres?», 78,1 s; cierre de Bruno: «¿Somos más caprichosos ahora?». Bruno aprobó datos y borrador, pidió añadir música (discos y vinilos frente a la suscripción, cine y conciertos) y más movimiento, y dijo que no hacía falta volver a aprobar.
     - Datos nuevos: entrada de cine en minutos de trabajo (23 en 1986, 24 en 2016, 21 en 2024; Ministerio de Cultura e INE), gasto en discos por hogar (72 € en 2006, 10 € hoy; EPF), música por internet (18 %; Eurostat) y conciertos (32,1 % en 2025; Encuesta de Hábitos y Prácticas Culturales). Sin dato oficial: precio de vinilos de 1986 y de entradas de concierto (el de SGAE no es oficial).
     - Decorados nuevos en `diseno/tiendas.mjs`: tienda de ropa, peluquería, gimnasio con pádel, tienda de discos, cine y concierto. Motor: `ruta()` para que los personajes anden de un punto a otro y `rot` para inclinar el cuerpo (bailar, saltar). Sonidos nuevos: timbre, vinilo, público y bici.
     - Ficha `upload/t7.md`, portada `upload/t7-portada.png`, escaleta `videos/t7/escaleta.md`, archivo `archive/t7/`. **Aprobado** (Bruno cambió la frase final y pasó al siguiente vídeo, 18-11-2026).
   - **T8, impuestos del sueldo (18-11-2026):** paso 1 en `videos/t8/paso-1-datos.md` (cálculo con las normas del BOE de 1986, 2006 y 2026; `scripts/calcular_t8.py`). Versión 3 **aprobada** (18-11-2026): Madrid, oficial administrativo, sin colegio y con el impuesto de la gasolina; donaciones, herencias y patrimonio, para otro vídeo.
     - **T8 hecho (18-11-2026):** «¿Cuánto de tu sueldo se queda el Estado?», unos 77 s. Decorados nuevos: caja del súper, banco y gasolinera (`diseno/tiendas.mjs`). Ficha `upload/t8.md`, portada `upload/t8-portada.png`, escaleta `videos/t8/escaleta.md`, archivo `archive/t8/`. Pendiente de Bruno.
     - **Contraste (18-11-2026):** Bruno no está conforme con «estamos mejor». En `videos/t8/contraste.md` (`scripts/contraste_t8.py`) están los precios oficiales del carburante, los sueldos frente a la inflación y el neto con el mismo sueldo real. **Error a corregir en la escena 11:** «47 céntimos ahora» es el tipo de la ley, pero en 2026 hay rebajas temporales (Reales Decretos-ley 7, 18 y 25/2026): hoy son 27 céntimos. No subir T8 hasta que Bruno elija cómo corregirlo.
     - **T8 versión 2 (18-11-2026):** Bruno decide centrar el vídeo en lo que ha empeorado, con la gasolina sin la rebaja temporal y sin los ahorros, y deja el resto en manos de Claude («no me preguntes»). Fuera el cajero, el IVA del pan y los ahorros; entran el sueldo medio con el mismo sueldo real (625 € menos que en 2006) y el gasóleo (+39 % frente a 2016 y más IVA por litro). Ver `videos/t8/paso-1-datos.md` (versión 4) y `videos/t8/escaleta.md`. **Hecho:** `videos/t8/render/t8-limpio.mp4`, 65,8 s; ficha `upload/t8.md` y portada actualizadas. Pendiente de Bruno.
     - **Idea apuntada:** «¿Cuánto cuesta heredar o donar a un hijo?» (donaciones, herencias y patrimonio, comparando todas las comunidades).
     - **Idea apuntada (18-11-2026, sale del contraste de T8):** «¿Llegas peor a fin de mes que tus padres?»: horas de trabajo para llenar el depósito, pagar el alquiler y comprar un piso, en 1986, 2006, 2016 y hoy. Datos ya listos en `data/clean/t8_contraste.json` y T3: el sueldo medio bruto real apenas sube (+5 % desde 2016, plano entre 2016 y 2022), el gasóleo cuesta un 39 % más que en 2016 y el piso ha pasado de 3,4 a 7,1 años de sueldo. Va después de que Bruno dé por buena la versión 2 de T8 (de uno en uno).
4. Si Bruno quiere probar Google Chirp 3 HD: necesita su cuenta de Google Cloud, una clave de API y permitir `texttospeech.googleapis.com` en el entorno.
5. La voz 5 (personaje secundario) está fijada en `diseno/voces/ref-voz5.wav`; se usará cuando Bruno lo pida, con una muestra previa.
6. Cuando Bruno conecte la API de YouTube (JSON del cliente OAuth), leer métricas con `scripts/youtube/metricas.py`.

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

## 9. Voces con varios personajes (T3, 15-11-2026)
- **Fallo corregido en `scripts/voces.py`:** la voz de referencia se guardaba por modelo, no por personaje, así que el primero que hablaba prestaba su voz a todos. Ahora va por perfil.
- **Control nuevo:** `voces.py` mide el parecido de cada toma con la voz de su personaje (Resemblyzer). Por debajo de 0,85 la repite con otra semilla.
- **Elegir entre varias tomas:** `scripts/pruebas/elegir_toma.py` saca varias tomas de una línea y se queda con la más parecida a su personaje y menos al otro.
- **Voces de T3:**
  - Padre: `diseno/voces/ref-padre.wav`, la opción C, inventada con VoiceDesign.
  - Hijo: `diseno/voces/ref-hijo.wav`, su propia toma de los primeros 45 s, que Bruno da por buena.
- **Final de T3 sin veredicto hablado:** Bruno pidió quitar «¿mejora o empeora?» y acabar con «¿Quién lo tuvo más fácil? ¿Tú qué opinas?». El veredicto queda en la descripción.
