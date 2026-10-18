/** Reference list gallery specimens: one variant per tile. docs/specs/reference-list.md. */
import type { CSSProperties } from "react";
import { Citation, ReferenceList, ReferenceListItem } from "@area/react";

const column: CSSProperties = { inlineSize: "calc(var(--area-space-96) * 5)", maxInlineSize: "100%" };
const source = (n: number, hash: string, extra = {}) => (
  <ReferenceListItem key={n} source="Publisher" title={`Article title ${n}`} href={hash} description="what the source covers" {...extra} />
);

export const GalleryReferenceList = () => (
  <ReferenceList title="Sources" style={column}>{[1, 2, 3].map(n => source(n, "#gallery-reference-list"))}</ReferenceList>
);
/* ChatGPT's bulleted sources. */
export const GalleryReferenceListBullet = () => (
  <ReferenceList title="Sources" marker="bullet" style={column}>{[1, 2, 3].map(n => source(n, "#gallery-reference-list-bullet"))}</ReferenceList>
);
/* Ten or more: one number column, so every note's text starts on one edge. */
export const GalleryReferenceListLong = () => (
  <ReferenceList title="Sources" start={8} style={column}>{[8, 9, 10, 11].map(n => source(n, "#gallery-reference-list-long"))}</ReferenceList>
);
/* With the footnotes that point at it: each number goes to its note, each return arrow comes back. */
export const GalleryReferenceListWithFootnotes = () => (
  <div style={{ ...column, display: "flex", flexDirection: "column", gap: "var(--area-space-16)" }}>
    <p style={{ margin: 0 }}>A sentence that cites a source<Citation variant="footnote" id="gallery-cite-f1" href="#gallery-ref-f1" label="1" /> and another.<Citation variant="footnote" id="gallery-cite-f2" href="#gallery-ref-f2" label="2" /></p>
    <ReferenceList title="Notes">
      <ReferenceListItem id="gallery-ref-f1" source="Publisher" title="Article title 1" href="#gallery-ref-f1" backlinks={["gallery-cite-f1"]} />
      <ReferenceListItem id="gallery-ref-f2" source="Publisher" title="Article title 2" href="#gallery-ref-f2" backlinks={["gallery-cite-f2", "gallery-cite-f2b"]} />
    </ReferenceList>
  </div>
);
/* The note a footnote led to carries the selection rail. */
export const GalleryReferenceListHighlighted = () => (
  <ReferenceList aria-label="Notes" start={12} style={column}>
    {[12, 13, 14].map(n => source(n, `#gallery-ref-h${n}`, { id: `gallery-ref-h${n}`, backlinks: [`gallery-cite-h${n}`], highlighted: n === 13 }))}
  </ReferenceList>
);
