# Icon review, 2026-10-07

Owner: "first i want you to fix the clapperboard, make it look exactly like fluent. then … a very deep,
visual quality and consistency pass across al the icons again … both monoline and filled. take in all the
context, feedback, and fixes ive provided into account, and make sure the documentation and skills reflect
that."

Construction and decisions: `docs/specs/icons.md`, "Quality and consistency pass, 2026-10-07". The skill's
Owner preferences carry the new decisions and rules ("Quality pass, 2026-10-07", "Geometry rules learned").

## How it was done

- Ten group reviewers (the icon browser's categories), every icon one by one, outline and filled at 16 / 24 /
  32 / 48 and 96, against the skill, the spec, its family and every owner note from the review page
  (`reviews` to `reviews5`). Their reports: `reports/group-1-report.md` … `group-10-report.md`.
- Four redraw agents for the 16 round-2 "replace" verdicts still open in the spec, each on the library the
  owner named: `reports/redraw-A-report.md` … `redraw-D-report.md`.
- Integration: cross-group items, accepted proposals, the new geometry audit's findings (heart, captions,
  basketball), the full lint (662 icons), slivers at 16 and 48, escapes.

94 sources changed; all are back in review (heart, share, briefcase, scissors, captions and basketball had
been approved).

## Sheets

Each sheet shows every changed icon before (grey) and after, outline and filled at 16 / 24 / 32 / 48 and
both at 96 over the 16 grid; blue rows are the reference the owner named.

| Sheet | Shows |
|---|---|
| `01-clapperboard.png` | the clapperboard beside Fluent's movies_and_tv, regular and filled |
| `02-redraw-person.png` | the person family with the smaller head-to-body gap, beside Lucide's user |
| `03-redraw-key-handshake.png` | key (Phosphor) and handshake (Lucide) |
| `04-redraw-buildings.png` | bank and building (Fluent) |
| `05-redraw-objects.png` | piano, hammer, trash (Phosphor), chess-rook (Lucide) |
| `06-redraw-media-tools.png` | camera and camera-off (Lucide), lightbulb and lasso (Fluent) |
| `07-redraw-pin-palette-shapes.png` | pushpin and unpin, palette, shapes (Lucide) |
| `08-redraw-gamepad-bot-translate.png` | gamepad (Lucide), bot-generator, translate (Fluent) |
| `09-owner-notes.png`, `10-owner-notes-2.png` | the other open owner notes: car, vault, gallery, vr-goggles, quote, newspaper, party-popper, calculator, piggy-bank, the handset family, frown |
| `11-heart-clouds-arrows.png` | heart's tangent lobes, the cloud arrows on the lattice, import and share to the tray rule, backspace, sort-ascending |
| `12-marks-and-checks.png` … `17-objects-2.png` | the group reviewers' fixes |

## Review page, round 7

https://claude.ai/artifact/4sGs7JYAfNQexTPW9TQR9w (the same page as earlier rounds). "Review changes" shows the
94 changed icons first, with Before / After, the spec's description of each change and the owner's last
note; decisions save to the `reviews7` collection. "New icons" lists the 43 candidates in `candidates.json`
(Cursor, VS Code, Figma, Notion and ChatGPT uses; Lucide, Phosphor, Material Symbols and Fluent references)
with Build / Later / Skip and the library to follow; decisions save to `candidates1`. Data:
`review-data.mjs out/data.js notes.json`.

## Tools (new today)

- `look.mjs out.png name,… [ref.svg …] [--before] [--slivers]`: renders from the sources into a private
  cache (safe for parallel sessions), with reference rows and the sliver check. `--before` reads
  `apps/docs/.cache/before-2026-10-07.tsx` (`git show <base>:apps/docs/src/pilot-icons.tsx > …`).
- `geometry-audit.mjs [names]`: the lint's blind spots: near-tangent kinks, gaps between subpaths of one
  path, 45° segments off the lattice in `data-angles="free"` icons.
- `edge.mjs`: headless Edge helpers that stop Edge as soon as its output is written (orphaned headless
  runs held the profile and every later run hung).
- `scripts/`: clapperboard, the person family (`family.mjs 0 8 4.67`, `bite.mjs`), key and person-key,
  handshake, atom, party-popper's confetti search, the overlap-cut fillet.

## Open decisions

1. **Delegated today:** building's window grid (`data-gap="aligned"`, as calendar's), palette's wells ⌀2
   (Lucide's; ⌀1.5 candidate in the redraw-C report), shapes' 2.5 / 3 gaps (an equal-gap version is in the
   report), the key's ink centred at 7.75, 8.25 (a centred key with a smaller bow is in the redraw-A report).
2. **Proposals not applied** (spec "Still open"): waypoints wider, gap's brackets on x.5, link 0.5 up,
   diamond larger, plane longer, lock larger, bug-off without the corner legs.
3. **Still waiting from 2026-10-06:** the fingerprint pick (ten candidates), the person-family marks at the
   lower right, the size curve's hold at 24, the outline overlap cut above 24px.
