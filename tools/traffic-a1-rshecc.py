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
import argparse
import base64
import json
import os
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

LOG = os.path.join(os.path.dirname(os.path.abspath(__file__)),
                   "..", "knowledge", "a1-retorno-2026-08-30.jsonl")

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
        try:
            pk_fin = float(_s(r, "pkFin") or pk)
        except ValueError:
            pk_fin = pk
        item = {
            "pk": pk,
            "pk_fin": pk_fin,
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
        med = statistics.median(cargas)
        pct = round(100 * sum(1 for p in sel if p[2] >= 2) / len(sel))
        res[name] = {
            "n": len(sel), "mediana": med, "pct_retenido": pct,
            "estado": ("LIBRE" if med < 20 and pct < 8
                       else "FLUIDO" if med < 30 else "DENSO"),
        }
    return root.findtext("fecha_hora"), res


def _state_key(inc, segs):
    """Lo que hace que una lectura merezca aviso.

    El veredicto solo no basta: una incidencia nueva en el tramo que recorre
    (una regulacion especial en su punto de incorporacion, por ejemplo) no
    mueve el veredicto y pasaria desapercibida. La clave incluye por tanto
    que hay exactamente en su tramo y como estan los dos tramos urbanos.
    """
    en_ruta = tuple(sorted((round(i["pk"], 1), i["causa"]) for i in inc["en_ruta"]))
    arriba = tuple(sorted((round(i["pk"], 1), i["causa"]) for i in inc["aguas_arriba"]))
    ret = tuple(sorted(round(i["pk"], 1) for i in inc["retenciones"]))
    ciudad = tuple(sorted((n, s["estado"]) for n, s in segs.items()))
    return (ret, en_ruta, arriba, ciudad)


def sample():
    """Una muestra plana y apilable del estado de la A-1 hacia Madrid.

    km_cola es la suma de los tramos declarados en congestion: es la medida
    que de verdad cuenta la gravedad. Un solo tramo de 3 km y tres tramos de
    1 km salen igual de "1 retencion" pero no se sufren igual.
    """
    inc = a1_incidents()
    stamp, segs = city_segments()
    ret = inc["retenciones"]
    km = round(sum(abs(r["pk"] - r["pk_fin"]) for r in ret), 1)
    orden = {"low": 1, "medium": 2, "high": 3, "highest": 4}
    return {
        "t": datetime.now(MADRID_TZ).strftime("%Y-%m-%dT%H:%M"),
        "n_colas": len(ret),
        "km_cola": km,
        "nivel_max": max((r["ns"] for r in ret), key=lambda n: orden.get(n, 0),
                         default=""),
        "pk_max": max((r["pk"] for r in ret), default=None),
        "pk_min": min((r["pk_fin"] for r in ret), default=None),
        "colas": [{"desde": r["pk"], "hasta": r["pk_fin"], "nivel": r["ns"],
                   "municipio": r["municipio"]} for r in ret],
        "n_incidencias": len(inc["en_ruta"]) + len(inc["aguas_arriba"]),
        "burgos": segs.get("Av. de Burgos (M-40 -> Pza. Castilla)", {}).get("mediana"),
        "castilla_olavide": segs.get("Pza. Castilla -> Olavide", {}).get("mediana"),
        "feed": stamp,
    }


def log_sample(path=LOG):
    s = sample()
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "a", encoding="utf-8") as f:
        f.write(json.dumps(s, ensure_ascii=False) + "\n")
    return s


def report(path=LOG):
    """Cuando se jodio todo, segun el registro acumulado."""
    if not os.path.exists(path):
        return "Sin registro todavia."
    rows = [json.loads(l) for l in open(path, encoding="utf-8") if l.strip()]
    rows.sort(key=lambda r: r["t"])
    if not rows:
        return "Registro vacio."
    con_cola = [r for r in rows if r["n_colas"]]
    L = [f"Registro A-1 sentido Madrid: {len(rows)} muestras, "
         f"{rows[0]['t'][11:]} -> {rows[-1]['t'][11:]}"]
    if not con_cola:
        L.append("Nunca se declaro cola.")
        return "\n".join(L)
    peor = max(con_cola, key=lambda r: (r["km_cola"], r["n_colas"]))
    L.append(f"Primera cola declarada : {con_cola[0]['t'][11:]}  "
             f"{con_cola[0]['km_cola']} km  nivel {con_cola[0]['nivel_max']}")
    L.append(f"PEOR MOMENTO           : {peor['t'][11:]}  "
             f"{peor['km_cola']} km  nivel {peor['nivel_max']}"
             + (f"  PK {peor['pk_max']} -> {peor['pk_min']}"
                if peor["pk_max"] is not None else ""))
    L.append(f"Ultima cola declarada  : {con_cola[-1]['t'][11:]}  "
             f"{con_cola[-1]['km_cola']} km")
    L.append("")
    L.append("Evolucion (km de cola por muestra):")
    for r in rows:
        barra = "#" * int(min(r["km_cola"], 40))
        L.append(f"  {r['t'][11:]}  {r['km_cola']:5.1f} km  {r['nivel_max']:<7} {barra}")
    return "\n".join(L)


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
        L.append(f"[Madrid] {name}: {s['estado']}  mediana {s['mediana']:.0f}  "
                 f"{s['pct_retenido']}% retenido  (n={s['n']})")

    # COMPLICADO exige cola declarada en la A-1. Incidencias sueltas (un coche
    # parado) son OJO: pueden sembrar cola, pero todavia no la son.
    veredicto = ("COMPLICADO" if ret
                 else "OJO" if inc["en_ruta"] or inc["aguas_arriba"]
                 else "DESPEJADO")
    L.append("")
    L.append(f"VEREDICTO: {veredicto}")
    return "\n".join(L), veredicto, _state_key(inc, segs), inc


def main():
    args = sys.argv[1:]
    if "--report" in args:
        print(report())
        return
    if "--log" in args:
        s = log_sample()
        print(f"[{s['t'][11:]}] {s['n_colas']} colas  {s['km_cola']} km  "
              f"nivel {s['nivel_max'] or '-'}")
        return
    if "--watch" in args:
        every = int(args[args.index("--watch") + 1]) * 60
        last = None
        while True:
            try:
                _, v, key, inc = render()
                if key != last:
                    ruta = "; ".join(f"PK {i['pk']:.2f} {i['causa']}"
                                     for i in inc["en_ruta"]) or "tramo limpio"
                    ret = (f"  RETENCION en PK "
                           + ", ".join(f"{i['pk']:.2f}" for i in inc["retenciones"])
                           if inc["retenciones"] else "")
                    print(f"[{datetime.now(MADRID_TZ):%H:%M}] A-1 {v}: {ruta}{ret}",
                          flush=True)
                    last = key
            except Exception as e:
                print(f"[warn] {e}", file=sys.stderr, flush=True)
            time.sleep(every)
        return
    print(render()[0])


if __name__ == "__main__":
    main()
