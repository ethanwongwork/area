# Group 7 report

Scope: 57 icons (communication, people, reactions), each outline and filled at 16 / 24 / 32 / 48 and at 96. Overview sheets: `groups/group-7/o1.png` to `o8.png`. Before/after sheets for the changed icons: `group-7-after-1.png` (call, call-incoming, call-outgoing, call-end) and `group-7-after-2.png` (call-off, phone-missed, chat-code, flag-off). Supporting sheets: `a-call1.png` (the new arrow beside Fluent's call_inbound), `group-7-handset-candidates.png` (inner-curve candidates at 256px). All 57 sources lint clean (`gen-pilot-icons --only`). Slivers and islands: none at 16 or 48 on every changed icon.

## Changed (applied to sources)

| icon | what was wrong (outline / filled, size where seen) | what changed (geometry, values) | verified (lint, slivers 16/48, looked) |
|---|---|---|---|
| call | Owner r2 note "visual error", both styles; the same defect as call-outgoing's note. The inner edge between earpiece and mouthpiece was made of a 45° neck, an r 0.5 corner turning 71.6°, a 1:2 straight, a 36.9° r 3 arc, a 2:1 straight and another r 0.5 corner. At 32–96 it read as a kinked polyline. | Same filleted polygon (`2,14 2,2 5.75,2 7.5,5.5 5.5,7.5 6.5,9.5 8.5,10.5 10.5,8.5 14,10.25 14,14`). The neck-to-curve corners go from r 0.5 to r 1.25 and the middle corner from r 3 to r 4, so the inner bowl is three tangent arcs (1.25 / 4 / 1.25) with no straight pieces: `…L7.245 5.755L6.137 6.863A1.25 1.25 0 0 0 5.903 8.306A4 4 0 0 0 7.694 10.097A1.25 1.25 0 0 0 9.137 9.863L10.245 8.755…`. Pad ends stay r 0.5: r 0.75 moved the arrows' gap to a 2.04 near miss. The ink box (13.12 × 13.12, centred) and the counter (3.93) are unchanged. | lint ok; slivers none at 16 and 48; looked before/after |
| call-outgoing | Owner r2: "the inside stroke between the top and bottom part of the phone is not smooth". | The handset as in call. The arrow head is 2.5 (`M10.5 5.5L14 2M11.5 2H14V4.5`) to pair with call-incoming. | lint ok (arrow gap 1.98 standard); slivers none; looked |
| call-incoming | Owner r2: "the arrow tail now looks too long, i want it to be more balanced". A 2px head sat on a 4.95 diagonal (ratio 2.47). Fluent's call_inbound is 1.89 and Phosphor's about 1.8. | The handset as in call. The head grows to 2.5 on the same 3.5 box (`M14 2L10.5 5.5M10.5 3V5.5H13`), ratio 1.98. That is the paired/contained head size, and the shaft stays on x + y = 16. Shortening the shaft instead (2 head on a 3 box, `cand/incomingB.svg`) made the arrow read small beside the handset. | lint ok; slivers none; looked beside Fluent (`a-call1.png`) |
| phone-missed | Shares call's handset. | Handset as in call; the × is unchanged (gap 1.75 standard). | lint ok; slivers none; looked |
| call-off | Shares call's handset (outline `line` and filled `fill`). | Both copies of the handset updated. Mirrored slash and gap unchanged. | lint ok; slivers none; looked |
| call-end | Recorded as "call's handset turned 135° and scaled 0.825", so it carried the same kinked inner curve. | Rebuilt from the same polygon rotated 135°, scaled 0.825 and moved (+17.583, +9), with the radii ×0.825. The inner bowl is now `…L10 8.577A1.031 1.031 0 0 0 9.294 7.598A3.3 3.3 0 0 0 7.206 7.598A1.031 1.031 0 0 0 6.5 8.577…`; everything else is unchanged and symmetric about x 8.25. Ink is still 13.08 × 7.32, centre 8.25, 8. | lint ok; slivers none; looked |
| chat-code | Family: "code's chevrons (file-code, chat-code, code-block)" are one drawing. code-block moved to 2-leg chevrons on 10-05 (like terminal), but chat-code kept 1.5 legs with a 3-wide gap between them (ratio 2 against code's 1). | code-block's exact chevrons moved up 1 to the bubble's centre: `M7 5L5 7L7 9M9 5L11 7L9 9`. Tight 1.38 to the bubble on all sides; filled, still knockouts. | lint ok; slivers none; looked beside code-block (`a-chatcode.png`) |
| flag-off | The pole was drawn twice in the outline: an outline-only `line` `M2.5 2.5V13.5` plus an unmarked `M2.5 2.5L2.5 13.5`. Two identical strokes double the anti-aliased edge pixels, so the pole reads darker at 1×. | Removed the redundant `data-filled="line"` pole. The unmarked pole draws in both styles, as in flag. No visible geometry change. | lint ok; slivers none; looked |

## Proposals (not applied; candidate files in the scratchpad)

| icon | proposal | why | candidate file |
|---|---|---|---|
| handshake | Replace the Phosphor drawing with Lucide's handshake (owner reviews2, 2026-10-05: verdict replace → Lucide; no record that it was done; the spec lists "replace verdicts (26)" from reviews2 as still open). The candidate is Lucide's construction scaled 0.6 about its centre onto Area's line. Before it can ship it needs simplifying: Lucide's finger loops are r 0.6 at 16px, under the counter scale, and they blob at 16. | Unapplied owner verdict, and it is a redesign. | `groups/group-7/cand/handshake-lucide.svg`; sheet `group-7-proposal-handshake.png` |
| person (and so person-add, -remove, -check, -x, -key, -lock, -settings, which are "the standalone person moved left") | Head-to-shoulder gap 2.5 → 2 between centre-lines (ink 1.38 → 0.88, the framed figures' detail step). The best variant sits 0.25 high, the heavy-base exception: head r 3 at 8, 5, body `M3 13.5A3.5 3.5 0 0 1 6.5 10H9.5A3.5 3.5 0 0 1 13 13.5Z` (ink 1.44–14.06). Alternative: head at 8, 5.5 with the body unchanged, which sits 0.25 low. | Owner reviews2: "gap between the head and shoulders is still too big, make it a bit smaller" (replace → Lucide). No later record handles it; person.svg is unchanged since 2026-10-04. The grid allows only 2.5 or 2. Not applied because it changes the base of eight icons, and the brief says the person family is polish-only. The cost is the body's top edge landing on a whole pixel (y 10). | `cand/person-gap2-high.svg`, `cand/person-gap2-low.svg`; sheet `group-7-proposal-person-frown.png` (beside Lucide user) |
| frown | Mouth `M5.5 10A3.625 3.625 0 0 1 10.5 10` (top at 9), replacing `M6 10.5A2.5 2.5 0 0 1 10 10.5`. | The 10-06 centring round raised the eyes 1 but the mouth only 0.5. The frown's top is now 3.5 below the eyes, against the smile's 3 and Fluent emoji_sad's 3.1. This undoes the owner's r1 note ("gap between eyes and mouth is too large"). The frown's features also centre at 8.16 while smile and meh are at 7.9. The candidate gives 3 below the eyes and centre 7.9, with corners 1.67 tight to the ring (as now) and 1.98 standard to the eyes. It is the width of meh's line and uses square-smile's r 3.625. Moving the current mouth up 0.5 instead leaves a 2.04 near miss at the corners. | `cand/frown-r3625.svg`; sheet `group-7-proposal-person-frown.png` (beside Fluent emoji_sad) |

## Cross-group (needs the coordinator)

| part / base | icons affected | issue | proposed exact change |
|---|---|---|---|
| code chevrons | file-code (not in group 7) | After this pass chat-code and code-block share the 2-leg chevron. file-code still has 1.5 legs with a 2 gap (`M7 9L5.5 10.5L7 12M9 9L10.5 10.5L9 12`). It may be space-limited under the fold: check whether `M7 8.5L5 10.5L7 12.5M9 8.5L11 10.5L9 12.5` fits the page on the gap scale, or record the smaller chevrons as intentional. | as stated, for file-code's reviewer |
| settings gear (small) | person-settings (here), file-cog | slivers.mjs reports "fill beside a line" at the gear's centre at 16 and 48 for both icons. This is the checker reading the filled gear disc with its ticks drawn over it, not a visible sliver: the gear at 96 filled is clean. A known hit, recorded on 2026-10-03. No change. | none; consider teaching slivers.mjs to ignore a `data-halo` solid's own ticks |

## Owner notes in this group: status

| icon | note | status (holds / fixed now / proposal) |
|---|---|---|
| accessibility | r replace → Phosphor | holds (Phosphor person-arms-spread; r2 approved) |
| call-incoming | r2: arrow tail too long, more balanced | fixed now (2.5 head on the 3.5 box, ratio 1.98) |
| call-outgoing | r2: inside stroke between top and bottom not smooth | fixed now (inner bowl as three tangent arcs, r 1.25 / 4 / 1.25) |
| call | r replace → Phosphor; r2 fix (visual error, no text) | Phosphor holds; r2 fixed now (the same inner curve; read as call-outgoing's note) |
| chat-question | r1: dot gap too small, longer tail; r2: ? looks wrong | holds (10-06: hook runs on to V7, 2.25 above the dot; bowl tangent-continuous into the tail) |
| chat-warning | r1: ! tail too short, gap too large | holds (stem 4.75–7, dot 2.25 below, gap 0.94; same stem as warning) |
| frown | r1: eye–mouth gap too large; r2: face not centred | r2 holds (10-06); r1 partly regressed by the 10-06 round: proposal |
| handshake | r replace → Phosphor; r2 replace → Lucide | proposal (Lucide not applied anywhere yet) |
| mail-plus | r1 (filled): stroke should be rounded? | holds (flap runs flush into the clearance round the +; r2 approved) |
| meh | r1: Fluent's eye–mouth gap; r2: line mouth placed as the happy face | holds (line at y 10, the smile's lowest point; eyes shared) |
| person-add | r2: the + lower, like Lucide | holds (10-06: marks at the lower right) |
| person-remove | r2: is the − placement correct | holds (lower-right shared bite) |
| person-settings | r2: more consistent placement | holds (lower-right shared bite) |
| person-x | r2: is the × placement correct | holds |
| person | r1: smaller gap, bigger head; r2: gap still too big, a bit smaller (Lucide) | r1 holds (head r 3, gap 2.5); r2: proposal |
| smile-plus | r2: face not centred | holds (features centre 6.41 in the r 4.5 face at 6.5). The 48px "hairline space" hits are the badge's 0.5 margin to the canvas edge (the ⌀6 badge reaches 15.5, owner-chosen Fluent emoji_add), not a defect in the drawing |
| smile | r2: face not centred | holds (features 5.25–10.56, centre 7.9) |
| square-smile | r2: face not centred | holds (10-06; features centre 7.78: eyes stay at 5.75 for a standard gap to the frame; 6 gives a 2.19 near miss) |
| tag | r replace → Lucide | holds (Lucide tag; r2 approved) |

## Checked, no change

chat, chat-add, chat-dot, chat-more, chat-question, chat-warning, chat-off, chat-multiple, mail, mail-plus, mail-dot, mail-open, send, voicemail, megaphone, broadcast, rss, person, person-add, person-remove, person-check, person-x, person-key, person-lock, person-settings, person-circle, person-square, person-chat, people, id-card, handshake, accessibility, smile, smile-plus, meh, frown, square-smile, thumbs-up, heart, heart-off, star, star-half, star-off, bookmark, bookmark-add, bookmark-remove, bookmark-off, flag, tag

Notes from the one-by-one pass (no action taken):
- send reads 16% small by hull (ink 11.57 × 11.92, 1.2 under the square keyline). It is a triangle (hull effect) and was approved twice. It could be scaled to reach 13 tall if the owner finds it small beside mail.
- person-chat's body pocket is 0.93, a thin counter. It fills solid and stays legible at 16. It is recorded as the one-step-smaller framed figure.
- megaphone's ink centre is 8.19: the handle hangs low, and no 0.5-grid shift improves it.
- star-half draws its left half solid in the outline too, so outline and filled are identical. This is recorded (10-05).
- chat-dot and mail-dot place the ⌀3 dot 1 in from the side and top, consistently.

## Rules or docs that should change

- Skill, Shared parts, "mark pass rules" (line ~352) still says "the ? dot 2.5 below a longer hook". The owner changed this to 2.25 on 2026-10-06 (skill line ~209 and spec "Owner round, 2026-10-06 (fourth)"). Update line 352.
- Skill, arrow classes: "corner 2 on the longest shaft that fits" produced call-incoming's over-long tail, which the owner flagged. Record that a mark-sized corner arrow beside an object (call-incoming, call-outgoing) uses the 2.5 head on its 3.5 box, giving a shaft-to-head ratio of about 2 (Fluent 1.9, Phosphor 1.8). Add these two icons to the spec.
- Skill, mark placement "inside a container" lists mail and image. But mail-plus and image-plus keep their owner-approved corner + with the host cut round it (2026-10-04 P2, 2026-10-05 audit, mail-plus r2 approved). Record them as exceptions to the rule.
- Spec: record the handset's inner curve (polygon above; radii 8.5, 3, 0.75, 0.5, 1.25, 4, 1.25, 0.5, 0.75, 3) under call / call-incoming / call-outgoing / phone-missed / call-off / call-end. Record chat-code's chevrons as code-block's moved up 1.
- The reviews2 replace verdicts remain open as a group (the spec says 26). In group 7, handshake → Lucide and person → Lucide (gap) are among them. The coordinator should decide whether replacements are applied this session.
