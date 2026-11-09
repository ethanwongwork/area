import { forwardRef, useEffect, useId, useRef, useState } from "react";
import type { ButtonHTMLAttributes, KeyboardEvent, ReactNode, SyntheticEvent } from "react";
import { datePickerVariants, type VariantProps, MANIFESTS } from "../variants.ts";
import { Calendar } from "./Calendar.tsx";
import { Input } from "./Input.tsx";
import { Popover } from "./primitives.tsx";
import { assignRef, useOpenState } from "./overlay.ts";
import { resolveValidation, validationAttributes, type ValidationStatus } from "./validation.ts";

type Manifest = VariantProps<typeof MANIFESTS.datePicker>;

export interface DatePickerProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "value" | "defaultValue" | "onChange" | "type"> {
  /** The date as "YYYY-MM-DD" (controlled); null for none. */
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null, event?: SyntheticEvent) => void;
  /** Shown while no date is set. */
  placeholder?: ReactNode;
  /** A leading glyph in the field (a calendar). */
  icon?: ReactNode;
  variant?: Manifest["variant"];
  size?: Manifest["size"];
  fullWidth?: boolean;
  invalid?: boolean;
  /** Semantic validation paint, as Input's: `error` (also `invalid`), `success` or `warning`. A Field passes its own. */
  validationStatus?: ValidationStatus;
  /** Internal Field-to-control validation bridge; plain HTML uses the matching data attribute. */
  "data-validation-status"?: ValidationStatus;
  /**
   * Shows a date set elsewhere: the field stays focusable and readable (a combobox with `aria-readonly`), the calendar
   * doesn't open and the date can't change, as Radio group's and Input's read-only.
   */
  readOnly?: boolean;
  /** Submits the date ("YYYY-MM-DD") under this name. */
  name?: string;
  /** Earliest and latest choosable dates, "YYYY-MM-DD". */
  min?: string;
  max?: string;
  isDateUnavailable?: (date: string) => boolean;
  /** Today's date for the calendar's mark, "YYYY-MM-DD" (defaults to the clock). */
  today?: string;
  locale?: string;
  firstDayOfWeek?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  /** How the field shows the date. Defaults to "October 5, 2026" (Notion's full date). */
  formatOptions?: Intl.DateTimeFormatOptions;
  /** Offer a Clear row under the calendar. */
  clearable?: boolean;
  /** The calendar is open (controlled); `defaultOpen` opens it at first. */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const pad = (n: number) => String(n).padStart(2, "0");
const toIso = (date: Date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
const fromIso = (iso: string | null | undefined) => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso ?? "");
  if (!match) return null;
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]), 12);
  return date.getMonth() === Number(match[2]) - 1 ? date : null;
};
const FULL_DATE: Intl.DateTimeFormatOptions = { month: "long", day: "numeric", year: "numeric" };

/**
 * A field showing a date that opens a Popover: the date as text (type one and press Enter) above a
 * Calendar (pick one), and a Clear row. Picking a day sets it and closes; focus returns to the field.
 * Notion's date property; the calendar keeps its own keyboard (arrows by day and week, Page keys by
 * month).
 */
export const DatePicker = forwardRef<HTMLButtonElement, DatePickerProps>(function DatePicker(
  { value, defaultValue = null, onValueChange, placeholder = "Pick a date", icon, variant, size, fullWidth, invalid, validationStatus, readOnly,
    name, min, max, isDateUnavailable, today, locale, firstDayOfWeek, formatOptions = FULL_DATE, clearable = true, open: openProp, defaultOpen,
    onOpenChange, disabled, className, style, form, id: idProp, "aria-invalid": ariaInvalid, "data-validation-status": fieldStatus, ...rest }, ref,
) {
  const generated = useId();
  const triggerId = idProp ?? `${generated}-trigger`;
  const [own, setOwn] = useState<string | null>(defaultValue);
  const selected = value !== undefined ? value : own;
  // The ref and the native props reach the trigger, where Field's id lands (as Custom select's).
  const [shownOpen, setOpenState] = useOpenState(openProp, defaultOpen, onOpenChange);
  const open = shownOpen && !readOnly && !disabled;
  const { status } = resolveValidation({ validationStatus, invalid, ariaInvalid, fieldStatus });
  const [text, setText] = useState("");
  const [month, setMonth] = useState<string | undefined>(undefined);
  const [textInvalid, setTextInvalid] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const initial = useRef(defaultValue);
  const format = (iso: string | null) => { const date = fromIso(iso); return date ? new Intl.DateTimeFormat(locale, formatOptions).format(date) : ""; };
  const label = rest["aria-label"];

  const prepare = () => { setText(format(selected)); setTextInvalid(false); setMonth(selected?.slice(0, 7)); };
  const setOpen = (next: boolean) => {
    if (next && (readOnly || disabled)) return;
    setOpenState(next);
    if (next) prepare();
  };
  // Opened from outside (`open` or `defaultOpen`), the panel starts from the date as it is.
  const wasOpen = useRef(false);
  useEffect(() => { if (open && !wasOpen.current) prepare(); wasOpen.current = open; }, [open]); // eslint-disable-line react-hooks/exhaustive-deps
  const commit = (next: string | null, event?: SyntheticEvent) => {
    if (value === undefined) setOwn(next);
    if (next !== selected) onValueChange?.(next, event);
  };
  const finish = () => { setOpen(false); document.getElementById(triggerId)?.focus(); };
  const allowed = (iso: string) => (!min || iso >= min) && (!max || iso <= max) && !isDateUnavailable?.(iso);

  // Typed text: ISO first, then whatever the platform's date parser reads ("Oct 5 2026", "10/5/2026").
  const parse = (input: string) => {
    const trimmed = input.trim();
    if (!trimmed) return null;
    const iso = fromIso(trimmed);
    if (iso) return toIso(iso);
    const parsed = new Date(trimmed);
    return Number.isNaN(parsed.getTime()) ? undefined : toIso(parsed);
  };
  const commitText = (event: SyntheticEvent) => {
    const next = parse(text);
    if (next === undefined || (next && !allowed(next))) { setTextInvalid(true); return false; }
    setTextInvalid(false);
    commit(next, event);
    if (next) { setMonth(next.slice(0, 7)); setText(format(next)); }
    return true;
  };
  const handleTextKey = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && !event.nativeEvent.isComposing) { event.preventDefault(); if (commitText(event)) finish(); }
  };

  // A form reset returns an uncontrolled picker to its first date.
  useEffect(() => {
    const owner = rootRef.current?.closest("form");
    if (!owner) return;
    const reset = (event: Event) => queueMicrotask(() => { if (!event.defaultPrevented && value === undefined) setOwn(initial.current); });
    owner.addEventListener("reset", reset);
    return () => owner.removeEventListener("reset", reset);
  }, [value]);

  const shown = format(selected);
  const trigger = (readOnlyTrigger: boolean) => <button {...rest} ref={node => assignRef(ref, node)} id={triggerId} type="button" form={form}
    className="area-date-picker__trigger" disabled={disabled} aria-invalid={status === "error" || undefined} {...validationAttributes(status)}
    // Read-only: a combobox that announces aria-readonly and never opens (a button has no read-only state).
    {...(readOnlyTrigger ? { role: "combobox", "aria-readonly": true, "aria-expanded": false, "data-read-only": "" } : {})}>
    {icon ? <span className="area-date-picker__icon" aria-hidden="true">{icon}</span> : null}
    <span className="area-date-picker__value" data-placeholder={shown ? undefined : ""}>{shown || placeholder}</span>
  </button>;
  const hidden = name ? <input type="hidden" name={name} form={form} disabled={disabled} value={selected ?? ""} /> : null;
  if (readOnly) return <div ref={rootRef} className={datePickerVariants({ variant, size, fullWidth }, className)} style={style}>
    {trigger(true)}
    {hidden}
  </div>;
  return <div ref={rootRef}
    className={datePickerVariants({ variant, size, fullWidth }, className)} style={style} data-open={open ? "" : undefined}>
    <Popover className="area-date-picker__panel" align="start" open={open} onOpenChange={next => setOpen(next)}
      aria-label={typeof label === "string" ? label : "Choose a date"}
      trigger={trigger(false)}>
      <Input size="sm" fullWidth aria-label="Date" value={text} invalid={textInvalid} placeholder={format(today ?? toIso(new Date()))}
        onChange={event => { setText(event.target.value); setTextInvalid(false); }} onKeyDown={handleTextKey}
        onFocus={event => { const field = event.currentTarget; requestAnimationFrame(() => field.select()); }}
        onBlur={event => { if (text !== format(selected)) commitText(event); }} />
      <Calendar variant="plain" aria-label={typeof label === "string" ? label : "Date"} value={selected}
        month={month} onMonthChange={setMonth} min={min} max={max} isDateUnavailable={isDateUnavailable} today={today}
        locale={locale} firstDayOfWeek={firstDayOfWeek}
        onValueChange={(next, event) => { commit(next, event); finish(); }} />
      {clearable ? <div className="area-date-picker__footer">
        <div className="area-menu__separator" role="presentation" />
        <button type="button" className="area-menu__item" disabled={!selected} data-disabled={selected ? undefined : ""}
          onClick={event => { commit(null, event); finish(); }}>
          <span className="area-menu__text">Clear</span>
        </button>
      </div> : null}
    </Popover>
    {hidden}
  </div>;
});
