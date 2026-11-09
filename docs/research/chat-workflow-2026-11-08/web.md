# Chat workflow study: web references measured 2026-11-08 (light, 1504 × 766, Chrome)

ChatGPT (chatgpt.com), composer captured with apps/docs/public/area-capture.js (minified copy pasted; the page's CSP blocks
loading it from localhost); everything else read with getComputedStyle per element. Nothing sent; drafts typed and cleared.

## ChatGPT
- Composer, empty: 768 × 52, radius 26 (pill), padding 8, gap 8, white, shadow 0 0 0 1 rgba(0,0,0,.04) + 0 2 8 rgba(0,0,0,.04) + 0 4 80 8 rgba(0,0,0,.024).
  Buttons 36 circles, icons 20; "Think" pill 92 × 36 (padding 0 14 0 12); send 36, filled blue rgb(44,103,197).
  Editor 16/26.
- Long draft: turns stacked (text above, tools row under), radius 28, editor grows to 182 (7 lines × 26) then scrolls;
  an Expand button (32) top right; expanded, the composer fills the column (768 × 583 in a 766 window, editor 511).
  Collapse returns it.
- + menu: drops under the composer at its width (768), radius 20, padding 8; rows 36, radius 12, padding 6 8, gap 12,
  label 14/20 then a muted description on the same line (rgb 143). Items: Add photos & files (Upload from computer),
  Add from library (Browse and search your files), Create image (Visualize anything), Web search (Find real-time news and
  info), Work in a project (Start a chat in a project), Deep research (Get a detailed report), Sketch (Draw and attach an
  image), Thinking (For detailed answers), plus apps. Some icons in colour.
- Messages: user bubble right, max 70%, padding 10 16, radius 22, light blue rgb(232,243,254), 16/24. Its actions on
  hover: Copy message, Share prompt, Edit message (32 buttons, gap 8).
- Reply: column 768, 16/26, paragraphs 16 apart, h2 18/28 600 with 24 above; a tinted block 12 padding radius 12
  rgb(241,239,234); tables 14/26, th 8 24 8 0, no rules painted on cells.
- Reply actions (always shown on the last): Copy, Good, Bad, Read aloud, Share, More (32 each). More: the time as a
  header, Regenerate response (submenu), View sources, Branch in new chat.
- Select text in a reply: a floating "Ask ChatGPT" (100 × 28) quotes the selection into the composer.
- Not measurable without sending: clarifying questions, A/B "which response do you prefer", image generation picks.

## Claude (claude.ai)
- Composer, new chat: 656 wide, radius 14, padding 8, white; shadow 0 4 20 rgba(0,0,0,.075) + 0 0 0 1 rgba(0,0,0,.12).
  Input 15/21 on top, scroller max-height 384 then scrolls (no expand control). Buttons 28, radius 8: Add (+), Dictate,
  Send, Voice. Under the composer, outside it: Project, Model "Sonnet 5.5 High", Auto (28 tall, 14).
- Reply composer: one line 768 × 44, radius 14, padding 8; tools row under it.
- + menu: 232 wide, radius 14; rows 28, padding 4 10, radius 8, gap 8, 14/20 weight 435. Items: Upload or add files ⌘U,
  Skills ›, Connectors ›, Design system › (Manage design systems, New design system), Add plugins, Devices ›, Research,
  Memory ✓.
- Messages: user bubble grey 5% ink, padding 12 16, radius 12, 15/21. Reply 15/21 serif, column 736 with 4 / 56 sides.
  Actions on hover ("Show message actions"): Copy, Read aloud, Good, Bad, Retry (24 each).
- Tool use folds to one muted line in the reply: "Searched the web, read a page" (row 28, padding 3.5 6, radius 8, text
  60% ink); opens to the steps.
- A reply can end with a question back in prose that narrows the next step (seen in a past conversation; content not recorded).
- Question widget and previews: measured earlier, docs/research/chat-kit-2026-11-02/questions.md.
