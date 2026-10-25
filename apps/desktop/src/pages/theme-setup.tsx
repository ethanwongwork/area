/**
 * The Theme tab's Setup: a guided way to a theme, one question at a time (owner, 2026-10-24, after a product finder:
 * "i want to really try to build this experience with the options or sliders on the bottom for customization").
 *
 *   stage   the whole Canvas: the chosen view (a bento, a desktop screen, a phone) in the theme so far, with the rest of
 *           the library scattered faintly round it, every piece re-drawn as an answer moves
 *   dock    a card floating at the stage's foot: Back and Reset, the question, how far along; one control, the
 *           Inspector's own row at a larger size (a bar, choices drawn as cards, or swatches); Continue
 *
 * Setup and the Inspector are two ways into the same settings (the Canvas's). Quick asks the twelve that change the most;
 * Full asks about every setting (owner, 2026-10-24: "shouldnt there be more than 12 questions?"), chapter by chapter in the
 * order a theme is built (page, accent, shape and size, edges and depth, states, motion, accessibility, dark mode),
 * skipping any question the answers so far make moot, and any chapter on request. Each answer is an Inspector row, so it
 * reads there at once; the summary hands over to the Inspector. Setup's own UI stays at the app's defaults (Workspace
 * `canvasPicks={false}`); only the stage takes the picks.
 */
import { ArrowLeftIcon, CopyIcon, ResetIcon } from "@area/icons";
import { Avatar, Badge, Button, Card, CardContent, Checkbox, CheckboxGroup, Chip, ColorSwatchPicker, Kbd, Nav, NavGroup, NavItem, PanelSection, Radio, RadioGroup, Segmented, Slider, Spinner, Switch } from "@area/react";
import { useEffect, type CSSProperties, type ReactNode } from "react";
import { SETUP_SCALE } from "../app-scale.ts";
import { CanvasSettings } from "../canvas-settings.tsx";
import { ChoicePreview, ratioOf } from "../choice-visuals.tsx";
import { CopyButton } from "../copy.tsx";
import { Facts } from "../facts.tsx";
import { GALLERY_CONTROLS } from "../gallery/controls.ts";
import { hueName, SettingRow, type RowContext } from "../inspector-rows.tsx";
import { canvasAttributes, SidebarAll, SidebarList, useStudio, Workspace, type CanvasAxes } from "../studio.tsx";
import { AXES } from "../tokens.ts";
import { useViewOption, ViewControls } from "../view-controls.tsx";
import { attributeOf, SETTINGS, type Mode } from "./theme-settings.ts";
import { SETUP_VIEWS, SetupDrawing, type SetupView } from "./theme-views.tsx";

export interface ThemeSetupProps {
  mode: Mode;
  setMode: (mode: Mode) => void;
  /** The Setup / Browse switch, first in the Canvas header. */
  flowSwitch: ReactNode;
}

type Axis = keyof CanvasAxes;
interface StepContext { values: CanvasAxes; mode: Mode; set: (changes: Partial<Record<Axis, string>>) => void; row: RowContext }
interface Step {
  id: string;
  /** The chapter it belongs to (the Sidebar's and the summary's groups). */
  chapter: string;
  /** What the person is choosing, in their words. */
  question: string;
  /** Its name in the summary and the Sidebar. */
  name: string;
  /** The settings it writes. */
  axes: Axis[];
  control: (context: StepContext) => ReactNode;
  /** One of the questions Quick asks, those that change the most. */
  quick?: boolean;
  /** The mode it is asked in: the stage turns to it, as a light/dark pair is set one mode at a time. */
  mode?: Mode;
  /** Asked only when it changes something under the answers so far (the finder skips what cannot apply). */
  when?: (values: CanvasAxes) => boolean;
}

const controlOf = (axis: string) => GALLERY_CONTROLS.find(entry => entry.axis === axis)!;
const say = (axis: string, value: string) => controlOf(axis).items.find(item => item.value === value)?.label ?? value;
/** The Inspector's own row for a setting, at the dock's size. */
const row = (axis: string) => ({ row }: StepContext) => <SettingRow axis={axis} context={row} />;
/** Choices drawn as cards: each option's picture (choice-visuals.tsx) in the theme so far, its name under it. */
function Cards({ name, value, options, onPick, axis, scope, ratio = "4 / 3" }: {
  name: string; value: string; options: ReadonlyArray<{ value: string; label: string; scope?: Record<string, string> }>;
  onPick: (value: string) => void; axis: string; scope: Record<string, string>; ratio?: string;
}) {
  // The options share the dock's width, as the finder's do: each column its share, less the group's 8 gaps (choice.css).
  const style = { "--area-choice-ratio": ratio, "--area-choice-min": `calc((100% - ${options.length - 1} * var(--area-space-8)) / ${options.length} - 0.5px)` } as CSSProperties;
  return (
    <RadioGroup label={name} name={`setup-${name}`} value={value} onValueChange={onPick} style={style} className="setup-cards">
      {options.map(option => (
        <Radio key={option.value} variant="card" layout="preview" value={option.value} label={option.label}
          leadingVisual={<span className="setup-choice__picture" inert {...scope} {...option.scope}><ChoicePreview axis={axis} preset={option.value} /></span>} />
      ))}
    </RadioGroup>
  );
}
/** A setting's own options as cards, each drawn at its value. */
const cards = (axis: Axis, label?: (value: string) => string) => ({ values, set, row: context }: StepContext) => (
  <Cards name={controlOf(axis).label} axis={axis} ratio={ratioOf(axis)} value={values[axis]} scope={context.values as Record<string, string>}
    options={controlOf(axis).items.map(item => ({ value: item.value, label: label?.(item.value) ?? item.label, scope: { [`data-area-${axis}`]: item.value } }))}
    onPick={next => set({ [axis]: next })} />
);
/** Pills: several shapes on at once, as cards that check. */
const pillCards = ({ values, set, row: context }: StepContext) => {
  const on = values.pills.split(" ").filter(Boolean), items = controlOf("pills").items;
  const style = { "--area-choice-ratio": ratioOf("pills"), "--area-choice-min": "96px" } as CSSProperties; /* pick: eight shapes wrap to two rows */
  return (
    <CheckboxGroup label="Pills" className="setup-cards" style={style}>
      {items.map(item => (
        <Checkbox key={item.value} variant="card" layout="preview" label={item.label} checked={on.includes(item.value)}
          onCheckedChange={() => set({ pills: items.map(entry => entry.value).filter(name => name === item.value ? !on.includes(name) : on.includes(name)).join(" ") })}
          leadingVisual={<span className="setup-choice__picture" inert {...(context.values as Record<string, string>)} data-area-pills={item.value}><ChoicePreview axis="pills" preset={item.value} /></span>} />
      ))}
    </CheckboxGroup>
  );
};
/** Asked only while the setting has an effect (controls.ts `inactive`), in the mode it is asked in. */
const active = (axis: Axis, mode: Mode = "light") => (values: CanvasAxes) => !controlOf(axis).inactive?.(values, mode);

/** Where the accent shows: Buttons (Action) and Selection, the four ways they combine. */
const WHERE = [
  { value: "neutral neutral", label: "Nowhere" },
  { value: "neutral accent", label: "Selection" },
  { value: "accent neutral", label: "Buttons" },
  { value: "accent accent", label: "Both" },
] as const;
/** The accent's own colour per option: the registry's 500 step at full strength. */
const accentHex = (id: string) => AXES.find(axis => axis.id === "accent")?.presets.find(preset => preset.id === id)?.tokens["--area-accent-500-full"] ?? id;
const NAMED_ACCENTS = controlOf("accent").items.filter(item => !/^\d+$/.test(item.value));
const ACCENT_HUES = controlOf("accent").items.filter(item => /^\d+$/.test(item.value)).map(item => item.value).sort((a, b) => Number(a) - Number(b));
const accentShows = (values: CanvasAxes) => values.action === "accent" || values.selection === "accent";

/**
 * Every question, in the order a theme is built (owner, 2026-10-24: "shouldnt there be more than 12 questions?"): Quick asks
 * the twelve marked `quick`; Full asks them all, chapter by chapter, skipping any that cannot change anything under the
 * answers so far. A light/dark pair is asked in light in its chapter and again in Dark mode, with the stage turned to it.
 */
const STEPS: readonly Step[] = [
  // Page
  { id: "page", chapter: "Page", name: "Page", question: "How bright should the page be?", axes: ["ground-light"], mode: "light", quick: true, control: row("ground-light") },
  { id: "greys", chapter: "Page", name: "Greys", question: "Should the greys lean cool or warm, or toward a colour?", axes: ["neutral", "tint-hue", "tint-light", "tint-dark"], quick: true, control: row("neutral") },
  { id: "text-tint", chapter: "Page", name: "Text tint", question: "Should text take some of the greys' colour?", axes: ["ink-tint"], when: active("ink-tint"), control: row("ink-tint") },
  { id: "layers", chapter: "Page", name: "Layers", question: "How far should cards and sidebars sit from the page?", axes: ["layers-light"], mode: "light", quick: true, control: row("layers-light") },
  { id: "cards", chapter: "Page", name: "Card shade", question: "Should cards match the page, or sit lighter or darker?", axes: ["card-tone-light"], mode: "light", control: row("card-tone-light") },
  // Accent
  {
    id: "accent", chapter: "Accent", name: "Accent", question: "Which accent colour?", axes: ["accent"], quick: true,
    control: ({ values, set, row: context }) => {
      const custom = /^\d+$/.test(values.accent);
      return (
        <div className="setup-stack">
          <ColorSwatchPicker label="Accent" size="lg" layout="row" value={custom ? "" : accentHex(values.accent)}
            items={NAMED_ACCENTS.map(item => ({ value: accentHex(item.value), label: item.label }))}
            onValueChange={hex => { const item = NAMED_ACCENTS.find(entry => accentHex(entry.value) === hex); if (item) set({ accent: item.value }); }} />
          <Segmented size={context.size} aria-label="Accent source" items={[{ value: "named", label: "Palette" }, { value: "custom", label: "Any hue" }]} value={custom ? "custom" : "named"}
            onValueChange={next => set({ accent: next === "custom" ? "200" : "blue" })} />
          {custom ? (
            <Slider variant="field" size={context.size} label="Hue" min={0} max={ACCENT_HUES.length - 1} step={1} value={Math.max(0, ACCENT_HUES.indexOf(values.accent))}
              readout={(at: number) => `${hueName(Number(ACCENT_HUES[at]))} · ${ACCENT_HUES[at]}°`} onValueChange={at => set({ accent: ACCENT_HUES[at]! })} />
          ) : null}
        </div>
      );
    },
  },
  { id: "saturation", chapter: "Accent", name: "Saturation", question: "How vivid should the accent be?", axes: ["accent-strength"], quick: true, control: row("accent-strength") },
  {
    id: "where", chapter: "Accent", name: "Accent use", question: "Where should the accent show?", axes: ["action", "selection"], quick: true,
    control: ({ values, set, row: context }) => (
      <Cards name="Accent use" axis="selection" value={`${values.action} ${values.selection}`} scope={context.values as Record<string, string>}
        options={WHERE.map(option => { const [action, selection] = option.value.split(" "); return { ...option, scope: { "data-area-action": action!, "data-area-selection": selection! } }; })}
        onPick={next => { const [action, selection] = next.split(" "); set({ action: action!, selection: selection! }); }} />
    ),
  },
  { id: "button-shade", chapter: "Accent", name: "Button shade", question: "How light or deep should accent buttons be?", axes: ["solid-light"], mode: "light", when: accentShows, control: row("solid-light") },
  { id: "label-tint", chapter: "Accent", name: "Label tint", question: "Should text on accent buttons take a little of the accent?", axes: ["label-tint"], when: accentShows, control: row("label-tint") },
  { id: "status", chapter: "Accent", name: "Status colours", question: "Should red, amber and green messages mute with the accent?", axes: ["status-colours"], when: active("status-colours"), control: cards("status-colours") },
  // Shape and size
  { id: "corners", chapter: "Shape and size", name: "Corners", question: "How round should corners be?", axes: ["radius"], quick: true, control: row("radius") },
  { id: "pills", chapter: "Shape and size", name: "Pills", question: "Which parts should be fully round?", axes: ["pills"], control: pillCards },
  { id: "text", chapter: "Shape and size", name: "Text size", question: "How large should text be?", axes: ["type"], quick: true, control: cards("type", value => `${value}px`) },
  { id: "room", chapter: "Shape and size", name: "Room", question: "How much room should controls have?", axes: ["density"], quick: true, control: cards("density") },
  // Edges and depth
  { id: "outline", chapter: "Edges and depth", name: "Outline", question: "How thick should outlines round cards and panels be?", axes: ["surface"], control: row("surface") },
  { id: "edges", chapter: "Edges and depth", name: "Edges", question: "How strong should edges be?", axes: ["stroke"], quick: true, control: row("stroke") },
  { id: "edge-shadow", chapter: "Edges and depth", name: "Soft edge", question: "Should surfaces have a soft shadow edge?", axes: ["shadow-rest"], control: row("shadow-rest") },
  { id: "resting", chapter: "Edges and depth", name: "Resting lift", question: "How much should cards and panels lift off the page?", axes: ["shadow-resting"], control: row("shadow-resting") },
  { id: "lift", chapter: "Edges and depth", name: "Lift", question: "How much should menus and dialogs lift?", axes: ["elevation"], quick: true, control: row("elevation") },
  { id: "fields", chapter: "Edges and depth", name: "Field lift", question: "Should fields and outline buttons lift a little?", axes: ["shadow-field"], control: row("shadow-field") },
  { id: "reach", chapter: "Edges and depth", name: "Shadow reach", question: "How far should shadows reach?", axes: ["shadow-size"], control: row("shadow-size") },
  { id: "softness", chapter: "Edges and depth", name: "Softness", question: "How soft should shadows be?", axes: ["shadow-softness"], control: row("shadow-softness") },
  { id: "light", chapter: "Edges and depth", name: "Light", question: "Should light catch the top of raised surfaces?", axes: ["shadow-light"], control: row("shadow-light") },
  { id: "shadow-colour", chapter: "Edges and depth", name: "Shadow colour", question: "What colour should shadows be?", axes: ["shadow-color"], mode: "light", control: cards("shadow-color") },
  // States
  { id: "hover", chapter: "States", name: "Hover", question: "How dark should a hovered row be?", axes: ["fill-hover"], control: row("fill-hover") },
  { id: "hover-edge", chapter: "States", name: "Hover edge", question: "How much should an edge darken under the pointer?", axes: ["stroke-hover"], when: active("stroke-hover"), control: row("stroke-hover") },
  { id: "hover-lift", chapter: "States", name: "Hover lift", question: "How much should a hovered card lift?", axes: ["shadow-hover"], control: row("shadow-hover") },
  { id: "selected", chapter: "States", name: "Selected", question: "How much firmer should a selected row be than a hovered one?", axes: ["fill-selected"], control: row("fill-selected") },
  { id: "selected-edge", chapter: "States", name: "Selected edge", question: "How thick should a selected card's edge be?", axes: ["selected-stroke"], control: cards("selected-stroke", value => `${value}px`) },
  { id: "selected-tint", chapter: "States", name: "Selected fill", question: "Should a selected card also fill?", axes: ["selected-tint"], control: cards("selected-tint") },
  { id: "pressed", chapter: "States", name: "Pressed", question: "How firm should a press be?", axes: ["fill-pressed"], control: row("fill-pressed") },
  { id: "focus", chapter: "States", name: "Focus ring", question: "Where should the keyboard focus ring sit?", axes: ["focus-ring"], control: cards("focus-ring") },
  { id: "danger", chapter: "States", name: "Danger hover", question: "Should a destructive row hover red?", axes: ["danger-hover"], control: cards("danger-hover") },
  // Motion
  { id: "motion", chapter: "Motion", name: "Speed", question: "How fast should things move?", axes: ["motion"], quick: true, control: row("motion") },
  { id: "easing", chapter: "Motion", name: "Easing", question: "How should motion speed up and settle?", axes: ["easing"], when: values => values.motion !== "0", control: cards("easing") },
  // Accessibility
  { id: "contrast", chapter: "Accessibility", name: "Contrast", question: "How much extra contrast should edges and focus have?", axes: ["contrast"], control: row("contrast") },
  // Dark mode: the pairs again, the stage turned to dark.
  { id: "dark-page", chapter: "Dark mode", name: "Dark page", question: "In dark mode, how dark should the page be?", axes: ["ground-dark"], mode: "dark", control: row("ground-dark") },
  { id: "dark-layers", chapter: "Dark mode", name: "Dark layers", question: "In dark mode, how far should cards and sidebars sit from the page?", axes: ["layers-dark"], mode: "dark", control: row("layers-dark") },
  { id: "dark-cards", chapter: "Dark mode", name: "Dark card shade", question: "In dark mode, should cards match the page, or sit lighter or darker?", axes: ["card-tone-dark"], mode: "dark", control: row("card-tone-dark") },
  { id: "dark-button-shade", chapter: "Dark mode", name: "Dark button shade", question: "In dark mode, how light or deep should accent buttons be?", axes: ["solid-dark"], mode: "dark", when: accentShows, control: row("solid-dark") },
];
const CHAPTERS = [...new Set(STEPS.map(step => step.chapter))];

/** The rest of the library, faint round the view, re-drawn with every answer (the finder's other products). */
const SCATTER: ReadonlyArray<{ x: number; y: number; node: ReactNode }> = [
  { x: 6, y: 10, node: <Button size="sm">Button</Button> },
  { x: 20, y: 30, node: <Switch defaultChecked aria-label="Label" /> },
  { x: 8, y: 52, node: <Badge tone="info">Badge</Badge> },
  { x: 16, y: 74, node: <Checkbox defaultChecked aria-label="Label" /> },
  { x: 4, y: 88, node: <Chip>Chip</Chip> },
  { x: 86, y: 12, node: <Avatar size="sm" alt="David Tee" fallback="DT" /> },
  { x: 78, y: 32, node: <Kbd keys={["Mod", "K"]} /> },
  { x: 92, y: 48, node: <Button size="sm" variant="outline">Button</Button> },
  { x: 82, y: 70, node: <Spinner aria-label="Loading" /> },
  { x: 94, y: 86, node: <Badge tone="success">Badge</Badge> },
];

type Path = "quick" | "full";

export function ThemeSetup({ mode, setMode, flowSwitch }: ThemeSetupProps) {
  const { item, select, canvas, setCanvas, shown, setInspectorView, showInspector } = useStudio();
  const [view, setView] = useViewOption<SetupView>("theme-setup-view", "bento", SETUP_VIEWS.map(entry => entry.value));
  const [path, setPath] = useViewOption<Path>("theme-setup-path", "quick", ["quick", "full"]);
  // The questions on this path that can change something under the answers so far.
  const steps = STEPS.filter(step => (path === "full" || step.quick) && (!step.when || step.when(canvas)));
  const step = STEPS.find(entry => entry.id === item);
  const index = step ? steps.indexOf(step) : -1;
  const done = item === "done";
  const stageMode = step?.mode ?? mode;
  // A question asked in one mode turns the stage to it (a light/dark pair is set one mode at a time).
  useEffect(() => { if (step?.mode && step.mode !== mode) setMode(step.mode); }, [step?.id]);
  const picks = canvasAttributes(shown.canvas, shown.material) as Record<string, string>;
  const stageScope = { ...picks, "data-area-theme": stageMode };
  const set = (changes: Partial<Record<Axis, string>>) => { for (const [axis, value] of Object.entries(changes)) setCanvas(axis as Axis, value!); };
  const context: StepContext = {
    values: canvas, mode: stageMode, set,
    row: { values: canvas, mode: stageMode, size: "lg", set: changes => set(changes as Partial<Record<Axis, string>>) },
  };
  const go = (next?: string) => select(next ?? "");
  const start = (next: Path) => { setPath(next); go(STEPS.find(entry => next === "full" || entry.quick)!.id); };
  const defaultOf = (axis: Axis) => GALLERY_CONTROLS.find(control => control.axis === axis)?.defaultValue ?? "";
  const reset = (target: Step) => set(Object.fromEntries(target.axes.map(axis => [axis, defaultOf(axis)])));
  const atDefault = (target: Step) => target.axes.every(axis => canvas[axis] === defaultOf(axis));
  /** What a step is set to, in its own words (the summary and the Sidebar). */
  const answer = (target: Step): string => {
    if (target.id === "where") return WHERE.find(option => option.value === `${canvas.action} ${canvas.selection}`)?.label ?? "";
    if (target.id === "greys") return canvas.neutral === "neutral" && canvas["tint-hue"] === "auto" ? "Neutral" : canvas["tint-hue"] === "auto" ? `${canvas.neutral === "cool" ? "Cool" : "Warm"}` : canvas["tint-hue"] === "accent" ? "Accent tint" : `${hueName(Number(canvas["tint-hue"]))} tint`;
    if (target.id === "accent") return /^\d+$/.test(canvas.accent) ? `${hueName(Number(canvas.accent))} · ${canvas.accent}°` : say("accent", canvas.accent);
    if (target.id === "text") return `${canvas.type}px`;
    if (target.id === "pills") return canvas.pills.split(" ").filter(Boolean).length ? `${canvas.pills.split(" ").filter(Boolean).length} shapes` : "None";
    const axis = target.axes[0]!;
    return say(axis, canvas[axis]);
  };
  const fineTune = () => { setInspectorView("theme"); showInspector(); };
  const next = index >= 0 && index < steps.length - 1 ? steps[index + 1] : undefined;
  const previous = index > 0 ? steps[index - 1] : undefined;
  // Skip section: on to the first question of the next chapter on this path.
  const nextChapter = step ? steps.slice(Math.max(0, index) + 1).find(entry => entry.chapter !== step.chapter) : undefined;

  const dock = step ? (
    <Card size="lg" className="setup-dock" {...SETUP_SCALE}><CardContent className="setup-dock__body">
      <div className="setup-dock__head">
        <Button variant="ghost" tone="neutral" size="sm" iconOnly aria-label="Back" icon={<ArrowLeftIcon />} onClick={() => go(previous?.id)} />
        <Button variant="ghost" tone="neutral" size="sm" iconOnly aria-label="Reset this answer" icon={<ResetIcon />} disabled={atDefault(step)} onClick={() => reset(step)} />
        <h2 className="setup-dock__question">{step.question}</h2>
        <span className="setup-dock__count">{step.chapter} · {index >= 0 ? `${index + 1} of ${steps.length}` : "skipped"}</span>
      </div>
      <div className="setup-dock__control">{step.control(context)}</div>
      <div className="setup-dock__foot">
        {path === "full" && nextChapter && nextChapter !== next ? <Button size="lg" variant="ghost" tone="neutral" onClick={() => go(nextChapter.id)}>Skip {step.chapter.toLowerCase()}</Button> : null}
        <span className="setup-dock__grow"><Button size="lg" fullWidth onClick={() => go(next?.id ?? "done")}>{next ? "Continue" : "Finish"}</Button></span>
      </div>
    </CardContent></Card>
  ) : done ? (
    // The summary: every answer by chapter, and the way into the Inspector for everything else.
    <Card size="lg" className="setup-dock" {...SETUP_SCALE}><CardContent className="setup-dock__body">
      <div className="setup-dock__head">
        <Button variant="ghost" tone="neutral" size="sm" iconOnly aria-label="Back" icon={<ArrowLeftIcon />} onClick={() => go(steps[steps.length - 1]?.id)} />
        <span />
        <h2 className="setup-dock__question">Your theme</h2>
        <span className="setup-dock__count">{steps.length} answers</span>
      </div>
      <div className="setup-summary">
        {CHAPTERS.map(chapter => {
          const rows = steps.filter(target => target.chapter === chapter);
          return rows.length ? (
            <section key={chapter} className="setup-summary__chapter">
              <h3 className="setup-summary__heading">{chapter}</h3>
              <dl className="setup-summary__rows">
                {rows.map(target => (
                  <div key={target.id} className="setup-summary__row">
                    <dt><a className="setup__link" href={`#theme/${target.id}`} onClick={event => { event.preventDefault(); go(target.id); }}>{target.name}</a></dt>
                    <dd>{answer(target)}</dd>
                  </div>
                ))}
              </dl>
            </section>
          ) : null;
        })}
      </div>
      <div className="setup-dock__actions">
        <CopyButton label="Copy theme" icon={<CopyIcon />} value={() => SETTINGS.filter(entry => entry.id !== "theme" && !(entry.id === "contrast" && canvas.contrast === "system"))
          .map(entry => attributeOf(entry, canvas[entry.id as Axis])).join(" ")} />
        {path === "quick" ? <Button variant="outline" tone="neutral" onClick={() => start("full")}>Ask everything</Button> : null}
        <Button variant="outline" tone="neutral" onClick={() => go(steps[0]?.id)}>Start over</Button>
        <Button onClick={fineTune}>Fine-tune in the Inspector</Button>
      </div>
    </CardContent></Card>
  ) : (
    <Card size="lg" className="setup-dock" {...SETUP_SCALE}><CardContent className="setup-dock__body">
      <div className="setup-dock__head setup-dock__head--start">
        <h2 className="setup-dock__question">Build your theme</h2>
      </div>
      <p className="setup-dock__lede">Quick asks the twelve questions that change the most. Full asks about every setting, chapter by chapter, skipping what your answers make moot; you can skip any chapter. Every answer draws the library above at once, and the Inspector holds everything for fine-tuning.</p>
      <div className="setup-dock__actions">
        <Button variant="ghost" tone="neutral" onClick={fineTune}>Open the Inspector</Button>
        <Button variant="outline" tone="neutral" onClick={() => start("full")}>Full · {STEPS.filter(entry => !entry.when || entry.when(canvas)).length} questions</Button>
        <Button onClick={() => start("quick")}>Quick · {STEPS.filter(entry => entry.quick).length} questions</Button>
      </div>
    </CardContent></Card>
  );

  const canvasBody = (
    <div className="setup-flow">
      {/* The stage: the view in the theme so far, the rest of the library faint round it. */}
      <div className="setup-flow__stage" inert {...stageScope}>
        <div className="setup-flow__scatter" aria-hidden="true">
          {SCATTER.map((piece, at) => <span key={at} className="setup-flow__piece" style={{ insetInlineStart: `${piece.x}%`, insetBlockStart: `${piece.y}%` }}>{piece.node}</span>)}
        </div>
        <div className="setup-flow__view"><SetupDrawing view={view} axis={step?.axes[0] ?? ""} preset="" /></div>
      </div>
      <div className="setup-flow__dock">{dock}</div>
    </div>
  );

  return (
    <Workspace
      sidebar={<SidebarList>
        <Nav aria-label="Setup">
          <SidebarAll tab="theme" count={steps.length} current={!step && !done} />
          {CHAPTERS.map(chapter => {
            const rows = steps.filter(target => target.chapter === chapter);
            return rows.length ? (
              <NavGroup key={chapter} label={chapter}>
                {rows.map(target => (
                  <NavItem key={target.id} href={`#theme/${target.id}`} current={target.id === step?.id}
                    onClick={event => { event.preventDefault(); go(target.id); }}
                    trailing={<span className="studio-muted setup__value">{answer(target)}</span>}>
                    {target.name}
                  </NavItem>
                ))}
              </NavGroup>
            ) : null;
          })}
          <NavItem href="#theme/done" current={done} onClick={event => { event.preventDefault(); go("done"); }}>Your theme</NavItem>
        </Nav>
      </SidebarList>}
      canvasTitle={step ? step.name : done ? "Your theme" : "Build your theme"}
      canvasPicks={false}
      canvasActions={
        <ViewControls>
          {flowSwitch}
          <Segmented size="sm" aria-label="Questions" value={path} onValueChange={next => setPath(next as Path)} items={[{ value: "quick", label: "Quick" }, { value: "full", label: "Full" }]} />
          <Segmented size="sm" aria-label="Mode" value={mode} onValueChange={next => setMode(next as Mode)} items={[{ value: "light", label: "Light" }, { value: "dark", label: "Dark" }]} />
          <Segmented size="sm" aria-label="Drawn as" value={view} onValueChange={next => setView(next as SetupView)} items={SETUP_VIEWS.map(entry => ({ value: entry.value, label: entry.label }))} />
        </ViewControls>
      }
      canvas={canvasBody}
      inspector={{
        theme: <CanvasSettings />,
        design: (
          <PanelSection heading="Setup">
            <Facts label="Setup" items={[
              ["Questions", `${steps.length} on ${path === "quick" ? "Quick" : "Full"}`],
              ["Step", step ? `${step.chapter} · ${step.name}` : done ? "Summary" : "Start"],
              ["Sets", step ? step.axes.join(", ") : "The settings each answer names; the Inspector holds them all"],
            ]} />
          </PanelSection>
        ),
      }}
    />
  );
}
