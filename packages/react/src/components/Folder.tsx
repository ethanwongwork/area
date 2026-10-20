// Folder: the figure a file browser draws for a container, styled as macOS Finder's folder (the live icon,
// NSWorkspace icon(forFile:), macOS 27.2): a back panel with its tab, one straight sheet peeking out when it holds
// something, a front pocket, soft top-lit gradients and a shadow under it; an optional badge at the pocket's foot.
// Spec: docs/specs/folder.md.
import { forwardRef, useId } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import { folderVariants, type VariantProps, MANIFESTS } from "../variants.ts";

/*
 * Finder's folder made rounder and fuller (owner, 2026-10-18: "more round … the dimensions less realistic, more
 * large"), in a 470 × 420 box (Finder's is 470 × 378): the tab rises 40 above the back, runs to 150 and eases down to
 * 214; the pocket starts 88 down (21%); corners 56, twice Finder's 28.
 */
const BACK = "M0 56Q0 0 56 0H150C170 0 178 12 186 24C194 35 200 40 214 40H414Q470 40 470 96V364Q470 420 414 420H56Q0 420 0 364Z";
/* The outline's back edge: only where the back shows, from the pocket's straight sides (y 144, where its corners end) up
   round the tab, so no edge is drawn twice where the back and the pocket meet (owner, 2026-10-18: the strokes "appear to
   double up on the bottom"; Phosphor and Fluent draw the seam as one band). */
const RIM = "M0 144V56Q0 0 56 0H150C170 0 178 12 186 24C194 35 200 40 214 40H414Q470 40 470 96V144";
/* The pocket, as a path so the open state can reshape it (folder.css): a 470 × 332 rectangle 88 down, corners 56. */
const FRONT = "M0 144Q0 88 56 88L414 88Q470 88 470 144L470 364Q470 420 414 420L56 420Q0 420 0 364Z";
/* The sheet: 22 in from each side, its top 54 down, just under the back's top line; it runs on behind the pocket. Its
   corners are concentric with the folder's (56 less the 22 inset; owner: "the folder and the paper inside radius … a
   bit closer"). */
const SHEET = { x: 22, y: 54, width: 426, height: 220, rx: 34 } as const;

type FolderVariants = VariantProps<typeof MANIFESTS.folder>;

export interface FolderProps extends Omit<HTMLAttributes<HTMLSpanElement>, "children"> {
  /** sm 48, md 64 (Finder's icon view), lg 96. Unset, it follows `--area-folder-size` (a File tile's figure). */
  size?: FolderVariants["size"];
  /** The solid folder's colour: Finder's blue (default), neutral, or one of the palette's hues at Finder's lightness. */
  tone?: FolderVariants["tone"];
  /**
   * outline (default; owner, 2026-10-18: "make the outline appearance the default"): the back and the pocket flat in
   * control fill (`bg-component`) with a thin whole-pixel edge and a sheet tucked inside, no shadow. solid: Finder's lit folder, back, sheet and pocket, in `tone`.
   */
  variant?: FolderVariants["variant"];
  /** A number at the pocket's foot, at the end: how many items it holds. */
  count?: ReactNode;
  /**
   * What the solid folder holds: with anything in it one straight sheet peeks out over the pocket. A number (how many
   * items) draws a plain sheet; image URLs draw the first one on the sheet. Nothing by default, as Finder's empty folder.
   */
  contents?: number | readonly string[];
  /** Small marks at the pocket's foot: the apps or people a folder is shared with. */
  badge?: ReactNode;
  /** Open: the pocket tips forward (its top drops and flares) and a sheet rises out of it; a drag is over the folder, or a
   *  caller opens it. */
  open?: boolean;
  /** The figure's accessible name. Without one the figure is decorative (a tile's name says what it is). */
  label?: string;
}

export const Folder = /* @__PURE__ */ forwardRef<HTMLSpanElement, FolderProps>(function Folder(
  { size, tone, variant, contents, badge, count, open = false, label, className, ...rest }, ref,
) {
  const outline = variant !== "solid";
  const id = useId().replace(/[^A-Za-z0-9_-]/g, "");
  const image = typeof contents === "number" ? undefined : contents?.[0];
  const holds = typeof contents === "number" ? contents > 0 : Boolean(contents?.length);
  return (
    <span
      ref={ref}
      className={folderVariants({ size, tone, variant }, className)}
      data-open={open ? "" : undefined}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : "true"}
      {...rest}
    >
      <span className="area-folder__figure">
        <svg viewBox="0 0 470 420" preserveAspectRatio="none" aria-hidden="true" focusable="false">
          <defs>
            {/* Lit from the top: the back from its tab to the pocket, the pocket from its top to its foot. */}
            <linearGradient id={`${id}-back`} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="88">
              <stop offset="0" style={{ stopColor: "var(--_back-top)" }} />
              <stop offset="1" style={{ stopColor: "var(--_back)" }} />
            </linearGradient>
            <linearGradient id={`${id}-front`} gradientUnits="userSpaceOnUse" x1="0" y1="88" x2="0" y2="420">
              <stop offset="0" style={{ stopColor: "var(--_front-top)" }} />
              <stop offset="1" style={{ stopColor: "var(--_front)" }} />
            </linearGradient>
            {/* The pocket's lips, 1px at every size: light along its top, a shade along its foot (Finder and Fluent). */}
            <linearGradient id={`${id}-lip`} gradientUnits="userSpaceOnUse" x1="0" y1="88" x2="0" y2="420">
              <stop offset="0" style={{ stopColor: "var(--_lip-top)" }} />
              <stop offset="0.12" style={{ stopColor: "var(--_lip-top)", stopOpacity: 0 }} />
              <stop offset="0.88" style={{ stopColor: "var(--_lip-foot)", stopOpacity: 0 }} />
              <stop offset="1" style={{ stopColor: "var(--_lip-foot)" }} />
            </linearGradient>
            {image ? <clipPath id={`${id}-sheet`}><rect {...SHEET} /></clipPath> : null}
          </defs>
          <path className="area-folder__back" d={BACK} fill={outline ? undefined : `url(#${id}-back)`} />
          {/* The back's edge before the sheet: the sheet stands inside the folder, in front of the back, its own edge whole
              where it rises past the back's top line (owner, 2026-10-19: the page "looks like its under the stroke"). */}
          {outline ? <path className="area-folder__rim" d={RIM} /> : null}
          {/* The sheet: shown at rest by a solid folder that holds something; otherwise tucked below the pocket's top until
              the folder opens, so opening always lifts one out. */}
          {outline || holds || open ? (
            <g className="area-folder__paper" data-tucked={outline || !holds ? "" : undefined}>
              <rect {...SHEET} />
              {image ? <image href={image} x={SHEET.x} y={SHEET.y} width={SHEET.width} height={SHEET.height} preserveAspectRatio="xMidYMin slice" clipPath={`url(#${id}-sheet)`} /> : null}
            </g>
          ) : null}
          <path className="area-folder__front" d={FRONT} fill={outline ? undefined : `url(#${id}-front)`} stroke={outline ? undefined : `url(#${id}-lip)`} />
        </svg>
        {badge ? <span className="area-folder__badge">{badge}</span> : null}
        {count !== undefined && count !== null ? <span className="area-folder__count">{count}</span> : null}
      </span>
    </span>
  );
});
