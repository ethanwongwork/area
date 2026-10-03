---
name: area-visual-language
description: Visual pass for Area components. Use after a component's structure is built from measured evidence, and whenever reviewing whether a component looks polished, balanced and consistent. Compares Area side by side with ChatGPT, Notion and Figma references and with peer Area components, then routes fixes through the spec.
---

# Area visual language

Run this after the structure is built (`area-component-build`, `docs/COMPONENT_ADAPTATION.md`).
The measured structure is the starting point. This pass judges whether the rendered result
looks right: polished, balanced, consistent, and at home in ChatGPT, Notion and Figma.
The owner's feedback overrides it.

## Character

Area should feel like it belongs in ChatGPT, Notion and Figma: content-first, precise,
quiet, compact but readable. In practice:

- neutral surfaces and ink carry most of the interface;
- color is sparse and means something: selection and current state are neutral, accent
  appears only where the consumer asks for it, and tones carry status;
- the hierarchy is clear from weight, ink strength and fill, not from decoration;
- edges are crisp, and radius is consistent within a family;
- icons sit at the weight of the adjacent text;
- spacing is even, and every inset looks intentional.

Match the product that owns the context (see `docs/research/BASELINE.md`): Figma for
inspector and editing controls, ChatGPT for conversation surfaces, Notion for content and
navigation.

## Required comparisons

Do all three for every variant touched. Use `zoom` screenshots at the same browser zoom
for both sides, and repeat in light and dark.

1. **Against each target reference.** Put the Area tile beside the product or design
   system capture of the same variant and state. Compare text optical size and weight,
   icon stroke weight against text, fill strength, edge definition, shadow softness,
   and how the space distributes around the content.
2. **Against peers.** Line up the component with the Area peers named in its spec (for
   example Indicator with Badge, Avatar and Tabs counts). The same role should look the
   same: same text role at the same size, same radius role, same stroke and fill
   strength, same icon-to-text relationship.
3. **Against the baseline.** Check the component's values against the baseline rows for
   the elements it resembles.

## What to judge

- **Balance:** equal-looking space on all sides of the content. Text is judged by
  cap height and baseline, icons by their square viewport. Leading and trailing slots
  are judged separately.
- **Hierarchy:** primary content reads first, then secondary information, then actions.
  Selected, focus, invalid and disabled stay recognizable, and foreground stays fixed on
  hover.
- **Weight:** text weight, icon stroke and border weight feel like one family. A heavy
  filled glyph beside light text, or a border darker than the text it frames, is a
  defect. Measure it: text stem (rasterised), icon stroke, cutout or ring width. Cursor's
  published rule is a useful benchmark: 1.25px strokes for 16px icons beside 16px text,
  1.5px for 24px icons, at least 3px between overlapping shapes.
- **Placement in context:** judge attachments on the real owners (button, icon button,
  tab, avatar). An offset that works on one owner can cover the label on another.
- **Paint:** a pale fill can pair with strong ink; avoid washing every layer out with
  opacity. Don't stack fill, border and shadow unless each has a distinct job. Follow
  `docs/CONTRAST.md`.
- **Shared state paint** (`docs/DESIGN_SYSTEM.md`, "Shared state paint" and "Elevation"):
  hover plates are `bg-component-hover` and selection `bg-component-active`, one step
  apart in both themes; disabled controls dim to 50% while text fields use field paint;
  ink and weight never change on hover or selection; selection markers are neutral ink;
  everything floating shares one lift. Check the dark theme too: a translucent tint that
  looks right in light can outshine selection in dark.
- **Across families, not just within one:** put the component beside every family that
  paints the same role (a hover row in Menu, Nav, Tree view, Table and Select; a floating
  surface in Menu, Popover, Dialog and Toast). Most drift is between families.
- **Edges and shape:** radius follows the shape role. Nested radius is
  `max(0, outer − inset)`. Pills and circles stay full.
- **Density:** compare at the same UI scale. Don't simulate density by shrinking glyphs
  or using unreadably small text.

## When something looks wrong

1. Find the responsible layer with a fresh capture (`areaCapture.capture` in the gallery).
2. Check its value against the references in the spec. If the measured basis itself
   looks wrong in Area's context, say so and choose another basis. Don't nudge.
3. Record the observation and the change in the spec's decision table and visual-pass
   notes, then change the code, then re-capture.
4. Fix geometry in the structure (slot ownership, insets). Never hide it with paint or
   per-glyph offsets.

Write down what you compared, what you saw, and what changed, in the spec's Visual pass
section. When the comparison was side by side with the live product in Claude in Chrome and its
captures are committed, add the family to `apps/docs/src/pass-status.mjs` (date and what was
compared). Screenshot impressions are
observations, not measurements. Promote a lesson that applies beyond one component into
this skill, and remove any instruction it replaces.
