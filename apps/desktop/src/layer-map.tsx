/**
 * The layer map (owner, 2026-10-22: "its not very clear what fills are considered belonging to certain colors during that
 * selection process. i want the visuals to make those combinations extremely clear. how the page changes, window, card,
 * side panels, nav, headers, menus"): a desktop window drawn only from the Layers roles (color/layers.ts), every region
 * tagged with its name, the layer it takes and the colour it paints now, and under it the tones in order, so a Ground or
 * Layers choice shows exactly which surfaces move and how far.
 *
 *   page      the ground itself: the window's bar, the header, the content area, a side panel     bg-page
 *   recessed  below the page in light, a half step above it in dark: the sidebar                  bg-subtle
 *   raised    toward white in light (white stays white), a full step above in dark: menus          bg-surface
 *   card      Card tone: Auto the raised layer, or a step from the page: cards                    bg-card
 *   fills     a control's rest fill, a step from the layer it sits on: a field, a nav row          bg-component
 *
 * It is drawn in the stage's scope, so the choice under the pointer repaints it, its tags read their colours again.
 */
import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { Scaled } from "./abstract.tsx";

/** A computed colour (a light-dark() pair, oklch()) as #rrggbb, read from one painted pixel. */
function hexOf(color: string, context: CanvasRenderingContext2D): string {
  context.clearRect(0, 0, 1, 1);
  context.fillStyle = color;
  context.fillRect(0, 0, 1, 1);
  const [r, g, b] = context.getImageData(0, 0, 1, 1).data;
  return `#${[r, g, b].map(channel => channel!.toString(16).padStart(2, "0")).join("")}`;
}

/** A region's tag: its name, its layer, and the colour its region paints (filled in once measured). */
function Tag({ name, layer, hex }: { name: string; layer: string; hex?: string }): ReactNode {
  return (
    <span className="lm-tag">
      <b>{name}</b><span>{layer}</span>{hex ? <code>{hex}</code> : null}
    </span>
  );
}

export function LayerMap({ theme }: { theme: "light" | "dark" }): ReactNode {
  const root = useRef<HTMLDivElement>(null);
  const [hexes, setHexes] = useState<Record<string, string>>({});
  // Each render (a new choice under the pointer), read every region's painted colour again.
  useLayoutEffect(() => {
    const context = document.createElement("canvas").getContext("2d", { willReadFrequently: true });
    if (!root.current || !context) return;
    const next: Record<string, string> = {};
    for (const node of root.current.querySelectorAll<HTMLElement>("[data-lm]")) next[node.dataset.lm!] = hexOf(getComputedStyle(node).backgroundColor, context);
    if (JSON.stringify(next) !== JSON.stringify(hexes)) setHexes(next);
  });
  const tag = (id: string, name: string, layer: string) => <Tag name={name} layer={layer} hex={hexes[id]} />;
  const dark = theme === "dark";
  return (
    <Scaled fill={0.94} max={1} group="layer-map">
      <div ref={root} className="lm" aria-hidden="true">
        <div className="lm-window">
          <div className="lm-bar" data-lm="bar">
            <span className="lm-lights"><i /><i /><i /></span>
            {tag("bar", "Window bar", "Page")}
          </div>
          <div className="lm-body">
            <div className="lm-side" data-lm="side" data-area-ground="recessed">
              {tag("side", "Sidebar", "Recessed")}
              <span className="lm-nav lm-nav--current" data-lm="nav">{tag("nav", "Nav, selected", "Fill on recessed")}</span>
              <span className="lm-nav" /><span className="lm-nav" /><span className="lm-nav" />
            </div>
            <div className="lm-main" data-lm="page">
              <div className="lm-header" data-lm="header">
                {tag("header", "Header", "Page")}
                <span className="lm-control" data-lm="header-control" />
              </div>
              {tag("page", "Page", "Ground")}
              <div className="lm-cards">
                <div className="lm-card" data-lm="card" data-area-ground="card">
                  {tag("card", "Card", "Card tone")}
                  <span className="lm-line" /><span className="lm-line lm-line--short" />
                  <span className="lm-field" data-lm="field">{tag("field", "Field", "Fill on raised")}</span>
                </div>
                <div className="lm-card" data-area-ground="card"><span className="lm-line" /><span className="lm-line lm-line--short" /><span className="lm-line" /></div>
              </div>
              <div className="lm-menu" data-lm="menu" data-area-ground="raised">
                {tag("menu", "Menu", "Raised, floating")}
                <span className="lm-nav" /><span className="lm-nav lm-nav--hover" /><span className="lm-nav" />
              </div>
            </div>
            <div className="lm-inspector" data-lm="inspector">
              {tag("inspector", "Side panel", "Page")}
              <span className="lm-field lm-field--page" data-lm="inspector-field">{tag("inspector-field", "Field", "Fill on page")}</span>
              <span className="lm-field lm-field--page" />
            </div>
          </div>
        </div>
        {/* The tones in order: how far each layer sits from the page, the step the Layers setting sets. */}
        <div className="lm-strip">
          {(dark
            ? [["strip-page", "Page", "the ground", "page"], ["strip-recessed", "Recessed", "a half step up", "recessed"], ["strip-raised", "Raised", "a full step up", "raised"], ["strip-fill", "Control fill", "a step from its layer", "fill"]]
            : [["strip-recessed", "Recessed", "a step down", "recessed"], ["strip-page", "Page", "the ground", "page"], ["strip-raised", "Raised", "toward white", "raised"], ["strip-fill", "Control fill", "a step from its layer", "fill"]]
          ).map(([id, name, note, role]) => (
            <span key={id} className="lm-tone">
              <span className={`lm-swatch lm-swatch--${role}`} data-lm={id} />
              <b>{name}</b><span>{note}</span><code>{hexes[id!] ?? ""}</code>
            </span>
          ))}
        </div>
      </div>
    </Scaled>
  );
}
