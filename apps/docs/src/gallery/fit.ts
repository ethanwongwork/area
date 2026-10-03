/**
 * Tile fitting for the component gallery.
 *
 * Tiles are 4:3 and share the canvas width (component-gallery.mjs: as many columns as fit at
 * --docs-tile-min, stretched to fill). A specimen that fits its tile's view is shown at 1:1, so
 * controls and marks keep exact pixels. One that doesn't shrinks uniformly to fit. Below FLOOR
 * it would be too small to read, and a specimen that stretches to its tile mustn't truncate to
 * fit, so either takes a 2 x 2 tile instead, which keeps the 4:3 shape.
 *
 * The shape is decided once, at the default UI scale and the smallest tile the grid allows, so
 * neither density nor window width ever reflows the grid. The scale follows the specimen and
 * the tile live: a wider window or a compact specimen refits in place.
 *
 * Sizes are measured, not declared: a new specimen gets its shape from what it renders.
 */

/** The smallest scale a specimen is shown at before it takes a larger tile. */
const FLOOR = 0.5;
type Shape = readonly [columns: number, rows: number];
const CELL: Shape = [1, 1];
const LARGE: Shape = [2, 2];
/** A width no specimen fills unless it stretches to its container: tells fluid from fixed. */
const PROBE = 1040;
/** Tile height over width. */
const ASPECT = 3 / 4;

interface Box { w: number; h: number }
interface Tile {
  tile: HTMLElement;
  view: HTMLElement;
  stage: HTMLElement;
  fluid: boolean;
  natural: number;
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
  const scale = Number(stage.style.scale) || 1;
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

/*
 * Within SLACK counts as fitting: a specimen a few pixels over spills into the view's 8 margin
 * rather than take a 0.997 scale, which only blurs it.
 */
const SLACK = 4;
const fit = (room: Box, size: Box) => Math.min(1, (room.w + SLACK) / Math.max(1, size.w), (room.h + SLACK) / Math.max(1, size.h));

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
  }));
  const [sample] = tiles;
  if (!sample) return;

  // The room at the smallest tile: what the tile's label and insets leave of its 4:3 box.
  const grid = getComputedStyle(sample.tile.parentElement!);
  const minimum = parseFloat(grid.getPropertyValue("--docs-tile-min"));
  const gap = parseFloat(grid.columnGap);
  const live = roomOf(sample.view);
  const chrome = { w: sample.tile.offsetWidth - live.w, h: sample.tile.offsetHeight - live.h };
  const smallest = ([columns, rows]: Shape): Box => ({
    w: columns * minimum + (columns - 1) * gap - chrome.w,
    h: rows * minimum * ASPECT + (rows - 1) * gap - chrome.h,
  });

  // Shapes are chosen at the default UI scale, whatever the canvas shows.
  const density = canvas.getAttribute("data-area-ui");
  canvas.setAttribute("data-area-ui", "default");
  for (const entry of tiles) { entry.stage.style.scale = ""; entry.stage.style.inlineSize = `${PROBE}px`; }
  for (const entry of tiles) {
    entry.natural = Math.ceil(extent(entry.stage).w);
    entry.fluid = entry.natural >= PROBE - 40;
  }
  const room = smallest(CELL);
  for (const entry of tiles) entry.stage.style.inlineSize = `${Math.floor(entry.fluid ? room.w : Math.max(room.w, entry.natural))}px`;
  const large = new Set(tiles.filter(entry => (entry.fluid && truncates(entry.stage)) || fit(room, extent(entry.stage)) < FLOOR));
  if (density) canvas.setAttribute("data-area-ui", density); else canvas.removeAttribute("data-area-ui");
  for (const entry of tiles) {
    if (large.has(entry)) entry.tile.dataset.span = LARGE.join("x"); else delete entry.tile.dataset.span;
    // A stretching specimen fills its view; a fixed one keeps its own width, or the view's if wider.
    entry.stage.style.inlineSize = entry.fluid ? "100%" : `max(100%, ${entry.natural}px)`;
  }

  // Scale follows the specimen and its tile: on first fit, and whenever either changes size
  // (window width, density, hydration, a disclosure opening inside the tile).
  const owner = new Map<Element, Tile>();
  for (const entry of tiles) { owner.set(entry.view, entry); owner.set(entry.stage, entry); }
  const rescale = (list: Iterable<Tile>) => {
    // Read every size before writing any scale: one layout, however many tiles changed.
    const scored = [...new Set(list)].map(entry => [entry, fit(roomOf(entry.view), extent(entry.stage))] as const);
    for (const [entry, scale] of scored) entry.stage.style.scale = scale < 1 ? scale.toFixed(3) : "";
  };
  rescale(tiles);
  canvas.setAttribute("data-fitted", "");
  const observer = new ResizeObserver(records => rescale(records.flatMap(record => owner.get(record.target) ?? [])));
  for (const entry of tiles) { observer.observe(entry.view); observer.observe(entry.stage); }
}
