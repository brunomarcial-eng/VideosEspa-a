# T7 · Paso 1: datos y borrador (pendiente de aprobar)

**Consumo hace 40 años, hace 20 y hoy: servicios, ropa y belleza.** Lo pidió Bruno el 17-11-2026: «cafés, gimnasios, pádel, natación, suscripciones, restaurantes, comida a domicilio, compras por internet… ropa, moda rápida, cosmética, peluquería, belleza». Sin Uber.

Datos limpios en `data/clean/t7_consumo.json` (`scripts/calcular_t7.py`). Ficheros originales en `data/raw/`, con su huella en `MANIFEST.csv`.

## Datos

### De cada 100 € que gasta un hogar (gasto total, INE)
| Grupo | 1986 | 2006 | 2025 | Estado |
|---|---|---|---|---|
| Ropa y calzado | **10,9** | 6,8 | **4,0** | V |
| Cuidado personal y complementos (peluquería, cremas, maquillaje, bolsos, relojes…) | **1,5** | 3,5 | **3,1** | V |
| Bares, restaurantes, cafés y hoteles | 7,2 | 10,0 | 9,4 | V |
| Teléfono e internet | 0,9 | 2,9 | 3,1 | V |
| Servicios de ocio, deporte y cultura (gimnasio, pádel, cine…) | 1,4 | 2,1 | 1,9 | V |

**Fuentes:** 1986, Encuesta Continua de Presupuestos Familiares (Anuario del INE de 1989); 2006, EPF base 2006 (tabla 10628); 2025, EPF base 2016 (tabla 73779).

**Ojo:** la clasificación ha cambiado desde 1986, así que la comparación es aproximada. En 1986, «cuidados y efectos personales» y «restaurantes, cafés y hoteles» iban en un solo grupo cada uno.

### Precios descontada la inflación (IPC del INE)
| Grupo | 2006 → 2025 | 2016 → 2025 | Estado |
|---|---|---|---|
| Ropa y calzado | **−22 %** | −10 % | C |
| Bares, restaurantes y hoteles | +8 % | +4 % | C |
| Cuidado personal y otros | −4 % | −8 % | C |
| Teléfono e internet | −56 % | −22 % | C |
| Ocio, deporte y cultura | −13 % | −10 % | C |

### Compras por internet (Eurostat, % de personas de 16 a 74 años, últimos 3 meses)
| Qué | 2006 | 2016 | Hoy | Estado |
|---|---|---|---|---|
| Ha comprado algo por internet | **10 %** | 35 % | **60 %** (2025) | V |
| Ha comprado ropa por internet | 2 % | 23 % | 41 % (2024) | V; la definición cambia en 2020 |
| Ha pedido comida a domicilio de restaurantes por internet | — | — | **25 %** (2024; 23 % en 2023) | V; la serie empieza en 2020 |
| Paga una plataforma de series, películas o deporte | — | — | 27 % (2025) | V; desde 2024 |
| Paga música en streaming | — | — | 18 % (2025) | V; desde 2024 |

### Deporte (Encuesta de Hábitos Deportivos 2024/25, Ministerio de Educación, FP y Deportes)
| Qué | 2015 | 2022 | 2024/25 | Estado |
|---|---|---|---|---|
| Hizo deporte en el último año | 53,5 % | 57,3 % | **62,7 %** | V |
| Abonado o socio de un gimnasio | — | — | **30,7 %** | V |
| Jugó al pádel en el último año | — | — | 9,7 % | V |

**Sin dato oficial (X):**
- **El frontón en 1986.** Hay un estudio de 1985 (34 % hacía deporte), pero solo lo he encontrado citado en trabajos académicos; no lo uso.
- **Cuánto dura la ropa o cuántas prendas se compran.** No hay serie oficial.
- **El gasto concreto en cafés o gimnasios en 1986.** Va dentro de grupos más grandes.

**Qué se puede decir:**
- **Ropa:** se lleva mucho menos del gasto que en 1986 (de 11 a 4 de cada 100 €), y desde 2006 es un 22 % más barata descontada la inflación.
- **Cuidado personal y complementos:** se gasta el doble que en 1986 (de 1,5 a 3 de cada 100 €). Aquí el padre tiene razón.
- **Compras por internet:** en 2006 compraba 1 de cada 10 personas y hoy, 6 de cada 10. Una de cada 4 pide comida de restaurantes a casa.
- **Deporte:** hoy hacen deporte más de 6 de cada 10 personas, y casi 1 de cada 3 paga un gimnasio.

## Borrador del guion (padre contra hijo, quinta parte; unos 60 s)
Decorados como en un sueño: cocina → tienda de ropa → peluquería → gimnasio y pista de pádel → calle con repartidor → cocina.
1. **Padre** (cocina, suena el timbre: otro paquete): ¡Otro paquete! Ropa, cremas, el gimnasio, el pádel, las series… ¡Yo con un chándal tenía para diez años!
2. **Hijo** (tienda de ropa): Pues la ropa es lo que menos pesa: de cada 100 euros, 11 en 1986, 7 en 2006 y hoy, 4.
3. **Padre:** ¡Porque es de usar y tirar!
4. **Hijo:** Puede. Pero desde 2006 es un 22 % más barata, quitando la inflación.
5. **Padre** (peluquería): ¿Y las cremas y la peluquería, qué?
6. **Hijo:** Ahí te doy la razón: de 1,5 de cada 100 en 1986 a 3 hoy.
7. **Padre** (gimnasio y pádel): ¡Y pagando por hacer deporte! Yo jugaba al frontón gratis.
8. **Hijo:** Hoy hacen deporte 6 de cada 10. Y casi 1 de cada 3 paga un gimnasio.
9. **Padre** (calle, pasa un repartidor): ¡Y todo a domicilio!
10. **Hijo:** En 2006 compraba por internet 1 de cada 10. Hoy, 6 de cada 10. Y 1 de cada 4 pide comida a casa.
11. **Hijo, a cámara** (cocina): ¿Caprichos o la vida de hoy? ¿Tú qué opinas?
