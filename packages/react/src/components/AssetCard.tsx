// AssetCard and AssetGrid: one asset in a square card: a head with its name and controls, then a frame holding the asset
// 4 in from the card's edge (owner, round 55: the Image, Group and Component container designs). The frame's content
// sets the kind: any element centred on the surface (a component, a type sample, an icon, a setting's preview), an image
// covering the frame, a colour painting it, or a group's first four assets as a 2 x 2 mosaic. The grid is a ListBox grid
// of cards (one Tab stop, arrows in two dimensions, typeahead) that also opens the focused card on Enter or a double
// click, as FileGrid; as a waterfall its cards hug their assets in columns, each dropped into the shortest. Spec:
// docs/specs/asset-card.md.
import { createContext, forwardRef, useContext, useLayoutEffect, useRef } from "react";
import type { CSSProperties, HTMLAttributes, KeyboardEvent, ReactNode } from "react";
import { assetCardVariants, assetGridVariants } from "../variants.ts";
import { ListBox, ListBoxItem, type ListBoxProps, type ListBoxItemProps } from "./ListBox.tsx";

/** Attributes for a part: HTML attributes and `data-*` hooks (a host's own class, a scope, a ground). */
type PartProps = HTMLAttributes<HTMLDivElement> & Record<`data-${string}`, string | undefined>;

export interface AssetCardProps extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "color"> {
  /** The asset's name, in the head: one line, then an ellipsis. */
  name: ReactNode;
  /**
   * @deprecated The head's end holds controls only (owner, round 58). Put a detail in the asset itself (a type sample's
   * line) or behind a control (a Copy button that copies the value). Ignored.
   */
  meta?: ReactNode;
  /** Controls at the head's end: a Copy button for what can be used (a component, a colour, a type style, an icon), a
   *  More button for what is managed (an image, a group). Small ghost icon-only Buttons; keep them few. */
  actions?: ReactNode;
  /** The asset: an image URL (it covers the frame, cropped) or any element, centred on the frame's surface. */
  media?: ReactNode | string;
  /** The image's text alternative. Empty by default: the name says what it is. */
  mediaAlt?: string;
  /** A colour as the asset (any CSS colour): it paints the frame, outlined by the swatch ring. Set, it replaces `media`. */
  color?: string;
  /**
   * A group: its assets, as image URLs or elements. The first four fill a 2 x 2 mosaic, each cropped to its cell; an
   * element is a thumbnail of itself, laid out at about its own card's frame and scaled to the cell, inert. Fewer than
   * four leave cells empty. Set, it replaces `media` and `color`.
   */
  group?: Array<ReactNode | string>;
  /** Selected: the card's edge in the selection colour. In an AssetGrid the grid sets it. */
  selected?: boolean;
  /**
   * The card is a control of its own (a button, a selectable item) outside an AssetGrid: hover lifts it, a press drops
   * it, keyboard focus rings it, and `aria-pressed` or `aria-selected` shows as the selected edge.
   */
  interactive?: boolean;
  /**
   * framed (the default): the card. basic: one surface, the head and the asset on the card's fill, no frame of its own.
   * containerless: no card at rest (no fill, edge or shadow), the head and the asset on the page's own ground, in the
   * same places. A component's frame shows its edge on hover and selection; an image or a group is its own surface and
   * the states paint it.
   */
  container?: "framed" | "basic" | "containerless";
  /** above (the default): the head, its name and controls, over the frame. below: under it. */
  caption?: "above" | "below" | "overlay";
  /** recessed (the default): the card in bg-subtle. raised: the surface, white in light. */
  fill?: "recessed" | "raised";
  /** No edge at rest; hover and selection still draw theirs. */
  borderless?: boolean;
  /** square (the default): the frame is 1:1, or an image's own ratio, and the card adds its head. landscape: the same at
   * 5:4. hug: a component's frame takes its own height. */
  aspect?: "square" | "landscape" | "hug";
  /** An image's width over its height, so it holds its shape before it loads (a waterfall's cards). */
  mediaRatio?: number;
  /** The frame's content as the host lays it out, in place of `media` (an app's specimen stage). */
  children?: ReactNode;
  /** Attributes for the frame: a host's own class, scope or ground. */
  frameProps?: PartProps;
  /** Attributes for the head: a host's scale (the app's type and density) or class. */
  headProps?: PartProps;
  /** @deprecated Use `headProps`. */
  captionProps?: PartProps;
}

const image = (source: string, alt: string, ratio?: number) => (
  <img src={source} alt={alt} loading="lazy" decoding="async" draggable={false} style={ratio ? { aspectRatio: ratio } : undefined} />
);
const join = (...names: Array<string | undefined>) => names.filter(Boolean).join(" ");

export const AssetCard = /* @__PURE__ */ forwardRef<HTMLDivElement, AssetCardProps>(function AssetCard(
  { name, meta: _meta, actions, media, mediaAlt = "", color, group, selected, interactive, caption = "above", fill = "recessed", borderless, container = "framed", aspect = "square",
    mediaRatio, children, frameProps, headProps, captionProps, className, style, ...rest }, ref,
) {
  const layout = group ? "group" : color !== undefined && children === undefined ? "color" : typeof media === "string" && children === undefined ? "image" : "asset";
  const cells = group ? [0, 1, 2, 3].map(index => group[index]) : [];
  const { className: frameClass, ...frameRest } = frameProps ?? {};
  const { className: headClass, ...headRest } = headProps ?? captionProps ?? {};
  return (
    <div ref={ref} className={assetCardVariants({ layout, container, caption, fill, aspect, interactive, borderless }, className)} data-selected={selected ? "" : undefined}
      style={layout === "color" ? { ...style, "--_asset-color": color } as CSSProperties : style} {...rest}>
      <div className={join(assetCardVariants.element("head"), headClass)} {...headRest}>
        <span className={assetCardVariants.element("name")}>{name}</span>
        {actions ? <div className={assetCardVariants.element("actions")}>{actions}</div> : null}
      </div>
      {/* A frame paints the page tone, so a component inside steps its fills from the page and a raised one lifts from it
          (layers.css); a basic card's frame paints nothing, so it declares the card's own ground (the tile tone, or raised);
          a containerless one, none, the page's ground under it. */}
      <div className={join(assetCardVariants.element("frame"), frameClass)} data-area-ground={container === "containerless" ? undefined : container === "basic" ? (fill === "raised" ? "raised" : "tile") : "page"} {...frameRest}>
        {layout === "group" ? (
          <div className={assetCardVariants.element("mosaic")} aria-hidden="true">
            {cells.map((cell, index) => (
              <span key={index} className={assetCardVariants.element("cell")}>
                {typeof cell === "string" ? image(cell, "") : cell != null ? <span className={assetCardVariants.element("thumb")} inert>{cell}</span> : null}
              </span>
            ))}
          </div>
        ) : children !== undefined ? children : layout === "color" ? null : (
          <div className={assetCardVariants.element("media")} aria-hidden={typeof media === "string" && mediaAlt ? undefined : "true"}>
            {typeof media === "string" ? image(media, mediaAlt, mediaRatio) : media}
          </div>
        )}
      </div>
    </div>
  );
});

interface AssetGridContext { open?: (value: string) => void; layout?: "grid" | "waterfall"; container?: AssetCardProps["container"] }
const GridContext = createContext<AssetGridContext>({});

export interface AssetGridProps extends Omit<ListBoxProps, "layout"> {
  /** Opens a card: Enter on the focused card, or a double click. */
  onOpen?: (value: string) => void;
  /**
   * grid (the default): square cards in rows. waterfall: cards hug their assets in columns of the grid's least width,
   * each dropped into the shortest column in reading order.
   */
  layout?: "grid" | "waterfall";
  /** Every card's container: framed (the default) or containerless. A card's own `container` wins. */
  container?: AssetCardProps["container"];
}

/**
 * Places a waterfall's cards: as many columns of the least width (--area-asset-card-size) as fit, each card into the
 * shortest column in order, again whenever the grid's width or a card's height changes. Positions are logical, so a
 * right-to-left grid fills from the right.
 */
function useWaterfall(box: { current: HTMLDivElement | null }, on: boolean) {
  useLayoutEffect(() => {
    const grid = box.current;
    if (!grid || !on) return;
    const cards = () => [...grid.children].filter((node): node is HTMLElement => node instanceof HTMLElement && node.getAttribute("role") === "option");
    let frame = 0;
    const place = () => {
      frame = 0;
      const style = getComputedStyle(grid);
      const least = parseFloat(style.getPropertyValue("--area-asset-card-size")) || 224;
      const columnGap = parseFloat(style.columnGap) || 0;
      const rowGap = parseFloat(style.rowGap) || 0;
      const start = parseFloat(style.paddingInlineStart) || 0;
      const top = parseFloat(style.paddingBlockStart) || 0;
      const width = grid.clientWidth - start - (parseFloat(style.paddingInlineEnd) || 0);
      const count = Math.max(1, Math.floor((width + columnGap) / (least + columnGap)));
      const column = (width - columnGap * (count - 1)) / count;
      const items = cards();
      grid.dataset.placed = "";
      for (const item of items) item.style.inlineSize = `${column}px`;
      // Measured heights are drawn sizes: a grid inside a scaled stage (a gallery tile's fit) divides the scale out.
      const scale = grid.offsetWidth ? grid.getBoundingClientRect().width / grid.offsetWidth || 1 : 1;
      const heights = items.map(item => item.getBoundingClientRect().height / scale);
      const ends = new Array<number>(count).fill(0);
      items.forEach((item, index) => {
        const shortest = ends.indexOf(Math.min(...ends));
        item.style.insetInlineStart = `${start + shortest * (column + columnGap)}px`;
        item.style.insetBlockStart = `${top + ends[shortest]!}px`;
        ends[shortest] = ends[shortest]! + heights[index]! + rowGap;
      });
      grid.style.blockSize = `${Math.max(0, Math.max(...ends) - rowGap) + top + (parseFloat(style.paddingBlockEnd) || 0)}px`;
    };
    const later = () => { if (!frame) frame = requestAnimationFrame(place); };
    const sizes = new ResizeObserver(later);
    const watch = () => { sizes.disconnect(); sizes.observe(grid); cards().forEach(item => sizes.observe(item)); };
    const added = new MutationObserver(() => { watch(); later(); });
    place();
    watch();
    added.observe(grid, { childList: true });
    return () => {
      cancelAnimationFrame(frame);
      sizes.disconnect();
      added.disconnect();
      delete grid.dataset.placed;
      grid.style.blockSize = "";
      for (const item of cards()) { item.style.inlineSize = ""; item.style.insetInlineStart = ""; item.style.insetBlockStart = ""; }
    };
  }, [box, on]);
}

export const AssetGrid = /* @__PURE__ */ forwardRef<HTMLDivElement, AssetGridProps>(function AssetGrid(
  { onOpen, layout = "grid", container, onKeyDown, className, children, ...rest }, ref,
) {
  const box = useRef<HTMLDivElement | null>(null);
  useWaterfall(box, layout === "waterfall");
  const keyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented || !onOpen || event.key !== "Enter") return;
    const option = (event.target as HTMLElement).closest<HTMLElement>('[role="option"]');
    if (!option?.dataset.value || option.getAttribute("aria-disabled") === "true") return;
    event.preventDefault();
    onOpen(option.dataset.value);
  };
  return (
    <GridContext.Provider value={{ open: onOpen, layout, container }}>
      <ListBox ref={node => { box.current = node; if (typeof ref === "function") ref(node); else if (ref) ref.current = node; }}
        layout="grid" className={assetGridVariants({ layout }, className)} onKeyDown={keyDown} {...rest}>
        {children}
      </ListBox>
    </GridContext.Provider>
  );
});

export interface AssetGridItemProps extends Omit<ListBoxItemProps, "children" | "textValue" | "color">, Pick<AssetCardProps, "name" | "meta" | "actions" | "media" | "mediaAlt" | "mediaRatio" | "color" | "group" | "caption" | "fill" | "borderless" | "container" | "aspect" | "children" | "frameProps" | "headProps" | "captionProps"> {
  /** The text typeahead matches; the name when it is a string. */
  textValue?: string;
}

/** One card in an AssetGrid: an option whose content is an AssetCard. A waterfall's cards hug; the grid's container is
    every card's unless a card sets its own. */
export const AssetGridItem = /* @__PURE__ */ forwardRef<HTMLDivElement, AssetGridItemProps>(function AssetGridItem(
  { name, meta, actions, media, mediaAlt, mediaRatio, color, group, caption, fill, borderless, container, aspect, children, frameProps, headProps, captionProps, textValue, value, className, onDoubleClick, ...rest }, ref,
) {
  const grid = useContext(GridContext);
  return (
    <ListBoxItem
      ref={ref}
      value={value}
      textValue={textValue ?? (typeof name === "string" ? name : undefined)}
      className={[assetGridVariants.element("item"), className].filter(Boolean).join(" ")}
      onDoubleClick={event => { onDoubleClick?.(event); if (!event.defaultPrevented && !rest.disabled) grid.open?.(value); }}
      {...rest}
    >
      <AssetCard name={name} meta={meta} actions={actions} media={media} mediaAlt={mediaAlt} mediaRatio={mediaRatio} color={color} group={group} caption={caption} fill={fill} borderless={borderless}
        container={container ?? grid.container} aspect={aspect ?? (grid.layout === "waterfall" ? "hug" : "square")}
        frameProps={frameProps} headProps={headProps ?? captionProps}>{children}</AssetCard>
    </ListBoxItem>
  );
});
