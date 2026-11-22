# T16 · ¿Cuántos meses trabajas para pagar tu coche? 2007, 2016, 2019 y hoy (22-11-2026)

**Lo que pide Bruno (22-11-2026):** dos vídeos de coches; este es el A. Cuánto cuesta el coche en tiempo de trabajo, cuánto coche te puedes permitir, los intereses si lo financias, los impuestos (IVA y matriculación), pagarlo al contado y cuántos meses de tu vida van al coche. Escenario: un concesionario, con un vendedor y una clienta, y un calendario que pasa los meses mientras cambian las estaciones por los ventanales.

Datos en `data/clean/t16_coche.json` (`scripts/calcular_t16.py`). Ficheros oficiales en `data/raw/` (MANIFEST).

## Cómo se calcula
- **Precio del coche medio:** el precio medio de los turismos y todoterrenos que se matriculan cada año en España (Agencia Tributaria, estadística del Impuesto sobre la Matriculación, tabla «por epígrafe», fila Total). Es la base imponible media, sin IVA; le sumamos el impuesto de matriculación medio (de la misma tabla) y el IVA de cada año sobre la base (16 % en 2007; 21 % en 2016, 2019 y 2025). En 2007 el impuesto de matriculación iba por cilindrada (7 % o 12 %) y la tabla es por tipo de combustible, no por epígrafe de CO2; la fila Total mide lo mismo. Incluye los usados importados que se matriculan por primera vez en España y **los extras que cada uno elige**: es lo que se paga de verdad, no el precio de un coche básico (uno básico sale más barato).
- **Sueldo:** el neto mediano anual de T1 y T14 (INE, Encuesta Anual de Estructura Salarial, con la Encuesta Trimestral de Coste Laboral para 2025; IRPF y cotizaciones de cada año), entre 12 meses.
- **Al contado:** meses de sueldo = precio con impuestos / sueldo neto de un mes. Todo el sueldo, sin gastar nada más.
- **Financiado:** préstamo por todo el precio a cinco años (60 cuotas, sistema francés) a la TAE media anual de los préstamos al consumo nuevos a hogares (Banco de España, Boletín Estadístico 19.6, serie BE_19_6.2). Meses de sueldo = total pagado / sueldo de un mes. La financiación de un concesionario suele salir más cara que la media; aquí usamos el dato oficial.
- **Cuánto coche te puedes permitir:** el Banco de España no da una cifra oficial. Es un **escenario propio** y así se dice en pantalla: un tercio del sueldo neto a la cuota, cinco años, a la TAE media de 2025.
- **Años:** 2007 (antes de la crisis), 2016, 2019 y 2025 (último año completo). La conclusión cambia con el año y se dice en el vídeo (plano 10 y cierre).

## Resultados
| | 2007 | 2016 | 2019 | **2025** |
|---|---|---|---|---|
| Sueldo neto mediano al mes | 1.185 € | 1.332 € | 1.392 € | **1.702 €** (+27,8 % desde 2016) |
| Coches matriculados (turismos y todoterrenos) | 1.469.416 | 1.167.947 | 1.301.986 | 1.237.082 |
| Precio medio sin impuestos | 16.815 € | 16.505 € | 17.588 € | 23.188 € |
| Impuesto de matriculación medio | 1.316 € | 281 € | 473 € | 604 € |
| IVA | 2.690 € (16 %) | 3.466 € (21 %) | 3.693 € | 4.869 € |
| **Precio con impuestos** | 20.821 € | 20.252 € | 21.754 € | **28.661 €** (+41,5 % desde 2016) |
| Impuestos / precio | 19,2 % | 18,5 % | 19,2 % | **19,1 %** (5.473 €) |
| **Meses de sueldo al contado** | 17,6 | 15,2 | 15,6 | **16,8** |
| TAE media préstamos al consumo | 9,76 % | 8,43 % | 8,33 % | **7,74 %** (sept. 2026: 7,54 %) |
| Cuota a cinco años | 436 € (36,8 % del sueldo) | 412 € (30,9 %) | 441 € (31,7 %) | **574 € (33,7 %)** |
| Intereses | 5.324 € | 4.457 € | 4.729 € | **5.780 €** |
| **Meses de sueldo financiado** | 22,1 | 18,5 | 19,0 | **20,2** |

Escenario propio: un tercio del sueldo de 2025 (567 €) a cinco años al 7,74 % da para un préstamo de 28.327 €, casi justo el coche medio.

## Veredicto
**Empeora frente a 2016 y 2019; mejora frente a 2007.** Desde 2016 el coche medio sube más que el sueldo (+41,5 % frente a +27,8 %), así que cuesta más meses de trabajo, al contado (15,2 → 15,6 → 16,8) y financiado (18,5 → 19,0 → 20,2). Pero en 2007, antes de la crisis, costaba aún más: 17,6 meses al contado y 22,1 financiado, con préstamos al 9,76 %. El dinero prestado sale hoy más barato que en cualquiera de los tres años. La parte de impuestos apenas cambia (18,5–19,2 %). El vídeo no da causas.

## Estado de cada cifra
- V (leído en la fuente): TAE de cada año (Banco de España), matriculaciones y precio medio sin y con impuesto de matriculación (Agencia Tributaria), tipos de IVA (BOE), bruto mediano 2016 y 2019 (INE).
- C (cálculo propio, fórmula arriba): bruto mediano 2007 (de T1), IVA en euros, precio con impuestos, impuestos / precio, sueldo neto, meses de sueldo, cuota, intereses, escenario del tercio, sueldo 2025 (EAES 2024 × ETCL).
- Ninguna en P ni X.
