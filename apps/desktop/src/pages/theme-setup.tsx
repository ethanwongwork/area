/**
 * The Theme tab's Setup: building a design system as a guided questionnaire (owner, 2026-10-24: "begin the new theme
 * experience building, leveraging the latest visuals, and really focusing on a detailed questionnaire process ... focus
 * on the format, pacing, questions, options, descriptions, and the onboarding experience").
 *
 *   panel   one step at a time: a welcome that chooses the path, an opening card per chapter, then each question with
 *           what it changes, its choices (cards that picture the choice, text cards, a large bar or a toggle) and a
 *           note; Back, Reset and Continue at its foot; a review of every answer at the end
 *   stage   the product screen (setup-screen.tsx) in the theme so far, as large as the Canvas allows; the parts a
 *           question changes are pointed at, and a choice under the pointer is drawn before it is picked
 *
 * Pacing: Essentials asks the fourteen that change the most; Every detail asks every setting, chapter by chapter in the
 * order a system is built (setup-questions.ts), skipping what the answers so far make moot, and any chapter on request.
 * Every answer is an Inspector setting, so it reads there at once and the review hands over to it. Setup's own UI stays
 * at the app's defaults (Workspace `canvasPicks={false}`); only the stage and the choices' pictures take the picks.
 */
import { AddIcon, ArrowLeftIcon, CopyIcon, InfoIcon, ResetIcon } from "@area/icons";
import {
  Button, Checkbox, CheckboxGroup, ColorSwatchPicker, Nav, NavGroup, NavItem, PanelSection, Radio, RadioGroup, Segmented,
  Slider, Switch,
} from "@area/react";
import { useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { LoopingPress } from "../abstract.tsx";
import { CanvasSettings } from "../canvas-settings.tsx";
import { CopyButton } from "../copy.tsx";
import { Facts } from "../facts.tsx";
import { GALLERY_CONTROLS } from "../gallery/controls.ts";
import { hueName, SettingRow } from "../inspector-rows.tsx";
import { ScreenFigure, type Region, type RegionBox } from "../setup-screen.tsx";
import { canvasAttributes, CANVAS_DEFAULTS, SidebarList, useStudio, Workspace } from "../studio.tsx";
import { AXES } from "../tokens.ts";
import { useViewOption, ViewControls } from "../view-controls.tsx";
import { CHAPTERS, minutesFor, QUESTIONS, type Axis, type Chapter, type Choice, type Question, type Values, type Visual } from "./setup-questions.ts";
import { attributeOf, SETTINGS, type Mode } from "./theme-settings.ts";

export interface ThemeSetupProps {
  mode: Mode;
  setMode: (mode: Mode) => void;
  /** The Setup / Browse switch, first in the Canvas header. */
  flowSwitch: ReactNode;
}

type Path = "essentials" | "complete";
type Changes = Partial<Record<Axis, string>>;
/** A step: the welcome, a chapter's opening card, a question, or the review. */
type Step = { kind: "welcome" } | { kind: "chapter"; chapter: Chapter } | { kind: "question"; question: Question } | { kind: "review" };
const stepId = (step: Step) => step.kind === "chapter" ? `chapter-${step.chapter.id}` : step.kind === "question" ? step.question.id : step.kind === "review" ? "review" : "";

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

export function ThemeSetup({ mode, setMode, flowSwitch }: ThemeSetupProps) {
  const { item, select, canvas, setCanvas, shown, setInspectorView, showInspector } = useStudio();
  const [path, setPath] = useViewOption<Path>("theme-setup-path", "essentials", ["essentials", "complete"]);
  // A choice under the pointer, drawn on the stage before it is picked (the finder's preview).
  const [preview, setPreview] = useState<{ set: Changes; label: string } | null>(null);
  const values = canvas as Values;

  // The questions on this path that can change something under the answers so far, and the steps they make.
  const asked = QUESTIONS.filter(question => (path === "complete" || question.essential) && (!question.when || question.when(values)));
  const steps: Step[] = useMemo(() => [
    { kind: "welcome" },
    ...CHAPTERS.flatMap(chapter => {
      const rows = asked.filter(question => question.chapter === chapter.id);
      return rows.length ? [{ kind: "chapter", chapter } as Step, ...rows.map(question => ({ kind: "question", question }) as Step)] : [];
    }),
    { kind: "review" },
  ], [asked.map(question => question.id).join(" ")]);
  // The step shown: the Sidebar's item; a question the answers have made moot shows the next one asked.
  const found = steps.findIndex(step => stepId(step) === item);
  const lost = found < 0 && item ? QUESTIONS.findIndex(question => question.id === item) : -1;
  const index = found >= 0 ? found : lost >= 0 ? Math.max(0, steps.findIndex(step => step.kind === "question" && QUESTIONS.indexOf(step.question) > lost)) : 0;
  const step = steps[index] ?? steps[0]!;
  const question = step.kind === "question" ? step.question : null;
  const chapter = step.kind === "chapter" ? step.chapter : question ? CHAPTERS.find(entry => entry.id === question.chapter)! : null;
  // A step changes in place (docs/research/motion-subtle-2026-10-24/systems.md, step transitions): the step leaving is
  // copied as it is and fades out quickly, drifting 8px away; the new one slides 16px in from the side it comes from
  // and fades in (styles/setup.css, setup-step-in). Both take the app's Speed and Easing, so reduced motion cuts.
  const panel = useRef<HTMLDivElement>(null);
  const leaving = useRef<{ node: HTMLElement; direction: number } | null>(null);
  const [direction, setDirection] = useState(1);
  const go = (target: Step | undefined) => {
    setPreview(null);
    const nextIndex = target ? steps.findIndex(entry => stepId(entry) === stepId(target)) : 0;
    const way = nextIndex >= index ? 1 : -1;
    const current = panel.current?.querySelector<HTMLElement>(":scope > .setup-step");
    if (current && nextIndex !== index) leaving.current = { node: current.cloneNode(true) as HTMLElement, direction: way };
    setDirection(way);
    select(target ? stepId(target) : "");
  };
  useLayoutEffect(() => {
    const host = panel.current, out = leaving.current;
    leaving.current = null;
    if (!host || !out) return;
    const style = getComputedStyle(host);
    const duration = parseFloat(style.getPropertyValue("--area-duration-fast")) || 0;
    host.scrollTop = 0;
    if (!duration) return;
    const ghost = out.node;
    ghost.classList.add("setup-step--leaving");
    ghost.setAttribute("aria-hidden", "true");
    ghost.inert = true;
    host.prepend(ghost);
    ghost.animate([{ opacity: 1, translate: "0 0" }, { opacity: 0, translate: `${-8 * out.direction}px 0` }],
      { duration, easing: style.getPropertyValue("--area-ease-out").trim() || "ease-out", fill: "forwards" })
      .finished.then(() => ghost.remove(), () => ghost.remove());
  }, [stepId(step)]);
  const next = () => go(steps[index + 1]);
  const back = () => go(steps[index - 1]);
  const skipChapter = () => go(steps.slice(index + 1).find(entry => entry.kind === "review" || entry.kind === "chapter" && entry.chapter.id !== chapter?.id));

  // A question or chapter asked in one mode turns the stage to it (light/dark pairs are set one mode at a time).
  const stepMode = question?.mode ?? (chapter?.id === "dark" ? "dark" : undefined);
  useEffect(() => { if (stepMode && stepMode !== mode) setMode(stepMode); }, [stepId(step)]);
  const stageMode = stepMode ?? mode;

  const set = (changes: Changes) => { for (const [axis, value] of Object.entries(changes)) setCanvas(axis as Axis, value!); };
  // The pictures and the stage draw the choices at a steady pace (owner, 2026-10-24: "the smoothness of the sliders is
  // not very smooth"): restyling a themed screen costs about 60ms, so while a bar is dragged the screens take the first
  // step at once, then one every 180ms and the last, and the bar itself follows the pointer on every frame.
  const drawn = useThrottled(shown, 180);
  const scopeOf = (extra: Changes = {}) => {
    const attributes = canvasAttributes({ ...drawn.canvas, ...extra } as typeof drawn.canvas, drawn.material) as Record<string, string | undefined>;
    return { ...attributes, "data-area-theme": stageMode };
  };
  const answered = asked.filter(entry => !atDefault(entry, values)).length;
  const changed = SETTINGS.filter(entry => entry.id !== "theme" && (values as Record<string, string>)[entry.id] !== undefined && (values as Record<string, string>)[entry.id] !== defaultOf(entry.id as Axis)).length;
  const questionNumber = question ? asked.indexOf(question) + 1 : 0;
  const remaining = question ? asked.length - questionNumber + 1 : step.kind === "chapter" ? asked.length - asked.findIndex(entry => entry.chapter === chapter!.id) : asked.length;
  const fineTune = () => { setInspectorView("theme"); showInspector(); };
  const restart = () => { set(Object.fromEntries(Object.entries(CANVAS_DEFAULTS).map(([axis, value]) => [axis, value])) as Changes); };

  // ——— The panel ———
  const progress = step.kind === "welcome" ? null : (
    <div className="setup-progress">
      <div className="setup-progress__chapters" aria-hidden="true">
        {CHAPTERS.filter(entry => asked.some(row => row.chapter === entry.id)).map(entry => {
          const rows = asked.filter(row => row.chapter === entry.id);
          const done = step.kind === "review" ? rows.length : rows.filter(row => asked.indexOf(row) < (question ? asked.indexOf(question) : step.kind === "chapter" && CHAPTERS.indexOf(entry) < CHAPTERS.indexOf(chapter!) ? Infinity : -1)).length;
          const fill = step.kind === "chapter" && CHAPTERS.indexOf(entry) < CHAPTERS.indexOf(chapter!) ? 1 : done / rows.length;
          return <i key={entry.id} className="setup-progress__chapter" data-current={entry.id === chapter?.id ? "" : undefined} style={{ "--setup-progress-fill": fill } as CSSProperties} />;
        })}
      </div>
      <span className="setup-progress__label">
        {step.kind === "review" ? `${asked.length} questions answered` : `${chapter!.title}${question ? ` · Question ${questionNumber} of ${asked.length}` : ""}`}
      </span>
      {step.kind === "review" ? null : <span className="setup-progress__time">About {minutesFor(remaining)} min left</span>}
    </div>
  );

  let body: ReactNode, foot: ReactNode;
  if (step.kind === "welcome") {
    body = (
      <div className="setup-step setup-step--welcome" key="welcome">
        <p className="setup-step__eyebrow">Theme setup</p>
        <h2 className="setup-step__title">Build your design system</h2>
        <p className="setup-step__lede">Pick what looks right. The screen beside you shows every choice before you make it.</p>
        <RadioGroup label="How thorough" className="setup-choices" value={path} onValueChange={next => setPath(next as Path)}>
          <Radio variant="card" value="essentials" label={`Essentials · ${QUESTIONS.filter(entry => entry.essential && (!entry.when || entry.when(values))).length} questions`}
            caption={`About ${minutesFor(QUESTIONS.filter(entry => entry.essential).length)} minutes, the choices that change the most`} />
          <Radio variant="card" value="complete" label={`Every detail · ${QUESTIONS.filter(entry => !entry.when || entry.when(values)).length} questions`}
            caption={`About ${minutesFor(QUESTIONS.length)} minutes, every setting`} />
        </RadioGroup>
        <section className="setup-outline" aria-label="What you'll decide">
          <h3 className="setup-outline__heading">What you'll decide</h3>
          <ol className="setup-outline__list">
            {CHAPTERS.map((entry, at) => {
              const count = asked.filter(row => row.chapter === entry.id).length;
              return count ? (
                <li key={entry.id} className="setup-outline__row">
                  <span className="setup-outline__number">{at + 1}</span>
                  <span className="setup-outline__name">{entry.title}</span>
                  <span className="setup-outline__count">{count} {count === 1 ? "question" : "questions"}</span>
                </li>
              ) : null;
            })}
          </ol>
        </section>
        {changed ? (
          <p className="setup-step__note"><InfoIcon /><span>Starting from your {changed} changed settings. <button type="button" className="setup__link" onClick={restart}>Start from the defaults</button></span></p>
        ) : null}
      </div>
    );
    foot = <>
      <Button variant="ghost" tone="neutral" onClick={fineTune}>Open the Inspector</Button>
      <span className="setup-foot__grow" />
      <Button size="lg" onClick={next}>Start</Button>
    </>;
  } else if (step.kind === "chapter") {
    const rows = asked.filter(row => row.chapter === step.chapter.id);
    body = (
      <div className="setup-step setup-step--chapter" key={`chapter-${step.chapter.id}`}>
        <p className="setup-step__eyebrow">Chapter {CHAPTERS.filter(entry => asked.some(row => row.chapter === entry.id)).indexOf(step.chapter) + 1} of {CHAPTERS.filter(entry => asked.some(row => row.chapter === entry.id)).length}</p>
        <h2 className="setup-step__title">{step.chapter.title}</h2>
        <p className="setup-step__lede">{step.chapter.lede}</p>
        <ol className="setup-outline__list setup-outline__list--plain">
          {rows.map(row => (
            <li key={row.id} className="setup-outline__row">
              <button type="button" className="setup-outline__name setup__link" onClick={() => go({ kind: "question", question: row })}>{row.name}</button>
              <span className="setup-outline__count">{answerOf(row, values)}</span>
            </li>
          ))}
        </ol>
      </div>
    );
    foot = <>
      <Button variant="ghost" tone="neutral" iconOnly aria-label="Back" icon={<ArrowLeftIcon />} onClick={back} />
      <span className="setup-foot__grow" />
      <Button variant="ghost" tone="neutral" onClick={skipChapter}>Skip chapter</Button>
      <Button size="lg" onClick={next}>Begin</Button>
    </>;
  } else if (question) {
    body = (
      <div className="setup-step setup-step--question" key={question.id}>
        <h2 className="setup-step__title setup-step__title--question">{question.question}</h2>
        <p className="setup-step__lede">{question.description}</p>
        <QuestionControl question={question} values={values} mode={stageMode} set={set} scopeOf={scopeOf} onPreview={setPreview} />
        {question.note ? <p className="setup-step__note"><InfoIcon /><span>{question.note}</span></p> : null}
        {(() => { const context = question.context?.(values); return context ? (
          <p className="setup-step__note setup-step__note--context"><InfoIcon /><span>{context.note} <button type="button" className="setup__link" onClick={() => set(context.set)}>{context.action}</button></span></p>
        ) : null; })()}
      </div>
    );
    const last = steps[index + 1]?.kind === "review";
    foot = <>
      <Button variant="ghost" tone="neutral" iconOnly aria-label="Back" icon={<ArrowLeftIcon />} onClick={back} />
      <Button variant="ghost" tone="neutral" icon={<ResetIcon />} disabled={atDefault(question, values)} onClick={() => set(Object.fromEntries(question.axes.map(axis => [axis, defaultOf(axis)])))}>Default</Button>
      <span className="setup-foot__grow" />
      {path === "complete" && steps[index + 1]?.kind === "question" ? <Button variant="ghost" tone="neutral" onClick={skipChapter}>Skip chapter</Button> : null}
      <Button size="lg" onClick={next}>{last ? "Review" : "Continue"}</Button>
    </>;
  } else {
    body = (
      <div className="setup-step setup-step--review" key="review">
        <h2 className="setup-step__title">Your design system</h2>
        <p className="setup-step__lede">{answered ? `${answered} changes from Area's defaults, in bold.` : "Every answer is Area's default."} Select one to change it.</p>
        {CHAPTERS.map(entry => {
          const rows = asked.filter(row => row.chapter === entry.id);
          return rows.length ? (
            <section key={entry.id} className="setup-review__chapter">
              <h3 className="setup-review__heading">{entry.title}</h3>
              <dl className="setup-review__rows">
                {rows.map(row => (
                  <div key={row.id} className="setup-review__row">
                    <dt><button type="button" className="setup__link" onClick={() => go({ kind: "question", question: row })}>{row.name}</button></dt>
                    <dd className={atDefault(row, values) ? "setup-review__default" : "setup-review__changed"}>{answerOf(row, values)}</dd>
                  </div>
                ))}
              </dl>
            </section>
          ) : null;
        })}
      </div>
    );
    foot = <>
      <Button variant="ghost" tone="neutral" iconOnly aria-label="Back" icon={<ArrowLeftIcon />} onClick={back} />
      <CopyButton label="Copy theme" icon={<CopyIcon />} value={() => SETTINGS.filter(entry => entry.id !== "theme" && !(entry.id === "contrast" && values.contrast === "system"))
        .map(entry => attributeOf(entry, (values as Record<string, string>)[entry.id]!)).join(" ")} />
      <span className="setup-foot__grow" />
      {path === "essentials" ? <Button variant="outline" tone="neutral" onClick={() => { setPath("complete"); go(undefined); }}>Every detail</Button> : null}
      <Button size="lg" onClick={fineTune}>Fine-tune</Button>
    </>;
  }

  // ——— The stage ———
  const focus: Region[] = preview ? [] : question ? focusOf(question, values) : chapter ? chapter.focus : [];
  const [boxes, setBoxes] = useState<RegionBox[]>([]);
  const stage = (
    <section className="setup-stage" aria-label="Preview">
      <ScreenFigure className="setup-stage__screen" crossfade scope={scopeOf(preview?.set)} hold={question?.hold ?? []} fidelity={question?.fidelity ?? "bars"}
        measure={focus} onMeasure={setBoxes} />
      <div className="setup-stage__marks" aria-hidden="true" key={stepId(step)}>
        {focus.length ? boxes.map((box, at) => (
          <span key={box.region} className="setup-stage__mark" style={{ left: box.x, top: box.y, width: box.w, height: box.h, animationDelay: `${at * 60}ms` }} />
        )) : null}
      </div>
      {preview ? <span className="setup-stage__preview">Previewing {preview.label}</span> : null}
    </section>
  );

  return (
    <Workspace
      sidebar={<SidebarList>
        <Nav aria-label="Setup">
          <NavItem href="#theme" current={step.kind === "welcome"} onClick={event => { event.preventDefault(); go(undefined); }}>Start</NavItem>
          {CHAPTERS.map(entry => {
            const rows = asked.filter(row => row.chapter === entry.id);
            return rows.length ? (
              <NavGroup key={entry.id} label={entry.title}>
                {rows.map(row => (
                  <NavItem key={row.id} href={`#theme/${row.id}`} current={row.id === question?.id}
                    onClick={event => { event.preventDefault(); go({ kind: "question", question: row }); }}
                    trailing={<span className="studio-muted setup__value">{answerOf(row, values)}</span>}>
                    {row.name}
                  </NavItem>
                ))}
              </NavGroup>
            ) : null;
          })}
          <NavItem href="#theme/review" current={step.kind === "review"} onClick={event => { event.preventDefault(); go({ kind: "review" }); }}>Review</NavItem>
        </Nav>
      </SidebarList>}
      canvasTitle={question ? question.name : step.kind === "chapter" ? step.chapter.title : step.kind === "review" ? "Your design system" : "Build your design system"}
      canvasPicks={false}
      canvasActions={
        <ViewControls>
          {flowSwitch}
          <Segmented size="sm" aria-label="Questions" value={path} onValueChange={next => setPath(next as Path)} items={[{ value: "essentials", label: "Essentials" }, { value: "complete", label: "Every detail" }]} />
          <Segmented size="sm" aria-label="Preview mode" value={mode} onValueChange={next => setMode(next as Mode)} items={[{ value: "light", label: "Light" }, { value: "dark", label: "Dark" }]} />
        </ViewControls>
      }
      canvas={
        <div className="setup"><div className="setup__layout">
          <section className="setup-panel" aria-label="Question">
            {progress}
            <div className="setup-panel__body" ref={panel} style={{ "--_direction": direction } as CSSProperties}>{body}</div>
            <div className="setup-foot">{foot}</div>
          </section>
          {stage}
        </div></div>
      }
      inspector={{
        theme: <CanvasSettings />,
        design: (
          <PanelSection heading="Setup">
            <Facts label="Setup" items={[
              ["Path", `${path === "essentials" ? "Essentials" : "Every detail"} · ${asked.length} questions`],
              ["Step", question ? `${chapter!.title} · ${question.name}` : step.kind === "chapter" ? `${step.chapter.title} (opening)` : step.kind === "review" ? "Review" : "Welcome"],
              ["Sets", question ? question.axes.join(", ") : "Each answer names the settings it writes; the Inspector holds them all"],
              ["Changed", `${changed} settings from the defaults`],
            ]} />
          </PanelSection>
        ),
      }}
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
              <Slider variant="field" size="lg" label="How much" min={0} max={scale.length - 1} step={1} value={at}
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
      <Slider variant="field" size="lg" label={control.label} min={0} max={scale.length - 1} step={1} value={at}
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
        <Slider variant="field" size="lg" label="Hue" min={0} max={HUES.length - 1} step={1} value={Math.max(0, HUES.indexOf(values.accent))}
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
      <Slider variant="field" size="lg" label="Hue" min={0} max={HUES.length - 1} step={1} value={Math.max(0, HUES.indexOf(hue))}
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
