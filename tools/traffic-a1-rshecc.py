#!/usr/bin/env python3
"""
Monitor A-1 (Ctra. de Burgos) RSHECC PK 24,6 -> Pza. Castilla -> Pza. Olavide.

Dos fuentes, porque ninguna cubre el trayecto entero:

  1. DGT (etraffic.dgt.es) para el tramo interurbano PK 24,6 -> PK 0. Es el
     tramo que decide el viaje y el unico donde se forma la cola de retorno.
     La respuesta viene en base64 con XOR de un byte (0x66).
  2. Ayuntamiento de Madrid (informo.madrid.es) para Av. de Burgos desde la
     M-40 hasta Pza. Castilla, y de ahi a Olavide por Bravo Murillo.

Uso:
  python3 tools/traffic-a1-rshecc.py
  python3 tools/traffic-a1-rshecc.py --watch 8
"""
import base64
import json
import statistics
import sys
import time
import unicodedata
import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime, timezone, timedelta

DGT = "https://etraffic.dgt.es/etrafficWEB/api/cache/getFilteredData"
INFORMO = "https://informo.madrid.es/informo/tmadrid/pm.xml"
MADRID_TZ = timezone(timedelta(hours=2))

CLUB_PK = 24.6          # RSHECC, Ctra. Madrid-Burgos km 24,600
UPSTREAM_PK = 80.0      # de donde baja el retorno que acabara pasando por el club

# En la A-1 el PK decrece hacia Madrid, asi que sentido Madrid == "negative".
HACIA_MADRID = "negative"


def _post_dgt():
    body = json.dumps({"filtrosVia": [], "filtrosCausa": []}).encode()
    req = urllib.request.Request(DGT, data=body, headers={
        "Content-Type": "application/json",
        "Origin": "https://etraffic.dgt.es",
        "Referer": "https://etraffic.dgt.es/etrafficWEB/",
        "User-Agent": "Mozilla/5.0",
    })
    with urllib.request.urlopen(req, timeout=45) as r:
        payload = r.read()
    plain = bytes(b ^ 0x66 for b in base64.b64decode(payload))
    return json.loads(plain.decode("utf-8")).get("situationsRecords", [])


def _s(rec, key):
    v = rec.get(key)
    return "" if v is None else str(v)


def a1_incidents():
    """Incidencias DGT en la A-1 de Madrid, separadas por tramo relevante."""
    recs = _post_dgt()
    out = {"en_ruta": [], "aguas_arriba": [], "otro_sentido": [], "retenciones": []}
    for r in recs:
        prov = (_s(r, "provinciaIni") + _s(r, "provinciaFin")).upper()
        via = _s(r, "carretera").upper().replace(" ", "")
        ns = _s(r, "nivelServicio").lower()
        if "MADRID" not in prov:
            continue
        if not via.startswith("A-1"):
            continue
        try:
            pk = float(_s(r, "pkIni") or -1)
        except ValueError:
            continue
        item = {
            "pk": pk,
            "municipio": _s(r, "municipioIni"),
            "causa": f'{_s(r, "causa")} / {_s(r, "subcausa")}'.strip(" /"),
            "desde": _s(r, "fechaInicio")[11:16],
            "ns": ns,
        }
        # Retencion declarada en la A-1 hacia Madrid, dentro del tramo que le
        # afecta: esto si complica el viaje. Una retencion en otra via de la
        # provincia no, y contarla era lo que disparaba falsos avisos.
        if (ns and ns not in ("fluido", "normal")
                and _s(r, "sentido") == HACIA_MADRID and pk <= UPSTREAM_PK):
            out["retenciones"].append(item)
        if _s(r, "sentido") != HACIA_MADRID:
            out["otro_sentido"].append(item)
        elif pk <= CLUB_PK:
            out["en_ruta"].append(item)          # entre el club y Madrid
        elif pk <= UPSTREAM_PK:
            out["aguas_arriba"].append(item)     # le caera encima despues
    for k in out:
        if k != "retenciones":
            out[k].sort(key=lambda d: d["pk"])
    return out


def _strip(s):
    return "".join(c for c in unicodedata.normalize("NFD", s)
                   if unicodedata.category(c) != "Mn")


def city_segments():
    """Av. de Burgos (M-40 -> Pza. Castilla) y Pza. Castilla -> Olavide."""
    req = urllib.request.Request(INFORMO, headers={"User-Agent": "traffic-monitor/1.0"})
    with urllib.request.urlopen(req, timeout=45) as r:
        root = ET.fromstring(r.read())
    pts = []
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
        if inten == 0 and occ >= 90:      # espira bloqueada
            continue
        pts.append((_strip((p.findtext("descripcion") or "").replace("\n", " ").upper()),
                    carga, ns))
    segs = {
        "Av. de Burgos (M-40 -> Pza. Castilla)":
            ["AV. BURGOS", "AV.BURGOS", "CTRA. BURGOS", "PIO XII"],
        "Pza. Castilla -> Olavide":
            ["PL.CASTILLA", "MATEO INURRIA", "BRAVO MURILLO", "SANTA ENGRACIA",
             "ALVAREZ DE CASTRO", "QUEVEDO", "RIOS ROSAS"],
    }
    res = {}
    for name, keys in segs.items():
        sel = [p for p in pts if any(k in p[0] for k in keys)]
        if not sel:
            continue
        cargas = sorted(p[1] for p in sel)
        res[name] = {
            "n": len(sel),
            "mediana": statistics.median(cargas),
            "pct_retenido": round(100 * sum(1 for p in sel if p[2] >= 2) / len(sel)),
        }
    return root.findtext("fecha_hora"), res


def render():
    inc = a1_incidents()
    stamp, segs = city_segments()
    L = [f"A-1 RSHECC (PK {CLUB_PK}) -> Pza. Castilla -> Olavide",
         f"leido {datetime.now(MADRID_TZ):%H:%M}  |  feed municipal {stamp}", ""]

    L.append(f"[DGT] Tramo que recorres  PK {CLUB_PK} -> 0, sentido Madrid:")
    L.append("   sin incidencias" if not inc["en_ruta"] else "")
    for i in inc["en_ruta"]:
        L.append(f"   PK {i['pk']:>6.2f}  {i['causa']}  ({i['municipio']}, desde {i['desde']})")

    L.append("")
    L.append(f"[DGT] Aguas arriba  PK {CLUB_PK} -> {UPSTREAM_PK} (lo que baja hacia ti):")
    L.append("   sin incidencias" if not inc["aguas_arriba"] else "")
    for i in inc["aguas_arriba"]:
        L.append(f"   PK {i['pk']:>6.2f}  {i['causa']}  ({i['municipio']}, desde {i['desde']})")

    ret = inc["retenciones"]
    L.append("")
    L.append(f"[DGT] Retenciones declaradas en la A-1 hacia Madrid: {len(ret)}"
             + ("" if ret else "  (ninguna)"))
    for r in ret[:6]:
        L.append(f"   PK {r['pk']:>6.2f}  nivel {r['ns']}  ({r['municipio']}, desde {r['desde']})")

    L.append("")
    for name, s in segs.items():
        state = ("LIBRE" if s["mediana"] < 20 and s["pct_retenido"] < 8
                 else "FLUIDO" if s["mediana"] < 30 else "DENSO")
        L.append(f"[Madrid] {name}: {state}  mediana {s['mediana']:.0f}  "
                 f"{s['pct_retenido']}% retenido  (n={s['n']})")

    # COMPLICADO exige cola declarada en la A-1. Incidencias sueltas (un coche
    # parado) son OJO: pueden sembrar cola, pero todavia no la son.
    veredicto = ("COMPLICADO" if ret
                 else "OJO" if inc["en_ruta"] or inc["aguas_arriba"]
                 else "DESPEJADO")
    L.append("")
    L.append(f"VEREDICTO: {veredicto}")
    return "\n".join(L), veredicto


def main():
    args = sys.argv[1:]
    if "--watch" in args:
        every = int(args[args.index("--watch") + 1]) * 60
        last = None
        while True:
            try:
                _, v = render()
                if v != last:
                    print(f"[{datetime.now(MADRID_TZ):%H:%M}] A-1: {v}", flush=True)
                    last = v
            except Exception as e:
                print(f"[warn] {e}", file=sys.stderr, flush=True)
            time.sleep(every)
        return
    print(render()[0])


if __name__ == "__main__":
    main()
