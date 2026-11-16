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
AXIS3 = [
    ("24-axis.png", "Axis round 3, before (round 2) over after at 300, 400, 550 and 700: the registered sign keeps an even ring (its R "
     "is placed and sized inside it as the other ring signs are); the v with a hook is back to its earlier shape; the long-s "
     "ligatures, t with hook and the trademark keep their stroke ends' weight at the Bold.",
     "Open: where a round stroke runs into a junction (Ə ð œ & $ ɂ ʕ); @'s a; the footless 1's flag; the ogonek by under a "
     "unit; ₵ waits for your choice."),
    ("24-hook-combs-masters.png", "The hooks' remaining curvature bumps in the Light (top) and the Bold (below), each over the "
     "Regular, with curvature combs: where the comb's edge steps, the curve's bend changes at a node.",
     "These are what the evening rule could not smooth without thinning the stroke."),
    ("24-hook-combs-regular.png", "The ten worst curvature faults in the hooks' own drawings (the Regular), for you to look at: "
     "Ⱳ, ʔ, ⱳ, ƴ, ƒ, Ɽ, Ʈ, ɔ, Ɔ, Ƒ.",
     "Nothing is changed in the Regular until you say."),
]

AXIS2 = [
    ("23-axis.png", "Axis round 2, before (round 1) over after at 300, 400, 550 and 700. Letters: the y with a hook no longer pinches "
     "where its tail leaves the thin stroke in the Light, the n with a left hook keeps its tail's weight by the stem, the t "
     "with a retroflex hook keeps the shape of its ear at the Bold. Signs: ⌦ ⌫ ✓ and the other signs' slanted strokes now "
     "lighten as their straight strokes do (a touch heavier at 300 only).",
     "Look at: the v with a hook in the Light, whose counter's straight side is now shorter than the Regular's. Open: the "
     "footless 1's flag at the Bold, ®, @, the ogonek by a unit, and the places where a round stroke runs into a junction "
     "(Ə ð œ & $ ɂ ʕ)."),
    ("23-cedi.png", "Your choice for ₵: A keeps Libre Baskerville's drawn C (it thins where the stroke crosses it at the Bold); "
     "B rebuilds it from Area's own capital C and a stroke, as ₡ and ₲ are (the thin place goes; the Regular changes).",
     "Nothing is changed until you choose."),
]

AXIS = [
    ("22-axis.png", "Axis round: the hooks that end in a ball (K, Y, W, w and y with a hook, and the florin), then other letters "
     "whose hooks or tails end in a ball, at 300, 400, 550 and 700, before (round 7) over after. Their balls are drawn turned a "
     "little off upright; the weight engine now recognises a ball at any angle, so they grow and shrink as every other ball "
     "does: in the Light the neck before the ball keeps 0.81 of its 400 thickness where it kept 0.59, and the Bold K with a "
     "hook no longer thins where its arm meets the leg.",
     "Open: the n with a left hook still thins in the Light (0.62 of 400); the y with a hook's tail thins more in the Light "
     "(15 units, was 21) now that its ball keeps its size; ʕ's bowl stroke into its stem thins at the Bold (newly caught); "
     "₵ waits for your choice of letter (Area's c or C); the 1's flag, ®, @, the ogonek and the junction places are "
     "measured, not fixed."),
]

STAGE7 = [
    ("21-axis.png", "Owner round 7: the glyphs the weight checks still flag, at 300, 400, 550 and 700, large (none changed this "
     "round). The build is repeatable: two builds from the same inputs come out identical, outlines and kerning; the small "
     "moves in the asterisk, daggers and quotes between rounds follow the white law, which reads the letters' counters "
     "and so moves when a letter such as the 9 changes.",
     "Open: every glyph shown. The hooks of K, Y, W, w, y with a ball are drawn with their balls turned 23 to 30 units off "
     "upright, which the weight engine does not read as balls; the rest are listed with the number that blocks each in the "
     "write-up."),
]

STAGE6 = [
    ("20-waterfall.png", "Owner round 6, every change of these rounds in one place: the lowercase, the capitals and the figures at "
     "300, 400, 550 and 700, the 0.81 build before your rounds (above) and now (below). This round: the Light g's loop "
     "eases into its link (the Light now passes the curvature check), and the 9's and 6's bowl side thickens as a round "
     "stroke again (their drift from 400 to 700 is now +0.012, was +0.026).",
     "Open: G, X, a, g, w, z lean further than the references at 700 (G and X by about 0.02, z 0.022, a 0.035, g 0.032, w "
     "0.016); 4, 5, 8 and K drift a little the other way; none is covered by a rule already in the engine."),
]

STAGE5 = [
    ("19-lines.png", "Owner round 5: the x, the S family, c and e, before then after at 300, 400, 550, 700. The x keeps its thick "
     "stroke's slant (it turns 0.2 degrees, was 6.3) and no longer leans at the Bold (-0.044 of its height from 400, "
     "references -0.037 to -0.018); the S's top bowl keeps its width against the lower bowl; the c's and e's lower "
     "strokes thicken as their references' do.",
     "Open: the x at the Bold is 8% wider than at 400 where n grows 10% (0.983 of n's growth; asked 0.99 to 1.06)."),
    ("19-g-light.png", "Owner round 5: the g's loop in the Light, curvature combs, before over after: built from its "
     "centreline, the loop's curves now meet at one curvature (4 faults > 1).",
     "Open: where the loop's right side runs into the link the curve starts at 0.49 of its tightest (the check asks 0.45); "
     "the curve cannot reach it inside its triangle without turning on the way."),
]

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


def axis3_section(figdir):
    figs = "".join(f"<figure style='margin:18px 0'><figcaption style='font:15px/1.45 system-ui;margin:0 0 6px'>"
                   f"<div style='font-weight:600'>{html.escape(a)}</div><div>{html.escape(b)}</div></figcaption>"
                   f"{img_tag(os.path.join(figdir, f))}</figure>"
                   for f, a, b in AXIS3 if os.path.exists(os.path.join(figdir, f)))
    return (f"<h2 style='font-size:22px'>Axis round 3: before your review</h2>{figs}") if figs else ""


def axis2_section(figdir):
    figs = "".join(f"<figure style='margin:18px 0'><figcaption style='font:15px/1.45 system-ui;margin:0 0 6px'>"
                   f"<div style='font-weight:600'>{html.escape(a)}</div><div>{html.escape(b)}</div></figcaption>"
                   f"{img_tag(os.path.join(figdir, f))}</figure>"
                   for f, a, b in AXIS2 if os.path.exists(os.path.join(figdir, f)))
    return (f"<h2 style='font-size:22px'>Axis round 2: the remaining thin places</h2>{figs}") if figs else ""


def axis_section(figdir):
    figs = "".join(f"<figure style='margin:18px 0'><figcaption style='font:15px/1.45 system-ui;margin:0 0 6px'>"
                   f"<div style='font-weight:600'>{html.escape(a)}</div><div>{html.escape(b)}</div></figcaption>"
                   f"{img_tag(os.path.join(figdir, f))}</figure>"
                   for f, a, b in AXIS if os.path.exists(os.path.join(figdir, f)))
    # non-ASCII as character references: the evaluation page is a fragment with no charset of its own
    return (f"<h2 style='font-size:22px'>Axis round: balls at any angle</h2>{figs}").encode("ascii", "xmlcharrefreplace").decode() if figs else ""


def stage7_section(figdir):
    figs = "".join(f"<figure style='margin:18px 0'><figcaption style='font:15px/1.45 system-ui;margin:0 0 6px'>"
                   f"<div style='font-weight:600'>{html.escape(a)}</div><div>{html.escape(b)}</div></figcaption>"
                   f"{img_tag(os.path.join(figdir, f))}</figure>"
                   for f, a, b in STAGE7 if os.path.exists(os.path.join(figdir, f)))
    return (f"<h2 style='font-size:22px'>Owner round 7: a repeatable build; the weight checks' remaining list</h2>{figs}") if figs else ""


def stage6_section(figdir):
    figs = "".join(f"<figure style='margin:18px 0'><figcaption style='font:15px/1.45 system-ui;margin:0 0 6px'>"
                   f"<div style='font-weight:600'>{html.escape(a)}</div><div>{html.escape(b)}</div></figcaption>"
                   f"{img_tag(os.path.join(figdir, f))}</figure>"
                   for f, a, b in STAGE6 if os.path.exists(os.path.join(figdir, f)))
    return (f"<h2 style='font-size:22px'>Owner round 6: the Light g, the 9 and 6; everything changed, at a glance</h2>{figs}") if figs else ""


def stage5_section(figdir):
    figs = "".join(f"<figure style='margin:18px 0'><figcaption style='font:15px/1.45 system-ui;margin:0 0 6px'>"
                   f"<div style='font-weight:600'>{html.escape(a)}</div><div>{html.escape(b)}</div></figcaption>"
                   f"{img_tag(os.path.join(figdir, f))}</figure>"
                   for f, a, b in STAGE5 if os.path.exists(os.path.join(figdir, f)))
    return (f"<h2 style='font-size:22px'>Owner round 5: the x, the S family, c and e, the Light g</h2>{figs}") if figs else ""


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
            f"color:inherit'>{axis3_section(figdir)}{axis2_section(figdir)}{axis_section(figdir)}{stage7_section(figdir)}{stage6_section(figdir)}{stage5_section(figdir)}{stage4_section(figdir)}{stage3_section(figdir)}{stage2_section(figdir)}{owner_section(figdir)}<h2 style='font-size:22px'>What changed in 0.81 ({html.escape(entry['date'])})</h2>"
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
