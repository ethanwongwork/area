/**
 * Language illustrations: per setting, one real Area component (or a small group of them) with real text, so what
 * the setting does is plain at a glance (owner, 2026-10-19: "real components ... or at least real text ... simple, and
 * easy to recognize"; "every axis should" have its own visual). Each pick shows the one thing its setting moves:
 *
 *   mode         a card, its ground, ink and action
 *   neutral      a segmented track's greys
 *   accent       a button at its default size (action set to accent in these tiles)
 *   action       a dialog's Cancel and Save
 *   selection    a ticked box
 *   ground       a window that is all page under a white bar
 *   layers       a window's sidebar, page, card and field
 *   contrast     the edges a stronger contrast draws: a field, a box, an outline button
 *   type         the type ramp, each role at the preset's size, so what follows the base (body, captions, the small
 *                heading) and what holds (titles, the display jump at 14) is plain
 *   density      a list's rows
 *   radius       a field's and a button's corners
 *   surface      two overlapping cards' lines (stroke width)
 *   shadow-rest  two cards side by side, set apart by the rest shadow
 *   elevation    a menu's lift
 *   depth        (axes/depth.ts) Strength: the cards' lines, as surface; Resting lift: the side-by-side cards, as
 *                shadow-rest; Field shadow: a field and an outline button; Size, Softness, Light and Shadow colour: the
 *                menu, as elevation, since they shape every shadow
 *   motion       a switch flipping
 *   pills        the shape the tile names, as a pill
 *
 * Scale (owner, 2026-10-19: "the scale of all the visuals ... should look relatively balanced"): each drawing is
 * measured at its natural size and zoomed to fill a share of its tile, the same share for every drawing of a kind
 * and one zoom for every preset of a setting (by its largest drawing),
 * never above 0.8x, so a single button and a window read at a similar weight without being to scale. Scale, not zoom: the
 * drawing is laid out at 1x and shrunk whole, so its parts keep their proportions (half pixels included). Every drawing is shown, not used: its tile is inert, and the
 * drawing is hidden from assistive tech.
 */
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import {
  Avatar, Badge, Button, Card, CardContent, CardDescription, CardTitle, Checkbox, Chip, Count, Input, MenuItem, Nav,
  NavItem, Segmented, Switch,
} from "@area/react";
import { FolderIcon, HomeIcon, StarIcon } from "@area/icons";
import { DEFAULT_TYPE, TYPE_ROLES } from "./tokens.ts";

/** The largest zoom: 0.8, so every drawing reads as a scaled-down preview (owner, 2026-10-19: a 1.5x button "too
    large", then "the buttons for accent do seem a bit large, i do want things to be scaled down"). */
const MAX_ZOOM = 0.8; /* pick */
/** How much of its tile a drawing fills: a window most of it, a card or a group about two thirds, a single control a
    third, so each reads at a similar weight. */
const FILL = { window: 0.84, wide: 0.66, control: 0.34 } as const;

/*
 * One zoom per setting: every preset's drawing reports its natural size, and each zooms by the largest of them, so a
 * setting's tiles stay comparable (the type ramp at 16 reads larger than at 12; Compact rows shorter than Comfortable).
 */
const natural = new Map<string, Map<object, { w: number; h: number }>>();
const watchers = new Map<string, Set<() => void>>();
function report(group: string, key: object, size: { w: number; h: number } | null) {
  const sizes = natural.get(group) ?? new Map();
  natural.set(group, sizes);
  const before = sizes.get(key);
  if (size) sizes.set(key, size); else sizes.delete(key);
  if (!size || !before || before.w !== size.w || before.h !== size.h) watchers.get(group)?.forEach(watch => watch());
}
function largest(group: string) {
  let w = 0, h = 0;
  for (const size of natural.get(group)?.values() ?? []) { w = Math.max(w, size.w); h = Math.max(h, size.h); }
  return { w, h };
}

/** Zooms its drawing to fill its share of the tile (or preview), by the largest drawing of its setting. */
function Fit({ children, fill, group }: { children: ReactNode; fill: number; group: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const zoomRef = useRef(1);
  const [zoom, setZoom] = useState(1);
  useLayoutEffect(() => {
    const art = ref.current;
    const host = art?.parentElement;
    if (!art || !host) return;
    const key = {};
    const apply = () => {
      const { width, height } = host.getBoundingClientRect();
      const { w, h } = largest(group);
      if (!width || !height || !w || !h) return;
      const next = Math.round(Math.min((width * fill) / w, (height * fill) / h, MAX_ZOOM) * 20) / 20;
      if (next === zoomRef.current) return;
      zoomRef.current = next;
      setZoom(next);
    };
    const measure = () => {
      // The drawing's natural size: what it measures now, over the zoom it has now.
      const own = art.getBoundingClientRect();
      if (own.width && own.height) report(group, key, { w: own.width / zoomRef.current, h: own.height / zoomRef.current });
      apply();
    };
    const watching = watchers.get(group) ?? new Set();
    watchers.set(group, watching);
    watching.add(apply);
    measure();
    document.fonts.ready.then(measure);
    const observer = new ResizeObserver(measure);
    observer.observe(host);
    return () => { observer.disconnect(); watching.delete(apply); report(group, key, null); };
  }, [fill, group]);
  // Scale, not zoom (owner, 2026-10-19: "i want scaling of components to be seamless, if it could sit on half pixels
  // would that work?"): the drawing is laid out at 1x and shrunk whole, so every part keeps its exact proportions and
  // lands on half pixels as it must; zoom laid it out again smaller, snapping 1px edges to device pixels while the
  // rest scaled, which moved parts against each other (a Switch's thumb sat high in its track).
  return <div ref={ref} className="lang-art" aria-hidden="true" style={{ scale: String(zoom) }}>{children}</div>;
}

/** A switch flipping every 1.6s, so each motion preset plays its own duration and easing. */
function LoopingSwitch() {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const timer = setInterval(() => setOn(value => !value), 1600);
    return () => clearInterval(timer);
  }, []);
  return <Switch label="Label" checked={on} onChange={() => {}} />;
}

const three = [{ value: "one", label: "One" }, { value: "two", label: "Two" }, { value: "three", label: "Three" }];
const Note = ({ children, className }: { children?: ReactNode; className?: string }) => (
  <Card size="sm" className={className ?? "lang-card"}><CardContent>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
    {children}
  </CardContent></Card>
);
const Rows = () => (
  <Nav aria-label="Items" className="lang-nav">
    <NavItem href="#one" current icon={<HomeIcon />}>Item one</NavItem>
    <NavItem href="#two" icon={<FolderIcon />}>Item two</NavItem>
    <NavItem href="#three" icon={<StarIcon />}>Item three</NavItem>
  </Nav>
);
/** A small window: its bar's three dots, then the page's ground round what it holds. */
const Window = ({ children }: { children: ReactNode }) => (
  <div className="lang-window">
    <div className="lang-window__bar"><i /><i /><i /></div>
    <div className="lang-window__page">{children}</div>
  </div>
);

/* The type ramp's rows: a role from each tier, named for what it is for. */
const RAMP = [
  { role: "display-sm", name: "Display" },
  { role: "title-md", name: "Title" },
  { role: "title-xs", name: "Heading" },
  { role: "text-sm", name: "Body" },
  { role: "text-xs", name: "Caption" },
] as const;
function Ramp({ size }: { size: string }) {
  return (
    <div className="lang-ramp">
      {RAMP.map(({ role, name }) => {
        const metrics = TYPE_ROLES.find(entry => entry.id === role)?.metrics;
        return (
          <span key={role} className="lang-ramp__row">
            <span className={`lang-ramp__sample lang-ramp__sample--${role}`}>{name}</span>
            <span className="lang-ramp__size">{(metrics?.[size] ?? metrics?.[DEFAULT_TYPE])?.size}</span>
          </span>
        );
      })}
    </div>
  );
}

/** The shape a Pills tile names, drawn as itself. */
function Pill({ shape }: { shape: string }) {
  switch (shape) {
    case "button": return <Button>Button</Button>;
    case "field": return <Input aria-label="Label" placeholder="Placeholder" />;
    case "segmented": return <Segmented aria-label="Label" defaultValue="one" items={three} />;
    case "chip": return <Chip>Chip</Chip>;
    case "badge": return <Badge>Badge</Badge>;
    case "count": return <Count count={8} />;
    case "switch": return <Switch aria-label="Label" defaultChecked />;
    case "avatar": return <Avatar fallback="DT" alt="David Tee" />;
    default: return <Button>Button</Button>;
  }
}

/** The illustration for one setting; `preset` reaches the drawings that print a value (the type ramp, a pill). */
export function Abstract({ axis, preset }: { axis: string; preset?: string }) {
  const [fill, drawn] = drawing(axis, preset);
  // Pills draws a different shape per tile, so each is sized alone; every other setting shares one zoom.
  return <Fit fill={fill} group={axis === "pills" ? `pills-${preset}` : axis}>{drawn}</Fit>;
}

function drawing(axis: string, preset?: string): [number, ReactNode] {
  switch (axis) {
    case "theme":
      return [FILL.wide, <Note><div className="lang-row lang-row--start"><Button size="sm">Button</Button></div></Note>];
    case "neutral":
      return [FILL.wide, <Segmented aria-label="Label" defaultValue="one" items={three} />];
    case "accent":
      return [FILL.control, <Button>Button</Button>];
    case "action":
      return [FILL.wide, <div className="lang-row"><Button variant="outline" tone="neutral">Cancel</Button><Button>Save</Button></div>];
    case "selection":
      return [FILL.control, <Checkbox label="Selected" defaultChecked />];
    case "ground-light":
    case "ground-dark":
      return [FILL.window, (
        <Window>
          <div className="lang-page">
            <span className="lang-page__title">Page</span>
            <span className="lang-page__body">The ground everything sits on.</span>
          </div>
        </Window>
      )];
    case "layers-light":
    case "layers-dark":
      return [FILL.window, (
        <Window>
          <div className="lang-layers">
            <div className="lang-layers__side" data-area-chrome="">
              <Nav aria-label="Items" className="lang-layers__nav">
                <NavItem href="#one" current>Home</NavItem>
                <NavItem href="#two">Files</NavItem>
              </Nav>
            </div>
            <div className="lang-layers__main">
              <Card size="sm" className="lang-window__card"><CardContent>
                <CardTitle>Card</CardTitle>
                <Input size="sm" variant="soft" fullWidth aria-label="Label" placeholder="Field" />
              </CardContent></Card>
            </div>
          </div>
        </Window>
      )];
    case "contrast":
      return [FILL.wide, (
        <div className="lang-col">
          <Input aria-label="Label" placeholder="Placeholder" />
          <div className="lang-row"><Checkbox label="Option" /><Button variant="outline" tone="neutral">Button</Button></div>
        </div>
      )];
    case "type":
      return [FILL.wide, <Ramp size={preset ?? DEFAULT_TYPE} />];
    case "density":
      return [FILL.wide, <Rows />];
    case "radius":
      return [FILL.wide, <div className="lang-row"><Input aria-label="Label" placeholder="Placeholder" /><Button>Button</Button></div>];
    case "surface":
    case "stroke":
      return [FILL.wide, (
        <div className="lang-overlap">
          <Note className="lang-overlap__back" />
          <Note className="lang-overlap__front" />
        </div>
      )];
    case "shadow-rest":
    case "shadow-resting":
      return [FILL.wide, (
        <div className="lang-row">
          <Note className="lang-card lang-card--small" />
          <Note className="lang-card lang-card--small" />
        </div>
      )];
    case "shadow-field":
      return [FILL.wide, <div className="lang-row"><Input aria-label="Label" placeholder="Placeholder" /><Button variant="outline" tone="neutral">Button</Button></div>];
    case "elevation":
    case "shadow-size":
    case "shadow-softness":
    case "shadow-light":
    case "shadow-color":
      return [FILL.wide, (
        <div className="area-menu lang-menu" role="menu" aria-label="Menu">
          <MenuItem>Item one</MenuItem>
          <MenuItem>Item two</MenuItem>
          <MenuItem>Item three</MenuItem>
        </div>
      )];
    case "motion":
      return [FILL.control, <LoopingSwitch />];
    case "pills":
      // A field and a segmented track are wide controls; the rest are single small ones.
      return [preset === "field" || preset === "segmented" ? FILL.wide : FILL.control, <div className="lang-row"><Pill shape={preset ?? "button"} /></div>];
    default:
      return [FILL.control, <Button>Button</Button>];
  }
}
