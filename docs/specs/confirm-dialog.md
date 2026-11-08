# Confirm dialog spec

**Captures:** `docs/research/captures/confirm-dialog/area--confirm-dialog-danger--rest--light` (predates the
2026-10-07 footer fix: 145.86 tall; now 141.9). ChatGPT's
confirm was measured live (values below) but its file isn't saved: the first export was blocked
(background tab, CSP), and reopening the delete confirm on 2026-10-06 was refused by the session's
permission check as a possible deletion. Re-capturing it is the owner's call.
**Peers:** Dialog (surface, insets, type, native modal), Button (soft neutral Cancel, soft danger
or solid action), Menu (the item that usually opens it)

## Owner decisions

- 2026-10-04: batch 1 (owner pick): "a forced-choice confirm (delete chat / page)"; reuses Dialog, Button.
- 2026-10-05: owner: "open the confirm and cancel" (ChatGPT's delete-chat confirm, opened from a
  chat's menu and cancelled; all chats still listed afterwards).
- 2026-10-08 (review, "needs changes"):
  - "the leave button text is black on a black button": the review page's own CSS repainted the
    specimen's solid action ink; the lead fixed that page. The component was right (solid neutral
    action, `fg-on-action` ink); no component change.
  - "is the red delete chat a real button in the default? for default use a non semantic
    negative button": the gallery's Default tile is now the neutral confirm ("Leave without
    saving?", solid neutral action; `GalleryConfirmDialogNeutral`) and the red one moved to a
    "Tone / danger" tile (`GalleryConfirmDialog`); Modal is "Behavior / modal". The lead made the
    gallery change (`apps/docs/scripts/build.mjs`); the demo sources are unchanged.
  - "go with your recs for open questions": no optional icon; one weight for both footer
    buttons, applied in Button (label 500 on every variant; button.md, 2026-10-08).

## Job and boundaries

A forced choice before an action that can't be undone: a question naming the action, a line on what
happens, Cancel and the action. Not Dialog (open content, forms), not Alert (inline status), not
Toast (after the fact, with Undo when undo is possible: prefer that to a confirm).

## Measurements (ChatGPT "Delete chat?", light, 2026-10-05, live from the open dialog)

| Slot · property | ChatGPT | Area |
|---|---|---|
| surface | 420 × 163, radius 24, 90% white with a 24px backdrop blur, shadow 0.5px ring 10% + 0 4 8 −2 10% | 420 (spec), Dialog's radius 16, surface fill, float lift |
| inset | 20 (form padding) | Dialog's 16 |
| title | 20/28 600, #0d | Dialog's title, the text's size strong (13/18 at type 13; `title-xs` until 2026-11-06) |
| description | 16/24 400, #8f, two lines, 4 below the title (gap 4) | Dialog's 13/18, a step (4) under the title (12.8 baseline to cap); default ink (the message), its last line on its baseline (2026-11-06 type balance) |
| footer | 12 above, end-aligned, 12 gap | Dialog's footer (end, `ui-cluster` gap), 16 above (was 20 until 2026-10-07) |
| Cancel | pill, 31 tall (6 16 padding, 18 line), #f3 fill, 0.56px 10% edge | Button soft neutral md (32) |
| action | pill, 31 tall, red 10% tint, rgb(224,46,42) ink | Button soft danger md |
| close | none visible | none |
| scrim | rgba(0,0,0,.133) | Dialog's scrim (13%, the same capture family) |

## Decisions

| Slot · property | Area value | Basis | Reason when it differs |
|---|---|---|---|
| width | 420 | ChatGPT | — |
| surface, insets, type | Dialog's | Peer: Dialog (accepted; its spec already weighed ChatGPT's 20/28 title) | ChatGPT 20 inset, 20/28 title, 16/24 text |
| description ink | default, not Dialog's muted | Radix Themes, Primer, Fluent 2, Atlassian, Spectrum (5 of 8); the type rule "one step between a title and its body" | The description is the dialog's only body; muted under a 16/500 title stepped size, weight and ink at once (owner 2026-11-06: "the type balance on this dialog looks wrong") |
| description's last line | trimmed to its baseline (`text-box: trim-end cap alphabetic`) when no content follows it | DESIGN_SYSTEM.md Q-T2: text that closes a block is read on its glyphs, as the title's cap starts it | The gap to the buttons read 18–19 on the glyphs against the 16 inset (owner 2026-11-06: "the spacing looks off"); now 14–15 |
| buttons | Button soft neutral Cancel; soft danger action (`tone="danger"`), solid neutral otherwise | ChatGPT (grey Cancel, red-tinted action) | Pills follow the theme's Pills setting |
| close control | none; Escape, Cancel and the scrim cancel | ChatGPT | — |
| initial focus | Cancel | WAI alertdialog (least destructive); Radix, Primer measured | — |
| footer gap above | Dialog's section gap, 16 (12 compact) | shadcn, Radix Themes, Base UI, Atlassian 16 (audit 2026-10-07) | ChatGPT 12; was 20 (an extra 4 that matched no reference) |

## Behavior and accessibility

Dialog's native modal with `role="alertdialog"` (Dialog now passes `role` to its `<dialog>`),
named by the title and described by the description. Focus starts on Cancel; Escape, Cancel or a
press on the scrim closes without acting (`onCancel`). `onConfirm` may return a promise: the action
shows Button's loading state and the dialog stays open until it settles. `inline` renders the
surface in place for documentation.

## Verification

Builds, parity, typecheck, Dialog and audit tests pass. Browser: the modal opens as `alertdialog`
with focus on Cancel; the action spins and closes after its promise; Escape cancels; the inline
surface is 420 wide. 2026-10-07: dark and compact read in the browser (Visual pass); modal
scrim 13.3%, `alertdialog` named and described, focus on Cancel. Unverified: screen reader.

## Visual pass

### Claude in Chrome audit, 2026-10-07

Computed styles read live with a measuring snippet (the capture script could not be injected on
third-party pages, and the tab ran hidden, so no files were exported; values below are the
readings). shadcn values divided by its 0.95 open-scale, which never finished in the hidden tab.
Owner products: not reopened (safety rule: no destructive confirms in the owner's accounts); the
2026-10-05 ChatGPT reading above stands.

Sources: shadcn Alert Dialog, Base UI variant (ui.shadcn.com/docs/components/base/alert-dialog;
Basic and Destructive demos; light, and dark via the `dark` class) · Radix Themes Alert Dialog
(radix-ui.com/themes/docs/components/alert-dialog, "Revoke access", light) · Base UI Alert Dialog
(base-ui.com/react/components/alert-dialog, "Discard draft", light) · Primer ConfirmationDialog
(primer.style/react/storybook, components-confirmationdialog--default, light) · Fluent 2 Dialog
alert (storybooks.fluentui.dev/react, components-dialog--alert, light) · Atlassian Modal dialog,
Danger (atlassian.design/components/modal-dialog/examples, light) · React Spectrum v3
AlertDialog, destructive (react-spectrum.adobe.com/v3/AlertDialog.html, light) · Area
(localhost:4377/confirm-dialog.html, light, dark, compact; modal opened from its demo trigger).
Not measured: Material 3 (material-web.dev demos are in iframes that didn't load; m3.material.io
is images), Apple HIG (images), Notion and Figma confirms (destructive; not opened).

| Property | Area | ChatGPT | shadcn | Radix Th. | Base UI | Primer | Fluent 2 | Atlassian | Spectrum |
|---|---|---|---|---|---|---|---|---|---|
| width | 420 | 420 | 384 (sm 320) | 450 (demo) | 384 | 320 | 600 | 600 | 480 |
| inset | 16 | 20 | 16 | 24 | 16 (+1 edge) | 16 | 24 | 24 | 40 |
| radius | 16 | 24 | 14 | 12 | 0 (demo theme) | 12 | 8 | 12 | 4 |
| title | 16/24 500 | 20/28 600 | 16/24 500 | 20/26 700 | 16/24 700 | 14/21 600 | 20/28 600 | 20/24 653 | 18/23.4 700 |
| description ink | muted #666 | muted #8f | muted | default | muted | default, 16/24 | default | default | default |
| description → buttons | 20 → **16** | 12 | 16 (+ footer band) | 16 | 16 | 32 (two paddings) | ~6 | 16 | 36 |
| button height | 32 | 31 | 32 | 32 | 32 | 32 | 32 | 32 | 32 |
| button gap | 8 | 12 | 8 | 12 | 12 | 8 | 8 | 8 | 16 |
| order | Cancel, action | Cancel, action | Cancel, action | Cancel, action | Cancel, action | Cancel, action | action, Close | Cancel, action | Cancel, action |
| danger action | soft (red tint, red ink) | soft (red 10%, red ink) | soft (red 10%, red ink; dark 20%) | solid red | white, red ink | grey fill, red ink | — | solid red | red outline |
| close × | none | none | none | none | none | yes (32) | none | yes (32) | none |
| icon | none | none | optional 40 media (destructive demo) | none | none | none | none | danger icon before title | none |
| initial focus | Cancel | — | not read (hidden tab) | Cancel | not read | Cancel | primary | close × | not read |
| scrim | 13.3% black (Dialog) | 13.3% | 10% + 4px blur (dark too) | 40% | — | grey 40% | 40% | — | — |

Findings:

1. **Footer sat 20 below the description** (Dialog's 16 gap + an extra 4). Four references put
   it at 16, ChatGPT at 12; 20 matched none and split the confirm from its Dialog peer. Fixed.
2. Width, title, muted description, Cancel-then-action order, 32 buttons, 8 gap, no close, Cancel
   focus and the soft danger action all fall inside the reference spread and agree with ChatGPT;
   unchanged. Soft danger matches ChatGPT and shadcn's destructive demo exactly (10% red tint, red
   ink); Radix and Atlassian go solid.
3. Cross-family, fixed in Button 2026-10-08 (owner): soft Cancel and soft danger render 14/400
   while the solid action renders 14/500, so the neutral confirm ("Leave") reads heavier than the
   danger one. Every reference sets both buttons alike (shadcn, Radix, Primer, Atlassian 500).
4. Dark (Area): surface #1d1d1d, edge #4b4b4b, description #c5c5c5, Cancel #282828, danger
   action rgb(130 0 34) fill with rgb(255 201 203) ink. shadcn dark keeps a 20% red tint on its
   near-black surface. No ChatGPT dark confirm reading exists. Area's dark danger fill is
   Button's; noted for the Button pass.
5. Compact (Area): 12 section gap, 28 buttons, 12/16 description, title held at 16/24 (Dialog's
   decision); after the fix the footer is 12 below the description.

Changed: `confirm-dialog.css` drops the footer's extra `margin-block-start` (20 → 16; compact
16 → 12). Questions 2 and 3 settled 2026-10-08 (below).

## Settled questions

1. **Type and inset: Dialog's 16/24 strong title and 16 inset** (owner 2026-10-06: "i like the size
   of the current dialog type"). The values have wider support than ChatGPT's confirm: ChatGPT's own
   shortcuts dialog titles at 16/24 600, shadcn's Dialog at 16 (500) with 16 insets, Primer 16, and
   Figma's Share dialog 16 sides (dialog.md, Measurements and Decisions). ChatGPT's 20/28 title and 20
   inset on its delete confirm are the outlier.
2. **No optional icon** (owner 2026-10-08, "go with your recs"). shadcn shows a 40px media square
   on its destructive demo and Atlassian a danger icon before the title; ChatGPT, Radix, Base UI,
   Primer and Fluent show none, and the red action already carries the tone. ConfirmDialog has no
   icon slot.
3. **One weight for both footer buttons** (owner 2026-10-08, "go with your recs"). Applied in
   Button, not here: every Button variant's label is 500 (`button.css`, base `--_weight`), so the
   soft Cancel, the soft danger action and the solid neutral action all render 14/500, as shadcn,
   Radix, Primer and Atlassian do.

## Motion and interaction, 2026-10-07

Contract: `docs/MOTION.md`, "Dialog, command palette, confirm dialog". Confirm dialog is Dialog's
native modal, so its motion is Dialog's (`surface.css`, sibling); nothing in `confirm-dialog.css`
overrides it. Verified on `/confirm-dialog.html` in a background tab: enter `opacity` + `scale`
200 `ease-out` with the scrim on 200; exit 150 (`opacity`, `scale`, `overlay`, `display`, scrim);
focus lands on Cancel; `role="alertdialog"`.

| Interaction | Before | After |
|---|---|---|
| enter / exit | Dialog's (base 150 both ways before the shared change) | Dialog's: moderate 200 in, base 150 out, inherited |
| busy action | on success the action's spinner turned back into its label as the dialog closed, so the label flashed back during the fade | the action stays busy through the exit and resets when the dialog opens again; a failed action still returns to ready at once (ConfirmDialog.tsx) |
| buttons | Button's (sibling) | unchanged |

Crispness: at rest `scale: 1`, 420 wide, x 334.5 (layout centring, snaps at paint). Its height is
fractional (141.86, from Dialog's `text-box` trim on the title), so the vertically centred surface
starts at y 328.07. That is Dialog's, reported to the lead rather than changed here.

## Feedback log

- 2026-10-07 · owner: make interactions professional, intentional, subtle; components look pixelated → motion is Dialog's (moderate in, base out), inherited; the busy action no longer flashes back to its label during the exit. ConfirmDialog.tsx.
- 2026-10-07 · Claude in Chrome audit (8 public references, above): footer gap 20 → 16 to match
  Dialog and the references; icon and button weight left open.

- 2026-10-06 · owner: likes the current dialog type size; asked whether it is validated → yes (four
  references, above); kept.
- 2026-10-05 · owner: open ChatGPT's confirm and cancel, then build → measured live, cancelled
  (nothing deleted); built on Dialog and Button; on the Review page.
- 2026-10-08 · owner review "needs changes" → (a) black-on-black Leave was the review page's CSS
  (fixed by the lead; no component change); (b) gallery Default is the neutral confirm, the red
  one is "Tone / danger" (lead, build.mjs); (c) recs taken: no icon; one 500 weight on both
  footer buttons via Button (button.css). No change to confirm-dialog.css or ConfirmDialog.tsx.
- 2026-10-08 · owner: approved on the component review page (re-review after the requested changes).

## Review note, 2026-10-22 (round 68)

- **What changed:** the description sits directly under the title: 12 from the title's baseline to the description's cap, was 16.
- **Why:** the gap and text pass across every family (your note: one intentional logic for the gaps between labels, titles and their copy). A title and the line under it now join with no gap everywhere, the rule you set on Card (Figma and Notion 11.5). Before, the same pair sat 10.5 to 20 apart depending on the family. DESIGN_SYSTEM.md, "Text pairs".

## Review note, 2026-10-28 (dark soft tones)

- **What changed:** the danger action's soft plate in dark are quieter: each tone's soft surface is the neutral control fill of the same state in the
  tone's hue at chroma 0.05 / 0.06 / 0.07 (danger rest #3d1d1f, was #820022). Inks and light are unchanged; the ink
  reads better (Delete's label 7.34:1 → 10.38:1).
- **Why:** ChatGPT, Notion and Figma paint dark soft tones at chroma 0.04–0.07; Area's palette rungs carried up to 0.15
  and read almost solid. A token change (DESIGN_SYSTEM.md, Colour: dark soft tones;
  docs/research/dark-soft-tones-2026-10-28).
- **Verdict:** approved by the owner on the dark soft tones review page, 2026-10-28 (option A, every family approved).

## Review note, 2026-11-06 (balance pass; owner: "Keep it")

- **What changed:** Dialog's title group, now the text's size: title 13/18 strong, description 13/18 muted, joined as
  one message (8.8 baseline to cap, the description's own line). It was 16/22 over 13/18 joined 10.0. Footer, width and
  buttons unchanged.
- **Why:** the owner's note on a confirm ("no spacing logic between the title and the text … the type style size contrast with the text is large … make sure all of this is intentional"). The 2026-11-02 ramp moved `title-xs` from 15 to 16 at type 13, so a 16 title sat over 13 text, 1.23× (the owner had approved 16 over 14, 1.14×, on 2026-09-26), and joined 10.0 baseline to cap beside the text's own 8.8: near the line gap but not on it. Cursor sets its confirm's title at its text's size (12/500 over 12) and its settings rows 13 over 13. DESIGN_SYSTEM.md, "Text pairs"; `docs/research/title-balance-2026-11-06`. A confirm is a question and one line, a message rather than a page, as Alert and Toast are.

- **Second look (owner: "the space between the title and the copy still doesnt look right"):** joined on the copy's
  line, the title read as the paragraph's first line. Every surface title now stands one step (4) off its copy: 12.8
  baseline to cap beside the copy's 8.8. Compared at 0, 4 and 6 on the review page; the owner picked 4 ("4 is right",
  2026-11-06; Cursor's confirm sets its message 4 under its title).

### 2026-11-07 · No size (components audit V1)

- **Decision:** Confirm dialog takes no `size` when Dialog gains one. It is a question, a line and two buttons, measured
  at 420 (ChatGPT's "Delete chat?"; confirm-dialog.css), and a wider or narrower confirm is not a different job: longer
  content belongs in a Dialog. It renders Dialog's surface, so it carries Dialog's default `--md` class, and its own width
  wins over it. Dialog's header rule on scroll reaches it too, if its extra content ever scrolls.
- **Why:** docs/research/components-audit-2026-11-07/README.md, V1. The owner took every recommendation ("Take all recs", 2026-11-07).

## Review note, 2026-11-06 (type balance)

- **What changed:** the description is drawn in the default ink, and when nothing follows it its last line ends on its
  baseline, so the buttons sit 14 under the words, read on the glyphs as the 16 inset round them is.
- **Why:** the owner's note on the design interface's "Go back to …?" confirm: "the type balance on this dialog looks
  wrong, the spacing looks off". The title stepped down to the description in size, weight and ink at once (16/500
  default over 13/400 muted), so the title shouted and the message whispered; five of the eight references draw a
  confirm's message in the default ink. The description's line box added 4–5 under its last baseline, so the footer read
  further from the words than the inset round them.
- **Verdict:** open (owner review).
