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
  the video plays and you're not moving, and comes back when you move or pause. The page shows each player at rest;
  play them in the app (Components → Video player).
- **Based on:** What YouTube, Vimeo, Plyr, Video.js, Vidstack and Media Chrome agree on: 24 buttons in a 32 row, a 4px
  progress bar that grows to 6 under the pointer, white on a dark fade, hiding after 2 seconds.

## Round 40, 2026-10-17

Owner, with screenshots of QuickTime Player's controller, Apple TV's and the macOS/iOS 26 pill: "use the same image from
avatar as the placeholder, i want the player ui to be based on the quicktime player preview, but in the style of area
components. look into legit video player components to see what variants are necessary, is a picture in picture
variant necessary?" Survey: `docs/research/video-player-quicktime-2026-10-17.md` (WebKit modern-media-controls @54a3335,
AVKit's ControlsStyle, Vidstack, Video.js, player.style, Mux).

- **Variants**, as AVKit's control styles: `floating` (default; AVKit: "matches the look of QuickTime Player's playback
  controls"; Safari's macOS full screen; Video.js's pill; visionOS), `bar` (the round-39 row; AVKit inline, Safari inline,
  Plyr, Vimeo) and `minimal` (one round play / pause; AVKit minimal, Video.js background, apple.com). `controls: auto |
  always` stays. Narrow sizes are container queries, not variants.
- **Picture in picture is not a variant**: the browser or OS draws the PiP window with its own controls and a page cannot
  put its controls in it (MDN); Document Picture-in-Picture (Chrome 116+, not Safari) moves the same player into a window,
  a placement, not a variant. It stays a button.
- **Floating**, Safari's 468 × 75 controller scaled by Area's rows (≈ 0.85): 64 tall (6 + 32 + 4 + 16 + 6), at most 400
  wide, 12 above the foot, centred, corner 12 (the floating Toolbar's: control corner 6 + inset 6); black 55% under
  blur(16px) saturate(180%) (Apple 55%, 180%, 17.5), a 1px white 10% top highlight in place of Apple's lighten tint; no
  scrim. Row one: mute and a 56 volume at the start; back 15 · play (32, icon 20, Apple's 2×) · forward 15 in the middle,
  16 apart; captions, picture in picture, full screen at the end. Row two: time · track · duration, 8 apart, time 12/500
  tabular in white 70% (Apple 55%, lifted for contrast). Under 400 it folds into one pill: play, track, duration, full
  screen.
- **Placeholder**: the avatar photo (David Tee) as the poster, and the clip is that photo with a slow zoom.
- Open: Apple's 4 × 17 bar knob in place of the round thumb; skips of 10 rather than 15; hiding after 4 s (Apple) rather
  than 2 s (Plyr, Video.js, Vidstack, Media Chrome); numbered skip icons (Area has none yet).

## Review note, 2026-10-17 (round 40)

- **What changed:** The controls are now QuickTime Player's floating controller in Area's style: a frosted panel over the
  video with sound on the left, back 15 · play · forward 15 in the middle, the rest on the right, and the time and
  progress bar under them. Two more layouts: the round-39 bar, and a minimal round play button. The examples use the
  avatar photo.
- **Why:** You asked for QuickTime's player in Area's style and for the variants real players need. Apple's own player
  offers exactly these three (floating, inline, minimal). Picture in picture isn't a variant: the browser draws its own
  window, so it stays a button.

In a Figure, give the Figure a width (`style={{ inlineSize: "100%" }}`): Figure is as wide as its media, and the player is
as wide as its container, so neither can size the other.

## Round 41, 2026-10-18

Owner, round 40: "refine the ui, what do other design systems and products do?"; then "go ahead and refine it". Visual pass
on the floating controller:
- The track had no marker at rest: QuickTime's knob and the iOS 26 pill's thumb always show where the video is → the
  floating thumb always shows (the bar keeps YouTube's hover-only thumb).
- The rail at white 20% read faint on the panel's black 55% → 30% inside the panel.
- Muted, the volume slider read as an empty line → it keeps the level, greyed (fill white 40%), and says "Muted, 60%
  volume"; unmuting returns to it, as macOS does.
- Demos write every prop out (the gallery's code view showed `{...clip}`).

## Review note, 2026-10-18 (round 41)

- **What changed:** The progress bar always shows its round marker, as QuickTime's does; the bar's empty part is a little
  brighter so it reads on the dark panel; and when muted, the volume slider keeps its level in grey instead of looking
  empty.
- **Why:** You asked to refine it. Next to QuickTime and Apple's newer players, the bar had no marker at rest, the track
  was faint on the dark glass, and the muted volume looked like a stray line.

## Round 42, 2026-10-18

Reference set: `docs/research/video-player-references-2026-10-18/` (15 players captured at 2×: Video.js v10, apple.com,
Media Chrome's Microvideo, Minimal, Sutro, Instaplay, Vimeonova and YT themes, YouTube's embed, Vidstack, Mux, Loom,
Plyr, Kibo, Edge's native controls; contact sheet). Against them the floating controller had the smallest buttons, the
heaviest and dimmest time, the faintest rail and the only tall rectangle. Applied:
- Buttons 24 → `control-md` (26 at the app's 13; references 30–38, median 32), icons 16.
- Panel tightened: 4 in, rows 2 apart (58), corner 16; Video.js's 1px black 10% ring and a soft 0 4 16 black 20% shadow.
- Time regular (400) at white 90% (references 81–100%, 400); remaining time on the right (Video.js, Plyr).
- Volume: only mute at rest, the slider slides out on hover or focus (every compact or floating reference; Vidstack 0 → 72).
- Rail white 30%, loaded 50% (references 30–50%).
- Captions shows disabled without a track; every button has an Area Tooltip with its key (Loom, YouTube).

## Review note, 2026-10-18 (round 42)

- **What changed:** Bigger buttons, a slimmer panel with softer corners and a faint edge so it holds on bright video,
  lighter time text with time remaining on the right, the volume slider tucked behind the speaker until you hover it,
  and a tooltip with its shortcut on every button.
- **Why:** You asked what other products do. Compared with 15 players (YouTube, Vimeo-style, Loom, Mux, Video.js,
  Vidstack, Plyr, Apple), Area's controller had the smallest buttons, the heaviest time and the faintest track.
