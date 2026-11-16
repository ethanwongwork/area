# Kerning per master (0.81)

Until 0.80 the Light and the Bold reused the Regular's 5,394 kerning keys. The only change was a collision pass on
each master's ink: the Bold opened 6,444 more pairs, the Light 178. In the variable font the GPOS did not vary,
except for those opened pairs. Now each master's kerning is generated from its own outlines, by one rule measured
in the references.

## How the Regular's pairs are made (unchanged)

Run in `normalize`, in this order (`spacing.py`):

1. `space` sets the side bearings: Georgia Pro's (`REFERENCE`), plus the `OPTICAL` corrections and `TRACK`.
2. `rekern` keeps Libre Baskerville's pairs at their designed fit across the bearing change.
3. `fit_kerning` reads `fit_kerning.json` `"pairs"`. These come from `tools/fit/fit.py`, which measures the white of
   every pair (the mean over the rows both inks share, each side no deeper than 0.15 of the zone height behind its
   outermost ink). That white is taken against the face's control (nn, HH, Hn, nH), in Area, Georgia Pro and
   Serrif. A pair that is 8 or more outside both references is moved to the nearer one.
4. Two collision passes (`open_collisions` on the core, then `finish`): kern families (an accented letter kerns as
   its letter), `open_all` over the whole coverage at `MIN_GAP` 13, and f before a dot.
5. `alternates.kern_and_open`.

The method is "measure the white, compare it with the references at the same weight, open what touches". Nothing
in it depends on the Regular, so it runs on any master.

## What the references do across weight (`tools/fit/weights.py`, numbers only)

All values are at Area's heights. "rel" is a pair's white less its control's. The slope is rel at 300 or 700
against rel at 400, least squares over about 3,700 pairs.

| face | n stem L/R/B | nn white 300/400 | nn white 700/400 | rel slope 300 | rel slope 700 | zone bearing change per unit of stem change, 300 / 700 |
|---|---|---|---|---|---|---|
| Georgia Pro | 62 / 98 / 172 | 1.054 | 0.907 | 1.019 | 0.855 | -0.106 / -0.093 |
| Serrif | 71 / 90 / 165 | 1.021 | 0.875 | 1.006 | 0.926 | -0.079 / -0.082 |
| Source Serif 4 | 54 / 93 / 174 | 1.080 | 0.752 | 1.072 | 0.557 | -0.185 / -0.177 |
| Literata | 73 / 95 / 162 | 1.065 | 0.823 | 1.072 | 0.661 | -0.170 / -0.151 |
| Area 0.80 (before) | 55 / 78 / 140 | 1.036 | 0.907 | 1.066 | 0.792 | -0.082 / -0.089 |
| Area 0.81 (after) | | 1.045 | 0.907 | 1.060 | 0.870 | -0.103 / -0.089 |

- **Kerning rule.** Area's fit follows Georgia Pro and Serrif. In those two faces, a pair's departure from the
  control scales the way the control white does. The mean rel slope at 700 is 0.891 and the mean nn ratio is
  0.891. At 300 the two are 1.013 and 1.038. Source Serif 4 and Literata tighten their Bolds further (slopes 0.56
  and 0.66), so they are not followed. The rule, per master M:

  `k_M(pair) = s_M * (N_R + k_R) - N_M`

  Here N is the unkerned pair white measured on each master's own outlines (fit.py's measure, `spacing.Optical`),
  and s_M is M's control white over the Regular's (nn, HH, Hn or nH by the pair's cases; 00 for figures). Area
  measures s = 1.046 / 1.049 (Light, lowercase / capitals) and 0.907 / 0.893 (Bold). Every pair's white in the
  master is the Regular's white scaled by that one ratio.
- **Bearings rule.** The zone bearing changes by about -0.09 of the stem change in Georgia Pro and Serrif, on both
  sides of the axis. The Bold's `bold_bearings.json` follows this per letter: the RMS distance from the
  references' per-letter change, scaled by Area's stem gain, is 0.9 (lowercase) and 0.4 (capitals). The one
  misfit over 4 units is g's right side (Area -25, this second reading -19.6; bold_bearings.py's own reading is
  -25). Left as it is.
- **The Light's bearings did not fit.** They came from the Bold's change run backwards (f = -0.371): +1.8 a side
  in the lowercase and +1.7 in the capitals. The references' own Light, scaled by Area's stem loss over theirs
  (0.836), gives +2.3 and +2.9. The extra opening is mostly on the right of open and diagonal letters: v w y K N U W
  get +5 to +10 where the old rule gave +1, and j's left -1 against +3.9. The fix, by rule:
  `light_bearings.json` (`tools/weight/bold_bearings.py light`) is the Light's own change. build.py has
  `bold.bearing_change` read it for the Light run (`spacing.light_bearing_change`). Result: +2.4 a side
  (lowercase +2.0, capitals +2.7).
- **Floor.** Serrif is the reference that keeps a floor. Its closest pairs keep 9.5 / 9.4 / 6.0 units at the 2nd
  percentile and 15.6 / 17.8 / 14.8 at the 10th (300 / 400 / 700). The floor falls towards the Bold with the white,
  not with the hairline, which rises (31 / 35 / 47). So the floor is `MIN_GAP * s_M`: 13.6 at 300, 13 at 400,
  11.8 at 700.

## The pipeline (`spacing.kern_master`, called from `build.kern_masters`)

1. **Transfer.** Every Regular key gets the rule's value, as the mean over the pairs it sets. Those pairs are its
   core letters, figures and punctuation (accented forms kern as their letter), or its first 6 members. The
   Regular's groups are kept. The 146 keys whose two inks share no row (quote and period, for example) scale as
   `k_R * s`.
2. **Same-weight fit.** This is fit.py's `kern_table` on the master against Georgia Pro Light or Bold and Serrif 300
   or 700 (`weights.master_fit`): 213 changes in the Light and 585 in the Bold. They are stored as changes in
   `fit_kerning.json` `"masters"`. `AREA_KERN_FIT=1` measures them again.
3. **Collisions at the master's floor** (`open_master`). The letters, figures and punctuation are opened first, on
   the key their family shares. Then every glyph of the coverage and every alternate is opened, by exception.
   f before a dot uses `F_DOT * s`.
4. **Between the masters** (`open_between`). A row's edge is not linear in the weight where an outline also moves
   up or down (a mark rising over a Bold letter), so a pair that is clear in both masters can close up between
   them. The instance at 350 (Light side) and 550 (Bold side, with the Bold's mid layer) is built from the masters'
   points and checked at its own floor. A pair short there gets the master change that clears it: 3 pairs in the
   Light and 16 in the Bold.
5. **One key set.** `spacing.equalize` writes each key a master lacks with the value that master's classes give it,
   so all three VF masters carry the same 8,063 keys.

The pipeline is deterministic: rerunning `kern_master` on the built UFOs gives identical kerning (0 differences
across 5,664 Light and 9,184 Bold keys).

## Numbers, before and after

- **Keys.** The static Regular keeps its 5,394. Light: 5,572 before, 5,664 after. Bold: 11,838 before, 9,184
  after. In the VF all three masters carry 8,063 keys.
- **GPOS varies** (instancer statics, HarfBuzz; values at 300 / 400 / 700):

  | pair | before | after |
  |---|---|---|
  | AV | -79 / -79 / -79 | -83 / -79 / -93 |
  | To | -98 / -98 / -98 | -95 / -98 / -102 |
  | Ty | -21 / -21 / -21 | -16 / -21 / -29 |
  | Wa | -67 / -67 / -67 | -70 / -67 / -77 |
  | f) | 36 / 36 / 36 | 40 / 36 / 47 |
  | v, | -64 / -64 / -64 | -69 / -64 / -58 |
  | gj | 70 / 70 / 92 | 57 / 70 / 91 |
- **Collision audit** (`audit_kern.py`: 46,219 pairs; fail means under floor − 5):

  | | 300 | 350 | 400 | 550 | 700 |
  |---|---|---|---|---|---|
  | before | 2 fail | 0 | 0 | 66 | 78 |
  | after | 0 | 0 | 0 | 0 | 0 |

  The worst failure before was ầ.ss03 after ấ.ss03 at 700, at -85: the Bold's collision pass never looked at
  alternates. After, the least whites are 10.6 / 9.0 / 8.3 / 8.4 / 7.9. More pairs now sit in the tolerance band
  between floor − 5 and the floor (1,677 at 700 against 589), because pairs that were loose are tightened to the
  rule.
- **Rhythm, second method** (`tools/fit/rhythm.py`, FreeType rendering of the VF unhinted, HarfBuzz kerning). Each
  cell is before → after:

  | size | weight | stems cv | between-letter cv | pair-white sd (nn units) | drift from the Regular's pair whites |
  |---|---|---|---|---|---|
  | 13 | 300 | 0.313 → 0.291 | 0.303 → 0.277 | 0.306 → 0.315 | 0.132 → 0.139 |
  | 13 | 700 | 0.235 → 0.231 | 0.205 → 0.203 | 0.371 → 0.371 | 0.092 → 0.083 |
  | 16 | 300 | 0.285 → 0.293 | 0.243 → 0.254 | 0.324 → 0.315 | 0.092 → 0.093 |
  | 16 | 700 | 0.239 → 0.240 | 0.192 → 0.196 | 0.418 → 0.408 | 0.091 → 0.077 |
  | 64 | 300 | 0.266 → 0.262 | 0.229 → 0.221 | 0.476 → 0.453 | 0.029 → 0.032 |
  | 64 | 700 | 0.217 → 0.223 | 0.173 → 0.179 | 0.557 → 0.541 | 0.093 → 0.072 |

  For comparison, the Regular has stems cv 0.271 / 0.254 / 0.251 and between-letter cv 0.265 / 0.178 / 0.175 at
  13 / 16 / 64 px.

  The Bold's rhythm is no worse than the Regular's, and its pair whites came 15 to 22% closer to the Regular's. The
  Light's between-letter spread stays above the Regular's at 16 and 64 px, before and after. Georgia Pro does the
  same (Light 0.25 against Regular 0.20 at 64 px). The cause is the Light's larger counters, not its pairs.

  The punctuation pairs still drift about +0.2 nn in the Bold (y. P. v, r.). The rendered measure caps each side
  by the shared rows; fit.py caps by the letter's zone. The two methods disagree there, and fit.py's is the one the
  Regular was fitted with.
- **Sheets** (`build/figures/kern-081/`, each before over after): `text.png` and `kern-heavy.png` at 300 / 400 /
  700, `worst-collisions.png` (the 20 pairs furthest under the floor before), `worst-rhythm.png` (the 20 pairs
  whose rendered white departed furthest from the Regular's).

## Regenerate

```
cd typefaces/area-serif
AREA_KERN_FIT=1 .venv/bin/python build.py   # outlines, transfer, same-weight fit measured again
                                            # (needs Georgia Pro and Serrif), collisions, VF
.venv/bin/python audit_kern.py              # or qa.py
```

A plain `build.py` runs everything except the reference measurement, and reuses the stored fit changes.
`AREA_MASTER_KERN=0` restores 0.80's behaviour. After a bearing change in the Regular, regenerate the Regular's
fit first (SKILL.md, Fit), then run the command above.

## Open

- The Bold's composite ầ / ầ.ss03 (and its Vietnamese relatives) puts its grave about 45 units further left than
  the Regular does. The grave runs into its own circumflex and into the letter before it. The kerning now opens
  for it, but the mark placement belongs to the weight engine.
- In `build.py`, the Light's bearings reach `bold.bold_font` by swapping `bold.bearing_change` for one call. The
  owner of bold.py should read `light_bearings.json` there when `v["f"] < 0`.
