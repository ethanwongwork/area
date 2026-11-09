# Setting row spec

**Captures:** none taken; the evidence is bundle and source reads in `docs/research/components-audit-2026-11-07/` (cursor.md, primer.md, chat-apps.md) and Area's own Settings page
**Peers:** Field (labelling a control, `labelAction`), Panel and its rows (the boundary), Description list (labelled values, the framed box), Section heading (the group's heading), Switch, Select, Segmented, Slider (controls), Toggletip (help), Button (Reset), Tabs and Tree view (the 6 dot)

## Owner decisions

- 2026-11-07: components audit, "Take all recs": N4 Setting row and settings group is built (review page
  St7jcEipvPoa3GvSwnAvBT).

## Job and boundaries

Setting row is one preference on a settings page: the setting's name, a one-line description and an optional help (a
Toggletip or a Link), with the control at the row's end, or under the text when the row is narrow. A setting that
differs from its default carries a dot after its name and a Reset, shown on hover or focus. Settings group stacks rows
under an optional heading, with a rule between them, framed or on the page. It is not Panel's rows, which act on a
selection (a layer's fill, a frame's size); this is a page of preferences that apply on their own. It is not Field, which
labels a form's control that is submitted; and not Description list, which shows values to read.

Intake gates:

- **Useful.** A code editor's settings editor (cursor.md: `.cursor-settings-cell{gap:20px;padding:12px 14px}`, a column
  layout for wide controls, a 14 help icon, a modified indicator and a Reset toolbar revealed on hover), Primer's
  ControlGroup (`/product/internal-components/`: title, description, control, grouped and divided), a chat app's settings
  rows (`settings-rows-9a011ebae311.css`, dividers that step aside), and Area's own Settings page (`settings.tsx`
  `SettingsRow`, `inspector-rows.tsx` `ResetButton`, written as app code).
- **Unique.** Field puts its label over or beside one control in a form; Panel rows are a two-column inspector grid on a
  selection. Neither has a description column, a modified mark, Reset, or a group with rules between rows.
- **Composable.** The control is any Area control (the row names and describes it, as Field does), help is a Toggletip,
  Reset is a ghost icon Button, the group's heading is Section heading, the framed box is Description list's frame.
- **Consistent.** Name and description join (Text pairs, an item's name and its line); the rule is the Dividers group's;
  the dot is the change mark for `modified` (Governance § 4, Change words) at Tabs' and Tree view's dot size.
- **Worth maintaining.** Two states (modified, disabled), no keyboard of its own beyond its parts. It does not search or
  highlight matches, pulse when reached from a link (the editor's `cursor-settings-border-pulse`), or store values.

## Variants

| Axis | Value | Justification | Where it appears (source / product) |
|---|---|---|---|
| orientation | horizontal (default) | The control at the row's end; under the text when the row is under 456 wide | The editor's cell, Primer's ControlGroup, the app's Settings |
| orientation | vertical | Always under the text, for a control that needs the line (pictures, a list, a text area) | The editor's `-extra-below` cell; the app's `data-wide` rows (Mode, Density, Corner) |
| SettingsGroup framed | false (default) / true | On the page, or the rows in a frame | The chat app's plain rows; the editor's and the app's boxed groups |

Excluded: a search highlight and a link pulse (a settings search is the page's), the editor's left-edge modified bar (a
dot after the name, as the task asks and as Tabs' change marks read), the chat app's "dividers that step aside" (the
rows have no hover plate to step aside for).

## Anatomy

```
root          <div>     owns: padding (12 block, 0 inline; 16 inline in a framed group), the inline-size container
  body        <div>     owns: flex row, 16 gap; a column (6 gap) when vertical or under 456
    text      <div>     owns: the name's line over the description
      heading <div>     owns: the text's line height, 4 gap: label, modified, help, reset
        label <label>   owns: UI type, default ink, 400; for the control
        modified <span> owns: the 6 dot, fg-change-modified; "Modified" for assistive tech
        help  <span>    owns: the Toggletip or Link
        reset <span>    owns: the ghost icon Button, shown on hover or focus
      description <p>   owns: UI type, muted ink
    control   <div>     owns: the control at the end, its width or --area-setting-row-control, at most 50%
SettingsGroup <section> owns: 16 gap (12 compact) between heading and rows
  Section heading       the heading and its lede
  rows        <div>     owns: the rules between rows; framed: edge, corner, surface, rule inset 16
```

Row height: 12 + the text + 12, 42 at one line and 60 at two at type 13 (8 compact), as the app's Settings rows.

## Decisions

| Slot · property | Area value | Basis | Reason when it differs from the basis |
|---|---|---|---|
| row · padding block | `inset-surface-sm` (12, 8 compact) | The editor's 12; the app's 42 / 60 rows | — |
| row · padding inline | 0 plain; `inset-surface-md` (16) framed | The app's Settings box 16; the editor's 14 | 16 is Area's surface inset |
| body · gap | 16 | The app's Settings | The editor's 20 is off the ladder |
| narrow break | under 456 wide | Derived: the 280 control column (the app's Inspector floor at 13) + 16 + a 160 text column (Description list's term) | Not measured; container query lengths take no tokens |
| stacked · gap | `ui-stack` (6) | Field's label over its control | The editor's 8 |
| name · description | joined, same size, default over muted, 400 | Text pairs: an item's name and its line | — |
| modified mark | 6 dot, `fg-change-modified` | Tabs' and Tree view's unseen dot size; the change ink for modified | The editor's 2px left bar |
| Reset | ghost icon-only sm Button, reset glyph, after the name, opacity 0 → 1 on hover or focus, at once in, `fade-fast` out | The editor's toolbar (opacity .3s); the app's ResetButton; Code block's revealed copy | Always shown where nothing hovers |
| Reset · name | "Reset “Label” to default" | WRITING.md, icon-only buttons; quotes name what it acts on | The app's "Reset Label to default" |
| group · rule | Dividers group's line between rows, between the text edges | PRODUCT_UI.md: settings groups rule rows only between the text edges | — |
| group · framed | Blocks edge, container corner, `bg-surface` (a raised ground, `layers.css`) | Description list `framed` | — |
| group · heading gap | `inset-surface-md` (16, 12 compact) | A heading and its block; the app's `--_canvas-heading` | — |
| control · width | its own, or `--area-setting-row-control` for a group's column; at most 50% | The app's one control column | — |

## States

| State | Slot · property changes | Evidence |
|---|---|---|
| modified (`data-modified`) | The dot after the name; Reset while `onReset` is given; "Modified" joins the control's description | The editor's `is-configured` |
| disabled (`data-disabled`) | Name and description in `fg-disabled`; the control gets `disabled`; Reset disabled | Field's disabled |

## Behavior and accessibility

The name is a `label` for the control; the row clones its only element child with `id`, `aria-labelledby` (the name)
and `aria-describedby` (the description, and the modified words), as Field does, so the control must forward them
(pass `controlId` otherwise). A Segmented or another group takes `aria-labelledby` from the row; a Switch or Select is
also clickable through the label. Reset is a real button, named for the setting; Tab reaches it (which shows it). Once pressed it goes (the setting is
back at its default), so focus moves to the control, or its first stop (a Segmented's chosen option), not the page. The
group is a `section` named by its heading. Forced colours: the dot is kept in CanvasText. RTL from logical properties.
Not implemented: a settings search and its highlight, a link pulse, keeping a column width across groups (set
`--area-setting-row-control` on a common ancestor).

## Sources

| Id | Type | What | Link / commit / path | License | Captures |
|---|---|---|---|---|---|
| editor | product bundle | Settings cell, column cell, help icon, modified indicator, Reset toolbar | Cursor 3.27.22 `GCSS` `.cursor-settings-cell`, `-extra-below`, `.cursor-settings-help-icon`; `DCSS` `.setting-item-modified-indicator`, `.setting-toolbar-container` (cursor.md) | evidence only | none |
| primer | design system | ControlGroup: rows of a title, description and control, grouped and divided | `primer.style/product/internal-components/` (primer.md) | MIT | none |
| chat-app | product bundle | Settings rows; dividers that step aside on hover | ChatGPT `settings-rows-9a011ebae311.css` (chat-apps.md) | evidence only | none |
| area | the app | Settings rows (42 / 60), the rule between text edges, Reset after the name | `apps/desktop/src/pages/settings.tsx`, `src/styles/settings.css`, `src/inspector-rows.tsx` | — | none |

## Measurements

None captured; the editor's values are declared CSS.

## Peers and consistency

| Peer | Shared role | Area value in peer | This component | Match / reason |
|---|---|---|---|---|
| Field | labels one control | clones the child with id, aria-labelledby, aria-describedby; `labelAction` | same; `labelAction` | Match |
| Tabs, Tree view | a dot mark | 6, accent (unseen) | 6, change ink (modified) | Same size; different meaning, different ink |
| Filter bar | the unsaved dot | 6, change ink | 6, change ink | Match (cohesion test) |
| Description list framed | the framed box | Blocks edge, container corner, surface | same | Match |

## Visual pass

Looked at in the built renderer in a browser (`desktop-dist`, the app's gallery without Electron; another session owns the running Electron), light and dark, at the app's type 13 Compact: one row is 56 at the app's Compact (10 + 36 + 10), the narrow tile drops its Segmented under the text, Reset
shows on hover, and pressing it puts the default back and hands focus to the control (the chosen option of a Segmented).
Not done: rows beside the app's Settings rows, type 12 / 16.

## Verification

- `node --test packages/react/tests/setting-row.test.mjs`; cohesion's change-mark test.
- Seen in the gallery (above); not in Electron.

## App use

The app's Settings page (`settings.tsx` `SettingsRow`, `styles/settings.css`) is not swapped: its rows sit in the feed's
frame (`--_frame-inset`, density-aware, and `--_tile-radius` 16 on `bg-stripe`), its control column is a fixed
`min(280, 45%)`, its Reset sits after the name whenever the row differs (not on hover), and its wide rows wrap pictures
onto the next line. Setting row's values match the row height and gaps, but the box, the column and Reset's reveal
differ, so the swap would change the page. Left for the owner's call: adopting it means choosing between the app's
always-visible Reset and the editor's hover reveal.

## Review note, 2026-11-07

- **What changed:** a new family for a page of preferences: a setting's name, description and help with its control at
  the end, a dot and Reset when it differs from its default, and a group with rules between rows.
- **Why:** you took the audit's recommendation; a code editor, Primer and the app's own Settings page draw the same row.

## Feedback log

- 2026-11-07 · built from the components audit (N4). The help slot is named `labelAction`, Field's word for the same
  thing, rather than `help`.
