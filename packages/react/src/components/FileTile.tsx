// FileTile and FileGrid: a file browser's icon view. A tile is one item, its figure (a Folder, a file glyph or an
// image's preview) over its name and a detail line, as Finder lays items out with the label below. The grid is a
// ListBox grid of tiles (one Tab stop, arrows in two dimensions, typeahead, the row plates' paint) that also opens the
// focused item on Enter or a double click. Spec: docs/specs/file-tile.md.
import { createContext, forwardRef, useContext } from "react";
import type { HTMLAttributes, KeyboardEvent, ReactNode } from "react";
import { fileGridVariants, fileTileVariants, type VariantProps, MANIFESTS } from "../variants.ts";
import { ListBox, ListBoxItem, type ListBoxProps, type ListBoxItemProps } from "./ListBox.tsx";

type TileSize = VariantProps<typeof MANIFESTS.fileTile>["size"];

export interface FileTileProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /** The item's name: up to two lines, then an ellipsis. */
  name: ReactNode;
  /** A detail line: "12 items", "PNG · 2.4 MB", "Edited 2h ago". */
  meta?: ReactNode;
  /** What is drawn above the name: a `Folder`, a file glyph, or an image URL (contained, never cropped). */
  figure?: ReactNode | string;
  /** The image figure's text alternative. Empty by default: the name says what it is. */
  figureAlt?: string;
  /** The figure's square: `sm` 48, `md` 64, `lg` 96. Unset, it follows the grid (or 64). */
  size?: TileSize;
}

export const FileTile = /* @__PURE__ */ forwardRef<HTMLDivElement, FileTileProps>(function FileTile(
  { name, meta, figure, figureAlt = "", size, className, ...rest }, ref,
) {
  return (
    <div ref={ref} className={fileTileVariants({ size }, className)} {...rest}>
      <span className="area-file-tile__figure" aria-hidden={typeof figure === "string" && figureAlt ? undefined : "true"}>
        {typeof figure === "string" ? <img src={figure} alt={figureAlt} loading="lazy" decoding="async" draggable={false} /> : figure}
      </span>
      <span className="area-file-tile__text">
        <span className="area-file-tile__name">{name}</span>
        {meta !== undefined ? <span className="area-file-tile__meta">{meta}</span> : null}
      </span>
    </div>
  );
});

interface FileGridContext { open?: (value: string) => void }
const GridContext = createContext<FileGridContext>({});

export interface FileGridProps extends Omit<ListBoxProps, "layout"> {
  /** Every tile's figure: `sm` 48, `md` 64 (default), `lg` 96; or set `--area-file-tile-figure`. */
  size?: TileSize;
  /** Opens an item: Enter on the focused tile, or a double click. */
  onOpen?: (value: string) => void;
}

export const FileGrid = /* @__PURE__ */ forwardRef<HTMLDivElement, FileGridProps>(function FileGrid(
  { size, onOpen, onKeyDown, className, children, ...rest }, ref,
) {
  const keyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented || !onOpen || event.key !== "Enter") return;
    const option = (event.target as HTMLElement).closest<HTMLElement>('[role="option"]');
    if (!option?.dataset.value || option.getAttribute("aria-disabled") === "true") return;
    // Enter opens, as Finder's ⌘↓ and Drive's Enter; Space still selects (ListBox).
    event.preventDefault();
    onOpen(option.dataset.value);
  };
  return (
    <GridContext.Provider value={{ open: onOpen }}>
      <ListBox ref={ref} layout="grid" className={fileGridVariants({ size }, className)} onKeyDown={keyDown} {...rest}>
        {children}
      </ListBox>
    </GridContext.Provider>
  );
});

export interface FileGridItemProps extends Omit<ListBoxItemProps, "children" | "textValue">, Pick<FileTileProps, "name" | "meta" | "figure" | "figureAlt"> {
  /** The text typeahead matches; the name when it is a string. */
  textValue?: string;
  /** Something is being dragged over this item (a folder that would take it): its Folder tips open. */
  dropTarget?: boolean;
}

/** One tile in a FileGrid: an option whose content is a FileTile. */
export const FileGridItem = /* @__PURE__ */ forwardRef<HTMLDivElement, FileGridItemProps>(function FileGridItem(
  { name, meta, figure, figureAlt, textValue, dropTarget = false, value, className, onDoubleClick, ...rest }, ref,
) {
  const grid = useContext(GridContext);
  return (
    <ListBoxItem
      ref={ref}
      value={value}
      textValue={textValue ?? (typeof name === "string" ? name : undefined)}
      className={[fileGridVariants.element("item"), className].filter(Boolean).join(" ")}
      data-drop-target={dropTarget ? "" : undefined}
      onDoubleClick={event => { onDoubleClick?.(event); if (!event.defaultPrevented && !rest.disabled) grid.open?.(value); }}
      {...rest}
    >
      <FileTile name={name} meta={meta} figure={figure} figureAlt={figureAlt} />
    </ListBoxItem>
  );
});
