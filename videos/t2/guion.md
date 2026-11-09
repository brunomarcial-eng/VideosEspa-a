# Guion T2 — ¿Hoy trabaja más gente que antes de la crisis?

Pregunta: ¿Hay más gente trabajando ahora que en 2007 y en 2016?  
Datos: `data/clean/t2_empleo.json` · 2026-11-09 (Paso 1 aprobado: EPA T3 contra T3, tasa de empleo 16-64, «depende» frente a 2007)  
Duración estimada de la voz: **59 s** (a 2.6 palabras/s) · Años en pantalla: 2002, 2007, 2016  
Un solo guion para los tres estilos (A pizarra, B cápsula, C baraja). La columna «Imagen» es la idea del plano; cada estilo la dibuja a su manera en el Paso 3.

| # | Tiempo | Quién | Voz | En pantalla | Sello de fuente | Imagen |
|---|---|---|---|---|---|---|
| 1 | 0-5 s | hoy (hoy) | ¿Tú crees que hoy trabaja más gente que antes de la crisis… o menos? | ¿Hoy trabaja más gente que antes de la crisis? | — | El de hoy mira a cámara. |
| 2 | 6-12 s | antes (2007) | ¿Más que en 2007? Imposible. Éramos 20,75 millones trabajando. | 2007 · 20,75 millones de ocupados | DATO OFICIAL · INE · EPA, 3.er trimestre de 2007 | Aparece el de 2007; ficha ocre. |
| 3 | 12-17 s | hoy (hoy) | Pues hoy somos 22,85 millones. Récord desde que hay serie. | Hoy · 22,85 millones · récord desde 2002 | DATO OFICIAL · INE · EPA, 3.er trimestre de 2026 | Ficha azul; el contador supera al de 2007. |
| 4 | 18-20 s | antes (2007) | Ya, pero también habrá más gente. | ¿Y no hay más gente? | — | El de 2007, escéptico. |
| 5 | 20-27 s | hoy (hoy) | Sí: 4,8 millones más de personas de 16 años o más. Por eso miro la tasa. | +4,8 millones de personas de 16 años o más | CÁLCULO PROPIO (C) · INE, EPA (ocupados ÷ tasa de empleo) | El grupo de figuras se amplía. |
| 6 | 27-35 s | hoy (hoy) | De cada 100 personas de 16 a 64 años, trabajan 69. En tu época, 67. | Trabajan 67 de cada 100 (2007) → 69 de cada 100 (hoy) · 16 a 64 años | DATO OFICIAL · INE · EPA, 3.er trimestre | 100 figuras; se colorean las que trabajan. |
| 7 | 36-37 s | antes (2007) | Vale. ¿Y el paro? | ¿Y el paro? | — | El de 2007 se cruza de brazos. |
| 8 | 37-47 s | hoy (hoy) | Ahí ganas tú: hoy, el 10,2 %. En 2007, el 8 %. Aunque en 2016 llegó al 18,9 %. | Paro · 2007: 8,0 %   2016: 18,9 %   hoy: 10,2 % | DATO OFICIAL · INE · EPA, 3.er trimestre | Línea del paro: sube hasta 2016 y baja sin llegar a 2007. |
| 9 | 47-49 s | antes (2007) | ¿Mejora, empeora o depende? | ¿Mejora, empeora o depende? | — | Panel fijo de cierre. |
| 10 | 49-56 s | hoy (hoy) | Frente a 2016, mejora. Frente a 2007, depende: más gente trabajando, pero más paro. | Frente a 2016: MEJORA · Frente a 2007: DEPENDE | — | Dos marcas en el panel. |
| 11 | 56-59 s | hoy (hoy) | ¿Y tú, con qué año lo comparas? Cuéntanoslo. | ¿Y tú? Cuéntanoslo | — | Los dos miran a cámara. |

**Cierre:** frente a 2016: mejora · frente a 2007: depende. Hay 2,1 millones más de ocupados y la tasa de empleo de 16-64 años es más alta que en 2007, pero la tasa de paro (10,2 %) sigue por encima de 2007 (8,0 %). Frente a 2016 mejoran todas las medidas.

## Cifras verificadas contra los datos

| En el guion | Valor en los datos | Estado | Origen |
|---|---|---|---|
| 20,75 | 20,75 | V | `mismo_trimestre.2007T3.ocupados_miles` |
| 22,85 | 22,85 | V | `mismo_trimestre.2026T3.ocupados_miles` |
| 4,8 | 4,8 | C | `resta(mismo_trimestre.2007T3.poblacion_16_mas_miles, mismo_trimestre.2026T3.poblacion_16_mas_miles)` |
| 69 | 69 | V | `mismo_trimestre.2026T3.tasa_empleo_16_64_pct` |
| 67 | 67 | V | `mismo_trimestre.2007T3.tasa_empleo_16_64_pct` |
| 10,2 | 10,2 | V | `mismo_trimestre.2026T3.tasa_paro_pct` |
| 8 | 8 | V | `mismo_trimestre.2007T3.tasa_paro_pct` |
| 8,0 | 8,0 | V | `mismo_trimestre.2007T3.tasa_paro_pct` |
| 18,9 | 18,9 | V | `mismo_trimestre.2016T3.tasa_paro_pct` |

Generado por `scripts/verificar_guion.py`. No editar a mano: se edita `guion.json` y se vuelve a ejecutar.
