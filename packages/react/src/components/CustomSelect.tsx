import { forwardRef, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import type { ButtonHTMLAttributes, KeyboardEvent, ReactNode, SyntheticEvent } from "react";
import { customSelectVariants, type VariantProps, MANIFESTS } from "../variants.ts";
import { Glyph } from "./Glyph.tsx";
import { scrollOptionIntoList, useAnchoredPosition } from "./overlay.ts";
import { ScrollArea } from "./ScrollArea.tsx";
import { MENU_OFFSET, OVERLAY_PADDING } from "./Overlays.tsx";
/** The empty collection, one reference so effects keyed on it stay still. */
const NO_ITEMS: never[] = [];
/** How long typed letters keep adding to one typeahead search (APG select-only combobox). */
const TYPEAHEAD_MS = 500;
const PAGE = 10;

export interface CustomSelectOption {
  value: string;
  /** What the trigger shows and typeahead matches. */
  label: string;
  /** A muted line under the label ("Edit, suggest, comment, and share"). */
  description?: ReactNode;
  /** A leading icon, shown in the row and, for the chosen option, in the trigger. */
  icon?: ReactNode;
  disabled?: boolean;
  /** Options with the same group are listed together under it, groups ruled apart. */
  group?: string;
}

type Manifest = VariantProps<typeof MANIFESTS.customSelect>;

export interface CustomSelectProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "value" | "defaultValue" | "onChange" | "type" | "role"> {
  /** The options. Collections are `items` everywhere (audit H-14). */
  items?: CustomSelectOption[];
  /** The selected option's value (controlled). */
  value?: string | null;
  defaultValue?: string | null;
  /** The chosen value and the event that chose it. */
  onValueChange?: (value: string, event: SyntheticEvent) => void;
  /** Shown in the trigger while nothing is chosen. */
  placeholder?: ReactNode;
  variant?: Manifest["variant"];
  size?: Manifest["size"];
  fullWidth?: boolean;
  invalid?: boolean;
  /** Submits the chosen value with a form under this name. */
  name?: string;
  required?: boolean;
  /** Called when the list opens or closes. */
  onOpenChange?: (open: boolean) => void;
  /**
   * The option the pointer or the arrow keys are on while the list is open, and `null` when the list closes, so a host
   * can preview it before it is chosen (shadcn's builder previews a hovered option on its canvas; Base UI's
   * `onItemHighlighted`). A choice still arrives through `onValueChange` / `onValuesChange`.
   */
  onHighlightChange?: (value: string | null) => void;
  /**
   * Picks any number of options (Notion's multi-select, Figma's toggled lists): choosing a row
   * toggles it and the list stays open, the trigger lists the chosen labels in the list's order,
   * and the value is `values` / `defaultValues` / `onValuesChange` (`value` and `onValueChange`
   * are ignored).
   */
  multiple?: boolean;
  values?: readonly string[];
  defaultValues?: readonly string[];
  onValuesChange?: (values: string[], event: SyntheticEvent) => void;
}

/**
 * Picks one value from a short list whose options need more than text: icons, a description
 * under the label, groups. The trigger is a button (WAI select-only combobox): Enter, Space and
 * the arrows open the list, typing jumps to a label, focus never leaves the trigger. The list is
 * Menu's surface and rows, placed by the shared overlay engine.
 */
export const CustomSelect = forwardRef<HTMLButtonElement, CustomSelectProps>(function CustomSelect(
  { items, value, defaultValue = null, onValueChange, placeholder = "Select…", variant, size, fullWidth, invalid, name, required,
    onOpenChange, onHighlightChange, multiple = false, values, defaultValues, onValuesChange, disabled, className, style, onKeyDown, onBlur, onClick, form, ...rest }, ref,
) {
  const options = items ?? NO_ITEMS;
  const id = useId();
  const listId = `${id}-listbox`;
  const [ownValue, setOwnValue] = useState<string | null>(defaultValue);
  const [ownValues, setOwnValues] = useState<readonly string[]>(defaultValues ?? NO_ITEMS);
  const chosen = values !== undefined ? values : ownValues;
  const selected = multiple ? (chosen[0] ?? null) : value !== undefined ? value : ownValue;
  const isChosen = (option: CustomSelectOption) => multiple ? chosen.includes(option.value) : option.value === selected;
  const selectedOption = multiple ? null : options.find(option => option.value === selected) ?? null;
  // A set reads as its labels in the list's order ("Button, Chip, Badge").
  const chosenLabel = multiple ? options.filter(isChosen).map(option => option.label).join(", ") : selectedOption?.label;
  const [open, setOpenState] = useState(false);
  const [active, setActive] = useState(-1);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const typed = useRef({ text: "", at: 0 });
  const initial = useRef(defaultValue);
  const initialValues = useRef(defaultValues ?? NO_ITEMS);

  // Grouped options are listed group by group, in the order each group first appears; the
  // index of a row is its place in this order.
  const groupOrder = [...new Set(options.map(option => option.group))];
  const rows = [...options].sort((a, b) => groupOrder.indexOf(a.group) - groupOrder.indexOf(b.group));
  const enabled = (index: number) => !!rows[index] && !rows[index]!.disabled;
  const firstEnabled = () => rows.findIndex(option => !option.disabled);
  const lastEnabled = () => { for (let i = rows.length - 1; i >= 0; i--) if (enabled(i)) return i; return -1; };
  const move = (from: number, delta: number) => {
    // Clamped, not wrapped (APG select-only): Page keys jump, then settle on an enabled row.
    let next = Math.max(0, Math.min(rows.length - 1, from + delta));
    const step = delta > 0 ? 1 : -1;
    while (next >= 0 && next < rows.length && !enabled(next)) next += step;
    return enabled(next) ? next : from;
  };

  const setOpen = (next: boolean) => {
    if (next === open) return;
    setOpenState(next);
    onOpenChange?.(next);
  };
  const openList = (highlight: "selected" | "first" | "last" | number) => {
    if (disabled) return;
    const current = rows.findIndex(option => option.value === selected);
    setActive(typeof highlight === "number" ? highlight
      : highlight === "first" ? firstEnabled() : highlight === "last" ? lastEnabled()
      : current >= 0 && enabled(current) ? current : firstEnabled());
    setOpen(true);
  };
  const close = () => { setOpen(false); setActive(-1); };
  const choose = (index: number, event: SyntheticEvent) => {
    const option = rows[index];
    if (!option || option.disabled) return;
    if (multiple) {
      // Toggled in place; the set keeps the list's order.
      const on = !chosen.includes(option.value);
      const next = options.filter(entry => entry.value === option.value ? on : chosen.includes(entry.value)).map(entry => entry.value);
      if (values === undefined) setOwnValues(next);
      onValuesChange?.(next, event);
      return;
    }
    if (value === undefined) setOwnValue(option.value);
    if (option.value !== selected) onValueChange?.(option.value, event);
  };

  // A form reset returns an uncontrolled select to its first value.
  useEffect(() => {
    const owner = triggerRef.current?.form;
    if (!owner) return;
    const reset = (event: Event) => queueMicrotask(() => {
      if (event.defaultPrevented) return;
      if (value === undefined) setOwnValue(initial.current);
      if (values === undefined) setOwnValues(initialValues.current);
      close();
    });
    owner.addEventListener("reset", reset);
    return () => owner.removeEventListener("reset", reset);
  }); // eslint-disable-line react-hooks/exhaustive-deps

  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list || typeof list.showPopover !== "function") return;
    const shown = list.matches(":popover-open");
    if (open && !shown) list.showPopover();
    if (!open && shown) list.hidePopover();
  }, [open]);
  // Menu's engine (audit S16): the list starts at the trigger's start, 4 below it, flips and shifts.
  useAnchoredPosition(rootRef, listRef, open, { side: "bottom", align: "start", offset: MENU_OFFSET, padding: OVERLAY_PADDING });
  // The highlighted option, told once per change; null once the list is closed.
  const highlighted = open && active >= 0 ? rows[active]?.value ?? null : null;
  const told = useRef<string | null>(null);
  useEffect(() => {
    if (highlighted === told.current) return;
    told.current = highlighted;
    onHighlightChange?.(highlighted);
  }, [highlighted, onHighlightChange]);
  useEffect(() => {
    if (!open || active < 0) return;
    scrollOptionIntoList(listRef.current, listRef.current?.querySelector<HTMLElement>(`[data-index="${active}"]`));
  }, [open, active]);

  // Typeahead: letters typed within half a second search together, from the row after the current
  // one; repeating one letter cycles through the labels that start with it.
  const typeahead = (key: string) => {
    const now = Date.now();
    const text = now - typed.current.at > TYPEAHEAD_MS ? key : typed.current.text + key;
    typed.current = { text, at: now };
    const query = text.length > 1 && [...text].every(char => char === text[0]) ? text[0]! : text;
    const from = open ? active : rows.findIndex(option => option.value === selected);
    // One letter moves on to the next match; a longer search may stay on the current row.
    const start = query.length === 1 ? from + 1 : Math.max(from, 0);
    for (let i = 0; i < rows.length; i++) {
      const candidate = (start + i) % rows.length;
      if (enabled(candidate) && rows[candidate]!.label.toLocaleLowerCase().startsWith(query.toLocaleLowerCase())) return candidate;
    }
    return -1;
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented || disabled) return;
    const { key, altKey } = event;
    if (!open) {
      if (key === "ArrowDown" || key === "ArrowUp" || key === "Enter" || key === " ") {
        event.preventDefault();
        openList(key === "ArrowUp" && !altKey && selected === null ? "last" : "selected");
      } else if (key === "Home" || key === "End") {
        event.preventDefault();
        openList(key === "Home" ? "first" : "last");
      } else if (key.length === 1 && !event.ctrlKey && !event.metaKey && !altKey) {
        const match = typeahead(key);
        if (match >= 0) { event.preventDefault(); openList(match); }
      }
      return;
    }
    switch (key) {
      case "ArrowDown": event.preventDefault(); setActive(current => move(current < 0 ? -1 : current, 1)); break;
      case "ArrowUp":
        event.preventDefault();
        if (altKey) { if (!multiple) choose(active, event); close(); }
        else setActive(current => move(current < 0 ? rows.length : current, -1));
        break;
      case "Home": event.preventDefault(); setActive(firstEnabled()); break;
      case "End": event.preventDefault(); setActive(lastEnabled()); break;
      case "PageDown": event.preventDefault(); setActive(current => move(current, PAGE)); break;
      case "PageUp": event.preventDefault(); setActive(current => move(current, -PAGE)); break;
      // A set stays open: Enter and Space toggle the row, Escape, Tab or Alt+Up close.
      case "Enter": event.preventDefault(); choose(active, event); if (!multiple) close(); break;
      case " ":
        // A space inside a typeahead search is part of the label, not a choice.
        if (Date.now() - typed.current.at < TYPEAHEAD_MS) { const match = typeahead(key); if (match >= 0) setActive(match); event.preventDefault(); break; }
        event.preventDefault(); choose(active, event); if (!multiple) close(); break;
      case "Escape": event.preventDefault(); close(); break;
      case "Tab": if (!multiple) choose(active, event); close(); break;
      default:
        if (key.length === 1 && !event.ctrlKey && !event.metaKey && !altKey) {
          const match = typeahead(key);
          if (match >= 0) { event.preventDefault(); setActive(match); }
        }
    }
  };

  const activeId = open && active >= 0 ? `${id}-option-${active}` : undefined;
  const labelledBy = rest["aria-labelledby"];
  const label = rest["aria-label"];
  const groups = new Map<string | undefined, number[]>();
  rows.forEach((option, index) => groups.set(option.group, [...(groups.get(option.group) ?? []), index]));

  const renderRow = (index: number) => {
    const option = rows[index]!;
    const isSelected = isChosen(option);
    return <div key={option.value} id={`${id}-option-${index}`} data-index={index} role="option" aria-selected={isSelected}
      aria-disabled={option.disabled || undefined} data-disabled={option.disabled ? "" : undefined}
      className="area-menu__item area-custom-select__option" data-highlighted={index === active ? "" : undefined}
     
      onPointerDown={event => event.preventDefault()}
      onPointerMove={() => { if (!option.disabled && index !== active) setActive(index); }}
      onClick={event => { if (option.disabled) return; choose(index, event); if (!multiple) close(); triggerRef.current?.focus(); }}>
      {option.icon ? <span className="area-menu__icon" aria-hidden="true">{option.icon}</span> : null}
      {option.description
        ? <span className="area-menu__lines"><span className="area-menu__text">{option.label}</span><span className="area-menu__description">{option.description}</span></span>
        : <span className="area-menu__text">{option.label}</span>}
      <span className="area-menu__check" aria-hidden="true"><Glyph name="check" /></span>
    </div>;
  };

  return <div ref={rootRef} className={customSelectVariants({ variant, size, fullWidth }, className)} style={style}
    data-open={open ? "" : undefined}>
    <button ref={node => { triggerRef.current = node; if (typeof ref === "function") ref(node); else if (ref) ref.current = node; }}
      {...rest} type="button" form={form} className="area-custom-select__trigger" disabled={disabled}
      role="combobox" aria-haspopup="listbox" aria-expanded={open} aria-controls={listId} aria-activedescendant={activeId}
      aria-invalid={invalid || undefined} aria-required={required || undefined}
      onClick={event => { onClick?.(event); if (event.defaultPrevented) return; if (open) close(); else openList("selected"); }}
      onKeyDown={handleKeyDown}
      onBlur={event => { onBlur?.(event); close(); }}>
      {selectedOption?.icon ? <span className="area-custom-select__icon" aria-hidden="true">{selectedOption.icon}</span> : null}
      <span className="area-custom-select__value" data-placeholder={chosenLabel ? undefined : ""}>{chosenLabel || placeholder}</span>
      <span className="area-custom-select__chevron" aria-hidden="true"><Glyph name="chevron-down" /></span>
    </button>
    {/* The form gets the option's value, never its label. */}
    {name ? multiple
      ? chosen.map(entry => <input key={entry} type="hidden" name={name} form={form} disabled={disabled} value={entry} />)
      : <input type="hidden" name={name} form={form} disabled={disabled} value={selected ?? ""} /> : null}
    <ScrollArea ref={listRef} id={listId} role="listbox" aria-multiselectable={multiple || undefined} aria-label={typeof label === "string" ? label : undefined}
      aria-labelledby={typeof label === "string" ? undefined : labelledBy}
      popover="manual" className="area-menu area-custom-select__listbox" tabIndex={-1} viewportProps={{ tabIndex: undefined }}>
      {[...groups].map(([group, indexes], position) => group
        ? [position > 0 ? <div key={`${group}-rule`} className="area-menu__separator area-custom-select__separator" role="presentation" /> : null,
          <div key={group} role="group" aria-labelledby={`${id}-group-${position}`} className="area-custom-select__group">
            <div id={`${id}-group-${position}`} className="area-menu__label" role="presentation"><span className="area-menu__label-text">{group}</span></div>
            {indexes.map(renderRow)}
          </div>]
        : indexes.map(renderRow))}
    </ScrollArea>
  </div>;
});
