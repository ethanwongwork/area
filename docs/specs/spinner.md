# Spinner spec

**Captures:** `docs/research/captures/spinner/`
**Peers:** Progress (known or unknown duration on a rail), Skeleton (content placeholder),
Button, Input, Badge and Switch (host a Spinner when loading)

## Owner decisions

- 2026-09-26: **Neutral by default, accent by override** (DESIGN_SYSTEM.md, "Color and
  focus"). Spinner already followed it: the arc is `neutral-solid`; `tone="accent"` opts in.
  *Superseded 2026-09-29 (owner, D1): the arc is the Selection role (`selection-solid`,
  display.css:216), accent by theme; the `tone` axis was removed.*

No Spinner section existed in prior decisions. The second pass (owner: decide every open
item) changed nothing here.

## Job and boundaries

Spinner says an action is in progress, in a small space (a button, an input, a badge, a switch
row, an empty region). With no known end its arc turns; with a `value` the same ring stops at how
far along the task is, or how much of a quantity is used (see "Value"). A long task shown as a
bar is Progress; a labelled reading with a description is Meter; a placeholder for arriving
content is Skeleton.

## Variants

| Axis | Value | Justification | Where it appears |
|---|---|---|---|
| size | sm 12, md 16 (default), lg 24 | Matches the icon slot it replaces | Untitled 32–64 standalone, 20 in buttons |
| composition | in Button, Badge, Input; standalone with a label | Hosts' loading states | Gallery tiles `button`, `badge`, `input`, `empty` |

## Sources

| Id | Type | What | Link / commit / path | License | Captures |
|---|---|---|---|---|---|
| uui | design system (source) | Loading indicator; Button loading | `components/application/loading-indicator/loading-indicator.tsx:9-111`, `components/base/buttons/button.tsx:13-127` at `4702dc0` ([reference](../research/untitled-ui-reference.md)) | MIT | source reading only |
| area | this system | 9 gallery tiles (re-captured after the second pass) | localhost gallery | — | `area--*` (9) |

Target products searched without an equivalent: ChatGPT (sidebar, menus, model picker,
settings card); Notion (page menu, Share popover, tasks board, returns table view); Figma
(file browser, editor inspector, layers, main menu, bottom toolbar). All were captured
loaded, so no spinner was on screen; a product spinner needs a capture during a load.

## Anatomy

```
area  span.area-spinner  --_size square; track = the arc's ink at 25%, masked to an SVG ring
  ::before  the arc: a quarter-turn SVG mask with round caps; rotates 360° in 1s linear
           (display.css:214-242; was a conic arc with ::after cap dots, 2s)
```

## Measurements

Read from the nodes of `area--size-small`, `area--default`, `area--size-large`,
`area--tone-accent` and `area--button` (the re-captured boxes are the unrotated sizes):

| Node · property | sm | md | lg | accent | in a neutral solid Button |
|---|---|---|---|---|---|
| box | 12 × 12 | 16 × 16 | 24 × 24 | 16 × 16 | 16 × 16 |
| arc | rgb(40) | rgb(40) | rgb(40) | rgb(92, 93, 254) | rgb(250) (the label's ink) |
| track | rgb(238) | rgb(238) | rgb(238) | rgb(238) | rgb(250) at 25% |
| animation | `area-spin` | | | | |

## Decisions

| Slot · property | Area value | Basis | Reason when it differs from the basis |
|---|---|---|---|
| size | 12 / 16 / 24 (`space-*`, display.css:213-215); md = `icon-md` | Icon slot it stands in for (Button, Input, Badge icon slots are 16) | Untitled's standalone indicator starts at 32; its button spinner is 20 because its button icons are 20 |
| stroke | **1/8 of the size: 1.5 / 2 / 3** (one 16-unit SVG mask, stroke 2) | Primer 16 / 2, Untitled 4 on 32 | Was 2px at every size, thin at lg. A 2.5px md option was reviewed and not taken (owner, batch 6) |
| construction | **SVG masks for ring and arc; round caps** | ChatGPT draws its spinner as SVG | Owner 2026-09-28: the conic gradient and hard-edged radial mask looked pixelated, and 2px cap dots did not read as round |
| arc | 25% | Untitled ~28% (indicator), ~25% (button) | — |
| arc ink | `selection-solid` (display.css:216), neutral by default; `currentColor` inside a Button | Owner; emphasis roles (D1) | Untitled brand |
| in a Button | **arc `currentColor`, track `currentColor` at 25%** (display.css:211) | The host's label ink, so it shows on any fill (audit spec pass) | Was `neutral-solid` on a `neutral-solid` button: only the light track showed |
| in a Button · size | the Button tier's icon box (`--_icon`: 12 / 16 / 20), not the Spinner's own size | Audit S18 (owner 2026-09-30): the spinner stands in for the leading icon | Was a fixed 16 at every tier |
| track | the arc's ink at 25% (≈ #c9 on white; display.css:226-229) | Primer; ChatGPT 30% (2026-09-27 audit) | Darker than the rail (`edge-control` #e2); audit E-22 left open. Was `bg-component-active` #eee |
| speed | **1s** per turn, `--area-ease-linear`, fixed at every motion preset (display.css) | Untitled, Primer, shadcn, Spectrum 1s (owner 2026-09-27) | Was 2s, the slowest of 14 systems; ChatGPT 2s |
| motion | stops under `data-area-motion="0"` and reduced motion (display.css, motion block) | docs/MOTION.md "Reduced motion" (2026-10-07) | Reduced motion slowed it to 1.8s from 2026-09-27 to 2026-10-07 (Fluent); open question below |

## States

| State | Changes | Evidence |
|---|---|---|
| running | rotates | all tiles (`animation-name: area-spin`) |
| motion none | `animation: none`; the arc stays visible and still | display.css:304; not tiled |
| reduced motion | `animation: none`; the arc rests at its identity turn | display.css; not tiled |

## Behavior and accessibility

With `label`, the Spinner is `role="status"` with `aria-label`; without it, it is
`aria-hidden` and the host announces (primitives.tsx:282-296): Button sets `aria-busy`
and `aria-disabled` (Button.tsx), Input names it with `loadingText` (Input.tsx:125, 144), Switch sets
`aria-busy` on its input. No forced-colors rule (unverified).

## Peers and consistency

| Peer | Shared role | Area value in peer | Spinner | Match / reason |
|---|---|---|---|---|
| Progress, Skeleton | motion axis | stop under `motion="0"` | same | match (audit) |
| Progress, Slider | fill / arc | `neutral-solid` | same | match |
| Progress, Slider | track | rail `edge-control` #e2 (audit S5) | ink at 25% ≈ #c9 | differs (E-22 open) |
| Button (any fill) | ink on the fill | label ink | arc = label ink, 25% track | match (fixed in the audit's spec pass; `area--button`) |
| Input, Badge, Switch | icon slot | 16 | 16 | match |

## Visual pass

2026-09-28, Claude in Chrome (batch 6): ChatGPT's spinner caught while opening conversations
(`chatgpt--spinner-{18x18,24x24,28x28}`): an SVG ring in the text ink with its track the same
path at 30% opacity, `spin 2s steps(60)`, at 18 (icon-sm) and 24. Area: arc and track from one
ink (track 25%), 1s linear, 12 / 16 / 24. Same construction; the 1s speed is the owner's
2026-09-27 decision (Untitled, Primer, shadcn, Spectrum) and stays over ChatGPT's 2s. Notion
and Figma showed no spinner during these loads (they use skeletons). No change.

Earlier note:

The gallery groups the tiles (Default, Tones, Sizes,
Content). The spinner inside a neutral solid button now shows its arc in the label's ink.
Nothing in Notion or Figma to compare. Unverified: dark theme, forced colours.

## Verification

9 Area captures after the second pass read. Build and test results are in the
[cohesion audit](../research/cohesion-audit.md#verification).

## Motion and interaction, 2026-10-07

Contract: `docs/MOTION.md`. Research: `docs/research/motion-2026-10-07/crispness-and-current-state.md`.


| Interaction | Before | After |
|---|---|---|
| Turn | `rotate`, `calc(slow × 4)` (1s subtle, 1.6s expressive), `linear` keyword | `rotate`, **1s fixed**, `--area-ease-linear` (MOTION.md: 0.6–1s a turn at every preset) |
| Reduced motion | slowed to 1.8s a turn | **stops** (MOTION.md "Reduced motion": loops stop) |
| `data-area-motion="0"` | stopped only because the zeroed token made the duration 0: the `:is(…, .area-spinner::before, …)` rule was dropped (a pseudo-element is invalid inside `:is()`) | stops by its own rule (`[data-area-motion="0"] .area-spinner::before`) |

Stopped, the arc rests at its identity turn, 12 to 3 o'clock: the drawing itself, not a frame
caught mid-loop. Crispness: no change needed (SVG masks; no resting transform, `rotate` only while
turning). Verified on `/spinner.html`: one `area-spin` animation, 1s linear; with motion none the
arc's `animation-name` is `none` and `rotate` is `none`. Reduced motion checked from the served
stylesheet rule only (the pane cannot emulate the preference).

**Open question (owner).** Stop or slow under the OS reduced-motion preference? The contract says
stop; this spec slowed it to 1.8s from 2026-09-27 (Fluent 1.8s; Carbon and Primer keep turning) because a
still arc can read as a frozen screen. Recommendation: keep the stop for now (one rule for every
loop, and the spinner's live region names the state), and revisit only if a reduced-motion user
reports a still spinner as a hang. `motion="0"` stops it either way.

## Value, 2026-10-13

Owner, review round 24, on a separate Progress circle family: "is this not the same as spinner?" It was: the same
ring, sizes, line, ink and track with the arc stopped at a value. It is now Spinner's `value`, not a family of its
own; the evidence below came from that family's research
([design systems](../research/compass-components-2026-10-13/progress-circle.md),
[Cursor's rings](../research/compass-components-2026-10-13/cursor-rings.md)).

| property | Cursor context ring | Cursor review ring | Spectrum 2 S | Geist 20 | Area |
|---|---|---|---|---|---|
| size | 15 | 14 | 16 | 20 | Spinner's 12 / 16 / 24 |
| line | 2 | 2 (track 1.5) | 2 | 3 | Spinner's, 1/8 of the size |
| track | `stroke-tertiary` | ink 25% | gray-300 | separate arc | Spinner's: the ink at 25% |
| arc ink | `icon-secondary` | currentColor | blue-900 | by value | Spinner's: Selection; a Button's ink inside one |
| cap / start | round, 12 o'clock clockwise | same | same | same | same |
| value change | — | 0.2s ease | none | 1s ease | `duration-slow`, linear (MOTION.md progress) |

- `value` / `max` stop the arc (`[data-determinate]`); the arc is drawn as SVG (`__track`, `__arc`, `pathLength`
  100) because its length changes, and the dash is shortened by the round cap so the drawn arc equals the value
  (Ant's correction). 0 draws the track alone. A value change moves the arc linearly over `duration-slow` (MOTION.md's
  progress easing; round 25), so updates that arrive one after another join into one motion.
- `role` is progressbar (a task) or meter (a quantity used, ARIA 1.2), with `aria-valuenow` clamped, `label` as its
  name and `valueText` for the announced value. Without a value Spinner is unchanged (hidden, or a status).
- In a Button it sits in the `icon` slot and takes the label's ink, as the turning spinner does (Cursor's "Reviewing").
- Not adopted: a label inside the ring (none of the references shows one at 12-24), gauge gaps, colour by value.

## Review note, 2026-10-13 (round 26)

- **What changed:** with a value, the ring now moves at an even pace from one value to the next instead of darting and
  stopping, and the "in a button" example advances steadily like a real upload.
- **Why:** you asked for smoother motion. Each update used to ease out sharply, so a stream of updates looked like a
  row of jolts; MOTION.md gives progress a linear motion. The turning spinner was measured and is already drawn
  entirely by the compositor (no repaints while it turns), so it is unchanged.

## Feedback log

- 2026-09-26 · cohesion audit → the spinner stops under the motion axis (it kept turning with
  `motion="0"`) → display.css:271.
- 2026-09-26 · cohesion audit, spec pass → a spinner in a Button takes the label's ink and a
  25% track (it vanished on a neutral solid button) → display.css:211, `area--button`.
- 2026-09-26 · second pass (Notion, Figma; owner: decide all open items) → evidence
  searched, none found (no loading state in any capture); no change → —.
- 2026-09-27 · owner: audit against other design systems → [survey](../research/skeleton-spinner-code-slider-survey.md):
  1s a turn (was 2s, the slowest of 14 systems; Untitled, Primer, shadcn, Spectrum 1s); the
  track is the arc's ink at 25% everywhere (Primer; was a fixed `bg-component-active` outside
  Buttons); reduced motion slows to 1.8s instead of stopping (Fluent; `motion="0"` still
  stops). Open for the owner: a default "Loading" name (shadcn, Primer, Carbon), a show delay
  (Primer 300 / 1000ms), a 32px page-level size. Claude in Chrome: products show spinners only
  while loading; not captured.
- 2026-09-28 · batch 6 Claude in Chrome (ChatGPT spinners) → no change; 1s kept (owner) over ChatGPT's 2s.
- 2026-09-28 · owner: "slightly pixelated … cant really tell that its pill shaped inside, should it be slightly wider track?" → ring and arc redrawn as anti-aliased SVG masks with round caps; stroke 1/8 of the size (lg 2 → 3, md stays 2, sm 1.5); a 2.5px md option shown in the Pass review (`GalleryReviewSpinner`) for the owner to choose → headless Edge 2x/4x comparison; `area--*` recaptured; motion rules moved to the arc (`::before`), lab probe updated.
- 2026-09-28 · owner: approved (batch 6). The md stroke stays 2px (1/8); the 2.5px option was not taken.
- 2026-09-30 · audit S5 (owner) → no Spinner change; the Progress and Slider rail it is compared with is now `edge-control` #e2 (was ≈ #dd) → display.css:265.
- 2026-10-07 · owner: make interactions professional, intentional, subtle; components look pixelated → turn fixed at 1s with `--area-ease-linear` (was 4 × slow, 1.6s expressive); reduced motion stops it (was 1.8s); the motion-none stop now has its own rule (the `:is()` one dropped the pseudo-element) → display.css Spinner. See "Motion and interaction, 2026-10-07".
- 2026-10-13 · owner, review round 24 on Progress circle: "is this not the same as spinner?" (rethink) → the ring
  becomes Spinner's `value` (determinate state, `__track` / `__arc`, progressbar or meter); the Progress circle family,
  its CSS, manifest entry and component are removed → display.css Spinner, primitives.tsx `Spinner`; tiles "State /
  value …", "Content / meter", "Composition / value in a button".
- 2026-10-13 · owner, review round 25 (rethink): "can you make the motion more smooth?" → a trace in headless Edge of 12
  turning spinners for 2s: 0 paints, 1 commit (the turn runs on the compositor; unchanged). The value arc eased out over
  250ms per update (cubic-bezier(0.16, 1, 0.3, 1)), so updates every 600ms read as darts and stops → linear
  (`--area-ease-linear`, MOTION.md's progress easing); the in-button demo now advances 1% every 120ms and holds at 100
  before restarting → display.css Spinner, spinner-value.tsx. Open: Progress's bar still eases out.
- 2026-10-13 · owner, review round 26: approved (no notes).
- 2026-10-14 · owner: "merge it, then continue working" (the all-axis audit's open item) → the loop stops through the Motion axis's `duration-loop` token (1, or 0 at step 0 and under reduced motion): the turn is `calc(1s * duration-loop)`, so at 0 it rests on its drawing. The nearest motion scope now decides, so a non-zero scope nested in a 0 scope runs it; it was a `[data-area-motion="0"]` descendant rule plus a reduced-motion media rule (cohesion test pins it).

## Review note, 2026-10-22 (round 69)

- **What changed:** Selection now defaults to the accent, so this family's checked, on, selected, current and filled
  parts are the accent blue instead of near-black (#282828). Nothing else changed. A theme set to Selection Neutral
  looks exactly as before; the "Selection / neutral" tile shows it.
- **Why:** your pick of option B: one setting colours everything selected, so a selected card's edge and the mark
  inside it always match (docs/research/selection-colour-2026-10-22). With an accent chosen, most of the system was
  blue already; buttons follow Action, which stays neutral.
