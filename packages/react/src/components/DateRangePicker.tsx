// DateRangePicker: a field showing a range of dates that opens a Popover with optional presets above a range
// Calendar, and a Clear row. Date picker's field and panel; Notion's search date filter. docs/specs/date-range-picker.md.
import { forwardRef, useId, useRef, useState } from "react";
import type { ButtonHTMLAttributes, ReactNode, SyntheticEvent } from "react";
import { datePickerVariants, cx, type VariantProps, MANIFESTS } from "../variants.ts";
import { Calendar, type CalendarRange } from "./Calendar.tsx";
import { Glyph } from "./Glyph.tsx";
import { Popover } from "./primitives.tsx";

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
  defaultValue?: CalendarRange | null;
  onValueChange?: (value: CalendarRange | null, event?: SyntheticEvent) => void;
  /** Rows above the calendar that set a range at once (Notion's Today, Last 7 days, Last 30 days). */
  presets?: DateRangePreset[];
  /** Shown while no range is set. */
  placeholder?: ReactNode;
  /** A leading glyph in the field (a calendar). */
  icon?: ReactNode;
  variant?: Manifest["variant"];
  size?: Manifest["size"];
  fullWidth?: boolean;
  invalid?: boolean;
  /** Submits the range as `<name>-start` and `<name>-end` ("YYYY-MM-DD"). */
  name?: string;
  /** Earliest and latest choosable dates, "YYYY-MM-DD". */
  min?: string;
  max?: string;
  isDateUnavailable?: (date: string) => boolean;
  /** Today's date for the calendar's mark, "YYYY-MM-DD" (defaults to the clock). */
  today?: string;
  locale?: string;
  firstDayOfWeek?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  /** One month, or two side by side for ranges across a month's end. */
  visibleMonths?: 1 | 2;
  /** How the field shows each end. Defaults to "Oct 3 – 10, 2026" (a short month, shared parts once). */
  formatOptions?: Intl.DateTimeFormatOptions;
  /** Offer a Clear row under the calendar. */
  clearable?: boolean;
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
export const DateRangePicker = forwardRef<HTMLDivElement, DateRangePickerProps>(function DateRangePicker(
  { value, defaultValue = null, onValueChange, presets, placeholder = "Pick dates", icon, variant, size, fullWidth, invalid, name,
    min, max, isDateUnavailable, today, locale, firstDayOfWeek, visibleMonths = 1, formatOptions = SHORT_DATE, clearable = true,
    onOpenChange, disabled, className, style, form, id: idProp, ...rest }, ref,
) {
  const generated = useId();
  const triggerId = idProp ?? `${generated}-trigger`;
  const [own, setOwn] = useState<CalendarRange | null>(defaultValue);
  const selected = value !== undefined ? value : own;
  const [open, setOpenState] = useState(false);
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
    setOpenState(next);
    onOpenChange?.(next);
    if (next) setMonth(selected?.start.slice(0, 7));
  };
  const commit = (next: CalendarRange | null, event?: SyntheticEvent) => {
    if (value === undefined) setOwn(next);
    if (!(next === selected || same(next, selected))) onValueChange?.(next, event);
  };
  const finish = () => { setOpen(false); document.getElementById(triggerId)?.focus(); };

  const shown = format(selected);
  return <div ref={node => { rootRef.current = node; if (typeof ref === "function") ref(node); else if (ref) ref.current = node; }}
    className={datePickerVariants({ variant, size, fullWidth }, cx("area-date-range-picker", className))} style={style} data-open={open ? "" : undefined}>
    <Popover className="area-date-picker__panel" align="start"
      open={open} onOpenChange={next => setOpen(next)} aria-label={typeof label === "string" ? label : "Choose dates"}
      trigger={<button {...rest} id={triggerId} type="button" form={form} className="area-date-picker__trigger" disabled={disabled}
        aria-invalid={invalid || undefined}>
        {icon ? <span className="area-date-picker__icon" aria-hidden="true">{icon}</span> : null}
        <span className="area-date-picker__value" data-placeholder={shown ? undefined : ""}>{shown || placeholder}</span>
      </button>}>
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
    {name ? <>
      <input type="hidden" name={`${name}-start`} form={form} disabled={disabled} value={selected?.start ?? ""} />
      <input type="hidden" name={`${name}-end`} form={form} disabled={disabled} value={selected?.end ?? ""} />
    </> : null}
  </div>;
});
