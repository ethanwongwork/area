/**
 * The Inspector's Code view, measured (owner, 2026-10-18: "a figma style panel based on dev mode"): the specimen on the
 * Stage read back from the page, as Figma's Dev Mode reads a layer. Its box (margin, border, padding, corners, size)
 * draws in Area's Box model; its paint (type, ink, fill, edge, lift) lists in a facts Table. The first Area component
 * in the Stage is the specimen's root (a demo may wrap it in a row of its own).
 *
 * Values are the browser's computed ones under the Canvas's settings, so changing a setting re-measures (the Canvas body's
 * data-area-* attributes are watched, and the root's size). Lengths are CSS pixels before the Stage's zoom.
 */
import { useLayoutEffect, useState } from "react";
import { BoxModel, Code, ColorSwatch, PanelSection } from "@area/react";
import { Facts } from "./facts.tsx";

type Sides = readonly [number, number, number, number];
interface Measured {
  name: string;
  margin: Sides; border: Sides; padding: Sides; radius: Sides;
  width: number; height: number; sizing: string;
  font: string; color: string; background: string; edge: string; shadow: number;
}

const px = (value: string) => Number.parseFloat(value) || 0;
const round = (value: number) => Math.round(value * 100) / 100;
const sides = (style: CSSStyleDeclaration, read: (side: string) => string): Sides =>
  ["top", "right", "bottom", "left"].map(side => round(px(read(side)))) as unknown as Sides;
const transparent = (color: string) => /^(transparent|rgba\(0, 0, 0, 0\))$|\/ 0\)$/.test(color.trim());
/** The shadow's layers that paint (a role keeps transparent slots). */
const painted = (shadow: string) => shadow === "none" ? 0 : shadow.split(/,(?![^(]*\))/).filter(layer => !/rgba\(0, 0, 0, 0\)|\/ 0\)/.test(layer)).length;

function measure(): Measured | null {
  const root = document.querySelector<HTMLElement>(".studio-stage__content [class^='area-'], .studio-stage__content [class*=' area-']");
  if (!root) return null;
  const style = getComputedStyle(root);
  const border = sides(style, side => style.getPropertyValue(`border-${side}-width`));
  const padding = sides(style, side => style.getPropertyValue(`padding-${side}`));
  // The used width and height, as the border box (Figma's frame size), whatever box-sizing says.
  const contentBox = style.boxSizing === "content-box";
  const width = px(style.width) + (contentBox ? padding[1] + padding[3] + border[1] + border[3] : 0);
  const height = px(style.height) + (contentBox ? padding[0] + padding[2] + border[0] + border[2] : 0);
  return {
    name: [...root.classList].find(name => name.startsWith("area-") && !name.includes("--")) ?? root.classList[0] ?? root.tagName.toLowerCase(),
    margin: sides(style, side => style.getPropertyValue(`margin-${side}`)),
    border, padding,
    radius: [style.borderTopLeftRadius, style.borderTopRightRadius, style.borderBottomRightRadius, style.borderBottomLeftRadius].map(value => round(px(value))) as unknown as Sides,
    width: round(width), height: round(height), sizing: style.boxSizing,
    font: `${round(px(style.fontSize))} / ${round(px(style.lineHeight)) || style.lineHeight}, weight ${style.fontWeight}`,
    color: style.color, background: style.backgroundColor, edge: border.some(Boolean) ? style.borderTopColor : "",
    shadow: painted(style.boxShadow),
  };
}

const same = (a: Measured | null, b: Measured | null) => JSON.stringify(a) === JSON.stringify(b);

/** A computed colour as hex, as Figma lists colours (#RRGGBB, or #RRGGBBAA when translucent): the browser paints it
 * into one pixel and reads it back, so any CSS colour (oklch, oklab, color-mix) resolves the same way. */
let pixel: CanvasRenderingContext2D | null = null;
function hex(color: string): string {
  pixel ??= Object.assign(document.createElement("canvas"), { width: 1, height: 1 }).getContext("2d", { willReadFrequently: true });
  if (!pixel) return color;
  pixel.clearRect(0, 0, 1, 1);
  pixel.fillStyle = color;
  pixel.fillRect(0, 0, 1, 1);
  const [r, g, b, a] = pixel.getImageData(0, 0, 1, 1).data;
  const two = (n: number) => n.toString(16).padStart(2, "0");
  return `#${two(r!)}${two(g!)}${two(b!)}${a === 255 ? "" : two(a!)}`.toUpperCase();
}

/** The Stage specimen's box and paint, for the Code view. `watch` re-measures when what the Stage shows changes. */
export function SpecimenBox({ watch }: { watch: string }) {
  const [box, setBox] = useState<Measured | null>(null);
  useLayoutEffect(() => {
    let timer = 0;
    let sized: Element | null = null;
    const size = new ResizeObserver(() => update());
    const update = () => {
      // A task, not an animation frame: a window in the background runs no frames, and the view would stay empty.
      clearTimeout(timer);
      timer = window.setTimeout(() => {
        // The Stage may mount after this view (the Code view open as a page loads): follow it once it is there.
        const content = document.querySelector(".studio-stage__content");
        if (content !== sized) { if (sized) size.unobserve(sized); if (content) size.observe(content); sized = content; }
        setBox(current => { const next = measure(); return same(current, next) ? current : next; });
      }, 0);
    };
    update();
    // The Canvas body is always there: its settings (data-area-*) and what it holds (the Stage, a configured instance).
    const body = document.querySelector(".studio-canvas__body");
    const settings = new MutationObserver(update);
    const tree = new MutationObserver(update);
    if (body) {
      settings.observe(body, { attributes: true });
      tree.observe(body, { childList: true, subtree: true, attributes: true, attributeFilter: ["class", "style"] });
    }
    return () => { clearTimeout(timer); settings.disconnect(); tree.disconnect(); size.disconnect(); };
  }, [watch]);
  if (!box) return null;
  const swatch = (color: string) => transparent(color) ? <span className="studio-muted">None</span>
    : <span className="studio-inspector-color"><ColorSwatch color={color} size="sm" aria-hidden="true" /><Code>{hex(color)}</Code></span>;
  return (
    <>
      <PanelSection heading="Layer properties">
        <BoxModel margin={box.margin} border={box.border} padding={box.padding} radius={box.radius}
           width={box.width} height={box.height} caption={box.sizing} />
      </PanelSection>
      <PanelSection heading="Style">
        <Facts label="Style" items={[
          ["Class", <span className="studio-mono">.{box.name}</span>],
          ["Type", box.font],
          ["Ink", swatch(box.color)],
          ["Fill", swatch(box.background)],
          box.edge ? ["Edge", swatch(box.edge)] : null,
          ["Shadow", box.shadow ? `${box.shadow} layer${box.shadow === 1 ? "" : "s"}` : <span className="studio-muted">None</span>],
        ]} />
      </PanelSection>
    </>
  );
}
