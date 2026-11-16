"""Puts "What changed in 0.81" (newest first, above everything else) into a generated review page: the 0.81 entry of
changes.json as plain sentences, then the build's figures, each embedded (JPEG, at most 1400 px wide) under its title.
Local files only; nothing is published.

    python page_081.py PAGE.html FIGDIR [OUT.html]
"""
import base64
import html
import io
import json
import os
import re
import sys

from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
TITLES = [
    ("1-g-before-after.png", "g: 0.80 over 0.81 (the loop rebuilt)"),
    ("1-gss02-before-after.png", "g.ss02: 0.80 over 0.81 (the half-ellipse tail)"),
    ("2-jy-before-after.png", "j and y: one tail family"),
    ("2-a-exit-before-after.png", "The a's exit"),
    ("3-alternates.png", "Every alternate: off, then on"),
    ("3-alternates-weights.png", "Alternates at 300, 400 and 700"),
    ("4-a-exploration.png", "The single-storey a: four constructions, d chosen"),
    ("5-signs-struck.png", "Signs and struck glyphs: 0.80 over 0.81 at 300, 400, 550, 700"),
    ("6-waterfall.png", "Weights 300 to 700 in steps of 50"),
    ("7-text-sizes.png", "Text at 13 and 16 px at five weights"),
    ("8-kerning.png", "Kerning: 0.80 over 0.81 at 300 and 700"),
    ("9-stump-struck.png", "Your decision: Ⱥ and the T with a diagonal stroke at the Bold, honest overlap or stump"),
    ("10-taper.png", "Thickness along j, y, f and eng at 300, 400, 700: before over after the taper law"),
    ("11-rays-flags.png", "What the second method still flags, each drawn (grey 400, red the flagged weight)"),
    ("12-quotes.png", "Quotes at 400 and 700 (the Bold's wider quotes in text)"),
    ("12-asterisk.png", "The asterisk among Bold punctuation"),
    ("12-marks.png", "Every composite with two or more marks at 300, 400, 700"),
    ("12-necks-light.png", "The neck rule in the Light: S, z, superiors, barred z"),
    ("12-ae-bold.png", "ae at 400, 550, 700 (the arm-crotch rule)"),
    ("13-at.png", "@ at 400, 550, 700: before over after the slanted-stem rule (red: the thinnest cut across the stroke)"),
    ("13-asterisk.png", "The asterisk at 400 and 700: before over after its longer reach"),
    ("13-word-space-j.png", "A word space before j at 400 and 700: before over after"),
    ("13-comma-cut.png", "The comma accent below a capital: the old upright cut and the cut across the stroke"),
    ("13-hook-above.png", "The capital hook above in the close round (its slot closed from 552; fixed in the last round, figure 14)"),
    ("14-hook-above.png", "Last round: both hook-above marks at 300, 400, 552, 700, before over after (a curl and a stem), and composites"),
    ("14-c-barb.png", "Last round: C's lower barb at 400 to 700, before over after (the second check's ray)"),
    ("14-at.png", "Last round: @ at 400, 550, 700, before over after (no nub over the stem at the Bold)"),
    ("14-thin-reading.png", "Last round: the weight check's thinnest cut, the Regular's thinnest anywhere against the same place"),
]


def img_tag(path, width=1400):
    im = Image.open(path).convert("RGB")
    if im.width > width:
        im = im.resize((width, round(im.height * width / im.width)), Image.LANCZOS)
    buf = io.BytesIO()
    im.save(buf, "JPEG", quality=80, optimize=True)
    b64 = base64.b64encode(buf.getvalue()).decode()
    return f'<img alt="" loading="lazy" style="max-width:100%;height:auto;display:block;border:1px solid #ddd" src="data:image/jpeg;base64,{b64}">'


# 0.81 (owner round, 15 November): the owner's three points first, each figure open under a two-line caption: what
# changed, then what is still open
STAGE4 = [
    ("18-lines.png", "Owner round 4: \"sass Sess access cosy\" and \"xyz vxy oxo nxn exit taxi Xx\" at 300, 400, 550, 700, "
     "before then after. The s at the Bold is lighter and narrower: its two turns now grow as the round strokes do and its "
     "barbs grow as C's, S's and G's, so it no longer leans (its lean at 700 moved inside the references' range).",
     "Open: the x is unchanged: with its thick stroke at the Regular's slant, each end's two openings (at the bracket "
     "and at the serif's end) cannot both meet their widths under the bracket and serif rules; S and c's lower right, "
     "and the Light g's loop, are not done."),
]

STAGE3 = [
    ("17-advance.png", "Owner round 3, are the Bold's diagonal letters too wide? Each letter's advance growth from 400 to 700 "
     "over its class's upright (n, H), against Georgia Pro and Source Serif 4 (grey band): only the x stands outside "
     "(1.134 against 0.997 to 1.032); v w y z V W X Y Z K A M sit in or at the band.",
     "Open: the x. Keeping its thick stroke's angle needs its openings set where they are measured; not in this build."),
    ("17-lean.png", "Owner round 3, lean at 700 against the references' band, on this build.",
     "Open: x s z G S X e g w a c, and the 9 and 6's slight drift; the round letters' parts were measured (s's barbs grow "
     "1.05 where the references' grow 1.27 to 1.53) but no fix moved them into the band."),
]

STAGE2 = [
    ("16-figures.png", "Owner round 2, the 9 and the 6: the 9's lower right is fuller (its quarter 0.90 as wide as tall, was 0.76; "
     "its right edge leans 23.6 degrees, was 17.6; references 24.5 to 25.8), its ball under the bowl's left side; the 6 is the "
     "same drawing turned. The 5's upright stroke leans 5.4 degrees, was 9.5 (references 4.0 to 6.7).",
     "Open: the 9's and 6's ink now drifts a little more between top and bottom as the weight rises (0.026 of the height at 700, "
     "references under 0.009); the 3 needed nothing."),
    ("16-lean.png", "Owner round 2, lean as the weight rises: each letter's top half against its bottom half at 700, the "
     "references' band in grey. The 5 moved into line; a fix for the x (its thick stroke kept at the Regular's slant) brought "
     "it inside the band in a trial build.",
     "Open: that fix is not in this build: it narrowed the x's openings past their target and thinned the ampersand's crossing; "
     "s, z, G, S, X, e, g, w, a, c still lean past both references."),
    ("16-thickening.png", "Owner round 2, does every part thicken evenly: growth from the Regular to 300 and to 700 per part "
     "kind and size, its spread, and the glyph farthest from its kind (balls, necks, serif tips and reaches within 1.5%).",
     "Open: s's two turns grow 2.3 times where the stems grow 1.8 (a measured rule, s's turns); g's ear and link; the x's "
     "thick stroke."),
    ("16-combs.png", "Owner round 2, the default g's loop, a.ss03 and the tailed l in the Light and Bold masters, curvature "
     "combs, before over after: in the Bold each part is solved with its other edge, so its curves meet at one curvature "
     "and the stroke keeps its thickness.",
     "Open: the Light g's loop (its link and loop curves) could not be solved without thinning; it stands."),
]

OWNER = [
    ("15-gss02.png", "Point B, the single-storey g: its tail is back to 0.80's proportions (the ball's top 72 units under the "
     "baseline again, where 0.81 had raised it to 16), on 0.81's smooth arc, at every weight.",
     "Open: nothing; the lowest point stays half way to the tail's end (19 units right of 0.80's) so the arc stays smooth."),
    ("15-tails-combs.png", "Point A, the tails of j, y and g.ss02 in the Light and Bold masters, with curvature combs, before "
     "over after: in the Bold the ball is the round ends' ball scaled evenly (round, no longer pinched) and the tail is "
     "solved again, so its curvature rises smoothly into the ball.",
     "Open: the Light's tails stay as the engine drew them (they were already smooth); the default g's loop, a.ss03 and "
     "the tailed l still meet unevenly in the masters."),
    ("15-lean-waterfall.png", "Point C, the named letters from 300 to 700, before (grey) under after (red): a new check "
     "now measures how each letter's top drifts against its bottom as the weight rises, against Georgia Pro and Source Serif 4.",
     "Open: no lean is fixed yet (x worst, then s z G S X e g w a c); the 9 and 6 are not changed yet (their lower right, "
     "upper left, is steeper than both references in the Regular)."),
]


def stage4_section(figdir):
    figs = "".join(f"<figure style='margin:18px 0'><figcaption style='font:15px/1.45 system-ui;margin:0 0 6px'>"
                   f"<div style='font-weight:600'>{html.escape(a)}</div><div>{html.escape(b)}</div></figcaption>"
                   f"{img_tag(os.path.join(figdir, f))}</figure>"
                   for f, a, b in STAGE4 if os.path.exists(os.path.join(figdir, f)))
    return (f"<h2 style='font-size:22px'>Owner round 4: the s; the x and the Light g, why not yet</h2>{figs}") if figs else ""


def stage3_section(figdir):
    figs = "".join(f"<figure style='margin:18px 0'><figcaption style='font:15px/1.45 system-ui;margin:0 0 6px'>"
                   f"<div style='font-weight:600'>{html.escape(a)}</div><div>{html.escape(b)}</div></figcaption>"
                   f"{img_tag(os.path.join(figdir, f))}</figure>"
                   for f, a, b in STAGE3 if os.path.exists(os.path.join(figdir, f)))
    return (f"<h2 style='font-size:22px'>Owner round 3: the Bold's diagonal letters, measured</h2>{figs}") if figs else ""


def stage2_section(figdir):
    figs = "".join(f"<figure style='margin:18px 0'><figcaption style='font:15px/1.45 system-ui;margin:0 0 6px'>"
                   f"<div style='font-weight:600'>{html.escape(a)}</div><div>{html.escape(b)}</div></figcaption>"
                   f"{img_tag(os.path.join(figdir, f))}</figure>"
                   for f, a, b in STAGE2 if os.path.exists(os.path.join(figdir, f)))
    return (f"<h2 style='font-size:22px'>Owner round 2: lean, the 9 6 5, smooth tails</h2>{figs}") if figs else ""


def owner_section(figdir):
    figs = "".join(f"<figure style='margin:18px 0'><figcaption style='font:15px/1.45 system-ui;margin:0 0 6px'>"
                   f"<div style='font-weight:600'>{html.escape(a)}</div><div>{html.escape(b)}</div></figcaption>"
                   f"{img_tag(os.path.join(figdir, f))}</figure>"
                   for f, a, b in OWNER if os.path.exists(os.path.join(figdir, f)))
    return (f"<h2 style='font-size:22px'>Your three points (owner round, 15 November)</h2>{figs}") if figs else ""


def section(figdir):
    entry = next(e for e in json.load(open(os.path.join(HERE, "changes.json"))) if e["build"] == "0.81")
    items = "".join(f"<li><b>{html.escape(i['glyphs'])}</b>. {html.escape(i['text'])}</li>" for i in entry["items"])
    figs = "".join(f"<figure style='margin:18px 0'><figcaption style='font:600 14px system-ui;margin:0 0 6px'>"
                   f"{html.escape(t)}</figcaption>{img_tag(os.path.join(figdir, f))}</figure>"
                   for f, t in TITLES if os.path.exists(os.path.join(figdir, f)))
    return (f"<section id='changed-081' style='max-width:1400px;margin:0 auto;padding:16px;font:15px/1.5 system-ui;"
            f"color:inherit'>{stage4_section(figdir)}{stage3_section(figdir)}{stage2_section(figdir)}{owner_section(figdir)}<h2 style='font-size:22px'>What changed in 0.81 ({html.escape(entry['date'])})</h2>"
            f"<ul style='padding-left:20px'>{items}</ul><details><summary style='cursor:pointer;font-weight:600'>"
            f"The figures ({sum(1 for f, _ in TITLES if os.path.exists(os.path.join(figdir, f)))})</summary>{figs}"
            f"</details></section>")


def main():
    page, figdir = sys.argv[1:3]
    out = sys.argv[3] if len(sys.argv) > 3 else page
    s = open(page, encoding="utf-8").read()
    s = re.sub(r"<section id='changed-081'.*?</section>", "", s, flags=re.S)
    m = re.search(r"<body[^>]*>", s)
    if m:                                                      # a whole document
        at = m.end()
    else:                                                      # a fragment (the artifact wraps it): before the first
        at = re.search(r"<(main|header|div|section|h1|nav)\b", s).start()   # element of the page's own markup
    s = s[:at] + section(figdir) + s[at:]
    open(out, "w", encoding="utf-8").write(s)
    print(out, f"{os.path.getsize(out) // 1024} KB")


if __name__ == "__main__":
    main()
