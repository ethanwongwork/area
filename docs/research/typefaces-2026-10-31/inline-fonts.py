"""Inline the libre faces that are not on Google Fonts into specimens.html, for publishing.

The artifact page may load fonts only from Google Fonts or data URIs, so the Velvetyne, Collletttivo and
Sébastien Sanfilippo faces (all SIL OFL) go in as data-URI @font-face rules in place of `/* LIBRE_FONTS */`.
The repo keeps the small source; the built page goes wherever `out` points.

  venv/bin/python3 -I inline-fonts.py <fonts-dir> <out.html> [licensed.json]

licensed.json (optional) holds the licensed faces' measurements and specimen images, rendered in memory from trial
files on the owner's machine and Fontshare downloads by licensed.py; it goes in as window.LICENSED_DATA. Only images
and numbers are published, never a licensed font file.

<fonts-dir> holds the files named below, downloaded from each foundry's repository:
gitlab.com/velvetyne/<name>, github.com/collletttivo/<name>, github.com/sebsan/Bagnard, github.com/velvetyne/BluuNext.
"""
import base64, io, os, sys
from fontTools.ttLib import TTFont

FACES = [
    # family, file, weight, style
    ("Le Murmure", "LeMurmure.woff2", 400, "normal"),
    ("Basteleur", "BasteleurMoonlight.woff2", 400, "normal"),
    ("Basteleur", "BasteleurBold.woff2", 700, "normal"),
    ("Ouroboros", "Ouroboros.woff2", 400, "normal"),
    ("VTF Grotesk", "Grotesk.woff2", 400, "normal"),
    ("Apfel Grotezk", "ApfelGrotezk.woff2", 400, "normal"),
    ("Apfel Grotezk", "ApfelGrotezkFett.woff2", 700, "normal"),
    ("Ronzino", "Ronzino.woff2", 400, "normal"),
    ("Ronzino", "RonzinoMedium.woff2", 500, "normal"),
    ("Ronzino", "RonzinoOblique.woff2", 400, "italic"),
    ("Absans", "Absans.woff2", 400, "normal"),
    ("Sligoil", "Sligoil.woff2", "90 120", "normal"),
    ("Bluu Next", "BluuNext.woff2", 400, "normal"),
    ("Happy Times", "HappyTimes.woff2", 400, "normal"),
    ("Happy Times", "HappyTimesItalic.woff2", 400, "italic"),
    ("Sporting Grotesque", "SportingGrotesque.otf", 400, "normal"),
    ("Compagnon", "Compagnon.woff2", 400, "normal"),
    ("Compagnon", "CompagnonItalic.woff2", 400, "italic"),
    ("Format 1452", "Format1452.woff2", 400, "normal"),
    ("Bagnard", "Bagnard.otf", 400, "normal"),
    ("Avara", "AvaraBold.woff2", 400, "normal"),
    ("Avara", "AvaraBoldItalic.woff2", 400, "italic"),
]


def woff2(path):
    """The file as WOFF2 bytes; OTF and TTF sources are compressed, not otherwise changed."""
    if path.endswith(".woff2"):
        return open(path, "rb").read()
    font = TTFont(path)
    font.flavor = "woff2"
    buf = io.BytesIO()
    font.save(buf)
    return buf.getvalue()


def main(fonts_dir, out, licensed=None):
    src = os.path.join(os.path.dirname(os.path.abspath(__file__)), "specimens.html")
    html = open(src, encoding="utf-8").read()
    rules = []
    for family, name, weight, style in FACES:
        data = base64.b64encode(woff2(os.path.join(fonts_dir, name))).decode()
        rules.append(
            f'@font-face {{ font-family: "{family}"; font-weight: {weight}; font-style: {style}; font-display: swap;'
            f' src: url(data:font/woff2;base64,{data}) format("woff2") }}'
        )
    assert "/* LIBRE_FONTS */" in html and "/* LICENSED_DATA */" in html
    html = html.replace("/* LIBRE_FONTS */", "\n".join(rules))
    if licensed:
        html = html.replace("/* LICENSED_DATA */", "window.LICENSED_DATA = " + open(licensed, encoding="utf-8").read() + ";")
    open(out, "w", encoding="utf-8").write(html)
    print(f"{len(rules)} faces, {os.path.getsize(out) / 1e6:.2f} MB -> {out}")


if __name__ == "__main__":
    main(*sys.argv[1:4])
