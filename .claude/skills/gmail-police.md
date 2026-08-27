---
name: gmail-police
description: Use when Jaime wants to organize/label his entire Gmail inbox (read AND unread) into three buckets — "to action", "to read", "to archive" — and keep those labels clean as he archives. Triggers on phrases like "etiqueta mi inbox", "clasifica todo el correo", "pon orden en la bandeja", "ordena la bandeja", "organiza mi gmail", "limpia las etiquetas", "gmail police", "label my whole inbox", "organize my gmail", "tag everything in my inbox". Applies Gmail labels across the full inbox, is idempotent (skips already-labeled threads), and removes the three bucket labels from threads that ya no están en el inbox (archivados por Jaime). It does NOT draft replies (that's email_triage) and never archives, deletes, sends, or marks as read by itself.
---

# Gmail Police

Etiqueta TODO el inbox de Jaime (leídos y no leídos) en tres buckets excluyentes, clasificando desde el
último mensaje de cada hilo, y retira esas etiquetas de los hilos que ya han salido del inbox. Nunca
archiva, borra, envía ni marca como leído.

Esto NO es triage de respuestas. Si Jaime quiere borradores de los correos del día, ésa es la skill
`email_triage`. Aquí solo se etiqueta y se limpia, sobre todo el inbox.

## Los tres buckets

Cada hilo recibe **exactamente una** etiqueta. Decide en este orden:

> **to action** = el último mensaje del hilo NO es de Jaime y requiere una **acción o decisión tuya**:
> una pregunta directa, o una petición de actuar (aprobar, decidir, firmar, enviar, agendar, confirmar,
> revisar, compartir información).

Cuenta como "to action" cualquier cosa que requiera tu acción, **aunque venga de una herramienta y no se
conteste por email**: aprobar un viaje o gasto, aprobar un asiento, hacer RSVP a una invitación de
calendario. Es tu bandeja de acción.

Si el último mensaje del hilo es del propio Jaime, NO es "to action" — ya respondió.

Si no es "to action", decide entre:

> **to archive** = transaccional o automático, sin valor futuro de lectura: recibos, confirmaciones de
> compra/pago, envíos, respuestas a invitaciones de calendario (aceptado/rechazado), notificaciones
> automáticas, alertas de sistema, promociones.

> **to read** = informativo con valor pero sin acción requerida: newsletters, updates internos, FYIs,
> anuncios, resúmenes/digests.

Ante la duda entre read y archive, prefiere **to read**: es peor enterrar algo con valor en el bucket
desechable que dejar un recibo de más en "to read".

## Las etiquetas viven en el inbox

Los tres buckets describen el estado del **inbox**, no del archivo. En cuanto Jaime archiva un hilo, ese
hilo ya está resuelto y su etiqueta sobra: ensucia las vistas de etiqueta, infla los contadores y hace que
"to action" deje de ser una lista fiable de lo que queda pendiente.

Por eso cada pasada tiene dos mitades: **limpiar** los hilos ya archivados que aún arrastran etiqueta, y
**clasificar** los hilos nuevos del inbox.

## Workflow

1. **Asegura las tres etiquetas.** Llama `list_labels`. Para cada displayName que no exista
   (`to action`, `to read`, `to archive`), créala con `create_label`. Guarda los tres `labelId`: los necesitas
   para `label_thread` y `unlabel_thread`, que sí usan IDs. Las queries de búsqueda (pasos 2 y 3), en
   cambio, filtran por **nombre** de etiqueta, no por ID.

2. **Limpia las etiquetas de los hilos archivados.** Busca los hilos que ya no están en el inbox pero
   siguen llevando uno de los tres buckets:

   ```
   -in:inbox (label:"to action" OR label:"to read" OR label:"to archive")
   ```

   Pagina igual que en el paso 3 (`pageSize: 50`, sigue el `pageToken` hasta agotarlo). Para cada hilo,
   llama `unlabel_thread` pasando **solo** los `labelId` de los buckets que ese hilo lleve realmente —
   `search_threads` te los da en `label_ids` con la vista por defecto. Nunca metas `INBOX`, `UNREAD` ni
   ninguna otra etiqueta de sistema en esa llamada: quitar `INBOX` archivaría el hilo, y quitar `UNREAD`
   lo marcaría como leído.

   Si la query devuelve cero hilos y sospechas que debería haber alguno, reintenta una sola vez usando los
   `labelId` en lugar de los nombres; si sigue vacía, da la limpieza por hecha y sigue.

3. **Construye la query idempotente de clasificación.** El objetivo es procesar solo lo que aún no está
   clasificado:

   ```
   in:inbox -label:"to action" -label:"to read" -label:"to archive"
   ```

   Importante: el operador `label:` de Gmail filtra por **nombre** de etiqueta (entre comillas si tiene
   espacios), NO por el ID interno — `label:Label_2` devuelve vacío. Los IDs solo valen para
   `label_thread`/`unlabel_thread`. Excluir esas tres etiquetas por nombre (y no `has:nouserlabels`) es lo
   que hace la skill idempotente sin pisar otras etiquetas que Jaime pueda tener.

4. **Recoge todos los hilos sin clasificar.** Llama `search_threads` con esa query y `pageSize: 50`.
   Sigue el `pageToken` que devuelve y repite hasta que no haya más páginas. Recorres el inbox entero,
   sin tope.

5. **Clasifica desde el último mensaje.** La señal vive en el mensaje más reciente del hilo. El `snippet`
   que ya devuelve `search_threads` es el preview de ese último mensaje y suele bastar para decidir el
   bucket junto con remitente y asunto. Abre `get_thread` **solo cuando el snippet sea ambiguo**; cuando lo
   hagas, usa **únicamente el `plaintextBody` del último mensaje** e ignora el `htmlBody` y los mensajes
   anteriores de la cadena — el HTML y la cadena citada son lo que hace que el hilo reviente el límite de
   salida. Si aun así el resultado de `get_thread` se vuelca a un fichero por tamaño, lee solo la parte del
   último mensaje desde el fichero, no cargues todo el HTML. `get_thread` NO marca el hilo como leído.

6. **Aplica una etiqueta por hilo** con `label_thread`, pasando el `labelId` del bucket que decidiste.
   Nada más: no quites `INBOX`, no añadas otras etiquetas, no crees borradores.

7. **Muestra un resumen** con esta estructura (omite las secciones vacías):

   ```
   ## 🚓 Gmail Police — [fecha DD/MM/YYYY]

   ### 🧹 etiquetas limpiadas (J)
   - **[Remitente]** — *[Asunto]* — _[etiqueta retirada]_

   ### ✉️ to action (N)
   - **[Remitente]** — *[Asunto]* — _[qué piden, una línea]_

   ### 📖 to read (M)
   - **[Remitente]** — *[Asunto]* — _[motivo: newsletter / update / FYI / …]_

   ### 🗄️ to archive (K)
   - **[Remitente]** — *[Asunto]* — _[motivo: recibo / notificación / promoción / …]_
   ```

   Si la limpieza tocó muchos hilos, resume esa sección en una línea con el total por etiqueta en vez de
   listarlos uno a uno.

## Qué NO hacer

- **Nunca envíes ni crees borradores.** Eso es trabajo de `email_triage`, no de esta skill.
- **Nunca archives de verdad.** "to archive" es solo una etiqueta; no quites `INBOX` con `unlabel_thread`.
  El único uso legítimo de `unlabel_thread` es el paso 2, y ahí solo con los tres `labelId` de bucket.
- **Nunca borres ni muevas a papelera.**
- **Nunca marques como leído.** Jaime usa el estado no-leído como su propia señal de trabajo.
- **No quites etiquetas a hilos que siguen en el inbox.** La limpieza es solo para lo que ya salió de la
  bandeja.
- **No re-etiquetes hilos ya clasificados.** La query del paso 3 ya los excluye; respeta esa decisión
  previa (puede que Jaime la haya ajustado a mano).
- **No preguntes hilo por hilo.** Procesa todo el lote y deja que Jaime revise el resumen.

## Edge cases

- **Nada que clasificar ni que limpiar**: responde `"El inbox ya está clasificado."` y para.
- **Nada que limpiar pero sí que clasificar** (o al revés): salta la mitad vacía sin comentarla y sigue.
- **Hilo archivado que vuelve al inbox** con un mensaje nuevo: llega sin etiqueta (se la quitó la limpieza
  de una pasada anterior) y el paso 3 lo vuelve a clasificar desde su último mensaje. Es el comportamiento
  buscado: un hilo que revive se juzga por lo que acaba de llegar, no por lo que fue.
- **Hilo con más de una etiqueta de bucket** (Jaime tocó algo a mano): en la limpieza quítaselas todas; en
  la clasificación no lo toques, la query ya lo excluye.
- **Papelera y spam**: `search_threads` los excluye por defecto y así se quedan — sus etiquetas se van
  solas cuando Gmail purga el hilo.
- **El último mensaje es de Jaime**: no es "to action"; clasifícalo en read/archive por su contenido.
- **Inbox muy grande**: avisa al empezar de que la primera pasada recorre todo el inbox y puede tardar.
  Las siguientes pasadas serán mucho más rápidas porque solo tocan lo nuevo sin etiquetar y lo archivado
  desde la última vez.
- **Promociones / Social que aparezcan en el inbox**: clasifícalas igualmente (normalmente → to archive).

## Por qué estas reglas

El objetivo es convertir un inbox caótico en tres pilas sobre las que Jaime puede actuar de un vistazo,
sin perder el control de su bandeja:

- **Solo etiquetar el inbox (nunca archivar/borrar/marcar leído)** → si Jaime abre Gmail después, la
  bandeja sigue igual salvo por las etiquetas; nada desaparece a sus espaldas.
- **Limpiar las etiquetas de lo archivado** → archivar es la forma que tiene Jaime de decir "esto ya está".
  Si la etiqueta sobrevive al archivado, "to action" acumula hilos muertos y deja de servir como lista de
  pendientes. La limpieza mantiene la equivalencia etiqueta = pendiente en el inbox.
- **Idempotente** → re-ejecutar (o correrla en cron) es barato: tras la primera pasada solo se miran los
  hilos nuevos sin etiquetar y los que Jaime haya archivado desde entonces.
- **Clasificar desde el último mensaje** → la señal vive en el mensaje más reciente; el snippet suele
  bastar, y abrir el cuerpo entero (con su HTML y cadena citada) es caro y a veces revienta el límite de
  `get_thread`. Por eso se abre solo en hilos dudosos.
- **Una etiqueta por hilo, con orden de prioridad** → el sistema es predecible; Jaime puede mirar un correo
  y anticipar en qué pila va a caer.
