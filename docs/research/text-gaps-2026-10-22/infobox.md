# Infobox rethink: measurements, references, and whether it needs to be its own family

2026-10-22. Read-only research. Owner's note: "the gaps between the columns is huge, i want to make sure the correct
type styles are used … is it necessary?"

## 1. Area today

Values are at the app's setting (type 13, Compact). From `packages/tokens/src/axes/type-size.ts:11-16,39`: at 13, UI text
(`text-sm` = `ui-size`) is 13/18, title-xs is 15/22 (the reading size, base + 2), and `weight-strong` is 500.

### Infobox (`packages/styles/src/components/infobox.css`)

| Part | Value | Where |
|---|---|---|
| Label column | **fixed 120px** (`--_label-column`), whatever the labels are | :19, :75 |
| Label → value gap | 8 (`column-gap`), added after the 120 column | :75 |
| Row gap | 4 | :74 |
| Stacked layout | label 4 above its value, pairs 8 apart | :80-81 |
| Header → sections, section → section | 12; a 1px rule between sections (`border-divider`, or `border-decorative` when framed) | :24, :64-70 |
| Section heading → rows | 6 | :63 |
| Media → title row; title → subtitle | 8; 2 | :43, :51 |
| Framed padding | 12 − border (Card's paint) | :33-39 |
| Width | fills its column. The demo is 288 (`space-96 × 3`) | `apps/desktop/src/content/demos/infobox.tsx:6` |

| Text | Role | Weight | Ink | Where |
|---|---|---|---|---|
| Title | title-xs, 15/22 | 500 | default | infobox.css:53-59 |
| Subtitle | UI, 13/18 | 400 | `fg-muted` | :60 |
| Section heading | UI, 13/18 | 500 | default | :71 |
| Label | UI, 13/18 | 400 | `fg-muted` | :76 |
| Value | UI, 13/18 | 400 | default | :27-29, :82 |

**Why the gap looks huge.** The demo labels are one short word ("Label" is about 32px at 13). In a 288 box, the
fixed 120 column plus the 8 gap leaves roughly **96px of empty space** before every value, which is about a third of
the box. The 120 came from Wikipedia's 123 of 296 (spec: Decisions, "rows"). Wikipedia's column isn't fixed, though. It
is an auto-layout table column, so it is as wide as that article's labels ("Education", "Known for", wrapping labels).
In MediaWiki:Common.css `.infobox` has no column width, just `border-spacing: 3px`. Radix and Chakra's 120 is a
*minimum*, set with `min-width` on an `auto` column, at 14–16px type with real labels. So Area copied a
content-driven width as a constant.

**Type roles.** They're consistent with the system, and the owner's concern isn't with them:

- The title is Card's and Dialog's surface title (title-xs, strong).
- Headings match Panel's heading: 500, default ink, the UI size (`docs/specs/panel.md:121`).
- Labels and values match Description list: a muted regular term and a default value.
- `DESIGN_SYSTEM.md:334-336` asks a free-text component to state its role. Infobox sets `ui-size`, which is `text-sm`,
  the role Card uses.

One weakness: heading, label and value are all 13/18. The heading differs only by weight and the label only by ink, so
in the narrow box they read as one flat column. No reference uses a smaller label size, except Figma, where everything
is 11. So the fix belongs in spacing, not type.

### Peers

| Peer | Label column | Label → value | Row rhythm | Label type | Where |
|---|---|---|---|---|---|
| **Description list** `columns` | **fixed 160** (Notion), term padded 6 | value text at 174 (8 margin + 6 inset): 14 after the column | rows 34 (`ui-row` + 2), 4 apart (0 compact) | UI, 400, `fg-muted`, optional 16 icon | `description-list.css:13-18,45-62` |
| Description list `justified` | auto (the term at the start, the value at the end) | 24 | padding 12 / 16, no gap | UI, 500, default ink | :66-76 |
| Field `horizontal` | **max-content** (the label's own width) | 8 | — | 400 `fg-muted` | `docs/specs/field.md:56,91` |
| Property list | none (value + actions; Figma's fill rows) | — | 8 (compact 6) | — | `property-list.css:1-25`. A different job, not a peer for this |
| Card | — | — | — | title-xs 500 title, `text-sm` body | `surface.css:57-61,249-255` |

Infobox's rows are its own copy of Description list `columns` with different numbers (120 vs 160, 8 vs 14, 4-gap text
rows vs 34-tall rows). Description list has no stacked layout; Infobox does.

## 2. References

Values marked read come from the source files listed under Sources. [unverified] means recalled or not measured.

| Product / system | Label column | Label → value gap | Row gap | Label type | Value type | Frame |
|---|---|---|---|---|---|---|
| **Wikipedia** infobox | **auto** (table column sized by its labels); about 40% of 296 on Lisa Su | about 4 (`border-spacing: 3px` + 1px cell padding) | about 5 | 88% (14.08) **bold**, default ink | 88%, regular | 1px `#a2a9b1`, `#f8f9fa`, 22em float |
| **Radix Themes** DataList | **`auto 1fr` grid with subgrid** (every row's label shares one column), label `min-width: 120px` | grid gap: **12** (size 1), **16** (size 2), 20 (size 3) | same gap as the columns | inherits (size 1–3 text), regular, `--gray-a11` (muted) | regular, default | none |
| **Chakra** DataList | horizontal: `min-width: 120px` per label (flex) | `gap: 4` = **16** | 12 / 16 / 20 (sm / md / lg) | `fg.muted`, regular (`subtle`, default); `bold` variant: 500 label, muted value | default | none. **Default orientation is vertical** (gap 4) |
| **Ant Design** Descriptions | **auto**: the label is as wide as its text, plus a colon | colon, then `marginXS` = **8** | `itemPaddingBottom` 16 | 14/22, 400, `colorTextTertiary` (45% black) | 14/22, `colorText` | none; `bordered` is a table look |
| **Polaris** DescriptionList | **25%** (`flex: 0 1 25%`), stacked below `sm` | term padding-right **16** (8 tight) | 16 padding per pair (8 tight), 1px rule between pairs | **semibold**, default ink | regular | none |
| **GOV.UK** Summary list | **30%** (key), stacked on mobile | padding-right **20** (`spacing(4)`) | 10 above and below + 1px rule | **bold** | regular | none |
| **Notion** page properties (Area capture) | **fixed 160** | text 14 after the column | rows 34, 4 apart | 14/20 400, muted rgb(125,122,117), 16 icon | 14/20 default | none |
| **ChatGPT** Settings › Account (Area capture) | auto, justified | the value at the end, 24 minimum | 12 / 16 padded rows, rules | 14/20 **500**, default | 14/20 | 1px, corner 16 |
| **App Store** Information (Area round 34) | stacked | label 4 above the value | grid, 24 row / 20 column gap | `--systemSecondary` (muted) | default | none |
| **GitHub** About sidebar (Area round 34) | **no label column**: icon + text rows, headings, a 1px rule between sections | — | 8 (`mt-2`) | headings 16 semibold | — | none |
| **Figma** inspector (Area captures) | label above the field, or a field prefix ("W") | — | 8 | 11/16, 550 section title | 11/16 | docked |
| Linear issue sidebar | short muted labels in a narrow column with rich values [unverified, closed source, not captured] | — | — | muted | — | none |
| Jira issue "Details" | label column about 40%, muted [unverified] | — | — | — | — | — |
| Primer, Carbon, Material, shadcn/ui, Atlassian DS | **no description list or infobox component** [unverified recall; Area's `component-gap-audit.md` already lists Untitled UI, shadcn and Primer as shipping none] | | | | | |

What the references agree on:

1. **No fixed label column at a narrow width.** The systems size it to the labels (Wikipedia, Ant, Radix's `auto` with
   a minimum, Area's own Field) or as a share of the width (Polaris 25%, GOV.UK 30%). Notion's fixed 160 suits a
   full-width page, not a 288 box.
2. **Label → value gap: 8–20.** Ant 8, Radix 12/16, Chakra 16, Polaris 16, GOV.UK 20, Notion 14. Wikipedia is denser,
   about 4.
3. **Labels are muted and regular in product and React systems** (Notion, Radix, Chakra, Ant, App Store). They're bold
   in editorial and government ones (Wikipedia, GOV.UK, Polaris). Area's muted regular label fits its target products.
4. **Same size for label and value.** All of them do this except Figma.
5. **The "infobox" with a title, media and sections exists only on Wikipedia and the Google knowledge panel.** Design
   systems ship the rows (DataList, Descriptions, DescriptionList, Summary list) and leave the header to Card or a
   heading. Ant's title and `extra` are the exception, and they're thin.

## 3. Is Infobox necessary?

It doesn't need its own rows. The header (media, title, subtitle, action) is Card's header. The section heading is
Section heading's or Panel's role. The rows duplicate Description list `columns` with different numbers. The only
things Infobox owns are:

- the dense rhythm the owner asked for in round 34;
- the `stacked` layout;
- the 1px rule between sections.

The first two are Description list layouts or options. The third is a Separator.

### What the rows would be if aligned

| Value | Today | Aligned to the references | Aligned to Area's Description list |
|---|---|---|---|
| Label column | fixed 120 | **auto: the longest label sets one shared column** (grid `max-content minmax(0,1fr)` with subgrid across rows, as Radix), capped near 40% so a long label wraps (Wikipedia's share; Polaris 25%, GOV.UK 30%) | 160 fixed. This would make the gap worse in a 288 box, so the narrow case needs the auto column anyway |
| Label → value | 8 after the column (about 96 of air with short labels) | **12** (Radix size 1; at type 13 between Ant's 8 and Chakra's 16) | 14 (8 + 6 inset) |
| Row gap | 4 (text rows) | 4 to keep the density the owner liked (Wikipedia about 5); 8–12 for an airier list (Radix, Chakra) | rows 34 tall, 4 apart |
| Label type | UI 13/18, 400, muted | the same | the same |
| Value type | UI 13/18, 400, default | the same | the same |

With "Label" at about 32 and a 12 gap, the value starts about 44 from the edge instead of 128.

## Recommendation (options)

**A. Keep Infobox, fix the column (smallest change).** Change `--_label-column` from 120 to an auto shared column:
`grid-template-columns: max-content minmax(0,1fr)` on `__rows`, with the rows as subgrid (`display: contents` or
subgrid), `max-inline-size` about 40% on the label, and a 12 column gap. Type roles stay as they are. This touches
`infobox.css`, the spec and the demo. Description list stays as it is.

**B. Recommended: make Infobox a composition over Description list.**

- Give Description list an auto (`fit`) term column, Radix's `auto` grid with subgrid and a 12 gap.
- Give it a `stacked` layout. Its spec excluded this because "no product shows it"; the App Store's Information list now
  does (round 34).
- Give it a dense row rhythm (text rows, 4 apart).

Infobox then becomes Card or Surface's header, plus a Section heading, plus Description list per section, plus
Separator. It's kept as a thin wrapper or as a documented composition, so there's one row system to tune. This follows
AGENTS.md ("rules and compositions before new sizes") and changes an approved family (Description list), so the owner
has to agree.

**C. Retire Infobox.** Document the composition on Description list's and Card's Documentation tabs, and remove the
family. Only one target product, Wikipedia, ships a titled infobox. The owner's memory note says that absence from the
targets doesn't rule a component out, so this is the most aggressive option. It would also lose the approved round
34–36 work.

Not recommended: smaller label type, bold labels, or keeping a fixed column at any width.

## Sources

- Radix Themes `data-list.css`:
  https://github.com/radix-ui/themes/blob/main/packages/radix-ui-themes/src/components/data-list.css
  - lines 9-11: the label is `--gray-a11`;
  - lines 76-86: gaps are space-3, space-4, and space-4 × 1.25;
  - lines 120-142: `auto 1fr`, subgrid, label `min-width: 120px`;
  - lines 98-111: vertical, `space-1`.
- Chakra UI `data-list.ts`: https://github.com/chakra-ui/chakra-ui/blob/main/packages/react/src/theme/recipes/data-list.ts
  - lines 26-33: horizontal, gap 4, label min 120;
  - lines 47-71: sizes, gap 3/4/5;
  - lines 73-93: `subtle` muted label, default vertical.
- Ant Design Descriptions style: https://github.com/ant-design/ant-design/blob/master/components/descriptions/style/index.ts
  - label lines 187-203: 400, `colorTextTertiary`, a colon with `marginXS`;
  - tokens lines 248-259: `itemPaddingBottom: padding` (16).
- Polaris `DescriptionList.module.css`:
  https://github.com/Shopify/polaris/blob/main/polaris-react/src/components/DescriptionList/DescriptionList.module.css
  - lines 13-35: semibold term, 25%, padding 16;
  - lines 30-61: 1px rules.
- GOV.UK Summary list `_mixin.scss`:
  https://github.com/alphagov/govuk-frontend/blob/main/packages/govuk-frontend/src/govuk/components/summary-list/_mixin.scss
  - key 30% and bold (lines 87-90);
  - cell padding `spacing(2)` / `spacing(4)` (lines 59-62).
- Wikipedia:
  - MediaWiki:Common.css, https://en.wikipedia.org/w/index.php?title=MediaWiki:Common.css&action=raw: `.infobox` 88%,
    line-height 1.5em, border-spacing 3px, padding 0.2em, 22em float, top-aligned cells, no column width;
  - Module:Infobox/styles.css: https://en.wikipedia.org/w/index.php?title=Module:Infobox/styles.css&action=raw
  - Lisa Su computed values: `docs/research/articles-rethink-2026-10-17/round-35-measurements.md`.
- Notion, ChatGPT: `docs/specs/description-list.md` (Measurements; captures in `docs/research/captures/description-list/`).
- GitHub About, App Store, Figma, Linear and Jira: `docs/research/articles-rethink-2026-10-17/figure-infobox.md:63-73`.
  Linear and Jira are unverified there too.
- Source files were downloaded on 2026-10-22 from each repo's default branch (main or master).
