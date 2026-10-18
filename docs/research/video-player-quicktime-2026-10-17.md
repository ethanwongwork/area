# Video player: QuickTime-style floating controller, 2026-10-17

The owner wants the Video player "based on the QuickTime player preview, but in the style of area components". This
note reads Apple's open-source controller (WebKit's modern media controls, which draw Safari's controls and match
QuickTime's floating panel), AVKit's documented control styles, and the variants real player libraries ship. It then
recommends variants and a floating-controller layout scaled to Area's app (type 13 Compact: `control-sm` 24, icons 16).
It follows `docs/research/video-player-2026-10-17.md` (the first survey) and `docs/specs/video-player.md`.

Method: every value below is read from source at a pinned commit, or from an official doc. Nothing was measured live,
and no Apple app was opened. macOS/iOS 26's single-pill player has no public source. The nearest open-source analogue
is WebKit's visionOS controls (pill bars), so values for that layout come from there and are marked as an analogue.

## Sources

| # | Source | Pin | What was read |
|---|---|---|---|
| W1 | WebKit modern media controls, macOS full screen (the floating controller) | WebKit/WebKit @`54a3335424a53d317bc2c4c285b651c7c7103087`, `Source/WebCore/Modules/modern-media-controls/controls/macos-fullscreen-media-controls.css` | lines 28–40 bar size and position, 50–98 containers and scrubber, 102–108 status label |
| W2 | same, `controls/macos-fullscreen-media-controls.js` | @54a3335 | 26 time-control width 448; 40 bar knob; 42 play ×2; 51–75 three containers, margins; 126 at most 3 right buttons; 159–165 collapsible pip/tracks; 167–199 the bar can be dragged |
| W3 | `controls/media-controls.css` | @54a3335 | 40–49 glyph colours, bar heights, margins, inline radius; 102–125 fade timings; 127–131 time label colour |
| W4 | `controls/background-tint.css` | @54a3335 | 30–48 panel radius, blur, tint |
| W5 | `controls/slider.css`, `slider.js`, `slider-base.css` | @54a3335 | slider.css 26–124 track, fill, knobs; slider.js 43 height 16; slider-base.css 69–77 9px hit thumb |
| W6 | `controls/button.css` | @54a3335 | 42–73 glyph paint, press scale; 78–134 corner / centre buttons |
| W7 | `controls/time-label.css`, `time-control.css` | @54a3335 | time-label 26–33; time-control 26–64 (gap 5, small-width rule) |
| W8 | `controls/auto-hide-controller.js` | @54a3335 | 26 `AutoHideDelayMS = 4000` |
| W9 | `controls/buttons-container.js`, `inline-media-controls.js`, `macos-inline-media-controls.js/.css`, `macos-layout-traits.js` | @54a3335 | default margins 16 (41–44); inline groups (262–294); volume pop-up 60 / 94 × 31 (45, css 4–22); `skipDuration` 15 (60–63) |
| W10 | `images/macOS/*.svg` | @54a3335 | intrinsic glyph sizes (Play 11 × 13, Rewind/Forward 24 × 16, Volume 22 × 15, PipIn-fullscreen 19 × 16, MediaSelector-fullscreen 17 × 16, ExitFullscreen 16 × 16, SkipBack15 13 × 15) |
| W11 | `controls/vision-media-controls.css`, `vision-slider.css` (pill analogue) | @54a3335 | 34–82 sizes by container width; 155–188 pill radius, tints; 204–219 centre play 70/100; 265–326 bottom bar 56 in full screen, slider 8 → 20 |
| W12 | `controls/pip-placard.js` | @54a3335 | 33 "This video is playing in picture in picture." |
| A1 | AVKit `AVPlayerViewControlsStyle` | developer.apple.com/documentation/avkit/avplayerviewcontrolsstyle (and `/none`, `/inline`, `/floating`, `/minimal`, `/default`; read as the doc JSON, 2026-10-17) | case list and abstracts; `floating` "matches the look of QuickTime Player's playback controls"; `default` is `inline` |
| M1 | MDN, Picture-in-Picture API | mdn/content @`32eceacf42b6bff41d9605298eba143cb7e199a1`, `files/en-us/web/api/picture-in-picture_api/index.md` | 10, 29–33 (browser-drawn window; "no support for adding custom HTML buttons or controls") |
| M2 | MDN, Document Picture-in-Picture API | same commit, `files/en-us/web/api/document_picture-in-picture_api/index.md` | 8 secure context; 10, 21–24 arbitrary HTML, custom controls |
| M3 | browser-compat-data | mdn/browser-compat-data @`0416078da7a1eafd7b308b37366eeac492bc1e46`, `api/DocumentPictureInPicture.json` | Chrome 116, Edge mirrors, Firefox 151, Safari no |
| V1 | Vidstack default layout | vidstack/player @`0133da67e4f84a5aaad59c63853b12c6cda0a6a9`, `packages/vidstack/src/components/layouts/default/props.ts` 6–37; `video-layout.ts` 17–18; `default-layout.ts` 40–42; sibling `audio-layout.ts` | `smallWhen`, `when`, `menuGroup`; video vs audio layouts; `data-size` sm / lg |
| J1 | Video.js v10 skins | videojs/video.js @`2d40a22`, `packages/skins/src/meta.ts` 17–21 (themes compat / default / neutral / scaffold × presets video / audio / live-video / live-audio); `packages/skins/src/presets/background`; `packages/skins/src/styles/themes/theme.css` 26–42 | surface blur, shadows, pill radius |
| C1 | Media Chrome themes (player.style) | muxinc/player.style @`2bb67f57ff7319d735f26897baead054af910fb1`, `themes/` | 14 themes: demuxed-2022, halloween, instaplay, microvideo, minimal, notflix, reelplay, sutro, sutro-audio, tailwind-audio, vimeonova, winamp, x-mas, yt |
| X1 | Mux Player themes | muxinc/elements @`35a588be53dea07a96402187e9b27931d8f68559`, `packages/mux-player-react/src/themes/{classic,gerwig,microvideo,minimal,news}.ts` | five built-in themes |
| P1 | Plyr | sampotts/plyr @af42d59, `src/js/config/defaults.js` (pinned in the first survey) | one layout, configured by the `controls` list; no variants |
| Y1 | YouTube | first survey (live, 2026-10-17) | default / theater (page layout) / miniplayer (`i`) |
| R1 | Area material (unmerged) | `.claude/worktrees/materials-testing-inspector-00a2d4`: `packages/tokens/src/axes/material.ts` (untracked; HEAD e876d429), `packages/styles/src/material.css` (untracked) | Glass bundle, frost and transparency formulas, chrome/overlay roles |
| R2 | Area tokens | this worktree, `packages/styles/dist/area.css` 1144–1146, 1362, 1379, 1400; `packages/styles/src/components/toolbar.css` 20–37 | radius factor 0.25, radius-surface 12, ui-cluster 8 − 2·dense, control-sm, floating toolbar's concentric radius |

## 1. WebKit's macOS controls (Safari, and QuickTime's look)

### The floating controller (macOS full screen)

| Part | Value | Pin |
|---|---|---|
| Panel | **468 × 75**, centred: `left: calc((100% - 468px) / 2)`, **25 above the bottom** | W1 29, 35–39; W3 41 |
| Corner | **8** | W4 37 |
| Paint | two layers: `rgba(0,0,0,0.55)` with `-webkit-backdrop-filter: saturate(180%) blur(17.5px)`, then `rgba(255,255,255,0.14)` with `mix-blend-mode: lighten` | W4 40–47 |
| Border / shadow | none: the tint alone separates it | W4 (none declared) |
| Rows | **two**. Row 1 is the 44-tall button row (`top 0`). Row 2 is the time control, **16** tall at `top: 49`, `left: 10`, **448** wide (10 in from each side) | W1 50–52, 91–98; W2 26 |
| Row 1, left | mute + volume slider (**60** wide). The container is 100 wide, 12 from the edge, 6 between, at `top: 16` | W1 58–62, 86–88; W2 51–57 |
| Row 1, centre | **rewind · play/pause · forward**, 27 apart and 27 margins, `top: 3`. Play/pause is drawn at **2×** (11 × 13 → 22 × 26) | W1 68–72; W2 42, 59–65; W10 |
| Row 1, right | AirPlay, PiP, tracks (captions and audio), exit full screen, overflow. 24 between, 12 margins, `top: 18`. At most **3** are shown; PiP and tracks fold into the overflow menu first | W1 76–84; W2 67–73, 124–134, 159–165 |
| Glyphs | about 16 tall: rewind/forward 24 × 16, volume 22 × 15, PiP 19 × 16, tracks 17 × 16, exit 16 × 16 | W10 |
| Glyph paint | secondary `rgba(255,255,255,0.55)`, primary (play, skips) `0.75`, both `mix-blend-mode: plus-lighter`; "on" white; focus paints the glyph in the focus colour (no ring); press scales the glyph to 0.89 | W3 42–43; W6 42–73 |
| Scrubber | slider 16 tall. Track **5** tall centred (`top: 5.5`), fill radius 4.5. Played `rgba(255,255,255,0.45)`, buffered `0.08`, rail `0.1`, all plus-lighter. While scrubbing: track 15 tall, played `rgb(236,236,236)`, rail `rgb(102,102,102)`, 0.5 s | W5 slider.css 26–101; slider.js 43 |
| Knob | full screen: a **bar 4 × 17**, radius 4. Inline: a **9** circle | W2 40; W5 104–121 |
| Time | 12 px, `-apple-system-monospaced-numbers`, `font-feature-settings: "case"`, white 55% plus-lighter. Elapsed and remaining sit either side of the scrubber, 5 apart. Under 160 wide only one label stays | W7; W3 127–131 |
| Status | 14 px centred, 13 from the panel's foot (e.g. live, errors) | W1 102–108 |
| Fade | in `opacity 0.1s linear`, out 0.25 s; first show 350 ms | W3 102–125 |
| Auto-hide | **4000 ms** | W8 26 |
| Behaviour | the panel can be **dragged** (a mousedown not on a button moves it) | W2 77–79, 167–199 |

### Inline controls (macOS, in a page)

- One bar **31** tall, inset **6** from the video's sides and foot (`--inline-controls-inside-margin`). The same tint
  (black 55%, blur 17.5, saturate 180%) and an 8 corner (W3 40, 45–49; W4; inline-media-controls.css 28–31).
- Left: skip back 15 · play/pause · skip forward 15. Right: mute, AirPlay, tracks, overflow. The time control fills
  the middle (W9 inline-media-controls.js 271–294; `skipDuration` 15, macos-layout-traits.js 60–63). PiP and full screen
  move to a separate top-left bar when the video is at least 82 tall (inline-media-controls.js 155–157, 262–269).
- Volume pops up as its own tinted capsule, 94 × 31, rotated vertical, over the mute button. It only appears when the
  video is at least 136 tall (macos-inline-media-controls.js 26, 45; .css 4–22).
- Before the first play: a centred round button, **60** (small 31), on the same tint, glyph at 40% of the button
  (button.css 106–129).

### Pill analogue (visionOS controls, the closest open-source form of the 2025–26 single pill)

Radius is half the height, so the bars are pills (vision-media-controls.css 155–157, 313–315). The bottom bar is **56**
tall in full screen, inset 12 / 16 / 24 by container width (≥ 262, ≥ 390, full screen; 50–82, 265–281). Each button
is round with 10 padding (284–286). The bar's blur layer is `rgba(149,149,149,0.25)`, buttons `rgba(255,255,255,0.15)`,
pressed adds white 30% (164–177). An "on" button is a white disc with black ink (179–188). The slider is **8** and
grows to **20** while dragged (36, 324–326); its fill is `rgba(212,212,212,1)` (vision-slider.css 80). The centre play
is 70 (100 when large), and the transport glyphs are zoomed 2× (2.75 over 640 wide) (40, 72, 204–219).

## 2. AVKit `AVPlayerViewControlsStyle` (macOS)

| Style | Apple's description (A1) |
|---|---|
| `none` | The view displays no playback controls. |
| `inline` | Playback controls in a bar along the view's bottom edge. **`default` is `inline`.** |
| `floating` | Playback controls in a floating window over the video content. "This style matches the look of QuickTime Player's playback controls." |
| `minimal` | Basic controls to play and pause playback. |
| `default` | The view's default controls style (= `inline`). |

**QuickTime Player uses `floating`.** That is Apple's own statement on the `floating` page.

## 3. Variants that real players ship

| Player | Variants / layouts | Pin |
|---|---|---|
| AVKit | none, inline (default), floating, minimal | A1 |
| WebKit | macOS inline, macOS full screen (floating), iOS inline, visionOS (pills), tvOS, watchOS, Adwaita, audio | W directory listing; W9 |
| Vidstack | **video** and **audio** default layouts (video when `viewType === 'video'`); each switches to a **small** layout with `smallWhen` (video default: width < 576 or height < 380), shown as `data-size="sm"/"lg"`; plus a Plyr layout | V1 |
| Video.js v10 | themes compat / default / neutral / scaffold × presets video / audio / live-video / live-audio; a **background** preset (no controls, ambient). The default theme is a floating pill: `--media-controls-radius` 99px, surface `blur(16px) saturate(110%)`, inset highlight `inset 0 1px 0 rgb(255 255 255/.1)` | J1 |
| Media Chrome | à la carte elements; product looks are **themes** (14 in player.style) | C1 |
| Mux Player | themes classic, gerwig (current), minimal, microvideo, news | X1 |
| Plyr | one layout, set by the `controls` list | P1 |
| YouTube | default, theater and full screen are **page** layouts. Miniplayer is an in-page corner player | Y1 |

They agree on three real layouts: **a bar** (AVKit inline, Safari inline, Plyr, Vimeo, Video.js neutral), **a floating
panel or pill** (AVKit floating/QuickTime, Safari full screen, Video.js default, visionOS) and **minimal or ambient**
(AVKit minimal, Video.js background, apple.com's ambient clips). Every library also has a **small** responsive form,
which it triggers by size. A small form is not a separate component (Vidstack `smallWhen`, WebKit's 160 rule and
button dropping). Audio is a separate layout everywhere. Themes (Media Chrome, Mux) are colour and shape skins; in Area
that work belongs to the axes, not to variants.

### Is picture in picture a variant?

**No.** PiP is a control that hands the `<video>` to a window the browser or OS draws. The site cannot style that
window or add HTML controls to it. It only gets buttons for Media Session actions it registers (M1 29–33). The inline
player stays behind as a placard (WebKit: "This video is playing in picture in picture.", W12 33). No library ships PiP
as a layout. The one exception is **Document Picture-in-Picture**: it opens an always-on-top window that the app fills
with its own HTML, "a video with custom controls" (M2 10, 21–24). It needs a secure context and runs in Chrome 116+,
Edge and Firefox 151, but not in Safari (M3). Even there, the player is the same component *moved into* another window.
That is a placement, not a variant. Whether Electron exposes `documentPictureInPicture` was not checked.

## Recommendation for Area

### Variants (`layout`)

| Variant | What | Sources |
|---|---|---|
| **`floating`** (new; the owner's QuickTime look) | a dark frosted panel inset over the video: two rows (transport, then time · scrubber · time). It collapses to a one-row pill when narrow | AVKit `floating` (A1); WebKit macOS full screen (W1–W2); Video.js default pill (J1); visionOS pill (W11) |
| **`bar`** (what is built now) | one row along the foot on a scrim | AVKit `inline` (A1); WebKit inline (W9); Plyr, Vimeo, Video.js neutral (first survey) |
| **`minimal`** | one round play/pause, no scrubber; for ambient loops | AVKit `minimal` (A1); Video.js background preset (J1); apple.com ambient (first survey) |

Keep `controls: auto | always` as it is. Narrow sizes stay container queries, not variants (V1, W7). Leave out `none`:
a `<video>` with no controls is not this component (AVKit `none` exists only because AVPlayerView always draws
something). Audio would be its own component. PiP stays a button (above). If Document PiP is wanted later, it is a
placement of the same player.

### Floating controller, scaled to the app (type 13 Compact)

Apple's glyphs are about 16 tall in a 75 panel, which is Area's 16 icon. Scaling the panel by Area's row heights
(64 / 75 ≈ 0.85) keeps Apple's proportions.

| Part | Area | Basis |
|---|---|---|
| Panel size | block 64 (6 + 32 + 4 + 16 + 6); inline `min(400px, 100% - 24px)` /* spec */, centred | Apple 468 × 75 × 0.85 ≈ 400 × 64 (W1 29, 39; W3 41) |
| Position | `bottom: 12` (`space-12`), centred | Apple 25 at 75 tall; visionOS 12–16 (W1 37; W11 53, 62) |
| Padding | block 6 (`ui-cluster` at Compact), inline 12 | floating Toolbar inset (R2); Apple 10–12 side margins (W1 93; W2 54, 70) |
| Corner | `radius-surface` **12**: concentric 6 (control-sm radius) + 6 (inset), as `.area-toolbar--surface` | R2 toolbar.css 22; Apple 8 (W4 37) is one step tighter |
| Paint | `rgb(0 0 0 / 0.55)` /* spec */ under `backdrop-filter: blur(16px) saturate(180%)` /* spec */, plus Video.js's inset highlight `inset 0 1px 0 rgb(255 255 255 / 0.1)` in place of Apple's lighten tint. No border, no outer lift, no scrim | Apple black 55%, saturate 180, blur 17.5 (W4 40–47); Video.js blur 16 (J1 theme.css 27, 34); Area frost lever 4 = 16px (R1) |
| Row 1 (32) | left: mute + volume 56 (always shown). Centre: skip back 15 · **play/pause 32 with a 20 icon** · skip forward 15, buttons 24 with 16 icons, 16 apart. Right: captions, PiP, full screen; with too little room, PiP and captions fold into a "More" Menu | W2 51–73, 124–165; W1 86–88; Apple skip 15 (W9) |
| Row 2 (16) | elapsed · scrubber · remaining (or duration), 8 apart | W1 91–98; W7 time-control 26–31 (gap 5) |
| Scrubber | hit 16; track **4** rail white 20%, loaded 40%, played white; 12 round thumb on hover/drag/focus (the current player's values). Apple's 4 × 17 bar knob is an alternative for the owner to choose | W5 (track 5, bar knob); the current spec |
| Time | `text-sm` (12 at the app's 13), weight 500, tabular. Ink white 70% /* spec */ next to white transport icons (Apple's 55% / 75% split, lifted for contrast without plus-lighter; to check with `docs/CONTRAST.md`) | W3 42–43, 127–131; W7 |
| Buttons | the player's current on-media ghost buttons (24, white ink, hover white 20%, press 30%). "On" (captions) is white 20% as now. visionOS's white disc with black ink is the alternative | W6; W11 179–188 |
| Start | keep the centred round play, but paint it with the panel's own material (black 55% + blur) instead of flat black 50%; 48 with a 20 icon | Apple centre 60 on the tint, glyph 40% (W6 106–129) |
| Narrow (< 400) | one row, as a pill (radius = height / 2): play · scrubber · time · full screen; skips, volume slider and the right group fold away. Under 160 the time shows one label | visionOS pill (W11); WebKit 160 rule (W7 57–64); Vidstack small (V1) |
| Motion | in on `fast`, out on `moderate`, opacity only (current) | Apple 0.1 s in / 0.25 s out (W3 107, 115) |
| Auto-hide | keep **2000 ms** (Plyr, Video.js, Vidstack, Media Chrome); Apple's 4000 is an owner choice | W8 26 |
| Not now | dragging the panel (Apple full screen only), AirPlay, rewind/forward scanning | W2 167–199 |

### Mapping onto Area's surfaces

- The panel is an **on-media overlay**: always dark, whatever the theme, like the current player's ink. It does not
  use `bg-surface`. Its colours are literal `/* spec */` values in private `--_*` properties, as the visual-first phase
  allows.
- The Material work (`material.ts`, `material.css`) exists **only uncommitted** in the
  `materials-testing-inspector-00a2d4` worktree. Its Glass bundle gives overlays and chrome `frost 6` = `blur(24px)
  saturate(137.5%)` and transparency down to a 0.56 / 0.62 reading floor. A video panel needs its blur **always**,
  whatever Material is chosen, so it should not depend on the frost lever. Use the literal Apple/Video.js values now.
  Once Material lands, the panel can join the `overlays` role so that `data-area-material` levers (stroke, sheen) add
  to it, while the base blur stays.
- Shape: the panel is a floating Toolbar in a dark skin (same inset, concentric corner, grouped buttons). Reuse the
  Toolbar's radius formula rather than a new value.
- Icons: `skip-forward` exists; **skip back/forward 15** (numbered circular arrows) are missing (Apple
  `SkipBack15/SkipForward15`, W10). Until they exist, the skips could use `rotate-ccw` / `rotate` with a tooltip
  saying "Back 15 seconds".

### Open for the owner

1. `floating` as the default layout, with `bar` kept as an option?
2. Scrubber knob: Area's 12 round thumb, or Apple's 4 × 17 bar?
3. Skip 15 s (Apple) or 10 s (YouTube J/L, Plyr); this needs new numbered icons either way.
4. Auto-hide 2 s (libraries) or 4 s (Apple)?
