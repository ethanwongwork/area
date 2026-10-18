/** Infobox gallery specimens. docs/specs/infobox.md. */
import { Infobox, InfoboxRow, InfoboxRows, InfoboxSection, InlineList, Link } from "@area/react";

const photo = <img src="images/david-tee.jpg" alt="David Tee" width={180} height={180} style={{ objectFit: "cover" }} />;

export const GalleryInfobox = () => (
  <Infobox title="Title" media={photo} caption="Caption">
    <InfoboxSection title="Section one">
      <InfoboxRow label="Label">Value<br />Value</InfoboxRow>
      <InfoboxRow label="Label"><Link ink="blue" href="#gallery-infobox">Link</Link></InfoboxRow>
      <InfoboxRow label="Label">Value</InfoboxRow>
    </InfoboxSection>
    <InfoboxSection title="Section two">
      <InfoboxRow label="Label"><InlineList><span>Item one</span><span>Item two</span><span>Item three</span></InlineList></InfoboxRow>
    </InfoboxSection>
  </Infobox>
);
/* Facts alone, without an image or sections. */
export const GalleryInfoboxRows = () => (
  <Infobox title="Title" subtitle="Subtitle">
    <InfoboxRows>
      <InfoboxRow label="Label">Value</InfoboxRow>
      <InfoboxRow label="Label">Value</InfoboxRow>
      <InfoboxRow label="Label">Value</InfoboxRow>
    </InfoboxRows>
  </Infobox>
);
