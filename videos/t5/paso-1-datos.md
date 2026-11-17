# T5 · Paso 1: datos y propuesta (versión 2, pendiente de aprobar)

**Lo que pide Bruno (17-11-2026):**
- Quitar «49 mayores por cada 100 niños», porque no se entiende.
- Dar contexto al **porqué**: independizarse tarde, pareja y boda tarde, casa más cara, precariedad, la incorporación de la mujer al trabajo, guarderías, permisos y bodas caras.
- Que los datos encajen como una cadena. Si no cabe en 1:20, sacar dos vídeos.

Datos limpios en `data/clean/t5_natalidad.json` (`scripts/calcular_t5.py`). Ficheros originales en `data/raw/`, con su huella en `MANIFEST.csv`.

## 1. La cadena: todo llega más tarde

| Dato | 1986-87 | 2007 | 2016 | 2019 | Hoy | Fuente | Estado |
|---|---|---|---|---|---|---|---|
| Piso medio en años de ingresos brutos de un hogar | **3,1** (1987) | 8,8 (2006) | 6,7 | 6,9 | **8,4** (2026) | Banco de España | V |
| Edad media al irse de casa | — | 28,7 (2006) | — | — | **30,2** (UE: 26,3) | Eurostat | V |
| Edad media al primer matrimonio | **26,0** | 31,0 | 34,0 | 34,9 | **36,2** (2024) | INE 1380 | V |
| Edad media de la madre al primer hijo | **25,9** | 29,5 | 30,8 | 31,1 | **31,5** (2024) | INE 1579 | V |
| Hijos por mujer | **1,55** | 1,38 | 1,33 | 1,23 | **1,10** (2024) | INE 1407 | V |
| Mujeres que querrían tener al menos dos hijos | — | — | — | casi 3 de cada 4 (2018) | — | INE, Encuesta de Fecundidad 2018 | V |
| Por qué tienen menos hijos de los que querían (lo que **dicen ellas**) | — | — | — | Por debajo de 35: todavía esperan tenerlos. Desde los 35: razones laborales o de conciliación y económicas (2018) | — | INE, Encuesta de Fecundidad 2018 | V |

## 2. Las hipótesis de Bruno, contrastadas

| Hipótesis | ¿Se sostiene? |
|---|---|
| Hoy trabajan muchas más mujeres que en 1986 | **Sí.** En 1986 trabajaban **26 de cada 100** mujeres de 16 a 64 años (cálculo con la EPA del Anuario del INE de 1988). Hoy, **63** (Eurostat, 2025). Hombres: 63 → 71 |
| Como trabajan más mujeres, nacen menos niños | **Los datos no lo apoyan.**<br>· Entre 1995 y 2008, el empleo de las mujeres de 25 a 54 años subió del 40 % al 67 %, y a la vez los hijos por mujer **subieron** de 1,16 a 1,45.<br>· En la UE, donde más mujeres trabajan hay **algo más** de hijos, no menos (correlación de +0,15 en 2023 y +0,38 en 2019). Por ejemplo, Francia: 79 % de empleo y 1,66 hijos por mujer; España: 73 % y 1,12; Italia: 64 % y 1,21.<br>· Se puede enseñar como pregunta, no como causa |
| Permisos: antes no había y ahora sí | **Sí.** En 1986, el padre tenía **2 días** y la madre hasta **14 semanas** (Estatuto de los Trabajadores de 1980, BOE). Hoy, **19 semanas cada uno** (Real Decreto-ley 9/2025, BOE) |
| Hay más precariedad que en los 80 | **Frente a 1986, no en paro.** El paro de 20 a 24 años era del **44 %** en 1986 y es del **22 %** hoy. Frente a 2007 (15 %), sí es peor. Mejor no usarlo como argumento |
| Comprar casa es más difícil | **Sí.** De 3,1 a 8,4 años de ingresos del hogar |
| Las bodas cuestan 50.000 € y 200 € por invitado | **No hay dato oficial (X).** Puede salir como chiste del padre, sin cifra |
| Guarderías caras | **No hay serie oficial de 1986 (X).** Se queda fuera |
| Embarazo «geriátrico» | **Fuera,** como pidió Bruno: la media (31,5) no llega a los 35 |

**Regla 3:** el vídeo pone los datos en cadena y cita lo que **dicen las mujeres** en la encuesta del INE. No afirma «la culpa es de…»: deja la pregunta al espectador.

## 3. Propuesta: dos vídeos de un minuto
En 1:20 no caben la cadena y el debate sobre el trabajo de las mujeres sin ir con prisas. Además, el segundo tema es el más delicado y merece su propio vídeo, con los datos de Europa.

### T5 · «¿Y los nietos pa cuándo?» (la cadena, unos 65 s)
Decorados que cambian como en un sueño: cocina → calle (bloque) → cuarto de siempre → boda → sala de cunas → cocina.
1. **Padre:** ¿Y los nietos pa cuándo, eh? ¡Que tu madre y yo, a tu edad, ya te teníamos en brazos!
2. **Hijo:** Papá, primero hace falta casa. En 1987, un piso costaba 3 años de lo que ganaba un hogar. Hoy, más de 8.
3. **Padre:** ¡Pues casaos y a vivir!
4. **Hijo:** Vosotros os casabais a los 26. Ahora, a los 36.
5. **Padre:** ¡Si es que ahora las bodas son un festival!
6. **Hijo:** El primer hijo llegaba a los 26. Hoy, a los treinta y uno y medio. Y de 1,55 hijos por mujer hemos pasado a 1,1.
7. **Padre:** ¡Porque no queréis!
8. **Hijo:** Tres de cada cuatro mujeres querrían al menos dos. Y las que tienen menos de los que querían, a partir de los 35, dicen que es por el trabajo y el dinero.
9. **Hijo, a cámara:** Casa, boda, hijos… todo diez años más tarde. ¿Casualidad? ¿Tú qué opinas?

### T6 · «¿Es porque ahora trabajan ellas?» (unos 60 s)
1. **Padre:** ¡Es que antes tu madre se quedaba en casa con los niños!
2. **Hijo:** En 1986 trabajaban 26 de cada 100 mujeres. Hoy, 63.
3. **Padre:** ¡Pues ahí lo tienes!
4. **Hijo:** No tan rápido. Entre 1995 y 2008 trabajaban cada vez más mujeres… y nacían más niños: de 1,16 a 1,45 hijos por mujer.
5. **Hijo:** Y en Francia trabajan más mujeres que aquí y tienen más hijos: 1,66 frente a 1,12.
6. **Padre:** ¿Entonces qué ha cambiado?
7. **Hijo:** En 1986, el padre tenía 2 días de permiso y la madre, 14 semanas. Hoy, 19 semanas cada uno.
8. **Hijo, a cámara:** ¿Qué hace falta para tener hijos: tiempo, dinero o casa? ¿Tú qué opinas?
