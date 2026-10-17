/** Reference list gallery specimens: one variant per tile. docs/specs/reference-list.md. */
import type { CSSProperties } from "react";
import { Citation, Link, ReferenceList, ReferenceListItem } from "@area/react";

const column: CSSProperties = { inlineSize: "calc(var(--area-space-96) * 4)", maxInlineSize: "100%" };

export const GalleryReferenceList = () => (
  <ReferenceList style={column}>
    <ReferenceListItem id="gallery-ref-1" backlinks={["gallery-cite-1"]}><Link ink="blue" href="#gallery-ref-1">"How laser projectors work"</Link>. <i>Projector Guide</i>. Retrieved 12 March 2026.</ReferenceListItem>
    <ReferenceListItem id="gallery-ref-2" backlinks={["gallery-cite-2a", "gallery-cite-2b", "gallery-cite-2c"]}>David Tee (2025). <i>The projector buyer's handbook</i>. Design Systems Press. p. 41.</ReferenceListItem>
    <ReferenceListItem id="gallery-ref-3" backlinks={["gallery-cite-3"]}>"Brightness over time". <i>Display Lab</i>. 4 June 2025.</ReferenceListItem>
  </ReferenceList>
);
/* Long lists in columns 27em wide, as Wikipedia's. */
export const GalleryReferenceListColumns = () => (
  <ReferenceList columns style={{ inlineSize: "calc(var(--area-space-96) * 7)", maxInlineSize: "100%" }}>
    {["How laser projectors work", "Brightness over time", "Lamp life compared", "Choosing a screen", "Short-throw lenses", "Colour accuracy"].map((title, index) => (
      <ReferenceListItem key={title} id={`gallery-ref-col-${index}`} backlinks={[`gallery-cite-col-${index}`]}>"{title}". <i>Projector Guide</i>. 2026.</ReferenceListItem>
    ))}
  </ReferenceList>
);
/* The note a footnote led to, marked with the selected fill. */
export const GalleryReferenceListHighlighted = () => (
  <ReferenceList style={column} start={12}>
    <ReferenceListItem id="gallery-ref-h12" backlinks={["gallery-cite-h12"]}>"Brightness over time". <i>Display Lab</i>. 4 June 2025.</ReferenceListItem>
    <ReferenceListItem id="gallery-ref-h13" backlinks={["gallery-cite-h13"]} highlighted>"How laser projectors work". <i>Projector Guide</i>. Retrieved 12 March 2026.</ReferenceListItem>
    <ReferenceListItem id="gallery-ref-h14" backlinks={["gallery-cite-h14"]}>"Lamp life compared". <i>Projector Guide</i>. 2026.</ReferenceListItem>
  </ReferenceList>
);
/* With the footnotes that point at it: each number goes to its note, each ↑ comes back. */
export const GalleryReferenceListWithFootnotes = () => (
  <div style={{ ...column, display: "flex", flexDirection: "column", gap: "var(--area-space-16)" }}>
    <p style={{ margin: 0 }}>Laser projectors keep their brightness for years<Citation variant="footnote" id="gallery-cite-f1" href="#gallery-ref-f1" label="1" /> and need no warm-up.<Citation variant="footnote" id="gallery-cite-f2" href="#gallery-ref-f2" label="2" /></p>
    <ReferenceList>
      <ReferenceListItem id="gallery-ref-f1" backlinks={["gallery-cite-f1"]}>"Brightness over time". <i>Display Lab</i>. 4 June 2025.</ReferenceListItem>
      <ReferenceListItem id="gallery-ref-f2" backlinks={["gallery-cite-f2"]}>"How laser projectors work". <i>Projector Guide</i>. 2026.</ReferenceListItem>
    </ReferenceList>
  </div>
);
