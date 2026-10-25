// The theme controls review page: the Inspector's real controls (apps/desktop/src/gallery/controls.ts, Area's Slider
// field variant and Segmented), one card each, a live preview of real components under the chosen settings, and a
// verdict per control saved to the artifact's database.
import { createRoot } from "react-dom/client";
import { Fragment, useEffect, useMemo, useState } from "react";
import { SETTING_GROUPS } from "@area/tokens/config";
import { Alert, Badge, Button, Card, CardDescription, CardHeader, CardTitle, Checkbox, Input, Segmented, Slider, Switch, Tabs } from "@area/react";
import { ROW_OF, SettingRow } from "../../../../apps/desktop/src/inspector-rows.tsx";
import { GALLERY_CONTROLS, type GalleryControl } from "../../../../apps/desktop/src/gallery/controls.ts";

type Values = Record<string, string>;
type Verdict = { verdict: "" | "good" | "change"; note: string };

/** What each setting was called and how it was picked before 2026-10-24. */
const BEFORE: Record<string, [string, string]> = {
  theme: ["Mode", "Light · Dark"], neutral: ["Neutral", "Dropdown: Neutral, Cool, Warm"], "tint-hue": ["Tint hue", "Dropdown: Auto, Accent, 0° … 355°"],
  "tint-light": ["Light tint", "Dropdown: Auto, 0 (None) … 16"], "tint-dark": ["Dark tint", "Dropdown: Auto, 0 (None) … 16"], "ink-tint": ["Text tint", "Dropdown: 0 (None) … 4 (Full)"],
  accent: ["Accent", "Dropdown of 83 swatches: 11 names and 72 hues"], "accent-strength": ["Accent strength", "Dropdown: 100 (Full) … 30 (Dusty)"],
  "solid-light": ["Light solid", "Dropdown: Auto, 400 … 850"], "solid-dark": ["Dark solid", "Dropdown: Auto, 400 … 850"], "label-tint": ["Label tint", "Dropdown: 0 (None) … 4 (Full)"],
  "status-colours": ["Status colours", "Fixed · Match"], action: ["Action", "Neutral · Accent"], selection: ["Selection", "Neutral · Accent"],
  "ground-light": ["Light ground", "Dropdown: 100 (White) … 90"], "ground-dark": ["Dark ground", "Dropdown: 0 (Black), 8, 12 … 24"],
  "layers-light": ["Light layers", "Dropdown: 0 (Flat), 2, 4, 6, 8"], "layers-dark": ["Dark layers", "Dropdown: 0 (Flat), 2, 4, 6, 8"],
  "card-tone-light": ["Light card tone", "Dropdown: Auto, −4 … +4"], "card-tone-dark": ["Dark card tone", "Dropdown: Auto, −4 … +4"],
  contrast: ["Contrast", "Dropdown: System, 0 (Standard) … 8 (More)"], type: ["Type size", "12 · 13 · 14 · 15 · 16"],
  density: ["Density", "Dropdown: 28 (Compact), 32, 36 (Comfortable)"], radius: ["Radius", "Dropdown: 0 (Sharp) … 14, Pill"], pills: ["Pills", "Multi-select"],
  surface: ["Stroke width", "Dropdown: 0 (Flat) … 2"], stroke: ["Stroke strength", "Dropdown: 0 (None) … 8 in halves"], "shadow-rest": ["Rest shadow", "Dropdown: 0 (None) … 8"],
  elevation: ["Floating shadow", "Dropdown: 0 (Flat) … 8"], "shadow-resting": ["Resting shadow", "Dropdown: 0 … 8"], "shadow-hover": ["Hover shadow", "Dropdown: 0 … 8"],
  "shadow-field": ["Field shadow", "Dropdown: 0 … 8"], "shadow-size": ["Shadow size", "Dropdown: 0 … 8"], "shadow-softness": ["Shadow softness", "Dropdown: 0 (Crisp) … 8 (Smooth)"],
  "shadow-light": ["Shadow light", "Dropdown: 0 (Flat) … 4"], "shadow-color": ["Shadow colour", "Dropdown: Black, Warm, Cool"], "focus-ring": ["Focus ring", "Dropdown: Hug, Gap, Halo, Inset, Bold"],
  "stroke-hover": ["Hover stroke", "Dropdown: 0 (None) … 4"], "selected-stroke": ["Selected stroke", "Dropdown: 1, 2, 3"], "selected-tint": ["Selected tint", "Dropdown: None, Tint, Neutral"],
  "fill-hover": ["Hover fill", "Dropdown: 1 … 4"], "fill-selected": ["Selected fill", "Dropdown: 0 (Same as hover) … 4"], "fill-pressed": ["Pressed fill", "Dropdown: 1 … 4"],
  "danger-hover": ["Danger hover", "Dropdown: Tint, Neutral"], motion: ["Motion", "Dropdown: 0 (None) … 300 in 30s"], easing: ["Easing", "Dropdown: Standard, Snappy, Gentle, Spring"],
};
const MODE_OF = (axis: string) => /-(light|dark)$/.exec(axis)?.[1] as "light" | "dark" | undefined;
const controlOf = (axis: string) => GALLERY_CONTROLS.find(entry => entry.axis === axis)!;
const say = (control: GalleryControl, value: string) => control.items.find(item => item.value === value)?.label ?? value;

/** Every value a control offers; a long scale as its ends and its count of steps. */
function valuesOf(control: GalleryControl): string {
  if (control.axis === "accent") return "Red, Orange, Yellow, Lime, Green, Teal, Cyan, Blue, Indigo, Purple, Pink · Custom: any hue by name, in 5° steps";
  if (!control.scale) return control.items.map(item => item.label).join(" · ");
  const named = (control.named ?? []).map(item => item.label);
  const steps = control.scale.map(step => say(control, step));
  const scale = steps.length > 12 ? `${steps[0]} … ${steps[steps.length - 1]} (${steps.length} steps)` : steps.join(" · ");
  return [...named, scale].join(" · ");
}

/** Real components under the chosen settings, so a drag shows what it changes. */
function Preview({ values, mode }: { values: Values; mode: "light" | "dark" }) {
  const attrs = Object.fromEntries(Object.entries(values).filter(([axis, value]) => axis !== "theme" && !(axis === "contrast" && value === "system")).map(([axis, value]) => [`data-area-${axis}`, value]));
  return (
    <div className="preview" data-area-theme={mode} {...attrs}>
      <div className="preview-row">
        <Button variant="solid">Action</Button>
        <Button variant="outline">Secondary</Button>
        <Button variant="ghost">Cancel</Button>
      </div>
      <Card>
        <CardHeader><CardTitle>Title</CardTitle><CardDescription>Description</CardDescription></CardHeader>
        <div className="preview-card-body">
          <Input aria-label="Label" placeholder="Placeholder" />
          <div className="preview-row"><Switch defaultChecked aria-label="Label" /><Checkbox defaultChecked label="Label" /><Checkbox label="Label" /></div>
        </div>
      </Card>
      <Tabs items={[{ id: "one", label: "One" }, { id: "two", label: "Two" }, { id: "three", label: "Three" }]} defaultValue="one" />
      <Segmented items={[{ value: "one", label: "One" }, { value: "two", label: "Two" }, { value: "three", label: "Three" }]} defaultValue="two" />
      <div className="preview-row">
        <Badge>Badge</Badge><Badge tone="info">Badge</Badge><Badge tone="success">Badge</Badge><Badge tone="warning">Badge</Badge><Badge tone="danger">Badge</Badge>
      </div>
      <Alert tone="info" title="Title">Body text</Alert>
      <Slider aria-label="Label" defaultValue={60} readout={value => `${value}%`} />
    </div>
  );
}

function App() {
  const defaults = useMemo(() => Object.fromEntries(GALLERY_CONTROLS.map(control => [control.axis, control.defaultValue])) as Values, []);
  const [values, setValues] = useState<Values>(defaults);
  const viewerDark = () => document.documentElement.dataset.theme ? document.documentElement.dataset.theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
  const [mode, setMode] = useState<"light" | "dark">(viewerDark() ? "dark" : "light");
  const [verdicts, setVerdicts] = useState<Record<string, Verdict>>({});
  // Round 1 (2026-10-24, collection `controls`) stays readable beside this round's marks (`round2`).
  const [earlier, setEarlier] = useState<Record<string, Verdict>>({});
  const [db, setDb] = useState<any>(null);
  useEffect(() => { document.documentElement.setAttribute("data-area-theme", mode); document.documentElement.style.colorScheme = mode; }, [mode]);
  useEffect(() => {
    let off: (() => void) | undefined;
    (async () => {
      const store = await (window as any).claude?.use?.("db").catch(() => null);
      if (!store) return;
      setDb(store);
      store.collection("controls").get().then((snap: any) => {
        const prior: Record<string, Verdict> = {};
        for (const doc of snap.docs) { const data = doc.data() ?? {}; prior[doc.id] = { verdict: data.verdict ?? "", note: data.note ?? "" }; }
        setEarlier(prior);
      }).catch(() => {});
      off = store.collection("round2").onSnapshot((snap: any) => {
        const next: Record<string, Verdict> = {};
        for (const doc of snap.docs) { const data = doc.data() ?? {}; next[doc.id] = { verdict: data.verdict ?? "", note: data.note ?? "" }; }
        setVerdicts(next);
      }, () => {});
    })();
    return () => off?.();
  }, []);
  const save = (axis: string, verdict: Verdict) => {
    setVerdicts(current => ({ ...current, [axis]: verdict }));
    db?.collection("round2").doc(axis).set({ ...verdict, at: new Date().toISOString() }).catch(() => {});
  };
  const set = (axis: string) => (value: string) => {
    // A light/dark pair previews in its own mode.
    const own = MODE_OF(axis); if (own && own !== mode) setMode(own);
    setValues(current => ({ ...current, [axis]: value }));
  };
  // Greys stands for four settings (Neutral, Tint hue, Light and Dark tint).
  const total = GALLERY_CONTROLS.length - 3, decided = Object.values(verdicts).filter(v => v.verdict).length;
  const changes = Object.values(verdicts).filter(v => v.verdict === "change").length;
  return (
    <div className="page">
      <header className="masthead">
        <span className="eyebrow">Area · Inspector › Theme · 2026-10-24</span>
        <h1>Theme controls</h1>
        <p className="lede">Round 2: each setting's control chosen for what it sets. A bar where there is a range worth dragging, a toggle for two or three short names, a dropdown for longer lists and colours. Greys and Accent are now one row each, a setting that does nothing under the others is dimmed and says why, and each card says what it sets. These are Area's real components; drag any of them and the preview follows.</p>
        <div className="masthead-row">
          <Segmented size="sm" aria-label="Mode" items={[{ value: "light", label: "Light" }, { value: "dark", label: "Dark" }]} value={mode} onValueChange={next => setMode(next as "light" | "dark")} />
          <Button size="sm" variant="ghost" onClick={() => setValues(defaults)}>Reset all</Button>
          <span className="tally"><b>{decided}</b> of {total} marked{changes ? <> · <b>{changes}</b> to change</> : null}{db ? null : " · sign in with edit access to mark"}</span>
        </div>
      </header>
      <div className="layout">
        <main className="groups">
          {SETTING_GROUPS.map(group => {
            const axes = group.settings.filter(axis => GALLERY_CONTROLS.some(control => control.axis === axis));
            return axes.length ? (
              <section key={group.heading} className="group">
                <h2>{group.heading}</h2>
                <div className="cards">
                  {axes.filter(axis => !ROW_OF[axis] || axis === "neutral").map(axis => {
                    const combined = ROW_OF[axis] === "greys";
                    const control = controlOf(axis), own = combined ? undefined : MODE_OF(axis), verdict = verdicts[combined ? "greys" : axis] ?? { verdict: "", note: "" };
                    const [was, how] = combined ? ["Neutral, Tint hue, Light tint, Dark tint", "Four dropdowns: Neutral · Cool · Warm; Auto, Accent, 0° … 355°; Auto, 0 … 16 per mode"] : BEFORE[axis] ?? [axis, ""];
                    const key = combined ? "greys" : axis;
                    return (
                      <article key={key} className="control-card" data-verdict={verdict.verdict || undefined}>
                        <div className="card-head">
                          <h3>{combined ? "Greys" : control.label}{own ? <span className="mode">{own}</span> : null}</h3>
                          <code>{combined ? "neutral · tint-*" : axis}</code>
                        </div>
                        <div className="well" data-area-theme={own ?? mode}>
                          <div className="stack"><SettingRow axis={axis} context={{ values, mode: own ?? mode, set: changes => { for (const [name, value] of Object.entries(changes)) set(name)(value); } }} /></div>
                        </div>
                        <dl>
                          <dt>Sets</dt><dd>{combined ? "How cool or warm every grey is, or a colour they lean toward and how much" : control.hint ?? "—"}</dd>
                          <dt>Values</dt><dd>{combined ? "Temperature Cool 100% … Neutral … Warm 100% · Tint colour None, Accent, Red … Pink, Custom hue · Amount 0–100%" : valuesOf(control)}</dd>
                          <dt>Default</dt><dd>{combined ? "Neutral, no tint" : say(control, control.defaultValue)}</dd>
                          <dt>Before</dt><dd>{was}: {how}</dd>
                          {(combined ? ["neutral", "tint-hue", "tint-light", "tint-dark"] : [axis]).map(id => earlier[id]?.verdict === "change" ? (
                            <Fragment key={id}><dt>Round 1</dt><dd>Change it{earlier[id]!.note ? `: “${earlier[id]!.note}”` : ""}</dd></Fragment>
                          ) : null)}
                        </dl>
                        {db ? (
                          <div className="verdict">
                            <Segmented size="sm" aria-label={`Verdict on ${control.label}`} items={[{ value: "good", label: "Looks right" }, { value: "change", label: "Change it" }]}
                              value={verdict.verdict || undefined} onValueChange={next => save(key, { ...verdict, verdict: next as Verdict["verdict"] })} />
                            {verdict.verdict === "change" || verdict.note ? (
                              <textarea id={`note-${key}`} aria-label={`What to change on ${control.label}`} placeholder="What should change?" defaultValue={verdict.note}
                                onBlur={event => event.currentTarget.value !== verdict.note && save(key, { ...verdict, note: event.currentTarget.value })} />
                            ) : null}
                          </div>
                        ) : verdict.verdict ? <p className="note">{verdict.verdict === "good" ? "Marked: looks right" : `To change: ${verdict.note}`}</p> : null}
                      </article>
                    );
                  })}
                </div>
              </section>
            ) : null;
          })}
        </main>
        <aside className="preview-pane">
          <span className="eyebrow">Preview · {mode}</span>
          <Preview values={values} mode={mode} />
        </aside>
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
