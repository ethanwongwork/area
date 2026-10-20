// AssetCard and AssetGrid: one asset in a square card: a head with its name and controls, then a frame holding the asset
// 4 in from the card's edge (owner, round 55: the Image, Group and Component container designs). The frame's content
// sets the kind: any element centred on the surface (a component, a type sample, an icon, a setting's preview), an image
// covering the frame, a colour painting it, or a group's first four assets as a 2 x 2 mosaic. The grid is a ListBox grid
// of cards (one Tab stop, arrows in two dimensions, typeahead) that also opens the focused card on Enter or a double
// click, as FileGrid. Spec: docs/specs/asset-card.md.
import { createContext, forwardRef, useContext } from "react";
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
  /** The frame's content as the host lays it out, in place of `media` (an app's specimen stage). */
  children?: ReactNode;
  /** Attributes for the frame: a host's own class, scope or ground. */
  frameProps?: PartProps;
  /** Attributes for the head: a host's scale (the app's type and density) or class. */
  headProps?: PartProps;
  /** @deprecated Use `headProps`. */
  captionProps?: PartProps;
  /** @deprecated The name is always in the head, above the frame (round 55's designs); ignored. */
  caption?: "inside" | "below";
}

const image = (source: string, alt: string) => <img src={source} alt={alt} loading="lazy" decoding="async" draggable={false} />;
const join = (...names: Array<string | undefined>) => names.filter(Boolean).join(" ");

export const AssetCard = /* @__PURE__ */ forwardRef<HTMLDivElement, AssetCardProps>(function AssetCard(
  { name, meta: _meta, actions, media, mediaAlt = "", color, group, selected, interactive, caption: _caption, children, frameProps, headProps, captionProps,
    className, style, ...rest }, ref,
) {
  const layout = group ? "group" : color !== undefined && children === undefined ? "color" : typeof media === "string" && children === undefined ? "image" : "asset";
  const cells = group ? [0, 1, 2, 3].map(index => group[index]) : [];
  const { className: frameClass, ...frameRest } = frameProps ?? {};
  const { className: headClass, ...headRest } = headProps ?? captionProps ?? {};
  return (
    <div ref={ref} className={assetCardVariants({ layout, interactive }, className)} data-selected={selected ? "" : undefined}
      style={layout === "color" ? { ...style, "--_asset-color": color } as CSSProperties : style} {...rest}>
      <div className={join(assetCardVariants.element("head"), headClass)} {...headRest}>
        <span className={assetCardVariants.element("name")}>{name}</span>
        {actions ? <div className={assetCardVariants.element("actions")}>{actions}</div> : null}
      </div>
      {/* The frame paints the raised ground, so a component inside steps its fills from it (layers.css). */}
      <div className={join(assetCardVariants.element("frame"), frameClass)} data-area-ground="raised" {...frameRest}>
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
            {typeof media === "string" ? image(media, mediaAlt) : media}
          </div>
        )}
      </div>
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

export interface AssetGridItemProps extends Omit<ListBoxItemProps, "children" | "textValue" | "color">, Pick<AssetCardProps, "name" | "meta" | "actions" | "media" | "mediaAlt" | "color" | "group" | "caption" | "children" | "frameProps" | "headProps" | "captionProps"> {
  /** The text typeahead matches; the name when it is a string. */
  textValue?: string;
}

/** One card in an AssetGrid: an option whose content is an AssetCard. */
export const AssetGridItem = /* @__PURE__ */ forwardRef<HTMLDivElement, AssetGridItemProps>(function AssetGridItem(
  { name, meta, actions, media, mediaAlt, color, group, caption, children, frameProps, headProps, captionProps, textValue, value, className, onDoubleClick, ...rest }, ref,
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
      <AssetCard name={name} meta={meta} actions={actions} media={media} mediaAlt={mediaAlt} color={color} group={group} caption={caption} frameProps={frameProps} headProps={headProps ?? captionProps}>{children}</AssetCard>
    </ListBoxItem>
  );
});
