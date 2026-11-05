# Shadow depth (2026-11-04)

Part of the fidelity pass: Area's examples read less polished than UI kit examples, and the earlier measure found
the default menu shadow about a third of a common kit's depth. Owner: "Shadows next", then, on the pick page,
"go with your recs" (2026-11-05).

## Method

The Workspace screen at true size (Themes viewer at 100%) with its menu open, captured from the real Electron window
(2x) with each option set on the screen's frame as `data-area-*` attributes. The reading is the darkest pixel under the
surface, in light, on the 255 white page: under the menu's centre (down to 60px), and under the first quick-action card
(down to 8px). The kit references are the common large and small shadows of a utility CSS kit, set as an inline
`box-shadow` on the same menu and cards:

- large `0 10px 15px -3px` + `0 4px 6px -4px`, both 10% black
- small `0 1px 3px 0` + `0 1px 2px -1px`, both 10% black

Pick page: https://claude.ai/artifact/QH1tqEijwhoZutndK8YtJv (picks would land in `verdicts/floating` and
`verdicts/resting`).

## Readings

| Floating (menus, popovers, tooltips, dialogs) | Under the menu |
|---|---|
| 3 (the default until 2026-11-05) | 249 |
| 5 | 245 |
| 8 (the top of the scale) | 240 |
| 8 with Reach 6 | 238 |
| 12 (past the scale, set as `--area-elevation`) | 232 |
| Kit large | 231 |

| Resting (cards, panels) | Under a card |
|---|---|
| 3 (default) | 253 |
| 5 | 252 |
| 8 | 251 |
| 8 with Reach 8 | 247 |
| Kit small | 235 |

In dark every option reads 2, the page itself: shadows do not read on near-black, and the white rim (the role's strength
× 2, at most 16%) is what separates a floating surface. At 8 the rim is 16% and reads as a clean edge.

## Decision

- **Floating: 8 by default** (was 3). The deepest step already on the scale. 12 would match the kit, but the owner
  found Fluent's strength (14%) too strong when the axis was made (elevation-2026-10-14.md), so the scale is not
  extended. Modal surfaces double the float (16% key at 8).
- **Resting: stays 3.** The owner asked on 2026-10-30 for rest shadows "even more subtle/small"; strength barely moves
  the contact layer (253 to 251 across the scale), and only Reach, which lengthens every shadow, gets closer to the kit.

The owner's own Area system saved Floating 3 in its working theme and both published versions. On 2026-11-05 (owner:
"Yes, set it to 8") the working theme was set to 8, so the Inspector's specimens draw 8; the published versions (1.0,
1.0.1) still say 3, and the app's own UI follows the published theme until the owner publishes.
