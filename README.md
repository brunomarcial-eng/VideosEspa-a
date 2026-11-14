# Cuánto Vale Tu Hora — paquete de traspaso a Claude Code

Fecha: 2026-11-09. Preparado en el chat; la construcción continúa en Claude Code.

## Idea en una frase
Medir España en **tiempo**: ¿cuántas horas de trabajo cuesta una cesta, un alquiler, una casa? ¿Cuántos días hay que esperar para una operación o una cita? Y compararlo con 2007, 2016 y 2018-19. Todo con datos oficiales.

## Decisiones tomadas
| Tema | Decisión |
|---|---|
| Serie | Primero la comparativa de España (la más objetiva y menos política). Los casos judiciales van aparte |
| Nombre | «Cuánto Vale Tu Hora» (provisional) |
| Marca propia | La **hora** como unidad: horas de trabajo y días de espera, siempre separadas |
| Formato | 2 vídeos largos por semana (8-10 min) + 3-5 Shorts derivados. Los Shorts atraen a los largos |
| Identidad visual | Se decide con un test: 3 estilos × 2 temas = 6 Shorts (`docs/piloto-test.md`) |
| Estilos del test | A) Pizarra de tiza (Draw My Life) · B) Cápsula del tiempo con carrito · C) Baraja española |
| Sistema común | Ocre = pasado, azul = hoy; sello «DATO OFICIAL»; gráficos por código |
| Descartado | Edificio de vecinos (parece sitcom), tertulia (parece política), rojo/azul de partido |
| Voz | Sintética y distinta de la de Bruno |
| Subida | Manual en Studio con publicación programada hasta pasar la auditoría de la API |

## Contenido
- `CLAUDE.md`: reglas del proyecto (léelo primero).
- `PROMPT-ARRANQUE.md`: el prompt para empezar.
- `docs/`: identidad visual, metodología de horas, backlog, test, agentes, pasos humanos.
- `skills/datos-oficiales-espana/SKILL.md`: copiar a `.claude/skills/datos-oficiales-espana/`.
- `research/`: investigación previa (casos, recaudación, balance 2018-2026, identidad).

## Límites que conviene saber
- El equipo de investigación del chat no pudo leer INE, Hacienda ni AEAT. Todas las cifras de `research/` con (P) son de prensa y hay que contrastarlas en la fuente.
- No he podido comprobar que el nombre esté libre en YouTube.
- Los identificadores de las tablas del INE no están fijados: Code los localiza en la primera ejecución.
