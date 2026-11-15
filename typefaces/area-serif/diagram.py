"""Node diagrams of the Area Serif source (build/AreaSerif-Regular.ufo): the cubic points as drawn, on a 10-unit
grid, with metric lines, sidebearings, handles and the coordinates of every on-curve node.
Squares are corners, circles smooth nodes, small rings off-curve handles.
Usage: python diagram.py H O n o ...   -> build/diagrams/<glyph>.svg, and returns SVG strings via diagram()."""
import os
import sys
import ufoLib2
from fontTools.pens.svgPathPen import SVGPathPen

HERE = os.path.dirname(os.path.abspath(__file__))
UFO = os.path.join(HERE, "build", "AreaSerif-Regular.ufo")


def diagram(font, name, labels=True):
    g = font[name]
    info = font.info
    top, bot = 1000, -300
    left, right = -80, max(g.width, 300) + 80
    W, H = right - left, top - bot
    out = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{left} {-top} {W} {H}" class="dg" role="img" '
           f'aria-label="{name} with its nodes">']
    out.append(f'<rect x="{left}" y="{-top}" width="{W}" height="{H}" fill="#fff"/>')
    # grid: 10-unit minor, 50 and 100 major
    for x in range((left // 10) * 10, right + 1, 10):
        w = 1.4 if x % 100 == 0 else (0.9 if x % 50 == 0 else 0.45)
        out.append(f'<line x1="{x}" y1="{-top}" x2="{x}" y2="{-bot}" stroke="#000" stroke-opacity=".09" stroke-width="{w}"/>')
    for y in range((bot // 10) * 10, top + 1, 10):
        w = 1.4 if y % 100 == 0 else (0.9 if y % 50 == 0 else 0.45)
        out.append(f'<line x1="{left}" y1="{-y}" x2="{right}" y2="{-y}" stroke="#000" stroke-opacity=".09" stroke-width="{w}"/>')
    # metric lines
    for y, lab in ((0, "0"), (info.xHeight, f"x {info.xHeight}"), (info.capHeight, f"cap {info.capHeight}"),
                   (info.ascender, f"asc {info.ascender}"), (info.descender, f"desc {info.descender}")):
        out.append(f'<line x1="{left}" y1="{-y}" x2="{right}" y2="{-y}" stroke="#2456c9" stroke-opacity=".55" stroke-width="2"/>')
        out.append(f'<text x="{left + 6}" y="{-y - 8}" font-size="20" fill="#2456c9" font-family="ui-monospace,Menlo,monospace">{lab}</text>')
    for x in (0, g.width):
        out.append(f'<line x1="{x}" y1="{-top}" x2="{x}" y2="{-bot}" stroke="#2456c9" stroke-opacity=".55" stroke-width="2" stroke-dasharray="8 6"/>')
    out.append(f'<text x="{g.width - 4}" y="{-bot - 14}" font-size="20" text-anchor="end" fill="#2456c9" '
               f'font-family="ui-monospace,Menlo,monospace">{g.width}</text>')
    # fill and outline
    pen = SVGPathPen(font)
    g.draw(pen)
    d = pen.getCommands()
    out.append(f'<path d="{d}" transform="scale(1 -1)" fill="#16191e" fill-opacity=".12" stroke="#16191e" '
               f'stroke-width="2.4" fill-rule="nonzero"/>')
    # handles, nodes, labels
    marks, texts = [], []
    for c in g.contours:
        pts = c.points
        n = len(pts)
        for k, p in enumerate(pts):
            if p.type is None:
                # draw the handle line to the on-curve neighbour it belongs to
                for nb in (pts[(k - 1) % n], pts[(k + 1) % n]):
                    if nb.type:
                        marks.append(f'<line x1="{p.x}" y1="{-p.y}" x2="{nb.x}" y2="{-nb.y}" stroke="#c8322b" stroke-width="1.6"/>')
                        break
                marks.append(f'<circle cx="{p.x}" cy="{-p.y}" r="5" fill="#fff" stroke="#c8322b" stroke-width="2"/>')
            elif p.smooth:
                marks.append(f'<circle cx="{p.x}" cy="{-p.y}" r="7" fill="#16191e"/>')
            else:
                marks.append(f'<rect x="{p.x - 6.5}" y="{-p.y - 6.5}" width="13" height="13" fill="#16191e"/>')
            if p.type and labels:
                texts.append(f'<text x="{p.x + 10}" y="{-p.y - 10}" font-size="15" fill="#16191e" '
                             f'font-family="ui-monospace,Menlo,monospace" paint-order="stroke" stroke="#fff" '
                             f'stroke-width="4">{round(p.x)},{round(p.y)}</text>')
    out += marks + texts
    for comp in g.components:
        out.append(f'<text x="{left + 6}" y="{-top + 30}" font-size="20" fill="#5b6370">component {comp.baseGlyph}</text>')
    out.append("</svg>")
    return "".join(out)


def counts(font, name):
    g = font[name]
    on = sum(1 for c in g.contours for p in c.points if p.type)
    off = sum(1 for c in g.contours for p in c.points if p.type is None)
    return len(g.contours), on, off


if __name__ == "__main__":
    font = ufoLib2.Font.open(UFO)
    os.makedirs(os.path.join(HERE, "build", "diagrams"), exist_ok=True)
    for name in sys.argv[1:]:
        with open(os.path.join(HERE, "build", "diagrams", f"{name}.svg"), "w") as fh:
            fh.write(diagram(font, name))
        print(name, "contours/on/off", counts(font, name))
