import { forwardRef, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { InputHTMLAttributes, KeyboardEvent, ReactNode, SyntheticEvent } from "react";
import { tagPickerVariants, type VariantProps, MANIFESTS } from "../variants.ts";
import { Tag, type TagColor, type TagTone } from "./Tag.tsx";
import { Glyph } from "./Glyph.tsx";
import { scrollOptionIntoList, useAnchoredPosition, useOpenState } from "./overlay.ts";
import { resolveValidation, validationAttributes, type ValidationStatus } from "./validation.ts";
import { ScrollArea } from "./ScrollArea.tsx";
import { announce } from "./announce.ts";
import { MENU_OFFSET, OVERLAY_PADDING } from "./Overlays.tsx";
/** The empty collection, one reference so effects keyed on it stay still. */
const NO_ITEMS: never[] = [];

export interface TagOption {
  value: string;
  label: string;
  /** The tag's colour, Tag's label colours (neutral, gray, brown, orange, yellow, green, blue, purple, pink, red). */
  color?: TagColor;
  /** @deprecated Use `color` (2026-11-07). */
  tone?: TagTone;
  disabled?: boolean;
}

type Manifest = VariantProps<typeof MANIFESTS.tagPicker>;

export interface TagPickerProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "defaultValue" | "onChange" | "size" | "role"> {
  /** The tags to choose from. */
  items?: TagOption[];
  /** The chosen values, in the order they were added (controlled). */
  value?: string[];
  /** The tags chosen at first, uncontrolled; none by default. */
  defaultValue?: string[];
  /** Called with the chosen tags' values and the event that changed them. */
  onValueChange?: (value: string[], event?: SyntheticEvent) => void;
  /** Offer a "Create" row for text that matches no tag; add the tag to `items` to choose it. */
  onCreate?: (text: string) => void;
  /** The list's heading; `null` hides it. */
  hint?: ReactNode;
  /** Shown when nothing matches (and nothing can be created). */
  emptyText?: ReactNode;
  /** The field's treatment, as Input's; outline by default. */
  variant?: Manifest["variant"];
  /** The field's height, as Input's; md by default. */
  size?: Manifest["size"];
  /** Stretch to the width of the container. */
  fullWidth?: boolean;
  /** Marks the choice as wrong: the danger edge and `aria-invalid`. */
  invalid?: boolean;
  /** Semantic validation paint, as Input's: `error` (also `invalid`), `success` or `warning`. A Field passes its own. */
  validationStatus?: ValidationStatus;
  /** Internal Field-to-control validation bridge; plain HTML uses the matching data attribute. */
  "data-validation-status"?: ValidationStatus;
  /** Submits each chosen value under this name. */
  name?: string;
  /** The list is open (controlled); `defaultOpen` opens it at first; `onOpenChange` hears it open and close. */
  open?: boolean;
  /** Whether the list starts open, uncontrolled; closed by default. */
  defaultOpen?: boolean;
  /** Called when the list opens or closes. */
  onOpenChange?: (open: boolean) => void;
}

const contains = (option: TagOption, text: string) => option.label.toLocaleLowerCase().includes(text.trim().toLocaleLowerCase());
type Row = { kind: "option"; option: TagOption } | { kind: "create"; text: string };

/**
 * Picks several values, shown as colored tags in the field.
 * Typing filters the list; ↑/↓ move, Enter adds or removes the highlighted tag and keeps the list
 * open, Backspace in an empty field removes the last tag, Escape closes. With `onCreate`, text
 * that matches nothing offers to create a tag.
 */
export const TagPicker = forwardRef<HTMLInputElement, TagPickerProps>(function TagPicker(
  { items, value, defaultValue, onValueChange, onCreate, hint, emptyText = "No tags", variant, size, fullWidth, invalid, validationStatus, name,
    open: openProp, defaultOpen, onOpenChange, disabled, readOnly, placeholder, className, style, onKeyDown, onBlur, form,
    "aria-invalid": ariaInvalid, "data-validation-status": fieldStatus, ...rest }, ref,
) {
  const options = items ?? NO_ITEMS;
  const id = useId();
  const listId = `${id}-listbox`;
  const [own, setOwn] = useState<string[]>(defaultValue ?? NO_ITEMS);
  const chosen = value ?? own;
  const [text, setText] = useState("");
  const [shownOpen, setOpenState] = useOpenState(openProp, defaultOpen, onOpenChange);
  const open = shownOpen && !readOnly && !disabled;
  // Read through a ref, so a form reset's listener (set up once) sees the list as it is now.
  const openNow = useRef(open);
  openNow.current = open;
  const setOpen = (next: boolean) => { if (next !== openNow.current) setOpenState(next); };
  const { status } = resolveValidation({ validationStatus, invalid, ariaInvalid, fieldStatus });
  const [active, setActive] = useState(-1);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const initial = useRef(defaultValue ?? NO_ITEMS);
  const byValue = (target: string) => options.find(option => option.value === target);

  const rows = useMemo<Row[]>(() => {
    const list: Row[] = options.filter(option => !text.trim() || contains(option, text)).map(option => ({ kind: "option", option }));
    const exact = options.some(option => option.label.toLocaleLowerCase() === text.trim().toLocaleLowerCase());
    if (onCreate && text.trim() && !exact) list.push({ kind: "create", text: text.trim() });
    return list;
  }, [options, text, onCreate]);
  const enabled = (index: number) => !!rows[index] && !(rows[index]!.kind === "option" && (rows[index] as { option: TagOption }).option.disabled);
  const step = (from: number, delta: 1 | -1) => {
    for (let i = 1; i <= rows.length; i++) {
      const next = (from + delta * i + rows.length * 2) % rows.length;
      if (enabled(next)) return next;
    }
    return -1;
  };

  const commit = (next: string[], event?: SyntheticEvent) => {
    if (value === undefined) setOwn(next);
    onValueChange?.(next, event);
  };
  const toggle = (option: TagOption, event?: SyntheticEvent) => {
    if (option.disabled) return;
    const has = chosen.includes(option.value);
    commit(has ? chosen.filter(item => item !== option.value) : [...chosen, option.value], event);
    announce(`${option.label} ${has ? "removed" : "added"}`);
  };
  const remove = (target: string, event?: SyntheticEvent) => {
    commit(chosen.filter(item => item !== target), event);
    announce(`${byValue(target)?.label ?? target} removed`);
  };

  // A created tag is chosen once the host adds it to `items`.
  const pendingCreate = useRef<string | null>(null);
  useEffect(() => {
    const label = pendingCreate.current;
    if (label === null) return;
    const created = options.find(option => option.label === label);
    if (created) { pendingCreate.current = null; if (!chosen.includes(created.value)) toggle(created); }
  }, [options]); // eslint-disable-line react-hooks/exhaustive-deps

  const activate = (row: Row | undefined, event?: SyntheticEvent) => {
    if (!row) return;
    if (row.kind === "create") { pendingCreate.current = row.text; onCreate?.(row.text); setText(""); setActive(0); return; }
    toggle(row.option, event);
    // Picking from a search clears it, so the next tag starts fresh (Notion).
    if (text) { setText(""); setActive(options.findIndex(option => option.value === row.option.value)); }
  };

  // A form reset returns an uncontrolled picker to its first tags.
  useEffect(() => {
    const owner = inputRef.current?.form;
    if (!owner) return;
    const reset = (event: Event) => queueMicrotask(() => {
      if (event.defaultPrevented) return;
      if (value === undefined) setOwn(initial.current);
      setText(""); setOpen(false); setActive(-1);
    });
    owner.addEventListener("reset", reset);
    return () => owner.removeEventListener("reset", reset);
  }, [value]);

  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list || typeof list.showPopover !== "function") return;
    const shown = list.matches(":popover-open");
    if (open && !shown) list.showPopover();
    if (!open && shown) list.hidePopover();
  }, [open]);
  // Combobox's placement: 4 below the field, flips and shifts; it moves as tags wrap the field.
  useAnchoredPosition(rootRef, listRef, open, { side: "bottom", align: "start", offset: MENU_OFFSET, padding: OVERLAY_PADDING });
  useEffect(() => {
    if (!open || active < 0) return;
    scrollOptionIntoList(listRef.current, listRef.current?.querySelector<HTMLElement>(`[data-index="${active}"]`));
  }, [open, active]);

  const openList = () => {
    if (disabled || readOnly || open) return;
    setOpen(true);
    setActive(rows.findIndex((_, index) => enabled(index)));
  };
  const close = () => { setOpen(false); setActive(-1); setText(""); };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented || event.nativeEvent.isComposing || event.keyCode === 229) return;
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        if (!open) openList(); else setActive(current => step(current, 1));
        break;
      case "ArrowUp":
        event.preventDefault();
        if (!open) openList(); else setActive(current => step(current < 0 ? 0 : current, -1));
        break;
      case "Enter":
        if (open && active >= 0) { event.preventDefault(); activate(rows[active], event); }
        break;
      case "Escape":
        if (open) { event.preventDefault(); close(); }
        break;
      case "Backspace":
        if (!text && chosen.length && !readOnly) { event.preventDefault(); remove(chosen[chosen.length - 1]!, event); }
        break;
    }
  };

  const activeId = open && active >= 0 ? `${id}-option-${active}` : undefined;
  // While the list fades out it keeps the rows it last showed: closing clears the search, which
  // would otherwise list every option during the exit (docs/MOTION.md).
  const shownRows = useRef(rows);
  if (open) shownRows.current = rows;
  const listRows = open ? rows : shownRows.current;
  const label = rest["aria-label"];
  const tagSize = size === "lg" ? "lg" : "md";  // Tag 20, or 24 in the large field
  // Notion heads the list with what it does ("Select an option or create one"); `hint={null}` drops it.
  const hintText = hint === undefined ? (onCreate ? "Select a tag or create one" : "Select tags") : hint;

  return <div ref={rootRef} className={tagPickerVariants({ variant, size, fullWidth }, className)} style={style} data-open={open ? "" : undefined}>
    <div className="area-tag-picker__field" data-disabled={disabled ? "" : undefined} aria-invalid={status === "error" || undefined}
      {...validationAttributes(status)} data-read-only={readOnly ? "" : undefined}
      onPointerDown={event => { if (event.target === event.currentTarget) { event.preventDefault(); inputRef.current?.focus(); openList(); } }}>
      {chosen.map(item => {
        const option = byValue(item);
        const tagLabel = option?.label ?? item;
        return <Tag key={item} size={tagSize} color={option?.color} tone={option?.tone} disabled={disabled}
          {...(disabled || readOnly ? {} : { onRemove: () => { remove(item); inputRef.current?.focus(); }, removeLabel: `Remove ${tagLabel}` })}>
          {tagLabel}
        </Tag>;
      })}
      <input ref={node => { inputRef.current = node; if (typeof ref === "function") ref(node); else if (ref) ref.current = node; }}
        {...rest} form={form} className="area-tag-picker__input" disabled={disabled} readOnly={readOnly}
        placeholder={chosen.length ? undefined : placeholder}
        role="combobox" aria-autocomplete="list" aria-expanded={open} aria-controls={listId} aria-activedescendant={activeId}
        aria-invalid={status === "error" || undefined} autoComplete="off" value={text}
        onChange={event => { setText(event.target.value); if (!open) setOpen(true); setActive(0); }}
        onClick={openList}
        onKeyDown={handleKeyDown}
        onBlur={event => { onBlur?.(event); close(); }} />
    </div>
    {name ? chosen.map(item => <input key={item} type="hidden" name={name} form={form} disabled={disabled} value={item} />) : null}
    <ScrollArea ref={listRef} id={listId} role="listbox" aria-multiselectable="true" aria-label={typeof label === "string" ? label : undefined}
      aria-labelledby={typeof label === "string" ? undefined : rest["aria-labelledby"]}
      popover="manual" className="area-menu area-tag-picker__listbox" tabIndex={-1} viewportProps={{ tabIndex: undefined }}>
      {hintText !== null ? <div className="area-menu__label area-tag-picker__hint" role="presentation"><span className="area-menu__label-text">{hintText}</span></div> : null}
      {listRows.length === 0 ? <div className="area-menu__empty" role="presentation"><span className="area-menu__text">{emptyText}</span></div> : null}
      {listRows.map((row, index) => {
        const highlighted = index === active;
        if (row.kind === "create") {
          return <div key="__create" id={`${id}-option-${index}`} data-index={index} role="option" aria-selected={false}
            className="area-menu__item area-tag-picker__option area-tag-picker__create" data-highlighted={highlighted ? "" : undefined}
            onPointerDown={event => event.preventDefault()} onPointerMove={() => setActive(index)} onClick={event => activate(row, event)}>
            <span className="area-menu__text">Create</span>
            <Tag size={tagSize}>{row.text}</Tag>
          </div>;
        }
        const { option } = row;
        const isChosen = chosen.includes(option.value);
        return <div key={option.value} id={`${id}-option-${index}`} data-index={index} role="option" aria-selected={isChosen}
          aria-disabled={option.disabled || undefined} data-disabled={option.disabled ? "" : undefined}
          className="area-menu__item area-tag-picker__option" data-highlighted={highlighted ? "" : undefined}
          onPointerDown={event => event.preventDefault()} onPointerMove={() => { if (!option.disabled) setActive(index); }}
          onClick={event => activate(row, event)}>
          <Tag size={tagSize} color={option.color} tone={option.tone}>{option.label}</Tag>
          <span className="area-menu__check" aria-hidden="true"><Glyph name="check" /></span>
        </div>;
      })}
    </ScrollArea>
  </div>;
});
