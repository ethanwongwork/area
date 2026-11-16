"""Confusable pairs at 11, 12 and 13 px (owner, 2026-11-14, note 9): how far apart two look-alikes are once
rasterised, in Area Serif and in the comparison faces. Each side is drawn by FreeType in grey at 1x (the harder
case), the two images are laid on one origin, and the distance is the summed difference of their pixels over the
mean of their ink, at the best shift within a pixel either way, averaged over four positions on the pixel grid. 0 is identical; 1 is no ink in common. A pair
fails when Area's distance is under the lowest of the references at any of the three sizes.

    cd typefaces/area-serif && source build/ev.sh && $PY $T/confusable.py [--bold]
"""
import os
import sys

from PIL import Image, ImageChops, ImageDraw, ImageFont, ImageStat

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path[:0] = [os.path.abspath(os.path.join(HERE, "..", "..", "serif-typeface-2026-11-10", "tools", "weight"))]
SERIF = os.path.abspath(os.path.join(HERE, "..", "..", "..", "..", "typefaces", "area-serif"))
U = os.path.expanduser("~/Library/Fonts/")
EV = os.path.join(SERIF, "build", "eval-fonts")
PAIRS = [("I", "l"), ("l", "1"), ("I", "1"), ("O", "0"), ("rn", "m"), ("cl", "d"), ("a", "o"), ("e", "c"), ("o", "c"),
         ("vv", "w"), ("i", "j"), ("u", "n"), ("h", "b"), ("5", "S"), ("8", "B"), ("2", "Z"), ("6", "b"), ("g", "9"),
         (".", ","), (":", ";"), ("'", "`")]
SIZES = (11, 12, 13)


def faces(bold):
    if bold:
        return {"Area": (os.path.join(SERIF, "build", "AreaSerif[wght].ttf"), 700),
                "Georgia Pro": (U + "GeorgiaPro-Bold.ttf", None), "Serrif": (U + "SerrifCollectionVF-TRIAL.ttf", 700),
                "Libre Baskerville": (os.path.join(EV, "LibreBaskerville.ttf"), 700),
                "Source Serif 4": (os.path.join(EV, "SourceSerif4.ttf"), 700), "Literata": (os.path.join(EV, "Literata.ttf"), 700)}
    return {"Area": (os.path.join(SERIF, "build", "AreaSerif-Regular.ttf"), None),
            "Georgia Pro": (U + "GeorgiaPro-Regular.ttf", None), "Serrif": (U + "SerrifCollectionVF-TRIAL.ttf", 400),
            "Libre Baskerville": (os.path.join(EV, "LibreBaskerville.ttf"), 400),
            "Source Serif 4": (os.path.join(EV, "SourceSerif4.ttf"), 400), "Literata": (os.path.join(EV, "Literata.ttf"), 400)}


def font(path, wght, size):
    f = ImageFont.truetype(path, size)
    if wght:
        try:
            f.set_variation_by_axes([wght if a["name"] in (b"Weight", "Weight") else a["default"] for a in f.get_variation_axes()])
        except Exception:
            pass
    return f


def draw(f, text, size, dx=0):
    im = Image.new("L", (size * 4, size * 3), 0)
    ImageDraw.Draw(im).text((size + dx, size // 2), text, font=f, fill=255)
    return im


def distance(f, a, b, size):
    """Mean over four positions of the pen on the pixel grid (a single position makes one size an outlier)."""
    out = []
    for ph in (0, 0.25, 0.5, 0.75):
        A = draw(f, a, size, ph)
        ia = ImageStat.Stat(A).sum[0]
        best = 9
        for dx in (-1, -0.5, 0, 0.5, 1):
            B = draw(f, b, size, ph + dx)
            ib = ImageStat.Stat(B).sum[0]
            best = min(best, ImageStat.Stat(ImageChops.difference(A, B)).sum[0] / ((ia + ib) / 2 or 1) / 2)
        out.append(best)
    return sum(out) / len(out)


def run(bold=False):
    F = faces(bold)
    rows, fails = [], []
    for a, b in PAIRS:
        row = {}
        for name, (path, w) in F.items():
            try:
                row[name] = [distance(font(path, w, s), a, b, s) for s in SIZES]
            except Exception:
                row[name] = None
        refs = [v for k, v in row.items() if k != "Area" and v]
        low = [min(r[i] for r in refs) for i in range(len(SIZES))]
        bad = [SIZES[i] for i in range(len(SIZES)) if row["Area"][i] < low[i] - 0.005]
        rows.append((a, b, row, low, bad))
        if bad:
            fails.append((a, b, bad))
    return F, rows, fails


if __name__ == "__main__":
    bold = "--bold" in sys.argv
    F, rows, fails = run(bold)
    print(("Bold" if bold else "Regular") + ": distance between look-alikes at 11 / 12 / 13 px (higher is safer)")
    print(f"{'pair':10}" + "".join(f"{n[:16]:>19}" for n in F) + "   lowest reference   below it at")
    for a, b, row, low, bad in rows:
        print(f"{a + ' ' + b:10}" + "".join("  " + " ".join(f"{v:.2f}" for v in row[n]) + "   " if row[n] else f"{'--':>19}" for n in F)
              + "  " + " ".join(f"{v:.2f}" for v in low) + "    " + (" ".join(map(str, bad)) or "-"))
    print(f"\n{len(fails)} pair(s) where Area is closer than every reference:", fails)
    sys.exit(1 if fails else 0)
