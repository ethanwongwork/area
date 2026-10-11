# Group 7 report (chat and mail, people, reactions: 65 icons)

I checked every icon one by one, outline and filled, at 16 / 24 / 32 / 48 and at 96 (look.mjs, sheets `o1`–`o7` in the
group's scratchpad folder `q7/`). Suspect joins were rendered again at 160–320 with a private zoom copy of look.mjs,
which has since been deleted. References used: Fluent mail_checkmark / mail_warning, person_search / person_edit /
person_star and gif; Lucide mail-check, mail-warning, user-search, user-pen, user-star, vote and tags.

Only nine sources changed since the 2026-10-07 pass: the eight batch-70 icons in this group (gif, vote, mail-check,
mail-warning, person-search, person-pen, person-star, tags) and person-remove's minus (owner, round 7, approved
10-09). The other 56 were re-checked against the last pass's record, and every claim in it still holds.

All 65 lint clean (`gen-pilot-icons --only`, 66 with thumbs-down's turn). No slivers or islands at 16 or 48 on any
changed icon. The coordinator's cross-group question (unfilleted convex points where two offset curves of a cut or
bite meet, raised by group 6 for file-user and folder-sync) is answered under Changed and in the triage.

## Changed (applied to sources)

| icon | what was wrong (outline / filled, size where seen) | what changed (geometry, values) | verified |
|---|---|---|---|
| mail-warning (batch 70) | Filled, visible at 48 and 96. The flap piece's edge beside the ! followed the exact offsets: a vertical at x 9.75, then an arc about the stem's round end (12, 5.75, r 2.25) that bulged toward the !, then a convex point at 9.951, 6.68 (123°, unfilleted) where it met the dot's arc (r 2.4375). This left a lump and a spike next to the stem. | The fill's edge runs straight down x 9.75 (the stem's offset) to the flap gap: `…L9.75 3.5L9.75 6.997L8.419 7.662…`. It replaces the arc, the point and the 0.04 dot-arc piece. Every point of the new edge stays at least 2.25 from the stem and 2.464 from the dot's centre, so the 1.125 clearance holds and widens below the stem. The outline is unchanged. | lint ok (gaps unchanged); geometry-audit clean; slivers 16/48 none; looked at 96 and 320 |
| mail-check (batch 70) | Filled. The upper flap piece ended in a 72° point where the bite round the check's short arm (r 2.25 about 9.5, 5.5) met the flap cut. This is the 2026-10-07 rule's case, which the coordinator asked about. | An r 0.75 fillet between the bite arc and the fill's flap line (`…A2.25 2.25 0 0 0 7.778 6.948A0.75 0.75 0 0 1 7.539 8.102L8.043 9.108L9.298 8.48…`), with the notch moved to the fillet's end inside the cut band. The fill's straight edge stays on the cut's centre-line offset, so the cut sets the edge at every size and no hairline opens. Ink tip about 125°, and the check stays 1.125 clear. The outline is unchanged. | lint ok; geometry-audit clean; slivers none; looked at 320 |
| mail-plus | Filled. This is the same construction mail-check and mail-warning copy, with a sharper point: 57°, where the bite round the +'s left arm (r 2.25 about 10, 5.5) meets the flap cut. The owner's r1 note on this icon's filled variant was "stroke should be rounded?". | The same fillet (`…A2.25 2.25 0 0 0 8.173 6.813A0.75 0.75 0 0 1 7.899 7.922L8.403 8.928L9.861 8.199…`). Only the filled variant changes. It is approved, so it goes back to review: the mail marks share the shape, so the note applies to all three. | lint ok; geometry-audit clean; slivers none; looked at 320 |
| person-search (batch 70) | Its ink sat 0.25 left of centre (13.62 × 13.12, centre 7.75, 8). The siblings are 14.12 wide and centred on 8, and the spec records no offset for it. Its own bite cut the body's top line short, at 6.87 (the siblings stop at 8.4). | The lens moves to 11.5, 10.5 (lattice kept: handle `M13 12L14.5 13.5`). The body's overlap cut is re-solved (r 4.25 about the lens, 2.25 from the ring): base to 8.49, top line to 7.28, and the filled body closed on the same arc. Result: ink 14.12 × 12.62, centre 8, 7.75, the same as person-check and person-remove (heavy base). Lens to head 1.31 tight (was 1.38), body to ring 1.125, detail gap 0.88. The candidate's 11.5, 11.5 gives a 2.08 near miss to the head, and 12, 11 leaves the live area. | lint ok; geometry-audit clean; slivers none; looked beside person-check and person-key |
| chat-add | Stale `data-angles="free"`: every line is axis-aligned and the tail is on the lattice, as chat's. The flag only switched off the lattice check. | Flag removed. There is no geometry change, so the owner need not review it again. | lint ok without it |

## Proposals (not applied)

| icon | proposal | why | candidate file |
|---|---|---|---|
| thumbs-up (and thumbs-down, its flipy turn) | Line end `M9.8 4.4L9.2 7` → `L9.09 7`, so the thumb's straight edge is tangent to the r 1.9 tip arc. The 2.2° kink goes, and geometry-audit is then clean. | The only kink in the group, at the tip's join. It cannot be seen at any size (a 0.11 move), and the icon is owner-approved. It is low value against a review round, so it is left to the coordinator. | `q7/cand-thumbs-up.svg`; sheet `quality/sheets/group-7-proposals.png` (before / candidate; lint, audit and slivers clean) |

## Cross-group (needs the coordinator)

| part / base | icons affected | issue | exact change |
|---|---|---|---|
| spec construction lines (shared file) | mail-check, mail-warning, mail-plus, person-search | The records no longer match the sources after this pass. | mail-check / mail-plus filled: "the flap piece's tip rounded r 0.75 against the cut (2026-10-07 rule)". mail-warning filled: "the body's edge beside the ! is the stem's straight offset x 9.75 down to the flap gap (no bulge round the stem's end)". person-search: "lens at 11.5, 10.5, handle 13, 12 → 14.5, 13.5; body cut r 4.25 about it, base to 8.49, top to 7.28; ink 14.12 × 12.62, centre 8, 7.75; head gap 1.31". |
| spec record error | vote | Batch 70 says the check "sits 0.25 left of centre … as calendar-check sits 0.25 right". The source `M6 8L7.5 9.5L10.5 6.5` spans 6–10.5, so it sits 0.25 **right** (centre 8.25), exactly as calendar-check does: tight 1.38 left, detail 0.88 right. This is the best lattice place (the half-step left move puts it 0.5 high). | Record correction only: "0.25 right of centre, as calendar-check". |
| notification dot halo against a flap cut | mail-dot (here); the same pattern in bell-dot and chat-dot has no cut, so they are fine | Filled: the generator-made halo round the ⌀3 dot meets mail's flap cut in a small point on the flap piece. It cannot be filleted in the source without replacing the halo with a hand-drawn bite. Approved; no change. | none now. If the coordinator wants it, give mail-dot a `fill` body with an explicit bite and fillet, like mail-plus. |
| ? and ! marks | file-question, file-warning (group 6) | These reuse chat-question's ? and chat-warning's !. Their owner notes (dot 2.25 below, longer hook and stem) hold in this group. | none; for group 6 to confirm |
| gear and figure parts | folder-cog, shield-cog, server-cog (gear); file-user (person-chat's figure) | These copy parts from this group. The parts are unchanged here. | none |

## Owner notes in this group: status

| icon | note (short) | status |
|---|---|---|
| chat-question | r1: dot gap too small, longer tail; r2: ? looks wrong | holds (hook to V7, dot 2.25 below; ink gaps 0.88 / 0.94) |
| chat-warning | r1: ! tail too short, gap too large | holds (stem 4.75–7, dot at 9.25, gap 0.94). The same ! is carried to mail-warning (stem 2.25, dot 2.25 below) |
| mail-plus | r1 filled: stroke should be rounded? | applied further now: the flap tip next to the + is rounded r 0.75, and mail-check matches |
| call, call-outgoing | r2: inner stroke not smooth | holds (inner bowl r 1.25 / 4 / 1.25, identical in all six handset icons; call-end is the rotated, scaled copy) |
| call-incoming | r2: arrow tail too long | holds (2.5 head on the 3.5 box; call-outgoing matches) |
| person | r1 / r2: smaller head-to-body gap | holds (gap 2 between centre-lines). Carried to all 13 person-* figures, including batch 70's search, pen and star (body 10–13.5) |
| person-add | r2: + lower, like Lucide | holds (+ at 12.5, 12.5) |
| person-remove | r2: is the − placement correct; round 7 redraw | holds (− at y 11.5, owner-approved 10-09; gap 1.45 tight to the shared bite) |
| person-x | r2: is the × placement correct | holds (12.5, 12.5) |
| person-settings | r2: consistent, intentional placement | holds, and batch 70 follows it: every mark sits lower right; the small marks (+ − ✓ × lock gear star) share one bite (r 4.67 about 12.5, 12.25); the large marks (key, lens, pen) take their own exact 2.25 cut. person-search is now centred like the rest |
| handshake | replace → Lucide | holds (Lucide at 2/3, approved round 7) |
| accessibility | replace → Phosphor | holds |
| smile, smile-plus, frown, square-smile | r2: face not centred | holds (features centre 7.9; smile-plus is smile × 0.75 exactly: eyes 3 apart, mouth chord 3, r 1.875) |
| meh | r1: Fluent's eye–mouth gap; r2: line mouth as the happy face | holds (line at y 10, the smile's lowest point) |
| frown | r1: eye–mouth gap too large | holds (mouth top at 9, 3 below the eyes) |
| tag | replace → Lucide | holds; tags is built on it (the multiples rule) |

## Machine findings triage

| finding | icon | triage |
|---|---|---|
| geometry-audit: 45° segments off the lattice (4) | call-end | recorded exception: call-end is call's handset turned 135° and scaled 0.825 (spec), so its pad-end chamfers can't sit on the lattice |
| geometry-audit: lattice (2) | person-pen | recorded exception: file-pen's slim pen moved whole; the pen-axis exception (x + y = 21.5 / 24.5) |
| geometry-audit: subgap 0.37 (12) | person-settings | false positive: the six gear teeth are separate subpaths that all join the ring, so the 0.37 is measured at their roots on the ring |
| geometry-audit: kink 2.2° | thumbs-up | real, invisible; proposal above |
| slivers 16 / 48: fill beside a line | person-settings | known false positive (recorded 2026-10-03 and by the 2026-10-07 group 7): the checker reads the filled gear disc against its own ticks; clean at 96 |
| slivers 48: hairline space (2) | smile-plus | not a defect (2026-10-07 triage): the ⌀6 badge's 0.5 margin to the canvas edge (Fluent emoji_add, owner-chosen) |
| escapes | none | – |
| optical: voicemail −28%, call-end −21%, send −16% | – | shape class: thin horizontal line glyphs, and a triangle by hull. All approved; send's size was noted in the last pass |
| optical: heart −10%, person −9% | – | heart is the owner's Fluent heart, true semicircles; person is a vertical figure, the family base. No change |
| optical: call-off +14%, flag-off +11%, chat-off +10% | – | the slash reaches the keyline corners (every -off icon) |
| optical: gif +9% size, density +19% | gif | delegated call ("condensed letters … as dense as Fluent's"); Fluent's gif is denser still |
| parts: call-end 55%, smile-plus 53%, phone-missed 47% ("from phone"), person-chat 42%, chat-multiple 33%, person-circle 27%, person-square 21%, chat-dot 22% | – | by construction: rotated and scaled (call-end), scaled exactly (smile-plus × 0.75), wrong base (phone-missed is built on call's handset, not phone), framed figures, multiples layering, the notification dot's cut |
| parts: mail-warning 16%, mail-check 11%, person-search 8%, person-star 5%, person-pen 5% | batch 70 | the modifier (cut round the mark); bases copied exactly |
| report.txt | group | no near misses or keyline warnings |

## Checked, no change

- Chat: chat, chat-dot, chat-more, chat-question, chat-warning, chat-code, chat-off, chat-multiple ok. The content (lines, +, dots, ?, !, chevrons) centres on the bubble's interior centre 8, 7. chat-dot and mail-dot place the ⌀3 dot 1 in from the side and top.
- Mail: mail, mail-dot (see Cross-group), mail-open ok.
- gif (batch 70): ok. Frame 13 × 10 (the horizontal keyline's most, as id-card). The letters span 4–12.5, so the group sits 0.25 right; I left it, because the F's open right side reads optically lighter. A symmetric fit costs a 1.5 F arm or off-grid stems.
- vote (batch 70): ok (Lucide's card on a slot line). Only its record is wrong (Cross-group).
- send, voicemail, megaphone, broadcast, rss ok.
- Call: call, call-incoming, call-outgoing, call-end, call-off, phone-missed ok. One handset path in all six.
- Person: person, person-add, person-remove, person-check, person-x, person-key, person-lock, person-settings ok.
- person-pen (batch 70): ok. The pen is file-pen's slim pen exactly, moved (6.5, 0.5). The body ends on its exact cut (1.12), and the filled body is closed by its chord, like person-key (top corner 62°, person-key's is 66°). No meeting offset curves.
- person-star (batch 70): ok. The star is star.svg × 0.36 at 12.25, 12.25 inside the shared bite; filled solid with halo, like the gear and lock. It is small at 16, as delegated.
- person-circle, person-square, person-chat, people, id-card, handshake, accessibility ok.
- Faces: smile, smile-plus, meh, frown, square-smile ok. smile's mouth is 4 wide under the eyes (the owner's 10-06 rule); frown, meh and square-smile are 5 wide, each owner-reviewed.
- thumbs-up: ok apart from the proposal.
- heart, heart-off, star, star-half, star-off, bookmark, bookmark-add, bookmark-remove, bookmark-off, flag, flag-off, tag ok. bookmark-remove's − sits at the +'s centre, y 7.
- tags (batch 70): ok. The back copy stops 1.17 (tight) from the front, which is the multiples rule; its shortened front tag is delegated.
