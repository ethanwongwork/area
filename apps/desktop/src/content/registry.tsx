/**
 * The demo registry.
 *
 * One module imports every demo, and the build renders each of them with react-dom/server
 * while reading the same file's source for the code sample. Preview and snippet therefore
 * come from a single artefact and cannot drift -- which was the one thing the previous
 * system's documentation could not promise, since its snippets were hand-typed strings
 * with no relationship to what was rendered.
 *
 * The docs-only Iconography demos (Area beside Fluent) are in registry-docs.tsx, which the archived
 * docs build reads, so the app never bundles the Fluent map.
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
import * as tokenRows from "./demos/token-row.tsx";
import * as assetRows from "./demos/asset-row.tsx";
import * as previewFrames from "./demos/preview-frame.tsx";
import * as passwordFields from "./demos/password-field.tsx";
import * as copyButtons from "./demos/copy-button.tsx";
import * as listBoxes from "./demos/list-box.tsx";
import * as appShell from "./demos/app-shell.tsx";
import * as otpFields from "./demos/otp-field.tsx";
import * as timeFields from "./demos/time-field.tsx";
import * as spinnerValues from "./demos/spinner-value.tsx";
import * as steppers from "./demos/stepper.tsx";
import * as inspectorRecipes from "./demos/inspector.tsx";
import * as referenceLists from "./demos/reference-list.tsx";
import * as tablesOfContents from "./demos/table-of-contents.tsx";
import * as figures from "./demos/figure.tsx";
import * as infoboxes from "./demos/infobox.tsx";
import * as inlineLists from "./demos/inline-list.tsx";
import * as abbreviations from "./demos/abbreviation.tsx";
import * as hatnotes from "./demos/hatnote.tsx";
import * as navboxes from "./demos/navbox.tsx";

const { BADGE_GALLERY_DEMOS, ...badgeDemos } = badge;
const DEMO_MODULES: Record<string, object> = { BADGE_GALLERY_DEMOS, badge: badgeDemos, switches, button, form, display, nav, theme, gallery, cards, variants, overlays, counts, accordions, customSelects, tags, tagPickers, datePickers, drawers, paginations, links, scrollAreas, fileUploads, toggletips, emptyStates, toggleGroups, descriptionLists, meters, searchFields, shortcutLists, dateRangePickers, citations, zoomControls, boards, timelines, editableTexts, boxModels, tokenRows, assetRows, previewFrames, passwordFields, copyButtons, listBoxes, appShell, otpFields, timeFields, spinnerValues, steppers, inspectorRecipes, referenceLists, tablesOfContents, figures, infoboxes, inlineLists, abbreviations, hatnotes, navboxes };
// One name, one demo. The server renders from this merged map, while hydration clients import a
// module directly, so a name exported twice renders one demo and hydrates the other (a mismatch).
const demoOwner = new Map<string, string>();
for (const [module, exports] of Object.entries(DEMO_MODULES)) for (const name of Object.keys(exports)) {
  if (demoOwner.has(name)) throw new Error(`Demo ${name} is exported by both ${demoOwner.get(name)} and ${module}`);
  demoOwner.set(name, module);
}
export const DEMOS = Object.assign({}, ...Object.values(DEMO_MODULES)) as Record<string, () => unknown>;

/** Each demo module's source file, relative to this registry (the docs build reads them for snippets). */
export const SOURCES = {
  card: "demos/card.tsx",
  switch: "demos/switch.tsx",
  badge: "demos/badge.tsx",
  theme: "demos/theme.tsx",
  button: "demos/button.tsx",
  form: "demos/form.tsx",
  display: "demos/display.tsx",
  nav: "demos/nav.tsx",
  gallery: "demos/gallery.tsx",
  variants: "demos/gallery-variants.tsx",
  overlays: "demos/overlays.tsx",
  counts: "demos/count.tsx",
  accordions: "demos/accordion.tsx",
  customSelects: "demos/custom-select.tsx",
  tags: "demos/tag.tsx",
  tagPickers: "demos/tag-picker.tsx",
  datePickers: "demos/date-picker.tsx",
  paginations: "demos/pagination.tsx",
  links: "demos/link.tsx",
  scrollAreas: "demos/scroll-area.tsx",
  fileUploads: "demos/file-upload.tsx",
  toggletips: "demos/toggletip.tsx",
  emptyStates: "demos/empty-state.tsx",
  toggleGroups: "demos/toggle-group.tsx",
  descriptionLists: "demos/description-list.tsx",
  meters: "demos/meter.tsx",
  searchFields: "demos/search-field.tsx",
  shortcutLists: "demos/shortcut-list.tsx",
  dateRangePickers: "demos/date-range-picker.tsx",
  citations: "demos/citation.tsx",
  zoomControls: "demos/zoom-control.tsx",
  boards: "demos/board.tsx",
  timelines: "demos/timeline.tsx",
  editableTexts: "demos/editable-text.tsx",
  boxModels: "demos/box-model.tsx",
  tokenRows: "demos/token-row.tsx",
  assetRows: "demos/asset-row.tsx",
  previewFrames: "demos/preview-frame.tsx",
  passwordFields: "demos/password-field.tsx",
  copyButtons: "demos/copy-button.tsx",
  listBoxes: "demos/list-box.tsx",
  appShell: "demos/app-shell.tsx",
  otpFields: "demos/otp-field.tsx",
  timeFields: "demos/time-field.tsx",
  spinnerValues: "demos/spinner-value.tsx",
  steppers: "demos/stepper.tsx",
  inspectorRecipes: "demos/inspector.tsx",
  drawers: "demos/drawer.tsx",
  referenceLists: "demos/reference-list.tsx",
  tablesOfContents: "demos/table-of-contents.tsx",
  figures: "demos/figure.tsx",
  infoboxes: "demos/infobox.tsx",
  inlineLists: "demos/inline-list.tsx",
  abbreviations: "demos/abbreviation.tsx",
  hatnotes: "demos/hatnote.tsx",
  navboxes: "demos/navbox.tsx",
};
