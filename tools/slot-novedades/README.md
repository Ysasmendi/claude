# Tragaperras de Novedades

Máquina de casino para sortear novedades de producto de dcycle. Bobina vertical de 9,2 segundos: unos 200 pasos de bobina, la mitad del tiempo a velocidad de crucero (33 casillas/s, ilegibles) y la otra mitad frenando hasta que los títulos se pueden leer uno a uno. Fondo azul dcycle, casilla blanca, texto azul.

La curva son dos tramos —crucero lineal con el 75% de la distancia, después frenada cúbica con el 25% restante— empalmados a la misma velocidad, así que la transición no se nota. Un solo tramo de frenada de 9 segundos se arrastraría muerto la segunda mitad. La duración está en `dur` dentro de `scripts/app.tpl.html`.

388 novedades publicadas en `#product-news` entre el 8 de enero y el 31 de agosto de 2026.

## Uso

Abre `index.html` en el navegador. No necesita servidor ni instalar nada.

- **Girar** (o barra espaciadora) lanza la tirada.
- **Chips de categoría** dejan fuera lo que no interese: Producto (233), Skills (43), Web (29), CLI (25), Leia/API (22), Iniciativas (21), Docs (15).
- **Sin repetir** descarta las que ya han salido; *Reiniciar salidas* vuelve a meterlas.
- **Toca la casilla premiada** y la máquina imprime un ticket con qué es esa funcionalidad y para qué sirve, sacado del mensaje original de `#product-news` (con fecha y quién lo contó). Segundo toque, o *Cerrar*, y se guarda.
- **Sonido**: mientras gira, clic mecánico de bobina en cada casilla y campanilleo pentatónico que se abre al frenar. Al parar, caja registradora: cajón, "cha" metálico, "ching" de campana y once monedas cayendo. Todo sintetizado con Web Audio, no hay ficheros de audio.

## Las Vegas

Mientras gira: marquesina de 44 bombillas con la luz corriendo alrededor de la máquina, vibración durante la fase rápida, barrido de luz sobre la bobina y desenfoque de movimiento proporcional a la velocidad.

Al parar: las bombillas destellan en blanco cuatro veces, la casilla premiada da un bote con anillo expansivo, la ventana parpadea, caen 30 monedas girando sobre la casilla y se estampa un `¡CHA-CHING!` en su esquina.

## Aleatoriedad

Cada tirada usa `crypto.getRandomValues`, el generador criptográfico del navegador, con muestreo por rechazo: se descartan los valores del último bloque incompleto de 2³², que es lo único que introduciría sesgo hacia las primeras casillas. `Math.random` no se usa en ningún sitio.

Es aleatoriedad criptográfica, no física: el navegador siembra su CSPRNG con entropía del sistema operativo. Impredecible en la práctica y sin secuencia reproducible, que es lo que hace falta para un sorteo. Si algún día hiciera falta entropía física verificable (un sorteo con dinero delante), habría que tirar de un servicio externo tipo random.org o de las balizas de aleatoriedad del NIST, y eso ya exige red.

## Estructura

```
index.html                 app completa, datos embebidos (generada)
artifact.html              misma app como fragmento para publicar en Claude Artifacts (generada)
data/novedades-2026.json   las 388 novedades (generada)
scripts/app.tpl.html       plantilla: CSS, markup y JS   ← se edita esto
scripts/build.py           genera index.html, artifact.html y el JSON
```

Fuente de los datos: `knowledge/product-news-2026.md` en la raíz del repo.

## Regenerar

Después de tocar la plantilla o de añadir novedades al markdown:

```bash
python3 tools/slot-novedades/scripts/build.py
```

## Las definiciones

Las 388 definiciones salen del mensaje original de `#product-news`, no de un resumen inventado: se citan tal cual se publicaron (en el idioma en que se escribieron, casi siempre inglés), limpiando emojis, menciones, formato de Slack y arranques de hype, y cortando por frase alrededor de los 430 caracteres.

El emparejamiento novedad → mensaje se hizo por fecha más solapamiento de tokens, con un diccionario español-inglés para que un título en español encuentre su mensaje en inglés. Las 24 filas que el automático dejó sin pareja fiable están fijadas a mano por un fragmento del texto, y dos fechas mal apuntadas en la lista (`/sdr-copilot` y Decarb capítulo 2) se corrigieron en el markdown. Muestra de 22 al azar revisada una a una: 22 correctas.

`data/definiciones-2026.json` es el resultado y va versionado en el repo, con la clave `DD-MM|título tal cual está en el markdown`. El pipeline que lo generó necesita el histórico de Slack en crudo, que no se guarda aquí; si hay que rehacerlo, se vuelve a leer el canal.

Ojo antes de compartir la ruleta fuera de la empresa: los textos son mensajes internos literales y algunos nombran clientes (Calcinor, Félix Solís, Tolsa, Sesé…) o detalles de negociación.
