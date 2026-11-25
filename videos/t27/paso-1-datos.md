# T27 · ¿Hay más pobres que antes? · Paso 1: datos (25-11-2026)

Bruno, 24-11-2026: «Todos. 4 vídeos… Ponte con ellos uno por uno»; el tercero de los temas del principio («pobreza con umbral fijo», `docs/backlog-videos.md`).
Datos: `scripts/calcular_t27.py` → `data/clean/t27_pobreza.json`. Crudos en `data/raw/t27/`. Todo del INE, Encuesta de Condiciones de Vida (ECV, base 2013; la serie empieza en 2008).

| Dato | 2008 | 2013 (crisis) | 2016 | 2019 | 2025 | Tabla | Estado |
|---|---|---|---|---|---|---|---|
| Tasa de riesgo de pobreza con **umbral fijo en 2008** (actualizado con la inflación) | 19,8 % | 28,1 % | 29,2 % | 24,9 % | **17,5 %** (mínimo) | 59962 | V |
| Tasa de riesgo de pobreza con el **umbral de cada año** (60 % de la mediana) | 19,8 % | 20,4 % | 22,3 % | 20,7 % | **19,5 %** | 9958 | V |
| Umbral de pobreza, persona sola (€ al año) | 8.379 | 8.114 | 8.208 | 9.009 | 12.220 | 9964 | V |
| No puede permitirse carne, pollo o pescado al menos cada dos días | 2,2 % | 3,5 % | 2,9 % | 3,8 % | **5,4 %** | 9967 | V |
| No tiene capacidad para afrontar gastos imprevistos | 29,9 % | 42,1 % | 38,7 % | 33,9 % | **36,4 %** | 9967 | V |
| No puede permitirse una semana de vacaciones al año | 36,2 % | 48,0 % | 40,3 % | 33,4 % | 32,2 % | 9967 | V |
| Llega a fin de mes con mucha dificultad | 13,7 % | 18,6 % | 16,6 % | 7,8 % | 8,5 % | 9985 | V |

Ojo con los años: la renta de la ECV es la del año anterior a la entrevista (la pobreza de la ECV 2008 es la de los ingresos de 2007, antes de la crisis); las carencias son del año de la entrevista.

## Veredicto
- **Con la vara de 2008, mejora frente a todos los años:** del 19,8 % (2008), el 28,1 % (crisis), el 29,2 % (2016) y el 24,9 % (2019) al 17,5 %, el mínimo de la serie.
- **Con la vara de cada año, igual que en 2008:** 19,5 % (uno de cada cinco).
- **Lo básico empeora frente a 2008 y 2019:** no poder comer carne o pescado cada dos días, del 2,2 % al 5,4 % (más del doble); no poder pagar un imprevisto, del 29,9 % (2008) y el 33,9 % (2019) al 36,4 %. (Frente a la crisis, el imprevisto mejora: 42,1 %.)
- La conclusión cambia con la medida y se dice: menos pobres en la estadística, más gente que no llega a lo básico.

## Qué no se puede decir
- Por qué (precios, alquileres, sueldos, ayudas): sin causas ni partidos.
- Cuánta gente va a los bancos de alimentos: no hay serie oficial del INE; la madre habla de lo que ve.
- Que «hay más pobres que nunca»: con las dos varas, no.
