# T4 v4 · Paso 1: datos (pendiente de aprobar)

**Pide Bruno (16-11-2026):**
- Quitar las hipotecas de más del 80 %, porque repiten T3.
- Explicar en qué se gastaba el dinero antes y en qué se gasta ahora.
- Qué parte de los ingresos se va a la vivienda (alquiler o hipoteca) en los 80 y hoy.
- Contrastar su idea: «hace 40 años, con un sueldo medio se pagaba la letra aunque los intereses fueran altísimos, y la vivienda se llevaba menos».

Datos limpios en `data/clean/t4_netflix.json` (`scripts/calcular_t4.py`). Ficheros originales en `data/raw/`, con su huella en `MANIFEST.csv`.

## 1. En qué se gasta una familia (reparto del gasto total del hogar)

| Grupo | 1986 | 2016 | 2019 | 2025 | Estado |
|---|---|---|---|---|---|
| Comida y bebidas sin alcohol | **27,8 %** | 14,6 % | 14,2 % | **16,0 %** | V |
| Vivienda: alquiler (real o imputado), agua, luz, gas y calefacción | **18,8 %** | 31,0 % | 31,3 % | **33,2 %** | V |
| Uso del coche (gasolina, reparaciones…) | 6,5 % | 6,7 % | 7,0 % | 6,5 % | V |
| Ropa y calzado | 10,9 % | 5,2 % | 4,7 % | 4,0 % | V |
| Ocio, cultura, bares, restaurantes, hoteles y comunicaciones | **12,3 %** | 18,6 % | 18,3 % | **17,5 %** | C (suma de grupos) |

**Fuentes:**
- **1986:** Encuesta Continua de Presupuestos Familiares, en el Anuario Estadístico del INE de 1989 (cap. VIII, tabla 2.2.6). [PDF](https://www.ine.es/inebaseweb/pdfDispacher.do?td=135770&ext=.pdf)
- **2016-2025:** Encuesta de Presupuestos Familiares del INE, gasto total, tablas [73778](https://www.ine.es/jaxiT3/Tabla.htm?t=73778) y [73779](https://www.ine.es/jaxiT3/Tabla.htm?t=73779).

**Para que sea comparable:**
- Los dos años usan el gasto total, que incluye el «alquiler imputado»: lo que pagaría de alquiler quien vive en una casa propia.
- No he encontrado la nota de método de 1986 que lo diga. Pero las cifras solo cuadran si lo incluye. La vivienda de 1986 son 244.844 pesetas al año por hogar de media, unas 20.400 al mes. Si fuera solo alquiler pagado, cada inquilino pagaría casi un sueldo entero al mes.
- La clasificación de grupos cambió entre 1986 y hoy, así que las cifras son aproximadas. En 1986, «restaurantes, cafés y hoteles» iban juntos.

## 2. Cuánto se lleva la vivienda de los ingresos

| Dato | Antes | Hoy | Estado |
|---|---|---|---|
| Cuota del primer año de una hipoteca nueva (80 % del piso medio), sobre la renta bruta del hogar | **47 %** (1987) · 71 % (1990) · 46 % (2006) · 30 % (2016 y 2019) | **38 %** (junio de 2026) | V · [Banco de España](https://www.bde.es/webbe/es/estadisticas/temas/vivienda.html) |
| Precio del piso medio en años de renta bruta del hogar | **3,1 años** (1987) · 8,8 (2006) · 6,7 (2016) | **8,4 años** (junio de 2026) | V · Banco de España |
| Entrada (20 % del piso) en años de renta del hogar | 0,6 años (1987) | 1,7 años (2026) | C = 0,2 × precio/renta |
| Alquiler sobre los ingresos de quien vive **solo** de alquiler | 38 % (2007) · 42 % (2016) · 43 % (2019) | **39 %** (2025) · UE: 29 % | V · [Eurostat ilc_mded02](https://ec.europa.eu/eurostat/databrowser/view/ilc_mded02/default/table) |
| Lo mismo para **dos adultos** | 24 % (2007) · 31 % (2016 y 2019) | **27 %** (2025) | V · Eurostat |
| Inquilinos a precio de mercado que dedican más del 40 % de su renta a la vivienda | 36 % (2007) · 43 % (2016) | 27 % (2025) | V · [Eurostat ilc_lvho07c](https://ec.europa.eu/eurostat/databrowser/view/ilc_lvho07c/default/table) |
| Alquiler sobre el sueldo en los años 80 | — | — | **X: no hay serie oficial** |

**Pendiente:** confirmar en la ficha de Eurostat si el 39 % es la media o la mediana de los hogares que pagan alquiler.

## 3. Veredicto sobre la idea de Bruno

| Idea | ¿Se sostiene? |
|---|---|
| La vivienda se lleva hoy mucha más parte del presupuesto que en los 80 | **Sí.** Del 19 % del gasto en 1986 al 33 % en 2025. Igual con 2016 (31 %) y 2019 (31 %) |
| La cesta de la compra pesaba más | **Sí.** La comida pasa del 28 % al 16 % |
| La gasolina pesa más hoy | **No.** El uso del coche pesa lo mismo: 6,5 % |
| En los 80 la letra de la hipoteca se pagaba sin problema | **No.** La cuota de una hipoteca nueva se comía el 47 % de lo que ganaba un hogar en 1987 y el 71 % en 1990; hoy, el 38 %. Lo que sí era mucho más fácil era llegar a comprar: el piso costaba 3 años de ingresos del hogar y hoy más de 8, así que la entrada era casi tres veces menor |
| Solo no te puedes independizar | **Los datos van en esa línea.** Quien vive solo de alquiler dedica el 39 % de sus ingresos al alquiler (UE: 29 %); dos adultos, el 27 % |
| «El alquiler son 1.000 € y se gana 1.200 €» | **No se puede decir así.** No hay una cifra oficial nacional de ese alquiler (X). La versión oficial es la del 39 % |
| Los jóvenes gastan más en ocio | **Depende del año.** Frente a 1986, sí: del 12 % al 17,5 %. Frente a 2016 y 2019 (18 %), no. Si sale en el vídeo, se dice (regla 2) |

## 4. Propuesta de guion v4 (unos 65 s)

Salen las hipotecas de más del 80 % y, para no pasar del minuto, el sueldo más frecuente.

1. **Padre:** ¡Es que os lo fundís todo! Netflix, Glovo, el gimnasio, festivales… ¡Así no hay quien ahorre!
2. **Hijo:** Bueno… En ocio, bares y móvil se va hoy el 17 % del gasto. En 1986, el 12 %. Ahí te doy algo.
3. **Padre:** ¡Ajá! ¿Lo ves?
4. **Hijo:** Pero mira el resto. En 1986, la comida se llevaba el 28 % y la casa, el 19 %. Hoy, la comida, el 16 %… y la casa, el 33 %.
5. **Padre:** Pues alquila algo, que no es para tanto.
6. **Hijo:** ¿Solo? El alquiler se come el 39 % de lo que ganas. En pareja, el 27 %. O pareja… o piso compartido.
7. **Padre:** ¿Y por eso seguís en casa con treinta tacos?
8. **Hijo:** Con 30,2 de media. En Europa, a los 26.
9. **Padre:** ¿Y los nietos pa cuándo, eh?
10. **Hijo:** ¿Nietos? En 1986, el primer hijo llegaba a los 26. Hoy, a los treinta y uno y medio. ¿Casualidad?
11. **Padre:** Pues aquí estás muy bien, majo. Y comes caliente.
12. **Hijo:** ¿Quién tiene razón? ¿Tú qué opinas?
