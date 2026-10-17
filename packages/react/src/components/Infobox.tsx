// Infobox: a subject at a glance beside an article (Wikipedia's infobox). docs/specs/infobox.md.
import { forwardRef } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import { cx, infoboxVariants, type VariantProps, MANIFESTS } from "../variants.ts";

type InfoboxVariants = VariantProps<typeof MANIFESTS.infobox>;

export interface InfoboxProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  /** The subject's name, centred at the top. */
  title: ReactNode;
  /** A line under the title: a role, a short description. */
  subtitle?: ReactNode;
  /** An image (or other media), centred under the title. */
  media?: ReactNode;
  /** The media's caption. */
  caption?: ReactNode;
  /** Beside the text: floated to the `end` or `start`, as Wikipedia's. */
  align?: InfoboxVariants["align"];
  /** Rows (`InfoboxRow`) and sections (`InfoboxSection`). */
  children?: ReactNode;
}

export const Infobox = /* @__PURE__ */ forwardRef<HTMLElement, InfoboxProps>(function Infobox(
  { title, subtitle, media, caption, align, className, children, "aria-label": ariaLabel, ...rest },
  ref,
) {
  return (
    <aside ref={ref} className={infoboxVariants({ align }, className)} aria-label={ariaLabel ?? (typeof title === "string" ? title : undefined)} {...rest}>
      <div className={infoboxVariants.element("title")}>{title}</div>
      {subtitle ? <div className={infoboxVariants.element("subtitle")}>{subtitle}</div> : null}
      {media ? (
        <figure className={infoboxVariants.element("media")}>
          {media}
          {caption ? <figcaption className={infoboxVariants.element("caption")}>{caption}</figcaption> : null}
        </figure>
      ) : null}
      {children}
    </aside>
  );
});

export interface InfoboxSectionProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  /** The band over the section's rows ("Personal details"). */
  title?: ReactNode;
  children?: ReactNode;
}

/** A titled run of rows. Rows outside a section need no wrapper of their own: Infobox lists them as they come. */
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

/** A label and its value. Put rows in an `InfoboxSection` (or an `InfoboxRows`), which makes the `dl`. */
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

/** Rows without a section title. */
export const InfoboxRows = /* @__PURE__ */ forwardRef<HTMLDListElement, HTMLAttributes<HTMLDListElement>>(function InfoboxRows(
  { className, ...rest },
  ref,
) {
  return <dl ref={ref} className={cx(infoboxVariants.element("rows"), className)} {...rest} />;
});

export { infoboxVariants };
