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
```

| Entry | What |
| --- | --- |
| `@area/icons` | Approved icons: `<Name>Icon` and `<Name>FilledIcon`, `IconProps` |
| `@area/icons/review` | Icons still in review (they move to the main entry when approved) |
| `@area/icons/icons/<name>` | One icon's module |
| `@area/icons/meta`, `@area/icons/icons.json` | Name, component names, category, keyline, fill, status, batch, turns and aliases |
| `@area/icons/svg/<16\|20\|24>/<name>[-filled].svg` | Raw SVGs at the size curve's masters, line 1.125px at 16 |
| `@area/icons/sprite.svg` | 16px symbols `area-<name>` and `area-<name>-filled` |

Components are `aria-hidden` and take every SVG prop. The sources (`src/generated`) are generated from
`apps/docs/assets/area-icons-pilot` by `apps/docs/scripts/gen-pilot-icons.mjs` and are not committed:
`npm run build -w @area/icons` regenerates them, compiles, then renders the SVGs, sprite and `icons.json`.
`npm test -w @area/icons` checks the split by status and that every component draws exactly what the docs draw.
