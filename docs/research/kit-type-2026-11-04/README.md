# Type and rhythm in the Feed kit and the Chat kit (2026-11-04)

Owner: "do an entire thorough pass on the type styles, visual balance, spacing consistency, and proper alignment, gaps,
etc across everything in the chat kit and feed kit. be extra careful about defining when each size of the type ramp is
used, as well as when to change the foreground or weight, and the spacing rhythm between text. make sure to define chat
kit and feed kit independently. research cursor, claude code, chatgpt."

The rules this produced are in `docs/PRODUCT_UI.md`, "Type and rhythm in the kits". This folder holds the evidence:

- [products.md](products.md): Cursor 3.27 and the Claude desktop app read from their bundles (ink tiers, weights, sizes
  by role outside markdown, vertical rhythm between text pairs; usage counts over 855 Cursor `Text` calls and 17,858
  Claude class strings). ChatGPT's and Claude's reply type are in `../chat-kit-2026-11-02/live.md`.
- `census.mjs` (run with `drive.mjs` against the Electron window, `--remote-debugging-port`): every element with its own
  text in Labs › Feed and Labs › Chat, grouped by size / line, weight and ink, with the component that drew it.
- The layout audit (`.claude/skills/area-ui-review/scripts/layout-audit.js`) per section, for the gaps the kits set.

## What the census found (type 13, light)

Feed: 55 styles, of which the type specimens (the ramp, the styles, the tester: 18) show the ramp on purpose. Chat: 30.
Everything else sits on the ramp:

| Style | Feed | Chat | Roles |
|---|---|---|---|
| 13/18 400 default | 193 | 76 | card names, choices, chips, data names, slider labels, a step's detail |
| 13/18 400 muted | 53 | 47 | descriptions, a step's verb, a plan's text, a code block's language, an approval's hint |
| 13/20 400 default / muted | 90 / 199 | 19 / 39 | md Table cells (prose line), table headers muted |
| 13/18 500 default | 55 | 45 | questions, timeline actors, people's names, buttons, an empty state's title |
| 16/22 500 default | 83 | 17 | section titles (57 / 14), Card titles (23 / 1), a reply's headings |
| 15/22 400 default | 18 | 22 | a reply's text, the person's bubble, the feed's prose and lists |
| 12/18 400 muted | 23 | 17 | metadata on a row's line (times, step meta, a plan's count), section ledes |
| 12/16 400 muted | 3 | 2 | a timestamp, an empty state's description, an activity's lines |
| 11/14 500 tone | 72 | 3 | badges |
| 11/14 400 muted mono | 61 | 5 | data labels, keys, ticks |
| 11/10 500 muted | 54 | 27 | Kbd keys |
| 26/30 400 default | 8 | — | stat figures |

Ink names are resolved at the page root; inside the cards' scope the same muted token resolves one step darker
(`oklch(0.496 …)` in the raw files), which is the cards' own scope, not another ink.

## Findings, and what changed

| # | Finding | Rule it breaks | Done |
|---|---|---|---|
| 1 | Visual questions: the question card took the Composer's corner (22) beside its frame's 16, and the frame's name started 16 in where the question's title starts 13 in | one family; one text column | Approval `--area-approval-corner`; the unit sets both cards to the feed's corner and the name inset to 13 |
| 2 | Four pictured answers in a 456 question: 96 cells, labels broken inside a word ("Workspac e"), a Default badge wrapped under its label | one line a label | pictures two by two under 600; a picture's label one line with an ellipsis; Default stays on the label's line |
| 3 | Pictures at 3:2 | one card, three shapes (1:1, 4:3, 16:9) | corners 4:3, typefaces 16:9, screens 16:9 |
| 4 | Answers that aren't a press ended on "Esc to skip", the others on "Something else … Skip" | one foot for every kind | every kind ends on the words row with Skip; Continue under it where needed |
| 5 | Before shown where no answer changes a setting | a control does something | Before only where an answer changes a setting |
| 6 | Room's middle step read "Default Default" | — | Tighter / Balanced / Roomier |
| 7 | An activity log's day label at 500 in the muted ink | weight rises only with the default ink | regular |
| 8 | The feed's list opened 21 under its title (the first line's half-leading) | a title 16 over its block | first line trimmed to its cap |
| 9 | Card titles in data views are the section title's size | the header outranks its rows | applied (Q-T1): Card title hooks, the feed's frames at 13/18 500 |
| 10 | A section that opens with a component's text (a message, a step, a timeline) starts 19–21 under its title | a title 16 over its block | applied (Q-T2): 15.7–16 after; see DESIGN_SYSTEM "read on its glyphs" |
| 11 | A collection's images read 33 under its title | a title 16 over its block | withdrawn: the frame and edge sit 16 under it, the pictures 8 inside (checked with the pictures hidden) |

Heading → block reads 14.7 where the title carries a Count: the Count overhangs the title's line by design
(tile.tsx FeedCount), so the block is 16 under the title's own baseline.
