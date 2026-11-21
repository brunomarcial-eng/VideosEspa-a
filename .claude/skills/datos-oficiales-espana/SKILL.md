---
name: datos-oficiales-espana
description: Investiga y verifica datos de España (economía, empleo, precios, vivienda, inmigración, presupuestos) solo con fuentes oficiales, y devuelve una tabla con año, fuente, enlace y estado de verificación. Úsala para guiones de Vídeos España o cualquier cifra que vaya a publicarse.
---

# Investigador de datos oficiales de España

Objetivo: que cada cifra de un vídeo se pueda comprobar. Si no hay fuente oficial, se dice; nunca se rellena con prensa.

## Fuentes permitidas (orden de preferencia)

| Tema | Fuente primaria |
|---|---|
| Población, salarios, IPC, EPA, condiciones de vida | INE (API: `https://servicios.ine.es/wstempus/js/ES/DATOS_TABLA/<id_tabla>?nult=<n>`; buscar el id en ine.es) |
| Comparativa UE (PIB pc, empleo, pobreza) | Eurostat (API: `https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/<dataset>?format=JSON&geo=ES`) |
| Presupuestos, ejecución, deuda | Hacienda, IGAE, Banco de España, BOE |
| Salarios por tramos, IRPF, recaudación | AEAT (estadísticas y ficheros descargables) |
| Vivienda y crédito | Banco de España, INE, Ministerio de Vivienda |
| Inmigración | INE (población), Interior (llegadas irregulares, balances), Inclusión (regularización) |
| Sentencias y autos | poderjudicial.es, BOE |
| Gasto público en educación y sanidad | Ministerios, OCDE |

No son fuentes: prensa, think tanks, sindicatos, partidos, redes. Sirven de pista para localizar la tabla oficial, nunca de dato. Si un dato solo se localiza en prensa, se marca `(P)` y se pide abrir el original.

## Procedimiento

1. Traducir la pregunta a indicadores concretos y a su tabla oficial. Si no existe serie oficial (café, extraescolares, colegio privado concreto), decirlo y no inventar.
2. Descargar la serie completa 2010-hoy desde la API o el fichero oficial. Guardar el fichero crudo y la fecha de consulta.
3. **Excluir 2020** de cualquier comparación. Marcar 2021 como "año de rebote". El usuario puede pedir cualquier año base entre 2010 y 2022 salvo 2020.
4. Por cada indicador, mostrar al menos tres años base (p. ej. 2010, 2015, 2019) y avisar si la conclusión cambia con el año. No elegir el año más favorable a una tesis.
5. Separar siempre: nominal y real (IPC), bruto y neto, media y mediana, número absoluto y tasa, relativo y absoluto (pobreza).
6. Los cálculos propios se marcan `(C)` con la fórmula.
7. Para dinero al exterior: separar donación, préstamo reembolsable y contrato financiado por terceros.
8. Para casos judiciales: usar el semáforo (S sentencia firme, R recurrible, J juicio oral, I investigación, T testigo, ? sin resolución) y no nombrar a nadie sin resolución.

## Formato de salida

Tabla con estas columnas:

| Dato | Valor | Año | Fuente oficial (enlace) | Consultado | Estado |
|---|---|---|---|---|---|

Estado: `V` leído en la fuente oficial, `P` solo en prensa, `C` cálculo propio, `X` sin serie oficial.

Debajo: (a) qué se puede decir, (b) qué no se puede decir, (c) qué cambia con otro año base, (d) qué datos faltan y dónde bajarlos.

## Reglas

- Si el entorno no puede abrir una web (INE, Hacienda, AEAT bloquean a veces), decirlo y pedir al usuario que descargue el fichero; no completar de memoria.
- Nada de causas sin evidencia: separar correlación (datos) de atribución (opinión), y poner la opinión en un bloque aparte con su contraargumento.
- Las cifras del Gobierno, de partidos y de la oposición se citan como declaraciones y se contrastan con la serie oficial.
- Tratar a todos los partidos con la misma vara.
