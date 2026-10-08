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

const { BADGE_GALLERY_DEMOS, ...badgeDemos } = badge;
const { ICON_REVIEW_DEMOS, ...iconDemos } = icons;
const DEMO_MODULES: Record<string, object> = { BADGE_GALLERY_DEMOS, badge: badgeDemos, switches, button, form, display, nav, theme, gallery, cards, icons: iconDemos, ICON_REVIEW_DEMOS, variants, overlays, counts, accordions, customSelects, tags, tagPickers, datePickers, drawers };
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
  drawers: "src/demos/drawer.tsx",
};
