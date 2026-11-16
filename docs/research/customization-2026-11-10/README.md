# Customization study: settings as a system, material, setup as a chat (2026-11-10)

Owner: "for the customization, i really want to look at the whole customization axises and how they can be combined and
applied, and what other levers to consider. i think materiality was briefly explored but the visual results of adding
transparency, gradient fills, inner shadows, transparent strokes, layer blurs, etc were not very effective or visually
appealing. it also wasnt clear which specific components would be themed or recieve what effects and to what degree …
I also want to look at the 'customization' process … i want it to be a simple chat exercise, which should carry over to
how the chat is used to ask for user to choose/preferences on specific design decisions, a/b choices or even sliders/
inputs to fill in your own decisions."

A study only: nothing under `packages/` or `apps/desktop/src` changed. Review page, with 48 proposals (36 before part 4, 45 before part 5) and their picks in
the `verdicts` collection (`verdicts/<id>` = `{ pick, note, at }`; empty at publish, each recommendation drawn as chosen):
**https://claude.ai/artifact/KYm9eaQ6TaDyKvAA8LpwiL**. Read the picks before building anything.

## For the session that implements this (read first)

**State at merge (2026-11-11).** A study: nothing under `packages/` or `apps/desktop/src` changed. 48 proposals, each with
a recommendation; the owner's picks in `verdicts` were **empty** at merge. The owner asked for a future session to
"implement the findings of customization study". Before building: read `verdicts` with ArtifactData (a pick wins over a
recommendation); if still empty, confirm with the owner that the recommendations stand, in one question, then build.
The later parts changed earlier recommendations; the list below is the current one and wins over the part sections.

### The current recommendations

| Id | Recommendation | Kind of change |
|---|---|---|
| a1 | Rename `shadow-rest` → `shadow-edge`, `shadow-resting` → `shadow-cards`, `surface` → `stroke-width`, `stroke` → `edge-contrast`; old attributes stay as aliases | Registry, output, agent settings list |
| a2 | A setting whose gate is closed stays, marked inert with the reason and a link to its gate | Inspector row (`inspector-rows.tsx`), needs a gate table (`NEEDS` in `content.mjs`) |
| a3 | 0–100 sliders get marks at the measured clear levels (`ladders.json`) and snap to them; exact values still type in | Inspector row, Setup, question card |
| a4 | Respace Pressed fill (dark), Hover fill (light), Resting shadow (light) so each range's ends are ≥ 4 ΔE00 apart, defaults kept | Foundation change (`area-foundation-change`), re-run `measure.mjs` |
| a5 | Stroke groups shown as three amounts (Containers, Controls, Structure) opening to the twelve | Inspector grouping |
| a6 | Danger hover, Hover lift, Options/Callouts stroke, Selected tint/edge, Label tint, Series lightness move one level down | `SETTING_GROUPS` presentation |
| a7 | Each light/dark pair is one row showing the open mode's value | Inspector row |
| m1 | Material is five independent 0–100 levers: Curve, Edge light, Well depth, Glass, Glow. No bundles, no Grain (r3) | Replaces `axes/material.ts` and `material.css` |
| m2 | Where material lands is the fixed component by effect table (`TABLE` in `content.mjs`): none / echo (half) / full | `material.css` selectors |
| m3 + r1 | Cards and side panels take Glass only where a product declares a backdrop behind its window; otherwise solid | A `data-area-backdrop` style hook, then `material.css` |
| m4 + r7 | No contact lever: Field shadow reaches solid buttons, thumbs and the selected segment; its top reaches 0 4 7 −5 at 12% with a 1px ring | `axes/depth.ts`, component CSS |
| m5 | Light always from the top; the angle retires | `material.ts` |
| m6 + r6 | Label rule: under a light label a gradient only darkens the foot on colored fills and sheen stays above the cap line; under a dark label sheen may run full | Derivation in `emit/base.ts` |
| m7 | Glow only on parts filled with a color, in that color | `material.css` |
| m8 | One Glass lever drives transparency and blur together | `material.ts` |
| m9 | Emboss and Page glow are left out | Retire |
| m10 | The five levers become registry settings under a Material heading; the Materials lab retires | Registry, Inspector, `pages/materials.tsx` |
| m11 | Under Glass, muted and tone text step up to their strong ink, so a menu can reach 67% opaque in light, 60% in dark | Component CSS under glass |
| r2 | Edge light includes a 1px outer ring in the part's own darker color | Part of Edge light |
| r4 | Edge light's lines are as wide as Stroke width | Part of Edge light |
| r5 | Edge contrast's top steps run on to full ink | Foundation change |
| r8, r9 | No label shadow; no patterns (dither, pinstripe) | Leave out |
| r10 | Curve runs −100 (lighter at the foot, the default direction in the references) to 100 | Part of Curve |
| r11 | Edge light's inner lines blur by the existing Shadow softness | Part of Edge light |
| r12 | Paint method "from the specs": the part's own color as the gradient, a gradient stroke that is light at the top and fades into the fill at the foot, the outer ring, no line along the foot | How every lever is drawn (see below) |
| c1 | One agent tool `ask_design` (schema `SCHEMA` in `content.mjs`) replaces `show_options` and the design uses of the question card | `electron/agent.cjs`, `chat/` |
| c2 | Six kinds: compare, choose, several, amount, value, confirm | Question card renderers |
| c3 | The agent asks only when the result is visible, not settled, and taste; otherwise decides, applies and reports with Undo | Agent prompt |
| c4 | An answer lands as the person's own message; tapping it re-asks from there | Chat transcript |
| c5 | Preview on hover, apply on pick, Undo kept with the session | Chat session state |
| c6 | Setup becomes about ten scripted questions in the chat; the rest by chapter on request | Replaces `pages/theme-setup.tsx` flow and `setup-questions.ts` |
| c7 | Seven picture modules fold to two: one pictogram module and the screen stage | `option-marks`, `choice-figures`, `choice-visuals`, `setting-preview`, `abstract`, `question-kit` |
| c8 | One setting row in Inspector, Settings, Setup and question cards | `inspector-rows.tsx` |
| l1 | Add Text face and Heading face (pairing is a rule) | New settings (`area-component-intake`, then `area-foundation-change`) |
| l2, l5, l6, l8 | Icon weight follows text weight; image treatment stays rules; data colors become more values of Series; texture left out | Fold / leave out |
| l3 | Add a Corner shape switch (round / smooth) from Corner 8 up, after an engine support check | New switch |
| l4, l7, l9, l10 | Nothing new for focus style or motion character; separation style is Setup's second question, not a setting; no second accent | None |

### Build order

1. **Settings hygiene** (a1, a2, a3, a5, a6, a7): no visual change, unblocks everything that names settings.
2. **Material** (m1–m11, r1–r12): five registry axes and the scope table. Range work (a4, r5, r7) as foundation changes.
3. **New levers** (l1, l3, l6).
4. **Chat** (c1–c8): the question tool, then Setup on top of it, then folding the picture modules.

### How material must be drawn (from part 5, all verified by eye at ten times size)

- **Reference CSS:** `ONE` in `poc-paint.mjs` (eighteen styles on one Area Button) and the `mx` block in
  `build-page.mjs` (the levers as `--fx-*` amounts on every family in the scope table).
- **The border bug:** Area's Button has a 1px transparent border. A background placed at the padding edge repeats into
  it, so the top border shows the foot's color: a visible line at the top and foot. Every painted part needs
  `background-origin: border-box; background-repeat: no-repeat`, written after any `background` shorthand.
- **No offset inner shadows** (`inset 0 2px …`): they draw a band with an edge. Light comes from the fill's own gradient,
  an even inner glow (`inset 0 0 blur`), or a radial bloom. Rings are feathered (a hairline plus a 1.5–3px blur).
- **Floors are not choices:** text 4.5:1, boundaries 3:1. Measured on the page: a colored fill has no room to lighten
  (blue accent label 4.7:1 flat); a menu's glass floor is 90% opaque in light as it is, 67% with m11. Two references
  break the floor as drawn (Edit, Search); Area's versions must not copy their labels.

### Not verified

- No pixel diff against any reference; all comparison was by eye in headless renders.
- Inspector › Theme and the Materials lab were seen in a static build, not driven in Electron.
- Card shade's visible steps; 3:1 boundaries of glass over arbitrary content; blur performance with many overlays.
- Radial fills lit from within (two references) are not covered by a linear Curve; not proposed as a lever.
- The thick see-through frame (one reference, read by eye) is a second wide ring no lever draws; shown as a 1px version.

### Rebuilding the review page

`npm ci && npm run build`, then `node docs/research/customization-2026-11-10/build-page.mjs <out.html>` and publish the
file to the same artifact URL. The page links the owner's private reference pins by number and never embeds them; keep it
that way. Pinterest needs the owner's sign-in in the browser pane to read the board.

## Files

| File | What it is |
|---|---|
| `inventory.mjs` → `inventory.json` | Every registry axis: tokens it sets, tokens derived from them (through `tokens.css`, `axes.css`, `base.css`), and the component stylesheets that read any of them |
| `measure.mjs` → `ladders.json` | Visible steps on today's build: the 2026-10-21 method (`../narrowing-setup-2026-10-21/measure-steps.mjs`) with today's 0 to 100 ranges, in a guest headless browser |
| `content.mjs` | The findings as data: what each setting needs to show, the relations, candidate levers, the component by effect table, every proposal, the tool schema |
| `render.tsx` | Server-renders the real components the page shows (`@area/react`, `@area/icons`) |
| `build-page.mjs` | Builds the page: fragments, the built stylesheet trimmed to the values the page sets, the proposed material CSS, the interactions |
| `shoot.mjs` | Screenshots and in-page evaluation in a guest headless browser, used to check the page and the lab |
| `recipes.mjs` | Part 4: the reference board's 53 pins (ids only), the nine styles with their recipes and audits, proposals r1–r9 |
| `poc.mjs` | Part 5, first pass: nine reference elements' measured layers (spec, sampled or estimated) and proposals r10–r11 |
| `poc-paint.mjs` | Part 5, final pass: `ONE` and `GALLERY` are the eighteen styles as paint on one Area Button (the reference CSS for building material); `PAINT`, `WRAP`, `EXTRA` and `NEW` are earlier passes kept for their layer notes |

Rebuild: `npm ci && npm run build`, then `node docs/research/customization-2026-11-10/inventory.mjs`, `measure.mjs`,
`build-page.mjs <out.html>`. The page is a build output and is not kept here.

## Part 1: the settings

61 registry axes (2,523 preset values) plus Contrast and Pills, 108 component stylesheets.

**Visible steps, today's build** (clear at a glance = CIEDE2000 ≥ 2 from the last kept level; 101-position scales sampled
every 5):

| Setting | Light | Dark |
|---|---|---|
| Layer contrast (101) | 2 | 4 |
| Edge contrast (17) | 4 | 14 |
| Hover fill (76) | 1 (range 1.7) | 5 |
| Selected fill (101) | 3 | 3 |
| Pressed fill (76) | 2 | 1 (range 1.0) |
| Floating shadow (9) | 2 | 4 (through its light rim) |
| Resting shadow (9) | 1 (range 1.2) | 2 |
| Field shadow (9) | 2 | 4 |
| Edge shadow, Shadow reach, Softness, Shadow color | 3, 3, 3, 1 | 0 change (range 0) |

Card shade was not measured (the specimen paints no card). Raising the dark page to lightness 24 lifts Resting shadow
from 2 to 3 clear levels; Floating from 4 to 5.

**Reach** (files that read the setting or anything derived from it): 16 settings reach more than 90 of 108; 12 reach five
or fewer (Danger hover 1, Options stroke 1, Callouts stroke 1, Series lightness 1, Hover lift 3, Buttons 3, Regions stroke
3, Tracks stroke 3, Selected tint 4, Selected edge 5, Tags stroke 5, Buttons stroke 5). Mode reads as 39 by this trace because palette
tokens resolve through `light-dark()` rather than `var()`; it reaches everything.

**Relations** (full list in `content.mjs`, drawn on the page): six multiply (ground × layers; width × edge contrast ×
group; four shadow amounts × four shapers; type × density → height → corner; accent × saturation × shade; tint hue ×
tint → text tint), six gate (Buttons and Selection gate five accent settings; a near-black page gates four shadow
settings; Speed 0 gates Easing and Feedback; width 0 gates fourteen stroke settings; Card shade overrides layers on cards;
Saturation 100 makes Muted equal Vivid), five overlap, eight are single-family.

**Proposals, ranked:** a2 say when a setting cannot show (inert with the reason, never hidden) · a3 marks at the measured
levels · a1 rename the four mismatched ids with aliases · a5 three stroke amounts opening to twelve · a6 single-family
settings to the detail level · a7 one row per light and dark pair · a4 respace three flat ladders (a foundation change).

**Candidate levers:** add Typeface and pairing (l1, two settings; heading weight a value of Heading face) and Corner shape
as a switch (l3, needs an engine support check); fold Icon weight into type (l2), image treatment into existing rules
(l5), data colors into Series as values (l6), Texture into material's Grain (l8); leave out Focus style (exists), Motion
character (exists), Separation style as a setting (it is Setup's second question, l9) and a second accent (l10).

## Part 2: material

Looked at every bundle in the app's Materials lab, built from this branch and opened in a headless browser (another
session's Electron window was open, so the app itself was not launched). Why they read as weak:

1. They paint on black and white: buttons are neutral by default, so white sheen on the dark page's white button and
   dark shade on the light page's black one change nothing. In dark all six look like None.
2. Fourteen levers land in the outer 1 to 3px of a 28 to 32px control and read as one darker outline.
3. Glass has nothing behind it: at Layer contrast 0 a card is the page's color, so see-through and blur show nothing.
4. The banded sheen crosses the label: computed from the bundle's values, about 4.2:1 for a white label on the neutral
   fill.
5. Glow puts accent light under neutral parts.
6. Half strength on secondary parts is below what shows.

**Proposed model (m1 to m11):** six independent levers, 0 to 100, no bundles: Curve (gradient with its sheen), Edge light,
Well depth, Glass (transparency with its blur), Glow, Grain. Light from the top (m5). Contact shadow folds into Field
shadow (m4). Emboss and Page glow left out (m9). Scope is the fixed component by effect table in `content.mjs` (`TABLE`,
12 groups × 9 effects, none / echo / full with one line each; m2). Cards take no glass, which reverses the 2026-10-17
call (m3). Material joins the registry (m10).

**Limits, measured on the page's components (4.5:1 floor):**

| Check | Light | Dark |
|---|---|---|
| Neutral solid label, Curve 100 | 7.4:1 (flat 14.1) | 11.7:1 (flat 16.9) |
| Blue accent solid label, flat | 4.7:1 | 4.7:1 |
| Same with the neutral button's top light and sheen | 3.4:1 | n/a |
| Menu's weakest text, solid | 5.7:1 | 11.9:1 |
| Glass floor, menu as it is | 90% opaque | 69% |
| Glass floor, muted and tone text stepped up (m11) | 67% | 60% |
| Glass floor, primary text only | 56% | 58% |

So: a colored fill takes no lightening and no sheen, only the darker foot (m6); Glass stops at the floor of the weakest
text a part holds, and the step-up rule (m11) is what lets a menu go far enough to read as glass in light. The
primary-text floors match `material.ts` (0.56 / 0.62 after its margin). Boundaries: no lever replaces a stroke; Edge light
only adds to one. Not measured: 3:1 boundary contrast of a glass overlay against arbitrary content, and performance of
blur on many overlays.

The page's material CSS (`build-page.mjs`, `mx`) is a prototype over the real components, not `material.css`.

## Part 3: the chat

What exists: Setup (41 questions, 13 essential, own controls, answers in a derived list, Reset but no per-answer undo),
`show_options` (2 to 4 pictured options, applies with Undo, state lost on reload), the plain question card (words only),
and 14 lab templates wired to neither.

**Proposed (c1 to c8):** one tool, `ask_design` (schema in `content.mjs`, `SCHEMA`), six kinds: compare, choose, several,
amount, value, confirm; "narrow, refine, confirm" is a sequence. Ask only when the result is visible, not settled by
earlier answers or measured defaults, and a matter of taste; otherwise decide, apply and report with Undo. Preview on
hover, apply on pick, undo stored with the session. An answer is the person's reply; tapping it re-asks from there. Setup
becomes about ten scripted questions in the chat (what you are making → quiet or layered → its amount → accent → where it
shows → corners → room → lift → flat or lit → dark check and name). Seven picture modules fold to two (pictograms, the
screen stage); one setting row in all four editors.

The page runs this end to end on real `Approval`, `Slider`, `Segmented`, `Input`, `Composer` and `Message` markup.

## Open (as of part 3; superseded by "For the session that implements this" at the top)

- Picks: all 36 (a1–a7, l1–l10, m1–m11, c1–c8).
- m3 reverses an earlier owner decision; it needs an explicit pick.
- l3 needs a support check for smooth corners in the app's engine before it is built.
- a4 and any lever build go through `area-foundation-change`; a new typeface setting through `area-component-intake`.

## Part 4: the reference board as recipes (added 2026-11-10)

Owner: "go through … all these visual references from pinterest. i want to see if material can help all of these
'themes'/ ui styles be possible, not just through material, but by some combination of color, stroke, corner, density,
typeface, etc. i want you to evaluate and audit the 'recipes'". Board: https://www.pinterest.com/ethanw0ng/oval/material/
(needs the owner's sign-in), **53 pins**, all seen, in board order; ids and the grouping are in `recipes.mjs`. Pin images
are not copied to the page or the repository: the page links each pin by number. Exact values come from the four
annotated spec pins (22, 23, 25, 29); the other 49 were read for structure at contact-sheet size, not measured.

| Style | Pins | How far Area gets | Material levers | What else it needs |
|---|---|---|---|---|
| Flat and quiet | 9 | Reachable today | none | nothing |
| Soft raised light | 11 | Needs the material levers | Curve, Edge light, Well depth | Edge light's outer ring (r2); Field shadow's top (r7) |
| Dark raised with lit edges | 7 | Needs the material levers | Curve, Edge light, Well depth, Glow | outer ring (r2) |
| Glowing color buttons | 4 | Needs the material levers | Curve, Edge light, Glow | outer ring (r2) |
| Glossy gel | 2 | Needs the material levers (render unfaithful, see below) | Curve, Edge light, Well depth, Glow | outer ring (r2); sheen rule (r6) |
| Light frosted glass over color | 8 | Needs material and one new rule | Glass, Edge light | glass on panels and cards over a declared backdrop (r1) |
| Dark glass over a scene | 5 | Needs material and one new rule | Glass, Edge light | the same rule (r1) |
| Beveled gray desktop | 4 | Partly reachable | Edge light, Well depth | Edge light as wide as the stroke (r4); typeface (l1); a page darker than lightness 90 (left out) |
| One-bit desktop | 3 | Partly reachable | none | Edge contrast to full ink (r5); typeface (l1); dither patterns (left out, r9) |

**What each lever unlocks (styles of 9 / pins of 53):** Edge light 7 / 41 · Curve 4 / 24 · Well depth 4 / 24 · Glow 3 / 13 ·
Glass 2 / 13 · Grain 0 / 0 (one pin, 38, has faint noise of about 3 levels when sampled; no style depends on it). Missing pieces: outer ring 4 / 24 · backdrop rule 2 / 13 · typeface 2 / 7 · the rest one
style each.

**Reference floors.** Pin 29's spec breaks the text floor: a white label is 4.3:1 on 7F5EFF and 3.1:1 on 997FFF (computed
from its hexes); Area deepens the shade and never lightens behind the label. Pin 25's button boundary is an E7E7E7 ring
on white (about 1.2:1). Muted text on glass in several pins is visibly under 4.5:1 (not measured).

**Earlier recommendations changed:** m1 six levers → five (Grain out, r3; Edge light gains the ring, r2) · m3 "cards never
take glass" → "only over a declared backdrop" (r1) · l8 Texture: fold into Grain → leave out · m6 refined by r6 (sheen
capped under light labels only) · m4 stands with a range condition (r7). Unchanged and supported: m5 (light from the top;
the bevel is approximated), m7 (own-color glow), m9 (no emboss: the soft raised pins use one shadow and one rim).

**New proposals:** r1 backdrop rule · r2 ring inside Edge light · r3 Grain out · r4 Edge light follows Stroke width · r5
Edge contrast's top reaches full ink · r6 sheen rule · r7 Field shadow's top · r8 no label shadow · r9 patterns stay out.

**Not verified:** the gel style's pale fill with a dark label did not come through the Shade setting in the prototype, so
its render keeps a mid-blue button with no gloss band. The beveled and one-bit renders prototype r4, r5 and a bitmap
face (VT323, standing in for l1) over the real components and are approximations. Backdrops are CSS gradients.

## Part 5: proof of concept, nine elements layer for layer (added 2026-11-10)

Owner: "recreate some of the more simple buttons/ui elements in the exact style with as much detail matching the original
reference (inner glow, shadow, gradient stroke, gradient, stroke, double stroke, transparency, density, corner, etc) just
as a proof of concept. research the correct recipes". Nine elements (pins 23 Accept, 25 Cancel, 22 Benefits, 29 Edit, 11
OK, 39 Details, 9 Today, 37 Create, 27 Search) recreated on Area's Button markup with one-off CSS; every layer, its
source and its Area equivalent are in `poc.mjs` and on the page.

**Method.** Each pin's original image was read per pixel in the signed-in browser (canvas, column and row profiles
through the element); nothing was downloaded. Scale comes from a layer of known width: Accept's 1px ring measures 8 image
px, Cancel's 2px ring 11, Benefits' 2px inner shade 24, Edit's 2px ring 20. Values are `spec` (the pin's annotation),
`sampled` (read from pixels) or `estimated` (corner radii for all nine; the scale of the five pins without a spec).

**Findings.**
- All nine have an outer ring of 1 to 2px in the part's darker color or the page's (supports r2).
- Six of nine gradients are lighter at the foot than the top (Accept 201E25 → 323137, Cancel F4F4F4 → FFFFFF, Edit
  7F5EFF → 997FFF, and a foot rise on OK, Today and Create); Details and Search darken toward the foot. → **r10**: Curve
  runs −100 to 100.
- Three have a soft inner glow, a line fading over 2 to 6px (Create, Search, Details). → **r11**: Edge light's blur
  follows the existing Shadow softness.
- Not reachable by levers: Edit's label shadow (r8), exact six- and five-stop gloss (OK, Today; Curve with sheen comes
  close), Details' second outer plate (seen above the pill only; not confirmed all round).
- Two break the text floor as drawn and are kept exact: Edit 4.3:1 to 3.1:1, Search about 2.9:1.

**Not verified.** The recreations were compared by eye with the pins in a headless render; there is no pixel diff.
Transparency is not among the nine (the glass pins are whole panels over photographs, not simple elements). Toggle pins
(32, 33, 38) were not recreated.

## Fill and stroke reworked (r12, added 2026-11-10)

Owner, on the dark page's white buttons in the Fill gradient close-up: "this looks off, can you explore adding gradient
fills and strokes from some of the references?" Cause: the first prototype laid white and black over the fill and drew a
dark line along the foot, so a white button showed only a gray lower edge. The icon-only button was also blank (the icon
was passed as a child, not the `icon` prop; fixed in `render.tsx`).

The prototype (`build-page.mjs`, `.mx:not(.v0)`) now follows the specs: the fill is the part's own color mixed 5 percent
darker at the top and 11 percent lighter at the foot; the stroke is a 1px gradient, 22 percent lighter than the fill at
the top and equal to it at the foot; a 1px ring outside in the fill's darker color (55 percent on dark fills, 16 on the
dark page's white button, 22 on colors); no foot line. A colored fill does not lighten at the foot, so labels hold. The
page shows the first version, this one, and a third with the soft inner glow (r11) side by side, light and dark, neutral
and accent; r12 picks between them (recommended: from the specs). The mix percentages are fitted to the four spec pins by
eye, not solved.

## Part 5, second pass: soft paint on Area's own button (2026-11-10)

Owner, on the first recreations: "can these be more blurred so its not harsh lines? overall, make the gradients much more
soft … recreate these last 3 images … recreate all these proof of concepts on the original area button, dont change any
size, density, corner radius, type, etc, just apply the visual style to the area component."

- All twelve elements are now paint only (`poc-paint.mjs`: label color, background, border color, box-shadow, text
  shadow) on an untouched Area Button at its default size, room, corner and type. `poc.mjs` keeps the first pass's
  measured layers as the source; its one-off sizing CSS is no longer used by the page.
- Softer: lines carry a 1 to 3px blur at lower strength, hard gloss bands are eased ramps, rings have a feather.
- Three added from the owner's attached images, sampled per pixel with `sharp`: a pale blue glass Create (radial blue
  from the top with a white bloom at the foot, white rim), a pale blue Send disc (radial lit from within, white stroke
  over a soft inner ring), and three color buttons in a capsule (pin 44).
- Two wrappers (the Today capsule and the color-button capsule) are plain spans, not Area components.
- New finding: both pale blue buttons use radial fills lit from within, which a linear Curve cannot draw. Not proposed as
  a lever yet: two references.
- Shapes differ from the references on purpose (the Send disc and the color buttons are circles there; Area's icon
  button keeps its own corner).
- Checked by eye in a headless render at true size and three times; no pixel diff.

## Part 5, third pass: no visible lines, six more references (2026-11-10)

Owner: "are these visible horizontal breaks/lines … okay? id prefer if they were smooth", five more attached examples,
"not sure i like the send, pale blue disc", then a thick see-through frame ("a double stroke? … in a button too").

- **Rule adopted for every paint:** no offset inset shadows (they draw a band with an edge). Light comes from the fill's
  own gradient, an even inner glow (`inset 0 0 blur`), or a radial bloom; rings are feathered.
- **Seventeen elements now** (`poc-paint.mjs`), sixteen on Area's Button and one on Area's Segmented control. Added from
  the owner's images, sampled per pixel: white tiles and a blue button in a pale blue tray; a dark segmented control; a
  pale green glass Send (drawn opaque); a blue Send lit from within, which replaces the pale disc; a deep blue button
  with a glowing edge (its inner circle is a second part, left out).
- **Thick see-through frame:** a 4px ring of white at 45 percent plus a hairline and a wide cool shadow, shown on a white
  and a blue button (a dark one is in the file). Read by eye: that image was not available as a file to sample. It is a
  second, wide ring, which no lever draws; the closest existing thing is the Focus ring's Halo style, so a theme using it
  needs a focus style that reads differently.
- Checked by eye in a headless render; the full sheet after the first rewrite, then the frame, segmented and Today tiles
  again. No pixel diff.

## Part 5, fourth pass: one button, the border bug, truer colors (2026-11-10)

Owner: fix the line cut off at the top and foot of strokes "at all"; match the examples' more vibrant colors; "focus on 1
button … use the globe icon and the text button and 12px corner radius"; make the thick frame a 1px see-through stroke.

- **The cut-off line was a bug, not a style.** Area's Button has a 1px transparent border, and a background positioned at
  the padding edge repeats into that border, so the top border showed the foot's color and the foot showed the top's.
  Every paint now sets `background-origin: border-box; background-repeat: no-repeat` after its `background` shorthand (a
  first attempt set them in a shared rule, which the shorthand reset). Checked at ten times size on all eighteen: no band.
  Anything built from this must carry the same three declarations.
- **One button.** Eighteen styles (`ONE` and `GALLERY` in `poc-paint.mjs`) on the same Area Button with the globe icon
  and a label; corner forced to 12px on the page as asked. No wrappers, trays or other components. Paint from controls
  that were not buttons (toolbar tile, segmented thumb, round send, color button) is carried onto it.
- **Colors** back at the sampled values at full strength: deep blue 0546B4 to 1F6FF2 with a stronger edge and outer glow
  on a 0B0D10 page; green B6CDB1 to CFE3C6 with a brighter bloom (the sample itself is a gray green; this is slightly more
  saturated than sampled, by eye, at the owner's request).
- **Frame:** now a 1px ring of white at 55 percent with a feather and a soft cool shadow.
- `PAINT`, `WRAP`, `EXTRA` and `NEW` in the file are the earlier passes; the page uses `NEW` and `poc.mjs` only for the
  measured layer lists.
