# Dividers: where Area draws a line, and which are needed (2026-10-25)

Owner: "any other places where a full width divider is used? id prefer to not use dividers in general unless its very
necessary and intentional. i also prefer dividers that are inset to have a very light subtle stroke by default".
Follows the header-line change the same day (Code block, Edit summary, Queue and Plan dropped the line under their
head; comparison https://claude.ai/artifact/914gYc7RXYaRuK8mk2erRb).

Method: every one-sided border, inset-shadow line and 1px fill in `packages/styles/src/**/*.css` and
`apps/desktop/src/styles/*.css` (a parser over the rules, then a read of each). Figures drawn inside Setup's product
screens and the Theme tab's drawings (`ss-*`, `lm-*`, `cv-*`, `lang-*`, abstract-board) imitate products and are left
out. Line colours, light, painted: `border-decorative` L 0.964 (#f3), `border-card` 0.949 (#ee), `border-divider` and
`border-faint` 0.913 (#e2), `border-subtle` 0.870.

## Inventory

### A. Seams inside a container, between a head or foot and its body (the kind just removed)

| Where | Line | Proposal |
|---|---|---|
| Color picker, under its header (`color.css` header, inset shadow) | decorative | remove |
| Color picker, above the saved swatches (`.area-color-picker__swatches`) | decorative | remove |
| Code block, above Show more (`.area-code-block__toggle`) | decorative | remove (the fade already marks the cut) |
| Panel, under its bar (`.area-panel__bar`) | decorative | remove |
| Panel, above its footer (`.area-panel__footer`) | decorative | remove |
| Command palette, under the search field | decorative | decide: the field and the results are different kinds of thing |
| Command palette, above the footer | decorative | remove |
| Setup chat, above the dock (app) | divider | remove |

### B. Lines between sections or rows

| Where | Line | Proposal |
|---|---|---|
| Panel sections (the Inspector's Page / Accent / Where it paints) | decorative, full width | remove; sections separate by their headings and gap |
| Setup chat, above each chapter (app) | divider, full width | remove |
| Accordion items | divider, full width | off by default, a `divided` option |
| Shortcut list rows | divider | off by default |
| Infobox sections | divider | keep (Wikipedia's infobox draws them), lighten |
| Table rows | divider | keep: rows of data are scanned across |
| Typography tab rows (app) | divider | remove |

### C. Opt-in dividers (the author asked for them)

Link groups `divided`, Description list `divided`, Tabs `track`, Table `column-dividers`, Inline list `rule`: keep as
options, drawn at the inset weight below.

### D. Region edges (two regions on one ground)

Titlebar's bottom edge, a flush Panel's resize edge (Sidebar, Inspector), Setup's chat panel edges: keep. They are
the shell's structure, not dividers inside content.

### E. Not dividers

Joined-control seams (Input group, Color field's opacity), rails (Step, Timeline, Stepper, Plan), Breadcrumb's
chevron, the chat quote bar: unchanged.

### F. Inset dividers (short lines that stop short of the edges)

| Where | Line now | Proposal |
|---|---|---|
| Separator (the component) | divider #e2 | decorative #f3 by default |
| Nav separator | divider #e2 | decorative |
| Menu separator | decorative #f3 | already |
| Toolbar separator | (its own) | decorative |
| Inline list `rule` | divider #e2 | decorative |
| File upload item separator | subtle (0.87) | decorative |

Rule change it implies (DESIGN_SYSTEM.md, Lines): "a divider that stands alone sits a step darker than a seam" becomes
"a divider is the lightest line, `border-decorative`, unless it carries data (Table rows)"; increased contrast still
firms every line.

## Built (2026-10-26)

Owner, after the comparison page (https://claude.ai/artifact/3Fc3sXEgfKJmHEf2arA9hE): "Build everything as proposed on
the dividers page, removing the footer line but keeping the line under the Command palette's search."

- **Removed:**
  - Color picker's header and saved-colours rules;
  - Code block's Show more rule;
  - Panel's bar, section and footer rules (`bareBar` / `bareFooter` are now the default and deprecated);
  - the Command palette's footer rule;
  - Setup's dock and chapter rules;
  - the Typography tab's row rules.
- **Opt-in:** Shortcut list `divided` (off by default, tile Divided).
- **Lightened to `border-decorative`:** Separator, Nav separator, Inline list rule, File upload separator, Infobox
  sections.
- **Kept:** the Command palette's search rule, Table rows, region edges, other opt-in dividers.
- **Rule:** DESIGN_SYSTEM.md (Lines). Enforced by `cohesion.test.mjs` "dividers only where intended". Nine families
  were reopened to In review.
