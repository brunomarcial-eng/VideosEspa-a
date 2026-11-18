# T8 · Paso 1: datos y borrador, versión 3 (aprobada por Bruno el 18-11-2026)

**¿Cuánto de tu sueldo se queda el Estado? 1986, 2006 y hoy.** Lo pidió Bruno el 17-11-2026: un cajero de supermercado con el salario mínimo y un empleado de banca con 40.000 € de hoy, pasados por el IPC a 1986 y 2006, con el IRPF, las cotizaciones, lo que paga la empresa y el % que va al Estado.

Datos limpios en `data/clean/t8_impuestos_sueldo.json` (`scripts/calcular_t8.py`). Las normas de cada año están en `data/raw/` (BOE), y el script comprueba que cada tipo y cada tramo aparecen literalmente en el BOE.

**Versión 2 (18-11-2026):** Bruno pide añadir los impuestos de después de cobrar: el IVA de la comida, la gasolina, la ropa y el colegio, y los impuestos sobre el dinero (ahorro, inversión, donaciones).

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

## Después de cobrar (versión 2)

### IVA de cada día (BOE: Ley 30/1985 para 1986; Ley 37/1992 en su redacción de 2006 y la vigente)
| Qué compras | 1986 | 2006 | 2026 |
|---|---|---|---|
| Pan, leche, huevos, fruta y verdura | 6 % | 4 % | **4 %** (hoy, también el aceite de oliva) |
| El resto de la comida (carne, pescado…) | 6 % | 7 % | **10 %** |
| Bar y restaurante | 6 % | 7 % | **10 %** |
| Ropa y calzado | 12 % | 16 % | **21 %** |
| Gasolina y gasóleo | 12 % | 16 % | **21 %** (y además el impuesto especial por litro: ver abajo) |
| Luz, móvil y casi todo lo demás | 12 % | 16 % | **21 %** |
| Coche | **33 %** (tipo de lujo) | 16 % | 21 % |

**Qué se puede decir:** lo básico de la compra paga hoy menos IVA que en 1986 (del 6 % al 4 %). El resto de la comida paga más (del 6 % al 10 %), y casi todo lo demás, bastante más (del 12 % al 21 %). El coche es la excepción: en 1986 pagaba un 33 % por considerarse un lujo.

### La gasolina: el impuesto especial por litro (además del IVA)
| | 1986 | 2006 | 2026 |
|---|---|---|---|
| Impuesto por litro de gasolina | 27,50 pesetas (0,17 €) | 0,42 € | **0,47 €** |
| En euros de hoy (con el IPC) | **0,56 €** | 0,64 € | **0,47 €** |
| IVA | 12 % | 16 % | **21 %** |

- **1986:** impuesto sobre hidrocarburos de la Ley 45/1985 («gasolinas de automoción»). El Monopolio de Petróleos cobraba además una renta, que no se incluye.
- **2006, en Madrid:** impuesto sobre hidrocarburos (371,69 € por 1.000 litros), más el impuesto sobre las ventas minoristas: 24 € de tramo estatal y 24 € de tramo de Madrid.
- **2026:** 400,69 € de tipo general + 72 € de tipo especial por 1.000 litros, igual en toda la península y Baleares.
- **Qué se puede decir:** en euros de hoy, el impuesto por litro es más bajo que en 1986 y que en 2006, pero el IVA que se suma encima ha pasado del 12 % al 21 %.
- **Sin dato oficial accesible:** el precio medio del litro de cada año, para saber qué parte del precio es impuesto. El boletín petrolero de la Comisión Europea está bloqueado en este entorno.

### Los intereses de tus ahorros (IRPF)
| | 1986 | 2006 | 2026 |
|---|---|---|---|
| Cajero (salario mínimo) | 16,85 % | 15 % | **19 %** |
| Empleado de banca | 25,9 % | 28 % | **19 %** |

En 1986 y 2006, los intereses se sumaban al sueldo y pagaban al tipo más alto de cada uno. Desde 2007 van aparte, con su propia escala: 19 % hasta 6.000 €, 21 % hasta 50.000 €, y 23, 27 y 30 % por encima. En 2006, vender algo comprado hacía más de un año (acciones, fondos) pagaba un 15 %. **Qué se puede decir:** hoy los ahorros del que gana bien pagan menos que antes, y los del que gana poco, algo más.

### Donaciones, herencias y patrimonio: para otro vídeo (Bruno, 18-11-2026)
- **Donaciones y herencias:** hoy las regula cada comunidad, y la diferencia entre comunidades es enorme. Donar a un hijo en Madrid tiene hoy una rebaja del 99 %, y en otras comunidades se paga bastante más. En 1986 había un impuesto estatal (ley de 1967), igual para todos.
- **Patrimonio:** existía en 1986 y en 2006 y existe hoy, con reglas distintas en cada comunidad, más un impuesto estatal para grandes fortunas desde 2022.
- **Por qué aparte:** hacerlo bien exige comparar todas las comunidades, porque fijarse solo en una se puede ver como favorable a un partido (regla 3), y no cabe en este minuto. Si te parece, lo preparo como su propio vídeo: «¿Cuánto cuesta heredar o donar a un hijo?».

## Decisiones de Bruno (18-11-2026)
1. IRPF de hoy con la escala de la **Comunidad de Madrid**: sí.
2. Empleado de banca como **oficial administrativo**: sí.
3. Donaciones, herencias y patrimonio, **para otro vídeo**: sí.
4. **Quitar el colegio** (no lleva IVA) y **especificar el impuesto de la gasolina**.

## Borrador del guion, versión 3 (padre contra hijo, sexta parte; unos 75 s)
Decorados como en un sueño: cocina → caja del súper → oficina del banco → pasillo del súper con el carro → gasolinera → banco (hucha) → cocina.
1. **Padre** (cocina, con la nómina del hijo): ¡Menuda nómina! En mis tiempos Hacienda no te sangraba así.
2. **Hijo** (caja del súper): Un cajero con el salario mínimo: de cada 100 € que pagaba la empresa, 30 iban al Estado en 1986. Hoy, 29.
3. **Padre:** ¿Ves? Lo mismo.
4. **Hijo:** Lo mismo, pero hoy cobra mucho más: 10.700 € al año en 1986, en euros de hoy, y 16.000 ahora.
5. **Padre** (en el banco): ¿Y uno de banca, que gana bien?
6. **Hijo:** Con 40.000 € de hoy, el Estado se quedaba 40 de cada 100 en 1986. Hoy, 43: 960 € menos en su bolsillo.
7. **Padre** (en el súper, con el carro): ¡Y luego vas a la compra y otra vez a pagar!
8. **Hijo:** El IVA del pan, la leche y la fruta ha bajado: del 6 al 4 %. Pero la carne, del 6 al 10. Y la ropa, del 12 al 21.
9. **Padre** (en la gasolinera): ¡Y la gasolina, que es todo impuestos!
10. **Hijo:** Paga un impuesto por cada litro: 56 céntimos de hoy en 1986, y 47 ahora. Pero el IVA ha subido del 12 al 21 %.
11. **Hijo** (con una hucha): ¿Y los ahorros? Los intereses del de banca pagaban un 26 % en 1986. Hoy, un 19 %.
12. **Hijo, a cámara:** ¿Pagamos mucho o poco al Estado? ¿Tú qué opinas?
