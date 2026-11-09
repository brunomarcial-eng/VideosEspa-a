# Guion T1 — ¿Te cunde más el carro ahora o antes?

Pregunta: ¿Cuántas horas de trabajo cuesta la compra de comida de un mes, en 2016, 2019 y hoy?  
Datos: `data/clean/t1_cesta_horas.json` · 2026-11-09 (Paso 1 aprobado: cesta fija EPF 2025, neto y mediana, sin 2007)  
Duración estimada de la voz: **49 s** (a 2.6 palabras/s) · Años en pantalla: 2016, 2019, 2024  
Un solo guion para los tres estilos (A pizarra, B cápsula, C baraja). La columna «Imagen» es la idea del plano; cada estilo la dibuja a su manera en el Paso 3.

| # | Tiempo | Quién | Voz | En pantalla | Sello de fuente | Imagen |
|---|---|---|---|---|---|---|
| 1 | 0-5 s | hoy (hoy) | Oye, tú: ¿te cunde más el carro ahora o te cundía más antes? | ¿Te cunde más el carro ahora… o antes? | — | Carrito lleno; la de hoy mira a cámara. |
| 2 | 5-13 s | antes (2016) | Antes, claro. En 2016, la compra del mes de una persona me costaba 12,8 horas de trabajo. | 2016 · 12,8 h de trabajo <br>_Compra del mes: comida y bebida sin alcohol, gasto medio por persona_ | CÁLCULO PROPIO (C) · horas = compra ÷ sueldo neto por hora · INE y Eurostat | Aparece la de 2016 con la compra; ficha ocre con la cifra. |
| 3 | 14-19 s | hoy (hoy) | Pues con los últimos datos, los de 2024, son 14,5. | 2024 · 14,5 h de trabajo | CÁLCULO PROPIO (C) · horas = compra ÷ sueldo neto por hora · INE y Eurostat | Ficha azul con la cifra; el reloj avanza más. |
| 4 | 20-21 s | antes (2016) | ¿Cómo? ¡Si ahora cobras más! | ¿Si ahora cobras más? | — | La de 2016, sorprendida. |
| 5 | 22-29 s | hoy (hoy) | Sí: mi sueldo neto por hora ha subido un 23 % desde 2016. Pero la misma compra, un 40 %. | Sueldo neto por hora (mediana) +23 % · Compra +40 % | CÁLCULO PROPIO (C) · horas = compra ÷ sueldo neto por hora · INE y Eurostat | Dos barras que crecen: el sueldo menos que la compra. |
| 6 | 30-32 s | antes (2016) | ¿Y en 2019? | ¿Y en 2019? | — | La de 2016 pregunta. |
| 7 | 32-37 s | hoy (hoy) | 12,6 horas, casi como en tu época. El salto vino después. | 2016 · 12,8 h   2019 · 12,6 h   2024 · 14,5 h | CÁLCULO PROPIO (C) · horas = compra ÷ sueldo neto por hora · INE y Eurostat | Gráfico de tres barras: dos ocres casi iguales y la azul más alta. |
| 8 | 37-39 s | antes (2016) | Entonces, ¿mejora, empeora o depende? | ¿Mejora, empeora o depende? | — | Panel fijo de cierre. |
| 9 | 40-45 s | hoy (hoy) | Empeora. Mires el año que mires, y midas el sueldo como lo midas. | EMPEORA | — | EMPEORA destacado. |
| 10 | 45-49 s | hoy (hoy) | ¿Y a ti, te cunde más o menos que antes? Cuéntanoslo. | ¿Y a ti? Cuéntanoslo | — | Las dos miran a cámara. |

**Cierre:** empeora. La misma compra subió un 40 % y el sueldo neto por hora mediano un 23 % entre 2016 y 2024; ocurre con cualquier año base (2016, 2018, 2019) y con media, mediana, bruto o neto.

## Cifras verificadas contra los datos

| En el guion | Valor en los datos | Estado | Origen |
|---|---|---|---|
| 12,8 | 12,8 | C | `filas[anyo=2016].horas_neto_mediana` |
| 14,5 | 14,5 | C | `filas[anyo=2024].horas_neto_mediana` |
| 12,6 | 12,6 | C | `filas[anyo=2019].horas_neto_mediana` |
| 23 | 23 | C | `var_pct(filas[anyo=2016].salario_neto_hora_mediana, filas[anyo=2024].salario_neto_hora_mediana)` |
| 40 | 40 | C | `var_pct(filas[anyo=2016].cesta_euros_mes, filas[anyo=2024].cesta_euros_mes)` |

Generado por `scripts/verificar_guion.py`. No editar a mano: se edita `guion.json` y se vuelve a ejecutar.
