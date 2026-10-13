# Compass review and five components, 2026-10-13

The owner asked what was worth taking from Compass (compass.designcompass.org, a shadcn + Tailwind v4 design system
with a component gallery). Reviewed in the built-in browser: the gallery, a component page, Install with AI, the
Registry, `llms.txt` and `llms-full.txt`.

**Worth taking (site):**

- Copy and Reset on every gallery tile: Copy copies the component's whole source, Reset returns an interactive demo to
  its start. Handed to the running gallery session with the app-scale change (type 13, Compact, radius 10).
- An AI-readable reference (`llms.txt` index, `llms-full.txt` rules + tokens + source) and a setup prompt that saves
  project rules: worth generating from `manifest.ts`, specs and tokens once Area ships outside this repo.
- A version-pinned shadcn registry (`/r/0.1.0/*.json`) with a changelog: a later distribution choice.

**Components Area lacked (from Area's own backlog):** Password field, OTP field, Time field, Progress circle, Stepper,
built here. Progress circle became Spinner's `value` after review round 24 (owner: "is this not the same as spinner?"). Compass's visual character (Pretendard, #007AFF, pills, mobile patterns) is not a measurement source.

**Not adopted:** phone input (an InputGroup recipe), signature input, voice recorder (VoiceInput waits for Composer
work), bottom sheet, mobile nav bar, tilt card, heat-word, cookie floating card, carousel and dot pagination, activity
heatmap and routine tracker (charts belong to an engine).

Design-system source reports (pinned commits, cited lines), one per component, are beside this file; Cursor's rings
were read from its app bundle (`cursor-rings.md`).
