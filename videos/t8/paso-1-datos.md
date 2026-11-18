# T8 · Paso 1: datos y borrador (pendiente de aprobar)

**¿Cuánto de tu sueldo se queda el Estado? 1986, 2006 y hoy.** Lo pidió Bruno el 17-11-2026: un cajero de supermercado con el salario mínimo y un empleado de banca con 40.000 € de hoy, pasados por el IPC a 1986 y 2006, con el IRPF, las cotizaciones, lo que paga la empresa y el % que va al Estado.

Datos limpios en `data/clean/t8_impuestos_sueldo.json` (`scripts/calcular_t8.py`). Las normas de cada año están en `data/raw/` (BOE), y el script comprueba que cada tipo y cada tramo aparecen literalmente en el BOE.

## Cómo se calcula (cálculo propio, estado C, con normas leídas en el BOE, V)
- **Los dos trabajadores:** solteros, sin hijos, con contrato indefinido, un año entero y sin otras rentas.
  - **Cajero de supermercado:** salario mínimo de cada año en 14 pagas. 1986: 40.140 pesetas al mes; 2006: 540,90 €; 2026: 1.221 €.
  - **Empleado de banca (oficial administrativo):** 40.000 € brutos en 2026. Con el IPC del INE son 1.958.000 pesetas en 1986 y 26.407 € en 2006: el mismo poder de compra.
- **Lo que va al Estado:** IRPF + cotizaciones del trabajador + cotizaciones de la empresa, sobre lo que le cuesta el trabajador a la empresa (sueldo bruto + cotizaciones de la empresa).
- **Cotizaciones de cada año:**
  - **1986:** Orden de 28-1-1986 y Real Decreto 2475/1985. La cotización principal tenía un tope por categoría (146.070 pesetas al mes para un oficial administrativo).
  - **2006:** Orden TAS/29/2006 y Real Decreto-ley 5/2006, que en julio bajó el desempleo y el FOGASA de la empresa.
  - **2026:** Orden PJC/297/2026, que incluye el mecanismo de equidad intergeneracional (MEI). Es una cotización nueva desde 2023: en 2026, un 0,9 % (0,75 la empresa y 0,15 el trabajador).
  - **Accidentes de trabajo:** tarifa de 1979 rebajada un 10 % en 1986 y 2006; tarifa por actividad hoy (súper 1,65 %, banca 1,50 %).
- **IRPF de cada año:**
  - **1986:** Ley 48/1985. Se restan las cotizaciones y un 2 % de gastos; deducciones de 17.000 + 20.000 pesetas.
  - **2006:** texto refundido de 2004 con las escalas de la Ley 30/2005; mínimo de 3.400 €.
  - **2026:** Ley 35/2006 con la escala y el mínimo de la **Comunidad de Madrid**. En 1986 no había tramo autonómico, y en 2006 Madrid usaba la escala general.

## Resultados

### Cajero con el salario mínimo
| | 1986 | 2006 | 2026 |
|---|---|---|---|
| Sueldo bruto al año | 561.960 pesetas | 7.573 € | 17.094 € |
| Le cuesta a la empresa | 745.721 pesetas | 10.009 € | 22.615 € |
| Cotizaciones (trabajador + empresa) | 217.479 pesetas | 2.917 € | 6.632 € |
| IRPF | 5.865 pesetas (1,0 % del bruto) | 29 € (0,4 %) | **0 €** |
| **Se queda el Estado, de cada 100 € que cuesta** | **29,9** | 29,4 | **29,3** |
| Le llega neto, en euros de 2026 | **10.671 €** | 10.699 € | **15.983 €** |

### Empleado de banca con 40.000 € de hoy
| | 1986 | 2006 | 2026 |
|---|---|---|---|
| Sueldo bruto al año | 1.958.000 pesetas | 26.407 € | 40.000 € |
| Le cuesta a la empresa | 2.533.168 pesetas | 34.690 € | 52.860 € |
| IRPF | 16,6 % del bruto | 16,5 % | **18,0 %** |
| **Se queda el Estado, de cada 100 € que cuesta** | **39,8** | 41,2 | **42,9** |
| En euros de 2026: le cuesta a la empresa | 51.746 € | 52.546 € | 52.860 € |
| En euros de 2026: va al Estado | 20.590 € | 21.678 € | **22.664 €** |
| En euros de 2026: le llega neto | **31.156 €** | 30.869 € | **30.196 €** |

## Qué se puede decir
- **Cajero:** el Estado se queda casi lo mismo que en 1986 (unos 30 de cada 100 € que cuesta), y casi todo son cotizaciones. Hoy no paga IRPF; en 1986 pagaba un poco. Y cobra mucho más: el salario mínimo neto, en euros de hoy, ha pasado de 10.671 € a 15.983 € al año (+50 %).
- **Empleado de banca:** con el mismo sueldo real, hoy el Estado se queda más: 43 de cada 100 € que cuesta, frente a 40 en 1986 y 41 en 2006. Le llegan 960 € menos al año que en 1986 (en euros de hoy), y el Estado recibe unos 2.070 € más.
- **Por qué sube, sin entrar en causas:** en 1986 la cotización tenía un tope por categoría que hoy no existe para ese sueldo, el IRPF es algo más alto (16,6 % → 18 %) y desde 2023 hay una cotización nueva (MEI).
- **Lo que no cambia:** la empresa sigue pagando la mayor parte de las cotizaciones (unos 32 € por cada 100 € de sueldo bruto hoy).

## Qué no se puede decir
- Que «todos» pagan más: depende del sueldo. Con el salario mínimo, la parte del Estado es casi igual.
- Que sea por un gobierno concreto (regla 3).
- Cifras de otra comunidad: en 2026, con otra escala autonómica, el IRPF del empleado de banca cambia unos cientos de euros. Conviene decir en pantalla «en Madrid».

## Dos cosas que tienes que confirmar
1. **Comunidad para el IRPF de hoy: ¿Madrid?** Encaja con T9 (el bar en Madrid). Con otra comunidad sube algo el IRPF del empleado de banca.
2. **El empleado de banca como oficial administrativo.** En 1986 eso fijaba su tope de cotización (146.070 pesetas al mes). Como auxiliar, el tope era algo más bajo y el Estado se quedaba un poco menos.

## Borrador del guion (padre contra hijo, sexta parte; unos 60 s)
Decorados como en un sueño: cocina → caja del súper → oficina del banco → cocina.
1. **Padre** (cocina, con la nómina del hijo): ¡Menuda nómina! En mis tiempos Hacienda no te sangraba así.
2. **Hijo** (caja del súper): Vamos a ver. Un cajero con el salario mínimo: de cada 100 € que pagaba la empresa, al Estado iban 30 en 1986. Hoy, 29.
3. **Padre:** ¿Ves? Lo mismo.
4. **Hijo:** Lo mismo, pero hoy cobra mucho más: en euros de hoy, 10.700 al año en 1986 y 16.000 hoy.
5. **Padre** (en el banco): ¿Y uno que gane bien? Uno de banca.
6. **Hijo:** Con 40.000 € de hoy, el Estado se quedaba 40 de cada 100 en 1986. Hoy, 43.
7. **Padre:** ¿Tres más? ¡Eso no es nada!
8. **Hijo:** Son 960 € al año menos en su bolsillo. Y la empresa paga casi 53.000 € para que él cobre 30.000.
9. **Hijo, a cámara:** ¿Pagamos mucho o poco al Estado? ¿Tú qué opinas?
