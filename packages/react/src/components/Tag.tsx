import { forwardRef } from "react";
import type { HTMLAttributes, MouseEvent, ReactNode } from "react";
import { tagVariants, type VariantProps, MANIFESTS } from "../variants.ts";
import { Glyph } from "./Glyph.tsx";

type Manifest = VariantProps<typeof MANIFESTS.tag>;
export type TagColor = NonNullable<Manifest["color"]>;
/** @deprecated The semantic names Tag took until 2026-11-07; use `TagColor`. */
export type TagTone = TagColor | "info" | "success" | "warning" | "caution" | "danger" | "discovery";
const HUE: Record<string, TagColor> = { info: "blue", success: "green", warning: "orange", caution: "yellow", danger: "red", discovery: "purple" };

export interface TagProps extends HTMLAttributes<HTMLSpanElement> {
  /** The label colour, Notion's select colours and Board column's set: neutral (default), gray, brown, orange, yellow,
   * green, blue, purple, pink, red. */
  color?: TagColor;
  /** @deprecated Use `color` (a label's hue is not a tone, Governance § 4; 2026-11-07). info is blue, success green,
   * warning orange, caution yellow, danger red, discovery purple. Kept for one release; `color` wins. */
  tone?: TagTone;
  size?: Manifest["size"];
  /** A small leading glyph. */
  icon?: ReactNode;
  /** Shows a dismiss × at the end; called when it is pressed. */
  onDismiss?: (event: MouseEvent<HTMLButtonElement>) => void;
  /** Accessible name of the dismiss control. Defaults to "Remove <label>" for a text label. */
  dismissLabel?: string;
  /** @deprecated Use `onDismiss` (a close is `onDismiss` / `dismissLabel`, Governance § 4). Kept for one release. */
  onRemove?: (event: MouseEvent<HTMLButtonElement>) => void;
  /** @deprecated Use `dismissLabel`. */
  removeLabel?: string;
  disabled?: boolean;
}

/**
 * A coloured label for a value someone chose or typed (Notion's select tags): body text in the
 * colour's ink on its tint, and an optional dismiss ×.
 */
export const Tag = forwardRef<HTMLSpanElement, TagProps>(function Tag(
  { color: colorProp, tone, size, icon, onDismiss: onDismissProp, dismissLabel, onRemove, removeLabel, disabled, className, children, ...rest }, ref,
) {
  const onDismiss = onDismissProp ?? onRemove;
  const label = dismissLabel ?? removeLabel ?? (typeof children === "string" ? `Remove ${children}` : "Remove");
  return <span ref={ref} className={tagVariants({ color: colorProp ?? (tone ? HUE[tone] ?? tone as TagColor : "neutral"), size }, className)} data-disabled={disabled ? "" : undefined} {...rest}>
    {icon ? <span className="area-tag__icon" aria-hidden="true">{icon}</span> : null}
    <span className="area-tag__label">{children}</span>
    {onDismiss && !disabled ? <button type="button" className="area-tag__dismiss" aria-label={label} onClick={onDismiss}><Glyph name="dismiss" size={12} /></button> : null}
  </span>;
});
