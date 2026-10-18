# Video player spec

**Status:** in review · 2026-10-17
**Research:** `docs/research/video-player-2026-10-17.md` (Plyr, Video.js v10, Vidstack, Media Chrome and Kibo pinned to
commits; YouTube, Vimeo and apple.com computed; Notion, Loom, Slack not measured)
**Peers:** Figure (holds it, with a caption), Button (ghost icon-only, here on media), Slider (the range), Tooltip, Spinner

## Owner decisions

- 2026-10-17, round 36: "should there be a real video component with its own design player controls?"; round 37: "eventually
  i want this to be an actual video right?"; then "work on the next work: whether to build a Video player next".
- Decided from the survey, open for review: the played part of the track is white, not the accent (monochrome, as
  Video.js, Vidstack and Media Chrome; suits ChatGPT and Notion); full screen uses Area's `maximize` / `minimize` arrows;
  the on-media buttons are the player's own (white ink, white plates), so Button is unchanged.

## Job and boundaries

Plays a video with controls drawn in Area's language. Not a Figure (which frames any media with a caption and can hold
this player), not an audio player, not a playlist.

## Anatomy

```
div.area-video-player (role=group, aria-label, tabindex 0; data-started, data-idle)
  video.area-video-player__media   (native; <track> children)
  button.area-video-player__start  (before the first play: 48 round, black 50%, play 20)
  div.area-video-player__scrim     (black 50% → clear, 64 tall)
  div.area-video-player__controls  (after the first play; 4 from the sides and foot, items 2 apart)
    button (play / pause) · input[range] seek · span.time (current / span.duration) ·
    div.volume (button mute + input[range] volume, revealed 56 on hover / focus) ·
    button captions (with tracks) · button picture in picture (where supported) · button full screen
```

## Decisions

| Part | Area | Basis |
|---|---|---|
| frame | Figure's media corner, black behind letterboxing | Figure; every source |
| row | 32: 24 buttons (`control-sm` at 13), 4 from the media, 2 apart | Vimeo 32, Plyr 32; Vimeo 24 buttons |
| icons | 16; play and pause solid | Vimeo 20 at 24; Area's 16 cut |
| ink | white in every state, a 0 1 2 30% black shadow | Video.js, Plyr |
| button plate | hover white 20%, pressed 30%, captions on 20% | Vidstack hover 20%; shared state paint (ink fixed) |
| scrim | black 50% to clear, 64 | Video.js 50%, Vidstack 60%; 2 × the row |
| track | 4, 6 on hover / drag / focus; rail white 20%, loaded 40%, played white | YouTube 4 → 6; Vimeo, Video.js, Media Chrome 4 and 20% |
| thumb | 12 white, Video.js's shadow, shown on hover / drag / focus | YouTube, Video.js 12 |
| time | small text, 500, tabular, `m:ss / m:ss` (`h:mm:ss` past an hour) | YouTube 500; Vidstack |
| volume | mute, and a 56 slider revealed on hover or focus | YouTube's reveal; Vidstack ≤ 72 |
| start | 48 round, black 50%, play 20; one step darker on hover | Plyr 48 |
| idle | hide after 2000 ms while playing; never while paused or with focus inside; cursor hides too | Plyr, Video.js, Vidstack, Media Chrome |
| motion | in on `fast`, out on `moderate`, opacity only; track growth on `fast`, none with reduced motion | Media Chrome in faster than out; MOTION.md |
| narrow | under 400: no volume slider, no picture in picture; under 280: no duration | Video.js media-max-lg, Vidstack's small layout |
| `controls` | `auto` (hide when idle) or `always` | Kibo's always-visible bar |

## Behavior and accessibility

Keys (on the player or a control): Space / K play, ← → 5 s, J / L 10 s, ↑ ↓ volume 5%, M mute, F full screen, C captions,
I picture in picture, 0–9 a tenth of the way, Home / End; a focused range keeps its own arrows. Click the video to play
or pause, double-click for full screen. The seek range reads "1 minute 12 seconds of 4 minutes 3 seconds"; volume reads
"60% volume". Buttons name their action (Play / Pause, Mute / Unmute, Full screen / Exit full screen, Captions with
`aria-pressed`). Controls are not rendered before the first play, so the round play is the only stop.

## Not built yet

Settings (speed, caption track) in a Menu; Area Tooltips on the buttons and the hover time over the scrubber; buffering
Spinner; ended / replay state; captures of Notion's video block and Loom.

## Review note, 2026-10-17 (round 39)

- **What it is:** A video player with Area's own controls: a round play button to start, then one row over the video
  with play, the progress bar, the time, sound, captions, picture in picture and full screen. The row fades away while
  the video plays and you're not moving, and comes back when you move or pause.
- **Based on:** What YouTube, Vimeo, Plyr, Video.js, Vidstack and Media Chrome agree on: 24 buttons in a 32 row, a 4px
  progress bar that grows to 6 under the pointer, white on a dark fade, hiding after 2 seconds.
