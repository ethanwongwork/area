/**
 * User Flows review page (2026-11-08). Owner, reviewing Area's scope: "designs for how to show longer flows and complete
 * user flows with multiple pages". Each design stays alone in its own container (PRODUCT_UI rule 25), so the flow itself
 * is the one design: steps laid out by rule, never placed freely.
 *
 * Every screen, card, list and panel here is Area's real React, in Area's CSS. The screens use the placeholder vocabulary
 * (Title, Description, Label, Placeholder) and David Tee; step names are the flow's own words, as a project names them.
 * Built by build.mjs against a tree; nothing in apps/ changed. Research and ranking: README.md beside this file.
 */
import { createRoot } from "react-dom/client";
import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import {
  Alert, Avatar, Badge, Button, CustomSelect, DescriptionList, DescriptionListItem, DesignCard, EmptyState, Field, Input, OTPField,
  Radio, RadioGroup, Segmented, Separator, Spinner, Stepper, StepperStep, Tabs, Textarea, TreeView, type TreeViewNode,
} from "@area/react";
import {
  AppWindowIcon, ArrowLeftIcon, ArrowRightIcon, ChatIcon, CheckIcon, ChevronDownIcon, FlowIcon, GridIcon, HomeIcon, LayersIcon,
  LightbulbIcon, LinkIcon, MailIcon, PanelLeftIcon, PanelRightIcon, PlayIcon, RotateCcwIcon, SearchIcon, ShapesIcon, UndoIcon,
  WarningIcon,
} from "@area/icons";
import { DESKTOP } from "@skill/figures/screens.jsx";
import { GALLERY_CONTROLS } from "@src/gallery/controls.ts";

type Mode = "light" | "dark";

/* --- Scope: designs in Area's defaults, in the page's mode ------------------------------------------------------------ */

const DEFAULTS: Record<string, string> = Object.fromEntries(GALLERY_CONTROLS.filter(c => c.axis !== "theme").map(c => [c.axis, c.defaultValue]));
const scopeOf = (mode: Mode): Record<string, string> => {
  const out: Record<string, string> = { "data-area-theme": mode };
  for (const [axis, value] of Object.entries(DEFAULTS)) if (!(axis === "contrast" && value === "system")) out[`data-area-${axis}`] = value;
  return out;
};

/* --- The flow's screens: a 720 × 450 window each ---------------------------------------------------------------------- */

const SW = 720, SH = 450;
function Win({ children, wide }: { children: ReactNode; wide?: boolean }) {
  return (
    <div className="uf-win" style={{ inlineSize: SW, blockSize: SH }}>
      <div className="uf-win__bar" aria-hidden="true"><i /><i /><i /></div>
      <div className="uf-win__body"><div className="uf-form" data-wide={wide ? "" : undefined}>{children}</div></div>
    </div>
  );
}
const Head = ({ icon }: { icon?: ReactNode }) => (
  <div className="uf-form__head">
    {icon ? <span className="uf-form__mark">{icon}</span> : null}
    <h2>Title</h2>
    <p>Description of what happens next.</p>
  </div>
);
const Create = () => (
  <Win>
    <Head />
    <Field label="Label"><Input placeholder="Placeholder" /></Field>
    <Field label="Label"><Input type="password" defaultValue="placeholder" /></Field>
    <Button fullWidth data-link="verify">Continue</Button>
    <Separator />
    <Button fullWidth variant="outline" data-link="signin">Secondary</Button>
  </Win>
);
const Verify = ({ state }: { state?: "error" | "loading" }) => (
  <Win>
    <Head icon={<MailIcon size={20} />} />
    <Field label="Label" error={state === "error" ? "Error message" : undefined}>
      <OTPField length={6} defaultValue={state ? "428" + (state === "error" ? "913" : "106") : "42"} invalid={state === "error"} aria-label="Label" />
    </Field>
    <Button fullWidth loading={state === "loading"} data-link="profile">Continue</Button>
    <Button fullWidth variant="ghost" data-link="back">Back</Button>
  </Win>
);
const Profile = () => (
  <Win>
    <Head />
    <div className="uf-form__row"><Avatar size="lg" fallback="DT" aria-label="David Tee" /><Button size="sm" variant="outline">Secondary</Button></div>
    <Field label="Label"><Input defaultValue="David Tee" /></Field>
    <Field label="Label"><CustomSelect aria-label="Label" placeholder="Placeholder" items={[{ value: "one", label: "Option one" }]} fullWidth /></Field>
    <Button fullWidth data-link="plan">Continue</Button>
  </Win>
);
const Plan = () => (
  <Win wide>
    <Head />
    <RadioGroup label="Label" name="uf-plan" defaultValue="two" className="uf-plans">
      <Radio value="one" id="uf-plan-one" variant="card" label="Option one" description="Description" />
      <Radio value="two" id="uf-plan-two" variant="card" label="Option two" description="Description" />
      <Radio value="three" id="uf-plan-three" variant="card" label="Option three" description="Description" />
    </RadioGroup>
    <Button fullWidth data-link="done">Continue</Button>
  </Win>
);
const Done = () => (
  <Win>
    <EmptyState icon={<CheckIcon />} title="Title" description="Description of what happens next." actions={<Button>Continue</Button>} />
  </Win>
);
const SignIn = () => (
  <Win>
    <Head />
    <Field label="Label"><Input placeholder="Placeholder" /></Field>
    <Field label="Label"><Input type="password" defaultValue="placeholder" /></Field>
    <Button fullWidth data-link="done">Continue</Button>
  </Win>
);

/* --- The flow ---------------------------------------------------------------------------------------------------------- */

interface Step { id: string; name: string; note: string; Screen: () => ReactNode }
const MAIN: Step[] = [
  { id: "create", name: "Create account", note: "Email and password", Screen: Create },
  { id: "verify", name: "Verify email", note: "Sends a 6-digit code", Screen: () => <Verify /> },
  { id: "profile", name: "Profile", note: "Name and role", Screen: Profile },
  { id: "plan", name: "Choose a plan", note: "Can change later", Screen: Plan },
  { id: "done", name: "Done", note: "Opens Home", Screen: Done },
];
const BRANCH: Step = { id: "signin", name: "Sign in", note: "Has an account", Screen: SignIn };
const STATES: Step[] = [
  { id: "verify-error", name: "Error", note: "Wrong code", Screen: () => <Verify state="error" /> },
  { id: "verify-loading", name: "Loading", note: "Checking", Screen: () => <Verify state="loading" /> },
];

/* --- The map: steps as Design cards, laid out by rule ------------------------------------------------------------------
   Cards scale with the zoom; words (names, link labels) and the gaps between cards stay at screen size, so the map reads
   at any fit. Columns 64 apart (a link's label fits), rows 32. The path runs left to right; a branch sits in a row above
   the step it leaves; a step's states in a column under it, joined by a dashed line (the same step, changed). */

const CG = 64, RG = 32, CAP = 24, NOTE = 18, ARROW = 6;
interface MapOpts {
  cw: number;
  branch?: boolean;
  states?: boolean;
  notes?: boolean;
  labels?: boolean;
  selected?: string;
  hot?: string[];
  drag?: boolean;
  sticky?: boolean;
  numbered?: boolean;
}
function FlowMap({ cw, branch = true, states = true, notes = false, labels = true, selected, hot = [], drag = false, sticky = false, numbered = true }: MapOpts) {
  const ch = Math.round((cw * 9) / 16);
  const cap = CAP + (notes ? NOTE : 0);
  const slot = ch + cap;
  const x = (c: number) => c * (cw + CG);
  const rowY = (r: number) => (branch ? r + 1 : r) * (slot + RG);
  const y0 = rowY(0), yB = rowY(-1);
  const stateRows = states ? STATES.length : 0;
  const W = MAIN.length * cw + (MAIN.length - 1) * CG;
  const H = rowY(stateRows) + slot;
  const lines: Array<{ id: string; d: string; dashed?: boolean; arrow?: boolean; label?: string; lx?: number; ly?: number }> = [];
  MAIN.slice(0, -1).forEach((s, i) => {
    const yy = y0 + ch / 2;
    lines.push({ id: `${s.id}>${MAIN[i + 1]!.id}`, d: `M${x(i) + cw} ${yy}H${x(i + 1) - 2}`, arrow: true, label: "Continue", lx: x(i) + cw + CG / 2, ly: yy });
  });
  if (branch) {
    const by = yB + ch / 2;
    lines.push({ id: "create>signin", d: `M${x(0) + cw / 2} ${y0}V${by}H${x(1) - 2}`, arrow: true, label: "Secondary", lx: x(0) + cw / 2, ly: (by + y0) / 2 });
    lines.push({ id: "signin>done", d: `M${x(1) + cw} ${by}H${x(4) + cw / 2}V${y0 - 2}`, arrow: true, label: "Continue", lx: (x(1) + cw + x(4) + cw / 2) / 2, ly: by });
  }
  if (states) STATES.forEach((_, k) => lines.push({ id: `state-${k}`, d: `M${x(1) + cw / 2} ${rowY(k) + slot}V${rowY(k + 1)}`, dashed: true }));
  const card = (s: Step, c: number, r: number, n: string | null, detail?: string) => (
    <div key={s.id} className="uf-map__card" style={{ insetInlineStart: x(c), insetBlockStart: rowY(r), inlineSize: cw }}>
      <DesignCard layout="screen" designWidth={SW} designHeight={SH} selected={selected === s.id}
        name={<>{numbered && n ? <span className="uf-n">{n}</span> : null}{s.name}</>} detail={detail ?? null}>
        <s.Screen />
      </DesignCard>
      {notes ? <p className="uf-map__note">{s.note}</p> : null}
    </div>
  );
  return (
    <div className="uf-map" style={{ inlineSize: W, blockSize: H }}>
      <svg className="uf-map__lines" width={W} height={H} aria-hidden="true">
        {lines.map(l => (
          <g key={l.id} data-hot={hot.includes(l.id) ? "" : undefined}>
            <path d={l.d} fill="none" strokeDasharray={l.dashed ? "3 3" : undefined} />
            {l.arrow ? <ArrowHead d={l.d} /> : null}
          </g>
        ))}
        {drag ? (
          <g className="uf-map__drag">
            <path d={`M${x(0) + cw * 0.5} ${y0 + ch * 0.8}C${x(0) + cw * 0.5} ${y0 + slot + 60},${x(2) + cw * 0.5} ${y0 + slot + 60},${x(2) + cw * 0.5} ${y0 + ch + 2}`} fill="none" />
          </g>
        ) : null}
      </svg>
      {MAIN.map((s, i) => card(s, i, 0, String(i + 1), undefined))}
      {branch ? card(BRANCH, 1, -1, "1a") : null}
      {states ? STATES.map((s, k) => card({ ...s, name: `Verify email · ${s.name}` }, 1, k + 1, null)) : null}
      {labels ? lines.filter(l => l.label).map(l => (
        <span key={l.id} className="uf-map__label" style={{ insetInlineStart: l.lx, insetBlockStart: l.ly }}>
          <Badge size="sm" variant="outline">{l.label}</Badge>
        </span>
      )) : null}
      {sticky ? (
        <>
          <div className="uf-sticky" style={{ insetInlineStart: x(2) + cw * 0.4, insetBlockStart: y0 + ch * 0.55 }}>Body text for a note placed on the flow.</div>
          <div className="uf-sticky" style={{ insetInlineStart: x(3) + cw * 0.5, insetBlockStart: Math.max(0, yB + 8) }}>Body text.</div>
        </>
      ) : null}
    </div>
  );
}
/** The arrowhead at a path's end, pointing along its last segment (paths here end in an H or a V). */
function ArrowHead({ d }: { d: string }) {
  const m = d.match(/([HV])(-?[\d.]+)$/);
  const pts = [...d.matchAll(/([MHV])\s*(-?[\d.]+)(?:\s+(-?[\d.]+))?/g)];
  let cx = 0, cy = 0;
  for (const p of pts) { if (p[1] === "M") { cx = +p[2]!; cy = +p[3]!; } else if (p[1] === "H") cx = +p[2]!; else cy = +p[2]!; }
  const prev = (() => { let px = 0, py = 0; for (const p of pts.slice(0, -1)) { if (p[1] === "M") { px = +p[2]!; py = +p[3]!; } else if (p[1] === "H") px = +p[2]!; else py = +p[2]!; } return { px, py }; })();
  if (!m) return null;
  const a = ARROW;
  const ex = cx + (m[1] === "H" ? Math.sign(cx - prev.px) * 2 : 0), ey = cy + (m[1] === "V" ? Math.sign(cy - prev.py) * 2 : 0);
  const dir = m[1] === "H" ? (cx > prev.px ? "r" : "l") : (cy > prev.py ? "d" : "u");
  const tri = dir === "r" ? `M${ex} ${ey}L${ex - a} ${ey - a / 1.4}L${ex - a} ${ey + a / 1.4}Z` : dir === "l" ? `M${ex} ${ey}L${ex + a} ${ey - a / 1.4}L${ex + a} ${ey + a / 1.4}Z`
    : dir === "d" ? `M${ex} ${ey}L${ex - a / 1.4} ${ey - a}L${ex + a / 1.4} ${ey - a}Z` : `M${ex} ${ey}L${ex - a / 1.4} ${ey + a}L${ex + a / 1.4} ${ey + a}Z`;
  return <path className="uf-map__arrow" d={tri} />;
}

/** Fits a map to its box's width: the card width that makes five columns and four gaps fill it, between min and 320. */
function useWidth<T extends HTMLElement>(): [React.RefObject<T>, number] {
  const ref = useRef<T>(null);
  const [w, setW] = useState(0);
  useLayoutEffect(() => {
    const el = ref.current; if (!el) return;
    const read = () => setW(el.clientWidth);
    read();
    const ro = new ResizeObserver(read); ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, w];
}
const fitCard = (w: number, min = 112) => Math.max(min, Math.min(320, Math.floor((w - (MAIN.length - 1) * CG) / MAIN.length)));
function FittedMap(props: Omit<MapOpts, "cw"> & { min?: number }) {
  const [ref, w] = useWidth<HTMLDivElement>();
  return <div ref={ref} className="uf-fit">{w ? <FlowMap {...props} cw={fitCard(w, props.min)} /> : null}</div>;
}

/** A whole design at a fixed true size, drawn at the scale that fits its box's width (a whole screen, fitted: rule 26.2). */
function Scaled({ w, h, children, max = 1 }: { w: number; h: number; children: ReactNode; max?: number }) {
  const [ref, box] = useWidth<HTMLDivElement>();
  const s = box ? Math.min(max, box / w) : 0;
  return (
    <div ref={ref} className="uf-scaled" style={{ blockSize: Math.round(h * s) }}>
      {s ? <div className="uf-scaled__inner" style={{ inlineSize: w, blockSize: h, transform: `scale(${s})` }}>{children}</div> : null}
    </div>
  );
}

/* --- App parts: Sidebar, Canvas header, stage, design panel peek, Inspector --------------------------------------------- */

const num = (n: string, label: string) => `${n}  ${label}`;
const stepNodes = (withStates = true): TreeViewNode[] => [
  { id: "s-create", label: num("1", "Create account"), icon: <AppWindowIcon /> },
  { id: "s-signin", label: num("1a", "Sign in"), icon: <AppWindowIcon /> },
  { id: "s-verify", label: num("2", "Verify email"), icon: <AppWindowIcon />, ...(withStates ? { children: [
    { id: "s-verify-error", label: "Error", icon: <AppWindowIcon /> }, { id: "s-verify-loading", label: "Loading", icon: <AppWindowIcon /> },
  ] } : {}) },
  { id: "s-profile", label: num("3", "Profile"), icon: <AppWindowIcon /> },
  { id: "s-plan", label: num("4", "Choose a plan"), icon: <AppWindowIcon /> },
  { id: "s-done", label: num("5", "Done"), icon: <AppWindowIcon /> },
];
type Home = "page" | "section" | "system";
function SideNav({ home, current = "p-signup" }: { home: Home; current?: string }) {
  const items: TreeViewNode[] = home === "page" ? [
    { id: "overview", label: "Overview", icon: <HomeIcon /> },
    { id: "pages", label: "Pages", icon: <LayersIcon />, children: [
      { id: "p-signup", label: "Sign up", icon: <FlowIcon />, children: stepNodes() },
      { id: "p-checkout", label: "Checkout", icon: <FlowIcon /> },
      { id: "p-screens", label: "Screens", icon: <LayersIcon /> },
    ] },
    { id: "explorations", label: "Explorations", icon: <ShapesIcon /> },
    { id: "versions", label: "Versions", icon: <RotateCcwIcon /> },
  ] : home === "section" ? [
    { id: "overview", label: "Overview", icon: <HomeIcon /> },
    { id: "pages", label: "Pages", icon: <LayersIcon />, children: [{ id: "p-screens", label: "Screens", icon: <LayersIcon /> }, { id: "p-states", label: "States", icon: <LayersIcon /> }] },
    { id: "flows", label: "Flows", icon: <FlowIcon />, children: [
      { id: "p-signup", label: "Sign up", icon: <PlayIcon />, trailing: <span className="uf-trail">from Screens</span> },
      { id: "p-checkout", label: "Checkout", icon: <PlayIcon />, trailing: <span className="uf-trail">from Screens</span> },
    ] },
    { id: "explorations", label: "Explorations", icon: <ShapesIcon /> },
    { id: "versions", label: "Versions", icon: <RotateCcwIcon /> },
  ] : [
    { id: "foundations", label: "Foundations", icon: <GridIcon /> },
    { id: "components", label: "Components", icon: <ShapesIcon /> },
    { id: "patterns", label: "Patterns", icon: <LayersIcon />, children: [
      { id: "pt-screens", label: "Screens", icon: <AppWindowIcon />, trailing: <span className="uf-trail">14</span> },
      { id: "pt-flows", label: "Flows", icon: <FlowIcon />, children: [
        { id: "p-signup", label: "Sign up", icon: <FlowIcon /> }, { id: "p-checkout", label: "Checkout", icon: <FlowIcon /> },
        { id: "p-setting", label: "Change a setting", icon: <FlowIcon /> }, { id: "p-create", label: "Create something", icon: <FlowIcon /> },
      ] },
    ] },
    { id: "versions", label: "Versions", icon: <RotateCcwIcon /> },
  ];
  const open = home === "page" ? ["pages", "p-signup", "s-verify"] : home === "section" ? ["pages", "flows"] : ["patterns", "pt-flows"];
  return (
    <aside className="uf-side" aria-label="Sidebar">
      <div className="uf-side__head"><span className="uf-lights" aria-hidden="true"><i /><i /><i /></span><Button size="sm" variant="ghost" iconOnly aria-label="Sidebar" icon={<PanelLeftIcon />} /><Button size="sm" variant="ghost" iconOnly aria-label="Search" icon={<SearchIcon />} /></div>
      <p className="uf-side__name">{home === "system" ? "Area" : "Onboarding"}</p>
      <TreeView aria-label="Project" items={items} defaultExpandedIds={open} currentId={current} size="sm" />
    </aside>
  );
}
function CanvasHead({ path, end }: { path: ReactNode; end?: ReactNode }) {
  return <div className="uf-chead"><div className="uf-chead__start">{path}</div><div className="uf-chead__end">{end}</div></div>;
}
const Zoom = ({ label = "Fit" }: { label?: string }) => <Button size="sm" variant="ghost" trailingIcon={<ChevronDownIcon />}>{label}</Button>;
const StepControl = ({ text = "2 of 5" }: { text?: string }) => (
  <span className="uf-stepctl"><span className="uf-muted">{text}</span><Button size="sm" variant="ghost" iconOnly aria-label="Before" icon={<ArrowLeftIcon />} /><Button size="sm" variant="ghost" iconOnly aria-label="After" icon={<ArrowRightIcon />} /></span>
);
const PANEL_TABS = ["Iterations", "Layers", "Documentation", "Code", "Components & tokens", "Specs", "Comments", "Checks", "Research"];
const PanelPeek = ({ value = "iterations" }: { value?: string }) => (
  <div className="uf-peek"><Tabs size="sm" aria-label="Design panel" value={value} items={PANEL_TABS.map(t => ({ id: t.toLowerCase().split(" ")[0]!, label: t }))} /></div>
);
function InspectorPanel({ children, view = "design" }: { children: ReactNode; view?: string }) {
  return (
    <aside className="uf-insp" aria-label="Inspector">
      <div className="uf-insp__head">
        <Tabs size="sm" aria-label="Inspector views" value={view} items={[{ id: "design", label: "Design" }, { id: "code", label: "Code" }, { id: "chat", label: "Chat" }]} />
        <Button size="sm" variant="ghost" iconOnly aria-label="Inspector" icon={<PanelRightIcon />} />
      </div>
      <div className="uf-insp__body">{children}</div>
    </aside>
  );
}
const Group = ({ title, children }: { title: string; children: ReactNode }) => (
  <section className="uf-group"><h4>{title}</h4>{children}</section>
);
function FlowFacts() {
  return (
    <>
      <Group title="Sign up">
        <DescriptionList>
          <DescriptionListItem term="Steps">5</DescriptionListItem>
          <DescriptionListItem term="Branches">1</DescriptionListItem>
          <DescriptionListItem term="States">2</DescriptionListItem>
          <DescriptionListItem term="Links">8</DescriptionListItem>
        </DescriptionList>
      </Group>
      <Group title="Description">
        <Textarea id="uf-desc" aria-label="Description" rows={3} defaultValue="Body text describing who takes this flow and what they finish with." />
      </Group>
      <Group title="Checks"><FlowChecks /></Group>
    </>
  );
}
function FlowChecks() {
  return (
    <ul className="uf-checks">
      <li><WarningIcon className="uf-checks__warn" /><span><b>4 Choose a plan</b> has no error state</span></li>
      <li><WarningIcon className="uf-checks__warn" /><span><b>1a Sign in</b> has no way back</span></li>
      <li><CheckIcon className="uf-checks__ok" /><span>Every step reaches <b>5 Done</b></span></li>
      <li><CheckIcon className="uf-checks__ok" /><span>No step is unreachable</span></li>
    </ul>
  );
}

/** The project page at 1440 × 900: Sidebar, the Canvas (header, the flow on the stage, the design panel's tab row) and the
 *  Inspector's Design view with the flow's facts. */
function AppShell({ mode }: { mode: Mode }) {
  return (
    <div className="uf-app" {...scopeOf(mode)}>
      <SideNav home="page" />
      <main className="uf-canvas">
        <CanvasHead path={<span className="uf-path"><FlowIcon /> Sign up</span>}
          end={<><Button size="sm" variant="ghost" icon={<PlayIcon />}>Play</Button><Zoom label="Fit" /></>} />
        <div className="uf-stage uf-stage--map"><StageMap /></div>
        <PanelPeek />
      </main>
      <InspectorPanel><FlowFacts /></InspectorPanel>
    </div>
  );
}
function StageMap() {
  const [ref, w] = useWidth<HTMLDivElement>();
  return <div ref={ref} className="uf-stage__fit">{w ? <FlowMap cw={fitCard(w - 48, 96)} /> : null}</div>;
}

/** One screen on the stage, fitted. */
function OnStage({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`uf-onstage ${className}`}><Scaled w={SW} h={SH}>{children}</Scaled></div>;
}

/* --- Figures per question ------------------------------------------------------------------------------------------------ */

function Frame({ label, children, wide, mode, picked }: { label: string; children: ReactNode; wide?: boolean; mode: Mode; picked?: boolean }) {
  return (
    <figure className="uf-fig" data-wide={wide ? "" : undefined} data-picked={picked ? "" : undefined}>
      <div className="uf-fig__frame" {...scopeOf(mode)}>{children}</div>
      <figcaption>{label}</figcaption>
    </figure>
  );
}
function Strip({ cw = 220, states = false }: { cw?: number; states?: boolean }) {
  const steps = states ? [MAIN[0]!, MAIN[1]!, { ...STATES[0]!, name: "Verify email error" }, { ...STATES[1]!, name: "Verify email loading" }, ...MAIN.slice(2)] : MAIN;
  return (
    <div className="uf-strip" role="list">
      {steps.map((s, i) => (
        <div key={s.id} className="uf-strip__item" role="listitem">
          {i ? <ArrowRightIcon className="uf-strip__arrow" /> : null}
          <DesignCard layout="screen" designWidth={SW} designHeight={SH} style={{ inlineSize: cw }} name={<><span className="uf-n">{i + 1}</span>{s.name}</>} detail={null}><s.Screen /></DesignCard>
        </div>
      ))}
    </div>
  );
}
function NumberedGrid() {
  const all = [...MAIN.slice(0, 1), BRANCH, MAIN[1]!, { ...STATES[0]!, name: "Verify email · Error" }, { ...STATES[1]!, name: "Verify email · Loading" }, ...MAIN.slice(2)];
  return (
    <div className="uf-grid">
      {all.map((s, i) => (
        <div key={s.id} className="uf-grid__item">
          <p className="uf-grid__name"><span className="uf-n">{String(i + 1).padStart(2, "0")}</span>{s.name}</p>
          <DesignCard layout="screen" designWidth={SW} designHeight={SH} detail={null}><s.Screen /></DesignCard>
        </div>
      ))}
    </div>
  );
}
function StepList() {
  return (
    <div className="uf-steplist">
      <Stepper current={1} orientation="vertical" aria-label="Sign up">
        {MAIN.map(s => <StepperStep key={s.id} title={s.name} description={s.note} />)}
      </Stepper>
      <OnStage><Verify /></OnStage>
    </div>
  );
}
function StepOpen({ segmented }: { segmented?: boolean }) {
  return (
    <div className="uf-mini">
      <CanvasHead
        path={segmented
          ? <Segmented size="sm" aria-label="Show" defaultValue="step" items={[{ value: "step", label: "Step" }, { value: "flow", label: "Flow" }]} />
          : <span className="uf-path"><Button size="sm" variant="ghost" iconOnly aria-label="Back" icon={<ArrowLeftIcon />} /><span className="uf-muted">Sign up /</span> <span className="uf-n">2</span>Verify email</span>}
        end={<><StepControl /><Zoom /></>} />
      <OnStage><Verify /></OnStage>
    </div>
  );
}
function MapChosen() {
  return (
    <div className="uf-mini">
      <CanvasHead path={<span className="uf-path"><FlowIcon /> Sign up</span>} end={<><Button size="sm" variant="ghost" icon={<PlayIcon />}>Play</Button><Zoom /></>} />
      <div className="uf-stage"><FittedMap selected="verify" hot={["create>verify", "verify>profile"]} min={96} /></div>
    </div>
  );
}
function FlowTab() {
  return (
    <div className="uf-mini">
      <CanvasHead path={<span className="uf-path"><span className="uf-n">2</span>Verify email</span>} end={<><StepControl /><Zoom /></>} />
      <OnStage className="uf-onstage--short"><Verify /></OnStage>
      <div className="uf-peek uf-peek--open">
        <Tabs size="sm" aria-label="Design panel" value="flow" items={[{ id: "flow", label: "Flow" }, ...PANEL_TABS.slice(0, 4).map(t => ({ id: t.toLowerCase(), label: t }))]} />
        <div className="uf-peek__body"><Strip cw={150} /></div>
      </div>
    </div>
  );
}
function PlayInStage() {
  return (
    <div className="uf-mini">
      <CanvasHead path={<span className="uf-path"><PlayIcon /> Playing Sign up</span>} end={<Zoom />} />
      <div className="uf-play uf-hints">
        <OnStage><Verify /></OnStage>
        <div className="uf-playbar" role="toolbar" aria-label="Play">
          <Button size="sm" variant="ghost" iconOnly aria-label="Back" icon={<ArrowLeftIcon />} />
          <Button size="sm" variant="ghost" iconOnly aria-label="Restart" icon={<RotateCcwIcon />} />
          <span className="uf-playbar__sep" />
          <Button size="sm" variant="ghost" trailingIcon={<ChevronDownIcon />}><span className="uf-muted">2 of 5</span>&nbsp;Verify email</Button>
          <span className="uf-playbar__sep" />
          <Button size="sm" variant="ghost" icon={<LightbulbIcon />} selected>Hints</Button>
          <Button size="sm" variant="soft">Done</Button>
        </div>
      </div>
    </div>
  );
}
function PlayTakeover() {
  return (
    <div className="uf-takeover">
      <div className="uf-takeover__bar"><span>Sign up</span><span className="uf-muted">2 of 5</span><Button size="sm" variant="ghost" onColor>Done</Button></div>
      <div className="uf-takeover__screen"><Scaled w={SW} h={SH}><Verify /></Scaled></div>
    </div>
  );
}
function LinkInspector() {
  return (
    <div className="uf-linkfig">
      <div className="uf-mini">
        <CanvasHead path={<span className="uf-path"><span className="uf-n">1</span>Create account</span>} end={<><StepControl text="1 of 5" /><Zoom /></>} />
        <OnStage className="uf-select"><Create /></OnStage>
      </div>
      <InspectorPanel>
        <Group title="Button · Secondary">
          <div className="uf-prop"><span>Variant</span><CustomSelect aria-label="Variant" size="sm" defaultValue="outline" items={[{ value: "outline", label: "Outline" }]} fullWidth /></div>
          <div className="uf-prop"><span>Size</span><CustomSelect aria-label="Size" size="sm" defaultValue="md" items={[{ value: "md", label: "md" }]} fullWidth /></div>
        </Group>
        <Group title="On click">
          <div className="uf-prop"><span>Goes to</span><CustomSelect aria-label="Goes to" size="sm" defaultValue="signin" fullWidth items={[
            { value: "next", label: "Next step" }, { value: "signin", label: "1a  Sign in" }, { value: "verify", label: "2  Verify email" }, { value: "back", label: "Back" }, { value: "new", label: "A new step…" },
          ]} /></div>
        </Group>
        <Group title="Changes">
          <ul className="uf-log">
            <li><LinkIcon /><span><b>Link</b> Secondary → 1a Sign in</span><Button size="sm" variant="ghost" iconOnly aria-label="Undo" icon={<UndoIcon />} /></li>
            <li><LinkIcon /><span><b>Link</b> Continue → 2 Verify email · Error, when wrong</span><Button size="sm" variant="ghost" iconOnly aria-label="Undo" icon={<UndoIcon />} /></li>
          </ul>
          <Button size="sm" variant="outline" icon={<ChatIcon />}>Send to chat</Button>
        </Group>
      </InspectorPanel>
    </div>
  );
}
function StateSwitch() {
  return (
    <div className="uf-mini">
      <CanvasHead path={<span className="uf-path"><span className="uf-n">2</span>Verify email</span>}
        end={<><Segmented size="sm" aria-label="State" defaultValue="error" items={[{ value: "default", label: "Default" }, { value: "error", label: "Error" }, { value: "loading", label: "Loading" }]} /><Zoom /></>} />
      <OnStage><Verify state="error" /></OnStage>
    </div>
  );
}
function CommentsOnly() {
  return (
    <div className="uf-comments">
      <div className="uf-comment"><Avatar size="sm" fallback="DT" aria-label="David Tee" /><div><b>David Tee</b><p>Body text: the error and loading states still need a design.</p></div></div>
    </div>
  );
}
function PatternsGallery() {
  const Dash = DESKTOP.dashboard![1], Settings = DESKTOP.settings![1];
  const fan = (
    <div className="uf-fan" style={{ inlineSize: 1400, blockSize: 840 }}>
      <div style={{ transform: "translate(440px, 0)" }}><Done /></div>
      <div style={{ transform: "translate(220px, 120px)" }}><Verify /></div>
      <div style={{ transform: "translate(0, 240px)" }}><Create /></div>
    </div>
  );
  return (
    <div className="uf-patterns">
      <DesignCard layout="screen" designWidth={1400} designHeight={840} name="Sign up" detail={<Badge size="sm" variant="soft">5 steps</Badge>}>{fan}</DesignCard>
      <DesignCard layout="screen" designWidth={1400} designHeight={840} name="Checkout" detail={<Badge size="sm" variant="soft">4 steps</Badge>}>{fan}</DesignCard>
      <DesignCard layout="screen" designWidth={1024} designHeight={576} name="Dashboard" detail={null}><Dash /></DesignCard>
      <DesignCard layout="screen" designWidth={1024} designHeight={576} name="Settings" detail={null}><Settings /></DesignCard>
    </div>
  );
}

/* --- Questions ---------------------------------------------------------------------------------------------------------- */

interface Option { value: string; label: string; about: string; rec?: boolean; figure?: (mode: Mode) => ReactNode; wide?: boolean }
interface Question { id: string; title: string; about: string; options: Option[] }
const QUESTIONS: Question[] = [
  { id: "home", title: "Where a flow lives", about: "A page already holds layers in order and owns iterations, versions, comments and changes.", options: [
    { value: "page", rec: true, label: "A page becomes a flow", about: "At its first link, as a prototype's flow starts at its first connection. Its layers in order are the path; the Sidebar numbers them, branches and states under them.", figure: () => <SideNav home="page" /> },
    { value: "section", label: "A Flows section over pages", about: "Named start points that walk screens kept on ordinary pages, so one screen can sit in many flows. A second place to order screens.", figure: () => <SideNav home="section" current="p-signup" /> },
    { value: "system", label: "The system's Patterns only", about: "Flows as patterns of the system. Projects can copy them but can't design a flow of their own.", figure: () => <SideNav home="system" current="p-signup" /> },
  ] },
  { id: "overview", title: "How the whole flow is shown", about: "The stage holds one design; here, the flow is that design, laid out by rule.", options: [
    { value: "map", rec: true, wide: true, label: "A map: the path in a row, branches above, states under", about: "Becomes a strip when there are no branches. Cards scale with the zoom; names and link words stay at 13.", figure: () => <FittedMap min={96} /> },
    { value: "strip", wide: true, label: "A filmstrip", about: "Every step in one row that scrolls sideways (a flow library's view). No branches or states.", figure: () => <Strip /> },
    { value: "grid", wide: true, label: "A numbered grid", about: "Every screen numbered and named above it, three across. Compact; order reads only from the numbers.", figure: () => <NumberedGrid /> },
    { value: "list", wide: true, label: "A step list beside one screen", about: "A vertical Stepper with each step's note, and the chosen step on the stage. Clear order, no overview.", figure: () => <StepList /> },
  ] },
  { id: "open", title: "Between the flow and one step", about: "Rule 25: a card grows into the canvas; Back, Esc or ⌘↑ shrinks it back, still chosen.", options: [
    { value: "card", rec: true, label: "The flow first; a step opens from its card", about: "Double-click or Enter opens the step on the stage (today's view, the design panel under it); ← → walk the path.", figure: () => <div className="uf-stack"><MapChosen /><StepOpen /></div>, wide: true },
    { value: "switch", label: "The step first, with a Step / Flow switch", about: "A Segmented at the header's start. Two places for one thing.", figure: () => <StepOpen segmented /> },
    { value: "tab", label: "The flow in the design panel", about: "A Flow tab under the stage holds the strip. Always near, but small and below the fold.", figure: () => <FlowTab /> },
  ] },
  { id: "play", title: "Playing the flow", about: "Every flow tool has a player. Links act on a click; a click elsewhere outlines the links (hints); a step with no link goes on with a click anywhere.", options: [
    { value: "stage", rec: true, label: "Play in the stage", about: "Play (P) in the Canvas header. A bar at the stage's foot: Back, Restart (R), the step with a menu to jump, Hints, Done (Esc). Moves follow the system's Motion.", figure: () => <PlayInStage /> },
    { value: "takeover", label: "Play full window", about: "The flow alone on the window's ground: a presentation. Good for showing people; later, as Present.", figure: () => <PlayTakeover /> },
    { value: "later", label: "Later", about: "Build the map and links first; the flow can't be walked until then." },
  ] },
  { id: "links", title: "Making links", about: "Order is already the path, so a straight flow needs no links. Branches and loops need them.", options: [
    { value: "inspector", rec: true, wide: true, label: "Goes to, in the Design view", about: "Select an element on the stage (today's editing) and choose where it goes: a step, a state, Back or a new step. Logged with the other changes, undoable, sent to Chat with them.", figure: () => <LinkInspector /> },
    { value: "draw", wide: true, label: "Draw arrows on the map", about: "Drag from an element to a card. Direct, but the map becomes something you edit by hand.", figure: () => <FittedMap drag selected="profile" min={96} /> },
    { value: "order", wide: true, label: "Order only", about: "Steps go to the next, nothing else: no branches, no loops.", figure: () => <FittedMap branch={false} states={false} min={96} /> },
  ] },
  { id: "states", title: "A step's states", about: "Every form step has an error and a loading state; no flow tool models them.", options: [
    { value: "under", rec: true, label: "States sit under their step", about: "A column under the step on the map (dashed: the same step, changed), children of its row in the Sidebar, a Segmented over the stage. A link can go to a state.", figure: () => <StateSwitch /> },
    { value: "steps", wide: true, label: "States are steps", about: "Error and Loading take places in the path and are counted as steps.", figure: () => <Strip cw={170} states /> },
    { value: "none", label: "Not modelled", about: "Note missing states in Comments.", figure: () => <CommentsOnly /> },
  ] },
  { id: "notes", title: "Annotating a flow", about: "In the references a flow carries a description and its step names; Area can also check it.", options: [
    { value: "checks", rec: true, wide: true, label: "Numbers, link words, a note per step, flow checks", about: "One note line under each card; the flow's description in its facts; Checks finds dead ends, unreachable steps, form steps with no error state and steps with no way back.", figure: () => <div className="uf-pair uf-pair--side"><FittedMap notes min={96} /><div className="uf-checkcard"><FlowChecks /></div></div> },
    { value: "sticky", wide: true, label: "Notes placed on the map", about: "Free notes anywhere on the flow: a canvas by another name.", figure: () => <FittedMap sticky min={96} /> },
    { value: "comments", label: "Comments only", about: "Step names and the existing Comments tab, nothing more." },
  ] },
  { id: "patterns", title: "Flows in the system", about: "Patterns show how the system builds a screen; a flow shows how it builds a task.", options: [
    { value: "later", rec: true, wide: true, label: "Flow patterns, after flows on pages", about: "Sign up, Checkout, Change a setting, Create something: screens in order with states and links. Add flow copies one into a project as a flow page.", figure: () => <PatternsGallery /> },
    { value: "now", label: "Now, with flows on pages", about: "Both at once: about twice the first build." },
    { value: "no", label: "No", about: "Projects start every flow from nothing." },
  ] },
];

/* --- Picks: the page's store, collection `verdicts`, one document per question ---------------------------------------- */

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

function QuestionBlock({ q, i, mode, verdict, save }: { q: Question; i: number; mode: Mode; verdict?: Verdict; save: (id: string, v: Verdict) => void }) {
  const rec = q.options.find(o => o.rec)!.value;
  const pick = verdict?.pick ?? rec;
  const [note, setNote] = useState<string | undefined>(undefined);
  const shown = q.options.find(o => o.value === pick) ?? q.options[0]!;
  return (
    <section className="uf-q" id={`q-${q.id}`} aria-labelledby={`q-${q.id}-title`}>
      <header className="uf-q__head">
        <span className="uf-q__n">Q{i + 1}</span>
        <div><h2 id={`q-${q.id}-title`}>{q.title}</h2><p>{q.about}</p></div>
      </header>
      {q.options.every(o => !o.wide) ? (
        <div className="uf-q__figs" data-all="">
          {q.options.filter(o => o.figure).map(o => (
            <Frame key={o.value} label={o.label} mode={mode} picked={o.value === pick}>{o.figure!(mode)}</Frame>
          ))}
        </div>
      ) : (
        <div className="uf-q__figs">
          {shown.figure ? <Frame label={shown.label} wide={shown.wide} mode={mode}>{shown.figure(mode)}</Frame> : <p className="uf-q__nofig">{shown.label}: no picture; {shown.about.charAt(0).toLowerCase() + shown.about.slice(1)}</p>}
        </div>
      )}
      <RadioGroup label={q.title} className="uf-q__group" value={pick} onValueChange={v => save(q.id, { pick: v })} name={`q-${q.id}`}>
        {q.options.map(o => (
          <Radio key={o.value} value={o.value} id={`q-${q.id}-${o.value}`} variant="card"
            label={<>{o.label}{o.rec ? <span className="uf-rec">Recommended</span> : null}</>} description={o.about} />
        ))}
      </RadioGroup>
      <div className="uf-q__note">
        <Textarea id={`note-${q.id}`} aria-label={`Note on ${q.title}`} placeholder="Note (optional)" rows={2}
          value={note ?? verdict?.note ?? ""} onChange={e => setNote(e.currentTarget.value)}
          onBlur={() => { if (note !== undefined && note !== (verdict?.note ?? "")) save(q.id, { pick, note }); }} />
      </div>
    </section>
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
  useLayoutEffect(() => { for (const [k, v] of Object.entries(scopeOf(mode))) document.documentElement.setAttribute(k, v); }, [mode]);
  return mode;
}

function App() {
  const pageMode = usePageMode();
  const [look, setLook] = useState<"page" | Mode>("page");
  const mode: Mode = look === "page" ? pageMode : look;
  const { state, verdicts, save } = useVerdicts();
  return (
    <div className="uf-page">
      <header className="uf-top">
        <p className="uf-eyebrow">Area, proposal for review, 2026-11-08</p>
        <h1>User Flows</h1>
        <p className="uf-lede">How a project shows a flow that spans several screens: sign up, checkout, a settings change, a multi-step create. The flow is the page, and its overview is one design laid out by rule, so it never becomes a free canvas. Every screen, card and panel here is Area's real UI. Each question starts on the recommended answer; choosing another option redraws its picture.</p>
        <div className="uf-toolbar">
          <Segmented aria-label="Designs in" size="sm" value={look} onValueChange={v => setLook(v as typeof look)}
            items={[{ value: "page", label: "Page" }, { value: "light", label: "Light" }, { value: "dark", label: "Dark" }]} />
          <span className="uf-store" data-state={state}>{state === "live" ? "Picks save as you choose them." : state === "waiting" ? "Connecting to the page's store…" : "Picks can't be saved in this view; they stay until you reload."}</span>
        </div>
      </header>
      <section className="uf-hero" aria-labelledby="hero-title">
        <header className="uf-section__head">
          <h2 id="hero-title">The recommended flow page</h2>
          <p>A project's page "Sign up" after its first link: the Sidebar numbers its steps (a branch as 1a, states under their step), the stage shows the flow fitted, Play walks it, and the Inspector's Design view holds its facts, description and checks. 1440 × 900, fitted.</p>
        </header>
        <div className="uf-hero__frame"><Scaled w={1440} h={900}><AppShell mode={mode} /></Scaled></div>
      </section>
      {QUESTIONS.map((q, i) => <QuestionBlock key={q.id} q={q} i={i} mode={mode} verdict={verdicts[q.id]} save={save} />)}
      <footer className="uf-foot">Research, sources and measured values: docs/research/user-flows-2026-11-08/README.md. Built from Area's packages at main e5cd0af4; nothing in the app changed.</footer>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
