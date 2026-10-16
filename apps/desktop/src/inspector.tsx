/**
 * The Inspector's shared parts (docs/PRODUCT_UI.md, rule 14). Every tab's Inspector runs in one
 * order: the Canvas settings (src/canvas-settings.tsx), then what is chosen, at its narrowest:
 * a Canvas item, else the Sidebar's row, else the tab's overview. The Inspector has no title of its
 * own (owner, 2026-10-14).
 *
 *   Selection  the chosen thing's preview, if the Canvas does not already show it at size, and its
 *              copy actions, two to a row
 *   Facts      one Table (src/facts.tsx), its rows in one order: what it is called and how to
 *              reach it (name, token, import), its values, its status, what it is for, its source
 */
import type { ReactNode, Ref } from "react";
import { PanelSection, PreviewFrame } from "@area/react";

/**
 * The chosen thing's preview and actions. The actions sit two to a row; an odd last one takes the
 * whole row, as the icon hover window's do.
 */
export function Selection({ preview, children }: { preview?: ReactNode; children: ReactNode }) {
  return (
    <PanelSection>
      {preview}
      <div className="studio-inspector-actions">{children}</div>
    </PanelSection>
  );
}

/**
 * The selection's preview: Area's PreviewFrame (docs/specs/preview-frame.md), square for a figure
 * (an icon, a type role), wide when painted in the colour it shows, landscape for a setting's
 * sample. `scope` puts data-area-* on the frame, so its ground and what it holds take the setting
 * it shows.
 */
export function Preview({ shape = "square", paint, scope, label, ref, children }: {
  shape?: "square" | "landscape" | "wide";
  paint?: string;
  scope?: Record<string, string>;
  label?: string;
  ref?: Ref<HTMLDivElement>;
  children?: ReactNode;
}) {
  return (
    <PreviewFrame ref={ref} className="studio-inspector-preview" aspect={shape} color={paint} label={label} {...scope}>
      {children}
    </PreviewFrame>
  );
}
