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

## Round 8: batch 69, new icons

The 43 candidates had no Build / Later / Skip picks yet, so they were drawn on the recommendations (owner's
standing "keep drawing" rule): 42 icons in batch 69 (`batch-69.json`, spec "Batch 69 · New icons"); square-terminal
was not drawn because Area's terminal is already a framed window (alias candidate, left on the "New icons" tab).
Four parallel drawers, one per candidate group, then integration (categories, full lint 704 icons, typecheck,
docs build). Sheets: `18a-batch-69-sizes.png`, `18b-batch-69-sizes.png` (Area alone, outline and filled at
16 / 24 / 32 / 48).

The review page now opens on "New icons (batch 69)" in the same `reviews7` collection; "To review" holds the
42 new icons and round 7's 78 undecided ones. Data: `review-data.mjs out/data.js notes.json batch-69.json`.

Delegated calls to confirm:

- diff is a ± in square-plus's frame (Lucide's diff is plus-minus, which Area has); the alternative is an alias.
- git-branch-plus and git-pull-request-create keep the + at 12, 12 (filter-add's place), so their ink sits 0.25
  right/low; git-pull-request-create follows Lucide (the target ring becomes the +).
- git-graph's right lane joins the middle lane rather than stopping short.
- folder-git's filled node is a ⌀3 hole (a ⌀4.1 one left a sliver), slightly smaller than the outline ring.
- folder-tree's small folders drop the flap line.
- file-warning's ! stands at x 6.5, off the page centre, to clear the fold.
- pipeline follows Fluent and sits close to workflow; its filled version (two solid ends and a body) is the
  weakest read.
- cloud-sync follows Lucide (half-size sync in the cloud's foot); weakest at 16px.
- server-cog's gear at 12, 11; database-search's lens at 10.5, 10.5; brain-circuit's traces end in dots.
- monitor-cog holds the gear inside the screen (desktop-check's mark), not as a corner badge: a corner badge's
  bite removed half the filled screen.
- swatch-book's cards join (Lucide's construction) rather than cutting at the overlap.
- blend filled fills only the lens; table-of-contents indents its middle line; slice keeps Lucide's heel.

### Round 8 owner review (2026-10-08)

27 of batch 69 approved (batches.json). 15 fixed or redrawn on the owner's verdicts, plus file-diff, which takes
diff's ± (2 apart, centred) because it shares the shape: api and stamp on Phosphor, brain-circuit on Fluent, slice,
swatch-book and telescope on Lucide; fixes to cloud-sync, container, siren and timeline (filled), and to diff,
file-json, folder-input, git-graph and repository (the notes). Construction lines are in `batch-69.json`.
The page's "Redrawn on your notes" filter shows the 16 with before / after; the verdict each redraw answers no
longer counts (`staleAt`). Data: `review-data.mjs out/data.js notes.json batch-69.json fixes.json prev-data.js`.
Calls to confirm: repository's ribbon tips are sharp (`data-acute="sharp"`, as flag) and the filled ribbon is open;
api leaves out Phosphor's spark dashes; brain-circuit's nodes are dots, not Fluent's rings; telescope's ring joins
the tube (Lucide) instead of an overlap cut; swatch-book's long edge is 8° off tangent to stay on the lattice.
Open: whether bookmark's rounded tips should go sharp like repository's ribbon.

### Full review of all 137 (2026-10-08) and the cutout rule

114 approved (batches.json). Owner rule: filled icons are simple, negative cutouts and no halos (spec "Filled
is simple: negative cutouts, not halos"; new `inset` role in the generator). 32 icons redrawn and back on the
page ("Redrawn on your notes"): the five clouds and database-zap and notebook (cutouts); brain, brain-off,
brain-circuit (one mirrored fold pair); api, container, siren, slice, swatch-book, timeline (filled); basketball,
car, superscript, translate on the named libraries, with subscript paired to superscript; bot-designer, case-upper
and copy-check's check back to their pre-10-07 drawings; building's door r 1, carried to home and store; piggy-bank's
legs, person-remove's minus, telescope's ring, captions centred, vr-goggles' visor up; unpin on Lucide's pin-off.
Open: unpin's outline opens its base (breaks the flat-slash rule); case-upper's B (wider lower bowl) now differs
from spell-check's (taller lower bowl); timeline's open-ring node differs from the git icons' solid nodes;
bookmark's rounded tips vs repository's sharp ribbon.

### Review of the 32 redraws (2026-10-08)

19 approved. 14 redrawn and back on the page: cloud-upload's inset arrow raised and longer (apex 5, shaft 6.25),
cloud-download its exact mirror, cloud-sync's sync mark less crowded (hooks 1.25, 1.75 between the marks),
database-zap's bolt an inset wholly inside, api's joint a cut through the capsule; notebook's whole cover solid with
the band as a cut (owner: the open strip was the outlier); siren on Phosphor, piggy-bank on Fluent's savings; car's
wheels 2 tall; translate's あ on a real あ's strokes; unpin back to pushpin's drawing plus the slash; brain's earlier
folds restored with exits through the notch centre lines, brain-circuit and brain-off on the same brain.

### Round 11 (2026-10-08–09): notebook-style cutouts

6 approved. The clouds' arrows and bolt and database-zap's bolt now use notebook's treatment (outline geometry,
knockout over the body, ink beyond; spec "Revision, 2026-10-08 (later)"). cloud-sync is unchanged: its lower sync
mark sits below the cloud, and moving it to cross the edge left slivers (`r11t/cloud-sync-option-a.svg` in that
session's scratchpad); it needs a different sync mark (Lucide's cloud-sync) or keeps its inset. brain's filled folds
follow the outline strokes exactly; brain-off the same; unpin keeps its pin whole with the slash gap below the slash
(new `SLASH_GAP_BELOW` in the generator); translate's あ on Fluent's; api on Phosphor's plugs-connected with sparks.
Audit, not changed (owner to decide): chat-sparkle (halo), printer's paper, folder-zip's pull, truck's wheels,
telescope's ring, the clipboard clips, clipboard-paste's page, bandage's band, eyedropper's collar.

### Round 13 (2026-10-09): overlapping elements inset or haloed

Owner after the research: overlapping elements sit wholly on the body as a cutout (cloud-sync, the smaller
database bolt) or keep a halo (chat-sparkle). The four clouds and database-zap are insets with even fill (upload
and download mirrored, y 6–11; the bolt solved to 1.0 weight margins; database-zap's band gap ends round under the
lid's centre at the same margin). brain-off's side folds continue the outer lobes smoothly (carried to brain);
translate's あ shorter with a wider bar; unpin filled is the whole pushpin cut only by the slash gap (a sliver at 16
at the right flare's tip, left as asked). Open: cloud-sync's lower mark leaves 0.9 weight of fill.

### Rounds 14–15 (2026-10-09)

Round 14: brain's filled fold exits join the arc where it runs horizontal; cloud-lightning's bolt centred on the
cloud's mass; translate from the before, shorter vertical, bar centred; unpin's flare tip cut. Owner then approved
brain and cloud-lightning. Round 15 (from the research): cloud-sync's inset mark ≥ 1.1 weight of fill all round;
clipboard-paste's front page fills and the board is a line; eyedropper's glass tube open, only the bulb fills; unpin's
slash gap below the slash (`SLASH_GAP_BELOW`), pin whole above it. Waiting: brain-off ("random negative space cutout
above the left side fold"), translate (taller bottom stroke poking out more, longer bar), unpin (owner preferred the
round-13 version — whole pin cut only by the slash — before round 15 changed it again).

### Round 16 (2026-10-09)

clipboard-paste and eyedropper approved. unpin restored to the round-13 drawing (owner preferred it: whole pin cut
only by the slash gap; `SLASH_GAP_BELOW` stays in the generator, unused). brain-off's stray filled cut above the left
fold removed (solid up to the slash, as brain). translate: the third stroke starts 0.95 above the bowl, the loop and
bowl 5% taller, the bar 4.2 long centred on the vertical, the あ 0.25 right. Waiting: cloud-sync ("any way to give a
bit more room to the arrows?").

### Rounds 17–18 (2026-10-09)

unpin approved (round-13 drawing). cloud-sync's inset mark moved into the left lobe; arrows 1.75 apart (between the
1.625 and 1.875 tries); its cutouts measure the same width as cloud-upload's and the outline line at every size (the
heavier look is density and white-on-black irradiation). brain-off's last stray filled cut (the right fold's exit,
inside the slash gap) removed. translate's の loop 25% taller and 10% wider, the stem 1.0 above the bar and ending
inside the bowl; no lint exception needed (a tighter version made the diagonal touch the bar).

### Round 19 (2026-10-09)

brain-off approved. cloud-sync's filled mark is the outline's sync mark at 7/8 (the largest clean scale that keeps 1
weight of fill; full size leaves 0.69): gap and proportions now match the outline. translate's あ is traced from
Fluent's translate_16_regular (owner asked for an exact trace; Fluent is MIT; exception to "reference, never trace"
for this glyph only): centre-lines from the medial axis, moved (−0.5, −0.75) beside Area's a; `data-part="hiragana"`
and `data-counter="sliver"` allowances, no lint change. At 16 filled the bar touches the nub and the small triangle
pinholes (Fluent redraws its filled cut).

### Round 20 (2026-10-09–10)

cloud-sync's filled mark is the full outline sync mark (scale 1.0, gap 1.375 as the outline); minimum fill 0.69 weight
at two round-cap tips (owner asked for bigger; no sliver flag). Fallback at 15/16 scale (0.875 w) is in that session's
scratchpad. translate: the traced Fluent あ scaled 1.1 with a 1.25 gap to the a (the icon moved −0.5, +0.25 to centre;
ink 13.2 wide inside the lint's 13.25); filled-only strokes raise the bar 0.625 and ease the diagonal so the bar-to-nub
pocket (0.62) and the triangle (0.73) stay open at 16.

### Round 21 (2026-10-10): new cloud construction

translate approved. Owner asked for every cloud on a new reference (four lobes: small left end, big top left of centre,
higher right shoulder, right end; long flat foot; three cusps) — not Fluent's cloud, which is symmetric with three
lobes. Base: `M4.5 12A2.5 2.5 0 0 1 3.929 7.066A3 3 0 0 1 9.501 5.05A2.5 2.5 0 0 1 12.439 8.049A2 2 0 0 1 12 12Z`
(12 × 8.5, about 5% less area than the old cloud). All 11 cloud icons re-fitted (cloud-sun's cloud at 2/3); cloud-alert's
! 0.25 shorter; cloud-check's check moved to stay centred. cloud-sync filled back to the 0.875-scale arrows, margin
0.97 weight (the new cloud is shorter; 0.8125 gives 1.15). Sheet: `../2026-10-10/1-cloud-family-before-after.png`.
Not changed: tree's crown still uses the old cloud construction.

### Round 22 (2026-10-10): the cloud family on option D

Owner picked option D from `../2026-10-10/2-cloud-shape-options.png` (three humps, big middle hump left of centre, right
hump higher; 12 × 10, 116% of the old cloud's area). All 11 cloud icons re-fitted: foot 13 for cloud/-alert/-check/-off,
foot 12 for icons with parts below. Fill round the insets: upload/download/lightning 1.78 w, sync (0.875 arrows) 1.53 w;
cloud-alert's ! back to its full 2.25. Deviations: cloud-snow moved to the circle keyline (the ⌀1.5 dots don't fit
under a 10-tall cloud in the square one); cloud-rain's lines 1.5 / 2 / 1.5; cloud-sun's cloud is D at 0.625. The
explore candidates were removed. tree's crown still uses the old cloud. Sheet: `../2026-10-10/3-cloud-family-d.png`.

### Round 23 (2026-10-10)

8 of the D clouds approved (cloud, -alert, -lightning, -off, -rain, -snow, -sun, -sync). cloud-check's check and the
upload/download inset arrows moved 0.25 left onto D's area centroid (x 7.80), matching the bolt and sync marks; this
puts them off the strict 45° lattice (geometry-audit flags it; lint passes). The outline arrows stay at x 8 (a 7.75
stem is off the 0.5 grid).
