# Guion T1 — ¿Cuántas horas de trabajo cuesta la comida de un mes?

Pregunta: ¿Cuántas horas de trabajo cuesta la compra de comida de un mes, en 2016, 2018-19 y hoy?  
Datos: `data/clean/t1_cesta_horas.json` · 2026-11-09 (Paso 1 aprobado: cesta fija EPF 2025, neto y mediana, sin 2007)  
Duración estimada de la voz: **50 s** (a 2.6 palabras/s) · Años en pantalla: 2016, 2018, 2019, 2024, 2025  
Un solo guion para los tres estilos (A pizarra, B cápsula, C baraja). La columna «Imagen» es la idea del plano; cada estilo la dibuja a su manera en el Paso 3.

| # | Tiempo | Voz | En pantalla | Sello de fuente | Imagen |
|---|---|---|---|---|---|
| 1 | 0-4 s | ¿Cuántas horas de trabajo cuesta la comida de un mes? | ¿Cuántas horas de trabajo cuesta la comida de un mes? | — | Una compra de comida corriente (pan, leche, fruta, huevos, aceite) y un reloj que empieza a correr. |
| 2 | 4-11 s | Una persona gasta de media 188 euros al mes en comida y bebida sin alcohol. | 188 € al mes · gasto medio por persona en alimentos y bebidas sin alcohol · 2025 | DATO OFICIAL · INE · Encuesta de Presupuestos Familiares, tabla 73778 · 2025 | La compra se agrupa en una sola cesta con la etiqueta 188 €. |
| 3 | 11-15 s | Es la misma compra cada año; solo cambia el precio. | Misma cesta · precio de cada año según el IPC de alimentos | DATO OFICIAL · INE · IPC, tabla 76125 | La misma cesta repetida en tres momentos; solo cambia la etiqueta del precio. |
| 4 | 15-19 s | La pagamos con el sueldo neto por hora del trabajador mediano. | Sueldo neto por hora, mediana: 10,27 € en 2016 · 12,63 € en 2024 (la mitad cobra más; la otra mitad, menos) | CÁLCULO PROPIO (C) · INE, Encuesta de Estructura Salarial (tablas 28191 y 30046) · Eurostat earn_nt_net | Una hora de reloj convertida en monedas: lo que se cobra por una hora, ya sin impuestos ni cotizaciones. |
| 5 | 19-30 s | En 2016 costaba 12,8 horas de trabajo. En 2018 y 2019, 12,6. En 2024, 14,5. | 2016: 12,8 h · 2018: 12,6 h · 2019: 12,6 h · 2024: 14,5 h (2024: último año con salarios oficiales del INE) | CÁLCULO PROPIO (C) · horas = cesta ÷ sueldo neto por hora (mediana) · INE y Eurostat | Gráfico generado por código: un reloj o barra por año; pasado en ocre, 2024 en azul. |
| 6 | 30-40 s | Desde 2016, la compra ha subido un 40 % y el sueldo neto por hora, un 23 %. Unos cien minutos más de trabajo cada mes. | Cesta +40 % · sueldo neto por hora +23 % · +1,7 h al mes (2016 → 2024) | CÁLCULO PROPIO (C) · INE y Eurostat · precios y sueldos nominales | Dos barras que crecen a distinto ritmo; la de la cesta llega más arriba. Después, un reloj que avanza cien minutos. |
| 7 | 40-47 s | ¿Mejora, empeora o depende? Empeora. Pasa con cualquier año de referencia y con cualquier forma de medir el sueldo. | MEJORA · EMPEORA · DEPENDE → EMPEORA · con 2016, 2018 o 2019 · con sueldo medio o mediano, bruto o neto | — | Panel fijo de cierre con EMPEORA marcado. |
| 8 | 47-50 s | ¿Qué medimos en horas la próxima vez? | ¿Qué medimos en horas la próxima vez? | — | El reloj se detiene; la cesta queda en pantalla. |

**Cierre:** empeora. La misma cesta subió un 40 % y el sueldo neto por hora mediano un 23 % entre 2016 y 2024; ocurre con cualquier año base (2016, 2018, 2019) y con media, mediana, bruto o neto.

## Cifras verificadas contra los datos

| En el guion | Valor en los datos | Estado | Origen |
|---|---|---|---|
| 188 | 188 | V | `cesta_2025_euros_mes` |
| 10,27 | 10,27 | C | `filas[anyo=2016].salario_neto_hora_mediana` |
| 12,63 | 12,63 | C | `filas[anyo=2024].salario_neto_hora_mediana` |
| 12,8 | 12,8 | C | `filas[anyo=2016].horas_neto_mediana` |
| 12,6 | 12,6 | C | `filas[anyo=2018].horas_neto_mediana` |
| 12,6 | 12,6 | C | `filas[anyo=2019].horas_neto_mediana` |
| 14,5 | 14,5 | C | `filas[anyo=2024].horas_neto_mediana` |
| 40 | 40 | C | `var_pct(filas[anyo=2016].cesta_euros_mes, filas[anyo=2024].cesta_euros_mes)` |
| 23 | 23 | C | `var_pct(filas[anyo=2016].salario_neto_hora_mediana, filas[anyo=2024].salario_neto_hora_mediana)` |
| 1,7 | 1,7 | C | `resta(filas[anyo=2016].horas_neto_mediana, filas[anyo=2024].horas_neto_mediana)` |
| cien minutos | 102.0 (dicho «cien minutos» ≈ 100) | C | `resta(filas[anyo=2016].horas_neto_mediana, filas[anyo=2024].horas_neto_mediana)` |

Generado por `scripts/verificar_guion.py`. No editar a mano: se edita `guion.json` y se vuelve a ejecutar.
