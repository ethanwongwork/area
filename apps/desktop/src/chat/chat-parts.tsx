/**
 * What the Chat draws beside the agent's words (the chat workflow study, docs/research/chat-workflow-2026-11-08; owner,
 * 2026-11-08, "Take all recs"): the design's words for files and steps (P2, P5), the options the agent shows as pictures
 * (P4), its questions as a card (P3), a question it asked and the answer, kept in the conversation, and a reply's More
 * fold (P7). The agent's own tools describe them (electron/agent.cjs `areaTools`); these draw them with Area's components.
 */
import { useState, type ReactNode } from "react";
import { Accordion, AccordionItem, Approval, Button, Message } from "@area/react";
import { canvasAttributes, useStudio, type CanvasAxes } from "../studio.tsx";
import { QuestionFrame, noted } from "../question-kit.tsx";
import { ScreenFigure, SHOWCASE, type ScreenId } from "../setup-screen.tsx";
import { GALLERY_CONTROLS } from "../gallery/controls.ts";
import { Markdown } from "./markdown.tsx";
import type { AgentQuestion, QuestionRequest, ShowOptionsInput } from "./recording.ts";
import type { ChatSession, Part } from "./session.ts";

type Tool = Extract<Part, { kind: "tool" }>;

/* --- A reply's words, with More folded (P7) ------------------------------------------------------------------------ */

const MORE = /\n?\s*<!--\s*more\s*-->\s*\n?/i;
/** A reply's text: the answer, then what follows a `<!-- more -->` line folded under More. */
export function ReplyText({ text }: { text: string }) {
  const [head = "", ...rest] = text.split(MORE);
  const more = rest.join("\n\n").trim();
  return <>
    {head.trim() ? <Markdown text={head} /> : null}
    {more ? (
      <Accordion variant="plain" size="sm" className="studio-chat__more">
        <AccordionItem value="more" heading="More"><Markdown text={more} /></AccordionItem>
      </Accordion>
    ) : null}
  </>;
}

/* --- Options side by side (P4) ------------------------------------------------------------------------------------- */

type Axis = keyof CanvasAxes;
/** An option's settings the Inspector knows, at values it offers; the rest are left out. */
export function knownSettings(settings: Readonly<Record<string, string>> | undefined): Partial<Record<Axis, string>> {
  const known: Partial<Record<Axis, string>> = {};
  for (const [axis, value] of Object.entries(settings ?? {})) {
    const control = GALLERY_CONTROLS.find(entry => entry.axis === axis);
    if (control?.items.some(item => item.value === String(value))) known[axis as Axis] = String(value);
  }
  return known;
}
const settingWords = (set: Partial<Record<Axis, string>>) => Object.entries(set).map(([axis, value]) => {
  const control = GALLERY_CONTROLS.find(entry => entry.axis === axis);
  const label = control?.items.find(item => item.value === value)?.label?.replace(/ \(Default\)$/, "") ?? value;
  return `${(control?.label ?? axis).toLowerCase()} ${label}`;
}).join(", ");
const SCREENS = new Set<ScreenId>(["workspace", "analytics", "settings", "phone"]);

/**
 * The agent's options as pictures (show_options): each drawn on a product screen in the open theme with its settings over
 * it, then the choice as an Approval, the recommended one marked. Where the chat is narrow (under 440, the Inspector's
 * usual widths) one picture fills the column in the visual questions' frame (Before, Light / Dark, Zoom, Full screen):
 * the option under the pointer or focus, else the one picked, else the recommended one; wider, a picture each sits side
 * by side, named. Picking one puts
 * its settings on the theme (a change Undo takes back) and tells the agent; Something else asks again in words ("More
 * like Soft", "Mix the two"); Not now sets them aside. An option no setting can show is words only, and picking it asks
 * the agent to make it.
 */
export function OptionSet({ part, session }: { part: Tool; session: ChatSession }) {
  const studio = useStudio();
  const input = part.input as unknown as ShowOptionsInput;
  const options = (Array.isArray(input.options) ? input.options : []).slice(0, 4);
  const [picked, setPicked] = useState<number | undefined>();
  const [active, setActive] = useState<number | undefined>();
  const [declined, setDeclined] = useState(false);
  const [before, setBefore] = useState<Partial<Record<Axis, string>> | null>(null);
  if (options.length < 2) return null;
  const sets = options.map(option => knownSettings(option.settings));
  const drawn = sets.some(set => Object.keys(set).length > 0);
  const screen: ScreenId = SCREENS.has(input.picture as ScreenId) ? input.picture as ScreenId : "workspace";
  const mode = studio.theme === "dark" ? "dark" : "light";
  const scopeOf = (set: Partial<Record<Axis, string>>) => ({ ...canvasAttributes({ ...studio.shown.canvas, ...set } as CanvasAxes, studio.shown.material), "data-area-theme": mode });
  const lit = active ?? picked;
  const shown = active ?? picked ?? (typeof input.recommended === "number" && options[input.recommended] ? input.recommended : 0);
  const pick = (at: number) => {
    const option = options[at];
    if (!option) return;
    setPicked(at);
    setDeclined(false);
    const set = sets[at]!;
    const axes = Object.keys(set) as Axis[];
    if (axes.length) {
      setBefore(previous => previous ?? Object.fromEntries(axes.map(axis => [axis, studio.canvas[axis]])));
      for (const axis of axes) studio.setCanvas(axis, set[axis]!);
    }
    // A recorded run has nothing to tell: the pick is on the theme. Live, the agent hears it.
    if (session.mode !== "live" && axes.length) return;
    session.send(`Use ${option.name}`, undefined, {
      prompt: axes.length
        ? `I picked ${option.name} (${option.difference}). Its settings (${settingWords(set)}) are on the theme now, so leave them out of the files. Reply in a line.`
        : `I picked ${option.name} (${option.difference}). Make it.`,
    });
  };
  const undo = () => {
    if (!before) return;
    for (const [axis, value] of Object.entries(before)) if (value !== undefined) studio.setCanvas(axis as Axis, value);
    setBefore(null);
    setPicked(undefined);
  };
  const pickedOption = picked !== undefined ? options[picked] : undefined;
  return (
    <div className="studio-chat__options" data-declined={declined ? "" : undefined}>
      {drawn ? (
        <div className="studio-chat__one">
          <QuestionFrame name={options[shown]!.name} shown={sets[shown]!} screen={screen} />
        </div>
      ) : null}
      {drawn ? (
        <div className="studio-chat__compare" data-count={options.length}>
          {options.map((option, index) => (
            <figure key={index} className="qk-compare__side" data-lit={lit === index ? "" : undefined}
              data-dim={(picked !== undefined && picked !== index && active === undefined) || declined ? "" : undefined}>
              <ScreenFigure className="qk-compare__screen" screen={screen} hold={SHOWCASE} scope={scopeOf(sets[index]!)} />
              <figcaption className="qk-compare__name">{option.name}</figcaption>
            </figure>
          ))}
        </div>
      ) : null}
      <Approval title={input.question || "Which one?"} className="studio-chat__choices"
        items={options.map((option, index) => ({
          value: String(index),
          label: noted(option.name, index === input.recommended ? "Recommended" : undefined),
          description: option.difference,
        }))}
        value={picked !== undefined ? String(picked) : undefined} onActiveChange={value => setActive(value === undefined ? undefined : Number(value))}
        onChoose={value => pick(Number(value))}
        onInstead={text => session.send(text)} insteadPlaceholder={`Something else, like More like ${options[0]!.name}`}
        onDismiss={() => setDeclined(true)} dismissLabel="not now" />
      {pickedOption && before ? (
        <p className="studio-chat__picked">
          <span>{`${pickedOption.name} is on the theme.`}</span>
          <Button variant="ghost" tone="neutral" size="sm" onClick={undo}>Undo</Button>
        </p>
      ) : null}
    </div>
  );
}

/* --- Questions back (P3) ------------------------------------------------------------------------------------------- */

const RECOMMENDED = /\s*\(recommended\)\s*$/i;
const answerLabel = (label: string) => label.replace(RECOMMENDED, "");

/**
 * The agent's question in the composer's place (AskUserQuestion): one question at a time, its answers as numbered rows,
 * the recommended one marked, Something else to answer in words and Skip (Esc). A question that takes several answers
 * marks each pressed row Chosen, and Continue sends them. Several questions step through, and the answers go back
 * together.
 */
export function QuestionCard({ request, onAnswer }: { request: QuestionRequest; onAnswer: (answers: Record<string, string> | null) => void }) {
  const [at, setAt] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  // A question that takes several answers (multiSelect): each press marks or clears one, and Continue sends them.
  const [chosen, setChosen] = useState<ReadonlySet<number>>(new Set());
  const questions = request.questions.filter(question => question.question);
  const question = questions[at];
  if (!question) return null;
  const answer = (label: string) => {
    const next = { ...answers, [question.question]: label };
    setAnswers(next);
    setChosen(new Set());
    if (at + 1 < questions.length) setAt(at + 1);
    else onAnswer(next);
  };
  const several = Boolean(question.multiSelect);
  const toggle = (index: number) => setChosen(current => { const next = new Set(current); if (next.has(index)) next.delete(index); else next.add(index); return next; });
  const label = (text: string, index: number): ReactNode => {
    const words = answerLabel(text);
    if (several && chosen.has(index)) return <span className="qk-default">{words}<span className="qk-default__note">Chosen</span></span>;
    return noted(words, RECOMMENDED.test(text) ? "Recommended" : undefined);
  };
  // Several answers go back as the tool asks for them: comma-separated, in the order offered.
  const sendChosen = () => answer(question.options.filter((_, index) => chosen.has(index)).map(option => answerLabel(option.label)).join(", "));
  return (
    <Approval key={`${request.tool_use_id}-${at}`} autoFocus title={question.question} description={several ? "Choose any that apply, then Continue." : undefined}
      items={question.options.map((option, index) => ({ value: String(index), label: label(option.label, index), description: option.description }))}
      onChoose={value => several ? toggle(Number(value)) : answer(answerLabel(question.options[Number(value)]?.label ?? ""))}
      onInstead={text => answer(text)} insteadPlaceholder="Something else"
      onDismiss={() => onAnswer(Object.keys(answers).length ? answers : null)} dismissLabel="skip"
      footer={several ? <Button size="sm" variant="solid" tone="neutral" disabled={!chosen.size} onClick={sendChosen}>
        {chosen.size > 1 ? `Continue with ${chosen.size}` : "Continue"}
      </Button> : undefined}
      actions={questions.length > 1 ? <span className="studio-muted">{`${at + 1} of ${questions.length}`}</span> : undefined} />
  );
}

/** A question the agent asked, as the conversation keeps it: the question, muted, and the person's answer as their own
 *  message under it; "Skipped" when they skipped. */
export function AskedQuestion({ part, answers }: { part: Tool; answers: ChatSession["answers"][string] | undefined }) {
  const questions = (Array.isArray(part.input.questions) ? part.input.questions : []) as AgentQuestion[];
  if (!questions.length) return null;
  return <div className="studio-chat__asked">
    {questions.map(question => {
      const said: ReactNode = answers === "skipped" ? <span className="studio-muted">Skipped</span> : answers?.[question.question];
      return <div key={question.question} className="studio-chat__asked-pair">
        <p className="studio-chat__asked-question">{question.question}</p>
        {said ? <Message author="user" className="studio-chat__answer">{said}</Message> : null}
      </div>;
    })}
  </div>;
}
