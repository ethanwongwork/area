# Setup as a chat: type, parts and answer blocks (2026-10-25)

Owner: "i want the left panel to be basically a chat experience ... research chat experiences, what the copy size is,
what all components are used there, and create larger, more consistent ui ... look at cursor, chatgpt, claude. i want
the chat to be different tho in that it should be more simple, more information organized into tables, and containers
that preview visuals or responses, data visualizations, etc. it should still be a vertical scroll chat experience."
References sent with it: Cube/Codex (stat rows in containers), a CTI report agent (an ask card with numbered choices and
a Q/A summary card), "What would you like to do?" (numbered rows, key hints, Submit), Octolane (tables in the answer),
"Add job" (a tile grid in a card), Work Time, an activity heatmap, health tiles, an energy dashboard, a research chat,
an intensity slider and Craft's step cards.

Builds on [inspector-chat-2026-10-18](../inspector-chat-2026-10-18/README.md) (Cursor, Claude Code and Codex, read from
their installed bundles). New here: chat prose sizes and table treatment in ChatGPT and Claude.

## Sources

- **Claude (claude.ai)**: stylesheets read from the signed-out login page in the built-in browser, 2026-10-25
  (`document.styleSheets`; custom properties under `.cds-root`, `.prose`, `[data-cds="UserMessage"]`).
- **ChatGPT desktop / Codex** (`/Applications/ChatGPT.app`, `app.asar` → `webview/assets/*.css`), extracted to the
  scratchpad and grepped; chatgpt.com's signed-out page ships no markdown CSS.
- **Cursor** 3.24: values from the 2026-10-18 research (`cursor.md`).

## Chat type

| Product | Prose | Leading | Small / UI | Code | Source |
|---|---|---|---|---|---|
| Claude | 16 comfortable, 14 compact (15 in the new type scale) | 24 (1.5) | 14 | 12 | `--cds-font-size-prose`, `.font-claude-response-body{font-size:1rem;line-height:1.5}` |
| ChatGPT / Codex | 16 (`--text-base`; Codex panel 13) | 24 (`--font-text-md-line-height:1.5rem`) | 14 (×0.875) | 14 | `--markdown-font-size`, `--markdown-small-font-size` |
| Cursor | 14 conversation, 13 markdown sm | 22 / 18 | 13 | 12 | `--conversation-text-font-size` |
| **Area** | **16 / 24 (`text-md` at type 14; Message's own)** | | 14 (`text-sm`) | | |

A full-width chat reads at 16/24 in both ChatGPT and Claude; Cursor and Codex drop to 13–14 only in a narrow side
panel. Setup's chat is a reading column (440–600), so it stays at 16/24 and its own UI at the default scale.

## Message spacing

- **Block flow**: Claude 0.75em between blocks, ×0.667 after a heading, ×2 after a list or table, headings 1.667–3×
  above (`--_prose-flow`, `--_prose-x-*`); ChatGPT `--markdown-space` = size / 4.
- **User bubble**: Claude radius 24, padding 16 × 12 (comfortable), measure min(85%, 472); ChatGPT/Codex radius 22,
  width 70%.
- **Assistant**: no bubble in all three; Claude insets text 4.

## Tables in a chat

| Product | Frame | Cells | Header | Size |
|---|---|---|---|---|
| Claude | none (border 0, radius 0) | block (0.4375em + 1px) ≈ 8, inline 0, columns 1.5em apart | weight 580, no fill | the prose size |
| ChatGPT / Codex (markdown) | none | td block 2.5 × space (10 at 16), columns 6 × space (24) apart | bottom rule, block 2 × space | max(code, 0.875 × chat) = 14 |
| Codex (data tables) | framed, radius 2xl, header row filled | row rules | `surface-elevated-secondary` fill, sticky | |
| Cursor | a 12-radius card | | | |
| **Area** | **Table's frame (Cursor, Codex's data tables)** | Table md: 8 block, 12 inline | `bg-subtle`, muted | 14 (`ui-size`) |

Tables are scanned, not read, so every product sets them a step below prose (14). Area's Table already does this
(navigation.css: "Primer, OpenAI and shadcn all set tables at 14") and frames itself; in a thread of mixed blocks the
frame keeps a table from running into the prose round it, so Setup uses it as is.

## What a chat is made of (parts in use)

| Part | ChatGPT | Claude | Cursor | Area today |
|---|---|---|---|---|
| Assistant prose | markdown | markdown | markdown | Message |
| User reply | bubble, attachments above | bubble | bordered card | Message `user` |
| Ask / choices | — | numbered choices replacing the composer | Skip / Run row | Approval (numbered), Radio `card` |
| Table | markdown table | markdown table | table card | Table |
| Result card / artifact | canvas card | artifact card | tool card (12 radius) | none |
| Stats | — | — | — | Card + CardValue |
| Progress / plan | "Updated plan" | todo list | todo tray | Plan; Setup's pinned progress |

## What Setup does now

Round 2, same day (owner: "i want the question cards to be shown directly in the chat, aligned with the tables and other
containers, not inside its own container. like this image [Craft's stepped calculator]. focus less on the data vis, just
focus on tables, chat responses, and creating a normal chat experience. the progress can be its own sticky container on
top of the chat"). One shape for every turn (`apps/desktop/src/pages/theme-setup.tsx`, `styles/setup.css`), every part
on the thread's two edges:

1. **Progress**, a framed container held at the top of the chat (chapter bars, "Shape · 9 of 14", time left); the
   thread scrolls under it and fades out in its top 24.
2. **The question**, in the thread with no frame (Craft's step): a 20/28 title, what it decides under it at 16/24
   muted, the choice cards 16 below, each numbered in a keycap; **1–9 pick, Enter continues** (not while typing in a
   field or on a focused button), said in a muted line under the cards.
3. **Answer**: the chosen option as a filled row (Radio `variant="soft" layout="list"`, after Notion Calendar's
   settings and a proposal card's options): the radio first, the answer with its Color swatch, Default or a blue Changed
   badge at the end. Selecting it reopens the question. The welcome's text choice uses the same rows with "14
   questions · 3 min" at the end.
4. **Chapter recap**: a chapter that is not being asked folds into one assistant line ("1 of 3 answers differ from
   Area's defaults") and a Table (Setting · Your choice · Changed / Default; a row reopens its question). Only the
   chapter being asked shows its turns.
5. **Review**: an assistant message and a Table of chapters (Questions, Changed).

Round 1 (earlier the same day) framed the question in an ask card and added charts measured off the drawing (greys and
accent ramps, contrast against AA, type roles, control heights, corners) and stat cards; the owner set the charts aside
for tables and plain chat, so they were removed.

Round 3 (owner: "can you use the actual swatch component for the color blue? why is it circular? ... does accent need an
icon? is it cleaner without an icon"): colour answers show the Inspector's option mark (`optionMark` in
`apps/desktop/src/option-marks.tsx`), Area's Color swatch at 16 painted by the option's own token; the earlier circle was
an app-only span. Chapter headings, the review table and the tracker carry no glyph: the Inspector's groups are named in
words only, and Area has no icon drawn for each setting category (the stand-ins were generic layout and activity
glyphs). A specific set would be about ten new drawings (area-icon-construction) used in the Inspector too; not started.

Round 4 (owner: "after can you build the whole chat/onboarding flow?"): the conversation now has both ends.

1. **Opening:** the welcome asks two things.
   - "What are you making?" first: a workspace, a dashboard, a settings app or a phone app, as option rows with a
     caption each. It picks the product screen the visuals draw and changes no setting, so its answer reads "Preview
     only". Linear, Notion and Framer open their onboarding on what you are making.
   - Then "How thorough should we be?". The two questions sit 24 apart, and the key line shows once, under the last.
2. **Questions,** chapter by chapter, as before.
3. **Finish,** after the last question:
   - "Here's your design system." and the table of chapters;
   - a sentence on how to use it, then the theme itself as a Code block labelled `html` with its copy in the header.
     It holds the `data-area-*` attributes that differ from the defaults, on `<html>`, or a bare `<html>` when nothing
     differs (THEMING.md: settings are attributes on any element);
   - What next, as Prompt suggestions chips: fine-tune in the Inspector, see every component, and answer every detail
     (Essentials only; it opens the first question Essentials skipped).

   The dock at the finish keeps Back and Fine-tune. Copy moved into the Code block and Every detail into the
   suggestions.

Round 5 (2026-10-26):
- **Answers:** past answers are a read-only RadioGroup (no selected edge; the dot and fill say which).
- **Picture questions:** owner: "show answered picture questions as the chosen picture card at a smaller size". They
  answer with the chosen picture card, read-only, a third of the column wide, with its name and Default or Changed.
  Selecting it reopens the question. It replaced the text row the picture answers had fallen back to when their
  thumbnails were dropped.

## Candidates (not built as library components)

- **Ask card**: Approval already has numbered choices; a question with picture choices is likelier an Approval variant
  (choices as cards) than a new family.
- **Pinned progress**: a chat's progress container (Plan's tray, Codex's "Updated plan") held over the thread.

## Open

- Picture replies render one small product screen each; with Every detail (39 questions) a long chapter holds a dozen.
  Fine in Electron so far; if it drags, draw them only once they scroll into view.
- The keycap numbers sit inside each choice's label with `aria-hidden`, so the choice is named "Soft", not "1 Soft"; the
  digit keys are not announced anywhere yet (an `aria-keyshortcuts` on each radio would do it).
