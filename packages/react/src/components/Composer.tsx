import { forwardRef, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import type { ChangeEvent, HTMLAttributes, KeyboardEvent, ReactNode, TextareaHTMLAttributes } from "react";
import { composerVariants, type VariantProps, MANIFESTS } from "../variants.ts";
import { Button } from "./Button.tsx";
import { Glyph } from "./Glyph.tsx";

export interface ComposerProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange" | "onSubmit" | "defaultValue"> {
  layout?: VariantProps<typeof MANIFESTS.composer>["layout"];
  value?: string;
  defaultValue?: string;
  /** The draft text, and the change event that produced it (audit C-7). */
  onValueChange?: (value: string, event: ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit?: (value: string) => void;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  /**
   * A reply is streaming: the field stays editable and focused so the next prompt can be
   * drafted, Enter doesn't send, and send turns into Stop (ChatGPT's behaviour; audit S18).
   */
  loading?: boolean;
  /** @deprecated Use `loading`. */
  busy?: boolean;
  /** Called by the Stop button while `loading`. */
  onStop?: () => void;
  /** Names the Stop button. */
  stopLabel?: string;
  maxLength?: number;
  leadingActions?: ReactNode;
  trailingActions?: ReactNode;
  mode?: ReactNode;
  submitLabel?: string;
  /** A round send button (ChatGPT's); the composer's corner follows it to a pill. */
  submitPill?: boolean;
  /** Enter submits; Shift+Enter inserts a newline. Meta/Ctrl+Enter always submits. */
  submitOnEnter?: boolean;
  inputProps?: Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "value" | "defaultValue" | "onChange" | "onKeyDown" | "rows" | "disabled" | "placeholder" | "maxLength">;
  onInputKeyDown?: (event: KeyboardEvent<HTMLTextAreaElement>) => void;
}

/** Message entry with native multiline editing and separate action and mode slots. */
export const Composer = forwardRef<HTMLTextAreaElement, ComposerProps>(function Composer(
  { layout = "inline", value, defaultValue = "", onValueChange, onSubmit,
    placeholder = "Write a message…", label = "Message", disabled, loading: loadingProp, busy, onStop, stopLabel = "Stop", maxLength,
    leadingActions, trailingActions, mode, submitLabel = "Send message", submitPill, submitOnEnter = true, inputProps, onInputKeyDown,
    className, ...rest }, ref,
) {
  const loading = loadingProp ?? busy;
  const [ownValue, setOwnValue] = useState(defaultValue);
  const text = value === undefined ? ownValue : value;
  const id = useId();
  // A consumer's inputProps.id wins over the generated one (audit G-15).
  const inputId = inputProps?.id ?? id;
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  // Fit the height to the text. Where the browser sizes fields natively (field-sizing:
  // content, composer.css) it also refits on font and density changes, so no script runs.
  // Elsewhere, measure; wrapping depends on width too, so refit when the width changes (a
  // narrow first layout, a resized panel); height-only changes are ignored.
  useLayoutEffect(() => {
    const input = inputRef.current;
    if (!input) return;
    if (typeof CSS !== "undefined" && CSS.supports?.("field-sizing: content")) {
      input.style.blockSize = "";
      return;
    }
    const fit = () => {
      input.style.blockSize = "auto";
      input.style.blockSize = `${input.scrollHeight}px`;
    };
    fit();
    if (typeof ResizeObserver === "undefined") return;
    let width = input.clientWidth;
    const observer = new ResizeObserver(() => {
      if (input.clientWidth === width) return;
      width = input.clientWidth;
      fit();
    });
    observer.observe(input);
    return () => observer.disconnect();
  }, [text, layout]);
  const change = (event: ChangeEvent<HTMLTextAreaElement>) => {
    if (value === undefined) setOwnValue(event.target.value);
    onValueChange?.(event.target.value, event);
  };
  // Leading blank lines and trailing whitespace go; a pasted block keeps its indentation (audit G-15).
  const submit = () => {
    if (disabled || loading || !text.trim()) return;
    onSubmit?.(text.replace(/^\s*\n/, "").trimEnd());
    if (value === undefined) setOwnValue("");
  };
  // A form reset clears an uncontrolled composer, as the native textarea would (audit G-15).
  useEffect(() => {
    const owner = inputRef.current?.form;
    if (!owner || value !== undefined) return;
    const reset = (event: Event) => queueMicrotask(() => { if (!event.defaultPrevented) setOwnValue(defaultValue); });
    owner.addEventListener("reset", reset);
    return () => owner.removeEventListener("reset", reset);
  }, [value, defaultValue]);
  const keyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    onInputKeyDown?.(event);
    if (event.defaultPrevented) return;
    // Safari can deliver the Enter that commits an IME candidate after compositionend, with
    // isComposing false but keyCode 229 (audit G-15).
    if (event.key !== "Enter" || event.nativeEvent.isComposing || event.keyCode === 229 || event.shiftKey) return;
    if (!submitOnEnter && !event.metaKey && !event.ctrlKey) return;
    event.preventDefault();
    submit();
  };
  // While loading the send slot is Stop: same Button, so the slot doesn't move or change paint.
  const sendButton = loading && !disabled
    ? <Button className="area-composer__submit" variant="solid" tone="neutral" size="md" iconOnly pill={submitPill}
      aria-label={stopLabel} disabled={!onStop} onClick={onStop} icon={<Glyph name="stop" />} />
    : <Button className="area-composer__submit" variant="solid" tone="neutral" size="md" iconOnly pill={submitPill}
      aria-label={submitLabel} disabled={disabled || loading || !text.trim()} onClick={submit} icon={<Glyph name="arrow-up" />} />;
  return <div {...rest} className={composerVariants({ layout }, className)} data-disabled={disabled ? "" : undefined} aria-busy={loading || undefined}>
    <div className="area-composer__entry">
      {/* A fieldset disables every nested action natively when the composer is disabled (audit G-14). */}
      {layout === "inline" && leadingActions && <fieldset disabled={disabled} className="area-composer__actions area-composer__actions--leading">{leadingActions}</fieldset>}
      <label htmlFor={inputId} className="area-sr-only">{label}</label>
      <textarea {...inputProps} id={inputId} ref={element => { inputRef.current = element; if (typeof ref === "function") ref(element); else if (ref) ref.current = element; }} className="area-composer__input" rows={layout === "inline" ? 1 : 2} value={text}
        onChange={change} onKeyDown={keyDown} placeholder={placeholder} disabled={disabled} maxLength={maxLength} />
      {layout === "inline" && <fieldset disabled={disabled} className="area-composer__actions area-composer__actions--trailing">
        {mode}<span className="area-composer__extras">{trailingActions}</span>
        {sendButton}
      </fieldset>}
    </div>
    {layout === "stacked" && <div className="area-composer__footer">
      <fieldset disabled={disabled} className="area-composer__actions area-composer__actions--leading">{leadingActions}{mode}</fieldset>
      <fieldset disabled={disabled} className="area-composer__actions area-composer__actions--trailing">{trailingActions}
        {sendButton}
      </fieldset>
    </div>}
  </div>;
});
