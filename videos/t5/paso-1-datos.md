# T5 · Paso 1: datos y borrador (pendiente de aprobar)

**«¿Y los nietos pa cuándo?»** Padre contra hijo, tercera parte: natalidad y envejecimiento. Lo eligió Bruno el 17-11-2026 (idea 1).

Datos limpios en `data/clean/t5_natalidad.json` (`scripts/calcular_t5.py`). Ficheros originales en `data/raw/`, con su huella en `MANIFEST.csv`. Todo es del INE.

## Datos

| Dato | 1986 | 2007 | 2016 | 2019 | Hoy | Fuente | Estado |
|---|---|---|---|---|---|---|---|
| Hijos por mujer (indicador coyuntural de fecundidad) | **1,55** | 1,38 | 1,33 | 1,23 | **1,10** (2024) | [INE 1407](https://www.ine.es/jaxiT3/Tabla.htm?t=1407) | V |
| Edad media de la madre al primer hijo | **25,9** | 29,5 | 30,8 | 31,1 | **31,5** (2024) | [INE 1579](https://www.ine.es/jaxiT3/Tabla.htm?t=1579) | V |
| Edad media al primer matrimonio (hombres y mujeres) | **26,0** | 31,0 | 34,0 | 34,9 | **36,2** (2024) | [INE 1380](https://www.ine.es/jaxiT3/Tabla.htm?t=1380) | V |
| Nacimientos por cada 1.000 habitantes | 11,4 | 10,9 | 8,8 | 7,6 | 6,5 (2024) | [INE 1381](https://www.ine.es/jaxiT3/Tabla.htm?t=1381) | V |
| Mayores de 64 por cada 100 menores de 16 (índice de envejecimiento) | **49** | 106 | 116 | 123 | **148** (2025) | [INE 1418](https://www.ine.es/jaxiT3/Tabla.htm?t=1418) | V |
| Población de 65 años o más | 12,1 % | 16,5 % | 18,7 % | 19,3 % | 20,7 % (2025) | [INE 1417](https://www.ine.es/jaxiT3/Tabla.htm?t=1417) | V |
| Mujeres que querrían tener al menos dos hijos | — | — | — | casi 3 de cada 4 (2018) | — | [INE, Encuesta de Fecundidad 2018](https://www.ine.es/prensa/ef_2018_a.pdf) | V |

**Qué se puede decir:**
- Los hijos llegan cinco años y medio más tarde que en 1986.
- La boda llega diez años más tarde.
- Hay casi un tercio menos de hijos por mujer.
- En 1986 había dos niños por cada mayor; hoy, tres mayores por cada dos niños.
- La conclusión es la misma con cualquier año base: todo empeora sin parar desde 1986.

**Qué no se puede decir:**
- Por qué pasa. El vídeo no lo atribuye a nada (regla 3).
- Solo se puede citar lo que **declaran** las mujeres en la encuesta del INE: «a partir de los 35 años, las razones laborales o de conciliación y las económicas son las más importantes por las que las mujeres han tenido menos hijos de los deseados». Si sale, va como «según ellas mismas, en la encuesta del INE».

## Borrador del guion (padre contra hijo; unos 60 s)

El decorado cambia como en un sueño, igual que en T4.

| # | Dónde | Quién | Lo que dice |
|---|---|---|---|
| 1 | Cocina | Padre | ¿Y los nietos pa cuándo, eh? ¡Que tu madre y yo, a tu edad, ya te teníamos en brazos! |
| 2 | Parque vacío (columpio quieto) | Hijo | Pues ibais tarde, papá. En 1986, el primer hijo llegaba a los 26. Hoy, a los treinta y uno y medio. |
| 3 | Parque | Padre | ¡Porque antes nos casábamos jóvenes! |
| 4 | Boda (arroz, tarta) | Hijo | A los 26. Hoy, a los 36. Diez años más tarde. |
| 5 | Boda | Padre | ¡Pues no os caséis, pero tened críos! |
| 6 | Sala de cunas (casi vacía) | Hijo | Hijos por mujer: en 1986, 1,55. Hoy, 1,1. Y tres de cada cuatro mujeres querrían tener al menos dos. |
| 7 | Plaza con bancos llenos de mayores | Padre | ¿Y entonces quién va a pagar mi pensión? |
| 8 | Plaza | Hijo | Buena pregunta. En 1986 había 49 mayores por cada 100 niños. Hoy, 148. |
| 9 | Cocina | Hijo, a cámara | ¿Quién lo tuvo más fácil para tener hijos: su generación o la mía? ¿Tú qué opinas? |

**Notas:**
- La pensión sale como **pregunta del padre**, sin dar causas ni hablar de partidos.
- La broma «ibais tarde» es porque el padre tuvo al hijo a los 31, más tarde que la media de entonces.
