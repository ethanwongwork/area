import { createElement } from "react";
import { hydrateRoot } from "react-dom/client";
import * as formDemos from "../../desktop/src/content/demos/form.tsx";
import * as galleryDemos from "../../desktop/src/content/demos/gallery.tsx";

const demos = { ...formDemos, ...galleryDemos };

for (const root of document.querySelectorAll<HTMLElement>("[data-chip-demo]")) {
  const name = root.dataset.chipDemo!;
  const Component = demos[name as keyof typeof demos];
  if (Component) hydrateRoot(root, createElement(Component), {
    identifierPrefix: `area-${name.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()}-`,
  });
}
