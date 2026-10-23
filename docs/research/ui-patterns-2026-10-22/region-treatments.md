# Region treatments: how UIs separate regions and treat navigation, 2026-10-22

The owner asked how products differ in building the same screen: "some products use container layers, some use
dividers, some just use different colors, some navs are floating toolbars, other navs have a backplate section". This
file names the treatments, classifies every product measured in this folder and the owner's seven references by them,
and draws the rules for combining them. Measured values for more app shells are in
[region-treatments-measured.md](region-treatments-measured.md).

Tags: **M / B / S** measured, as in the other files of this folder (the value is in the cited file); **R** the owner's
reference images of 2026-10-22 (shared in chat, not committed), read by eye for the method only, never for lengths.

## The vocabulary

### How two regions are told apart

| Method | What draws the boundary | Seen in |
|---|---|---|
| **Space** | nothing but distance; both regions on one ground | Notion's top bar over the page (M), Figma Community sections (M), Catalyst's content (no header bar) (M) |
| **Rule** | a 1px line on one ground | Cursor's IDE, Figma's expanded panels, chatgpt.com's sidebar, Untitled UI, Mantine (M); Alpaca (R) |
| **Tone** | a ground step: the regions are filled differently, no line | Notion's sidebar, Area's Sidebar on the chrome ground (M); Groq's sidebar (R). shadcn's docked sidebar uses tone **and** a rule (M) |
| **Material** | a translucent region (vibrancy, glass) against an opaque one | ChatGPT desktop's ground (B); Codex's sidebar (R); Apple's Liquid Glass sidebars (D) |
| **Layer** | one region raised as a rounded panel on the other's ground, held off the window edges, with an edge or a shadow | ChatGPT desktop `PageSurfaceLayout` (B), shadcn `inset`, Catalyst, Linear (M); Nora, Schema builder, Groq (R) |
| **Frame** | a tinted plate around a panel, the panel inset a few px inside it, header on the tint | reui's frame block: plate radius 14, padding 3, panel radius 10 = 14 − 3 − 1 (M) |
| **Panels** | every region its own rounded panel, gutters between them, on a ground that shows through | Spotify (B, M); reui mail, JetBrains Islands (R) |
| **Float** | plates over content that runs edge to edge beneath them | Figma's islands and toolbar, shadcn `floating`, Untitled's floating sidebar and slim rail, reui app-shell-2 (M); Apple's toolbars and tab bars (D) |

A layer and panels differ in how many regions are raised: a layer raises the content (sometimes with the nav inside
it, as ChatGPT desktop does) and leaves the rest on the ground; panels raise every region.

### Where the navigation sits

| Placement | Seen in |
|---|---|
| **On the ground**, no panel of its own: the content's treatment draws the boundary | Nora, Groq, reui mail, Schema builder's chat (R); shadcn `inset` (S) |
| **Its own docked panel**, full height, by tone or rule | Notion, Cursor, Figma, Area's app (M); Alpaca (R) |
| **Inside the content layer**, sharing its corners, split from the content by a hairline | ChatGPT desktop (B) |
| **Its own floating card** | shadcn `floating` (S), Apple's sidebars (D) |
| **A top bar of tabs** | Alpaca's Chat / Agent / Code / Design (R); Figma Community, YouTube's chips (M) |
| **A floating toolbar** | Figma's bottom toolbar (M); Apple's iPhone tab bar (D) |
| **An icon rail** beside or instead of the panel | Cursor 48, Figma 56, YouTube 72 (M); reui's end rail (R); shadcn icon mode 48 (S) |

### How the current item is marked

| Treatment | Seen in |
|---|---|
| **Inset backplate**: a rounded plate inset from the panel's edge | ChatGPT, Notion, Figma, Area, shadcn (inset 8, radius 8, weight 500), Untitled (radius 6), Linear (4% white, radius 8, weight unchanged) (M); Nora, Groq, reui (R) |
| **Pill backplate**: fully round ends | Alpaca's nav and tabs (R); Notion's view tabs (M) |
| **Full-bleed row**: square, edge to edge | VS Code-style lists in Cursor's IDE (B) |
| **Indicator bar** with ink | Notion help's contents, a 2px start bar (M); Catalyst's nav: a 2 × 20 round bar at the window edge, hover a separate 5% plate (M) |
| **Raised chip** | the current row takes the content's fill with a hairline and a soft shadow, on a tinted nav (M, reui app-shell-2; hover changes ink only) |
| **Underline** | Schema builder's tabs (R), Figma resource page tabs (M) |
| **Inverted plate** (dark fill, light ink) | YouTube's chips (M) |
| **Ink or weight only** | muted rows turning default ink; Figma's current page also steps to 550 (M) |

Groups inside a nav are separated by **space and a muted label** (ChatGPT, Groq, Alpaca, Codex), by **rules** (Nora),
or by **tree lines** for nesting (Nora's pages).

## The owner's references

| Reference | Nav ↔ content | Header ↔ content | Nav | Current item | Other |
|---|---|---|---|---|---|
| 1 · Codex desktop | material: a translucent sidebar showing the wallpaper, against opaque white content; no line | space (a muted title, no rule) | docked, translucent | not shown | trailing status text ("In progress", "4h") muted; a blue dot in the icon column marks an active thread; children indented without icons |
| 2 · Nora (a Notion-like workspace) | layer: content a white raised panel with a small inset on a warm grey ground; the nav on the ground | space, inside the layer | on the ground; groups split by rules; pages on tree lines | inset backplate | a second panel at the end (activity) also on the ground, so content is the only raised region; account row and Invite button pinned at the foot |
| 3 · Groq chat | layer with an edge: a white content panel with a 1px border and a rounded leading corner on a pale ground | space, inside the layer | on the ground; space and labels ("Today") | inset backplate with a trailing "…" revealed | model and privacy pickers as soft pills; menus with a tinted destructive row and a submenu |
| 4 · Alpaca agent | rule: one white ground; 1px rules under the title bar, under the tab row and between nav and content | rule | docked on the same ground; a top tab row for modes | pill backplate (nav and tabs alike) | status markers in the icon column (ring, dot); content a bordered list group with inner rules |
| 5 · JetBrains Islands (dark IDE) | panels: editor and chat each a rounded panel with gutters on a darker ground | menus and run controls on the ground, outside the panels | tool-window tabs as pills in the chat panel's head | pill with a close action | inside the chat panel, cards nest (a task list card, the composer card) |
| 6 · reui mail | panels: the list and the reader are separate bordered panels with gutters; the nav is not a panel | toolbars inside each panel, no rule | on the ground; space and labels; counts trailing | inset backplate | an icon rail on the ground at the far end; one empty state per panel |
| 7 · Schema builder | layer with a shadow: the main view a white raised panel; the chat column on the off-white ground | space, inside the layer | the chat column takes the nav's place | underline tabs | the composer is a bordered card; the table separates groups with light rules |

## Measured shells

From [region-treatments-measured.md](region-treatments-measured.md) (M, light / dark):

| Shell | Nav ↔ content | Layer or nav card | Header | Current item |
|---|---|---|---|---|
| shadcn `inset` | layer; the nav unfilled on the ground | inset 8 top, end, bottom, 0 beside the nav; radius 14; no border; `shadow-sm`; layer #fff / #0a0a0a on #fafafa / #171717 (deeper than the ground in dark) | 48, inside the layer, with a rule | backplate |
| shadcn `sidebar` | tone and a rule | nav 256 (rail 48), #fafafa on #fff | — | backplate |
| shadcn `floating` | float | nav card 8 off every side, radius 10, 1px border, `shadow-sm`; content on the page, not raised | — | backplate |
| Catalyst | layer; the nav unfilled on the ground | inset 8 top, end, bottom; radius 8; a 5% ring + `0 1 2` 5%; layer #fff / #18181b on #f4f4f5 / #09090b (lighter than the ground in dark); content padding 40 | none | edge bar |
| Linear (site mockup, dark) | layer | inset 8 on three sides; radius 8; a white 5% border and a 2px black 20% ring; floating side panel inside it 12 from its edge, radius 12 | 44, inside the layer, with a rule | 4% plate, radius 8; rows 28, 2 apart |
| Untitled UI | rule, or a floating nav card | card 4 off the window, radius 12, an inset ring + `0 1 2` 5%; slim rail a 64 card | none on desktop | backplate, radius 6 |
| Mantine AppShell | rules on one fill | header 60, nav 300, aside 300, footer 60 | ruled | — |
| reui frame | frame | plate radius 14, padding 3, panel radius 10 | 50, on the tint | — |

Row geometry across them: 28 (Linear), 32 (shadcn, reui) or 36 (Catalyst, Untitled), inset 8–16 from the nav's edge,
2–4 apart; group labels 12px at 500–700 in muted ink with 16–32 above; rules between groups are rare. On a phone every
layer goes flat and the nav becomes a sheet (shadcn 288 over a 50% scrim) or a dialog card (Catalyst 304, 8 off the
window). Nothing changes at 1024 except Catalyst's and Untitled's switch to the phone layout.

What they share: **one raised or separated thing at a time.** Each reference picks one method for the main boundary
and draws no second edge beside it (no rule next to a layer's edge, no tone step under a rule). The nav, when it is not
a panel, sits on the same ground as the window chrome, and its rows' plates are made for that ground.

## Rules for choosing and combining

1. **One method per boundary, one model per window.** Choose space, rule, tone, material, layer, panels or float for
   the window and use it for every boundary of the same rank. A rule beside a layer's edge, or a tone step under a
   rule, is a second edge (Area: "one edge per boundary", PRODUCT_UI.md).
2. **Match the model to the work.**
   - Rule or tone (docked): tools used all day where width matters most (IDE, inspector editors). Figma returned to it.
   - Layer: content-first apps (chat, documents, mail) where the content should read as the page and the chrome as its
     frame.
   - Panels: several equal working regions (editor and chat, list and reader, library and player).
   - Float: canvas-first and media-first screens, and only for chrome (Apple: never the content layer).
3. **The ground under the nav sets its plates.** A nav on the window ground, in its own panel or inside a layer paints
   its hover and current plates for that ground (Area: declared grounds, `packages/styles/src/layers.css`).
4. **Raised means one step.** A layer or a panel is one ground step from what it sits on, with a faint edge (a 5% ring)
   or a small shadow (`0 1 2`–`0 1 3`), not both heavy. In dark the step must still read; products split on its
   direction: the layer deeper than the ground (ChatGPT, shadcn) or lighter (Catalyst, Linear, Spotify, JetBrains).
5. **Gutters and insets are small and even.** A layer's inset and a panel gutter are the smallest structural step
   (ChatGPT 4, Untitled 4, Spotify, shadcn, Catalyst and Linear 8, Figma islands 12): enough for the ground to read as
   a frame, never as content. A layer is inset on its three free sides and touches the nav's side.
6. **Corners are concentric with the window.** A layer or panel inside a rounded window takes the window's corner less
   its inset; its own controls follow its corner (Figma 5 + 8 = 13).
7. **Headers live where their region lives.** A header inside a layer or panel draws no rule (the layer's top edge is
   enough); a header on the ground above a layer is chrome (ChatGPT's title strip).
8. **The nav's plate depends on its ground.** A tinted nav panel takes a neutral backplate one step darker; a nav on the
   ground takes a translucent plate (4–5%), an edge bar or a raised chip (M, every measured shell).
9. **The current item's mark follows the row's shape.** Inset backplates take the row corner (Area's `radius-row`);
   pills only where the radius setting is Pill or the control is a pill set; full-bleed rows only in dense trees.
10. **Collapse to flat on phones.** Layers and panels drop their insets under about 768 (shadcn) or 1024 (Catalyst, Untitled) and the nav becomes a
   sheet; floating toolbars stay floating.

## In Area

| Treatment | Area today | Missing |
|---|---|---|
| Rule | Titlebar `ruled`, Panel edges, `Separator`, `border-decorative` | — |
| Tone | the chrome's recessed ground (`data-area-chrome`, `bg-subtle`), Layers settings | — |
| Material | none for chrome: Area paints opaque grounds | a translucent chrome ground (the Material setting, `packages/tokens/src/axes/material.ts`, covers surfaces) |
| Layer | `Surface` on the chrome ground, composed by hand | the app-shell layout's `layered` option (COMPONENTS.md candidate) |
| Panels | `Surface`s with a gap, composed by hand | the same app-shell layout, a `panels` option |
| Float | Titlebar `floating`, Toolbar on a raised plate, Elevation settings | — |
| Inset backplate, pill, underline, indicator | Nav, Tree view, Tabs, Segmented (row plates; pills from the Pill set) | an edge-bar current mark (Catalyst) and a raised-chip mark (reui) for Nav; Table of contents has its own bar |

**Open for the owner:** whether region treatment is a **composition choice** made per product (the skills direct it)
or a **setting** like Layers and Elevation, so a design system made with Area chooses rule, tone, layer or panels once
and every screen follows. It meets the settings test (it applies to every shell, not one component) but changes no
component, only how the shell is composed.

Recommendation (2026-10-23, from the session that finished PR #151's open items, passed on at the owner's request; not
decided): make it a setting, chosen once per design system, with a per-screen override. Conditions, so it adds no
bloat:

1. The setting picks only the method. Every value comes from existing settings: tones from Layers, the lift from
   Elevation and Shadow, the line from Stroke. No new colours or shadows.
2. It drives the App-shell layout candidate (COMPONENTS.md): that component's `treatment` prop defaults to the setting,
   so one screen (a full-bleed canvas tool) can override it. Nothing shows until that layout is built.
3. Dark is its own choice, since products split on the layer's direction (deeper: shadcn, ChatGPT; lighter: Catalyst,
   Linear, Spotify): ask it per mode, or take it from Card tone, which is already per mode.

Default: today's shell, the Sidebar on the recessed tone with the Panel's edge as its seam. Native macOS apps would
only refine the material treatment and need Accessibility access only the owner can grant; that session judged them
unnecessary, since Area's targets are web and Electron and the measured shells already agree.
