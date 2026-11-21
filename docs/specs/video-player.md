# Video player spec

**Research:** `docs/research/video-player-2026-10-17.md` (Plyr, Video.js v10, Vidstack, Media Chrome and Kibo pinned to
commits; YouTube, Vimeo and apple.com computed; Notion, Loom, Slack not measured)
**Peers:** Figure (holds it, with a caption), Button (ghost icon-only, here on media), Slider (the range), Tooltip, Spinner

## Owner decisions

- 2026-10-17, round 36: "should there be a real video component with its own design player controls?"; round 37: "eventually
  i want this to be an actual video right?"; then "work on the next work: whether to build a Video player next".
- Decided from the survey, open for review: the played part of the track is white, not the accent (monochrome, as
  Video.js, Vidstack and Media Chrome; suits ChatGPT and Notion); full screen uses Area's `maximize` / `minimize` arrows;
  the on-media buttons are the player's own (white ink, white plates), so Button is unchanged. — superseded 2026-10-18
  (rounds 44–47): every layout uses Area's ghost Buttons in the dark scheme, plates tinted white over the glass.
- 2026-10-19 (review page, docs pass): skips are 10 seconds everywhere: the Back and Forward buttons now seek 10, the same as J and L (settles round 40's open question).

## Job and boundaries

Plays a video with controls drawn in Area's language, in three layouts (AVKit's control styles). Not a Figure (which
frames any media with a caption and can hold this player), not an audio player, not a playlist. Picture in picture is a
button, not a layout: the browser draws its own window (round 40).

## Variants

| Axis | Value | Justification | Where |
|---|---|---|---|
| layout | floating (default): QuickTime Player's controller, a two-row glass panel inset over the video | owner round 40; AVKit `floating` | QuickTime, Safari's macOS full screen, Video.js's pill |
| layout | bar: one row along the foot, on a fade | round 39; AVKit inline | Safari inline, Plyr, Vimeo, YouTube |
| layout | minimal: one round play / pause, no track | AVKit minimal | Video.js background, apple.com |
| controls | auto (default): hide when idle · always: stay | round 39 | Kibo's always-visible bar |

Narrow widths are container queries, not variants.

## Anatomy

```
div.area-video-player (role=group, aria-label, tabindex 0; data-started, data-idle; --floating|--bar|--minimal, --auto|--always)
  video.area-video-player__media   (native; <track> children)
  button.area-video-player__start.area-video-player__surface
                                   (round play: before the first play in every layout; minimal's only control)
  div.area-video-player__scrim     (bar only: black 50% → clear, 64 tall)
  div.area-video-player__controls  (after the first play; not in minimal)
    floating (also __surface):
      div.__transport              (three columns: start · centre · end)
        div.__group--start         div.__volume (mute + range, opens 64 on hover / focus)
        div.__group--center        back 15 (.__skip) · play / pause · forward 15 (.__skip)
        div.__group--end           captions (.__optional) · picture in picture (.__optional, where supported) · full screen
      div.__timeline               span.__clock--start (current) · input.__range (seek) · span.__clock (−remaining)
    bar:
      play / pause · input.__range (seek) · span.__clock (current, span.__duration " / total") · div.__volume ·
      captions (.__optional) · picture in picture (.__optional) · full screen
```

Every button is an Area Button (ghost, neutral, md, icon-only) inside an Area Tooltip that names it and shows its key.

## Decisions

| Part | Area | Basis |
|---|---|---|
| frame | the container corner (`radius-container`), as Figure's standalone image, black behind letterboxing; no corner in full screen | Figure (DESIGN_SYSTEM, Image corners; Figure moved to the container corner 2026-10-18); every source |
| scheme | the controls and the round play take Area's dark scheme (`color-scheme: dark`) in every theme | round 45: Apple, QuickTime, Media Chrome, Video.js |
| glass | `bg-surface` at 72% under blur(16px) saturate(150%), an inset white 12% hairline, `shadow-float`; a Material's layers first (overlays group) | round 45 (Apple 72%, Video.js 16); settings collisions fix 2026-10-18 |
| buttons | Button ghost, neutral, md (`control-md`), icon-only, in every layout; plates hover white 12%, pressed 20%, selected 16% | rounds 44, 46, 47 |
| icons | Area's filled cuts (play, pause, skip, volume, captions, picture in picture); full screen `maximize` / `minimize` lines; play the same size as the rest | rounds 45, 47 |
| floating panel | at most 400 wide (100% − 24 below that), 12 above the foot, centred; padding inset − 2 top, inset sides, inset + 6 under (inset = `ui-cluster`); rows 8 apart; corner `radius-control-md` + inset × `radius-concentric` | rounds 40, 43, 44, 47 (glyphs 18 from every edge at type 14, 16 at 13) |
| floating rows | transport: groups 2 apart, play and the skips `gap-md` apart; timeline 16 tall, 8 apart, inset (button − icon) / 2 + 2 | rounds 43, 47; WebKit time-control |
| bar | the row `ui-cluster` from the video's edges, items 2 apart; track and time stand off 6 | round 47 (glyphs 18.4–19 from the edges at 14) |
| scrim | bar only: black 50% to clear, 64 | Video.js 50%, Vidstack 60%; 2 × the row |
| track | the player's own range: 4 rail, `fg-default` played and a plain 12 thumb (always shown, no ring), loaded 35%, rest 20%; no growth on hover | round 46 (Cursor's slider); round 41 (thumb always shown) |
| time | `fg-muted` UI text, regular, tabular; floating: current, then `−remaining` on the right; bar: `m:ss / m:ss` with a 0 1 2 30% black text shadow; `h:mm:ss` past an hour | rounds 42, 44; Video.js, Plyr |
| volume | mute at rest; a 64 range opens beside it (4 before, 8 after) on mouse hover or focus; muted keeps the level in `fg-muted` | round 42; Apple's 60 on the 4 grid; round 41 |
| captions | disabled ("No captions") without a track; `selected` while showing | rounds 42, 47 |
| start | `control-lg` round, the glass, play / pause at `icon-md`; hover adds a white 12% tint | round 44; settings collisions fix |
| idle | hide after 2000 ms while playing; never while paused or with focus inside; cursor hides too; minimal fades its round play | Plyr, Video.js, Vidstack, Media Chrome |
| motion | controls and scrim in on `fast` ease-out, out on `moderate`, opacity only; the volume range opens on `fast` | Media Chrome in faster than out; MOTION.md |
| narrow | floating under 400: one row, play · track · −remaining · full screen, inset all round, the same corner; bar under 400: no volume range, no captions or picture in picture; under 280: no duration | round 40; round 47 (not a pill); Video.js, Vidstack small |
| `controls` | `auto` (hide when idle) or `always` | Kibo's always-visible bar |

- The glass's paint is one recipe, `:where(.area-video-player, .area-attachment)` in `video-player.css`: `--_media-glass-fill` 72%, `-blur` 16px, `-saturate` 150%, `-edge` and `-hover` white 12%, `-selected` 16%, `-press` 20%, and `--_media-ground` black behind letterboxing. It is no theme role: it sits over media in every theme. Attachment reads it.

## Behavior and accessibility

Keys (on the player or a control): Space / K play, ← → 5 s, J / L 10 s, ↑ ↓ volume 5%, M mute, F full screen, C captions,
I picture in picture, 0–9 a tenth of the way, Home / End; a focused range keeps its own arrows and a focused button its
Space. Click the video to play or pause, double-click for full screen (not in minimal). The seek range reads "1 minute 12
seconds of 4 minutes 3 seconds"; the remaining time reads "… remaining"; volume reads "60% volume" ("Muted, 60% volume"
while muted). Buttons name their action (Play / Pause, Back / Forward 10 seconds (the same 10 as J and L; owner, 2026-10-19), Mute / Unmute, Captions with
`aria-pressed`, Picture in picture / Exit picture in picture, Full screen / Exit full screen); each has a Tooltip with its
name and key (`describes={false}`: the label already names it). The root group is itself a Tab stop (`tabIndex` 0) so its
keys work before any control has focus; before the first play the round play is the only other stop.

## Not built yet

Settings (speed, caption track) in a Menu; the hover time over the scrubber; buffering Spinner; ended / replay state;
captures of Notion's video block and Loom.

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

## Round 43, 2026-10-18

Owner, round 42: "the padding seems to be too small around the bottom slider"; then "the inset in general is not very
even, make sure the margins, padding, gaps, etc are all correct". Measured on the drawn glyphs (svg paths; text from its
font metrics) in headless Edge:

| Edge to ink | Round 42 | Round 43 |
|---|---|---|
| left (mute icon / time) | 22 / 12 | 16 / 16 |
| right (full screen icon / time) | 22.5 / 12 | 16 / 16 |
| top (16 icons; play 20) | 15.9; 13 | 15.9; 13 |
| bottom (time digits) | 11.8 | 15.8 |
| row one's icons to the time | 21 | ≈ 16 |

How: the panel pads 6 at the sides, 4 on top and 12 under; the time row adds the buttons' inset back
(`(button − icon) / 2 + 2`); no gap between the rows, since the 32 transport row already leaves 8 under its icons. 64 tall.
Back 15 and forward 15 sit 36 either side of play. Play is the larger glyph (20), centred on the row, so its ink comes 3
nearer the top, as Apple's does. The bar (14.4–15 from the video's edges) and the narrow pill (14.4–15 on every side) were
already even. The slider stays the player's own part (owner: "keep it as is").

## Review note, 2026-10-18 (round 43)

- **What changed:** Every edge of the controller now has the same space to its icons and text (16), the time lines up
  with the icons above it, and the space between the two rows matches the space around them.
- **Why:** You found the padding uneven, especially around the progress bar. Measured, the icons sat 22 from the sides
  while the time sat 12, and the bottom had only 12; now every side is 16.

## Round 44, 2026-10-18

Owner, round 43: "the corner radius and icons, and material/fill/stroke/, etc should be applied from the area design system
principles, i like the layout, but want everything to feel like its part of the other area components. also remove the
zooming image just keep it static." The layout stays; the paint is Area's own parts:

| Part | Was (round 43) | Now | Basis |
|---|---|---|---|
| panel fill / stroke / shadow | black 55%, blur 16, a white top line, black 10% ring | `bg-surface`, `shadow-edge`, `border-float` ring, `shadow-float` | the surface Toolbar (toolbar.css `--surface`) |
| corner | 16 | the control corner + the inset, concentric (`radius-control-md` + `ui-cluster` × `radius-concentric`) | the surface Toolbar's rule |
| material | none | the overlays group (Glass: 67% see-through, blur 24, saturate 137.5%, as Menu and Popover) | material.css; checked with Glass in the app |
| theme | always dark | follows light and dark | Area surfaces |
| buttons | the player's own white buttons | Button ghost, neutral, md, icon-only (hover, press, selected, focus); play the same size | Button; Toolbar's buttons |
| icons | solid play, pause, skip | Area's outline icons | the icon set's line style |
| time | white 90% | `fg-muted`, UI text, tabular | Area's secondary text |
| track / thumb | white rail, 12 white thumb | Slider's: `edge-control` rail, `selection-solid` fill, the 16 thumb (surface, `edge-control-hover` ring, the fill's dot, `shadow-control`); loaded `edge-control-hover` | slider.css |
| round play | black 50% | the same surface, `control-lg` | the panel |
| inset | 16 | 18 at type 14 on every side and between the rows (16 at the app's 13), remeasured on the glyphs | round 43's method |

The bar keeps its white on-media buttons over the scrim (it has no surface). The sample clip is now the avatar photo still,
8 s, no zoom.

## Review note, 2026-10-18 (round 44)

- **What changed:** The controller is now built from Area's own parts: the floating Toolbar's surface and corners, Area's
  ghost buttons and outline icons, Slider's track and thumb, and muted time text. It follows light and dark and the
  Inspector's Material (Glass makes it see-through like a Menu). The sample image no longer zooms.
- **Why:** You liked the layout but wanted it to feel like the rest of Area. Every colour, corner, stroke and icon now
  comes from a component Area already has, and the spacing is even again on every side.

## Round 45, 2026-10-18

Owner, round 44: "you can use filled icons, and also use a darker transparent fill? what do you recommend? i think in design
systems, its common to use a dark fill even with some blur? and maybe a transparent stroke? even if the rest of the design
system is neutral white, gray." Recommended and done:
- **Dark in every theme.** Controls over video stay dark whatever the app's theme (Apple #2a2a2d at 72% with blur 7,
  QuickTime black 55% with blur 17.5, Media Chrome black 75%, Video.js; round-42 captures): video can be bright or dark, and
  white glyphs on dark glass read on both. The surface sets `color-scheme: dark`, so every Area token inside it (surface,
  ink, ghost Buttons, Slider) takes its dark value: still Area's paint, one scheme.
- **Transparent fill with blur.** Area's dark surface at 72% (Apple's) under blur(16px) saturate(150%) (Video.js 16;
  between Apple's 180% and Glass's 137.5%). Material still layers over it (the overlays group).
- **Transparent stroke.** A white 12% hairline in place of the float edge, and the float shadow.
- **Filled icons.** Play, pause and skip solid; the speaker's body filled with its waves as lines and picture in picture's
  inner window filled ("Filled = body only"); captions a knockout; full screen stays a line (no filled form). The component
  glyph generator gains a "body" paint for this. The bar keeps its line icons.

## Review note, 2026-10-18 (round 45)

- **What changed:** The controller is a dark see-through glass in both light and dark mode, with a faint white edge, and
  its icons are filled.
- **Why:** You suggested it, and it's what video players do: Apple, QuickTime, Media Chrome and Video.js keep controls
  dark over video in any theme so they read on bright and dark frames. Everything inside still uses Area's own colours,
  just its dark set.

## Round 46, 2026-10-18

Owner, on the narrow pill: "the backplates for the whole thing and the play button should match"; then "i also dont like
the slider design here, does it have to use this slider or can it be a new design? i kind of like this slider from cursors
icon library where its just a solid shape, but in this case i would want the track to be filled on the left side".
- **Plates match the glass.** The dark scheme's ghost hover is an opaque grey, which showed as a dark tile on the
  see-through panel. On the surface a ghost Button's hover is white 12% (the panel's stroke), press white 20% (Vidstack's
  hover), selected white 16%: lighter patches of the same glass.
- **A solid-shape track.** The player's track is its own part (not Slider), so it takes Cursor's shape: a thin rail and a
  plain solid round thumb, no ring, dot or shadow, with the played part filled in the thumb's ink. Played and thumb in the
  surface's text ink (white in its dark scheme), loaded 35%, rail 20%; thumb 12, always shown; track 4. Material no
  longer paints the thumb (it was Slider's primary-group hook).

## Review note, 2026-10-18 (round 46)

- **What changed:** Button highlights on the controller are now light see-through tints of the glass instead of dark
  tiles, and the progress and volume bars are a simple solid shape: a thin track filled up to a plain round dot.
- **Why:** You wanted the play button's backplate to match the panel and preferred Cursor's solid slider, with the
  played part filled.

## Round 47, 2026-10-18

Owner, round 46: "for layout bar, the icons should still be filled? or the play button should be filled at least. why is
the cc button grayed out. make sure all the type styles and all the gaps, padding and margins are correct for all variants,
the floating panel looks like it might need more gaps between the top row and bottom row but look into it. also the cc
icon looks pretty small compared to the other icons. also for the layout/narrow, should the backplate be pill shaped? if so
then the play button should be pill shaped but i think it should be rounded corner values that match the other components
in the ds."
- **One set of parts in every layout.** The bar now uses the same Area ghost Buttons, filled icons, glass plates, dark
  scheme, solid track, muted time and glass round play as the floating layouts; the stylesheet was rewritten around the
  shared parts (video-player.css header).
- **CC was grey** because the sample had no captions track, so the button was disabled (round 42's rule). The demos now
  carry an English track (`images/sample-captions.vtt`, two generic cues); CC is on offer in the app. (The review page
  runs no player script, so it still shows the disabled state.)
- **CC icon.** Its box was 12 × 9, under the 14 × 11 keyline of wide icons, and the filled form cut small Cs from it.
  Captions grows to 13 × 10 (rx 2.5) with the Cs centred. Captions-off keeps the old box: the larger frame left a 2.38 gap
  to its letters, between the gap scale's steps; an icon session should redraw that pair together. The 12 × 9 box is
  shared with mail, the cards and the panels, which keep it.
- **Rows.** Safari's rows stand about 1.8 × its edge apart (22 vs 12). The floating panel's row gap goes from 2 to 8:
  about 25 between the transport's icons and the time against 17–18 at the edges (1.4 ×).
- **Narrow corners.** The narrow panel keeps the surface Toolbar's corner (the control corner + inset, 16 at type 14), as
  the wide panel and every Area surface, not a pill; play keeps Button's corner.
- **Measured (glyphs, type 14):** floating 18 / 18 / 16.4–17.9 / 17.8 (L / R / T / B); narrow 18.4–19 on every side;
  bar 18.4–19 from the video's edges.

## Review note, 2026-10-18 (round 47)

- **What changed:** The bar layout now uses the same filled icons, buttons, slider and glass as the others; CC works
  (the sample has captions now); the CC icon is bigger; the floating panel has more room between its two rows; the narrow
  panel has the same rounded corners as the rest of Area instead of a pill.
- **Why:** You asked for filled icons in the bar, why CC was grey (no captions track), for a CC icon that matches its
  neighbours, more space between the rows (Safari leaves about twice its edge), and Area's corners for the narrow panel.

## Settings collisions fixed (2026-10-18)

Elevation and Stroke audit (docs/research/elevation-stroke-2026-10-18, "Audit: Area today"): under a Material the controller and the round play lost the 12% white inset ring (material.css replaced the
whole `box-shadow`, and won over the round play's hover). Both now list the material's layers first
(`var(--_m-layers, 0 0 0 0 transparent)`) beside their own ring and float lift, so a material adds to them rather
than replacing them. Unchanged with no material. Checked in the app with None and Glass.
- 2026-10-19 · design-system audit (owner: "audit them based on the new docs, skills, guidelines") → the frame takes
  `radius-container` (Figure's standalone image moved there 2026-10-18; it was still Figure's old `radius-small`); the
  volume slider's room opens at once and only its opacity animates (MOTION.md Crispness 2; was a width transition); the
  round play's hover plate leaves on `fast`; the thumb's focus ring takes `focus-offset`; blur, panel and volume widths
  are named `--_*` spec values. Demo caption "Caption".

## Review note, 2026-10-19 (round 55, design-system audit)

- **What changed:** The video's corner is 12, the container corner, the same as a Figure's image (it was 6). The volume slider's room opens at once and only the slider fades in; the round play's hover leaves on fast; the slider's focus ring uses the standard offset.
- **Why:** Figure moved to the container corner on 2026-10-18 and the player still used the old thumbnail corner; MOTION.md animates only opacity and transform.

## Round 56: the bar after YouTube's controls (2026-10-19)

Owner, round 55: "can you also look at and consider youtubes video player controls? maybe thats more appropriate."
YouTube's 2025 controls, measured (docs/research/video-player-youtube-2026-10-19.md): no fade; the track across the
width 12 in from the sides; under it a row of plates (a round play, a volume pill that opens sideways, a time pill, and
one pill for the rest at the end), 8 above the foot. `bar` is rebuilt on that model and becomes the default:

| Part | Area | Basis |
|---|---|---|
| controls | a column 12 in from the sides (`--_edge`), 8 above the foot (`--_foot`); the track, then the row, 8 apart | YouTube 12 / 8 / 9 |
| pills | Area's glass (the floating panel's surface: dark surface 72%, blur, white 12% hairline, float shadow), `control-md` tall, round; the buttons inside take the pill's corner | YouTube's black 30% plates, Area's material |
| start | play alone; mute with its slider (opens sideways); the time, 12 in, the duration muted | YouTube |
| end | captions, picture in picture, full screen in one pill | YouTube (autoplay, settings and theater have no Area counterpart) |
| track | unchanged: the 4 rail in the text ink with a 12 thumb | round 46 |
| narrow | under 400 the volume slider and the optional buttons drop; under 280 the duration | as before |

The scrim (the bar's fade) is removed with its part. `floating` (QuickTime's panel, rounds 40–47) and `minimal` stay.

## Review note, 2026-10-19 (round 56)

- **What changed:** the default controls are now YouTube's: the track runs across the bottom, and the buttons sit
  under it in small glass pills (play, volume, the time, and one pill for captions, picture in picture and full
  screen). There is no dark fade. The QuickTime-style floating panel is still there as `layout="floating"`.
- **Why:** you asked to consider YouTube's controls. Its controls leave the video clear between groups and keep the
  track full width, which reads better than a centred panel over the picture; Area's glass and buttons keep it in the
  system.

## Review note, 2026-10-19 (round 57)

- **What changed:** The round play button before the first play is round again, at its own size.
- **Why:** You flagged the default tile's play button: the new bar's pill rule also caught the round play (it shares the glass), squashing it to a control's height. The pill rule now applies only inside the controls.

## Review note, 2026-10-29 (visual pass, rounds 86–89: the time's space)

- **What changed:** the time pill reads "0:01 / 0:07" with a space either side of the slash.
- **Why:** the duration is a flex item in the pill, and a flex item drops its leading space, so it read "0:01/ 0:07".
- **Verdict:** changes (owner, 2026-10-29): "should these be pill shaped or just rounded corners?" Answered with rounded
  corners: the bar's groups (play, mute, the time, the end group) took `radius-full` always, while the floating panel
  takes the control corner and every Button follows Radius and turns pill only under the Pills setting. They now take
  `radius-control-md` plus the Pills setting (`--area-pill-button`); the round play before the first play stays a circle
  (its shape role). In review.
- **Verdict (rounded corners):** approved (owner, 2026-10-29, the Composer expansion review page); Complete.

### 2026-11-13 · Frame recipe (system plan, Phase 2, B1.1)

- The corner reads the frame recipe's block corner (`surface.css`), `radius-container`: no visual change.

### 2026-11-14 · Shared parts, leftovers (system plan, Phase 2, wave 3)

- The controls' gaps (rows, the time, the floating row, the bar's groups and transport, the volume range's end) are `ui-cluster` (6 / 8 / 10); the clock pill's side is the mark side rule on its height, `(control-md − 6) / 2` (10 / 12 / 14; 15 / 15 / 17 at type 16). Values at type 13 Compact / Default / Comfortable; unchanged at the default.
- A pill is one value: while the Pills set rounds it, its corner is `radius-full` itself, `max(corner, flag × full)`, never the corner plus full (it computed 10003px at the default). Draws the same; the corners snapshot records 9999px.
- Why: docs/research/system-evaluation-2026-11-11 (plan B6.1, B6.5, B8.2, B2.2; README §5, phase2/leftovers.md); the owner took every recommendation on 2026-11-11. Fix the rule, not the instance.
- Verdict: awaiting the owner.

## State paint (plan B7.2, B7.3), 2026-11-14

- The start button presses to the glass at 20%, as the controls; an on control presses to 20% (was its 16%).

## System status step C, 2026-11-18 (shared sources)

Media glass became one shared recipe, so the white tints and #000 are written once; `state-paint.test.mjs` no longer lists this sheet as pending. Nothing moved.
