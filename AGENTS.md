# Area — agent orientation

Area is an eight-axis design system: tokens → framework-free CSS → thin React components
→ a static documentation site with live previews and an axis inspector.

## Start here

Read [.Codex/HANDOFF.md](.Codex/HANDOFF.md) when resuming work, then this file and
[README.md](README.md). Before changing `packages/` or the docs UI, read the relevant
sections of [docs/DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md).

GitHub `origin` is canonical. Preserve unrelated working-tree changes. Historical plans
are context, not authorization to implement them.

## Repository map

- `packages/tokens/src/`: palette, axes, semantic resolution, emitters, contrast tests.
- `packages/styles/src/`: component CSS and `manifest.ts`, the shared variant contract.
- `packages/react/src/`: source-only React wrappers and manifest-derived variant helpers.
- `apps/docs/src/`: component page metadata, practices, and real React demos.
- `apps/docs/scripts/`: static build, layout and browser behavior, audits, icon generation.
- `apps/docs/assets/`: generated sprites and original vendored Area marks; keep both.
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md): build flow and source boundaries.
- [docs/MAINTENANCE.md](docs/MAINTENANCE.md): verification, regeneration, known limitations.
- [.Codex/JOURNAL.md](.Codex/JOURNAL.md): decision history, consulted when needed.
- `archive/playground/`: superseded playground, Figma utilities and Cursor rules.
  These are historical material, not current implementation guidance.

## Commands (repository root)

Use Node 22.18+, 24.x, or 26+ as permitted by `package.json`; npm workspaces are required.

```sh
npm ci
npm run build                 # tokens, stylesheet, manifest parity, React source package
npm run dev                   # watches sources; serves http://localhost:4321
npm test                      # token maths, axes, contrast and waiver integrity
npm run typecheck             # all three packages plus the React lab
npm run lint:manifest         # CSS/manifest parity
npm run build:docs            # package build, docs render, dogfood audit
npm run audit                # audit already-built docs
node apps/docs/scripts/gen-icons.mjs
node packages/tokens/src/contrast/report.ts
```

The dev server watches token, style, React and docs sources and retains the last good build.
Restart it after changing the watcher/server implementation.
Run tests separately: `build` does not execute the contrast test gate.

## Rules that protect the system

- Axes own disjoint custom-property namespaces. Express interactions once in
  `packages/tokens/src/emit/base.ts`; re-emit derived values on every axis-bearing element.
  Never register derived tokens or paired semantic colors with `@property`.
  Read [docs/THEMING.md](docs/THEMING.md) before changing scope behavior; both polarity maps
  and emitted maps must preserve ownership. React Theme inherits context, not arbitrary host DOM.
- Keep the color values in `palette.json` verbatim. Hue and light-end chroma adjustments belong in
  `HUE_ROTATION` and `CHROMA_TRIM`; semantic rung choices belong in `INVERSION`.
  Run contrast tests for color changes; never weaken thresholds to obtain a pass.
- Components consume semantic tokens. Every CSS dimension traces to a token, except
  documented hairlines and mask geometry. Follow `components/button.css`: variants set
  local `--_*` properties; base rules consume them; size tiers set density tokens only.
- A size tier is the outer control height. Checkbox and Radio use the icon ramp. Switch
  tracks use fixed 24×12 / 28×16 / 40×20 / 40×20 / 48×24px glyph geometry in both densities;
  medium is 40×20px. Pill is the identity default; rounded is an explicit alternative. Radius is flat per preset and capped against the box;
  density also changes UI type.
- Decorative dividers and container edges use `--area-border-decorative` (light neutral 75, current visual trial).
  Never use it for control affordances or state indicators.
- Optical insets follow `packages/styles/src/inset.css` and the Optical insets section of
  `docs/DESIGN_SYSTEM.md`: square icon boxes, one font reference for all text, and
  `(backplate height - edge item height) / 2` outer spacing with borders counted once.
  Apply it to both ends, swatches and nested backplates; never nudge individual glyphs.
  Multiline icons align to the first text line, with equal top/leading insets and allowed
  space below. Same-tier controls share icon/text/gap tokens; messages use medium UI type.
- Foreground does not change on hover. State belongs on `data-*` attributes.
  Tone conveys meaning; variant conveys emphasis. Button and the manifest use `neutral`
  and `accent` consistently. Type role never implies weight (400/500).
- Update CSS and `manifest.ts` together. React wrappers forward native props and refs;
  add behavior only when it belongs to the component contract.
- Docs previews and snippets come from the same demo source. Use `tokenSection()` or
  `table()` in `layout.mjs`; do not hand-write demo snippets or docs tables.
- Docs CSS must not target `.area-*`. Its base layer loses to components, including
  when a docs class shares an element with an Area class. Use documented component
  variants; the utilities-layer exception is for rail visibility.
- Never put a backtick inside the `DOCS_CSS` or `DOCS_SCRIPT` template literals.
- Generate icons with `gen-icons.mjs`; never hand-edit generated icons or draw replacements.
  Preserve vendored Area markup and Fluent's size-specific cuts.

## Current audit

Read [docs/SYSTEM_AUDIT.md](docs/SYSTEM_AUDIT.md) and [docs/ROADMAP.md](docs/ROADMAP.md) before
expanding the system. Every component audit starts from the matching family section in
[the audit pack](docs/audit-pack/00-START-HERE.md): read the build brief first, then
the [repo map](docs/audit-pack/09-area-repo-map.md), then the matching family file. Never
write a size from memory; all numeric audit evidence comes from
`docs/audit-pack/evidence/`.
Follow [docs/IMPLEMENTATION_PLAN.md](docs/IMPLEMENTATION_PLAN.md) for the authorized work
order and decision boundaries. E03 resolves the five stroke failure groups without lowering
their floors and removes all syntax waivers. Read [docs/CONTRAST.md](docs/CONTRAST.md) before
changing strokes, focus or state painting. Required edges use stroke-width independently of
Surface. Most controls use focus-color/width/offset; editable fields use a neutral opaque
focus edge plus a translucent halo in standard mode and return to accent in increased contrast.
Contrast report exits nonzero on failures.

## Finish

Run relevant checks above and inspect the preview for visible changes. Report pre-existing
failures separately. Do not commit `dist/`, caches, or `node_modules/`.
Use the [checkpoint skill](.agents/skills/checkpoint/SKILL.md) to close a session:
verify, commit and push, update `.Codex/HANDOFF.md`, and append `.Codex/JOURNAL.md`.
Keep the handoff current and the journal historical; do not rely on private AI memory.
