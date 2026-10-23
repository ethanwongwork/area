# How products compose whole UIs, 2026-10-22

The owner asked for research into how the products Area follows build their UIs — spacing, gaps, margins, feeds,
layouts, headers, side panels, nav panels, floating layers and layer containers, footers, titles and copy, image and
video placement, card feeds, carousels, grids — so that skills can direct how Area's components are composed into
whole screens. The skills are `.claude/skills/area-ui-compose` (build) and `.claude/skills/area-ui-review` (check).

## Files

| File | Products | How it was read |
|---|---|---|
| [chatgpt-desktop.md](chatgpt-desktop.md) | ChatGPT desktop 26.1013 (Electron, shared with Codex); chatgpt.com for comparison | app bundle (B); chatgpt.com logged out in headless Edge (M). The installed app was running, so it was not read live |
| [cursor-figma.md](cursor-figma.md) | Cursor 3.24 (IDE, Agents window); Figma desktop shell, UI3 editor, Community | bundles (B); a public Figma file and Community logged out (M); Figma's UI3 blog (D) |
| [notion.md](notion.md) | Notion pages, databases, peeks; notion.com templates, product, help centre | public notion.site pages and notion.com logged out (M); earlier captures (C) |
| [consumer-feeds.md](consumer-feeds.md) | Spotify, Airbnb, Nike, YouTube, App Store and Apple TV web | Spotify's bundle CSS (B); live sites logged out (M) |
| [design-systems.md](design-systems.md) | Material 3, Apple HIG, Fluent 2, Carbon, Primer, Polaris, Atlassian, Untitled UI, shadcn, Radix, Mantine, Geist, Tailwind | docs (D) and source at pinned commits (S) |
| [region-treatments.md](region-treatments.md) | How regions separate (space, rule, tone, material, layer, frame, panels, float), where the nav sits, how the current item is marked; the owner's seven references classified; rules for combining | synthesis of this folder (M, B, S) and the owner's references read by eye for method only (R) |
| [region-treatments-measured.md](region-treatments-measured.md) | shadcn sidebar variants, Catalyst, Linear's site mockup, reui, Untitled UI, Mantine app shells | live, logged out, clean Edge profile (M) |

Every value cites its source in its own file. No product code, styles or assets were copied.

## Where the products agree

1. **Spacing grows outward**, about doubling at each ring: inside a control 2–8, between related items 4–8, between
   members of a group 8–16, between sections 24–48 in apps and 64–96 on sites, page margins 16–32. Atlassian's bands
   (0–8, 12–24, 32–80) say the same.
2. **A few fixed chrome heights per window**, all bars sharing one: ChatGPT 44 / 46 / 40, Figma 48 everywhere, Cursor
   35 / 22, Notion 44, systems 48–64.
3. **Panels have a default, a floor and a ceiling.** Nav 240–340 (min 214–240, max 443–520); inspectors 240 (241–500);
   detail panels 320–600 with the content keeping about 350 beside them.
4. **Bars carry no rule at rest** (ChatGPT, Notion); a rule or a 16 fade appears once content scrolls under them.
5. **One reading measure, about 700–770** (Notion 708, ChatGPT 768), and one structured measure, 1120–1296 (Area's Canvas 1236).
6. **Grids from a minimum width**, counted on the container: auto-fill `minmax`, or JS from a min and max (YouTube).
7. **Media keeps a few ratios per context:** 16:9 for video and files, 1:1 for music, products and specimens, 4:3 for
   listings; the frame carries the corner; a 1px ring drawn as a shadow keeps the image's size (Figma).
8. **Text under media:** title one step up, meta one step down in muted ink, 8–12 below the image, titles clamped to
   two lines.
9. **Shelves show that they continue** (a peek) on touch, and page by a fixed count with arrows in the header on a
   pointer device; carousels replace grids only where a grid won't fit (Notion).
10. **Floating layers keep a fixed offset** (4 from a trigger, 12 from a window corner) and a corner concentric with
    their rows (ChatGPT 16 − 4 = 12; Figma 5 + 8 = 13).
11. **Sentence case**, hierarchy from size and ink, weights 400–600; uppercase only for tiny eyebrows.

## Where they disagree

- **Docked or layered.** Cursor and Figma's full UI dock square regions with one rule (Figma reattached its panels
  after UI3's beta for speed and canvas room). ChatGPT desktop puts the nav panel and content in one raised layer, 4
  off the window, on a translucent ground; Spotify makes every region a radius-8 panel 8 apart on black; Figma's
  minimized UI floats islands 12 off the edges.
- **Which ground is deeper in dark.** ChatGPT's layer is lighter than its ground in light and darker in dark; Notion
  and Area keep raised surfaces lighter in dark.
- **Shelf item width:** a count per view (Airbnb, App Store, Nike) or a fixed width with a peek (Spotify, phones).
- **Arrows:** in the header row (Airbnb, Nike), over the ends on hover (Spotify, App Store, ChatGPT), or none (Notion,
  Material, touch).
- **Breakpoints:** no two systems match; 768 is the most common change point for the nav panel.

## Not measured

Live geometry of the ChatGPT desktop app (it was running), Figma's signed-in file browser and properties panel, Notion's
logged-in sidebar and slash menu, Spotify's panel limits and "Show all" grid variables (set in JS), hover paint on
consumer cards, and dark mode where a product has none. Each file lists its own gaps.

## A note on the Edge profiles

Headless Edge on this machine signs a fresh profile into the owner's Microsoft account and syncs their extensions,
even with sync and extensions disabled. The researchers discarded or re-measured everything taken in those profiles;
the clean recipe is in the session memory (`--disable-features=msImplicitSignin`). Signed-in profiles remain in the
session scratchpad until the owner removes them.
