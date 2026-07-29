#!/usr/bin/env python3
"""Escanea el repo buscando secretos antes de un push.

Sale con codigo 1 si encuentra algo, para abortar el commit.
No pretende ser exhaustivo: cubre los formatos de token que de verdad
acaban pegados en un fichero de configuracion por accidente.
"""

import pathlib
import re
import sys

REPO = pathlib.Path(__file__).resolve().parent.parent

SKIP_DIRS = {".git", "node_modules", "__pycache__", ".venv"}
# Ficheros que existen precisamente para documentar nombres de variables.
SKIP_FILES = {"REQUIRED_ENV.md", "scan_secrets.py"}

PATTERNS = [
    ("clave de API de Anthropic", re.compile(r"sk-ant-[A-Za-z0-9_\-]{20,}")),
    ("token de OpenAI", re.compile(r"\bsk-[A-Za-z0-9]{32,}\b")),
    ("token clasico de GitHub", re.compile(r"\bghp_[A-Za-z0-9]{20,}\b")),
    ("token fino de GitHub", re.compile(r"\bgithub_pat_[A-Za-z0-9_]{20,}\b")),
    ("token de bot de Slack", re.compile(r"\bxox[baprs]-[A-Za-z0-9\-]{10,}\b")),
    ("clave de acceso de AWS", re.compile(r"\bAKIA[0-9A-Z]{16}\b")),
    ("clave privada", re.compile(r"-----BEGIN [A-Z ]*PRIVATE KEY-----")),
    ("token de Notion", re.compile(r"\b(secret_|ntn_)[A-Za-z0-9]{20,}\b")),
    ("token portador en claro", re.compile(r"[Bb]earer\s+[A-Za-z0-9._\-]{20,}")),
    # Un token embebido en la query string de una URL de MCP: collect_mcp.py
    # no puede sustituirlo sin romper el servidor, asi que se para aqui.
    (
        "credencial en query string de una URL",
        re.compile(
            r"[?&](?:token|key|api[_-]?key|access[_-]?token|auth|secret|password)"
            r"=(?!\$\{)[A-Za-z0-9._\-]{8,}",
            re.I,
        ),
    ),
]


def is_text(path: pathlib.Path) -> bool:
    try:
        with path.open("rb") as fh:
            return b"\0" not in fh.read(2048)
    except OSError:
        return False


def main() -> int:
    hits = []
    for path in REPO.rglob("*"):
        if not path.is_file():
            continue
        if any(part in SKIP_DIRS for part in path.parts):
            continue
        if path.name in SKIP_FILES:
            continue
        if not is_text(path):
            continue
        try:
            text = path.read_text(errors="replace")
        except OSError:
            continue
        for lineno, line in enumerate(text.splitlines(), start=1):
            for label, pattern in PATTERNS:
                match = pattern.search(line)
                if match:
                    shown = match.group(0)
                    masked = shown[:8] + "..." if len(shown) > 8 else "..."
                    hits.append((path.relative_to(REPO), lineno, label, masked))

    if not hits:
        print("escaneo de secretos: limpio")
        return 0

    print("\nESCANEO DE SECRETOS: posibles credenciales en el repo\n", file=sys.stderr)
    for rel, lineno, label, masked in hits:
        print(f"  {rel}:{lineno}  {label}  ({masked})", file=sys.stderr)
    print(
        "\nSaca esos valores a variables de entorno antes de hacer push.\n"
        "Si es un falso positivo, borra la linea del fichero o ajusta\n"
        "tools/scan_secrets.py.",
        file=sys.stderr,
    )
    return 1


if __name__ == "__main__":
    sys.exit(main())
