# Shortcut list spec

**Captures:** `docs/research/captures/shortcut-list/`, `kbd/figma--shortcut-panel-*`
**Peers:** Kbd (the keys), Description list justified (a name at the start, a value at the end), Dialog, Popover and
Panel (the surfaces it sits in), Menu (string shortcuts in rows)

## Owner decisions

- 2026-10-10: "proceed with your suggestions and keep building" → the keyboard shortcuts sheet, from the inventory's
  "Shared and small" list ("KeyboardShortcut overlay (a sheet of Kbd groups)"), after Search field.
- 2026-10-10: "go with your recommendations" → keycaps by default (quiet stays an option); groups 32 apart.

## Job and boundaries

A shortcut list teaches the keyboard: one row per command, what it does at the start and its keys at the end, under an
optional group title. Several lists stack into a sheet inside a Dialog ("Keyboard shortcuts"), a Popover or a Panel.
Not a Menu (its rows run commands; a menu's shortcut is a hint beside an action), not Kbd itself (one chord), not a key
binding editor (ChatGPT's sheet lets you rebind and switch shortcuts off; that is a settings form).

## Variants

| Axis | Value | Justification | Where it appears |
|---|---|---|---|
| keys | keycaps (default), quiet | A sheet's job is the keys: Figma boxes each one; ChatGPT sets them as muted text | Figma Help › Keyboard shortcuts; ChatGPT ⌘/ |
| content | title or none; one chord, alternatives, or a custom shortcut (a KbdGroup sequence) | ChatGPT's "Delete chat" has two combinations; GitHub-style sequences (G then H) | ChatGPT |

Excluded: the editable binding button and on/off switch (ChatGPT's settings), Figma's keyboard-map illustration, search
within the sheet (a Search field above the lists does it).

## Sources

| Id | Type | What | Link / commit / path | License | Captures |
|---|---|---|---|---|---|
| chatgpt | target product | Keyboard shortcuts dialog (⌘/): title, a line, groups ("Composer", "Chat", "App") of rows with a switch, a name and the keys | chatgpt.com, 2026-10-10, read-only (nothing inside was clicked; the bindings are editable) | evidence only | `chatgpt--shortcuts-group`, `chatgpt--shortcuts-group-alternates`, `chatgpt--shortcuts-dialog` |
| figma | target product | Help › Keyboard shortcuts panel: a table of name and key bindings, each key an outlined box | figma.com editor, 2026-09-28 (Kbd pass) | evidence only | `kbd/figma--shortcut-panel-binding`, `kbd/figma--shortcut-panel-key` |
| notion | target product | not found: the help button was not rendered with Chrome's window hidden; Notion's shortcut list is a help-centre page | app.notion.com, 2026-10-10 | — | — |
| area | this system | Every static gallery tile at 1:1 | the built gallery | — | `area--*` (4) |

## Anatomy

```
chatgpt  section
           h3 (600 × 28, 2 24 padding, 14/24 500 rgb 93, sticky on the dialog's #fc)
           ul (12 side padding)
             li (border-bottom 1px black 5%)
               div (52: 8 12 8 16 padding, gap 8): switch 32 × 20 · label 14/20 400 · span > button (36 pill, 0 12, 14/18 rgb 93)
figma    tr: td name · td.keyBindings (right-aligned): span (gap 3) > span 32 × 31 per key, 1px 70% white edge, radius 2

area     section.area-shortcut-list[.--quiet][aria-labelledby → title]
           h3.area-shortcut-list__title           UI type 500, muted, 4 above and below (28)
           dl.area-shortcut-list__items
             div.area-shortcut-list__item          min 36 (UI row + 4; 28 compact), name and keys 24 apart, a divider under all but the last
               dt.area-shortcut-list__label        UI type 400, default ink
               dd.area-shortcut-list__keys         Kbd md (keycap) or quiet; alternatives 8 apart with "or" for screen readers
```

The list has no side inset: the surface around it owns the content inset, so the names line up with the Dialog's title.

## Measurements

`node scripts/capture-compare.mjs --slots shell,heading,row,label,keys` (trimmed):

| slot · property | chatgpt · group | area · default | area · quiet |
|---|---|---|---|
| **heading** size / padding | 600 × 28 / 2 24 | 384 × 28 / 4 0 | 384 × 28 / 4 0 |
| **heading** type | 14/24 500 rgb(93) | 14/20 500 rgb(102) | 14/20 500 rgb(102) |
| **row** height | 53 (52 + rule; the 36 binding pill sets it) | 36 | 36 |
| **row** rule | 1px black 5% | 1px `border-divider` | 1px `border-divider` |
| **label** type | 14/20 400 rgb(13) | 14/20 400 rgb(40) | 14/20 400 rgb(40) |
| **label** start from the row | 56 (after a 32 switch) | 0 | 0 |
| **keys** box | 62.64 × 36 pill (the editable button) | Kbd md, 20 tall, radius 6, #ee | quiet Kbd, 16 line |
| **keys** type | 14/18 400 rgb(93) | 12 500 keyboard face, rgb(102) | 12/16 400 Geist, rgb(102) |
| **groups** apart | 32 | 32 | 32 |

## Decisions

| Slot · property | Area value | Basis | Reason when it differs from the basis |
|---|---|---|---|
| row | name at the start, keys at the end, 24 apart, min 36 (UI row + 4; 28 compact) | ChatGPT rows 8 / 20 / 8 without its 36 binding pill; Figma's table; peer Description list justified (24) | — |
| rule | 1px `border-divider` under each row but the last, the row's width | ChatGPT 1px black 5%; peer Description list, Table | Area's divider role rather than 5% black |
| side inset | none: the surface's content inset | Peer Dialog, Popover, Panel own their inset | ChatGPT's rows add 12 / 16 inside a 12-padded list that bleeds to its dialog's edge; Area's text lines up with the dialog title instead |
| title | UI type 500, muted ink, 4 above and below (28), no inset | ChatGPT 14 500 secondary, 28 tall | ChatGPT's 24 line box; Area's UI leading is 20 |
| label | UI type 400, default ink | ChatGPT | — |
| keys · default | Kbd md keycaps, muted ink | Figma (a box per key); Kbd's standalone size | ChatGPT shows text, because its keys are an editable button |
| keys · quiet | Kbd quiet: 12/16 UI font, muted | ChatGPT's text keys; Kbd's quiet (as Menu's shortcuts) | ChatGPT 14/18; Kbd's quiet size is kept so a sheet and a menu set shortcuts alike |
| alternatives | separate Kbds 8 apart, "or" between them for screen readers | ChatGPT's "Delete chat" (two buttons) | — |
| groups | stacked lists 32 apart | ChatGPT 32 | — |
| semantics | `section` named by its title; `dl` of `dt` name and `dd` keys | HTML description list for name-value pairs | ChatGPT uses `ul` / `li` with labels for its controls |

## States

None: a reference sheet. Keys are not interactive.

## Behavior and accessibility

The group title names the section (`aria-labelledby`); without a title, pass `aria-label`. Each row is a `dt` / `dd` pair.
Kbd reads its chord in words ("Command plus K"); alternatives are joined with "or". The page binds the keys; the list only
shows them. In a Dialog, focus, Escape and scrolling are Dialog's.

## Peers and consistency

| Peer | Shared role | Area value in peer | This component | Match |
|---|---|---|---|---|
| Kbd | keys | md keycap, quiet | the same, unchanged | match |
| Description list justified | name / value row | 24 apart, divider role | 24 apart, divider role (full row width; Description list insets its rule by the row padding, which this list does not have) | match |
| Dialog | inset | 16 content inset | no inset of its own | match: names line up with the title |

## Visual pass

Gallery and the dialog tile at 1:1, light default, dark compact: names line up with the dialog title; keycaps end each
row on the content edge; rows 36 (28 compact); the 32 between groups reads as a section break. Changed during the pass: the
list first inset its rows 12 (ChatGPT's), which put the names 12 right of the dialog title; the inset was removed.

## Verification

- 7 captures (3 ChatGPT, redacted, read-only; 4 Area); Figma's from the Kbd pass. Checksums verified.
- `npm run build`, `build:docs`, `typecheck`, `test:contracts`, `shortcut-list.test.mjs` (2).
- In the gallery: the dialog tile opens, Escape closes it; dark and compact checked.
- Unverified: screen reader output (the "or" between alternatives), RTL, Notion (not found).

## Open questions

Resolved 2026-10-10 (owner: "go with your recommendations"); kept for the record.

1. Keys as keycaps by default (Figma) or as quiet text (ChatGPT)? Recommendation: keycaps; a sheet exists to show keys.
2. The group gap (32, ChatGPT's) reads as a section break in a short dialog. Recommendation: keep ChatGPT's 32.

## Review note, 2026-10-10

- **What changed:** New component. Shortcut list is a sheet of keyboard shortcuts: what each command does on the left,
  its keys on the right, under a small group title, with lines between rows. Put several in a dialog for a "Keyboard
  shortcuts" screen.
- **Why:** It was next on the list after Search field. The rows follow ChatGPT's keyboard shortcuts dialog and Figma's
  shortcuts panel; the keys are Area's Kbd keycaps, and the names line up with the dialog's title.

## Lines (current, 2026-10-25)

`divided` (boolean, off by default): a rule under each row but the last, in `border-decorative`. Without it the rows' height separates them. Was always on, in `border-divider`. Tile Divided. This supersedes any older line value below (owner 2026-10-25: "Build everything as proposed on the dividers page, removing the footer line but keeping the line under the Command palette's search" (comparison https://claude.ai/artifact/3Fc3sXEgfKJmHEf2arA9hE; docs/research/dividers-2026-10-25)).

Spacing without rules (2026-10-26): rows take the plain UI row (32, compact 28); `divided` keeps the 36 around its rules.

## Feedback log

- 2026-10-26 · owner: "the spacing/gaps for the components without the divider now look a bit off, can you refine them and make sure the spacing is intentional" → Spacing without rules (2026-10-26): rows take the plain UI row (32, compact 28); `divided` keeps the 36 around its rules. Rule: DESIGN_SYSTEM.md, Lines, "Space replaces the line".

- 2026-10-25 · owner 2026-10-25: "Build everything as proposed on the dividers page, removing the footer line but keeping the line under the Command palette's search" (comparison https://claude.ai/artifact/3Fc3sXEgfKJmHEf2arA9hE; docs/research/dividers-2026-10-25) → `divided` (boolean, off by default): a rule under each row but the last, in `border-decorative`. Without it the rows' height separates them. Was always on, in `border-divider`. Tile Divided.

- 2026-10-10 · owner: "proceed with your suggestions and keep building" → Shortcut list from ChatGPT's Keyboard shortcuts
  dialog and Figma's Help › Keyboard shortcuts; 5 gallery tiles, in review.
- 2026-10-10 · owner: "go with your recommendations" → open questions 1–2 resolved as recommended; no change.
- 2026-10-11 · owner, review round 7: approved.
- 2026-10-12 · consistency pass (owner: "a consistency and cohesion pass on all the components ... stroke values and how they are used") → the row rules are at `stroke-width`, as Table's (were `border-width`) (shortcut-list.css). (docs/research/consistency-audit-2026-10-12.md)

## Review note, 2026-10-22 (round 68, keys)

- **What changed:** the `quiet` option no longer sets keys as text: every list shows keycaps, and the quiet tile is gone.
- **Why:** your note that every Kbd should have its backplate, for one look everywhere (docs/specs/kbd.md, "When a key has a backplate").

## Review note, 2026-10-26

- **What changed:** Rows have no line by default. `divided` turns a light line back on (new Divided tile).
- **Why:** you asked for dividers only where they are needed and intended, and for the ones that stay to be very
  light. You approved each one on the dividers comparison page.
