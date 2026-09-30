# Spinner spec

**Status:** accepted · 2026-09-28 (owner, batch 6)
**Captures:** `docs/research/captures/spinner/`
**Peers:** Progress (known or unknown duration on a rail), Skeleton (content placeholder),
Button, Input, Badge and Switch (host a Spinner when loading)

## Owner decisions

- 2026-09-26: **Neutral by default, accent by override** (DESIGN_SYSTEM.md, "Color and
  focus"). Spinner already followed it: the arc is `neutral-solid`; `tone="accent"` opts in.

No Spinner section existed in prior decisions. The second pass (owner: decide every open
item) changed nothing here.

## Job and boundaries

Spinner says an action is in progress with no known duration, in a small space (a button,
an input, a badge, a switch row, an empty region). A long task with a known end is Progress;
a placeholder for arriving content is Skeleton.

## Variants

| Axis | Value | Justification | Where it appears |
|---|---|---|---|
| size | sm 12, md 16 (default), lg 24 | Matches the icon slot it replaces | Untitled 32–64 standalone, 20 in buttons |
| tone | neutral (default), accent | Owner rule | Untitled brand arc |
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
area  span.area-spinner  --_size square, radius-full, conic arc (25%) over a --_track,
                         masked to a --_stroke ring; rotates 360° in 2s linear
  ::after  2px dots at the arc's two ends (box-shadow copy), so the arc has round caps
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
| stroke | **1/8 of the size: 1.5 / 2 / 3** (one 16-unit SVG mask, stroke 2) | Primer 16 / 2, Untitled 4 on 32 | Was 2px at every size, thin at lg. A 2.5px md option is in the Pass review, not applied |
| construction | **SVG masks for ring and arc; round caps** | ChatGPT draws its spinner as SVG | Owner 2026-09-28: the conic gradient and hard-edged radial mask looked pixelated, and 2px cap dots did not read as round |
| arc | 25% | Untitled ~28% (indicator), ~25% (button) | — |
| arc ink | `neutral-solid`; accent by tone | Owner | Untitled brand |
| in a Button | **arc `currentColor`, track `currentColor` at 25%** (display.css:211) | The host's label ink, so it shows on any fill (audit spec pass) | Was `neutral-solid` on a `neutral-solid` button: only the light track showed |
| track | the arc's ink at 25% (≈ #c9 on white; display.css:226-229) | Primer; ChatGPT 30% (2026-09-27 audit) | Darker than the rail (`edge-control` #e2); audit E-22 left open. Was `bg-component-active` #eee |
| speed | 2s per turn, linear (display.css:194) | — | Untitled 1s |
| motion | stops under `data-area-motion="none"` and reduced motion (display.css:271, 274-281) | Audit rule "motion setting" | Before the audit only reduced motion stopped it |

## States

| State | Changes | Evidence |
|---|---|---|
| running | rotates | all tiles (`animation-name: area-spin`) |
| motion none / reduced | `animation: none`; the arc stays visible and still | display.css:271; not tiled |

## Behavior and accessibility

With `label`, the Spinner is `role="status"` with `aria-label`; without it, it is
`aria-hidden` and the host announces (primitives.tsx:282-296): Button sets `aria-busy`
(Button.tsx:69-84), Input names it with `loadingText` (Input.tsx:125, 144), Switch sets
`aria-busy` on its input. No forced-colors rule (unverified).

## Peers and consistency

| Peer | Shared role | Area value in peer | Spinner | Match / reason |
|---|---|---|---|---|
| Progress, Skeleton | motion axis | stop under `motion="none"` | same | match (audit) |
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

## Feedback log

- 2026-09-26 · cohesion audit → the spinner stops under the motion axis (it kept turning with
  `motion="none"`) → display.css:271.
- 2026-09-26 · cohesion audit, spec pass → a spinner in a Button takes the label's ink and a
  25% track (it vanished on a neutral solid button) → display.css:211, `area--button`.
- 2026-09-26 · second pass (Notion, Figma; owner: decide all open items) → evidence
  searched, none found (no loading state in any capture); no change → —.
- 2026-09-27 · owner: audit against other design systems → [survey](../research/skeleton-spinner-code-slider-survey.md):
  1s a turn (was 2s, the slowest of 14 systems; Untitled, Primer, shadcn, Spectrum 1s); the
  track is the arc's ink at 25% everywhere (Primer; was a fixed `bg-component-active` outside
  Buttons); reduced motion slows to 1.8s instead of stopping (Fluent; `motion="none"` still
  stops). Open for the owner: a default "Loading" name (shadcn, Primer, Carbon), a show delay
  (Primer 300 / 1000ms), a 32px page-level size. Claude in Chrome: products show spinners only
  while loading; not captured.
- 2026-09-28 · batch 6 Claude in Chrome (ChatGPT spinners) → no change; 1s kept (owner) over ChatGPT's 2s.
- 2026-09-28 · owner: "slightly pixelated … cant really tell that its pill shaped inside, should it be slightly wider track?" → ring and arc redrawn as anti-aliased SVG masks with round caps; stroke 1/8 of the size (lg 2 → 3, md stays 2, sm 1.5); a 2.5px md option shown in the Pass review (`GalleryReviewSpinner`) for the owner to choose → headless Edge 2x/4x comparison; `area--*` recaptured; motion rules moved to the arc (`::before`), lab probe updated.
- 2026-09-28 · owner: approved (batch 6). The md stroke stays 2px (1/8); the 2.5px option was not taken.
- 2026-09-30 · audit S5 (owner) → no Spinner change; the Progress and Slider rail it is compared with is now `edge-control` #e2 (was ≈ #dd) → display.css:265.
