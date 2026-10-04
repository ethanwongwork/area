# Whole-set quality pass (2026-10-03)

Every Area icon reviewed by group (`groups.mjs`: documents, folders and storage, git and code, keys
and hardware, devices, connectivity, transport and places, weather and nature, people, agents,
chat and mail, calls and alerts, media, images, arrows, cycles, marks, actions, menus, squares,
type, lists, layout, Figma inspector, shapes and booleans, drawing, charts, time, commerce,
security, objects). Fixes and the icons looked at and kept: `docs/specs/icons.md`, "Quality pass,
2026-10-03". All 20 changed icons are back in review.

| Sheet | Shows |
|---|---|
| `1-before-after.png` | The 20 fixed icons, before and after, outline and filled, at 16px and 64px |
| `sheets/NN-<group>.png` | The whole set after the pass, one sheet per group: outline and filled at 16 / 24 / 32 / 48 through the size curve |

To confirm (delegated): person-circle and shield-user fill the figure inside a line frame, as
person-square and person-chat (they flooded the frame and knocked the figure out); piano's filled
variant equals the outline; bluetooth-off drops the rune's arm that runs along the slash; group's
filled variant is one solid.

Re-render (from the repository root, after `npm run icons:pilot`):
- `node docs/research/icon-review/2026-10-03/grouped.mjs <out-dir> [group-index…]` (add `--large`
  for outline and filled at 96px with the true 16px line, the review view);
- `node docs/research/icon-review/2026-10-03/big.mjs out.png name…` (320px on a 16-unit grid);
- before/after as in `2026-10-02/README.md` (`<name>-was.svg` copies, then `before-after.mjs`).

Headless Edge here can hang after writing its screenshot; these scripts use their own profile and
an 8 s kill. In zsh pass names as separate words, not one `$VAR`.

Second round (same day): filled negative space follows the size curve (spec "Quality pass,
2026-10-03", second round). The one-by-one review page is
https://claude.ai/artifact/4sGs7JYAfNQexTPW9TQR9w; rebuild its data with
`node docs/research/icon-review/2026-10-03/review-data.mjs <dir>/data.js` (after `icon-refs.mjs
fetch`) and republish. `slivers-at.mjs` is `slivers.mjs` at a real size (`SIZE=32`); the scan is
only meaningful up to 32, where the line is still wider than its 0.6px threshold.
