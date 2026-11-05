/**
 * Theme Experience artifact (2026-11-04). Owner: "create a theme experience artifact to show every possible question shown
 * in sequence in the feed or in chat … maybe it should be in the feed and be dedicated? or maybe it should be smaller in
 * the chat?"; then "the theme experience questions are not styled at all like the feed and chat kit latest".
 *
 * Every question of Setup (apps/desktop/src/pages/setup-questions.ts: 41 questions in 11 chapters) drawn as the kits draw a
 * visual question (apps/desktop/src/question-kit.tsx, PRODUCT_UI "Type and rhythm in the kits", rule 26):
 *   the unit   `qk-unit`: a frame over the question in a chat, beside it from 880 in a feed;
 *   the frame  Asset card's overlay (the name on a plate, Before, Light / Dark, Zoom and Full screen on hover), the real
 *              Workspace at true size on the part the question changes, or fitted where the answer moves the whole page;
 *              the answer under the pointer is drawn in it;
 *   the question  Approval, plain rows, one answer a line, "Default" a muted word after the setting's own value; a bar,
 *              swatches or chips with Use default / Continue; "Something else" and Skip on every kind; the run's pager.
 * Chat: the kit's chat at 268 / 456 / 768, a chapter opened in a line, each answer a reply bubble. Feed: the kit's feed at
 * 424 / 904 / 1440, a section per chapter. Answers carry forward: every later frame is drawn in the answers so far.
 *
 * QuestionFrame, VisualQuestion, noted and the bar and accent questions are question-kit.tsx's, copied here without its
 * app state (the Studio): keep them in step with it. Built by build.mjs against a tree; no app code changes.
 */
import { createRoot } from "react-dom/client";
import { useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { Approval, AssetCard, Badge, Button, Chip, ChipGroup, ColorSwatchPicker, Message, Pagination, Slider, Switch, Tooltip, ZoomControl } from "@area/react";
import { DismissIcon, HistoryIcon, MaximizeIcon, MinimizeIcon, MoonIcon, SunIcon } from "@area/icons";
import { CHAPTERS, QUESTIONS, type Question, type Choice } from "@src/pages/setup-questions.ts";
import { ScreenFigure, SHOWCASE, type Hold, type Region } from "@src/setup-screen.tsx";
import { GALLERY_CONTROLS } from "@src/gallery/controls.ts";
import { AXES } from "@src/tokens.ts";

type Axes = Record<string, string>;
type Mode = "light" | "dark";
interface Place { at: number; count: number; go: (at: number) => void }
interface Given { label: string; set: Axes }

/* --- Settings ------------------------------------------------------------------------------------------------------- */

const DEFAULTS: Axes = Object.fromEntries(GALLERY_CONTROLS.filter(c => c.axis !== "theme").map(c => [c.axis, c.defaultValue]));
const controlOf = (axis: string) => GALLERY_CONTROLS.find(c => c.axis === axis);
const say = (axis: string, value: string) => controlOf(axis)?.items.find(i => i.value === value)?.label ?? value;
/** The settings as a scope's attributes (studio.tsx canvasAttributes, the Material left at its default). */
const scopeOf = (values: Axes, mode: Mode): Record<string, string> => {
  const out: Record<string, string> = { "data-area-theme": mode };
  for (const [axis, value] of Object.entries(values)) if (!(axis === "contrast" && value === "system")) out[`data-area-${axis}`] = value;
  return out;
};
/** tile.tsx CARD_SCOPE and CARD_CAPTION: the cards' stroke and the card name's type. */
const CARD_SCOPE = { "data-area-card-tone-light": "-25", "data-area-card-tone-dark": "-25", "data-area-stroke": "2", "data-area-shadow-rest": "0", "data-area-shadow-hover": "0", "data-area-stroke-hover": "1" } as const;
const CARD_CAPTION = { className: "gallery-tile__caption" } as const;
const STROKE = { "data-area-stroke": CARD_SCOPE["data-area-stroke"] } as const;

/* --- question-kit.tsx, without the Studio ----------------------------------------------------------------------------- */

const noted = (label: ReactNode, note: "Default" | "Recommended" | undefined) => note ? <span className="qk-default">{label}<span className="qk-default__note">{note}</span></span> : label;

interface FrameProps { name: ReactNode; values: Axes; shown: Axes; mode: Mode; hold?: readonly Hold[]; focus?: Region; visual?: () => ReactNode; before?: boolean }
/** QuestionFrame: Asset card's overlay over the real Workspace, opened at 100% on `focus` (PRODUCT_UI rule 26). */
function QuestionFrame({ name, values, shown, mode: opening, hold = SHOWCASE, focus, visual, before = true }: FrameProps) {
  const [mode, setMode] = useState<Mode>(opening);
  useEffect(() => setMode(opening), [opening]);
  const [was, setWas] = useState(false);
  const [scale, setScale] = useState<number | null>(focus ? 1 : null);
  const [fitted, setFitted] = useState(1);
  const [full, setFull] = useState(false);
  const card = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const sync = () => setFull(document.fullscreenElement === card.current);
    document.addEventListener("fullscreenchange", sync);
    return () => document.removeEventListener("fullscreenchange", sync);
  }, []);
  const scope = scopeOf(was ? values : { ...values, ...shown }, mode);
  const zoom = scale ?? (visual ? 1 : fitted);
  const tip = (label: string, control: ReactNode) => <Tooltip side="top" describes={false} trigger={control}>{label}</Tooltip>;
  const bar = <>
    {before ? tip("Before", <Button variant="ghost" tone="neutral" size="sm" iconOnly icon={<HistoryIcon />} aria-label="Before" aria-pressed={was} onClick={() => setWas(v => !v)} />) : null}
    {tip(mode === "dark" ? "Light" : "Dark", <Button variant="ghost" tone="neutral" size="sm" iconOnly icon={mode === "dark" ? <SunIcon /> : <MoonIcon />} aria-label={mode === "dark" ? "Light" : "Dark"} onClick={() => setMode(v => v === "dark" ? "light" : "dark")} />)}
    <ZoomControl size="sm" value={zoom} min={0.25} max={4} onValueChange={setScale} onZoomToFit={() => setScale(null)} aria-label="Zoom" />
    {tip(full ? "Exit full screen" : "Full screen", <Button variant="ghost" tone="neutral" size="sm" iconOnly icon={full ? <MinimizeIcon /> : <MaximizeIcon />} aria-label={full ? "Exit full screen" : "Full screen"}
      onClick={() => { if (full) void document.exitFullscreen(); else void card.current?.requestFullscreen(); }} />)}
  </>;
  return (
    <AssetCard ref={card} className="qk-frame" {...CARD_SCOPE} container="basic" caption="overlay" fill="recessed" name={name} actions={bar} aspect="screen"
      frameProps={{ className: "qk-frame__view", "data-zoomed": scale ? "" : undefined }} headProps={CARD_CAPTION} badge={was ? <Badge variant="plain">Before</Badge> : undefined}>
      {visual ? <div className="qk-frame__visual tx-stage" {...scope} style={{ zoom } as CSSProperties}>{visual()}</div>
        : <ScreenFigure className="qk-frame__screen" screen="workspace" hold={hold} crossfade scope={scope} view={scale ? { scale, focus } : {}} onFit={setFitted} />}
    </AssetCard>
  );
}
function VisualQuestion({ frame, children, id }: { frame?: ReactNode; children: ReactNode; id?: string }) {
  return <div className="qk-unit tx-unit" id={id} {...STROKE}><div className="qk-unit__body">{frame ? <div className="qk-unit__frame">{frame}</div> : null}<div className="qk-unit__question">{children}</div></div></div>;
}
const headActions = (place: Place) => <>
  <Pagination layout="compact" size="sm" pageCount={place.count} page={place.at + 1} onPageChange={page => place.go(page - 1)}
    labels={{ nav: "Questions", previous: "Previous question", next: "Next question", status: (page, count) => <>{page} of {count}</> }} />
  <Button variant="ghost" tone="neutral" size="sm" iconOnly aria-label="Close questions" icon={<DismissIcon />} />
</>;
const inWords = (answer: (a: Given) => void) => ({ onInstead: () => answer({ label: "Something else", set: {} }), insteadPlaceholder: "Something else", onDismiss: () => answer({ label: "Skipped", set: {} }), dismissLabel: "skip" });

/* --- Setup's questions as the kit's kinds ----------------------------------------------------------------------------- */

interface Answer { value: string; label: string; set: Axes }
/** The page's likely picks (Setup's page control is a color picker). */
const PAGES: Record<Mode, Answer[]> = {
  light: [
    { value: "white", label: "White", set: { "ground-light": "100", neutral: "neutral" } },
    { value: "soft", label: "Soft white", set: { "ground-light": "98", neutral: "neutral" } },
    { value: "warm", label: "Paper", set: { "ground-light": "97", neutral: "warm" } },
    { value: "cool", label: "Cool grey", set: { "ground-light": "96", neutral: "cool" } },
  ],
  dark: [
    { value: "black", label: "True black", set: { "ground-dark": "0" } },
    { value: "near", label: "Near black", set: { "ground-dark": "4" } },
    { value: "charcoal", label: "Charcoal", set: { "ground-dark": "8" } },
    { value: "soft", label: "Soft dark", set: { "ground-dark": "14" } },
  ],
};
const PILLS = (controlOf("pills")?.items ?? []).map(i => ({ value: i.value, label: i.label }));
const accentHex = (id: string) => AXES.find(a => a.id === "accent")?.presets.find(p => p.id === id)?.tokens["--area-accent-500-full"] ?? id;
const NAMED_ACCENTS = (controlOf("accent")?.items ?? []).filter(i => !/^\d+$/.test(i.value));
const HUES = (controlOf("accent")?.scale ?? []).filter(v => /^\d+$/.test(v));

type Kind = "list" | "bar" | "accent" | "pills";
interface Asked { kind: Kind; answers: Answer[]; axis?: string; low?: string; high?: string }
function askedAs(q: Question): Asked {
  const c = q.control as Question["control"] & { choices?: Choice[]; axis?: string; off?: string; on?: string; low?: string; high?: string; mode?: Mode };
  if (c.kind === "cards") return { kind: "list", answers: (c.choices ?? []).map(ch => ({ value: Object.values(ch.set).join("/"), label: ch.label, set: ch.set as Axes })) };
  if (c.kind === "toggle") return { kind: "list", answers: [{ value: c.off!, label: "No", set: { [c.axis!]: c.off! } }, { value: c.on!, label: "Yes", set: { [c.axis!]: c.on! } }] };
  if (c.kind === "page") return { kind: "list", answers: PAGES[c.mode ?? "light"] };
  if (c.kind === "slider") return { kind: "bar", answers: [], axis: c.axis, low: c.low, high: c.high };
  if (c.kind === "accent") return { kind: "accent", answers: [] };
  return { kind: "pills", answers: [] };
}
const isDefault = (set: Axes) => Object.keys(set).length > 0 && Object.entries(set).every(([k, v]) => DEFAULTS[k] === v);

/** When a question is asked only after another answer (setup-questions.ts `when`), in words. */
const ASKED_WHEN: Record<string, string> = {
  "text-tint": "the page is tinted", saturation: "the accent appears", "button-shade": "the accent appears", "dark-fill-shade": "the accent appears",
  "label-tint": "buttons take the accent", status: "the accent is less than vivid", reach: "menus float", softness: "menus float", light: "menus float",
  "shadow-colour": "anything casts a shadow", "hover-edge": "edges show", easing: "motion is on", feedback: "motion is on",
};
const isAsked = (q: Question, values: Axes) => { if (!q.when) return true; try { return q.when(values as never, { light: null, dark: null }); } catch { return true; } };

/** The part a question changes, for its frame: Setup's close-up region, else its first focus; none moves the whole page. */
function partOf(q: Question, values: Axes): { focus?: Region; hold: readonly Hold[]; motion?: "motion" | "easing" | "press" } {
  const visual = (q.control as { visual?: { kind: string; region?: Region; hold?: Hold[] } }).visual;
  if (visual?.kind === "motion" || visual?.kind === "easing" || visual?.kind === "press") return { hold: [], motion: visual.kind };
  const hold = [...new Set([...(visual?.hold ?? q.hold ?? []), ...SHOWCASE])] as Hold[];
  if (visual?.kind === "crop") return { focus: visual.region, hold };
  const focus = typeof q.focus === "function" ? q.focus(values as never) : q.focus;
  return { focus: focus[0], hold };
}
const ACCENT_QUESTIONS = new Set(["accent", "saturation", "button-shade", "label-tint", "dark-fill-shade"]);
const PART_NAME: Partial<Record<Region, string>> = { action: "the primary button", primary: "the primary button", "nav-current": "the current page", "nav-hover": "a hovered row",
  "menu-row": "a menu row", "menu-danger": "the Delete row", "stat-hover": "a hovered card", "stat-selected": "a selected card", stat: "a card", stats: "the cards" };
const nameOf = (focus?: Region) => focus ? `Workspace, ${PART_NAME[focus] ?? `the ${focus}`}` : "Workspace";

/** A switch that flips on its own and a button that presses, in the scope's Speed, Easing and Feedback. */
function MotionStage({ kind }: { kind: "motion" | "easing" | "press" }) {
  const [on, setOn] = useState(false);
  useEffect(() => { const id = setInterval(() => setOn(v => !v), 1400); return () => clearInterval(id); }, []);
  return <div className="tx-motion">{kind === "press"
    ? <><Button>Save changes</Button><Button variant="outline" tone="neutral">Cancel</Button></>
    : <><Switch checked={on} onChange={() => setOn(v => !v)} label="Notifications" /><Switch checked={!on} onChange={() => setOn(v => !v)} label="Sync" /></>}</div>;
}

/** One of Setup's questions as the kit asks it: the frame over (or beside) the Approval. */
function SetupQuestion({ q, values, given, mode, place, answer, id }: { q: Question; values: Axes; given?: Given; mode: Mode; place: Place; answer: (a: Given) => void; id: string }) {
  const how = askedAs(q);
  // A question about the accent draws it where it shows, buttons and selection taking it, while it is asked (Area's
  // default keeps both neutral, so the frame would show no accent at all).
  const base = ACCENT_QUESTIONS.has(q.id) ? { ...values, action: "accent", selection: "accent" } : values;
  const found = partOf(q, base);
  // The form's middle holds no accent; its primary button does (as the kit's Accent question opens on it).
  const part = ACCENT_QUESTIONS.has(q.id) && found.focus === "form" ? { ...found, focus: "action" as Region } : found;
  const current = (axis: string) => given?.set[axis] ?? values[axis] ?? DEFAULTS[axis] ?? "";
  const [shown, setShown] = useState<Axes>({});
  const [bar, setBar] = useState(() => how.axis ? current(how.axis) : "");
  const [pills, setPills] = useState<string[]>(() => current("pills").split(" ").filter(Boolean));
  const [accent, setAccent] = useState(() => current("accent"));
  const frame = <QuestionFrame name={nameOf(part.focus)} values={base} shown={{ ...(given?.set ?? {}), ...shown }} mode={q.mode ?? mode} hold={part.hold} focus={part.focus}
    visual={part.motion ? () => <MotionStage kind={part.motion!} /> : undefined} before={!part.motion} />;
  const description = <>{q.description}{ASKED_WHEN[q.id] ? ` Asked when ${ASKED_WHEN[q.id]}.` : ""}</>;
  const common = { title: q.question, description, ...inWords(answer), actions: headActions(place) };
  let question: ReactNode;
  if (how.kind === "bar") {
    const axis = how.axis!, scale = controlOf(axis)?.scale ?? [];
    question = (
      <Approval {...common} items={[]} onChoose={() => {}} footer={<>
        <Button size="sm" variant="ghost" tone="neutral" disabled={bar === DEFAULTS[axis]} onClick={() => { setBar(DEFAULTS[axis]!); setShown({ [axis]: DEFAULTS[axis]! }); }}>Use default</Button>
        <Button size="sm" onClick={() => answer({ label: say(axis, bar), set: { [axis]: bar } })}>Continue</Button>
      </>}>
        <div className="qk-bar">
          <Slider labelPosition="inside" label={q.name} min={0} max={Math.max(0, scale.length - 1)} step={1} value={Math.max(0, scale.indexOf(bar))}
            readout={(i: number) => say(axis, scale[i] ?? bar)} onValueChange={i => { setBar(scale[i]!); setShown({ [axis]: scale[i]! }); }} />
          <div className="qk-bar__ends" aria-hidden="true"><span>{how.low}</span><span>{how.high}</span></div>
        </div>
      </Approval>
    );
  } else if (how.kind === "accent") {
    const custom = /^\d+$/.test(accent);
    question = (
      <Approval {...common} items={[]} onChoose={() => {}} footer={<Button size="sm" onClick={() => answer({ label: say("accent", accent), set: { accent } })}>Continue</Button>}>
        <div className="qk-stack">
          <ColorSwatchPicker label="Accent" layout="row" value={custom ? "" : accentHex(accent)} items={NAMED_ACCENTS.map(i => ({ value: accentHex(i.value), label: i.label }))}
            onValueChange={hex => { const i = NAMED_ACCENTS.find(e => accentHex(e.value) === hex); if (i) { setAccent(i.value); setShown({ accent: i.value }); } }} />
          <Slider labelPosition="inside" label="Any hue" min={0} max={HUES.length - 1} step={1} value={custom ? HUES.indexOf(accent) : 51}
            gradient="linear-gradient(to right in oklch longer hue, oklch(0.62 0.17 0), oklch(0.62 0.17 359))"
            readout={(i: number) => `${HUES[i]}°`} onValueChange={i => { setAccent(HUES[i]!); setShown({ accent: HUES[i]! }); }} />
        </div>
      </Approval>
    );
  } else if (how.kind === "pills") {
    question = (
      <Approval {...common} items={[]} onChoose={() => {}} footer={<>
        <Button size="sm" variant="ghost" tone="neutral" disabled={!pills.length} onClick={() => { setPills([]); setShown({ pills: "" }); }}>Clear</Button>
        <Button size="sm" onClick={() => answer({ label: pills.length ? PILLS.filter(p => pills.includes(p.value)).map(p => p.label).join(", ") : "None", set: { pills: pills.join(" ") } })}>Continue</Button>
      </>}>
        <ChipGroup aria-label="Fully round parts" className="qk-chips">
          {PILLS.map(p => <Chip key={p.value} size="sm" selected={pills.includes(p.value)} onSelectedChange={() => {
            const next = pills.includes(p.value) ? pills.filter(v => v !== p.value) : [...pills, p.value];
            setPills(next); setShown({ pills: next.join(" ") });
          }}>{p.label}</Chip>)}
        </ChipGroup>
      </Approval>
    );
  } else {
    const chosen = given ? how.answers.find(a => a.label === given.label)?.value : how.answers.find(a => Object.entries(a.set).every(([k, v]) => current(k) === v))?.value;
    question = (
      <Approval {...common} className="qk-choices qk-choices--words" value={chosen}
        items={how.answers.map(a => ({ value: a.value, label: noted(a.label, isDefault(a.set) ? "Default" : undefined) }))}
        onActiveChange={v => setShown(v ? how.answers.find(a => a.value === v)?.set ?? {} : {})}
        onChoose={v => { const a = how.answers.find(x => x.value === v)!; setShown({}); answer({ label: a.label, set: a.set }); }} />
    );
  }
  return <VisualQuestion id={id} frame={frame}>{question}</VisualQuestion>;
}

/* --- The two surfaces ------------------------------------------------------------------------------------------------- */

interface Surface { list: Question[]; values: Axes; answers: Record<string, Given>; answer: (id: string, a: Given | null) => void; mode: Mode }
const goTo = (prefix: string, list: Question[]) => (at: number) => document.getElementById(`${prefix}-${list[at]?.id}`)?.scrollIntoView({ block: "start", behavior: "smooth" });

function ChatView({ list, values, answers, answer, mode, open, width }: Surface & { open: "all" | "one"; width: number }) {
  const first = list.findIndex(q => !answers[q.id]);
  const shown = open === "one" ? list.slice(0, first < 0 ? list.length : first + 1) : list;
  const end = useRef<HTMLDivElement>(null);
  useEffect(() => { if (open === "one") end.current?.scrollIntoView({ block: "nearest", behavior: "smooth" }); }, [first, open]);
  const go = goTo("chat", list);
  let chapter = "";
  return (
    <section className="studio-section" aria-label="Theme setup in a chat">
      <div className="studio-chatkit__frame" style={{ "--_chat-width": `${width}px` } as CSSProperties}>
        <div className="studio-chat" {...STROKE}>
          <Message author="user">Help me set up a theme.</Message>
          <Message author="assistant" authorName="Assistant"><p>{list.length} questions in {new Set(list.map(q => q.chapter)).size} parts. Point at an answer to see it in the frame first; you can change any answer later.</p></Message>
          {shown.map(q => {
            const opener = q.chapter !== chapter ? CHAPTERS.find(c => c.id === q.chapter) : undefined;
            chapter = q.chapter;
            const given = answers[q.id];
            return [
              opener ? <Message key={`${q.id}-open`} author="assistant" authorName="Assistant" id={`chat-ch-${opener.id}`}><p><strong>{opener.title}.</strong> {opener.lede}</p></Message> : null,
              given ? <Message key={q.id} author="user" id={`chat-${q.id}`}><button type="button" className="tx-change" onClick={() => answer(q.id, null)} title={`${q.question} Change the answer`}>{given.label}</button></Message>
                : <SetupQuestion key={q.id} id={`chat-${q.id}`} q={q} values={values} given={given} mode={mode} place={{ at: list.indexOf(q), count: list.length, go }} answer={a => answer(q.id, a)} />,
            ];
          })}
          {first < 0 ? <Message author="assistant" authorName="Assistant"><p>That's every question. The theme is ready to name.</p></Message> : null}
          <div ref={end} />
        </div>
      </div>
    </section>
  );
}

function FeedView({ list, values, answers, answer, mode }: Surface) {
  const go = goTo("feed", list);
  return <>{CHAPTERS.filter(ch => list.some(q => q.chapter === ch.id)).map(ch => {
    const qs = list.filter(q => q.chapter === ch.id);
    return (
      <section key={ch.id} className="studio-section" id={`ch-${ch.id}`} aria-labelledby={`ch-${ch.id}-title`}>
        <div className="area-section-heading studio-section-heading">
          <h2 className="area-section-heading__title" id={`ch-${ch.id}-title`}>{ch.title} <span className="studio-count"><span className="area-count area-count--soft area-count--sm">{qs.length}</span></span></h2>
        </div>
        <div className="tx-feed-questions">
          {qs.map(q => <SetupQuestion key={`${q.id}-${answers[q.id]?.label ?? ""}`} id={`feed-${q.id}`} q={q} values={values} given={answers[q.id]} mode={mode}
            place={{ at: list.indexOf(q), count: list.length, go }} answer={a => answer(q.id, a)} />)}
        </div>
      </section>
    );
  })}</>;
}

/* --- The page: the kits' bar over the kits' Canvas -------------------------------------------------------------------- */

const read = (key: string, fallback: string) => { try { return localStorage.getItem(`tx-${key}`) ?? fallback; } catch { return fallback; } };
const write = (key: string, value: string) => { try { localStorage.setItem(`tx-${key}`, value); } catch { /* private window */ } };
const CHAT_WIDTHS = [["268", "Panel"], ["456", "Split"], ["768", "Column"]] as const;
const FEED_WIDTHS = [["424", "Least"], ["904", "Typical"], ["1440", "Most"]] as const;

function App() {
  const [surface, setSurface] = useState(() => read("surface", "chat"));
  const [path, setPath] = useState(() => read("path", "all"));
  const [open, setOpen] = useState<"all" | "one">(() => read("open", "all") as "all" | "one");
  const [chatWidth, setChatWidth] = useState(() => read("chat-width", "456"));
  const [feedWidth, setFeedWidth] = useState(() => read("feed-width", "1440"));
  const [mode, setMode] = useState<Mode>(document.documentElement.dataset.theme === "dark" ? "dark" : "light");
  const [answers, setAnswers] = useState<Record<string, Given>>({});
  useEffect(() => {
    document.documentElement.dataset.theme = mode;
    document.documentElement.setAttribute("data-area-theme", mode);
    write("theme", mode);
  }, [mode]);
  const values = useMemo(() => Object.assign({}, DEFAULTS, ...QUESTIONS.map(q => answers[q.id]?.set ?? {})) as Axes, [answers]);
  const list = QUESTIONS.filter(q => path === "essential" ? q.essential : path === "asked" ? isAsked(q, values) : true);
  const answer = (id: string, a: Given | null) => setAnswers(cur => { const next = { ...cur }; if (a) next[id] = a; else delete next[id]; return next; });
  const counts = { essential: QUESTIONS.filter(q => q.essential).length, asked: QUESTIONS.filter(q => isAsked(q, values)).length, all: QUESTIONS.length };
  const group = (label: string, value: string, set: (v: string) => void, items: ReadonlyArray<readonly [string, ReactNode]>) => (
    <div className="kit-bar__widths" role="group" aria-label={label}>
      {items.map(([v, l]) => <button key={v} type="button" aria-pressed={value === v} onClick={() => set(v)}>{l}</button>)}
    </div>
  );
  const chapters = CHAPTERS.filter(ch => list.some(q => q.chapter === ch.id));
  return (
    <div className="studio kit tx" style={surface === "feed" ? { "--kit-feed": `${feedWidth}px` } as CSSProperties : undefined}>
      <header className="kit-bar">
        <div className="kit-bar__name">Theme setup <span>Area · Labs</span></div>
        {group("Surface", surface, v => { setSurface(v); write("surface", v); }, [["chat", "Chat"], ["feed", "Feed"]])}
        {group("Questions", path, v => { setPath(v); write("path", v); }, [["essential", <>Essentials <span>{counts.essential}</span></>], ["asked", <>As answered <span>{counts.asked}</span></>], ["all", <>All <span>{counts.all}</span></>]])}
        {surface === "chat"
          ? <>{group("Width", chatWidth, v => { setChatWidth(v); write("chat-width", v); }, CHAT_WIDTHS.map(([px, l]) => [px, <>{l} <span>{px}</span></>] as const))}
            {group("Shown", open, v => { setOpen(v as "all" | "one"); write("open", v); }, [["all", "All open"], ["one", "One by one"]])}</>
          : group("Width", feedWidth, v => { setFeedWidth(v); write("feed-width", v); }, FEED_WIDTHS.map(([px, l]) => [px, <>{l} <span>{px}</span></>] as const))}
        <nav className="kit-bar__groups" aria-label="Chapters">{chapters.map(ch => <a key={ch.id} href={surface === "feed" ? `#ch-${ch.id}` : `#chat-ch-${ch.id}`}>{ch.title}</a>)}</nav>
        <button type="button" disabled={!Object.keys(answers).length} onClick={() => setAnswers({})}>Reset</button>
        <button type="button" onClick={() => setMode(m => m === "dark" ? "light" : "dark")}>{mode === "dark" ? "Light" : "Dark"}</button>
      </header>
      <div className="studio-canvas__body" data-feed="canvas" {...scopeOf(DEFAULTS, mode)}>
        <div className={`studio-sections studio-feed${surface === "chat" ? " studio-chatkit" : ""}`}>
          {surface === "chat"
            ? <ChatView list={list} values={values} answers={answers} answer={answer} mode={mode} open={open} width={Number(chatWidth)} />
            : <FeedView list={list} values={values} answers={answers} answer={answer} mode={mode} />}
        </div>
      </div>
    </div>
  );
}

createRoot(document.getElementById("tx-root")!).render(<App />);
