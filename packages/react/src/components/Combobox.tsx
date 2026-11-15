import { forwardRef, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { KeyboardEvent, ReactNode, SyntheticEvent } from "react";
import { comboboxVariants, type VariantProps, MANIFESTS } from "../variants.ts";
import { Glyph } from "./Glyph.tsx";
import { highlightMatch } from "./highlight.tsx";
import { scrollOptionIntoList, useAnchoredPosition, useOpenState } from "./overlay.ts";
import { ScrollArea } from "./ScrollArea.tsx";
import { announce } from "./announce.ts";
import { MENU_OFFSET, OVERLAY_PADDING } from "./Overlays.tsx";
import { Input, InputAction, type InputProps } from "./Input.tsx";
/** The empty collection, one reference so effects keyed on it stay still. */
const NO_ITEMS: never[] = [];

export interface ComboboxOption {
  value: string;
  /** What the field shows and filtering matches. */
  label: string;
  /** Muted text at the row's end (a shortcut, a count, a detail). */
  description?: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
  /** Options with the same group are listed together under it. */
  group?: string;
}

export interface ComboboxProps extends Omit<InputProps, "value" | "defaultValue" | "onChange" | "size" | "trailingAction" | "role"> {
  /** The field's height and type, as Input's: `md` by default. */
  size?: VariantProps<typeof MANIFESTS.input>["size"];
  /** The field's treatment, as Input's. */
  variant?: InputProps["variant"];
  /** The suggestions. */
  items?: ComboboxOption[];
  /** Shown when nothing matches (and nothing can be created). */
  emptyText?: ReactNode;
  /** Name of the list toggle button. */
  toggleLabel?: string;
  /** The selected option's value (controlled). */
  value?: string | null;
  /** The option chosen at first, uncontrolled; none by default. */
  defaultValue?: string | null;
  /** The text in the field (controlled). */
  inputValue?: string;
  /** The text in the field at first, uncontrolled. */
  defaultInputValue?: string;
  /** Keep typed text that matches no option (a font size, a tag); otherwise the field reverts on blur. */
  allowsCustomValue?: boolean;
  /** How options match the text. Defaults to a case-insensitive "contains". */
  filter?: (option: ComboboxOption, text: string) => boolean;
  /** The list is open (controlled); `defaultOpen` opens it at first; `onOpenChange` hears it open and close. */
  open?: boolean;
  /** Whether the list starts open, uncontrolled. */
  defaultOpen?: boolean;
  /** @deprecated Use `items`. */
  options?: ComboboxOption[];
  /** Called with the chosen value and the event that chose it (no event when a created option resolves later). */
  onValueChange?: (value: string | null, event?: SyntheticEvent) => void;
  /** Called with the field's text as it is typed. */
  onInputChange?: (text: string) => void;
  /** Offer a "Create" row for text that matches no option. */
  onCreate?: (text: string) => void;
  /** Called when the list opens or closes. */
  onOpenChange?: (open: boolean) => void;
}

const contains = (option: ComboboxOption, text: string) => option.label.toLocaleLowerCase().includes(text.trim().toLocaleLowerCase());
type Row = { kind: "option"; option: ComboboxOption } | { kind: "create"; text: string };

/**
 * An editable field with a list of suggestions that filters as you type. Arrow keys move
 * through the list without leaving the field, Enter picks, Escape closes; the list is
 * Menu's surface and rows.
 */
export const Combobox = forwardRef<HTMLInputElement, ComboboxProps>(function Combobox(
  { items, options: legacyOptions, value, defaultValue = null, onValueChange, inputValue, defaultInputValue, onInputChange,
    allowsCustomValue, onCreate, filter = contains, emptyText = "No results", size, toggleLabel = "Show suggestions",
    fullWidth, disabled, readOnly, open: openProp, defaultOpen, onOpenChange, className, style, onKeyDown, onBlur, onFocus, placeholder, name, form,
    ...rest }, ref,
) {
  const options = items ?? legacyOptions ?? NO_ITEMS;
  const id = useId();
  const listId = `${id}-listbox`;
  const [ownValue, setOwnValue] = useState<string | null>(defaultValue);
  const selected = value !== undefined ? value : ownValue;
  const selectedOption = options.find(option => option.value === selected) ?? null;
  const [ownText, setOwnText] = useState(defaultInputValue ?? selectedOption?.label ?? "");
  const text = inputValue ?? ownText;
  const [shownOpen, setOpenState] = useOpenState(openProp, defaultOpen, onOpenChange);
  const open = shownOpen && !readOnly && !disabled;
  // Read through a ref, so a form reset's listener (set up once) sees the list as it is now.
  const openNow = useRef(open);
  openNow.current = open;
  const setOpen = (next: boolean) => { if (next !== openNow.current) setOpenState(next); };
  // While the list is open from a toggle (not typing), show every option, not just matches.
  const [showAll, setShowAll] = useState(false);
  const [active, setActive] = useState(-1);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const initial = useRef({ value: defaultValue, text: defaultInputValue ?? selectedOption?.label ?? "" });

  const setText = (next: string) => {
    if (inputValue === undefined) setOwnText(next);
    onInputChange?.(next);
  };
  const choose = (next: ComboboxOption | null, event?: SyntheticEvent) => {
    if (value === undefined) setOwnValue(next?.value ?? null);
    onValueChange?.(next?.value ?? null, event);
    setText(next?.label ?? "");
  };
  // A form reset returns an uncontrolled combobox to its first value and text (audit B-12).
  useEffect(() => {
    const owner = inputRef.current?.form;
    if (!owner) return;
    const reset = (event: Event) => queueMicrotask(() => {
      if (event.defaultPrevented) return;
      if (value === undefined) setOwnValue(initial.current.value);
      if (inputValue === undefined) setOwnText(initial.current.text);
      setOpen(false); setActive(-1); setShowAll(false);
    });
    owner.addEventListener("reset", reset);
    return () => owner.removeEventListener("reset", reset);
  }, [value, inputValue]);
  // A selection made from outside (controlled value) shows its label in the field.
  useEffect(() => {
    if (value !== undefined && inputValue === undefined) setOwnText(selectedOption?.label ?? "");
  }, [value]); // eslint-disable-line react-hooks/exhaustive-deps

  // The field showing the selection is not a search: list everything until the text changes.
  const typed = !showAll && text.trim() !== "" && text !== selectedOption?.label;
  const rows = useMemo<Row[]>(() => {
    const found = typed ? options.filter(option => filter(option, text)) : options;
    // Grouped options are listed group by group, in the order each group first appears.
    const groupOrder = [...new Set(found.map(option => option.group))];
    const matches = [...found].sort((a, b) => groupOrder.indexOf(a.group) - groupOrder.indexOf(b.group));
    const list: Row[] = matches.map(option => ({ kind: "option", option }));
    const exact = options.some(option => option.label.toLocaleLowerCase() === text.trim().toLocaleLowerCase());
    if (onCreate && text.trim() && !exact && !showAll) list.push({ kind: "create", text: text.trim() });
    return list;
  }, [options, text, showAll, filter, onCreate, selectedOption, typed]);
  // "No results" is said through the shared announcer, outside the listbox, which may hold only options (audit B-31,
  // components audit D1).
  const empty = open && rows.length === 0;
  useEffect(() => {
    if (empty && typeof emptyText === "string") announce(emptyText);
  }, [empty]); // eslint-disable-line react-hooks/exhaustive-deps -- the words are read as they are now
  const enabled = (index: number) => rows[index] && !(rows[index]?.kind === "option" && (rows[index] as { option: ComboboxOption }).option.disabled);
  const step = (from: number, delta: 1 | -1) => {
    for (let i = 1; i <= rows.length; i++) {
      const next = (from + delta * i + rows.length * 2) % rows.length;
      if (enabled(next)) return next;
    }
    return -1;
  };

  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list || typeof list.showPopover !== "function") return;
    const shown = list.matches(":popover-open");
    if (open && !shown) list.showPopover();
    if (!open && shown) list.hidePopover();
  }, [open]);
  // Menu's engine (audit S16, B-15): flips, shifts, and works without CSS anchor positioning.
  // The list starts at the field's start, 4 below it, as a menu under its trigger.
  useAnchoredPosition(rootRef, listRef, open, { side: "bottom", align: "start", offset: MENU_OFFSET, padding: OVERLAY_PADDING });
  useEffect(() => {
    if (!open || active < 0) return;
    scrollOptionIntoList(listRef.current, listRef.current?.querySelector<HTMLElement>(`[data-index="${active}"]`));
  }, [open, active]);

  const openList = (all: boolean, highlight: "first" | "last" | "selected" | "none") => {
    if (disabled || readOnly) return;
    setShowAll(all);
    setOpen(true);
    const typed = !all && text.trim() !== "" && text !== selectedOption?.label;
    const found = typed ? options.filter(option => filter(option, text)) : options;
    const groupOrder = [...new Set(found.map(option => option.group))];
    const pool = [...found].sort((a, b) => groupOrder.indexOf(a.group) - groupOrder.indexOf(b.group));
    const selectedIndex = pool.findIndex(option => option.value === selected);
    setActive(highlight === "none" ? -1 : highlight === "selected" && selectedIndex >= 0 ? selectedIndex
      : highlight === "last" ? pool.length - 1 : pool.length ? 0 : -1);
  };
  const close = () => { setOpen(false); setActive(-1); setShowAll(false); };
  // A created option is selected once the host adds it to `options`.
  const pendingCreate = useRef<string | null>(null);
  useEffect(() => {
    const label = pendingCreate.current;
    if (label === null) return;
    const created = options.find(option => option.label === label);
    if (created) { pendingCreate.current = null; choose(created); }
  }, [options]); // eslint-disable-line react-hooks/exhaustive-deps
  const commitRow = (row: Row | undefined, event?: SyntheticEvent) => {
    if (!row) return;
    if (row.kind === "create") { pendingCreate.current = row.text; onCreate?.(row.text); setText(row.text); }
    else if (!row.option.disabled) choose(row.option, event);
    close();
  };
  // Leaving the field: keep custom text if allowed, otherwise show the selection again.
  const settle = (event?: SyntheticEvent) => {
    close();
    const exact = options.find(option => option.label.toLocaleLowerCase() === text.trim().toLocaleLowerCase());
    if (exact) { if (exact.value !== selected) choose(exact, event); else setText(exact.label); return; }
    if (allowsCustomValue) { if (selected !== null && text.trim() !== selectedOption?.label) { if (value === undefined) setOwnValue(null); onValueChange?.(null, event); } return; }
    if (!text.trim()) { if (selected !== null) choose(null, event); return; }
    setText(selectedOption?.label ?? "");
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(event);
    // Enter while an input method is composing confirms the composition, not an option (audit B-13).
    if (event.defaultPrevented || event.nativeEvent.isComposing || event.keyCode === 229) return;
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        if (!open) openList(false, event.altKey ? "none" : "selected");
        else if (!event.altKey) setActive(current => step(current, 1));
        break;
      case "ArrowUp":
        event.preventDefault();
        // Alt+Up closes the list, keeping the highlighted option if there is one (APG; audit B-31).
        if (open && event.altKey) { if (active >= 0 && rows[active]?.kind === "option") commitRow(rows[active], event); else close(); }
        else if (!open) openList(false, "last");
        else setActive(current => step(current < 0 ? 0 : current, -1));
        break;
      case "Enter":
        if (open && active >= 0) { event.preventDefault(); commitRow(rows[active], event); }
        else if (open) { event.preventDefault(); settle(event); }
        break;
      case "Escape":
        if (open) { event.preventDefault(); close(); }
        else if (text) { event.preventDefault(); setText(""); if (selected !== null) choose(null, event); }
        break;
      case "Tab":
        if (open && active >= 0 && rows[active]?.kind === "option") commitRow(rows[active], event);
        break;
    }
  };

  const activeId = open && active >= 0 ? `${id}-option-${active}` : undefined;
  let index = -1;
  const renderRow = (row: Row) => {
    index += 1;
    const current = index;
    const highlighted = current === active;
    if (row.kind === "create") {
      return <div key="__create" id={`${id}-option-${current}`} data-index={current} role="option" aria-selected={false}
        className="area-menu__item area-combobox__option" data-highlighted={highlighted ? "" : undefined}
        onPointerDown={event => event.preventDefault()} onPointerMove={() => setActive(current)} onClick={event => commitRow(row, event)}>
        <span className="area-menu__icon" aria-hidden="true"><Glyph name="add" /></span>
        <span className="area-menu__text">Create “{row.text}”</span>
      </div>;
    }
    const { option } = row;
    const isSelected = option.value === selected;
    return <div key={option.value} id={`${id}-option-${current}`} data-index={current} role="option" aria-selected={isSelected}
      aria-disabled={option.disabled || undefined} data-disabled={option.disabled ? "" : undefined} className="area-menu__item area-combobox__option"
      /* The chosen option shows the active plate and the check, as every value picker (plan B7.7). */
      data-selected={isSelected ? "" : undefined}
      data-highlighted={highlighted ? "" : undefined}
      onPointerDown={event => event.preventDefault()} onPointerMove={() => { if (!option.disabled) setActive(current); }}
      onClick={event => { if (!option.disabled) commitRow(row, event); }}>
      {option.icon ? <span className="area-menu__icon" aria-hidden="true">{option.icon}</span> : null}
      {/* While the text is a search, the typed text is marked in each option (highlightMatch; components audit V4). */}
      <span className="area-menu__text">{typed ? highlightMatch(option.label, text) : option.label}</span>
      {option.description ? <span className="area-combobox__description">{option.description}</span> : null}
      <span className="area-menu__check" aria-hidden="true"><Glyph name="check" /></span>
    </div>;
  };
  // While the list fades out it keeps the rows it last showed: committing sets the text to the
  // option's label, which would otherwise list every option during the exit (docs/MOTION.md).
  const shownRows = useRef(rows);
  if (open) shownRows.current = rows;
  const listRows = open ? rows : shownRows.current;
  const groups = new Map<string | undefined, Row[]>();
  for (const row of listRows) {
    const key = row.kind === "option" ? row.option.group : undefined;
    groups.set(key, [...(groups.get(key) ?? []), row]);
  }

  return <div ref={rootRef} className={comboboxVariants({ fullWidth }, className)} style={style}
    data-open={open ? "" : undefined}>
    <Input ref={node => { inputRef.current = node; if (typeof ref === "function") ref(node); else if (ref) ref.current = node; }}
      {...rest} form={form} size={size} fullWidth={fullWidth} disabled={disabled} readOnly={readOnly} placeholder={placeholder}
      role="combobox" aria-autocomplete="list" aria-expanded={open} aria-controls={listId} aria-activedescendant={activeId}
      autoComplete="off" value={text}
      onChange={event => { setText(event.target.value); setShowAll(false); if (!open) setOpen(true); setActive(event.target.value.trim() ? 0 : -1); }}
      onKeyDown={handleKeyDown}
      onFocus={onFocus}
      onBlur={event => { onBlur?.(event); settle(event); }}
      trailingAction={<InputAction tabIndex={-1} tooltip={toggleLabel} aria-expanded={open} aria-controls={listId} disabled={disabled || readOnly}
        onPointerDown={event => event.preventDefault()}
        onClick={() => { if (open) close(); else { inputRef.current?.focus(); openList(true, "selected"); } }}
        icon={<Glyph name="chevron-down" />} />} />
    {/* The form gets the option's value, not its label; typed text only where custom values are allowed (audit B-12). */}
    {name ? <input type="hidden" name={name} form={form} disabled={disabled} value={selected ?? (allowsCustomValue ? text : "")} /> : null}
    <ScrollArea ref={listRef} id={listId} role="listbox" aria-label={typeof rest["aria-label"] === "string" ? rest["aria-label"] : undefined}
      aria-labelledby={typeof rest["aria-label"] === "string" ? undefined : rest["aria-labelledby"]}
      popover="manual" className="area-menu area-combobox__listbox" tabIndex={-1} viewportProps={{ tabIndex: undefined }}>
      {listRows.length === 0 ? <div className="area-menu__empty" role="presentation"><span className="area-menu__text">{emptyText}</span></div> : null}
      {[...groups].map(([group, list]) => group
        ? <div key={group} role="group" aria-labelledby={`${id}-group-${group}`} className="area-combobox__group">
            <div id={`${id}-group-${group}`} className="area-menu__label" role="presentation"><span className="area-menu__label-text">{group}</span></div>
            {list.map(renderRow)}
          </div>
        : list.map(renderRow))}
    </ScrollArea>
  </div>;
});
