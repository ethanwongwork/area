# Component gallery

The gallery at `/gallery.html` shows 32 component families in alphabetical order. The 32
component documentation pages are the source of the catalog. Code, Code block and Segmented
now have dedicated API pages because they previously appeared only in composed examples.
Compound pieces (choice labels, ChipGroup, KbdGroup and the Table wrapper) appear inside their
parent specimens, so the 36 CSS manifest blocks are represented without redundant tiles.

## Layout and source

- Every tile has a 1:1 aspect ratio, a name at the top left and a Docs link at the top right.
- The responsive grid uses the full document column and has no table-of-contents column.
  Closing Customize opens more space; the normal inspector still changes every specimen.
- Components retain their native token-derived dimensions. No screenshot, transform scaling,
  zoom, or miniature CSS replacement is used. Framing widths fit forms, panels and tables into
  the same square rhythm while retaining generous token-based padding.
- `apps/docs/src/demos/gallery.tsx` renders the actual public React components through the
  existing registry and server-rendering pipeline. The source extractor also registers each
  specimen's exact source, following the site's preview/source rule.
- Primary variants are shown where they make a useful visual comparison: Button's four
  treatments; selected/unselected choices; semantic badges and alerts; Avatar/Spinner sizes;
  determinate/indeterminate Progress. Larger component matrices stay on their documentation pages.
- Component navigation is sorted by the shared page metadata, so the sidebar and gallery use
  the same order. A new component page without a gallery specimen fails the docs build.

The gallery is a presentation reference, like the existing static component pages. Native
controls work, but no new application behavior is claimed for presentation-only widgets.
The inline Dialog specimen explicitly uses group semantics rather than claiming an open modal.
The page explains this scope and links directly to dedicated API and interaction guidance for
every tile, including Code, Code block and Segmented. Segmented documentation explicitly
records the existing keyboard-navigation and single-tab-stop limitations.

## Validation

Docs TypeScript and JavaScript syntax checks passed during implementation. The parent batch
report records full build, rendered coverage, navigation targets and browser geometry checks.

### Narrow-screen rail correction

The mobile gallery review exposed an existing shell bug: responsive rail hiding was in the
base cascade layer and lost to Panel's component display rule. The grid also reserved fixed
columns without considering collapsed rail state. Responsive visibility now uses the same
utilities-layer state contract as desktop. At narrow widths, navigation and Customize start
closed; their corner buttons open one rail at a time above the document in normal flow.
The gallery retains a single square column with full mobile padding. Controls remain reachable,
opening moves focus to the rail's close button, and closing returns focus to its corner button.
Mobile choices do not overwrite saved desktop rail preferences; crossing a breakpoint restores
the appropriate arrangement. The rails do not overlay the page or claim modal behavior.
