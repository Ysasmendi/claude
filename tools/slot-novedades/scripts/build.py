#!/usr/bin/env python3
"""Genera la app de la tragaperras desde el listado de novedades.

Entrada:  knowledge/product-news-2026.md  (tablas por mes: | DD-MM | CAT | Novedad |)
Salidas:  tools/slot-novedades/data/novedades-2026.json
          tools/slot-novedades/index.html          (standalone, abrir en el navegador)
          tools/slot-novedades/artifact.html       (fragmento para publicar como Artifact)
"""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
APP = Path(__file__).resolve().parent
SOURCE = ROOT / "knowledge" / "product-news-2026.md"
ROW = re.compile(r"^\|\s*(\d{2}-\d{2})\s*\|\s*([A-Z]+)\s*\|\s*(.+?)\s*\|\s*$")


def parse():
    items = []
    for line in SOURCE.read_text(encoding="utf-8").splitlines():
        m = ROW.match(line)
        if m:
            title = m.group(3).replace("`", "").replace("**", "")
            items.append({"i": len(items), "d": m.group(1), "c": m.group(2), "t": title})
    return items


def main():
    items = parse()
    if not items:
        raise SystemExit(f"no se encontró ninguna novedad en {SOURCE}")

    (APP.parent / "data").mkdir(parents=True, exist_ok=True)
    (APP.parent / "data" / "novedades-2026.json").write_text(
        json.dumps(items, ensure_ascii=False, indent=1) + "\n", encoding="utf-8"
    )

    tpl = (APP / "app.tpl.html").read_text(encoding="utf-8")
    tpl = tpl.replace("__DATA__", json.dumps(items, ensure_ascii=False, separators=(",", ":")))
    head, body = tpl.split("<!--BODY-->", 1)

    (APP.parent / "artifact.html").write_text(head + body.lstrip("\n"), encoding="utf-8")
    (APP.parent / "index.html").write_text(
        '<!doctype html>\n<html lang="es">\n<head>\n<meta charset="utf-8">\n'
        '<meta name="viewport" content="width=device-width, initial-scale=1">\n'
        + head.rstrip()
        + "\n</head>\n<body>\n"
        + body.strip()
        + "\n</body>\n</html>\n",
        encoding="utf-8",
    )
    print(f"{len(items)} novedades → index.html, artifact.html, data/novedades-2026.json")


if __name__ == "__main__":
    main()
