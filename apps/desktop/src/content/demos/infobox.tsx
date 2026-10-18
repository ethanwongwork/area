/** Infobox gallery specimens: one variant per tile. docs/specs/infobox.md. */
import type { CSSProperties } from "react";
import { MoreHorizontalIcon } from "@area/icons";
import { Avatar, Button, Infobox, InfoboxRow, InfoboxRows, InfoboxSection, Link } from "@area/react";

const side: CSSProperties = { inlineSize: "calc(var(--area-space-96) * 3)", maxInlineSize: "100%" };
const rows = (hash: string) => (
  <>
    <InfoboxRow label="Label">Value</InfoboxRow>
    <InfoboxRow label="Label">Value that wraps onto a second line</InfoboxRow>
    <InfoboxRow label="Label"><Link variant="standalone" href={hash}>Link</Link></InfoboxRow>
  </>
);

export const GalleryInfobox = () => (
  <Infobox style={side} title="Title" subtitle="Description" media={<Avatar size="lg" src="images/david-tee.jpg" fallback="DT" alt="David Tee" />}>
    <InfoboxSection title="Section">{rows("#gallery-infobox")}</InfoboxSection>
    <InfoboxSection title="Section">
      <InfoboxRow label="Label">Value</InfoboxRow>
      <InfoboxRow label="Label">Value</InfoboxRow>
    </InfoboxSection>
  </Infobox>
);
/* Facts alone, without media or sections. */
export const GalleryInfoboxRows = () => (
  <Infobox style={side} title="Title" subtitle="Description"><InfoboxRows>{rows("#gallery-infobox-rows")}</InfoboxRows></Infobox>
);
/* Labels above their values, for a narrow column. */
export const GalleryInfoboxStacked = () => (
  <Infobox layout="stacked" style={{ inlineSize: "calc(var(--area-space-96) * 2)" }} title="Title" subtitle="Description">
    <InfoboxRows>{rows("#gallery-infobox-stacked")}</InfoboxRows>
  </Infobox>
);
/* One action at the end of the title row. */
export const GalleryInfoboxAction = () => (
  <Infobox style={side} title="Title" subtitle="Description"
    action={<Button size="sm" variant="ghost" tone="neutral" iconOnly aria-label="More options" icon={<MoreHorizontalIcon />} />}>
    <InfoboxRows>{rows("#gallery-infobox-action")}</InfoboxRows>
  </Infobox>
);
/* In Card's frame, for a page where it needs to stand apart. */
export const GalleryInfoboxFramed = () => (
  <Infobox framed style={side} title="Title" subtitle="Description"><InfoboxRows>{rows("#gallery-infobox-framed")}</InfoboxRows></Infobox>
);
