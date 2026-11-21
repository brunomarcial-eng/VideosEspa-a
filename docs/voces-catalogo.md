# Catálogo de voces y reparto (Bruno, 21-11-2026)

**Decisión de Bruno (21-11-2026):** no se hacen más castings ni se buscan voces nuevas. Para cada vídeo se reutilizan las voces que ya eligió, alternándolas de un vídeo a otro para que cada uno suene distinto. Cualquier voz del catálogo vale para cualquier vídeo y cualquier papel que le encaje por sexo, edad y carácter. Bruno ya no tiene que elegir voces: solo escucha el vídeo terminado.

Todas son Qwen3-TTS en local (Apache-2.0), gratis y en español de España. Cada una está fijada clonando su toma de referencia (`diseno/voces/ref-*.wav`), así que suena igual en todos los vídeos.

## Las voces

| Clave (`voz`) | Sexo y edad que aparenta | Cómo suena | Le van papeles de… | Usada en |
|---|---|---|---|---|
| `hombre` | hombre, unos 40 | clara y neutra, de narrador; timbre de una grabación CC0 (Piper/Nabu Casa) | narrador, padre de familia, vecino, cliente, trabajador | T1, T2 (narrador), T9 (el que vuelve), T12 (padre) |
| `padre` | hombre, unos 60 | profunda y pausada, seria, de padre de los de antes; algo sarcástica | padre o abuelo, jubilado, paciente mayor, tendero veterano | T3-T8 (padre), T11 (paciente) |
| `hijo` | hombre, unos 30 | joven y natural | hijo, joven trabajador, enfermero, autónomo que empieza, inquilino | T3-T8 (hijo), T9 (el que se quedó), T10 (el nuevo), T11 (enfermero) |
| `profesora` (voz de hombre) | hombre, unos 45 | clara, cercana y firme | profesor, funcionario, técnico, médico, jefe | T12 (tutor) |
| `comandante` | hombre, unos 55 | grave, tranquila y segura, de anuncio | piloto, directivo, juez de paz, presentador de un aviso, abuelo sereno | T13 (comandante) |
| `maquinista` | hombre, unos 45 | llana y campechana, de trabajador de toda la vida | maquinista, camionero, albañil, mecánico, carnicero, taxista | T13 (maquinista) |
| `alumno` | chico, 15 | adolescente, algo grave para su edad, tímido y sincero | alumno, nieto, hijo adolescente | T12 (alumno) |
| `viajera` | mujer, unos 35 | natural y cercana, con chispa irónica | viajera, inquilina, madre joven, dependienta, autónoma, opositora | T13 (viajera) |
| `medica` | mujer, unos 45 | firme, directa y algo grave, con autoridad | médica, profesora, abogada, jefa, madre | T11 (médica) |
| `hostelera` | mujer, unos 62 | grave y pausada, de veterana que lo ha visto todo; cariñosa y sin pelos en la lengua | hostelera, abuela, jubilada, vecina mayor, comerciante | T10 (hostelera veterana) |

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
