# Vertical rhythm: type, line height and text spacing (2026-10-30)

The owner asked for a vertical spacing audit of the app (text size, line height, visual balance) with Cursor's and
Claude's chat as references, and for Area's own rules to come out of it, not a copy of either product. Audit page:
https://claude.ai/artifact/Ai15EUzS46xKra4ZqjzMsj.

## What was measured

- **Area**, live: the desktop app's browser preview at 1440 × 900, DPR 2, light, shipped defaults (type 13, density 32).
  Home, Components › Button, the Inspector's Chat (a recorded run), Patterns › Chat in the Inspector, Setup.
  `type-rhythm.js` (this folder) reads each text block's size, line height and weight and the space from the block above,
  baseline to cap and box to box; `area-ui-review`'s layout audit read insets and gaps.
- **Cursor 3.27.22** and **Claude 3.6556.2**, from their installed bundles: `cursor-chat-rhythm.md`, `claude-chat-rhythm.md`
  (every value quoted from a CSS or JS string).

## Findings

| Part | Area | Cursor (Agents window) | Claude (Code tab) |
|---|---|---|---|
| Chat prose | 15/22 (1.47) | 15/24 (1.6) | 16/24 (1.5) |
| Between paragraphs (box) | 16 | 16 | 12 |
| Above / below a heading | 16 / 16 | 22 / 4 | 24 / 8 |
| Before / after a list | 16 / 16 | 8 / 18 | 12 / 24 |
| Before the person's message / to the reply / between a reply's blocks | 16 / 16 / 16 | 14 / 14 / 14 | 24 / 8 / 20 |
| Title → subtitle, baseline to cap | 8 (trimmed, 13 over 13) | 10.8 (13 over 13, 2 between boxes) | page header 24 over 14, 8 between boxes |

- Area's leadings are one per size (`LEADING`), tuned for UI rows; long prose runs on the same tight lines.
- Chat headings sit halfway between sections; lists are spaced the same on both sides; every turn is the same 16.
- Section headings already follow Area's joined-pair rule: 13/18 over 13/18 with no gap between line boxes is 8.8 baseline
  to cap in Geist; SectionHeading measures 8. A first draft proposed 4 (by comparing Area's trimmed gap with Cursor's
  box gap); that collided with the subtitle's own lines and was withdrawn.
- Pages mix title sizes: Home's New system cards (Card title 15/22 among 13/18 tile names), Setup's panel title 15/22
  against the Inspector's 13/18 headings.

## Rules derived (built 2026-10-30; `DESIGN_SYSTEM.md` › Size and shape, `area-ui-compose` › spacing.md)

| Rule | Derivation |
|---|---|
| Prose leading = the first value on the 2px leading ramp at or above 1.5 × size (13/20, 15/24) | WCAG 1.4.8 (line spacing 1.5 within paragraphs) and 1.4.12; Area's own 2px leading ramp |
| Paragraphs about two-thirds of a prose line apart (16 at 15/24, 12 at 13/20) | the spacing ramp; baseline to baseline 1.6 to 1.7 lines, past 1.4.8's paragraph spacing |
| Headings: the prose gap plus 8 above, 8 below | spacing.md "headings carry their space above"; the ladder 2 · 4 · 6 · 8 · 12 · 16 · 24 |
| Lists: items 4, lead-in 8, the paragraph gap after | DESIGN_SYSTEM.md Text pairs (a text above a set is one step past the set's items) |
| Conversation: blocks 16, reply 12, exchange 24 | spacing.md rule 2 (each ring larger than the one inside it): group 12, section 24 |
| Compare gaps baseline to cap | the measuring error above |

## Built (2026-10-30)

- Tokens: `text-sm-prose-leading`, `text-md-prose-leading`, `text-sm-prose-gap`, `text-md-prose-gap` on the type axis
  (`proseLeading`, `proseGap` in `axes/type-size.ts`; values tested at every type size). Named prose, not reading:
  "reading" is already text-md's name, the size.
- Message (`message.css`): its text on the prose line; blocks the prose gap apart; a heading the gap plus 8 above and 8
  below; a list 8 under its lead-in, items 4 apart. Its parts keep their own lines (`cohesion.test.mjs`).
- The app's chat (`styles/chat.css`, `src/chat/chat.tsx`): a new exchange 24, the person's message to its reply 12,
  a time joins its message (8).
- Measured in the app after the change (type 13, 1440 wide): bubble and prose 15/24, steps 15/22 four apart, heading 24
  above and 8 below, a list 8 under it, items 4, the table 16 after it, reply 12, new exchange 24; light and dark.

Open, for the owner: diff text (11/17; Cursor 12, Claude 14; 12 is not on Area's ramp), and one title size per page
(Home's New system cards, Setup's panel title).
