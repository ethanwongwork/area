// The defaults review page (owner, 2026-10-25): every Inspector setting in twelve groups, one group at a time, each
// setting's real Inspector row (apps/desktop/src/inspector-rows.tsx), its current default and a recommendation, and the
// Workspace screen (apps/desktop/src/setup-screen.tsx, Area's real components) in light and dark under the picks so far.
// Picks save to the artifact's database: collection `picks`, one doc per setting ({ value }); `groups`, one doc per
// group ({ decided, note }). The owner's picks become each axis's `defaultPreset`.
import { createRoot } from "react-dom/client";
import { useEffect, useMemo, useRef, useState } from "react";
import { DEFAULT_MATERIAL, MATERIAL_BUNDLES } from "@area/tokens/config";
import { Badge, Button, Checkbox, Field, Segmented, Switch, Tabs } from "@area/react";
import { SettingRow } from "../../../../apps/desktop/src/inspector-rows.tsx";
import { GALLERY_CONTROLS } from "../../../../apps/desktop/src/gallery/controls.ts";
import { ScreenFigure } from "../../../../apps/desktop/src/setup-screen.tsx";
import { materialAttributes } from "../../../../apps/desktop/src/material.ts";
import { GROUPS, type Group } from "./groups.ts";

type Values = Record<string, string>;
type Mode = "light" | "dark";
type GroupMark = { decided: boolean; note: string };

const MODE_OF = (axis: string) => /-(light|dark)$/.exec(axis)?.[1] as Mode | undefined;
const controlOf = (axis: string) => GALLERY_CONTROLS.find(entry => entry.axis === axis);
const title = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);
const BUNDLES = Object.keys(MATERIAL_BUNDLES);

/** The current defaults: every Inspector control's default, and the Material's. */
const CURRENT: Values = { ...Object.fromEntries(GALLERY_CONTROLS.map(control => [control.axis, control.defaultValue])), material: DEFAULT_MATERIAL };
const RECOMMENDED: Values = { ...CURRENT, ...Object.fromEntries(GROUPS.flatMap(group => Object.entries(group.recommend).map(([axis, rec]) => [axis, rec.value]))) };

/** A value as the Inspector names it. */
function say(axis: string, value: string): string {
  if (axis === "material") return title(value);
  if (axis === "pills") return value ? value.split(" ").map(title).join(", ") : "None";
  if (axis === "neutral") return title(value);
  if (/^tint-/.test(axis) && value === "auto") return "Grey's own";
  const control = controlOf(axis);
  return control?.items.find(item => item.value === value)?.label ?? title(value);
}

/** The picks as a scope's attributes, as the app's Canvas writes them (studio.tsx canvasAttributes). */
function scopeOf(values: Values, mode: Mode): Record<string, string | undefined> {
  const attrs: Record<string, string | undefined> = { "data-area-theme": mode };
  for (const [axis, value] of Object.entries(values)) {
    if (axis === "theme" || axis === "material") continue;
    if (axis === "contrast" && value === "system") continue;
    attrs[`data-area-${axis}`] = value;
  }
  return { ...attrs, ...materialAttributes({ bundle: values.material ?? DEFAULT_MATERIAL, overrides: {} }) };
}

/** Real controls under the picked Speed, Easing and Feedback, to click; a Switch flips by itself so the motion shows. */
function MotionBench({ values, mode }: { values: Values; mode: Mode }) {
  const [on, setOn] = useState(true);
  useEffect(() => { const timer = setInterval(() => setOn(value => !value), 1400); return () => clearInterval(timer); }, []);
  return (
    <div className="bench" {...scopeOf(values, mode)}>
      <div className="bench-row"><Switch label="Flips by itself" checked={on} onCheckedChange={setOn} /><Checkbox label="Click me" defaultChecked /></div>
      <Segmented size="sm" aria-label="Segmented" items={[{ value: "a", label: "One" }, { value: "b", label: "Two" }, { value: "c", label: "Three" }]} defaultValue="a" />
      <Tabs size="sm" aria-label="Tabs" items={[{ id: "a", label: "Overview" }, { id: "b", label: "Issues" }, { id: "c", label: "Timeline" }]} defaultValue="a" />
      <div className="bench-row"><Button size="sm">Press me</Button><Button size="sm" variant="outline">Hover me</Button><Button size="sm" variant="ghost">Ghost</Button></div>
    </div>
  );
}

function Screens({ group, values, view }: { group: Group; values: Values; view: "whole" | "close" }) {
  const figureView = view === "close" ? { scale: 1, focus: group.focus } : {};
  return (
    <div className="screens">
      {(["light", "dark"] as const).map(mode => (
        <figure key={mode} className="screen">
          <div className="screen-frame">
            <ScreenFigure scope={scopeOf(values, mode)} hold={group.hold} fidelity="real" view={figureView} crossfade />
          </div>
          <figcaption>{title(mode)}</figcaption>
        </figure>
      ))}
      {group.id === "motion" ? (["light", "dark"] as const).map(mode => (
        <figure key={`bench-${mode}`} className="screen"><MotionBench values={values} mode={mode} /><figcaption>{title(mode)} · click and hover</figcaption></figure>
      )) : null}
    </div>
  );
}

/** One setting: its Inspector row, the current default, the recommendation and why. */
function SettingCard({ group, axis, values, set }: { group: Group; axis: string; values: Values; set: (changes: Values) => void }) {
  const ids = axis === "neutral" ? ["neutral", "tint-hue", "tint-light", "tint-dark"] : [axis];
  const rec = group.recommend[axis];
  const changed = ids.some(id => values[id] !== CURRENT[id]);
  const atRec = ids.every(id => values[id] === RECOMMENDED[id]);
  const own = MODE_OF(axis);
  const name = axis === "neutral" ? "Greys" : axis === "material" ? "Material" : controlOf(axis)?.label ?? axis;
  return (
    <article className="setting" data-changed={changed ? "" : undefined}>
      <div className="setting-head">
        <h3>{name}{own ? <span className="mode">{own}</span> : null}</h3>
        <code>{axis === "neutral" ? "neutral · tint-*" : axis}</code>
      </div>
      <div className="well" data-area-theme={own ?? "light"}>
        {axis === "material" ? (
          <Field label="Material">
            <Segmented size="sm" fullWidth aria-label="Material" items={BUNDLES.map(value => ({ value, label: title(value) }))} value={values.material} onValueChange={value => set({ material: value })} />
          </Field>
        ) : (
          <div className="stack"><SettingRow axis={axis} context={{ values, mode: own ?? "light", set }} /></div>
        )}
      </div>
      <dl>
        <dt>Now</dt><dd>{ids.map(id => say(id, CURRENT[id]!)).join(" · ")}</dd>
        {rec ? <><dt>Recommend</dt><dd><b>{ids.map(id => say(id, RECOMMENDED[id]!)).join(" · ")}</b>{rec.value === CURRENT[axis] ? " (keep)" : null}. {rec.why}</dd></> : null}
        <dt>Your pick</dt><dd>{ids.map(id => say(id, values[id]!)).join(" · ")}{changed ? <Badge size="sm" tone="info">Changed</Badge> : null}</dd>
      </dl>
      <div className="setting-actions">
        <Button size="sm" variant="outline" disabled={atRec} onClick={() => set(Object.fromEntries(ids.map(id => [id, RECOMMENDED[id]!])))}>Use recommended</Button>
        <Button size="sm" variant="ghost" disabled={!changed} onClick={() => set(Object.fromEntries(ids.map(id => [id, CURRENT[id]!])))}>Back to current</Button>
      </div>
    </article>
  );
}

function App() {
  const [values, setValues] = useState<Values>(CURRENT);
  const [marks, setMarks] = useState<Record<string, GroupMark>>({});
  const [db, setDb] = useState<any>(null);
  const [at, setAt] = useState(() => { try { return Math.max(0, GROUPS.findIndex(group => group.id === localStorage.getItem("defaults-group"))); } catch { return 0; } });
  const [view, setView] = useState<"whole" | "close">("whole");
  const [compare, setCompare] = useState<"picks" | "current">("picks");
  const pending = useRef(new Map<string, ReturnType<typeof setTimeout>>());
  const viewerDark = () => document.documentElement.dataset.theme ? document.documentElement.dataset.theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
  useEffect(() => { document.documentElement.setAttribute("data-area-theme", viewerDark() ? "dark" : "light"); }, []);
  useEffect(() => { try { localStorage.setItem("defaults-group", GROUPS[at]!.id); } catch {} window.scrollTo({ top: 0 }); }, [at]);
  useEffect(() => {
    let offPicks: (() => void) | undefined, offGroups: (() => void) | undefined;
    (async () => {
      const store = await (window as any).claude?.use?.("db").catch(() => null);
      if (!store) return;
      setDb(store);
      offPicks = store.collection("picks").onSnapshot((snap: any) => {
        const saved: Values = {};
        for (const doc of snap.docs) { const value = doc.data()?.value; if (typeof value === "string") saved[doc.id] = value; }
        setValues(current => ({ ...current, ...saved }));
      }, () => {});
      offGroups = store.collection("groups").onSnapshot((snap: any) => {
        const next: Record<string, GroupMark> = {};
        for (const doc of snap.docs) { const data = doc.data() ?? {}; next[doc.id] = { decided: !!data.decided, note: data.note ?? "" }; }
        setMarks(next);
      }, () => {});
    })();
    return () => { offPicks?.(); offGroups?.(); };
  }, []);
  // A drag writes once it settles.
  const set = (changes: Values) => {
    setValues(current => ({ ...current, ...changes }));
    if (!db) return;
    for (const [axis, value] of Object.entries(changes)) {
      clearTimeout(pending.current.get(axis));
      pending.current.set(axis, setTimeout(() => db.collection("picks").doc(axis).set({ value, at: new Date().toISOString() }).catch(() => {}), 500));
    }
  };
  const mark = (id: string, next: GroupMark) => {
    setMarks(current => ({ ...current, [id]: next }));
    db?.collection("groups").doc(id).set({ ...next, at: new Date().toISOString() }).catch(() => {});
  };
  const group = GROUPS[at]!;
  const groupMark = marks[group.id] ?? { decided: false, note: "" };
  const decided = GROUPS.filter(entry => marks[entry.id]?.decided).length;
  const changedIn = (entry: Group) => entry.axes.filter(axis => values[axis] !== CURRENT[axis]).length;
  const shown = useMemo(() => compare === "current" ? CURRENT : values, [compare, values]);
  return (
    <div className="page">
      <header className="masthead">
        <span className="eyebrow">Area · Defaults · 2026-10-25</span>
        <h1>Area's defaults</h1>
        <p className="lede">Choose the value every setting starts at, one group at a time. These become the library's shipped defaults, and the app's own UI is drawn in them. Changes you make in the Inspector afterwards only change the Canvas. Each group shows the Workspace screen, built from Area's real components, in light and dark under your picks so far, with the states it changes held still. Every setting starts at its current default and comes with a recommendation from the measured references (ChatGPT, Notion, Figma) and the system's rules.</p>
        <div className="masthead-row">
          <span className="tally"><b>{decided}</b> of {GROUPS.length} groups decided{db ? null : " · open with edit access to save picks"}</span>
        </div>
      </header>
      <div className="layout">
        <nav className="steps" aria-label="Groups">
          {GROUPS.map((entry, index) => {
            const changes = changedIn(entry);
            return (
              <button key={entry.id} type="button" className="step" aria-current={index === at ? "step" : undefined} onClick={() => setAt(index)}>
                <span className="step-num">{marks[entry.id]?.decided ? "✓" : index + 1}</span>
                <span className="step-name">{entry.title}</span>
                {changes ? <span className="step-count">{changes} changed</span> : null}
              </button>
            );
          })}
        </nav>
        <main className="group">
          <div className="group-head">
            <div>
              <span className="eyebrow">Group {at + 1} of {GROUPS.length}</span>
              <h2>{group.title}</h2>
              <p className="lede">{group.lede}</p>
            </div>
            <div className="group-tools">
              <Segmented size="sm" aria-label="Show" items={[{ value: "picks", label: "Your picks" }, { value: "current", label: "Current defaults" }]} value={compare} onValueChange={value => setCompare(value as "picks" | "current")} />
              <Segmented size="sm" aria-label="Framing" items={[{ value: "whole", label: "Whole screen" }, { value: "close", label: "Close up" }]} value={view} onValueChange={value => setView(value as "whole" | "close")} />
            </div>
          </div>
          <Screens group={group} values={shown} view={view} />
          <div className="settings">
            {group.rows.map(axis => <SettingCard key={axis} group={group} axis={axis} values={values} set={set} />)}
          </div>
          <footer className="group-foot">
            <textarea aria-label={`Notes on ${group.title}`} placeholder="Notes on this group (optional)" defaultValue={groupMark.note} key={`${group.id}:${groupMark.note}`}
              onBlur={event => event.currentTarget.value !== groupMark.note && mark(group.id, { ...groupMark, note: event.currentTarget.value })} />
            <div className="foot-actions">
              <Button variant="ghost" disabled={at === 0} onClick={() => setAt(at - 1)}>Previous</Button>
              <Button variant={groupMark.decided ? "outline" : "solid"} disabled={!db} onClick={() => { mark(group.id, { ...groupMark, decided: !groupMark.decided }); if (!groupMark.decided && at < GROUPS.length - 1) setAt(at + 1); }}>
                {groupMark.decided ? "Reopen this group" : at < GROUPS.length - 1 ? "Decided, next group" : "Decided"}
              </Button>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
