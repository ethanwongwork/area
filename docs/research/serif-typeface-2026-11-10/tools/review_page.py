"""Rebuilds the Area Serif review page from a template copy of the page: swaps in the current font, regenerates every
node diagram and overlay from the current build, and inserts extra sections.
Usage (from typefaces/area-serif, with its .venv):
  python ../../docs/research/serif-typeface-2026-11-10/tools/review_page.py TEMPLATE.html OUT.html LB.ttf [SECTION.html ...]
TEMPLATE is the page as published (with or without the publish skeleton). LB.ttf is Libre Baskerville, for overlays.
Each SECTION file's first line is a marker: the section is inserted before the first line of the page that starts
the section is inserted before the section containing that marker text."""
import base64, html, os, re, sys
HERE = os.getcwd()
sys.path.insert(0, HERE)
import ufoLib2
import derive as D
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from overlay import load, svg_tile
from diagram import diagram, counts

NAMES = {"zero": "0", "one": "1", "one.ss01": "1 footless"}


def strip_skeleton(s):
    if "<body>" in s:
        s = s.split("<body>", 1)[1]
    return s.replace("</body></html>", "").lstrip("\n")


def grid_spans(s, cls):
    """(start, end, glyphs) of the inner content of every <div class="{cls}"> (glyphs from data-glyphs, or None)."""
    spans, pos = [], 0
    while True:
        i = s.find(f'<div class="{cls}"', pos)
        if i < 0:
            return spans
        k = s.find(">", i)
        head = s[i:k + 1]
        if head not in (f'<div class="{cls}">',) and 'data-glyphs="' not in head:
            pos = k
            continue
        m = re.search(r'data-glyphs="([^"]*)"', head)
        glyphs = m.group(1).split() if m else None
        j, depth = k + 1, 1
        while depth:
            o, c = s.find("<div", j), s.find("</div>", j)
            if o != -1 and o < c:
                depth, j = depth + 1, o + 4
            else:
                depth, j = depth - 1, c + 6
        spans.append((k + 1, j - 6, glyphs))
        pos = j


def figures(ufo, names):
    out = []
    for n in names:
        c, on, off = counts(ufo, n)
        out.append(f'<figure class="dg"><div class="plate">{diagram(ufo, n)}</div><figcaption><b class="g">'
                   f'{html.escape(NAMES.get(n, n))}</b><span>{c} contour{"s" if c > 1 else ""} · {on} on-curve · '
                   f'{off} handles · advance {ufo[n].width}</span></figcaption></figure>')
    return "".join(out)


# Reference heights per 1000 units: (x-height, cap height), for scaling each reference to Area Serif's.
REF_METRICS = {"L": (530, 770), "S": (498, 721), "G": (481, 693)}


def overlays(fonts, names):
    """Area Serif filled; Libre Baskerville (green), Serrif (red) and Georgia Pro (blue) outlined, each scaled to
    Area Serif's x-height (lowercase) or cap height (capitals and figures)."""
    cm = {k: fonts[k].getBestCmap() for k in REF_METRICS}
    out = []
    for n in names:
        ch = NAMES.get(n, n)
        caps = ch.isupper() or ch.isdigit()
        refs = [(k, cm[k][ord(ch)]) for k in REF_METRICS]
        scale = {k: (D.CAP_HEIGHT / v[1] if caps else D.X_HEIGHT / v[0]) for k, v in REF_METRICS.items()}
        svg = svg_tile(fonts, n, refs, ref_scale=scale)
        out.append(f'<figure class="ov"><div class="plate">{svg}</div><figcaption><b class="g">{html.escape(ch)}'
                   f'</b></figcaption></figure>')
    return "".join(out)


def main():
    tpl, out_path, lb = sys.argv[1:4]
    s = strip_skeleton(open(tpl).read())
    font = base64.b64encode(open("build/AreaSerif-Regular.woff2", "rb").read()).decode()
    s = re.sub(r'base64,[A-Za-z0-9+/=]+\) format\("woff2"\)', f'base64,{font}) format("woff2")', s, count=1)
    for sec in sys.argv[4:]:
        marker, body = open(sec).read().split("\n", 1)
        i = s.find(marker)
        assert i >= 0, marker
        i = s.rfind("<section", 0, i)                  # insert before the section that holds the marker
        s = s[:i] + body + s[i:]
    ufo = ufoLib2.Font.open("build/AreaSerif-Regular.ufo")
    fonts = load()
    fonts["L"] = instantiateVariableFont(TTFont(lb), {"wght": 400})
    plans = {"grid": [["I", "l", "one", "one.ss01"], ["r"],
                      ["H", "I", "n", "o", "a", "c", "e", "g", "r", "s", "f", "y", "J", "R", "Q", "W", "zero", "one"]],
             "grid ovg": [["r"], ["H", "n", "o", "a", "c", "g", "r", "y", "J", "R", "Q", "W"]]}
    for cls, lists in plans.items():
        spans = grid_spans(s, cls)
        defaults = iter(lists)
        jobs = [(a, b, g if g is not None else next(defaults)) for a, b, g in spans]
        for a, b, names in reversed(jobs):
            s = s[:a] + (figures(ufo, names) if cls == "grid" else overlays(fonts, names)) + s[b:]
    blue = '<span><i class="sw" style="background:var(--blue)"></i>Georgia Pro</span>'
    s = re.sub(r'(<span><i class="sw" style="background:var\(--red\)"></i>Serrif[^<]*</span>)(?!<span><i class="sw" style="background:var\(--blue\)")',
               lambda m: m.group(1) + blue, s)
    open(out_path, "w").write(s)
    print(out_path, len(s) // 1024, "KB")


if __name__ == "__main__":
    main()
