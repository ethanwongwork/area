# Avatar spec

**Status:** in review · 2026-09-26 (cohesion audit)
**Captures:** `docs/research/captures/avatar/` (Area and `figma--avatar-initial`), `docs/research/captures/baseline/chatgpt--avatar-initials--rest--light.json`, `…/chatgpt--account-row--rest--light.json`
**Peers:** Indicator and IndicatorAnchor (status and count on an avatar), Chip and Badge
avatars (initials at 12px), Nav and Tree view markers (neutral selection), Button (focus ring)

## Owner decisions

- 2026-09-26: Neutral by default, accent by override. The active ring is `neutral-solid`;
  an avatar with `tone="accent"` keeps an accent ring.

No Avatar section existed in [prior decisions](PRIOR_DECISIONS.md). Its "Other references
reviewed, 2026-09-24" note records that Geist Avatar was reviewed for adjacent sizing and
gave no CSS measurements.

## Job and boundaries

Avatar represents a person or entity with an image, initials or a generic icon, and can
mark the current or active participant with a ring. Presence and counts belong to
Indicator, positioned by IndicatorAnchor. AvatarGroup stacks avatars and summarises the
remainder as one more Avatar.

## Variants

| Axis | Value | Justification | Where it appears |
|---|---|---|---|
| size | sm 28, md 32 (default), lg 40 | Control tiers, so an avatar sits in a row of controls | Untitled 24–64; ChatGPT 20 and 24; Figma 24 |
| shape | circle (default), square | Square for workspaces and bots | Untitled, ChatGPT and Figma circle |
| tone | neutral (default), accent, inverse | Fallback ground; neutral by default | Untitled neutral only; Figma a per-user hue |
| active | boolean | Current or speaking participant | Area's own; no product capture |
| content | image, initials, icon | Fallback chain image → icon → initials | Untitled image and initials |
| composition | group, availability, notification | AvatarGroup; Indicator | Gallery tiles |

## Sources

| Id | Type | What | Link / commit / path | License | Captures |
|---|---|---|---|---|---|
| chatgpt | target product | Profile-menu account avatar (image, 20px); account row avatar (image, 24px) | chatgpt.com, logged in, 2026-09-26 | evidence only | `baseline/chatgpt--avatar-initials--rest--light`, `baseline/chatgpt--account-row--rest--light` |
| figma | target product | Initials avatar, 24px | figma.com, logged in, second pass 2026-09-26 | evidence only | `figma--avatar-initial--rest--light` |
| uui | design system (source) | Avatar sizes, initials, fill, hairline | `components/base/avatar/avatar.tsx:72-153` at `4702dc0` ([reference](../research/untitled-ui-reference.md)) | MIT | — |
| area | this system | 15 gallery tiles after the audit | localhost gallery | — | `area--*` (15) |

`chatgpt--avatar-initials` is an image avatar despite its file name: an `img` (rounded-full)
in a 20 × 20 span, the image box 20 × 24. ChatGPT showed no initials avatar; Figma's is the
only product initials avatar measured. Notion: no avatar in the second-pass captures
(sidebar, page menu, Share popover, "tasks" board, "returns" table); its Share popover
lists people, but no avatar node was captured.

## Anatomy

```
chatgpt  span 20×20 > img rounded-full, object-cover (no fill, no ring)
figma    span 24×24 flex, radius 100%, fill rgb(102, 119, 153), initials 12/24 400 white, no ring
uui      div size-*, rounded-full, neutral-100 fill, 0.5px black-16% hairline; initials 600
area     div.area-avatar  owns size, radius, fill, ink, rings (box-shadow)
  image  img.area-avatar__image 100%, object-fit cover
  icon   span.area-avatar__icon 16 / 20 / 24 square viewport (display.css:38-44, 74-80)
  text   span (initials), cap-trimmed (inset.css:155)
```

Rings are two stacked box-shadows on the shell (`display.css:25`): the group ring (1px
surface) and the active ring (2px surface gap, then 2px ring), so neither changes layout.

## Measurements

`node scripts/capture-compare.mjs` (trimmed):

| slot · property | area · default | area · size-small | area · size-large | area · state-active | area · tone-accent | area · shape-square | figma · avatar-initial | chatgpt · avatar-initials |
|---|---|---|---|---|---|---|---|---|
| **shell** size | 32 × 32 | 28 × 28 | 40 × 40 | 32 × 32 | 32 × 32 | 32 × 32 | 24 × 24 | 20 × 20 |
| **shell** radius | 9999px | 9999px | 9999px | 9999px | 9999px | 8px | 100% | 0px |
| **shell** font | 12px/24px 500 Geist | 12px/24px 500 Geist | 14px/24px 500 Geist | 12px/24px 500 Geist | 12px/24px 500 Geist | 12px/24px 500 Geist | 12px/24px 400 Inter |  |
| **shell** color | rgb(102, 102, 102) | rgb(102, 102, 102) | rgb(102, 102, 102) | rgb(102, 102, 102) | rgb(255, 255, 255) | rgb(102, 102, 102) | rgb(255, 255, 255) |  |
| **shell** background | rgb(238, 238, 238) | rgb(238, 238, 238) | rgb(238, 238, 238) | rgb(238, 238, 238) | rgb(92, 93, 254) | rgb(238, 238, 238) | rgb(102, 119, 153) |  |
| **shell** shadow |  |  |  | rgb(255, 255, 255) 0px 0px 0px 2px, rgb(40, 40, 40) 0px 0px 0px 4px |  |  |  |  |

Nodes: the ChatGPT span's `img` has radius 9999px (the round shape is on the image). Area
icon content: 20px viewport at md, ink 14 × 16 (`area--content-icon`). Group: items step
24px (32 − 8 overlap), each with `0 0 0 1px` white (`area--composition-group`).

## Decisions

| Slot · property | Area value | Basis | Reason when it differs from the basis |
|---|---|---|---|
| shell · size | `control-sm/md/lg` 28 / 32 / 40 (`display.css:74-80`) | Peer: control tiers | Untitled 24–64; ChatGPT 20 / 24; Figma 24. Area's sm is larger than every product; kept for compact density (third pass) |
| shell · radius | `radius-full`; square `radius-control` 8 (`display.css:22, 49`) | ChatGPT, Figma and Untitled round | — |
| fill · neutral | `bg-component-active` #eeeeee (dark #3f3f3f) | Untitled neutral-100 #f5f5f5 | One step darker, so the disc reads on `bg-component` rows. Figma paints a per-user hue, rgb(102, 119, 153); neutral kept (third pass) |
| initials · ink | `fg-muted` #666666 | Untitled neutral-500 #737373 | Area's muted role; Figma white on its hue |
| initials · size / weight | 12 at sm and md, 14 at lg; 500 (`display.css:26-27, 79`) | Type ramp (500 for labels on fills, DESIGN_SYSTEM "Color and focus") | Untitled 12 / 14 / 16 at 600; Figma 12 at 400; one label weight (third pass) |
| icon · size | 16 / 20 / 24 at sm / md / lg | Native Fluent cuts at their size | — |
| edge | none | ChatGPT and Figma (none) | Untitled draws a 0.5px black-16% hairline |
| active ring | **2px `bg-surface` gap + 2px `neutral-solid`** #282828 (dark #f3f3f3) (`display.css:67-71`) | Owner (2026-09-26) | Was `accent-solid` #5c5dfe on every avatar |
| active ring · accent tone | `accent-solid` via `--_ring` (`display.css:72`) | Owner: accent by override | — |
| group · overlap / ring | −8px, 1px `bg-surface` (`display.css:94-102`) | Area's own | Not in Untitled's recorded source |

Settled in the third pass ([cohesion audit](../research/cohesion-audit.md#third-pass-the-questions-the-evidence-left-open)); all kept:

1. Smallest size stays 28. Every product avatar measured is 20–24 (ChatGPT 20 and 24,
   Figma 24); 20–24 belongs to the planned compact density.
2. Fallback ground stays neutral. Figma gives each person a hue with white initials
   (`figma--avatar-initial`); Area is neutral by default, and `tone="accent"` is its hued
   fallback.
3. Initials weight stays 500 (Figma 400, Untitled 600): one label weight.

## States

| State | Slot · property changes | Evidence |
|---|---|---|
| rest | as above | `area--default` |
| active | 2px surface gap + 2px neutral ring | `area--state-active` |
| image failed | falls back to icon or initials | `area--behavior-image-fallback`; `primitives.tsx:64-71` |

Avatar is not interactive: no hover, focus or disabled paint.

## Behavior and accessibility

The wrapper gets `role="img"` and the `aria-label` (or `alt`) when it has no image; with an
image, the `img` keeps its native `alt` (`avatar.test.mjs:7, 14`). Initials and icons are
`aria-hidden`. AvatarGroup is `role="group"`; its overflow Avatar is named by
`overflowLabel` ("N more avatars"). A cached image failure is detected after hydration.

## Peers and consistency

| Peer | Shared role | Peer value | Avatar | Match |
|---|---|---|---|---|
| Nav marker, Tree view rail, Code block linked line | current / selection marker | neutral ink | `neutral-solid` ring | match |
| Chip avatar | initials size | 12px (audit) | 12px at md | match |
| Focus ring | ring geometry | 2px `focus-color`, 2px offset | 2px ring, 2px gap, `neutral-solid` | same geometry, told apart by colour |
| Indicator | status on avatar | inside the owner's box (`overlap="circular"`) | anchor, no own slot | match |
| Badge | label on a fill | 500 | 500 | match |

## Visual pass

The gallery shows Avatar in grouped tiles: Default, Tones (accent, inverse), Sizes (small,
medium, large), Layout (square), Content (icon, image, two initials, availability,
notification, group), States (active) and Behavior (image fallback). This spec's author
did not inspect screenshots. Unverified: dark theme, an active ring next to a focused
avatar-bearing control, a side-by-side with Figma's initials avatar.

## Verification

- 15 Area captures (re-taken after the second pass), 1 Figma and 2 ChatGPT captures compared above.
- `cohesion.test.mjs` fails if an Avatar marker paints in accent outside `--accent`
  selectors. Build and test results: see [the audit](../research/cohesion-audit.md#verification).

## Feedback log

- 2026-09-26 · cohesion audit → active ring `neutral-solid`, accent avatars keep an accent
  ring → `area--state-active--rest--light`.
- 2026-09-26 · second pass (Notion, Figma; owner: decide all open items) → evidence added,
  no change; three open questions recorded (smallest size, per-person hue, initials weight)
  → `figma--avatar-initial`.
- 2026-09-27 · third pass → open questions settled, values kept (28px smallest, neutral
  fallback, initials 500) → [cohesion audit](../research/cohesion-audit.md#third-pass-the-questions-the-evidence-left-open).
- 2026-09-27 · owner: the notification count sits too far in → a count on a circular owner
  centres on the circle's edge at 45° (1.3 further out on a 32px avatar); `indicator.css`.
