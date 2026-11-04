# Questions: how agent chats draw the question the agent asks (read 2026-11-03)

How Cursor and Claude desktop draw a question the agent asks the person: a multiple choice with a free-text answer,
one question or several. Read from the installed bundles, read-only. Nothing here was driven live except the claude.ai
values already in `live.md` (repeated in § 3 only to compare them).

**Sources**

- **Cursor 3.27.22**, `/Applications/Cursor.app/Contents/Resources/app/out/vs/workbench/`. It ships two separate
  question UIs:
  - **C-IDE**, the IDE window's agent pane: a Solid component with plain CSS. CSS in `workbench.desktop.main.css`,
    `.composer-questionnaire-toolbar*`. JS in `workbench.desktop.main.js` near offset 28.89M: the templates
    `axS`/`lxS`/`uxS`/`dxS` and the component `pxS`. `workbench.glass.main.css` carries the same rules unchanged.
  - **C-GL**, the Agents ("glass") window: a React `Tray` with StyleX atoms. In `workbench.glass.main.js`:
    `"questionnaire-tray.react.js"` (`z9T`, offset ~31.72M); `"Tray.js"`, `"TrayOption.js"`, `"TrayStep.js"`,
    `"TraySteps.js"`, `"TrayHeaderStepper.js"`, `"TrayFooter*.js"` (~13.50–13.66M); the styles in `"Tray.stylex.js"`
    (`VVe` option, `NTi` step, `S2n` footer, `y2n` root). Atoms are resolved from the CSS strings inlined in the JS.
    Tokens are on `:root`: spacing 1 = 4, 1-5 = 6, 2 = 8, 3 = 12, 5 = 20; radius sm 4, base 6, lg 8, xl 12; font
    sm 12, base 13, lg 14 (glass mode 15/24); line height base 18; height base 28.
- **Claude desktop 4.4212.0**, `Contents/Resources/ion-dist.asar`, extracted to the scratchpad `claude-asar/`.
  - **CL-Q** is `assets/v1/shared-5-BsmtsDKC.js`, offsets ~190–208K: the CDS component `data-cds="AskUserQuestion"`
    (`AC`), its option row `OC`, its strings `eC`, its class constants `iC`…`_C`, and the state provider `qS`.
  - **MAIN** is `assets/v1/c6a992d55-DOxJvg9D.css`: the CDS tokens and utilities. Values are at rem 16: `--spacing` 4;
    `rounded-lg` 8, `rounded-xl` 12; `--cds-alpha-1` neutral-900 at 5%, `--cds-alpha-2` at 10%; `text-sm` 14/20;
    `text-footnote` 13/17 under `[data-density=comfortable]` and 12/15 otherwise. `rounded-composer` is
    `--cds-radius-composer` 12, or 14 when comfortable (`kT` in `shared-frame-Cetv9ixB.js`).
  - The Code tab mounts CDS with `density:"compact"` (`claude-desktop.md`), so its question uses the `compact:` values.

## 1. Cursor IDE pane (C-IDE): every question in one list, lettered

| Part | Value | Source |
|---|---|---|
| Where | Inside the composer, in `#composer-toolbar-section` above the input. While a question is pending, that section's border turns `color-mix(yellow-secondary 36%)`. Not in the transcript. | C-IDE CSS `#composer-toolbar-section.has-pending-questionnaire` |
| Card | `container-type:inline-size`; column, gap 12, padding 6 | `.composer-questionnaire-toolbar` |
| Header | Icon `chatQuestion` 14 at opacity .7, then "Questions" 13 / 150%, gap 8, margin-left 4. Trailing: stepper (chevron up, "N of M" 12 tabular secondary, chevron down; gap 4) and a collapse chevron 11 | `-header`, `-icon`, `-stepper`, `-stepper-label`; JS `rxS` |
| Collapsed | The header only, with "X of N answered" (12, tabular, secondary) | `-answered-hint`; JS `ixS` |
| Question list | Every question shows at once, gap 12, in a **fixed 200** scroll box with a 16 fade at the bottom. The last question has `min-height:200`, so any question can scroll to the top. The active question scrolls into view smoothly. | `-scroll-container{height:200px; mask-image…}`, `-question:last-child{min-height:200px}` |
| Question text | Number "1." in a 12 column, then the prompt: 13 / 135% weight 590, gap 8, margin-left 6. **Inactive questions are secondary ink; the active one is primary.** Rendered as Markdown `size:"sm"`. | `-question-label`, `-question-number`, `-question-active …` |
| Options | Column, margin-top 4, margin-left −4, no gap | `-options` |
| Option row | Flex start, gap 8, padding **3 4**, radius **4**, 1 border transparent. Row ≈ 25 (19 key + 6). | `-option` |
| Key | A **letter** (A, B, C…), not a number: a button 19 × 19 min, 1 border `panel-border`, radius 3, 10 bold system font | `-option-letter`; JS `String.fromCharCode(65+i)` |
| Label | 13, secondary ink → primary when the question is active. Once something is chosen, unchosen labels drop back to secondary. | `-option-label`, `-option-unselected-with-selections` |
| Hover | `list-hoverBackground` | `-option:hover` |
| Keyboard focus | `list-activeSelectionBackground` and a 2 outline in the input focus colour at offset −2 | `-option-focused` |
| Chosen | The key fills **yellow** with editor-background ink; the label turns primary. No row fill. | `-option-letter-selected`, `-option-label-selected` |
| Free text | The last lettered row, "Other..." as a 1-row auto-growing textarea (13 / 1.4, transparent, no border). Focusing it selects it. | `-option-freeform`, `-freeform-input`; JS `dxS` |
| Multi-select | Per question `allowMultiple`: the same lettered rows, several yellow keys | JS `Cub(…, allowMultiple)` |
| Footer | Right-aligned, gap 8: **Skip** (text button, keybinding label "Esc") and **Continue** (primary, yellow fill, keybinding label "⏎"). Continue is disabled until every question is answered. | `-actions`; JS `Qd{variant:"text",keybinding:"Esc"}`, `Qd{variant:"primary",keybinding:"⏎"}` |
| Keys | **A–Z** pick an option (the last letter focuses "Other"). **↑↓←→** move focus through the options, wrapping. **Space** picks the focused one. **Tab / ⇧Tab** go to the next or previous question. **Enter** continues when all are answered. **Esc** skips the questionnaire. A single choice moves to the next unanswered question. | JS `pxS` keydown switch |
| Narrow | `@container (max-width:199px)` hides "N of M"; at 164 the stepper hides | C-IDE CSS |

## 2. Cursor Agents window (C-GL): one question at a time, in a tray above the composer

| Part | Value | Source |
|---|---|---|
| Where | A `Tray` stacked on the composer: placement bottom, `transform-origin: bottom center`, opens from 4 down at scale .99. It can minimise to a pill, "Answer questions (N)", with a needs-attention dot. | `y2n.base`; `"questionnaire-collapsed-pill.react.js"` |
| Surface | `bg-elevated`, `box-shadow-soft`, radius **xl 12**, `backdrop-filter: blur(8px)`; hover border `bg-tertiary` | `y2n.base` |
| Header | Padding 8 12, gap 8; this tray drops the bottom padding (`paddingBottom:false`). Title "Question" / "Questions" / "Questions from {agent}" in the **muted** tone. Trailing: Minimize (−) or Dismiss (×), tooltip shortcut "Esc". | `TrayHeader` atoms `ui-u5oo3g` `ui-1o7kk3e`; `$7_()`; `KSe` / `Yzs="Esc"` |
| Body | Scroll area `maxHeight: 320`, with 24 fades top and bottom; content inset 12 each side | `z9T` `maxHeight:320`; `Tray.js` `topFadeSize:24`; `VWp.content` |
| Steps | **Only the current question renders**. It slides in forward or back (`duration-slow`, ease-out-cubic). An inactive step would show at opacity .7. | `TraySteps.js` `Pp0`; `NTi.root` |
| Question text | Margin 6 above, 8 below. **15/24** in glass mode (`font-size-lg`), weight 400, primary ink; Markdown `size:"md"` | `NTi.header`, `NTi.title`; G-CSS `body[data-cursor-glass-mode=true]` |
| Options | Column, gap **2** | `NTi.options` |
| Option row (letter style) | A `<button>`, flex center, gap 8, padding **6 6**, radius **lg 8**, no border. Full width + 12 with −6 margins, so the key aligns with the question text. Row = 6 + 20 + 6 = **32**. | `VVe.root` (`data-label-style='letter'`) |
| Key | A **letter** in a **20 × 20** square, radius **4**, 12 weight 500, `bg-tertiary`, tertiary ink | `VVe.badge` |
| Label | Text md **13/18**, secondary ink → primary when chosen; wraps (no truncate). A description slot exists (tertiary, gap 2) but questions don't use it. | `VVe.label`, `VVe.content`; `TrayOption.js` |
| Hover | Row fill `bg-tertiary` at 50% | `VVe.root` `:hover` |
| Chosen | The same 50% fill stays. The key turns `bg-yellow-secondary` with `text-yellow-primary`; the label goes primary. No outline in letter style; the number style adds a 1 `stroke-tertiary` border. | `VVe.root` / `VVe.badge` `[data-selected]` |
| Free text | The last lettered row, "Other...". Its input is the composer's own editor (embedded, plain text, with @-mentions and /-commands); placeholder tertiary. Typing selects it; Enter submits it. | `H9T`; `rw.Editor{placeholder:"Other..."}` |
| Multi-select | `allowMultiple` per question: the same rows, several chosen; no auto-advance | `U9T`, `ie` |
| Footer | Padding 12, gap 6, min-height 40, right-aligned. **Left** (margin-right auto), only when there are 2+ questions: a stepper with chevron-left, "N of M" 13 tabular tertiary, chevron-right (sm text buttons, gap 0). **Right**: **Skip** (default button), then the primary **Next** (another question waits) or **Continue** (`tone:"plan"`) with an inline shortcut label at 9 px, opacity .7. | `S2n`; `TrayHeaderStepper.js` `Z8p`; `q9T`; `TrayFooterShortcut` `ui-vwhms9` |
| Keys | **A–Z** pick and focus an option. **↑↓** move between options, wrapping; **Home / End** go to the first or last. **←→** go to the previous or next question. **Enter** on a chosen option advances or submits. Global **Enter** runs Continue / Submit when focus is not in an input; **⌘⇧Enter** skips. **Esc** minimises or dismisses the tray. ⇧Tab cycles the composer mode. A single choice advances to the next unanswered question. | `Tray.js` `zWp` keydown; `questionnaireTrayContinueOrSubmit` → `Ze.Enter`; `questionnaireTraySkip` → `CtrlCmd+Shift+Enter` |
| After | The transcript keeps each question's prompt with its chosen labels and free text | `"ask-question-display.js"` `Vxp` |
| Narrow | No questionnaire-specific rule. Labels wrap, and the tray takes the composer's width. | — |

## 3. Claude desktop (CL-Q): the composer's place, numbered, mostly no footer

| Part | Value (comfortable · compact) | Source |
|---|---|---|
| Where | A banner docked **in the composer's place** (`bannerRef`, "auq-banner-owner"). It hides other tool cards while pending. Once answered, the transcript draws the answers (`my-4`). claude.ai measured the same place live. | CL-Q `qS`; `cc1aae219` `QB`; `c05b96c7f` `Md`; `live.md` |
| Surface | `bg-surface-3 rounded-composer shadow-composer` (the composer's own card, radius 12 / 14); padding-top 12, `overflow:hidden`. Focus: inset 1 `--cds-fill-accent`. | `iC = pu + …`; `pu` in CL-Q |
| Heading (optional) | `title`: `text-body` secondary, line-clamp 3, padding 0 12 2 16. With a heading, the question turns semibold. | CL-Q `Hn`, `Wn` |
| Question row | `flex items-center gap-2`, padding 0 12 6 16. The question is primary ink at the card's size (measured 14/21). Trailing: a stepper (CaretLeft, "1 of N" `text-sm` muted tabular, CaretRight; xs ghost buttons, gap 2) and Dismiss (×, xs ghost) | CL-Q `Zn`, `Xn` |
| List | Padding 6 (`p-1.5`). Max height `min(45vh, 420px)`, **snapped to whole rows plus a ⅔-row peek** (`round(up, …)`); scrolls with a fade | `mC`; MAIN `.supports-[height:round…]` |
| Option row | `flex items-center gap-2.5` (10), **min-height 44 · 36** (`--cds-question-row-h` 2.75rem · 2.25rem), padding **6 10 · 4 8**, radius **12**. Hover `alpha-1` (5%); press scale .99; focus-visible `alpha-1` with an inset 1 accent ring | `oC`, `sC`, `nC`; MAIN |
| Between rows | A **0.5 hairline** `alpha-2` inset 12, hidden on either side of the hovered or active row | `pC`, `kn` |
| Key | A **number** 1–9 (none past 9) in a **28 · 24** square, radius **8**, `alpha-1` → `alpha-2` when active; `text-sm` muted → primary. Hidden on touch, and when there is only one option. | `fC`; `OC` `n<9?n+1:null` |
| Label | `text-sm` 14/20, break-words, secondary → primary when active | `OC` |
| Description | `text-footnote` 13/17 · 12/15, `--cds-text-stays-secondary` (muted), gap 2 under the label | `OC` |
| Trailing hint | Single-select only: ArrowRight, or ArrowReturn on the last question, sm muted, `me-2`. Invisible until the row is hovered or focused; hidden on touch. | `OC` `C` |
| Chosen | Radio group (single) or checkbox group (multi). A single choice **submits at once** and moves to the next question; there is no resting "chosen" state. The live 5% fill is the hover / active fill. | `al`/`il`, `Zt` → `Gt` |
| Free text | The last row, "**Something else**", or the question's own `placeholder`. Row height = row-h, padding 0 10, radius 12, hover / focus-within `alpha-1`. A **pencil (Edit 14)** sits in the same 28 key square. Input `text-sm`, placeholder muted. Trailing: **Skip** (sm) while empty, then a send-style icon button (→ Next, or ↑ Submit in the brand colour on the last question) once typed. Typing in single-select dims the list to 40%. Any printable key typed while the card has focus goes into this field. | `uC`, `dC`, `Nn`, `un`/`dn`, `Tn` |
| Multi-select | A checkbox in a 30 · 24 box in place of the number; the free-text row also gets a checkbox. Number keys toggle. | `OC` `o?…tt{checked}` |
| Footer | **Absent in the common single-select case**: Skip lives in the free-text row. It appears for multi-select, text-only questions, option previews, or when free text is off but Skip is on: a full-width 0.5 hairline, then padding 6 16 6 20, min-height 48, caption ink. Left: "{n} selected" (multi). Right, gap 8: Skip (sm), then an icon-only confirm (→ "Next" primary, or ↑ "Submit" brand on the last). Disabled reason: "Select an option to send". | `or`, `Mn`, `En`, `eC` |
| Previews | Options with `preview`: from a 30rem (480) container, list ⅖ beside a preview pane (min 160); narrower, the preview stacks under the list, max `min(16rem, 35vh)`. Click once to preview, again to choose. | `hC`, `gC`, `_C`, `Qt` |
| Steps | One question at a time; slide in 0.2 s ease-out (RTL-aware). Skip on a question records "[No preference]" and advances; on the last question it submits. | `xC`, `U`, `Ux` |
| Keys | **1–9** pick (single: answer and advance; multi: toggle). **↑↓** move through the options, no wrap; ↓ past the last option enters the free-text field; ↑ from the field returns to the last option. **←→** go to the previous or next question (swapped in RTL). **⌘/Ctrl+Enter** submits. **Esc** dismisses ("[User dismissed — do not proceed…]"). | `pn`, `hn`, `gn`; `Wx` |
| Reply sent | "Q: … / A: …" per question; "(Select all that apply)" for multi | `B` in `qS` |
| Narrow | The list snaps to rows; labels and descriptions wrap; the heading clamps at 3 lines; keys and hints hide on touch; previews stack below 480 | above |

## 4. The owner's two references, against the products

| Reference trait | Closest product | Note |
|---|---|---|
| (a) Serif title "What would you like to do?" | none | Every product sets the question in the UI sans: Cursor 13 semibold / 15 regular, Claude 14 primary. Claude's optional heading sits *above* the question in secondary ink, not as a display title. |
| (a) Number in a small square keycap | Claude (28, radius 8, 5% fill); Cursor glass (20, radius 4, letters) | Both fill the square; Cursor IDE alone outlines it (1 border, radius 3). |
| (a) First row hovered on a grey plate | Claude `alpha-1` 5%, radius 12; Cursor glass `bg-tertiary` 50%, radius 8 | Neither is a full pill: the plate's radius is under half the row height (12 of 44; 8 of 32). |
| (a) Final row "Type it your own" in muted ink | Claude "Something else" (muted placeholder, pencil key); Cursor "Other..." (lettered, tertiary placeholder) | All three end the list with the free-text row. Only Claude marks it with an icon rather than a key. |
| (a) Footer: ↑↓ "to navigate", "Dismiss ESC", black "Submit ⏎" | Cursor (Skip "Esc", Continue "⏎" shortcut labels inside the buttons) | No product prints a "↑↓ to navigate" legend. Claude has no footer for single-select, and its Dismiss is an × in the header. |
| (b) Options in a 2-column grid | none | All three stack one option per row. Claude's only two-column layout is list + preview, from 480. |
| (b) "1." numerals | Cursor IDE "1." on the *question* number | Option keys are bare digits (Claude) or letters (Cursor). |
| (b) Chosen option outlined | Cursor glass number style (1 `stroke-tertiary` border) | Claude never rests on a chosen state (a single choice submits at once). Cursor's letter style fills the key yellow. |
| (b) "1 / 5", progress dots, "Skip question" at the end | Cursor glass (footer-left "N of M" + chevrons; Skip right) | Every product says "N of M" with chevrons. **None uses dots.** Skip is a plain "Skip". |

## Patterns all agree on

| Pattern | Cursor IDE | Cursor glass | Claude |
|---|---|---|---|
| Lives at the composer, not in the transcript; the transcript keeps only the answer | toolbar section in the composer | tray on the composer | in the composer's place |
| Each option row is a whole hit target with a leading key square, then the label | 19 letter key, outlined | 20 letter key, filled | 28 number key, filled |
| One keyboard shortcut per option, shown on the key | A–Z | A–Z | 1–9 |
| Free text is the last row of the same list, not a separate field | "Other..." | "Other..." | "Something else" |
| Hover is a quiet neutral plate, under half-height radius | list hover | `bg-tertiary` 50%, radius 8 | 5%, radius 12 |
| Label ink rises secondary → primary for the active or chosen row | ✓ | ✓ | ✓ |
| A single choice advances by itself; multi waits for confirm | to the next unanswered | to the next unanswered | answers and advances |
| Multi-question progress is "N of M" with prev / next chevrons | header | footer left | header right |
| Skip is always offered; Esc leaves | Skip = Esc | Skip ⌘⇧⏎; Esc minimises or dismisses | Skip in the row or footer; Esc dismisses |
| Enter confirms | ⏎ Continue | ⏎ Next / Continue | ⌘⏎ Submit (Enter on the free-text field) |
| The question's position isn't a list of all questions (except C-IDE) | all listed, active in full ink | one at a time | one at a time |

## Open choices for Area

1. **Numbers or letters.** Claude uses 1–9, which reads as "press this". Cursor uses A–Z, which leaves digits free and has
   no 9-option cap. The owner's references both use numbers.
2. **Key square size.** The row height follows from it: 28 in 44 (Claude comfortable), 24 in 36 (Claude compact), 20 in
   32 (Cursor glass). At Area's type 13 / Compact, 20–24 sits closest to the controls already in the app.
3. **What "chosen" looks like when the card doesn't auto-advance** (multi-select, or a review step). Options: a filled
   key (Cursor yellow), a 1 outline (Cursor number style, reference b), or a checkbox in the key's place (Claude multi).
   Claude has no resting single-choice state.
4. **Footer or no footer.** Claude drops it for single-select (Skip inside the "Something else" row). Cursor always has
   one (Skip + Continue with shortcut labels). Reference (a) adds a ↑↓ legend no product has.
5. **Progress.** "N of M" with chevrons (all three) or dots (reference b, no product). Header (Claude, Cursor IDE) or
   footer-left (Cursor glass).
6. **Hairlines between rows** (Claude, 0.5 inset 12, hidden next to the hovered row) or a gap of 2 (Cursor glass).
7. **The free-text row's lead.** A key like the others (Cursor) or a pencil icon in the key square (Claude).
8. **Grid of options** (reference b). No product does this. Claude's only side-by-side is list + preview at ≥ 480. A
   grid would need its own narrow-width rule (one column below a container width) and a keyboard model for ←→, which
   all three products already spend on moving between questions.
9. **Question type.** Products use the reading size in UI sans (Cursor glass 15/24, Claude 14/21). Reference (a)'s
   serif display title has no precedent.
