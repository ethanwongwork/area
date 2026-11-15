// PasswordField: an Input for a password, with a reveal action at the end that shows the value as text
// and hides it again. Spec: docs/specs/password-field.md.
import { forwardRef, useCallback, useEffect, useId, useRef, useState } from "react";
import type { MouseEvent } from "react";
import { cx } from "../variants.ts";
import { Glyph } from "./Glyph.tsx";
import { Input, InputAction, type InputProps } from "./Input.tsx";

export interface PasswordFieldProps extends Omit<InputProps, "type" | "trailingAction" | "trailingIcon"> {
  /** Whether the password shows as text (controlled). */
  visible?: boolean;
  /** Whether the password starts shown as text, uncontrolled. */
  defaultVisible?: boolean;
  /** Every reveal and hide, from the action or from a form submit hiding it again. */
  onVisibleChange?: (visible: boolean) => void;
  /** The action's name while the password is hidden; it names what pressing it does. */
  showLabel?: string;
  /** The action's name while the password shows. */
  hideLabel?: string;
}

/**
 * A field for a password. The reveal action names what it does ("Show password", then "Hide
 * password") and draws the action's eye; it stays in the Tab order, since nothing else reaches it
 * from the keyboard, and a pointer press keeps the caret in the field. `autoComplete` defaults to
 * "current-password" so password managers fill it; use "new-password" where one is chosen. A submit
 * of the surrounding form hides the value again, so a revealed password isn't left on screen after
 * sign-in.
 */
export const PasswordField = /* @__PURE__ */ forwardRef<HTMLInputElement, PasswordFieldProps>(function PasswordField(
  { visible, defaultVisible = false, onVisibleChange, showLabel = "Show password", hideLabel = "Hide password",
    autoComplete = "current-password", disabled, className, id: idProp, ...rest },
  ref,
) {
  const [own, setOwn] = useState(defaultVisible);
  const shown = visible ?? own;
  const autoId = useId();
  const id = idProp ?? autoId;
  const inputRef = useRef<HTMLInputElement | null>(null);
  const setRefs = useCallback((node: HTMLInputElement | null) => {
    inputRef.current = node;
    if (typeof ref === "function") ref(node);
    else if (ref) ref.current = node;
  }, [ref]);

  const set = useCallback((next: boolean) => {
    if (visible === undefined) setOwn(next);
    onVisibleChange?.(next);
  }, [visible, onVisibleChange]);

  // Hidden again when its form submits.
  useEffect(() => {
    const form = inputRef.current?.form;
    if (!form || !shown) return;
    const hide = () => set(false);
    form.addEventListener("submit", hide);
    return () => form.removeEventListener("submit", hide);
  }, [shown, set]);

  const toggle = () => {
    const input = inputRef.current;
    // The caret and selection survive the type change; restore them where the browser resets them.
    const start = input?.selectionStart ?? null;
    const end = input?.selectionEnd ?? null;
    set(!shown);
    if (input && document.activeElement === input && start !== null) {
      requestAnimationFrame(() => input.setSelectionRange(start, end ?? start));
    }
  };

  return (
    <Input
      ref={setRefs}
      {...rest}
      id={id}
      className={cx("area-password-field", className)}
      type={shown ? "text" : "password"}
      autoComplete={autoComplete}
      // A shown password is still a secret: no spelling marks or autocorrect on it.
      spellCheck={false}
      autoCapitalize="off"
      autoCorrect="off"
      disabled={disabled}
      trailingAction={disabled ? undefined : (
        <InputAction
          className="area-password-field__reveal"
          icon={<Glyph name={shown ? "eye-off" : "eye"} />}
          tooltip={shown ? hideLabel : showLabel}
          aria-controls={id}
          // A pointer press leaves focus (and the caret) in the field; the keyboard reaches it by Tab.
          onMouseDown={(event: MouseEvent) => {
            if (document.activeElement === inputRef.current) event.preventDefault();
          }}
          onClick={toggle}
        />
      )}
    />
  );
});
