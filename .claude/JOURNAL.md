# Project journal

Why the system is the way it is, newest first. The handoff says what to do now; this says
why things ended up like this. Consult it when a decision looks arbitrary and the handoff
does not explain it.

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
