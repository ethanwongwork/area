/**
 * Setup's product screen (owner, 2026-10-24: "for now the main large visual should just be 1 simplified product screen.
 * i will add examples to it as the rest of it is built"): one desktop app window built only from Area's components, drawn
 * as an Area figure (the area-illustration skill: every word a light bar, numbers as digits, strokes at exactly 1px), in
 * the theme so far. It holds every part a theme question changes, each marked as a region so a question can point at it
 * and an option card can show it close up:
 *
 *   sidebar     the recessed side: a workspace row, the current page, a hovered row with its count, a group
 *   header      the title, a More button that opens the menu, an outline Button and the primary Action
 *   tabs        the page's views
 *   text        the page heading and its description
 *   stats       three cards; the middle one selected and the last one lifting under the pointer, when held
 *   list        a card of rows: checkboxes, status badges, avatars
 *   form        a card: a field, a segmented control, a switch, chips, a slider and the primary Action
 *   menu        the More menu, open when held, with a destructive row
 *
 * The screen is rendered once per set of held states to static markup (react-dom/server) and drawn by the skill's
 * engine (styles/figures.css, copied from engine/abstract.css; words by engine/markup.js), so it is the same drawing as
 * the skill's screens. The theme reaches it as attributes on the frame, so an answer repaints it without re-rendering.
 * It is shown, not used: inert and hidden from assistive tech.
 */
import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
  Avatar, Badge, Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator, Button, Card, CardContent,
  CardTitle, Checkbox, Chip, Count, Field, Input, MenuItem, MenuSeparator, Nav, NavGroup, NavItem, Segmented, Slider, Surface, Switch, Tabs,
} from "@area/react";
import {
  AddIcon, CalendarIcon, CopyIcon, DocumentIcon, FolderIcon, HomeIcon, InboxIcon, LayersIcon, MoreHorizontalIcon, PanelLeftIcon, PencilIcon,
  SearchIcon, SettingsIcon, ShareIcon, TrashIcon,
} from "@area/icons";
import { blankImages, figureMarkup } from "../../../.claude/skills/area-illustration/engine/markup.js";
import { AnalyticsDashboard } from "./content/examples/analytics.tsx";
import { AreaAppScreen } from "./content/examples/area-app.tsx";
import { MobileScreen } from "./content/examples/mobile.tsx";
import { SettingsScreen } from "./content/examples/settings.tsx";

/** The screen's true size: a desktop window at 16:10. */
export const SCREEN = { w: 1024, h: 640 } as const;

/** The parts a question can point at. */
export type Region =
  | "screen" | "sidebar" | "nav-current" | "nav-hover" | "header" | "more" | "button" | "primary" | "tabs" | "text" | "stats" | "stat"
  | "stat-selected" | "stat-hover" | "list" | "checks" | "badges" | "avatar" | "count" | "form" | "field" | "segmented" | "switch" | "chips"
  | "slider" | "action" | "menu" | "menu-row" | "menu-danger" | "status";

/** What a region is called where the stage points at it. */
export const REGION_LABEL: Record<Region, string> = {
  screen: "Whole screen", sidebar: "Sidebar", "nav-current": "Current page", "nav-hover": "Hovered row", header: "Header", more: "More button",
  button: "Button", primary: "Primary button", tabs: "Tabs", text: "Text", stats: "Cards", stat: "Card", "stat-selected": "Selected card",
  "stat-hover": "Hovered card", list: "List", checks: "Checkboxes", badges: "Status badges", avatar: "Avatars", count: "Count", form: "Form",
  field: "Field", segmented: "Segmented", switch: "Switch", chips: "Chips", slider: "Slider", action: "Primary button", menu: "Menu",
  "menu-row": "Menu row", "menu-danger": "Delete row", status: "Status badges",
};

/**
 * States the screen can hold still, each with Area's own paint (figures.css forced states, native hooks) and the pointer
 * where it would be: a hovered sidebar row and menu row, a pressed outline button, a focused or hovered field, a lifted
 * card, the open menu, a hovered destructive row, the middle card selected.
 */
export type Hold = "hover" | "press" | "focus" | "hover-edge" | "lift" | "menu" | "danger" | "selected";

const ROWS: ReadonlyArray<{ name: string; status: string; tone: "success" | "warning" | "danger" | "info"; who: string; checked?: boolean }> = [
  { name: "Update the pricing page", status: "Done", tone: "success", who: "DT", checked: true },
  { name: "Fix the mobile navigation", status: "In review", tone: "warning", who: "DE" },
  { name: "Broken image on the blog", status: "Blocked", tone: "danger", who: "EN" },
  { name: "Write the launch email", status: "Planned", tone: "info", who: "MK" },
];
const TEAMS: Record<string, string> = { DT: "David Tee", DE: "Design team", EN: "Engineering team", MK: "Marketing team" };
const STATS: ReadonlyArray<[string, string]> = [["Open issues", "128"], ["Progress", "86%"], ["Due this week", "12"]];
const priority = [{ value: "low", label: "Low" }, { value: "medium", label: "Medium" }, { value: "high", label: "High" }];
/** A region round a component whose own attributes reach its input, not its box (Switch, Slider, a pair of Chips). */
const R = ({ id, children, inline }: { id: Region; children: ReactNode; inline?: boolean }) =>
  <div data-region={id} className={inline ? "ss-region ss-region--inline" : "ss-region"}>{children}</div>;

function ProductScreen({ hold }: { hold: ReadonlySet<Hold> }) {
  const on = (state: Hold) => hold.has(state);
  const pointer = (state: Hold) => on(state) ? { "data-af-pointer": "" } : {};
  return (
    <Surface className="ss-window" data-region="screen">
      <div className="ss-window__bar"><span className="ss-lights"><i /><i /><i /></span><span className="ss-window__title">Northwind</span><span /></div>
      <div className="ss-app">
        {/* The side, on the recessed fill as the skill's screens draw it (figures/screens.css). */}
        <aside className="ss-side" data-region="sidebar">
          <div className="ss-side__ws">
            <Avatar size="sm" shape="square" fallback="N" aria-label="Northwind" />
            <span className="ss-strong ss-grow">Northwind</span>
            <Button size="sm" variant="ghost" tone="neutral" iconOnly aria-label="Sidebar" icon={<PanelLeftIcon />} />
          </div>
          <Nav aria-label="Primary">
            <NavItem href="#" icon={<HomeIcon />} current data-region="nav-current">Projects</NavItem>
            <NavItem href="#" icon={<InboxIcon />} className={on("hover") ? "st-hover" : undefined} {...pointer("hover")} data-region="nav-hover"
              trailing={<Count count={3} variant="soft" data-region="count" />}>Inbox</NavItem>
            <NavItem href="#" icon={<SearchIcon />}>Search</NavItem>
          </Nav>
          <Nav aria-label="Group">
            <NavGroup label="Teams">
              <NavItem href="#" icon={<DocumentIcon />}>Design</NavItem>
              <NavItem href="#" icon={<LayersIcon />}>Engineering</NavItem>
              <NavItem href="#" icon={<CalendarIcon />}>Marketing</NavItem>
              <NavItem href="#" icon={<FolderIcon />}>Support</NavItem>
            </NavGroup>
          </Nav>
          <span className="ss-grow" />
          <div className="ss-side__foot">
            <Avatar size="sm" fallback="DT" aria-label="David Tee" />
            <span className="ss-grow ss-stack0"><span className="ss-strong">David Tee</span><span className="ss-muted">Admin</span></span>
            <Button size="sm" variant="ghost" tone="neutral" iconOnly aria-label="Settings" icon={<SettingsIcon />} />
          </div>
        </aside>
        <main className="ss-main">
          <header className="ss-head" data-region="header">
            <Breadcrumb><BreadcrumbList>
              <BreadcrumbItem><BreadcrumbLink href="#">Projects</BreadcrumbLink></BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem><BreadcrumbPage>Website relaunch</BreadcrumbPage></BreadcrumbItem>
            </BreadcrumbList></Breadcrumb>
            <span className="ss-grow" />
            <Button size="sm" variant="ghost" tone="neutral" iconOnly aria-label="More" icon={<MoreHorizontalIcon />} data-region="more" />
            <Button size="sm" variant="outline" tone="neutral" icon={<ShareIcon />} className={on("press") ? "st-press" : undefined} {...pointer("press")} data-region="button">Share</Button>
            <Button size="sm" icon={<AddIcon />} data-region="primary">New issue</Button>
          </header>
          <div className="ss-tabs"><Tabs data-region="tabs" size="sm" aria-label="Views" defaultValue="one" items={[{ id: "one", label: "Overview" }, { id: "two", label: "Issues" }, { id: "three", label: "Timeline" }]} /></div>
          <div className="ss-body">
            <div className="ss-intro" data-region="text">
              <span className="ss-heading">Website relaunch</span>
              <span className="ss-body-text">Ship the new marketing site and docs before the October launch.</span>
            </div>
            <div className="ss-stats" data-region="stats">
              {STATS.map(([name, value], at) => (
                <Card key={value} size="sm" selected={at === 1 && on("selected")} className={at === 2 && on("lift") ? "st-lift" : undefined} {...(at === 2 ? pointer("lift") : {})}
                  data-region={at === 1 ? "stat-selected" : at === 2 ? "stat-hover" : "stat"}><CardContent>
                  <span className="ss-muted">{name}</span>
                  <span className="ss-value">{value}</span>
                </CardContent></Card>
              ))}
            </div>
            <div className="ss-grid">
              <Card size="sm" data-region="list"><CardContent>
                <CardTitle>Recent issues</CardTitle>
                <div className="ss-rows">
                  {ROWS.map(row => (
                    <div key={row.name} className="ss-row">
                      <span className="ss-cell" data-region={row.checked ? "checks" : undefined}><Checkbox aria-label={row.name} defaultChecked={row.checked} /></span>
                      <span className="ss-grow">{row.name}</span>
                      <Badge tone={row.tone} data-region={row.checked ? "badges status" : "status"}>{row.status}</Badge>
                      <Avatar size="sm" fallback={row.who} aria-label={TEAMS[row.who]} data-region={row.checked ? "avatar" : undefined} />
                    </div>
                  ))}
                </div>
              </CardContent></Card>
              <Card size="sm" data-region="form"><CardContent>
                <CardTitle>New issue</CardTitle>
                <Field label="Title"><Input size="sm" fullWidth placeholder="What needs doing?" data-region="field"
                  className={on("focus") ? "st-focus-field" : on("hover-edge") ? "st-hover-field" : undefined} {...pointer("hover-edge")} /></Field>
                <Segmented size="sm" fullWidth aria-label="Priority" defaultValue="medium" items={priority} data-region="segmented" />
                <div className="ss-line">
                  <R id="switch" inline><Switch label="Notify team" defaultChecked /></R>
                  <R id="chips" inline><Chip size="sm">Design</Chip><Chip size="sm">Web</Chip></R>
                </div>
                <R id="slider"><Slider aria-label="Estimate" defaultValue={60} /></R>
                <Button size="sm" fullWidth data-region="action">Create issue</Button>
              </CardContent></Card>
            </div>
          </div>
          {/* The More menu, open when a question holds it. */}
          {on("menu") || on("danger") ? (
            <div className="ss-menu" data-region="menu">
              <div className="area-menu" role="menu" aria-label="More">
                <MenuItem icon={<CopyIcon />} data-region="menu-row" data-highlighted={on("menu") && !on("danger") ? "" : undefined}>Duplicate</MenuItem>
                <MenuItem icon={<PencilIcon />}>Rename</MenuItem>
                <MenuItem icon={<ShareIcon />}>Move to…</MenuItem>
                <MenuSeparator />
                <MenuItem icon={<TrashIcon />} tone="danger" data-region="menu-danger" data-highlighted={on("danger") ? "" : undefined} {...pointer("danger")}>Delete</MenuItem>
              </div>
            </div>
          ) : null}
        </main>
      </div>
    </Surface>
  );
}

/**
 * The product screens the visuals can show (owner, 2026-10-24: "change to a different product ui"): the Workspace, which
 * marks every region and holds every state a question needs, and the app's own example screens (the Testing tab's), drawn
 * at their own widths. Only the Workspace points at the parts a question changes.
 */
export const SCREENS = {
  workspace: { label: "Workspace", node: (hold: ReadonlySet<Hold>) => <ProductScreen hold={hold} /> },
  analytics: { label: "Analytics", node: () => <div className="ss-example"><AnalyticsDashboard /></div> },
  settings: { label: "Settings", node: () => <div className="ss-example"><SettingsScreen /></div> },
  phone: { label: "Phone", node: () => <MobileScreen /> },
  // The app itself (owner, 2026-10-30: "a variation of the area electron app"), Settings › Theme's preview by default.
  area: { label: "Area", node: () => <AreaAppScreen /> },
} as const;
export type ScreenId = keyof typeof SCREENS;

const MARKUP = new Map<string, string>();
/** A screen's figure markup for a set of held states, rendered once each; words wrapped as shapes only where they are
    drawn as bars or shapes (a wrapped word in a flex label would take the label's gap). */
function markupOf(screen: ScreenId, hold: readonly Hold[], words: boolean): string {
  const key = `${screen}:${words}:${[...hold].sort().join(" ")}`;
  let html = MARKUP.get(key);
  if (!html) {
    const rendered = renderToStaticMarkup(SCREENS[screen].node(new Set(hold)));
    html = words ? figureMarkup(rendered) : blankImages(rendered);
    MARKUP.set(key, html);
  }
  return html;
}

const POINTER = '<svg class="af-pointer" viewBox="0 0 11 17" aria-hidden="true"><path d="M.5.5v13.2l3.3-3.1 2.3 5.2 2.1-.9-2.3-5.1h4.6Z"/></svg>';
const esc = (text: string) => text.replace(/[&<>"]/g, char => `&#${char.charCodeAt(0)};`);
/** A field's placeholder as word shapes laid over it, in its own font (engine/stage.js, fieldText). */
const shapes = (text: string) => text.split(/(\s+)/).map(word => /^\s*$/.test(word) ? word : `<span class="tx">${esc(word)}</span>`).join("");

/** The settings that change a figure's geometry (sizes, edges, shapes, the ring's offset), so it must measure again. */
const LAYOUT = ["data-area-type", "data-area-density", "data-area-surface", "data-area-pills", "data-area-radius", "data-area-focus-ring", "data-area-selected-stroke"] as const;

/** Parts small enough to show whole in a close-up; the rest are cropped. */
const WHOLE: ReadonlySet<Region> = new Set<Region>(["nav-current", "nav-hover", "more", "button", "primary", "tabs", "stat", "stat-selected", "stat-hover",
  "checks", "badges", "avatar", "count", "field", "segmented", "switch", "chips", "slider", "action", "menu", "menu-row", "menu-danger", "status", "form"]);

/**
 * How the figure is framed: the whole screen fitted to its frame (at most true size), or at a chosen scale centred on a
 * part (`focus`, else the middle); or one region close up at one zoom, centred on it.
 */
export type FigureView = { region?: undefined; scale?: number; focus?: Region } | { region: Region; zoom: number };
export interface RegionBox { region: Region; x: number; y: number; w: number; h: number }

export interface ScreenFigureProps {
  /** Which product screen (the Workspace by default). */
  screen?: ScreenId;
  /** The theme: data-area-* attributes for the frame. */
  scope: Record<string, string | undefined>;
  hold?: readonly Hold[];
  /** Bars (words as shapes) by default; Shapes (words gone) for a close-up that should show the change alone; Real
      where the text's colour is the question. */
  fidelity?: "shapes" | "bars" | "real";
  view?: FigureView;
  /** Regions to measure in the frame's coordinates (the stage points at them). */
  measure?: readonly Region[];
  onMeasure?: (boxes: RegionBox[]) => void;
  /** Crossfade from the last drawing when a discrete change lands (a pick, a preview); a run of changes (a drag) cuts. */
  crossfade?: boolean;
  /** The scale the figure is drawn at, once it has fitted (a zoom control's readout). */
  onFit?: (scale: number) => void;
  /** A part shown whole stands quite alone: the screen round it is hidden, not veiled (the visuals' Component view). */
  isolate?: boolean;
  className?: string;
}

/**
 * The screen in a frame: fitted whole (the stage), or a region close up at one zoom for every option of a question, so
 * the options compare (an option card). Strokes stay at exactly 1px at any zoom (figures.css, .af-zoom).
 */
export function ScreenFigure({ screen = "workspace", scope, hold = [], fidelity = "bars", view = {}, measure, onMeasure, crossfade, onFit, isolate, className }: ScreenFigureProps) {
  const frame = useRef<HTMLDivElement>(null), place = useRef<HTMLDivElement>(null), zoom = useRef<HTMLDivElement>(null), veilRef = useRef<HTMLSpanElement>(null);
  const html = markupOf(screen, hold, fidelity !== "real");
  // The crossfade: before the new choices paint, a copy of the drawing under the old ones is laid over it and fades out
  // (opacity only, on the compositor). It is the stage's own motion, so it takes the app's Speed and Easing (the Canvas
  // body's defaults) and stops under reduced motion with them.
  const full = JSON.stringify(scope);
  const before = useRef({ full, scope, at: 0 });
  useLayoutEffect(() => {
    const was = before.current, now = performance.now();
    before.current = { full, scope, at: now };
    const f = frame.current;
    if (!crossfade || !f || was.full === full || now - was.at < 280) return;
    const app = getComputedStyle(f.parentElement ?? f);
    const duration = parseFloat(app.getPropertyValue("--area-duration-moderate")) || 0;
    if (!duration) return;
    const ghost = f.cloneNode(true) as HTMLElement;
    for (const name of Object.keys(scope)) ghost.removeAttribute(name);
    for (const [name, value] of Object.entries(was.scope)) if (value !== undefined) ghost.setAttribute(name, value);
    ghost.classList.add("ss-frame--ghost");
    f.after(ghost);
    ghost.animate([{ opacity: 1 }, { opacity: 0 }], { duration, easing: app.getPropertyValue("--area-ease-out").trim() || "ease-out", fill: "forwards" })
      .finished.then(() => ghost.remove(), () => ghost.remove());
  }, [full]);
  const [size, setSize] = useState({ w: 0, h: 0 });
  useLayoutEffect(() => {
    const element = frame.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => setSize({ w: Math.round(entry!.contentRect.width), h: Math.round(entry!.contentRect.height) }));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  // Only the settings that move geometry re-measure the figure; a colour or a shadow repaints without it.
  const signature = LAYOUT.map(name => scope[name] ?? "").join(" ");
  const region = view.region, regionZoom = view.region ? view.zoom : 0;
  const scale = view.region ? undefined : view.scale, focusOn = view.region ? undefined : view.focus;
  useLayoutEffect(() => {
    const z = zoom.current, p = place.current, f = frame.current;
    if (!z || !p || !f || !size.w || !size.h) return;
    for (const node of z.querySelectorAll(".af-value, .af-pointer")) node.remove();
    // Lay out at true size to measure, then zoom.
    z.style.setProperty("--af-fit", "1");
    const root = z.firstElementChild as HTMLElement | null;
    if (!root) return;
    const origin = root.getBoundingClientRect();
    // The screen's own size: a desktop window, an example at its width, a phone.
    const natural = { w: root.offsetWidth || SCREEN.w, h: root.offsetHeight || SCREEN.h };
    const rectOf = (element: Element) => { const r = element.getBoundingClientRect(); return { x: r.left - origin.left, y: r.top - origin.top, w: r.width, h: r.height }; };
    // A region is every element marked with it (a column of badges is four), as one box.
    const regionRect = (id: Region) => {
      const boxes = [...z.querySelectorAll(`[data-region~="${id}"]`)].map(rectOf);
      if (!boxes.length) return null;
      const x = Math.min(...boxes.map(box => box.x)), y = Math.min(...boxes.map(box => box.y));
      return { x, y, w: Math.max(...boxes.map(box => box.x + box.w)) - x, h: Math.max(...boxes.map(box => box.y + box.h)) - y };
    };
    let fit: number, left: number, top: number;
    if (region) {
      const r = regionRect(region) ?? { x: 0, y: 0, w: natural.w, h: natural.h };
      // A part shows whole (a field, a button, a menu), shrunk from the question's zoom only if the frame is narrower than
      // it; a region larger than any card (the sidebar, the cards, a form) is cropped at the zoom. A part's size is the
      // same under every choice unless the choice is its size, so the choices keep one scale.
      fit = WHOLE.has(region) ? Math.min(regionZoom, (size.w * 0.84) / r.w, (size.h * 0.84) / r.h) : regionZoom;
      left = size.w / 2 - (r.x + r.w / 2) * fit;
      top = size.h / 2 - (r.y + r.h / 2) * fit;
      // Keep the window covering the frame where it is larger than it, so no edge of it shows.
      if (natural.w * fit >= size.w) left = Math.min(0, Math.max(size.w - natural.w * fit, left));
      if (natural.h * fit >= size.h) top = Math.min(0, Math.max(size.h - natural.h * fit, top));
    } else if (scale) {
      // A chosen scale: centred on the part the question changes when there is one, the screen kept over the frame.
      fit = scale;
      const r = (focusOn && regionRect(focusOn)) || { x: 0, y: 0, w: natural.w, h: natural.h };
      left = size.w / 2 - (r.x + r.w / 2) * fit;
      top = size.h / 2 - (r.y + r.h / 2) * fit;
      left = natural.w * fit >= size.w ? Math.min(0, Math.max(size.w - natural.w * fit, left)) : (size.w - natural.w * fit) / 2;
      top = natural.h * fit >= size.h ? Math.min(0, Math.max(size.h - natural.h * fit, top)) : (size.h - natural.h * fit) / 2;
    } else {
      fit = Math.min(1, size.w / natural.w, size.h / natural.h);
      left = (size.w - natural.w * fit) / 2;
      top = (size.h - natural.h * fit) / 2;
    }
    onFit?.(fit);
    // Field text as shapes, and the pointer, in the screen's own coordinates (the zoom scales them with it).
    if (fidelity !== "real") {
      for (const input of z.querySelectorAll<HTMLInputElement>("input:not([type=checkbox]):not([type=radio]):not([type=range])")) {
        const text = input.value || input.placeholder;
        if (!text.trim()) continue;
        const style = getComputedStyle(input), r = rectOf(input), px = (name: string) => parseFloat(style.getPropertyValue(name)) || 0;
        const inset = { l: px("border-left-width") + px("padding-left"), r: px("border-right-width") + px("padding-right"), t: px("border-top-width") + px("padding-top"), b: px("border-bottom-width") + px("padding-bottom") };
        const overlay = document.createElement("div");
        overlay.className = "af-value";
        Object.assign(overlay.style, { left: `${r.x + inset.l}px`, top: `${r.y + inset.t}px`, width: `${Math.max(0, r.w - inset.l - inset.r)}px`, height: `${Math.max(0, r.h - inset.t - inset.b)}px`,
          font: style.font, color: input.value ? style.color : "var(--area-input-placeholder, var(--area-fg-muted))", whiteSpace: "pre", alignItems: "center" });
        overlay.innerHTML = `<span>${shapes(text)}</span>`;
        root.append(overlay);
      }
    }
    for (const target of z.querySelectorAll("[data-af-pointer]")) {
      const r = rectOf(target);
      root.insertAdjacentHTML("beforeend", POINTER);
      const pointer = root.lastElementChild as HTMLElement;
      pointer.style.left = `${(r.x + Math.min(r.w * 0.7, r.w - 12)).toFixed(1)}px`;
      pointer.style.top = `${(r.y + r.h * 0.55).toFixed(1)}px`;
    }
    const boxes = measure?.map(id => {
      const r = regionRect(id);
      if (!r) return null;
      return { region: id, x: left + r.x * fit, y: top + r.y * fit, w: r.w * fit, h: r.h * fit };
    }).filter((box): box is RegionBox => box !== null) ?? [];
    // A part shown whole stands alone: the screen round it is veiled in the page's colour (ss-frame__veil), the veil
    // opening 12px past the part so its shadow and ring still show. Measured before the zoom, as everything above.
    const veil = veilRef.current, part = region && WHOLE.has(region) ? regionRect(region) : null;
    if (veil) {
      veil.hidden = !part;
      const room = 12;
      if (part) Object.assign(veil.style, { left: `${left + part.x * fit - room}px`, top: `${top + part.y * fit - room}px`, width: `${part.w * fit + 2 * room}px`, height: `${part.h * fit + 2 * room}px` });
    }
    z.style.setProperty("--af-fit", fit.toFixed(4));
    p.style.left = `${left.toFixed(1)}px`;
    p.style.top = `${top.toFixed(1)}px`;
    onMeasure?.(boxes);
  }, [html, signature, size.w, size.h, region, regionZoom, scale, focusOn, fidelity, measure?.join(" ")]);
  return (
    <div ref={frame} className={`ss-frame af-${fidelity}${className ? ` ${className}` : ""}`} inert aria-hidden="true" {...scope}>
      <div ref={place} className="ss-frame__place"><div ref={zoom} className="af-zoom" dangerouslySetInnerHTML={{ __html: html }} /></div>
      <span ref={veilRef} className={isolate ? "ss-frame__veil ss-frame__veil--solid" : "ss-frame__veil"} hidden />
    </div>
  );
}
