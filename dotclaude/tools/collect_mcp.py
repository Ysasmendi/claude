#!/usr/bin/env python3
"""Extrae los servidores MCP de scope user desde ~/.claude.json.

Escribe mcp/servers.json con:
  - los secretos de `env` y `headers` sustituidos por placeholders ${NOMBRE}
  - las rutas absolutas del home sustituidas por ${HOME}

Y mcp/REQUIRED_ENV.md con la lista de variables que hay que exportar
en cada Mac para que esos servidores arranquen.

Los MCP de scope local (los que viven bajo .projects[ruta] en ~/.claude.json)
NO se extraen a proposito: son especificos de un proyecto y de una ruta.
"""

import json
import pathlib
import re
import sys

HOME = pathlib.Path.home()
SRC = HOME / ".claude.json"
REPO = pathlib.Path(__file__).resolve().parent.parent
OUT = REPO / "mcp" / "servers.json"
ENV_DOC = REPO / "mcp" / "REQUIRED_ENV.md"

# Campos cuyo valor nunca se sube al repo en claro.
SECRET_FIELDS = ("env", "headers")


def env_name(server: str, key: str) -> str:
    return re.sub(r"[^A-Za-z0-9]+", "_", f"{server}_{key}").upper()


def normalize_paths(value):
    """Sustituye el home absoluto por ${HOME} para que el JSON sea portable."""
    if isinstance(value, str):
        return value.replace(str(HOME), "${HOME}")
    if isinstance(value, list):
        return [normalize_paths(v) for v in value]
    return value


def main() -> int:
    if not SRC.exists():
        print(f"no existe {SRC}, no hay MCP de scope user que extraer")
        OUT.parent.mkdir(parents=True, exist_ok=True)
        if not OUT.exists():
            OUT.write_text("{}\n")
        return 0

    try:
        data = json.loads(SRC.read_text())
    except json.JSONDecodeError as exc:
        print(f"ERROR: {SRC} no es JSON valido: {exc}", file=sys.stderr)
        return 1

    servers = data.get("mcpServers") or {}
    if not isinstance(servers, dict):
        servers = {}

    placeholders = []
    url_warnings = []

    for name in sorted(servers):
        cfg = servers[name]
        if not isinstance(cfg, dict):
            continue

        for field in SECRET_FIELDS:
            block = cfg.get(field)
            if not isinstance(block, dict):
                continue
            for key in sorted(block):
                value = block[key]
                if not isinstance(value, str) or not value:
                    continue
                if value.startswith("${"):
                    continue  # ya es una referencia, se deja tal cual
                ph = env_name(name, key)
                block[key] = "${" + ph + "}"
                placeholders.append((name, field, key, ph))

        if isinstance(cfg.get("command"), str):
            cfg["command"] = normalize_paths(cfg["command"])
        if isinstance(cfg.get("args"), list):
            cfg["args"] = normalize_paths(cfg["args"])

        # Un token embebido en la URL no se puede sustituir sin romper el
        # servidor, asi que se avisa y se decide a mano.
        url = cfg.get("url")
        if isinstance(url, str) and "?" in url:
            url_warnings.append((name, url))

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(servers, indent=2, sort_keys=True) + "\n")
    print(f"escritos {len(servers)} servidores MCP en {OUT.relative_to(REPO)}")

    lines = [
        "# Variables de entorno que necesitan los MCP",
        "",
        "Generado por `tools/collect_mcp.py`. Los valores reales NUNCA van al repo.",
        "Exporta estas variables en `~/.zshrc` de cada Mac, o leelas de Proton Pass",
        "o del Keychain. Si una variable no esta definida, Claude arranca igual pero",
        "marca ese servidor con un aviso en `claude mcp list`.",
        "",
    ]
    if placeholders:
        lines += ["| Servidor | Campo | Clave | Variable a exportar |",
                  "|---|---|---|---|"]
        for server, field, key, ph in placeholders:
            lines.append(f"| `{server}` | `{field}` | `{key}` | `{ph}` |")
    else:
        lines.append("Ninguno de los servidores extraidos llevaba secretos en `env` ni `headers`.")

    if url_warnings:
        lines += [
            "",
            "## Revisar a mano",
            "",
            "Estas URLs llevan query string y podrian contener un token. Revisalas",
            "antes de hacer push, y si hay secreto sacalo a una variable:",
            "",
        ]
        for server, url in url_warnings:
            lines.append(f"- `{server}`: `{url}`")

    ENV_DOC.write_text("\n".join(lines) + "\n")
    print(f"escrito {ENV_DOC.relative_to(REPO)} ({len(placeholders)} variables)")

    if url_warnings:
        print(f"AVISO: {len(url_warnings)} URL(s) con query string; revisa mcp/REQUIRED_ENV.md")

    return 0


if __name__ == "__main__":
    sys.exit(main())
