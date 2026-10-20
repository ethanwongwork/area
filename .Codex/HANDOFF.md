# Handoff

## Current state (2026-10-19)

- **Status.** `main` is at PR #139. Asset card is the only family in review; the other 115 are
  Complete (`apps/desktop/src/content/component-status.mjs`).
- **Sessions.** One session at a time. Each starts from `origin/main` in its own worktree
  (`claude/*`) and merges through a PR. Check open PRs first.
- **Running the app.** `npm run dev` runs Electron and `npm run preview` adds
  http://localhost:4400 (check who holds the port first). Icons are in the app's Icons tab.
- **Docs.** Restructured on branch `claude/design-system-docs-da9a6a`:
  - new `docs/PRINCIPLES.md`, `GOVERNANCE.md` and `ARCHITECTURE.md`;
  - `DESIGN_SYSTEM.md`, `THEMING.md`, `COMPONENTS.md` and `DEVELOPMENT.md` rewritten;
  - every family has a Documentation entry (`apps/desktop/src/content/documentation/`,
    checked by `npm run check:docs -w @area/desktop`, also in CI);
  - new skills `area-component-intake`, `area-component-docs` and
    `area-foundation-change`;
  - the icon skill split into references.
  - About 50 specs' current-state sections are reconciled with the code, and spec Status
    lines are removed (status lives only in the registry). Stale `pages.mjs` notes and code
    comments are fixed.
- **Applied.** The owner's verdicts from the review page (https://claude.ai/artifact/Kbw21Vq97U6PRMtSniHWkv) are applied:
  - all 9 recommendations, recorded as 2026-10-19 decisions in the specs:
    - menus open on their checked row;
    - video skips are 10 s;
    - a timestamp only before a person's message, an hour after any turn;
    - Infobox image at the container corner;
    - Titlebar 41 superseded;
    - Progress `label` kept;
    - Context menu `menuLabel` recorded;
    - ChipLink follows Pills;
    - Combobox `variant` typed, a written exception.
  - 8 accessibility fixes kept.
  - The astra-6 worktree's leftovers discarded; a patch is kept in `.git-stray-refs-backup-2026-10-14/`.
- **Open.**
  - Agent chat Phase 3 (the engine) is not started.
  - Material bundles are named presets, which conflicts with "no named looks"; ask before
    changing them.
- **Rule for this file.** This section stays under 40 lines and is rewritten, not appended.
  Entries below are history, newest first.

## Language tab from the axes (2026-10-19, same branch, uncommitted)

Owner: align the Language tab with the theming axes, a cohesive name, axes as the source of truth, and Stroke and
Shadow visuals tailored to each variable. The tab stays **Language** (owner: "i prefer language"; Theme tried and dropped).
`SETTING_GROUPS`, `SCOPED_SETTINGS` and `settingLabel` in `packages/tokens/src/axes/registry.ts` (emitted in config) own
every setting's heading, order and name; axis labels renamed (Mode, Stroke strength, Floating shadow, Resting shadow,
Shadow softness, Shadow light). The Inspector (canvas-settings.tsx, gallery/controls.ts) and the Language tab read them;
the Language tab's Sidebar has the Inspector's headings, its Inspector shows the tokens a preset writes and what a preview holds
fixed. Stroke and Shadow tiles show the whole real component (card, card + field, field + button, menu) centred at 1.25–1.5x
on the page ground (abstract.tsx CloseUp), other strokes and shadows off, the shared shadow controls on Floating 8;
Neutral draws on the window with layers 8. A pixel audit (scratchpad audit3.mjs) found: every shadow invisible in dark
(black on a near-black page), Neutral's tint at most 5/255 in light, Resting faint even at 8 (a 4% shadow). Fixed: Shadow
light hid in Dark (matched the per-theme pattern). Open: Shadow colour's Warm and Cool stay subtle (their tint is small
by design); Resting and Rest shadow are faint because they are. Checks: tokens 24272, React 501, desktop 5, contracts,
typecheck, manifest; headless Edge captures. The Inspector's Theme view is now **Language** too (id `theme`
kept), so the tab and the Inspector use one word.

## Abstract board rebuild (2026-10-19, same branch, uncommitted)

Owner: recreate the Pinterest board oval / abstract (27 pins; #22 a blank video thumbnail, skipped), then: "treat these
images as images ... reconstruct the layout and composition as close as possible", no unnecessary variants. Testing →
Abstract board (`apps/desktop/src/content/examples/abstract-board.tsx`) now renders 26 scenes
(`examples/abstract/scenes-a|b|c.tsx`, `scene.tsx`): each is the reference's exact frame at the zoom where its controls
land on Area's sizes (`box(zoom)` places measured reference px; Scene sets `--z` so `.sc-*` CSS in studio.css writes
`calc(Npx / var(--z))`), built from Area components under scoped settings (ground, type, density, accent, pills,
Material, nested grounds), with pictures drawn (map traced from the shot, photos as sampled bands marked spec). Each was
compared ref | Area | overlay in headless Edge (scratchpad pieces.mjs, compare.py) and refined. 17 spans two board columns.
Review: https://claude.ai/artifact/AmNsfSyEZWy8w9Wy8SoR1G (version 2, wipe slider per piece): 5 match, 36 gaps in four
themes (drawn for want of a component, missing slot/option, colour and material, type). References live in the
session scratchpad only, never the repo.

## Dark shadows visible; Language readouts removed (2026-10-19, same branch, uncommitted)

Owner: "make the shadow settings visible in dark mode on the near-black page". Every shadow role gains a dark rim
(axes/depth.ts `rim`, slot 2 of now nine): `0 0 0 1px` white at the role's own step × 2, to 16%, transparent in light
(Radix's dark light edge 17%, Fluent's 9.4% top, Raycast's ring; research elevation-stroke-2026-10-18 finding 7).
Dark Floating / Resting / Field now measure 20–41/255 first-to-last (were 0–3); Shadow size still invisible in dark (a
rim shows strength, not reach). cohesion.test.mjs: nine slots and a rim assertion. Light unchanged by construction.
Then the owner: "i dont want to see any information visible on each card container, just the isolated visual" → the
Language readouts are removed (the tile's name stays; ask whether it should go too).

## Easing setting (2026-10-19, same branch, uncommitted)

Owner: "add an easing setting (Standard, Snappy, Gentle, Spring) beside the duration, following the foundation-change
process". New axis `easing` (`packages/tokens/src/axes/easing.ts`, `data-area-easing`) owns `--area-ease-*` (moved from
Motion, which now moves time only); Standard is the default and emits today's curves exactly. Curves from
docs/research/motion-2026-10-07 (table in docs/MOTION.md; row in docs/THEMING.md). Effects = Motion, Easing in
SETTING_GROUPS; Inspector Select with a curve mark per option (option-marks.tsx); Language tiles flip the switch at
Motion 300 with a curve readout. Checks: tokens 24272, React 501, desktop 5, typecheck, manifest, contrast report.
Not swept: every family's transitions at Spring (overshoot on enters and moves, e.g. accordion height, toast).

## Language readouts and terms (2026-10-19, same branch, uncommitted)

Owner: "very simple, understandable visuals that show the details being considered for that axis"; asked for the
terminology. Every Language tile now has a readout (abstract.tsx Readout) measured live from its drawing: Corner px,
Row px, Line px, edge contrast ratios, page/sidebar/fill hex, shadow y · blur · %, Softness layer count, Light's
highlight/lip %, Motion's duration ladder (fast · base · moderate · slow, with bars). Terms on the page: Language →
Category → Setting → Value (code keeps axis and preset). Open for the owner: Motion has one number today (durations
scale, curves fixed); candidate additions (easing, travel distance, reduced-motion) not built. Width 0.5/1.5 read
1px on 1x screens (Chromium snaps borders).

## Container views: containerless on Components, waterfall on Brand (2026-10-19, branch `claude/electron-ui-container-views-e74195`, uncommitted)

Owner: a view setting for how asset/group containers show (containerless, a waterfall that hugs assets); then
"test containerless on components first, not the brand assets and groups". Asset card gains `container` (framed ·
containerless), `aspect` (square · hug), `mediaRatio`; AssetGrid gains `layout` (grid · waterfall, JS shortest-column
placement, `data-placed`) and `container`. Containerless: a component keeps the frame's box with a clear edge (hovered
edge on hover, selected edge when selected, no lift, no raised ground); an image or group drops the inset and is the
surface. Components header: Container select after the zoom (All grid and a family's tiles; the Stage stays framed).
Brand: Waterfall between Grid and List, no Container. Fixed: ListBox plates painted behind asset grid cards; Asset card
now lists its gallery specimens. Picks in the spec's Open. Checks: React 501/501, desktop 5/5, typecheck, manifest;
headless Edge captures. Electron runs from this worktree (the design-system-docs session's dev server was stopped).

## Inspector chat merged with main (2026-10-19, branch `claude/unmerged-running-sessions-cb0df1`, PR)

Round 54 approved Approval: the whole agent chat set and the chat additions are Complete. Merged main (PRs #137, #138)
and reconciled #137's Stroke width and Rest shadow with this branch's Edge and Depth, as main's handoff asked: main's
`surface` (0 flat / 0.5 / 1 / 1.5 / 2) and `shadow-rest` (Rest shadow, the divider shadow, `shadow-edge`) are kept;
this branch's resting control is renamed `shadow-resting` (Resting lift); its `hover` shadow role became main's `lift`;
the depth engine (axes/depth.ts) stays the one source of the shadow roles. Inspector: Stroke = Width, Strength, Rest
shadow. Main's tabbed Components page and rebuilt Language page take this branch's Inspector views (Theme / Design /
Code); Language previews cover the depth controls.

## Round 53: Kbd gap rule (2026-10-19, same branch, uncommitted)

Round 52 approved Attachment, Edit summary, Plan, Queue and Step. Round 53: a keycap sits one ui-cluster from its words
(docs/specs/kbd.md; ChatGPT's tooltip 8, Area's Tooltip); Button.tsx lifts a trailing Kbd out of the label (inset.css
selectors follow); Approval's hint is a row with that gap. Only Approval and Kbd remain in review (`components53`).

## Round 52: corners, insets, Kbd rule (2026-10-19, same branch, uncommitted)

Round 51: Approval and Queue approved; Plan and Kbd reopened. Round 52: a button set into a corner takes that corner
less its inset (Edit summary head and rows, Queue rows, Attachment's close, Plan/Queue chevron plates); Plan/Queue
heads' plate as far from the end as from the top; Edit summary's head a small control plus its inset, stable with or
without buttons; Step's rail back; Approval's Esc a keycap; Kbd's backplate rule in docs/specs/kbd.md. Review page
round 52 (`components52`), Before = round 51. Checks pass.

## Coherence pass, round 51 (2026-10-19, same branch, uncommitted)

Round 50: approved Composer, Composer menu, Plan, Queue, Timestamp, Turn notice (Complete). Round 51 fixes the four
rethinks and the shared interaction gaps the pass found: Step's rail removed (Cursor draws none); Approval's numbers at
the label's size, muted, unboxed (Claude Code .shortcutNum); Kbd's filled keycap now the translucent mark fill (it
vanished on a pressed row); Attachment's close inset in Video player's glass with hover and press; Edit summary and
Queue row actions ink-only (cohesion test extended), a pressed row plate, a focusable diff; every chevron turns on
`fast`; Plan and Queue heads get Accordion's chevron hover plate. Review page round 51 (`components51`), Before = round
50 (apps/docs/.cache/before-50). Checks all pass. Preview on 4421 (4420 belonged to another chat).

## Chat additions (2026-10-19, same branch, uncommitted)

After round 49 the owner asked for "chat components like composer improvements" (Astryx's set). Evidence from the
installed bundles: docs/research/inspector-chat-2026-10-18/composer-additions.md. Built (In review, on round 50 of the
review page): Attachment (an image in the composer: remove, uploading ring, failed), Composer menu (@ and / above the
composer: Menu rows, muted path), Queue (messages written mid-run; Send now, Remove, sending, failed, paused after a
stop), Timestamp (Codex's centred time after an hour's pause; no product puts time or model on every message, so no
per-message metadata), and Composer's `context`, `menu` and `onQueue`. The Chat view uses all of them (paste or drop
images, @ files, /new, queueing). Approval now ignores keys for 500ms after it appears (an Enter meant for the composer
approved an edit in the browser check). Checks: React 500/500, contracts, typecheck, playgrounds, desktop 5/5. Not
done: a labelled date divider (would change Separator; owner's call), Markdown as an Area component, the engine.

## Agent chat cleanup, round 50 (2026-10-19, same branch, uncommitted)

Round 49 came back with Step "needs changes" and the rest "rethink" (type, colour, spacing; Approval's backplates and
keys; Plan's missing variants). One set of rules now covers all five (each spec's "Cleanup pass" section): lines in the
reply's type; cards (Edit summary, Plan) at text-sm on Code block's frame with a one-row head and Menu rows on a 12
column; the Diff on Code block sm's metrics with its +/− marker; Approval with quiet Kbd keys and "instead" as the last
row (one backplate); Plan gains `cancelled`; everything a line opens sits on the 12 rail. Review page round 50
(`components50`) with Before = round 49 (apps/docs/.cache/before-49). Generator fixes in apps/docs/scripts
(component-review.mjs resolves --before; review-diff.mjs fresh Edge profile, surfaces Edge errors). Checks: React
495/495, contracts, typecheck, playgrounds, desktop 5/5; seen in the browser preview. Next: chat additions.

## Chat in the Inspector, Phase 2 (2026-10-19, same branch, uncommitted)

Owner: "Keep it uncommitted for now and start Phase 2". Built five In-review families for the agent chat: Step (with
StepGroup, Reasoning), Edit summary (with Diff), Approval, Plan, Turn notice: specs in `docs/specs/`, CSS, manifest,
React, `agent-chat.test.mjs`, gallery tiles (`demos/agent-chat.tsx`), pages, status ("Agent chat" batch). The Chat view
uses them; the recorded run now has a plan, an approval (pauses; 1–3, Esc) with a no branch, and an edit to Keep or
Undo. Details: research README "Phase 2, built". Checks: React 495/495, contracts 14/14, tokens, typecheck (app, react,
tokens, styles), parity, playgrounds, desktop 5/5. Browser preview (4420) only, no Electron. Not done: live captures for
side-by-side, review page. Next: Phase 3 (Agent SDK engine).

## Chat in the Inspector, Phase 1 (2026-10-18, same branch, uncommitted)

Owner: "Go with your recommendations on all six decisions and start Phase 1: the Chat view on a recorded run." Built:
the Inspector's fourth view, Chat, on every tab (`apps/desktop/src/chat/`: recording.ts SDK-shaped recorded runs,
session.ts reducer + player, markdown-parse.ts + markdown.tsx, chat.tsx view, composer, Testing screen). ⌘L opens it,
Esc stops. Panel gained `viewportRef` and `bareFooter`. Testing → "Chat in the Inspector" shows 256 / 360 / 500.
Details and what changed from the plan: research README "Phase 1, built". Checks: React 486/486 (panel test passes the
new flag), contracts 14/14, `npm run test:desktop` 5/5 (not in CI yet), typecheck (app, tokens, styles, react),
manifest parity, playgrounds. Seen in the browser preview (4420) at 256 in light and dark; no Electron (owner: "no
electron preview for now"). Next: Phase 2 components.

## Chat in the Inspector: research and plan (2026-10-18, same branch, uncommitted)

Owner: "look into cursors ui and build a chat interface in the inspector panel. for now, research, and plan". Research
only, nothing built: `docs/research/inspector-chat-2026-10-18/` (README = comparison, recommendation, components,
phases, six open decisions; cursor.md, claude-code.md, codex.md read from the installed bundles; area.md inventory).
Recommended: a fourth Inspector view "Chat", the Claude Agent SDK in Electron's main process, Phase 1 against a
recorded run. Waiting on the owner's answers. (A file named `claude.md` is read as CLAUDE.md on this filesystem; the
notes are `claude-code.md`.)

## Even control insets in the app's bars (2026-10-18, same branch, uncommitted)

Owner: "these controls are not evenly inset, theres too much space horizontally … fix this throughout the electron ui".
Every bar's controls now sit 7 from the side, 7 from the top and 7 above the rule, all 24 tall (measured: Titlebar,
Canvas header incl. the Stage's, Inspector pills). Titlebar (app-shell.css) and Panel (panel.css, inset.css: bars of
controls alone; Nav in a bar at the small control's height) changed as components, with spec notes; the Canvas header
in studio.css. PRODUCT_UI rule 14 records it. Note: another session ("Electron browser UI tweaks",
worktree electron-ui-tweaks-ccf407) was editing studio.css, components.tsx and PRODUCT_UI.md at the same time and holds
port 4400; this session's `pkill` of Electron closed its window once. Expect conflicts when the two merge.

## Inspector views: Theme, Design, Code (2026-10-18, same branch, uncommitted)

Owner: "a figma style panel based on dev mode and the standard design panel … add the tab controls at the top …
separate the current inspector to themes, design, and code. i like the use of containers/tables". Built:
- `src/studio.tsx` InspectorPanel: Workspace's `inspector` takes `{ theme, design, code }`; Nav pills (the Titlebar's,
  Figma's filled pills; Tabs keeps its underline per tabs.md) in the Panel's bar, on the Canvas header's line (both 39);
  the chosen view is stored (`inspectorView`) and a view a tab lacks is left out. Panel no longer draws an empty heading
  in a bar that holds only an action (primitives.tsx, panel.md log).
- Every tab split by one rule: Design = what it is (preview, Properties, values, status, purpose, source); Code = how to
  use it (copy actions, import and code in `CodeWell` = Code block `sm`, tokens, class and modifiers, attribute).
- Components' Code on the Stage: `src/specimen-box.tsx` measures the specimen's root (Box model like Dev Mode's Layer
  properties; Style table with type, ink, fill, edge as hex, shadow layers), re-measured on setting changes. It uses a
  timer, not rAF: a hidden window runs no frames.
- PRODUCT_UI rule 14 rewritten for the three views. Open: owner's look in Electron; Code for Brand / Materials (none).

## Edge and Depth: nine controls (2026-10-18, branch `claude/unmerged-running-sessions-cb0df1`, uncommitted)

Owner: "finalize the material, surface, stroke, elevation axis theming"; built first with packages and Looks, then (owner:
"i dont want any prepackaged, named themes … the previous system was too bloated") cut to nine individual controls,
the set the owner chose. Research README "Built" has the table.
- **Tokens:** `axes/depth.ts`: seven new registry axes (Stroke, Rest shadow, Field shadow, Shadow size, Softness, Light,
  Shadow colour) beside Surface (Stroke width, now 0 / 0.5 / 1 / 2) and Elevation (Shadow: floating roles and hover,
  writes `--area-elevation` alone). Seven roles derived in base.ts (control, field, resting, tooltip, float, hover,
  modal), each eight slots (lip, six soft layers, highlight last so lists crossfade). `strokeEdge` (color/layers.ts)
  scales stroke offsets; rails and toggle fills keep `rawEdge`. Config exports `DEPTH_LEVERS`. Defaults compute exactly
  as shipped.
- **Styles:** outline fields and outline / soft Buttons rest on `shadow-field` (0 by default); soft fields stay flat; the
  focus halo lists after it. Linked Card and gallery tiles hover on `shadow-hover`. Material keeps the field shadow.
- **App:** the Inspector shows them under two headings, Stroke (Width, Strength) and Shadow (Floating, Resting, Fields,
  Size, Softness, Light, Colour) (owner: "can you separate edge from depth … maybe edge can just be called stroke").
  The Language tab has a row per control, under the registry's labels (Surface, Stroke, Elevation, Rest shadow …).
- Open: owner's look in Electron; Material's stroke styles, contact and emboss still overlap Light and Stroke.
- Checks: tokens, React 486/486, contracts, manifest parity, token refs, typecheck, playgrounds (see the end of the
  session). Setup: this worktree has its own `node_modules` (APFS clone, plus `electron`).
## File explorer coherence pass (2026-10-19, branch `claude/brand-folder-ui-component-e54b70`, uncommitted)

Owner: "a deep coherence pass with current area components". Folder / File page: outline fill `bg-component` (the
recessed `bg-subtle` read as a hole in dark), quiet ink derived from muted, edge on `--area-stroke-width`, open motion
`base` ease-in-out in / `fast` out (MOTION.md row), the outline sheet drawn over the back's edge. File tile: Asset card's
caption type (UI text strong, xs muted detail) and 8 gap, no figure movement on hover (rule 2), bare glyph at the
stroke width. Specs have a "Coherence pass" section each. Brand now uses Asset card (another session) and was left as is.

## App UI tweaks (2026-10-18 to 19, branch `claude/electron-ui-tweaks-ccf407`, merged to main in PR #137)

Owner rule: design feedback applies to the real components and tokens, never as an app-only override. When the owner
leaves feedback, say why the design is as it is and what changing it affects before changing it.

**Built (all on main now):**
- **Hover lift**: Elevation's `lift` role (shadow8 at half the float's weight) for the linked Card and gallery tiles.
- **Component page tabs** (`apps/desktop/src/family-tabs.tsx`, `scripts/sources.mjs`): Overview / Documentation / API /
  Code / Spec, tables wherever data has rows. Only Button has written Documentation rows
  (`src/content/documentation.mjs`); other families show what their manifest and spec hold. Stage code is its own block.
- **Asset card** (new component, In review, `docs/specs/asset-card.md`): square frame; caption `inside` (name at the
  top, the owner's 2026-10-19 trial, the default) or `below`; `group` = 2×2 mosaic (16 gaps, 12 margin, no strokes);
  `AssetGrid`. Brand shows groups and assets with it. **Every gallery tile is an Asset card** (`src/tile.tsx`).
- **Image corners by size** (DESIGN_SYSTEM.md): standalone 12 (Figure, Asset card, viewer), thumbnails 6.
- **Language** (`src/pages/language.tsx`, `src/abstract.tsx`): built from the Inspector's own controls list; one real
  component per setting with real text; cards >= 200; drawings scaled (never above 0.8x), one scale per setting so
  presets compare; card frames never change with the setting; Light / Dark preview switch; Ground and Layers named
  without Light/Dark and drawn as windows; Type is a ramp with px sizes.
- **Previews scale whole** (gallery `fit.ts`, Language): `scale`, not `zoom`, so parts keep proportions (MOTION.md,
  Crispness). Switch's thumb now centres on its track (`switch.css`), so it holds at any scale or browser zoom.
- **Type**: titles and display scale with the base size (whole px; 14 unchanged). Size and leading ramps gained rungs.
- **Stroke width** (`data-area-surface`: 0 Flat / 0.5 / 1 / 1.5 / 2) and **Rest shadow** (`data-area-shadow-rest`,
  0–8) in `packages/tokens/src/axes/surface.ts`: independent (line, shadow, both or flat); `shadow-edge` is the rest
  shadow. Inspector → Effects.
- **Ground / Layers audit** (docs/research/layers-2026-10-16/sweep/README.md, "Audit, 2026-10-19"): grounds 90–94 and
  layers 7–8 add no findings beyond the default; the owner keeps every step.

**Open / next:**
- The other session (worktree `unmerged-running-sessions-cb0df1`, uncommitted "Edge and Depth", `axes/depth.ts`) also
  writes `surface` (0 / 0.5 / 1 / 2) and `shadow-rest`. Main now has this branch's versions: rebase that work onto main
  and reconcile (keep 1.5 and 0 = flat; Rest shadow as the divider shadow) before it merges.
- Review with the owner: Asset card (In review), the inside-caption trial, Language visuals, the Shadow look in dark
  and at Elevation 0.
- Recorded, not changed: Command palette's selected row is faint at Layers 0 (0.027 step); Folder count and File page
  label text are 2.1–3.3:1. The typography spec still describes fixed titles.
- Documentation rows for families beyond Button.

## File explorer components and the Brand tab (2026-10-18, branch `claude/brand-folder-ui-component-e54b70`, uncommitted)

Owner: download the Pinterest board oval / brand into "an organized place in the electron browser called brand … in
organized folders", and "work on the folder ui component first … add file explorer components".
- **Library:** all 834 pins fetched through Pinterest's own page API in the owner's Chrome, downloaded (originals and
  474 thumbnails, 242 MB) to `~/Library/Application Support/Area/Brand/`, never into the repo. Sorted by eye from
  contact sheets into 12 folders (`folders.txt` there; `library.json` is the index the app reads).
- **Components (in review):** Folder (`docs/specs/folder.md`: Finder's GenericFolderIcon geometry read at 256, sizes
  48 / 64 / 96, palette tones, contents peeking, badge, open) and File tile + FileGrid / FileGridItem
  (`docs/specs/file-tile.md`: Finder's icon-view item on ListBox's grid, Enter / double click opens). Gallery batch
  "File explorer". Research and survey results: `docs/research/file-explorer-2026-10-18/README.md`.
- **Brand tab** (`apps/desktop/src/pages/brand.tsx`): folders in the Sidebar, a FileGrid of Folders, a folder's images
  as tiles (size Small / Medium / Large, grid / list), the chosen image in the Inspector (Pinterest, Source, Show in
  Finder), a full-size viewer (Enter, ← →, Esc). Electron serves the library as `area-brand://library/`
  (`electron/main.cjs`, CORS on for the file:// page); the browser preview as `/__brand/` (`scripts/dev.mjs`).
  `.claude/launch.json` gained `desktop-browser` (port 4420, no Electron) for when another session holds 4400.
- Folder redrawn the same day (owner: "very simple shapes … styled exactly like apples finder folders … just 1 paper"):
  measured from the live Finder icon (NSWorkspace, macOS 27.2), Finder blue by default, one straight white sheet.
- Badge: the label's baseline now rounds to a whole pixel from the plate (owner saw uneven centring); every badge of a
  size matches at 100%; in the gallery's 90% Auto zoom ~6 of 73 still differ by half a pixel (zoom makes 1px fractional).
- Owner, 2026-10-18: leave the gallery's Auto zoom at 90% for small specimens (the half-pixel drift there is accepted).
- Then (owner: "more round … more large … more soft … brighter"; file glyphs "way too thick … not correctly positioned"):
  Folder corners 56, fills 92 × 84% of its box, brighter softer stops and shadow; new **File page** (`FilePage`,
  `docs/specs/file-page.md`: Finder's document page, glyph thinned to ~1.25px via `--area-weight-icon`, extension
  label); File grid tiles now start at the top of their row (ListBox's grid centred them). Round 48 has all four.
- Then: File page matched to Folder (corners 54 = Folder's on screen, top-lit, no edges, same shadow); Folder's sheet
  corners concentric (34); `variant="outline"` on both (owner's simplified grey folder, AccessGrid reference) and
  Folder `count`. Icon-line survey in the file-explorer research README §9. React 486/486.
- Then: outline Folder draws back and pocket (two layers); outline edges clamp(0.75px, 0.85%, 2px); File page's flap
  shares one diagonal with the page (no doubled stroke), solid flap shaded #fbfbfc → #d9dde3.
- Then, after an illustration survey (research README §10): whole-pixel outline edges, Folder `__rim` (back edge only
  where it shows, no doubled foot), solid pocket 1px lips, page near flat with a light flap, page corner 40 (folder
  1.4×), count and label one type (cap ≈ 9%, regular, 7% up). **Icon line above 24px** now continues at size^0.74
  (Fluent's slope; `SIZE_CURVE_LARGE` in packages/icons/scripts/generate.mjs; icons.md "Line above 24px"): 48 → 2.25px,
  96 → 3.75 (were 2.7 / 5.4). Icons tests 11/11, React 486/486.
- Then: outline page diagonal redrawn at 1.35× the edge; page #fff → #f4f5f7, flap #f0f1f4 → #f6f7f9; glyph and label in
  one centred column; label and count share one type exactly (tracking removed).
- Then: outline is the default `variant` for Folder and File page (solid is the alternate). Every stroke one weight
  (owner): no heavier diagonal; File page's glyph draws at `--_edge` as a non-scaling stroke.
  The diagonal looked thin because the flap's fill covered half its stroke; the outline's edge, crease and diagonal are
  now drawn after the flap at one width (measured equal, scratch ink.py method in the spec).
- 2026-10-19: round 48 approved all four (Folder, File page, File tile, Badge): the three new families are Complete.
  After: figures snapped to even whole pixels, badge 12.5% of the box, a clear open state (pocket tips forward, a sheet
  rises). Note: another session (design-system-motion-theme) relaunched its own dev server and Electron on 4400 and
  closed this worktree's window; `desktop-browser` (4420, no Electron) is this worktree's preview.
- Open for the owner: sm / lg folder sizes.
  Not built: multi-select, rename, moving images between folders, FileRow, a file-type icon map.
- Checks: React 484/484 (new file-tile.test.mjs), contracts 14/14, manifest parity, token refs, typecheck,
  check:playgrounds. Seen in the browser pane (light and dark) and in an Electron capture.
- Review: round 48 (`components48`) on https://claude.ai/artifact/KSG5sYR4ERxq9rb4cqoqSG holds Folder and File tile
  (review notes in both specs). `npm run build -w @area/docs` fails its dogfood audit on an inline style in
  `gallery.tsx` / `badge.tsx` that predates this branch; the review page still generates.

## Settings that show their effect, card lift, Fit groups (2026-10-18, same branch, uncommitted)

- **Settings (owner: keep every option, make choosing visible):** every Inspector list is a Custom select whose options
  draw what they set (`apps/desktop/src/option-marks.tsx`: colours as Color swatches under the option's own scope,
  marks for Layers, Contrast, Density, Radius, Surface, Elevation, Motion) and whose highlighted option previews on the
  Canvas until the list closes (Studio `previewCanvas` / `previewMaterial` / `shown`; Material bundles and levers too).
  Custom select gained `onHighlightChange` (spec note, test). Research: `docs/research/settings-pickers-2026-10-18/`
  (shadcn Create previews on hover; tweakcn draws swatches). Open: "Neutral (Default)" truncates by 17 in the 256
  Inspector (Panel's 1 : 1.5 field split); Segmented settings (Action, Selection, Type) have no marks or preview.
- **Card hover (owner: no stroke change, a subtle shadow, smooth motion):** a linked Card and the gallery tiles keep
  their edge and lift to the float shadow, in on `fast` ease-out, out on `base` ease-in; a press drops it; Elevation 0
  keeps the edge step. Measured from Notion's tatami card and Fluent's: `docs/research/card-hover-2026-10-18.md`;
  PRODUCT_UI rules 2–3, MOTION.md "Lift", card spec log. Card stays Complete pending the owner's look.
- **Zoom (owner: no upscaling, granular groups, clearer options):** component cards are at least 380 wide. The zoom is
  Auto (default), Fit (each specimen as large as its card allows, to 200%), then 50–200% in ten steps; − and + step
  through the percentages, from 100% on Auto or Fit; Zoom control gained `views`, `stepRows`, `field`, `presetLabel`
  and a 2 gap between its plates (spec log). Auto groups by
  painted area at type 14 / 32 (`data-fit-area` on each tile): small 90%, medium 85%, large 80%, largest 75% (Code
  block, Board, Color picker, Command palette, Panel …), shrunk further only to fit (`src/gallery/fit.ts`).
- Motion setting audit: every component transition reads the duration tokens; no hard-coded durations.
- Checks: React 480/480, contracts 14/14, check:playgrounds, manifest parity, typecheck. Checked in the browser pane.

## Materials lab (2026-10-18, branch `claude/ui-improvements-cleanup-19e92d`, uncommitted)

Owner: "a new temporary tab in electron for materials where i can really experiment, research, fine tune, improve, and
clean up the materials". Built the **Materials** tab (`apps/desktop/src/pages/materials.tsx`, `.lab-*` in studio.css),
temporary: remove it once the bundles are settled and written back to `packages/tokens/src/axes/material.ts`.
- Sidebar: the bundles (Edited when the draft differs). Canvas: Every part / one part group / Page / Screen (Analytics
  dashboard) / Readings (contrast of body and muted ink on cards, overlays and chrome over each backdrop's extremes), light
  and/or dark, over Page, Wallpaper, Photo, Text or Stripes, beside Shipped or a snapshot. Inspector: every lever as a
  continuous slider, switches, stroke styles, per-lever targets, group strengths (`--area-material-scope-*`), notes;
  Reset, Save snapshot, Copy bundle (source for MATERIAL_BUNDLES), Copy changes (a list to paste into a session).
- The draft is written as the material's own inputs (`--area-material-*`) on a `data-area-material` scope, so it paints
  through material.css exactly as shipped; an unedited draft matches Shipped. Drafts and snapshots live in the app's
  localStorage (storage.ts, keys `lab:drafts` and `lab:snapshots`).
- Tokens config now also exports `MATERIAL_ROLES`, `MATERIAL_TARGETS`, bundle `targets`, switch `gates`, stroke `gate` and
  `materialGrainImage()`.
- Fixed (found in the lab): under any material the Slider's track was blank and its thumb hollow (material.css replaced
  the Slider's own gradients); the material now lies over them.
- Checks: tokens 24,270, React 479/479, contracts 14/14, check:playgrounds, manifest parity, typecheck. Checked in the
  browser pane (every view, both themes, backdrops, Soft's Layers, copy output); Electron relaunched from this worktree.
- Setup: this worktree needed its own `node_modules` (APFS clone `cp -cR ~/Desktop/area/node_modules .`, plus
  `node_modules/electron/dist` and `path.txt` from another worktree) so `@area/*` resolve here, not to the main checkout.

## Edge and Depth research (2026-10-18)

Owner: shadows at rest packaged from offset, blur, spread, colour, opacity; stroke + shadow combinations; stroke width;
relation to Contrast. Research and proposal only, nothing built: `docs/research/elevation-stroke-2026-10-18/`
(README, `sources.md` with 20 pinned sources, `lab.html`). Review page with live levers and presets:
https://claude.ai/artifact/5CoJiyCuttgfg4UDGV4twS. Waiting on the owner's picks (presets, levers, Field lift default,
Stroke width 2). The audit gaps are fixed (same PR): surfaces, overlays and Scroll to latest list a Material's layers in
`--_m-layers` beside their own shadow, so the modal lift, selected Card ring and Video ring survive; `--area-shadow-edge`
follows `border-width`, so Surface 0 + Contrast draws one edge; framed Infobox has its edge. Material no longer paints the
Toggletip button, and a searchable Menu is one overlay. Owner: the Toggletip note stays a Tooltip, no Material.

## Board corners, Contrast equal for every stroke, radius audit (2026-10-18, same branch, PR open)

- Board: column 16 (was 20, the roundest surface), cards and add row `radius-row` 8 (were 12). Spec updated.
- Contrast (owner: "some components get an obviously darker stroke whereas some … dont visibly change at all"): one share
  for every stroke. Neutral rest edges → `stroke-control`, hover edges → `stroke-control-hover`, tonal `<tone>-border`
  (now written as `-rung`, derived in base.ts) → `fg-<tone>`, plus the swatch ring, soft Button edge and Board's ring.
  Sweep: 202/202 light strokes move; dark all but Tooltip, Video player's on-media button, Color field's opacity seam.
- Radius audit (owner: "any other components that need a corner radius audit"): measured every painted corner at
  the default and swept Radius 0…Pill × density 28/32/36 × type 12–16 for poke-outs, over-half and concentric gaps.
  Board was the only outer-corner outlier. Fixed: Kbd and Code's swatch stop 2px short of a pill until Pill (they
  became a capsule / circle at 14). Accepted: Message bubble one-liners capsule from 14 (ChatGPT's); fields and buttons
  in Panel / Dialog rounder than concentric at 14 and Pill (the 1.5× inset corner cap); Alert / Toast 10, Alignment
  picker 6, Video player 6 are recorded decisions (radius audit D2, Figma, Figure's media corner).
- Checks: tokens 24,270, React 480/480, contracts 14/14, contrast report, typecheck, playgrounds, parity.

## Contrast levels, tile selection, motion gaps (2026-10-18, branch `claude/design-system-motion-theme-fa5802`, PR open)

Owner: dark strokes, meter track and switch under Contrast More; "refine the contrast axis … doesn't apply evenly";
selected tile's thick stroke; tiles at least 360; are all motion interactions in the system.
- Contrast is a level: Standard / **Medium** (new, 0.5) / More, System (Default) follows the OS. Every `border-*` steps a
  third of the way to `stroke-control` at More; rails (`fill-track`, `fill-track-hover`) never move; Switch outlines under
  More (edge + off-thumb ring). CONTRAST.md has the numbers. Standard is unchanged.
- Gallery tile selection: one line (the edge in the selection colour), crossfades on `fast`, lifts on hover. Cards ≥ 360.
- Motion audit: components all follow MOTION.md. Fixed: theme / Canvas setting switches now land at once
  (`data-area-switching`, base.css), tile focus ring instant, compact painted outline fades, section-link underline fades.
  Open: Sidebar / Inspector show-hide snaps (no recipe; owner decision).
- Checks: tokens 24,270, React 480/480 (cohesion literal for `border-width` updated), contracts 14/14, switch, slider,
  manifest parity, typecheck, playgrounds, contrast report. Seen in the browser pane (desktop-dist); Electron relaunched.

## Video player in Area's paint (2026-10-18, branch `claude/video-player-area-paint`)

**Done:** round 47 approved; Video player is Complete. Nothing is in review. Round 47 (collection `components47`: one set of parts in every layout, CC track in demos, captions icon 13 × 10, row gap 8, narrow corners). Open: captions-off redraw with captions. Before that, round 46 (collection `components46`: glass-tint plates, Cursor-style solid track and thumb; the review diff cannot see pseudo-element or hover changes). Before that, round 45 (collection `components45`: dark glass in every theme via color-scheme: dark, white 12% stroke, filled icons; generator "body" paint). Before that, round 44 (collection `components44`): the floating controller built from Area's parts (surface
Toolbar paint and corner, Material overlays group, ghost Buttons, outline icons, Slider's track and thumb, muted time);
still sample image. PR #126 (Link groups, Video player rounds 39–43) merged.

## Video player and Link groups (2026-10-17, branch `claude/link-groups-video-player`, PR #126, merged)

**Waiting on the owner:** round 43 (collection `components43`: even 16 insets measured on the glyphs). Before that, round 42 (collection `components42`: refined from 15 captured players, `docs/research/video-player-references-2026-10-18/`). Before that, round 41 (collection `components41`: thumb always shown, rail 30% in the panel, muted volume keeps its level). Before that, round 40 (collection `components40`): Video player rebuilt on QuickTime's floating controller
(`layout`: floating default, bar, minimal; `video-player-quicktime-2026-10-17.md`); placeholder is the avatar photo.
Earlier, round 39 (collection `components39`): the new Video player (`docs/specs/video-player.md`,
`docs/research/video-player-2026-10-17.md`); merge of PR #126 (the session's `gh pr merge` was blocked by permissions).
- Navbox renamed Link groups (owner). Abbreviation's tooltip is a span (no hydration error).
- Video player not built yet: settings menu (speed, caption track), Tooltips on its buttons and the scrubber's hover time,
  buffering Spinner, ended/replay, captures of Notion's and Loom's players. Open picks: played fill white vs accent;
  full-screen icon; on-media Button as a Button option.
- The sample clip `apps/docs/public/images/sample-video.webm` is a canvas recording (6 s, no personal content).

## Material in the Inspector (2026-10-17, branch `claude/materials-testing-inspector-00a2d4`, merged by PR)

Owner: test the defaults on Examples → Analytics dashboard, then materials, built "into the Inspector as a real
setting". Done: Inspector → **Material** (a bundle, then 14 levers with their switches) on Components and Examples.
Tokens `axes/material.ts`, receivers `styles/src/material.css`, app `src/material.ts`; details and what changed from the
prototype in `docs/research/astra/materials/27-levers/README.md` "Built into Area". The levers page and specimen held no
saved picks (collections `levers` and `materials` empty), so values are the levers page's bundles.
- Checks: tokens 24,270 (new `material.test.ts`), React 477/477 (cohesion test skips material-scoped rules and checks
  they keep the lift), contracts 14/14, typecheck, styles build (parity, token refs).
- Open: per-lever targets and group strengths are fixed per bundle (not in the Inspector); muted text on light gradients
  past 3 (caps.mjs); contrast sweep with materials on; Glass needs a backdrop to read (no wallpaper option yet).
- Then (owner): the Examples tab is **Testing** (`#testing/…`; old `#examples` links and saved tabs map to it). The
  Language illustrations (`src/abstract.tsx`) are now real Area components with placeholder text ("Title", "Option",
  "Button"), one card per setting (properties card, inspector card, menu over a card…), laid out at 320 × 248 and zoomed
  to fit the tile; the `.abs-*` drawing CSS is replaced by a few `.lang-*` layout rules. Checked in the browser pane
  (every setting; no tile overflows); not checked by eye in Electron.

## Spacing pass (2026-10-17, same branch and PR)

Owner: "fix the padding, gaps, etc. overall … research how design systems … ensure alignment, optical sizing, spacing …
be thorough". Record: `docs/research/spacing-2026-10-17/README.md` (research in `external.md`, 16 systems; sweep scripts
in `sweep/`). Review page (Before / After): https://claude.ai/artifact/JtDZ9LNfutFyfdkGUvQzL2.
- Measured all 102 families at type 14 / 32 and 13 / Compact in headless Edge at 1:1 (defects + cross-family metrics,
  1,116 title/action pairs, list label columns). The inset contract holds: no off-centre control at 14.
- Fixed: Tag at Compact (owner's notes): text 13px → 11 in the 14 tag, side 6 → 4 (room above the cap + 1, max 6), label lifted a quarter of cap − x-height so lowercase reads centred; then (owner: "see if there are other small components") a marks sweep (`sweep/marks-check.js`): Citation's pill sides now from its height (5 at 14, was 8); Badge, Tag and Citation share one optical centre (inset.css); then (owner: "go with 10px icons, draw the cuts") 10px cuts for the 8 icons the app puts in marks (`packages/icons/sources/10/`, `--_glyph-cut10`, spec "10px cuts"), Card header badge/marker centring (6px low), Kbd key gap (fractional 0.25ch), Select gap (browser 0.5em), Tag
  icon side/gap (to Badge's), Tag label and remove centring at 13, choice-group description/validation gaps (Field's
  ui-stack), Infobox and framed Description list insets (border counted once). Specs updated. These are Complete families
  (Infobox In review): owner review pending on the page; status not changed.
- Open (on the page): Popover gap 16 > inset 12; Table and framed data views add their frame; Tag picker lg tag corner;
  12-in-10 remove glyph at Compact 13.
- Language illustrations simplified (owner, relayed by the placeholder-copy session: "fix and simplify the ui being used in the language, maybe make it more abstract or small/simple"): per setting two or three components that show it (an action pair, three rows, a field and a button…), the Example copy (Title, Description, Button, Item one, One / Two), shown 1:1 on a 224 reference and zoomed down only in small tiles.
- Checks: React 477/477, contracts 14/14, tokens 24,270, typecheck, styles build. Raw sweep JSON is not in the repo.

## Round 35 / 34: Articles rethink and the Component icon (2026-10-17, branch `claude/wikipedia-link-underline-12add0`, uncommitted)

**Done:** round 38 approved Figure and Reference list; all eight Articles families are Complete. Nothing is in review.
Proposed, not started: a Video player family. Port 4400 and the Electron window belong to another session
(`materials-testing-inspector`); this session's earlier blanket pkills may have closed its app. Verify here with
`desktop-dist` (4410). Round 38 (collection `components38`): Reference list's em dashes back (owner prefers them);
Figure's `ratio` removed (a video will be its own player). Earlier, round 37 (collection `components37`): Reference list markers (one box for bullets and
numbers, 6 to the text) and no em dashes (Inline list dots); Figure's 16:9 tile is an image. Round 36 approved Infobox.
Open: a Video player as its own family (owner asked; proposed, not started).

Earlier, round 36 (collection `components36`, Before = round 35 rebuilt from the page): Figure
(`ratio`, no-caption and video tiles), Infobox (`layout="stacked"`, `action`), Reference list (numbered by default, numbers
flush with the text above; `round-36-variants.md`); generic placeholder copy. Round 35 approved Inline list, Navbox, Table
of contents and Panel. Open: collapsible Infobox sections; rename Navbox.

Earlier, round 35 (collection `components35`; Before = round 34 rebuilt from the page's own data.js and
area.css). Round 34's verdicts are applied: Figure one form; Infobox Wikipedia density with Area's title roles; Inline list
blue-link tile (links standalone in a list); Navbox footer hierarchy; Reference list rebuilt on ChatGPT's Sources
(measured, `docs/research/articles-rethink-2026-10-17/round-35-measurements.md`); TOC label in the default ink; Panel
token rows 8 apart. Each spec's "Round 35" table gives every text style, ink and gap its basis.

Earlier: round 34 (collection `components34`) on https://claude.ai/artifact/KSG5sYR4ERxq9rb4cqoqSG,
Before = round 33 (main at df7cfc6): Figure, Infobox, Inline list, Navbox, Reference list, Table of contents, Panel.
Built with `component-review.mjs --round <slugs>` (new flag). Read verdicts with ArtifactData.

- **Round 33 verdicts** (18/18): 12 approved and recorded in `component-status.mjs` (Link with the close underline,
  Citation footnote, Hover card, Abbreviation, Hatnote, and the link-underline peers). Six "rethink": not only
  Wikipedia; Figure: "look at other design systems/products ... simple and consistent and cohesive".
- **Rethink** (surveys in `docs/research/articles-rethink-2026-10-17/`; each spec's "Rethink, 2026-10-17 (round 34)"):
  Figure unframed (`align` start | center, `bordered`); Infobox composed of a header + Description list sections,
  `framed` optional; Inline list `dot` | `rule` | `none`, never bold; Navbox unframed columns of headed link groups,
  no toggle, `divided`; Reference list muted notes with one return-arrow backlink (`return` added to the component
  glyphs), `divided`, hook `data-target`; Table of contents "On this page", `levels`, no collapse.
- **Open for the owner:** rename Navbox ("Link groups")? Description list `stacked` (App Store, Chakra) would reopen
  an approved family; a faint marker track on every TOC row would change Nav marker everywhere; a "Sources" list
  (ChatGPT, Perplexity) for Reference list.
- **Link underline** 0.25em → 0.08em (link.md, "Close underline"), approved in round 33.
- **Component icon** redrawn larger (icons.md, "Component redrawn"; `data-angles="free"`); sheet in
  `docs/research/icon-review/2026-10-17/`.
- Checked: React 477/477, typecheck, icons 10/10, styles build (`build:docs` fails only the known dogfood audit).
  Not synced with main (#123, Examples tab, unrelated): the worktree has uncommitted work.
- Seen, not fixed: Abbreviation's tooltip renders a `div` inside a `p` (React hydration warning in the gallery).

## Wikipedia: links, footnotes and article families (2026-10-17, PR #122)

Owner: Wikipedia's "Systems[13]" ("i like the way the links and small numbers are styled", no hover-only underline,
links in blue, text, gray or other colours); then "build whatever you recommend".
- Link inks: purple, pink, green, red, orange, brown (each hue's readable text ink); Citation `variant="footnote"` ([13]).
- New families, all In review (`REVIEW_COMPONENTS`, batch "Articles"): Reference list, Table of contents, Figure,
  Infobox, Inline list, Abbreviation, Hatnote, Navbox. Specs in `docs/specs/`; tests `packages/react/tests/articles.test.mjs`.
- Area's type has no italic (Geist upright, `font-synthesis: none`): Hatnote is muted instead of italic.
- Checked: sweep text contrast at four Layers settings (0 findings), React 477/477, contracts, typecheck, styles build.
- Open: owner review; Notion's TOC and image caption not measured; no manual TOC section toggle.

## Interaction polish (2026-10-16, PR #120, merged)

Owner: components don't feel polished when clicking and hovering; then "fix the underline on the link component".
Research and every value: `docs/research/interaction-polish-2026-10-16.md`.
- **Presses show.** New `bg-component-pressed` (layers.css: selected fill 3% / 7% toward the ink, bounded by muted
  ink at 4.6:1) and `bg-pressed` (10% / 19%), one step past selected (Notion 5% → 10%, ChatGPT 5% → 12%). About 30
  families repointed or given the press they lacked (solid Button `--_solid-active`, Segmented, Chip, Calendar, Badge,
  Tag, Board, Breadcrumb…). Two presses never showed (specificity): Prompt suggestions, Nav rows with actions.
  PRODUCT_UI rule 3 and DESIGN_SYSTEM "Shared state paint" updated.
- **`user-select: none`** on every control (ChatGPT and Notion: 100%).
- **Link underline** at 0.25em, clear of descenders (link.md); peers and the app's section links too.
- **Components tab** blocked about 350ms; `fit.ts` batches reads and writes: about 175ms. Fits are identical.
- **Checked:** hover and press sweep (the states.mjs copy also reads descendants and pseudo-elements). No text under
  4.5:1 at light 100 + 4, light 90 + 8, dark 8 + 4 or dark 24 + 8 for the changed families. React 468/468, contracts,
  typecheck, styles build.
- **Not done:** owner review of the changed (Complete) families; Color tab's 260ms first layout.
- Another session (`remaining-work-axis`) is changing the Layers axes; this pass avoided `packages/tokens`.

## Icons: balance over 1× crispness (2026-10-16, branch `claude/icon-review-5957f0`, merged)

- Owner: optical balance, size and even spacing outrank 1× pixel crispness (spec "Balance over 1× crispness").
  The 2026-10-14 frames moves (273 sources) are restored to their 13 Oct drawings; qr-code, diamond, gamepad kept.
- Balance pass, rounds 1–4 (spec): wand, eye-off (matched to eye for the toggle), lock / unlock, broadcast, quote,
  scissors, atom; the writing tool ×1.25 wider in pencil, pen, pencil-off and every composite pen; slice, broom, wrench;
  mountain. Measured against Lucide and Phosphor (`docs/research/icon-review/2026-10-16/`: measure.mjs, compare.py,
  bal.mjs, toggle.mjs, grid.mjs). Lint 808, icons tests 10/10.
- dismiss × is 9 (owner-approved; every component's close mark ~10% smaller). Final pass: no new sliver, doubled
  stroke or escape (spec "Final visual pass"). React 466/466, typecheck, build. Not checked: the Electron app by eye.


## Start here (2026-10-17, branch `claude/sample-dashboard`, uncommitted)

- **Examples tab** (owner: "test this with a sample ui dashboard built entirely from this design system, i will start
  with the defaults then move on to materials and other axis of customization"):
  - A sixth Titlebar tab, Examples (`pages/examples.tsx`). Its first example is a product analytics dashboard
    (`content/examples/analytics.tsx`), built from 26 Area families.
  - It renders on the Canvas inside the Canvas settings, so every Inspector setting reaches it.
  - The chart is an SVG in tokens: Area has no Chart (docs/COMPONENTS.md, "Known gaps").
  - Checked in the browser pane (light, dark, no overflow); typecheck, desktop build, playgrounds 0 mismatches.
  - Next: the owner tests the defaults, then the settings, then materials, which need the Material setting built into
    the Inspector (levers from `materials/27-levers`).

## Earlier (2026-10-17, session `remaining-work-axis-d71922`, merged as PR #121)

**Waiting on the owner:**
- Round 32 on the review page (collection `components32`): Hover card's examples rethought (spec "Content").
  Round 31 approved Board and Menu; they are Complete.
- Materials restarted (owner: "yes, start there"): https://claude.ai/artifact/6yuLW5kY176hsCeJf2Abzo shows None,
  Glass, Tactile and Soft on real components with controls and the board; picks in collection `materials`, doc
  `picks`. Reports 19–21 reviewed and Layers × Material recommended in `docs/research/astra/materials/REVIEW.md`;
  values in `22-calibration`, page source in `23-specimen-v2`. Open for the owner: the Glass reading floor (body text
  56/62%, muted 90/73%), engraved glyphs, D10 under Layers. Next: tasks 24–26, then the Material axis (start with
  None + Glass on floating surfaces, per the 21 review).
- Owner then asked for materials as separate levers: https://claude.ai/artifact/BpDuXHDq1vo2Rv5vKdhUB3 (13 levers,
  0–8 each, targets per lever, one light; bundles for None/Glass/Tactile/Soft/Aero/Glow; picks in collection `levers`,
  doc `picks`). Source `docs/research/astra/materials/27-levers/`.
- Then the owner narrowed to eight references: https://claude.ai/artifact/NXTVuD3ajRMbHaJZmaPCXR rebuilds each in CSS
  with its recipe and a lever matrix (`materials/28-recipes/`). Lever changes it found: tone ring, catch-light, wells
  reverse gradients, radial position, content-based transparency floors, a softer Elevation resting shadow.
- Then scope: https://claude.ai/artifact/4GwjuWZeFx9Tj8S31iVEQ7 (`materials/29-scope/`): 16 sources agree; Area's 94
  families placed (10 carry, 32 echo on one part, 11 overlay, 5 chrome, 36 none). The levers now target part groups
  with strengths (primary 1; secondary, badges, fields, selected rows 0.5). Levers page updated with the five recipe
  changes; recipes page's console and folder reworked.

**Done:**
- Layers: contrast is one setting per theme, `layers-light` and `layers-dark` (was `layers`); every ground and step
  kept (owner: "save all the layer picks for the most possible customization"; saved to the Layers page, doc
  `picks`). The app restores a saved `layers` as both. The Layers page (rebuilt from the shipped CSS and model):
  https://claude.ai/artifact/5crS7DCaWEBbAjvTXYpJhn.
- Surface 0 (Borderless): the dark edge is a crisp 1px 20% white line, not a 1px blur (owner: "make it firmer").
- Review diff: renders the Layers extremes with both the old and new attributes and clears them between modes.
- Checks: tokens 24,266, React tests, typecheck. `build:docs` still fails only the known dogfood audit.

## Earlier (2026-10-17, session `project-status-components-16382f`)

**Waiting on the owner:**
- Round 30 approved six; round 31 Board and Menu. The first sweep merged as PR #117.

**Since PR #117 (uncommitted):**
- The hover and pressed sweep (`sweep/states.mjs`; README "Hover and pressed").
- Muted text is also solved on the hovered soft mark, so it is slightly darker on gray pages only.
- In dark, `edge-control-hover` steps to `border`: outline fields showed no hover there.
- Review diff: a "light focused" mode, so actions shown on hover or focus count as changes.

**Done:**
- A sweep of every family at 18 Layers settings (headless Edge against the static build), then fixes. The re-runnable
  sweep and its results are in `docs/research/layers-2026-10-16/sweep/README.md`.
- Text failures went from about 1,000 items in 32 families to 0. What changed:
  - Hued inks (vivid and tonal) follow the light page.
  - Muted is also solved on the selected fill and on the soft mark.
  - Tinted labels lift on light dark grounds.
  - The app marks its grounds: gallery tiles are raised, and there is a new `page` ground for Titlebar and flush Panel.
  - Segmented and Toggle group take the control fill for their track.
  - Code block's marked lines and Box model's insets adjust their inks.
- Light 100 + 4 is unchanged except Code block's highlighted and diff lines, which already failed. Dark 8 + 4 is
  unchanged except Segmented's and Toggle group's tracks (#2c, near the approved #28 groove).
- The review diff now renders at the Layers extremes and compares colours by what paints.

**Open:**
- The Layers picks: every option kept, defaults unchanged (doc `picks`).
- The inset-controls rule (Nav's row − 8, ink-only hover).
- Badge dismiss and Tag remove: a 10px box holding a 12px glyph.
- Chip and Tag press with the hover paint.
- Code's on-colour plate.
- Not swept: hover and pressed states; forced colours; the Electron window by eye.
- `npm run build:docs` fails its dogfood audit on main too (one inline style in `index.html`); the pages still build.

## Earlier start (2026-10-16, session `project-evaluation-97084a`, branch `claude/project-evaluation-97084a`)

**Done:**
- *Component reviews:* every family is Complete; `REVIEW_COMPONENTS` is empty.
  - Rounds 27–29 ran on the old-format review page, https://claude.ai/artifact/KSG5sYR4ERxq9rb4cqoqSG (1×/2×,
    Before/After, verdicts in collections `components27`–`29`).
  - The archived docs build runs again, so `apps/docs/scripts/component-review.mjs` works. Build the Before with
    `node apps/docs/scripts/build.mjs` in a worktree of the old commit.
- *Layers, built in:* three axes.
  - `ground-light`: 100 (white) to 90 in 1% steps.
  - `ground-dark`: 0 (black), 8 (Default, #020202), 12 to 24.
  - `layers`: layer contrast, 0 (Flat) to 8, 4 the default.
  - Page, layers, control fills, edges and inks are derived live from those numbers and the Neutral cast
    (`packages/tokens/src/color/layers.ts`).
  - Surfaces point control fills at their own ground (`packages/styles/src/layers.css`; `data-area-ground` for app
    regions). The Inspector shows them under Color.
  - Light 100 + 4 = the old light theme exactly. Dark 8 + 4 brings cards and sidebars closer (#121212 / #0b0b0b; were
    #1d1d1d / #282828).
  - `layers.test.ts` checks every combination in every neutral. Research:
    `docs/research/layers-2026-10-16/README.md`.

**Open:**
- The owner's picks on the Layers page (https://claude.ai/artifact/5crS7DCaWEBbAjvTXYpJhn, db `layers` / `tuning`).
  It still shows the 4-step contrast; the shipped scale is 0–8.
- Whether every inset control takes Nav's rule (the row less 8, ink-only hover): Tree view, Chip, Tag, Badge dismiss,
  field actions (`docs/research/inset-actions-2026-10-16.md`).
- Found, not fixed:
  - Badge dismiss and Tag remove are a 10px box with a 12px glyph at Compact 13.
  - Chip, Tag and others press with the hover paint.
  - Code's on-colour chip still has the plate Badge dropped.
- Not run locally: the consumer check's install step (stalled; CI runs it). Not swept: every family at every Layers
  combination in the app.

## Earlier start (2026-10-15, end of session `icon-work-followup-2fcf1e`; everything merged, PRs #88–#114)

**Waiting on the owner:** eight families In review, all on one page with live specimens, what changed and why:
https://claude.ai/artifact/HwkKUmDzVH4B8eUGpjRwcD (approve in chat; record approvals in
`apps/desktop/src/content/component-status.mjs`, moving each from `REVIEW_COMPONENTS` to `COMPLETE_COMPONENTS`).

| Family | What | Spec |
|---|---|---|
| Copy button (new) | Button that copies; check for 2000 ms (uui, shadcn; ChatGPT 2016 ms), name fixed, said once; `useCopy` / `CopyStatus`. Code block, Token row, the app's copies use it | `copy-button.md` |
| List box (new) | listbox, one Tab stop, list (Menu rows) or grid (the app's icon cells); Icons, Typography (options `<weight>:<role>`), Color (Tile `option`) use it; `grid-keys.ts` gone | `list-box.md` |
| Badge (reopened) | `onColor`: Code's on-colour chip; the Color tab's badges (old 12% ink wash left 34/345 steps under AA) | `badge.md`, `docs/research/badge-on-color-2026-10-15/` |
| Nav (reopened) | `revealActions`: Board's hover / focus reveal on a row | `nav.md` |
| Context menu (reopened) | `itemSelector` + `menu(item)`, `data-context-target`; the app's PinMenu uses it | `context-menu.md` |
| Card (reopened) | pressed (`border-hover`) and `selected` (stroke-selected 2 inside, Surface-0 safe) | `card.md` |
| Titlebar, Section heading (new) | the app's bar and section titles (values unchanged); the app uses them | `app-shell.md` |

Also merged this session, no review needed: Density as one number (`28 / 32 / 36`, research `density-2026-10-14.md`);
More contrast restores Surface 0's frames (`border-width` derived from `frame-width` and `contrast-more`); Hover card
`openOnFocus` (off for the icon cells); `TableCell` / `TableHeaderCell` (`numeric`, `fit`); the Indicator React test
reads the app (suite fully green); the icon 2026-10-10 proposals closed as kept-as-approved.

**State:** PRODUCT_UI.md's open component gaps: none left. React 466/466, tokens 24,254, contracts, typecheck, playgrounds
0, CI on pull requests (#104). Not checked this session: a screen reader; forced colours by eye (List box selection
paints a background); the Electron window by eye (Titlebar's macOS 83 / 13 computed only).

**Next, in order:** (1) the owner's verdicts on the eight; (2) paint `[data-context-target]` (Finder / Notion keep the
right-clicked row marked; a hook today); (3) the app's Tile could take Card's selected rule instead of its own copy.

**Gotchas found:** the hidden preview pane fires no focus events (`document.hasFocus()` false): test keys in headless
Edge with `Emulation.setFocusEmulationEnabled` (scratch scripts were in /private/tmp). The preview server is sometimes
stopped by another session, and a stale server can hold its old port: restart `desktop` and check the port. `npm run
build` can race the preview's watcher (`ENOTEMPTY` in a dist folder): rerun that workspace. A file sync makes
" 2" copies (git refs were moved to `~/Desktop/area/.git-stray-refs-backup-2026-10-14/`; `packages/styles/dist/area
2.css` and some committed ` 2.json` captures remain). `component-review.mjs` needs the archived docs build, which fails
on the removed `ui` axis (`apps/docs/scripts/build.mjs`); review pages were built from the app's demos instead.

## CI (2026-10-15, branch `claude/ci-workflow`)

- Owner: "set up the CI workflow". `.github/workflows/ci.yml` on pull requests and `main` (Ubuntu, Node 24):
  install, build (icon lint included, so `lint:icons` isn't repeated), typecheck, tokens, contracts, icons, React,
  desktop build + playgrounds, consumer install, and a clean-tree check after the build. DEVELOPMENT.md
  "Continuous integration". `package-lock.json` synced (`@area/icons` 0.1.0, MIT) so `npm ci` matches.
- Local timings (M-series): build 242s, typecheck 33s, tokens 16s, the rest under 10s each. Linux was not run
  locally; the first run on the pull request is the first Linux check.

## Astra research folded into main (2026-10-15, branch `claude/fold-astra-research`)

- Owner: Astra (Codex) is no longer available; "fold it into this main repo". `astra/research` merged:
  `docs/research/astra/` (archive; README and INDEX say how to read it). The materials series (01–21) and the
  owner's decisions D1–D16 are in `docs/research/astra/materials/` (REVIEW.md); tasks 22–26 were never run and
  now belong to Claude sessions. Note: Elevation (2026-10-14) already owns every shadow by role, so the Material
  axis sits beside Surface and Elevation.
- Astra's React server-render tests (`astra/react-tests`): 29 files folded into `packages/react/tests`, 19 stale
  assertions updated to current intended markup. They found three real bugs, fixed on `claude/fix-caller-props`:
  Composer dropped `inputProps.className`; Popover and Tooltip with a trigger dropped a caller `id`
  (`AnchoredPopover` / `AnchoredTooltip` now take `id`, as `AnchoredMenu` does). React suite 451, all pass.
- Checks: tokens 24,254, typecheck, contracts 14, React suites as above.

## Gallery UI: one inset, cards, zoom, Fit groups (2026-10-15, branch `claude/gallery-ui-spacing-audit-e5e0d4`)

- Spacing: every region 14 in on all sides (Canvas margin 14, sections 28 apart, tile gap 12); text trimmed to cap /
  baseline. Panel bar title counts a flush seam once (panel.css). No titles over the Canvas or Inspector; the Canvas
  header holds only the view controls (PRODUCT_UI rule 14 rewritten).
- Inspector: settings grouped Color / Size / Shape / Effects; fields `soft`; Pills is a multi-select Custom select
  (new `multiple`). Dropdown windows hug their rows: `--area-menu-min-inline-size` (default 224; the app sets 128).
- Components: All shows one square card per family (Compass-style, title + copy-code button in the foot); a click
  opens the Stage. Zoom is Zoom control's new `stepper` (− Fit +; Fit or exact 50–200%). Fit scales by size group
  (≤48 tall and ≤160 tall at 125%, taller 100%) and lays stretching specimens out at their content's width + 20%
  (src/gallery/fit.ts). Colour cards are unit tiles hugging their text, short OKLCH.
- Not done: gallery tiles for CustomSelect `multiple` and ZoomControl `stepper`; Language tiles are not cards.

## Surface: one number, Borderless keeps an edge (2026-10-14, branch `claude/next-axis-9766b4`)

- Owner: "continue working on the next axis" (the Elevation session had recommended Surface after Motion).
  `axes/surface.ts`: the frame's width, `1` (Default) or `0` (Borderless), `data-area-surface="1"|"0"` (was
  outlined / borderless). New token `shadow-edge`: transparent at 1; at 0 ChatGPT's frameless-menu edge (`0 0 1px`
  black 62%, dark adds inset `0 0 1px` white 20%), listed first in the box-shadow of every surface the setting
  unframes (13 families), so the audit's open items (no edge at Borderless + Elevation 0; floats edgeless in dark)
  are closed. Card's dark-only ring (O2) replaced by it. Surface Select in the Inspector. Research:
  `docs/research/surface-2026-10-14.md`; spec log lines in 13 specs.
- Owner approved ("go with your recs"): review https://claude.ai/artifact/L4TCF2W5zcjvBK7xZmaDBN. The dark edge is
  ChatGPT's and fainter than Card's old ring.
- Checks: build, tokens 24,254, contracts 14, manifest, React 291/292 (known Indicator), cohesion 8 (pins the edge),
  typecheck, playgrounds 0. Not checked: the Electron window by eye, forced colours, a 1× display.
- Then ("go with your recs, then continue working"): the Popover arrow takes the edge as a drop-shadow
  (`shadow-edge-filter`). The Inspector's Canvas section adds the colour settings, Neutral and Accent (Selects,
  "Blue (Default)"), Action and Selection (Segmented), options and defaults read from `AXIS_PRESETS` /
  `DEFAULT_AXES`; Canvas Buttons paint the accent at Action: Accent.
- Audit items closed as not bugs: the Toolbar's 112px spill at type 16 Comfortable only appears with the tile zoom
  forced to 1 (the gallery's fit scales it to 0.70 and it fits); the Stepper's 10px is its documented behaviour
  ("overflows rather than overlaps"), inside its tile.
- Merged (PR #86). Then the audit's last open item: loops stop through a Motion token, `duration-loop` (1, or 0 at
  step 0 and under reduced motion), which multiplies each loop's period (a zero-length animation draws nothing)
  and fades the Skeleton band and the Progress stripe's gaps. The nearest scope decides, so a nested non-zero
  scope runs its loops; the `[data-area-motion="0"] .x` and per-loop reduced-motion rules are gone. Cohesion test
  pins every infinite animation to the factor (a mutation fails it). Checked live: outer 0 stops, nested 210 runs.
  Not captured: a screenshot of the stopped stripe (computed values only). Merged (PR #87).
- Then a Surface 0 sweep (headless Edge, 90 families, light and dark): left only inner seams. Fixed: subtle Code /
  Token and Token row's outline (no fill) draw a required edge via Code's `--_code-border`; the Scroll area and
  Separator demo frames are `stroke-width`. Research note "Sweep after the change".
- Found: `git fetch` fails in the shared repo on two stray refs, `refs/heads/claude/elevation-axis-gallery-e500be 2`
  and `icon-work-ea140f 2` (copies with a " 2" suffix, likely from a file sync). Moved aside 2026-10-14 (see Start here, Gotchas).
- Merged (PR #89). Verified against a static build (port 4410; 4400 was another session's server): Surface 0 sweep
  clean in light and dark, forced colours lose no frame, 1× / 2× sheets in `docs/research/captures/surface-2026-10-14/`.
  Open (owner): the dark soft edge is faint at 1× at Elevation 0.
- Merged (PR #91). Language tab: the default preset tile said "Default" twice ("1 (Default)" plus a Default
  value) for every number setting; the value now shows only where the label lacks it, and the defaults-only view
  drops the suffix. Radius's registry labels now read "0 (Sharp)" / "8 (Default)", as the Inspector's and the other
  number settings' do. Owner did not take the firmer dark edge; left as is.
- Merged (PR #92). Inspector: Contrast (System / Standard / More, a Select: "Standard" clips in a segment), writing
  `data-area-contrast` on the Canvas only (System writes none, so the OS decides). Checked: More strengthens the
  Input edge to #838383. Note: in the hidden browser pane CSS transitions never advance (currentTime 0), so a value
  read after a change can look unchanged; read with `transition: none` or in headless Edge.
- Merged (PR #93). Color tab (PRODUCT_UI rule 14): its Inspector offers Neutral, which tints the neutral ramp.
  The Neutral setting maps `--area-neutral-*` onto Cool / Warm step for step (checked equal), so with Neutral
  set, the neutral ramp's tiles, list rows, contrast filter and Inspector describe that ramp's step (a "Paints"
  row says so); the Inspector's Hex used to read the document root and disagree with the swatch.
- Merged (PR #94). Contrast sweep of the settings added since the audit (headless Edge, 90 families × 7: default,
  Contrast More light, More dark + Surface 0 + Elevation 0, purple accent roles light and dark, Cool dark, Warm
  12 Compact; WCAG 4.5 / 3 large, disabled skipped): the only failure was on-color Code on the accent solid
  (4.06-4.37:1 on 8 of 11 accents); its plate is now 8% of the ink's opposite (5.30:1 and up). No console errors.
  Headless Edge degrades after many reloads; run long sweeps in fresh processes per combination.
- Merged (PR #97). Boundary sweep under Contrast More (90 families, light and dark; CONTRAST.md's 3:1 target):
  soft fields (Input, Number, OTP, Select, Custom select, Date picker, Tag picker, Textarea, Input group) had no edge
  (fill 1.07:1) → `input-edge-soft`; Composer's frame stayed the card edge (1.16 / 1.33:1) → `composer-edge`. Both
  3.79:1 light, 5.49:1 dark at More, unchanged at standard. Left as by design: ghost fields, Segmented items (the track
  carries it), Command palette's search input, gradient slider tracks.

## All-axis audit (2026-10-14, branch `claude/elevation-axis-gallery-e500be`)

- Owner: "do an all axis check ... visual errors, inconsistencies, discrepancies, or bugs". Method: axis independence
  in the app (every token one setting moves is its own or a documented derivation), painted colours (accent reaches
  action / selection only when they are accent), a headless-Edge sweep of all 90 families × 9 combinations (default,
  dark, 12 / compact / sharp / flat / motion 0, 16 / comfortable / pill / elevation 8, the app's 13 compact dark,
  warm + purple accent dark, borderless flat, borderless dark, no pills) for clipped text, overflow, control heights,
  text contrast (1px canvas sampling), motion left at 0 and surfaces with no edge; a static code audit; forced colours
  emulated. Scripts were scratch only (not committed).
- Fixed: Switch, Checkbox and Radio now follow the type size. Their size classes set fixed 16 / 20 / 24 marks and
  overrode the 2026-10-12 type-following rule, so they never changed; check and dash drawings are now 1:1 and centred.
  Box model values took `info-solid` (4.35:1 light, 3.16:1 dark) → `fg-info`. Forced colours: frames come back at 1px
  under Borderless; the floating Toolbar gets an outline. `restoreCanvas` keeps only values its controls list (an old
  `minimal` elevation left the Select blank). Citation hover-card demo was a `<div>` in a `<p>`; Breadcrumb ellipsis keys
  collided on equal hrefs. Badge group `visibleCount="auto"` looped ("Maximum update depth") at type 12 / Compact: hidden
  badges measured 1.5px narrower inside the popover; measuring now unsets the popover's styles. ScrollToLatest and the Card carousel read the nearest motion scope. `@property` duration
  fallbacks follow the default step. Language illustrations draw control edges at `stroke-width`. Stale docs, specs and
  comments (old presets, Notion's 0 20 24 lift, axis counts, border-float #f3).
- Open (owner): Borderless + elevation 0 leaves Cards, Panels and every floating surface with no edge in light (77 in
  the sweep); in dark, floating surfaces at Borderless keep no edge (Card has a dark-only ring, floats don't). At type 16
  Comfortable the Toolbar's Segmented overflows its bar (112px) and a horizontal Stepper step overflows by 10. CSS loop
  stops are `[data-area-motion="0"] .x` descendants, so a nested non-zero scope inside a 0 scope still stops loops.
  No Surface control in the Inspector.

## Motion: one number (2026-10-14, branch `claude/elevation-axis-gallery-e500be`)

- Owner: "go with motion, same one-number approach as elevation", and labels "(Default)" / "(Flat)", not "· Default".
  `axes/motion.ts`: the Menu's open in ms (`duration-base`), 0 (None) to 300 in steps of 30; fast /
  base / moderate / slow = 2/3, 1, 4/3, 5/3 of it (150 = old Subtle exactly, 240 = old Expressive within 10ms, 300
  puts slow at Primer's 500 ceiling). Default 210 (owner, after review page
  https://claude.ai/artifact/H1ygA6Xz18xQfJYp6BZ7RM: matches ChatGPT's popover 220, Figma's dropdown 250), so every
  transition is 40% longer than before (140 / 210 / 280 / 350). Loops (Skeleton 3s, Progress 1.8s, Indicator and
  Message 1s) now run fixed measured periods instead of token multiples, which would have drifted. `data-area-motion="none"` → `"0"` in CSS, ScrollToLatest, specs; reduced
  motion resolves to step 0 (`MOTION_NONE`). Motion select in the Inspector's Canvas section. Radius, Elevation and
  Motion labels now read "0 (Sharp)", "8 (Default)", "0 (Flat)", "3 (Default)", "0 (None)", "210 (Default)".
  Docs: THEMING.md, MOTION.md token table.
- Checks: build, npm test (24,254), contracts 14, React 291/292 (known Indicator docs-dist), typecheck (all);
  preview: thumb and tokens at 0 / 150 / 240 / 300, Spinner stops at 0, Language tab lists 11 steps. Not checked:
  the Electron window by eye, dark mode, a menu opening at each step by eye.

## Icons: counterpart map completed, coverage re-measured (2026-10-14, branch `claude/icon-work-ea140f`, PR)

- Owner: "continue the icon work". Coverage by use, re-measured against Lucide 1.57 / Phosphor / Fluent / Hugeicons:
  product UI coverage is complete; the 15 concepts all four draw that Area lacks have no product surface (backpack,
  pill, tent …), and the rest are the audit's excluded classes (vehicles, food, animals, medical, sport). No new
  drawings; a further round needs a use (production-gaps README item 8).
- Found instead: 211 icons (everything drawn after the 2026-10-02 audit) had no `area-map.json` entry, so migration
  search missed them (Lucide `toggle-left`, `user-x`, `message-square-off`). All mapped (723 names, checked to exist;
  spec "Keywords and names", "Map completed"): names Lucide 711 → 747, Fluent 559 → 644, Phosphor 530 → 585 of 808.
  Fixed three old entries (arrow-right-to-line, sort-ascending / -descending's Fluent) and signal-low / -medium's
  Fluent citations (`cellular_data_N` counts down). `keywords.json` rebuilt; crown "premium", utensils "knife" kept.
- Checks: `npm run build`, typecheck, icons tests 10/10; app Icons tab: `toggle-left` finds Toggle Off.
- Then the optical audit's outliers: qr-code (+15% size, +36% density), diamond (−15%), gamepad (+8%) redrawn as
  candidates (`docs/research/icon-review/2026-10-14/`, not in `sources/`), plus a question on the 295 icons with long
  whole-pixel strokes (soft at 1×). **Waiting on the owner:** review page https://claude.ai/artifact/MZqhevHfrGVHhDANQLaKcA,
  verdicts in its `verdicts` collection (ArtifactData list). On approval: copy the candidate over the source, drop
  qr-code's `data-gap="aligned"` rule note, regenerate, record (spec, batches.json stays approved only after the owner).
- Owner's verdicts (round 1): qr-code, diamond, gamepad approved → in `sources/`; "fix the frames" → 242 icons moved
  onto half pixels for 1× (spec "Optical outliers and 1× frames"), owner-approved (both batches, no flags). Rounds 3 (31 icons) and 4 (18 half-unit redraws) owner-approved;
  centred lines stay symmetric (owner: "leave"). 37 icons stay soft at 1× by construction.
- Fixed: `generate.mjs --only … --emit` stopped on the `rtl.json` check; `2026-10-07/look.mjs` still calls the removed
  docs generator (README there has the workaround).

## Elevation setting (2026-10-14, branch `claude/component-display-ui-research-11dc77`, PR)

- Owner: "add elevation as an option", then "toned down ... a naming convention similar to the existing axis ...
  2px scale for corner radius, 1px scale for typeface ... look into each component". Axis `elevation`
  (`packages/tokens/src/axes/elevation.ts`): one number, 0 (Flat) to 8, default 3 = the Menu's shadow in %. Five
  roles components name (`shadow-control`, `-resting`, `-tooltip`, `-float`, `-modal`); geometry fixed per role
  (Fluent tiers 2/4/8/16/28), key = step × weight %, ambient half, dark doubled; anchors 3 Notion chip, 5 Notion
  popover, 8 ChatGPT menu. Every role two layers; step 0 transparent. Dialog, Drawer, Command palette are modal;
  Scroll to latest now floats. Surface axis is stroke only (Outlined / Borderless). Per-component audit and research:
  `docs/research/elevation-2026-10-14.md`; rule: DESIGN_SYSTEM.md "Elevation". App: Elevation select (0–8) in the
  Inspector and on the Language tab. Review page: https://claude.ai/artifact/43C4ijRqFNdwoXmmKTBVcb.
- Composer takes the resting role (owner, "go with your recs"). Not built: a drag role; an automatic step under prefers-contrast.
- Checks: npm test (24,254), contracts 14, cohesion 8, React suites (Indicator's known docs-dist failure only; a
  run raced the preview watcher's package rebuild, so stop the preview before the full sequence), desktop
  typecheck and build. Not run: build:docs / audit.

## Minimal elevation (2026-10-13, branch `claude/component-display-ui-research-11dc77`, PR)

- Owner: "an extremely subtle, very minimal shadow system ... i barely want to see any shadows". Captures
  (ChatGPT, Notion light and dark, Cursor's bundle) and the decision: `docs/research/elevation-2026-10-13.md`;
  rule: DESIGN_SYSTEM.md "Elevation". Outlined (default): `shadow-card` none (Card, Panel, Board card),
  `shadow-float` Notion's small chip (0 8 12 / 0 2 6 at 2.7%; dark one 8% layer), Tooltip no drop shadow,
  floating Toolbar on the shared lift with a real edge, `border-float` light 75 → 100. Raised / Elevated keep the
  old recipes. Review: https://claude.ai/artifact/7mmvZzP8CZCG8gpUxZR8fv (Before / After, light and dark).
- Checks: npm test (24,254), contracts 14, cohesion 8 (now pins the minimal default), React suites (Indicator's
  known docs-dist failure only). Not run: build:docs / audit.

## Component Stage (2026-10-12, branch `claude/component-display-ui-research-11dc77`, PR)

- Owner: research how component pages and playgrounds show a component, then "go with your recommendations".
  Research and decisions: `docs/research/component-stage-2026-10-12.md`. The grid stays the overview; a family
  opens as a Stage (`src/stage.tsx`): the tile on it at real size, code attached, the family's tiles in their
  groups below (small groups share a row), then Props, Anatomy and States from the manifest. Properties in the
  Inspector for Accordion, Badge, Button, Checkbox, Chip, Count, Input, Spinner, Switch and Tag
  (`src/content/playgrounds.tsx`, generated from `manifest.ts`); `npm run check:playgrounds -w @area/desktop`
  checks every mapped tile against its demo (0 mismatches). Double-click, ⌘↓ or Open to open; Escape,
  ⌘↑, ⌘[ or All to go back with the tile revealed. `#components/<family>/<tile>`.
- Demo source for the code is main's `scripts/snippets.mjs` (`virtual:demo-snippets`); this branch fixed its
  first-line indent. Merged main on 2026-10-13 (the Stage's Inspector takes main's Copy code / Copy import and facts).
- Tiles (owner, 2026-10-13: "corner radius sharper, the text label larger, the margin/padding can be smaller"):
  corner 20 → 12, inset 16 → 12, label text-xs (11 at the app's 13) → text-sm (13), so component and colour
  tiles share one label size.
- Checks: desktop typecheck and build; browser preview at 1440 (light, dark, compact; Button, Badge, Menu, Confirm
  dialog; Properties, Escape / ⌘↓ / ⌘↑, reveal, width handle). Not verified: the Electron window, docs build.

## Icons: last three approved, MIT licence, no Figma library (2026-10-14, branch `claude/icon-work-status-d12c1f`)

- Owner approved grip, padding-side and sides as drawn (batch 4): 808 of 808 approved, `@area/icons/review` is empty
  (generator writes `export {}`). Owner chose MIT for Area's drawings: `packages/icons/LICENSE` (copyright Ethan Wong),
  `"license": "MIT"`, shipped in `files`. Owner dropped the Figma library and a separate catalogue: the app's Icons tab
  is the catalogue. Spec "Versions, deprecation and credits"; production-gaps README items 1, 6, 7.
- Checks: `npm run build`, icons tests 10/10, typecheck (all), consumer test; app Icons tab shows padding-side Approved.
- Integrations: File upload demos pass file-type icons through `icon` (spec feedback log); Search field already used
  dismiss-circle (spec table row fixed). Not adopted: calendar-range in Date range picker, tag-plus in Tag picker's
  create row, chevron panel toggles (reasons in the production-gaps README).
- Left: coverage by use, deleting the docs site's Fluent copy with the site, pixel nits
  (kanban, form, heavy qr-code / calculator / gamepad).

## Icons: 12px cuts (2026-10-13, branch `claude/icon-work-2974ee`, PR)

- PR #79 (pipeline into `packages/icons`) had merged into the already-merged `claude/icon-work-status-38f2b6`, not
  `main`; this branch merges it, so it reaches `main` with this branch.
- Production gap 5: 9 cuts in `packages/icons/sources/12/` (chevron-down, check, add, info, open, link, bell, arrow-up,
  globe = Fluent's), chosen by measuring every 12px icon slot in the gallery. Fluent's 12 grid, lines on half pixels;
  add / arrow-up / info / link sit 0.5 off centre so their centre line stays one pixel. Generator: `size === 12` draws
  the cut (`sw12`), turns follow, `cuts: [12]` in meta, `svg/12`. Glyph: both drawings, base.css shows the cut where
  the xs slot is 12 (new token `--area-type-icon-xs-cut`, override `--_glyph-cut`; Panel md sets 0). Spec "12px cuts";
  sheet in `docs/research/icon-review/2026-10-13/`. Owner approved the cuts ("go with your recommendations");
  `@area/icons` at size 12 is slot-aware like Glyph (`cutOpacity`, `sw`), and Badge / Tag demos pass `size={12}`.
- Checks: icons 9, React 274/275 (known docs-dist), tokens 24,254, contracts 14, manifest, typecheck; app preview
  (Link mark at type 13 / 16, Icons grid at 12). Not checked: forced colours, a 1× external display.
- Then production gap 9 for the app: demos import `@area/icons` names (78 pass-throughs, nothing renders differently),
  Copy / SVG export in `apps/desktop/src/copy.tsx`, the docs-only Iconography demos in `content/registry-docs.tsx`
  (the docs render reads it); the app bundle has no Fluent ink (4.66 → 2.91 MB). Spec "Fluent map retired from the app".
- Then gap 6 minus the licence: `@area/icons` 0.1.0, `CHANGELOG.md`, semver / deprecation policy (README), credits
  (`data-source` → meta `source`, `packages/icons/THIRD_PARTY_NOTICES.md`: Fluent's globe in globe, globe-off). Open: the
  licence for Area's own drawings (owner).
- Found: `npm run build:docs` fails on `main` since PR #75 (`build.mjs` reads the removed `ui` axis); not fixed (archived).
## Compass review → Password field, OTP field, Time field, Stepper, Spinner value (2026-10-13, branch `claude/design-compass-components-cfd9eb`, PR)

- Owner reviewed compass.designcompass.org ("anything worth using/building?"). Gallery tile Copy/Reset and the app at
  type 13 / Compact / radius 10 were handed to the **gallery** session: type 13 / Compact is on main (PR 75); Copy/Reset
  (`apps/desktop/src/actions.tsx`) and radius 10 sit uncommitted in its worktree (`icon-hover-card-button-variant-c2d0bf`)
  as of this merge. Research: `docs/research/compass-components-2026-10-13/`.
- All Complete after review rounds 24-26 (`components24`-`26` on https://claude.ai/artifact/KSG5sYR4ERxq9rb4cqoqSG);
  nothing in review:
  - **Password field**: Input + an eye / closed-eye InputAction ("Show / Hide password", in the Tab order, caret kept),
    hidden again on submit. Input's "Password" tile now renders it.
  - **OTP field**: Input-shell slots (8 apart, groups, mask, alphanumeric) over one transparent real input: autofill,
    paste cleaned of spaces and dashes, a caret before a character selects its slot.
  - **Time field**: spin-button segments in Input's shell (React Aria keys), the editing segment on `selection-surface`
    with the field's ink, plates hanging 2 so digits sit at Input's inset and read "9:30 AM"; `step` adds ChatGPT's
    list of times (Menu check rows, centred on the value); chevron `tabindex=-1`, Alt+Down opens (Combobox).
  - **Stepper**: `ol`, `aria-current="step"`, Timeline's geometry (24 column, text 36 in, 400, its divider line 4 short
    of markers); upcoming Checkbox ring, current the Selection fill, done a Selection ring + check.
  - **Spinner `value`** (was the Progress circle family, owner: "is this not the same as spinner?"): the ring stopped at
    a value, progressbar or meter (Cursor's context and review rings), linear value motion (MOTION.md progress).
    Open: Progress's bar still eases out on value change.
- Glyphs `eye`, `eye-off`, `clock` added to the component set (`gen-pilot-icons.mjs` PACKAGE_GLYPHS). Captures:
  ChatGPT's schedule time list and Figma's sign-in (redacted), Mantine, Area 1:1 light and dark via headless Edge.
- Checks: build, typecheck, npm test (24,251), React 291/291, contracts, build:docs, diff check. Not verified: the
  Electron window, forced colours, screen readers, Time field on touch keyboards, SMS autofill.

## Preview frame (2026-10-13, branch `claude/component-work-1c5100`, PR)

- Owner: "continue the component work" → Preview frame, the inspector plan's last part (PRODUCT_UI gap "an Inspector
  preview well"). Approved in round 22, then the owner: "share the same visual as the component container, with a
  white background and light stroke?" → default ground `bg-surface` in `border-card` (the tile's); `ground="subtle"`
  keeps the grey well; checker and colour keep the swatch ring. Round 23 (`components23`): approved → Complete;
  nothing in review. `PreviewFrame` (`aspect` square | landscape | wide, `ground` subtle | checker, `color`
  over the checker, `label` → role img): `bg-subtle`, `radius-container`, swatch ring inside, 12 inset, content
  contained and only scaled down, media corners nested (4). 6 tiles, docs entry, tests (3). Spec
  `docs/specs/preview-frame.md`; Figma Assets captured read-only (tile rest / hover, folder row: its well renders
  radius 5, inset 6; drawn at 2× and scaled 0.5) plus Area light / dark in `docs/research/captures/preview-frame/`.
- The app's icon and colour Inspectors now use it (`studio-icon-preview` / `studio-color-preview` removed).
- Fixed in passing: the app never served `/images/` (Electron loads `file://`; the preview server fell back to the
  page), so Avatar, Chip, Popover and Asset row photos were broken in the app. `renderer.mjs` copies
  `apps/docs/public/images` into `dist/images`; demos use relative `images/…` paths.
- Review round 22 (`components22`) published to https://claude.ai/artifact/KSG5sYR4ERxq9rb4cqoqSG (6 new, 0 changed;
  Before = main at 0b8dafc). Checks: build, typecheck, npm test (24,251), React 272/274 (the 2 known docs-dist
  failures), contracts 14, build:docs + audit, diff check. Not verified: forced colours, Electron window (browser
  preview and headless Edge only).

## Consistency and cohesion pass (2026-10-12, branch `claude/component-consistency-pass-7bd512`, uncommitted)

- Owner: "a consistency and cohesion pass on all the components ... stroke values and how they are used". Report:
  `docs/research/consistency-audit-2026-10-12.md` (every declaration of 69 stylesheets catalogued; 18 findings, 5 open
  questions O1–O5 for the owner). New rule, DESIGN_SYSTEM.md "Strokes": `stroke-width` for required lines (controls,
  state, swatch rings, cutouts, joined seams, `border-divider` rules, frames with no shadow), `border-width` for frames of
  shadowed surfaces, their seams and filled shapes; guarded by two new tests in `cohesion.test.mjs`. 21 stylesheets.
- Visible changes, reopened (REVIEW_COMPONENTS): Badge modern edge `edge-selected`, Board card actions `border-float`
  frame, Chip swatch takes the swatch ring, Select picker `border-float` (dark), Tree view check `edge-control-hover`.
  Everything else paints the same at default (Elevated / increased contrast differ). Review round 21 (`components21`)
  published to https://claude.ai/artifact/KSG5sYR4ERxq9rb4cqoqSG; Before = be98603's gallery.
- Checks: build, build:docs, npm test (24,251), React 271, contracts 14, typecheck, contrast report.
- Owner then: "go with your recommendations" (O1–O5 done: nested pill controls ring at 0; Card keeps a dark edge under
  Elevated via an `stroke-width − border-width` outline; Empty state md title `title-xs`; Meter 500 named in the weight
  rule; new roles `bg-mark(-hover)`, `border-card`, `fg-quiet`, `edge-control-strong`). Board: hover 6% (Notion measured
  read-only: hovered card = its column's tint), add row 6 / 9%, column corner concentric (20), actions plate 4. Badge
  approved in round 21 → Complete; Empty state reopened. Round 21 republished (same collection, Badge's verdict kept).
- Round 21: owner approved all seven (Badge, Board, Chip, Description list, Empty state, Select, Tree view), open
  questions on the recommendations (Board, Description list: keep as built). Nothing in review.

## Description list show more; PR (2026-10-12, same branch)

- Owner: "use Design-system evidence: build it from Ant Design, Polaris, Primer and similar collapse patterns ... then open
  a pr and merge it". Survey `docs/research/show-more-survey.md`. `DescriptionList` takes `visibleCount`, `expanded` /
  `defaultExpanded` / `onExpandedChange`, `moreLabel` / `lessLabel`: hidden rows keep `hidden`; a "Show {n} more" /
  "Show less" button after the `dl` (`__more`, `__more-label`) with `aria-expanded` / `aria-controls`, a rotating 16
  chevron in the term's icon slot, muted 400, underline on hover. Gallery tile "Behavior / show more" (hydrated:
  `switch-client.tsx` now also loads description-list and inspector demos). Description list is In review.
- The gallery's prod bundle can be cached by the browser after a rebuild: load it under a fresh name to check hydration.
  Pre-existing: Date range picker demos mismatch on hydration (their date text), and React regenerates them.

## Rounds 18 → 20: palette outline (2026-10-12, same branch)

- Round 18 rethink with an iOS colour-grid screenshot ("maybe just an outline that goes around the swatch") → selected =
  white outline straddling the cell, radius-min, cell raised, a fixed black 15% line inside; round 19 "is the stroke
  thickness correct?" → pixel scan of the owner's screenshot: ring 3.5 of a 35 cell (10%), ~2.5 out / 1 in → Area 2px
  (1 out, 1 in). Round 20: approved. Nothing is in review (`REVIEW_COMPONENTS` empty).
- Description list "show more": Dev Mode's List view is unreachable under its dialog; Notion shows "N more properties"
  only for databases with hide-when-empty properties (the owner's "tasks" pages show all), and setting that up changes
  the owner's data. Waiting on the owner for a fixture or a go-ahead on design-system evidence.
- All of today's work (Box model rounds, Code block sm, Token row, Asset row, swatch ring, colour picker and palette
  states, the Dev Mode recipe, EXIF strip) is uncommitted on this branch.

## Round 17 → 18: palette states (2026-10-12, same branch)

- Round 17: Color picker approved (COMPLETE). Color swatch picker rethink (palette: "looks odd, can you look at other
  real examples and how they do the hover/selected state") → survey `docs/research/swatch-palette-survey.md` → palette
  hover `inset 2px bg-surface + 1px swatch ring`, selected `inset 2px fg-selection + 2px surface + 1px swatch ring`;
  no outer edge, z-index raise or radius. Round 18 published (1 changed tile).
- Also: the review page's `.wrap select` chrome rule leaked into Select specimens (overlapping chevron); now
  `:not(.canvas *)`. The dev server stalled once on restart; `apps/docs/dist` served with `python3 -m http.server` works.
- Open: a selected corner cell's ring is clipped by the palette's rounded corner; hover on dark cells in dark mode is faint.

## Round 16 → 17: Color picker thumb edge (2026-10-12, same branch)

- Round 16 (`components16`): Asset row, Code, Color field, Color swatch, Panel, Property list approved (COMPLETE); Color
  swatch picker approved, then reopened for the palette change below. Color picker changes: "the slider circle
  transparency on the outer stroke is kinda odd? ... is the color selected state correct/consistent? what are the selected
  states for things like that and inputs when typing" → thumbs: outer edge opaque `border-subtle` (was black 20%, which
  changed colour where the 16 thumb meets the 16 track), inner edge the swatch ring; the palette's selected cell the same.
  States answered in color-picker.md "States compared" (selection = neutral `fg-selection` ring; focus and typing =
  `focus-color`; no change).
- Round 17 (`components17`) published: Color picker 13 changed, Color swatch picker 1 (layout-palette).

## Round 15 → 16: swatch ring (2026-10-12, same branch)

- Round 15 (`components15`): Token row approved (COMPLETE). Asset row changes: "should the image be full container?
  should there be a light stroke too?" → images `cover` the 40 well (icons stay centred), a 1px ring over the well.
- Owner: "yes apply the swatch fix" → `--area-token-swatch-ring` (tokens emit/base.ts) is
  `light-dark(rgb(0 0 0 / 0.1), rgb(255 255 255 / 0.1))`, drawn over the colour: Code's swatch (its inset shadow),
  ColorSwatch (root `box-shadow`, inherited by the colour layer; layers now fill the shape, `--_edge: 0`), Asset row's
  preview (`::after`). Token tests (24,251) pass.
- The ring changes swatch tiles in 7 approved families; reopened: code, color-swatch, color-field, color-picker,
  color-swatch-picker, panel (also shows the Dev Mode recipe, new), property-list. Each spec has a "swatch ring" review note.
- Round 16 (`components16`) published; Before = main 9e613c1's gallery + round 15's Asset row, styled by round 15's CSS:
  29 changed (exactly the swatch tiles and Asset row), 1 new, 28 unchanged.

## Round 14 → 15 (2026-10-12, same branch)

- Round 14 (`components14`): both rethinks. Token row: "1 cohesive backplate, just styled like the existing token
  component? ... outline only as a style is acceptable" → the row carries Code's token classes (`area-code
  area-code--swatch area-token-row`), widened, value at the end; `outline` boolean. Asset row: "look up other asset rows,
  not just figma" → survey `docs/research/asset-row-survey.md` (Penpot, Material 3, shadcn, Untitled UI, Fluent,
  Polaris, Carbon, Atlassian, Zeplin; source at pinned commits) → 40 preview inset 8 in a 56 row, 12 gap, name strong,
  action visible.
- Owner asked why the swatch stroke shows only at corners: the edge is `bg-component` (#f7), merging with the light
  ground on straight edges; corners antialias edge and fill on one curve, leaving grey fringe. Proposed (not applied,
  needs the owner): a translucent ring over the colour, as Figma's, for Code's swatch and ColorSwatch.
- Round 15 (`components15`) published; Before = round 14 (from the live page's data.js and area.css).

## Dev Mode inspector recipe; EXIF (2026-10-12, same branch)

- "Link row" not built: Dev Mode's header rows are a muted 16 icon + text/Link, which Link (standalone, muted) already
  covers. Instead the plan's last step: Panel tile "Recipe / Dev Mode inspector" (`demos/inspector.tsx`,
  `GalleryPanelDevMode`): header rows, Box model, Code block sm, copyable Token rows, an Asset row with download, in a
  280 Panel sm. Panel is Complete, so it isn't on the review page (screenshots sent to the owner instead).
- Owner asked (side task): `apps/docs/public/images/david-tee.jpg` stripped of EXIF (iPhone, GPS, date) and IPTC; JFIF +
  Display P3 profile kept, pixels byte-identical (121,475 bytes, was 122,591). The original stays in git history (commits
  11df493, e86180b): owner's call. `chip-filter.png` carries a C2PA "made by OpenAI gpt-image" credential (left in).
- The session scratchpad was cleared mid-session; review builds are regenerated from `component-review.mjs` when needed.

## Round 13 → 14: Token row rethink, Asset row (2026-10-12, same branch)

- Round 13 (`components13`): Box model approved (COMPLETE). Token row rethink: "looks long, how does this fit in to the
  existing token component?" → rebuilt on Code's token (hugs the name, its own swatch), value muted at the end of a 32
  row; no box, swatch or icon slot of its own. Demos use Area palette tokens (the docs audit rejects literal hex).
- Asset row (new, in review): `AssetRow` (`preview` URL or element, `previewAlt`, `name`, `meta`, `actions`): a 48 well
  (`bg-subtle`, `radius-small`) in a 56 row, text 16 after it, 12/16 name and muted meta. File upload item was not a fit
  (an upload card with progress). 5 tiles, docs entry, tests (2).
- Round 14 (`components14`) published: Token row (4 changed, 1 new) and Asset row (5 new), Before = round 13.
- Next: Link row from the layer-header capture (16 icon + 8 + text, rows 16 apart); Description list "show more" needs
  Dev Mode's List view (not reachable under the dialog).
- Note: `apps/docs/public/images/david-tee.jpg` carries iPhone EXIF with GPS data (pre-existing, not changed here).

## Token row; review rounds 12 → 13 (2026-10-12, same branch)

- Round 12 (`components12`): Code block approved (back in COMPLETE). Box model needs changes: "no dashed lines, the outer
  container can be its own unique radius, that matches whatever component family it should be. but the inner radius
  should be round. maybe" → solid `border-subtle` margin stroke at `radius-container` (12); inner corners kept 12 / 8 / 6;
  content stroke in the tone's border.
- Figma Dev Mode measured with the automation window in front (the copy's pages render only once visible; Component
  Overview page, a "Section Header" instance; Dev Mode behind its dialog, then "Back to Design Mode"). Captures in
  `docs/research/captures/inspector-rows/` (6, redacted): token row, colors group, asset row, assets panel, layer header,
  Ready-for-development list row. Asset rows: 56 tall, a flush 56 grey preview square, details 16 in; layer header rows:
  16 icon + 8 + text, 16 apart (Link row basis). The List / Code toggle isn't reachable under the dialog ("show more").
- Token row (in review): `TokenRow` (`name`, `value`, `swatch` → ColorSwatch sm, `icon`, `copyable` / `copyText`),
  `token-row.css` (control-xs ringed row, `border-divider`, `radius-small`, 12/16), 6 tiles, docs entry, tests (2).
- Round 13 (`components13`) published, same link: Box model (4 changed) and Token row (6 new), Before = round 12.
- Next: Asset row (with a Preview frame as its media) from the asset captures; Link row from the layer header.

## Review round 11 → 12 (2026-10-12, same branch)

- Round 11 (`components11`): both rethinks. Box model: "background can still be gray ... strokes at every container
  level just the colors can be different ... i do like the margin in a box with lines ... corner radius rounder and the
  layer shapes bigger". Applied: margin `bg-subtle` inside dashed `border-hover`; inset 1px strokes per level
  (border `edge-control`, padding the tone's strong border, content `border-subtle`); rings `control-md` 32; corners
  16 / 12 / 8 / 6. Code block sm: "inset corner radius for the copy button is not correct" → corner = copy radius +
  inset + border (6 + 3 + 1 = 10, compact 9), header copy at the same inset (header 35).
- Round 12 (`components12`) published, same link; Before = the round-11 page (a fake dist in the scratchpad built from
  its data.js and area.css): 6 changed (4 Box model, 2 Code block sm), 11 unchanged.
- The browser pane was hidden, so visuals were checked as headless Edge screenshots (light and dark at 2×).
- Chrome: the automation window (tab "Foundation Doc Assets (Copy) – Figma") stays `hidden` even with Chrome in
  front; it is a separate window. Figma Dev Mode work waits for that window to be brought forward.

## Code block size sm (2026-10-12, branch `claude/component-work-afb752`)

- Owner: "continue the component work". No verdicts in `components11` yet. Chrome's window was hidden
  (`visibilityState` hidden), so Figma Dev Mode's preview / properties sections couldn't be measured; the part with
  captures in hand went first: Code block `size` sm (the inspector's code well; Dev Mode's code from the Box model
  captures): 12/18 mono (compact 12/16), 8 insets (6), gutter 28 with numbers 4 in (24), header 2 + Button sm + 2,
  copy 3 from top and end. md is byte-identical (review diff: 11 unchanged, 2 new). Root-level `--_code-*`
  properties now carry every metric; `.area-code-block--sm` overrides them. Back In review (removed from COMPLETE).
- Review page republished (same link, still `components11`): Box model keeps its round-10 Before (spliced from the
  live page's data.js and area-before.css), Code block's Before is main at 9e613c1.
- Open: md's floating copy uses a literal 12 inset, so in compact it sits 4px low against line 1 (8 inset); left as
  is (approved family). Next inspector parts need Chrome in front: Preview frame + Description list "show more"
  (Figma's well rgb(245,245,245) radius 5), Link / Asset row, Token row; then the inspector rebuild.

## Icons: pipeline moved to packages/icons (2026-10-12, branch `claude/icon-pipeline-package`, on top of PR #78)

- Migration step 2 done (see "Migration" below; spec "Pipeline moved to packages/icons"). npm scripts keep their names;
  new `icons:refs`, `icons:keywords`. The generator now checks categories (was in the docs build). The reference cache
  is `packages/icons/.cache/refs` (gitignored); move or refetch it in other worktrees.
- Generated drawings byte-identical (only header comments changed). Checks: full lint + generate, `npm test -w
  @area/icons` (8), typecheck (all), consumer test, tools smoke-tested (find, geometry, generate --only, keywords);
  app checked in the preview (Icons tab 808 icons, Empty state demo).
- Pre-existing, not fixed: `npm run build -w @area/docs` fails on main since 00770d8 (the docs inspector still asks for
  the removed `ui` axis in several places); the site is archived and due for deletion (step 4).

## Icons: accessible name, right-to-left, keywords (2026-10-12, branch `claude/icon-work-status-38f2b6`)

- Owner: "continue working with your recs" → production gaps 3 and 4. Reviews were clear first (all 410 `reviews7`
  rows decided; 805 of 808 approved, the 3 left — grip, padding-side, sides — aren't in batches.json).
- **API** (spec "Accessible name and right-to-left"): decorative by default; `title`, `aria-label` or
  `aria-labelledby` → `role="img"` (title becomes aria-label, no `<title>`). 23 reading-direction icons
  (`assets/area-icons-pilot/rtl.json`, from Fluent's and Material's published lists and the guidance) carry
  `data-area-rtl="mirror"`; `[data-area-rtl="mirror"]:dir(rtl) { scale: -1 1 }` in `@area/styles` base and
  `@area/icons/rtl.css`; `mirrored` true/false overrides. One `root()` helper in the generator's RUNTIME.
- **Keywords and names** (spec "Keywords and names"): `apps/docs/scripts/icon-keywords.mjs` →
  `keywords.json` (committed; Lucide 1.55.0 and Phosphor 2.1.1 tags, area-map counterparts, measured word swaps,
  demo labels, Area words in `keywords-area.json`). Metadata gains `keywords`, `names`, `rtl`; the app's Icons search
  reads them and the Inspector shows a Search section and "Right to left". `icon-refs.mjs fetch` now also fetches
  `@material-symbols/metadata`.
- Checks: `npm test -w @area/icons` (8, 3 new), build, typecheck, manifest parity, consumer test; app checked in
  the browser preview (search "user" / "close" / "redo", Inspector, `dir=rtl` computes `scale: -1 1`). Not checked:
  a real RTL page in the Electron window, screen readers.
- Next on the production list: 12px cuts, licence and semver, Figma library, moving the pipeline to `packages/icons`.

## Icons: review round 12 and the optical size pass (2026-10-12, branch `claude/icon-divider-symbol-2b41bc`)

- Every letter and number icon re-reviewed (53, all approved after at / quote / sort-alpha / strikethrough redraws);
  divide redrawn on Lucide's proportion; the 43 round-11 redraws reviewed and settled; optical size pass (11 frames that
  filled the whole keyline brought to the shared frames; rule in the icon skill). 805 of 808 icons approved; the 3 left in
  review are unchanged drawings awaiting a verdict.
- Review page (https://claude.ai/artifact/4sGs7JYAfNQexTPW9TQR9w, `reviews7`) gained Side by side (filled together,
  letters by tier, set notes in `setnotes`) and an in-a-row strip. Data: `docs/research/icon-review/2026-10-11/round12-data.mjs`
  (refuses to build from stale components; `BEFORE_TSX` and fixes JSON for redraw rounds). Record: spec "Owner review
  round 12" … "12h", "Optical size pass"; READMEs in `docs/research/icon-review/2026-10-11/` and `2026-10-12/`.
- Recorded exceptions: globe and globe-off are Fluent's ink exactly (solid shapes, owner); keyboard-off keeps all keys
  under the slash (`data-gap="slash"`, new in the generator). Open calls: qr-code, calculator and gamepad stay heavy
  (constructions you set); kanban 0.5 right of centre; form's middle line on a whole pixel.

## Round 9 approvals; inspector components begin (2026-10-12, same branch)

- Round 9 (`components9`): Badge, Board, Editable text, Timeline approved (Complete; page and chat agree).
- Owner: "keep working, start on the inspector components" (the Dev Mode reference, parts A–J; plan: Box model,
  Preview frame + Description list "show more", Link row / Asset row, Token row + compact Code block, then an
  inspector rebuild). Dev Mode is paywalled on the owner's plan, but its real layout renders behind "Upgrade to
  Professional" with placeholder bars: measured from there (Layer properties box model, List / Code tabs, CSS picker,
  code heading and well), then switched back to Design Mode. Captures in `docs/research/captures/box-model/`.
- Box model (in review): `BoxModel` (margin / border / padding per side, `radius` per corner, width × height, `caption`,
  `labels`, tone info | neutral), 4 tiles, docs entry, tests. Round 10 rethink ("more like area ... not just copying
  figma"; corners inset equally) → redrawn: dashed margin outline, plain values (spacing in the tone's ink), square
  `control-xs` rings, Margin / Border / Padding labels, corner radii by cap box at (ring − 1cap) / 2 (7.7 from both
  edges, measured). Round 11 (`components11`) published; its Before came from the live round-10 page's data and CSS.
- Next: the remaining inspector parts. Evidence notes: Figma's "well" (`common--well`, rgb(245,245,245), radius 5) is
  shared by the box model and should be the Preview frame's basis; the code well is a 1px rgba(0,0,0,.1) ring, radius
  5, an 8-top 20-wide line-number gutter at 30% ink, 11/18 Roboto Mono lines (compact Code block basis); the List /
  Code toggle is 24-tall tabs, selected rgb(245,245,245) 550; the language picker a 24 hug select with a 1px ring.

## Review round 8 → 9 (2026-10-11, branch `claude/accordion-sizing-centering-5e1980`)

- Round 8 (`components8`): Citation and Search field approved (Complete). Board needs changes (coloured card hover),
  Badge rethink (smaller icons, less side spacing), Editable text rethink (not discoverable), Timeline rethink (chat
  references: Linear activity, an activity feed, a run log; bare icons, gaps at the marks, dates too small).
- Applied: Board card hover = column colour at 8% over the surface; Badge icon slot 12 at every size (Untitled), icon
  centred in the pill end again (md 4 from the end); Editable text hover plate (`bg-hover`) + `hint` Tooltip; Timeline
  bare icons in `--_mark-ink`, the line 4 short of each mark (`--_mark` by kind via :has), one line "title · meta ·
  time" at 14/20 muted, titles 400 (new elements `line`, `sep`).
- Round 9 published (same link, `components9`), Before = the round-8 build (scratchpad `before9-dist`). Board and
  Editable text changes are hover-only, so the page lists them unchanged; their notes say to hover.

## Accordion framing, Timeline, Badge icon side, gallery 1:1 (2026-10-11, branch `claude/accordion-sizing-centering-5e1980`)

- Accordion (owner: "looks off center and also moves when i interact"): gallery framing only, component unchanged.
  Tiles were a centred flex row, so a plain item shrank to its text and re-centred on toggle. Now every tile is a fixed
  240 frame with a hidden inert "tallest" copy behind it (build.mjs `demoMarkup`), as shadcn's preview pins the top.
- Timeline (in review): `Timeline` / `TimelineItem` (dot, icon or media marker in a 24 column, 1px divider line at
  11.5, text at 36, title 14/20 500, meta 12/16 muted "time · meta", body), 5 tiles, docs entry, tests. Evidence:
  Figma's version history and Notion's page updates (read-only, redacted). Chrome's window went hidden mid-capture:
  the clipboard fails then, but `get_page_text` reads a temporary off-screen `<article>` holding the capture JSON.
  Local-network fetches from product pages are blocked (Chrome would prompt); the built-in browser can POST to a
  127.0.0.1 relay.
- Badge (owner: icons too close to the side): icon side = text side − 2 (Untitled 6 / 8) in inset.css; back In review.
- Gallery (owner: closer to actual size, minimum container sizes, gaps −2/4): fit MAX 1 (was 0.8), tile min 300,
  canvas/grid gaps 6, tile padding 8, view padding 20 / 28. 589 of 892 tiles now show at 1:1. Wide compositions
  (Toast 360, Meter's 384 frame, dialogs) still scale.
- Owner: "keep working, what are your recs for the open questions" → Timeline recs: keep the default dot; no
  success / danger tones until a product uses one. Review page republished (same link, still round `components8`, no
  verdicts there yet): Board, Citation, Search field (Before = the live round-7 Before, kept), Badge (8 icon tiles
  changed), Timeline (new), Editable text (new). Accordion stays Complete (gallery framing only).
- Editable text (in review): `EditableText` (`label`, value / defaultValue / onValueChange per commit, `activation`
  dblclick | click | focus, Enter / F2 opens from the keyboard, Enter commits, Escape cancels, blur commits, IME-safe,
  `fill`, `placeholder`, `defaultEditing`, `inputProps`), `editable-text.css` (8 side padding in both states, field
  width 0 / min 100% so it takes the hidden draft's width), 7 tiles (hydrated through switch-demos), docs entry, tests.
  Evidence: Figma layer rename (double-click, Escape), Notion database title; ChatGPT's Rename field not captured
  (its tab hung with the chat menu open; nothing renamed).
- Scratch: a detached worktree of 8dfb834 sits in the session scratchpad (`before/`); removing it was declined, run
  `git worktree prune` after the scratchpad is cleared.
## Icons: approvals synced, review reopened, @area/icons (branch `claude/icon-work-01002a`)

- Every review-page collection read: all 150 `reviews7` rows were approvals. batches.json now marks 489 icons approved
  (those whose approval is newer than the drawing, or whose drawing is unchanged since). The review page (same link)
  holds 224 for the owner: the 103 held icons plus 121 reopened (changed after approval, old fix verdicts, never
  reviewed), filter "Changed since your verdict, or never reviewed". Record: README of
  `docs/research/icon-review/2026-10-10/` ("batches.json synced"); `reopen.mjs` and `review-page.html` rebuild it.
- New `packages/icons` (`@area/icons`): the generator's `iconSource`/`RUNTIME` now feed both `pilot-icons.tsx`
  (unchanged output) and the package's gitignored `src/generated` (`--package`). Approved icons in the main entry,
  the rest in `./review`; per-icon modules, raw SVGs 16/20/24, sprite, `icons.json`. `npm test -w @area/icons`;
  `npm run test:consumer` covers it. Root `npm run build` now builds it too (the icon lint makes that ~4 minutes
  longer). Next on the production list: label/RTL API, keywords and aliases.
- `form` redrawn on the owner's reference (page, title line, two text lines, pen over the lower right; spec
  batch 70 table). On the review page as redrawn, awaiting a verdict. Another icon session ran in parallel (batch 75 on
  the review page); merge its branch onto this one.

## Icons: coverage survey, batch 75 (2026-10-11, branch `claude/icon-work-chrome-d39913`)

- Owner: "continue the icon work, chrome is at the front" → production gap 8, coverage by use, read live in the owner's
  Chrome (read-only): ChatGPT's whole icon sprite (426 concepts), Notion's loaded icon names (206), Figma's 743 unnamed
  24px editor icons on a contact-sheet overlay. Most is covered; 14 gaps drawn plus rectangle-vertical as a turn
  (batch 75: the AI sparkle composites, people-group, person-dashed, circle-dollar, chat-pen, sun-moon, heading-4–6,
  pilcrow-left/right). On the review page (same link, filter "batches 70–75"); 118 now held for one review. Record and
  delegated calls: `docs/research/icon-review/2026-10-10/README.md` "Batch 75". trash-restore and folder-user were not
  drawn (gap-scale and keyline conflicts; options in the README). Categories updated; full lint (808), build and
  typecheck pass (typecheck needs `npm run build` first after the component merge).
- Then synced with main (PR #62: approvals sync, reopen, @area/icons, form redraw) and took round 9 from the review page
  (149 reviewed: 146 approve, 6 of them newly applied to batches.json) plus the owner's chat notes: form's lines 3 in
  from both page edges, left-aligned; blur redrawn as a ring halved with 45° hatching (owner's droplet reference);
  superscript, subscript and list-numbered share a 2 whose base starts left of the bowl, tangent diagonal. Page
  republished (version 47) with the five as redrawn + Before. Record: `docs/research/icon-review/2026-10-11/README.md`,
  spec "Owner review round 9". Build, typecheck, `npm test -w @area/icons`, consumer test and docs build pass.
- Round 10 (owner): curved knockouts now run out square (generator fix: umbrella, banknote, basketball, globe-off); type
  audit of the 60 glyph icons with fixes to the heading family, binary, whole-word, case-sensitive, remove-formatting and
  text-size; the filled-treatment page https://claude.ai/artifact/1oCSG2MmsfkpxcNAtDnpBY (all 375 reviewed icons by
  treatment, with reasons); shield-lock now fills like the shield family. Review page version 48. Record: spec "Owner review
  round 10", `docs/research/icon-review/2026-10-11/README.md`. iCloud sync-conflict copies ("name 2.svg") appeared in the
  icon folder and were removed; others remain in dist, captures and node_modules (untracked).
- Round 11 (owner, 243 page decisions + chat): 195 approvals applied; 53 icons changed (Lucide's 1 everywhere, a
  Lucide-like 2 with a wider base, `data-ends="keep"` so 1/2/Z keep proportions when filled, umbrella and globe cuts edge to
  edge, the face and battery families, file marks centred, library redraws). Four parallel helpers did 37 of them. Review
  page version 49. Record: spec "Owner review round 11", `docs/research/icon-review/2026-10-11/README.md` (calls to
  confirm listed there). Full lint, build, typecheck, @area/icons tests and docs build pass.
## Desktop app: sorting, pinning, interaction pass (2026-10-12, `claude/gallery-interactions-design-gaps-0ff0c1`)

- Sort and group (`src/organize.tsx`): one ghost icon Menu at the end of the Canvas bar (Components, Icons, Color);
  Sort by / Order / Group by radio rows that keep the menu open, Reset once changed; saved per tab
  (`arrange:<tab>`). Components default = the old Sidebar (A to Z, In review first); the All Canvas now follows the
  Sidebar's order. Icons group by Category / Status / None; Color by Neutrals and hues / None, sort incl. chroma.
- Pins (`pins:<tab>`): Pinned group at the top of the Sidebar (Components, Icons); pin from the Inspector heading
  or a right-click menu (`PinMenu`, rows carry `data-key` / `data-name`).
- 2026-10-12 later: Sidebar toggle moved to the Titlebar's start (after the traffic lights); Icons and Typography
  sit on the Canvas surface (no tiles or frames: icon sheets hang their plates into the margin, type grid = cells
  with row plates, one role = ruled rows, lists = `Table flush baseline`, new Table booleans); icon cells open an
  Area Hover card (name, category, icon at 96, Copy SVG / Download SVG / Copy name), built only while open.
  PRODUCT_UI.md rules 11 (containers vs surface) and 12 (panel toggles at their sides).
- Color (owner, 2026-10-12, brand-sheet references): every step is its own card (painted Tile, `ColorCard` in
  pages/color.tsx) on the components' grid (wide tiles, 280 min, 5:4; owner), in All and one-scale views (the joined ramp strip
  and the Hex / OKLCH filter are gone). Card: level 14 strong + contrast badge (grade · ratio, ink at 12%), hex, RGB,
  full OKLCH at the foot. Painted tiles' edge = Color swatch picker's palette hairline (1px black / white
  10%, outline inside); its states step that one outline (hover ink 24%, pressed 48%, selected 2px ink), never
  a second ring (owner: hover read as a double stroke). Inspector adds RGB and contrast on white and on black.
- `.claude/launch.json` "desktop-dist" serves `apps/desktop/dist` read-only on 4410, for hover checks in the
  browser while `npm run dev` owns the build.
- Trial (owner): the Canvas ground is `bg-page` (white light, near-black dark; was neutral 25), so every tab sits on
  white. White component tiles then read only by their #f3 hairline.
- Don't run `npm run preview` while `npm run dev` runs in the same worktree: both esbuild watchers write
  `apps/desktop/dist/app.js` and interleave into a broken bundle ("Unexpected end of input").
- Owner: "this electron app is the full source of truth" → AGENTS.md / README say so. Audit (styles + component
  use) fixed in the app: chrome icons from `@area/icons` (no docs import), facts back as a real `Table` (owner: style it as the Table
  component; DescriptionList's framed rules differed), `Code` for every token/name, `ColorSwatch` for colour marks, status as sm Badges, every list a
  `Table flush`, Card's edge on tiles, pressed step on every tile, compact focus/hover above neighbours, bars from
  Panel's bar formula, abstract check/toggle on the real controls' paint and Switch's clock, section-link focus
  ring, Language tiles keyboard-selectable (`role=button` + aria-pressed when the stage is inert) with the
  selected preset shown, Language EmptyState, Icons Sidebar follows the arrangement, no native titles left.
  Remaining gaps listed in PRODUCT_UI.md.
- Migration (owner: start here now). Step 1 DONE (git mv, imports rewritten; docs build, dogfood, react
  264/264, contracts, consumer, both typechecks pass): content, status, specimens, names, registry, demos →
  `apps/desktop/src/content/`, fit + controls → `src/gallery/`, `highlight`/`escapeHtml` → `content/highlight.mjs`
  (docs layout re-exports). Sessions with uncommitted edits to the old paths: git's rename detection carries
  them on merge. Remaining:
  1. (done) `pages.mjs`, `component-status.mjs`, `gallery/specimens.mjs`, `scripts/specimen-names.mjs`, `registry.tsx`,
     `demos/` (37 files), `gallery/fit.ts`, `gallery/controls.ts` → `apps/desktop/src/content/` and `src/gallery/`.
  2. (done 2026-10-12, branch `claude/icon-pipeline-package`) Area's drawings → `packages/icons/sources`, generator
     and tools → `packages/icons/scripts` (`generate.mjs`, `find`, `geometry`, `batch`, `sheet`, `refs`, `keywords`),
     categories → `packages/icons/src/categories.ts` (exported from `@area/icons/meta` with `batches`); the app's Icons
     tab and the demos read `@area/icons`. Left in `apps/docs` until the Fluent map is retired: `gen-icons.mjs`,
     `assets/area-icons*`, the sprites, `src/icons.tsx` (the Iconography demo's Fluent plates and AREA_SWAP names),
     and the generated `pilot-icons.tsx` / `pilot-explore.tsx` (docs, Iconography demo, package test oracle).
  3. `CopyButton` → `@area/react`; `area-capture.js` → `tools/`.
  4. Repoint skills, AGENTS, README, DEVELOPMENT, root scripts, react tests that read `apps/docs/dist`; then delete
     the site (build, html, preview).
- 2026-10-12 later: tile corner 20 (was 24, owner "slightly too round"); colour cards' level regular weight; ColorSwatch
  edge = the palette's transparent 10% hairline everywhere (reverses the 2026-09-28 solid ring; spec logged); Panel:
  seam counted once and Nav / Tree view hang their plates in a panel (Sidebar plates 6, text 14); `Table flush` rules
  and text on the content edges, the row plate overhangs as a shadow; Code in fit cells doesn't wrap; Components
  1x / 2x zoom in the Canvas bar (`view:components-zoom`; fit.ts reads [data-zoom]; only fixed-size specimens scale
  past 1; units 204 at 2x).
- Arrow keys across icon cells, swatches, ramp steps and type tiles (`src/grid-keys.ts`); selection follows focus.
- States (studio.css): tile edge rest → hover `edge-control-hover` → press `border-hover` → selected; painted
  tiles and ramp steps ring in their own ink; icon cells hover / press plates; all instant in, `fast` out. Fixed a
  selected swatch drawing the selection stroke outside its ink ring.
- Titlebar buttons use Area Tooltips (`ChromeButton`) with shortcuts: ⌘B Sidebar, ⌥⌘B Inspector.
- Owner adopted the recs → `docs/PRODUCT_UI.md` (13 rules, linked from AGENTS.md; evidence in
  `docs/research/product-ui-gaps-2026-10-12.md`). Built with it: row pressed plates (Nav, Menu, Tree view,
  interactive Table: `bg-component-active` while held), `MenuItem keepOpen`, `Menu tooltip`, Tooltip `describes`,
  icon-only Segmented options get Tooltips; the app's native `title`s became Area Tooltips (icon cells, ramp steps,
  copy-token); Typography's empty search shows an EmptyState. Spec feedback logs updated. Open component gaps are
  listed at the end of PRODUCT_UI.md. React tests 262/264 (the 2 failures read the archived `apps/docs/dist`).
- The browser pane caches `studio.css`; open `/studio.css` once to refresh. `.claude/launch.json` now has autoPort.

## Desktop app: gallery homepage (2026-10-11, `claude/gallery-homepage-ui-2a0b30`)

- Owner: new sessions work on the app (`apps/desktop`, Electron); the docs site is archived; reviews go through
  artifacts. `npm run dev` (window, reloads on change), `npm run preview` (browser, :4400). Regions: **Titlebar**,
  **Sidebar**, **Canvas**, **Inspector** (`src/studio.tsx`); tabs Language, Components, Typography, Icons, Color;
  location `#<tab>/<item>`. `electron . --capture=<png> [--theme=dark] [--hash=...] [--store='{...}']` saves one
  frame from an in-memory session (native traffic lights not included).
- Shared with docs: specimen table and demo wrappers in `apps/docs/src/gallery/specimens.mjs` (docs output
  byte-identical when moved; main's Box model / Editable text / Timeline tiles and accordion copy ported in the
  merge); `fitTiles` returns a cleanup; `standaloneSvg` / `CopyButton` exported.
- Shell: Titlebar 41, text tabs from 14 (macOS 84); Sidebar has no title, starts with **All**, group labels on the
  item text; Canvas and Inspector bars 41 on one cap line; one divider stroke (Panel seams and rules, 1px
  decorative); Inspector 256 (narrowest without clipping), one-row controls, facts as Area Tables.
- Canvas: one Tile (`src/tile.tsx`) on one grid (136 unit, even columns, wide 2x2, row spans; 5:4), corners 24,
  inset 16, margin 16 > gap 8; compact density is a hairline contact sheet. The visual is the container (painted
  swatches, ramp strips, setting-scoped tiles, icon sheets). Grid / list + a filter per tab
  (`src/view-controls.tsx`). Typography: Geist-style table, Regular and Strong as separate ramps. Language:
  abstract illustration family (`src/abstract.tsx`, `.abs-*`) drawn from live tokens. Props table under a family.
- Picks, not measured: Titlebar 41, Sidebar 240, search 240, traffic lights (16, 14), tile unit 136, corner 24,
  illustration sizes. Open: measure Cursor / Notion title bars; Radix-style role groups and light/dark pairs in
  Color.


## Review round 7 → 8 (2026-10-11, same branch)

- Round 7 (`components7`): Meter, Shortcut list, Date range picker, Zoom control and Menu approved (Complete). Rethink:
  Board (plain title, Badge count, header buttons, custom colours with neutral default, a card-sized "Add new" row in
  the column's colour), Citation (12px on a 20 pill after AI Elements and prompt-kit), Search field (focus question:
  identical to Input; pickers differ by design). All applied; round 8 (`components8`) republished with a round-7 Before
  (scratchpad `before8`). Search field's clear is now `dismiss-circle` (icon PR 60 merged; Glyph.tsx knockout mask).
- Owner wrote "approved 8/8" in chat while the page held three rethinks with notes; the page's verdicts were followed
  and that was flagged.

## Board (2026-10-10, same branch)

- Owner: "can you keep working, ill bring chrome to the front later" → Board (in review): `Board`, `BoardColumn` (Tag-toned
  header + Count, the tone's ink as the tint at Notion's alpha, footer), `BoardCard` (title link stretched over the card,
  icon, properties, hover / focus actions), `board.css`, 13 tiles (one per tone), docs entry, tests. Evidence: Notion's
  "tasks" board at rest (redacted). Timeline still waits for Chrome in front (Figma version history).

## Menu reopened; Citation and Zoom control decisions (2026-10-10, same branch)

- Owner: "go with your recommendations then keep working". Citation: 11px, ink fixed (no change). Zoom control: light
  Menu kept; its shortcut-column fix moved into Menu (inset.css `--_box-end` + surface.css margin for plain rows ending
  in a shortcut in a menu with check rows; shortcuts 36 from the end in every row). Menu is back In review (removed
  from COMPLETE) with a new "Content / plain and check rows" tile; its round-7 Before is the Menu section of the pre-change
  dist added to the scratchpad Before (`add-section.mjs`).
- Next tried: Timeline from Figma's version history (File menu › Show version history, or ⌥⌘H). Not started: Chrome's
  window was hidden, and Figma opens neither its file menu nor the shortcut there. Needs the window in front. Password
  field was skipped: Area's reveal is already an Input + InputAction demo, and a packaged one needs eye / eye-off
  package glyphs from the icon session.

## Zoom control (2026-10-10, same branch)

- Owner: "keep working". ThinkingDisclosure first: no reasoning line in the owner's recent ChatGPT chats, and one
  can't be produced read-only, so → Zoom control (in review): `ZoomControl` (ghost Button sm with the percentage and a
  chevron; Menu with a typed zoom Input, in / out ×÷`step`, fit, presets as radio rows, children for view toggles),
  `zoom-control.css` (tabular value; plain rows reserve Menu's check column so shortcuts align), 5 tiles, docs entry,
  tests. Evidence: Figma's "48%" zoom and view options (button and open menu, read-only). Open: Menu-wide check
  column reserve. Review page round 7 republished.

## Citation; round-7 recommendations (2026-10-10, same branch)

- Owner: "go with your recommendations then keep working". Date range picker and Shortcut list open questions resolved
  as recommended (no code change). Then Citation (in review): `Citation` (a link pill: `label`, `title`, `icon` URL or
  element, `more` → "+N"), `citation.css`, 5 tiles in an assistant Message (one with a HoverCard preview), docs entry,
  tests. Evidence: ChatGPT's `chatgpt-citation` pills in an earlier chat (read-only, redacted). 11px type over
  ChatGPT's 9 (Area's floor); baseline-aligned, no nudge. Review page round 7 republished.
- Gallery tip: don't override a tile's grid span when isolating it; the fit collapses the stage to 0 height.

## Date range picker (2026-10-10, same branch)

- Owner: "continue working" → Date range picker (date family; Date picker's open question 1 as a sibling, so the
  approved Date picker is unchanged). In review. `DateRangePicker` (Date picker's classes and field, `presets`
  rows above a range Calendar with Menu's rows / check / separator, `visibleMonths` 1 | 2, formatRange short month,
  Clear, `<name>-start/-end`), `date-range-picker.css` (presets bleed), 6 tiles, docs entry, tests. Evidence: Notion's
  search date filter (Calendar pass captures); React Aria, shadcn, Untitled UI. Review page round 7 republished.

## Shortcut list; Search field decisions (2026-10-10, same branch)

- Owner: "proceed with your suggestions and keep building". Search field: clear shown whenever there is text; the
  filled circled × is the icon session's `error` icon, but the glyph pipeline can't paint a solid with a knockout yet.
  Agreed split with the Icon work session (cross-session messages): it adds a "knockout" glyphPaint plus
  `glyphKnockouts` and `"dismiss-circle": ["error", undefined, "knockout"]` after its quality pass; this side then
  renders knockouts in Glyph.tsx with a mask and switches SearchField's clear to `dismiss-circle`. Done on this side:
  Glyph.tsx renders "knockout" (reads `glyphKnockouts` from the module, so it builds before the data lands). After
  `claude/icon-work-95225c` merges: SearchField.tsx `<Glyph name="dismiss" />` → `"dismiss-circle"`, rebuild, recapture.
- Shortcut list (in review): `ShortcutList` (section + optional title, `quiet`) / `ShortcutListItem` (`label`, `keys`
  chord or alternatives, `shortcut` override) over Kbd; 36 rows, divider role, no side inset (the surface owns it),
  groups 32 apart. Evidence: ChatGPT's ⌘/ Keyboard shortcuts dialog (read-only; its bindings are editable, nothing
  inside was clicked) and Figma's shortcuts panel from the Kbd pass; Notion not found. 5 tiles, docs entry, tests.
- Review page round 7 republished with Meter, Search field and Shortcut list (`components7`).

## Search field and review round 7 (2026-10-10, branch `claude/component-work-93f50e`)

- Owner: "continue the component work" → Search field (first in "Entry and forms" and "Shared and small"). In review.
  `SearchField` (Input + search glyph; clear InputAction with the dismiss glyph once there is text, `tabindex=-1`,
  focus kept in the field; Escape clears a query and is left to the page when empty; `onSubmit` on Enter; `shortcut`
  Kbd while empty + `aria-keyshortcuts`), `search-field.css` (block hook only), 10 tiles, docs entry,
  `search-field.test.mjs`. Evidence: ChatGPT GPTs search, Notion database search, Figma Assets search and Find
  (redacted, read-only; Chrome's window reported hidden, so no hover); React Aria, Fluent, Untitled sources pinned.
  Open: a filled circled × (ChatGPT, Notion) needs a new Area icon from the icon session.
- Review page republished (same link), round 7: ArtifactData `components7`; Meter (7 changed) against its round-6
  build, rebuilt from the round-6 page's data.js and area.css (the old session's scratchpad `review10`), and Search
  field (10 new). component-review.mjs's date window now runs past 10-09.

## Icons: batch 70 (2026-10-10, branch `claude/icon-work-95225c`)

- Every `reviews7` verdict was an approval, so a fresh library gap pass led to 39 new icons. They are in review on the
  icon review page (same link, filter "New icons not yet reviewed (batch 70)", decisions in `reviews7`). Record:
  `docs/research/icon-review/2026-10-10/README.md`, which also lists the delegated calls to confirm, and the spec section
  "Batch 70 · New icons".
- Open: `batches.json` still marks 356 icons `review` that the owner approved on the page (the sync waits for the
  owner; see the README).
- Then (owner: "pause making new icons") a whole-set quality and consistency pass: eleven group reviewers, then
  integration. 34 icons changed and are in review on the page (filter "Changed in the quality pass"); 89 sources only
  dropped a stale `data-angles="free"`. Proposals for the owner are in the spec section "Quality and consistency pass,
  2026-10-10" and `docs/research/icon-review/2026-10-10/quality/`. New checks: `quality/tools/px.mjs` (1× view),
  `quality/tools/dups.mjs` (strokes drawn twice).
- Demo swap (owner: "implementing them into the actual components"): AREA_SWAP in gen-icons.mjs makes the component
  demos' icons Area drawings (137 specimens in 35 families changed). Review page: https://claude.ai/artifact/EyvzqrhCmbDrrc1qdcBEqz
  (`iconswap1`). Fluent cuts stay as FluentCut<Name> for the icon pages. The toolbar (icons.generated.mjs) is still Fluent.
- Next icon session: start from README "Next icon session: production gaps" (packaging, metadata, accessibility and RTL,
  12px cuts, licence and versioning, catalogue, coverage).
- Package glyph `dismiss-circle` (`error` with a new "knockout" paint, `glyphKnockouts` in glyphs.ts) for the component
  session's Search field; that session renders it with a mask in Glyph.tsx once this is on main.
- Owner then: "keep working on any new icons, hold the ones that were updated so i can review them all at once" →
  batch 71 (24), batch 72 (7) and batch 73 (9, from a product-surface pass) and batch 74 (bottom panel toggles; README "Batch 71"–"Batch 74"). The review page now holds 103 for one review: the quality pass's 34 changes,
  batch 70's other 27 and the 42 of batches 71–74. The library gap list is nearly exhausted (what's left is niche or
  drawn under another name); replace-all waits on an owner call (README "Batch 72"). Nothing else was changed in existing icons (noticed items are listed).

## Review round 6 → 7 (2026-10-10, same branch)

- Round 6 (`components6`): Toggle group approved (Complete). Meter "needs changes": "are the type sizes too small? is
  the gaps/spacing consistent with current area components" → laid out as a Field: label and value (now the UI type,
  14/20 muted, was 12/16) on one row, the bar, the description under it in Field's description type, each `ui-stack`
  apart (6, 4 compact; were ChatGPT's 4 and 5). Still in review; owner: "go with your recommendations, then open a PR
  and merge it". Round-6 captures in `meter/before/`.

## Meter (2026-10-10, same branch)

- After the round-6 rethink, "keep building" → Meter (next tier of the gap audit). In review. `Meter` (`value`, `min`,
  `max`, `label`, `description`, `valueText`, `tone` neutral / warning / danger, `size`; `role="meter"`) over Progress's
  bar, `meter.css`, 7 tiles, docs entry, tests. Evidence: ChatGPT Settings › Usage (read-only), Figma's usage card
  from the Progress spec. Circular meter and Stepper remain on the list; editable text waits for the Chrome window.

## Review round 5 → 6 (2026-10-10, same branch)

- Round 5 (`components5`): Empty state and Description list approved (Complete). Toggle group "rethink": "should there
  be strokes around it? are the hover states correct?" → soft was ButtonGroup soft, hover one rung from rest (247 →
  243), pressed one more (238); soft is now Segmented's track (hairline, hover wash, pressed raised white plate, any
  number raised); outline and ghost unchanged. Round 6 (`components6`) shows it against a round-5 Before (current dist
  with the round-5 area.css and the old soft classes patched in).
- Tooling: the built-in pane reports `visibilityState` hidden, so CSS transitions don't finish there: inject
  `*{transition:none!important}` before reading computed colours, and cache-bust stylesheets after a rebuild. The dev
  server (`npm run dev`) served an empty page twice this session; serving `apps/docs/dist` statically after
  `build:docs` works. `git mv -k` silently skips untracked files.

## Description list (2026-10-10, same branch)

- Owner: "go with your recommendations, keep building" → Description list (editable inline text is next on the list
  but needs its edit mode captured with Chrome's window in front; Notion's Library rename was seen in passing and is in
  the baseline). In review. `DescriptionList` (`dl`; `layout` columns / justified, `divided`, `framed`) and
  `DescriptionListItem` (`term`, `icon`, value as children), `description-list.css`, 6 tiles, docs entry, tests.
- Evidence: Notion page properties (a "tasks" page opened by its link) and ChatGPT Settings › Account, read-only and
  redacted. Copying out of Notion needs a window-level capture `copy` listener (Notion's own copy handler empties a
  textarea copy).

## Toggle group (2026-10-10, same branch)

- Owner: "keep building" → Toggle group (next tier of the gap audit; SliderRange already covers the range slider). In
  review. `ToggleGroup` / `ToggleGroupItem` (`value` / `defaultValue` / `onValueChange` string[], `selectionMode`
  multiple / single with release, `variant` soft / outline joined through ButtonGroup's classes or ghost 8 apart,
  `size`, `fullWidth`, `disabled`; one Tab stop and arrow keys, or the Toolbar's roving inside a Toolbar),
  `toggle-group.css`, 10 tiles, docs entry, `toggle-group.test.mjs`.
- Evidence is design-system only (Untitled UI's ButtonGroup is a React Aria toggle group; shadcn / Radix ToggleGroup).
  Notion's formatting bar was not captured: with Chrome's window hidden a double-click in the page opened its block
  menu (nothing changed, page still "Edited 2h ago"); don't drive Notion's editor blind.

## Empty state (2026-10-10, branch `claude/next-component-537b57`)

- Owner: "work on the next component" → Empty state (the twelve gap-audit priorities are built; the next tier was
  Link, EmptyState, Pagination). In review. `EmptyState` (icon on a soft tile, title as `titleAs` h2…p, muted
  description, actions; `size` md / sm), `empty-state.css`, 6 tiles, docs entry, `empty-state.test.mjs`.
- Evidence: ChatGPT Space › Trash / Sites / Favorites (md: 48 tile, 18/24 title, 16 / 8 / 16), Notion Library ›
  Favorites / Skills / no-match (sm: 14/20 title, 12 / 2 / 8), Figma file browser (one 11/16 line); all redacted,
  read-only, light only. Untitled UI, shadcn and Primer sources pinned in the spec. Open questions resolved as
  recommended (owner): File upload keeps its edged tile, sm keeps a tile, the title stays in the default ink.
- Review page republished (same link), round 5: ArtifactData `components5`, Before = main at 3bcc6a9.
- Tooling: Chrome reported `visibilityState` hidden all session (rest captures fine, no hover); full navigations drop
  injected scripts, so stay on in-app navigation between captures; the extension blocks base64 results, use the
  execCommand copy button. Area captures can go out through a local relay (`fetch` from localhost to 127.0.0.1 works).

## Review round 3 (2026-10-09, same branch)

- Approved: Link, File upload, Menu, Command palette, Panel, Alert, Card, Kbd, Number field, Property list. Chip: "the
  link underline is doubled" → the link chip is an `<a>` and `.area-chip` never cleared the browser's underline; the
  gallery's docs CSS resets links and hid it, the review page (Area's CSS alone) showed it. Fixed (`text-decoration:
  none`); the icon link chip also lost a stray rest underline. Round 4 (`components4`): Chip approved, so nothing is
  in review.
- Lesson: the gallery can mask component bugs through the docs site's own resets; the review page and review-diff render
  with Area's CSS only, so trust them for what a consumer sees. The review page now loads area.css with a `<link>`
  before the specimens (it was fetched afterwards, so specimens rendered first with browser defaults).

## Review round 2 feedback applied (2026-10-09, same branch)

- Owner: "start on the five". In review again (round 3, ArtifactData `components3`; page republished with Before =
  the round-2 build, each family led by its spec's `## Review note, 2026-10-09`):
  - Menu: group labels over text-only rows start on the row text column (11; was 8); over icon rows they stay on the
    icon column. Labels now wrap their text in `.area-menu__label-text` (MenuLabel, Combobox, CustomSelect,
    CommandPalette, TagPicker), so the label box takes the rows' type for the inset.
  - Command palette: hint buttons centre their content (the arrows sat 4 / 11.5 in their 24 plates).
  - File upload: actions 8 from the row's top and side (Untitled -mt-2 -mr-2); zone and row padding net of the border;
    size line 2 under the name.
  - Panel: every step 2 smaller (md 14 / 10 / 4, sm 10 / 6 / 4), the edge counted once (`--_edge`, `--_side`); the
    resizable demo's Dimensions row carries the constrain toggle; the collapsible chevron is centred on the title row.
  - Link: underline in the link's own ink at rest (was 40%); new `ink="blue"` (`fg-info`; ChatGPT rgb(44,103,197) and
    Figma rgb(0,123,229) UI links, measured read-only). Alert, Card, Chip follow (reopened). Kbd, Number field and
    Property list reopened as knock-ons (a tile of each shows the palette footer or a Panel).
- review-diff.mjs now pins each specimen to a whole-pixel slot (a tile added above shifted later ones by a fraction and
  snapping read as a change). Before dist for round 3: a copy of apps/docs/dist taken before the edits (scratchpad).

## Toggletip (2026-10-09, branch `claude/next-component-befcb2`)

- Owner: "work on the next component, load the component review artifact for anything that needs me to review" →
  Toggletip (next on the gap audit's order after File upload; no new verdicts were waiting in `components1`). In
  review. `Toggletip` (button + note; `content`, `icon` info / help, `size` sm / md, `label`, Tooltip's side / align /
  offset / delay, open state), `AnchoredToggletip` in Overlays.tsx (hover and keyboard focus preview as Tooltip; a
  press pins, `aria-expanded`; outside press, Escape, second press or focus leaving closes), `toggletip.css`, 6
  tiles, docs entry, `toggletip.test.mjs`. `info` and `help` added to the package glyphs; the generator now allows
  stroked circles and filled dots in a line glyph (`glyphFills`, icons.md).
- Evidence: ChatGPT (Settings › Usage info button) and Notion (Settings › Notifications "?") captures, redacted,
  read-only; Fluent InfoLabel, Spectrum 2 ContextualHelp, Carbon Toggletip rendered; Untitled UI source. Figma: none
  in the file browser. Open questions in the spec (Field label slot, info vs help default, ink).
- Review page republished (same link) for round 2: the 15 families in review, Before = main at 6f89678. Decisions
  now go to ArtifactData collection `components2` (the template's ROUND), so reopened families start undecided.
- Review round 2 (owner, same day): Pagination, Scroll area, Toggletip, Alert, Card, Chip, Combobox, Custom select,
  Tag picker, Drawer approved; Link, File upload, Panel "rethink", Menu, Command palette "needs changes" (notes in each
  spec's feedback log; not yet worked). Owner asked for more explicit reviews: the page now leads each family with
  the spec's `## Review note, <date>` (What changed / Why, plain words), renders every specimen in both builds
  (`apps/docs/scripts/review-diff.mjs`, headless Edge, light/dark × default/compact, painted boxes and text only) to
  mark variants Changed / New / Unchanged, shows changed ones side by side (2× zoom available) and folds the rest.
  Regenerate: `node apps/docs/scripts/component-review.mjs --before <dist> --before-label "main at <sha> (<date>)"
  --unapproved --out <dir>`; the Before dist is a detached worktree of that commit after `npm ci && npm run build:docs`.
- Tooling: from https pages the built-in pane can't post to a local relay (fetch fails; a form POST becomes a GET in
  the same tab and loses the page) and its clipboard API is denied; a button whose handler runs
  `document.execCommand("copy")` works (restore the owner's clipboard afterwards). The gallery tile zoom re-fits:
  pin it with an injected `#component-x .gallery-tile__stage { zoom: 1 !important }`. The gallery's Mode and Density
  persist in localStorage: check them before capturing.

## File upload (2026-10-09, same branch)

- Owner: "move on to the next component" → File upload, the last of the four. In review. `FileUpload` (zone: accept,
  maxSize, multiple, name, onFiles / onReject), `FileUploadList`, `FileUploadItem` (uploading / complete / error,
  progress, retry, remove), helpers `fileMatchesAccept`, `formatFileSize`; `file-upload.css`; 8 tiles (one an
  interactive simulated flow); `upload`, `document`, `reset` added to the package glyphs.
- Evidence: Untitled UI readout only; owner declined a ChatGPT test upload. Open questions resolved as recommended
  (field edge kept, `document` kept, Composer chip later).

## Scroll area (2026-10-09, same branch)

- Owner: "move on to the next component" → Scroll area. In review (Review batch "New: Pagination, Link and
  Scroll area"). `ScrollArea` (type hover / scroll / always; viewportRef, viewportProps), `scroll-area.css`,
  5 tiles, docs entry, `scroll-area.test.mjs`. Native viewport with the platform bar hidden; Figma's overlay bar.
- Evidence: Figma editor panel captures (a community file, viewed only); ChatGPT, Notion, shadcn readouts.
- Owner went with the recommendations: adopted in Menu (anchored), Combobox, Custom select, Tag picker, Command
  palette, Drawer and Panel (scroll-area.md, "Adoption"); those seven are back in review. Dialog body and Nav's
  overflow menu still use the platform bar.
- Tooling: Figma's CSP blocks form posts; open `127.0.0.1:8791/recv.html` from a button and `postMessage` the
  captures to it. The gallery re-fits tile zoom after a pause: clear it and capture in the same script.

## Link (2026-10-08, same branch)

- Owner: "move on to the next component" → Link (next on the list after Pagination). In review with
  Pagination (Review page batch "New: Pagination and Link"). `Link` + `linkVariants`, `link.css`, manifest
  (variant inline / standalone, ink inherit / muted / action), 7 tiles, docs entry, `link.test.mjs`; `open`
  added to the package glyphs (`PACKAGE_GLYPHS` in gen-pilot-icons.mjs; only glyphs.ts changed).
- Evidence: ChatGPT (logged-out composer note) and Notion (an inline link, owner's Chrome, read-only)
  captures; Primer rules; Untitled source classes. Underline: currentColor at 40% (Notion), 1 stroke, 2 below.
- Owner went with the recommendations: Link's open questions resolved; Alert's link, Card's action and Chip's
  link label moved to Link's line (link.md, "Peers aligned"), so Alert, Card and Chip are back in review.
- Tooling: a form POST (`target=_blank`) to the 127.0.0.1 relay saves captures from https pages in both
  browsers without the clipboard (fetch is blocked there).

## Pagination (2026-10-08, branch `claude/next-component-5018a1`)

- Owner picked Pagination as the next component. Built and in review (`REVIEW_COMPONENTS`, Review page
  batch "New: Pagination"): `Pagination` (+ `paginationRange`), `pagination.css`, manifest (layout
  pages / compact, size sm / md / lg), 10 gallery tiles, docs entry, `pagination.test.mjs`. Spec
  `docs/specs/pagination.md`; its three open questions were resolved as recommended (owner, same day). Awaits approval.
- Evidence: Untitled UI and shadcn captures, Primer as a readout; ChatGPT and Notion have no pager
  (searched read-only in the owner's Chrome). Steps are ghost Buttons; the current page is the shared
  selected plate; 32 squares, 2 gap.
- Tooling: the built-in pane can't reach a local relay from https pages (fetch and script tags fail), so
  references needed the capture script pasted in; captures left through the clipboard until the owner
  copied something else. From localhost pages, `fetch` to a 127.0.0.1 relay works. `.claude/launch.json`
  (untracked) serves the static docs on 4395; restart it after each `build:docs`.

## Review decisions applied (2026-10-08, merged in the 2026-10-08 PR)

- Approved (component-status.mjs): Accordion, Alignment picker, Custom select, Drawer, Tag. Changes
  requested and applied, back in review: Confirm dialog (Default specimen is the neutral confirm, danger
  a tone; soft/outline/ghost Buttons now weight 500 like solid), Date picker and the "black on black"
  report (the review page's own unlayered button CSS, fixed there), Tag picker (× hover plate legibility:
  Tag inks deepened to OKLCH L <= 0.49, contrast >= 4.5 under the plate; dark green/yellow calmed in Tag).
- Recommendations applied: Alignment picker radius-control-sm and no edge; field chevrons inset 8
  (`--_chevron-inset` in inset.css) and `--area-input-chevron` (stroke-control) ink; chosen rows in
  Select / Combobox / Custom select show the check only.
- Review page republished with only the unapproved families (`--unapproved`). Second round (same day):
  Confirm dialog, Date picker and Tag picker approved too, so nothing is in review.

## Component review page and archived docs (2026-10-07, merged in the 2026-10-08 PR)

- Component review artifact (owner): https://claude.ai/artifact/KSG5sYR4ERxq9rb4cqoqSG — every
  gallery family at 100% (hydrated), Before (the build at 5bb91df, static, in a frame) / After / side
  by side, light/dark, default/compact, the spec's dated changes, open questions and references, and
  approve / needs changes / rethink with per-specimen flags. Decisions: ArtifactData collection
  `components1` (doc id = family slug; round 2 from 2026-10-09: `components2`). Regenerate: `npm run build:docs`, then
  `node apps/docs/scripts/component-review.mjs --before <old dist> --out <dir>` (page template
  `apps/docs/src/component-review.html`), and republish to the same URL.
- Docs site archived (owner): `DOCS_ARCHIVED` at the end of `apps/docs/scripts/build.mjs` turns every
  non-gallery page into a redirect to the gallery; check-dogfood skips the Field page check while
  archived. Set it to false to bring the docs back.

## Motion and crispness pass (2026-10-07, merged in the 2026-10-08 PR)

- Contract: `docs/MOTION.md` (tokens, per-interaction recipes, crispness rules, reduced motion);
  research in `docs/research/motion-2026-10-07/` (packages and craft, design systems incl. ChatGPT /
  Figma values, crispness and the pre-pass state). Tokens: `duration-moderate` (200), `ease-drawer`
  (Vaul), softer `ease-in`; `ease-spring` deprecated and unused; reduced motion now wins over an
  explicit `data-area-motion`.
- "Pixelated": the gallery shrank specimens with transform `scale` (0.736 etc.); fit.ts now uses CSS
  `zoom`. overlay.ts divides by `currentCSSZoom`, so anchored surfaces place correctly under zoom.
- Eight agents applied the contract per component (instant hover/press/focus, `fast` fade out; one
  chevron rule; anchored surfaces 150 in / 100 out from the trigger; Dialog 200/150; Drawer 250/200
  ease-drawer; Toast enter/exit/reflow; Switch thumb by whole-pixel translate; Checkbox/Radio marks
  1:1; Accordion and Code block height via interpolate-size; Progress by translate; whole-pixel
  fixes in Dialog, Nav marker, Slider ticks, Indicator, Alignment picker bars). Each spec has
  "Motion and interaction, 2026-10-07" with open questions. Not watched live: every check ran in
  hidden tabs (computed styles, getAnimations, rects); hidden pages also never opened the Dialog or
  Drawer demos, so open/close needs a look in a visible browser.

## Review components, Chrome audit (2026-10-06–07, branch `claude/tag-picker-design-039723`, merged 2026-10-08)

- Tag: owner asked for lighter tints, more vibrant ink → opaque OKLCH L 0.955 / C 0.035 tints under
  `fg-*` inks (dark: vivid ink on 16%); × in the tag's ink, drawn at its 12 line (`Glyph size={12}`).
- Disclosure renamed **Accordion** (owner): `Accordion` (stack, was DisclosureGroup) + `AccordionItem`
  (was Disclosure); `area-accordion`, `area-accordion-item`, slug `accordion`, captures moved. Divided
  hover is the chevron plate (only shadcn underlines; Google, Notion, Apple, Figma don't).
- Gallery chrome: page links (Components, Review, Corner radius, Icons → gallery-icons.html, still the
  old shell) are a sticky Panel section; the theme panel collapses from a ghost icon button that stays
  in place (offsets in localStorage `area-gallery-rails`). check-dogfood exempts icon dots' `r:` styles.
- Seven parallel Claude in Chrome audits (each spec's "Claude in Chrome audit, 2026-10-07"): fixes in
  Drawer (16 insets, border once), Confirm dialog (footer gap 16), Date picker (Clear row at Menu's
  inset), Custom select (no focus edge on a mouse open; 17 captures, pass-status entry), Accordion
  (divided rows = half the line: sm 40, md 48). Open questions are in each spec. Blockers: the auto-mode
  classifier refused JS reads on some third-party sites and any local capture relay; background tabs
  can't copy captures out, so most numbers are computed reads, not capture files.
- area-capture.js: baseline by the ascent's share of the content box (canvas rounds system-font
  ascents; Notion text had read 0.67 low). Alignment picker test no longer expects removed sizes.

## Icon quality pass (2026-10-07, branch `claude/icon-quality-consistency-dade1f`)

- clapperboard is Fluent's movies_and_tv (owner: "exactly like fluent"). Whole set reviewed again icon by
  icon in ten groups plus four redraws; 94 sources changed, all in review (spec "Quality and consistency
  pass, 2026-10-07"; sheets, reports, scripts and open decisions in `docs/research/icon-review/2026-10-07/`).
- The 16 round-2 "replace" verdicts are applied on the named libraries (key, handshake, camera, pushpin,
  palette, shapes, gamepad, chess-rook, bank, building, lightbulb, lasso, translate, piano, hammer, trash),
  plus bot-generator's wizard hat and the person's smaller head gap (2) across its family. Other open owner
  notes applied (car, vault, gallery, vr-goggles, quote, newspaper, party-popper, calculator, piggy-bank, the
  handset curve, call arrows, frown).
- Tools: `2026-10-07/look.mjs` (render from sources, parallel-safe, `--before --slivers`, reference rows),
  `geometry-audit.mjs` (kinks, subpath gaps, lattice in `free` icons: the lint's blind spots),
  `edge.mjs` (stops headless Edge once its output is written; stray headless Edge runs hold the profile and
  hang every later sheet: kill them). `2026-10-06/person-family.mjs` is superseded by `2026-10-07/scripts/family.mjs`.
- Review page round 7 (same link, `reviews7`): 16 of the 94 approved so far (recorded in batches.json and
  `2026-10-07/reviews7-approved.json`); the "New icons" tab holds 43 candidates (`candidates1`), undecided.
  Open the page for the owner at the start of the next icon session.
- Open: the delegated picks and proposals in that README.

## Icon batch 69 and filled rules (2026-10-07–10, branch `claude/icon-design-review-460199`)

- Batch 69: 42 new icons from the review page's candidates, through owner rounds 8–23 on
  https://claude.ai/artifact/4sGs7JYAfNQexTPW9TQR9w (`reviews7`; page data `docs/research/icon-review/2026-10-07/review-data.mjs`,
  which marks redrawn icons and voids the verdict a redraw answers). Log of every round: that folder's README.
- Filled rules now (spec "Filled is simple…" + revisions): body solid, marks inside are knockouts, attached parts stay
  lines; an overlapping element sits wholly on the body as an `inset` (new generator role) with ≥ 1 weight of fill, or
  keeps a halo; notebook's attached rings split (knockout over the cover, ink beyond). Research:
  `docs/research/icon-review/2026-10-09/` (inventory, taxonomy, references).
- Cloud family redrawn on option D (three humps, big middle left of centre; `2026-10-10/`). tree's crown still uses
  the old cloud. Generator also gained `SLASH_GAP_BELOW` (unused after unpin reverted).
- Open: square-terminal alias (New icons tab); bookmark tips vs repository's sharp ribbon.

## Icon consistency audit (2026-10-05, branch `claude/icon-audit-consistency-96540c`)

- bot-guard filled: only the cap's top and the visor fill, the band stays open (owner); bot hats
  follow. Whole set audited outline and filled; 53 icons fixed and back in review (spec
  "Consistency audit, 2026-10-05"); batch 68 adds 24 icons and 7 turns from the audit's gaps.
  Findings, sheets and open owner questions: `docs/research/icon-review/2026-10-05/README.md`
  The owner answered the open questions the same day (spec "Owner decisions on the open
  questions"): spell-check redrawn, agent marks with full flats, bot-designer's cap one mass, the
  delegated picks confirmed, smile-plus filled a badge, maximize/minimize as arrows. Generator:
  dots follow the size curve (`style r` from `sw`); Glyph.tsx's package glyphs (more) still draw a
  fixed r. Then: `agent` is an alias of bot-agent (agent-circle/-square removed), smile-plus uses the
  small face, bot-designer's brim runs past the head, spell-check's B has a larger lower bowl.
- Tooling: headless Edge `--dump-dom` can hang when given a private `--user-data-dir`; the shared
  sheet scripts write into `apps/docs/.cache` (create it in a fresh worktree).

## Icon browser (2026-10-05, branch `claude/icon-gallery-organization-4a1c05`)

- `icons.html` (gallery nav: Icons, in the component gallery shell): every icon grouped by category
  (`apps/docs/src/icon-categories.ts`; the build fails if an icon has no category), Cursor-style
  toolbar (search, Outline/Filled, size 12–64 on the size curve), Names / Rotations / review-mark
  options, and a docked preview (size 16–256, 16–48 strip, rotations family, facts, Copy / Download
  SVG with token weights resolved). Source `src/gallery/icon-browser.tsx`, hydrated by
  `src/icons-client.tsx`. New icons need a line in `icon-categories.ts`. The old Icons page is now
  "Icon review" (`gallery-icons.html`).
- `npm run dev` doesn't publish on current main: the dogfood audit fails on numeric `r:` inline
  styles from the icon generator (pre-existing). Build with `node apps/docs/scripts/build.mjs` and
  serve `apps/docs/scripts/serve.mjs` meanwhile.

## Filled audit and size-curve hold (2026-10-06, same branch)

- Filled audit of the whole set (spec "Filled consistency audit and the size curve's hold"; sheets and
  tools in `docs/research/icon-review/2026-10-06/`): a part is one colour. import, cloud-upload and
  cloud-download now cut round their arrow (halo) like cloud-lightning; notebook's rings join the body.
- The size curve holds at 24 (`SIZE_CURVE_MAX`): 32 and 48 are the 24px drawing scaled (1.8 / 2.7px).
- Redrawn on owner notes: desktop-check, qr-code, globe, plane (cockpit window), fingerprint (concentric
  tracks), graduation-cap, bandage (filled). All delegated items are listed as open in the README.
- Second round: import is a line glyph like share; every filled cut is one line weight at every size
  (halo = 3 weights; gaps follow the curve; 15 front-part gaps became `data-halo`, dots included);
  fingerprint has an S core (fourth round); person-key carries the key icon; ? gap = ! gap; icons-inside-icons audit in `embedded.mjs`. Fifth round: person family on person's proportions with one lower-right badge bite, faces centred, cart wheels on the bar, ten fingerprint candidates in `explore/` awaiting a pick. Open: the outline's geometric overlap cut is 1.5×
  the line above 24px.

## Icon quality pass (2026-10-03–04, branch `claude/icon-library-quality-pass-009345`)

- Whole set reviewed in 32 groups; 20 icons fixed (filled slivers, islands, negatives, broken
  cuts; bluetooth-off's arm along the slash) and back in review. Spec "Quality pass, 2026-10-03";
  sheets and to-confirm list in `docs/research/icon-review/2026-10-03/README.md`. Generator: a
  `gap` with `stroke="none"` cuts out whole. Typecheck needs `npm run build` first in a new worktree.
- Second round: filled knockouts and cuts follow the size curve (slash gap via `slashGap`);
  newspaper/receipt parted the same way. Owner is reviewing every icon on
  https://claude.ai/artifact/4sGs7JYAfNQexTPW9TQR9w; read its `reviews` collection
  (ArtifactData) and act on fix/replace rows next.
- Owner review round applied (2026-10-03): 186 sources changed in six parallel passes plus
  integration (spec "Owner review round, 2026-10-03"); all in review. Round 2 on the same page
  ("Redrawn this round" filter) saves to the `reviews2` collection. Open owner questions are listed
  in the spec's partition notes (agent icon needed?, bold outline, gallery/images, usb notches).
- Filled story (2026-10-04, owner-chosen; research `docs/research/icon-review/2026-10-04/`): fill the
  body only, parts keep their outline drawing, marks inside containers, knockouts sawn at edges.
  41 more icons changed (spec "The filled story, 2026-10-04"); the review page's "Redrawn this
  round" filter now covers both rounds (204 icons, `reviews2`).

- Fills and pens (2026-10-04–05, branch `claude/new-icons-updated-fills-b6d86d`): secondary parts stay
  lines; the document fold is exact at every size (`data-shift`, `data-part`); filled lines follow the
  size curve; halos and `data-halo` use the overlap cut; marks on folded pages sit bottom-left; one
  pen/pencil shape plus a new `pen`; Fluent's eraser. Spec sections from "Secondary parts stay lines"
  on. Review page rounds `reviews2`–`reviews6` (round 6, bot-guard and signature, not yet reviewed).
  Open: the 26 replace verdicts and other non-fill notes listed under "Still open from reviews2";
  whether compose and file-pen's slim pen gets the clip too.

## Corner radius audit (2026-10-03, same branch)

- Note: `docs/research/radius-audit-2026-10-03.md` (604 reference captures mined, 2,464 Area
  corners measured at both densities). Applied: Standard curve 24px 4 -> 5 at both densities
  (`radius.ts` xs and dense sm); nested shapes concentric with a floor of `radius-control-xs`
  (Segmented items, Input actions, NumberField steppers, AlignmentPicker cells), so compact
  Segmented is 24 r5 / items 20 r4 (was r4 / r2). DESIGN_SYSTEM.md's nested rule updated.
- D1-D7 applied (owner, 2026-10-03; table in the note): surfaces 12 at both densities (compact
  rows in floating surfaces 24 r8), one-line Alert / banner / Toast 10 (compact 8), Tooltip
  compact 8, Kbd 6 everywhere, Card concentric with its media (16, compact 12), Breadcrumb
  plate 5, whole-pixel swatch and split-trigger corners. Families keep their status.
- Roundness (2026-10-03): `roundness` axis, −12…+12 in 2px steps (owner: no odd steps; show
  each component from 0 to pill). `clamp(0, min(family, h × cap) + offset, h/2)`: offset in
  `emit/base.ts`, caps move with it (`radius-shift` in all 44 cap expressions), floor 0.
  Gallery: Roundness slider; `roundness.html` lays each family out square -> pill with magnified
  corners and the inset arithmetic. Dialog cap is surface + 4, palette = surface, so both step
  by 2. All even (owner): 24px -> 6, `radius-floor` 4 for nested shapes, menu rows 8 (border
  left out), 2px rounding for swatches, checkbox, split trigger and caps.
- One corner setting (built 2026-10-03, branch `claude/corner-radius-segmented-slider-0a6b56`,
  uncommitted): the `radius` axis is `sharp`, `2` … `14`, `pill`, named by the md Button's corner
  (default `8`); the roundness axis and the families Subtle…Rotund are gone. Corner = setting ×
  height ÷ 32 in even pixels, min 2 (`emit/base.ts`), so all heights go square / pill together;
  surfaces 0, 2, 4, 8, 12, 16, 20, 24 (24 at Pill), Card = surface + inset − 4, Dialog = surface + 4;
  nested floor min(4, setting); floating-surface rows up to a pill, surface ≤ row pill + inset (20).
  Badge, Chip, Count, Switch: pill by default, `pill={false}` (`--rounded`) follows. Checkbox and
  square Avatar cap at 7/16 (rounded square at Pill). Preset ids are one number (`0` = Sharp, …, `pill`). Gallery Radius is a Select; `roundness.html`
  is the Corner radius page. 8 reproduces the previous values (swept both densities). Open: small
  boxes repeat values between neighbouring settings (24px: 2 at 2 and 4; 6 at 8 and 10).
- Pills (2026-10-04, same branch): `data-area-pills` lists the components drawn as pills (button,
  field, segmented, chip, badge, count, switch, avatar; default chip badge count switch avatar),
  `Theme pills`, gallery Pills row; `pill` props are three-way, Avatar `shape` unset by default.
  Floating-list rows use `radius-list-row` (pill only at Pill), lists `radius-list` (rows + 4).
  Corner radius page has "Components by group". Open: list surfaces lag other surfaces from 10 up
  (Menu 16 vs Popover 20 at 12); compact list rows plateau at 10.

## Review page and new components (2026-10-04, same branch)

- `review.html` (gallery nav: Review): `REVIEW_BATCHES` in `component-status.mjs`, specimens at 1:1.
  Batch "In review": Alignment picker (reopened: responsive grid, hover preview, sizes removed) and
  Disclosure. Batch 1 of new components (owner pick): Custom Select, Tag picker, Date picker, Drawer
  + confirm dialog, listed as planned; each needs captures in Claude in Chrome first.
- Alignment picker measured 2026-10-04 in Claude in Chrome (owner's Figma file, selection only):
  `captures/alignment-picker/figma--auto-layout-alignment--{rest,hover}--light.json` and Area's
  `area--default--{rest,hover}--light.json`. 88 x 56 default (min cell = 16 glyph), no hover fill,
  preview glyph in fg-muted. Open: per-cell tooltip like Figma's. Chrome tip: the injected
  area-capture.js must match `capture-compare.mjs --fingerprint` (091bb143); copy JSON out with a
  full-viewport button + clipboard (base64 output is blocked); select nodes with the page's `figma`
  global, never edit.

## Batch 1 new components and the alignment picker plate (2026-10-04–05, branch `claude/alignment-picker-backplate-962951`)

- Alignment picker: the soft `bg-hover` plate is back under the hover preview glyph (owner).
- Built, on the Review page, in review (each spec lists open questions):
  - `CustomSelect` (select-only combobox; Select's chrome plus ghost; Menu rows with icons,
    descriptions, check, group labels and rules). Notion Share-popover captures.
  - `TagPicker` (multi-select: Badge tags in an Input-chrome field that wraps; Menu rows with a
    check; create on type; Backspace removes). Notion select-property editor captures.
  - `DatePicker` (field opening a Popover: typed date Input, plain Calendar, Clear row). Notion
    date-property editor capture.
- Avatar demo image (`apps/docs/public/images/david-tee.jpg`) is now the owner's crayon drawing,
  square-cropped to full height with the green bus's face centred left to right (owner, 2026-10-05).
  - `Tag` (2026-10-06): Notion's tag (20, 14 regular, radius 4, Notion palette in light, muted ×
    with a concentric hover plate); Tag picker uses it. Review page now uses the gallery's tiles.
    Disclosure divided rows 16 → 10 (shadcn's rendered accordion). Tokens: new semantic tones `pink`
    (pink family, full block) and `gray` (warm cast, tints + inks only), light/dark, contrast-checked;
    `brown` is a new palette family
    (generated from orange, `MUTED_SCALES`, owner 2026-10-06); Tag has 10 tones, dark tints are the tone
    ink at 20% (option 1).
  - `ConfirmDialog` (alertdialog on Dialog, 420 wide, focus on Cancel, async confirm) from ChatGPT's
    "Delete chat?" (opened from a chat menu and cancelled with the owner's OK; nothing deleted).
  - `Drawer` (native modal sheet from end / start / bottom, sm 384 / md 480, Dialog's anatomy)
    from shadcn's Sheet. Dialog now passes `role` to its `<dialog>`. 2026-10-06 (owner): `actions`
    variant (row / stacked) and `modal={false}` (manual popover, Notion side-peek behaviour);
    ConfirmDialog keeps Dialog's 16/24 title and 16 inset (owner likes it; four references agree).
  - Batch 1 is complete (all five in review). shadcn Sheet and all Area tiles captured 2026-10-06.
    ChatGPT's confirm file is not saved: reopening the delete confirm was refused by the permission
    check; the owner decides whether to re-capture.
- Claude in Chrome: `visibilityState` reads `hidden` even when the window renders; trust the DOM,
  not lagging screenshots, and click by `find` refs (a stale screenshot once opened a property
  menu instead of a value). Docs dogfood fails on main (icon-page inline styles; separate task),
  so the dev server only shows a fresh `node apps/docs/scripts/build.mjs` after a restart; the
  hidden browser pane doesn't run rAF (DatePicker's select-on-open looks broken there).

## Component gallery (2026-10-02, branch `claude/component-gallery-theme-99e822`)

- `index.html` is the component gallery: one grid of tiles per family (alphabetical, tiles in
  specimen-group order, labelled `Group / value`), a left Nav that scroll-spies the canvas, and
  a right Theme panel (Mode, Density) built from Panel, PanelRow and Segmented. The review
  gallery (`gallery-components.html`: Pass review, approval batches) is retired (owner) and
  redirects here; `pass-status.mjs` and `APPROVAL_BATCHES` are kept but no page reads them.
- Theme isolation: the controls write `data-area-theme` / `data-area-ui` on `#gallery-canvas`
  only (saved as `area-gallery-theme`, restored before paint). The rails inherit the root
  defaults. Section and tile labels pin `data-area-ui="default"`; tile frames use
  `radius-base-container`. When measuring compact here, read the canvas scope, not `<html>`.
- Layout (owner, 2026-10-03): modelled on Cursor; rails pinned to default density and radius 10
  (owner 2026-10-04; were compact), resizable Panels (nav 200, 160–360; theme 240, 200–400; rows stack
  their labels below 296, where "Compact" stops fitting beside its label),
  widths saved as `area-gallery-rails`. Theme rows are horizontal Fields with Segmented; the
  bar reads "Theme · Canvas". Canvas ground neutral 25 (dark neutral 975); 8 for canvas margin,
  row and column gaps.
- Tiles: 5:4 (owner 2026-10-04), title top left, all one size, columns as many as fit at `--docs-tile-min` 280 (3 at
  1440, 5 at 1920). Owner 2026-10-04 (Frame Supply reference): tile inset 12, view margin 24 / 32,
  every specimen at 0.8 at most and scaled down to fit (`src/gallery/fit.ts`; fluid specimens laid
  out at view / 0.8, widened until nothing truncates). No 2x2 tiles; smallest scale 0.18 (Figma
  properties panel recipe). Tile frames read `--docs-tile-radius`, resolved outside the canvas.
- Alert corners (owner asked 2026-10-03): consistent by role, per alert.md: in-place 12
  (`radius-container`), banner 6 (`radius-control-sm`, OpenAI and Primer 6), flush 0. Open.
- Add a control: an entry in `apps/docs/src/gallery/controls.ts`. Add a family: `src/pages.mjs`
  plus its tiles in `gallerySpecimenTable()` (build.mjs). No approval batch is needed now.
- Verifying in the hidden browser pane: rAF and ResizeObserver don't run while the pane is
  hidden; take a screenshot to force a frame before reading scales.

## Disclosure (2026-10-02, branch `claude/disclosure`): in review

- New family: `Disclosure` (plain = Notion toggle: leading chevron in a line-height square, title
  column, chevron hover plate; divided = shadcn accordion: trailing chevron, rule between items,
  underline hover) and `DisclosureGroup` (single open by default, `multiple`, `value` /
  `defaultValue` / `onValueChange`, headings at level 3, regions named by triggers). Sizes sm
  14/20 and md 16/24 (default, Notion). Closed content is `hidden="until-found"`.
- Evidence: `captures/disclosure/` (Notion toggle, ChatGPT sidebar section, 10 Area tiles), Figma
  from `captures/panel/`, shadcn source @ 295a1f1. Spec `docs/specs/disclosure.md`; cohesion
  audit fifth pass. Open for the owner: a filled caret for plain (Notion's) vs Area's outline
  chevron. Unverified: product dark, rendered shadcn, on-screen dark paint.
- Capture tip: on localhost pages post captures to a local relay with `fetch`; product pages
  still need the clipboard button (a full-viewport button catches the click wherever it lands).

## Compact pass: tokens, rows and floating surfaces (2026-10-01, branch `claude/family-compact-pass-150bc8`, PR #36; merged with main's phases 6–7)

- Owner: compact is a proportional step-down of the whole set (`data-area-ui="compact"`), UI type
  12/16, rows 24, corners one step down; checked against vscode.dev until Cursor is measured.
  Note with tables: `docs/research/compact-pass-2026-10-01.md`; captures in
  `docs/research/captures/compact/` (14 vscode.dev, 3 Figma, Area compact after).
- Tokens: `COMPACT_TIERS` md 28/8/16/4 at 12/16, sm icon 16, xs 12/16; new density roles
  `ui-row` (32/24), `ui-row-inset` (8/6), `ui-dense` (0/1); `gap-row` 12/8; `inset-surface-sm/md`
  12/16 and 8/12. Text scales along the UI ramp (compact 12/16, 12/16, 14/20).
- Radius: the radius axis publishes `radius-base-*` and `radius-dense-*` (a compact tier reads the
  curve's value for its painted height); `emit/base.ts` derives `radius-control*`,
  `radius-container`, `radius-small`, `radius-row` from them and `ui-dense`. Leaves registered,
  derived tokens not.
- Rows read `ui-row` / `ui-row-inset` (inset.css, Menu, Nav, Tree view, Combobox, Command palette,
  Select picker); Popover gap and Dialog corner read `inset-surface-md`, Toast `inset-surface-sm`.
  Default density renders exactly as before (verified live).
- Comparison page: https://claude.ai/artifact/ULwhW84UswgMc9NY1dBLci (republish from the
  scratchpad builder with `packages/styles/dist/area.css`).
- Round 3 (smallest-first, owner): compact marks 16/16/20; Badge, Count and Kbd inner values are
  functions of their height (default identical, compact md drawn as default sm); inline Code
  floored at 12; Toast block inset derived so the last control is concentric (compact 32 tall).
- Round 4 (owner: equal insets): trailing plates end as far from the end as from the top, trailing
  ink ends on the glyph edge; fixed Nav plain counts, Tree view and Nav row actions (concentric),
  mark-height literals in inset.css, Alert's phantom grid gap (default action 14 -> 6) and insets,
  the banner Badge, the compact sm field action. A sweep script in the session checks all tiles.
- Round 5 (controls): inputs and controls already scale via the control ladder; new layout roles
  `ui-stack` (Field label gap 6/4) and `ui-cluster` (Toolbar inset and gaps, horizontal Field 8/6);
  choice rows keep the 24px WCAG target. Start and end equal-inset sweeps: zero mismatches.
- Round 6 (containers): Card inset/step, Panel sides (surface insets) and gaps, Property list and
  Table cell padding step down one rung; component values written `default − diff × ui-dense`.
- Round 7 (conversation and tools): Message, Composer, Code block, Command palette search row step
  down; bubble corner = Composer corner. Calendar compact 32/28 (Notion), default 36/32 kept.
- Round 8 (sweep): fixed 8 / 16 / 12 / 20 gaps across the gallery read `ui-cluster`,
  `inset-surface-md` or step one rung; Code block header action 4 / 4. Default verified against
  HEAD (11,584 elements; 120 intended differences in 14 tiles).
- Merge with main (phases 6–7): main's S21a C held marks under compact; the owner's later
  proportional direction steps them down (16/16/20). Main's titles-hold rule (H-7 A), Input's
  4px action ring (B-7 B), `border-float` and the pruned tokens are kept.
- **Compact evidence audit (2026-10-02, PR 37):** `docs/research/compact-evidence-2026-10-02/`
  classifies all 119 compact values (22 measured, 81 rule-only, 11 conflicts, 4 picks) and pins
  how antd, Material, Spectrum, Carbon and Primer step down. Applied R1–R8: row glyph edge 8,
  tooltip sides 8 / corner 4, Panel md and Color picker hold 16, xl 40 / 12, `ui-row-gap` 2 / 0,
  Dialog 12 / 12. Code block corner 12 / 8. Owner rule: values follow measured data and system
  coherence; picks are adjustments. Open: Cursor capture, a Figma dialog and sectioned popover.
- Measuring at compact: tiles that pin `data-area-ui="default"` don't follow the root switch;
  filter by `closest('[data-area-ui]') === <html>` before reading values.
- Round 9 (2026-10-02, second both-density sweep): choice groups and cards, Chip/Badge groups,
  Box field, Panel labels, Tabs sm and panel, Command palette hints, Code block gaps now step down;
  default identical (0 gallery differences). Remaining holds are listed in the compact note.
- Closed 2026-10-02 (owner): changed families keep Complete; R9–R12 keep what ships. Next:
  retry the Figma dialog and sectioned popover in the owner's Chrome; Cursor stays unmeasured
  (vscode.dev stand-in).
- Cursor web measured (2026-10-02, owner's Chrome): 25 captures `captures/compact/cursor-web--*`,
  note `compact-evidence-2026-10-02/cursor-web.md`. Matches control-md 28/8/6, label column 30,
  menu inset 4, palette search 40, badge 16/4; conflicts (owner's call, nothing applied): composer
  inset 12, separator 5/1/5, 24-control corner 6, row gap 1, icons 14. R11 keep. Chrome hand-off: the
  local relay was refused this session; the clipboard button works with the window hidden.
- Cursor desktop + Figma measured (2026-10-02): 55 Cursor captures (`cursor-app--*` Agents window,
  `cursor-ide--*` IDE, no folder opened) via Cursor relaunched with `--remote-debugging-port=9222`
  and CDP (owner quits Cursor first); 5 Figma (Share dialog, Edit text style popover) in Chrome.
  Note `compact-evidence-2026-10-02/cursor-desktop.md`. Confirms xs 20/6, label column 32, flush
  menu rows; reopens R9 (popover inset: Cursor and Figma 16, Area compact 8) and weakens R8
  (Figma dialog 16 sides). Owner applied both: Popover compact inset 12 (held), Dialog compact
  16 / corner 16; plus standard dense xs corner 3 -> 4 (Cursor 20px buttons). Family pass results
  in cursor-desktop.md. Then (owner) Menu separator 6/1/6, compact 5/1/5; Prompt suggestion rows
  compact 40 (the compact composer's height, was 44). Dark: 48 Cursor Dark captures (Cursor's
  theme switched for the session, settings restored from backup); Area's dark sits inside the
  range, no change. Both-density sweep (54 docs pages): no unlisted holds; fixed Popover's compact
  corner 8 -> 12 so its close stays concentric (capped at radius-base-container; default unchanged
  under every preset). Toast with actions measured on vscode.dev (matches compact). Live
  before/after page: https://claude.ai/artifact/UsB2z9j8wAexzae2ffCYRm (scratchpad builder:
  specimen.html + before/after CSS). Still unmeasured: chat code block, dark tooltip. Prompt
  suggestions' offset below the composer now 24 / compact 16 in the demos (owner question).
  Inset audit (owner): horizontal text inset now reads 1cap everywhere (the 1lh fallback gave 5px
  sides without text-box; Chrome unchanged, Textarea too). Then (owner): `gutter-*` tokens removed
  (consumers rewritten: table 12/8 literal, Slider range field and Field label from the inset rule,
  grouped Select text ends on the chevron box, docs chrome from space tokens; UI-scale page explains
  derived padding); inset rule rounds to whole pixels (`--_inset-start/end`); Badge joined the
  shared rule (text side reserves a 4px box: h/2 - 2; dot/icon/media use their boxes) with 0 pixel
  differences. Gallery sweep: only sub-pixel rounding plus the intended Select and Slider changes.
  Composer autosize fixed: native field-sizing, script fallback (refits across density switches). Figma
  pages stall the extension when the Chrome window is hidden: ask the owner to bring it forward.
- Chat code block (2026-10-02): GitHub Copilot, one throwaway chat (owner OK). Corner 12 matches
  Area's default; Copilot is 14px default density, so compact still rests on Figma Dev Mode. No change.
  Still open: a dense chat code block (Cursor needs an agent run) and Cursor's dark tooltip.

## Start here (next session)

**Reconciled with `main` (2026-10-01, owner: "take this branch's side for the conflicts").**
PR 32 (a parallel phases 6–7 from `claude/component-work-continuation-aef804`) is merged into this
branch. The 126 conflicted files keep this branch's version; from `main` this branch keeps what
merged cleanly (its 19 dark captures and `docs/research/dark-pass-2026-09-30.md`, 20% dark
shadow ink, no Card halo in dark, NavSeparator ref, neutral Field validation, gated reveal rules)
and ports by hand the dark Tooltip (#282828 + 5% white inset), the tooltip popover-border fix and
the gated-hover test (the four reveal rules were split to pass it). Kept from this branch where
the two differed: `border-float` (not `edge-float`), `items` for collections, Input
`leadingIcon`, Card `layout="thumbnail"`, Presence without `xs`, Code/Token booleans,
single-value-axis exception, `mark-*` only (no `inset-surface-*` yet; revisit in the compact pass).


- **State:** the 2026-09-29 audit is implemented: 238 of 239 findings done, every one of the 91
  owner picks applied (JSON statuses; page https://claude.ai/artifact/HPeEX5JVpgzugs4uJMQV7i,
  version 14). Phases 6–7 are in the PR from branch `claude/component-work-51c375`.
- **Done in PR #36 (see "Compact pass" above): compact density for the whole set (H-4).** The
  notes below are the brief it started from. One switch,
  `data-area-ui="compact"`, should tighten every component; never per-instance `size="sm"`.
  Today compact reaches control heights, type and icon gaps; marks hold on purpose (`mark-*`,
  S21a). Still fixed: menu and list rows, floating-surface insets (Popover, Card, Dialog, Panel,
  Toast), group spacing, Tabs/Table/Calendar/Composer frames. Work family by family with dense
  captures: vscode.dev needs no login (built-in browser, paste `area-capture.js`; fingerprint
  091bb143), Figma and Notion through the owner's Chrome (Claude in Chrome blocks long or
  query-string-like output, so read values in chunks of ~18). Rows and floating surfaces first.
- **Owner preferences this session:** dark mode as close to #000 as possible (dark page is
  neutral 975); go with recommendations unless breaking; breaking changes need an explicit yes.
- **Runtime theme switching:** Chromium can keep stale `light-dark()` colours after a live
  `color-scheme` flip; force one restyle (THEMING.md). Measure contrast only after a reload or
  restyle.
- **Checks:** `npm run build`, `npm run typecheck`, `npm test` (19,590), `node --test
  packages/react/tests/*.test.mjs` (205), `npm run test:contracts`, `npm run test:consumer`,
  `npm run lint:icons`, `npm run build:docs`, `npm run audit:page -- --check`. The dev server
  (`.claude/launch.json`, port 4391) rewrites `dist`; if a check flakes, rebuild and re-run.

## Audit moved into the repo (2026-09-29, branch `claude/cool-kirch-9facec`)

- The audit lives in `docs/research/audit-2026-09-29.json` (source of truth: 239 findings with
  route, status and resolving PR; 21 rules / 32 choices and 59 family calls with options,
  recommendation and `pick`; owner decisions D1–D4; docs drift; checks). The original eight
  reports are in `docs/research/audit-2026-09-29/reports/` (evidence with file:line refs).
- `npm run audit:page` regenerates `docs/research/audit-2026-09-29.md` (committed; `--check`
  verifies it) and the decisions page in `.cache/audit-2026-09-29/` (`index.html` + `area.css`
  from `packages/styles/dist`, so run `npm run build` first). Page templates (specimen markup,
  CSS, script) are in `docs/research/audit-2026-09-29/page/`.
- Page: https://claude.ai/artifact/HPeEX5JVpgzugs4uJMQV7i (new link; the old "Area Audit
  Decisions" artifact is frozen). Republish with `files: { "area.css": ".cache/audit-2026-09-29/area.css" }`
  and the page URL as `url` — the page alone is ~250 KB.
- Owner picks (2026-09-30): the recommended option on all 91 choices (32 rule choices, 59 family
  calls), recorded as `pick` in the JSON (D5); every rule is `decided`. Page republished.
- Phase 1 done (2026-09-30):
  - **S1** field focus: `field-focus-color` = `focus-color`, new `field-focus-halo-color` (focus at
    14%) on Input, Textarea, Select, NumberField, InputGroup; Composer keeps the quiet neutral edge
    via `composer-focus-color`. Verified live: light #004cb0, dark #c1d9fd, both with the halo.
  - **S2** weight 500: docs rewritten to match the code (DESIGN_SYSTEM, typography, alert, panel,
    calendar). No CSS changed.
  - **S3** corners: radius axis token `radius-concentric` (0 at Sharp, 1 otherwise) scales the
    distance in Card (all sizes and well), Composer, Message, Prompt suggestions, Toolbar,
    Segmented track and the ColorSwatch shape. Verified live: Standard unchanged (card 24/28,
    composer 16, toolbar 16, segmented 10), Sharp 0 everywhere. DESIGN_SYSTEM radius rule rewritten
    (S3b). F-1 stays partly open: a small card still derives from the md control radius.
- Phase 2 done (2026-09-30):
  - **S5** off greys: Slider rail and range rail, Progress rail → `edge-control` #e2 (as Switch);
    Slider thumb edge → `edge-control-hover` #d4 (as Checkbox/Radio). Spinner track unchanged, so
    E-22 is partly open.
  - **S6a** Badge soft neutral and Chip input → Count's 6% translucent plate (hover 10.7%, press
    12.3%; dark 10/22.6/27.9% white). **S6b** Message actions drop their fg-muted override.
  - **S7a** Composer and Code block edge → Card edge (neutral 100 / dark 750); Composer hover →
    `input-edge-hover`. **S7b** documented (Card #ee with halo, Table frame #e2).
  - Verified live in the gallery (computed values). DESIGN_SYSTEM "Shared state paint" and the
    edges paragraph rewritten; specs updated by a subagent pass.
- Phase 3 done (2026-09-30):
  - **S4** per-tier radius (6/8/10) on Input, Textarea, NumberField, Select (`--_radius` per size)
    and InputGroup (`--_group-radius`); Segmented track takes the tier radius, items concentric
    inside (md 8 around 6; was 10 around 8); Calendar days control-md 8 (F-12).
  - **S8** joined-control seams keep #e2: written exception in DESIGN_SYSTEM (docs only).
  - **S9** Alert close is a ghost sm Button with the Area glyph (tinted: tone ink, 12% ink plate);
    Chip remove uses the Area glyph; `onDismiss`/`dismissLabel` on Chip and Dialog (old
    `onRemove`/`removeIcon`/`removeLabel` and `onClose` are deprecated aliases). Demos and
    pages.mjs moved to the new names. Tests: `packages/react/tests/audit-rules.test.mjs`.
  - Also F-6 (ColorPicker inner rules → border-decorative) and G-18 (prompt-suggestion dismiss sm,
    pressed plate).
- Phase 4 done (2026-09-30):
  - **S10** Surface axis roles `shadow-card` and `shadow-float` (none at Flat); nine floating
    literals and Card's halo read them; Table frame on `stroke-width` (keeps its edge at Elevated);
    cohesion test now asserts the role. Tooltip and the Toolbar floating bar keep own recipes.
  - **S11a** density token `gap-row` (12) puts every icon row's label at 36: Menu, Palette,
    Combobox, Select options, and Nav via `inset.css` (row gaps live there, not in nav.css).
    **S11b** Nav/Tree inset focus ring; Breadcrumb ring on its plate. **S11c** nested row controls
    hover with `bg-hover`.
  - **S12** quiet Kbd = string shortcut (Geist 12/16 400 muted, danger row ink); "Esc"; keycap in
    any Button `currentColor` 14%.
  - Verified live (computed values); gallery "before" review demo still pins the old 8 menu gap.
- Phase 4 follow-up: a quiet Kbd in a menu takes the text end inset (inset.css reserves the
  keycap box only for `--on-color`) and has no border: ends 11 from the row like a string.
- Phase 5 done (2026-09-30):
  - **S13** menus check-only (MenuItem `radio` → menuitemradio; ModelPicker uses it); value
    pickers plate + check (Combobox sets `data-selected`); gallery Selected tile and Composer mode
    menu moved off raw data-selected.
  - **S14** density gap sm/md/lg → 6 (default); Button reads tokens; Button group and Toolbar stop
    overriding child gaps; layout uses of the gap tokens pinned to space-8/space-4 (Card header,
    footer, overlay pad, horizontal Field, Alert/Toast row, Slider range, Breadcrumb items, Alert
    actions, Kbd chords). Unused `--_group-gap` / `--_toolbar-gap` declarations remain.
  - **S15a** Segmented thumb `light-dark(bg-surface, bg-component-active)` (dark #3f on #28).
    **S15b** neutral soft Split button = soft Button group recipe.
- Branch `claude/cool-kirch-9facec` merged as PR 31; its JSON sessions are now "PR 31 (phase N)".

## Audit phase 7 (2026-10-01, branch `claude/component-work-51c375`, in PR)

Every remaining open fix and picked family call, family by family; statuses are in the audit
JSON (session "this branch (phase 7)"), with `note` on anything left partly done.
- Buttons and Toolbar: ToolbarSize context; soft selected edge; a menu button that's open shows the
  pressed plate; a disabled seam is drawn by its enabled neighbour; a fully disabled group dims as a
  whole; Kbd `on-emphasis` merged into `on-color`; Button `defaultSelected`/`onSelectedChange`.
- Fields: Select picker icon and checkmark drawn as Area glyph masks; options use the Menu row model;
  field actions are height − 8 with concentric corners; read-only and disabled paint; InputGroup
  context; Textarea lg removed; NumberField read-only hides steppers, Escape cancels a scrub.
- Choices and marks: new `SliderRange`; Slider RTL and Shift+arrow ×10; Chip Backspace/Delete;
  Indicator `hidden`/`label`; ChipGroup role group; Avatar renders a span; Presence xs removed.
- Navigation: `MenuSub` (nested submenus); one 1s typeahead; Breadcrumb ellipsis with `items`
  opens a Menu of links (D-19); `NavGroup nested` steps rows in one Tree view level (D-20, applied
  in inset.css, which owns row padding); MenuSearch deprecated (D-22).
- Overlays: `Toaster`/`useToaster`; `useHoverIntent` shared by Tooltip and Hover card (mouse and
  pen, focus opens at once, one Escape handler; E-18); Dialog and scrim fade and scale over 150ms on
  the motion axis (E-19); `PopoverClose`, PopoverTitle `level` (`false` in Hover cards; E-8); review
  rows for complete families and dead demos removed (E-26, H-24).
- Surfaces: Calendar default is `surface` (bare class draws it; `plain` resets; F-21); Property list
  panels at sm (F-28); CardTitle/Panel/Calendar heading levels; TableLink; sort headers.
- Conversation: demos use the placeholder vocabulary and author "Assistant" (G-23); Composer action
  slots are `<fieldset disabled>`; CodeBlock copy state.
- System: title-xs; Token deprecated in code (H-25); loops scale from the duration tokens (H-20).
- Owner said go with recommendations unless breaking (2026-10-01): every value callback passes
  `(value, event)` (event optional where none exists); names follow `aria-label` (own element) /
  `<part>Label` (sub-part) / `label` (visible text), collections are `items` — old props kept as
  deprecated aliases (rule in DESIGN_SYSTEM "CSS, manifest and React"); BoxField caption outside a
  Panel is Field's label; field leading glyphs stay muted when invalid; F-1 keeps the owner's 22.
- Docs-only calls recorded in the specs (C-20, C-21, C-32, D-16, D-23, F-26, F-31, F-32, G-26).
- S21a: `mark-sm/md/lg` (16/20/24, held in compact) on the density and ui axes, read by Badge,
  Count, Switch, ColorSwatch, Presence and the Indicator count; evidence from vscode.dev (no
  login; captures `docs/research/captures/*/vscode--*`). A surface-inset role waits for compact
  surface captures. H-9 closed.
- 2026-10-01, owner go-ahead: H-13 renames (breaking): Button `align` start|end, IndicatorAnchor
  `overlap` rectangular|circular and `inset` (was `compact`), Card `layout="thumbnail"` (was
  `compact`), Switch tone axis removed for the `--area-switch-color` hook.
- S21c first dark pass: ChatGPT dark read live in the owner's Chrome (theme switched, then restored
  to System; `docs/research/captures/baseline/chatgpt--dark-tokens--2026-10-01.md`). Owner prefers a
  near-black dark mode: dark `bg-page` is neutral 975 (#020202, was 900), dark scrim 50%.
- Composer Stop: owner confirmed it is the stop square (screenshot); no capture needed.
- Dark pass done (H-5): all families swept in dark; new `border-float` role (dark neutral 650) for
  floating frames; docs theme switch forces one restyle (Chromium kept stale light-dark() colours
  after a runtime color-scheme flip; THEMING.md documents it for consumers).
- Next (owner, 2026-10-01): a full compact version of every component, set once with
  `data-area-ui="compact"` rather than per-instance `sm` (H-4). Needs dense evidence per family:
  vscode.dev works without login; Figma and Notion through the owner's Chrome.

## Audit phase 6 (2026-09-30, branch `claude/component-work-51c375`, in PR)

- **S18** loading keeps focus: Button `loading` = `aria-disabled` + `aria-busy` + `data-loading`,
  clicks dropped (no implicit submit), full ink, spinner fills the tier icon box. Composer `loading`
  (`busy` deprecated): field stays editable, Enter doesn't send, send becomes Stop (`onStop`,
  `stopLabel`). Stop's filled square is the pilot `stop` icon; ChatGPT's stop state is **not
  captured** (needs a sent message; ask the owner, e.g. a temporary chat).
- Component glyphs: `gen-pilot-icons.mjs` exports rects and filled-circle glyphs; `glyphPaint`
  (`stop` solid, `more` fill) read by Glyph.tsx. Icon sessions: this touched the generator.
- **S16** one floating engine: Hover card on `useAnchoredPosition` (start, 8); `.area-popover-anchor`
  and the `popoverAnchor` manifest entry deleted; Combobox list on the engine (4, ≥224, ≤324);
  Select's native picker flips, ≥224, ≤324, plate-only focus (B-5 B supersedes the 09-24 no-flip
  call); ToolbarOverflow = ghost icon Button + Menu of MenuItems (breaking); menus from a toolbar
  command clear the bar by 4 (`clearToolbar`, shared with SplitButton); InputAction hint is an
  AnchoredTooltip. Verified live (gaps, alignment, flip, focus, paint).
- **S17** API vocabulary, four slices, renamed props keep deprecated aliases (rule in
  DESIGN_SYSTEM "CSS, manifest and React"):
  1. Callbacks and open state: Segmented `onValueChange(value, event)` (+ `name`/`form`, group
     `disabled`, reset), Checkbox `onCheckedChange`, events on Switch/Slider/Chip/Tabs; Dialog
     `open`/`defaultOpen` (opens without a trigger); Hover card `open`/`defaultOpen`/`align`/
     `offset`/`delay`; Tooltip `closeDelay`; Popover manifest side `bottom`; CodeBlock `onValueChange`.
  2. Manifest axes: Kbd `size: sm|md` + `variant` (CSS `--sm`/`--md`), Code/Token booleans,
     Badge tone `inverse`, Tabs/Table default `md`; single-value axes and forwarding props are
     written exceptions.
  3. Names and slots: MenuItem `icon` (demos converted), pickers let `aria-label` win (ColorPicker's
     inner controls follow it), group `aria-disabled`, ColorSwatchPicker no preselection,
     AlignmentPicker `soft` (was `surface`), ColorPicker `variant: surface|plain`.
  4. Fields and wrappers: `style` on the shell with `className` (Input, NumberField, Combobox),
     NumberField `invalid`, BoxField `readOnly`, ModelPicker `triggerProps`, ScrollToLatest
     `buttonProps`, Message default author, `--area-composer-inline-size` hook.
  Left (in the JSON `progress` notes): `(value, event)` in Combobox, ColorField, ColorPicker,
  Calendar, NumberField, BoxField, Composer; ContextMenu uncontrolled; label vs aria-label and
  slot/collection renames (H-14); Button toggle controlled-only.
- **S19** Alert/Toast one tone set in Badge order, Alert neutral icon muted (#666 on #f7, 5.36:1);
  Indicator's danger default is a written exception. **S20** Indicator count 12/16/500 ("99" on a
  32px avatar checked live). **S21b** started: `--area-opacity-disabled` replaces 16 literals.
- JSON statuses and `audit-2026-09-29.md` regenerated; the artifact page is **not republished** yet
  (owner said keep working; read the live page first when republishing).
- **S21b** done (2026-10-01): `--area-opacity-disabled`; `--area-scrim` (a themed literal alias:
  13.3% light, 65% dark; `literal()` now takes `{ light, dark }`); 4 dead tokens pruned
  (badge-bg, badge-fg, badge-tracking-wide, radius-nested); 48 hover rules plus 6 split paint rules
  under `@media (hover: hover)` (focus, `data-hover` and hover-to-reveal stay outside; Tree view row
  actions got the missing `hover: none` fallback, H-17); z-* parked (components stack locally).
  Palette ramps and primitive ramps are kept even where unused.
- **S21a** blocked on evidence: the 16/20/24 marks don't map to one tier ladder, and the only
  compact evidence (Notion and Figma checkboxes, 16) says marks hold. Needs compact captures of
  Badge, Switch, ColorSwatch, Count, Kbd, Presence and surface insets before mark-*/inset roles.
- **S21c** needs the owner to switch product themes for a dark capture pass (overlays, Card first).
- Composer's Stop glyph still needs a ChatGPT capture (owner declined for now).

## Audit medium fixes, batch 1 (2026-09-29, branch `claude/component-audit-progress-60ca4b`, uncommitted)

- Owner decisions from the audit (emphasis roles; fix all of section 1) are recorded on the
  "Area Audit Decisions" artifact with their status; before/after page: "Area Audit Progress"
  (https://claude.ai/artifact/DUUr5tgGFccjFaKNnhStzj). No system rule (S1–S21) or family call is
  decided yet.
- Fixed (no taste call): B-2 Select rests without shadow-1; F-11 circle calendar days hover to
  bg-component-active; D-5 disabled tree rows dim to 50%; B-8 InputAction pressed/disabled paint;
  E-7 a triggered Dialog takes aria-label on the native dialog; E-8 (partly) PopoverTitle labels its
  Popover (no PopoverClose, title still a fixed h2); C-9 RadioGroup and F-13 Calendar reset with
  their form; B-12 Combobox submits the option value through a hidden input and resets; B-13 IME
  Enter guard in Combobox and NumberField; C-10 Slider aria-valuetext from its readout; A-12
  icon-only Button keeps children as its name. Tests in `packages/react/tests/audit-medium.test.mjs`;
  specs (select, calendar, tree-view, input) and DESIGN_SYSTEM updated. Form resets verified live.
- `node --test packages/react/tests` fails on Node 26 (directory argument); use
  `node --test packages/react/tests/*.test.mjs` (166 pass after `build:docs`).
- Next (owner, 2026-09-29): restructure the audit workflow before more fixes:
  1. Move the audit into `docs/research/audit-2026-09-29.md` (or .json + md): every finding ID,
     severity, status (done PR 28 / done batch 1 / partly / open), the 21 system rules and 59 family
     calls with options and recommendation, and owner picks. Data source today: the "Area Audit
     Decisions" artifact's FIXES / DRIFT / SMALL arrays and S-cards.
  2. Generate the decisions page from that file with a script; publish Area's stylesheet as a
     separate file (`files`), not inlined (the inlined 590 KB made each republish cost ~350k tokens).
  3. Then one phase per session: owner picks → implement ~10 fixes or ~3 rules → docs → page update.
     Broad reading (spec drift sweeps) goes to subagents.
- Default accent is now blue (owner, 2026-09-29; was indigo): `ROLE_SCALES.accent` and
  `DEFAULT_SELECTION.accent`. Focus follows the accent (`tokens/src/semantic/aliases.ts:181`), so
  rings are blue (#004cb0 light, #c1d9fd dark). Blue now equals `info`; accepted. Whether focus
  becomes its own `focus: neutral | accent` role is still open (S1 field focus reads it either way).

## Audit, emphasis roles and fix-first (2026-09-29, branch `claude/component-audit-visual-guide-ac7bc4`, uncommitted)

- Whole-library audit (8 parallel audits, 239 findings) published as the "Area Audit Decisions"
  artifact (https://claude.ai/artifact/6mjomgM6ZogMfoHX6BvFXR): 21 system decisions, 59 family
  decisions, 99 fixes, docs drift. Reports were kept in the session scratchpad only.
- **Emphasis roles (owner):** accent is no longer a component variant. New axes `action` and
  `selection` (neutral | accent, default neutral; `tokens/src/axes/emphasis.ts`) switch role
  tokens derived in `emit/base.ts` (`action-solid`, `fg-on-action`, `selection-solid`,
  `fg-selection`, `selection-surface`, `-band`, `-edge`…). Action = solid neutral Buttons (and
  Split button, send); Selection = checked/on/filled/current marks. Row plates, Segmented thumb,
  soft/outline/ghost Buttons stay neutral. `tone="accent"` removed everywhere; single-value tone
  axes dropped (Checkbox, Radio, Chip, AlignmentPicker, Calendar, Slider, Progress, Spinner,
  Count, Nav). Gallery "Tone / accent" tiles became "Selection / accent" and "Action / accent"
  (scoped `data-area-*`). DESIGN_SYSTEM "Emphasis roles" and THEMING updated; per-family specs
  still mention accent tones (drift).
- **Fix-first applied:** Button group hover edge and solid children (A-1/A-2), Tree selected row
  under hover (D-4), dark code rules (G-3: dark code ground 850, inline Code faint edge),
  reduced-motion Progress (E-9), Pill caps on uncapped shapes and Card (H-1; Sharp is still
  decision S3), required edges on `stroke-width` (H-3, F-5), RadioGroup generated name (C-8),
  Calendar unavailable days focusable via aria-disabled (F-9), tooltip/hover-card Escape no
  longer closes the parent surface (E-4), Model picker on Menu's trigger path (G-11). Consumer
  fixture updated; `test:consumer` passes again. Families keep their Complete status.

## Owner direction

- **Icon sessions open with the owner's decisions** (owner, 2026-09-28): before drawing, list
  the decisions pending for the next icon batches, with options and a recommendation (the
  "To settle with the owner" section of `docs/research/icon-inventory.md` and open questions
  below). Work starts once they are made.

- Visual-first: get every component and variant exactly right from measured evidence
  (ChatGPT, Notion, Figma, Cursor, Untitled UI, Fluent), then systematize tokens.
- Lighter UI: regular-weight titles, few sizes/weights/colors, one variable per distinction.
- Area draws its own stroked icons at 1.125px (`--area-weight-icon`).
- A compact density of the whole system is planned for dense products (Cursor and other
  IDEs, Figma, Notion). Dense sizes (24/28px) go to compact density, not new component sizes.
- The documentation site is hidden. Work happens in the gallery pages until the owner
  asks to populate the docs.

## Process (read before component work)

- `docs/COMPONENT_ADAPTATION.md` (process), skills `area-component-build` and
  `area-visual-language` (`.agents/skills`, linked from `.claude/skills`).
- Capture: `apps/docs/public/area-capture.js` (checksummed, with a fingerprint check);
  `npm run capture:compare`. The Edge extension truncates results at about 900 characters
  (read in chunks), background tabs stall async scripts, and products are read-only (ask
  before switching a product's theme).
- Specs: `docs/specs/` (indicator, icons, typography, PRIOR_DECISIONS); baseline
  `docs/research/BASELINE.md`; captures in `docs/research/captures/`.

## Current state

- **Gallery:** eight pages with a nav: components, typeRamp, iconography, color, scale,
  radius, surface, motion. `index.html` and `gallery.html` redirect to the components page.
- **Type ramp (applied):**
  - text 12/16, 14/20, 16/24; titles 20/28, 24/32, 32/40; titles fixed in compact;
  - small controls 14/20 at default density (12/16 only under compact, `density.ts`);
  - weight 400 everywhere except labels on fills (500).
- **Icons:** 529 sources in 64 batches, 130 approved, the rest in
  review; rules in the `area-icon-construction` skill, record in `docs/specs/icons.md`. Latest: the
  whole-set audit (2026-10-01, `docs/research/icon-audit/`: coverage against Fluent, Lucide,
  Phosphor, Hugeicons and SF Symbols, 50 icons cleaned up and back in review, owner questions by
  batch) and batch 61, the bot cast (`agent-cast.py` in `docs/research/icon-review/2026-09-29/`).
  2026-10-02 (branch `claude/icon-work-c10522`, PR 35): the audit's owner questions drawn,
  then the owner's rounds. Rules now in the skill: multiples keep Phosphor's geometry as Cursor's
  open L; "a gap is information, never style" (flat slash in the outline, shapes cross whole, no
  stylistic openings); dots by role (⌀1.5 detail, ⌀2 mark, ⌀3 badge); aliases (`data-alias-of`);
  `pin` renamed `location`. Batches 62 and 63 (coverage rounds 1 and 2, 35 + 42 icons) recorded;
  every priority and secondary gap from the audit's coverage list is drawn (folder-zip as batch 64, Fluent's zip, branch `claude/icon-work-867413`, redrawn closer to Fluent on `claude/icon-work-b0302f`; there too: the four open items (file-code, vault, circuit-board, call-end; sheet 33) batch 65 (7 kept of the build queue after the owner cut the niche ones, sheet 34), the cross-library relevance audit (`docs/research/icon-audit/relevance-2026-10-02.md`, all 5 systems; owner: judge by use, keep the niche list) and batch 66, its 32 build-next icons (sheet 38); then the size-curve fix for filled icons (`filledUniform`) and the mark pass over every +, ×, ✓, !, ?, dot, slash and arrow (15 icons fixed, spec "Mark pass", sheets 39a–b); blocks as four equal blocks, image family re-laid (sun dot top right), basket redrawn, chip on x.5, knockouts exit square at edges (generator), slivers removed set-wide (`slivers.mjs`); cleanup round and owner picks in the spec, sheets 20–31; open items: the 2026-10-02 README). Tools: `--parts` drift report, `sheets.mjs` explainers. Review
  sheets and open decisions: `docs/research/icon-review/2026-10-02/README.md`; rules write-up
  `cursor-rules.md` there.
  Filled is "more ink, never a negative" (skill). Reference sheets: `icon-refs.mjs` (SF Symbols
  local only, via `sf-render.swift`).
  - Sources: `apps/docs/assets/area-icons-pilot/` (`npm run icons:pilot`, `npm run lint:icons`,
    `--report`, `--audit`). The lint checks the grid, the diagonal lattice, keylines, the
    gap and counter scale, acute corners, filled gaps, and live area.
  - Review: `gallery-icons.html`, grouped by `batches.json` with owner status and a
    whole-set grid per batch; open questions go in `explore/`.
  - Batch 1 (core) is approved except items back in review; batches 2–13 are in review.
  - Components drawing Area glyphs: Badge dismiss, NumberField steppers, TreeView chevron
    and check, Composer send (`glyphs.ts`, `Glyph.tsx`, with sizes on the size curve).
    Fluent remains elsewhere and in demos.
  - Remote review: render a sheet with headless Edge (see the batch 5 note in the spec).
- **Indicator (pilot component):**
  - 6px dot; 16px count with 10/14 text, weight 500;
  - 1px surface cutout;
  - counts centre on the corner (`compact` is opt-in); dots centre on the icon corner;
  - tabs reserve space after the label; circular owners sit 2px outward.

- **2026-09-26 (branch `claude/component-variants-audit-fc1ee4`, uncommitted):**
  - gap audit of 13 design-system catalogues: `docs/research/component-gap-audit.md`,
    summarized in `docs/COMPONENTS.md` (Gap audit section);
  - ColorPicker Figma pass (`docs/specs/color-picker.md`, 11 Figma captures): ten-row width,
    16px pill tracks, ringed thumbs, eyedropper, Hex/RGB/CSS/HSL/HSB value row, header slot;
  - Calendar, new (`docs/specs/calendar.md`, 7 Notion captures): single/range/multiple,
    two months, bounds, APG grid keyboard; gallery tiles use the new `1x2` span;
  - later passes: Calendar neutral tone, 12/16 days, circle/tile days, markers, week strip,
    Schedule composition; ColorPicker views (spectrum/grid/sliders), OKLCH, contrast band,
    preview, save; `scripts/gen-color-grid.mjs` generates the palette grid;
  - captures from pages that block the script: paste it, then hand results over the
    clipboard (`pbpaste` needs `LANG=en_US.UTF-8`) or a local `postMessage` relay
    (COMPONENT_ADAPTATION.md, "Browser tools");
  - neutral-by-default sweep: Checkbox, Radio, Chip and AlignmentPicker gained a `tone`
    axis (neutral default);
  - **cohesion audit** (`docs/research/cohesion-audit.md`): every family accepted before the
    evidence process re-checked; 37 new specs; shared state paint (row plates, disabled,
    fixed ink, neutral markers, one floating lift, one label weight) written into
    DESIGN_SYSTEM.md and the skills; 20 families reopened for review; `check-token-refs.mjs`
    in the styles build and `packages/react/tests/cohesion.test.mjs` guard the rules; Untitled
    UI values pinned in `docs/research/untitled-ui-reference.md`; 23 ChatGPT baseline captures;
  - **second and third passes (2026-09-26/27):** 77 Notion and Figma captures and 424 Area
    recaptures; every audited spec carries them. Every open question is settled in the audit
    ("Second pass" and "Third pass" sections): dark neutral alphas solved against the page
    rung, `border-divider` role, Kbd filled and concentric inside Buttons, Switch travel,
    Segmented muted ink, Card container radius and divider edge, Select `soft`, Button group
    full-height seam, Panel all-soft rows, and more;
  - **gallery:** Pass reviews removed at the owner's request (`cohesion.tsx` deleted). Tiles
    are grouped per family (Default, Variants, Tones, Sizes, Layout, Content, States, Behavior,
    Variant × tone; `specimenGroup` in `apps/docs/scripts/specimen-names.mjs`). Every
    non-default manifest value has a tile; extra tiles live in
    `apps/docs/src/demos/gallery-variants.tsx`.

  - **Card (2026-09-27, In review):** layouts vertical, horizontal (40 / 60, media start or
    end by order, stacks below 480px via a container query), compact, immersive; `CardMedia
    bleed`; size (12/16/24 corners, 6/8/12 insets); linked cards (`CardLink` stretched over the
    card, edge-step hover, card focus ring, `CardOverlay reveal`); CardHeader, CardOverlay,
    well, CardList; eight templates in a Templates gallery group. Appearances were removed at
    the owner's request (a later system-wide pass); their evidence stays in
    `docs/research/captures/card/`. Spec: `docs/specs/card.md`. Paint pass: neutral 25
    media, edge #ee, faint two-layer shadow; type audit added tracking, `CardValue`,
    `CardCarousel`, a well that stacks its contents, and space reserved beside bottom overlays.

  - **Overlay behavior (2026-09-27, In review):** `trigger` on Popover, Menu and Tooltip
    (native popover top layer, `popovertarget` on button triggers, JS `computePosition` with
    flip and shift, menu button keyboard, tooltip delays and hover bridge, 150ms motion).
    Spec `docs/specs/overlay.md`; tests `packages/react/tests/overlay.test.mjs`; gallery
    `behavior-*` tiles. Tooltip is Complete; its behavior was approved in batch 17.

## Batch 11 Chrome pass and Kbd corner (2026-09-28, branch `claude/kbd-button-refinement-21fa0c`)

- Owner: Kbd "looks too sharp", "thought kbd had a stroke?". Corner 4 → 6 (`--_radius`), no longer
  concentric in Buttons (was 2 at every size); Tooltip takes max(own, concentric). Kbd moved back to
  In review. The stroke is not applied: `GalleryReviewKbd` shows it as a proposal (surface fill +
  `edge-control`). Evidence: Notion and ChatGPT inline hints have no edge (ChatGPT forces
  `!border-0`); Figma's keyboard-shortcuts panel outlines each key (1px 70%, corner 2); Untitled rings.
- Batch 11 side by side recorded in `pass-status.mjs` (Button vs Figma Share, Notion, ChatGPT;
  Button group vs Figma's Present pair; Kbd). Button and Button group unchanged, now officially
  complete; Kbd awaits the owner's decision on the stroke and approval of the corner.
- Owner follow-up: 6px keycap corner everywhere as a rule (token `radius-control-sm`); Kbd
  Templates tiles show it in twelve hosts; Input suffix now centres a keycap (inset.css).
  Open: menus and the command palette show shortcuts unboxed (quiet, as Notion and Figma);
  Escape renders as the ⎋ glyph where ChatGPT and Notion write "Esc".
- Batch 11 approved (Kbd complete as shown). Batch 12 (Text entry) side by side recorded: Notion's
  search and invite fields, Figma search, ChatGPT multiline fields; no paint change; specs' stale
  resting shadow corrected; 51 Area tiles retaken. Input back to In review (Kbd suffix fix).
  Open: Textarea lg is barely distinct from md (same 14/20 and 12 inset).
- Batch 12 approved (date picker: a Popover holding only a Calendar hugs it). Textarea inline
  inset follows Input's per size; gallery date field = Input + Calendar in a Popover (`anchor`).
- Batch 13 (Select, Combobox, Field): no changes; visual passes written; side by side with
  ChatGPT's settings dropdown (rest, hover, open menu) and settings row, saved after the owner
  brought the Claude tab group's window forward (a hidden tab never reaches idle).
- Batch 14 (Checkbox, Radio, Switch) side by side recorded; no code change. ChatGPT switches (off /
  on, rest / hover) saved. Open for the owner: Switch off fill #d4 is darker than ChatGPT (≈#e6) and
  Notion (≈#db); Checkbox / Radio sm equals md except the label gap since small text became 14/20.
  Specs' stale control shadows corrected. Combobox (batch 13) still awaits approval.
- Owner: Switch off track lightened (#e2, hover #d4, local to Switch; fill-toggle unchanged for
  Slider); Checkbox / Radio sm removed. Batch 14 back to ready. Batch 15 side by side recorded, no
  change (Slider sm kept: row height differs).
- Checkbox / Radio card rebuilt from owner references + shadcn Choice Card: control at the end,
  chosen card outlined 2px in the checked colour, `layout` row / tile (tile grid 144 min), Radio
  gained card, leadingVisual and caption. Both remain In review.
- Batch 14 approved. Batch 16: Table compared with Notion's table view (returns), Card's 09-27
  Chrome pass recorded; no change. Card awaits approval. Dev server hang: `apps/docs/dist` held
  an iCloud duplicate ("… 2.html") whose read blocked readSnapshot; it cleared after ~80s.
- Card (owner): one text/button column 4 inside the media inset; corner = default Button radius +
  column distance (sm 18, md 20, lg 24); footer on the column; transport footers centred;
  immersive text on two insets. Card stays In review.
- Batch 17: visual passes written for Dialog and Hover card from the gallery + captures on file;
  live Chrome check blocked (tab hidden again). Open: Dialog's corner under Card's new rule
  (16 by the close vs 24 by the footer buttons).
- Clipboard hand-off failed once (clipboard held other content); the postMessage relay page
  (scratchpad relay.mjs on 3197, window.open + postMessage) works from Notion.
- Chrome was a background window (`visibilityState` hidden): rest captures and clipboard worked,
  hover states were not retaken. Local captures leave through a relay on 127.0.0.1 (CORS `*`).

## Batch 17 live check (2026-09-28, branch `claude/components-work-continuation-3d0d7d`)

- Started from main at PR 24 (`7b5ec4c`). Dialog and Tooltip compared live with ChatGPT in Claude in
  Chrome and recorded in `pass-status.mjs`; new capture `dialog/chatgpt--close-button--hover--light`.
  ChatGPT's tooltip re-measured identical to the 09-25 file. No CSS change.
- Dialog corner decided: stays 16 (set by the close, 8 + 8). ChatGPT's corner is concentric with
  neither its close (12 + 8) nor its pill footer button; Card's rule stays Card's. Owner deferred
  the call ("do whatever you think is best").
- Hover card: still no live side-by-side. The Chrome window went hidden again after the relay popup
  opened (the relay opens a window; close it, then ask the owner to bring Chrome forward).
- Relay for captures: scratchpad `relay.mjs` on 3201. `.claude/launch.json` has `autoPort` (3000
  is held by another session's server).
- Owner round: Dialog body bleeds by the focus ring (a full-width field's halo was clipped);
  chosen Checkbox / Radio card = 1px edge in the checked colour (no 2px ring); batch 13 approved
  (Combobox Complete); Card title + description join (baseline to cap 15 → 11.6) and the last line
  ends at its descent (md 12 → 16 below the baseline). Card stays In review.
- Badge group Chrome pass: the owner's Notion has no multi-select, so a public page
  (thomasfrank.notion.site) was measured: gap 6 between lines / 8 between tags (was 4 / 4, Primer).
  Badge group back to In review. Captures from a hidden window leave through the relay by
  `window.name` + navigating the tab to the relay (popups need a visible window).
- Batches 15 and 16 approved (Chip, Badge group, Card Complete). Batch 17 type checked against the
  captures; Hover card description stays 14 (owner, over Notion's 12). Palette footer plates now 8 on every side.
- Hover card live (Notion sub-page preview) and batch 18 live (Notion context menu and search,
  ChatGPT search palette, first capture) recorded; no CSS change. Batches 17 and 18 ready for
  approval. Open: both products draw the palette larger than their menus (corner 16–20, rows
  36–48); Area keeps the list model (12 / 32).
- Chrome must stay uncovered (macOS reports a covered window as hidden). ChatGPT clears
  `window.name` on navigation, so use the popup relay there (needs a visible window).
- Palette footer: plates 8 on every side; the Move label 6 from the ↓ plate (was 2).
- Batch 19 live on ChatGPT: composer and suggestions unchanged; new captures of a suggestion's
  hover (5% wash + ink lift, which Area does not follow) and the user message's hover actions.
  No CSS change; ready for approval.
- Batches 17-19 approved (Hover card, Context menu, Command palette, Message, Prompt suggestions
  Complete). Batch 20 live on ChatGPT: picker and scroll button unchanged since 09-26; new capture
  of the scroll button's hover (no paint change). No CSS change; ready for approval. Open: both
  ChatGPT controls use muted ink (trigger 16 #8f, glyph #5d) where Area's Buttons use default ink.
- Owner: all neutral ghost / outline Buttons a step lighter for consistency: ink = fg-default
  mixed 75% toward fg-muted (#56 light, 7.3:1; #cf dark, 10.8:1); selected toggles keep body ink.
  This settles batch 20's ink question.
- Card (owner): step 8, so text and controls sit 16 from the edge on every md card (14 / 20 at
  sm / lg), corners 22 / 24 / 28; carousel items on the title's column with 14/20 item titles;
  ghost header controls centre on the title's cap; a card in a well is a compact 44 row. Card
  back to In review.
- Batches 16 (Card again) and 20 approved. Batch 21 live on Notion: view tabs and topbar path
  unchanged; new hover captures (view tab, path item: 5% warm wash, ink fixed, as Area). No
  change; Tabs and Breadcrumb were already Complete.
- Batch 22 live: ChatGPT inline code (first capture) and code block, Notion menu rules. No change;
  Code block ready for approval (the last family in review). Open: ChatGPT's code block uses a 24
  corner and 12/20 code where Area keeps 12 and 14/20 (owner decisions).
- The dev server restarted on port 3000 (same worktree) after the app stopped 51597.
- Code block pass (owner: lighter ground, more vibrant colours): `INVERSION.code.light` = white, so
  the vivid syntax rungs moved 550 → 500 on their own (all ≥ 4.6:1); inline Code and `token-bg`
  keep #fafafa via `bg-stripe`.
- Batch 22 approved: every family in the approval batches is Complete.
- Next: the owner's call (docs site, dark themes, compact density, or new components).

## Avatar photo, initials, Calendar cleanup (2026-09-28, branch `claude/component-variants-gallery-f433f2`, uncommitted)

- This branch fast-forwarded to main at PR 15; a parallel batch 4 pass was dropped and only its
  new pieces re-applied. Owner approved them: Avatar initials 12 / 14 / 16 by size (Notion 14 on
  32); Irene's photo `apps/docs/public/images/irene-yamaguchi.jpg` (owner-supplied, replaces
  `chip-avatar.png`); the avatar badge shows one initial in its 16px disc; dot placement kept.
- Calendar (batch 7, owner): Schedule time list on the grid's rhythm (md rows 4 apart, 13 from each
  side, the calendar's height, shared lift; `align="start"` was pulling the plate onto the rule);
  week strip 12 all round; the two-month tile is a new full-width `4x2` gallery span.
- Batch 7 approved (Calendar). Batch 8 (Panel, Number field, Box field): Claude in Chrome side by
  side with Figma's Design panel; Panel section rules now sit midway (16 below the last field, the
  next title's cap 16 below the rule, via `(row - 1cap) / 2`); Number field and Box field unchanged.
  Panel is Ready for approval; the other two were already approved and are now officially complete.
- Batch 9 (owner feedback): Color field opacity sized to content with "%" anchored at the end (plain
  NumberFields keep "%" after the number); Select single-line with ellipsis, in-group text runs to the
  chevron box; InputGroup visual + Select joins like visual + Input; Property list tiles at 280 (240
  cannot hold hex + opacity at 14px). Gallery-wide check: no clipped input or select text.
- Color swatch (batch 9, approved): solid neutral-50 edge drawn as the swatch's background, layers
  1px inside concentric (radius - edge), corner 20% of the side, Area's own pixel checker (2 x 2 SVG
  mask, 5 cells, meets the edges). Swatch-picker cells concentric with it.
- Batch 10 (Color swatch picker, Color picker, Alignment picker): Claude in Chrome vs Figma's picker
  and Alignment grid; picker opacity sized like Color field, channel fields hug their digits, alpha
  checker 3 rows; a stale 2026-09-24 slider block that overrode the picker's 16px tracks removed.
  Questions: Figma's split translucent chits; Alignment grid sized to the layout (88 x 56).
- Panel (batch 8, approved 2026-09-28): insets 12 sm / 16 md; headings and the bar are rows whose button has one
  field gap above and below (8 / 12, Figma 8 / 8); actions one field gap after the fields; panel text and
  gaps step by tier (sm labels 12/16, gaps 8; md 14/20, 12), shared with BoxField and PropertyList via
  --_panel-*; md size tile shown at 280 (default width stays 240).
- The dev server rebuilds only when a source file's content changes (touch is ignored) and copies `public/` then; restart it after changing an image.

## Count and Banner (2026-09-28, branch `claude/component-banner-count-81af92`, in review)

- **Count** (new, `count.css`, `Count.tsx`, manifest `count`, spec `count.md`): plain (default,
  Notion) / soft (Primer, 6% black translucent plate), neutral / accent, sm 16 / md 20, 12/16
  tabular, `max+` via `count-format.ts` shared with Indicator, hidden `label`. Nav and Tabs demos
  use it.
- **Banner** = Alert `layout="banner"` + `flush` (spec `alert.md`, Banner): OpenAI 12 / 16 inset,
  44 tall, corner 6, flex row, link at the end on the inset. Alert moved Complete → In review; new
  batch "Counts and banners".
- Captures: `captures/count/`, `captures/alert/*banner*` (OpenAI business and Daybreak, Primer). Route
  for public pages in the built-in browser: paste the script, put captures in `window.name`, then
  navigate to a 127.0.0.1 relay page that POSTs them (popups open in the same tab there).
- Chrome side by side done (Notion board counts, OpenAI Daybreak); open: Count text 14 (Notion) vs 12;
  dark theme; no target product showed a banner. `npm run test:consumer` fails on an old
  `Panel size="xs"` in its fixture (unrelated).

## Batch 4 approved, batch 5 Chrome pass (2026-09-28)

- Owner approved batch 4 (Count, Alert with banner). Count stays a pill.
- Batch 5 (Avatar, Indicator, Badge): Claude in Chrome side by side done and recorded in
  `pass-status.mjs` (Figma avatars, bell and AI label; Notion person and workspace avatars, help
  dot, tags). No change to the three families; awaiting owner approval.
- Avatar in Chip: the initials overflowed (Chip used `control-sm-text`, 14 since small controls
  moved to 14/20); now `control-xs-text` like Badge, and the slot is `aria-hidden`. Chip moved
  Complete → In review. Avatar and Chip demos use Irene Yamaguchi (group: Irene + teams).

## Batch 5 approved, batch 6 Chrome pass (2026-09-28)

- Owner approved batch 5 (Avatar, Indicator, Badge).
- Batch 6 (Loading): transient states caught with a MutationObserver installed alongside the
  capture script; ChatGPT and Notion clear `window.name` (COOP), so their captures leave through
  the clipboard (injected button, real click, `LC_ALL=en_US.UTF-8 pbpaste`). Skeleton now takes
  ChatGPT's 10% / 16% grey and 3s linear shimmer (Figma agrees); Spinner unchanged (owner's 1s
  over ChatGPT's 2s). Progress: no product bar found again; not validated.
- Owner feedback: Spinner redrawn as SVG masks with round caps, stroke 1/8 of size (lg 3); a
  2.5px md option waited in `GalleryReviewSpinner` (since removed). Skeleton: rectangle 4px corner, `animated`,
  `lines`, wrap mode (children + `loading`), list tile; `skeleton.test.mjs`.
- Skeleton rethink (owner chose option A from `research/skeleton-rethink-survey.md`): shapes block
  (default) / text / circle; `rounded` and `rectangle` removed; wrap paints the child (utilities
  layer); compositions omit control placeholders.

## Gallery tiles and batches 6-7 (2026-09-28)

- The tall single-column tile (1x2) is gone (`GALLERY_SPANS`): Calendar tiles are 2x2 (two
  months 2x3), Count nav 2x1, every Skeleton tile 2x1. The Pass review's 2x copy now has the
  tile's content width (it collapsed full-width specimens). A DOM audit found no clipped tiles.
- Port 3000 serves a different worktree (`icons-branch-strategy-a94020`); this branch is on 4331.
  The dev server reads `pass-status.mjs`, `component-status.mjs` and the capture folders once at
  start: restart it after changing them, or the Pass review shows stale phases.
- Batch 6: Progress validated against Figma's AI-credits meter (open: Figma's tracks #f5 / #e6
  are lighter than Area's shared rail #dd). Batch 7: Popover validated against Notion's Share
  popover; Calendar against Notion's search Date filter (month label now 500). Batch 6 approved.
  Chrome tip: Notion's menus open reliably with synthetic pointer events dispatched to the
  element (`pointerdown`/`mousedown`/`pointerup`/`mouseup`/`click`); zoomed tabs misplace clicks.

## Owner feedback round (2026-09-27, branch `claude/component-gallery-status-4b51ac`, uncommitted)

- Message action plates align to the text / bubble edge; Card carousel 18.3 under the header;
  Command palette footer hints are working buttons (↑ ↓ Open Close).
- Panel: sizes sm / md only, rows fill the width, `actionColumn` (Figma recipe), width 240.
  Rule: a divider is never darker than its container (Panel, Code block → `border-decorative`).
- Toolbar: pressed = Button selected fill; track painted as Segmented (stroke, no shadow plate).
- Alert fills mixed 50% to surface, brighter icon rungs (Toast icons too); text ink kept (4.5:1).
- Avatar count centred on the circle edge; Calendar 36 / 32 cells, 12/16 numbers, `fixedWeeks` off.
- Nav from ChatGPT / Notion captures (`captures/nav/`): items default ink, labels 12/16 muted, 12
  between groups. Open: Menu's label still 14/20.
- Spinner 1s, track = arc ink 25%, reduced motion slows; Skeleton text keeps its line box, 4
  corners. Survey: `docs/research/skeleton-spinner-code-slider-survey.md`.
- Eight Complete families moved to In review (status file). Headless screenshots:
  `scratchpad/shot.mjs` pattern (Edge + CDP). Relay for Chrome captures: postMessage page on 3199.
- Claude in Chrome round 2: 37 captures (Figma split tools, sliders, design-panel rows, library
  swatches, divider; ChatGPT code block, textarea, stacked field, mode radio cards, colour field;
  Notion link preview). Not found in the owner's pages: inline code, a badge group; skeleton and
  spinner only appear while loading.
- **Approval batches** (`APPROVAL_BATCHES`, 21 batches of 2-3): phases audit → visual pass →
  Chrome side by side → owner approval; gallery leads with the current batch, officially complete
  at the bottom. Batch 1 (Toolbar, Split button, Segmented) is Ready for approval.
- Round 3: one size per gallery tile (7 families split; rule in AGENTS.md); Split button menus
  placed by `useAnchoredPosition` (were CSS anchor, misplaced); toolbar separator lighter
  (`border-decorative`). Batch 2 side by side done: Nav, Menu (labels now 12/16, back to review)
  ready; Tree view officially complete (approved earlier, unchanged). Batches 1-2 await approval.
- Round 4: Nav titles from ChatGPT (14/20 500 muted; Menu keeps 12/16), Nav recipe tile
  "sidebar in context"; batch 3 side by side (Alert vs Notion callout, Toast vs Notion toast).
  Ready for approval: Toolbar, Split button, Segmented, Nav, Menu, Alert, Toast.
- Toolbar: track group removed (Segmented in the toolbar, joins its roving); Figma tools are
  icon-only ghost SplitButtons (no drawn divider, 1px gap). `toolbar-context.ts` makes composite
  controls roving items inside a Toolbar.

## Merge and audit round (2026-09-27, branch `claude/component-variants-audit-fc1ee4`)

- Committed this branch's work and merged `origin/main` (22 commits: inspector and Figma
  properties panel, product components, Dialog/Popover/Menu/Toast/Button passes). Main's passes
  won their conflicts; Card, overlay behavior (`trigger` on Popover/Menu/Tooltip) and the fixes
  stayed on top. Not pushed.
- After the merge: Alert takes Toast's inset (40 tall, controls 6 from the corner); Chip's
  remove is a concentric circle 4 inside the pill; Slider hover keeps the rail; the large and
  interactive Table tiles lost a doubled wrapper; CommandPalette and Combobox no longer scroll
  the page on mount (the gallery jumped ~35,000px on load). Pass reviews for Card, Table, Chip,
  Alert and Slider were in `apps/docs/src/demos/reviews.tsx` (removed 2026-10-01, audit E-26 / H-24).

## Next (historical; superseded by the audit phase sections at the top, and Combobox is Complete)

1. Owner: review the 20 In-review families in the grouped gallery and confirm completion in
   `apps/docs/src/component-status.mjs`. Slider, Separator and Panel (Complete) changed after the
   owner accepted them.
2. Owner: two candidates the evidence raised but that were not started: a borderless (ghost)
   Select trigger (Notion, Figma), and Card as a link with hover actions (Notion, Figma).
3. Product dark themes need the owner's go-ahead; then recapture the changed families dark.
4. Owner: review Calendar and the ColorPicker pass; decide whether ColorField adopts the
   picker's surface-gap divider.
5. Next gap after overlay behavior (audit order): custom Select listbox, then Combobox.
6. Owner: confirm the size model (scale 12–20px, recommended) and the 12px glyphs in
   Badge and NumberField (`docs/specs/icons.md`, fifth pass).
7. Icons: batch 4 (alignment) per `docs/specs/icons.md`; replace the remaining Fluent
   families and move Area's marks to 1.125px at the same time.
8. Compact density: 20–24px avatars, 24/28px rows (see the audit's Kept table).
## Tree view passes 2–3 (2026-09-25, in review)

Chevron plate 20px; row `actions` slot (`data-pinned`); chevron, icon and label on shared
columns (6px gaps, 22px indent); current-row marker removed; variant pass (Variants table,
Disabled row tile, full API). Open: Figma layers capture, layer-type glyphs and a lock icon,
screen-reader check of row actions. Spec: `docs/specs/tree-view.md`.

## Button pass 1 (2026-09-25, in review; reopened from Complete)

Labels 400 (solid 500), 6px icon gap at md/lg, no shadow; neutral ghost hovers with the
`bg-hover` wash, outline and tone ghosts one rung stronger; neutral soft keeps its stroke and
hovers with the wash plus a translucent border (≈235 / 224); Trailing icon tile added. 58 reference captures in
`docs/research/captures/button/`; spec `docs/specs/button.md`.

## SplitButton (new) and ButtonGroup pass (2026-09-26, in review)

Survey of 15 systems: standalone in Fluent, Material 3, Carbon, Atlassian; composition in
Primer, shadcn, Polaris, Mantine, Chakra; never a Button variant. SplitButton is standalone:
two Buttons, trigger width = height − 4 (Notion 24 at 28), full-height divider (solid: label
ink 24%; soft/outline: control line), Menu in a native popover anchored 4px under the end
edge; arrow keys, Escape and focus return verified. ButtonGroup divider is now full height
in `edge-control`. Specs: `split-button.md`, `button-group.md`. Unverified: dark, screen
reader, RTL divider. ButtonGroup has nine variant tiles.

Small controls (default density sm, 28px) now use 14/20 (owner delegated); captions that
borrowed the sm token use the caption role (text-xs), so they did not change.

## Menu pass (2026-09-26, in review; reopened from Complete)

Label column 36 (gap 12 via `inset.css`), hover/keyboard focus share the `bg-hover` wash,
danger keeps red text with a neutral hover, shortcuts in the UI font, Notion's two-layer lift,
and Menu now handles arrows/Home/End/typeahead (SplitButton reuses it). Divider 4 / 1 / 4
(Notion). `MenuItem checked` makes a checkable row (trailing check, or `indicator="switch"`
drawn display-only via `.area-switch__track[data-checked]`). Spec `menu.md`.
Open: submenu keys, a general menu trigger (overlay work).

## Popover pass (2026-09-26, in review; reopened from Complete)

Menu's lift, 320 preferred width, 16 section gaps; new `trigger` prop anchors a native
popover (4px, `side`, flips), moves focus in on open and back to the trigger on close.
Pass 2: description lives in the header (6 under the title), close on the title line with its
icon on the 12 inset, title cap 12 from the top; ladder 12 / 16 / 8 / 6. Spec `popover.md`.
Pass 3: close box 6/6 in the corner (half the inset, concentric radius), title centred on it
(cap 15), title strong (500). Open: same-size titles (Alert, Toast, Card) still regular.
Open: dark theme, arrow when the popover shifts, Dialog's title gap (8) vs Popover's (15). Capture route that works: the built-in browser
returns results in full; Claude in Chrome blocks encoded output, so logged-in captures were
saved as one JSON download per product (owner-approved) and split with a scratch script.

## Next (historical; the icon item still holds, the component items are superseded by the audit phase sections)

0. **Next icon session opens with the review sheets (owner, 2026-09-29):** send the six sheets in
   `docs/research/icon-review/2026-09-29/` (re-render first if sources changed; commands and the open
   decisions are in its README): the redrawn batch 44–60 icons, the bot agent cast (Agent, Builder,
   Researcher, Scholar, Guard A/B, Lead, Designer, Generator, Automator), six sunglasses, six goggles.
1. **Icons, 2026-09-29 (branch `claude/icon-refinements-stroke-7751a3`):** the owner's
   notes on batches 44–60 are drawn: 22 icons (spec "Owner round, batches 44–60"), all in review.
   Second pass the same day (stacks, bug-off legs, brain folds, VR, step-over). Open: the agent mark
   (Exploration sheet: bot in sunglasses with a fedora or a headset, infinity, the current hexagon),
   whether gallery's stack faces lower right like folders and files, and the rejected
   icons the owner has not commented on again (blocks, bandage, person-chat, binoculars,
   waypoints, toy-brick).
   Earlier (2026-09-28): the owner rejected the last refinement round (vault, blocks, clapperboard filled, check-check, bandage, case-upper and case-sensitive A, folders, bug-off, person-chat, binoculars, brain, waypoints, toy-brick, dumbbell, debug step-over, VR goggles, chef hat, chess rook): redo them, and show the owner candidates before settling. The 18 undrawn concepts have a decision sheet (spec "Refinement round" and the owner's pending answer; recommendations: draw plug-off, binary, cost tiers, chat-dashed, folder-dashed, goal, radar, broom, satellite; use existing for chat-question, file-diff, deck-chair, head-thinking; drop braces-dot, compass-check, bug-play, brain-thinking, file-pdf).
   Owner review on `gallery-icons.html` (In review lists what's open): the detail round (2026-09-28: lint floors relaxed, bank, banknote, crown, tree, paw, plane, git, rain, QR and the type family redrawn, overlap cuts evened; spec "Owner round: detail"); then build-queue batches 44–51 and 53–56 (the owner confirmed the system choices; the owner round after them redrew the agent family as Fluent's agents shape, chat-sparkle, search-off, square-list, dollar, id-card, newspaper, plane (side view), translate, text-size, banknote, bank, award, captions, variable, qr-code and boolean-exclude: spec "Owner round: decisions, agents, Fluent likeness"); then batches 57–60 (queue remainder, AI and people, leisure, debugger); still undrawn (need a new idea or the owner): chat-question, file-diff, plug-off, braces-dot, compass-check, bug-play, binary, cost tiers, chat-dashed, folder-dashed, goal, radar, broom, brain-thinking, deck-chair, satellite, head-thinking, file-pdf; batches 32–42 (the full-set roadmap, part 2 in `docs/specs/icons.md`: demo gaps, Figma tools 2 with the boolean operations as solid results, code and git, media, documents/money/awards, people, nature, type, keys; open: the booleans and contrast are solid exceptions in the outline style, filled tree reads as a club); batch 31 (weather, shapes and money: cloud rain and cloud lightning on cloud-download's open cloud, wind, star off, QR code on grid's squares, rectangle, ellipse, coins); batch 30 (nature and tools); the list family (bullet, numbered, checklist share rows 5, 8, 11); filled lines beside solids keep the icon weight; mark placement is set by the shape; batches 27–29 (AI and chat, Figma tools, commerce; open: unpin's cut); batch 26 (checkbox, checklist, bookmark remove, filter add, top panel, pushpin, palette); batches 24–25 (lists and sorting; view and tools; clear filters and the 1's sharp flag approved; the 2 and percent (Geist's 54° slash) revised; mark placement is set by the shape; filled lines beside solids keep the icon weight); batch 23 (call,
   reply/forward, sync, eraser, text align, indent/outdent, columns/rows, container remove);
   the negative-space round (graduation cap, bell, bell off, clipboard, car, watch: gaps on
   the outline's lines); batch 22; keyboard and repeat; batches 18–21.
   Rules: skill (Shared parts, Families, Filled variants: negative space on the outline's
   lines, only where fill is on both sides) and the spec's last sections; the lint checks
   dot sizes, the shared slash on `-off` icons and knockouts that never enter a solid.
   Batch 43 redrew thirteen dropped icons with one simplification each (skill: Fitting a dense
   idea at 16px). Process tools (2026-09-28): `icons:find` (does it exist?), `icons:geometry`
   (fillet, cut, behind, lobes, transform, gap), `gen-pilot-icons.mjs --only a,b` (a second,
   not a minute; near misses name the distance to fix), `icons:sheet compare out.png batch-NN`
   (beside Fluent), `icons:batch batch.json` (records a batch everywhere). The build queue from
   the owner's Cursor references is `docs/research/icon-inventory.md`.
   The drawing roadmap is done; what remains is the swap below. New rules this round: every
   cloud is the one shape (weather clouds moved up, rain hangs from the foot, the bolt crosses it
   with a filled-only `halo`); qr-code's `data-gap="aligned"`. Batch sheets:
   `icon-sheet.mjs filled out.png <icons…>`.
   The lint doesn't measure gaps within one path (paperclip's were solved by hand).
   `npm run typecheck` fails while the dev server rebuilds `packages/react/dist` (TS7016 on
   `@area/react`); rerun once the rebuild settles. Review filled variants with
   `node apps/docs/scripts/icon-sheet.mjs filled out.png`.
2. Icons: auto-position needs a new concept. Then swap the demo-level Fluent imports for
   Area icons, one family at a time with the owner's approval, and retire the Fluent map.
3. Components happen on branch `components`, in its own worktree session.
4. A stroke and type baseline across Cursor, ChatGPT, Notion and Figma (needs the owner's
   go-ahead for product dark themes).

## Verification (2026-09-27, historical)

As of 2026-10-01, 204 React tests and the consumer check pass (phase 7 section). On 2026-09-27 these passed:
- 19,491 token tests (contrast gate unchanged);
- 114 React tests, including `tone.test.mjs` and the new `cohesion.test.mjs`;
- typecheck, docs build and audit, manifest parity, token-reference check;
- 14 contracts, 4 preview tests, consumer check, capture checksums, `git diff --check`.

Unverified: cross-engine, screen reader, forced colors (execution), product dark themes, and
the third-pass changes in dark mode.

The docs build can fail with "Could not resolve @area/styles/manifest" while `npm run dev`
is rebuilding the styles package; rerun it.

About 284MB of ignored leftovers under `archive/` (old source caches and logs) remain on
disk; delete them manually if wanted.

## Dialog pass (2026-09-26, in review)

Close is a 32px ghost Button 8/8 in the corner (shadcn, Primer 8/8; ChatGPT 12/12), icon on
the 16 inset, title centred on it; title baseline to description cap 15 (Popover's rule);
Menu/Popover lift; scrim 13% black (ChatGPT) without blur; `trigger` opens a native modal
(verified: focus, Escape, scrim click, focus return). Spec `dialog.md`. Open: dialog title
type (references 14–16 at 500–600 vs Area 20/28 regular), dark scrim, AlertDialog.
Chrome capture route: downloads need "allow multiple downloads" per site (chatgpt.com now allowed).

## Type and radius pass (2026-09-26)

Every surface title strong: 14/20 compact (Popover, Panel, Alert, Toast), 16/24 standalone
(Card, Dialog; Dialog was 20/28). Descriptions 14/20 muted (Popover was 14/18). Role table in
typography.md. Dialog corner 16 = close radius + offset (concentric); radius audit in
dialog.md (Alert, Code block, Input, ColorSwatchPicker flagged, not changed).

## Toast pass (2026-09-26, in review)

Popover's numbers: 12 inset, icon 12/12, 40 tall with or without controls, last control 6/6
(concentric with the 12 corner), shared lift (Notion uses the same), strong title, muted
description (`area-toast__description`, manifest element added). Spec `toast.md`. Open: an
inverse (dark) toast like Notion's.

## NumberField pass (2026-09-26, in review)

Figma model: `scrub` takes the field's letter or icon (grip only for `true`), whole square is
the target; unit sits after the number (`field-sizing: content`), hidden beside Mixed/empty;
inspector demo is soft with X/Y/W/H handles. Spec `number-field.md`. Screenshot route for the
owner: `scratchpad/shot.mjs` (headless Edge + CDP, element PNG) then SendUserFile.

## NumberField pass 2 + Inspector (2026-09-26, in review)

Steppers are minus/plus nested 24px squares (press-and-hold repeat, out of tab order); no
resting shadow on Input, NumberField, InputGroup, Textarea, Checkbox, Radio (as Button).
New: PanelRow (two columns + trailing square), PanelSection `actions`, ButtonGroup
`fullWidth`, NumberField `grouping`; Figma Design panel recipe (`GalleryPanelFigma`). Specs
`number-field.md`, `inspector.md`. Panel is marked complete but gained these pieces; the owner
should re-review it.

## PropertyList (2026-09-26, in review)

New component (`PropertyList`, `PropertyListItem`, `property-list.css`, manifest `propertyList`,
docs page `property-list`): value + consumer buttons per row; handle in the panel inset (new
`grip` glyph); pointer drag with drop line, keyboard ArrowUp/Down/Home/End with focus kept and
a live announcement. Figma recipe's Fill section uses it. Verified with real events in
headless Edge (`scratchpad/plist.mjs`). Open: 8px small-panel inset is tight for the handle.

## Collapsible sections (2026-09-26, in review)

`PanelSection` `collapsible` / `open` / `defaultOpen` / `onOpenChange` / `summary`: h3 > button
disclosure, chevron in the inset on hover, summary while collapsed, heading-only sections
centred. Figma recipe sections collapse; Selection colors and Export added. Tests in
`dialog.test.mjs`; interaction verified in headless Edge. Dev server was stopped by the app
once; restart with preview_start "dev".

## BoxField (2026-09-26, in review)

New component (`BoxField`, `box-field.css`, manifest `boxField`, docs page `box-field`, spec
`box-field.md`): padding (horizontal/vertical, split per side) and corner radius (one field,
split per corner) on the PanelRow grid with a pressed toggle in the trailing square. Five new
package glyphs (corner, corners, padding-side, padding-axis, sides; rotation for directions).
Figma recipe: padding in Layout; Independent corners opens a Popover with the four corners.
NumberField Escape now only claims the key during an edit. Figma's split layouts are
unmeasured (owner asked whether panels may be opened).

## Variant audit (2026-09-26)

Report-only audits of every in-review family plus Panel ran; findings are in the session
report (missing size/state tiles, no specs for the color family, alignment picker, toolbar
and input group, disabled dimming, Menu selected state). Nothing from them is fixed yet.

## Approvals, Composer radius, resizable Panel (2026-09-26)

Owner: every built component without requested changes is approved — all former In review
families moved to COMPLETE (specs marked accepted). Composer: option B — the send action is an
Area Button (8 radius) and the shell corner is concentric (button radius + 8 = 16; `submitPill`
makes both pill); resting shadow removed. Panel `resizable` ("start" | "end", width /
defaultWidth / onWidthChange / minWidth 240 / maxWidth 500): window-splitter separator with
Figma's 8px handle (6 out, 2 in), cursor-only hover, directional cursor at limits, 4px focus
pill; captures in `captures/resizable/`; spec `resizable-panel.md`. Panel is back In review.
Variant-audit findings (ButtonGroup selected/hover bugs, InputGroup icon boxes, missing tiles,
unspecced color family/toolbar/input group) are not fixed yet.

## Panel audit (2026-09-26, in review)

Bar action on the action column (Figma 208), lg rows and a bar that follows the tier, PanelRow
tiles at matching control sizes plus xs/md/lg/flush/bare-bar tiles, named panels are regions,
`PanelSection headingLevel`, docs API/examples, Property list rows 28. Details in
`inspector.md` "Audit". COMPONENTS.md gained a product-specific inventory (ChatGPT, Notion,
Figma); Combobox is the recommended next foundation.

## Product-specific inventory, in order (2026-09-26, owner: "do each of them subsequently")

Gallery now sorts by RECENT_COMPONENTS first (newest leads). Built and in review, each with a
spec, captures where a target product had one, React test and real-event test script:
Combobox (Figma font size / font picker), CommandPalette (Notion search, 600 wide, 77 from
top), ContextMenu (Notion page menu at the pointer), HoverCard (700/300 ms, GitHub timing).
Package glyph `search` added (pilot circle redrawn as arcs). Next in COMPONENTS.md order:
ChatGPT conversation pieces (Message, MessageActions, ThinkingDisclosure, SourceChip,
AttachmentCard, PromptSuggestions, ModelPicker, ScrollToLatest, VoiceInput), then Notion,
Figma and shared groups. Chrome note: the ChatGPT tab sometimes hangs; screenshot scale can
differ between frames, so click by accessible name, not coordinates.

## List pass, suggestions choice, ChatGPT pieces (2026-09-26)

- One list model for Menu, Combobox, Command palette, Context menu (4 inset, 32 rows 2 apart,
  radius 8, corner 12, Menu label rows, icon gap 12); the palette's search icon, rows, labels
  and footer hints share one column. Footer items are keyboard hints, not controls.
- Prompt suggestions: owner delegated the choice; list is the default (radius 16 = composer,
  rows 2 apart), `layout="chips"` for narrow places.
- Built from ChatGPT captures (Chrome in front): Message + MessageActions, ScrollToLatest,
  ModelPicker (Menu gained `MenuItem.description`, two-line rows 48). Captures in
  `captures/{message,scroll-to-latest,model-picker,prompt-suggestions}`.
- Remaining ChatGPT pieces: ThinkingDisclosure, SourceChip, AttachmentCard, VoiceInput — need a
  chat that shows them and Chrome in front (hidden tabs stall timers; ChatGPT does not render
  turns while hidden). The user bubble's blue is the owner's accent setting, not ChatGPT's default.

## Badge md text (2026-09-27)

Owner: md badges read too large on Card; md text is now 12/16 (was 14/20) at 20px, weight
500; lg keeps 14/20. Gallery audit: all 120 md badges render 20px and no demo passes a stale
size or inline size override. Open: the 12px label hangs 0.7px below a 14/20 line (spec).

## Audit of post-audit families (2026-09-27)

Owner: "work on any components that have not been audited yet." The twelve families that
reached main after the cohesion audit were checked against its rules and fixed: see
`docs/research/cohesion-audit.md`, "Fourth pass". Biggest find: a later literal shadow drew the
shared lift's second layer at full strength on Menu, Popover, Dialog, Toast and the palette; the
cohesion test now checks the painted `box-shadow`. Seven owner questions are listed there.
Complete families touched: Box field, Button, Property list, Composer, Split button, and the
lift on Menu/Popover/Dialog/Toast. Status in `component-status.mjs` unchanged.

## Toolbar redesign and Pass reviews (2026-09-27)

- Toolbar redesigned from Figma's toolbelt (7 Claude in Chrome captures) and the owner's three
  reference shots: 8 inset, Figma's bar shadow, 8 spacing, command-height separators, a raised
  plate for pressed toggles (dark: `bg-component-active`), `ToolbarGroup variant="track"`
  (Figma's mode switch), selects hug their options. Tiles Tools, Content / text formatting,
  Behavior / overflow. Back In review. Spec `toolbar.md`.
- Every family now opens with a Pass review: audit, visual pass and Claude in Chrome evidence
  read from the repo, the default tile at 2x (inert copy). Validated needs an entry in
  `apps/docs/src/pass-status.mjs`; only Toolbar has one. Process doc and both skills updated.
- Chrome notes: the gallery uses smooth scrolling, so scroll with `behavior: "instant"`; the
  gallery tab can freeze the extension, so move captures out with the 127.0.0.1 relay.
- Open: Segmented's selected shadow vs the toolbar plate; a 24px-icon "tools" size (Figma).
- Hydration (#418) fixed: GalleryPanelFlush / BareBar were exported by both gallery.tsx and
  gallery-variants.tsx (server rendered one, client hydrated the other; registry.tsx now throws
  on a duplicate demo name), and HoverCard demos sat in a <p> the HTML parser split. A fresh
  gallery load logs no #418; the two remaining 404s are the Avatar fallback demo's missing image.

## Card consistency pass (2026-09-27, in review)

One geometry rule: text inset = inset + (control − cap) / 2 with the first line trimmed to the
cap and the last to the baseline, so a title is as far from the top as from the side (18.3 at
md); header and footer controls sit on the inset, concentric. One type ramp (title 16/24, body
14/20, value 32/40) at every size; size is corner and inset only. Media inset everywhere but
bleed (immersive too), 16:9 by default. Templates: video, music, weather, stat, plan, feature,
all md (news and tool removed); tiles size-md, horizontal-stacked, horizontal-bleed removed.
Carousel rebuilt (reaches the inset, 3.25 items, header paging; demo `GalleryCardCarousel`,
hydrated; only Gallery/Badge/Switch/Slider demo names render with hydration markers, see
`render.mjs`). Spec `card.md`. Unverified: smooth paging (browser windows were in the
background), Firefox and Safari.
