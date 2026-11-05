/**
 * Visual questions (owner, 2026-11-03: "a new ui type for both feed and chat, which is essentially a main frame and a
 * vertical list of answers to select from or horizontal list or grid of answers, or even a slider, chip selections, or
 * any kind of control … a full chat width ui preview frame (based on asset card) and then the controls, answers, etc
 * below in some kind of consistent visual layout pattern"). docs/research/visual-questions-2026-11-03 holds the rules.
 *
 * One pattern for every kind, a frame over a question, 8 apart:
 *   frame     Asset card (framed, 16:9): its name says what it shows; its bar holds Before, Light / Dark, the Zoom control
 *             and Full screen. It draws real UI in the answer's settings: the one under the pointer before it is picked,
 *             the one picked after
 *   question  Approval: the question, what it changes, then one answer kind (a list, a grid of words, a grid of pictures,
 *             a bar, swatches, chips, bars to fine-tune), "Something else" and Skip on every kind, Continue where the
 *             answer isn't one press
 * In a chat the two stack at the column's width; in a feed they sit beside each other once the unit is 880 wide.
 *
 * Templates, each one variable or one judgement (the research's table):
 *   setting questions  Screen kind (pictures), Where it's used (2 x 2 words), Room (a row of three), Corners
 *                      (pictures), Shadows (a bar), Accent (swatches and a hue bar), Typeface (specimens), Fine-tune (bars)
 *   feedback           Next step (a list), A or B (two frames), How close (three points), What's off (chips)
 *
 * Copy is one generic scenario in design words (never a product, never git words): someone is setting up the look of a
 * workspace app and judging what the agent made.
 */
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { Approval, AssetCard, Badge, Button, Chip, ChipGroup, ColorSwatchPicker, NumberField, Pagination, Select, Slider, Tooltip, ZoomControl, type ApprovalOption } from "@area/react";
import { CornerIcon, DismissIcon, EllipseIcon, RectangleIcon, HistoryIcon, LineStyleIcon, MaximizeIcon, MinimizeIcon, MoonIcon, ShadowIcon, SunIcon, TextSizeIcon } from "@area/icons";
import { canvasAttributes, CANVAS_DEFAULTS, useStudio, type CanvasAxes } from "./studio.tsx";
import { ScreenFigure, SHOWCASE, type Hold, type Region, type ScreenId } from "./setup-screen.tsx";
import { MiniPicture, type MiniKind } from "./choice-visuals.tsx";
import { GALLERY_CONTROLS } from "./gallery/controls.ts";
import { hueName } from "./inspector-rows.tsx";
import { AXES } from "./tokens.ts";
import { CARD_CAPTION, CARD_SCOPE } from "./tile.tsx";
import { factsOf, stackOf, typefaceOf } from "./pages/typefaces.tsx";

type Axis = keyof CanvasAxes;
type Changes = Partial<Record<Axis, string>>;
type Mode = "light" | "dark";
/** Where a question is among several: its place, the count and the way to another. */
export interface Place { at: number; count: number; go: (at: number) => void }

const controlOf = (axis: Axis) => GALLERY_CONTROLS.find(entry => entry.axis === axis);
const say = (axis: Axis, value: string) => controlOf(axis)?.items.find(item => item.value === value)?.label ?? value;
const defaultOf = (axis: Axis) => (CANVAS_DEFAULTS as Record<string, string>)[axis] ?? "";
/** "Default" after an answer's words, in the same size one ink step down (the kits' type rule 1; a Badge beside a word
 *  outweighed it and doubled the row: owner, 2026-11-04, "doesnt look balanced with the badge next to it"). */
/** A note after an answer's words, the same size in the muted ink, on their line: "Default" (the setting's own), or
 *  "Recommended" (what the asker would pick; owner, 2026-11-04: "how would you show recommended answers (as a badge?) or
 *  just plain text?"), never a plated Badge beside a word in a row of words. One note an answer: Recommended wins. */
export const noted = (label: ReactNode, note: "Default" | "Recommended" | undefined) => note ? <span className="qk-default">{label}<span className="qk-default__note">{note}</span></span> : label;
const isDefault = (label: ReactNode, yes: boolean) => noted(label, yes ? "Default" : undefined);

/* --- The frame ------------------------------------------------------------------------------------------------------ */

interface FrameProps {
  /** What the frame shows, in the card's head. */
  name: ReactNode;
  /** The settings it draws: the answer under the pointer, else the one picked. */
  shown: Changes;
  /** A product screen (the Workspace by default), or a picture of its own drawn under the scope. */
  screen?: ScreenId;
  hold?: readonly Hold[];
  visual?: (scopeOf: (changes: Changes) => Record<string, string | undefined>) => ReactNode;
  /** Before: hold the frame on the settings the question started from, to compare. Off where there is nothing before. */
  before?: boolean;
  /** The part the question changes. The frame opens on it at true size (owner, 2026-11-04, "Show UI at 1:1": a corner,
   *  an edge or a shadow judged in a whole screen fitted to the frame was drawn at 0.2 to 0.36 of its size; the fidelity
   *  pass, docs/research/fidelity-2026-11-04). Zoom to fit is a click away. No part: the whole screen, fitted, for a
   *  question about the whole design (Screen kind, A or B, How close, What's off). */
  focus?: Region;
  /** Open at another zoom on the part than true size. */
  zoom?: number;
}

/** Asset card as the frame: the visual 16:9 under a head of controls. */
export function QuestionFrame({ name, shown, screen = "workspace", hold = SHOWCASE, visual, before = true, zoom: opening, focus }: FrameProps) {
  const studio = useStudio();
  const [mode, setMode] = useState<Mode>(studio.theme === "dark" ? "dark" : "light");
  const [was, setWas] = useState(false);
  const [scale, setScale] = useState<number | null>(opening ?? (focus ? 1 : null));
  const [fitted, setFitted] = useState(1);
  const [full, setFull] = useState(false);
  const card = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const sync = () => setFull(document.fullscreenElement === card.current);
    document.addEventListener("fullscreenchange", sync);
    return () => document.removeEventListener("fullscreenchange", sync);
  }, []);
  const scopeOf = (changes: Changes) => ({ ...canvasAttributes({ ...studio.shown.canvas, ...changes } as CanvasAxes, studio.shown.material), "data-area-theme": mode });
  const scope = scopeOf(was ? {} : shown);
  const zoom = scale ?? (visual ? 1 : fitted);
  const tip = (label: string, control: ReactNode) => <Tooltip side="top" describes={false} trigger={control}>{label}</Tooltip>;
  const bar = <>
    {before ? tip("Before", <Button variant="ghost" tone="neutral" size="sm" iconOnly icon={<HistoryIcon />} aria-label="Before" aria-pressed={was} onClick={() => setWas(value => !value)} />) : null}
    {tip(mode === "dark" ? "Light" : "Dark", <Button variant="ghost" tone="neutral" size="sm" iconOnly icon={mode === "dark" ? <SunIcon /> : <MoonIcon />} aria-label={mode === "dark" ? "Light" : "Dark"} onClick={() => setMode(value => value === "dark" ? "light" : "dark")} />)}
    <ZoomControl size="sm" value={zoom} min={0.25} max={4} onValueChange={setScale} onZoomToFit={() => setScale(null)} aria-label="Zoom" />
    {tip(full ? "Exit full screen" : "Full screen", <Button variant="ghost" tone="neutral" size="sm" iconOnly icon={full ? <MinimizeIcon /> : <MaximizeIcon />} aria-label={full ? "Exit full screen" : "Full screen"}
      onClick={() => { if (full) void document.exitFullscreen(); else void card.current?.requestFullscreen(); }} />)}
  </>;
  return (
    // The feed's card in its interactive, larger form (owner, 2026-11-04: "keeps all controls on the inside of the frame
    // … in buttons that appear on hover, also maybe move the label to the inside"): Asset card's overlay caption, the
    // name on a plate at the bottom start and the controls on a plate at the top end, shown under the pointer or with
    // focus (always on touch), the picture filling the card 8 in. The gallery's cards keep their names outside.
    <AssetCard ref={card} className="qk-frame" {...CARD_SCOPE} container="basic" caption="overlay" fill="recessed" name={name} actions={bar} aspect="screen" frameProps={{ className: "qk-frame__view", "data-zoomed": scale ? "" : undefined }} headProps={CARD_CAPTION}
      badge={was ? <Badge variant="plain">Before</Badge> : undefined}>
      {visual ? (
        <div className="qk-frame__visual" {...scope} style={{ zoom } as CSSProperties}>{visual(changes => scopeOf(was ? {} : changes))}</div>
      ) : (
        <ScreenFigure className="qk-frame__screen" screen={screen} hold={hold} crossfade scope={scope} view={scale ? { scale, focus } : {}} onFit={setFitted} />
      )}
    </AssetCard>
  );
}

/** The unit: the frame over the question, 8 apart; beside each other in a wide feed (studio-question, feed.css). */
/* A question's cards take the cards' stroke wherever the question sits (2026-11-04 kit pass), as a chat's root gives
   them: in the feed the question card drew the app's edge (light 0.949) beside its frame's 6% and beside the same card
   in a chat (0.975). */
const STROKE = { "data-area-stroke": CARD_SCOPE["data-area-stroke"] } as const;

/** The unit: a frame over the question, or the question alone where its answer changes nothing visible (owner,
 *  2026-11-04: "not all answers need a frame above showing the context"). */
export function VisualQuestion({ frame, children }: { frame?: ReactNode; children: ReactNode }) {
  return <div className="qk-unit" {...STROKE}><div className="qk-unit__body">{frame ? <div className="qk-unit__frame">{frame}</div> : null}<div className="qk-unit__question">{children}</div></div></div>;
}

/** The question's head end, only in a run of several (owner, 2026-11-04: "should there be a close button on the chat
 *  answers? maybe its not necessary"): where it is among them, then a close that ends the whole run (Skip moves past one
 *  question). A single question has no head end: Skip and Esc already end it, and a close beside them said it twice. */
const headActions = (place: Place | undefined, onClose?: () => void) => place ? <>
  <Pagination layout="compact" size="sm" pageCount={place.count} page={place.at + 1} onPageChange={page => place.go(page - 1)}
    labels={{ nav: "Questions", previous: "Previous question", next: "Next question", status: (page, count) => <>{page} of {count}</> }} />
  <Button variant="ghost" tone="neutral" size="sm" iconOnly aria-label="Close questions" icon={<DismissIcon />} onClick={onClose} />
</> : undefined;

interface QuestionProps { place?: Place; onDone?: () => void }

/** Every kind ends the same way (the detail pass, 2026-11-04): a last row to answer in words, Skip at its end, and Esc
 *  skips; a kind whose answer is not one press adds its way on (Use default, Continue) in the foot under it. */
const inWords = (onDone?: () => void) => ({ onInstead: () => onDone?.(), insteadPlaceholder: "Something else", onDismiss: () => onDone?.(), dismissLabel: "skip" });

/**
 * A setting question whose answers are presses: the answer under the pointer or focus is drawn in the frame, a press
 * picks it (and moves on in a run). One shape for words in a list, words in a grid and pictures in a grid.
 */
function ChoiceQuestion({ place, onDone, name, title, description, items, layout = "list", columns, ratio, screen, frameScreen, hold, visual, zoom, focus, frameless }: QuestionProps & Pick<FrameProps, "zoom" | "focus"> & {
  /** No frame: the answer changes nothing visible. */
  frameless?: boolean;
  /** What the frame shows: a name, or the shown answer's own (a screen's). */
  name: ReactNode | ((label: ReactNode | undefined) => ReactNode); title: string; description?: string; layout?: "list" | "grid"; columns?: number; ratio?: string;
  items: ReadonlyArray<ApprovalOption & { set: Changes; screen?: ScreenId }>;
  screen?: ScreenId; frameScreen?: (value: string | undefined) => ScreenId | undefined; hold?: readonly Hold[];
  visual?: FrameProps["visual"];
}) {
  const studio = useStudio();
  const matches = (set: Changes) => Object.entries(set).every(([axis, value]) => (studio.shown.canvas as Record<string, string>)[axis] === value);
  const [value, setValue] = useState<string | undefined>(() => items.find(item => Object.keys(item.set).length && matches(item.set))?.value);
  const [active, setActive] = useState<string | undefined>();
  const shownValue = active ?? value;
  const shownItem = items.find(item => item.value === shownValue);
  const style = { ...(columns ? { "--_qk-columns": columns } : {}), ...(ratio ? { "--area-approval-ratio": ratio } : {}) } as CSSProperties;
  const pictured = items.some(item => item.visual != null);
  // Before compares with where the question started, so it shows only where an answer changes a setting.
  const changes = items.some(item => Object.keys(item.set).length > 0);
  return (
    <VisualQuestion frame={frameless ? undefined : <QuestionFrame name={typeof name === "function" ? name(shownItem?.label) : name} shown={shownItem?.set ?? {}} before={changes}
      screen={shownItem?.screen ?? frameScreen?.(shownValue) ?? screen} hold={hold} visual={visual} zoom={zoom} focus={focus} />}>
      <Approval title={title} description={description} layout={layout} style={style} className={pictured ? `qk-choices qk-choices--pictures${columns === 3 ? " qk-choices--trio" : ""}` : `qk-choices qk-choices--words${(columns ?? 2) >= 3 ? " qk-choices--row" : ""}`}
        items={items.map(({ set: _set, screen: _screen, ...item }) => item)} value={value} onActiveChange={setActive}
        onChoose={next => { setValue(next); onDone?.(); }} {...inWords(onDone)} actions={headActions(place)} />
    </VisualQuestion>
  );
}

/* --- Setting questions ---------------------------------------------------------------------------------------------- */

/** Each screen kind's simple picture (choice-visuals.tsx MiniPicture). */
const MINI_OF: Partial<Record<ScreenId, MiniKind>> = { workspace: "workspace", analytics: "dashboard", settings: "settings", phone: "phone" };
const SCREEN_KINDS: ReadonlyArray<{ value: ScreenId; label: string }> = [
  { value: "workspace", label: "Workspace" }, { value: "analytics", label: "Dashboard" }, { value: "settings", label: "Settings" }, { value: "phone", label: "Phone app" },
];
/** Which screen to start from: each answer the screen as a simple abstract picture (words as bars; the owner's "Select
 *  Interface" cards), the frame the real screen under the pointer or chosen. */
export function ScreenKindQuestion(props: QuestionProps) {
  const studio = useStudio();
  const scope = { ...canvasAttributes(studio.shown.canvas, studio.shown.material), "data-area-theme": studio.theme };
  return (
    <ChoiceQuestion {...props} name={label => label ?? "Workspace"} title="Which screen should we start from?" description="Every later question draws on it." layout="grid" ratio="16 / 9"
      items={SCREEN_KINDS.map(kind => ({ value: kind.value, label: kind.label, set: {}, screen: kind.value,
        visual: <span className="qk-pic" {...scope}><MiniPicture kind={MINI_OF[kind.value] ?? "workspace"} /></span> }))}
      screen="workspace" />
  );
}

/** Where it's used: four short answers in words, and no frame (its answer changes nothing on the screen yet). */
export function WhereQuestion(props: QuestionProps) {
  return (
    <ChoiceQuestion {...props} name="Workspace" title="Where will people use it most?" frameless
      items={[
        { value: "desktop", label: noted("On a computer", "Recommended"), set: {}, screen: "workspace" },
        { value: "phone", label: "On a phone", set: {}, screen: "phone" },
        { value: "both", label: "Both equally", set: {}, screen: "workspace" },
        { value: "unsure", label: "Not sure yet", set: {}, screen: "workspace" },
      ]} />
  );
}

/** Room: an ordered setting of three named steps, one row of keyed words. */
export function RoomQuestion(props: QuestionProps) {
  // The steps in the question's own words (the setting's middle step is called Default, which read "Default Default").
  const WORDS: Record<string, string> = { "28": "Tighter", "32": "Balanced", "36": "Roomier" };
  const items = (controlOf("density")?.items ?? []).map(item => ({ value: item.value, label: isDefault(WORDS[item.value] ?? item.label, item.value === defaultOf("density")), set: { density: item.value } }));
  return <ChoiceQuestion {...props} name="Workspace, the list" title="How much room between things?" description="Taller rows and wider gaps, or more on the screen." items={items} focus="list" />;
}

const CORNERS = ["0", "4", "8", "10", "14", "pill"] as const;
/** Corners: a look words say badly, so each answer is the tiny window (simple abstract UI) drawn at that corner. */
export function CornersQuestion(props: QuestionProps) {
  const studio = useStudio();
  return (
    <ChoiceQuestion {...props} name="Workspace, the form" title="How round should corners be?" layout="grid" columns={3} ratio="4 / 3" focus="form"
      items={CORNERS.map(value => ({ value, label: isDefault(say("radius", value), value === defaultOf("radius")), set: { radius: value },
        visual: <span className="qk-pic" {...canvasAttributes({ ...studio.shown.canvas, radius: value }, studio.shown.material)}><MiniPicture /></span> }))} />
  );
}

/** A bar's question: an amount over an ordered setting, its ends named, the frame answering as it moves. */
function BarQuestion({ place, onDone, name, title, description, axis, label, start, end, hold, zoom, focus }: QuestionProps & Pick<FrameProps, "zoom" | "focus"> & { name: ReactNode; title: string; description?: string; axis: Axis; label: string; start: string; end: string; hold?: readonly Hold[] }) {
  const studio = useStudio();
  const scale = controlOf(axis)?.scale ?? [];
  const [value, setValue] = useState(() => (studio.shown.canvas as Record<string, string>)[axis] ?? defaultOf(axis));
  const at = Math.max(0, scale.indexOf(value));
  return (
    <VisualQuestion frame={<QuestionFrame name={name} shown={{ [axis]: value }} hold={hold} zoom={zoom} focus={focus} />}>
      <Approval title={title} description={description} items={[]} onChoose={() => {}} {...inWords(onDone)} actions={headActions(place)}
        footer={<>
          <Button size="sm" variant="ghost" tone="neutral" disabled={value === defaultOf(axis)} onClick={() => setValue(defaultOf(axis))}>Use default</Button>
          <Button size="sm" onClick={() => onDone?.()}>Continue</Button>
        </>}>
        {/* The Inspector's bar (label and value inside), its ends named under it: the owner's "Intensity, Low … High". */}
        <div className="qk-bar">
          <Slider labelPosition="inside" label={label} min={0} max={scale.length - 1} step={1} value={at}
            readout={(index: number) => say(axis, scale[index] ?? value)} onValueChange={index => setValue(scale[index]!)} />
          <div className="qk-bar__ends" aria-hidden="true"><span>{start}</span><span>{end}</span></div>
        </div>
      </Approval>
    </VisualQuestion>
  );
}
export const ShadowQuestion = (props: QuestionProps) => (
  <BarQuestion {...props} name="Workspace, a menu open" title="How much should floating things lift?" description="Menus, popovers and dialogs cast this shadow." axis="elevation" label="Shadow" start="Flat" end="Lifted" focus="menu" />
);

/** The palette's accents, each its 500 step at full strength, and any hue on a bar. */
const accentHex = (id: string) => AXES.find(axis => axis.id === "accent")?.presets.find(preset => preset.id === id)?.tokens["--area-accent-500-full"] ?? id;
const NAMED = (controlOf("accent")?.items ?? []).filter(item => !/^\d+$/.test(item.value));
const HUES = Array.from({ length: 72 }, (_, step) => String(step * 5));
/** Accent: a colour, so a row of swatches (few, harmonised) and a hue bar behind them for any other. */
export function AccentQuestion({ place, onDone }: QuestionProps) {
  const studio = useStudio();
  const [accent, setAccent] = useState(() => studio.shown.canvas.accent);
  const custom = /^\d+$/.test(accent);
  const changes: Changes = { accent, action: "accent", selection: "accent" };
  return (
    <VisualQuestion frame={<QuestionFrame name="Workspace, the form" shown={changes} focus="action" />}>
      <Approval title="Which color should actions be?" description="Primary buttons, checked boxes and the current page." items={[]} onChoose={() => {}}
        {...inWords(onDone)} actions={headActions(place)}
        footer={<Button size="sm" onClick={() => onDone?.()}>Continue</Button>}>
        <div className="qk-stack">
          <ColorSwatchPicker label="Accent" layout="row" value={custom ? "" : accentHex(accent)}
            items={NAMED.map(item => ({ value: accentHex(item.value), label: item.label }))}
            onValueChange={hex => { const item = NAMED.find(entry => accentHex(entry.value) === hex); if (item) setAccent(item.value); }} />
          <Slider labelPosition="inside" label="Any hue" min={0} max={HUES.length - 1} step={1} value={custom ? HUES.indexOf(accent) : 51}
            gradient="linear-gradient(to right in oklch longer hue, oklch(0.62 0.17 0), oklch(0.62 0.17 359))"
            readout={(index: number) => `${hueName(Number(HUES[index]))} ${HUES[index]}°`} onValueChange={index => setAccent(HUES[index]!)} />
        </div>
      </Approval>
    </VisualQuestion>
  );
}

const FACES = [["geist", "Sans"], ["newsreader", "Serif"], ["fraunces", "Soft serif"], ["geist-mono", "Mono"]] as const;
const stack = (id: string) => { const face = typefaceOf(id); return face ? stackOf(face, factsOf(face, undefined)) : "var(--area-font-sans)"; };
/** Typeface: judged by its letters, so each answer is "Aa" in the face, and the frame a page set in it. */
export function TypefaceQuestion({ place, onDone }: QuestionProps) {
  const [face, setFace] = useState<string>("geist");
  const [active, setActive] = useState<string | undefined>();
  const shown = active ?? face;
  return (
    <VisualQuestion frame={<QuestionFrame name="A page" shown={{}} before={false} visual={scopeOf => (
      <article className="qk-page" {...scopeOf({})} style={{ "--_face": stack(shown) } as CSSProperties}>
        <h3 className="qk-page__title">Notes from the planning review</h3>
        <p className="qk-page__text">The team agreed on three priorities for the quarter. Each one has an owner, a date and a short list of open questions to settle before work starts.</p>
        <p className="qk-page__text qk-page__text--muted">Next review in two weeks.</p>
      </article>
    )} />}>
      <Approval title="Which typeface reads right?" description="For headings and text; code keeps its own." layout="grid" className="qk-choices qk-choices--pictures" style={{ "--area-approval-ratio": "16 / 9" } as CSSProperties}
        items={FACES.map(([id, label]) => ({ value: id, label: isDefault(label, id === "geist"), visual: <span className="qk-aa" style={{ fontFamily: stack(id) }}>Aa</span> }))}
        value={face} onActiveChange={setActive} onChoose={next => { setFace(next); onDone?.(); }} {...inWords(onDone)} actions={headActions(place)} />
    </VisualQuestion>
  );
}

/** Fine-tune: the exact values, once the direction is set: three bars in a column (the owner's corner fields). */
export function FineTuneQuestion({ place, onDone }: QuestionProps) {
  const studio = useStudio();
  const now = studio.shown.canvas as Record<string, string>;
  const [values, setValues] = useState<Changes>({ type: now.type, radius: now.radius, surface: now.surface });
  /* Each bar in its setting's own order, its named stop where it falls (Hairline between 0 and 0.5), in UI words. */
  const ORDER: Partial<Record<Axis, string[]>> = { surface: ["0", "hairline", "0.5", "1", "1.5", "2"] };
  const LABEL: Partial<Record<Axis, string>> = { type: "Text size", radius: "Corners", surface: "Lines" };
  const row = (axis: Axis) => {
    const scale = ORDER[axis] ?? controlOf(axis)?.scale ?? controlOf(axis)?.items.map(item => item.value) ?? [];
    const value = values[axis] ?? defaultOf(axis);
    return <Slider key={axis} labelPosition="inside" label={LABEL[axis] ?? controlOf(axis)?.label ?? axis} min={0} max={Math.max(0, scale.length - 1)} step={1} value={Math.max(0, scale.indexOf(value))}
      readout={(index: number) => say(axis, scale[index] ?? value)} onValueChange={index => setValues(current => ({ ...current, [axis]: scale[index]! }))} />;
  };
  return (
    <VisualQuestion frame={<QuestionFrame name="Workspace, the form" shown={values} focus="form" />}>
      <Approval title="Fine-tune the details" description="Exact values; every other setting stays as it is." items={[]} onChoose={() => {}}
        {...inWords(onDone)} actions={headActions(place)}
        footer={<>
          <Button size="sm" variant="ghost" tone="neutral" onClick={() => setValues({ type: defaultOf("type"), radius: defaultOf("radius"), surface: defaultOf("surface") })}>Use defaults</Button>
          <Button size="sm" onClick={() => onDone?.()}>Done</Button>
        </>}>
        <div className="qk-stack qk-stack--bars">{row("type")}{row("radius")}{row("surface")}</div>
      </Approval>
    </VisualQuestion>
  );
}

/**
 * Exact values as fields (owner, 2026-11-04: "show some examples with some inputs, controls, etc as options too … the
 * fill color and stroke of the answers somewhat matches what the fill and stroke of the inputs"): soft fields, whose fill
 * is the answers' own (input-bg-soft is the control fill) and who draw no edge at rest, two across 4 apart as a grid's
 * answers, each a setting with its icon and unit; then the room as a soft Select and pill or sharp corners as outline
 * toggles (the boxed controls of a property panel). A typed value lands on the setting's nearest step.
 */
const nearest = (scale: readonly string[], value: number) => scale.filter(step => /^-?\d+(\.\d+)?$/.test(step)).reduce((best, step) => Math.abs(Number(step) - value) < Math.abs(Number(best) - value) ? step : best, "0");
export function FieldsQuestion({ place, onDone }: QuestionProps) {
  const studio = useStudio();
  const now = studio.shown.canvas as Record<string, string>;
  const [values, setValues] = useState<Changes>({ type: now.type, radius: now.radius, surface: now.surface === "hairline" ? "0.5" : now.surface, elevation: now.elevation, density: now.density });
  const put = (axis: Axis, value: string) => setValues(current => ({ ...current, [axis]: value }));
  const scaleOf = (axis: Axis) => controlOf(axis)?.scale ?? controlOf(axis)?.items.map(item => item.value) ?? [];
  const field = (axis: Axis, label: string, icon: ReactNode, unit: string, step = 1) => {
    const value = values[axis] ?? defaultOf(axis);
    return <NumberField key={axis} variant="soft" fullWidth aria-label={label} scrub={icon} scrubLabel={label} unit={unit} step={step}
      value={value === "pill" ? null : Number(value)} mixed={value === "pill"} onValueChange={next => { if (next != null) put(axis, nearest(scaleOf(axis), next)); }} />;
  };
  const pill = values.radius === "pill";
  return (
    <VisualQuestion frame={<QuestionFrame name="Workspace, the form" shown={values} focus="form" />}>
      <Approval title="Set the exact values" description="Type a value or drag an icon; each lands on its setting's nearest step." items={[]} onChoose={() => {}}
        {...inWords(onDone)} actions={headActions(place)}
        footer={<>
          <Button size="sm" variant="ghost" tone="neutral" onClick={() => setValues({ type: defaultOf("type"), radius: defaultOf("radius"), surface: defaultOf("surface"), elevation: defaultOf("elevation"), density: defaultOf("density") })}>Use defaults</Button>
          <Button size="sm" onClick={() => onDone?.()}>Done</Button>
        </>}>
        <div className="qk-fields">
          {field("type", "Text size", <TextSizeIcon />, "px")}
          {field("radius", "Corners", <CornerIcon />, "px", 2)}
          {field("surface", "Lines", <LineStyleIcon />, "px", 0.5)}
          {field("elevation", "Shadow", <ShadowIcon />, "")}
          <Select variant="soft" fullWidth aria-label="Room" value={values.density} onChange={event => put("density", event.currentTarget.value)}>
            {(controlOf("density")?.items ?? []).map(item => <option key={item.value} value={item.value}>{({ "28": "Tighter", "32": "Balanced", "36": "Roomier" } as Record<string, string>)[item.value] ?? item.label}</option>)}
          </Select>
          <div className="qk-fields__toggles" role="group" aria-label="Shape">
            <Button variant="outline" tone="neutral" iconOnly aria-label="Pill corners" aria-pressed={pill} icon={<EllipseIcon />} onClick={() => put("radius", pill ? defaultOf("radius") : "pill")} />
            <Button variant="outline" tone="neutral" iconOnly aria-label="Sharp corners" aria-pressed={values.radius === "0"} icon={<RectangleIcon />} onClick={() => put("radius", values.radius === "0" ? defaultOf("radius") : "0")} />
          </div>
        </div>
      </Approval>
    </VisualQuestion>
  );
}

/**
 * Several questions at once (owner, 2026-11-04: "look at how cursor shows questions and also shows multiple questions at
 * once"; docs/research/chat-kit-2026-11-02/questions.md § 1, Cursor's IDE pane): one card holds them all, numbered, each
 * a plain question (Approval `variant="plain"`) with its filled answers and its own "Something else" and Skip; the head
 * says how many are answered; Continue waits until each is answered or skipped. One frame shows every answer together;
 * the answer under the pointer is drawn in it first.
 */
const SET = [
  { id: "density", title: "How much room between things?", columns: 3, items: [["28", "Tighter"], ["32", "Balanced"], ["36", "Roomier"]], set: (v: string) => ({ density: v }) },
  { id: "accent", title: "Which color should actions be?", columns: 2, items: [["blue", "Blue"], ["teal", "Teal"], ["purple", "Purple"], ["orange", "Orange"]], set: (v: string) => ({ accent: v, action: "accent", selection: "accent" }) },
  { id: "radius", title: "How round should corners be?", columns: 2, items: [["0", "Square"], ["6", "Soft"], ["12", "Round"], ["pill", "Pill"]], set: (v: string) => ({ radius: v }) },
] as const;
export function SetQuestion({ onDone }: QuestionProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [active, setActive] = useState<{ id: string; value: string } | null>(null);
  const shown = Object.assign({}, ...SET.map(q => {
    const value = active?.id === q.id ? active.value : answers[q.id];
    return value && value !== "skip" && value !== "words" ? q.set(value) : {};
  })) as Changes;
  const done = SET.filter(q => answers[q.id]).length;
  return (
    <VisualQuestion frame={<QuestionFrame name="Workspace, the form" shown={shown} focus="form" />}>
      <section className="qk-set" aria-label="Questions" {...STROKE}>
        <div className="qk-set__head">
          <span className="qk-set__title">Questions</span>
          <span className="qk-set__count">{done} of {SET.length} answered</span>
          <Button variant="ghost" tone="neutral" size="sm" iconOnly aria-label="Close questions" icon={<DismissIcon />} />
        </div>
        <div className="qk-set__list">
          {SET.map((q, index) => (
            <Approval key={q.id} variant="plain" className="qk-choices qk-choices--words" title={`${index + 1}. ${q.title}`}
              items={q.items.map(([value, label]) => ({ value, label: isDefault(label, value === defaultOf(q.id as Axis)) }))}
              value={answers[q.id]} onActiveChange={value => setActive(value === undefined ? null : { id: q.id, value })}
              onChoose={value => setAnswers(current => ({ ...current, [q.id]: value }))}
              onInstead={() => setAnswers(current => ({ ...current, [q.id]: "words" }))} insteadPlaceholder="Something else"
              onDismiss={() => setAnswers(current => ({ ...current, [q.id]: "skip" }))} dismissLabel="skip" />
          ))}
        </div>
        <div className="qk-set__foot">
          <Button size="sm" variant="ghost" tone="neutral" onClick={() => onDone?.()}>Skip all</Button>
          <Button size="sm" disabled={done < SET.length} onClick={() => onDone?.()}>Continue</Button>
        </div>
      </section>
    </VisualQuestion>
  );
}

/** The setting questions as one run, in the order a system is built: one at a time, a pick moving on. */
export const SETTING_QUESTIONS = [ScreenKindQuestion, WhereQuestion, RoomQuestion, CornersQuestion, ShadowQuestion, AccentQuestion, TypefaceQuestion, FineTuneQuestion] as const;
export function QuestionRun({ questions = SETTING_QUESTIONS }: { questions?: ReadonlyArray<(props: QuestionProps) => ReactNode> }) {
  const [at, setAt] = useState(0);
  const Question = questions[at]!;
  const place: Place = { at, count: questions.length, go: setAt };
  return <Question key={at} place={place} onDone={() => setAt(current => Math.min(questions.length - 1, current + 1))} />;
}

/* --- Feedback on what was made -------------------------------------------------------------------------------------- */

/** What next: a decision between a few actions, in words, a line each (the owner's first reference). */
export function NextStepQuestion(props: QuestionProps) {
  return (
    <ChoiceQuestion {...props} name="Workspace" title="What would you like to do next?"
      items={[
        { value: "use", label: noted("Use this design", "Recommended"), description: "Keep it as the system's theme", set: {} },
        { value: "change", label: "Change a few things", description: "A few questions about what's off", set: {} },
        { value: "another", label: "Try another direction", description: "Start again from a different look", set: { neutral: "warm", radius: "14", density: "36" } },
      ]} />
  );
}

/** Two directions side by side: the easiest judgement is between two. */
const DIRECTIONS: Record<"a" | "b", Changes> = {
  a: { radius: "6", density: "28", "layers-light": "0", accent: "blue" },
  b: { radius: "14", density: "36", "layers-light": "40", neutral: "warm", accent: "teal", action: "accent" },
};
export function CompareQuestion(props: QuestionProps) {
  const [value, setValue] = useState<string | undefined>();
  const [active, setActive] = useState<string | undefined>();
  const lit = active ?? value;
  return (
    <VisualQuestion frame={<QuestionFrame name="Two directions" shown={{}} before={false} visual={scopeOf => (
      <div className="qk-compare">
        {(["a", "b"] as const).map(side => (
          <figure key={side} className="qk-compare__side" data-lit={lit === side || lit === "both" ? "" : undefined} data-dim={lit === "neither" ? "" : undefined}>
            <ScreenFigure className="qk-compare__screen" hold={SHOWCASE} scope={scopeOf(DIRECTIONS[side])} />
            <figcaption className="qk-compare__name">{side.toUpperCase()}</figcaption>
          </figure>
        ))}
      </div>
    )} />}>
      <Approval title="Which direction is closer?" className="qk-choices qk-choices--words"
        items={[{ value: "a", label: "A" }, { value: "b", label: "B" }, { value: "both", label: "Both work" }, { value: "neither", label: "Neither" }]}
        value={value} onActiveChange={setActive} onChoose={next => { setValue(next); props.onDone?.(); }}
        {...inWords(props.onDone)} insteadPlaceholder="What would make it closer?" actions={headActions(props.place)} />
    </VisualQuestion>
  );
}

/** How close: an opinion, so named points in a row, never a bar. */
export function HowCloseQuestion(props: QuestionProps) {
  return (
    <ChoiceQuestion {...props} name="Workspace" title="How close is this to what you had in mind?"
      items={[{ value: "far", label: "Not yet", set: {} }, { value: "close", label: "Close", set: {} }, { value: "there", label: "That's it", set: {} }]} />
  );
}

/** What's off: several at once, so chips, each drawn in the frame as it is pressed; opposites give way to each other. */
const FIXES: ReadonlyArray<{ id: string; label: string; set: Changes; not?: string }> = [
  { id: "roomier", label: "More room", set: { density: "36" }, not: "tighter" },
  { id: "tighter", label: "Less room", set: { density: "28" }, not: "roomier" },
  { id: "larger", label: "Larger text", set: { type: "15" } },
  { id: "rounder", label: "Rounder corners", set: { radius: "14" }, not: "sharper" },
  { id: "sharper", label: "Sharper corners", set: { radius: "4" }, not: "rounder" },
  { id: "warmer", label: "Warmer greys", set: { neutral: "warm" } },
  { id: "color", label: "More color", set: { action: "accent", selection: "accent" } },
  { id: "flatter", label: "Flatter", set: { elevation: "1" } },
  { id: "contrast", label: "More contrast", set: { contrast: "more" } },
];
export function WhatsOffQuestion({ place, onDone }: QuestionProps) {
  const [on, setOn] = useState<string[]>([]);
  const changes = Object.assign({}, ...FIXES.filter(fix => on.includes(fix.id)).map(fix => fix.set)) as Changes;
  const toggle = (id: string) => setOn(current => current.includes(id) ? current.filter(entry => entry !== id) : [...current.filter(entry => entry !== FIXES.find(fix => fix.id === id)?.not), id]);
  return (
    <VisualQuestion frame={<QuestionFrame name="Workspace" shown={changes} />}>
      <Approval title="What should change?" description="Pick any; the frame shows them together." items={[]} onChoose={() => {}}
        {...inWords(onDone)} actions={headActions(place)}
        footer={<>
          <Button size="sm" variant="ghost" tone="neutral" disabled={!on.length} onClick={() => setOn([])}>Clear</Button>
          <Button size="sm" disabled={!on.length} onClick={() => onDone?.()}>{on.length ? `Apply ${on.length} ${on.length === 1 ? "change" : "changes"}` : "Apply"}</Button>
        </>}>
        <ChipGroup aria-label="Changes" className="qk-chips">
          {FIXES.map(fix => <Chip key={fix.id} size="sm" selected={on.includes(fix.id)} onSelectedChange={() => toggle(fix.id)}>{fix.label}</Chip>)}
        </ChipGroup>
      </Approval>
    </VisualQuestion>
  );
}


/** Every template, named, for a kit's sections. */
export const QUESTION_TEMPLATES: ReadonlyArray<{ id: string; title: string; kind: string; Question: (props: QuestionProps) => ReactNode }> = [
  { id: "next", title: "Next step", kind: "Recommended", Question: NextStepQuestion },
  { id: "where", title: "Where it's used", kind: "No frame", Question: WhereQuestion },
  { id: "room", title: "Room", kind: "Default", Question: RoomQuestion },
  { id: "close", title: "How close", kind: "Words", Question: HowCloseQuestion },
  { id: "screen", title: "Screen kind", kind: "Pictures", Question: ScreenKindQuestion },
  { id: "corners", title: "Corners", kind: "Pictures", Question: CornersQuestion },
  { id: "typeface", title: "Typeface", kind: "Specimens", Question: TypefaceQuestion },
  { id: "compare", title: "A or B", kind: "Compare", Question: CompareQuestion },
  { id: "shadow", title: "Shadows", kind: "Bar", Question: ShadowQuestion },
  { id: "fine-tune", title: "Fine-tune", kind: "Bars", Question: FineTuneQuestion },
  { id: "fields", title: "Exact values", kind: "Fields", Question: FieldsQuestion },
  { id: "set", title: "Several at once", kind: "Set", Question: SetQuestion },
  { id: "accent", title: "Accent", kind: "Swatches", Question: AccentQuestion },
  { id: "off", title: "What's off", kind: "Chips", Question: WhatsOffQuestion },
];

/** A variation in a kit's section: the unit, its name and kind under it as every feed card's (PRODUCT_UI, "The card,
 *  as picked": 4 under, the name on the text edge at 13/18, a value as a neutral badge at the end). */
export function QuestionVariant({ title, kind, children }: { title: string; kind: string; children: ReactNode }) {
  return (
    <figure className="qk-variant">
      {children}
      <figcaption className="qk-variant__caption"><span className="qk-variant__name">{title}</span><Badge variant="soft" tone="neutral">{kind}</Badge></figcaption>
    </figure>
  );
}
