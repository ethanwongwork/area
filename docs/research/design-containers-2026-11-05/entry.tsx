/**
 * Design Containers artifact (2026-11-05). Owner: "i want to focus on the containers, no more 'asset cards' the containers
 * contain designs that are high fidelity zoomable vector designs. i want to focus on how different types of designs are
 * displayed here, what the minimum margins are, and how each container works and looks at different sizes. this container
 * will also be the main viewing method for looking at designs 'full view' … its own self functioning figma style vector
 * playground but with only 1 designed element … based on the gallery cards, not sure if they should be combined yet."
 *
 * A proposal drawn with Area's real components and the illustration skill's real screens, phones and vignettes
 * (figures/screens.jsx), each a live DOM design (vector: it is re-laid out, never a bitmap, so any zoom stays sharp).
 * The container is the gallery card (src/tile.tsx: tile fill, card edge, 16 corner, the name 4 under at 13) holding one
 * design by the rules below; Full view is the app's own design viewer (src/design-viewer.tsx) with an inspect layer.
 * Built by build.mjs against a tree; nothing in apps/ changed.
 */
import { createRoot } from "react-dom/client";
import { createContext, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { Button, Radio, RadioGroup, Segmented, Slider, Switch, Textarea } from "@area/react";
import { SparkleIcon } from "@area/icons";
import { DESKTOP, ISOLATED, MOBILE } from "@skill/figures/screens.jsx";
import { AFS } from "@skill/engine/stage.js";
import { useDesignViewer } from "@src/design-viewer.tsx";
import { GALLERY_CONTROLS } from "@src/gallery/controls.ts";

type Mode = "light" | "dark";
type Axes = Record<string, string>;

/* --- Settings: the designs in Area's defaults, the containers in the gallery cards' own scope ------------------------ */

const DEFAULTS: Axes = Object.fromEntries(GALLERY_CONTROLS.filter(c => c.axis !== "theme").map(c => [c.axis, c.defaultValue]));
const scopeOf = (mode: Mode): Record<string, string> => {
  const out: Record<string, string> = { "data-area-theme": mode };
  for (const [axis, value] of Object.entries(DEFAULTS)) if (!(axis === "contrast" && value === "system")) out[`data-area-${axis}`] = value;
  return out;
};
/** tile.tsx CARD_SCOPE: the gallery cards' tone, stroke and hover, whatever the design inside previews. */
const CARD_SCOPE = { "data-area-card-tone-light": "-25", "data-area-card-tone-dark": "-25", "data-area-stroke": "2", "data-area-shadow-rest": "0", "data-area-shadow-hover": "0", "data-area-stroke-hover": "1" } as const;

/* --- Kinds of design ------------------------------------------------------------------------------------------------ */

type Kind = "control" | "component" | "pattern" | "screen" | "phone" | "icon" | "type" | "color";
/** How a kind takes its margin: free parts keep a tenth of the container round them, designs with their own frame a
 *  twentieth, a colour none (it is the ground). */
type Role = "free" | "framed" | "bleed";
interface KindInfo { label: string; shape: "square" | "wide"; role: Role; rules: string[] }
const KINDS: Record<Kind, KindInfo> = {
  control: { label: "Control", shape: "square", role: "free", rules: [
    "Centred on what it paints, at 100% in every container from 160 up.",
    "The margin grows with the container; the control never grows past its true size.",
  ] },
  component: { label: "Component", shape: "square", role: "free", rules: [
    "Centred on what it paints (its own shadow sits in the margin).",
    "Fitted inside the margin, never past 100%.",
    "Under 50% it stops shrinking: it holds 50% and the container crops it on its focus (top for a menu, centre for a card).",
  ] },
  pattern: { label: "Pattern", shape: "square", role: "free", rules: [
    "A few components in context, cropped to what they paint.",
    "Same as a component: fitted inside the margin, held at 50% and cropped below that.",
  ] },
  screen: { label: "Screen", shape: "wide", role: "framed", rules: [
    "A 16:9 container, the screen whole inside a thin margin (it draws its own window edge).",
    "Always whole: a screen stands for the whole design, so it shrinks as far as it must (rule 26.2).",
  ] },
  phone: { label: "Phone", shape: "square", role: "framed", rules: [
    "Stands from the top margin at 60% of the container's width and runs off the bottom, as a held phone is shown.",
    "Never past 100%; Full view shows it whole.",
  ] },
  icon: { label: "Icon", shape: "square", role: "free", rules: [
    "Drawn at whole multiples of its size (1× to 4×), about a quarter of the container, so its pixels stay whole.",
    "Full view zooms it to 6400% with a pixel grid from 800%.",
  ] },
  type: { label: "Type style", shape: "square", role: "free", rules: [
    "Its sample line at true size, centred; never scaled, so 26 px reads as 26 px.",
    "Too long for the container: held at 50% and cropped at its start, never wrapped.",
  ] },
  color: { label: "Color", shape: "square", role: "bleed", rules: [
    "The colour paints the container; no margin, no design inside.",
    "Its name and value sit under it as every container's.",
  ] },
};
const KIND_ORDER = Object.keys(KINDS) as Kind[];

interface Design {
  id: string;
  name: string;
  kind: Kind;
  /** The design at its true size. */
  render: () => ReactNode;
  /** Where a cropped container keeps the design: its top (a menu, a palette) or its centre. */
  focus?: "top" | "center" | "start";
  /** A colour design: what paints its container. */
  paint?: string;
  value?: string;
}
const iso = (key: string) => { const Screen = ISOLATED[key]![1]; return () => <Screen />; };
const desk = (key: string) => { const Screen = DESKTOP[key]![1]; return () => <Screen />; };
const phone = (key: string) => { const Screen = MOBILE[key]![1]; return () => <Screen />; };
const DESIGNS: Design[] = [
  { id: "button", name: "Button", kind: "control", render: () => <Button>Continue</Button> },
  { id: "menu", name: "Menu", kind: "component", focus: "top", render: iso("menu") },
  { id: "form", name: "Form", kind: "component", render: iso("form") },
  { id: "music", name: "Music card", kind: "component", render: iso("music") },
  { id: "inspector", name: "Inspector", kind: "pattern", focus: "top", render: iso("inspector") },
  { id: "command", name: "Command palette", kind: "pattern", focus: "top", render: iso("command") },
  { id: "dashboard", name: "Dashboard", kind: "screen", render: desk("dashboard") },
  { id: "doc", name: "Document", kind: "screen", render: desk("doc") },
  { id: "plan", name: "Plan picker", kind: "phone", render: phone("plan") },
  { id: "finance", name: "Finance home", kind: "phone", render: phone("finance") },
  { id: "sparkle", name: "Sparkle", kind: "icon", render: () => <span className="dcx-icon"><SparkleIcon size={24} /></span> },
  { id: "title", name: "Title", kind: "type", focus: "start", render: () => <span className="dcx-type">Quarterly review</span> },
  { id: "accent", name: "Accent 500", kind: "color", paint: "var(--area-accent-500)", value: "Accent 500",
    render: () => <span className="dcx-swatch" /> },
];
const byKind = (kind: Kind) => DESIGNS.filter(d => d.kind === kind);

/* --- Measuring: each design's artboard is what it paints, read once at true size ------------------------------------- */

interface Box { x: number; y: number; w: number; h: number }
const Boxes = createContext<Record<string, Box>>({});
function Probe({ onBoxes }: { onBoxes: (boxes: Record<string, Box>) => void }) {
  const host = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    let live = true;
    const read = () => {
      if (!live || !host.current) return;
      const out: Record<string, Box> = {};
      for (const el of host.current.querySelectorAll<HTMLElement>("[data-probe]")) {
        const root = el.getBoundingClientRect();
        const id = el.dataset.probe!;
        const p = id === "sparkle" || id === "accent" ? null : AFS.painted(el);
        const l = p ? Math.floor(p.l - root.left) : 0, t = p ? Math.floor(p.t - root.top) : 0;
        const r = p ? Math.ceil(p.r - root.left) : Math.round(root.width), b = p ? Math.ceil(p.b - root.top) : Math.round(root.height);
        out[id] = { x: l, y: t, w: r - l, h: b - t };
      }
      onBoxes(out);
    };
    // Timers, not animation frames: a background tab or a thumbnail capture never runs a frame. Read again once the
    // fonts are in (the first read keeps the page from waiting on them).
    const first = setTimeout(read, 0);
    (document.fonts?.ready ?? Promise.resolve()).then(() => setTimeout(read, 0));
    return () => { live = false; clearTimeout(first); };
  }, []);
  return (
    <div ref={host} className="dcx-probe" aria-hidden="true" inert {...scopeOf("light")}>
      {DESIGNS.map(d => <div key={d.id} data-probe={d.id} className="dcx-probe__item">{d.render()}</div>)}
    </div>
  );
}

/** The design at true size, cropped to its artboard (its painted box), in a mode. */
function Art({ d, box, mode }: { d: Design; box: Box; mode: Mode }) {
  return (
    <div className="dcx-art" data-design={d.id} {...scopeOf(mode)} style={{ inlineSize: box.w, blockSize: box.h }}>
      <div className="dcx-art__inner" style={{ insetInlineStart: -box.x, insetBlockStart: -box.y }}>{d.render()}</div>
    </div>
  );
}

/* --- The rules: margin, scale and place -------------------------------------------------------------------------------- */

export const CEILING = 48; /* Full view's margin (design-viewer.tsx MARGIN): the most any container keeps */
const FLOOR = 0.5; /* the least a part is shrunk to; below it the container crops */
const round4 = (n: number) => Math.round(n / 4) * 4;
function marginOf(role: Role, w: number, h: number) {
  if (role === "bleed") return 0;
  const short = Math.min(w, h);
  return role === "framed" ? Math.min(CEILING, Math.max(8, round4(short * 0.05))) : Math.min(CEILING, Math.max(12, round4(short * 0.1)));
}
type Small = "hold" | "shrink";
type PhonePlace = "stand" | "whole";
interface Placed { m: number; s: number; x: number; y: number; fit: number; note: string; cropped: boolean }
function place(d: Design, box: Box, W: number, H: number, small: Small, phonePlace: PhonePlace): Placed {
  const k = KINDS[d.kind];
  const m = marginOf(k.role, W, H);
  if (d.kind === "color") return { m, s: 1, x: 0, y: 0, fit: 1, note: "Paints the container", cropped: false };
  const fit = Math.min((W - 2 * m) / box.w, (H - 2 * m) / box.h);
  let s = Math.min(1, fit), note = fit >= 1 ? "100%, room to spare" : "Fitted inside the margin", cropped = false;
  let x = Math.round((W - box.w * s) / 2), y = Math.round((H - box.h * s) / 2);
  if (d.kind === "icon") {
    const times = Math.max(1, Math.min(4, Math.floor((W - 2 * m) / (box.w * 4))));
    s = fit < 1 ? fit : times;
    note = `${times}× whole`;
    x = Math.round((W - box.w * s) / 2); y = Math.round((H - box.h * s) / 2);
  } else if (d.kind === "phone" && phonePlace === "stand") {
    s = Math.min(1, (W * 0.6) / box.w);
    x = Math.round((W - box.w * s) / 2); y = m;
    cropped = box.h * s + m > H;
    note = cropped ? "Stands from the top, runs off the bottom" : "Stands from the top, whole";
  } else if ((k.role === "free") && small === "hold" && s < FLOOR) {
    s = FLOOR; cropped = true;
    note = "Held at 50%, cropped on its focus";
    x = d.focus === "start" ? m : Math.round((W - box.w * s) / 2);
    y = d.focus === "top" ? m : Math.round((H - box.h * s) / 2);
  } else if (fit < 1) {
    note = d.kind === "screen" ? "Whole, fitted" : "Fitted inside the margin";
  }
  return { m, s, x, y, fit, note, cropped };
}
const pct = (s: number) => `${Math.round(s * 100)}%`;
const heightOf = (kind: Kind, w: number) => KINDS[kind].shape === "wide" ? Math.round((w * 9) / 16) : w;

/* --- The page's own choices --------------------------------------------------------------------------------------------- */

interface Look { mode: Mode | "page"; guides: boolean; small: Small; phone: PhonePlace }
const LookContext = createContext<{ look: Look; pageMode: Mode; open: (id: string) => void }>({ look: { mode: "page", guides: false, small: "hold", phone: "stand" }, pageMode: "light", open: () => {} });
const useLook = () => useContext(LookContext);

/* --- The container ----------------------------------------------------------------------------------------------------- */

function Container({ d, w, h, caption = true, guidesOn }: { d: Design; w: number; h?: number; caption?: boolean; guidesOn?: boolean }) {
  const boxes = useContext(Boxes);
  const { look, pageMode, open } = useLook();
  const box = boxes[d.id];
  const H = h ?? heightOf(d.kind, w);
  const mode = look.mode === "page" ? pageMode : look.mode;
  const guides = guidesOn ?? look.guides;
  const at = box ? place(d, box, w, H, look.small, look.phone) : null;
  return (
    <figure className="dc" style={{ inlineSize: w }}>
      <button type="button" className="dc__ground" data-kind={d.kind} {...scopeOf(mode)} {...CARD_SCOPE}
        style={{ inlineSize: w, blockSize: H, ...(d.paint ? { background: d.paint } : null) } as CSSProperties}
        aria-label={`${d.name}, open in Full view`} onClick={() => open(d.id)}>
        {box && at && d.kind !== "color" ? (
          <span className="dc__design" style={{ transform: `translate(${at.x}px, ${at.y}px) scale(${at.s})` }}>
            <Art d={d} box={box} mode={mode} />
          </span>
        ) : null}
        {guides && at && box ? <Guides at={at} box={box} W={w} H={H} kind={d.kind} /> : null}
      </button>
      {caption ? (
        <figcaption className="dc__caption">
          <span className="dc__name">{d.name}</span>
          <span className="dc__value">{box && at && d.kind !== "color" ? <>{box.w} × {box.h} at <b>{pct(at.s)}</b></> : d.value}</span>
        </figcaption>
      ) : null}
    </figure>
  );
}

/** The margin as a dashed safe area with its width, and the design's bounds at its scale. */
function Guides({ at, box, W, H, kind }: { at: Placed; box: Box; W: number; H: number; kind: Kind }) {
  const bw = Math.round(box.w * at.s), bh = Math.round(box.h * at.s);
  return (
    <span className="dc__guides" aria-hidden="true">
      {at.m ? <span className="dc__safe" style={{ inset: at.m }} /> : null}
      {kind !== "color" ? <span className="dc__bounds" style={{ insetInlineStart: at.x, insetBlockStart: at.y, inlineSize: bw, blockSize: bh }} /> : null}
      {at.m ? <span className="dc__m" style={{ insetInlineStart: Math.round(W / 2), blockSize: at.m }}><i>{at.m}</i></span> : null}
      {at.m && H > 120 ? <span className="dc__m dc__m--side" style={{ insetBlockStart: Math.round(H / 2), inlineSize: at.m }}><i>{at.m}</i></span> : null}
    </span>
  );
}

/* --- Sections ----------------------------------------------------------------------------------------------------------- */

function Section({ id, title, lede, children, wide }: { id: string; title: string; lede?: ReactNode; children: ReactNode; wide?: boolean }) {
  return (
    <section id={id} className="dcx-section" data-wide={wide ? "" : undefined} aria-labelledby={`${id}-title`}>
      <header className="dcx-section__head">
        <h2 id={`${id}-title`}>{title}</h2>
        {lede ? <p>{lede}</p> : null}
      </header>
      {children}
    </section>
  );
}

/** One container, resized live, with what the rules decided. */
function OneContainer() {
  const boxes = useContext(Boxes);
  const { look } = useLook();
  const [id, setId] = useState("menu");
  const [w, setW] = useState(320);
  const d = DESIGNS.find(x => x.id === id)!;
  const H = heightOf(d.kind, w);
  const box = boxes[d.id];
  const at = box ? place(d, box, w, H, look.small, look.phone) : null;
  const k = KINDS[d.kind];
  const rows: Array<[string, string]> = at && box ? [
    ["Container", `${w} × ${H}`],
    ["Kind", `${k.label}, ${k.shape === "wide" ? "16:9" : "square"}`],
    ["Margin", at.m ? `${at.m} (${k.role === "framed" ? "a twentieth" : "a tenth"} of ${Math.min(w, H)}, ${k.role === "framed" ? "8" : "12"} to ${CEILING})` : "None"],
    ["Design", d.kind === "color" ? (d.value ?? "") : `${box.w} × ${box.h} at true size`],
    ["Scale", d.kind === "color" ? "—" : `${pct(at.s)}${at.fit < 1 && !at.cropped && d.kind !== "icon" ? "" : ""}`],
    ["Result", at.note],
  ] : [];
  return (
    <div className="dcx-one">
      <div className="dcx-one__controls">
        <label className="dcx-field">
          <span className="dcx-field__label">Design</span>
          <select className="dcx-select" value={id} onChange={e => setId(e.target.value)} id="one-design">
            {KIND_ORDER.map(kind => (
              <optgroup key={kind} label={KINDS[kind].label}>
                {byKind(kind).map(x => <option key={x.id} value={x.id}>{x.name}</option>)}
              </optgroup>
            ))}
          </select>
        </label>
        <div className="dcx-slider">
          <Slider id="one-width" label="Width" min={120} max={960} step={4} value={w} onChange={e => setW(Number(e.currentTarget.value))} />
          <span className="dcx-slider__value">{w}</span>
        </div>
        <div className="dcx-presets" role="group" aria-label="Sizes">
          {[160, 240, 320, 480, 720, 960].map(size => (
            <Button key={size} size="sm" variant={w === size ? "soft" : "ghost"} tone="neutral" onClick={() => setW(size)}>{size}</Button>
          ))}
        </div>
      </div>
      <div className="dcx-one__body">
        <div className="dcx-one__stage">
          <Container d={d} w={w} guidesOn />
        </div>
        <dl className="dcx-facts">
          {rows.map(([name, value]) => <div key={name}><dt>{name}</dt><dd>{value}</dd></div>)}
        </dl>
      </div>
    </div>
  );
}

const SIZES = [160, 240, 320, 480, 720];
function MarginLadder() {
  const shorts = [90, 160, 240, 320, 480, 720];
  return (
    <div className="dcx-tablewrap">
      <table className="dcx-table">
        <thead>
          <tr><th scope="col">Container's short side</th>{shorts.map(s => <th key={s} scope="col">{s}</th>)}<th scope="col">Full view</th></tr>
        </thead>
        <tbody>
          <tr><th scope="row">Parts: control, component, pattern, icon, type<span>a tenth, 12 to 48</span></th>{shorts.map(s => <td key={s}>{marginOf("free", s, s)}</td>)}<td>48</td></tr>
          <tr><th scope="row">Framed: screen, phone<span>a twentieth, 8 to 48</span></th>{shorts.map(s => <td key={s}>{marginOf("framed", s, s)}</td>)}<td>48</td></tr>
          <tr><th scope="row">Color<span>none, it is the ground</span></th>{shorts.map(s => <td key={s}>0</td>)}<td>48</td></tr>
        </tbody>
      </table>
    </div>
  );
}

function KindRow() {
  const [kind, setKind] = useState<Kind>("component");
  const k = KINDS[kind];
  return (
    <div className="dcx-kind">
      <div className="dcx-tabs">
        <Segmented aria-label="Kind" size="sm" value={kind} onValueChange={v => setKind(v as Kind)}
          items={KIND_ORDER.map(x => ({ value: x, label: KINDS[x].label }))} />
      </div>
      <ul className="dcx-rules">{k.rules.map(rule => <li key={rule}>{rule}</li>)}</ul>
      {byKind(kind).map(d => (
        <div key={d.id} className="dcx-strip" role="group" aria-label={`${d.name} at five sizes`}>
          {SIZES.map(size => (
            <div key={size} className="dcx-strip__cell">
              <span className="dcx-strip__size">{size}</span>
              <Container d={d} w={size} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function Gallery() {
  const [size, setSize] = useState("240");
  const w = Number(size);
  return (
    <div className="dcx-gallery-wrap">
      <div className="dcx-tabs">
        <Segmented aria-label="Container width" size="sm" value={size} onValueChange={setSize}
          items={SIZES.map(s => ({ value: String(s), label: String(s) }))} />
      </div>
      <div className="dcx-gallery" style={{ ["--_w" as string]: `${w}px` }}>
        {DESIGNS.map(d => <Container key={d.id} d={d} w={w} />)}
      </div>
    </div>
  );
}

/* --- Full view: the app's design viewer, with an inspect layer --------------------------------------------------------- */

interface Picked { el: Element; rect: DOMRect }
function nameOf(el: Element) {
  const cls = [...el.classList].find(c => c.startsWith("area-"));
  if (!cls) return el.tagName.toLowerCase() === "svg" ? "Icon" : el.tagName.toLowerCase() === "span" || el.tagName.toLowerCase() === "p" ? "Text" : "Frame";
  const words = cls.slice(5).split(/__|--/).join(" ").replace(/-/g, " ");
  return words.charAt(0).toUpperCase() + words.slice(1);
}
const px = (v: string) => { const n = parseFloat(v); return Number.isFinite(n) ? (Math.round(n * 100) / 100).toString() : v; };

function FullView({ index, setIndex }: { index: number; setIndex: (i: number) => void }) {
  const boxes = useContext(Boxes);
  const { pageMode } = useLook();
  const d = DESIGNS[index]!;
  const box = boxes[d.id] ?? { x: 0, y: 0, w: 240, h: 240 };
  const [inside, setInside] = useState(false);
  const viewer = useDesignViewer({
    design: d.id, label: d.name, width: box.w, height: box.h,
    render: mode => <Art d={d} box={box} mode={mode} />,
    themed: d.kind !== "color", appMode: pageMode, frame: "bare",
    maxFit: d.kind === "icon" ? 16 : 1, max: d.kind === "icon" ? 64 : 32,
    step: { index, count: DESIGNS.length, noun: "design", onStep: by => setIndex((index + by + DESIGNS.length) % DESIGNS.length) },
    active: inside,
  });

  // Inspect: hover outlines a layer, a click selects it (Figma's way); Escape lets go.
  const host = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<Element | null>(null);
  const [chosen, setChosen] = useState<Element | null>(null);
  const [, tick] = useState(0);
  useEffect(() => { setHover(null); setChosen(null); }, [d.id]);
  useEffect(() => {
    if (!hover && !chosen) return;
    let raf = 0;
    const loop = () => { tick(n => n + 1); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [hover, chosen]);
  useEffect(() => {
    if (!inside) return;
    const key = (e: KeyboardEvent) => { if (e.key === "Escape") setChosen(null); };
    addEventListener("keydown", key);
    return () => removeEventListener("keydown", key);
  }, [inside]);
  const layerAt = (target: EventTarget | null) => {
    const el = target instanceof Element ? target : null;
    const art = el?.closest(".dcx-art");
    if (!el || !art || el === art || el.classList.contains("dcx-art__inner")) return null;
    return el.closest("svg") ?? el;
  };
  const hostRect = host.current?.getBoundingClientRect();
  const frameOf = (el: Element | null) => {
    if (!el || !hostRect || !el.isConnected) return null;
    const r = el.getBoundingClientRect();
    return { left: r.left - hostRect.left, top: r.top - hostRect.top, width: r.width, height: r.height };
  };
  const scaleNow = () => {
    const art = host.current?.querySelector<HTMLElement>(".dcx-art");
    return art ? art.getBoundingClientRect().width / art.offsetWidth : 1;
  };
  const hf = frameOf(hover), cf = frameOf(chosen);
  const s = scaleNow();
  const facts = (() => {
    if (!chosen || !chosen.isConnected) return null;
    const art = chosen.closest(".dcx-art")!.getBoundingClientRect(), r = chosen.getBoundingClientRect(), cs = getComputedStyle(chosen);
    const text = [...chosen.childNodes].some(n => n.nodeType === 3 && n.textContent!.trim());
    const rows: Array<[string, string]> = [
      ["Size", `${px(String(r.width / s))} × ${px(String(r.height / s))}`],
      ["Position", `${px(String((r.left - art.left) / s))}, ${px(String((r.top - art.top) / s))}`],
    ];
    if (cs.paddingTop !== "0px" || cs.paddingLeft !== "0px") rows.push(["Padding", [cs.paddingTop, cs.paddingRight, cs.paddingBottom, cs.paddingLeft].map(px).join(" ")]);
    if (cs.borderTopLeftRadius !== "0px") rows.push(["Corner", px(cs.borderTopLeftRadius)]);
    if (cs.backgroundColor !== "rgba(0, 0, 0, 0)") rows.push(["Fill", cs.backgroundColor]);
    if (parseFloat(cs.borderTopWidth) > 0) rows.push(["Stroke", `${px(cs.borderTopWidth)} ${cs.borderTopColor}`]);
    if (cs.boxShadow !== "none") rows.push(["Shadow", "Yes"]);
    if (text) rows.push(["Text", `${px(cs.fontSize)} / ${px(cs.lineHeight)}, ${cs.fontWeight}`], ["Ink", cs.color]);
    return { name: nameOf(chosen), rows };
  })();

  return (
    <div className="dcx-full" onPointerEnter={() => setInside(true)} onPointerLeave={() => { setInside(false); setHover(null); }}
      onFocus={() => setInside(true)}>
      <div className="dcx-full__bar">
        <div className="dcx-full__lead">{viewer.lead}<span className="dcx-full__title">{d.name}<span>{KINDS[d.kind].label}</span></span></div>
        <div className="dcx-full__end">{viewer.controls}</div>
      </div>
      <div className="dcx-full__body">
        <div ref={host} className="dcx-full__canvas"
          onPointerMove={e => setHover(layerAt(e.target))}
          onClick={e => { const el = layerAt(e.target); setChosen(el); }}>
          {viewer.stage}
          <div className="dcx-inspect" aria-hidden="true">
            {hf && hover !== chosen ? <span className="dcx-inspect__hover" style={hf} /> : null}
            {cf ? <span className="dcx-inspect__chosen" style={cf}>
              <i>{px(String(cf.width / s))} × {px(String(cf.height / s))}</i>
            </span> : null}
          </div>
        </div>
        <aside className="dcx-full__panel" aria-label="Selection">
          {facts ? (
            <>
              <h3>{facts.name}</h3>
              <dl className="dcx-facts dcx-facts--panel">{facts.rows.map(([n, v]) => <div key={n}><dt>{n}</dt><dd>{v}</dd></div>)}</dl>
            </>
          ) : (
            <>
              <h3>{d.name}</h3>
              <dl className="dcx-facts dcx-facts--panel">
                <div><dt>Kind</dt><dd>{KINDS[d.kind].label}</dd></div>
                <div><dt>Artboard</dt><dd>{box.w} × {box.h}</dd></div>
              </dl>
              <p className="dcx-hint">Hover a layer to outline it, click to measure it. Pinch or ⌘ scroll zooms about the pointer; + and −, ⇧0 for 100%, ⇧1 to fit; hold Space and drag to pan; ← → for the next design.</p>
            </>
          )}
        </aside>
      </div>
    </div>
  );
}

/* --- Decisions: the owner's picks, kept in the page's store ------------------------------------------------------------ */

interface Question { id: string; title: string; about: string; options: Array<{ value: string; label: string; about: string; rec?: boolean }> }
const QUESTIONS: Question[] = [
  { id: "combine", title: "Gallery card and container", about: "Today the gallery card (src/tile.tsx, built on Asset card) and the design viewer are two things.", options: [
    { value: "one", label: "One component", about: "The container is the card at rest and Full view when opened: one ground, one placement rule, the margin growing to 48. Asset card retires; colour and group cards become kinds.", rec: true },
    { value: "two", label: "Keep them separate", about: "Gallery cards keep Asset card's axes (caption, fill, container); the viewer keeps its own rules." },
  ] },
  { id: "margin", title: "Minimum margin", about: "What every container keeps round its design.", options: [
    { value: "tenth", label: "A tenth of the short side", about: "12 at the least, 48 at the most (Full view's). Framed designs a twentieth, 8 to 48.", rec: true },
    { value: "inset", label: "The card's 8 inset", about: "Today's gallery rule: every design 8 in, whatever the size." },
    { value: "sixth", label: "About a sixth", about: "The Illustrations gallery's product-shot room (pad 0.66 to 0.74)." },
  ] },
  { id: "small", title: "When a part won't fit", about: "A menu or a pattern in a 160 or 240 container.", options: [
    { value: "hold", label: "Hold 50%, crop on its focus", about: "13 px text never drops below 6.5 px; the container shows the top of a menu, the centre of a card.", rec: true },
    { value: "shrink", label: "Always whole", about: "Shrink to fit at any size; at 160 a palette is drawn at 21%." },
  ] },
  { id: "phone", title: "Phones in a square container", about: "390 × 844 in a square.", options: [
    { value: "stand", label: "Stand and run off", about: "60% of the width from the top margin, cut at the bottom (Illustrations, owner 2026-11-04).", rec: true },
    { value: "whole", label: "Whole", about: "Fitted inside the margin: at 320 the phone is 12% of the card's area." },
  ] },
  { id: "name", title: "The name", about: "Where a container's name sits.", options: [
    { value: "below", label: "Under it, 4 below", about: "The card system's (2026-11-01): name and true size at 13, nothing over the design.", rec: true },
    { value: "hover", label: "On it, on hover", about: "A plate at the bottom start, shown on hover and focus; the container is the design alone at rest." },
  ] },
];

type Verdict = { pick?: string; note?: string; at?: number };
declare global { interface Window { claude?: { use: (name: string) => Promise<any> } } }
function Decisions() {
  const [db, setDb] = useState<any>(null);
  const [state, setState] = useState<"waiting" | "live" | "none">("waiting");
  const [verdicts, setVerdicts] = useState<Record<string, Verdict>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});
  useEffect(() => {
    let off: (() => void) | undefined, live = true;
    const timer = setTimeout(() => { if (live) setState(now => now === "waiting" ? "none" : now); }, 10000);
    (window.claude?.use("db") ?? Promise.resolve(null)).then(store => {
      if (!live) return;
      if (!store) { setState("none"); return; }
      setDb(store);
      off = store.collection("verdicts").onSnapshot((snap: any) => {
        clearTimeout(timer);
        setState("live");
        const out: Record<string, Verdict> = {};
        for (const doc of snap.docs) out[doc.id] = doc.data() as Verdict;
        setVerdicts(out);
      }, () => { clearTimeout(timer); setState("none"); });
    }).catch(() => setState("none"));
    return () => { live = false; clearTimeout(timer); off?.(); };
  }, []);
  const save = async (id: string, next: Verdict) => {
    setVerdicts(v => ({ ...v, [id]: { ...v[id], ...next } }));
    if (!db) return;
    try { await db.doc(`verdicts/${id}`).set({ ...verdicts[id], ...next, at: Date.now() }); } catch { setState("none"); }
  };
  return (
    <div className="dcx-decisions">
      <p className="dcx-store" data-state={state}>
        {state === "live" ? "Your picks save as you choose them." : state === "waiting" ? "Connecting to the page's store…" : "Picks can't be saved in this view; they stay until you reload."}
      </p>
      {QUESTIONS.map((q, i) => (
        <div key={q.id} className="dcx-q">
          <div className="dcx-q__head">
            <span className="dcx-q__n">Q{i + 1}</span>
            <div><h3>{q.title}</h3><p>{q.about}</p></div>
          </div>
          <RadioGroup label={q.title} className="dcx-q__group" value={verdicts[q.id]?.pick ?? ""} onValueChange={v => save(q.id, { pick: v })} name={`q-${q.id}`}>
            {q.options.map(o => (
              <Radio key={o.value} value={o.value} id={`q-${q.id}-${o.value}`} variant="card"
                label={<>{o.label}{o.rec ? <span className="dcx-rec">Recommended</span> : null}</>} description={o.about} />
            ))}
          </RadioGroup>
          <div className="dcx-q__note">
            <Textarea id={`note-${q.id}`} aria-label={`Note on ${q.title}`} placeholder="Note (optional)" rows={2}
              value={notes[q.id] ?? verdicts[q.id]?.note ?? ""} onChange={e => setNotes(n => ({ ...n, [q.id]: e.currentTarget.value }))}
              onBlur={() => { const note = notes[q.id]; if (note !== undefined && note !== (verdicts[q.id]?.note ?? "")) save(q.id, { note }); }} />
          </div>
        </div>
      ))}
    </div>
  );
}

/* --- The page ------------------------------------------------------------------------------------------------------------ */

function usePageMode(): Mode {
  const read = (): Mode => {
    const set = document.documentElement.getAttribute("data-theme");
    if (set === "dark" || set === "light") return set;
    return matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  };
  const [mode, setMode] = useState<Mode>(read);
  useEffect(() => {
    const q = matchMedia("(prefers-color-scheme: dark)");
    const update = () => setMode(read());
    q.addEventListener("change", update);
    const watch = new MutationObserver(update);
    watch.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => { q.removeEventListener("change", update); watch.disconnect(); };
  }, []);
  useLayoutEffect(() => {
    const root = document.documentElement;
    for (const [k, v] of Object.entries(scopeOf(mode))) root.setAttribute(k, v);
  }, [mode]);
  return mode;
}

function App() {
  const pageMode = usePageMode();
  const [boxes, setBoxes] = useState<Record<string, Box>>({});
  const [look, setLook] = useState<Look>({ mode: "page", guides: false, small: "hold", phone: "stand" });
  const [index, setIndex] = useState(DESIGNS.findIndex(d => d.id === "dashboard"));
  const full = useRef<HTMLElement>(null);
  const open = (id: string) => {
    setIndex(DESIGNS.findIndex(d => d.id === id));
    full.current?.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
  };
  const ready = Object.keys(boxes).length > 0;
  const ctx = useMemo(() => ({ look, pageMode, open }), [look, pageMode]);
  return (
    <Boxes.Provider value={boxes}>
      <LookContext.Provider value={ctx}>
        <Probe onBoxes={setBoxes} />
        <div className="dcx-page">
          <header className="dcx-top">
            <div className="dcx-top__title">
              <p className="dcx-eyebrow">Area, proposal for review, 2026-11-05</p>
              <h1>Design Containers</h1>
              <p className="dcx-lede">One container for every design. In a gallery it is the card; opened, it is Full view, a bounded canvas holding the one design. Every design here is live Area UI, so it stays sharp at any zoom. Press a container to open it.</p>
            </div>
            <div className="dcx-toolbar" role="group" aria-label="Show">
              <Segmented aria-label="Designs in" size="sm" value={look.mode} onValueChange={v => setLook(l => ({ ...l, mode: v as Look["mode"] }))}
                items={[{ value: "page", label: "Page" }, { value: "light", label: "Light" }, { value: "dark", label: "Dark" }]} />
              <Switch id="show-guides" label="Margins" checked={look.guides} onChange={e => setLook(l => ({ ...l, guides: e.currentTarget.checked }))} />
              <Segmented aria-label="Parts that won't fit" size="sm" value={look.small} onValueChange={v => setLook(l => ({ ...l, small: v as Small }))}
                items={[{ value: "hold", label: "Hold 50%" }, { value: "shrink", label: "Shrink" }]} />
              <Segmented aria-label="Phones" size="sm" value={look.phone} onValueChange={v => setLook(l => ({ ...l, phone: v as PhonePlace }))}
                items={[{ value: "stand", label: "Phone stands" }, { value: "whole", label: "Phone whole" }]} />
            </div>
          </header>
          {!ready ? <p className="dcx-loading">Measuring each design at true size…</p> : (
            <>
              <Section id="container" title="One container" lede="Drag the width. The margin, the scale and what the container does with a design that doesn't fit all follow from the container's size and the design's kind.">
                <OneContainer />
              </Section>
              <Section id="margins" title="Minimum margins" lede="A part keeps a tenth of the container's short side round what it paints, never under 12 and never over 48, Full view's margin. A design with its own frame keeps a twentieth (8 to 48). A colour is the ground. Margins land on the 4 grid, and the design's top start lands on a whole pixel.">
                <MarginLadder />
              </Section>
              <Section id="kinds" title="Every kind at five sizes" lede="160 is a strip or a list's thumbnail, 240 a dense grid, 320 the gallery card, 480 a feature card, 720 a wide card in the feed. Under each: the design's true size and the scale it is drawn at." wide>
                <KindRow />
              </Section>
              <Section id="gallery" title="A gallery at one width" lede="Every design side by side, one width, as a gallery shows them. Squares and 16:9 only." wide>
                <Gallery />
              </Section>
              <section ref={full} id="full-view" className="dcx-section" data-wide="" aria-labelledby="full-view-title">
                <header className="dcx-section__head">
                  <h2 id="full-view-title">Full view</h2>
                  <p>The same container filling the canvas: the app's design viewer, with the design's mode and ground at the start and the zoom at the end. The margin is the ceiling, 48. Hover a layer to outline it, click to measure it.</p>
                </header>
                <FullView index={index} setIndex={setIndex} />
              </section>
              <Section id="decisions" title="Decisions" lede="Five choices this proposal makes. The recommended answer is what the page draws by default.">
                <Decisions />
              </Section>
            </>
          )}
          <footer className="dcx-foot">Source: docs/research/design-containers-2026-11-05 (entry.tsx, build.mjs). Built from Area's packages and the app's design viewer at main d0e5624d.</footer>
        </div>
      </LookContext.Provider>
    </Boxes.Provider>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
