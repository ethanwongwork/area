/** Validated design passes, shown in every family's Pass review in the gallery.
 *
 * A family is Validated when all three steps are done and recorded:
 *   1. Audit: the family was checked against the shared rules (`docs/research/cohesion-audit.md`,
 *      the `area-component-build` process) and has a spec in `docs/specs/<slug>.md`.
 *   2. Visual pass: the spec's "Visual pass" section records the `area-visual-language` pass.
 *   3. Claude in Chrome: the target product was measured live in Claude in Chrome and the
 *      captures are committed in `docs/research/captures/<slug>/`; the visual pass compared the
 *      two side by side there.
 * The gallery build reads the spec and captures for every family and shows what exists; an entry
 * here is the claim that step 3's side-by-side happened. The build fails when an entry's spec or
 * captures are missing. Validation is not owner acceptance (`component-status.mjs`).
 */
export const VALIDATED_PASSES = {
  toolbar: {
    date: "2026-09-27",
    against: "Figma toolbelt (bar, tools at rest, hover and selected, split chevron, mode switch)",
  },
};
