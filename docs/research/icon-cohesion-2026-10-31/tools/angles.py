#!/usr/bin/env python3
"""Angles across the set (cohesion pass, owner 2026-11-01: "making sure the shapes/roundness/angles are all
consistent across all icons"). Measures every straight segment longer than 1 unit in packages/icons/sources and
groups the icons by the angles they use: the axes, 45°, and everything else rounded to the degree (a 1 : 2 slope is
26.6° / 63.4°, an equilateral side 60°). Prints how many icons use each off-lattice angle and which, so that one
kind of shape uses one angle.

  python3 docs/research/icon-cohesion-2026-10-31/tools/angles.py [--min 1]
"""
import collections, glob, math, os, re, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from reradius import parse

MIN = float(sys.argv[sys.argv.index("--min") + 1]) if "--min" in sys.argv else 1.0
use = collections.defaultdict(set)
for f in sorted(glob.glob("packages/icons/sources/*.svg")):
    name = os.path.basename(f)[:-4]; t = open(f).read()
    if "data-alias-of" in t: continue
    for body in re.findall(r"<path\b([^>]*)/>", t):
        a = dict(re.findall(r'([\w-]+)="([^"]*)"', body))
        if a.get("data-filled") in ("gap", "fill", "stroke", "halo", "inset", "cut") or a.get("stroke", "none") == "none": continue
        try: cmds = parse(a["d"])
        except Exception: continue
        x = y = sx = sy = 0
        for c, v in cmds:
            px, py = x, y
            if c == "M": x, y = v; sx, sy = x, y; continue
            if c == "L": x, y = v
            elif c == "H": x = v[0]
            elif c == "V": y = v[0]
            elif c == "Z": x, y = sx, sy
            else:
                x, y = v[-2], v[-1]; continue
            dx, dy = x - px, y - py
            if math.hypot(dx, dy) < MIN: continue
            ang = round(math.degrees(math.atan2(-dy, dx)) % 180)
            fold = min(ang, 180 - ang)  # mirror-symmetric: 30° and 150° are one family
            key = "axis" if fold in (0, 90) else "45" if fold == 45 else f"{fold}°"
            use[key].add(name)
print(f"icons using the axes: {len(use['axis'])}, 45°: {len(use['45'])}")
others = sorted(((k, v) for k, v in use.items() if k not in ("axis", "45")), key=lambda kv: -len(kv[1]))
for k, v in others:
    print(f"{k:>5} {len(v):3}  {' '.join(sorted(v))}")
