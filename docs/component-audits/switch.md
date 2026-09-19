# Switch audit — corrected 2026-09-18

## Decision summary

Switch owns one immediate on/off setting. Its public contract is deliberately small:
three sizes, an accent on-state, an always-pill track and thumb, label start/end,
description, full-width settings rows, native states, and optional loading beside the
track. The first build incorrectly treated the union of benchmark features as a shipping
mandate. Owner review replaced that policy with normalized overlap plus Area fit.

The default is **md**, with a 40×20 track, 16px thumb, 2px inset, 8px label gap, and
14/20 type. Small is 32×16; large is 48×24. Compact density changes label type only.
The radius axis never changes the identity shape.

## Boundary and aliases

`Toggle` and `ToggleSwitch` are search aliases for Switch. Checkbox is the deferred-submit
choice; ToggleButton is a pressed action; Segmented chooses among visible alternatives.
A settings list is a composition of Switch and Panel, not another Switch variant.

## Measured benchmark table

Numbers come only from pinned files in `docs/audit-pack/evidence/`. Full details,
calculations, and n/p fields remain in the
[construction entry](../audit-pack/construction/01-selection.md#switch-status-revised-and-owner-corrected-2026-09-18).

| System / evidence file | Track W×H | Thumb | Inset / border | Shape | Label/type |
| --- | --- | --- | --- | --- | --- |
| OpenAI `oai/Switch.txt` | 32×19 | 13×13 | inset 3 / no border | full/full | gap 8; 14/20 |
| Primer `pri/ToggleSwitch.txt` | 64×32; 48×24 | conditional 31×28 / 23×20 | outer inset 2; border 1 | 6/4 | gap 8; 14 or 12 |
| shadcn `sha/switch.txt` | 32×18.4; 24×14 | 16 / 12 | border 1; placement n/p | full/full | external label n/a |
| Fluent `flu/Switch.txt` | 40×20; 32×16 | 18 / 14 icon box; painted bounds n/p | border 1 | full | composed gap 12; small 12/16 |
| Material 3 `m3/switch.txt` | 52×32 | 16 off; 24 on; 28 pressed | outline 2; placement n/p | full/full | n/p |
| Carbon `car/toggle.txt` | 48×24; 32×16 | 18 / 10 | inset 3 | 12/full | gap 8; state 14/20 |
| MUI `mui/Switch.txt` | 34×14; conditional 26×10 | 20 / 16 | padded root; placement n/p | full | external label n/a |
| Atlassian `atl/toggle.txt` | 32×16; 40×20 | 12 / 16 | symmetric clearance 2 | 9999 / n/p | n/p |
| Radix `rdx/switch.txt` | 28×16; 35×20; 42×24 | 14 / 18 / 22 | inset 1 | themed | external label n/a |
| Geist, Notion, Figma, Apple | n/p | n/p | n/p | n/p | no indexed file |

## Consensus and Area decision

The reusable desktop cluster is 16–20px high, with a 24px larger tier, 1–3px thumb
clearance, and widths around 1.75–2 times height. OpenAI, shadcn, Fluent, Carbon,
Atlassian, and Material support a pill identity. Primer's rectangular half-width thumb,
Material's state-varying handle, MUI's protruding thumb, and Radix's theme-dependent shape
are outliers. Primer's 64×32 base is also much larger than the desktop cluster.

| Size | Track tokens | Thumb | Inset / gap | Default type | Compact type | Shape |
| --- | --- | --- | --- | --- | --- | --- |
| sm | `space-32 × space-16` | `space-12` | `space-2 / space-8` | `control-sm` 13/18 | 12/16 | `radius-full` |
| **md** | `space-40 × space-20` | `space-16` | `space-2 / space-8` | `control-md` 14/20 | 13/18 | `radius-full` |
| lg | `space-48 × space-24` | `space-20` | `space-2 / space-8` | `control-lg` 14/20 | 14/20 | `radius-full` |

The track is centered on the first label line box. The description sits below the label
with `space-2` separation and `control-sm` type. Loading uses the existing Area Spinner
at size sm beside the track. The track remains accent because on/off is state rather than
semantic status.

## Candidate decisions after owner review

| Candidate | Decision | Reason |
| --- | --- | --- |
| Pill accent Switch; sm/md/lg; native states | Core | Repeated reusable-system overlap and the established Switch job. |
| Label end/start; description; accessible hidden label | Core | Common setting layouts and native labeling requirements. |
| Full-width settings row and Panel list | Composition | Existing layout components express the context without new Switch appearance API. |
| Loading beside | Extended | Useful for remote immediate settings; implemented with shared Spinner. |
| Outline and rounded | Log only | Construction differences in a minority of systems, not durable Area variants. |
| Tone/custom matrix | Log only | Color does not add Switch meaning; custom duplicated Area accent. |
| xs/xl | Log only | Five names produced undersized and duplicate geometry; three tiers cover the evidence clusters. |
| Thumb/track icons | Log only | Some overlap, but no Area use case and reduced clarity at normal sizes. |
| Track/state text and localization | Log only | Track text is single-system and forces content-sized geometry; adjacent state text duplicates native state. |
| Label above | Log only | A Fluent layout better composed with Field. |
| Required/invalid and choice card | Separate | Deferred validation belongs to Checkbox/Field; selectable cards are a container pattern. |
| Disabled-focusable | Log only | Specialized policy beyond the native disabled contract. |
| Spinner in thumb and delayed private announcement | Log only | Crowds the glyph and duplicates Spinner/status behavior. |
| Promise rollback helper | Composition | Application state owns network rollback; Switch emits synchronous changes. |
| Pointer drag | Log only | Mobile-source behavior with substantial custom desktop complexity and no Area use case. |
| Standalone dark/radius/density/motion cases | Verification | The gallery customizer covers system axes without presenting them as Switch variants. |

## Post-build rendered measurements

Measured in the local browser fixture on 2026-09-18. The fixture covers two densities,
seven radius presets, three sizes, and both checked states: 84 geometry cases.

| Size | Rendered track | Rendered thumb | Off/on endpoint inset | Label gap | Default type | Compact type | Alignment |
| --- | --- | --- | --- | --- | --- | --- | --- |
| sm | 32×16 | 12×12 | 2 / 2 | 8 | 13/18 | 12/16 | track top = label line top + 1 |
| md | 40×20 | 16×16 | 2 / 2 | 8 | 14/20 | 13/18 | track and label line share top |
| lg | 48×24 | 20×20 | 2 / 2 | 8 | 14/20 | 14/20 | track top = label line top − 2 |

All seven radius presets resolve to the same declared `radius-full`; browser painting caps
it to half each box. Dark + compact + sharp measured the default at 40×20 with 13/18 type
and the same pill shape. No rendered value disagrees with the revised decision.

## Implemented contract

- One native `input[type=checkbox][role=switch]`; name/value, validity, form submission,
  reset, controlled state, ref, native props, Space, and label activation are preserved.
- `size="sm|md|lg"`, default md; `labelPosition="label-end|label-start"`; `fullWidth`.
- Visible label, description, or consumer-supplied accessible name.
- checked, hover, active, focus-visible, disabled, disabled-checked, read-only, loading.
- `onCheckedChange` is synchronous. Loading sets `aria-busy`, blocks changes, and reuses
  `Spinner size="sm"` beside the track.
- Theme, density, radius, surface, contrast, accent, and motion are controlled through the
  gallery's right panel. Radius intentionally has no effect on the Switch pill.

## Gallery inventory

The gallery has 18 focused cases: SwitchDefault; SwitchSizeSm; SwitchSizeMd; SwitchSizeLg;
SwitchChecked; SwitchHover; SwitchActive; SwitchFocus; SwitchDisabled;
SwitchDisabledChecked; SwitchReadOnly; SwitchLoading; SwitchLabelEnd; SwitchLabelStart;
SwitchDescription; SwitchHiddenLabel; SwitchSettingsRow; SwitchList. Every ordinary tile
contains one Switch. SwitchList is the named multi-row composition exception. Form reset,
controlled state, RTL, narrow content and axis permutations remain in verification fixtures.

## Verification

- Browser fixture: **1,020 assertions, 84 geometry cases, zero failures**.
- Visual pass: default/compact, light/dark, sharp radius, states, description, RTL, narrow
  content, and Panel list. Text and track centers align on the first line.
- `npm run build`, `npm run lint:manifest`, `npm run typecheck`, `npm run build:docs`, and
  `npm run test:switch`: pass.
- `git diff --check`: pass.

Native Windows forced-colors, physical coarse-pointer hardware, and screen-reader speech
were not available. Their CSS/native semantics are implemented but not claimed as manually
verified.
