import { forwardRef } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import { cx } from "../variants.ts";
/* --- Code ----------------------------------------------------------------- */

export interface CodeProps extends HTMLAttributes<HTMLElement> {
  /** A CSS colour the reference resolves to. Adds a decorative swatch. */
  swatch?: string;
  /** A quieter treatment for a derived reference. */
  subtle?: boolean;
  /** Uses the surrounding foreground on a coloured ground. */
  onColor?: boolean;
}

export const Code = /* @__PURE__ */ forwardRef<HTMLElement, CodeProps>(function Code(
  { children, swatch, subtle, onColor, className, ...rest }, ref,
) {
  return <code ref={ref} className={cx("area-code", swatch && "area-code--swatch", subtle && "area-code--subtle", onColor && "area-code--on-color", className)} {...rest}>
    {swatch ? <span className="area-code__swatch" style={{ background: swatch }} aria-hidden="true" /> : null}
    {swatch ? <span className="area-code__label">{children}</span> : children}
  </code>;
});

/** @deprecated Use `CodeProps` with `swatch` (audit H-25). */
export interface TokenProps extends HTMLAttributes<HTMLElement> {
  /** The token's name, as it would be typed. */
  children: ReactNode;
  /**
   * A CSS colour the token resolves to. Renders a swatch ahead of the name.
   *
   * Pass the `var()` rather than a literal, so the swatch tracks the axes like everything
   * else does; a hex here would show what the token meant when the page was written.
   */
  swatch?: string;
  /** For a token naming something derived rather than primitive. */
  subtle?: boolean;
  /** On a coloured ground: takes the surrounding foreground instead of the page's. */
  onColor?: boolean;
}

/**
 * Names a design token inline — in documentation, a spec, or a comment thread.
 *
 * Token is `Code` with an optional colour swatch. Keeping the same element and base class
 * means any source-like reference reads as one inline treatment; the Token name only
 * preserves the more specific swatch composition.
 *
 * @deprecated Use `<Code swatch>`, which renders the same element and swatch (audit H-25 A,
 * owner 2026-09-30). Token stays exported so existing markup renders.
 */
export const Token = /* @__PURE__ */ forwardRef<HTMLElement, TokenProps>(function Token(
  { children, swatch, subtle, onColor, className, ...rest },
  ref,
) {
  return (
    <Code
      ref={ref}
      className={cx(
        "area-token",
        subtle && "area-token--subtle",
        onColor && "area-token--on-color",
        className,
      )}
      {...rest}
    >
      {swatch ? (
        <span className="area-token__swatch" style={{ background: swatch }} aria-hidden="true" />
      ) : null}
      {swatch ? <span className="area-token__label">{children}</span> : children}
    </Code>
  );
});
