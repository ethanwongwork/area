// Page header: a page's title block. A way back to its parent (a Breadcrumb or a back Link) over the title, the title's
// actions at its end, a description under it and the page's tabs or views under all of it. Slots, not show* flags: a
// part that isn't given isn't drawn. Spec: docs/specs/page-header.md (components audit N1, 2026-11-07).
import { forwardRef } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import { pageHeaderVariants, type VariantProps, MANIFESTS } from "../variants.ts";

type PageHeaderVariants = VariantProps<typeof MANIFESTS.pageHeader>;

export interface PageHeaderProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  /** The page's name, as a heading (`h1` by default): a few words, sentence case. */
  title: ReactNode;
  /** One or two sentences on what the page holds, in the muted ink under the title. */
  description?: ReactNode;
  /**
   * The way back, over the title: a Breadcrumb of the page's parents, or a back Link (an arrow and the parent's name).
   * Leave it out on a top-level page.
   */
  parent?: ReactNode;
  /**
   * The title's actions, at its end: one primary Button at most, after any secondary ones (WRITING.md, "One primary
   * action"). They centre on the title's line.
   */
  actions?: ReactNode;
  /** The page's Tabs, or a Segmented of its views, under the title and its description. */
  navigation?: ReactNode;
  /**
   * The title's type step: `sm` (title-xs) for a sub-page or a panel's page, `md` (title-sm, the default) for a page, `lg`
   * (title-md) for a top-level page.
   */
  size?: PageHeaderVariants["size"];
  /** The title's element: `h1` on the page's own header (the default), the next level when it heads a part of a page. */
  titleAs?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  /** The title's id, for `aria-labelledby` on the page's region. */
  titleId?: string;
}

/** A page's title block, as a `header`. */
export const PageHeader = /* @__PURE__ */ forwardRef<HTMLElement, PageHeaderProps>(function PageHeader(
  { title, description, parent, actions, navigation, size, titleAs: Title = "h1", titleId, className, ...rest },
  ref,
) {
  return (
    <header ref={ref} className={pageHeaderVariants({ size }, className)} {...rest}>
      {parent ? <div className={pageHeaderVariants.element("parent")}>{parent}</div> : null}
      <Title className={pageHeaderVariants.element("title")} id={titleId}>{title}</Title>
      {actions ? <div className={pageHeaderVariants.element("actions")}>{actions}</div> : null}
      {description ? <p className={pageHeaderVariants.element("description")}>{description}</p> : null}
      {navigation ? <div className={pageHeaderVariants.element("navigation")}>{navigation}</div> : null}
    </header>
  );
});

export { pageHeaderVariants };
