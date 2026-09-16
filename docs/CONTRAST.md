# Color, stroke and focus contracts

Revised in V01 after the user rejected E03’s heavy default outlines. See [V01](batches/V01/README.md)
for the current visual direction, matched captures and measured limits. E03 remains dated evidence.

## Readability and identification

Small labels, placeholders and code are normal text and must meet 4.5:1. Hover does not
change the text category. Area also retains its supplementary APCA content floor in dark
mode. These are separate policies; APCA is not a WCAG conformance standard.
[WCAG contrast minimum](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html).

Quiet borders may supplement text-identified buttons and visual grouping. Fields with no
value, unchecked controls and required state indicators need a distinct signal. Area’s increased-contrast preference gives
these required boundaries at least 3:1 against the documented adjacent surfaces. The standard
soft appearance deliberately falls below that threshold for several boundaries and states;
it is not represented as universally conforming. A hover
color does not need to contrast with its resting color; the control must remain legible.
[WCAG non-text contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html).

## The stroke hierarchy

Existing supplementary tokens remain distinct from required indicators:

- `border-decorative`: section/table rules and container seams. Light 75 / dark 800.
  Existing 1.1 aesthetic floor retained. This is decoration, never the only field/state cue.
- `border-faint`: floating frames, token badges and standard control edges. Light 150 / dark 750.
  Existing 1.2 floor retained, plus the segmented track's own adjacent fill check.
- `border-subtle`: quiet text-identified outlines and swatch edges. Light 200 / dark 750.
  Existing 1.3 floor retained. A swatch's exact color is not inferred solely from its outline.
- `border` and `border-hover`: supplementary stronger definition, 250/650 and 300/600.
  Existing 1.5 and 1.9 aesthetic floors retained; they are not required-indicator tokens.
- `stroke-control`: increased-contrast fields, unchecked glyphs and neutral selection boundaries. 450/400.
  The faint filled backgrounds alone do not reliably identify an empty input.
- `stroke-control-hover`: one stronger neutral step, 500/350. Invalid fields keep their
  danger edge across hover and focus.
- `stroke-selected`: accent text rung, 650/150. In increased contrast, selected chips and choice boundaries use
  this independently of bright solid fills, which may carry black marks.
- `stroke-width`: a constant 1px required edge. Surface's `border-width` remains decorative;
  Elevated can remove container frames without erasing a field or selection boundary.

No duplicate divider/container aliases were introduced: their current consumers share one
purpose and treatment. V01 adds presentation aliases so soft and increased-contrast appearances share the same endpoints.
V02 tonal `*-border` recipes blend existing readable family ink onto the canonical neutral
surface and measure unchanged 1.3/1.9 floors (plus dark hover APCA 15). This avoids saturated
green/teal raw-rung outlines without editing the palette. These semantic colors have no raw
rung number. They remain quiet outline definitions; required danger edges use `fg-danger`.

## Soft presentation and increased contrast

`edge-control` reads `border-faint` by default; `edge-control-hover` reads `border-subtle`.
`edge-selected` reads `border-faint`, `edge-accent` reads `accent-border`, and `fill-toggle`
reads `border-subtle` (`fill-toggle-hover` reads `border`). Set `data-area-contrast="more"` to select their strong counterparts:
`stroke-control`, `stroke-control-hover`, `stroke-control`, `stroke-selected`, `stroke-control`
(and `stroke-control-hover` for the toggle hover).
Set `data-area-contrast="standard"` to explicitly reset a subtree. Without a root preference,
CSS follows `prefers-contrast: more`. This preference is separate from the eight axes.

The aliases are unregistered derivations re-emitted on axis and preference boundaries.
Text and invalid colors do not depend on this preference. Editable-field focus changes from
neutral to accent under increased contrast; other focus indicators remain accent. Decorative
seams stay quiet.
The browser audit retains the same 3:1 requirement in both modes: standard has **3,012
shortfalls / 21,120 checks**, more has **0 / 21,120**. These are fixture measurements,
not overall conformance claims or individual counts of WCAG violations. The build gate
continues validating the strong endpoint tokens; it does not certify the default soft edges.

## Focus

`focus-color` replaces `border-focus`. `focus-width` and `focus-offset` replace `ring-width`
and `ring-offset`; both are 2px geometric primitives, independent of elevation. `ring` was
removed. Components paint an opaque CSS outline, preserving their existing selection border
and shadow. Native choice controls and buttons use the accent outline on `focus-visible`.
Input shells, Textarea and Select use `field-focus-color`: the measured neutral
`stroke-control` endpoint in standard mode and the accent `focus-color` endpoint in increased
contrast. Their zero-offset opaque edge sits inside a 6px halo made from the current 6%/8%
shadow ink. The code disclosure retains its inset outline to fit the clipped code frame.

The former 45% halo could not be validated by measuring its opaque source token. The browser
runner now reads the actual outline, rejects alpha, checks its width/style and measures it
against its actual ground. Token checks cover neutral and tonal surfaces. Focus geometry is
informed by [WCAG Focus Appearance](https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html),
a Level AAA criterion; this focused work does not claim overall AAA conformance.

## Text and solid fills

Placeholder shares the readable muted rung (550 light / 250 dark). Its role remains useful
for future treatment, but a lighter gray must not make the hint unreadable. Tonal text uses
650 light / 150 dark so the same foreground clears the active tint as well as the resting one.

Solid hover prefers the existing page-relative direction, then takes the other adjacent rung
if that would lose label contrast. The foreground stays fixed. The old test demanding that
all dark hovers lighten was replaced with adjacent-step and unchanged-label readability tests.

Syntax colors walk the palette against the actual code background. Light uses the first
passing rung from 500 toward darker colors; dark walks lighter with APCA as well. All four
syntax waiver groups are removed. Palette values, hue rotations and chroma trims are unchanged.

## State geometry and forced colors

Checkbox/radio marks now have positioned dimensions; percent-sized children of the former
intrinsic grid could collapse to zero. Switch thumbs use the solid's measured foreground in
the checked state. Selected segments retain a real border when shadows are absent, and all
segments keep the same foreground on hover. Sliders have distinct track and thumb definition.

`packages/styles/src/forced-colors.css` uses Canvas/CanvasText and Highlight/HighlightText for
required marks, selected segments, invalid dashes and focus. Select restores the native arrow.
The targeted system-color rules accommodate environments where shadows disappear; they do not
replace the user's chosen colors with a fixed palette.
[Forced-colors behavior](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/forced-colors).

Native Windows forced-colors execution, Firefox/Gecko and assistive-technology validation remain
release checks. A passing token or Chromium paint matrix does not establish those results.

## Verification boundary

`npm test` checks semantic pairings across all 66 shipped color themes. `contrast/report.ts`
now exits nonzero when it prints an unwaived failure. `npm run build` still does not run tests.
The [paint lab](http://localhost:4321/contrast.html) measures actual fields, marks, selected
states, syntax and opaque focus across four elevation presets. Run its button with keyboard
focus (Tab, then Enter); a pointer click cannot prove focus-visible styling.

These checks cover the fixtures and named surfaces, not every possible consumer composition.
Do not place these controls directly on arbitrary images or solid-tone backgrounds and assume
this contract applies. E05–E10 still own component behavior and release
accessibility validation; the separate System lab keeps those known defects visible.
