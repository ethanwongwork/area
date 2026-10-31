---
name: area-interaction-pass
description: Runs a full visual and interaction pass on the Area desktop app (apps/desktop, Electron) and holds the app's interaction patterns as rules - responsive Canvas and cards, header and bar controls, tooltips, breadcrumbs, tiles (select and open), menus, tabs, history, search, panels, keyboard, light and dark. Drives the real Electron window over the DevTools protocol (scripts/cdp.mjs) to hover, click, type, resize and screenshot. Use when the owner reports something glitchy, stuck, cramped or not scaling in the app, asks to test flows, buttons or interactions, asks for a UI pass, or after changing any shared control, header, bar, grid or overlay.
---

# Interaction pass on the desktop app

`area-ui-review` measures a composed screen at rest; `area-visual-language` judges one component. This skill checks the
app **in motion**: what happens as the pointer moves, a key is pressed, a window narrows, a panel hides, a menu opens.
Each pattern below is a rule with the reason it exists and how to test it. A defect found here is fixed in the real
component or the app's layout values, never with an app-only override (AGENTS.md, PRODUCT_UI.md rule 13), and a defect in
one place is audited everywhere the pattern is used (memory: fix the rule, not the instance).

## 1. Run the window you are testing

1. One session at a time: check `origin/main` and open PRs first. Sync the worktree.
2. The worktree needs its own `npm ci` and `npm run build`. `npm ci` may skip Electron's install script: copy
   `node_modules/electron/dist` (and `path.txt`) from another worktree if `node_modules/electron/dist` is missing.
3. Quit every other Area Electron and any `dev.mjs` from another worktree (they respawn windows).
4. Start the watcher without a window (`preview_start` with the `desktop-browser` config, or `npm run preview -w
   @area/desktop -- --no-electron`), then the window yourself with a debugging port. Check the port first
   (`lsof -iTCP:<port> -sTCP:LISTEN`): a headless Edge left by another session often holds 9333.

   ```sh
   cd apps/desktop && ../../node_modules/electron/dist/Electron.app/Contents/MacOS/Electron . --dev --remote-debugging-port=9461
   ```

   `--dev` reloads the window when `dist/` changes, so edits under `src/` and `packages/*/src` show on their own (a package
   change takes about 20 seconds: tokens, styles, react rebuild in turn; transient "Could not resolve @area/react" lines
   during that rebuild are normal).
5. Drive it with [scripts/cdp.mjs](scripts/cdp.mjs) (`CDP_PORT=9461 node scripts/cdp.mjs move 96 20 -- wait 700 --
   eval "<js>" -- shot out.png`). Screenshots are CSS-pixel scale by default. The owner's data is real: open dialogs and
   cancel them, never create, rename, delete or publish their systems and projects, and don't change their theme or
   settings beyond UI state (panels, tabs, light / dark, which you put back).

An occluded window (behind other apps) reports `document.hidden` and runs no frames: ResizeObservers, `requestAnimationFrame`
and transitions stop, so a fitted screen shows at 1:1 and a scale reads stale. The driver calls `Page.bringToFront` first;
if `document.hidden` is still true, say so and re-measure after forcing a frame (a screenshot) rather than reporting a bug.

What CDP cannot reach: the OS (window drag regions, traffic lights, ⌘Tab). `Page.bringToFront` focuses the page without
making Electron the active app, so `document.hasFocus()` can read true while another app is frontmost and an app switch
never blurs it. For a real switch, make it the active app first, then move away and back:

```sh
osascript -e 'tell application id "com.github.Electron" to activate'   # then focus a control with Tab (a hover won't hold, below)
osascript -e 'tell application "Finder" to activate'                   # the window blurs: its tooltip must close
osascript -e 'tell application id "com.github.Electron" to activate'   # focus returns to the control with no tooltip
```

While Electron is frontmost the real pointer's moves reach the page and close a tooltip a CDP hover opened, so test
tooltips across a switch from keyboard focus. Real pointer moves (a CGEvent from a script) need Accessibility permission
for the terminal, which only the owner can grant; without it, test the drag strip's code path (pointer moves off the
trigger) over CDP and report the OS part as unverified. Don't switch apps while the owner is using the Mac.

## 2. The sweep

Walk every place from its own nav, not by setting `location.hash` (hash changes after the first may not route; clicking
also tests the nav). For each, at the window's opening size (the screen's work area) and 1440 × 900 with both panels, then each panel hidden (⌘B, ⌥⌘B), then 960 (the window's
minimum), in light and dark:

| Place | Look for |
|---|---|
| Home | screen tiles fill (16:9), double-click opens, New project / New system dialogs open and cancel |
| A system: Themes (Screen, Close-up, Themes), Colors, Typography, Icons, Components (Overview, a family, its tabs), Patterns, History | the bar (start, end, wrap), cards scale, Inspector rows don't clip |
| Inspiration (groups, a group, an image) | the trail and the viewer's buttons |
| Settings (⌘,): General, Appearance, Theme | Back and Esc close it, rows align |
| Search (⌘K), New tab (+) | no duplicate rows, Esc closes, Enter opens |
| Tabs, Back / Forward (⌘[ ⌘]) | close reveal, the tab under the pointer after a close, disabled ends |
| Inspector views: Theme, Design, Code, Chat | each view opens at its top, labels whole |

Find clipped text in one pass rather than by eye:

```js
[...document.querySelectorAll('.studio-inspector [data-setting]')].flatMap(row => [...row.querySelectorAll('label, [class*=label]')]
  .filter(l => l.scrollWidth > l.clientWidth + 1).map(l => `${row.dataset.setting}: ${l.textContent.trim()}`))
```

## 3. The patterns

### Responsive Canvas
- **The feed fills the Canvas at every width**; there is no centred measure. Cards are counted from the body's width
  (`--_card-min`, at most four across) and grow past four. Prose keeps its own reading measure (80ch).
- **Specimens scale with their card** at Auto (`gallery/fit.ts`: 0.7 at a 277 card, AUTO_VIEW, up to 1:1). Fit and the
  exact zooms are their own. Test: hide both panels and read each tile's `.gallery-tile__stage` `style.scale`; it should rise.
- **A product screen's tile is the screen's shape** (`Tile stage="screen"`, 16:9, filled). A square with a screen in its
  middle is the defect this replaced.
- **The Canvas bar never runs under the Inspector.** The start (path, lead menus) takes the room the controls leave
  (`flex: 1 1 0%`, down to its `min-content`: menus whole, a path's first step, 120); then the end's groups wrap onto rows
  of their own, at the end, 4 apart. One row is unchanged. Test at 960 with both panels.

### Header and bar controls
- Icon buttons in chrome are `ChromeButton`: ghost, neutral, small, an Area Tooltip with its shortcut as `Kbd`,
  `aria-keyshortcuts`, toggles with `aria-pressed` and outline → filled. Never a bare icon `Button` in a header or bar.
- Plates in a group are 4 apart; drawn things in a bar 12 apart; the bar's ends measured to the plates (7 at type 13).
- A control that does not apply is left out, the order of the rest never changes (rule 16).

### Tooltips (Overlays.tsx, AnchoredTooltip)
- **Never outlive what they name.** While open, a pointer move off the trigger and tooltip, the pointer leaving the
  window, the window's blur and a hidden page close it. Pointerleave alone misses a trigger that moves or is disabled under
  a still pointer and a pointer crossing an Electron drag region.
- **A name-only tooltip lets the pointer through** (`describes={false}` → `data-passthrough`), so it can't sit over the
  next control and catch the click meant for it; a describing tooltip stays hoverable.
- **No tooltip on a returning focus** (window refocus after ⌘Tab) or over an open menu (`aria-expanded="true"`).
- Test sequence: hover a header icon 700ms (opens), slide to its neighbour (opens at once: the skip window), move into the
  header's empty strip (closes), hover again and move straight down over the bar (closes; the next control is hoverable),
  open a menu from a trigger with a tooltip, move away and back (no tooltip), Esc (menu closes, focus returns, no tooltip).

### Breadcrumbs in the bar
- One `Breadcrumb nowrap` with `studio-canvas__crumbs` and `appScale()`, inside `studio-canvas__lead`, everywhere a path
  shows (Components, Inspiration). A path that opens the bar starts on the feed's margin (16), over the first title; its
  clip leaves room for the links' plates and focus rings (6 + ring); after a button the plates stand 4 apart.

### Inspector rows
- The label column holds the name alone, plus an inactive row's info Toggletip. A changed row's Reset sits **before its
  control**, 4 from it, and the control gives up that width (a bar's slider narrows; its value field keeps one width, so
  the column of numbers lines up). Test: run the clipped-label query above with rows changed; none may clip. Change
  settings only in the browser preview (`desktop-browser`, its own storage), never the owner's working copy in Electron.

### Tiles
- A click (or focus) selects; a double-click opens, on every tile branch (plain, inert, Asset); `openOnClick` tiles open on
  a click outside their specimen's controls. Enter and Space select an inert tile.

### Menus, popovers, dialogs
- Menus open on click, Enter, Space, ↓ (first row or the checked one) and ↑ (last); arrows and typeahead move; a command
  closes, `keepOpen` and checkbox rows don't; Esc and Tab close and return focus to the trigger.

### Tabs, history, search, panels
- A tab hugs its name (120 to 170), its close shows on hover, focus and current; closing moves to a neighbour and the tab
  that slides under the pointer shows no stale tooltip. Back and Forward are the tab's own history and disable at its ends.
- Search lists each place once; New tab opens it in "new" mode. ⌘B and ⌥⌘B toggle the panels, the toggle moving to the
  Canvas header's same side.

## 4. Finish

- Checks for what you touched (docs/DEVELOPMENT.md, "Checks by change"); for components, `node --test
  packages/react/tests/<family>.test.mjs cohesion.test.mjs`, and add a test for each interaction defect you fix.
- Update PRODUCT_UI.md's current-state sections in place and the component spec's behaviour and feedback log.
- Quit your debugging window and relaunch one plain window from the finished worktree (memory: Electron always current).
- Report what you could not drive (OS-level behaviour) as unverified.
