# Video player survey, 2026-10-17

The owner asked for "a real video component with its own design player controls" (Figure round 37). Figure keeps the
media and caption; the player is its own family and sits inside a Figure. This page surveys how players present their
controls and recommends Area's. Nothing here is built yet.

Method: library values are read from pinned source (default CSS custom-property fallbacks and constants). YouTube,
Vimeo and apple.com were read live as computed styles in a logged-out browser, 1024 × 768 viewport, light OS theme; no
setting was changed (YouTube autoplayed its own embed). Rows marked **not measured** are from documentation or general
knowledge and must be captured with `area-capture.js` before any value is used.

## Sources

| Source | Kind | Pin | What was read |
|---|---|---|---|
| YouTube watch player (2025 "delhi modern" chrome) | product, live | youtube.com/watch?v=aqz-KE-bpKQ, logged out, 2026-10-17, player 640 × 360 | computed styles of `.ytp-*` |
| Vimeo player | product, live | player.vimeo.com/video/76979871, 2026-10-17 | computed styles, tooltips, ARIA |
| apple.com inline video | product, live | apple.com/apple-vision-pro, 2026-10-17 | `.play-pause-button` |
| Plyr | library (MIT) | sampotts/plyr @af42d59 | `src/sass/settings/*.scss`, `src/sass/types/video.scss`, `src/js/config/defaults.js`, `src/js/listeners.js`, `src/js/controls.js` |
| Video.js v10 (the merged Video.js / Vidstack / Media Chrome / Plyr skin) | library (Apache) | videojs/video.js @2d40a22 | `packages/skins/src/styles/themes/{theme,neutral}.css`, `video/theme.css`, `tailwind.css`, `layout/controls.styles.ts`, `buttons/button.styles.ts`, `sliders/{slider,time-slider}.styles.ts`; `packages/core/src/dom/store/features/controls.ts` |
| Vidstack default layout | library (MIT) | vidstack/player @0133da6 | `packages/vidstack/styles/player/default/{buttons,sliders,controls,time,tooltips,layouts/video}.css`; `src/core/keyboard/controller.ts`; `src/core/controls.ts` |
| Media Chrome (Mux) | library (MIT) | muxinc/media-chrome @9c819e1 | `src/js/media-chrome-button.ts`, `media-chrome-range.ts`, `media-time-range.ts`, `media-container.ts`, `media-controller.ts` |
| Kibo UI video-player (the shadcn-style one) | library (MIT) | haydenbleasel/kibo @3d63cdb | `packages/video-player/index.tsx` (Media Chrome themed with shadcn tokens) |
| Apple HIG, Playing video | guideline | developer.apple.com/design/human-interface-guidelines/playing-video (JSON, 2026-10-17) | best practices |
| Notion video block, Loom, Slack, Linear, GitHub markdown, Figma, ChatGPT/Sora | products | **not measured** | see notes below |
| Material 3 | guideline | — | no video-player component; nothing to pin |
| Radix / Ark | library | — | no media player primitive |

## Readouts

### Products

**YouTube** (`.ytp-*`, live)

- Layout: overlay bottom chrome 56 tall, 12 in from each side; a full-width scrubber row sits *above* the button row
  (`.ytp-progress-bar-container` 6 tall at `bottom: 56px`). Gradient scrim `.ytp-gradient-bottom` 61 tall (a 1 × 198
  PNG ramp, transparent to dark), fades with `opacity 0.25s cubic-bezier(0,0,0.2,1)`.
- New 2025 chrome: buttons 40 × 40 (48 wide on the right group), 24 icons, ink rgb(238 238 238). Play/pause is a
  round 40 with a black-30% plate; the right group and the time readout sit on black-30% pills (radius 28).
- Scrubber: rail rgba(40,40,40,.6), 6 tall scaled to 0.667 = **4 at rest, 6 on hover** (`transform 0.2s`); buffered
  white 40%; hover-ahead black 12.5%; played red → pink gradient. Thumb **12** round, red, scale 0 at rest, grows in 0.1s.
- Time: 14 / 500, YouTube Noto, ink #eee, "0:00 / 10:34" (current / duration), padding 0 16 inside its pill.
- Volume: mute 40 button; the 12-thumb slider slides out horizontally on hover (`width 0.2s`).
- Big centred play before first play: 68 × 48.
- Controls in order: play/pause, (next), mute + volume, time, (chapter), captions (shown disabled when unavailable:
  "Subtitles/closed captions unavailable"), settings, theater, (cast), fullscreen; PiP hidden by default.
- ARIA: scrubber `aria-label="Seek slider"`, `aria-valuetext="0 Minutes 0 Seconds of 10 Minutes 34 Seconds"`.
  Button labels carry the shortcut: "Pause (k)", "Mute (m)", "Full screen (f)".
- Keyboard (YouTube help, well known): space/k, j/l ±10 s, ←/→ ±5 s, ↑/↓ volume 5%, m, f, c, i (miniplayer), 0–9 jump,
  `<`/`>` speed. Frame corner: 0 on the watch page.

**Vimeo** (live)

- Layout: one floating row at the bottom, **32 tall**, black 90% plate, radius 4, the play button a separate 56 × 32
  plate at the start. Scrubber inline in the row.
- Buttons **24** square, radius 4, **20 icons**, white. Tooltips 12 / 700 on black 90%, radius 4, 32 tall: "Play",
  "CC/subtitles", "Settings", "Speed", "Transcript", "Picture-in-Picture", "Fullscreen".
- Scrubber 4 tall pill, rail white 20%; hover preview time 11 / 500 in a black-90% chip under a thumbnail, radius 8.
  Current time as a white chip, 10 / 500, black ink, radius 4, 20 tall, riding the playhead.
- Volume: vertical popover 32 × 96, bar 4 × 72 (white 40% rail, blue #00adef fill), 8 handle.
- ARIA: progress focus target `aria-label="Progress Bar"`, `aria-valuetext="00:00 of 01:02"`; volume
  `aria-label="Volume (use up/down arrow keys to change)"`, `aria-valuetext="100% volume"`.

**apple.com inline video** (live): ambient clips show one control only, a **38 round** play/pause button
(`.play-pause-button`, ink #1d1d1f on the page, transparent plate), labelled with the clip ("Intro to Apple Vision Pro
animation…"). No scrubber, no time, no volume: the "ambient/loop" pattern.

**Not measured (to capture before use):** Notion's uploaded-video block is believed to use the browser's native
`<video controls>` (embeds use the provider's player). GitHub markdown video is native `<video controls>`. Loom's share
player is a custom overlay bar with speed as a visible text button (its known differentiator). Slack and Linear
attachment previews open into custom players. Figma: video fills play in prototypes with no visible chrome; Figma Slides
has a player. ChatGPT/Sora: login required. None of these were read in this pass.

### Systems and libraries

| | Plyr | Video.js v10 (default / neutral) | Vidstack default | Media Chrome | Kibo |
|---|---|---|---|---|---|
| Layout | overlay row at bottom, scrubber inline | default: floating pill inset 8 (media ≥ lg); neutral: bar inset 2, transparent | overlay; scrubber row above buttons | free composition; one bar of plated controls | bar *below* the video, app tokens |
| Scrim | `linear-gradient(transparent, black 75%)` behind the bar, padding-top 20 (35 wide) | default 40% → 20% → 50% black; neutral 50% → 20% | `to top, black 60%, 10%, transparent, 95%, black 30%` | none (controls carry a plate) | none |
| Button | icon 18 + padding 7 = 32, radius 4 | 36 (`spacing × 9`), icon 18 (`spacing × 4.5`); radius pill / neutral 8 | 38 (fullscreen 42), icon 70%, hover plate white 20%, radius 8 | 24 icon + 10 padding = 44; plate rgb(20 20 30 / .7), hover rgb(50 50 70 / .7) | same, padding 10 |
| Ink | #fff | `oklch(1 0 0)`, muted 65%; text-shadow and 1px icon drop-shadow | #f5f5f5 | rgb(238 238 238) | `--foreground` |
| Rail / buffered / played | track = buffered white 25%; fill accent hsl(198 100% 50%) | `currentColor` 20% / `currentColor` 20% layered / primary (white) | white 30% / 50% / brand #f5f5f5 | white 20% / — / #eee | `--border` / — / `--primary` |
| Track | 5 | 4 (`h-1`), chapter hover 7 | 5, ×1.25 when focused/hover | 4, segment hover 7 | 4 |
| Thumb | 13 white, 1px 20% ring | 12 white (`size-3`), scale .7–.8 at rest → 1 on hover, hidden until interactive | 15 white, 1px #cacaca, focus ring 4px white 40% | 10 | 10 |
| Hit height | — | 32 (`spacing × 8`) | 48 | 24 + 2 × 10 | — |
| Hover time | tooltip, 13 | label above pointer, tabular-nums | 13 / 500 tooltip, radius 4, padding 4 8 | chip 13, padding 3.5 9, in .5 s after .25 s | — |
| Time | 13, remaining (`invertTime`, toggleable) | tabular-nums | 15 / 400, letter-spacing .025em | 14 bold | — |
| Frame radius | inherits | default 28, neutral **12** | **6** + 1px white 10% edge | — | — |
| Auto-hide | 2000 ms (touch 3000); fade + translateY 0.4 s | **2000 ms**, never while paused; fade 100 ms out, 50 ms in, 4px offset + blur | **2000 ms**; opacity 0.2 s | **2 s** (`autohide`), in 0.25 s, out 1 s | — |
| Big play | 48 round accent at 90% | — (indicator flashes) | load button 56 round | — | — |
| Default controls | play-large, play, progress, current-time, mute, volume, captions, settings, pip, airplay, fullscreen | play, seek ±, time slider, time, mute + volume popover, captions, rate, pip, cast, airplay, fullscreen | same family | à la carte | play, seek ±10, time range, time, mute, volume |
| Keys | space/k, ←/→ (seekTime 10), ↑/↓, m, f, c, l, 0–9 | 0–9 jump; hotkeys | k/space, j/←, l/→ (**5 s, shift 10 s**), ↑/↓ 5% (shift 10%), m, f, i (PiP), c, `<`/`>` ±0.25 | space/k, j/← l/→ (10 s), ↑/↓, m, f, c, `<`/`>`, p | — |
| Scrubber ARIA | `aria-valuetext` "12.3%" (time in seek tooltip) | slider | slider, valuetext time | `aria-valuetext` "{current} of {total}" in words | — |

**Apple HIG:** use the system player where possible; a custom player should "reference the behavior and interface of
the system video player"; people expect Space to play/pause. Show video at its own aspect ratio, never padded.

## Where sources agree

- **Control set.** Every full player ships play/pause, a scrubber, time, mute (+ volume) and fullscreen. Captions,
  settings (speed) and PiP are near-universal but conditional: captions only with a text track (YouTube shows it
  disabled, Vimeo hides it), PiP only where the browser supports it.
- **Overlay, not below.** Products and every library overlay the controls on the media with a dark scrim or plates;
  only Kibo (and the browser's native controls in some engines) puts a bar outside the frame.
- **Scrubber:** 4 at rest (YouTube, Vimeo, Video.js, Media Chrome, Kibo), growing on hover (YouTube 6, Video.js 7,
  Vidstack ×1.25); thumb 10–15, median **12** (YouTube, Video.js), hidden or shrunk at rest and shown on hover/drag;
  rail white **20%** (Vimeo, Video.js, Media Chrome), buffered white **40%** (YouTube 40, Vidstack 50, Plyr 25).
  Played is either the accent (YouTube, Vimeo, Plyr) or white (Video.js default, Vidstack, Media Chrome).
- **Ink:** white or near-white (#eee–#fff) at full opacity; text-shadow / drop-shadow for legibility (Video.js).
- **Auto-hide 2000 ms** while playing (Plyr, Video.js, Vidstack, Media Chrome); always visible while paused, on focus
  within, and while the pointer is over the bar.
- **Keyboard** (scoped to the focused player): space/k, ←/→, ↑/↓, m, f, c are shared by all; arrows are ±5 s in YouTube
  and Vidstack, ±10 s in Plyr and Media Chrome; 0–9 jump to tenths (YouTube, Plyr, Video.js, Vidstack).
- **ARIA:** scrubber as a slider labelled "Seek" with a spoken `aria-valuetext` of current *of* total (YouTube, Vimeo,
  Media Chrome); volume as a slider with "N% volume" (Vimeo); toggle buttons whose label names the next action
  ("Play"/"Pause") and whose tooltip shows the shortcut (YouTube).

## Recommendation for Area

Scale: the app at type 13 Compact, where `control-xs/sm/md/lg` resolve to 20 / 24 / 26 / 34 and `type-icon` is 16
(`tokens.json`: control-sm = max(24, leading 18 + (4 + 2·level) × 2) with compact level −1). Every value below should
be confirmed with captures (YouTube, Vimeo, Loom, Notion) before the spec records it.

### Control set (minimum, in order)

`play/pause` · `scrubber` · `time` (current / duration) · `mute` (volume slider revealed on hover/focus) · then the
conditional group: `captions` (only with a text track) · `settings` (speed, captions track) · `picture-in-picture` (only
when supported) · `fullscreen`. Plus a centred **play** at rest before first play. Not in the minimum: seek ±10 buttons,
cast/AirPlay, theater, chapters, thumbnails (one or two sources each; add when asked).

### Layout

- Overlay on the media inside the Figure's media box, **one row** at the bottom with the scrubber inline between play
  and time (Plyr, Vimeo, Video.js, Media Chrome; it suits Figure-width players of 360–720). YouTube's scrubber-above-row
  needs a 56 chrome; keep it as a later `layout` option only if the owner asks.
- Row: 24 buttons with 4 padding and 2 gaps → **32 tall** (Vimeo 32, Plyr 32), inset 4 from the media's sides and
  bottom so the row clears the corner radius.
- Scrim: `linear-gradient(to top, rgb(0 0 0 / 0.5), transparent)` **64 tall** (2 × the row; Plyr 20–35 padding over
  32, YouTube 61 over 56; opacity from Video.js neutral 50% and Vidstack 60%). Fades with the controls.
- Centred play at rest: **48 round** (Plyr 48; Vidstack 56; Apple 38) on black 50% with a 20 icon, white; it disappears
  after the first play (YouTube, Plyr). Clicking the media toggles play; double-click toggles fullscreen.
- Frame: the Figure's media corner `radius-small` (Figure spec; Vidstack 6, Video.js neutral 12); the player clips
  scrim and bar to it. Background black behind letterboxing (all sources).

### Sizes and colours

| Part | Value | Basis |
|---|---|---|
| Button | ghost icon-only, **control-sm 24** square, `radius-control-sm` | Vimeo 24; Area's compact sm; Figma 24 |
| Icon | **16** (`type-icon`), filled play/pause | Vimeo 20 at 24, Video.js 18 at 36; Area native 16 cut at this size |
| Gap between buttons | 2 | Vimeo 0–4; Area toolbar gaps |
| Ink | white `#fff` /* spec */, fixed in every state | Video.js `oklch(1 0 0)`, Plyr #fff; YouTube/Media Chrome #eee |
| Legibility | `text-shadow: 0 1px 2px rgb(0 0 0 / .3)` and the same `drop-shadow` on icons | Video.js `text-shadow-media`, `drop-shadow-media-icon` |
| Button hover / pressed | white **20%** / white 30% plate | Vidstack hover white 20%; ghost's "plate, ink fixed" rule |
| Scrubber hit area | 24 tall (the row height) | Video.js 32, Media Chrome 44 |
| Track | **4** at rest → **6** on hover / drag, `radius-full` | YouTube 4 → 6; Vimeo, Video.js, Media Chrome 4 |
| Rail / buffered / played | white **20%** / white **40%** / white | Vimeo, Video.js, Media Chrome 20%; YouTube 40%; Video.js, Vidstack, Media Chrome white fill (monochrome suits ChatGPT and Notion; accent fill stays an option) |
| Thumb | **12** white round, `shadow` as Video.js `0 0 0 1px rgb(0 0 0/.1), 0 1px 3px rgb(0 0 0/.35)`; hidden at rest, shown on hover, drag and focus | YouTube 12 (scale 0 → 1), Video.js 12 |
| Hover time | Area Tooltip (dark) above the pointer, 6 from the track, tabular figures | Vimeo, Vidstack, Media Chrome |
| Time | `text-sm` (12 at app scale), weight 500, tabular-nums, `m:ss / m:ss` (`h:mm:ss` past an hour) | YouTube 14 / 500 current / duration; Vidstack |
| Volume slider | 56 wide, revealed beside mute on hover/focus, same track and thumb | YouTube horizontal reveal (`width 0.2s`); Vidstack max 72 |
| Focus | Area's 2px focus ring on buttons and the thumb | CONTRAST.md to confirm on media; Vidstack 4px white 40% |

### Timing

- Idle hide **2000 ms** while playing (four libraries agree); never while paused, while focus is inside, while a menu is
  open, or while the pointer is over the row. Hide the cursor with the controls.
- Show on `fast` ease-out, hide on `moderate` (Media Chrome 0.25 s in / 1 s out; Video.js faster in than out); opacity
  only, no translate (MOTION.md crispness). Track growth on `fast`.
- Tooltips: Area's usual open delay; a tooltip open on one button lets neighbours open at once (MOTION.md).

### Reusing Area parts

- **Button** ghost icon-only, size sm. Area has no on-media ink: add a local override in the player (ink white, hover
  white 20%) or a Button `on-media` boolean, as Badge has `on-color`. Owner decision.
- **Slider** for scrubber and volume: the native range input stays (keyboard, valuetext). It needs a media skin (white
  rail at 20%, white fill, no surface ring on the thumb) and a **buffered layer**: a second gradient stop read from a
  `--_buffer` percentage beside `--_pct`. Hover growth 4 → 6 is new for Slider.
- **Tooltip** for every button label, with the shortcut in a **Kbd** ("Pause  K"), and for the scrubber's hover time.
- **Menu** for settings: Speed (0.5, 0.75, 1, 1.25, 1.5, 2; Vidstack clamps 0.25–2) and Captions (Off / tracks).
- **Spinner** (or `loader-circle`) centred while buffering.

### Variants

- `controls`: **`auto`** (default; overlay, hides after idle) and **`always`** (never hides; for short clips and
  docs, Kibo's always-visible bar). Two sources each; nothing else is needed for the first build.
- Narrow players: container queries collapse, not a variant (Video.js `media-max-lg`, Vidstack's sm layout): below
  ~400 drop the volume slider (keep mute) and PiP; below ~280 drop time duration and settings.
- Optional later, if asked: `ambient` (Apple: one round play/pause, muted loop, no scrubber).

### States

idle (poster + centred play) · playing (controls auto-hide) · paused (controls shown, play icon) · buffering (spinner,
controls stay) · ended (centred replay, `rotate-ccw`) · error (message over black) · muted (`volume-off`) · captions on
(`captions` pressed, `aria-pressed`) · fullscreen (icon swaps) · disabled / no source. Scrubber: rest, hover (track 6,
thumb, hover time), dragging (thumb follows the pointer, time updates), focus-visible.

### Keyboard (when the player or a control has focus)

Space / K play-pause · ← / → ±5 s (J / L ±10 s) · ↑ / ↓ volume ±5% · M mute · F fullscreen · C captions · I
picture-in-picture · 0–9 jump to 0–90% · Home / End start / end. Space on a focused button activates that button,
as natively. Basis: YouTube, Vidstack (5 s arrows, j/l 10 s), Plyr, Media Chrome.

### Accessibility

Region `role="group"` with `aria-label` from the video's title. Buttons are native with labels naming the action
("Play", "Pause", "Mute", "Unmute", "Enter full screen", "Exit full screen", "Captions" with `aria-pressed`). Scrubber:
native range, `aria-label="Seek"`, `aria-valuetext="1 minute 12 seconds of 4 minutes 3 seconds"` (YouTube, Media
Chrome), updated at most once a second while playing. Volume: `aria-label="Volume"`, `aria-valuetext="60% volume"`.
Controls never hide while focus is inside them. `prefers-reduced-motion`: no track growth animation.

### Icons

Present in `packages/icons/sources`: `play`, `pause` (both with filled cuts), `play-circle`, `pause-circle`, `volume`
(two waves = high), `volume-low`, `volume-off` (×), `captions`, `captions-off`, `settings`, `gauge` (speed),
`picture-in-picture`, `maximize` (alias of `expand`, diagonal arrows out) and `minimize` (alias of `collapse`), `corners`
(four corner brackets), `fast-forward` / `rewind` (flip), `skip-forward` / `skip-back` (flip), `rotate-ccw` (flip of
`rotate`) and `reset` (replay), `loader`, `loader-circle`, `cast`, `more-horizontal`.

Missing: **seek back / forward 10 s** (circular arrow with "10"; only if seek buttons are added); **AirPlay**; an
**exit-fullscreen corners-in** partner to `corners` if the bracket style is chosen for fullscreen (YouTube, Vimeo and
the browsers use brackets; `maximize`/`minimize` arrows already form a pair); **picture-in-picture exit** (optional, most
players reuse one icon). No missing icon blocks the minimum set.

## Open for the owner

1. Played fill white (monochrome, recommended) or the accent?
2. Fullscreen icon: corner brackets (needs a corners-in exit icon) or the existing `maximize` / `minimize` arrows?
3. On-media ghost Button: a Button boolean, or a player-local override?
4. Captures still needed: Notion video block, Loom, YouTube embed hover/focus states, dark theme.
