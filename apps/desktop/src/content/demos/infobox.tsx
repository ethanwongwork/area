/** Infobox gallery specimens. docs/specs/infobox.md. */
import { Infobox, InfoboxRow, InfoboxRows, InfoboxSection, InlineList, Link } from "@area/react";

const photo = <img src="images/david-tee.jpg" alt="David Tee" width={180} height={180} style={{ objectFit: "cover" }} />;

export const GalleryInfobox = () => (
  <Infobox title="David Tee" media={photo} caption="David Tee in 2025">
    <InfoboxSection title="Personal details">
      <InfoboxRow label="Born">4 May 1988<br />Wellington, New Zealand</InfoboxRow>
      <InfoboxRow label="Education"><Link ink="blue" href="#gallery-infobox">Victoria University</Link> (BDes)</InfoboxRow>
      <InfoboxRow label="Occupation">Designer</InfoboxRow>
    </InfoboxSection>
    <InfoboxSection title="Work">
      <InfoboxRow label="Known for"><InlineList><span>Type</span><span>Design systems</span><span>Hardware</span></InlineList></InfoboxRow>
    </InfoboxSection>
  </Infobox>
);
/* Facts alone, without an image or sections. */
export const GalleryInfoboxRows = () => (
  <Infobox title="Area" subtitle="Design system">
    <InfoboxRows>
      <InfoboxRow label="Developer">David Tee's studio</InfoboxRow>
      <InfoboxRow label="Written in">TypeScript, CSS</InfoboxRow>
      <InfoboxRow label="Platform">Web, Electron</InfoboxRow>
    </InfoboxRows>
  </Infobox>
);
