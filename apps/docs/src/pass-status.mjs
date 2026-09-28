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
    against: "Figma toolbelt, re-checked after the Segmented and split-tool change (tools, chevrons, divider, mode switch)",
  },
  "split-button": {
    date: "2026-09-27",
    against: "Figma's toolbelt tool groups (tool and chevron plates, hover, selected)",
  },
  nav: {
    date: "2026-09-27",
    against: "ChatGPT's and Notion's sidebars (sections, labels, rows, current plate)",
  },
  menu: {
    date: "2026-09-27",
    against: "Notion's page menu (icons, shortcuts, rules, danger row, lift)",
  },
  "tree-view": {
    date: "2026-09-27",
    against: "Notion's sidebar tree (rows, hover, row actions)",
  },
  alert: {
    date: "2026-09-27",
    against: "Notion's callout block (fill, edge, icon on the first line)",
  },
  toast: {
    date: "2026-09-27",
    against: "Notion's Link copied toast (shape, icon, action; Notion's is inverse)",
  },
  segmented: {
    date: "2026-09-27",
    against: "ChatGPT's Chat / Work switch and Figma's mode switch",
  },
};
