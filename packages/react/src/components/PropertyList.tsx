import { Children, createContext, forwardRef, isValidElement, useContext, useId, useLayoutEffect, useRef, useState } from "react";
import type { CSSProperties, HTMLAttributes, KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent, ReactNode } from "react";
import { propertyListVariants } from "../variants.ts";
import { Glyph } from "./Glyph.tsx";

export interface PropertyListProps extends HTMLAttributes<HTMLUListElement> {
  /** Names the list ("Fills"); each item's handle and announcements use it. */
  label: string;
  /** Moves an item. Without it the list is fixed and draws no handles. */
  onReorder?: (from: number, to: number) => void;
}

export interface PropertyListItemProps extends Omit<HTMLAttributes<HTMLLIElement>, "hidden"> {
  /** Names the item ("Fill 2") for its handle and the move announcement. */
  label: string;
  /** A property that is off (a hidden fill): its value dims; its actions stay full strength. */
  inactive?: boolean;
  /** Icon buttons after the value (visibility, remove); the last ends on the row's action column. */
  actions?: ReactNode;
}

interface ListContext {
  count: number;
  reorderable: boolean;
  dragging: number | null;
  register: (index: number, handle: HTMLButtonElement | null) => void;
  startDrag: (index: number, event: ReactPointerEvent<HTMLButtonElement>) => void;
  moveDrag: (event: ReactPointerEvent<HTMLButtonElement>) => void;
  endDrag: (commit: boolean) => void;
  keyMove: (index: number, label: string, event: ReactKeyboardEvent<HTMLButtonElement>) => void;
}
const PropertyListContext = createContext<ListContext | null>(null);
const ItemIndex = createContext(0);
const cx = (...parts: Array<string | false | undefined>) => parts.filter(Boolean).join(" ");

/**
 * An ordered list of like properties (Figma's fills, strokes, effects). Rows reorder by their
 * handle with the pointer, or with ArrowUp/ArrowDown when the handle has focus; the move is
 * announced, and focus stays on the moved item's handle.
 */
export const PropertyList = forwardRef<HTMLUListElement, PropertyListProps>(function PropertyList(
  { label, onReorder, className, children, ...rest }, ref,
) {
  const items = Children.toArray(children).filter(isValidElement);
  const count = items.length;
  const reorderable = Boolean(onReorder) && count > 1;
  const listRef = useRef<HTMLUListElement | null>(null);
  const handles = useRef<Array<HTMLButtonElement | null>>([]);
  const focusAfterMove = useRef<number | null>(null);
  const drag = useRef<{ from: number; rects: DOMRect[] } | null>(null);
  const [dragging, setDragging] = useState<number | null>(null);
  const [drop, setDrop] = useState<{ slot: number; top: number } | null>(null);
  const dropRef = useRef<{ slot: number; top: number } | null>(null);
  const [message, setMessage] = useState("");
  const statusId = useId();

  useLayoutEffect(() => {
    if (focusAfterMove.current === null) return;
    handles.current[focusAfterMove.current]?.focus();
    focusAfterMove.current = null;
  });

  const move = (from: number, to: number, itemLabel: string) => {
    if (!onReorder || from === to || to < 0 || to >= count) return;
    focusAfterMove.current = to;
    onReorder(from, to);
    setMessage(`${itemLabel} moved to position ${to + 1} of ${count}`);
  };
  const slotAt = (y: number) => {
    const state = drag.current;
    if (!state) return null;
    const { rects, from } = state;
    let slot = rects.findIndex(rect => y < rect.top + rect.height / 2);
    if (slot === -1) slot = rects.length;
    const list = listRef.current?.getBoundingClientRect();
    if (!list) return null;
    // The drop line sits in the gap before the slot's row, or after the last row.
    const first = rects[0], second = rects[1], last = rects[rects.length - 1], at = rects[slot];
    if (!first || !last) return null;
    const gap = second ? second.top - first.bottom : 0;
    const top = at ? at.top - gap / 2 : last.bottom + gap / 2;
    // Dropping beside the dragged row itself changes nothing, so no line is drawn there.
    return { slot, top: top - list.top, noop: slot === from || slot === from + 1 };
  };
  const context: ListContext = {
    count, reorderable, dragging,
    register: (index, handle) => { handles.current[index] = handle; },
    startDrag: (index, event) => {
      if (event.button !== 0) return;
      event.preventDefault();
      event.currentTarget.setPointerCapture(event.pointerId);
      const rows = [...(listRef.current?.children ?? [])].filter(node => node instanceof HTMLLIElement);
      drag.current = { from: index, rects: rows.map(row => row.getBoundingClientRect()) };
      setDragging(index);
    },
    moveDrag: event => {
      if (!drag.current) return;
      const next = slotAt(event.clientY);
      dropRef.current = next && !next.noop ? { slot: next.slot, top: next.top } : null;
      setDrop(dropRef.current);
    },
    endDrag: commit => {
      const state = drag.current;
      if (!state) return;
      const target = dropRef.current;
      drag.current = null;
      dropRef.current = null;
      setDragging(null);
      setDrop(null);
      if (commit && target) {
        const to = target.slot > state.from ? target.slot - 1 : target.slot;
        move(state.from, to, handles.current[state.from]?.dataset.label ?? "Item");
      }
    },
    keyMove: (index, itemLabel, event) => {
      if (event.key === "ArrowUp" || event.key === "ArrowDown") {
        event.preventDefault();
        move(index, index + (event.key === "ArrowUp" ? -1 : 1), itemLabel);
      } else if (event.key === "Home") {
        event.preventDefault(); move(index, 0, itemLabel);
      } else if (event.key === "End") {
        event.preventDefault(); move(index, count - 1, itemLabel);
      } else if (event.key === "Escape" && drag.current) {
        event.preventDefault(); context.endDrag(false);
      }
    },
  };

  return <PropertyListContext.Provider value={context}>
    <ul ref={node => { listRef.current = node; if (typeof ref === "function") ref(node); else if (ref) ref.current = node; }}
      aria-label={label} aria-describedby={reorderable ? statusId : undefined}
      className={propertyListVariants({}, className)} data-dragging={dragging !== null ? "" : undefined} {...rest}>
      {items.map((item, index) => <ItemIndex.Provider key={item.key ?? index} value={index}>{item}</ItemIndex.Provider>)}
      {drop ? <li className="area-property-list__indicator" aria-hidden="true" style={{ "--_drop": `${drop.top}px` } as CSSProperties} /> : null}
    </ul>
    {reorderable ? <span id={statusId} className="area-sr-only" aria-live="polite">{message || `Use the arrow keys on a handle to move ${label.toLowerCase()}.`}</span> : null}
  </PropertyListContext.Provider>;
});

export const PropertyListItem = forwardRef<HTMLLIElement, PropertyListItemProps>(function PropertyListItem(
  { label, inactive, actions, className, children, ...rest }, ref,
) {
  const list = useContext(PropertyListContext);
  const index = useContext(ItemIndex);
  return <li ref={ref} className={cx("area-property-list__item", className)}
    data-inactive={inactive ? "" : undefined} data-dragging={list?.dragging === index ? "" : undefined} {...rest}>
    {list?.reorderable ? <button type="button" className="area-property-list__handle"
      ref={node => list.register(index, node)} data-label={label}
      aria-label={`Reorder ${label}, position ${index + 1} of ${list.count}`}
      onPointerDown={event => list.startDrag(index, event)} onPointerMove={list.moveDrag}
      onPointerUp={() => list.endDrag(true)} onPointerCancel={() => list.endDrag(false)}
      onLostPointerCapture={() => list.endDrag(true)}
      onKeyDown={event => list.keyMove(index, label, event)}>
      <Glyph name="grip" />
    </button> : null}
    <div className="area-property-list__value">{children}</div>
    {actions ? <div className="area-property-list__actions">{actions}</div> : null}
  </li>;
});
