import { useSystemDefault } from "./SystemDefaults.tsx";
import type { VariantProps } from "../variants.ts";
import { MANIFESTS } from "../variants.ts";
import { forwardRef } from "react";
import type { AnchorHTMLAttributes, HTMLAttributes, ReactNode } from "react";
import { cx, createVariants } from "../variants.ts";
import type { Div } from "./shared.ts";
/* --- Card ----------------------------------------------------------------- */

export interface CardProps extends Div {
  /**
   * `vertical` (default): media above the text. `horizontal`: media beside it, stacking below 480px. `thumbnail`: a
   * small picture beside the text, for lists. `immersive`: the media behind the text.
   */
  layout?: VariantProps<typeof MANIFESTS.card>["layout"];
  /** Shape: the corner and inset (type is the same three roles at every size). */
  size?: VariantProps<typeof MANIFESTS.card>["size"];
  /** The chosen card in a set: the selection stroke, 2 wide, inside its edge (product UI rule 3). Sets `data-selected`;
   * the semantics (aria-selected in a List box, aria-pressed on a toggle) belong to the element that owns the choice. */
  selected?: boolean;
}

const cardVariants = createVariants(MANIFESTS.card);
export const Card = /* @__PURE__ */ forwardRef<HTMLDivElement, CardProps>(function Card({ layout, size, selected, className, ...rest }, ref) {
  // The system's defaults (SystemDefaults) where the use gives none.
  layout = useSystemDefault("card", "layout", layout, cardVariants.manifest.variants.layout);
  size = useSystemDefault("card", "size", size, cardVariants.manifest.variants.size);
  return <div ref={ref} className={cardVariants({ layout, size }, className)} data-selected={selected ? "" : undefined} {...rest} />;
});

/**
 * Groups blocks that belong together. Optional: every slot (CardHeader, CardTitle, CardDescription, CardList, CardFooter)
 * sits on the card's space and section gap whether it is in CardContent or straight in the Card.
 */
export const CardContent = /* @__PURE__ */ forwardRef<HTMLDivElement, Div>(function CardContent({ className, ...rest }, ref) {
  return <div ref={ref} className={cx("area-card__content", className)} {...rest} />;
});

export interface CardHeaderProps extends Div {
  /** A Badge or an icon Button, centred on the title's first line. */
  action?: ReactNode;
}

/** A title row: the title (and description) beside a trailing action. */
export const CardHeader = /* @__PURE__ */ forwardRef<HTMLDivElement, CardHeaderProps>(function CardHeader({ action, className, children, ...rest }, ref) {
  return (
    <div ref={ref} className={cx("area-card__header", className)} {...rest}>
      <div className="area-card__heading">{children}</div>
      {action ? <div className="area-card__header-action">{action}</div> : null}
    </div>
  );
});

export interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  /** The heading level, so a card title is in the page outline. */
  level?: 2 | 3 | 4 | 5 | 6;
}
export const CardTitle = /* @__PURE__ */ forwardRef<HTMLHeadingElement, CardTitleProps>(function CardTitle({ level = 3, className, ...rest }, ref) {
  const H = `h${level}` as "h3";
  return <H ref={ref} className={cx("area-card__title", className)} {...rest} />;
});

export const CardDescription = /* @__PURE__ */ forwardRef<HTMLDivElement, Div>(function CardDescription(
  { className, ...rest },
  ref,
) {
  return <div ref={ref} className={cx("area-card__description", className)} {...rest} />;
});

/** A figure a widget leads with, such as a temperature, price or count. */
export const CardValue = /* @__PURE__ */ forwardRef<HTMLDivElement, Div>(function CardValue({ className, ...rest }, ref) {
  return <div ref={ref} className={cx("area-card__value", className)} {...rest} />;
});

export interface CardMediaProps extends Div {
  /** A recessed surface that holds a composition rather than a picture. */
  well?: boolean;
  /** Flush with the card's edge on the sides it touches, instead of inset. */
  bleed?: boolean;
}

export const CardMedia = /* @__PURE__ */ forwardRef<HTMLDivElement, CardMediaProps>(function CardMedia({ well, bleed, className, ...rest }, ref) {
  return <div ref={ref} className={cx("area-card__media", well && "area-card__media--well", bleed && "area-card__media--bleed", className)} {...rest} />;
});

export interface CardOverlayProps extends Div {
  /** The corner it pins to, inside CardMedia or on the card itself. */
  placement?: "top-start" | "top-end" | "bottom-start" | "bottom-end";
  /** Hidden until the card is hovered or holds focus; always shown on touch screens. */
  reveal?: boolean;
}

export const CardOverlay = /* @__PURE__ */ forwardRef<HTMLDivElement, CardOverlayProps>(function CardOverlay(
  { placement = "top-end", reveal, className, ...rest },
  ref,
) {
  return <div ref={ref} className={cx("area-card__overlay", `area-card__overlay--${placement}`, reveal && "area-card__overlay--reveal", className)} {...rest} />;
});

/**
 * Makes the whole card one link: put it inside CardTitle. Its hit area covers the card, and
 * Buttons elsewhere in the card stay separate targets above it.
 */
export const CardLink = /* @__PURE__ */ forwardRef<HTMLAnchorElement, AnchorHTMLAttributes<HTMLAnchorElement>>(function CardLink(
  { className, ...rest },
  ref,
) {
  return <a ref={ref} className={cx("area-card__link", className)} {...rest} />;
});

/** A short list of points; lead each item with a 16px icon. */
export const CardList = /* @__PURE__ */ forwardRef<HTMLUListElement, HTMLAttributes<HTMLUListElement>>(function CardList({ className, ...rest }, ref) {
  return <ul ref={ref} className={cx("area-card__list", className)} {...rest} />;
});

export const CardAction = /* @__PURE__ */ forwardRef<HTMLAnchorElement, AnchorHTMLAttributes<HTMLAnchorElement>>(function CardAction(
  { className, ...rest },
  ref,
) {
  return <a ref={ref} className={cx("area-card__action", className)} {...rest} />;
});

/** A row of items that scrolls sideways with scroll snap; each child is an `<li>`. Name it with `aria-label`. */
export const CardCarousel = /* @__PURE__ */ forwardRef<HTMLUListElement, HTMLAttributes<HTMLUListElement>>(function CardCarousel({ className, tabIndex = 0, ...rest }, ref) {
  return <ul ref={ref} tabIndex={tabIndex} className={cx("area-card__carousel", className)} {...rest} />;
});

export interface CardFooterProps extends Div {
  /** Push the first and last children to the two ends (a person and a value), as Stack's `spread`. */
  spread?: boolean;
}

/** A row at the bottom of the card, on the card's space; it drops to the bottom of a taller card. */
export const CardFooter = /* @__PURE__ */ forwardRef<HTMLDivElement, CardFooterProps>(function CardFooter({ spread, className, ...rest }, ref) {
  return <div ref={ref} className={cx("area-card__footer", spread && "area-card__footer--spread", className)} {...rest} />;
});

