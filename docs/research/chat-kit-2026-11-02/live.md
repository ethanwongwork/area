# ChatGPT and Claude, measured live (2026-11-02)

Read in the owner's Chrome (Claude in Chrome), signed in, on existing conversations only (nothing sent or changed), with
`getComputedStyle` and the pages' own stylesheets. Window 1504 wide (it would not resize: narrow values come from the
products' own CSS rules, and from Claude's chat beside an open artifact, which is narrow on its own).

## ChatGPT (chatgpt.com; its thread is Codex's: the CSS names `--codex-chat-font-size`, `[data-codex-window-type]`)

| Part | Value | Source |
|---|---|---|
| Thread column | 768 (`--thread-content-max-width: 48rem` in a browser window) | `:is([data-codex-window-type="browser"] …)` |
| Other columns | 40rem in the extension's side panel; 42rem, 480, 500 and 100% variants; compact thread `max-width: min(456px, 100%)` | `[data-codex-window-type="extension"] .MarkdownRoot`, `.compactContentWidth` |
| Reading text | 16/26 (`--markdown-line-height: font × 1.625`), weight 400, system font | `.MarkdownRoot` |
| Spacing unit | `--markdown-space: font / 4` (4 at 16); paragraph 0 0 4, a paragraph after a paragraph 16 (`space × 4`), code block margin 20 (`× 5`), table top 16 (`× 4`) | `.MarkdownRoot > .Paragraph + .Paragraph` etc. |
| One component, any size | the host sets `--markdown-host-font-size` (16 web; Codex's chat size in the app) and a text style (`base`, `large`, `small`, `assistant-message`); every gap follows the size | `.MarkdownRoot[data-markdown-text-style]` |
| Headings | h1 24/32 600, margin 0 0 8 (28 after a rule); h2 20/28 600, 16 above, 4 below; h3 18/28 600, 16 / 4; h4 + p no gap | `.Heading` |
| Lists | ul padding-start 26 (one line height), li padding-start 6, 16/26 | `.List`, `.ListItem` |
| Quote | padding 8 0 8 24, 16/24 | `.Blockquote` |
| Rule | 1px black 15%, 28 above and below | `.HorizontalRule` |
| Table | text 14/26 in 16 prose (`--markdown-small-font-size: max(14px, font × .875)`); header 14/16 600, padding 8 24 8 0, under-rule black 15%; cells padding 10 24 10 0, rule black 5%; **no frame, no fill**; tabular numbers | `.Table`, `.TableHeaderCell`, `.TableCell` |
| Wide blocks | tables (`[data-wide-block]`), media, Mermaid and charts may run past the 768 column into the page: `width: fit-content; max-width: max(100%, min(50cqi + 50% − toolbar − margin, (100% + panel max) / 2))`, edges fading 4 × the margin | `.TableContainer[data-wide-block]`, `.MediaWideBlock` |
| Code block | radius 24, fill #fcfcfc, 1px black 5%; header row (language, Copy, a 36 round button); code 12/20 mono, padding 0 20 12; margin 20 | `.Root-…` (code), `.CodeBlock` |
| Inline code | 600 weight, radius 6, padding 1 6, fill black 9% | `.InlineCode` |
| Person's bubble | max 70% (`--user-chat-width`), radius 22, padding 10 16, 16/26, fill #e8f3fe (light blue) on ink #0c274a; compact: `min(456px, 100%)`, margin 12, radius 16; "leading" bubble 100% | `.bubble`, `.compactMessageBubble`, `.leadingBubble` |
| Turns | person's bubble to the reply's first line 40; reply to the next person's bubble: actions 12 under the reply (32 buttons, radius 8, no gap, ink #8f8f8f) then the time and 24 | measured |
| Activity line | "Analyzed": 16/24, ink #5d5d5d, gap 6 to its icon | `group/activity-header` |
| File card | 480 wide, radius 16, 1px black 10%, white; row padding 12 56 12 16, gap 12; name 14/20 500 | resource card |
| Composer | 768, radius 28 (a pill at one line), white, shadow 0 0 0 1 black 4% + 0 2 8 black 4%; 52 tall at one line; 36 round buttons | `.ComposerLayoutRoot` |

## Claude (claude.ai)

| Part | Value | Source |
|---|---|---|
| Transcript | `--transcript-width: 48rem` (768), padding 16 a side (736 of text); column `max-width: calc(48rem + 2.5rem)` with 12 a side | `[data-testid=transcript-list]`, `chat-column` |
| Beside an artifact | the same transcript, 404 of text: side padding 0, the column's 12 kept; **type unchanged** (15/21); bubble `max-width: 85%` | measured with an artifact open |
| Reading text | 15/21 (`--_prose-size .9375rem`, `--_prose-leading 1.3125rem`), Anthropic Serif (the owner's "serif" reply face; `data-reply-face`), 0.9 black ink; paragraphs pad 0 end 56 in the wide column (the actions' room), 3.5 in the narrow | `.standard-markdown` |
| Flow | one unit, `--_prose-flow: 11.25px` (0.75em), multiplied: a heading's space above h1 3×, h2 2.5×, h3 2×, h4–h6 1.667×; after a heading 0.667×; a rule 2×; after a table 2×; inside a list item 0.333× | `.prose` custom properties |
| Headings | h1 and h2 17/24 (`1em + .125rem`), h3–h6 15/21: **headings are the text's size or one step over**, weight carries them | `--_prose-h*-size` |
| Lists | ul padding-start 30 (2em), li padding-start 7.5 (0.5em), the flow above | measured |
| Text inset | `--msg-text-inset: .25rem` (4): text sits 4 in from the blocks (code, tables) and the column's edge, `--msg-block-inset: 0` | `.standard-markdown` |
| Code block | radius 12 (`--msg-block-radius: .5rem + 4px`), border 0.5 black 8%, fill white 50%, padding 14, Anthropic Mono 14/22.75; flow above and below | `.code-block__code` |
| Inline code | 13.5 mono, padding 1 4, radius 4, fill black 5% | `p code` |
| Tables | in `.prose-scroll` (scrolls sideways); a rule after a table is hidden; the next heading 2× flow | rules only (no table in the conversations read) |
| Person's bubble | 616 of 736 (84%) wide, 85% narrow; radius 12; padding 12 16; 15/21 sans; fill black 5% | `[data-testid=user-message]` parent |
| Actions | a 24 row under the reply | `message-actions` |
| Composer | 15/21 sans in the field (the reply's size), send 28 square radius 8 | `chat-input` |
| Question card (narrow, beside an artifact) | docked in the composer's place: the question 14/21; options 14/20 with descriptions 13/17 at 60% ink, padding 6 10, radius 12, the chosen one on a 5% fill with a number key; "Something else" line and Skip; status pill "Asking a question" 12/15 540 | measured |

## What the two agree on

- **The type does not change with the width.** ChatGPT's 16/26 and Claude's 15/21 are the same in a 768 thread, a 456 compact
  thread and a 404 chat beside an artifact. Only the host's chosen chat size (Codex's setting) changes it.
- **Spacing follows the type, not the width**: ChatGPT's unit is a quarter of the size, Claude's is 0.75em; every gap is a
  multiple, so one Markdown component serves every width and every size.
- **What changes with the width**: the column (768 → 456 → panel), its side padding (16 → 0), the person's bubble (70% / 616 →
  85% / `min(456px, 100%)`), and what overflows (tables and media scroll inside the column when narrow, may grow past it
  when wide in ChatGPT).
- **Headings stay small**: Claude one step over the text, ChatGPT 18–24 over 16. A reply is read, not navigated.
- **Frames in a reply**: code blocks are framed (radius 12 / 24); tables are not in ChatGPT (rules only) and scroll in
  Claude; cards (files) are framed, a fixed 480 or the column if narrower.

## Second live pass (2026-11-03): the kit's patterns, confirmed

Owner: "use claude in chrome or claude in desktop just to confirm the live designs of some of these same patterns".
Read in the owner's Chrome, read-only (menus opened and closed, one step list expanded, nothing sent). Computer use was not
enabled for the session, so the two desktop apps (the agent IDE and the coding agent's desktop tab) were not driven; their
values stay the bundle reads in cursor.md, claude-desktop.md and questions.md. The coding agent's web view lists only local
sessions, which do not open on the web; the second product's code-agent page showed no tasks for this account.

| Pattern | Product A (chatgpt.com) | Product B (claude.ai) | Area's kit now | Gap |
|---|---|---|---|---|
| + button | 36 circle, grey plate | 28 square, corner 8 | ghost, pill (Pills › Composer) | matches A |
| + menu width | the composer's (750) | 230, its own | 320 | between |
| + menu row | 36 tall, padding 6 8, corner 12, label 14/20 | 28 tall, padding 4 10, corner 8, 14/20 | 28 rows, 44 with a note | — |
| Row note | on the label's line, muted, 12 after it | none | under the label | A keeps one line a row |
| Icon color | features in full color (image, search, research, sketch, finance, health); utilities grey | all grey | modes in tone ink, utilities grey | matches A's split |
| Extras | none | separators, submenus with chevrons, a shortcut (⌘U), a check on toggles | separator | — |
| Tool step, folded | A: "Analyzed", 16/24, muted grey, icon gap 6 | B: "Searched the web ▸", one line at the reply's size (15/21), 60% ink, no icon, no box | Step group 13, verb default ink, detail muted, icons | B and A fold to one muted line at the reply's size |
| Tool steps, open | — | one card, 8% edge, rows split by hairlines, 14/20; **verb muted, detail in full ink**; a caret per row; no icons | rows unboxed (Step), verb default, detail muted | B inverts the inks and frames the open list |
| Question card | — | in the composer's place; 28 key squares, filled grey, corner 8; the focused option outlined, ⏎ at its end; hairlines between options; "Something else" with a pencil key and a Skip button in its row; × at the head; no footer hint | at the composer; keyed rows; chosen on a grey plate with a check; "Something else" keyed 4; "Esc to skip" hint and Skip in the footer; "1 of 3" | B's keys larger, hairlines, Skip inside the free row, × close |
