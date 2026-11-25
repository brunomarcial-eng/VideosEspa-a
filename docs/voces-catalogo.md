# Catálogo de voces y reparto (Bruno, 21-11-2026)

**Decisión de Bruno (21-11-2026):** no se hacen más castings ni se buscan voces nuevas. Para cada vídeo se reutilizan las voces que ya eligió, alternándolas de un vídeo a otro para que cada uno suene distinto. Cualquier voz del catálogo vale para cualquier vídeo y cualquier papel que le encaje por sexo, edad y carácter. Bruno ya no tiene que elegir voces: solo escucha el vídeo terminado.

Todas son Qwen3-TTS en local (Apache-2.0), gratis y en español de España. Cada una está fijada clonando su toma de referencia (`diseno/voces/ref-*.wav`), así que suena igual en todos los vídeos.

## Las voces

| Clave (`voz`) | Sexo y edad que aparenta | Cómo suena | Le van papeles de… | Usada en |
|---|---|---|---|---|
| `hombre` | hombre, unos 40 | clara y neutra, de narrador; timbre de una grabación CC0 (Piper/Nabu Casa) | narrador, padre de familia, vecino, cliente, trabajador | T1 (narrador), T2 (narrador), T9 (vuelve), T12 (padre), T25 (cliente) |
| `padre` | hombre, unos 60 | profunda y pausada, seria, de padre de los de antes; algo sarcástica | padre o abuelo, jubilado, paciente mayor, tendero veterano | T3 (padre), T4 (padre), T5 (padre), T6 (padre), T7 (padre), T8 (padre), T11 (paciente), T15 (abuelo), T18 (luis), T22 (abuelo) |
| `hijo` | hombre, unos 30 | joven y natural | hijo, joven trabajador, enfermero, autónomo que empieza, inquilino | T3 (hijo), T4 (hijo), T5 (hijo), T6 (hijo), T7 (hijo), T8 (hijo), T9 (quedo), T10 (nuevo), T11 (enfermero), T17 (hijo), T21 (hermano) |
| `profesora` (voz de hombre) | hombre, unos 45 | clara, cercana y firme | profesor, funcionario, técnico, médico, jefe | T12 (profesora), T15 (tendero), T16 (vendedor), T23 (técnico de la caldera) |
| `comandante` | hombre, unos 55 | grave, tranquila y segura, de anuncio | piloto, directivo, juez de paz, presentador de un aviso, abuelo sereno | T13 (comandante), T17 (padre), T19 (padre), T26 (padre) |
| `maquinista` | hombre, unos 45 | llana y campechana, de trabajador de toda la vida | maquinista, camionero, albañil, mecánico, carnicero, taxista | T13 (maquinista), T18 (javi), T24 (padre) |
| `alumno` | chico, 15 | adolescente, algo grave para su edad, tímido y sincero | alumno, nieto, hijo adolescente | T12 (alumno), T14 (hijo), T24 (hijo) |
| `viajera` | mujer, unos 35 | natural y cercana, con chispa irónica | viajera, inquilina, madre joven, dependienta, autónoma, opositora | T13 (viajera), T16 (clienta), T19 (hija), T22 (nieta), T26 (hija) |
| `medica` | mujer, unos 45 | firme, directa y algo grave, con autoridad | médica, profesora, abogada, jefa, madre | T11 (medica), T14 (madre), T15 (madre), T21 (hermana), T25 (gestora) |
| `hostelera` | mujer, unos 62 | grave y pausada, de veterana que lo ha visto todo; cariñosa y sin pelos en la lengua | hostelera, abuela, jubilada, vecina mayor, comerciante | T10 (veterana), T14 (tendera), T23 (vecina, con `edad.vecina` un 2 % más grave y más lenta) |

**Ojo con la edad:** `hostelera` no vale para una abuela de unos 75: a Bruno le sonó demasiado joven (T15, 23-11-2026). En T15 la abuela pasó a ser un abuelo con `padre` (con `edad.abuelo` un 3 % más grave y más lento).

**Fuera del reparto:** `secundario` (la voz 5 del casting de T2, con un acento que a Bruno le sonó «ruso»: solo si él la pide para algo puntual) y `piper_hombre` / `piper_mujer` (motores de reserva, no elegidos de oído).

## Cómo se reparte en cada vídeo
1. **Primero el papel, después la voz.** Para cada personaje se buscan en la tabla las voces del mismo sexo y una edad parecida (±10 años) a las que les vaya el carácter.
2. **Se alterna.** Entre las que encajan, se coge la que lleva más tiempo sin salir (`python3 scripts/reparto_voces.py` lo dice). La misma voz no protagoniza dos vídeos seguidos si hay otra que encaje.
3. **Contraste dentro del vídeo.** Las voces de un mismo vídeo tienen que distinguirse a la primera, como el comandante y el maquinista en T13: grave y pausada frente a llana y campechana. Dos hombres de edad parecida, nunca con la misma voz.
4. **El personaje es nuevo aunque la voz se repita.** Cambian el nombre, la ropa, el oficio y el decorado; la voz es el actor que hace otro papel.
5. **En el guion**, cada personaje dice qué voz usa: `"personajes": {"camionero": {"anyo": "unos 50 años", "voz": "maquinista"}}`. (Los guiones antiguos usan `"genero"` con el mismo significado; `scripts/voces.py` acepta las dos.)
6. **Ajuste fino sin voces nuevas:** si hace falta que una voz suene un poco más mayor o más joven, se toca `edad.<personaje>` en `diseno/voces.json` (`tono` ±3 %, `velocidad` ±3 %). Nada más.
7. **Si un papel no encaja con ninguna voz** (una niña pequeña, por ejemplo), se reescribe el papel o lo dice otro personaje; no se hace casting.
8. Se apunta en esta tabla («Usada en») cada vídeo nuevo.
9. **Entonación (Bruno, 23-11-2026: voces «sintéticas, monótonas y sin personalidad»):** el texto se escribe con la skill `clon-bruno` (muletillas, ironía, preguntas y exclamaciones), y en `voz_pausas` del guion `"viveza_tomas": 3` hace que `scripts/voces.py` busque tres tomas buenas de cada línea y se quede con la de más variación de tono (desviación del tono en semitonos, en `voz-registro.txt`). Cada línea puede llevar además `"actuacion": {"velocidad": 1.03}` (±3 %) para que no todas vayan al mismo ritmo.
