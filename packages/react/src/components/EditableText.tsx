// EditableText: text that turns into a field in place to rename it (Figma's layer names, Notion's
// titles). Enter or leaving the field commits; Escape cancels. Spec: docs/specs/editable-text.md.
import { forwardRef, useEffect, useRef, useState } from "react";
import type { HTMLAttributes, InputHTMLAttributes, KeyboardEvent, ReactNode, SyntheticEvent } from "react";
import { editableTextVariants, type VariantProps, MANIFESTS } from "../variants.ts";
import { Tooltip } from "./Tooltip.tsx";
import { composing } from "./composing.ts";

type EditableTextVariants = VariantProps<typeof MANIFESTS.editableText>;

export interface EditableTextProps extends Omit<HTMLAttributes<HTMLSpanElement>, "defaultValue" | "onChange"> {
  /** What the text names, for assistive technology: "Layer name", "Page title". */
  label: string;
  /** Controlled value. */
  value?: string;
  /** Initial value when uncontrolled. */
  defaultValue?: string;
  /** Called with the new value when an edit is committed (Enter or leaving the field), not on each key. */
  onValueChange?: (value: string, event: SyntheticEvent) => void;
  /** Start in the editing state, as a just-created item waiting for its name. Focus is not moved on first render. */
  defaultEditing?: boolean;
  /** Called when an edit starts or ends. */
  onEditingChange?: (editing: boolean) => void;
  /** Shown, muted, when the value is empty. */
  placeholder?: string;
  /** What starts editing: a double-click (default), a click, or focus. Enter or F2 on the focused text always does. */
  activation?: EditableTextVariants["activation"];
  /** Fill the container's width, as a layer name fills its row. */
  fill?: boolean;
  /** The text can't be edited. */
  disabled?: boolean;
  /** A tooltip that says how to edit, on hover and keyboard focus ("Double-click to rename"); false hides it. */
  hint?: ReactNode | false;
  /** Props for the field, such as maxLength or name. */
  inputProps?: Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "defaultValue" | "onChange">;
}

export const EditableText = forwardRef<HTMLSpanElement, EditableTextProps>(function EditableText(
  { label, value: valueProp, defaultValue = "", onValueChange, defaultEditing = false, onEditingChange, placeholder, activation = "dblclick", fill, disabled,
    hint, inputProps, className, ...rest },
  ref,
) {
  const [valueState, setValueState] = useState(defaultValue);
  const value = valueProp ?? valueState;
  const [editing, setEditing] = useState(defaultEditing);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);
  const previewRef = useRef<HTMLSpanElement>(null);
  const returnFocus = useRef(false);
  // The field blurs as it unmounts after Enter or Escape; the ref keeps that blur from committing again.
  const active = useRef(defaultEditing);
  const mounted = useRef(false);

  const start = () => {
    if (disabled || active.current) return;
    active.current = true;
    setDraft(value);
    setEditing(true);
    onEditingChange?.(true);
  };
  const finish = (commit: boolean, refocus: boolean, event: SyntheticEvent) => {
    if (!active.current) return;
    active.current = false;
    setEditing(false);
    onEditingChange?.(false);
    returnFocus.current = refocus;
    if (commit && draft !== value) {
      if (valueProp === undefined) setValueState(draft);
      onValueChange?.(draft, event);
    }
  };
  // The whole text is selected when editing starts (Figma), and focus returns to the text after a
  // keyboard commit or cancel.
  useEffect(() => {
    if (!mounted.current) { mounted.current = true; return; }
    if (editing) { inputRef.current?.focus(); inputRef.current?.select(); }
    else if (returnFocus.current) { returnFocus.current = false; previewRef.current?.focus(); }
  }, [editing]);

  const onPreviewKey = (event: KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " " || event.key === "F2") { event.preventDefault(); start(); }
  };
  const onInputKey = (event: KeyboardEvent<HTMLInputElement>) => {
    inputProps?.onKeyDown?.(event);
    // Enter that confirms an IME composition (Japanese, Chinese) is not a commit.
    if (event.key === "Enter" && !composing(event)) { event.preventDefault(); finish(true, true, event); }
    else if (event.key === "Escape") { event.preventDefault(); event.stopPropagation(); finish(false, true, event); }
  };
  const shown = editing ? draft : value;
  // The tooltip stays mounted while editing, so the text keeps its node (and its focus return).
  const previewEl = (
    <span ref={previewRef} className="area-editable-text__preview" role="button" tabIndex={disabled ? -1 : 0}
      aria-label={`${label}: ${value || placeholder || ""}`} aria-disabled={disabled || undefined} aria-hidden={editing || undefined}
      data-placeholder={shown ? undefined : ""}
      onDoubleClick={activation === "dblclick" ? start : undefined}
      onClick={activation === "click" ? start : undefined}
      onFocus={activation === "focus" ? start : undefined}
      onKeyDown={onPreviewKey}>
      {shown || placeholder || "\u00a0"}
    </span>
  );
  const hintText = hint ?? (activation === "dblclick" ? "Double-click to rename" : "Click to rename");

  return (
    <span ref={ref} {...rest} className={editableTextVariants({ activation, fill }, className)}
      data-editing={editing ? "" : undefined} data-disabled={disabled ? "" : undefined}>
      {disabled || hint === false ? previewEl : <Tooltip trigger={previewEl}>{hintText}</Tooltip>}
      {editing ? (
        <input ref={inputRef} type="text" {...inputProps} className="area-editable-text__input" aria-label={label}
          placeholder={placeholder} value={draft} onChange={event => setDraft(event.target.value)} onKeyDown={onInputKey}
          onBlur={event => { inputProps?.onBlur?.(event); finish(true, false, event); }} />
      ) : null}
    </span>
  );
});

export { editableTextVariants };
