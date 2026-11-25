# T17 · El coche más vendido, 2016 frente a hoy, y la segunda mano (22-11-2026)

**Lo que pide Bruno (22-11-2026):** coches, vídeo B. El coche más comprado hoy y en 2016, su precio y qué dice eso del bolsillo. Después pidió un **top 3** de cada año, no un solo coche, y el peso de la **segunda mano** frente a hace diez años. Preguntó por los precios de 2016 en km77 o en la web de la marca. Esos precios son de catálogo, no oficiales (estado P), y la regla 1 del canal no deja sacarlos en pantalla. No hay precio oficial por modelo antes de 2022.

Datos en `data/clean/t17_mas_vendido.json` (`scripts/calcular_t17.py`). Ficheros oficiales en `data/raw/` (MANIFEST). Los microdatos de la DGT (unos 10-15 MB al mes) no se versionan: van en `data/raw/microdatos/`, con enlace y huella en el MANIFEST.

## Cómo se calcula
- **Top 3:** turismos y todoterrenos **nuevos** matriculados cada año (DGT, microdatos mensuales: un registro por coche). Los modelos se agrupan por familia: el León con su versión familiar (ST) y el Clio con su híbrido. Los que tienen nombre propio van aparte: el Yaris Cross no es el Yaris, y el C3 Aircross no es el C3. La DGT no tiene microdatos anteriores a diciembre de 2014, así que no hay top 3 de 2007.
- **Precio de los modelos de hoy:** el precio medio real de 2025 por modelo (Agencia Tributaria, ranking de ventas). Es la base imponible, sin IVA ni impuesto de matriculación; le sumamos el IVA del 21 %. Incluye los extras que cada uno elige. Hacienda solo lo publica desde 2022 y solo para el modelo más vendido de cada marca.
- **Coche nuevo medio:** el precio medio de los coches nuevos comprados en España (Agencia Tributaria, tabla por origen, «Nuevo y adquirido en España»), con el impuesto de matriculación y el IVA de cada año (16 % en 2007; 21 % después).
- **Segunda mano:** turismos que cambian de dueño por cada turismo matriculado (DGT, series históricas de cambios de titularidad y de matriculaciones). Los cambios de titularidad incluyen los que pasan por un compraventa. Aparte, el peso de los usados traídos de fuera en las matriculaciones (Agencia Tributaria, origen «Usado»).
- **Sueldo:** el neto mediano al mes de T16 (INE y Eurostat).

## Top 3 de nuevos (DGT)
| | 1.º | 2.º | 3.º |
|---|---|---|---|
| 2016 | SEAT León · 33.657 | SEAT Ibiza · 31.832 | Volkswagen Golf · 28.740 |
| 2019 | SEAT León · 35.851 | Dacia Sandero · 33.880 | Nissan Qashqai · 30.162 |
| **2025** | **Dacia Sandero · 38.533** | **Renault Clio · 27.102** | **MG ZS · 23.727** |

En 2025, el 4.º es el SEAT Ibiza (23.202), a 525 del MG ZS. En el recuento de Hacienda, que es otro universo (declaraciones del impuesto), el Ibiza va 3.º y el MG ZS detrás.

## Lo que cuestan hoy (Agencia Tributaria, 2025)
| Modelo | Sin impuestos | Con IVA | Meses de sueldo |
|---|---|---|---|
| Dacia Sandero | 13.018 € | 15.752 € | **9,3** |
| Renault Clio | 14.886 € | 18.012 € | **10,6** |
| MG ZS | 17.454 € | 21.119 € | **12,4** |
| *Coche nuevo medio* | 25.592 € | 31.555 € (con matriculación) | **18,5** |

Los tres más vendidos cuestan entre la mitad y dos tercios del coche nuevo medio. Sin dato oficial del precio del León, el Ibiza o el Golf de 2016.

## Coche nuevo medio y segunda mano
| | 2007 | 2016 | 2019 | **2025** |
|---|---|---|---|---|
| Sueldo neto mediano al mes | 1.185 € | 1.332 € | 1.392 € | **1.702 €** |
| Coche nuevo medio, con impuestos | 21.635 € | 20.741 € | 22.816 € | **31.555 €** |
| **Meses de sueldo** | 18,3 | 15,6 | 16,4 | **18,5** |
| Turismos que cambian de dueño por cada matriculado | 1,55 | 2,03 | 2,19 | **2,48** |
| Usados traídos de fuera / matriculaciones | 16,1 % | 9,1 % | 11,8 % | **18,6 %** |

Desde 2016, el coche nuevo medio sube un 51,2 % sin impuestos y el sueldo neto un 27,8 %.

## Veredicto
**Empeora frente a 2016 y 2019.** Lo más vendido pasa de dos compactos y un utilitario a tres coches de los más baratos (9 a 12 meses de sueldo, frente a 18,5 del coche nuevo medio). El coche nuevo medio sube de 15,6 a 18,5 meses, y se compra más segunda mano: 2,48 usados por cada matriculado, frente a 2,03. **Frente a 2007**, el coche nuevo cuesta casi los mismos meses (18,3), pero entonces se vendían 1,55 usados por cada matriculado: hoy, mucha más segunda mano. El vídeo no da causas.

## Estado de cada cifra
- V (leído en la fuente): matriculaciones por modelo (DGT), precio medio por modelo y del coche nuevo (Agencia Tributaria), cambios de titularidad y matriculaciones (DGT), tipos de IVA (BOE).
- C (cálculo propio): precio con IVA, meses de sueldo, usados por cada matriculado, porcentajes.
- X: precio oficial por modelo de 2016 y 2019, y top 3 de 2007. No salen en el vídeo.
