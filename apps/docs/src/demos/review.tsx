import type { CSSProperties, ReactNode } from "react";

/*
 * Pass review rows for the gallery's GalleryReview<Name> demos: each change in its own row
 * with its basis, before and after, at 1x and at 3x (or another scale for large
 * specimens; 1 shows only the 1x copy). Not a demo module itself.
 */
export const reviewText: CSSProperties = { margin: 0, fontSize: "var(--area-control-xs-text)", lineHeight: "var(--area-control-xs-leading)", color: "var(--area-fg-muted)" };
export const ReviewPair = ({ title, basis, before, after, scale = 3 }: { title: string; basis: string; before: ReactNode; after: ReactNode; scale?: number }) => (
  <section style={{ display: "grid", gap: "var(--area-space-8)" }}>
    <p style={{ ...reviewText, color: "var(--area-fg-default)", fontSize: "var(--area-control-md-text)", lineHeight: "var(--area-control-md-leading)" }}>{title}</p>
    <p style={reviewText}>{basis}</p>
    {/* Side by side where both fit at 3x; otherwise After wraps under Before rather than clipping. */}
    <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--area-space-16) var(--area-space-32)" }}>
      {([["Before", before], ["After", after]] as const).map(([label, node]) => (
        <div key={label} style={{ display: "grid", gap: "var(--area-space-12)", alignContent: "start", flex: "1 1 auto" }}>
          <p style={reviewText}>{label}</p>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "var(--area-space-12)" }}>{node}</div>
          {scale > 1 && <div style={{ zoom: scale, display: "flex", flexWrap: "wrap", alignItems: "center", gap: "var(--area-space-8)" }}>{node}</div>}
        </div>
      ))}
    </div>
  </section>
);
