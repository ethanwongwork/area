/**
 * The component gallery's chrome: the component list on the left and the theme panel on the
 * right, built from Area's own Panel, Nav, Field and Segmented, modelled on Cursor's sidebars:
 * docked, resizable, compact (component-gallery.mjs pins the rails to the compact UI scale).
 *
 * Both rails sit outside the canvas's theme scope, so they keep Area's defaults while the
 * controls retheme only the canvas. The build renders them to HTML (component-gallery.mjs)
 * and gallery-client.tsx hydrates them.
 */
import { useEffect, useRef, useState } from "react";
import { Field, Nav, NavGroup, NavItem, NavSeparator, Panel, PanelSection, Segmented, Slider } from "@area/react";
import { GALLERY_CANVAS_ID, GALLERY_CONTROLS, GALLERY_STORAGE_KEY } from "./controls.ts";

/*
 * Rail widths (picks, not measured: Cursor's sidebar width is not in the captures). The nav is
 * narrower than Panel's 240 so the canvas gets the room; the theme panel holds 248, the
 * narrowest at which a row's Segmented shows "Compact" untruncated beside its label (the row
 * splits 1 : 1.5; at 240 it clips by 1px). Each rail resizes from its inner edge and keeps the width it was left at.
 */
const RAILS = {
  nav: { initial: 200, min: 160, max: 360 },
  controls: { initial: 248, min: 248, max: 400 },
} as const;
const RAILS_KEY = "area-gallery-rails";

function useRailWidth(rail: keyof typeof RAILS) {
  const [width, setWidth] = useState<number>(RAILS[rail].initial);
  useEffect(() => {
    try {
      const saved = Number(JSON.parse(localStorage.getItem(RAILS_KEY) ?? "{}")[rail]);
      if (saved >= RAILS[rail].min && saved <= RAILS[rail].max) setWidth(saved);
    } catch {}
  }, [rail]);
  const change = (next: number) => {
    setWidth(next);
    try {
      const all = JSON.parse(localStorage.getItem(RAILS_KEY) ?? "{}");
      localStorage.setItem(RAILS_KEY, JSON.stringify({ ...all, [rail]: next }));
    } catch {}
  };
  return { width, onWidthChange: change, minWidth: RAILS[rail].min, maxWidth: RAILS[rail].max };
}

export interface GallerySection {
  slug: string;
  name: string;
}

/** The gallery's pages: every component, and how roundness shifts each one. */
export const GALLERY_PAGES = [
  { id: "components", href: "./index.html", label: "Components" },
  { id: "roundness", href: "./roundness.html", label: "Roundness" },
] as const;
export type GalleryPage = (typeof GALLERY_PAGES)[number]["id"];

/** The canvas section that holds a family's tiles. */
export const sectionId = (slug: string) => `component-${slug}`;

/* How far below the canvas's top edge a section's heading counts as the one being read. */
const READING_LINE = 96;

export function GalleryNav({ sections, page = "components" }: { sections: readonly GallerySection[]; page?: GalleryPage }) {
  const [current, setCurrent] = useState(sections[0]?.slug);
  const nav = useRef<HTMLElement>(null);

  // The current item follows the canvas's scroll: the last section whose heading has passed
  // the reading line, or the last section once the canvas reaches its end.
  useEffect(() => {
    const canvas = document.getElementById(GALLERY_CANVAS_ID);
    if (!canvas) return;
    const targets = sections.map(section => document.getElementById(sectionId(section.slug))).filter((node): node is HTMLElement => node !== null);
    let frame = 0;
    const update = () => {
      frame = 0;
      const line = canvas.getBoundingClientRect().top + READING_LINE;
      const atEnd = canvas.scrollTop + canvas.clientHeight >= canvas.scrollHeight - 1;
      let active = targets[0];
      if (atEnd) active = targets[targets.length - 1];
      else for (const target of targets) {
        if (target.getBoundingClientRect().top > line) break;
        active = target;
      }
      if (active?.dataset.slug) setCurrent(active.dataset.slug);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    canvas.addEventListener("scroll", schedule, { passive: true });
    update();
    return () => { canvas.removeEventListener("scroll", schedule); cancelAnimationFrame(frame); };
  }, [sections]);

  // Keep the current item in view as the canvas scrolls through a long list.
  useEffect(() => {
    nav.current?.querySelector<HTMLElement>(`[href="#${sectionId(current ?? "")}"]`)?.scrollIntoView({ block: "nearest" });
  }, [current]);

  const rail = useRailWidth("nav");
  return (
    <Panel size="sm" flush resizable="end" aria-label="Components" {...rail}>
      <PanelSection>
        <Nav ref={nav} aria-label="Components">
          <NavGroup>
            {GALLERY_PAGES.map(link => <NavItem key={link.id} href={link.href} current={link.id === page}>{link.label}</NavItem>)}
          </NavGroup>
          <NavSeparator />
          <NavGroup>
            {sections.map(section => (
              <NavItem key={section.slug} href={`#${sectionId(section.slug)}`} current={section.slug === current} onClick={() => setCurrent(section.slug)}>
                {section.name}
              </NavItem>
            ))}
          </NavGroup>
        </Nav>
      </PanelSection>
    </Panel>
  );
}

type Selection = Record<string, string>;
const DEFAULTS: Selection = Object.fromEntries(GALLERY_CONTROLS.map(control => [control.axis, control.defaultValue]));
/** The selection the canvas carries: the source of truth, never a render's (possibly stale) state. */
const readCanvas = (canvas: HTMLElement): Selection =>
  Object.fromEntries(GALLERY_CONTROLS.map(control => [control.axis, canvas.getAttribute(`data-area-${control.axis}`) ?? control.defaultValue]));

export function GalleryControls() {
  const [selection, setSelection] = useState(DEFAULTS);

  // The canvas already carries the saved selection (restored before first paint); read it back.
  useEffect(() => {
    const canvas = document.getElementById(GALLERY_CANVAS_ID);
    if (!canvas) return;
    setSelection(readCanvas(canvas));
  }, []);

  const choose = (axis: string, value: string) => {
    const canvas = document.getElementById(GALLERY_CANVAS_ID);
    if (!canvas) return;
    canvas.setAttribute(`data-area-${axis}`, value);
    /*
     * Area's colours are light-dark() pairs whose text is the same in both themes, so Chromium
     * can keep a cached colour after color-scheme flips (docs/THEMING.md). One synchronous
     * restyle re-resolves the canvas; nothing paints in between.
     */
    if (axis === "theme") { canvas.style.display = "none"; void canvas.offsetHeight; canvas.style.display = ""; }
    const next = readCanvas(canvas);
    setSelection(next);
    try { localStorage.setItem(GALLERY_STORAGE_KEY, JSON.stringify(next)); } catch {}
  };

  const rail = useRailWidth("controls");
  // Label beside control, one row per setting: a horizontal Field inside a Panel.
  return (
    <Panel size="sm" flush resizable="start" title="Theme" action={<span className="gallery-controls__scope">Canvas</span>} {...rail}>
      <PanelSection>
        {GALLERY_CONTROLS.map(control => (
          <Field key={control.axis} label={control.label} orientation="horizontal">
            {control.kind === "slider" ? (
              <Slider size="sm" min={0} max={control.items.length - 1} step={1} stepMarks
                value={Math.max(0, control.items.findIndex(item => item.value === selection[control.axis]))}
                readout={index => control.items[index]?.label ?? ""}
                onValueChange={index => { const item = control.items[index]; if (item) choose(control.axis, item.value); }} />
            ) : (
              <Segmented size="sm" fullWidth items={[...control.items]}
                value={selection[control.axis]} onValueChange={value => choose(control.axis, value)} />
            )}
          </Field>
        ))}
      </PanelSection>
    </Panel>
  );
}
