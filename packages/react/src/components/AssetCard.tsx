// AssetCard and AssetGrid: one asset, anything that stands alone (an image, a component, a screen, an illustration, a
// logo, a type style), in a container with its name, detail line and controls under it; a group is the same container
// holding a 2 x 2 mosaic of its first four assets. The grid is a ListBox grid of cards (one Tab stop, arrows in two
// dimensions, typeahead) that also opens the focused card on Enter or a double click, as FileGrid.
// Spec: docs/specs/asset-card.md.
import { createContext, forwardRef, useContext } from "react";
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
  /** The frame's content as the host lays it out, in place of `media` or `group` (an app's specimen stage). */
  children?: ReactNode;
  /** Attributes for the frame: a host's own class, scope or ground. The frame is always square. */
  frameProps?: PartProps;
  /** Attributes for the caption: a host's scale (the app's type and density) or class. */
  captionProps?: PartProps;
}

const image = (source: string, alt: string) => <img src={source} alt={alt} loading="lazy" decoding="async" draggable={false} />;

export const AssetCard = /* @__PURE__ */ forwardRef<HTMLDivElement, AssetCardProps>(function AssetCard(
  { name, meta, actions, media, mediaAlt = "", group, selected, interactive, caption = "inside", children, frameProps, captionProps, className, ...rest }, ref,
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
    <div ref={ref} className={assetCardVariants({ layout: group ? "group" : "asset", caption, interactive }, className)} data-selected={selected ? "" : undefined} {...rest}>
      {/* The frame paints the raised ground, so a component inside steps its fills from it (layers.css). */}
      <div className={join(assetCardVariants.element("frame"), frameClass)} data-area-ground="raised" {...frameRest}>
        {caption === "inside" ? captionNode : null}
        {children !== undefined && !group ? children : group ? (
          <div className={assetCardVariants.element("mosaic")} aria-hidden="true">
            {cells.map((cell, index) => (
              <span key={index} className={assetCardVariants.element("cell")}>{typeof cell === "string" ? image(cell, "") : cell}</span>
            ))}
          </div>
        ) : (
          <div className={assetCardVariants.element("media")} aria-hidden={typeof media === "string" && mediaAlt ? undefined : "true"}>
            {typeof media === "string" ? image(media, mediaAlt) : media}
          </div>
        )}
      </div>
      {caption === "below" ? captionNode : null}
    </div>
  );
});

interface AssetGridContext { open?: (value: string) => void }
const GridContext = createContext<AssetGridContext>({});

export interface AssetGridProps extends Omit<ListBoxProps, "layout"> {
  /** Opens a card: Enter on the focused card, or a double click. */
  onOpen?: (value: string) => void;
}

export const AssetGrid = /* @__PURE__ */ forwardRef<HTMLDivElement, AssetGridProps>(function AssetGrid(
  { onOpen, onKeyDown, className, children, ...rest }, ref,
) {
  const keyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented || !onOpen || event.key !== "Enter") return;
    const option = (event.target as HTMLElement).closest<HTMLElement>('[role="option"]');
    if (!option?.dataset.value || option.getAttribute("aria-disabled") === "true") return;
    event.preventDefault();
    onOpen(option.dataset.value);
  };
  return (
    <GridContext.Provider value={{ open: onOpen }}>
      <ListBox ref={ref} layout="grid" className={assetGridVariants({}, className)} onKeyDown={keyDown} {...rest}>
        {children}
      </ListBox>
    </GridContext.Provider>
  );
});

export interface AssetGridItemProps extends Omit<ListBoxItemProps, "children" | "textValue">, Pick<AssetCardProps, "name" | "meta" | "actions" | "media" | "mediaAlt" | "group" | "caption" | "children" | "frameProps" | "captionProps"> {
  /** The text typeahead matches; the name when it is a string. */
  textValue?: string;
}

/** One card in an AssetGrid: an option whose content is an AssetCard. */
export const AssetGridItem = /* @__PURE__ */ forwardRef<HTMLDivElement, AssetGridItemProps>(function AssetGridItem(
  { name, meta, actions, media, mediaAlt, group, caption, children, frameProps, captionProps, textValue, value, className, onDoubleClick, ...rest }, ref,
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
      <AssetCard name={name} meta={meta} actions={actions} media={media} mediaAlt={mediaAlt} group={group} caption={caption} frameProps={frameProps} captionProps={captionProps}>{children}</AssetCard>
    </ListBoxItem>
  );
});
