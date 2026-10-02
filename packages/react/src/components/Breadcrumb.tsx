import { forwardRef } from "react";
import type { AnchorHTMLAttributes, HTMLAttributes, ReactNode, Ref } from "react";
import { cx } from "../variants.ts";
import { Glyph } from "./Glyph.tsx";
import { Menu } from "./primitives.tsx";

export const Breadcrumb = forwardRef<HTMLElement, HTMLAttributes<HTMLElement>>(function Breadcrumb(
  { className, "aria-label": ariaLabel = "Breadcrumb", ...rest }, ref,
) {
  return <nav ref={ref} aria-label={ariaLabel} className={cx("area-breadcrumb", className)} {...rest} />;
});

export const BreadcrumbList = forwardRef<HTMLOListElement, HTMLAttributes<HTMLOListElement>>(function BreadcrumbList(
  { className, ...rest }, ref,
) {
  return <ol ref={ref} className={cx("area-breadcrumb__list", className)} {...rest} />;
});

export const BreadcrumbItem = forwardRef<HTMLLIElement, HTMLAttributes<HTMLLIElement>>(function BreadcrumbItem(
  { className, ...rest }, ref,
) {
  return <li ref={ref} className={cx("area-breadcrumb__item", className)} {...rest} />;
});

export const BreadcrumbLink = forwardRef<HTMLAnchorElement, AnchorHTMLAttributes<HTMLAnchorElement>>(function BreadcrumbLink(
  { className, ...rest }, ref,
) {
  return <a ref={ref} className={cx("area-breadcrumb__link", className)} {...rest} />;
});

export const BreadcrumbPage = forwardRef<HTMLSpanElement, HTMLAttributes<HTMLSpanElement>>(function BreadcrumbPage(
  { className, ...rest }, ref,
) {
  return <span ref={ref} className={cx("area-breadcrumb__page", className)} {...rest} aria-current="page" />;
});

export interface BreadcrumbSeparatorProps extends HTMLAttributes<HTMLLIElement> { children?: ReactNode }
export const BreadcrumbSeparator = forwardRef<HTMLLIElement, BreadcrumbSeparatorProps>(function BreadcrumbSeparator(
  { className, children, ...rest }, ref,
) {
  return <li ref={ref} className={cx("area-breadcrumb__separator", className)} {...rest} role="presentation" aria-hidden="true">{children ?? <Glyph name="chevron-down" rotate={270} />}</li>;
});

export interface BreadcrumbEllipsisProps extends HTMLAttributes<HTMLElement> {
  /**
   * The ancestors the trail hides. With them, the marker is a button that opens a Menu of those
   * pages, as Notion's collapsed path (audit D-19); without them it stays a decorative mark.
   */
  items?: { label: ReactNode; href: string }[];
}
export const BreadcrumbEllipsis = forwardRef<HTMLElement, BreadcrumbEllipsisProps>(function BreadcrumbEllipsis(
  { className, items, "aria-label": ariaLabel = "More pages", ...rest }, ref,
) {
  if (!items?.length) return <span ref={ref as Ref<HTMLSpanElement>} role="img" aria-label={ariaLabel} className={cx("area-breadcrumb__ellipsis", className)} {...rest}>…</span>;
  const trigger = <button ref={ref as Ref<HTMLButtonElement>} type="button" aria-label={ariaLabel} className={cx("area-breadcrumb__ellipsis", className)} {...rest}>…</button>;
  // Rows are links, so a page opens like any other crumb (middle-click, a new tab, the router's own anchor).
  return <Menu trigger={trigger}>{items.map(item => <a key={item.href} role="menuitem" href={item.href} className="area-menu__item"><span className="area-menu__text">{item.label}</span></a>)}</Menu>;
});
