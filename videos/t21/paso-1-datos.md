# T21 · El alquiler: ¿cuesta hoy más horas que en plena crisis? · Paso 1: datos (24-11-2026)

Tema elegido por Bruno el 24-11-2026 (entre alquiler, calefacción y matrícula). Pregunta: ¿cuántas horas de trabajo se lleva el alquiler hoy frente a 2007, 2016 y 2019? ¿Y quién alquila hoy?
Datos: `scripts/calcular_t21.py` → `data/clean/t21_alquiler.json`. Crudos en `data/raw/t21/`.

**v2 (Bruno, 24-11-2026):** le gustó el paso de propietarios a inquilinos y pidió meter la crisis («estamos igual que en la crisis»), la comparación con 2016, la parte del sueldo que se lleva el alquiler y la edad a la que la gente se va de casa. Año de la crisis: **2013** (el peor del paro). Los años de 2008 a 2015 salen de los microdatos de la EPF, con el mismo método que 2007.

| Dato | Valor | Año | Fuente oficial | Consultado | Estado |
|---|---|---|---|---|---|
| Alquiler medio de los hogares que pagan alquiler (vivienda principal) | 4.775 €/año (**398 €/mes**) · 5.508 € (**459 €/mes**) · 6.408 € (**534 €/mes**) | 2016 · 2019 · 2025 | INE, Encuesta de Presupuestos Familiares, tabla 73827 (gasto medio de los hogares con gasto en ese código) | 24-11-2026 | V |
| Hogares que pagan alquiler | 17,3 % · 18,3 % · 20,6 % | 2016 · 2019 · 2025 | INE, EPF, tabla 73827 | 24-11-2026 | V |
| Alquiler medio de los hogares inquilinos | 4.428 €/año (**369 €/mes**); 14,0 % de hogares | 2007 | Microdatos oficiales de la EPF de 2007 (INE). La tabla publicada empieza en 2016. Con el mismo método, 2016 da 392 €/mes frente a 398 € de la tabla (−1,6 %). El gasto medio de todos los hogares (625,10 €) cuadra al céntimo con la tabla 10630 | 24-11-2026 | C |
| Alquiler medio de los hogares inquilinos, años de la crisis | 391 € (2008) · 398 € (2009) · 391 € (2010) · 397 € (2011) · 396 € (2012) · **399 € (2013)** · 387 € (2014) · 382 € (2015) al mes | 2008-2015 | Microdatos oficiales de la EPF (INE); el gasto medio de todos los hogares cuadra al céntimo con la tabla 10630 cada año | 24-11-2026 | C |
| Sueldo neto mediano por hora | 8,79 € · **9,90 € (2013)** · 10,27 € · 10,85 € · 12,98 € | 2007 · 2013 · 2016 · 2019 · 2025 | INE (Encuesta de Estructura Salarial y ETCL) con el neto de Eurostat, método de T1 | 24-11-2026 | C |
| Sueldo neto mediano al mes | 1.185 € · 1.332 € · 1.392 € · 1.702 € | 2007 · 2016 · 2019 · 2025 | INE, de T16 | 22-11-2026 | C |
| Hogares de 30 a 44 años con casa en propiedad | **74,3 %** · 67,9 % · 64,4 % · 59,4 % · **53,1 %** | 2007 · 2013 · 2016 · 2019 · 2025 | INE, Encuesta de Condiciones de Vida, tabla 9994 (edad de la persona de referencia) | 24-11-2026 | V |
| Hogares de 30 a 44 años en alquiler a precio de mercado | **15,8 %** · 21,3 % · 24,2 % · 28,8 % · **32,1 %** | 2007 · 2013 · 2016 · 2019 · 2025 | INE, ECV, tabla 9994 | 24-11-2026 | V |
| Hogares de 16 a 29 años con casa en propiedad / en alquiler de mercado | 58,1 / 28,4 % · 28,4 / 47,8 % · 25,5 / 48,2 % · 30,6 / 49,8 % | 2007 · 2016 · 2019 · 2025 | INE, ECV, tabla 9994 | 24-11-2026 | V |
| Edad media a la que los jóvenes se van de casa de sus padres | 28,4 · 28,9 · 29,4 · 29,5 · 30,2 años | 2007 · 2013 · 2016 · 2019 · 2025 | Eurostat, yth_demo_030 (corte de serie en 2021) | 24-11-2026 | V |
| Inquilinos a precio de mercado que gastan más del 40 % de la renta del hogar en vivienda | 35,9 % · 43,0 % · 37,4 % · 26,8 % | 2007 · 2016 · 2019 · 2025 | Eurostat, ilc_lvho07c | 24-11-2026 | V (contexto) |

## Cálculos (C)
| | 2007 | 2013 (crisis) | 2016 | 2019 | 2025 |
|---|---|---|---|---|---|
| Alquiler medio al mes | 369 € | 399 € | 398 € | 459 € | 534 € |
| **Horas de trabajo al mes** (alquiler / sueldo neto mediano por hora) | **42,0 h** | **40,3 h** | **38,7 h** | **42,3 h** | **41,1 h** |
| Parte del sueldo neto mediano | 31 % | 31 % | 30 % | 33 % | 31 % |

Horas al mes en toda la crisis: 41,4 (2008) · 40,7 · 39,8 · 40,0 · 40,2 · 40,3 (2013) · 38,5 · 36,8 (2015). Frente a 2016, hoy son 2,4 horas más al mes: **28,8 horas más al año**, casi cuatro jornadas de 8 horas.

## Veredicto
- **Como en plena crisis, o un poco peor:** en 2013 el alquiler medio costaba 40,3 horas de trabajo al mes; hoy, 41,1. En toda la crisis (2008-2013) fue de 40 a 41 horas.
- **Frente a 2016, empeora:** 38,7 → 41,1 horas al mes (casi cuatro jornadas más al año) y del 30 % al 31 % del sueldo neto mediano.
- **Frente a 2007 (42,0 h) y 2019 (42,3 h), algo menos.** Se dice en el vídeo (lo dice la hermana).
- **Para tener casa propia, empeora frente a todos los años:** hogares de 30 a 44 años con casa en propiedad, 74 % → 68 % → 64 % → 59 % → 53 %; de alquiler a precio de mercado, 16 % → 32 %. Los jóvenes se van de casa más tarde: 28,4 → 30,2 años.
- Lo de «estamos como en la crisis» lo dice un personaje con el dato de las horas, sin «por mucho que nos digan» (apuntaría al Gobierno: regla 3).

## Qué se puede decir
- Lo que paga de media un hogar inquilino en España, en horas del sueldo neto mediano.
- Que hoy alquilan muchos más hogares, sobre todo los de menos de 45 años.

## Qué no se puede decir
- Que es lo que cuesta alquilar un piso que se anuncia hoy: la EPF es la media de todos los inquilinos (contratos viejos y nuevos, de toda España, a precio de mercado o inferior). Se avisa en pantalla.
- Por qué hay más gente de alquiler (sin causas ni partidos). La pregunta final la deja abierta.
- La sobrecarga de Eurostat mide otra cosa (la renta de todo el hogar y todos los gastos de la vivienda): baja mucho desde 2022 y no se mezcla con las horas. Va solo en la descripción, si acaso.
