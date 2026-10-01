import { forwardRef, useId, useLayoutEffect, useRef, useState } from "react";
import type { ChangeEvent, HTMLAttributes, KeyboardEvent, ReactNode, TextareaHTMLAttributes } from "react";
import { composerVariants, type VariantProps, MANIFESTS } from "../variants.ts";
import { Button } from "./Button.tsx";
import { Glyph } from "./Glyph.tsx";

export interface ComposerProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange" | "onSubmit" | "defaultValue"> {
  layout?: VariantProps<typeof MANIFESTS.composer>["layout"];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string, event: ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit?: (value: string) => void;
  placeholder?: string;
  /** Names the message field ("Message"), through a visually hidden label. */
  "aria-label"?: string;
  /** @deprecated Name it with `aria-label` (audit S17: `label` is visible text; names are `aria-label`). */
  label?: string;
  disabled?: boolean;
  /**
   * A reply is on its way. The field stays editable and focused so the next prompt can be
   * drafted, Enter doesn't send, and the send action becomes Stop when `onStop` is given
   * (ChatGPT's pattern; audit S18). Without `onStop`, send is simply unavailable.
   */
  loading?: boolean;
  /** @deprecated Use `loading`. */
  busy?: boolean;
  /** Stops the pending reply. Shown in the send position while `loading`. */
  onStop?: () => void;
  /** Names the Stop Button. */
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
    placeholder = "Write a message…", label: labelProp, "aria-label": ariaLabel, disabled, loading: loadingProp, busy, onStop, stopLabel = "Stop", maxLength,
    leadingActions, trailingActions, mode, submitLabel = "Send message", submitPill, submitOnEnter = true, inputProps, onInputKeyDown,
    className, ...rest }, ref,
) {
  const loading = loadingProp ?? busy;
  const label = ariaLabel ?? labelProp ?? "Message";
  const [ownValue, setOwnValue] = useState(defaultValue);
  const text = value === undefined ? ownValue : value;
  const id = useId();
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  // Fit the height to the text. Wrapping depends on width too, so refit when the width
  // changes (a narrow first layout, a resized panel); height-only changes are ignored.
  useLayoutEffect(() => {
    const input = inputRef.current;
    if (!input) return;
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
  const submit = () => {
    if (disabled || loading || !text.trim()) return;
    onSubmit?.(text.trim());
    if (value === undefined) setOwnValue("");
  };
  const keyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    onInputKeyDown?.(event);
    if (event.defaultPrevented) return;
    if (event.key !== "Enter" || event.nativeEvent.isComposing || event.shiftKey) return;
    if (!submitOnEnter && !event.metaKey && !event.ctrlKey) return;
    event.preventDefault();
    submit();
  };
  // One Button element either way, so focus on send carries over to Stop and back.
  const stopping = loading && onStop && !disabled;
  const sendButton = <Button className="area-composer__submit" variant="solid" tone="neutral" size="md" iconOnly pill={submitPill}
    aria-label={stopping ? stopLabel : submitLabel} disabled={stopping ? false : disabled || loading || !text.trim()}
    onClick={stopping ? onStop : submit} icon={stopping ? <Glyph name="stop" filled /> : <Glyph name="arrow-up" />} />;
  return <div {...rest} className={composerVariants({ layout }, className)} data-disabled={disabled ? "" : undefined}
    data-loading={loading ? "" : undefined} aria-busy={loading || undefined}>
    <div className="area-composer__entry">
      {layout === "inline" && leadingActions && <div className="area-composer__actions area-composer__actions--leading">{leadingActions}</div>}
      <label htmlFor={id} className="area-sr-only">{label}</label>
      <textarea {...inputProps} id={id} ref={element => { inputRef.current = element; if (typeof ref === "function") ref(element); else if (ref) ref.current = element; }} className="area-composer__input" rows={layout === "inline" ? 1 : 2} value={text}
        onChange={change} onKeyDown={keyDown} placeholder={placeholder} disabled={disabled} maxLength={maxLength} />
      {layout === "inline" && <div className="area-composer__actions area-composer__actions--trailing">
        {mode}<span className="area-composer__extras">{trailingActions}</span>
        {sendButton}
      </div>}
    </div>
    {layout === "stacked" && <div className="area-composer__footer">
      <div className="area-composer__actions area-composer__actions--leading">{leadingActions}{mode}</div>
      <div className="area-composer__actions area-composer__actions--trailing">{trailingActions}
        {sendButton}
      </div>
    </div>}
  </div>;
});
