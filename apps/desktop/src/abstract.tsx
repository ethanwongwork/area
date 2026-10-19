/**
 * Language illustrations: per setting, the two or three Area components that show what the setting changes, with
 * the placeholder copy every demo uses (docs/DESIGN_SYSTEM.md, "Example copy"). Owner, 2026-10-17: "fix and simplify
 * the ui being used in the language, maybe make it more abstract or small/simple" (relayed from the placeholder-copy
 * session), after a full card per setting read dense on a large, empty tile; earlier the same day "use real text and
 * components, but just smaller"; grey bars and pills after the Frames X thumbnails, 2026-10-11.
 *
 * Each drawing is laid out at one reference size (REF) and shown 1:1, zoomed down only when its tile is smaller, the
 * same zoom for every preset in tiles of one size, so a setting's tiles differ only by the setting: the theme its
 * ground and ink, the neutral its greys, the accent, action and selection their fills, the type size its text, the
 * density its rows, the radius its corners, the surface its edges, the elevation its lift, the motion its timing. Zoom,
 * not a transform, so edges stay on whole pixels (gallery/fit.ts). Every drawing is shown, not used: its tile is inert.
 */
import { useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import {
  Button, Card, CardContent, CardDescription, CardTitle, Checkbox, Input, MenuItem, Nav, NavItem, Radio, Segmented,
  Switch,
} from "@area/react";
import { FolderIcon, HomeIcon, StarIcon } from "@area/icons";

/** The reference size every drawing is laid out at; a tile smaller than it zooms it down. */
const REF = { width: 224, height: 136 };

/** Shows its drawing 1:1, or zoomed down to fit a smaller tile (or preview), from the tile's size alone. */
function Fit({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  useLayoutEffect(() => {
    const host = ref.current?.parentElement;
    if (!host) return;
    const measure = () => {
      const { width, height } = host.getBoundingClientRect();
      if (!width || !height) return;
      setZoom(Math.min(1, (width * 0.88) / REF.width, (height * 0.88) / REF.height));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(host);
    return () => observer.disconnect();
  }, []);
  return <div ref={ref} className="lang-ui" style={{ zoom, "--_lang-width": `${REF.width}px` } as CSSProperties}>{children}</div>;
}

/** Flips every 1.5s, so each motion preset shows its own duration and easing. */
function useLoop() {
  const [on, setOn] = useState(true);
  useEffect(() => {
    const timer = setInterval(() => setOn(value => !value), 1500);
    return () => clearInterval(timer);
  }, []);
  return on;
}
function LoopingControls() {
  const on = useLoop();
  return (
    <>
      <Segmented size="sm" fullWidth aria-label="Label" value={on ? "one" : "two"} items={two} />
      <Switch size="sm" label="Label" checked={on} onChange={() => {}} />
    </>
  );
}

const two = [{ value: "one", label: "One" }, { value: "two", label: "Two" }];
/* Each tile's choices are their own group: radios sharing a name across tiles would leave only one checked. */
function Choices() {
  const name = useId();
  return (
    <Col>
      <Checkbox label="Option one" defaultChecked />
      <Radio name={name} label="Option two" defaultChecked />
      <Segmented size="sm" fullWidth aria-label="Label" defaultValue="one" items={two} />
    </Col>
  );
}
const Col = ({ children }: { children: ReactNode }) => <div className="lang-col">{children}</div>;
const Row = ({ children }: { children: ReactNode }) => <div className="lang-row">{children}</div>;
/** A small card: a title and a line of description, and what the setting needs below them. */
const Note = ({ children }: { children?: ReactNode }) => (
  <Card size="sm"><CardContent>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
    {children}
  </CardContent></Card>
);
const Rows = () => (
  <Nav aria-label="Items" style={{ ["--area-nav-inline-size" as string]: "100%" }}>
    <NavItem href="#one" current icon={<HomeIcon />}>Item one</NavItem>
    <NavItem href="#two" icon={<FolderIcon />}>Item two</NavItem>
    <NavItem href="#three" icon={<StarIcon />}>Item three</NavItem>
  </Nav>
);

/** The illustration for one setting; every preset of that setting draws the same one. */
export function Abstract({ axis }: { axis: string }) {
  return <Fit>{drawing(axis)}</Fit>;
}

function drawing(axis: string) {
  switch (axis) {
    // Ground and ink: a card's surface, its text and an action.
    case "theme":
      return <Note><Row><Button size="sm">Button</Button></Row></Note>;
    // The greys: rows, the current one on its plate.
    case "neutral":
      return <Rows />;
    // The hue: an action and an on switch (action and selection are accent in these tiles).
    case "accent":
      return <Row><Button size="sm">Button</Button><Switch size="sm" aria-label="Label" defaultChecked /></Row>;
    // What you press to commit: the primary action beside a secondary one.
    case "action":
      return <Row><Button size="sm" variant="outline" tone="neutral">Cancel</Button><Button size="sm">Action</Button></Row>;
    // The colour of state: a ticked box, a chosen radio, a selected segment.
    case "selection":
      return <Choices />;
    // Type size: a title and its description.
    case "type":
      return <Note />;
    // Density: three rows at the setting's own row height.
    case "density":
      return <Rows />;
    // Corners: a field and a button, each at its own radius.
    case "radius":
      return <Row><Input size="sm" aria-label="Label" placeholder="Placeholder" /><Button size="sm">Button</Button></Row>;
    // Fields and outline buttons, which Field shadow lifts (axes/depth.ts).
    case "shadow-field":
      return <Row><Input size="sm" aria-label="Label" placeholder="Placeholder" /><Button size="sm" variant="outline" tone="neutral">Button</Button></Row>;
    // Depth and edges: a menu floating over a resting card; every other Edge and Depth lever shapes one of them.
    case "elevation":
    case "surface":
    case "stroke":
    case "shadow-rest":
    case "shadow-size":
    case "shadow-softness":
    case "shadow-light":
    case "shadow-color":
      return (
        <div className="lang-stack">
          <Note />
          <div className="area-menu lang-float" role="menu" aria-label="Menu">
            <MenuItem>Item one</MenuItem>
            <MenuItem>Item two</MenuItem>
          </div>
        </div>
      );
    // Timing: a segment and a switch flipping on a loop.
    case "motion":
      return <Col><LoopingControls /></Col>;
    // The Layers (grounds and layer contrast) and anything else: a soft field and a segmented track on the ground,
    // where the ground's fills show.
    default:
      return (
        <Col>
          <Segmented size="sm" fullWidth aria-label="Label" defaultValue="one" items={two} />
          <Input size="sm" variant="soft" fullWidth aria-label="Label" placeholder="Placeholder" />
        </Col>
      );
  }
}
