/**
 * The Theme tab's Setup (owner, 2026-10-20: "an onboarding like experience that basically goes through each axis and
 * asks specifically what i want to pick, showing visually all the options, and allowing me to toggle through a few
 * different views for each axis choice"; inside the Theme tab, every option drawn in the view, a pick sets the Canvas).
 *
 * One step per setting, in the registry's order (SETTING_GROUPS: Color, Size, Shape, Stroke, Shadow, Effects), both
 * themes' grounds and layers included. A step asks one question, lays every option out as a card drawn in the chosen
 * view (theme-views.tsx) under that option's scope, and a pick writes the Canvas setting the Inspector holds, so the
 * Components and Testing tabs show it at once. The Sidebar lists the steps with what each is set to; All is the
 * start, and after the last step the summary of the picks. Mode's step sets the theme the page previews.
 *
 * Built from the Product UI rules: the Canvas header sets how things are shown (the view, Setup or Browse), a step's
 * cards are an Asset grid (arrow keys move, Enter or a click picks), Back and Continue are Buttons, and the Inspector
 * holds the Canvas settings and the step's facts.
 */
import { ArrowLeftIcon, CopyIcon } from "@area/icons";
import {
  AssetGrid, Button, Code, EmptyState, Nav, NavGroup, NavItem, PanelSection, SectionHeading, Segmented, Stepper,
  StepperStep, Table,
} from "@area/react";
import { SETTING_GROUPS } from "@area/tokens/config";
import type { CSSProperties, ReactNode } from "react";
import { APP_SCALE } from "../app-scale.ts";
import { CanvasSettings } from "../canvas-settings.tsx";
import { CopyButton } from "../copy.tsx";
import { Facts } from "../facts.tsx";
import { matches } from "../search.ts";
import { SidebarAll, SidebarList, useStudio, Workspace, type CanvasAxes } from "../studio.tsx";
import { Tile, TileGrid } from "../tile.tsx";
import { useViewOption, ViewControls } from "../view-controls.tsx";
import { attributeOf, defaultLabel, isDefault, SETTINGS, scopeOf, themeOf, tileLabel, type Mode, type Setting } from "./theme-settings.ts";
import { SETUP_VIEWS, SetupDrawing, type SetupView } from "./theme-views.tsx";

/** Each step's question: what the person is choosing, in their words, not the setting's name. */
const QUESTIONS: Record<string, string> = {
  theme: "Light or dark?",
  neutral: "Which grey should the interface be drawn in?",
  accent: "Which accent colour?",
  "ground-light": "How white should the light page be?",
  "ground-dark": "How dark should the dark page be?",
  "layers-light": "In light, how far should cards and sidebars sit from the page?",
  "layers-dark": "In dark, how far should cards and sidebars sit from the page?",
  action: "Should primary actions use the accent?",
  selection: "Should checked and selected states use the accent?",
  contrast: "How strong should edges and focus be?",
  type: "What size should text be?",
  density: "How much room should controls have?",
  radius: "How round should corners be?",
  pills: "Which shapes should be pills?",
  surface: "How thick should the line round surfaces be?",
  stroke: "How strong should strokes be?",
  "shadow-rest": "Should surfaces at rest have a subtle shadow?",
  elevation: "How much should menus and dialogs lift?",
  "shadow-resting": "How much should cards and panels lift at rest?",
  "shadow-field": "Should fields and outline buttons lift?",
  "shadow-size": "How far should shadows reach?",
  "shadow-softness": "How soft should shadows be?",
  "shadow-light": "Should light come from the top?",
  "shadow-color": "What colour should shadows be in light?",
  motion: "How fast should things move?",
  easing: "How should motion ease?",
};

/** The OS's contrast, which System writes nothing for: a System card shows it, not the Canvas's own pick. */
const systemContrast = () => typeof matchMedia === "function" && matchMedia("(prefers-contrast: more)").matches ? "more" : "standard";

export interface ThemeSetupProps {
  mode: Mode;
  setMode: (mode: Mode) => void;
  /** The Setup / Browse switch, first in the Canvas header. */
  flowSwitch: ReactNode;
}

export function ThemeSetup({ mode, setMode, flowSwitch }: ThemeSetupProps) {
  const { query, item, select, canvas, setCanvas } = useStudio();
  const [view, setView] = useViewOption<SetupView>("theme-setup-view", "abstract", SETUP_VIEWS.map(entry => entry.value));
  const steps = SETTINGS;
  const listed = steps.filter(entry => matches(query, entry.label, entry.id, entry.description, QUESTIONS[entry.id] ?? ""));
  const index = steps.findIndex(entry => entry.id === item);
  const step = index >= 0 ? steps[index] : undefined;

  /** What a setting is set to now: Mode is the page's preview; the rest are the Canvas's. */
  const valueOf = (entry: Setting) => entry.id === "theme" ? mode : canvas[entry.id as keyof CanvasAxes] ?? "";
  const chosen = (entry: Setting, preset: string) => entry.id === "pills" ? valueOf(entry).split(" ").includes(preset) : valueOf(entry) === preset;
  const pick = (entry: Setting, preset: string) => {
    if (entry.id === "theme") return setMode(preset as Mode);
    if (entry.id !== "pills") return setCanvas(entry.id as keyof CanvasAxes, preset);
    const on = valueOf(entry).split(" ").filter(Boolean);
    setCanvas("pills", (on.includes(preset) ? on.filter(shape => shape !== preset) : [...on, preset]).join(" "));
  };
  const valueLabel = (entry: Setting) => entry.id === "pills"
    ? entry.presets.filter(preset => chosen(entry, preset.id)).map(preset => preset.label).join(", ") || "None"
    : entry.presets.find(preset => preset.id === valueOf(entry))?.label ?? "—";

  /**
   * An option's scope on its card: the abstract drawing takes the Browse view's (the setting alone, its neighbours
   * held still); the other views take the option over the picks so far. Every card draws in its setting's theme.
   */
  const scopeFor = (entry: Setting, preset: string): Record<string, string> => {
    const theme = entry.id === "theme" ? preset : themeOf(entry.id, mode);
    if (view === "abstract") return { "data-area-theme": theme, ...scopeOf(entry, preset) };
    if (entry.id === "theme") return { "data-area-theme": preset };
    if (entry.id === "contrast") return { "data-area-theme": theme, "data-area-contrast": preset === "system" ? systemContrast() : preset };
    if (entry.id === "pills") {
      const on = new Set(valueOf(entry).split(" ").filter(Boolean)).add(preset);
      return { "data-area-theme": theme, "data-area-pills": [...on].join(" ") };
    }
    return { "data-area-theme": theme, [`data-area-${entry.id}`]: preset };
  };

  const go = (next?: Setting) => select(next?.id ?? "");
  const groupIndex = step ? SETTING_GROUPS.findIndex(group => group.heading === step.heading) : -1;
  const min = SETUP_VIEWS.find(entry => entry.value === view)!.min;

  const card = (entry: Setting, preset: { id: string; label: string }) => (
    <Tile key={preset.id} span="wide" stage="center" inert option={entry.id === "pills" ? undefined : preset.id}
      selected={chosen(entry, preset.id)} onSelect={entry.id === "pills" ? () => pick(entry, preset.id) : undefined}
      label={tileLabel(preset.label, isDefault(entry, preset.id) ? "Default" : undefined)}
      scope={{}} stageScope={scopeFor(entry, preset.id)}>
      <SetupDrawing view={view} axis={entry.id} preset={preset.id} />
    </Tile>
  );

  const canvasBody = step ? (
    <div className="setup">
      {/* Where this step sits: the categories, the current one marked; any category opens at its first setting. */}
      <Stepper className="setup__stepper" current={groupIndex} nonLinear aria-label="Categories" {...APP_SCALE}
        onStepSelect={next => go(steps.find(entry => entry.heading === SETTING_GROUPS[next]?.heading))}>
        {SETTING_GROUPS.map(group => <StepperStep key={group.heading} title={group.heading} />)}
      </Stepper>
      <SectionHeading className="setup__question" level={2} title={QUESTIONS[step.id] ?? step.name}
        lede={<>{step.description} <span className="studio-muted">Step {index + 1} of {steps.length} · {step.name}</span></>} />
      {step.id === "pills" ? (
        // Pills is a set: each shape's card turns it on or off.
        <div role="group" aria-label={step.name}><TileGrid span="wide" cards min={min}>{step.presets.map(preset => card(step, preset))}</TileGrid></div>
      ) : (
        <AssetGrid aria-label={step.name} className="setup__options" value={valueOf(step)} onValueChange={next => pick(step, next)}
          style={{ "--area-asset-card-size": `${min}px` } as CSSProperties}>
          {step.presets.map(preset => card(step, preset))}
        </AssetGrid>
      )}
      <div className="setup__nav" {...APP_SCALE}>
        <Button variant="outline" tone="neutral" icon={<ArrowLeftIcon />} onClick={() => go(steps[index - 1])}>Back</Button>
        <Button onClick={() => go(steps[index + 1])}>{index < steps.length - 1 ? "Continue" : "Finish"}</Button>
      </div>
    </div>
  ) : (
    // The start, and after the last step the summary: every setting with what it is set to.
    <div className="setup setup--start">
      <SectionHeading className="setup__question" level={2} title="Set up your theme"
        lede={`${steps.length} settings, one at a time. Each shows every option; a pick sets the Canvas, so every tab shows it.`} />
      <div className="setup__nav setup__nav--start" {...APP_SCALE}>
        <Button onClick={() => go(steps[0])}>Start</Button>
        <CopyButton label="Copy picks" icon={<CopyIcon />} value={() => steps.map(entry => `${attributeOf(entry, valueOf(entry))}`).join(" ")} />
      </div>
      <Table size="md" interactive flush aria-label="Picks">
        <thead><tr><th scope="col">Setting</th><th scope="col">Picked</th><th scope="col">Default</th></tr></thead>
        <tbody>
          {listed.map(entry => (
            <tr key={entry.id}>
              <td><a className="setup__link" href={`#theme/${entry.id}`} onClick={event => { event.preventDefault(); go(entry); }}>{entry.name}</a></td>
              <td>{valueLabel(entry)}</td>
              <td className="studio-muted">{defaultLabel(entry)}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );

  return (
    <Workspace
      sidebar={<SidebarList>{
        <Nav aria-label="Steps">
          <SidebarAll tab="theme" count={listed.length} current={!step} />
          {SETTING_GROUPS.map(group => {
            const rows = listed.filter(entry => entry.heading === group.heading);
            return rows.length ? (
              <NavGroup key={group.heading} label={group.heading}>
                {rows.map(entry => (
                  // Each step's row says what it is set to, so the picks read down the Sidebar.
                  <NavItem key={entry.id} href={`#theme/${entry.id}`} current={entry.id === step?.id}
                    onClick={event => { event.preventDefault(); go(entry); }}
                    trailing={<span className="studio-muted setup__value">{valueLabel(entry)}</span>}>
                    {entry.name}
                  </NavItem>
                ))}
              </NavGroup>
            ) : null;
          })}
        </Nav>
      }</SidebarList>}
      canvasTitle={step ? (QUESTIONS[step.id] ?? step.name) : "Set up your theme"}
      canvasScope={{ "data-area-theme": mode }}
      canvasActions={
        <ViewControls>
          {flowSwitch}
          {step ? <SegmentedViews value={view} onChange={setView} /> : null}
        </ViewControls>
      }
      canvas={!listed.length && !step ? <EmptyState title="No settings" description={`Nothing matches “${query}”.`} /> : canvasBody}
      inspector={{
        theme: <CanvasSettings />,
        design: step ? (
          <PanelSection heading="Setting">
            <Facts label="Setting" items={[
              ["Setting", `${step.heading} · ${step.label}`],
              ["Picked", valueLabel(step)],
              ["Default", defaultLabel(step)],
              ["Attribute", <Code>{attributeOf(step, step.id === "pills" ? undefined : valueOf(step))}</Code>],
              ["Controls", step.description],
            ]} />
          </PanelSection>
        ) : (
          <PanelSection heading="Setup">
            <Facts label="Setup" items={[
              ["Steps", steps.length],
              ["Picks", "Each pick sets the Canvas setting the Inspector holds; Mode sets the page's preview."],
            ]} />
          </PanelSection>
        ),
      }}
    />
  );
}

/** The view every option's card is drawn in: the setting alone, the common controls, a bento, a whole screen. */
function SegmentedViews({ value, onChange }: { value: SetupView; onChange: (view: SetupView) => void }) {
  return <Segmented size="sm" aria-label="Drawn as" value={value} onValueChange={next => onChange(next as SetupView)}
    items={SETUP_VIEWS.map(entry => ({ value: entry.value, label: entry.label }))} />;
}
