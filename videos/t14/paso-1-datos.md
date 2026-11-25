# T14 · ¿Cuántos minutos trabajas para desayunar? 2016 frente a hoy (22-11-2026)

**Lo que pide Bruno (22-11-2026):** el siguiente vídeo, de la serie «¿Cuántas horas…?» (horas de trabajo para pagar algo concreto, frente a 2016). Lo eligió después de que la de Justicia se quedara sin datos: los tiempos de los juicios están en la web del CGPJ, que el entorno no deja abrir. El objeto lo elegí yo con los datos: el desayuno, porque es donde más se mueven los precios oficiales y todo el mundo lo entiende.

Datos en `data/clean/t14_desayuno.json` (`scripts/calcular_t14.py`). Ficheros oficiales en `data/raw/` (MANIFEST).

## Cómo se calcula
- **Precio:** lo que pagan de media los hogares por kilo, litro o unidad (INE, Encuesta de Presupuestos Familiares base 2016, «valor unitario»; para huevos, naranjas, zumo, leche y pan, gasto / cantidad, que da más decimales). Incluye marcas blancas y ofertas: no es un precio de catálogo.
- **Sueldo:** el neto mediano por hora de T1 (INE, Encuesta Anual de Estructura Salarial; 2025 = EAES 2024 × ETCL 2025/2024; neto con el IRPF y las cotizaciones de cada año).
- **Minutos** = precio del paquete / sueldo neto por hora × 60.
- **Años:** 2016, 2019 y 2025 (último año de la EPF). La EPF base 2016 no tiene 2007 comparable.

## Sueldo neto mediano por hora
| 2016 | 2019 | 2025 |
|---|---|---|
| 10,27 € | 10,85 € | **12,98 €** (+26,4 %) |

Con la media (11,94 € → 15,22 €, +27,5 %), los minutos son algo menos, pero las conclusiones no cambian.

## Minutos de trabajo
| Producto | Precio 2016 | Precio 2025 | Min. 2016 | Min. 2019 | **Min. 2025** | Cambio |
|---|---|---|---|---|---|---|
| Kilo de chocolate y cacao | 6,84 € | 11,98 € | 40,0 | 40,3 | **55,4** | +38,6 % |
| Docena de huevos | 1,75 € | 3,04 € | 10,2 | 10,5 | **14,1** | +37,4 % |
| Kilo de naranjas y otros cítricos | 1,28 € | 1,89 € | 7,5 | 7,2 | **8,7** | +17,0 % |
| Paquete de café de 250 g | 2,22 € | 3,28 € | 13,0 | 11,0 | **15,2** | +16,9 % |
| Litro de zumo | 1,07 € | 1,52 € | 6,3 | 6,5 | **7,0** | +12,1 % |
| Litro de leche entera | 0,79 € | 1,08 € | 4,6 | 4,3 | **5,0** | +7,6 % |
| Kilo de azúcar | 0,98 € | 1,28 € | 5,7 | 5,6 | **5,9** | +3,3 % |
| Litro de aceite de oliva | 3,81 € | 4,95 € | 22,3 | 18,9 | **22,9** | +2,8 % |
| Barra de pan de 250 g | 0,64 € | 0,82 € | 3,8 | 3,9 | **3,8** | +1,0 % |

**Más minutos** (más de un 5 %): seis. **Casi igual** (±5 %): azúcar, aceite y pan. **Menos minutos:** ninguno.

## Lo que no entra (y por qué)
- **El alquiler:** el que pagan de media los hogares inquilinos (INE, EPF) cuesta casi las mismas horas que en 2016 (unas 34 al mes), porque la media incluye contratos antiguos. El precio de los contratos nuevos está en la web del Ministerio de Vivienda, que no deja descargar desde aquí.
- **El café del bar o el menú del día:** no hay precio oficial en euros, solo índices.

## Veredicto
**Empeora frente a 2016.** El sueldo neto mediano por hora sube un 26 %, pero de nueve básicos del desayuno, seis cuestan más minutos de trabajo (cacao +39 %, huevos +37 %, naranjas y café +17 %, zumo +12 %, leche +8 %) y ninguno menos. El pan, el aceite y el azúcar, casi igual. El vídeo no da causas.
