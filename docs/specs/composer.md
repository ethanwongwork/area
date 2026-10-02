# Composer spec

**Status:** accepted · 2026-09-26 (was: in review · 2026-09-25 (first pass under the capture workflow))
**Captures:** `docs/research/captures/composer/`
**Peers:** Input and Textarea (field text and placeholder), Button (actions), Toolbar

## Owner decisions

- Before 2026-09-24 (moved from [prior decisions](PRIOR_DECISIONS.md)): Composer uses a
  native textarea (native selection, IME, Shift+Enter). Inline and stacked layouts share
  action slots and the submission contract: Enter sends, Shift+Enter adds a line,
  Ctrl/Command+Enter sends when Enter submission is off; send is unavailable for empty
  text. The textarea grows to five control rows. Attachments, form submission and model
  selection belong to the application.
- 2026-09-25: Composer is the next component after Tree view; the owner reviews later.
- 2026-09-26: radius. Owner asked whether the composer should match ChatGPT's round send button
  or the button should use the normal radius; chose the recommendation (option B): the send
  action is an Area Button (solid neutral, icon-only, md, 8 radius) and the composer's corner is
  concentric with it (button radius + 8 inset × `radius-concentric` = 16; 0 at Sharp since audit S3), computed so a pill send button (`submitPill`)
  gives a pill composer. The resting 0 2px 8px shadow is dropped (no control has a shadow at rest).
- 2026-09-26: accepted. Owner: "consider every component that you have built to be approved. if i havent given any feedback to change anything consider them approved."

## Job and boundaries

Composer is where someone writes a message or prompt and sends it, with leading and
trailing actions. It is not a general form Textarea (no label chrome, a send action) and
not a search field.

## Sources

| Id | Type | What | Link / commit / path | License | Captures |
|---|---|---|---|---|---|
| chatgpt | target product (primary for conversation) | Home composer, empty | chatgpt.com, logged in (Edge), 2026-09-26; nothing typed | evidence only | `chatgpt--inline-empty--rest--light` |
| area | this system | Four gallery tiles before and after | localhost gallery | — | `before/area--*` (4), `area--*` (4) |

The `before/` captures were taken while the pane was narrow; their heights show the
auto-grow bug fixed below (the inline composer measured 176px).

## Anatomy

```
chatgpt  body 768 × 52, radius 26, no border; shadow 0 0 0 1px 4%, 0 2px 8px 4%, 0 4px 80px 8px 2.4%
  footer grid, padding 8, column-gap 8: [36px action] [input] [actions]
  input  16px, 26px line, 13px from the top
  actions 36px round, ghost ink rgb(143); voice/send 36px round
area     shell, padding 8 (7 + 1 border), radius 16, Card's edge (#ee), no resting shadow
  entry  flex, gap 8: leading actions, textarea, trailing actions, 32px send Button (radius 8; `submitPill` makes it round)
  input  16/24, 4px block padding (32px row)
```

## Decisions

| Slot · property | Area value | Basis | Reason when it differs from the basis |
|---|---|---|---|
| input · type | **16/24** (`text-md`) | ChatGPT 16px (26 line); type ramp body 16/24 | Was 14/20. The row stays 48px: (32 − 24) / 2 = 4px padding |
| shell · edge | **1px Card's edge `light-dark(neutral-100, neutral-750)`** (rgb 238; composer.css:17-18) | Audit S7a (owner 2026-09-30): a surface standing alone on the page takes Card's edge; ChatGPT's 4% ring (about rgb 245) | Was `border-decorative` rgb 243, the faintest edge in the system, and before that the field edge (226) |
| shell · hover | edge `input-edge-hover` #d4, not while focused or disabled (composer.css:36) | Audit S7a: Input's hover step | — |
| shell · focus | edge and outline `composer-focus-color`, the quiet neutral (`border-subtle` at default contrast), plus the field halo (composer.css:37) | Audit S1 left Composer out of the blue field focus: a surface that holds a field | Input, Textarea and Select take the blue `field-focus-color` |
| shell · shadow | none at rest (focus keeps its halo) | owner 2026-09-26: no control has a resting shadow | ChatGPT floats on 0 2px 8px 4%; superseded |
| disabled | Textarea's field paint (`textarea-bg-disabled`, `border-faint`, `fg-disabled` text and placeholder), no opacity | Cohesion audit: text fields keep full opacity with field paint | Was `opacity: .6`, which compounded with the send Button's own 50% (about 30%) |
| loading | field keeps its paint, value and caret; Enter doesn't send; send becomes **Stop** (same solid neutral md Button, Area `stop` glyph filled, `stopLabel` "Stop") when `onStop` is given, otherwise send is disabled; `aria-busy` on the shell | Audit S18 / G-13 (owner 2026-09-30, option A): ChatGPT keeps typing open while a reply streams and turns send into Stop | Was `busy`: the textarea went native disabled (focus lost after each send, no drafting). `busy` stays as a deprecated alias. ChatGPT's Stop glyph size not captured (would need a streaming reply) |
| actions · gap | **8** | ChatGPT 8 | Was 4 |
| actions · size | 32 | Peer: Button md | ChatGPT 36; Area's control scale is 28 / 32 / 40 |
| shell · width | `min(100%, var(--area-composer-inline-size, 480))` (composer.css:13) | Public hook shared with Prompt suggestions (audit S17) | — |
| shell · height (inline) | 48 | 32px actions + 8px insets | ChatGPT 52 (36px actions) |
| shell · radius | 16 = send Button radius (8) + inset (8), concentric | owner 2026-09-26 (option B) | ChatGPT is a pill (26 on 52 = 18 + 8, also concentric with its round button); `submitPill` reproduces it |
| placeholder | `input-placeholder` (fg-muted 102) | Peer: Input (Complete) | ChatGPT rgb(143) |
| textarea · auto-grow | refits on text and on width changes | Bug fix | The height was only fitted on text changes. A composer that first laid out narrow (or sat in a resized panel) kept an inflated height: the gallery inline tile measured 176px empty |

## Behavior and accessibility

Unchanged keyboard and submission contract. The textarea is named through a visually hidden
label from `aria-label` (default "Message"; `label` is a deprecated alias); typing calls
`onValueChange(value, event)`. The ref goes to the textarea (the field pattern) and the other
native props to the shell. The auto-grow now also observes the
textarea's width (ResizeObserver, width-only, so fitting the height cannot loop).
Measured: at 134px wide the empty inline composer grows as its placeholder wraps; widened
to 480px it returns to 48px.

## Visual pass

Pass review container (`GalleryReviewComposer`): before and after at 1× and 3×. Measured
after: inline 480 × 48, stacked 480 × 116, border rgb(243), shadow 0 2px 8px, text 16/24
(the shadow was dropped 2026-09-26; see Decisions).

2026-09-28 (batch 19), live in Claude in Chrome: ChatGPT's empty home composer re-measured identical
to `chatgpt--inline-empty--rest` (768 × 52, corner 26, white, 4% ring + 0 2 8 4% + 0 4 80 8 2.4%,
16/26 text), so no new file was saved. Area (480 × 48, corner 16, the 1px decorative edge, 16/24)
keeps its recorded decisions. No change.

## Verification

`npm run build`, all 87 React tests, `build:docs` (docs audit), `test:contracts`, `test:preview`,
`npm test` (tokens and contrast), capture checksums: all pass. Unverified: dark theme, focus ring on screen, ChatGPT's
multi-line radius (would require typing), hover states.

## Feedback log

- 2026-09-25 · owner: "do the next component, I'll review all changes later" → Composer
  first pass: 16/24 text, faint ring and soft shadow, 8px action gap, auto-grow width fix →
  4 Area captures after.
- 2026-09-27 · owner (after this pass, on the older branch): the mode control is too small and not a real button; send concentric, not a circle → the send Button of this pass already answers the second; the stacked demo's mode is a soft md Button that opens a Menu.
- 2026-09-30 · audit S7a (owner) → edge is Card's `light-dark(neutral-100, neutral-750)` #ee (was `border-decorative` #f3); hover steps the edge to `input-edge-hover` #d4, as Input; focus keeps the quiet `composer-focus-color` → composer.css:17-18, 36-37.
- 2026-09-30 · audit S13 (owner) → the stacked demo's mode menu uses `MenuItem radio checked` (`menuitemradio`, a check only, no plate; gallery.tsx:2151). Was the raw `data-selected` plate plus a Fluent check in the shortcut slot.
- 2026-09-30 · audit S17 (owner: normalise the API vocabulary) → `aria-label` names the textarea through a visually hidden label (default "Message"; `label` deprecated alias); `onValueChange(value, event)`; ref stays on the textarea, rest on the shell; the width is the public hook `--area-composer-inline-size` (fallback 480), shared with Prompt suggestions.
- 2026-10-01 · compact pass round 7 → inset and gap read `ui-cluster` (8, compact 6); corner 16 → 12, the last action 6 from the top and the end at compact. Default unchanged. docs/research/compact-pass-2026-10-01.md.
