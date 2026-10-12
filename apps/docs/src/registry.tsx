/**
 * The demo registry.
 *
 * One module imports every demo, and the build renders each of them with react-dom/server
 * while reading the same file's source for the code sample. Preview and snippet therefore
 * come from a single artefact and cannot drift -- which was the one thing the previous
 * system's documentation could not promise, since its snippets were hand-typed strings
 * with no relationship to what was rendered.
 */
import * as switches from "./demos/switch.tsx";
import * as badge from "./demos/badge.tsx";
import * as button from "./demos/button.tsx";
import * as form from "./demos/form.tsx";
import * as display from "./demos/display.tsx";
import * as theme from "./demos/theme.tsx";
import * as nav from "./demos/nav.tsx";
import * as gallery from "./demos/gallery.tsx";
import * as cards from "./demos/card.tsx";
import * as icons from "./demos/icons.tsx";
import * as variants from "./demos/gallery-variants.tsx";
import * as overlays from "./demos/overlays.tsx";
import * as counts from "./demos/count.tsx";
import * as accordions from "./demos/accordion.tsx";
import * as customSelects from "./demos/custom-select.tsx";
import * as tags from "./demos/tag.tsx";
import * as tagPickers from "./demos/tag-picker.tsx";
import * as datePickers from "./demos/date-picker.tsx";
import * as drawers from "./demos/drawer.tsx";
import * as paginations from "./demos/pagination.tsx";
import * as links from "./demos/link.tsx";
import * as scrollAreas from "./demos/scroll-area.tsx";
import * as fileUploads from "./demos/file-upload.tsx";
import * as toggletips from "./demos/toggletip.tsx";
import * as emptyStates from "./demos/empty-state.tsx";
import * as toggleGroups from "./demos/toggle-group.tsx";
import * as descriptionLists from "./demos/description-list.tsx";
import * as meters from "./demos/meter.tsx";
import * as searchFields from "./demos/search-field.tsx";
import * as shortcutLists from "./demos/shortcut-list.tsx";
import * as dateRangePickers from "./demos/date-range-picker.tsx";
import * as citations from "./demos/citation.tsx";
import * as zoomControls from "./demos/zoom-control.tsx";
import * as boards from "./demos/board.tsx";
import * as timelines from "./demos/timeline.tsx";
import * as editableTexts from "./demos/editable-text.tsx";
import * as boxModels from "./demos/box-model.tsx";

const { BADGE_GALLERY_DEMOS, ...badgeDemos } = badge;
const { ICON_REVIEW_DEMOS, ...iconDemos } = icons;
const DEMO_MODULES: Record<string, object> = { BADGE_GALLERY_DEMOS, badge: badgeDemos, switches, button, form, display, nav, theme, gallery, cards, icons: iconDemos, ICON_REVIEW_DEMOS, variants, overlays, counts, accordions, customSelects, tags, tagPickers, datePickers, drawers, paginations, links, scrollAreas, fileUploads, toggletips, emptyStates, toggleGroups, descriptionLists, meters, searchFields, shortcutLists, dateRangePickers, citations, zoomControls, boards, timelines, editableTexts, boxModels };
// One name, one demo. The server renders from this merged map, while hydration clients import a
// module directly, so a name exported twice renders one demo and hydrates the other (a mismatch).
const demoOwner = new Map<string, string>();
for (const [module, exports] of Object.entries(DEMO_MODULES)) for (const name of Object.keys(exports)) {
  if (demoOwner.has(name)) throw new Error(`Demo ${name} is exported by both ${demoOwner.get(name)} and ${module}`);
  demoOwner.set(name, module);
}
export const DEMOS = Object.assign({}, ...Object.values(DEMO_MODULES)) as Record<string, () => unknown>;

export const SOURCES = {
  card: "src/demos/card.tsx",
  switch: "src/demos/switch.tsx",
  badge: "src/demos/badge.tsx",
  theme: "src/demos/theme.tsx",
  button: "src/demos/button.tsx",
  form: "src/demos/form.tsx",
  display: "src/demos/display.tsx",
  nav: "src/demos/nav.tsx",
  gallery: "src/demos/gallery.tsx",
  icons: "src/demos/icons.tsx",
  variants: "src/demos/gallery-variants.tsx",
  overlays: "src/demos/overlays.tsx",
  counts: "src/demos/count.tsx",
  accordions: "src/demos/accordion.tsx",
  customSelects: "src/demos/custom-select.tsx",
  tags: "src/demos/tag.tsx",
  tagPickers: "src/demos/tag-picker.tsx",
  datePickers: "src/demos/date-picker.tsx",
  paginations: "src/demos/pagination.tsx",
  links: "src/demos/link.tsx",
  scrollAreas: "src/demos/scroll-area.tsx",
  fileUploads: "src/demos/file-upload.tsx",
  toggletips: "src/demos/toggletip.tsx",
  emptyStates: "src/demos/empty-state.tsx",
  toggleGroups: "src/demos/toggle-group.tsx",
  descriptionLists: "src/demos/description-list.tsx",
  meters: "src/demos/meter.tsx",
  searchFields: "src/demos/search-field.tsx",
  shortcutLists: "src/demos/shortcut-list.tsx",
  dateRangePickers: "src/demos/date-range-picker.tsx",
  citations: "src/demos/citation.tsx",
  zoomControls: "src/demos/zoom-control.tsx",
  boards: "src/demos/board.tsx",
  timelines: "src/demos/timeline.tsx",
  editableTexts: "src/demos/editable-text.tsx",
  boxModels: "src/demos/box-model.tsx",
  drawers: "src/demos/drawer.tsx",
};
