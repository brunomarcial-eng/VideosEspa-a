# Paso 1 — Tabla de datos del test (T1 y T2)

Consultado el 2026-11-09 en las APIs del INE y de Eurostat. Ficheros crudos en `data/raw/` (enlace, fecha y huella SHA-256 en `data/raw/MANIFEST.csv`). Datos limpios en `data/clean/t1_cesta_horas.json` y `data/clean/t2_empleo.json`. Se reproduce todo con:

```
python3 scripts/descargar_datos.py && python3 scripts/calcular_t1_t2.py
```

Estados: **V** leído en la fuente oficial · **C** cálculo propio con fórmula · P solo prensa · X sin serie oficial. Ninguna cifra de esta tabla está en P ni en X. 2020 no se usa.

---

## T1 — ¿Cuántas horas de trabajo cuesta la compra de comida de un mes?

### Definición
- **Cesta:** lo que gasta de media una persona en un mes en *alimentos y bebidas no alcohólicas*: 2.254,62 € al año en 2025 (EPF) ÷ 12 = **187,88 €/mes**. Es **la misma cesta** en todos los años: su precio se lleva a cada año con el IPC de alimentos y bebidas no alcohólicas (cambia el precio, no lo que se compra).
- **Salario por hora:** salario **medio** por hora (EAES, V). La **mediana** por hora no se publica cada año: se estima como *media por hora × (mediana anual ÷ media anual)* (C).
- **Neto:** neto/bruto de un **soltero sin hijos** con la ganancia anual mediana. Sale de Eurostat `earn_nt_net` (modelo de impuestos y cotizaciones de la OCDE para cada año), interpolando entre los casos del 67 % y el 80 % del salario medio (C).
- **Horas** = cesta del año ÷ salario neto por hora mediano (C).

### Resultado (principal: neto, mediana)

| Dato | 2007* | 2016 | 2018 | 2019 | 2024 (último salario oficial) | 2025* |
|---|---|---|---|---|---|---|
| Cesta de un mes (€ de cada año) | 114,98 | 131,08 | 134,88 | 136,27 | 183,41 | 187,88 |
| Salario neto por hora, mediana (€) | 8,79 | 10,27 | 10,66 | 10,85 | 12,63 | 12,98 |
| **Horas de trabajo (neto, mediana)** | **13,1 h** | **12,8 h** | **12,6 h** | **12,6 h** | **14,5 h** | **14,5 h** |
| Horas (neto, media), contraste | 11,2 h | 11,0 h | 10,8 h | 10,8 h | 12,4 h | 12,3 h |
| Horas (bruto, mediana), contraste | 10,7 h | 10,5 h | 10,4 h | 10,3 h | 11,8 h | 11,7 h |
| Estado | C (estimado) | C | C | C | C | C (estimado) |

\* 2007 y 2025 son estimaciones con un paso más (ver abajo). Todas las demás entradas del cálculo son V.

### Entradas del cálculo

| Dato | Valor | Año | Fuente oficial (enlace) | Consultado | Estado |
|---|---|---|---|---|---|
| Gasto medio por persona en alimentos y bebidas no alcohólicas | 2.254,62 €/año | 2025 | INE, EPF, tabla 73778 (serie EPF534996) · [ine.es/jaxiT3/Tabla.htm?t=73778](https://www.ine.es/jaxiT3/Tabla.htm?t=73778) | 2026-11-09 | V |
| IPC alimentos y bebidas no alcohólicas, media anual (base 2025) | 61,198 · 69,767 · 71,788 · 72,531 · 97,616 · 100,000 | 2007 · 2016 · 2018 · 2019 · 2024 · 2025 | INE, IPC, tabla 76125 (IPC290755) · [ine.es/jaxiT3/Tabla.htm?t=76125](https://www.ine.es/jaxiT3/Tabla.htm?t=76125) | 2026-11-09 | V |
| IPC alimentos, último mes | +2,7 % interanual | sep-2026 | INE, IPC, tabla 76125 | 2026-11-09 | V |
| Salario medio por hora (bruto) | 14,88 · 15,54 · 15,85 · 18,77 € | 2016 · 2018 · 2019 · 2024 | INE, EAES, tabla 30046 (EAES2013) · [ine.es/jaxiT3/Tabla.htm?t=30046](https://www.ine.es/jaxiT3/Tabla.htm?t=30046) | 2026-11-09 | V |
| Ganancia anual mediana / media (bruto) | 24.497,17 / 29.540,26 € | 2024 | INE, EAES, tabla 28191 (EAES738 / EAES741) · [ine.es/jaxiT3/Tabla.htm?t=28191](https://www.ine.es/jaxiT3/Tabla.htm?t=28191) | 2026-11-09 | V |
| Ganancia neta, soltero sin hijos (67 %, 80 % y 100 % del salario medio) | p. ej. 2024: 22.817,52 € brutos → 18.727,17 € netos | 2007-2025 | Eurostat, `earn_nt_net` · [databrowser](https://ec.europa.eu/eurostat/databrowser/view/earn_nt_net/default/table) | 2026-11-09 | V |
| Coste salarial total por hora efectiva (solo para 2007 y 2025) | 12,713 (2007) · 13,330 (2008) · 18,020 (2024) · 18,608 (2025) € | 2007-2025 | INE, ETCL, tablas 6078 y 6040 · [t=6078](https://www.ine.es/jaxiT3/Tabla.htm?t=6078) · [t=6040](https://www.ine.es/jaxiT3/Tabla.htm?t=6040) | 2026-11-09 | V |

### (a) Qué se puede decir
- Con el salario neto mediano, la compra de comida de un mes costaba **12,8 horas en 2016**, **12,6 en 2018 y 2019** y **14,5 en 2024**. Son unas **1 h 40 min-1 h 55 min más al mes** (+13-15 %).
- El motivo aritmético: entre 2016 y 2024 la misma cesta subió un **39,9 %** y el salario neto por hora mediano un **23,0 %**.
- La conclusión es la misma con la media, con el bruto y con cualquier año base: **empeora**.
- El salto se produce entre 2019 y 2024; entre 2016 y 2019 las horas bajaron un poco (12,8 → 12,6).

### (b) Qué no se puede decir
- No se puede decir **por qué** subió la comida más que los sueldos (guerra, energía, márgenes, impuestos…): no hay evidencia en estos datos.
- No es «tu» cesta: es el gasto medio por persona. Un hogar concreto puede gastar más o menos.
- No es el salario por hora mediano publicado: es una estimación (C), porque el INE publica cada año la media por hora y la mediana anual, pero no la mediana por hora.
- No vale para 2026 entero: el último salario oficial es de 2024. El IPC de alimentos de septiembre de 2026 sube un 2,7 % interanual. La extensión a 2025 (C) da las mismas 14,5 h.

### (c) Qué cambia con otro año base
- **2016, 2018 o 2019:** empeora en los tres: +1,7 h, +1,9 h y +1,9 h.
- **2007:** también empeora (13,1 → 14,5 h, +1,4 h), pero el dato de 2007 es una estimación con un paso más. La encuesta anual de salarios (EAES) empieza en 2008. Para llegar a 2007 se usa la evolución del coste salarial por hora (ETCL), que cambia de clasificación de actividades justo en 2008 (corte de serie). **Recomiendo no usar 2007 en el Short de T1** y dejarlo para el vídeo largo, con la advertencia.
- **Gasto real en lugar de cesta fija:** si se divide lo que **de verdad** se gastó cada año (EPF de cada año) entre el salario, el aumento es menor: **13,4 h en 2016 → 14,2 h en 2024**. El gasto por persona subió un 30 % y los precios un 40 %; es decir, en volumen se compró algo menos. Las dos medidas dicen «empeora».
- **Neto por comunidad autónoma:** comprobado a mano para un sueldo del 67 % del medio, el modelo OCDE coincide al euro con la escala general (autonómica igual a la estatal) en 2016, pero en 2024 da un neto ~1 % mayor que la escala general. Con la escala general la cesta de 2024 costaría ~14,7 h en lugar de 14,5 h. La conclusión no cambia.

### (d) Qué falta y dónde bajarlo
- Salario por hora **mediano** oficial: solo existe en la encuesta cuatrienal (2018 y 2022, y no por hora en la API). Si se quiere V puro, el vídeo usa la **media** por hora (V en sus entradas) y se dice «salario medio».
- EAES 2025: el INE la publicará hacia junio de 2027.

---

## T2 — ¿Hay más gente trabajando ahora que antes de la crisis?

### Comparación principal: mismo trimestre (T3) de cada año, para quitar la estacionalidad

| Dato | 2007 T3 | 2016 T3 | 2018 T3 | 2019 T3 | **2026 T3 (hoy)** | Fuente | Estado |
|---|---|---|---|---|---|---|---|
| Ocupados | 20.753.400 | 18.527.500 | 19.528.000 | 19.874.300 | **22.852.600** | INE, EPA, tabla 65109 (EPA387796) | V |
| Parados | 1.806.200 | 4.320.800 | 3.326.000 | 3.214.400 | **2.591.200** | INE, EPA, tabla 65218 (EPA387800) | V |
| Tasa de paro (16+) | 8,01 % | 18,91 % | 14,55 % | 13,92 % | **10,18 %** | INE, EPA, tabla 65219 (EPA423474) | V |
| Tasa de empleo 16-64 años | 67,18 % | 61,12 % | 64,01 % | 64,54 % | **69,10 %** | INE, EPA, tabla 65306 (EPA441257) | V |
| Tasa de empleo 16 y más | 54,73 % | 48,07 % | 50,18 % | 50,54 % | **53,45 %** | INE, EPA, tabla 65306 (EPA441060) | V |
| Población de 16 y más (ocupados ÷ tasa) | 37,92 M | 38,54 M | 38,92 M | 39,32 M | **42,76 M** | Cálculo con las dos filas anteriores | C |

Enlaces: [t=65109](https://www.ine.es/jaxiT3/Tabla.htm?t=65109) · [t=65218](https://www.ine.es/jaxiT3/Tabla.htm?t=65218) · [t=65219](https://www.ine.es/jaxiT3/Tabla.htm?t=65219) · [t=65306](https://www.ine.es/jaxiT3/Tabla.htm?t=65306). Consultado el 2026-11-09.

### Contraste: medias anuales (2025 es el último año completo)

| Dato | 2007 | 2016 | 2018 | 2019 | 2025 | Estado |
|---|---|---|---|---|---|---|
| Ocupados | 20,58 M | 18,34 M | 19,33 M | 19,78 M | 22,22 M | V (media de 4 trimestres) |
| Parados | 1,85 M | 4,48 M | 3,48 M | 3,25 M | 2,61 M | V |
| Tasa de paro | 8,23 % | 19,63 % | 15,25 % | 14,11 % | 10,51 % | V |
| Tasa de empleo 16-64 | 66,78 % | 60,48 % | 63,40 % | 64,33 % | 68,13 % | V |
| Tasa de empleo 16+ | 54,39 % | 47,60 % | 49,70 % | 50,37 % | 52,77 % | V |

Contraste europeo (Eurostat, `lfsi_emp_a` y `une_rt_a`, V; la serie UE-27 empieza en 2009): tasa de empleo 20-64 de España 63,9 % (2016) → 72,4 % (2025); UE-27 69,6 % → 76,1 %. Tasa de paro de España 19,6 % → 10,5 %; UE-27 9,3 % → 6,0 %.

### (a) Qué se puede decir
- Hay **más ocupados que nunca**: 22,85 millones en el T3 de 2026. Son 2,1 millones más que en 2007 y 4,3 millones más que en 2016.
- Frente a 2016, 2018 y 2019 **mejora todo**: más ocupados, menos parados, menos paro y más tasa de empleo.
- Frente a 2007, **depende de la medida**:
  - **Mejora:** ocupados (+2,1 M) y tasa de empleo de 16 a 64 años (67,2 % → 69,1 %).
  - **Empeora:** parados (+785.000) y tasa de paro (8,0 % → 10,2 %).
  - **Empeora un poco:** tasa de empleo de 16 y más (54,7 % → 53,5 %). Esta tasa incluye a los mayores de 65, que hoy son más.
- También ha crecido la población: +4,8 millones de personas de 16 y más desde 2007 (C). Por eso los ocupados suben más que la tasa.

### (b) Qué no se puede decir
- No se puede atribuir la mejora a un Gobierno, a una reforma laboral ni a la inmigración: estos datos no lo demuestran.
- No se puede decir «el paro está como antes de la crisis»: está 2,2 puntos por encima de 2007.
- Ocupados no son contratos ni afiliados (eso es la Seguridad Social): no mezclar.
- No mezclar el trimestre (2026 T3) con medias anuales en el mismo gráfico.

### (c) Qué cambia con otro año base
- **2016, 2018 o 2019:** mejora en todas las medidas.
- **2007:** «depende». Mejora en ocupados y en tasa de empleo de 16-64; empeora en paro. Con la tasa de empleo de 16 y más, ligeramente peor.
- **Medias anuales (2025)** en lugar del T3: misma conclusión en todas las medidas.

### (d) Qué falta
Nada para el Short. Para el vídeo largo: horas trabajadas, parcialidad y temporalidad (EPA) y afiliación (Seguridad Social).

---

## Contraste con `research/` (cifras que estaban en P)

| Cifra en `research/` | Estaba | Ahora | Valor oficial |
|---|---|---|---|
| Ocupados 22,85 M y paro 10,18 % (EPA T3 2026) | V | V | 22.852.600 · 10,18 % |
| Tasa de paro 2018 «≈ 15 %» | pendiente | V | 15,25 % (media anual) · 14,55 % (T3) |
| Salario medio 29.540 € y mediano 24.497 € (EAES 2024) | V | V | 29.540,26 € · 24.497,17 € |
| Alimentos +41 % desde julio de 2018 (Juan de Mariana) | P | V (INE) | +42,2 % de jul-2018 a sep-2026 |
| IPC general 2018-2025 ≈ +23,2 % | P | V (INE) | +23,2 % dic-2018 → dic-2025 · +22,5 % en media anual |
| Salario por hora | P | V / C | Media por hora V (EAES); mediana por hora C |

## Decisiones que necesito
1. **Cesta de T1:** la compra de comida y bebida sin alcohol de una persona durante un mes (187,88 € en 2025), misma cesta a precios de cada año. ¿Vale?
2. **Años de T1:** 2016, 2018-19 y 2024. 2007 queda fuera del Short por ser una estimación con corte de serie.
3. **Medida principal de T1:** neto y mediana (C). La alternativa es la media por hora, con todas las entradas en V, que da 11,0 → 12,4 h.
4. **T2:** comparación T3 contra T3 y cierre «depende» frente a 2007, «mejora» frente a 2016-19. Tasa de empleo principal: 16-64 años.
