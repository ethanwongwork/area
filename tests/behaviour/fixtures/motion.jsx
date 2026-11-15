// Motion fixture (docs/MOTION.md; plan A5.1–A5.7): every surface whose enter and exit the motion suite samples, a menu
// for the list highlight, and a solid and a ghost Button for the press. ⌘K opens the Command palette by shortcut.
// window.__probe(selector) reads an element's resting values and its running CSS transitions; window.__sample(selector,
// ms) records opacity, scale and translate on every frame.
import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { Button, Menu, MenuItem, Popover, PopoverBody, Tooltip, CustomSelect, Dialog, Drawer, CommandPalette, Toaster, useToaster, Progress } from "@area/react";
import "@area/styles/area.css";

window.__log = [];
const COLORS = ["Amber", "Blue", "Green", "Red"].map(label => ({ value: label.toLowerCase(), label }));

window.__probe = selector => {
  const el = document.querySelector(selector);
  if (!el) return null;
  const s = getComputedStyle(el);
  const transitions = el.getAnimations().filter(a => a.transitionProperty).map(a => ({
    property: a.transitionProperty, duration: a.effect.getTiming().duration, easing: a.effect.getTiming().easing,
  }));
  return { opacity: s.opacity, scale: s.scale, translate: s.translate, background: s.backgroundColor, transitions };
};
// Every transition the browser starts, as it starts (transitionrun), with its real duration and curve: a short exit can
// finish before a later read, so the record is kept.
window.__runs = [];
document.addEventListener("transitionrun", event => {
  const el = event.target;
  const a = el.getAnimations().find(x => x.transitionProperty === event.propertyName);
  window.__runs.push({ el, property: event.propertyName, duration: a?.effect.getTiming().duration, easing: a?.effect.getTiming().easing });
}, true);
window.__ran = (selector, property) => window.__runs.filter(r => r.el.matches(selector) && (!property || r.property === property)).map(({ el, ...rest }) => rest);
window.__sample = (selector, ms) => new Promise(resolve => {
  const frames = [], t0 = performance.now();
  const tick = () => {
    const el = document.querySelector(selector);
    const t = performance.now() - t0;
    if (el) { const s = getComputedStyle(el); frames.push({ t: Math.round(t), opacity: +s.opacity, scale: s.scale, translate: s.translate, open: el.matches(":popover-open, [open]") }); }
    if (t < ms) requestAnimationFrame(tick); else resolve(frames);
  };
  tick();
});

function Toasts() {
  const toaster = useToaster();
  return <Button id="raise-toast" onClick={() => toaster.show({ message: "Saved" })}>Toast</Button>;
}

function App() {
  const [palette, setPalette] = useState(false);
  const [value, setValue] = useState(20);
  useEffect(() => {
    const onKey = event => { if ((event.metaKey || event.ctrlKey) && event.key === "k") { event.preventDefault(); setPalette(true); } };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, []);
  return <>
    <div style={{ display: "flex", gap: 16 }}>
      <Menu id="menu" trigger={<Button id="menu-trigger">File</Button>}>
        <MenuItem id="row-new">New file</MenuItem>
        <MenuItem id="row-open">Open</MenuItem>
        <MenuItem id="row-rename">Rename</MenuItem>
      </Menu>
      <Popover id="popover" trigger={<Button id="popover-trigger">Details</Button>}><PopoverBody>Shared with the team</PopoverBody></Popover>
      <Tooltip id="tooltip" trigger={<Button id="tooltip-trigger">Hint</Button>}>Copy the link</Tooltip>
      <CustomSelect id="select" aria-label="Color" items={COLORS} defaultValue="blue" />
      <Dialog id="dialog" title="Rename" trigger={<Button id="dialog-trigger">Dialog</Button>}>Choose a new name.</Dialog>
      <Drawer id="drawer" title="Details" trigger={<Button id="drawer-trigger">Drawer</Button>}>The record's details.</Drawer>
      <Button id="palette-trigger" onClick={() => setPalette(true)}>Commands</Button>
      <Toasts />
    </div>
    <div style={{ display: "flex", gap: 16 }}>
      <Button id="press-solid" variant="solid">Save changes</Button>
      <Button id="press-ghost" variant="ghost">Cancel</Button>
    </div>
    <div style={{ inlineSize: 240 }}><Progress id="progress" label="Upload" value={value} /></div>
    <Button id="progress-step" onClick={() => setValue(v => (v >= 100 ? 20 : v + 40))}>Step</Button>
    <CommandPalette open={palette} onOpenChange={setPalette} label="Commands" items={[
      { id: "export", label: "Export", onSelect: () => window.__log.push("cmd:export") },
      { id: "rename", label: "Rename", onSelect: () => window.__log.push("cmd:rename") },
    ]} />
    <div style={{ blockSize: 600 }} />
  </>;
}

createRoot(document.getElementById("root")).render(<Toaster><App /></Toaster>);
requestAnimationFrame(() => requestAnimationFrame(() => { window.__ready = true; }));
