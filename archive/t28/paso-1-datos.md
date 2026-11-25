# T28 · ¿Tener un bebé cuesta hoy más horas de trabajo? · Paso 1: datos (25-11-2026)

Bruno, 24-11-2026: «Todos. 4 vídeos… Ponte con ellos uno por uno»; el cuarto de los temas del principio («familias con hijos: enseñanza, leche, pañales… solo lo que tenga serie INE», `research/04-balance-2018-2026.md`).
Datos: `scripts/calcular_t28.py` → `data/clean/t28_bebe.json`. Crudos en `data/raw/t28/`.

| Dato | 2007 | 2013 (crisis) | 2016 | 2019 | 2025 | Fuente | Estado |
|---|---|---|---|---|---|---|---|
| Guardería (0-3 años): gasto medio de los hogares que la pagan | — | — | 1.603 € | 1.905 € | **1.675 €** | INE, EPF, tabla 73827 (empieza en 2016) | V |
| … en horas del sueldo neto mediano | — | — | 156 h | 176 h | **129 h** | Cálculo | C |
| IPC «Alimentos para bebé» (media anual, 2025 = 100) | 74,7 | 79,2 | 77,4 | 76,5 | 100 | INE, IPC, tabla 79184 | V |
| … en tiempo de trabajo, hoy frente a cada año | −9,4 % | −3,7 % | +2,2 % | +9,2 % | — | Cálculo (precio / sueldo neto mediano por hora) | C |
| Hijos por mujer | 1,38 | 1,27 | 1,33 | 1,23 | **1,11** | INE, tabla 1407 | V |
| Nacimientos por cada mil habitantes | 10,86 | 9,11 | 8,80 | 7,62 | 6,50 | INE, tabla 1381 | V |
| Sueldo neto mediano por hora | 8,79 € | 9,90 € | 10,27 € | 10,85 € | 12,98 € | INE (EAES y ETCL), método de T1 | C |

## Veredicto
- **Guardería, en horas: mejora frente a 2016 (156 → 129) y 2019 (176).** (No hay dato oficial anterior a 2016 con esta tabla.)
- **Leche infantil y potitos, en tiempo de trabajo: mejora frente a 2007 (−9 %) y la crisis (−4 %); empeora frente a 2016 (+2 %) y 2019 (+9 %).**
- **Y aun así, menos hijos:** de 1,38 por mujer (2007) a 1,11 (2025).

## Qué no se puede decir
- Por qué baja la natalidad ni por qué baja el gasto en guardería (plazas gratuitas, ayudas…): sin causas ni partidos.
- Un precio concreto de un bote de leche o de unos pañales: no hay precio oficial por producto; se usa el IPC.
- Pañales: el IPC no los separa (van con otros artículos); no entran.
- Lo que cuesta la guardería a cada familia: es la media de los hogares que la pagan (el 2-3 %); quien tiene plaza gratuita no cuenta.
