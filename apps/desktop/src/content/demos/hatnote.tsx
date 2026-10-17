/** Hatnote gallery specimens. docs/specs/hatnote.md. */
import { Hatnote, Link } from "@area/react";

export const GalleryHatnote = () => (
  <div style={{ inlineSize: "calc(var(--area-space-96) * 4)", maxInlineSize: "100%" }}>
    <Hatnote>For the type designer, see <Link ink="blue" href="#gallery-hatnote">David Tee (typographer)</Link>.</Hatnote>
    <p style={{ margin: 0 }}>David Tee is a designer known for type, design systems and hardware.</p>
  </div>
);
