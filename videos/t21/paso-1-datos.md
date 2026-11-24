# T21 · El alquiler: ¿te cuesta más horas que a tus padres? · Paso 1: datos (24-11-2026)

Tema elegido por Bruno el 24-11-2026 (entre alquiler, calefacción y matrícula). Pregunta: ¿cuántas horas de trabajo se lleva el alquiler hoy frente a 2007, 2016 y 2019? ¿Y quién alquila hoy?
Datos: `scripts/calcular_t21.py` → `data/clean/t21_alquiler.json`. Crudos en `data/raw/t21/`.

| Dato | Valor | Año | Fuente oficial | Consultado | Estado |
|---|---|---|---|---|---|
| Alquiler medio de los hogares que pagan alquiler (vivienda principal) | 4.775 €/año (**398 €/mes**) · 5.508 € (**459 €/mes**) · 6.408 € (**534 €/mes**) | 2016 · 2019 · 2025 | INE, Encuesta de Presupuestos Familiares, tabla 73827 (gasto medio de los hogares con gasto en ese código) | 24-11-2026 | V |
| Hogares que pagan alquiler | 17,3 % · 18,3 % · 20,6 % | 2016 · 2019 · 2025 | INE, EPF, tabla 73827 | 24-11-2026 | V |
| Alquiler medio de los hogares inquilinos | 4.428 €/año (**369 €/mes**); 14,0 % de hogares | 2007 | Microdatos oficiales de la EPF de 2007 (INE). La tabla publicada empieza en 2016. Con el mismo método, 2016 da 392 €/mes frente a 398 € de la tabla (−1,6 %). El gasto medio de todos los hogares (625,10 €) cuadra al céntimo con la tabla 10630 | 24-11-2026 | C |
| Sueldo neto mediano por hora | 8,79 € · 10,27 € · 10,85 € · 12,98 € | 2007 · 2016 · 2019 · 2025 | INE (Encuesta de Estructura Salarial y ETCL), de T1 | 12-11-2026 | C (2007 y 2025), V |
| Sueldo neto mediano al mes | 1.185 € · 1.332 € · 1.392 € · 1.702 € | 2007 · 2016 · 2019 · 2025 | INE, de T16 | 22-11-2026 | C |
| Hogares de 30 a 44 años con casa en propiedad | **74,3 %** · 64,4 % · 59,4 % · **53,1 %** | 2007 · 2016 · 2019 · 2025 | INE, Encuesta de Condiciones de Vida, tabla 9994 (edad de la persona de referencia) | 24-11-2026 | V |
| Hogares de 30 a 44 años en alquiler a precio de mercado | **15,8 %** · 24,2 % · 28,8 % · **32,1 %** | 2007 · 2016 · 2019 · 2025 | INE, ECV, tabla 9994 | 24-11-2026 | V |
| Hogares de 16 a 29 años con casa en propiedad / en alquiler de mercado | 58,1 / 28,4 % · 28,4 / 47,8 % · 25,5 / 48,2 % · 30,6 / 49,8 % | 2007 · 2016 · 2019 · 2025 | INE, ECV, tabla 9994 | 24-11-2026 | V |
| Edad media a la que los jóvenes se van de casa de sus padres | 28,4 · 29,4 · 29,5 · 30,2 años | 2007 · 2016 · 2019 · 2025 | Eurostat, yth_demo_030 (corte de serie en 2021) | 24-11-2026 | V |
| Inquilinos a precio de mercado que gastan más del 40 % de la renta del hogar en vivienda | 35,9 % · 43,0 % · 37,4 % · 26,8 % | 2007 · 2016 · 2019 · 2025 | Eurostat, ilc_lvho07c | 24-11-2026 | V (contexto) |

## Cálculos (C)
| | 2007 | 2016 | 2019 | 2025 |
|---|---|---|---|---|
| Alquiler medio al mes | 369 € | 398 € | 459 € | 534 € |
| **Horas de trabajo al mes** (alquiler / sueldo neto mediano por hora) | **42,0 h** | **38,7 h** | **42,3 h** | **41,1 h** |
| Parte del sueldo neto mediano | 31 % | 30 % | 33 % | 31 % |

## Veredicto
- **Para el que alquila, casi igual que en 2007:** unas 41 horas de trabajo al mes, una semana entera, como en 2007 (42 h) y en 2019 (42 h). **Frente a 2016, empeora** (39 h → 41 h).
- **Para la gente de 30 a 44 años, empeora:** en 2007 tres de cada cuatro hogares tenían la casa en propiedad (74 %); hoy, uno de cada dos (53 %). Los que alquilan a precio de mercado se han duplicado (16 % → 32 %). Y los jóvenes se van de casa más tarde (28,4 → 30,2 años).
- La conclusión no cambia con el año base para la propiedad (baja en todos). En horas, sí: igual frente a 2007 y 2019, peor frente a 2016. Se dice en el vídeo.

## Qué se puede decir
- Lo que paga de media un hogar inquilino en España, en horas del sueldo neto mediano.
- Que hoy alquilan muchos más hogares, sobre todo los de menos de 45 años.

## Qué no se puede decir
- Que es lo que cuesta alquilar un piso que se anuncia hoy: la EPF es la media de todos los inquilinos (contratos viejos y nuevos, de toda España, a precio de mercado o inferior). Se avisa en pantalla.
- Por qué hay más gente de alquiler (sin causas ni partidos). La pregunta final la deja abierta.
- La sobrecarga de Eurostat mide otra cosa (la renta de todo el hogar y todos los gastos de la vivienda): baja mucho desde 2022 y no se mezcla con las horas. Va solo en la descripción, si acaso.
