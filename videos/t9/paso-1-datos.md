# T9 · Paso 1: datos, borrador y prueba de estilo (pendiente de Bruno)

**¿Cuántas horas te cuesta vivir?** Padre contra hijo, séptima parte. Lo pidió Bruno el 19-11-2026: más contenido en horas de trabajo de los temas que han salido en T3, T7 y T8, y personajes con más movimiento, más dinámica y más volumen.

Datos limpios en `data/clean/t9_horas.json` (`scripts/calcular_t9.py`). Fuentes en `data/raw/` (MANIFEST).

## Cómo se mide (cálculo propio, estado C, con datos oficiales, V)
- **Horas de trabajo = precio / sueldo neto por hora del trabajador medio.** Se usa la media y no la mediana porque en 1986 no hay mediana.
- **Sueldo bruto por hora:**
  - **1986:** 740 pesetas (INE, Encuesta de Salarios, industria y servicios).
  - **2006:** EAES de 2008, llevada a 2006 con la ETCL (encuesta trimestral de coste laboral): 12,34 €.
  - **2016:** EAES, 14,88 €.
  - **2026:** EAES de 2024, puesta al día con la ETCL del 1.er semestre de 2026: 20,45 €.
- **Neto:** se restan el IRPF y las cotizaciones del trabajador con las normas del BOE de cada año (las mismas cuentas que T8, Madrid en 2026). En 2016, el neto sale de Eurostat. Lo que se lleva limpio de cada euro bruto: 0,80 € en 1986, 0,80 € en 2006, 0,80 € en 2016 y 0,78 € en 2026.
- **Sueldo neto por hora, en euros de cada año:** 3,55 € (590 pesetas) en 1986, 9,89 € en 2006, 11,94 € en 2016 y 15,86 € en 2026.

## Resultados
| En tiempo de trabajo | 1986 | 2006 | 2016 | Hoy |
|---|---|---|---|---|
| **Días que trabajas para el Estado** (IRPF + cotizaciones, sueldo medio) | hasta el 25 de mayo (39,8 %) | hasta el 24 de mayo (39,4 %) | — | **hasta el 31 de mayo** (41,4 %) |
| **Piso de 90 m²**, en años de sueldo limpio | 4,3 | 11,1 | 7,3 | **8,5** |
| **Depósito de 50 litros de gasóleo**, en horas | 5,1 | 4,8 | 4,2 | **5,8** |
| **Luz de una casa** (3.500 kWh al año), horas al año | — | 47 | 66 | **61** (2025) |
| **Comida de un mes por persona**, en horas | — | 11,2 | 11,0 | **12,1** |

**Mejora o empeora frente a cada año:**
- **Estado:** peor que en 1986 (+6 días) y que en 2006 (+7 días).
- **Piso:** el doble de años que en 1986 y un 16 % más que en 2016. Menos que en 2006, en plena burbuja: el vídeo lo dice.
- **Depósito:** peor que en 1986 (+14 %), que en 2006 (+21 %) y que en 2016 (+38 %).
- **Luz:** peor que en 2006 (+30 %). Algo mejor que en 2016 (−7 %): el vídeo lo dice.
- **Comida:** peor que en 2006 (+8 %) y que en 2016 (+10 %).

**Precios que se han usado:**
- **1986:**
  - **Gasóleo A:** el precio lo fijaba el Gobierno (BOE): 62 pesetas el litro en enero y febrero, y 60 desde el 1 de marzo. Media del año: 60,3.
  - **Gasolina súper:** 87 y 82 pesetas. Con gasolina, el depósito costaba 7,0 horas en 1986, 5,2 en 2006, 4,8 en 2016 y 5,6 hoy.
- **2006, 2016 y 2026:** media anual del boletín petrolero de la Comisión Europea. En 2026 se ponen los impuestos de la ley, sin las rebajas temporales, como en T8.
- **Luz:**
  - **Fuente:** Eurostat, precio para los hogares con todos los impuestos. La serie de España empieza en 1991, así que no hay 1986.
  - **2006:** se enlaza con el cambio de método de 2007.
  - **2025:** es el último año entero. En 2026 hubo rebajas temporales del IVA y del impuesto de la luz.
- **Comida:** la cesta fija de T1 (el gasto medio por persona en comida de la EPF de 2025, con el IPC de alimentos de cada año). El IPC de alimentos empieza en 2002.
- **Piso:** el valor tasado del Banco de España × 90 m², y 1986 de T3, igual que en el vídeo de la vivienda.

## Borrador del guion (unos 60 s; verificado con `scripts/verificar_guion.py`)
Decorados como en un sueño: cocina → oficina → calle → gasolinera → salón → súper → cocina.
1. **Padre** (cocina, con el periódico): Los jóvenes os quejáis de vicio. ¡En mis tiempos también costaba todo!
2. **Hijo** (oficina, calendario que pasa hojas): Pues vamos a contarlo en horas de trabajo. Hoy trabajas para el Estado hasta el 31 de mayo. En 1986, hasta el 25.
3. **Padre** (calle, bloque en venta): ¿Y el piso? ¡Yo me dejé los cuernos para pagarlo!
4. **Hijo:** Tú lo pagabas con 4 años de sueldo. Yo, con 8 y medio. Y en 2006, con la burbuja, eran 11.
5. **Padre** (gasolinera): Bueno, pero llenar el depósito…
6. **Hijo:** Un depósito de gasóleo: 5 horas de trabajo en 1986. Hoy, casi 6.
7. **Padre** (salón): ¿Y la factura de la luz?
8. **Hijo:** 47 horas de trabajo al año en 2006. Hoy, 61. Algo menos que en 2016, eso sí.
9. **Padre** (súper): Hombre, la compra estará igual.
10. **Hijo:** La comida de un mes: 11 horas de trabajo en 2006. Hoy, 12.
11. **Hijo, a cámara:** ¿Quién lo tiene más difícil, tus padres o tú? ¿Tú qué opinas?

## Estilo nuevo (prueba: las cuatro primeras escenas, sin voz)
- **Volumen:** luz arriba a la izquierda y sombra abajo a la derecha en la cabeza, el cuerpo, los brazos y las piernas, con un brillo en el pelo y una sombra bajo la barbilla.
- **Movimiento:**
  - Los personajes respiran y se balancean.
  - Al hablar asienten, botan un poco y mueven las manos, y los gestos rebotan.
  - Saltan cuando se enfadan o se sorprenden.
  - Andan con más paso.
- **Cámara:** se acerca despacio durante el plano y da un golpe de zoom en cada dato.
- **Objetos nuevos (`diseno/horas.mjs`):** calendario que pasa hojas, filas de relojes que se llenan, años de sueldo en calendarios, bombilla y contador de la luz.
- **Vídeos ya aprobados:** el volumen y el movimiento son opcionales y no cambian.

## Pendiente de Bruno
1. Datos y borrador.
2. Estilo nuevo.
