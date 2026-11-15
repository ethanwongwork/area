// Wrap fixture (plan B6.7): Alert (titled and untitled) and Toast, each with an action and a close, at
// type 12, 13 and 16 and every density, in a wide and a narrow column. The suite reads where the actions land, and
// where Dialog's, Drawer's and Popover's titles sit beside their corner close.
import { createRoot } from "react-dom/client";
import { Alert, Button, Dialog, Drawer, Popover, PopoverClose, PopoverDescription, PopoverHeader, PopoverTitle, Toast } from "@area/react";
import "@area/styles/area.css";

const TYPES = [12, 13, 16];
const DENSITIES = [28, 32, 36];
// Narrow: 13 ems of the type, room for the text alone but not for the text and its action.
const WIDTHS = { wide: () => 640, narrow: type => type * 13 };
const action = label => <Button size="sm" variant="outline" tone="neutral">{label}</Button>;

function Case({ type, density, width }) {
  const key = `${type}-${density}-${width}`;
  return <div data-area-type={type} data-area-density={density} style={{ inlineSize: WIDTHS[width](type), display: "flow-root", paddingBlock: 8 }}>
    <Alert id={`alert-line-${key}`} layout="single-line" title="Title" actions={action("Action")} onDismiss={() => {}}>Short text</Alert>
    <div style={{ blockSize: 8 }} />
    <Alert id={`alert-${key}`} actions={action("Action")} onDismiss={() => {}}>Message text</Alert>
    <div style={{ blockSize: 8 }} />
    <div style={{ blockSize: 8 }} />
    <Toast id={`toast-${key}`} style={{ "--area-toast-inline-size": "100%" }} actions={action("Undo")} onDismiss={() => {}}>Message text</Toast>
  </div>;
}

// Titled surfaces, with and without their corner close, at Corner 0, 10 and the maximum (Pill).
const CORNERS = ["0", "10", "pill"];
function Titled({ type, density, corner }) {
  const key = `${type}-${density}-${corner}`;
  const gap = <div style={{ blockSize: 8 }} />;
  return <div data-area-type={type} data-area-density={density} data-area-radius={corner} style={{ inlineSize: 480, display: "flow-root", paddingBlock: 8 }}>
    <Dialog id={`dialog-close-${key}`} title="Title" description="Description" />{gap}
    <Dialog id={`dialog-bare-${key}`} showCloseButton={false} title="Title" description="Description" />{gap}
    <div style={{ position: "relative", blockSize: 120, overflow: "hidden" }}><Drawer inline id={`drawer-close-${key}`} title="Title" description="Description" /></div>{gap}
    <Popover id={`popover-close-${key}`}><PopoverHeader><PopoverTitle>Title</PopoverTitle><PopoverDescription>Description</PopoverDescription><PopoverClose /></PopoverHeader></Popover>{gap}
    <Popover id={`popover-bare-${key}`}><PopoverHeader><PopoverTitle>Title</PopoverTitle><PopoverDescription>Description</PopoverDescription></PopoverHeader></Popover>
  </div>;
}

createRoot(document.getElementById("root")).render(<>
  {TYPES.flatMap(type => DENSITIES.flatMap(density => Object.keys(WIDTHS).map(width =>
    <Case key={`${type}-${density}-${width}`} type={type} density={density} width={width} />)))}
  {TYPES.flatMap(type => DENSITIES.flatMap(density => CORNERS.map(corner =>
    <Titled key={`t-${type}-${density}-${corner}`} type={type} density={density} corner={corner} />)))}
</>);
requestAnimationFrame(() => requestAnimationFrame(() => { window.__ready = true; }));
