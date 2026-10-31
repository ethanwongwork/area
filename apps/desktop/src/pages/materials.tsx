/**
 * Materials lab: a temporary tab for tuning the Material setting (owner, 2026-10-18: "a new temporary tab in electron
 * for materials where i can really experiment, research, fine tune, improve, and clean up the materials"). It goes
 * when the bundles are settled and their values are written back into @area/tokens axes/material.ts.
 *
 * Each bundle has a draft: every lever as a continuous number (the setting has whole steps), the switches and stroke
 * styles, which part groups each targeted lever reaches, each group's strength, and notes. The draft is written as the
 * material's own CSS inputs (--area-material-*) on a scope that carries data-area-material, so the receivers in
 * packages/styles/src/material.css paint it exactly as they paint a shipped bundle; the shipped bundle is the same
 * attribute with no inputs set, so comparing the two shows only what the draft moved.
 *
 *   Sidebar    the bundles, marked Edited where the draft differs from what ships
 *   Canvas     a view (every part group, one group, the page levers, a whole screen, or contrast readings), in light,
 *              dark or both, over a backdrop (the page, a wallpaper, a photo, text, black and white stripes), beside
 *              the shipped bundle or a saved snapshot
 *   Inspector  the draft's controls, its snapshots, and what is still open in the research
 *
 * Drafts and snapshots are this app's own (localStorage, src/storage.ts). Copy bundle gives the draft as source for
 * MATERIAL_BUNDLES; Copy changes lists what moved, to paste into a session.
 */
import { useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";
import {
  Badge, Button, Card, CardContent, CardDescription, CardFooter, CardTitle, Checkbox, Code, CustomSelect,
  Field, Input, Menu, MenuItem, Meter, Nav, NavGroup, NavItem, PanelSection, Popover, PopoverDescription, PopoverHeader,
  PopoverTitle, Progress, Radio, RadioGroup, Segmented, Select, Slider, Switch, Table, Textarea, Titlebar, Toast,
  Toolbar, ToolbarItem,
} from "@area/react";
import { AddIcon, BoldIcon, CopyIcon, ItalicIcon, SearchIcon, UnderlineIcon } from "@area/icons";
import { CopyButton } from "../copy.tsx";
import {
  MATERIAL_BUNDLES, MATERIAL_LEVERS, MATERIAL_ROLES, MATERIAL_STROKE_STYLES, MATERIAL_SWITCHES, MATERIAL_TARGETS,
  materialGrainImage,
} from "@area/tokens/config";
import { SidebarList, useStudio, Workspace } from "../studio.tsx";
import { hrefOf } from "../places.ts";
import { CanvasSettings } from "../canvas-settings.tsx";
import { Facts } from "../facts.tsx";
import { matches } from "../search.ts";
import { readStored, writeStored } from "../storage.ts";
import { useViewOption, ViewControls, ViewFilter } from "../view-controls.tsx";
import { AnalyticsDashboard } from "../content/examples/analytics.tsx";

/* --- Drafts ------------------------------------------------------------------ */

interface Draft {
  levers: Record<string, number>;
  switches: Record<string, string>;
  stroke: string[];
  targets: Record<string, string[]>;
  strengths: Record<string, number>;
  notes: string;
}
interface Snapshot { id: string; name: string; bundle: string; draft: Draft; at: string }

const BUNDLE_IDS = Object.keys(MATERIAL_BUNDLES);
const DEFAULT_BUNDLE = "glass";
const ROLE_LABELS: Record<string, string> = {
  primary: "Primary controls", secondary: "Secondary controls", marks: "Marks", wells: "Wells", selection: "Selected rows",
  surfaces: "Cards", overlays: "Overlays", chrome: "Chrome",
};
const ROLE_PARTS: Record<string, string> = {
  primary: "Solid Buttons, the selected Segmented item, Switch and Slider thumbs, ticked boxes",
  secondary: "Outline and soft Buttons",
  marks: "Solid Badges",
  wells: "Fields, selects, text areas, tracks, unticked boxes",
  selection: "The selected Menu row, the current Nav row",
  surfaces: "Cards",
  overlays: "Menus, Popovers, Toasts, Dialogs, Hover cards, the Video player's controller",
  chrome: "Titlebar, the surface Toolbar, a product's regions marked data-area-chrome",
};

/** What a bundle ships: the draft that paints exactly as the attribute alone. */
function shipped(bundle: string): Draft {
  const b = MATERIAL_BUNDLES[bundle] ?? MATERIAL_BUNDLES.none!;
  return {
    levers: Object.fromEntries(MATERIAL_LEVERS.map(l => [l.id, b.levers[l.id] ?? 0])),
    switches: Object.fromEntries(MATERIAL_SWITCHES.map(s => [s.id, b.switches[s.id] ?? s.options[0]!.value])),
    stroke: [...b.stroke],
    targets: Object.fromEntries(Object.keys(MATERIAL_TARGETS).map(lever => [lever, [...(b.targets[lever] ?? MATERIAL_TARGETS[lever]!)]])),
    strengths: Object.fromEntries(MATERIAL_ROLES.map(r => [r.id, r.strength])),
    notes: "",
  };
}

/** A saved draft, kept only where it still names known levers, options, styles and groups. */
function restoreDraft(bundle: string, saved: unknown): Draft {
  const base = shipped(bundle);
  if (!saved || typeof saved !== "object") return base;
  const s = saved as Partial<Draft>;
  const roles = MATERIAL_ROLES.map(r => r.id);
  for (const l of MATERIAL_LEVERS) if (typeof s.levers?.[l.id] === "number") base.levers[l.id] = s.levers[l.id]!;
  for (const sw of MATERIAL_SWITCHES) if (sw.options.some(o => o.value === s.switches?.[sw.id])) base.switches[sw.id] = s.switches![sw.id]!;
  if (Array.isArray(s.stroke)) base.stroke = MATERIAL_STROKE_STYLES.map(st => st.id).filter(id => s.stroke!.includes(id));
  for (const lever of Object.keys(MATERIAL_TARGETS)) if (Array.isArray(s.targets?.[lever])) base.targets[lever] = roles.filter(r => s.targets![lever]!.includes(r));
  for (const r of roles) if (typeof s.strengths?.[r] === "number") base.strengths[r] = s.strengths[r]!;
  if (typeof s.notes === "string") base.notes = s.notes;
  return base;
}

const same = (a: Draft, b: Draft) => JSON.stringify({ ...a, notes: "" }) === JSON.stringify({ ...b, notes: "" });
const fmt = (n: number) => String(Math.round(n * 100) / 100);

/** The draft as the material's CSS inputs, the same names bundleInputs and materialDefaults write. */
function draftStyle(d: Draft): CSSProperties {
  const out: Record<string, string> = {};
  for (const l of MATERIAL_LEVERS) out[`--area-material-${l.id}`] = l.id === "angle" ? `${d.levers[l.id]}deg` : fmt(d.levers[l.id]!);
  out["--area-material-grain-image"] = materialGrainImage(d.levers.grain ?? 0);
  for (const sw of MATERIAL_SWITCHES) {
    const on = sw.options.find(o => o.value === d.switches[sw.id])?.gates ?? [];
    for (const gate of new Set(sw.options.flatMap(o => o.gates))) out[`--area-material-${gate}`] = on.includes(gate) ? "1" : "0";
  }
  for (const st of MATERIAL_STROKE_STYLES) out[`--area-material-${st.gate}`] = d.stroke.includes(st.id) ? "1" : "0";
  for (const [lever, reach] of Object.entries(d.targets)) for (const r of MATERIAL_ROLES) out[`--area-material-${lever}-on-${r.id}`] = reach.includes(r.id) ? "1" : "0";
  for (const r of MATERIAL_ROLES) out[`--area-material-scope-${r.id}`] = fmt(d.strengths[r.id]!);
  return out as CSSProperties;
}

/** The draft as a MATERIAL_BUNDLES entry, with what the entry cannot hold (group strengths) as comments. */
function bundleSource(bundle: string, d: Draft): string {
  const b = MATERIAL_BUNDLES[bundle]!;
  const levers = MATERIAL_LEVERS.filter(l => d.levers[l.id]).map(l => `${/^[a-z]+$/.test(l.id) ? l.id : JSON.stringify(l.id)}: ${fmt(d.levers[l.id]!)}`);
  const switches = MATERIAL_SWITCHES.filter(s => d.switches[s.id] !== s.options[0]!.value).map(s => `${JSON.stringify(s.id)}: ${JSON.stringify(d.switches[s.id])}`);
  const targets = Object.keys(MATERIAL_TARGETS).filter(lever => d.targets[lever]!.join() !== MATERIAL_TARGETS[lever]!.join())
    .map(lever => `${lever}: [${d.targets[lever]!.map(r => JSON.stringify(r)).join(", ")}]`);
  const fields = [
    `label: ${JSON.stringify(b.label)}, description: ${JSON.stringify(b.description)},`,
    levers.length ? `levers: { ${levers.join(", ")} },` : "",
    d.stroke.length ? `stroke: [${d.stroke.map(s => JSON.stringify(s)).join(", ")}],` : "",
    switches.length ? `switches: { ${switches.join(", ")} },` : "",
    targets.length ? `targets: { ${targets.join(", ")} },` : "",
    Object.keys(b.layers).length ? `layers: ${JSON.stringify(b.layers)},` : "",
  ].filter(Boolean);
  const strengths = MATERIAL_ROLES.filter(r => d.strengths[r.id] !== r.strength).map(r => `${r.id} ${r.strength} → ${fmt(d.strengths[r.id]!)}`);
  const fractional = MATERIAL_LEVERS.filter(l => l.id !== "angle" ? !Number.isInteger(d.levers[l.id]) : d.levers[l.id]! % 15 !== 0).map(l => l.label);
  return [
    `  ${bundle}: {`,
    ...fields.map(f => `    ${f}`),
    "  },",
    strengths.length ? `  // Group strengths (MATERIAL_ROLES, every bundle): ${strengths.join("; ")}` : "",
    fractional.length ? `  // Between the setting's steps (the Inspector's Material lists whole steps): ${fractional.join(", ")}` : "",
    d.notes.trim() ? `  // Notes: ${d.notes.trim().replace(/\n+/g, " ")}` : "",
  ].filter(Boolean).join("\n");
}

/** What moved from the shipped bundle, in words. */
function changeList(bundle: string, d: Draft): string {
  const s = shipped(bundle);
  const label = MATERIAL_BUNDLES[bundle]!.label;
  const lines: string[] = [];
  for (const l of MATERIAL_LEVERS) if (d.levers[l.id] !== s.levers[l.id]) lines.push(`${l.label}: ${fmt(s.levers[l.id]!)} → ${fmt(d.levers[l.id]!)}`);
  for (const sw of MATERIAL_SWITCHES) if (d.switches[sw.id] !== s.switches[sw.id]) {
    const name = (v?: string) => sw.options.find(o => o.value === v)?.label;
    lines.push(`${sw.label}: ${name(s.switches[sw.id])} → ${name(d.switches[sw.id])}`);
  }
  if (d.stroke.join() !== s.stroke.join()) lines.push(`Stroke style: ${s.stroke.join(", ") || "none"} → ${d.stroke.join(", ") || "none"}`);
  for (const lever of Object.keys(MATERIAL_TARGETS)) if (d.targets[lever]!.join() !== s.targets[lever]!.join()) {
    lines.push(`${MATERIAL_LEVERS.find(l => l.id === lever)!.label} reaches: ${s.targets[lever]!.join(", ") || "nothing"} → ${d.targets[lever]!.join(", ") || "nothing"}`);
  }
  for (const r of MATERIAL_ROLES) if (d.strengths[r.id] !== s.strengths[r.id]) lines.push(`${ROLE_LABELS[r.id]} strength: ${fmt(s.strengths[r.id]!)} → ${fmt(d.strengths[r.id]!)}`);
  if (d.notes.trim()) lines.push(`Notes: ${d.notes.trim()}`);
  return `Materials lab, ${label}${lines.length ? "" : ": no changes"}\n${lines.map(line => `- ${line}`).join("\n")}`.trim();
}

function useDrafts() {
  const [drafts, setDrafts] = useState<Record<string, Draft>>(() => {
    const saved = readStored<Record<string, unknown>>("lab:drafts", {});
    return Object.fromEntries(BUNDLE_IDS.map(id => [id, restoreDraft(id, saved[id])]));
  });
  const [snapshots, setSnapshots] = useState<Snapshot[]>(() => {
    const saved = readStored<unknown>("lab:snapshots", []);
    return Array.isArray(saved) ? saved.filter((s): s is Snapshot => !!s && typeof s === "object" && BUNDLE_IDS.includes((s as Snapshot).bundle))
      .map(s => ({ ...s, draft: restoreDraft(s.bundle, s.draft) })) : [];
  });
  const put = (bundle: string, draft: Draft) => setDrafts(current => {
    const next = { ...current, [bundle]: draft };
    writeStored("lab:drafts", next);
    return next;
  });
  const saveSnapshots = (next: Snapshot[]) => { setSnapshots(next); writeStored("lab:snapshots", next); };
  return { drafts, put, snapshots, saveSnapshots };
}

/* --- The page ---------------------------------------------------------------- */

const VIEWS = [
  { value: "parts", label: "Every part" },
  ...MATERIAL_ROLES.map(r => ({ value: r.id, label: ROLE_LABELS[r.id]! })),
  { value: "page", label: "Page" },
  { value: "screen", label: "Screen" },
  { value: "readings", label: "Readings" },
] as const;
type View = (typeof VIEWS)[number]["value"];
const THEMES = [{ value: "both", label: "Light and dark" }, { value: "light", label: "Light" }, { value: "dark", label: "Dark" }] as const;
const BACKDROPS = [
  { value: "page", label: "Page" },
  { value: "wallpaper", label: "Wallpaper" },
  { value: "photo", label: "Photo" },
  { value: "text", label: "Text" },
  { value: "stripes", label: "Stripes" },
] as const;
type Backdrop = (typeof BACKDROPS)[number]["value"];

export function MaterialsPage() {
  const { query, item, select } = useStudio();
  const bundle = item && BUNDLE_IDS.includes(item) ? item : DEFAULT_BUNDLE;
  const { drafts, put, snapshots, saveSnapshots } = useDrafts();
  const draft = drafts[bundle]!;
  const ships = useMemo(() => shipped(bundle), [bundle]);
  const [view, setView] = useViewOption<View>("materials", "parts", VIEWS.map(v => v.value));
  const [theme, setTheme] = useViewOption<"both" | "light" | "dark">("materials-theme", "both", ["both", "light", "dark"]);
  const [backdrop, setBackdrop] = useViewOption<Backdrop>("materials-backdrop", "page", BACKDROPS.map(b => b.value));
  const [compare, setCompare] = useState<string>(() => readStored("view:materials-compare", "shipped"));
  const changeCompare = (next: string) => { setCompare(next); writeStored("view:materials-compare", next); };
  const against = compare === "shipped" ? { label: "Shipped", style: undefined }
    : snapshots.find(s => s.id === compare && s.bundle === bundle) ? { label: snapshots.find(s => s.id === compare)!.name, style: draftStyle(snapshots.find(s => s.id === compare)!.draft) }
    : null;

  const variants = [{ label: "Draft", style: draftStyle(draft) }, ...(against ? [against] : [])];
  const themes = theme === "both" ? ["light", "dark"] as const : [theme] as const;
  const shown = BUNDLE_IDS.filter(id => matches(query, MATERIAL_BUNDLES[id]!.label, MATERIAL_BUNDLES[id]!.description));

  return (
    <Workspace
      sidebar={<SidebarList>
        <Nav aria-label="Materials">
          <NavGroup label="Bundles">
            {shown.map(id => (
              <NavItem key={id} href={hrefOf({ page: "materials", item: id })} current={id === bundle}
                onClick={event => { event.preventDefault(); select(id); }}
                trailing={same(drafts[id]!, shipped(id)) ? undefined : <Badge size="sm" variant="soft">Edited</Badge>}>
                {MATERIAL_BUNDLES[id]!.label}
              </NavItem>
            ))}
          </NavGroup>
        </Nav>
      </SidebarList>}
      canvasTitle={`${MATERIAL_BUNDLES[bundle]!.label}: ${VIEWS.find(v => v.value === view)!.label}`}
      canvasActions={<ViewControls>
        <ViewFilter label="View" value={view} onChange={setView} options={VIEWS} />
        <ViewFilter label="Backdrop" value={backdrop} onChange={setBackdrop} options={BACKDROPS.map(b => ({ value: b.value, label: `${b.label} backdrop` }))} />
        <ViewFilter label="Compare with" value={against ? compare : "off"} onChange={changeCompare} options={[
          { value: "off", label: "No comparison" },
          { value: "shipped", label: "Beside shipped" },
          ...snapshots.filter(s => s.bundle === bundle).map(s => ({ value: s.id, label: `Beside ${s.name}` })),
        ]} />
        <ViewFilter label="Theme" value={theme} onChange={setTheme} options={THEMES} />
      </ViewControls>}
      canvas={view === "readings"
        ? <Readings bundle={bundle} variants={variants} themes={themes} />
        : <Board bundle={bundle} view={view} variants={variants} themes={themes} backdrop={backdrop} />}
      inspector={{
        theme: <CanvasSettings material={false} />,
        // The lab's levers are its design; snapshots and research sit with them.
        design: <>
        <DraftControls bundle={bundle} draft={draft} ships={ships} onChange={next => put(bundle, next)}
          onReset={() => put(bundle, { ...ships, notes: draft.notes })}
          onSnapshot={() => {
            const count = snapshots.filter(s => s.bundle === bundle).length + 1;
            const snap: Snapshot = { id: `${bundle}-${Date.now().toString(36)}`, name: `${MATERIAL_BUNDLES[bundle]!.label} ${count}`, bundle, draft, at: new Date().toISOString() };
            saveSnapshots([...snapshots, snap]);
          }} />
        <Snapshots bundle={bundle} snapshots={snapshots} onLoad={s => put(bundle, s.draft)}
          onDelete={s => { saveSnapshots(snapshots.filter(x => x.id !== s.id)); if (compare === s.id) changeCompare("shipped"); }} />
        <Research bundle={bundle} />
      </>,
      }}
    />
  );
}

/* --- Canvas ------------------------------------------------------------------ */

type Variant = { label: string; style?: CSSProperties };

/** One column per theme and variant: the theme scope, the bundle's Layers, then the material scope over a backdrop. */
function Columns({ bundle, variants, themes, backdrop, children }: { bundle: string; variants: Variant[]; themes: readonly ("light" | "dark")[]; backdrop: Backdrop; children: ReactNode }) {
  const layers = Object.fromEntries(Object.entries(MATERIAL_BUNDLES[bundle]!.layers).map(([axis, value]) => [`data-area-${axis}`, value]));
  return (
    <div className="lab-columns">
      {themes.flatMap(theme => variants.map(variant => (
        <div key={`${theme}-${variant.label}`} className="lab-column" data-area-theme={theme} {...layers}>
          <div className="lab-column__label">{theme === "light" ? "Light" : "Dark"}, {variant.label}</div>
          <div className="lab-scope" data-area-material={bundle} style={variant.style}>
            {backdrop === "page" ? null : <Backdrop kind={backdrop} />}
            <div className="lab-scope__content">{children}</div>
          </div>
        </div>
      )))}
    </div>
  );
}

const FILLER = "Placeholder text sits behind the part so its reading floor can be judged against busy content. ";
function Backdrop({ kind }: { kind: Exclude<Backdrop, "page"> }) {
  return kind === "text"
    ? <div className="lab-backdrop" data-kind="text" aria-hidden="true">{FILLER.repeat(40)}</div>
    : <div className="lab-backdrop" data-kind={kind} aria-hidden="true" />;
}

function Board({ bundle, view, variants, themes, backdrop }: { bundle: string; view: View; variants: Variant[]; themes: readonly ("light" | "dark")[]; backdrop: Backdrop }) {
  const groups = view === "parts" ? MATERIAL_ROLES.map(r => r.id) : MATERIAL_ROLES.some(r => r.id === view) ? [view] : [];
  return (
    <div className="lab-board">
      {groups.map(role => (
        <section key={role} className="lab-group" aria-label={ROLE_LABELS[role]}>
          <header className="lab-group__head">
            <span className="lab-group__title">{ROLE_LABELS[role]}</span>
            <span className="lab-group__parts">{ROLE_PARTS[role]}</span>
          </header>
          <Columns bundle={bundle} variants={variants} themes={themes} backdrop={backdrop}><Specimens role={role} /></Columns>
        </section>
      ))}
      {view === "page" ? (
        <section className="lab-group" aria-label="Page">
          <header className="lab-group__head"><span className="lab-group__title">Page</span><span className="lab-group__parts">Grain and page glow, on the element that sets the material</span></header>
          <Columns bundle={bundle} variants={variants} themes={themes} backdrop="page"><div className="lab-page-sample"><Specimens role="surfaces" /><Specimens role="primary" /></div></Columns>
        </section>
      ) : null}
      {view === "screen" ? (
        <section className="lab-group" aria-label="Screen">
          <header className="lab-group__head"><span className="lab-group__title">Screen</span><span className="lab-group__parts">Testing → Analytics dashboard under the draft</span></header>
          <Columns bundle={bundle} variants={variants} themes={themes} backdrop={backdrop}><div className="lab-screen"><AnalyticsDashboard /></div></Columns>
        </section>
      ) : null}
    </div>
  );
}

/** The parts each group paints, as the gallery's demos draw them. */
function Specimens({ role }: { role: string }) {
  const name = useMemo(() => `lab-${role}-${Math.random().toString(36).slice(2, 7)}`, [role]);
  switch (role) {
    case "primary": return (
      <div className="lab-specimens">
        <Button>Button</Button>
        <Button tone="neutral">Button</Button>
        <Button iconOnly aria-label="Add" icon={<AddIcon />} />
        <Segmented items={[{ value: "one", label: "One" }, { value: "two", label: "Two" }, { value: "three", label: "Three" }]} defaultValue="one" aria-label="Segmented" />
        <Switch label="Switch" defaultChecked />
        <Checkbox label="Checkbox" defaultChecked />
        <Radio name={name} value="one" label="Radio" defaultChecked />
        <div style={{ inlineSize: 160 }}><Slider aria-label="Slider" defaultValue={60} /></div>
      </div>
    );
    case "secondary": return (
      <div className="lab-specimens">
        <Button variant="outline">Button</Button>
        <Button variant="soft">Button</Button>
        <Button variant="outline" tone="neutral">Button</Button>
        <Button variant="soft" tone="neutral">Button</Button>
        <Button variant="ghost">Ghost (none)</Button>
      </div>
    );
    case "marks": return (
      <div className="lab-specimens">
        <Badge variant="solid">Badge</Badge>
        <Badge variant="solid" tone="info">Info</Badge>
        <Badge variant="solid" tone="success">Success</Badge>
        <Badge variant="solid" tone="danger">Danger</Badge>
        <Badge variant="soft">Soft (none)</Badge>
      </div>
    );
    case "wells": return (
      <div className="lab-specimens lab-specimens--stack">
        <Input aria-label="Input" placeholder="Placeholder" />
        <Select aria-label="Select" defaultValue="one"><option value="one">Option one</option><option value="two">Option two</option></Select>
        <Textarea aria-label="Text area" placeholder="Placeholder" rows={2} />
        <div className="lab-specimens">
          <Switch label="Off" />
          <Checkbox label="Unticked" />
          <RadioGroup label="Radio" name={name} orientation="horizontal"><Radio value="a" label="One" /><Radio value="b" label="Two" /></RadioGroup>
        </div>
        <Progress value={62} label="Progress" />
        <Meter value={40} label="Meter" />
      </div>
    );
    case "selection": return (
      <div className="lab-specimens">
        <Nav aria-label="Nav sample" className="lab-nav">
          <NavGroup>
            <NavItem href={hrefOf({ page: "materials" })} current onClick={event => event.preventDefault()}>Item one</NavItem>
            <NavItem href={hrefOf({ page: "materials" })} onClick={event => event.preventDefault()}>Item two</NavItem>
            <NavItem href={hrefOf({ page: "materials" })} onClick={event => event.preventDefault()}>Item three</NavItem>
          </NavGroup>
        </Nav>
        <Menu aria-label="Menu sample">
          <MenuItem data-selected="">Item one</MenuItem>
          <MenuItem>Item two</MenuItem>
          <MenuItem>Item three</MenuItem>
        </Menu>
      </div>
    );
    case "surfaces": return (
      <div className="lab-specimens">
        <Card style={{ inlineSize: 240 }}>
          <CardContent>
            <CardTitle>Title</CardTitle>
            <CardDescription>Description that wraps onto a second line, in the muted ink.</CardDescription>
            <CardFooter><Button>Action</Button><Button variant="outline">Action</Button></CardFooter>
          </CardContent>
        </Card>
        <Card style={{ inlineSize: 180 }}>
          <CardContent>
            <CardTitle>Title</CardTitle>
            <CardDescription>Description</CardDescription>
          </CardContent>
        </Card>
      </div>
    );
    case "overlays": return (
      <div className="lab-specimens">
        <Popover role="dialog" aria-label="Popover sample">
          <PopoverHeader><PopoverTitle>Title</PopoverTitle><PopoverDescription>Description that wraps onto a second line.</PopoverDescription></PopoverHeader>
        </Popover>
        <Menu aria-label="Menu sample">
          <MenuItem icon={<SearchIcon />}>Item one</MenuItem>
          <MenuItem icon={<AddIcon />}>Item two</MenuItem>
          <MenuItem>Item three</MenuItem>
        </Menu>
        <Toast>Body text</Toast>
      </div>
    );
    case "chrome": return (
      <div className="lab-specimens lab-specimens--stack">
        <Titlebar className="lab-titlebar">Title</Titlebar>
        <Toolbar variant="surface" aria-label="Formatting">
          <ToolbarItem><Button variant="ghost" iconOnly aria-label="Bold" icon={<BoldIcon />} /></ToolbarItem>
          <ToolbarItem><Button variant="ghost" iconOnly aria-label="Italic" icon={<ItalicIcon />} /></ToolbarItem>
          <ToolbarItem><Button variant="ghost" iconOnly aria-label="Underline" icon={<UnderlineIcon />} /></ToolbarItem>
        </Toolbar>
        <div className="lab-chrome" data-area-chrome="">A product region marked data-area-chrome</div>
      </div>
    );
    default: return null;
  }
}

/* --- Readings: contrast of the see-through parts ----------------------------- */

type Rgba = [number, number, number, number];
let probe: CanvasRenderingContext2D | null = null;
/** Any CSS colour as sRGB 0–255 with alpha 0–1, through a 1 × 1 canvas (computed colours come in several spaces). */
function rgba(color: string): Rgba {
  probe ??= Object.assign(document.createElement("canvas"), { width: 1, height: 1 }).getContext("2d", { willReadFrequently: true });
  const ctx = probe!;
  ctx.clearRect(0, 0, 1, 1);
  ctx.fillStyle = "#000"; ctx.fillStyle = color;
  ctx.fillRect(0, 0, 1, 1);
  const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;
  return [r!, g!, b!, a! / 255];
}
const over = (top: Rgba, under: Rgba): Rgba => [0, 1, 2].map(i => top[i]! * top[3] + under[i]! * (1 - top[3])).concat(1) as Rgba;
const luminance = ([r, g, b]: Rgba) => [r, g, b].map(c => { const s = c / 255; return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4; })
  .reduce((sum, c, i) => sum + c * [0.2126, 0.7152, 0.0722][i]!, 0);
const ratio = (a: Rgba, b: Rgba) => { const [x, y] = [luminance(a), luminance(b)].sort((m, n) => n - m); return (x! + 0.05) / (y! + 0.05); };

/** Each backdrop's extremes in a theme: the page, the wallpaper's stops (studio.css .lab-backdrop), the photo's
 *  darkest and lightest pixels, the text's ink and page, black and white. A blurred backdrop averages between them. */
function extremes(kind: Backdrop, page: Rgba, ink: Rgba, theme: "light" | "dark", photo: Rgba[] | null): Rgba[] | null {
  switch (kind) {
    case "page": return [page];
    case "wallpaper": return (theme === "light" ? ["#f9c6a8", "#b7d2ff", "#d9c4ff", "#a9e6d0"] : ["#5a2a1a", "#16305e", "#3b2366", "#12483a"]).map(rgba);
    case "photo": return photo;
    case "text": return [page, ink];
    case "stripes": return [[0, 0, 0, 1], [255, 255, 255, 1]];
  }
}

function usePhotoExtremes(): Rgba[] | null {
  const [value, setValue] = useState<Rgba[] | null>(null);
  useEffect(() => {
    const image = new Image();
    image.onload = () => {
      try {
        const canvas = Object.assign(document.createElement("canvas"), { width: 64, height: 64 });
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(image, 0, 0, 64, 64);
        const data = ctx.getImageData(0, 0, 64, 64).data;
        let dark: Rgba = [255, 255, 255, 1], light: Rgba = [0, 0, 0, 1];
        for (let i = 0; i < data.length; i += 4) {
          const px: Rgba = [data[i]!, data[i + 1]!, data[i + 2]!, 1];
          if (luminance(px) < luminance(dark)) dark = px;
          if (luminance(px) > luminance(light)) light = px;
        }
        setValue([dark, light]);
      } catch { setValue(null); } // A file:// page cannot read its own image's pixels.
    };
    image.src = "images/david-tee.jpg";
  }, []);
  return value;
}

interface Reading { role: string; theme: string; variant: string; opacity: number; body: Record<string, number | null>; muted: Record<string, number | null> }

function Readings({ bundle, variants, themes }: { bundle: string; variants: Variant[]; themes: readonly ("light" | "dark")[] }) {
  const root = useRef<HTMLDivElement>(null);
  const photo = usePhotoExtremes();
  const [rows, setRows] = useState<Reading[]>([]);
  const key = JSON.stringify(variants.map(v => v.style ?? null)) + themes.join();
  useLayoutEffect(() => {
    const frame = requestAnimationFrame(() => {
      const next: Reading[] = [];
      for (const column of root.current?.querySelectorAll<HTMLElement>(".lab-probe-column") ?? []) {
        const theme = column.dataset.areaTheme as "light" | "dark";
        const scope = column.querySelector<HTMLElement>(".lab-scope")!;
        const page = rgba(getComputedStyle(scope).backgroundColor);
        for (const part of column.querySelectorAll<HTMLElement>("[data-probe]")) {
          const fill = rgba(getComputedStyle(part).backgroundColor);
          const body = rgba(getComputedStyle(part.querySelector<HTMLElement>("[data-ink=body]")!).color);
          const muted = rgba(getComputedStyle(part.querySelector<HTMLElement>("[data-ink=muted]")!).color);
          const reading: Reading = { role: part.dataset.probe!, theme, variant: column.dataset.variant!, opacity: fill[3], body: {}, muted: {} };
          for (const kind of BACKDROPS.map(b => b.value)) {
            const stops = extremes(kind, page, body, theme, photo);
            reading.body[kind] = stops ? Math.min(...stops.map(stop => ratio(over(body, over(fill, stop)), over(fill, stop)))) : null;
            reading.muted[kind] = stops ? Math.min(...stops.map(stop => ratio(over(muted, over(fill, stop)), over(fill, stop)))) : null;
          }
          next.push(reading);
        }
      }
      setRows(next);
    });
    return () => cancelAnimationFrame(frame);
  }, [key, bundle, photo]);
  const layers = Object.fromEntries(Object.entries(MATERIAL_BUNDLES[bundle]!.layers).map(([axis, value]) => [`data-area-${axis}`, value]));
  const cell = (value: number | null, floor: number) => value == null ? "—"
    : <span className="lab-ratio" data-fails={value < floor ? "" : undefined}>{value.toFixed(2)}</span>;
  return (
    <div className="lab-board" ref={root}>
      <section className="lab-group" aria-label="Readings">
        <header className="lab-group__head">
          <span className="lab-group__title">Readings</span>
          <span className="lab-group__parts">The least contrast of body and muted ink on each see-through part, over each backdrop's darkest and lightest color (blur only averages between them). Body needs 4.5, muted 4.5 at text size; the material's gradient and sheen layers are not counted.</span>
        </header>
        <Table aria-label="Contrast readings" className="lab-table">
          <thead>
            <tr>
              <th>Part</th><th>Theme</th><th>Variant</th><th>Opacity</th>
              {BACKDROPS.map(b => <th key={b.value}>{b.label}<br /><span className="lab-muted">body / muted</span></th>)}
            </tr>
          </thead>
          <tbody>
            {rows.map(row => (
              <tr key={`${row.role}-${row.theme}-${row.variant}`}>
                <td>{ROLE_LABELS[row.role]}</td><td>{row.theme === "light" ? "Light" : "Dark"}</td><td>{row.variant}</td><td>{Math.round(row.opacity * 100)}%</td>
                {BACKDROPS.map(b => <td key={b.value}>{cell(row.body[b.value]!, 4.5)} / {cell(row.muted[b.value]!, 4.5)}</td>)}
              </tr>
            ))}
          </tbody>
        </Table>
      </section>
      {/* The probes: one part of each see-through group in every column, read above. */}
      <div className="lab-probes" aria-hidden="true">
        {themes.flatMap(theme => variants.map(variant => (
          <div key={`${theme}-${variant.label}`} className="lab-probe-column" data-area-theme={theme} data-variant={variant.label} {...layers}>
            <div className="lab-scope" data-area-material={bundle} style={variant.style}>
              <Card data-probe="surfaces"><CardContent><span data-ink="body" className="lab-ink">Body</span><span data-ink="muted" className="lab-ink lab-ink--muted">Muted</span></CardContent></Card>
              <Popover role="dialog" data-probe="overlays" aria-label="Probe"><span data-ink="body" className="lab-ink">Body</span><span data-ink="muted" className="lab-ink lab-ink--muted">Muted</span></Popover>
              <Toolbar variant="surface" data-probe="chrome" aria-label="Probe"><span data-ink="body" className="lab-ink">Body</span><span data-ink="muted" className="lab-ink lab-ink--muted">Muted</span></Toolbar>
            </div>
          </div>
        )))}
      </div>
    </div>
  );
}

/* --- Inspector --------------------------------------------------------------- */

const GROUP_ORDER = ["Light", "Fill", "Stroke", "Effects", "Page"];

function DraftControls({ bundle, draft, ships, onChange, onReset, onSnapshot }: { bundle: string; draft: Draft; ships: Draft; onChange: (d: Draft) => void; onReset: () => void; onSnapshot: () => void }) {
  const b = MATERIAL_BUNDLES[bundle]!;
  const edited = !same(draft, ships);
  const setLever = (id: string, value: number) => onChange({ ...draft, levers: { ...draft.levers, [id]: value } });
  const roleItems = MATERIAL_ROLES.map(r => ({ value: r.id, label: ROLE_LABELS[r.id]! }));
  return (
    <>
      <PanelSection heading={b.label}>
        <p className="lab-description">{b.description}</p>
        <div className="studio-inspector-actions">
          <Button size="sm" variant="outline" tone="neutral" disabled={!edited} onClick={onReset}>Reset</Button>
          <Button size="sm" variant="outline" tone="neutral" onClick={onSnapshot}>Save snapshot</Button>
          <div className="lab-span"><CopyButton fullWidth label="Copy bundle" icon={<CopyIcon />} value={() => bundleSource(bundle, draft)} /></div>
          <div className="lab-span"><CopyButton fullWidth label="Copy changes" icon={<CopyIcon />} value={() => changeList(bundle, draft)} /></div>
        </div>
      </PanelSection>
      {GROUP_ORDER.map(group => (
        <PanelSection key={group} heading={group}>
          {MATERIAL_LEVERS.filter(l => l.group === group).map(l => {
            const value = draft.levers[l.id]!;
            const was = ships.levers[l.id]!;
            const angle = l.id === "angle";
            return [
              <Slider key={l.id} size="sm" labelPosition="top" label={l.label} title={l.hint}
                min={0} max={angle ? 359 : 8} step={angle ? 1 : 0.1} value={value}
                onValueChange={next => setLever(l.id, next)}
                readout={(v: number) => `${fmt(v)}${angle ? "°" : ""}${v !== was ? ` (was ${fmt(was)})` : ""}`} />,
              ...MATERIAL_SWITCHES.filter(s => s.lever === l.id).map(s => (
                <Field key={s.id} label={s.label} orientation="horizontal">
                  {s.options.length === 2 ? (
                    <Segmented size="sm" fullWidth items={s.options.map(o => ({ value: o.value, label: o.label }))}
                      value={draft.switches[s.id]} onValueChange={next => onChange({ ...draft, switches: { ...draft.switches, [s.id]: next } })} />
                  ) : (
                    <Select size="sm" variant="soft" fullWidth value={draft.switches[s.id]}
                      onChange={event => onChange({ ...draft, switches: { ...draft.switches, [s.id]: event.currentTarget.value } })}>
                      {s.options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </Select>
                  )}
                </Field>
              )),
              ...(l.id === "stroke" ? [
                <Field key="stroke-style" label="Stroke style" orientation="horizontal">
                  <CustomSelect multiple size="sm" variant="soft" fullWidth aria-label="Stroke style" placeholder="None"
                    items={MATERIAL_STROKE_STYLES.map(st => ({ value: st.id, label: st.label }))} values={draft.stroke}
                    onValuesChange={next => onChange({ ...draft, stroke: MATERIAL_STROKE_STYLES.map(st => st.id).filter(id => next.includes(id)) })} />
                </Field>,
              ] : []),
            ];
          })}
        </PanelSection>
      ))}
      <PanelSection heading="Targets">
        {Object.keys(MATERIAL_TARGETS).map(lever => (
          <Field key={lever} label={MATERIAL_LEVERS.find(l => l.id === lever)!.label} orientation="horizontal">
            <CustomSelect multiple size="sm" variant="soft" fullWidth aria-label={`${MATERIAL_LEVERS.find(l => l.id === lever)!.label} reaches`} placeholder="Nothing"
              items={roleItems} values={draft.targets[lever]!}
              onValuesChange={next => onChange({ ...draft, targets: { ...draft.targets, [lever]: MATERIAL_ROLES.map(r => r.id).filter(id => next.includes(id)) } })} />
          </Field>
        ))}
      </PanelSection>
      <PanelSection heading="Strengths">
        {MATERIAL_ROLES.map(r => (
          <Slider key={r.id} size="sm" labelPosition="top" label={ROLE_LABELS[r.id]} title={ROLE_PARTS[r.id]}
            min={0} max={1.5} step={0.05} value={draft.strengths[r.id]!}
            onValueChange={next => onChange({ ...draft, strengths: { ...draft.strengths, [r.id]: next } })}
            readout={(v: number) => `${fmt(v)}${v !== r.strength ? ` (was ${fmt(r.strength)})` : ""}`} />
        ))}
      </PanelSection>
      <PanelSection heading="Notes">
        <Textarea size="sm" variant="soft" fullWidth rows={3} aria-label="Notes" placeholder="What to keep, adjust or rethink"
          value={draft.notes} onChange={event => onChange({ ...draft, notes: event.currentTarget.value })} />
      </PanelSection>
    </>
  );
}

function Snapshots({ bundle, snapshots, onLoad, onDelete }: { bundle: string; snapshots: Snapshot[]; onLoad: (s: Snapshot) => void; onDelete: (s: Snapshot) => void }) {
  const own = snapshots.filter(s => s.bundle === bundle);
  if (!own.length) return null;
  return (
    <PanelSection heading="Snapshots">
      {own.map(s => (
        <div key={s.id} className="lab-snapshot">
          <span className="lab-snapshot__name" title={new Date(s.at).toLocaleString()}>{s.name}</span>
          <Button size="sm" variant="ghost" tone="neutral" onClick={() => onLoad(s)}>Load</Button>
          <Button size="sm" variant="ghost" tone="neutral" onClick={() => onDelete(s)}>Delete</Button>
        </div>
      ))}
    </PanelSection>
  );
}

/** What is open, and where the research lives (.Codex/HANDOFF.md "Material in the Inspector"). */
function Research({ bundle }: { bundle: string }) {
  return (
    <PanelSection heading="Research">
      <Facts label="Research" items={[
        ["Open", "Per-lever targets and group strengths are fixed per bundle in the setting (tune them here). Muted text on light gradients holds 4.5:1 only to gradient 3. No contrast sweep with materials on yet. Glass needs a backdrop to read."],
        ["Reading floor", "Glass over any backdrop: body 0.56 light / 0.62 dark; muted 0.90 / 0.73 (22-calibration floors.mjs). Text parts stop transparency at the body floor."],
        ["Bundle", <Code>MATERIAL_BUNDLES.{bundle}</Code>],
        ["Tokens", <Code>packages/tokens/src/axes/material.ts</Code>],
        ["Receivers", <Code>packages/styles/src/material.css</Code>],
        ["Research", <Code>docs/research/astra/materials/27-levers, 28-recipes, 29-scope, REVIEW.md</Code>],
      ]} />
    </PanelSection>
  );
}
