# Narrowing setup: the plan, 2026-10-21

The flow for the Theme tab's Setup, for the session that builds it. Why each rule exists is in `research.md`, and
`prototype.html` runs the rules on Shape, Size, Depth and Colour (radius on the perceptual cut, Floating shadow's Flat
as a one-member direction, the accent always asked). Grounds, Stroke, Fill and Motion are not in it.

**Scope.** This file covers what is asked, in what order, with which options, and what each answer changes later.
How it looks (stage, panel, cards, rail) belongs to the owner's layout work in another session (2026-10-21).
§7 lists what the flow needs from that layout.

**Ground rules this plan keeps.**

- **No option is cut and no settings are merged** (owner, 2026-10-18). The flow changes how options are reached, not
  which ones exist.
- **No named looks.** No question sets several settings at once.
- **Defaults are measured values**, so the flow can lean on them.
- **The Setup's own UI never takes the picks.** Only the stage and the choice pictures do.
- **A pick applies to the Canvas at once,** as today.

## 1. The rules

### 1.1 Kinds of setting

| Kind | Which | How it is asked |
|---|---|---|
| **Scale** | Ordered, 5 or more options | A loop of up to three screens (§1.2) |
| **Choice** | 4 or fewer options, or named options with no order (Focus ring's 5) | One question, every option on one screen |
| **Family** | Accent (11 hues) | A family (Cool, Warm, Natural), then that family's 3–4 hues |
| **Set** | Pills (8 shapes, any number on) | One question with checkbox cards. §3 has an open alternative. |

### 1.2 The scale loop

1. **Direction.** Each scale is split into three directions, listed in §2. Each card shows:
   - the direction's name and one line saying what it is like;
   - its range ("Round · 10–Pill");
   - a picture of its representative value.

   Where the directions' ranges would overlap (Type), a card shows its value instead of a range. The default's
   direction is preselected and marked Default.
2. **Refine.** The direction's members that read as different from each other: at least 1 ΔE00 apart for colour,
   stroke, fill and shadow settings (measured in `visible-steps.md`), 2 to 4 cards. The representative is
   preselected. Refine is skipped when only the representative is left, either because the direction has one member
   (a 0 that means off) or because its members look alike. Then the loop is Direction, then Check. Members left out
   stay in the exact row.
3. **Check.** Up to four cards:
   - the pick;
   - one step toward the default (when the pick isn't the default);
   - the next value past the range shown in Refine (when the pick sits at that range's edge);
   - the other directions' representatives.

   Choosing a card makes it the pick, and the check is rebuilt around it. Three ways out:
   - **Keep \<value\>** moves on.
   - **They look alike** keeps whichever of the pick and its neighbours on screen is nearest the default.
   - **Flip-flopping:** switching back to a value already kept (A, B, then A again) is treated as They look alike.

Below Refine and Check sits an **exact row** listing every value, so someone who knows the number picks it outright.

The check runs only in **Essentials** (§4). In **Refine**, each category ends with a single category check instead
(§4).

### 1.3 Pictures and preview

- **Option pictures.** Every option's picture is drawn over the picks so far, at true scale. Kinds, as in Setup
  round 3 (`choice-visuals.tsx`): mini UI, swatch or mark.
- **Previews flip instantly.** Pointer or keyboard focus on an option shows it on the stage with no transition, and so
  does holding to compare.
- **Only a landed pick animates.** Any fade between two compared views hides the difference (change blindness).

### 1.4 Branching

A question whose answer can't be seen is skipped. The skip is shown once, as a line on the next screen that says why.
Wording continues from earlier answers ("Without a line, should surfaces have a soft edge shadow?"). §3 lists every
gate.

### 1.5 Revisiting

Every decided setting appears in the decision row ("Your system"):

- **Decided:** the value, or "default".
- **Skipped:** the reason.
- **Not yet asked:** greyed.

Reopening a decided scale goes to its **Check**, since a pick exists, with a way back to Direction. A choice reopens
its one question.

### 1.6 The end

The review lists every setting, changed ones first. Holding a button shows Area's defaults in place, with an instant
flip. The flow ends on **Use this system**, a commitment, without a "you can always change this" line. The Inspector
still changes anything afterwards.

## 2. Every setting

The **Default** column gives each setting's default and the direction it falls in. In a direction, **(rep)** marks
the representative value and **(default)** marks Area's default.

**Direction names are proposals** for the owner to confirm. The **Reference** column comes from the axes'
descriptions and `docs/research/radius-audit-2026-10-03.md`. They are evidence, shown only if the owner wants
reference marks (§6, decision 5).

### Colour

| Setting | Kind | Directions (members) | Default | Direction question | Reference |
|---|---|---|---|---|---|
| Theme | Choice | Light, Dark | Light | Light or dark? | |
| Neutral | Choice | Neutral, Cool, Warm | Neutral | Which grey should the interface be drawn in? | |
| Action | Choice | Ink, Accent | Ink | Should primary actions be ink or colour? | |
| Selection | Choice | Ink, Accent | Ink | Should checked and selected states be ink or colour? | |
| Accent | Family | **Cool:** cyan, blue, indigo, purple · **Warm:** red, orange, yellow, pink · **Natural:** lime, green, teal | Blue (Cool) | Which family of colour? | |
| Contrast | Choice | System, Standard, Medium, More | System | How strong should edges and focus be? | |
| Light ground | Scale | **White:** 100 (rep, default), 99, 98 · **Soft:** 97, 96 (rep), 95, 94 · **Grey:** 93, 92 (rep), 91, 90 | 100, White | How white should the light page be? | |
| Light layers | Scale | **Flat:** 0 (rep), 1, 2 · **Layered:** 3, 4 (rep, default), 5 · **Distinct:** 6, 7 (rep), 8 | 4, Layered | In light, how far should cards and sidebars sit from the page? | |
| Dark ground | Scale | **Black:** 0, 8 (rep, default) · **Dark grey:** 12, 14 (rep), 16 · **Charcoal:** 18, 20 (rep), 22, 24 | 8, Black | How dark should the dark page be? | 8 is Area's near-black |
| Dark layers | Scale | as Light layers | 4, Layered | In dark, how far should cards and sidebars sit from the page? | |

Notes on Colour:

- **Accent's second step** asks "Which \<family\> colour?" Its pictures are the accent on the Action button when
  Action is Accent, and otherwise on a link and the focus ring.
- **Accent is always asked**, because links and the focus ring use it. After Ink, its pictures are a link and a
  focus ring (as in the prototype).
- **Grounds step below what people can see** (§8, computed 2026-10-21):
  - Each light step (1% OKLCH lightness) is about 0.7 ΔE00. Two steps are about 1.4, where about 1 is a typical
    just-noticeable difference.
  - Dark 0 → 8 is 0.3 and 8 → 12 is 0.6. Steps reach 1.2–1.5 only from 18 up.

  So Refine for the grounds shows members at least two steps apart: White shows 100 and 98, Soft shows 97 and 95,
  Grey shows 93 and 91, then 90 if picked at the edge. Black's 0 against 8 will mostly read as alike and settle on 8.
  The skipped steps stay in the exact row. The same rule (Refine shows only steps that read as different) applies to
  any scale once its steps are measured.

**Measured Refine:**

| Setting | Light stage | Dark stage |
|---|---|---|
| Light layers (ground 100) | [0] [4] [7], so no Refine | |
| Dark layers | | [0 2] [4] [6 7] |

At Light ground 96, Light layers' Refine is [0 2] [4] [7]. Its directions are 1.2–1.6 apart in light.

### Size

| Setting | Kind | Directions (members) | Default | Direction question |
|---|---|---|---|---|
| Type | Scale | **Small:** 12 (rep) · **Medium:** 14 (rep, default) · **Large:** 16 (rep); Refine is the rep and one step either side | 14, Medium | What size should text be? |
| Density | Choice | Compact 28, Default 32, Comfortable 36 | 32 | How much room should controls have? |

### Shape

| Setting | Kind | Directions (members) | Default | Direction question | Reference |
|---|---|---|---|---|---|
| Radius | Scale | **Sharp:** 0 (rep), 2 · **Regular:** 4, 6, 8 (rep, default) · **Round:** 10, 12 (rep), 14, Pill | 8, Regular | How should corners feel? | 30–33px controls: Figma 5, Notion 6, Cursor 6–8, ChatGPT 8. Surfaces: Notion 10, Cursor 12–14, Figma 13, ChatGPT 16. |
| Pills | Set | Button, Fields, Segmented, Chip, Badge, Count, Switch, Avatar | Chip, Badge, Count, Switch and Avatar on | Which shapes should be pills? | ChatGPT draws pill buttons |

**Radius uses the perceptual cut** (Sharp 0–2, Regular 4–8, Round 10–Pill), not the prototype's even cut (0–4, 6–10,
12–Pill), for two reasons:

- Perceived steps grow roughly geometrically (Weber), so 2→4 reads as a larger change than 12→14.
- Every measured reference falls in 4–8. The even cut would put VS Code's 4 under Sharp.

This is decision 2 in §6.

### Stroke

| Setting | Kind | Directions (members) | Default | Direction question |
|---|---|---|---|---|
| Stroke width | Scale | **None:** 0 · **Fine:** 0.5, 1 (rep, default) · **Heavy:** 1.5, 2 (rep) | 1, Fine | How thick should the line round surfaces be? |
| Stroke strength | Scale | **Light:** 0, 1 (rep), 2 · **Standard:** 3, 4 (rep, default), 5 · **Strong:** 6, 7 (rep), 8 | 4, Standard | How strong should strokes be? |
| Rest shadow | Scale | **None:** 0 (default) · **Subtle:** 1, 2 (rep), 3, 4 · **Visible:** 5, 6 (rep), 7, 8 | 0, None | Should surfaces at rest have a subtle shadow? |
| Hover stroke | Scale | **None:** 0 · **Some:** 1, 2 (rep, default) · **Strong:** 3, 4 (rep) | 2, Some | How much should a control's edge darken under the pointer? |
| Selected stroke | Choice | 1, 2, 3 | 2 | How thick should a selected card's edge be? |
| Focus ring | Choice | Hug, Gap, Halo, Inset, Bold | Hug | Where should the keyboard focus ring sit? |

Focus ring references: Hug is ChatGPT, Gap is Atlassian and Polaris, Inset is Primer and Radix, Bold is Material.
Selected stroke: 2 is ChatGPT's selected tiles.

**Measured Refine, light stage:**

| Setting | Light | Standard | Strong |
|---|---|---|---|
| Stroke strength | 1, 2 | 4 | 6, 7 |

| Setting | None | Some | Strong |
|---|---|---|---|
| Hover stroke | 0 | 1, 2 | 3, 4 |

In dark, every Stroke strength step is distinct, so its Refine shows all three members of each direction.

### Shadow

| Setting | Kind | Directions (members) | Default | Direction question | Reference |
|---|---|---|---|---|---|
| Floating shadow | Scale | **Flat:** 0 · **Soft:** 1, 2, 3 (rep, default), 4 · **Lifted:** 5, 6 (rep), 7, 8 | 3, Soft | How much should menus and dialogs lift? | 3 is Notion's lightest lift, 5 Notion's popover, 8 ChatGPT's menu |
| Resting shadow | Scale | **None:** 0 · **Soft:** 1, 2, 3 (rep, default), 4 · **Lifted:** 5, 6 (rep), 7, 8 | 3, Soft | How much should cards and panels lift at rest? | 3 is ChatGPT's sm |
| Hover shadow | Scale | as Resting | 3, Soft | How much should a hovered card lift? | 3 is ChatGPT's md |
| Field shadow | Scale | as Resting, with **None** as the default | 0, None | Should fields and outline buttons lift? | |
| Shadow size | Scale | **Close:** 0, 1 (rep), 2 · **Medium:** 3, 4 (rep, default), 5 · **Far:** 6, 7 (rep), 8 | 4, Medium | How far should shadows reach? | |
| Shadow softness | Scale | **Crisp:** 0, 1, 2 (rep, default) · **Soft:** 3, 4 (rep), 5 · **Smooth:** 6, 7, 8 (rep) | 2, Crisp | How soft should shadows be? | |
| Shadow light | Scale | **Flat:** 0 (default) · **Some:** 1, 2 (rep) · **Strong:** 3, 4 (rep) | 0, Flat | Should light come from the top? | |
| Shadow colour | Choice | Black, Warm, Cool | Black | What colour should shadows be in light? | |

**Measured Refine, light stage** (`visible-steps.md`):

| Setting | Flat or None | Soft | Lifted |
|---|---|---|---|
| Floating shadow | 0 | 1, 3 | 6, 8 |
| Resting shadow | 0 | 3 | 6 |
| Hover shadow | 0 | 1, 3 | 6, 7 |
| Field shadow | 0 | 3 | 6 |
| Rest shadow | 0 | 2, 4 | 6, 8 |
| Shadow size | 0, 1, 2 | 4 | 7 |
| Shadow softness | 2 | 3, 4 | 6, 8 |
| Shadow light | 0 | 1, 2 | 3, 4 |

- Resting and Field have no Refine; each is Direction, then Check.
- Their directions are only about 1.2 apart: visible side by side, not at a glance.

### Fill

| Setting | Kind | Directions (members) | Default | Direction question | Reference |
|---|---|---|---|---|---|
| Hover fill | Choice | 1, 2, 3, 4 | 2 | How dark should the hover plate be? | 2 is about 5% black |
| Selected fill | Scale | **Same as hover:** 0 · **Firmer:** 1 (rep, default), 2 · **Much firmer:** 3, 4 (rep) | 1, Firmer | How much firmer should a selected row be than hover? | 0 is Notion and ChatGPT |
| Pressed fill | Choice | 1, 2, 3, 4 | 4 | How firm should a press be? | 4 is ChatGPT's 12% |
| Selected tint | Choice | None, Tint, Neutral | None | Should a selected card also fill? | |

### Effects

| Setting | Kind | Directions (members) | Default | Direction question | Reference |
|---|---|---|---|---|---|
| Motion | Scale | **Quick:** 0, 30, 60 (rep), 90 · **Standard:** 120, 150, 180, 210 (rep, default) · **Slow:** 240, 270 (rep), 300 | 210, Standard | How fast should things move? | 210 is ChatGPT's popover (220); 300 is Primer's ceiling |
| Easing | Choice | Standard, Snappy, Gentle, Spring | Standard | How should motion ease? | Standard: ChatGPT, Figma · Snappy: Linear, Primer · Gentle: Primer, Fluent · Spring: Geist, Material |

### Refine and Check wording

- **Refine** asks "Which \<direction\>?" in the setting's own words: "Which round corner?", "Which soft lift?",
  "Which medium size?".
- **Check** asks "Still \<value\>?" with the helper line "Your pick beside what you passed over."

## 3. Gates and couplings

| When | Then | Why |
|---|---|---|
| Radius is Pill | Skip Pills | Every control is already a pill |
| Type changes | Density options Type rules out are disabled, with the reason (Compact needs type 14 or smaller, Comfortable 13 or larger). A density already picked and now ruled out moves to 32, and the decision row says so. | The density axis's own limits |
| Stroke width is 0 | Rest shadow asks "Without a line, should surfaces have a soft edge shadow?" | Rest shadow stands in for the line |
| Floating, Resting, Hover, Field and Rest shadow are all 0 | Skip Shadow size, softness, light and colour | No shadow to shape |
| Motion is 0 | Skip Easing | Nothing moves |
| Action and Selection are both Ink | Accent asks "Links and focus use the accent. Which?" and draws a link and a focus ring | The accent is only visible there |
| The stage shows Light | Dark ground and Dark layers come as a "Now in dark" pair at the end of Colour (Refine), the stage switched to dark | They only show in dark |
| Selected fill changes | Pressed fill's pictures redraw from it | Pressed is measured in quarters from selected |
| Rest shadow, Shadow size, Softness or Light is asked | The stage shows light, with a note: "Dark shadows stay hidden on a near-black page" | At Dark ground 8 these change nothing measurable (`visible-steps.md`) |
| The stage shows dark and a fill setting is asked | Options that render identically in dark are merged into one card that names all its values ("3 and 4 look the same in dark") | Dark caps: Hover fill 4 = 3; Selected fill 3, 4 = 2; Pressed fill's four steps fall within 1.0 |
| The "Now in dark" pass | Re-shows Stroke strength on the dark stage as a Check | One stroke pick spans 22.7 ΔE00 in dark against 7.2 in light |
| A coupled earlier setting changes on revisit | The later setting's row is marked "check again" and its Check is offered | Phoropter rule: re-check what a change affects |

To verify in code before building:

- Whether Selected tint's Tint shows when Selection is Ink.
- Whether Stroke strength reaches anything visible at Stroke width 0. The axis says control and state edges remain,
  so the plan keeps asking it.

## 4. Order and depth

Order follows dependency, as Apple's Mac build flow does: what later pictures are drawn over comes first.

**Essentials** (asked by default, a check after each scale):

| # | Setting | Screens |
|---|---|---|
| 1 | Theme | 1 |
| 2 | Neutral | 1 |
| 3 | Action | 1 |
| 4 | Accent | 2 |
| 5 | Type | 3 |
| 6 | Density | 1 |
| 7 | Radius | 3 (2 at Sharp) |
| 8 | Stroke width | 3 (Check only at None) |
| 9 | Floating shadow | 3 (Check only at Flat) |
| 10 | Motion | 3 |

That is 21 screens at most, plus the review. Essentials was chosen by judgement: these settings change every screen
the most, and later settings depend on them. Owner check: decision 1.

**Refine.** These are the same questions, opened per category from the review or the rail, each category ending in a
category check:

- **Colour:** Selection, Contrast, Light ground, Light layers, then the "Now in dark" pair.
- **Shape:** Pills.
- **Stroke:** Stroke strength, Rest shadow, Hover stroke, Selected stroke, Focus ring.
- **Shadow:** Resting, Hover, Field, Size, Softness, Light, Colour.
- **Fill:** Hover fill, Selected fill, Pressed fill, Selected tint.
- **Effects:** Easing.

A **category check** compares the category's picks with its defaults, with hold to compare, and lists what changed.
From there a setting can be reopened at its Check.

## 5. State

A sketch for the build, as pure functions, so it can be unit-tested apart from the layout:

```ts
type Kind = "scale" | "choice" | "family" | "set";
interface Direction { name: string; line: string; members: string[]; rep: string }
interface Step { setting: string; kind: Kind; directions?: Direction[]; question: string; gate?: (picks: Picks) => Gate }
type Gate = { ask: true; wording?: string; disabled?: Record<string, string> } | { ask: false; reason: string };
interface Trail { direction?: number; shown: Set<string>; kept: string[]; decided: boolean; recheck?: boolean }

directionOf(step, value): number                // the direction a value falls in
refineOptions(step, direction): string[]        // its members; [] when there is one
checkOptions(step, pick, trail, def): string[]  // pick, toward default, past the shown edge, other reps; max 4
alike(step, onScreen, pick, def): string        // nearest the default among the pick and its neighbours
next(at, picks, trails): number                 // the next asked screen; skipped screens yield a reason
```

The picks stay the Canvas's own (`setCanvas`). Trails are Setup state only. The Inspector and Browse never see them.

## 6. Open decisions for the owner

1. **Essentials: these ten, a check after each?** Recommended: yes in Essentials, and a category check in Refine.
2. **Radius cut.** Recommended: perceptual (Sharp 0–2, Regular 4–8, Round 10–Pill) over even (0–4, 6–10, 12–Pill).
   The references support it. The owner's answers on "Corner pairs" (§8) settle it.
3. **Direction names** (§2). They are proposals in plain words, with no product names.
4. **The default in the middle.** The middle option gains share just by being there, and defaults pull through
   endorsement. Recommended: keep the default marked wherever it falls, since it is measured. It is not always the
   middle direction: Light ground, Dark ground, Rest shadow, Field shadow, Shadow softness and Shadow light default to an end.
5. **Reference marks.** Should an option say "Notion's popover" or "ChatGPT's menu" where a value equals a measured
   reference? This would be evidence, not a look. Recommended: yes, in the muted line, only where the axis already
   records the match.
6. **Pills.** Ask it as 8 checkboxes, or narrow it first: "Small parts only (default)", "Also buttons and fields",
   "Every control" as starting points, then the checkboxes. The second is a starting point for a set, not a look,
   but it is close to one.

## 7. What the flow needs from the layout

This is the contract with the owner's layout work. Each item is a slot, not a design.

| Slot | Holds | Behaviour |
|---|---|---|
| Stage | The whole system under the picks | Takes a preview overlay instantly. A committed pick animates; a preview never does. |
| Place | Category, step name (Direction, Refine, Check) and its position (1 of 3) | Updates per screen |
| Question | Title, one helper line, an optional skip or coupling note | Announced politely to screen readers |
| Options | 1 to 5 cards: picture, name, a muted line (range, value, reference), tags (Default, Your pick), disabled with a reason | A radio group (a checkbox group for Pills). Arrows move and pick. Pointer or focus previews. |
| Exact row | Every value of a scale | Under Refine and Check. Picking jumps there; hovering previews. |
| Actions | Back; Continue or Keep \<value\>; They look alike (Check only) | Back skips gated screens |
| Decision row | One entry per setting: value, default, skipped (reason), check again | Opens the setting (§1.5) |
| Review | Changed settings first, Hold to compare, Use this system | Space or pointer hold flips instantly |

## 8. Research still open

- **Corner JND: a sheet is waiting for the owner's answers.** No study measures the smallest visible radius change on
  a control. "Corner pairs" (https://claude.ai/artifact/CboQUWnjuVqkYgVUAAwxi8, source `corner-pairs.html`) shows
  eleven pairs at true scale, in a fixed random order with the values hidden until answered:
  - the eight adjacent steps;
  - 2/6, 8/12 and 10/14.

  Each is a 32px button, a 24px button, a 36px field and a card. The answers are At a glance, Only side by side, or Not
  really. They are stored per pair in the artifact's database (`corners/<pair>`, e.g. `corners/r12-14`, with
  `{answer, at}`); read them with `ArtifactData` `list`.

  Geometry to weigh them against: every 2px step moves the curve by the same 0.83px at the corner's diagonal, but the
  relative change shrinks from 100% (2→4) to 17% (12→14). Answers that track the relative change support the perceptual
  cut (decision 2).
  - If 12/14 reads "Not really", Round's Refine drops to 10, 12 or 14, and Pill.
  - If 2/4 reads "At a glance", the Sharp/Regular cut at 2|4 is confirmed.
- **Visible steps, measured.** Done for colour, stroke, fill and shadow settings: `visible-steps.md`, re-runnable
  with `measure-steps.mjs`. Not yet measured: motion, other grounds and neutrals, Contrast More.
- **Ground steps, computed.** Grounds are OKLCH lightness at chroma 0 (`color/layers.ts`, `groundLightness`). Each
  adjacent step converted to CIELAB gives a neutral ΔE00:

  | Light step | 100→99 | 99→98 | … | 91→90 |
  |---|---|---|---|---|
  | ΔE00 | 0.67 | 0.67 | rising slowly | 0.73 |

  | Dark step | 0→8 | 8→12 | 12→14 | 14→16 | 16→18 | 18→20 | 20→22 | 22→24 |
  |---|---|---|---|---|---|---|---|---|
  | ΔE00 | 0.31 | 0.58 | 0.53 | 0.72 | 0.93 | 1.18 | 1.42 | 1.46 |

  A neutral's ΔE00 is ΔL* over its lightness weight; these are computed, not measured on a display. Side by side on
  large fields some people see 0.5. On small cards about 1 is safer. Hence the two-step rule under Colour in §2.
  Layers steps are measured in `visible-steps.md`.
- **Length.** 21 screens is above Typeform's six-question comfort zone, though inside configurators' 20 clicks. Walk
  it once with the owner and count where attention drops.
- **Product mechanics** marked unverified in `research.md`: Lemonade's prefill, Squarespace's palettes per
  personality, Apple's live image.

## 9. Building it (later)

- **Prerequisite:** the owner's Setup visuals and layout merged to main.
- **Files:**
  - `apps/desktop/src/pages/theme-setup.tsx`: the flow replaces the per-category list of cards.
  - A new pure module beside it, for example `setup-flow.ts`, holding §2 as data and §5 as functions, with tests.
  - `QUESTIONS` gains the Refine and Check wording.
  - Browse stays the full list.
- **Done when:**
  - The pure functions are tested: directions cover every preset exactly once; check options never exceed four and
    always hold the pick; every gate has a reason; Back never lands on a skipped screen.
  - Every setting in §2 is reachable.
  - Light and dark are inspected in the app.
  - Previews flip with no transition.
  - The keyboard reaches everything.
