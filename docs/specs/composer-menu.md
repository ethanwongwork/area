# Composer menu spec

**Captures:** none live. Evidence: `docs/research/inspector-chat-2026-10-18/composer-additions.md`, section C.
**Peers:** Menu (surface, padding, rows, plate, section labels: reused as is), Combobox (the listbox pattern), Composer

## Job and boundaries

The @ and / suggestions: a list above the Composer, at its width, filtered by what follows the @ or /. The field keeps
focus and drives it (arrows, Enter or Tab to pick, Esc to close), naming the highlighted row with
aria-activedescendant. What a pick does (insert a context chip, run a command) belongs to the app. A full command
palette (⌘K) is Command palette.

## Sources

Cursor `ComposerSlashMenuList.js`, `ComposerSlashMenu.js`, `Menu.stylex.js`; Claude Code `.menuPopup`, `.commandItem`,
`.fileDirectory`; Codex suggestion menu. Citations in the evidence file.

## Decisions

| Slot | Area | Basis | Differs because |
|---|---|---|---|
| placement | above the composer, its full width, 8 over it | all three open upward; Claude Code bottom 100%, left/right 0, margin 8 | — |
| height | scrolls past 320 (`--_menu-max`) | Codex 320, Cursor 342, Claude Code list 300 | the middle value |
| surface, rows | Menu's: floating frame and lift, padding 4, ui-row rows, row inset, plate | Menu (peer); Cursor rows 24, padding 3 × 4, radius 8 | one menu in Area |
| path | Menu's shortcut ink and size at the row's end, at most 60% of the row (`--_path-max`, a pick); cut from its start; gives way before the name | Claude Code: right-aligned, RTL ellipsis at .4; Cursor trailing text max 180 | — |
| groups | Menu's section label | Cursor section headers; Claude Code section header | — |
| empty | one muted row, a row tall, at the text inset ((ui-row − 1cap) / 2), in the rows' type (ui-size, text-base): "No files found", "No matching commands" | Claude Code's wording; Combobox and Command palette's empty row (DESIGN_SYSTEM.md, List rows) | was the row inset (audit 2026-10-19); took the composer's text-lg until the chat set review (2026-10-28) |

API: the list is named by `aria-label`; its rows come in `items` (groups of `{ label?, items }`). `label` and `groups`
stay as deprecated aliases for one release; `aria-label` and `items` win.

## Feedback log

- 2026-10-19 · built. Browser check: the path's RTL direction flipped its auto margin; the name now grows instead, and
  the path shrinks first.
- 2026-10-19 · audit: the empty row at the text inset (Combobox's); `label` → `aria-label` and `groups` → `items`
  (deprecated aliases kept); the 320 and 60% literals moved into `/* spec */` properties.
- 2026-10-28 · chat set review (https://claude.ai/artifact/3ZRgoiUPiX6kkQxgt1MJTw): "No matches" was 15/22, inheriting
  the composer's text-lg, while the rows are 13/18 → the empty row takes the rows' type (ui-size), as Combobox's. The
  group label stays on Menu's icon column (14), 1px from the composer's text below it (owner: keep Menu's rule).

## Review note, 2026-10-19

- **What changed:** new: typing @ or / in the composer opens a list above it (files with their folder, or commands);
  arrows move, Enter picks, Esc closes.
- **Why:** all three agent apps have it; it is Area's Menu, placed above the composer.

## Review note, 2026-10-19 (round 55, design-system audit)

- **What changed:** The "no results" row starts where the row text starts, as Combobox's and Command palette's do. `groups` is now `items` and `label` is `aria-label` (the old names still work).
- **Why:** DESIGN_SYSTEM.md asks for one empty row everywhere; the API takes the shared names.

## Review note, 2026-10-28 (chat set review)

- **What changed:** "No matches" is the size of the menu's rows (13/18). It was the composer's 15/22, so the menu grew
  when the last match went.
- **Why:** Found measuring the chat set together; Combobox's empty row already takes the rows' size.
