/** Description list gallery specimens: one variant per tile. docs/specs/description-list.md. */
import { Avatar, Badge, DescriptionList, DescriptionListItem, Link } from "@area/react";
import { PilotCalendarIcon, PilotCircleDashedIcon, PilotFolderIcon, PilotPersonIcon } from "../../../../docs/src/pilot-icons.tsx";

/* A page's properties (Notion's columns) and an account's facts (ChatGPT's settings card). */
const page = { inlineSize: "calc(var(--area-space-96) * 4)", maxInlineSize: "100%" };

export const GalleryDescriptionList = () => (
  <DescriptionList style={page}>
    <DescriptionListItem term="Status" icon={<PilotCircleDashedIcon />}>In progress</DescriptionListItem>
    <DescriptionListItem term="Owner" icon={<PilotPersonIcon />}>David Tee</DescriptionListItem>
    <DescriptionListItem term="Due" icon={<PilotCalendarIcon />}>October 14, 2026</DescriptionListItem>
    <DescriptionListItem term="Project" icon={<PilotFolderIcon />}>Website launch</DescriptionListItem>
  </DescriptionList>
);
export const GalleryDescriptionListNoIcons = () => (
  <DescriptionList style={page}>
    <DescriptionListItem term="Format">PNG</DescriptionListItem>
    <DescriptionListItem term="Dimensions">1440 × 900</DescriptionListItem>
    <DescriptionListItem term="Size">2.4 MB</DescriptionListItem>
  </DescriptionList>
);
/* Values that are components: a Badge, a person and a Link. */
export const GalleryDescriptionListRich = () => (
  <DescriptionList style={page}>
    <DescriptionListItem term="Status" icon={<PilotCircleDashedIcon />}><Badge>In review</Badge></DescriptionListItem>
    <DescriptionListItem term="Owner" icon={<PilotPersonIcon />}><span style={{ display: "inline-flex", alignItems: "center", gap: "var(--area-space-6)" }}><Avatar size="sm" fallback="D" alt="" />David Tee</span></DescriptionListItem>
    <DescriptionListItem term="Brief" icon={<PilotFolderIcon />}><Link href="#gallery-description-list-content-rich">Launch brief</Link></DescriptionListItem>
  </DescriptionList>
);
export const GalleryDescriptionListJustified = () => (
  <DescriptionList style={page} layout="justified">
    <DescriptionListItem term="Plan">Plus</DescriptionListItem>
    <DescriptionListItem term="Username">@davidtee</DescriptionListItem>
    <DescriptionListItem term="Member since">March 2024</DescriptionListItem>
  </DescriptionList>
);
export const GalleryDescriptionListDivided = () => (
  <DescriptionList style={page} divided>
    <DescriptionListItem term="Format">PNG</DescriptionListItem>
    <DescriptionListItem term="Dimensions">1440 × 900</DescriptionListItem>
    <DescriptionListItem term="Size">2.4 MB</DescriptionListItem>
  </DescriptionList>
);
/* ChatGPT's account card: justified rows, divided, in a frame. */
export const GalleryDescriptionListFramed = () => (
  <DescriptionList style={page} layout="justified" divided framed>
    <DescriptionListItem term="Plan">Plus</DescriptionListItem>
    <DescriptionListItem term="Username">@davidtee</DescriptionListItem>
    <DescriptionListItem term="Member since">March 2024</DescriptionListItem>
  </DescriptionList>
);
