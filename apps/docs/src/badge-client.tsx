import { createElement, type ReactNode } from "react";
import { hydrateRoot } from "react-dom/client";
import * as badge from "./demos/badge.tsx";

const { BADGE_GALLERY_DEMOS, ...staticDemos } = badge;
const demos: Record<string, () => ReactNode> = { ...BADGE_GALLERY_DEMOS, ...staticDemos };
for (const root of document.querySelectorAll<HTMLElement>("[data-badge-demo]")) {
  const name = root.dataset.badgeDemo!;
  const Component = demos[name];
  if (Component) hydrateRoot(root, createElement(Component), { identifierPrefix: `area-${name.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()}-` });
}
