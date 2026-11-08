# Skeleton spec

**Captures:** `docs/research/captures/skeleton/`
**Peers:** Spinner and Progress (loading motion), Card (composition), Avatar (circle
placeholder), Typography (text-line heights)

## Owner decisions

- 2026-09-28: rethink Skeleton from the research ([survey](../research/skeleton-rethink-survey.md)),
  ignoring earlier ideas. Chose **option A**: one `Skeleton`, `shape` = `block` (default) |
  `text` | `circle`; `rounded` and `rectangle` removed. Control placeholders are **omitted** from
  compositions (Primer, MUI, Carbon).

- Before 2026-09-24 (moved from [prior decisions](PRIOR_DECISIONS.md)): Skeleton cards have
  two text lines; type samples share the trailing half of the tile.

The second pass (owner: decide every open item) changed nothing in Skeleton; its Card
composition inherits Card's new container radius.

## Job and boundaries

Skeleton stands in for content whose layout is known but whose data has not arrived. It is
decorative (`aria-hidden`); the loading state is announced by the region that hosts it. An
action in progress is Spinner; task progress is Progress.

## Variants

| Axis | Value | Justification | Where it appears |
|---|---|---|---|
| shape | **block** (default) | A box the host sizes: media, icons, bars. 100% × 16 until sized | Default in Primer SkeletonBox, Fluent (rectangle 100% × 16), Radix, Mantine, Chakra |
| shape | text | A line of type: glyph height in the host's line box | Primer SkeletonText, MUI `text`, Carbon, Chakra SkeletonText |
| shape | circle | An avatar or icon disc, 1:1, 32 until sized | Every system (Fluent circle, Mantine `circle`, MUI circular, Primer avatar) |
| static | boolean (`animated={false}`) | A still placeholder for dense lists | Notion; antd, Polaris, Atlassian are still by default |
| lines | number | A paragraph; implies text; last line 65% (min 50px) | Primer `lines`; Chakra `noOfLines`; antd rows; Polaris `lines` |
| wrap (children + `loading`) | behaviour | Painted on the real element, which keeps its size, place and corner | Radix, Spectrum (child radius), MUI, Chakra, Mantine, Geist |
| composition | list, media object, card, type heights | Notion sidebar, ChatGPT history; Primer comments, MUI media; the card with controls omitted | `area--list`, `area--media-object`, `area--card`, `area--type-height` |
| behaviour | `delay`: `"short"` 300 ms, `"long"` (or `true`) 1000 ms, or milliseconds | A quick load shows nothing (WRITING.md's loading ladder) | Primer SkeletonBox `delay` (`src/Skeleton/SkeletonBox.tsx:15`); tile `behavior-delay` |

Removed: `rounded` (a shape only in MUI, where it is the block at 4px; everywhere else a corner
comes from a radius prop or the wrapped element) and `rectangle` (renamed `block`, the default).
Not added: separate SkeletonText / SkeletonAvatar parts (option B), wrap-first as the only mode
(option C), pulse, page-wide phase sync. Show-delay was added on 2026-11-07 (`delay`, components audit V6).

## Sources

| Id | Type | What | Link / commit / path | License | Captures |
|---|---|---|---|---|---|
| uui | design system | — | Not present in Untitled UI ([reference](../research/untitled-ui-reference.md), "Not present") | MIT | — |
| area | this system | 6 gallery tiles (re-captured after the second pass) | localhost gallery | — | `area--*` (6) |

Target products searched without an equivalent: ChatGPT (sidebar, menus, settings card);
Notion (page menu, Share popover, tasks board, returns table view); Figma (file browser
with file cards, editor inspector, layers, main menu). Every capture was taken on a loaded
page, so no placeholder was on screen; a product skeleton needs a capture during a load.

## Anatomy

```
area  div.area-skeleton[aria-hidden]  fill 10% grey (dark bg-component); a travelling band
      (200% × 100% gradient, area-shimmer 3s linear); corner min(radius-small, 4)
  block      100% × 16 until the host sizes it (default)
  text       1em tall, centred in the host's line box
  circle     radius-full, 1:1
  (display.css:140-190; was text / circle / rectangle / rounded, 1.4s ease-in-out)
```

Width and height come from the consumer (inline style), except text, whose height is `1em`.

## Measurements

Read from the shell nodes of `area--text`, `area--circle`, `area--rectangle`,
`area--rounded`, `area--type-height`, `area--card`:

| Tile | Size | Radius | Fill | Animation |
|---|---|---|---|---|
| text | 260 × 14 | 6 | rgb(247) | `area-shimmer` |
| circle | 40 × 40 | 9999 | rgb(247) | same |
| rectangle | 260 × 146.25 | 0 | rgb(247) | same |
| rounded | 260 × 146.25 | 12 | rgb(247) | same |
| type-height | 283 × 56 (56px font) | 6 | rgb(247) | same |
| card (media) | 284 × 96 | 0, clipped by the media slot | rgb(247) | same |

Highlight: `linear-gradient(90deg, transparent, rgb(238), transparent)` travelling across
the fill (display.css:145-158). The card tile's circle, lines and rounded block are set by
the demo (gallery.tsx:837-849): a 40px circle, lines at the md and ui font sizes 8px apart,
an 80 × 32 rounded block.

## Decisions

| Slot · property | Area value | Basis | Reason when it differs from the basis |
|---|---|---|---|
| model | one component, `shape` block / text / circle, block default | Owner option A; block default in 5 systems, text in 2, none in 3 (survey) | Text was the default |
| fill | `light-dark(rgb(143 143 143 / 0.1), bg-component)` /* spec */ | ChatGPT (`chatgpt--skeleton-*`); Notion #f1 | Was #f7, a step lighter than every product |
| band | `light-dark(rgb(143 143 143 / 0.16), bg-component-active)`, travelling, 3s linear | ChatGPT, Figma | Travel reads as loading |
| corner | `min(radius-small, 4px)` for block and text | Primer 3, Radix 3, Fluent 4, MUI 4, Mantine 4, Chakra 4, antd 4, Polaris 4, Atlassian 4 | — |
| block size | 100% × 16 until the host sizes it | Primer 1rem, Fluent 100% × 16 | — |
| text height | `1em` centred in the line box (`margin-block: (1lh − 1em) / 2`) | Primer SkeletonText | — |
| circle size | `control-md` 32, `aspect-ratio: 1` | Avatar md; Mantine and Fluent take one dimension | — |
| paragraph | text lines in a column (both half-leadings kept); last 65%, min 50px | Primer SkeletonText | — |
| wrap | the wrapper takes no box (`display: contents`); the child is painted and its contents hidden, in the `area.utilities` layer | Radix and Spectrum keep the child's radius | Was a wrapper box with a `:has()` list of control radii |
| controls in compositions | omitted | Primer, MUI, Carbon ("actions need no skeleton"); Spectrum disables the real one | The card tile drew a button plate on the card's 8px control inset, 10px outside the text's 18px inset |
| motion | shimmer and band removed under `data-area-motion="0"` and reduced motion, wrap included | Audit rule "motion setting" | — |

## States

| State | Changes | Evidence |
|---|---|---|
| animating | `area-shimmer`, 3s linear (display.css:162) | all tiles (`animation-name`) |
| motion none / reduced | no animation, no gradient: a flat `bg-component` block | display.css:271-272; not tiled |
| waiting (`data-waiting`) | a delay that hasn't passed: `opacity: 0` on the placeholder (block, lines or a wrapped element), its box kept, so nothing moves when it shows; it shows at once | V6; tile `behavior-delay` |

## Behavior and accessibility

`aria-hidden="true"` on every Skeleton (primitives.tsx:266-273). The host marks the region
busy or labels it (`area--card`: `aria-label="Loading card"`).

## Peers and consistency

| Peer | Shared role | Area value in peer | Skeleton | Match / reason |
|---|---|---|---|---|
| Spinner, Progress | motion axis | stop under `motion="0"` | same | match (audit) |
| Card | media radius | card radius 12 − padding 7 − border 1 = 4 (surface.css:17, 22, 98; arithmetic) | clipped by the media slot | match. Was 16 when Card was 24px |
| Card | media block | Card's own corner | `block` at 4, clipped by the host | the `rounded` shape was removed (owner option A, 2026-09-28) |
| Avatar | circle | `radius-full` | same | match |

## Visual pass

2026-09-28, Claude in Chrome (batch 6). Loading states were caught as they appeared (a
MutationObserver installed with the capture script, then read-only page switches):

| | ChatGPT (sidebar results) | Figma (file browser tabs) | Notion (startup sidebar) | Area before | Area now |
|---|---|---|---|---|---|
| bar | 16 tall, radius 6 | 32 tall | text 10 tall, pill; icon 20-22, radius 4 | 1em (14), radius 4 | unchanged |
| fill | rgb(143 143 143 / 0.1), about #f4 on white | rgba(255, 255, 255, 0.1) over its plate | rgba(227, 226, 224, 0.5), about #f1, flat | `bg-component` #f7 | **ChatGPT's 10%** |
| band | 16% (#ee) | — | none (a fade-in on the group) | `bg-component-active` #ee | **16%** |
| motion | 3s linear | 3s linear | none | 1.4s ease-in-out | **3s linear** |

Captures: `chatgpt--skeleton-*`, `figma--skeleton-tab`, `notion--skeleton-{text,icon,group}`
(redacted). The products' resting placeholder is a step darker than Area's was, and the two that
shimmer agree on 3s linear, so Area takes ChatGPT's paint (translucent, so it reads on a card
too) and its speed. Line height and the 4px corner cap stay (owner, 2026-09-27). Dark keeps the
component roles (not measured). Recaptured: `area--*`.

Earlier note:

The gallery groups the tiles (Default, Variants for the
shapes, Content for type heights and the card); the shapes moved from Layout to Variants in
the third pass. Nothing in Notion or Figma to compare.
Unverified: dark theme, the card tile's media corners at the new Card radius on screen.

## Verification

6 Area captures after the second pass read. Build and test results are in the
[cohesion audit](../research/cohesion-audit.md#verification).

## Motion and interaction, 2026-10-07

Contract: `docs/MOTION.md`. Research: `docs/research/motion-2026-10-07/crispness-and-current-state.md`.


| Interaction | Before | After |
|---|---|---|
| Shimmer | `background-position`, `slow × 12` (3s), `linear` keyword | same, `--area-ease-linear` (MOTION.md: shimmer linear and long) |
| Reduced motion, motion none | no animation, no band | unchanged; the reduced-motion and motion-none rules now share one selector with Spinner and Progress |

Stopped, the placeholder is flat: no band caught mid-sweep. Crispness: nothing at rest moves; text
lines are whole-pixel (`(1lh − 1em) / 2` = 3 at 14/20, 4 at 16/24). Verified on `/skeleton.html`:
8 `area-shimmer` animations at 3s linear, 0 with motion none and `background-image: none`.
Open questions: none.

## Feedback log

- 2026-09-26 · cohesion audit → the shimmer stops under the motion axis →
  display.css:271-272.
- 2026-09-26 · second pass (Notion, Figma; owner: decide all open items) → evidence
  searched, none found; no change to Skeleton; the card composition follows Card's new
  12px radius (media corners 16 → 4) → `area--card`, `area--rounded`.
- 2026-09-27 · third pass → shape tiles moved from Layout to Variants → [cohesion audit](../research/cohesion-audit.md#third-pass-the-questions-the-evidence-left-open).
- 2026-09-27 · owner: audit against other design systems → [survey](../research/skeleton-spinner-code-slider-survey.md):
  text lines reserve their line box (1em bar, half the leading above and below; Primer, MUI),
  so a skeleton paragraph matches the paragraph's height; line corners capped at 4 (seven
  systems at 3-4). Kept: the travelling sweep (Fluent, Primer, Carbon, antd, Spectrum), 1.4s
  (antd), the light #f7 fill (lightest of all; owner's lighter-UI direction). Open: page-wide
  phase sync (Spectrum), a shortened last line and show delay (Primer). Claude in Chrome:
  products show skeletons only while loading; not captured.
- 2026-09-28 · batch 6 Claude in Chrome → fill and band from ChatGPT (10% / 16% grey), shimmer 3s linear (ChatGPT and Figma; was 1.4s ease-in-out) → `chatgpt--skeleton-*`, `figma--skeleton-tab`, `notion--skeleton-*`.
- 2026-09-28 · owner: "fix the variants in skeleton, go through all of them and add any if necessary" → rectangle takes the 4px corner (was square); added `animated={false}` (static), `lines` (paragraph), wrap mode (children + `loading`); list tile; the Card tile's button placeholder now wraps a real Button (was the 12px container corner on a 32px control) → survey (`research/skeleton-spinner-code-slider-survey.md` §1), batch 6 captures, `area--*` recaptured, `skeleton.test.mjs`.
- 2026-09-28 · owner: "not sure if this card composition is accurate, the button is too close to the edge. shouldnt rectangle and rounded be variants? is text really considered default? … rethink the entire skeleton component" → survey of 14 systems (`research/skeleton-rethink-survey.md`) and an options sheet (A / B / C, card compositions) → owner chose A and omitted controls → shapes block (default) / text / circle, `rounded` and `rectangle` removed, wrap painted on the child, card tile without a control, new media-object tile → `area--*` recaptured (retired tiles' captures removed), tests updated.
- 2026-09-28 · owner: approved (batch 6).
- 2026-10-03 · roundness → the 4px block corner moves with the roundness shift (2 to 6), within the small role (`display.css`). `docs/research/radius-audit-2026-10-03.md`, "Roundness".
- 2026-10-03 · one corner setting (owner: one radius setting, Sharp and Pill as ends; "every control is a pill") → a 16px box's corner, 4 at the default, scaling with the setting (`display.css`). `docs/research/radius-audit-2026-10-03.md`, "One corner setting".
- 2026-10-07 · owner: make interactions professional, intentional, subtle; components look pixelated → shimmer easing on `--area-ease-linear`; stop rules unchanged (verified 8 → 0 animations under motion none) → display.css Skeleton.
- 2026-10-14 · owner: Motion is one number, default 210 → the shimmer runs a fixed 3s, ChatGPT's and Figma's (was `slow × 12`, which would have become 4.2s); stop rules unchanged → display.css Skeleton. docs/MOTION.md.
- 2026-10-14 · owner: "merge it, then continue working" (the all-axis audit's open item) → the loop stops through the Motion axis's `duration-loop` token (1, or 0 at step 0 and under reduced motion): the shimmer's period is `calc(3s * duration-loop)` and the band fades with it, so at 0 the skeleton is flat (the wrap variant too). The nearest motion scope now decides, so a non-zero scope nested in a 0 scope runs it; it was a `[data-area-motion="0"]` descendant rule plus a reduced-motion media rule (cohesion test pins it).

### 2026-11-07 · Delay (components audit V6)

- **What changed:** `delay` on every shape and on a wrapped element (Spinner's, through `useLoadingDelay`). While it
  waits the placeholder keeps its box, invisible: Primer renders nothing, which would move the layout when it appears.
  Server and first client render both render it waiting.
- **Why:** docs/research/components-audit-2026-11-07/primer.md. The owner took every recommendation ("Take all recs", 2026-11-07).
- **Verdict:** awaiting the owner.
