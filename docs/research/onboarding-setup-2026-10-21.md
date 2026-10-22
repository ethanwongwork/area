# Onboarding and setup flows, 2026-10-21

For the Theme tab's Setup (34 settings in 7 categories, one question per step). The owner asked to "research other
onboarding flows? maybe a vertical timeline would be better? i like the video experience and simple experience from the
choices and controls, but would just want to make each visual choice more clear and fitting of the design system."

## The owner's references

- **A product finder (video, 30 s, frames read every 1.5 s in headless Edge; not committed).** A large stage shows the
  results and changes with every answer. Under it sits one floating question card with Back and Reset at its start, the
  question centred and an info button at its end. The choices are equal soft tiles: a small picture, a bold name and a
  muted one-line note. The picked tile gets a dark edge with a check badge, and one is badged "Recommended". A
  single-choice question moves on when a tile is picked; a multi-choice one shows a full-width Continue. There is no
  step indicator at all.
- **Version history:** a vertical timeline. Version pills are the markers (the current one solid), dots mark minor
  entries, and a 1px line joins them.
- **An agent's progress card:** a check for done, a spinner for the current step and an empty ring for what is left,
  with short dashed connectors and muted text for upcoming steps.
- **"Set up a strong password", 2/6:** a segmented bar of six with the done and current segments filled, the count at
  the title's end, then Previous and Next as two full-width buttons.
- **Run details:** a vertical rail of avatar and dot markers on a dashed line, with nested groups that fold and their
  rows on tree lines.

## Design systems (sources fetched 2026-10-21)

| System | Orientation | Marker | Connector | Notes |
|---|---|---|---|---|
| MUI Stepper | horizontal, vertical | 24 filled, number | 1px | `nonLinear`; MobileStepper says dots for few steps, a bar for many |
| Carbon | both, prefers vertical "for easier reading" | 16 icon, half-filled current | 2px horizontal, 1px vertical | labels max 88 (160 vertical) |
| Atlassian Progress tracker | horizontal | dot on a filling bar | bar | 3–6 steps; split a longer task |
| Ant Steps | both, vertical under 532px | 32/24, dot type 8 (current 10) | 1px | `maxCount` folds hidden steps |
| Mantine | both | 42 md | 2px | `allowNextStepsSelect` |
| Base Web ProgressSteps | vertical | number or dot | tail | the current step opens in place, holding its content and Prev/Next |
| GOV.UK step-by-step | vertical | number | line | tasks nested under each step |
| Apple HIG page controls | dots | — | — | "more than about 10 dots are hard to count" |
| Shopify Setup guide | vertical checklist | checkbox | dividers | "1 out of 3 steps completed", rows open |

Sources: mui.com/material-ui/react-stepper, carbondesignsystem.com/components/progress-indicator,
atlassian.design/components/progress-tracker, ant.design/components/steps, mantine.dev (Stepper.module.css),
v8.baseweb.design/components/progress-steps, design-system.service.gov.uk/patterns/step-by-step-navigation,
developer.apple.com/design/human-interface-guidelines/page-controls,
shopify.dev/docs/api/app-home/patterns/compositions/setup-guide.

**Products.** Quiet products such as Linear, Notion, Figma, ChatGPT, Arc and Raycast show short flows with dots or no
indicator at all. Long, sectioned flows use a vertical list of sections: Stripe's activation and Shopify's setup guide.
The product rows were read from teardowns, not captured; treat them as unverified.

## What it means for Setup

- **The steps need a vertical rail.** Seven categories exceed Atlassian's 3–6 for a horizontal row. 34 steps fit no
  marker row in any system. Only the vertical patterns nest sub-steps (Base Web, GOV.UK). → The Sidebar is a vertical
  Stepper of the categories, and the open one lists its settings (the owner's pick). The flow's place is a count and a
  Progress bar over the question.
- **One question under a stage**, as in the product finder. The stage shows the effect at true scale, under the choice
  under the pointer. The choices are small close-ups of the setting alone, so one glance compares them. → The owner's
  pick.
- **Wait for Continue.** Picking applies at once. Unlike the video, it does not advance, so a person can compare by
  picking (the owner's pick).

## Decisions taken on Area's terms

- The picked choice keeps Area's selected edge (the Selected stroke setting, the indicator blue), not the video's dark
  edge and check: selection paints the same everywhere.
- No "Recommended" badge: the default is marked "(Default)" in the name, as everywhere in the Theme tab.
- Reset is "Use default", a labelled ghost Button. An icon-only button would need a Tooltip (Product UI rule 4), and the
  label says what it does.
- The stepper's markers, line and paint stay Stepper's own, approved in round 25.

## Round 2 (owner, same day): visuals, layouts, containers

The owner: "the new workflow is better, but we need to improve the visuals that are used to make these choices ... i
want to review each axis, and each possible visual ... test the options being in a side panel like the tesla ui, or
across the bottom in a scrollable carousel ... improve the asset card ... restrict it to be used only on the component
page ... the themeing experience does not change its own ui as you make choices." New references: an assembly-steps
editor (a scrubbable strip of step cards under a 3D stage), a car configurator (sections in a right panel, swatches, a
sticky price), Nike By You (a bottom bar with "Plate 8/11", arrows, pills and swatches), a Work Time card (day toggles,
a range), a mobile Today (a dashed timeline, tasks, a composer), a motion preset panel, a format panel, an interface
picker (thumbnail cards), Untitled UI's Appearance page (theme thumbnails, swatches).

**Theme panels and configurators, sources fetched:** Radix Themes' ThemePanel (source): swatches for accent and gray, a
single-corner square drawn at the radius, "Aa" cards at each scaling, sun/moon cards for appearance. Porsche's
configurator: paint in named tiers with a price per tier. Geist's theme switcher: Light / System / Dark icons. Tesla and
Nike returned nothing to automated fetching, Untitled UI and shadcn only shells; their rows are from the owner's
images and teardowns. No product draws strokes, state fills or motion as choices.

| Setting kind | Radix | Untitled UI | Tesla / Nike | Area's Auto |
|---|---|---|---|---|
| colour, accent | swatches | swatches | swatch circles + caption | glyph (a swatch) |
| gray, ground, layers, mode | swatches; sun/moon | theme thumbnails | — | mini UI |
| radius | a corner glyph | — | — | glyph (a corner) |
| type size, scaling | "Aa" at each size | — | — | glyph ("Aa") |
| density | — | Default / Compact thumbnails | — | mini UI |
| strokes, shadows, states | — | — | — | isolated component |
| motion | — | — | — | detailed (the switch moving) |

**Built for review** (in the app, temporary switches; picks on the review page,
https://claude.ai/artifact/3Xcb9PJRrmnR6J4RgAjhhx, `picks/<setting>` and `meta/layout`): seven treatments per setting
(glyph, isolated, detailed, mini UI, desktop, mobile, text) and three layouts (stacked; Tesla's side panel; Nike's
bottom bar with one scrolling row). The stage gained Settings (Untitled UI's Appearance) and Mobile (the Today
reference) screens, and Bento was rebuilt from the references; the setup's own UI no longer takes the picks.

## Round 3 (owner, same day): choice cards apart from the visual

The owner: "i like the mini ui, can you expand on those options. i want to separate the choices from the visual ... the
choices can be mostly mini ui, actual color swatches, or abstract/simple examples ... there will be a visual in the
center, either a component bento, desktop screen example, or mobile screen example", with an Appearance picker
reference (soft grey cards, a centred white window with a soft lift, the label centred under it, the chosen card
ringed and tinted; typefaces as text cards set in themselves; colours as circles with a check). No picks were saved on
the round 2 review page; the owner picked the side panel by category in chat.

**Choice-card components (sources fetched):** Radix Themes RadioCards and CheckboxCards (content centred, no radio dot,
the checked card a 2px accent outline inset, columns `minmax(160px, 1fr)`, radio-group keyboard); Chakra RadioCard
(`align` start, centre or end; indicator optional); shadcn's choice card (border and a 5% primary tint); Carbon's
selectable tile (minimum 2:1, Tab and Enter); PatternFly tiles (2 to 6 options); Mantine Radio.Card (a separate visual
indicator); WAI-ARIA's radio group (Tab to the checked one, arrows move and select). Products: macOS Appearance (window
thumbnails, labels centred under them, the accent as circles), iOS Display (screens with a check), Discord (theme
circles with a check). Guidance taken: thumbnails for what is spatial or chromatic, text cards where the label is its
own preview, swatches for pure colour, the label centred when the visual is, 2 to 6 cards per setting where possible
(Area's settings run to 11, so cards keep small and wrap).

**Built:** Radio and Checkbox `layout="preview"` (the card a soft ground, the visual's frame at `--area-choice-ratio`,
the label centred, no control drawn, the selected stroke as the choice); the setup's panel by category; three choice
kinds (`src/choice-visuals.tsx`): mini UI, swatch, mark. The round 2 switches (layout, choice visual) are removed.
