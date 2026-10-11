# Group 8 report (AI & agents, Media, Devices)

Scope: 73 icons. I rendered every icon in outline and filled at 16 / 24 / 32 / 48 and 96 with look.mjs (8 sheets), then
at 200–240 px for the close calls (brain-off, sparkle-off, fast-forward). I checked each icon against the skill, its
construction line in the spec, its family base, every owner note in `owner-feedback.json` and `notes.json` (rounds
`reviews` to `reviews7`), and the machine findings. The bot cast's shared parts were checked numerically: the head (2–14 ×
6–13.5, r 2.5; every hat's head arc starts on that circle), the brim (`Q8 8` from 1.5 to 14.5), each hat foot's curve
against the brim (agent, builder, scholar and automator's feet are exact sub-curves of the brim), and the face (eyes
9–10.5 at x 5 / 11, ⌀1.5 mouth at 8, 11.25; the base bot's 8.5–10 / 10.75 is recorded). All of them agree.

Two sources changed. Both lint clean, show no slivers at 16 or 48 and pass the geometry audit, and their filled output is
byte-identical in drawing (only the order of two same-colour strokes changed). Before/after sheet:
`sheets/group-8-after.png`. Proposals sheet: `sheets/group-8-proposals.png`.

## Changed (applied to sources)

| icon | what was wrong (outline / filled, size where seen) | what changed (geometry, values) | verified |
|---|---|---|---|
| mic-off | Outline, every size, clearest at 1×: the cradle arc (from 3.5, 7.5 to the slash) and the stem were each drawn twice. They appeared once in the outline-only `line` path and again in the always-drawn filled piece. This is the defect fixed in flag-off's pole on 2026-10-07: overlapping antialiased edges darken (the stem sits on whole-pixel x 8, so both its columns go from about 56% to 81% ink at 1×). | The `line` path is now the cradle only (`M3.5 7.5A4.5 4.5 0 0 0 12.5 7.5`). The stem `M8 12L8 14` is one unmarked path, drawn in both styles. The cut cradle piece `M3.5 7.5A4.5 4.5 0 0 0 10.922 10.922` is now `data-filled="stroke"` (filled-only ink at the outline weight, as in alarm-off). Each part is drawn exactly once per style. The geometry is unchanged. | `--only` lint ok. Gaps are now listed separately (stem to capsule 1.38 tight, 1.7 tight), since the stem is its own element. Geometry audit clean. Slivers none / none. Emitted filled JSX diff: same paths. Looked at 16–96. |
| screen-share-off | Outline: the stand (`M8 11V13.5M5.5 13.5H10.5`) was drawn twice, by an outline-only `line` copy and by the unmarked copy that both styles draw. Its stem is on whole-pixel x 8. | The `line` copy is removed. The unmarked stand stays and is drawn once in each style. | Lint ok, geometry audit clean, slivers none / none. Filled output is identical (emitted JSX diff: only the duplicate removed from the outline). Looked. |

## Proposals (not applied)

| icon | proposal | why | candidate file |
|---|---|---|---|
| fast-forward (rewind follows by flipx) | Move the second triangle 0.5 right, so it is the first triangle moved by 6 (`M10.207 4.207L13.47 7.47A0.75 0.75 0 0 1 13.47 8.53L10.207 11.793A1 1 0 0 1 8.5 11.086L8.5 4.914A1 1 0 0 1 10.207 4.207Z`). The ink becomes 12.31 × 9.3 at 8.1, 8 (now 11.81 × 9.3 at 7.85, 8). | The spec says "45° sides on the lattice", but the second triangle's sides are on x − y = 5.5 and x + y = 21.5, half a unit off (geometry audit), so they blur at 1×. Its back sits at x 8, which is the only reason the lattice is lost. The move also centres the pair better and helps the −15% optical size. The cost is the join: the first tip now only kisses the second back (0.31 ink overlap at 16, about 0.09 drawing units at the 24 master) instead of running into it. That changes a look the owner approved, so it is a proposal. Lint ok and no slivers when applied (tested, then reverted). | `<scratchpad>/q8/cand-fast-forward.svg` |
| webcam (batch 70) | The foot is desktop's exactly, 5.5–10.5 (now 5–11). | The construction line calls it "desktop's foot line at 13.5, 6 wide (5–11)", but desktop's foot is 5 wide (5.5–10.5). Devices share parts (tablet and speaker reuse phone, tv reuses desktop). The 6-wide foot is closer to Lucide's 6.67, so this is a judgement call on a new icon: either the foot or the record should change. Lint ok when applied (same gaps 1.87 / 1.88). | `<scratchpad>/q8/cand-webcam.svg` |

## Cross-group (needs the coordinator)

| part / base | icons affected | issue | exact change |
|---|---|---|---|
| Strokes drawn twice in the outline (an outline-only `line` or a `knockout` plus an always-drawn copy of the same part) | Pure duplicates found by `<scratchpad>/q8/dups.mjs <dir> [names]` over `before-src`: bug-off (legs: the `line` path and the ink path share the arc to 13, 4, the 13, 4–2.5 leg and 2.5–5 at 8.5), flask-off (the lip 5.5–10.5 at 2.5, in two `line`s and the ink), globe-off (the meridian arcs and both parallels as `line` and again as `knockout`; knockouts are drawn in the outline too), umbrella (the ribs as `line` and as `knockout`), highlighter (`line` and `solid` share 4.5–11.5 at 5.5) | The same defect as mic-off, screen-share-off and flag-off's pole: the doubled antialiased edges darken. It is most visible at 1× on whole-pixel, diagonal and curved strokes. | Keep one drawn copy per style. A part that must differ between styles becomes an outline-only `line` plus a filled-only `stroke` (mic-off), or loses its duplicate (screen-share-off). Check each against its emitted filled JSX before and after. |
| Shared edges between two closed shapes (structural) | brain, brain-circuit and brain-off (the midline at x 8 belongs to both hemispheres), video and video-off (lens edge 10.5), headphones and headset (band along the cups' outer sides), plus home, building, book, panel-*, trash, car, flag, flask, gift and others in the same scan | Each shape must close to fill, so the shared edge is drawn twice. On x.5 edges the effect is negligible (only a 0.06 px fringe doubles). On brain's whole-pixel midline it is visible at 1×: it reads darker than the other lines. | A system fix, not per icon: the generator could emit the outline's shared edges once (a merged outline path), or the sources could split into `line` + `fill`. No source change proposed here. |
| `data-dot="free"` with no dot | play-circle, desktop-play (this group) | A stale attribute: the generator applies it only to circles of r ≤ 1.25, and neither icon has one, so nothing renders differently. | Remove it at the next edit of either icon. It is not worth a review round on its own. |

## Owner notes in this group: status

| icon | note (short) | status |
|---|---|---|
| agent | "not sure if this icon is needed" | Holds: alias of bot-agent (`data-alias-of`). The question stays with the owner. |
| bot-agent | "stroke in height should go all the way across" | Holds. The band line and its filled gap run side to side. Approved in reviews2. |
| bot-scholar | r1 / r2 filled fixes | Holds. The board is solid with `data-halo` and the skirt is solid with a V gap, as Fluent's graduation cap. |
| bot-guard | wider bill; brim and hat strokes sticking out; "maybe just fill the top" | Holds. The brim and visor end at the crown's corners (3.5 / 12.5). Filled, the cap top and visor fill and the band stays open. |
| bot-designer | rounding errors (r1); r2 | Holds. Approved in reviews7 after the 10-08 revert to the pre-10-07 drawing. The cap's button still sits 1.0 between centre-lines above the crown, so it touches at 16 and parts with a hairline from 24 up. The 10-07 neck that fixed this was reverted at the owner's verdict, so I left it alone. |
| bot-generator | "rounded stroke arrow"; "more like a wizard's hat, bigger" | Holds (full cone with a bent tip). Approved in reviews7. |
| bot-automator | r1 / r2 filled | Holds. The puffs fill and the band is a plain line. |
| brain-off | r2 filled stroke / negative space | Holds (rounds 13–19). Approved in reviews7. |
| music, mic, watch, mouse, tv | replace → Phosphor / Lucide | Holds. Redrawn and approved in reviews2. |
| camera (+ camera-off) | replace → Fluent, then Lucide | Holds. Lucide's camera, approved in reviews7. |
| clapperboard | replace → Fluent / Lucide | Holds. Fluent movies_and_tv, approved in reviews7. |
| captions | "text is not centered" | Holds. The Cs are centred at 6.5 and 10.5, ink centre 8, 8. Approved in reviews7. |
| image-plus | "rounded or sharp stroke edge in the filled mountain?" | Holds. One round-ended cut, sawn where it exits. Approved in reviews2. |
| gallery | replace → Lucide; "main shape larger, gaps smaller" | Holds. The card is 7 × 11 with tight 1.38 gaps. Approved in reviews7. |
| screen-share | "arrow seems too short" | Holds. The shaft is 4 with a 1.5 head. Approved in reviews2. The off variant was changed today for an unrelated duplicate stroke. |
| printer | "match fluent and phosphor for negative space" | Holds. The sheet is a line with its inside cut, with r 1 corners. Approved in reviews7. |
| chip | "the circle should be a square" | Holds (3 × 3, r 0.5 die). |
| usb | USB symbol or 2 notches | Holds (two solid 1 × 1 notches). |
| gamepad | replace → Lucide; "handles need to be bigger" | Holds. Approved in reviews7. |
| vr-goggles | smaller, closer notch, shorter mask; "line closer to the top" | Holds. The lens line is at 8.127, approved in reviews7. |

No note in this group needs carrying to a sibling. The bot family's notes (band across, brim ends, hat fills) are already
consistent across the cast.

## Machine findings triage

| finding | icons | triage |
|---|---|---|
| geometry: kink 5.6° at 3.89 / 12.11, 4.5 (`gap`) | agent, bot-agent | Intentional. The filled-only band gap runs straight out through the silhouette (a cut's ends must be straight segments) and joins the curved band there. Only the filled cut sees it. |
| geometry: lattice x − y = −1.75 / x + y = 17.75 | agent, bot-agent (the sunglasses' nose notch) | Accepted, not changed. A 0.5-long 45° piece between r 0.5 fillets on an unstroked solid, about one pixel at 16. Moving it 0.25 would reopen two approved icons for no visible gain. |
| geometry: lattice x − y = −2.25 / x + y = 18.25 | bot-researcher (the goggles' nose notch) | The same as above. |
| geometry: subgap 2.23 / 2.48 between subpaths | brain, brain-off (`line`, `inset`) | False positive. These are distances between the end caps of separate fold strokes across a lobe, not a channel or a pocket. The folds were settled over rounds 13–19 and approved. |
| geometry: subgap 0.29 | chip | False positive. The two pins at each corner both join the body, and the r 1 corner closes the wedge between them. |
| geometry: subgap 0.37 / 0.38 | monitor-cog (knockout teeth) | Recorded. The inner ends of person-settings' gear teeth sit on the ring, as in file-cog, folder-cog and person-settings (batch 70 notes). |
| geometry: lattice x − y = 5.5 / x + y = 21.5 | fast-forward | Real. **Proposal** above. |
| slivers 16 / 48: fill beside a line at 5.4–5.5, 6.6 | brain-off | Known. This is the fill wedge between the left fold's exit and the slash, part of the filled drawing the owner approved in reviews7 after rounds 15–19. Not changed. Worth a look only if the owner reopens brain-off. |
| optical: small | volume-low −24% (recorded, lines up with volume), volume-off −17%, mic −16% (Phosphor's capsule, approved), fast-forward −15% (recorded; the proposal makes it +4% wider), play −14% (recorded, the −12% triangle class), watch −14% (Phosphor's narrow watch, approved), vr-goggles −12% (owner asked for a shorter mask), sparkle −11% (four-point class: diagonal hull) | No change. Each is a recorded or owner-driven proportion. |
| optical: dense | film +26%, bot-agent / agent +36%, bot-researcher +32%, brain-circuit / circuit-board +30%, memory +29%, brain-off +26% | No change. Solids and fine detail by design. The bots are dense next to the set but even within the cast (+6% to +36%; the sunglasses wearers are the densest). |
| parts drift | play-circle 45%, pause-circle 41%, volume-low 27%, chat-sparkle 24%, stop-circle 20%; the bots 4–16% (eyes 0.5 lower, recorded) | By design: contained marks are smaller than their standalone glyphs, variants drop content, and the hatted bots' face is lower. |
| lint report: under keyline | play 1.66 (recorded), volume-low 2.33 (recorded), headphones 1.88 | headphones' apparent size is the set median (+1%), so it does not read small. No change. |
| escapes | none | – |

## Checked, no change

- **AI:** sparkle, sparkle-off, chat-sparkle (the halo was kept by the owner on 2026-10-09; approved in reviews7), grid-sparkle (the same 5-wide sparkle as chat-sparkle), brain, brain-circuit.
- **Bot cast:** agent (alias), bot, bot-agent, bot-builder, bot-researcher, bot-scholar, bot-guard, bot-lead, bot-designer, bot-generator, bot-automator.
- **Playback:** play, pause, stop, play-circle, pause-circle, stop-circle, skip-forward, fast-forward (proposal only), playlist, music, waveform (0.5 right, recorded).
- **Audio:** mic, volume, volume-low, volume-off.
- **Video and camera:** video (centre 7.75, recorded), video-off, camera, camera-off (the 0.29 lens counter is recorded as `data-counter="sliver"`), webcam (proposal only), film, clapperboard, captions.
- **Images and screens:** image (the ⌀2 sun on 5.5 is still open from 10-07), image-plus, image-off, images, gallery, screen-share, cast, radio, disc.
- **Computers and phones:** desktop, desktop-check, monitor-cog, desktop-play, laptop, tablet, phone, watch, tv, devices.
- **Peripherals and hardware:** mouse, printer, headphones, headset, speaker, chip (0.5 off-centre, delegated), circuit-board, usb, gamepad, vr-goggles, memory.

All are OK.

Batch 70's only member here, webcam, reads as a webcam at 16 beside Lucide's and Phosphor's. Its filled lens is a knockout
ring over a solid centre, as camera's is. Its neck is short (1.5), as Phosphor's is. The only open item is the foot width
(proposal above).
