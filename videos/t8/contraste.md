# T8 · Contraste: ¿estamos mejor o peor que hace 10, 20 y 40 años? (18-11-2026)

Bruno no está conforme con la idea de que «estamos mejor». Pide contrastar, sobre todo, el precio de los carburantes, los impuestos en euros por litro y si los sueldos suben al ritmo de los precios. Cálculo: `scripts/contraste_t8.py` → `data/clean/t8_contraste.json`. Fuentes oficiales en `data/raw/` (MANIFEST).

## Respuesta corta
No está todo mejor. El sueldo medio compra algo más que hace 10, 20 o 40 años, pero poco. El Estado se queda una parte algo mayor. Y el carburante y la vivienda han subido bastante más que el sueldo. Quien sí ha mejorado claramente es el que cobra el salario mínimo.

## Error de T8 que hay que corregir
La escena 11 dice que la gasolina paga «47 céntimos ahora». Es el tipo que marca la ley, pero en 2026 no siempre se ha pagado ese:
- **Real Decreto-ley 7/2026** (crisis de Oriente Medio): desde marzo hasta el 30-6-2026, la gasolina 95 bajó a 35,9 céntimos por litro y el IVA de los carburantes al 10 %.
- **Real Decreto-ley 18/2026:** retirada gradual en julio, agosto y septiembre.
- **Real Decreto-ley 25/2026:** 20 céntimos menos en octubre (27,3 céntimos). En noviembre y diciembre la rebaja es de 13 y 6 céntimos, o de 20 si el IPC de la gasolina o del gasóleo supera en más de un 15 % el del año anterior. El boletín de la Comisión Europea da 27,3 céntimos desde el 12-10-2026.

## Carburantes (boletín petrolero de la Comisión Europea, media de cada año; 2026, de enero a noviembre)
| Gasolina 95 | 2006 | 2016 | 2026 | 9-11-2026 |
|---|---|---|---|---|
| Precio del litro | 1,04 € | 1,15 € | 1,61 € | **1,73 €** |
| En euros de hoy | 1,57 € | 1,51 € | 1,61 € | 1,73 € |
| Antes de impuestos | 0,49 € | 0,49 € | 0,99 € | **1,16 €** |
| Impuestos por litro | 0,55 € (53 %) | 0,66 € (58 %) | 0,62 € (39 %) | **0,57 € (33 %)** |
| Impuestos, en euros de hoy | 0,83 € | 0,87 € | 0,62 € | 0,57 € |

| Gasóleo | 2006 | 2016 | 2026 | 9-11-2026 |
|---|---|---|---|---|
| Precio del litro | 0,96 € | **1,01 €** | 1,69 € | **1,90 €** |
| En euros de hoy | 1,45 € | 1,33 € | 1,69 € | 1,90 € |
| Impuestos por litro | 0,44 € | 0,54 € | 0,54 € | 0,51 € |

- **Precio: Bruno tiene razón.** El gasóleo ha pasado de 1,01 € en 2016 a 1,90 € hoy. Incluso descontando la inflación, cuesta un 43 % más que en 2016, y la gasolina un 15 % más.
- **Impuestos en euros: tiene razón a medias.** El impuesto especial es fijo por litro, pero el IVA (21 %) es un porcentaje y crece con el precio. Sin la rebaja temporal, el litro de gasolina costaría hoy 1,97 € y el Estado se llevaría 0,82 €, casi lo que dice Bruno. Con la rebaja se lleva 0,57 €. En 2016 se llevaba 0,66 € (0,87 € de hoy). En euros de hoy, el Estado no se lleva más por litro que en 2016; lo que se ha disparado es el precio antes de impuestos, de 0,49 € a 1,16 €.
- **1986:** falta el precio oficial del litro (lo fijaba el Gobierno; la orden del BOE está por localizar). El impuesto por litro de T8 (0,56 € de hoy) sí está verificado.

## Sueldos frente a precios (INE; en euros de hoy, con el IPC)
| Sueldo bruto al año | 1986 | 2006 | 2016 | 2026 (estimado) |
|---|---|---|---|---|
| Medio | 27.000 € | 29.800 € | 30.400 € | **31.900 €** |
| Mediano | — | 23.800 € | 25.500 € | **26.400 €** |

- **Suben algo más que los precios, pero poco:** el sueldo medio, un 5 % más que en 2016, un 7 % más que en 2006 y un 18 % más que en 1986. Entre 2016 y 2022 no subió nada (30.400 € frente a 30.400 €).
- **2026 es una estimación (C):** el último sueldo anual del INE es de 2024; se sube con lo que creció el coste salarial de la ETCL entre el primer semestre de 2024 y el de 2026 (+7,8 %).
- **1986:** Encuesta de Salarios (industria y servicios), que no es del todo comparable con las encuestas de estructura salarial de 2006 en adelante.

## Lo que le queda limpio al trabajador medio (motor de impuestos de T8; en euros de hoy)
| | 1986 | 2006 | 2026 |
|---|---|---|---|
| Neto al año | 21.600 € | 23.900 € | **24.700 €** |
| Lo que va al Estado (IRPF + cotizaciones) | 14.300 € | 15.500 € | **17.400 €** |
| Parte del coste que va al Estado | 39,8 % | 39,4 % | **41,4 %** |
| **Con el mismo sueldo real (31.900 €):** neto | 25.100 € | 25.300 € | **24.700 €** |

- El neto real del trabajador medio sube: un 14 % desde 1986 y un 3 % desde 2006. Lo que se lleva el Estado sube más: un 22 % y un 12 %.
- **La tesis de Bruno se cumple con el mismo sueldo real:** hoy al trabajador medio le quedan unos 430 € menos al año que con las normas de 1986 y unos 640 € menos que con las de 2006. Con el sueldo mediano, unos 130 € y 450 € menos.
- **Ojo:** el «neto en euros de hoy» ya descuenta la subida de precios del IPC, incluidos el IVA y la gasolina. Lo que el IPC no recoge es la compra de vivienda: un piso de 90 m² costaba 3,4 años de sueldo medio en 1986 y hoy 7,1 (T3). Y a quien conduce mucho, la gasolina le pesa más que en la cesta media del IPC.

## Punto por punto: mejor o peor (frente a 1986, 2006 y 2016)
**Mejor**
1. **Salario mínimo:** neto en euros de hoy, 10.671 € en 1986 y 10.699 € en 2006 → 15.983 € hoy (+50 %), y no paga IRPF.
2. **IVA del pan, la leche y la fruta:** 6 % → 4 % → 4 %.
3. **Ahorros de quien gana bien:** 25,9 % → 28 % → 19 %.
4. **Sueldo medio neto:** algo mejor (+14 % frente a 1986 y +3 % frente a 2006; bruto, +5 % frente a 2016), pero muy poco.

**Igual**
5. **Parte del Estado con el salario mínimo:** 30 → 29 → 29 de cada 100 €.

**Peor**
6. **El mismo sueldo real paga más:** 40.000 € de hoy → 960 € menos que en 1986. Sueldo medio → 430 € menos que en 1986 y 640 € menos que en 2006.
7. **Parte del Estado con el sueldo medio:** 39,8 % → 39,4 % → 41,4 %; con 40.000 €, 40 → 41 → 43.
8. **IVA de la carne, el pescado y el bar:** 6 % → 7 % → 10 %.
9. **IVA de la ropa, la luz y casi todo:** 12 % → 16 % → 21 %.
10. **Precio del carburante:** gasolina un 15 % más cara que en 2016 y gasóleo un 43 % más, ya descontada la inflación.
11. **Ahorros de quien gana poco:** 16,85 % → 15 % → 19 %.
12. **Vivienda** (no está en T8 ni en el IPC): 3,4 → 7,1 años de sueldo.

**Depende de cómo se mire**
13. **Impuestos por litro de gasolina:** hoy, con la rebaja temporal, 0,57 €, menos que en 2016 (0,87 € de hoy). Sin la rebaja, 0,82 €, casi lo mismo que en 2016. El IVA de encima sí sube con el precio.

## Propuesta para T8 (pendiente de Bruno)
- **Corregir la escena de la gasolina** con el precio y los impuestos del litro en euros: 2006, 2016 y hoy, con la rebaja temporal dicha en pantalla.
- **Añadir el trabajador medio con el mismo sueldo real:** hoy le quedan 640 € menos que en 2006.
- **O sacar un vídeo aparte:** «¿Llegas mejor a fin de mes que hace 10, 20 y 40 años?», con el sueldo neto real, el carburante y la vivienda. T8 ya dura 77 s.
