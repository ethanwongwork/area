/** Table of contents gallery specimens. docs/specs/table-of-contents.md. */
import type { CSSProperties } from "react";
import { ScrollArea, TableOfContents } from "@area/react";

const sections = [
  { id: "gallery-toc-early", label: "Early life and education" },
  { id: "gallery-toc-career", label: "Career", children: [
    { id: "gallery-toc-studio", label: "Studio" },
    { id: "gallery-toc-teaching", label: "Teaching" },
  ] },
  { id: "gallery-toc-work", label: "Selected work" },
  { id: "gallery-toc-references", label: "References" },
];
const side: CSSProperties = { inlineSize: "calc(var(--area-space-96) * 2.5)" };

export const GalleryTableOfContents = () => <TableOfContents style={side} items={sections} current="gallery-toc-career" />;
/* Only the section being read shows its subsections, as Wikipedia. */
export const GalleryTableOfContentsCollapse = () => <TableOfContents style={side} items={sections} collapse current="gallery-toc-work" />;
/* A first row back to the top. */
export const GalleryTableOfContentsTop = () => <TableOfContents style={side} items={sections} top={{ label: "(Top)", id: "gallery-toc-top" }} current="gallery-toc-top" />;

/* It follows the page: scroll the article and the section being read is marked. */
const page = (id: string, title: string) => (
  <section key={id}>
    <h3 id={id} style={{ margin: "0 0 var(--area-space-8)", fontSize: "var(--area-text-md-size)", lineHeight: "var(--area-text-md-leading)", fontWeight: "var(--area-weight-strong)" }}>{title}</h3>
    <p style={{ margin: "0 0 var(--area-space-24)", color: "var(--area-fg-muted)" }}>David Tee studied industrial design before moving to interface work. The studio's projects ran from type to hardware, and each one began with a measured study of what people already used.</p>
  </section>
);
export const GalleryTableOfContentsScroll = () => {
  const ids = [["gallery-tocs-a", "Early life"], ["gallery-tocs-b", "Studio"], ["gallery-tocs-c", "Teaching"], ["gallery-tocs-d", "Selected work"]] as const;
  return (
    <div style={{ display: "flex", gap: "var(--area-space-24)", inlineSize: "calc(var(--area-space-96) * 6)", maxInlineSize: "100%" }}>
      <TableOfContents style={side} items={ids.map(([id, label]) => ({ id, label }))} />
      <ScrollArea style={{ flex: 1, minInlineSize: 0, blockSize: "calc(var(--area-space-96) * 2)" }} viewportProps={{ "aria-label": "Article", tabIndex: 0 }}>{ids.map(([id, title]) => page(id, title))}</ScrollArea>
    </div>
  );
};
