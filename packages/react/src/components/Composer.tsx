import { forwardRef, useId, useLayoutEffect, useRef, useState } from "react";
import type { ChangeEvent, HTMLAttributes, KeyboardEvent, ReactNode, TextareaHTMLAttributes } from "react";
import { composerVariants, type VariantProps, MANIFESTS } from "../variants.ts";
import { Glyph } from "./Glyph.tsx";

export interface ComposerProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange" | "onSubmit" | "defaultValue"> {
  layout?: VariantProps<typeof MANIFESTS.composer>["layout"];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  busy?: boolean;
  maxLength?: number;
  leadingActions?: ReactNode;
  trailingActions?: ReactNode;
  mode?: ReactNode;
  submitLabel?: string;
  /** Enter submits; Shift+Enter inserts a newline. Meta/Ctrl+Enter always submits. */
  submitOnEnter?: boolean;
  inputProps?: Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "value" | "defaultValue" | "onChange" | "onKeyDown" | "rows" | "disabled" | "placeholder" | "maxLength">;
  onInputKeyDown?: (event: KeyboardEvent<HTMLTextAreaElement>) => void;
}

/** Message entry with native multiline editing and separate action and mode slots. */
export const Composer = forwardRef<HTMLTextAreaElement, ComposerProps>(function Composer(
  { layout = "inline", value, defaultValue = "", onValueChange, onSubmit,
    placeholder = "Write a message…", label = "Message", disabled, busy, maxLength,
    leadingActions, trailingActions, mode, submitLabel = "Send message", submitOnEnter = true, inputProps, onInputKeyDown,
    className, ...rest }, ref,
) {
  const [ownValue, setOwnValue] = useState(defaultValue);
  const text = value === undefined ? ownValue : value;
  const id = useId();
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  useLayoutEffect(() => {
    const input = inputRef.current;
    if (!input) return;
    input.style.blockSize = "auto";
    input.style.blockSize = `${input.scrollHeight}px`;
  }, [text, layout]);
  const change = (event: ChangeEvent<HTMLTextAreaElement>) => {
    if (value === undefined) setOwnValue(event.target.value);
    onValueChange?.(event.target.value);
  };
  const submit = () => {
    if (disabled || busy || !text.trim()) return;
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
  return <div {...rest} className={composerVariants({ layout }, className)} data-disabled={disabled ? "" : undefined} data-busy={busy ? "" : undefined}>
    <div className="area-composer__entry">
      {layout === "inline" && leadingActions && <div className="area-composer__actions area-composer__actions--leading">{leadingActions}</div>}
      <label htmlFor={id} className="area-sr-only">{label}</label>
      <textarea {...inputProps} id={id} ref={element => { inputRef.current = element; if (typeof ref === "function") ref(element); else if (ref) ref.current = element; }} className="area-composer__input" rows={layout === "inline" ? 1 : 2} value={text}
        onChange={change} onKeyDown={keyDown} placeholder={placeholder} disabled={disabled || busy} maxLength={maxLength} />
      {layout === "inline" && <div className="area-composer__actions area-composer__actions--trailing">
        {mode}<span className="area-composer__extras">{trailingActions}</span>
        <button type="button" className="area-composer__submit" aria-label={submitLabel} disabled={disabled || busy || !text.trim()} onClick={submit}>
          <Glyph name="arrow-up" />
        </button>
      </div>}
    </div>
    {layout === "stacked" && <div className="area-composer__footer">
      <div className="area-composer__actions area-composer__actions--leading">{leadingActions}{mode}</div>
      <div className="area-composer__actions area-composer__actions--trailing">{trailingActions}
        <button type="button" className="area-composer__submit" aria-label={submitLabel} disabled={disabled || busy || !text.trim()} onClick={submit}>
          <Glyph name="arrow-up" />
        </button>
      </div>
    </div>}
  </div>;
});
