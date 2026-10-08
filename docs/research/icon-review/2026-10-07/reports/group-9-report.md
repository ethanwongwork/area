# Group 9 report (connectivity, places, security; 52 icons)

Method: every icon was rendered outline and filled at 16 / 24 / 32 / 48 and at 96 (look.mjs, chunks o1–o8 in
`groups/group-9/`), with `--slivers` at 16 and 48. Each icon was checked against its spec record (newest wins)
and the owner notes in all-notes.json (with dates, so a note could be tied to the drawing it was left on).
Originals are in `groups/group-9/orig/`. Final before/after: `groups/group-9/group-9-after-1.png`; proposal
candidates beside their references: `groups/group-9/group-9-proposals.png`.

## Changed (applied to sources)
| icon | what was wrong (outline / filled, size where seen) | what changed (geometry, values) | verified (lint, slivers 16/48, looked) |
|---|---|---|---|
| car | Open owner note from reviews2 (left on this drawing; c83df16 predates it): "car should be wider, the wheels should align with the lines of the car". Both styles, every size: the body was 10 wide inside 12-wide mirrors (aspect about 1.08 against Phosphor's 1.3). Each wheel was a separate box under an r 1 body corner, so the side line had a notch where it met the wheel | Phosphor's construction kept, made wider. The keyline goes from square to horizontal. Mirror line 1.5–14.5 at 6.5 (was 2–14). Body and wheels are now one outline: sides at 2.5 / 13.5 run straight down into the wheels, which are 3 wide (2.5–5.5, 10.5–13.5) and end at 12.5 with r 1 corners; the body's underside is at 11. The cabin is unchanged (1 : 2 pillars from 3.5 / 12.5 on the 6.5 line to a 2.5 roof, r 1). Its roof corners at 5.5 / 10.5 line up with the wheels' inner edges, and the pillar feet sit 1 in from the body sides. Lamps 4.5–5.5 and 10.5–11.5 at y 9 (2 in from the sides, as Phosphor's). Ink 14.12 × 11.12, centre 8, 7.5: 0.5 high, so every long horizontal is on x.5. Filled: body and wheels are one solid, lamps knock out, cabin stays open (unchanged rule). A first draft centred on 8 (lamps 2 below the mirror line) left fill slivers beside the mirror line at 16, so it was dropped | lint ok; slivers 16 / 48 none; looked at 16–96 beside Phosphor's car |
| vault | Open owner note from reviews2 (left on this drawing): "the stuff in the middle should be more centered" (both styles). The content's ink box was 4.94–12.31 (centre 8.63) in a body centred on 8: margins 2.38 left, 1.13 right. The body was 12 wide on whole-pixel sides (2 / 14), narrower than Fluent's vault (13) and than password's field | Body widened to Fluent's 13 × 9 (x 1.5–14.5, r 2): x.5 sides that render crisp, the same rect as password, and a 14.12 ink width that fills the horizontal keyline. Handle moved to x 4.5, Fluent's position (was 5.5); the dial (r 1.5 at 10, 8 with its 45° spokes) is unchanged. Content now spans 3.94–12.31 (centre 8.13). Gaps: handle to wall 1.88, handle to spokes 2.63 (open), spokes to the right, top and bottom walls 1.63 (all equal) | lint ok; slivers none; looked |
| route | Unrecorded 0.5 low (ink centre 8.5). The skill's three-row rule says stacks that can't centre on x.5 sit 0.5 high (text-align at 3.5 / 7.5 / 11.5) | The whole drawing moved up 1: rows 3.5 / 7.5 / 11.5, rings at 3.5, 11.5 and 12.5, 3.5. Ink centre 8, 7.5. Every edge stays on x.5 or whole, as before | lint ok; slivers none; looked |
| truck | 0.25 low (centre 8.25, recorded as "heavy base"), which contradicts the skill's centring rule: heavy-base shapes sit about 0.25 high. The box top, chassis line and base line were on whole pixels, so they blur at 1× | The whole drawing moved up 0.5. Box top 2.5, chassis 7.5, base line and wheel centres 11.5: the three long horizontals are now x.5. Ink centre 8, 7.75. Shape, roles and the filled story are unchanged. The windshield is 1 : 2, so it doesn't use the 45° lattice and the move doesn't break it | lint ok; slivers 16 none; at 48 only the known, recorded "fill beside a line" at the cab window (spec 3720: "truck's cab … keep a thin edge"; it moved from y 5.4 to 4.9 with the drawing) |
| battery-charging | The bolt's box was 6.5–8, centre 7.25, so it sat 0.25 right of the body's centre (7). The level bars in battery-full are centred on 7 | Bolt moved 0.25 left: `M7.25 6.5L6.25 8H7.75L6.75 9.5`. It is point-symmetric about the body's centre 7, 8. Same shape and slope; the quarter values are only on free-angle ends and the cap ends of the 8 row | lint ok; slivers none; looked |

## Proposals (not applied; candidate files in the scratchpad)
| icon | proposal | why | candidate file |
|---|---|---|---|
| key | Phosphor's key: an r 4 bow at 10, 6 with a ⌀1.5 hole at 11, 5 (tight 1.27), and a wide blade. Its upper edge runs at 45° to 2.5, 11.5; its lower edge is a stepped bit (V13.5 H4.5 V12 H6 V10.5, then 45° back to the bow). Filled: one solid with the hole | Owner reviews2 verdict "replace → Phosphor" (no note), left on the current Lucide key and never applied. Not applied here: it is a redesign, and person-key embeds the key (cross-group; it would need re-deriving at 0.59). Lints clean; centre 8.25, 7.75 (move it −0.5, +0.5 to stay on the lattice if adopted) | `groups/group-9/key-phosphor.svg` |
| building | Fluent's stepped building: a main block 2.5–9.5 from 2.5 (r 1.5) with a lower annex 9.5–13.5 from 7.5, a 2 × 2 grid of ⌀1.5 windows, and home's arched door under the main block | Owner reviews2 verdict "replace → Fluent", left on the current single block and never applied. Rough candidate only: the window grid trips the lint's diagonal check (2.04) and the annex is too narrow for a window. Fluent's is taller and narrower, so it needs a proper drawing pass if chosen | `groups/group-9/building-fluent.svg` |
| plane | Fuselage lengthened 1 at each end (1.5–14.5, tail fin moved with it, x − y still whole), with the window dash moved with the nose (10.5–12). Wing and heights unchanged | The lint flags it 1.88 under the horizontal keyline, and the optical audit has it at −15%. The owner's earlier note asked for a bigger body | `groups/group-9/plane-long.svg` |
| bank | No candidate. The current drawing is already Fluent's building_bank (the D-pass redraw), yet the owner pressed "replace → Fluent" again in reviews2. The visible difference: Fluent's step and base are one stepped plinth block, while Area draws two separate lines (3–13 at 11.5 and 2–14 at 13.5) | Needs the owner to say what differs; possibly the joined plinth | — |

## Cross-group (needs the coordinator)
| part / base | icons affected | issue | proposed exact change |
|---|---|---|---|
| lock (base) | lock, unlock; the small locks in person-lock, shield-lock, file-lock and folder-lock are recorded as their own size | lock and unlock are 1.88 under the vertical keyline (ink 10.12 × 12.12) and read −10% | Grow lock as a unit, for example body 3–13 × 7.5–14 (r 1.5) with shackle r 3.5 (4.5 → 11.5 from 7.5, top 2), ink about 11.1 × 13.1. Only if the owner wants it (the lock is approved) |
| key (base) | key, person-key | the Phosphor replacement above changes person-key's embedded key | Re-derive person-key's key from the new key at 0.59 if the replacement is chosen |

## Owner notes in this group: status
| icon | note | status (holds / fixed now / proposal) |
|---|---|---|
| bank | r replace → Fluent; r2 replace → Fluent | holds for r (Fluent's bank). r2 repeat: proposal / question above |
| building | r2 replace → Fluent | proposal (candidate drawn) |
| car | r replace → Phosphor; r2 replace → Phosphor, "car should be wider, the wheels should align with the lines of the car" | fixed now (Phosphor kept, wider; sides run straight into the wheels; wheels' inner edges under the roof corners) |
| fingerprint | r replace → Phosphor; r2 "lines … on the same track" | not touched (owner is choosing among candidates; brief) |
| flash | r replace → Lucide | holds (Lucide's zap) |
| globe | r replace → Fluent, "each section is 1/3" | holds (parallels at 6 and 10, the lens meridian 4 wide) |
| home | r "filled can have a bottom line connecting it" | holds (filled keeps the base line under the door) |
| key | r replace → Lucide; r2 replace → Phosphor | r holds; r2 is a proposal (candidate drawn) |
| map | r "panels should be more even"; r2 "fill the left and right sides … middle unfilled" | holds (folds at 2 / 6 / 10 / 14; side panels fill, middle open) |
| plane | r "tail smaller and the body bigger"; r2 "add a window(s)?" | holds (4-tall fuselage, smaller tail, cockpit dash); further enlargement is a proposal |
| scan-face | r2 "face needs to be more centered" | holds (eyes 5.75 / 10.25 at 5.75, 10-06 round). I tried square-smile's wider mouth (5.5–10.5) so the eyes sit over the mouth's corners, but its ends leave a 2.04 near miss to the brackets' ends, so I reverted it; smile's 6–10 mouth stays |
| store | r "door shape consistent with house and hotel" | holds (home's arched door, 6.5–9.5, r 1.5) |
| truck | r replace → Phosphor | holds (Phosphor truck; lifted 0.5, see Changed) |
| vault | r replace → Fluent; r2 "the stuff in the middle should be more centered" | fixed now (Fluent's 13-wide body and handle at 4.5) |

## Checked, no change
wifi, wifi-off, signal, bluetooth, bluetooth-connected, bluetooth-off, battery, battery-low, battery-medium,
battery-full, plug, plug-off, power, flash, zap-off, home, building, store, bank, globe, map, location,
location-off, locate, navigation, compass, compass-dot, target, crosshair, goal, plane, rocket, anchor, lock,
unlock, key, password, fingerprint, scan-face, shield, shield-check, shield-plus, shield-x, shield-alert,
shield-lock, shield-user, shield-off

Notes from the one-by-one pass (all recorded or within tolerance, so left as they are):
- The battery family shares the body and terminal exactly (close gap 2, owner). Level bars at 4.5 / 7 / 9.5 are centred on the body.
- "Parts drift … moved 0, −0.25" on the battery and shield members is a measurement artefact. Their base paths are byte-identical to battery's and shield's.
- The bluetooth-off upper chevron and the wifi-off r 3.5 arc are detached pieces in filled. Both are recorded.
- location's pin is an r 4.75 arc with quarter extremes (1.75 top, 3.25 / 12.75 sides). The lint passes it; it is unchanged because location-off and other groups share it.
- building's bottom sits on whole-pixel 14 (ink centre 7.75). Its windows and door leave no room to move it.
- map's folds are on whole pixels (2 / 6 / 10 / 14), centred on 8 for the owner's even panels.
- globe's lens meridian meets the ring at 53°, so filled shows small notches at the poles (owner-recorded 10-06).
- compass-dot's dot follows the notification-dot rule (⌀3, overlap cut 1.125).
- goal's ring cuts measure 2.25 from the shaft and fletching.
- shield-alert's ! sits 0.16 higher than the other shield marks; its stem length is recorded.
- The truck's 48px cab edge is recorded.
- I looked at moving the plane up 0.5 for crisp horizontals and rejected it: it breaks the wing's and tail's 45° lattice.

## Rules or docs that should change
- The spec records truck as "centre 8.25: heavy base", but the skill's Centring rule says heavy-base shapes sit about 0.25 high. The truck now follows the skill (7.75). The spec row (3172) should be updated.
- vault's spec row (2236) calls Fluent's safe 12 × 9; Fluent's vault_16 is 13 × 9 on the centre-line (outer 1–15). The row should say 13 × 9, handle at 4.5.
- route's spec row (2155) should note that the rows sit 0.5 high (3.5 / 7.5 / 11.5), as the three-row stacks do.
- car's spec row (3171) should be replaced: horizontal keyline, body and wheels one outline (sides straight into the wheels), mirror 1.5–14.5 at 6.5, wheels 3 wide to 12.5 with r 1, lamps at 9.
- battery-charging's bolt record (3204) should read M7.25 6.5 L6.25 8 H7.75 L6.75 9.5 (centred on the body's 7).
- Lint gap: it does not check circle-arc extremes inside paths against the 0.5 grid (location's 1.75 / 3.25 / 12.75 pass), nor 45° lattice membership for `data-angles="free"` icons. The plane's 0.5 lift would have broken its lattice without a lint message.
- 26 reviews2 "replace" verdicts are still open set-wide (spec line 3668). In this group: building, bank (repeat), key, and car (now handled). The coordinator may want to list the rest.
