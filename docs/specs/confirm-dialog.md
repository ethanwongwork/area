# Confirm dialog spec

**Status:** in review · 2026-10-05 (built; Review page batch "New components, batch 1")
**Captures:** `docs/research/captures/confirm-dialog/area--confirm-dialog-danger--rest--light`. ChatGPT's
confirm was measured live (values below) but its file isn't saved: the first export was blocked
(background tab, CSP), and reopening the delete confirm on 2026-10-06 was refused by the session's
permission check as a possible deletion. Re-capturing it is the owner's call.
**Peers:** Dialog (surface, insets, type, native modal), Button (soft neutral Cancel, soft danger
or solid action), Menu (the item that usually opens it)

## Owner decisions

- 2026-10-04: batch 1 (owner pick): "a forced-choice confirm (delete chat / page)"; reuses Dialog, Button.
- 2026-10-05: owner: "open the confirm and cancel" (ChatGPT's delete-chat confirm, opened from a
  chat's menu and cancelled; all chats still listed afterwards).

## Job and boundaries

A forced choice before an action that can't be undone: a question naming the action, a line on what
happens, Cancel and the action. Not Dialog (open content, forms), not Alert (inline status), not
Toast (after the fact, with Undo when undo is possible: prefer that to a confirm).

## Measurements (ChatGPT "Delete chat?", light, 2026-10-05, live from the open dialog)

| Slot · property | ChatGPT | Area |
|---|---|---|
| surface | 420 × 163, radius 24, 90% white with a 24px backdrop blur, shadow 0.5px ring 10% + 0 4 8 −2 10% | 420 (spec), Dialog's radius 16, surface fill, float lift |
| inset | 20 (form padding) | Dialog's 16 |
| title | 20/28 600, #0d | Dialog's 16/24 strong |
| description | 16/24 400, #8f, two lines, 4 below the title (gap 4) | Dialog's 14/20 muted, 4 apart |
| footer | 12 above, end-aligned, 12 gap | Dialog's footer (end, `ui-cluster` gap) + 4 above |
| Cancel | pill, 31 tall (6 16 padding, 18 line), #f3 fill, 0.56px 10% edge | Button soft neutral md (32) |
| action | pill, 31 tall, red 10% tint, rgb(224,46,42) ink | Button soft danger md |
| close | none visible | none |
| scrim | rgba(0,0,0,.133) | Dialog's scrim (13%, the same capture family) |

## Decisions

| Slot · property | Area value | Basis | Reason when it differs |
|---|---|---|---|
| width | 420 | ChatGPT | — |
| surface, insets, type | Dialog's | Peer: Dialog (accepted; its spec already weighed ChatGPT's 20/28 title) | ChatGPT 20 inset, 20/28 title, 16/24 text |
| buttons | Button soft neutral Cancel; soft danger action (`tone="danger"`), solid neutral otherwise | ChatGPT (grey Cancel, red-tinted action) | Pills follow the theme's Pills setting |
| close control | none; Escape, Cancel and the scrim cancel | ChatGPT | — |
| initial focus | Cancel | WAI alertdialog (least destructive) | — |

## Behavior and accessibility

Dialog's native modal with `role="alertdialog"` (Dialog now passes `role` to its `<dialog>`),
named by the title and described by the description. Focus starts on Cancel; Escape, Cancel or a
press on the scrim closes without acting (`onCancel`). `onConfirm` may return a promise: the action
shows Button's loading state and the dialog stays open until it settles. `inline` renders the
surface in place for documentation.

## Verification

Builds, parity, typecheck, Dialog and audit tests pass. Browser: the modal opens as `alertdialog`
with focus on Cancel; the action spins and closes after its promise; Escape cancels; the inline
surface is 420 wide. Unverified: dark, compact, screen reader.

## Settled questions

1. **Type and inset: Dialog's 16/24 strong title and 16 inset** (owner 2026-10-06: "i like the size
   of the current dialog type"). The values have wider support than ChatGPT's confirm: ChatGPT's own
   shortcuts dialog titles at 16/24 600, shadcn's Dialog at 16 (500) with 16 insets, Primer 16, and
   Figma's Share dialog 16 sides (dialog.md, Measurements and Decisions). ChatGPT's 20/28 title and 20
   inset on its delete confirm are the outlier.

## Feedback log

- 2026-10-06 · owner: likes the current dialog type size; asked whether it is validated → yes (four
  references, above); kept.
- 2026-10-05 · owner: open ChatGPT's confirm and cancel, then build → measured live, cancelled
  (nothing deleted); built on Dialog and Button; on the Review page.
