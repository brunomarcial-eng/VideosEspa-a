# Sistema visual común (capa fija de los tres estilos)

Fuente de verdad: `diseno/tokens.json` (colores) · `diseno/fuentes/` (tipografías, licencia OFL) · `diseno/objetos.mjs` (objetos dibujados con código) · `diseno/escenas.mjs` (composiciones). Referencias: `archive/style-{A,B,C}/`. Regenerar todo con:

```
python3 scripts/contraste.py          # contraste AA de cada pareja de colores
node scripts/render_referencias.mjs   # fotogramas de referencia desde data/clean
```

## Color: el tiempo tiene color
| Uso | Color | Nota |
|---|---|---|
| **Pasado** | ocre `#C8902E` | Sobre papel, como texto se usa `#86601F` (ocre oscuro); como ficha, texto negro sobre ocre |
| **Hoy** | azul `#1F5F8B` | Sobre pizarra se usa el azul de tiza `#6AADDF` |
| Fondo papel (B, C) | `#F4EDE0` | Con grano de papel muy suave |
| Fondo pizarra (A) | `#23302B` | Con borrones de tiza |
| Texto | `#1E1E1E` sobre papel · `#F4EDE0` sobre pizarra | |
| Apoyo | salvia `#7C9A7E`, gris `#8A8378`, cartón `#CDBB98` | Solo objetos y decoración, **nunca datos** |
| Rojo `#B3261E` | Solo el sello y las alertas | Nunca como color de dato ni de bando |

Contraste: **todas las parejas pasan AA** (texto ≥ 4,5:1; gráficos ≥ 3:1). Informe completo en `diseno/contraste.md`. Los dos casos que pedía revisar la identidad pasan con los colores base: ocre sobre pizarra 4,89:1 y azul sobre papel 5,88:1. Fallaban azul sobre pizarra (2,0:1) y ocre como texto sobre papel (2,4:1); por eso existen el azul de tiza y el ocre oscuro.

## Fichas de cifra
Cada cifra comparada va en una ficha de su tiempo: **ocre con texto negro** (pasado) o **azul con texto claro** (hoy). En la pizarra, la cifra se escribe a mano directamente en ocre o azul de tiza.

## Sello «DATO OFICIAL»
- Etiqueta de papel con doble borde y texto en rojo, IBM Plex Mono 600 a 30 px, inclinada −1,2°, con el reloj del canal a la izquierda.
- Texto: `DATO OFICIAL · organismo · tabla · año` o `CÁLCULO PROPIO (C) · fórmula · fuentes`. Sale **cada vez que hay una cifra** en pantalla.
- Va en la franja de 1.385-1.500 px. Es el mismo sello en los tres estilos: es la firma del canal en un fotograma sin logo.

## Tipografía
| Uso | Fuente | Tamaño mínimo en 1080×1920 |
|---|---|---|
| Titulares | Fraunces 700/900 | 66 px |
| Cifras y datos | IBM Plex Mono 600/700 | 50 px (cifra clave 100-270 px) |
| Rotulado a mano (solo A) | Caveat Brush | 46 px |
| Sello y notas | IBM Plex Mono 600 | 30 px |

El texto **siempre** sale de una fuente tipográfica, nunca de una IA de imagen.

## Zona segura del Short
- Arriba, 0-200 px: barra de YouTube. Abajo, a partir de 1.500 px: título, canal y botones. Lado derecho, 960-1.080 px por debajo de 900 px: botones. Ahí no va nada importante.
- Contenido en x 70-1.010; sello y notas en x 70-930.

## Cierre fijo
Pregunta «¿Mejora, empeora o depende?», las tres palabras en el mismo orden y la elegida destacada (círculo de tiza, etiqueta adelantada o carta levantada), más una línea con el porqué. Ni verde ni rojo para el veredicto: se destaca con contorno y tamaño, no con color de bando.

## Gráficos
Siempre generados por código desde `data/clean/`, con barras desde cero. Cada barra o carta lleva su cifra escrita. Nunca IA de imagen para datos.

## Prohibido en los tres estilos
Comunidades de vecinos y conserje; plátanos u otros animales-metáfora; rojo y azul enfrentados como dos bandos; **urnas, papeletas o cajas con ranura**; banderas, escudos y coronas reales; caricaturas; personajes con derechos; rostros de personas reales; logos o marcas de supermercados y productos reales.

## Producción
Cada plano es una página HTML/SVG que Chromium convierte en fotogramas. Hay una sola biblioteca de objetos y cada estilo le da su tratamiento (tiza, cartón plano o litografía). Coste marginal por vídeo: tiempo de máquina, sin créditos de IA de imagen. Si más adelante se usan ilustraciones con IA, se guardan aquí los prompts y la biblia de su estilo como referencia fija.
