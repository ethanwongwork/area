/** Zoom control gallery specimens: one variant per tile. docs/specs/zoom-control.md. */
import { useState } from "react";
import { MenuItem, ZoomControl } from "@area/react";

const shortcuts = { zoomIn: "⌘+", zoomOut: "⌘−", zoomToFit: "⇧1", presets: { 1: "⇧0" } };

export const GalleryZoomControl = () => <ZoomControl defaultValue={0.48} onZoomToFit={() => {}} shortcuts={shortcuts} />;
/* At a preset: its row is checked in the menu. */
export const GalleryZoomControlPreset = () => <ZoomControl defaultValue={1} onZoomToFit={() => {}} shortcuts={shortcuts} />;
export const GalleryZoomControlMd = () => <ZoomControl size="md" defaultValue={0.48} onZoomToFit={() => {}} shortcuts={shortcuts} />;
/* Figma's view toggles after the zoom rows. */
export const GalleryZoomControlView = () => {
  const [grid, setGrid] = useState(true);
  const [rulers, setRulers] = useState(false);
  return (
    <ZoomControl defaultValue={0.48} onZoomToFit={() => {}} shortcuts={shortcuts}>
      <MenuItem checked={grid} onClick={() => setGrid(!grid)}>Item one</MenuItem>
      <MenuItem checked={rulers} shortcut="⇧R" onClick={() => setRulers(!rulers)}>Item two</MenuItem>
    </ZoomControl>
  );
};
export const GalleryZoomControlDisabled = () => <ZoomControl defaultValue={1} disabled />;
