import { forwardRef, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import type { ChangeEvent, ClipboardEvent, DragEvent, HTMLAttributes, KeyboardEvent, ReactNode, SyntheticEvent, TextareaHTMLAttributes } from "react";
import { composerGroupVariants, composerVariants, cx, type VariantProps, MANIFESTS } from "../variants.ts";
import { Button, type ButtonProps } from "./Button.tsx";
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
  /**
   * While `loading`, Enter queues the draft instead of doing nothing: it is handed here and the field clears, and the
   * button stays Stop (Cursor's queue, Claude Code's "Queue another message…").
   */
  onQueue?: (value: string) => void;
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
  /**
   * What the message is about, inside the shell above the field: context chips (Chip `input`) and Attachments. They
   * wrap, the composer's gap apart.
   */
  context?: ReactNode;
  /** A ComposerMenu (the @ and / suggestions), drawn above the composer at its width. */
  menu?: ReactNode;
  /**
   * A row above the shell, outside it: where the message runs (Cursor's "Code ▾  This Mac ▾"). With `footer`, the
   * root becomes a group holding the rows around the shell; `className` and the rest land on the group.
   */
  header?: ReactNode;
  /** A row under the shell, outside it: tools, a ComposerNote, the model (Claude's reply composer). */
  footer?: ReactNode;
  /**
   * Files dropped on the composer or pasted into it. While files are dragged over, the shell takes File upload's
   * drop paint. Pair it with a ComposerAttach for picking.
   */
  onFiles?: (files: File[], event: DragEvent<HTMLDivElement> | ClipboardEvent<HTMLTextAreaElement>) => void;
  /**
   * Room for a long prompt: once the draft passes the field's eight lines (or while expanded), an Expand control at the
   * field's top end opens it to the container's height, and Collapse closes it. The container gives the room.
   */
  expandable?: boolean;
  /** Whether the field is open to its container (controlled); pair with `onExpandedChange`. */
  expanded?: boolean;
  defaultExpanded?: boolean;
  onExpandedChange?: (expanded: boolean, event?: SyntheticEvent) => void;
  /** Name the control: "Expand" and "Collapse". */
  expandLabel?: string;
  collapseLabel?: string;
  inputProps?: Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "value" | "defaultValue" | "onChange" | "onKeyDown" | "rows" | "disabled" | "placeholder" | "maxLength">;
  onInputKeyDown?: (event: KeyboardEvent<HTMLTextAreaElement>) => void;
}

/** Message entry with native multiline editing and separate action and mode slots. */
export const Composer = forwardRef<HTMLTextAreaElement, ComposerProps>(function Composer(
  { layout = "inline", value, defaultValue = "", onValueChange, onSubmit,
    placeholder = "Write a message…", label = "Message", disabled, loading: loadingProp, busy, onStop, onQueue, stopLabel = "Stop", maxLength,
    leadingActions, trailingActions, mode, submitLabel = "Send message", submitPill, submitOnEnter = true, context, menu, inputProps, onInputKeyDown,
    header, footer, onFiles, expandable, expanded: expandedProp, defaultExpanded = false, onExpandedChange, expandLabel = "Expand", collapseLabel = "Collapse",
    className, ...rest }, ref,
) {
  const loading = loadingProp ?? busy;
  const [ownExpanded, setOwnExpanded] = useState(defaultExpanded);
  const expanded = Boolean(expandable) && (expandedProp ?? ownExpanded);
  const setExpanded = (next: boolean, event?: SyntheticEvent) => { if (expandedProp === undefined) setOwnExpanded(next); onExpandedChange?.(next, event); };
  // Whether the draft has passed the field's cap: the Expand control shows from then on (and while expanded).
  const [overflowing, setOverflowing] = useState(false);
  // Files over the shell: counted, since dragenter and dragleave fire for every child crossed.
  const [dragging, setDragging] = useState(0);
  const hasFiles = (event: DragEvent) => Array.from(event.dataTransfer?.types ?? []).includes("Files");
  const drop = onFiles && !disabled ? {
    onDragEnter: (event: DragEvent<HTMLDivElement>) => { if (hasFiles(event)) { event.preventDefault(); setDragging(count => count + 1); } },
    onDragOver: (event: DragEvent<HTMLDivElement>) => { if (hasFiles(event)) { event.preventDefault(); event.dataTransfer.dropEffect = "copy"; } },
    onDragLeave: (event: DragEvent<HTMLDivElement>) => { if (hasFiles(event)) setDragging(count => Math.max(0, count - 1)); },
    onDrop: (event: DragEvent<HTMLDivElement>) => {
      if (!hasFiles(event)) return;
      event.preventDefault(); setDragging(0);
      const files = Array.from(event.dataTransfer.files);
      if (files.length) onFiles(files, event);
    },
  } : {};
  // Pasted files go to onFiles; pasted text stays the textarea's.
  const paste = (event: ClipboardEvent<HTMLTextAreaElement>) => {
    inputProps?.onPaste?.(event);
    if (event.defaultPrevented || !onFiles || disabled) return;
    const files = Array.from(event.clipboardData?.files ?? []);
    if (!files.length) return;
    event.preventDefault();
    onFiles(files, event);
  };
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
    if (expandable) setOverflowing(input.scrollHeight > input.clientHeight + 1);
    if (expanded || (typeof CSS !== "undefined" && CSS.supports?.("field-sizing: content"))) {
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
  }, [text, layout, expanded, expandable]);
  const change = (event: ChangeEvent<HTMLTextAreaElement>) => {
    if (value === undefined) setOwnValue(event.target.value);
    onValueChange?.(event.target.value, event);
  };
  // Leading blank lines and trailing whitespace go; a pasted block keeps its indentation (audit G-15).
  const submit = () => {
    if (disabled || !text.trim()) return;
    if (loading && !onQueue) return;
    (loading ? onQueue : onSubmit)?.(text.replace(/^\s*\n/, "").trimEnd());
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
    // Escape closes an expanded field (the draft stays).
    if (event.key === "Escape" && expanded) { event.preventDefault(); setExpanded(false, event); return; }
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
  const grouped = Boolean(header || footer);
  const shell = <div {...(grouped ? {} : rest)} {...drop} className={composerVariants({ layout }, grouped ? undefined : className)}
    data-disabled={disabled ? "" : undefined} data-dragging={dragging ? "" : (rest as Record<string, unknown>)["data-dragging"] as string | undefined}
    data-expanded={expanded ? "" : undefined} aria-busy={loading || undefined}>
    {menu}
    {context ? <div className="area-composer__context">{context}</div> : null}
    <div className="area-composer__entry">
      {/* A fieldset disables every nested action natively when the composer is disabled (audit G-14). */}
      {layout === "inline" && leadingActions && <fieldset disabled={disabled} className="area-composer__actions area-composer__actions--leading">{leadingActions}</fieldset>}
      <label htmlFor={inputId} className="area-sr-only">{label}</label>
      {expandable && (overflowing || expanded) ? <Button className="area-composer__expand" variant="ghost" tone="neutral" size="sm" iconOnly
        aria-label={expanded ? collapseLabel : expandLabel} aria-controls={inputId} disabled={disabled}
        icon={<Glyph name={expanded ? "minimize" : "maximize"} />} onClick={event => { setExpanded(!expanded, event); inputRef.current?.focus(); }} /> : null}
      <textarea {...inputProps} id={inputId} ref={element => { inputRef.current = element; if (typeof ref === "function") ref(element); else if (ref) ref.current = element; }} className={cx("area-composer__input", inputProps?.className)} rows={layout === "inline" ? 1 : 2} value={text}
        onChange={change} onKeyDown={keyDown} onPaste={paste} placeholder={placeholder} disabled={disabled} maxLength={maxLength} />
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
  if (!grouped) return shell;
  const group = composerGroupVariants;
  return <div {...rest} className={group({}, className)}>
    {header ? <div className={group.element("header")}>{header}</div> : null}
    {shell}
    {footer ? <div className={group.element("footer")}>{footer}</div> : null}
  </div>;
});

export interface ComposerMicProps extends Omit<ButtonProps, "icon" | "iconOnly" | "variant" | "tone" | "children"> {
  /** Names the button: "Dictate". Its name stays the same while on; `aria-pressed` says it is on. */
  label?: string;
}

/**
 * Dictation in the composer: a ghost icon-only toggle Button, the mic at rest and the waveform while on (it is a toggle,
 * so `selected` / `onSelectedChange`). The app does the listening and writes into the composer's value.
 */
export const ComposerMic = forwardRef<HTMLButtonElement, ComposerMicProps>(function ComposerMic(
  { label = "Dictate", selected, defaultSelected, onSelectedChange, size = "md", className, ...rest }, ref,
) {
  const [own, setOwn] = useState(Boolean(defaultSelected));
  const on = selected ?? own;
  return <Button {...rest} ref={ref} className={cx("area-composer__mic", className)} variant="ghost" tone="neutral" size={size} iconOnly
    selected={on} onSelectedChange={(next, event) => { if (selected === undefined) setOwn(next); onSelectedChange?.(next, event); }}
    aria-label={label} icon={<Glyph name={on ? "waveform" : "mic"} />} />;
});

export interface ComposerAttachProps extends Omit<ButtonProps, "icon" | "iconOnly" | "variant" | "tone" | "children" | "onClick"> {
  /** The chosen files. */
  onFiles?: (files: File[]) => void;
  /** The file types offered (the input's `accept`). */
  accept?: string;
  /** More than one file at a time; on by default. */
  multiple?: boolean;
  /** Names the button: "Add files". */
  label?: string;
}

/** The composer's +: a ghost icon-only Button that opens the file picker and hands the chosen files to `onFiles`. */
export const ComposerAttach = forwardRef<HTMLButtonElement, ComposerAttachProps>(function ComposerAttach(
  { onFiles, accept, multiple = true, label = "Add files", size = "md", className, disabled, ...rest }, ref,
) {
  const input = useRef<HTMLInputElement | null>(null);
  return <>
    <Button {...rest} ref={ref} className={cx("area-composer__attach", className)} variant="ghost" tone="neutral" size={size} iconOnly
      disabled={disabled} aria-label={label} icon={<Glyph name="add" />} onClick={() => input.current?.click()} />
    <input ref={input} className="area-composer__file" type="file" accept={accept} multiple={multiple} hidden tabIndex={-1} aria-hidden="true"
      onChange={event => { const files = Array.from(event.target.files ?? []); if (files.length) onFiles?.(files); event.target.value = ""; }} />
  </>;
});

/** A quiet line under the composer, in its footer ("Claude is AI and can make mistakes."). */
export const ComposerNote = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(function ComposerNote(
  { className, ...rest }, ref,
) {
  return <p {...rest} ref={ref} className={cx(composerGroupVariants.element("note"), className)} />;
});
