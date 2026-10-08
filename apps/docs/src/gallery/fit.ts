/**
 * Tile fitting for the component gallery.
 *
 * Tiles are 5:4, all one size, and share the canvas width (component-gallery.mjs: as many columns
 * as fit at --docs-tile-min, stretched to fill). Every specimen is shown smaller than life inside
 * a generous view (owner, 2026-10-04, after Frame Supply's component grid): at most MAX (0.8), so
 * a Button reads as a specimen on a plate, and smaller still where it needs to, uniformly, until
 * it fits. A dialog or a table shrinks further rather than taking a larger tile.
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

/** The largest scale a specimen is shown at. */
const MAX = 0.8;
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

/* The scale that fits a specimen in its room, never above MAX. */
const fit = (room: Box, size: Box) => Math.min(MAX, room.w / Math.max(1, size.w), room.h / Math.max(1, size.h));

/** The room a tile's view gives its specimen now. */
function roomOf(view: HTMLElement): Box {
  const style = getComputedStyle(view);
  return {
    w: view.clientWidth - parseFloat(style.paddingInlineStart) - parseFloat(style.paddingInlineEnd),
    h: view.clientHeight - parseFloat(style.paddingBlockStart) - parseFloat(style.paddingBlockEnd),
  };
}

export function fitTiles(canvas: HTMLElement) {
  const tiles: Tile[] = [...canvas.querySelectorAll<HTMLElement>(".gallery-tile")].map(tile => ({
    tile,
    view: tile.querySelector<HTMLElement>(".gallery-tile__view")!,
    stage: tile.querySelector<HTMLElement>(".gallery-tile__stage")!,
    fluid: false,
    natural: 0,
    widen: 1,
  }));
  if (!tiles.length) return;

  // Fluid or fixed, and how wide a fluid specimen needs to be, at the default UI scale.
  const density = canvas.getAttribute("data-area-ui");
  canvas.setAttribute("data-area-ui", "default");
  for (const entry of tiles) { entry.stage.style.zoom = ""; entry.stage.style.inlineSize = `${PROBE}px`; }
  for (const entry of tiles) {
    entry.natural = Math.ceil(extent(entry.stage).w);
    entry.fluid = entry.natural >= PROBE - 40;
  }
  // A fluid specimen takes the first width at which nothing truncates (a few specimens, a few tries).
  for (const entry of tiles.filter(tile => tile.fluid)) {
    const room = roomOf(entry.view).w / MAX;
    entry.widen = WIDEN.find(factor => { entry.stage.style.inlineSize = `${Math.floor(room * factor)}px`; return !truncates(entry.stage); }) ?? WIDEN.at(-1)!;
  }
  if (density) canvas.setAttribute("data-area-ui", density); else canvas.removeAttribute("data-area-ui");
  // A fixed specimen keeps its own width, or the view's if wider (loose text inside it wraps to the stage).
  for (const entry of tiles) if (!entry.fluid) entry.stage.style.inlineSize = `max(100%, ${entry.natural}px)`;

  // Scale follows the specimen and its tile: on first fit, and whenever either changes size
  // (window width, density, hydration, a disclosure opening inside the tile).
  const owner = new Map<Element, Tile>();
  for (const entry of tiles) { owner.set(entry.view, entry); owner.set(entry.stage, entry); }
  const rescale = (list: Iterable<Tile>) => {
    const batch = [...new Set(list)];
    // Read every room, write fluid widths, then read every extent and write every scale: two
    // layouts, however many tiles changed.
    const rooms = batch.map(entry => roomOf(entry.view));
    batch.forEach((entry, index) => { if (entry.fluid) entry.stage.style.inlineSize = `${Math.floor(rooms[index]!.w / MAX * entry.widen)}px`; });
    const scales = batch.map((entry, index) => fit(rooms[index]!, extent(entry.stage)));
    batch.forEach((entry, index) => { entry.stage.style.zoom = scales[index]!.toFixed(3); });
  };
  rescale(tiles);
  canvas.setAttribute("data-fitted", "");
  const observer = new ResizeObserver(records => rescale(records.flatMap(record => owner.get(record.target) ?? [])));
  for (const entry of tiles) { observer.observe(entry.view); observer.observe(entry.stage); }
}
