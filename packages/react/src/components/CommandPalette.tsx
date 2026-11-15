import { forwardRef, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { HTMLAttributes, KeyboardEvent, ReactNode } from "react";
import { commandPaletteVariants } from "../variants.ts";
import { Glyph } from "./Glyph.tsx";
import { scrollOptionIntoList } from "./overlay.ts";
import { ScrollArea } from "./ScrollArea.tsx";
import { announce } from "./announce.ts";
import { highlightMatch } from "./highlight.tsx";
import { Kbd } from "./Kbd.tsx";

export interface CommandItem {
  id: string;
  label: string;
  /** Muted text after the label (a page's parent, a setting's current value). */
  description?: string;
  /**
   * Where the result lives, after its name in the secondary ink ("Projects / Item one"); it truncates before the name
   * does (components audit V4).
   */
  path?: string;
  /** Shown in the preview pane beside the results while this row is the active one (V4); hidden in a narrow palette. */
  preview?: ReactNode;
  /**
   * Choosing the row opens a step that lists these instead of running it (a command that asks for more: "Change
   * theme…" → the themes). The field shows the step's name and a Back button; Escape, or Backspace in an empty field,
   * goes back (V4).
   */
  items?: CommandItem[];
  /** The field's placeholder while this row's step is open. */
  placeholder?: string;
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
  /** The rows to search and run, in groups by their `group`. */
  items: CommandItem[];
  /** Controlled open state; omit it with `inline`. */
  open?: boolean;
  /** Whether the palette starts open, uncontrolled. */
  defaultOpen?: boolean;
  /** Called when the palette opens or closes: the hotkey, Escape, a chosen row or the backdrop. */
  onOpenChange?: (open: boolean) => void;
  /** Draws the surface in place instead of as a modal, for a search in a sidebar or a specimen. */
  inline?: boolean;
  /** Opens the palette from anywhere: "mod+k" is ⌘K or Ctrl+K, by platform. */
  hotkey?: string;
  /** The search text, controlled. */
  query?: string;
  /** The search text at first, uncontrolled. */
  defaultQuery?: string;
  /** Called with the search text as it is typed. */
  onQueryChange?: (query: string) => void;
  /** The search field's placeholder. */
  placeholder?: string;
  /** Names the palette and its search field (default "Command palette"). */
  "aria-label"?: string;
  /** @deprecated Use `aria-label`. */
  label?: string;
  /** Shown when nothing matches the search. */
  emptyText?: ReactNode;
  /** What the live region says for a result count while searching. */
  resultsLabel?: (count: number) => string;
  /** Replaces the key hints below the list; `false` removes them. */
  footer?: ReactNode | false;
  /**
   * How rows match the search; by default a case-insensitive "contains" on the label, description, path and
   * `keywords`.
   */
  filter?: (item: CommandItem, query: string) => boolean;
  /** Names the Back button of a step (default "Back"). */
  backLabel?: string;
  /** Names the preview pane (default "Preview"). */
  previewLabel?: string;
}

const matches = (item: CommandItem, query: string) => {
  const q = query.trim().toLocaleLowerCase();
  if (!q) return true;
  return [item.label, item.description ?? "", item.path ?? "", ...(item.keywords ?? [])].some(text => text.toLocaleLowerCase().includes(q));
};
const isApple = () => typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);

/**
 * A search field over a list of actions and places. Type to narrow, ↑/↓ to move, Enter to
 * run, Escape to close; focus stays in the field (combobox + listbox).
 */
export const CommandPalette = forwardRef<HTMLDivElement, CommandPaletteProps>(function CommandPalette(
  { items, open: openProp, defaultOpen = false, onOpenChange, inline, hotkey, query: queryProp, defaultQuery = "",
    onQueryChange, placeholder = "Search or run a command…", "aria-label": ariaLabel, label: labelProp, emptyText = "No results", resultsLabel = (count: number) => `${count} ${count === 1 ? "result" : "results"}`,
    footer, filter = matches, backLabel = "Back", previewLabel = "Preview", className, ...rest }, ref,
) {
  const label = ariaLabel ?? labelProp ?? "Command palette";
  const id = useId();
  const listId = `${id}-list`;
  const [ownOpen, setOwnOpen] = useState(defaultOpen);
  const open = inline ? true : openProp ?? ownOpen;
  const [ownQuery, setOwnQuery] = useState(defaultQuery);
  const query = queryProp ?? ownQuery;
  const [active, setActive] = useState(0);
  // The steps opened so far: each a row with `items`, the last one's items listed (V4).
  const [trail, setTrail] = useState<CommandItem[]>([]);
  const step = trail.at(-1);
  const list = step?.items ?? items;
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
  const back = () => { setTrail(trail.slice(0, -1)); setQuery(""); };
  // A closed palette opens at its first list again.
  useEffect(() => { if (!open && trail.length) setTrail([]); }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  // Rows, grouped in the order each group first appears; the flat order is the arrow order.
  const rows = useMemo(() => {
    const found = list.filter(item => filter(item, query));
    const order = [...new Set(found.map(item => item.group))];
    return [...found].sort((a, b) => order.indexOf(a.group) - order.indexOf(b.group));
  }, [list, query, filter]);
  // The count of what the query found, said through the shared announcer while the palette shows (components audit D1).
  useEffect(() => {
    if (!open || !query) return;
    announce(rows.length ? resultsLabel(rows.length) : typeof emptyText === "string" ? emptyText : "");
  }, [open, query, rows.length]); // eslint-disable-line react-hooks/exhaustive-deps -- the labels are read as they are now
  const enabled = (index: number) => rows[index] !== undefined && !rows[index]?.disabled;
  const next = (from: number, delta: 1 | -1) => {
    for (let i = 1; i <= rows.length; i++) {
      const next = (from + delta * i + rows.length * 2) % rows.length;
      if (enabled(next)) return next;
    }
    return -1;
  };
  const current = enabled(active) ? active : next(-1, 1);

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
    if (item.items) {
      // A step: its rows replace the list, and the field starts empty (Cursor's quick input title bar with Back).
      item.onSelect?.();
      setTrail([...trail, item]);
      setQuery("");
      announce(item.label);
      inputRef.current?.focus();
      return;
    }
    item.onSelect?.();
    if (!item.keepOpen && !inline) { setOpen(false); setQuery(""); setTrail([]); }
  };
  // Escape steps back one thing at a time: the typed text, then the step, then the palette.
  const escape = () => {
    if (query) setQuery("");
    else if (trail.length) back();
    else if (!inline) setOpen(false);
  };
  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") { event.preventDefault(); setActive(next(current, 1)); }
    else if (event.key === "ArrowUp") { event.preventDefault(); setActive(next(current < 0 ? 0 : current, -1)); }
    else if (event.key === "Home" && event.ctrlKey) { event.preventDefault(); setActive(next(-1, 1)); }
    else if (event.key === "End" && event.ctrlKey) { event.preventDefault(); setActive(next(rows.length, -1)); }
    else if (event.key === "Enter") { event.preventDefault(); run(rows[current]); }
    else if (event.key === "Backspace" && !query && trail.length && !event.repeat) { event.preventDefault(); back(); }
    else if (event.key === "Escape" && (!inline || trail.length)) { event.preventDefault(); escape(); }
  };

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
      <span className="area-menu__text area-command-palette__text">{highlightMatch(item.label, query)}</span>
      {item.path ? <span className="area-command-palette__path">{highlightMatch(item.path, query)}</span> : null}
      {item.description ? <span className="area-command-palette__description">{highlightMatch(item.description, query)}</span> : null}
      {item.items ? <span className="area-command-palette__more" aria-hidden="true"><Glyph name="chevron-down" rotate={270} /></span> : null}
      {item.shortcut ? <span className="area-menu__shortcut"><Kbd keys={item.shortcut} size="sm" /></span> : null}
    </div>;
  };
  const groups: Array<[string | undefined, CommandItem[]]> = [];
  for (const item of rows) {
    const last = groups[groups.length - 1];
    if (last && last[0] === item.group) last[1].push(item); else groups.push([item.group, [item]]);
  }

  // The preview pane shows while some row has a preview; it holds the active row's (V4).
  const previews = rows.some(item => item.preview !== undefined && item.preview !== null);
  const preview = current >= 0 ? rows[current]?.preview : undefined;
  const results = <ScrollArea ref={listRef} id={listId} role="listbox" aria-label={label} className="area-command-palette__list" viewportProps={{ tabIndex: undefined }}>
      {rows.length === 0 ? <div className="area-menu__empty" role="presentation"><span className="area-menu__text">{emptyText}</span></div> : null}
      {groups.map(([group, list], g) => group
        ? <div key={`${group}-${g}`} role="group" aria-labelledby={`${id}-group-${g}`} className="area-command-palette__group">
            <div id={`${id}-group-${g}`} className="area-menu__label" role="presentation"><span className="area-menu__label-text">{group}</span></div>
            {list.map(renderRow)}
          </div>
        : <div key={`ungrouped-${g}`} role="presentation" className="area-command-palette__group">{list.map(renderRow)}</div>)}
    </ScrollArea>;

  const surface = <div ref={ref} role={inline ? "search" : undefined} aria-label={inline ? label : undefined}
    className={commandPaletteVariants({ inline }, className)} data-preview={previews ? "" : undefined} {...rest}>
    <div className="area-command-palette__search">
      {step
        ? <button type="button" className="area-command-palette__back" aria-label={backLabel}
            onPointerDown={event => event.preventDefault()} onClick={() => { back(); inputRef.current?.focus(); }}>
            <Glyph name="arrow-up" rotate={270} />
          </button>
        : <span className="area-command-palette__search-icon" aria-hidden="true"><Glyph name="search" /></span>}
      {/* The step's trail, before the typed text, describes the field (Cursor's quick input title). */}
      {step ? <span id={`${id}-step`} className="area-command-palette__step">{trail.map(entry => entry.label).join(" / ")}</span> : null}
      <input ref={inputRef} className="area-command-palette__input" role="combobox" aria-label={label}
        aria-describedby={step ? `${id}-step` : undefined}
        aria-expanded={true} aria-controls={listId} aria-autocomplete="list"
        aria-activedescendant={current >= 0 ? `${id}-item-${current}` : undefined}
        autoComplete="off" spellCheck={false} placeholder={step?.placeholder ?? placeholder} value={query}
        onChange={event => setQuery(event.target.value)} onKeyDown={handleKeyDown} />
    </div>
    {/* The result count, or the empty text, is announced while a query is typed (audit D-29). */}
    {previews
      ? <div className="area-command-palette__body">
          {results}
          <div className="area-command-palette__preview" role="region" aria-label={previewLabel}>{preview}</div>
        </div>
      : results}
    {footer === false ? null : <div className="area-command-palette__footer" aria-hidden={footer ? undefined : true}>
      {footer ?? <>
        {/* Static hints (owner, round 68): what the keys do, not controls. A pointer clicks the row itself; keyboard
            users press the keys, so assistive tech skips the row. */}
        <span className="area-command-palette__hint">
          <span className="area-command-palette__keys"><Kbd keys={["up"]} size="sm" /><Kbd keys={["down"]} size="sm" /></span>
          Move
        </span>
        <span className="area-command-palette__hint"><Kbd keys={["enter"]} size="sm" />Open</span>
        {step ? <span className="area-command-palette__hint"><Kbd keys={["esc"]} size="sm" />Back</span>
          : inline ? null : <span className="area-command-palette__hint"><Kbd keys={["esc"]} size="sm" />Close</span>}
      </>}
    </div>}
  </div>;

  if (inline) return surface;
  return <dialog ref={dialogRef} className="area-command-palette__modal" aria-label={label}
    onCancel={event => { event.preventDefault(); escape(); }}
    onClick={event => { if (event.target === event.currentTarget) setOpen(false); }}>
    {open ? (frozen.current = surface) : present ? frozen.current : null}
  </dialog>;
});
