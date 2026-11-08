# Settings: three products measured (2026-11-07)

The owner (2026-11-07): "move dark mode to the settings control, analyze cursor, chatgpt, and claudes settings controls
and panel and actual settings/pages. i want the app to have full fidelity and useability. please research the real code."

Sources, all read-only:

- **ChatGPT** web (chatgpt.com/settings), computed styles read in the owner's Chrome. Light only: switching its theme
  would change the owner's settings.
- **Claude** web (claude.ai, Settings dialog), computed styles in the owner's Chrome. Light only, as above.
- **Cursor** 3.x Agents window settings, read from the app bundle
  (`/Applications/Cursor.app/Contents/Resources/app/out/vs/workbench/workbench.glass.main.js`, its embedded `@anysphere/ui`
  stylesheet and `workbench.glass.main.css`). Class names are hashed (`glass-*`, `ui-*`); values below are resolved.
- **Claude desktop**'s settings registry, read from `Resources/ion-dist.asar` (control kinds and option lists only).

## What each one is

| | Cursor | ChatGPT | Claude |
|---|---|---|---|
| Opens as | a takeover: the window's sidebar becomes the settings list, the main area the section | a page of its own (`/settings/<section>`) | a dialog over the app (1024 × 734, radius 12) |
| Opened by | ⌘, (toggles), the gear at the sidebar's foot (pressed while open) | the profile menu's Settings | the profile at the sidebar's foot, ⌘, |
| Closed by | Back row, Esc (clears the search first), ⌘, again, ⌘W | Back to app | ×, Esc |
| Sections | General, Appearance, Plan & Usage, Agents, Cloud Agents ↗, Models, Voice, Source Control, Browser & Network, Code Intelligence, Beta, Docs ↗ | 20: General, Appearance, Notifications, Profile ↗, Security, Account, … Keyboard, Usage, Billing, Data controls | Account, Billing, Usage · Appearance, Your Claude, Capabilities, Notifications, Privacy, Wellbeing · Customize, Code · Desktop app |
| One section shows | yes, its own scroll | yes | yes |
| Light / dark | Appearance › Theme (a dropdown: System, light and dark themes) and Follow System Color Scheme | Appearance › Mode: three 80 × 60 pictures at the row's end, the chosen one ringed 2 px in the accent | Appearance › Theme: an icon switch, System / Light / Dark, 80 × 28 |
| A light / dark button in the window | no | no | no |

None of the three keeps light and dark in the window's chrome: it is an Appearance setting. Area's Canvas header button is
gone (owner, 2026-11-07); Mode is Settings › Appearance's, and the Theme section's preview carries the same three-way
switch, since Theme edits the mode the app is in.

## Search

| | Cursor | ChatGPT | Claude |
|---|---|---|---|
| Field | 28 high, radius 6, 1 px 12 % stroke, 3 % fill, placeholder "Search Settings" | 36 high, pill, 5 % fill, no stroke | in the dialog's nav (not measured) |
| Results | **replace the nav list**: one row per setting, the section's icon and the setting's name, at most 12 | **replace the nav list**: the setting's name, its section under it in the muted ink, the section's icon | — |
| Matches | name (strongest), aliases, its children's keywords, description (weakest) | name and description | — |
| Choosing one | opens its section, scrolls to the setting and highlights it for 3 s; ↑ ↓ and Enter work | opens its section | — |

Area's search filtered the Canvas into "Results for …" groups, which hid where a setting lives. Area now does what Cursor
and ChatGPT do: the results take the Sidebar's list (a setting's name over its section, the section's icon), the Canvas
keeps the section, and choosing one opens its section, scrolls to the row and marks it for 3 s.

## The page

| | Cursor | ChatGPT | Claude | Area (type 13, Compact) |
|---|---|---|---|---|
| Column | 680 max, centred, 48 top | 768, centred | 780 (the dialog's right side) | the reading column, centred |
| Title | 17/21 500 | 24/29 400 | 22/28 520 | `title-sm` 18/24 500 |
| Group label | 12/16 400 muted, 8 over its card | 16/24 500 | 15/20 520 | `SectionHeading` (title, lede on the first) |
| Groups apart | 28 | 24–32 | 36 | 32 |
| Card | 4 % tint, radius 12, no stroke | page fill, radius 16, 1 px 10 % stroke | none: rows with a 5 % rule above | the feed's frame (stripe fill, card stroke, tile radius) |
| Row padding | 12 all round | 12 / 16 | 12 / 0 | frame inset − 4 / frame inset (42 one line) |
| Name | 13/18 400 | 14/20 500 | 14/20 400 | `text-base` default ink |
| Description | 13/18 secondary, 1 under | 12/16 muted, 2 under | 14/20 60 % | `text-base` muted, joined |
| Rule between rows | 1 px 4 %, inset 12 | 1 px 10 %, inset 16 | 1 px 5 %, full width | decorative border, inset by the frame |
| Text → control | 20 | 24 | 28 | 16 |
| Control column | ≤ 160, end-aligned | its own width | its own width (selects 224) | one column, about 280, fills |
| Control's alignment | centred on the text block | centred | centred | centred |

Area's layout already follows Cursor's (it was built from it, 2026-10-30); its sizes are Area's own scale, as everything
in the app. No change.

## Controls

| | Cursor | ChatGPT | Claude | Area |
|---|---|---|---|---|
| Switch | 32 × 20, thumb 16, on green (#007041 / #3FA266), off 14 % | 32 × 20, thumb 16, on blue | 36 × 20, thumb 16, on blue (#257DE0), off 20 % | Switch |
| Dropdown | 28, radius 6, 1 px stroke, chevron 10 | 36 pill, 5 % fill | text and chevron only | Select / CustomSelect, soft |
| Button | outline 24, radius 6 | soft pill 36; destructive in a red tint | — | Button soft |
| Three-way choice | — | pictures | icon switch: track 5 %, 1 px in, radius 8; thumb white 26, radius 7, 1 px 5 % ring | Segmented (`iconOnly` for the icon switch), Radio preview cards for pictures |

## What changed in Area

1. **Light and dark** left the Canvas header (all three keep it in Settings). Settings › Appearance › Mode is the place;
   the Theme section's preview has the same three-way icon switch (Claude's) beside its screen picker, since Theme edits
   the mode the app is in.
2. **⌘,** and the gear toggle Settings (Cursor's: the gear is pressed while open and says "Close settings"); the app
   menu's accelerator and the window's key handler share one toggle, so one press never opens and closes it.
3. **Esc** in the search field clears it first, then a second Esc closes Settings (Cursor's).
4. **Search** results replace the Sidebar's list (Cursor, ChatGPT); ↑ ↓ move, Enter or a click opens the section, scrolls
   to the setting and marks it for 3 s (Cursor).
5. **Sections that work**, after the three products' own (General, Appearance, Agents / Code, Keyboard):
   - **Chat**: the default model for new chats (Cursor's Models, Claude's model menu), whether replies are live, and how
     to sign in.
   - **Keyboard**: every shortcut the app answers, as ChatGPT's Keyboard lists them.

Not taken: Claude's dialog (Area's Settings is a takeover, as Cursor's, owner 2026-10-30), ChatGPT's 36 pill controls
(Area's controls follow its own scale), Cursor's green switch (Area's Switch takes the system's selected color).

Not built: an About section (the app's version is 0.0.0 in development; nothing to show yet), Notifications (the live
agent has no completion notice yet), ChatGPT's dark measurements (would need its theme switched).

## Appearance, second pass (2026-11-07)

The owner sent Cursor's Appearance page (two screenshots) and asked to "build and implement some of the cursor settings
for appearance if they are helpful/necessary". Each of its groups, against what Area's tokens and app already do:

| Cursor | Area | Why |
|---|---|---|
| Theme (System, light, dark, high contrast themes) | Mode (pictures) | had it |
| Agent Conversations: Tool Call Density, Chat Width, Code Block Word Wrap, Themed Diff Backgrounds | not built | Area's chat sits in the Inspector, as wide as the panel; its trackers and code blocks have one form each |
| Colors: Hue, Intensity | Its own look's Tint hue and Grey tint (and every Theme setting) | had it, as a look of the app's own |
| Colors: Reduce Transparency | **Reduce transparency**: the Material's transparency and frost levers at 0, as `prefers-reduced-transparency` resolves (material.css) | built |
| Typography: UI Font Size (stepper, 13) | **Text size**: a split-stepper NumberField, 12–16, over the followed system's Type (the app's geometry follows it, as every Type does) | built |
| Typography: Code Font Size, UI and Code Font Family, Font Smoothing | not built | Area's typefaces are a system's (Typography); no code editor; Area draws antialiased (reset.css) |
| High Contrast: Follow System High Contrast (on) | **Follow your Mac's contrast** (on): while the Mac asks for more contrast it wins over a theme's own Contrast; off keeps the theme's | built |
| Motion: Reduce Motion (System) | **Reduce motion** (off follows the Mac): motion 0 and press feedback off, as `prefers-reduced-motion` resolves | built; Area never animates against the Mac's Reduce motion, so there is no "always animate" |
| Fun, Privacy | not built | no confetti; the app shows no email |

They are grouped as Text and Accessibility under Mode and Panels, rows with a Switch at the end (Cursor's). Each is an
override in `appLook` (src/app-look.ts `withOverrides`, src/studio.tsx for contrast and transparency, which read the
Mac and the Material), unset at its default, and tested in `tests/app-look.test.ts`.

Mode's pictures in the same pass: the app in a 720 × 540 window (sidebar and page) with its words as bars, chosen from
four layouts and three drawings on review sheets; the name under each picture at the start (Radio `layout="thumbnail"`,
docs/specs/radio.md, review note 2026-11-07).
