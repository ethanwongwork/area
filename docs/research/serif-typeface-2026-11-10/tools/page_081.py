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
]


def img_tag(path, width=1400):
    im = Image.open(path).convert("RGB")
    if im.width > width:
        im = im.resize((width, round(im.height * width / im.width)), Image.LANCZOS)
    buf = io.BytesIO()
    im.save(buf, "JPEG", quality=80, optimize=True)
    b64 = base64.b64encode(buf.getvalue()).decode()
    return f'<img alt="" loading="lazy" style="max-width:100%;height:auto;display:block;border:1px solid #ddd" src="data:image/jpeg;base64,{b64}">'


def section(figdir):
    entry = next(e for e in json.load(open(os.path.join(HERE, "changes.json"))) if e["build"] == "0.81")
    items = "".join(f"<li><b>{html.escape(i['glyphs'])}</b>. {html.escape(i['text'])}</li>" for i in entry["items"])
    figs = "".join(f"<figure style='margin:18px 0'><figcaption style='font:600 14px system-ui;margin:0 0 6px'>"
                   f"{html.escape(t)}</figcaption>{img_tag(os.path.join(figdir, f))}</figure>"
                   for f, t in TITLES if os.path.exists(os.path.join(figdir, f)))
    return (f"<section id='changed-081' style='max-width:1400px;margin:0 auto;padding:16px;font:15px/1.5 system-ui;"
            f"color:inherit'><h2 style='font-size:22px'>What changed in 0.81 ({html.escape(entry['date'])})</h2>"
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
