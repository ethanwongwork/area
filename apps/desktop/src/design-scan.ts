/**
 * What a design on the stage is made of, read from what it draws (the design interface's Specs and Checks tabs,
 * src/design-panel.tsx; owner, 2026-11-06). Every value is the browser's computed style of the rendered design, never a
 * value written down beside it, so the tabs say what the screen really is in the project's theme and mode:
 *
 *   specs   the frame, the type styles (size, line, weight, face) with how often each is used, the colors as ink, fill
 *           and edge, and the corners
 *   checks  text under WCAG's contrast floor (4.5:1, 3:1 for large text), images without alt text, and controls and
 *           fields without a name
 *
 * The scan reads the design laid out unscaled (the viewer scales it with a transform, which no computed style sees).
 */

export interface TypeStyle { size: number; line: string; weight: number; face: string; count: number; sample: string }
export interface ColorUse { value: string; ink: number; fill: number; edge: number }
export interface Corner { value: string; count: number }
export interface DesignSpecs { width: number; height: number; elements: number; type: TypeStyle[]; colors: ColorUse[]; corners: Corner[] }

export type CheckKind = "contrast" | "alt" | "name" | "label";
export interface CheckIssue { kind: CheckKind; what: string; detail: string; ratio?: number }
export interface DesignChecks { texts: number; checked: number; issues: CheckIssue[] }

type Rgba = [number, number, number, number];

let ink: CanvasRenderingContext2D | null = null;
/** Any CSS color the browser knows (oklch, color-mix, light-dark resolved), as sRGB 0–255 and alpha 0–1. */
export function rgbaOf(css: string): Rgba | null {
  if (!css || css === "transparent") return [0, 0, 0, 0];
  ink ??= document.createElement("canvas").getContext("2d", { willReadFrequently: true });
  if (!ink) return null;
  ink.clearRect(0, 0, 1, 1);
  ink.fillStyle = "#00000000";
  ink.fillStyle = css;
  ink.fillRect(0, 0, 1, 1);
  const [r, g, b, a] = ink.getImageData(0, 0, 1, 1).data;
  return [r!, g!, b!, a! / 255];
}

const hex = (value: number) => Math.round(value).toString(16).padStart(2, "0");
/** #rrggbb, or #rrggbb at a percentage when translucent. */
export function colorName([r, g, b, a]: Rgba): string {
  const solid = `#${hex(r)}${hex(g)}${hex(b)}`;
  return a >= 0.995 ? solid : `${solid} ${Math.round(a * 100)}%`;
}

/** `top` over `under`, both straight alpha. */
function over(top: Rgba, under: Rgba): Rgba {
  const a = top[3] + under[3] * (1 - top[3]);
  if (a === 0) return [0, 0, 0, 0];
  const mix = (i: 0 | 1 | 2) => (top[i] * top[3] + under[i] * under[3] * (1 - top[3])) / a;
  return [mix(0), mix(1), mix(2), a];
}

const channel = (value: number) => { const c = value / 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
const luminance = ([r, g, b]: Rgba) => 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
/** WCAG 2's contrast ratio of two opaque colors. */
export function contrast(a: Rgba, b: Rgba): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
  return (hi + 0.05) / (lo + 0.05);
}

const visible = (element: Element) => element.getClientRects().length > 0 && getComputedStyle(element).visibility !== "hidden";
/** The element's own words: its text nodes, not its children's. */
const ownText = (element: Element) => [...element.childNodes].filter(node => node.nodeType === Node.TEXT_NODE).map(node => node.textContent ?? "").join("").replace(/\s+/g, " ").trim();
const short = (text: string, length = 40) => text.length > length ? `${text.slice(0, length - 1)}…` : text;
const tagOf = (element: Element) => element.getAttribute("role") ?? element.tagName.toLowerCase();

/**
 * The paint behind an element: its own background and its ancestors', composited from the first opaque one up, or null
 * when a picture or gradient is behind it (its contrast can't be read from colors alone).
 */
function backdrop(element: Element): Rgba | null {
  const layers: Rgba[] = [];
  for (let at: Element | null = element; at; at = at.parentElement) {
    const style = getComputedStyle(at);
    if (style.backgroundImage && style.backgroundImage !== "none") return null;
    const paint = rgbaOf(style.backgroundColor);
    if (paint && paint[3] > 0) layers.push(paint);
    if (paint && paint[3] >= 0.995) break;
  }
  let result: Rgba = [255, 255, 255, 1];
  for (const layer of layers.reverse()) result = over(layer, result);
  return result;
}

/** The design's specs: read from its root (the viewer's first screen). */
export function readSpecs(root: Element): DesignSpecs {
  const box = root.getBoundingClientRect();
  const scale = root instanceof HTMLElement && root.offsetWidth ? box.width / root.offsetWidth : 1;
  const type = new Map<string, TypeStyle>();
  const colors = new Map<string, ColorUse>();
  const corners = new Map<string, number>();
  const use = (css: string, as: "ink" | "fill" | "edge") => {
    const value = rgbaOf(css);
    if (!value || value[3] === 0) return;
    const name = colorName(value);
    const entry = colors.get(name) ?? { value: name, ink: 0, fill: 0, edge: 0 };
    entry[as]++;
    colors.set(name, entry);
  };
  const elements = [...root.querySelectorAll("*")].filter(visible);
  for (const element of elements) {
    const style = getComputedStyle(element);
    const words = ownText(element);
    if (words) {
      const size = parseFloat(style.fontSize);
      const weight = Number(style.fontWeight) || 400;
      const face = style.fontFamily.split(",")[0]!.replace(/["']/g, "").trim();
      const line = style.lineHeight === "normal" ? "normal" : `${Math.round(parseFloat(style.lineHeight) * 10) / 10}`;
      const key = `${size}/${line}/${weight}/${face}`;
      const entry = type.get(key) ?? { size, line, weight, face, count: 0, sample: short(words, 32) };
      entry.count++;
      type.set(key, entry);
      use(style.color, "ink");
    }
    use(style.backgroundColor, "fill");
    if (parseFloat(style.borderTopWidth) > 0 && style.borderTopStyle !== "none") use(style.borderTopColor, "edge");
    const radius = style.borderTopLeftRadius;
    if (radius && radius !== "0px") corners.set(radius, (corners.get(radius) ?? 0) + 1);
  }
  const total = (entry: ColorUse) => entry.ink + entry.fill + entry.edge;
  return {
    width: Math.round(box.width / scale), height: Math.round(box.height / scale), elements: elements.length,
    type: [...type.values()].sort((a, b) => b.size - a.size || b.weight - a.weight || b.count - a.count),
    colors: [...colors.values()].sort((a, b) => total(b) - total(a)),
    corners: [...corners.entries()].map(([value, count]) => ({ value, count })).sort((a, b) => parseFloat(a.value) - parseFloat(b.value)),
  };
}

/** A control's or field's name, as assistive technology would find it (enough of the rules to catch a missing one). */
function named(element: Element): boolean {
  if (element.getAttribute("aria-label")?.trim() || element.getAttribute("aria-labelledby") || element.getAttribute("title")?.trim()) return true;
  if ((element as HTMLElement).innerText?.trim()) return true;
  if (element.querySelector("img[alt]:not([alt=''])")) return true;
  const id = element.getAttribute("id");
  if (id && element.ownerDocument.querySelector(`label[for="${CSS.escape(id)}"]`)) return true;
  return Boolean(element.closest("label"));
}

/** The design's checks: contrast of every visible text, images' alt text, controls' and fields' names. */
export function readChecks(root: Element): DesignChecks {
  const issues: CheckIssue[] = [];
  let texts = 0, checked = 0;
  for (const element of root.querySelectorAll("*")) {
    if (!visible(element) || element.closest("[aria-hidden='true']")) continue;
    const words = ownText(element);
    if (words) {
      texts++;
      const style = getComputedStyle(element);
      const color = rgbaOf(style.color);
      const behind = backdrop(element);
      if (color && behind && color[3] > 0) {
        checked++;
        const ratio = contrast(over(color, behind), behind);
        const size = parseFloat(style.fontSize), weight = Number(style.fontWeight) || 400;
        const large = size >= 24 || (size >= 18.66 && weight >= 700);
        const floor = large ? 3 : 4.5;
        // Placeholder text and a disabled control's words are exempt (WCAG 1.4.3's incidental text).
        const exempt = element.closest(":disabled, [aria-disabled='true'], [data-disabled]");
        if (ratio < floor && !exempt) issues.push({ kind: "contrast", what: short(words), detail: `${Math.round(ratio * 100) / 100}:1, needs ${floor}:1 at ${Math.round(size * 10) / 10}px`, ratio });
      }
    }
    if (element.tagName === "IMG" && !element.hasAttribute("alt")) issues.push({ kind: "alt", what: "Image", detail: short(element.getAttribute("src")?.split("/").pop() ?? "no source") });
    if (element.matches("button, a[href], [role='button'], [role='link'], [role='tab'], [role='menuitem']") && !named(element)) issues.push({ kind: "name", what: tagOf(element), detail: "No name: no words, aria-label or title" });
    if (element.matches("input:not([type='hidden']), select, textarea") && !named(element) && !element.getAttribute("placeholder")) issues.push({ kind: "label", what: tagOf(element), detail: "No label" });
  }
  return { texts, checked, issues };
}
