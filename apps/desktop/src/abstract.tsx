/**
 * Theme illustrations: per setting, one real Area component (or a small group of them) with real text, so what
 * the setting does is plain at a glance (owner, 2026-10-19: "real components ... or at least real text ... simple, and
 * easy to recognize"; "every axis should" have its own visual). Each pick shows the one thing its setting moves:
 *
 *   mode         a card, its ground, ink and action
 *   neutral      a window's greys (sidebar, card, field) with the layers at 8: the tint moves each channel ~5 of 255,
 *                so it shows only on large grey areas (a segmented track's greys measured 3 of 255 apart in light)
 *   accent       a button at its default size (action set to accent in these tiles)
 *   action       a dialog's Cancel and Save
 *   selection    a ticked box
 *   ground       a window that is all page under a white bar
 *   layers       a window's sidebar, page, card and field
 *   contrast     the edges a stronger contrast draws: a field, a box, an outline button (a close-up, 1.25x)
 *   type         the type ramp, each role at the preset's size, so what follows the base (body, captions, the small
 *                heading) and what holds (titles, the display jump at 14) is plain
 *   density      a list's rows (a close-up, 1.25x)
 *   radius       a field's and a button's corners (a close-up, 1.25x)
 *   Stroke and Shadow (owner, 2026-10-19: "fix the visuals for stroke and shadow to be more custom tailored to each
 *   axis/variable that is changed and make sure its visible"; then "i dont want it to be too zoomed in, and i also still
 *   want to use real components"): each the whole real component the setting draws on, with its own text, centred on
 *   the page's ground (CloseUp) and shown a little over its size instead of shrunk as the other drawings are, so a
 *   half-pixel line or a 5% shadow still shows; the Inspector shows it at size. Each tile turns off the strokes and
 *   shadows that are not its own (the Theme tab's ALSO):
 *     surface         Width: a card, 1.5x
 *     stroke          Strength: a card and the field inside it, 1.5x
 *     shadow-rest     Rest shadow: a card with no line, 1.25x
 *     shadow-resting  Resting: the same card, 1.25x
 *     shadow-field    Field: a field and an outline button, 1.25x
 *     elevation       Floating: a menu, 1.25x
 *     shadow-size, -softness, -light, -color: the menu at Floating 8, 1.25x
 *   The interaction states (axes/states.ts, owner 2026-10-21), each drawn in the state it sets. A tile cannot hover or
 *   focus, so the state is painted from the same tokens the component reads (studio.css, "Language: states"):
 *     stroke-hover    Hover: a field at rest beside the same field hovered, 1.25x
 *     selected-stroke Selected: a selected card, 1.25x
 *     selected-tint   Selected tint: the same card
 *     focus-ring      Focus ring: a field, a button and a card each focused, 1.25x
 *     shadow-hover    Hover shadow: a hovered card, 1.25x
 *     fill-hover, -selected, -pressed: a menu's rows hovered, selected and pressed, 1.25x
 *   motion       a switch flipping (a close-up, 1.5x)
 *   easing       the same switch flipping at Motion 300, so the curve has time to show (a close-up, 1.5x)
 *   pills        the shape the tile names, as a pill (a close-up, 1.5x; a field and a segmented track at 1x)
 *
 * Scale (owner, 2026-10-19: "the scale of all the visuals ... should look relatively balanced"): each drawing is
 * measured at its natural size and zoomed to fill a share of its tile, the same share for every drawing of a kind
 * and one zoom for every preset of a setting (by its largest drawing),
 * never above 0.8x, so a single button and a window read at a similar weight without being to scale. Scale, not zoom: the
 * drawing is laid out at 1x and shrunk whole, so its parts keep their proportions (half pixels included). Every drawing is shown, not used: its tile is inert, and the
 * drawing is hidden from assistive tech.
 */
import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
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

/**
 * Zooms its drawing to fill its share of the tile (or preview), by the largest drawing of its setting, never past `max`
 * (0.8 for a tile's preview; the Setup's stage passes 1, true scale, since it shows the setting's effect at its size).
 */
function Fit({ children, fill, group, max = MAX_ZOOM }: { children: ReactNode; fill: number; group: string; max?: number }) {
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
      const next = Math.round(Math.min((width * fill) / w, (height * fill) / h, max) * 20) / 20;
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
  }, [fill, group, max]);
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

/*
 * The close-ups: what a Stroke or Shadow setting draws on, and how far it is magnified. Each subject is one surface at
 * its real size; CloseUp sets its end corner a little past the centre of a page-ground window and magnifies it from
 * there, so the corner's edge, its inside and the shadow beyond it all show.
 */
const CardSurface = () => <Note className="lang-card lang-zoom-card" />;
const CardWithField = () => (
  <Card size="sm" className="lang-card lang-zoom-card"><CardContent>
    <CardTitle>Title</CardTitle>
    <Input size="sm" fullWidth aria-label="Label" placeholder="Field" />
  </CardContent></Card>
);
const FieldSurface = () => (
  <div className="lang-col lang-zoom-field">
    <Input aria-label="Label" placeholder="Placeholder" />
    <Button variant="outline" tone="neutral">Button</Button>
  </div>
);
const MenuSurface = () => (
  <div className="area-menu lang-zoom-menu" role="menu" aria-label="Menu">
    <MenuItem>Item one</MenuItem>
    <MenuItem>Item two</MenuItem>
    <MenuItem>Item three</MenuItem>
  </div>
);
/** A field at rest and hovered. */
const HoverEdge = () => (
  <div className="lang-col lang-zoom-field">
    <Input aria-label="Label" placeholder="Rest" />
    <Input aria-label="Label" placeholder="Hover" className="lang-state-hover" />
  </div>
);
/** A selected card (Card `selected`, real). */
const SelectedCard = () => (
  <Card size="sm" selected className="lang-card lang-zoom-card"><CardContent>
    <CardTitle>Title</CardTitle>
    <CardDescription>Selected</CardDescription>
  </CardContent></Card>
);
/** A field, a button and a card focused: the ring on controls (`focus-offset`) and off containers (`focus-gap`). */
const Focused = () => (
  <div className="lang-col lang-zoom-field">
    <Input aria-label="Label" placeholder="Placeholder" className="lang-state-focus-field" />
    <div className="lang-row"><Button variant="outline" tone="neutral" className="lang-state-focus">Button</Button></div>
    <Note className="lang-card lang-zoom-card lang-state-focus-gap" />
  </div>
);
/** A hovered card. */
const LiftedCard = () => (
  <Card size="sm" className="lang-card lang-zoom-card lang-state-lift"><CardContent>
    <CardTitle>Title</CardTitle>
    <CardDescription>Hover</CardDescription>
  </CardContent></Card>
);
/** A menu's rows at rest, hovered (keyboard-highlighted, real), selected (real) and pressed. */
const StateMenu = () => (
  <div className="area-menu lang-zoom-menu" role="menu" aria-label="Menu">
    <MenuItem>Rest</MenuItem>
    <MenuItem data-highlighted="">Hover</MenuItem>
    <MenuItem data-selected="">Selected</MenuItem>
    <MenuItem className="lang-state-pressed">Pressed</MenuItem>
  </div>
);
/** A field over a button: their corners (Radius); a field, a box and an outline button: their edges (Contrast). Each one
    a column narrow enough that the close-up shows every corner whole inside a choice. */
const Corners = () => (
  <div className="lang-col lang-zoom-narrow">
    <Input aria-label="Label" placeholder="Field" />
    <div className="lang-row"><Button>Button</Button></div>
  </div>
);
const Edges = () => (
  <div className="lang-col lang-zoom-narrow">
    <Input aria-label="Label" placeholder="Field" />
    <div className="lang-row"><Checkbox aria-label="Option" /><Button variant="outline" tone="neutral">Button</Button></div>
  </div>
);
/** A list's rows, at their height (Density). */
const RowsSurface = () => <div className="lang-zoom-menu"><Rows /></div>;
/** How much over its size each setting's component is shown. Radius, Contrast, Density and the motion settings joined
    the close-ups on 2026-10-21 (owner: "make each visual choice more clear"): shrunk to fit a choice, a 2px corner step,
    a firmer edge, a row's height and a switch's travel could not be told apart. */
const CLOSE_UPS: Record<string, { scale: number; subject: () => ReactNode }> = {
  radius: { scale: 1.25, subject: Corners },
  contrast: { scale: 1.25, subject: Edges },
  density: { scale: 1.25, subject: RowsSurface },
  motion: { scale: 1.5, subject: LoopingSwitch },
  easing: { scale: 1.5, subject: LoopingSwitch },
  surface: { scale: 1.5, subject: CardSurface },
  stroke: { scale: 1.5, subject: CardWithField },
  "shadow-rest": { scale: 1.25, subject: CardSurface },
  "shadow-resting": { scale: 1.25, subject: CardSurface },
  "shadow-field": { scale: 1.25, subject: FieldSurface },
  elevation: { scale: 1.25, subject: MenuSurface },
  "shadow-size": { scale: 1.25, subject: MenuSurface },
  "shadow-softness": { scale: 1.25, subject: MenuSurface },
  "shadow-light": { scale: 1.25, subject: MenuSurface },
  "shadow-color": { scale: 1.25, subject: MenuSurface },
  "stroke-hover": { scale: 1.25, subject: HoverEdge },
  "selected-stroke": { scale: 1.25, subject: SelectedCard },
  "selected-tint": { scale: 1.25, subject: SelectedCard },
  "focus-ring": { scale: 1.25, subject: Focused },
  "shadow-hover": { scale: 1.25, subject: LiftedCard },
  "fill-hover": { scale: 1.25, subject: StateMenu },
  "fill-selected": { scale: 1.25, subject: StateMenu },
  "fill-pressed": { scale: 1.25, subject: StateMenu },
};

/** Whether a setting draws a close-up (its component cropped a little over its size) rather than a fitted drawing. */
export const hasCloseUp = (axis: string) => axis in CLOSE_UPS;

/** The whole component, centred in a window on the page's ground, a little over its size. */
function CloseUp({ scale, children }: { scale: number; children: ReactNode }) {
  return (
    <div className="lang-closeup" aria-hidden="true" style={{ "--_scale": scale } as CSSProperties}>
      <div className="lang-closeup__subject">{children}</div>
    </div>
  );
}

/**
 * The illustration for one setting; `preset` reaches the drawings that print a value (the type ramp, a pill). A Stroke
 * or Shadow setting draws a close-up unless `whole` (the Inspector's preview), which draws its surface at size.
 */
export function Abstract({ axis, preset, whole }: { axis: string; preset?: string; whole?: boolean }) {
  const closeUp = CLOSE_UPS[axis];
  // Pills: the shape the choice names, a close-up of its own (a count or a badge shrunk to fit read as a dot).
  // A field and a segmented track are wide controls: at their size, the field narrow, so each shows both ends.
  if (axis === "pills" && !whole) {
    const wide = preset === "field" || preset === "segmented";
    return <CloseUp scale={wide ? 1 : 1.5}><div className={wide ? "lang-row lang-zoom-narrow" : "lang-row"}><Pill shape={preset ?? "button"} /></div></CloseUp>;
  }
  const art = closeUp && !whole ? <CloseUp scale={closeUp.scale}><closeUp.subject /></CloseUp>
    : closeUp ? <Fit fill={FILL.wide} group={`${axis}-whole`}><div className="lang-zoom-whole"><closeUp.subject /></div></Fit>
    : (() => {
      const [fill, drawn] = drawing(axis, preset);
      // Pills draws a different shape per tile, so each is sized alone; every other setting shares one zoom.
      return <Fit fill={fill} group={axis === "pills" ? `pills-${preset}` : axis}>{drawn}</Fit>;
    })();
  // Only the drawing: the tile carries no readout (owner, 2026-10-19: "i dont want to see any information visible on each
  // card container, just the isolated visual"); what a value writes is in the Inspector.
  return art;
}

function drawing(axis: string, preset?: string): [number, ReactNode] {
  switch (axis) {
    case "theme":
      return [FILL.wide, <Note><div className="lang-row lang-row--start"><Button size="sm">Button</Button></div></Note>];
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
    case "neutral":
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
    case "motion":
    case "easing":
      return [FILL.control, <LoopingSwitch />];
    case "pills":
      // A field and a segmented track are wide controls; the rest are single small ones.
      return [preset === "field" || preset === "segmented" ? FILL.wide : FILL.control, <div className="lang-row"><Pill shape={preset ?? "button"} /></div>];
    default:
      return [FILL.control, <Button>Button</Button>];
  }
}

/**
 * The settings whose change shows only in a state (hover, selection, focus, press): no view draws that state, so the
 * Setup's stage draws the state itself, the close-up's component at true scale (theme-setup.tsx).
 */
export const STATE_SETTINGS = new Set(["stroke-hover", "selected-stroke", "selected-tint", "focus-ring", "shadow-hover", "fill-hover", "fill-selected", "fill-pressed"]);
export function StateDrawing({ axis }: { axis: string }) {
  const Subject = CLOSE_UPS[axis]?.subject;
  return Subject ? <Fit fill={FILL.window} max={1} group={`stage-${axis}`}><div className="lang-zoom-whole"><Subject /></div></Fit> : null;
}

/** The same fit for the Theme tab's Setup views (theme-setup.tsx): one zoom per group, by its largest drawing. */
export { Fit as Scaled, FILL, LoopingSwitch };
