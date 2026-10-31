/**
 * The Inspector's shared parts (docs/PRODUCT_UI.md, rule 14). The Inspector has three views, chosen by pills in its bar
 * (src/studio.tsx, InspectorPanel; owner, 2026-10-18, after Figma's Design panel and Dev Mode): Theme, the Canvas
 * settings (src/canvas-settings.tsx); Design, what is chosen, at its narrowest (a Canvas item, else the Sidebar's row,
 * else the tab's overview); Code, how to use it. It has no title of its own (owner, 2026-10-14).
 *
 *   Selection  Design: the chosen thing's preview, if the Canvas does not already show it at size, and its
 *              actions; Code: its copy actions, two to a row
 *   Facts      one Description list on the panel's label column (src/facts.tsx), its rows in one order: Design,
 *              what it is and its values, status, source, then its purpose as a note; Code, how to reach it (name,
 *              token, import, class)
 *   CodeWell   Code: a snippet in Code block's soft inspector well, highlighted as the Stage's is; a command with
 *              its prompt
 */
import type { ReactNode, Ref } from "react";
import { AssetCard, CodeBlock, PanelSection } from "@area/react";
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
 * The selection's preview: Area's Asset card as the frame alone (containerless, no name; docs/specs/asset-card.md, after
 * Preview frame was folded in, owner 2026-10-26), square for a figure (an icon, a type role), wide when painted in the
 * colour it shows (on the transparency checker, so its alpha shows), landscape for a setting's sample. `scope` puts
 * data-area-* on the card, so its frame and what it holds take the setting it shows.
 */
export function Preview({ shape = "square", paint, scope, label, ref, children }: {
  shape?: "square" | "landscape" | "wide";
  paint?: string;
  scope?: Record<string, string>;
  label?: string;
  ref?: Ref<HTMLDivElement>;
  children?: ReactNode;
}) {
  // A colour alone paints the frame over the checker; behind other content (an image loading) it is the frame's ground.
  const colour = paint !== undefined && children == null;
  return (
    <AssetCard ref={ref} className="studio-inspector-preview" container="containerless" aspect={shape}
      fill={colour ? "checker" : undefined} color={colour ? paint : undefined} media={colour ? undefined : children}
      frameProps={paint !== undefined && !colour ? { style: { backgroundColor: paint } } : undefined}
      role={label ? "img" : undefined} aria-label={label} {...scope} />
  );
}

/**
 * A snippet in the Inspector's code well (owner, 2026-10-30, docs/research/inspector-panel-2026-10-30, "Code in the
 * Inspector"): Code block `sm` in the soft look, a fill with no edge as the panel's fields, highlighted as the Stage's
 * code is. The section's heading names it, so it has no language header; its copy shows while it is hovered or focused,
 * at 4/4 as Cursor's. Lines scroll sideways, as Dev Mode's do, so markup never breaks mid-tag, and a cut line fades at
 * the edge; `wrap` is for one long line (an import). Past LONG lines it opens as its first EXCERPT, with Show code.
 * `prompt` makes it a command ("$"), wrapped and left as typed. `language` adds the header, for code in a message.
 */
const LONG = 8; /* pick: Code block's own excerpt, so a block that fits it never collapses */
const EXCERPT = 5; /* spec: Cursor's shell output preview, 5 lines */
/** A well's line count past LONG, for its section's count (it opens as an excerpt); otherwise undefined. */
export const longLines = (code: string) => { const lines = code.split("\n").length; return lines > LONG ? lines : undefined; };
export function CodeWell({ code, language, wrap, prompt }: { code: string; language?: string; wrap?: boolean; prompt?: string }) {
  const long = longLines(code) !== undefined;
  return <CodeBlock size="sm" variant="soft" lineNumbers={false} revealActions={!language} language={language}
    {...(prompt ? { code, prompt, wrap: true } : { html: highlight(code), wrap })}
    collapsible={long} defaultCollapsed={long} collapsedLines={long ? EXCERPT : undefined} />;
}
