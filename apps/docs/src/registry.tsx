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
import * as reviews from "./demos/reviews.tsx";

const { BADGE_GALLERY_DEMOS, ...badgeDemos } = badge;
const { ICON_REVIEW_DEMOS, ...iconDemos } = icons;
export const DEMOS = { ...BADGE_GALLERY_DEMOS, ...badgeDemos, ...switches, ...button, ...form, ...display, ...nav, ...theme, ...gallery, ...cards, ...iconDemos, ...ICON_REVIEW_DEMOS, ...variants, ...overlays, ...reviews } as Record<string, () => unknown>;

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
  reviews: "src/demos/reviews.tsx",
};
