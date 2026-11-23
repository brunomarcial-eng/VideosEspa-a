# T19 · Lotería de Navidad: ¿cuántos años de curro te quita el Gordo? · Paso 1: datos (23-11-2026)

Tema elegido por Bruno el 23-11-2026. Pregunta: el décimo cuesta 20 € desde 2002; ¿el Gordo te «compra» hoy más o menos años de trabajo que en 2007, 2016 y 2019? ¿Y cuánto se queda Hacienda?

| Dato | Valor | Año | Fuente oficial | Consultado | Estado |
|---|---|---|---|---|---|
| Precio del décimo | 20 € (billete de 200 € en 10 décimos) | 2007 | BOE-A-2007-21550, programa de premios del sorteo del 22-12-2007 (`data/raw/t19/`) | 23-11-2026 | V |
| Primer premio (el Gordo) | 3.000.000 € por serie = **300.000 € por décimo** | 2007 | BOE-A-2007-21550 | 23-11-2026 | V |
| Números por serie | 85.000 (del 00000 al 84999) | 2007 | BOE-A-2007-21550 | 23-11-2026 | V |
| Primer premio | 4.000.000 € por serie = **400.000 € por décimo**; 100.000 números | 2016, 2019, 2025 | Solo en la web de Loterías y Apuestas del Estado (SELAE). El BOE dejó de publicar los programas en 2011 | — | **P (falta el oficial)** |
| Gravamen especial sobre premios | Desde el 1-1-2013, 20 % de lo que pase de la parte exenta | 2013- | AEAT, análisis del 26-2-2026 y nota del 15-12-2025; Ley 35/2006 del IRPF, DA 33.ª (BOE) | 23-11-2026 | V |
| Parte exenta por décimo | 2.500 € (2013-2017); 10.000 € (desde el 5-7-2018); 20.000 € (2019); 40.000 € (2020-hoy) | | AEAT; Ley 35/2006, DA 33.ª y DT 35.ª (BOE) | 23-11-2026 | V |
| Premios de lotería en 2007 | Sin gravamen (en vigor desde 2013) | 2007 | AEAT | 23-11-2026 | V |
| IPC general, media anual (base 2025) | 70,105 (2007) · 78,725 (2016) · 82,18 (2019) · 100 (2025) | | INE, tabla 24077 (`data/raw/ine_24077_ipc_desde_1961.json`) | 23-11-2026 | V |
| Sueldo neto mediano al año | 14.220 € (2007) · 15.987 € (2016) · 16.704 € (2019) · 20.424 € (2025) | | INE (EAES) y Eurostat, de T16 (`data/clean/t16_coche.json`) | 22-11-2026 | C |
| Sueldo neto mediano por hora | 10,27 € (2016) · 10,85 € (2019) · 12,98 € (2025) | | INE, de T14 | 22-11-2026 | C |

## Cálculos (C), si se confirma el premio de 400.000 € por décimo
| | 2007 | 2016 | 2019 | 2025 |
|---|---|---|---|---|
| Gordo por décimo | 300.000 € | 400.000 € | 400.000 € | 400.000 € |
| Hacienda se queda | 0 € | 79.500 € | 76.000 € | 72.000 € |
| Te queda | 300.000 € | 320.500 € | 324.000 € | 328.000 € |
| En euros de 2025 (IPC) | 427.900 € | 407.100 € | 394.300 € | 328.000 € |
| **Años de sueldo neto mediano** | **21,1** | **20,0** | **19,4** | **16,1** |
| El décimo, en minutos de trabajo | — | 117 | 111 | 92 |

## Qué se puede decir
- El décimo vale lo mismo (20 €) y cuesta menos tiempo de trabajo que en 2016 y 2019: mejora.
- El Gordo «te quita» menos años de trabajo que en 2007, 2016 y 2019 (21 → 16 años de sueldo neto mediano): empeora. En euros de hoy, lo que te queda vale un 23 % menos que en 2007.
- Hoy Hacienda se queda 72.000 € de cada décimo del Gordo (3,5 años de sueldo neto mediano).

## Qué no se puede decir
- Por qué se creó el gravamen ni quién lo hizo (sin partidos ni causas).
- Que «cuesta más que te toque» sin el dato oficial de los 100.000 números.

## Lo que falta
- **El programa de premios oficial de 2016, 2019 y 2025** (primer premio por serie, precio del billete y números por serie). Está en loteriasyapuestas.es, que bloquea los accesos automáticos (no se ha saltado el bloqueo). Hace falta que Bruno lo baje o haga captura.
