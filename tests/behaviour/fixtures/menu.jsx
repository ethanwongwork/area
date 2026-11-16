// Menu fixture: an anchored Menu with a submenu, a Split button's menu and a Context menu, each between plain buttons
// so Tab order and outside presses can be read. window.__log records every chosen row.
import { createRoot } from "react-dom/client";
import { Button, Menu, MenuItem, MenuSub, MenuSeparator, SplitButton, ContextMenu } from "@area/react";
import "@area/styles/area.css";

window.__log = [];
const chose = name => () => window.__log.push(name);

function App() {
  return <>
    <Button id="before" onClick={chose("before")}>Before</Button>
    <div style={{ display: "flex", gap: 16 }}>
      <Menu id="file-menu" trigger={<Button id="trigger">File</Button>}>
        <MenuItem onClick={chose("New file")}>New file</MenuItem>
        <MenuItem onClick={chose("New folder")}>New folder</MenuItem>
        <MenuItem onClick={chose("Open")}>Open</MenuItem>
        <MenuSub id="share-menu" label="Share">
          <MenuItem onClick={chose("Copy link")}>Copy link</MenuItem>
          <MenuItem onClick={chose("Email")}>Email</MenuItem>
          <MenuItem onClick={chose("Invite")}>Invite</MenuItem>
        </MenuSub>
        <MenuItem onClick={chose("Rename")}>Rename</MenuItem>
        <MenuItem onClick={chose("Export")}>Export</MenuItem>
        <MenuItem disabled>Archive</MenuItem>
        <MenuSeparator />
        <MenuItem tone="danger" onClick={chose("Delete")}>Delete</MenuItem>
      </Menu>
      <Button id="after" onClick={chose("after")}>After</Button>
    </div>
    <SplitButton id="split" menuLabel="More save options" onClick={chose("Save")} menu={<>
      <MenuItem onClick={chose("Save as")}>Save as</MenuItem>
      <MenuItem onClick={chose("Save copy")}>Save copy</MenuItem>
      <MenuItem onClick={chose("Save all")}>Save all</MenuItem>
    </>}>Save</SplitButton>
    <ContextMenu menuLabel="Page actions" menu={<>
      <MenuItem onClick={chose("Cut")}>Cut</MenuItem>
      <MenuItem onClick={chose("Copy")}>Copy</MenuItem>
      <MenuItem onClick={chose("Paste")}>Paste</MenuItem>
    </>}>
      <div id="context-area" tabIndex={0} style={{ width: 320, height: 120, border: "1px dashed #999", display: "grid", placeItems: "center" }}>Page</div>
    </ContextMenu>
    <Button id="outside" onClick={chose("outside")} style={{ marginTop: 280 }}>Outside</Button>
  </>;
}

createRoot(document.getElementById("root")).render(<App />);
requestAnimationFrame(() => requestAnimationFrame(() => { window.__ready = true; }));
