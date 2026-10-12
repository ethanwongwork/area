/** Toggletip gallery specimens: one variant per tile. docs/specs/toggletip.md. */
import { Link, Toggletip, Tooltip } from "@area/react";

/* A label on the UI type, as Field's, and its button 4 after it (ChatGPT 4; Field's label gap). */
const ui = { fontSize: "var(--area-ui-size)", lineHeight: "var(--area-ui-leading)" };
const row = { ...ui, display: "inline-flex", alignItems: "center", gap: "var(--area-space-4)" };
const caption = { ...row, color: "var(--area-fg-muted)", fontSize: "var(--area-text-xs-size)", lineHeight: "var(--area-text-xs-leading)" };
const note = "Members can find this page in search. Guests still need an invite.";

export const GalleryToggletip = () => <span style={row}>Workspace visibility<Toggletip content={note} /></span>;
export const GalleryToggletipSm = () => <span style={caption}>Billed yearly<Toggletip size="sm" content="Charged once a year from the day you upgrade. Cancel any time before it renews." /></span>;
export const GalleryToggletipHelp = () => <span style={row}>Export scale<Toggletip icon="help" content="Multiplies every exported image. 2x suits most high-density screens." /></span>;
export const GalleryToggletipLink = () => (
  <span style={row}>Two-step verification<Toggletip content={<>Asks for a code from your phone at each new sign-in. <Link ink="inherit" href="#gallery-toggletip-content-link">How it works</Link></>} /></span>
);
/* In running text the button takes the line box's top, so a label that wraps keeps it on its last line. */
export const GalleryToggletipWrapped = () => (
  <p style={{ ...ui, margin: 0, maxInlineSize: "calc(var(--area-space-96) * 2)" }}>Allow members to invite guests from outside David Tee's studio <Toggletip label="About guest invites" content="Guests see only the pages they are invited to." /></p>
);
/* The open note at rest, centred 4 above its button (Tooltip's offset), as Tooltip's own tile shows its surface. */
export const GalleryToggletipOpen = () => (
  <div style={{ ...ui, display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--area-space-4)" }}>
    <Tooltip className="area-toggletip__surface">{note}</Tooltip>
    <Toggletip content={note} />
  </div>
);
