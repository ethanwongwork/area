# Section heading spec

Split from the App shell spec (`app-shell.md`, Titlebar and Section heading together until 2026-11-11), its Section
heading material as it stood. Titlebar: `titlebar.md`.

**Captures:** none of their own: every value is the desktop app's, owner-reviewed (apps/desktop/src/studio.css,
2026-10-12).
**Peers:** Titlebar, Panel (its section heading), Typography (its title roles)

## Owner decisions

- 2026-10-15: "merge it, then continue working" → PRODUCT_UI.md's last open gap, "App-shell parts: Titlebar (drag
  region, traffic-light inset) and a section heading", as components.

## Job and boundaries

- **Section heading:** a titled group on a page, its title and an optional lede. Not a Panel section heading
  (collapsible, in an Inspector) and not a document heading ramp (Typography's title roles).

## Decisions

| Slot · property | Value | Basis |
|---|---|---|
| Section title | `text-base` at `weight-strong`, trimmed cap / alphabetic | the app's section titles |
| Section lede | `text-base`, `fg-muted`, 64ch, trimmed; 8 under the title | the app |

## Adoption

- `CanvasSection` and the Components page's group, Props, Anatomy and States titles are `<SectionHeading>`; the app
  adds the Canvas margin under it (`studio-section-heading`).

## Verification

- App preview: section titles 16/22 at 500 (title-xs; 13/18 until 2026-11-02), 14 to the content, still naming their
  sections (`aria-labelledby`).
- `packages/react/tests/app-shell.test.mjs`.

## Review note, 2026-10-15

- **What it is:** the desktop app's section titles, now an Area component anyone can use: a Section heading with an
  optional lede.
- **Based on:** the app's own bar and titles, which you reviewed; nothing in the app looks different.
- **Why its own component:** Section heading is the weakest case: a strong title and a muted line, with no
  behaviour, so it could be a Typography recipe instead of a component.

## Review note, 2026-10-16

- **What changed:** Section heading: approved, unchanged.

## Feedback log

- 2026-10-15 · owner: "merge it, then continue working" → Titlebar and Section heading, from PRODUCT_UI.md's last gap.
- 2026-10-16 · owner, review round 27 (components27) → Section heading approved → Complete.
- 2026-11-02 · owner: "is the size of each section title correct?" → Section heading's title takes title-xs (16/22 at type
  13), the ramp's settings and surface title, strong; its lede joins at the title's line less its cap. It was text-base
  13/18, under the Card titles (title-xs) it heads and a reply's headings. Every page's section titles move with it.

## Review note, 2026-11-11 (type rules, plan A9)

- **What changed:** the lede moves from `text-sm` on its prose line (12/18) to the UI text on its prose line (13/20), muted: a 12 lede under a 16 title read underweight (plan A9.3, findings VC14, T2). The title stays `title-xs` at 500 (plan A9.1: page > section > item).
- **Why:** the system evaluation's type rules (docs/research/system-evaluation-2026-11-11, section 5, A9), owner-approved
  2026-11-11; the rules are in DESIGN_SYSTEM.md ("Ink and weight", "Size and shape", "Text pairs") and the type skill.

### 2026-11-14 · Shared parts, leftovers (system plan, Phase 2, wave 3)

- The title-to-lede gap is `ui-cluster` (6 / 8 / 10). Values at type 13 Compact / Default / Comfortable; unchanged at the default.
- Why: docs/research/system-evaluation-2026-11-11 (plan B6.1, B6.5, B8.2, B2.2; README §5, phase2/leftovers.md); the owner took every recommendation on 2026-11-11. Fix the rule, not the instance.
- Verdict: awaiting the owner.
