import { createElement } from "react";
import { hydrateRoot } from "react-dom/client";
import { GalleryControls, GalleryNav, type GalleryPage, type GallerySection } from "./gallery/chrome.tsx";
import { annotateRoundness } from "./gallery/roundness.ts";
import { GALLERY_CANVAS_ID } from "./gallery/controls.ts";
import { fitTiles } from "./gallery/fit.ts";

// The prefixes match the build's renderToString calls (scripts/component-gallery.mjs).
const nav = document.getElementById("gallery-nav");
const data = document.getElementById("gallery-nav-data");
if (nav && data) {
  const { sections, page } = JSON.parse(data.textContent ?? "{}") as { sections: GallerySection[]; page: GalleryPage };
  hydrateRoot(nav, createElement(GalleryNav, { sections, page }), { identifierPrefix: "gallery-nav-" });
}
const controls = document.getElementById("gallery-controls");
if (controls) hydrateRoot(controls, createElement(GalleryControls), { identifierPrefix: "gallery-controls-" });

// Fit the tiles once fonts have settled every specimen's size, then return to the linked section,
// which the fit may have moved.
const canvas = document.getElementById(GALLERY_CANVAS_ID);
if (canvas) document.fonts.ready.then(() => {
  fitTiles(canvas);
  annotateRoundness(canvas);
  if (location.hash) document.getElementById(decodeURIComponent(location.hash.slice(1)))?.scrollIntoView({ block: "start" });
});
