# Area as one design system: evaluation and plan (2026-11-11)

This is the owner's synthesis of fourteen reports in this folder, plus the app-audit session's note on what is already built in another worktree. Five audited the source (geometry.md, type-ink.md, shape-state.md, interaction.md, structure-backlog.md). Five studied references: ref-cursor-claude.md, ref-chatgpt-figma.md, ref-design-systems.md, ref-behaviour.md, and ref-live-products.md, which measured six live products rendered. Four reviewed all 125 families as rendered at the shipped defaults (rendered-actions-fields.md, rendered-navigation-pickers.md, rendered-content.md, rendered-status-conversation.md), using the method in rendered-method.md. The plan is also in plan.json for a review page.

Every finding id from every report sits in exactly one plan item: 451 ids in total. 446 are placed; 5 are recorded as done, superseded or needing no change (§10). Ids keep their report's prefix. G is geometry, T type and ink, S shape and state, I interaction, B-B / B-S / B-P structure and backlog, and BL- marks a backlog row that had no id of its own. RC is Cursor and Claude, RF ChatGPT and Figma, RD the design systems, RB behaviour and RL the live products. VA, VN, VC and VS are the four rendered reviews. AU is the app-audit session's note.

Values are at the shipped defaults (type 13, density 32, corner 10), and lengths are CSS px, unless a line says otherwise. "Compact" is the desktop app's own density. One caveat applies to the whole capture set: it predates the owner's move of the light Layer contrast default from 0 to 50 (built in the other worktree, item F0). Every light ground, plate and well in the rendered reviews was measured at Layers 0. The plan marks those findings "re-measure after the merge" rather than treating them as fixes.

## 1. Verdict

**What Area is today.** Area is a system with unusually principled foundations and uneven execution on top of them. Four things must not be disturbed, because the evidence says no reference matches them:

- **Insets derived from the cap.** Padding is computed from the cap height and the icon box, with the border counted once and whole pixels. Rendered, the cap centre sits at 0.00 from the box centre on every tile of Button (45 tiles), Chip, Segmented, Menu, Nav, Command palette and List box, and Checkbox and Radio are cap-exact on all 49 tiles (VA §2, VN §3b). Spectrum and shadcn hand-tune what Area computes and land within 1 px of it (RD §2.1).
- **Concentric corners as a rule.** The rule is max(min(floor, own), outer − inset), which is Apple's concentric(minimum:) in CSS. It is stricter than Radix (8 over 4 with an 8 inset) and shadcn (8 over 6 with a 5 inset); only Geist's menu matches it (RL §4). Board's 16 / 8 / 8 nesting and the segmented tracks are exact by the numbers (VC §7, VA §6).
- **Inks solved per ground under every setting.** State fills keep an order (hover < selected < pressed) that no other system guarantees in code, Pills is a per-family set, and every derived token re-derives inside a scoped subtree (RD §2.10). In light, Area's ink hierarchy sits exactly at the live products' median: muted is 5.74:1 and the default-to-muted gap is 2.57, against a median of 2.6 (RL §2b).
- **Overlays on the platform.** Overlays use the Popover API and showModal, motion is tokens with zero literal durations, exits are tested to be faster than entries, and tooltip handling (skip window, pass-through name tooltips, closing on window blur) is beyond what Radix ships (I §5, RB §8).

**The six root causes.** Every finding traces to one or more of these.

1. **Defaults moved without their formulas.** Type moved 14 → 13 and the corner 8 → 10, but formulas, comments and families written at type 14 were not carried. Values now land between rungs: gap-row is 10 (verified base.ts:488), radius-step is 10 while the medium Button draws 8 (base.ts:537), Code block sm has a 17 line, Card's media corner is 11, and about 25 comments quote numbers that no longer render (G1, S1, T7, S25, G19, T25, S17).
2. **Shared parts restated per family.** Families built in different sessions restate the same part with small differences. Card-like frames render seven corners (VC3), chat cards eight corners and eight insets (VS1), marks four heights and three corner rules (VS2), and header bars six to eight heights (G6, VN7). Five families copy the field shell's slot ladder (B-S5).
3. **Behaviour written per family.** There are five menu engines (I2), five typeaheads (I5), three roving-focus models (I13) and six listbox implementations (B-S4), and none is tested in a DOM (BL-Q1). The visible results: submenus close on the way to them (I1), toasts appear inert under modals (I3), and required pickers submit empty (I6).
4. **Out of range against shipped products.** Area is outside the references' range in a consistent direction:
   - overlay motion about twice as long (menus 210 ms against 100–150; RC3, RF4);
   - floating lists roomier and rounder (rows 30 with a 10 gap and corner 10 / 14, against 24, 6 and 6–8 / 10–12; RC4, RL3);
   - dark washes 2–3 times heavier (14% against 5–8%; RC5, RF2);
   - one text ink fewer than the desktop apps (RC8, RF1), with the dark hierarchy compressed so muted is only 1.49:1 from default (RL1).
5. **Flat hierarchy.** Nothing goes above 20/28 for words or above 500 for weight, while every rendered product titles a page at 590–700 (T16, RL4, VC13). The other worktree has built the tokens; no component reads them yet (F0, A9.1).
6. **Nothing rendered is tested.** Drift therefore returns after every pass, and the gallery's own defects make good components look unfinished: tile names that drop a space (VN25, VS5), stages wider than their cards (VC8), and demos that hide their state (VA6, VN27, VC9). Five of the ten weakest-scoring families are weak partly or wholly because of the gallery (Input group, Shortcut list, Meter, Design card, Turn notice).

The thesis in PLAN-ARCH holds. One addition from the live products (RL1): the dark hierarchy is compressed as well as one ink short. One qualification: by the ratio of height to text, Area's control heights are inside the web products' range (2.31 against 2.29), so "roomier" applies to floating lists and to the desktop apps, not to every control.

**What done looks like.**

- Each shared part (frame, row, field shell, header bar, mark, popup surface) is one recipe that every family reads.
- Each rule written by this plan has a rendered check (F1) that fails when a value drifts, and a behaviour test (F2) for each shared hook.
- The owner's choices on motion, menu density, corners, washes and inks are made from the evidence in §7.
- The heading tokens are adopted.
- Every family scores at least 4 on all six rendered dimensions, light and dark, in a fresh capture at the then-current defaults.

## 2. Scorecard

### The system on the owner's dimensions (1–5)

| Dimension | Score | The findings that most justify it |
|---|---|---|
| Visual design quality | **4** | Rendered median family score is 4; Button, Menu, Command palette, Board, Plan and Timeline read as shipped product (VA §6, VN §7, VC §7, VS §6); held back by faint light plates (VS6) and roomy, round floating lists (RC1, RC4). |
| Structural design | **3** | One manifest, a parity check and an orthogonal registry are rare (B §5); but six listbox implementations with no shared keyboard hook (B-S4), no frame part (BL-C2) and a slot vocabulary in five spellings (B-S1). |
| Visual balance | **3** | Cap centring exact in Button, Menu, Checkbox (VA §2); off by 0.6 in a dozen families (VN8, VA1), Switch 3 px high in Setting row (VA3), Panel on two grids (VN16), templates 79 px empty (VC20). |
| Consistency | **3** | Card-like frames use seven corners (VC3), marks four heights and three corners (VS2), eight header bars (G6, VN7), five open-trigger paints (S3). |
| Coherence | **3** | Card and Surface share a corner but not inset or title (VC5); chat cards eight corners (VS1); rows agree on height and paint but not corner, edge or icon ink (VN9). |
| Usability | **3** | Toasts render inert under modals (I3); required pickers submit empty (I6); 11 families have targets under 24 with no hit expansion (G3). |
| Interaction | **3** | Tooltip hardening and Combobox match or beat the libraries (RB §8); submenus close on the way to them (I1, RB1), five menu engines (I2), overlays about twice the references' duration (RC3). |
| Cleanliness | **3** | Motion is tokens end to end and every hover is media-gated (I §5, S §4); literal fills (S6, S20), stale default numbers in ~25 comments (G19, T25, S17), CSS files not named by family (B-S15). |
| Clarity | **3** | Two text inks where references use three (RC8, RF1); dark muted only 1.49:1 from default (RL1); hierarchy stops at 20/28 500 (T16, RL4). |
| Customizability | **4** | 63 settings with solved inks per ground, ordered state fills and scoped re-derivation, which no reference has (RD §2.10); no typeface setting (RD16), brand second and third colours read by nothing (B-S16). |
| Performance | **2** | A 3.4 MB unminified stylesheet in one entry (I18); no memo or windowing anywhere (I17); synchronous layout work on every scroll in every menu (I9). |
| Product coverage | **2** | No shipped compositions, every recreation rebuilt the shell (B-P1); no responsive or safe-area rules (B-P2); mobile, media and calendar the weakest product types (B §4.1). |

### Every family as rendered (125, weakest first)

Each family was scored 1–5 on six dimensions by the reviewer of its group (VA actions and fields, VN navigation, overlays and pickers, VC content, VS status and conversation), at the shipped defaults, light and dark, at true scale. Mean is over the dimensions that apply (“–” = not applicable). Scores are the reviewers'; the verdicts are shortened from theirs. Light values were taken at Layers 0 (see F0).

| # | Family | Kind | Bal | Spc | Type | Shape | Col | Feel | Mean | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | turn-notice | conversation | 1 | 2 | 3 | – | 4 | 1 | 2.20 | Two of three tiles collapse to 75 wide and wrap. |
| 2 | code-block | status | 2 | 3 | 3 | 2 | 3 | 3 | 2.67 | Wrapped number centred, 13 / 11.5 corners, header aligned to nothing. |
| 3 | code | status | 3 | 3 | 2 | 3 | 3 | 3 | 2.83 | 11.375/15.36 off the ramp, 21.38 tall, taller than its line. |
| 4 | hover-card | navigation | – | – | – | – | – | 3 | 3.00 | Card never rendered open; trigger only. |
| 5 | design-card | content | 2 | 3 | 4 | 3 | 4 | 2 | 3.00 | Held tile's design overflows its ground; screen tile an empty frame. |
| 6 | citation | conversation | 3 | 3 | 2 | 4 | 3 | 3 | 3.00 | Pill text 0.6 high; fill barely visible; 9.15 px footnote. |
| 7 | chart | content | 3 | 3 | 3 | 4 | 3 | 3 | 3.17 | Last x tick clipped, tiles bleed, mono ticks, yellow series 1.8:1. |
| 8 | surface | content | 3 | 3 | 3 | 4 | 3 | 3 | 3.17 | Card's corner with a different inset and title; soft variant invisible but still pads. |
| 9 | attachment | conversation | 3 | 3 | 4 | 4 | 3 | 2 | 3.17 | File card half empty, PDF said twice; checkerboard default. |
| 10 | message | conversation | 3 | 3 | 4 | 4 | 2 | 3 | 3.17 | Light bubble almost invisible; actions not optically aligned; shown while streaming. |
| 11 | dialog | navigation | 4 | 3 | 3 | 3 | 4 | 3 | 3.33 | Close 3 off concentric; title moves 2.8 with or without close; scroll cut with no cue. |
| 12 | tabs | navigation | 3 | 4 | 3 | 4 | 3 | 3 | 3.33 | Plate tabs don't hang; status words in tone ink; text 0.6 high. |
| 13 | pagination | navigation | 4 | 3 | 3 | 4 | 3 | 3 | 3.33 | Two inks in one bar; default tile 1.3 from the card edge. |
| 14 | panel | pickers | 3 | 3 | 4 | 3 | 4 | 3 | 3.33 | Rows on two column grids; loose bar to section; corner action off column. |
| 15 | scroll-area | pickers | 3 | 4 | 4 | 2 | 4 | 3 | 3.33 | Thumbs clipped by the frame's corner (VN3). |
| 16 | token-row | pickers | 4 | 4 | 3 | 3 | 3 | 3 | 3.33 | Default (soft) edge stronger than Outline; 21 tall. |
| 17 | accordion | content | 4 | 3 | 2 | 4 | 4 | 3 | 3.33 | Plain md title equals its body; chevron meaning flips between variants (VC15). |
| 18 | file-page | content | 4 | 4 | 2 | 4 | 3 | 3 | 3.33 | Faint; label below the type floor (T22). |
| 19 | folder | content | 4 | 4 | 2 | 4 | 3 | 3 | 3.33 | Count text below the floor; nearly vanishes in dark. |
| 20 | shortcut-list | status | 4 | 4 | 3 | 3 | 4 | 2 | 3.33 | Every inline tile clipped at 100%; Kbd keys 11/10. |
| 21 | meter | status | 3 | 4 | 3 | 4 | 4 | 2 | 3.33 | Every tile clipped at 100%; label and value differ from Progress. |
| 22 | composer | conversation | 3 | 3 | 4 | 3 | 4 | 3 | 3.33 | Footer note centred, footer not pill, round actions in a 19 corner. |
| 23 | composer-menu | conversation | 3 | 3 | 3 | 3 | 4 | 4 | 3.33 | 1 px narrower than the composer, 7 gap, 14 vs 19 corners, 11 path. |
| 24 | page-header | content | 4 | 4 | 2 | – | 4 | 3 | 3.40 | Hierarchy too flat: sm equals Section heading, lg tops at 20/500. |
| 25 | skeleton | status | 3 | 4 | – | 3 | 4 | 3 | 3.40 | Text bar = font size; 4 corner everywhere. |
| 26 | alert | status | 4 | 3 | 4 | 3 | 4 | 3 | 3.50 | Action drops to a second row under 480; tone title ink differs from Toast; corner control not concentric. |
| 27 | tag | status | 3 | 4 | 3 | 3 | 4 | 4 | 3.50 | 13 text in an 18 mark, side 5, corner 4: the odd one among marks. |
| 28 | file-image | content | 4 | 4 | – | 4 | 3 | 3 | 3.60 | Correct shape; faint in light and dark. |
| 29 | separator | status | 4 | 4 | – | 4 | 2 | 4 | 3.60 | 7.5% line, near invisible in dark. |
| 30 | kbd | actions | 4 | 4 | 2 | 4 | 4 | 4 | 3.67 | Fixed 11/10 glyphs visibly small beside 13 text (T8); side 4, not 6. |
| 31 | slider | actions | 4 | 4 | 4 | 3 | 4 | 3 | 3.67 | Seven track drawings; the vertical tile renders a 0-tall track (gallery, VA5). |
| 32 | input-group | fields | 4 | 4 | 4 | 4 | 4 | 2 | 3.67 | Sound at its defaults, but 9 of 12 tiles collapse the field (gallery, VA4); seams lighter than the edge (S16). |
| 33 | date-picker | fields | 4 | 3 | 3 | 4 | 4 | 4 | 3.67 | Panel has three left edges (VA11); days at 11 (T1). |
| 34 | date-range-picker | fields | 4 | 3 | 3 | 4 | 4 | 4 | 3.67 | Same trigger and panel as Date picker (VA11). |
| 35 | tag-picker | fields | 4 | 4 | 4 | 4 | 3 | 3 | 3.67 | Every demo tag a different hue (VA14). |
| 36 | stepper | navigation | 4 | 4 | 4 | 4 | 3 | 3 | 3.67 | Connectors at 7.5% vanish, most in dark. |
| 37 | list-box | pickers | 4 | 3 | 4 | 4 | 4 | 3 | 3.67 | Grid heading on no column; grid leaves 34 dead. |
| 38 | card | content | 4 | 4 | 4 | 4 | 3 | 3 | 3.67 | Padding now right (18 on every edge, all 26 tiles); invisible media plates and empty templates. |
| 39 | description-list | content | 4 | 4 | 3 | 4 | 4 | 3 | 3.67 | Clean rows; two label styles; first letter clipped in the gallery. |
| 40 | file-tile | content | 4 | 4 | 4 | 4 | 3 | 3 | 3.67 | Good grid; selection plate weak; glyphs washed out in dark. |
| 41 | avatar | status | 4 | 4 | 4 | 4 | 3 | 3 | 3.67 | Initials plate faint; Group demo mixes circles and squares. |
| 42 | empty-state | status | 4 | 4 | 4 | 4 | 3 | 3 | 3.67 | Good rhythm; icon plate nearly invisible; Panel's ghost action reads as text. |
| 43 | alignment-picker | actions | 4 | 4 | – | 4 | 3 | 4 | 3.80 | Its 0.982 well vanishes on the gallery ground in light; dots faint in dark (VA22). |
| 44 | reference-list | content | 4 | 3 | 4 | – | 4 | 4 | 3.80 | Rows at an 18 pitch with no gap; Highlighted shows nothing. |
| 45 | section-heading | content | 4 | 4 | 3 | – | 4 | 4 | 3.80 | 16/500 over a 12 lede: the lede a step too small. |
| 46 | toolbar | actions | 4 | 4 | 4 | 4 | 4 | 3 | 3.83 | Floating tile shows no toolbar (VA6); surface bars read well in dark. |
| 47 | selection-bar | actions | 4 | 4 | 4 | 4 | 3 | 4 | 3.83 | Count not cap-trimmed beside trimmed buttons (VA1); danger action pale in dark (VA15). |
| 48 | popover | navigation | 4 | 4 | 4 | 4 | 4 | 3 | 3.83 | Close 1 off concentric; outline secondary unlike other overlays. |
| 49 | confirm-dialog | navigation | 4 | 4 | 4 | 3 | 4 | 4 | 3.83 | Good alone; disagrees with Dialog on ink, trim and Cancel. |
| 50 | nav | navigation | 4 | 4 | 4 | 4 | 4 | 3 | 3.83 | Closable tab hides its own name (VN2); pictures demo blank. |
| 51 | tree-view | navigation | 4 | 4 | 4 | 4 | 3 | 4 | 3.83 | Muted icons vs Nav; label 0.6 high; Guides tile shows nothing. |
| 52 | calendar | pickers | 4 | 4 | 3 | 4 | 4 | 4 | 3.83 | Day numerals 11 in 30 cells; nav 2 off concentric. |
| 53 | file-upload | pickers | 4 | 4 | 4 | 4 | 4 | 3 | 3.83 | Tile 2 px from the card edge, sides merge with the card. |
| 54 | splitter | pickers | 4 | 4 | 4 | 4 | 4 | 3 | 3.83 | End tile overruns its card. |
| 55 | asset-row | pickers | 4 | 4 | 3 | 4 | 4 | 4 | 3.83 | 11 px name in a 56 row. |
| 56 | asset-card | content | 4 | 4 | 4 | 3 | 4 | 4 | 3.83 | Polished frame-in-card, but corner 20 (spec 16) and name above, unlike its siblings. |
| 57 | mention | content | 4 | 3 | 4 | 4 | 4 | 4 | 3.83 | Chip 21 tall in an 18 line: wrapped chips collide. |
| 58 | table | content | 4 | 4 | 3 | 4 | 4 | 4 | 3.83 | A real data table; header weak, selection column makes rows taller, sticky column wraps. |
| 59 | toast | status | 4 | 4 | 4 | 3 | 4 | 4 | 3.83 | Clean; control 3 off concentric. |
| 60 | badge | status | 4 | 4 | 4 | 4 | 4 | 3 | 3.83 | Solid ladder; Plain drops to 400; three tone names paint one look in light. |
| 61 | badge-group | status | 4 | 4 | 4 | 4 | 4 | 3 | 3.83 | Fine; the auto tile shows a stray resize grip. |
| 62 | approval | conversation | 4 | 4 | 4 | 3 | 4 | 4 | 3.83 | Strong; key corner 2; Answered keeps “Esc to cancel”. |
| 63 | prompt-suggestions | conversation | 4 | 4 | 4 | 3 | 4 | 4 | 3.83 | Aligns with the composer; chips radius 8 under pill actions. |
| 64 | queue | conversation | 4 | 4 | 3 | 4 | 4 | 4 | 3.83 | Head drawn differently from Plan's. |
| 65 | step | conversation | 4 | 4 | 4 | 4 | 3 | 4 | 3.83 | 18 rows (target), 7.5% rail. |
| 66 | zoom-control | actions | 4 | 4 | 4 | – | 4 | 4 | 4.00 | Ghost value and chevron; its menu corner 14 (VA8). |
| 67 | switch | actions | 3 | 4 | 4 | 5 | 4 | 4 | 4.00 | Label 0.61 above the track centre (VA2); sits 3 high in Setting row (VA3). |
| 68 | time-field | fields | 4 | 5 | 3 | 5 | 3 | 4 | 4.00 | Empty-state colon in the default ink between muted dashes (VA13). |
| 69 | color-field | fields | 4 | 5 | 3 | 4 | 4 | 4 | 4.00 | Hex with “#” in one layout and without in another (VA19). |
| 70 | editable-text | fields | 4 | 4 | 4 | 4 | 4 | 4 | 4.00 | Tiles change type size between demos. |
| 71 | setting-row | fields | 3 | 4 | 4 | 5 | 4 | 4 | 4.00 | The Switch sits 3 above the row's centre beside centred Selects (VA3). |
| 72 | toggletip | navigation | 4 | 4 | 4 | 4 | 4 | 4 | 4.00 | Tooltip's inverse bubble, not a Popover. |
| 73 | drawer | navigation | 4 | 4 | 4 | 4 | 4 | 4 | 4.00 | Soft Cancel (not Dialog's ghost); solid. |
| 74 | color-picker | pickers | 4 | 4 | 4 | 4 | 4 | 4 | 4.00 | Polished; header glyph 13 vs text 16. |
| 75 | color-swatch-picker | pickers | 4 | 4 | – | 4 | 4 | 4 | 4.00 | Selected drawn differently from Palette and List box. |
| 76 | property-list | pickers | 4 | 4 | 4 | 4 | 4 | 4 | 4.00 | Good inspector-style rows. |
| 77 | box-model | pickers | 4 | 4 | 4 | 4 | 4 | 4 | 4.00 | Fine. |
| 78 | figure | content | 4 | 4 | 4 | 4 | 4 | 4 | 4.00 | Good caption rhythm; the long-caption tile never wraps. |
| 79 | table-of-contents | content | 4 | 4 | 4 | 4 | 4 | 4 | 4.00 | Nav rows, clear current bar; text on fractional pixels. |
| 80 | video-player | content | 4 | 4 | 4 | 4 | 4 | 4 | 4.00 | Controls on 72% black plates read well; lengths not verified. |
| 81 | indicator | status | 4 | 4 | 4 | 4 | 4 | 4 | 4.00 | A second counter at 16/500 beside Count's 18/400. |
| 82 | spinner | status | 4 | 4 | – | 4 | 4 | 4 | 4.00 | Good sizes 12 / 16 / 24, 25% track. |
| 83 | timestamp | conversation | 4 | 4 | 4 | – | 4 | 4 | 4.00 | Plain 12/16 muted; no tabular figures. |
| 84 | edit-summary | conversation | 4 | 4 | 4 | 4 | 4 | 4 | 4.00 | Good; head 34 where siblings are 30. |
| 85 | model-picker | conversation | 4 | 4 | 4 | 4 | 4 | 4 | 4.00 | Fine. |
| 86 | scroll-to-latest | conversation | 4 | 4 | 4 | 4 | 4 | 4 | 4.00 | Fine; shows the column's flat 24 rhythm. |
| 87 | split-button | actions | 4 | 4 | 5 | 4 | 4 | 4 | 4.17 | Matches Button; the icon-only trigger is 15 wide (G3). |
| 88 | filter-bar | actions | 4 | 5 | 3 | 5 | 4 | 4 | 4.17 | Label: Value in one ink and weight, so the value does not lead (VA21). |
| 89 | field | fields | 4 | 5 | 3 | 5 | 4 | 4 | 4.17 | Error and count at 11 beside a 12 description, ~1 px off its baseline (T1, VA12). |
| 90 | number-field | fields | 4 | 4 | 4 | 5 | 4 | 4 | 4.17 | A good inspector pattern; no tabular figures (T9). |
| 91 | otp-field | fields | 5 | 4 | 4 | 5 | 3 | 4 | 4.17 | Clean slots; empty slots nearly disappear in dark (VA22). |
| 92 | custom-select | fields | 4 | 5 | 4 | 4 | 4 | 4 | 4.17 | Value 0.61 high (VA1); listbox corner 12 against menus' 14 (VA8). |
| 93 | combobox | fields | 4 | 5 | 4 | 4 | 4 | 4 | 4.17 | Toggle 5 from the edge where Input actions sit 4; matches Custom select. |
| 94 | textarea | fields | 4 | 5 | 4 | 4 | 4 | 4 | 4.17 | First line matches Input; the OS resize grabber sits over the corner (VA20). |
| 95 | command-palette | navigation | 5 | 4 | 4 | 4 | 4 | 4 | 4.17 | Search and row icons share x, input and labels share x: the model list surface; 14 corner vs Dialog 20. |
| 96 | tooltip | navigation | 4 | 4 | 4 | 5 | 4 | 4 | 4.17 | Kbd concentric (refutes S2 for Tooltip); text 0.5 high. |
| 97 | stack | content | 5 | 5 | 4 | 4 | 4 | 3 | 4.17 | Correct gaps; outline-button demo reads as a wireframe. |
| 98 | titlebar | content | 5 | 4 | 4 | 4 | 4 | 4 | 4.17 | Bar 47 with 26 controls centred; floating variant good. |
| 99 | count | status | 5 | 4 | 4 | 4 | 4 | 4 | 4.17 | Centred, tabular; documented heights wrong. |
| 100 | progress | status | 4 | 4 | 4 | 5 | 4 | 4 | 4.17 | Shipped-product proportions (4 / 6 / 8, pill). |
| 101 | color-swatch | pickers | 5 | 4 | – | 4 | 4 | 4 | 4.20 | Fine. |
| 102 | link-groups | content | 5 | 4 | 4 | – | 4 | 4 | 4.20 | Clear three-level hierarchy. |
| 103 | input | fields | 4 | 5 | 4 | 5 | 4 | 4 | 4.33 | Affix and value on different baselines (VA1); the phone demo reads “+1 1”. |
| 104 | password-field | fields | 4 | 5 | 4 | 5 | 4 | 4 | 4.33 | Matches Input; the empty new tile has no placeholder. |
| 105 | search-field | fields | 4 | 5 | 4 | 5 | 4 | 4 | 4.33 | Its clear is the error mark dismiss-circle (VA18). |
| 106 | box-field | fields | 4 | 4 | 4 | 5 | 4 | 5 | 4.33 | A convincing inspector control. |
| 107 | context-menu | navigation | 5 | 4 | 4 | 5 | 4 | 4 | 4.33 | Menu's surface; tree-row demo plain. |
| 108 | timeline | content | 5 | 4 | 4 | 4 | 4 | 5 | 4.33 | Clean, real-looking activity log. |
| 109 | plan | conversation | 5 | 4 | 4 | 4 | 4 | 5 | 4.33 | Best of the chat cards. |
| 110 | link | actions | 5 | 5 | 4 | – | 4 | 4 | 4.40 | Clean underlines and wraps; red and pink inks near twins in light. |
| 111 | hatnote | content | 5 | 5 | 4 | – | 4 | 4 | 4.40 | Fine. |
| 112 | inline-list | content | 5 | 5 | 4 | – | 4 | 4 | 4.40 | Even separators. |
| 113 | button | actions | 5 | 5 | 4 | 4 | 4 | 5 | 4.50 | Exact cap centring and insets; Kbd's 11 px glyphs and the muted ghost ink are the only weak spots. |
| 114 | button-group | actions | 5 | 5 | 4 | 5 | 4 | 4 | 4.50 | Joined seams and outer corners right; soft and outline text tiles hard to tell apart in light. |
| 115 | checkbox | actions | 5 | 5 | 5 | 4 | 4 | 4 | 4.50 | Cap-exact on all 28 tiles; no small size; card heights fractional (48.61). |
| 116 | select | fields | 4 | 5 | 4 | 5 | 4 | 5 | 4.50 | Native shell matches the system. |
| 117 | menu | navigation | 5 | 4 | 4 | 5 | 4 | 5 | 4.50 | Shipped-looking; inactive row inverts title and note; dark double edge. |
| 118 | breadcrumb | navigation | 5 | 5 | 4 | 5 | 4 | 4 | 4.50 | Chevron centred 9.5 from text both sides; clean. |
| 119 | board | content | 5 | 4 | 4 | 5 | 5 | 4 | 4.50 | Best concentric nesting in its group (16 / 8 / 8); calm tones in both themes. |
| 120 | toggle-group | actions | 5 | 5 | – | 5 | 3 | 5 | 4.60 | Off ink differs by variant, 0.452 vs 0.510 (VA9). |
| 121 | abbreviation | content | 5 | 5 | 5 | – | 4 | 4 | 4.60 | Dotted underline, right weight. |
| 122 | chip | actions | 5 | 5 | 5 | 5 | 4 | 4 | 4.67 | Clean cap-trimmed pills; the checkerboard Image tile reads as a placeholder. |
| 123 | segmented | actions | 5 | 5 | 4 | 5 | 4 | 5 | 4.67 | Exact; weight 500 in muted ink (recorded). |
| 124 | radio | actions | 5 | 5 | 5 | 5 | 4 | 4 | 4.67 | Cap-exact on all 21 tiles. |
| 125 | copy-button | actions | 5 | 5 | 5 | 5 | 4 | 5 | 4.83 | Plain and correct. |

System mean 3.87; by kind: conversation 3.59, status 3.61, navigation 3.85, content 3.82, pickers 3.78, actions 4.25, fields 4.08. 13 families score 4.5 or more, 25 below 3.5.

**Best (do not disturb):** Copy button, Abbreviation, Radio, Segmented, Button, Board, Breadcrumb, Timeline, Plan, Menu, Command palette (search icon, row icons and labels on one x: the model list surface). These hold exact cap centring, concentric nesting and one rhythm, and four reviewers named them independently.

**Weakest, and what fixes each:** Turn notice (full width, one-line text: D3); Design card (fit the design on both axes, one container corner, a 500 name: D2, B1.1, B1.2); Code block (first-line numbers, the card corner, a header on the code column: D3, B1.3); Input group (gallery stage width, then a min-content field: F3.2, B3.1); Shortcut list and Meter (stages clipped at 100%: F3.2; Kbd text A9.9); Chart (end ticks, stage, series contrast: D2, F3.2, A10.4); Surface (Card's inset and title, an unpainted soft region: B1.1); Panel (one column grid, the corner action, the bar: B2.7, B4.2, B4.1); Accordion (one title style and chevron: D2); Tabs (hang the plate, trimmed labels, tone on marks: D1, B2.2, A3.4); Citation and Code (the mark rule: B5.1, A9.9); Composer and Attachment (D3).

## 3. Area against the references

The most telling measured values. Desktop apps (Cursor, Claude, ChatGPT, Figma) are declared in their app bundles; “systems” are the fifteen design systems' published source; “live” is six products measured rendered (GitHub, Radix Themes, shadcn, Geist, Linear dark only, Notion). Area's values are at its defaults, with the app's Compact density in brackets.

| Measure | Area | Cursor | Claude | ChatGPT | Figma | Design systems | Live products |
|---|---|---|---|---|---|---|---|
| Medium control height at the default (px) | 30 (app Compact 26) | 24 | 24 | 32 (menus ~29) | 24 | 32 (Primer, Radix, Fluent, Carbon) | 32 at 14 px text (ratio 2.29; Area 2.31) |
| Menu row height | 30 (28) | 24 (md 26) | 24 | ≈29 | 24 | — | 32–36 |
| Row icon → label gap / label column | 10 / 34 (8 / 32) | 6 / 30 | 6 / 30 | 6 / 34 | 4 after a 24 box | 4–8 | 8 (nav rows) |
| Menu row / list corner | 10 / 14 | 8 / 12 | 6 / 10 | 15 / 20 (squircle ×1.25) | 5 / 13 | Radix 4 / 8 | 4–6 / 8–12 |
| Popover / dialog corner | 16 / 20 | 12 / 12 | 10 / 10 | — / 20 | 13 / 13 | Primer 12 | — |
| Card corner / padding | 18 / 18 | — | 10 | settings 16 | — | Radix 8–12 / 16 | 6–14 / 16–24 (ratio .375–.58) |
| Control corner / height | .26–.31 | .25 | .25 | .25–.31 | .21 | Radix .125–.17 | .125–.25 (median .19) |
| Text inks (named) | 2 + disabled | 4 | 3 + disabled | 3 | 3 | 2 + disabled (Primer, Spectrum); 3 (Atlassian, Ant) | 2–3 |
| Dark default : muted contrast | 1.49 | 100 / 74% | #f0efec / #c3c2b7 | white / 70% | white / 70% | — | 2.2–3.1 |
| Dark hover / selected wash | 14% / 19% | 8% / 14% | 7.5% / 15% | 8% (SDK 12%) | 5% / 10% | Material 8% | not driven |
| Menu enter / exit (ms) | 210 / 140, ease-out both | 100 / 100 | none | 150 / 100, exit curve | none | 150–200 | not driven |
| Tooltip open delay (ms) | 500 (skip 300) | 300 | 300 | 150 | 500 (hover cards) | Radix 700, Base UI 600, Ariakit 500 | not driven |
| Focus ring | 2 px, offset 0, neutral solid | 2 px, offset 2 | 1 px + page gap + glow | 2 px, offset 2 / −1 | 1 px, offset 1 | 2 px, gap 2 or inside | not driven |
| Quiet button label weight | 500 | 400 | 400 | 400 (web) | 450 | 500 (Radix, shadcn) | 500 (GitHub default 400) |
| Regular / strong weight | 400 / 500 | 400 / 500 | 400 / 500 (dark 360 / 460) | 430 / 500 | 450 / 550 | Polaris 450 / 550 | Linear 510 / 590 |
| Page title | 20/28 500 at most | 17/21 500 | 24/32 | 24/28 600 | 24/32 550 | Primer 32–40 | 20–32, 590–700 |
| Light menu shadow | 0 0 2 4% + 0 8 16 8% | three 12% layers | 0 8 24 12% + 0 2 6 8% | 0.5 ring + 0 8 16 −4 12% | 0 2 5 15% + 0 10 16 12% + 0.5 ring | Primer ring + 0 6 18 12% | Geist ring + 3 soft layers |
| Dark floating edge | 1 px 12.5% border + 16% rim outside (two lines) | one hairline over the surface | one ring, inside in dark | 0.5 px ring + inset | 0.5 px inset + top-lit 0.5 px | Atlassian 12% ring + lighter surface | shadcn 10% border |
| Dark page | ≈ #020202 | #181818 | #0b0b0b | #181818 over #000 | #2c2c2c panel | — | Geist #000, Linear #08090a, shadcn #0a0a0a |
| Badge height / text | 18 / 11 500 | — | — | — | — | Radix 20 / 12 500 | 20 (18–24) / 12 500 |
| Scroll edge fade | none (Nav, Tree, Code only) | scroll-padding = padding | 28 px, scroll-driven | 16 px under header | 32 px mask | — | not measured |
| Viewport collision padding | 8 | — | 5 | 15 | — | 8–12 | Radix 8 |
**Outside the range.** These are the values where every reference sits on one side of Area:

- **Overlay motion.** Menus open in 210 ms against 100–150 (or no animation at all), and the command palette in 280 ms, while every source asks for 0–100 on the most frequent surface (A5.1, A5.2).
- **Floating lists.** Rows are 30 tall with a 10 gap to the label and a 10 / 14 corner, against 24, 6 and 6–8 / 10–12 (A2.1, B2.3).
- **Corners.** Area's control corner is .26–.31 of the height, against the products' .125–.25. Card's corner equals its padding (1.0, against .375–.58), and a resting Card (18) is rounder than the Popover that opens over it (16): no product does that (A2.3).
- **Dark.**
  - Washes are 14% / 19% against 5–8% / 10–15% (A4).
  - Muted is 1.49:1 from default against 2.2–3.1 (A3.1).
  - Floating surfaces draw two edges (A7.1) on the same tone as the card under them (A7.2).
- **Hierarchy.** Page titles are 20 / 500 at most, against 20–40 at 590–700 (A9.1).
- **Delivery.** The stylesheet is 3.4 MB unminified in a single file (C7.2).

**Inside the range.** Control height measured against the text (2.31 against 2.29), the 4-then-8 shape of the height ladder, button label weight (500, the live median), icon-to-label in buttons (6), menu padding (4) and separator block, badge geometry (height 1.38 × text, side .33, weight 500), Checkbox = line − 4 (the same rule in every product), light washes (5% / 12.5%), light inks, title tracking (−0.01 to −0.02em), and overlay offsets (menu 4, popover 8: Figma's exactly).

**Ahead.** Derived insets (no reference states the rule), concentric arithmetic, solved inks per ground with ordered state fills, Pills per family, scoped re-derivation of every token, type and density as separate numbers, and the tooltip and hover hardening. The gaps between Area and the references are defaults and shared parts. The mechanisms are not the problem, which is why most fixes in §5 are one derivation or one recipe rather than many per-family edits.

**What was not measured.** No hover, focus, pressed or open-overlay state was driven in any live product. Stripe, Raycast, a dashboard product and a storefront were not measured. Linear was seen dark only, Radix, GitHub and Notion light only, and Geist's numbers come from its rendered pages, not its docs. ChatGPT and Figma values for the editor are partly rendered captures from 2026-09-28; the rest of the desktop-app values are declared in bundles, not rendered.

## 4. The detail rules

Each rule below is the one Area should hold. For each, the code today and the gap; the plan item that closes it is in brackets.

### Small gaps and the gap ladder
- **Rule.**
  - A gap reads whole steps of the density (ui-gap-step) and lands on the ladder 2 · 4 · 6 · 8 · 12 · 16 · 24. Only an inset (edge to content) keeps the half step.
  - Between siblings there are three roles: a joined set 2, actions in a header or a line of text 4, and independent controls ui-cluster (6 / 8 / 10).
  - Inside a mark, gaps are 2 or 4.
- **Today.**
  - At type 13 the half step ui-dense is 0.5, so gap-row is 10, Card's section gaps 14 and 18, Tabs 18 and 14, Stack's section 20, Description list's row gap 2 and Card's carousel 7. 10, 14, 18 and 7 are on no ladder.
  - Page header actions, Drawer's stacked footer and the Toaster are a fixed 8.
  - Badge's label gaps are 1 / 3 / 4.
- **Gap.** About a dozen gaps are 2 px off their rung at Default (A1.1, A1.2, B5.1). The row icon → label gap is the exception: moving it to its rung (12) would make menus roomier, away from every reference, so it is decided first (B2.3).

### Spacing between lines of type
- **Rule.**
  - A line joined to a name in the same box is the name's size in the muted ink. text-sm is for text set apart from what it explains.
  - A title and its copy are 4 apart on compact surfaces.
  - A text list is line + 4 and a key-value list line + 8.
  - A metadata line in a row keeps the row's 18 line.
  - Code leading is a role on the type axis: 16 at 13, never 17.
- **Today.**
  - Joined lines are 12 in eleven families and 13 in eight more, so a Switch is 13 over 12 while the same setting in a Setting row is 13 over 13.
  - Reference list, Link groups and Description list pitch at 18, 22 and 26.
  - Code block sm and Diff run 11 on a 17 line.
  - Field's count sits about 1 px off its description's baseline (VA12).
- **Gap.** The direction of joined lines (A9.3), the list rhythms (A1.5), the code leading (A9.9) and the text-xs misuse (A9.2). The live products set title → description at 8 where Area uses 4 (RL6); that is an option within A9.3, since the owner set 4 on 2026-11-06.

### When type size changes and when ink changes
- **Rule.**
  - Size steps for hierarchy between levels: page 24, section 16, item 13, and titles from title-sm up at 600.
  - Inside a level, ink or weight steps, never both, except a surface title over its copy (weight and ink, measured in every reference).
  - text-xs (11) is only for marks.
  - A mark's text follows its size prop, never density.
  - Tone colours the mark, never the words.
  - Weight rises only with the default ink, except control labels that keep one weight in every state and the group label (500, muted, owner 2026-10-22).
- **Today.**
  - Twelve word parts set at 11.
  - Tag's text changes with density (13 at Default, 11 at Compact).
  - Alert's title and Tabs' change labels are in tone ink.
  - Four group-heading treatments.
  - Item names split 500 / 400.
  - Nothing above 20 / 500.
- **Gap.** A9.1–A9.5, A3.4 and B5.2.

### Alignment and text centring
- **Rule.**
  - Every one-line label or value in a control, row or tab is cap-centred: a trimmed span, or a native input offset by the same amount computed from 1cap.
  - Multi-line content aligns to its first line, by a box one first line tall.
  - A ghost icon action at an edge puts its glyph on the text column.
  - A first label in a strip sits on the content column.
- **Today.**
  - The exact half of the system measures 0.00. Field values, Switch, Tabs, Tree view, Pagination, Panel rows and Tooltip measure 0.6 high.
  - Switch sits 3 px high in Setting row.
  - Menu's two-line rows centre their leading icon.
  - Card's and Message's ghost actions sit 7 px inside the column.
  - Plate Tabs do not hang their plate.
- **Gap.** B2.2, B2.4, B2.5, B4.3 and D1.

### Corner radius and concentricity
- **Rule.**
  - The Corner number is the real medium control's corner.
  - Every full-width row takes corner(its height).
  - A surface steps off the controls it holds by a stated amount, and a resting card is never rounder than the floating surface over it.
  - A nested shape is outer − inset with a floor, and when the floor is reached the wrapper's pad shrinks so the child stays at the row corner (8), never 4.
  - A corner control is concentric and equidistant from both edges.
  - Components read only public radius roles.
- **Today.**
  - radius-step is the corner of a 32 box (10) while the 30 medium control draws 8, so floating-list rows are 10 beside Nav rows at 8.
  - Card 18, Asset card 20, Design card 24, Dialog 20.
  - Dialog's close is 3 off concentric, Toast's and Alert's 3, Popover's 1, Calendar's 2, Queue's row actions 2. Tooltip's Kbd is exact.
  - Card's well and Surface-in-Panel nest at 4.
  - File upload reads the raw setting leaf.
- **Gap.** A2.1 and A2.2 (fixes), A2.3 (the owner's corner decision), B4.2 (the corner-control token) and B1.1 (the nested floor).

### Padding calculations
- **Rule.**
  - Side = round((H − 1cap)/2 − border) + border for text, and (H − icon)/2 for an icon. The border is counted once and the result is a whole pixel.
  - Fields clear half their corner when pill-shaped, and so do pill Buttons and Chips (corner − 3H/8).
  - Marks use (H − 6)/2.
- **Today.**
  - The formula holds in every control family; rendered sides of 10 / 7 / 8 / 14 at sm–lg are exact.
  - Six cap-centred slots skip the rounding (10.38).
  - Floating lists pad 4 inside their border, so rows sit 5 from the outer edge (documented).
  - Tag's side is 5, Kbd's 4 and Citation's 7, where the mark rule gives 6.
  - Pill Buttons keep a rectangle's sides.
- **Gap.** A11.1, B6.4 (owner), B5.1 and E8. Fields sit text at .33 of their height where three products use .375–.41 (RL7); kept, because it would break the shared x with Button (B3.2).

### Margins
- **Rule.**
  - A container spaces its children by gap. A pair that joins is its own group, never a margin that undoes the parent's gap.
  - Section and page spaces are named roles.
  - A surface's block gap is never larger than its inset.
- **Today.**
  - Eight margin compensations (calc(4px − gap) and the like).
  - Stack doubles gap-row for a section with no token.
  - Popover's blocks are 14 apart inside a 12 edge.
- **Gap.** A1.3, A1.4 and B6.2.

### Inset elements
- **Rule.**
  - A nested backplate (Kbd, Badge, Count, an input action, steppers, a chip's remove) reserves its own square box.
  - A control inside a row keeps the row's height and is centred in its own target, growing its hit area with an absolute ::after.
  - An inline chip never exceeds its line.
  - An unpainted region takes no inset of its own.
- **Today.**
  - The nested boxes are right.
  - Table's checkbox column makes rows 44 instead of 39.
  - Mention chips are 21 tall in an 18 line.
  - Inline Code's box is 21.38.
  - A soft Surface at Layers 0 pads 14 while painting nothing (re-measure at the new light default).
- **Gap.** B2.5, B5.1, A9.9 and B1.1.

### Optical spacing
- **Rule.**
  - Text is placed on its glyphs (cap and baseline, text-box trim).
  - Marks share one whole-pixel cap baseline.
  - A text-only card is optically even top and bottom.
  - Dark weights may need compensation for irradiation.
  - A list highlight lands and leaves at once.
- **Today.**
  - Trim is applied in 26 files and the marks' cap baseline holds.
  - Card's last line is trimmed to its descent, leaving 4–5 px more below the text than above it (recorded).
  - No dark weight offset.
  - Menu row plates fade and trail.
- **Gap.** B1.4 and A9.6 (owner), A5.3.

### Gaps between controls
- **Rule.**
  - Joined controls 2 (segments, row actions), header actions 4, independent controls ui-cluster, footer buttons 8 at Default.
  - Every interactive box has a 24 target, 44 under a coarse pointer.
  - A seam inside a joined control reads the control edge.
- **Today.**
  - Four values with no stated roles.
  - Eleven families with targets under 24 and no expansion (Split button's icon trigger 15 wide).
  - Input group's seams are lighter than its own edge.
- **Gap.** A1.2, A11.2 and B3.1.

## 5. The plan

Every item names its rule, what the code does today, what changes (families and values), the findings it merges, how strong the evidence is, what it depends on and unblocks, its size and risk, how it is verified, and the docs and skills that keep it true. **Seen by** lists which kinds of report found the same issue independently: an item seen by source, rendered and reference reports carries the most weight. Items marked *decision* are never settled by the plan; their options and the evidence for each are in §7. Every rule added here also adds its cohesion test to cohesion.test.mjs and a line to the skill named in Docs.

### F. Truth and safety net (Phase 0)

#### F0 · Merge the other worktree's built work first

*fix · size S · evidence source, confidence high · seen by app audit · build*

- **Rule.** The plan merges what is built and never redoes it; nothing in Phase 1 is tuned before the merge, and every light value measured at Layers 0 is re-measured after it.
- **Today.** Worktree electron-app-audit-cleanup-35275b holds, uncommitted (verified read-only): --area-weight-heading 600 and --area-title-xl-* tokens that no component reads yet; the light Layer contrast default moved 0 → 50 by the owner's decision (dark stays 0), the darkest light ground #f1f3f5, adjusted series grounds and DATA_STATUS.danger; Link as="button"; skill and shell-reference edits. The 2026-11-11 capture set predates the Layers 50 default: every light ground, plate and well in it was rendered at Layers 0.
- **Change.** Merge that branch (owner commits it), rebuild, re-run F1's capture at the new default, then re-read the light findings that depend on the ground: VS6, VC7, VC6 and the region-depth question (A7.2, A10.1, B1.1).
- **Families.** all light grounds, link.
- **Findings.** AU1, AU2, AU3.
- **Depends on** nothing; **unblocks** A9.1, A10.1, A7.2, B1.1, F1.
- **Risk.** Conflicts with this worktree's research files only; nothing else is edited here.
- **Verified by.** git log shows the merge; F1 re-captured at Layers 50 light.
- **Docs and skills.** HANDOFF Current state.

#### F1 · Rendered regression checks from the capture harness

*fix · size M · evidence rendered, confidence high · seen by source + reference · build*

- **Rule.** Every visible rule the plan writes has a rendered check: cap offset in control boxes, painted extent inside its card, header heights, row and corner tables, one dark edge, nothing invisible at rest.
- **Today.** No screenshot baseline, no axe, no target-size, RTL or forced-colours run (system gaps Q2, Q3 open); the 2026-11-11 capture set (1,371 tiles, 27,441 elements) was regenerable scratch and is already gone from the scratchpad.
- **Change.** Move the capture tools (serve, capture, measure-page, merge) into scripts/; add check:rendered that measures the Overview at the defaults, light and dark, and asserts the rule tables (cap centre 0 ± 0.1 in control boxes, extents inside cards, header bars from the two-bar rule, mark heights 14/18/22, one luminance step across a dark floating edge). Baseline PNGs for review pages. Add the Tabs/Segmented first-placement check (RB24) and re-measure Compact sm marks (HANDOFF 11-07).
- **Families.** all 125.
- **Findings.** BL-Q2, BL-Q3, BL-M5, RB24, BL-homarks.
- **Depends on** F0; **unblocks** every Phase 1–4 verification.
- **Risk.** Headless Edge (Chromium 157) is not Electron's Chromium 152: keep tolerances in CSS px from the DOM, never pixel diffs as gates.
- **Verified by.** The check fails on today's VA1, VN1, VN7, VS2 values and passes on a fixed branch.
- **Docs and skills.** DEVELOPMENT.md Checks by change; area-ui-review and area-visual-language cite it.

#### F2 · DOM behaviour test harness

*fix · size M · evidence source, confidence high · seen by source · build*

- **Rule.** Behaviour a shared hook owns is tested once in a real browser; every family adopting the hook inherits the test.
- **Today.** No jsdom, happy-dom, testing-library or Playwright in any package.json; arrow keys are handled in 21 files and tested in none.
- **Change.** Playwright component tests against the built gallery. First suites: menu keys and typeahead, listbox roving, form reset/required, modal focus and dismiss, hit targets.
- **Families.** every interactive family.
- **Findings.** BL-Q1.
- **Depends on** nothing; **unblocks** C1.1, C2.1, C2.2, C3, C5.3, A11.2.
- **Risk.** None visible.
- **Verified by.** Suites run in CI; a deliberately broken typeahead fails.
- **Docs and skills.** DEVELOPMENT.md; area-interaction-pass.

#### F3.1 · Tile names keep the space after “a” and their parentheses

*fix · quick win · size S · evidence mixed, confidence high · seen by rendered · build*

- **Rule.** A specimen's words split before a capital that starts a word; a title that is already words is used as written.
- **Today.** specimenWords (apps/desktop/src/content/specimen-names.mjs:82, verified) splits only ([a-z0-9])([A-Z]), so inADialog → “In adialog”; “List (default)” → “List default)”. 17 tiles in 15 families.
- **Change.** Add ([A-Z])([A-Z][a-z]) to the split; prefer a specimen's title; a test over every label.
- **Families.** badge, code, meter, model-picker, scroll-to-latest, shortcut-list, spinner, prompt-suggestions, copy-button, input, property-list, stack, surface, time-field, video-player, popover.
- **Findings.** VN25, VS5.
- **Depends on** nothing; **unblocks** nothing named.
- **Risk.** None.
- **Verified by.** Unit test on specimenWords.
- **Docs and skills.** none

#### F3.2 · Gallery stages keep their gutter; fluid specimens get a width

*fix · quick win · size S · evidence rendered, confidence high · seen by rendered · build*

- **Rule.** A gallery stage never runs wider than its card; a fluid specimen's wrapper takes the stage width before fit.ts measures it; a component never borrows a width hook for a length.
- **Today.** 22 tiles (all 15 Chart, 7 Description list) plus every Shortcut list and Meter tile sit at x 1.5 with inline-size max(100%, 385px) in a 388 view, so first letters and legend keys clip. Input group's field collapses to 0×18 in 9 of 12 tiles and the vertical Slider's track is 0 tall, both because canvas.css:238 sets --area-input-inline-size: 100% inside a shrink-wrapped stage. Pagination, File upload and Splitter tiles crowd or overrun their cards.
- **Change.** Gallery: one-column cards for wide demos; fluid wrappers take stage width; group demos get fullWidth. Component halves of VA4 and VA5: a grouped field's min-inline-size is min-content; a vertical Slider reads its own --area-slider-block-size (16rem) with a min-block-size of thumb + 2 × track inset.
- **Families.** chart, description-list, shortcut-list, meter, input-group, slider, pagination, file-upload, splitter, drawer.
- **Findings.** VC8, VN26, VA4, VA5.
- **Depends on** nothing; **unblocks** F1.
- **Risk.** The Slider length hook is a hook, not a size; record it with the other width hooks.
- **Verified by.** F1 extent check: no painted box outside its card.
- **Docs and skills.** slider.md, input-group.md; area-component-docs gallery rules.

#### F3.3 · Demos that hide, misstate or fail to show their state

*fix · quick win · size S · evidence rendered, confidence high · seen by rendered · build*

- **Rule.** No tile's specimen is invisible at rest; a state tile forces its state; a wrap tile wraps at the default type.
- **Today.** Toolbar Floating at opacity 0; Tree view Guides identical to Small; Nav pictures blank and its sticky heading paints a white slab; Hover card never open; Reference list Highlighted shows nothing; Figure long caption, Board wrap title, Section heading lede, Editable text long and Message stack render one line; Alert Multiline shrink-wraps to 100 wide; Message authors never share a column; Toast tones filed under Content; Badge group auto shows a stray grip; Avatar group mixes circles and squares; Badge tiles lowercase beside Badge group's Title Case.
- **Change.** Force states in demos; fixed widths on wrap demos; gallery tests: a text containing “wraps” has ≥ 2 line boxes, no specimen at opacity 0.
- **Families.** toolbar, tree-view, nav, hover-card, reference-list, figure, board, section-heading, editable-text, message, alert, toast, badge-group, avatar, badge.
- **Findings.** VA6, VN27, VC9, VC28, VS19.
- **Depends on** nothing; **unblocks** every review page.
- **Risk.** None to components.
- **Verified by.** F1 gallery checks.
- **Docs and skills.** area-component-docs demo rules.

#### F3.4 · Demo copy and media that read as product

*fix · size M · evidence rendered, confidence medium · seen by rendered · build*

- **Rule.** Demos use the placeholder vocabulary with realistic values and one shared demo media set; plates only in loading states; a neutral default tile and a coloured case tile.
- **Today.** Input phone reads “+1 1”; Combobox shows the literal “Placeholder”; Password field new has no placeholder; checkerboard “Image” in Chip, Popover, Attachment; every Tag picker tag a different hue; overlays read Title / Description / Action in 472-tall tiles around 115 dialogs; stat and weather templates leave 79 px empty; two pictures in the whole set.
- **Change.** Copy pass; a shared media set (6–8 neutral photos at several ratios, 3 screenshots of Area itself, one portrait for David Tee); Tag picker default neutral; template squares hug content or carry a Chart sm.
- **Families.** input, combobox, password-field, chip, tag-picker, dialog, popover, card, figure, asset-card, video-player, file-tile, attachment.
- **Findings.** VA7, VA14, VN28, VC20, VC21.
- **Depends on** nothing; **unblocks** nothing named.
- **Risk.** Media: only Area's own screenshots and owned photos.
- **Verified by.** Owner looks at the review page.
- **Docs and skills.** DESIGN_SYSTEM Example copy; area-illustration.

#### F4 · Status registry: no family silently Unrefined; reasons as data

*fix · quick win · size S · evidence source, confidence high · seen by source · build*

- **Rule.** Every page slug resolves to complete, review or deprecated unless listed as intentionally unrefined; why a family is In review is data, not a comment.
- **Today.** code-block, composer, custom-select and meter resolve to unrefined (verified with componentStatus) though their comments say in review; the history lives in a 2,000-character trailing comment (component-status.mjs:171); pages show no stage date.
- **Change.** Add the four to REVIEW_COMPONENTS; a REVIEW_REASONS map (slug → date, reason, source) shown on the page with the stage; a test over pages.mjs.
- **Families.** code-block, composer, custom-select, meter.
- **Findings.** B-B1, B-B2, BL-D2.
- **Depends on** nothing; **unblocks** nothing named.
- **Risk.** Completion stays owner-confirmed; this only stops the mislabel.
- **Verified by.** Node test.
- **Docs and skills.** none

#### F5 · API tab generated; React unions typed from the manifest

*fix · size M · evidence source, confidence high · seen by source · build*

- **Rule.** The manifest is the source for variants and React JSDoc for props (GOVERNANCE §7); nothing restates them by hand.
- **Today.** pages.mjs API rows are wrong in ≥ 14 families (Alert and Toast list 5 of 7 tones, Toast's deprecated action, Badge without plain, Button 8 tones, Dialog without size); 17 React unions are hand-typed, four carry values the manifest lacks (Slider rail/field, Slider range rail, Switch tone, Confirm dialog tone), Alignment and Model picker have a React size with no axis; 25 axes in 18 families have no default; loading is a state in 3 manifests, an element in Menu, absent where the prop exists (Table, Split button, Combobox), busy in Chart.
- **Change.** Generate API rows from manifest + *Props JSDoc; VariantProps<typeof MANIFESTS.x>[axis] for every visual prop; single-value axes become booleans or list their default; a parity check that a behaviour-vocabulary prop has its manifest state.
- **Families.** alert, toast, badge, button, dialog, split-button, slider, meter, otp-field, tag-picker, date-picker, field, asset-card, plan, switch, confirm-dialog, alignment-picker, model-picker, table, chart, menu, nav, tabs.
- **Findings.** B-S2, BL-D5, B-S3, B-S9, B-S11.
- **Depends on** nothing; **unblocks** F7, F8, F10.
- **Risk.** Type changes can break app call sites: aliases one release.
- **Verified by.** check:manifest-parity extended; tsc.
- **Docs and skills.** GOVERNANCE §7; ARCHITECTURE:210 made true.

#### F6 · Stale comments, counts and rule tables

*fix · quick win · size S · evidence source, confidence high · seen by source + reference + rendered (independent agreement) · build*

- **Rule.** A comment quotes a formula, or the value at the shipped default (type 13, density 32, corner 10), and names the type when it quotes another; counts are generated.
- **Today.** inset.css:94 (label at 36: it is 34), stack.css:22, description-list.css:17, setting-row.css:16, timeline.css:12, calendar.css:96, asset-row.css:21, panel.css:482 and :331, navigation.css:861, surface.css:966 (“12 + 4 = 16”: it computes 20, verified), :1111, :1115, :1570, :1617, :1685, radius.ts:5, typography.ts:2–3, accordion.css:26; DESIGN_SYSTEM:548 and :581, and its Strokes and Elevation tables (border-float frames nothing; dividers read edge-dividers); ARCHITECTURE counts (99 / 138 / 119 / 7, actually 108 / 150 / 126 / 10); COMPONENTS lists Preview frame; the weight exceptions are unwritten (T5); the shape-state census files Toggletip with Popover (it is Tooltip's bubble).
- **Change.** Correct every line; regenerate the Strokes table from stroke-groups.ts; check:docs asserts counts; a lint flags “at the default” with a number; area-foundation-change gains “a ramp or default change sweeps comments that quote px”.
- **Families.** inset, stack, description-list, setting-row, timeline, calendar, asset-row, panel, select, menu, dialog, toast, tooltip, accordion.
- **Findings.** G19, T25, S17, RC22, B-B3, T5, VN24.
- **Depends on** nothing; **unblocks** every later tuning pass.
- **Risk.** None visible.
- **Verified by.** check:docs; the lint.
- **Docs and skills.** DESIGN_SYSTEM Strokes, Elevation; ARCHITECTURE; COMPONENTS; area-foundation-change.

#### F7 · Rules and measurements published as data

*capability · size M · evidence reference, confidence high · seen by reference + source · build*

- **Rule.** Each family page prints its live Specs (height, sides with and without icon, gap, corner, icon, type role, tokens per state) at the current settings and the defaults; each public token carries usage and rules; a generated table says which inks meet at 4.5 and 3 on which grounds.
- **Today.** Usage entries have six fields; 70 of 126 list no states, 33 no keys; no page gives measurements; token rules live in prose and comments; no pairing rule an author can apply.
- **Change.** A Specs tab generated from emit/base.ts; usage/rules in emit/json.ts read by area check and area mcp; the pairing table generated by the contrast suite; fuller usage entries; a writing skill from WRITING.md.
- **Families.** all.
- **Findings.** RD5, RD8, RD9, BL-D1, BL-S2.
- **Depends on** F5; **unblocks** nothing named.
- **Risk.** The Specs tab must evaluate the same calc() the CSS does.
- **Verified by.** Specs values equal F1's measured values at the defaults.
- **Docs and skills.** area-component-docs; a new writing skill.

#### F8 · One vocabulary for parts, states and props

*fix · size M · evidence source, confidence high · seen by source · build*

- **Rule.** One name per job: header/footer, title, label, description (meta only for tabular facts), actions (action for a single built-in), trailing, media, icon; status = outcome only (presence, change, statusText for the rest); side takes logical words; open for show/hide, collapsed only where open is the default; name is the form name only; US spelling in attributes.
- **Today.** head 7 beside header 13; foot and footer inside Approval; action 7 beside actions 21; trailing, end, header-action; description / lede / meta; media / preview / picture; status holds four ideas; side mixes right/left with end/start; open / expanded / collapsed; name is display text in 6 families and form name in 5; data-area-colours British; AppShell.tsx exports no app shell.
- **Change.** Migrate on reopen with aliases; a manifest lint rejecting new names outside the list; rename AppShell.tsx to Titlebar.tsx and SectionHeading.tsx with their own specs.
- **Families.** approval, asset-card, attachment, edit-summary, field, plan, queue, card, chip, toast, indicator, tree-view, tabs, pagination, popover, tooltip, drawer, composer, toggletip, code-block, panel, table, titlebar, section-heading.
- **Findings.** B-S1, BL-D3, B-S7, B-S10, B-S12, B-S17, BL-British, B-S18.
- **Depends on** F5; **unblocks** B1.1, E1.1.
- **Risk.** Saved themes need the data-area-colours migration.
- **Verified by.** Manifest lint; tsc.
- **Docs and skills.** GOVERNANCE §4, §6.

#### F9 · Source structure matches families

*fix · size M · evidence source, confidence high · seen by source · build*

- **Rule.** One CSS file per block family, named by its slug; one React file per family.
- **Today.** navigation.css holds Select, Table and Tabs; display.css seven families; surface.css 10 blocks in 2,007 lines; primitives.tsx ~60 exports in 2,899 lines; Asset card carries 7 axes (4,320 combinations) while retiring into Design card; Hatnote, Abbreviation and Timestamp are text styles under 25 lines.
- **Change.** Split files with no API or visual change; retire Asset card's axes into Design card as B1.1 lands; fold the three text styles into a Text component only if E11's N10 is built.
- **Families.** select, table, tabs, avatar, badge, progress, separator, skeleton, spinner, card, dialog, menu, panel, popover, toast, tooltip, asset-card.
- **Findings.** B-S14, B-S15.
- **Depends on** nothing; **unblocks** C7.2.
- **Risk.** Conflicts with every open branch: one PR when nothing else is open.
- **Verified by.** area.css byte-identical before and after.
- **Docs and skills.** ARCHITECTURE.

#### F10 · Release readiness and library defaults

*fix · size M · evidence source, confidence high · seen by source · later*

- **Rule.** Packages that leave the repo have a version, LICENSE, CHANGELOG and a CI check; every family reads SystemDefaults.
- **Today.** react, styles, tokens, output at 0.0.0 without LICENSE or CHANGELOG; area check not in CI; Calendar and Split button do not read useSystemDefault; no DTCG export; the design-file items in HANDOFF are app work, outside the system.
- **Change.** Versions, LICENSE, CHANGELOG; area check in CI; Calendar and Split button adopt SystemDefaults; a DTCG writer in packages/output.
- **Families.** calendar, split-button.
- **Findings.** BL-T3, BL-T2, BL-hoci, BL-hodefaults, BL-hodesign.
- **Depends on** F5; **unblocks** nothing named.
- **Risk.** Licence choice is the owner's.
- **Verified by.** CI.
- **Docs and skills.** ARCHITECTURE § Output.

### A. Foundations recalibrated (Phase 1)

#### A1.1 · Gaps read whole steps; only insets keep the half step

*fix · size M · evidence mixed, confidence high · seen by source · build*

- **Rule.** A gap reads ui-gap-step (whole steps); only an inset (edge → content) keeps the half step ui-dense, as THEMING.md:146 already says for L3.
- **Today.** ui-dense is 0.5 at type 13 Default and gap-row = 12 − 4·ui-dense (verified base.ts:488), so gap-row 10, Card md section gap 14 and lg 18, carousel and media-well gap 7, Tabs md 18 and sm 14, Stack section 20, palette footer 14, Choice rows 14, Description list row gap 2. Card's media corner 11 (the one odd corner) and Tooltip's inline 9 come from the same half step.
- **Change.** Every N − 4·dense used as a gap becomes N − 4·ui-gap-step, so at Default each lands on its type-14 rung: Card md section 14 → 16 and lg 18 → 20, Tabs md 18 → 20 and sm 14 → 16, Stack section 20 → 24, palette footer 14 → 16, Choice rows 14 → 16, Description list row gap 2 → 4, Card carousel and well 7 → 8 (8 − 2·ui-gap-step). Compact (the app) does not move. gap-row moves too, but its use as the row icon→label gap is set by B2.3 first.
- **Families.** card, tabs, stack, command-palette, radio, checkbox, description-list.
- **Findings.** G1, S25.
- **Depends on** B2.3; **unblocks** A1.4, B8.2.
- **Risk.** Default gets 2 px roomier in a dozen gaps, the opposite direction to the references for rows (RC4, RL nav median 8): that is why row gaps wait for B2.3. Owner looks at Card and Tabs at Default.
- **Verified by.** Cohesion test: no gap reads ui-dense; F1 measures Card and Tabs.
- **Docs and skills.** THEMING density rows; DESIGN_SYSTEM:548; area-foundation-change.

#### A1.2 · Three sibling-gap roles

*fix · quick win · size S · evidence source, confidence high · seen by source · build*

- **Rule.** Between siblings: a joined set (segments, row actions) 2; actions in a header or a line of text 4; independent controls ui-cluster (6 / 8 / 10).
- **Today.** Four values and no stated roles; Page header actions, Drawer stacked footer and the Toaster list are a fixed 8.
- **Change.** Those three read ui-cluster (−2 / 0 / +2 at 28 / 32 / 36); the roles written in DESIGN_SYSTEM Size and shape.
- **Families.** page-header, drawer, toast.
- **Findings.** G13.
- **Depends on** nothing; **unblocks** nothing named.
- **Risk.** None at Default.
- **Verified by.** Cohesion test.
- **Docs and skills.** DESIGN_SYSTEM Size and shape; area-ui-compose.

#### A1.3 · Children spaced by the container's gap, never by margin compensation

*fix · size M · evidence source, confidence medium · seen by source · build*

- **Rule.** A container's children are spaced by its gap; a pair that joins is its own group with its own gap (Dialog's heading grid), never margin: calc(x − parent gap).
- **Today.** Card title join calc(4px − gap) (surface.css:277), carousel calc(text-inset − gap) (:597), Menu shortcut column margin (:1546), Nav group margin 12, Shortcut list 32, Description list “more”, Combobox description + check 8, Select options margin.
- **Change.** Each becomes a group with its own gap; no visible change at any setting.
- **Families.** card, menu, nav, shortcut-list, description-list, combobox, select.
- **Findings.** G18.
- **Depends on** F1; **unblocks** nothing named.
- **Risk.** Regression if a group gap is mis-set; F1 catches it.
- **Verified by.** F1 identical before and after.
- **Docs and skills.** DESIGN_SYSTEM spacing.

#### A1.4 · Name the section and page spaces

*fix · size S · evidence reference, confidence medium · seen by reference · build*

- **Rule.** Section and page spacing are roles (gap-section, inset-page) derived like gap-row: a name for what Stack, the feed kit and page headers already compute, no new value.
- **Today.** stack.css:22 says “Area has no section token” and doubles gap-row; the feed kit's 32 / 48 are kit literals. Primer stack.gap, Polaris space-card-gap name theirs.
- **Change.** Emit gap-section (24, Compact 16) and inset-page; Stack, feed kit and Page header read them.
- **Families.** stack, page-header, section-heading.
- **Findings.** RD14.
- **Depends on** A1.1; **unblocks** E1.5.
- **Risk.** A token name; GOVERNANCE check (a role for an existing value).
- **Verified by.** Token test.
- **Docs and skills.** THEMING; area-ui-compose.

#### A1.5 · Two text-list rhythms

*fix · size S · evidence rendered, confidence medium · seen by rendered · build*

- **Rule.** A text list (links, references, footnotes) is line + 4; a key-value list line + 8; rows that are controls use the row ladder.
- **Today.** Reference list 18 pitch (gap 0), Link groups 22, Description list 26, Accordion plain items 2 apart.
- **Change.** Reference list 18 → 22; Accordion items +6; Link groups and Description list unchanged.
- **Families.** reference-list, link-groups, description-list, accordion.
- **Findings.** VC25.
- **Depends on** nothing; **unblocks** nothing named.
- **Risk.** Reference list looser; owner looks.
- **Verified by.** F1 pitch check.
- **Docs and skills.** area-type-usage text pairs.

#### A2.1 · The Corner number is the real medium control's corner; rows take their height's corner

*fix · size M · evidence mixed, confidence high · seen by source + reference · build*

- **Rule.** radius-step is radius-control-md at the current type and density; every full-width row, floating or not, takes corner(row height); the list surface follows concentrically.
- **Today.** radius-step = corner(32px) (verified base.ts:537; its comment “the medium Button's corner at the default height” holds only at type 14), so at type 13 Button md draws 8 while the step is 10; radius-list-row 10 and radius-list 14, so Menu, Context menu, Command palette and List box rows are 10 while Nav and Tree rows of the same 30 height, Buttons and field lists are 8. Rendered: Corner 10 draws md 8, lg 10, sm 8 (VA); Menu rows 10 beside Nav 8 (VN9); products' menu rows 4–6 (RL3).
- **Change.** radius-step = radius-control-md; floating-list rows 10 → 8, lists 14 → 12 at Corner 10 (field lists already 8 / 12); Kbd and Stepper follow; the axis description says “the corner of a medium control”.
- **Families.** menu, context-menu, command-palette, list-box, model-picker, zoom-control, split-button, time-field, toolbar, kbd, stepper.
- **Findings.** S1, RL3.
- **Depends on** nothing; **unblocks** B2.1, B6.3, A2.3.
- **Risk.** Menus 2 px less round. This is RL3's option (a), keeping the owner's Corner 10; option (b), Corner 8, is in A2.3.
- **Verified by.** F1 corner table: rows of one height share one corner.
- **Docs and skills.** DESIGN_SYSTEM:604; radius.ts header; THEMING.

#### A2.2 · Components read only public radius roles

*fix · quick win · size S · evidence source, confidence high · seen by source · build*

- **Rule.** Components read radius-control-*, -container, -row, -list(-row), -small, -full, -floor, -min and the shared corner expression; never radius-surface, a px literal or a private rounding step. Blocks (Table, Code block, Description list framed, Queue, Plan, Edit summary, Settings group) share one block corner.
- **Today.** File upload reads the raw leaf radius-surface; Accordion trigger, Step row and Description list “more” put 30 rows on radius-small 6; Kbd rounds to 1 px; Stepper corner(24px); Time field segment radius-min in an 8 field; Table frame 14 by its own formula beside Description list framed and Queue 16 and Plan's steps 14; redundant min(x, x) in attachment and alignment-picker.
- **Change.** A lint in cohesion.test.mjs; full-width rows to radius-row (6 → 8); Table frame and Plan steps to the block corner (14 → 16); File upload to radius-container; Kbd rounds down to 2, or its doc sentence (DESIGN_SYSTEM:644) is corrected.
- **Families.** file-upload, accordion, step, description-list, kbd, stepper, time-field, table, queue, plan, edit-summary, attachment, alignment-picker.
- **Findings.** S15.
- **Depends on** A2.1; **unblocks** B1.1.
- **Risk.** 2 px corner moves on a few rows and frames.
- **Verified by.** Lint; F1 corner table.
- **Docs and skills.** DESIGN_SYSTEM shape roles.

#### A2.3 · Corner default and the surface “+N” rule against the references

*decision · size M · evidence mixed, confidence high · seen by reference · decide*

- **Rule.** Owner decision: how far surfaces step above controls, and whether the default stays Corner 10.
- **Today.** At Corner 10 controls are .26–.31 of their height (live products .125–.25, median .19). Popover and Panel 16, Card 18 over an 18 inset (radius / padding 1.0; products .375–.58), Dialog 20 (container + 4, owner 2026-10-03), Asset card 20, Design card 24, titled Toast 16, Tooltip 10. Claude 10 / 10 / 6, Cursor 12 / 12 / 8, Figma 13 / 5, ChatGPT 16–20 under a 1.25 squircle factor; live products' cards 6–14, never rounder than their menus. Spectrum grows corners 1 px per size; Area in proportion (lg 38 → 16, xl 46 → 20 at Corner 14).
- **Change.** See options. In any option the two values most out of range are Card md's 18 and Dialog's extra +4.
- **Families.** card, dialog, confirm-dialog, drawer, popover, menu, toast, tooltip, asset-card, design-card, command-palette, button, input.
- **Findings.** RC1, RL2, RD21.
- **Depends on** A2.1; **unblocks** B1.1, B6.3, B4.2.
- **Risk.** undefined
- **Verified by.** Review page at true scale, light and dark: Menu over Card over page.
- **Docs and skills.** radius.ts; DESIGN_SYSTEM corners; card.md; dialog.md.

- **Options** (§7): Keep Corner 10; resting cards capped at the floating corner (recommended); Keep Corner 10; every surface = control + 4 (RC1); Default Corner 8 (RL3 b); Keep everything.

#### A3.1 · Dark muted ink steps back to the light hierarchy

*fix · size S · evidence rendered, confidence medium · seen by reference · build*

- **Rule.** Default-to-muted luminance contrast is 2.0–3.2 in both themes; muted stays ≥ 4.5:1 on the darkest fill it sits on.
- **Today.** Dark muted is floored at oklab L 0.823 (≈ #c5c5c5): 10.9:1 on #121212, 12.2:1 on black, only 1.49:1 from the default #eee. Light is in range (muted #666, 5.74:1, gap 2.57 against a median 2.6). Rendered dark products: secondary 6.1–9.0:1, gap 2.2–3.1 (Linear, shadcn, Geist); Figma and ChatGPT dark secondary white 70%.
- **Change.** Dark muted floor ≈ L 0.70–0.72 (#a0a0a0–#a6a6a6: 7.6–8.3:1 on black, ~4.7:1 on fill-2); a cohesion test on the default:muted gap; the 4.5:1 tests unchanged.
- **Families.** every muted text and icon in dark.
- **Findings.** RL1.
- **Depends on** nothing; **unblocks** A3.2.
- **Risk.** Every dark screen changes; muted on raised fills must still pass 4.5 (the test gates it). Owner's eye on near-black.
- **Verified by.** Contrast suite + gap test; dark review page.
- **Docs and skills.** CONTRAST.md; color/curves.ts.

#### A3.2 · A third text ink, and secondary / tertiary stop meaning the accent

*decision · size M · evidence mixed, confidence medium · seen by reference · decide*

- **Rule.** Owner decision: whether meta that must sit quieter than a description (shortcut, timestamp, empty value, placeholder, line numbers) gets its own rung.
- **Today.** Two text inks: fg-default (138 rules) and fg-muted (210), plus fg-disabled (23) and fg-quiet (3, icon actions). fg-placeholder = muted; fg-secondary and fg-tertiary alias the accent, a name collision with what every reference means; fg-disabled is a fixed #a4a4a4 outside the layer model. Claude 3 inks + disabled, Cursor 4, Figma and ChatGPT 3; Primer, Spectrum, Polaris, Radix, Geist 2 + disabled; Atlassian, Apple, Ant 3. Area's muted at 5.74:1 leaves a narrow room above 4.5.
- **Change.** See options. In every option, rename the accent aliases and derive disabled from the layer model.
- **Families.** input, textarea, select, combobox, menu, nav, message, description-list, table, empty-state, kbd, timestamp, breadcrumb, setting-row.
- **Findings.** RC8, RF1, RD20, RC17.
- **Depends on** A3.1; **unblocks** E6.
- **Risk.** undefined
- **Verified by.** Contrast suite; type census.
- **Docs and skills.** DESIGN_SYSTEM Colour; CONTRAST.md; area-type-usage.

- **Options** (§7): Add fg-subtle at 4.5:1 (recommended); Add a 3:1 meta ink (RC8); Keep two inks.

#### A3.3 · Placeholders and unselected options read one role each

*fix · quick win · size S · evidence mixed, confidence medium · seen by source + rendered · build*

- **Rule.** Placeholders read input-placeholder; an unselected option in any selection control and a bar's inactive items read fg-muted; a ghost Button keeps its quieter ink only as a Button.
- **Today.** Approval and Editable text paint placeholders fg-muted (the same rung today, they would split on a theme change). Toggle group outline and ghost off icons, ghost and outline neutral Buttons, and Pagination's Previous/Next render 0.452 while Segmented, soft Toggle group, Tabs plate and Pagination pages render 0.510.
- **Change.** Two placeholder rules move to the role; Toggle group outline/ghost off ink 0.452 → 0.510; Pagination's pages and Previous/Next share one ink.
- **Families.** approval, editable-text, toggle-group, pagination.
- **Findings.** T19, VA9, VN12.
- **Depends on** nothing; **unblocks** nothing named.
- **Risk.** 0.452 may be a deliberate ghost-button step: it stays on Button.
- **Verified by.** Role test; F1 ink table.
- **Docs and skills.** CONTRAST.md roles.

#### A3.4 · Tone colours the mark, never the words

*fix · quick win · size S · evidence mixed, confidence high · seen by source + rendered · build*

- **Rule.** Tone glyphs read fg-<tone>-mark; tone words are only Badge text, status marks and diff counts; a title or a tab label keeps its own ink.
- **Today.** Turn notice, Message status, Attachment and File upload status icons use the text ink (a deeper red than Toast's mark); Alert's title and link are tone ink while Toast's are default (rendered info title oklab 0.506 vs 0.277); Tabs change words paint an unselected label as loud as the selected one.
- **Change.** Four icons a step brighter in light; tone Alert title and link default; Tabs status on a mark, the label keeps selection ink.
- **Families.** turn-notice, message, attachment, file-upload, alert, tabs.
- **Findings.** T10, T12, VN19.
- **Depends on** nothing; **unblocks** B6.7.
- **Risk.** Tone Alerts read calmer, matching the skill's own rule.
- **Verified by.** Role test.
- **Docs and skills.** DESIGN_SYSTEM:146, :155; area-type-usage.

#### A4 · Dark state washes

*decision · size S · evidence reference, confidence medium · seen by reference · decide*

- **Rule.** Owner decision: the dark hover and selected wash, re-derived so its contrast against the ground matches the light wash's.
- **Today.** DARK_WASH hover 0.07 × Hover step 2 = 14% white, selected 19%, pressed 20.7% (verified base.ts:148, :257). Claude 7.5 / 15, Cursor 8 / 14, Figma 5 / 10, ChatGPT 8 (SDK ghost 12); light agrees everywhere at 5%. On #020202 a 14% plate lands near #262626. Code block's dark highlight is 19% white against 7% black in light.
- **Change.** Recommended: DARK_WASH.hover 0.04 per step (8% at the default 2), selected +6 (14%); press room and the 22% cap kept; muted-on-plate tests rerun, not weakened.
- **Families.** button, menu, nav, tree-view, table, segmented, toolbar, list-box, color-swatch-picker, code-block.
- **Findings.** RC5, RF2.
- **Depends on** nothing; **unblocks** D3.
- **Risk.** undefined
- **Verified by.** Contrast suite; dark review page with Menu, Nav and Table rows.
- **Docs and skills.** DESIGN_SYSTEM state paint; THEMING.

- **Options** (§7): 8% / 14% (recommended); 5% / 10%; Keep 14% / 19%.

#### A5.1 · Overlay motion: durations and an exit curve

*decision · size S · evidence reference, confidence high · seen by reference + source · decide*

- **Rule.** Owner decision on the default; whatever the clock, exits accelerate (an ease-exit role) and never ease out into invisibility.
- **Today.** Menus and popovers enter on duration-base 210 and leave on fast 140, both ease-out (verified surface.css:1806); tooltips 140; dialogs 280 / 210; toasts 350. Claude: menus not animated, tooltips 120, popovers and dialogs 200; Cursor: every floating surface 100 out-quint, dialogs 200; ChatGPT: menu 150 in / 100 out on (.8, 0, .4, 1); Figma's shell animates none; library consensus 150–200 for menus. System gaps M1 (180) still open.
- **Change.** ease-exit on every anchored-surface and dialog exit. Default: see options.
- **Families.** menu, context-menu, popover, select, combobox, custom-select, tooltip, hover-card, dialog, drawer, toast.
- **Findings.** RC3, RF4, BL-M1.
- **Depends on** nothing; **unblocks** A5.2.
- **Risk.** undefined
- **Verified by.** Motion test (exits never slower); a review recording.
- **Docs and skills.** MOTION.md roles and recipes.

- **Options** (§7): Anchored overlays enter on fast, exit fast on ease-exit; dialogs on base (recommended); Motion default 210 → 150; Keep 210; add only the exit curve.

#### A5.2 · Keyboard-opened and high-frequency surfaces appear at once

*fix · size S · evidence reference, confidence high · seen by reference · build*

- **Rule.** Animation length falls with frequency and with keyboard origin: a surface opened by keyboard or shortcut, a context menu and the command palette skip the scale and use fade-fast.
- **Today.** Keyboard opens pay the 210 scale; the palette shares Dialog's moderate 280 in / 210 out; MOTION.md:133 asks for “the same short clock” with no mechanism.
- **Change.** useNativePopover records data-opened-by=keyboard (entry.current already knows); the overlay rule maps it to duration-instant for scale; the palette takes the anchored clocks, instant by shortcut.
- **Families.** menu, custom-select, combobox, popover, command-palette, context-menu.
- **Findings.** RB3.
- **Depends on** A5.1; **unblocks** nothing named.
- **Risk.** None for pointer opens.
- **Verified by.** F2: a keyboard open has no scale transition.
- **Docs and skills.** MOTION.md:117, :133.

#### A5.3 · A highlight moving through a list lands and leaves at once

*fix · quick win · size S · evidence mixed, confidence high · seen by reference · build*

- **Rule.** List row plates have no background transition in or out; only standalone controls ease their hover.
- **Today.** Menu rows fade in on hover-in (~91) and out on fast (140) (surface.css:1299, :1327) against the file's own comment “the plate lands at once” (:1320): a ghost plate trails one or two rows behind the pointer.
- **Change.** transition-duration 0s for row backgrounds in Menu, List box, Custom select, Combobox, Command palette, Nav, Tree view.
- **Families.** menu, context-menu, list-box, custom-select, combobox, command-palette, nav, tree-view.
- **Findings.** RB4, RF5.
- **Depends on** nothing; **unblocks** nothing named.
- **Risk.** RF5 proposed the opposite (ChatGPT's .98 → 1 plate grow); judged against it: macOS, Radix Themes and Area's own written rule say instant.
- **Verified by.** Motion test.
- **Docs and skills.** MOTION.md list rows.

#### A5.4 · Effects never overshoot; Spring becomes a real spring

*fix · quick win · size S · evidence mixed, confidence high · seen by reference + source · build*

- **Rule.** Colour, opacity and shadow read a non-overshooting curve (ease-effects); only movement reads Spring's ease-out; Spring is a linear() spring, not a cubic with y > 1.
- **Today.** --area-transition runs background-color, border-color, color, box-shadow and scale on ease-out (verified base.ts:426); under Spring that curve is (0.175, 0.885, 0.32, 1.1), so a hover colour passes its target and returns.
- **Change.** --area-ease-effects (Subtle's out under Spring) for colour and shadow and every fade; Spring's ease-out and ease-drawer as linear() stops from M3's spatial spring (damping 0.9, stiffness 700).
- **Families.** every transition.
- **Findings.** RD4, RB17, BL-M4.
- **Depends on** nothing; **unblocks** A5.5, A5.6.
- **Risk.** Nothing changes at the default Subtle.
- **Verified by.** Token test: effects curves have y ≤ 1.
- **Docs and skills.** MOTION.md; easing.ts.

#### A5.5 · Hover colour on a shorter clock

*fix · size S · evidence reference, confidence medium · seen by reference · build*

- **Rule.** State-change colour reads one third of the Speed number (70 at 210); surfaces keep base.
- **Today.** duration-fast (2/3, 140) for hover off; Primer's Button 80, Carbon fast-01 70, Cursor rows 100, Claude 60.
- **Change.** A one-third duration role read by --area-transition for colour.
- **Families.** every hover.
- **Findings.** RD15.
- **Depends on** A5.4; **unblocks** nothing named.
- **Risk.** Crisper hover-off; feel it in the app.
- **Verified by.** Motion test.
- **Docs and skills.** MOTION.md.

#### A5.6 · Press gives on the plate, not the label

*decision · size M · evidence reference, confidence medium · seen by reference · decide*

- **Rule.** Owner decision: whether the press scales a plate pseudo-element (the label never resamples) and releases on a spring.
- **Today.** scale var(--_give), 0.97 md / 0.96 sm, on the whole button in 91 ms (button.css:158). Claude scales only its paint layer .975, 60 in, 450 spring out; Cursor the whole control .98; ChatGPT by width .96–.995 (Area's class-based give matches within .005 except a wide non-full-width button); Figma also drops a pressed solid's label ink one step.
- **Change.** Recommended: plate press via the existing --_wash layer, give .98, release on A5.4's spring; label ink stays fixed.
- **Families.** button, split-button, button-group, toggle-group, chip.
- **Findings.** RC10, RF15, RF20.
- **Depends on** A5.4; **unblocks** nothing named.
- **Risk.** undefined
- **Verified by.** Recording at 2×.
- **Docs and skills.** MOTION.md press; feedback.ts.

- **Options** (§7): Plate press, label still (recommended); Keep the whole-control press; Also dim a pressed solid's label.

#### A5.7 · Progress fill animates scale, not inline-size

*fix · quick win · size S · evidence source, confidence medium · seen by source · build*

- **Rule.** Only transform and opacity animate, besides the documented size moves; Progress is not one of them.
- **Today.** display.css:354 transitions translate and inline-size on slow, laying out every frame.
- **Change.** scale from the start edge on a full-width fill.
- **Families.** progress, meter.
- **Findings.** I26.
- **Depends on** nothing; **unblocks** nothing named.
- **Risk.** A fractional scale between updates; acceptable for a bar.
- **Verified by.** Motion test's layout-transition list.
- **Docs and skills.** MOTION.md Crispness.

#### A6.1 · A focus ring never sits flush on a fill of its own colour

*fix · quick win · size S · evidence mixed, confidence high · seen by reference · build*

- **Rule.** Where a fill equals focus-color (neutral solid at Selection Neutral, accent solid at Selection Accent) the ring takes focus-gap or a 1 px on-colour inner line, at every Focus ring preset.
- **Today.** Hug = 2 px at offset 0 (states.ts:28) in neutral-solid, the same colour as action-solid at the defaults: a focused solid Button looks 2 px larger, not ringed. Primer adds an inner on-emphasis line, Fluent two strokes, Claude a 1 px page-colour gap and a glow, Cursor offset 2.
- **Change.** Solid fills under Hug get outline-offset focus-gap (2) or an inset page-colour line; other controls unchanged.
- **Families.** button, split-button, composer, badge, switch, checkbox, segmented.
- **Findings.** RC6, RD2.
- **Depends on** nothing; **unblocks** A6.3.
- **Risk.** Not yet seen rendered; the owner looks at a focused solid Button light and dark.
- **Verified by.** F1 forced-focus tile.
- **Docs and skills.** DESIGN_SYSTEM focus; CONTRAST.md.

#### A6.2 · The focus placement table becomes a test

*fix · quick win · size S · evidence source, confidence high · seen by source + reference · build*

- **Rule.** Controls at +offset, containers and text at +gap, rows, tabs and cells inside; one indicator per row (ring or plate, not both); within a setting a ghost or plain control may draw its ring inset by its own edge.
- **Today.** Accordion trigger, Step row and Token row draw row rings outside; Approval options and Prompt suggestions draw plate and ring; Tag picker's ring has no offset; Time field segments have no ring; Editable text draws a literal 1 px outline; Composer's halo is painted in --area-shadow-color.
- **Change.** Each corrected; a cohesion test over every :focus-visible rule; RF7's ghost inset as a row in the table.
- **Families.** accordion, step, token-row, approval, prompt-suggestions, tag-picker, time-field, editable-text, composer, button.
- **Findings.** S12, RF7.
- **Depends on** nothing; **unblocks** nothing named.
- **Risk.** None at rest.
- **Verified by.** Cohesion test; F1 forced-focus tiles.
- **Docs and skills.** DESIGN_SYSTEM focus table.

#### A6.3 · Focus answers Contrast More

*fix · quick win · size S · evidence reference, confidence medium · seen by reference · build*

- **Rule.** Under Contrast More the ring takes focus-gap and the Bold preset's 3 px.
- **Today.** Contrast raises strokes and field outlines; the ring keeps its style (Carbon turns dotted).
- **Change.** One rule in the contrast scope.
- **Families.** every focusable.
- **Findings.** RD12.
- **Depends on** A6.1; **unblocks** nothing named.
- **Risk.** None at Standard.
- **Verified by.** Contrast More tile.
- **Docs and skills.** CONTRAST.md.

#### A6.4 · Forced colours cover every fill-only state

*fix · quick win · size S · evidence source, confidence medium · seen by source · build*

- **Rule.** Every selector whose selected, current, checked or pressed cue is only a background or box-shadow has a forced-colours rule; field triggers restore Highlight focus.
- **Today.** Custom select, Date picker, Tag picker triggers and OTP slots lack Highlight focus; soft Toggle group selected, Approval selected, List box grid selected, Custom select grid preview and Design card's selected ring have no forced rule.
- **Change.** Add the rules; a cohesion test over those selectors.
- **Families.** toggle-group, approval, list-box, custom-select, design-card, date-picker, tag-picker, otp-field.
- **Findings.** S18.
- **Depends on** nothing; **unblocks** nothing named.
- **Risk.** Untested in Windows forced colours.
- **Verified by.** Forced-colours emulation run (area-a11y-audit).
- **Docs and skills.** area-a11y-audit.

#### A7.1 · One edge per floating surface in dark

*fix · size S · evidence mixed, confidence high · seen by rendered + reference · build*

- **Rule.** A surface draws one edge per side in each theme; in dark the rim is the floating edge: the border takes max(edge-floating, rim) and the outer rim layer is dropped where a border exists.
- **Today.** Every dark floating surface draws a 1 px 12.5% white border and the depth rim 0 0 0 1px white 16% outside it (verified depth.ts:165, RIM_MAX 0.16): pixels across the Menu edge 1, 1, 42, 42, 31, 31, 2, a two-tone 2 px edge; Confirm dialog and Popover read as wireframes. Claude moves its one ring inside in dark; Cursor draws one hairline over the surface; Figma a 0.5 px inset plus a top-lit 0.5 px line.
- **Change.** The dark floating edge becomes one 1 px ~16% line. Optionally Figma's top-lit inset and a layout-neutral device-pixel ring (RF8), which also needs B6.4 to stop counting the border.
- **Families.** menu, context-menu, popover, hover-card, calendar, color-picker, dialog, confirm-dialog, drawer, command-palette, toast, select.
- **Findings.** VN1, RC13, RF8.
- **Depends on** nothing; **unblocks** A7.2, B6.4.
- **Risk.** Which line survives is a design call; the recommendation keeps the brighter rim value as the single border.
- **Verified by.** F1 dark-edge check.
- **Docs and skills.** DESIGN_SYSTEM Elevation; depth.ts.

#### A7.2 · Dark elevation and region depth

*decision · size M · evidence mixed, confidence high · seen by reference + source · decide*

- **Rule.** Owner decision: whether dark lifts each elevation role one layer step (page < cards < floating < modal), and whether the chrome ground gets a dark floor.
- **Today.** Menus, dialogs and toasts paint bg-surface, a Card's tone at Card tone Auto (rendered: the menu fill samples rgb 2 on a page of rgb 1), separated only by the edge and a doubled shadow. Atlassian dark #1F / #24 / #2B, Spectrum's elevated gray-75, Material's containers and Apple's elevated backgrounds all lighten. Layers 0 (owner, 2026-10-26) on near-black leaves no room for a lighter sidebar. Light: Area's menu shadow 0 0 2 4% + 0 8 16 8% is lighter and shorter than Claude's 0 8 24 12% + 0 2 6 8% and Cursor's three 12% layers (Floating 8, owner 2026-11-05). Light region depth is changed by F0 (light Layer contrast 50); the dark half of the question stands.
- **Change.** See options; the page stays near black in every option.
- **Families.** menu, popover, dialog, toast, drawer, command-palette, card, panel.
- **Findings.** RD3, B-P4, BL-regiondepth, RC14.
- **Depends on** A7.1, F0; **unblocks** A10.1.
- **Risk.** undefined
- **Verified by.** Dark review page: Menu over Card over page.
- **Docs and skills.** DESIGN_SYSTEM Elevation; layers.ts; THEMING Layers.

- **Options** (§7): Dark lifts floating and modal one layer step (recommended); Also a dark floor for the chrome ground; Keep one sheet; separate by rules; Revisit the light floating shadow.

#### A8.1 · Control height ladder at type 13

*decision · size L · evidence mixed, confidence high · seen by reference + source · decide*

- **Rule.** Owner decision: the default heights. Whatever is chosen, heights stay derived (line + 2 × room) so cap centring stays exact, and parts written against a 4 px ladder read ladder tokens instead.
- **Today.** Type 13 Default 22 / 26 / 30 / 38 / 46, rows 30; the app at Compact 20 / 24 / 26 / 34 / 42, rows 28. Desktop references at 13 px: Claude 24, Cursor 24, Figma 24 (11 px text); ChatGPT desktop md 32 with ~29 menu rows. Web systems 24 / 32 / 40 / 48; live products 32 at 14 px text, a 2.29 ratio to text that Area's 30 at 13 matches (2.31). Literals written on the 4 px ladder sit off it: mark-sm/md/lg 16 / 20 / 24 (base.ts:491), the “24 Kbd box” and “32 Dialog close” (DESIGN_SYSTEM:643, :308). A 22 row floor for IDEs is out of reach (density.ts:12).
- **Change.** See options. In every option the mark-* literals and the two doc sentences read the ladder.
- **Families.** every control and row.
- **Findings.** RC2, RD1, BL-density22.
- **Depends on** F1; **unblocks** A8.2, B2.3, B4.1.
- **Risk.** undefined
- **Verified by.** F1 height table at every type × density.
- **Docs and skills.** density.ts header; DESIGN_SYSTEM:489, :308, :643.

- **Options** (§7): Keep the derived ladder and the Default density (recommended); Default density 28 for type ≤ 13 (RC2); Snap heights to the 4 px ladder (RD1); Allow a 22 row floor for dense tools.

#### A8.2 · Rows and composites on the ladder

*fix · size S · evidence mixed, confidence medium · seen by source · build*

- **Rule.** A height is a ladder token or a ladder token plus whole room steps (+ 2 × ui-stack), never + 2 px / + 4 px literals. Calendar day = control-md, cell = control-md + 4.
- **Today.** Calendar days 36 / 32 − 4·dense (28 / 30 / 34; at type 12 Compact 28 beside a 24 control); Description list row + 2; Shortcut list row + 4; Plan head row + 8; Prompt suggestion 42 / 44 / 48; Board add row 34; Asset row 56; Token row 21: eight row heights between 21 and 56.
- **Change.** Calendar days −2 at Compact (−4 at type 12 Compact, +2 at 16); Description list rows → row (−2); Shortcut list → row + ui-stack (0 / +2 / +4); Board add → ui-row (−6 / −4 / 0); Token row → a mark or control-sm height.
- **Families.** calendar, description-list, shortcut-list, plan, prompt-suggestions, board, asset-row, token-row.
- **Findings.** G11.
- **Depends on** A8.1; **unblocks** nothing named.
- **Risk.** Each literal came from one measured product; the owner confirms per family.
- **Verified by.** F1 height table.
- **Docs and skills.** each spec's current state.

#### A9.1 · Heading hierarchy: components adopt weight-heading and title-xl

*fix · size M · evidence mixed, confidence high · seen by source + rendered + reference (independent agreement) · build*

- **Rule.** Three levels per screen (page, section, item) told apart by size and weight; titles from title-sm up take 600 (weight-heading); title-xs and surface titles keep 500.
- **Today.** On this branch nothing above 20/28 for words and nothing above 500 (verified). The other worktree's merge (F0) brings --area-weight-heading 600 and title-xl (32/40 at 13) as tokens no component reads. Page header sm 16/22/500 equals Section heading; md 18/24/500; lg 20/28/500. Every rendered product titles pages at 590–700 (GitHub 20/30 600, shadcn and Geist 24/32 600, Linear 40/44 590, Notion 32/38.4 700).
- **Change.** After F0: Page header md 24/32 at weight-heading (lg title-xl), Section heading 16/500, so page > section > card title = 24 / 16 / 13; titles from title-sm up read weight-heading; Message gains h2/h3 at title-xs.
- **Families.** page-header, section-heading, dialog, message, empty-state, link-groups.
- **Findings.** T16, B-P3, VC13, RL4, BL-w600.
- **Depends on** F0; **unblocks** A9.3, A9.6, E1.2, E1.5.
- **Risk.** The 2026-11-06 title-balance pass set sizes and gaps, not this weight: the owner confirms which titles take 600.
- **Verified by.** Type census; page-header review page.
- **Docs and skills.** typography.ts; type-size.ts; area-type-usage.

#### A9.2 · text-xs is for marks; words that label, explain, warn or locate are text-sm or larger

*fix · quick win · size S · evidence mixed, confidence high · seen by source + rendered · build*

- **Rule.** text-xs (11/14) only for Badge, Count, Kbd, Indicator, Citation, data labels and status letters.
- **Today.** Field error and count, Slider ends, Calendar days, Asset row, Panel sm labels, Select optgroup, Color picker heading, Composer menu path (11 where Command palette's is 13), palette footer hints, Menu shortcut wrapper and a description-only Choice label box are all 11/14, many with comments saying 12/16. Rendered: Field's count sits ~1 px off its description's baseline; Calendar day numerals are 11 in 30 cells.
- **Change.** Each 11/14 → 12/16; Composer menu path → 13; Calendar days 12 or 13 (owner pick; 30 cells fit either); Asset row name to 13/18 with a 12/16 meta; a cohesion test listing the parts allowed text-xs.
- **Families.** field, slider, calendar, asset-row, panel, select, color-picker, composer-menu, command-palette, menu, checkbox, radio, date-picker, date-range-picker.
- **Findings.** T1, T13, VA12, VN13.
- **Depends on** nothing; **unblocks** nothing named.
- **Risk.** Rows with these labels grow 2 px per line.
- **Verified by.** Type census test.
- **Docs and skills.** area-type-usage §1; DESIGN_SYSTEM ramp.

#### A9.3 · Joined lines and title pairs: one rule each

*decision · size M · evidence mixed, confidence medium · seen by source + rendered + reference (independent agreement) · decide*

- **Rule.** Owner decision on direction; then one sentence each in DESIGN_SYSTEM “Text pairs” and the skill.
- **Today.** A line joined to a name is 12 muted in Choice, Switch, group descriptions, Menu, Custom select caption, Field, Meter, File tile, Hover card, Empty state sm and the Section heading lede, and 13 muted in Setting row, Approval, Stepper, File upload, Design card, Board, Timeline and every surface description: a Switch is 13 over 12, the same setting as a Setting row 13 over 13. The skill says a step changes one property; surface titles change weight and ink, and Confirm dialog alone keeps a default description. Title → description is 4 (owner 2026-11-06); products 2–8 (shadcn 8, ChatGPT 8, Notion 2), Linear's page lede 12.
- **Change.** See options.
- **Families.** checkbox, radio, switch, menu, custom-select, file-tile, hover-card, setting-row, section-heading, surface, card, dialog, confirm-dialog, empty-state, page-header.
- **Findings.** T2, VC14, T23, RL6.
- **Depends on** A9.1; **unblocks** B1.1, B6.5.
- **Risk.** undefined
- **Verified by.** Type census.
- **Docs and skills.** DESIGN_SYSTEM:529–556; area-type-usage.

- **Options** (§7): Joined line = the name's size, muted; text-sm only for text set apart (recommended); Joined line steps to text-sm everywhere; Also: title-pair gap 4 → 8 on Card, Dialog, Empty state, Page header (RL6).

#### A9.4 · One treatment for a heading over a run of rows

*fix · size S · evidence mixed, confidence high · seen by source · build*

- **Rule.** A label over a run of rows (menu group, nav section, list section, shortcut group, optgroup, panel section, table group) is the rows' size, 500, muted, a row tall (owner 2026-10-22); a title naming a whole surface is default ink.
- **Today.** Menu, Nav, List box, Combobox, Palette and Shortcut list follow it; Panel heading, Link groups label, Reference list title and TOC title are 500 default; Select optgroup and Color picker heading 11/400 muted; Table group heading 400 default; the skill still says “never 500 + muted” and lists it as a mistake.
- **Change.** Select optgroup and Color picker heading → 13/500 muted; skill §4 and §10 rewritten; Panel heading, Link groups, Reference list and TOC: owner confirms muted.
- **Families.** select, color-picker, table, panel, link-groups, reference-list, table-of-contents.
- **Findings.** T3.
- **Depends on** nothing; **unblocks** nothing named.
- **Risk.** Panel heading ink is the owner's pick (Figma's inspector headings are 550 default).
- **Verified by.** Type census.
- **Docs and skills.** area-type-usage §4, §10; DESIGN_SYSTEM:190.

#### A9.5 · One weight table

*fix · size S · evidence source, confidence high · seen by source · build*

- **Rule.** 500 = titles of a surface or region, group labels, labels on fills and marks, the selected Tab; 400 = everything read or operated, including figures; an item's name takes B1.2's weight.
- **Today.** typography.ts:2 says strong only for labels on fills; DESIGN_SYSTEM:186 says larger titles are 400 (all are 500); :191 says soft Count is 500 (it is 400); item names are 500 in File tile, File upload, Asset row, Board card and 400 in Asset card, Design card, Attachment, Edit summary, Tree view, Nav, Setting row, Stepper, Timeline, Choice.
- **Change.** One table quoted by the skill and the typography.ts header; names move to one weight.
- **Families.** file-tile, file-upload, asset-row, board, asset-card, design-card, attachment, count.
- **Findings.** T4.
- **Depends on** B1.2; **unblocks** nothing named.
- **Risk.** Follows B1.2.
- **Verified by.** Type census.
- **Docs and skills.** DESIGN_SYSTEM:186–191, :556; typography.ts.

#### A9.6 · A regular weight above 400, and dark weight compensation

*decision · size S · evidence reference, confidence medium · seen by reference + source · decide*

- **Rule.** Owner decision: the Typography setting's default regular weight, and whether dark lowers weights for irradiation.
- **Today.** Regular 400, strong 500. Figma 450 / 550, ChatGPT desktop 430, Linear 510 / 590, Polaris 450 / 550; Claude 400 / 500 / 580 with dark wght 360 / 460 / 540; Geist is variable and WGHT_RAMP already holds 450.
- **Change.** See options; every option keeps the setting's values.
- **Families.** every text.
- **Findings.** RF3, BL-V1, RC9.
- **Depends on** A9.1; **unblocks** E7.
- **Risk.** undefined
- **Verified by.** Review page at true scale, light and dark.
- **Docs and skills.** typography.ts; THEMING.

- **Options** (§7): Trial 430–450 as the default regular (recommended to look at); Dark weight offset −40 on wght; Keep 400 / 500.

#### A9.7 · Secondary and ghost button label weight

*decision · size S · evidence reference, confidence high · seen by reference · decide*

- **Rule.** Owner decision (500 was the owner's pick on 2026-10-08).
- **Today.** 500 on every variant (button.css:28–31). Claude, Cursor, ChatGPT web, Notion: 400 on quiet variants, 500 on primary; GitHub 400 default / 500 primary; Radix, shadcn and Geist 500 on all; the live median is 500.
- **Change.** If changed: “500 on solid, 400 on quiet variants”, one rule in button.css.
- **Families.** button, split-button, button-group, toolbar.
- **Findings.** RC7.
- **Depends on** nothing; **unblocks** nothing named.
- **Risk.** undefined
- **Verified by.** Review page.
- **Docs and skills.** button.md.

- **Options** (§7): Keep 500 (recommended); 400 on soft, outline, ghost.

#### A9.8 · Tabular figures wherever numbers change or align

*fix · quick win · size S · evidence source, confidence high · seen by source + reference · build*

- **Rule.** Every part showing a number that updates, counts or sits in a column sets tabular-nums; a numeric field sets it on the control.
- **Today.** Missing in Number field (a scrubbed width jitters), Timestamp, Nav trailing counts (Tree and Menu have it), Date picker value, Slider ends, Table cells outside --numeric.
- **Change.** Add it; a cohesion test over a list of numeric parts.
- **Families.** number-field, timestamp, nav, date-picker, slider, table.
- **Findings.** T9, RD13.
- **Depends on** nothing; **unblocks** nothing named.
- **Risk.** None.
- **Verified by.** Cohesion test.
- **Docs and skills.** WRITING.md:111; area-type-usage.

#### A9.9 · Type literals in Kbd, code lines and sub-floor text

*fix · quick win · size S · evidence mixed, confidence high · seen by source + rendered · build*

- **Rule.** Mark and code text read the type axis: Kbd sm reads text-xs like md; code leading is a role on the type axis (LEADING[xs] + 2) and density adds no leading; inline code inherits its host's line; no text under the 10 px floor unless it is aria-hidden artwork.
- **Today.** Kbd sm and every menu Kbd are a fixed 11 on a 10 line (kbd.css:80, :107), rendered small beside 13 text in every template; Code block sm and Diff use leading-18 − 2·dense = 17 (the system's only odd line), which ignores Type; inline Code max(11, 0.875em)/1.35 renders 11.375/15.36 in a 21.38 box taller than its line; Folder and File page labels round(size × 0.13) = 6 / 8 / 12 px; Citation's footnote 0.704em = 9.15 px.
- **Change.** Kbd text-xs at every size (no change at 13; grows at types 14–16); Code sm and Diff 11/17 → 11/16; inline Code line-height inherit (box ≤ 18); folder and file labels max(text-xs, …) or aria-hidden; footnote max(10px, …).
- **Families.** kbd, menu, shortcut-list, code-block, edit-summary, code, folder, file-page, citation.
- **Findings.** T7, T8, T22, VA16.
- **Depends on** nothing; **unblocks** B5.1.
- **Risk.** Check in React whether folder labels are text or artwork.
- **Verified by.** Type census; F1 mark table.
- **Docs and skills.** type-size.ts; code.md; kbd.md.

#### A9.10 · Tracking and underline offset as tokens

*fix · size S · evidence mixed, confidence medium · seen by source + reference · build*

- **Rule.** Recommended: no tracking below 14 (as Badge already does); above it the token's own; one underline-offset token.
- **Today.** text-sm and text-base tracking applied by 9 rules of hundreds (0.03–0.08 px, invisible); the donut centre misses title-sm's −0.18 px; 0.08em literal in seven places, Badge plain 0.2em, Description list “more” none. Figma and ChatGPT open small text more (+0.055 px at 11, +0.025em ≤ 12), strong small text more again; Cursor tightens from 13 up: different faces, a weak signal.
- **Change.** type-size.ts:57 emits 0 below 14; --area-underline-offset read everywhere; weight-dependent small tracking only after an on-screen check.
- **Families.** badge, count, kbd, link, mention, chip, code, description-list, chart.
- **Findings.** T20, T21, RF12, RC18.
- **Depends on** nothing; **unblocks** nothing named.
- **Risk.** None visible below 14.
- **Verified by.** Token test.
- **Docs and skills.** area-type-usage.

#### A9.11 · One figure role

*decision · size S · evidence mixed, confidence medium · seen by source + rendered · decide*

- **Rule.** Owner decision on chart text; then figures are sans, 400, tabular, title-lg (primary) or title-sm (secondary) with their tracking; mono only where characters align by column.
- **Today.** Card value and Chart figure 26/400 sans tabular; donut centre 18/500 mono without title-sm tracking; ticks and notes mono 11 (chart.css:52) beside a sans legend.
- **Change.** Recommended: donut centre sans 400; ticks sans tabular muted.
- **Families.** chart, card.
- **Findings.** T18, VC16.
- **Depends on** nothing; **unblocks** nothing named.
- **Risk.** undefined
- **Verified by.** Chart review tile.
- **Docs and skills.** chart.md.

- **Options** (§7): Sans tabular ticks and centre (recommended); Keep mono data labels.

#### A9.12 · Reading size only where prose is written

*fix · size S · evidence mixed, confidence medium · seen by source · build*

- **Rule.** A field you write prose into, and options that become that prose, take text-lg; every other operated part takes text-base.
- **Today.** Prompt suggestions 15/22 muted, Command palette step 15/22 muted and input 15/22, Accordion md trigger 15/22 (its comment claims 16/24).
- **Change.** Palette step → 13; palette input stays 15 (owner pick); Accordion in D2.
- **Families.** command-palette, prompt-suggestions, accordion.
- **Findings.** T15.
- **Depends on** nothing; **unblocks** D2.
- **Risk.** Small.
- **Verified by.** Type census.
- **Docs and skills.** area-type-usage.

#### A9.13 · A label beside a value is muted 400; the value leads

*fix · quick win · size S · evidence mixed, confidence high · seen by source + rendered · build*

- **Rule.** Layout moves a label, not its role: a label beside its value is muted 400 and the value default ink, tabular where numeric; label to bar 6.
- **Today.** Description list justified and framed terms 500 default; Filter bar's “Label: Value” is one run in one ink inside a pressed chip; Progress label 400 with value default, Meter label 500 with value muted, gaps 8 vs 6.
- **Change.** Description list terms muted 400 in every layout; Filter bar label muted, value default; Progress and Meter label 13/400 default, value 13/400 muted tabular, gap 6.
- **Families.** description-list, filter-bar, progress, meter, field.
- **Findings.** T24, VC26, VS14, VA21.
- **Depends on** nothing; **unblocks** nothing named.
- **Risk.** Justified Description list loses its title look.
- **Verified by.** Type census.
- **Docs and skills.** area-type-usage.

#### A10.1 · Light plates and wells: re-measure after the Layers 50 merge

*fix · size M · evidence rendered, confidence low · seen by rendered · later*

- **Rule.** A plate that carries content, or a placeholder well, sits the same perceived step off its ground in light and dark (e.g. ΔL ≈ 0.035), solved in base.ts; contrast tests untouched.
- **Today.** bg-component L0.982 on L1.000 (Δ 0.018, 1.04:1) but L0.200 on L0.085 in dark (Δ 0.115): the user bubble, Empty state plate, neutral Alert, Attachment, Approval options, inline Code, Citation and Card media plates nearly vanish in light and read as solid blocks in dark (the feature well makes nested cards look like holes). Claude's bubble ≈ L0.955, ChatGPT's ≈ #f4f4f4.
- **Change.** A content-plate step at L ≈ 0.955–0.965 in light (≈ #f2f2f2) and ≈ #1a1a1a on #0b0b0b in dark, as a bg-plate role (preferred) or a re-tuned bg-component.
- **Families.** message, alert, attachment, empty-state, code, code-block, approval, citation, card, chart, asset-card.
- **Findings.** VS6, VC7.
- **Depends on** F0, A7.2; **unblocks** D3.
- **Risk.** Measured at Layers 0 in light; the owner has since moved the light default to 50 (F0). Re-measure VS6 and VC7 on the new ground before changing anything; dark's half (Δ 0.115, plates as solid blocks) stands.
- **Verified by.** F1 plate ΔL check; contrast suite.
- **Docs and skills.** DESIGN_SYSTEM Colour; layers.ts.

#### A10.2 · Dark tone inks balanced in chroma

*fix · size M · evidence rendered, confidence high · seen by rendered · build*

- **Rule.** Tone inks in dark target one chroma band per role, danger at least success.
- **Today.** Dark edge chroma: danger 0.092, success 0.216, warning 0.110, so an invalid field reads pale pink beside a vivid green success; light is the reverse (danger 0.234, success 0.148).
- **Change.** Re-solve dark tone inks to a band, with the colour-system work.
- **Families.** input, field, button, selection-bar, tag-picker, badge, alert.
- **Findings.** VA15.
- **Depends on** nothing; **unblocks** nothing named.
- **Risk.** Preserve palette.json; contrast tests gate it.
- **Verified by.** Contrast suite + a chroma-band test.
- **Docs and skills.** DESIGN_SYSTEM Colour; CONTRAST.md.

#### A10.3 · Empty boxes, rules and connectors keep their edge in dark

*fix · quick win · size S · evidence rendered, confidence high · seen by rendered + source · build*

- **Rule.** A box that is the whole affordance when empty (unchecked box, empty OTP slot, empty Alignment picker) takes edge-control-hover in both modes; dividers, mark rings and progress connectors take at least 10%; never weaker.
- **Today.** Dark unchecked Checkbox and Radio edges ~2.4:1, field and OTP edges ~1.6:1; Separator, Badge border, Count and Tag rings and the Step rail at 7.5% (≈ 7% luminance step on near-black); Stepper connectors vanish; Plan's pending ring 1.1:1 in a chat (kit gap 1); Alignment picker's 0.982 well disappears on the 0.98 gallery ground. Claude's one border is 10%.
- **Change.** Empty affordances → edge-control-hover; the divider and mark edge role 7.5% → 10%; Stepper connector stroke-control with completed segments default ink; Plan pending ring on the control edge.
- **Families.** checkbox, radio, otp-field, alignment-picker, separator, badge, count, tag, step, stepper, plan.
- **Findings.** VA22, VS17, VN14, BL-kit1.
- **Depends on** nothing; **unblocks** nothing named.
- **Risk.** Only strengthens; rung choice by eye.
- **Verified by.** Contrast suite; dark review page.
- **Docs and skills.** CONTRAST.md:32–35.

#### A10.4 · Chart series ≥ 3:1 per theme as lines

*fix · size S · evidence rendered, confidence medium · seen by rendered · build*

- **Rule.** Series are solved per theme for ≥ 3:1 against the chart ground as 1.5 px lines; bars may stay lighter with a 1 px darker edge.
- **Today.** Light: blue 2.85:1, pink 2.73:1, yellow 1.83:1, indigo 4.09:1 on white; dark all ≥ 4.8:1.
- **Change.** Deepen each light series step; luminous hue families kept.
- **Families.** chart.
- **Findings.** VC17.
- **Depends on** nothing; **unblocks** nothing named.
- **Risk.** The owner wants luminous colours: only the light step moves.
- **Verified by.** Contrast suite on series.
- **Docs and skills.** data-vis spec.

#### A11.1 · Every derived inset lands on a whole pixel

*fix · quick win · size S · evidence mixed, confidence high · seen by source + rendered · build*

- **Rule.** Every derived inset goes through round(nearest, …, 1px); cap-centred slots join inset.css's list rather than writing their own formula; card block sizes round so stacked cards land on whole pixels.
- **Today.** Combobox, Tag picker, Composer menu and Command palette empty lines, native Select options and Card's heading-beside-control compute (H − 1cap)/2 unrounded: 10.38 at Default; Table of contents text at y .6; Checkbox and Radio cards 48.61 tall.
- **Change.** Text −0.38 at every density; cards min-block-size round(up, …, 1px); cohesion test: no 1cap in a padding outside round().
- **Families.** combobox, tag-picker, composer-menu, command-palette, select, card, table-of-contents, checkbox, radio.
- **Findings.** G4, VC27, VA17.
- **Depends on** nothing; **unblocks** B2.6.
- **Risk.** None.
- **Verified by.** Cohesion test; F1.
- **Docs and skills.** inset.css header.

#### A11.2 · One shared hit target: 24 pointer, 44 coarse

*fix · size M · evidence mixed, confidence high · seen by source + reference · build*

- **Rule.** Any interactive box under 24 on either axis carries a centred ::after of max(24px, 100%), 44 under pointer: coarse (the Badge and Tag recipe as one utility); under coarse every control's target is ≥ 44.
- **Today.** Input action and Number field steps h − 8 (sm 16 / 18 / 22), Chip dismiss, Nav row actions 20 / 22, Split button's icon trigger 15 wide (rendered 15 × 30), Segmented and Toggle group sm items 20 / 22, Breadcrumb ellipsis 16, Color swatch picker sm 20 / 22, Step rows 18; coarse growth exists only in badge, splitter, switch, tag, toggletip.
- **Change.** No visible change; targets only. Segmented sm overlaps its neighbours by 1–2 px (or max(24, h − 4)).
- **Families.** input, number-field, chip, nav, split-button, segmented, toggle-group, breadcrumb, color-swatch-picker, step, button, toast, tree-view, calendar, slider, scroll-area, menu.
- **Findings.** G3, I22, RD10.
- **Depends on** F2; **unblocks** B2.5, E2.
- **Risk.** Overlapping targets in tight toolbars; F2 hit tests.
- **Verified by.** Cohesion test at Compact; F2 elementFromPoint tests.
- **Docs and skills.** DESIGN_SYSTEM:490; area-a11y-audit.

#### A11.3 · Glyphs at native sizes

*fix · quick win · size S · evidence source, confidence medium · seen by source · build*

- **Rule.** A glyph's box reads an icon-* token or a native size (16, 20, 24; the 12 and 10 cuts); scaled figures snap to the nearest native size.
- **Today.** File upload's glyph a fixed 20; Empty state 24 / 16 − 4·cut; File page icon size × 0.32 → 30 at 96. (Small controls' lg icon equals md's 16 by design: no change.)
- **Change.** File page 30 → 32 or 24; File upload → icon-xl or a spec line.
- **Families.** file-upload, empty-state, file-page.
- **Findings.** G15, G20.
- **Depends on** nothing; **unblocks** nothing named.
- **Risk.** None.
- **Verified by.** Icon-size census.
- **Docs and skills.** area-icon-construction.

#### A11.4 · Truncated single lines keep their descenders

*fix · size S · evidence reference, confidence low · seen by reference · later*

- **Rule.** If any truncating text clips g, y or p, every truncating box pads its block by 0.125em and takes it back with a negative margin (Claude's rule).
- **Today.** 50 text-overflow: ellipsis rules, none pads its block; clipping not verified rendered.
- **Change.** Measure first in F1; apply only if clipping is found.
- **Families.** every truncating label.
- **Findings.** RC20.
- **Depends on** F1; **unblocks** nothing named.
- **Risk.** None.
- **Verified by.** F1 descender check.
- **Docs and skills.** WRITING.md truncation.

### B. Shared parts (Phase 2)

#### B1.1 · One frame recipe and one frame prop

*fix · size L · evidence mixed, confidence high · seen by source + rendered · build*

- **Rule.** Every card-like frame (Card, Surface, Asset card, Design card, File tile, chat cards, media frames) reads one recipe: corner from radius-container (A2.3), the inset ladder, the title pair, concentric nested parts with a floor that shrinks the wrapper's pad rather than landing at 4; one frame prop; content kind is kind, not layout.
- **Today.** No shared frame; stroke-selected painted in 5 files; five frame spellings (variant=surface/plain, card/soft, container=framed/basic/containerless, framed boolean, surface/soft/plain). Rendered corners 14 (Table), 16 (Board, Description list framed, Panel, Video, Figure), 18 (Card, Surface), 19 (Composer), 20 (Asset card; its spec says 16), 21 (Card lg), 24 (Design card ground). Surface md: inset 14, gap 10, title 16/22 over a 12 lede, beside Card's 18, 14 and 13 over 13. A soft Surface at Layers 0 paints nothing yet pads 14 (owner: keep Flat flat) while Card's well paints. Card well and Surface-in-Panel nest at a 4 corner. Asset and Design card's layout axis names content kind.
- **Change.** The recipe in surface.css; one frame prop (variant surface | soft | plain) with aliases; kind replaces content layout; Surface takes Card's inset, gap and title pair (or the reverse, decided once); an unpainted soft region takes no inline inset; nested floors stop at radius-row 8; corner values from A2.3.
- **Families.** card, surface, asset-card, design-card, file-tile, figure, video-player, table, description-list, board, panel, approval, calendar, color-picker, edit-summary, plan, toolbar, checkbox, radio.
- **Findings.** BL-C2, BL-C9, B-S13, B-S8, VC3, VC5, VC6, VC19, BL-C8.
- **Depends on** A2.3, A9.3, F8, F0; **unblocks** B1.2, B1.3, E1.1, E1.3.
- **Risk.** The largest visible change: every card corner and Surface's inset move; Asset card's retirement rides on it. Review page with Card, Surface, Design card and Table side by side. VC6 (a soft Surface painting nothing at Layers 0) must be re-measured at the light default 50 after F0 before its fix is chosen.
- **Verified by.** F1 frame table: one corner per size, nested ≥ 8.
- **Docs and skills.** card.md, surface.md, asset-card.md:120, design-card.md:60, :104; area-ui-compose.

#### B1.2 · One item-name part for picture cards

*decision · size M · evidence rendered, confidence medium · seen by rendered · decide*

- **Rule.** Owner decision on the weight; then one name part: one weight, one gap from the picture (8 outside, the inset inside), one indent (0 outside an unframed picture, the text inset inside); position stays a prop with one geometry each.
- **Today.** Name above (Asset card, x 13.4, 400), below inside (Card, x 18, 500), below outside (Design card x 4, Figure x 0, File tile centred; 400 and 500). The 2026-11-01 card system (“name below, 8 in”) and the feed system (“names top-left”) already disagree.
- **Change.** See options; Design card's 4 indent → 0.
- **Families.** asset-card, design-card, card, file-tile, figure, board.
- **Findings.** VC4.
- **Depends on** B1.1; **unblocks** A9.5.
- **Risk.** undefined
- **Verified by.** Review page.
- **Docs and skills.** DESIGN_SYSTEM:556; card system notes.

- **Options** (§7): 500 default ink for every item name (recommended); 400 for names.

#### B1.3 · One chat card

*fix · size M · evidence rendered, confidence high · seen by rendered · build*

- **Rule.** Chat cards share corner radius-container, a text inset from the outer edge with the border counted once (inset-surface-sm, 12), a ui-row head (30) and a 13/18 500 default title; Composer and Approval keep the composer corner with the same 12 inset; Code block takes the card corner (or radius-control-lg), never a derived half pixel.
- **Today.** Composer corner 19 / inset 16, Approval 19 / 12, Plan, Queue and Edit summary 16 / 13 (Edit's head 34), Message 16 / 14, Code block 13 and 11.5 with insets 11 / 15, Diff 4, Attachment 8 / 11: a transcript shows three corners and three insets within a few rows. Claude holds one corner (10), Cursor one (12).
- **Change.** Plan, Queue, Edit text 1 px in; Code block 13 → 16 and 11.5 → 16 (or 10); Edit head 34 → 30.
- **Families.** composer, approval, plan, queue, edit-summary, message, code-block, attachment.
- **Findings.** VS1.
- **Depends on** B1.1; **unblocks** B4.4, D3, E1.2.
- **Risk.** Corner value follows A2.3.
- **Verified by.** F1 frame table.
- **Docs and skills.** chat set specs; area-ui-compose chat recipe.

#### B1.4 · Card's text-only bottom

*decision · size S · evidence rendered, confidence medium · seen by rendered · decide*

- **Rule.** Owner decision (card.md:98 trims the last line to its descent).
- **Today.** Title cap 18 from the top; last line's descent 18 from the bottom, so its baseline sits ≈ 22.6 from the edge: text-only cards look 4–5 px heavier at the bottom.
- **Change.** Option: trim to the baseline plus a fixed descender allowance (≈ 16 baseline-to-edge).
- **Families.** card.
- **Findings.** VC18.
- **Depends on** B1.1; **unblocks** nothing named.
- **Risk.** undefined
- **Verified by.** Review page.
- **Docs and skills.** card.md.

- **Options** (§7): Baseline plus allowance (recommended to look at); Keep the descent trim.

#### B2.1 · One row table

*fix · size M · evidence mixed, confidence high · seen by rendered + source + reference (independent agreement) · build*

- **Rule.** Rows: corner(row height) everywhere (after A2.1); one text-only edge; one row-icon ink (muted, taking the row's ink only where the row's ink is the state); a separator is Menu's 6 − ui-dense from the plates with its ends on the plates' edges; a group break is gap-row, never a fixed margin; plates ui-row-gap apart by gap; a mark in an icon slot keeps the slot's footprint (a picture list reserves the picture width on every row).
- **Today.** Menu, Palette, List box corners 10 vs Nav and Tree 8; text-only edge 10 (Menu, List box) vs 8 (Nav); icons default ink in Menu, Nav, Palette and muted in Tree view and the rest, and the sidebar shows both; Nav separator 9 fixed vs Menu 5 / 6 / 7; Nav group break 12 fixed; native Select options 2 apart by margin; separators inset 8 while text starts at 13–14; Nav's 20 × 14 picture starts labels at 38 beside 34.
- **Change.** Nav separator 9 → 5 / 6 / 7; Nav group break → gap-row; Select options 2 → 1; one text-only edge; Menu and Nav icons muted at rest (recommended; every reference's icon ink is a step lighter); separators on the plates' edges; picture lists reserve the width.
- **Families.** menu, context-menu, nav, tree-view, list-box, command-palette, select, custom-select, combobox.
- **Findings.** VN9, G7, T11, RF11, G14, VN23.
- **Depends on** A2.1, B2.3; **unblocks** D1.
- **Risk.** Icon-ink direction is a pick.
- **Verified by.** F1 row table.
- **Docs and skills.** DESIGN_SYSTEM:581; area-ui-compose.

#### B2.2 · One centring model for single-line text in controls, rows and tabs

*fix · size M · evidence rendered, confidence high · seen by rendered · build*

- **Rule.** Every one-line label or value in a control, row or tab uses the cap-trimmed span; a native input's line box is offset by the same amount from 1cap; a second text beside a trimmed one is trimmed too.
- **Today.** Button, Chip, Segmented, Menu, Nav, Palette and List box: cap centre 0.00 on every tile. Custom select (19 tiles), Date picker (14), Time field (60 texts), Number field units, Selection bar's count, Tabs, Tree view, Pagination, Panel row labels and Tooltip centre the line box: 0.6 px high. Switch's label is 0.61 above its track on all 22 tiles while Checkbox and Radio are exact. Inside one Input the trimmed affix and untrimmed value disagree (“+1” vs “1”).
- **Change.** Field value slots, Switch label and Tabs, Tree, Pagination, Panel and Tooltip labels join the trim list; native inputs get padding-block-start (line − cap)/2 less the half-leading (+0.61 at 13); a cohesion check from the review's capc.js.
- **Families.** input, search-field, password-field, number-field, select, custom-select, combobox, date-picker, date-range-picker, time-field, tag-picker, color-field, selection-bar, switch, tabs, tree-view, pagination, panel, tooltip, setting-row, field.
- **Findings.** VN8, VA1, VA2.
- **Depends on** F1; **unblocks** B3.1, E8.
- **Risk.** 0.6 px moves; the ascent is inferred from Button's trimmed box, so confirm the amount in F1.
- **Verified by.** F1 cap-offset check.
- **Docs and skills.** inset.css:248–260; DESIGN_SYSTEM optical insets.

#### B2.3 · Menu density and the row label column

*decision · size M · evidence reference, confidence high · seen by reference · decide*

- **Rule.** Owner decision: the row icon → label gap and the list floor; once set, one value for Nav, Tree view, Menu and Palette.
- **Today.** Menu rows 30 (Compact 28), icon → label gap-row 10 (8), label at 34 (32), floor 224, no cap. Claude rows 24, gap 6, label 30, floor 128 / cap 320; Cursor 24, 6, 30, 120 / 320; ChatGPT gap 6, label 34; Figma 4 after a 24 box; GitHub and shadcn nav gap 8 (live median 8). A1.1's whole-step rule alone would move gap-row to 12 (label 36), away from every reference. Tree view already uses 6 (owner, pass 3).
- **Change.** Recommended: the row icon → label gap reads ui-cluster (6 / 8 / 10: label 32 at Default, 30 at Compact, matching Claude and Cursor), so Tree view's 6 stops being an exception at Compact; floor 224 → 160 with lists still growing to their field; row height from A8.1.
- **Families.** menu, context-menu, composer-menu, select, custom-select, combobox, command-palette, list-box, nav, tree-view.
- **Findings.** RC4, RC12, RF17.
- **Depends on** A8.1; **unblocks** A1.1, B2.1.
- **Risk.** undefined
- **Verified by.** F1 row table; Menu and Nav side by side.
- **Docs and skills.** inset.css:91–100; DESIGN_SYSTEM:581.

- **Options** (§7): ui-cluster gap, label 32 / 30, floor 160 (recommended); gap-md 6 at every density (RF17, RC12); Keep gap-row (10 now, 12 after A1.1).

#### B2.4 · Two-line rows: where the leading icon sits

*decision · size S · evidence mixed, confidence medium · seen by source + reference · decide*

- **Rule.** Owner decision; recommended the written rule (DESIGN_SYSTEM:719): leading glyphs in multi-line rows align to the first line by the box technique (a box one first-line tall, align-self flex-start); a picker row's trailing check may stay centred.
- **Today.** Menu's row with a description centres its leading icon and check over both lines (icon 9 below the content top instead of 1); Board, Plan, Queue, Accordion and Attachment use the box; Alert, Toast, Card list and Switch use margin arithmetic (same pixels). Claude centres two-line menu rows optically. model-picker.md's capture has no leading icon.
- **Change.** Leading icon to the first line (−8); all first-line cases on the box technique.
- **Families.** menu, model-picker, custom-select, alert, toast, card, switch.
- **Findings.** G10, RC21.
- **Depends on** nothing; **unblocks** nothing named.
- **Risk.** undefined
- **Verified by.** F1.
- **Docs and skills.** DESIGN_SYSTEM:719.

- **Options** (§7): First line (recommended); Optically centred pair (Claude).

#### B2.5 · A control in a row keeps the row's height and centre

*fix · quick win · size S · evidence rendered, confidence high · seen by rendered · build*

- **Rule.** A control's paint is centred in its own target box; a control inside a row grows its target with an absolutely placed hit area, never by layout.
- **Today.** In Setting row the Switch's 18 track draws at the top of its 24 hit box, 3 px above the 202 line that Select and Segmented centre on (199 / 202 / 202 down a framed group). Table's selection column makes rows 44 (header 43.5) instead of 39, because the checkbox label is a 24-tall target.
- **Change.** Switch track centred in its box (or the box takes the track's height with A11.2's ::after); Table's checkbox target absolute.
- **Families.** switch, setting-row, table, checkbox.
- **Findings.** VA3, VC11.
- **Depends on** A11.2; **unblocks** nothing named.
- **Risk.** None.
- **Verified by.** F1 row centring.
- **Docs and skills.** switch.md; table.md.

#### B2.6 · One empty, loading and no-results line

*fix · quick win · size S · evidence source, confidence high · seen by source · build*

- **Rule.** A list's empty, loading and no-results line is .area-menu__empty: one class, one geometry.
- **Today.** Menu's are rows; Combobox, Tag picker and Composer menu restate the row unrounded; Command palette's empty line is control-md tall (26 beside 28 rows at Compact).
- **Change.** All four use the Menu class (palette +2 at Compact; the others −0.38).
- **Families.** combobox, tag-picker, composer-menu, command-palette.
- **Findings.** G5.
- **Depends on** A11.1; **unblocks** nothing named.
- **Risk.** None.
- **Verified by.** F1.
- **Docs and skills.** none

#### B2.7 · Inspector rows share one column grid

*fix · size M · evidence rendered, confidence medium · seen by rendered + reference · build*

- **Rule.** A section with any row action reserves the action column on every row so fields share columns; a row whose end holds a 24 icon button uses text edge 16 and action edge 8 (both ladder values).
- **Today.** Panel's Position row controls span 212, Dimensions 174 with a 30 action column, so W/H's second column starts left of Y's; Panel's inset is a symmetric 14; Figma's rows are padding 0 8 0 16 on an 88 88 24 grid.
- **Change.** Panel section grid with a reserved action column; the asymmetric row inset as a Panel rule.
- **Families.** panel, box-field, number-field, property-list.
- **Findings.** VN16, RF13.
- **Depends on** B4.1; **unblocks** nothing named.
- **Risk.** Review with the owner's region-balance picks for Panel.
- **Verified by.** F1 Panel column check.
- **Docs and skills.** panel.md; area-ui-compose inspector.

#### B3.1 · One field shell rule

*fix · size M · evidence mixed, confidence high · seen by source + reference · build*

- **Rule.** One field-shell selector list (or @scope block) in input.css that every field root joins, as rows join .area-menu__item: edge, hover, focus recolour, soft variant with a hover edge, corner from height and pill-field, size tiers; seams inside a group read the control edge; label above its control ui-stack (6), Panel's 4 written as its tier.
- **Today.** Input, Input group, Number field, OTP and Tag picker each restate the slot ladder (13–16 input-* reads each) while Date picker and Custom select read 5. The render agrees today (height, corner, edge, inset, placeholder ink, label gap across 12 families) but by copy. Input group's seams are border-decorative (oklab 0.952), lighter than its own edge (0.9008); soft fields show no hover edge (Figma's do); label gaps 6, 4 (Panel), 2 (Slider top). Geist's label gap is 8 (one product).
- **Change.** The shared shell; Input group seams → edge-control; soft fields take the control edge on hover; Slider top label 2 → 6 (or 4 if it is a Panel row caption). RL8's 8 waits for two more measured products.
- **Families.** input, input-group, number-field, otp-field, tag-picker, date-picker, custom-select, combobox, select, textarea, time-field, color-field, slider, panel, field.
- **Findings.** B-S5, S16, RF16, T14, RL8.
- **Depends on** B2.2; **unblocks** B3.2, B7.10, C3.
- **Risk.** Visible only at seams and soft-field hover; prevents drift.
- **Verified by.** F1 field table unchanged; seam contrast check.
- **Docs and skills.** input.md; field.md; DESIGN_SYSTEM:545.

#### B3.2 · Field text inset against the products

*decision · size S · evidence rendered, confidence low · seen by reference · decide*

- **Rule.** Owner decision: whether field text sits further in than a button label.
- **Today.** Field text 10 from the edge on 30 (.33); Geist 12 on 32 (.375), shadcn 12 + 1 (.41), Radix select 12 (.375). Button and field share 10, so stacked rows align.
- **Change.** Option: --_box-text + 2 on fields only.
- **Families.** input, select, custom-select, combobox, date-picker, textarea.
- **Findings.** RL7.
- **Depends on** B3.1; **unblocks** nothing named.
- **Risk.** undefined
- **Verified by.** F1.
- **Docs and skills.** inset.css.

- **Options** (§7): Keep 10 (recommended); Fields + 2.

#### B3.3 · Field trailing parts: one clear glyph and a drawn resize handle

*fix · quick win · size S · evidence rendered, confidence high · seen by rendered · build*

- **Rule.** One clear glyph for every field action (dismiss); dismiss-circle stays a status mark; no OS-drawn part in a field.
- **Today.** Search field clears with dismiss-circle (SearchField.tsx:100), also the error mark; every other clear is dismiss. Textarea's native resize grabber is drawn by the OS over the rounded corner in both themes.
- **Change.** Search clear → dismiss (or the owner keeps the filled disc as a search convention); ::-webkit-resizer styled in input-chevron ink inset by the corner, or resize: none with autosize.
- **Families.** search-field, textarea.
- **Findings.** VA18, VA20.
- **Depends on** nothing; **unblocks** nothing named.
- **Risk.** The search disc: owner glance.
- **Verified by.** Review tile.
- **Docs and skills.** icon usage table.

#### B4.1 · Two header bars

*fix · size M · evidence mixed, confidence medium · seen by source + rendered · build*

- **Rule.** Two bars, each from the control it holds: a region bar = control-sm + 14 (the owner's 7 above and below) and a tool bar = control-md + 2 × ui-cluster, plus the rule when drawn; every header picks one.
- **Today.** Panel md 39 / 47 / 59, Panel sm 33 / 39 / 47, Titlebar md 38 / 46 / 58, window bar and Titlebar sm 38 / 40 / 44, Toolbar 38 / 46 / 54, palette search 40 / 44 / 52, Board column and Color picker headers 40 fixed; rendered 47 / 39 / 39 / 44 / 40 / 46 at Default. Panel's bar to its first section is loose (~36 cap to cap vs 22–30 later).
- **Change.** Panel md 59 → 55 at Comfortable; Titlebar md 58 → 54; palette search 40 / 44 / 52 → 38 / 46 / 54; Board and Color picker headers → 38 / 40 / 44; Panel's first section drops its top pad; Panel sm stays a third bar or folds into the region bar (owner).
- **Families.** panel, titlebar, toolbar, command-palette, board, color-picker, menu.
- **Findings.** G6, VN7, VN17.
- **Depends on** A8.1; **unblocks** B2.7, E1.1.
- **Risk.** The two-bar split is a proposal on certain measurements: owner confirms on one page with the app's three headers.
- **Verified by.** F1 header table.
- **Docs and skills.** THEMING:133; area-ui-compose shell.

#### B4.2 · A corner control is concentric with its surface

*fix · quick win · size S · evidence mixed, confidence high · seen by source + rendered · build*

- **Rule.** A surface publishes --_corner; its corner control (close, dismiss, end action, row action, calendar nav) takes max(radius-floor, corner − distance) and sits equidistant from the two edges, as Composer, Toolbar and Approval already do.
- **Today.** Dialog close 9 in with corner 8 in a 20 surface (needs 11); Popover 7 / 8 in 16 (needs 9); Toast and Alert end controls 5 in, corner 8 in a 10 corner (needs 5); Calendar nav 10 / 8 in 16 (needs 6); Queue row actions 2 in, corner 4 in an 8 row (needs 6); Panel md's ellipsis 10 from the top but 14 from the side; Color picker header glyph 13 beside text at 16. Tooltip + Kbd is concentric when rendered (4 in, 6 = 10 − 4): S2's Tooltip line is withdrawn. Edit summary's head actions are right.
- **Change.** Plates round 11 / 9 / 5 / 6; Panel's action moves out 7, evenly placed; Color picker's control in 3.
- **Families.** dialog, confirm-dialog, drawer, popover, hover-card, toggletip, toast, alert, calendar, queue, panel, color-picker.
- **Findings.** S2, VN4, G9, VS26.
- **Depends on** A2.3; **unblocks** B4.3, B6.7.
- **Risk.** Values move with A2.3; the rule holds at any corner.
- **Verified by.** F1 corner-action table.
- **Docs and skills.** DESIGN_SYSTEM “a button set into a corner”.

#### B4.3 · Edge ghost buttons put their glyph on the column

*fix · size S · evidence mixed, confidence medium · seen by reference + rendered · build*

- **Rule.** A ghost icon action at a column or surface edge pulls out by (control − icon)/2 so its glyph sits on the text column (labelled buttons by their gutter); a filled or outline control keeps its plate on the column.
- **Today.** Card keeps a ghost plate on the text column (the glyph 7 inside: 25 from Card md's edge beside text at 18); Message's first ghost action starts at the text x, its glyph 7 in, and the two authors' text-to-actions gaps are 10 and 4; .area-button--start/--end covers labelled buttons, the icon-only path is untraced.
- **Change.** Card ghost header action out 5 / 7 / 9; Message actions −7 and one meta gap (4); Panel bar and Dialog header actions use it; check icon-only pulls (size − icon)/2.
- **Families.** card, message, panel, dialog, toolbar, button.
- **Findings.** RF9, VS11.
- **Depends on** B4.2; **unblocks** nothing named.
- **Risk.** Card's 2026-09-28 note chose the plate edge for vertical position only. Message's actions while streaming: D3.
- **Verified by.** F1 glyph-on-column check.
- **Docs and skills.** inset.css:328; button.md.

#### B4.4 · One collapsible card head

*fix · quick win · size S · evidence rendered, confidence high · seen by rendered · build*

- **Rule.** A collapsible card head: title 13/18 500 default, count or status at the end in muted 12, chevron after the title (as Plan, Step and Reasoning), ui-row tall.
- **Today.** Plan's title 400 default with the chevron after it; Queue's 400 muted with the chevron at the far end; Edit summary 400 default with a 34 head; Approval 500.
- **Change.** Plan, Queue, Edit titles to 500; Queue's title darker and its chevron moves; Edit head 34 → 30.
- **Families.** plan, queue, edit-summary, step, approval.
- **Findings.** VS7.
- **Depends on** B1.3; **unblocks** nothing named.
- **Risk.** None.
- **Verified by.** F1.
- **Docs and skills.** chat set specs.

#### B5.1 · One mark

*fix · size M · evidence mixed, confidence high · seen by rendered + source · build*

- **Rule.** A mark's height from the mark ladder (14 / 18 / 22), every size distinct at every density; text from mark-label at every density; side (H − 6)/2 counting the edge; internal gaps 2 or 4; Badge's cap-centred padding; one corner role — pill for status and counts (Badge, Count, Indicator, Citation), radius-small for object chips (Tag, Kbd, inline Code); an alpha fill; an inline chip never exceeds its line.
- **Today.** Badge 18 / 11 / 500 / side 6 / pill; Count 18 / 11 / 400 / 6 / pill; Tag 18 / 13 / 400 / 5 / corner 4 (text 1 / 0 in its box); Kbd 18 / 11 on 10 / 500 / side 4 (the census's 6 is wrong) / 6, and 22 tall at corner 2 in Approval, 14 at 4 in its hint; Citation 18 / side 7 / a solid L0.973 fill, text 0.6 high; Indicator's count 16 / 500; inline Code 21.38; Mention's chip 21 in an 18 line (wrapped chips overlap 3 px); Badge label gaps 1 / 3 / 4; Tag lg side 6 vs Badge lg 8 (Tag lg text renders 13/22, so G12's “11” is withdrawn); at Compact sm = md = 14; Badge Plain 400; Solid neutral, Solid inverse and Soft inverse paint one look in light.
- **Change.** Tag side 5 → 6, lg 6 → 8; Kbd side 4 → 6 and line 10 → 14, Approval's keys a square Kbd at radius-small; Citation side 7 → 6, text down 0.6, alpha fill; Badge gaps 1 → 2 and 3 → 4; Mention block pad ≤ (line − text)/2 (21 → 18); Badge Plain at the mark weight; inverse made distinct or dropped; Badge Content tiles on the default variant; Tag's status shape (V11) on the same recipe.
- **Families.** badge, badge-group, count, tag, kbd, shortcut-list, approval, citation, indicator, code, mention, prompt-suggestions.
- **Findings.** VS2, G12, VS13, VS25, VS18, VC24, BL-V11.
- **Depends on** A9.9, B5.2; **unblocks** B5.3.
- **Risk.** Tag's text size and the Compact merge are B5.2.
- **Verified by.** F1 mark table.
- **Docs and skills.** DESIGN_SYSTEM:723–734; badge.md, tag.md, kbd.md.

#### B5.2 · Tag text against Badge, and the Compact mark merge

*decision · size S · evidence mixed, confidence high · seen by source · decide*

- **Rule.** Owner decision: Tag's text size (today it changes with density) and whether sm and md marks merge at Compact. In every option a mark's text follows its size prop, never density.
- **Today.** Tag sets its size by sign(ui-leading − plate height): 13/18 at Default, 11 at Compact, 12 at type 12 Default; Badge and Count on the same plate are 11 at every density. At Compact mark-label-sm = md = 14, so Badge, Count, Kbd and Tag sm and md are identical at the app's density. Notion's tags 12 on 18; live badges 12 / 500.
- **Change.** See options.
- **Families.** tag, badge, count, kbd.
- **Findings.** T6.
- **Depends on** nothing; **unblocks** B5.1.
- **Risk.** undefined
- **Verified by.** F1 mark table at Compact.
- **Docs and skills.** tag.md; DESIGN_SYSTEM marks.

- **Options** (§7): Tag md 11/14 like Badge at every density (recommended); Tag md 13/18 at every density; Compact: md marks 14 → 18, or document the merge.

#### B5.3 · One counter

*fix · quick win · size S · evidence rendered, confidence high · seen by rendered · build*

- **Rule.** Indicator's count is Count on a danger solid: one component, one weight, ladder heights; documented heights from the ladder.
- **Today.** Count md 18 / 400; Indicator's count 16 / 500 written as 16px + 2px literals (indicator.css:80); pages.mjs:20 documents Count as 16 / 20 while it renders 14 / 18.
- **Change.** Indicator count 16 → 18 (or Count gains a 16, stated once); tokens replace the literals.
- **Families.** indicator, count.
- **Findings.** VS12.
- **Depends on** B5.1; **unblocks** nothing named.
- **Risk.** A badge on an icon may need 16: decide once.
- **Verified by.** F1.
- **Docs and skills.** count.md; generated docs (F5).

#### B6.1 · One floating shadow stack, listed in material

*fix · quick win · size S · evidence source, confidence high · seen by source · build*

- **Rule.** Every floating surface uses one --area-float-shadow-stack (material layers, edge, elevation) and material.css lists every floating class; Tooltip is the written exception.
- **Today.** Calendar surface, Color picker surface and Select's picker list only edge + float and are absent from material.css (a glass Menu beside an opaque date grid); Scroll to latest has no shadow-edge. Not visible at the default material (rendered shadows identical to Menu's).
- **Change.** One custom property; a cohesion test that every shadow-float/modal surface lists material and edge.
- **Families.** calendar, color-picker, select, scroll-to-latest, tooltip.
- **Findings.** S13.
- **Depends on** nothing; **unblocks** nothing named.
- **Risk.** None at defaults.
- **Verified by.** Cohesion test; a glass review tile.
- **Docs and skills.** material.css; DESIGN_SYSTEM Elevation.

#### B6.2 · A surface's block gap never exceeds its inset

*fix · quick win · size S · evidence source, confidence high · seen by source · build*

- **Rule.** Block gap = min(inset-surface-md, the surface's own inset): the Surface rule stated once for every floating and modal surface.
- **Today.** Popover's blocks stand 14 apart inside a 12 edge (18 at Comfortable); Dialog and Drawer 18 inside 16 at Comfortable.
- **Change.** Popover 14 → 12 (18 → 12 at Comfortable); Dialog and Drawer 18 → 16 at Comfortable; the scrolled rule follows.
- **Families.** popover, dialog, drawer, hover-card.
- **Findings.** G2.
- **Depends on** nothing; **unblocks** nothing named.
- **Risk.** None.
- **Verified by.** F1.
- **Docs and skills.** DESIGN_SYSTEM:631.

#### B6.3 · The overlay corner table, written

*fix · size S · evidence mixed, confidence medium · seen by source + rendered · build*

- **Rule.** Lists (Menu, Command palette's results, field lists, menus opened from controls) take the list corner; panels (Popover, Calendar surface, titled Toast, Date picker panel) the surface corner; modals (Dialog, Drawer, Command palette's frame) the modal corner; overlays expose width hooks.
- **Today.** Command palette 14 (radius-list) beside Dialog and Confirm 20, all modal; a Split button md and a Custom select md, both 30 tall, open lists at 14 and 12; Number field's unit select 10; Calendar's caption menu 12; date-picker and Filter bar popovers 16; Command palette 600px and Confirm dialog 420px literals with no public width hooks.
- **Change.** One list corner for menus and listboxes from a control (values from A2.1 / A2.3); the palette frame takes the modal corner with its list concentric inside (recommended), or the table says why it is a list; --area-dialog-inline-size, --area-drawer-inline-size, --area-command-palette-inline-size.
- **Families.** command-palette, dialog, confirm-dialog, drawer, menu, split-button, custom-select, combobox, tag-picker, number-field, calendar, date-picker, filter-bar, time-field, zoom-control, toolbar.
- **Findings.** S14, VN22, VA8, BL-C10.
- **Depends on** A2.3; **unblocks** nothing named.
- **Risk.** The palette as list or modal is a design call.
- **Verified by.** F1 corner table.
- **Docs and skills.** DESIGN_SYSTEM:638–642.

#### B6.4 · Whether floating lists count their border in the inset

*decision · size S · evidence mixed, confidence medium · seen by source · decide*

- **Rule.** Owner decision: one convention for padding = inset − border.
- **Today.** Menu, Select picker and field lists pad 4 inside a 1 px border (rows 5 from the outer edge, rendered) and compute the row corner as list − 4 (surface.css:1276: “counting it gives 7”), a recorded choice; Popover, Dialog, Card and Toast subtract the border. Command palette, the best-aligned surface in the render (search icon and row icons share x +12), depends on it.
- **Change.** Recommended: keep and document the exception (DESIGN_SYSTEM:713–715); if A7.1's optional ring moves the floating edge into the shadow, the question disappears.
- **Families.** menu, context-menu, command-palette, select, combobox, custom-select, tag-picker.
- **Findings.** S21, G17.
- **Depends on** A7.1; **unblocks** nothing named.
- **Risk.** undefined
- **Verified by.** Docs.
- **Docs and skills.** DESIGN_SYSTEM:713–715.

- **Options** (§7): Keep and document (recommended); Count the border (S21).

#### B6.5 · One overlay footer pair and one dialog title group

*fix · size S · evidence mixed, confidence high · seen by rendered + reference · build*

- **Rule.** Every overlay footer pairs a soft neutral secondary with a solid primary (or soft danger); footer text Buttons are at least 2.25 × their height; a title group that ends a header is read on its glyphs, and the close centres on the title's cap.
- **Today.** Dialog's Cancel is ghost (ink 0.452), Confirm dialog's and Drawer's soft, Popover's teaching step outline; Buttons have no minimum width, so “OK” is narrower than “Cancel”; Dialog's title is untrimmed with a close (cap ~18.8 below the edge) and trimmed without (16): a 2.8 px jump; Dialog's description is muted and untrimmed, Confirm's default (recorded) and trimmed.
- **Change.** The pair in docs and demos; min-inline-size 2.25 × H on footer Buttons (Confirm, Dialog, Drawer, Approval); Dialog and Drawer trim a closing description and centre the close on the cap; Confirm's default description stays the written exception.
- **Families.** dialog, confirm-dialog, drawer, popover, approval, button.
- **Findings.** VN5, VN6, RD11.
- **Depends on** A9.3; **unblocks** nothing named.
- **Risk.** Canonical secondary emphasis recommended soft (Confirm's measured pick).
- **Verified by.** F1.
- **Docs and skills.** dialog.md; confirm-dialog.md; area-ui-compose.

#### B6.6 · Scrollers: corner-aware tracks, one bar style, a cue at the end

*fix · size S · evidence mixed, confidence high · seen by rendered + source · build*

- **Rule.** A scrollbar track inside a rounded container insets its ends by corner − side inset; every scrolling region is a Scroll area or reads one thin-scrollbar token; a scrolling body shows the footer rule while it can scroll further.
- **Today.** Scroll area's thumbs run into the 16 corner and are cut (Horizontal, Both, Always shown tiles); Dialog body, Drawer body, palette list, Menu, Select picker, Textarea, Code block, Table wrapper and Popover use the native bar; a scrolling Dialog body clips mid-line with no cue (footer undivided by decision, dialog.md:98).
- **Change.** Track ends inset 14 at corner 16; scrollbar-width thin and one colour token elsewhere; data-scroll-end mirrors the header rule at the footer (reopens a recorded exclusion: owner glance).
- **Families.** scroll-area, menu, command-palette, panel, drawer, dialog, select, textarea, code-block, table, popover.
- **Findings.** VN3, S23, VN15.
- **Depends on** nothing; **unblocks** E3.
- **Risk.** VN15 reopens dialog.md:98.
- **Verified by.** F1 clip check.
- **Docs and skills.** scroll-area.md; dialog.md.

#### B6.7 · Alert and Toast agree

*fix · quick win · size S · evidence rendered, confidence high · seen by rendered · build*

- **Rule.** Alert and Toast share inset, icon, title ink (A3.4), corner controls (B4.2) and action placement: actions wrap only when the text no longer fits (flex-wrap), never by a width query.
- **Today.** They agree on 36 one-line height, padding, icon, gap 8, title gap 4, corners 10 / 16. Alert's container query moves actions to a second row under 480, so a 348–480 alert in a panel always takes two rows for one short action, while Toast at 360 keeps Undo inline; comments say 40 and 6 in (renders 36 and 5) and 44 and 8 (renders 38 and 6); Alert's gaps are a fixed 8 where Toast's are ui-cluster (identical at Default).
- **Change.** Remove the width query; Alert gaps → ui-cluster; comments corrected.
- **Families.** alert, toast.
- **Findings.** VS10.
- **Depends on** A3.4, B4.2; **unblocks** nothing named.
- **Risk.** None.
- **Verified by.** F1.
- **Docs and skills.** alert.md; toast.md.

#### B7.1 · One open-trigger paint

*fix · size M · evidence mixed, confidence high · seen by source · build*

- **Rule.** A trigger whose popup is open ([aria-expanded=true] with any aria-haspopup, or data-open) takes the pressed plate if plate-shaped and the hover edge if field-shaped, never the focus edge; written once in button.css and the field chrome.
- **Today.** Button gets its pressed plate only for aria-haspopup=menu (button.css:166), nothing for dialog or listbox; Custom select ghost takes the selected plate (its comment says pressed), outline and soft the hover edge; Date picker the focus edge (rendered: an open Combobox shows a 2 px ring, Custom select none); Toggletip the active plate; Breadcrumb ellipsis the hover plate; Nav row actions nothing.
- **Change.** One selector; cohesion test.
- **Families.** button, custom-select, date-picker, combobox, toggletip, breadcrumb, model-picker, zoom-control, split-button, nav, hover-card.
- **Findings.** S3.
- **Depends on** nothing; **unblocks** nothing named.
- **Risk.** None.
- **Verified by.** F1 open-state tiles; cohesion test.
- **Docs and skills.** DESIGN_SYSTEM Shared state paint.

#### B7.2 · Press shows on a selected or current item

*fix · quick win · size S · evidence source, confidence high · seen by source · build*

- **Rule.** Press shows on every item, selected included: a click on the current item is still a click, which is what the press-room derivation was built for.
- **Today.** Nav, Tabs plate, List box grid and Pagination press over selected; Menu item, Tree view, Table, Calendar, Approval and Button toggle exclude it.
- **Change.** Remove the [data-selected] / [aria-current] exclusions; cohesion test.
- **Families.** menu, tree-view, table, calendar, approval, button, nav, tabs, list-box, pagination.
- **Findings.** S4.
- **Depends on** nothing; **unblocks** nothing named.
- **Risk.** Button toggle's comment chose no wash on an on toggle: owner glance.
- **Verified by.** Cohesion test.
- **Docs and skills.** Shared state paint.

#### B7.3 · Every hover plate has a pressed plate

*fix · quick win · size S · evidence source, confidence high · seen by source · build*

- **Rule.** Every hover plate has a pressed plate one step past it, enforced by pairing :hover and :active background rules.
- **Today.** Native Select options, soft Checkbox and Radio rows, Editable text preview, Color swatch cells, the Tree view chevron plate, Step rows and the Video player start have hover without press.
- **Change.** Add the pressed rules.
- **Families.** select, checkbox, radio, editable-text, color-swatch-picker, tree-view, step, video-player.
- **Findings.** S5.
- **Depends on** nothing; **unblocks** nothing named.
- **Risk.** None.
- **Verified by.** Cohesion test.
- **Docs and skills.** Shared state paint.

#### B7.4 · Literal fills become roles

*fix · size S · evidence source, confidence high · seen by source · build*

- **Rule.** A fill a setting should move reads a role: bg-pressed-track (the pressed wash capped where muted text keeps 4.5:1 on a control fill) and bg-mark-pressed; Tag's neutral plate reads hue-neutral-bg; Skeleton's light fill the layer roles; Diff and Code block added/removed lines share one role pair. Justified literals (media chrome, colour-picker gradients, Slider grip, Split button's on-solid seam, Button solid press mixes, masks) are marked spec. Selected text on an inverse or dark island reads a scoped --area-selection-ink (base.css forces fg-default today, so selected words on the light theme's inverse Tooltip go near-black on near-black).
- **Today.** Segmented pressed light-dark(#00000013, #fcfcfc2a), Board add #00000013, Chip input rgb(0 0 0 / .154): Pressed fill, Layers and Tint don't move them; soft Toggle group presses to the selected wash while its twin presses to a literal; Tag rgb(42 28 0 / .07); Skeleton rgb(143 143 143 / .1, .16); Property list opacity 0.4 / 0.5; Diff's tone solid at 14 / 24% against Code block's success-surface.
- **Change.** Two derived roles in base.ts (paired, not registered with @property); families read them.
- **Families.** segmented, toggle-group, board, chip, tag, skeleton, property-list, edit-summary, code-block.
- **Findings.** S6, S20, S19.
- **Depends on** nothing; **unblocks** nothing named.
- **Risk.** Derivations of existing settings, not new settings.
- **Verified by.** Literal-colour lint.
- **Docs and skills.** DESIGN_SYSTEM roles; emit/base.ts.

#### B7.5 · The Selection setting reaches the Splitter

*fix · quick win · size S · evidence source, confidence high · seen by source · build*

- **Rule.** Nothing reads the raw accent except the documented unseen dots.
- **Today.** Splitter's and Panel resize's drag line is accent-indicator (splitter.css:114): blue at Selection Neutral.
- **Change.** Drag ink focus-color (already its keyboard ink) or stroke-selected.
- **Families.** splitter, panel.
- **Findings.** S8.
- **Depends on** nothing; **unblocks** nothing named.
- **Risk.** None.
- **Verified by.** Accent-read lint.
- **Docs and skills.** DESIGN_SYSTEM:175–180.

#### B7.6 · A chosen tile or swatch is drawn one way

*fix · size S · evidence mixed, confidence medium · seen by source + rendered · build*

- **Rule.** A chosen cell in a grid of swatches or pictures draws the selected edge (selected-width, stroke-selected, inside, selected-tint under it); a grid of glyphs or words takes the plate.
- **Today.** Choice cards, Asset and Design card and the Custom select grid use stroke-selected; Color swatch picker an inset space-2 ring in fg-selection (the Selected edge setting doesn't reach it), its Palette layout a white inner ring plus an accent edge; List box swatches the wash; Alignment picker the dot only; File tile a 2.7% plate, hard to see in light.
- **Change.** Swatch picker and File tile take the selected edge; List box grid keeps the plate for glyphs; Alignment picker stated as a glyph grid.
- **Families.** color-swatch-picker, list-box, alignment-picker, file-tile, asset-card, design-card.
- **Findings.** S9, VN21, VC23.
- **Depends on** nothing; **unblocks** B7.13.
- **Risk.** The swatch ring carries an iOS spec note.
- **Verified by.** F1 selected tiles.
- **Docs and skills.** Shared state paint.

#### B7.7 · How a value picker shows its value

*decision · size S · evidence source, confidence high · seen by source · decide*

- **Rule.** Owner decision (custom-select.md Q3 chose the check alone for native Select).
- **Today.** DESIGN_SYSTEM:276 says active plate + check; Combobox, Custom select and List box do; native Select shows the check alone in currentColor (Menu's check is fg-selection), its group label 11 / 400, its disabled option dims by ink.
- **Change.** In both options Select's check takes fg-selection, its label Menu's (A9.4), disabled by opacity (B7.8), options 1 apart (B2.1).
- **Families.** select, combobox, custom-select, list-box.
- **Findings.** S10.
- **Depends on** nothing; **unblocks** nothing named.
- **Risk.** undefined
- **Verified by.** F1.
- **Docs and skills.** DESIGN_SYSTEM:276; custom-select.md.

- **Options** (§7): Plate + check everywhere (recommended); Check alone everywhere.

#### B7.8 · Disabled one way, by shape

*fix · quick win · size S · evidence mixed, confidence medium · seen by source · build*

- **Rule.** A field-shaped box uses field paint and its parts fg-disabled; everything else dims by opacity-disabled, cells and options included; a label outside the control and every description keep their inks.
- **Today.** Calendar days, Select options, Setting row label and description, Number field steps, Input actions and Time field segments dim by ink; Property list a literal 0.5; Setting row paints its description (its reason) fg-disabled, against CONTRAST.md:145.
- **Change.** Calendar days and Select options to opacity; Property list reads the token; Setting row's description stays muted and its label goes muted as Field's.
- **Families.** calendar, select, setting-row, number-field, input, time-field, property-list, custom-select, date-picker, field.
- **Findings.** S11, T17.
- **Depends on** nothing; **unblocks** B7.9.
- **Risk.** None.
- **Verified by.** Cohesion list.
- **Docs and skills.** DESIGN_SYSTEM:293; CONTRAST.md:145.

#### B7.9 · Disabled toned solids

*decision · size S · evidence reference, confidence medium · seen by reference · decide*

- **Rule.** Owner decision (opacity was the owner's choice): whether a disabled accent or status solid repaints to the neutral soft fill.
- **Today.** Opacity 0.5 dims a disabled blue or red Button to a lighter brand or danger button; Material, Spectrum, Primer, Fluent, Carbon and Radix repaint to neutral; shadcn and Untitled dim.
- **Change.** Option: toned fills drop to the neutral soft fill with fg-disabled; neutral controls keep the dim.
- **Families.** button, split-button, badge.
- **Findings.** RD7.
- **Depends on** B7.8; **unblocks** nothing named.
- **Risk.** undefined
- **Verified by.** Review tile.
- **Docs and skills.** DESIGN_SYSTEM:293.

- **Options** (§7): Repaint toned solids (recommended); Keep the dim.

#### B7.10 · Read-only is visible and keeps the chosen state

*fix · size S · evidence source, confidence medium · seen by source · build*

- **Rule.** Read-only keeps every state's paint (checked keeps its edge) and drops only hover and press; fields take one quiet cue (border-faint or a muted chevron); one spelling, data-read-only.
- **Today.** Read-only changes only the cursor on eight fields; a checked read-only choice card loses its selected edge (choice.css:209); Radio group spells data-readonly.
- **Change.** As the rule; CONTRAST.md:156 met.
- **Families.** input, number-field, otp-field, tag-picker, custom-select, date-picker, switch, time-field, checkbox, radio.
- **Findings.** S22.
- **Depends on** B3.1; **unblocks** nothing named.
- **Risk.** The field cue is a small design call.
- **Verified by.** Read-only review tiles.
- **Docs and skills.** CONTRAST.md:156.

#### B7.11 · One hover-reveal mechanism

*fix · quick win · size S · evidence source, confidence high · seen by source · build*

- **Rule.** Hover-revealed content hides only inside @media (hover: hover), so touch never hides it.
- **Today.** Half the reveals stay unwrapped with a hover: none rule (Attachment, Message, Nav chevron, Panel chevron, Queue, Prompt suggestions, Property list, Step, Card overlay, Tree actions, Edit summary, Asset card); half use the media query.
- **Change.** Convert the first group (each drops a rule); DESIGN_SYSTEM:268 rewritten.
- **Families.** attachment, message, nav, panel, queue, prompt-suggestions, property-list, step, card, tree-view, edit-summary, asset-card.
- **Findings.** S24.
- **Depends on** nothing; **unblocks** nothing named.
- **Risk.** None.
- **Verified by.** Cohesion test.
- **Docs and skills.** DESIGN_SYSTEM:268.

#### B7.12 · An inactive row dims as a whole

*fix · size S · evidence rendered, confidence medium · seen by rendered · build*

- **Rule.** A dimmed row dims as a whole; its reason line stays legible in muted ink without extra opacity and is never darker than its title.
- **Today.** Menu's inactive title is opacity 0.5 over L0.277 (≈ L0.64) while its note stays L0.510 at full strength (recorded: “the note is read to know why”): the note is darker than the title.
- **Change.** Title and note both muted (or both full with a lock mark).
- **Families.** menu, context-menu.
- **Findings.** VN11.
- **Depends on** nothing; **unblocks** nothing named.
- **Risk.** Revisits a recorded reason, keeping it legible.
- **Verified by.** F1.
- **Docs and skills.** menu.md.

#### B7.13 · Selection as a scope

*capability · size M · evidence reference, confidence medium · seen by reference · later*

- **Rule.** A documented data-selected scope re-points the ink roles to the selection roles, so every child of a selected row repaints without its own rule; a hovered group lights its ghost children.
- **Today.** Selected paint is written per component; Figma remaps its colour roles under [data-fpl-selected].
- **Change.** The scope in base.css; families migrate on reopen.
- **Families.** nav, tree-view, table, list-box, menu.
- **Findings.** RF14.
- **Depends on** B7.6; **unblocks** nothing named.
- **Risk.** Re-emit at scope boundaries.
- **Verified by.** Token scope test.
- **Docs and skills.** THEMING scopes.

#### B8.1 · Twins share one recipe

*fix · size S · evidence mixed, confidence high · seen by source + rendered · build*

- **Rule.** Segmented and soft Toggle group share one track recipe (corner, inset, edge width border-width, pill hook, pressed, thumb), as Button group shares Button's; Tabs switch panels in place and a strip of places is Nav horizontal; Checkbox, Radio and Switch offer one size set or the specs say why.
- **Today.** Segmented's track reads stroke-width and the pill-segmented hook, Toggle group's border-width and no pill hook (latent: identical at the defaults, they part at Stroke 0 or 2); two tab strips (Tabs with plate, status, unseen; Nav horizontal with closes); Checkbox and Radio md / lg, Switch sm / md / lg.
- **Change.** One recipe; COMPONENTS § Boundaries gains the Tabs / Nav rule (document tabs' close, dirty, pinned go on Nav horizontal); choice sizes stated.
- **Families.** segmented, toggle-group, tabs, nav, checkbox, radio, switch.
- **Findings.** S7, B-S6, VA10.
- **Depends on** nothing; **unblocks** E11.
- **Risk.** None at defaults.
- **Verified by.** Stroke 0 and 2 tiles.
- **Docs and skills.** COMPONENTS Boundaries; segmented.md.

#### B8.2 · Spacing that ignores density beside peers that follow it

*fix · size M · evidence source, confidence high · seen by source + reference · build*

- **Rule.** Space between two pieces of UI reads a density role; a fixed value only for a mark, a hit area, a platform constant or a measured media size, with a spec line “at every density”; literals become tokens.
- **Today.** Asset row pad 8, gap 12, row 56; Board card and add row 8 10, column header 18; Setting row text → control 16 (Cursor's is 20); Page header actions 8 and 16; Stepper and Timeline 12; Tabs lg 24; OTP slots 8; Alert icon gaps 8 vs Toast ui-cluster; Menu two-line block 6; Empty state 16 / 24 / 12; Drawer stacked footer 8; Toaster 8; Table caption 12; Shortcut list groups 32.
- **Change.** Each to its density role (−2 / 0 / +2 or −4 / 0 / +4 at 28 / 32 / 36; nothing moves at Default); Setting row gap → inset-surface-md, with Cursor's 20 noted for the owner.
- **Families.** asset-row, board, setting-row, page-header, stepper, timeline, tabs, otp-field, alert, menu, empty-state, drawer, toast, table, shortcut-list.
- **Findings.** G8, RC19.
- **Depends on** A1.1; **unblocks** nothing named.
- **Risk.** Each was a spec decision: owner confirms per family at Compact and Comfortable.
- **Verified by.** F1 at three densities.
- **Docs and skills.** each spec; DESIGN_SYSTEM Size and shape.

### C. Behaviour engine (Phase 3)

#### C1.1 · One menu engine with submenu intent

*fix · size M · evidence source, confidence high · seen by source + reference · build*

- **Rule.** One useMenuNavigation for every role=menu surface (keys, typeahead from C2.1, pointer → focus sync, pointer-leave returns focus to the surface, one choose / keep-open rule, one item selector) and one usePointerIntent: a submenu opens after 100 ms of rest (at once on click or key); a safe triangle with a 5 px bleed suppresses the parent's pointer focus and close for up to 300 ms; Hover card reuses it with a 500 ms patient click.
- **Today.** MenuSub opens on pointerenter at once and closes on any sibling focusin, while the parent focuses every row the pointer crosses: a diagonal move closes the submenu and brushing a menu flashes every submenu. Five engines (AnchoredMenu, hosted Menu, MenuSub, Split button, Context menu): pointer sync in one only, so two rows highlight; three Tab behaviours; four item selectors (Split button skips checkbox and radio rows); “choose closes” written three times. Radix 100 + polygon 300, Base UI 100, React Aria 200, Ariakit 150.
- **Change.** Hooks in overlay.ts; every menu host adopts; MOTION.md gains a Submenu row.
- **Families.** menu, context-menu, split-button, model-picker, toolbar, zoom-control, time-field, breadcrumb, composer-menu, hover-card.
- **Findings.** I1, RB1, I2, RB16.
- **Depends on** F2, C2.1; **unblocks** C1.2, C1.3.
- **Risk.** Behaviour regressions: F2 suites first.
- **Verified by.** F2 menu suite (diagonal path, Tab, typeahead).
- **Docs and skills.** MOTION.md; overlay.md; area-interaction-pass.

#### C1.2 · Choosers act on pointer-down; press-drag-release picks

*fix · size M · evidence reference, confidence high · seen by reference · build*

- **Rule.** Menus, selects, tabs and segmented act on pointerdown (left button, no modifier) and support press-drag-release (arm after 200 ms or 5 px, ignore a release within 10 px); click stays for touch and keyboard.
- **Today.** Menu toggles on click via popovertarget; Custom select opens on click; Tabs select on click: one press slower than Radix and macOS, no drag-to-pick.
- **Change.** usePressToOpen; Tabs and Segmented on mousedown.
- **Families.** menu, custom-select, split-button, tabs, segmented, model-picker.
- **Findings.** RB7.
- **Depends on** C1.1; **unblocks** nothing named.
- **Risk.** popovertarget fires on click: guard double toggles.
- **Verified by.** F2.
- **Docs and skills.** overlay.md.

#### C1.3 · An outside press under an open menu

*decision · size S · evidence reference, confidence medium · seen by reference · decide*

- **Rule.** Owner decision, stated in docs/specs/overlay.md either way.
- **Today.** popover=auto lets the dismissing press also activate what is under it; Radix modal menus and macOS swallow it.
- **Change.** Option: intercept the first outside pointerdown while a menu is open.
- **Families.** menu, context-menu, split-button.
- **Findings.** RB18.
- **Depends on** C1.1; **unblocks** nothing named.
- **Risk.** undefined
- **Verified by.** F2.
- **Docs and skills.** overlay.md.

- **Options** (§7): Swallow (recommended); Pass through.

#### C2.1 · One list navigation and one typeahead

*fix · size L · evidence source, confidence high · seen by source + reference · build*

- **Rule.** useListNavigation (active index, wrap, Home/End, PageUp/Down, disabled skip, activedescendant or roving) and useGridNavigation (the app's grid-keys.ts) for every list family; createTypeahead with one reset window, repeated-letter cycling, Space inside a run and a textValue fallback.
- **Today.** role=listbox is drawn by six families; ArrowDown is handled in 21 files and Home/End in 14; typeahead five ways (1000 ms in Menu, List box, Tree; 500 in Custom select, which alone cycles “a a a”); Menu builds “aa” and finds nothing; Tree assumes a string label.
- **Change.** Hooks in overlay.ts tested once in F2; families adopt one per PR.
- **Families.** menu, context-menu, split-button, model-picker, toolbar, list-box, tree-view, custom-select, combobox, tag-picker, command-palette, composer-menu.
- **Findings.** B-S4, I5, RB8.
- **Depends on** F2, C6; **unblocks** C1.1, C7.1, E1.3.
- **Risk.** The largest behaviour change.
- **Verified by.** F2 list suite per family.
- **Docs and skills.** ARCHITECTURE hooks.

#### C2.2 · One roving-focus model

*fix · size M · evidence source, confidence high · seen by source + reference · build*

- **Rule.** useRovingFocus(container, { orientation, loop, rtl, remember }) writes item tabIndex for Toolbar, Toggle group, Segmented, Tabs, List box and Tree view: one Tab stop per composite, arrows by orientation; row actions in a tree are tabIndex −1, reached with →; Accordion gains optional ↑/↓/Home/End; Tree * expands siblings.
- **Today.** Three models: item tabIndex; root forwarding in Toolbar (mutating root.tabIndex behind React) and Toggle group, so Shift+Tab lands on the container and an empty toolbar is a stop; activedescendant for fields. Segmented and Toggle group take both axes, Tabs and Toolbar one; Tree row actions are extra Tab stops.
- **Change.** Hook and adoption.
- **Families.** toolbar, toggle-group, segmented, tabs, list-box, tree-view, accordion.
- **Findings.** I13, I31, RB20.
- **Depends on** F2; **unblocks** nothing named.
- **Risk.** Keyboard regressions: F2.
- **Verified by.** F2.
- **Docs and skills.** area-a11y-audit.

#### C2.3 · List family key fixes

*fix · quick win · size S · evidence source, confidence high · seen by source + reference · build*

- **Rule.** Tags use onDismiss and are reached with ← from the empty field (Backspace/Delete removes); group ids come from the index; Command palette also takes Ctrl+N/P and Ctrl+J/K.
- **Today.** Tag picker passes the deprecated onRemove/removeLabel and makes every tag a Tab stop; Combobox builds group ids from label text (“Recent files” → an id with a space, so the group is unnamed); the palette has ↑/↓ and Ctrl+Home/End only.
- **Change.** As the rule.
- **Families.** tag-picker, combobox, command-palette.
- **Findings.** I28, I20, RB21.
- **Depends on** nothing; **unblocks** nothing named.
- **Risk.** None.
- **Verified by.** F2.
- **Docs and skills.** tag-picker.md; combobox.md.

#### C3 · useFormField: required, reset, name and value

*fix · size M · evidence source, confidence high · seen by source · build*

- **Rule.** Every value family renders one visually hidden, tabIndex −1, aria-hidden native control that carries name, required and setCustomValidity, focuses the visible control on invalid and owns the reset listener.
- **Today.** Hidden inputs can't be required: Custom select sets only aria-required; Combobox, Date picker, Date range picker, Tag picker, Time field, Segmented and Toggle group have no required, so forms submit empty; 14 files copy one reset block; OTP, Search, Time field, Date range picker, Slider range, Box field and Toggle group ignore form reset.
- **Change.** The hook in forms.tsx; a cohesion test for reset and required on every family with name.
- **Families.** custom-select, combobox, date-picker, date-range-picker, tag-picker, time-field, segmented, toggle-group, otp-field, search-field, box-field.
- **Findings.** I6.
- **Depends on** F2, B3.1; **unblocks** nothing named.
- **Risk.** Native validation bubbles appear where none did.
- **Verified by.** F2 form suite.
- **Docs and skills.** DESIGN_SYSTEM form contract.

#### C4 · Text-entry guards

*fix · quick win · size S · evidence source, confidence high · seen by source + reference · build*

- **Rule.** Every Enter handler on a text input calls one composing(event) helper (isComposing || keyCode 229); Number field's scrub rebases its origin when a modifier changes (optional pointer lock).
- **Today.** Command palette's Enter runs the highlighted command while a CJK candidate is confirmed; Approval's “instead” field submits the same way; Color field commits mid-composition; Date picker, Editable text and Zoom control miss 229; pressing Shift halfway through a scrub multiplies the whole travel.
- **Change.** Helper + cohesion test; scrub rebase.
- **Families.** command-palette, approval, color-field, date-picker, editable-text, zoom-control, number-field, composer.
- **Findings.** I7, RB2, I12.
- **Depends on** nothing; **unblocks** nothing named.
- **Risk.** None for Latin input.
- **Verified by.** F2 IME suite.
- **Docs and skills.** forms.tsx; area-a11y-audit.

#### C5.1 · Toasts above every modal, paused when unseen

*fix · quick win · size S · evidence source, confidence high · seen by source + reference · build*

- **Rule.** The toast region is popover=manual and re-shown when a toast is added (the newest top-layer entry), and moves into an open modal as the announcer does; timers pause on visibilitychange and window blur and resume with the remaining time.
- **Today.** .area-toaster is position fixed with a z-index (verified surface.css:1696), a plain section, while every modal and popover is in the top layer: a toast raised during a dialog renders under the backdrop, inert (Undo can't be pressed, F8 can't reach it); timers pause only on region hover and focus, so toasts expire while the window is in the background.
- **Change.** As the rule.
- **Families.** toast, dialog, drawer, command-palette.
- **Findings.** I3, I30, RB6.
- **Depends on** nothing; **unblocks** E10.
- **Risk.** Top-layer order with nested popovers: F2.
- **Verified by.** F2: a toast actionable over a dialog.
- **Docs and skills.** toast.md; DESIGN_SYSTEM Announcements.

#### C5.2 · Arrows point at their trigger; anchored surfaces leave with their anchor

*fix · size M · evidence source, confidence high · seen by source + reference · build*

- **Rule.** The engine writes the anchor's cross-axis centre as --area-overlay-arrow (clamped to corner + half the arrow); when the anchor is clipped by its scroll ancestor, tooltips and hover cards close and menus set data-anchor-hidden; Context menu closes on scroll and resize; direction and paddings read once per open; CSS anchor positioning progressively.
- **Today.** Arrows sit at 50% on every side, so align=start, Hover card's default and edge-shifted surfaces point at nothing (originX/Y is computed but only written to transform-origin); a menu whose trigger scrolled away stays pinned at the viewport edge; Context menu is placed once; getComputedStyle(anchor).direction on every placement.
- **Change.** As the rule.
- **Families.** popover, tooltip, hover-card, menu, context-menu, custom-select, combobox.
- **Findings.** I4, I19, RB10, I32.
- **Depends on** nothing; **unblocks** nothing named.
- **Risk.** Keep JS side detection outside Chromium.
- **Verified by.** F2 placement suite.
- **Docs and skills.** overlay.md.

#### C5.3 · Modal parity

*fix · quick win · size S · evidence source, confidence high · seen by source + reference · build*

- **Rule.** One modal rule for Dialog, Drawer and Command palette (scroll lock with scrollbar-gutter: stable) and one useModalDialog hook (sync showModal/close, close only when the press began on the backdrop, exit wait via getAnimations); initial focus [autofocus], else the body's first control, else the least destructive footer action, else the surface, never the close; the palette's hotkey effect has deps, ignores repeat and skips while another modal is open.
- **Today.** The palette closes on any click whose target is the dialog (a selection dragged out of the field closes it) and has no scroll lock; overflow hidden on html with no scrollbar-gutter shifts the page; Dialog and Drawer open with focus on the X; the palette's hotkey effect re-subscribes every render and fires while typing.
- **Change.** As the rule.
- **Families.** dialog, drawer, command-palette, popover, confirm-dialog.
- **Findings.** I14, RB11, I15, I29.
- **Depends on** F2; **unblocks** C5.4.
- **Risk.** None.
- **Verified by.** F2 modal suite.
- **Docs and skills.** dialog.md.

#### C5.4 · Whether an alert dialog closes on a backdrop press

*decision · size S · evidence source, confidence high · seen by reference · decide*

- **Rule.** Owner decision: ConfirmDialog.tsx's doc comment states that Escape, Cancel and the backdrop close it.
- **Today.** Confirm dialog closes on a backdrop press (verified ConfirmDialog.tsx:34–35); Radix's alert dialog and the APG never close on an outside press.
- **Change.** Option: Dialog gets dismissOnBackdrop (default true) and ConfirmDialog passes false; later native closedby.
- **Families.** confirm-dialog, dialog.
- **Findings.** RB5.
- **Depends on** C5.3; **unblocks** nothing named.
- **Risk.** undefined
- **Verified by.** F2.
- **Docs and skills.** confirm-dialog.md.

- **Options** (§7): Buttons or Escape only (recommended); Keep the backdrop close.

#### C5.5 · Focus continuity

*fix · quick win · size S · evidence source, confidence high · seen by source · build*

- **Rule.** Hover card closes on blur only when focus leaves both trigger and card, and Escape returns focus; a focused control that removes itself hands focus on (Selection bar's rescue as useFocusRescue: the next toast or the region's origin; a neighbouring chip or tag, else the group); a Scroll area viewport is a Tab stop only while it overflows.
- **Today.** Tab from a Hover card trigger into its first link closes the card; dismissing a Toast, Chip, Tag, Attachment, Alert or Prompt suggestion drops focus to the page; every standalone Scroll area is an empty Tab stop when its content fits.
- **Change.** As the rule.
- **Families.** hover-card, mention, citation, toast, chip, tag, attachment, alert, prompt-suggestions, scroll-area.
- **Findings.** I8, I16, I23.
- **Depends on** nothing; **unblocks** nothing named.
- **Risk.** None.
- **Verified by.** F2.
- **Docs and skills.** area-a11y-audit.

#### C5.6 · Tooltip timing

*decision · size S · evidence reference, confidence medium · seen by reference · decide*

- **Rule.** Owner decision: the first open delay, and whether a tooltip naming an icon-only control opens sooner than a descriptive one. In every option tooltips close on any ancestor scroll and use popover=hint where it fits.
- **Today.** 500 open, 300 skip window, 0 close (Overlays.tsx:26–28); no scroll dismissal. Claude 300, Cursor's most common 300, ChatGPT 150, Figma's shell hover cards 500; Radix 700, Base UI 600, Ariakit 500, React Aria 1500.
- **Change.** See options.
- **Families.** tooltip, toggletip, button, toolbar.
- **Findings.** RC11, RF6, RB22.
- **Depends on** C6; **unblocks** nothing named.
- **Risk.** undefined
- **Verified by.** F2 timing.
- **Docs and skills.** MOTION.md Timing.

- **Options** (§7): 300 for every tooltip (recommended); 150 name-only, 500 descriptive; Keep 500.

#### C6 · Timing constants in one place

*fix · quick win · size S · evidence source, confidence high · seen by source + reference · build*

- **Rule.** timing.ts exports TOOLTIP, HOVER_CARD, SUBMENU, TYPEAHEAD, LONG_PRESS, PRESS_REPEAT, DRAG_THRESHOLD, TOAST, LOADING (show 300 / 1000, minimum visible 400) and SASH_REST; MOTION.md gains a Timing table; components import, never write literals.
- **Today.** Tooltip 500 / 300 / 0, Hover card 700 / 300 inline, typeahead 1000 vs 500, Scroll area hide 600, Video idle 2000, repeat 400 / 60, LOADING_DELAY 300 / 1000 with no minimum visible time (a load finishing at 320 flashes a spinner for 20 ms), Toaster 5000, Splitter's sash 300 in CSS.
- **Change.** The module + a cohesion test; useLoadingDelay(delay, { min: 400 }) for Button loading, Spinner and Skeleton.
- **Families.** tooltip, hover-card, menu, list-box, tree-view, custom-select, number-field, scroll-area, video-player, toast, button, spinner, skeleton, splitter.
- **Findings.** I24, RB15, RB9.
- **Depends on** nothing; **unblocks** C2.1, C5.6.
- **Risk.** None.
- **Verified by.** Cohesion test.
- **Docs and skills.** MOTION.md Timing.

#### C7.1 · Runtime performance

*fix · size L · evidence source, confidence high · seen by source · build*

- **Rule.** Scroll handlers coalesce to one frame; measuring effects key on values, not arrays; drags batch moves per frame, cancel on window Escape and expose a commit callback; rows are memoised with a state/actions context split; content-visibility on long lists, then opt-in virtualisation that keeps activedescendant, roving focus and setsize/posinset; one exported useIsoLayoutEffect.
- **Today.** Scroll area runs two getComputedStyle, scroll reads and attribute toggles per scroll event inside every menu and drawer; Tabs and Segmented re-measure on every parent render with inline items; Splitter and Panel resize commit every pointermove (Panel measures scaled rects); Color picker emits per move with no onValueCommit; Property list rebuilds its context per move; Splitter's Escape can't fire on a pointer drag; no React.memo and no windowing anywhere (Tree view re-renders every row on focus, List box's context every option, O(n²) grouping in Combobox and Custom select); raw useLayoutEffect in 15 files and two private iso copies.
- **Change.** rAF coalesce; signature keys; useDrag with onSizeCommit / onWidthCommit / onValueCommit; memo rows; content-visibility; virtualize on List box, Tree view, Custom select, Combobox and Command palette; a lint bans raw useLayoutEffect.
- **Families.** scroll-area, tabs, segmented, code-block, splitter, panel, color-picker, property-list, tree-view, list-box, combobox, custom-select, command-palette, menu.
- **Findings.** I9, I10, I11, I17, I21.
- **Depends on** C2.1, F2; **unblocks** E5.
- **Risk.** Virtualisation must keep a11y semantics: ship content-visibility first.
- **Verified by.** Traces on a 5,000-row Tree view and List box; F2.
- **Docs and skills.** MOTION.md commit rule; ARCHITECTURE.

#### C7.2 · Delivery: minified, per-component CSS and a side-effect-free import

*fix · size M · evidence source, confidence high · seen by source · build*

- **Rule.** Published CSS is minified; per-component and per-axis entries exist for apps that pin a theme; importing React installs no listeners until first use.
- **Today.** packages/styles/dist/area.css is 3,376,156 bytes (verified; 518,880 gzipped): axes.css 1.63 MB of every preset, components 1.22 MB with comments; build.mjs parses with esbuild but writes the unminified source (verified); exports only area.css; Overlays.tsx installs window listeners at import under sideEffects: false. packages/output already prunes the axes sheet per system.
- **Change.** Write esbuild's minified output; @area/styles/components/*.css and per-axis entries (after F9); Overlays listeners on first tooltip mount.
- **Families.** all.
- **Findings.** I18, BL-T1.
- **Depends on** F9; **unblocks** nothing named.
- **Risk.** Keep source maps.
- **Verified by.** Bundle-size check in CI.
- **Docs and skills.** ARCHITECTURE § Output.

#### C8 · Family behaviour fixes

*fix · size M · evidence source, confidence medium · seen by reference + source · build*

- **Rule.** Splitter Enter collapses / restores where the pane is collapsible (double-click still evens); Video player's seek and volume compose Area's Slider (glide, Shift × 10, commit, buffered); Dialog's scrolled header from scroll-state() where it removes a re-render.
- **Today.** Splitter Enter evens the panes (APG uses it to collapse); Video player uses raw range inputs with their own CSS; Dialog sets data-scrolled from a JS onScroll.
- **Change.** As the rule.
- **Families.** splitter, video-player, dialog.
- **Findings.** RB19, I25, RB23.
- **Depends on** nothing; **unblocks** nothing named.
- **Risk.** Splitter Enter changes a documented key.
- **Verified by.** F2.
- **Docs and skills.** splitter.md; video-player.md.

### D. Family defects (Phase 4)

#### D1 · Navigation and tabs round

*fix · quick win · size S · evidence rendered, confidence high · seen by rendered · build*

- **Rule.** A revealed control never covers text that would fit; a plate selection in a strip hangs its plate so the first label sits on the content column; a grid heading sits on the cell or icon edge and the grid fills by auto-fill; soft = fill + soft edge, outline = control edge.
- **Today.** A closable current Nav tab hugs its label, so its revealed close covers 18 px of “Item one”; plate Tabs start their plate at the panel edge, putting the label 10 right of the body text, while underline Tabs and Nav hang; List box grid heading at a 10 inset over cells at 0, with 34 px dead at the end; Token row's soft style carries a darker edge than Outline.
- **Change.** Closable tab minimum label + gap + close (~22 px wider when current); plate Tabs hang by their padding (the 2026-11-06 plate pick did not discuss hang); grid heading and auto-fill; Token row's edges swapped.
- **Families.** nav, tabs, list-box, token-row.
- **Findings.** VN2, VN10, VN20, VN18.
- **Depends on** B2.1; **unblocks** nothing named.
- **Risk.** Plate hang: owner glance.
- **Verified by.** F1.
- **Docs and skills.** nav.md, tabs.md, list-box.md, token-row.md.

#### D2 · Content and data round

*fix · size M · evidence rendered, confidence high · seen by rendered + source · build*

- **Rule.** A design's scale is min(1, (ground − 2·pad)/design) on both axes; chart text stays inside its viewport (end ticks anchor start/end); scrolling table cells don't wrap by default and a sticky column takes min-content; code in a fixed table never breaks; one accordion title style, default size and chevron convention; artwork edges at least edge-control in both themes. A skeleton text bar is about the role's cap height (rounded) with corner min(height/2, radius-small); a block inherits its container's corner.
- **Today.** Design card's held design overflows its ground (a black bar, no card) and Asset card's group mosaic scales type to 7 px; Chart's last x tick is cut (“Nov 7” → “Nov”); Table's sticky first column wraps (rows 59 vs 39); Table header 13/20 400 muted on a band, body on a 20 line, framed only; a fixed table at 268 splits code (kit gap 2); Accordion plain md title equals its body (15/22/400), divided defaults to sm, chevrons down = open in one and up = open in the other; Folder, File page and File image faint, folders near-black shapes in dark. Skeleton draws every shape at corner 4 and a text bar as tall as the font size (a 52-tall slab for Display).
- **Change.** Each fixed; Table header 500 muted, body line 18 and a frame=none flush layout as owner proposals (VC12, through intake); Accordion one 500 title, one default size, down = open.
- **Families.** design-card, asset-card, chart, table, accordion, folder, file-page, file-image, skeleton.
- **Findings.** VC1, VC2, VC10, VC12, VC15, VC22, BL-kit2, VS21.
- **Depends on** A9.12, B1.1; **unblocks** nothing named.
- **Risk.** The flush table is a new layout value.
- **Verified by.** F1 extent and clip checks.
- **Docs and skills.** design-card.md, chart.md, table.md, accordion.md, folder.md.

#### D3 · Conversation round

*fix · size M · evidence rendered, confidence high · seen by rendered · build*

- **Rule.** Code numbers align to a wrapped line's first line; a divider notice is full width with one-line text; a composer's stacked parts share its glyph column and pills; a menu over the composer is its width with the group gap 8; an empty state's single action is outline (solid when primary), never ghost; answered states drop their hint; message actions are hidden while streaming; an attachment card is content height with a meta line.
- **Today.** Code block numbers a wrapped line at its middle; its filename aligns to neither column; code 13/18 mono; Turn notice collapses to 75 wide and wraps; Composer's footer note is centred, its footer buttons square (corner 8) under pill headers, its + glyph 2 px off the shell's; the one-line composer pairs circles with a 19 corner (the owner chose Cursor's 20 with pills); Composer menu 278 beside a 280 composer, 7 above it, corner 14 vs 19; Empty state's Panel layout ghost action reads as text; Approval answered still says “Esc to cancel”; Message's six actions render while streaming; Attachment's file card 160 × 64 with 18 px empty and “PDF” twice.
- **Change.** Each fixed; code size 12 at md as an owner check; the one-line composer becomes a pill when Pills › Composer is on, or the exception is recorded.
- **Families.** code-block, edit-summary, turn-notice, composer, composer-menu, empty-state, approval, attachment, message.
- **Findings.** VS3, VS4, VS8, VS9, VS15, VS16, VS20, VS22, VS23.
- **Depends on** B1.3, A4, A10.1; **unblocks** nothing named.
- **Risk.** VS9 and the code size are owner glances.
- **Verified by.** F1.
- **Docs and skills.** chat set specs.

#### D4 · Fields and pickers round

*fix · quick win · size S · evidence rendered, confidence high · seen by rendered + source · build*

- **Rule.** A panel's content shares one column; a value's format does not change with layout; literals follow the placeholder ink while every segment is empty; wrapped marks are as far apart both ways as from the edge.
- **Today.** Date picker's panel has three left edges (input text 20 in, grid 12, footer “Clear” text 14); Color field writes “#8D4DF3” in single and “8D4DF3” in split and alpha; Time field's empty “:” is default ink between muted dashes; Tag picker's wrapped rows are 5 apart against columns 6.
- **Change.** “Clear” on the 12 column; one hex format; the literal follows placeholder ink when empty; Tag picker row gap +1.
- **Families.** date-picker, date-range-picker, color-field, time-field, tag-picker.
- **Findings.** VA11, VA19, VA13, G16.
- **Depends on** nothing; **unblocks** nothing named.
- **Risk.** None.
- **Verified by.** F1.
- **Docs and skills.** date-picker.md, color-field.md, time-field.md.

#### D5 · Carried writing and content decisions

*decision · size S · evidence source, confidence medium · seen by source · decide*

- **Rule.** Owner decisions carried from 2026-11-07 and the kit and text gaps: the toast, truncation-tooltip and reduced-motion rules where Primer disagrees (D7, D8, D9), Reference list's em dash against WRITING.md, Description list's 160 px term column.
- **Today.** Rules unchanged in WRITING.md and MOTION.md; ReferenceList.tsx:57 uses an em dash; description-list.css:16 160px.
- **Change.** Decide each and record it.
- **Families.** toast, reference-list, description-list.
- **Findings.** BL-D789, BL-kit4, BL-dl160.
- **Depends on** nothing; **unblocks** nothing named.
- **Risk.** undefined
- **Verified by.** Docs.
- **Docs and skills.** WRITING.md; MOTION.md.

- **Options** (§7): Keep Area's rules and record the Primer differences (recommended); Adopt Primer's.

#### D6 · App-side gaps recorded by the app audit

*fix · size M · evidence source, confidence medium · seen by app audit · build*

- **Rule.** Each goes through the intake ladder before anything is built: a row whose end holds a trailing action is a Setting row or button-form row slot; an icon-only control always carries a name tooltip, including inside Copy button and as a Popover trigger; Table cells are always TableCell; a flow node card is a Design card or Card composition first.
- **Today.** Recorded in worktree electron-app-audit-cleanup-35275b and not built: a button-form row with a trailing action; icon-only Copy button has no Tooltip; a Popover's icon trigger cannot take a Tooltip (one element, two popover roles); raw td mixed with TableCell; the flow node card.
- **Change.** Copy button and Popover trigger: compose Tooltip (a trigger that is both popover target and tooltip anchor, tested in F2) as a fix; the row slot, the TableCell rule and the flow node card as intake proposals.
- **Families.** copy-button, popover, tooltip, table, setting-row, design-card.
- **Findings.** AU4, AU5, AU6, AU7, AU8.
- **Depends on** F0, C5.5; **unblocks** nothing named.
- **Risk.** AU5 and AU6 are accessible-name defects (fix); AU4 and AU8 may be compositions only.
- **Verified by.** F2: every icon-only control has a name tooltip.
- **Docs and skills.** copy-button.md; popover.md; table.md.

### E. Capabilities and coverage (Phase 5)

#### E1.1 · App shell composition

*capability · size L · evidence mixed, confidence high · seen by source · build*

- **Rule.** A rung-3 composition shipped as a layout component on Titlebar, Panel and Splitter: regions with default/min/max sizes, collapse order, a layered mode, the window controls' room, a pane header with start/centre/end, an account row as a Nav item slot; Panel's maxWidth default none.
- **Today.** AppShell.tsx exports only Titlebar and Section heading; every product recreation rebuilt the shell; Titlebar has children + end and Panel's bar a title + one action (no centre); Nav items have no description line; Panel maxWidth 500.
- **Change.** AppShell, PaneHeader, a Nav item description slot, in a patterns layer built only from families.
- **Families.** titlebar, panel, splitter, nav.
- **Findings.** B-P1, BL-D4, BL-shell, BL-pane, BL-account, BL-panelmax.
- **Depends on** B4.1, F8; **unblocks** E1.4, E2.
- **Risk.** Intake: composition, no new tokens.
- **Verified by.** Recreate the four products with it.
- **Docs and skills.** area-ui-compose; COMPONENTS.

#### E1.2 · Thread composition

*capability · size M · evidence mixed, confidence medium · seen by source + rendered · build*

- **Rule.** A centred column with turn spacing (joined 2, meta 4, an attached part 8, question → reply a step less than turn → turn, e.g. 16 / 32), a docked composer with a fade, Message headings and attachments, an edited marker and branch switcher, a replaceable composer primary.
- **Today.** Message and Composer exist; the column is rewritten every time; the transcript's gaps are 24 / 24 / 16 / 2 / 4 / 10 / 8 / 20 / 8 / 7 / 24, so a reply sits as far from its question as from the next; no attachments prop, no heading part, no edited or branch state, no over-limit state; the send button is built internally; one face for reading.
- **Change.** Thread composition; Message attachments and heading role (with A9.1); Composer primary slot and over-limit state; gaps set with the owner's eye.
- **Families.** message, composer, scroll-to-latest, prompt-suggestions, toast, step.
- **Findings.** BL-thread, VS24, VS27, BL-msghead, BL-msgattach, BL-composerprimary, BL-reading.
- **Depends on** A9.1, B1.3; **unblocks** nothing named.
- **Risk.** The question → reply gap needs the owner's eye; references give turn gaps only.
- **Verified by.** A chat screen recreated.
- **Docs and skills.** area-ui-compose chat recipe.

#### E1.3 · Grid, shelf and a compact reference row

*capability · size M · evidence source, confidence medium · seen by source · build*

- **Rule.** Columns from a minimum card width (a layout component beside Stack); a shelf with paging; a 32 tile compact row as a Card size or Asset row sm; 2-D grid collections move out of app code.
- **Today.** Asset grid and File grid are List boxes for selection, not layout; Card's carousel has no paging arrows; Card thumbnail 84, Asset row 56; the app still owns grid-keys.ts.
- **Change.** Grid and Shelf compositions; one compact row value through intake.
- **Families.** card, asset-row, list-box, stack.
- **Findings.** BL-grid, BL-compactrow, BL-2dgrid.
- **Depends on** B1.1, C2.1; **unblocks** nothing named.
- **Risk.** The compact row is a new size.
- **Verified by.** Gallery and feed kit.
- **Docs and skills.** COMPONENTS candidates.

#### E1.4 · Product compositions the coverage matrix lacks

*capability · size L · evidence mixed, confidence medium · seen by source · later*

- **Rule.** Compositions before components: notifications history (Drawer or Popover + Toast rows + Empty state), find bar (Input + Toolbar + Count), status bar (Toolbar sm), comment thread (Message + Avatar + Composer sm), form validation summary (Alert + links), rating pair (Toggle group single), document blocks (a callout as an Alert layout, quote, to-do, toggle, page icon), marketing hero / nav / footer / pricing, a terminal or log view; the candidates re-ranked by product types served.
- **Today.** None exists; the Later list has aged (N8, N9, N11 and N12 each serve three or more product types).
- **Change.** Propose in rank order (structure-backlog §4.2); start only on the owner's request.
- **Families.** drawer, toast, input, toolbar, message, alert, toggle-group, card, nav.
- **Findings.** BL-N8, BL-N12, BL-statusbar, BL-comment, BL-valid, BL-rating, BL-docblocks, BL-marketing, BL-terminal, B-B4.
- **Depends on** E1.1; **unblocks** nothing named.
- **Risk.** Scope: each needs the owner's ask (AGENTS Scope).
- **Verified by.** Each as a pattern page.
- **Docs and skills.** COMPONENTS; screens.md.

#### E1.5 · Page and dashboard recipes

*capability · size S · evidence rendered, confidence medium · seen by reference · build*

- **Rule.** Composition rules, no new size: page-level underline Tabs under a Page header use size lg plus ui-cluster block padding (38 + 8 = 46); panel Tabs stay md; a dashboard recipe (margin 24, cards 16, sections 24–32) beside the feed recipe.
- **Today.** Tabs take the control height (md 30, lg 38) while products' page tab bars are 40–50 (GitHub 48, Radix 40, Geist 50); the feed system is margin 32, cards 12, sections 48 against shadcn's dashboard 24 / 16 / 24 (two products, weak).
- **Change.** Recipes in area-ui-compose and the Tabs documentation.
- **Families.** tabs, page-header, card.
- **Findings.** RL5, RL9.
- **Depends on** A1.4, A9.1; **unblocks** nothing named.
- **Risk.** None to components.
- **Verified by.** Project and system pages.
- **Docs and skills.** area-ui-compose; Tabs documentation.

#### E2 · Responsive behaviour, the mobile shell and touch gestures

*capability · size L · evidence mixed, confidence medium · seen by source + reference · later*

- **Rule.** Container-query-first rules per family, a breakpoint pair in tokens, responsive values only where a container query cannot decide (the shell); safe-area insets on the shell; Nav horizontal placement=bottom, Page header sizes, a floating Button, Drawer bottom detents and grabber; one useSwipeDismiss (40 px / 0.4 px·ms⁻¹ / reverse-cancel 10) for Toast and Drawer; touch long-press 500 ms / 10 px for Context menu.
- **Today.** No viewport props anywhere; no env(safe-area-inset-*) in packages/styles; mobile is the least covered product type (12 missing needs); no swipe and no long-press.
- **Change.** Rung by rung through intake.
- **Families.** nav, page-header, button, drawer, toast, context-menu, titlebar.
- **Findings.** B-P2, BL-D2r, B-P6, BL-safearea, RB12, RB14.
- **Depends on** E1.1, A11.2; **unblocks** nothing named.
- **Risk.** A system-wide convention: GOVERNANCE rung 6.
- **Verified by.** A phone-width recreation.
- **Docs and skills.** GOVERNANCE; area-ui-compose.

#### E3 · Scroll edge fades

*capability · size M · evidence reference, confidence high · seen by reference + source · build*

- **Rule.** Scroll area gets fade (on by default in menus, dialogs and panel lists): a 28–32 px eased mask only on the side with more content, scroll-driven, with scroll-padding equal to padding plus fade so focus never lands under it.
- **Today.** Masks only in Nav, Tree view and Code; Claude 28 px scroll-driven, Figma 32 px with two @property stops, ChatGPT 16 px under its sidebar header; components audit proposed it.
- **Change.** A Scroll area option and the rule.
- **Families.** scroll-area, menu, dialog, drawer, panel, command-palette.
- **Findings.** RC15, RF10, BL-scrolledge.
- **Depends on** B6.6; **unblocks** nothing named.
- **Risk.** Mask colour per ground.
- **Verified by.** F1.
- **Docs and skills.** scroll-area.md.

#### E4 · An inactive-window state

*capability · size S · evidence reference, confidence high · seen by reference · build*

- **Rule.** One data-area-window=inactive hook in layers.css quiets the solid action and the shell's inks when the window loses focus.
- **Today.** Nothing reads window focus; Claude greys primary buttons and drops sidebar and header ink to 50% / 35%.
- **Change.** The hook; Electron sets it.
- **Families.** button, titlebar, nav, panel.
- **Findings.** RC16.
- **Depends on** nothing; **unblocks** nothing named.
- **Risk.** Intake rung 2.
- **Verified by.** The app with its window blurred.
- **Docs and skills.** THEMING.

#### E5 · Drag and drop

*capability · size M · evidence source, confidence high · seen by source · build*

- **Rule.** Property list's reorder lifted into useReorder (keyboard pick / move / drop / cancel, pointer after 3–5 px, autoscroll at 20 px, announcements, a non-drag “Move to…” alternative) for Board cards, Tabs and Tree view.
- **Today.** Board has no drag; Property list holds the system's only reorder.
- **Change.** The hook; Board first.
- **Families.** board, property-list, tabs, tree-view.
- **Findings.** I27.
- **Depends on** C7.1; **unblocks** nothing named.
- **Risk.** Board's drag is app code today.
- **Verified by.** F2 drag suite.
- **Docs and skills.** board.md.

#### E6 · Brand second and third colours visible; parked tokens listed

*capability · size M · evidence source, confidence high · seen by source · build*

- **Rule.** Every emitted public role has a consumer or is listed as parked with the job it waits for; a system's secondary and tertiary colours get a target (links, charts' first series, badges, selection).
- **Today.** --area-secondary-*, --area-tertiary-*, fg-secondary*, fg-tertiary*, fg-on-secondary/tertiary and fg-on-support-1…8 are read by nothing (0 var() uses) and absent from THEMING's Parked list; gap-xl, icon-xl, display-lg and the z-* scale are unused or unlisted.
- **Change.** A Second colour target; the parked list completed.
- **Families.** link, chart, badge.
- **Findings.** B-S16, B-P5.
- **Depends on** A3.2; **unblocks** nothing named.
- **Risk.** Do A3.2's accent-alias rename first.
- **Verified by.** Unused-token scan.
- **Docs and skills.** THEMING:447–460.

#### E7 · Customization gaps

*capability · size L · evidence mixed, confidence medium · seen by reference + source · later*

- **Rule.** Each gap is a value on an existing axis or a small setting, never a named look and never cutting an option: typeface (UI, reading, mono) with per-face cap and tracking metrics; weights per role; ramp shape; control height apart from type; icon weight; tracking and leading; layout spacing; motion per intent; scrim and material in the registry; syntax palette after more code roles; chart series hues; a Soft contrast step below Standard; P3 placement for accent solids and status marks; a joined Field layout; a floating-only hairline; disabled, underline and selection colour only with evidence. Per-family corners stay out (no named looks).
- **Today.** 63 settings in 9 groups; no typeface setting (Geist fixed); two weights; titles stop at 26; height = line + 2 × room; six code roles; Contrast only rises; rungs sRGB on P3 screens; Field stacks only.
- **Change.** Ranked: typeface, weights, ramp, control height, second colour (E6), icon weight, region separation (A7.2), tracking and leading, layout spacing, motion per intent, overlay material, line style, syntax, series hues, the rest.
- **Families.** all.
- **Findings.** RD16, RD17, RD18, RD19, BL-V2, BL-codecolours, BL-K1, BL-K2, BL-K3, BL-K4, BL-K5, BL-K6, BL-K7, BL-K8, BL-K9, BL-K10, BL-K11, BL-K12, BL-K13, BL-K14, BL-K15, BL-K16.
- **Depends on** A9.6, A8.1; **unblocks** nothing named.
- **Risk.** Every new setting goes through area-foundation-change and the registry's orthogonality test.
- **Verified by.** Registry test; Setup questionnaire.
- **Docs and skills.** THEMING; registry.ts; area-foundation-change.

#### E8 · Pill shapes add optical side room

*capability · size S · evidence reference, confidence medium · seen by reference · build*

- **Rule.** A shape whose corner passes 3/8 of its height adds max(0, corner − 3H/8), rounded, to its text and icon sides (0 at the default, 2 at Corner 14, 4 at a 32 pill; Spectrum's pill sides); soft Badge excluded.
- **Today.** Only fields clear half their corner (inset.css:30); pill Buttons and Chips keep a rectangle's sides.
- **Change.** One term in inset.css.
- **Families.** button, chip, segmented, tabs.
- **Findings.** RD6.
- **Depends on** B2.2; **unblocks** nothing named.
- **Risk.** Pill widths grow up to 4 px.
- **Verified by.** F1 at Pill.
- **Docs and skills.** inset.css; DESIGN_SYSTEM pills.

#### E9 · Smoother corners

*decision · size M · evidence reference, confidence high · seen by reference + source · decide*

- **Rule.** Owner decision: a corner-shape: superellipse value with radius compensation (ChatGPT multiplies every radius by 1.25 so the curve reads the same).
- **Today.** No corner-shape in styles; components audit D4 open.
- **Change.** If taken: a Corner shape value (round / smooth) with the compensation derived.
- **Families.** all.
- **Findings.** RF18, BL-D4c.
- **Depends on** A2.3; **unblocks** nothing named.
- **Risk.** undefined
- **Verified by.** Review page.
- **Docs and skills.** radius.ts.

- **Options** (§7): Add as a setting value, default round (recommended); Not now.

#### E10 · Toast stack, limit, progress and several actions

*capability · size M · evidence reference, confidence medium · seen by reference + source · later*

- **Rule.** A Toaster limit (default 3) with older toasts collapsed behind (−14 px and −4% per depth), expanding on hover or focus; a progress option; reflow by View Transitions where it removes the manual FLIP.
- **Today.** Toasts list 8 apart with no limit; no progress; Toast actions exist; manual FLIP (surface.css:1715).
- **Change.** A variant, not a default change.
- **Families.** toast.
- **Findings.** RC23, RB13, BL-V13, RB25.
- **Depends on** C5.1; **unblocks** nothing named.
- **Risk.** The stacking look is taste.
- **Verified by.** Review recording.
- **Docs and skills.** toast.md.

#### E11 · Variants, slots and families named by the reviews and the backlog

*capability · size L · evidence mixed, confidence medium · seen by source · later*

- **Rule.** Each through docs/GOVERNANCE.md's intake ladder (nothing → setting → composition → slot → value → axis → component), proposed and never started unasked.
- **Today.** Open: document tabs (on Nav horizontal per B8.1) and the editor tab strip, Diff split and per-hunk actions, floating outline, Tree view lazy branches and revealActions, image viewer, calendar views, peek, Gantt, DataGrid, input mask, audio player and scrubber, selection frame, Table add / footer row and header icon, Breadcrumb item icon, Tabs iconOnly and sticky list, a forced-state hook for specimens, width hooks (Slider, Slider range, Progress, Radio), fieldset hidden legend, List box frameless grid, Button text-size hook, Approval two plain buttons, CopyButton label vs aria-label, PropertyList rename, a Text and Heading component, the kit FIGURES flag, the COMPONENTS candidates.
- **Change.** Ranked in §9.
- **Families.** nav, edit-summary, table-of-contents, tree-view, table, breadcrumb, tabs, slider, progress, radio, list-box, button, approval, copy-button, property-list.
- **Findings.** BL-V12, BL-edtabs, BL-V14, BL-hunk, BL-V16, BL-V8, BL-treereveal, BL-N9, BL-N11, BL-N13, BL-gantt, BL-datagrid, BL-mask, BL-audio, BL-selframe, BL-tableadd, BL-crumbicon, BL-tabsicon, BL-sticky, BL-forced, BL-widths, BL-later, BL-approvalbtns, BL-copylabel, BL-proplist, BL-N10, BL-kit5, BL-candidates.
- **Depends on** B8.1; **unblocks** nothing named.
- **Risk.** Bloat: each must pass intake.
- **Verified by.** Intake proposals.
- **Docs and skills.** COMPONENTS candidates.

## 6. Phases

Each phase ends in one owner review page with before and after side by side at true scale, light and dark, and each family's plain "What changed / Why". Objective fixes are batched under a single "Approve every fix" control, and only the real decisions are asked as questions.

- **Phase 0: safety net and truth (F).**
  - Merge the other worktree first (F0). Then the capture harness becomes check:rendered (F1), Playwright suites arrive (F2), the gallery is cleaned (F3.1–F3.4), and the registry (F4), the generated API tab (F5) and the stale docs (F6) are fixed.
  - F7–F10 can trail.
  - Review page: "the gallery as it really is", with every family re-captured at the merged defaults (light Layers 50). This page is the new baseline every later page compares against.
- **Phase 1: foundations (A).**
  - Decisions first, so the same values are not tuned twice: A8.1 (heights), B2.3 (menu density), A2.3 (corners), A3.2 (third ink), A4 (dark washes), A5.1 (overlay motion), A7.2 (dark elevation), A9.3 (joined lines). B2.3 is a Phase 2 item, but A1.1 needs its answer, so it is asked on the Phase 0 page.
  - Then the derivations: A1, A2.1–A2.2, A3, A5.2–A5.7, A6, A7.1, A8.2, A9, A10, A11.
  - Review page: "foundations", with a Menu over a Card over the page, a form row, a toolbar, a page header and a chat column at Compact, Default and Comfortable.
- **Phase 2: shared parts (B).**
  - The frame (B1), row (B2), field shell (B3), header bar and corner action (B4), marks (B5), popup surface (B6), state paint (B7) and twins and density (B8).
  - Review page: "one recipe per part", grouped by part, with every family that changed listed under it.
- **Phase 3: behaviour (C).**
  - F2 must be green first. Then the hooks: C6, C2.1, C1.1, C2.2, C3, C5, then adoption family by family, then performance (C7).
  - Review page: recordings, not stills (a submenu reached diagonally, a toast over a dialog, a form reset), plus bundle size before and after.
- **Phase 4: family defects (D).** One round per kind: navigation (D1), content (D2), conversation (D3), fields (D4), the carried decisions (D5) and the app-audit gaps (D6). Each ends on its own short page.
- **Phase 5: capabilities (E).** Each goes through the intake ladder as a proposal before it is built. The app shell (E1.1) and the thread (E1.2) come first, because they unblock the product recreations.

| Phase | Items | S | M | L | Fixes | Decisions | Capabilities | Quick wins |
|---|---|---|---|---|---|---|---|---|
| 0 | 14 | 6 | 8 | 0 | 13 | 0 | 1 | 5 |
| 1 | 49 | 36 | 12 | 1 | 38 | 11 | 0 | 18 |
| 2 | 43 | 30 | 12 | 1 | 33 | 9 | 1 | 14 |
| 3 | 18 | 9 | 7 | 2 | 15 | 3 | 0 | 6 |
| 4 | 6 | 3 | 3 | 0 | 5 | 1 | 0 | 2 |
| 5 | 15 | 3 | 7 | 5 | 0 | 1 | 14 | 0 |
| all | 145 | 87 | 49 | 9 | 104 | 25 | 16 | 45 |

## 7. Owner decisions

Each is a question with its options, the evidence (the item's Today line) and a recommendation. Recorded owner decisions that a finding argues against are here, never in the fixes. The ones Phase 1 needs first are A8.1, B2.3, A2.3, A3.2, A4, A5.1, A7.2 and A9.3.

### A2.3 · Corner default and the surface “+N” rule against the references

**Evidence.** At Corner 10 controls are .26–.31 of their height (live products .125–.25, median .19). Popover and Panel 16, Card 18 over an 18 inset (radius / padding 1.0; products .375–.58), Dialog 20 (container + 4, owner 2026-10-03), Asset card 20, Design card 24, titled Toast 16, Tooltip 10. Claude 10 / 10 / 6, Cursor 12 / 12 / 8, Figma 13 / 5, ChatGPT 16–20 under a 1.25 squircle factor; live products' cards 6–14, never rounder than their menus. Spectrum grows corners 1 px per size; Area in proportion (lg 38 → 16, xl 46 → 20 at Corner 14).

- **Keep Corner 10; resting cards capped at the floating corner (recommended).** RL2: Card = min(radius-container, round(down, 0.6 × inset, 2)): md 10, sm 8, lg 12; Design and Asset card capped at 16; Dialog drops its +4 (16). Popover and Panel keep 16. Keeps the owner's setting and fixes the two outliers.
- **Keep Corner 10; every surface = control + 4 (RC1).** Surfaces 12, dialogs 12, cards 12, rows 8: between Claude (10) and Cursor (12); every overlay loses 4–8 px.
- **Default Corner 8 (RL3 b).** Every control 2 px less round (md 6 / 30 = .2, the products' median); reverses the 2026-10-26 default.
- **Keep everything.** Area stays the roundest of every reference; only stale comments are fixed (F6).

**Recommendation.** Keep Corner 10; resting cards capped at the floating corner. Findings: RC1, RL2, RD21.

### A3.2 · A third text ink, and secondary / tertiary stop meaning the accent

**Evidence.** Two text inks: fg-default (138 rules) and fg-muted (210), plus fg-disabled (23) and fg-quiet (3, icon actions). fg-placeholder = muted; fg-secondary and fg-tertiary alias the accent, a name collision with what every reference means; fg-disabled is a fixed #a4a4a4 outside the layer model. Claude 3 inks + disabled, Cursor 4, Figma and ChatGPT 3; Primer, Spectrum, Polaris, Radix, Geist 2 + disabled; Atlassian, Apple, Ant 3. Area's muted at 5.74:1 leaves a narrow room above 4.5.

- **Add fg-subtle at 4.5:1 (recommended).** ≈ #767676 on white (Atlassian's subtlest is 4.9:1); placeholder, shortcut, timestamp, empty value, line numbers; never a description. A narrow step, but legal for text.
- **Add a 3:1 meta ink (RC8).** Claude's muted #898781 and Cursor's tertiary; fails WCAG AA for text, so only non-essential meta; conflicts with “never weaken contrast”.
- **Keep two inks.** As Primer, Spectrum, Polaris, Radix, Geist; meta steps by size (text-sm).

**Recommendation.** Add fg-subtle at 4.5:1. Findings: RC8, RF1, RD20, RC17.

### A4 · Dark state washes

**Evidence.** DARK_WASH hover 0.07 × Hover step 2 = 14% white, selected 19%, pressed 20.7% (verified base.ts:148, :257). Claude 7.5 / 15, Cursor 8 / 14, Figma 5 / 10, ChatGPT 8 (SDK ghost 12); light agrees everywhere at 5%. On #020202 a 14% plate lands near #262626. Code block's dark highlight is 19% white against 7% black in light.

- **8% / 14% (recommended).** Cursor and Claude within 0.5 point; ordering guarantee unchanged.
- **5% / 10%.** Figma's; on near-black, muted rows' plates may disappear.
- **Keep 14% / 19%.** Two to three times every reference.

**Recommendation.** 8% / 14%. Findings: RC5, RF2.

### A5.1 · Overlay motion: durations and an exit curve

**Evidence.** Menus and popovers enter on duration-base 210 and leave on fast 140, both ease-out (verified surface.css:1806); tooltips 140; dialogs 280 / 210; toasts 350. Claude: menus not animated, tooltips 120, popovers and dialogs 200; Cursor: every floating surface 100 out-quint, dialogs 200; ChatGPT: menu 150 in / 100 out on (.8, 0, .4, 1); Figma's shell animates none; library consensus 150–200 for menus. System gaps M1 (180) still open.

- **Anchored overlays enter on fast, exit fast on ease-exit; dialogs on base (recommended).** 140 / 140 at Motion 210; menus land near Cursor and ChatGPT without moving any other duration.
- **Motion default 210 → 150.** fast 100, base 150: both products' numbers, but every transition in the system shortens.
- **Keep 210; add only the exit curve.** The smallest change.

**Recommendation.** Anchored overlays enter on fast, exit fast on ease-exit; dialogs on base. Findings: RC3, RF4, BL-M1.

### A5.6 · Press gives on the plate, not the label

**Evidence.** scale var(--_give), 0.97 md / 0.96 sm, on the whole button in 91 ms (button.css:158). Claude scales only its paint layer .975, 60 in, 450 spring out; Cursor the whole control .98; ChatGPT by width .96–.995 (Area's class-based give matches within .005 except a wide non-full-width button); Figma also drops a pressed solid's label ink one step.

- **Plate press, label still (recommended).** No label blur at 2×; Claude's feel.
- **Keep the whole-control press.** Cursor's; current.
- **Also dim a pressed solid's label.** Figma's scale-free cue that survives Feedback Off; taste.

**Recommendation.** Plate press, label still. Findings: RC10, RF15, RF20.

### A7.2 · Dark elevation and region depth

**Evidence.** Menus, dialogs and toasts paint bg-surface, a Card's tone at Card tone Auto (rendered: the menu fill samples rgb 2 on a page of rgb 1), separated only by the edge and a doubled shadow. Atlassian dark #1F / #24 / #2B, Spectrum's elevated gray-75, Material's containers and Apple's elevated backgrounds all lighten. Layers 0 (owner, 2026-10-26) on near-black leaves no room for a lighter sidebar. Light: Area's menu shadow 0 0 2 4% + 0 8 16 8% is lighter and shorter than Claude's 0 8 24 12% + 0 2 6 8% and Cursor's three 12% layers (Floating 8, owner 2026-11-05). Light region depth is changed by F0 (light Layer contrast 50); the dark half of the question stands.

- **Dark lifts floating and modal one layer step (recommended).** LAYER_PER_STEP.dark.raised 0.015: a menu over a card ≈ #1a1a1a over #121212; light unchanged; with A7.1 it is the separation every reference uses.
- **Also a dark floor for the chrome ground.** Sidebar 2–3 L* above the page; changes chat, document, IDE and design-tool layouts.
- **Keep one sheet; separate by rules.** The current look, relying on A7.1's single edge.
- **Revisit the light floating shadow.** A 12% near layer as both desktop references; Floating 8 stays the setting.

**Recommendation.** Dark lifts floating and modal one layer step. Findings: RD3, B-P4, BL-regiondepth, RC14.

### A8.1 · Control height ladder at type 13

**Evidence.** Type 13 Default 22 / 26 / 30 / 38 / 46, rows 30; the app at Compact 20 / 24 / 26 / 34 / 42, rows 28. Desktop references at 13 px: Claude 24, Cursor 24, Figma 24 (11 px text); ChatGPT desktop md 32 with ~29 menu rows. Web systems 24 / 32 / 40 / 48; live products 32 at 14 px text, a 2.29 ratio to text that Area's 30 at 13 matches (2.31). Literals written on the 4 px ladder sit off it: mark-sm/md/lg 16 / 20 / 24 (base.ts:491), the “24 Kbd box” and “32 Dialog close” (DESIGN_SYSTEM:643, :308). A 22 row floor for IDEs is out of reach (density.ts:12).

- **Keep the derived ladder and the Default density (recommended).** By ratio to text Area sits inside every live product; the app already runs Compact (md 26, 2 px from Cursor and Claude). RD1's snap either makes sm = md at Compact (rounding down) or moves the app's md 26 → 28, away from the desktop references (rounding to nearest).
- **Default density 28 for type ≤ 13 (RC2).** Ship Compact as the default: md 26, rows 28; library users get desktop density.
- **Snap heights to the 4 px ladder (RD1).** Type 13 Default 24 / 28 / 32 / 40 / 48, app 20 / 24 / 28 / 36 / 44: Primer's ladder; md Buttons 2 px taller.
- **Allow a 22 row floor for dense tools.** Below WCAG 2.5.8's 24 unless A11.2's hit target carries it.

**Recommendation.** Keep the derived ladder and the Default density. Findings: RC2, RD1, BL-density22.

### A9.3 · Joined lines and title pairs: one rule each

**Evidence.** A line joined to a name is 12 muted in Choice, Switch, group descriptions, Menu, Custom select caption, Field, Meter, File tile, Hover card, Empty state sm and the Section heading lede, and 13 muted in Setting row, Approval, Stepper, File upload, Design card, Board, Timeline and every surface description: a Switch is 13 over 12, the same setting as a Setting row 13 over 13. The skill says a step changes one property; surface titles change weight and ink, and Confirm dialog alone keeps a default description. Title → description is 4 (owner 2026-11-06); products 2–8 (shadcn 8, ChatGPT 8, Notion 2), Linear's page lede 12.

- **Joined line = the name's size, muted; text-sm only for text set apart (recommended).** Cursor's settings 13/18 over 13/18: Choice, Switch, group descriptions, Custom select, File tile, Hover card and the Section heading lede 12 → 13 (rows grow 2 per line); Field, Meter, Empty state sm stay 12; Menu's 12 kept as the stated dense-menu exception. Surface titles keep weight + ink; Confirm's default description is the written exception.
- **Joined line steps to text-sm everywhere.** Setting row, Approval, Stepper and surface descriptions 13 → 12; denser; two properties change at once.
- **Also: title-pair gap 4 → 8 on Card, Dialog, Empty state, Page header (RL6).** Independent; reverses the 2026-11-06 pick; compact surfaces keep 4. Low-medium confidence (three sources).

**Recommendation.** Joined line = the name's size, muted; text-sm only for text set apart. Findings: T2, VC14, T23, RL6.

### A9.6 · A regular weight above 400, and dark weight compensation

**Evidence.** Regular 400, strong 500. Figma 450 / 550, ChatGPT desktop 430, Linear 510 / 590, Polaris 450 / 550; Claude 400 / 500 / 580 with dark wght 360 / 460 / 540; Geist is variable and WGHT_RAMP already holds 450.

- **Trial 430–450 as the default regular (recommended to look at).** Body, menus and fields a touch firmer; the regular-to-strong gap narrows from 100 to ~60.
- **Dark weight offset −40 on wght.** Claude's; dark text reads the same weight as light on near-black.
- **Keep 400 / 500.** Primer, Radix, Cursor.

**Recommendation.** Trial 430–450 as the default regular. Findings: RF3, BL-V1, RC9.

### A9.7 · Secondary and ghost button label weight

**Evidence.** 500 on every variant (button.css:28–31). Claude, Cursor, ChatGPT web, Notion: 400 on quiet variants, 500 on primary; GitHub 400 default / 500 primary; Radix, shadcn and Geist 500 on all; the live median is 500.

- **Keep 500 (recommended).** Live web products agree with Area; keeping avoids weight changes between neighbours.
- **400 on soft, outline, ghost.** The desktop apps' choice; toolbars and dialog footers lose weight; the primary stands out.

**Recommendation.** Keep 500. Findings: RC7.

### A9.11 · One figure role

**Evidence.** Card value and Chart figure 26/400 sans tabular; donut centre 18/500 mono without title-sm tracking; ticks and notes mono 11 (chart.css:52) beside a sans legend.

- **Sans tabular ticks and centre (recommended).** Dashboards in the reference set use the UI sans with tabular figures.
- **Keep mono data labels.** The spec's deliberate choice.

**Recommendation.** Sans tabular ticks and centre. Findings: T18, VC16.

### B1.2 · One item-name part for picture cards

**Evidence.** Name above (Asset card, x 13.4, 400), below inside (Card, x 18, 500), below outside (Design card x 4, Figure x 0, File tile centred; 400 and 500). The 2026-11-01 card system (“name below, 8 in”) and the feed system (“names top-left”) already disagree.

- **500 default ink for every item name (recommended).** Card, File tile and Board card already; Asset and Design card gain weight; a caption stays 12 muted.
- **400 for names.** DESIGN_SYSTEM:556's sentence; Card, File tile and Board card lose weight.

**Recommendation.** 500 default ink for every item name. Findings: VC4.

### B1.4 · Card's text-only bottom

**Evidence.** Title cap 18 from the top; last line's descent 18 from the bottom, so its baseline sits ≈ 22.6 from the edge: text-only cards look 4–5 px heavier at the bottom.

- **Baseline plus allowance (recommended to look at).** Optically even top and bottom.
- **Keep the descent trim.** The recorded rule.

**Recommendation.** Baseline plus allowance. Findings: VC18.

### B2.3 · Menu density and the row label column

**Evidence.** Menu rows 30 (Compact 28), icon → label gap-row 10 (8), label at 34 (32), floor 224, no cap. Claude rows 24, gap 6, label 30, floor 128 / cap 320; Cursor 24, 6, 30, 120 / 320; ChatGPT gap 6, label 34; Figma 4 after a 24 box; GitHub and shadcn nav gap 8 (live median 8). A1.1's whole-step rule alone would move gap-row to 12 (label 36), away from every reference. Tree view already uses 6 (owner, pass 3).

- **ui-cluster gap, label 32 / 30, floor 160 (recommended).** Claude and Cursor at the app's density, GitHub and shadcn at Default; one value for every row family.
- **gap-md 6 at every density (RF17, RC12).** Label at 30 at Default too; denser than the web products.
- **Keep gap-row (10 now, 12 after A1.1).** The documented 36 label column; the roomiest of every reference.

**Recommendation.** ui-cluster gap, label 32 / 30, floor 160. Findings: RC4, RC12, RF17.

### B2.4 · Two-line rows: where the leading icon sits

**Evidence.** Menu's row with a description centres its leading icon and check over both lines (icon 9 below the content top instead of 1); Board, Plan, Queue, Accordion and Attachment use the box; Alert, Toast, Card list and Switch use margin arithmetic (same pixels). Claude centres two-line menu rows optically. model-picker.md's capture has no leading icon.

- **First line (recommended).** The system's written rule.
- **Optically centred pair (Claude).** Icon centred on both lines, the pair centred by a baseline formula.

**Recommendation.** First line. Findings: G10, RC21.

### B3.2 · Field text inset against the products

**Evidence.** Field text 10 from the edge on 30 (.33); Geist 12 on 32 (.375), shadcn 12 + 1 (.41), Radix select 12 (.375). Button and field share 10, so stacked rows align.

- **Keep 10 (recommended).** Button and field text start on one x; three products measured, two unmeasured.
- **Fields + 2.** Closer to the web products; breaks the shared x with Button.

**Recommendation.** Keep 10. Findings: RL7.

### B5.2 · Tag text against Badge, and the Compact mark merge

**Evidence.** Tag sets its size by sign(ui-leading − plate height): 13/18 at Default, 11 at Compact, 12 at type 12 Default; Badge and Count on the same plate are 11 at every density. At Compact mark-label-sm = md = 14, so Badge, Count, Kbd and Tag sm and md are identical at the app's density. Notion's tags 12 on 18; live badges 12 / 500.

- **Tag md 11/14 like Badge at every density (recommended).** One mark text; Tag reads as a mark beside Badge and Count on one baseline.
- **Tag md 13/18 at every density.** Tag as a word in a row (Notion-like); Tag stays the odd mark.
- **Compact: md marks 14 → 18, or document the merge.** Every mark size distinct at every density (G12a).

**Recommendation.** Tag md 11/14 like Badge at every density. Findings: T6.

### B6.4 · Whether floating lists count their border in the inset

**Evidence.** Menu, Select picker and field lists pad 4 inside a 1 px border (rows 5 from the outer edge, rendered) and compute the row corner as list − 4 (surface.css:1276: “counting it gives 7”), a recorded choice; Popover, Dialog, Card and Toast subtract the border. Command palette, the best-aligned surface in the render (search icon and row icons share x +12), depends on it.

- **Keep and document (recommended).** No visual change; the exception stated.
- **Count the border (S21).** Padding 4 − border; rows 1 px wider each side; list − 4 exact.

**Recommendation.** Keep and document. Findings: S21, G17.

### B7.7 · How a value picker shows its value

**Evidence.** DESIGN_SYSTEM:276 says active plate + check; Combobox, Custom select and List box do; native Select shows the check alone in currentColor (Menu's check is fg-selection), its group label 11 / 400, its disabled option dims by ink.

- **Plate + check everywhere (recommended).** The written rule; Select joins its siblings.
- **Check alone everywhere.** The Select pick extended; three families drop the plate.

**Recommendation.** Plate + check everywhere. Findings: S10.

### B7.9 · Disabled toned solids

**Evidence.** Opacity 0.5 dims a disabled blue or red Button to a lighter brand or danger button; Material, Spectrum, Primer, Fluent, Carbon and Radix repaint to neutral; shadcn and Untitled dim.

- **Repaint toned solids (recommended).** A disabled danger action stops reading as an available one.
- **Keep the dim.** One mechanism everywhere.

**Recommendation.** Repaint toned solids. Findings: RD7.

### C1.3 · An outside press under an open menu

**Evidence.** popover=auto lets the dismissing press also activate what is under it; Radix modal menus and macOS swallow it.

- **Swallow (recommended).** macOS and Radix: dismissing never presses a button by accident.
- **Pass through.** The web default: one click does two things.

**Recommendation.** Swallow. Findings: RB18.

### C5.4 · Whether an alert dialog closes on a backdrop press

**Evidence.** Confirm dialog closes on a backdrop press (verified ConfirmDialog.tsx:34–35); Radix's alert dialog and the APG never close on an outside press.

- **Buttons or Escape only (recommended).** A stray click no longer cancels a destructive confirmation silently (APG).
- **Keep the backdrop close.** The documented behaviour; forgiving.

**Recommendation.** Buttons or Escape only. Findings: RB5.

### C5.6 · Tooltip timing

**Evidence.** 500 open, 300 skip window, 0 close (Overlays.tsx:26–28); no scroll dismissal. Claude 300, Cursor's most common 300, ChatGPT 150, Figma's shell hover cards 500; Radix 700, Base UI 600, Ariakit 500, React Aria 1500.

- **300 for every tooltip (recommended).** Both desktop references; the skip window already makes scanning fast.
- **150 name-only, 500 descriptive.** ChatGPT for icon labels; two delays to explain.
- **Keep 500.** The primitive libraries' consensus.

**Recommendation.** 300 for every tooltip. Findings: RC11, RF6, RB22.

### D5 · Carried writing and content decisions

**Evidence.** Rules unchanged in WRITING.md and MOTION.md; ReferenceList.tsx:57 uses an em dash; description-list.css:16 160px.

- **Keep Area's rules and record the Primer differences (recommended).** Nothing in this evaluation argues for change.
- **Adopt Primer's.** Per the 2026-11-07 audit.

**Recommendation.** Keep Area's rules and record the Primer differences. Findings: BL-D789, BL-kit4, BL-dl160.

### E9 · Smoother corners

**Evidence.** No corner-shape in styles; components audit D4 open.

- **Add as a setting value, default round (recommended).** Keeps every option; Electron 44's Chromium supports it.
- **Not now.** Concentric arithmetic would need the compensation everywhere.

**Recommendation.** Add as a setting value, default round. Findings: RF18, BL-D4c.

## 8. Quick wins: one “approve every fix” list

Objective fixes that need no decision: each makes values agree with a rule the system already states, or removes a defect. Most are size S. A few carry an “owner glance” in their risk line, but no choice.

| Item | Fix | Families | Findings |
|---|---|---|---|
| F3.1 | Tile names keep the space after “a” and their parentheses | badge, code, meter, model-picker, scroll-to-latest, shortcut-list, … | VN25, VS5 |
| F3.2 | Gallery stages keep their gutter; fluid specimens get a width | chart, description-list, shortcut-list, meter, input-group, slider, … | VC8, VN26, VA4, VA5 |
| F3.3 | Demos that hide, misstate or fail to show their state | toolbar, tree-view, nav, hover-card, reference-list, figure, … | VA6, VN27, VC9, VC28, VS19 |
| F4 | Status registry: no family silently Unrefined; reasons as data | code-block, composer, custom-select, meter | B-B1, B-B2, BL-D2 |
| F6 | Stale comments, counts and rule tables | inset, stack, description-list, setting-row, timeline, calendar, … | G19, T25, S17, RC22, B-B3, T5, VN24 |
| A1.2 | Three sibling-gap roles | page-header, drawer, toast | G13 |
| A2.2 | Components read only public radius roles | file-upload, accordion, step, description-list, kbd, stepper, … | S15 |
| A3.3 | Placeholders and unselected options read one role each | approval, editable-text, toggle-group, pagination | T19, VA9, VN12 |
| A3.4 | Tone colours the mark, never the words | turn-notice, message, attachment, file-upload, alert, tabs | T10, T12, VN19 |
| A5.3 | A highlight moving through a list lands and leaves at once | menu, context-menu, list-box, custom-select, combobox, command-palette, … | RB4, RF5 |
| A5.4 | Effects never overshoot; Spring becomes a real spring | every transition | RD4, RB17, BL-M4 |
| A5.7 | Progress fill animates scale, not inline-size | progress, meter | I26 |
| A6.1 | A focus ring never sits flush on a fill of its own colour | button, split-button, composer, badge, switch, checkbox, … | RC6, RD2 |
| A6.2 | The focus placement table becomes a test | accordion, step, token-row, approval, prompt-suggestions, tag-picker, … | S12, RF7 |
| A6.3 | Focus answers Contrast More | every focusable | RD12 |
| A6.4 | Forced colours cover every fill-only state | toggle-group, approval, list-box, custom-select, design-card, date-picker, … | S18 |
| A9.2 | text-xs is for marks; words that label, explain, warn or locate are text-sm or larger | field, slider, calendar, asset-row, panel, select, … | T1, T13, VA12, VN13 |
| A9.8 | Tabular figures wherever numbers change or align | number-field, timestamp, nav, date-picker, slider, table | T9, RD13 |
| A9.9 | Type literals in Kbd, code lines and sub-floor text | kbd, menu, shortcut-list, code-block, edit-summary, code, … | T7, T8, T22, VA16 |
| A9.13 | A label beside a value is muted 400; the value leads | description-list, filter-bar, progress, meter, field | T24, VC26, VS14, VA21 |
| A10.3 | Empty boxes, rules and connectors keep their edge in dark | checkbox, radio, otp-field, alignment-picker, separator, badge, … | VA22, VS17, VN14, BL-kit1 |
| A11.1 | Every derived inset lands on a whole pixel | combobox, tag-picker, composer-menu, command-palette, select, card, … | G4, VC27, VA17 |
| A11.3 | Glyphs at native sizes | file-upload, empty-state, file-page | G15, G20 |
| B2.5 | A control in a row keeps the row's height and centre | switch, setting-row, table, checkbox | VA3, VC11 |
| B2.6 | One empty, loading and no-results line | combobox, tag-picker, composer-menu, command-palette | G5 |
| B3.3 | Field trailing parts: one clear glyph and a drawn resize handle | search-field, textarea | VA18, VA20 |
| B4.2 | A corner control is concentric with its surface | dialog, confirm-dialog, drawer, popover, hover-card, toggletip, … | S2, VN4, G9, VS26 |
| B4.4 | One collapsible card head | plan, queue, edit-summary, step, approval | VS7 |
| B5.3 | One counter | indicator, count | VS12 |
| B6.1 | One floating shadow stack, listed in material | calendar, color-picker, select, scroll-to-latest, tooltip | S13 |
| B6.2 | A surface's block gap never exceeds its inset | popover, dialog, drawer, hover-card | G2 |
| B6.7 | Alert and Toast agree | alert, toast | VS10 |
| B7.2 | Press shows on a selected or current item | menu, tree-view, table, calendar, approval, button, … | S4 |
| B7.3 | Every hover plate has a pressed plate | select, checkbox, radio, editable-text, color-swatch-picker, tree-view, … | S5 |
| B7.5 | The Selection setting reaches the Splitter | splitter, panel | S8 |
| B7.8 | Disabled one way, by shape | calendar, select, setting-row, number-field, input, time-field, … | S11, T17 |
| B7.11 | One hover-reveal mechanism | attachment, message, nav, panel, queue, prompt-suggestions, … | S24 |
| C2.3 | List family key fixes | tag-picker, combobox, command-palette | I28, I20, RB21 |
| C4 | Text-entry guards | command-palette, approval, color-field, date-picker, editable-text, zoom-control, … | I7, RB2, I12 |
| C5.1 | Toasts above every modal, paused when unseen | toast, dialog, drawer, command-palette | I3, I30, RB6 |
| C5.3 | Modal parity | dialog, drawer, command-palette, popover, confirm-dialog | I14, RB11, I15, I29 |
| C5.5 | Focus continuity | hover-card, mention, citation, toast, chip, tag, … | I8, I16, I23 |
| C6 | Timing constants in one place | tooltip, hover-card, menu, list-box, tree-view, custom-select, … | I24, RB15, RB9 |
| D1 | Navigation and tabs round | nav, tabs, list-box, token-row | VN2, VN10, VN20, VN18 |
| D4 | Fields and pickers round | date-picker, date-range-picker, color-field, time-field, tag-picker | VA11, VA19, VA13, G16 |

## 9. New capabilities and variants, through the intake ladder

The ladder (docs/GOVERNANCE.md) runs: nothing new → a setting → a composition → a slot → a value on an axis → a new axis → a new component. Each proposal below names the lowest rung that does the job. They are ranked by how many product types they unblock (structure-backlog §4.2) and how strong the evidence is. None is started without the owner's request.

| Rank | Proposal | Rung | Item | Why the rungs above fail |
|---|---|---|---|---|
| 1 | App shell (regions, sizes, collapse order, window controls' room, a pane header with a centre, an account row) | composition, plus two slots | E1.1 | Titlebar, Panel and Splitter exist; the grid between them is rewritten per screen (all four recreations) |
| 2 | Thread (column, turn spacing, docked composer, Message headings and attachments) | composition, plus slots | E1.2 | Message and Composer exist; the column is rewritten each time |
| 3 | Scroll edge fades | a rule, then a Scroll area option | E3 | Measured in Claude (28 px), Figma (32) and ChatGPT (16); Area has masks in three families only |
| 4 | Responsive rules, safe areas, mobile parts, swipe and long-press | rules, then a system convention | E2 | No viewport rule anywhere; 14 product types need it |
| 5 | Grid and Shelf; a compact 32 row | composition, then one value | E1.3 | Asset grid and File grid are List boxes for selection |
| 6 | Brand second and third colours shown | a setting target | E6 | Emitted, read by nothing |
| 7 | Typeface, weights, ramp, control height apart from type, and the rest of §4.3's list | settings | E7 | The owner's “every detail a choice”; none exists |
| 8 | An inactive-window state | one hook | E4 | Electron; Claude does it |
| 9 | Drag and drop (useReorder) | a shared hook | E5 | Property list has the only reorder |
| 10 | Notifications history, find bar, status bar, comment thread, validation summary, rating pair, document blocks, marketing blocks, terminal | compositions first | E1.4 | Each is three or four families composed; components only if new behaviour appears |
| 11 | Pill optical side room | a rule in inset.css | E8 | Spectrum writes it; Area only does it for fields |
| 12 | Toast stack, limit and progress | a variant | E10 | Claude and Sonner stack; the look is taste |
| 13 | Smoother corners | a value on Corner | E9 | ChatGPT's squircle needs the ×1.25 compensation |
| 14 | Selection as a scope | a token scope | B7.13 | Selected paint is written per component |
| 15 | Page-level Tabs and a dashboard recipe | composition rules | E1.5 | No new size: Tabs lg plus bar padding |
| 16 | Document tabs, Diff split, calendar views, image viewer, DataGrid, input mask and the other named variants and families | values, slots, then components | E11 | Each in its own intake proposal |
| — | App-audit gaps: a button-form row with a trailing action, the flow node card, and the TableCell rule | slot, composition, rule | D6 | Recorded in the other worktree, not built |

## 10. Coverage, corrections, and what nobody verified

### Coverage: every finding id and the item that holds it

446 ids placed in 145 items, 5 recorded below as not needing an item; 451 ids in all, none dropped (checked by script: every expected id is placed once or listed). Backlog rows that had no id in structure-backlog.md are given BL- ids here (legend after the table); AU ids are the app-audit session's note.

| Report | Finding → item |
|---|---|
| geometry.md | G1 → A1.1 · G2 → B6.2 · G3 → A11.2 · G4 → A11.1 · G5 → B2.6 · G6 → B4.1 · G7 → B2.1 · G8 → B8.2 · G9 → B4.2 · G10 → B2.4 · G11 → A8.2 · G12 → B5.1 · G13 → A1.2 · G14 → B2.1 · G15 → A11.3 · G16 → D4 · G17 → B6.4 · G18 → A1.3 · G19 → F6 · G20 → A11.3 |
| type-ink.md | T1 → A9.2 · T2 → A9.3 · T3 → A9.4 · T4 → A9.5 · T5 → F6 · T6 → B5.2 · T7 → A9.9 · T8 → A9.9 · T9 → A9.8 · T10 → A3.4 · T11 → B2.1 · T12 → A3.4 · T13 → A9.2 · T14 → B3.1 · T15 → A9.12 · T16 → A9.1 · T17 → B7.8 · T18 → A9.11 · T19 → A3.3 · T20 → A9.10 · T21 → A9.10 · T22 → A9.9 · T23 → A9.3 · T24 → A9.13 · T25 → F6 |
| shape-state.md | S1 → A2.1 · S2 → B4.2 · S3 → B7.1 · S4 → B7.2 · S5 → B7.3 · S6 → B7.4 · S7 → B8.1 · S8 → B7.5 · S9 → B7.6 · S10 → B7.7 · S11 → B7.8 · S12 → A6.2 · S13 → B6.1 · S14 → B6.3 · S15 → A2.2 · S16 → B3.1 · S17 → F6 · S18 → A6.4 · S19 → B7.4 · S20 → B7.4 · S21 → B6.4 · S22 → B7.10 · S23 → B6.6 · S24 → B7.11 · S25 → A1.1 |
| interaction.md | I1 → C1.1 · I2 → C1.1 · I3 → C5.1 · I4 → C5.2 · I5 → C2.1 · I6 → C3 · I7 → C4 · I8 → C5.5 · I9 → C7.1 · I10 → C7.1 · I11 → C7.1 · I12 → C4 · I13 → C2.2 · I14 → C5.3 · I15 → C5.3 · I16 → C5.5 · I17 → C7.1 · I18 → C7.2 · I19 → C5.2 · I20 → C2.3 · I21 → C7.1 · I22 → A11.2 · I23 → C5.5 · I24 → C6 · I25 → C8 · I26 → A5.7 · I27 → E5 · I28 → C2.3 · I29 → C5.3 · I30 → C5.1 · I31 → C2.2 · I32 → C5.2 |
| structure-backlog.md | B-B1 → F4 · B-B2 → F4 · B-B3 → F6 · B-B4 → E1.4 · B-S1 → F8 · B-S2 → F5 · B-S3 → F5 · B-S4 → C2.1 · B-S5 → B3.1 · B-S6 → B8.1 · B-S7 → F8 · B-S8 → B1.1 · B-S9 → F5 · B-S10 → F8 · B-S11 → F5 · B-S12 → F8 · B-S13 → B1.1 · B-S14 → F9 · B-S15 → F9 · B-S16 → E6 · B-S17 → F8 · B-S18 → F8 · B-P1 → E1.1 · B-P2 → E2 · B-P3 → A9.1 · B-P4 → A7.2 · B-P5 → E6 · B-P6 → E2 · BL-C2 → B1.1 · BL-C9 → B1.1 · BL-C10 → B6.3 · BL-M1 → A5.1 · BL-V1 → A9.6 · BL-V2 → E7 · BL-D1 → F7 · BL-D2 → F4 · BL-Q1 → F2 · BL-Q2 → F1 · BL-Q3 → F1 · BL-M4 → A5.4 · BL-M5 → F1 · BL-D4 → E1.1 · BL-D5 → F5 · BL-T1 → C7.2 · BL-T2 → F10 · BL-T3 → F10 · BL-S2 → F7 · BL-C8 → B1.1 · BL-British → F8 · BL-V8 → E11 · BL-V11 → B5.1 · BL-V12 → E11 · BL-V13 → E10 · BL-V14 → E11 · BL-V16 → E11 · BL-N8 → E1.4 · BL-N9 → E11 · BL-N10 → E11 · BL-N11 → E11 · BL-N12 → E1.4 · BL-N13 → E11 · BL-D2r → E2 · BL-D3 → F8 · BL-D4c → E9 · BL-D789 → D5 · BL-shell → E1.1 · BL-thread → E1.2 · BL-account → E1.1 · BL-pane → E1.1 · BL-w600 → A9.1 · BL-msghead → E1.2 · BL-reading → E1.2 · BL-codecolours → E7 · BL-density22 → A8.1 · BL-scrolledge → E3 · BL-edtabs → E11 · BL-statusbar → E1.4 · BL-terminal → E1.4 · BL-hunk → E11 · BL-docblocks → E1.4 · BL-compactrow → E1.3 · BL-rating → E1.4 · BL-msgattach → E1.2 · BL-composerprimary → E1.2 · BL-tableadd → E11 · BL-treereveal → E11 · BL-crumbicon → E11 · BL-tabsicon → E11 · BL-panelmax → E1.1 · BL-approvalbtns → E11 · BL-copylabel → E11 · BL-proplist → E11 · BL-regiondepth → A7.2 · BL-kit1 → A10.3 · BL-kit2 → D2 · BL-kit4 → D5 · BL-kit5 → E11 · BL-dl160 → D5 · BL-selectable → — · BL-2dgrid → E1.3 · BL-navhover → — · BL-sticky → E11 · BL-forced → E11 · BL-widths → E11 · BL-later → E11 · BL-hodesign → F10 · BL-hodefaults → F10 · BL-hoci → F10 · BL-homarks → F1 · BL-ho22 → — · BL-candidates → E11 · BL-prevframe → — · BL-grid → E1.3 · BL-comment → E1.4 · BL-valid → E1.4 · BL-mask → E11 · BL-marketing → E1.4 · BL-audio → E11 · BL-selframe → E11 · BL-datagrid → E11 · BL-gantt → E11 · BL-safearea → E2 · BL-K1 → E7 · BL-K2 → E7 · BL-K3 → E7 · BL-K4 → E7 · BL-K5 → E7 · BL-K6 → E7 · BL-K7 → E7 · BL-K8 → E7 · BL-K9 → E7 · BL-K10 → E7 · BL-K11 → E7 · BL-K12 → E7 · BL-K13 → E7 · BL-K14 → E7 · BL-K15 → E7 · BL-K16 → E7 |
| ref-cursor-claude.md | RC1 → A2.3 · RC2 → A8.1 · RC3 → A5.1 · RC4 → B2.3 · RC5 → A4 · RC6 → A6.1 · RC7 → A9.7 · RC8 → A3.2 · RC9 → A9.6 · RC10 → A5.6 · RC11 → C5.6 · RC12 → B2.3 · RC13 → A7.1 · RC14 → A7.2 · RC15 → E3 · RC16 → E4 · RC17 → A3.2 · RC18 → A9.10 · RC19 → B8.2 · RC20 → A11.4 · RC21 → B2.4 · RC22 → F6 · RC23 → E10 |
| ref-chatgpt-figma.md | RF1 → A3.2 · RF2 → A4 · RF3 → A9.6 · RF4 → A5.1 · RF5 → A5.3 · RF6 → C5.6 · RF7 → A6.2 · RF8 → A7.1 · RF9 → B4.3 · RF10 → E3 · RF11 → B2.1 · RF12 → A9.10 · RF13 → B2.7 · RF14 → B7.13 · RF15 → A5.6 · RF16 → B3.1 · RF17 → B2.3 · RF18 → E9 · RF19 → — · RF20 → A5.6 |
| ref-design-systems.md | RD1 → A8.1 · RD2 → A6.1 · RD3 → A7.2 · RD4 → A5.4 · RD5 → F7 · RD6 → E8 · RD7 → B7.9 · RD8 → F7 · RD9 → F7 · RD10 → A11.2 · RD11 → B6.5 · RD12 → A6.3 · RD13 → A9.8 · RD14 → A1.4 · RD15 → A5.5 · RD16 → E7 · RD17 → E7 · RD18 → E7 · RD19 → E7 · RD20 → A3.2 · RD21 → A2.3 |
| ref-behaviour.md | RB1 → C1.1 · RB2 → C4 · RB3 → A5.2 · RB4 → A5.3 · RB5 → C5.4 · RB6 → C5.1 · RB7 → C1.2 · RB8 → C2.1 · RB9 → C6 · RB10 → C5.2 · RB11 → C5.3 · RB12 → E2 · RB13 → E10 · RB14 → E2 · RB15 → C6 · RB16 → C1.1 · RB17 → A5.4 · RB18 → C1.3 · RB19 → C8 · RB20 → C2.2 · RB21 → C2.3 · RB22 → C5.6 · RB23 → C8 · RB24 → F1 · RB25 → E10 |
| ref-live-products.md | RL1 → A3.1 · RL2 → A2.3 · RL3 → A2.1 · RL4 → A9.1 · RL5 → E1.5 · RL6 → A9.3 · RL7 → B3.2 · RL8 → B3.1 · RL9 → E1.5 |
| rendered-actions-fields.md | VA1 → B2.2 · VA2 → B2.2 · VA3 → B2.5 · VA4 → F3.2 · VA5 → F3.2 · VA6 → F3.3 · VA7 → F3.4 · VA8 → B6.3 · VA9 → A3.3 · VA10 → B8.1 · VA11 → D4 · VA12 → A9.2 · VA13 → D4 · VA14 → F3.4 · VA15 → A10.2 · VA16 → A9.9 · VA17 → A11.1 · VA18 → B3.3 · VA19 → D4 · VA20 → B3.3 · VA21 → A9.13 · VA22 → A10.3 |
| rendered-navigation-pickers.md | VN1 → A7.1 · VN2 → D1 · VN3 → B6.6 · VN4 → B4.2 · VN5 → B6.5 · VN6 → B6.5 · VN7 → B4.1 · VN8 → B2.2 · VN9 → B2.1 · VN10 → D1 · VN11 → B7.12 · VN12 → A3.3 · VN13 → A9.2 · VN14 → A10.3 · VN15 → B6.6 · VN16 → B2.7 · VN17 → B4.1 · VN18 → D1 · VN19 → A3.4 · VN20 → D1 · VN21 → B7.6 · VN22 → B6.3 · VN23 → B2.1 · VN24 → F6 · VN25 → F3.1 · VN26 → F3.2 · VN27 → F3.3 · VN28 → F3.4 |
| rendered-content.md | VC1 → D2 · VC2 → D2 · VC3 → B1.1 · VC4 → B1.2 · VC5 → B1.1 · VC6 → B1.1 · VC7 → A10.1 · VC8 → F3.2 · VC9 → F3.3 · VC10 → D2 · VC11 → B2.5 · VC12 → D2 · VC13 → A9.1 · VC14 → A9.3 · VC15 → D2 · VC16 → A9.11 · VC17 → A10.4 · VC18 → B1.4 · VC19 → B1.1 · VC20 → F3.4 · VC21 → F3.4 · VC22 → D2 · VC23 → B7.6 · VC24 → B5.1 · VC25 → A1.5 · VC26 → A9.13 · VC27 → A11.1 · VC28 → F3.3 |
| rendered-status-conversation.md | VS1 → B1.3 · VS2 → B5.1 · VS3 → D3 · VS4 → D3 · VS5 → F3.1 · VS6 → A10.1 · VS7 → B4.4 · VS8 → D3 · VS9 → D3 · VS10 → B6.7 · VS11 → B4.3 · VS12 → B5.3 · VS13 → B5.1 · VS14 → A9.13 · VS15 → D3 · VS16 → D3 · VS17 → A10.3 · VS18 → B5.1 · VS19 → F3.3 · VS20 → D3 · VS21 → D2 · VS22 → D3 · VS23 → D3 · VS24 → E1.2 · VS25 → B5.1 · VS26 → B4.2 · VS27 → E1.2 |
| app-audit session (worktree electron-app-audit-cleanup-35275b) | AU1 → F0 · AU2 → F0 · AU3 → F0 · AU4 → D6 · AU5 → D6 · AU6 → D6 · AU7 → D6 · AU8 → D6 |

**BL- legend.** BL-C2: One frame recipe (system gaps C2); BL-C9: One frame prop (C9); BL-C10: Overlay width hooks + corner roles (C10); BL-M1: Menus open faster, 180 (M1); BL-V1: Weights between the stops (V1); BL-V2: 0.5 px hairline on floating surfaces (V2); BL-D1: Fuller usage entries (D1); BL-D2: Stage and date per family (D2); BL-Q1: DOM behaviour tests (Q1); BL-Q2: Screenshot baseline (Q2); BL-Q3: Accessibility runs (Q3); BL-M4: linear() spring (M4); BL-M5: Motion check in the app (M5); BL-D4: Pattern guidance pages (D4); BL-D5: Props from the code (D5); BL-T1: Lighter CSS per system (T1); BL-T2: DTCG token export (T2); BL-T3: Release readiness (T3); BL-S2: Writing skill (S2); BL-C8: C8 tail: wide 16:9 vs 2:1; BL-British: data-area-colours British spelling; BL-V8: Tree view lazy branches (V8); BL-V11: Tag status shape + smaller size (V11); BL-V12: Document tabs (V12); BL-V13: Toast progress + several actions (V13); BL-V14: Diff split + per-change actions (V14); BL-V16: Floating outline (V16); BL-N8: Find bar (N8); BL-N9: Image viewer (N9); BL-N10: Text and Heading (N10); BL-N11: Calendar and timeline views (N11); BL-N12: Status bar, notification history (N12); BL-N13: Peek (N13); BL-D2r: Responsive props (components audit D2); BL-D3: One slot vocabulary (D3); BL-D4c: Smoother corner option (components audit D4); BL-D789: Toasts, truncation tooltips, loops under reduced motion (D7–D9); BL-shell: App shell (recreations); BL-thread: Thread composition (recreations); BL-account: Account row; BL-pane: Pane header with a centre; BL-w600: Weight 600 + a title step between 26 and 52; BL-msghead: Message heading role; BL-reading: Reading face / reply size by pane width; BL-codecolours: Code colours beyond six roles; BL-density22: Density below 24 (22 rows); BL-scrolledge: Scroll edges / fade where content meets a bar; BL-edtabs: Editor tab strip (close, dirty dot); BL-statusbar: Status bar; BL-terminal: Terminal / log view; BL-hunk: Inline diff per-hunk actions, CodeBlock start line; BL-docblocks: Document blocks; BL-compactrow: Compact reference row (32 tile); BL-rating: Rating pair; BL-msgattach: Message attachments slot; bubble width from container; BL-composerprimary: Composer replaceable primary; BL-tableadd: Table add row, footer row, header icon; BL-treereveal: Tree view revealActions, heading, open-folder icon; BL-crumbicon: Breadcrumb icon per item; BL-tabsicon: Tabs icon-only; strip without panels; BL-panelmax: Panel maxWidth 500 cap; BL-approvalbtns: Approval two plain buttons; BL-copylabel: CopyButton label vs aria-label; BL-proplist: PropertyList name; BL-regiondepth: Region depth at defaults (Layer contrast 0); BL-kit1: Kit gap 1: Plan pending ring 1.1:1; BL-kit2: Kit gap 2: fixed table splits code; BL-kit4: Kit gap 4: Reference list em dash; BL-kit5: Kit gap 5: FIGURES off; BL-dl160: Description list 160 px term column; BL-selectable: Selectable surface recipe (built); BL-2dgrid: 2-D grid collection (partial); BL-navhover: Nav hover actions, Context menu per item, Table baseline (built); BL-sticky: Tabs sticky list; BL-forced: Forced state hook for specimens; BL-widths: Width hooks: Slider, Slider range, Progress, Radio; BL-later: Fieldset hidden legend; List box frameless grid; Button text-size hook; BL-hodesign: HANDOFF: design file size, pen, booleans, layer tree (app work); BL-hodefaults: HANDOFF: Calendar, Split button don't read SystemDefaults; BL-hoci: HANDOFF: area check in CI, publish npx area; BL-homarks: HANDOFF: sm marks 14 at type 13, measure; BL-ho22: HANDOFF: Approval at 22 beside 16 frames (superseded); BL-candidates: COMPONENTS candidates (Action tile … Shelf); BL-prevframe: COMPONENTS lists Preview frame (same as B-B3); BL-grid: Grid (rank 5); BL-comment: Comment thread (rank 13); BL-valid: Form validation summary (rank 15); BL-mask: Input mask (rank 16); BL-marketing: Marketing hero, nav, footer, pricing (rank 22); BL-audio: Audio player / media scrubber (rank 24); BL-selframe: Selection frame (rank 25); BL-datagrid: DataGrid (rank 14); BL-gantt: Timeline / Gantt (rank 11); BL-safearea: Safe areas, touch density; BL-K1: Typeface; BL-K2: Weights per role; BL-K3: Type ramp shape; BL-K4: Control height apart from type; BL-K5: Secondary and tertiary brand colours; BL-K6: Icon set and icon weight; BL-K7: Region separation in dark; BL-K8: Letter spacing and line height; BL-K9: Spacing scale apart from density; BL-K10: Motion per intent; BL-K11: Overlay material (blur, translucency, scrim); BL-K12: Per-family corner (keep out); BL-K13: Line style; BL-K14: Syntax palette; BL-K15: Chart series hues; BL-K16: Disabled appearance, link underline, ::selection colour.

**AU legend.** AU1: Built there: --area-weight-heading 600 (axes/typography.ts:54) and --area-title-xl-* (axes/type-size.ts:109; 30/38 to 40/48 for types 12–16, 32/40 at 13), additive, read by no component yet. AU2: Built there: light Layer contrast default 50 by the owner's decision (dark stays 0; color/layers.ts:40–42), darkest light ground #f1f3f5, series grounds and DATA_STATUS.danger adjusted. AU3: Built there: Link as="button" (Link.tsx:3, :28, :36), Link In review. AU4: App gap recorded there: a button-form row with a trailing action. AU5: App gap recorded there: an icon-only Copy button has no Tooltip. AU6: App gap recorded there: a Popover's icon trigger cannot take a Tooltip. AU7: App gap recorded there: raw td mixed with TableCell. AU8: App gap recorded there: the flow node card.

### Findings not given an item

- **RF19.** No change: Area's tooltip type is the UI's; it follows A9.6 if the regular weight moves.
- **BL-selectable.** Already built (Card selected, Design card, Asset card states).
- **BL-navhover.** Already built (Nav.tsx:160, ContextMenu itemSelector, Table baseline).
- **BL-ho22.** Superseded: aligned answers settled 22 (kit-gaps item 3).
- **BL-prevframe.** Duplicate row of B-B3 (placed in F6).

### Corrections: findings judged wrong, superseded or contradicted, and how each was resolved

- **S2 (Tooltip + Kbd line).** Refuted by the render (VN4): Kbd md is 18, 4 in, corner 6 = 10 − 4, concentric. S2 computed a 20 box at 3 in. The rest of S2 (Dialog, Popover, Toast, Alert) is confirmed and sits in B4.2.
- **G12 (b), Tag lg text 11.** Refuted (VS, G12 check): Tag lg renders 13/22. The side difference (6 vs Badge lg 8) stands.
- **Geometry census “Kbd side (H − 6)/2 = 6 at md”.** Refuted (VS13): Kbd md side is 4 (pad 3 + 1).
- **VA4, VA5 as component defects.** Reclassified by their own reviewer: gallery artefacts of canvas.css:238 inside a shrink-wrapped stage, each with a smaller component fragility (F3.2).
- **S7 visible at the defaults.** Latent: Segmented and soft Toggle group render identically at Stroke 1 (VA §2c); they part only at Stroke 0 or 2 (B8.1).
- **S13 visible at the defaults.** Not visible at the default material (VN census: shadows identical to Menu); it shows only under a glass material (B6.1).
- **RF5 (menu plate grows .98 → 1).** Judged against: RB4, macOS, Radix Themes and Area's own surface.css:1320 comment say list highlights land at once (A5.3).
- **S21 vs G17.** Contradict: S21 proposes counting the border, G17 keeps it and documents the exception. Owner decision B6.4, recommending G17 (Command palette's alignment, the best in the render, depends on it).
- **G1 applied to row gaps.** G1's whole-step rule is right for gaps, but applied to gap-row it moves menu labels to 36, away from every reference (RC4, RC12, RF17, RL nav median 8). The row gap is decided first (B2.3) and A1.1 waits on it.
- **RD1 (snap heights to 4 px) vs RC2 (shorter).** Opposite directions from different references (web systems vs desktop apps). RL's live products show Area's height-to-text ratio inside their range (2.31 vs 2.29), weakening both. A8.1 recommends keeping the derived ladder.
- **RC17, RD20, RF1 on placeholder ink.** Three views (keep muted; between muted and disabled; tertiary). Resolved inside A3.2: placeholder takes the third ink only if it holds 4.5:1.
- **G8 Alert gaps vs Toast.** VS10 shows both render 8 at Default; the difference only appears at 28 and 36. Kept as a density fix (B8.2, B6.7).
- **RB5 (Confirm dialog backdrop).** Argues against the documented behaviour in ConfirmDialog.tsx's comment, so it is an owner decision (C5.4), not a fix.
- **shape-state census: Toggletip with Popover.** Wrong family: Toggletip's popup is Tooltip's inverse bubble (VN24); corrected in F6.
- **G20, RC18, RF20.** Observations kept without a change: lg icon = md by design; tracking direction is face-dependent; width-based press give is equivalent within .005.

### What nobody verified

- **States and motion.** No hover, focus, pressed or open-overlay state was driven in any live product (RL). In Area, only the demos' forced states were rendered, so no real pointer, keyboard or animation was exercised. All behaviour findings (I, RB) are read from code paths, not reproduced.
- **Live products not measured.** Stripe, Raycast, a dashboard product (Supabase or PostHog) and a storefront were never opened (the session declined the Stripe navigation). Linear was seen dark only; Radix, GitHub and Notion light only.
- **Declared, not rendered.** Cursor, Claude, ChatGPT and Figma values are read from their app bundles, except Figma's inspector captures from 2026-09-28. No desktop app was launched.
- **The capture set.** It was rendered in headless Edge (Chromium 157), not Electron's Chromium 152. It predates the light Layer contrast default of 50 now built in the other worktree, so every light ground, plate, well and region-depth value in VS6, VC6, VC7 and A7.2 must be re-measured after F0. The capture set itself (scratchpad rendered/out/) is gone, because the session's scratchpad was cleared; F1 makes it reproducible from scripts/.
- **Tools never run.** Windows forced colours, VoiceOver, touch, RTL and zoom were not run (S18, A6.4, A11.2 are from source). Target sizes at Compact were computed, not hit-tested.
- **Values inferred, not measured.** Rendered cap offsets assume Geist's ascent from Button's trimmed box (the 0.61 in VA1 is accurate to about 0.1). SVG text in Chart, font-variant-numeric and text inside native inputs were not in the measure. Video player's measures disagreed with its picture after two tiles (VC method).
- **Claims checked in source by this synthesis.** These were opened at file:line and confirmed: gap-row's ui-dense formula, radius-step = corner(32px), DARK_WASH 0.07, --area-transition on ease-out, the depth rim at 16%, the Toaster's fixed z-index, ConfirmDialog's backdrop close and its doc comment, the four Unrefined statuses, specimenWords' regex, the overlay clocks, the unminified build and its 3,376,156 bytes, the absence of weight-heading and title-xl on this branch, the Dialog radius comment, and in the other worktree weight-heading, title-xl, Layers 50 and Link as="button".
