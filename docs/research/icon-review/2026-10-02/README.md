# Audit follow-up (2026-10-02)

The audit's owner questions (`docs/research/icon-audit/README.md`, "For the owner"), drawn on the
recommendations and delegated: confirm or overturn by icon. Construction lines are in
`docs/specs/icons.md` ("Audit follow-up, 2026-10-02"); all 18 icons are back in review.

| Sheet | Shows |
|---|---|
| `0-refs-audit-open.png` | The questioned icons beside Fluent, Lucide, Phosphor and Hugeicons (`audit-open` in `icon-references.json`) |
| `1-before-after.png` | Before and after, outline and filled, at 16px and 64px with the true 16px line |
| `2-refs-multiples.png` | Multiples (files, folders, copy, chats, images, library, stacks) across Fluent, Lucide, Phosphor and Hugeicons |
| `3-multiples-models.png` | The decision: Area's halo vs the same-shape duplicate in three directions (prototypes in `explore/multiples-*`, from `multiples.py`) |
| `4-calendar-aligned.png` | #2 explained: why calendar's grid needs `data-gap="aligned"`, and the alternatives |
| `5-open-items.png` | hand, flow-wrap vs grid, padding-axis vs padding-sides, minus vs subtract, pin vs unpin |
| `6-rejected-round.png` | blocks, bandage, person-chat, binoculars, waypoints, toy-brick beside the references |
| `7-whole-pixel-stacks.png` | Three-line stacks at 1× (enlarged): centred on whole pixels vs moved to x.5 |
| `8-coverage-priority.png` | The 40 priority coverage gaps, as each library draws them |
| `9-booleans-before-after.png` | The booleans at 5 × 5, exclude solid |
| `10-round-3-before-after.png` | The owner's picks: Phosphor's multiples and books, the hand filled, stacks on x.5, the rejected round redrawn |
| `11-batch-62-compare.png` | Batch 62, the coverage round (35 icons) beside Fluent |
| `12-closed-shapes.png` | Cursor's technical look: today's gap cuts and open strokes beside closed prototypes (`explore/closed-*`, from `closed-prototypes.py`) |
| `13-dot-roles.png` | Dots by role (⌀1.5 detail, ⌀2 mark, ⌀3 badge) and the four icons in the wrong role |
| `14-fixes.png` | library, hand, bandage and binoculars fixed (outline and filled) |
| `15-overlap-rule.png` | The overlap rule refined from Cursor's set: stacks as open L's, slashes crossing flat, decoration closed; what keeps its gap |
| `16-parts-overview.png` | Every family with its base drawn in red under each member (`sheets.mjs parts`) |
| `17-overlap-applied.png` | The overlap rule applied: stacks as an open L, flat slashes, closed decoration; and the dots by role |

Drawn: calendar's date grid (with the family's taller body and header at 6.5), chat's text lines,
send's fold, pencil's ferrule, indent and outdent centred, eraser at about 1:2, coins' rim, a larger
picture-in-picture window, building's three rows of windows, bot-guard's narrower cap; filled:
crosshair by weight, camera-off keeps its lens, agent as Fluent's split hexagon, people with both
figures filled.

Decided (owner, 2026-10-02): booleans at 5 × 5 with exclude solid (drawn); indent and outdent stay
as drawn.

Open decisions:

Decided later the same day (owner): multiples follow Phosphor's layering (files, folders, copy,
chats, images, cards, books); waypoints is Fluent's, binoculars Lucide's, person-chat and bandage
Hugeicons'; everything else on the recommendations (calendar's even grid, stacks on x.5, the hand
filled, aliases, pin renamed location); then the coverage round (batch 62). All drawn (sheets 10
and 11; spec "Owner round, 2026-10-02" and "Batch 62").

Open decisions:

- Done (owner, 2026-10-02): the overlap rule (`cursor-rules.md` §1, sheets 15 and 17).
- Done (owner, 2026-10-02): dots by role (sheet 13); the parts overview (sheet 16).
- Batch 62's exceptions (in its spec section): image-plus and cart-add put the + top right;
  shield-alert's longer stem; solid knob, centre and swatch (toggle, radio-button, text-color);
  headset's shorter cups; person-settings' ring-and-teeth gear; navigation's dart.
- Still to do: the list family's stacks and chip's pins on whole pixels; blocks and toy-brick;
  file-zip (archive stands in); the 41 secondary coverage gaps in `coverage.md`.

Re-render (from the repository root, zsh): explainers with
`node docs/research/icon-review/2026-10-02/sheets.mjs multiples|aligned|stacks out.png`; reference
sheets with `icon-refs.mjs sheet out.png multiples|open-items|rejected-round|coverage-priority`; copy each changed icon's previous source beside it as
`<name>-was.svg`, run `npm run icons:pilot`, then
`node docs/research/icon-review/2026-10-02/before-after.mjs out.png <names…>`, and remove the
copies. References: `node apps/docs/scripts/icon-refs.mjs sheet out.png audit-open`.
