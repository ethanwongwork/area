// DateRangePicker: a field showing a range of dates that opens a Popover with optional presets above a range
// Calendar, and a Clear row. Date picker's field and panel; Notion's search date filter. docs/specs/date-range-picker.md.
import { forwardRef, useEffect, useId, useRef, useState } from "react";
import type { ButtonHTMLAttributes, ReactNode, SyntheticEvent } from "react";
import { datePickerVariants, cx, type VariantProps, MANIFESTS } from "../variants.ts";
import { Calendar, type CalendarRange } from "./Calendar.tsx";
import { Glyph } from "./Glyph.tsx";
import { Popover } from "./Popover.tsx";
import { assignRef, useOpenState } from "./overlay.ts";
import { resolveValidation, validationAttributes, type ValidationStatus } from "./validation.ts";

type Manifest = VariantProps<typeof MANIFESTS.datePicker>;

export interface DateRangePreset {
  /** The row's name ("Last 7 days"). */
  label: string;
  /** The range it sets, "YYYY-MM-DD" start and end. */
  value: CalendarRange;
}

export interface DateRangePickerProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "value" | "defaultValue" | "onChange" | "type"> {
  /** The range (controlled); null for none. */
  value?: CalendarRange | null;
  /** The range at first, uncontrolled; none by default. */
  defaultValue?: CalendarRange | null;
  /** Called with the new range, or `null` when it is cleared, and the event behind it. */
  onValueChange?: (value: CalendarRange | null, event?: SyntheticEvent) => void;
  /** Rows above the calendar that set a range at once ("Today", "Last 7 days", "Last 30 days"). */
  presets?: DateRangePreset[];
  /** Shown while no range is set. */
  placeholder?: ReactNode;
  /** A leading glyph in the field (a calendar). */
  icon?: ReactNode;
  /** The field's treatment, as Date picker's: `outline` (default), `soft` or `ghost`. */
  variant?: Manifest["variant"];
  /** The field's height and type, as Date picker's: `md` (default), `sm` or `lg`. */
  size?: Manifest["size"];
  /** The field fills its container's width. */
  fullWidth?: boolean;
  /** Paints the field as an error and sets `aria-invalid`; the same as `validationStatus="error"`. */
  invalid?: boolean;
  /** Semantic validation paint, as Input's: `error` (also `invalid`), `success` or `warning`. A Field passes its own. */
  validationStatus?: ValidationStatus;
  /** Internal Field-to-control validation bridge; plain HTML uses the matching data attribute. */
  "data-validation-status"?: ValidationStatus;
  /** Shows a range set elsewhere: focusable and readable (a combobox with `aria-readonly`), it doesn't open, as Date picker's. */
  readOnly?: boolean;
  /** Submits the range as `<name>-start` and `<name>-end` ("YYYY-MM-DD"). */
  name?: string;
  /** Earliest and latest choosable dates, "YYYY-MM-DD". */
  min?: string;
  /** The latest choosable date, "YYYY-MM-DD". */
  max?: string;
  /** Dates that cannot be chosen, such as booked days: return `true` for a "YYYY-MM-DD" to disable it. */
  isDateUnavailable?: (date: string) => boolean;
  /** Today's date for the calendar's mark, "YYYY-MM-DD" (defaults to the clock). */
  today?: string;
  /** The language and region the field and the calendar write dates in. */
  locale?: string;
  /** The calendar's first weekday; 0 is Sunday. */
  firstDayOfWeek?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  /** One month, or two side by side for ranges across a month's end. */
  visibleMonths?: 1 | 2;
  /** How the field shows each end. Defaults to "Oct 3 – 10, 2026" (a short month, shared parts once). */
  formatOptions?: Intl.DateTimeFormatOptions;
  /** Offer a Clear row under the calendar. */
  clearable?: boolean;
  /** The panel is open (controlled); `defaultOpen` opens it at first. */
  open?: boolean;
  /** Whether the panel starts open, uncontrolled. */
  defaultOpen?: boolean;
  /** Called when the panel opens or closes. */
  onOpenChange?: (open: boolean) => void;
}

const SHORT_DATE: Intl.DateTimeFormatOptions = { month: "short", day: "numeric", year: "numeric" };
const fromIso = (iso: string | null | undefined) => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso ?? "");
  if (!match) return null;
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]), 12);
  return date.getMonth() === Number(match[2]) - 1 ? date : null;
};
const same = (a: CalendarRange | null | undefined, b: CalendarRange | null | undefined) => !!a && !!b && a.start === b.start && a.end === b.end;

/**
 * A field showing a range of dates. It opens a Popover: preset rows (optional), a range Calendar (pick the
 * first day, then the last; Escape drops a half-picked range), and a Clear row. A preset or a finished range
 * sets the value and closes; focus returns to the field.
 */
export const DateRangePicker = forwardRef<HTMLButtonElement, DateRangePickerProps>(function DateRangePicker(
  { value, defaultValue = null, onValueChange, presets, placeholder = "Pick dates", icon, variant, size, fullWidth, invalid, validationStatus,
    readOnly, name, min, max, isDateUnavailable, today, locale, firstDayOfWeek, visibleMonths = 1, formatOptions = SHORT_DATE, clearable = true,
    open: openProp, defaultOpen, onOpenChange, disabled, className, style, form, id: idProp, "aria-invalid": ariaInvalid,
    "data-validation-status": fieldStatus, ...rest }, ref,
) {
  const generated = useId();
  const triggerId = idProp ?? `${generated}-trigger`;
  const [own, setOwn] = useState<CalendarRange | null>(defaultValue);
  const selected = value !== undefined ? value : own;
  // The ref and the native props reach the trigger, where Field's id lands (as Custom select's).
  const [shownOpen, setOpenState] = useOpenState(openProp, defaultOpen, onOpenChange);
  const open = shownOpen && !readOnly && !disabled;
  const { status } = resolveValidation({ validationStatus, invalid, ariaInvalid, fieldStatus });
  const [month, setMonth] = useState<string | undefined>(undefined);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const label = rest["aria-label"];

  const format = (range: CalendarRange | null) => {
    const start = fromIso(range?.start), end = fromIso(range?.end);
    if (!start || !end) return "";
    const formatter = new Intl.DateTimeFormat(locale, formatOptions);
    return start.getTime() === end.getTime() ? formatter.format(start) : formatter.formatRange(start, end);
  };
  const setOpen = (next: boolean) => {
    if (next && (readOnly || disabled)) return;
    setOpenState(next);
    if (next) setMonth(selected?.start.slice(0, 7));
  };
  // Opened from outside (`open` or `defaultOpen`), the month starts at the range.
  const wasOpen = useRef(false);
  useEffect(() => { if (open && !wasOpen.current) setMonth(selected?.start.slice(0, 7)); wasOpen.current = open; }, [open]); // eslint-disable-line react-hooks/exhaustive-deps
  const commit = (next: CalendarRange | null, event?: SyntheticEvent) => {
    if (value === undefined) setOwn(next);
    if (!(next === selected || same(next, selected))) onValueChange?.(next, event);
  };
  const finish = () => { setOpen(false); document.getElementById(triggerId)?.focus(); };

  const shown = format(selected);
  const trigger = (readOnlyTrigger: boolean) => <button {...rest} ref={node => assignRef(ref, node)} id={triggerId} type="button" form={form}
    className="area-date-picker__trigger" disabled={disabled} aria-invalid={status === "error" || undefined} {...validationAttributes(status)}
    // Read-only: a combobox that announces aria-readonly and never opens (a button has no read-only state).
    {...(readOnlyTrigger ? { role: "combobox", "aria-readonly": true, "aria-expanded": false, "data-read-only": "" } : {})}>
    {icon ? <span className="area-date-picker__icon" aria-hidden="true">{icon}</span> : null}
    <span className="area-date-picker__value" data-placeholder={shown ? undefined : ""}>{shown || placeholder}</span>
  </button>;
  const hidden = name ? <>
    <input type="hidden" name={`${name}-start`} form={form} disabled={disabled} value={selected?.start ?? ""} />
    <input type="hidden" name={`${name}-end`} form={form} disabled={disabled} value={selected?.end ?? ""} />
  </> : null;
  const rootClass = datePickerVariants({ variant, size, fullWidth }, cx("area-date-range-picker", className));
  if (readOnly) return <div ref={rootRef} className={rootClass} style={style}>{trigger(true)}{hidden}</div>;
  return <div ref={rootRef} className={rootClass} style={style} data-open={open ? "" : undefined}>
    <Popover className="area-date-picker__panel" align="start"
      open={open} onOpenChange={next => setOpen(next)} aria-label={typeof label === "string" ? label : "Choose dates"}
      trigger={trigger(false)}>
      {presets?.length ? <div className="area-date-range-picker__presets" role="group" aria-label="Presets">
        {presets.map(preset => {
          const current = same(preset.value, selected);
          return <button key={preset.label} type="button" className="area-menu__item area-date-range-picker__preset" aria-pressed={current}
            onClick={event => { commit(preset.value, event); finish(); }}>
            <span className="area-menu__text">{preset.label}</span>
            {current ? <span className="area-menu__check" aria-hidden="true"><Glyph name="check" /></span> : null}
          </button>;
        })}
        <div className="area-menu__separator" role="presentation" />
      </div> : null}
      <Calendar variant="plain" selectionMode="range" aria-label={typeof label === "string" ? label : "Dates"} value={selected}
        month={month} onMonthChange={setMonth} visibleMonths={visibleMonths} min={min} max={max} isDateUnavailable={isDateUnavailable}
        today={today} locale={locale} firstDayOfWeek={firstDayOfWeek}
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
