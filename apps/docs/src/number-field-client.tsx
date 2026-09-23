import { createElement } from "react";
import { hydrateRoot } from "react-dom/client";
import * as formDemos from "./demos/form.tsx";
import { GalleryNumberFieldPlain, GalleryInputGroupAffixes, GalleryInputGroupPair, GalleryInputGroupIcon, GalleryInputGroupOpacity, GalleryInputGroupRotation, GalleryInputGroupLetter, GalleryInputGroupMode, GalleryInputGroupPhone, GalleryInputGroupAction } from "./demos/gallery.tsx";

const demos = { ...formDemos, GalleryNumberFieldPlain, GalleryInputGroupAffixes, GalleryInputGroupPair, GalleryInputGroupIcon, GalleryInputGroupOpacity, GalleryInputGroupRotation, GalleryInputGroupLetter, GalleryInputGroupMode, GalleryInputGroupPhone, GalleryInputGroupAction };

for (const root of document.querySelectorAll<HTMLElement>("[data-number-field-demo]")) {
  const name = root.dataset.numberFieldDemo!;
  const Component = demos[name as keyof typeof demos];
  if (Component) hydrateRoot(root, createElement(Component), {
    identifierPrefix: `area-${name.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()}-`,
  });
}
