# Citation spec

**Status:** complete · 2026-10-11 (approved, review round 8)
**Captures:** `docs/research/captures/citation/`
**Peers:** Message (the prose it sits in), Hover card (the preview), Link (inline links), Count and Kbd (the tiny-chrome
type role), Chip (a pill that is a control, not a source)

## Owner decisions

- 2026-10-10: "go with your recommendations then keep working" → Citation, from the inventory's conversation list
  ("SourceChip / citation pill"); ChatGPT's answer citations are the reference.
- 2026-10-10: "go with your recommendations" → 11px type; the ink stays on hover (the plate shows it).

## Job and boundaries

A citation links a source from the sentence it supports, as a small pill after the sentence: the site's icon and short
name, and "+N" when more sources stand behind it. It opens the source; a Hover card can preview it. Not Link (a link in
running text, styled as text), not Chip (a control or a filter), not Badge (a label, not a link), not a footnote marker
(Hover card's Source demo uses a superscript number).

## Variants

| Axis | Value | Justification | Where it appears |
|---|---|---|---|
| content | favicon or none; label; "+N" more sources | ChatGPT shows the favicon, the site's name, "+1" | ChatGPT answers with web results |
| behavior | link; with a Hover card preview | ChatGPT previews the sources on hover | ChatGPT |

Excluded: a numbered footnote form (Hover card's Source demo covers it), a sources panel (a list of all sources is a
Drawer or Panel with rows).

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

area     a.area-citation (18, 0 8 0 4 — 0 8 0 8 without an icon — gap 4, radius full, 11/11 500, inline-flex on the baseline)
           span.__icon 12 round (img or element) · span.__label (max 15ch, ellipsis) · span.__count "+N" (aria-hidden)
```

## Measurements

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
| pill | 20 tall (`mark-label-md`; 16 compact), round, 4 / 8 padding (8 / 8 without an icon), 4 gap | prompt-kit h-5 with ChatGPT's and prompt-kit's 4 / 8 | ChatGPT 18 at 9px text; AI Elements about 22 |
| fill / ink | `bg-component-hover` (#f3) / `fg-muted` | ChatGPT #f3 / rgb(93) | Area's muted role |
| hover / pressed | `bg-component-active`; the ink stays | ChatGPT darkens the plate | ChatGPT also darkens the ink; Area keeps the foreground fixed (DESIGN_SYSTEM.md) |
| type | 12 / 16 500 (`text-xs`) | AI Elements (text-xs medium) and prompt-kit (text-xs); owner, round 7: "maybe even 12" | ChatGPT 9px; was 11 in round 7 |
| name | cut at 15 characters with an ellipsis | ChatGPT `max-w-[15ch]` | — |
| favicon | 12 round | ChatGPT `size-3` round | — |
| place | 4 after the sentence, on its baseline | ChatGPT `ms-1` | ChatGPT nudges the pill −1.5 then +2; the baseline puts its middle on the text's x-height without a nudge |
| link | new tab, `noopener noreferrer`; named "Name: title, N more sources" | ChatGPT's aria-label lists the title, URL and additional sources | — |

## Behavior and accessibility

An `a` opening in a new tab. Its accessible name is the source's name, its title and how many more sources; the visible
"+N" is hidden from assistive tech. Focus shows Area's focus ring. In a Hover card it previews on hover and keyboard focus
(Hover card's timing).

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

## Feedback log

- 2026-10-10 · owner: "go with your recommendations then keep working" → Citation from ChatGPT's answer citations; 5
  gallery tiles, in review.
- 2026-10-10 · owner: "go with your recommendations" → open questions 1–2 resolved as recommended; no change.
- 2026-10-11 · owner, review round 7 (rethink): "go with recs for open questions, maybe even 12 should be considered for the type size? can you research more real examples of this component" → more references gathered; type size reconsidered.
- 2026-10-11 · round 8 → 12 / 16 500 on the 20 mark tier; AI Elements and prompt-kit sources pinned; open questions
  resolved as recommended (ink fixed on hover).
- 2026-10-11 · owner, review round 8: approved → Complete in `component-status.mjs`.
