# Rules from Cursor's icon system, for Area (proposal, 2026-10-02)

Source: "The making of Cursor's icons" (minoradventures.co), read for its rules and numbers only
(Cursor's paths are proprietary). Each rule says what Area does today and what would change.
Sheets: `15-overlap-rule.png` (rule 1; `12-closed-shapes.png` was the first pass), `13-dot-roles.png` (rule 3), `16-parts-overview.png` (rule 4).

## 1. Technical, closed shapes (refined after the owner's Cursor screenshots; sheet 15)

Cursor's whole set draws the line: **a gap is information, never style.**

- **Keep the overlap cut where it separates layers.** A stack's back copy is an open L that stops
  short of the front (Cursor's copy and folders); likewise a figure or coin behind another, and the
  sun behind a cloud. Area's overlap cut already does this; the Phosphor joins do not.
- **Keep it where a badge or mark sits on a host.** The host is cut open round the notification
  dot, the corner +, ✓, − and ×, the clock and the check.
- **Close everything else.**
  - Shapes on one plane cross whole: shapes, the booleans' outlines, atom.
  - The slash crosses the shape flat, with the shape whole beneath ("no shadow effects"). Today
    Area cuts the shape one-sided round the slash.
  - No stroke is broken for style: alarm's bells close, and strikethrough's S becomes one stroke.
- **Filled variants still part a slash from its solid with a gap,** since a slash drawn on a solid
  would vanish.

Changes: the five multiples go back to the open L (keeping Phosphor's same-shape geometry and
offset 3), every slashed icon (12), shapes, alarm and strikethrough.

## 2. Gaps and cuts

Cursor keeps cuts from going below a safe minimum so shapes don't blur together at small sizes.
Area's gap scale already does this (detail 0.875–1.125, tight to 1.75, standard 1.75–2, open from
2.5, with near misses failing the lint). One addition:

- **Optical breaks.** Cursor notches junctions where three or more strokes converge, like a
  typeface's ink traps, so the joint doesn't clog. Area has no such rule. Candidates are
  asterisk's centre, git-merge's node and the network's hub. Worth a look, not a change yet.

## 3. Dots by role

Cursor sizes a dot by its role, in five sizes at 24px (1.0×, 1.17×, 1.33×, 1.67× and 2.67× the
line). At Area's 16px the first three collapse into one (1.1–1.5px), leaving the three sizes Area
already uses:

| Role | Cursor | Area | Today |
|---|---|---|---|
| detail: a dot inside a drawing, punctuation (i, !, ?), dots grouped in a container | 1.5–2.0 at 24 | ⌀1.5 | info, warning, help, keys, windows, lights, eyes, nucleus, chat-more, app-window ✓ |
| mark: a dot that is the icon or its subject (more, grip, a source), list bullets, a centre point | 2.5 at 24 | ⌀2 | more, grip, wifi ✓; **list-bullet ⌀1.5, crosshair ⌀1.5, square-dot and circle-dot-dashed ⌀3** ✗ |
| badge: the notification dot on a host | 4.0 at 24 | ⌀3 | bell-dot, mail-dot, chat-dot, compass-dot, square-badge ✓ |

Done (owner, 2026-10-02): list-bullet, crosshair, square-dot and circle-dot-dashed → ⌀2.

## 4. One drawing per part, one icon per concept

- **Parts overview.** Cursor audits 155 recurring elements (folders, files, flasks, flags, eyes,
  arrows, notches, badges) in lookup tables, so that the same folder is identical in all ten icons
  that hold it. Area has the family rule but no audit. Built: `sheets.mjs parts` renders every family
  (`<base>-<modifier>` names) with the base drawn in red under each member (sheet 16). A drift report
  goes with it: `node apps/docs/scripts/gen-pilot-icons.mjs --check --parts` (about a minute) lists
  each member's share of its base's ink it no longer covers, at the best shift within 3px; over
  20% is flagged. It is a triage list, not a gate: deliberate variants (person's small figure,
  play inside a ring, call-end's turned handset) score high too. First run: smile-plus (52%) is
  the one to check.
- **Concepts map.** Cursor pins each product concept to one icon. Area now has aliases
  (`data-alias-of`). Next would be a concept table, so new requests map to an existing icon first.

## 5. Already Area's (keep)

These Cursor rules Area already follows:

- optical keyline shapes (square, circle, horizontal, vertical);
- 0°, 45° and 90° lines, with other angles only where the concept needs them;
- the direction bottom-left to top-right, with slashes running against it;
- natural proportions (no toy look);
- details reduced to single lines;
- filled as solids with interior details knocked out;
- testing at 12px.

Cursor ships a filled cut only where the product needs one; Area derives one for every icon, which
is fine as long as each passes "more ink, never a negative".
