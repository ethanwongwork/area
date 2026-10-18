# Inline list and Navbox: rethink survey, 2026-10-17

The owner's review verdict on both was **Rethink**: they read as Wikipedia only (the hlist's bold middle dots; the
navbox's centred title band, tinted group-label column, stripes and Hide toggle), and should be "simple and consistent
and cohesive with the system". This note surveys how products and design systems other than Wikipedia draw the two
patterns and recommends Area-native designs. Specs: `docs/specs/inline-list.md`, `docs/specs/navbox.md`. Nothing is
built from this note yet.

Method: public source read on 2026-10-17. Design-system sources were shallow-cloned (commit given) or read from the
published npm package on unpkg (version given). Product pages were fetched logged out with `curl` (no sign-in, no state
change) and their footer markup and shipped CSS read. Values not read from a source are marked **unverified**.

## 1. Inline list

### Sources

| # | Source | Kind | Separator | Gap | Separator ink | Wrapping | Pin |
|---|---|---|---|---|---|---|---|
| I1 | GitHub repo list (meta row: language · stars · forks · "Updated …") | product | **none**; each item led by its icon | `mr-3` = 16px after each item | n/a; row is `f6` (12px) `color-fg-muted`, links `Link--muted` | inline, wraps naturally | github.com/torvalds?tab=repositories, `div.f6.color-fg-muted.mt-2 > span.tmp-mr-3 / a.Link--muted.tmp-mr-3` |
| I2 | GitHub app footer (Terms, Privacy, Security …) | product | **none** | `li.mx-2` = 8 + 8 = 16px | links `Link--secondary`, row `f6 color-fg-muted` | `ul.d-flex.flex-wrap` | same page, `footer.footer.f6.color-fg-muted > ul.list-style-none.d-flex.flex-justify-center.flex-wrap > li.mx-2` |
| I3 | Atlassian `Inline` primitive, `separator` prop | design system | any string or node, inserted between children (not after the last) | the Inline's `space` gap; separator `marginInline: -2px` pulls it 2px into the gap on each side | `color.text.subtle` (#42526E fallback), i.e. quieter than the items | `shouldWrap` default false | `@atlaskit/primitives@22.6.0` `dist/esm/components/inline.js` L21–24 (separator style), L54–70 (insertion), L85–87 (gap, wrap) |
| I4 | Docusaurus "simple" footer links (Infima) | design system | `·` in its own `span.footer__link-separator` | `margin: 0 0.5rem` each side (8px) | inherits footer ink; links `--ifm-color-emphasis-700` | at narrow widths separators are `display: none` and links stack one per line | docusaurus@7b6826b `packages/docusaurus-theme-classic/src/theme/Footer/Links/Simple/index.tsx` L14; infima@c123556 `packages/core/styles/components/footer.pcss` L13, L41–52, L74–88 |
| I5 | Bootstrap `.list-inline` | design system | **none** | `margin-inline-end: calc(var(--spacer) / 2)` = 8px, not after the last | n/a | `inline-block` items, wrap naturally | bootstrap@548f671 `scss/content/_lists.scss` L13–21 |
| I6 | GOV.UK footer `__inline-list` | design system | **none** | `margin-right: spacing(3)` = 15px, `margin-bottom: spacing(1)` = 5px between wrapped lines | n/a | `inline-block`, wraps | govuk-frontend@ad8b0ca `packages/govuk-frontend/src/govuk/components/footer/_mixin.scss` L127–149 |
| I7 | shadcn/ui Separator, vertical (Blog \| Docs \| Source) | design system | 1px vertical **rule** (`Separator orientation="vertical"`), `bg-border` | `gap-4` = 16px each side | `--border` (the divider colour) | `flex`, no wrap; row `h-5` (20px) so the rule is 20px | shadcn-ui/ui@d2fba50 `apps/v4/examples/radix/separator-vertical.tsx` L5–10; `apps/v4/registry/new-york-v4/ui/separator.tsx` L19 |
| I8 | Radix Themes Separator | design system | 1px rule | set by parent `Flex gap` | `--accent-a6` | — | radix-ui/themes@1faff10 `packages/radix-ui-themes/src/components/separator.css` L1–35 (vertical size-1 = `--space-4`, 16px tall) |
| I9 | MUI `Stack divider` + `Divider flexItem` | design system | any node between children (`joinChildren`); typically a vertical Divider | Stack `spacing` | `palette.divider` | Stack wraps only with `flexWrap` + `useFlexGap` | `@mui/system@9.5.0` `Stack/createStack.mjs` L36, L159; `@mui/material@9.5.0` `Divider/Divider.mjs` L45 (colour), L89 (thin), L93–97 (flexItem stretches) |
| I10 | Apple global footer legal links (Privacy Policy \| Terms of Use \| …) | product | 1px × 10px **pipe** in `::after`, hidden on the last item | link `padding: 0 9px` → 9px each side of the pipe | `--footer-pipe-color` (lighter than links `rgba(0,0,0,.72)`) | `inline-block` items, wrap | apple.com `/ac/globalfooter/8/en_US/styles/ac-globalfooter.built.css`, `.ac-gf-footer-legal-links-item:after`, `.ac-gf-footer-legal-link` |
| I11 | MDN footer Mozilla links row | product | **none** | `column-gap: 1rem` (16px) | links `inherit` (`--color-text-secondary`) | `flex-wrap: wrap`, `line-height: 2` | mdn/fred@711e325 `components/footer/server.css` L213–228 |
| I12 | shadcn Breadcrumb (path, for contrast) | design system | chevron icon | `gap-1.5` (6px), `sm:gap-2.5` | whole trail `text-muted-foreground` | `flex-wrap` | shadcn-ui/ui@d2fba50 `apps/v4/registry/new-york-v4/ui/breadcrumb.tsx` L15 |
| I13 | YouTube video meta ("1.2M views • 2 days ago") | product | `•` | ~4px each side | muted, as the text | wraps | **unverified** (not read from source) |
| I14 | Medium byline ("4 min read · Oct 1") | product | `·` | small | muted | — | **unverified** |
| I15 | Linear issue row meta, Notion page meta, ChatGPT source chips | product | mostly **none**: icon-led items or chips spaced by gap | — | muted | — | **unverified** (logged-in apps; not captured this round) |
| I16 | Polaris `InlineStack`, Carbon, Material 3, Apple HIG, Geist | design system | no separator component; `InlineStack` and peers offer gap only | — | — | — | **unverified** (Polaris 13.9.5 CSS fetched; class not found under that name) |

### What the sources agree on

- **No one bolds the separator.** Wikipedia's bold `·` is the outlier. Where a glyph or rule exists, it is *quieter than
  the items*: Atlassian `text.subtle`, Apple's pipe colour, shadcn/Radix/MUI the divider colour.
- **Most rows have no glyph at all.** GitHub (twice), Bootstrap, GOV.UK and MDN separate items with space alone
  (15–16px; Bootstrap 8). Icon-led metadata (GitHub's language dot, star, fork) needs no separator because each icon
  starts its item.
- **When a separator exists it is one of two shapes:** a middle dot (Docusaurus, YouTube/Medium bylines, unverified) or
  a 1px vertical rule (shadcn, Radix, MUI, Apple). The `|` text glyph and the comma do not appear as component options;
  the rule replaces the bar, and a comma is prose.
- **Space either side of a separator ≈ 8px** (Docusaurus 8, Apple 9, Atlassian gap − 2). Without one, items sit
  ≈ 16px apart (GitHub 16, MDN 16, GOV.UK 15).
- **Separators are drawn between items, never after the last.** Only Docusaurus deals with wrap explicitly (it hides the
  separators and stacks when narrow); the rest let a separator land at a line start (Atlassian, MUI, shadcn) or attach it
  to the preceding item (Apple `::after`, Wikipedia).

### Recommendation: Inline list

Area-native shape: a flex row, `flex-wrap: wrap`, items in the context's type and ink; the separator a *mark between
items*, never text weight.

| Keep / change | Area design | Basis |
|---|---|---|
| **separator `none`** (new; for icon-led metadata) | gap only, 16 between items (`--area-space-16`) | GitHub I1/I2, MDN I11, GOV.UK I6 (15) |
| **separator `dot`** | a regular-weight `·` (not bold), 8 each side, in `--area-stroke-control` (Breadcrumb's chevron ink) or `--area-fg-muted` | Docusaurus I4; quieter-than-items per I3/I10. Breadcrumb peer for ink |
| **separator `rule`** (replaces `bar`) | Area's Separator, vertical, `border-divider`, 1px, one line's cap height or icon-md tall, 8 each side | shadcn I7, Radix I8, MUI I9, Apple I10 (10px pipe, 9 each side) |
| drop `comma` | write the commas in the text | no source offers it as a component option |
| drop bold | regular weight everywhere | every non-Wikipedia source |
| wrapping | keep the current attach-to-previous-item approach (separator in the item's `::after`, no-break), so a wrapped line never starts with a mark; row gap = the line's own leading | Apple I10 and Wikipedia attach; Docusaurus avoids leading marks by hiding them |
| ink | items inherit (so a muted meta row is just `color: fg-muted` on the list); links inside use Link `muted` / `standalone` | GitHub `Link--muted`, Atlassian |
| icon-led items | allow a leading 16px icon per item at Area's icon box + `--area-gap-md`; then use `none` | GitHub I1 |

Reuse: **Separator** (vertical, for `rule`), **Breadcrumb's separator ink** (`stroke-control`) for the dot, **Link**
`muted`/`standalone` for linked items, inset rules for icon boxes. Values above trace to the cited lines; the exact
Area token for 16 and the dot's ink choice (stroke-control vs fg-muted) want a visual pass at 13 / Compact.

## 2. Navbox (grouped related links)

### Sources

| # | Source | Kind | Group heading | Layout | Links | Frame | Collapse | Pin |
|---|---|---|---|---|---|---|---|---|
| N1 | Vercel site footer ("Vercel Directory") | product | `h2` **above**, `text-label-14 font-medium text-gray-1000` (14px, 500, strongest ink) | grid, `gap-x-6 gap-y-6` (24), each group `col-span-2` of 4/6/8/12 columns | one per line, `text-gray-900` (dimmer than heading), `py-0.5 leading-5` (20px line + 2+2), hover → gray-1000 | **none** | none | vercel.com, `footer > nav[aria-label="Vercel Directory"] > div.grid > div > h2 + ul.list-none > li.text-gray-900.py-0.5.leading-5` |
| N2 | Linear site footer | product | `h3.sectionTitle` **above**: inherits 13px (`--text-mini-size: .8125rem`, leading 1.5), `font-weight: 510`, `--color-text-primary`, `margin-bottom: 16px` (24 wide) | grid 6 → 4 → 2 columns, `column-gap: 16px`, `row-gap: 48px` | `ul` column, `gap: 2px`; link `min-height: 28px`, `--color-text-tertiary` (dimmed), hover → primary | **none** | none | linear.app shipped CSS, `.Jmh1Wq_section`, `.Jmh1Wq_sectionTitle`, `.Jmh1Wq_sectionList`, `.Jmh1Wq_sectionLink`, `.I_mUeq_variant-dimmed` |
| N3 | Apple global footer directory | product | `h3.ac-gf-directory-column-section-title` **above**, 12px, weight 400, `rgba(0,0,0,.88)` | 5 columns, several sections per column | one per line, `margin-bottom: .8em`, `rgba(0,0,0,.72)` | none (page band `rgb(245,245,247)`) | **only below 834px**: each heading becomes a full-width button with a chevron; lists expand in place (accordion) | apple.com `ac-globalfooter.built.css`: `.ac-gf-directory-column-section-title-button`, `-section-list`, `-section-item`, `--footer-directory-title-color`, `--footer-link-color` |
| N4 | GitHub marketing footer (Platform, Ecosystem, Support, Company) | product | `h3` **above**, Primer Brand `Heading--6` (smallest), monospace | one `nav` per group, `aria-labelledby` its heading; columns | `ul > li` one per line | none | none | github.com/about, `footer[role=contentinfo] > nav.column__… [aria-labelledby="footer-title-platform"] > h3 + ul` (values in hashed CSS, **unverified**) |
| N5 | Notion site footer | product | heading as the list's first `li` **above**, `padding-inline: 8`, 20 above a non-first heading, 8 below | columns of menu lists | menu-list rows: `padding-block: 3px` (no icon), `padding-inline: 8 16`, rounded hover plate | none | none | notion.com shipped CSS, `.menuList-…__heading`, `.menuList-…__menuListItemAnchor` (heading font is a token, value **unverified**) |
| N6 | MDN footer | product | `dt` **above**, `font-size: 1.25rem` | grid; groups span 1–3 columns by width (1 → 2 → 3, 2fr 1fr 1fr 1fr wide) | `dd > ul` one per line, `row-gap: .75rem`, ink `inherit` (`--color-text-secondary`), hover → primary | `border-top: 1px` on the footer only | none | mdn/fred@711e325 `components/footer/server.css` L3–7, L11–48, L144–178 |
| N7 | Docusaurus multi-column footer (Infima) | design system | `.footer__title` **above**, bold, h4 size | columns (`footer__col`) | `.footer__link-item`, `line-height: 2`, `--ifm-color-emphasis-700` | band `--ifm-color-emphasis-100` | none; columns stack under narrow widths (`margin-bottom: 3 × spacing`) | infima@c123556 `packages/core/styles/components/footer.pcss` L9–11, L41–48, L59–64, L74–88 |
| N8 | GOV.UK footer navigation | design system | `.govuk-footer__heading` **above**, with a 1px rule under it (`padding-bottom: spacing(4)`, `margin-bottom: spacing(6)`) | `inline-block` sections; long lists split into CSS columns (`column-count: 2/3`, `column-gap: gutter`) | `__list-item`, responsive margin 4 | none | none | govuk-frontend@ad8b0ca `…/footer/_mixin.scss` L151–161, L170–198 |
| N9 | Primer `ActionList.Group` heading (in-app grouped lists) | design system | **above**: `--text-body-size-small` (12px), semibold, `--fgColor-muted`, `padding-block: 6`, `padding-inline: 16`; groups 8 apart. A `filled` variant adds a muted band with top/bottom borders | single column | list rows | none (default) | none | primer/react@7f96c0d `packages/react/src/ActionList/Group.module.css` L1–7, L13–38, L45–51 |
| N10 | Area's own Nav group label (ChatGPT sidebar section title) | this system | **above**: row size, weight strong (500), `fg-muted`, one row pitch tall | single column | Nav items | none | none | `packages/styles/src/components/nav.css` `.area-nav__label` |
| N11 | Stripe docs "Next steps" / "See also"; MDN "See also"; Mintlify `CardGroup` | product / docs | a section heading, then a plain list (or a card grid in Mintlify) | single column list, or 2-column cards | — | none for lists; card frames per item in Mintlify | none | **unverified** (the fetched Stripe page, docs.stripe.com/payments/checkout, had none of these headings) |

### What the sources agree on

- **Heading above, never a label column.** All ten put a small group heading on top of its links. No source puts the
  group name in a tinted, end-aligned cell beside the links; that is Wikipedia only.
- **Links stack one per line**, in columns. No source runs a group's links as an inline list. Rows are tight (Vercel
  20 + 4, Linear 28 + 2, Notion 3px padding, Apple 0.8em).
- **No frame.** None boxes the block; at most a footer band (Apple, Docusaurus) or one top rule (MDN, GOV.UK). No
  stripes, no title band.
- **No collapse at full width.** Only Apple collapses, and only below 834px, as accordions on the group headings.
- **Heading vs links ink**: marketing footers make the heading the *strongest* ink and the links dimmer (Vercel,
  Linear, Apple, MDN, Docusaurus). In-app grouped lists (Primer, Area's own Nav after ChatGPT) do the opposite: a muted,
  semibold heading over default-ink rows. Both use weight 500/510/semibold on the heading at the links' size or 1px less.
- **Columns**: an auto grid with a 16–24 column gap (Linear 16, Vercel 24, MDN 1rem), collapsing to fewer columns by width.

### Recommendation: Navbox

Area-native shape: **a titled block of link groups, no frame**. Consider renaming to *Link groups* (or *Related links*)
since "Navbox" is Wikipedia's term; the owner decides.

| Part | Area design | Basis |
|---|---|---|
| block title (optional) | **Section heading** (title, optional lede); left-aligned, not centred, no band | Area peer (app-shell.md, approved); every source left-aligns |
| frame | **none**; optional top `border-divider` rule when it closes an article (the Separator) | N1–N9 no frame; MDN/GOV.UK top rule |
| groups | a grid `repeat(auto-fill, minmax(~10–12em, 1fr))`, column gap 16 (Linear) to 24 (Vercel); row gap between group rows ≈ 24 | N1, N2, N6 |
| group heading | **Nav's group label** treatment (`.area-nav__label`: row size, strong, `fg-muted`) above its list; or, if the owner prefers the footer reading, default ink at strong with dimmer links | Area Nav / Primer N9 (in-app); Vercel/Linear/Apple (footer). Recommend the Nav label for cohesion |
| links | one per line, **Link** `standalone` (underline on hover only), default ink (or `muted` under a default-ink heading), tight pitch ≈ the Nav row's line + 2–4 | N1 (20 + 4), N2 (28 + 2); Link peer |
| ungrouped | a group without a heading is just its list; a single group is the "See also" case: Section heading + one list | N11 |
| collapse | **drop the Hide / Show toggle**. If a long block must fold, wrap groups in **Accordion** (Apple's narrow-width behaviour), not a bespoke toggle | N3 only, and only narrow |
| drop | centred title band, control-fill label column, end-aligned labels, stripes, Card paint, inline-list links | Wikipedia-only traits; no other source has them |

Variants worth keeping: **with / without block title**; **grouped / single list**; column count left to the grid
(no `columns` prop unless a demo needs a fixed count). Size follows the context's type (13 in the app), no own size axis.

## Open questions for the owner

1. Inline list default: `none` (gap only, GitHub/MDN) or `dot`? Recommendation: `dot` stays the demo default for
   bylines, `none` documented for icon-led metadata.
2. Navbox group heading: muted strong (Area Nav, Primer) or strongest ink with dimmer links (site footers)?
   Recommendation: Nav's muted label, so it reads like the rest of Area.
3. Rename Navbox to *Link groups*?

## Not checked

- No captures with `area-capture.js`; values are source reads, not computed styles. ChatGPT, Notion app and Linear app
  metadata rows were not captured (logged-in apps), and YouTube/Medium bylines are unverified.
- Vercel, GitHub-marketing and Notion heading font sizes come through tokens or hashed CSS not resolved here.
