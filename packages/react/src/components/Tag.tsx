import { forwardRef } from "react";
import type { HTMLAttributes, MouseEvent, ReactNode } from "react";
import { tagVariants, type VariantProps, MANIFESTS } from "../variants.ts";
import { Glyph } from "./Glyph.tsx";

type Manifest = VariantProps<typeof MANIFESTS.tag>;
export type TagTone = NonNullable<Manifest["tone"]>;

export interface TagProps extends HTMLAttributes<HTMLSpanElement> {
  /** The colour (Notion's: default neutral, gray gray, brown brown, pink pink, blue info, green success, orange warning, yellow caution, red danger, purple discovery). */
  tone?: Manifest["tone"];
  size?: Manifest["size"];
  /** A small leading glyph. */
  icon?: ReactNode;
  /** Shows a remove × at the end; called when it is pressed. */
  onRemove?: (event: MouseEvent<HTMLButtonElement>) => void;
  /** Accessible name of the remove control. Defaults to "Remove <label>" for a text label. */
  removeLabel?: string;
  disabled?: boolean;
}

/**
 * A coloured label for a value someone chose or typed (Notion's select tags): body text in the
 * tone's ink on its tint, and an optional remove ×.
 */
export const Tag = forwardRef<HTMLSpanElement, TagProps>(function Tag(
  { tone = "neutral", size, icon, onRemove, removeLabel, disabled, className, children, ...rest }, ref,
) {
  const label = removeLabel ?? (typeof children === "string" ? `Remove ${children}` : "Remove");
  return <span ref={ref} className={tagVariants({ tone, size }, className)} data-disabled={disabled ? "" : undefined} {...rest}>
    {icon ? <span className="area-tag__icon" aria-hidden="true">{icon}</span> : null}
    <span className="area-tag__label">{children}</span>
    {onRemove && !disabled ? <button type="button" className="area-tag__remove" aria-label={label} onClick={onRemove}><Glyph name="dismiss" /></button> : null}
  </span>;
});
