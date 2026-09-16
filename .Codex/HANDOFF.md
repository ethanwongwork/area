# Handoff — 2026-09-15

**Branch:** `main`. **Starting commit:** `27096be`.
**Checkpoint:** the commit containing this handoff; use `git log -1 --oneline`.
**State:** V04 optical insets, first-line alignment and consistent tier sizing are implemented
and verified. E05 behavior architecture and platform validation remain open.

## Where things stand

E01–E04 and V01–V04 are implemented. The user requested this visual batch before E05 and
explicitly authorized committing and pushing all changes to GitHub, including earlier local
checkpoints. At session start the tree was clean and the last session fully committed in
27096be. After fetching origin, main was 13 commits ahead and 0 behind.

Canonical remote: https://github.com/ethanwongwork/area.git. Commit is local; push publishes
to GitHub. A completed checkpoint requires matching local and remote heads. Verify with
`git status -sb` and `git rev-parse HEAD origin/main`. The previous no-push authorization
block is superseded by the user's explicit authorization in this session.

## What happened this session

- [V04 report](../docs/batches/V04/README.md) preserves the two supplied references,
  before/after screenshots, frozen pre-V04 CSS and browser geometry results.
- `packages/styles/src/inset.css` centralizes `(backplate height - edge box height) / 2`
  outer insets, subtracting borders once. Both ends, chevrons, swatches and nested plates
  follow the same rule. Icons use their square boxes without per-glyph ink corrections.
- Text slots use a shared cap-to-baseline reference and symmetric accent/descender safety
  space. React and framework-free docs have matching label slots and manifest entries.
- Multiline Alert/Toast icons keep equal top/leading insets and align to the first line,
  with extra space below allowed. Choice labels also align to the first line. Trim only
  the text group's outer edges; title/description leading remains intact.
- Chip, Segmented and Select share their named tier's icon/text/gap with Button/Input.
  Menu/Nav and status messages use the medium UI pairing. Kbd remains native text;
  status dots and Switch geometry retain their distinct semantic roles.
- AGENTS, design conventions, maintenance and `.cursor/rules/optical-insets.mdc` preserve
  the rules. Palette, semantic colors and vendored/generated icon paths are unchanged.

## In flight

No intentional partial implementation remains. Preview: http://localhost:4321/gallery.html.
The diagnostic pages are inset.html and inset-before.html. Dev session 11363 was started
for final review. Browser evidence is in V04, not private AI memory.

## Next

1. E05: prove Tabs/Dialog interaction architecture before adopting an adapter. No behavior
   library is installed. Research official APIs, prototype and verify the exit criteria.
2. E06–E07: Field help/required relationships, Tabs IDs/keyboard, Segmented roving focus,
   motion-none and native Slider keyboard changes leaving painted fill stale.
3. E08–E10: remaining chrome/localization/zoom/overlay compositions and Safari, Gecko,
   forced-colors, assistive technology, React18 and actual RSC framework validation.
4. E11–E12: preference/theme recipes and missing composites.

## Traps

- Native editable text keeps browser-managed metrics. The shared font reference is not
  identical per-word ink bounds. Older browsers without text-box use line-box placement.
  Chromium geometry does not establish Safari/Gecko/OS font behavior.
- Multiline icons align to the first line, not the whole paragraph. Trimming both edges
  of each title/description separately collapsed their internal line spacing.
- Shortcut wrappers need inline-flex: an inline baseline line box caused 1–2px errors
  despite the nested Kbd's own correct height.
- Type fixtures must apply font-family:var(--area-font-sans) at each scope. Updating only
  the variable does not replace the already inherited body's resolved font-family.
- Stop dev before manual full builds; concurrent dist/modules rebuilds can race checks.
  Build before typecheck/consumer because exports use compiled output.
- Do not comma-compose shadow-1 with another shadow; flat Surface resolves it to none.
- Prior paint audit: 3,012 standard-mode non-text shortfalls; more mode 21,120 passes.
  V04 does not change colors or claim overall accessibility conformance.
- Do not edit the palette without asking. Preserve vendored/generated icon geometry.
  Docs must respect CSS layers and component contracts. Use CUA for browser work.

## Verify

- npm test: **16,322 tests /9 files passed**.
- Contrast report: **308 passing /0 failures /0 active waivers**, across 66 themes.
- npm run build:docs: **48 pages /106 demos**; dogfood and all 36 manifests pass.
- npm run typecheck and npm run lint:manifest: pass.
- npm run test:contracts: **12/12**.
- npm run test:consumer: export conditions, strict types, runtime, SSR, browser bundle,
  CSS and tree-shaking pass. Helper 1,417 bytes /Button 2,236 bytes with React external.
- Chromium inset.html: **5,728 checks /0 failures** at desktop and 390px, 32 profiles.
  Maximum rounding error **0.0078125px**, tolerance 0.15px. Includes 544 first-line and
  64 multiline top/leading-inset checks. No overflow at either viewport.
- Frozen before CSS: **3,592 failures /5,728 checks**, retained as comparison evidence.
- Gallery visually inspected at desktop/mobile. git diff --check passes.
