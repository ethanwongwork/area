/**
 * Direct editing review page (2026-11-08). Owner: "fully editable vector figma code canvas (everything except an infinite
 * canvas, each design is isolated to its own container only)". The page runs the slice that was built: the app's own design
 * viewer, its stage editor (src/design-select.tsx), its document (src/design-doc.ts) and renderer (design-render.tsx), on
 * a small sample design made of Area's components, with an editor kept in the page (no project). The decisions under it
 * save to the page's store (`verdicts`). Built by build.mjs against a tree; nothing in apps/ changes for it.
 */
import { createRoot } from "react-dom/client";
import { useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Badge, Button, CodeBlock, Count, Radio, RadioGroup, Segmented, Textarea } from "@area/react";
import { highlight } from "@src/content/highlight.mjs";
import { useDesignViewer } from "@src/design-viewer.tsx";
import { StageSelection } from "@src/design-select.tsx";
import { DocNodes } from "@src/design-render.tsx";
import { apply, subjectOf, toJsx, type DesignDoc, type DocOp } from "@src/design-doc.ts";
import type { DesignEditor, ChangeWords } from "@src/design-editor.tsx";

type Mode = "light" | "dark";

/* --- The sample design: a settings card on a page, every part a document node -------------------------------------- */
const s = (token: string) => `var(--area-${token})`;
const SAMPLE: DesignDoc = {
  version: 1, next: 40,
  root: [{
    id: "n1", kind: "element", tag: "div", className: "dex-sample", style: { display: "flex", "flex-direction": "column", gap: s("space-24"), padding: s("space-32"), "min-block-size": "560px", "box-sizing": "border-box", background: s("bg-page"), color: s("fg-default") },
    children: [
      { id: "n2", kind: "element", tag: "div", className: "dex-sample__head", style: { display: "flex", "align-items": "center", "justify-content": "space-between", gap: s("space-12") }, children: [
        { id: "n3", kind: "element", tag: "h2", style: { margin: "0", "font-size": s("title-md-size"), "line-height": s("title-md-leading"), "font-weight": s("weight-strong") }, children: [{ id: "n4", kind: "text", text: "Notifications" }] },
        { id: "n5", kind: "element", tag: "div", className: "dex-sample__actions", style: { display: "flex", gap: s("space-8") }, children: [
          { id: "n6", kind: "component", component: "Button", props: { variant: "soft", tone: "neutral" }, text: "Cancel" },
          { id: "n7", kind: "component", component: "Button", props: {}, text: "Save changes" },
        ] },
      ] },
      { id: "n8", kind: "element", tag: "p", style: { margin: "0", color: s("fg-muted"), "font-size": s("text-base-size"), "line-height": s("text-base-leading") }, children: [{ id: "n9", kind: "text", text: "Choose what reaches David Tee, and where." }] },
      { id: "n10", kind: "element", tag: "div", className: "dex-sample__card", style: { display: "flex", "flex-direction": "column", gap: s("space-16"), padding: s("space-20"), "border-radius": s("radius-container"), background: s("bg-subtle"), position: "relative" }, children: [
        { id: "n11", kind: "element", tag: "div", className: "dex-sample__row", style: { display: "flex", "align-items": "center", gap: s("space-8") }, children: [
          { id: "n12", kind: "element", tag: "p", style: { margin: "0", "font-weight": s("weight-strong") }, children: [{ id: "n13", kind: "text", text: "Weekly growth" }] },
          { id: "n14", kind: "component", component: "Badge", props: { tone: "success" }, text: "Complete" },
        ] },
        { id: "n15", kind: "component", component: "Switch", props: { label: "Email me updates", defaultChecked: true } },
        { id: "n16", kind: "component", component: "Checkbox", props: { label: "Include the team" } },
        { id: "n17", kind: "component", component: "Input", props: { placeholder: "Search", "aria-label": "Search" } },
        { id: "n18", kind: "shape", shape: "ellipse", style: { position: "absolute", left: "300px", top: "18px", width: "48px", height: "48px", background: s("accent-surface") } },
      ] },
    ],
  }],
};

/* --- An editor kept in the page: the same operations and undo the app's has, its log a list ------------------------ */
interface Logged extends ChangeWords { id: number; node: string; undo: DocOp }
function usePageEditor(): DesignEditor & { log: Logged[]; undoOne: (id: number) => void; reset: () => void } {
  const [doc, setDoc] = useState<DesignDoc>(SAMPLE);
  const [log, setLog] = useState<Logged[]>([]);
  const stack = useRef<{ undo: Array<{ before: DesignDoc; after: DesignDoc; log: [Logged[], Logged[]] }>; redo: typeof stack.current.undo }>({ undo: [], redo: [] });
  const latest = useRef({ doc, log });
  latest.current = { doc, log };
  const [, bump] = useState(0);
  const set = (next: DesignDoc, nextLog: Logged[]) => { latest.current = { doc: next, log: nextLog }; setDoc(next); setLog(nextLog); bump(n => n + 1); };
  const commit = (op: DocOp, words: ChangeWords) => {
    const { doc: was, log: wasLog } = latest.current;
    const done = apply(was, op);
    const node = subjectOf(op);
    if (!done || !node) return null;
    const nextLog = [{ ...words, id: (wasLog[0]?.id ?? 0) + 1, node, undo: done.undo }, ...wasLog];
    stack.current.undo.push({ before: was, after: done.doc, log: [wasLog, nextLog] });
    stack.current.redo = [];
    set(done.doc, nextLog);
    return done.doc;
  };
  const step = (from: "undo" | "redo") => {
    const taken = stack.current[from].pop();
    if (!taken) return;
    stack.current[from === "undo" ? "redo" : "undo"].push(taken);
    set(from === "undo" ? taken.before : taken.after, from === "undo" ? taken.log[0] : taken.log[1]);
  };
  return {
    doc, own: true, commit, capture: null, log,
    undo: () => step("undo"), redo: () => step("redo"),
    canUndo: stack.current.undo.length > 0, canRedo: stack.current.redo.length > 0,
    undoOne: id => { const entry = latest.current.log.find(e => e.id === id); const done = entry && apply(latest.current.doc, entry.undo); if (done) set(done.doc, latest.current.log.filter(e => e.id !== id)); },
    reset: () => { stack.current = { undo: [], redo: [] }; set(SAMPLE, []); },
  };
}

/* --- The stage ---------------------------------------------------------------------------------------------------- */
function Editor({ pageMode }: { pageMode: Mode }) {
  const editor = usePageEditor();
  const [selected, setSelected] = useState<number[] | null>(null);
  const [tab, setTab] = useState<"log" | "code">("log");
  const stage = useRef<HTMLDivElement>(null);
  const viewer = useDesignViewer({
    design: "sample", label: "Notifications", width: 720, appMode: pageMode, frame: "window", max: 32, active: true,
    render: (mode: Mode) => <div className="studio-viewer__design" data-area-theme={mode}><DocNodes nodes={editor.doc!.root} /></div>,
  });
  const said = (e: Logged) => e.property === "insert" ? `${e.name}: ${e.to}` : e.property === "remove" ? `${e.name}: was ${e.from}` : `${e.name}: ${e.from || "none"} → ${e.to}`;
  const code = useMemo(() => toJsx(editor.doc!, { name: "Notifications" }), [editor.doc]);
  return (
    <div className="dex-editor">
      <div className="dex-editor__bar">
        <div className="dex-editor__lead">{viewer.lead}</div>
        <div className="dex-editor__end">{viewer.controls}</div>
      </div>
      <div className="dex-editor__body">
        <div ref={stage} className="studio-design__stage dex-editor__stage" data-editing="">
          {viewer.stage}
          <StageSelection stage={stage} enabled selected={selected} onSelect={setSelected} editor={editor} />
        </div>
        <aside className="dex-editor__side" aria-label="Changes and code">
          <div className="dex-editor__tabs">
            <Segmented aria-label="Show" size="sm" value={tab} onValueChange={v => setTab(v as "log" | "code")}
              items={[{ value: "log", label: "Changes" }, { value: "code", label: "Code" }]} />
            {editor.log.length ? <Count size="sm" variant="soft" count={editor.log.length} /> : null}
            <Button size="sm" variant="ghost" tone="neutral" className="dex-editor__reset" onClick={() => { editor.reset(); setSelected(null); }}>Start again</Button>
          </div>
          {tab === "log" ? (
            editor.log.length ? (
              <ol className="dex-log">
                {editor.log.map(entry => (
                  <li key={entry.id}>
                    <span><strong>{entry.target}{entry.label ? ` “${entry.label}”` : ""}</strong><span>{said(entry)}</span></span>
                    <Button size="sm" variant="ghost" tone="neutral" onClick={() => editor.undoOne(entry.id)} aria-label={`Undo ${entry.name} on ${entry.target}`}>Undo</Button>
                  </li>
                ))}
              </ol>
            ) : <p className="dex-muted">Every edit lands here, each undoable on its own, as the Design view's log in the app.</p>
          ) : <CodeBlock className="dex-code" size="sm" variant="soft" title="Notifications.tsx" language="tsx" html={highlight(code)} lineNumbers={false} />}
        </aside>
      </div>
    </div>
  );
}

/* --- Decisions ---------------------------------------------------------------------------------------------------- */
interface Question { id: string; title: string; about: string; options: Array<{ value: string; label: string; about: string; rec?: boolean }> }
const QUESTIONS: Question[] = [
  { id: "model", title: "What a design is", about: "Where a layer's design lives once it can be edited directly.", options: [
    { value: "doc", label: "Its own document", about: "A tree of the system's components, frames, words and shapes with ids that never change; the stage draws it with the real components, and its code is written from it. Every editor that edits reliably works this way.", rec: true },
    { value: "code", label: "The screen's code", about: "Edits written into the screen's file through its syntax. One source, but the screen belongs to the system, and lists and conditions can't be edited." },
    { value: "overrides", label: "Overrides only", about: "Today's: changes drawn over the code and sent to Chat. No insert, move, resize or drawing." },
  ] },
  { id: "migrate", title: "When a screen becomes a design", about: "A screen layer is drawn from the system's screen until then.", options: [
    { value: "first-edit", label: "On its first edit", about: "Read from the screen as drawn, its components kept with their props; nothing to press first.", rec: true },
    { value: "explicit", label: "With “Edit as a design”", about: "A deliberate step that says the layer stops following the system's screen." },
    { value: "on-add", label: "When it is added", about: "Every new layer is a design from the start." },
  ] },
  { id: "click", title: "What a click chooses", about: "Inside nested frames.", options: [
    { value: "deepest", label: "The deepest thing", about: "A component, a shape, a run of words, else the frame round it; ⇧Enter climbs to the parent.", rec: true },
    { value: "outermost", label: "The outermost first", about: "A double-click goes one level deeper each time, ⌘-click goes straight to the deepest." },
  ] },
  { id: "shapes", title: "Where a drawn shape goes", about: "A rectangle or an ellipse drawn on a frame.", options: [
    { value: "placed", label: "Placed in its frame", about: "Where you draw it is where it stays; the frame's layout isn't pushed around.", rec: true },
    { value: "flow", label: "In the frame's flow", about: "It takes a place among the frame's children and moves them." },
  ] },
  { id: "insert", title: "Insert", about: "How the system's components reach a design.", options: [
    { value: "menu", label: "A menu in the stage's bar", about: "⇧I or Insert; a click places it into the chosen frame, else after the chosen thing.", rec: true },
    { value: "panel", label: "A searchable panel", about: "Every family from the catalogue in the Sidebar, with drag to place." },
    { value: "both", label: "Both", about: "The menu for speed, the panel for the whole catalogue and drag." },
  ] },
  { id: "guides", title: "Guides and the drop line", about: "Snapping lines and where a move lands.", options: [
    { value: "selection", label: "The selection blue", about: "One colour for everything the stage draws: #0d99ff light, #0c8ce9 dark.", rec: true },
    { value: "red", label: "A measuring red", about: "Apart from the selection, as the measured editors draw them." },
  ] },
  { id: "drag", title: "When a press becomes a drag", about: "How far the pointer travels first.", options: [
    { value: "4", label: "4 pixels", about: "Immediate on small controls.", rec: true },
    { value: "10", label: "10 pixels", about: "Harder to move something by accident; most measured editors." },
  ] },
  { id: "runs", title: "Iterations while editing", about: "The automatic gallery of iterations.", options: [
    { value: "runs", label: "One per run of edits", about: "Edits to one design within a minute of each other are one iteration; every edit stays in the log and the undo.", rec: true },
    { value: "every", label: "One per edit", about: "Every nudge is an iteration of its own." },
  ] },
  { id: "next", title: "What to build next", about: "Layout controls are built (Hug, Fill and Fixed, padding and gap bars, snapping to siblings). Then:", options: [
    { value: "layers", label: "The design's layers", about: "Its tree in the Sidebar under the page's list, to choose, rename, hide and reorder: the way to reach what the stage can't click.", rec: true },
    { value: "vector", label: "The pen and booleans", about: "Vector paths with handles, union, subtract, intersect and exclude." },
    { value: "multi", label: "Several at once", about: "⇧-click and marquee, align and distribute, group into a frame." },
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
  const rec = (q: Question) => q.options.find(o => o.rec)?.value ?? "";
  return (
    <div className="dex-decisions">
      <p className="dex-store" data-state={state}>
        {state === "live" ? "Your picks save as you choose them. The recommended answer is chosen until you pick another." : state === "waiting" ? "Connecting to the page's store…" : "Picks can't be saved in this view; they stay until you reload."}
      </p>
      {QUESTIONS.map((q, i) => (
        <div key={q.id} className="dex-q">
          <div className="dex-q__head">
            <span className="dex-q__n">Q{i + 1}</span>
            <div><h3>{q.title}</h3><p>{q.about}</p></div>
          </div>
          <RadioGroup label={q.title} className="dex-q__group" value={verdicts[q.id]?.pick ?? rec(q)} onValueChange={v => save(q.id, { pick: v })} name={`q-${q.id}`}>
            {q.options.map(o => (
              <Radio key={o.value} value={o.value} id={`q-${q.id}-${o.value}`} variant="card"
                label={<>{o.label}{o.rec ? <Badge size="sm" tone="info" className="dex-rec">Recommended</Badge> : null}</>} description={o.about} />
            ))}
          </RadioGroup>
          <Textarea id={`note-${q.id}`} aria-label={`Note on ${q.title}`} placeholder="Note (optional)" rows={2}
            value={notes[q.id] ?? verdicts[q.id]?.note ?? ""} onChange={e => setNotes(n => ({ ...n, [q.id]: e.currentTarget.value }))}
            onBlur={() => { const note = notes[q.id]; if (note !== undefined && note !== (verdicts[q.id]?.note ?? "")) save(q.id, { note }); }} />
        </div>
      ))}
    </div>
  );
}

/* --- The page ------------------------------------------------------------------------------------------------------ */
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
  useLayoutEffect(() => { document.documentElement.setAttribute("data-area-theme", mode); }, [mode]);
  return mode;
}

function Section({ id, title, lede, children, wide }: { id: string; title: string; lede: string; children: ReactNode; wide?: boolean }) {
  return (
    <section id={id} className="dex-section" data-wide={wide ? "" : undefined} aria-labelledby={`${id}-title`}>
      <header className="dex-section__head"><h2 id={`${id}-title`}>{title}</h2><p>{lede}</p></header>
      {children}
    </section>
  );
}

const KEYS: Array<[string, string]> = [
  ["Click", "Choose the deepest thing under the pointer"], ["Drag", "Move: reorder in a frame's flow, or place a shape (snaps to its frame and siblings)"],
  ["Handles", "Resize to a fixed size (⇧ keeps proportions); double-click a side's to hug"], ["Double-click", "Edit words in place (Enter or Esc keeps them)"],
  ["Space bars", "Drag a frame's padding or gap to the next space step (⇧ every side, ⌥ both opposite sides)"],
  ["V F R O T", "Choose, frame, rectangle, ellipse, text"], ["⇧I", "Insert from the system"], ["⌫  ⌘D", "Remove, duplicate"],
  ["Arrows", "Reorder in a flow; nudge a shape 1, ⇧ 10"], ["Enter  ⇧Enter  Tab", "First child, parent, next sibling"], ["⌘Z  ⇧⌘Z", "Undo, redo"],
];

function App() {
  const pageMode = usePageMode();
  return (
    <div className="dex-page">
      <header className="dex-top">
        <p className="dex-eyebrow">Area, proposal for review, 2026-11-08</p>
        <h1>Direct Editing</h1>
        <p className="dex-lede">Every design in its own container, editable directly and still Area code underneath. This is the slice that was built, running here on a small design: choose, drag, resize, type, draw and insert, then read its log and its code.</p>
      </header>
      <Section id="try" title="Try it" lede="The app's stage, tools and document. Every change is an operation on the design, logged and undoable on its own; the design is the system's real components." wide>
        <Editor pageMode={pageMode} />
        <dl className="dex-keys">{KEYS.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
      </Section>
      <Section id="how" title="How it works" lede="What the recommendation is, in four parts.">
        <div className="dex-how">
          <div><h3>A design of its own</h3><p>A screen layer becomes a document on its first edit: read from the screen as drawn, every system component kept as that component with its props, the rest as markup with the system's classes and tokens. The analytics screen read back node for node, 775 of 775.</p></div>
          <div><h3>Edits as operations</h3><p>Change a node, add one, remove one, move one. Each returns the operation that undoes it, so any change in the log undoes on its own, the stage's undo steps back in order, and Chat still gets the batch to write into the screen's code.</p></div>
          <div><h3>Measured handles</h3><p>Eight handles drawn 8 and hit 16, a drag from 4, snapping within 8, nudge 1 and 10, 100 × 100 for a click with a shape tool: the medians of five measured editors, constant at every zoom.</p></div>
          <div><h3>One container</h3><p>The design is its own bounded canvas: tools work only inside it, every drop lands in one of its frames, and nothing exists past its edges.</p></div>
        </div>
      </Section>
      <Section id="decisions" title="Decisions" lede="Nine choices. The recommended answers were taken (2026-11-08) and are what was built; what to build next is open again.">
        <Decisions />
      </Section>
      <footer className="dex-foot">Source: docs/research/design-editing-2026-11-08 (README.md, entry.tsx, build.mjs).</footer>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
