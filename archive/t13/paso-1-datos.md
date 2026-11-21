# T13 · Transporte e infraestructuras, 2016 frente a hoy: lo que pagamos y cómo llegamos (21-11-2026)

**Lo que pide Bruno (21-11-2026):** el tercero de los vídeos de lo que pagamos frente a lo que recibimos. Los protagonistas son los viajeros de avión y de tren, los pilotos, las azafatas, los maquinistas, las carreteras, los peajes y los conductores. Solo 2016 frente a hoy, contundente y con historia.

Datos en `data/clean/t13_infraestructuras.json` (`scripts/calcular_t13.py`). Ficheros oficiales en `data/raw/` (MANIFEST). Bruno autorizó consultar las webs de transporte (EUROCONTROL, CNMC, Adif, Renfe, AENA, DGT…).

## Avión: retrasos por el control del tráfico aéreo (EUROCONTROL)
**Qué se mide:** el retraso ATFM en ruta, es decir, el que se impone a un vuelo porque el espacio aéreo que va a cruzar no admite más tráfico en ese momento. Entidad «Spain» (espacio aéreo español). Se suma de enero a octubre de cada año, porque octubre es el último mes completo de 2026.

| Enero-octubre | 2016 | 2019 | 2025 | **2026** |
|---|---|---|---|---|
| Vuelos | 1.610.948 | 1.854.514 | 2.110.216 | **2.197.877** (+36 % frente a 2016) |
| Vuelos con retraso | 40.500 | 86.181 | 154.770 | **214.522** (×5,3) |
| % de vuelos con retraso | 2,5 % (1 de cada 40) | 4,6 % | 7,3 % | **9,8 % (1 de cada 10)** |
| Minutos de retraso | 721.452 | 1.218.029 | 2.176.589 | **2.800.427** (×3,9) |
| Minutos por vuelo | 0,45 | 0,66 | 1,03 | **1,27** |

En 2026, la fuente atribuye el 76 % de los minutos a la capacidad del control y el 20 % a la meteorología. El vídeo no da causas.

**Fuente:** EUROCONTROL, Performance Review Unit, *En-Route ATFM Delay (FIR)* (Excel diario; extracto de España en `data/raw/eurocontrol_atfm_en_ruta_espana.csv`).

## Tren: puntualidad (CNMC, con datos de Adif)
**«En hora»** = llega con menos de 5 minutos de retraso (Reglamento (UE) 2015/1100).
**Por qué 2019 y no 2016:** la CNMC da la puntualidad de 2019 y de 2024 con la misma definición. No hay serie oficial pública comparable desde 2016: Renfe publicó su informe de calidad hasta 2021, con otra definición y otro universo de trenes. Se dice en pantalla.

| | 2019 | 2024 |
|---|---|---|
| Alta velocidad, rutas con competencia (Madrid con Barcelona, Valencia, Sevilla, Málaga y Alicante; 70.805 trenes, el 67 %) | 94,8 % | **85,8 %** |
| Larga distancia de ancho variable (Madrid-Vigo/A Coruña, Madrid-Gijón, Madrid-Santander, Madrid-Cádiz/Huelva y Barcelona-Valencia; 11.234 trenes) | 74,7 % | **54 %** |

La CNMC da la cifra de 2024 y la diferencia con 2019 (9 y 20,7 puntos); el dato de 2019 sale de restar.

**Contexto que da la propia CNMC:** en 2023 y 2024 hubo más de 500 obras en la red (150 en 2019), y en 2024 circularon un 57 % más de trenes en las rutas con competencia que en 2019. En el primer trimestre de 2026, la alta velocidad perdió un 21 % de viajeros frente al mismo trimestre de 2025 («los cortes de vía, las limitaciones de velocidad y la reducción de circulaciones han condicionado la prestación de los servicios»). Este último dato se quitó del guion para no pasar del minuto y porque compara con 2025, no con 2016; va en la descripción.

**Fuentes:** CNMC, *Balance de la liberalización del transporte de viajeros por ferrocarril* (INF/DTSP/091/25), párrafos 54 y 58. CNMC, informe trimestral de viajeros por ferrocarril, primer trimestre de 2026 (INF/DTSP/038/26).

## Lo que se pone
| | 2016 | Hoy | Cambio |
|---|---|---|---|
| Impuestos y cotizaciones por habitante, en euros de 2025 | 10.492 € | **13.118 €** (2025) | +25,0 % (récord de la serie, descontada la inflación) |
| Gasto público en transporte por habitante, en euros de 2025 (Eurostat COFOG GF0405) | 437 € | **605 €** (2024) | +38,4 % |
| Inversión en vías de tren, millones de euros de 2025 (OCDE/ITF, deflactado con el IPC) | 2.098 | **5.022** (2024) | ×2,4 (×1,98 a los precios constantes del ITF) |

## Lo que no entra (y por qué)
- **Carreteras:** los fallecidos en carretera están casi igual que en 2016 y no hay una serie oficial del estado del firme comparable. Varias autopistas dejaron de cobrar peaje desde 2018: es una mejora, pero no hay una cifra oficial sencilla que ponga en pantalla. El peaje sale como escenario, sin dato.
- **Satisfacción con el tren (CNMC, panel de hogares):** no tiene dato de 2016.

## Veredicto
**Empeora frente a 2016.** Se recauda un 25 % más por habitante (récord) y se gasta un 38 % más en transporte (el doble en vías de tren), pero uno de cada diez vuelos se retrasa por el control del tráfico aéreo (uno de cada cuarenta en 2016) con solo un 36 % más de vuelos, y la puntualidad de la alta velocidad baja del 94,8 % al 85,8 % entre 2019 y 2024 (del 74,7 % al 54 % en las rutas de ancho variable). El vídeo no da causas.
