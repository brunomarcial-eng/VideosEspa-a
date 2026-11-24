# T25 · ¿En qué tramo de sueldo estás tú? · Paso 1: datos (24-11-2026)

Bruno, 24-11-2026: «Todos. 4 vídeos… Ponte con ellos uno por uno». El primero, los tramos de sueldo que propuso al principio (menos de 14.000, 14.000-30.000, 30.000-50.000, 50.000-80.000, 80.000-120.000 y más de 120.000 €).
Datos: `scripts/calcular_t25.py` → `data/clean/t25_tramos.json`. Crudos en `data/raw/t25/` (páginas de la Agencia Tributaria guardadas).

| Dato | Valor | Año | Fuente oficial | Consultado | Estado |
|---|---|---|---|---|---|
| Asalariados por tramos de salario (en veces el SMI) | 21.139.690 asalariados; SMI 16.576 € al año | 2025 | Agencia Tributaria, «Mercado de trabajo y pensiones en las fuentes tributarias», asalariados por tramos de salario, edad y sexo | 24-11-2026 | V |
| Lo mismo | 2007, 2013, 2016, 2019 y 2024 | | Agencia Tributaria, misma publicación de cada año | 24-11-2026 | V |
| Salario medio anual (salarios / asalariados) | 18.087 € · 18.505 € · 18.835 € · 20.566 € · **25.830 €** | 2007 · 2013 · 2016 · 2019 · 2025 | Agencia Tributaria | 24-11-2026 | V |
| IPC general, media anual | 70,105 · 79,401 · 78,725 · 81,609 · 100,0 | 2007 · 2013 · 2016 · 2019 · 2025 | INE, tabla 24077 | 24-11-2026 | V |

## Tramos de 2025 (casi los de Bruno)
Hacienda los da en veces el salario mínimo de cada año (en 2025, 16.576 € al año). Asalariado: todo el que cobró algún sueldo en el año, también a tiempo parcial o solo unos meses (por eso el tramo de abajo es tan grande).

| Tramo (veces el SMI) | En euros de 2025 | Asalariados | % |
|---|---|---|---|
| Menos de 1 | menos de 16.576 € | 7.834.599 | **37,1 %** |
| De 1 a 2 | 16.576-33.152 € | 8.017.866 | **37,9 %** |
| De 2 a 3 | 33.152-49.728 € | 3.167.168 | **15,0 %** |
| De 3 a 5 | 49.728-82.880 € | 1.599.307 | **7,6 %** |
| De 5 a 7,5 | 82.880-124.320 € | 368.681 | **1,7 %** |
| Más de 7,5 | más de 124.320 € | 152.069 | **0,7 %** |

Tres de cada cuatro cobran menos de 33.152 €. Más de 6 de cada 10 (al menos el 60,9 %) cobran menos que el salario medio (25.830 €).

## El sueldo medio en euros de 2025 (C)
| 2007 | 2013 (crisis) | 2016 | 2019 | 2025 |
|---|---|---|---|---|
| 25.799 € | 23.305 € | 23.926 € | 25.026 € | **25.830 €** |

## Veredicto
- **Igual que en 2007** (+0,1 % en euros de hoy): dieciocho años después, el sueldo medio compra lo mismo.
- **Mejora frente a la crisis (+11 %), 2016 (+8 %) y 2019 (+3,2 %).**
- La media engaña: la suben los pocos que ganan mucho; más de 6 de cada 10 cobran menos.

## Qué no se puede decir
- Comparar los tramos de un año con otro: van en veces el salario mínimo, que ha subido mucho más que los precios (2019, +22 %). El vídeo compara solo el sueldo medio en euros de hoy.
- «Clase media»: no hay definición oficial con tramos; la frase es del personaje.
- Que «la mayoría cobra menos de 16.000 €»: es el 37 %, y cuenta a quien trabajó a tiempo parcial o unos meses (se dice en voz y en pantalla).
- Por qué los sueldos no han subido más que los precios: sin causas ni partidos.
