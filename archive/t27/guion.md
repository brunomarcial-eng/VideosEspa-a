# Guion T27 — ¿Hay más pobres que antes?

Pregunta: ¿Hay más o menos pobres que en 2008, la crisis, 2016 y 2019, midiendo con el mismo umbral de 2008 y con el de cada año? ¿Y cuánta gente no puede permitirse lo básico?  
Datos: `data/clean/t27_pobreza.json` · Bruno, 24-11-2026: «Todos. 4 vídeos… Ponte con ellos uno por uno»; el tercero, la pobreza («pobreza con umbral fijo», del principio). Tabla en videos/t27/paso-1-datos.md.  
Duración estimada de la voz: **66 s** (a 2.6 palabras/s) · Años en pantalla: 2008, 2013, 2016, 2019, 2025  
Un solo guion para los tres estilos (A pizarra, B cápsula, C baraja). La columna «Imagen» es la idea del plano; cada estilo la dibuja a su manera en el Paso 3.

| # | Tiempo | Quién | Voz | En pantalla | Sello de fuente | Imagen |
|---|---|---|---|---|---|---|
| 1 | 0-9 s | hijo (unos 30, ha mirado los datos) | ¿Hay más pobres que antes? Porque mi madre lleva veinte años en el banco de alimentos y dice que cada vez viene más gente. | ¿Hay más pobres que antes? | — | El almacén de un banco de alimentos de barrio: estanterías con latas y paquetes, cajas de cartón, una mesa de reparto. El hijo habla a cámara; la madre, con su chaleco de voluntaria, coloca cajas en la mesa. Cae el sello «SOLO DATOS OFICIALES». |
| 2 | 10-13 s | madre (unos 62, lleva veinte años de voluntaria en el banco de alimentos) | Hombre claro hijo. Esto está peor que en la crisis. | «Esto está peor que en la crisis» | — | La madre, con las manos en la cintura junto a la mesa de reparto. |
| 3 | 14-24 s | hijo (unos 30, ha mirado los datos) | Pues mira. Con la misma vara de 2008 hay menos pobres que nunca… el 17,5 %. En 2016 casi el 30 %. | Pobreza con el umbral de 2008: 17,5 % hoy <br>_El umbral de pobreza de 2008, actualizado solo con la inflación. 2008: 19,8 %; 2013: 28,1 %; 2016: 29,2 %; 2019: 24,9 %; 2025: 17,5 %, el mínimo de la serie_ | INE · CONDICIONES DE VIDA | Una regla de madera con la marca «2008» mide columnas de cada año; la de hoy, la más baja. |
| 4 | 24-27 s | madre (unos 62, lleva veinte años de voluntaria en el banco de alimentos) | Anda ya… ¿y entonces quién viene aquí? | «¿Y entonces quién viene aquí?» | — | La madre se queda con una caja en la mesa, sorprendida. |
| 5 | 27-33 s | hijo (unos 30, ha mirado los datos) | Con la vara de cada año seguimos como en 2008… uno de cada cinco. | Pobreza con el umbral de cada año: 19,5 % <br>_En 2008, 19,8 %: uno de cada cinco. Umbral de 2025 para una persona sola: 12.220 € al año (el 60 % de la mediana)_ | INE · CONDICIONES DE VIDA | Cinco muñequitos en fila; uno se ilumina, igual en 2008 que hoy. |
| 6 | 33-44 s | hijo (unos 30, ha mirado los datos) | Y lo que ha empeorado es lo básico. Los que no pueden comer carne o pescado cada dos días son más del doble que en 2008. | No pueden comer carne o pescado cada dos días: 5,4 % (2,2 % en 2008) <br>_Personas que no pueden permitirse una comida de carne, pollo o pescado al menos cada dos días_ | INE · CONDICIONES DE VIDA | Dos platos: el de 2008 con poca gente detrás; el de hoy, con más del doble. |
| 7 | 44-51 s | hijo (unos 30, ha mirado los datos) | Y casi 4 de cada 10 no podrían pagar un gasto imprevisto. En 2008 eran 3. | Sin dinero para un gasto imprevisto: 36,4 % (29,9 % en 2008) <br>_2013: 42,1 %; 2016: 38,7 %; 2019: 33,9 %; 2025: 36,4 %_ | INE · CONDICIONES DE VIDA | Una hucha vacía y una factura que cae de sorpresa. |
| 8 | 51-56 s | madre (unos 62, lleva veinte años de voluntaria en el banco de alimentos) | ¿Ves? Eso es lo que yo veo aquí todos los días. | «Eso es lo que yo veo aquí todos los días» | — | La madre señala la mesa de reparto, llena de cajas. |
| 9 | 56-66 s | madre (unos 62, lleva veinte años de voluntaria en el banco de alimentos) | O sea que hay menos pobres en la estadística pero más gente que no llega a lo básico. ¿Y tú podrías pagar mañana un gasto que no esperabas? | ¿Podrías pagar mañana un gasto que no esperabas? | — | Los dos en la mesa de reparto; la madre pregunta a cámara. |

**Cierre:** Con el umbral fijo de 2008, la pobreza mejora frente a todos los años (del 19,8 % de 2008, el 28,1 % de la crisis, el 29,2 % de 2016 y el 24,9 % de 2019 al 17,5 %, el mínimo); con el umbral de cada año está igual que en 2008 (19,5 % frente a 19,8 %). Pero lo básico empeora frente a 2008 y 2019: no poder comer carne o pescado cada dos días, del 2,2 % al 5,4 %, y no poder pagar un imprevisto, del 29,9 % (2008) y el 33,9 % (2019) al 36,4 %. Los ingresos de los que menos tienen han subido más que la inflación desde 2008 (por eso baja la pobreza con la vara fija), pero no lo bastante para cubrir lo básico y los imprevistos de más gente.

## Cifras verificadas contra los datos

| En el guion | Valor en los datos | Estado | Origen |
|---|---|---|---|
| 17,5 | 17,5 | V | `filas.2025.pobreza_umbral_fijo_2008_pct` |
| 30 | 29.2 (dicho «30» ≈ 30) | V | `filas.2016.pobreza_umbral_fijo_2008_pct` |
| 19,8 | 19,8 | V | `filas.2008.pobreza_umbral_fijo_2008_pct` |
| 28,1 | 28,1 | V | `filas.2013.pobreza_umbral_fijo_2008_pct` |
| 29,2 | 29,2 | V | `filas.2016.pobreza_umbral_fijo_2008_pct` |
| 24,9 | 24,9 | V | `filas.2019.pobreza_umbral_fijo_2008_pct` |
| 19,5 | 19,5 | V | `filas.2025.pobreza_relativa_pct` |
| 19,8 | 19,8 | V | `filas.2008.pobreza_relativa_pct` |
| 60 | 60.0 (dicho «60» ≈ 60) | V | `filas.2025.pobreza_relativa_pct` |
| 12.220 | 12.220 | V | `filas.2025.umbral_1_persona_eur` |
| 5,4 | 5,4 | V | `filas.2025.no_carne_pescado_pct` |
| 2,2 | 2,2 | V | `filas.2008.no_carne_pescado_pct` |
| 36,4 | 36,4 | V | `filas.2025.no_imprevistos_pct` |
| 29,9 | 29,9 | V | `filas.2008.no_imprevistos_pct` |
| 42,1 | 42,1 | V | `filas.2013.no_imprevistos_pct` |
| 38,7 | 38,7 | V | `filas.2016.no_imprevistos_pct` |
| 33,9 | 33,9 | V | `filas.2019.no_imprevistos_pct` |
| 4 | 3.6 (dicho «4» ≈ 3.8) | V | `filas.2025.no_imprevistos_pct` |
| 3 | 3.0 (dicho «3» ≈ 3) | V | `filas.2008.no_imprevistos_pct` |

Generado por `scripts/verificar_guion.py`. No editar a mano: se edita `guion.json` y se vuelve a ejecutar.
