"""The review page's finding cards. CARDS83: the 0.83 Regular pass, newest first, then what is not done. CARDS82: one
per item of owner round 8 (0.82), then the things left open then. Every number is taken
from docs/research/serif-typeface-2026-11-10/axis-0.81.md ("Owner round 8" sections, rows 96 to 98 for
items 12 to 14, rows 99 to 103 for items 15 to 18) or, for G, from build/owner8/balance-before.json. Glyphs are named as in the font; `rows` are drawn as small vector panels.

A row: (label, [glyph names], [weights], fill snapshot, red-line snapshot or None). Snapshot keys: "now", "before"
(the build before this round), "prev" (the build before items 12 to 14), "v080". Weights are on the 0.82 axis
(300 to 800; 0.81's 550 is 600 and its 700 is 800, the same stems). Items 1 to 14 were measured on the 0.81 axis: their
prose gives the new-axis weights and says once per card which old weights they were. page_082.py draws an old-axis font
at the same stems."""

W4 = [300, 400, 600, 800]
NOW_OVER_BEFORE = ("now", "before")

# ---------- 0.83, the Regular pass ----------
# Numbers from axis-0.81.md: "Regular pass (0.83)" (items A to E, snap083a), "Symbols 1", "Symbols 2", "Symbols, full
# build" (snap083b), "Regular pass, consistency" (snap083c). They were measured on snap083c or earlier; the drawings
# are the --after build over 0.82 ("r82", snap082i, the build the 0.83 work started from). When a card's glyphs moved
# again after snap083c (page_082.py compares --ref083c with --after), the page says so on the card and drops its
# "still not right" note, which may no longer hold. The open card's items carry the glyphs they name; an item is left
# out when any of them moved after snap083c.
W1 = [400]
W38 = [300, 800]
NOW_OVER_82 = ("now", "r82")
MASTERS_ROW = "Light 300 and ExtraBold 800, as the existing rules build them (not tuned), 0.82 in red"

OPERATORS = ["plus", "minus", "plusminus", "multiply", "divide", "equal", "notequal", "less", "greater", "lessequal",
             "greaterequal", "logicalnot", "asciitilde", "approxequal"]

CARDS83 = [
    dict(id="sys", status="fixed", sev="high", cls="Signs · the symbol system",
         title="One set of rules for every sign",
         body="The signs were drawn one at a time, many of them taken over from Libre Baskerville, so they did not agree "
              "with each other. = was 412 units wide and sat 22 units above the line the other operators sit on; + was "
              "424 wide but 430 tall; ≤ and ≥ sat 26 units high; < and > were 416 and 414 wide. The arrows were about as long as "
              "an x. You asked for the signs to be made mathematically, optically and visually accurate first.",
         rules=["The axis: every sign that is not a letter, a figure or punctuation is centred on the maths axis, 313 "
                "units up (the middle of the minus).",
                "The + box: every operator is the minus's width, 424 units; the + is that square.",
                "Arrows: 626 long (twice the axis, so ↑ stands on the baseline), one head, every arrow that one turned.",
                "Key box: the key signs are 570 tall (0.80 of the cap height), centred on the axis.",
                "Shapes: the circle is the key box; the square has the circle's area, the pointed shapes 0.60 of it.",
                "Letter-like signs (∂ ∆ ∏ ∑ € and the currencies) take the capitals' heights and weights.",
                "Weight: a straight sign takes the minus's stroke (52); a curved maths sign a gentle upright stress "
                "(47 level, 57 upright).",
                "Ends: a free end is cut square with its corners rounded on 7 units, like the letters' cut ends.",
                "Pairs: a mirrored pair is one drawing turned over (< >, ≤ ≥, ← →, ⇤ ⇥, ⌫ ⌦)."],
         changed="All 147 glyphs that are not letters were measured against these rules: width, side spaces, the line "
                 "each sits on, its strokes, its corners. 55 broke a rule and were rebuilt; the rest were in rule and "
                 "did not move. The rules are written in Area's own parts. The reference faces (numbers only) were "
                 "used as a sanity range, never as a target.",
         now="+ − ± × ÷ = ≠ < > ≤ ≥ ¬ are all 424 wide and centred on 313; ~ and ≈ are 419 (the box less their soft "
             "corners). The maths operators stay one stroke weight all round.",
         still="~ still reads a little small at text size: it is the box's width, and its weight now matches the minus.",
         ev=[("Operators' width", "412 to 430 → 424"), ("= above the axis", "22 → 0"), ("≤ ≥ above the axis", "26 → 0"),
             ("Glyphs that broke a rule", "55 of 147")],
         rows=[("The operators at 400, 0.82 in red", OPERATORS, W1, *NOW_OVER_82)]),

    dict(id="arrows", status="fixed", sev="high", cls="Signs · arrows",
         title="The arrows are one family, with a gentle taper",
         body="You asked whether ↔ should have its middle line run through the arrow heads. It should not. In 0.82, ↔ "
              "and ↕ were two arrows laid over each other, so each shaft ran on through the far head and both points "
              "were cut square (a 52-unit flat at each tip). The slanted arrows were made smaller (0.92) with their "
              "arms 4.9 degrees off level and upright. The upright and slanted arrows sat 13 to 15 units above the "
              "axis. And the family was short: 490 long, about the width of an x.",
         changed="Every arrow is now → turned or turned over: 626 long, one head with a 90-degree point. ↔ is 728 long "
                 "so the shaft between its heads matches →'s; ↕ keeps ↑'s height (0 to 626). You chose the gentle "
                 "taper: the shaft runs from a round tail (60 across) to a hairline (43) where it meets the head, and "
                 "each arm swells from the hairline to a round end (60). The point is cut flat, 21.5 across. A shaft "
                 "with no free end, as in ↔ and ↕, is straight: 43 all along (a first build swelled it to 60 in the "
                 "middle, which read as a lens). ⇤ ⇥'s bar is one straight stroke, 57 across, with half-round ends. "
                 "↵ runs back to a mitred corner and up a riser to ↑'s point.",
         now="Advances at 400, from 0.82: → 578 to 714, ↔ 578 to 816, ↖ 407 to 538, ⇤ ⇥ 630 to 771, ↵ 578 to 717. "
             "The taper keeps the arrows' colour: ink area within 3% of a plain 52-unit stroke.",
         still="The masters were looked at, not tuned. Towards the Bold the taper's contrast grows (53 to 82 across at "
               "800), and ↔ ↕'s shaft, which follows the hairline, reads thin beside the round ends at 700 to 800.",
         ev=[("Length", "490 → 626"), ("↔ tip flats", "52 / 52 → none"), ("Shaft, tail to head", "52 → 60 to 43"),
             ("⇤ ⇥ bar", "57, straight")],
         rows=[("At 400, 0.82 in red", ["arrowleft", "arrowright", "arrowup", "arrowdown", "arrowboth", "arrowupdn",
                                       "uni2196", "uni2197", "uni2198", "uni2199", "uni21B5", "uni21E4", "uni21E5"],
                W1, *NOW_OVER_82),
               (MASTERS_ROW, ["arrowright", "arrowboth"], W38, *NOW_OVER_82)]),

    dict(id="keys", status="fixed", sev="medium", cls="Signs · keys and shapes",
         title="Key signs and shapes share one box and one axis",
         body="The key signs stood on the baseline and were not one height (⌥ 490 tall, the others 570). The delete "
              "keys were centred at 285, the shapes at 343, ✓ at 350. ▲ had 0.56 of the circle's area beside ■'s "
              "0.98, so the shapes did not look one size in a line.",
         changed="Every key sign is 570 tall and centred on the axis; ⌃'s point is the key box's top. The circle fills "
                 "the key box; ■ has the circle's area (a side of 505); the pointed shapes (▲ ▼ ▶ ◀ ◆) 0.60 of it, set "
                 "by eye in a line of ■ ● ▲ ▼ ◆ (0.70 looked large). The frames (⌘ ⌥ ⇧ ⇪ ⌃ ⌫ ⌦ □ ◊ ○ ☆) take the "
                 "letters' stress very quietly: uprights 57, level strokes 47. Outer corners are rounded on 7 units, "
                 "like the letters' cut ends; inner corners, where strokes meet, stay sharp. ✓ and ✕ take the arrows' "
                 "taper.",
         now="▲ 570 → 590 wide (0.60 of the circle's area); ◆ 548; ■ 505 square. ✓ is lighter than before, by design: "
             "its heavier stroke (1.25 times the minus) was an exception of its own.",
         still="At text size the stress shows only in ⇧ (its uprights against its level foot). At 800 ⌘ grows heavy "
               "(the weight engine builds it from its rings); not tuned.",
         ev=[("Key box", "570 tall, on the axis"), ("Pointed shapes, of the circle's area", "0.56 → 0.60"),
             ("Frames, upright / level", "52 / 52 → 57 / 47"), ("Outer corners", "sharp → rounded on 7")],
         rows=[("Key signs at 400, 0.82 in red", ["uni2318", "uni2325", "uni21E7", "uni21EA", "uni2303", "uni232B",
                                                 "uni2326", "uni2713", "uni2715"], W1, *NOW_OVER_82),
               ("Shapes at 400, 0.82 in red", ["uni25CF", "uni25CB", "uni25A0", "uni25A1", "uni25B2", "uni25BC",
                                               "uni25B6", "uni25C0", "uni25C6", "uni2605", "uni2606", "lozenge"],
                W1, *NOW_OVER_82)]),

    dict(id="curves", status="fixed", sev="medium", cls="Signs · ~ ≈ ∞ ^",
         title="~ ≈ ∞ ^ are drawn on the operators' box",
         body="~ was 349 wide and sat on the dash line (278), below the other operators; it ran 25 to 78 units across "
              "and its curvature jumped at its nodes (in ≈ one handle had collapsed). ∞ was two o's side by side, 248 "
              "tall. ^ was a small, accent-like shape (0.35 of the x-height) with arms tapering 35 to 66.",
         changed="~ is one wave of a sine curve, the operators' width, centred on the axis, its ends cut square. Its "
                 "weight follows the curved signs' gentle stress, scaled so it averages the minus's 52. ≈ is two of "
                 "it on the = sign's lines. ∞ is one stroke round a figure-eight curve (a lemniscate); a first build at "
                 "784 × 424 read oversized beside + = <, so it is now 636 × 330. ^ is the < turned up: 0.60 of the "
                 "x-height tall, its point at the cap height, 52 across.",
         now="~ and ≈: no curvature fault, mean weight 52. ∞: 600 × 248 → 636 × 330, no curvature fault, nodes at "
             "every extreme and at the crossing. ^ 318 × 181 → 355 × 312.",
         still="~ reads small at text size beside ≈. At 800, ∞'s right lobe is heavier than its left (the weight "
               "engine; not tuned).",
         ev=[("~ width", "349 → 419"), ("~ centre", "dash line → axis"), ("∞", "two o's → one stroke"),
             ("^ height", "181 → 312")],
         rows=[("At 400, 0.82 in red", ["asciitilde", "approxequal", "infinity", "asciicircum"], W1, *NOW_OVER_82),
               (MASTERS_ROW, ["asciitilde", "infinity"], W38, *NOW_OVER_82)]),

    dict(id="dagger", status="fixed", sev="medium", cls="Signs · † ‡ *",
         title="† and ‡ are made from the asterisk's arm",
         body="† was a spear down to −238, well under the baseline, 1.84 x-heights tall, heaviest (137) under its "
              "crossing, with ball ends of 102. ‡ was the same kind. They did not look like the asterisk they sit "
              "beside in notes.",
         changed="† and ‡ are now built from the asterisk's arm: a stroke that leaves the crossing thin and swells to a "
                 "round end of 78, the asterisk's own. The arms first left at the asterisk's 22, which read light "
                 "beside § ¶ *; they now leave at 32, the letters' thinnest stroke (the neck where n's arch leaves its "
                 "stem). † runs from −9 to 721. ‡'s second crossing mirrors the first about half the cap height (521 "
                 "and 191). The asterisk did not change.",
         now="Ink per advance: the daggers 0.148, the asterisk 0.150. ‡'s two crossings mirror exactly.",
         still="",
         ev=[("† depth", "−238 → −9"), ("Arm where it leaves the crossing", "22 → 32"), ("Round end", "78, the asterisk's")],
         rows=[("At 400, 0.82 in red", ["dagger", "daggerdbl", "asterisk"], W1, *NOW_OVER_82),
               (MASTERS_ROW, ["dagger", "daggerdbl"], W38, *NOW_OVER_82)]),

    dict(id="sum83", status="fixed", sev="high", cls="Signs · ∑ ∏",
         title="∑ and ∏ are operators, built from Area's capitals",
         body="∑ was Libre Baskerville's Esh letter. Its bars ran into the diagonals through S-shaped curves; the point "
              "was a 36-unit upright flat; the left corners had hooked heels; its two beaks differed in size and "
              "angle. The point stood right of centre (0.746 across, where the references put it near 0.64), and the "
              "sign stood on the baseline, where every reference hangs it below.",
         changed="∑ is built from Area's capitals: the top bar is E's arm (46) with E's beak, the upper diagonal is Z's "
                 "diagonal (89), the lower one A's thin diagonal (49); plain corners, one vertical down the left side. "
                 "As an operator it hangs from the cap height to −178 (a quarter of the cap height below the "
                 "baseline), is 562 wide, and has a heavy foot: the bottom bar is 70, 0.90 of n's stem. The point is a "
                 "small flat of 11. ∏ takes the same height and depth. Ʃ, the letter, is the same construction from 0 "
                 "to 712 with both bars at E's weight.",
         now="Point across / up: 0.746 / 0.542 → 0.662 / 0.525 of the ink. Advances: ∑ 638 → 623, Ʃ 665 → 677. "
             "Curvature faults in the Light and Bold: ∑ 6 → 0.",
         still="Because ∑ and ∏ now hang below the baseline, ∑ j and ∏ j are opened by 126 to 132 units by the "
               "collision pass (a safety value, not a fitted kern), and ∏ x sits close. At 800 the bottom bar grows "
               "to 126 and the point rises to 0.59 of the height; not tuned.",
         ev=[("∑ extent", "0 to 712 → −178 to 712"), ("Bottom bar", "46 → 70"), ("Point flat", "36 → 11"),
             ("Joins", "S-curves → plain corners")],
         rows=[("At 400, 0.82 in red", ["summation", "product", "uni01A9"], W1, *NOW_OVER_82),
               (MASTERS_ROW, ["summation"], W38, *NOW_OVER_82)]),

    dict(id="pct", status="fixed", sev="medium", cls="Signs · % ‰ €",
         title="% and ‰ are set like fractions; € is Area's C",
         body="In % and ‰ the small figures sat 25 to 40 units from the slash, where the fractions keep 66, so they "
              "looked crowded. € was its own narrow C (1.04 x-heights wide) with flat-cut ends, not Area's C.",
         changed="% and ‰ are set as the fractions are: each figure 66 from the slash, moved level only. € is Area's C "
                 "with two bars of H's crossbar weight (centred at 0.43 and 0.60 of the cap height), running from just "
                 "left of the C to 0.66 of its width.",
         now="Advances: % 640 → 719 (1.22 x-heights wide), ‰ 885 → 924, € 655 → 746.",
         still="",
         ev=[("Figure to slash", "25 to 40 → 66"), ("€ advance", "655 → 746"), ("€'s C", "its own → Area's")],
         rows=[("At 400, 0.82 in red", ["percent", "perthousand", "Euro"], W1, *NOW_OVER_82),
               ("Area's C, for comparison (not changed in 0.83)", ["C"], W1, "now", None)]),

    dict(id="amp83", status="part", sev="high", cls="Signs · ampersand",
         title="The ampersand's loop is round, and its 0.82 width is kept",
         body="In 0.82 the & had a flat lid and an angular upper-left shoulder: the loop's outer upper-left quarter "
              "was 1.50 times as wide as it was tall.",
         changed="The loop is now drawn by a rule: a round teardrop whose curvature changes smoothly all the way "
                 "round, with no lid and no shoulder, standing over the bowl. A first pass also moved the & onto the "
                 "references' average proportions (narrower, a shallower diagonal). You then said the references show "
                 "how glyphs look and are not targets, so those moves were undone: the width and the diagonal are "
                 "0.82's again. The diagonal and the loop's left side are one stroke at v's thick (74), the loop's top "
                 "o's hairline (43); the bowl's bottom is e's, and the arm's inner corner is rounded as in @.",
         now="Loop quarter, width over height: 1.50 → 1.01. Curvature: worst 1.05, no fault. Advance 810, as in 0.82.",
         still="The loop sits a little right of the bowl's counter (0.073 of the width; 0.82 had 0.029): its left side "
               "leaves the diagonal on a turn that carries it right. The thinnest places are where the bowl's bottom "
               "runs into the diagonal and at the tail's join (0.78 of the hairline). The Bold loop has one curvature "
               "jump to look at (2.07).",
         ev=[("Loop quarter, width / height", "1.50 → 1.01"), ("Advance", "810, kept"), ("Curvature faults", "0")],
         rows=[("At 400, 0.82 in red", ["ampersand"], W1, *NOW_OVER_82),
               (MASTERS_ROW, ["ampersand"], W38, *NOW_OVER_82)]),

    dict(id="figs83", status="fixed", sev="medium", cls="Figures · 1 3 4 5",
         title="The figures 3 and 5 turn smoothly; 1, 4 and 5 sit evenly in their space",
         body="3: the top of the upper bowl stood left of its middle (0.451 of the bowl's width, where Area's 8 and S "
              "put it near 0.49), so its two arcs met with a jump, and the arc ran flat and then turned tight into the "
              "ball: 8 curvature faults. 5 had 6 (worst 2.95). The 1 had much more white on its right (164.5) than on "
              "its left (123.6), so every pair with 1 looked loose. 4 and 5 were uneven the same way (4: 105.6 left, "
              "128.7 right; 5: 91.9 / 114.7).",
         changed="3: the upper ball's neck is one curve, as the lower ball's is; the top and bottom moved to the places "
                 "nearest each bowl's middle where every node meets at one curvature (top 0.51, bottom 0.445); then "
                 "every smooth node was evened. 5: the same evening. 1, 4 and 5 now show the same white on each side, "
                 "as I does. The small figures, the tabular forms and the fractions follow, and kerning with 1, 4 and "
                 "5 was fitted again.",
         now="Worst curvature ratio (faults): 3 2.00 (8) → 1.09 (0); 5 2.95 (6) → 1.05 (0). White left / right: 1 "
             "123.6 / 123.5 (advance 444 → 403), 4 117.6 / 117.7, 5 102.9 / 103.7.",
         still="The 2's ball neck has one fault (1.43), its own drawing. The 3's open left side was left as it is.",
         ev=[("3, curvature faults", "8 → 0"), ("5, curvature faults", "6 → 0"), ("1, white left / right", "123.6 / 164.5 → 123.6 / 123.5"),
             ("1, advance", "444 → 403")],
         rows=[("At 400, 0.82 in red", ["one", "three", "four", "five"], W1, *NOW_OVER_82),
               ("Small figures and a fraction at 400", ["uni00B9", "uni00B3", "uni2075", "uni2153"], W1, *NOW_OVER_82),
               (MASTERS_ROW, ["three", "five"], W38, *NOW_OVER_82)]),

    dict(id="defects", status="fixed", sev="medium", cls="Letters and punctuation · Ŋ ẞ ? !",
         title="Ŋ, ẞ, ? and !: four faults removed",
         body="Ŋ kept a stray 55 × 30 piece of its old foot serif on the baseline, left behind when the foot was cut "
              "away. ẞ had a 15-unit level step where its lower stroke's foot met the bowl. ?'s ball was 105.2 "
              "across, the heaviest round end in the face. ! ? ¡ ¿ carried the i's dot (116), where . , : ; … carry "
              "the period's (124).",
         changed="Ŋ: the cut keeps only what hangs below the baseline, and a new check warns on any piece under 3,000 "
                 "square units. ẞ: the curve now leaves the foot's corner directly. ?: the capitals' round end (96.8), "
                 "scaled about the stroke's top; ¿ is ? turned. ! ? ¡ ¿ take the period's dot.",
         now="? ball 105.2 → 96.8; their dots 116 → 124; Ŋ's stray piece gone; ẞ's step gone.",
         still="",
         ev=[("? ball", "105.2 → 96.8"), ("Dot of ! ?", "116 → 124"), ("ẞ step", "15 → 0")],
         rows=[("At 400, 0.82 in red", ["Eng", "uni1E9E", "question", "exclam", "questiondown", "exclamdown"], W1,
                *NOW_OVER_82)]),

    dict(id="g83", status="part", sev="low", cls="Letters · g",
         title="g's upper bowl runs as one curve past the ear",
         body="You asked whether the round top of g's upper bowl should be misaligned at the ear. It should not. In "
              "the Regular the outline either side of the ear stood 2 units apart, too little to see; at the Bold the "
              "outline above the ear stood 25 units out and the bowl below sat 10 inside: the notch you saw.",
         changed="In the Regular the bowl's outer upper-right quarter is one curve from its right side to its top, "
                 "fitted to the drawn pieces, and the ear's roots slide onto it, so the outline either side of the ear "
                 "lies on one curve. The accented g follow; the single-storey g did not change.",
         now="Regular: the step across the ear 2.1 → 0.",
         still="The heavy-weight notch is still in the Bold (24 units out above the ear, 10 in below). The same rule "
               "moved the ear into itself there and was taken out; moving the ear with the bowl at the Bold is open.",
         ev=[("Step across the ear, 400", "2.1 → 0"), ("At 800", "not yet")],
         rows=[("At 400 and 800, 0.82 in red", ["g"], [400, 800], *NOW_OVER_82)]),

    dict(id="open83", status="open", sev="medium", cls="Still open · 0.83",
         title="What is not done yet",
         body="The 0.83 work settles the Regular first. These are known and not yet done; they come before or with "
              "the weights.",
         items=[("The Light and Bold build every new sign by the existing rules. They were looked at, not tuned.",
                 []),
                ("6 and 9 still turn unevenly where the long stroke enters the bowl. Evening them undoes the even "
                 "thickness round their counters; one solve for both is not written yet.", ["six", "nine"]),
                ("Q's tail needs to be built where it leaves the bowl.", ["Q"]),
                ("The hooked and turned capitals (such as Ɓ Ɗ Ƙ Ƥ Ƭ Ǝ) keep first-drawing serifs and stems, longer "
                 "and heavier than the other capitals'. They are to be rebuilt from their base letters.",
                 ["uni0181", "uni018A", "uni0198", "uni01A4", "uni01AC", "uni018E", "uniA7AA", "uniA78D", "uni0196",
                  "uni019D", "uni2C64", "uni0191", "uni01B3", "uni01AE", "uni01B2"]),
                ("The glottal stops (ʔ and its kin) keep balls heavier than the new ?'s.", ["uni0294", "uni0241",
                                                                                          "uni0242"]),
                ("Making each part follow one rule across all the letters was not reached, apart from the "
                 "punctuation dot.", []),
                ("F's middle arm (lower than E's) and P's bowl (lower than R's) are left as they are until you "
                 "choose.", ["F", "P"])],
         changed="", now="", still="", ev=[], rows=[]),
]

CARDS82 = [
    dict(id="gss02", status="fixed", sev="high", cls="Letters · alternate g (ss02)",
         title="The single-storey g has 0.80's tail again",
         body="You compared the single-storey g in 0.80, in 0.81 and in the build before this round, and said 0.80's was the "
              "best: the new one was not smooth on the bottom-right curve. In 0.81 both edges of the stem ran straight down "
              "to the ball's height (−115 in the Regular) and the outside then turned in one tight quarter, 158 wide and 69 "
              "tall. Along the outside the radius went 64, 87, 136, 188, 262, 351, 428, 495: a tight corner, then a flat run "
              "into the lowest point. 0.80's outside leaves the stem at the baseline and turns in one quarter 255 wide and "
              "235 tall, with a radius of 207 to 290 all the way.",
         changed="0.80's construction is back: four quarter turns between five places, each handle 0.55 of its side. The "
                 "outside leaves the stem 2 units above the baseline, the lowest point sits at 0.518 of the bowl's width, "
                 "the ball's top 0.138 x-height under the baseline, and the ball is the j's. The bowl and stem stay as they "
                 "are today. ɡ (U+0261), which is this g as a component, takes its advance (Light 606 → 603, Bold 689 → 688).",
         now="The tail is within 1.0 unit of 0.80's anywhere along it at 300, 0.0 at 400, 0.4 at 600 and 1.0 at 800 (measured "
             "at old 550 and 700, now 600 and 800). Against the build before, the tail moves by up to 38, 40, 44 and 49 units "
             "at 300, 400, 600 and 800.",
         still="The curvature check still prints 0.80's own faults where the quarters meet at the lowest points and at the "
               "ball (Regular: ball's left side 1.42, outside's lowest point 1.45, inside's 1.38; the limit is 1.25). They "
               "are listed as your choice. The lower-right quarter itself has no fault.",
         ev=[("Tail against 0.80, 300 / 400 / 600 / 800", "1.0 / 0.0 / 0.4 / 1.0"),
             ("Tail moved against the build before", "38 / 40 / 44 / 49"),
             ("Outside's radius, lower-right quarter", "207 to 290"),
             ("Other glyphs moved", "ɡ only")],
         rows=[("0.80", ["g.ss02"], W4, "v080", None),
               ("0.81, before this round (0.80 in red)", ["g.ss02"], W4, "before", "v080"),
               ("Now (0.80 in red)", ["g.ss02"], W4, "now", "v080")]),

    dict(id="Cc", status="fixed", sev="medium", cls="Letters · weight balance",
         title="C and c end their two terminals on one vertical",
         body="You saw the c's top running much further right than its bottom. It was drawn so in the Regular: C's top barb "
              "reached 33 units past its lower end, and c's lower end 10 past its ball. Every reference face has the bottom "
              "as far out as the top or further (C, top less bottom: −30 to +2). The weight engine then grew the top more "
              "towards the Bold (C +12, c +13 at 800; old 700, now 800).",
         changed="The two terminals now end on one vertical, placed at the references' median reach over the round letter's "
                 "width (C over O 0.891, c over o 0.882). C's top barb comes in 11 units and its lower end goes out 22; c's "
                 "ball goes out 10 and its lower end stays. The half of the letter each terminal ends is stretched level to "
                 "meet it, so the curve keeps its shape. The accented C and c, Ꞓ ꞓ Ȼ ȼ, ¢ and ₡ follow.",
         now="Top less bottom, at every 50 units of the old axis from 300 to 700 (now 300 to 800): C was +25 +28 +33 +35 +36 +38 +41 +42 +45 and is now 0 at "
             "every stop; c was −15 −13 −10 −8 −7 −4 −2 0 +3 and is now +1 at every stop. Advances: C Light 660 → 653, "
             "Regular 680 → 669, Bold 723 → 707; c Light 489 → 486, Regular 505, Bold 553 → 554.",
         still="The Light C's left extreme now reads 1.27 on the curvature check (limit 1.25). ©'s C was not changed by "
               "this item (item 16 has since put this C in the ©); ₵, Ɔ ɔ and Ƈ ƈ are their own drawings and did not change. G was not changed (see the open G card).",
         ev=[("C top − bottom, 300 / 400 / 800", "+25 / +33 / +45 → 0 / 0 / 0"),
             ("c top − bottom, 300 / 400 / 800", "−15 / −10 / +3 → +1 / +1 / +1"),
             ("C Regular advance", "680 → 669")],
         rows=[("Now, the build before in red", ["C", "c", "Ccedilla", "cent"], W4, *NOW_OVER_BEFORE)]),

    dict(id="xX", status="fixed", sev="medium", cls="Letters · weight balance",
         title="x and X turn about their crossing, so all four ends grow alike",
         body="Towards the Bold, the top-left and bottom-right ends of x and X grew longer than the other two. The thick "
              "stroke gains more across than the thin one (x 73 → 132 against 37 → 47), and each serif hangs off its "
              "stroke's outer edge, so the thick stroke's two ends went out further. Measured from the four ends' centre at "
              "800 (old 700, now 800): x +27 / +6 / +7 / +29 (top left, top right, bottom left, bottom right), X +40 / +18 / +20 / +43. The seven "
              "references, at Area's stem step, stay within −6 to +4 of each other.",
         changed="Towards the Bold only, each letter now turns about its crossing, both strokes the same way, so the openings "
                 "between the ends stay as they were. X's four arms turn by one angle (0.51°); x's top arms move level by "
                 "+11 units and its bottom arms by −11, each stroke keeping its thickness. The Light and the Regular are "
                 "unchanged: the 1 to 2 units the drawings show at 300 and 400 are the variable font's curve conversion "
                 "(two off-curve points), not a change of drawing.",
         now="The spread of the four ends (largest less smallest) at the old axis's 450 / 500 / 550 / 600 / 650 / 700 (now "
             "466.3 / 532.9 / 600 / 666.3 / 732.9 / 800): x was 3 6 10 14 18 23 "
             "and is now 0 1 1 1 2 2; X was 3 7 11 15 19 25 and is now 0 at every stop. At 800 the x's ends grow +16 +17 +18 "
             "+18 and the X's +31.5 at all four. The Bold x is narrower: 596 → 582.",
         still="The x now leans slightly the other way at 800 (−0.005, where the references lean −0.037 to −0.018; it was "
               "−0.044, inside). One turn cannot meet both, and the even ends were kept. At the Bold the x's thick stroke's "
               "inner bracket still stands almost upright under its serif, as before.",
         ev=[("x ends' spread at 800", "23 → 2"), ("X ends' spread at 800", "25 → 0"), ("Bold x advance", "596 → 582")],
         rows=[("Now, the build before in red", ["x", "X"], W4, *NOW_OVER_BEFORE)]),

    dict(id="zZ", status="fixed", sev="medium", cls="Letters · weight balance",
         title="z and Z grow at all four ends alike, so they no longer lean right",
         body="The diagonal's outer corners are the top bar's right end and the bottom bar's left end, so each went out by "
              "half the diagonal's gain, while the bars' free ends (the beaks) stayed put. Measured from the four ends' "
              "centre at 800 (old 700, now 800): z +5 / +36 / +32 / 0 (top left, top right, bottom left, bottom right), Z +5 / +42 / +40 / +2. "
              "So the letters leaned right as they got heavier. In the references all four ends grow together, within −10 "
              "to +9 of each other.",
         changed="The beaks now move out level by the difference, in both masters; the diagonal, its corners and the letter's "
                 "width stay as the engine draws them. This was chosen over pulling the corners in, which would have "
                 "narrowed the Bold z by 31 units.",
         now="At 800, z +37 / +36 / +32 / +32 and Z +43 / +42 / +40 / +40. Spread at every 50 units of the old axis from 450 "
             "to 700 (now 466.3 to 800): z 1 2 2 3 "
             "3 5, Z 1 1 2 2 3 3 (z was 11 22 34 47 62 79). At 300: z 3, Z 1 (were 16 and 15). On the balance scale at 800, "
             "z +0.58 → +0.06 and Z +0.65 → +0.03 (references −0.18 to +0.15). Light advances: z 470 → 457, Z 605 → 590; "
             "Bold Z 687 → 690.",
         still="Z at 800 now leans +0.009, a little less than the references' +0.019 to +0.040 (it leaned more before and "
               "passed). See the open lean card.",
         ev=[("z balance at 800", "+0.58 → +0.06"), ("Z balance at 800", "+0.65 → +0.03"), ("References", "−0.18 to +0.15")],
         rows=[("Now, the build before in red", ["z", "Z", "z.ss06"], W4, *NOW_OVER_BEFORE)]),

    dict(id="erase", status="fixed", sev="medium", cls="Signs · interface",
         title="The delete keys are one frame of one weight",
         body="The inner outline of ⌫ and ⌦ was set by hand, so the sides did not match: slanted sides 43–64 / 52–73 / "
              "110–129 at 300 / 400 / 800 (old 700, now 800) against level sides 39 / 52 / 71. The inner point sat 99 units "
              "behind the outer one at 400 and 180 at 800 (a true inset would be 71 and 97), so at 800 it filled into a solid wedge. The top was "
              "pinned to the x-height, so the Bold grew downward only, and the cross sat at 484 where the box's middle is "
              "490.5.",
         changed="The frame is now a centreline with the two outlines half the stroke either side, so every side has one "
                 "weight and the inner point is sharp. The cross is centred in the box at every weight. ⌦ is ⌫ turned over.",
         now="Level / slanted / upright sides: 40 / 40 / 40 at 300, 52 / 52.2 / 52 at 400, 72 / 71.5 / 72 at 800. The Bold "
             "advance is 847 → 813.",
         still="", ev=[("Slanted side at 800", "110–129 → 71.5"), ("Inner point at 800", "wedge → sharp")],
         rows=[("Now, the build before in red", ["uni232B", "uni2326"], W4, *NOW_OVER_BEFORE)]),

    dict(id="check", status="fixed", sev="medium", cls="Signs · interface",
         title="The check mark has one clean vertex",
         body="✓ was two bars laid over each other: the short bar's foot stood out past the long one, leaving a notch at the "
              "vertex at every weight. Its strokes also grew like a letter's thick diagonals: 57 / 65 / 124 at 300 / 400 / "
              "800 (old 700, now 800; 1.90 times at 800).",
         changed="Rebuilt as two strokes: the short one into the vertex and the long one out, both 1.25 of the minus at every "
                 "weight, ends cut square, the vertex a small flat outside and a point inside.",
         now="Strokes 49 / 65 / 88–89 at 300 / 400 / 800, growing as the other signs do (1.37 times). One vertex, the same at "
             "every weight. The Bold advance is 622 → 582.",
         still="", ev=[("Stroke at 800", "124 → 88–89"), ("Notch at the vertex", "gone")],
         rows=[("Now, the build before in red", ["uni2713"], W4, *NOW_OVER_BEFORE)]),

    dict(id="radical", status="fixed", sev="medium", cls="Signs · maths",
         title="The radical sign is drawn as strokes, with corners where its edges meet",
         body="√ was a bar, a vee and a rectangle laid over each other. There was a jag where the lead-in met the downstroke; "
              "the lead-in did not change with weight (52 at 300 and at 800); the thin upstroke tapered by 3–4 units; and "
              "the thick stroke filled into a wedge at 600 and 800 (old 550 and 700, now 600 and 800). The ÷'s dots sat 3 units right of the bar's centre.",
         changed="√ is rebuilt from edges that meet in corners at the beak, the crotch and the foot. The lead-in, the "
                 "upstroke and the bar take the minus's weight; the thick stroke is 1.44 of them at every weight. The ÷'s dots "
                 "now sit centred over the bar in every master (their size is the ÷ card).",
         now="Lead-in / upstroke / bar / thick stroke: 40 40 40 57 at 300, 52 52 52 75 at 400, 71 71 71 102 at 800. The "
             "thick stroke grows 1.37 times to the Bold; the references' grows 1.24 to 1.71 (median 1.34).",
         still="The weight check now lists the radical at 800 (41 against 40) across the beak, where the downstroke's edge "
               "gets shorter as its inner point rises; no stroke thins.",
         ev=[("Lead-in, 300 / 800", "52 / 52 → 40 / 71"), ("Thick, 300 / 400 / 800", "57 / 75 / 102")],
         rows=[("Now, the build before in red", ["radical"], W4, *NOW_OVER_BEFORE)]),

    dict(id="sum", status="fixed", sev="medium", cls="Signs · maths",
         title="∑, < >, ×, ≤ ≥ take the same weights as the other signs",
         body="∑ is the drawing of the capital Esh (Ʃ), but the engine read it as a plain sign: its bars grew like hairlines "
              "(46 → 57, where E's arms grow 46 → 61), its thin diagonal by the sign rule (53 → 73), and its point was four "
              "nodes within 31 units, a zigzag. < and > were Libre Baskerville's drawing: arms 49.2 and 48.3 (65.4 / 64.4 at "
              "800, old 700, against the minus's 72), a 66-unit flat at the point, and the middle 2 units under the maths axis. × had "
              "arms of 49.1 and 45.6. ≤ ≥ were the < squashed to 0.82: arms of 41 beside a 52 bar.",
         changed="∑ now follows the capitals' rules (its bars as E's arms) and its point is a capital's vertex. < and > are "
                 "built from strokes of the minus's weight on the maths axis, with a flat of 0.79 of the stroke outside the "
                 "point (the references' median) and a point inside; ≤ ≥ are the same over a bar. × is two strokes of the "
                 "minus's weight crossing square.",
         now="At 300 / 400 / 800: ∑'s bars 36 / 46 / 61, thin diagonal 43 / 54 / 71, thick diagonal 77 / 98 / 158 (Z's 66 / "
             "88 / 149). < and > 40 / 52.3 / 71.6 on both arms; × 40.5 / 52.3 / 71.8; ≤ ≥ 40 / 52.4 / 71.4 with bars 40 / 52 "
             "/ 72. Bold advances: < > 602 → 608, ≤ ≥ 602 → 609, × 646 → 616.",
         still="At 800, ∑ still reads heavy in its upper diagonal where it meets the top bar (see the open card).",
         ev=[("< > arms at 800", "65.4 / 64.4 → 71.6"), ("× arms at 800", "64.4 / 60.9 → 71.8"), ("∑ point", "zigzag → one vertex")],
         rows=[("Now, the build before in red", ["summation", "less", "greater", "multiply", "lessequal", "greaterequal"], W4,
                *NOW_OVER_BEFORE)]),

    dict(id="sweep", status="fixed", sev="low", cls="Signs · the sweep",
         title="The sweep: every plain sign on the same stroke weights",
         body="The same faults were found across the other signs. Towards the Light, upright and slanted strokes followed a "
              "different rule from level ones: + had a 40 level stroke beside a 44 upright one at 300, ± and ¬ the same, "
              "every arrow's head was 44–45 beside a 40 shaft, and ⌃ ⇧ ↵ were 45. Inner outlines were set by hand: ⇧ ⇪ had "
              "head flanges of 32 beside sides of 52, ◊ ran 43 to 57, ∆'s sides 52 to 76 and 69 to 97. Some weights were "
              "off the minus: ≠'s stroke 46, ⌥'s diagonal 54.7, ↖ ↗ ↘ ↙ 48 (the arrow scaled down whole to 0.92). And ⌃ was "
              "the up arrow cut across, with a 54 by 16 notch in its crotch and two 2-unit steps.",
         changed="A straight stroke in a sign now takes the same rule in every direction (curved signs such as & @ $ ® § £ do "
                 "not move). ⇧ ⇪ ◊ are built as frames; ∆'s inner edges run parallel at A's weights. ≠ and ⌥ are at the "
                 "minus's weight, and the slanting arrows are made 0.92 as long at full weight. ⌃ is built from the arrows' "
                 "head stroke, with mitred corners. The second row changed in the Light only.",
         now="+ is 40 / 40 at 300; arrow heads 39.6–40 at 300; ⇧ ⇪ 40 / 52 / 71–72 all round; ◊ 39.5 / 52 / 71.2; ∆ thin 39 "
             "/ 49 / 64 and thick 64 / 86 / 146 (A's 39.6 / 48.5 / 64.7 and 64.5 / 86.5 / 147); ≠ 40 / 52.8 / 72.4; ⌥ 39.6 / "
             "51.6 / 70.3; ↖ 40–41 / 52 / 70; ⌃ 40 / 52 / 71 (all at 300 / 400 / 800; old 700, now 800), its Regular advance 612 → 566.",
         still="⇤ ⇥'s bar reads 44 at 300 beside 40. ✕ is 1.1 of the minus by design. ^ is an accent-like drawing with "
               "tapering arms, a different kind. ∞ ∂ ∫ µ π Ω ∏ are curves or letters and were not touched.",
         ev=[("+ at 300, level / upright", "40 / 44 → 40 / 40"), ("≠ stroke", "46 → 52.8 at 400"), ("⌃ notch", "gone")],
         rows=[("Now, the build before in red", ["notequal", "increment", "lozenge", "uni21E7", "uni21EA", "uni2303", "uni2325",
                                                 "uni2196", "uni2197", "uni2198", "uni2199"], W4, *NOW_OVER_BEFORE),
               ("Changed in the Light only: 300, and 800 for comparison", ["plus", "plusminus", "logicalnot", "bar", "brokenbar",
                "slash", "backslash", "numbersign", "arrowleft", "arrowright", "arrowup", "arrowdown", "arrowboth", "arrowupdn",
                "uni21B5", "uni21E4", "uni21E5", "uni2318", "uni25A1", "uni2606"], [300, 800], *NOW_OVER_BEFORE)]),

    dict(id="amp", status="fixed", sev="high", cls="Signs · ampersand",
         title="The ampersand is redrawn as one stroke and an arm",
         body="You said the ampersand needed a lot of work. In the Regular its strokes followed no single model: the diagonal "
              "was 90 across where v's thick stroke is 74; the loop's top 62 where the hairline is 43; the lower bowl's left "
              "side 93 (o's is 82) and its bottom 60. The upper counter was 0.45 of the lower one in area (references 0.55 to "
              "0.79) and its centre sat 59 units right of the lower counter's (references +1 to +49, median +12), so the loop "
              "sat over the crossing instead of over the bowl. Its pieces met in corners hidden inside the diagonal. Towards "
              "the Bold the bowl's stroke into the diagonal thinned (48.8 → 30.8 from 400 to 800; old 700, now 800) and the loop's counter "
              "closed to 69 across (references 134 to 166); towards the Light it thickened (45.9 → 53.0 at 300).",
         changed="The & is now one stroke and an arm. The stroke runs from the tail up the diagonal, round the loop, down the "
                 "spine across the diagonal, round the lower bowl and into the diagonal again; every corner is where two edges "
                 "meet. Its weights come from the letters: the diagonal and the loop's left side are v's thick stroke, the "
                 "bowl's left side o's round side, the loop's top and the spine o's hairline, the bowl's bottom and the tail "
                 "a's lower stroke, the arm v's thin stroke with v's serif. The loop now stands over the bowl, and each master "
                 "rebuilds the & at its own letters' weights.",
         now="Regular: diagonal 90 → 74, loop top 62 → 43, loop left 81 → 74, bowl left 93 → 82, bowl bottom 60 → 50; upper over "
             "lower counter area 0.45 → 0.58, centres +59 → +21. Bold: upper counter 69 → 167 across. Curvature: worst node "
             "1.02 / 1.03 / 1.03 (Regular / Light / Bold), no fault. The second weight check passes at every stop. Advances: "
             "Regular 810, Light 788 → 796, Bold 885 → 872.",
         still="At 800 the loop's outer top is broad and flat, from the heavy left shoulder (the loop's left side is 133 "
               "against a 53 hairline over a 218-unit quarter); the bowl's bottom (55 at the Bold) reads lighter than the "
               "references'; and the bowl's outer left turns tighter at 800 than at 400 (radius about 0.6 of the Regular's).",
         ev=[("Diagonal, Regular", "90 → 74"), ("Loop centre over the bowl", "+59 → +21"), ("Bold upper counter", "69 → 167")],
         rows=[("Now, the build before in red", ["ampersand"], W4, *NOW_OVER_BEFORE)]),

    dict(id="divide", status="fixed", sev="medium", cls="Signs · maths",
         title="The division sign's dots keep their distance from the bar",
         body="Towards the Bold the ÷'s dots followed the i's dot rule (1.51 times at the Bold): 178 across at 800 (old 700, now 800) and only 33 "
              "units from a 72 bar, where the gap was 74 at 400. The dots crowded the bar.",
         changed="Towards the Bold the dots now grow by the same rule as the bar, about their centres, and each stays at least "
                 "the bar's thickness away from it (the references' gap at their 700 is 0.45 to 1.11 of their bar, median 0.99). "
                 "The Light keeps its dots. They are also centred over the bar now (radical card).",
         now="Dots 96 / 118 / 137 / 162 at 300 / 400 / 600 / 800 (were 96 / 118 / 144 / 178); gaps 90–91 / 73–74 / 73–74 / "
             "72–73 (were 90 / 73 / 56 / 33); bar 40 / 52 / 60 / 72. The advance is unchanged.",
         still="", ev=[("Gap at 800", "33 → 72–73"), ("Dot at 800", "178 → 162")],
         rows=[("Now, the build before in red", ["divide"], W4, *NOW_OVER_BEFORE)]),

    dict(id="other", status="fixed", sev="low", cls="Letters · other symbols",
         title="Ə, ɂ, œ and ɽ keep their strokes' weight across the axis",
         body="Four glyphs where the engine misread one part. Ə's bar was read as white between two counters, so it got "
              "thinner towards the Bold: 79 / 67 / 48 at 300 / 400 / 800 (old 700, now 800). ɂ's lower stroke into the stem thinned towards the "
              "Bold and thickened towards the Light: 110 / 99 / 80. In the Light the joins of œ's o and e were read as "
              "strokes and the upper one filled in (58.2 at 350, 70.2 at 300, against 65.7 at 400). ɽ's tail jumps in "
              "curvature across its nodes (Regular 1.81 and 2.14), which the Bold made 2.31 and 2.66.",
         changed="Ə's bar now grows as E's middle arm does. ɂ's lower stroke follows the question mark's rule for the same "
                 "stroke. In the Light, œ is the Light o and e joined as the Regular joins them. ɽ's tail curves are evened "
                 "towards the Bold and in the 600 master.",
         now="Ə bar 79 / 67 / 48 → 59 / 67 / 80; ɂ lower stroke 110 / 99 / 80 → 95 / 99 / 103 (300 / 400 / 800); œ passes the "
             "second weight check (Light advance 935 → 940); ɽ Bold worst curvature 2.31 → 1.75, faults 13 → 4 (600 master 2.08 "
             "→ 1.59).",
         still="ɂ's upper side was left (moving it bent the neck into an S at the Bold). ɽ is not evened in the Light (there "
               "it thinned the tail to 34.4 at 300, where the Regular has 52.4), and the Regular's own 2.14 and its flag's "
               "flat place stay: the Regular's hook drawings wait on you.",
         ev=[("Ə bar, 800", "48 → 80"), ("ɂ lower stroke, 800", "80 → 103"), ("ɽ Bold faults", "13 → 4")],
         rows=[("Now, the build before in red", ["uni018F", "uni0242", "oe", "uni027D"], W4, *NOW_OVER_BEFORE)]),

    dict(id="fig", status="fixed", sev="medium", cls="Figures · weight balance",
         title="The flat bars of 2, 5 and 7 now gain weight with the figure",
         body="The flat bars of 2, 5 and 7 did not change weight: 73 units at 300, 400 and 800 (old 700, now 800), where the references' 7 grows "
              "(Serrif 68 / 82 / 138, Georgia Pro 63 / 82 / 145). The weight engine read each bar, two level edges 326 to 354 "
              "long, as a stroke, and then dropped it with every level reading of 64 or more that is not a pair of facing "
              "extremes (a rule meant for balls and blobs), so the bar kept 73. The rest of each figure grew around it: 2 grew "
              "only on top (top against bottom +0.39 / +0.36 at 300 / 800, references −0.11 to +0.04), 5 only at the bottom "
              "(−0.43 / −0.51), and 7's bar stayed frozen (left against right +0.26 / +0.30).",
         changed="A figure's flat stroke (straight, both edges level, longer than twice its thickness) is now a stroke: it keeps "
                 "its Regular share of the capital stem (0.85) in every master, so it grows as the capitals' straight thick "
                 "strokes do (86 → 148 towards the Bold). Two things followed, both found by the checks. 2's diagonal left the "
                 "base at a corner the engine lifted with the base but kept at its x, so its foot thinned at the Bold (51 → 34 "
                 "at 800); that corner now slides along the Regular's tangent by the bar's change. And the Light 7's bar end was "
                 "lengthened up through the cap height (the 7 stood at 716): a cut end's corner on a zone line now holds its "
                 "height, which also puts the Light Z's two corners back on 712 and 0 (they stood at 713 and −1). 5's upright "
                 "and 7's beak hang from the bar's underside, so the 7's beak drops by the bar's gain, as the references' do. "
                 "The small figures take their figure's moves; the .tf forms and the fractions with a 2, 5 or 7 follow. The "
                 "Regular is unchanged: the 1 to 2 units some drawings show at 400 are the variable font's curve conversion, "
                 "not a change of drawing.",
         now="Bars 73 / 73 / 73 / 73 → 51 / 73 / 96 / 126 at 300 / 400 / 600 / 800 (2, 5, 7, 7.ss06 and the .tf forms); the "
             "superiors' and inferiors' 39–40 → 27 / 40 / 51 / 68. Bar over stem growth at 800: 0.96 (references Serrif 0.92, "
             "Georgia Pro 1.00, Source Serif 4 0.80). 2: top against bottom +0.39 / +0.36 → −0.07 / −0.05 at 300 / 800, now "
             "inside; 5: −0.43 / −0.51 → −0.07 / −0.14, inside; 7: left against right +0.26 / +0.30 → +0.09 / +0.06, top "
             "against bottom +0.09 / +0.06 → +0.58 / +0.65, all inside. Heights unchanged (2 0 to 721, 5 −9 to 712, 7 0 to "
             "712 at every weight). Light advance of 7: 573 → 571; nothing else moved its advance.",
         still="2 now leans −0.029 at 800, where the references lean −0.006 to +0.006 (the lean check's one new flag), and "
               "its left against right at 800 is +0.33 (references +0.13 to +0.29). 5's ends: the bowl and ball grow out "
               "under a bar whose ends stay (right ends −0.50, left ends +0.52 at 800), the case of Z before item 4, not the "
               "bar's weight. 7's right ends read −0.27 at 800 (references −0.14 to +0.06): the thicker bar lowers the "
               "diagonal's outer corner. 4's top-left reach is untouched (left ends −0.70 at 300 and −0.45 at 800, "
               "references −0.30 to +0.21 and −0.27 to +0.16): a bar-end rule as Z's would close it, and was not written. "
               "The small figures' bars go 0.68 / 1.70 of the Regular at 300 / 800, where their stems go 0.78 / 1.63.",
         ev=[("Bar, 300 / 400 / 600 / 800", "73 / 73 / 73 / 73 → 51 / 73 / 96 / 126"),
             ("Small figures' bar", "39–40 → 27 / 40 / 51 / 68"),
             ("2, top against bottom at 800", "+0.36 → −0.05"), ("5, top against bottom at 800", "−0.51 → −0.14")],
         rows=[("Now, the build before in red", ["two", "five", "seven", "seven.ss06"], W4, *NOW_OVER_BEFORE),
               ("The small figures, 300 and 800", ["uni00B2", "uni2075", "uni2077", "uni2082", "uni2085", "uni2087"], [300, 800],
                *NOW_OVER_BEFORE),
               ("The Light Z, 300 (and 800 for comparison), against the build before items 12 to 14", ["Z"], [300, 800],
                "now", "prev")]),

    dict(id="S3", status="fixed", sev="medium", cls="Letters and figures · weight balance",
         title="S, s and 3: the top and bottom ends now grow alike",
         body="You saw the S's bottom-right end reach out, and the 3's bottom-left terminal. Measured as the four ends' "
              "outward growth about their centre at 800 (old 700, now 800): S top left +42, top right (the top barb) +20, bottom left (the "
              "bottom barb) +23, bottom right +45, so the bowls' outer sides grew twice what the terminals did. 3: top ball "
              "+12, bottom ball +39; the engine read the two balls on interleaved knots and the top ball rode the counter's "
              "knot inward, and at 300 it moved outward (+8 while the rest shrank). s was already within 4. The seven "
              "references stay within 1 to 13 of each other at Area's stem step.",
         changed="On each side the top end and the bottom end now keep the Regular's difference, each moving half the gap, as "
                 "C's two terminals are held. The barb, the ball and the bowl's outer stroke move level as a whole, keeping "
                 "their shape and thickness; the counter takes up the run between; the spine and the 3's middle bar stay. "
                 "The accented S and s take the letter's new advance, and the small 3s and the fractions with a 3 follow. "
                 "The Regular is unchanged: the 1 to 2 units the drawings show at 400 are the variable font's curve "
                 "conversion, not a change of drawing.",
         now="The four ends' spread at 300 / 800: S 8 / 25 → 1 / 1, s 2 / 4 → 0 / 0, 3 11 / 27 → 1 / 1 (at 800: S +33 +33 "
             "+32 +32, 3 +26 +25 +25 +25). On the balance scale at 800: S right ends −0.40 → +0.02, left ends −0.31 → −0.02; "
             "3 left ends +0.44 → −0.02, right ends −0.19 → 0.00; at 300, S right ends −0.35 → 0.00 and 3 left ends +0.48 → "
             "+0.04. At the S's middle height its spine now stands 18 units right of the ink centre at 800, where the "
             "Regular's stands 17 (it was 6.5). Advances: Bold S 646 → 638, s 519 → 517, 3 669 → 649; Light S 562 → 563, s "
             "456 → 457, 3 577 → 585.",
         still="The S's spine stands more upright at 800 than in the Regular (its centre travels 104 against 138 per tenth of "
               "the height; 112 before): the bowls now move level with the ends and the spine keeps the engine's points. "
               "Still just outside the references at 800: S left against right +0.02 (−0.05 to +0.01) and top against "
               "bottom +0.03 (−0.08 to −0.01; the references grow more at the bottom); s on the diagonals −0.29 (−0.25 to "
               "−0.05), and at 300 top against bottom +0.07 and diagonals −0.36; 3 top against bottom −0.03 (−0.19 to "
               "−0.07). $ and § were not changed by this item (item 17 has since made their ends grow alike: see the $ card). "
               "8 shares no rule with S; its ends are even and its two readings at 300 were "
               "measured and left. After this item the accents over S stood up to 4 units right of the ink centre at 800; "
               "item 14's mark rule put the Bold's back over the ink (2 to 4 units). The write-up records the accents over "
               "Z as standing off the ink centre since item 4, and does not say they moved.",
         ev=[("S ends' spread, 300 / 800", "8 / 25 → 1 / 1"), ("3 ends' spread, 300 / 800", "11 / 27 → 1 / 1"),
             ("S right ends at 800", "−0.40 → +0.02"), ("Bold 3 advance", "669 → 649")],
         rows=[("Now, the build before in red", ["S", "s", "three", "Scaron"], W4, *NOW_OVER_BEFORE)]),

    dict(id="g", status="part", sev="medium", cls="Letters · weight balance",
         title="The g's loop keeps its place under the bowl",
         body="Towards the Bold the default g's upper bowl seemed to grow to the left against the lower loop (left ends −62 "
              "units at 800 on the balance scale (old 700, now 800), references −8 to +1; +22 at 300; left against right "
              "−0.37 at 800, "
              "references −0.06 to +0.01). Read on the masters, the bowl stays where it should and the loop moves: the "
              "loop's centre stands 15.5 units right of the bowl's in the Regular, 79 at the Bold and −4.5 at the Light. The "
              "engine reads the g on shared knots: the loop counter's right edge sits 2 units from the bowl's outer right, "
              "and the loop's outer right on the ear ball's centre. So the loop's right side, growing as a loop side (+67 a "
              "side), carried the ear's ball right with it (the ear's reach 118 → 201 at 800, 1.70 times, where the ball "
              "rule gives 1.40), and the link's turn into the loop, a 56-unit curved stroke read as a loop side (56 → 123), "
              "pushed the bowl's left side out.",
         changed="After the engine, in each master, the loop (its counter and the outer outline under the counter's top) moves "
                 "level so its centre keeps the Regular's offset from the bowl's; the link between takes its share of the "
                 "run, and the notch where the link's turn meets the loop keeps the Regular's depth (without it the moved "
                 "loop made a spur). Then the ear's ball moves level until the ear reaches past the bowl by the Regular's "
                 "reach times the ball rule; the neck takes up the change. The accented g take the new advance with their "
                 "marks over the moved ink; ǥ's stroke follows the loop; g.ss02 and ɡ did not change. Tried and refused: "
                 "giving the link's turn its own rule (56 → 81 at the Bold), which took the push off the bowl but thinned "
                 "the turn's top between the masters (38 → 30 at the old 550 to 650, now 600 to 732.9). After items 12 to 14 the kerning was fitted "
                 "again: only pairs with S, s or g on one side changed (Light 15, Bold 57).",
         now="Loop centre less bowl centre, Light / Regular / Bold: −4.5 / 15.5 / 79.0 → 17.0 / 15.5 / 15.0. On the balance "
             "scale: left ends −0.96 / −1.00 → −0.00 / +0.03 at 300 / 800 (references −0.21 to +0.07 and −0.12 to +0.02); "
             "left against right at 800 −0.37 → −0.21, at 300 −0.13 → −0.05; diagonals at 800 −0.13 → +0.08 (inside). The "
             "ear's reach (118 in the Regular): Light 90 → 100, Bold 201 → 165 (0.85 and 1.40, the ball rule). Link (81 in the Regular): 73 "
             "/ 128 → 72 / 134 (Light / Bold). Curvature: worst node 1.13 / 1.23 / 1.21 (Regular / Light / Bold), no fault. "
             "Advances: Light 552 → 563, Bold 700 → 664 (n's growth would give 648), the 600 master 637 → 622.",
         still="The link's turn keeps the engine's growth (56 → 123, 2.20 times): the bowl's left side and the turn grow 2.0 "
               "times where the stem grows 1.8, so left against right at 800 (−0.21) is still outside the references' −0.06 "
               "to +0.01, and the turn still reads heavier than the rest. The ear's ball reaches out at the ball rule while "
               "the loop's right side grows 20, so the top-right end reads +0.91 / +0.74 at 300 / 800 (references −0.22 to "
               "+0.81 and −0.20 to +0.24) and the four ends' spread is 21 / 46 (at 800: top left +41.5, top right +65.5, "
               "bottom left +43.5, bottom right +19.5); the references' ears are not balls of Area's size. Top against "
               "bottom +0.15 at 300 and −0.09 at 800, just outside.",
         ev=[("Loop off the bowl, Bold", "79.0 → 15.0 (Regular 15.5)"), ("Left ends at 800", "−1.00 → +0.03"),
             ("Ear's reach, Bold", "201 → 165"), ("Bold advance", "700 → 664")],
         rows=[("Now, the build before in red", ["g", "gbreve", "uni01E5"], W4, *NOW_OVER_BEFORE)]),

    # ---------- items 15 to 18 (axis-0.81.md, "Owner round 8, items 15 to 18", rows 99 to 103; measured on the 0.82 axis) ----------
    dict(id="at", status="part", sev="high", cls="Signs · @ (item 15)",
         title="@ is rebuilt: a ring with the letters' stress, and Area's own a inside",
         body="Area's @ was Libre Baskerville's. Its ring was thick on the left (74) and thin on the right (39), with top and "
              "bottom 49 / 51 at 400; its top stood on the cap overshoot (721) and its bottom at −122; and its a was an italic a "
              "drawn into the ring as one contour, so no rule could place or weight it. Towards the Bold its thinnest place "
              "thinned (35 at 766.7 and 34 at 800, where the check asks 41); towards the Light one place fell to 0.667 of the "
              "Regular (47.4 against 71.1, where the stem's law gives 0.705) and another grew (47.5 at 300 against 41.0 at "
              "400). Every one of seven references has the letters' upright stress: top and bottom at their o's top, the left "
              "side 0.86 of the stem at 400 and the right 0.883 of the left.",
         changed="One construction in every master. The ring is one stroke out of the a's foot: up the right side, over the "
                 "top, down the left, along the bottom and out to the tail's cut, each edge one chain of curves. Its top and "
                 "bottom are the master's hairline (o's top), its left side 0.86 of the Regular's stem and its right 0.883 of "
                 "the left, carried into each master by the hairline's law. The box is the references': top 701, bottom −164. "
                 "The a is Area's a.ss03 (upright, single-storey) of that master, scaled to the references' share of the "
                 "ring's counter, its strokes then made the references' weight. After your note on the published page (the a "
                 "sharper at the heavy weights), each of the a's two crotches is rounded by a fillet of 0.30 of the a's stem. "
                 "Nothing else moved; only collision kerning with @ changed, a unit each.",
         now="Ring at 300 / 400 / 600 / 800: left 53.1 / 74.1 / 98.0 / 131.0 → 58 / 67 / 74 / 83; right 31.8 / 38.7 / 45.2 / "
             "53.6 → 53 / 62 / 66 / 73; top 41.9 / 49.2 / 54.7 / 62.8 → 37 / 43 / 47 / 53; bottom 40.5 / 50.8 / 58.2 / 68.2 → "
             "37 / 43 / 47 / 53; top over side 0.99 / 0.87 / 0.76 / 0.68 → 0.66 / 0.67 / 0.67 / 0.68 (references 0.67). The "
             "a's stem over the stem 1.57 / 1.07 / 1.08 / 1.08 → 0.98 / 0.85 / 0.83 / 0.79 (references 0.98 / 0.84 / 0.78). "
             "Box 721 / −122 → 701 / −164. The weight check no longer lists @ thin at the Bold; the ray check passes it at "
             "every 25 to 50 units from 300 to 800. Curvature, worst node: Light inf (8 faults), Regular 1.36 (3), 600 2.58 "
             "(10), Bold inf (10) before; now Light 1.20, Regular 1.22 and 1.18 / 1.21 / 1.24 at 600 / 700 / 800, no node "
             "fault. Left against right at 300 −0.377 → −0.048, at 800 −0.177 → −0.006. Advances: Regular 955 → 960, Bold "
             "984 → 988.",
         still="At 800 the a is dark against its ring: its stem is 110 against a ring side of 83, 1.33 times, as the "
               "references' median, but Area's bold a is a wide bowl, so it reads darker than Georgia Pro's. The bottom "
               "crotch, where the bowl's bottom meets the foot, still reads as a cleft at 800 (two lobes; a larger fillet "
               "waved). The a's spur on the stem's top reads small at 300, and the counter's right side is the stem's "
               "straight edge, as a.ss03's is.",
         ev=[("Ring top over side, 300 / 800", "0.99 / 0.68 → 0.66 / 0.68"), ("Box top / bottom", "721 / −122 → 701 / −164"),
             ("Curvature, worst at 800", "inf → 1.24"), ("a's stem at 800 against the ring's side", "110 / 83")],
         rows=[("Now, 0.81 in red", ["at"], W4, *NOW_OVER_BEFORE)]),

    dict(id="ring", status="part", sev="medium", cls="Signs · © ® ℗ (item 16)",
         title="© ® ℗ share one ring with the letters' stress and hold Area's own letters",
         body="Area's ©, and ® and ℗ with it, carried Libre Baskerville's ring with a level stress: sides 32 / 40 / 53 against "
              "top 44.5 / 52.5 / 65 at 300 / 400 / 800 (top over side 1.39 / 1.31 / 1.23), where the letters' o is upright. © "
              "held Libre Baskerville's small C, not this round's C; ® held a drawn R and ℗ Area's P at 0.52, lightened; and "
              "the masters grew the ring's box (the Bold's top 775 against 761). In seven references the ring's top is 0.79 to "
              "0.95 of its side: a mild upright stress, none level.",
         changed="One ring for all three: the Regular's © outer outline in every master (its box and the advance do not "
                 "move), the counter moved in by the side and the top; the side the references' share of the stem, the top "
                 "0.87 of the side. The letter is Area's own C, R or P of that master, scaled to the references' share of the "
                 "counter and set off its centre by their offsets, so © carries this round's C with both terminals on one "
                 "vertical. In the Regular its strokes are made the references' weights relative to the ring; in the other "
                 "masters the Regular's additions are carried by the stem's law (each master's own additions made C's barb "
                 "thicker at 300 than at 400 in a first build).",
         now="Ring side / top at 300 / 400 / 800: 32 / 44.5, 40 / 52.5, 53 / 65 → 39 / 34, 43 / 38, 58 / 50 (top over side "
             "1.39 / 1.31 / 1.23 → 0.87 / 0.88 / 0.86). ©'s C thick 52.9 / 73.9 / 130.9 → 44.9 / 63.9 / 105.9; its centre off "
             "the counter's −0.027 / −0.033 / −0.049 → −0.025 / −0.023 / −0.019 of its width (the references'). ®'s R stem 41 "
             "/ 60 / 89 → 38 / 54 / 91. ℗'s P stem 37 / 47 / 62 → 40 / 57 / 94, its height 0.533 / 0.557 / 0.594 → 0.622 / "
             "0.627 / 0.653 of the counter. Advances: all three 868 in every master (℗ was 858 in the Light and 876 in the "
             "Bold).",
         still="The Light letters are lighter than the references' (©'s C 0.82 of the stem against their 1.03): the "
               "Regular's additions carried by the stem's law keep every stroke even across the axis but do not reach the "
               "references' heavier small letters at 300. The Bold R's and P's serifs read slab-like (the upright addition, "
               "27 units, on a letter at 0.56 size). Seven smooth nodes in the scaled R and P bend 2 to 3 degrees after "
               "rounding to whole units.",
         ev=[("Ring top over side, 400", "1.31 → 0.88"), ("©'s C thick at 800", "130.9 → 105.9"),
             ("©'s C at 300, over the stem", "0.82 (references 1.03)"), ("Advances", "868, all three")],
         rows=[("Now, 0.81 in red", ["copyright", "registered", "uni2117"], W4, *NOW_OVER_BEFORE)]),

    dict(id="dollar", status="part", sev="medium", cls="Signs · $ ð § (item 17)",
         title="$ runs through its bar as one S; ð's ascender and §'s ends keep their weight",
         body="You saw the $ misaligned: where the S passes behind the bar, the edge leaving the bar on one side met the edge "
              "entering on the other at a different height and angle. Measured as each crossing edge carried on to the bar's "
              "middle from both sides, the steps were within 0.9 in the Regular but up to 23.3 in the Light and 41.4 in the "
              "Bold, and the bar stood 5.5 to 10 units right of the S's ink centre in every master. The engine had moved the "
              "counters' corners on the bar's edges as the bar's knots, which also made the $ heavier at 300 than at 400 where "
              "the bottom stroke meets the bar (59.7 against 55.3). ð's ascender curve past the crossing grew towards the "
              "Light (51.7 at 300 against 48.4 at 400), read with the ascender's thick. $'s four ends spread 6 at the Bold and "
              "§'s 10.",
         changed="The bar moves level so its middle is the S's ink centre, and each edge that crosses it is refitted as one "
                 "curve through the bar and cut at the bar's edges, so the two pieces are one curve; the stubs are one "
                 "length. The ends of $ and § grow alike about their centre. In each master ð's stroke between the crossing "
                 "and its cut end keeps the Regular's thickness times the hairline's law.",
         now="Steps across the bar, Light / Regular / 600 / Bold: 23.3 / 0.9 / 7.9 / 41.4 → 1.1 / 0.5 / 0.6 / 1.5; bar off "
             "the S's centre 10.0 / 8.5 / 7.0 / 5.5 → −0.5 / 0.5 / 0.0 / −0.5; stubs 94 / 94 (Regular), 95 / 95 (Bold). Four "
             "ends' spread at 300 / 600 / 800: $ 2 / 3 / 6 → 1 / 1 / 1, § 4 / 4 / 10 → 2 / 1 / 3. The ray check no longer "
             "lists $ or ð. ð across its ascender curve, junction to cut end: Light 71 / 59 / 48 / 43 → 58 / 47 / 39 / 36, "
             "Bold 72 / 60 / 50 / 43 → 82 / 69 / 55 / 52 (Regular 70 / 57 / 48 / 42). Curvature on the whole $, Light / "
             "Regular / Bold: 2.64 / 1.36 / 3.59 → 1.43 / 1.36 / 2.20. Advances: $ Light 582 → 581, Bold 652 → 656; § Bold "
             "610 → 615.",
         still="At 800 the $'s upper-left counter is pinched: 58 units of white at its middle against 99 right of the bar "
               "(the lower counter 150 / 93). The S's own bowls are uneven at the Bold (the upper bowl's left side grows "
               "inward), which no bar position balances (the best shift is 4 units). ð's ascender curve at 300 now reads "
               "lighter than its crossbar. § at 800 keeps its lumpy left side: that is the engine's drawing, and only its "
               "ends were moved.",
         ev=[("Largest step across the bar, Bold", "41.4 → 1.5"), ("Bar off the S's centre, Regular", "8.5 → 0.5"),
             ("$ upper counter at 800, left / right of the bar", "58 / 99"), ("§ ends' spread at 800", "10 → 3")],
         rows=[("Now, 0.81 in red", ["dollar", "eth", "section"], W4, *NOW_OVER_BEFORE)]),

    dict(id="hook", status="part", sev="low", cls="Marks · the hook above (item 18)",
         title="The hook above (U+0309) turns with even curvature",
         body="On the whole mark the curvature check read jumps at its nodes: worst ratio 1.53 in the Regular (the eye's top "
              "left), 2.01 in the Light and 1.95 in the Bold, with two flat places; the capital form 1.30 / 1.38 / 1.72 "
              "(Regular / Light / Bold). Its first drawing was a union of an arc, a ball and a stem; in the variable font's "
              "masters the mark is two overlapping parts, the curl and the stem, which carried the jumps, and the engine's "
              "knots made them worse.",
         changed="Every smooth node is brought to one curvature by changing handle lengths only: on the Regular's merged "
                 "outline, so the variable font's default curl and stem come from it, and on each master's curl and stem "
                 "right after they are built. The curl's last node (the eye's foot, where the closing line runs inside the "
                 "stem) is now a corner; the check had read it as a smooth node bent 126 to 138 degrees. 27 composites carry "
                 "the mark (ả ẳ ẩ ẻ ể ỉ ỏ ổ ở ủ ử ỷ, their capitals and ss03 forms).",
         now="Worst ratio (faults), Light / Regular / Bold: the mark 2.01 (4) / 1.53 (2) / 1.95 (5) → 1.21 (1) / 1.18 (1) / "
             "1.23 (3); the capital form 1.38 (2) / 1.30 (1) / 1.72 (6) → 1.23 (0) / 1.11 (0) / 1.14 (4). No composite comes "
             "closer: the least white between the hook and the rest of each of the 27 at 300 / 400 / 600 / 800 is 54.0 / "
             "54.0 / 46.6 / 32.5, as before. In the Light four capitals with two marks (Ẩ Ẳ Ể Ổ) set the hook 1 to 2 units "
             "lower over the changed ink.",
         still="Flat places remain: two in the Bold's curl, four in the capital form at the Bold, one in the Light. The "
               "Regular's eye foot leaves the stem's straight at 1.00 of its tightest (the stem's top is a corner by "
               "design).",
         ev=[("Worst node, Light / Regular / Bold", "2.01 / 1.53 / 1.95 → 1.21 / 1.18 / 1.23"),
             ("Capital form, Bold", "1.72 → 1.14"), ("Least white in the 27 composites at 800", "32.5, as before")],
         rows=[("Now, 0.81 in red", ["hookabovecomb", "hookabovecomb.case"], W4, *NOW_OVER_BEFORE),
               ("Two of its 27 composites", ["uni1EA3", "uni1EA8"], W4, *NOW_OVER_BEFORE)]),

    # ---------- still open ----------
    dict(id="o-G", status="open", sev="medium", cls="Still open · G",
         title="G's top: its ends grow the other way from C's",
         body="G's top barb is its own drawing, not C's, and already ends 17 units inside its stem in the Regular. Its top "
              "less bottom goes −9 / −20 / −51 at 300 / 400 / 800 (old 700, now 800), the opposite of what C did before "
              "this round; its lean at 800 is outside the references.",
         changed="Not changed this round, so the C's new terminal line does not reach it, nor item 13's rule for "
                 "the ends of S and 3.",
         now="", still="It needs its own rule for the top barb (hand-over, open item 6).",
         ev=[("Top − bottom, 300 / 400 / 800", "−9 / −20 / −51")],
         rows=[("Now (unchanged this round)", ["G"], W4, "now", None)]),

    dict(id="o-800", status="open", sev="medium", cls="Still open · at 800",
         title="∑ and & at 800: the notes left from this round",
         body="∑ at 800 (old 700, now 800) still reads heavy in its upper diagonal where it meets the top bar: the drawn bracket curve fills to a "
              "wedge (the diagonal itself follows Z's rule, 158 against Z's 149, and its upper over lower ratio is inside the "
              "references'). The & at 800: the loop's outer top is broad and flat from the heavy left shoulder (133 against a "
              "53 hairline), the bowl's bottom (55) reads lighter than the references', and the bowl's outer left turns "
              "tighter than at 400.",
         changed="Both were changed this round (see their cards); these are what remains.",
         now="", still="Next, if you want the Bold heavier at the base: a lighter loop shoulder and a heavier bowl bottom for "
                       "the &; the bracket curve into ∑'s upper diagonal.",
         ev=[("∑ thick diagonal at 800", "158 (Z 149)"), ("& bowl bottom at 800", "55")],
         rows=[("Now at 600 and 800, the build before in red", ["summation", "ampersand"], [600, 800], *NOW_OVER_BEFORE)]),

    dict(id="o-lean", status="open", sev="low", cls="Still open · lean at 800",
         title="x and Z lean slightly short of the references at 800",
         body="Side effects of the x/X and z/Z fixes. x at 800 (old 700, now 800) now leans −0.005, where the references lean −0.037 to −0.018 "
              "(it was −0.044, inside). Z at 800 leans +0.009 against the references' +0.019 to +0.040.",
         changed="The even ends were kept over the lean for x; a turn of 7 units instead of 11 would keep the x's lean in "
                 "the band and leave the ends 7 apart.",
         now="", still="Your call: even ends (as now) or the references' lean.",
         ev=[("x lean at 800", "−0.005 (refs −0.037 to −0.018)"), ("Z lean at 800", "+0.009 (refs +0.019 to +0.040)")],
         rows=[("Now at 400 and 800, the build before in red", ["x", "Z"], [400, 800], *NOW_OVER_BEFORE)]),
]

for _c in CARDS83:
    _c.setdefault("sec", "83")
    _c.setdefault("ver", None)        # None: the page's --after label
for _c in CARDS82:
    _c.setdefault("sec", "82open" if _c["status"] == "open" else "82")
    _c.setdefault("ver", "0.82")
CARDS = CARDS83 + CARDS82
