// TimeField: a time of day typed in segments (hour, minute, optional second, AM/PM) in Input's shell, with an
// optional list of times at a fixed step. Spec: docs/specs/time-field.md.
import { forwardRef, useEffect, useId, useMemo, useRef, useState } from "react";
import type { HTMLAttributes, KeyboardEvent, ReactNode, SyntheticEvent } from "react";
import { cx, timeFieldVariants, type VariantProps, MANIFESTS } from "../variants.ts";
import { inputVariants } from "./Input.tsx";
import { Glyph } from "./Glyph.tsx";
import { Menu, MenuItem } from "./primitives.tsx";
import { scrollOptionIntoList, useOpenState } from "./overlay.ts";
import { resolveValidation, validationAttributes, type ValidationStatus } from "./validation.ts";

type InputManifest = VariantProps<typeof MANIFESTS.input>;

export interface TimeFieldProps extends Omit<HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange"> {
  /** The time as "HH:MM" or "HH:MM:SS", 24-hour (controlled); null while incomplete. */
  value?: string | null;
  defaultValue?: string | null;
  /** Each time the time becomes complete, changes, or is cleared (null), with the key or click that did it. */
  onValueChange?: (value: string | null, event: SyntheticEvent) => void;
  /** 12 or 24 hours; the locale's by default (Intl hourCycle). */
  hourCycle?: 12 | 24;
  /** Minutes (default) or seconds. */
  granularity?: "minute" | "second";
  /** Offer a list of times this many minutes apart (ChatGPT's 15), from a trailing chevron. */
  step?: number;
  /** A leading glyph; `true` draws the clock. */
  icon?: ReactNode | true;
  locale?: string;
  variant?: InputManifest["variant"];
  size?: InputManifest["size"];
  disabled?: boolean;
  readOnly?: boolean;
  invalid?: boolean;
  /** Semantic validation paint, as Input's: `error` (also `invalid`), `success` or `warning`. A Field passes its own. */
  validationStatus?: ValidationStatus;
  /** Internal Field-to-control validation bridge; plain HTML uses the matching data attribute. */
  "data-validation-status"?: ValidationStatus;
  /** The list of times (with `step`) is open (controlled); `defaultOpen` opens it at first; `onOpenChange` hears it open and close. */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Submits the value under this name. */
  name?: string;
  /** Names of the list's trigger. */
  listLabel?: string;
}

type Kind = "hour" | "minute" | "second" | "period";
type Parts = { hour: number | null; minute: number | null; second: number | null; period: 0 | 1 };

const pad = (n: number) => String(n).padStart(2, "0");
const parse = (text: string | null | undefined): Parts | null => {
  const match = /^(\d{1,2}):(\d{2})(?::(\d{2}))?$/.exec(text ?? "");
  if (!match) return null;
  const hour = Number(match[1]), minute = Number(match[2]), second = match[3] ? Number(match[3]) : 0;
  if (hour > 23 || minute > 59 || second > 59) return null;
  return { hour, minute, second, period: hour >= 12 ? 1 : 0 };
};
const EMPTY: Parts = { hour: null, minute: null, second: null, period: 0 };
const localeCycle = (locale?: string): 12 | 24 => {
  try {
    const cycle = new Intl.DateTimeFormat(locale, { hour: "numeric" }).resolvedOptions().hourCycle;
    return cycle === "h11" || cycle === "h12" ? 12 : 24;
  } catch { return 12; }
};
// The 24-hour value from the parts, or null while a segment is empty.
const toValue = (parts: Parts, seconds: boolean) =>
  parts.hour === null || parts.minute === null || (seconds && parts.second === null) ? null
    : `${pad(parts.hour)}:${pad(parts.minute)}${seconds ? `:${pad(parts.second ?? 0)}` : ""}`;
// "9:00 AM" / "09:00", the list's rows (ChatGPT's format).
const label = (hour: number, minute: number, cycle: 12 | 24) =>
  cycle === 24 ? `${pad(hour)}:${pad(minute)}` : `${hour % 12 || 12}:${pad(minute)} ${hour >= 12 ? "PM" : "AM"}`;

const NAMES: Record<Kind, string> = { hour: "Hour", minute: "Minute", second: "Second", period: "AM/PM" };

/**
 * A time of day as segments, each its own spin button (React Aria, Spectrum 2, MUI X, Mantine): Up and Down step
 * by one and wrap, Page Up and Down step by 2 hours or 15 minutes, Home and End go to the ends, digits fill the
 * segment and move on once no other digit could follow, Backspace clears it and then moves back, Left and Right
 * move between segments, and A or P sets the period. Empty segments show "––" (React Aria). With `step`, a
 * trailing chevron (out of the Tab order, as Combobox's) or Alt+Down opens the times `step` minutes apart, the current
 * one checked and in view (ChatGPT's task schedule: 15 minutes, a check on the choice).
 */
export const TimeField = /* @__PURE__ */ forwardRef<HTMLDivElement, TimeFieldProps>(function TimeField(
  { value, defaultValue = null, onValueChange, hourCycle, granularity = "minute", step, icon, locale, variant, size, disabled, readOnly,
    invalid: invalidProp, validationStatus, name, listLabel = "Choose a time", open: openProp, defaultOpen, onOpenChange, className, style, id: idProp,
    "aria-label": ariaLabel, "aria-labelledby": labelledBy, "aria-invalid": ariaInvalid, "data-validation-status": fieldStatus, ...rest },
  ref,
) {
  // A Field around it passes aria-invalid (its error) and its status; `invalid` and `validationStatus` say the same directly.
  const { invalid, status } = resolveValidation({ validationStatus, invalid: invalidProp, ariaInvalid, fieldStatus });
  const cycle = hourCycle ?? localeCycle(locale);
  const seconds = granularity === "second";
  const [parts, setParts] = useState<Parts>(() => parse(value ?? defaultValue) ?? EMPTY);
  // A controlled value replaces the parts; an incomplete edit keeps its segments until it completes or is cleared.
  const lastValue = useRef(value);
  useEffect(() => {
    if (value === undefined || value === lastValue.current) return;
    lastValue.current = value;
    setParts(parse(value) ?? EMPTY);
  }, [value]);
  const autoId = useId();
  const id = idProp ?? autoId;
  const segmentRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const typed = useRef<{ kind: Kind | null; text: string }>({ kind: null, text: "" });
  const [open, setOpen] = useOpenState(openProp, defaultOpen, onOpenChange);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const commit = (next: Parts, event: SyntheticEvent) => {
    setParts(next);
    const before = toValue(parts, seconds);
    const after = toValue(next, seconds);
    if (before !== after) {
      lastValue.current = after;
      onValueChange?.(after, event);
    }
  };

  const kinds: Kind[] = ["hour", "minute", ...(seconds ? ["second" as const] : []), ...(cycle === 12 ? ["period" as const] : [])];
  // The hour as shown: 1-12 with the period, or 0-23.
  const shownHour = (hour: number | null) => hour === null ? null : cycle === 12 ? hour % 12 || 12 : hour;
  const range = (kind: Kind): [number, number] => kind === "hour" ? (cycle === 12 ? [1, 12] : [0, 23]) : kind === "period" ? [0, 1] : [0, 59];
  const shownOf = (kind: Kind) => kind === "hour" ? shownHour(parts.hour) : kind === "period" ? parts.period : parts[kind];
  // From the shown hour back to 0-23.
  const withShown = (kind: Kind, shown: number | null, base = parts): Parts => {
    if (kind === "hour") {
      if (shown === null) return { ...base, hour: null };
      const hour = cycle === 12 ? (shown % 12) + base.period * 12 : shown;
      return { ...base, hour };
    }
    if (kind === "period") {
      const period = (shown ?? 0) as 0 | 1;
      return { ...base, period, hour: base.hour === null ? null : (base.hour % 12) + period * 12 };
    }
    return { ...base, [kind]: shown };
  };

  const focusSegment = (index: number) => segmentRefs.current[Math.max(0, Math.min(kinds.length - 1, index))]?.focus();

  const onSegmentKey = (kind: Kind, index: number) => (event: KeyboardEvent<HTMLSpanElement>) => {
    if (disabled) return;
    // Alt+Down opens the list from the field, as Combobox's does; its chevron stays out of the Tab order.
    if (event.altKey && event.key === "ArrowDown" && times.length && !readOnly) { event.preventDefault(); setOpen(true); return; }
    const [min, max] = range(kind);
    const span = max - min + 1;
    const current = shownOf(kind);
    const wrap = (n: number) => ((((n - min) % span) + span) % span) + min;
    // An empty segment starts from the placeholder's value: 12 AM, :00 (React Aria).
    const start = current ?? (kind === "hour" && cycle === 12 ? 12 : min);
    let next: number | null | undefined;
    switch (event.key) {
      case "ArrowUp": next = current === null ? start : wrap(current + 1); break;
      case "ArrowDown": next = current === null ? start : wrap(current - 1); break;
      case "PageUp": next = current === null ? start : wrap(current + (kind === "hour" ? 2 : kind === "period" ? 1 : 15)); break;
      case "PageDown": next = current === null ? start : wrap(current - (kind === "hour" ? 2 : kind === "period" ? 1 : 15)); break;
      case "Home": next = min; break;
      case "End": next = max; break;
      case "ArrowLeft": event.preventDefault(); focusSegment(index - 1); return;
      case "ArrowRight": event.preventDefault(); focusSegment(index + 1); return;
      case "Backspace":
      case "Delete": {
        event.preventDefault();
        if (readOnly) return;
        const buffer = typed.current.kind === kind ? typed.current.text : "";
        if (buffer.length > 1) {
          typed.current = { kind, text: buffer.slice(0, -1) };
          commit(withShown(kind, Number(typed.current.text)), event);
        } else if (current !== null && kind !== "period") {
          typed.current = { kind: null, text: "" };
          commit(withShown(kind, null), event);
        } else if (event.key === "Backspace") {
          focusSegment(index - 1);
        }
        return;
      }
      default:
        if (readOnly || event.ctrlKey || event.metaKey || event.altKey) return;
        if (kind === "period") {
          const key = event.key.toLowerCase();
          if (key === "a" || key === "p") { event.preventDefault(); commit(withShown("period", key === "a" ? 0 : 1), event); focusSegment(index + 1); }
          return;
        }
        if (!/^\d$/.test(event.key)) return;
        event.preventDefault();
        {
          const prev = typed.current.kind === kind ? typed.current.text : "";
          let text = prev + event.key;
          if (Number(text) > max || text.length > 2) text = event.key;
          typed.current = { kind, text };
          const number = Number(text);
          // "0" in a 12-hour field waits for the next digit (01-09); otherwise it is the value.
          if (!(kind === "hour" && cycle === 12 && number === 0)) commit(withShown(kind, number), event);
          // Move on once no further digit could follow.
          if (text.length === 2 || number * 10 > max) { typed.current = { kind: null, text: "" }; focusSegment(index + 1); }
        }
        return;
    }
    event.preventDefault();
    if (readOnly) return;
    typed.current = { kind: null, text: "" };
    commit(withShown(kind, next ?? null), event);
  };

  // The list: every `step` minutes from midnight.
  const times = useMemo(() => {
    if (!step || step <= 0) return [];
    const out: { hour: number; minute: number }[] = [];
    for (let t = 0; t < 24 * 60; t += step) out.push({ hour: Math.floor(t / 60), minute: t % 60 });
    return out;
  }, [step]);
  const current = toValue(parts, false);
  // On open, the current time is focused and in view rather than midnight.
  useEffect(() => {
    if (!open) return;
    // Two frames: Menu puts focus on its surface or first row as it opens; this follows it.
    let frame = requestAnimationFrame(() => { frame = requestAnimationFrame(() => {
      const menu = menuRef.current;
      const checked = menu?.querySelector<HTMLElement>('[aria-checked="true"]');
      if (!menu || !checked) return;
      // Centred in the list (ChatGPT opens with the chosen time mid-list), then focused without a jump.
      const viewport = checked.closest<HTMLElement>(".area-scroll-area__viewport");
      if (viewport) {
        const box = viewport.getBoundingClientRect(), item = checked.getBoundingClientRect();
        // Rects are viewport pixels and scrollTop the scroller's own; they differ under CSS zoom (overlay.ts).
        const zoom = (viewport as HTMLElement & { currentCSSZoom?: number }).currentCSSZoom || 1;
        viewport.scrollTop += (item.top - box.top - (box.height - item.height) / 2) / zoom;
      } else scrollOptionIntoList(menu, checked);
      checked.focus({ preventScroll: true });
    }); });
    return () => cancelAnimationFrame(frame);
  }, [open]);

  const glyph = icon === true ? <Glyph name="clock" /> : icon;
  const placeholderOf = (kind: Kind) => kind === "period" ? "AM" : "––";
  const textOf = (kind: Kind) => {
    const shown = shownOf(kind);
    if (kind === "period") return parts.period ? "PM" : "AM";
    if (shown === null) return placeholderOf(kind);
    return kind === "hour" && cycle === 12 ? String(shown) : pad(shown);
  };
  const hasValue = (kind: Kind) => kind === "period" ? parts.hour !== null : shownOf(kind) !== null;

  return (
    <div
      ref={ref}
      {...rest}
      id={id}
      role="group"
      aria-label={ariaLabel}
      aria-labelledby={labelledBy}
      aria-disabled={disabled || undefined}
      className={cx(inputVariants({ variant, size }), timeFieldVariants({}, className))}
      style={style}
      {...validationAttributes(status)}
      {...(disabled ? { "data-disabled": "" } : {})}
      {...(readOnly ? { "data-read-only": "" } : {})}
    >
      {glyph ? <span className="area-input__icon" aria-hidden="true">{glyph}</span> : null}
      <span className="area-time-field__segments">
        {kinds.map((kind, index) => {
          const [min, max] = range(kind);
          const shown = shownOf(kind);
          return (
            <span key={kind} className="area-time-field__part">
              {index > 0 && kind !== "period" ? <span className="area-time-field__literal" aria-hidden="true">:</span> : null}
              {kind === "period" ? <span className="area-time-field__literal" aria-hidden="true">{" "}</span> : null}
              <span
                ref={node => { segmentRefs.current[index] = node; }}
                role="spinbutton"
                tabIndex={disabled ? -1 : 0}
                className={cx("area-time-field__segment", kind === "period" && "area-time-field__period")}
                data-placeholder={hasValue(kind) ? undefined : ""}
                id={`${id}-${kind}`}
                aria-label={NAMES[kind]}
                // With a visible label, each segment reads "Start time, Hour" (React Aria: VoiceOver on iOS skips the group).
                aria-labelledby={labelledBy ? `${labelledBy} ${id}-${kind}` : undefined}
                aria-valuemin={min}
                aria-valuemax={max}
                aria-valuenow={kind === "period" ? parts.period : shown ?? undefined}
                aria-valuetext={kind === "period" ? (parts.period ? "PM" : "AM") : shown === null ? "Empty" : String(shown)}
                aria-disabled={disabled || undefined}
                aria-readonly={readOnly || undefined}
                aria-invalid={invalid || undefined}
                inputMode={kind === "period" ? "text" : "numeric"}
                onKeyDown={onSegmentKey(kind, index)}
                onFocus={() => { typed.current = { kind: null, text: "" }; }}
              >
                {textOf(kind)}
              </span>
            </span>
          );
        })}
      </span>
      {name ? <input type="hidden" name={name} value={toValue(parts, seconds) ?? ""} /> : null}
      {times.length && !disabled && !readOnly ? (
        <span className="area-input__action">
          <Menu
            ref={menuRef}
            open={open}
            onOpenChange={setOpen}
            align="end"
            className="area-time-field__list"
            aria-label={listLabel}
            tooltip={listLabel}
            trigger={<button type="button" className="area-input__action-button area-time-field__trigger" aria-label={listLabel} tabIndex={-1}>
              <span className="area-input__action-icon" aria-hidden="true"><Glyph name="chevron-down" /></span>
            </button>}
          >
            {times.map(time => {
              const text = label(time.hour, time.minute, cycle);
              const at = `${pad(time.hour)}:${pad(time.minute)}`;
              return (
                <MenuItem key={at} radio checked={current === at}
                  onClick={event => { typed.current = { kind: null, text: "" }; commit({ hour: time.hour, minute: time.minute, second: 0, period: time.hour >= 12 ? 1 : 0 }, event); }}>
                  {text}
                </MenuItem>
              );
            })}
          </Menu>
        </span>
      ) : null}
    </div>
  );
});
