# Rendered review: status, feedback and conversation (32 families, prefix VS)

Reviewer of the rendered capture set, 2026-11-11. Read-only. Shipped defaults (type 13, density 32, radius 10), light
and dark.

## 1. Method and coverage

- **Source.** The capture set described in `rendered-method.md` (headless Edge, `#system/area/components`, 100% zoom,
  every tile's stage `scale: 1`). Every length below is from `out/<slug>/measure.json` (rects, padding, radius, font,
  colours light | dark), dumped per tile with a small script into the scratchpad (`rendered/review-VS/<slug>.txt`,
  one line per element). Pictures were read only to look, never to measure. Crops: `rendered/review-VS/c/<slug>-L-NN.png`
  (light) and `-D-NN.png` (dark), 1 image px = 1 CSS px; `rendered/review-VS/crop-meter-default.png`.
- **Text centring.** `texts[].box` is the font's content area (13px Geist = 17 tall, 11px = 14), so "top/bottom inset" is
  content-area centring, a proxy for cap centring that is exact only when compared between marks of the same font.
- **Colour.** `L` = OKLCH lightness as computed (light page surface L1.000, dark L0.085).
- **Code read** only to locate the cause of a rendered effect: `surface.css` (Alert, Toast), `composer.css`,
  `display.css` (Progress), `specimen-names.mjs`, `canvas.css`, `pages.mjs`, `specimens.mjs`.
- **Viewed, light (every tile):** alert, avatar, badge (85 tiles), badge-group, code, code-block, count, empty-state,
  indicator, meter, progress, separator (measures + sheet), shortcut-list, skeleton, spinner, tag, toast, approval,
  attachment, citation, composer (16), composer-menu, edit-summary, message, model-picker (and its open capture), plan,
  prompt-suggestions, queue, scroll-to-latest, step, timestamp (measures), turn-notice.
- **Viewed, dark:** alert, toast, badge, composer, message, plan, code-block, approval, empty-state, skeleton, progress,
  meter, spinner, step, attachment, edit-summary, queue, tag, count, indicator, prompt-suggestions (default and most
  complex tiles); the rest by their measured dark colours only.
- **Could not verify:** hover, focus and pressed paint (rest states only); animation; whether the gallery's Auto zoom
  avoids the clipping in VS19 (the capture forces 100%); the Skeleton media wrapper's `overflow` (VS21).

## 2. Scorecard (1 to 5)

| Family | Bal | Spc | Type | Shape | Col | Feel | Verdict |
|---|---|---|---|---|---|---|---|
| Alert | 4 | 3 | 4 | 3 | 4 | 3 | Good bar; action drops to a 2nd row under 480; tone title ink differs from Toast; corner control not concentric |
| Toast | 4 | 4 | 4 | 3 | 4 | 4 | Clean; same inset as Alert; control 3 off concentric |
| Badge | 4 | 4 | 4 | 4 | 4 | 3 | Solid ladder; Plain drops to 400; three tone names paint the same in light; demo copy lowercase |
| Badge group | 4 | 4 | 4 | 4 | 4 | 3 | Fine; "auto" tile shows a stray resize grip |
| Count | 5 | 4 | 4 | 4 | 4 | 4 | Centred, tabular; docs give wrong heights |
| Tag | 3 | 4 | 3 | 3 | 4 | 4 | 13 text in an 18 mark, side 5, corner 4: the odd one among marks |
| Indicator | 4 | 4 | 4 | 4 | 4 | 4 | A second counter at 16/500 beside Count's 18/400 |
| Citation | 3 | 3 | 2 | 4 | 3 | 3 | Pill text 0.6 high; fill barely visible; 9.15px footnote |
| Timestamp | 4 | 4 | 4 | – | 4 | 4 | Plain 12/16 muted; fine |
| Code | 3 | 3 | 2 | 3 | 3 | 3 | 11.375/15.36 off-ramp, 21.38 tall, taller than the line |
| Code block | 2 | 3 | 3 | 2 | 3 | 3 | Wrapped number centred (not first line), 13/11.5 corners, header aligned to nothing |
| Avatar | 4 | 4 | 4 | 4 | 3 | 3 | Initials plate faint; Group demo mixes circles and squares |
| Separator | 4 | 4 | – | 4 | 2 | 4 | 7.5% line, near invisible in dark |
| Shortcut list | 4 | 4 | 3 | 3 | 4 | 2 | Every inline tile clipped at 100%; Kbd keys 11/10 |
| Empty state | 4 | 4 | 4 | 4 | 3 | 3 | Good rhythm; icon plate nearly invisible; Panel's ghost action reads as text |
| Meter | 3 | 4 | 3 | 4 | 4 | 2 | Every tile clipped at 100%; label/value differ from Progress |
| Progress | 4 | 4 | 4 | 5 | 4 | 4 | Shipped-product proportions (4/6/8, pill) |
| Spinner | 4 | 4 | – | 4 | 4 | 4 | Good sizes 12/16/24, 25% track |
| Skeleton | 3 | 4 | – | 3 | 4 | 3 | Text bar = font size, 4 corner everywhere (52-tall slab) |
| Approval | 4 | 4 | 4 | 3 | 4 | 4 | Strong; key corner 2; Answered keeps "Esc to cancel" |
| Attachment | 3 | 3 | 4 | 4 | 3 | 2 | File card half empty, PDF said twice; checkerboard default |
| Composer | 3 | 3 | 4 | 3 | 4 | 3 | Footer note centred, footer not pill, round actions in a 19 corner |
| Composer menu | 3 | 3 | 3 | 3 | 4 | 4 | 1px narrower than the composer, 7 gap, 14 vs 19 corners, 11 path |
| Edit summary | 4 | 4 | 4 | 4 | 4 | 4 | Good; head 34 where siblings are 30 |
| Message | 3 | 3 | 4 | 4 | 2 | 3 | Light bubble almost invisible; actions not optically aligned; actions shown while streaming |
| Model picker | 4 | 4 | 4 | 4 | 4 | 4 | Fine; label shows "With aheading and adisabled row" |
| Plan | 5 | 4 | 4 | 4 | 4 | 5 | Best of the chat cards |
| Prompt suggestions | 4 | 4 | 4 | 3 | 4 | 4 | Good alignment with the composer; chips rad 8 under pill actions |
| Queue | 4 | 4 | 3 | 4 | 4 | 4 | Head drawn differently from Plan's |
| Scroll to latest | 4 | 4 | 4 | 4 | 4 | 4 | Fine; shows the column's flat 24 rhythm |
| Step | 4 | 4 | 4 | 4 | 3 | 4 | 18 rows (target), 7.5% rail |
| Turn notice | 1 | 2 | 3 | – | 4 | 1 | Two of three tiles collapse to 75 wide, text wraps |

## 3. Findings, most severe first

### VS1 · inconsistency · The chat set has no single card: eight corners and eight text insets

What and where (all from measure.json, outer edge to first text, border counted):

| Family (tile) | Corner | Text inset (side) | Head height | Title style |
|---|---|---|---|---|
| Composer (stacked) | 19 | 16 (7 + 1 pad, 8 textarea) | – | – |
| Approval (default) | 19 | 12 (11 + 1) | – | 13/18 500 default |
| Plan (default) | 16 | 13 (1 + 12) | 30 | 13/18 **400** default |
| Queue (default) | 16 | 13 | 30 | 13/18 **400 muted** |
| Edit summary (default) | 16 | 13 | **34** | 13/18 400 default |
| Message bubble | 16 | 14 | – | – |
| Code block md / sm | **13 / 11.5** | 11 (title) / 15 (numbers) | 34 / 31 | 13/18 400 / 11/14 |
| Diff (edit-summary variant-diff) | 4 | 11 to numbers | – | – |
| Attachment (standalone / in composer) | 8 / 11 | 8 | – | – |
| Alert, Toast | 10 (16 titled) | 10 | – | 13/18 500 |

Families: Composer, Approval, Plan, Queue, Edit summary, Message, Code block, Attachment (and Alert, Toast). A
transcript that stacks a Plan, an Approval and a Code block shows three corners (16, 19, 13) and three insets (13,
12, 11) within a few rows. The best references hold one: Claude's `rounded-card` 10 for popover, dialog, menu, card and
bubble; Cursor 12 (ref-cursor-claude.md §2.4).

Rule-level fix: one "chat card" recipe in `surface.css`: corner `radius-container` (16), text inset `inset-surface-sm`
measured from the outer edge with the border counted once (12 at default), head row `ui-row` (30), title 13/18 500
default ink (VS7). Composer and Approval keep the composer corner (they are input surfaces) and inherit the same 12
inset; Code block's corner becomes the card's (16) or `radius-control-lg` (10), never a derived half pixel. Visible:
Plan/Queue/Edit text 1 px in, Code block corners 13 → 16 and 11.5 → 16 (or 10), Edit summary head 34 → 30, Approval
unchanged. Size M. Confidence high (values), medium (which corner is the rule's).

### VS2 · inconsistency · The small marks share neither height, side, corner, text size nor centring

| Mark (tile) | Height | Text | Weight | Side (edge to text) | Corner | Fill / edge | Text top/bottom in box |
|---|---|---|---|---|---|---|---|
| Badge md (default) | 18 | 11/14 | 500 | 6 | pill | 6% black / 7.5% border | 2 / 2 |
| Count md (default) | 18 | 11/14 tabular | 400 | 6 | pill | none or 6% / 7.5% inset ring | 2 / 2 |
| Tag md (default) | 18 | **13/18** | 400 | **5** | **4** | tone tint / 7.5% inset ring | **1 / 0** |
| Kbd md (shortcut-list) | 18 | 11/**10** | 500 | **4** | **6** | 6% / none | **2 / 3** |
| Citation pill (default) | 18 | 11/14 | 500 | **7** | pill | **L0.973 solid** / none | **1.41 / 2.59** |
| Indicator count (count-3) | **16** | 11/14 | 500 | 4 | pill | danger solid | 1 / 1 |
| Inline Code (default) | **21.38** (20 in prose) | **11.375/15.36** mono | 400 | 6 | 6 | L0.982 / L0.858 1px | 3 / 4.38 |
| Kbd in Approval option | **22** | 11/10 | 500 | 5+ | **2** | 6% | – |
| Kbd in Approval hint | 14 | 11/10 | 500 | 3 | **4** | 6% | – |
| Timestamp | text only | 12/16 | 400 | – | – | – | – |

Against the 13/18 line every mark but inline Code fits (≤ 18); Code at 20–21.38 exceeds the line box and, inline,
overlaps a chip on the next line by 2. Centring differs by up to 1.2 px between neighbours (Citation 0.6 high, Tag 0.5
low, Kbd 0.5 high, against Badge/Count exact). Corners for one height: pill, 4, 6. Families: Badge, Count, Tag, Kbd
(Shortcut list, Approval, Prompt suggestions, Code table), Citation, Indicator, Code.

Rule-level fix ("one mark"): a mark's height comes from the mark ladder (14 / 18 / 22), its text from `mark-label-*`
(11/14 at sm and md, 13/18 at lg) at every density (T6), its side `(H − 6)/2` counting the edge, its centring the
cap-centred padding Badge already uses, and its corner one role: pill for status and counts (Badge, Count, Indicator,
Citation), `radius-small` for object chips (Tag, Kbd, inline Code) at every height. Inline Code takes `line-height:
inherit` and `block-size: 1lh` minus 0 (T7's fix). Visible: Tag text 13 → 11 (owner pick, T6), side 5 → 6, Kbd side
4 → 6 and text line 10 → 14, Citation side 7 → 6 and text down 0.6, Approval keys corner 2 → 6, inline Code 21.38 →
18. Size M. Confidence high.

### VS3 · defect · Code block numbers a wrapped line at its middle, not its first line

What: `code-block` tile `wrap`: the line box is 74..110 (two visual lines), its number `area-code-block__linenumber`
sits at y 83 (centred), while line 2's number sits at 110 on its own line. AGENTS.md's geometry rule: "first-line
alignment for multiline text". Visible in light and dark (`c/code-block-L-00.png`, Wrapped).
Fix (rule, in `code.css`): the gutter aligns to the line's first line box (`align-self: start` / no flex centring).
Families: Code block, Diff (same gutter model; not wrapped in its demo). Visible: "1" moves up 9 px to the comment's
first line. Size S. Confidence high.

### VS4 · defect · Turn notice collapses when its container shrink-wraps

What: `turn-notice` tiles `status-stopped` and `status-compacted`: the notice is 75 wide (`@156.5,83 75x36`), its text
43 wide wrapping "Body / text" onto two lines, the rule beside it 24 wide; `status-error` (no rule) is fine. The
component has no minimum or full-width rule and the text may wrap. A divider notice ("Stopped", "Context compacted")
in Claude and ChatGPT is a full-width line with one-line text.
Fix: `.area-turn-notice { inline-size: 100% }` for the ruled kinds, text `white-space: nowrap` with ellipsis; the demo
gives the column width. Visible: one line of text between two rules. Size S. Confidence high.

### VS5 · defect · Tile names drop the space after "a" and an opening parenthesis

What: `specimenWords` (`apps/desktop/src/content/specimen-names.mjs:82`) splits camelCase with `([a-z0-9])([A-Z])`, so
`inADialog` → "In adialog"; titles with a parenthesis lose it: "List (default)" (`specimens.mjs:251`) shows as "List
default)". 17 tiles in 15 families: badge "Ground, on alight color", code "In atable", meter "Segments with alimit",
model-picker "With aheading and adisabled row", scroll-to-latest "In aconversation", shortcut-list "In adialog",
spinner "Value in abutton", prompt-suggestions "List default)", plus copy-button (2), input "With affix", property-list,
stack, surface (2), time-field, video-player. The Sidebar list and the Canvas path use the same words.
Fix: split before a capital that starts a word too (`([A-Z])([A-Z][a-z])`), and keep titles that are already words
(take `title` when present). Size S. Confidence high.

### VS6 · inconsistency · The light component fill is too faint to read as a plate; dark's reads strongly

What: `bg-component` paints L0.982 on the L1.000 surface (Δ 0.018) and L0.200 on the dark L0.085 surface (Δ 0.115):
Message bubble (`message__bubble bg L0.982 | d L0.200`), neutral Alert, Attachment, Empty state icon plate, Code block
soft, Approval options, Code inline; Citation pill L0.973. In the light crops the user bubble and the Empty state plate
nearly disappear (`c/message-L-00.png`, `c/empty-state-L-00.png`), while in dark they read as clear plates
(`c/message-D-01.png`). References: Claude's bubble is a 6% fill (≈ L0.955 on white), ChatGPT's user bubble ≈ #f4f4f4
(ref-cursor-claude.md §2.1, line 363).
Rule-level fix (foundation, `emit/base.ts`): the light component step is set from the same perceived contrast as dark's
(about 3× today's Δ, L≈0.955–0.965), or a separate `bg-bubble`/`bg-plate` role at that step for plates that carry
content; contrast tests untouched. Visible: bubbles, plates, neutral alerts and option rows read as shapes in light.
Families: Message, Alert, Attachment, Empty state, Code, Code block, Approval, Citation. Size M. Confidence medium (the
references' exact bubble lightness is from the study, not re-measured here).

### VS7 · inconsistency · Sibling chat cards draw their head four ways

What: Plan head: title 13/400 **default**, chevron right after the title (`plan__chevron @97.59`), count 12/18 muted at
the end; Queue head: title 13/400 **muted**, chevron at the far end (`queue__chevron @309`); Edit summary: title 13/400
default + tone counts 12/18, actions at the end, head **34** tall; Approval: title 13/**500** default with description
below; Alert/Toast titles 13/500. Folded Plan shows "Plan ›" (chevron by the title), folded Queue "2 queued … ›" (at
the end) (`c/plan-L-00.png`, `c/queue-L-00.png`).
Fix (rule): a collapsible card head is title 13/18 500 default ink (DESIGN_SYSTEM "surface titles"), count/status at
the end in muted 12, chevron in one place for all (after the title, as Plan, Step and Reasoning do). Visible: Queue
title darker and its chevron moves; Plan, Queue, Edit titles to 500; Edit head 34 → 30. Families: Plan, Queue, Edit
summary, Step group, Approval. Size S. Confidence high.

### VS8 · defect · Composer's footer slot: centred note, square buttons, icons 2 px off the shell's

What: `composer` `slot-footer`: `p.area-composer-group__note` spans 84..336.6 and its text is centred in it (insets
99.78 / 99.77), so "Body text" floats between the left buttons and the model picker (`c/composer-L-01.png`; also
`composition-combined`, note centred under the shell). The footer's buttons are sm 26 with corner **8**
(`area-button--sm rad8`) while the header's pickers are pills (`radpill`): `composer.css:116` gives pills to
`.area-composer, .area-composer-group__header` but not the footer. The footer's + glyph box starts at x 33 against the
shell's + at 35 (button 28 + inset 7 vs 28 + 5): stacked parts' icons 2 px apart.
Fix: note start-aligned after the leading actions (or right-aligned before the trailing ones) per the spec; footer added
to the pills selector; footer and header controls sized so their glyphs share the shell's glyph column (md 30, or the
row's padding increased by 2). Size S. Confidence high.

### VS9 · refinement · One-line composer pairs circular actions with a 19 corner

What: `composer` `inline`: shell 46 tall, corner 19, actions md 30 at an 8 inset, drawn as circles (radius 15) by Pills ›
Composer. Concentric would be 19 − 8 = 11 (`--_composer-action-radius`, `composer.css:31`), or a 23 corner (pill)
for 15 circles. `composer.css:119` already makes the shell a pill when the send is a pill (`submitPill`). The owner's
recorded choice is Cursor's (corner 20 with pills), so this is the rule disagreeing with itself rather than a defect.
Fix options: when Pills › Composer is on and the composer is one line, corner = height/2 (as `submitPill`); stacked
keeps 19 with circular actions only if the rule records the exception. Visible: the inline shell becomes a full pill
(ChatGPT's). Size S. Confidence medium.

### VS10 · inconsistency · Alert and Toast agree on inset and icon, but not on action placement, title ink or controls' corner

Agreement (keep): both 36 tall one line, padding 8 + 1 border block and 9 + 1 inline, icon 16 at (18 − 16)/2 on the
first line, gap 8 icon → text, title-to-copy 4, corner 10 one line and 16 titled/multiline.
Differences:
- **Action placement.** Alert's container query (`surface.css:855–861`, `@container (max-width: 30rem)`) moves actions
  to a second row under 480: tile `action` ("Actions single line") renders 62 tall with "Action" alone on row 2
  (`c/alert-L-00.png`). Toast at 360 keeps "Undo" inline (`toast` `action`). A 348–480 alert (a panel or card) always
  gets two rows for one short action.
- **Title ink.** Alert info title `oklab(0.506 −0.037 −0.193)` (tone), Toast info title L0.277 (default). T12 confirmed.
- **Corner control.** Dismiss and last action: 5 from top and end, corner 8, inside a 10 corner: concentric needs 5
  (S2 confirmed for both, `alert dismissible`, `toast dismissible`, `toast action`).
- **Stale comments.** `surface.css:660–662` says one line is 40 and controls 6 in; renders 36 and 5. `:759–766` says the
  banner is 44 and controls 8 in; renders 38 and 6.
Fix: wrap the action only when the text no longer fits (flex-wrap on the content row, no width query), or use Toast's
behaviour; T12's rule (tone colours the mark, never the title); S2's concentric corner token; correct the comments.
Size M. Confidence high.

### VS11 · refinement · Message actions sit 7 px inside the text column, and show while streaming

What: `message` `author-assistant`: text starts at x 285.5; the action row's first ghost button starts at 285.5 so its
glyph starts at 292.5 (ink ~294.5): the row reads indented under the text. ChatGPT pulls an edge ghost button out by
`(size − icon)/2` so the glyph aligns with the text (`data-optically-align`, ref-chatgpt-figma.md §3.2). Buttons abut
(30 apart, gap 0). Gap text → actions is 10 for the assistant and 4 for the user bubble (`gap10` vs `gap4`).
`streaming`: the full six-button action row renders (opacity 1) beside the streaming cursor; Copy, Retry and Read
aloud act on an unfinished reply. (The references reveal actions on hover, ref-cursor-claude.md line 190; whether they
hide them while streaming was not measured here.)
Fix: the action row takes `margin-inline-start: calc((control − icon)/−2)` (−7) at the column edge (a Button
`optical` edge rule usable by Card, Toolbar and Message); one meta gap (4) for both authors or a stated reason;
actions hidden (not just transparent) while `streaming`. Size S. Confidence high (values), medium (streaming rule
without the spec's intent).

### VS12 · inconsistency · Two counters, and Count's documented sizes are wrong

What: Count md 18 tall 11/14 **400** tabular (`count default`); Indicator count 16 tall 11/14 **500**
(`indicator count-3`), the `16px + 2px` literal geometry already noted (G8). `pages.mjs:20` documents Count "sm (16) |
md (20)"; renders 14 and 18.
Fix: Indicator's count is Count sm/md on a danger solid (one component, one weight); docs from the ladder. Visible:
indicator count 16 → 18 (or Count gets a 16 size if a badge-on-icon needs it, stated once). Size S. Confidence high.

### VS13 · inconsistency · Kbd's corner shrinks as the key grows

What: Kbd md 18 tall corner 6 (shortcut-list), Kbd sm in Approval hint 14 tall corner 4, Kbd in Approval option 22
tall corner **2** (`approval default`, `area-kbd--sm rad2`). Its text is 11 on a 10 line (T8 confirmed); content area
77..90 in 75..93 sits 0.5 high. Side 4 (pad 3 + 1): the geometry census's "Kbd side (H − 6)/2 = 6" is refuted at md.
Fix: VS2's rule (corner `radius-small` at every height, side `(H − 6)/2`), and Approval's key a square Kbd of the
option's mark size. Visible: Approval keys rounder, menu keys 2 px wider. Size S. Confidence high.

### VS14 · inconsistency · Progress and Meter label their bars differently

What: Progress `labeled`: label 13/400 default, value 13/400 **default**, gap 8 to the bar. Meter `default`: label
13/**500** default, value 13/400 **muted**, gap 6 to the bar, description 12/16 muted. Same bar (both use
`area-progress`), same job.
Fix (rule, "label beside a value", T24's family): label 13/400 default, value 13/400 muted tabular, label-to-bar 6;
Meter's 500 only if every field label is 500. Size S. Confidence high.

### VS15 · defect · Composer menu is 1 px narrower than the composer it opens over

What: `composer-menu default`: menu 21..299 (278 wide), composer 20..300 (280); gap menu → composer 7 (181 → 188);
menu corner 14, composer 19 (`c/composer-menu-L-00.png`). `pages.mjs:1123` says the menu is "drawn above the composer
at its width". Path text 11/14 (T13 confirmed).
Fix: the menu's inline size is the composer's border box (inset 0), gap = the group gap 8, corner = composer corner
(or both 16 with VS1). Size S. Confidence high.

### VS16 · refinement · Code block: off-ladder corners, a header aligned to nothing, a loud dark highlight

What: corner md **13**, sm **11.5** (half pixel). Header filename at x 31 (11 from the edge); line numbers' right edge
43; code text 53 (`code-block default`): the filename aligns with neither column (unnumbered: filename 31, code 31 + 8 =
39 in the picture, aligned). sm header title 11/14 beside the language 11/17 (title box 48, language 47.5). Body: first
line flush under the header (gap 8 from the title's bottom), bottom padding 10. Code text 13/18 Geist Mono (Claude and
Cursor 12; reads large beside 13 UI text). Highlighted line 7% black in light, **19% white** in dark
(`code-block highlighted`): a bright band in `c/code-block-D-00.png`.
Fix: corner from VS1; header text on the code column (or numbers' left edge); one line-height for the header row; code
size `text-sm` 12 at md (owner check); dark highlight from the selected-wash role (≈ 8–10%). Families: Code block, Diff.
Size M. Confidence medium.

### VS17 · refinement · Edges at 7.5% vanish on near-black

What: Separator `srgb(0.16)/0.075` light, `srgb(0.93)/0.075` dark; same 7.5% for Badge border, Count and Tag rings,
Step group rail (`step__body bd…/1 srgb(0.16,0.16,0.16/0.075)`). On the dark surface a 7.5% white line is ≈ 7%
luminance step: the Step rail and separators are close to invisible in dark crops. Claude's one border is 10%
(`--cds-border` alpha-2), Cursor's dark ring alpha-2 (ref-cursor-claude.md §2.4).
Fix (foundation): the divider/mark edge role at 10% in both themes (or dark +2.5%), never below. Size S. Confidence
medium.

### VS18 · inconsistency · Badge: Plain drops to 400; three names paint one look

What: every Badge variant is 11/14 **500** except Plain **400** (`variant-plain-tone-*`). In light, Solid neutral, Solid
inverse and Soft inverse all paint `rgb(40,40,40)` with `rgb(250,250,250)` text (`variant-solid-tone-neutral`,
`-solid-tone-inverse`, `-soft-tone-inverse`); in dark all three are white. Badge's Content tiles each use a different
variant (soft, modern for avatar, color for flag and dismissible), so content cannot be compared.
Fix: Plain at the mark weight (500) unless T4 settles marks at 400 everywhere; either drop "inverse" from Soft and Solid
or make Solid neutral a step lighter than inverse; Content tiles on the default variant. Size S. Confidence high.

### VS19 · demo and gallery defects (list)

- **Clipped at 100%:** every Shortcut list inline tile and every Meter tile (stage `inline-size: max(100%, 384px)` in a
  388 card with 12 view padding): "Title" shows as "ïtle", values cut (`c/shortcut-list-L-00.png`,
  `crop-meter-default.png`). Same stage width in Chart, Description list, Drawer, File upload. Auto zoom may scale them
  (not verified).
- **Alert Multiline** shrink-wraps to 100 wide: "Body / text that / wraps / onto a / second / line", six lines
  (`alert multiline`, 56-wide content).
- **Message:** assistant tiles are centred and 221 wide; user tiles sit in a 480 column (156..636). The two authors are
  never shown on one column except in Scroll to latest. "Long message" joins two paragraphs with no gap.
- **Turn notice** collapsed (VS4).
- **Toast:** Caution and Discovery are grouped under Content (they are tones); Alert puts them in Tones.
- **Copy:** Badge tiles lowercase ("neutral", "info"), Badge group Title Case ("Neutral", "Info").
- **Avatar Group** mixes circular and square avatars in one stack.
- **Badge group "auto"** shows a floating resize grip with no visible container (`c/badge-group-L-00.png`).
- **Attachment default** is an empty checkerboard (a missing picture); Plan Rail shows two "Value" outline tags beside
  "Item one" with no meaning.
- **Approval Answered** keeps "Esc to cancel" (VS22).
Size S. Confidence high (pictures and measures agree).

### VS20 · refinement · Empty state: good rhythm, invisible plate, weak panel action

What: md: plate 46 (corner 14), plate → title 16, title 16/22 500 → description 13/18 muted 4, → actions 24; sm: plate
30 (corner 8), 12, 13/18 500, 12/16, 4, 12. The rhythm reads right. But the plate is `bg-component` L0.982 (VS6), so in
light it shows as a faint smudge; the Panel layout's only action is a ghost sm Button, which reads as plain text
("Action" floating, `c/empty-state-L-00.png`).
Fix: VS6's plate step; an empty state's single action is outline (or solid when primary), never ghost. Size S.
Confidence medium.

### VS21 · refinement · Skeleton: one 4 corner and a full-size text bar

What: every skeleton shape is corner 4: a 13-tall text bar, a 52-tall Display bar (`type-height`, 370 × 52), a 196 ×
110 media block inside an 11-corner media wrapper (`card`). A text bar's height equals the font size (13 for 13/18,
52 for Display), which makes large type read as a slab. Shipped skeletons draw text bars near the cap or x height and
round them by half their height or the surface's corner.
Fix: text bar height ≈ cap height of the role (rounded to whole px), corner `min(height/2, radius-small)`; a block takes
its container's corner (inherit). Visible: Display bar 52 → ~37 and rounder; card media corner 11. Size S. Confidence
medium (wrapper overflow not verified).

### VS22 · defect · Approval's answered state still offers to cancel

What: `approval state-answered`: option 2 shows a check and a darker plate, and the footer still reads "Esc to cancel"
(`c/approval-L-01.png`). The selected paint is a plate plus a muted check, weaker than the system's selected paint
(S9).
Fix: answered hides the hint (or says what was chosen), selected option takes the choice-card selected rule. Size S.
Confidence medium (spec intent not read).

### VS23 · refinement · Attachment file card is half empty and says PDF twice

What: `attachment kind-file` 160 × 64: name 12/16 at the top (77..93), "PDF" Badge sm at the bottom (111..125), 18 px
of nothing between; the file glyph already reads "PDF". `kind-quote` in the composer holds one line in the same 64.
Fix: name over a muted 12/16 meta line ("PDF · 2 MB"), card height from content (two lines + 8 + 8 = 48), the type
badge only when there is no glyph. Size S. Confidence medium.

### VS24 · refinement · The conversation column has one flat gap

What: `scroll-to-latest default`: user bubble → assistant 24, assistant → next user 24, paragraphs 16, joined bubbles 2,
status under a bubble 4, assistant → actions 10, composer group header/footer 8, prompt suggestions under the composer
20 (`prompt-suggestions default/chips`) but 8 inside a composer group (`composer composition-agent`), composer menu →
composer 7, scroll button → composer 24. A reply sits as far from its question as from the next question. Claude:
bubbles 2 apart, turns 20 (16 compact) (ref-cursor-claude.md §2.1).
Fix (rule for the chat column): joined 2, meta 4, attached part 8, question → its reply one step less than turn → turn
(e.g. 16 / 32 at default), suggestions under the composer at the group gap 8. Size S–M. Confidence medium (needs the
owner's eye; the references give turn gaps, not Q → A).

### VS25 · refinement · Citation pill: faint, off-centre text, sub-floor footnote

What: pill 18 tall, side 7 (Badge 6), fill L0.973 solid where every other mark uses an alpha; label content area
1.41 from the top and 2.59 from the bottom (0.6 high); footnote `[13]` at 9.152/9.152 (T22 confirmed).
Fix: VS2's mark rule (side 6, cap-centred padding, alpha fill as Badge soft), footnote at `text-xs`. Size S. Confidence
high.

### VS26 · refinement · Queue row actions are not concentric with the row

What: `queue default`: row 30 corner 8; its action buttons sm 26 at 2 in, corner **4** (concentric 6). Edit summary's
head actions get it right (corner 11 at 5 in a 16 card). Fix: row actions read the row's concentric corner (the S2
token). Size S. Confidence high.

### VS27 · opportunity · Gaps a shipped chat set would need, seen in the gallery

- Message: no edited marker, no branch switcher (‹ 2 / 3 ›), no inline-code/table/heading prose specimen in a reply.
- Toast: no stacked toaster picture (RC23; the Toaster tile shows only its trigger buttons).
- Composer: no "over limit" or error state; no attachment-uploading row in the composer.
- Step: no duration/elapsed for a group header (only leaf meta "2s").
Size M. Confidence medium.

## 4. Cross-family inconsistencies (summary)

1. Chat cards: corners 19 / 16 / 13 / 11.5 / 8 / 4, text insets 16 / 13 / 12 / 11 / 8 (VS1).
2. Marks: heights 14 / 16 / 18 / 21.38 / 22; corners pill / 6 / 4 / 2; text 11 vs 13; weights 400 vs 500 (VS2, VS12,
   VS13, VS18).
3. Heads: title weight 400 vs 500, muted vs default, chevron after title vs at the end (VS7).
4. Label + value: Progress 400/default + default; Meter 500/default + muted (VS14).
5. Corner controls not concentric: Alert, Toast (5 in, r8), Queue rows (2 in, r4) vs Edit summary correct (VS10,
   VS26).
6. Pills: composer header pills, footer square; prompt chips and Approval options square under a pill composer (VS8).
7. Light fills too faint vs dark (VS6); edges 7.5% (VS17); dark code highlight 19% vs light 7% (VS16).
8. Gaps around the composer: 7, 8, 20, 24 (VS15, VS24).

## 5. Wave-1 findings checked against the render

| Finding | Render says |
|---|---|
| T6 Tag text by density | Consistent: Tag md 13/18 at default (Badge/Count 11) |
| T7 Code block sm / Diff 17 line | Confirmed: 11/17 (`code-block size-sm`, `edit-summary variant-diff`) |
| T8 Kbd 11/10 fixed | Confirmed: `area-kbd` 11/10/500 |
| T12 Alert title tone vs Toast default | Confirmed (VS10) |
| T13 Composer menu path 11 | Confirmed: 11/14 |
| T22 Citation footnote sub-floor | Confirmed: 9.152/9.152 |
| G3 targets under 24 | Confirmed for Step rows (18), Badge/Tag dismiss 14 (widened by ::after per G3) |
| G12 (a) sm = md at Compact | Not applicable at density 32 (sm 14, md 18) |
| G12 (b) Tag lg side 6, text 11 | Side 6 vs Badge lg 8 confirmed; text **refuted** at default (Tag lg 13/22) |
| G12 (c) Badge label gap 1 / 3 / 4 | Confirmed (sm gap 1, md 3, lg 4) |
| Geometry census "Kbd side 6 at md" | **Refuted**: Kbd md side 4 (pad 3 + 1) |
| G8 Alert gaps 8 vs Toast ui-cluster | Both render 8 at default (no visible difference at 32) |
| S2 close buttons not concentric | Confirmed for Alert and Toast: 5 in, corner 8, needs 5 |
| shape-state "Code block corner not resolved" | Resolved here: 13 (md), 11.5 (sm) |
| RC8 two inks | Confirmed across the chat set (L0.277 and L0.510 only) |
| RC23 toast stacking | Confirmed absent (Toaster tile shows triggers only) |

## 6. Five best-looking families (do not disturb)

1. **Plan** — header text, item marks and rows share one 13 px column (`plan default` 67), rows 30 with a 4 list
   inset, spinner sm in the 16 mark slot, a folded state that becomes a clean pill.
2. **Approval** — concentric to the number (19 card, 12 in, options 7), title/description 13 500/400 with a 4 gap,
   keyboard hints that read as product, a grid and picture layout that hold the same rhythm.
3. **Toast** — the inset arithmetic (36 one line, text 10 in, icon on the first line) and a quiet white surface.
4. **Prompt suggestions** — the list's icon column lands on the composer's + glyph and chips start on its button edge;
   44 rows at reading size.
5. **Badge** (and **Count**) — exact 2 / 2 centring at every size, whole-pixel ladder 14 / 18 / 22, tabular counts.

Also right: Progress proportions (4 / 6 / 8 pill), Spinner sizes, Empty state rhythm, Edit summary's concentric head
actions, the message stack's 2 px join with 4 px meeting corners.

## 7. Five weakest families and what fixes each

1. **Turn notice** — full-width, one-line text (VS4).
2. **Code block** — first-line numbers (VS3), card corner and header column (VS16, VS1).
3. **Composer** — footer note and pills (VS8), one-line pill corner (VS9), menu width and gap (VS15).
4. **Attachment** — content-height file card with a meta line (VS23), a real picture in the default specimen (VS19).
5. **Message** — a visible light bubble (VS6), optically aligned actions hidden while streaming (VS11), demos in one
   column with both authors (VS19).
