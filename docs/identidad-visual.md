# Identidad visual

## 1. Sistema común (capa fija, igual en los tres estilos)

| Elemento | Especificación |
|---|---|
| **Tiempo en color** | Todo lo del pasado en **ocre** `#C8902E`; todo lo de hoy en **azul** `#1F5F8B`. Siempre |
| Fondos | Papel `#F4EDE0` (estilos B y C) · Pizarra `#23302B` (estilo A) |
| Texto | `#1E1E1E` sobre papel · `#F4EDE0` sobre pizarra |
| Apoyo | Verde salvia `#7C9A7E`, gris cálido `#8A8378` |
| **Rojo** `#B3261E` | Solo para el sello «DATO OFICIAL» y para alertas |
| Sello | «DATO OFICIAL» + organismo + tabla + año, en pantalla cada vez que sale una cifra |
| Unidad | La hora: `h` para horas de trabajo, `días` para esperas. Nunca se suman |
| Tipografías | Titulares: Fraunces (700) · Datos: IBM Plex Mono · Rotulado a mano (estilo A): Caveat Brush. Todas gratuitas en Google Fonts |
| Formato | Vertical 9:16 para Shorts, 16:9 para largos |
| Contraste | Mínimo AA (4,5:1). Verifica con script cada pareja de colores antes de usarla |
| Gráficos | Generados por código (Remotion o D3) desde JSON de datos. Nunca IA de imagen |
| Cierre fijo | Panel «mejora / empeora / depende» + pregunta final |
| Voz | Sintética, única y constante, distinta de la de Bruno |

Comprueba que el ocre sobre pizarra y el azul sobre papel cumplen AA; si no, aclara el tono.

## 2. Los tres estilos del test

### A) La Pizarra (Draw My Life en tiza)
- Pizarra verde oscuro de bar. Una mano dibuja con tiza en tiempo real: un café, una barra de pan, una llave, un carrito, un reloj.
- Los números se escriben a mano; lo de 2016 se **tacha** y se escribe hoy al lado.
- **Cómo se produce:** (1) iconos vectoriales con animación de trazo por código; (2) ilustraciones en estilo tiza generadas con IA a partir de una hoja de estilo fija y animadas con un revelado de máscara; (3) stop motion por vídeo IA solo para planos concretos, no para todo.
- Riesgo: la consistencia en el rotulado. Mitigación: texto siempre desde fuente tipográfica, no generado por IA.

### B) La Cápsula del tiempo y el Carrito
- Se abre una cápsula (caja) con objetos de una fecha: ticket, nómina, factura de luz, billete de tren. Se comparan con los de hoy.
- Un **carrito de la compra** recorre el vídeo y se va llenando con precios reales; las horas de trabajo se muestran en un reloj sobre el carrito.
- Estilo: ilustración plana en papel, con un poco de textura de cartón. Objetos, no personajes.
- Fechas: 2007, 2018 y hoy (tres cápsulas).

### C) La Baraja española
- Cartas originales (diseño propio, no la baraja comercial). Los palos son los capítulos: **oros** sueldos y precios, **copas** comida y ocio, **espadas** impuestos, **bastos** vivienda.
- Perfiles: **sota** (joven que empieza), **caballo** (adulto con familia), **rey** (ingresos altos), **as** (el dato clave). El rey es una figura genérica, sin parecido con ningún monarca.
- Estilo: grabado/litografía simplificado con las dos tintas, ocre y azul.
- Riesgo: connotación de juego. Mitigación: sin apuestas ni dinero en juego; las cartas solo ordenan datos.

## 3. Cómo se genera la identidad (proceso)
1. Para cada estilo, crear una **biblia de estilo**: paleta, 10 objetos base, trazo, textura, 3 composiciones tipo y qué está prohibido.
2. Generar imágenes de referencia con la biblia y fijarlas como referencia en todos los planos.
3. Producir los planos y revisarlos con los tests de calidad de `CLAUDE.md`.
4. Guardar biblia, referencias y prompts en `archive/style-<A|B|C>/`.

## 4. Prohibido
Comunidades de vecinos, conserje, plátanos u otros animales-metáfora, rojo y azul juntos como par de partido, banderas, caricaturas, personajes con derechos, rostros de personas reales.
