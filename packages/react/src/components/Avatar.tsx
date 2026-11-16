import { useSystemDefault } from "./SystemDefaults.tsx";
import type { VariantProps } from "../variants.ts";
import { MANIFESTS } from "../variants.ts";
import { Children, forwardRef, useEffect, useRef, useState } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import { avatarVariants, cx } from "../variants.ts";
import type { Div } from "./shared.ts";
/* --- Avatar --------------------------------------------------------------- */

export interface AvatarProps extends Omit<HTMLAttributes<HTMLSpanElement>, "children"> {
  /**
   * `md` 32 (default), `sm` 28, `lg` 40, the control tiers, or `xs`, the height of a line of text, for a name in a
   * sentence.
   */
  size?: VariantProps<typeof MANIFESTS.avatar>["size"];
  /** Unset: a circle while the theme's `pills` list names `avatar` (the default), else a rounded square. Set it where context decides: people circle, teams and workspaces square. */
  shape?: VariantProps<typeof MANIFESTS.avatar>["shape"];
  /** The initials' fill: `neutral` (default), a quiet gray, or `inverse`. */
  tone?: VariantProps<typeof MANIFESTS.avatar>["tone"];
  /** Draws the current-person or active-participant ring around the Avatar. */
  active?: boolean;
  /** A picture of the person or entity; if it fails to load, the initials or glyph show instead. */
  src?: string;
  /**
   * Describes the person or entity. Required when `src` is set: pass `alt=""` when a visible name beside the
   * Avatar already says who it is, or name the Avatar with `aria-label` / `aria-labelledby`, or hide it.
   */
  alt?: string;
  /** Shown when there is no image. Usually one or two initials. */
  fallback?: ReactNode;
  /** A generic fallback visual, used instead of initials when no image is available. */
  icon?: ReactNode;
}

export const Avatar = /* @__PURE__ */ forwardRef<HTMLSpanElement, AvatarProps>(function Avatar(
  { size, shape, tone, active, src, alt, fallback, icon, className, role, "aria-label": ariaLabel, ...rest },
  ref,
) {
  // The system's defaults (SystemDefaults) where the use gives none.
  size = useSystemDefault("avatar", "size", size, avatarVariants.manifest.variants.size);
  tone = useSystemDefault("avatar", "tone", tone, avatarVariants.manifest.variants.tone);
  // As Badge does for its unnamed forms: an image with no description fails loudly in development rather than
  // silently reaching assistive tech as an unnamed picture.
  if (src && alt === undefined && !ariaLabel && !rest["aria-labelledby"] && !rest["aria-hidden"]) {
    throw new Error("Avatar: an image avatar needs alt (alt=\"\" beside a visible name), aria-label, aria-labelledby or aria-hidden.");
  }
  const [imageFailed, setImageFailed] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  useEffect(() => setImageFailed(false), [src]);
  useEffect(() => {
    const image = imageRef.current;
    // A cached failure can finish before hydration attaches `onError`. Check the native
    // image state once mounted so server-rendered avatars still reach their fallback.
    if (src && image?.complete && image.naturalWidth === 0) setImageFailed(true);
  }, [src]);

  const hasImage = Boolean(src) && !imageFailed;
  const wrapperLabel = hasImage ? ariaLabel : (ariaLabel ?? alt);
  const wrapperRole = role ?? (wrapperLabel ? "img" : undefined);

  // A span, so an Avatar is phrasing content inside a Chip's button or a Badge (audit C-22).
  return (
    <span
      ref={ref}
      className={avatarVariants({ size, shape, tone, active }, className)}
      role={wrapperRole}
      aria-label={wrapperLabel}
      {...rest}
    >
      {hasImage ? (
        <img
          ref={imageRef}
          className="area-avatar__image"
          src={src}
          alt={wrapperLabel ? "" : (alt ?? "")}
          onError={() => setImageFailed(true)}
        />
      ) : icon ? (
        <span className="area-avatar__icon" aria-hidden="true">{icon}</span>
      ) : (
        <span aria-hidden="true">{fallback}</span>
      )}
    </span>
  );
});

export interface AvatarGroupProps extends Div {
  /** Limits visible avatars; the remaining count is rendered as an Avatar. */
  max?: number;
  /** Size used by the generated overflow Avatar. */
  size?: AvatarProps["size"];
  /** The overflow Avatar's accessible name, from the hidden count ("3 more avatars"). */
  overflowLabel?: (count: number) => string;
}

export const AvatarGroup = /* @__PURE__ */ forwardRef<HTMLDivElement, AvatarGroupProps>(function AvatarGroup(
  { max, size = "md", overflowLabel = count => `${count} more avatars`, className, children, role = "group", ...rest },
  ref,
) {
  if (max !== undefined && (!Number.isFinite(max) || max < 0)) {
    throw new RangeError("AvatarGroup: max must be a nonnegative finite number.");
  }
  const items = Children.toArray(children);
  const visibleCount = max === undefined ? items.length : Math.min(items.length, Math.floor(max));
  const remaining = items.length - visibleCount;
  return (
    <div {...rest} ref={ref} role={role} className={cx("area-avatar-group", className)}>
      {items.slice(0, visibleCount).map((item, index) => <span className="area-avatar-group__item" key={index}>{item}</span>)}
      {remaining > 0 ? <Avatar className="area-avatar-group__overflow" size={size} fallback={`+${remaining}`} alt={overflowLabel(remaining)} /> : null}
    </div>
  );
});

