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
  Button, Checkbox, CheckboxGroup, Code, ColorField, ColorSwatchPicker, EmptyState, Nav, NavGroup, NavItem, PanelSection, Radio,
  RadioGroup, SectionHeading, Segmented, Stepper, StepperStep, Table,
} from "@area/react";
import { SETTING_GROUPS } from "@area/tokens/config";
import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { ChoicePreview, kindOf, ratioOf } from "../choice-visuals.tsx";
import { SETUP_SCALE } from "../app-scale.ts";
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
import { LayerMap } from "../layer-map.tsx";
import { accentSolidHex, snapAccentColour, snapPageColour } from "../page-colour.ts";

type StageView = (typeof SETUP_VIEWS)[number]["value"];

/*
 * The Setup's categories: the Inspector's, with dark's Ground and Layers in a step of their own after Color, drawn in
 * dark (owner, 2026-10-22: "separate the dark mode choice from the light mode, i shouldnt be choosing both at the same
 * time"). Color asks light's pair; Dark mode asks dark's, so each is chosen looking at its own theme.
 */
const DARK_ONLY: ReadonlySet<string> = new Set(["tint-dark", "ground-dark", "layers-dark", "card-tone-dark", "solid-dark"]);
/** The settings the stage answers with the layer map (src/layer-map.tsx) instead of the header's view. */
const LAYERED = /^((ground|layers|tint|card-tone)-(light|dark)|tint-hue|ink-tint)$/;
const SETUP_GROUPS = SETTING_GROUPS.flatMap(group => group.heading === "Color"
  ? [{ heading: "Color", settings: group.settings.filter(id => !DARK_ONLY.has(id)) }, { heading: "Dark mode", settings: group.settings.filter(id => DARK_ONLY.has(id)) }]
  : [group]);
const SETUP_STEPS: Setting[] = SETUP_GROUPS.flatMap(group => group.settings.map(id => ({ ...SETTINGS.find(entry => entry.id === id)!, heading: group.heading })));
/**
 * The greys as one first choice (owner, 2026-10-23: "presented in the beginning with the choice between neutral, to
 * warmer, to cooler, or even a color tint ... selecting any of the options will allow further customization further in"):
 * each family writes Neutral and Tint, which stay the settings, and opens only the settings that refine it, Warmer and
 * Cooler their own range of hues, Tinted every hue, Accent the accent's own.
 */
type GreyFamily = "neutral" | "warm" | "cool" | "tinted" | "accent";
const GREY_FAMILIES: ReadonlyArray<{ id: GreyFamily; label: string; picks: Partial<Record<keyof CanvasAxes, string>> }> = [
  { id: "neutral", label: "Neutral", picks: { neutral: "neutral", "tint-hue": "auto", "tint-light": "auto", "tint-dark": "auto" } },
  { id: "warm", label: "Warmer", picks: { neutral: "warm", "tint-hue": "auto", "tint-light": "auto", "tint-dark": "auto" } },
  { id: "cool", label: "Cooler", picks: { neutral: "cool", "tint-hue": "auto", "tint-light": "auto", "tint-dark": "auto" } },
  { id: "tinted", label: "Tinted", picks: { neutral: "neutral", "tint-hue": "95", "tint-light": "6", "tint-dark": "2" } },
  { id: "accent", label: "Accent", picks: { neutral: "neutral", "tint-hue": "accent", "tint-light": "3", "tint-dark": "2" } },
];
/** The hues Warmer and Cooler refine with, around Warm's 68° and Cool's 248°. */
const FAMILY_HUES: Partial<Record<GreyFamily, (hue: number) => boolean>> = { warm: hue => hue >= 25 && hue <= 100, cool: hue => hue >= 185 && hue <= 285 };
/** Which family the Canvas's Neutral and Tint draw. */
function familyOf(canvas: CanvasAxes): GreyFamily {
  const hue = canvas["tint-hue"], tinted = canvas["tint-light"] !== "auto" && canvas["tint-light"] !== "0";
  if (hue === "accent") return "accent";
  if (hue === "auto") return canvas.neutral === "warm" || canvas.neutral === "cool" ? canvas.neutral : tinted ? "tinted" : "neutral";
  const range = FAMILY_HUES[canvas.neutral as GreyFamily];
  return range?.(Number(hue)) ? canvas.neutral as GreyFamily : "tinted";
}
/** The settings each family opens: Tint hue where it has hues to choose, the strengths and Text tint wherever it tints. */
const opensFor = (family: GreyFamily, id: string) =>
  id === "tint-hue" ? family === "warm" || family === "cool" || family === "tinted"
  : id === "tint-light" || id === "tint-dark" || id === "ink-tint" ? family !== "neutral" : true;

/** A choice card's least width: a mini UI reads from about 96; a mark or a text card can be narrower (picks). */
const CHOICE_MIN = { mini: 104, mark: 88 } as const; /* pick */

/** Each step's question: what the person is choosing, in their words, not the setting's name. */
const QUESTIONS: Record<string, string> = {
  theme: "Light or dark?",
  neutral: "Neutral greys, warmer, cooler, or tinted with a colour?",
  "tint-hue": "Which hue should the greys lean toward?",
  "tint-light": "In light, how strongly should the greys take that hue?",
  "tint-dark": "In dark, how strongly should the greys take that hue?",
  "ink-tint": "How much of the tint should text take?",
  accent: "Which accent colour?",
  "accent-strength": "How much of its colour should the accent keep?",
  "solid-light": "In light, how deep should accent buttons and checked marks be?",
  "solid-dark": "In dark, how deep should accent buttons and checked marks be?",
  "ground-light": "How white should the light page be?",
  "ground-dark": "How dark should the dark page be?",
  "layers-light": "In light, how far should cards and sidebars sit from the page?",
  "layers-dark": "In dark, how far should cards and sidebars sit from the page?",
  "card-tone-light": "In light, should cards match the page, or sit darker or lighter?",
  "card-tone-dark": "In dark, should cards match the page, or sit darker or lighter?",
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
const systemContrast = () => typeof matchMedia === "function" && matchMedia("(prefers-contrast: more)").matches ? "8" : "0";

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
  const steps = SETUP_STEPS;
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
    // With nothing under the pointer, a setting that exists once per theme is drawn in its own (Dark mode in dark).
    if (!entry || !preview) return { ...picks, "data-area-theme": step ? themeOf(step.id, mode) : mode };
    const theme = entry.id === "theme" ? preview.preset : themeOf(entry.id, mode);
    if (entry.id === "theme") return { ...picks, "data-area-theme": theme };
    if (entry.id === "contrast") return { ...picks, "data-area-theme": theme, "data-area-contrast": preview.preset === "system" ? systemContrast() : preview.preset };
    if (entry.id === "pills") return { ...picks, "data-area-theme": theme, "data-area-pills": [...new Set(valueOf(entry).split(" ").filter(Boolean)).add(preview.preset)].join(" ") };
    return { ...picks, "data-area-theme": theme, [`data-area-${entry.id}`]: preview.preset };
  };

  const go = (next?: Setting) => { setPreview(undefined); select(next?.id ?? ""); };
  const groupIndex = step ? SETUP_GROUPS.findIndex(group => group.heading === step.heading) : -1;
  const group = groupIndex >= 0 ? SETUP_GROUPS[groupIndex] : undefined;
  const inGroup = step ? steps.filter(entry => entry.heading === step.heading) : [];
  const firstOf = (place: number) => steps.find(entry => entry.heading === SETUP_GROUPS[place]?.heading);
  // A setting opened from the Sidebar or a link brings its section into view in the panel.
  useEffect(() => { if (item) document.getElementById(`setup-${item}`)?.scrollIntoView({ block: "nearest" }); }, [item]);

  const presetOf = (entry: Setting, id?: string) => entry.presets.find(preset => preset.id === id);
  const choiceLabel = (entry: Setting, preset: { id: string; label: string }) => tileLabel(preset.label, isDefault(entry, preset.id) ? "Default" : undefined);
  /** The accent's own colour per option, the swatch's paint (the registry's 500 step, the solid fill). */
  // The accent axis writes its colours at full strength (`-full`); Accent strength quiets them live (axes/accent.ts).
  const accentHex = (id: string) => AXES.find(axis => axis.id === "accent")?.presets.find(preset => preset.id === id)?.tokens["--area-accent-500-full"] ?? id;
  /** A swatch choice's paint: an accent's solid; a tint hue the hue itself (Auto, Neutral's own grey). */
  const swatchOf = (entry: Setting, id: string) => entry.id === "tint-hue"
    ? (id === "auto" ? "var(--area-neutral-500)" : id === "accent" ? accentHex(valueOf(SETUP_STEPS.find(step => step.id === "accent")!)) : `oklch(0.72 0.12 ${id})`)
    : accentHex(id);
  /** The last page colour picked in each mode, and what it snapped to. */
  const [picked, setPicked] = useState<Partial<Record<Mode, { hex: string; note: string }>>>({});
  const pickPage = (theme: Mode, hex: string) => {
    const snap = snapPageColour(hex, theme);
    setCanvas(`ground-${theme}`, snap.ground); setCanvas(`tint-${theme}`, snap.tint); if (snap.hue) setCanvas("tint-hue", snap.hue);
    setPicked(current => ({ ...current, [theme]: { hex, note: `Ground ${snap.ground}, tint ${snap.tint}${snap.hue ? `, hue ${snap.hue}°` : ""}` } }));
  };
  /**
   * Pick a page colour (owner, 2026-10-22): one colour sets the mode's Ground, Tint strength and Tint hue, snapped to their
   * steps (src/page-colour.ts), so it is a shortcut to the settings below, never a setting of its own.
   */
  const pageColour = (theme: Mode) => (
    <section key={`page-${theme}`} id={`setup-page-colour-${theme}`} className="setup-choice">
      <span className="setup-choice__legend">Page colour</span>
      <span className="setup-choice__question">Pick any colour for the {theme} page; its lightness sets Ground, its strength the tint and its hue the tint hue.</span>
      <ColorField aria-label={`${theme === "light" ? "Light" : "Dark"} page colour`} value={picked[theme]?.hex ?? (theme === "light" ? "#FFFFFF" : "#020202")} onValueChange={hex => pickPage(theme, hex)} />
      <span className="studio-muted setup-choice__value">{picked[theme]?.note ?? "Snaps to the nearest Ground, tint and 5° of hue."}</span>
    </section>
  );

  /** The last accent colour picked, and what it snapped to. */
  const [pickedAccent, setPickedAccent] = useState<{ hex: string; note: string }>();
  const pickAccent = (hex: string) => {
    const snap = snapAccentColour(hex);
    setCanvas("accent", snap.accent); setCanvas("accent-strength", snap.strength); setCanvas("solid-light", snap.solid);
    const name = /^\d+$/.test(snap.accent) ? `hue ${snap.accent}°` : snap.accent[0]!.toUpperCase() + snap.accent.slice(1);
    setPickedAccent({ hex, note: `${name}, strength ${snap.strength}, Light solid ${snap.solid === "auto" ? "Auto" : snap.solid} · ΔE ${snap.distance}${snap.distance > 0.02 ? ": the nearest Area draws with a readable label" : ""}` });
  };
  /** Whether the accent's 72 hues are open: always while the accent is a hue, else after "More hues". */
  const [moreHues, setMoreHues] = useState(false);
  const family = familyOf(canvas);
  const pickFamily = (id: GreyFamily) => {
    const picks = { ...GREY_FAMILIES.find(entry => entry.id === id)!.picks };
    // Tinted keeps a hue already chosen, and Warmer or Cooler one in its own range.
    const hue = canvas["tint-hue"];
    if (id === "tinted" && /^\d+$/.test(hue)) picks["tint-hue"] = hue;
    for (const [key, value] of Object.entries(picks)) setCanvas(key as keyof CanvasAxes, value!);
  };

  /**
   * The greys' first choice: one card per family, each drawn in it. Neutral and Tint stay the settings; the sections
   * below open only for what the family refines (opensFor).
   */
  const greys = () => {
    const theme = themeOf("neutral", mode);
    const picture = (id: GreyFamily) => {
      const scope = Object.fromEntries(Object.entries(GREY_FAMILIES.find(entry => entry.id === id)!.picks).map(([key, value]) => [`data-area-${key}`, value!]));
      return <span className="setup-choice__picture" inert {...picks} data-area-theme={theme} data-area-layers-light="8" data-area-layers-dark="8" {...scope}><ChoicePreview axis="neutral" preset="neutral" /></span>;
    };
    const style = { "--area-choice-ratio": ratioOf("neutral"), "--area-choice-min": `${CHOICE_MIN.mark}px` } as CSSProperties;
    return (
      <section key="neutral" id="setup-neutral" className="setup-choice">
        <RadioGroup label="Greys" description={QUESTIONS.neutral} name="setup-greys" value={family} onValueChange={next => pickFamily(next as GreyFamily)} style={style}>
          {GREY_FAMILIES.map(entry => (
            <Radio key={entry.id} variant="card" layout="preview" value={entry.id} label={tileLabel(entry.label, entry.id === "neutral" ? "Default" : undefined)} leadingVisual={picture(entry.id)} />
          ))}
        </RadioGroup>
      </section>
    );
  };

  /** The accent: the palette's eleven, every hue in 5° steps behind More hues, and any colour, snapped (snapAccentColour). */
  const accent = (entry: Setting) => {
    const value = valueOf(entry), hue = /^\d+$/.test(value), open = hue || moreHues;
    const named = entry.presets.filter(preset => !/^\d+$/.test(preset.id)), hues = entry.presets.filter(preset => /^\d+$/.test(preset.id));
    const picker = (label: string, list: typeof entry.presets) => (
      <ColorSwatchPicker label={label} size="md" layout="row" value={swatchOf(entry, value)}
        items={list.map(preset => ({ value: swatchOf(entry, preset.id), label: choiceLabel(entry, preset) }))}
        onValueChange={hex => { const preset = list.find(candidate => swatchOf(entry, candidate.id) === hex); if (preset) pick(entry, preset.id); }} />
    );
    return (
      <section key={entry.id} id={`setup-${entry.id}`} className="setup-choice">
        <div className="setup-choice__swatches">
          <span className="setup-choice__legend">{entry.name}</span>
          <span className="setup-choice__question">{QUESTIONS.accent}</span>
          {picker(entry.name, named)}
          {open ? picker(`${entry.name}: every hue`, hues) : null}
          <span className="studio-muted setup-choice__value">{choiceLabel(entry, presetOf(entry, value) ?? { id: "", label: "—" })}</span>
          {hue ? null : <Button variant="ghost" tone="neutral" size="sm" onClick={() => setMoreHues(current => !current)}>{moreHues ? "Fewer hues" : "More hues"}</Button>}
        </div>
        <span className="setup-choice__legend">Accent colour</span>
        <span className="setup-choice__question">Pick any colour for accent buttons; its hue sets Accent, its colour Accent strength and its depth Light solid.</span>
        <ColorField aria-label="Accent colour" value={pickedAccent?.hex ?? accentSolidHex(value, canvas["accent-strength"], canvas["solid-light"])} onValueChange={pickAccent} />
        <span className="studio-muted setup-choice__value">{pickedAccent?.note ?? "Snaps to the nearest accent, strength and solid step."}</span>
      </section>
    );
  };

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
    // Tint hue offers what the greys' family refines with: Warmer and Cooler their own range, Tinted every hue.
    const offered = entry.id === "tint-hue" ? entry.presets.filter(preset => preset.id === "auto" ? family === "warm" || family === "cool"
      : preset.id === "accent" ? false : FAMILY_HUES[family]?.(Number(preset.id)) ?? true) : entry.presets;
    if (kind === "swatch") choices = (
      <div className="setup-choice__swatches">
        <span className="setup-choice__legend">{entry.name}</span>
        <span className="setup-choice__question">{description}</span>
        <ColorSwatchPicker label={entry.name} size="md" layout="row" value={swatchOf(entry, valueOf(entry))}
          items={offered.map(preset => ({ value: swatchOf(entry, preset.id), label: choiceLabel(entry, preset) }))}
          onValueChange={hex => { const preset = offered.find(candidate => swatchOf(entry, candidate.id) === hex); if (preset) pick(entry, preset.id); }} />
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
        <div className="gallery-tile__head" {...SETUP_SCALE}>
          <span className="gallery-tile__label">{previewed ? `${previewed.name}: ${choiceLabel(previewed, presetOf(previewed, preview.preset) ?? { id: "", label: "" })}` : LAYERED.test(step.id) ? `Layer map · ${themeOf(step.id, mode) === "dark" ? "Dark" : "Light"}` : SETUP_VIEWS.find(entry => entry.value === view)?.label}</span>
        </div>
        <div className="setup__stage-view" inert {...visualScope()}>
          {/* Ground and Layers draw the layer map: every region named with the layer it takes and the colour it paints. */}
          {LAYERED.test(previewed?.id ?? step.id) ? <LayerMap theme={themeOf(previewed?.id ?? step.id, mode)} />
            : previewed && STATE_SETTINGS.has(previewed.id) ? <StateDrawing axis={previewed.id} /> : <SetupDrawing view={view} axis={previewed?.id ?? step.id} preset={preview?.preset ?? ""} />}
        </div>
      </div>
      {/* The panel: the open category's settings, each a section of choices (Tesla's design page; the owner's
          Appearance picker), and the way between categories at its foot. */}
      <section className="setup__panel" aria-labelledby="setup-category" {...SETUP_SCALE}>
        <div className="setup__panel-body">
          <SectionHeading level={2} titleId="setup-category" title={group.heading}
            lede={`${groupIndex + 1} of ${SETUP_GROUPS.length} · ${inGroup.length} ${inGroup.length === 1 ? "setting" : "settings"}`} />
          {group.heading === "Color" ? pageColour("light") : group.heading === "Dark mode" ? pageColour("dark") : null}
          {inGroup.filter(entry => opensFor(family, entry.id)).map(entry => entry.id === "neutral" ? greys() : entry.id === "accent" ? accent(entry) : section(entry))}
        </div>
        <div className="setup__panel-foot">
          <div className="setup__nav">
            <Button variant="outline" tone="neutral" icon={<ArrowLeftIcon />} onClick={() => go(groupIndex > 0 ? firstOf(groupIndex - 1) : undefined)}>Back</Button>
            <div className="setup__nav-end">
              <Button variant="ghost" tone="neutral" icon={<ResetIcon />} disabled={inGroup.every(atDefault)} onClick={() => inGroup.forEach(reset)}>Use defaults</Button>
              <Button onClick={() => go(firstOf(groupIndex + 1))}>{groupIndex < SETUP_GROUPS.length - 1 ? "Continue" : "Finish"}</Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  ) : (
    // The start, and after the last category the summary: every setting with what it is set to.
    <div className="setup setup--start">
      <SectionHeading className="setup__question" level={2} title="Set up your theme"
        lede={`${steps.length} settings in ${SETUP_GROUPS.length} categories. Each shows every option; a pick sets the Canvas, so every tab shows it.`} />
      <div className="setup__nav setup__nav--start" {...SETUP_SCALE}>
        <Button onClick={() => go(steps[0])}>Start</Button>
        <CopyButton label="Copy picks" icon={<CopyIcon />} value={() => steps.map(entry => `${attributeOf(entry, valueOf(entry))}`).join(" ")} />
      </div>
      <Table size="md" interactive aria-label="Picks">
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
          {SETUP_GROUPS.map(group => {
            const rows = listed.filter(entry => entry.heading === group.heading);
            return rows.length ? <NavGroup key={group.heading} label={group.heading}>{rows.map(row)}</NavGroup> : null;
          })}
        </Nav>
      ) : (
        <>
          <Nav aria-label="Setup"><SidebarAll tab="theme" count={steps.length} current={!step} /></Nav>
          {/* The categories as a vertical Stepper (owner, 2026-10-21: the Sidebar rail): the open one lists its
              settings with what each is set to; the others say how many of theirs have changed. */}
          <Stepper className="setup-rail" orientation="vertical" current={groupIndex} nonLinear aria-label="Categories" {...SETUP_SCALE}
            onStepSelect={next => go(firstOf(next))}>
            {SETUP_GROUPS.map((group, place) => {
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
