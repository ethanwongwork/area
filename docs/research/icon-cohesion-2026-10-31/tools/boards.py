#!/usr/bin/env python3
"""Icon Boards: every Area drawing on shuffled boards of 60 for the owner to flag what looks off
(cohesion pass, 2026-11-01; published at https://claude.ai/artifact/4debUbHgJLDBGmzXcUde6Q, flags in its db
collection `flags`, the weight pick and notes in `decisions`). Reads the 16px build (npm run build -w @area/icons),
leaves out turns and aliases, and stores each drawing once: the page sets the line per display size on the
size curve, so the weight control can show any line across the whole set.

  python3 docs/research/icon-cohesion-2026-10-31/tools/boards.py out.html
then publish out.html as the same artifact (Artifact tool, url above).
"""
import json, os, re, sys

ROOT, HERE = os.getcwd(), os.path.dirname(os.path.abspath(__file__))
icons = json.load(open(os.path.join(ROOT, "packages/icons/dist/icons.json")))
out = []
for x in icons:
    if x.get("aliasOf") or x.get("derivedFrom"): continue
    s = open(os.path.join(ROOT, f"packages/icons/dist/svg/16/{x['name']}.svg")).read()
    inner = re.sub(r"^<svg[^>]*>|</svg>$", "", s)
    inner = inner.replace(' fill="none" stroke="currentColor" style="stroke-width:1.125" stroke-linecap="round" stroke-linejoin="round"', ' class="l"')
    inner = re.sub(r'style="r:([0-9.]+)px"', lambda m: 'style="--r:%s"' % round(float(m.group(1)), 4), inner)
    inner = re.sub(r"></(path|rect|circle)>", "/>", inner)
    assert "stroke-width" not in inner, x["name"]
    out.append({"n": x["name"], "k": x["keyline"], "c": x["category"], "s": inner})
data = json.dumps(out, separators=(",", ":"))
assert "</script" not in data
page = open(os.path.join(HERE, "boards-template.html")).read().replace("__DATA__", data)
open(sys.argv[1], "w").write(page)
print(f"{len(out)} drawings → {sys.argv[1]}")
