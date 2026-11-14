# Conectar el canal con la API de YouTube

Guía de clics para la parte humana y lo que hace Claude Code después. Tiempo estimado de la parte humana: 30-40 minutos, más la espera de la auditoría (semanas).

## Quién hace qué

| Paso | Quién | Por qué |
|---|---|---|
| 1-2. Cuenta de Google y canal | **Tú** | Google exige verificar un teléfono y aceptar las condiciones como persona. Ninguna IA puede ni debe hacerlo |
| 3-6. Proyecto de Google Cloud, APIs, consentimiento y cliente OAuth | **Tú**, con esta guía | Hay que hacerlo con la sesión de la cuenta nueva abierta |
| 7-8. Conexión, comprobación del canal y prueba | **Claude Code** | Código listo en `scripts/youtube/` |
| 9. Formulario de auditoría | **Tú** lo envías; Claude Code redacta | Borrador en `docs/youtube-auditoria-borrador.md` |

## 0. Antes de empezar: anonimato
- Usa un **perfil de navegador nuevo** solo para el canal. En ese perfil no inicies sesión con tu cuenta personal.
- Todo (canal, Google Cloud, consentimiento, auditoría) se hace **con la cuenta nueva**. Si creas el proyecto de Google Cloud con tu cuenta personal, tu correo queda como desarrollador y como contacto de la app.
- No pongas tu nombre en el nombre del proyecto, de la app ni del cliente.

## 1. Cuenta de Google nueva
1. En el perfil nuevo, entra en `accounts.google.com/signup`.
2. Nombre neutro (p. ej. «Cuánto Vale Tu Hora»). Google pedirá fecha de nacimiento y teléfono para verificar.
3. Activa la verificación en dos pasos (`myaccount.google.com/security`).

## 2. Canal de YouTube
1. Con esa cuenta, entra en `youtube.com` → foto de perfil → **Crear un canal**.
2. Nombre: **Cuánto Vale Tu Hora**. Handle, por orden de preferencia: `@CuantoValeTuHora`, `@CuantoValeTuHoraES`, `@ElPrecioDelTiempo`, `@HorasContadas`. YouTube dice al momento si está libre. En la web no he encontrado ningún canal con esos tres nombres, pero la comprobación válida es esta.
3. Verifica el canal en `youtube.com/verify`. Sin verificar no hay miniaturas propias ni vídeos de más de 15 minutos, y la API no puede poner miniaturas.
4. En Studio → Configuración → Canal: país **España**. No añadas enlaces, correos ni redes personales.

## 3. Proyecto de Google Cloud
1. Con la cuenta nueva, entra en `console.cloud.google.com` y acepta las condiciones.
2. Selector de proyectos → **Proyecto nuevo** → nombre `cvth-subidas`, sin organización → Crear.
3. No hace falta activar la facturación: la API de YouTube es gratuita dentro de la cuota (10.000 unidades al día por defecto; una subida gasta una parte grande, pero da de sobra para el ritmo del canal).

## 4. Activar las dos APIs
En **APIs y servicios → Biblioteca**, busca y pulsa **Habilitar** en:
- **YouTube Data API v3** (subir, programar, leer el canal).
- **YouTube Analytics API** (métricas del test de estilos).

## 5. Pantalla de consentimiento
Menú → **Google Auth Platform** (en algunas cuentas sale como «APIs y servicios → Pantalla de consentimiento de OAuth»).
1. **Primeros pasos / Branding:** nombre de la app `CVTH Subidas`; correo de asistencia y de contacto: **la cuenta nueva**.
2. **Público:** Externo. En «Usuarios de prueba» añade la cuenta nueva.
3. **Acceso a datos:** añade estos permisos:
   - `.../auth/youtube.upload`
   - `.../auth/youtube.readonly`
   - `.../auth/yt-analytics.readonly`
4. **Público → Publicar app** (pasar a producción). Es importante: en modo «Prueba» el permiso caduca cada 7 días. En producción, al autorizar saldrá el aviso «Google no ha verificado esta app». Es tu propia app: «Configuración avanzada → Ir a CVTH Subidas». No hace falta verificar la app para uso propio.

## 6. Cliente OAuth
1. Google Auth Platform → **Clientes → Crear cliente**.
2. Tipo: **Aplicación de escritorio**. Nombre: `cvth-escritorio` → Crear.
3. **Descargar JSON**: es un fichero `client_secret_….json`.

## 7. Pasarme el cliente
- Adjunta ese JSON en el chat de Claude Code (como hiciste con el zip). Lo guardo en `~/.config/cvth/cliente_oauth.json`, **fuera del repositorio**. `.gitignore` bloquea cualquier `client_secret*.json` y `token*.json`.
- En las apps de escritorio Google no trata ese secreto como confidencial (va dentro de la app). Aun así, nunca va a git.
- El contenedor de la sesión es temporal: al cerrarse se borra el permiso y hay que repetir el paso 8 (un minuto).

## 8. Conexión (lo hace Claude Code contigo)
1. Ejecuto `python3 scripts/youtube/autorizar.py escritorio iniciar` y te paso un enlace.
2. Lo abres **en el perfil del canal** → eliges el canal → aviso de app no verificada → Ir a CVTH Subidas → **Permitir**.
3. El navegador acaba en una página de error de `127.0.0.1`. Es lo esperado. **Copia la dirección completa** de esa página y pégamela en el chat. El código que lleva caduca en minutos y no sirve sin una clave que solo está en el contenedor.
4. Ejecuto `autorizar.py escritorio completar "<dirección>"` y `canal.py`, que muestra el canal, el handle, si está verificado y si hay algún dato personal (falla si encuentra tu nombre).

Alternativa sin copiar direcciones: un segundo cliente de tipo **TV y dispositivos de entrada limitada** permite autorizar escribiendo un código en `google.com/device` (`autorizar.py dispositivo iniciar`). No sirve para Analytics.

## 9. Auditoría de la API
- Formulario: **YouTube API Services – Audit and Quota Extension Form** (`support.google.com/youtube/contact/yt_api_form`).
- Respuestas redactadas en `docs/youtube-auditoria-borrador.md`. Revisa los campos marcados con ✏️ y envíalo con la cuenta nueva.
- Mientras no esté aprobada, la subida válida es **manual en Studio con publicación programada** (regla del proyecto). La documentación de Google ha cambiado sobre si las subidas por API de proyectos sin auditar quedan bloqueadas en privado. Lo comprobaremos con un vídeo de prueba privado y lo anotaremos aquí.

## Comandos (referencia)
```
python3 scripts/youtube/autorizar.py escritorio iniciar
python3 scripts/youtube/autorizar.py escritorio completar "<dirección>"
python3 scripts/youtube/canal.py                       # comprobar conexión y anonimato
python3 scripts/youtube/subir.py upload/<id>.json      # simulación
python3 scripts/youtube/subir.py upload/<id>.json --enviar
python3 scripts/youtube/metricas.py --desde AAAA-MM-DD --hasta AAAA-MM-DD
```
Las subidas siempre salen como **privadas con fecha de publicación** (`publishAt`), con «contenido sintético» marcado y «no es para niños». Antes de enviar, `subir.py` valida la ficha: título ≤ 100, fecha futura, vídeo existente y sin el nombre de Bruno.
