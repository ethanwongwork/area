/** Scroll area gallery specimens: one variant per tile. docs/specs/scroll-area.md. */
import { ScrollArea } from "@area/react";

/* A framed region, so the overlay bar has an edge to sit against. */
const frame = {
  blockSize: "calc(var(--area-space-96) * 2)",
  inlineSize: "calc(var(--area-space-96) * 2)",
  border: "var(--area-border-width) solid var(--area-border-subtle)",
  borderRadius: "var(--area-radius-container)",
};
const list = { margin: 0, padding: "var(--area-space-8) var(--area-space-12)", listStyle: "none", display: "grid", gap: "var(--area-space-8)" };
const layers = Array.from({ length: 30 }, (_, index) => `Frame ${index + 1}`);
const Layers = () => <ul style={list}>{layers.map(name => <li key={name}>{name}</li>)}</ul>;

export const GalleryScrollArea = () => <ScrollArea style={frame} viewportProps={{ "aria-label": "Layers" }}><Layers /></ScrollArea>;
export const GalleryScrollAreaScroll = () => <ScrollArea type="scroll" style={frame} viewportProps={{ "aria-label": "Layers" }}><Layers /></ScrollArea>;
export const GalleryScrollAreaAlways = () => <ScrollArea type="always" style={frame} viewportProps={{ "aria-label": "Layers" }}><Layers /></ScrollArea>;
/* A row wider than its region scrolls sideways; the bar runs along the bottom. */
export const GalleryScrollAreaHorizontal = () => (
  <ScrollArea type="always" style={{ ...frame, blockSize: "auto" }} viewportProps={{ "aria-label": "Colors" }}>
    <div style={{ display: "flex", gap: "var(--area-space-8)", padding: "var(--area-space-12)", inlineSize: "max-content" }}>
      {Array.from({ length: 16 }, (_, index) => <div key={index} style={{ inlineSize: "var(--area-space-48)", blockSize: "var(--area-space-48)", borderRadius: "var(--area-radius-small)", background: "var(--area-bg-component-active)" }} />)}
    </div>
  </ScrollArea>
);
/* Both ways: each bar stops short of the other's corner. */
export const GalleryScrollAreaBoth = () => (
  <ScrollArea type="always" style={frame} viewportProps={{ "aria-label": "Table" }}>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(8, var(--area-space-80))", gap: "var(--area-space-8)", padding: "var(--area-space-12)" }}>
      {Array.from({ length: 96 }, (_, index) => <span key={index}>Cell {index + 1}</span>)}
    </div>
  </ScrollArea>
);
