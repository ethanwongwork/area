# System inventory and structure (2026-11-08)

Owner (2026-11-08, scope review): "more straightforward editing tools for customizing and updating a design system,
components". This is layers 2 and 3 of the customization model (`docs/BRIEF.md`, "Customization model"; "Building a
system", steps 3–4), which the brief calls the core of the product:

- **Inventory:** which component families, variants, sizes, tones and states a system includes, and its defaults
  ("Button with solid, soft and ghost but no outline; three sizes; no danger tone").
- **Structure:** each family's anatomy chosen from real alternatives (Tabs as underline or plate; fields outlined or
  soft; labels above or beside).

Status: research, options and recommendations below; the recommended path is built in this worktree (Build, at the
end). Review page (private, Area's real UI, the built recommendation as each default):
https://claude.ai/artifact/P44jDDPeDvYu8JeB1ixbFY, picks in collection `verdicts`, docs `scope`, `where`, `show`,
`defaults`, `pilots`, `publish`, `projects` (fields `pick`, `note`, `at`). Rebuild it with `node build.mjs <tree> <out>`
beside this file (entry.tsx, page.css) after `npm run build` and the desktop build.

## 1. Research

How products and systems let a team scope and restructure a library. Read from each product's documentation and API
(pinned below), not measured in the products: nothing here is a length, and the editor is composed from Area's own
components at their measured values, so no new geometry comes from these sources. Not opened in the owner's
accounts (target products are read-only, and every place where this happens is a publish flow).

| Source | Scoping (inventory) | Defaults | Structure | Telling consumers |
|---|---|---|---|---|
| Figma libraries | Publish chooses what goes out; a component whose name starts with `.` or `_` is never published; the publish dialog lists each changed item with a checkbox | A component set's default variant is its top-left one | Variant properties (variant, boolean, instance swap with *preferred values*, text) | "Library updates available" in each file; Review lists every changed item with before / after, update one or all; files keep the old version until they accept |
| shadcn/ui | You add only the components you use (`npx shadcn add button`); the registry is per item with dependencies | `defaultVariants` in each file's `cva` call, edited in your copy | `components.json` `style`, and since late 2025 `create`'s styles (whole-library anatomy packages) | None: the code is yours; `diff` shows upstream changes |
| Radix Themes | Everything ships; no scoping | Per-component props only | One look per component; `variant` props (solid, soft, surface, outline, ghost, classic) | Package versions |
| MUI | Everything ships | **`theme.components.MuiX.defaultProps`**: a theme changes a component's default props for the whole tree | `TextField` `variant`: outlined, filled, standard (underlined) — a field structure as a default prop | Package versions |
| Ant Design 5 | Everything ships | `ConfigProvider` `componentSize`, per-component config | **`variant` on every form control and on `ConfigProvider`**: outlined, filled, borderless, underlined — a system-wide field structure | Package versions |
| Panda CSS / Chakra 3 recipes | **`staticCss`** lists which recipe variants are emitted (`button: [{ size: ['sm','md'] }]`), so unused values never ship | Recipe `defaultVariants` | Recipes and slot recipes per family | — |
| Material Theme Builder | Colour only | — | Material's own fixed alternatives (filled and outlined text fields; five button emphases) | Exported tokens |
| Tokens Studio | Token **sets** per theme, each *enabled*, *source* or *disabled* | — | — | Git sync; changes as commits |
| Supernova | Components listed with status and health | — | — | Design system **versions** with a changelog; exporters write code per version |
| Storybook | `tags` (`!dev`, `!autodocs`) hide stories; `argTypes.options` and `controls.include / exclude` narrow a prop's values | `args` | — | — |

What carries over:

1. **Scoping is "left out", not "added".** Every source starts from everything and leaves things out (Figma's hidden
   components, Panda's static list, Storybook's tags). A system that says nothing includes everything.
2. **Defaults belong to the system, not to each use.** MUI's theme default props and Ant's `ConfigProvider` change a
   component's default for a whole tree. That is exactly what a structure choice is in code: the system's Tabs *are*
   underline unless a use asks for plate.
3. **Structure is a default on an anatomy axis.** Ant's field `variant` and MUI's `TextField` `variant` are one prop
   whose values are alternatives for the same role. Choosing the system's structure is choosing that prop's default
   and, usually, leaving the others out.
4. **Named whole-library packages exist (shadcn's styles)**, and Area deliberately doesn't do them (owner, 2026-10-18,
   "no named looks"): each family's structure is its own question.
5. **Consumers update on their own time** (Figma's Review updates; versions everywhere). Leaving something out is the
   breaking kind; adding is not.

### Intake (area-component-intake, area-foundation-change)

| Thing | Kind | Why |
|---|---|---|
| Light / dark, type, density, radius, colour, depth, stroke, motion, material | **Setting** (layer 1) | Every family reads it; continuous; per theme |
| Which families, and which values of a family's axes (variant, tone, size, layout, states) | **Inventory** (layer 2) | A system's own scope; the values are the manifest's, never new ones |
| A family's default value on an axis | **Inventory default** | The manifest's `defaults`, overridden per system |
| An anatomy axis whose values are alternatives for one role (Tabs `selection`, field `variant`, Field `orientation`) | **Structure** (layer 3) | Same data as an inventory default; drawn as rendered alternatives and usually one kept |
| A missing alternative (underlined fields, a dialog's close at the start) | **A value on an existing axis** | Built as a component change through `area-component-build`, never invented here |
| The editor itself | **Composition** of existing components | Switch, Checkbox, Radio `layout="thumbnail"`, Panel sections, Table; no new component |
| Inventory and structure | **Never a named look** | No "Compact pack" or "Minimal library"; each choice stands alone |

So nothing new enters the manifest. A system's inventory is a sparse list of differences from Area's manifests, and
structure is that list's defaults on the axes a registry marks as anatomy.

## 2. Options and recommendations

Each question has options ranked; **the first is the recommendation and is built**.

### Q1. Per system or per theme?

1. **Per system (every theme shares it).** Themes are looks; what the library holds and how a family is built are
   the product's. Two themes with different inventories would be two products. *(Recommended.)*
2. Per theme. Lets a "Marketing" theme drop tones, at the cost of every project wondering which Tabs it has.

### Q2. Where inventory and structure live

1. **The system's Components pages and the Inspector's Design view.** The gallery *is* the inventory: a family's
   Design view gains "In <system>": Included, then each axis's values (a checkbox each, the default marked), and for a
   pilot family a Structure section of rendered alternatives (Radio `layout="thumbnail"`, the real component in each
   card). The List view becomes the inventory table: every family, Included, and what is left out. You edit where you
   look; nothing new to learn. *(Recommended.)*
2. A separate Inventory page under Components (one large table of families × axes). Fast for scanning, but it
   separates the choice from the picture of it.
3. Setup's questions (Building a system, steps 3–4). Right for a new system's first pass, wrong for updating one;
   build later on the same data (a question per kind, then a structure question per pilot family).
4. The Inspector's Theme view. No: that view is foundations, per theme (Q1).

### Q3. How something left out shows

1. **Hidden, with "Show left out" in the Canvas bar.** The gallery shows the system as it ships; turned on, the left
   out tiles and families come back with a "Left out" badge, so they can be brought back from where they are.
   *(Recommended.)*
2. Always shown, muted. Keeps the room but the gallery no longer reads as the product's library.
3. Moved to a "Left out" group at the end of each family. Clear, but moves tiles as you edit.

### Q4. How defaults are chosen

1. **One default per axis, marked on its value in the Design view (a Radio beside the included values).** Leaving out
   the default moves it to the first value still in; an axis always keeps one value. A structure pick sets the
   default. Default tiles and every use without the prop draw it (the `SystemDefaults` provider, below).
   *(Recommended.)*
2. Defaults set only through Setup's questions.
3. Defaults inferred from use in projects. Later, as a suggestion ("8 of 9 buttons in your projects are soft").

### Q5. Pilot families with real alternatives already in the CSS

| Pilot | Axis | Alternatives (existing) | Families it reaches |
|---|---|---|---|
| **Tabs: selected tab** | `selection` | Underline (marker), Plate | Tabs |
| **Fields: field shell** | `variant` | Outlined, Soft | Input, Select, Text area, Input group, Search field? (only those with the axis) |
| **Field labels** | `orientation` | Above (vertical), Beside (horizontal), Either (auto) | Field |

Next candidates, already in the CSS: Calendar days (square, circle, tile), Calendar caption (label, menus), Radio and
Checkbox rows (layout list, tile, thumbnail…), Alert layout. Missing alternatives the brief names, to build as values
first: underlined fields, labels inline in the shell, where a dialog's close sits.

### Q6. The working copy and Publish

1. **The system's working copy gains `library` beside `themes`; Publish copies it into the release; Changes lists
   it as "Components" rows** ("Button: tone danger left out"). The kind follows: leaving anything out → Needs work in
   products; bringing something back → Adds; a default or structure change → Fixes (values change, nothing is added or
   taken away). Discard and Restore take the library back too. *(Recommended.)*
2. A separate "library version" beside the themes' version. Two numbers for one system; no.

### Q7. How projects on an earlier release are told

Until 2026-11-08 a project always saw its system's Live release. Recommended, and built (owner: "build with recs"):

1. **Projects keep the release they were made with until they accept an update.** The project's tab shows a notice,
   "Area 2.0 is out: Button's outline variant left out; 3 layers here use it", from the release's changes and the
   project's design scan (`src/design-scan.ts`), with Review (Live beside the update for each changed screen) and
   Update. Fixes and Adds update without asking; Needs work in products always asks. *(Recommended.)*
2. Every project follows Live at once (today's rule), with a one-time "what changed" notice.
3. Per-family accept, as a library review does (update Tabs now, Button later). Powerful, but a project on a mix of
   versions is hard to reason about.

## 3. The working copy's shape (for the code generator)

`apps/desktop/src/systems.ts` holds the types; `apps/desktop/src/library.ts` holds the pure rules and the structure
registry.

```ts
interface System { …; themes: SystemTheme[]; library: SystemLibrary; releases: Release[] }
interface Release { …; themes: SystemTheme[]; library: SystemLibrary }
/** What a system includes and how each family is built: only what differs from Area's manifests. */
interface SystemLibrary { families: Record<string /* family slug */, FamilyChoice> }
interface FamilyChoice {
  /** false: the family is left out of the system. Absent: included. */
  included?: false;
  /** Per axis (a manifest `variants` key, or "state"): the values left out. */
  leftOut?: Record<string, string[]>;
  /** Per axis: the system's default, where it differs from the manifest's. */
  defaults?: Record<string, string>;
}
```

`resolveFamily(choice, manifest)` (library.ts) gives the generator what to emit: `{ included, axes: { [axis]:
{ values, default } }, states }`. An empty library is Area as it ships. An axis with no manifest default (Tabs'
`selection: ["plate"]`) has an implicit base value named in the registry (`marker`, "Underline").

## 4. Build (this worktree)

Owner, 2026-11-08: "build with recs". Every recommendation (Q1–Q7, the first option of each) is built.

- `systems.ts`: `library` on System and Release, read, written, published, discarded, restored and compared
  (`changesOf` / `changesBetween` → `Change.family`). Projects' versions: `followedVersion` (a project's own version
  and the Fixes and Adds after it, stopping before a release that Needs work in products), `releasesAfter`, `asRelease`.
- `projects.ts`: `release`, the version a project was made with or last updated to (absent in older files: it follows
  Live, as before). New projects take Live's version; publishing an exploration moves the project to the version it made.
- `library.ts`: resolve a family, leave out / bring back a family or value, set a default, which tiles a choice
  hides, the structure registry (three pilots), the provider's value, `usesIn` (a screen source's written uses).
- `@area/react`: `SystemDefaults` provider (a system's default props per family, as a theme's default props). Read by
  Tabs, Input, Select, Textarea, Input group, Number field, Field, Button, Button group, Toggle group, Segmented, Badge,
  Count, Tag, Avatar, Switch, Checkbox, Radio, Card, Surface, Alert, Accordion item, Custom select and Link. A use's own
  prop wins, then a parent's (an Accordion's, a toolbar's), then the system's.
- Components pages: left out families and tiles hidden; Show › With left out in the bar; the List view is the inventory
  table (Included switch, what is left out); the Design view's In <system> section and the pilots' Structure.
- Publish: the library's changes in the table, under "Components"; pictures of the changed families
  (`library-pictures.tsx`: a default's Default tile before and after, a left-out value's tile marked Left out), in
  place of the theme screens when only the library changed.
- Projects (`release-notice.tsx`): while a newer version waits, the project's Overview opens with "<System> 2.0 is out":
  its note, which of the project's layers use what it leaves out, Review (the pictures, the uses and every change, as
  Publish lists them) and Update. The project's facts name its version and what is out.
- Field: a horizontal Field beside a vertical Stack puts its label on the first line (field.css, spec review note).

Checked: see the handoff entry for the last run.

Not built: Setup's inventory and structure questions (Q2.3, not the recommendation), underlined fields and the other
missing alternatives (Q5). Known gaps: the app's own UI and the example screens outside tiles don't take the library's
defaults (only gallery tiles, the Stage, Publish's pictures and the structure pictures do); families other than those
listed don't read `SystemDefaults` (their defaults change the gallery's inventory and the generator's output, not their
Default tile; Calendar and Split button destructure their axes with defaults and need a small change first); a
project's uses are written uses in its screens' sources, so a use leaning on a moved default isn't counted.
