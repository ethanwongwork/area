// AssetCard and AssetGrid: one asset, anything that stands alone (an image, a component, a screen, an illustration, a
// logo, a type style), in a container with its name, detail line and controls under it; a group is the same container
// holding a 2 x 2 mosaic of its first four assets. The grid is a ListBox grid of cards (one Tab stop, arrows in two
// dimensions, typeahead) that also opens the focused card on Enter or a double click, as FileGrid; as a waterfall its
// cards hug their assets in columns, each dropped into the shortest. Spec: docs/specs/asset-card.md.
import { createContext, forwardRef, useContext, useLayoutEffect, useRef } from "react";
import type { HTMLAttributes, KeyboardEvent, ReactNode } from "react";
import { assetCardVariants, assetGridVariants } from "../variants.ts";
import { ListBox, ListBoxItem, type ListBoxProps, type ListBoxItemProps } from "./ListBox.tsx";

/** Attributes for a part: HTML attributes and `data-*` hooks (a host's own class, a scope, a ground). */
type PartProps = HTMLAttributes<HTMLDivElement> & Record<`data-${string}`, string | undefined>;

export interface AssetCardProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /** The asset's name: one line, then an ellipsis. */
  name: ReactNode;
  /** A detail line under the name: "PNG · 1200 × 800", "14 assets", "Edited 2h ago". */
  meta?: ReactNode;
  /** Controls at the end of the caption, on the name's line: a Copy or More button. Keep them few. */
  actions?: ReactNode;
  /** The asset: an image URL (contained, never cropped) or any element, centred in the frame. */
  media?: ReactNode | string;
  /** The image's text alternative. Empty by default: the name says what it is. */
  mediaAlt?: string;
  /**
   * A group: its assets, as image URLs or elements. The first four fill a 2 x 2 mosaic, each cropped to its cell;
   * fewer leave cells empty. Set, it replaces `media`.
   */
  group?: Array<ReactNode | string>;
  /** Selected: the frame's edge in the selection colour. In an AssetGrid the grid sets it. */
  selected?: boolean;
  /**
   * The card is a control of its own (a button, a selectable item) outside an AssetGrid: hover lifts the frame, a
   * press drops it, keyboard focus rings it, and `aria-pressed` or `aria-selected` shows as the selected edge.
   */
  interactive?: boolean;
  /** Where the name, detail and controls sit: inside the frame at its top (the default), or below it. */
  caption?: "inside" | "below";
  /**
   * framed (the default): the asset in a container. containerless: no container at rest, the asset on the page's own
   * ground. A component keeps the frame's box, its edge shown on hover and selection; an image or a group is its own
   * surface (an image's corner, a group's four cells close together) and the states paint it.
   */
  container?: "framed" | "containerless";
  /** square (the default): the frame is square. hug: the frame is as tall as its asset at the card's width. */
  aspect?: "square" | "hug";
  /** An image's width over its height, so it holds its shape before it loads (a waterfall's cards). */
  mediaRatio?: number;
  /** The frame's content as the host lays it out, in place of `media` or `group` (an app's specimen stage). */
  children?: ReactNode;
  /** Attributes for the frame: a host's own class, scope or ground. The frame is always square. */
  frameProps?: PartProps;
  /** Attributes for the caption: a host's scale (the app's type and density) or class. */
  captionProps?: PartProps;
}

const image = (source: string, alt: string, ratio?: number) => (
  <img src={source} alt={alt} loading="lazy" decoding="async" draggable={false} style={ratio ? { aspectRatio: ratio } : undefined} />
);

export const AssetCard = /* @__PURE__ */ forwardRef<HTMLDivElement, AssetCardProps>(function AssetCard(
  { name, meta, actions, media, mediaAlt = "", group, selected, interactive, caption = "inside", container = "framed", aspect = "square", mediaRatio, children, frameProps, captionProps, className, ...rest }, ref,
) {
  const cells = group ? [0, 1, 2, 3].map(index => group[index]) : [];
  const { className: frameClass, ...frameRest } = frameProps ?? {};
  const { className: captionClass, ...captionRest } = captionProps ?? {};
  const join = (...names: Array<string | undefined>) => names.filter(Boolean).join(" ");
  const captionNode = (
    <div className={join(assetCardVariants.element("caption"), captionClass)} {...captionRest}>
      <div className={assetCardVariants.element("text")}>
        <span className={assetCardVariants.element("name")}>{name}</span>
        {meta !== undefined ? <span className={assetCardVariants.element("meta")}>{meta}</span> : null}
      </div>
      {actions ? <div className={assetCardVariants.element("actions")}>{actions}</div> : null}
    </div>
  );
  return (
    <div ref={ref} className={assetCardVariants({ layout: group ? "group" : "asset", caption, container, aspect, interactive }, className)} data-selected={selected ? "" : undefined} {...rest}>
      {/* A frame paints the raised ground, so a component inside steps its fills from it (layers.css); a containerless
          one paints none, so the component steps from the page's ground. */}
      <div className={join(assetCardVariants.element("frame"), frameClass)} data-area-ground={container === "containerless" ? undefined : "raised"} {...frameRest}>
        {caption === "inside" ? captionNode : null}
        {children !== undefined && !group ? children : group ? (
          <div className={assetCardVariants.element("mosaic")} aria-hidden="true">
            {cells.map((cell, index) => (
              <span key={index} className={assetCardVariants.element("cell")}>{typeof cell === "string" ? image(cell, "") : cell}</span>
            ))}
          </div>
        ) : (
          <div className={assetCardVariants.element("media")} aria-hidden={typeof media === "string" && mediaAlt ? undefined : "true"}>
            {typeof media === "string" ? image(media, mediaAlt, mediaRatio) : media}
          </div>
        )}
      </div>
      {caption === "below" ? captionNode : null}
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

export interface AssetGridItemProps extends Omit<ListBoxItemProps, "children" | "textValue">, Pick<AssetCardProps, "name" | "meta" | "actions" | "media" | "mediaAlt" | "mediaRatio" | "group" | "caption" | "container" | "aspect" | "children" | "frameProps" | "captionProps"> {
  /** The text typeahead matches; the name when it is a string. */
  textValue?: string;
}

/** One card in an AssetGrid: an option whose content is an AssetCard. A waterfall's cards hug; the grid's container is
    every card's unless a card sets its own. */
export const AssetGridItem = /* @__PURE__ */ forwardRef<HTMLDivElement, AssetGridItemProps>(function AssetGridItem(
  { name, meta, actions, media, mediaAlt, mediaRatio, group, caption, container, aspect, children, frameProps, captionProps, textValue, value, className, onDoubleClick, ...rest }, ref,
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
      <AssetCard name={name} meta={meta} actions={actions} media={media} mediaAlt={mediaAlt} mediaRatio={mediaRatio} group={group} caption={caption}
        container={container ?? grid.container} aspect={aspect ?? (grid.layout === "waterfall" ? "hug" : "square")}
        frameProps={frameProps} captionProps={captionProps}>{children}</AssetCard>
    </ListBoxItem>
  );
});
