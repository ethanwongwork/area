# Redraw A report (phase 2, 2026-10-07)

Changed sources (10): person, person-add, person-remove, person-check, person-x, person-lock,
person-settings, person-key, key, handshake. No other icon touched. Originals: `redraw-A/orig/`; finals:
`redraw-A/final/`. Scripts (all geometry solved, nothing traced): `redraw-A/bite.mjs`, `family.mjs`,
`key.mjs`, `pkey.mjs`, `handshake3.mjs`. Sheets: `redraw-A/redraw-A-after-1.png` (person, -add, -remove,
-check beside Lucide user, Fluent person / person_add), `-after-2.png` (-x, -lock, -settings, -key beside
Fluent person_key), `-after-3.png` (key, handshake beside Phosphor key / key-fill, Lucide handshake, and the
two alternative candidates).

## 1. person and the standalone-figure family

- **Verdict (reviews2):** replace, library Lucide; note "gap between the head and shoulders is still too big,
  make it a bit smaller" (r1: gap too large, head bigger; done 10-03 as head r 3, gap 2.5).
- **References:** Lucide `user.svg`, Fluent `person_16_regular`. Lucide's own gap is larger (4 on 24 = 2.67 at
  16) and its body is an open U, so Lucide was not followed for the body; the note (the gap) is what was
  answered, and person keeps the 10-06 dome the family is built on.
- **Grid check:** the head's extremes and the body's top must sit on the 0.5 grid, so the only steps are 2.5
  (now) and 2. 2 between centre-lines (ink 0.88, the detail step) is the framed figures' gap (person-circle,
  person-square: head bottom 8.5, body top 10.5). Verified.
- **New construction:** head r 3 at 8, 5 (unchanged); body `M3 13.5A3.5 3.5 0 0 1 6.5 10H9.5A3.5 3.5 0 0 1 13
  13.5Z` (10 × 3.5, r 3.5 shoulders, moved up 0.5). Gap 2 between centre-lines (0.88 detail). Head : body
  unchanged. Ink 11.12 × 12.62, centre 8, 7.75: the heavy-base optical offset (0.25 high, as bell). The long
  base edge is now on x.5 (13.5) and the short top on a whole pixel; it was the other way round.
- **Family (person-add, -remove, -check, -x, -lock, -settings):** the same change: the body moves up 0.5
  (`M… 1.5 13.5A3.5 3.5 0 0 1 5 10H8A3.5 3.5 0 0 1 11.5 13.5`), the head stays at 6.5, 5 r 3. The marks stay
  where the 10-06 spec puts them (about 12.5, 12.25). Moving them up 1 with the body (the only grid-keeping
  move) put the ×, the gear and the lock's shackle 2.02–2.25 from the head (near misses), so they stay. The
  shared round bite was re-solved for the new body (`bite.mjs` measures each mark's overlap cut, 2.25): a
  circle about 12.5, 12.25, r 4.67, through the base at x 8 and the shoulder at 8.396, 10.022 (was r 4.596
  through 8.25, 14). Outline body `M8 13.5L1.5 13.5A3.5 3.5 0 0 1 5 10L8 10A3.5 3.5 0 0 1 8.396 10.022`;
  filled body that closed along the bite; halos unchanged. Ink: add/lock 14.12 × 13.62 centre 8, 8.25 (as
  before); remove/check 14.12 × 12.62 centre 8, 7.75; settings 7.98, 8.13; x 7.88, 8.13.
- **person-key:** see 2 (its figure gets the same body; the body is cut round the new key by the overlap cut).
- Not touched: person-circle, person-square, shield-user, person-chat, people, id-card (their own figures).
- **Verification:** lint clean (`--only`, all 8). Slivers 16/48: none, except person-settings' known
  checker hit at the gear's centre (12.4, 12: the filled gear disc read against its own ticks, recorded by
  group 7 and on 2026-10-03; unchanged by this pass). Looked before/after at 16–96, outline and filled.

## 2. key (and person-key)

- **Verdict (reviews2):** replace → Phosphor (r1: replace → Lucide, done 10-03). No note.
- **References:** Phosphor `regular/key.svg`, `fill/key-fill.svg` (measured on its 16 grid: bow centre-line r
  4.5 at 10, 6; ⌀1.5 hole offset 1.25, −1.25 from the bow's centre; a blade 3.54 wide on the bow's 45° axis
  whose edges meet the bow at corners; the end squared to the axes with an r 0.5 corner; a bit of two 1.5
  steps along the lower edge; filled one solid with the hole cut out).
- **Group-9 candidate checked:** its r 4 bow on a blade only 1.77 wide (centre-lines x + y = 14 / 16.5) leaves
  a 0.64 ink pocket inside the blade (it lints because the pocket is not an enclosed counter, but it reads as
  a double line), and its end lacks Phosphor's second step. Not used.
- **New construction (key.mjs):** bow r 4.5 at 9.5, 6.5 (extremes 5 / 14, 2 / 11); ⌀1.5 dot at 10.75, 5.25
  (Phosphor's offset; tight 1.42 to the ring), drawn in the outline as Phosphor's and a hole when filled
  (`data-filled="hole"`); blade on the axis x + y = 16, edges x + y = 13 and 18 (3.54 wide, Phosphor's
  width; the lattice puts the edges at −3 / +2 rather than ±2.5); end: left side x 1.5 (11.5–14.5), bottom y
  14.5, r 0.5 corner; bit `H4V13H5.5V11.5H6.5` then the lower edge to the bow. Path `M5.194 7.806L1.5 11.5V14A0.5
  0.5 0 0 0 2 14.5H4V13H5.5V11.5H6.5L7.479 10.521A4.5 4.5 0 1 0 5.194 7.806Z`. Ink 13.62 × 13.62, centre 7.75,
  8.25: a 13.62 span on the 0.5 grid can't centre; this way the heavy bow sits nearer the centre (lattice
  offset for a pointed shape, ≤ 0.25). Filled: one solid, the hole knocked out (Phosphor key-fill).
- **Alternative (not applied):** `redraw-A/keyC.svg`, bow r 4 at 10, 6, blade edges 13 / 18, end at 2 / 14,
  centred exactly at 8, 8 (13.12 square) but a smaller bow than Phosphor's (0.70 of the span against 0.77).
- **person-key:** the key at about 0.56, still diagonal, lower right: bow r 2.5 at 12, 10.5 with the ⌀1.5 dot
  centred (1.19 tight; Phosphor's offset leaves 0.48 at this size), blade edges x + y = 21 / 24 (2.12 wide,
  the 1.0 counter floor), end x 8 / y 14.5 with the r 0.5 corner, one 1.5 step of the bit (`H11V13`).
  Simplified and recorded: the bit has one step instead of two, and the dot is centred. Bow at 12, 10 (the
  exact 0.56 placement) left the head 0.81 away, under the detail step; r 2 versions lost the dot and read as
  a keyhole (`pk-r2a/b/c.svg`). Body cut round the key by the overlap cut (`behind`): outline `M5.75 13.5L1.5
  13.5A3.5 3.5 0 0 1 5 10L7.276 10`, filled body that closed, the key `data-halo`. Ink 14.12 × 13.62, centre
  8, 8.25 (as before). The key in person-key is now visibly the key icon's drawing (bow with its dot, wide
  squared blade, a stepped bit).
- **Verification:** lint clean; slivers 16/48 none; looked at 16–96 beside Phosphor and Fluent person_key.

## 3. handshake

- **Verdict (reviews2):** replace → Lucide (r1: replace → Phosphor, done 10-03). No note.
- **Reference:** Lucide `handshake.svg`. Construction: two slanted cuffs (the right with a short foot that
  nearly touches the fingertip), the left hand's top line ending on the right hand's thumb line, the right
  hand's top an r 5.79 arc rising from the thumb line with a small wrist dip before the cuff, the thumb tip a
  semicircle, a 90° knuckle (r 3), and three fingertips along the bottom, all on parallel 45° lines 6 apart,
  each fingertip a semicircle whose end lands on the next finger's line.
- **Key finding:** Lucide × 2/3 lands every 45° line on Area's lattice (fingers x − y = −8, −4, 0, 4; thumb x +
  y = 10, 14), and the fingertips become r 1.414 semicircles on a 2.83 chord. The group-7 candidate used ×0.6,
  which puts the lines off the lattice and makes the loops smaller (r 1.27). At 2/3 the loops lint clean and
  show no slivers at 16 or 48, so all three of Lucide's fingertips are kept.
- **New construction (handshake3.mjs):** left cuff 2.375, 2 → 2, 10 joined to the left hand's lower edge
  (x − y = −8) to 5.5, 13.5 and its fingertip to 7.5, 11.5; the left top line y 2.5 from the cuff to the arc
  (7.72); Lucide's middle finger 7, 11 → 8.5, 12.5 and its tip to 10.5, 10.5; the right hand from 9, 9 → 11,
  11, tip to 13, 9, up x − y = 4 to a 90° r 2 knuckle (corner 9, 5), down x + y = 14 to 7, 7, thumb tip to 5,
  5, up x + y = 10 into an r 4 arc (top y 2), then straight to the right cuff at y 2.5; right cuff 13.625, 2 →
  14, 10 with its foot to the fingertip's rightmost point (13.414, 10). Line glyph, `data-angles="free"` (the
  cuffs), fills by weight. Keyline horizontal → circle (Lucide's handshake is nearly square: ink 13.12 ×
  13.04, centre 8, 7.96).
- **Simplified and recorded:** the cuffs are pulled in 0.67 each side to fit the keyline, and their slant cut
  from 0.67 to 0.375 over 8 (0.5 left the thumb tip 0.83 from the cuff in the filled variant); the wrist dip
  before the right cuff (0.3 tall at 16) is dropped; the right cuff's foot is shortened to meet the fingertip.
- **Alternative (not applied):** `redraw-A/hs3-noF2.svg`, Lucide's middle finger dropped (two fingertips),
  cleaner at 16 but less Lucide.
- **Verification:** lint clean (gaps 1.27 / 1.65 tight, others open; counters 3.4, 3.73); slivers 16/48 none;
  looked at 16–96 beside Lucide.

## For the coordinator (spec and records; not edited by me)

- Spec records to add: person (body 10–13.5, gap 2, ink centre 7.75 heavy-base offset), the family's new body
  and bite (r 4.67 about 12.5, 12.25 through 8, 13.5), key (Phosphor), person-key (0.56 key, one-step bit,
  centred dot), handshake (Lucide × 2/3, keyline circle). The skill's figure line ("head r 3, 2.5 from the
  body") should read 2.
- `docs/research/icon-review/2026-10-06/person-family.mjs` still writes the old body (10.5–14) and the old key;
  rerunning it would undo this pass. `redraw-A/family.mjs` (run `node family.mjs 0 8 4.67`) and `pkey.mjs`
  replace it.
- Changed icons go back to review (`icon-batch.mjs --review`), and the generated files need regenerating
  (`npm run icons:pilot`). I did not run either.
