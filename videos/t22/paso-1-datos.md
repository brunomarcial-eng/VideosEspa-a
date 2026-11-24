# T22 · ¿Quién cobra más: un jubilado o un joven que trabaja? · Paso 1: datos (24-11-2026)

Tema elegido por Bruno el 24-11-2026 (entre pensión frente a sueldo joven, calefacción y matrícula). Pregunta: ¿cuánto es la pensión media de jubilación frente al sueldo de un joven de 25 a 34 años, hoy y antes? ¿Y cuánto ha subido cada uno?
Datos: `scripts/calcular_t22.py` → `data/clean/t22_pension_joven.json`. Crudos en `data/raw/t22/`.

| Dato | Valor | Año | Fuente oficial | Consultado | Estado |
|---|---|---|---|---|---|
| Pensión media de jubilación, todo el sistema (€/mes, 14 pagas, bruto) | 760,00 € · 979,52 € · 1.042,7 € · 1.090,7 € | 2007 · 2013 · 2016 · 2018 (medias anuales) | INE, Anuario Estadístico de España, tabla 7.3.5 (ediciones 2009, 2015 y 2020; datos del Ministerio de Trabajo y Seguridad Social) | 24-11-2026 | V |
| Pensión media de jubilación, todo el sistema | **1.450,92 €** (a 31-12-2024) · 1.513,87 € (a 31-12-2025) · 1.577,61 € (1-10-2026) | 2024-2026 | Seguridad Social, pensiones contributivas en vigor (serie del fichero de octubre de 2026) | 24-11-2026 | V |
| Salario medio bruto anual de 25 a 34 años | 17.973 € · 17.978 € · 19.350 € · **25.103 €** | 2013 · 2016 · 2018 · 2024 | INE, Encuesta Anual de Estructura Salarial, tabla 28201 (2024 es el último año publicado) | 24-11-2026 | V |
| Salario medio bruto anual de 25 a 34 años | 18.317 € (EAES 2008, 19.206 €, × ETCL 2007/2008) | 2007 | La EAES empieza en 2008; mismo método que T1 | 24-11-2026 | C |
| Salario medio bruto anual de los menores de 25 años (incluye jornada parcial) | 10.506 € · 11.046 € · 12.418 € · **15.136 €**; 2007: 12.354 € (C, mismo ajuste del ETCL) | 2013 · 2016 · 2018 · 2024 | INE, EAES, tabla 28201 (Bruno, 24-11-2026: «el segmento de 18 a 25»; la EAES agrupa a los menores de 25) | 24-11-2026 | V (2007, C) |
| IPC general, media anual | 70,105 · 79,401 · 78,725 · 81,609 · 97,396 | 2007 · 2013 · 2016 · 2018 · 2024 | INE, tabla 24077 | 14-11-2026 | V |

## Cálculos (C)
| | 2007 | 2013 (crisis) | 2016 | 2018 | Hoy (2024) |
|---|---|---|---|---|---|
| Pensión media al año (× 14) | 10.640 € | 13.713 € | 14.598 € | 15.270 € | 20.313 € |
| Sueldo medio de 25 a 34 años | 18.317 € | 17.973 € | 17.978 € | 19.350 € | 25.103 € |
| **Pensión en % del sueldo de un joven** | **58 %** | **76 %** | **81 %** | **79 %** | **81 %** |
| **Pensión en % del sueldo de un menor de 25** | **86 %** (el joven cobraba un 16 % más) | **131 %** | **132 %** | **123 %** | **134 %** (la pensión, un 34 % más) |

Desde 2007: pensión media +91 %, sueldo de un joven +37 %, precios +39 %. En euros de 2024: pensión 1.056 → 1.451 € al mes (+37 %); sueldo de un joven 25.448 → 25.103 € al año (−1 %).

## Veredicto
- **Los menores de 25 (v2, Bruno):** en 2007 cobraban un 16 % más que la pensión media; desde la crisis, menos: hoy la pensión es un 34 % más (20.313 € frente a 15.136 €).
- **Para el joven, frente al jubilado, empeora frente a 2007 y frente a la crisis:** la pensión media pasa del 58 % (2007) y el 76 % (2013) al 81 % del sueldo de un joven.
- **Frente a 2016, igual (81 %), y algo más que en 2018 (79 %).** Lo dice el abuelo en el vídeo.
- **En poder de compra, desde 2007:** la pensión media gana un 37 % y el sueldo de un joven se queda igual (−1 %).

## Qué se puede decir
- Lo que cobra de media un jubilado frente a un joven de 25 a 34 años, en bruto, y cuánto ha subido cada uno.

## Qué no se puede decir
- Por qué ha pasado (revalorizaciones, crisis, mercado laboral…): sin causas ni partidos.
- Que «los jubilados cobran más que los jóvenes»: en bruto, el joven medio de 25 a 34 años sigue cobrando un 24 % más.
- Comparaciones en neto: el pensionista no paga cotizaciones y el joven sí, y el IRPF depende de cada caso. El vídeo dice «en bruto».
- La pensión de los que se jubilan ahora (altas nuevas): es otra cifra, más alta, y no entra.
- La pensión de 2024 es la de diciembre (la de los otros años, la media del año): la media de 2024 sería un 0,7 % menor. Se dice en la descripción.
