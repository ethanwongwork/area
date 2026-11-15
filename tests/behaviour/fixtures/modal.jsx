// Modal fixture: Dialog, Drawer, Confirm dialog and Command palette, each opened from its own button on a page tall
// enough to scroll, inside a Toaster. Each modal body can raise a toast with an action. window.__log records actions.
import { useState } from "react";
import { createRoot } from "react-dom/client";
import { Button, Dialog, Drawer, ConfirmDialog, CommandPalette, Input, Toaster, useToaster } from "@area/react";
import "@area/styles/area.css";

window.__log = [];
const log = what => () => window.__log.push(what);

function Body({ id }) {
  const toaster = useToaster();
  return <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
    <Input id={`${id}-name`} aria-label="Name" defaultValue="Draft" />
    <Button id={`${id}-toast`} onClick={() => toaster.show({ message: "Saved", actions: <Button id="undo" size="sm" onClick={log("undo")}>Undo</Button> })}>Raise toast</Button>
  </div>;
}
const Footer = ({ id }) => <><Button id={`${id}-cancel`} variant="ghost" onClick={log(`${id}:cancel`)}>Cancel</Button><Button id={`${id}-save`} onClick={log(`${id}:save`)}>Save</Button></>;

function App() {
  const [palette, setPalette] = useState(false);
  return <>
    <Button id="open-dialog-before">Before</Button>
    <Dialog title="Rename" description="Choose a new name." trigger={<Button id="open-dialog">Dialog</Button>} footer={<Footer id="dialog" />}><Body id="dialog" /></Dialog>
    <Drawer title="Details" trigger={<Button id="open-drawer">Drawer</Button>} footer={<Footer id="drawer" />}><Body id="drawer" /></Drawer>
    <ConfirmDialog title="Delete the page?" description="This can't be undone." confirmLabel="Delete" tone="danger" onConfirm={log("confirm:delete")} onCancel={log("confirm:cancel")}
      trigger={<Button id="open-confirm">Confirm</Button>} />
    <Button id="open-palette" onClick={() => setPalette(true)}>Commands</Button>
    <CommandPalette open={palette} onOpenChange={setPalette} label="Commands" items={[
      { id: "export", label: "Export", onSelect: log("cmd:export") },
      { id: "rename", label: "Rename", onSelect: log("cmd:rename") },
    ]} />
    <Button id="after">After</Button>
    <div style={{ blockSize: 2400 }} />
  </>;
}

createRoot(document.getElementById("root")).render(<Toaster><App /></Toaster>);
requestAnimationFrame(() => requestAnimationFrame(() => { window.__ready = true; }));
