// Approval: an agent asks before it acts. Spec: docs/specs/approval.md.
import { forwardRef, useEffect, useId, useRef, useState } from "react";
import type { HTMLAttributes, KeyboardEvent, ReactNode } from "react";
import { approvalVariants } from "../variants.ts";
import { Glyph } from "./Glyph.tsx";
import { Kbd } from "./primitives.tsx";

export interface ApprovalOption {
  value: string;
  /** "Yes", "Yes, for this session", "No". */
  label: ReactNode;
  /** What the choice comes to, a line under its label (Claude Code's question options). */
  description?: ReactNode;
}

/** How long keys are ignored after the approval appears. */
const GUARD_MS = 500;

interface ApprovalBaseProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  /** What it wants to do: "Run this command?", "Edit button.css?". */
  title: ReactNode;
  /** Why, in a sentence. */
  description?: ReactNode;
  onChoose: (value: string) => void;
  /** Adds the field to say what to do instead; Enter sends it. */
  onInstead?: (text: string) => void;
  insteadPlaceholder?: string;
  /** Escape: the same as the last option, by default. */
  onDismiss?: () => void;
  /** What Escape does, in the hint: "Esc to cancel" (default), "Esc to skip". */
  dismissLabel?: string;
  /** The answer already given, when a question is asked again: its row is marked chosen, with a check. */
  value?: string;
  /** The choice under the pointer or keyboard focus, or undefined once neither is on a choice: a preview of it. */
  onActiveChange?: (value: string | undefined) => void;
  /** At the end of the head, on the title's row: where it is among several questions (a compact Pagination), a close. */
  actions?: ReactNode;
  /** At the end of the hint's row: the way on when the answer is not one of the choices (Back, Skip, Continue). */
  footer?: ReactNode;
  /** Focus the first choice when it appears: set it where the approval takes the composer's place, so the keys work
   *  at once. Off by default, so a page of approvals does not move focus. */
  autoFocus?: boolean;
  /** The thing itself: a command in a Code block, a Diff. */
  children?: ReactNode;
}

export type ApprovalProps = ApprovalBaseProps & (
  | {
    /** Numbered choices, most permissive yes last before no (Claude Code, Codex). */
    items: ApprovalOption[];
    options?: undefined;
  }
  | {
    items?: undefined;
    /** @deprecated Use `items` (a collection is `items`, Governance § 4). Kept for one release. */
    options: ApprovalOption[];
  }
);

/**
 * Takes the composer's place until answered: ArrowUp / ArrowDown move between the choices, 1–9 choose, Escape
 * dismisses, Enter in the field sends what to do instead. With `autoFocus` the first choice takes focus when it appears.
 */
export const Approval = forwardRef<HTMLElement, ApprovalProps>(function Approval(
  { title, description, items: itemsProp, options: optionsProp, onChoose, onInstead, insteadPlaceholder = "Tell it what to do instead", onDismiss, dismissLabel = "cancel",
    value, onActiveChange, actions, footer, autoFocus = false, children, className, onKeyDown, ...rest }, ref,
) {
  const options = itemsProp ?? optionsProp ?? [];
  const titleId = useId();
  const optionId = useId();
  // The choice under the pointer, else the one with focus: the pointer wins while it is over a row, as a menu's does.
  const pointed = useRef<string | undefined>(undefined);
  const focused = useRef<string | undefined>(undefined);
  const reported = useRef<string | undefined>(undefined);
  const report = () => {
    const next = pointed.current ?? focused.current;
    if (next === reported.current) return;
    reported.current = next;
    onActiveChange?.(next);
  };
  const list = useRef<HTMLDivElement>(null);
  // Keys pressed as it appears were meant for what it replaced (the composer): for a moment they answer nothing, so an
  // Enter that was sending a message cannot approve an edit (browser check 2026-10-19).
  const shownAt = useRef(0);
  useEffect(() => { shownAt.current = Date.now(); }, []);
  const settling = () => Date.now() - shownAt.current < GUARD_MS;
  const [instead, setInstead] = useState("");
  const keys = (event: KeyboardEvent<HTMLElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;
    const target = event.target as HTMLElement;
    const inField = target.classList.contains("area-approval__field");
    // A control in the detail or the footer (a slider, a swatch picker, a button) keeps its own arrows and keys; the
    // digits still choose, unless it takes text.
    const inList = Boolean(list.current?.contains(target));
    const takesText = target.matches("input:not([type=range], [type=radio], [type=checkbox], [type=button]), textarea, [contenteditable=true]");
    if (settling() && (event.key === "Enter" || event.key === " " || event.key === "Escape" || /^[1-9]$/.test(event.key))) { event.preventDefault(); return; }
    if (event.key === "Escape") { event.preventDefault(); const last = options.at(-1); if (onDismiss) onDismiss(); else if (last) onChoose(last.value); return; }
    if (!inList && (takesText || event.key === "ArrowDown" || event.key === "ArrowUp")) return;
    if (inField) {
      if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    }
    // The choices and the field, in order: the arrows move through all of them.
    const buttons = [...(list.current?.querySelectorAll<HTMLElement>("button.area-approval__option, .area-approval__field") ?? [])];
    const index = buttons.indexOf(document.activeElement as HTMLElement);
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const next = event.key === "ArrowDown" ? (index + 1) % buttons.length : (index - 1 + buttons.length) % buttons.length;
      buttons[next]?.focus();
    } else if (/^[1-9]$/.test(event.key) && !event.metaKey && !event.ctrlKey && !event.altKey) {
      const option = options[Number(event.key) - 1];
      if (option) { event.preventDefault(); onChoose(option.value); }
      else if (onInstead && Number(event.key) === options.length + 1) { event.preventDefault(); list.current?.querySelector<HTMLInputElement>(".area-approval__field")?.focus(); }
    }
  };
  // What to do instead is the last choice (Claude Code's): its number focuses the field, and Enter sends it.
  const insteadKey = onInstead && options.length < 9 ? String(options.length + 1) : undefined;
  return (
    <section ref={ref} className={approvalVariants({}, className)} aria-labelledby={titleId} onKeyDown={keys} {...rest}>
      <div className="area-approval__head">
        <div className="area-approval__heading">
          <p id={titleId} className="area-approval__title">{title}</p>
          {description ? <p className="area-approval__description">{description}</p> : null}
        </div>
        {actions ? <div className="area-approval__actions">{actions}</div> : null}
      </div>
      {children ? <div className="area-approval__detail">{children}</div> : null}
      {options.length || onInstead ? <div ref={list} className="area-approval__options" role="group" aria-labelledby={titleId}
        onPointerLeave={() => { pointed.current = undefined; report(); }}
        onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) { focused.current = undefined; report(); } }}>
        {options.map((option, index) => {
          const chosen = value !== undefined && option.value === value;
          return (
            <button key={option.value} type="button" className="area-approval__option" autoFocus={autoFocus && index === 0} onClick={event => { if (event.detail === 0 && settling()) return; onChoose(option.value); }}
              aria-keyshortcuts={index < 9 ? String(index + 1) : undefined} aria-current={chosen ? "true" : undefined} data-selected={chosen ? "" : undefined}
              aria-describedby={option.description ? `${optionId}-${index}` : undefined}
              onPointerEnter={() => { pointed.current = option.value; report(); }}
              onFocus={() => { focused.current = option.value; report(); }}>
              <span className="area-approval__key" aria-hidden="true">{index < 9 ? <Kbd keys={[String(index + 1)]} size="sm" /> : null}</span>
              {option.description ? (
                <span className="area-approval__lines">
                  <span className="area-approval__label">{option.label}</span>
                  <span id={`${optionId}-${index}`} className="area-approval__option-description">{option.description}</span>
                </span>
              ) : <span className="area-approval__label">{option.label}</span>}
              {value !== undefined ? <span className="area-approval__check" aria-hidden="true"><Glyph name="check" /></span> : null}
            </button>
          );
        })}
        {onInstead ? (
          <label className="area-approval__option area-approval__instead">
            <span className="area-approval__key" aria-hidden="true">{insteadKey ? <Kbd keys={[insteadKey]} size="sm" /> : null}</span>
            <input className="area-approval__field" type="text" aria-label={insteadPlaceholder} placeholder={insteadPlaceholder} value={instead}
              aria-keyshortcuts={insteadKey}
              onChange={event => setInstead(event.currentTarget.value)}
              onKeyDown={event => { if (event.key === "Enter" && instead.trim()) { event.preventDefault(); onInstead(instead.trim()); setInstead(""); } }} />
          </label>
        ) : null}
      </div> : null}
      <div className="area-approval__foot">
        <p className="area-approval__hint"><Kbd keys={["Esc"]} size="sm" />{` to ${dismissLabel}`}</p>
        {footer ? <div className="area-approval__footer">{footer}</div> : null}
      </div>
    </section>
  );
});
