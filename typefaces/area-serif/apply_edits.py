"""Folds the owner's saved glyphs from the point editor page into owner_edits.json, which normalize.py applies last.

Each edit is stored as the moves the owner made, point by point, against the build the editor showed (the current
build/AreaSerif-Regular.ufo when this runs right after pulling), plus the saved coordinates: a moved point goes
exactly where the owner put it, while every point they did not move keeps following the rules. Pull before every
rebuild of the editor, or a save made on the old build is diffed against the wrong points. So every later rule
change (serif shape, weight, spacing) still reaches an edited glyph, and the owner's moves ride on top of it.
Glyphs saved without any moved point carry only their note.

Claude reads the page's db with ArtifactData (`list`/`query`, collection `edits`, with `out_dir`; upper and lower
case in separate folders on a case-insensitive disk), then runs:
  python apply_edits.py DIR [DIR ...]      # each DIR holds edits/<glyph>.json as ArtifactData wrote them
"""
import json
import os
import sys

import ufoLib2

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "owner_edits.json")


def main(dirs):
    ufo = ufoLib2.Font.open(os.path.join(HERE, "build", "AreaSerif-Regular.ufo"))
    old = json.load(open(OUT)) if os.path.exists(OUT) else {}
    edits = dict(old)
    for src in dirs:
        folder = os.path.join(src, "edits") if os.path.isdir(os.path.join(src, "edits")) else src
        for f in sorted(os.listdir(folder)):
            if not f.endswith(".json"):
                continue
            doc = json.load(open(os.path.join(folder, f)))
            b = doc.get("data", doc)
            name = b.get("glyph") or f[:-5]
            g = ufo[name]
            if [len(c.points) for c in g.contours] != [len(c) for c in b["contours"]]:
                print(f"{name}: skipped, its points changed since the editor was made")
                continue
            moves, smooth = [], []
            for ci, (c, ce) in enumerate(zip(g.contours, b["contours"])):
                for pi, (p, (x, y, t, sm)) in enumerate(zip(c.points, ce)):
                    if (x, y) != (p.x, p.y):
                        moves.append([ci, pi, x - p.x, y - p.y])
                    if bool(sm) != bool(p.smooth):
                        smooth.append([ci, pi, int(bool(sm))])
            entry = {"note": b.get("note", ""), "savedAt": b.get("savedAt"), "moves": moves, "smooth": smooth,
                     "shape": [len(c.points) for c in g.contours],
                     "advance": (b.get("advance") - g.width) if b.get("advance") is not None else 0,
                     # every point as the owner left it: normalize.py puts each moved point exactly here
                     "saved": [[[round(x, 1), round(y, 1)] for x, y, *_ in c] for c in b["contours"]]}
            prev = edits.get(name)
            if prev and prev.get("savedAt") == entry["savedAt"]:
                continue                                    # already folded in
            if prev:                                        # a newer save adds its moves to the earlier ones
                acc = {(ci, pi): [dx, dy] for ci, pi, dx, dy in prev["moves"]}
                for ci, pi, dx, dy in moves:
                    a = acc.setdefault((ci, pi), [0, 0])
                    a[0] += dx
                    a[1] += dy
                entry["moves"] = [[ci, pi, dx, dy] for (ci, pi), (dx, dy) in sorted(acc.items()) if dx or dy]
                entry["advance"] += prev.get("advance", 0)
            edits[name] = entry
    json.dump(edits, open(OUT, "w"), indent=1)
    moved = sorted(n for n, e in edits.items() if e["moves"])
    print(f"{len(moved)} glyph(s) with moved points: {' '.join(moved)}")
    for n, e in sorted(edits.items()):
        if e["note"]:
            print(f"  {n}: {e['note']}")


if __name__ == "__main__":
    main(sys.argv[1:])
