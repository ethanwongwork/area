# Reference list and Table of contents: rethink survey

2026-10-17. The owner chose "Rethink" for both: they read as Wikipedia only (↑ a b c backlinks, columns of small
numbered notes, a Wikipedia-style contents panel). The goal is something "simple and consistent and cohesive with the
system". Citation's footnote `[13]` is approved and stays. This page surveys products and systems other than Wikipedia,
then recommends an Area-native design for each family.

Pinning: GitHub sources are given as `repo@sha path:line`, at the default branch read on 2026-10-17. Closed products
(ChatGPT, Perplexity, Notion, Stripe, Mintlify, Apple, Substack) were **not measured**. What is written about them
comes from public help pages and third-party teardowns and is marked *unverified*. Nothing was signed into and no
product state was changed.

## 1. Reference list (sources, footnotes, references)

### Sources

| Id | Kind | Structure | Numbering | Backlink | Ink and size | Target / current | Pin |
|---|---|---|---|---|---|---|---|
| github-md | product CSS (GitHub Markdown, Primer tokens) | `section.footnotes` with a `border-top` 1px, then an `ol` with 16 of padding | native `ol` markers | `↩` after the note | **12px, `--fgColor-muted`** for the whole section | `li:target::before`: a **2px accent outline, radius 6**, inset −8/−8/−8/−24; the target's text goes to the default ink | `sindresorhus/github-markdown-css@7f38dcb github-markdown.css:930-964` |
| remark (GFM) | generator GitHub follows | `<section data-footnotes class="footnotes">`, an `h2` "Footnotes" that is **sr-only by default**, then an `ol` | native | `↩`, with a superscript **2, 3…** for the second and later references; `aria-label` "Back to reference N" | — | — | `syntax-tree/mdast-util-to-hast@174795b lib/footer.js:81-90, 108, 132-135, 188, 229` |
| govuk | design system (GOV.UK publishing components) | `.footnotes`: `border-top` 1px, padding-top 20 | native; the indent grows past 99 and 999 | `a[role=doc-backlink]`, hidden in print | body | `li:target`: a 95% black tint plus a 3px bottom border | `alphagov/govuk_publishing_components@05d2fbe …/govspeak/_footnotes.scss:16-41` |
| ai-elements | design system (Vercel AI Elements, shadcn) | `Sources`: a collapsible block that reads "Used N sources" (12, medium, with a chevron), opening a column of rows, gap 8; each row is a **16 icon and the title**, medium | **none** | none (rows are the links) | `text-xs`, primary ink | — | `vercel/ai-elements@ca8be60 packages/elements/src/sources.tsx:16, 32-38, 51-52, 64-73` |
| ai-elements inline | same | `InlineCitation`: a pill reading the hostname then "+N", with a Hover card of sources (title `text-sm` medium, truncated) | none | — | `text-xs` | — | `…/inline-citation.tsx:67-74, 264-266` (already Citation's source) |
| chatgpt | target product | A "Sources" button under the reply with a stack of favicons opens a right-hand panel. Each source is a card: favicon, site name, title, relative time and snippet. Cited sources come first, then "More". Inline citations are site-name pills with +N (Area's Citation). | none in the panel | none; the panel doesn't mark which card the clicked pill points to | — | — | *unverified* (aiuxplayground.com/teardowns/chatgpt/citations; guptadeepak.com geo-compass; seroundtable.com 41864: Sources is sometimes moved into the "More actions" menu, 2026-08) |
| perplexity | product | numbered inline citations, plus a source list of cards (favicon, domain, title) above or under the answer, with a Sources tab | **numbers match the inline numbers** | none | — | — | *unverified* (aiuxplayground.com/teardowns/perplexity/citations; 925studios.co breakdown) |
| notion | target product | No footnotes in pages. AI Meeting Notes cite as links back to the transcript section. | — | — | — | — | *unverified* (matthiasfrank.de "AI notes now cite sources"); Notion has no reference-list block |
| mdn | docs | "Specifications" is a two-column table (specification, then the section link). "See also" is a plain bulleted list of links. | none | none | body | — | *unverified* (structure as seen on developer.mozilla.org, not read in source this round) |
| substack, medium | publishing | Substack: numbered footnotes at the foot of the post, the number links back, small muted text. Medium has no native footnotes. | the number is the backlink | — | — | — | *unverified* |
| stripe docs, google scholar | docs, search | No footnote list was found in Stripe docs. Scholar: a title link, then a muted green author/source line, then a snippet, with no number. | — | — | — | — | *unverified* |

### Where the sources agree

- **There are two jobs, not one.** A *sources list* (ChatGPT, Perplexity, AI Elements: rows of favicon, site and
  title) and *footnotes* (GitHub, GOV.UK, Substack: a numbered `ol` at the foot of the text). Only Wikipedia joins
  them with lettered backlinks.
- **Footnotes are quiet:** a rule above, a step smaller or muted (GitHub 12 muted), native numbers, and **one
  backlink glyph at the end of the note** (GitHub/remark `↩`, with a superscript count only for repeat references).
  None letters its backlinks a b c, and none leads the note with them.
- **No columns** outside Wikipedia.
- **Target:** GitHub draws an outline ring around the note and GOV.UK tints it. Both mark the whole note; neither
  uses a side rail.
- **A sources list has no numbers** unless the inline citations are numbers (Perplexity). Rows are favicon + title +
  domain (+ snippet in ChatGPT's panel). This is a list of rows, which Area already has.

## 2. Table of contents / "On this page"

### Sources

| Id | Kind | Heading | Size and rows | Indent per level | Levels | Current marker | Rest ink | Sticky / behaviour | Pin |
|---|---|---|---|---|---|---|---|---|---|
| vitepress | docs framework | "On this page", 14 semibold, the same 32 line | **14 (aside 13 medium), line 2.2857 = 32** | 13 (0.8125rem); the list sits in a box with a **1px divider at its start** and 16 of padding | 2–3 (configurable) | a **2px × 18 brand rail, radius 2**, on the divider line; it **slides** (top 0.25s) and fades in | `--vp-c-text-2` (muted); hover and active go to `text-1`, **no colour change to brand** | aside sticky; the active link is the last heading above `scrollY + scrollMarginTop + 4`, or the last one at the page bottom | `vuejs/vitepress@8ffc07c …/VPDocAsideOutline.vue:52-78`; `VPDocOutlineItem.vue:29-55`; `composables/outline.ts:131-202` |
| starlight | docs framework (Astro) | "On this page" | rows padded 4 above and below, line 1.25, radius 4 | **16 × depth + 8** | **h2–h3 by default** | `aria-current="true"`: **accent text colour only** | default text | sticky right column; on mobile a dropdown where the current row gets a check | `withastro/starlight@b77aca9 …/TableOfContentsList.astro:34-44, 61-78`; `src/schemas/tableOfContents.ts:3, 19-21` |
| docusaurus / infima | docs framework | none ("On this page" only in the mobile collapsible) | **0.8rem (12.8)**, items 8 apart | 8 | h2–h3 by default | `--active`: primary colour text | `--ifm-color-content-secondary` | `position: sticky; top: navbar + 1rem`; hidden at ≤996 | `facebookincubator/infima@c123556 …/table-of-contents.pcss:8-49`; `facebook/docusaurus@7b6826b …/TOC/styles.module.css:7-17` |
| nextra | docs framework | `themeConfig.toc.title` ("On This Page"), semibold | `text-sm` rows, `my-2`; footer links `text-xs` | **h2 semibold at 0**, h3 12, h4 24, h5 36 (`ms-3/6/9/12`) | 2–6 | `text-primary-600` text only | gray-600, hover gray-900 | sticky under the navbar; "Back to top" appears after the second heading | `shuding/nextra@d6e80e1 packages/nextra-theme-docs/src/components/toc.tsx:17-21, 65-100, 140` |
| mkdocs-material | docs framework | "Table of contents" title, sticky inside the list | 14, line 1.3 | 12 (`padding-inline-start: 12px`) | configurable | `--active`: link (accent) colour text | `--md-default-fg-color--light` | title sticky; integrated or secondary sidebar | `squidfunk/mkdocs-material@a0f2a2a …/main/components/_nav.scss:37-38, 93-110, 495-520` |
| mdn (fred) | docs | "In this article", normal weight (not bold) | links padded 0.25em/0.5em | 1em | 2 | `aria-current="true"`: **a 2px start rail in the accent plus an accent-tinted plate** | inherit; hover goes to the link colour | the rail is drawn on every row as a **2px border-colour track**, so the list reads as a single line | `mdn/fred@711e325 components/reference-toc/server.css:1-45`; `components/generic-toc/server.css:27-48` |
| primer docs | design system (GitHub) | "On this page", **12, uppercase, muted** | Primer `NavList` rows | **h2 only** | 1 | `aria-current="location"` (NavList's current style: a plate and a start bar) plus a **4px nudge** (`translateX`) | NavList default | `sticky; top: 140px` | `primer/doctocat-nextjs@f7376a2 …/TableOfContents.module.css:1-21`; `TableOfContents.tsx:15, 38, 62-68` |
| govuk | design system | "Contents", 16 regular | 16; the active row in the alternative style is padded 4/8 | none (a dash "—" leads each item) | 1–2 | alternative style: a **4px blue start border**, blue, bold | text | in-page; a separate "back to contents" link | `alphagov/govuk_publishing_components@05d2fbe …/_contents-list.scss:10-79` |
| notion | target product | none | In the floating outline, each heading is a **short horizontal line at the right edge** (longer for higher levels); hovering opens a panel listing the headings | indented by level | h1–h3 | the current heading's line is darker *(unverified)* | — | appears with ≥2 headings; can be turned off in Appearance & layout | *unverified* (notion.com/help/columns-headings-and-dividers; release 2024-06-11) |
| notion block | target product | none | a block at body size: a list of headings in muted ink with a hover plate, H2/H3 indented | indented | h1–h3 | **none** (static) | one block colour | static, placed in the page | *unverified* (same help page) |
| github readme | product | Outline menu button in the file header that opens a filterable list (Primer ActionList) | — | indented by level | all | — | — | a popover, not a rail | *unverified* |
| stripe, mintlify, apple, vercel | docs | "On this page" at the right, small, muted rows, the current one in accent ink (Mintlify, Vercel) or bold (Apple) | — | — | 2–3 | — | — | sticky | *unverified*; not read in source |

### Where the sources agree

- **The heading is "On this page"** (VitePress, Starlight, Primer, Nextra, Stripe, Mintlify), quiet or small (Primer:
  12 uppercase muted; MDN normal weight). Only Wikipedia (and GOV.UK) say "Contents".
- **Two levels** by default (Starlight and Docusaurus h2–h3; Primer h2 only). Deeper levels are rare.
- **Small type:** 12.8–14, one step under the body.
- **Rest muted, current stronger.** The current entry is marked with **ink alone** (Docusaurus, Starlight, Nextra,
  Material) or with **a rail on a continuous start line** (VitePress, MDN, GOV.UK). **No source bolds the current row**
  except GOV.UK's alternative style and Wikipedia. No source shows Wikipedia's expand/collapse of subsections in the
  side outline.
- **Sticky, scroll-following:** the last heading above the top + offset is current, and the last heading is current at
  the page bottom (VitePress `outline.ts:131-170`). Area's current rule already matches.
- **A continuous start line with the current part painted** (VitePress, MDN) is the same idea as Area's Nav marker
  (a rail at the start of each row, painted only on the current one, `nav.css:169-202`).

## 3. Recommendation

### Reference list → two plain lists, no Wikipedia traits

**Drop:** ↑ / "^ a b c" backlinks before the note; lettered backlinks; `columns`; the 3.2em marker indent; the
backlink colour axis (nine inks); `user-select` tricks.

**Footnotes (the default):**
- A plain `ol` in Area's small text and **muted ink**, as GitHub does (12 muted) and as the system's secondary text.
  Native numbers, tabular, in the muted ink. Indent just wide enough for two digits (≈ 2ch + 4), not 3.2em.
- **A rule above** (the system's divider), optional, as GitHub and GOV.UK do. An optional quiet heading such as
  "Notes" uses Section heading, not a bespoke title.
- **One backlink at the end** of the note: a 12 return arrow icon button (or `↩` as Link), muted. Repeat references
  get a small count (`↩ 2`), as remark does; no letters. This puts the number first and the text second, as every
  non-Wikipedia source does, and matches Citation's footnote `[13]`, which links back.
- **Target:** keep Area's selection colour but mark the *whole note*, as GitHub and GOV.UK do. Prefer **text going to
  the default ink plus the rail**, since the rail already exists and a tint failed contrast. The rail sits at the
  note's own start edge (inside the indent), not 3.2em out. A ring like GitHub's is the alternative.
- Variants worth keeping: `divider` (on/off) and the target highlight. Nothing else.

**Sources (a second form, from ChatGPT, Perplexity and AI Elements), worth adding because it is the target-product shape:**
- Rows of **favicon 16 (Avatar, square) + title (UI text) + domain (muted, small)**, optional snippet. Build them from
  Nav or List-box rows (the hover plate and 28 compact height already exist). No numbers unless the citations are
  numbered; if they are, a leading muted number matches Citation's footnote.
- Collapsed summary ("N sources" with a favicon stack and a chevron), as AI Elements and ChatGPT's button do; this
  could reuse Show more/Accordion rather than be new.
- Citation (pill) → Hover card is already the inline half; the list is the panel half.

### Table of contents → "On this page" built from Nav marker rows, simplified

**Drop:** the "Contents" bold title; collapse (no non-Wikipedia source does it); unlimited nesting; Wikipedia's blue
rows and bold current row.

**Keep / change:**
- **Rows:** Nav `marker` rows as now, at Area's compact row, in muted ink. The current row goes to the default ink and
  its rail is painted. This is already the VitePress/MDN pattern, so the design is right. Consider drawing the marker
  track faintly on every row (MDN, VitePress), so the outline reads as one line. That would be a Nav marker change for
  every outline, so the owner should decide; otherwise leave it as is.
- **Heading:** "On this page" by default, in Area's quiet label style (Section heading's small muted label, the same
  as Nav group labels). Not strong UI text. Primer (12 uppercase muted) and MDN (normal weight) agree.
- **Levels:** two (h2 and h3) by default, with the second level as NavGroup `nested`. A `levels` prop set to 1 or 2
  covers Primer (1) and the docs default (2).
- **Size:** the app's UI text (13). The sources' 12.8–14 brackets it.
- **Behaviour:** keep the scroll-following rule (it matches VitePress). Sticky placement belongs to the layout, not the
  component. Optional rail slide (VitePress 0.25s) only if `docs/MOTION.md` allows it.
- **Variant worth adding later:** Notion's compact floating outline (a strip of short lines at the edge that expands
  on hover). It is the target-product form, but it needs a Notion capture first, so it's not in this pass.

### Shared

Both families take Area parts (Nav marker, Link, Section heading, Avatar, Divider, Citation) rather than adding new
inks or glyph conventions. Reference list goes from about 10 variants to 2 (divider, target). TOC drops `collapse`
and the bespoke title.
