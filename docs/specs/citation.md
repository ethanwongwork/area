# Citation spec

**Captures:** `docs/research/captures/citation/`
**Peers:** Message (the prose it sits in), Hover card (the preview), Link (inline links), Count and Kbd (the tiny-chrome
type role), Chip (a pill that is a control, not a source)

## Owner decisions

- 2026-10-10: "go with your recommendations then keep working" → Citation, from the inventory's conversation list
  ("SourceChip / citation pill"); ChatGPT's answer citations are the reference.
- 2026-10-10: "go with your recommendations" → 11px type; the ink stays on hover (the plate shows it). — superseded
  2026-10-11: 12px type on a 20 pill (round 8); the fixed ink stands.

## Job and boundaries

A citation links a source from the sentence it supports. The pill (default) sits after the sentence: the site's icon
and short name, and "+N" when more sources stand behind it; it opens the source in a new tab. The footnote is a raised
number in brackets right after the word, [13], as Wikipedia marks its references; it goes to its note on the page
(owner, 2026-10-17). A Hover card can preview either. Not Link (a link in running text, styled as text), not Chip (a
control or a filter), not Badge (a label, not a link).

## Variants

| Axis | Value | Justification | Where it appears |
|---|---|---|---|
| variant | `pill` (default) | The source's name in a small pill | ChatGPT answers with web results |
| variant | `footnote` | A raised number in brackets; owner, 2026-10-17 ("Footnote variant") | Wikipedia's [13] |
| ink (footnote) | `blue` (the footnote's default), `inherit`, `muted`, `action`, `purple`, `pink`, `green`, `red`, `orange`, `brown` | Link's inks; the pill keeps `fg-muted` | Wikipedia's link blue #36c |
| content (pill) | favicon or none; label; "+N" more sources | ChatGPT shows the favicon, the site's name, "+1" | ChatGPT answers with web results |
| behavior | link; with a Hover card preview | ChatGPT previews the sources on hover; Wikipedia previews references | ChatGPT, Wikipedia |

Excluded: a sources panel (a list of all sources is a Drawer or Panel with rows, or Reference list), an underline on
the footnote at rest or on hover (owner, 2026-10-17).

## Sources

| Id | Type | What | Link / commit / path | License | Captures |
|---|---|---|---|---|---|
| chatgpt | target product | `a[data-testid=chatgpt-citation]` in an answer with web results, single and "+1" | chatgpt.com, an earlier chat of the owner's, read-only, 2026-10-10 | evidence only | `chatgpt--citation-single`, `chatgpt--citation-multi` |
| ai-elements | design system (source) | `InlineCitation`: shadcn Badge `ml-1 rounded-full`, hostname then "+N", a Hover card carousel of sources | `packages/elements/src/inline-citation.tsx:56-79` at vercel/ai-elements `6a9d5b1`; Badge `px-2 py-0.5 text-xs font-medium rounded-full` (shadcn `apps/v4/registry/new-york-v4/ui/badge.tsx:7` at `98a1fe6`) | Apache-2.0 / MIT | — |
| prompt-kit | design system (source) | `Source`: `h-5 rounded-full text-xs`, `pl-1 pr-2` with a 14 round favicon, `max-w-32`, muted plate, hover darker | `components/prompt-kit/source.tsx:64-81` at ibelick/prompt-kit `5a94966` | MIT | — |
| notion, figma | target products | not found: neither shows web sources inline (Notion AI's citations were not checked) | — | — | — |
| area | this system | Every gallery tile, with its paragraph | the built gallery | — | `area--*` (5) |

Read from ChatGPT's classes: `h-4.5 rounded-xl ps-1 pe-2 text-[9px] font-medium bg-secondary-soft text-secondary-solid
max-w-[15rem]`, hover `bg-secondary-soft-hover text-default`; the wrapper `ms-1 inline-flex relative top-[-0.094rem]
translate-y-0.5`; the name `max-w-[15ch]` with an ellipsis; the favicon `size-3` round.

## Anatomy

```
chatgpt  span.ms-1.inline-flex (top −1.5, translate +2)
           a (18, 0 8 0 4, radius 12, #f3, 9/9 500 rgb 93)
             span: span (gap 4): span 12 round favicon > img · span name (max 15ch, ellipsis)
             span "+1" (0 4 padding, negative margin)

area     a.area-citation--pill (`mark-label-md`: 20 at the default, 14 at Compact; sides (h − icon) / 2 and (h − 4) / 2,
           4 / 8 at 20, both (h − 4) / 2 without an icon; gap 4, radius full, 12/16 500, inline-flex on the baseline)
           span.__icon 12 round, at most h − 4 (img or element) · span.__label (max 15ch, ellipsis, cap-trimmed)
           · span.__count "+N" (aria-hidden)
area     a.area-citation--footnote (inline, 0.704em, line-height 1, super, 0 1px padding, radius-min, no plate)
           span.__bracket "[" (aria-hidden) · number · span.__bracket "]" (aria-hidden)
```

## Measurements

**Current (2026-11-13, one mark).** The pill is on the one mark recipe (inset.css, "One mark"). Heights are the mark ladder, the small text line plus 0 / 4 / 8: 14 / 18 / 22 at type 12 and 13, 16 / 20 / 24 at 14, 18 / 22 / 26 at 15, 20 / 24 / 28 at 16, the same at Compact, Default and Comfortable (Compact's md was 14 and its lg 18 until 2026-11-13). The text side is (H − 6) / 2 from the outer edge, edge counted once: 4 / 6 / 8 at type 13. The cap sits on the marks' whole-pixel baseline, edge + round((H − 2 · edge + 1cap) / 2). The tables below are the source evidence they were set from. Text text-xs at 500. Side 6 (was 7); the favicon side (H − 12) / 2, 3 at 18; gap 4. The label sits on the whole-pixel cap baseline (it sat 0.6 high on an optical lift). Fill: the translucent mark fill `bg-mark` (was the opaque bg-component-hover). Always a pill. The footnote is unchanged (max(10, 0.704em)).

`node scripts/capture-compare.mjs --slots shell,icon,label` (trimmed):

| slot · property | chatgpt · multi | area · more |
|---|---|---|
| **shell** size | 129.95 × 18 | 123.64 × 18 |
| **shell** padding | 0 8 0 4 | 0 8 0 4 |
| **shell** radius | 12 (round at 18) | full |
| **shell** type | 9/9 500 | 11/11 500 |
| **shell** ink / fill | rgb(93) / rgb(243) | rgb(102) / rgb(243) |
| **icon** | 12 round, 4 in | 12 round, 4 in |
| **after the sentence** | 4 | 4 |

## Decisions

| Slot · property | Area value | Basis | Reason when it differs from the basis |
|---|---|---|---|
| pill | 20 tall (`mark-label-md`; 14 at Compact), round; sides from the height, icon side (h − icon) / 2 and text side (h − 4) / 2 (4 / 8 at 20, 1 / 5 at 14; the text side at both ends without an icon), 4 gap (citation.css:18-36) | prompt-kit h-5 with ChatGPT's and prompt-kit's 4 / 8; spacing audit 2026-10-17 (Badge's rule) | ChatGPT 18 at 9px text; AI Elements about 22 |
| fill / ink | `bg-component-hover` (#f3) / `fg-muted` | ChatGPT #f3 / rgb(93) | Area's muted role |
| hover / pressed | hover `bg-component-active`, pressed `bg-component-pressed`; the ink stays (citation.css:60-61) | ChatGPT darkens the plate; interaction polish 2026-10-16 | ChatGPT also darkens the ink; Area keeps the foreground fixed (DESIGN_SYSTEM.md) |
| type | 12 / 16 500 (`text-xs`) | AI Elements (text-xs medium) and prompt-kit (text-xs); owner, round 7: "maybe even 12" | ChatGPT 9px; was 11 in round 7 |
| name | cut at 15 characters with an ellipsis | ChatGPT `max-w-[15ch]` | — |
| favicon | 12 round, at most the plate less 4 (10 at Compact's 14, the 10px cut) | ChatGPT `size-3` round; owner 2026-10-17 ("go with 10px icons") | — |
| place | 4 after the sentence, on its baseline | ChatGPT `ms-1` | ChatGPT nudges the pill −1.5 then +2; the baseline puts its middle on the text's x-height without a nudge |
| link | pill: new tab, `noopener noreferrer`; named "Name: title, N more sources" | ChatGPT's aria-label lists the title, URL and additional sources | — |
| footnote · type | 0.704em of the text it sits in, line-height 1, `vertical-align: super`, weight inherited, tabular numbers (citation.css:85-100) | Wikipedia, computed (2026-10-17) | — |
| footnote · ink | `ink`, `blue` (`fg-info`) by default (Citation.tsx) | Wikipedia #36c; Link's inks | — |
| footnote · underline, plate | none at rest, hover or press | Owner, 2026-10-17 (no hover-only underline); a plate behind a hued number was 3.97:1 at dark 24 + 8 | Wikipedia underlines on hover |
| footnote · link | no `target` (goes to its note on the page); named "Note 13: title"; brackets `aria-hidden` | Wikipedia's in-page `#cite_note-13` | — |

## Behavior and accessibility

An `a` with every anchor prop and a ref. The pill opens in a new tab (`target` and `rel` unless given); its accessible
name is the source's name, its title and how many more sources, and the visible "+N" is hidden from assistive tech. The
footnote sets no `target`; its name is "Note N" plus the title, and the brackets are hidden from assistive tech. An
`aria-label` passed in replaces either name. Focus shows Area's focus ring. In a Hover card it previews on hover and
keyboard focus (Hover card's timing).

## Visual pass

Gallery, light: the pill sits 4 after the last word, centred on the text; the long name cuts before "+1"; the Hover card
opens under it on hover. Both products set the answer at 16; Area's 11 reads a step larger than ChatGPT's 9 beside it.

## Verification

- 7 captures (2 ChatGPT, redacted, read-only; 5 Area); checksums verified.
- `npm run build`, `build:docs`, `typecheck`, `citation.test.mjs` (2).
- In the gallery: the Hover card opens on hover.
- Unverified: ChatGPT's hover state and its preview card (Chrome's window was hidden), dark mode, screen readers.

## Open questions

Resolved 2026-10-10 (owner: "go with your recommendations"); kept for the record.

1. Type: 11 (Area's floor) or ChatGPT's 9? Recommendation: 11.
2. Should the label take the ink on hover as ChatGPT's does? Recommendation: no; the plate shows hover, as every Area
   control.

## Review note, 2026-10-10

- **What changed:** New component. Citation is the small source pill ChatGPT puts after a sentence: the site's icon, its
  short name, and "+2" when more sources back it up. It links to the source, and hovering can show a preview card.
- **Why:** It was on the conversation list, and ChatGPT uses it in every answer with web results. Its size, padding and
  colour copy ChatGPT's; the text is 11px rather than ChatGPT's 9px, Area's smallest size.

## Review note, 2026-10-11 (round 8)

- **What changed:** The text is 12px (was 11) and the pill 20 tall (was 18), so the source name reads at the size of
  Area's other small labels.
- **Why:** You asked whether 12 would be better and for more real examples. Two open chat kits that ship this component,
  Vercel's AI Elements and prompt-kit, both set it at 12px on a 20 to 22 pill; ChatGPT's 9px is the outlier.

## Interaction polish, 2026-10-16

Presses at `bg-component-pressed`, one step past selected (Notion presses at 10%, ChatGPT 12%; it shared selected's fill, 1.5% below hover) (hover is `bg-component-active`). See [interaction polish](../research/interaction-polish-2026-10-16.md).

## Footnote variant, 2026-10-17

Owner, on Wikipedia's "Systems[13]": "i like the way the links and small numbers are styled". `variant="footnote"`
draws a number in brackets raised after the word, measured on en.wikipedia.org/wiki/Lisa_Su (computed styles):

| Property | Wikipedia | Area |
|---|---|---|
| size | 11.264 on 16 text (0.704em) | 0.704em |
| line height | 1 | 1, so the raised number never opens the line |
| position | `vertical-align: super`, no gap before it | the same; 1px each side for the focus ring |
| brackets | inside the link, in its ink | inside, `aria-hidden`; the name is "Note 13: title" |
| ink | link blue #36c | `ink`, blue (`fg-info`) by default; Link's inks |
| underline | none, then on hover | none at all (the owner doesn't want hover-only underlines) |
| hover plate | none | none, as Link in a sentence; a plate behind a hued number was 3.97:1 at dark 24 + 8 |
| target | in-page `#cite_note-13` | no `target`; the pill still opens a new tab |

A Hover card previews the source, as Wikipedia's reference previews do. `variant` is `pill` (default) or `footnote`.

## Review note, 2026-10-17 (round 33)

- **What changed:** A new `footnote` variant: the small raised number in brackets, [13], in link blue, as Wikipedia
  marks its references. No underline, at rest or on hover.
- **Why:** You liked how Wikipedia styles its links and small reference numbers ("Systems[13]").

## Feedback log

- 2026-10-10 · owner: "go with your recommendations then keep working" → Citation from ChatGPT's answer citations; 5
  gallery tiles, in review.
- 2026-10-10 · owner: "go with your recommendations" → open questions 1–2 resolved as recommended; no change.
- 2026-10-11 · owner, review round 7 (rethink): "go with recs for open questions, maybe even 12 should be considered for the type size? can you research more real examples of this component" → more references gathered; type size reconsidered.
- 2026-10-11 · round 8 → 12 / 16 500 on the 20 mark tier; AI Elements and prompt-kit sources pinned; open questions
  resolved as recommended (ink fixed on hover).
- 2026-10-11 · owner, review round 8: approved → Complete in `component-status.mjs`.

## Spacing audit (2026-10-17)

10px favicon at Compact (owner: "go with 10px icons, draw the cuts"): the favicon box is ChatGPT's 12, at most the plate less 4 (10 in Compact's 14), where an Area icon draws its 10px cut; the demos pass the book `size={12}` so it carries the cuts. Supersedes the open note below.

Sides from the height, as Badge's: an icon side `(h − 12) / 2` and a text side `(h − 4) / 2`, so ChatGPT's 4 / 8 at 20 and 1 / 5 in Compact's 14 (the literal 8 stayed at every height). The label joins inset.css's cap-trimmed text slots and the marks' optical centre (with Badge and Tag). Open: the 12px favicon in Compact's 14 pill, as Badge's icons. Measured in `docs/research/spacing-2026-10-17/` (review: https://claude.ai/artifact/JtDZ9LNfutFyfdkGUvQzL2).

### 2026-11-07 · Every hue's roles (components audit D5)

The hued inks read the hue role table (`--area-hue-<hue>-<role>`, packages/tokens/src/semantic/hues.ts; DESIGN_SYSTEM.md, "Every hue has the same roles") (`hue-<hue>-text`), as Link's do: no value changed.

## Review note, 2026-11-11 (type rules, plan A9)

- **What changed:** the footnote is floored at the ramp's 10: `max(size-10, 0.704em)`; it was 9.15 at 13 (plan A9.9, finding T22).
- **Why:** the system evaluation's type rules (docs/research/system-evaluation-2026-11-11, section 5, A9), owner-approved
  2026-11-11; the rules are in DESIGN_SYSTEM.md ("Ink and weight", "Size and shape", "Text pairs") and the type skill.

## One mark, 2026-11-13

Plan B5.1 (and B5.2, B5.3 where they apply; docs/research/system-evaluation-2026-11-11): the family moved onto the shared mark recipe in inset.css and its own copy of the side, baseline, corner and text was removed. Values above, under Measurements.
