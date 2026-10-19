// FilePage: the figure a file browser draws for a file, Folder's sibling, after macOS Finder's document icon (the live
// icon, NSWorkspace icon(forFile:), macOS 27.2): a pale page with its top corner folded, the file's type glyph in the
// middle and its extension under it. Made rounder, fuller and softer as Area's Folder is. Spec: docs/specs/folder.md.
import { forwardRef, useId } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import { filePageVariants, type VariantProps, MANIFESTS } from "../variants.ts";

/*
 * The page in a 360 × 440 box (Finder's is 344 × 454 of its 512 cell, a fold 35–37% of its width, corners 12). Its
 * corners are 40, 11% of its width: Folder's corner is 1.4× the page's on screen, as Finder's (27 vs 14 at 512) and
 * within the 9–13% outline sets draw (survey, 2026-10-18). The fold takes 120 (33%) of the top corner along one
 * diagonal, creasing round.
 */
const PAGE = "M40 0H232Q240 0 246 6L354 114Q360 120 360 128V400Q360 440 320 440H40Q0 440 0 400V40Q0 0 40 0Z";
/* The folded flap shares the page's one diagonal (246,6 → 354,114) and creases round at 32. FOLD fills it; FOLD_EDGE is
   its two inner edges, the only lines an outline adds, so the diagonal is drawn once (owner: "the fold stroke for the
   document is doubled"). */
const FOLD = "M246 6V82Q246 114 278 114H354Z";
const FOLD_EDGE = "M246 6V82Q246 114 278 114H354";
/* The outline's edge, open at the fold, and the diagonal on its own, both drawn after the flap's fill. When the page's
   closed path carried the diagonal, the flap was painted over it and hid the inner half of that stroke: measured in a 2×
   capture, the diagonal laid down 1.6 device pixels of ink per pixel of length against the straight edges' 2.0. Drawn
   last at the same width it measures 2.17, with the crease 2.21 and the edges 2.0–2.3 (owner, 2026-10-18: "i just want
   all the strokes to be the same weight … does this look equal to you?"). */
const EDGE = "M354 114Q360 120 360 128V400Q360 440 320 440H40Q0 440 0 400V40Q0 0 40 0H232Q240 0 246 6";
const DIAGONAL = "M246 6L354 114";

type FilePageVariants = VariantProps<typeof MANIFESTS.filePage>;

export interface FilePageProps extends Omit<HTMLAttributes<HTMLSpanElement>, "children"> {
  /** sm 48, md 64 (Finder's icon view), lg 96, as Folder. Unset, it follows `--area-folder-size` (a File tile's figure). */
  size?: FilePageVariants["size"];
  /** The file's type glyph, drawn thin in the page's middle: an `@area/icons` icon (FilePdfIcon, ImageIcon …). */
  icon?: ReactNode;
  /** The file's extension under the glyph, as Finder prints it: "PDF", "DOCX". */
  label?: string;
  /** An image of the file (a thumbnail) to fill the page instead of the glyph. */
  preview?: string;
  /** The figure's accessible name. Without one the figure is decorative (a tile's name says what it is). */
  name?: string;
  /** outline (default): a flat grey page with a thin light edge, as Folder's outline. solid: the lit page, as Folder's solid. */
  variant?: FilePageVariants["variant"];
}

export const FilePage = /* @__PURE__ */ forwardRef<HTMLSpanElement, FilePageProps>(function FilePage(
  { size, icon, label, preview, name, variant, className, ...rest }, ref,
) {
  const id = useId().replace(/[^A-Za-z0-9_-]/g, "");
  return (
    <span
      ref={ref}
      className={filePageVariants({ size, variant }, className)}
      role={name ? "img" : undefined}
      aria-label={name}
      aria-hidden={name ? undefined : "true"}
      {...rest}
    >
      <span className="area-file-page__figure">
        <svg viewBox="0 0 360 440" preserveAspectRatio="none" aria-hidden="true" focusable="false">
          <defs>
            <linearGradient id={`${id}-page`} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="440">
              <stop offset="0" style={{ stopColor: "var(--_page-top)" }} />
              <stop offset="1" style={{ stopColor: "var(--_page)" }} />
            </linearGradient>
            {/* The flap's back catches the light at its edge and shades toward its crease. */}
            <linearGradient id={`${id}-fold`} gradientUnits="userSpaceOnUse" x1="246" y1="114" x2="300" y2="60">
              <stop offset="0" style={{ stopColor: "var(--_fold-crease)" }} />
              <stop offset="1" style={{ stopColor: "var(--_fold)" }} />
            </linearGradient>
            {preview ? <clipPath id={`${id}-preview`}><path d={PAGE} /></clipPath> : null}
          </defs>
          <path className="area-file-page__sheet" d={PAGE} fill={variant !== "solid" ? undefined : `url(#${id}-page)`} />
          {preview ? <image href={preview} x="0" y="0" width="360" height="440" preserveAspectRatio="xMidYMid slice" clipPath={`url(#${id}-preview)`} /> : null}
          <path className="area-file-page__fold" d={FOLD} fill={variant !== "solid" ? undefined : `url(#${id}-fold)`} />
          {variant !== "solid" ? <>
            <path className="area-file-page__edge" d={EDGE} />
            <path className="area-file-page__crease" d={FOLD_EDGE} />
            <path className="area-file-page__diagonal" d={DIAGONAL} />
          </> : null}
        </svg>
        {/* The glyph and the extension, centred together on the page (owner: "more centered together"). */}
        {!preview && (icon || label) ? (
          <span className="area-file-page__content">
            {icon ? <span className="area-file-page__icon">{icon}</span> : null}
            {label ? <span className="area-file-page__label">{label}</span> : null}
          </span>
        ) : null}
      </span>
    </span>
  );
});
