/** Hatnote gallery specimens. docs/specs/hatnote.md. */
import { Hatnote, Link } from "@area/react";

export const GalleryHatnote = () => (
  <div style={{ inlineSize: "calc(var(--area-space-96) * 4)", maxInlineSize: "100%" }}>
    <Hatnote>For other uses, see <Link ink="blue" href="#gallery-hatnote">Title</Link>.</Hatnote>
    <p style={{ margin: 0 }}>Body text.</p>
  </div>
);
