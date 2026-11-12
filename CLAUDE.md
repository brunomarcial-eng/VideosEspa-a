# Cuánto Vale Tu Hora — reglas del proyecto

Canal de YouTube anónimo en español (España) que mide la vida económica en **tiempo**: horas de trabajo para comprar algo y días de espera para recibir un servicio, comparando el pasado con hoy, solo con datos oficiales. Tono objetivo y poco crispado. Sin presentador.

Nombre de trabajo: **Cuánto Vale Tu Hora**. Alternativas: «El Precio del Tiempo», «Horas Contadas». No se ha comprobado que estén libres en YouTube.

## Reglas no negociables

1. **Datos.** Solo fuentes oficiales (INE, Eurostat, Banco de España, AEAT, Hacienda/IGAE, Interior, Inclusión, Sanidad, BOE, OCDE). Usa la skill `datos-oficiales-espana`. Cada cifra del vídeo lleva fuente en pantalla. La prensa orienta, nunca es la fuente. Estados: V (leído en la fuente), P (solo prensa), C (cálculo propio con fórmula), X (sin serie oficial). Un vídeo no se renderiza con cifras en P ni X.
2. **Años base.** Nunca 2020. 2021 es año de rebote: se marca. Años de referencia: **2007** (antes de la crisis), **2016**, **2018-2019** y hoy. Cada comparación muestra al menos tres años. Si la conclusión cambia con el año, se dice en el vídeo.
3. **Neutralidad.** No se atribuyen causas sin evidencia. Sin partidos, sin políticos reales, sin colores de partido (evita el par rojo/azul de siglas), sin caricaturas. Cada vídeo da un veredicto claro, **mejora o empeora** (frente a cada año de referencia), con el porqué; «depende» solo si de verdad no se puede decidir (Bruno, 12-11-2026). Y acaba con una pregunta que abra debate, sin dar nosotros la causa.
4. **Medidas.** Nominal y real, bruto y neto, media y mediana, cifra absoluta y tasa: siempre se dice cuál. La metodología de «horas» está en `docs/metodologia-horas.md`.
5. **Casos judiciales.** No son parte de esta serie. Si alguna vez se tratan: semáforo (S firme, R recurrible, J juicio oral, I investigación, T testigo, ? sin resolución) y nunca se nombra a nadie sin resolución.
6. **Originalidad (política de YouTube).** Un guion distinto por vídeo, nunca una plantilla con huecos. Imágenes ajustadas a cada frase. Menos vídeos pero distintos. Guarda en `archive/<id>/` el guion, las fuentes, los datos crudos y las notas de edición por si hay apelación. Marca «contenido alterado o sintético» cuando corresponda.
7. **Anonimato.** No uses la voz grabada de Bruno ni su email, nombre, foto ni dispositivos en metadatos o ficheros. La cuenta de Google es nueva y separada. El **texto** sí se escribe con su voz (skill `clon-bruno` al 100 %, decisión de Bruno del 10-11-2026): natural, de persona normal y corriente. Sus opiniones políticas no entran (regla 3).
8. **No copiar.** Ni *Aquí no hay quien viva* / *La que se avecina* (comunidad de vecinos y conserje), ni Ecomonos (plátanos), Barrio Sauna, Antihacienda o personajes con derechos. La baraja se diseña desde cero y el «rey» de la baraja no representa a ningún monarca real.
9. **Solo gratis.** Ninguna API, app ni servicio de pago (ni ElevenLabs ni similares, ni planes de prueba que luego cobren). Voces con modelos libres en local (Qwen3-TTS, Piper), gráficos y personajes con código, datos de APIs públicas gratuitas. Si algo solo existe de pago, se dice y se busca la alternativa gratuita.
10. **Lo que hace una persona.** Crear la cuenta y el canal, el consentimiento OAuth, la auditoría de la API, AdSense y la primera subida son pasos humanos (`docs/setup-humano.md`). Hasta pasar la auditoría la subida es manual con publicación programada en Studio.

## Cómo trabajar

- Modelo: usa el más capaz disponible para guion, verificación y decisiones editoriales.
- Antes de renderizar, para y pide aprobación en cuatro puntos: (1) tabla de datos, (2) guion, (3) biblia de estilo, (4) primer render.
- Los gráficos de datos se generan con código a partir de ficheros oficiales, no con IA de imagen.
- **El vídeo cuenta lo que dice la voz.** Es una narración: cada frase tiene su escena con acción (no una diapositiva con audio encima). Referencias visuales de Bruno en `archive/referencias/`. Subtítulo arriba, palabra a palabra; una cifra grande por plano.
- **Voz en español de España**, nunca con acento de América. Bruno decide las voces de oído: se le mandan muestras cortas antes de renderizar.
- **Texto humano:** conversación natural, con interjecciones y ritmo irregular. Empieza con una pregunta llamativa y directa al espectador («¿llenar el carro te cuesta más o menos que hace 10 años?») y acaba con otra abierta.
- **Ritmo tranquilo y poca carga:** una idea por escena, pocos elementos, y cada dato se queda en pantalla el tiempo suficiente para leerlo. Mejor 70 segundos claros que 50 con prisa.
- **Personajes:** gente representativa de España: sobre todo tonos de piel claros, y alguno algo más moreno (hispanoamericanos). Nada de barbas sin bigote; la barba, solo si encaja (el carnicero). Siempre inventados.
- **Estilo de imagen:** limpio y sencillo como las referencias de `archive/referencias/` (tarjeta blanca con etiqueta y titular, subtítulo grande de 2-3 palabras, barra de progreso, personaje sencillo en un sitio fijo).
- **Sonido:** música y efectos que acompañen cada acción de la historia.
- **De uno en uno:** hasta que un vídeo esté bien, no se producen los demás. T1 aprobado el 12-11-2026; T2 rehecho (v4) y pendiente de aprobar; el siguiente, cuando Bruno lo elija. Estado y siguiente paso: `docs/ESTADO.md`.
- Estructura del repo, agentes y contratos: `docs/agentes-y-pipeline.md`.
- Identidad visual: `docs/identidad-visual.md`. Test de estilos: `docs/piloto-test.md`. Backlog: `docs/backlog-videos.md`.
- Contexto previo e investigación: carpeta `research/` (los estados judiciales y cifras hay que re-verificar en la fuente antes de usar).

## Tests de calidad (todo vídeo debe pasarlos)

1. **Fotograma:** el canal se reconoce en un fotograma sin logo.
2. **Móvil:** se lee a 5 cm de distancia.
3. **Neutralidad:** no puede verse como favorable a un partido.
4. **Dato:** cada cifra tiene fuente en pantalla y fichero crudo archivado.
5. **Sitcom/copia:** no recuerda a otra serie o canal.
