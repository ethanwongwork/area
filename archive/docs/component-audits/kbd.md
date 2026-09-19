# Kbd audit — 2026-09-18

## Decision summary

Area Kbd is a display-only keyboard shortcut hint, also called a *keybinding hint*,
*keyboard hint*, *shortcut hint*, or *keycap*. It now has normal and small sizes; default,
quiet, and on-color appearances; one semantic chord per Kbd; and a real KbdGroup for chords
pressed in sequence. A small Kbd composes inside Button, Menu, input chrome, or Tooltip.
It never registers the shortcut and never becomes a second interactive control.

The Button correction is structural: a 32px Button contains a 20px small Kbd and reserves
that 20px backplate at the trailing edge, leaving 5px after its border—the same geometric
space above and below it. Colored solid Buttons use an inverse translucent plate. Neutral
solid Buttons derive the plate from their contrasting foreground so it remains visible on
both near-black and near-white neutral fills. Neither treatment adds a nested control stroke.

## Current Area contract

Before this audit, Kbd rendered a flat chord from an array of key names, converted common
names to symbols, supplied a spoken label, and exposed 24px normal and 20px small sizes. It
also had a `quiet` boolean, but the default and quiet styles were visually identical. The
same component incorrectly carried the `area-kbd-group` class even though no React KbdGroup
existed. Button examples used the 24px default inside a 32px Button, and shared optical inset
logic measured the label rather than the nested keycap, producing excess trailing space.

## User jobs and non-goals

Use Kbd to make an already implemented shortcut discoverable beside the action it accelerates:
in a Button trailing slot, a Menu or list item's secondary-content slot, input chrome, a
Tooltip, shortcut help, or documentation prose. Use KbdGroup for sequences such as `G` then
`I`; use one Kbd with multiple keys for a simultaneous chord such as Command–Shift–P.

Kbd does not listen for key presses, own focus, submit a form, indicate arbitrary status,
replace a Button label, or guarantee that a displayed binding is available. Shortcut
registration, conflict handling, localization, user remapping, and `aria-keyshortcuts` belong
to the associated action or command system.

## Capability-atlas review

The atlas entry **Kbd / Keyboard hint** is Core. Closely related names are *KeybindingHint*
(Primer), *keyboard keys* (Atlassian Tooltip), *keyboard shortcut* (Carbon/Fluent/Apple),
and *Kbd/KbdGroup* (shadcn/ui). Chord, sequence, size, appearance, and display format are
independent dimensions. Button, Tooltip, Menu, input add-on, and command palette are
compositions, not Kbd variants. Active, hover, selected, loading, and disabled are rejected
as Kbd states because Kbd is not interactive.

## Evidence ledger

Sources accessed 2026-09-18; evidence levels follow the audit framework.

| Benchmark | Evidence and level | Finding used |
| --- | --- | --- |
| Area | Manifest, CSS, React, built docs, and browser geometry — A | Existing chord semantics and two sizes were sound; group boundary, appearance vocabulary, compact Button composition, and trailing inset were incomplete. |
| OpenAI | Public product surfaces; no reusable Kbd specification located — B | Useful product evidence only; unavailable for API decisions. |
| Notion | Public product surfaces; no reusable Kbd specification located — B | Shortcut hints exist as product chrome, not a public component contract. |
| Primer | [KeybindingHint](https://primer-docs-preview.github.com/product/components/keybinding-hint/), [Button](https://primer.style/product/components/button/), and [keyboard shortcut accessibility](https://primer.style/accessibility/patterns/keyboard-shortcuts/) — A | Chords versus sequences, normal/small, contextual variants, platform-aware `Mod`, Button trailing composition, display-only behavior, `aria-keyshortcuts`, and avoiding unsafe single-character shortcuts. |
| shadcn/ui | [Kbd](https://ui.shadcn.com/docs/components/base/kbd) — A | Kbd plus KbdGroup, Button/Tooltip/Input Group compositions, and RTL coverage. |
| Fluent 2 | [Menu](https://fluent2.microsoft.design/components/web/react/core/menu/usage) and [Tooltip](https://fluent2.microsoft.design/components/web/react/core/tooltip/usage) — A | Shortcut belongs in Menu secondary content; Tooltip information is supplemental and non-interactive. |
| Figma | [Component properties](https://help.figma.com/hc/en-us/articles/5579474826519-Explore-component-properties) — A | Size, appearance, text, and composition remain separate properties rather than a Cartesian list of visual variants. |
| Vercel Geist | [Geist introduction](https://vercel.com/geist/introduction) — A | No dedicated public Kbd contract located; product usage remains supplementary evidence. |
| Material | [Material Web components](https://material-web.dev/components/) — A | No dedicated Kbd component in the reviewed public catalog; do not infer an API from generic keyboard interaction guidance. |
| Carbon | [Menu](https://carbondesignsystem.com/components/menu/usage/) and [component catalog](https://carbondesignsystem.com/components/overview/components/) — A | Menu items may expose keyboard shortcuts as trailing related values; no standalone public Kbd component is catalogued. |
| Atlassian | [Tooltip usage](https://atlassian.design/components/tooltip/usage) and [API](https://atlassian.design/components/tooltip/code) — A | Tooltip has optional keyboard-key segments, but hidden hints cannot be the only discovery channel and are not announced as critical content. |
| Apple | [Keyboards](https://developer.apple.com/design/human-interface-guidelines/keyboards) — A | Respect standard bindings, use conventional modifier order, avoid conflicting custom shortcuts, and let platform localization/mirroring drive product behavior. |
| MUI | [Component catalog](https://mui.com/material-ui/all-components/) — A | No dedicated public Kbd component located; related composition evidence does not justify another Area state axis. |
| Tailwind CSS | [Utility-class documentation](https://tailwindcss.com/docs/styling-with-utility-classes) — A | Utility framework, not a canonical Kbd contract; useful only as visual implementation evidence. |

## Benchmark comparison

| System | Boundary and capabilities |
| --- | --- |
| Area | One flat chord; normal/small; default/quiet/on-color; symbol mapping and spoken label; KbdGroup sequence; contextual Button/Menu styling. |
| Primer | KeybindingHint parses chords and sequences; condensed/full format; normal/small; normal/on-emphasis/on-primary; platform-appropriate Mod. |
| shadcn/ui | Individual Kbd plus KbdGroup; Button, Tooltip and Input Group compositions; RTL example. |
| Fluent 2 | Shortcut appears in Menu secondary content; no standalone visual API documented. |
| Carbon | Shortcut is optional trailing Menu item content; no standalone catalog component. |
| Atlassian | Tooltip owns optional arrays of keyboard-key segments and intentionally limits announcement. |
| Apple | Behavioral and content conventions for standard/custom shortcuts rather than a reusable keycap API. |
| Material, MUI, Geist, OpenAI, Notion, Figma, Tailwind | No stronger public reusable Kbd contract verified; evidence is catalog, product, authoring, or utility-level only. |

## Geometry

Normal is a 24px backplate with 4px inline padding, 12px UI text, and a 14px line box.
Small is a 20px backplate with 2px inline padding, 11px UI text, and the same 14px line box.
The border is counted inside the fixed block size. Chord keys share one backplate with the
keyboard-gap token; sequences use separate Kbd backplates with the small control gap. Kbd
has no shadow or simulated physical-key depth.

Inside a control, small is the required composition size. Shared inset logic reserves the
actual 20px nested backplate rather than the label's cap box. At the default 32px Button
height and 1px Button border, `(32 - 20) / 2 - 1 = 5px` remains at the trailing edge. This
is the same outer backplate-to-keycap distance above and below the Kbd.

## Accessibility and interaction

Each visual key remains a semantic `<kbd>` element, while the chord wrapper supplies one
spoken label such as “Command plus Enter” so bare symbols are not announced ambiguously.
KbdGroup does not merge separate chords into one fake simultaneous chord. Consumers must
put `aria-keyshortcuts` on the action, using its required syntax, and separately register
the actual handler. The visual hint must disappear or update when the shortcut is unavailable.

Kbd itself is not focusable and has no hover, pressed, selected, disabled, or loading state.
Single-character global shortcuts require the product-level safeguards described by WCAG
2.1.4; the component cannot make an unsafe binding safe. Platform-specific modifier output,
local keyboard layouts, RTL sequences, browser/AT combinations, forced colors, and 200%
zoom remain release checks.

## Candidate decisions

| Candidate | Decision | Reason |
| --- | --- | --- |
| One Kbd per simultaneous chord | Core | Matches Area's existing semantic structure and Primer's chord boundary. |
| KbdGroup for sequential chords | Core | Makes the existing manifest promise real and distinguishes sequence from chord. |
| Normal and small sizes | Core | Supported by Primer; small is required for nested control chrome. |
| Default appearance | Core | Quiet surface plus visible ambient edge makes a standalone hint legible without depth. |
| Quiet appearance | Core | Menus and dense trailing chrome need an unboxed secondary treatment. |
| On-color appearance | Core | Strong surfaces require contextual contrast without a nested-control outline. |
| Automatic Button/Menu context | Core composition | Prevents consumers from manually matching the surrounding variant and fixes neutral solid independently. |
| Button, Menu, Tooltip, input add-on, command palette | Composition | These are placement patterns with their own semantics, not Kbd variants. |
| Condensed/full text format | Extension | Primer evidence is credible, but Area needs platform/content localization rules first. |
| Runtime platform-aware `Mod` | Extension | Valuable, but implicit client detection risks SSR mismatch; require an explicit platform service or prop. |
| User-remapped bindings and alternatives | Product command layer | Kbd can display resolved output but cannot own command registration/preferences. |
| Hover, active, selected, disabled, loading, arbitrary tone | Reject | Kbd is non-interactive metadata; these states would falsely imply control behavior. |
| Skeuomorphic depth/drop shadow | Reject | Conflicts with the flat hint role and Area's documented no-shadow code/key treatment. |

## Final contract

`KbdProps` accepts native span attributes plus required `keys: string[]`, `size` of `normal`
or `small`, and `appearance` of `default`, `quiet`, or `on-color`. The deprecated `quiet`
boolean remains as a compatibility alias for `appearance="quiet"`. Key names are mapped to
native symbols and uppercased when no mapping exists. `KbdGroup` forwards native span props
and groups separate chord children into a sequence.

CSS exposes `area-kbd`, size and appearance modifiers, `area-kbd__key`, and
`area-kbd-group`. A solid Button automatically applies an on-color treatment; neutral solid
uses its own contrasting foreground for the plate. Menus automatically use quiet treatment.

## Token decisions

No new tokens were required. Kbd consumes the existing space-20/24 boxes, space-2/4
padding, keyboard gap, xs/11px type, 14px line box, small radius, component-hover surface,
subtle border, default/muted foregrounds, and inverse/ambient contextual colors. The Button
outer inset is a relationship among existing backplate sizes, not a new component token.

## Implementation

- `packages/styles/src/components/kbd.css`: distinct appearances, visible default edge,
  unboxed quiet treatment, contextual on-color treatment, and sequence spacing.
- `packages/styles/src/inset.css`: reserve the nested 20px/24px Kbd backplate at the Button
  trailing edge.
- `packages/styles/src/manifest.ts` and `packages/react/src/components/primitives.tsx`:
  replace the misleading tone axis with appearance, preserve the quiet compatibility prop,
  and add KbdGroup.
- `apps/docs/src/demos/display.tsx`, `gallery.tsx`, `pages.mjs`, and `scripts/build.mjs`:
  document and separately gallery-test size, appearance, chord, sequence, Button, and Menu
  compositions.

## Verification

Passed on 2026-09-18: `npm run lint:manifest`, `npm run typecheck`, `npm run build:docs`,
`npm run audit`, `npm run test:consumer`, the docs preference tests, `npm test` (18,104
tests), `node packages/tokens/src/contrast/report.ts` (344 assertions across 66 themes),
and `git diff --check`. The rebuilt docs report 38/38 components dogfooded and 270 demos.

Live Chromium inspection at 100% CSS zoom verified outline, neutral-solid, and colored-solid
Button compositions. Each is a 32px Button containing a 20px Kbd with 6px from the Kbd edge
to the Button edge on the top, right, and bottom (5px content inset plus the 1px Button
border). The neutral and colored contextual plates remain distinct, and neither paints a
nested outline or shadow.

## Remaining limits

Area does not yet parse Primer-style shortcut strings, resolve `Mod` per platform, expose a
full-text format, localize key names/order, register handlers, manage user remapping, or own
a shortcut help dialog. Those are explicit extension or product-command-layer work, not
missing visual states in the Kbd component.
