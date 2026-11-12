"""Builds the letter-by-letter review page for Area Serif: each letter big, overlaid on Libre Baskerville, Serrif,
Georgia Pro, Inter and Atkinson Hyperlegible Next at one x-height, then set in words; plus a live type tester.

Outlines are drawn from the font files at build time and embedded as SVG paths (comparison renders only; never
committed for the licensed fonts). Live text uses Area Serif (embedded, OFL), Libre Baskerville, Inter and Atkinson
Hyperlegible Next (Google Fonts, OFL), and the viewer's own installed Georgia Pro and Serrif by name (local()).

Usage (from typefaces/area-serif, with its .venv):
  python ../../docs/research/serif-typeface-2026-11-10/tools/letters_page.py OUT.html LETTERS LB.ttf INTER.woff2
"""
import base64
import html
import json
import os
import sys

from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.boundsPen import BoundsPen
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

HERE = os.getcwd()
F = os.path.expanduser("~/Library/Fonts/")
XH = 500            # every face is drawn at this x-height (capitals at this cap height x 1.4)

FACES = [  # key, label, colour token, kind
    ("area", "Area Serif", "--area", "serif"),
    ("lb", "Libre Baskerville", "--lb", "serif"),
    ("serrif", "Serrif", "--serrif", "serif"),
    ("georgia", "Georgia Pro", "--georgia", "serif"),
    ("inter", "Inter", "--inter", "sans"),
    ("atkinson", "Atkinson Hyperlegible Next", "--atkinson", "sans"),
]

WORDS = {  # letter -> words for context, UI-flavoured, the letter in many positions
    "a": ("Save draft as a new area", "data, avatar, alpha, banana, Cancel"),
    "b": ("Billing begins on the 1st", "bubble, tabs, number, Subscribe, blob"),
    "c": ("Check access to the cache", "cancel, accent, cycle, picture, Clock"),
    "d": ("Added to the shared folder", "dashboard, edited, middle, did, Done"),
    "e": ("Delete these three entries", "edge, refresh, settle, between, Enter"),
    "f": ("Filter files from different staff", "after, offset, fifty, prefs, Fluff"),
    "G": ("Go to Groups and Gallery", "Get started, Grid, Guide, GIF"),
    "K": ("Keep KPI tracker keys", "Kit, Kanban, Keyboard, OK"),
    "T": ("Turn on Two-step login", "Today, Tasks, Theme, Total"),
    "W": ("Weekly Workspace review", "Wiki, Window, Web, New Wave"),
    "y": ("Yearly summary, ready today", "type, yellow, any, sync, Yes"),
    "k": ("Keep backups of key links", "kit, desk, bookmark, like, Kick"),
    "R": ("Review Recent Reports", "Run, Reset, Rename, Rows"),
    "X": ("Export to XML or XLSX", "Max, Box, Xcode, Exit"),
    "S": ("Sign in to Settings", "Save, Search, Share, Status"),
    "x": ("Next: fix extra boxes", "box, mix, axis, index, exit"),
    "0": ("Updated 10 min ago", "100%, 2020, 0.05, 300, 1,000"),
    "1": ("1 of 11 files, 1:01 PM", "11, 121, 1.1, 2011, 31"),
    "2": ("Step 2 of 22, $12.20", "22, 2024, 1.2, 222, 42"),
    "3": ("3 comments, 13 replies", "33, 2023, 3.3, 303, 63"),
    "4": ("Page 4 of 44, 14:40", "44, 2014, 4.4, 404, 1,400"),
    "5": ("5 people, 55 views", "55, 2025, 5.5, 505, 15%"),
    "6": ("6 tasks due June 16", "66, 2016, 6.6, 606, 1,600"),
    "7": ("7 days left, 77 items", "77, 2017, 7.7, 707, 17"),
    "8": ("8 of 88 results, 8:08", "88, 2018, 8.8, 808, 1,800"),
    "9": ("9 new, 99+ unread", "99, 2019, 9.9, 909, 1,900"),
}


def load(lb, inter):
    def inst(t, loc):
        return instantiateVariableFont(t, loc) if "fvar" in t else t
    return {
        "area": TTFont("build/AreaSerif-Regular.ttf"),
        "lb": inst(TTFont(lb), {"wght": 400}),
        "serrif": instantiateVariableFont(TTFont(F + "SerrifCollectionVF-TRIAL.ttf"), {"wght": 400, "wdth": 100, "slnt": 0}),
        "georgia": TTFont(F + "GeorgiaPro-Regular.ttf"),
        "inter": inst(TTFont(inter), {"wght": 400}),
        "atkinson": inst(TTFont(F + "AtkinsonHyperlegibleNext-VariableFont_wght.ttf"), {"wght": 400}),
    }


def ref_height(font, ch):
    gs = font.getGlyphSet()
    cmap = font.getBestCmap()
    bp = BoundsPen(gs)
    gs[cmap[ord(ch)]].draw(bp)
    return bp.bounds[3]


def glyph(font, ch, upper):
    """SVG path of ch, scaled to the common x-height (or cap height), ink centred on x = 0, y flipped."""
    gs = font.getGlyphSet()
    cmap = font.getBestCmap()
    name = cmap[ord(ch)]
    h = ref_height(font, "H" if upper else "x")
    k = (XH * 1.4 if upper else XH) / h
    bp = BoundsPen(gs)
    gs[name].draw(bp)
    x0, _, x1, _ = bp.bounds
    cx = (x0 + x1) / 2
    pen = SVGPathPen(gs, ntos=lambda v: f"{v:.1f}".rstrip("0").rstrip("."))
    gs[name].draw(TransformPen(pen, (k, 0, 0, -k, -cx * k, 0)))
    adv = gs[name].width
    return pen.getCommands(), {"advance": adv * k / XH, "ink": (x1 - x0) * k / XH}


def build(out, letters, lb, inter):
    fonts = load(lb, inter)
    defs, cards = [], []
    for ch in letters:
        up = ch.isupper()
        stats = {}
        for key, *_ in FACES:
            d, st = glyph(fonts[key], ch, up)
            stats[key] = st
            defs.append(f'<path id="g-{ord(ch)}-{key}" d="{d}"/>')
        cards.append(card(ch, stats))
    area = base64.b64encode(open("build/AreaSerif-Regular.woff2", "rb").read()).decode()
    page = TEMPLATE.replace("/*AREA_WOFF2*/", area)
    page = page.replace("<!--DEFS-->", "\n".join(defs))
    page = page.replace("<!--CARDS-->", "\n".join(cards))
    page = page.replace("<!--LETTERS-->", html.escape(" ".join(letters)))
    page = page.replace("<!--CHIPS-->", chips())
    open(out, "w").write(page)
    print(out, len(page) // 1024, "KB")


def chips():
    out = []
    for key, label, tok, _ in FACES:
        dis = ' disabled' if key == "area" else ""
        out.append(f'<label class="chip"><input type="checkbox" id="show-{key}" data-face="{key}" checked{dis}>'
                   f'<i style="background:var({tok})"></i>{label}</label>')
    return "\n".join(out)


VB = "-460 -880 920 1200"   # x-height 500 at y -500; ascenders to about -760, descenders to about 260


def plate(ch, keys, cls=""):
    uses = []
    for key in keys:
        role = "fill" if key == "area" else "line"
        uses.append(f'<use href="#g-{ord(ch)}-{key}" class="{role} f-{key}"/>')
    lines = ('<line x1="-460" x2="460" y1="0" y2="0" class="metric"/>'
             '<line x1="-460" x2="460" y1="-500" y2="-500" class="metric"/>')
    return f'<svg viewBox="{VB}" class="plate {cls}" role="img" aria-label="{html.escape(ch)} compared">{lines}{"".join(uses)}</svg>'


def card(ch, stats):
    keys = [k for k, *_ in FACES]
    pairs = "".join(
        f'<figure class="pair f-{k}">{plate(ch, ["area", k])}<figcaption><i style="background:var({tok})"></i>{label}'
        f'<span>{stats[k]["advance"]:.2f}</span></figcaption></figure>'
        for k, label, tok, _ in FACES[1:])
    big, small = WORDS.get(ch.lower(), (ch * 3, ch))
    rows = "".join(
        f'<div class="ctx-row f-{k}"><span class="ctx-label"><i style="background:var({tok})"></i>{label}</span>'
        f'<span class="ctx-big ff-{k}">{html.escape(big)}</span><span class="ctx-small ff-{k}">{html.escape(small)}</span></div>'
        for k, label, tok, _ in FACES)
    table = "".join(
        f'<tr class="f-{k}"><td><i style="background:var({tok})"></i>{label}</td><td>{stats[k]["advance"]:.2f}</td>'
        f'<td>{stats[k]["ink"]:.2f}</td></tr>' for k, label, tok, _ in FACES)
    return f'''
<section class="letter" id="letter-{ord(ch)}">
 <header class="letter-head"><h2><span class="glyph-name">{html.escape(ch)}</span></h2>
  <p class="note">Every face at the same x-height, centred on its ink. Area Serif is the filled shape; the others are outlines.</p></header>
 <div class="letter-grid">
  <div class="hero"><span class="hero-glyph" aria-hidden="true">{html.escape(ch)}</span></div>
  <figure class="all">{plate(ch, keys, "plate-all")}<figcaption>All faces over Area Serif</figcaption></figure>
 </div>
 <div class="pairs">{pairs}</div>
 <div class="facts"><table><thead><tr><th>Face</th><th>Advance ÷ x-height</th><th>Ink width ÷ x-height</th></tr></thead><tbody>{table}</tbody></table></div>
 <div class="ctx">{rows}</div>
</section>'''


TEMPLATE = open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "letters_template.html")).read()

if __name__ == "__main__":
    out, letters, lb, inter = sys.argv[1:5]
    build(out, list(letters), lb, inter)
