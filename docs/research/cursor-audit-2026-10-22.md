# Cursor audit for the desktop app (2026-10-22)

The owner asked: research and audit Cursor for what can improve the Electron app visually, in its layout and in its
architecture (layout, alignment, margins, gaps, spacing, density).

**Method.** Cursor's values were read from its installed bundle (Cursor 3.24.12):
- `workbench.desktop.main.css` (the IDE);
- `workbench.glass.main.css` and `.js` (the Agents window, built on Cursor's own `--cursor-*` tokens);
- `main.js` (the window chrome).

Nothing was launched or changed. Area's values were measured in the running app (`apps/desktop`, type 13, Compact,
1440 × 900, light) with headless Edge, as `getBoundingClientRect` and computed style. Cursor has two systems:
- the VS Code chrome: dense, square and full-bleed;
- Cursor's own surfaces (Agents window, Cursor Settings, agent panel): 4px tokens, 28 rows and rounded inset plates.

Area's app already resembles the second, so most comparisons below are against it.

**Not verified.** Four values are in hashed React styles and were not traced to a component: the glass window's titlebar
height, its sidebar's default and minimum width, the classic sidebar's default width, and glass button sizes.

## Side by side

| Region | Cursor | Area app | Verdict |
|---|---|---|---|
| Base type | 13/18 labels; **12/16 the workhorse** (rows, buttons, settings); 11/14 captions and section titles; chat 14/22 | **13/18 for everything** in chrome; counts 11/14 | Area has one step where Cursor has three |
| Section titles (lists, settings) | 11/14 or 12/16, **regular weight, tertiary or secondary colour**, sentence case | 13/18, **weight 500**, muted (Sidebar groups, Inspector headings, Canvas sections) | Cursor's hierarchy comes from colour; Area's from weight |
| Titlebar | **35**; command centre 22 tall, radius 6; toolbar gap 2; traffic lights at `floor((h − 14) / 2)` | **39** (38 + 1 rule); controls 24, 7 from top, sides and rule | Area is 4 taller |
| Control heights | ladder 20 / 24 / **28 default** / 32; Cursor's icon buttons 24 (radius 6, padding 4) | **24** everywhere in chrome; icon buttons 24, radius 6 | Icon buttons match; Area's fields are one step denser |
| Sidebar width | min 214 (IDE); glass about 260–360 (unverified) | **240** (200–360) | Fine |
| Sidebar rows | 12/16 text with 6 / 8 padding = **28**; plates 8 in, radius 6, **1 apart**; icon 14, icon-to-text gap 6 | 13/18 text, **26** tall, **1 apart** (27 pitch); plates 6 in, radius 6, text 14 from the edge | Same model. Area fits more text into a shorter row |
| Sidebar section title | 24 tall, 11/14, tertiary, `padding 0 6` inside the 8 inset | 26 tall, 13/18 w500 muted | Area's labels compete with the rows |
| Header ↔ content insets | glass section title text 14 from the edge, cell text 16: **not equal** | header, row and Inspector text all **14** from the edge | Area is stricter. Keep it |
| Counts | count badge 18 min, radius 11, 11px; glass trailing caption 11/14 | 11/14 pill (Count) | Match |
| Panel / view headers | 35 (VS Code `.part > .title`); agent-title actions 24, edge inset 8 | 39 bars, the Titlebar's line, controls 7 in | Area is 4 taller, consistent with its titlebar |
| Inspector / settings rows | Cursor Settings cell `padding 12 14`, label 13/18, description 13/18 secondary, **grouped in a filled card** (radius 12, no border, dividers inset 12) | label column 89, control 133 × 24, **32 row pitch**, sections under 13/500 headings with rules | Area is denser; Cursor groups rows into a card |
| Content column | chat **840** max; content-only settings **680**; VS Code settings 1200 + 24 sides; Cursor Settings 48 gutters, 48 top | **one 1120 measure** for galleries and reading pages; 32 margin | Cursor caps reading pages much narrower than galleries |
| Vertical rhythm (documents) | conversation blocks 16, list items 8, heading-after 4; settings sections 28, section header-to-list 8, list gap 12 | sections 40, heading-to-block 12, cards 12 | Both are tiered. Area's are larger and measured to ink |
| Radius ladder | 2 / **4** small controls and menu rows / **6** rows, buttons, inputs / **8** popovers, composer / **12** cards / full pills; 60% corner smoothing | 6 controls and rows, 8 icon-cell plates, 11 code block, 12 tiles and Stage | Same ladder. Icon-cell plates (8) differ from rows (6) |
| Spacing scale | 4px grid with 2 and 1 half-steps; gaps 4 and 8 dominate, then 6, 12, 2 | Area tokens; app CSS uses space-8 ×47, 12 ×30, 16 ×26, 4 ×21; raw `2px` ×50 and `6px` ×47 | Same scale; Area's app CSS has many raw literals |
| Separation | background steps plus near-invisible strokes (`hsla(0,0%,89%,.05)` in glass); borders only on the side facing the editor; floating layers use a shadow whose first layer is a 1px ring | one hairline (`border-decorative`) between every region | Area draws more lines |
| Scroll edges | sidebar body fades 16 at top and bottom (`mask-image`); 3px shadow when scrolled; overlay bars 10 (lists), 6 (native) | hard clip; overlay ScrollArea | Cursor shows that more is above or below |
| Row hover actions | a 60 slot; the text fades under a 16 mask as actions appear | pin through the context menu | Cursor puts actions on the row |

## What to improve

Ranked by how much each changes what the owner sees, with what each would affect. None of this is built.

### Visual and density

1. **Make section titles quieter: colour, not weight.**
   - Cursor's section titles are regular weight in a secondary or tertiary colour, often a size down (11/14, 12/16).
   - Area's Sidebar group labels, Inspector headings and Canvas section titles are all 13/500, so they compete with the rows and controls under them.
   - Proposal: Sidebar group labels at 12/16 regular muted, 24 tall (Cursor's 24 / 11px is one size smaller still).
   - Affects: `SectionHeading` / Nav group label at the app scale (a component change, owner rule 13), and the
     Inspector's Panel section titles.
   - Keep the Canvas section titles at 13/500. On a reading page they are content headings, as Cursor Settings' 17/500
     page title is.

2. **Add a second text step for dense chrome.**
   - Cursor puts list rows, buttons and settings cells at 12/16 and keeps 13/18 for labels and descriptions.
   - Area is 13/18 throughout, so its 26 rows feel fuller than Cursor's 28 rows.
   - Option A: keep 13/18 and grow Sidebar rows to 28, Cursor's height.
   - Option B: keep 26 rows and drop row text to 12/16.
   - Recommendation: A for the Sidebar. It only changes one value, `--area-ui-row` at Compact, and it reads closest to
     Cursor's Agents window.
   - Affects: every Nav and List box row at Compact, so it is a density-axis change (`area-foundation-change`).

3. **Bars: 35 instead of 39.**
   - Cursor's titlebar and view headers are 35. Area's 39 comes from Panel's bar formula: a 24 control, 7 above and
     below, and the rule.
   - At 35 the controls sit 5 in (Cursor's agent-title inset is 8 at the sides, about 5 to 6 vertically).
   - Affects: the Titlebar, the Canvas bar and the Inspector bar together (they share one line), and Panel's `--_bar`.
     It reverses the owner's 2026-10-18 "evenly inset" 7.
   - Ask before changing.

4. **Fewer lines, more background steps.**
   - Cursor separates regions with a ground step and a near-invisible stroke, and draws borders only where a panel
     meets the editor.
   - Area has a full-strength hairline round every region and under every bar.
   - Option: keep the hairline only between the Canvas and each panel; drop the rules under the Sidebar and Inspector bars.
   - Risky in dark mode, which the owner wants near black (a ground step there is small). Try it as a Layers preview
     before deciding.

5. **Fade scroll edges.**
   - A 16 mask at the top and bottom of the Sidebar and Inspector bodies while they scroll (Cursor's `mask-image`).
   - Cheap, and it fixes rows being cut off hard under the bar.
   - Affects: ScrollArea, as an opt-in prop (a component change), not app CSS.

6. **Group Inspector rows.**
   - Cursor Settings puts a section's rows in one filled card: radius 12, no border, dividers inset 12, cells `12 14`.
   - Area's Inspector sections are rows on the panel under a rule.
   - Area already has Surface `soft`, which would do this without a new component.
   - It costs about 8 of width at the Inspector's 256 minimum. Show the owner before and after; don't change it unasked.

### Layout

7. **Two measures for the Canvas, not one.**
   - Cursor caps reading pages at 680 to 840 and lets galleries and settings run to 1200.
   - Area uses 1120 for both, so Documentation, API and Spec tables stretch to 1120 when the panels are hidden.
   - Proposal: `--_canvas-measure-read: 840px` on a family's Documentation, API, Code and Spec tabs and Setup's start page;
     1120 for galleries.
   - Affects: `studio.css` only.

8. **Unify the plate radius.**
   - Cursor uses one radius per role. Area's icon and type cells use 8 while every row plate uses 6.
   - Proposal: cells take the row radius (`radius-row`), or a written reason is recorded for 8.
   - Affects: List box's grid item corner (the 8 is the component's, not app CSS), so the Icons and Typography sheets
     and any other grid List box.

9. **Row actions on hover (optional).**
   - Cursor reveals a row's actions in a reserved slot and fades the label under a mask.
   - Area's Nav has `revealActions` (built 2026-10-15), so pin or copy could sit on Sidebar rows instead of only in the
     context menu.

### Architecture

10. **Layer the example CSS.**
    - About 600 lines of Testing-tab screen CSS (`.ex-*`, `.ab-*`, `.sc-*`, `.lab-*`, `studio.css` lines 869–1069 and
      1121–1518) sit outside `@layer studio`.
    - Unlayered CSS beats every Area layer whatever its specificity, and 12 of those rules reach into `.area-*` (for
      example `.sc-gold__actions .area-button`, `.ex-side__foot .area-nav`).
    - So the screens override components in a way rule 13 forbids, and silently.
    - Fix: wrap them in `@layer studio` (or `studio.examples`). Then fix any rule that stops working, because it was
      overriding a component.

11. **Split `studio.css` (1,518 lines) by region.**
    - It holds the app's chrome, every tab, Theme Setup, the choice drawings and every example screen.
    - Proposal: `chrome.css` (titlebar, workspace, panels), `canvas.css` (feed, tiles, Stage), one file per page, and
      one per example, imported in that order inside one layer.
    - This mirrors `src/` and `docs/ARCHITECTURE.md`. No visual change.

12. **One place for the app's layout values.**
    - Inset 14, bar, Canvas margin, gap, heading, section and measure live in `.studio` and `.studio-canvas`.
    - Panel widths (240 and 256) live in TypeScript (`usePanelWidth` limits).
    - Raw `2px` (×50) and `6px` (×47) and 85 `/* pick */` values are scattered.
    - Most picks are the choice drawings' mini-UIs, which is fine. The layout ones should be named `--_studio-*`
      properties in one block at the top, with widths read from them, so the next density pass changes one place.

13. **Theme Setup is not on the feed's spacing.**
    - `.setup` has its own 24 / 16 gaps and a 960 / 720 measure.
    - Once the owner's Setup layout settles, put it on the Canvas's tokens (margin, section, heading, reading measure).

## What Area already does better

- **One inset everywhere.** Header text, row text and Inspector labels all start 14 from the region edge, and plates
  hang into it. Cursor's glass sidebar puts section titles at 14 and cell text at 16.
- **Spacing measured to ink.** Titles, ledes, prose and read-only tables are trimmed to cap and baseline, so the feed's
  12 and 40 are what the eye sees. Cursor measures to boxes.
- **One line across regions.** The Titlebar, Canvas bar, Inspector bar and Sidebar first row centre on one line (58 at
  this scale). Cursor's IDE has 35 titles but 22 pane headers.

## Values used

Cursor: spacing `--cursor-spacing-N` = N × 4; radius xs 2, sm 4, base 6, lg 8, xl 12, 2xl 14, 3xl 16, 4xl 18; type
xs 11/14, sm 12/16, base 13/18, lg 14/22; heights 20 / 24 / 28 / 32; glass sidebar cell `padding: 6px 8px; radius 6`,
sections `gap 1; padding 0 8 16`, section title `height 24; padding 0 6; 11/14`; Cursor Settings layout gap 48, page
title 17/21 w500, section title 12/16 secondary, cell `padding 12 14; gap 20`, group card bg-quinary radius 12, divider
inset 12; composer and chat column 840; content-only settings 680.

Area (measured): body 13/18 Geist; Titlebar 1440 × 39, tabs 24 tall with padding 0 8 and radius 6, search 240 × 24;
Sidebar 240, rows 228 × 26 at x 6 with a 27 pitch, radius 6, group label 26 tall 13/500 muted, Count 11/14; Canvas bar
39 with controls 24 tall 12 apart; Inspector 256, section heading block 32, label 89 wide, control 133 × 24, row pitch 32;
Canvas margin 32, gap 12, heading 12, section 40, measure 1120; tiles at least 360 wide, square, radius 12; icon cells
48 with plate radius 8.

## Validation against ChatGPT, Notion and Figma (2026-10-22, second pass)

The owner asked for each item as a design-system proposal, validated against ChatGPT, Notion and Figma as well as
Cursor, and reviewed before and after. Evidence came from the repo's measured captures (`captures/`, specs' tables).
Where an item reads differently after that check, the verdict below replaces the recommendation above.

| # | Item | Verdict | Deciding evidence |
|---|---|---|---|
| 1 | Group labels | **Changed**, the other way round: Menu, List box, Combobox, Command palette and Custom select labels take Nav's (the rows' size, 500, muted), the owner's ChatGPT pick of 2026-09-27. Nav is unchanged | ChatGPT sidebar 14/18 500 over 14 rows; Figma panel headings 550 at the rows' 11; Notion 12/16 500 over 14 and Cursor 11/14 over 12 step down. Size splits 2–2; all four separate labels by weight or ink, not case |
| 2 | Rows 28 | **Kept at 26** | Notion, the primary product for navigation, has Area's proportion: 30 rows for 21 leading (1.43) against Area's 26 for 18 (1.44). ChatGPT (35 / 20), Figma's file browser (28 / 16) and Cursor (28 / 16) give more room |
| 3 | Bars 35 | **Kept at 39** | Inset to control: Notion 8 / 28 (0.29), Area 7 / 24 (0.29), ChatGPT 8 / 36, Figma panel header 12 / 24 (0.5). Only Cursor (5 / 24) is tighter |
| 4 | Fewer lines | **Kept** | Split: Notion steps the sidebar's ground and keeps a hairline; ChatGPT uses a 0.5px ring; Figma rules its panel header and sections. The owner's one-surface trial (2026-10-12) stands |
| 5 | Scroll fades | **Not proposed** | Only Cursor; the capture script cannot read masks, and no product doc reports one |
| 6 | Grouped Inspector rows | **Kept bare** | Figma (primary for the Inspector) and Notion's properties are bare rows; only ChatGPT's settings page draws a card |
| 7 | Reading measure | **Kept** | Notion caps text (708–720) and runs tables full width (1152); Area caps prose at 80ch and lets tables use the 1120 feed, the same split. ChatGPT holds everything to 768 |
| 8 | Plate radius | **Withdrawn** | Not an inconsistency: icon cells and rows both use `radius-row`, which scales with the row; the Canvas previews type 14 / density 32 (row 32, corner 8) while the chrome is 13 / 28 (row 26, corner 6). Figma (5 / 5) and Notion (6 / 6) also share one corner |
| 9 | Row hover actions | **Proposed, not built**: a revealed action takes a trailing count's place on hover (the Components Sidebar's Pin). It needs product UI rule 2 amended (hover never changes ink), which `cohesion.test.mjs` enforces; the owner decides | Notion (0-wide slot at rest, actions at the end on hover), ChatGPT (actions cover the row's end), Figma (24 action at the end) |
| 10 | App CSS reaching into components | **Changed**: `check:app-css` fails on new rules; the 21 existing ones are listed with their gap, and the gaps are in PRODUCT_UI.md | Correction: layering was not the problem. The `studio` layer is declared after Area's, so its rules already outrank components; the issue is any app rule whose subject is an `.area-*` class (rule 13) |
| 11 | Split studio.css | **Changed**: 13 files under `src/styles/`, one `studio` layer | Pixel diff of 42 views: identical (the Abstract board's 18 px also differ between two after-captures, render noise) |
| 12 | Layout values in one place | **Changed**: the Canvas's and tiles' constants join the chrome's in `.studio` (app.css) | Same pixel diff |
| 13 | Setup on the feed's tokens | **Deferred** until the owner's Setup layout settles; its own padding already gave way to the Canvas margin | — |

## Owner's decisions (2026-10-23, review page `verdicts`)

| # | Decision | Applied |
|---|---|---|
| 1, 10, 11, 12 | Keep | As built |
| 2 | Use the option | Rows 28 at type 13 Compact: `ui-row` keeps at least 5 above and below its text (emit/base.ts); the Sidebar's first row centres on the shared line at any row height (app.css) |
| 3, 6, 7 | Keep current | No change |
| 4 | Use the option | The Canvas header and the Inspector's bar (Panel `bareBar`) carry no rule; the Sidebar sits on the chrome's recessed ground (`data-area-chrome`, Panel `data-area-ground="recessed"`); the Titlebar keeps its rule |
| 5, 8, 13 | Agree | Not proposed / withdrawn / deferred |
| 9 | Build it | Nav `revealActions` over a trailing count takes its place; product UI rule 2 gains that one exception, named in `cohesion.test.mjs`; Pin on Components Sidebar rows, out of the Tab order |

