# Search field spec

**Captures:** `docs/research/captures/search-field/`
**Peers:** Input (the shell, sizes, variants, focus, InputAction), Kbd (the shortcut hint), Combobox (a field with
suggestions), Command palette (search in a dialog), Empty state (no results)

## Owner decisions

- 2026-10-10: "continue the component work" → Search field, first in the inventory's "Entry and forms" and "Shared and
  small" lists ("Reuse Input/Field for search and password anatomy; promote a wrapper when behavior such as reveal,
  clear, filtering or async suggestions is included"). Meter's round-7 review goes out with it.
- 2026-10-10: "proceed with your suggestions" → open questions resolved as recommended: the clear action shows whenever
  there is text (not only while focused); the clear glyph becomes a filled circled × once the icon session draws it
  (requested from the active icon session, add-circle's family); until then it is the plain `dismiss`.

## Job and boundaries

A search field takes a query that filters or searches something on the page: a list, a panel's assets, a set of
pages. It is an Input with the search glyph, a clear action once there is text, Escape to clear, and an optional hint
for the shortcut that focuses it. Not a Combobox (no suggestion list or chosen value), not the Command palette (a
dialog of actions and places), not a filter bar (several criteria).

## Variants

| Axis | Value | Justification | Where it appears |
|---|---|---|---|
| variant | outline (default), soft | Input's | ChatGPT GPTs search is edged; ChatGPT's sidebar and Figma's fields are filled |
| size | sm, md (default), lg | Input's tiers | Figma 24, Notion 24 (inline) and 32 (trigger), ChatGPT 36 |
| content | the search glyph (default) or none; a shortcut hint while empty | Notion's sidebar search shows ⌘K; Untitled UI `shortcut` | Notion, Untitled UI |
| state | empty, with a query (clear action), loading, disabled, read-only | React Aria, Fluent; Input's states | all three products show the clear action once there is text |

Excluded: a pill shape of its own (ChatGPT's pill is the theme's `--area-pill-field`, which already rounds every field),
a search button or submit arrow (none of the three products has one), suggestions (Combobox), scopes or filters inside
the field.

## Sources

| Id | Type | What | Link / commit / path | License | Captures |
|---|---|---|---|---|---|
| chatgpt | target product | GPTs › Search GPTs, with a query (focused) | chatgpt.com/gpts, 2026-10-10, read-only | evidence only | `chatgpt--gpt-search--filled-focus` |
| notion | target product | A database view's search (toolbar magnifier), with a query; the sidebar search trigger with ⌘K (Input's evidence) | app.notion.com, 2026-10-10 and 2026-09-27, read-only | evidence only | `notion--db-search--filled-focus`, `baseline/notion--search-field` |
| figma | target product | Editor › Assets search, empty and with a query; Find (⌘F) empty and with a query | figma.com, a community file in the owner's drafts, viewed only | evidence only | `figma--assets-search--{focus,filled-focus}`, `figma--find--{focus,filled-focus}` |
| react-aria | design system (source) | `useSearchField`: Escape clears, Enter submits, clear button out of the Tab order, focus kept in the field | `packages/react-aria/src/searchfield/useSearchField.ts:68-135` at `16eead6` | Apache-2.0 | — |
| fluent | design system (source) | SearchBox: `type="search"`, WebKit cancel hidden, dismiss `tabIndex -1`, focus back to the input, dismiss shown only while focused | `react-search/library/src/components/SearchBox/useSearchBox.tsx:90-151`, `useSearchBoxStyles.styles.ts:47-56, 73-84` at `8add8c8` | MIT | — |
| uui | design system (source) | Input `shortcut`: a keycap at the end, `aria-hidden`, default ⌘K | `components/base/input/input.tsx:36-37, 183-198` at `8b7409c` | MIT | — |
| area | this system | Every gallery tile at 1:1 | the built gallery | — | `area--*` (10) |

All product captures are redacted (no text, labels or values). Chrome reported its window hidden throughout, so no
hover state was captured; the products' clear buttons were seen at rest only.

## Anatomy

```
chatgpt  div (36 pill, 1 edge, 0 12 padding, gap 8): span 20 icon box · input 14/20 · button 16 (circled ×, rgb 93)
notion   div (24, no chrome, 4 end padding): input 14 · div[role=button] 24 round, 5% warm plate (circled ×, 20 box)
figma    div (24, fill 245, radius 5): div 24 icon box (12 glyph) · div: input 11/16 · button 24 radius 5 (× 16 box, 8 ink)

area     div.area-input.area-search-field  (Input's shell: height, edge, fill, radius, focus)
           span.area-input__icon            16 search glyph, the field's icon ink
           input.area-input__control[type=search][enterkeyhint=search]
           span.area-input__affix > span.area-kbd.area-search-field__shortcut   while empty, with `shortcut`
           span.area-input__action > button.area-input__action-button.area-search-field__clear[tabindex=-1]
                                            once there is text: InputAction's box, the dismiss glyph
```

Insets are Input's (`inset.css`): the search glyph's square sits (H − 16) / 2 from the edge (8 at md); the clear
action's box sits 4 in, so its glyph is also 8 from the end at md; the Kbd hint's end space equals the space above it.

## Measurements

`node scripts/capture-compare.mjs` on the three references' filled captures and Area md / sm / lg (trimmed):

| slot · property | chatgpt · filled | notion · filled | figma · assets · filled | area · md | area · sm | area · lg |
|---|---|---|---|---|---|---|
| **shell** size | 240 × 36 | 150 × 24 | 180 × 24 | 256 × 32 | 256 × 28 | 256 × 40 |
| **shell** border / radius | 1 black 15% / pill | 0 / 0 | 0 / 5 | 1 #e2 / 8 | 1 #e2 / 6 | 1 #e2 / 10 |
| **icon** box · edge from shell | 20 · 13 | — (a 28 toolbar button before the field) | 24 · 0 (12 glyph at 6) | 16 · 8 | 16 · 6 | 16 · 12 |
| **control** edge from shell (t r b l) | 8 37 8 41 | 3.94 24 3.94 0 | 4 24 4 24 | 6 34 6 30 | 4 30 4 28 | 10 42 10 34 |
| **action** size · radius | 16 · 0 | 24 · 20 (round) | 24 · 5 | 24 · 4 | 20 · 4 | 32 · 6 |
| **action** edge from shell (end) | 13 | 0 | 0 | 4 | 4 | 4 |
| **action** plate at rest | none | 5% warm | none | none | none | none |
| **action-icon** box · glyph | 16 · filled circled × 13.5 | 20 · filled circled × 15.25 | 16 · plain × 8 | 16 · plain × | 16 · plain × | 16 · plain × |
| **action-icon** ink | rgb(93) | rgb(173, 169, 163) | black 50% | `input-icon` | `input-icon` | `input-icon` |

## Decisions

| Slot · property | Area value | Basis | Reason when it differs from the basis |
|---|---|---|---|
| shell, sizes, variants, focus, disabled, loading | Input's, unchanged | Peer Input (accepted); Figma and Notion fields 24-32 | — |
| leading glyph | the package `search` glyph, 16, `input-icon` ink | All three products lead with a magnifier; peer Command palette's search | — |
| clear · when | shown whenever there is text and the field is editable | ChatGPT, Notion and Figma show it once there is a query; React Aria | Fluent shows it only while focused; not adopted (a filled field you return to should offer clear) |
| clear · box | InputAction's: field − 8 (20 / 24 / 32), 4 in, concentric radius, ghost plates (hover `bg-component-hover`, pressed `bg-component-active`; soft fields the translucent pair) | Figma 24 square button flush at the end; Notion 24 round; peer InputAction | ChatGPT has a bare 16 button; Notion's resting plate is not adopted (Area's actions show a plate on hover only) |
| clear · glyph | the package `dismiss-circle` glyph (filled circled ×, the × knocked out), 16 | ChatGPT and Notion (filled circled ×); owner's pick (open question 1) | Figma, Fluent `DismissRegular` and Spectrum draw a plain ×, Area's glyph until 2026-10-10 |
| clear · name | "Clear search" (`clearLabel`), from the action's tooltip | ChatGPT, Figma ("Clear search"), React Aria | — |
| shortcut hint | a Kbd in the suffix while empty: sm in sm and md fields, md in lg; `aria-hidden`, with the keys set as `aria-keyshortcuts` | Notion's ⌘K trigger; Untitled UI `shortcut`; Kbd's approved search-field tile | — |
| type | `type="search"`, `enterkeyhint="search"`; the browser's cancel button and decoration hidden (already in input.css) | React Aria, Fluent | — |
| placeholder | "Search" | ChatGPT "Search GPTs", Figma "Find…", Notion "Type to search…" | A neutral default; consumers name what is searched |

## States

| State | Slot · property changes | Evidence |
|---|---|---|
| empty | glyph, placeholder; the shortcut hint when given | all |
| with a query | the clear action replaces the hint at the end | ChatGPT, Notion, Figma |
| focus | Input's focus edge and halo | Figma: 1px #0d99ff outline (`figma--*--focus`) |
| clear hover / pressed | InputAction's plates | peer Input |
| loading | Input's Spinner in place of the search glyph (`loaderPosition` auto) | peer Input |
| disabled / read-only | Input's paint; no clear action | React Aria `isDisabled: isDisabled \|\| isReadOnly` |

## Behavior and accessibility

- The input is `type="search"` (role searchbox), named by `aria-label` or a Field label. `shortcut` sets
  `aria-keyshortcuts` (cmd → Meta, ctrl → Control, alt / option → Alt, shift → Shift); the visible Kbd is hidden from
  assistive tech. The page binds the keys.
- Escape with a query clears it and stops there, so a dialog around the field stays open; on an empty field Escape is
  left alone and reaches the page (React Aria `useSearchField.ts:80-88`).
- Enter calls `onSubmit(value)` and does not prevent a surrounding form from submitting. IME composition is ignored.
- The clear action has `tabindex="-1"` (Escape is the keyboard path) and keeps focus in the field: a mouse press
  doesn't move focus, and the click focuses the input (React Aria `excludeFromTabOrder`, `preventFocusOnPress`; Fluent
  `tabIndex: -1`, `searchBoxRef.current?.focus()`). It calls `onValueChange("")` and `onClear()`.
- Controlled (`value` + `onValueChange`) or uncontrolled (`defaultValue`); native `onChange` still runs.

## Peers and consistency

| Peer | Shared role | Area value in peer | This component | Match |
|---|---|---|---|---|
| Input | shell, insets, InputAction | as Input | Input itself | match |
| Kbd | shortcut hint in a field | Kbd's search-field tile (sm in md) | the same | match |
| Command palette | search glyph | package `search`, 16 | the same | match |
| Combobox | trailing action | InputAction box | the same | match |

## Visual pass

Gallery at 1:1, light default, dark default and dark compact: the search glyph and the × share the field's icon ink and
sit the same 8 from either edge at md; the × reads a little heavier than ChatGPT's grey circled mark (a plain stroke at
the icon ink against a filled shape at 60% ink). The ⌘K hint ends the empty field like Notion's trigger. The soft
variant's clear plate uses the translucent hover pair, as Input's. Nothing changed during the pass.

## Verification

- 16 captures (1 ChatGPT, 1 Notion, 4 Figma, 10 Area); checksums verified; product captures redacted and checked for
  names (none: `[n chars]` placeholders only).
- `npm run build`, `build:docs` (parity, token references, docs audit), `typecheck`, `test:contracts`,
  `search-field.test.mjs` (4), `input-field.test.mjs`, `git diff --check`.
- In the gallery (built docs, in-app browser): typing filters the demo list; Escape clears and keeps focus; the clear
  action empties the field and keeps focus; Tab from the field skips the clear action; no results show "No pages match".
- Unverified: product hover states and dark mode (Chrome's window was hidden; theme is the owner's setting), screen
  reader output, RTL, touch (the clear press keeps the keyboard up only if the field keeps focus, as here).

## Open questions

Resolved 2026-10-10 (owner: "proceed with your suggestions"); kept for the record.

1. **Clear glyph.** ChatGPT and Notion use a filled circled ×; Figma, Fluent and Spectrum a plain ×, which Area uses
   today. A circled × would be a new Area icon (add-circle's family: the circle with a × knocked out) drawn in the
   icon session. Recommendation: draw it there and switch, since two of the three products agree.
2. **Clear while unfocused.** Fluent hides it until the field is focused; ChatGPT, Notion and Figma were seen focused
   only. Recommendation: keep it whenever there is text.

## Review note, 2026-10-10

- **What changed:** New component. Search field is a search box: the field with a magnifier, an × that appears once
  you type and empties it (Escape does the same), and an optional ⌘K hint while it is empty.
- **Why:** It was next on the list, and ChatGPT, Notion and Figma all have one. It is Area's Input underneath, so its
  sizes, edges and focus match every other field; the clear and Escape behavior follow ChatGPT, Notion and Figma and
  React Aria.

## Review note, 2026-10-11 (round 8)

- **What changed:** The clear button is now the filled circled × (the cut-out version of Area's `error` icon), as ChatGPT
  and Notion draw it. Its focus state is unchanged.
- **Why:** You approved the circled × earlier, and the icon landed on main. On the focus question: Search field's focus
  is Input's exactly (the blue edge and a 2px halo on any focus), as Number field, Combobox and Textarea. The different
  look is the picker fields (Select, Custom select, Date picker): they ring only from the keyboard and keep their hover
  edge while open.

## Feedback log

- 2026-10-10 · owner: "continue the component work" → Search field from ChatGPT's GPTs search, Notion's database search
  and Figma's Assets and Find fields; 16 captures, 10 gallery tiles, in review.
- 2026-10-10 · owner: "proceed with your suggestions" → clear shown whenever there is text (no change); a filled
  circled × requested from the icon session; SearchField switches to it when it reaches main.
- 2026-10-10 · the icon session generated `dismiss-circle` (the `error` icon's filled cut: a solid ring with the ×
  as a knockout) on `claude/icon-work-95225c`, not yet merged → Glyph.tsx now renders "knockout" glyphs: the solid
  filled and stroked, the knockout paths cut through it with a mask at the glyph's own line width, so it reads on any
  ground. Checked with that branch's glyph data applied locally (12 / 16 / 20 / 24 on white, #f7, #111 and a
  gradient; the field at sm, md, lg), then reverted. The switch to `dismiss-circle` is one line once the icon branch
  is on main.
- 2026-10-11 · owner, review round 7 (rethink): "is this selected state the same as other input components? i thought i saw a different selected state" → checking the focus state against Input, Combobox, Select and Date picker.
- 2026-10-11 · round 8 → focus measured identical to Input, Combobox and Number field (edge `focus-color`, 2px 14% halo),
  so no change; the picker triggers differ by design (keyboard-only ring). Clear glyph → `dismiss-circle` (icon branch
  merged in PR 60; Glyph.tsx's knockout mask).
- 2026-10-11 · owner, review round 8: approved → Complete in `component-status.mjs`.

## Review note, 2026-10-22 (round 69)

- **What changed:** Selection now defaults to the accent, so this family's checked, on, selected, current and filled
  parts are the accent blue instead of near-black (#282828). Nothing else changed. A theme set to Selection Neutral
  looks exactly as before; the "Selection / neutral" tile shows it.
- **Why:** your pick of option B: one setting colours everything selected, so a selected card's edge and the mark
  inside it always match (docs/research/selection-colour-2026-10-22). With an accent chosen, most of the system was
  blue already; buttons follow Action, which stays neutral.

## Review note, 2026-10-29 (visual pass, rounds 86–89: Filtering demo)

- **What changed:** the results under the field are Nav rows (plates, row height, the row inset), and "No results" takes a row's inset and height in the muted ink. The field is unchanged.
- **Why:** the demo drew the results as bare list items with inline styles: no row height or plates, 18 apart, 8 in. Demos are made of real components.
- **Verdict:** approved (owner, 2026-10-29, review page rounds 85–89); Complete.
