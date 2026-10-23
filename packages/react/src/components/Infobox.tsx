// Infobox: a subject's key facts beside or above the content: a start-aligned header, then sections of label and value
// rows at Wikipedia's density (GitHub's About sidebar, the App Store's Information). docs/specs/infobox.md.
import { forwardRef } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import { cx, infoboxVariants, type VariantProps, MANIFESTS } from "../variants.ts";

type InfoboxVariants = VariantProps<typeof MANIFESTS.infobox>;

export interface InfoboxProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  /** The subject's name, at the start of the header. */
  title: ReactNode;
  /** A line under the title: a role, a short description. */
  subtitle?: ReactNode;
  /** An image (or an Avatar) above the title. Give an img its alt text; a caption belongs to a Figure. */
  media?: ReactNode;
  /** One control at the end of the title row: an icon Button (`size="sm"`, ghost). */
  action?: ReactNode;
  /** `columns` (default): a label column as wide as the longest label (up to 40%), the value 12 after it. `stacked`: each label above its value, for a narrow column. */
  layout?: InfoboxVariants["layout"];
  /** In Card's frame. Unframed by default, as GitHub's and Notion's. */
  framed?: boolean;
  /** Sections (`InfoboxSection`), or rows (`InfoboxRows`). */
  children?: ReactNode;
}

export const Infobox = /* @__PURE__ */ forwardRef<HTMLElement, InfoboxProps>(function Infobox(
  { title, subtitle, media, action, layout, framed, className, children, "aria-label": ariaLabel, ...rest },
  ref,
) {
  return (
    <aside ref={ref} className={infoboxVariants({ layout, framed }, className)} aria-label={ariaLabel ?? (typeof title === "string" ? title : undefined)} {...rest}>
      <div className={infoboxVariants.element("header")}>
        {media ? <div className={infoboxVariants.element("media")}>{media}</div> : null}
        <div className={infoboxVariants.element("title-row")}>
          <div className={infoboxVariants.element("heading-group")}>
            <div className={infoboxVariants.element("title")}>{title}</div>
            {subtitle ? <div className={infoboxVariants.element("subtitle")}>{subtitle}</div> : null}
          </div>
          {action ? <div className={infoboxVariants.element("action")}>{action}</div> : null}
        </div>
      </div>
      {children}
    </aside>
  );
});

export interface InfoboxSectionProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  /** The heading over the section's rows ("Personal details"). */
  title?: ReactNode;
  /** `InfoboxRow`s. */
  children?: ReactNode;
}

/** A titled run of rows; a divider separates it from the section before it. */
export const InfoboxSection = /* @__PURE__ */ forwardRef<HTMLElement, InfoboxSectionProps>(function InfoboxSection(
  { title, className, children, ...rest },
  ref,
) {
  return (
    <section ref={ref} className={cx(infoboxVariants.element("section"), className)} {...rest}>
      {title ? <div className={infoboxVariants.element("heading")}>{title}</div> : null}
      <dl className={infoboxVariants.element("rows")}>{children}</dl>
    </section>
  );
});

export interface InfoboxRowProps extends HTMLAttributes<HTMLDivElement> {
  /** What the value is: "Born", "Education". */
  label: ReactNode;
  children?: ReactNode;
}

/** A label and its value. Put rows in an `InfoboxSection` or `InfoboxRows`, which make the `dl`. */
export const InfoboxRow = /* @__PURE__ */ forwardRef<HTMLDivElement, InfoboxRowProps>(function InfoboxRow(
  { label, className, children, ...rest },
  ref,
) {
  return (
    <div ref={ref} className={cx(infoboxVariants.element("row"), className)} {...rest}>
      <dt className={infoboxVariants.element("label")}>{label}</dt>
      <dd className={infoboxVariants.element("value")}>{children}</dd>
    </div>
  );
});

/** Rows without a heading. */
export const InfoboxRows = /* @__PURE__ */ forwardRef<HTMLElement, HTMLAttributes<HTMLElement>>(function InfoboxRows(
  { className, children, ...rest },
  ref,
) {
  return <section ref={ref} className={cx(infoboxVariants.element("section"), className)} {...rest}><dl className={infoboxVariants.element("rows")}>{children}</dl></section>;
});

export { infoboxVariants };
