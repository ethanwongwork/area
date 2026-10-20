# Approval spec

**Captures:** none yet; evidence from the products' stylesheets and the Codex TUI snapshots,
`docs/research/inspector-chat-2026-10-18/`.
**Peers:** Composer (the slot it takes), Menu (rows and shortcut keys), Kbd (quiet), Code block (sm), Diff

## Owner decisions

- 2026-10-18: the agent asks before every edit and command (decision 3 of the plan, "go with your recommendations").

## Job and boundaries

The agent asks before it acts: what it wants to do and why, the thing itself (a command, a diff), and numbered choices
with their scope (once, for the session, always; no), plus a field to tell it what to do instead. It takes the
composer's place until answered, so the question is where the person is already looking. Not a Dialog (it does not
block the app), not a Menu (it is a decision, not a list of commands).

## Variants

| Axis | Value | Justification | Where |
|---|---|---|---|
| options | 2 to 4, numbered | yes / scope / no | Claude Code ("Yes", "Yes, allow all edits this session", "Yes, and don't ask again", "No"); Codex (y / p / esc) |
| instead | on, off | "tell Claude what to do instead" | Claude Code last option; Codex "No, and tell Codex what to do differently" |
| detail | none, any (a command in Code block sm, a Diff) | — | Claude Code editable command; Codex "$ cmd" |

## Sources

| Id | What | Path |
|---|---|---|
| claude-code | permission prompt | `index.css` `_qlaBag`: card padding 8, radius 8; title 1.1em bold; description .9em; vertical buttons padding 6×8, radius 4, inset ring; number shortcut at .6; arrow keys; free text last; "Esc to cancel" |
| codex | approval modal | TUI `approval_modal_exec.snap`, `approval_modal_patch.snap`; app `pending-request-item-panel-*.js` |
| cursor | shell approval row | `ShellToolCallView.js`: mode dropdown left, Skip / Run right |

## Anatomy

```
area-approval                 the Composer's shell: its edge, corner, field fill and inset; text-md; gap ui-cluster
  area-approval__head         the title and description, one block on the row inset; its first line sits in a row
    area-approval__title      strong
    area-approval__description  text-sm muted
  area-approval__detail       slot (Code block sm, Diff)
  area-approval__options      rows, 0 apart
    area-approval__option     button: `area-approval__key` (quiet Kbd number, icon slot) + `area-approval__label`;
                              the row plate on hover and focus
    area-approval__instead    the last option row (a label), its field `area-approval__field` the row's text
  area-approval__hint         the last row, text-sm muted: filled Kbd Esc + "to cancel"
```

## Decisions

| Slot · property | Area value | Basis | Reason |
|---|---|---|---|
| shell | Composer's edge, corner, fill and inset | peer: Composer | it takes the composer's place; Claude Code's card radius 8 is its own composer's |
| gap | 6 (ui-cluster at Compact) | Composer's gap | — |
| head | on the row inset; first line in a row: (ui-row − text-md leading) / 2 above the title | inset.css first-line alignment | round 54: the top had half a row less room than the foot |
| title | text-md strong | claude-code bold title | Area's one strong weight |
| description | text-sm muted | claude-code .9em secondary | — |
| options | Menu-row geometry: ui-row tall, row inset, row corner, plate on hover / focus | peer: Menu | Claude Code's ringed buttons read as a list of commands at 256; rows keep them one column |
| number | quiet Kbd sm in the icon slot (icon-sm wide, centred), the label's size, muted, unboxed | claude-code `shortcutNum` (label size, .6); Codex "1." | round 51 |
| instead | the last numbered row, its field unfilled | Claude Code (last option is free text) | a filled field added a third grey (cleanup pass 2026-10-19) |
| hint | the card's last row: ui-row tall, centred, text-sm muted; Esc a filled Kbd sm, ui-cluster from the words | claude-code "Esc to cancel"; Kbd's rule (a key named in a sentence is filled) | rounds 52 and 53 |

## Behavior and accessibility

A `section` named by its title through `aria-labelledby` (a named region); the options sit in a `role="group"` also
labelled by the title (`Approval.tsx`, the options `div`). Options are buttons; ArrowUp / ArrowDown move focus among
them and the field, wrapping; digits 1–9 choose; the digit after the last option focuses the field; Escape calls
`onDismiss`, or chooses the last option when there is none; Enter in the field sends it. For 500 ms after it appears,
Enter, Space, Escape and the digits answer nothing and a keyboard click on a choice is ignored (pointer clicks are not). With `autoFocus` the first option takes
focus when the card appears, so the keyboard answers at once; the Chat view sets it where the card takes the composer's
place. It is off by default, so a page of approvals (the gallery) does not move focus. Each option exposes its digit as
`aria-keyshortcuts`, and the Kbd is hidden from its name ("Yes", not "1Yes").

## Visual pass

Seen in the browser preview on 2026-10-19: the recorded run pauses on it in the Chat view (in the composer's place, under the Plan), and both answers play (3 → the no branch; Enter → the edit); the gallery tiles in light. Fixed then: every tile focused its first option on load (now opt-in `autoFocus`, set by the Chat view), and the Kbd made each option's name "1Yes" (hidden from the name; the digit is `aria-keyshortcuts`).

## Verification

React tests (`packages/react/tests/agent-chat.test.mjs`, 9), the full React suite (495), manifest parity, contracts, app typecheck, playgrounds. In the browser preview (4420), 2026-10-19.

## Feedback log

- 2026-10-18 · built for Phase 2 of the Inspector chat.
- 2026-10-19 · browser check: tiles stole focus → `autoFocus` opt-in; option names read "1Yes" → Kbd hidden, `aria-keyshortcuts`.

- 2026-10-19 · owner, round 49 (rethink): "are the backplate colors correct, are the 1 2 3 and esc using kbd or badges?" → a cleanup pass: every text style, color, gap and inset traced to a reference value or an Area peer, written below.
- 2026-10-19 · owner, round 50 (rethink): "open to using the backplate kbd. should the numbers still be small? what does the research say, what do other products say? im open to the backplates for numbers too just want to make sure they work with backplates on hover, maybe the badges might need a color change on hover too? see if there are other components that would benefit from this, like badges or kbd in menu rows" → round 51 coherence pass (below).
- 2026-10-19 · owner, round 52 (rethink): "the spacing on the bottom doesnt look correct, the esc to cancel looks way too close to the bottom of the container" → round 53 (below).
- 2026-10-19 · owner, round 53 (rethink): "is the padding/margin at the top correct?" → round 54 (below).

## Review note, 2026-10-19

- **What changed:** new: the agent asks before it edits or runs something, in the composer's place: numbered choices (1–9, arrows), Esc to cancel, and a field to say what to do instead.
- **Why:** Phase 3's engine asks before every edit and command (your decision on the plan); Claude Code's and Codex's approval prompts are the model.

## Cleanup pass, 2026-10-19 (owner, round 49)

The agent chat's shared rules (all five families):

| Rule | Value | Basis |
|---|---|---|
| Lines in the transcript | the reply's type (text-md); 4 between a line's parts | Message; Cursor ToolCallLine gap 4 |
| Cards (Edit summary, Plan) | one size, text-sm; sm buttons | Cursor: cards 13 under a 14 reply |
| Card frame | the card edge at stroke-width, container corner, surface fill | Code block |
| Card column | text 12 in: Menu's list padding 4 + the row inset 8 | Menu; Cursor card header 0 12 |
| Card head | one row tall, a rule under it when rows follow; a trailing button (row − control) / 2 from the end | Code block's header |
| Card rows | Menu rows: row height, row inset, row corner, row plate, gap 8 | Menu |
| What a line opens | 4 under the line, on a 1px rail with its content 12 in | Cursor content gap 4; Claude Code's rail at 12 |
| Backplates | one: the row plate under the pointer or focus | Menu |

Answers to the owner's questions. Backplates: the shell is the Composer's (its edge and field fill, correct: it takes
the Composer's place), but three greys sat on it (the Kbd fill 0.949, the soft field 0.976, the row plate 0.964). Now
there is one, the row plate (Menu's). Keys: they were Kbd in its default, filled keycap, which reads as a badge. Inside
a menu row Area draws keys unboxed and muted (the quiet Kbd, Menu's shortcut paint), so the numbers and Esc are quiet
Kbd now; Esc in the hint takes its sentence's type. What to do instead is the last numbered row (Claude Code's) with
its field as the row's text, not a filled input under the list; its number focuses it and the arrows reach it. The
title and description are one block (no gap inside it); the numbers sit in the row's icon slot so every label starts
on one column.

## Keys pressed as it appears (2026-10-19)

Found in the browser check of the chat additions: the approval appeared while a message was being typed, took focus,
and the Enter that was meant to queue the message chose "Yes". For half a second after it appears, Enter, Space,
Escape and the digits answer nothing (a keyboard click on a choice is ignored too), as a system dialog guards its
default button. Pointer clicks are not delayed.

## Review note, 2026-10-19 (round 50)

- **What changed:** the grey keycaps and the grey field are gone: the numbers and Esc are plain muted keys, as menus
  show shortcuts, and "tell it what to do instead" is the last numbered choice. The only grey left is the plate under
  the choice you point at or move to.
- **Why:** you asked whether the backplates were right; they were three slightly different greys on the Composer's
  white. The keys were keyboard keys (Kbd), but drawn as filled keycaps they read as badges.

## Round 51 coherence pass (2026-10-19)

Owner: "should the numbers still be small? what does the research say?" Claude Code draws the shortcut number at the
label's size at 60% ink, unboxed (`.shortcutNum{opacity:.6;padding-right:4px}`, index.css); Codex writes "1." in the
label's type. So the numbers are the label's size in the muted ink, no plate, still in the icon slot so labels align.
On the keycap question: Kbd's filled keycap was an opaque grey equal to a pressed row's plate, so on a hovered or
pressed row it all but vanished; Kbd now uses the translucent mark fill Badge and Count already use (kbd.css), which
holds on any plate. Badges and soft Counts in rows needed nothing (already translucent). The keycap remains a one-line
switch here if the owner prefers it.

## Review note, 2026-10-19 (round 51)

- **What changed:** the numbers are now the same size as the choices, in grey, with no box.
- **Why:** that is how Claude Code and Codex show them. If you would rather have keycaps, they now hold up on a
  hovered row: Area's keycap grey was fixed to be see-through, like badges, everywhere it is used.

## Round 52 (2026-10-19)

Esc in the hint is a filled keycap (Kbd's written rule: a key named in a sentence gets a backplate; the numbers label
rows, so they stay unboxed). Approved in round 51; this follows the owner's question on Kbd.

## Review note, 2026-10-19 (round 52)

- **What changed:** "Esc" in "Esc to cancel" is a keycap again; the numbers stay plain.
- **Why:** Kbd's rule: a key named on its own gets a backplate, a key labelling a row does not.

## Round 53 (2026-10-19)

The hint is the card's last row (owner: "the esc to cancel looks way too close to the bottom of the container"): a row
tall and centred, as the choices are, so the space under it is the shell's inset plus the row's own (its keycap ends
16 from the edge at the gallery's type, where it nearly met the inset before; the title's capitals start about 14 from
the top). Its keycap sits 8 from "to cancel" (Kbd's gap rule).

## Review note, 2026-10-19 (round 53)

- **What changed:** "Esc to cancel" now sits in a full row like the choices, with even room under it, and the key sits
  a little further from its words.
- **Why:** it sat almost on the bottom edge; as a row it matches the choices above it and the space around the title.

## Round 54 (2026-10-19)

The top (owner: "is the padding/margin at the top correct?"): it was not. Every line under the head sat in a row (the
choices, the hint since round 53) but the title started at the shell's inset, so the top had half a row less room than
the bottom. The head's first line now sits in a row too (inset.css, first-line alignment): half of what the row leaves
around the title's line goes above it. Measured at the gallery's type: the title's capitals start 18 from the edge; at
the foot the keycap ends 16 and the hint's baseline 20 from it, so top and foot balance.

## Review note, 2026-10-19 (round 54)

- **What changed:** a little more room above the title, so the top of the card matches the bottom.
- **Why:** the choices and the hint sit in rows; the title did not, so the top was tighter than the foot.
