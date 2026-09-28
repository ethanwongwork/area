import { forwardRef, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, KeyboardEvent, ReactNode } from "react";
import { comboboxVariants, type VariantProps, MANIFESTS } from "../variants.ts";
import { Glyph } from "./Glyph.tsx";
import { scrollOptionIntoList } from "./overlay.ts";
import { Input, InputAction, type InputProps } from "./Input.tsx";

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
  options: ComboboxOption[];
  /** The selected option's value (controlled). */
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;
  /** The text in the field (controlled). */
  inputValue?: string;
  defaultInputValue?: string;
  onInputChange?: (text: string) => void;
  /** Keep typed text that matches no option (a font size, a tag); otherwise the field reverts on blur. */
  allowsCustomValue?: boolean;
  /** Offer a "Create" row for text that matches no option. */
  onCreate?: (text: string) => void;
  /** How options match the text. Defaults to a case-insensitive "contains". */
  filter?: (option: ComboboxOption, text: string) => boolean;
  /** Shown when nothing matches (and nothing can be created). */
  emptyText?: ReactNode;
  size?: VariantProps<typeof MANIFESTS.input>["size"];
  /** Name of the list toggle button. */
  toggleLabel?: string;
}

const contains = (option: ComboboxOption, text: string) => option.label.toLocaleLowerCase().includes(text.trim().toLocaleLowerCase());
type Row = { kind: "option"; option: ComboboxOption } | { kind: "create"; text: string };

/**
 * An editable field with a list of suggestions that filters as you type. Arrow keys move
 * through the list without leaving the field, Enter picks, Escape closes; the list is
 * Menu's surface and rows.
 */
export const Combobox = forwardRef<HTMLInputElement, ComboboxProps>(function Combobox(
  { options, value, defaultValue = null, onValueChange, inputValue, defaultInputValue, onInputChange,
    allowsCustomValue, onCreate, filter = contains, emptyText = "No results", size, toggleLabel = "Show suggestions",
    fullWidth, disabled, readOnly, className, onKeyDown, onBlur, onFocus, placeholder, ...rest }, ref,
) {
  const id = useId();
  const listId = `${id}-listbox`;
  const anchor = `--area-combobox-${id.replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const [ownValue, setOwnValue] = useState<string | null>(defaultValue);
  const selected = value !== undefined ? value : ownValue;
  const selectedOption = options.find(option => option.value === selected) ?? null;
  const [ownText, setOwnText] = useState(defaultInputValue ?? selectedOption?.label ?? "");
  const text = inputValue ?? ownText;
  const [open, setOpen] = useState(false);
  // While the list is open from a toggle (not typing), show every option, not just matches.
  const [showAll, setShowAll] = useState(false);
  const [active, setActive] = useState(-1);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  const setText = (next: string) => {
    if (inputValue === undefined) setOwnText(next);
    onInputChange?.(next);
  };
  const choose = (next: ComboboxOption | null) => {
    if (value === undefined) setOwnValue(next?.value ?? null);
    onValueChange?.(next?.value ?? null);
    setText(next?.label ?? "");
  };
  // A selection made from outside (controlled value) shows its label in the field.
  useEffect(() => {
    if (value !== undefined && inputValue === undefined) setOwnText(selectedOption?.label ?? "");
  }, [value]); // eslint-disable-line react-hooks/exhaustive-deps

  const rows = useMemo<Row[]>(() => {
    // The field showing the selection is not a search: list everything until the text changes.
    const typed = !showAll && text.trim() !== "" && text !== selectedOption?.label;
    const found = typed ? options.filter(option => filter(option, text)) : options;
    // Grouped options are listed group by group, in the order each group first appears.
    const groupOrder = [...new Set(found.map(option => option.group))];
    const matches = [...found].sort((a, b) => groupOrder.indexOf(a.group) - groupOrder.indexOf(b.group));
    const list: Row[] = matches.map(option => ({ kind: "option", option }));
    const exact = options.some(option => option.label.toLocaleLowerCase() === text.trim().toLocaleLowerCase());
    if (onCreate && text.trim() && !exact && !showAll) list.push({ kind: "create", text: text.trim() });
    return list;
  }, [options, text, showAll, filter, onCreate, selectedOption]);
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
  const commitRow = (row: Row | undefined) => {
    if (!row) return;
    if (row.kind === "create") { pendingCreate.current = row.text; onCreate?.(row.text); setText(row.text); }
    else if (!row.option.disabled) choose(row.option);
    close();
  };
  // Leaving the field: keep custom text if allowed, otherwise show the selection again.
  const settle = () => {
    close();
    const exact = options.find(option => option.label.toLocaleLowerCase() === text.trim().toLocaleLowerCase());
    if (exact) { if (exact.value !== selected) choose(exact); else setText(exact.label); return; }
    if (allowsCustomValue) { if (selected !== null && text.trim() !== selectedOption?.label) { if (value === undefined) setOwnValue(null); onValueChange?.(null); } return; }
    if (!text.trim()) { if (selected !== null) choose(null); return; }
    setText(selectedOption?.label ?? "");
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        if (!open) openList(false, event.altKey ? "none" : "selected");
        else if (!event.altKey) setActive(current => step(current, 1));
        break;
      case "ArrowUp":
        event.preventDefault();
        if (!open) openList(false, "last");
        else setActive(current => step(current < 0 ? 0 : current, -1));
        break;
      case "Enter":
        if (open && active >= 0) { event.preventDefault(); commitRow(rows[active]); }
        else if (open) { event.preventDefault(); settle(); }
        break;
      case "Escape":
        if (open) { event.preventDefault(); close(); }
        else if (text) { event.preventDefault(); setText(""); if (selected !== null) choose(null); }
        break;
      case "Tab":
        if (open && active >= 0 && rows[active]?.kind === "option") commitRow(rows[active]);
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
        onPointerDown={event => event.preventDefault()} onPointerMove={() => setActive(current)} onClick={() => commitRow(row)}>
        <span className="area-menu__icon" aria-hidden="true"><Glyph name="add" /></span>
        <span className="area-menu__text">Create “{row.text}”</span>
      </div>;
    }
    const { option } = row;
    const isSelected = option.value === selected;
    return <div key={option.value} id={`${id}-option-${current}`} data-index={current} role="option" aria-selected={isSelected}
      aria-disabled={option.disabled || undefined} data-disabled={option.disabled ? "" : undefined} className="area-menu__item area-combobox__option"
      data-highlighted={highlighted ? "" : undefined} data-selected={undefined}
      onPointerDown={event => event.preventDefault()} onPointerMove={() => { if (!option.disabled) setActive(current); }}
      onClick={() => { if (!option.disabled) commitRow(row); }}>
      {option.icon ? <span className="area-menu__icon" aria-hidden="true">{option.icon}</span> : null}
      <span className="area-menu__text">{option.label}</span>
      {option.description ? <span className="area-combobox__description">{option.description}</span> : null}
      <span className="area-menu__check" aria-hidden="true"><Glyph name="check" /></span>
    </div>;
  };
  const groups = new Map<string | undefined, Row[]>();
  for (const row of rows) {
    const key = row.kind === "option" ? row.option.group : undefined;
    groups.set(key, [...(groups.get(key) ?? []), row]);
  }

  return <div className={comboboxVariants({ fullWidth }, className)} style={{ "--_combobox-anchor": anchor } as CSSProperties}
    data-open={open ? "" : undefined}>
    <Input ref={node => { inputRef.current = node; if (typeof ref === "function") ref(node); else if (ref) ref.current = node; }}
      {...rest} size={size} fullWidth={fullWidth} disabled={disabled} readOnly={readOnly} placeholder={placeholder}
      role="combobox" aria-autocomplete="list" aria-expanded={open} aria-controls={listId} aria-activedescendant={activeId}
      autoComplete="off" value={text}
      onChange={event => { setText(event.target.value); setShowAll(false); if (!open) setOpen(true); setActive(event.target.value.trim() ? 0 : -1); }}
      onKeyDown={handleKeyDown}
      onFocus={onFocus}
      onBlur={event => { onBlur?.(event); settle(); }}
      trailingAction={<InputAction tabIndex={-1} tooltip={toggleLabel} aria-expanded={open} aria-controls={listId} disabled={disabled || readOnly}
        onPointerDown={event => event.preventDefault()}
        onClick={() => { if (open) close(); else { inputRef.current?.focus(); openList(true, "selected"); } }}
        icon={<Glyph name="chevron-down" />} />} />
    <div ref={listRef} id={listId} role="listbox" aria-label={typeof rest["aria-label"] === "string" ? rest["aria-label"] : undefined}
      popover="manual" className="area-menu area-combobox__listbox" tabIndex={-1}>
      {rows.length === 0 ? <div className="area-combobox__empty" role="presentation">{emptyText}</div> : null}
      {[...groups].map(([group, list]) => group
        ? <div key={group} role="group" aria-labelledby={`${id}-group-${group}`} className="area-combobox__group">
            <div id={`${id}-group-${group}`} className="area-menu__label" role="presentation">{group}</div>
            {list.map(renderRow)}
          </div>
        : list.map(renderRow))}
    </div>
  </div>;
});
