# 06 Data and code

> **v2 note.** This file is the capability checklist (variants, anatomy, behaviour, demos). It is not a source for sizes, padding, radius or shape: those come only from `construction/06-data-code.md`. Any px value still written below is illustrative and loses to the construction file.


Table (and the Data table feature layer), Code block, Snippet, List / Item,
Description list, Stat, Timeline.

---

## Table

Atlas boundary: **Table** = structured comparison with native `<table>` semantics.
**Data grid** = cell-level focus, editing, virtualisation (`role="grid"`), its own audit.
This section specifies Table plus the feature layer that still fits `<table>`: sorting,
row selection, row actions, expansion, grouping, pagination, toolbar. Build all of it.

### Anatomy

```
 ┌container (outline card, radius, overflow hidden)──────────────────────────────────────┐
 │ title block: Title / Subtitle                              [Search] [Filter] [+ New]  │ toolbar
 │ ── or, when rows are selected, the batch bar replaces the toolbar: ──                 │
 │ 3 selected      [Archive] [Move] [Delete]                                   [Cancel]  │
 ├────┬──────────────────────────┬───────────┬──────────────┬───────────────┬────────────┤
 │ [] │ Name  ↑                  │ Status    │ Owner        │       Updated │            │ head (sticky)
 ├────┼──────────────────────────┼───────────┼──────────────┼───────────────┼────────────┤
 │ [] │ [ic] checkout-service    │ (Deployed)│ (av) Mira O. │        2h ago │  [⋯]       │ row
 │    │      main · 4f2a9c1      │           │              │               │            │  <- cell layout: media + main + description
 ├────┴──────────────────────────┴───────────┴──────────────┴───────────────┴────────────┤
 │ ▾ GROUP LABEL (12)                                                                    │ group row
 ├───────────────────────────────────────────────────────────────────────────────────────┤
 │ Rows per page [25 v]        1-25 of 312                                   ‹  1 2 3 ›  │ footer
 └───────────────────────────────────────────────────────────────────────────────────────┘
```

Alignment rules: text start-aligned; numbers, currency, dates-as-durations **end-aligned
with tabular numerals**, and their header aligns the same way; status and tags
start-aligned; row action column end-aligned, fixed width, no header text (visually hidden
"Actions"). First column inline-start padding and last column inline-end padding equal the
container's title block padding so everything shares one edge. Header text is one step
smaller and muted, medium weight; no uppercase by default. Cell vertical alignment: middle
for single-line rows, top for multi-line rows (option).

### Build list

| Axis | Value | Sources |
| --- | --- | --- |
| density / size | row heights xs 24, sm 32, md 40, lg 48, xl 64; or cell padding condensed / normal / spacious | CAR(xs to xl) FLU(extra-small, small, medium) PRI(cellPadding) MUI(small, medium) |
| variant | `plain` (row hairlines only, no container), `contained` (outline card, header on muted fill), `striped` / zebra, `bordered` (column rules too), `ghost` (no rules, hover fill only), header `muted` vs `transparent` | GEI(striped, bordered) CAR(zebra) PRI(Container) SHA |
| row interaction | static; hover highlight (`interactive`); clickable row (row link via stretched link in the primary cell; inner controls still work); selected (soft accent fill, inset accent bar optional); `appearance` brand / neutral for selected | GEI FLU(TableRow appearance) |
| selection | checkbox column (multi) with header select-all + indeterminate; radio column (single); `subtle` selection: checkbox appears on row hover / focus or when any row is selected; Shift-click range select; select across pages notice ("All 25 on this page selected. Select all 312") | FLU(TableSelectionCell checkbox, radio, subtle) CAR NOT |
| batch bar | replaces the toolbar while rows are selected: count, actions, cancel; slides in | CAR(batch actions) |
| sorting | sortable header = a button inside `<th aria-sort>`; icon shows direction and appears on hover when unsorted (`NONE`); click cycles asc -> desc -> none; multi-sort with priority numbers; sort types alphanumeric / basic / datetime / custom; external (server) sorting | PRI(SortHeader ASC, DESC, NONE; sortBy; externalSorting) FLU(sortable) MUI(TableSortLabel) |
| columns | width `grow`, `growCollapse`, `auto`, fixed; min / max; resizable (drag handle on header edge, double-click auto-fit, keyboard); reorder by drag; show / hide via a column menu; pinned / frozen start and end columns with a shadow edge when scrolled under; `rowHeader` column (`<th scope="row">`) | PRI(width modes, rowHeader) FLU(resizableColumns, autoFit) MUI NOT(frozen) |
| cell layouts | text; text + description (2-line); media + text (icon, avatar, thumbnail); Badge / Tag(s) with +N; avatar group; number; date via RelativeTime with full timestamp tooltip; link; Code; progress bar mini; switch / checkbox; inline actions that appear on row hover (`TableCellActions`), overflow menu button; `truncate` with tooltip vs wrap; empty value placeholder "–" muted (`CellPlaceholder`) | FLU(TableCellLayout media, main, description, truncate; TableCellActions) PRI(CellPlaceholder) NOT |
| header extras | column type icon before the label; info tooltip; header menu (sort, filter, hide, pin); filter indicator dot | NOT MUI |
| structure | caption (visible or visually hidden); title + subtitle + actions block; toolbar (search expandable or persistent, filter chips, view options, primary button); group rows (collapsible, label + count); expandable rows (chevron cell, detail region spanning all columns); spanning cells (rowspan / colspan); footer row (totals, per-column calculate: sum / avg / count); add-row button row | PRI(Title, Subtitle, Actions, Group) CAR(toolbar, expandable) SHA(TableFooter, Caption) MUI(spanning, collapsible) NOT(calculate, add row) |
| scroll | horizontal scroll inside the container with edge shadows; sticky header (within container or to page); sticky first column; max-height body scroll; virtualised rows (windowing) as an opt-in with fixed row height | MUI(stickyHeader) GEI(virtualized) FLU |
| states | loading: skeleton rows matching column widths (`rows`, default 10) or spinner overlay with `aria-busy`; empty: Empty state (sm) spanning all columns with clear-filters action; error: inline error with retry (`ErrorDialog`); row states: disabled, loading, new (flash highlight fades 2s), dragging (rankable rows with handle) | PRI(Skeleton, ErrorDialog) ATL(loading, empty, rankable) |
| pagination | table footer form from file 02; `showPages` responsive; page size select | PRI(Table.Pagination) CAR MUI |
| responsive | horizontal scroll (default); priority columns hide at breakpoints; stacked "card rows" below a width (each cell becomes label: value) | product pattern |
| editing (light) | inline editable cell: click or Enter to edit with Input / Select in place, Esc cancels, Tab commits and moves; full editing belongs to Data grid | NOT MUI |

### Markup

```html
<div class="area-table-wrapper area-table-wrapper--contained">
  <div class="area-table__titlebar">…</div>
  <div class="area-table__scroll" tabindex="0" role="region" aria-labelledby="tt">
    <table class="area-table area-table--md area-table--interactive">
      <caption class="area-visually-hidden" id="tt">Deployments</caption>
      <thead><tr>
        <th class="area-table__select"><input type="checkbox" aria-label="Select all rows" /></th>
        <th aria-sort="ascending"><button class="area-table__sort">Name <svg aria-hidden="true">…</svg></button></th>
        <th class="area-table__cell area-table__cell--numeric">Updated</th>
        <th class="area-table__actions"><span class="area-visually-hidden">Actions</span></th>
      </tr></thead>
      <tbody><tr aria-selected="false">
        <td class="area-table__select"><input type="checkbox" aria-label="Select checkout-service" /></td>
        <th scope="row"><div class="area-table__cell-layout">…</div></th>
        <td class="area-table__cell area-table__cell--numeric"><time datetime="…">2h ago</time></td>
        <td class="area-table__actions"><button class="area-button area-button--icon-only" aria-label="Actions for checkout-service">…</button></td>
      </tr></tbody>
    </table>
  </div>
  <div class="area-table__footer">…pagination…</div>
</div>
```

The scroll wrapper is focusable and labelled so keyboard users can scroll it. Sticky
header: `position: sticky; inset-block-start: 0` on `th` with an opaque fill and a bottom
hairline drawn with `box-shadow: inset 0 -1px` (borders do not stick with
`border-collapse: collapse`; use `border-spacing: 0` + shadows instead). Sort changes and
selection counts announce through a polite live region.

### Demo list

1 default contained. 2 variants. 3 size ramp. 4 alignment showcase (text, numbers, dates,
status, actions). 5 cell layouts gallery. 6 hover + clickable rows with a working inner
menu. 7 checkbox selection + batch bar; subtle selection; radio selection. 8 sorting incl.
unsorted hover affordance. 9 column widths + resize + pinned first column with scroll
shadow. 10 sticky header in a 320px-high container. 11 groups collapsible. 12 expandable
rows. 13 footer totals. 14 toolbar with search and filter chips. 15 loading skeleton, empty,
error. 16 pagination footer. 17 truncation vs wrap. 18 responsive card rows. 19 inline edit
cell. 20 full recipe: "Deployments" with everything on. 21 dark, RTL, 200% zoom.

### Pitfalls

Number columns start-aligned. Header and cell paddings differing so text does not line up.
Sticky header losing its border. Row click handlers on `<tr>` with no keyboard path.
Select-all without indeterminate. Horizontal scroll on the page instead of the wrapper.
Row actions hidden from keyboard users because they only appear on `:hover` (also show on
`:focus-within` and when the row is selected).

---

## Code block

Area's **Code** (inline) is complete; this is the block form. **Aliases:** CodeBlock (OAI
ATL GEI), CodeSnippet multi (CAR), code block (NOT), plus the chat-product conventions from
ChatGPT and Cursor (direct product observation).

### Anatomy

```
 ┌codeblock (muted or sunken surface, radius, 1px soft stroke)────────────────────────────┐
 │ header: [file icon] src/tokens/space.css   | or |  css           [Wrap] [Copy] [⋯]     │
 │         or language tabs:  [ npm ] [ pnpm ] [ yarn ]                                   │
 ├────────────────────────────────────────────────────────────────────────────────────────┤
 │  1 │ :root {                                                                           │
 │  2 │+  --area-space-24: 24px;          <- added line: success tint, "+" in the gutter  │
 │  3 │-  --area-space-24: 20px;          <- removed line: danger tint, "-" in the gutter │
 │▌ 4 │   --area-space-32: 32px;          <- highlighted line: accent bar + soft tint     │
 │  5 │ }                                                                                 │
 ├─────────────── fade + [ Show 42 more lines ] ─────────────────────────────────────────┤
 │ caption / footer (optional)                                                            │
 └────────────────────────────────────────────────────────────────────────────────────────┘
 parts: root, header, title (filename | language), tabs, actions (copy, wrap, download, run, more),
        pre, code, line, gutter (line-number, diff-marker), highlight, expand, caption
```

Line numbers: end-aligned, tabular, muted, `user-select: none`, width from digit count
(`ch`), separated from code by padding not a rule. Code inline padding matches the header's.
Line backgrounds (highlight, diff) bleed full width including the gutter, even when the
code scrolls horizontally: make each line `display: block; min-inline-size: max-content`
inside a scroll container, or use a grid with the gutter `position: sticky; inset-inline-start: 0`.

### Build list

| Axis | Value | Sources |
| --- | --- | --- |
| variant | `sunken` (muted fill, default), `outline` (surface + stroke), `inverted` (always-dark block in a light UI), `plain` (no chrome, for inside cards) | GEI(Snippet inverted) CAR(light) NOT |
| header | none; language label; filename with file-type icon; language / package-manager **tabs** (switcher, remembers choice across blocks on the page); path + "open" link | GEI(filename, language switcher) FIG(language dropdown) NOT(language picker on hover) |
| actions | copy (icon button; swaps to check + "Copied" tooltip for about 1.5s; also announces); wrap toggle; download; run / apply (chat products); collapse; overflow menu. Placement: in header, or floating top-end inside the block, visible on hover / focus-within when there is no header | OAI(copy) CAR(copy feedback, hideCopyButton) NOT ChatGPT Cursor |
| line numbers | off (default for short snippets), on, custom start line | GEI ATL(showLineNumbers) |
| emphasis | highlighted lines / ranges ("2,5-7"); dim the rest (`focus` mode); added / removed diff lines; word-level diff highlights; referenced / linkable lines (`#L12`) with hover anchor; inline annotation callouts pinned to a line | GEI(highlighted, added / removed, referenced) ATL(highlight) |
| wrapping | horizontal scroll (default) with edge fade; soft wrap with hanging indent and a wrap marker; toggle | ATL(shouldWrapLongLines) CAR(wrapText) NOT |
| height | hug; `maxHeight` with vertical scroll and sticky header; **collapsed** with "Show more" + bottom fade (`maxCollapsedRows`), "Show less" when open | CAR(show more / less) ChatGPT |
| size | sm (12px mono, line-height 18-20), md (13px / 20-22), lg (14px / 24) | |
| syntax | token colours as `--area-code-syntax-1..n` semantic tokens (keyword, string, number / constant, function, comment, tag, attribute, punctuation) with light and dark values; highlighting engine is pluggable (Shiki / Prism classes map to the tokens). OAI ships exactly five syntax tokens | OAI(`--codeblock-syntax-1..5`) |
| kinds | **terminal** (prompt glyph `$` non-selectable per line, output lines muted), **diff** (unified: gutter markers; split view optional), **multi-file** (tabs + per-tab filename), **streaming** (caret at end, auto-scroll pinned to bottom unless the user scrolls up, actions disabled until done) | GEI(Snippet prompt) ChatGPT Cursor |
| state | loading skeleton (line bones of varied widths); error (failed to highlight falls back to plain) | CAR(skeleton) |
| caption | muted text below, inside the frame or outside | NOT |

Semantics: `<figure>` + `<figcaption>` when captioned; `<pre><code class="language-css">`;
the scrollable `pre` is `tabindex="0"` with `role="region"` and a label (filename or "Code
example, CSS"); diff markers have visually hidden "added" / "removed" text; copy copies raw
text without prompts, line numbers, or markers.

Demos: default; variants; header forms; package-manager tabs synced across two blocks; copy
feedback; line numbers; highlighted + dimmed; diff; word diff; referenced lines; wrap vs
scroll with a 300-char line; max-height with sticky header; collapsed show more; sizes;
terminal; multi-file; streaming; skeleton; caption; syntax token swatch table, light and
dark; in a chat message bubble; in a docs page.

## Snippet

Single-line (or few-line) copyable command. `[$] npm i @area/react        [copy]`, height =
control md, mono, prompt glyph non-selectable, copy button end, the whole snippet clickable
to copy as an option. Build list: prompt on / off, custom prompt (`>`, `#`); multi-line
(each line prompted); variants outline / sunken / inverted; tones success / warning /
danger (GEI types); sizes sm / md / lg; `block` width with truncation + horizontal scroll;
copy callback + feedback; CAR's `inline` form is Area's existing Code with a copy action.
Sources: GEI(Snippet) CAR(CodeSnippet single).

---

## List / Item

**Job:** vertical collection of similar rows, static or interactive. The layout primitive
that Menu items, Persona, settings rows, and search results all share. Build `Item` once
and let those consume its tokens.
**Aliases:** Item (SHA), ActionList (PRI), List (FLU M3 MUI), Contained list and
Structured list (CAR), Entity (GEI).

```
 ┌item──────────────────────────────────────────────────────────────────────┐
 │ [leading: icon | avatar | image | checkbox]  Title        [meta] [actions]│
 │                                             Description (1-2 lines)      │
 └──────────────────────────────────────────────────────────────────────────┘
 grid: [leading auto] [content 1fr] [trailing auto]; leading aligns to the title line for
 icons and to the block centre for avatars / images taller than one line
```

| Axis | Value | Sources |
| --- | --- | --- |
| item variant | `plain`, `outline` (each item bordered), `muted` (soft fill) | SHA(default, outline, muted) |
| item size | sm (gap 10, padding 12 x 16), md (gap 16, padding 16); 1-line 32-40, 2-line 48-56, 3-line 64-72 | SHA(default, sm) M3(1, 2, 3-line) CAR(sm to xl) |
| leading | icon (plain or in a soft tile: `media=icon`), avatar, image thumb 40-56 (`media=image`), checkbox / radio, number, drag handle | SHA(ItemMedia default, icon, image) M3 |
| content | title; + description (clamp 1-2); + header row above (eyebrow, image) and footer row below (meta) | SHA(ItemHeader, ItemFooter) |
| trailing | meta text, Badge, Kbd, chevron (navigates), button(s), switch, checkbox, menu; hover-only actions | M3 MUI(secondary action) |
| interaction | static; navigable (link / button row, hover fill, chevron); selectable single / multiple; `disabledSelection` | FLU(navigable, selectable) SHA(asChild) PRI(selectionVariant) |
| list variant | `plain`; `divided` (hairlines inset to the content column, full, or none: PRI `showDividers`); `contained` (outline box, flush rows); `inset` (rows inset from the container with radius: PRI `inset`, HIG inset grouped); `horizontal-inset` | PRI(inset, horizontal-inset, full; showDividers) CAR(isInset) HIG |
| list structure | group headings (subtle / filled, sticky on scroll, auxiliary text, header action button, header search: CAR `kind=on-page|disclosed`); separators; ordered numbering; "Show more" footer | CAR(ContainedList) PRI(Group, GroupHeading) MUI(ListSubheader sticky) |
| density | `disableItemGap` / dense | PRI MUI(dense) |
| function | reorder by drag with keyboard alternative; virtualisation; skeleton rows; empty state | FLU |

Semantics: `ul` / `ol` > `li` static; selectable = `listbox` / `option`; navigable rows are
links or buttons inside `li`. Demos: item variants; sizes; 1/2/3-line; leading kinds;
trailing kinds; navigable with chevrons; selectable single / multi; list variants incl.
inset grouped settings; headings sticky; header with action / search; reorder; skeleton;
recipes: search results, file list, notification list, integrations list with switches.

---

## Description list

**Job:** label-value pairs for an object's properties. **Aliases:** Description (GEI),
Structured list (CAR), key-value list, page properties (NOT), inspect panel rows (FIG).

| Axis | Value | Sources |
| --- | --- | --- |
| layout | `stacked` (label above value); `inline` (label column fixed 120-200px or `max-content`, value column 1fr; labels top-aligned to the value's first line); `grid` (2-4 columns of stacked pairs, container-query responsive); `justified` (label start, value end, dotted or blank leader) for receipts and summaries | GEI NOT FIG |
| dividers | none; hairlines between rows; zebra | CAR |
| size | sm / md / lg (type and row gap) | |
| label | muted, one step smaller in stacked mode; optional leading icon (property type); info tooltip | GEI(tooltip) NOT(type icons) |
| value types | text, multi-line text (clamp + "Show more"), link, Badge / Tag(s), Persona, date (RelativeTime + absolute tooltip), number with unit, Code with copy, boolean icon, **empty** ("Empty" / "–" muted) | NOT |
| actions | copy-on-hover button at value end; edit-in-place (value becomes Input / Select on click; hover fill shows affordance, NOT style); row-level menu | NOT FIG |
| state | loading skeleton per value; error | |

Semantics: `<dl>` with `<div>` wrappers per pair, `<dt>` / `<dd>`. Demos: each layout; with
dividers; value type gallery; copy action; editable row; grid responsive; in a side drawer
(record details); in a card; skeleton.

---

## Stat

**Job:** one key number with its context. **Aliases:** Stat / KPI / Metric. None of the
seven required benchmarks ships this as a named component; evidence is inference from
product dashboards (Vercel, Notion charts) and from Chakra, Ant, Tremor outside the
evidence set. Record it that way in the report.

```
 Label  (i)                        ┌───────────┐
 12,480            ▲ 8.2%          │ sparkline │
 vs 11,532 last week               └───────────┘
 parts: root, label, help, value, unit, delta (icon, value), comparison text, chart slot, icon tile, progress-to-goal
```

| Axis | Value |
| --- | --- |
| size | sm (value = title sm), md, lg (display size); value uses tabular, lining numerals; unit / currency in a lighter weight and smaller size, baseline-aligned |
| delta | up / down / flat with icon + percent or absolute; tone success / danger / neutral; `invertTrend` for lower-is-better metrics; as inline text or as a soft Badge |
| layout | stacked (label over value), value-first (value over label), horizontal (icon tile start, text end), with chart end or chart below full-bleed |
| extras | help tooltip on label; comparison line; progress-to-goal bar with "72% of 20k goal"; footer link "View report" |
| group | StatGroup: `joined` (one card, dividers between stats, equal columns, wraps by container query) or `separate` cards in a grid |
| format | compact notation (12.4k), locale, precision, duration, bytes via a `format` prop built on `Intl.NumberFormat` |
| state | loading (skeleton for value and delta), no data ("–"), error |

---

## Timeline

**Job:** chronological list of events. **Aliases:** Timeline (PRI, MUI lab), activity feed.

```
   (●)── Mira Okafor deployed checkout-service to production      2h ago
    │
   (✓)── Review approved by Jonas Lindqvist                       3h ago
    │     ┌──────────────────────────────────────────┐
  (av)── │ comment card with body text              │            <- comment item: avatar marker + card
    │     └──────────────────────────────────────────┘
    ┆    ── 12 hidden items · Load more ──                         <- break
 parts: root (ol), item, marker (dot | icon badge | avatar), connector, body, time, actions, break
```

| Axis | Value | Sources |
| --- | --- | --- |
| marker | dot 8, icon badge 20-32 (tone filled circle with icon), avatar, number, none | PRI(Timeline.Badge tones, Timeline.Avatar) MUI(dot filled, outlined) |
| tone | neutral + accent, success, attention, severe, danger, done, open, closed | PRI |
| density | default; `condensed` (smaller marker, tighter gaps, single-line bodies) | PRI(condensed) |
| connector | solid, dashed (pending / future), none; `clipSidebar` start / end / both trims the line above the first and below the last marker | PRI(clipSidebar) MUI |
| position | content end (default); content start; alternating; opposite content (time on the other side of the line) | MUI(left, right, alternate, alternate-reverse) |
| item kinds | event (one line), comment (card), grouped ("3 commits", expandable), date separator heading, `Break` with load-more | PRI(Break) |
| orientation | vertical; horizontal (milestones) | |
| state | current / in-progress marker with pulse; future items muted; skeleton | |

Semantics: `<ol>`; times in `<time datetime>`; marker icons get visually hidden text for
the event type. Marker centre aligns to the first text line's centre; the connector runs
marker centre to marker centre and never shows through a marker (give markers a surface ring).
