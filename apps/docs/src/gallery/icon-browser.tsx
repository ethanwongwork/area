/**
 * The gallery's icon browser (icons.html), modelled on Cursor's icon library (owner, 2026-10-05):
 * a toolbar (search, outline or filled, size), every Area icon in one grid grouped by category so
 * look-alikes sit together (src/icon-categories.ts), and a docked preview of the selected icon
 * with its sizes, facts and Copy / Download SVG.
 *
 * Built from Area's own components and icons. The build renders it to HTML at the defaults
 * (scripts/component-gallery.mjs) and src/icons-client.tsx hydrates it; preferences then come
 * back from localStorage and the selection from ?icon=. Icons render at the chosen size, so their
 * line follows the size curve (docs/specs/icons.md, "Sizes") rather than scaling.
 */
import { useDeferredValue, useEffect, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { Button, Checkbox, Input, NumberField, Panel, PanelSection, Segmented, Slider } from "@area/react";
import {
  PILOT_BATCHES, PILOT_ICONS,
  PilotCheckIcon, PilotCopyIcon, PilotDismissIcon, PilotDownloadIcon, PilotOpenIcon, PilotSearchIcon,
} from "../pilot-icons.tsx";
import { ICON_CATEGORIES } from "../icon-categories.ts";

type Entry = (typeof PILOT_ICONS)[number];
type Mode = "outline" | "filled";

export const ICON_BROWSER_ID = "icon-browser";
/** Every icon's name, for the build's check that each has a category. */
export const ICON_NAMES = PILOT_ICONS.map(icon => icon.name);
/** The nav's sections: one per category, with its count. */
export const ICON_SECTIONS = ICON_CATEGORIES.map(category => ({ slug: category.slug, name: category.name, count: category.icons.length }));

const BY_NAME = new Map<string, Entry>(PILOT_ICONS.map(icon => [icon.name, icon]));
const CATEGORY_OF = new Map(ICON_CATEGORIES.flatMap(category => category.icons.map(name => [name, category.name] as const)));
const STATUS = new Map<string, { status: string; batch: string }>(
  PILOT_BATCHES.flatMap(batch => Object.entries(batch.icons).map(([name, status]) => [name, { status, batch: batch.title }] as const)),
);
const statusOf = (icon: Entry) => STATUS.get(icon.derivedFrom ?? icon.name);
const VARIANTS = new Map<string, Entry[]>();
for (const icon of PILOT_ICONS) if (icon.derivedFrom) VARIANTS.set(icon.derivedFrom, [...(VARIANTS.get(icon.derivedFrom) ?? []), icon]);

const titleCase = (name: string) => name.split("-").map(word => word[0]!.toUpperCase() + word.slice(1)).join(" ");
const pascal = (name: string) => name.replace(/(^|-)([a-z0-9])/g, (_, __, c: string) => c.toUpperCase());

/* Size limits: Area draws for 12 and up (the size curve's floor); 64 is the largest grid the
   canvas holds at four columns. The preview goes to 256, Cursor's largest. */
const SIZE = { min: 12, max: 64, initial: 24 } as const;
const PREVIEW = { min: 16, max: 256, initial: 128 } as const;
/** The preview's size strip: the sizes components use (docs/specs/icons.md). */
const STRIP = [16, 20, 24, 32, 48] as const;

interface Preferences { mode: Mode; size: number; names: boolean; variants: boolean; review: boolean }
const DEFAULTS: Preferences = { mode: "outline", size: SIZE.initial, names: false, variants: true, review: false };
const PREFERENCES_KEY = "area-icon-browser";

function readPreferences(): Preferences {
  try {
    const saved = JSON.parse(localStorage.getItem(PREFERENCES_KEY) ?? "{}") as Partial<Preferences>;
    return {
      mode: saved.mode === "filled" ? "filled" : "outline",
      size: Number.isInteger(saved.size) && saved.size! >= SIZE.min && saved.size! <= SIZE.max ? saved.size! : DEFAULTS.size,
      names: saved.names === true,
      variants: saved.variants !== false,
      review: saved.review === true,
    };
  } catch { return DEFAULTS; }
}

const Glyph = ({ icon, mode, size }: { icon: Entry; mode: Mode; size: number }) => {
  const Draw = mode === "filled" ? icon.Filled : icon.Icon;
  return <Draw size={size} />;
};

/** Every word of the query must start a word of the icon's name, its category or its base icon. */
function matches(icon: Entry, query: string) {
  const words = query.toLowerCase().split(/[\s,]+/).filter(Boolean);
  if (!words.length) return true;
  const haystack = [icon.name, CATEGORY_OF.get(icon.name) ?? "", icon.derivedFrom ?? ""].join(" ").toLowerCase().split(/[\s&-]+/);
  return words.every(word => haystack.some(part => part.startsWith(word)) || icon.name.includes(word));
}

/*
 * A standalone SVG of a rendered icon: the token weights resolved to numbers (stroke-width, r and the
 * size-curve shifts are inline CSS on the page), React's ids renamed after the icon, nothing else
 * changed. It is read from the page, so it matches what the browser shows at that size.
 */
export function standaloneSvg(svg: SVGSVGElement, name: string) {
  const copy = svg.cloneNode(true) as SVGSVGElement;
  const source = [svg, ...svg.querySelectorAll<SVGElement>("*")];
  const target = [copy, ...copy.querySelectorAll<SVGElement>("*")];
  const round = (value: number) => String(Number(value.toFixed(4)));
  source.forEach((element, index) => {
    const out = target[index]!;
    const style = (element as SVGElement).style;
    if (!style?.length) return;
    const computed = getComputedStyle(element);
    if (style.strokeWidth) out.setAttribute("stroke-width", round(parseFloat(computed.strokeWidth)));
    if (style.getPropertyValue("r")) out.setAttribute("r", round(parseFloat(computed.getPropertyValue("r"))));
    if (style.transform && computed.transform !== "none") {
      const m = new DOMMatrix(computed.transform);
      out.setAttribute("transform", `matrix(${[m.a, m.b, m.c, m.d, m.e, m.f].map(round).join(" ")})`);
    }
    out.removeAttribute("style");
  });
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
    <Button variant="outline" size="sm" fullWidth={fullWidth} icon={done ? <PilotCheckIcon /> : icon}
      onClick={async () => { try { await copy(); setDone(true); } catch {} }}>
      {done ? "Copied" : label}
    </Button>
  );
}

function Detail({ icon, mode, size, onSelect, onClose }: { icon: Entry; mode: Mode; size: number; onSelect: (name: string) => void; onClose: () => void }) {
  const [preview, setPreview] = useState<number>(PREVIEW.initial);
  const exportRef = useRef<HTMLSpanElement>(null);
  const status = statusOf(icon);
  const variants = VARIANTS.get(icon.derivedFrom ?? icon.name) ?? [];
  const family = icon.derivedFrom ? [BY_NAME.get(icon.derivedFrom)!, ...variants] : variants.length ? [icon, ...variants] : [];
  const file = `${icon.name}${mode === "filled" ? "-filled" : ""}.svg`;
  const svg = () => {
    const node = exportRef.current?.querySelector("svg");
    if (!node) throw new Error("Icon not rendered");
    return standaloneSvg(node, icon.name);
  };
  const download = () => {
    const url = URL.createObjectURL(new Blob([svg()], { type: "image/svg+xml" }));
    const link = Object.assign(document.createElement("a"), { href: url, download: file });
    link.click();
    URL.revokeObjectURL(url);
  };
  const facts: Array<[string, ReactNode]> = [
    ["Name", <span className="icon-browser__mono">{icon.name}</span>],
    ["Component", <span className="icon-browser__mono">Pilot{pascal(icon.name)}{mode === "filled" ? "Filled" : ""}Icon</span>],
    ["Category", CATEGORY_OF.get(icon.name)],
    ["Keyline", titleCase(icon.keyline)],
    ["Filled by", icon.fill === "solid" ? "Shape" : "Weight"],
    ...(icon.derivedFrom ? [["Drawn from", <button type="button" className="icon-browser__link" onClick={() => onSelect(icon.derivedFrom!)}>{icon.derivedFrom}</button>] as [string, ReactNode]] : []),
    ["Status", status ? `${status.status === "approved" ? "Approved" : "In review"} · ${status.batch}` : "—"],
  ];
  return (
    <Panel className="icon-browser__detail" data-area-ui="default" data-area-radius="10" size="md" flush resizable="start" defaultWidth={320} minWidth={280} maxWidth={480}
      title={titleCase(icon.name)} titleLevel={2}
      action={<Button variant="ghost" size="sm" iconOnly aria-label="Close preview" icon={<PilotDismissIcon />} onClick={onClose} />}
      footer={
        <div className="icon-browser__actions">
          <CopyButton label="Copy SVG" icon={<PilotCopyIcon />} copy={() => navigator.clipboard.writeText(svg())} />
          <Button variant="outline" size="sm" icon={<PilotDownloadIcon />} onClick={download}>Download SVG</Button>
          <CopyButton label="Copy name" icon={<PilotCopyIcon />} copy={() => navigator.clipboard.writeText(icon.name)} fullWidth />
        </div>
      }>
      <PanelSection>
        <div className="icon-browser__stage"><Glyph icon={icon} mode={mode} size={preview} /></div>
        <div className="icon-browser__size-row">
          <Slider size="sm" aria-label="Preview size" min={PREVIEW.min} max={PREVIEW.max} step={1} value={preview} onValueChange={setPreview} />
          <NumberField size="sm" fullWidth aria-label="Preview size in pixels" min={PREVIEW.min} max={PREVIEW.max} step={1} unit="px" grouping={false}
            value={preview} onValueChange={value => value !== null && setPreview(Math.round(value))} />
        </div>
      </PanelSection>
      <PanelSection heading="Sizes">
        <div className="icon-browser__strip">
          {(["outline", "filled"] as const).map(row => STRIP.map(px => (
            <span key={`${row}-${px}`} className="icon-browser__strip-cell" title={`${row}, ${px}px`}><Glyph icon={icon} mode={row} size={px} /></span>
          )))}
          {STRIP.map(px => <span key={px} className="icon-browser__strip-label">{px}</span>)}
        </div>
      </PanelSection>
      {family.length > 1 ? (
        <PanelSection heading="Rotations and mirrors">
          <div className="icon-browser__family">
            {family.map(member => (
              <button key={member.name} type="button" className="icon-browser__cell" aria-pressed={member.name === icon.name} aria-label={member.name} title={member.name}
                onClick={() => onSelect(member.name)}>
                <Glyph icon={member} mode={mode} size={20} />
              </button>
            ))}
          </div>
        </PanelSection>
      ) : null}
      <PanelSection heading="Details">
        <dl className="icon-browser__facts">
          {facts.map(([term, value]) => <div key={term}><dt>{term}</dt><dd>{value}</dd></div>)}
        </dl>
        <a className="icon-browser__review-link" href={`./gallery-icons.html#gallery-icon-review-${icon.name}`}>
          Open review card <PilotOpenIcon />
        </a>
      </PanelSection>
      {/* What Copy and Download read: the icon at the grid's size and mode. */}
      <span hidden ref={exportRef}><Glyph icon={icon} mode={mode} size={size} /></span>
    </Panel>
  );
}

/** Moves focus between grid cells with the arrow keys, by position, so it follows the wrapped rows. */
function moveFocus(event: KeyboardEvent<HTMLElement>) {
  const keys = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"];
  const from = event.target as HTMLElement;
  if (!keys.includes(event.key) || !from.matches(".icon-browser__grid .icon-browser__cell")) return;
  const cells = [...event.currentTarget.querySelectorAll<HTMLElement>(".icon-browser__grid .icon-browser__cell")].filter(cell => cell.offsetParent);
  const index = cells.indexOf(from);
  let next: HTMLElement | undefined;
  if (event.key === "ArrowLeft") next = cells[index - 1];
  else if (event.key === "ArrowRight") next = cells[index + 1];
  else if (event.key === "Home") next = cells[0];
  else if (event.key === "End") next = cells[cells.length - 1];
  else {
    const here = from.getBoundingClientRect();
    const down = event.key === "ArrowDown";
    const rows = cells.filter(cell => { const top = cell.getBoundingClientRect().top; return down ? top > here.top + 1 : top < here.top - 1; });
    const rowTop = rows.length ? (down ? Math.min : Math.max)(...rows.map(cell => cell.getBoundingClientRect().top)) : undefined;
    next = rows.filter(cell => cell.getBoundingClientRect().top === rowTop)
      .sort((a, b) => Math.abs(a.getBoundingClientRect().left - here.left) - Math.abs(b.getBoundingClientRect().left - here.left))[0];
  }
  if (!next) return;
  event.preventDefault();
  next.focus();
  next.scrollIntoView({ block: "nearest" });
}

export function IconBrowser() {
  const [preferences, setPreferences] = useState<Preferences>(DEFAULTS);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const search = useRef<HTMLInputElement>(null);
  const deferredQuery = useDeferredValue(query);
  const { mode, names, variants, review } = preferences;
  const size = useDeferredValue(preferences.size);

  // After hydration: the viewer's preferences and the linked icon.
  useEffect(() => {
    setPreferences(readPreferences());
    const linked = new URLSearchParams(location.search).get("icon");
    if (linked && BY_NAME.has(linked)) setSelected(linked);
  }, []);
  const update = (change: Partial<Preferences>) => setPreferences(current => {
    const next = { ...current, ...change };
    try { localStorage.setItem(PREFERENCES_KEY, JSON.stringify(next)); } catch {}
    return next;
  });

  // The cell size follows the icon size; set here rather than inline so the page's HTML carries no length.
  useEffect(() => { root.current?.style.setProperty("--_size", `${size}px`); }, [size]);

  // The selection is in the address, so a link opens the same icon.
  useEffect(() => {
    const url = new URL(location.href);
    if (selected) url.searchParams.set("icon", selected); else url.searchParams.delete("icon");
    history.replaceState(history.state, "", url);
  }, [selected]);

  // "/" finds, Escape closes the preview (or clears the search when it has focus).
  useEffect(() => {
    const onKey = (event: globalThis.KeyboardEvent) => {
      const typing = event.target instanceof Element && event.target.closest("input:not([type=checkbox], [type=radio], [type=range]), textarea, select, [contenteditable]");
      if (event.key === "/" && !typing) { event.preventDefault(); search.current?.focus(); }
      else if (event.key === "Escape" && !typing && selected) {
        const cell = root.current?.querySelector<HTMLElement>(`.icon-browser__grid [data-icon="${selected}"]`);
        setSelected(null);
        cell?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [selected]);

  const sections = useMemo(() => ICON_CATEGORIES.map(category => ({
    ...category,
    shown: category.icons.flatMap(name => BY_NAME.get(name) ?? []).filter(icon => (variants || !icon.derivedFrom) && matches(icon, deferredQuery)),
  })), [variants, deferredQuery]);
  const shown = sections.reduce((sum, section) => sum + section.shown.length, 0);
  const current = selected ? BY_NAME.get(selected) : undefined;

  return (
    <div className="icon-browser" ref={root} data-names={names ? "" : undefined} data-review={review ? "" : undefined}>
      <div className="icon-browser__main">
        <div className="icon-browser__toolbar" data-area-ui="default" data-area-radius="10">
          <div className="icon-browser__search">
            <Input ref={search} size="sm" fullWidth type="search" aria-label="Search icons" placeholder="Search icons"
              leadingIcon={<PilotSearchIcon />} value={query} onChange={event => setQuery(event.currentTarget.value)}
              onKeyDown={event => { if (event.key === "Escape" && query) { event.stopPropagation(); setQuery(""); } }} />
          </div>
          <Segmented size="sm" aria-label="Style" value={mode} onValueChange={value => update({ mode: value as Mode })}
            items={[{ value: "outline", label: "Outline" }, { value: "filled", label: "Filled" }]} />
          <div className="icon-browser__size-row icon-browser__size-row--toolbar">
            <Slider size="sm" aria-label="Icon size" min={SIZE.min} max={SIZE.max} step={1} value={preferences.size} onValueChange={value => update({ size: value })} />
            <NumberField size="sm" fullWidth aria-label="Icon size in pixels" min={SIZE.min} max={SIZE.max} step={1} unit="px" grouping={false}
              value={preferences.size} onValueChange={value => value !== null && update({ size: Math.round(value) })} />
          </div>
          <span className="icon-browser__count" aria-live="polite">{shown === PILOT_ICONS.length ? `${shown} icons` : `${shown} / ${PILOT_ICONS.length}`}</span>
        </div>
        <div className="icon-browser__scroll" data-gallery-scroll onKeyDown={moveFocus}>
          {sections.map(section => (
            <section key={section.slug} className="gallery-section icon-browser__section" id={`component-${section.slug}`} data-slug={section.slug}
              aria-labelledby={`component-${section.slug}-title`} hidden={!section.shown.length}>
              <h2 className="gallery-section__title" id={`component-${section.slug}-title`} data-area-ui="compact">
                {section.name} <span className="icon-browser__section-count">{section.shown.length}</span>
              </h2>
              <div className="icon-browser__grid">
                {section.shown.map(icon => (
                  <button key={icon.name} type="button" className="icon-browser__cell" data-icon={icon.name}
                    aria-pressed={icon.name === selected} aria-label={icon.name} title={icon.name}
                    data-in-review={statusOf(icon)?.status !== "approved" ? "" : undefined}
                    onClick={() => setSelected(icon.name === selected ? null : icon.name)}>
                    <Glyph icon={icon} mode={mode} size={size} />
                    {names ? <span className="icon-browser__name" aria-hidden="true">{icon.name}</span> : null}
                  </button>
                ))}
              </div>
            </section>
          ))}
          {shown === 0 ? <p className="icon-browser__empty">No icons match “{deferredQuery}”.</p> : null}
        </div>
        <div className="icon-browser__footer" data-area-ui="default" data-area-radius="10">
          <Checkbox label="Names" checked={names} onCheckedChange={checked => update({ names: checked })} />
          <Checkbox label="Rotations and mirrors" checked={variants} onCheckedChange={checked => update({ variants: checked })} />
          <Checkbox label="Mark icons in review" checked={review} onCheckedChange={checked => update({ review: checked })} />
        </div>
      </div>
      {current ? (
        <div className="icon-browser__dock">
          <Detail icon={current} mode={mode} size={size} onSelect={setSelected} onClose={() => setSelected(null)} />
        </div>
      ) : null}
    </div>
  );
}
