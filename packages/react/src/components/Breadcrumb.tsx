import { forwardRef } from "react";
import type { AnchorHTMLAttributes, HTMLAttributes, ReactNode } from "react";
import { cx } from "../variants.ts";

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
  return <li ref={ref} className={cx("area-breadcrumb__separator", className)} {...rest} role="presentation" aria-hidden="true">{children ?? <span className="area-breadcrumb__chevron" />}</li>;
});

export const BreadcrumbEllipsis = forwardRef<HTMLSpanElement, HTMLAttributes<HTMLSpanElement>>(function BreadcrumbEllipsis(
  { className, "aria-label": ariaLabel = "More pages", ...rest }, ref,
) {
  return <span ref={ref} role="img" aria-label={ariaLabel} className={cx("area-breadcrumb__ellipsis", className)} {...rest}>…</span>;
});
