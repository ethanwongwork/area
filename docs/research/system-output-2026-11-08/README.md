# Output: a system written out as code, and the agent contract (2026-11-08)

The brief's summary is "Area is a design system tool that writes to GitHub", and until now nothing wrote code out. This
is build steps 2 and 5 of `docs/BRIEF.md` ("Output model", "Frameworks and targets", "Definition and generator",
"Agent contract", "Checks", "Build sequence"): a published system written into a project's folder as files the
project owns, kept current by a three-way merge, with a DESIGN.md, an AGENTS.md block and an MCP server so coding
agents build inside it.

Research sources, with links and quotes: [sources.md](sources.md) (read 2026-11-08 from each tool's docs and source).
Review page (decisions, recommendation as the default, picks in `verdicts`): see the handoff entry for its link.
Code: `packages/output` (`@area/output`, the `area` command), `apps/desktop/electron/output.cjs` and
`apps/desktop/src/output.ts` with the Versions page's Code section.

## What the references do

| Pattern | Who | What it means for Area |
| --- | --- | --- |
| Copy once, then the code is yours; no record of what was copied | shadcn CLI | A file that differs is skipped or overwritten whole (`--overwrite`, prompt defaults to No). No lock, no base, no merge. Its MCP server is 7 read-only tools that hand back the `add` command. Area's brief rejects this model: updates stop. |
| Generated and never edited | Style Dictionary, Panda (`styled-system`, git-ignored), projen (read-only files, anti-tamper check) | Regeneration is trivial because nobody owns the output. Area's output is owned, so this only fits files nobody should edit (none, today). |
| Owned, updated by a real three-way merge | Copier (`copier update`), Cruft | Copier renders the *old* template version from the recorded `_commit`, takes the user's edits as a diff from it, renders the new version and re-applies the edits; leftovers settle with `git merge-file` (inline markers, or `.rej` with `--conflict rej`). Files the user deleted stay deleted. It needs git and tagged template versions to rebuild the base. Cruft applies the template-side diff with `git apply -3`. |
| Prompt per file | Yeoman, Rails `app:update` | No base, so every changed file is a question. |
| A settings object over a shipped stylesheet | Radix Themes (`<Theme accentColor radius scaling …>`), Tailwind v4 `@theme` | Enumerated knobs in, CSS custom properties out; the library stays a dependency. Tailwind compiles only used theme variables to `:root`. |
| Token interchange | DTCG Format Module 2025.10 (Final CG report, stable, not a W3C standard; Format, Color, Resolver modules) | The brief's definition stores tokens "in DTCG". Area's tokens are formulas over settings, not values; a DTCG export is a later target (Resolver's `modifiers` map onto light/dark), not the definition. |
| Agent rules | DESIGN.md (alpha: YAML tokens in front matter, sections Overview, Colors, Typography, Layout, Elevation & Depth, Shapes, Components, Do's and Don'ts; a lint/diff/export CLI), AGENTS.md (nearest file wins; read by most coding agents), Cursor `.mdc` rules (`globs`, `alwaysApply`), Copilot `*.instructions.md` (`applyTo`), CLAUDE.md (reads AGENTS.md only when there is no CLAUDE.md) | One DESIGN.md plus a pointer in AGENTS.md reaches every agent without a file per tool. |
| Design-system MCP servers | shadcn, Storybook (`docs-show`, `test-run`), Chakra (`get_component_props`, `get_theme`), a design tool's (`get_variable_defs`, `search_design_system`, `create_design_system_rules`) | All read-mostly: list, search, show props, examples, tokens, plus one verify step. None enforces; enforcement is lint and CI. |
| MCP protocol | 2026-07-28 is stateless (`server/discover`, version in every request's `_meta`, `resultType` on results); the TypeScript SDK still speaks 2025-11-25 (`initialize`) | Answer both. |

## Decisions, options and recommendations

Each decision lists its options best first; the first is built. The review page asks the ones that are the owner's.

### 1. The definition: `.area/system.json`

- **A. Written from one published release, choices only (built).** `format`, `system {id, name}`, `release {version,
  kind, note}`, `theme` (painted at `:root`), `themes[]` (each its `settings` (the Canvas axes), `material`, `colours`,
  `accent`), `inventory {components, exclude, icons}`, `structure`, `output {dir, targets, importExtension,
  iconFiles}`. Canonical JSON (sorted keys). Never the working copy, so a folder only ever holds something published.
- B. The app's whole system file (every release). Larger, and it carries drafts.
- C. DTCG tokens with an Area extension. Area's tokens are formulas over choices; storing resolved values makes every
  library update a token rewrite.

The inventory session's shape is read, not waited for: `inventory.components` ("all" or slugs, a manifest's block
without `area-`), `inventory.exclude` (slug → axis → values; booleans under `flags`), `inventory.icons`.
`definitionFromSystem` takes them from the release, then the system, then the folder's own definition.

### 2. What `design-system/` holds

| Path | What |
| --- | --- |
| `css/tokens.css` | Area's tokens and defaults (properties + defaults sheet), the same for every system |
| `css/theme.css` | The system's choices: each setting's chosen rule from Area's axes sheet, rebound to `:root`; a second theme on `[data-area-system-theme="<id>"]`; exact page colours and exact accent rules |
| `css/reset.css` … `css/forced-colors.css` | Area's base sheets, settings in context rebound the same way |
| `css/components/*.css` | One per held component, left-out components' and options' selectors removed |
| `css/index.css` | The layer order and every sheet, in cascade order |
| `react/components/*.tsx` | Held components' sources and what they import (React only), import endings rewritten |
| `react/manifest.ts`, `variants.ts`, `index.ts` | The held manifests with left-out options removed (so the prop types narrow), Area's class helpers, the exports |
| `icons/sprite.svg`, `icons/icons.json` | One symbol per icon and style per line (merges per icon); SVG files per icon when `iconFiles` |
| `components.json` | Every held component: options, parts, states, usage docs, React file; and the components left out |

Options for the theme sheet:

- **A. Prune Area's axes sheet to the chosen values and rebind them to `:root` (built).** Specificity and source order
  are unchanged, so the cascade is Area's own. Verified exact: `npm run fidelity -w @area/output` renders Area's full
  sheet with attributes beside the written sheet without them, in Electron, and compares all 2,808 `--area-*`
  properties on `:root` and on a second-theme scope, plus 192 painted values on six components, light and dark: four
  systems (defaults; a varied one with Material, exact colours, exact accent and a second theme; one following the
  device's contrast; the owner's own Area 1.0.1) are identical. Size: 0.5–0.7 MB (a third is the follow-the-device
  contrast block, gone when a theme fixes Contrast); restatements already equal to the defaults are dropped.
- B. Resolve every token to a value (a static evaluator or a headless render at write time). Smallest and most legible,
  but loses following the device's contrast and reduced motion, and needs a CSS engine.
- C. Ship Area's whole sheet and put the attributes on `<html>`. Simplest, 2 MB, and every unchosen value ships.

Token names keep `--area-*` (recommended: library items re-theme because every system shares the schema); a system
prefix is a later structure option. The mode stays `data-area-theme` on `<html>` (light without it).

### 3. Left-out components and options emit nothing

- **A. Drop, and keep what can't be left out, saying why (built).** A component's sheet loses every selector naming a
  held-out component's class or a left-out modifier; the React manifest loses the value, so `tone="discovery"` stops
  type-checking. A component the system holds that another needs (Dialog draws Buttons) is held too, recorded as
  `neededBy`. An option stays when it is the default or another held component's source uses it
  (`<Button variant="ghost">` inside Dialog), and the build notes it.
- B. Refuse such exclusions in the inventory UI. Better UX, and the inventory session can add it on top of A.
- C. Drop regardless. Ships components that draw unstyled.

### 4. The lock and the three-way merge

- **A. `.area/area.lock` (library version, the definition's hash, a sha256 per written file) plus a copy of every
  file as Area last wrote it in `.area/base/` (built).** The merge's base is always at hand: no network, no history,
  no old library. Without the copies (a clone that ignored them), a file still matching its hash counts as unedited,
  so only edited files lose the merge.
- B. Rebuild the base from the recorded library version, as Copier does. Smallest repository, but needs every past
  library version installable, and the hosted library doesn't exist yet. The lock already records what this needs, so
  B can replace A later.
- C. Hashes only (keep edited files whole, update the rest). No merge; ordinary edits stop updates.

Per file (`src/write.ts`): added, updated, unchanged, kept-edits, merged, conflict, removed (no longer written,
unedited), left (no longer written, edited: kept, untracked), skipped (you removed it: stays removed, as Copier),
exists (a file of yours where Area writes one: never overwritten silently). The merge is line-based diff3 over Myers'
diff, no dependencies (`src/merge.ts`, checked against a brute-force LCS on 2,000 random cases).

Two changes to the same lines:

- **A. Both versions in the file between markers, listed for a choice (built; CLI exits 2).** Editors and agents read
  markers; `area check` can fail on them in CI.
- B. Keep yours, put Area's beside it (`.rej`-style). Nothing breaks, but the choice is easy to miss.
- C. Write nothing until each is chosen. Safest, and right for the app once it shows each pair side by side (the plan
  already carries both versions, `Step.yours` and `Step.area`, and `apply` takes per-file choices).

### 5. Deterministic output

Built: no clock, no randomness, sorted keys and file lists, the library's own order inside files, LF only, no dates in
generated files (the definition's release date stays out too). The library version is the packages' versions plus a
hash of every input, so any library change is a new version. Tested: the same choices written in another key order
give the same bytes.

### 6. DESIGN.md and the agent rules

- **A. DESIGN.md at the project's root in DESIGN.md's section order, plus Area's own block inside AGENTS.md
  (built).** The block sits between `<!-- area:begin -->` and `<!-- area:end -->` and merges like a file; the rest of
  AGENTS.md is the project's. AGENTS.md reaches most agents, so no file per tool.
- B. A, plus a rule file per tool (`.cursor/rules/area.mdc`, `.github/instructions/area.instructions.md`, CLAUDE.md
  import). More files to own; most of those tools read AGENTS.md already.
- C. DESIGN.md only.

DESIGN.md's front matter names the system now. Its tokens (exact colours, type, radii) need resolved values, which the
generator doesn't compute (decision 2, A); the app can resolve them at write time from a render and pass them in, a
follow-up. The prose lists the color roles by group, type, layout, depth and shape settings, every held component with
its options, what's left out, usage do's and don'ts and "instead" from the Documentation entries, and the rules.

### 7. The MCP server

- **A. Read-only, five tools over the project's own files (built): `system.search_components`,
  `system.get_component`, `system.resolve_token`, `system.validate_diff`, `system.get_rules`.** `area mcp` on stdio,
  no dependencies, answering both `initialize` (2025-11-25 and earlier) and the stateless 2026-07-28 style. It needs
  only `.area/` and `design-system/`, never the library.
- B. A plus write tools (add a component to the inventory, write the system). Writing belongs to review in the app;
  later, behind approval.
- C. Rules files only. Agents then can't ask.

The brief also names `preview.screenshot` and `library.get_item`; both need the preview server and the hosted library.

### 8. Checks (`area check`, `system.validate_diff`)

Built: components not in the system, left-out options (classes and JSX props), unknown `--area-*` tokens, literal
colors, px lengths other than 0 and 1 in styles; kept literals in `.area/rules/literals.json`. Not built: nearest-token
proposals for literals, duplicate detection, visual diff, axe.

### 9. Where it sits in the app

- **A. Versions › a version › Inspector › Code: Write to folder… (built).** Picks a folder, shows what writing would do
  in one sentence ("11 files: 8 updated, 2 updated around your edits, 1 keeps your edits."), then Write; after, the
  folder, version and Show in Finder. Design words throughout: "updated around your edits", "two changes side by side",
  never merge or conflict (PRODUCT_UI rule 24).
- B. A Code page in the system's nav (the folders it is written to, each one's version, what's out of date, checks).
  The natural next step once a system lives in several projects.
- C. A "Write to folder" option in the Publish dialog. Fast for solo work, but couples publishing to one folder.

GitHub (sign in, a branch, a pull request with before/after and checks) takes the same plan through another
destination: `Destination` in `src/write.ts`, `where.kind` in the IPC.

### 10. Where the code lives

- **A. A new package, `packages/output` (`@area/output`, bin `area`) (built).** It reads the token, styles, React and
  icons packages as inputs and runs as TypeScript in Node 22.18+ and Electron's Node.
- B. Extend `area-tokens`. The token command is one rule per call for CSS-only products; the generator reads every
  package, which `@area/tokens` must not depend on.

## Proof point (brief, step 2)

`packages/output/tests/output.test.ts`: two very different systems (Northwind at Area's defaults with every component;
Lumen with radius 0, type 12, density 28, warm neutrals, Glass, exact accent and page, a Night theme scoped, seven
chosen components and left-out options) written from one library into two folders; local edits in a component sheet, a
React component, DESIGN.md and AGENTS.md; a library update changing a component sheet, a component source, a token
default and a base sheet; both written again with no choices to make, every local edit kept and every library change
in; written a third time, nothing to do. Plus: determinism, left-out options, two changes side by side settled either
way, removal, a deleted file staying deleted, a missing base copy, a file of the project's own never overwritten, the
checks and the MCP server.

## Open

- Resolved token values in DESIGN.md's front matter (and a DTCG export), from a render at write time.
- The app shows each "two changes side by side" file and lets the person choose (the plan carries both versions).
- GitHub as a destination; `area check` in CI; publishing `@area/output` so `npx area` works outside this checkout.
- Structure options (`structure`) once the inventory session defines them.
- Theme sheet size (0.5–0.7 MB): a static resolver would cut it, at the cost of following the device's settings.
