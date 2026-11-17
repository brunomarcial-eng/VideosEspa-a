# Guion T5 — ¿Y los nietos pa cuándo?

Pregunta: Padre (62) contra hijo (31), tercera parte: ¿por qué los hijos llegan tan tarde?  
Datos: `data/clean/t5_natalidad.json` · Tabla y guion aprobados por Bruno el 17-11-2026 (videos/t5/paso-1-datos.md v2, sin el ejemplo de Francia)  
Duración estimada de la voz: **53 s** (a 3.05 palabras/s) · Años en pantalla: 1986, 1987, 2006, 2007, 2016  
Un solo guion para los tres estilos (A pizarra, B cápsula, C baraja). La columna «Imagen» es la idea del plano; cada estilo la dibuja a su manera en el Paso 3.

| # | Tiempo | Quién | Voz | En pantalla | Sello de fuente | Imagen |
|---|---|---|---|---|---|---|
| 1 | 0-6 s | padre (62 años) | ¿Y los nietos pa cuándo, eh? ¡Que tu madre y yo, a tu edad, ya te teníamos en brazos! | ¿Y los nietos pa cuándo? | — | La cocina. El padre hace el gesto de acunar; sobre su cabeza aparece un bocadillo con una cuna. |
| 2 | 7-15 s | hijo (31 años) | Papá, primero hace falta casa. En 1987, un piso costaba 3 años de lo que ganaba un hogar. Hoy, más de 8. | Un piso, en años de lo que gana un hogar · 1987: 3,1 · hoy: 8,4 <br>_En 2006: 8,8. En 2016: 6,7_ | DATO OFICIAL · BANCO DE ESPAÑA (precio de la vivienda entre la renta bruta de un hogar) | Como en un sueño, la cocina se deshace y están en la calle. Un bloque crece planta a planta: 3 plantas en 1987 y 8 hoy (una planta, un año de ingresos). |
| 3 | 15-17 s | padre (62 años) | ¡Pues casaos y a vivir! | «¡Pues casaos!» | — | En la calle. Dos anillos saltan y brillan. |
| 4 | 17-21 s | hijo (31 años) | Vosotros os casabais a los 26. Ahora, a los 36. | Edad media al primer matrimonio · 1986: 26 · hoy: 36,2 <br>_En 2007: 31. En 2016: 34_ | DATO OFICIAL · INE (Indicadores Demográficos Básicos) | La calle se deshace y están en una boda: arco de flores, guirnaldas y la tarta. Un contador de edad pasa de 26 a 36. |
| 5 | 22-25 s | padre (62 años) | ¡Si es que ahora las bodas son un festival! | «¡Las bodas son un festival!» | — | En la boda. Se encienden luces de colores, cae confeti y saltan notas musicales. |
| 6 | 25-30 s | hijo (31 años) | El primer hijo llegaba a los 26. Hoy, a los treinta y uno y medio. | Edad media de la madre al primer hijo · 1986: 26 · hoy: 31,5 <br>_En 2007: 29,4. En 2016: 30,8_ | DATO OFICIAL · INE (Indicadores Demográficos Básicos) | La boda se deshace y están en una sala de cunas, casi todas vacías. Una cuna avanza por una regla de edades de 26 a 31,5. |
| 7 | 30-35 s | hijo (31 años) | Y de 1,55 hijos por mujer hemos pasado a 1,1. | Hijos por mujer · 1986: 1,55 · hoy: 1,10 <br>_En 2007: 1,38. En 2016: 1,33_ | DATO OFICIAL · INE (Indicadores Demográficos Básicos) | En la sala de cunas. Dos filas de bebés: en 1986, uno y medio; hoy, uno y poco. |
| 8 | 36-38 s | padre (62 años) | ¡Eso es que no queréis, hombre! | «¡Eso es que no queréis!» | — | El padre señala al hijo; el hijo niega con la cabeza. |
| 9 | 38-49 s | hijo (31 años) | Casi tres de cada cuatro mujeres querrían al menos dos. Y las que tienen menos de los que querían, a partir de los 35, dicen que es por el trabajo y el dinero. | Casi 3 de cada 4 mujeres querrían tener al menos dos hijos · Desde los 35, las que tienen menos de los que querían: razones laborales o de conciliación, y económicas | DATO OFICIAL · INE (Encuesta de Fecundidad 2018) | En la sala de cunas. Cuatro mujeres; casi tres se iluminan con un bocadillo de dos bebés. Luego aparecen un maletín y una moneda. |
| 10 | 49-53 s | hijo (31 años) | Casa, boda, hijos… todo llega más tarde. ¿Casualidad? ¿Tú qué opinas? | Casa, boda, hijos: todo llega más tarde. ¿Casualidad? | — | La sala se deshace y vuelven a la cocina. Los dos a cámara; botones «PADRE» e «HIJO» y un bocadillo. |

**Cierre:** frente a 1986, empeora: la casa cuesta casi tres veces más años de ingresos, la boda llega diez años más tarde, el primer hijo cinco años y medio más tarde y hay casi un tercio menos de hijos por mujer. Banco de España: piso medio, 3,1 años de renta bruta de un hogar en 1987 y 8,4 en 2026. INE: primer matrimonio a los 26 en 1986 y a los 36,2 en 2024; primer hijo a los 25,9 y a los 31,5; hijos por mujer, 1,55 y 1,10. Encuesta de Fecundidad 2018: casi tres de cada cuatro mujeres desearían al menos dos hijos; desde los 35, las que tienen menos de los deseados lo atribuyen sobre todo a razones laborales o de conciliación y económicas.

## Cifras verificadas contra los datos

| En el guion | Valor en los datos | Estado | Origen |
|---|---|---|---|
| 3 | 3 | V | `vivienda_bde.1987` |
| 3,1 | 3,1 | V | `vivienda_bde.1987` |
| 8,4 | 8,4 | V | `vivienda_bde.2026` |
| 8 | 8 | V | `vivienda_bde.2026` |
| 8,8 | 8,8 | V | `vivienda_bde.2006` |
| 6,7 | 6,7 | V | `vivienda_bde.2016` |
| 26 | 26 | V | `edad_primer_matrimonio.1986` |
| 36 | 36 | V | `edad_primer_matrimonio.2024` |
| 36,2 | 36,2 | V | `edad_primer_matrimonio.2024` |
| 31 | 31 | V | `edad_primer_matrimonio.2007` |
| 34 | 34 | V | `edad_primer_matrimonio.2016` |
| 26 | 26 | V | `edad_primer_hijo.1986` |
| 31,5 | 31,5 | V | `edad_primer_hijo.2024` |
| 29,4 | 29,4 | V | `edad_primer_hijo.2007` |
| 30,8 | 30,8 | V | `edad_primer_hijo.2016` |
| 1,55 | 1,55 | V | `hijos_por_mujer.1986` |
| 1,1 | 1,1 | V | `hijos_por_mujer.2024` |
| 1,10 | 1,10 | V | `hijos_por_mujer.2024` |
| 1,38 | 1,38 | V | `hijos_por_mujer.2007` |
| 1,33 | 1,33 | V | `hijos_por_mujer.2016` |

Generado por `scripts/verificar_guion.py`. No editar a mano: se edita `guion.json` y se vuelve a ejecutar.
