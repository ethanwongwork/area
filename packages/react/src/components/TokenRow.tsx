// TokenRow: one design token a layer uses, as Figma Dev Mode's Colors rows list them: the existing token's plate
// (Code with its swatch) widened to the row, the name at its start and the value at its end. Read-only, or a button
// that copies the value.
// Spec: docs/specs/token-row.md.
import { forwardRef } from "react";
import type { HTMLAttributes, MouseEvent, Ref } from "react";
import { cx, tokenRowVariants } from "../variants.ts";
import { useCopy } from "./CopyButton.tsx";

export interface TokenRowProps extends Omit<HTMLAttributes<HTMLElement>, "children"> {
  /** The token's name ("color/bg/surface"), shown as a Code token. */
  name: string;
  /** Its resolved value, shown muted at the end ("#FFFFFF", "16"). */
  value?: string;
  /** A CSS colour: the token shows its swatch, as Code's `swatch`. */
  swatch?: string;
  /** The token's edge without its fill. */
  outline?: boolean;
  /** Makes the row a button that copies `copyText`, else the value, else the name. */
  copyable?: boolean;
  copyText?: string;
  /** Said once after copying. */
  copiedLabel?: string;
}

export const TokenRow = /* @__PURE__ */ forwardRef<HTMLElement, TokenRowProps>(function TokenRow(
  { name, value, swatch, outline, copyable, copyText, copiedLabel = "Copied", className, onClick, "aria-label": ariaLabel, ...rest },
  ref,
) {
  // CopyButton's behaviour (docs/specs/copy-button.md) on the whole row: the same clock, state hook and live region.
  const { state, copy: write } = useCopy(copyText ?? value ?? name, { copiedLabel });

  const body = (
    <>
      {swatch !== undefined ? <span className="area-code__swatch" style={{ background: swatch }} aria-hidden="true" /> : null}
      <span className="area-code__label">{name}</span>
      {value !== undefined ? <span className="area-token-row__value">{value}</span> : null}
    </>
  );
  // The plate is Code's own token: its classes give the ground, edge, corner and type.
  const classes = cx("area-code", swatch !== undefined && "area-code--swatch", tokenRowVariants({ outline, copyable }), className);

  if (!copyable) {
    return <div ref={ref as Ref<HTMLDivElement>} className={classes} aria-label={ariaLabel} onClick={onClick} {...rest}>{body}</div>;
  }

  const copy = (event: MouseEvent<HTMLElement>) => {
    onClick?.(event);
    if (!event.defaultPrevented) void write();
  };

  return (
    <button ref={ref as Ref<HTMLButtonElement>} type="button" className={classes}
      aria-label={ariaLabel ?? `Copy ${name}${value !== undefined ? `, ${value}` : ""}`}
      data-copy-state={state === "idle" ? undefined : state} onClick={copy} {...rest}>
      {body}
    </button>
  );
});
