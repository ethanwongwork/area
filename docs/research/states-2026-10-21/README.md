# Interaction states, 2026-10-21

Owner: "can we also look at selected states, not sure if its consistent across all components. the color itself seems
too dark for sure. i want to really analyze the hover, pressed, and selected state for each component and make sure
its all cohesive, subtle, and also leverages professional motion interaction".

Page with live options: https://claude.ai/artifact/XNiSsqt35dDieqbu2Xe7NX

## Method

`sweep.mjs` drives headless Edge against the app (the dev server or `desktop-dist`). For every family, every
interactive element in the gallery tiles gets the same reads:
- paint at rest, under `:hover`, and under `:hover:active`, forced through DevTools up the ancestor chain;
- the composited plate (own fill, `::before` / `::after`, first painted child), ink, edge, ring, outline, decoration;
- the transitions entering (read while hovered) and leaving (read at rest), before transitions are switched off.

Every selected element (`aria-selected`, `-pressed`, `-checked`, `-current`, `data-selected`, a label around a checked
input) is read against an unselected sibling. `analyze.mjs` groups the output by role. Raw JSON is not committed
(about 2 MB per theme); re-run with `node sweep.mjs out.json light|dark <base> <port>` (`SLUGS=a,b` narrows).

Read the output with care. These came back as false positives and were checked by hand:
- a press shown as ink (row actions) or a gradient (Badge);
- a hover painted by an ancestor that carries the transition (Table row, Board card, Edit summary row, Chip);
- a transition on a part that doesn't change on hover (Nav's marker);
- a control pressed through its input (Checkbox, Radio).

## Findings

| | Result |
|---|---|
| Hover and press | Cohesive. 25 families of rows share one ladder. Light: rest #ffffff → hover #f3f3f3 → pressed #e7e7e7. Dark: #121212 → #272727 → #3e3e3e. Solid buttons step one way (#282828 → #1d1d1d → #141414), and every press goes past its hover. One gap: Video player's start button has no press. |
| Motion | 93 of the 98 families with something to hover follow the rule: instant in, 140ms out (`duration-fast`) on `ease-out`. Three strays, fixed: Token row faded in, and Code block's line numbers and toggle switched their underline instead of fading it as Link does. |
| Selected | Not cohesive. Eight treatments: row plate, solid mark, container edge, raised thumb, swatch ring, chip plate, indicator, ink. Two colour systems: Card and Asset card always draw `stroke-selected` (the accent's text shade, #004cb0, 7.9:1 on white) and ignore the Selection setting. Choice cards follow it (#282828 at Neutral, 14.7:1). Weights differ: Card 2px, Asset card 1px, a containerless image ring 2px, choice cards 1px. |

## Open

Options A–E for selected containers are on the page. The recommendation is C: every selected container draws a 1px
edge in the Selection setting's colour, the owner's 2026-09-28 choice-card rule ("darker, not thicker") extended.
Awaiting the owner's pick.
