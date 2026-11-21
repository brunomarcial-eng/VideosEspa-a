# Borrador del formulario de auditoría de la API de YouTube

Formulario: **YouTube API Services – Audit and Quota Extension Form** (`support.google.com/youtube/contact/yt_api_form`). Se rellena en inglés y se envía con la cuenta nueva del canal.

Campos con ✏️: rellénalos tú. Google puede pedir nombre y datos de contacto reales; quedan entre tú y Google, no salen en el canal. Lo demás está listo para pegar.

| Campo | Respuesta |
|---|---|
| Contact name ✏️ | (tu nombre o el de quien responda; privado) |
| Contact email ✏️ | (correo de la cuenta nueva) |
| Organization name | Cuánto Vale Tu Hora (independent YouTube channel) |
| Organization website ✏️ | https://www.youtube.com/@CuantoValeTuHora (el handle final) |
| Google Cloud project number ✏️ | (Google Cloud → Panel del proyecto `cvth-subidas` → «Número del proyecto») |
| API client name | CVTH Subidas |
| Which API services | YouTube Data API v3; YouTube Analytics API |
| Request type | Audit for unverified API client (lift private-only restriction). No quota increase needed |
| Number of users | 1 (the channel owner). Not offered to third parties |

## Use case description (pegar)

> CVTH Subidas is a private, internal command-line tool used by a single independent YouTube channel ("Cuánto Vale Tu Hora") to publish its own videos. The channel produces short explainers about the Spanish economy based only on official statistics (INE, Eurostat). The tool is not offered to any other user or channel.
>
> What it does:
> 1. Uploads the channel's own videos with `videos.insert` as **private** with a scheduled `publishAt` date, the title, description (including the list of official sources), tags, category, `selfDeclaredMadeForKids=false` and `containsSyntheticMedia=true` (the narration is a synthetic voice).
> 2. Sets the custom thumbnail with `thumbnails.set`.
> 3. Reads the channel's own basic data with `channels.list` (mine=true) to confirm the authorised channel.
> 4. Reads the channel's own aggregated metrics with the YouTube Analytics API (views, likes, comments, average view percentage, audience retention) to compare three visual styles in a six-video test.
>
> Data handling: OAuth tokens are stored only on the operator's machine, in a file with owner-only permissions and outside the source repository. No data from other users or channels is accessed, stored, sold or shared. Analytics data is kept as aggregated CSV for internal editorial decisions. Users can revoke access at any time at myaccount.google.com/permissions.
>
> Compliance: the client follows the YouTube API Services Terms of Service and Developer Policies. It performs no automated engagement (no likes, comments, subscriptions or view generation), no scraping and no mass uploading: at most 2 long videos and 5 Shorts per week, each with an original script.

## Scopes requested (pegar)

> - `https://www.googleapis.com/auth/youtube.upload`: upload own videos and set thumbnails.
> - `https://www.googleapis.com/auth/youtube.readonly`: read own channel data to confirm the authorised channel.
> - `https://www.googleapis.com/auth/yt-analytics.readonly`: read own channel analytics.

## Si piden demostración
Google suele pedir capturas o un vídeo corto del cliente. Claude Code puede preparar un screencast del terminal con: autorización, `canal.py`, una subida privada de prueba con `subir.py` y la lectura de métricas. Pídelo cuando llegue la solicitud.

## Antes de enviar
- [ ] Canal creado y verificado por teléfono.
- [ ] App en producción (no en «Prueba»).
- [ ] Una subida privada de prueba hecha con el cliente, para poder enseñarla si la piden.
- [ ] Ningún dato personal tuyo en nombre de proyecto, app, cliente ni canal.
