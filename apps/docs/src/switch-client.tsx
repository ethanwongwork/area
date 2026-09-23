import { createElement } from "react";
import { hydrateRoot } from "react-dom/client";
import * as demos from "./demos/switch.tsx";
import { GallerySegmentedIconOnly } from "./demos/gallery.tsx";
import { GalleryNavActions, GalleryTabs, GalleryTabsVertical, GalleryTabsSmall, GalleryTabsTrack, GalleryTabsBadges, GalleryTableSelectable, GalleryTextareaCount, GalleryToastAction } from "./demos/gallery.tsx";
import { GalleryPanel, GalleryPanelSections, GalleryPanelFooter, GalleryMenuControls, GalleryCodeBlockCopy, GalleryDialogModal, GallerySegmented, GallerySegmentedIcons, GallerySegmentedFullWidth, GallerySegmentedSmall, GallerySegmentedMedium, GallerySegmentedLarge, SegmentedSizes } from "./demos/gallery.tsx";
const galleryDemos = { GalleryPanel, GalleryPanelSections, GalleryPanelFooter, GalleryMenuControls, GalleryCodeBlockCopy, GalleryDialogModal, GallerySegmented, GallerySegmentedIcons, GallerySegmentedFullWidth, GallerySegmentedSmall, GallerySegmentedMedium, GallerySegmentedLarge, SegmentedSizes };
for (const root of document.querySelectorAll<HTMLElement>("[data-switch-demo]")) {
  const name = root.dataset.switchDemo!;
  const refinements = { GallerySegmentedIconOnly, GalleryNavActions, GalleryTabs, GalleryTabsVertical, GalleryTabsSmall, GalleryTabsTrack, GalleryTabsBadges, GalleryTableSelectable, GalleryTextareaCount, GalleryToastAction };
  const Component = refinements[name as keyof typeof refinements] ?? galleryDemos[name as keyof typeof galleryDemos] ?? demos[name as keyof typeof demos];
  if (Component) hydrateRoot(root, createElement(Component), { identifierPrefix: `area-${name.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()}-` });
}
