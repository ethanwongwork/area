# YouTube's player controls, measured (2026-10-19)

Owner, review round 55, Video player: "can you also look at and consider youtubes video player controls? maybe thats
more appropriate."

Source: youtube.com/watch (Big Buck Bunny, Blender Foundation), signed out, read-only, built-in browser, 2026-10-19.
Player 656 × 369 (default watch layout). Player classes include `ytp-delhi-modern`, `ytp-delhi-modern-compact-controls`,
`ytp-delhi-horizontal-volume-controls` and `ytp-disable-bottom-gradient`: the 2025 "Delhi" controls. Values are
computed styles and client rects relative to the player (`getBoundingClientRect`), not read off screenshots.

| Part | Measured |
|---|---|
| Scrim | none: the bottom gradient is disabled; every control stands on its own plate |
| Plates | black 30% (`rgba(0,0,0,0.3)`), no blur, no stroke, no shadow; pill corner (28 on a 40 plate) |
| Track | full width less 12 each side (632 at 656), 4 tall in a 6 hit row; rail `rgba(40,40,40,0.6)`, corner 3; buffered white 40%; played red (#cc0000), scrubber 12 round (#ff0033) |
| Row | 9 below the track; buttons 40 tall, 8 above the player's foot; sides 12 |
| Start | play / pause: a round 40 plate · volume: a 40 pill that opens sideways (slider handle 12, white) · time: a pill 40 tall, "0:00 / 10:34", 14 / 500, #eeeeee |
| Gaps | play → volume 12; volume → time 8 |
| End | one pill holding autoplay (a 30 × 18 switch), captions, settings, theater, full screen: 48 × 40 each, no plate of their own |
| Icons | 36 viewBox drawn in the 40 box |

What it changes for Area's player, against the current `floating` default (QuickTime's centred panel, rounds 40–47):
the controls run along the foot instead of a centred panel; the track spans the width above them; related buttons
share one pill, so the video shows between groups; there is no fade, the pills carry the contrast.
