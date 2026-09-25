---
name: area-visual-language
description: Apply Area’s product visual language when building or materially refining components in this repository. Pair real source structure with Area type, paint, shape, icons and optical alignment, using ChatGPT, Notion, Cursor and Figma as product direction.
---

# Area visual language

Use after identifying the component’s job and structural source. Follow the canonical
workflow in `docs/COMPONENT_ADAPTATION.md` from the repository root; this skill owns the
visual decisions, not a duplicate build process. Read `docs/DESIGN_REFERENCES.md` for
source choices, only relevant sections of `docs/DESIGN_SYSTEM.md`, and `docs/CONTRAST.md`
when painting states. The user’s current direction overrides these defaults.

Untitled UI is the owner’s preferred first reference for structure and visual quality.
Use another source for concrete missing behavior or anatomy, while translating its paint
back to Area. Show one component variant per gallery tile.

## Intended character

Area should feel comfortable beside ChatGPT, Notion, Cursor and Figma: content-first,
precise, quiet, compact but readable. These are owner-selected design goals. Do not invent
those products’ internal measurements, tokens or source availability. OpenAI Apps SDK UI
is a public code candidate for ChatGPT apps; it does not establish all ChatGPT client UI.

Choose the relevant quality for the component: conversational action hierarchy for a
composer, low-noise text operations for inline tools, dense organization for navigation,
precision and units for inspector fields. Avoid combining unrelated brand treatments.

## Make visual decisions explicit

- **Hierarchy:** identify the primary content, secondary information and actions. Establish
  emphasis through Area roles and states. Decorative affordances should not compete with
  labels; selected, focus, invalid and disabled must remain recognizable.
- **Density:** retain credible source dimensions unless there is a documented reason to
  adapt them. Compare at the same Area UI scale. Do not simulate compact density by
  shrinking glyphs or substituting unreadably small text.
- **Type:** choose an existing text role. Align labels using the shared font reference and
  line height; use first-line icon alignment for multiline content. Preserve readable
  label/value/description hierarchy without adding ad hoc font sizes.
- **Paint:** begin with neutral semantic surfaces and ink. Use accent for selection/action
  and semantic tones for meaning. Keep foreground stable across hover. A pale fill can
  pair with strong ink; do not wash every layer out with opacity. Follow CONTRAST.md.
- **Edges:** choose radius by shape role. Pills/circles remain full; controls use their role;
  nested surfaces relate through their inset. Use borders for boundaries and restrained
  shadows for elevation. Avoid stacking fill, border and shadow without a distinct job.
- **Icons:** use the actual Fluent cut matching the slot. Inspect viewBox and rendered size.
  Keep a square viewport, a separate hit target where needed, and no per-glyph nudges.
- **Balance:** inspect outer edges, icon/text relationship, trailing action and multiline
  baseline. If one child needs independent geometry, give its slot ownership as described
  in the workflow. Fix the responsible layer instead of accumulating offsets.

## Practical review

Compare the default and the variants relevant to this task beside accepted Area peers.
Use gallery **Inspect structure** to select shell/text/icon/action layers and measure
resolved padding, margins, gap and dimensions. Inspect the normal visual result with the
mode off. Check light/dark and the size/state or narrow-layout case most likely to fail.
Do not impose an exhaustive audit for a small change.

Document only consequential adaptations and unresolved observations in the component
record. Distinguish source facts, DOM measurements, screenshot observations and Area
choices. Owner feedback updates that record first. Promote repeated useful lessons here;
remove obsolete instructions instead of adding contradictory rules. Completion remains
owner-confirmed in the registry.
