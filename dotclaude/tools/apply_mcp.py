#!/usr/bin/env python3
"""Registra en este Mac los servidores MCP declarados en mcp/servers.json.

Idempotente: si el servidor ya existe con ese nombre, no lo toca.
`${HOME}` se sustituye por la ruta real de este Mac antes de registrarlo.
Los placeholders de secretos (`${FOO_API_KEY}`) se dejan literales a proposito,
para que Claude los expanda desde el entorno al conectar y el token no quede
escrito en ~/.claude.json.
"""

import json
import pathlib
import subprocess
import sys

HOME = str(pathlib.Path.home())
REPO = pathlib.Path(__file__).resolve().parent.parent
SRC = REPO / "mcp" / "servers.json"


def subst_home(value):
    if isinstance(value, str):
        return value.replace("${HOME}", HOME)
    if isinstance(value, list):
        return [subst_home(v) for v in value]
    if isinstance(value, dict):
        return {k: subst_home(v) for k, v in value.items()}
    return value


def exists(name: str) -> bool:
    proc = subprocess.run(
        ["claude", "mcp", "get", name],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )
    return proc.returncode == 0


def main() -> int:
    if not SRC.exists():
        print("no hay mcp/servers.json, nada que registrar")
        return 0

    servers = json.loads(SRC.read_text() or "{}")
    if not servers:
        print("mcp/servers.json esta vacio, nada que registrar")
        return 0

    if subprocess.run(["which", "claude"], stdout=subprocess.DEVNULL).returncode != 0:
        print("ERROR: el CLI `claude` no esta en el PATH todavia", file=sys.stderr)
        return 1

    added = skipped = failed = 0
    for name in sorted(servers):
        cfg = subst_home(servers[name])
        if exists(name):
            print(f"  = {name} (ya existe, no se toca)")
            skipped += 1
            continue
        proc = subprocess.run(
            ["claude", "mcp", "add-json", name, json.dumps(cfg), "-s", "user"],
            capture_output=True,
            text=True,
        )
        if proc.returncode == 0:
            print(f"  + {name}")
            added += 1
        else:
            detail = (proc.stderr or proc.stdout or "").strip().splitlines()
            print(f"  x {name}: {detail[0] if detail else 'error desconocido'}")
            failed += 1

    print(f"\nMCP: {added} anadidos, {skipped} ya existentes, {failed} fallidos")
    if failed:
        print("Los fallidos suelen ser servidores con nombre reservado o JSON invalido.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
