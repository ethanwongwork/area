import { createElement } from "react";
import { hydrateRoot } from "react-dom/client";
import { ICON_BROWSER_ID, IconBrowser } from "./gallery/icon-browser.tsx";

// The prefix matches the build's renderToString call (scripts/component-gallery.mjs, iconsPage).
const node = document.getElementById(ICON_BROWSER_ID);
if (node) hydrateRoot(node, createElement(IconBrowser), { identifierPrefix: "icon-browser-" });
