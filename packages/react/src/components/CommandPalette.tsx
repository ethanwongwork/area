import { forwardRef, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { HTMLAttributes, KeyboardEvent, ReactNode } from "react";
import { commandPaletteVariants } from "../variants.ts";
import { Glyph } from "./Glyph.tsx";
import { scrollOptionIntoList } from "./overlay.ts";
import { ScrollArea } from "./ScrollArea.tsx";
import { Kbd } from "./primitives.tsx";

export interface CommandItem {
  id: string;
  label: string;
  /** Muted text after the label (a page's parent, a setting's current value). */
  description?: string;
  icon?: ReactNode;
  /** Keys shown at the row's end, e.g. ["cmd", "d"] (Kbd names). */
  shortcut?: string[];
  group?: string;
  /** Extra words that match the search. */
  keywords?: string[];
  disabled?: boolean;
  /** Runs when the row is chosen. The palette closes afterwards unless `keepOpen`. */
  onSelect?: () => void;
  keepOpen?: boolean;
}

export interface CommandPaletteProps extends Omit<HTMLAttributes<HTMLDivElement>, "onSelect"> {
  items: CommandItem[];
  /** Controlled open state; omit it with `inline`. */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Render the surface in place instead of a modal (a docs specimen, a sidebar search). */
  inline?: boolean;
  /** Opens the palette from anywhere: "mod+k" (⌘ on Apple, Ctrl elsewhere). */
  hotkey?: string;
  query?: string;
  defaultQuery?: string;
  onQueryChange?: (query: string) => void;
  placeholder?: string;
  /** Names the palette and its search field (default "Command palette"). */
  "aria-label"?: string;
  /** @deprecated Use `aria-label` (audit D-18). */
  label?: string;
  emptyText?: ReactNode;
  /** What the live region says for a result count while searching (audit D-29). */
  resultsLabel?: (count: number) => string;
  /** Replaces the key hints below the list; `false` removes them. */
  footer?: ReactNode | false;
  filter?: (item: CommandItem, query: string) => boolean;
}

const matches = (item: CommandItem, query: string) => {
  const q = query.trim().toLocaleLowerCase();
  if (!q) return true;
  return [item.label, item.description ?? "", ...(item.keywords ?? [])].some(text => text.toLocaleLowerCase().includes(q));
};
const isApple = () => typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);

/**
 * A search field over a list of actions and places. Type to narrow, ↑/↓ to move, Enter to
 * run, Escape to close; focus stays in the field (combobox + listbox).
 */
export const CommandPalette = forwardRef<HTMLDivElement, CommandPaletteProps>(function CommandPalette(
  { items, open: openProp, defaultOpen = false, onOpenChange, inline, hotkey, query: queryProp, defaultQuery = "",
    onQueryChange, placeholder = "Search or run a command…", "aria-label": ariaLabel, label: labelProp, emptyText = "No results", resultsLabel = (count: number) => `${count} ${count === 1 ? "result" : "results"}`,
    footer, filter = matches, className, ...rest }, ref,
) {
  const label = ariaLabel ?? labelProp ?? "Command palette";
  const id = useId();
  const listId = `${id}-list`;
  const [ownOpen, setOwnOpen] = useState(defaultOpen);
  const open = inline ? true : openProp ?? ownOpen;
  const [ownQuery, setOwnQuery] = useState(defaultQuery);
  const query = queryProp ?? ownQuery;
  const [active, setActive] = useState(0);
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  // While the modal fades out the surface stays as it was when it closed (the cleared query does
  // not refill the list mid-exit), then unmounts once the exit's transitions finish.
  const [present, setPresent] = useState(open);
  if (open && !present) setPresent(true);
  const openNow = useRef(open);
  openNow.current = open;
  const frozen = useRef<ReactNode>(null);

  const setOpen = (next: boolean) => {
    if (openProp === undefined) setOwnOpen(next);
    onOpenChange?.(next);
  };
  const setQuery = (next: string) => {
    if (queryProp === undefined) setOwnQuery(next);
    onQueryChange?.(next);
    setActive(0);
  };

  // Rows, grouped in the order each group first appears; the flat order is the arrow order.
  const rows = useMemo(() => {
    const found = items.filter(item => filter(item, query));
    const order = [...new Set(found.map(item => item.group))];
    return [...found].sort((a, b) => order.indexOf(a.group) - order.indexOf(b.group));
  }, [items, query, filter]);
  const enabled = (index: number) => rows[index] !== undefined && !rows[index]?.disabled;
  const step = (from: number, delta: 1 | -1) => {
    for (let i = 1; i <= rows.length; i++) {
      const next = (from + delta * i + rows.length * 2) % rows.length;
      if (enabled(next)) return next;
    }
    return -1;
  };
  const current = enabled(active) ? active : step(-1, 1);

  useLayoutEffect(() => {
    if (inline) return;
    const dialog = dialogRef.current;
    if (!dialog || typeof dialog.showModal !== "function") return;
    if (open && !dialog.open) { dialog.showModal(); inputRef.current?.focus(); }
    if (!open && dialog.open) dialog.close();
    if (!open && present) {
      const done = () => { if (!openNow.current) setPresent(false); };
      if (typeof dialog.getAnimations !== "function") done();
      else Promise.all(dialog.getAnimations().map(animation => animation.finished)).then(done, done);
    }
  }, [open, inline]);
  useEffect(() => {
    if (!hotkey || inline) return;
    const [mod, key] = hotkey.toLowerCase().split("+");
    const onKey = (event: globalThis.KeyboardEvent) => {
      const modifier = mod === "mod" ? (isApple() ? event.metaKey : event.ctrlKey) : mod === "ctrl" ? event.ctrlKey : mod === "meta" ? event.metaKey : false;
      if (modifier && event.key.toLowerCase() === key) { event.preventDefault(); setOpen(!open); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });
  useEffect(() => {
    if (current < 0) return;
    scrollOptionIntoList(listRef.current, listRef.current?.querySelector<HTMLElement>(`[data-index="${current}"]`));
  }, [current]);

  const run = (item: CommandItem | undefined) => {
    if (!item || item.disabled) return;
    item.onSelect?.();
    if (!item.keepOpen && !inline) { setOpen(false); setQuery(""); }
  };
  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") { event.preventDefault(); setActive(step(current, 1)); }
    else if (event.key === "ArrowUp") { event.preventDefault(); setActive(step(current < 0 ? 0 : current, -1)); }
    else if (event.key === "Home" && event.ctrlKey) { event.preventDefault(); setActive(step(-1, 1)); }
    else if (event.key === "End" && event.ctrlKey) { event.preventDefault(); setActive(step(rows.length, -1)); }
    else if (event.key === "Enter") { event.preventDefault(); run(rows[current]); }
    else if (event.key === "Escape" && !inline) {
      event.preventDefault();
      if (query) setQuery(""); else setOpen(false);
    }
  };

  const keepFocus = (event: { preventDefault(): void }) => event.preventDefault();

  let index = -1;
  const renderRow = (item: CommandItem) => {
    index += 1;
    const i = index;
    return <div key={item.id} id={`${id}-item-${i}`} data-index={i} role="option" aria-selected={i === current}
      aria-disabled={item.disabled || undefined} data-disabled={item.disabled ? "" : undefined} className="area-menu__item area-command-palette__item"
      data-highlighted={i === current ? "" : undefined}
      onPointerDown={event => event.preventDefault()} onPointerMove={() => { if (!item.disabled && i !== current) setActive(i); }}
      onClick={() => run(item)}>
      {item.icon ? <span className="area-menu__icon" aria-hidden="true">{item.icon}</span> : null}
      <span className="area-menu__text area-command-palette__text">{item.label}</span>
      {item.description ? <span className="area-command-palette__description">{item.description}</span> : null}
      {item.shortcut ? <span className="area-menu__shortcut"><Kbd keys={item.shortcut} size="sm" variant="quiet" /></span> : null}
    </div>;
  };
  const groups: Array<[string | undefined, CommandItem[]]> = [];
  for (const item of rows) {
    const last = groups[groups.length - 1];
    if (last && last[0] === item.group) last[1].push(item); else groups.push([item.group, [item]]);
  }

  const surface = <div ref={ref} role={inline ? "search" : undefined} aria-label={inline ? label : undefined}
    className={commandPaletteVariants({ inline }, className)} {...rest}>
    <div className="area-command-palette__search">
      <span className="area-command-palette__search-icon" aria-hidden="true"><Glyph name="search" /></span>
      <input ref={inputRef} className="area-command-palette__input" role="combobox" aria-label={label}
        aria-expanded={true} aria-controls={listId} aria-autocomplete="list"
        aria-activedescendant={current >= 0 ? `${id}-item-${current}` : undefined}
        autoComplete="off" spellCheck={false} placeholder={placeholder} value={query}
        onChange={event => setQuery(event.target.value)} onKeyDown={handleKeyDown} />
    </div>
    {/* The result count, or the empty text, is announced while a query is typed (audit D-29). */}
    <span className="area-sr-only" role="status">{query ? (rows.length ? resultsLabel(rows.length) : typeof emptyText === "string" ? emptyText : "") : ""}</span>
    <ScrollArea ref={listRef} id={listId} role="listbox" aria-label={label} className="area-command-palette__list" viewportProps={{ tabIndex: undefined }}>
      {rows.length === 0 ? <div className="area-command-palette__empty" role="presentation">{emptyText}</div> : null}
      {groups.map(([group, list], g) => group
        ? <div key={`${group}-${g}`} role="group" aria-labelledby={`${id}-group-${g}`} className="area-command-palette__group">
            <div id={`${id}-group-${g}`} className="area-menu__label" role="presentation">{group}</div>
            {list.map(renderRow)}
          </div>
        : <div key={`ungrouped-${g}`} role="presentation" className="area-command-palette__group">{list.map(renderRow)}</div>)}
    </ScrollArea>
    {footer === false ? null : <div className="area-command-palette__footer" aria-hidden={footer ? undefined : true}>
      {footer ?? <>
        {/* The hints also work by pointer. They stay out of the tab order and keep focus in the
            field; keyboard users press the keys themselves, so assistive tech skips the row. */}
        <span className="area-command-palette__hint">
          <button type="button" tabIndex={-1} className="area-command-palette__hint-button" onPointerDown={keepFocus}
            onClick={() => setActive(step(current < 0 ? 0 : current, -1))} disabled={current < 0}><Kbd keys={["up"]} size="sm" variant="quiet" /></button>
          <button type="button" tabIndex={-1} className="area-command-palette__hint-button" onPointerDown={keepFocus}
            onClick={() => setActive(step(current, 1))} disabled={current < 0}><Kbd keys={["down"]} size="sm" variant="quiet" /></button>
          Move
        </span>
        <button type="button" tabIndex={-1} className="area-command-palette__hint area-command-palette__hint-button" onPointerDown={keepFocus}
          onClick={() => run(rows[current])} disabled={current < 0}><Kbd keys={["enter"]} size="sm" variant="quiet" />Open</button>
        {inline ? null : <button type="button" tabIndex={-1} className="area-command-palette__hint area-command-palette__hint-button" onPointerDown={keepFocus}
          onClick={() => setOpen(false)}><Kbd keys={["esc"]} size="sm" variant="quiet" />Close</button>}
      </>}
    </div>}
  </div>;

  if (inline) return surface;
  return <dialog ref={dialogRef} className="area-command-palette__modal" aria-label={label}
    onCancel={event => { event.preventDefault(); if (query) setQuery(""); else setOpen(false); }}
    onClick={event => { if (event.target === event.currentTarget) setOpen(false); }}>
    {open ? (frozen.current = surface) : present ? frozen.current : null}
  </dialog>;
});
