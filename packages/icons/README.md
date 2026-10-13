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
| `@area/icons/meta`, `@area/icons/icons.json` | Name, component names, category, keyline, fill, status, batch, turns, aliases, `rtl`, search `keywords` and the same icon's `names` in Lucide, Phosphor, Fluent and Material |
| `@area/icons/svg/<16\|20\|24>/<name>[-filled].svg` | Raw SVGs at the size curve's masters, line 1.125px at 16 |
| `@area/icons/sprite.svg` | 16px symbols `area-<name>` and `area-<name>-filled` |
| `@area/icons/rtl.css` | The right-to-left mirroring rule, for use without `@area/styles` |

Components take every SVG prop; props passed through win. The sources (`src/generated`) are generated from
`apps/docs/assets/area-icons-pilot` by `apps/docs/scripts/gen-pilot-icons.mjs` and are not committed:
`npm run build -w @area/icons` regenerates them, compiles, then renders the SVGs, sprite and `icons.json`.
`npm test -w @area/icons` checks the split by status and that every component draws exactly what the docs draw.
