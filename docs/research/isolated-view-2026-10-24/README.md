# Isolated view: Bencho evaluation and playground brainstorm (2026-10-24)

Research and brainstorm only (owner, 2026-10-24: "just brainstorm and research for now"). Nothing here is built.
The owner's ask: click any visual card (component, icon, glyph, figure, colour, type, image) and open it
isolated, "almost like a mini isolated vector playground": a large viewport you can zoom in and out of, with
controls, the Inspector's Chat for edits, and previous iterations and explorations. Plus: evaluate bencho.dev as a
whole for what Area should take.

## 0. The Components cards' Copy button (bug, found while checking)

Copy is still rendered on every Components card, but it never becomes visible.

- PR #160 (`d3eed586`, merged 2026-10-24) made **Basic, name on hover** (`caption: "overlay"`) the Components
  default, after the owner's "the text and copy button can be hidden on hover for everything". Before it, the default
  was Framed, with Copy always visible in the head.
- In `packages/styles/src/components/asset-card.css` the shared rule that hides the corner controls,
  `.area-asset-card:is(--below, --overlay) > __head > __actions { opacity: 0 }` (line 260, specificity 0,4,0),
  outranks overlay's own `.area-asset-card--overlay > __head > __actions { opacity: 1 }` (line 296, 0,3,0). Overlay
  shows the head on hover, but the controls inside it stay at opacity 0.
- Checked in the app (browser preview, 1440 wide): hovering the Button card, the head is at opacity 1 and the actions
  at 0. The button is still there, named and clickable: it is invisible, not gone.
- Only Components is affected. Typography, Imagery and Color draw their own Copy and have no overlay card with
  actions.
- The fix belongs in Asset card (one selector of the same weight, e.g. `.area-asset-card.area-asset-card--overlay`),
  with a cohesion test asserting that a hovered overlay card's actions compute to opacity 1, per
  "fix the rule, not the instance".

## 1. Bencho, measured

Read 2026-10-24 in the built-in browser at 1440 × 900, light and dark, with `getComputedStyle` and the page's own
stylesheet rules. **These aren't `area-capture.js` captures**: re-capture with it before any value enters a spec.

### Gallery ("wall")

| Part | Value |
|---|---|
| Layout | Masonry: 3 flex columns, 12 gap both ways, the cards at their own heights (no fixed aspect); the last card in each column grows so the columns end level |
| Card | radius 28, fill `rgba(ink, .06)` (ink #17181a), no edge at rest, `overflow: hidden`; the specimen is scaled to fit (`.bench-card-scale`, centred, or floor-anchored for things that sit on a floor) |
| Name | Hidden at rest. On hover a veil rises: opacity .2s plus `translateY(4px → 0)` over .26s `cubic-bezier(.28, 1.3, .36, 1)` (an overshoot); a 38-tall pill of 94% white, 12.5px, 14 from the edges |
| Corner controls | Save and Copy are 36 round ghost buttons at top-right (10 in), Open and "Show me how" are 38 white pills at bottom-right (14 in), all opacity 0 until the card is hovered or focused |
| Icon-button feel | The hover plate fades in and scales .86 → 1 over .26s `cubic-bezier(.3, 1.12, .4, 1)`; the glyph scales 1.04 on hover and .96 on press (90ms); Open scales .95 on hover and .9 on press |
| Entrance | `wall-rise`: opacity 0 → 1 and translateY 16 → 0 over .7s `cubic-bezier(.22, 1, .36, 1)`, staggered 70ms a card, capped at 9 cards (so nothing waits longer than .63s); it replays when a filter changes |
| Offscreen | `.bench-card[data-off]` pauses every animation inside a card that has scrolled out of view |
| Filters | Text chips, 34 tall, with a 2px underline when on; the row fades at its ends with a mask while it overflows (the same mask on the detail's control list) |
| Reduced motion | Every rise, transition and pulse is cut to 1ms or none |

### The isolated view ("detail", `?c=<slug>`)

| Part | Value |
|---|---|
| Structure | A fixed overlay: a scrim of 78% page colour with `blur(22px) saturate(130%)`, then a 1000 × 640 max shell inset 24, holding the **block** (stage, 688 wide) and the **side** (300 wide, 12 gap) |
| Opening | **The card morphs into the stage**: the block's left/top/width/height transition from the card's rect to the stage's over `--morph: 380ms` with `cubic-bezier(.33, .55, .2, 1)` (sampled every 40ms: 459×300 at the card → 688×640 at 380ms). The scrim fades over 260ms. The side fades in and slides 10px from the end over 280ms, 60ms late. The specimen fades in at `--reveal` (40% of the morph) and scales to 1.25× |
| Stage tools | Top-left: a Preview / Code segmented control (38 × 30 segments). Top-right: Save and Sound. Bottom-right: "Show me how", a scripted ghost cursor that performs the interaction (it pressed + three times on Rolling counter) |
| Side | Title 17/500; a one-line "how to use it" (13, muted); controls in rows 44 tall: segmented controls for enums (Fill Light/Dark, Stroke Off/On, Step 5/15/30) and **fill-bar sliders** for numbers (44 tall, radius 10, a 5% track, a 12% fill, label at the start, value at the end, `ew-resize`; a hidden native range input carries the keys and the name); footer: Share (copies a link) and "Add to bench" |
| Dark | Near-black page; cards on a dark solid; a dark block gets a 1px dot grid (`radial-gradient` at 6% white) |
| Closing | Escape, the ×, or the scrim; the URL goes back to `/` |

### Bench (`/bench`)

A pan-and-zoom canvas of saved blocks, live and still interactive: zoom control at top-right (− 85% + and fit),
blocks on white plates (radius 20, padding 30) with a 1.5px ring 8 outside that darkens on hover and turns blue when
picked, grab to move, a staggered drift-in. It is the nearest thing on the site to "previous iterations and
explorations".

## 2. What is worth bringing into Area

Area's motion rules (MOTION.md) are quiet: nothing bounces, hover appears at once, no press scale by default.
Bencho is more tactile. "Every detail a choice" and "keep options, show effect" say the tactile version should be a
**setting value**, not a new default, wherever it touches components.

| Bencho | Verdict | In Area |
|---|---|---|
| Card → stage morph | **Adopt** (the most valuable thing on the site) | The Asset card's frame morphs into the isolated view's viewport and back. A move across the screen while visible, so `ease-in-out` on `duration-slow` (350 at the default; Bencho's 380 sits between slow at 210 and at 240). Use the View Transitions API (Electron's Chromium has same-document `startViewTransition`), so the card and the viewport share one `view-transition-name` and the browser does the rect and radius tween. The Inspector stays put; only the Canvas content morphs. Reduced motion and Motion 0 cut it |
| Specimen fades in late in the morph and scales up | **Adopt** | The specimen crossfades at about 40% of the morph and lands at the viewport's zoom on whole pixels (MOTION crispness: a scaled preview is the one exception while moving, never at rest) |
| Side panel fades and slides in, 60ms late | **Adapt** | Area's Inspector is always there, so nothing slides in. Its sections swap from the family's facts to the object's controls with a crossfade on `fast` |
| Staggered rise on load and filter | **Adapt, as a setting** | Quiet by default: none, or opacity only. A "Gallery entrance" value (rise 16, 70ms stagger, cap 9) for the owner to try. Never on scroll |
| Pause offscreen animations | **Adopt, no visual change** | An IntersectionObserver sets `data-offscreen` on gallery tiles and pauses their animations; it helps Video player, Spinner, Skeleton and the abstract board's 116 live specimens |
| Name veil rising 4px with overshoot | **Partly** | Area's overlay name already fades in (PR #160). The 4px rise could join it under the Spring easing value, which already exists, and stays flat under Standard |
| Plate scale .86 → 1 and glyph 1.04 / .96 | **As a setting** | A new "Press feel" value (Flat, the default; Tactile: plate scale-in, glyph press .96). It goes through `area-foundation-change`, because Button, Icon button and every ghost control would take it |
| "Show me how" ghost cursor | **Adopt for the isolated view** | Per-playground scripted demos (pointer path, presses, typing) on Replay's button, so a Slider, Swipe row or Calendar shows its interaction without being touched. The demo script lives beside the playground |
| Fill-bar sliders and segmented controls in the side | **Already built** | Area's Inspector has them (PR #159). This confirms the direction |
| Deep link to a block | **Already there** | `#components/<slug>`. Extend it to every tab: `#icons/<name>`, `#color/<token>`, `#typography/<style>` |
| Overflow fade masks on scrolling rows and panels | **Adopt as a rule** | One mask utility for horizontally scrolling chips and the Inspector's scrolling body (the masks follow `data-over` start / end / both) |
| Masonry at the specimen's own height | **Option** | A "Hug" proportion beside Landscape and Square for Components (Asset card already has `aspect: "hug"`) |
| Dot grid on the dark stage | **Adopt in the isolated view** | One of the viewport's backgrounds (below) |
| Blurred modal scrim over the gallery | **Skip** | Area is an app, not a site: the isolated view lives in the Canvas, and the Titlebar, Sidebar and Inspector stay usable |
| Sounds, Sponsored, marketing hero, pills everywhere | **Skip** | Not Area's character (ChatGPT, Notion, Figma), though sound could later be a setting |

## 3. The isolated playground: brainstorm

### What opens it

Any visual card on any tab: a component tile, an icon on the wall, a glyph, a figure (area-illustration), a
colour card, a type specimen, an image. One click on the card (outside its controls), Enter on a focused card, or
Space for a quick look. All of these are Asset cards already, so the morph and the route belong to Asset card's
`onOpen` once, not to each tab.

### Layout (owner's references: Figma's inspector, the assembly viewer, the node editor)

```
┌ Titlebar ──────────────────────────────────────────────────────────────┐
│ Sidebar │ ┌ viewport toolbar (floating, top-centre) ──────┐  │ Inspector │
│ (can    │ │ ← Back · name · 100% ▾ · fit · bg · compare   │  │ Design    │
│ collapse│ └───────────────────────────────────────────────┘  │ Code      │
│ to give │                                                     │ Chat      │
│ room)   │              the one object, zoomable               │ History   │
│         │                                                     │           │
│         │ ┌ filmstrip: iterations and explorations ─────────┐ │           │
│         │ │ v1 · v2 · v3 ●  │  explore A · explore B  + │ │           │
│         │ └──────────────────────────────────────────────────┘ │           │
└─────────┴─────────────────────────────────────────────────────┴───────────┘
```

- **The viewport is the Canvas, edge to edge**, with no frame inside a frame. The Sidebar can collapse (the Titlebar's
  sidebar toggle) to give it the room Figma gives its canvas.
- **One object, not an infinite canvas.** Zoom and pan are bounded so the object can't be lost: below "fit" it
  centres, and panning stops at the object plus a margin.
- **Filmstrip at the bottom**, like the assembly viewer's step strip: every saved state as a thumbnail, current
  marked, explorations grouped to the right. It can collapse to a thin bar.

### Viewing (how it is seen)

- **Zoom**: pinch, ⌘ + scroll (around the pointer), the toolbar's percentage menu, and Figma's keys (Shift 0 = 100%,
  Shift 1 = fit, + / −). Every resting zoom lands on whole pixels; `zoom` or a re-render at the new scale rather than
  a CSS `transform` at rest, so text and strokes stay crisp (MOTION crispness).
- **Pixel and construction overlays** once zoomed in: the pixel grid; for icons the 24 grid, keylines and live area
  (the area-icon-construction checks drawn on); for components the inset overlay (border + shell padding + slot
  inset, from inset.css), the spacing between parts with values, and the first-line alignment. This is the
  "measure overlay" the 2026-10-12 Stage research recommended and didn't build.
- **Backgrounds**: the Canvas ground, white or black, a checkerboard (for transparency and imagery), a dot grid, and
  **light and dark side by side**, the same object twice in one viewport.
- **Size readout and resize**: the Stage's existing drag-to-width handle carries over, with presets (phone 320, the
  Inspector width, a dialog).
- **Live, always**: the specimen stays interactive (hover, press, type), with Replay and a "Show me how" demo.

### Editing (what it renders)

- **Design** (the Inspector's tab): the object's Properties, from its manifest (Storybook argTypes, Figma's variant
  properties), segmented controls for enums, fill-bar sliders for numbers, switches for flags; for an icon its
  stroke, size cut, filled / outline and optical tweaks; for a colour its scale step and roles; for a figure its
  screen recipe and settings.
- **Settings scoped to the object**: preview any system setting (radius, density, type, motion) on this object
  alone, without changing the Canvas. Area already scopes settings per card (`CARD_SCOPE`), so this is the same hook.
- **Chat**, scoped: the context chip is the object (the Chat view already shows the Canvas selection as a chip).
  Two kinds of edit, kept apart:
  - **Try**: a draft, held only in the playground (property values, scoped token overrides, a CSS patch applied to
    this one viewport). It costs nothing, can be undone instantly and appears in the filmstrip as an exploration.
  - **Apply**: a real edit to the component's source (CSS, manifest, React, demos, spec), as Chat's Edit summary
    with Keep / Undo, which Phase 3 (the Agent SDK in Electron) makes real. "Feedback on app UI changes the real
    component" holds: a try becomes real only by being applied to the component, never by staying app-only CSS.
- **Code**: the configured instance's code (already generated with only non-default props), plus the diff of the
  current exploration against the base.

### Iterations and explorations (the History tab and filmstrip)

- Every **apply** is an iteration (v1, v2…), with its chat turn, its diff, a thumbnail and a timestamp. Restoring one
  is an undo of later applies.
- Every **try** is an exploration: branch from any iteration, name it, keep several. A chat prompt like "try three
  tighter versions" makes three explorations at once.
- **Compare**: pick two items in the filmstrip and see them side by side, over and under with a wipe (Bencho's
  Image compare), or as an onion skin; with the property and token differences listed.
- **Promote**: turning an exploration into a variant, prop or setting goes through `area-component-intake` first,
  so the playground can't grow aliases or duplicate axes.
- Storage: explorations in the app's local data (they're drafts); applied iterations are the git history of the
  component's files, so the History tab can read past versions with `git log` on those paths.

### Motion

| Moment | Recipe |
|---|---|
| Open | The card's frame morphs into the viewport (`slow`, ease-in-out, view transition); the other cards fade out on `fast`; the specimen crossfades at 40% and lands at fit |
| Close (Escape, Back, ⌘[) | Reverse on `moderate` (exits one step faster), into the card it came from, selected and scrolled into view (as the Stage does today) |
| Next / previous object (the Canvas bar's previous / next) | Crossfade in place on `base`, no morph |
| Zoom by key | `base` ease-out to the new zoom, then snap to whole pixels; pinch and wheel follow the input with no easing |
| New iteration | The filmstrip item fades in on `fast`; the viewport crossfades old → new on `base`, so the change is visible |
| Show me how | The ghost pointer moves on `ease-in-out` paths at a human pace |

## 4. Where it fits in today's app

- The **Stage** (`apps/desktop/src/stage.tsx`) is the isolated view for Components only: the tile at real size with
  its code under it and the family's tiles below, inside a family tab. The playground would be the Stage grown up:
  the viewport replaces the Stage frame, the family's tiles move to the filmstrip, and the code moves to the Code
  tab. It needs a decision on whether Overview keeps today's long page or becomes the playground.
- **Playgrounds** exist for 11 families (`content/playgrounds.tsx`), so most families still have no Properties. The
  playground is only as good as its controls, so filling these in is part of the work.
- **Chat** is Phase 2 (a recorded run). Try and Apply need Phase 3 (the real engine).
- **Other tabs** (Icons, Color, Typography, Imagery) have their own cards and hover cards; each needs its kind of
  Design controls and overlays.

## 5. Suggested order

1. Fix the hidden Copy (section 0).
2. The card → viewport morph and the route, for Components first, with today's Stage content.
3. The viewport: zoom, fit, pan, backgrounds, light and dark side by side.
4. The overlays: the pixel grid, the icon grid and keylines, the inset and spacing measurement.
5. Open from every tab (icons, colours, type, figures, images), each with its Design controls.
6. History: explorations (try) in the filmstrip, compare.
7. Chat Phase 3: apply as iterations with Keep / Undo.
8. The settings proposals (Gallery entrance, Press feel), through `area-foundation-change`, if the owner wants them.

## 6. Open questions for the owner

1. Should the playground replace the family's Overview tab, or be a separate mode that Overview opens?
2. Should the Sidebar collapse automatically when the playground opens, or stay?
3. Should "try" explorations persist across app restarts, or only for the session?
4. Should Area adopt the tactile feel (plate scale-in, press scale) as a setting value at all?
5. Should the gallery cards keep the fixed landscape shape, or try a masonry "Hug" option?
