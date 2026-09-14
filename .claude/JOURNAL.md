# Project journal

Why the system is the way it is, newest first. The handoff says what to do now; this says
why things ended up like this. Consult it when a decision looks arbitrary and the handoff
does not explain it.

## 2026-09-14 — A size class has to mean one height

Segmented named its *item* height with its size class, so the track came out a tier taller
than the class said and an `xs` segmented rendered 28px beside a 24px `xs` select. The
workaround had been to pick one tier down at each call site, which is a rule nobody can
hold and which was already written down as a caveat rather than treated as a bug. Naming
the outer height and deriving the item fixed it everywhere at once. Worth remembering that
the caveat had been in CLAUDE.md for weeks: a documented workaround is still a bug, and
writing it down made it look settled.

## 2026-09-14 — The stroke-versus-fill icon rule was the wrong abstraction

"Fluent icons are filled paths, so a stroke-based icon beside them will not match at any
weight" was true in effect and wrong in its reasoning, which only showed up when Stadium's
marks arrived — twenty-eight of twenty-nine stroked, and matching perfectly. What actually
governs is optical weight: a 1-unit rule, round terminals, and an ink box of 12 units for a
rectilinear mark or 14 for a round one, which is where Fluent's own marks land. The rule
was standing in for a property that correlates with the thing that matters rather than
being it. Their markup is vendored verbatim because reducing it to a path list is what
would break the fit.

## 2026-09-14 — A hue rotation is not free, and red was a misleading sample

The rotation layer was introduced with red at -4 degrees, which cost 0.0003 of chroma, and
that number went into CLAUDE.md as though it characterised rotations in general. Green at
+14 costs 0.043 of chroma and moves L by 0.009, because green at hue 150 sits in a wide
part of sRGB and 161 does not. One sample from the cheap end of a range was generalised
into an invariant. The cost is real and visible downstream: green's waived code-block
contrast fell from 3.06 to 2.80.

Separately, `CHROMA_TRIM` exists because Stadium's anchor answers a different question than
cross-family evenness does — a rung is pinned against white, which says nothing about a
family beside its ten siblings. At the light end sRGB holds far more chroma in a pale green
than a pale blue, so the families that *can* be bright, are.

## 2026-09-14 — The audit cannot see every dead override

`DOCS_CSS` lives in `area.base` and the dogfood audit fails any docs rule naming an
`.area-*` class, because such a rule loses to `area.components` silently. It cannot catch
the other shape of the same bug: a selector naming only docs classes on an element that
*also* carries an Area class. `.docs-sidebar` is an `area-panel`; a corner toggle is an
`area-button`. Both `display` rules were dead and looked fine. The layer order already had
the answer — `area.utilities` sits after components precisely so a rule can win without
`!important` — so the fix was to use the door rather than widen the check.

## 2026-09-14 — Vibrancy is capped by the gate, not the palette

Chased "make the colours more vibrant like ChatGPT" to its root and found rung 500 is already
at each family's chroma peak (red 100%, blue 100%, indigo 100%). There is no headroom in the
palette. What separates OpenAI's warm buttons is that they measure 3.0–3.8:1 with white text
and pass only under APCA (Lc 62–70) — they would fail a WCAG 2.2 gate. That reframed the whole
question from "find more chroma" to "decide which standard governs", which is now a planned
contrast-policy axis rather than a silent choice.

Also established that Area owns hue and Stadium owns lightness and chroma. Rotation is close to
free — it holds L and C, and gamut mapping gives back at most 0.0003 chroma — which is what
makes hue safe for Area to tune when the other two are not.

## 2026-09-14 — Shared rungs are right for chroma, wrong for weight

Tonal strokes came from one shared rung and rendered at wildly different weights: indigo
3.68:1 on white, green 1.80:1, from the same token. Fixed by computing per family. The general
lesson, now in CLAUDE.md: a foreground wants a shared rung because the goal is comparable
*chroma*; a stroke wants comparable *weight*, and a shared rung cannot give it, because a rung
is a lightness and hues do not share a luminance at one.

## 2026-09-13 — Naming by measurement, three times over

Radius presets, colour rungs and spacing all converged on the same rule: name a thing by its
value so the name can be checked. Radius presets became `0/2/4/6/8/10/12/pill` after
`sharp/subtle/default/rounded` proved to need a lookup table and never said which of two names
was rounder.

The counter-example is instructive. Colour levels were *also* named by measurement for a while
(`blue-58` meaning L 0.58) and that had to be abandoned when the Stadium palette arrived,
because Stadium anchors to contrast rather than lightness — the hues deliberately sit at
different lightnesses at a shared rung. Naming by value only works when the value is the thing
that is held constant.

## 2026-09-12 — The gate is the design tool

The contrast gate stopped being a lint and became the instrument the palette is tuned with.
Changing a curve and reading `report.ts` grouped by assertion is faster and more honest than
eyeballing swatches. It has since caught: a solid step that was neon, twelve non-monotonic
scales, a border invisible against its own fill, and four separate errors in colour-walk code
where WCAG was checked without APCA.

Corollary worth keeping: when a measurement contradicts a plausible story, the measurement
wins. "OpenAI's sidebar row is 40px" was read off a screenshot and was wrong — their tokens say
32px, the same as ours, and a ratio had already been built on the bad number.
