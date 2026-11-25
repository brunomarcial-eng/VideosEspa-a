# Agentes y pipeline

## Estructura del repo
```
cuanto-vale-tu-hora/
├─ CLAUDE.md
├─ .claude/skills/datos-oficiales-espana/SKILL.md
├─ agents/            # un .md por agente
├─ data/raw/          # ficheros crudos descargados (INE, Eurostat, etc.)
├─ data/clean/        # JSON por vídeo
├─ scripts/           # descarga y cálculo de series, cálculo de horas
├─ videos/<id>/       # guion, plano a plano, renders
├─ archive/<id>/      # guion, fuentes, notas (por si hay apelación)
├─ archive/style-A|B|C/  # biblias de estilo y referencias
└─ upload/            # ficha de subida (título, descripción, miniatura, etiquetas)
```

## Agentes
| Agente | Entrada | Salida | Para y pide aprobación |
|---|---|---|---|
| **Investigador de datos** | Pregunta del vídeo | Tabla de datos (estado V/C), ficheros crudos, qué cambia con otro año | Sí: aprobar tabla |
| **Guionista** | Tabla aprobada | Guion y plano a plano, con frases propias y cierre mejora/empeora/depende | Sí: aprobar guion |
| **Verificador** | Guion + datos | Informe: cada cifra contra su fichero; fallo si hay P o X | No (bloquea si falla) |
| **Director visual** | Guion + biblia de estilo | Lista de planos, gráficos (código) e ilustraciones | Sí: biblia y primer render |
| **Productor** | Planos | Vídeo (voz sintética, gráficos, subtítulos, miniatura) | No |
| **Cumplimiento** | Vídeo + guion | Checklist: neutralidad, originalidad, anonimato, copia, etiqueta de contenido sintético | No (bloquea si falla) |
| **Ficha de subida** | Vídeo aprobado | Título, descripción con fuentes, etiquetas, fecha y hora | No |
| **Analista** | Métricas semanales | Informe y ajuste del backlog; resultados del test | No |

## Flujo por vídeo
datos → aprobar → guion → aprobar → verificar → planos y biblia → primer render → aprobar → producción → cumplimiento → ficha → subida manual programada → análisis.

## Herramientas
- Gráficos: HTML/SVG renderizado con Chromium + ffmpeg (todo gratuito).
- Voz sintética: modelos libres y gratuitos en local (Kokoro, Piper); nunca un servicio de pago ni clonar la voz de Bruno.
- Ilustraciones y personajes: dibujados con código (ver `docs/produccion.md`). Nada de generadores de imagen de pago.
- Subida: Studio manual y, tras auditoría, YouTube Data API con `publishAt`.

## Controles anti-masa
- Máximo 2 largos y 5 Shorts por semana al arrancar.
- Cada guion se escribe desde cero con su tabla de datos; prohibido reutilizar estructuras con huecos.
- Si un vídeo se parece mucho a otro (mismo guion con cifras cambiadas), Cumplimiento lo bloquea.
