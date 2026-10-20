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
| height | scrolls past 320 | Codex 320, Cursor 342, Claude Code list 300 | the middle value |
| surface, rows | Menu's: floating frame and lift, padding 4, ui-row rows, row inset, plate | Menu (peer); Cursor rows 24, padding 3 × 4, radius 8 | one menu in Area |
| path | Menu's shortcut ink and size at the row's end; cut from its start; gives way before the name | Claude Code: right-aligned, RTL ellipsis at .4; Cursor trailing text max 180 | — |
| groups | Menu's section label | Cursor section headers; Claude Code section header | — |
| empty | one muted row: "No files found", "No matching commands" | Claude Code's wording | — |

## Feedback log

- 2026-10-19 · built. Browser check: the path's RTL direction flipped its auto margin; the name now grows instead, and
  the path shrinks first.

## Review note, 2026-10-19

- **What changed:** new: typing @ or / in the composer opens a list above it (files with their folder, or commands);
  arrows move, Enter picks, Esc closes.
- **Why:** all three agent apps have it; it is Area's Menu, placed above the composer.
