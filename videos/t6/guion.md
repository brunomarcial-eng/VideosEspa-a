# Guion T6 — ¿Nacen menos niños porque ahora trabajan ellas?

Pregunta: Padre (62) contra hijo (31), cuarta parte: ¿nacen menos niños porque ahora trabajan las mujeres?  
Datos: `data/clean/t5_natalidad.json` · Datos y guion aprobados por Bruno el 17-11-2026 (videos/t5/paso-1-datos.md v2), sin el ejemplo de Francia  
Duración estimada de la voz: **49 s** (a 3.05 palabras/s) · Años en pantalla: 1986, 1995, 2007, 2008, 2016, 2024  
Un solo guion para los tres estilos (A pizarra, B cápsula, C baraja). La columna «Imagen» es la idea del plano; cada estilo la dibuja a su manera en el Paso 3.

| # | Tiempo | Quién | Voz | En pantalla | Sello de fuente | Imagen |
|---|---|---|---|---|---|---|
| 1 | 0-4 s | padre (62 años) | ¡Es que antes tu madre se quedaba en casa con los niños! | ¿Es porque ahora trabajan ellas? | — | La cocina. El padre señala; aparece un retrato antiguo, en sepia, de una madre en casa con un bebé. |
| 2 | 4-10 s | hijo (31 años) | En 1986 trabajaban 26 de cada 100 mujeres. Hoy, 63. | Mujeres de 16 a 64 años con trabajo, de cada 100 · 1986: 26 · hoy: 63 <br>_Hombres: 63 en 1986 y 71 hoy. En 2007: 55. En 2016: 54_ | INE (EPA de 1986, Anuario de 1988) y Eurostat (hoy) · cálculo propio para 1986 | Como en un sueño, la cocina se deshace y están en una oficina. Una rejilla de 100 mujeres: se colorean 26 y luego 63. |
| 3 | 10-11 s | padre (62 años) | ¡Pues ahí lo tienes! | «¡Pues ahí lo tienes!» | — | En la oficina. El padre señala la rejilla, triunfal. |
| 4 | 12-23 s | hijo (31 años) | No tan rápido. Entre 1995 y 2008 trabajaban cada vez más mujeres… y nacían más niños: de 1,16 a 1,45 hijos por mujer. | De 1995 a 2008 · Hijos por mujer: de 1,16 a 1,45 <br>_Mujeres de 25 a 54 años con trabajo: del 40,2 % al 66,5 %_ | DATO OFICIAL · EUROSTAT (empleo de las mujeres de 25 a 54 años e hijos por mujer) | En la oficina, una pizarra con dos líneas que suben a la vez de 1995 a 2008: mujeres con trabajo y nacimientos. |
| 5 | 23-25 s | padre (62 años) | ¿Entonces qué ha cambiado? | «¿Entonces qué ha cambiado?» | — | El padre se rasca la cabeza. |
| 6 | 25-33 s | hijo (31 años) | En 1986, el padre tenía 2 días de permiso y la madre, 14 semanas. Hoy, 19 semanas cada uno. | Permiso por nacimiento · 1986: padre, 2 días; madre, 14 semanas · hoy: 19 semanas cada uno | DATO OFICIAL · BOE (Estatuto de los Trabajadores de 1980 y Real Decreto-ley 9/2025) | La oficina se deshace y están en un parque. Barras de semanas de permiso: en 1986, casi nada para el padre y 14 para la madre; hoy, 19 para cada uno. |
| 7 | 33-38 s | padre (62 años) | ¡Diecinueve semanas! Yo, cuando naciste tú, tuve dos días y de vuelta al tajo. | «¡Yo tuve dos días!» | — | En el parque. El padre enseña dos dedos; pasa un carrito de bebé. |
| 8 | 38-45 s | hijo (31 años) | Y aun así, desde 2008 hemos bajado de 1,45 a 1,1 hijos por mujer. | Hijos por mujer · 2008: 1,45 · 2024: 1,10 <br>_En 2016: 1,33_ | DATO OFICIAL · EUROSTAT (hijos por mujer) | El parque se deshace y están en la sala de cunas. Una línea baja de 1,45 a 1,1; las cunas se vacían. |
| 9 | 45-49 s | hijo (31 años) | ¿Qué hace falta para tener hijos: tiempo, dinero o casa? ¿Tú qué opinas? | ¿Qué hace falta para tener hijos: tiempo, dinero o casa? | — | La sala se deshace y vuelven a la cocina. Tres botones: TIEMPO, DINERO y CASA, y un bocadillo. |

**Cierre:** hoy trabajan muchas más mujeres que en 1986 (de 26 a 63 de cada 100), pero entre 1995 y 2008 subieron a la vez el empleo de las mujeres y los nacimientos; y los permisos han pasado de 2 días para el padre y 14 semanas para la madre a 19 semanas cada uno. EPA de 1986 (Anuario del INE de 1988) y Eurostat: mujeres de 16 a 64 años con trabajo, 26,2 % en 1986 y 62,7 % en 2025. Eurostat: mujeres de 25 a 54 años con trabajo, 40,2 % (1995) y 66,5 % (2008); hijos por mujer, 1,16 y 1,45. BOE: Estatuto de los Trabajadores de 1980 y Real Decreto-ley 9/2025.

## Cifras verificadas contra los datos

| En el guion | Valor en los datos | Estado | Origen |
|---|---|---|---|
| 26 | 26 | C | `empleo_1986.mujeres.tasa_empleo_pct` |
| 63 | 63 | V | `europa_empleo_mujeres_y_fecundidad.espana_serie.2025.empleo_mujeres_15_64` |
| 63 | 63 | C | `empleo_1986.hombres.tasa_empleo_pct` |
| 71 | 71 | V | `europa_empleo_mujeres_y_fecundidad.espana_serie.2025.empleo_hombres_15_64` |
| 55 | 55 | V | `europa_empleo_mujeres_y_fecundidad.espana_serie.2007.empleo_mujeres_15_64` |
| 54 | 54 | V | `europa_empleo_mujeres_y_fecundidad.espana_serie.2016.empleo_mujeres_15_64` |
| 1,16 | 1,16 | V | `europa_empleo_mujeres_y_fecundidad.espana_serie.1995.hijos_por_mujer` |
| 1,45 | 1,45 | V | `europa_empleo_mujeres_y_fecundidad.espana_serie.2008.hijos_por_mujer` |
| 40,2 | 40,2 | V | `europa_empleo_mujeres_y_fecundidad.espana_serie.1995.empleo_mujeres_25_54` |
| 66,5 | 66,5 | V | `europa_empleo_mujeres_y_fecundidad.espana_serie.2008.empleo_mujeres_25_54` |
| 2 | 2 | V | `permisos.1986.padre_dias` |
| 14 | 14 | V | `permisos.1986.madre_semanas` |
| 19 | 19 | V | `permisos.hoy.cada_progenitor_semanas` |
| 1,1 | 1,1 | V | `europa_empleo_mujeres_y_fecundidad.espana_serie.2024.hijos_por_mujer` |
| 1,10 | 1,10 | V | `europa_empleo_mujeres_y_fecundidad.espana_serie.2024.hijos_por_mujer` |
| 1,33 | 1,33 | V | `europa_empleo_mujeres_y_fecundidad.espana_serie.2016.hijos_por_mujer` |

Generado por `scripts/verificar_guion.py`. No editar a mano: se edita `guion.json` y se vuelve a ejecutar.
