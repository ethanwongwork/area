# Treatments: how regions separate and how the nav sits

The same screen can be drawn with rules, tones, a raised layer, separate panels or floating plates. Choose once per
window, before placing components. Evidence and the classification of every reference:
`docs/research/ui-patterns-2026-10-22/region-treatments.md` and `region-treatments-measured.md`.

## 1. Choose the window's model

| Model | Boundaries drawn by | Choose it for | Examples |
|---|---|---|---|
| **Ruled** | 1px rules on one ground | dense tools used all day, where every column of width counts | Cursor's IDE, Figma's expanded UI, Alpaca |
| **Toned** | ground steps, no rules | documents and tools that want quiet chrome | Notion, Area's app (Sidebar on the chrome ground) |
| **Layered** | the content raised as one rounded panel on the chrome ground | content-first apps: chat, documents, mail, builders | ChatGPT desktop, shadcn `inset`, Catalyst, Linear, Nora, Schema builder, Groq |
| **Panels** | every working region its own rounded panel, gutters between | two or three equal working regions | Spotify, JetBrains Islands, reui mail |
| **Floating** | plates over full-bleed content | canvas-first and media-first screens; chrome only | Figma's islands and toolbar, Apple's glass bars |

**Layered, measured** (shadcn `inset`, Catalyst, Linear, ChatGPT desktop): the layer is inset on its three free sides
(4–8) and touches the nav's side; its corner is 8–14 against row corners of 6–8; its edge is faint (a 5% ring, or a
`0 1 2`–`0 1 3` shadow, or a 0.5px ring and `0 4 16` 5%); a header inside it is 44–48 or absent; the nav sits unfilled on
the ground. On a phone the layer goes flat.

A window may combine a model with floating chrome (Figma: ruled panels plus a floating toolbar), but never two
models for boundaries of the same rank.

## 2. Place the nav

| Placement | Fits | Area |
|---|---|---|
| On the chrome ground, no panel | layered and panels models | `Nav` straight on the ground; its plates declared for that ground |
| Its own docked panel | ruled and toned models | `Panel` holding `Nav` / `TreeView` |
| Inside the content layer | layered, when the nav is the content's index (ChatGPT) | the layer's leading part, split by a hairline; takes the layer's start corners |
| Its own floating card | floating model, small windows of a canvas tool | `Surface` (raised) or `Titlebar floating` |
| Top tabs | a few modes of the whole app | `Nav orientation="horizontal"` in the Titlebar, or `Tabs` |
| Floating toolbar | a canvas's tools; a phone's tab bar | `Toolbar` on a raised plate, centred, 12 from the edge |
| Icon rail | a collapsed nav, or app-level places beside a panel | ghost icon `Button`s in a column, each in a `Tooltip` |

## 3. Mark the current item

| Mark | When | Area |
|---|---|---|
| Inset backplate | the default for nav rows and lists | `Nav`, `TreeView`, `ListBox` row plates (`radius-row`) |
| Pill | the Pill radius setting, or a pill set (chips, view tabs) | the same plates, rounded by the setting |
| Underline | tabs over a view's content | `Tabs` |
| Indicator bar | a long list of text links (contents); a nav that keeps hover and current apart (Catalyst: a 2 × 20 bar at the edge, hover a 5% plate) | `TableOfContents`; not yet a Nav option |
| Raised chip | a nav on a tinted ground whose current row should read as a piece of the content (reui) | not yet a Nav option |
| Inverted plate | filter chips where the chosen one must dominate | `Chip` selected |
| Full-bleed row | dense trees only | not offered; Area's rows are inset |

Groups in a nav: space and a muted label by default; rules only between groups of a different kind (places vs
account); tree lines only for nesting.

## Rules

1. **One edge per boundary.** A layer's edge needs no rule beside it; a rule needs no tone step under it.
2. **Raised is one step.** A layer or panel is one ground step from what it sits on, with Area's edge and resting
   shadow from the Stroke and Elevation settings. Check it in dark: the step must still read at Layers 0.
3. **Insets and gutters are the smallest structural step** (measured 4–12; 8 is the common value): the ground reads as a frame, not content.
   Take it from the spacing ramp and keep it even on every free side; none against a region on the ground.
4. **Corners are concentric.** A layer's corner is the window's corner less its inset when the window is rounded; a
   control set in a layer's corner follows the layer (Surface's corner chain does this).
5. **Headers inside a layer or panel carry no rule**; a header above the layer is chrome on the ground.
6. **A region's plates are made for its ground.** A tinted nav panel takes a backplate one step darker; a nav on the
   ground takes a translucent plate (4–5%), an edge bar or a raised chip. In Area, nav on the chrome ground uses the
   recessed ground's plates and nav in a layer the surface's (declared grounds, `packages/styles/src/layers.css`).
7. **Flatten on phones.** Under about 768 the layer and panels drop their insets and corners, the nav becomes a
   `Drawer`; floating toolbars stay.
8. **Treatments are not per-component.** Never give a Card or Panel a different edge to make a region read; change the
   window's model.

## Open

Whether the model is a setting (chosen once for a whole design system, like Layers and Elevation) or a composition
choice per product is the owner's decision (`region-treatments.md` › In Area, which records a recommendation for a
setting with a per-screen override). Until the owner decides, a screen states its model in its own notes.
