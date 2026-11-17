# Plan de arranque de redes (17-11-2026)

Agente de redes. Hoy no se publica nada: aún no hay cuentas de TikTok ni de X ni permisos de API. Fuente de verdad de lo aprobado: `docs/ESTADO.md` de la rama `ccr-03be754b-81ccws`.

## 0. Lo más importante
1. **Aprobados para publicar: T1, T2 y T3.** T4 está hecho pero pendiente de que lo veas; no entra en el calendario.
2. **La API de X no es gratis** para cuentas nuevas: desde febrero de 2026 el plan gratuito está cerrado y publicar se paga por uso (unos 0,015 $ por publicación y 0,20 $ si lleva enlace, según webs de terceros; hay que confirmarlo en la página oficial). Por la regla 9 (solo gratis), **X se publica a mano desde la app**, que es gratis, o se aplaza.
3. **TikTok, a mano hasta pasar la auditoría.** Sin auditoría, la API solo publica en cuentas privadas («solo yo»), y lo publicado así no se vuelve público después. Subir desde la app es gratis y oficial.
4. **YouTube, a mano en Studio** con publicación programada hasta pasar su auditoría (ya estaba previsto).
5. **Nombre de usuario:** en X el máximo son 15 caracteres, así que `@CuantoValeTuHora` (16) no cabe. Propuesta para las tres: **`@valetuhora`**, con el nombre visible «Cuánto Vale Tu Hora».

## 1. Lo que haces tú, en orden

Todo con el **correo del canal**, en el perfil de navegador del canal y sin tu nombre, foto ni teléfono personal donde se pueda evitar.

| # | Paso | Enlace oficial | Notas |
|---|---|---|---|
| 1 | **Elegir el nombre de usuario** (sección 2) | — | Antes de crear nada, para que sea el mismo en las tres |
| 2 | **Crear la cuenta de TikTok** | https://www.tiktok.com/signup | Regístrate con el correo del canal, no con Google ni con tu teléfono. País: España |
| 3 | Verificación en dos pasos en TikTok | En la app: Perfil → ☰ → Ajustes y privacidad → Seguridad → Verificación en dos pasos | Mejor con app de autenticación que con SMS |
| 4 | **Crear la cuenta de X** | https://x.com/i/flow/signup | Con el correo del canal |
| 5 | Verificación en dos pasos en X | https://x.com/settings/account/login_verification | La de SMS en X es de pago (Premium); usa la app de autenticación, que es gratis |
| 6 | **YouTube: Google Cloud y OAuth** | https://console.cloud.google.com/apis/library/youtube.googleapis.com | Ya tienes la guía de clics en `docs/youtube-api-conexion.md` (pasos 3-6). Activa también YouTube Analytics API (para el informe semanal, solo lectura) |
| 7 | **YouTube: pedir la auditoría** | https://support.google.com/youtube/contact/yt_api_form | Borrador listo en `docs/youtube-auditoria-borrador.md`. Tarda semanas: pídela pronto |
| 8 | **TikTok: cuenta de desarrollador y app** | https://developers.tiktok.com/apps | Crea la app con el correo del canal. Añade el producto **Content Posting API** y el permiso `video.publish` (y `user.info.basic`). Guía: https://developers.tiktok.com/doc/content-posting-api-get-started |
| 9 | TikTok: revisión de la app y **auditoría** | https://developers.tiktok.com/doc/content-sharing-guidelines | Pide una web, política de privacidad y condiciones de uso con URL pública. **Ojo al anonimato:** no las publiques en algo con tu nombre (p. ej. un GitHub Pages de tu usuario). Te preparo yo los textos de la solicitud cuando decidas dónde alojarlos |
| 10 | **X: cuenta de desarrollador** | https://developer.x.com | Solo si decides pagar la API. Si no, sáltalo |
| 11 | **X: comprobar el precio oficial** | https://developer.x.com → apartado de precios (Pricing) | Mira si queda algo gratis para publicar. Si pide tarjeta, no sigas: lo llevamos a mano (regla 9) |
| 12 | Etiquetas de contenido sintético | YouTube: casilla en Studio. TikTok: al subir, «Contenido generado por IA» | X: la etiqueta de «cuenta automatizada» obliga a indicar la cuenta que la gestiona; si publicamos a mano no hace falta, y así no se enlaza con ninguna cuenta tuya |
| 13 | AdSense | — | Cuando el canal cumpla los requisitos (ver `docs/setup-humano.md`, paso 7) |

## 2. Nombre de usuario

**Límites:** X, 4-15 caracteres; TikTok, 2-24 (solo minúsculas, números, «_» y «.»); YouTube, 3-30.

| Opción | Caracteres | ¿Cabe en las tres? |
|---|---|---|
| **`valetuhora`** (recomendada) | 10 | Sí |
| `cuantovalehora` | 14 | Sí |
| `horascontadas` | 13 | Sí |
| `precio_del_tiempo` | 17 | No (X) |
| `cuantovaletuhora` | 16 | No (X) |

- **Nombre visible** en las tres: «Cuánto Vale Tu Hora» (cabe: el nombre visible admite más caracteres que el usuario).
- Si el canal de YouTube ya se creó con `@CuantoValeTuHora`, se puede cambiar el handle en Studio a `@valetuhora` para que coincida, o dejarlo y aceptar que X sea distinto. Tú decides.

**Cómo comprobar que está libre (lo válido es el formulario de cada red):**
1. YouTube: Studio → Personalización → Información básica → Handle. Dice al momento si está libre.
2. TikTok: al registrarte, o en Editar perfil → Nombre de usuario. Avisa al momento.
3. X: en el registro, o en https://x.com/settings/screen_name. Avisa al momento.
4. Pista rápida antes de empezar: abrir `youtube.com/@valetuhora`, `tiktok.com/@valetuhora` y `x.com/valetuhora` en una ventana privada. «No existe» no garantiza que esté libre (puede ser una cuenta suspendida o reservada).

Cuando tengas el resultado, crea las tres seguidas el mismo día para que nadie lo coja entre medias.

## 3. Red y secretos del entorno

Los secretos se guardan en los ajustes del entorno (secretos de red), **nunca en el chat ni en el repositorio**. Te los pido uno a uno cuando toque.

| Red | Hosts que hay que permitir | Secretos | Cuándo |
|---|---|---|---|
| YouTube | `oauth2.googleapis.com`, `www.googleapis.com` (subida y Data API v3), `youtube.googleapis.com`, `youtubeanalytics.googleapis.com` | ID y secreto del cliente OAuth y el token de refresco de la cuenta del canal (permisos `youtube.upload`, `youtube.force-ssl` para comentarios y `yt-analytics.readonly`) | Al terminar el paso 6. El entorno «VideosEspa-a» ya permite la API de YouTube; hay que comprobar los cuatro hosts |
| TikTok | `open.tiktokapis.com` (API y tokens), `open-upload.tiktokapis.com` (subida del vídeo) | `client_key` y `client_secret` de la app, y el token de refresco de la cuenta | Después de pasar la auditoría. Antes no merece la pena: solo publicaría en privado |
| X | `api.x.com` (publicar y subir vídeo) | ID y secreto del cliente OAuth 2.0 y el token de refresco (permisos `tweet.read`, `tweet.write`, `users.read`, `media.write`, `offline.access`) | Solo si decides pagar la API. Si no, nada |

Nota técnica: el entorno inyecta un secreto como cabecera en cada petición a su host. Para los tokens de refresco (que caducan y se renuevan) habrá que ver el mejor encaje cuando llegue el momento; no se guardan en ficheros del proyecto.

## 4. Borrador de calendario (para que lo confirmes)

**Supuestos:** uno cada 3 días, a media semana y en domingo. Hora de Madrid: YouTube a las **19:30**, TikTok a las **21:00** y X a las **21:30**. Si ya has subido alguno a YouTube, se corre el calendario y en las otras dos se publica igual.

| Fecha | Vídeo | YouTube (Studio) | TikTok (app) | X (app) |
|---|---|---|---|---|
| Jueves 19-11-2026 | **T1** · carro (69 s) | 19:30 | 21:00, si la cuenta ya existe | 21:30, si la cuenta ya existe |
| Domingo 22-11-2026 | **T2** · paro y trabajo (96 s) | 19:30 | 21:00 | 21:30 |
| Miércoles 25-11-2026 | **T3** · comprar casa (62 s) | 19:30 | 21:00 | 21:30 |

- **Alternativa:** empezar por **T3**, que es el formato de la serie (padre e hijo) y el que más debate puede traer. Así la primera impresión del canal en TikTok y X es la de la serie.
- Duraciones: TikTok admite las tres. X admite hasta 2 min 20 s en cuentas sin suscripción: caben las tres.
- Ficheros: `videos/<id>/render/<id>-limpio.mp4` y `upload/<id>-portada.png`, sin tocarlos.
- En YouTube, comentario fijado con la pregunta final de cada vídeo.

## 5. Textos por vídeo

Sacados de cada ficha (`upload/<id>.md`), sin cifras nuevas. Antes de publicar, comprobar que el fichero de vídeo es el aprobado.

### T1 · ¿Llenar el carro te cuesta más o menos que hace 10 años?

**YouTube, comentario fijado**
```
¿Lo notas en tu carro? ¿Te cuesta más horas que hace unos años? Te leo.
```

**TikTok, texto**
```
¿Llenar el carro te cuesta más o menos que hace 10 años? 🛒 La compra de comida de un mes le costaba a un sueldo mediano 12,8 horas de trabajo en 2016 y 14,5 horas en 2024. ¿Lo notas en tu carro?

Fuentes oficiales en la descripción de YouTube.

#economía #España #compra #sueldos #IPC
```

**TikTok, comentario fijado**
```
Fuentes: INE (Estructura Salarial, IPC de alimentos, Presupuestos Familiares) y Eurostat (ganancias netas). Cálculo propio con datos oficiales; 2024 es el último año con salarios del INE.
```

**X** (228 caracteres)
```
¿Llenar el carro te cuesta más o menos que hace 10 años?

La compra de comida de un mes, en horas de trabajo de un sueldo mediano: 12,8 h en 2016 y 14,5 h en 2024.

¿Lo notas en tu carro?

Fuente: INE y Eurostat (cálculo propio)
```

**X, respuesta opcional (hilo)**
```
Cómo lo medimos: gasto medio por persona en comida (EPF del INE), llevado a precios de cada año con el IPC de alimentos, entre el sueldo neto por hora del trabajador mediano (INE y Eurostat). Sale igual con 2016, 2018 o 2019 de referencia.
```

### T2 · ¿Hay más gente en paro o trabajando que antes de la crisis?

**YouTube, comentario fijado**
```
Más gente trabajando que nunca y más parados que antes de la crisis. ¿Cómo puede ser? ¿Tú cómo te lo explicas?
```

**TikTok, texto**
```
¿Hay más gente en paro o trabajando que antes de la crisis? En España, las dos cosas: 22,9 millones trabajando (récord de la EPA) y 2,6 millones en paro, frente a 20,8 y 1,8 millones en 2007. ¿Tú cómo te lo explicas?

Fuentes oficiales en la descripción de YouTube.

#economía #España #empleo #paro #EPA
```

**TikTok, comentario fijado**
```
Fuentes: INE, Encuesta de Población Activa (3.er trimestre de cada año) y población residente a 1 de julio (Estadística Continua de Población).
```

**X** (236 caracteres)
```
¿Hay más gente en paro o trabajando que antes de la crisis? Las dos cosas.

2007: 20,8 millones trabajando y 1,8 millones en paro.
Hoy (3.er trim. 2026): 22,9 y 2,6 millones.

¿Cómo puede ser? ¿Tú cómo te lo explicas?

Fuente: INE (EPA)
```

**X, respuesta opcional (hilo)**
```
Frente a 2016 mejora: un 40 % menos de paro. Frente a 2007 empeora: un 43 % más. Tasa de paro oficial: 8,0 % en 2007, 18,9 % en 2016 y 10,2 % hoy. Fuente: INE (EPA).
```

### T3 · ¿Quién lo tuvo más difícil para comprar casa: tu padre o tú?

**YouTube, comentario fijado**
```
¿Quién lo tuvo más fácil, el padre o el hijo? ¿Tú qué opinas?
```

**TikTok, texto**
```
¿Quién lo tuvo más difícil para comprar casa: tu padre o tú? 🏠 En 1986, un piso de 90 m² costaba 3,4 años de sueldo medio; hoy, 7,1. Pero en 1987 la cuota se comía el 47 % de la renta de un hogar; hoy, el 38 %. ¿Tú qué opinas?

Fuentes oficiales en la descripción de YouTube.

#vivienda #España #jóvenes #boomers #economía
```

**TikTok, comentario fijado**
```
Fuentes: Banco de España (precio del m², esfuerzo teórico, tipos de interés), Ministerio de Vivienda (valor tasado) e INE (salarios e IPC). Piso de 90 m² supuesto; media de España.
```

**X** (225 caracteres)
```
¿Quién lo tuvo más difícil para comprar casa: tu padre o tú?

Piso de 90 m²: 3,4 años de sueldo medio en 1986; 7,1 hoy.
La cuota: 47 % de la renta de un hogar en 1987; 38 % hoy.

¿Tú qué opinas?

Fuente: Banco de España e INE
```

**X, respuesta opcional (hilo)**
```
Más datos: en 1989 las hipotecas iban al 15 %. En 2006, en plena burbuja, el piso costaba 8,9 años de sueldo. Descontando la inflación, el sueldo medio ha subido un 16 % desde 1986. Fuentes: Banco de España, Ministerio de Vivienda e INE.
```

## 6. Fuentes de esta nota (orientativas, no oficiales salvo TikTok)
- TikTok, guía de la Content Posting API y límites de clientes sin auditar: https://developers.tiktok.com/doc/content-posting-api-reference-direct-post y https://developers.tiktok.com/doc/content-sharing-guidelines (sin auditar: hasta 5 usuarios en 24 h y cuentas privadas).
- Precio de la API de X (webs de terceros; confirmar en developer.x.com): https://postproxy.dev/blog/x-api-pricing-2026/ y https://www.socialync.io/blog/x-api-pricing-and-posting-2026

## 7. Lo que espero de ti
1. Confirmar el nombre de usuario (`valetuhora` u otro).
2. Confirmar orden (T1-T2-T3 o empezar por T3) y horas.
3. Decir si alguno ya está subido a YouTube.
