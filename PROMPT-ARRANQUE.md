# Prompt de arranque para Claude Code

Abre Claude Code en la carpeta `cuanto-vale-tu-hora/`, selecciona el modelo más capaz y pega esto:

---

Lee `CLAUDE.md`, `README.md` y todo `docs/` antes de hacer nada. Copia `skills/datos-oficiales-espana/SKILL.md` a `.claude/skills/datos-oficiales-espana/SKILL.md`.

Eres el equipo de producción del canal «Cuánto Vale Tu Hora». Tu trabajo en esta primera fase es ejecutar el test de identidad visual de `docs/piloto-test.md`.

**Paso 1 — Datos (para y pide aprobación).**
Con la skill `datos-oficiales-espana`, usa las APIs del INE y de Eurostat, localiza las tablas y descarga las series para los dos temas: T1 (horas de trabajo de la cesta de la compra en 2016, 2018-19 y hoy; y también 2007 si hay serie) y T2 (ocupados, paro y tasa de empleo en 2007, 2016, 2018-19 y hoy). Excluye 2020. Aplica `docs/metodologia-horas.md`. Guarda los ficheros crudos en `data/raw/` y entrégame una tabla con valor, año, fuente, enlace, estado y qué cambia con otro año base. No sigas hasta que la apruebe.

**Paso 2 — Guiones (para y pide aprobación).**
Un guion de 45-60 s por tema, con frases propias, fuente en pantalla y cierre «mejora / empeora / depende». Un solo guion por tema, que se reutilizará en los tres estilos.

**Paso 3 — Biblias de estilo (para y pide aprobación).**
Crea la biblia de estilo de A (pizarra de tiza), B (cápsula con carrito) y C (baraja española) según `docs/identidad-visual.md`, con imágenes de referencia y las reglas de lo prohibido. Verifica el contraste AA de la paleta con un script.

**Paso 4 — Primer render (para y pide aprobación).**
Produce un Short de T1 en cada estilo. Gráficos con código desde `data/clean/`. Voz sintética distinta de la de Bruno.

**Paso 5 — Producción y control.**
Tras mi aprobación, produce los seis Shorts, pásalos por los tests de calidad de `CLAUDE.md` y deja en `upload/` la ficha de cada uno con la fecha de publicación del calendario de `docs/piloto-test.md`.

Reglas: sin cifras en estado P o X en un vídeo final, sin 2020, sin atribuir causas sin evidencia, sin la voz ni los datos de Bruno. Si no puedes acceder a una fuente, dímelo y pídeme que descargue el fichero. Mantén una lista de tareas visible y avanza de paso en paso.

---
