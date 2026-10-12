import { createElement } from "react";
import { hydrateRoot } from "react-dom/client";
import * as displayDemos from "../../desktop/src/content/demos/display.tsx";
import * as galleryDemos from "../../desktop/src/content/demos/gallery.tsx";

const demos = { ...displayDemos, ...galleryDemos };

for (const root of document.querySelectorAll<HTMLElement>("[data-alert-demo]")) {
  const name = root.dataset.alertDemo!;
  const Component = demos[name as keyof typeof demos];
  if (Component) hydrateRoot(root, createElement(Component), {
    identifierPrefix: `area-${name.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()}-`,
  });
}
