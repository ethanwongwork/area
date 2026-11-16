"""Which glyphs changed between two builds, and by how much: the farthest any point of the new outline lies from the
old outline (and the other way), in units. Usage: python changed.py OLD.ufo [NEW.ufo] [--min 0.6] [--names]"""
import sys

import numpy as np
import ufoLib2
from scipy.spatial import cKDTree

import evlib as E


def pts(font, name, step=1.0):
    pen = E.SegPen(font)
    try:
        font[name].draw(pen)
    except Exception:                                   # noqa: BLE001
        return None
    p = [q for poly in E.flatten([c for c in pen.contours if c], step) for q in poly]
    return np.array(p) if p else np.zeros((0, 2))


def compare(old, new, floor=0.6):
    rows = []
    for g in new:
        n = g.name
        b = pts(new, n)
        if n not in old:
            rows.append((n, None, "new"))
            continue
        a = pts(old, n)
        if a is None or b is None:
            continue
        if len(a) == 0 and len(b) == 0:
            if old[n].width != g.width:
                rows.append((n, 0.0, f"advance {old[n].width}>{g.width}"))
            continue
        if len(a) == 0 or len(b) == 0:
            rows.append((n, None, "outline appeared or went"))
            continue
        # compare shapes with the ink's left edge aligned, so a re-spaced glyph is not read as a redrawn one
        shift = b[:, 0].min() - a[:, 0].min()
        a2 = a + [shift, 0]
        d = max(cKDTree(a2).query(b)[0].max(), cKDTree(b).query(a2)[0].max())
        note = []
        if abs(shift) > 0.5:
            note.append(f"ink moved {shift:+.0f}")
        if old[n].width != g.width:
            note.append(f"advance {old[n].width}>{g.width}")
        if d > floor or note:
            rows.append((n, float(d), ", ".join(note)))
    return rows


def main():
    floor = float(sys.argv[sys.argv.index("--min") + 1]) if "--min" in sys.argv else 0.6
    skip = {sys.argv.index("--min") + 1} if "--min" in sys.argv else set()
    a = [x for i, x in enumerate(sys.argv) if i and not x.startswith("--") and i not in skip]
    old = ufoLib2.Font.open(a[0])
    new = ufoLib2.Font.open(a[1] if len(a) > 1 else E.AREA_UFO)
    rows = compare(old, new, floor)
    shape = [r for r in rows if r[1] is None or r[1] > floor]
    if "--names" in sys.argv:
        print(" ".join(r[0] for r in shape))
        return
    for n, d, note in sorted(rows, key=lambda r: -(r[1] if r[1] is not None else 1e9)):
        print(f"{n:24} {'' if d is None else f'{d:6.1f}'}  {note}")
    print(f"{len(shape)} glyphs changed shape by more than {floor}; {len(rows) - len(shape)} only moved or re-spaced")


if __name__ == "__main__":
    main()
