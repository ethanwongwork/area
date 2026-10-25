# From a setting to a figure

## Four questions

1. **What does it change?** The token, and the components that use it (`packages/tokens/src/axes`).
2. **Which screen shows it most?** A desktop screen, an iPhone screen and a vignette for each
   setting (`SETTINGS`): Accent on a product page, Layers on mail, Density on an issue list,
   Elevation on a database with its menu open. If no screen holds it still, give it a
   vignette (`VIGNETTES`), as Danger hover, Motion and Easing have.
3. **Which options?** The ends, the default, enough between to see the change; six at most.
   A per-mode setting draws in its own mode.
4. **What does it need in order to show?** Tint hue needs a tint. The shadow details need a
   floating shadow. The accent solids and Label tint need Action set to Accent. Status
   colours Match needs a lowered Accent strength. Put these in `scope`, and say so in the
   `isolates` line.

## The gallery (`KINDS`)

Every family the app documents, by kind of UI: actions, text input, choice, dates and
colour, navigation, overlays, feedback, labels and marks, data, surfaces and layout, files
and media, chat and code. A family not in `KINDS` lands in Other; give it a kind.

## Screens (`figures/screens.jsx`)

For the Setup stage, onboarding and empty states: chat home, conversation, settings,
document, database, board, code editor, issue list, mail, dashboard, album, product
listing, product detail and booking on desktop; chat, menu, plan picker, team home, product
detail and finance home on iPhone; and 16 component vignettes. Each is built only from
Area's components after measured product references (`docs/research/app-screens-2026-10-21.md`).
