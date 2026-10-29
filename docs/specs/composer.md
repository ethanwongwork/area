# Composer spec

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
  input  16/24, 4px block padding (32px row); 8 inline, none at the start after a leading action (inline layout)
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
| loading | `loading` prop (`busy` is a deprecated alias): textarea stays editable and focused, Enter doesn't send, `aria-busy` on the root; the send slot becomes a Stop Button (same solid neutral icon-only Button, `aria-label` from `stopLabel`, default "Stop", calls `onStop`, disabled without `onStop`). No composer-wide cursor or `data-busy` hook | Audit S18 (owner 2026-09-30); ChatGPT keeps the field editable and swaps send for stop | Was `busy`: textarea disabled, `cursor: progress`, send disabled |
| loading · stop glyph | Area pilot `stop` (11 × 11 square, radius 2; `area-icons-pilot/stop.svg`), drawn filled (the solid role) | Not captured, pending a capture: ChatGPT's stop state needs a sent message | — |
| actions · gap | **8** | ChatGPT 8 | Was 4 |
| input · start after a leading action | **0**: the gap alone, so the text sits the gap after the + (7 at type 13) | ChatGPT column-gap 8 between the action and the input | Round 81: with the input's own 8 as well the text sat 15 after the button and 22 from the + glyph; now the glyph is 14 from the shell's edge and 14 from the text. Stacked keeps the 8 (its text sits over the footer's + glyph) |
| actions · size | 32 | Peer: Button md | ChatGPT 36; Area's control scale is 28 / 32 / 40 |
| shell · width | `min(100%, var(--area-composer-inline-size, 480))`, 480 = `space-96` × 5 (composer.css:13); the public hook also sets Prompt suggestions' width | Audit S17: one measure for the composer column | — |
| shell · height (inline) | 48 | 32px actions + 8px insets | ChatGPT 52 (36px actions) |
| shell · radius | **Card's corner**, term for term: the container corner + the inset's share (18 in the app's scale, 20 at type 16), never past half the one-line height; the actions concentric inside (shell less the inset: 11 on a 30 send) | owner 2026-10-29 (see Expansion) | Was 20 (the surface corner + 4, actions 13: rounder than every other Button of their height), and before that 15/16, the send's corner + the inset (owner 2026-09-26, option B). ChatGPT is a pill (26 on 52); `submitPill` reproduces it |
| placeholder | `input-placeholder` (fg-muted 102) | Peer: Input (Complete) | ChatGPT rgb(143) |
| textarea · auto-grow | refits on text and on width changes | Bug fix | The height was only fitted on text changes. A composer that first laid out narrow (or sat in a resized panel) kept an inflated height: the gallery inline tile measured 176px empty |

## Behavior and accessibility

Unchanged keyboard and submission contract, except while `loading`: Enter doesn't send and
the send slot is Stop (see Decisions). The action slots are `fieldset`s, so `disabled`
disables every nested action natively (audit G-14; Composer.tsx:110-124). Enter during IME
composition never sends, including Safari's late commit Enter (`keyCode` 229); a form reset
restores an uncontrolled composer's `defaultValue`; the sent text drops leading blank lines
and trailing whitespace but keeps a pasted block's indentation; a consumer's `inputProps.id`
wins over the generated one (audit G-15; Composer.tsx:51, :78-97). Gallery tile: "State / loading" (`GalleryComposerLoading`). The auto-grow now also observes the
textarea's width (ResizeObserver, width-only, so fitting the height cannot loop).
Measured: at 134px wide the empty inline composer grows as its placeholder wraps; widened
to 480px it returns to 48px.

## Visual pass

2026-10-28 (round 81; desktop app, the Stage at 100%, 2x, light and dark): the inline and pill composers' text sat
15 after the + button (the entry's 7 gap plus the input's 8), 22 from the + glyph, against ChatGPT's 8 after its
36 button. The input drops its start padding after a leading action (composer.css); the + glyph is now as far from
the text as from the shell's edge (14). Stacked, prefilled, disabled and context composers are unchanged.

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

## Motion and interaction, 2026-10-07

Contract: `docs/MOTION.md`. Research: `docs/research/motion-2026-10-07/crispness-and-current-state.md`.


| Interaction | Before | After |
|---|---|---|
| Hover (edge) | `--area-transition` both ways | instant in, `border-color` `fast` `--area-ease-out` out |
| Focus (edge, 2px outline, halo) | the halo (`box-shadow`) faded in and out over 100ms while the outline snapped | instant in; on blur the outline and halo leave at once and the edge colour fades on `fast` |
| Disabled | colours on `fast` | unchanged |
| Send button, actions | Button's rules | unchanged here |
| Height growing with text | `field-sizing: content` / JS measure, no animation | unchanged (a growing field must follow typing) |

The shell's transition is now `background-color`, `border-color` and `color` on `duration-fast`
`--area-ease-out` (was `--area-transition`, which also eases `box-shadow`). Crispness: the shell rests
on whole pixels (480 × 48 at 261, 891 on `/composer.html`); the JS fallback writes whole
`scrollHeight` pixels. Verified: focus has no running transitions; blur runs only the four
border-colour transitions (100ms).

Open question: the edge fades out on blur while the outline leaves at once (CSS cannot tell a blur
from a hover-out). Recommendation: keep; the outline carries the ring, and it is instant both ways.

## Review note, 2026-10-21

- **What changed:** Its resting shadow is one tight layer, `0 1px 2px -1px` at 8% (ChatGPT's sm), instead of a soft two-layer haze at 1.5%.
- **Why:** your picks on the state page (2026-10-21), now the defaults of the new state settings (Inspector: Stroke, Shadow, Fill) (Rest shadow d). Nothing else on it changed.

## Feedback log

- 2026-09-25 · owner: "do the next component, I'll review all changes later" → Composer
  first pass: 16/24 text, faint ring and soft shadow, 8px action gap, auto-grow width fix →
  4 Area captures after.
- 2026-09-27 · owner (after this pass, on the older branch): the mode control is too small and not a real button; send concentric, not a circle → the send Button of this pass already answers the second; the stacked demo's mode is a soft md Button that opens a Menu.
- 2026-09-30 · audit S7a (owner) → edge is Card's `light-dark(neutral-100, neutral-750)` #ee (was `border-decorative` #f3); hover steps the edge to `input-edge-hover` #d4, as Input; focus keeps the quiet `composer-focus-color` → composer.css:17-18, 36-37.
- 2026-09-30 · audit S18 (owner) → `loading` replaces `busy` (kept as a deprecated alias): field stays editable, send becomes Stop (`onStop`, `stopLabel`), `aria-busy` on the root; `data-busy`, the composer-wide `cursor: progress` and the manifest `busy` state removed.
- 2026-09-30 · audit S13 (owner) → the stacked demo's mode menu uses `MenuItem radio checked` (`menuitemradio`, a check only, no plate; gallery.tsx:2151). Was the raw `data-selected` plate plus a Fluent check in the shortcut slot.
- 2026-09-30 · audit S17 (API vocabulary, slice 3/4) → new public hook `--area-composer-inline-size` (default 480 = 96 × 5) sets the composer's and Prompt suggestions' width together (composer.css:13; prompt-suggestions.css:13).
- 2026-10-01 · audit G-23 (owner pick A) → demos use the placeholder vocabulary (Body text, Item one, Option one, Placeholder, Label) and `authorName` "Assistant", per DESIGN_SYSTEM's Example copy; no component change.
- 2026-10-01 · audit G-14 → leading and trailing action slots are `fieldset disabled={disabled}`, so a disabled composer disables every nested action → Composer.tsx:110-124.
- 2026-10-01 · audit G-15 → IME-safe Enter (`isComposing` or keyCode 229), form reset restores `defaultValue`, sent text trimmed (leading blank lines, trailing whitespace), consumer `inputProps.id` wins → Composer.tsx:51, :78-97.
- 2026-10-01 · owner: ChatGPT's Stop state is the send button showing the filled stop square (owner screenshot of the composer while a reply streams; the circle there is ChatGPT's blue accent). Area keeps the `stop` glyph in the send Button, which follows the Action role, so the Composer Stop glyph needs no further capture.
- 2026-10-01 · compact pass round 7 → inset and gap read `ui-cluster` (8, compact 6); corner 16 → 12, the last action 6 from the top and the end at compact. Default unchanged. docs/research/compact-pass-2026-10-01.md.
- 2026-10-02 · bug: after a runtime density switch the textarea kept the height measured at the old density (the script refit only on text or width changes) → native `field-sizing: content` where supported (composer.css), the measuring script only as a fallback (Composer.tsx). Verified: 48 → 40 → 48 across a switch, 3 lines 96, capped at 5 rows.
- 2026-10-03 · bug: the send Button's capped corner went negative at compact −12 (28 × 0.4 − 12), so the composer read 5.2 → floored at 0 (`composer.css`, `--_composer-button-radius`).
- 2026-10-03 · one corner setting (owner: one radius setting, Sharp and Pill as ends; "every control is a pill") → the send Button's corner (setting × height ÷ 32) plus the inset: 16 / 12 at the default, a pill at Pill (`composer.css`). `docs/research/radius-audit-2026-10-03.md`, "One corner setting".
- 2026-10-04 · quality pass after the one corner setting → the inset joins the corner at Sharp too when the send Button is a pill (pill composer read 16 at 0) (`composer.css`). `docs/research/radius-audit-2026-10-03.md`, "Quality pass".
- 2026-10-07 · owner: make interactions professional, intentional, subtle; components look pixelated → hover and focus arrive at once; the focus halo no longer fades (box-shadow left out of the shell's transition) → composer.css. See "Motion and interaction, 2026-10-07".
- 2026-10-12 · owner, 2026-10-12: "go with your recommendations" (consistency pass) → the edge reads `border-card` (O5: one role for a literal written in several families; same paint). (docs/research/consistency-audit-2026-10-12.md)
- 2026-10-14 · owner: "go with your recs" (elevation audit) → Composer takes the Elevation axis's resting role at rest and under its focus halo (was no shadow, owner 2026-09-26): ChatGPT lifts its composer (0 2 8 at 4%, 0 4 80 8 at 2.4%, captured 2026-10-13); 1.5% at the default step, none at 0 (composer.css; docs/research/elevation-2026-10-14.md).
- 2026-10-15 · owner: "merge it, then continue working" → boundary sweep under increased contrast (CONTRAST.md: required boundaries target 3:1): the frame is `composer-edge`, the card edge at standard contrast and the strong control stroke at more (it read 1.16:1 light, 1.33:1 dark; now 3.79:1 / 5.49:1), as its focus colour already switched.
- 2026-10-23 · owner: "make sure all inset corner radius pairings are not broken" → corner audit: with a pill send button (`submitPill`) the shell is a pill, so its other actions are pills too (their concentric corner, the shell's less the inset); the leading + sat at 8 in the round end (composer.css; `rounded` opts one out). Swept Radius 0–14 and Pill; the default composer is unchanged. Not changed: context-row Chips are pills by the Pills set and sit in the 16 corner rounder than its 8 concentric corner (owner's Pills decision).


## Chat additions, 2026-10-19

The Composer gains three things for an agent chat (evidence: docs/research/inspector-chat-2026-10-18/composer-additions.md):

- `context`: a row inside the shell above the field for Chip `input` pills and Attachments, wrapping on the composer's
  gap (Cursor's image grid and Codex's attachments sit at the composer's top; Claude Code's row above its field).
- `menu`: a Composer menu drawn above the composer at its width (the root is now positioned).
- `onQueue`: while `loading`, Enter hands the draft here and clears the field; the button stays Stop (Cursor's queue,
  Claude Code's "Queue another message…").

## Review note, 2026-10-19 (chat additions)

- **What changed:** the composer can hold chips and images above its text, opens the @ and / menu above itself, and
  can queue a message while a reply is still coming.
- **Why:** the agent chat needs all three; each follows what Cursor, Claude Code and Codex do.

## Review note, 2026-10-22 (round 67)

- **What changed:** Its resting shadow is one tight layer, `0 1px 2px -1px` at 8% (ChatGPT's sm), instead of a soft two-layer haze at 1.5%.
- **Why:** your picks on the state page (2026-10-21), now the defaults of the new state settings (Inspector: Stroke, Shadow, Fill) (Rest shadow d). Keyboard focus is the brighter indicator blue (#0160d9, was #004cb0), as everywhere since the state settings.

## Review note, 2026-10-28 (round 81)

- **What changed:** in the one-line composer the text starts closer to the + button: 7px after it, was 15.
- **Why:** ChatGPT's text follows its + by the gap alone; Area added the text box's own 8px on top, which left a
  wide hole after the +. The + now sits as far from the text as from the composer's edge.
- **Verdict:** approved by the owner on the round 81 review page, 2026-10-28, with no notes.

## Expansion, 2026-10-29

Owner, 2026-10-29, with screenshots of Cursor's Agents window, the Claude app's reply composer and Codex: "expand the
design and capabilities of the composer, looking at more slots, a mic button, attachments, additional settings".
Intake and evidence: [docs/research/composer-expansion-2026-10-29/](../research/composer-expansion-2026-10-29/README.md).

| Slot · part | Area value | Basis |
|---|---|---|
| `header` | a row above the shell, outside it: its items `space-2` apart, starting at the shell's inset (`ui-cluster`) so a ghost trigger's plate lines up with the shell's actions; `ui-cluster` above the shell | Cursor's "Code ▾ This Mac ▾": 8 above the composer, 28 selectors (evidence.md, 5) |
| `footer` | a row under the shell, outside it: `space-2` apart, `ui-cluster` below the shell (8, 6 compact), from the shell's inset | the Claude app's chin: 8 under the shell, 6 compact, 12px secondary text (evidence.md, 7) |
| `ComposerNote` | the footer's quiet line: `text-xs`, `fg-muted`, centred in the space left, one line with an ellipsis | the Claude app's "Claude is AI and can make mistakes." |
| group | with either row, the root is `area-composer-group` (className and the rest land on it); it takes the width hook and the shell fills it. Without them the shell is the root, as before | — |
| shell · corner | Card's corner, term for term (`--_card-radius`: the container corner plus the inset's share; 18 in the app's scale), never past half the one-line height (a pill at Pill), square at Sharp; every action in the shell (send included) and the context row's Attachments take the shell less the inset (11 on a 30 send), plus the Pills setting; a round send (`submitPill`) still makes a pill composer. Approval takes the same corner. Cohesion tests keep the Composer on Card's and Approval on the Composer's. First built as the surface corner + 4 (20, actions 13), approved, then changed on the owner's question "are they slightly too round?": its buttons were rounder than every other Button of their height (8) | owner, 2026-10-29: "i prefer cursors but want it to still be rounded not pill/circular, but pretty round"; Cursor's prompt input 20 (`--prompt-input-border-radius:20px`, the glass bundle) around a round 24 send. Was option B (2026-09-26): the send's own corner + the inset, 16 (15 at type 13) |
| `ComposerMic` | ghost neutral icon-only toggle Button (md, or sm in a footer): `mic` at rest, `waveform` on the selected plate while on; one name ("Dictate") with `aria-pressed` | Cursor, Claude and Codex all set a mic before send or in the footer |
| `ComposerAttach` | ghost neutral icon-only Button with `add`, opening a hidden file input (`accept`, `multiple`) | every reference's + |
| `onFiles` | files dropped on the shell or pasted into the field; while files are over it the shell takes File upload's drop paint (`selection-edge` on `bg-component-hover`), counted across child enters and leaves; pasted text stays the field's | every reference takes dropped and pasted files |
| Model picker `efforts` | the effort after the name, a word space apart: the name in `fg-default`, the effort in `fg-muted`; an Effort group (Menu label, radio rows) under the models, no divider | Codex: the name in the default ink, a space, the effort tertiary; the Claude app and Claude Code: the effort muted after the name (evidence.md, 2) |
| Prompt suggestions `shortcut` | a Kbd after the label (chips) or at the row's end (list) | Cursor's "Plan New Idea ⇧Tab" |
| mode chip | composition: Tag (`tone`, `icon`, `onRemove`) in the leading actions | Cursor's "Multitask ×" |
| permission | composition: a Menu trigger with an icon (Model picker with `triggerProps.icon`) | Codex's "Approve for me" and the Claude app's "Manual" are both dropdowns (evidence.md, 3) |

New gallery tiles: Slot / header, footer; Content / dictation; State / dictating, dropping files; Content / model and
effort; Composition / agent (Cursor's shape), reply (the Claude app's), combined (parts of each). Model picker: Content /
effort. Prompt suggestions: Content / shortcut. A `tray` slot (Codex's strip tucked under the shell) was built and
removed on review (owner, 2026-10-29: "i dont like the codex tray stylistically, i dont think it goes with area"); the
footer row holds what it held.

## Review note, 2026-10-29 (expansion)

- **What changed:** the composer can hold a row of selectors above it, a tray of project and files tucked under it,
  and a row of tools with a quiet note below it; it takes files dropped or pasted onto it; it has a dictation button and
  a + that opens the file picker. The model picker can show an effort ("Option one Medium"), and a suggestion can show
  its shortcut. Existing composers are unchanged.
- **Why:** you asked for more slots, a mic, attachments and settings, with Cursor's, the Claude app's and Codex's
  composers as references; each part follows what they do, built from Area's Button, Tag, Model picker and Kbd.
- **Verdict:** changes (owner, 2026-10-29): "which composition is being built? i prefer cursors but want it to still be
  rounded not pill/circular, but pretty round. also want to see how you can take parts of each version and combine them,
  i dont like the codex tray stylistically, i dont think it goes with area". Applied: the shell's corner moved to the
  surface ladder (20 at the default, Cursor's; the send and actions concentric, 12 to 13, not round), the tray removed,
  the Codex composition replaced by a combined one. In review.
- **Verdict:** approved (owner, 2026-10-29, the Composer expansion review page, round 2); Complete.

## Review note, 2026-10-29 (Card's corner)

- **What changed:** the composer takes Card's corner, 18 in the app's scale (was 20), and its send and actions 11 (was
  13). Approval follows. The pill composer is unchanged.
- **Why:** you asked whether the corners fit the system. Measured at the defaults, the shell's 20 sat a step above Card
  and Surface (18), but its buttons were 13 against 8 on every other 30px Button and Input, and the one-line composer
  read close to a pill. A surface standing alone on the page already takes Card's edge, so it takes Card's corner.
- **Verdict (Card's corner):** approved (owner, 2026-10-29, the Composer expansion review page, round 3); Complete.
