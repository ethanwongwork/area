/**
 * Copying from the app: a Copy button that confirms, and a rendered icon as a standalone SVG file.
 * Moved from the archived docs' icon browser (apps/docs/src/gallery/icon-browser.tsx) so the app reads
 * only Area's packages (docs/specs/icons.md, "Fluent map retired from the app").
 */
import { useEffect, useState, type ReactNode } from "react";
import { Button } from "@area/react";
import { CheckIcon } from "@area/icons";

/*
 * A standalone SVG of a rendered icon: the token weights resolved to numbers (stroke-width, r and the
 * size-curve shifts are inline CSS on the page), React's ids renamed after the icon, nothing else
 * changed. It is read from the page, so it matches what the browser shows at that size. An icon at 12
 * carries its 16px drawing and its 12px cut, one hidden by opacity (docs/specs/icons.md, "12px cuts"):
 * the hidden one is left out.
 */
export function standaloneSvg(svg: SVGSVGElement, name: string) {
  const copy = svg.cloneNode(true) as SVGSVGElement;
  const source = [svg, ...svg.querySelectorAll<SVGElement>("*")];
  const target = [copy, ...copy.querySelectorAll<SVGElement>("*")];
  const round = (value: number) => String(Number(value.toFixed(4)));
  const hidden: Element[] = [];
  source.forEach((element, index) => {
    const out = target[index]!;
    const style = (element as SVGElement).style;
    if (!style?.length) return;
    const computed = getComputedStyle(element);
    if (style.opacity) { if (Number(computed.opacity) === 0) hidden.push(out); }
    if (style.strokeWidth) out.setAttribute("stroke-width", round(parseFloat(computed.strokeWidth)));
    if (style.getPropertyValue("r")) out.setAttribute("r", round(parseFloat(computed.getPropertyValue("r"))));
    if (style.transform && computed.transform !== "none") {
      const m = new DOMMatrix(computed.transform);
      out.setAttribute("transform", `matrix(${[m.a, m.b, m.c, m.d, m.e, m.f].map(round).join(" ")})`);
    }
    out.removeAttribute("style");
  });
  hidden.forEach(element => element.remove());
  let n = 0;
  const ids = new Map<string, string>();
  copy.querySelectorAll("[id]").forEach(element => { const id = `${name}-${++n}`; ids.set(element.id, id); element.id = id; });
  copy.querySelectorAll("*").forEach(element => {
    for (const attribute of [...element.attributes]) {
      if (!attribute.value.includes("#")) continue;
      let value = attribute.value;
      ids.forEach((id, old) => { value = value.split(`#${old}`).join(`#${id}`); });
      element.setAttribute(attribute.name, value);
    }
  });
  copy.removeAttribute("aria-hidden");
  copy.removeAttribute("focusable");
  copy.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  return copy.outerHTML;
}

/** A button whose label reads "Copied" for a moment after it succeeds. */
export function CopyButton({ label, copy, icon, fullWidth }: { label: string; copy: () => Promise<void> | void; icon: ReactNode; fullWidth?: boolean }) {
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (!done) return;
    const timer = setTimeout(() => setDone(false), 1600);
    return () => clearTimeout(timer);
  }, [done]);
  return (
    <Button variant="outline" size="sm" fullWidth={fullWidth} icon={done ? <CheckIcon /> : icon}
      onClick={async () => { try { await copy(); setDone(true); } catch {} }}>
      {done ? "Copied" : label}
    </Button>
  );
}
