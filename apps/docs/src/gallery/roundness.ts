/**
 * The corner radius page: each row is one specimen, laid out at every radius setting (Sharp, 2 ...
 * 14, Pill; axes/radius.ts) in its own scope, measured, and trimmed to the steps that say
 * something: Sharp, then every step up to the first pill. Each cell shows the painted corner
 * magnified at the row's shared scale, so the steps compare; inset rows also draw the shell, the
 * concentric corner it implies and the nested shape.
 */

const STEPS = ["0", "2", "4", "6", "8", "10", "12", "14", "pill"];
const DEFAULT_STEP = "8";
const stepLabel = (step: string) => (step === "0" ? "0 Sharp" : step === "pill" ? "Pill" : step);
const SVG = "http://www.w3.org/2000/svg";
const LOUPE = 64;

interface Corner { r: number; d: number }
interface Measure { r: number; outer: number; pill: boolean; inner?: Corner }

const radiusOf = (el: Element) => {
  const style = getComputedStyle(el);
  return Math.max(...(["borderTopLeftRadius", "borderTopRightRadius", "borderBottomLeftRadius", "borderBottomRightRadius"] as const)
    .map(key => parseFloat(style[key]) || 0));
};
const isPill = (el: HTMLElement) => radiusOf(el) >= Math.min(el.offsetWidth, el.offsetHeight) / 2 - 0.5;

const PARTS = '[class*="area-"], [role]';

/* The specimen's own outermost corner, found once at the default step: the first painted,
   rounded part (an Area element, or a component's unclassed role element such as a tree row).
   Returned as its index among the parts, so every copy measures the same element even where it
   has gone square or pill. A part whose only rounded paint is a pseudo-element pill (Tabs'
   indicator) is round at every step. */
function mainShape(stage: HTMLElement): { index: number; round: boolean } | null {
  const parts = [...stage.querySelectorAll<HTMLElement>(PARTS)];
  let pill: { index: number; round: boolean } | null = null;
  for (const [index, el] of parts.entries()) {
    if (!el.offsetWidth || el.closest("svg") || el.classList.contains("area-sr-only")) continue;
    if (radiusOf(el) <= 0) {
      if (!pill && (["::before", "::after"] as const).some(part => { const style = getComputedStyle(el, part); return style.content !== "none" && parseFloat(style.borderTopLeftRadius) >= 999; })) pill = { index, round: true };
      continue;
    }
    if (isPill(el)) { pill ??= { index, round: true }; continue; }
    return { index, round: false };
  }
  return pill;
}

/* The nested shape nearest its shell's edge, and its inset from that edge. */
function nested(stage: HTMLElement, outerSelector: string, innerSelector: string): { shell: HTMLElement; part: HTMLElement; inner: Corner } | null {
  const shell = stage.querySelector<HTMLElement>(outerSelector);
  if (!shell) return null;
  const box = shell.getBoundingClientRect();
  let best: { part: HTMLElement; inner: Corner } | null = null;
  for (const part of stage.querySelectorAll<HTMLElement>(innerSelector)) {
    if (!part.offsetWidth || part === shell) continue;
    const rect = part.getBoundingClientRect();
    const d = Math.min(rect.left - box.left, box.right - rect.right);
    if (d < 0) continue;
    if (!best || d < best.inner.d) best = { part, inner: { r: radiusOf(part), d: Math.round(d * 10) / 10 } };
  }
  return best ? { shell, ...best } : null;
}

const fmt = (n: number) => String(Math.round(n * 10) / 10);

/* A top-left corner of radius r, inset d, in a view `size` units wide. */
const cornerPath = (r: number, d: number, size: number) =>
  r > 0 ? `M ${d} ${size} V ${d + r} A ${r} ${r} 0 0 1 ${d + r} ${d} H ${size}` : `M ${d} ${size} V ${d} H ${size}`;

/* `size` is shared by a row, so its corners are drawn at one magnification and compare. */
function loupe(size: number, m: Measure): SVGSVGElement {
  const svg = document.createElementNS(SVG, "svg");
  svg.setAttribute("viewBox", `0 0 ${size} ${size}`);
  svg.setAttribute("aria-hidden", "true");
  const stroke = 1.5 * size / LOUPE;
  const add = (className: string, d: string, extra: Record<string, string> = {}) => {
    const path = document.createElementNS(SVG, "path");
    path.setAttribute("class", className);
    path.setAttribute("d", d);
    path.setAttribute("stroke-width", String(stroke));
    for (const [key, value] of Object.entries(extra)) path.setAttribute(key, value);
    svg.append(path);
  };
  add("roundness-loupe__shell", cornerPath(Math.min(m.outer, size), 0, size));
  if (m.inner) {
    const concentric = Math.max(0, m.outer - m.inner.d);
    if (concentric > 0) add("roundness-loupe__guide", `M ${m.inner.d} ${m.inner.d + concentric} A ${concentric} ${concentric} 0 0 1 ${m.inner.d + concentric} ${m.inner.d}`,
      { "stroke-dasharray": `${2 * stroke} ${2 * stroke}`, "stroke-width": String(stroke * 0.75) });
    add("roundness-loupe__nested", cornerPath(m.inner.r, m.inner.d, size));
  }
  return svg;
}

/* A Badge, the system's own tag. */
function tag(text: string) {
  const badge = document.createElement("span");
  badge.className = "area-badge area-badge--soft area-badge--neutral area-badge--sm";
  const label = document.createElement("span");
  label.className = "area-badge__label";
  label.textContent = text;
  badge.append(label);
  return badge;
}

function makeCell(row: HTMLElement, template: HTMLTemplateElement, step: string, copy: number) {
  const cell = document.createElement("div");
  cell.className = "roundness-cell";
  cell.setAttribute("data-area-radius", step);
  if (step === DEFAULT_STEP) cell.setAttribute("data-default", "");
  const head = document.createElement("div");
  head.className = "roundness-cell__head";
  head.setAttribute("data-area-ui", "compact");
  const label = document.createElement("span");
  label.className = "roundness-cell__step";
  label.textContent = stepLabel(step);
  const value = document.createElement("span");
  value.className = "roundness-cell__value";
  head.append(label, value);
  const stage = document.createElement("div");
  stage.className = "roundness-cell__stage";
  stage.inert = true;
  stage.append(template.content.cloneNode(true));
  // Radio groups stay one per copy, or the copies would uncheck each other.
  for (const input of stage.querySelectorAll<HTMLInputElement>("input[name]")) input.name = `${input.name}-${copy}`;
  const view = document.createElement("div");
  view.className = "roundness-cell__loupe";
  view.setAttribute("data-area-ui", "compact");
  cell.append(head, stage, view);
  row.append(cell);
  return { step, cell, value, stage, view };
}

function measure(stage: HTMLElement, outer?: string, inner?: string, main?: { index: number; round: boolean } | null): Measure | null {
  if (outer && inner) {
    const pair = nested(stage, outer, inner);
    if (!pair) return null;
    // Anchor a shell wider than the window on the side its nested shape sits (an Input's action
    // button is at the end), so that corner is the one in view.
    const a = pair.shell.getBoundingClientRect(), b = pair.part.getBoundingClientRect();
    if (a.right - b.right < b.left - a.left) stage.style.justifyContent = "flex-end";
    return { r: pair.inner.r, outer: radiusOf(pair.shell), pill: isPill(pair.shell) || isPill(pair.part), inner: pair.inner };
  }
  if (!main) return null;
  const shape = stage.querySelectorAll<HTMLElement>(PARTS)[main.index];
  if (!shape) return null;
  return { r: radiusOf(shape), outer: radiusOf(shape), pill: main.round || isPill(shape) };
}

let copies = 0;
function buildRow(row: HTMLElement) {
  const template = row.querySelector("template");
  if (!template) return;
  row.querySelectorAll(".roundness-cell").forEach(node => node.remove());
  const { outer, inner } = row.dataset;
  const zero = STEPS.indexOf(DEFAULT_STEP);
  const cells = STEPS.map(step => makeCell(row, template, step, ++copies));
  const main = outer ? null : mainShape(cells[zero]!.stage);
  const measured = cells.map(entry => measure(entry.stage, outer, inner, main));
  const base = measured[zero];

  // Every setting from Sharp up to and including the first pill, so a corner that holds (a nested
  // shape at its floor) shows as held. A shape that is round at every step or has no corner at
  // rest keeps only its default.
  let first = 0, last = STEPS.length - 1;
  if (!base || base.pill) first = last = zero;
  else { last = measured.findIndex(m => m?.pill); if (last < 0) last = STEPS.length - 1; }

  cells.forEach((entry, index) => { if (index < first || index > last) entry.cell.remove(); });
  const kept = cells.slice(first, last + 1), shown = measured.slice(first, last + 1);

  const size = Math.max(12, ...shown.map(m => m ? Math.max(Math.min(m.outer, 40) + 6, m.inner ? m.inner.d + m.inner.r + 6 : 0) : 0));
  kept.forEach((entry, index) => {
    const m = shown[index];
    if (!m) { entry.value.append("none at rest"); return; }
    entry.value.append(m.pill && !m.inner ? "pill" : m.r === 0 ? "square" : `${fmt(m.r)}px`);
    if (entry.step === DEFAULT_STEP) entry.value.append(tag("default"));
    entry.view.append(loupe(size, m));
    if (m.inner) {
      const concentric = Math.max(0, m.outer - m.inner.d);
      const held = m.inner.r > concentric + 0.05 ? "floor" : m.inner.r < concentric - 0.05 ? "cap" : "";
      const text = document.createElement("span");
      text.textContent = `${fmt(m.outer)} − ${fmt(m.inner.d)} = ${fmt(concentric)}${held ? ` → ${fmt(m.inner.r)} (${held})` : ""}${m.pill ? ", pill" : ""}`;
      entry.view.append(text);
    }
  });
}

export function annotateRoundness(canvas: HTMLElement) {
  const rows = [...canvas.querySelectorAll<HTMLElement>("[data-roundness-row]")];
  if (!rows.length) return;
  const run = () => rows.forEach(buildRow);
  run();
  // Density and mode change what each cell paints; rebuild after the canvas restyles.
  let timer = 0;
  new MutationObserver(() => { clearTimeout(timer); timer = window.setTimeout(run, 60); })
    .observe(canvas, { attributes: true, attributeFilter: ["data-area-ui", "data-area-theme", "data-area-radius"] });
}
