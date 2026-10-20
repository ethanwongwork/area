/** Table of contents gallery specimens. docs/specs/table-of-contents.md. */
import type { CSSProperties } from "react";
import { ScrollArea, TableOfContents } from "@area/react";

const sections = [
  { id: "gallery-toc-early", label: "Section one" },
  { id: "gallery-toc-career", label: "Section two", children: [
    { id: "gallery-toc-studio", label: "Subsection one" },
    { id: "gallery-toc-teaching", label: "Subsection two" },
  ] },
  { id: "gallery-toc-work", label: "Section three" },
  { id: "gallery-toc-references", label: "Section four" },
];
const side: CSSProperties = { inlineSize: "calc(var(--area-space-96) * 2.5)" };

export const GalleryTableOfContents = () => <TableOfContents style={side} items={sections} value="gallery-toc-career" />;
/* Sections only, without their subsections. */
export const GalleryTableOfContentsLevels = () => <TableOfContents style={side} items={sections} levels={1} value="gallery-toc-work" />;
/* A first row back to the top. */
export const GalleryTableOfContentsTop = () => <TableOfContents style={side} items={sections} top={{ label: "Overview", id: "gallery-toc-top" }} value="gallery-toc-top" />;

/* It follows the page: scroll the article and the section being read is marked. */
const page = (id: string, title: string) => (
  <section key={id}>
    <h3 id={id} style={{ margin: "0 0 var(--area-space-8)", fontSize: "var(--area-text-md-size)", lineHeight: "var(--area-text-md-leading)", fontWeight: "var(--area-weight-strong)" }}>{title}</h3>
    <p style={{ margin: "0 0 var(--area-space-24)", color: "var(--area-fg-muted)" }}>Body text that wraps onto a second line. Body text that continues the paragraph. Body text that continues the paragraph. Body text that continues the paragraph.</p>
  </section>
);
export const GalleryTableOfContentsScroll = () => {
  const ids = [["gallery-tocs-a", "Section one"], ["gallery-tocs-b", "Section two"], ["gallery-tocs-c", "Section three"], ["gallery-tocs-d", "Section four"]] as const;
  return (
    <div style={{ display: "flex", gap: "var(--area-space-24)", inlineSize: "calc(var(--area-space-96) * 6)", maxInlineSize: "100%" }}>
      <TableOfContents style={side} items={ids.map(([id, label]) => ({ id, label }))} />
      <ScrollArea style={{ flex: 1, minInlineSize: 0, blockSize: "calc(var(--area-space-96) * 2)" }} viewportProps={{ "aria-label": "Article", tabIndex: 0 }}>{ids.map(([id, title]) => page(id, title))}</ScrollArea>
    </div>
  );
};
