/**
 * System Inventory review page (2026-11-08). Owner, reviewing Area's scope: "more straightforward editing tools for
 * customizing and updating a design system, components" — the brief's layers 2 (inventory) and 3 (structure).
 *
 * Every panel, control, tile and table here is Area's real React, in Area's CSS, in the placeholder vocabulary. The hero is
 * live: leave a value out in the panel and the gallery beside it follows, as the app does. Each question starts on the
 * recommended answer (which is what the app now has built); picks save to the page's store, collection `verdicts`, one
 * document per question { pick, note, at }. Built by build.mjs against a tree. Research and ranking: README.md.
 */
import { createRoot } from "react-dom/client";
import { useEffect, useLayoutEffect, useState, type ReactNode } from "react";
import {
  Alert, Badge, Button, Checkbox, Field, Input, PanelSection, Radio, RadioGroup, Segmented, Select, Switch, Table, TableCell,
  TableHeaderCell, Tabs, Textarea,
} from "@area/react";
import { StatusAvailableFilledIcon, ArchiveIcon } from "@area/icons";
import { GALLERY_CONTROLS } from "@src/gallery/controls.ts";

type Mode = "light" | "dark";
const DEFAULTS: Record<string, string> = Object.fromEntries(GALLERY_CONTROLS.filter(c => c.axis !== "theme").map(c => [c.axis, c.defaultValue]));
const scopeOf = (mode: Mode): Record<string, string> => {
  const out: Record<string, string> = { "data-area-theme": mode };
  for (const [axis, value] of Object.entries(DEFAULTS)) if (!(axis === "contrast" && value === "system")) out[`data-area-${axis}`] = value;
  return out;
};

/* --- The hero: Button's inventory, live ------------------------------------------------------------------------------- */

const VARIANTS = ["solid", "soft", "outline", "ghost"] as const;
const TONES = ["neutral", "info", "success", "warning", "danger"] as const;
const SIZES = ["sm", "md", "lg"] as const;
const WORD: Record<string, string> = { sm: "Small", md: "Medium", lg: "Large" };
const word = (value: string) => WORD[value] ?? value.charAt(0).toUpperCase() + value.slice(1);
type Inventory = { included: boolean; out: Set<string>; variant: string };
const START: Inventory = { included: true, out: new Set(["variant:outline", "tone:danger"]), variant: "solid" };

function Panel({ inv, set }: { inv: Inventory; set: (next: Inventory) => void }) {
  const toggle = (key: string, on: boolean) => {
    const out = new Set(inv.out);
    if (on) out.delete(key); else out.add(key);
    const variants = VARIANTS.filter(v => !out.has(`variant:${v}`));
    if (!variants.length) return;
    set({ ...inv, out, variant: variants.includes(inv.variant as never) ? inv.variant : variants[0]! });
  };
  const axis = (name: string, label: string, values: readonly string[]) => {
    const kept = values.filter(v => !inv.out.has(`${name}:${v}`));
    return (
      <Field label={label} orientation="horizontal">
        <div className="si-values">
          {values.map(v => <Checkbox key={v} label={word(v)} checked={!inv.out.has(`${name}:${v}`)}
            disabled={kept.length === 1 && kept[0] === v} onChange={e => toggle(`${name}:${v}`, e.currentTarget.checked)} />)}
        </div>
      </Field>
    );
  };
  const variants = VARIANTS.filter(v => !inv.out.has(`variant:${v}`));
  return (
    <div className="si-insp" data-area-ground="raised">
      <div className="si-insp__head"><Segmented size="sm" aria-label="Inspector" value="design" items={[{ value: "theme", label: "Theme" }, { value: "design", label: "Design" }, { value: "code", label: "Code" }]} /></div>
      <PanelSection heading="In Area">
        <Field label="Included" orientation="horizontal"><Switch size="sm" aria-label="Include Button in Area" checked={inv.included} onChange={e => set({ ...inv, included: e.currentTarget.checked })} /></Field>
        {inv.included ? <>
          {axis("variant", "Variants", VARIANTS)}
          <Field label="Default" orientation="horizontal">
            <Select size="sm" fullWidth value={inv.variant} aria-label="Default variant" onChange={e => set({ ...inv, variant: e.currentTarget.value })}>
              {variants.map(v => <option key={v} value={v}>{word(v)}</option>)}
            </Select>
          </Field>
          {axis("tone", "Tones", TONES)}
          {axis("size", "Sizes", SIZES)}
          {axis("state", "States", ["disabled", "loading"])}
        </> : null}
      </PanelSection>
    </div>
  );
}

type Tile = { key: string; label: string; node: ReactNode; uses: string[] };
const TILES: Tile[] = [
  ...VARIANTS.map(v => ({ key: `v-${v}`, label: word(v), node: <Button variant={v}>Button</Button>, uses: [`variant:${v}`] })),
  ...TONES.map(t => ({ key: `t-${t}`, label: word(t), node: <Button variant="soft" tone={t}>Button</Button>, uses: [`tone:${t}`] })),
  ...SIZES.map(s => ({ key: `s-${s}`, label: word(s), node: <Button size={s}>Button</Button>, uses: [`size:${s}`] })),
  { key: "loading", label: "Loading", node: <Button loading>Button</Button>, uses: ["state:loading"] },
];
type Show = "hidden" | "muted" | "group";
function Gallery({ inv, show, all }: { inv: Inventory; show: Show; all?: boolean }) {
  const isOut = (tile: Tile) => !inv.included || tile.uses.some(use => inv.out.has(use));
  const card = (tile: Tile, out: boolean) => (
    <figure key={tile.key} className="si-tile" data-out={out && show === "muted" ? "" : undefined}>
      <div className="si-tile__frame">{tile.node}</div>
      <figcaption className="si-tile__cap"><span>{tile.label}</span>{out && (all || show !== "hidden") ? <Badge size="sm" variant="soft" tone="neutral" icon={<ArchiveIcon />}>Left out</Badge> : null}</figcaption>
    </figure>
  );
  const kept = TILES.filter(t => !isOut(t)), out = TILES.filter(isOut);
  return (
    <div className="si-gallery">
      <div className="si-gallery__head">
        <span className="si-gallery__title">Button <span className="si-muted">{show === "hidden" && !all ? kept.length : TILES.length}</span></span>
        <Badge size="sm" variant="soft" tone="success" icon={<StatusAvailableFilledIcon />}>Complete</Badge>
        {!inv.included ? <Badge size="sm" variant="soft" tone="neutral" icon={<ArchiveIcon />}>Left out</Badge> : null}
      </div>
      <div className="si-grid">
        {show === "group" ? kept.map(t => card(t, false)) : TILES.filter(t => all || show !== "hidden" || !isOut(t)).map(t => card(t, isOut(t)))}
      </div>
      {show === "group" && out.length ? <><p className="si-group">Left out <span className="si-muted">{out.length}</span></p><div className="si-grid">{out.map(t => card(t, true))}</div></> : null}
      {show === "hidden" && !all && out.length ? <p className="si-muted si-gallery__foot">{out.length} left out. Show › With left out brings them back with a badge.</p> : null}
    </div>
  );
}

/* --- Figures for the questions --------------------------------------------------------------------------------------- */

function Thumbs({ label, value, items }: { label: string; value: string; items: Array<{ value: string; label: string; node: ReactNode }> }) {
  const [picked, setPicked] = useState(value);
  return (
    <RadioGroup label={<span className="si-sr">{label}</span>} orientation="horizontal" value={picked} onValueChange={setPicked} className="si-thumbs">
      {items.map(item => <Radio key={item.value} variant="soft" layout="thumbnail" value={item.value} label={item.label}
        leadingVisual={<div className="si-thumb" inert>{item.node}</div>} />)}
    </RadioGroup>
  );
}
const tabs = (selection: "marker" | "plate") => <Tabs size="sm" selection={selection} aria-label="Tabs" value="one" items={[{ id: "one", label: "One" }, { id: "two", label: "Two" }]} />;
function Structure({ which }: { which: "tabs" | "shell" | "label" }) {
  if (which === "tabs") return (
    <PanelSection heading="Selected tab">
      <Thumbs label="How is the selected tab marked?" value="marker" items={[{ value: "marker", label: "Underline", node: tabs("marker") }, { value: "plate", label: "Plate", node: tabs("plate") }]} />
      <Field label="Also offer" orientation="horizontal"><Checkbox label="Plate" defaultChecked /></Field>
    </PanelSection>
  );
  if (which === "shell") return (
    <PanelSection heading="Field shell">
      <Thumbs label="How are text fields drawn?" value="outline" items={[
        { value: "outline", label: "Outlined", node: <Input size="sm" variant="outline" placeholder="Placeholder" aria-label="Placeholder" /> },
        { value: "soft", label: "Soft", node: <Input size="sm" variant="soft" placeholder="Placeholder" aria-label="Placeholder" /> }]} />
      <p className="si-muted si-small">Also sets Select, Text area, Input group and Number field.</p>
    </PanelSection>
  );
  return (
    <PanelSection heading="Labels">
      <Thumbs label="Where do field labels sit?" value="vertical" items={[
        { value: "vertical", label: "Above", node: <Field label="Label"><Input size="sm" placeholder="Placeholder" /></Field> },
        { value: "horizontal", label: "Beside", node: <Field label="Label" orientation="horizontal"><Input size="sm" placeholder="Placeholder" /></Field> }]} />
    </PanelSection>
  );
}
function PublishTable() {
  const rows = [
    ["Components", "Button variants: Outline", "Included", "Left out"],
    ["Components", "Button tones: Danger", "Included", "Left out"],
    ["Components", "Tabs, default selected tab", "Underline", "Plate"],
    ["Default", "Radius", "10", "12"],
  ];
  return (
    <div className="si-dialog" data-area-ground="raised">
      <p className="si-dialog__title">Publish Area 2.0</p>
      <p className="si-muted">Everyone using Area and every project on it gets Area 2.0. It goes in Versions with this note.</p>
      <Table aria-label="Changes" size="sm">
        <thead><tr><TableHeaderCell>Where</TableHeaderCell><TableHeaderCell>Setting</TableHeaderCell><TableHeaderCell>Live</TableHeaderCell><TableHeaderCell>Publishing</TableHeaderCell></tr></thead>
        <tbody>{rows.map((row, i) => <tr key={i}>{row.map((cell, j) => <TableCell key={j} className={j === 2 ? "si-muted" : undefined}>{cell}</TableCell>)}</tr>)}</tbody>
      </Table>
      <RadioGroup label="Kind" value="needs-work">
        <Radio variant="soft" layout="list" value="fixes" label="Fixes" meta="Area 1.2.1" description="Values change; nothing is added or taken away." />
        <Radio variant="soft" layout="list" value="adds" label="Adds" meta="Area 1.3" description="Something new, such as a theme." />
        <Radio variant="soft" layout="list" value="needs-work" label="Needs work in products" meta="Area 2.0" description="Something removed, renamed or left out: products using it need work. Proposed from the changes." />
      </RadioGroup>
    </div>
  );
}
function ProjectNotice() {
  return (
    <div className="si-project">
      <Alert tone="info" layout="multiline" title="Area 2.0 is out" action={<div className="si-row"><Button size="sm" variant="ghost" tone="neutral">Review</Button><Button size="sm">Update</Button></div>}>
        Button's outline variant is left out; 3 layers here use it. This project stays on Area 1.2 until you update.
      </Alert>
    </div>
  );
}
function Placements({ which }: { which: string }) {
  if (which === "table") return (
    <Table aria-label="Inventory" size="sm">
      <thead><tr><TableHeaderCell>Family</TableHeaderCell><TableHeaderCell>In Area</TableHeaderCell><TableHeaderCell>Left out</TableHeaderCell></tr></thead>
      <tbody>
        {[["Badge", true, "—"], ["Button", true, "Outline, Danger"], ["Calendar", false, "Everything"], ["Tabs", true, "—"]].map(([name, on, out]) => (
          <tr key={String(name)}><TableCell>{name}</TableCell><TableCell><Switch size="sm" aria-label={`Include ${name}`} defaultChecked={Boolean(on)} /></TableCell><TableCell className="si-muted">{out}</TableCell></tr>
        ))}
      </tbody>
    </Table>
  );
  return null;
}

/* --- Questions ------------------------------------------------------------------------------------------------------- */

type Option = { value: string; label: string; about: string; rec?: boolean; figure?: () => ReactNode };
type Question = { id: string; title: string; about: string; options: Option[] };
const QUESTIONS: Question[] = [
  { id: "scope", title: "Whose is the library: the system's or each theme's?", about: "Themes are looks; the library is what products can use and how each family is built.", options: [
    { value: "system", label: "The system's", about: "Every theme shares one inventory and one structure; a theme changes only the look.", rec: true },
    { value: "theme", label: "Each theme's", about: "A theme may leave out tones or pick its own tabs, at the cost of projects not knowing which they have." },
  ] },
  { id: "where", title: "Where are inventory and structure edited?", about: "Where the library is already seen, or somewhere of their own.", options: [
    { value: "components", label: "Components pages and the Design view", about: "A family's Design view has In <system> and its Structure; the List view is the inventory table. You edit where you look.", rec: true,
      figure: () => <div className="si-pair"><Placements which="table" /><Structure which="tabs" /></div> },
    { value: "page", label: "An Inventory page of its own", about: "One table of every family and axis under Components. Fast to scan, but apart from the pictures." },
    { value: "setup", label: "Setup's questions only", about: "Right for a new system's first pass; wrong for updating one. Planned later on the same data." },
  ] },
  { id: "show", title: "How does something left out show?", about: "The gallery should read as the product's library, and what was left out should be easy to bring back.", options: [
    { value: "hidden", label: "Hidden, with Show › With left out", about: "The gallery shows the system as it ships; turned on, left-out tiles come back with a Left out badge.", rec: true, figure: () => <Gallery inv={START} show="hidden" /> },
    { value: "muted", label: "Always shown, muted", about: "Keeps the room, but the gallery no longer reads as the product's library.", figure: () => <Gallery inv={START} show="muted" /> },
    { value: "group", label: "Moved to a Left out group", about: "Clear, but tiles move as you edit.", figure: () => <Gallery inv={START} show="group" /> },
  ] },
  { id: "defaults", title: "How are defaults chosen?", about: "A default is what a use without the prop draws, and what the code writes when nothing is said.", options: [
    { value: "select", label: "One per axis, in the Design view", about: "A Default menu under each axis's values; leaving out the default moves it to the first still in; a structure pick sets it.", rec: true },
    { value: "setup", label: "Only in Setup", about: "Chosen once, as a question; changed by asking again." },
    { value: "usage", label: "Suggested from use", about: "Later: 8 of 9 buttons in your projects are soft, so make soft the default." },
  ] },
  { id: "pilots", title: "Which families are the structure pilots?", about: "Only alternatives the CSS already draws; missing ones are built as values first.", options: [
    { value: "three", label: "Tabs, Field shell, Labels", about: "Selected tab (underline or plate); every text field outlined or soft; labels above, beside or by width.", rec: true,
      figure: () => <div className="si-triple"><Structure which="tabs" /><Structure which="shell" /><Structure which="label" /></div> },
    { value: "more", label: "Those and Calendar", about: "Adds Calendar's days (square, circle, tile) and caption (label, menus)." },
    { value: "one", label: "Tabs only", about: "One pilot to judge the pattern before the rest." },
  ] },
  { id: "publish", title: "How do library changes publish?", about: "The working copy already holds themes; Publish makes a version.", options: [
    { value: "rows", label: "Rows in the same Publish", about: "The library sits beside the themes in the working copy; its changes list under Components; leaving out proposes Needs work, bringing back proposes Adds, a default proposes Fixes.", rec: true, figure: () => <PublishTable /> },
    { value: "separate", label: "A library version of its own", about: "Two numbers for one system." },
  ] },
  { id: "projects", title: "How are projects on an earlier version told?", about: "Until now every project followed its system's Live version.", options: [
    { value: "pin", label: "Keep their version until they update", about: "A notice on the project names what changed and what in it uses something left out, with Review and Update. Fixes and Adds update on their own; Needs work always asks.", rec: true, figure: () => <ProjectNotice /> },
    { value: "follow", label: "Follow Live at once", about: "Today's rule, with a one-time note of what changed." },
    { value: "each", label: "Accept family by family", about: "Update Tabs now and Button later; a project on a mix of versions is hard to reason about." },
  ] },
];

/* --- Picks ----------------------------------------------------------------------------------------------------------- */

type Verdict = { pick?: string; note?: string; at?: number };
declare global { interface Window { claude?: { use: (name: string) => Promise<any> } } }
function useVerdicts() {
  const [db, setDb] = useState<any>(null);
  const [state, setState] = useState<"waiting" | "live" | "none">("waiting");
  const [verdicts, setVerdicts] = useState<Record<string, Verdict>>({});
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
    const merged = { ...verdicts[id], ...next, at: Date.now() };
    setVerdicts(v => ({ ...v, [id]: merged }));
    if (!db) return;
    try { await db.doc(`verdicts/${id}`).set(merged); } catch { setState("none"); }
  };
  return { state, verdicts, save };
}

function QuestionBlock({ q, i, verdict, save }: { q: Question; i: number; verdict?: Verdict; save: (id: string, v: Verdict) => void }) {
  const rec = q.options.find(o => o.rec)!.value;
  const pick = verdict?.pick ?? rec;
  const [note, setNote] = useState<string | undefined>(undefined);
  const shown = q.options.find(o => o.value === pick) ?? q.options[0]!;
  return (
    <section className="si-q" id={`q-${q.id}`} aria-labelledby={`q-${q.id}-title`}>
      <header className="si-q__head">
        <span className="si-q__n">Q{i + 1}</span>
        <div><h2 id={`q-${q.id}-title`}>{q.title}</h2><p>{q.about}</p></div>
      </header>
      {shown.figure ? <div className="si-q__fig"><div className="si-frame">{shown.figure()}</div></div> : null}
      <RadioGroup label={q.title} className="si-q__group" value={pick} onValueChange={v => save(q.id, { pick: v })} name={`q-${q.id}`}>
        {q.options.map(o => (
          <Radio key={o.value} value={o.value} id={`q-${q.id}-${o.value}`} variant="card"
            label={<>{o.label}{o.rec ? <span className="si-rec">Recommended, built</span> : null}</>} description={o.about} />
        ))}
      </RadioGroup>
      <div className="si-q__note">
        <Textarea id={`note-${q.id}`} aria-label={`Note on ${q.title}`} placeholder="Note (optional)" rows={2}
          value={note ?? verdict?.note ?? ""} onChange={e => setNote(e.currentTarget.value)}
          onBlur={() => { if (note !== undefined && note !== (verdict?.note ?? "")) save(q.id, { pick, note }); }} />
      </div>
    </section>
  );
}

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
  useLayoutEffect(() => { for (const [k, v] of Object.entries(scopeOf(mode))) document.documentElement.setAttribute(k, v); }, [mode]);
  return mode;
}

function App() {
  usePageMode();
  const { state, verdicts, save } = useVerdicts();
  const [inv, setInv] = useState<Inventory>(START);
  const [all, setAll] = useState(false);
  return (
    <div className="si-page">
      <header className="si-top">
        <p className="si-eyebrow">Area, proposal for review, 2026-11-08</p>
        <h1>System Inventory</h1>
        <p className="si-lede">Choosing what a system includes (its families, variants, tones, sizes and states, and their defaults) and how each family is built (its structure), on top of the foundation settings. Every panel, tile and table here is Area's real UI. Each question starts on the recommended answer, which is what the app now has built; choose another to redraw its picture and record your pick.</p>
        <span className="si-store" data-state={state}>{state === "live" ? "Picks save as you choose them." : state === "waiting" ? "Connecting to the page's store…" : "Picks can't be saved in this view; they stay until you reload."}</span>
      </header>
      <section className="si-hero" aria-labelledby="hero-title">
        <header className="si-section__head">
          <h2 id="hero-title">Button in Area, edited where it is seen</h2>
          <p>The Design view for Button, beside its gallery. This one is live: leave a variant, tone or size out and its tiles leave the gallery; turn Included off and the whole family is left out.</p>
        </header>
        <div className="si-hero__body">
          <Panel inv={inv} set={setInv} />
          <div className="si-hero__canvas">
            <div className="si-row si-hero__bar"><Segmented size="sm" aria-label="Show" value={all ? "all" : "system"} onValueChange={v => setAll(v === "all")} items={[{ value: "system", label: "In Area" }, { value: "all", label: "With left out" }]} /></div>
            <Gallery inv={inv} show="hidden" all={all} />
          </div>
        </div>
      </section>
      {QUESTIONS.map((q, i) => <QuestionBlock key={q.id} q={q} i={i} verdict={verdicts[q.id]} save={save} />)}
      <footer className="si-foot">Research, options and the working copy's shape: docs/research/system-inventory-2026-11-08/README.md. Built from Area's packages in the system-inventory worktree.</footer>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
