# @area/icons

Area's own icons as React components, raw SVGs, a sprite and metadata. Every icon is a stroked drawing on a 16px
grid with an outline and a filled variant; the construction rules are in `docs/specs/icons.md`.

```tsx
import { SearchIcon, SearchFilledIcon } from "@area/icons";
import { DocumentIcon } from "@area/icons/review";      // drawn, still in the owner's review
import { BellIcon } from "@area/icons/icons/bell";      // one module, any status

<SearchIcon />                 // 16px, line from --area-weight-icon
<SearchIcon size={24} />       // the line follows the size curve (1.125 → 1.5px at 24)
<SearchIcon weight={1.25} />   // a fixed line in CSS px at 16
<SearchIcon title="Search" />  // named: role="img" and aria-label (also aria-label / aria-labelledby)
<ReplyIcon mirrored />         // flip it; mirrored={false} never flips
```

Icons are decorative (`aria-hidden`) unless named. Give an icon a name only when it means something on its own,
as in an icon-only button without its own label. Icons tied to reading direction (reply, undo, indent …, `rtl:
"mirror"` in the metadata) mirror in right-to-left text with one CSS rule, in `@area/styles` or
`import "@area/icons/rtl.css"`; it reads `:dir(rtl)`, so there is no provider and the server renders the same markup.

| Entry | What |
| --- | --- |
| `@area/icons` | Approved icons: `<Name>Icon` and `<Name>FilledIcon`, `IconProps` |
| `@area/icons/review` | Icons still in review (they move to the main entry when approved) |
| `@area/icons/icons/<name>` | One icon's module |
| `@area/icons/meta` | `icons` (below), `categories` in their curated order, review `batches` |
| `@area/icons/meta`, `@area/icons/icons.json` | Each icon's name, component names, category, keyline, fill, status, batch, turns, aliases, `rtl`, search `keywords` and the same icon's `names` in Lucide, Phosphor, Fluent and Material |
| `@area/icons/svg/<12\|16\|20\|24>/<name>[-filled].svg` | Raw SVGs at 12 (the 12px cut where an icon has one) and the size curve's masters, line 1.125px at 16 |
| `@area/icons/sprite.svg` | 16px symbols `area-<name>` and `area-<name>-filled` |
| `@area/icons/rtl.css` | The right-to-left mirroring rule, for use without `@area/styles` |

Components take every SVG prop; props passed through win.

`size={12}` with the token line is the xs icon slot (`--area-icon-xs`: 12px below type 16, 16px at 16). An icon with
a 12px cut (`cuts: [12]` in the metadata) carries both drawings there and shows the cut only where the slot is 12;
with a numeric `weight` it draws the cut alone.

## Versions, deprecation and credits

The package follows semantic versioning; `CHANGELOG.md` lists every release.

- **Major:** an icon or export removed or renamed (after its deprecation), a prop or metadata field changed
  incompatibly, an approved icon moved back to `@area/icons/review`.
- **Minor:** icons added or approved into the main entry, new cuts, props, entries or metadata fields.
- **Patch:** a drawing refined without changing its meaning, keyline or box (optical fixes, review redraws), metadata
  corrections (keywords, names).
- **Before 1.0** any minor may break, as semver allows for 0.x; reopened icons still move to `review`. 1.0 freezes the
  main entry: from then an approved icon is redrawn in place and never leaves it.
- **Deprecation:** a renamed icon keeps its old name for at least one minor release as an alias of the new drawing,
  marked `@deprecated` in its JSDoc and `deprecated: { by, since }` in the metadata, and is removed in the next major.
  (No icon has been renamed since versioning began; the alias machinery, `data-alias-of`, is in place.)
- **Credits:** Area's drawings are its own, except where a drawing reproduces another library's ink: those carry
  `source` in the metadata and their licence is in `THIRD_PARTY_NOTICES.md` (today Fluent's globe, in globe and
  globe-off). The licence for Area's own drawings is the owner's to choose and not yet set.

## Working on the icons

| Folder | What |
| --- | --- |
| `sources/` | The drawings (stroked 16px SVGs), `batches.json` (owner status), `keywords*.json`, `rtl.json`, `status/` (presence marks), `explore/` (candidates) |
| `src/categories.ts` | The categories, in order; every icon in exactly one |
| `scripts/` | `generate.mjs` (lint and generate), `find`, `geometry`, `batch`, `sheet`, `refs`, `keywords` (root `npm run icons:*`) |

The process is the `area-icon-construction` skill. The sources (`src/generated`) are generated from `sources/` by
`scripts/generate.mjs` and are not committed:
`npm run build -w @area/icons` regenerates them, compiles, then renders the SVGs, sprite and `icons.json`.
`npm test -w @area/icons` checks the split by status and that every component draws exactly what the docs draw.
