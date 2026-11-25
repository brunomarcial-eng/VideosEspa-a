# T23 · ¿Cuántas horas trabajas para tener la casa caliente? · Paso 1: datos (24-11-2026)

Tema elegido por Bruno el 24-11-2026 («calefacción», entre calefacción, comprar un piso, matrícula y regalos de Reyes). Pregunta: ¿cuántas horas de trabajo cuesta al año la luz, el gas y el gasóleo de casa, hoy y antes? ¿Y cuánta gente no puede tener la casa caliente?
Datos: `scripts/calcular_t23.py` → `data/clean/t23_calefaccion.json`. Crudos en `data/raw/t23/`.

| Dato | Valor | Año | Fuente oficial | Consultado | Estado |
|---|---|---|---|---|---|
| Gasto medio por hogar en «Electricidad, gas y otros combustibles» (luz, gas natural y butano, gasóleo de calefacción, leña) | 814,67 € · 1.172,88 € | 2007 · 2013 | INE, Encuesta de Presupuestos Familiares (EPF) base 2006, tabla 10628 | 24-11-2026 | V |
| Lo mismo | 1.054,75 € · 1.177,96 € · **1.254,63 €** | 2016 · 2019 · 2025 | INE, EPF base 2016, tabla 73779 («gasto total») | 24-11-2026 | V |
| Desglose de 2025: luz · gas · gasóleo · leña y carbón | 868,92 € · 280,86 € · 86,23 € · 18,61 € | 2025 | INE, EPF, tabla 73780 (base 2006: tabla 10629) | 24-11-2026 | V |
| Sueldo neto mediano por hora | 8,79 € · 9,90 € · 10,27 € · 10,85 € · 12,98 € | 2007 · 2013 · 2016 · 2019 · 2025 | INE (EAES y ETCL) con el método de T1 (2013 como en T21; 2025 = EAES 2024 × ETCL) | 24-11-2026 | C |
| Personas que no pueden permitirse mantener la vivienda con una temperatura adecuada | 8,0 % · 8,0 % · 10,1 % · 7,6 % · **15,9 %**; récord: 20,7 % en 2023 | 2007 · 2013 · 2016 · 2019 · 2025 | INE, Encuesta de Condiciones de Vida (ECV), tabla 9967 | 24-11-2026 | V |
| Lo mismo, en el decil de renta del medio (quinto decil de renta por unidad de consumo) | 7,7 % · 8,6 % · 5,7 % · **17,2 %** | 2013 · 2016 · 2019 · 2025 | INE, ECV, tabla 9973 (empieza en 2008) | 24-11-2026 | V |
| Población residente (media de 2025) | 49,4 millones | 2025 | INE, Estadística Continua de Población (ECP320) | 14-11-2026 | V |

## Cálculos (C)
| | 2007 | 2013 (crisis) | 2016 | 2019 | Hoy (2025) |
|---|---|---|---|---|---|
| Luz, gas y gasóleo del hogar, al año | 815 € | 1.173 € | 1.055 € | 1.178 € | 1.255 € |
| Al mes | 68 € | 98 € | 88 € | 98 € | 105 € |
| **Horas de trabajo al año** (sueldo neto mediano) | **93 h** | **118 h** | **103 h** | **109 h** | **97 h** |
| Horas al mes | 7,7 | 9,9 | 8,6 | 9,0 | 8,1 (un día de trabajo) |
| **No pueden tener la casa caliente** | **8,0 %** | **8,0 %** | **10,1 %** | **7,6 %** | **15,9 %** |
| … en los hogares de renta media (quinto decil) | — | 7,7 % | 8,6 % | 5,7 % | 17,2 % |

Desde 2016: la factura +19 %, el sueldo neto mediano por hora +26 %. Desde 2007: la factura +54 %, el sueldo +48 %.
Personas que no pueden tener la casa caliente hoy: 15,9 % × 49,4 millones ≈ 7,8 millones (orientativo).

## Veredicto
- **La factura media, en horas: mejora frente a la crisis (118 → 97 h), 2016 (103) y 2019 (109); empeora un poco frente a 2007 (93).** El porqué: desde 2016 la factura sube un 19 % y el sueldo neto mediano un 26 %.
- **La gente que no puede tener la casa caliente: empeora frente a todos los años.** El doble que en 2007, en plena crisis y en 2019 (de un 8 % a casi un 16 %); récord en 2023 (20,7 %). En los hogares de renta media, el triple que en 2019 (5,7 % → 17,2 %).
- La conclusión cambia con la medida y se dice en el vídeo: la factura media cuesta menos horas, pero hay el doble de gente pasando frío en casa.

## Qué se puede decir
- Cuánto gasta de media un hogar en luz, gas y gasóleo y cuántas horas de sueldo neto mediano son.
- Cuánta gente dice que no puede permitirse tener la casa a una temperatura adecuada, y en qué parte de la renta.

## Qué no se puede decir
- Por qué hay más gente pasando frío (precios de 2022, alquileres, sueldos de los que menos ganan…): sin causas ni partidos.
- Que la luz o el gas «están más caros que nunca»: en horas de trabajo, la factura media cuesta menos que en la crisis, 2016 y 2019.
- La factura de un mes de invierno: la EPF da el gasto del año; «un día de trabajo al mes» es la media del año.
- Cambio de base de la EPF en 2016: 2015 da 1.110,40 € (base 2006) y 2016, 1.054,75 € (base 2016). Las comparaciones de 2007 y 2013 con hoy cruzan el cambio; se dice en la descripción.
