import { forwardRef, useEffect, useId, useMemo, useRef, useState } from "react";
import type { HTMLAttributes, KeyboardEvent, MouseEvent, ReactNode } from "react";
import { Button } from "./Button.tsx";
import { Glyph } from "./Glyph.tsx";
import { calendarVariants, type VariantProps, MANIFESTS } from "../variants.ts";

/* Dates are ISO calendar dates ("2026-09-15"): no time zone, safe in forms and on a server.
 * Arithmetic uses local Date objects at noon, which never cross a daylight-saving edge. */
const pad = (n: number) => String(n).padStart(2, "0");
const toIso = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
function fromIso(iso: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return null;
  const d = new Date(+m[1]!, +m[2]! - 1, +m[3]!, 12);
  return toIso(d) === iso ? d : null;
}
const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n, 12);
const addMonths = (d: Date, n: number) => {
  const target = new Date(d.getFullYear(), d.getMonth() + n, 1, 12);
  const last = new Date(target.getFullYear(), target.getMonth() + 1, 0, 12).getDate();
  return new Date(target.getFullYear(), target.getMonth(), Math.min(d.getDate(), last), 12);
};
const monthStart = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1, 12);
const sameMonth = (a: Date, b: Date) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();

export interface CalendarRange { start: string; end: string }
export type CalendarMarkerTone = "neutral" | "info" | "success" | "warning" | "danger";
const weekOf = (d: Date, firstDay: number) => addDays(d, -((d.getDay() - firstDay + 7) % 7));
type Selection =
  | { selectionMode?: "single"; value?: string | null; defaultValue?: string | null; onValueChange?: (value: string | null, event: MouseEvent<HTMLButtonElement>) => void }
  | { selectionMode: "range"; value?: CalendarRange | null; defaultValue?: CalendarRange | null; onValueChange?: (value: CalendarRange | null, event: MouseEvent<HTMLButtonElement>) => void }
  | { selectionMode: "multiple"; value?: readonly string[]; defaultValue?: readonly string[]; onValueChange?: (value: string[], event: MouseEvent<HTMLButtonElement>) => void };

export type CalendarProps = Omit<HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange"> & Selection & {
  /** Accessible name of the calendar group. */
  "aria-label"?: string;
  /** The floating plate (default), or plain inside a host that already draws one (a Popover, a Panel). */
  variant?: VariantProps<typeof MANIFESTS.calendar>["variant"];
  /** Day treatment: rounded squares, circles that mark available days, or outlined tiles. */
  days?: VariantProps<typeof MANIFESTS.calendar>["days"];
  /** A month grid, or a one-week strip. */
  layout?: VariantProps<typeof MANIFESTS.calendar>["layout"];
  /** Weekday names: one letter, two letters or the abbreviation. */
  weekdayStyle?: "narrow" | "short" | "abbreviated";
  /** Dots under days that carry something, such as events, by date. */
  markers?: Readonly<Record<string, CalendarMarkerTone>>;
  /** Visible month as "YYYY-MM". Controlled with `onMonthChange`. */
  month?: string;
  defaultMonth?: string;
  onMonthChange?: (month: string) => void;
  /** Months shown side by side. */
  visibleMonths?: 1 | 2;
  min?: string;
  max?: string;
  /** Dates that cannot be chosen, such as booked days. */
  isDateUnavailable?: (date: string) => boolean;
  /** 0 is Sunday. */
  firstDayOfWeek?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  /** Names for the navigation buttons, to localise them (audit H-27). */
  labels?: { previousMonth?: string; nextMonth?: string; previousWeek?: string; nextWeek?: string };
  /** The month titles' heading level (audit F-22). */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
  locale?: string;
  /** Show the leading and trailing days of neighbouring months. */
  showOutsideDays?: boolean;
  /** Always draw six weeks, so the height never changes between months. */
  fixedWeeks?: boolean;
  /** Today's date; defaults to the user's local date. */
  today?: string;
  name?: string;
  disabled?: boolean;
};

/** Month grid for choosing a date, a range or several dates, with the WAI-ARIA grid keyboard. */
export const Calendar = forwardRef<HTMLDivElement, CalendarProps>(function Calendar(props, ref) {
  const { selectionMode = "single", value, defaultValue, onValueChange, variant, days, layout = "month", weekdayStyle = "short", markers, month, defaultMonth, onMonthChange,
    visibleMonths = 1, min, max, isDateUnavailable, firstDayOfWeek = 0, headingLevel = 2, labels, locale = "en-US", showOutsideDays = true,
    fixedWeeks = false, today: todayProp, name, disabled, className, "aria-label": ariaLabel = "Calendar", ...rest } = props as CalendarProps & {
      selectionMode?: "single" | "range" | "multiple"; value?: unknown; defaultValue?: unknown; onValueChange?: (value: unknown, event: MouseEvent<HTMLButtonElement>) => void };
  const id = useId();
  // Today is read after mount so server and client render the same markup.
  const [clientToday, setClientToday] = useState<string | null>(null);
  useEffect(() => { if (!todayProp) setClientToday(toIso(new Date())); }, [todayProp]);
  const today = todayProp ?? clientToday;

  const [local, setLocal] = useState<unknown>(defaultValue ?? (selectionMode === "multiple" ? [] : null));
  const selected = value === undefined ? local : value;
  const initial = useRef(defaultValue ?? (selectionMode === "multiple" ? [] : null));
  const single = selectionMode === "single" ? selected as string | null : null;
  const range = selectionMode === "range" ? selected as CalendarRange | null : null;
  const many = selectionMode === "multiple" ? new Set(selected as readonly string[] ?? []) : null;

  const anchorDate = fromIso(single ?? range?.start ?? [...(many ?? [])][0] ?? today ?? "") ?? fromIso(`${month ?? defaultMonth ?? ""}-01`) ?? new Date(2026, 0, 1, 12);
  const [localMonth, setLocalMonth] = useState(() => monthStart(fromIso(`${defaultMonth}-01`) ?? anchorDate));
  const visible = month ? monthStart(fromIso(`${month}-01`) ?? localMonth) : localMonth;
  const [focused, setFocused] = useState<Date>(() => anchorDate);
  const week = layout === "week";
  const [localWeek, setLocalWeek] = useState(() => weekOf(anchorDate, firstDayOfWeek));
  const inView = (d: Date) => week ? d >= localWeek && d < addDays(localWeek, 7)
    : sameMonth(d, visible) || (visibleMonths === 2 && sameMonth(d, addMonths(visible, 1)));
  const selectedDate = fromIso(single ?? "");
  const focusDate = inView(focused) ? focused : selectedDate && inView(selectedDate) ? selectedDate : week ? localWeek : visible;
  const [pendingStart, setPendingStart] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const grid = useRef<HTMLDivElement | null>(null);
  const moveFocus = useRef(false);

  // A form reset returns an uncontrolled calendar to its first value, as the other pickers do (audit F-13).
  useEffect(() => {
    const form = grid.current?.closest("form");
    if (!form || value !== undefined) return;
    const reset = (event: Event) => queueMicrotask(() => { if (!event.defaultPrevented) { setLocal(initial.current); setPendingStart(null); } });
    form.addEventListener("reset", reset);
    return () => form.removeEventListener("reset", reset);
  }, [value]);

  const minDate = min ? fromIso(min) : null, maxDate = max ? fromIso(max) : null;
  const unavailable = (d: Date) => !!disabled || (minDate !== null && d < minDate && toIso(d) !== min) || (maxDate !== null && d > maxDate && toIso(d) !== max) || !!isDateUnavailable?.(toIso(d));

  const formatMonth = useMemo(() => new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }), [locale]);
  const formatDay = useMemo(() => new Intl.DateTimeFormat(locale, { weekday: "long", month: "long", day: "numeric", year: "numeric" }), [locale]);
  const weekdays = useMemo(() => {
    const short = new Intl.DateTimeFormat(locale, { weekday: "short" }), long = new Intl.DateTimeFormat(locale, { weekday: "long" });
    // 2026-09-06 is a Sunday.
    const narrow = new Intl.DateTimeFormat(locale, { weekday: "narrow" });
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(2026, 8, 6 + (i + firstDayOfWeek) % 7, 12);
      return { short: weekdayStyle === "narrow" ? narrow.format(d) : weekdayStyle === "abbreviated" ? short.format(d) : short.format(d).slice(0, 2), long: long.format(d) };
    });
  }, [locale, firstDayOfWeek, weekdayStyle]);
  const formatShortMonth = useMemo(() => new Intl.DateTimeFormat(locale, { month: "short" }), [locale]);

  useEffect(() => {
    if (!moveFocus.current) return;
    moveFocus.current = false;
    grid.current?.querySelector<HTMLButtonElement>(`[data-date="${toIso(focusDate)}"]`)?.focus();
  });

  function showWeek(next: Date) { setLocalWeek(weekOf(next, firstDayOfWeek)); }
  function showMonth(next: Date) {
    const start = monthStart(next);
    if (month === undefined) setLocalMonth(start);
    onMonthChange?.(`${start.getFullYear()}-${pad(start.getMonth() + 1)}`);
  }
  // A day is chosen by its button's click (Enter and Space click it too), so the event is that click (audit C-7).
  function commit(next: unknown, event: MouseEvent<HTMLButtonElement>) {
    if (value === undefined) setLocal(next);
    onValueChange?.(next, event);
  }
  function choose(d: Date, event: MouseEvent<HTMLButtonElement>) {
    if (unavailable(d)) return;
    const iso = toIso(d);
    setFocused(d);
    if (selectionMode === "single") { if (single !== iso) commit(iso, event); }
    else if (selectionMode === "multiple") {
      const next = new Set(many); if (next.has(iso)) next.delete(iso); else next.add(iso);
      commit([...next].sort(), event);
    } else if (!pendingStart) { setPendingStart(iso); setHovered(iso); }
    else {
      const [start, end] = [pendingStart, iso].sort() as [string, string];
      setPendingStart(null); setHovered(null);
      commit({ start, end }, event);
    }
  }
  function key(event: KeyboardEvent<HTMLButtonElement>, d: Date) {
    const weekStart = (d.getDay() - firstDayOfWeek + 7) % 7;
    const moves: Record<string, () => Date> = {
      ArrowLeft: () => addDays(d, getComputedStyle(event.currentTarget).direction === "rtl" ? 1 : -1),
      ArrowRight: () => addDays(d, getComputedStyle(event.currentTarget).direction === "rtl" ? -1 : 1),
      ArrowUp: () => addDays(d, -7), ArrowDown: () => addDays(d, 7),
      Home: () => addDays(d, -weekStart), End: () => addDays(d, 6 - weekStart),
      PageUp: () => addMonths(d, event.shiftKey ? -12 : -1), PageDown: () => addMonths(d, event.shiftKey ? 12 : 1),
    };
    if (event.key === "Escape" && pendingStart) { setPendingStart(null); setHovered(null); event.preventDefault(); return; }
    const move = moves[event.key];
    if (!move) return;
    event.preventDefault();
    let next = move();
    if (minDate && next < minDate) next = minDate;
    if (maxDate && next > maxDate) next = maxDate;
    setFocused(next);
    if (pendingStart) setHovered(toIso(next));
    const last = addMonths(visible, visibleMonths - 1);
    if (week) { if (!inView(next)) showWeek(next); }
    else if (next < visible) showMonth(next);
    else if (next > addDays(addMonths(last, 1), -1) && !sameMonth(next, last)) showMonth(addMonths(next, 1 - visibleMonths));
    moveFocus.current = true;
  }

  // An outside day that is chosen brings its month into view, so the choice is visible (audit F-10
  // A, owner 2026-09-30; react-day-picker, React Aria).
  function reveal(d: Date) {
    const last = addMonths(visible, visibleMonths - 1);
    if (week) { if (!inView(d)) showWeek(d); }
    else if (d < visible) showMonth(d);
    else if (d > addDays(addMonths(last, 1), -1)) showMonth(addMonths(d, 1 - visibleMonths));
    else return;
    moveFocus.current = true;
  }

  // Range shown while choosing the end: the anchor to the hovered or focused day.
  const preview = pendingStart && hovered ? [pendingStart, hovered].sort() as [string, string] : null;
  const shownRange = preview ?? (range ? [range.start, range.end] as [string, string] : null);

  const dayCell = (d: Date, outside: boolean, content: ReactNode) => {
    const iso = toIso(d);
    // Outside days repeat a neighbouring month's dates; only the owning month paints selection.
    const isSelected = !outside && (iso === single || !!many?.has(iso) || (!!shownRange && !preview && iso >= shownRange[0] && iso <= shownRange[1]) || iso === pendingStart);
    const inRange = !outside && !!shownRange && iso >= shownRange[0] && iso <= shownRange[1] && shownRange[0] !== shownRange[1];
    const isOff = unavailable(d);
    const tabbable = !outside && toIso(focusDate) === iso;
    const marker = markers?.[iso];
    return <td key={iso} role="gridcell" className="area-calendar__cell" aria-selected={isSelected || undefined} aria-disabled={isOff || undefined}
      data-range={inRange ? iso === shownRange![0] ? "start" : iso === shownRange![1] ? "end" : "middle" : undefined}>
      <button type="button" className="area-calendar__day" data-date={iso} tabIndex={tabbable ? 0 : -1} disabled={!!disabled}
        aria-disabled={(isOff && !disabled) || undefined}
        aria-label={formatDay.format(d)} aria-current={iso === today ? "date" : undefined} aria-description={marker ? "Has events" : undefined}
        data-outside={outside || undefined} data-today={iso === today || undefined}
        data-unavailable={(!disabled && isDateUnavailable?.(iso)) || undefined}
        data-selected={(isSelected && !(inRange && iso !== shownRange![0] && iso !== shownRange![1])) || undefined}
        onClick={event => { choose(d, event); if (outside && !unavailable(d)) reveal(d); }} onKeyDown={event => key(event, d)} onFocus={() => { if (pendingStart) setHovered(iso); }}
        onPointerEnter={() => { if (pendingStart) setHovered(iso); }}>
        {content}
        {marker && <span className="area-calendar__marker" data-tone={marker} aria-hidden="true" />}
      </button>
    </td>;
  };

  const renderWeek = () => {
    const label = `Week of ${formatDay.format(localWeek)}`;
    return <div className="area-calendar__week">
      <Button variant="ghost" size="sm" iconOnly icon={<Glyph name="chevron-down" rotate={90} />} aria-label={labels?.previousWeek ?? "Previous week"}
        disabled={disabled || (minDate !== null && localWeek <= minDate)} onClick={() => showWeek(addDays(localWeek, -7))} />
      <table className="area-calendar__grid" role="grid" aria-label={label} aria-multiselectable={selectionMode !== "single" || undefined}>
        <tbody><tr>{Array.from({ length: 7 }, (_, i) => {
          const d = addDays(localWeek, i);
          return dayCell(d, false, <>
            <span className="area-calendar__day-weekday">{weekdays[i]?.short}</span>
            <span className="area-calendar__day-number">{d.getDate()}</span>
            <span className="area-calendar__day-month">{formatShortMonth.format(d)}</span>
          </>);
        })}</tr></tbody>
      </table>
      <Button variant="ghost" size="sm" iconOnly icon={<Glyph name="chevron-down" rotate={270} />} aria-label={labels?.nextWeek ?? "Next week"}
        disabled={disabled || (maxDate !== null && addDays(localWeek, 6) >= maxDate)} onClick={() => showWeek(addDays(localWeek, 7))} />
    </div>;
  };

  const Heading = `h${headingLevel}` as "h2";
  const renderMonth = (first: Date, index: number) => {
    const offset = (first.getDay() - firstDayOfWeek + 7) % 7;
    const start = addDays(first, -offset);
    const daysInMonth = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate();
    const weeks = fixedWeeks ? 6 : Math.ceil((offset + daysInMonth) / 7);
    const labelId = `${id}-month-${index}`;
    return <div className="area-calendar__month" key={index}>
      <div className="area-calendar__header">
        {/* One announcement per change: only the first month title is live, so two months don't
            read out twice; the level is configurable (audit F-22). */}
        <Heading className="area-calendar__title" id={labelId} aria-live={index === 0 ? "polite" : undefined}>{formatMonth.format(first)}</Heading>
        <div className="area-calendar__nav">
          {index === 0 && <Button variant="ghost" size="sm" iconOnly icon={<Glyph name="chevron-down" rotate={90} />} aria-label={labels?.previousMonth ?? "Previous month"}
            disabled={disabled || (minDate !== null && monthStart(minDate) >= first)} onClick={() => showMonth(addMonths(visible, -1))} />}
          {index === visibleMonths - 1 && <Button variant="ghost" size="sm" iconOnly icon={<Glyph name="chevron-down" rotate={270} />} aria-label={labels?.nextMonth ?? "Next month"}
            disabled={disabled || (maxDate !== null && monthStart(maxDate) <= first)} onClick={() => showMonth(addMonths(visible, 1))} />}
        </div>
      </div>
      <table className="area-calendar__grid" role="grid" aria-labelledby={labelId} aria-multiselectable={selectionMode !== "single" || undefined}>
        <thead><tr>{weekdays.map(w => <th key={w.long} scope="col" abbr={w.long} className="area-calendar__weekday">{w.short}</th>)}</tr></thead>
        <tbody>{Array.from({ length: weeks }, (_, row) => <tr key={row}>{Array.from({ length: 7 }, (_, dayIndex) => {
          const d = addDays(start, row * 7 + dayIndex), outside = !sameMonth(d, first);
          if (outside && !showOutsideDays) return <td key={toIso(d)} role="gridcell" className="area-calendar__cell" />;
          return dayCell(d, outside, <span className="area-calendar__day-number">{d.getDate()}</span>);
        })}</tr>)}</tbody>
      </table>
    </div>;
  };

  return <div {...rest} ref={node => { grid.current = node; if (typeof ref === "function") ref(node); else if (ref) ref.current = node; }}
    role="group" aria-label={ariaLabel} aria-disabled={disabled || undefined} className={calendarVariants({ variant, days, layout }, className)}>
    {week ? renderWeek() : <div className="area-calendar__months">{Array.from({ length: visibleMonths }, (_, i) => renderMonth(addMonths(visible, i), i))}</div>}
    {name && selectionMode === "single" && <input type="hidden" name={name} value={single ?? ""} />}
    {name && selectionMode === "range" && <><input type="hidden" name={`${name}-start`} value={range?.start ?? ""} /><input type="hidden" name={`${name}-end`} value={range?.end ?? ""} /></>}
    {name && selectionMode === "multiple" && [...(many ?? [])].map(iso => <input key={iso} type="hidden" name={name} value={iso} />)}
  </div>;
});
