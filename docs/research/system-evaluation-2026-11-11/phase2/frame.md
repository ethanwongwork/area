# Phase 2 · frame worker (B1.1–B1.4), running report

## Done (in the working tree)
- **B1.1 frame recipe** in `packages/styles/src/components/surface.css`: `:where(<19 frame roots>)` sets the inset
  ladder (`--_fr-inset/mat/gap-sm|md|lg`), `--_fr-pad`, three corner roles (`--_fr-block` = radius-container;
  `--_fr-card` = min(container, max(radius-min, round-down-2(inset × 0.6 × factor / 0.3125))); `--_fr-around` =
  min(container, held + mat × concentric)), `--_fr-nested` = max(min(radius-row, corner), round-down-2(corner − mat)),
  `--_fr-picture` = max(radius-floor, round-down-2(corner − mat)), the title pair. Consumers: Card (ladder, corner,
  picture, title pair; size classes no longer restate the corner), Surface (Card's inset/gap/corner/title pair;
  nested chain publishes `--_fr-nested`), Panel (corner, publication), Asset card, Design card, Figure, Video player,
  Table, Description list, Board column (around), Calendar, Color picker.
- **One frame prop**: Description list `framed` → `variant=plain|surface` (alias kept); Checkbox/Radio `card` →
  `surface` (alias kept; CSS, layers.css, forced-colors.css renamed). **kind**: Asset card and Design card `layout` →
  `kind` (Design card keeps `layout` alias; exports `DesignKind`).
- **B1.3 chat card**: `:where(plan, queue, edit-summary, approval, composer, code-block, message__bubble)` corner =
  around(radius-control-md, ui-cluster); rows 4 from outer edge, text 12, head ui-row, strong title. Composer, Approval
  (plate takes nested floor), Plan, Queue (title default ink), Edit summary (head 30), Code block (both sizes), Message,
  Diff (nested floor 8). Composer actions = max(min(control-md corner, shell), shell − inset) = every Button's corner.
- **B1.2 item name**: shared `:where(card__title, asset-card__name, design-card__name, file-tile__name,
  board-card__title)` strong, default ink; families' own weights removed; outside a picture the line sits 8 below
  (`--_fr-name-gap`), indent 0 (Design card, Asset card outside).
- **B1.4**: text that ends a Card trims to its baseline less `--_card-descender-allowance` (2): bottom 16 vs top 18 at md.
- Tests: cohesion (4 new: frame recipe, chat card, item name, text-only bottom; updated corner/composer/approval/slot/
  margin/title tests), surface, asset-card, type-rhythm, description-list, design-card, checkbox, radio.
- Docs: specs (card, surface, composer, approval, plan, queue, edit-summary, code-block, message, design-card,
  asset-card, description-list, checkbox, radio, board, figure, video-player, table, file-tile), DESIGN_SYSTEM "Frames",
  GOVERNANCE vocabulary + deviations, documentation entries, area-ui-compose chat recipe row, demos.

## Values (probe of the built CSS; Corner 10 unless said)
| | t12 C/D/Cf | t13 C/D/Cf | t16 C/D/Cf | Corner 0 | Pill (t13 D) |
|---|---|---|---|---|---|
| Card md corner | 8/10/10 | 8/10/12 | 12/12/14 | 0 | 16 (14 at Corner 14) |
| Card md inset / gap | 16,18,18 / 12 | 16,18,22 / 12,16,20 | 22,22,26 / 20,20,24 | same | same |
| Card sm / lg corner (t13 D) | | 8 / 12 | | 0 | 12 / 20 |
| Card picture | 4 | 4 | 4 | 0 | 8 |
| Nested frame | 8/8/8 | 8/8/10 | 10/10/12 | 0 | 14 |
| Chat card corner | 12/14/14 | 14/16/16 | 16/16/16 | 0 | 20 (Corner 12: 18, 14: 20) |
| Chat text / head | 12 / 26,28,28 | 12 / 28,30,34 | 12 / 36,36,40 | | |
| Block (Table, DL, Panel…) | 16 | 16 | 16 | 0 | 20 |
| Text-only Card bottom / top | 14,16,16 / +2 | 14,16,20 / +2 | 20,20,24 / +2 | | |

## Verified (2026-11-13, after the restart)
- Build + manifest parity + token refs ok; typecheck ok; React family tests 202 pass; cohesion 93/96 pass run one by
  one (fails: ground scopes vs the new Regular weight axis, Input action hit target; one pre-existing test hangs on a
  catastrophic regex over `.area-asset-card`'s body, "state indicators follow the state settings"); check:docs ok.
- Rendered capture of my 24 families (`--reuse` check): 0 new assert violations. Intended snapshot moves, to record
  in the full-run update: approval 19→16, option/tile 7→8, visual 3→4; composer 19→16; attachment in composer 11→8;
  code-block 11/13→16; diff 4→8; surface 16/4/9→10/12/8; edit-summary head 34→30. Card, Plan, Queue, blocks unchanged
  at the defaults. Snapshots not updated: a partial capture would drop every other family's rows.

## Left
- Snapshot update (corners, header-bars) on the conductor's full rendered run.

## Not done, for the conductor
- Selected-state paint still per family (later wave owns state paint). Asset card `container` and Settings group
  `framed` not on the frame prop. Toolbar, Attachment and choice option rows keep their own corners. Soft Surface
  unchanged (owner). Card well's nested card stays 4 (= the well's picture corner).
