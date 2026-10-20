# Component specs

One spec per family, `docs/specs/<slug>.md`, started from [the template](TEMPLATE.md). A
spec records why each value is what it is: the job, the evidence, the decisions and the
owner's feedback. The app shows it on the family's Spec tab, and its Job and boundaries and
Behavior and accessibility sections feed the Documentation tab.

- **The list of families** is [Components](../COMPONENTS.md) and the app's Components tab.
  Status is only in `apps/desktop/src/content/component-status.mjs`; a spec never restates
  it.
- **The process** is [Building a component](../COMPONENT_ADAPTATION.md).
- **Raw measurements** live in [`../research/captures/`](../research/captures/). Shared
  cross-product values are in the [baseline](../research/BASELINE.md).
- **Specs that are not one family:**
  - [icons](icons.md): the icon construction system and its batches;
  - [typography](typography.md): the type ramp;
  - [overlay](overlay.md): anchoring, dismissal and focus for Popover, Menu and Tooltip;
  - [inspector](inspector.md): the inspector recipe;
  - [resizable panel](resizable-panel.md): Panel `resizable`;
  - [app shell](app-shell.md): Titlebar and Section heading.
- **[Prior decisions](PRIOR_DECISIONS.md)** only maps decisions made before specs existed
  to the spec they moved to.

## Keeping a spec true

- **Current state is edited in place.** The current-state sections are Job and boundaries,
  Variants, Anatomy, Decisions, States, and Behavior and accessibility. They describe the
  component as it is now. Change them in the same commit as the code.
- **History is appended.** Owner decisions, Review notes and the Feedback log are dated and
  newest last. A reader should never have to replay the log to learn what the component
  does.
- **Superseded is marked.** When an owner decision replaces an earlier one, strike or
  annotate the old line ("superseded 2026-10-18: …") rather than leaving two rules standing.
- **Every number cites** a capture, a pinned source line or a dated owner decision.
