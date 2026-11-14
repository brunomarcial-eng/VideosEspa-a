# T3 · Paso 1: tabla de datos — ¿Comprar casa es más difícil hoy que hace 20 años?

Para aprobar por Bruno. Datos consultados el 14-11-2026. Ficheros crudos en `data/raw/` (enlace, fecha y huella SHA-256 en `MANIFEST.csv`). Cálculo reproducible:

```
python3 scripts/descargar_datos.py bde_si_1_5_vivienda.csv ine_65270_epa_hogares_ocupados.json ine_10627_epf2006_grupos.json eurostat_yth_demo_030.json microdatos/ees_cuatrienal_2006.zip microdatos/ees_cuatrienal_2022.zip
python3 scripts/calcular_t3.py      # → data/clean/t3_vivienda.json
```

Bruno pidió comparar solo 2006 con hoy (hace 20 años). Añado 2016 como control porque **la conclusión cambia con el año** (regla 2): 2006 fue el pico de la burbuja.

Estados: **V** leído en la fuente oficial · **C** cálculo propio con fórmula. Nada en P ni en X.

## 1. La casa
| Dato | 2006 | 2016 | Hoy | Fuente | Estado |
|---|---|---|---|---|---|
| Precio medio del m² (vivienda libre tasada) | 1.944 € | 1.503 € | 2.335 € (1.er semestre de 2026; junio: 2.355 €) | Banco de España, indicadores de vivienda (dato del Ministerio de Vivienda) | V |
| Piso de 90 m² | 174.985 € | 135.236 € | 210.182 € | m² × 90 | C (supuesto: 90 m²) |
| El mismo piso, descontando la inflación | — | −33 % | **−20 %** frente a 2006 | IPC del INE | C |
| Precio de la vivienda ÷ renta bruta de un hogar | **8,8 años** | 6,7 años | **8,4 años** (junio de 2026) | Banco de España | V |
| Parte de la renta del hogar que se va en la cuota (préstamo del 80 %) | **46 %** | 31 % | **38 %** (junio de 2026) | Banco de España, «esfuerzo teórico sin deducciones» | V |
| Tipo de interés de las hipotecas | 4,2 % | 2,3 % | 2,9 % | Banco de España | V |
| Plazo medio de la hipoteca | 27 años | 23 años | 25 años | Banco de España | V |
| Préstamos de más del 80 % del valor | **17 %** | 14 % | **10 %** | Banco de España | V |
| Hogares en propiedad / en alquiler | 79,5 % / 13,5 % | 77,1 % / 16,3 % | 73,3 % / 20,2 % (2025) | Banco de España (censos y encuesta continua de hogares) | V |

## 2. El sueldo (bruto al año)
| Dato | 2006 | 2022 | 2024 | Fuente | Estado |
|---|---|---|---|---|---|
| Sueldo medio | 19.686 € | 26.949 € | 29.540 € | 2006 y 2022: microdatos de la Encuesta de Estructura Salarial (INE). 2024: Encuesta Anual (INE) | C · C · V |
| Sueldo mediano (la mitad gana menos) | 15.739 € | 22.383 € | 24.497 € | ídem | C · C · V |
| **Sueldo más frecuente** | **≈ 13.800 €** (unos 985 € al mes en 14 pagas) | **≈ 16.900 €** (unos 1.205 € al mes) | no se publica | microdatos INE (cumbre de la distribución) | C |
| Inflación acumulada desde 2006 | — | +34 % | +43 % (hasta 2026: +51 %) | IPC, INE | V/C |
| Sueldo medio, descontando la inflación | — | +2 % | +5 % | | C |
| Sueldo mediano, descontando la inflación | — | +6 % | +9 % | | C |
| **Sueldo más frecuente, descontando la inflación** | — | **−9 %** | — | | C |

- Comprobación del método: con los microdatos de 2022, la media (26.949 €) y la mediana (22.383 €) dan exactamente lo que publica el INE.
- El sueldo más frecuente depende de cómo se suavice la distribución: en 2006 sale entre 13.775 y 13.925 €, y en 2022 entre 16.775 y 17.125 €. Por eso se dice «unos».

## 3. Años de sueldo bruto para comprar (cálculo propio)
| | 2006 | 2024 | Con el precio de 2026 y el sueldo de 2024 |
|---|---|---|---|
| Piso de 90 m², con el sueldo medio | 8,9 años | 5,8 años | 7,1 años |
| Piso de 90 m², con el sueldo mediano | 11,1 años | 7,0 años | 8,6 años |
| Piso de 90 m², con el sueldo más frecuente | 12,7 años | 9,3 años (precio y sueldo de 2022) | — |
| Entrada y gastos (30 % del piso), con el sueldo mediano | 3,3 años | 2,1 años | 2,6 años |
| Entrada y gastos, con el sueldo más frecuente | 3,8 años | 2,8 años (2022) | — |

Supuestos: entrada del 20 % (el banco presta el 80 %) y un 10 % de impuestos y gastos de compra, que varía según la comunidad.

## 4. Las ideas que hay que contrastar
| Idea | Lo que dicen los datos | Fuente | Estado |
|---|---|---|---|
| «Antes trabajaba uno solo en casa» | En 2006, de los hogares con alguien trabajando, el **54 %** tenía dos o más sueldos. Hoy, el **52 %**. Ya entonces lo normal eran dos sueldos | EPA, INE, tabla 65270 (3.er trimestre) | V · C (%) |
| «Los jóvenes no compran porque se lo gastan en viajes y Netflix» | Lo que gasta un hogar en ocio, restaurantes, hoteles y comunicaciones era el **23,7 %** de su gasto en 2006. En 2025, el **22,2 %**. Descontando la inflación, hoy se gasta un **30 % menos** que en 2006 | Encuesta de Presupuestos Familiares, INE (tablas 10627 y 73778) | V · C |
| Edad a la que nos vamos de casa | **28,7 años** en 2006; **30,2** en 2025 (media de la UE: 26,3) | Eurostat (yth_demo_030) | V |

## (a) Qué se puede decir
- **Hoy, comprar casa cuesta casi lo mismo que en 2006, el peor año de la burbuja.** En años de renta del hogar, 8,4 frente a 8,8; en años de sueldo, incluso algo menos.
- La cuota se come **menos** que en 2006 (38 % frente a 46 %), porque los intereses están más bajos (2,9 % frente a 4,2 %).
- **Frente a 2016 ha empeorado mucho**: de 6,7 a 8,4 años de renta, y la cuota pasa del 31 % al 38 %. Y va deprisa: el m² ha subido un 12,5 % en el último año.
- **Lo que sí está peor que hace 20 años:**
  - El sueldo más frecuente compra un 9 % menos.
  - Los bancos dejan menos margen: los préstamos de más del 80 % bajan del 17 % al 10 %, así que la entrada hay que tenerla ahorrada.
  - Hay más gente de alquiler (del 13,5 % al 20,2 % de los hogares).
  - Nos vamos de casa año y medio más tarde.
- **Las dos ideas del debate no se sostienen con los datos:**
  - Ya en 2006 la mayoría de los hogares con trabajo tenía dos sueldos.
  - Hoy se gasta menos en ocio que entonces, no más.

## (b) Qué no se puede decir
- Que hoy sea «imposible» o «más difícil que nunca» comprar: con estos indicadores, 2006 y 2007 fueron peores.
- Que la causa sea la inmigración, los fondos, los pisos turísticos o un Gobierno: no hay datos aquí para atribuir causas.
- Precios de alquiler en euros de 2006: el INE solo publica índices de alquiler desde 2015.
- El sueldo más frecuente de 2024 o 2026: el INE solo lo saca de la encuesta cuatrienal (último dato: 2022).

## (c) Qué cambia con otro año base
- **Con 2006 o 2007 de base:** hoy está más o menos igual o algo mejor.
- **Con 2016 o 2019 de base:** hoy está claramente peor.
- **El vídeo tiene que decir las dos cosas** (regla 2).

## (d) Qué falta o se podría añadir
- Gasto en ocio de los hogares jóvenes (persona de referencia de menos de 30 años) en 2006 y hoy: hay tabla en la base de 2016; falta localizar la de la base de 2006 en el INE.
- Tasa de ahorro de los hogares (INE, cuentas de los sectores): no la he bajado todavía.
