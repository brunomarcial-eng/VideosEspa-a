# Propuesta: personajes que discuten (borrador para decidir)

Estado: **decidido el 2026-11-09** (ver abajo). Boceto inicial y propuesta, conservados como contexto. Boceto en `archive/personajes-boceto.png` (un plano de diálogo de T1 en los tres estilos).

## La idea
Dos personajes que son **la misma persona en dos épocas**: «la de antes» (2016 o 2007, en ocre) y «la de hoy» (en azul). La de antes llega con su recuerdo («yo la compra la pagaba con menos horas»); la de hoy, con su situación («ahora cobro más»). Discuten y **el dato oficial les pone de acuerdo**, con el sello en pantalla. Cierran juntas con «mejora / empeora / depende».

Se reconoce que es la misma persona por la cara y un lunar. Cambian el peinado, las gafas y las canas.

## Por qué la misma persona y no dos distintas
| Opción | A favor | En contra |
|---|---|---|
| **Misma persona en dos épocas** (recomendada) | No hay dos bandos: es imposible leerlo como derecha contra izquierda o jóvenes contra mayores. Es cercano («tú hace diez años»). Usa el código ocre/azul que ya tenemos. Sirve para cualquier año base: para 2007, la de antes es más joven | Hay que cuidar que la de hoy no sea siempre «la que tiene razón» |
| Dos personajes distintos (p. ej. joven y mayor, o dos vecinos) | Más conflicto | Parece una tertulia, que ya se descartó por parecer política; la guerra generacional crispa; dos vecinos recuerdan a las comedias de comunidad (prohibido) |
| Un solo presentador animado | Más simple | Sin conflicto: aporta menos retención que un diálogo |

## Reglas de los personajes
1. **Nadie tiene razón siempre.** Unas veces acierta el recuerdo de la de antes (en T1, la compra costaba menos horas) y otras la de hoy (en T2, hoy trabaja más gente). Lo decide el dato, no el personaje.
2. Discuten con humor, sin crispación: sin insultos, sin partidos, sin «la culpa es de…».
3. Cada cifra que dicen sale en pantalla con su sello, y el verificador la comprueba igual que ahora.
4. Diseño propio y genérico: no se parece a nadie real ni a personajes con derechos. Sin escenario de comunidad de vecinos: viven en el mundo de cada estilo (pizarra, cartón o carta).
5. Ropa ocre (antes) y azul petróleo (hoy): no forman ningún par de colores de partido. El rojo sigue reservado al sello.
6. Voz: dos voces sintéticas parecidas (la misma persona), la de antes algo más joven. Ninguna se parece a la de Bruno.

## Cómo se produce
- Dibujados con código, como el resto, con tres tratamientos: tiza, cartón recortado y figura de carta.
- Animación automática: la boca se abre y se cierra según el volumen de la voz (tres posiciones), parpadeo, cejas para sorpresa o duda, y un pequeño balanceo.
- Sin créditos de IA de imagen. El coste extra es tiempo de máquina y un guion en diálogo.

## Qué cambia si se aprueba
1. **Guiones de T1 y T2:** pasan a diálogo, con las mismas cifras y el mismo cierre y 45-60 s. Hay que aprobarlos otra vez.
2. **Biblias:** se añade la sección de personajes. B deja de ser «solo objetos»; en C los personajes viven dentro de sus cartas.
3. **Test de estilos:** los personajes van en los tres estilos, así que el test sigue midiendo solo el estilo. Medir «con personaje frente a sin personaje» es otro test, que se puede hacer después.

## Lo que no sabemos
No hay datos firmes de que una cara mejore la retención en Shorts animados: la fuente de `research/` que lo decía tenía conflicto de interés. Lo que sí da un diálogo es una pregunta abierta que invita a quedarse hasta la respuesta. Se medirá con la retención al 50 %.

## Decisión (2026-11-09)
- **Pizarra (A): sin personas.** Diálogo escrito con tiza, con el nombre de quien habla en el color de su época.
- **Cápsula (B) y baraja (C): con personajes**, títeres de recortes de papel (collage) con movimiento, volumen y personalidad. Detalles en `docs/produccion.md`.
- **Protagonistas que rotan** (mujer, hombre…), personas inventadas. T1: mujer (2016 / hoy). T2: hombre (2007 / hoy).
- **Gancho:** pregunta directa al que ve el vídeo («¿Te cunde más el carro ahora o antes?»). Pregunta abierta al final.
- **Pocas cifras por imagen:** una o dos (tres en un gráfico); lo controla el verificador.
- **Sin pagar APIs:** voces libres (Kokoro y Piper) generadas en local.
