/**
 * The Theme tab's Setup: building a design system as a conversation (owner, 2026-10-24: "a 2 panel view with 1 side being a
 * vertically scrolling chat like experience that reads like a simple questionaire ... and then visuals on the right side";
 * "dont need all these panels open").
 *
 *   chat    the questions as a thread: each arrives as a message with what it changes and its choices inline (cards that
 *           picture each choice, a bar, a toggle, swatches); once answered it stays as the person's reply, which reopens
 *           the question when selected; chapters are dividers; the dock at the foot holds progress, Back and Continue
 *   visuals the product screen (setup-screen.tsx) in the theme so far, alone on a backdrop that stands off any page; the
 *           parts a question changes are marked, and a choice under the pointer is drawn before it is picked
 *
 * The Sidebar and the Inspector are left out (Workspace `panels={false}`); Fine-tune hands over to Browse and the Inspector.
 * Pacing: Essentials asks the fourteen that change the most; Every detail asks every setting, chapter by chapter in the
 * order a system is built (setup-questions.ts), skipping what the answers so far make moot, and any chapter on request.
 * Every answer is an Inspector setting. Setup's own UI stays at the app's defaults (Workspace `canvasPicks={false}`); only
 * the visuals and the choices' pictures take the picks.
 */
import { AddIcon, ArrowLeftIcon, CopyIcon, InfoIcon, ResetIcon } from "@area/icons";
import { Button, Checkbox, CheckboxGroup, ColorSwatchPicker, Message, Radio, RadioGroup, Segmented, Select, Slider, Switch, ZoomControl } from "@area/react";
import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from "react";
import { LoopingPress } from "../abstract.tsx";
import { CopyButton } from "../copy.tsx";
import { GALLERY_CONTROLS } from "../gallery/controls.ts";
import { hueName, SettingRow } from "../inspector-rows.tsx";
import { REGION_LABEL, SCREENS, ScreenFigure, type Region, type RegionBox, type ScreenId } from "../setup-screen.tsx";
import { canvasAttributes, CANVAS_DEFAULTS, useStudio, Workspace } from "../studio.tsx";
import { AXES } from "../tokens.ts";
import { useViewOption, ViewControls } from "../view-controls.tsx";
import { CHAPTERS, minutesFor, QUESTIONS, type Axis, type Choice, type Question, type Values, type Visual } from "./setup-questions.ts";
import { attributeOf, SETTINGS, type Mode } from "./theme-settings.ts";

export interface ThemeSetupProps {
  mode: Mode;
  setMode: (mode: Mode) => void;
  /** The Setup / Browse switch, first in the Canvas header. */
  flowSwitch: ReactNode;
  /** Hands over to Browse, the Inspector open on Theme (Fine-tune). */
  onBrowse: () => void;
}

type Path = "essentials" | "complete";
type Changes = Partial<Record<Axis, string>>;

const controlOf = (axis: string) => GALLERY_CONTROLS.find(entry => entry.axis === axis);
const say = (axis: string, value: string) => controlOf(axis)?.items.find(item => item.value === value)?.label ?? value;
const defaultOf = (axis: Axis) => controlOf(axis)?.defaultValue ?? (CANVAS_DEFAULTS as Record<string, string>)[axis] ?? "";
const matches = (values: Values, set: Changes) => Object.entries(set).every(([axis, value]) => values[axis as Axis] === value);
const isDefaultChoice = (choice: Choice) => Object.entries(choice.set).every(([axis, value]) => defaultOf(axis as Axis) === value);
/** The palette's accent colour per named accent, the registry's 500 step at full strength. */
const accentHex = (id: string) => AXES.find(axis => axis.id === "accent")?.presets.find(preset => preset.id === id)?.tokens["--area-accent-500-full"] ?? id;
const NAMED_ACCENTS = (controlOf("accent")?.items ?? []).filter(item => !/^\d+$/.test(item.value));
const HUES = Array.from({ length: 72 }, (_, step) => String(step * 5));
/** Tint colours to start from, by hue (inspector-rows.tsx's TINTS without Accent), drawn at a mid lightness. */
const TINTS: ReadonlyArray<[string, string]> = [["30", "Red"], ["55", "Orange"], ["95", "Yellow"], ["145", "Green"], ["185", "Teal"], ["255", "Blue"], ["300", "Purple"], ["350", "Pink"]];
const hueSwatch = (hue: string) => `oklch(0.66 0.14 ${hue})`;

/** What a question is set to, in its own words: the choice it matches, else the setting's value. */
function answerOf(question: Question, values: Values): string {
  const control = question.control;
  if (control.kind === "cards") { const choice = control.choices.find(entry => matches(values, entry.set)); if (choice) return choice.label; }
  if (control.kind === "accent") return /^\d+$/.test(values.accent) ? `${hueName(Number(values.accent))} · ${values.accent}°` : say("accent", values.accent);
  if (control.kind === "tint") return `${hueName(Number(values["tint-hue"]))} · ${values["tint-hue"]}°`;
  if (control.kind === "pills") { const count = values.pills.split(" ").filter(Boolean).length; return count ? `${count} parts` : "None"; }
  if (control.kind === "toggle") return values[control.axis] === control.off ? "Off" : say(control.axis, values[control.axis]);
  const axis = question.axes[0]!;
  return say(axis, values[axis]);
}
const focusOf = (question: Question, values: Values): Region[] => typeof question.focus === "function" ? question.focus(values) : question.focus;
const atDefault = (question: Question, values: Values) => question.axes.every(axis => values[axis] === defaultOf(axis));
/** A reply the person can select to change, as a button is: Enter or Space. */
const activate = (go: () => void) => ({
  role: "button", tabIndex: 0, onClick: go,
  onKeyDown: (event: KeyboardEvent) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); go(); } },
});

export function ThemeSetup({ mode, setMode, flowSwitch, onBrowse }: ThemeSetupProps) {
  const { item, select, canvas, setCanvas, shown, setInspectorView, showInspector } = useStudio();
  const [path, setPath] = useViewOption<Path>("theme-setup-path", "essentials", ["essentials", "complete"]);
  // A choice under the pointer, drawn on the visuals before it is picked (the finder's preview).
  const [preview, setPreview] = useState<{ set: Changes; label: string } | null>(null);
  const values = canvas as Values;

  // The questions on this path that can change something under the answers so far.
  const asked = QUESTIONS.filter(question => (path === "complete" || question.essential) && (!question.when || question.when(values)));
  // Where the conversation is: the welcome (""), a question, or the review. A question the answers have made moot gives
  // way to the next one asked.
  const lost = item && item !== "review" && !asked.some(entry => entry.id === item) ? QUESTIONS.findIndex(entry => entry.id === item) : -1;
  const question = asked.find(entry => entry.id === item) ?? (lost >= 0 ? asked.find(entry => QUESTIONS.indexOf(entry) > lost) : undefined);
  const reviewing = item === "review" || (lost >= 0 && !question);
  const at = question ? asked.indexOf(question) : reviewing ? asked.length : -1;
  // How far the thread reaches: every question up to the furthest one asked stays in it, answered.
  const [reach, setReach] = useState(at);
  useEffect(() => { if (at > reach) setReach(at); }, [at]);
  const shownUpTo = Math.max(reach, at);
  const chapter = question ? CHAPTERS.find(entry => entry.id === question.chapter)! : null;

  const go = (target: number) => {
    setPreview(null);
    select(target < 0 ? "" : target >= asked.length ? "review" : asked[target]!.id);
  };
  const next = () => go(at + 1);
  const back = () => go(at - 1);
  const skipChapter = () => {
    const opening = asked.findIndex((entry, index) => index > at && entry.chapter !== question?.chapter);
    go(opening < 0 ? asked.length : opening);
  };

  // A question asked in one mode turns the visuals to it (light/dark pairs are set one mode at a time).
  const stepMode = question?.mode;
  useEffect(() => { if (stepMode && stepMode !== mode) setMode(stepMode); }, [question?.id]);
  const stageMode = stepMode ?? mode;

  const set = (changes: Changes) => { for (const [axis, value] of Object.entries(changes)) setCanvas(axis as Axis, value!); };
  // The pictures and the visuals draw the choices at a steady pace (owner, 2026-10-24: "the smoothness of the sliders is
  // not very smooth"): restyling a themed screen costs about 60ms, so while a bar is dragged the screens take the first
  // step at once, then one every 180ms and the last, and the bar itself follows the pointer on every frame.
  const drawn = useThrottled(shown, 180);
  const scopeOf = (extra: Changes = {}) => {
    const attributes = canvasAttributes({ ...drawn.canvas, ...extra } as typeof drawn.canvas, drawn.material) as Record<string, string | undefined>;
    return { ...attributes, "data-area-theme": stageMode };
  };
  const answered = asked.filter(entry => !atDefault(entry, values)).length;
  const changed = SETTINGS.filter(entry => entry.id !== "theme" && (values as Record<string, string>)[entry.id] !== undefined && (values as Record<string, string>)[entry.id] !== defaultOf(entry.id as Axis)).length;
  const fineTune = () => { setInspectorView("theme"); showInspector(); onBrowse(); };
  const restart = () => set(Object.fromEntries(Object.entries(CANVAS_DEFAULTS)) as Changes);

  // The thread follows the conversation: the question being asked scrolls to the top of the chat, smoothly unless the
  // person has asked for reduced motion (the app's own Speed decides, as everywhere in Setup).
  const thread = useRef<HTMLDivElement>(null);
  const mounted = useRef(false);
  useLayoutEffect(() => {
    const host = thread.current;
    const target = host?.querySelector<HTMLElement>("[data-current]");
    if (!host || !target) return;
    const still = !mounted.current || !(parseFloat(getComputedStyle(host).getPropertyValue("--area-duration-base")) > 0);
    mounted.current = true;
    host.scrollTo({ top: target.offsetTop - 24, behavior: still ? "auto" : "smooth" });
  }, [item, path]);

  const paths = { essentials: QUESTIONS.filter(entry => entry.essential && (!entry.when || entry.when(values))).length, complete: QUESTIONS.filter(entry => !entry.when || entry.when(values)).length };
  const pathLabel = (choice: Path) => `${choice === "essentials" ? "Essentials" : "Every detail"} · ${paths[choice]} questions`;

  // ——— The chat ———
  const welcome = (
    <div className="setup-chat__turn" data-current={at < 0 ? "" : undefined} key="welcome">
      <Message author="assistant" authorName="Setup">
        <p className="setup-chat__question">Let's build your design system.</p>
        <p className="setup-chat__lede">Pick what looks right; the screen on the right shows each choice before you make it. Every answer is a setting you can fine-tune later.</p>
      </Message>
      {at < 0 ? (
        <div className="setup-chat__answer-area">
          <RadioGroup label="How thorough" className="setup-choices" value={path} onValueChange={choice => setPath(choice as Path)}>
            <Radio variant="card" value="essentials" label={pathLabel("essentials")} caption={`About ${minutesFor(paths.essentials)} minutes, the choices that change the most`} />
            <Radio variant="card" value="complete" label={pathLabel("complete")} caption={`About ${minutesFor(paths.complete)} minutes, every setting`} />
          </RadioGroup>
          {changed ? (
            <p className="setup-step__note"><InfoIcon /><span>Starting from your {changed} changed settings. <button type="button" className="setup__link" onClick={restart}>Start from the defaults</button></span></p>
          ) : null}
        </div>
      ) : (
        <div className="setup-chat__reply" {...activate(() => go(-1))} aria-label={`Change: ${pathLabel(path)}`}>
          <Message author="user">{pathLabel(path)}</Message>
        </div>
      )}
    </div>
  );
  const turns = asked.slice(0, Math.min(shownUpTo, asked.length - 1) + 1).map((entry, index) => {
    const current = index === at;
    const opens = index === 0 || asked[index - 1]!.chapter !== entry.chapter;
    const section = CHAPTERS.find(row => row.id === entry.chapter)!;
    const context = current ? entry.context?.(values) : null;
    return (
      <div key={entry.id} className="setup-chat__turn" data-current={current ? "" : undefined}>
        {opens ? (
          <div className="setup-chat__chapter">
            <span className="setup-chat__chapter-name">{section.title}</span>
            <span className="setup-chat__chapter-lede">{section.lede}</span>
          </div>
        ) : null}
        <Message author="assistant" authorName="Setup">
          <p className="setup-chat__question">{entry.question}</p>
          <p className="setup-chat__lede">{entry.description}</p>
        </Message>
        {current ? (
          <div className="setup-chat__answer-area">
            <QuestionControl question={entry} values={values} mode={stageMode} set={set} scopeOf={scopeOf} onPreview={setPreview} />
            {entry.note ? <p className="setup-step__note"><InfoIcon /><span>{entry.note}</span></p> : null}
            {context ? <p className="setup-step__note setup-step__note--context"><InfoIcon /><span>{context.note} <button type="button" className="setup__link" onClick={() => set(context.set)}>{context.action}</button></span></p> : null}
          </div>
        ) : (
          <div className="setup-chat__reply" {...activate(() => go(index))} aria-label={`Change ${entry.name}: ${answerOf(entry, values)}`}>
            <Message author="user">{answerOf(entry, values)}</Message>
          </div>
        )}
      </div>
    );
  });
  const review = reviewing || reach >= asked.length ? (
    <div className="setup-chat__turn" data-current={reviewing ? "" : undefined} key="review">
      <Message author="assistant" authorName="Setup">
        <p className="setup-chat__question">Here's your design system.</p>
        <p className="setup-chat__lede">{answered ? `${answered} answers differ from Area's defaults, in bold.` : "Every answer is Area's default."} Select any answer above to change it, or fine-tune every setting in the Inspector.</p>
      </Message>
      <dl className="setup-review__rows setup-chat__summary">
        {asked.map(row => (
          <div key={row.id} className="setup-review__row">
            <dt><button type="button" className="setup__link" onClick={() => go(asked.indexOf(row))}>{row.name}</button></dt>
            <dd className={atDefault(row, values) ? "setup-review__default" : "setup-review__changed"}>{answerOf(row, values)}</dd>
          </div>
        ))}
      </dl>
    </div>
  ) : null;

  // The dock: where the conversation stands and the way on.
  const chapters = CHAPTERS.filter(entry => asked.some(row => row.chapter === entry.id));
  const dock = (
    <div className="setup-chat__dock">
      {at >= 0 ? (
        <div className="setup-progress">
          <div className="setup-progress__chapters" aria-hidden="true">
            {chapters.map(entry => {
              const rows = asked.filter(row => row.chapter === entry.id);
              const fill = rows.filter(row => asked.indexOf(row) < at).length / rows.length;
              return <i key={entry.id} className="setup-progress__chapter" data-current={entry.id === chapter?.id ? "" : undefined} style={{ "--setup-progress-fill": fill } as CSSProperties} />;
            })}
          </div>
          <span className="setup-progress__label">{reviewing ? `${asked.length} questions answered` : `${chapter!.title} · ${at + 1} of ${asked.length}`}</span>
          {reviewing ? null : <span className="setup-progress__time">About {minutesFor(asked.length - at)} min left</span>}
        </div>
      ) : null}
      <div className="setup-foot">
        {at < 0 ? <>
          <Button variant="ghost" tone="neutral" onClick={fineTune}>Open the Inspector</Button>
          <span className="setup-foot__grow" />
          <Button size="lg" onClick={next}>Start</Button>
        </> : reviewing ? <>
          <Button variant="ghost" tone="neutral" iconOnly aria-label="Back" icon={<ArrowLeftIcon />} onClick={back} />
          <CopyButton label="Copy theme" icon={<CopyIcon />} value={() => SETTINGS.filter(entry => entry.id !== "theme" && !(entry.id === "contrast" && values.contrast === "system"))
            .map(entry => attributeOf(entry, (values as Record<string, string>)[entry.id]!)).join(" ")} />
          <span className="setup-foot__grow" />
          {path === "essentials" ? <Button variant="outline" tone="neutral" onClick={() => { setPath("complete"); go(asked.length); }}>Every detail</Button> : null}
          <Button size="lg" onClick={fineTune}>Fine-tune</Button>
        </> : <>
          <Button variant="ghost" tone="neutral" iconOnly aria-label="Back" icon={<ArrowLeftIcon />} onClick={back} />
          <Button variant="ghost" tone="neutral" icon={<ResetIcon />} disabled={!question || atDefault(question, values)} onClick={() => question && set(Object.fromEntries(question.axes.map(axis => [axis, defaultOf(axis)])))}>Default</Button>
          <span className="setup-foot__grow" />
          {path === "complete" && asked[at + 1]?.chapter === question?.chapter ? <Button variant="ghost" tone="neutral" onClick={skipChapter}>Skip chapter</Button> : null}
          {/* A reopened answer returns to where the conversation had reached, as an edited message does. */}
          {at < reach ? <Button size="lg" onClick={() => go(reach)}>Done</Button> : <Button size="lg" onClick={next}>{at + 1 >= asked.length ? "Review" : "Continue"}</Button>}
        </>}
      </div>
    </div>
  );

  // ——— The visuals ———
  // What the visuals show (owner, 2026-10-24: "controls ... that allow you to change views, zoom in and out, change to a
  // different product ui, change to an isolated view of a component example"): a product screen, or the part the
  // question is about on its own; real text or a wireframe; at a fitted size or a chosen zoom, which centres on the part.
  const [show, setShow] = useViewOption<"screen" | "part">("theme-setup-show", "screen", ["screen", "part"]);
  const [screen, setScreen] = useViewOption<ScreenId>("theme-setup-screen", "workspace", Object.keys(SCREENS) as ScreenId[]);
  const [drawing, setDrawing] = useViewOption<"real" | "wireframe">("theme-setup-drawing", "real", ["real", "wireframe"]);
  const [scale, setScale] = useState<number | null>(null);
  const [fitted, setFitted] = useState(1);
  const focus: Region[] = preview || !question || screen !== "workspace" || show === "part" ? [] : focusOf(question, values);
  const [boxes, setBoxes] = useState<RegionBox[]>([]);
  // The part on its own: the question's close-up region (or the first part it changes), whole and as large as it fits.
  const visual = question?.control.kind === "cards" || question?.control.kind === "accent" || question?.control.kind === "tint" || question?.control.kind === "toggle" ? question.control.visual : undefined;
  const part: Region = visual?.kind === "crop" ? visual.region : (question && focusOf(question, values)[0]) || "form";
  const fidelity = drawing === "wireframe" ? "bars" : "real";
  const view = show === "part" ? { region: part, zoom: scale ?? 2.5 } : scale ? { scale, focus: question ? focusOf(question, values)[0] : undefined } : {};
  const stage = (
    <section className="setup-stage" aria-label="Preview">
      <div className="setup-stage__bar">
        <Segmented size="sm" aria-label="Show" value={show} onValueChange={next => { setShow(next as "screen" | "part"); setScale(null); }}
          items={[{ value: "screen", label: "Screen" }, { value: "part", label: "Component" }]} />
        {show === "screen" ? (
          <Select size="sm" aria-label="Product" value={screen} onChange={event => { setScreen(event.currentTarget.value as ScreenId); setScale(null); }}>
            {(Object.keys(SCREENS) as ScreenId[]).map(id => <option key={id} value={id}>{SCREENS[id].label}</option>)}
          </Select>
        ) : null}
        <span className="setup-foot__grow" />
        <Segmented size="sm" aria-label="Drawing" value={drawing} onValueChange={next => setDrawing(next as "real" | "wireframe")}
          items={[{ value: "real", label: "Real" }, { value: "wireframe", label: "Wireframe" }]} />
        <Segmented size="sm" aria-label="Preview mode" value={mode} onValueChange={next => setMode(next as Mode)} items={[{ value: "light", label: "Light" }, { value: "dark", label: "Dark" }]} />
      </div>
      <div className="setup-stage__view">
        {show === "part" && visual && visual.kind !== "crop" ? (
          <div className="setup-stage__part"><Picture question={question!} values={values} mode={stageMode} set={set} scopeOf={scopeOf} onPreview={setPreview} visual={visual} changes={preview?.set} className="setup-picture--stage" /></div>
        ) : (
          <ScreenFigure className="setup-stage__screen" screen={show === "part" ? "workspace" : screen} crossfade scope={scopeOf(preview?.set)} hold={question?.hold ?? []}
            fidelity={fidelity} view={view} measure={focus} onMeasure={setBoxes} onFit={setFitted} isolate={show === "part"} />
        )}
        <div className="setup-stage__marks" aria-hidden="true" key={question?.id ?? (reviewing ? "review" : "welcome")}>
          {focus.length ? boxes.map((box, index) => (
            <span key={box.region} className="setup-stage__mark" style={{ left: box.x, top: box.y, width: box.w, height: box.h, animationDelay: `${index * 60}ms` }} />
          )) : null}
        </div>
        {preview ? <span className="setup-stage__preview">Previewing {preview.label}</span> : null}
      </div>
      <div className="setup-stage__bar setup-stage__bar--foot">
        <span className="setup-stage__caption">{show === "part" ? `${REGION_LABEL[part]}, on its own` : `${SCREENS[screen].label}${screen === "workspace" && focus.length ? " · marked: what this question changes" : ""}`}</span>
        <span className="setup-foot__grow" />
        <ZoomControl stepper size="sm" value={scale ?? fitted} min={0.25} max={4} onValueChange={next => setScale(next)} onZoomToFit={() => setScale(null)} aria-label="Zoom" />
      </div>
    </section>
  );

  return (
    <Workspace
      panels={false}
      sidebar={null}
      canvasTitle={question ? question.name : reviewing ? "Your design system" : "Build your design system"}
      canvasPicks={false}
      // The chat is read, so it takes the default scale (type 14, Default room), not the app's compact chrome: a choice
      // card's inset is 12 there (choice.css), 8 at compact.
      canvasScope={{ "data-area-type": "14", "data-area-density": "32" }}
      canvasActions={
        <ViewControls>{flowSwitch}</ViewControls>
      }
      canvas={
        <div className="setup"><div className="setup__layout">
          <section className="setup-chat" aria-label="Setup">
            <div className="setup-chat__thread" ref={thread}>
              {welcome}
              {at >= 0 || reach >= 0 ? turns : null}
              {review}
              <div className="setup-chat__end" aria-hidden="true" />
            </div>
            {dock}
          </section>
          {stage}
        </div></div>
      }
      inspector={{}}
    />
  );
}

/** `value` at most every `wait` ms: the first change at once, then the latest each `wait`, and always the last. */
function useThrottled<T>(value: T, wait: number): T {
  const [shown, setShown] = useState(value);
  const last = useRef(0);
  useEffect(() => {
    const due = last.current + wait - performance.now();
    if (due <= 0) { last.current = performance.now(); setShown(value); return; }
    const timer = setTimeout(() => { last.current = performance.now(); setShown(value); }, due);
    return () => clearTimeout(timer);
  }, [value, wait]);
  return shown;
}

interface ControlProps {
  question: Question;
  values: Values;
  mode: Mode;
  set: (changes: Changes) => void;
  scopeOf: (extra?: Changes) => Record<string, string | undefined>;
  onPreview: (preview: { set: Changes; label: string } | null) => void;
}

/** A question's control, by kind. */
function QuestionControl(props: ControlProps) {
  const { question, values, set } = props;
  const control = question.control;
  switch (control.kind) {
    case "cards": return <>
      <ChoiceCards {...props} choices={control.choices} visual={control.visual} />
      {control.fine ? <Fine {...props} axis={control.fine} /> : null}
    </>;
    case "slider": return <SliderControl {...props} axis={control.axis} also={control.also ?? []} low={control.low} high={control.high} marks={control.marks ?? []} />;
    case "toggle": {
      const on = values[control.axis] !== control.off;
      const scale = (controlOf(control.axis)?.scale ?? []).filter(value => value !== control.off);
      const at = Math.max(0, scale.indexOf(values[control.axis]));
      const put = (value: string) => set(Object.fromEntries([control.axis, ...(control.also ?? [])].map(axis => [axis, value])));
      return (
        <div className="setup-control">
          {control.visual ? <Picture {...props} visual={control.visual} className="setup-picture--large" /> : null}
          <Switch size="lg" label={control.label} checked={on} onCheckedChange={checked => put(checked ? control.on : control.off)} />
          {on ? (
            <div className="setup-control__bar">
              <Slider labelPosition="inside" size="lg" label="How much" min={0} max={scale.length - 1} step={1} value={at}
                readout={(index: number) => say(control.axis, scale[index]!)} onValueChange={index => put(scale[index]!)} />
              <div className="setup-control__ends"><span>{control.low}</span><span>{control.high}</span></div>
            </div>
          ) : null}
        </div>
      );
    }
    case "accent": return <AccentControl {...props} visual={control.visual} />;
    case "tint": return <TintControl {...props} visual={control.visual} />;
    case "pills": return <PillCards {...props} />;
  }
}

/**
 * Choices as cards (owner, 2026-10-24: "make the choice cards less busy overall, less text overall, more simple and
 * visual choice based"): each card is its picture under that choice and a one- or two-word name, nothing else. What a
 * choice is for, and whether it is Area's default, is one line under the cards, for the choice under the pointer or the
 * one picked, so the words are read once rather than on every card. The choice under the pointer is drawn on the stage
 * before it is picked.
 */
function ChoiceCards({ question, values, set, scopeOf, onPreview, choices, visual, mode }: ControlProps & { choices: Choice[]; visual: Visual }) {
  const selected = choices.findIndex(choice => matches(values, choice.set));
  const [hovered, setHovered] = useState<number | null>(null);
  const hover = (at: number | null) => {
    if (hovered === at) return;
    setHovered(at);
    onPreview(at === null || at === selected ? null : { set: choices[at]!.set, label: choices[at]!.label });
  };
  const shown = choices[hovered ?? selected];
  // Two columns of pictures; three choices take a wide row each, so none leaves a hole and each picture shows more.
  const columns = choices.length === 3 ? 1 : 2;
  return (
    <div className="setup-choices__group">
      <RadioGroup label={question.name} className="setup-choices" value={selected >= 0 ? String(selected) : ""}
        style={{ "--area-choice-ratio": columns === 1 ? "5 / 2" : visual.kind === "crop" && visual.region === "form" ? "4 / 3" : "16 / 10", "--area-choice-min": `calc((100% - ${columns - 1} * var(--area-space-8)) / ${columns} - 0.5px)` } as CSSProperties}
        onValueChange={next => { onPreview(null); setHovered(null); set(choices[Number(next)]!.set); }}
        onPointerOver={event => { const input = (event.target as HTMLElement).closest(".area-radio")?.querySelector<HTMLInputElement>(":scope > .area-radio__control"); hover(input ? Number(input.value) : null); }}
        onPointerLeave={() => hover(null)}>
        {choices.map((choice, at) => (
          <Radio key={choice.label} variant="card" layout="preview" value={String(at)} label={choice.label}
            leadingVisual={<Picture question={question} values={values} mode={mode} set={set} scopeOf={scopeOf} onPreview={onPreview} visual={visual} changes={choice.set} />} />
        ))}
      </RadioGroup>
      <p className="setup-choices__hint" aria-live="polite">
        {shown ? <span className="setup-choices__line" key={shown.label}><span className="setup-choices__name">{shown.label}</span>{shown.caption}{isDefaultChoice(shown) ? <span className="setup-choices__default">Default</span> : null}</span> : "\u00a0"}
      </p>
    </div>
  );
}

/** A choice's picture: the question's close-up of the screen under the choice, or the speed and curve as they move. */
function Picture({ visual, scopeOf, changes, className }: ControlProps & { visual: Visual; changes?: Changes; className?: string }) {
  const scope = scopeOf(changes);
  if (visual.kind === "crop") {
    return <ScreenFigure className={`setup-picture${className ? ` ${className}` : ""}`} scope={scope} hold={visual.hold ?? []} fidelity={visual.fidelity ?? "shapes"} view={{ region: visual.region, zoom: visual.zoom }} />;
  }
  return (
    <span className={`setup-picture setup-picture--motion${className ? ` ${className}` : ""}`} inert aria-hidden="true" {...scope}>
      {visual.kind === "easing" ? <Curve /> : null}
      <span className="setup-picture__switch">{visual.kind === "press" ? <LoopingPress icon={<AddIcon />} /> : <Looping />}</span>
    </span>
  );
}

/** A real Switch flipping on its own, so the speed and the curve play as they will in the product. */
function Looping() {
  const [on, setOn] = useState(false);
  useEffect(() => { const timer = setInterval(() => setOn(value => !value), 1400); return () => clearInterval(timer); }, []);
  return <Switch aria-label="Example" checked={on} onChange={() => {}} />;
}

/** The curve every transition follows (the scope's ease-in-out), drawn from 0 to 1 over time. */
function Curve() {
  const ref = useRef<SVGSVGElement>(null);
  const [path, setPath] = useState("");
  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    const ease = easeOf(getComputedStyle(element).getPropertyValue("--area-ease-in-out"));
    const points = Array.from({ length: 41 }, (_, at) => { const t = at / 40; return `${(4 + t * 112).toFixed(1)},${(52 - ease(t) * 40).toFixed(1)}`; });
    setPath(`M${points.join(" L")}`);
  });
  return (
    <svg ref={ref} className="setup-picture__curve" viewBox="0 0 120 60" aria-hidden="true">
      <line x1="4" y1="12" x2="116" y2="12" /><line x1="4" y1="52" x2="116" y2="52" />
      <path d={path} />
    </svg>
  );
}
/** cubic-bezier(…) as a function of time (the skill's engine/stage.js easeOf). */
function easeOf(text: string): (x: number) => number {
  const n = (text.match(/-?[\d.]+/g) ?? []).map(Number);
  if (!/cubic-bezier/.test(text) || n.length < 4) return x => x;
  const [x1, y1, x2, y2] = n as [number, number, number, number];
  const bezier = (t: number, a: number, b: number) => 3 * (1 - t) * (1 - t) * t * a + 3 * (1 - t) * t * t * b + t * t * t;
  return x => { let lo = 0, hi = 1; for (let i = 0; i < 30; i++) { const mid = (lo + hi) / 2; if (bezier(mid, x1, x2) < x) lo = mid; else hi = mid; } return bezier((lo + hi) / 2, y1, y2); };
}

/** The exact value under the cards: the Inspector's own row for the setting. */
function Fine({ axis, values, mode, set }: ControlProps & { axis: Axis }) {
  return (
    <details className="setup-fine">
      <summary className="setup-fine__summary">Exact value · {say(axis, values[axis])}</summary>
      <div className="setup-fine__body"><SettingRow axis={axis} context={{ values, mode, size: "md", set: changes => set(changes as Changes) }} /></div>
    </details>
  );
}

/** One large bar over an ordered setting, its named marks under it; the stage beside it is its picture. */
function SliderControl(props: ControlProps & { axis: Axis; also: Axis[]; low: string; high: string; marks: Array<{ value: string; label: string }> }) {
  const { axis, also, low, high, marks, values, set } = props;
  const control = controlOf(axis)!;
  const scale = control.scale ?? [];
  const value = values[axis];
  const at = Math.max(0, scale.indexOf(scale.includes(value) ? value : control.custom ?? scale[0]!));
  const put = (next: string) => set(Object.fromEntries([axis, ...also].map(entry => [entry, next])));
  return (
    <div className="setup-control">
      <Slider labelPosition="inside" size="lg" label={control.label} min={0} max={scale.length - 1} step={1} value={at}
        readout={(index: number) => scale.includes(value) || index !== at ? say(axis, scale[index]!) : say(axis, value)} onValueChange={index => put(scale[index]!)} />
      <div className="setup-control__ends"><span>{low}</span><span>{high}</span></div>
      {marks.length ? (
        <div className="setup-control__marks" role="group" aria-label="Presets">
          {marks.map(mark => (
            <Button key={mark.value} size="sm" variant={value === mark.value ? "soft" : "ghost"} tone="neutral" aria-pressed={value === mark.value} onClick={() => put(mark.value)}>
              {mark.label}
            </Button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

/** Accent: the palette's eleven as large swatches, or any hue on a bar. */
function AccentControl(props: ControlProps & { visual: Visual }) {
  const { values, set, visual } = props;
  const custom = /^\d+$/.test(values.accent);
  return (
    <div className="setup-control">
      <Picture {...props} visual={visual} className="setup-picture--large" />
      <Segmented size="md" fullWidth aria-label="Accent source" items={[{ value: "named", label: "Palette" }, { value: "custom", label: "Any hue" }]} value={custom ? "custom" : "named"}
        onValueChange={next => set({ accent: next === "custom" ? "200" : "blue" })} />
      {custom ? (
        <Slider labelPosition="inside" size="lg" label="Hue" min={0} max={HUES.length - 1} step={1} value={Math.max(0, HUES.indexOf(values.accent))}
          readout={(at: number) => `${hueName(Number(HUES[at]))} · ${HUES[at]}°`} onValueChange={at => set({ accent: HUES[at]! })} />
      ) : (
        <ColorSwatchPicker label="Accent" size="lg" layout="row" value={accentHex(values.accent)}
          items={NAMED_ACCENTS.map(item => ({ value: accentHex(item.value), label: item.label }))}
          onValueChange={hex => { const item = NAMED_ACCENTS.find(entry => accentHex(entry.value) === hex); if (item) set({ accent: item.value }); }} />
      )}
      <p className="setup-control__answer">{custom ? `${hueName(Number(values.accent))} · ${values.accent}°` : say("accent", values.accent)}</p>
    </div>
  );
}

/** The greys' tint colour: a few hues to start from, and any hue on a bar. */
function TintControl(props: ControlProps & { visual: Visual }) {
  const { values, set, visual } = props;
  const hue = values["tint-hue"];
  const named = TINTS.find(([value]) => value === hue);
  return (
    <div className="setup-control">
      <Picture {...props} visual={visual} className="setup-picture--large" />
      <ColorSwatchPicker label="Tint colour" size="lg" layout="row" value={named ? hueSwatch(named[0]) : ""}
        items={TINTS.map(([value, label]) => ({ value: hueSwatch(value), label }))}
        onValueChange={colour => { const entry = TINTS.find(([value]) => hueSwatch(value) === colour); if (entry) set({ "tint-hue": entry[0] }); }} />
      <Slider labelPosition="inside" size="lg" label="Hue" min={0} max={HUES.length - 1} step={1} value={Math.max(0, HUES.indexOf(hue))}
        readout={(at: number) => `${hueName(Number(HUES[at]))} · ${HUES[at]}°`} onValueChange={at => set({ "tint-hue": HUES[at]! })} />
    </div>
  );
}

/** Pills: every part that can go fully round, each pictured round, checked when it is. */
const PILL_PART: Record<string, Region> = { button: "primary", field: "field", segmented: "segmented", chip: "chips", badge: "badges", count: "count", switch: "switch", avatar: "avatar" };
function PillCards(props: ControlProps) {
  const { values, set, scopeOf } = props;
  const items = controlOf("pills")?.items ?? [];
  const on = values.pills.split(" ").filter(Boolean);
  const toggle = (part: string) => set({ pills: items.map(entry => entry.value).filter(name => name === part ? !on.includes(name) : on.includes(name)).join(" ") });
  return (
    <CheckboxGroup label="Pills" className="setup-choices" style={{ "--area-choice-ratio": "16 / 10", "--area-choice-min": "calc((100% - 2 * var(--area-space-8)) / 3 - 0.5px)" } as CSSProperties}>
      {items.map(item => (
        <Checkbox key={item.value} variant="card" layout="preview" label={item.label} checked={on.includes(item.value)} onCheckedChange={() => toggle(item.value)}
          leadingVisual={<ScreenFigure className="setup-picture" fidelity="shapes" scope={scopeOf({ pills: item.value })} view={{ region: PILL_PART[item.value] ?? "primary", zoom: 1.4 }} />} />
      ))}
    </CheckboxGroup>
  );
}
