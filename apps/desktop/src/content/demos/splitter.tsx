/** Splitter gallery specimens: one variant per tile. docs/specs/splitter.md (components audit N6, 2026-11-07). */
import { useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { Splitter } from "@area/react";

/* A framed area the two regions share; each region names itself in muted text, padded as a panel's body. */
const frame: CSSProperties = {
  inlineSize: "calc(var(--area-space-96) * 4)", maxInlineSize: "100%", blockSize: "calc(var(--area-space-40) * 4)",
  border: "var(--area-border-width) solid var(--area-edge-regions)", borderRadius: "var(--area-radius-container)", overflow: "hidden",
};
const Region = ({ children }: { children: ReactNode }) => (
  <div style={{ blockSize: "100%", padding: "var(--area-space-12)", boxSizing: "border-box", color: "var(--area-fg-muted)" }}>{children}</div>
);

export const GallerySplitter = () => (
  <Splitter style={frame} defaultSize={144} handleLabel="Resize Item one">
    <Region>Item one</Region>
    <Region>Item two</Region>
  </Splitter>
);
export const GallerySplitterVertical = () => (
  <Splitter style={frame} orientation="vertical" defaultSize={64} handleLabel="Resize Item one">
    <Region>Item one</Region>
    <Region>Item two</Region>
  </Splitter>
);
/* side="end": the second region holds the size (an inspector beside a canvas); the first takes the rest. */
export const GallerySplitterEnd = () => (
  <Splitter style={frame} side="end" defaultSize={144} handleLabel="Resize Item two">
    <Region>Item one</Region>
    <Region>Item two</Region>
  </Splitter>
);
/* Limits: 96 to 240. At a limit the cursor points the one way left to go; Home and End go to the limits; a double-click
   puts 144 back. The size is shown as the region's words, and said by the handle as its value. */
export const GallerySplitterLimits = () => {
  const [size, setSize] = useState(144);
  return (
    <Splitter style={frame} size={size} onSizeChange={next => setSize(next)} minSize={96} maxSize={240} defaultSize={144} handleLabel="Resize Item one">
      <Region>{`${size}`}</Region>
      <Region>Item two</Region>
    </Splitter>
  );
};
