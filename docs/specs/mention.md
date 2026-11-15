# Mention spec

**Captures:** none taken; the evidence is bundle reads and Help Center pages in
`docs/research/components-audit-2026-11-07/` (chat-apps.md, cursor.md, notion.md, primer.md)
**Peers:** Link (type, ink, underline, focus ring, the external mark's slot), Count soft and Badge soft (the mark plate),
Tag (the Tags stroke group's edge), Avatar (a person's picture), Composer menu (the @ list that inserts one), Message
(where a sent one is read)

## Owner decisions

- 2026-11-07: components audit, "Take all recs": N3 Mention is built, with an @ trigger in the Composer's menu (review
  page St7jcEipvPoa3GvSwnAvBT).

## Job and boundaries

Mention refers to a person, a file, a page or a date inside running text: a message, a comment, a document. It keeps
the sentence's type and ink, carries the kind's mark, and wraps with the line. It may be a link (`href`) or a button
(`onClick`, a person's card or a date's picker). It is not Link, which is words that go somewhere with no person,
file or date behind them; not Chip `input` or Attachment, which sit in the Composer's context row as what the next
message is about; not Avatar, which shows who someone is on its own; not Tag or Badge, which label. It does not find
people or files (the app's list does, through the Composer menu), open a card, or edit a date.

Intake gates:

- **Useful.** A chat app draws mentions of people, files, apps and pages in text and the composer
  (`._Mention_1wujo_2[data-appearance=pill|underlined-text]`, chat-apps.md "Mention"); an editor draws mention chips in
  its prompt input (`MentionChip.js`: a 12 icon slot, 4 to the label, cursor.md "Composer"); a notes app has person,
  page and date mentions, a date turning red on its day or when past due (notion.md); Primer's inline autocomplete
  inserts @mentions in any text field (primer.md).
- **Unique.** Link has no kind, no mark per kind, no plate and no due state; Chip `input` is a removable control outside
  the text, not words inside it.
- **Composable.** Link's line and focus ring, the Tags group's edge, the mark plate (`bg-mark`), the danger ink, the
  Composer menu for picking.
- **Consistent.** Its plate is the neutral soft marks' plate (DESIGN_SYSTEM.md: Badge soft, Chip input, Count soft), its
  line Link's, its mark slot Link's external mark's.
- **Worth maintaining.** One state (due), a link and a button form, one helper (`withMentions`). Not built: a person's
  hover card, a page's backlinks, a status dot on a file (the editor's), a selection pill (the chat app's
  `selection-pill` layout), and rich-text editing of a mention inside the Composer (the Composer is a native textarea).

## Variants

| Axis | Value | Justification | Where it appears (source / product) |
|---|---|---|---|
| variant | soft (default) | A pill on the mark plate: a mention reads as one thing in a sentence | The chat app's `data-appearance=pill` (padding 2 / 6, `--radius-full`, `--alpha-08`); the editor's chips |
| variant | plain | The mark and the words only, for text with many mentions close together | The notes app's page mentions (an icon and the title) |
| variant | underline | Link's line, always: a page reference in prose | The chat app's `data-appearance=underlined-text` |
| kind | person (default), file, page, date | Sets the default mark; the kinds paint alike | The chat app (person, file, app, page), the notes app (person, page, date), the editor (files) |
| due | boolean | A date that has come or passed | The notes app: "Inline reminders turn red when they change to @Today or are past due" |
| icon | slot | A person's picture, a team's icon, a file's type, a page's own icon | The editor's icon slot; the notes app's page icons |

Named per Governance § 4: the treatment axis is `variant`, with `soft` and `plain` from the shared values and one new
value, `underline` (recorded in the vocabulary table). "Chip" was the proposal's word for the pill; Area's word for the
plate is `soft`, and Chip is a family of its own. Excluded: the chat app's tones (`subtle-accent`, `composer-reference`,
`file-reference`; Area keeps the sentence's ink, below) and layouts (`selection-pill`, `wrapped-label`).

## Anatomy

```
root     span | a[href] | button  .area-mention   owns: the sentence's font and ink, inline; soft: plate, edge, pill
                                                  corner, padding 2 / 6, the plate cloned onto each line; underline:
                                                  Link's line; hover and focus on a link or button
  icon   span[aria-hidden]  .area-mention__icon  owns: the xs icon slot (12), 4 before the words, centred on the cap
                                                  height; a picture fills it as a circle
  label  span  .area-mention__label              owns: the words, inline, wrapping; a date's in <time dateTime>
  (sr)   span.area-sr-only                       ", Due" after a due date
```

Inset, soft: 0 border (the edge is an inset shadow) + 2 / 6 padding (the chat app's pill) → the mark; the mark's 12 slot
+ 4 gap → the words.

## Decisions

| Slot · property | Area value | Basis | Reason when it differs from the basis |
|---|---|---|---|
| type | inherits the sentence's | Link | A reference is read with its sentence |
| ink | inherits the sentence's | Link inline | The chat app mixes its info ink 80 / 20 with the text; Area keeps colour for links and status (one role, one paint) |
| soft plate | `bg-mark`, hover `bg-mark-hover` (a link or button) | the chat app's `--alpha-08`; DESIGN_SYSTEM.md, neutral soft marks | The shared translucent plate, so it shows on a hovered or selected row |
| soft edge | the Tags stroke group's edge (`edge-tags`), an inset shadow | Tag, Badge soft | — |
| soft padding | 2 block, 6 inline | the chat app's pill (`padding 2px 6px`) | — |
| corner | a pill (`radius-full`) | the chat app's `border-radius: var(--radius-full)` | — |
| line breaks | the plate is drawn on each line (`box-decoration-break: clone`) | the chat app's pill | The editor caps a chip at 20em; a reference is read whole, so Area wraps |
| mark slot | `icon-xs` (12), 4 to the words (`gap-xs`), on the cap height | the editor's `iconSlot{width:12px;height:12px;margin-inline-end:4px}`; Link's external mark | Glyphs drawn at 12 (person, document and calendar scale their 16 drawing; link has a 12 cut) |
| marks | person, document, link, calendar | the kinds' usual marks | A page is a link to a page |
| underline | Link's line: one stroke, 0.08em under | Link | — |
| due | `fg-danger` on the words and the mark; ", Due" for assistive tech | the notes app's red reminders | The words, not only the colour, say it (contrast rule: never colour alone) |
| focus | Link's ring | Link | — |
| hover | the plate or the line; the ink stays | Shared state paint | — |

## States

| State | Slot · property changes | Evidence |
|---|---|---|
| due (`data-due`) | ink `fg-danger` (words and mark); ", Due" in a visually hidden span; forced colours: a wavy underline | The notes app |
| hover (a link or button) | soft: `bg-mark-hover`; plain: Link's line; underline: unchanged | Link, Count soft |
| focus-visible | Link's focus ring | Link |
| disabled (a button) | native `disabled` | — |

## Behavior and accessibility

A span by default; with `href` an `<a>` (a new tab gets `noopener noreferrer`); with `onClick` and no `href` a
`<button type="button">` that keeps the sentence's line. The mark is `aria-hidden`; the words name the mention. A date
is a `<time>` with `dateTime`. Due adds ", Due" (`dueLabel`) after the words for assistive tech.

**In the Composer.** The Composer is a native textarea, so a draft can't hold a component. The @ trigger uses the
Composer menu as it is (the app finds the @ being typed, filters its list and drives the menu from the field, as the
desktop chat does): its rows are grouped People (David Tee first, then teams), Files and Pages; a pick writes the
mention's words, "@David Tee ", into the draft and the app keeps what was picked. When the message is shown,
`withMentions(text, mentions)` turns each "@label" back into a Mention (the longest label first). Nothing was added to
Composer or Composer menu: the smallest change the existing trigger and menu allow. The tile is Composer menu's
"Content / mentions" (`GalleryComposerMenuMentions`), shown under Mention too.

Forced colours: soft draws a `CanvasText` border; due is `CanvasText` with a wavy underline (not checked).

## Sources

| Id | Type | What | Link / commit / path | License | Captures |
|---|---|---|---|---|---|
| chat-app | product bundle | `._Mention_1wujo_2[data-appearance=pill\|underlined-text]`, tones, layouts; pill padding 2 / 6, radius full, `--alpha-08`, `box-decoration-break: clone`; the picker `MentionDropdown` | ChatGPT 26.1023.51421 `app-shared-398c891a59df.css`; Claude 4.16336.0 `shared-frame-CJdE5Ria.js` (chat-apps.md, "Mention") | evidence only | none |
| editor | product bundle | `MentionChip.js`: `iconSlot` 12 × 12, `margin-inline-end:4px`, `label{max-width:20em}`, a line range, a status dot | Cursor 3.27.22 (cursor.md, "Composer") | evidence only | none |
| notes-app | product docs | Person, page and date mentions; reminders turn red on the day or past due | notion.com/help/reminders, notion.com/help/comments-mentions-and-reminders (notion.md) | evidence only | none |
| primer | design system | Inline autocomplete: suggestions for the word at the caret (@mention, #ref, :emoji:) | primer.style `/product/internal-components/` (primer.md) | MIT | none |

## Measurements

**Current (2026-11-13, one mark).** The soft Mention is an inline chip on the one mark recipe (inset.css, "One mark"; plan B5.1, VC24): block padding (1lh − 1.3em) / 2 (0.55 on a 13/18 line; was 2), so the plate is the line box and wrapped chips meet without overlapping (they overlapped by 3); side (1lh − 6) / 2, 6 on an 18 line.

None rendered: the values are the bundles' declared ones (above).

## Peers and consistency

| Peer | Shared role | Area value in peer | This component | Match / reason |
|---|---|---|---|---|
| Link | type, ink, line, focus | inherits; one stroke 0.08em under; the focus ring | same | Match |
| Count soft, Badge soft, Chip input | the neutral mark plate | `bg-mark` | `bg-mark` | Match |
| Tag | the mark's edge | `edge-tags` | `edge-tags` | Match |
| Link (external) | an inline mark's slot | 12, on the cap height | 12, on the cap height | Match |

## Visual pass

Checked in the built renderer in a browser (`desktop-dist`; another session owns Electron), type 13: the soft pill is 21
high on an 18 line (17 + 2 × 2, overhanging the line as a chat app's pill does), the mark 12 on the words' centre, the
plate `bg-mark` with the Tags edge; the picture loads round in the slot; in dark the plate is white 10% and a due date
reads in the dark danger ink. The Composer tile, by keyboard: @ opens People, Files and Pages; Down then Enter picked
"Design team", the draft read "Body text @Design team ", and Enter sent a bubble that draws it as a Mention. Not done:
type 16, the wrapped tile looked at closely, forced colours.

## Verification

- `node --test packages/react/tests/mention.test.mjs`.

## App use

The desktop chat's @ lists files only (it talks to an agent, so it has no people); it keeps its context chips. Nothing
is swapped.

## Review note, 2026-11-07

- **What changed:** a new family for a person, file, page or date inside text, with its mark: soft (a pill, the
  default), plain or underlined; a date that is due turns red. In the Composer, @ now lists people, files and pages, and
  a pick writes "@David Tee" into the draft, drawn as a Mention once sent.
- **Why:** you took the audit's recommendation; a chat app, an editor and a notes app all draw them.

## Feedback log

- 2026-11-07 · built from the components audit (N3); `underline` added to `variant`'s values; the Composer's @ list
  reuses Composer menu unchanged.

## Review note, 2026-11-11 (type rules, plan A9)

- **What changed:** the underline reads `underline-offset` (0.08em) (plan A9.10); no visible change.
- **Why:** the system evaluation's type rules (docs/research/system-evaluation-2026-11-11, section 5, A9), owner-approved
  2026-11-11; the rules are in DESIGN_SYSTEM.md ("Ink and weight", "Size and shape", "Text pairs") and the type skill.

## One mark, 2026-11-13

Plan B5.1 (and B5.2, B5.3 where they apply; docs/research/system-evaluation-2026-11-11): the family moved onto the shared mark recipe in inset.css and its own copy of the side, baseline, corner and text was removed. Values above, under Measurements.
