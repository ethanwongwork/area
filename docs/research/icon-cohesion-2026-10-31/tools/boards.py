#!/usr/bin/env python3
"""Icon Boards: every Area drawing on shuffled boards of 60 for the owner to flag what looks off
(cohesion pass, 2026-11-01; published at https://claude.ai/artifact/4debUbHgJLDBGmzXcUde6Q, flags in its db
collection `flags`, the weight pick and notes in `decisions`). Reads the 16px build (npm run build -w @area/icons),
leaves out turns and aliases, and stores each drawing once: the page sets the line per display size on the
size curve, so the weight control can show any line across the whole set.

  python3 docs/research/icon-cohesion-2026-10-31/tools/boards.py out.html [--compare SOURCES_DIR] [--label "Name"]
With --compare, both sets are drawn from sources and the page gets a Corners toggle (now / the variant).
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
def from_sources(src):
    """The outline drawn straight from a folder of sources (filled-only parts left out), for comparing a variant."""
    rows = []
    for x in icons:
        if x.get("aliasOf") or x.get("derivedFrom"): continue
        s = open(os.path.join(src, x["name"] + ".svg")).read()
        free = 'data-dot="free"' in s.split(">")[0]
        inner = re.sub(r"^<svg[^>]*>|</svg>\s*$", "", s.strip())
        inner = re.sub(r'<(path|circle|rect)\b[^>]*data-filled="(gap|fill|stroke|halo|inset)"[^>]*/>\n?', "", inner)
        inner = inner.replace(' fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"', ' class="l"')
        if not free:
            inner = re.sub(r'<circle\b([^>]*?)r="([\d.]+)"([^>]*fill="currentColor"[^>]*)/>', lambda m: f'<circle{m.group(1)}r="{m.group(2)}"{m.group(3)} style="--r:{m.group(2)}"/>' if float(m.group(2)) <= 1.25 else m.group(0), inner)
        inner = re.sub(r'\s(data-[\w-]+)="[^"]*"', "", inner).replace("\n", "")
        rows.append({"n": x["name"], "k": x["keyline"], "c": x["category"], "s": inner})
    return rows

alt = None
if "--compare" in sys.argv:
    out = from_sources(os.path.join(ROOT, "packages/icons/sources"))
    alt = from_sources(sys.argv[sys.argv.index("--compare") + 1])
data = json.dumps(out, separators=(",", ":"))
assert "</script" not in data
page = open(os.path.join(HERE, "boards-template.html")).read().replace("__DATA__", data).replace("__ALT__", json.dumps(alt, separators=(",", ":")) if alt else "null").replace("__ALTLABEL__", json.dumps(sys.argv[sys.argv.index("--label") + 1] if "--label" in sys.argv else "Variant"))
open(sys.argv[1], "w").write(page)
print(f"{len(out)} drawings → {sys.argv[1]}")
