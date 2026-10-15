/**
 * Tile fitting for the component gallery.
 *
 * Tiles are 5:4, all one size, and share the canvas width (component-gallery.mjs: as many columns
 * as fit at --docs-tile-min, stretched to fill). Every specimen is shown as close to its real size
 * as its tile allows (owner, 2026-10-11: "i want all the components, especially the smaller
 * components, to appear closer to their actual size"; was at most 0.8 from 2026-10-04): a Badge
 * or a Button at 1:1, and anything larger scaled down uniformly until it fits. A dialog or a
 * table shrinks rather than taking a larger tile.
 *
 * A specimen that stretches to its container is laid out wider than the view (the view / MAX, and
 * wider again if its text would truncate there), then scaled to fit, so it shows its natural
 * layout rather than one squeezed to the tile.
 *
 * The shrink is CSS `zoom`, not a transform (motion and crispness pass, 2026-10-07): zoom lays the
 * specimen out again at the smaller size, so borders, rings and icon strokes snap to device pixels;
 * a `scale` of 0.736 painted every 1px edge between pixels, the gallery's "pixelated" look
 * (docs/research/motion-2026-10-07/crispness-and-current-state.md).
 *
 * Sizes are measured, not declared: a new specimen gets its scale from what it renders. Fluid
 * widths are decided once at the default UI scale; scale follows the specimen and the tile live.
 */

/*
 * Two ways to show a specimen (owner, 2026-10-14), read from the nearest [data-zoom]:
 *   fit   by size group (owner, 2026-10-14: "make all small controls scale to the same ratio …
 *         grouping the components based on size groups and making that specific group set to the
 *         same scale %"): a specimen's group is its height at the default type and density (a
 *         control's height is what makes controls read alike; a field is as wide as its card), and
 *         every specimen in a group shows at the group's scale (GROUPS), so a Button, a Switch and
 *         an Input stay in proportion; one that stretches is laid out at its tile over that scale,
 *         so it fills the tile at it; the tallest are 1:1, shrunk only to fit their tile
 *   0.5…2 a true zoom: every specimen at exactly that scale, its tile growing above 100%; one larger
 *         than its tile at that zoom is cut off by the tile, as a canvas at 100% shows what fits
 */
/** The scale of everything outside the groups, and of fluid specimens, under Fit. */
const MAX = 1;
/*
 * Fit's size groups, shortest first, by the specimen's own height (Compass shows its Button at its
 * 56-tall large size, about 1.75x a 32 Button; 200% read "insanely large"):
 *   control  one row of controls, up to 48 (Button, Badge, Switch, Input, Segmented, Tabs)    125%
 *            (owner, 2026-10-14: "use 125% for the controls group"; was 150%)
 *   cluster  a few rows, up to 160 (a radio list, a small menu, an Accordion)                125%
 *   panel    anything taller (a Dialog, a Table, a Calendar)                                 100%
 * Controls and clusters now share 125% and stay two groups, so either can move on its own. A
 * specimen its group's scale would not fit in its tile (a wide fixed one, a narrow Canvas) is
 * shrunk to fit.
 */
const GROUPS = [{ name: "control", h: 48, scale: 1.25 }, { name: "cluster", h: 160, scale: 1.25 }] as const;
const groupOf = (size: Box) => GROUPS.find(group => size.h <= group.h);
/** A width no specimen fills unless it stretches to its container: tells fluid from fixed. */
const PROBE = 1040;
/** How much wider than its view a fluid specimen may be laid out to keep its text whole. */
const WIDEN = [1, 1.25, 1.5, 2];

interface Box { w: number; h: number }
interface Tile {
  tile: HTMLElement;
  view: HTMLElement;
  stage: HTMLElement;
  fluid: boolean;
  natural: number;
  /** Fit's scale for its size group (MAX outside the groups). */
  group: number;
  /** For a fluid specimen whose content reads narrower than its tile: the width it is laid out at. */
  hug?: number;
  /** For a fluid specimen: its layout width over the view's room at MAX. */
  widen: number;
}

/*
 * What a specimen paints: the union of its Area elements, icons and images. Demo wrappers that
 * stretch to the stage are not the specimen; a visually hidden label (1 x 1) paints nothing; a
 * surface open in the top layer is drawn outside the tile; and whatever an element clips (an
 * indeterminate Progress bar sliding along its track) counts only as far as the clip. Measured
 * in the stage's own (unscaled) pixels.
 */
function extent(stage: HTMLElement): Box {
  let left = Infinity, top = Infinity, right = -Infinity, bottom = -Infinity;
  const clips = new Map<Element, boolean>();
  // The outermost ancestor inside the stage that clips this node, if any.
  const clipOf = (node: Element) => {
    let clip: Element | null = null;
    for (let parent = node.parentElement; parent && parent !== stage; parent = parent.parentElement) {
      if (!clips.has(parent)) { const style = getComputedStyle(parent); clips.set(parent, style.overflowX !== "visible" || style.overflowY !== "visible"); }
      if (clips.get(parent)) clip = parent;
    }
    return clip;
  };
  for (const node of stage.querySelectorAll<Element>('[class*="area-"], svg, img')) {
    if (node.tagName.toLowerCase() !== "svg" && node.closest("svg")) continue;
    if (node.classList.contains("area-sr-only") || node.closest(":popover-open, dialog:modal")) continue;
    const own = node.getBoundingClientRect();
    if (own.width <= 1 && own.height <= 1) continue;
    const rect = clipOf(node)?.getBoundingClientRect() ?? own;
    left = Math.min(left, rect.left); top = Math.min(top, rect.top);
    right = Math.max(right, rect.right); bottom = Math.max(bottom, rect.bottom);
  }
  if (!Number.isFinite(left)) return { w: 0, h: 0 };
  const scale = Number(stage.style.zoom) || 1;
  return { w: (right - left) / scale, h: (bottom - top) / scale };
}

/*
 * How wide a stretching specimen's content reads (owner, 2026-10-14: a long row whose visible text
 * takes a smaller width leaves "a bunch of negative space on the side"): from the specimen's start
 * to the end of its last text or icon, and the start inset again on the other side, as the box
 * would be drawn round that content, laid out wide so nothing wraps; or, when narrower, its own
 * max-content width (a row that pushes its parts to its ends, a Token row's name and hex, keeps
 * them side by side with its own gap). Specimens that are meant to fill (a field, a slider, a
 * progress bar) have none.
 */
function contentWidth(stage: HTMLElement): number | undefined {
  if (stage.querySelector("input, textarea, select, [role=slider], [role=progressbar], [role=meter], progress, meter")) return undefined;
  let boxLeft = Infinity, inkLeft = Infinity, inkRight = -Infinity;
  for (const node of stage.querySelectorAll<Element>('[class*="area-"]')) {
    const rect = node.getBoundingClientRect();
    if (rect.width > 1) boxLeft = Math.min(boxLeft, rect.left);
  }
  const ink = (rect: DOMRect) => { if (rect.width < 1 || rect.height < 1) return; inkLeft = Math.min(inkLeft, rect.left); inkRight = Math.max(inkRight, rect.right); };
  const walker = document.createTreeWalker(stage, NodeFilter.SHOW_TEXT);
  const range = document.createRange();
  for (let text = walker.nextNode(); text; text = walker.nextNode()) {
    if (!text.textContent?.trim() || text.parentElement?.closest(".area-sr-only, svg")) continue;
    range.selectNodeContents(text);
    for (const rect of range.getClientRects()) ink(rect);
  }
  for (const node of stage.querySelectorAll<Element>("svg, img")) if (!node.parentElement?.closest("svg")) ink(node.getBoundingClientRect());
  if (!Number.isFinite(boxLeft) || !Number.isFinite(inkRight)) return undefined;
  const scale = Number(stage.style.zoom) || 1;
  const inked = (inkRight - boxLeft + Math.max(0, inkLeft - boxLeft)) / scale;
  const laid = stage.style.inlineSize;
  stage.style.inlineSize = "max-content";
  // Text that truncates reports almost no max-content width (an Alert's title and body): trusted
  // only when nothing is cut at it.
  const own = truncates(stage) ? 0 : extent(stage).w;
  stage.style.inlineSize = laid;
  return own > 0 ? Math.min(inked, own) : inked;
}
/* The room a stretching specimen keeps past its content: a fifth more, so it reads as the component
   at a natural width, not one shrink-wrapped (pick). */
const BREATHE = 1.2;

/*
 * A specimen that stretches to its tile can fit by truncating its text (a banner Alert in a
 * narrow tile). That shows the tile, not the component, so it counts as not fitting. Fields
 * scroll rather than truncate and are left out.
 */
function truncates(stage: HTMLElement) {
  for (const node of stage.querySelectorAll<HTMLElement>("*")) {
    if (node.scrollWidth <= node.clientWidth + 1 || node.matches("input, textarea, select")) continue;
    if (getComputedStyle(node).textOverflow === "ellipsis") return true;
  }
  return false;
}

/* The scale that fits a specimen in its room, never above the canvas's zoom. */
const fit = (room: Box, size: Box, max: number) => Math.min(max, room.w / Math.max(1, size.w), room.h / Math.max(1, size.h));


/** The room a tile's view gives its specimen now. */
function roomOf(view: HTMLElement): Box {
  const style = getComputedStyle(view);
  return {
    w: view.clientWidth - parseFloat(style.paddingInlineStart) - parseFloat(style.paddingInlineEnd),
    h: view.clientHeight - parseFloat(style.paddingBlockStart) - parseFloat(style.paddingBlockEnd),
  };
}

/** Fits every tile in the canvas and keeps fitting them as they resize; returns the cleanup. */
export function fitTiles(canvas: HTMLElement): () => void {
  const tiles: Tile[] = [...canvas.querySelectorAll<HTMLElement>(".gallery-tile")].map(tile => ({
    tile,
    view: tile.querySelector<HTMLElement>(".gallery-tile__view")!,
    stage: tile.querySelector<HTMLElement>(".gallery-tile__stage")!,
    fluid: false,
    natural: 0,
    group: MAX,
    widen: 1,
  }));
  if (!tiles.length) return () => {};
  // The app's zoom, read once: Fit, or an exact scale.
  const zoomAttr = canvas.closest("[data-zoom]")?.getAttribute("data-zoom") ?? "fit";
  const exact = zoomAttr === "fit" ? undefined : Number(zoomAttr) || MAX;

  // Fluid or fixed, and how wide a fluid specimen needs to be, at the default type size and density.
  const scale = ["data-area-type", "data-area-density"].map(name => [name, canvas.getAttribute(name)] as const);
  canvas.setAttribute("data-area-type", "14");
  canvas.setAttribute("data-area-density", "default");
  for (const entry of tiles) { entry.stage.style.zoom = ""; entry.stage.style.inlineSize = `${PROBE}px`; }
  for (const entry of tiles) {
    const own = extent(entry.stage);
    entry.natural = Math.ceil(own.w);
    entry.fluid = entry.natural >= PROBE - 40;
    // The group is read here, at the default type and density, so a Type change scales a group
    // together instead of moving specimens between groups.
    const group = groupOf(own);
    entry.group = group?.scale ?? MAX;
    entry.tile.dataset.fitGroup = group?.name ?? "panel";
    const content = contentWidth(entry.stage);
    if (content) entry.hug = Math.ceil(content * BREATHE);
  }
  // A fixed specimen narrower in content than in box (a Card, a Popover, a Toast at its default
  // width) is offered its content's width; it keeps it only if it gives way (its width is capped at
  // its container's, as Area's surfaces are), and 16 less is the least worth the change.
  for (const entry of tiles) {
    if (entry.fluid || !entry.hug || entry.hug > entry.natural - 16) { if (!entry.fluid) entry.hug = undefined; continue; }
    entry.stage.style.inlineSize = `${entry.hug}px`;
    const narrowed = Math.ceil(extent(entry.stage).w);
    if (narrowed < entry.natural - 8 && narrowed <= entry.hug + 1) entry.natural = narrowed;
    else entry.hug = undefined;
  }
  // The width a fluid specimen is laid out at: its tile over its scale, or its content's if narrower.
  const layoutWidth = (entry: Tile, room: number, scale: number) => Math.min(room / scale, entry.hug ?? Infinity);
  // A fluid specimen takes the first width at which nothing truncates (a few specimens, a few tries).
  for (const entry of tiles.filter(tile => tile.fluid)) {
    // Laid out for the tile at its group's scale: zoomed by it, it fills the tile.
    const room = layoutWidth(entry, roomOf(entry.view).w, exact ?? entry.group);
    entry.widen = WIDEN.find(factor => { entry.stage.style.inlineSize = `${Math.floor(room * factor)}px`; return !truncates(entry.stage); }) ?? WIDEN.at(-1)!;
  }
  for (const [name, value] of scale) if (value) canvas.setAttribute(name, value); else canvas.removeAttribute(name);
  // A fixed specimen keeps its own width, or the view's if wider (loose text inside it wraps to the
  // stage); one that gave way keeps its content's width, centred.
  for (const entry of tiles) if (!entry.fluid) entry.stage.style.inlineSize = entry.hug ? `${entry.hug}px` : `max(100%, ${entry.natural}px)`;

  // Scale follows the specimen and its tile: on first fit, and whenever either changes size
  // (window width, density, hydration, a disclosure opening inside the tile).
  const owner = new Map<Element, Tile>();
  for (const entry of tiles) { owner.set(entry.view, entry); owner.set(entry.stage, entry); }
  const rescale = (list: Iterable<Tile>) => {
    const batch = [...new Set(list)];
    // Read every room, write fluid widths, then read every extent and write every scale: two
    // layouts, however many tiles changed.
    const rooms = batch.map(entry => roomOf(entry.view));
    // A fluid specimen fills its tile at any zoom: laid out at the room over the zoom, then zoomed.
    batch.forEach((entry, index) => { if (entry.fluid) entry.stage.style.inlineSize = `${Math.floor(layoutWidth(entry, rooms[index]!.w, exact ?? entry.group) * (exact ? 1 : entry.widen))}px`; });
    const scales = batch.map((entry, index) => exact ?? fit(rooms[index]!, extent(entry.stage), entry.group));
    batch.forEach((entry, index) => { entry.stage.style.zoom = scales[index]!.toFixed(3); });
  };
  rescale(tiles);
  canvas.setAttribute("data-fitted", "");
  const observer = new ResizeObserver(records => rescale(records.flatMap(record => owner.get(record.target) ?? [])));
  for (const entry of tiles) { observer.observe(entry.view); observer.observe(entry.stage); }
  return () => observer.disconnect();
}
