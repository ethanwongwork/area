/** Toggletip gallery specimens: one variant per tile. docs/specs/toggletip.md. */
import { Link, Toggletip, Tooltip } from "@area/react";

/* A label on the UI type, as Field's, and its button 4 after it (ChatGPT 4; Field's label gap). */
const ui = { fontSize: "var(--area-ui-size)", lineHeight: "var(--area-ui-leading)" };
const row = { ...ui, display: "inline-flex", alignItems: "center", gap: "var(--area-space-4)" };
const caption = { ...row, color: "var(--area-fg-muted)", fontSize: "var(--area-text-xs-size)", lineHeight: "var(--area-text-xs-leading)" };
const note = "Body text";

export const GalleryToggletip = () => <span style={row}>Label<Toggletip content={note} /></span>;
export const GalleryToggletipSm = () => <span style={caption}>Caption<Toggletip size="sm" content={note} /></span>;
export const GalleryToggletipHelp = () => <span style={row}>Label<Toggletip icon="help" content={note} /></span>;
export const GalleryToggletipLink = () => (
  <span style={row}>Label<Toggletip content={<>Body text. <Link ink="inherit" href="#gallery-toggletip-content-link">Link</Link></>} /></span>
);
/* In running text the button takes the line box's top, so a label that wraps keeps it on its last line. */
export const GalleryToggletipWrapped = () => (
  <p style={{ ...ui, margin: 0, maxInlineSize: "calc(var(--area-space-96) * 2)" }}>Label that wraps onto a second line <Toggletip content={note} /></p>
);
/* The open note at rest, centred 4 above its button (Tooltip's offset), as Tooltip's own tile shows its surface. */
export const GalleryToggletipOpen = () => (
  <div style={{ ...ui, display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--area-space-4)" }}>
    <Tooltip className="area-toggletip__surface">{note}</Tooltip>
    <Toggletip content={note} />
  </div>
);
