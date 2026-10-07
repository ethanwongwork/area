/** Drawer and confirm dialog gallery specimens: one variant per tile. docs/specs/drawer.md, confirm-dialog.md. */
import { useState } from "react";
import type { CSSProperties } from "react";
import { Button, ConfirmDialog, Drawer, Field, Input } from "@area/react";

/* A page-shaped frame so an inline drawer sits against its edge, as it would against the screen. */
const stage: CSSProperties = { position: "relative", inlineSize: 440, blockSize: 300, overflow: "hidden", borderRadius: 8, background: "var(--area-bg-subtle, var(--area-bg-component))" };

const ProfileFields = () => <div style={{ display: "grid", gap: 16 }}>
  <Field label="Name"><Input fullWidth defaultValue="David Tee" /></Field>
  <Field label="Username"><Input fullWidth defaultValue="@davidtee" /></Field>
</div>;
const footer = <><Button variant="soft" tone="neutral">Cancel</Button><Button>Save changes</Button></>;

export const GalleryDrawer = () => (
  <div style={stage}><Drawer inline title="Edit profile" description="Make changes to your profile here." footer={footer}><ProfileFields /></Drawer></div>
);
export const GalleryDrawerStart = () => (
  <div style={stage}><Drawer inline side="start" title="Edit profile" description="Make changes to your profile here." footer={footer}><ProfileFields /></Drawer></div>
);
export const GalleryDrawerBottom = () => (
  <div style={stage}><Drawer inline side="bottom" title="Edit profile" description="Make changes to your profile here." footer={footer} /></div>
);
export const GalleryDrawerNoClose = () => (
  <div style={stage}><Drawer inline showCloseButton={false} title="Edit profile" footer={footer}><ProfileFields /></Drawer></div>
);
/* shadcn's Sheet: the primary action first, both full width. */
export const GalleryDrawerStacked = () => (
  <div style={stage}><Drawer inline actions="stacked" title="Edit profile" description="Make changes to your profile here."
    footer={<><Button>Save changes</Button><Button variant="soft" tone="neutral">Cancel</Button></>}><ProfileFields /></Drawer></div>
);
/* Notion's side peek: no scrim, the page behind stays usable; Escape or the close control closes it. */
export const GalleryDrawerNonModal = () => {
  const [open, setOpen] = useState(false);
  return <Drawer modal={false} open={open} onOpenChange={setOpen} trigger={<Button variant="outline">Open side panel</Button>}
    title="Project notes" description="Opened beside the page."><ProfileFields /></Drawer>;
};
export const GalleryDrawerModal = () => {
  const [open, setOpen] = useState(false);
  return <Drawer open={open} onOpenChange={setOpen} trigger={<Button variant="outline">Open drawer</Button>}
    title="Edit profile" description="Make changes to your profile here."
    footer={<><Button variant="soft" tone="neutral" onClick={() => setOpen(false)}>Cancel</Button><Button onClick={() => setOpen(false)}>Save changes</Button></>}>
    <ProfileFields />
  </Drawer>;
};
export const GalleryDrawerMd = () => {
  const [open, setOpen] = useState(false);
  return <Drawer size="md" open={open} onOpenChange={setOpen} trigger={<Button variant="outline">Open md drawer</Button>}
    title="Edit profile" description="Make changes to your profile here."><ProfileFields /></Drawer>;
};

/* ChatGPT's "Delete chat?" (captured 2026-10-05, then cancelled). */
export const GalleryConfirmDialog = () => (
  <ConfirmDialog inline tone="danger" title="Delete chat?" description="This will permanently delete Project notes. This can't be undone." confirmLabel="Delete chat" />
);
export const GalleryConfirmDialogNeutral = () => (
  <ConfirmDialog inline title="Leave without saving?" description="Your changes to this page will be lost." confirmLabel="Leave" cancelLabel="Keep editing" />
);
export const GalleryConfirmDialogModal = () => (
  <ConfirmDialog tone="danger" trigger={<Button variant="soft" tone="danger">Delete chat</Button>}
    title="Delete chat?" description="This will permanently delete Project notes. This can't be undone." confirmLabel="Delete chat"
    onConfirm={() => new Promise(resolve => setTimeout(resolve, 800))} />
);
