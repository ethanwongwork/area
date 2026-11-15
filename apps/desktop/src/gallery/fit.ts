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
 * The shrink is a `scale`: the specimen is laid out at 1x and shrunk whole, so every part keeps its exact proportions
 * and lands on half pixels as it must (owner, 2026-10-19: "i want scaling of components to be seamless, if it could
 * sit on half pixels would that work?"; "switch the Components gallery's specimen fitting to whole-image scaling too").
 * It was CSS `zoom` from 2026-10-07 (motion and crispness pass, docs/research/motion-2026-10-07/): zoom lays the
 * specimen out again smaller, so 1px edges snap to device pixels while offsets scale, and parts moved against each
 * other (a Switch's thumb sat high in its track); a scale paints a 1px edge between pixels, a little softer, which the
 * owner takes over parts that shift.
 *
 * Sizes are measured, not declared: a new specimen gets its scale from what it renders. Fluid
 * widths are decided once at the default UI scale; scale follows the specimen and the tile live.
 */

/*
 * Three ways to show a specimen (owner, 2026-10-14; Auto and Fit 2026-10-18), read from the nearest [data-zoom]:
 *   auto  by size group: every specimen in a group shows at most at the group's scale (GROUPS), so specimens of a
 *         size stay in proportion, and one its group's scale would not fit in its tile is shrunk to fit; one that
 *         stretches is laid out at its tile over that scale, so it fills the tile at it
 *   fit   every specimen as large as its tile allows, up to FIT_MAX; one that stretches fills its tile at 100%
 *   0.5…2 a true zoom: every specimen at exactly that scale, its tile growing above 100%; a grid's cards are as wide as
 *         its widest specimen needs, a waterfall card as tall, and only one wider than a whole row (or taller than a
 *         fixed card) is shrunk to fit; nothing runs past its card (system evaluation F3.2, 2026-11-11; it was cut off)
 */
/** Fit's ceiling: the zoom list's largest step, so a Badge does not fill a card. */
const FIT_MAX = 2;
/** The scale of a true zoom's fallback. */
const MAX = 1;
/*
 * Fit's size groups, smallest first, by the specimen's painted area at the default type and density (owner,
 * 2026-10-18: "some of the small ones look very large because theyre scaled up … i want larger components like code
 * block, board, color picker, command palette, panel, etc to be the largest … much more granular, so for example if
 * those large components are at most 75% of their actual size, i want the other component size groups for the next
 * smallest groups to be 80%, 85%, 90% max"). Nothing is scaled up any more (controls were 125% until then). Area, not
 * height, so a short wide specimen (Board 852 x 172, Code block 360 x 163) groups with the other large ones; the
 * bounds sit in the gaps of the measured spread (2026-10-18, Components at type 14 / 32):
 *   small     up to 6,000 px²: one control, a mark (Button, Badge, Switch, Segmented, Avatar)             90%
 *   medium    up to 24,000: a field, a row of controls, a small list (Input, Tabs, Menu, Accordion)       85%
 *   large     up to 56,000: a few rows, a dialog (Card, Table, Dialog, Tree view, Description list)        80%
 *   largest   anything bigger (Code block, Board, Color picker, Command palette, Panel, Calendar)         75%
 * A specimen that stretches is measured at its content's width (a Code block's longest line, a fifth more), or, if it
 * fills (a field, a slider), at Area's contained field width (16rem, --area-input-inline-size), never the probe's.
 *
 * Since 2026-10-22 every group shows at one scale (owner: "adjust the scale of all the components inside, since some
 * components read very large compared to others that are scaled down alot"), so specimens keep their real proportions
 * to each other and only one too large for its card shrinks further. 70% is the largest scale at which the largest
 * group still fits a 277 card (the three-across card in a 1440 window): Calendar 0.71, Composer menu 0.72, Asset card
 * and Preview frame 0.73, Code block 0.75 when measured. The groups stay, read by data-fit-group, to retune by.
 */
const AUTO_SCALE = 0.7;
/*
 * Auto follows the card (owner, 2026-10-31: "i want the content in the middle screen to scale up and down"): AUTO_SCALE is
 * the scale in a card whose view is AUTO_VIEW wide (the 277 card it was found in), and a card wider or narrower scales
 * its specimen by the same ratio, so a card and what it holds grow and shrink together as the window, the panels or the
 * zoom change. Never past 1:1 (AUTO_MOST): a gallery shows a component at most at its real size; Fit and the exact zooms
 * go further. Until then every card drew its specimen at 0.7 whatever its width, so a wide card held a small specimen in
 * a wide margin.
 */
const AUTO_VIEW = 275;
const AUTO_MOST = 1;
const GROUPS = [
  { name: "small", area: 6000, scale: AUTO_SCALE },
  { name: "medium", area: 24000, scale: AUTO_SCALE },
  { name: "large", area: 56000, scale: AUTO_SCALE },
  { name: "largest", area: Infinity, scale: AUTO_SCALE },
] as const;
const FLUID_WIDTH = 256;
const groupOf = (size: Box) => GROUPS.find(group => size.w * size.h <= group.area)!;
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
  /** Fit's most for its size group. */
  group: number;
  /** For a fluid specimen whose content reads narrower than its tile: the width it is laid out at. */
  hug?: number;
  /** For a fluid specimen: its layout width over the view's room at MAX. */
  widen: number;
  /** In a waterfall (an Asset card that hugs): the view takes the scaled specimen's height. */
  hugs: boolean;
}

/*
 * What a specimen paints: the union of its Area elements, icons and images. Demo wrappers that
 * stretch to the stage are not the specimen; a visually hidden label (1 x 1) paints nothing; a
 * surface open in the top layer is drawn outside the tile; and whatever an element clips (an
 * indeterminate Progress bar sliding along its track) counts only as far as the clip. Measured
 * in the stage's own (unscaled) pixels.
 */
function extent(stage: HTMLElement, withText = false): Box {
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
  // A demo's own text paints too (Skeleton's row labels, "Display"): left out of the scale, a row of label and specimen
  // was scaled for the specimen alone and clipped at both ends of a tile under about 360px (theme review 2026-10-24). It
  // counts for the scale only: whether a specimen stretches is still read from its Area elements.
  const walker = withText ? document.createTreeWalker(stage, NodeFilter.SHOW_TEXT) : null;
  const range = document.createRange();
  for (let text = walker?.nextNode(); walker && text; text = walker.nextNode()) {
    // Text inside an Area element is measured with it; only a demo's own (outside every one, within the stage) is added.
    const parent = text.parentElement;
    const owner = parent?.closest('.area-sr-only, svg, [class*="area-"], :popover-open, dialog:modal');
    if (!text.textContent?.trim() || !parent || (owner && stage.contains(owner))) continue;
    range.selectNodeContents(text);
    const clip = clipOf(text as unknown as Element)?.getBoundingClientRect();
    for (const own of range.getClientRects()) {
      if (own.width < 1 || own.height < 1) continue;
      const rect = clip ?? own;
      left = Math.min(left, rect.left); top = Math.min(top, rect.top);
      right = Math.max(right, rect.right); bottom = Math.max(bottom, rect.bottom);
    }
  }
  if (!Number.isFinite(left)) return { w: 0, h: 0 };
  const scale = Number(stage.style.scale) || 1;
  if (!withText) return { w: (right - left) / scale, h: (bottom - top) / scale };
  // For the scale, the extent as the stage shrinks it: about its centre, so a specimen that sits off centre in a wider
  // stage (Skeleton's list, left-aligned in 760) needs twice its farther half (it lost 40px on the left before).
  const box = stage.getBoundingClientRect(), cx = (box.left + box.right) / 2, cy = (box.top + box.bottom) / 2;
  return { w: 2 * Math.max(cx - left, right - cx) / scale, h: 2 * Math.max(cy - top, bottom - cy) / scale };
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
const fills = (stage: HTMLElement) => !!stage.querySelector("input, textarea, select, [role=slider], [role=progressbar], [role=meter], progress, meter");
/* A field drawn narrower than a glyph: its width is a share of a container that had none to give. */
const collapsed = (stage: HTMLElement) => [...stage.querySelectorAll<HTMLElement>("input:not([type=checkbox], [type=radio], [type=range], [type=hidden]), textarea, select")]
  .some(field => { const rect = field.getBoundingClientRect(); return rect.height > 0 && rect.width < 16; });
/* The demo's own wrapper (components.tsx, Demo: a plain element round it), when the stage holds one and nothing else. */
const wrapperOf = (stage: HTMLElement) => {
  const only = stage.childElementCount === 1 ? stage.firstElementChild as HTMLElement : null;
  return only && !/(^|\s)area-/.test(only.className) ? only : null;
};
/* Undoes a stretch fitTiles made (a demo's own wrapper style is left as written). */
const unstretch = (stage: HTMLElement) => {
  const wrapper = wrapperOf(stage);
  if (wrapper?.dataset.fitStretched === undefined) return;
  delete wrapper.dataset.fitStretched;
  wrapper.style.removeProperty("inline-size");
};
/* The inked part of contentWidth: reads only, so every tile's can be read in one layout. */
function inkedWidth(stage: HTMLElement): number | undefined {
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
  const scale = Number(stage.style.scale) || 1;
  return (inkRight - boxLeft + Math.max(0, inkLeft - boxLeft)) / scale;
}
/* Text that truncates reports almost no max-content width (an Alert's title and body): the
   max-content extent is trusted only when nothing is cut at it. */
const contentWidth = (inked: number, own: number) => own > 0 ? Math.min(inked, own) : inked;
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

/*
 * Waterfall (owner, 2026-10-25: "hugging the height of components (so taller components may have slightly taller
 * containers) … the margins/padding around the component will be more even overall"): a card that hugs (Asset card's
 * hug aspect) is as tall as its specimen at its scale, plus the view's padding and HUG_ROOM above and below, so every
 * specimen has the same room over and under it; the scale is the zoom's as in a fixed card, never larger. Between
 * HUG_MIN and HUG_MAX of the card's width (picks): a Badge's card is not a sliver, and a Calendar's no taller than 4:5,
 * where it shrinks to fit as it would in a fixed card. The grid then drops each card into the shortest column (placeWaterfall).
 */
const HUG_ROOM = 16; /* pick: 28 from the view's edge with its 12 padding, Compass's measured 28 */
const HUG_MIN = 0.5;
const HUG_MAX = 1.25;

/* The scale that fits a specimen in its room, never above the canvas's zoom. */
const fit = (room: Box, size: Box, max: number) => Math.min(max, room.w / Math.max(1, size.w), room.h / Math.max(1, size.h));


/** The room a tile's view gives its specimen now; a hugging view's height is the most it may grow to. */
function roomOf(view: HTMLElement, hugs = false): Box & { outer: number; padBlock: number } {
  const style = getComputedStyle(view);
  const padBlock = parseFloat(style.paddingBlockStart) + parseFloat(style.paddingBlockEnd);
  return {
    w: view.clientWidth - parseFloat(style.paddingInlineStart) - parseFloat(style.paddingInlineEnd),
    h: hugs ? view.clientWidth * HUG_MAX - padBlock - HUG_ROOM * 2 : view.clientHeight - padBlock,
    outer: view.clientWidth,
    padBlock,
  };
}

/*
 * The waterfall's columns: rows of 1px with no row gap, each card spanning its height and the gap, so the grid's
 * auto-placement drops it into the first column with room, in reading order (the Asset grid's waterfall, which
 * positions its cards absolutely, is a List box; the Canvas's cards are not).
 */
function placeWaterfall(tiles: Tile[]) {
  const items = tiles.flatMap(entry => {
    const item = entry.tile.closest<HTMLElement>(".studio-grid--waterfall > *");
    return item ? [item] : [];
  });
  const grids = new Set(items.map(item => item.parentElement!));
  const gaps = new Map([...grids].map(grid => [grid, parseFloat(getComputedStyle(grid).columnGap) || 0]));
  const heights = items.map(item => item.getBoundingClientRect().height);
  items.forEach((item, index) => { item.style.gridRowEnd = `span ${Math.ceil(heights[index]! + gaps.get(item.parentElement!)!)}`; });
  for (const grid of grids) grid.setAttribute("data-placed", "");
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
    hugs: Boolean(tile.parentElement?.classList.contains("area-asset-card--hug")),
  }));
  if (!tiles.length) return () => {};
  // A fixed card after a waterfall keeps none of its sizes, and a grid none of an exact zoom's card minimum.
  for (const entry of tiles) {
    entry.tile.closest<HTMLElement>(".studio-grid--cards")?.style.removeProperty("--_card-min");
    entry.view.style.blockSize = "";
    entry.tile.closest<HTMLElement>(".studio-grid > *")?.style.removeProperty("grid-row-end");
    entry.tile.closest(".studio-grid")?.removeAttribute("data-placed");
  }
  // The app's zoom, read once: Fit, or an exact scale.
  const zoomAttr = canvas.closest("[data-zoom]")?.getAttribute("data-zoom") ?? "auto";
  const exact = zoomAttr === "auto" || zoomAttr === "fit" ? undefined : Number(zoomAttr) || MAX;
  const filling = zoomAttr === "fit";

  // Fluid or fixed, and how wide a fluid specimen needs to be, at the default type size and density.
  const scale = ["data-area-type", "data-area-density"].map(name => [name, canvas.getAttribute(name)] as const);
  canvas.setAttribute("data-area-type", "14");
  canvas.setAttribute("data-area-density", "32");
  /*
   * Every step below writes all the tiles' widths, then reads all of them: one layout a step, not
   * one a tile. Interleaved, the first fit forced a layout of the whole canvas for each of ~90
   * tiles, several times over, and opening the Components tab froze for over half a second.
   */
  for (const entry of tiles) { entry.stage.style.scale = ""; entry.stage.style.inlineSize = `${PROBE}px`; unstretch(entry.stage); }
  const heights = new Map<Tile, number>();
  const probe = (entry: Tile) => {
    const own = extent(entry.stage);
    entry.natural = Math.ceil(own.w);
    entry.fluid = entry.natural >= PROBE - 40;
    // The group is read here, at the default type and density, so a Type change scales a group
    // together instead of moving specimens between groups.
    heights.set(entry, own.h);
  };
  for (const entry of tiles) probe(entry);
  /*
   * A fluid specimen's wrapper takes the stage's width before it is measured (system evaluation F3.2, 2026-11-11): a demo's
   * wrapper is shrink-wrapped by the stage, so a field whose width is a share of its container (the gallery's 100% field
   * width, below in canvas.css) had nothing to take a share of, and an Input group's field fell to 0. A stage holding a
   * field that collapsed there (narrower than a glyph) is stretched: if its wrapper at the stage's width makes it fill, it
   * is fluid and the wrapper keeps that width; otherwise (a Dialog with a field: its own width) it goes back to hugging.
   * A field that already shows (an Approval's "Other" field, a form in a card) is left as it was.
   */
  const stretched = tiles.filter(entry => !entry.fluid && wrapperOf(entry.stage) && !wrapperOf(entry.stage)!.style.inlineSize && collapsed(entry.stage));
  for (const entry of stretched) { const wrapper = wrapperOf(entry.stage)!; wrapper.dataset.fitStretched = ""; wrapper.style.inlineSize = "100%"; }
  for (const entry of stretched) probe(entry);
  for (const entry of stretched) if (!entry.fluid) unstretch(entry.stage);
  for (const entry of tiles) entry.tile.dataset.fitFluid = String(entry.fluid);
  const inked = new Map<Tile, number | undefined>();
  for (const entry of tiles) if (!fills(entry.stage)) inked.set(entry, inkedWidth(entry.stage));
  const measured = [...inked].filter(([, width]) => width !== undefined) as [Tile, number][];
  for (const [entry] of measured) entry.stage.style.inlineSize = "max-content";
  const maxContent = measured.map(([entry]) => truncates(entry.stage) ? 0 : extent(entry.stage).w);
  measured.forEach(([entry, width], index) => {
    entry.stage.style.inlineSize = `${PROBE}px`;
    const content = contentWidth(width, maxContent[index]!);
    if (content) entry.hug = Math.ceil(content * BREATHE);
  });
  // A fixed specimen narrower in content than in box (a Card, a Popover, a Toast at its default
  // width) is offered its content's width; it keeps it only if it gives way (its width is capped at
  // its container's, as Area's surfaces are), and 16 less is the least worth the change.
  const offered = tiles.filter(entry => {
    if (entry.fluid) return false;
    if (!entry.hug || entry.hug > entry.natural - 16) { entry.hug = undefined; return false; }
    return true;
  });
  for (const entry of offered) entry.stage.style.inlineSize = `${entry.hug}px`;
  const narrowed = offered.map(entry => Math.ceil(extent(entry.stage).w));
  offered.forEach((entry, index) => {
    if (narrowed[index]! < entry.natural - 8 && narrowed[index]! <= entry.hug! + 1) entry.natural = narrowed[index]!;
    else entry.hug = undefined;
  });
  // Each specimen's size group, by its painted area: a stretching one at its content's width (a Code block's line)
  // or, filling (a field, a slider), at the contained field width.
  for (const entry of tiles) {
    const measured = { w: entry.fluid ? entry.hug ?? FLUID_WIDTH : entry.natural, h: heights.get(entry)! };
    const group = groupOf(measured);
    entry.group = filling ? (entry.fluid ? MAX : FIT_MAX) : group.scale;
    entry.tile.dataset.fitGroup = group.name;
    // The measure behind the group, for retuning the bounds (px² at type 14 / 32).
    entry.tile.dataset.fitArea = String(Math.round(measured.w * measured.h));
  }
  // Auto's most for a card of this view's width (AUTO_VIEW); Fit's and a zoom's are their own.
  const most = (entry: Tile, room: { outer: number }) => filling ? entry.group : Math.min(AUTO_MOST, entry.group * room.outer / AUTO_VIEW);
  // The width a fluid specimen is laid out at: its tile over its scale, or its content's if narrower.
  const layoutWidth = (entry: Tile, room: number, scale: number) => Math.min(room / scale, entry.hug ?? Infinity);
  // A fluid specimen takes the first width at which nothing truncates (a few specimens, a few tries),
  // laid out for the tile at its group's scale: zoomed by it, it fills the tile.
  const fluid = tiles.filter(tile => tile.fluid);
  const fluidRooms = new Map(fluid.map(entry => [entry, (room => layoutWidth(entry, room.w, exact ?? most(entry, room)))(roomOf(entry.view))]));
  let open = fluid;
  for (const factor of WIDEN) {
    if (!open.length) break;
    for (const entry of open) entry.stage.style.inlineSize = `${Math.floor(fluidRooms.get(entry)! * factor)}px`;
    const cut = open.map(entry => truncates(entry.stage));
    for (const entry of open) entry.widen = factor;
    open = open.filter((_, index) => cut[index]);
  }
  for (const [name, value] of scale) if (value) canvas.setAttribute(name, value); else canvas.removeAttribute(name);
  // A fixed specimen keeps its own width, or the view's if wider (loose text inside it wraps to the
  // stage); one that gave way keeps its content's width, centred.
  for (const entry of tiles) if (!entry.fluid) entry.stage.style.inlineSize = entry.hug ? `${entry.hug}px` : `max(100%, ${entry.natural}px)`;
  /*
   * At an exact zoom a specimen is drawn at that scale, never shrunk to its card, so a card is at least as wide as the widest
   * specimen in its grid needs (system evaluation F3.2): the grid takes fewer columns rather than a stage running past its
   * card (a Chart's 385 in a 364 room). Auto and Fit scale a specimen into its card and keep the grid's own minimum.
   */
  if (exact) {
    const grids = new Map<HTMLElement, number>();
    for (const entry of tiles) {
      const grid = entry.tile.closest<HTMLElement>(".studio-grid--cards");
      if (!grid || entry.fluid) continue;
      const style = getComputedStyle(entry.view);
      // The card's width that holds the specimen whole: the specimen at the zoom, the view's padding and the frame's edges.
      const frame = entry.tile.getBoundingClientRect().width - entry.view.clientWidth;
      const need = entry.natural * exact + parseFloat(style.paddingInlineStart) + parseFloat(style.paddingInlineEnd) + frame;
      grids.set(grid, Math.max(grids.get(grid) ?? 0, need));
    }
    // --_card-min is multiplied by the zoom (canvas.css, .studio-grid--cards), so it is written over it.
    for (const [grid, need] of grids) grid.style.setProperty("--_card-min", `max(260px, ${Math.ceil(need / exact)}px)`);
  }

  // Scale follows the specimen and its tile: on first fit, and whenever either changes size
  // (window width, density, hydration, a disclosure opening inside the tile).
  const owner = new Map<Element, Tile>();
  for (const entry of tiles) { owner.set(entry.view, entry); owner.set(entry.stage, entry); }
  const rescale = (list: Iterable<Tile>) => {
    const batch = [...new Set(list)];
    // Read every room, write fluid widths, then read every extent and write every scale: two
    // layouts, however many tiles changed.
    const rooms = batch.map(entry => roomOf(entry.view, entry.hugs));
    // A fluid specimen fills its tile at any zoom: laid out at the room over the zoom, then scaled.
    batch.forEach((entry, index) => { if (entry.fluid) entry.stage.style.inlineSize = `${Math.floor(layoutWidth(entry, rooms[index]!.w, exact ?? most(entry, rooms[index]!)) * (exact ? 1 : entry.widen))}px`; });
    const extents = batch.map(entry => extent(entry.stage, true));
    /* An exact zoom draws a specimen at that scale, unless its card cannot hold it even alone in its row (a Board's 852 in a
       792 Canvas): then it is shrunk to the card's width, never run past it (system evaluation F3.2). A waterfall card grows
       to the specimen's height at that scale; a fixed card shrinks a taller one to its height. */
    const scales = batch.map((entry, index) => exact === undefined ? fit(rooms[index]!, extents[index]!, most(entry, rooms[index]!))
      : Math.min(exact, rooms[index]!.w / Math.max(1, extents[index]!.w), entry.hugs ? Infinity : rooms[index]!.h / Math.max(1, extents[index]!.h)));
    batch.forEach((entry, index) => { entry.stage.style.scale = scales[index]!.toFixed(3); });
    // A waterfall's view hugs its specimen at that scale, then the cards are placed.
    const hugging = batch.filter(entry => entry.hugs);
    if (!hugging.length) return;
    batch.forEach((entry, index) => {
      if (!entry.hugs) return;
      const room = rooms[index]!;
      const width = room.outer;
      const tall = extents[index]!.h * scales[index]! + room.padBlock + HUG_ROOM * 2;
      entry.view.style.blockSize = `${Math.round(Math.min(exact === undefined ? width * HUG_MAX : Infinity, Math.max(width * HUG_MIN, tall)))}px`;
    });
    placeWaterfall(hugging);
  };
  rescale(tiles);
  canvas.setAttribute("data-fitted", "");
  const observer = new ResizeObserver(records => rescale(records.flatMap(record => owner.get(record.target) ?? [])));
  for (const entry of tiles) { observer.observe(entry.view); observer.observe(entry.stage); }
  return () => observer.disconnect();
}
