# Guion T1 — ¿Te cunde el carro igual que antes?

Pregunta: ¿Cuántas horas de trabajo cuesta la compra de comida de un mes, en 2016, 2019 y hoy?  
Datos: `data/clean/t1_cesta_horas.json` · 2026-11-09 (Paso 1 aprobado: cesta fija EPF 2025, neto y mediana, sin 2007)  
Duración estimada de la voz: **55 s** (a 2.6 palabras/s) · Años en pantalla: 2016, 2018, 2019, 2024  
Un solo guion para los tres estilos (A pizarra, B cápsula, C baraja). La columna «Imagen» es la idea del plano; cada estilo la dibuja a su manera en el Paso 3.

| # | Tiempo | Quién | Voz | En pantalla | Sello de fuente | Imagen |
|---|---|---|---|---|---|---|
| 1 | 0-5 s | narrador (voz) | Oye, una pregunta: ¿a ti el carro te cunde igual que antes? | (subtítulo) | — | Pasillo del súper. Entra el carro lleno; Dani asoma por detrás y mira a cámara. |
| 2 | 5-9 s | narrador (voz) | Vamos a comprobarlo. Pero sin euros, ¿eh? En horas de curro. | € → horas de trabajo | — | Una moneda de euro gigante cae, gira y se convierte en una moneda-reloj. |
| 3 | 9-12 s | narrador (voz) | Este es Dani. Año 2016. | DANI · 2016 | — | Dani, joven y sin barba, saluda. Una hoja de calendario con 2016 se pega a su lado. |
| 4 | 12-16 s | narrador (voz) | Hace la compra del mes: pan, leche, huevos, aceite… lo de siempre. | La compra del mes <br>_Comida y bebida sin alcohol · gasto medio por persona_ | — | El pan, la leche, los huevos y el aceite caen al carro, cada uno cuando se nombra. |
| 5 | 16-20 s | narrador (voz) | ¿Y cuánto le cuesta? 12,8 horas de trabajo. | 2016 · 12,8 h de trabajo | CÁLCULO PROPIO (C) · horas = compra ÷ sueldo neto por hora · INE y Eurostat | La caja registradora no marca euros: cuenta horas hasta 12,8. Dani paga con monedas-reloj y sale el ticket. |
| 6 | 20-25 s | narrador (voz) | Ahora, el mismo Dani, con el último dato oficial. Mismo carro, ¿vale? | 2024 · último dato oficial de salarios | — | Vuelan las hojas del calendario hasta 2024. A Dani le sale barba. Entra el mismo carro, idéntico. |
| 7 | 25-27 s | narrador (voz) | Pues… 14,5 horas. | 2016 · 12,8 h → 2024 · 14,5 h | CÁLCULO PROPIO (C) · horas = compra ÷ sueldo neto por hora · INE y Eurostat | La misma caja: el contador arranca en 12,8 y sigue subiendo hasta 14,5. Dani se queda con la boca abierta. |
| 8 | 27-32 s | narrador (voz) | Y ojo, que Dani ahora cobra más: un 23 % más por hora, ya limpio. | Sueldo neto por hora (mediana) +23 % | CÁLCULO PROPIO (C) · horas = compra ÷ sueldo neto por hora · INE y Eurostat | Su nómina: la barra del sueldo por hora crece un 23 %. Dani, tan contento. |
| 9 | 32-37 s | narrador (voz) | Lo que pasa es que la compra, la misma, ha subido un 40. | Sueldo +23 % · La misma compra +40 % | CÁLCULO PROPIO (C) · horas = compra ÷ sueldo neto por hora · INE y Eurostat | Al lado de la nómina sube el carro sobre su barra: la compra crece un 40 % y deja atrás al sueldo. Dani mira hacia arriba. |
| 10 | 37-43 s | narrador (voz) | ¿Y sabes qué? En 2019 todavía le costaba 12,6. El salto vino después. | 2016 · 12,8 h   2019 · 12,6 h   2024 · 14,5 h | CÁLCULO PROPIO (C) · horas = compra ÷ sueldo neto por hora · INE y Eurostat | Tres tickets tendidos de una cuerda: 2016 y 2019, igual de largos; el de 2024 se desenrolla y pasa la marca. |
| 11 | 43-46 s | narrador (voz) | Entonces, ¿qué? ¿Mejora, empeora o depende? | MEJORA · EMPEORA · DEPENDE | — | Tres sellos de caucho sobre el mostrador; aparece cada uno cuando se nombra. |
| 12 | 46-51 s | narrador (voz) | Esta vez, empeora. Casi dos horas más de curro al mes… por lo mismo. | EMPEORA · +1,7 h al mes <br>_Con 2016, 2018 o 2019 · con sueldo medio o mediano, bruto o neto_ | CÁLCULO PROPIO (C) · horas = compra ÷ sueldo neto por hora · INE y Eurostat | El sello de EMPEORA cae de golpe sobre el ticket largo y deja la marca. |
| 13 | 51-55 s | narrador (voz) | ¿Y a ti? ¿Te cunde más o menos? Te leo. | ¿Y a ti? | — | Dani mira a cámara y aparece un bocadillo de comentario vacío, esperando respuesta. |

**Cierre:** empeora. La misma compra subió un 40 % y el sueldo neto por hora mediano un 23 % entre 2016 y 2024: 1,7 horas más de trabajo al mes. Ocurre con cualquier año base (2016, 2018, 2019) y con media, mediana, bruto o neto.

## Cifras verificadas contra los datos

| En el guion | Valor en los datos | Estado | Origen |
|---|---|---|---|
| 12,8 | 12,8 | C | `filas[anyo=2016].horas_neto_mediana` |
| 14,5 | 14,5 | C | `filas[anyo=2024].horas_neto_mediana` |
| 12,6 | 12,6 | C | `filas[anyo=2019].horas_neto_mediana` |
| 23 | 23 | C | `var_pct(filas[anyo=2016].salario_neto_hora_mediana, filas[anyo=2024].salario_neto_hora_mediana)` |
| 40 | 40 | C | `var_pct(filas[anyo=2016].cesta_euros_mes, filas[anyo=2024].cesta_euros_mes)` |
| 1,7 | 1,7 | C | `resta(filas[anyo=2016].horas_neto_mediana, filas[anyo=2024].horas_neto_mediana)` |
| Casi dos horas | 1.7 (dicho «Casi dos horas» ≈ 2) | C | `resta(filas[anyo=2016].horas_neto_mediana, filas[anyo=2024].horas_neto_mediana)` |

Generado por `scripts/verificar_guion.py`. No editar a mano: se edita `guion.json` y se vuelve a ejecutar.
