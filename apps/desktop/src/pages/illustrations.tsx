/**
 * Illustrations: the system's library of abstract UI (owner, 2026-11-04: "i want to work on the library of abstract ui
 * again, put these under 'illustrations' under areas system. i want to establish a cohesive, consistent style that is
 * visually appealing and high fidelity. im really liking the last few line art examples showing cosmetic products").
 *
 * Every illustration is Area's real components (the area-illustration skill's figures: its screens, phones and vignettes,
 * and every family's first gallery specimen), drawn by the skill's engine. The house style is Line (engine/line.js and
 * abstract.css, after the references in docs/research/illustrations-2026-11-04): one ink, one 1px line, no fills or
 * shadows, words as rules, headings outlined, pictures as a box with a cross, on the page's ground. It is one of the
 * styles (STYLES): each a value on the engine's eight axes (stroke, ink, fill, shadow, words, detail, pictures, accent),
 * chosen in the Canvas bar's Style menu or mixed axis by axis in the Inspector's Theme view, applied to every figure.
 *
 *   Styles      one sampler (a picture card, a form, a floating menu) in every style, from detailed to abstract
 *   Sheets      a few components of one kind on one baseline, numbered and named under each, their true width and height
 *               drawn as dimension lines (the references' product line-ups); the sizes are measured, never typed
 *   Screens     14 desktop screens (1024 × 576)
 *   Phones      6 iPhone screens (390 × 844)
 *   Vignettes   16 components in context (480 × 360)
 *   Components  every family, one specimen each, by kind of UI
 *
 * One scale per kind of frame (the skill's rule 04): a screen fills its card's width less a margin, a phone its height,
 * a vignette its frame; a component grows up to 2.4× its tile's scale and is centred on what it paints. Each figure is
 * drawn once it nears the view and again when its card changes size or the theme changes.
 *
 * Location: #system/<system>/illustrations/<section>/<illustration>.
 */
import { useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Count, PanelSection, Select } from "@area/react";
import { figureMarkup } from "../../../../.claude/skills/area-illustration/engine/markup.js";
import { AFS, type Fidelity } from "../../../../.claude/skills/area-illustration/engine/stage.js";
import { DESKTOP, ISOLATED, MOBILE } from "../../../../.claude/skills/area-illustration/figures/screens.jsx";
import { KINDS, SHOW } from "../../../../.claude/skills/area-illustration/figures/index.jsx";
// @ts-expect-error — the gallery's page content is authored in JavaScript (as pages/components.tsx imports it).
import { COMPONENT_PAGES } from "../content/pages.mjs";
// @ts-expect-error — as above.
import { componentSpecimens, demoWrapper } from "../content/specimens.mjs";
import { DEMOS } from "../content/registry.tsx";
import { SidebarList, SidebarTree, useStudio, Workspace } from "../studio.tsx";
import { CanvasSection, TileGrid, Tile } from "../tile.tsx";
import { ViewControls, ViewFilter } from "../view-controls.tsx";
import { CanvasSettings } from "../canvas-settings.tsx";
import { Facts } from "../facts.tsx";
import { Selection } from "../inspector.tsx";
import { RowField } from "../inspector-rows.tsx";
import { matches } from "../search.ts";
import { readStored, writeStored } from "../storage.ts";

type Frame = "styles" | "sheet" | "screen" | "phone" | "vignette" | "component";
interface Illustration {
  id: string;
  name: string;
  frame: Frame;
  /** What it is drawn from, for the Inspector. */
  from: string;
  /** Its markup, rendered once when first drawn. */
  markup: () => string;
  /** Its own style (a style's sampler); else the page's. */
  look?: Look;
}
interface Section { id: string; name: string; lede: string; group: "library" | "components"; items: Illustration[] }

/** Each frame's true size, and the card it sits in. */
const FRAMES: Record<Frame, { w: number; h: number; shape: "wide" | "square"; label: string }> = {
  styles: { w: 1440, h: 360, shape: "wide", label: "Style sampler" },
  sheet: { w: 1200, h: 600, shape: "wide", label: "Sheet" },
  screen: { w: 1024, h: 576, shape: "wide", label: "Desktop screen" },
  phone: { w: 390, h: 844, shape: "square", label: "iPhone screen" },
  vignette: { w: 480, h: 360, shape: "wide", label: "Vignette" },
  component: { w: 480, h: 360, shape: "square", label: "Component" },
};

/*
 * Styles (owner, 2026-11-04: "show me a bunch of different styles, i dont like exploded views that much, prefer straight
 * on, want to see a variety of fills, strokes, shadows, abstractness vs detail"). A style is a value on each of the
 * engine's axes (abstract.css, "Line"), every figure drawn straight on; the Inspector mixes them one by one.
 */
export const STYLE_AXES = [
  { id: "stroke", label: "Stroke", options: [["hair", "Hairline"], ["regular", "Regular"], ["bold", "Bold"], ["none", "None"]] },
  { id: "ink", label: "Ink", options: [["muted", "Muted"], ["strong", "Strong"], ["accent", "Accent"]] },
  { id: "fill", label: "Fill", options: [["none", "None"], ["paper", "Paper"], ["soft", "Soft"], ["tonal", "Tonal"], ["color", "Color"]] },
  { id: "shadow", label: "Shadow", options: [["none", "None"], ["soft", "Soft"], ["hard", "Hard"], ["real", "Theme's"]] },
  { id: "text", label: "Words", options: [["rule", "Rules"], ["bar", "Bars"], ["outline", "Outlines"], ["real", "Words"], ["none", "None"]] },
  { id: "detail", label: "Detail", options: [["full", "Full"], ["reduced", "No icons"], ["blocks", "Blocks"]] },
  { id: "pic", label: "Pictures", options: [["cross", "Cross"], ["glyph", "Glyph"], ["tone", "Tone"], ["hatch", "Hatching"]] },
  { id: "accent", label: "Accent", options: [["none", "None"], ["primary", "Primary"]] },
] as const;
type Axes = Record<(typeof STYLE_AXES)[number]["id"], string>;
const BASE: Axes = { stroke: "hair", ink: "muted", fill: "none", shadow: "none", text: "rule", detail: "full", pic: "cross", accent: "none" };
interface Look { fidelity: Fidelity; axes: Axes }
/** The styles, from the most detailed to the most abstract within each family of looks. */
const STYLES: ReadonlyArray<{ id: string; name: string; about: string; fidelity?: Fidelity; axes?: Partial<Axes> }> = [
  { id: "real", name: "Real UI", about: "The components as they ship, scaled down to fit their card.", fidelity: "real" },
  { id: "hairline", name: "Hairline", about: "One muted 1px line, words as rules, no fills or shadows." },
  { id: "annotated", name: "Annotated", about: "Hairline with the words themselves, in a strong ink.", axes: { ink: "strong", text: "real" } },
  { id: "outlined", name: "Outlined words", about: "Hairline, every word an outlined pill, pictures as a glyph.", axes: { text: "outline", pic: "glyph" } },
  { id: "ink", name: "Ink", about: "A heavier strong line on paper, layers hiding what is under them, hatched pictures.", axes: { stroke: "regular", ink: "strong", fill: "paper", pic: "hatch" } },
  { id: "blueprint", name: "Blueprint", about: "The accent's ink and its light tone, as a drawing on blue.", axes: { ink: "accent", fill: "soft" } },
  { id: "accent", name: "Accent", about: "Hairline with what is on or primary in the accent.", axes: { accent: "primary", pic: "glyph" } },
  { id: "paper", name: "Paper and shadow", about: "White layers lifted by a soft shadow, hairline edges, words as bars.", axes: { fill: "paper", shadow: "soft", text: "bar", pic: "glyph" } },
  { id: "soft", name: "Soft", about: "No lines: light tones and soft shadows, words as bars.", axes: { stroke: "none", fill: "soft", shadow: "soft", text: "bar", pic: "tone" } },
  { id: "wireframe", name: "Grey wireframe", about: "Area's fills in grey under hairlines, words as bars.", axes: { fill: "tonal", text: "bar", pic: "tone" } },
  { id: "mono", name: "Mono render", about: "Area's fills and shadows in grey, no lines.", axes: { stroke: "none", fill: "tonal", shadow: "real", text: "bar", pic: "tone" } },
  { id: "sticker", name: "Sticker", about: "A bold strong line, paper fills, a hard offset shadow, no icons.", axes: { stroke: "bold", ink: "strong", fill: "paper", shadow: "hard", text: "outline", detail: "reduced", pic: "hatch" } },
  { id: "color", name: "Color", about: "Area's own colors and shadows, words as bars.", axes: { fill: "color", shadow: "real", text: "bar", pic: "tone", accent: "primary" } },
  { id: "outline-blocks", name: "Outline blocks", about: "Only the containers, as hairlines.", axes: { text: "none", detail: "blocks" } },
  { id: "blocks", name: "Blocks", about: "Only the containers, as grey blocks, no lines.", axes: { stroke: "none", fill: "tonal", text: "none", detail: "blocks", pic: "tone" } },
  { id: "bars", name: "Bars (October)", about: "The earlier figures: real paint, words as coloured bars.", fidelity: "bars" },
];
const lookOf = (id: string): Look => {
  const style = STYLES.find(entry => entry.id === id) ?? STYLES[0]!;
  return { fidelity: style.fidelity ?? "line", axes: { ...BASE, ...style.axes } };
};
const styleOf = (look: Look) => STYLES.find(entry => (entry.fidelity ?? "line") === look.fidelity
  && (look.fidelity !== "line" || STYLE_AXES.every(axis => ({ ...BASE, ...entry.axes })[axis.id] === look.axes[axis.id])));

/* ---- Markup ------------------------------------------------------------------------------------------------- */

const cache = new Map<string, string>();
const once = (key: string, render: () => ReactNode) => () => {
  let html = cache.get(key);
  if (html === undefined) {
    try { html = figureMarkup(renderToStaticMarkup(<>{render()}</>)); } catch (error) { html = ""; console.warn(`Illustration ${key}:`, error); }
    cache.set(key, html);
  }
  return html;
};
const cssOf = (css?: string) => css ? Object.fromEntries(css.split(";").filter(Boolean).map(rule => {
  const [key, ...value] = rule.split(":");
  return [key!.trim().replace(/-([a-z])/g, (_, c: string) => c.toUpperCase()), value.join(":").trim()];
})) as CSSProperties : undefined;

interface Family { slug: string; name: string; docsOnly?: boolean }
const FAMILY = new Map<string, Family>((COMPONENT_PAGES as Family[]).filter(page => !page.docsOnly).map(page => [page.slug, page]));
/** A family's specimens as the gallery draws them (SHOW names the few shown other than by their first). */
function specimens(slug: string, all = false): ReactNode[] {
  const page = FAMILY.get(slug);
  if (!page) return [];
  const pick = SHOW[slug];
  if (pick?.node && !all) return [pick.node()];
  const list = (componentSpecimens(page, (name: string) => name in DEMOS) as Array<{ id: string; demo: string }>).filter(sp => DEMOS[sp.demo]);
  const chosen = pick?.ids && !all ? pick.ids.map(id => list.find(sp => sp.id === id)).filter(Boolean) as typeof list : list.slice(0, 1);
  return chosen.map(sp => {
    const Demo = DEMOS[sp.demo] as () => ReactNode;
    return <div key={sp.id} className={`af-tile__demo${pick?.open ? " af-open" : ""}`} style={cssOf((demoWrapper(sp.demo) as { style?: string } | null)?.style)}><Demo /></div>;
  });
}
/** A family in its gallery tile (480 × 360): one specimen, or the few SHOW lays out together. */
const componentTile = (slug: string) => {
  const layout = SHOW[slug]?.layout ?? "single";
  return (
    <div className={`af-tile${layout === "single" ? "" : ` af-tile--${layout}`}`} style={SHOW[slug]?.cols ? { "--cols": SHOW[slug]!.cols } as CSSProperties : undefined}>
      {specimens(slug)}
    </div>
  );
};

/**
 * Sheets: a few families of one kind on one baseline, as the references line up a product range, each numbered and
 * named. The parts are laid out at their true size; the sheet is scaled to its card as a whole.
 */
const SHEETS: ReadonlyArray<{ id: string; name: string; parts: string[] }> = [
  { id: "actions", name: "Actions", parts: ["button", "segmented", "toggle-group", "zoom-control"] },
  { id: "fields", name: "Fields", parts: ["input", "select", "number-field", "search-field"] },
  { id: "choice", name: "Choice", parts: ["checkbox", "radio", "switch", "slider"] },
  { id: "surfaces", name: "Surfaces", parts: ["card", "menu", "popover", "toast"] },
  { id: "navigation", name: "Navigation", parts: ["tabs", "breadcrumb", "pagination", "stepper"] },
  { id: "marks", name: "Marks", parts: ["avatar", "badge", "count", "kbd", "indicator"] },
  { id: "files", name: "Files", parts: ["folder", "file-tile", "file-image", "asset-card"] },
  { id: "conversation", name: "Conversation", parts: ["message", "composer"] },
];
const sheet = (parts: string[]) => (
  <div className="ill-sheet">
    {parts.map((slug, index) => (
      <figure key={slug} className="ill-sheet__part" data-ill-part={`${String(index + 1).padStart(2, "0")}|${FAMILY.get(slug)?.name ?? slug}`}>
        {specimens(slug)[0]}
      </figure>
    ))}
  </div>
);

/** A style's sampler: three vignettes side by side (a picture card, a form, a floating menu), the same for every style. */
const SAMPLER = ["music", "form", "menu"] as const;
const sampler = () => <div className="ill-sampler">{SAMPLER.map(id => { const Screen = ISOLATED[id]![1]; return <Screen key={id} />; })}</div>;

const SECTIONS: Section[] = [
  { id: "styles", name: "Styles", group: "library", lede: "One sampler in every style, straight on: strokes, fills, shadows, from detailed to abstract.",
    items: STYLES.map(entry => ({ id: entry.id, name: entry.name, frame: "styles", from: entry.about, look: lookOf(entry.id), markup: once("styles", sampler) })) },
  { id: "sheets", name: "Sheets", group: "library", lede: "Components of one kind on one baseline, each named, at their measured size.",
    items: SHEETS.map(entry => ({ id: entry.id, name: entry.name, frame: "sheet", from: entry.parts.map(slug => FAMILY.get(slug)?.name ?? slug).join(", "), markup: once(`sheet:${entry.id}`, () => sheet(entry.parts)) })) },
  { id: "screens", name: "Screens", group: "library", lede: "Desktop screens built from the system's components.",
    items: Object.entries(DESKTOP).map(([id, [name, Screen]]) => ({ id, name, frame: "screen", from: "Screens", markup: once(`screen:${id}`, () => <Screen />) })) },
  { id: "phones", name: "Phones", group: "library", lede: "iPhone screens at type 16, density 36.",
    items: Object.entries(MOBILE).map(([id, [name, Screen]]) => ({ id, name, frame: "phone", from: "Phones", markup: once(`phone:${id}`, () => <Screen />) })) },
  { id: "vignettes", name: "Vignettes", group: "library", lede: "Components in context, close up.",
    items: Object.entries(ISOLATED).map(([id, [name, Screen]]) => ({ id, name, frame: "vignette", from: "Vignettes", markup: once(`vignette:${id}`, () => <Screen />) })) },
  ...KINDS.map(([kind, slugs]) => ({
    id: kind.toLowerCase().replace(/[^a-z0-9]+/g, "-"), name: kind, group: "components" as const, lede: "One specimen of each family.",
    items: slugs.filter(slug => FAMILY.has(slug)).map(slug => ({ id: slug, name: FAMILY.get(slug)!.name, frame: "component" as const, from: FAMILY.get(slug)!.name, markup: once(`component:${slug}`, () => componentTile(slug)) })),
  })),
];

/* ---- Staging ------------------------------------------------------------------------------------------------ */

/*
 * How each frame sits in its card. Styles and Sheets are wide comparisons; everything else is a gallery card (owner,
 * 2026-11-04: "all the illustrations would be presented just like first image if they were in a gallery"): one portrait
 * card of a plain neutral ground, four across, the UI centred on what it paints and scaled down to fit with a wide margin
 * (about a sixth of the card each side), never up past `GROW` of its true size. A phone stands from the upper part of
 * its card and runs off the bottom, as a held phone is shown.
 */
const CARD = 290; // the card's width at which the scales below were set (four across a 1440 window)
const GROW = 1.1; // the scale every component and vignette shares at CARD; only what doesn't fit shrinks
function layoutFor(frame: Frame, w: number, h: number) {
  const { w: W, h: H } = FRAMES[frame];
  const tile = Math.min(w / W, h / H);
  switch (frame) {
    case "styles": return { fit: tile };
    // A sheet is scaled whole to fill its card, up to 1.6× (its notes still give the true sizes).
    case "sheet": return { fit: tile, center: "contain" as const, pad: 0.78, max: 1.6 };
    case "phone": return { fit: (w * 0.6) / W, top: 0.14 };
    case "screen": return { fit: tile, center: "contain" as const, pad: 0.74, max: 1 };
    case "vignette": return { fit: tile, center: "contain" as const, pad: 0.66, max: (w / CARD) * GROW };
    default: return { fit: tile, center: "contain" as const, pad: 0.7, max: (w / CARD) * GROW };
  }
}
/** The frames a gallery card holds (the rest are wide). */
const GALLERY = new Set<Frame>(["screen", "phone", "vignette", "component"]);

const SVG = "http://www.w3.org/2000/svg";
/**
 * A sheet's annotations, in the card's own pixels so they stay 1px and 10px at any scale: under each part its width as a
 * dimension line (ticks at the ends, extension lines dotted up to the part), its height on the right, then its number and
 * name. The values are the part's painted size at the true scale, rounded to the pixel.
 */
function annotate(stage: HTMLElement) {
  const fit = parseFloat(stage.style.getPropertyValue("--af-fit")) || 1;
  const frame = stage.getBoundingClientRect();
  const svg = document.createElementNS(SVG, "svg");
  svg.setAttribute("class", "ill-notes");
  svg.setAttribute("aria-hidden", "true");
  const line = (x1: number, y1: number, x2: number, y2: number, dotted = false) => {
    const el = document.createElementNS(SVG, "line");
    for (const [k, v] of Object.entries({ x1, y1, x2, y2 })) el.setAttribute(k, (Math.round(v) + 0.5).toString());
    if (dotted) el.setAttribute("class", "ill-notes__ext");
    svg.append(el);
  };
  const text = (x: number, y: number, value: string, kind: string, anchor = "middle") => {
    const el = document.createElementNS(SVG, "text");
    el.setAttribute("x", String(Math.round(x)));
    el.setAttribute("y", String(Math.round(y)));
    el.setAttribute("text-anchor", anchor);
    el.setAttribute("class", `ill-notes__${kind}`);
    el.textContent = value;
    svg.append(el);
    return el;
  };
  const parts = [...stage.querySelectorAll<HTMLElement>("[data-ill-part]")];
  const boxes = parts.map(part => AFS.painted(part)).filter(Boolean) as Array<{ l: number; t: number; r: number; b: number }>;
  if (!boxes.length) return;
  // One baseline for the notes, under the lowest part, as the references set their names on one line.
  const base = Math.max(...boxes.map(box => box.b)) - frame.top;
  parts.forEach((part, index) => {
    const box = boxes[index];
    if (!box) return;
    const l = box.l - frame.left, r = box.r - frame.left, t = box.t - frame.top, b = box.b - frame.top;
    const [number, name] = (part.dataset.illPart ?? "").split("|");
    // Width, under the part.
    const y = base + 14;
    line(l, b + 3, l, y + 4, true);
    line(r, b + 3, r, y + 4, true);
    line(l, y, r, y);
    line(l, y - 3, l, y + 3);
    line(r, y - 3, r, y + 3);
    const width = text((l + r) / 2, y - 5, String(Math.round((box.r - box.l) / fit)), "value");
    if (r - l < 26) width.setAttribute("y", String(Math.round(y + 13)));
    // Height, on the right.
    const x = r + 10;
    line(r + 3, t, x + 4, t, true);
    line(r + 3, b, x + 4, b, true);
    line(x, t, x, b);
    line(x - 3, t, x + 3, t);
    line(x - 3, b, x + 3, b);
    text(x + 6, (t + b) / 2 + 3.5, String(Math.round((box.b - box.t) / fit)), "value", "start");
    // Its number and name, on the sheet's one line.
    const caption = text(l, base + 40, "", "name", "start");
    const n = document.createElementNS(SVG, "tspan");
    n.setAttribute("class", "ill-notes__number");
    n.textContent = `${number}  `;
    caption.append(n, document.createTextNode(name ?? ""));
  });
  stage.append(svg);
}

const axesOn = (stage: HTMLElement, axes: Axes) => { for (const [axis, value] of Object.entries(axes)) stage.setAttribute(`data-af-${axis}`, value); };

/** One illustration, drawn into its card by the engine once it nears the view, and again when its card or the theme changes. */
function Figure({ item, look: pageLook, theme }: { item: Illustration; look: Look; theme: string }) {
  const host = useRef<HTMLDivElement>(null);
  const look = item.look ?? pageLook;
  const drawing = look.fidelity;
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const resize = new ResizeObserver(([entry]) => setSize({ w: Math.round(entry!.contentRect.width), h: Math.round(entry!.contentRect.height) }));
    const near = new IntersectionObserver(([entry]) => { if (entry!.isIntersecting) { setSeen(true); near.disconnect(); } }, { rootMargin: "600px 0px" });
    resize.observe(el);
    near.observe(el);
    return () => { resize.disconnect(); near.disconnect(); };
  }, []);
  useLayoutEffect(() => {
    const el = host.current;
    if (!el || !seen || size.w < 8 || size.h < 8) return;
    el.replaceChildren();
    const { fit, center = null, pad = 1, max = fit, top } = layoutFor(item.frame, size.w, size.h) as { fit: number; center?: "contain"; pad?: number; max?: number; top?: number };
    const stage = AFS.stage(el, { html: item.markup(), w: size.w, h: size.h, fit, center, pad, max, fidelity: drawing });
    axesOn(stage, look.axes);
    if (top !== undefined) {
      // Stand it from `top` of the card, centred across, on what it paints.
      const zoom = stage.firstElementChild as HTMLElement, box = stage.getBoundingClientRect(), p = AFS.painted(zoom);
      if (p) {
        stage.style.setProperty("--af-dx", `${(box.left + box.width / 2 - (p.l + p.r) / 2).toFixed(1)}px`);
        stage.style.setProperty("--af-dy", `${(box.top + box.height * top - p.t).toFixed(1)}px`);
      }
    }
    if (item.frame === "sheet" && drawing !== "real") {
      // The notes hang about 44px under the parts: lift the sheet half that, so parts and notes centre together.
      stage.style.setProperty("--af-dy", `${(parseFloat(stage.style.getPropertyValue("--af-dy")) || 0) - 22}px`);
      annotate(stage);
    }
  }, [seen, size.w, size.h, item, drawing, theme]);
  // A change of axes repaints the drawing as it is: the marks don't depend on them.
  const axes = JSON.stringify(look.axes);
  useEffect(() => { const stage = host.current?.querySelector<HTMLElement>(".af-stage"); if (stage) axesOn(stage, look.axes); }, [axes]);
  return <div ref={host} className="ill-figure" data-frame={item.frame} inert aria-hidden="true" />;
}

/* ---- The page ----------------------------------------------------------------------------------------------- */

export function IllustrationsPage() {
  const { item, select, query, theme } = useStudio();
  const [sectionId, chosenId] = (item ?? "").split("/");
  const view = SECTIONS.find(section => section.id === sectionId);
  const [selected, setSelected] = useState<string>();
  useEffect(() => setSelected(chosenId), [sectionId, chosenId]);
  const [look, setLookState] = useState<Look>(() => {
    // Real UI is the default (owner, 2026-11-04: "maybe can just rely on real ui, but scaled down to fit").
    const saved = readStored<Partial<Look>>("illustrationsStyle", {});
    return { fidelity: saved.fidelity ?? "real", axes: { ...BASE, ...saved.axes } };
  });
  const setLook = (next: Look) => { setLookState(next); writeStored("illustrationsStyle", next); };
  const current = styleOf(look);
  const shown = useMemo(() => (view ? [view] : SECTIONS)
    .map(section => ({ ...section, items: section.items.filter(entry => matches(query, entry.name, section.name, entry.from)) }))
    .filter(section => section.items.length), [view, query]);
  const all = SECTIONS.flatMap(section => section.items.map(entry => ({ section, entry })));
  const chosen = selected ? all.find(({ section, entry }) => `${section.id}:${entry.id}` === selected || entry.id === selected) : undefined;
  const total = shown.reduce((sum, section) => sum + section.items.length, 0);
  const tree = (group: Section["group"]) => SECTIONS.filter(section => section.group === group)
    .map(section => ({ id: section.id, label: section.name, trailing: <Count count={section.items.length} /> }));

  return (
    <Workspace
      sidebar={<SidebarList>
        <SidebarTree label="Illustrations" count={SECTIONS.reduce((sum, section) => sum + section.items.length, 0)} current={view?.id} onSelect={select}
          groups={[{ id: "library", label: "Library", items: tree("library") }, { id: "components", label: "Components", items: tree("components") }]} />
      </SidebarList>}
      canvasTitle={view ? view.name : "All illustrations"}
      canvasActions={
        <ViewControls>
          {/* The style every figure is drawn in (Styles shows each); the Inspector mixes its axes. */}
          <ViewFilter label="Style" value={current?.id ?? "custom"} onChange={id => { if (id !== "custom") setLook(lookOf(id)); }}
            options={[...STYLES.map(entry => ({ value: entry.id, label: entry.name })), ...(current ? [] : [{ value: "custom", label: "Custom" }])]} />
        </ViewControls>
      }
      canvas={
        <div className="studio-sections studio-illustrations">
          {shown.map(section => {
            const frame = section.items[0]!.frame;
            const shape = GALLERY.has(frame) ? "square" : FRAMES[frame].shape;
            return (
              <CanvasSection key={section.id} id={`illustrations-${section.id}`} title={view ? undefined : section.name} count={section.items.length} lede={view ? undefined : section.lede}>
                <TileGrid span={shape === "wide" ? "wide" : "unit"} cards={GALLERY.has(frame)} className={GALLERY.has(frame) ? "ill-grid--gallery" : `ill-grid--${section.id}`}>
                  {section.items.map(entry => {
                    const key = `${section.id}:${entry.id}`;
                    return (
                      <Tile key={key} span={shape === "wide" ? "wide" : "unit"} shape={shape} stage="screen" design={false} inert label={entry.name}
                        selected={chosen?.entry === entry} onSelect={() => { setSelected(key); if (entry.look) setLook(entry.look); }} data-key={key}>
                        <Figure item={entry} look={look} theme={theme} />
                      </Tile>
                    );
                  })}
                </TileGrid>
              </CanvasSection>
            );
          })}
          {total ? null : <p className="studio-muted">Nothing matches “{query}”.</p>}
        </div>
      }
      inspector={{
        theme: <>
          <PanelSection heading="Illustration style">
            <RowField label="Style" orientation="horizontal" reset={false}>
              <Select size="sm" value={current?.id ?? "custom"} onChange={event => { if (event.currentTarget.value !== "custom") setLook(lookOf(event.currentTarget.value)); }}>
                {STYLES.map(entry => <option key={entry.id} value={entry.id}>{entry.name}</option>)}
                {current ? null : <option value="custom">Custom</option>}
              </Select>
            </RowField>
            {STYLE_AXES.map(axis => (
              <RowField key={axis.id} label={axis.label} orientation="horizontal" reset={false}>
                <Select size="sm" value={look.axes[axis.id]} disabled={look.fidelity !== "line"}
                  onChange={event => setLook({ fidelity: "line", axes: { ...look.axes, [axis.id]: event.currentTarget.value } })}>
                  {axis.options.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                </Select>
              </RowField>
            ))}
          </PanelSection>
          <CanvasSettings axes={["type", "density", "radius"]} />
        </>,
        design: chosen ? (
          <>
            <Selection preview={<div className="ill-preview" data-shape={FRAMES[chosen.entry.frame].shape} data-frame={GALLERY.has(chosen.entry.frame) ? "gallery" : undefined}><Figure item={chosen.entry} look={look} theme={theme} /></div>} />
            <PanelSection heading="Illustration">
              <Facts label="Illustration" items={[
                ["Name", chosen.entry.name],
                ["Kind", FRAMES[chosen.entry.frame].label],
                ["Section", chosen.section.name],
                chosen.entry.frame === "sheet" || chosen.entry.frame === "component" ? ["Drawn from", chosen.entry.from] : null,
                ["Frame", `${FRAMES[chosen.entry.frame].w} × ${FRAMES[chosen.entry.frame].h}`],
                ["Style", current?.name ?? "Custom"],
              ]} note={chosen.entry.frame === "styles" ? chosen.entry.from : undefined} />
            </PanelSection>
          </>
        ) : (
          <PanelSection heading={view ? view.name : "Illustrations"}>
            <Facts label="Illustrations" items={[
              ["Illustrations", view ? view.items.length : all.length],
              ...(view ? [] : SECTIONS.filter(section => section.group === "library").map(section => [section.name, section.items.length] as [string, number])),
              view ? null : ["Components", SECTIONS.filter(section => section.group === "components").reduce((sum, section) => sum + section.items.length, 0)],
              ["Style", current?.name ?? "Custom"],
            ]} note={current ? STYLES.find(entry => entry === current)!.about : "A mix of the axes in the Theme view."} />
          </PanelSection>
        ),
      }}
    />
  );
}
