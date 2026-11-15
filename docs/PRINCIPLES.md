# Principles and design language

What Area is trying to be, the principles every component reflects, and what the result
looks like. Each principle states a rule and how to check it. Exact values live in
[Design system](DESIGN_SYSTEM.md) and the code; this page is the reason they look the way they do.

## What Area is

Area is a design system tool. Its core is a broad, first-party library of components
whose every variant looks exactly right in any combination of settings. The [product brief](BRIEF.md)
(2026-09-27) describes the larger tool, which will turn a person's visual choices into a
design system in their own repository. Today's work is its first step: a measured library,
judged and accepted by the owner, component by component, in the desktop app.

- **The app is the source of truth** (owner, 2026-10-12). `apps/desktop` is built only from
  Area, and every component, icon, type style and colour is judged there.
- **Breadth is the point, consistency is the product.** A new system should find most of
  what it needs already built. Breadth is only useful if every item looks like it belongs
  beside every other one, under every setting.
- **Customization comes from settings, not templates.** A design system is a set of
  choices: foundations (colour, type, shape, density, stroke, depth, motion), which
  components and variants are included, and later each family's structure. Two systems
  made with Area should not look related unless their authors chose that.

## Principles

Each principle has a test. A component that fails one needs a written reason in its spec.

### 1. Measured, not invented

Every visible value comes from a measurement of a real component (ChatGPT, Notion, Figma,
then design systems), a pinned source line or an owner decision. It is then refined so it
belongs in Area.
*Test:* every number in a spec cites a capture file, a source line or a dated owner
decision. "Owner pick" with no data behind it is not a basis.

### 2. Content first, chrome quiet

Neutral surfaces and ink carry the interface. Colour is sparse and always means something.
Components never offer an accent tone. They paint an emphasis role, *action* (what you
press to commit) or *selection* (what shows state), and the theme decides whether each
role is neutral or the accent. Semantic tones (info, success, warning, danger…) carry
status.
*Test:* with default settings, a screen of Area renders entirely neutral apart from
semantic tones.

### 3. One role, one paint

The same role looks the same in every family. Every row plate shares one hover, selected
and pressed ladder. Every floating surface shares one frame and one shadow role, and
everything disabled dims the same way. Most drift happens between families, not within
one.
*Test:* `packages/react/tests/cohesion.test.mjs` passes, and the component lines up with
the peers named in its spec.

### 4. A state changes one thing, by one step

Hover, press and selection change only the plate, the edge or the lift. Ink, weight, size
and position never move. Each state is one step firmer than the last (rest → hover →
selected → pressed), selected survives hover, and every press shows.
*Test:* diff the computed style at rest and on hover; only a background, border or shadow
changes.

### 5. Hierarchy from weight, ink and fill, not decoration

The interface uses two ink levels (default and muted) and two weights: 400 for running
text, rows and labels, and 500 for labels on solid fills and for surface titles set at body
size. There are few sizes and one variable per distinction. Borders frame things and
never compete with text.
*Test:* no component introduces a third ink level, a 600 weight, or italics.

### 6. Geometry is derived, never nudged

Insets, corners, heights and gaps follow equations shared across the system:

- `outer inset = border + shell padding + slot inset`;
- concentric corners;
- a corner proportional to its height;
- icons in square slots;
- text measured by cap height.

A glyph or a word is never moved by a pixel to look right; the structure is fixed instead.
*Test:* the spec writes each slot's inset equation, and the captured insets match it.

### 7. Settings, not looks

Every setting is one independent control with one visible effect, usually a single number
named after what it measures. Radius is the medium Button's corner, Elevation the Menu's
shadow strength, Motion a dialog's open time. There are no named themes or prepackaged
looks. Options are kept and their effect is shown, rather than cut to simplify (owner,
2026-10-18).
*Test:* every value of every setting renders correctly across the whole gallery.
Contrast-failing options are never offered.

**Every detail is a choice** (owner, 2026-10-22: "the key with this design system is i want everything to be part of a
series of choices. any small detail, i want the user to be able to choose from as many viable options as they want").
Where a detail could reasonably go more than one way (how tinted the text is, how far layers step, how a card frames its
asset), it is a setting with every viable option, not a value fixed in the code. "Viable" is the only limit: an option
must render correctly with every other setting and clear contrast, so a rule that keeps text readable (the tint's ink
margin) is a guarantee, not a choice. Every such setting is considered in light and in dark: a value that differs by
mode is set apart per mode (Ground, Layers, Tint strength), and one that does not is shared (Tint hue, Text tint).

### 8. Axes stay independent

Size, tone, emphasis, state, layout and composition are separate axes, each with its own
vocabulary. Light and dark, type size, density and the other settings are system-wide.
They are never a component's variant. Token namespaces are disjoint, and the build fails if
two axes write the same property.
*Test:* every combination of a component's axes is valid, and no variant re-implements a
system setting.

### 9. Quiet, exact motion

States arrive quickly and fade out on `fast`; a control gives a little under a pointer press (Feedback, Subtle by
default, 2026-10-24). Surfaces open from where they were triggered and close a step faster. Nothing bounces, nothing
makes the person wait, and every resting state sits on whole pixels.
*Test:* [Motion](MOTION.md), "Checking a component".

### 10. Native and accessible by construction

Use native elements and ARIA for behaviour and meaning. Every collection is
keyboard-complete, and state is never colour alone. Contrast tests are a build gate and are
never weakened. An increased-contrast preference strengthens every required line.
*Test:* keyboard walkthrough, `npm test` contrast floors, forced colours, and the spec's
"Behavior and accessibility" section filled in.

### 11. Area's own

References supply measurements and patterns. Their code, icons, assets and copy are never
copied. A component should read as Area, not as a copy of Figma or Notion (owner,
2026-10-14: "more like area … not just copying figma").
*Test:* the spec's decisions table shows where Area chose its own value and why.

### 12. The app consumes Area

The app's UI is built from Area components and nothing else. When the app needs something
a component cannot do, the component changes and its spec records why. App CSS never
overrides `.area-*`. Design feedback on the app therefore changes the real component, so
explain what else that change touches before making it.
*Test:* `apps/desktop/src/studio.css` styles only app classes.

## The design language

What the principles produce. The settings change every value below, so these are the
defaults.

| Facet | Character | Detail |
|---|---|---|
| Colour | Neutral grey ink on white or near-black. Dark mode is as close to #000 as possible (page #020202). Accent is blue by default and appears only through the action and selection roles. | [Design system › Colour](DESIGN_SYSTEM.md#colour), [Theming](THEMING.md) |
| Type | Geist, upright, no synthesis. The UI base is 14 (the app runs at 13). Six sizes on a 4px leading grid. 400 almost everywhere. | [Type spec](specs/typography.md) |
| Shape | One corner setting (8 by default) that every corner derives from. Concentric nesting. Pills only where the theme lists them. | [Design system › Size and shape](DESIGN_SYSTEM.md#size-and-shape) |
| Edge and depth | Lines do the separating. Shadows are barely there (Elevation 3). Fields and buttons rest flat. Floating surfaces lift. Stroke and shadow are independent settings. | [Design system › Elevation](DESIGN_SYSTEM.md#elevation), [Strokes](DESIGN_SYSTEM.md#strokes) |
| Density | Compact but readable. The medium control is 32 at type 14 (28 Compact). Dense products shrink controls, never marks or legibility. | [Theming](THEMING.md) |
| Icons | Area's own stroked icons on a 16px grid at 1.125px. Filled means more ink on the body, never a negative. Optical balance across the set outranks 1× crispness. | [Icon spec](specs/icons.md), `area-icon-construction` skill |
| Motion | Short and settled: a dialog opens in 210ms, a menu in 140ms, and exits accelerate away. Ease-out for almost everything. Ease-in-out for things moving while visible. No spring. | [Motion](MOTION.md) |
| Copy | Neutral placeholder vocabulary (Title, Label, Description, Action). Example people are always David Tee, and teams for any others. | [Design system › Example copy](DESIGN_SYSTEM.md#example-copy) |

## Which reference decides

When the target products disagree and no owner decision applies, the product whose context
matches the component decides ([baseline](research/BASELINE.md)):

| Context | Primary | Examples |
|---|---|---|
| Inspector, property editing, canvas tools | Figma | Number field, Color picker, Toolbar |
| Conversation and composing | ChatGPT | Composer, Message, Model picker |
| Content, navigation, lists | Notion | Nav, Tree view, Menu, Table |
| Status and identity | Decided per spec | Indicator, Badge, Avatar |

Cursor is the secondary reference for density and icon/type balance. Untitled UI is the
first design system for anatomy and polish; others fill gaps ([references](DESIGN_REFERENCES.md)).

## How decisions are made

- **The owner decides, and data informs.** Recommend one option with its evidence. The
  owner's call is an adjustment on top of measurements, not a replacement for them.
- **The latest owner direction wins.** It is dated in the spec's Owner decisions. Older
  docs, reports and passing tests never override it.
- **Done means owner-accepted.** A family is Complete only when the owner accepts it in
  `apps/desktop/src/content/component-status.mjs`.
- **Show, don't describe.** Changes are reviewed as rendered before/after, with a plain
  "what changed / why" for each family.

How the library grows without losing these properties is in [Governance](GOVERNANCE.md).
