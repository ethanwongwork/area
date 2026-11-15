# Area Serif: alternate candidates (2026-11-14)

Owner, on build 0.79: "show me all the alternate glyph candidates like g, such as a, etc. look into the other
alternates too", with a list of the alternates serif faces carry, letter by letter.

This goes through that list for a serif made for interfaces. Nothing here is in the font except the two sets it
already had. The drawn candidates are in `typefaces/area-serif/build/figures/alternates-candidates.png`, made by
`tools/alt_candidates.py` from the finished letters' own parts (never by scaling). The owner picks; a picked
candidate then gets a Light and a Bold, kerning classes, its accented forms and a check, as `g.ss02` has.

## The rule for an alternate (owner, 0.79)

An alternate is a different form, not a different width or weight. `S.ss03` and `s.ss03` failed that and were
removed. So each row below asks: is the other form a different skeleton, and does it have a use in running
interface text at 13 to 16 px?

## What the references ship

| Face | Sets |
|---|---|
| Serrif | single-storey a (ss01), single-storey g (ss02), an alternate G (ss03), an alternate at sign (ss04), ss05, slashed zero, swash Z z, titling M |
| Source Serif 4 | ɑ and ɡ as letters (U+0251, U+0261), ss01, ss02, slashed zero |
| Literata | ɑ and ɡ as letters, ss01, ss02, slashed zero |
| Merriweather | four sets, an alternate dollar, slashed zero |
| Georgia Pro, Newsreader, Lora | none |

Four of the seven have a slashed zero; three have a single-storey a; three a single-storey g.

## In the font now

| Set | Form | State |
|---|---|---|
| ss01 | 1 without its foot | kept |
| ss02 | single-storey g | tail redrawn in 0.80 |
| ss03 | (ball-end dollar) | gone in 0.80: the ball-end dollar is the one dollar |

## Drawn as candidates

| Candidate | Made from | Why it is worth a look | What it still needs if picked |
|---|---|---|---|
| a, single-storey | q's stem top and bowl on d's foot | The pair to the single-storey g; three references have it. The same bowl as b d p q, so a line of text gets rounder and plainer | Its own spacing (it is d's width now, wide beside n), accents (24 composites), a decision on whether ss02 switches a and g together |
| l, tailed | l's flag and stem on t's hook | Tells l from I and 1 (`Illegal`, `1l`), the classic interface problem | Kerning (the hook reaches under the next letter), ł ĺ ľ ļ, fl ligatures |
| 0, slashed | the zero and its own hairline across the counter, inside the oval | Tells 0 from O in codes, IDs and tables; four references have it | The `zero` feature, tabular width check, the Bold's slash |
| 0, dotted | the zero and the period's dot | The same job, quieter at text sizes | The same |
| 7, barred | the seven and a bar of the figures' hairline | Tells 7 from 1 in handwriting cultures; rare in interface type | Only if asked for |
| z, barred | the z and a bar of the lowercase hairline | The same tradition as the barred 7 | Only if asked for |

My recommendation: the slashed zero first (most useful in an interface, most common in the references), then the
single-storey a as the partner of ss02's g, then the tailed l. The barred 7 and z are shown for completeness.

## Looked at, not drawn

Lowercase

| Letter | The other form | Area today | For an interface serif |
|---|---|---|---|
| b | flat foot, open italic bowl | spurred b, the roman form | No: italic or display |
| c | ball, teardrop or beak | ball | The ball is the face's terminal (a c f j r y); a beak would be a second system |
| d | uncial, ascender curving back | upright | No: display |
| e | slanted (Venetian) bar | level bar | No: reads as a different period of type |
| f | descending | sits on the baseline | No: italic |
| h n m | in-curling leg, uncial arch | roman | No: italic |
| i j | dotless, diamond or teardrop dots | round dots; dotless forms are in the font and the f ligatures use them | Nothing to add |
| k | looped bowl | two straight arms | No: italic |
| p q | swept tails | flat serifs | No: italic |
| r | half r | ball shoulder | No: historical |
| s | long s | `longs` is in the font as a letter | A `hist` feature could reach it; no interface use |
| t | flat cross foot | curved hook | No: the hook is the same part the tailed l borrows |
| u | no right stem | stem and foot | No: a small capital's form |
| v w | flat or round vertices | pointed | No |
| x | two back-to-back curves | straight | No: italic |
| y | straight tail | curved tail with a ball | A candidate if the ball tails ever read busy; not drawn |

Capitals

| Letter | The other form | Area today | For an interface serif |
|---|---|---|---|
| A | flat or beaked apex | pointed | No |
| C G S | one serif or two | C and G: top spur; S: both ends | Proportion of the same form (the S alternate was removed for this) |
| G | spurless | spurred with a chin | Serrif has this as ss03. A candidate after the three above; not drawn |
| I | plain stroke | serifed, as a serif I is | Nothing to add |
| J | descending | sits on the baseline (lowest point -9) | A J that drops is a text-face habit; no interface gain. Not drawn |
| K M N | curved leg, splayed stems, overshooting diagonal | upright, roman | No: display |
| Q | detached, tucked or swash tail | a tail that drops 238, deeper than the descenders (224) | A short tail that stays above the descender line helps tight line heights; candidate, not drawn |
| R | curved or swash leg | straight leg | No: display |
| U | lowercase-style with a stem | symmetric | No |
| W | crossed centre | four strokes | No: display |
| Y | chalice | straight arms | No |

Figures and signs

| Glyph | The other form | Area today | For an interface serif |
|---|---|---|---|
| 1 | flag and foot, plain, hooked | flag and foot; ss01 footless | Done |
| 2 | wave base | level base | No |
| 3 | flat top | round top | Helps 3 against 8 at small sizes; candidate, not drawn |
| 4 | open top | closed | Helps 4 against 9 at small sizes; candidate, not drawn |
| 6 9 | closed bowls | open tails | No |
| & | Et form, swash | the usual ampersand | Display |
| $ ¢ | one bar, two bars, broken bar | one bar through; ball ends (0.80) | Decided |
| ? ! | shaped dots | round dots | No |

## Open for the owner

1. Which of the drawn candidates to build (my order: slashed zero, single-storey a, tailed l).
2. Whether the single-storey a and g should be one set or two.
3. Whether any of the not-drawn candidates (spurless G, flat-top 3, open 4, straight-tail y, short-tail Q) should be drawn for a look.
