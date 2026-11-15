// List selection fixture: List box (roving focus), Custom select and Combobox (active descendant), long lists for
// scroll-into-view, and a Command palette for the IME guard. window.__log records choices and commands.
import { useState } from "react";
import { createRoot } from "react-dom/client";
import { Button, ListBox, ListBoxItem, CustomSelect, Combobox, CommandPalette } from "@area/react";
import "@area/styles/area.css";

window.__log = [];
const COLORS = ["Amber", "Black", "Blue", "Brown", "Cyan", "Coral", "Green", "Red", "Violet"];
const LONG = Array.from({ length: 40 }, (_, i) => `Item ${String(i + 1).padStart(2, "0")}`);
const opts = list => list.map(label => ({ value: label.toLowerCase().replace(/\s+/g, "-"), label }));

function App() {
  const [palette, setPalette] = useState(false);
  return <>
    <Button id="start">Start</Button>
    <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
      <ListBox id="lb" aria-label="Color" defaultValue="blue" onValueChange={v => window.__log.push("lb:" + v)} style={{ width: 160 }}>
        {COLORS.map(c => <ListBoxItem key={c} value={c.toLowerCase()} disabled={c === "Cyan"}>{c}</ListBoxItem>)}
      </ListBox>
      <ListBox id="lb-follow" aria-label="Follow" selectionFollowsFocus defaultValue="amber" style={{ width: 160 }}>
        {COLORS.map(c => <ListBoxItem key={c} value={c.toLowerCase()}>{c}</ListBoxItem>)}
      </ListBox>
      <ListBox id="lb-long" aria-label="Long" style={{ width: 160, maxBlockSize: 120, overflow: "auto" }}>
        {LONG.map(c => <ListBoxItem key={c} value={c}>{c}</ListBoxItem>)}
      </ListBox>
    </div>
    <Button id="mid">Middle</Button>
    <div style={{ display: "flex", gap: 24 }}>
      <CustomSelect id="cs" aria-label="Shade" items={opts(COLORS)} defaultValue="blue" onValueChange={v => window.__log.push("cs:" + v)} />
      <CustomSelect id="cs-long" aria-label="Long select" items={opts(LONG)} placeholder="Choose" />
      <Combobox id="cb" aria-label="Paint" items={[...opts(COLORS), { value: "nihongo", label: "にほんご" }]} onValueChange={v => window.__log.push("cb:" + v)} />
      <Combobox id="cb-long" aria-label="Long combobox" items={opts(LONG)} />
    </div>
    <Button id="open-palette" onClick={() => setPalette(true)}>Commands</Button>
    <CommandPalette open={palette} onOpenChange={setPalette} label="Commands" items={[
      { id: "export", label: "Export", onSelect: () => window.__log.push("cmd:export") },
      { id: "nihongo", label: "にほんご", onSelect: () => window.__log.push("cmd:nihongo") },
    ]} />
    <div style={{ blockSize: 1200 }} />
  </>;
}

createRoot(document.getElementById("root")).render(<App />);
requestAnimationFrame(() => requestAnimationFrame(() => { window.__ready = true; }));
