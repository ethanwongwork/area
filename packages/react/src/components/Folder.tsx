// Folder: the figure a file browser draws for a container, after macOS Finder's folder (the live icon, NSWorkspace
// icon(forFile:), macOS 27.2), in one outline look: a back panel with its tab, a sheet tucked inside, a front pocket, flat
// in the control fill with a thin edge; a count and an optional badge at the pocket's foot. The lit solid folder and its
// tones are archived (owner, round 57; docs/archive/solid-file-figures-2026-10-19.md).
// Spec: docs/specs/folder.md.
import { forwardRef } from "react";
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
  /** A number at the pocket's foot, at the end: how many items it holds. */
  count?: ReactNode;
  /** Small marks at the pocket's foot: the apps or people a folder is shared with. */
  badge?: ReactNode;
  /** Open: the pocket tips forward (its top drops and flares) and a sheet rises out of it; a drag is over the folder, or a
   *  caller opens it. */
  open?: boolean;
  /** The figure's accessible name. Without one the figure is decorative (a tile's name says what it is). */
  "aria-label"?: string;
  /** @deprecated Use `aria-label` (DESIGN_SYSTEM.md, Names: `aria-label` names the component's own element). */
  label?: string;
  /** @deprecated The solid folder is archived (owner, round 57); every folder is the outline one. Ignored. */
  variant?: "outline" | "solid";
  /** @deprecated Tones painted only the archived solid folder. Ignored. */
  tone?: string;
  /** @deprecated The sheet a solid folder showed when holding something is archived; the outline folder keeps its sheet
   *  tucked until it opens. Ignored. */
  contents?: number | readonly string[];
}

export const Folder = /* @__PURE__ */ forwardRef<HTMLSpanElement, FolderProps>(function Folder(
  { size, badge, count, open = false, "aria-label": ariaLabel, label: legacyLabel, variant: _variant, tone: _tone, contents: _contents, className, ...rest }, ref,
) {
  const label = ariaLabel ?? legacyLabel;
  return (
    <span
      ref={ref}
      className={folderVariants({ size }, className)}
      data-open={open ? "" : undefined}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : "true"}
      {...rest}
    >
      <span className="area-folder__figure">
        <svg viewBox="0 0 470 420" preserveAspectRatio="none" aria-hidden="true" focusable="false">
          <path className="area-folder__back" d={BACK} />
          {/* The back's edge before the sheet: the sheet stands inside the folder, in front of the back, its own edge whole
              where it rises past the back's top line (owner, 2026-10-19: the page "looks like its under the stroke"). */}
          <path className="area-folder__rim" d={RIM} />
          {/* The sheet: tucked below the pocket's top until the folder opens, so opening always lifts one out. */}
          <g className="area-folder__paper"><rect {...SHEET} /></g>
          <path className="area-folder__front" d={FRONT} />
        </svg>
        {badge ? <span className="area-folder__badge">{badge}</span> : null}
        {count !== undefined && count !== null ? <span className="area-folder__count">{count}</span> : null}
      </span>
    </span>
  );
});
