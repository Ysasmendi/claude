#!/usr/bin/env python3
"""Mete en index.html las pinturas de la carpeta pinturas/ (entre las marcas PINTURAS-INICIO y PINTURAS-FIN).
Uso: python3 montar.py   (desde esta carpeta). index.html sigue siendo un solo archivo que funciona sin nada más."""
import pathlib, re
aqui = pathlib.Path(__file__).parent
html = (aqui / 'index.html').read_text(encoding='utf-8')
trozos = ''.join(f.read_text(encoding='utf-8').rstrip() + '\n' for f in sorted((aqui / 'pinturas').glob('*.js')))
bloque = '/*PINTURAS-INICIO*/\n' + trozos + '/*PINTURAS-FIN*/'
if '/*PINTURAS-INICIO*/' in html:
    html = re.sub(r'/\*PINTURAS-INICIO\*/.*?/\*PINTURAS-FIN\*/', lambda m: bloque, html, flags=re.S)
else:
    html = html.replace('/*AQ-FIN*/', '/*AQ-FIN*/\n' + bloque, 1)
(aqui / 'index.html').write_text(html, encoding='utf-8')
print('pinturas montadas:', len(list((aqui / 'pinturas').glob('*.js'))), 'archivos')
