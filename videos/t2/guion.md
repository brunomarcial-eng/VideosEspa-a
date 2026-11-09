# Guion T2 — ¿Trabaja hoy más gente que antes de la crisis?

Pregunta: ¿Hay más gente trabajando ahora que en 2007, 2016 y 2018-19?  
Datos: `data/clean/t2_empleo.json` · 2026-11-09 (Paso 1 aprobado: EPA T3 contra T3, tasa de empleo 16-64, «depende» frente a 2007)  
Duración estimada de la voz: **59 s** (a 2.6 palabras/s) · Años en pantalla: 2002, 2007, 2016, 2018, 2019, 2026  
Un solo guion para los tres estilos (A pizarra, B cápsula, C baraja). La columna «Imagen» es la idea del plano; cada estilo la dibuja a su manera en el Paso 3.

| # | Tiempo | Voz | En pantalla | Sello de fuente | Imagen |
|---|---|---|---|---|---|
| 1 | 0-3 s | ¿Trabaja hoy más gente que antes de la crisis? | ¿Trabaja hoy más gente que antes de la crisis? | — | Una fila de figuras genéricas de trabajadores (sin rostros reales) frente a un calendario de 2007. |
| 2 | 3-10 s | Sí: 22,85 millones de personas, la cifra más alta desde 2002. | 22,85 millones de ocupados · 3.er trimestre de 2026 · máximo de la serie (desde 2002) | DATO OFICIAL · INE · Encuesta de Población Activa, tabla 65109 · T3 2026 | El contador de ocupados sube hasta 22,85 M y se ilumina en azul. |
| 3 | 10-18 s | Son 2,1 millones más que en 2007 y 4,3 más que en 2016. | 2007: 20,75 M · 2016: 18,53 M · 2018: 19,53 M · 2019: 19,87 M · 2026: 22,85 M (3.er trimestre de cada año) | DATO OFICIAL · INE · EPA, tabla 65109 · T3 de cada año | Gráfico generado por código: barras por año; pasado en ocre, 2026 en azul. |
| 4 | 18-26 s | Pero también hay 4,8 millones más de personas de 16 años o más que en 2007. | Población de 16 años o más: 37,92 M (2007) → 42,76 M (2026) | CÁLCULO PROPIO (C) · ocupados ÷ tasa de empleo · INE, EPA (tablas 65109 y 65306) | El grupo de figuras se amplía: hay más gente en total, no solo más trabajando. |
| 5 | 26-36 s | Mejor mirar la tasa: de cada 100 personas de 16 a 64 años, hoy trabajan 69. En 2007, 67. | Tasa de empleo 16-64 años: 2007: 67,2 % · 2016: 61,1 % · 2018: 64,0 % · 2019: 64,5 % · 2026: 69,1 % (con 16 años o más, que incluye a mayores de 65: 54,7 % en 2007 y 53,5 % hoy) | DATO OFICIAL · INE · EPA, tabla 65306 · T3 de cada año | 100 figuras; se colorean las que trabajan: 67 en ocre (2007) y 69 en azul (hoy). |
| 6 | 36-46 s | El paro está en el 10,2 %: lejos del 18,9 % de 2016, pero por encima del 8 % de 2007. | Tasa de paro: 2007: 8,0 % · 2016: 18,9 % · 2018: 14,6 % · 2019: 13,9 % · 2026: 10,2 % · parados: 1,81 M (2007) → 2,59 M (2026) | DATO OFICIAL · INE · EPA, tablas 65219 y 65218 · T3 de cada año | Una línea que baja desde 2016 pero se queda por encima de la marca de 2007. |
| 7 | 46-57 s | ¿Mejora, empeora o depende? Frente a 2016 y 2019, mejora. Frente a 2007, depende: trabaja más gente, pero hay más paro. | MEJORA · EMPEORA · DEPENDE → frente a 2016-2019: MEJORA · frente a 2007: DEPENDE (más ocupados y más tasa de empleo; más paro) | — | Panel fijo de cierre con dos marcas: MEJORA (2016-19) y DEPENDE (2007). |
| 8 | 57-59 s | ¿Con qué año lo compararías tú? | ¿Con qué año lo compararías tú? | — | Calendario con 2007, 2016, 2019 y hoy. |

**Cierre:** frente a 2016-2019: mejora · frente a 2007: depende. Hay 2,1 millones más de ocupados y la tasa de empleo de 16-64 años es más alta que en 2007, pero la tasa de paro (10,2 %) y el número de parados siguen por encima de 2007 (8,0 %). Frente a 2016-2019 mejoran todas las medidas.

## Cifras verificadas contra los datos

| En el guion | Valor en los datos | Estado | Origen |
|---|---|---|---|
| 22,85 | 22,85 | V | `mismo_trimestre.2026T3.ocupados_miles` |
| 2,1 | 2,1 | C | `resta(mismo_trimestre.2007T3.ocupados_miles, mismo_trimestre.2026T3.ocupados_miles)` |
| 4,3 | 4,3 | C | `resta(mismo_trimestre.2016T3.ocupados_miles, mismo_trimestre.2026T3.ocupados_miles)` |
| 20,75 | 20,75 | V | `mismo_trimestre.2007T3.ocupados_miles` |
| 18,53 | 18,53 | V | `mismo_trimestre.2016T3.ocupados_miles` |
| 19,53 | 19,53 | V | `mismo_trimestre.2018T3.ocupados_miles` |
| 19,87 | 19,87 | V | `mismo_trimestre.2019T3.ocupados_miles` |
| 4,8 | 4,8 | C | `resta(mismo_trimestre.2007T3.poblacion_16_mas_miles, mismo_trimestre.2026T3.poblacion_16_mas_miles)` |
| 37,92 | 37,92 | C | `mismo_trimestre.2007T3.poblacion_16_mas_miles` |
| 42,76 | 42,76 | C | `mismo_trimestre.2026T3.poblacion_16_mas_miles` |
| 69 | 69 | V | `mismo_trimestre.2026T3.tasa_empleo_16_64_pct` |
| 67 | 67 | V | `mismo_trimestre.2007T3.tasa_empleo_16_64_pct` |
| 67,2 | 67,2 | V | `mismo_trimestre.2007T3.tasa_empleo_16_64_pct` |
| 61,1 | 61,1 | V | `mismo_trimestre.2016T3.tasa_empleo_16_64_pct` |
| 64,0 | 64,0 | V | `mismo_trimestre.2018T3.tasa_empleo_16_64_pct` |
| 64,5 | 64,5 | V | `mismo_trimestre.2019T3.tasa_empleo_16_64_pct` |
| 69,1 | 69,1 | V | `mismo_trimestre.2026T3.tasa_empleo_16_64_pct` |
| 54,7 | 54,7 | V | `mismo_trimestre.2007T3.tasa_empleo_16_mas_pct` |
| 53,5 | 53,5 | V | `mismo_trimestre.2026T3.tasa_empleo_16_mas_pct` |
| 10,2 | 10,2 | V | `mismo_trimestre.2026T3.tasa_paro_pct` |
| 18,9 | 18,9 | V | `mismo_trimestre.2016T3.tasa_paro_pct` |
| 8 | 8 | V | `mismo_trimestre.2007T3.tasa_paro_pct` |
| 8,0 | 8,0 | V | `mismo_trimestre.2007T3.tasa_paro_pct` |
| 14,6 | 14,6 | V | `mismo_trimestre.2018T3.tasa_paro_pct` |
| 13,9 | 13,9 | V | `mismo_trimestre.2019T3.tasa_paro_pct` |
| 1,81 | 1,81 | V | `mismo_trimestre.2007T3.parados_miles` |
| 2,59 | 2,59 | V | `mismo_trimestre.2026T3.parados_miles` |

Generado por `scripts/verificar_guion.py`. No editar a mano: se edita `guion.json` y se vuelve a ejecutar.
