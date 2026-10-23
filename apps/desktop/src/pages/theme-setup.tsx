/**
 * The Theme tab's Setup (owner, 2026-10-20: "an onboarding like experience that basically goes through each axis and
 * asks specifically what i want to pick, showing visually all the options"; a pick sets the Canvas).
 *
 * Rebuilt 2026-10-21 (docs/research/onboarding-setup-2026-10-21.md), after a product finder's flow, Tesla's design
 * page and an Appearance picker the owner sent ("i want to separate the choices from the visual ... the choices can be
 * mostly mini ui, actual color swatches, or abstract/simple examples ... there will be a visual in the center, either a
 * component bento, desktop screen example, or mobile screen example"):
 *
 *   visual    the centre: the header's view (a bento, a desktop screen, a phone) at true scale, over the picks so far,
 *             showing the choice under the pointer or keyboard focus (a state setting's choice draws its state)
 *   panel     the open category's settings, one section each: its name and question, then its choices as choice cards
 *             (Radio and Checkbox `layout="preview"`) or swatches (choice-visuals.tsx); a pick applies at once; Back,
 *             Use defaults and Continue move between categories
 *   Sidebar   a vertical Stepper of the categories, the open one listing its settings with what each is set to
 *
 * The setup's own UI never takes the picks (Workspace `canvasPicks={false}`); only the drawings do. All is the start and
 * the summary of picks.
 */
import { ArrowLeftIcon, CopyIcon, ResetIcon } from "@area/icons";
import {
  Button, Checkbox, CheckboxGroup, Code, ColorSwatchPicker, EmptyState, Nav, NavGroup, NavItem, PanelSection, Radio,
  RadioGroup, SectionHeading, Segmented, Stepper, StepperStep, Table,
} from "@area/react";
import { SETTING_GROUPS } from "@area/tokens/config";
import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { ChoicePreview, kindOf, ratioOf } from "../choice-visuals.tsx";
import { APP_SCALE } from "../app-scale.ts";
import { CanvasSettings } from "../canvas-settings.tsx";
import { CopyButton } from "../copy.tsx";
import { Facts } from "../facts.tsx";
import { matches } from "../search.ts";
import { canvasAttributes, SidebarAll, SidebarList, useStudio, Workspace, type CanvasAxes } from "../studio.tsx";
import { useViewOption, ViewControls } from "../view-controls.tsx";
import { STATE_SETTINGS, StateDrawing } from "../abstract.tsx";
import { AXES } from "../tokens.ts";
import { attributeOf, defaultLabel, isDefault, SETTINGS, scopeOf, themeOf, tileLabel, type Mode, type Setting } from "./theme-settings.ts";
import { SETUP_VIEWS, SetupDrawing } from "./theme-views.tsx";

type StageView = (typeof SETUP_VIEWS)[number]["value"];
/** A choice card's least width: a mini UI reads from about 96; a mark or a text card can be narrower (picks). */
const CHOICE_MIN = { mini: 104, mark: 88 } as const; /* pick */

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
  selection: "Should selected states and the focus ring use the accent?",
  contrast: "How strong should edges and focus be?",
  type: "What size should text be?",
  density: "How much room should controls have?",
  radius: "How round should corners be?",
  pills: "Which shapes should be pills?",
  surface: "How thick should the line round surfaces be?",
  stroke: "How strong should strokes be?",
  "shadow-rest": "Should surfaces at rest have a subtle shadow?",
  "stroke-hover": "How much should a control's edge darken under the pointer?",
  "selected-stroke": "How thick should a selected card's edge be?",
  "focus-ring": "Where should the keyboard focus ring sit?",
  elevation: "How much should menus and dialogs lift?",
  "shadow-resting": "How much should cards and panels lift at rest?",
  "shadow-field": "Should fields and outline buttons lift?",
  "shadow-hover": "How much should a hovered card lift?",
  "shadow-size": "How far should shadows reach?",
  "shadow-softness": "How soft should shadows be?",
  "shadow-light": "Should light come from the top?",
  "shadow-color": "What colour should shadows be in light?",
  motion: "How fast should things move?",
  easing: "How should motion ease?",
  "fill-hover": "How dark should the hover plate be?",
  "fill-selected": "How much firmer should a selected row be than hover?",
  "fill-pressed": "How firm should a press be?",
  "selected-tint": "Should a selected card also fill?",
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
  const { query, item, select, canvas, setCanvas, shown: studioShown } = useStudio();
  /** The picks so far (and an Inspector hover preview), which only the drawings take: the Setup's own UI stays put. */
  const picks = canvasAttributes(studioShown.canvas, studioShown.material) as Record<string, string>;
  const [view, setView] = useViewOption<StageView>("theme-setup-view", "bento", SETUP_VIEWS.map(entry => entry.value));
  /** The choice under the pointer or keyboard focus, which the visual shows until it leaves. */
  const [preview, setPreview] = useState<{ axis: string; preset: string }>();
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
  const reset = (entry: Setting) => entry.id === "theme" ? setMode(entry.defaults[0] as Mode)
    : setCanvas(entry.id as keyof CanvasAxes, entry.defaults.join(" "));
  /** Whether a setting is still at its default (Pills: the same shapes on). */
  const atDefault = (entry: Setting) => entry.id === "pills"
    ? [...valueOf(entry).split(" ").filter(Boolean)].sort().join(" ") === [...entry.defaults].sort().join(" ")
    : isDefault(entry, valueOf(entry));

  /** A choice's picture takes the option over the picks so far, its neighbours held still, in its setting's theme. */
  const choiceScope = (entry: Setting, preset: string): Record<string, string> =>
    ({ ...picks, "data-area-theme": entry.id === "theme" ? preset : themeOf(entry.id, mode), ...scopeOf(entry, preset) });
  /** The visual takes the choice under the pointer over the picks so far, in the setting's theme (else the page's). */
  const visualScope = (): Record<string, string> => {
    const entry = preview && steps.find(candidate => candidate.id === preview.axis);
    if (!entry || !preview) return { ...picks, "data-area-theme": mode };
    const theme = entry.id === "theme" ? preview.preset : themeOf(entry.id, mode);
    if (entry.id === "theme") return { ...picks, "data-area-theme": theme };
    if (entry.id === "contrast") return { ...picks, "data-area-theme": theme, "data-area-contrast": preview.preset === "system" ? systemContrast() : preview.preset };
    if (entry.id === "pills") return { ...picks, "data-area-theme": theme, "data-area-pills": [...new Set(valueOf(entry).split(" ").filter(Boolean)).add(preview.preset)].join(" ") };
    return { ...picks, "data-area-theme": theme, [`data-area-${entry.id}`]: preview.preset };
  };

  const go = (next?: Setting) => { setPreview(undefined); select(next?.id ?? ""); };
  const groupIndex = step ? SETTING_GROUPS.findIndex(group => group.heading === step.heading) : -1;
  const group = groupIndex >= 0 ? SETTING_GROUPS[groupIndex] : undefined;
  const inGroup = step ? steps.filter(entry => entry.heading === step.heading) : [];
  const firstOf = (place: number) => steps.find(entry => entry.heading === SETTING_GROUPS[place]?.heading);
  // A setting opened from the Sidebar or a link brings its section into view in the panel.
  useEffect(() => { if (item) document.getElementById(`setup-${item}`)?.scrollIntoView({ block: "nearest" }); }, [item]);

  const presetOf = (entry: Setting, id?: string) => entry.presets.find(preset => preset.id === id);
  const choiceLabel = (entry: Setting, preset: { id: string; label: string }) => tileLabel(preset.label, isDefault(entry, preset.id) ? "Default" : undefined);
  /** The accent's own colour per option, the swatch's paint (the registry's 500 step, the solid fill). */
  const accentHex = (id: string) => AXES.find(axis => axis.id === "accent")?.presets.find(preset => preset.id === id)?.tokens["--area-accent-500"] ?? id;

  /** Pointer and focus on a section's choices preview them in the visual: the nth choice is the nth option. */
  const previewing = (entry: Setting) => {
    const at = (target: EventTarget | null, host: Element) => {
      const cell = (target as Element | null)?.closest("label");
      if (!cell || !host.contains(cell)) return undefined;
      const preset = entry.presets[[...host.querySelectorAll("label")].indexOf(cell)];
      return preset ? { axis: entry.id, preset: preset.id } : undefined;
    };
    return {
      onPointerOver: (event: { target: EventTarget; currentTarget: Element }) => setPreview(at(event.target, event.currentTarget)),
      onPointerLeave: () => setPreview(undefined),
      onFocus: (event: { target: EventTarget; currentTarget: Element }) => setPreview(at(event.target, event.currentTarget)),
      onBlur: (event: { relatedTarget: EventTarget | null; currentTarget: Element }) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setPreview(undefined);
      },
    };
  };

  /**
   * One setting's section: its name and question, then its choices. The accent is a row of its own colours; Pills, a
   * set, is checkbox cards; every other setting is radio cards, each the option's picture (a mini UI or a simple mark)
   * with its name under it. The group's keyboard is the control's: arrows move and pick.
   */
  const section = (entry: Setting) => {
    const kind = kindOf(entry.id);
    const style = { "--area-choice-ratio": ratioOf(entry.id), "--area-choice-min": `${kind === "mini" ? CHOICE_MIN.mini : CHOICE_MIN.mark}px` } as CSSProperties;
    const picture = (preset: { id: string }) => <span className="setup-choice__picture" inert {...choiceScope(entry, preset.id)}><ChoicePreview axis={entry.id} preset={preset.id} /></span>;
    const description = QUESTIONS[entry.id] ?? entry.description;
    let choices: ReactNode;
    if (kind === "swatch") choices = (
      <div className="setup-choice__swatches">
        <span className="setup-choice__legend">{entry.name}</span>
        <span className="setup-choice__question">{description}</span>
        <ColorSwatchPicker label={entry.name} size="md" layout="row" value={accentHex(valueOf(entry))}
          items={entry.presets.map(preset => ({ value: accentHex(preset.id), label: choiceLabel(entry, preset) }))}
          onValueChange={hex => { const preset = entry.presets.find(candidate => accentHex(candidate.id) === hex); if (preset) pick(entry, preset.id); }} />
        <span className="studio-muted setup-choice__value">{choiceLabel(entry, presetOf(entry, valueOf(entry)) ?? { id: "", label: "—" })}</span>
      </div>
    );
    else if (entry.id === "pills") choices = (
      <CheckboxGroup label={entry.name} description={description} style={style}>
        {entry.presets.map(preset => (
          <Checkbox key={preset.id} variant="card" layout="preview" label={choiceLabel(entry, preset)} checked={chosen(entry, preset.id)}
            onCheckedChange={() => pick(entry, preset.id)} leadingVisual={picture(preset)} />
        ))}
      </CheckboxGroup>
    );
    else choices = (
      <RadioGroup label={entry.name} description={description} name={`setup-${entry.id}`} value={valueOf(entry)} onValueChange={next => pick(entry, next)} style={style}>
        {entry.presets.map(preset => (
          <Radio key={preset.id} variant="card" layout="preview" value={preset.id} label={choiceLabel(entry, preset)} leadingVisual={picture(preset)} />
        ))}
      </RadioGroup>
    );
    return <section key={entry.id} id={`setup-${entry.id}`} className="setup-choice" {...previewing(entry)}>{choices}</section>;
  };

  const previewed = preview && steps.find(entry => entry.id === preview.axis);
  const canvasBody = step && group ? (
    <div className="setup setup--side">
      {/* The visual: the chosen view over the picks so far, showing the choice under the pointer or keyboard focus. */}
      <div className="gallery-tile gallery-tile--plain setup__stage" data-area-ground="raised">
        <div className="gallery-tile__head" {...APP_SCALE}>
          <span className="gallery-tile__label">{previewed ? `${previewed.name}: ${choiceLabel(previewed, presetOf(previewed, preview.preset) ?? { id: "", label: "" })}` : SETUP_VIEWS.find(entry => entry.value === view)?.label}</span>
        </div>
        <div className="setup__stage-view" inert {...visualScope()}>
          {previewed && STATE_SETTINGS.has(previewed.id) ? <StateDrawing axis={previewed.id} /> : <SetupDrawing view={view} axis={previewed?.id ?? step.id} preset={preview?.preset ?? ""} />}
        </div>
      </div>
      {/* The panel: the open category's settings, each a section of choices (Tesla's design page; the owner's
          Appearance picker), and the way between categories at its foot. */}
      <section className="setup__panel" aria-labelledby="setup-category" {...APP_SCALE}>
        <div className="setup__panel-body">
          <SectionHeading level={2} titleId="setup-category" title={group.heading}
            lede={`${groupIndex + 1} of ${SETTING_GROUPS.length} · ${inGroup.length} ${inGroup.length === 1 ? "setting" : "settings"}`} />
          {inGroup.map(section)}
        </div>
        <div className="setup__panel-foot">
          <div className="setup__nav">
            <Button variant="outline" tone="neutral" icon={<ArrowLeftIcon />} onClick={() => go(groupIndex > 0 ? firstOf(groupIndex - 1) : undefined)}>Back</Button>
            <div className="setup__nav-end">
              <Button variant="ghost" tone="neutral" icon={<ResetIcon />} disabled={inGroup.every(atDefault)} onClick={() => inGroup.forEach(reset)}>Use defaults</Button>
              <Button onClick={() => go(firstOf(groupIndex + 1))}>{groupIndex < SETTING_GROUPS.length - 1 ? "Continue" : "Finish"}</Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  ) : (
    // The start, and after the last category the summary: every setting with what it is set to.
    <div className="setup setup--start">
      <SectionHeading className="setup__question" level={2} title="Set up your theme"
        lede={`${steps.length} settings in ${SETTING_GROUPS.length} categories. Each shows every option; a pick sets the Canvas, so every tab shows it.`} />
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

  // Each setting's row says what it is set to, so the picks read down the Sidebar.
  const row = (entry: Setting) => (
    <NavItem key={entry.id} href={`#theme/${entry.id}`} current={entry.id === step?.id}
      onClick={event => { event.preventDefault(); go(entry); }}
      trailing={<span className="studio-muted setup__value">{valueLabel(entry)}</span>}>
      {entry.name}
    </NavItem>
  );

  return (
    <Workspace
      sidebar={<SidebarList>{query ? (
        // A search lists the matching settings under their headings.
        <Nav aria-label="Steps">
          <SidebarAll tab="theme" count={listed.length} current={!step} />
          {SETTING_GROUPS.map(group => {
            const rows = listed.filter(entry => entry.heading === group.heading);
            return rows.length ? <NavGroup key={group.heading} label={group.heading}>{rows.map(row)}</NavGroup> : null;
          })}
        </Nav>
      ) : (
        <>
          <Nav aria-label="Setup"><SidebarAll tab="theme" count={steps.length} current={!step} /></Nav>
          {/* The categories as a vertical Stepper (owner, 2026-10-21: the Sidebar rail): the open one lists its
              settings with what each is set to; the others say how many of theirs have changed. */}
          <Stepper className="setup-rail" orientation="vertical" current={groupIndex} nonLinear aria-label="Categories" {...APP_SCALE}
            onStepSelect={next => go(firstOf(next))}>
            {SETTING_GROUPS.map((group, place) => {
              const rows = steps.filter(entry => entry.heading === group.heading);
              const changed = rows.filter(entry => !atDefault(entry)).length;
              return (
                <StepperStep key={group.heading} title={group.heading}
                  description={place === groupIndex ? undefined : changed ? `${changed} of ${rows.length} changed` : `${rows.length} ${rows.length === 1 ? "setting" : "settings"}`}>
                  {place === groupIndex ? <Nav aria-label={group.heading}>{rows.map(row)}</Nav> : null}
                </StepperStep>
              );
            })}
          </Stepper>
        </>
      )}</SidebarList>}
      canvasTitle={group ? group.heading : "Set up your theme"}
      canvasPicks={false}
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

/** The visual's view: a bento of components, a desktop screen or a phone. */
function SegmentedViews({ value, onChange }: { value: StageView; onChange: (view: StageView) => void }) {
  return <Segmented size="sm" aria-label="Drawn as" value={value} onValueChange={next => onChange(next as StageView)}
    items={SETUP_VIEWS.map(entry => ({ value: entry.value, label: entry.label }))} />;
}
