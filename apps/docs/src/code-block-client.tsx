import { createElement } from "react";
import { hydrateRoot } from "react-dom/client";
import * as demos from "../../desktop/src/content/demos/gallery.tsx";

/*
 * Code blocks are hydrated wherever they are shown, because the copy control, the
 * language picker and the show/hide control are all real behaviour rather than paint.
 */
for (const root of document.querySelectorAll<HTMLElement>("[data-code-block-demo]")) {
  const name = root.dataset.codeBlockDemo!;
  const Component = demos[name as keyof typeof demos];
  if (Component) hydrateRoot(root, createElement(Component), { identifierPrefix: `area-${name.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()}-` });
}
