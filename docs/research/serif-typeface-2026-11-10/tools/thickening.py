"""Area Serif 0.81 (owner round 2): do strokes thicken evenly? From audit_bold.py's part readings of each master
(build/weight/audit-bold.txt, written per master), the growth of every part from the Regular, grouped by part kind:
median, spread, and the glyph farthest from its kind's median.

    python thickening.py PARTS_LIGHT.txt PARTS_BOLD.txt > table.txt

A kind mixes sub-kinds the face sets apart on purpose (an upright stroke is a stem or a thin upright; a slanted
stroke thick or thin; a level stroke a hairline or a bar), so the spread is read per kind and per Regular size band
(the ladder's steps: under 40, 40 to 60, 60 to 90, over 90 units)."""
import re
import statistics as st
import sys


def read(path):
    out = []
    for line in open(path):
        m = re.match(r"(\S+)\s+(.*?)\s+(\d[\d.]*)\s+(\d[\d.]*)\s+(\d[\d.]*)\s+(\S+)$", line.strip())
        if m:
            g, kind, reg, _t, got, _ok = m.groups()
            out.append((g, re.sub(r" at .*", "", kind), float(reg), float(got)))
    return out


def band(r):
    return "<40" if r < 40 else "40-60" if r < 60 else "60-90" if r < 90 else ">90"


def main(light, bold):
    print(f"{'part (Regular size)':30}{'master':>7}{'n':>5}{'median':>8}{'min':>7}{'max':>7}  farthest from the median")
    for label, path in (("300", light), ("700", bold)):
        rows = {}
        for g, kind, reg, got in read(path):
            if reg > 0:
                rows.setdefault((kind, band(reg)), []).append((g, got / reg))
        for (kind, b), r in sorted(rows.items()):
            if len(r) < 3:
                continue
            med = st.median(x for _, x in r)
            w = max(r, key=lambda t: abs(t[1] - med))
            flag = "  > JND" if abs(w[1] / med - 1) > 0.03 else ""
            print(f"{kind + ' ' + b:30}{label:>7}{len(r):5}{med:8.3f}{min(x for _, x in r):7.3f}{max(x for _, x in r):7.3f}"
                  f"  {w[0]} {w[1]:.3f} ({(w[1] / med - 1) * 100:+.1f}%){flag}")


if __name__ == "__main__":
    main(*sys.argv[1:3])
