# T22 · Notas de edición (archivo por si hay apelación)

**Vídeo:** «¿Quién cobra más: un jubilado o un joven que trabaja?» · Short vertical 1080×1920, 69,8 s, −14,1 LUFS (v1).
**Fichero:** `videos/t22/render/t22-limpio.mp4` · SHA-256 `2111b40743aca6d5a51f32cbbf45dd61fa32abc5e6aa51f1788735588205dc7f`.
**Aprobación:** el responsable del canal eligió el tema el 24-11-2026 («pensión frente a sueldo joven», entre pensiones, calefacción y matrícula). v1 pendiente de su visto bueno.

## Cómo se hizo
- **Guion:** un abuelo jubilado y su nieta, inventados, en un banco del parque; hablan con la forma de hablar del responsable del canal (skill `clon-bruno`). El abuelo cree que cobra la mitad que su nieta; ella lo comprueba. El abuelo dice que desde 2016 está igual, y es verdad (81 %): la conclusión cambia con el año base y se dice. Acaba con una pregunta («¿Y en tu casa quién llega mejor a fin de mes?»). No da causas (revalorizaciones, crisis, mercado laboral) ni nombra partidos ni marcas.
- **Cifras, todo en bruto:** pensión media de jubilación de todo el sistema de la Seguridad Social × 14 pagas: 2007, 2013, 2016 y 2018, medias anuales del INE (Anuario Estadístico de España, tabla 7.3.5, con datos del Ministerio de Trabajo); 2024, pensiones en vigor a 31 de diciembre (Seguridad Social; la media del año sería un 0,7 % menor, se dice en la descripción). Sueldo: salario medio bruto anual de 25 a 34 años (INE, Encuesta Anual de Estructura Salarial, tabla 28201; 2024 es el último año publicado); 2007, estimado con EAES 2008 × ETCL 2007/2008, como en T1. IPC del INE para los euros de hoy. Script: `scripts/calcular_t22.py`; detalle en `guion.md`, `paso-1-datos.md` y `t22_pension_joven.json`.
- **Años:** 2007, 2013 (la crisis), 2016, 2018 (el último PDF del Anuario del INE llega a 2018; la regla del canal admite 2018-2019) y hoy (2024).
- **Redondeos dichos en voz:** «más de 25.000» (25.103 €), «unos 20.000» (20.313 €), «poco más de la mitad» (58 %), «más de un tercio» (+37,4 %), «lo mismo que en 2007» (−1,4 %).
- **Lo que no entra:** la comparación en neto (el pensionista no paga cotizaciones y el joven sí; el IRPF depende de cada caso), la pensión de los que se jubilan ahora y cualquier causa.
- **Acceso:** para buscar la serie histórica de pensiones se añadió al entorno w6.seg-social.es (PX-Web de la Seguridad Social); no tenía pensiones, y la serie salió de los Anuarios del INE.
- **Ficheros originales:** `datos-crudos/`, con enlace, fecha y huella SHA-256 en `datos-crudos/MANIFEST.csv`.
- **Imagen:** dibujada con código (`escenas.mjs` y `diseno/pension.mjs`): un parque de barrio en perspectiva (bancos, farolas, palomas que picotean), la carta de la pensión, catorce sobres (doce meses y dos pagas extra), dos montones de billetes, columnas de la pensión en % del sueldo joven, barras de subidas y dos carros de la compra. El periódico del abuelo no se usa: nada pegado a la mano.
- **Voces:** Qwen3-TTS en local, del catálogo del canal: el abuelo con «padre» (ajuste de edad «abuelo») y la nieta con «viajera». Tres tomas buenas por línea y se elige la de más entonación; cada toma se revisa con Whisper (`voz-registro.txt`).
- **Música, efectos y ambiente:** generados con código (`scripts/sonido.py`, ambiente «barrio»: pájaros, un coche lejos y una bici), con sonidos sueltos y sin ruido continuo. Contenido sintético: sí.
