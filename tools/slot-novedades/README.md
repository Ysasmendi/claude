# Tragaperras de Novedades

Máquina de casino para sortear novedades de producto de dcycle. Bobina vertical: arranca rápido, frena hasta parar en una casilla. Fondo azul dcycle, casilla blanca, texto azul.

388 novedades publicadas en `#product-news` entre el 8 de enero y el 31 de agosto de 2026.

## Uso

Abre `index.html` en el navegador. No necesita servidor ni instalar nada.

- **Girar** (o barra espaciadora) lanza la tirada.
- **Chips de categoría** dejan fuera lo que no interese: Producto (233), Skills (43), Web (29), CLI (25), Leia/API (22), Iniciativas (21), Docs (15).
- **Sin repetir** descarta las que ya han salido; *Reiniciar salidas* vuelve a meterlas.
- **Sonido**: clics de bobina mientras gira y ding-ding-ding al parar, sintetizados con Web Audio (no hay ficheros de audio).

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
