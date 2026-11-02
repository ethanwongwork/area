# Person family: detail gaps and small counters removed (2026-11-01)

All 17 icons: `generate.mjs --only … --report` shows no detail gap and no counter under 1.5, and prints "icon lint ok (17 icons)". geometry-audit lists nothing. Sliver check: none, except person-settings filled at 12.4,12 ("fill beside a line"). That comes from the gear, which this pass didn't touch. Originals are in `orig/` next to this file.

## Mark family (person-add, -check, -remove, -x, -lock, -settings, -star, -key, -pen, -search)
Shared change: the head (r 3) moves up 0.5, from (6.5, 5) to (6.5, 4.5). The head-to-body gap was 2 between centre-lines and is now 2.5, the same as the standalone person: 0.88 detail → 1.38 tight. The body, the shared bite (12.5, 12.25, R 4.67) and every mark keep their places. The head now reaches the live-area edge (centre-line 1.5). Every ink box is now centred at y 8 or above (it was 8.25), and the head moves away from the marks, so no mark gap shrank.
- person-add: head–body 0.88 → 1.38. Plus–body 1.57 (unchanged).
- person-check: 0.88 → 1.38.
- person-remove: 0.88 → 1.38.
- person-x: 0.88 → 1.38.
- person-settings: 0.88 → 1.38.
- person-star: 0.88 → 1.38. Star counter 1.57 (unchanged).
- person-pen: 0.88 → 1.38. The pen's own cut was already 1.13 tight.
- person-lock: 0.88 → 1.38. The shackle legs are 0.5 longer (V10.5 → V10, top 9 → 8.5), so the shackle counter goes from 1.43 to 1.93. Shackle–body is now 1.48 tight (was 1.51).
- person-key: 0.88 → 1.38. The body's overlap cut round the key was exactly 1.125, which the report labelled "detail". It is recut at 2.26: line `M5.74 13.5 … L7.266 10`, now 1.13 tight. The fill path has the same endpoints.
- person-search: 0.88 → 1.38. The body's overlap cut round the lens was 1.12 detail. It is recut at 2.26 (bite A4.26, ends 8.476,13.5 and 7.27,10), now 1.13 tight.

## Framed figures
- person-circle: the head stays r 2 at (8, 6.5) and the body drops 0.5 (top 10.5 → 11). Its r 2 shoulders now meet the ring directly at (4.504, 12.876) and (11.496, 12.876); the short vertical sides are gone. Head–body 0.88 → 1.38; head–ring 1.38 (unchanged); body counter 2.43 → 1.93.
- person-dashed: the same body as person-circle. Head–body 0.88 → 1.38; body–dashes 0.98 → 1.2; head–dashes 1.44.
- shield-user: the whole figure moves down 0.5. The head goes from (8, 6.5) to (8, 7) at r 2, and the body top from 10.5 to 11.5, its r 2 shoulders clipped by the shield's lower curve (split exactly; script `shield.mjs` here). Head–shield 1.1 → 1.54; head–body 0.88 → 1.38; body counter 1.92.
- person-square: **the head shrinks to r 1.5** (8, 6.5); the body is unchanged. Head–frame 0.88 → 1.38; head–body 0.88 → 1.38; head counter 2.88 → 1.88. Moving the figure or the frame can't fix this one. Inside the 11 × 11 frame, height runs 2.5 (frame to head) + 4 (r 2 head) + 2.5 (head to body) + 3 (the least body height that leaves a 1.5 counter over the frame line) = 12 > 11. The frame can't grow either: the square keyline is 13.
- person-chat: **simplified to a solid figure**, id-card's construction (Fluent's contact card). The bubble's inside is 9 tall, and an outlined figure with floor gaps needs at least 11. The head is a solid ⌀3 at (8, 6) (`data-dot="free"`). The body is solid, `M5 11.5V10.5A1.5 1.5 0 0 1 6.5 9H9.5A1.5 1.5 0 0 1 11 10.5V11.5Z`, on the bubble's foot. Head–bubble 0.88 → 1.44; head–body 0.88 → 1.5; the body's 0.93 counter is gone. The filled variant now matches the outline: the bubble stays a line and the figure was already solid.

## Groups
- people: the back head's overlap cut round the front head was 1.12 detail. It is recut at 2.26 (`M8.852 2.62 … 10.159 6.977`), now 1.14 tight. Nothing else moves.
- people-group: the front head sat 0.9 from each back body, a detail gap: the back bodies were cut round the front body only. The front figure moves up 0.5 (head (8, 6.5) → (8, 6); body 11–14 → 10.5–13.5). Both back figures are recut round it at 2.26 (heads end 12.26,5.981 / 11.419,3.46; bodies start 11.136,9.037, end 13.154,12; mirrored on the left). Front head–back bodies 0.9 → 1.24 tight; cuts 1.13 tight. The ink centre moves from y 8.5 to 8.25.
