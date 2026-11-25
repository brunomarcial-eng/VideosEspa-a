# T26 · ¿Somos más ricos o más pobres que los europeos? · Paso 1: datos (25-11-2026)

Bruno, 24-11-2026: «Todos. 4 vídeos… Ponte con ellos uno por uno»; el segundo de los temas del principio («Posición europea: PIB total frente a PIB por persona», `research/04-balance-2018-2026.md`, que entonces solo tenía cifras de prensa).
Datos: `scripts/calcular_t26.py` → `data/clean/t26_europa.json`. Crudos en `data/raw/t26/`.

| Dato | Valor | Año | Fuente oficial | Consultado | Estado |
|---|---|---|---|---|---|
| PIB por habitante en paridad de poder adquisitivo, índice (UE-27 = 100), España | 104 · 90 · 92 · 91 · **92** | 2007 · 2013 · 2016 · 2019 · 2024 | Eurostat, prc_ppp_ind (VI_PPS_EU27_2020_HAB, GDP) | 25-11-2026 | V |
| Lo mismo, 2025 | 92 | 2025 | Eurostat, tec00114 | 24-11-2026 | V |
| Otros países, 2007 → 2024 | Alemania 120 → 115 · Francia 109 → 99 · Italia 109 → 98 · Portugal 82 → 82 · Polonia 54 → 79 · Chequia 84 → 91 · Grecia 92 → 70 | | Eurostat, prc_ppp_ind | 25-11-2026 | V |
| Puesto de España entre los 27 por PIB por habitante en PPA | 13.º · 13.º · 13.º · 15.º · **14.º** | 2007 · 2013 · 2016 · 2019 · 2024 | Ordenando el índice de Eurostat (empates en contra de España) | 25-11-2026 | C |
| PIB total a precios corrientes | 4.ª de la UE (1.690.012 millones de euros en 2025; 4.ª también en 2007 y 2024) | 2025 | Eurostat, nama_10_gdp | 25-11-2026 | V |
| Consumo individual efectivo por habitante en PPA (contraste) | 102 → 92 | 2007 → 2024 | Eurostat, prc_ppp_ind (A01) | 25-11-2026 | V |

## Veredicto
- **Empeora frente a 2007:** del 104 (un 4 % por encima de la media de la UE) al 92 (un 8 % por debajo).
- **Igual frente a 2016 (92) y casi igual frente a 2019 (91); algo mejor que en plena crisis (90).**
- Otros países han subido por persona: Polonia del 54 al 79 y Chequia del 84 al 91 (casi como España).
- Es la 4.ª economía de la UE por tamaño, pero la 14.ª de 27 por persona.

## Qué no se puede decir
- Por qué (población, productividad, crisis, gobiernos…): sin causas ni partidos.
- Que Chequia «ya nos ha pasado»: en 2024 está en 91 y España en 92 (en 2019 sí estaba por delante: 95 frente a 91).
- «Se vive mejor» como dato: el índice mide producción por persona ajustada a precios; la pregunta queda para el espectador.
