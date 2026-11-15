// CopyButton: a Button that copies text and says so, the one copy control Code block, Token row and the app share.
// The name stays fixed (audit G-21); the icon swaps to a check and the shared announcer says what happened, once
// (components audit D1).
// The check holds 2000ms (Untitled UI's useClipboard and shadcn's CopyButton; Mantine's hook), then the icon returns.
// Spec: docs/specs/copy-button.md.
import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import type { MouseEvent, ReactNode } from "react";
import { Button, type ButtonProps } from "./Button.tsx";
import { cx } from "../variants.ts";
import { announce } from "./announce.ts";
import { COPY_FEEDBACK } from "./timing.ts";

/**
 * The copy glyphs are the two cuts the documentation's own toolbar uses, so the React control and the
 * generated HTML chrome draw the same mark.
 */
export const CopyGlyph = () => (
  <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" focusable="false" aria-hidden="true">
    <path d="M5 6H4a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1h1a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7c0-1.1.9-2 2-2h1zm7-4a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V4c0-1.1.9-2 2-2zM8 3a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1z" />
  </svg>
);

export const CopiedGlyph = () => (
  <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" focusable="false" aria-hidden="true">
    <path d="M13.86 3.66a.5.5 0 0 1-.02.7l-7.93 7.48a.6.6 0 0 1-.84-.02L2.4 9.1a.5.5 0 0 1 .72-.7l2.4 2.44 7.65-7.2a.5.5 0 0 1 .7.02" />
  </svg>
);

export type CopyState = "idle" | "copied" | "failed";

/** What to copy: the text, or a function that reads it at the moment of the click. */
export type CopyValue = string | (() => string | Promise<string>);

/** How long the check (or the failure) shows before the control returns to rest. */
export const COPY_FEEDBACK_MS = COPY_FEEDBACK;

/**
 * The copy behaviour on its own, for a control that is not a Button (Token row copies from its whole row).
 * `copy` writes the value, then holds `copied` or `failed` for `timeout` ms; a second copy restarts the clock. The
 * result is said through the shared announcer (`copiedLabel`, `failedLabel`), politely, once per copy.
 */
export function useCopy(value: CopyValue, { timeout = COPY_FEEDBACK_MS, onCopied, onCopyError, copiedLabel = "Copied to clipboard", failedLabel = "Copy failed" }: {
  timeout?: number;
  onCopied?: (text: string) => void;
  onCopyError?: (error: unknown) => void;
  /** Said once after a copy succeeds. */
  copiedLabel?: string;
  /** Said once when the clipboard refuses. */
  failedLabel?: string;
} = {}) {
  const [state, setState] = useState<CopyState>("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  const copy = useCallback(async () => {
    const settle = (next: "copied" | "failed") => {
      setState(next);
      announce(next === "copied" ? copiedLabel : failedLabel);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setState("idle"), timeout);
    };
    try {
      const text = typeof value === "function" ? await value() : value;
      if (!navigator.clipboard?.writeText) throw new Error("The clipboard is not available");
      await navigator.clipboard.writeText(text);
      settle("copied");
      onCopied?.(text);
    } catch (error) {
      settle("failed");
      onCopyError?.(error);
    }
  }, [value, timeout, onCopied, onCopyError, copiedLabel, failedLabel]);
  return { state, copy };
}

/**
 * @deprecated `useCopy` says the result through the shared announcer (pass `copiedLabel` and `failedLabel` to it);
 * this renders nothing. Kept for one release (components audit D1, 2026-11-07).
 */
export function CopyStatus(_props: {
  state: CopyState;
  copiedLabel?: string;
  failedLabel?: string;
}) {
  return null;
}

export interface CopyButtonProps extends Omit<ButtonProps, "value" | "selected" | "defaultSelected" | "onSelectedChange" | "loading"> {
  /** The text to copy, or a function that returns it (read when pressed). */
  value: CopyValue;
  /** With no children, the icon-only button's name. Fixed: the result is announced, not renamed. */
  label?: string;
  /** Said once after a copy succeeds. */
  copiedLabel?: string;
  /** Said once when the clipboard refuses. */
  failedLabel?: string;
  /** The glyph at rest; the copy glyph by default. */
  icon?: ReactNode;
  /** The glyph shown while copied; a check by default. */
  copiedIcon?: ReactNode;
  /** How long the check holds, in ms. */
  timeout?: number;
  /** Called with the text once it is on the clipboard. */
  onCopied?: (text: string) => void;
  /** Called with the error when the clipboard refuses. */
  onCopyError?: (error: unknown) => void;
}

/**
 * Copies `value` and shows a check for two seconds. With no children it is an icon-only Button named by `label`
 * ("Copy"); with children the label stays as written and only the icon changes. Button's variants,
 * tones and sizes apply; ghost, neutral and sm by default, as Code block's copy.
 */
export const CopyButton = /* @__PURE__ */ forwardRef<HTMLButtonElement, CopyButtonProps>(function CopyButton(
  {
    value,
    label = "Copy",
    copiedLabel,
    failedLabel,
    icon = <CopyGlyph />,
    copiedIcon = <CopiedGlyph />,
    timeout,
    onCopied,
    onCopyError,
    variant = "ghost",
    tone = "neutral",
    size = "sm",
    iconOnly,
    children,
    className,
    onClick,
    "aria-label": ariaLabel,
    ...rest
  },
  ref,
) {
  const { state, copy } = useCopy(value, { timeout, onCopied, onCopyError, copiedLabel, failedLabel });
  const bare = children == null;
  const press = (event: MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    if (!event.defaultPrevented) void copy();
  };
  return (
      <Button
        ref={ref}
        variant={variant}
        tone={tone}
        size={size}
        iconOnly={iconOnly ?? bare}
        className={cx("area-copy-button", className)}
        aria-label={ariaLabel ?? (bare ? label : undefined)}
        data-copy-state={state === "idle" ? undefined : state}
        icon={state === "copied" ? copiedIcon : icon}
        onClick={press}
        {...rest}
      >
        {children}
      </Button>
  );
});
