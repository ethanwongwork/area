# Title balance, 2026-11-06

Owner, showing the app's "Go back to …?" confirm beside Claude Code's next-step box: "reevaluate the visual design,
balance, optical spacing, rhythm, and consistency/cohesion of all of areas components. the design of this dialog …
seems like theres no spacing logic between the title and the text, also the type style size contrast with the text is
large. make sure all of this is intentional."

## What was wrong

- **Size.** Dialog, Confirm dialog, Drawer and Card set their title at `title-xs` over UI text. When the ramp became
  Cursor's on 2026-11-02, `title-xs` moved from 15 to 16 at type 13, so the pair went from 15 over 13 (1.15×) to 16 over
  13 (1.23×). The owner had approved 16 over 14 (1.14×) on 2026-09-26 after calling 20 over 14 too big. Nobody chose 1.23.
- **Spacing.** "Joined" (DESIGN_SYSTEM.md, Text pairs, 2026-10-22) put no gap between the line boxes. With a 16/22 title
  over a 13/18 line that lands the line's cap 10.0 under the title's baseline, while the line's own lines are 8.8 apart:
  1.2 off. Too close to read as a separate step, not close enough to read as one block. That is the "no spacing logic".
- The same in-between gap, 2 to 2.3 off a line's own spacing, sat under every choice, group legend and Switch (a 12/16
  description 9.7 under a 13/18 label, beside its own 7.4) and under File upload's file name (10.8 beside 8.8).

## References (read from bundles and captures)

| Product | Title over text | Ratio | Gap |
|---|---|---|---|
| Cursor confirm (`.pretty-dialog-title`) | 12/14 500 primary over 12 secondary | 1.0 | 4 between boxes |
| Cursor settings row (`.cursor-settings-cell-label`) | 13/18 400 primary over 13/18 secondary | 1.0 | 1 |
| Cursor empty state | 12/16 500 over 12/16 tertiary | 1.0 | 2 |
| Cursor settings header (`.cursor-settings-tab-title`) | 17/21 500 over 13/18 | 1.31 | 4 (a heading) |
| Cursor announcement modal | 16/21 500 over 12–13 | 1.3 | 2 |
| VS Code dialog | 18/22 over 13/22 | 1.38 | 8 |
| ChatGPT "Delete chat?" (confirm-dialog.md) | 20/28 600 over 16/24 | 1.25 | 4 |
| Claude Code next-step box (owner's screenshot) | one size; ink alone tells the question from the recap | 1.0 | a paragraph |

Desktop tools title their components at the text's size and tell them apart by weight and ink; a size step heads a page
or a modal's whole content, and then stands a few pixels off its text. Web systems (ChatGPT, shadcn) step 1.25–1.3.

## Second look

Owner, on the joined confirm: "the space between the title and the copy still doesnt look right". Joined on the copy's
line, a strong title reads as the paragraph's first line rather than its title. Compared 0, 4 and 6 (`capture-gap.mjs`):
4 reads as a title over its copy, 6 starts to come apart. Cursor's confirm puts its message 4 under its title. The owner picked 4 ("4 is right",
2026-11-06). So:

## The rule now (DESIGN_SYSTEM.md, "Text pairs")

1. A surface's title is the size of the text it heads, 13/18 500 default ink over 13/18 muted, its copy one step (4) off:
   12.8 baseline to cap beside the copy's 8.8. An item's name (a choice, Switch, a file row) joins its line instead:
   8.8, or 7.7 for a 12/16 line.
2. A heading over its text (a page's or region's title: Empty state md, Section heading, the app's section titles) takes
   a title step and stands one step (4) off: 13–14 baseline to cap beside the text's 8.8–9.5.
3. Never between: a gap within about 2 of the text's own line gap, but not on it.

## Sweep

In-page sweep of the app's gallery (`pairs.js`): every text with its own words and the first text under it, size,
leading, weight, ink, and baseline-to-cap against the lower text's own line gap. 221 tiles by the docs pages' ids, then
109 by the gallery's own ids. After the change:

| Pair | Families | Baseline → cap | Its line gap | Off |
|---|---|---|---|---|
| title 13/18 500 → text 13/18 | Alert, Approval, Card, Confirm dialog, Dialog, Drawer, Popover, Toast | 12.8 | 8.8 | a step (4) |
| step 13/18 → description 13/18 | Stepper | 8.8 | 8.8 | 0, a name |
| label 13/18 → line 12/16 | Checkbox, Radio, group legends, Switch, File tile | 7.7 | 7.4 | 0.3, a name |
| title 13/18 500 → line 12/16 | Empty state sm | 11.7 | 7.4 | a step (4) |
| name 13/18 500 → meta 13/18 | File upload row | 8.8 | 8.8 | 0 (was 2) |
| heading 16/22 → text 13/18 | Empty state md | 14.0 | 8.8 | 5.3, a step |
| heading 16/22 → lede 12/18 | Section heading | 13.0 | 9.5 | 3.5, a step |
| figure 26/30 → line 13/18 | Card value | 14.5 | 8.8 | a figure over its line |
| title → a set (links, rows, list) | Link groups, Reference list, Shortcut list, Panel | 16.8–35.7 | — | the set rule (one step past the items) |

## Open, not changed

- **Panel md's bar title is 15/22, the reading step** (`--_panel-title-text: text-lg`), over 13/18 section headings.
  sm uses 13/18. A bar title heads a region, so a step is allowed, but `text-lg` is the reading role, not a title.
  Options: 13/18 500 like the app's region headers, or `title-xs`.
- **Card's list items are 7 apart at type 13**: `ui-cluster` is 8 less a half compact step (the density curve), off the
  2 · 4 · 6 · 8 ladder. A foundation question, not Card's.
- **The two heading pairs differ by 1** (Empty state md 14.0, Section heading 13.0) because their texts are 13/18 and
  12/18; both read as a step.

## Files

`pairs.js` is the in-page sweep (paste in the app's console at `#system/area/components`, then `__runSweep([...tile ids])`; gallery tile ids are `GALLERY_SPECIMENS` in `apps/desktop/src/content/specimens.mjs`). `capture.mjs` takes the before/after pictures: headless Edge as a guest (never signed in), the old values injected over the new for "before" (`ONLY=<id> node capture.mjs <dir> http://localhost:4421/`, one family per run: the page slows after many tile switches).
