# T24 · ¿Cuántas horas trabajas para llenar el depósito? · Paso 1: datos (24-11-2026)

Tema elegido por Bruno el 24-11-2026 («llenar el depósito», entre regalos de Reyes, llenar el depósito, móvil e internet y matrícula). Pregunta: ¿cuántas horas de trabajo cuesta llenar un depósito de 50 litros, hoy y antes?
Datos: `scripts/extraer_epf_carburantes.py` y `scripts/calcular_t24.py` → `data/clean/t24_deposito.json`. Crudos en `data/raw/t24/`.

| Dato | Valor | Año | Fuente oficial | Consultado | Estado |
|---|---|---|---|---|---|
| Gasto y litros de carburante por hogar (gasolina y gasóleo juntos, código 07221) | 1.350,03 € y 1.346,4 l · 1.350,08 € y 988,0 l | 2007 · 2013 | INE, microdatos de la Encuesta de Presupuestos Familiares base 2006 (el gasto cuadra al céntimo con la tabla 10629) | 24-11-2026 | V (gasto) · C (litros, de los microdatos) |
| Gasto medio por hogar en gasóleo y gasolina | 563,86 + 525,32 € · 664,72 + 612,05 € · 511,63 + 658,75 € | 2016 · 2019 · 2025 | INE, EPF base 2016, tabla 73781 | 24-11-2026 | V |
| Litros por hogar al año, gasóleo y gasolina | 556,0 + 474,6 · 551,9 + 489,7 · 369,6 + 457,1 | 2016 · 2019 · 2025 | INE, EPF, tabla 73844 | 24-11-2026 | V |
| IPC de octubre de 2026 (media de 2025 = 100) | gasóleo 134,0 · gasolina 118,7 | oct-2026 | INE, IPC, subclases ECOICOP v2, tabla 76128 | 24-11-2026 | V |
| Coste salarial total por hora, 1.er semestre | 35,84 € (2025) · 37,66 € (2026): +5,1 % | 2025-2026 | INE, ETCL, tabla 6040 (el 3.er trimestre de 2026 aún no está publicado) | 24-11-2026 | V |
| Sueldo neto mediano por hora | 8,79 € · 9,90 € · 10,27 € · 10,85 € · 12,98 € · 13,64 € | 2007 · 2013 · 2016 · 2019 · 2025 · oct-2026 | INE (EAES y ETCL), método de T1; octubre de 2026 = 2025 × ETCL | 24-11-2026 | C |

## Cálculos (C)
Depósito de 50 litros (un coche compacto; supuesto, se dice). Precio = gasto / litros (gasolina y gasóleo juntos, lo que pagan de media los hogares).

| | 2007 | 2013 (crisis) | 2016 | 2019 | 2025 | **Hoy (oct-2026)** |
|---|---|---|---|---|---|---|
| Litro de carburante | 1,00 € | 1,37 € | 1,06 € | 1,23 € | 1,42 € | **1,78 €** (gasóleo 1,86 · gasolina 1,71) |
| Llenar 50 litros | 50 € | 68 € | 53 € | 61 € | 71 € | **89 €** |
| **Horas de trabajo** | **5 h 42 min** | **6 h 54 min** | **5 h 09 min** | **5 h 39 min** | **5 h 27 min** | **6 h 30 min** |
| Litros por hogar al año | 1.346 | 988 | 1.031 | 1.042 | 827 | — |

Desde la media de 2025: gasóleo +34 %, gasolina +19 %, sueldo (ETCL, 1.er semestre) +5 %.
Los hogares echan hoy (2025) un 39 % menos de litros al año que en 2007.

## Veredicto
- **Empeora frente a 2007 (+48 min), 2016 (+1 h 21 min), 2019 (+51 min) y la media de 2025 (+1 h 03 min).**
- **Mejora un poco frente a la crisis (−24 min): llenar el depósito cuesta hoy casi lo mismo que en plena crisis.**
- El porqué, con datos: en 2026 el carburante ha subido mucho más que el sueldo (gasóleo +34 %, gasolina +19 %, sueldo +5 %).
- Los hogares echan un 39 % menos de litros que en 2007 (sin causa: no se dice por qué).

## Qué se puede decir
- Cuántas horas del sueldo neto mediano cuesta llenar un depósito de 50 litros al precio medio que pagan los hogares.
- Cuánto ha subido el gasóleo y la gasolina este año (IPC) frente al sueldo (ETCL).

## Qué no se puede decir
- Por qué ha subido (petróleo, guerras, impuestos, márgenes…): sin causas ni partidos.
- Precios de una gasolinera concreta o de una marca.
- «Récord»: el IPC de subclases de la base 2025 empieza en 2017 y la EPF da medias anuales; no se compara con picos de meses sueltos.
- Que hoy cuesta «más que en la crisis»: en plena crisis (2013) eran 24 minutos más.
