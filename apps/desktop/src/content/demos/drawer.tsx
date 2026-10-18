/** Drawer and confirm dialog gallery specimens: one variant per tile. docs/specs/drawer.md, confirm-dialog.md. */
import { useState } from "react";
import type { CSSProperties } from "react";
import { Button, ConfirmDialog, Drawer, Field, Input } from "@area/react";

/* A page-shaped frame so an inline drawer sits against its edge, as it would against the screen. */
const stage: CSSProperties = { inlineSize: 440, blockSize: 300 };

const ProfileFields = () => <div style={{ display: "grid", gap: "var(--area-space-16)" }}>
  <Field label="Label"><Input fullWidth defaultValue="Value" /></Field>
  <Field label="Label"><Input fullWidth defaultValue="Value" /></Field>
</div>;
const footer = <><Button variant="soft" tone="neutral">Cancel</Button><Button>Action</Button></>;

export const GalleryDrawer = () => (
  <div className="docs-edge-stage" style={stage}><Drawer inline title="Title" description="Description" footer={footer}><ProfileFields /></Drawer></div>
);
export const GalleryDrawerStart = () => (
  <div className="docs-edge-stage" style={stage}><Drawer inline side="start" title="Title" description="Description" footer={footer}><ProfileFields /></Drawer></div>
);
export const GalleryDrawerBottom = () => (
  <div className="docs-edge-stage" style={stage}><Drawer inline side="bottom" title="Title" description="Description" footer={footer} /></div>
);
export const GalleryDrawerNoClose = () => (
  <div className="docs-edge-stage" style={stage}><Drawer inline showCloseButton={false} title="Title" footer={footer}><ProfileFields /></Drawer></div>
);
/* shadcn's Sheet: the primary action first, both full width. */
export const GalleryDrawerStacked = () => (
  <div className="docs-edge-stage" style={stage}><Drawer inline actions="stacked" title="Title" description="Description"
    footer={<><Button>Action</Button><Button variant="soft" tone="neutral">Cancel</Button></>}><ProfileFields /></Drawer></div>
);
/* Notion's side peek: no scrim, the page behind stays usable; Escape or the close control closes it. */
export const GalleryDrawerNonModal = () => {
  const [open, setOpen] = useState(false);
  return <Drawer modal={false} open={open} onOpenChange={setOpen} trigger={<Button variant="outline">Open side panel</Button>}
    title="Title" description="Description"><ProfileFields /></Drawer>;
};
export const GalleryDrawerModal = () => {
  const [open, setOpen] = useState(false);
  return <Drawer open={open} onOpenChange={setOpen} trigger={<Button variant="outline">Open drawer</Button>}
    title="Title" description="Description"
    footer={<><Button variant="soft" tone="neutral" onClick={() => setOpen(false)}>Cancel</Button><Button onClick={() => setOpen(false)}>Action</Button></>}>
    <ProfileFields />
  </Drawer>;
};
export const GalleryDrawerMd = () => {
  const [open, setOpen] = useState(false);
  return <Drawer size="md" open={open} onOpenChange={setOpen} trigger={<Button variant="outline">Open md drawer</Button>}
    title="Title" description="Description"><ProfileFields /></Drawer>;
};

/* ChatGPT's "Delete chat?" (captured 2026-10-05, then cancelled). */
export const GalleryConfirmDialog = () => (
  <ConfirmDialog inline tone="danger" title="Title" description="Description" confirmLabel="Delete" />
);
export const GalleryConfirmDialogNeutral = () => (
  <ConfirmDialog inline title="Title" description="Description" confirmLabel="Action" cancelLabel="Cancel" />
);
export const GalleryConfirmDialogModal = () => (
  <ConfirmDialog tone="danger" trigger={<Button variant="soft" tone="danger">Delete</Button>}
    title="Title" description="Description" confirmLabel="Delete"
    onConfirm={() => new Promise(resolve => setTimeout(resolve, 800))} />
);
