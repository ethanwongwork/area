# Page header spec

**Captures:** none taken; the evidence is source and bundle reads in `docs/research/components-audit-2026-11-07/` (primer.md, chat-apps.md)
**Peers:** Section heading (a titled block inside a page), Titlebar (the window's bar), Breadcrumb (the parent slot), Tabs and Segmented (the navigation slot), Button (actions), Empty state `md` (the other region heading)

## Owner decisions

- 2026-11-07: components audit, "Take all recs": N1 Page header is built (review page St7jcEipvPoa3GvSwnAvBT, `verdicts`).

## Job and boundaries

Page header heads a page: the page's name as its heading, a way back to its parent (a Breadcrumb of its parents or a
back Link) over it, the title's own actions at its end, a description under it, and the page's tabs or views under all
of it. A page has one, at the top of its content. It is not Section heading, which heads a block inside a page and has
no actions, parent or navigation; not Titlebar, the window's chrome; and not a toolbar of view controls (filters, sort,
a selection's actions: Filter bar and Selection bar go under it).

Intake (Governance § 1, the `area-component-intake` gates):

- **Useful.** Primer ships PageHeader (beta: context area with a parent link and breadcrumbs, title area with three
  title variants, actions, description, navigation; `PageHeader.docs.json`, `src/PageHeader/PageHeader.tsx:184`); a chat
  app ships PageHeader (`cf35aed38-tqXPCmE_.js`: `title, subtitle, tabs, search, viewToggle, iconActions,
  primaryAction, actions, band, status`) on its settings and library pages; Area's own Settings page draws one by hand
  (`apps/desktop/src/pages/settings.tsx` `ThemeTitle`: a title, a status and Publish).
- **Unique.** Section heading is a title and a lede; App-shell layout covers the window's regions, not the title block.
  Neither holds a parent link, actions or navigation, and neither is the page's h1.
- **Composable.** The parent is a Breadcrumb or a Link, actions are Buttons, navigation is Tabs or a Segmented; Page
  header only places them and owns the title and description.
- **Consistent.** The title takes the ramp's title steps (area-type-usage: "a page or a panel's own title, once"); the
  description and its gap follow Text pairs ("a heading over its text": a title step, one step (4) off).
- **Worth maintaining.** No state, no keyboard of its own (its parts bring theirs). It will not pin or shrink on scroll
  (the chat app's `-pinned-height`, `-title-opacity`), hide parts by viewport (Primer's responsive `hidden`) or draw a
  leading visual; each waits for a use (below).

## Variants

| Axis | Value | Justification | Where it appears (source / product) |
|---|---|---|---|
| size | sm | A sub-page, or a page inside a panel: `title-xs` (16/22 at type 13), the region heading step | Primer's `variant="subtitle"`; Section heading's step |
| size | md (default) | A page: `title-lg` (26/30) at `weight-heading` (600) | Area's Settings title (`studio-settings__title`: title-sm); Primer `medium` |
| size | lg | A top-level page (home, a library, a document): `title-xl` (32/40) at 600 | Primer `large`; the chat app's 24/32 title (`--cds-page-header-title-size:1.5rem`, `-title-leading:2rem`): Area's nearest step is `title-lg` (26/30), which `md` takes (plan A9.1) |
| slots | parent, actions, description, navigation | Each part is optional and drawn only when given (no `show*` flags) | Primer's slots; the chat app's props |
| titleAs | h1 (default) … h6 | The page's own header is its h1; a header for a part of a page takes the next level | Primer's `as` on Title |

Excluded and why: Primer's leading and trailing visuals and the chat app's `status` and `band` (no Area page needs
them yet; a status reads as a Badge in `actions`); the chat app's `search` and `viewToggle` (a Search field and a
Segmented go in `actions` or `navigation`); pinned and shrinking titles on scroll (needs a scroll container contract);
Primer's responsive `hidden` (components audit D2, viewport ranges, is the owner's open decision); Primer's ContextBar.

## Anatomy

```
header      <header>          owns: the grid (text column | actions), the title step (--_title-*), no padding
  parent    <div>             owns: the way back's line (UI type), 8 under it
  title     <h1>…<h6>         owns: the title step, strong, default ink, balanced wrapping
  actions   <div>             owns: a flex row 8 apart, the title line's height, 16 from the title column
  description <p>             owns: UI type, muted ink, 64ch measure, 4 under the title
  navigation <div>            owns: 16 under the text (12 compact)
```

No inset of its own: the header starts on the page's text edge, as Section heading does. The actions' box is the title's
line, so taller Buttons overhang it equally above and below (first-line alignment, `inset.css`) and the description
keeps its 4.

## Decisions

| Slot · property | Area value | Basis | Reason when it differs from the basis |
|---|---|---|---|
| title · type | sm title-xs at 500; md title-lg and lg title-xl at `weight-heading` (600); tracking the token's | Area's type ramp (area-type-usage § 1–2; plan A9.1: page > section > item, 26 / 16 / 13) | The chat app's and live products' 24/32 600: Area's ramp step is 26/30 |
| description · type | UI line (13/18), `fg-muted`, 400 | Text pairs: a description explains at the same size, muted | Section heading's lede is the 12 secondary; a page's description is read beside its title, not a caption |
| title → description | 4 between line boxes | DESIGN_SYSTEM.md, Text pairs, "a heading over its text" (owner: "4 is right") | — |
| parent → title | `ui-cluster` (6 / 8 / 10; 8 at the default) | Derived on the ladder: further than the title's own copy (4), closer than a block (12); not measured | Primer's context area sets no gap in its docs |
| actions · gap | `ui-cluster` (6 / 8 / 10) | Toolbar's command spacing at default density | — |
| actions · inset | 2 × `ui-cluster` from the title column (12 / 16 / 20; 16 at the default) | Area's text-to-control gap in rows (Setting row, the app's Settings 16) | — |
| text → navigation | `inset-surface-md` (16, 12 compact) | A heading and its block: 16 (the feed's heading gap) | — |
| description · measure | 64ch | Section heading's lede (`app-shell.css`) | — |

## States

None. The parts bring their own (Breadcrumb's current, Tabs' selected, Button's).

## Behavior and accessibility

A native `header` (not the page's banner landmark inside `main`), its title a real heading, h1 by default, with
`titleId` for a region's `aria-labelledby`. Reading order: parent, title, actions, description, navigation. No keyboard of
its own. RTL follows from the grid's logical columns. Forced colours need no repair (text and its parts only). Not
implemented: pinning or shrinking on scroll, narrow-screen rules (the actions stay beside the title; a page that runs
out of room should move them into a Menu).

## Sources

| Id | Type | What | Link / commit / path | License | Captures |
|---|---|---|---|---|---|
| primer | design system (source) | PageHeader: ContextArea (ParentLink, ContextBar, ContextAreaActions), TitleArea (`variant` subtitle / medium / large), LeadingVisual, TrailingVisual, Actions, Breadcrumbs, Description, Navigation; responsive `hidden` | `github.com/primer/react` at 35ff4972, `PageHeader.docs.json` (`:180` variant), `src/PageHeader/PageHeader.tsx:184` | MIT | none |
| chat-app | product bundle | PageHeader{title, subtitle, tabs, search, viewToggle, iconActions, primaryAction, primaryActionCompactIcon, actions, band, status}; Page{header, translucentHeader}; title 1.5rem / 2rem | Claude 4.16336.0 `assets/v1/cf35aed38-tqXPCmE_.js`, `cd75b47e6-BcflIwff.js` | evidence only | none |
| area | the app | Settings' title (title-sm) and ThemeTitle (title, status, Publish) | `apps/desktop/src/pages/settings.tsx`, `src/styles/settings.css` | — | none |

Nothing was rendered: the products' values are declared, not measured.

## Measurements

None captured. The products' sizes above are declared values read from source and bundles.

## Peers and consistency

| Peer | Shared role | Area value in peer | This component | Match / reason |
|---|---|---|---|---|
| Section heading | a heading over its text | title-xs, lede 12 joined | sm title-xs, description 13, 4 off | Page header's description is the page's, at the UI size |
| Empty state md | a region heading | title-xs, 4 off its 13 line | same rule at md title-sm | Match |
| Dialog, Card | a surface's title | 13/500, 4 off | not a surface title | — |

## Visual pass

Looked at in the built renderer in a browser (`desktop-dist`, the app's gallery without Electron; another session owns the running Electron), light and dark, at the app's type 13 Compact: every tile renders; sm is 44 and md 46 tall with a description (22 or 24 + 4 + 18), the actions centred on the
title's line. Not done: the side-by-side pass against references, type 12 / 16 and Comfortable, the actions' overhang
against the parent line.

## Verification

- `node --test packages/react/tests/page-header.test.mjs` (markup, slots in reading order, size, titleAs, ref and props).
- Seen in the gallery (above); not in Electron.

## App use

The app's only page title is Settings' (`studio-settings__title`, `ThemeTitle`). It is not swapped: that title is
trimmed to its cap and baseline (`text-box: trim-both`) and indented 4 to the feed's text column (`--_text-inset`), and
ThemeTitle's actions are a StatusBadge and Publish centred on the trimmed line; Page header keeps its line boxes and
starts on the page's edge, so the swap would move the title. Left for the owner's call.

## Review note, 2026-11-07

- **What changed:** a new family for a page's own title block: the title with a way back, a description, actions and the
  page's tabs, in three title sizes.
- **Why:** you took the audit's recommendation; Primer and a chat app both ship it, and the app's Settings page draws one
  by hand.

## Feedback log

- 2026-11-07 · built from the components audit (N1).
- 2026-11-11 · system evaluation A1.2 · the actions are independent controls, `ui-cluster` apart (8, Compact 6; was a fixed 8).

## Review note, 2026-11-11 (type rules, plan A9)

- **What changed:** the title takes the heading weight, 600, from `title-sm` up, and a page title step: `md` (the default) `title-lg` 26/30 (was `title-sm` 18/24 at 500), `lg` `title-xl` 32/40 (was `title-md` 20/28 at 500); `sm` keeps `title-xs` 16/22 at 500, Section heading's. Page > section > item is 26 / 16 / 13 at type 13 (plan A9.1, findings T16, VC13, RL4). The plan named 24/32; the ramp has no 24, and its 26/30 step is two pixels from it, so no new size was added (to confirm on the review page).
- **Why:** the system evaluation's type rules (docs/research/system-evaluation-2026-11-11, section 5, A9), owner-approved
  2026-11-11; the rules are in DESIGN_SYSTEM.md ("Ink and weight", "Size and shape", "Text pairs") and the type skill.

## Density (plan B8.2), 2026-11-14

Space between pieces reads a density role (DESIGN_SYSTEM.md, Size and shape; `density.test.mjs`). Values at type 13
Compact / Default / Comfortable; each is whole at type 12 to 16 and every density, and the default is unchanged unless said.

- Parent to title `ui-cluster` (6 / 8 / 10), actions two clusters from the title (12 / 16 / 20; 20 / 20 / 24 at type 16).
