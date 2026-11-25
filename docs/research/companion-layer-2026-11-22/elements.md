# Elements and their containers (2026-11-23)

The owner's notes on the Library sample (2026-11-23):
- "take references from the existing area UI";
- the middle header should not filter by All, Product, Brand and Marketing. Instead: "a header and then a tab row below that where multiple different layers/design items can be opened";
- "components, logos, icons, typography, color, etc should all have their own container style … align/create more consistent patterns … come up with a list of all the different elements there can possibly be";
- "build the actual ui in either electron or just a localhost … build kits that contain all the possible containers";
- "icons and glyphs can have smaller gallery containers but i dont want there to be too many custom sizes/container variations".

Built in the app as two labs, both uncommitted:
- **Labs › Elements** (`#labs/elements`, `apps/desktop/src/pages/elements-lab.tsx`): every kind in its container.
- **Labs › Library** (`#labs/library`, `apps/desktop/src/pages/library-lab.tsx`): the file manager.

The data is `apps/desktop/src/element-kinds.ts`, the drawings and the card are in `element-kit.tsx`, and the shared parts are in `library-parts.tsx`.

Frames from the real window are in `library-app/`.

## One card

Every element sits in one card, which has three parts:
- a frame;
- the name under the frame;
- one fact after the name (a hex, a size, a count, or "Current").

The paint is the existing gallery card's: the 16 corner, the cards' edge and fill, and Stroke 2 with no rest shadow (`CARD_SCOPE`). A kind changes only two things: the card's **size** and what fills its frame (its **contents**).

### Three sizes

| Size | Frame | Kinds |
|---|---|---|
| Cell | 64 square, in a sheet, named on hover (the Icons page's sheet) | Glyph, Icon, Emoji |
| Card | Square, on the feed's card grid | Every other kind |
| Wide | 16:9, on the same columns | Video, Screen, Web page, Template, Flow, Slide, Banner |

Cells are the small gallery container the owner allowed. Wide cards use the card grid's columns, so a row of wide cards lines up with a row of square cards.

### Nine contents

Each is a placement rule the Design card or Asset card already has, so none of them adds a new container.

| Contents | Rule | Placed by |
|---|---|---|
| Paint | The frame is the color, a gradient or a texture's tile, with no margin | Design card, color |
| Part | Live UI at true size, centred in a tenth's margin; held at 50% and cropped | Design card, part |
| Mark | One vector mark, centred | Design card, part or icon |
| Steps | A scale's steps in one row | Design card, part |
| Sample | Words set in the type itself | Design card, part |
| Media | A picture or video covering the frame | Asset card, cover or contain |
| Group | Four members, two by two | Asset card, mosaic |
| Screen | A window, a page or a phone at true size, whole | Design card, screen or phone |
| Page | A document's first lines, on a page sheet | Design card, part (top) |

## Every kind (55, in 11 groups)

| Group | Kinds |
|---|---|
| Color | Color, Color ramp, Palette, Gradient |
| Type | Typeface, Type style, Type ramp, Glyph |
| Foundations | Spacing, Corner, Elevation, Stroke, Motion, Grid, Material |
| Icons and logos | Icon, Icon set, Emoji, Logo, App icon, Texture |
| Imagery | Illustration, Illustration style, Photo, Photography style, 3D render, Video |
| Components | Component, Pattern, Chart |
| Screens | Screen, Phone screen, Web page, Template, Flow, Slide, Email |
| Marketing | Poster, Social post, Banner, Mockup, Print |
| Words | Voice, Copy |
| Files | Guideline, Research, Data, Code, Agent instructions, Brief, Link |
| Folders | System, Project, Campaign, Board |

Each kind also records:
- what it is kept as (tokens, a font, SVG, React and CSS, an image, a video, Markdown, CSV or JSON, code, a folder), which is what an agent edits;
- what its Variants usually are (a logo: Mark, Wordmark, Lockup, On dark, One color).

Files are kinds too. They attach to an element or a folder (the Inspector's Files view), or they stand alone in a folder.

## Sub-elements

Every element holds the same three, in one strip under it. Each is a set of cards in the element's own container.
- **Variants:** the forms it ships in, all current.
- **Alternates:** designs being tried. One can be made current.
- **Versions:** its past, newest first. One can be brought back.

## The Library screen

The Library uses the app's three regions:
- **Sidebar:** the Library's tree, with every folder and the elements inside it, as layers. It replaces the app's nav only in this lab.
- **Canvas:** three rows.
  - A **header**: where you are as a path, then the view's controls (Grid or List for a folder, Visual or Code for an element) and Add.
  - Under it, a **tab row** of what is open (folders and elements, each closable), drawn as the app's open tabs.
  - Then the body:
    - A **folder** shows its folders as cards, then its elements grouped by kind (square cards, then wide cards, then a sheet of cells), then its files.
    - An **element** shows itself large at true size (or its code), then its sub-elements, then its files.
- **Inspector:** three views.
  - **Design:** what it is, plus its properties as the Inspector's own rows (Segmented, dropdown, bar or field), Keep as alternate, and Reset.
  - **Files:** its files.
  - **Chat:** the app's chat.

The app changes this needed, all small:
- Workspace gained a `canvasHead` slot (the header in place of the open tabs).
- The Inspector gained a Files view.
- Tile gained a plain `detail` and a painted `image`.

## Not done

- The data lives in the page and resets on reload.
- Add, Open on a file, and Chat acting on the Library are not wired.
- Only the component, color, type, logo, app icon, grid, material, motion, slide, guideline and screen kinds have properties. The rest say to ask in Chat.
- The brief carries the Library as step 0 (picks l1–l5: one tree, sub-elements under each element, files by kind, Area's own coding tools parked, Inspector Design / Files / Chat).
