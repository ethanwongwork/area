import { useSystemDefault } from "./SystemDefaults.tsx";
import { forwardRef, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { ButtonHTMLAttributes, FocusEvent, KeyboardEvent, ReactNode, SyntheticEvent } from "react";
import { customSelectVariants, type VariantProps, MANIFESTS } from "../variants.ts";
import { Glyph } from "./Glyph.tsx";
import { scrollOptionIntoList, useAnchoredPosition, useOpenState } from "./overlay.ts";
import { resolveValidation, validationAttributes, type ValidationStatus } from "./validation.ts";
import { ScrollArea } from "./ScrollArea.tsx";
import { Input } from "./Input.tsx";
import { MENU_OFFSET, OVERLAY_PADDING } from "./Overlays.tsx";
import { announce } from "./announce.ts";
import { highlightMatch } from "./highlight.tsx";
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
  /** In the grid layout, a picture of the option drawn over its label in a 4:3 frame (a setting's figure). Without
   *  one, a grid cell draws the option's icon at the large icon size (a swatch). Ignored in the list. */
  preview?: ReactNode;
}

type Manifest = VariantProps<typeof MANIFESTS.customSelect>;

export interface CustomSelectProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "value" | "defaultValue" | "onChange" | "type" | "role"> {
  /** The trigger's treatment: `outline` (default), `soft` or `ghost`. */
  variant?: Manifest["variant"];
  /** The trigger's height and type: `md` (default), `sm` or `lg`. */
  size?: Manifest["size"];
  /** The trigger fills its container's width. */
  fullWidth?: boolean;
  /**
   * How the open list lays its options out. `list` (default): Menu's rows. `grid`: cells in equal columns, each its
   * `preview` (or its icon, large) over its label, the list as wide as the Field it sits in; Left / Right step in
   * reading order and Up / Down go to the nearest cell in the next row (List box's grid).
   */
  layout?: Manifest["layout"];
  /** The options. */
  items?: CustomSelectOption[];
  /** Shown in the trigger while nothing is chosen. */
  placeholder?: ReactNode;
  /**
   * A region under the options, ruled off (Menu's footer): Save and Cancel for a set that waits to be kept (hold the
   * set as a draft in `values`, keep it on Save, drop it on Cancel and when the list closes), or a link to manage the
   * options. Its controls take focus, so the list stays open while they have it.
   */
  footer?: ReactNode;
  /** With `multiple`, what the trigger says once three or more are chosen (default "3 selected"); one or two show their labels. */
  selectedLabel?: (count: number) => string;
  /** The selected option's value (controlled). */
  value?: string | null;
  /** The option chosen at first, uncontrolled; none by default. */
  defaultValue?: string | null;
  /**
   * Picks any number of options: choosing a row toggles it and the list stays open, the trigger lists the chosen
   * labels in the list's order, and the value is `values` / `defaultValues` / `onValuesChange` (`value` and
   * `onValueChange` are ignored).
   */
  multiple?: boolean;
  /** With `multiple`, the chosen options' values, controlled, in the list's order. */
  values?: readonly string[];
  /** With `multiple`, the options chosen at first, uncontrolled. */
  defaultValues?: readonly string[];
  /** Paints the trigger as an error and sets `aria-invalid`; the same as `validationStatus="error"`. */
  invalid?: boolean;
  /** Semantic validation paint, as Input's: `error` (also `invalid`), `success` or `warning`. A Field passes its own. */
  validationStatus?: ValidationStatus;
  /** Internal Field-to-control validation bridge; plain HTML uses the matching data attribute. */
  "data-validation-status"?: ValidationStatus;
  /**
   * Shows a value set elsewhere: the trigger stays focusable and announces `aria-readonly`, the list doesn't open and
   * typing doesn't change the choice, as Radio group's and Input's read-only.
   */
  readOnly?: boolean;
  /** Submits the chosen value with a form under this name. */
  name?: string;
  /** A form cannot submit without an option chosen. */
  required?: boolean;
  /** The list is open (controlled); `defaultOpen` opens it at first; `onOpenChange` hears it open and close. */
  open?: boolean;
  /** Whether the list starts open, uncontrolled. */
  defaultOpen?: boolean;
  /**
   * A field at the top of the open list narrows it as you type, the typed text marked in each option. Focus moves
   * into the field while the list is open: the arrows move, Enter chooses, Escape closes. With `multiple`, the
   * options chosen when it opened are listed first and a Select all row toggles every option shown.
   */
  filterable?: boolean;
  /** Names the filter field and is its placeholder (default "Filter"). */
  filterLabel?: string;
  /** What the list says when the filter matches nothing (default "No results"). */
  emptyText?: ReactNode;
  /** Names the Select all row (default "Select all"). */
  selectAllLabel?: string;
  /** The chosen value and the event that chose it. */
  onValueChange?: (value: string, event: SyntheticEvent) => void;
  /** With `multiple`, called with every chosen value, in the list's order, and the event that changed them. */
  onValuesChange?: (values: string[], event: SyntheticEvent) => void;
  /** Called when the list opens or closes. */
  onOpenChange?: (open: boolean) => void;
  /**
   * Called with the option the pointer or the arrow keys are on while the list is open, and `null` when it closes, so
   * a host can preview an option before it is chosen. A choice still arrives through `onValueChange` /
   * `onValuesChange`.
   */
  onHighlightChange?: (value: string | null) => void;
}

/** The typed filter matches an option's label or its text description. */
const filterMatches = (option: CustomSelectOption, text: string) => {
  const query = text.trim().toLocaleLowerCase();
  return !query || option.label.toLocaleLowerCase().includes(query)
    || (typeof option.description === "string" && option.description.toLocaleLowerCase().includes(query));
};

/**
 * Picks one value from a short list whose options need more than text: icons, a description
 * under the label, groups. The trigger is a button (WAI select-only combobox): Enter, Space and
 * the arrows open the list, typing jumps to a label, focus never leaves the trigger. The list is
 * Menu's surface and rows, placed by the shared overlay engine.
 */
export const CustomSelect = forwardRef<HTMLButtonElement, CustomSelectProps>(function CustomSelect(
  { items, value, defaultValue = null, onValueChange, placeholder = "Select…", variant, size, fullWidth, layout = "list", invalid, validationStatus,
    readOnly, name, required, open: openProp, defaultOpen, onOpenChange, onHighlightChange, multiple = false, values, defaultValues, onValuesChange,
    filterable = false, filterLabel = "Filter", emptyText = "No results", selectAllLabel = "Select all", footer,
    selectedLabel = (count: number) => `${count} selected`,
    disabled, className, style, onKeyDown, onBlur, onClick, form, "aria-invalid": ariaInvalid, "data-validation-status": fieldStatus, ...rest }, ref,
) {
  // The system's defaults (SystemDefaults) where the use gives none.
  variant = useSystemDefault("customSelect", "variant", variant, customSelectVariants.manifest.variants.variant);
  size = useSystemDefault("customSelect", "size", size, customSelectVariants.manifest.variants.size);
  const options = items ?? NO_ITEMS;
  const id = useId();
  const listId = `${id}-listbox`;
  const [ownValue, setOwnValue] = useState<string | null>(defaultValue);
  const [ownValues, setOwnValues] = useState<readonly string[]>(defaultValues ?? NO_ITEMS);
  const chosen = values !== undefined ? values : ownValues;
  const selected = multiple ? (chosen[0] ?? null) : value !== undefined ? value : ownValue;
  const isChosen = (option: CustomSelectOption) => multiple ? chosen.includes(option.value) : option.value === selected;
  const selectedOption = multiple ? null : options.find(option => option.value === selected) ?? null;
  // A set reads as its labels in the list's order ("Item one, Item two") while one or two are chosen, then as a count
  // ("3 selected"; WRITING.md, "A choice of several").
  const chosenOptions = multiple ? options.filter(isChosen) : [];
  const chosenLabel = multiple ? chosenOptions.length > 2 ? selectedLabel(chosenOptions.length) : chosenOptions.map(option => option.label).join(", ") : selectedOption?.label;
  const [shownOpen, setOpenState] = useOpenState(openProp, defaultOpen, onOpenChange);
  const open = shownOpen && !readOnly && !disabled;
  const { status } = resolveValidation({ validationStatus, invalid, ariaInvalid, fieldStatus });
  const [active, setActive] = useState(-1);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const typed = useRef({ text: "", at: 0 });
  const initial = useRef(defaultValue);
  const initialValues = useRef(defaultValues ?? NO_ITEMS);
  const filterRef = useRef<HTMLInputElement | null>(null);
  const [filterText, setFilterText] = useState("");
  // The panel: the list with its filter field above or its footer below, focus inside it while it is open (V7).
  const panel = filterable || (footer !== undefined && footer !== null && footer !== false);
  // The set as it was when the list opened, listed first, so rows don't jump while they are toggled.
  const openedWith = useRef<readonly string[]>(NO_ITEMS);

  // Grouped options are listed group by group, in the order each group first appears; the
  // index of a row is its place in this order.
  const rows = useMemo(() => {
    const found = filterable ? options.filter(option => filterMatches(option, filterText)) : options;
    const groupOrder = [...new Set(found.map(option => option.group))];
    const sorted = [...found].sort((a, b) => groupOrder.indexOf(a.group) - groupOrder.indexOf(b.group));
    if (!multiple || !filterable || groupOrder.some(group => group !== undefined)) return sorted;
    const first = openedWith.current;
    return [...sorted.filter(option => first.includes(option.value)), ...sorted.filter(option => !first.includes(option.value))];
  }, [options, filterable, filterText, multiple, open]); // eslint-disable-line react-hooks/exhaustive-deps -- reordered as it opens
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
  };
  const openList = (highlight: "selected" | "first" | "last" | number) => {
    if (disabled || readOnly) return;
    if (panel) {
      // The rows reorder as the list opens; the effect below highlights the choice in the new order.
      openedWith.current = chosen;
      setActive(-1);
      setOpen(true);
      return;
    }
    const current = rows.findIndex(option => option.value === selected);
    setActive(typeof highlight === "number" ? highlight
      : highlight === "first" ? firstEnabled() : highlight === "last" ? lastEnabled()
      : current >= 0 && enabled(current) ? current : firstEnabled());
    setOpen(true);
  };
  const close = () => { setOpen(false); setActive(-1); setFilterText(""); };
  // Focus leaving the select (not moving between its trigger, filter, Select all and footer) closes the list.
  const leave = (event: FocusEvent) => {
    const next = event.relatedTarget as Element | null;
    // The list's own scroller taking focus (a press on its padding) is leaving too, as it was before the panel.
    if (next && rootRef.current?.contains(next) && !next.matches('[role="listbox"], [popover]')) return;
    close();
  };
  // Opened from outside (`open` or `defaultOpen`), the list highlights the choice, as a press on the trigger does.
  useEffect(() => {
    if (!open || active >= 0) return;
    const current = rows.findIndex(option => option.value === selected);
    setActive(current >= 0 && enabled(current) ? current : firstEnabled());
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps
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
    // With a filter, focus moves into it; with a footer alone it stays on the trigger, and Tab goes on into the footer.
    if (open && !shown) { list.showPopover(); filterRef.current?.focus({ preventScroll: true }); }
    if (!open && shown) {
      // Focus inside the panel goes back to the trigger before the list hides, so it never falls to the page.
      if (list.contains(document.activeElement)) triggerRef.current?.focus({ preventScroll: true });
      list.hidePopover();
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps
  // A narrowed list highlights its first option and says how many it found (components audit D1).
  useEffect(() => {
    if (!open || !filterable) return;
    setActive(rows.findIndex(option => !option.disabled));
    if (filterText.trim()) announce(rows.length ? `${rows.length} ${rows.length === 1 ? "result" : "results"}` : typeof emptyText === "string" ? emptyText : "");
  }, [filterText]); // eslint-disable-line react-hooks/exhaustive-deps
  // Menu's engine (audit S16): the list starts at the trigger's start, 4 below it, flips and shifts.
  // A grid starts at its Field and takes its width, so a horizontal Field's label column gives the cells room.
  const grid = layout === "grid";
  useAnchoredPosition(rootRef, listRef, open, { side: "bottom", align: "start", offset: MENU_OFFSET, padding: OVERLAY_PADDING,
    anchorRect: grid ? anchor => (anchor.closest(".area-field") ?? anchor).getBoundingClientRect() : undefined });
  // Up and Down in a grid: the nearest enabled cell by centre in the row below or above (List box's geometry).
  const vertical = (from: number, down: boolean) => {
    const cells = [...(listRef.current?.querySelectorAll<HTMLElement>("[data-index]") ?? [])];
    const current = cells.find(cell => Number(cell.dataset.index) === from);
    if (!current) return from;
    const box = current.getBoundingClientRect();
    const centre = box.left + box.width / 2;
    let best: { index: number; row: number; dx: number } | undefined;
    for (const cell of cells) {
      const index = Number(cell.dataset.index);
      if (!enabled(index)) continue;
      const rect = cell.getBoundingClientRect();
      if (down ? rect.top < box.bottom - 1 : rect.bottom > box.top + 1) continue;
      const row = down ? rect.top : -rect.bottom;
      const dx = Math.abs(rect.left + rect.width / 2 - centre);
      if (!best || row < best.row - 1 || (Math.abs(row - best.row) <= 1 && dx < best.dx)) best = { index, row, dx };
    }
    return best?.index ?? from;
  };
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
    if (event.defaultPrevented || disabled || readOnly) return;
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
      case "ArrowDown": event.preventDefault(); setActive(current => grid && current >= 0 ? vertical(current, true) : move(current < 0 ? -1 : current, 1)); break;
      case "ArrowUp":
        event.preventDefault();
        if (altKey) { if (!multiple) choose(active, event); close(); }
        else setActive(current => grid && current >= 0 ? vertical(current, false) : move(current < 0 ? rows.length : current, -1));
        break;
      case "ArrowRight":
      case "ArrowLeft": {
        if (!grid) break;
        event.preventDefault();
        const forward = (key === "ArrowRight") !== (getComputedStyle(event.currentTarget).direction === "rtl");
        setActive(current => move(current < 0 ? (forward ? -1 : rows.length) : current, forward ? 1 : -1));
        break;
      }
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
      case "Tab": {
        // A footer's controls are the next stop while the list is open.
        const control = !event.shiftKey ? listRef.current?.querySelector<HTMLElement>(".area-menu__footer :is(button, a[href], input, select, textarea, [tabindex]):not([disabled], [tabindex='-1'])") : null;
        if (control) { event.preventDefault(); control.focus(); break; }
        if (!multiple) choose(active, event); close(); break;
      }
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
      /* The chosen row shows the active plate and the check, as every value picker (plan B7.7); a grid's own rules mark
         its cell (the plate for words, the selected edge for a picture). */
      data-selected={isSelected && !grid ? "" : undefined}
     
      onPointerDown={event => event.preventDefault()}
      onPointerMove={() => { if (!option.disabled && index !== active) setActive(index); }}
      onClick={event => { if (option.disabled) return; choose(index, event); if (!multiple) close(); if (!panel) triggerRef.current?.focus(); }}>
      {grid ? [
        option.preview ? <span key="preview" className="area-custom-select__preview" aria-hidden="true">{option.preview}</span>
          : option.icon ? <span key="icon" className="area-menu__icon" aria-hidden="true">{option.icon}</span> : null,
        <span key="caption" className="area-custom-select__caption">{option.label}</span>,
      ] : <>
      {option.icon ? <span className="area-menu__icon" aria-hidden="true">{option.icon}</span> : null}
      {option.description
        ? <span className="area-menu__lines"><span className="area-menu__text">{highlightMatch(option.label, filterText)}</span><span className="area-menu__description">{option.description}</span></span>
        : <span className="area-menu__text">{highlightMatch(option.label, filterText)}</span>}
      <span className="area-menu__check" aria-hidden="true"><Glyph name="check" /></span>
      </>}
    </div>;
  };

  // In a grid each run of options (the whole list, or a group's) is one grid of cells.
  const run = (indexes: number[], key: string) => grid
    ? <div key={key} className="area-custom-select__grid" role="presentation">{indexes.map(renderRow)}</div>
    : indexes.map(renderRow);

  const optionList = [...groups].map(([group, indexes], position) => group
    ? [position > 0 ? <div key={`${group}-rule`} className="area-menu__separator area-custom-select__separator" role="presentation" /> : null,
      <div key={group} role="group" aria-labelledby={`${id}-group-${position}`} className="area-custom-select__group">
        <div id={`${id}-group-${position}`} className="area-menu__label" role="presentation"><span className="area-menu__label-text">{group}</span></div>
        {run(indexes, `${group}-cells`)}
      </div>]
    : run(indexes, "cells"));

  // Select all (V7; SelectPanel's showSelectAll, the quick input's check-all): every enabled option shown, or none.
  const shown = rows.filter(option => !option.disabled);
  const allOn = shown.length > 0 && shown.every(isChosen);
  const someOn = !allOn && shown.some(isChosen);
  const selectAll = (event: SyntheticEvent) => {
    const off = new Set(allOn ? shown.map(option => option.value) : []);
    const on = new Set(allOn ? [] : shown.map(option => option.value));
    const next = options.filter(option => on.has(option.value) || (chosen.includes(option.value) && !off.has(option.value))).map(option => option.value);
    if (values === undefined) setOwnValues(next);
    onValuesChange?.(next, event);
    announce(`${next.length} selected`);
  };
  // The filter field's keys: the arrows move through the options and Enter chooses; Space and the rest type.
  const filterKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    switch (event.key) {
      case "ArrowDown": event.preventDefault(); setActive(current => move(current < 0 ? -1 : current, 1)); break;
      case "ArrowUp":
        event.preventDefault();
        if (event.altKey) close(); else setActive(current => move(current < 0 ? rows.length : current, -1));
        break;
      case "PageDown": event.preventDefault(); setActive(current => move(current, PAGE)); break;
      case "PageUp": event.preventDefault(); setActive(current => move(current, -PAGE)); break;
      case "Enter": event.preventDefault(); choose(active, event); if (!multiple) close(); break;
      case "Escape": event.preventDefault(); close(); break;
    }
  };

  return <div ref={rootRef} className={customSelectVariants({ variant, size, fullWidth, layout }, className)} style={style}
    data-open={open ? "" : undefined}>
    <button ref={node => { triggerRef.current = node; if (typeof ref === "function") ref(node); else if (ref) ref.current = node; }}
      {...rest} type="button" form={form} className="area-custom-select__trigger" disabled={disabled}
      role="combobox" aria-haspopup="listbox" aria-expanded={open} aria-controls={listId} aria-activedescendant={activeId}
      aria-invalid={status === "error" || undefined} aria-required={required || undefined} aria-readonly={readOnly || undefined}
      {...validationAttributes(status)} data-read-only={readOnly ? "" : undefined}
      onClick={event => { onClick?.(event); if (event.defaultPrevented) return; if (open) close(); else openList("selected"); }}
      onKeyDown={handleKeyDown}
      onBlur={event => { onBlur?.(event); leave(event); }}>
      {selectedOption?.icon ? <span className="area-custom-select__icon" aria-hidden="true">{selectedOption.icon}</span> : null}
      <span className="area-custom-select__value" data-placeholder={chosenLabel ? undefined : ""}>{chosenLabel || placeholder}</span>
      <span className="area-custom-select__chevron" aria-hidden="true"><Glyph name="chevron-down" /></span>
    </button>
    {/* The form gets the option's value, never its label. */}
    {name ? multiple
      ? chosen.map(entry => <input key={entry} type="hidden" name={name} form={form} disabled={disabled} value={entry} />)
      : <input type="hidden" name={name} form={form} disabled={disabled} value={selected ?? ""} /> : null}
    {panel
      ? <div ref={listRef} popover="manual" className="area-menu area-custom-select__listbox area-custom-select__panel" onBlur={leave}
          onKeyDown={event => { if (event.key === "Escape" && !event.defaultPrevented) { event.preventDefault(); close(); } }}>
          {filterable ? <div className="area-menu__header area-custom-select__header">
            <Input ref={filterRef} size="sm" variant="soft" fullWidth icon={<Glyph name="search" />} className="area-custom-select__filter"
              role="combobox" aria-label={filterLabel} placeholder={filterLabel} aria-expanded={open} aria-controls={listId}
              aria-autocomplete="list" aria-activedescendant={activeId} autoComplete="off" spellCheck={false}
              value={filterText} onChange={event => setFilterText(event.target.value)} onKeyDown={filterKeyDown} />
            {multiple ? <button type="button" role="checkbox" aria-checked={allOn ? true : someOn ? "mixed" : false}
              className="area-menu__item area-custom-select__select-all" disabled={!shown.length}
              onPointerDown={event => event.preventDefault()} onClick={selectAll}>
              <span className="area-menu__text">{selectAllLabel}</span>
              <span className="area-menu__check" aria-hidden="true"><Glyph name={someOn ? "subtract" : "check"} /></span>
            </button> : null}
          </div> : null}
          {/* A listbox holds only options, so the empty words sit beside it (audit B-31). */}
          {rows.length === 0 ? <div className="area-menu__list"><div className="area-menu__empty"><span className="area-menu__text">{emptyText}</span></div></div> : null}
          <ScrollArea id={listId} role="listbox" aria-multiselectable={multiple || undefined} aria-label={typeof label === "string" ? label : undefined}
            aria-labelledby={typeof label === "string" ? undefined : labelledBy} hidden={rows.length === 0 || undefined}
            className="area-menu__list" viewportProps={{ tabIndex: undefined }}>
            {optionList}
          </ScrollArea>
          {panel && footer !== undefined && footer !== null && footer !== false ? <div className="area-menu__footer area-custom-select__footer">{footer}</div> : null}
        </div>
      : <ScrollArea ref={listRef} id={listId} role="listbox" aria-multiselectable={multiple || undefined} aria-label={typeof label === "string" ? label : undefined}
          aria-labelledby={typeof label === "string" ? undefined : labelledBy}
          popover="manual" className="area-menu area-custom-select__listbox" tabIndex={-1} viewportProps={{ tabIndex: undefined }}>
          {optionList}
        </ScrollArea>}
  </div>;
});
