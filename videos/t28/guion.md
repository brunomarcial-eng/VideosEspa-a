# Guion T28 — ¿Tener un bebé cuesta hoy más horas de trabajo?

Pregunta: ¿Cuántas horas de trabajo cuestan la guardería (0-3 años) y los alimentos para bebé, hoy y en 2007, 2013, 2016 y 2019? ¿Y cuántos hijos tenemos?  
Datos: `data/clean/t28_bebe.json` · Bruno, 24-11-2026: «Todos. 4 vídeos… Ponte con ellos uno por uno»; el cuarto, lo que cuesta un bebé (familias con hijos, del principio). Tabla en videos/t28/paso-1-datos.md.  
Duración estimada de la voz: **61 s** (a 2.6 palabras/s) · Años en pantalla: 2007, 2013, 2016, 2019, 2025  
Un solo guion para los tres estilos (A pizarra, B cápsula, C baraja). La columna «Imagen» es la idea del plano; cada estilo la dibuja a su manera en el Paso 3.

| # | Tiempo | Quién | Voz | En pantalla | Sello de fuente | Imagen |
|---|---|---|---|---|---|---|
| 1 | 0-9 s | hija (unos 38, embarazada de su primer hijo) | ¿Tener un bebé cuesta hoy más horas de trabajo que antes? Porque mi padre dice que criar un hijo hoy es un lujo. | ¿Tener un bebé cuesta hoy más horas de trabajo? | — | Una tienda de cosas de bebé: cunas, carritos, estanterías con leche y pañales, ropita colgada. La hija, embarazada, habla a cámara; el padre mira el precio de una cuna. Cae el sello «SOLO DATOS OFICIALES». |
| 2 | 9-13 s | padre (unos 62, convencido de que criar hoy es un lujo) | Hombre claro. Solo la guardería ya te cuesta un riñón ¿eh? | «Solo la guardería ya te cuesta un riñón» | — | El padre, señalando un cartel de una guardería en el tablón de la tienda. |
| 3 | 14-26 s | hija (unos 38, embarazada de su primer hijo) | Pues los que la pagan gastan de media 1.675 euros al año… unas 129 horas de trabajo. En 2016 eran 156. | Guardería: 1.675 € al año = 129 horas de trabajo <br>_Primer ciclo de Educación Infantil, de 0 a 3 años: gasto medio de los hogares que la pagan (2025). 2016: 1.603 € (156 horas); 2019: 1.905 € (176 horas). Sueldo neto mediano por hora_ | INE · PRESUPUESTOS FAMILIARES Y SALARIOS | Una mochila de guardería y un reloj de horas que se vacía un poco frente a 2016. |
| 4 | 26-29 s | padre (unos 62, convencido de que criar hoy es un lujo) | Anda ya… ¿y la leche y los potitos? | «¿Y la leche y los potitos?» | — | El padre coge con la mirada un bote de leche de la estantería (el bote, en la estantería). |
| 5 | 29-38 s | hija (unos 38, embarazada de su primer hijo) | Cuestan un 9 % menos tiempo de trabajo que en 2007. Eso sí un 9 % más que en 2019. | Leche infantil y potitos: un 9 % menos horas que en 2007 <br>_Precio (IPC de alimentos para bebé) entre el sueldo neto mediano por hora. Hoy, frente a 2007: −9,4 %; a 2013: −3,7 %; a 2016: +2,2 %; a 2019: +9,2 %_ | INE · IPC Y SALARIOS | Columnas de tiempo de trabajo por año para la comida del bebé: más alta en 2007, más baja en 2019, hoy en medio. |
| 6 | 38-43 s | padre (unos 62, convencido de que criar hoy es un lujo) | Pues entonces criar sale más barato que en mis tiempos ¿no? | «Más barato que en mis tiempos» | — | El padre, sorprendido, se apoya en un carrito. |
| 7 | 43-53 s | hija (unos 38, embarazada de su primer hijo) | En horas sí. Y aun así nacen menos niños… en 2007 eran 1,38 hijos por mujer y hoy 1,11. | Hijos por mujer: 1,38 en 2007, 1,11 hoy <br>_2013: 1,27; 2016: 1,33; 2019: 1,23; 2025: 1,11. Nacimientos por cada mil habitantes: 10,9 en 2007 y 6,5 en 2025_ | INE · MOVIMIENTO NATURAL DE LA POBLACIÓN | Una fila de cunas: en 2007 más llenas que hoy. |
| 8 | 54-61 s | padre (unos 62, convencido de que criar hoy es un lujo) | O sea que criar cuesta menos horas pero tenemos menos hijos. ¿Tú por qué crees que nacen menos niños? | ¿Por qué crees que nacen menos niños? | — | Los dos junto a una cuna; el padre pregunta a cámara. |

**Cierre:** En horas de trabajo, la guardería mejora frente a 2016 (156 → 129 horas al año) y 2019 (176); la leche y los potitos mejoran frente a 2007 (−9 %) y la crisis (−4 %), y empeoran frente a 2016 (+2 %) y 2019 (+9 %). Y aun así tenemos menos hijos: 1,38 por mujer en 2007, 1,11 hoy. Los sueldos han subido más que el precio de la comida del bebé desde 2007, y lo que pagan de guardería los hogares que la pagan es menos en horas que en 2016. La natalidad baja igual: el vídeo no da la causa.

## Cifras verificadas contra los datos

| En el guion | Valor en los datos | Estado | Origen |
|---|---|---|---|
| 1.675 | 1675.4 (dicho «1.675» ≈ 1675) | V | `filas.2025.guarderia_anual` |
| 129 | 129.1 (dicho «129» ≈ 129) | C | `filas.2025.guarderia_horas` |
| 156 | 156.1 (dicho «156» ≈ 156) | C | `filas.2016.guarderia_horas` |
| 1.603 | 1603.3 (dicho «1.603» ≈ 1603) | V | `filas.2016.guarderia_anual` |
| 1.905 | 1905.3 (dicho «1.905» ≈ 1905) | V | `filas.2019.guarderia_anual` |
| 176 | 175.6 (dicho «176» ≈ 176) | C | `filas.2019.guarderia_horas` |
| 9 | 9.4 (dicho «9» ≈ 9.4) | C | `alimentos_bebe_hoy_frente_a_pct.2007` |
| 9 | 9.2 (dicho «9» ≈ 9.2) | C | `alimentos_bebe_hoy_frente_a_pct.2019` |
| 9,4 | 9,4 | C | `alimentos_bebe_hoy_frente_a_pct.2007` |
| 3,7 | 3,7 | C | `alimentos_bebe_hoy_frente_a_pct.2013` |
| 2,2 | 2,2 | C | `alimentos_bebe_hoy_frente_a_pct.2016` |
| 9,2 | 9,2 | C | `alimentos_bebe_hoy_frente_a_pct.2019` |
| 1,38 | 1,38 | V | `filas.2007.hijos_por_mujer` |
| 1,11 | 1,11 | V | `filas.2025.hijos_por_mujer` |
| 1,27 | 1,27 | V | `filas.2013.hijos_por_mujer` |
| 1,33 | 1,33 | V | `filas.2016.hijos_por_mujer` |
| 1,23 | 1,23 | V | `filas.2019.hijos_por_mujer` |
| 10,9 | 10,9 | V | `filas.2007.natalidad_por_mil` |
| 6,5 | 6,5 | V | `filas.2025.natalidad_por_mil` |

Generado por `scripts/verificar_guion.py`. No editar a mano: se edita `guion.json` y se vuelve a ejecutar.
