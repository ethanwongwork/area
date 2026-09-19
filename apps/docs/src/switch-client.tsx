import { createElement } from "react";
import { hydrateRoot } from "react-dom/client";
import * as demos from "./demos/switch.tsx";
for (const root of document.querySelectorAll<HTMLElement>("[data-switch-demo]")) {
  const name = root.dataset.switchDemo!;
  const Component = demos[name as keyof typeof demos];
  if (Component) hydrateRoot(root, createElement(Component), { identifierPrefix: `area-${name.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()}-` });
}
