# Show UI at 1:1 (owner, 2026-11-04: "Show UI at 1:1")

From the fidelity pass (README in this folder, artifact ML6aoMQzMFev48hnz8CxUv): the largest measured gap between Area
and Figma examples is presentation. The kits, Setup and the artifacts show a setting's effect inside a whole 1920-wide
screen fitted to a frame or card (0.2 to 0.36 of true size: 13px text at 2.6 to 4.7px, a 1px edge at 0.2 to 0.36px).
Figma examples are seen at 1:1 or larger.

## The rule

1. **A picture that shows a setting, an answer or a component draws it at true size (scale 1), cropped to the part it
   changes** (the question's region: the form, the menu, a card, a field). Zoom stays: fit is one click away, never the
   default.
2. **A card that stands for a whole design** (a project, a page, a theme, a version, Publish's before / after) keeps the
   whole screen fitted, as a thumbnail, the way a design tool's file browser does. Opening it shows it at 1:1.
3. **A question about the whole screen** (Screen kind, A or B) keeps the whole screen; its frame opens fitted.
4. Specimens drawn by `Scaled` stay capped at 1 (`max={1}`, already true); none is drawn larger than true size.

## What changes (each file, at main 7a3d3c02)

| Where | Now | Change |
|---|---|---|
| `question-kit.tsx` `QuestionFrame` | opens fitted unless a template passes `zoom` and `focus` (Corners, Shadows, Fine-tune do) | **Built:** opens at 100% on its `focus`; Room names the list, Accent the form's primary button, Several at once the form; whole-design questions name none and open fitted |
| `theme-setup.tsx` `Picture` (choice cards) | only drawn for motion now (Setup's chat dropped pictured choices, 2026-10-28) | none |
| `theme-setup.tsx` stage | Screen (whole screen fitted, parts marked) or Component (the part at 2.5×), the owner's switch | none: Component already draws the part above true size; Screen is the whole-screen orientation view |
| `pages/settings.tsx` Appearance preview | the whole screen fitted beside the settings | unchanged (rule 2: it stands for the theme); a Zoom control to see it at 1:1 is a separate proposal |
| Home, Systems, Themes, Project, History, Publish, Labs screen tiles | whole screen fitted | unchanged (rule 2) |
| Kit and theme-flow artifacts | built from the above | rebuilt after the change |

## Collision (resolved)

On 2026-11-04 two sessions were running on the same files: Feed and chat kits refinement (uncommitted edits to
`question-kit.tsx`, `choice-visuals.tsx`, `chat-kit.tsx`, `question.css`, `feed.css`, `canvas.css`) and Abstract UI
library illustrations. AGENTS.md: one session at a time. Owner: wait for the PR, then do it here. Built after PR #203
merged (e18c91d1).
