#!/usr/bin/env python3
"""
Monitor de trafico RSHECC (Ctra. de Castilla km 2, Puerta de Hierro) -> Pza. Olavide.

Fuente: feed de puntos de medida en tiempo real del Ayuntamiento de Madrid
(informo.madrid.es), ~3.600 sensores, refresco cada 5 minutos.

Campos por sensor: intensidad (veh/h), ocupacion (%), carga (indice 0-100),
nivelServicio (0 fluido, 1 lento, 2 retenciones, 3 congestion).

Uso:
  python3 tools/traffic-rshecc-olavide.py            # una lectura
  python3 tools/traffic-rshecc-olavide.py --json     # salida JSON
  python3 tools/traffic-rshecc-olavide.py --watch 5  # muestrea cada 5 min, emite al cambiar
"""
import json
import statistics
import sys
import time
import unicodedata
import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime, timezone, timedelta

FEED = "https://informo.madrid.es/informo/tmadrid/pm.xml"
MADRID = timezone(timedelta(hours=2))  # CEST

# La salida del club da a la A-6 / Puerta de Hierro, que no tiene sensores
# municipales (es red DGT). Estos son los sensores que se encienden cuando la
# cola de la A-6 sentido Madrid desborda hacia Puerta de Hierro.
GATE = ["COMPLUTENSE", "SENECA", "DEHESA DE LA VILLA", "AV. VALLADOLID",
        "AV.VALLADOLID", "MONCLOA"]

# Ultimo tramo comun a todas las rutas: Chamberi hasta Olavide.
LAST_MILE = ["QUEVEDO", "BRAVO MURILLO", "SANTA ENGRACIA", "LUCHANA", "SAGASTA",
             "CARRANZA", "BILBAO", "FUENCARRAL", "RIOS ROSAS", "MODESTO LAFUENTE",
             "ALVAREZ DE CASTRO"]

ROUTES = {
    "Rio (Pte. Franceses - Florida - San Vicente - Ferraz)": [
        "AV. VALLADOLID", "AV.VALLADOLID", "FLORIDA", "CUESTA SAN VICENTE",
        "CTA SAN VICENTE", "VIRGEN DEL PUERTO", "FERRAZ", "URQUIJO",
        "MARTIN DE LOS HEROS"],
    "Universitaria (Seneca - Isaac Peral - Fdez. de los Rios)": [
        "COMPLUTENSE", "SENECA", "ISAAC PERAL", "FERNANDEZ DE LOS RIOS",
        "GUZMAN EL BUENO", "ANDRES MELLADO", "DEHESA DE LA VILLA"],
    "Moncloa (A-6 - Princesa - Alberto Aguilera)": [
        "MONCLOA", "PRINCESA", "ALBERTO AGUILERA", "BLASCO DE GARAY"],
    "Norte (Sinesio Delgado - Filipinas - Cea Bermudez)": [
        "SINESIO DELGADO", "FILIPINAS", "CEA BERMUDEZ",
        "SAN FRANCISCO DE SALES", "SANTANDER"],
}


def strip_accents(s):
    return "".join(c for c in unicodedata.normalize("NFD", s)
                   if unicodedata.category(c) != "Mn")


def fetch(url=FEED, timeout=45):
    req = urllib.request.Request(url, headers={"User-Agent": "traffic-monitor/1.0"})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return r.read()


def parse(raw):
    root = ET.fromstring(raw)
    stamp = (root.findtext("fecha_hora") or "").strip()
    points = []
    for p in root.findall("pm"):
        if (p.findtext("error") or "").strip() != "N":
            continue
        try:
            carga = int(p.findtext("carga") or 0)
            ns = int(p.findtext("nivelServicio") or 0)
            inten = int(p.findtext("intensidad") or 0)
            occ = int(p.findtext("ocupacion") or 0)
        except ValueError:
            continue
        # Sensor bloqueado: sin flujo pero ocupacion al maximo (vehiculo parado
        # sobre la espira). Falsea la media, fuera.
        if inten == 0 and occ >= 90:
            continue
        desc = strip_accents((p.findtext("descripcion") or "").replace("\n", " ").upper())
        points.append({"desc": desc, "carga": carga, "ns": ns,
                       "int": inten, "occ": occ})
    return stamp, points


def score(points, patterns):
    sel = [p for p in points if any(k in p["desc"] for k in patterns)]
    if not sel:
        return None
    cargas = sorted(p["carga"] for p in sel)
    jam = [p for p in sel if p["ns"] >= 2]
    return {
        "n": len(sel),
        "mediana": statistics.median(cargas),
        "p90": cargas[int(len(cargas) * 0.9)] if len(cargas) > 1 else cargas[0],
        "pct_retenido": round(100 * len(jam) / len(sel)),
        "peores": sorted(sel, key=lambda p: -p["carga"])[:3],
    }


def verdict(s):
    """Traduce el score a un estado legible."""
    if s is None:
        return "sin datos"
    m, pct = s["mediana"], s["pct_retenido"]
    if m < 20 and pct < 8:
        return "LIBRE"
    if m < 30 and pct < 18:
        return "FLUIDO"
    if m < 42 or pct < 30:
        return "DENSO"
    return "ATASCADO"


ORDER = {"LIBRE": 0, "FLUIDO": 1, "DENSO": 2, "ATASCADO": 3, "sin datos": 9}


def snapshot():
    stamp, points = parse(fetch())
    out = {
        "feed": stamp,
        "leido": datetime.now(MADRID).strftime("%H:%M"),
        "gate": score(points, GATE),
        "last_mile": score(points, LAST_MILE),
        "rutas": {name: score(points, pats) for name, pats in ROUTES.items()},
    }
    ranked = sorted(out["rutas"].items(),
                    key=lambda kv: (ORDER[verdict(kv[1])],
                                    kv[1]["mediana"] if kv[1] else 999))
    out["mejor_ruta"] = ranked[0][0]
    out["estado_global"] = max(
        [verdict(out["gate"]), verdict(ranked[0][1]), verdict(out["last_mile"])],
        key=lambda v: ORDER[v])
    return out


def render(s):
    L = []
    L.append(f"Feed {s['feed']}  (leido {s['leido']})")
    L.append(f"Salida del club / desborde A-6 : {verdict(s['gate']):9s} "
             f"mediana {s['gate']['mediana']:.0f}  {s['gate']['pct_retenido']}% retenido")
    L.append(f"Ultimo tramo (Chamberi)        : {verdict(s['last_mile']):9s} "
             f"mediana {s['last_mile']['mediana']:.0f}  {s['last_mile']['pct_retenido']}% retenido")
    L.append("")
    for name, sc in sorted(s["rutas"].items(),
                           key=lambda kv: (ORDER[verdict(kv[1])],
                                           kv[1]["mediana"] if kv[1] else 999)):
        mark = "->" if name == s["mejor_ruta"] else "  "
        L.append(f"{mark} {verdict(sc):9s} mediana {sc['mediana']:5.0f}  p90 {sc['p90']:3d}  "
                 f"{sc['pct_retenido']:3d}% ret  n={sc['n']:3d}  {name}")
    L.append("")
    L.append(f"GLOBAL: {s['estado_global']}   mejor ruta: {s['mejor_ruta']}")
    return "\n".join(L)


def main():
    args = sys.argv[1:]
    if "--json" in args:
        print(json.dumps(snapshot(), ensure_ascii=False, indent=2))
        return
    if "--watch" in args:
        every = int(args[args.index("--watch") + 1]) * 60
        last = None
        while True:
            try:
                s = snapshot()
                # Solo el estado global y el de la salida del club disparan aviso.
                # La ruta recomendada NO entra en la clave: cuando dos rutas estan
                # empatadas su orden baila entre lecturas y generaria avisos falsos.
                key = (s["estado_global"], verdict(s["gate"]))
                if key != last:
                    print(f"[{s['leido']}] {s['estado_global']} | salida "
                          f"{verdict(s['gate'])} | mejor: {s['mejor_ruta']}", flush=True)
                    last = key
            except Exception as e:  # una lectura fallida no mata el monitor
                print(f"[warn] {e}", file=sys.stderr, flush=True)
            time.sleep(every)
        return
    print(render(snapshot()))


if __name__ == "__main__":
    main()
