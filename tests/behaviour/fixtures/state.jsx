// State paint fixture (plan B7.1, B7.2, B7.3, B7.11; DESIGN_SYSTEM.md, "Shared state paint"). Hover-revealed parts the
// state suite hovers, tabs to and reads under a touch screen; and a grid of plates on every ground for the paint sweep.
// `?<setting>=<value>&…` sets data-area-<setting> on the root (theme, layers, fills, selection, hover lift).
// window.__paint(selector) reads an element's composited background over its ground.
import { useEffect } from "react";
import { createRoot } from "react-dom/client";
import {
  Button, Card, CardContent, CardOverlay, Message, MessageActions, Attachment, PromptSuggestions, TreeView, Menu, MenuItem,
} from "@area/react";
import "@area/styles/area.css";

window.__log = [];
const params = new URLSearchParams(location.search);
for (const [key, value] of params) document.documentElement.setAttribute(`data-area-${key}`, value);

const GROUNDS = [
  ["page", {}],
  ["surface", { className: "area-surface area-surface--surface" }],
  ["float", { "data-area-ground": "float" }],
  ["recessed", { "data-area-ground": "recessed" }],
];

function Plates({ ground }) {
  return <div className="plates" data-ground={ground}>
    <Button id={`${ground}-ghost`} variant="ghost">Ghost</Button>
    <Button id={`${ground}-ghost-on`} variant="ghost" selected>On</Button>
    <Button id={`${ground}-soft-on`} variant="soft" selected>On</Button>
    <Button id={`${ground}-danger-on`} variant="soft" tone="danger" selected>On</Button>
    <Button id={`${ground}-solid-on`} variant="solid" selected>On</Button>
    <div className="area-menu" style={{ position: "static", display: "inline-block" }}>
      <div className="area-menu__item" id={`${ground}-row`} role="option" tabIndex={-1}><span className="area-menu__text">Row</span></div>
      <div className="area-menu__item" id={`${ground}-row-on`} role="option" tabIndex={-1} data-selected=""><span className="area-menu__text">Chosen</span></div>
    </div>
  </div>;
}

function App() {
  useEffect(() => { requestAnimationFrame(() => requestAnimationFrame(() => { window.__ready = true; })); }, []);
  return <main style={{ padding: 24, display: "grid", gap: 24 }}>
    <section id="reveals" style={{ display: "grid", gap: 16, maxWidth: 520 }}>
      <Card id="card" style={{ position: "relative", minHeight: 80 }}>
        <CardContent>Card</CardContent>
        <CardOverlay reveal><Button id="card-action" variant="ghost" size="sm">Edit</Button></CardOverlay>
      </Card>
      <Message id="message" author="user" actions={<MessageActions label="Message actions"><Button id="message-action" variant="ghost" size="sm" iconOnly aria-label="Copy">C</Button></MessageActions>}>Hello</Message>
      <Attachment id="attachment" name="Report.pdf" onDismiss={() => window.__log.push("dismiss")} />
      <PromptSuggestions id="suggestions" items={[{ id: "a", label: "Summarize" }]} onSelect={() => {}} onDismiss={() => window.__log.push("suggestion")} />
      <TreeView id="tree" aria-label="Files" items={[{ id: "a", label: "Notes", actions: <Button id="tree-action" variant="ghost" size="sm">More</Button> }]} />
    </section>
    <section id="grounds" style={{ display: "grid", gap: 12 }}>
      {GROUNDS.map(([name, props]) => <div key={name} id={`ground-${name}`} {...props} style={{ padding: 12 }}><Plates ground={name} /></div>)}
    </section>
  </main>;
}

// The background an element paints, composited over the first opaque ground behind it, as sRGB 0–1.
// Any CSS colour (oklch, oklab, color-mix results) read back as sRGB through a canvas pixel, unpremultiplied.
const ink = document.createElement("canvas").getContext("2d", { willReadFrequently: true });
const parse = value => {
  ink.clearRect(0, 0, 1, 1); ink.fillStyle = "rgba(0, 0, 0, 0)"; ink.fillStyle = value; ink.fillRect(0, 0, 1, 1);
  const [r, g, b, a] = ink.getImageData(0, 0, 1, 1).data;
  return { r: r / 255, g: g / 255, b: b / 255, a: a / 255 };
};
const over = (top, under) => ({ r: top.r * top.a + under.r * (1 - top.a), g: top.g * top.a + under.g * (1 - top.a), b: top.b * top.a + under.b * (1 - top.a), a: 1 });
window.__paint = selector => {
  let el = document.querySelector(selector);
  if (!el) return null;
  const layers = [];
  for (let node = el; node; node = node.parentElement) {
    const c = parse(getComputedStyle(node).backgroundColor);
    // A Button's wash is a background-image gradient of one colour.
    const image = getComputedStyle(node).backgroundImage.match(/linear-gradient\(((?:rgba?|oklch|oklab|color|lab|lch)\([^)]*\))/)?.[1];
    if (node === el && image) layers.push(parse(image));
    layers.push(c);
    if (c.a === 1) break;
  }
  let out = { r: 1, g: 1, b: 1, a: 1 };
  for (const layer of layers.reverse()) out = over(layer, out);
  return out;
};

window.__ink = selector => parse(getComputedStyle(document.querySelector(selector)).color);

createRoot(document.getElementById("root")).render(<App />);
