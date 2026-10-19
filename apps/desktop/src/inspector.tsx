/**
 * The Inspector's shared parts (docs/PRODUCT_UI.md, rule 14). The Inspector has three views, chosen by pills in its bar
 * (src/studio.tsx, InspectorPanel; owner, 2026-10-18, after Figma's Design panel and Dev Mode): Theme, the Canvas
 * settings (src/canvas-settings.tsx); Design, what is chosen, at its narrowest (a Canvas item, else the Sidebar's row,
 * else the tab's overview); Code, how to use it. It has no title of its own (owner, 2026-10-14).
 *
 *   Selection  Design: the chosen thing's preview, if the Canvas does not already show it at size, and its
 *              actions; Code: its copy actions, two to a row
 *   Facts      one Table (src/facts.tsx), its rows in one order: Design, what it is and its values, status,
 *              purpose, source; Code, how to reach it (name, token, import, class)
 *   CodeWell   Code: a snippet in Code block's inspector well, highlighted as the Stage's is
 */
import type { ReactNode, Ref } from "react";
import { CodeBlock, PanelSection, PreviewFrame } from "@area/react";
// @ts-expect-error — the highlighter is authored in JavaScript.
import { highlight } from "./content/highlight.mjs";

/**
 * The chosen thing's preview and actions. The actions sit two to a row; an odd last one takes the
 * whole row, as the icon hover window's do.
 */
export function Selection({ preview, children }: { preview?: ReactNode; children?: ReactNode }) {
  return (
    <PanelSection>
      {preview}
      {children ? <div className="studio-inspector-actions">{children}</div> : null}
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

/**
 * A snippet in the Inspector's code well (Code block `sm`), highlighted as the Stage's code is, with its copy control.
 * Lines scroll sideways, as Dev Mode's do, so markup never breaks mid-tag; `wrap` is for one long line (an import).
 */
export function CodeWell({ code, language = "tsx", wrap }: { code: string; language?: string; wrap?: boolean }) {
  return <CodeBlock size="sm" lineNumbers={false} language={language} html={highlight(code)} wrap={wrap} />;
}
