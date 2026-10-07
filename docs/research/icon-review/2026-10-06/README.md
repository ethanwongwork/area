# Icon review, 2026-10-06

Owner: "do an audit of all the filled icons and make sure there is consistency with how they are
filled. things like the cloud lightning using a cutout but the arrow in import is just an inverse
shape. also at larger preview sizes the strokes and shapes do not scale equally … also there are a
few that i want to re review the design of and clean up visual errors, like graduation cap, bandage
qr code, desktop check (check is off centered), globe, airplane needs a cockpit window added,
fingerprint curves are not smooth/on the same track".

Construction and decisions: `docs/specs/icons.md`, "Filled consistency audit and the size curve's hold,
2026-10-06".

| Sheet | Shows |
|---|---|
| `1-refs-crossing.png` | parts crossing a solid's edge: Area beside Fluent, Lucide, Phosphor and Hugeicons |
| `2-refs-redraw.png` | the owner's redraw list beside the four libraries |
| `3a-crossing-before-after.png` | import, cloud-upload, cloud-download, notebook and cloud-lightning, before and after, outline and filled at 16 / 24 / 32 / 48 and 96px |
| `3b-redraws-before-after.png` | the seven redraws, the same way |
| `4-refs-arrow-containers.png` | second round: an arrow into or out of a container, across the libraries (import vs share) |
| `5a-halos-before-after.png` | second round: import as a line glyph like share, halos at one line weight, the fingerprint as Apple-style loops |
| `5b-front-cuts-before-after.png` | second round: gaps that offset a front part, now data-halo (flush, one line weight at every size) |
| `6-fingerprint-android.png` | third round: the fingerprint as a spiral after Android's (`fingerprint-spiral.mjs`) |
| `7-fingerprint-key-question.png` | fourth round: the fingerprint with an S core, person-key with the key icon, the ? gap matching the ! |
| `8a-embedded.png`, `8b-embedded.png` | fourth round: every base icon (blue) beside the icons that hold a smaller copy of it (`embedded.mjs`) |
| `9-fingerprint-libraries.png` | fifth round: fingerprints in Fluent, Lucide, Phosphor, Hugeicons, Tabler, Heroicons, Bootstrap, Material Symbols, Iconoir |
| `10-fingerprint-candidates.png` | fifth round: ten Area candidates, outline and filled (`fingerprint-candidates.mjs`, `candidates-sheet.mjs`) |
| `11a-person-family.png` | fifth round: the person family on person's proportions, every mark at the lower right in one bite |
| `11b-faces-cart.png` | fifth round: faces centred in their shapes, bot, cart wheels on the bar |

The 96px column also shows the size-curve change: before, the line kept thinning above 24px; now a
large icon is the 24px drawing scaled.

## Tools

From the repository root, after `npm run icons:pilot`:

- `node docs/research/icon-review/2026-10-06/audit.mjs <out-dir> [category…]`: every icon by the icon
  browser's categories, outline 32 · filled 32 · filled 16 per cell (the whole-set audit sheets).
- `node docs/research/icon-review/2026-10-06/escapes.mjs`: icons whose knockout leaves its solid (a part
  that would change colour at the edge). Today: chess-rook only, by design.
- `node docs/research/icon-review/2026-10-06/large.mjs out.png name…`: 128px on a 16 grid with 16 / 24 / 32.
- `git show HEAD:apps/docs/src/pilot-icons.tsx > apps/docs/.cache/pilot-before.tsx`, then
  `node docs/research/icon-review/2026-10-06/before-after.mjs out.png name…`.
- `DPR=4 node docs/research/icon-review/2026-10-02/sizes.mjs out.png name…` renders at 4× for a closer look.
- `node docs/research/icon-review/2026-10-06/gap-to-halo.mjs [--write]`: turns a gap that offsets a front
  part into `data-halo` on that part (dry run without `--write`).
- `SLIVER_SIZE=48 node docs/research/icon-review/2026-10-02/slivers.mjs`: the sliver check through the size curve.
- `node docs/research/icon-review/2026-10-06/embedded.mjs out.png [base…]`: icons inside icons, each base
  beside the icons that hold a smaller copy (the list is `EMBEDDED` in the script; add new composites there).
- `before/`: the sources as they were.

## Open decisions

1. **One colour per part** (delegated; import is now a line glyph like share): a part crossing a solid's edge stays ink, cut round when it is
   in front (halo) and joined when attached. Alternative for the arrow pair: Phosphor's filled clouds
   move the arrow up inside the cloud as a knockout (owner note on cloud-download, 2026-10-03).
2. **The size curve holds at 24** (delegated): 1.8px at 32, 2.7 at 48 (Fluent's masters: 2, 2.5).
3. **Outline overlap cuts** stay geometric (2.25 between centre-lines): above 24px an outline crossing's
   space is 1.5× its line, while the filled cut is now 1×. Matching them means masking the outline too.
4. **globe**: the owner's note named "visual errors" without detail; the fix taken is the pole joins
   (lens meridian). Say if it was something else.
6. **Fingerprint**: pick one of the ten candidates (`10-fingerprint-candidates.png`); the icon is candidate 1 meanwhile.
7. **Person family** marks moved from beside the head to the lower-right badge (Fluent); confirm.
5. **plane**: one cockpit window; passenger windows did not fit the fuselage's 4px height at the gap scale.
