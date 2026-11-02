#!/usr/bin/env python3
"""Inyecta el hook de auto-pull en claude/settings.json y avisa de rutas absolutas.

Opera sobre la copia del repo, nunca sobre ~/.claude/settings.json.
El hook se identifica por el marcador DOTCLAUDE_AUTOPULL, asi que es
idempotente: si ya esta, no se duplica.
"""

import json
import pathlib
import re
import sys

MARKER = "DOTCLAUDE_AUTOPULL"
REPO = pathlib.Path(__file__).resolve().parent.parent
TARGET = REPO / "claude" / "settings.json"
HOME = str(pathlib.Path.home())

# El `|| true` es obligatorio: este hook tambien se dispara en sesiones
# remotas (Cowork, cloud) donde ~/dotclaude no existe, y un hook que falla
# ensucia el arranque de cada sesion.
AUTOPULL = {
    "type": "command",
    "command": (
        f'# {MARKER}\n'
        'git -C "$HOME/dotclaude" pull --ff-only --quiet 2>/dev/null || true'
    ),
    "timeout": 10,
}


def has_marker(settings: dict) -> bool:
    return MARKER in json.dumps(settings)


def main() -> int:
    settings = {}
    if TARGET.exists() and TARGET.read_text().strip():
        try:
            settings = json.loads(TARGET.read_text())
        except json.JSONDecodeError as exc:
            print(f"ERROR: {TARGET} no es JSON valido: {exc}", file=sys.stderr)
            return 1

    if has_marker(settings):
        print("el hook de auto-pull ya estaba presente, no se toca")
    else:
        hooks = settings.setdefault("hooks", {})
        sessions = hooks.setdefault("SessionStart", [])
        matched = None
        for entry in sessions:
            if isinstance(entry, dict) and entry.get("matcher", "") == "":
                matched = entry
                break
        if matched is None:
            matched = {"matcher": "", "hooks": []}
            sessions.append(matched)
        matched.setdefault("hooks", []).append(AUTOPULL)
        TARGET.write_text(json.dumps(settings, indent=2) + "\n")
        print("hook de auto-pull anadido a claude/settings.json")

    blob = json.dumps(settings, indent=2)
    absolutes = sorted(set(re.findall(r'"[^"]*' + re.escape(HOME) + r'[^"]*"', blob)))
    if absolutes:
        print("\nAVISO: settings.json contiene rutas absolutas de este Mac.")
        print("Cambialas por $HOME o por rutas relativas antes del push:")
        for item in absolutes:
            print(f"  {item}")

    return 0


if __name__ == "__main__":
    sys.exit(main())
