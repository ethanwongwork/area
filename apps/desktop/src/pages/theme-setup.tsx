/**
 * The Theme tab's Setup: building a design system as a conversation (owner, 2026-10-24: "a 2 panel view with 1 side being a
 * vertically scrolling chat like experience that reads like a simple questionaire ... and then visuals on the right side";
 * "dont need all these panels open").
 *
 *   chat    a compact chat panel (owner, 2026-10-28: "a more compact chat panel, just like cursor, claude, chatgpt"),
 *           built as the Inspector's Chat view is: a resizable Panel at the app's own scale, the conversation in its body,
 *           the question docked at its foot in the composer's place (Approval, as Claude Code asks: numbered choices,
 *           each with what it comes to, its place among the questions, the way on). The thread holds the assistant's
 *           words and each chapter's answers as one framed list; selecting an answer asks its question again. The
 *           progress rides over the question as a run's plan rides over the composer.
 *   visuals the product screen (setup-screen.tsx) in the theme so far, alone on a backdrop that stands off any page; the
 *           parts a question changes are marked, and a choice under the pointer is drawn before it is picked
 *
 * The Sidebar and the Inspector are left out (Workspace `panels={false}`); Fine-tune hands over to Foundations and the Inspector.
 * Pacing: Essentials asks the fourteen that change the most; Every detail asks every setting, chapter by chapter in the
 * order a system is built (setup-questions.ts), skipping what the answers so far make moot, and any chapter on request.
 * Every answer is an Inspector setting. Setup's own UI stays at the app's defaults (Workspace `canvasPicks={false}`); only
 * the visuals take the picks.
 */
import { AddIcon, ChatAddIcon, InfoIcon, MoonIcon, OptionsIcon, ResetIcon, SunIcon } from "@area/icons";
import { Approval, Badge, Button, Checkbox, CheckboxGroup, CodeBlock, ColorPicker, ColorSwatch, ColorSwatchPicker, DescriptionList, DescriptionListItem, Message, Pagination, Panel, Plan, ScrollToLatest, Segmented, Select, Slider, Switch, Tooltip, ZoomControl, type ApprovalOption, Link } from "@area/react";
import { Fragment, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { LoopingPress } from "../abstract.tsx";
import { appScale } from "../app-scale.ts";
import { optionMark } from "../option-marks.tsx";
// @ts-expect-error — the highlighter is authored in JavaScript.
import { highlight } from "../content/highlight.mjs";
import { GALLERY_CONTROLS } from "../gallery/controls.ts";
import { hueName } from "../inspector-rows.tsx";
import { FIGURES, REGION_LABEL, SCREENS, ScreenFigure, type Region, type RegionBox, type ScreenId } from "../setup-screen.tsx";
import { canvasAttributes, CANVAS_DEFAULTS, useStudio, Workspace, type CanvasAxes } from "../studio.tsx";
import { coloursCode, hasColours, type ColoursState } from "../colours.ts";
import { useBrandSheet } from "../brand.ts";
import { oklchHex, parseColour } from "@area/tokens/color";
import { PagePicker, pageAnswer, pageHex } from "../page-colour.tsx";
import { AXES } from "../tokens.ts";
import { useViewOption, ViewControls } from "../view-controls.tsx";
import { readStored, writeStored } from "../storage.ts";
import { CHAPTERS, minutesFor, QUESTIONS, type Axis, type Choice, type Question, type Values, type Visual } from "./setup-questions.ts";
import { attributeOf, SETTINGS, type Mode } from "./theme-settings.ts";

export interface ThemeSetupProps {
  mode: Mode;
  setMode: (mode: Mode) => void;
  /** Hands over to Foundations, the Inspector open on Theme (Fine-tune). */
  onBrowse: () => void;
}

type Path = "essentials" | "complete";
/** What the person is making, in their words: each picks the product screen the visuals draw (setup-screen.tsx). */
const MAKING: ReadonlyArray<{ screen: ScreenId; label: string; caption: string }> = [
  { screen: "workspace", label: "A workspace", caption: "Projects, lists and documents people work in" },
  { screen: "analytics", label: "A dashboard", caption: "Numbers, charts and tables" },
  { screen: "settings", label: "A settings app", caption: "Forms, switches and preferences" },
  { screen: "phone", label: "A phone app", caption: "One column, large targets" },
];
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
/** Tint hue's every degree (2026-10-26). */
const TINT_HUES = Array.from({ length: 360 }, (_, hue) => String(hue));
/** Tint colours to start from, by hue (inspector-rows.tsx's TINTS without Accent), drawn at a mid lightness. */
const TINTS: ReadonlyArray<[string, string]> = [["30", "Red"], ["55", "Orange"], ["95", "Yellow"], ["145", "Green"], ["185", "Teal"], ["255", "Blue"], ["300", "Purple"], ["350", "Pink"]];
const hueSwatch = (hue: string) => `oklch(0.66 0.14 ${hue})`;

/** What a question is set to, in its own words: the choice it matches, else the setting's value. */
function answerOf(question: Question, values: Values, picks: Picks): string {
  const control = question.control;
  if (control.kind === "cards") { const choice = control.choices.find(entry => matches(values, entry.set)); if (choice) return choice.label; }
  if (control.kind === "accent" && picks.accent) return `Exact ${picks.accent.toUpperCase()}`;
  if (control.kind === "accent") return /^\d+$/.test(values.accent) ? `${hueName(Number(values.accent))} ${values.accent}°` : say("accent", values.accent);
  if (control.kind === "tint") return `${hueName(Number(values["tint-hue"]))} ${values["tint-hue"]}°`;
  if (control.kind === "page") return pageAnswer(control.mode, values, picks);
  if (control.kind === "pills") { const count = values.pills.split(" ").filter(Boolean).length; return count ? `${count} parts` : "None"; }
  if (control.kind === "toggle") return values[control.axis] === control.off ? "Off" : say(control.axis, values[control.axis]);
  const axis = question.axes[0]!;
  return say(axis, values[axis]);
}
const focusOf = (question: Question, values: Values): Region[] => typeof question.focus === "function" ? question.focus(values) : question.focus;
/** The exact colours picked: each page (src/colours.ts) and the accent, an exact colour through the brand engine while
 * Brand is on (src/brand.ts), else null. */
type Picks = ColoursState & { accent: string | null };
/** At Area's default: every setting it writes, and for a page question no pick (`picks`, src/colours.ts). */
const atDefault = (question: Question, values: Values, picks: Picks) => question.axes.every(axis => values[axis] === defaultOf(axis))
  && !(question.control.kind === "page" && picks[question.control.mode]) && !(question.control.kind === "accent" && picks.accent);
export function ThemeSetup({ mode, setMode, onBrowse }: ThemeSetupProps) {
  const { item, select, navigate, canvas, setCanvas, shown, setInspectorView, showInspector, colours, brand, setBrand } = useStudio();
  const studioColours: Picks = { ...colours, accent: brand.on ? brand.primary : null };
  // An exact accent paints the stage as it paints the Canvas: its one rule in the head, data-area-brand on the scopes.
  useBrandSheet(brand.on ? brand : null);
  const [path, setPath] = useViewOption<Path>("theme-setup-path", "essentials", ["essentials", "complete"]);
  // The product the visuals draw; the welcome's first question sets it, the stage's menu changes it later.
  const [screen, setScreen] = useViewOption<ScreenId>("theme-setup-screen", "workspace", Object.keys(SCREENS) as ScreenId[]);
  // A choice under the pointer, drawn on the visuals before it is picked (the finder's preview).
  const [preview, setPreview] = useState<{ set: Changes; label: string } | null>(null);
  const values = canvas as Values;

  // The questions on this path that can change something under the answers so far.
  const asked = QUESTIONS.filter(question => (path === "complete" || question.essential) && (!question.when || question.when(values, studioColours)));
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
    return { ...attributes, ...(hasColours(drawn.colours) ? { "data-area-colours": "" } : {}), ...(brand.on ? { "data-area-brand": "" } : {}), "data-area-theme": stageMode };
  };
  const answeredCount = asked.filter(entry => !atDefault(entry, values, studioColours)).length;
  const changed = SETTINGS.filter(entry => entry.id !== "theme" && (values as Record<string, string>)[entry.id] !== undefined && (values as Record<string, string>)[entry.id] !== defaultOf(entry.id as Axis)).length;
  const fineTune = () => { setInspectorView("theme"); showInspector(); onBrowse(); };
  const restart = () => set(Object.fromEntries(Object.entries(CANVAS_DEFAULTS)) as Changes);

  // The thread: the Panel's scrolling body.
  const thread = useRef<HTMLDivElement>(null);

  const paths = { essentials: QUESTIONS.filter(entry => entry.essential && (!entry.when || entry.when(values, studioColours))).length, complete: QUESTIONS.filter(entry => !entry.when || entry.when(values, studioColours)).length };

  // Exact page colours (2026-10-27) are a second part: `data-area-colours` and one rule of variables, which stand in for
  // the page settings of each mode picked, so those attributes are left out (the plan: "use one or the other").
  const picked = studioColours, pickedOut = (id: string) =>
    (picked.light !== null && (id === "ground-light" || id === "tint-light")) || (picked.dark !== null && (id === "ground-dark" || id === "tint-dark" || id === "tint-hue-dark"))
    || (id === "tint-hue" && picked.light !== null && (picked.dark !== null || values["tint-hue-dark"] !== "same"));
  const themed = SETTINGS.filter(entry => entry.id !== "theme" && !(entry.id === "contrast" && values.contrast === "system") && !pickedOut(entry.id)
    && (values as Record<string, string>)[entry.id] !== undefined && (values as Record<string, string>)[entry.id] !== defaultOf(entry.id as Axis));
  const anyPick = hasColours(picked) || picked.accent !== null;
  const lines = [...(anyPick ? ["data-area-colours"] : []), ...themed.map(entry => attributeOf(entry, (values as Record<string, string>)[entry.id]!))];
  // An exact accent restates about 600 derivations (THEMING.md, Brand), too long to read here: the theme then links the
  // colour rule `area-tokens colours` writes, and the command that writes it follows.
  const command = picked.accent === null ? null : ["npx area-tokens colours",
    ...(picked.light ? [`--page-light "${picked.light}"`] : []), ...(picked.dark ? [`--page-dark "${picked.dark}"`] : []),
    `--accent "${picked.accent}"`, ...(brand.secondary ? [`--secondary "${brand.secondary}"`] : []), ...(brand.tertiary ? [`--tertiary "${brand.tertiary}"`] : []),
    ...(brand.status === "own" ? ["--status fixed"] : []), "> colours.css"].join(" \\\n  ");
  const themeCode = (lines.length ? `<html\n${lines.map(line => `  ${line}`).join("\n")}\n>` : "<html>")
    + (command ? `\n\n<link rel="stylesheet" href="colours.css">` : hasColours(picked) ? `\n\n${coloursCode(picked)}` : "");
  const extra = QUESTIONS.find(entry => !entry.essential && (!entry.when || entry.when(values, studioColours)));
  const nextSteps = [
    { id: "fine-tune", label: "Fine-tune every setting in the Inspector" },
    { id: "components", label: "See every component in your theme" },
    ...(path === "essentials" && extra ? [{ id: "every-detail", label: `Answer every detail (${paths.complete - paths.essentials} more)` }] : []),
  ];
  const takeStep = (id: string) => {
    if (id === "fine-tune") fineTune();
    else if (id === "components") navigate({ page: "components" });
    else if (id === "every-detail" && extra) { setPath("complete"); select(extra.id); }
  };
  const chapters = CHAPTERS.filter(entry => asked.some(row => row.chapter === entry.id));
  // ——— The chat ———
  // A chat panel, as Cursor's, Claude's and ChatGPT's agent panels are (owner, 2026-10-28: "in the form of a more compact
  // chat panel, just like cursor, claude, chatgpt"): a Panel at the app's own scale with the conversation in its body
  // and the question docked at its foot in the composer's place, as Claude Code asks (Approval: numbered choices, each
  // with what it comes to, where it is among the questions in its head, the way on in its foot). The thread keeps the
  // assistant's words and, under each chapter, the answers given so far as one framed list (Claude's answered-questions
  // block); selecting an answer asks its question again with that answer marked.
  //
  // Where the welcome is: what they are making, then how thorough.
  const [opening, setOpening] = useState<0 | 1>(0);
  const startOver = () => { setPreview(null); setOpening(0); setReach(-1); select(""); };
  // The thread follows the conversation, as a chat follows its newest line: a new chapter or answer scrolls the end into
  // view; a reopened answer scrolls to its row. Smoothly unless the app's Speed is off (as everywhere in Setup).
  const mounted = useRef(false);
  useLayoutEffect(() => {
    const host = thread.current;
    if (!host) return;
    const behavior = !mounted.current || !(parseFloat(getComputedStyle(host).getPropertyValue("--area-duration-base")) > 0) ? "auto" : "smooth";
    mounted.current = true;
    const current = at >= 0 && at < reach ? host.querySelector<HTMLElement>("[data-current]") : null;
    if (current) current.scrollIntoView({ block: "nearest", behavior });
    else host.scrollTo({ top: host.scrollHeight, behavior });
  }, [item, path, opening, reach]);
  // Back to where the conversation had reached, as an edited message returns to the end of the thread.
  const settle = () => { setPreview(null); if (at >= 0 && at < reach) go(reach); else go(at + 1); };
  const resetQuestion = question && !atDefault(question, values, studioColours) ? () => {
    if (question.control.kind === "accent") setBrand({ on: false });
    set(Object.fromEntries(question.axes.map(axis => [axis, defaultOf(axis)])));
  } : undefined;
  const lastQuestion = at + 1 >= asked.length;

  // The question card: one shape for the welcome, every question and the way on at the end.
  interface Card {
    id: string;
    title: ReactNode;
    description?: ReactNode;
    items: ApprovalOption[];
    value?: string;
    choose: (value: string) => void;
    preview?: (value: string | undefined) => void;
    detail?: ReactNode;
    position?: { at: number; count: number; go: (at: number) => void; label: string };
    footer?: ReactNode;
    dismiss: { label: string; run: () => void };
  }
  const isDefaultLabel = (label: ReactNode, isDefault: boolean) => isDefault ? <span className="setup-option">{label}<Badge size="sm">Default</Badge></span> : label;
  const card: Card = at < 0 ? (opening === 0 ? {
    // What it is for first (an onboarding's first question in Linear, Notion and Framer: what are you making), so the
    // screen beside the chat is the person's kind of product before any setting is asked. It changes the visuals only.
    id: "making", title: "What are you making?", description: "The screen beside this chat becomes one like it.",
    items: MAKING.map(entry => ({ value: entry.screen, label: entry.label, description: entry.caption })),
    value: screen, choose: choice => { setScreen(choice as ScreenId); setOpening(1); },
    position: { at: 0, count: 2, go: n => setOpening(n as 0 | 1), label: "Welcome questions" },
    dismiss: { label: "skip", run: () => setOpening(1) },
  } : {
    id: "pace", title: "How thorough should we be?",
    items: (["essentials", "complete"] as const).map(choice => ({
      value: choice, label: choice === "essentials" ? "Essentials" : "Every detail",
      description: `${choice === "essentials" ? "The choices that change the most" : "Every setting, chapter by chapter"}, ${paths[choice]} questions, about ${minutesFor(paths[choice])} min`,
    })),
    value: path, choose: choice => { setPath(choice as Path); select(QUESTIONS.find(entry => (choice === "complete" || entry.essential) && (!entry.when || entry.when(values, studioColours)))?.id ?? "review"); },
    detail: changed ? <p className="setup-step__note"><InfoIcon /><span>Starting from your {changed} changed settings. <Link as="button" onClick={restart}>Start from the defaults</Link></span></p> : undefined,
    position: { at: 1, count: 2, go: n => setOpening(n as 0 | 1), label: "Welcome questions" },
    footer: <Button size="sm" onClick={next}>Start</Button>,
    dismiss: { label: "go back", run: () => setOpening(0) },
  }) : reviewing ? {
    // The way on at the end, as a chat ends on its follow-ups: numbered, as every other answer here.
    id: "next", title: "What next?",
    items: nextSteps.map(step => ({ value: step.id, label: step.label })),
    choose: takeStep,
    dismiss: { label: "go back", run: back },
  } : cardOf(question!);

  function cardOf(entry: Question): Card {
    const control = entry.control;
    const context = entry.context?.(values);
    const notes = <>
      {entry.note ? <p className="setup-step__note"><InfoIcon /><span>{entry.note}</span></p> : null}
      {context ? <p className="setup-step__note setup-step__note--context"><InfoIcon /><span>{context.note} <Link as="button" onClick={() => set(context.set)}>{context.action}</Link></span></p> : null}
    </>;
    const base = {
      id: entry.id, title: entry.question, description: entry.description,
      position: { at, count: asked.length, go, label: "Questions" },
      footer: <>
        {resetQuestion ? <Tooltip side="top" describes={false} trigger={<Button size="sm" variant="ghost" tone="neutral" iconOnly icon={<ResetIcon />} aria-label="Use the default" onClick={resetQuestion} />}>Use the default</Tooltip> : null}
        {path === "complete" && asked[at + 1]?.chapter === entry.chapter ? <Button size="sm" variant="ghost" tone="neutral" onClick={skipChapter}>Skip chapter</Button> : null}
        <Button size="sm" onClick={settle}>{at < reach ? "Done" : lastQuestion ? "Review" : "Continue"}</Button>
      </>,
      dismiss: { label: "skip", run: settle },
    };
    if (control.kind === "cards") {
      // Choices as rows, each with what it is for; the one under the pointer or focus is drawn on the stage first.
      const selected = control.choices.findIndex(choice => matches(values, choice.set));
      return {
        ...base,
        items: control.choices.map((choice, index) => ({ value: String(index), label: isDefaultLabel(choice.label, isDefaultChoice(choice)), description: choice.caption })),
        value: String(selected),
        choose: choice => { setPreview(null); set(control.choices[Number(choice)]!.set); settle(); },
        preview: choice => setPreview(choice === undefined || Number(choice) === selected ? null : { set: control.choices[Number(choice)]!.set, label: control.choices[Number(choice)]!.label }),
        // The exact value is the Inspector's (Fine-tune in the panel's bar); the card holds the choices and their notes.
        detail: entry.note || context ? notes : undefined,
      };
    }
    if (control.kind === "slider" && control.marks?.length) {
      // A bar's named marks are its choices, as a question card's rows; any position between is the Inspector's bar.
      const axes = [control.axis, ...(control.also ?? [])];
      const put = (value: string) => Object.fromEntries(axes.map(axis => [axis, value])) as Changes;
      const mark = control.marks.find(entry => entry.value === values[control.axis]);
      return {
        ...base,
        items: control.marks.map(entry => ({ value: entry.value, label: isDefaultLabel(entry.label, defaultOf(control.axis) === entry.value) })),
        value: mark?.value ?? "",
        choose: value => { setPreview(null); set(put(value)); settle(); },
        preview: value => setPreview(value === undefined || value === values[control.axis] ? null : { set: put(value), label: control.marks!.find(entry => entry.value === value)?.label ?? value }),
        detail: entry.note || context ? notes : undefined,
      };
    }
    return {
      ...base, items: [], choose: () => {},
      detail: <><QuestionControl question={entry} values={values} mode={stageMode} set={set} scopeOf={scopeOf} onPreview={setPreview} />{notes}</>,
    };
  }

  // Keys, as the card takes them when nothing else has focus (Claude Code's numbered choices): a digit picks that choice,
  // Enter goes on. Typing in a field and a focused control's own keys come first; inside the card, the card answers.
  const keysRef = useRef<(event: globalThis.KeyboardEvent) => void>(() => {});
  keysRef.current = event => {
    if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey || event.repeat) return;
    const target = event.target as HTMLElement;
    if (target.closest("input:not([type=radio]):not([type=checkbox]), textarea, select, [contenteditable=true], [role=dialog], [role=menu], [role=listbox], .area-approval")) return;
    if (/^[1-9]$/.test(event.key)) {
      const item = card.items[Number(event.key) - 1];
      if (item) { event.preventDefault(); card.choose(item.value); }
      return;
    }
    if (event.key === "Enter" && !target.closest("button, a, [role=button], [role=tab]") && at >= 0 && !reviewing) { event.preventDefault(); settle(); }
  };
  useEffect(() => {
    const listen = (event: globalThis.KeyboardEvent) => keysRef.current(event);
    addEventListener("keydown", listen);
    return () => removeEventListener("keydown", listen);
  }, []);

  // The thread: the assistant's words, and under each chapter the answers given so far.
  const welcomeAnswered = at >= 0 || reach >= 0;
  // Every question before the furthest one asked, the one being asked again among them (marked); all of them at the end.
  const answered = (entry: Question) => asked.indexOf(entry) < Math.max(reach, at) || reviewing;
  const answerList = (label: string, rows: ReadonlyArray<{ id: string; term: ReactNode; answer: ReactNode; visual?: ReactNode; changed?: boolean; current?: boolean; open: () => void }>) => (
    // Claude's answered-questions block: framed, the question's name at the start in the quiet ink, the answer at the end
    // (justified, ChatGPT's settings rows), Changed in the info tone where it differs from Area's default.
    <DescriptionList layout="justified" framed aria-label={label} className="setup-answers">
      {rows.map(row => (
        <DescriptionListItem key={row.id} term={row.term} data-current={row.current ? "" : undefined}>
          <button type="button" className="setup-answers__answer" onClick={row.open} aria-description="Select to change">
            {row.visual}<span className="setup-answers__text">{row.answer}</span>
            {row.changed ? <Badge size="sm" tone="info">Changed</Badge> : null}
          </button>
        </DescriptionListItem>
      ))}
    </DescriptionList>
  );
  const sections = CHAPTERS.map(section => ({ section, rows: asked.filter(entry => entry.chapter === section.id) }))
    .filter(({ rows }) => rows.some(row => asked.indexOf(row) <= Math.max(reach, at)));
  const transcript = (
    <div className="setup-chat__transcript" aria-live="polite">
      <Message author="assistant" authorName="Setup">
        <p><strong>Let's build your design system.</strong> Pick what looks right below; the screen beside this chat shows each choice before you make it. Every answer is a setting you can fine-tune later.</p>
      </Message>
      {welcomeAnswered ? answerList("Welcome answers", [
        { id: "making", term: "Making", answer: MAKING.find(entry => entry.screen === screen)?.label ?? SCREENS[screen].label, open: () => { setOpening(0); go(-1); } },
        { id: "pace", term: "Pace", answer: `${path === "essentials" ? "Essentials" : "Every detail"}, ${paths[path]} questions`, open: () => { setOpening(1); go(-1); } },
      ]) : null}
      {sections.map(({ section, rows }) => {
        const done = rows.filter(answered);
        return (
          <Fragment key={section.id}>
            <Message author="assistant" authorName="Setup"><p><strong>{section.title}.</strong> {section.lede}</p></Message>
            {done.length ? answerList(`${section.title} answers`, done.map(row => ({
              id: row.id, term: row.name, answer: answerOf(row, values, studioColours), visual: swatchOf(row, values, studioColours),
              changed: !atDefault(row, values, studioColours), current: asked.indexOf(row) === at, open: () => go(asked.indexOf(row)),
            }))) : null}
          </Fragment>
        );
      })}
      {reviewing || reach >= asked.length ? <>
        <Message author="assistant" authorName="Setup">
          <p><strong>Here's your design system.</strong> {answeredCount ? `${answeredCount} of your ${asked.length} answers differ from Area's defaults` : `All ${asked.length} answers are Area's defaults`}{changed > answeredCount ? `, ${changed} settings in all` : ""}. Select any answer above to change it.</p>
          <p>{command
            ? `To use it, load Area's stylesheet, put ${lines.length === 1 ? "this attribute" : `these ${lines.length} attributes`} on your page's root and link the color rule after it; the command under the theme writes that rule. Anything left out stays at Area's default.`
            : hasColours(picked)
            ? `To use it, load Area's stylesheet, put ${lines.length === 1 ? "this attribute" : `these ${lines.length} attributes`} on your page's root and add the color rule after Area's stylesheet. Anything left out stays at Area's default.`
            : themed.length
            ? `To use it, load Area's stylesheet and put ${themed.length === 1 ? "this attribute" : `these ${themed.length} attributes`} on your page's root. Anything left out stays at Area's default.`
            : "Every setting is Area's default, so your page needs only Area's stylesheet: no attributes."}</p>
          {/* The theme to take away: a Code block labelled by its language, its copy in its header. */}
          <CodeBlock size="sm" language="html" lineNumbers={false} copyable copyLabel="Copy theme" html={highlight(themeCode)} />
          {command ? <CodeBlock size="sm" language="bash" lineNumbers={false} copyable copyLabel="Copy command" code={command} /> : null}
        </Message>
      </> : null}
    </div>
  );

  // Where the conversation stands, riding over the question as a run's plan rides over the composer (Cursor's tray): a
  // Plan folded to its head and a segment per chapter, opening to the chapters on a rail.
  const progress = at >= 0 ? (
    <Plan className="setup-chat__progress" title={reviewing ? "Answered" : chapter!.title} bar="segmented" rail defaultOpen={false}
      count={reviewing ? `${asked.length} of ${asked.length}` : `${at + 1} of ${asked.length}, ${minutesFor(asked.length - at)} min left`}
      items={chapters.map(entry => {
        const rows = asked.filter(row => row.chapter === entry.id);
        const behind = rows.filter(row => asked.indexOf(row) < at).length;
        const status = reviewing || behind === rows.length ? "complete" as const : entry.id === chapter?.id ? "current" as const : "pending" as const;
        return {
          id: entry.id, label: entry.title, status,
          progress: status === "current" ? behind / rows.length : undefined,
          meta: `${status === "complete" ? rows.length : behind} of ${rows.length}`,
          items: status === "current" ? rows.map(row => {
            const index = asked.indexOf(row);
            return { id: row.id, label: row.name, status: index < at ? "complete" as const : index === at ? "current" as const : "pending" as const,
              progress: index === at ? 0 : undefined, meta: index < at ? answerOf(row, values, studioColours) : undefined };
          }) : undefined,
        };
      })} />
  ) : null;

  // The foot: Scroll to latest over it, the progress, then the question in the composer's place.
  const dock = (
    <div className="setup-chat__dock">
      <ScrollToLatest scrollRef={thread} />
      {progress}
      <Approval key={card.id} title={card.title} description={card.description} items={card.items} value={card.value}
        onChoose={card.choose} onActiveChange={card.preview} onDismiss={card.dismiss.run} dismissLabel={card.dismiss.label} footer={card.footer}
        actions={card.position ? (
          <Pagination layout="compact" size="sm" pageCount={card.position.count} page={card.position.at + 1}
            onPageChange={page => card.position!.go(page - 1)}
            labels={{ nav: card.position.label, previous: "Previous question", next: "Next question", status: (page, count) => <>{page} of {count}</> }} />
        ) : undefined}>
        {card.detail ? <div className="setup-card__detail">{card.detail}</div> : null}
      </Approval>
    </div>
  );

  // The panel's width, kept as the Sidebar's and the Inspector's are.
  const [chatWidth] = useState(() => { const saved = Number(readStored<Record<string, number>>("widths", {})["setup-chat"]); return saved >= 320 && saved <= 560 ? saved : 400; });

  // ——— The visuals ———
  // What the visuals show (owner, 2026-10-24: "controls ... that allow you to change views, zoom in and out, change to a
  // different product ui, change to an isolated view of a component example"): a product screen, or the part the
  // question is about on its own; real text or a wireframe; at a fitted size or a chosen zoom, which centres on the part.
  const [show, setShow] = useViewOption<"screen" | "part">("theme-setup-show", "screen", ["screen", "part"]);
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
  // What the stage shows, at the Canvas header's start; how it is drawn, at its end, as Foundations'
  // header (owner, 2026-10-28: "fix the header on the theme page": the switch had a row of its own over the chat and
  // the stage, whose own bar sat 9 lower than the chat's).
  const scale13 = appScale();
  const stageLead = (
    <div role="group" aria-label="What the preview shows" className="setup-stage__lead" {...scale13}>
      <Segmented size="sm" aria-label="Show" value={show} onValueChange={next => { setShow(next as "screen" | "part"); setScale(null); }}
        items={[{ value: "screen", label: "Screen" }, { value: "part", label: "Component" }]} />
      {show === "screen" ? (
        <Select size="sm" aria-label="Product" value={screen} onChange={event => { setScreen(event.currentTarget.value as ScreenId); setScale(null); }}>
          {(Object.keys(SCREENS) as ScreenId[]).map(id => <option key={id} value={id}>{SCREENS[id].label}</option>)}
        </Select>
      ) : null}
    </div>
  );
  const stage = (
    <section className="setup-stage" aria-label="Preview">
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
        <span className="setup-stage__caption">{show === "part" ? `${REGION_LABEL[part]}, on its own` : `${SCREENS[screen].label}${screen === "workspace" && focus.length ? ", marked: what this question changes" : ""}`}</span>
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
      // Setup's own UI stays at the app's defaults (type 13, Compact), as the Inspector's chat does; only the stage and
      // the choices' previews take the picks.
      canvasPicks={false}
      canvasLead={stageLead}
      canvasActions={<ViewControls>
        {/* Wireframe returns with the Area figures (setup-screen.tsx FIGURES); while they are off, every drawing is real. */}
        {FIGURES ? <Segmented size="sm" aria-label="Drawing" value={drawing} onValueChange={next => setDrawing(next as "real" | "wireframe")}
          items={[{ value: "real", label: "Real" }, { value: "wireframe", label: "Wireframe" }]} /> : null}
        <Segmented size="sm" aria-label="Preview mode" value={mode} onValueChange={next => setMode(next as Mode)}
          items={[{ value: "light", label: "Light", icon: <SunIcon /> }, { value: "dark", label: "Dark", icon: <MoonIcon /> }]} />
      </ViewControls>}
      // The chat in the Sidebar's place, at the app's scale as the Inspector's Chat view, its bar on the header's line.
      lead={
        <Panel flush bareBar bareFooter resizable="end" className="setup-chat" title="Theme setup" titleLevel={2}
          defaultWidth={chatWidth} minWidth={320} maxWidth={560}
          onWidthChange={width => writeStored("widths", { ...readStored<Record<string, number>>("widths", {}), "setup-chat": Math.round(width) })}
          viewportRef={thread} footer={dock}
          action={<span className="setup-chat__actions">
            <Tooltip side="bottom" describes={false} trigger={<Button variant="ghost" tone="neutral" size="sm" iconOnly icon={<ChatAddIcon />} aria-label="Start over" disabled={at < 0 && opening === 0 && reach < 0} onClick={startOver} />}>Start over</Tooltip>
            <Tooltip side="bottom" describes={false} trigger={<Button variant="ghost" tone="neutral" size="sm" iconOnly icon={<OptionsIcon />} aria-label="Fine-tune in the Inspector" onClick={fineTune} />}>Fine-tune in the Inspector</Tooltip>
          </span>}>
          {transcript}
        </Panel>
      }
      canvas={stage}
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
    // A card question's choices are the question card's rows (cardOf).
    case "cards": return null;
    case "slider": return <SliderControl {...props} axis={control.axis} also={control.also ?? []} low={control.low} high={control.high} />;
    case "toggle": {
      const on = values[control.axis] !== control.off;
      const scale = (controlOf(control.axis)?.scale ?? []).filter(value => value !== control.off);
      const at = Math.max(0, scale.indexOf(values[control.axis]));
      const put = (value: string) => set(Object.fromEntries([control.axis, ...(control.also ?? [])].map(axis => [axis, value])));
      return (
        <div className="setup-control">
          <Switch label={control.label} checked={on} onCheckedChange={checked => put(checked ? control.on : control.off)} />
          {on ? (
            <div className="setup-control__bar">
              <Slider labelPosition="inside" label="How much" min={0} max={scale.length - 1} step={1} value={at}
                readout={(index: number) => say(control.axis, scale[index]!)} onValueChange={index => put(scale[index]!)} />
              <div className="setup-control__ends"><span>{control.low}</span><span>{control.high}</span></div>
            </div>
          ) : null}
        </div>
      );
    }
    case "accent": return <AccentControl {...props} />;
    case "tint": return <TintControl {...props} />;
    case "pills": return <PillCards {...props} />;
    case "page": return <PageControl {...props} pageMode={control.mode} />;
  }
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

/** A bar over an ordered setting, its ends named under it; its named marks are the question card's rows, and the stage
beside the chat is its picture. */
function SliderControl(props: ControlProps & { axis: Axis; also: Axis[]; low: string; high: string }) {
  const { axis, also, low, high, values, set } = props;
  const control = controlOf(axis)!;
  const scale = control.scale ?? [];
  const value = values[axis];
  const at = Math.max(0, scale.indexOf(scale.includes(value) ? value : control.custom ?? scale[0]!));
  const put = (next: string) => set(Object.fromEntries([axis, ...also].map(entry => [entry, next])));
  return (
    <div className="setup-control">
      <Slider labelPosition="inside" label={control.label} min={0} max={scale.length - 1} step={1} value={at}
        readout={(index: number) => scale.includes(value) || index !== at ? say(axis, scale[index]!) : say(axis, value)} onValueChange={index => put(scale[index]!)} />
      <div className="setup-control__ends"><span>{low}</span><span>{high}</span></div>
    </div>
  );
}

/** Accent: the palette's eleven as large swatches, or any hue on a bar. */
/** A mode's page as one exact colour (src/page-colour.tsx), its colour in words under it. */
function PageControl({ values, set, pageMode }: ControlProps & { pageMode: Mode }) {
  const { colours: picks, setColours } = useStudio();
  const pick = picks[pageMode];
  return (
    <div className="setup-control">
      <PagePicker mode={pageMode} values={values} picks={picks} set={set} onPick={colour => setColours({ [pageMode]: colour })} />
      <p className="setup-control__answer">{pageAnswer(pageMode, values, picks)}{pick ? `, ${oklchHex(parseColour(pick))}` : ""}</p>
    </div>
  );
}

/**
 * Accent: the palette's eleven as swatches, any hue on a bar, or one exact colour (exact colours plan, phase 4,
 * 2026-10-27): Area's Color picker, through the brand engine (src/brand.ts) as the Inspector's Exact colour; dark is solved
 * from it. A colour lands when the pointer lifts or rests REST ms, since each works out a brand (about 60ms).
 */
const REST = 300; /* pick: as Brand colours' picker (brand-settings.tsx) */
function AccentControl(props: ControlProps) {
  const { values, set } = props;
  const { brand, setBrand } = useStudio();
  const custom = /^\d+$/.test(values.accent);
  const source = brand.on ? "exact" : custom ? "custom" : "named";
  const pending = useRef<string | null>(null), timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  const land = () => { clearTimeout(timer.current); if (pending.current) setBrand({ primary: pending.current.toLowerCase() }); pending.current = null; };
  const choose = (next: string) => {
    if (next === "exact") { setBrand({ on: true }); return; }
    setBrand({ on: false });
    set({ accent: next === "custom" ? "200" : "blue" });
  };
  return (
    <div className="setup-control">
      <Segmented size="sm" fullWidth aria-label="Accent source" value={source} onValueChange={choose}
        items={[{ value: "named", label: "Palette" }, { value: "custom", label: "Any hue" }, { value: "exact", label: "Exact color" }]} />
      {source === "exact" ? (
        <div onPointerUp={land}>
          <ColorPicker variant="plain" label="Accent" alpha={false} defaultModel="oklch" eyedropper value={brand.primary.toUpperCase()}
            onValueChange={hex => { pending.current = hex; clearTimeout(timer.current); timer.current = setTimeout(land, REST); }} />
        </div>
      ) : custom ? (
        <Slider labelPosition="inside" label="Hue" min={0} max={HUES.length - 1} step={1} value={Math.max(0, HUES.indexOf(values.accent))}
          readout={(at: number) => `${hueName(Number(HUES[at]))} ${HUES[at]}°`} onValueChange={at => set({ accent: HUES[at]! })} />
      ) : (
        <ColorSwatchPicker label="Accent" layout="row" value={accentHex(values.accent)}
          items={NAMED_ACCENTS.map(item => ({ value: accentHex(item.value), label: item.label }))}
          onValueChange={hex => { const item = NAMED_ACCENTS.find(entry => accentHex(entry.value) === hex); if (item) set({ accent: item.value }); }} />
      )}
      <p className="setup-control__answer">{source === "exact" ? `Exact ${brand.primary.toUpperCase()}` : custom ? `${hueName(Number(values.accent))} ${values.accent}°` : say("accent", values.accent)}</p>
    </div>
  );
}

/** The greys' tint colour: a few hues to start from, and any hue on a bar. */
function TintControl(props: ControlProps) {
  const { values, set } = props;
  const hue = values["tint-hue"];
  const named = TINTS.find(([value]) => value === hue);
  return (
    <div className="setup-control">
      <ColorSwatchPicker label="Tint color" layout="row" value={named ? hueSwatch(named[0]) : ""}
        items={TINTS.map(([value, label]) => ({ value: hueSwatch(value), label }))}
        onValueChange={colour => { const entry = TINTS.find(([value]) => hueSwatch(value) === colour); if (entry) set({ "tint-hue": entry[0] }); }} />
      <Slider labelPosition="inside" label="Hue" min={0} max={TINT_HUES.length - 1} step={1} value={Math.max(0, TINT_HUES.indexOf(hue))}
        readout={(at: number) => `${hueName(Number(TINT_HUES[at]))} ${TINT_HUES[at]}°`} onValueChange={at => set({ "tint-hue": TINT_HUES[at]! })} />
    </div>
  );
}

/** Pills: every part that can go fully round, checked when it is, two columns in the question card; the stage beside
the chat shows them. */
function PillCards(props: ControlProps) {
  const { values, set } = props;
  const items = controlOf("pills")?.items ?? [];
  const on = values.pills.split(" ").filter(Boolean);
  const toggle = (part: string) => set({ pills: items.map(entry => entry.value).filter(name => name === part ? !on.includes(name) : on.includes(name)).join(" ") });
  return (
    <CheckboxGroup label="Pills" className="setup-pills">
      {items.map(item => <Checkbox key={item.value} label={item.label} checked={on.includes(item.value)} onCheckedChange={() => toggle(item.value)} />)}
    </CheckboxGroup>
  );
}

/**
 * A colour answer's swatch, or nothing: the Inspector's own mark (option-marks.tsx), Area's Color swatch painted by the
 * real token under the answer's scope, so the chat shows the colour the Inspector and the Canvas do. Before its words in
 * a recap row; in the answer row's visual slot.
 */
function swatchOf(question: Question, values: Values, picks: Picks): ReactNode {
  const kind = question.control.kind;
  if (kind === "accent" && picks.accent) return <ColorSwatch size="sm" color={picks.accent} aria-hidden="true" />;
  if (kind === "accent") return optionMark("accent", values.accent, values as CanvasAxes);
  if (kind === "tint") return optionMark("tint-hue", values["tint-hue"], values as CanvasAxes);
  if (question.control.kind === "page") return <ColorSwatch size="sm" color={pageHex(question.control.mode, values, picks)} aria-hidden="true" />;
  return null;
}
