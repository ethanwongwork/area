/**
 * Setup's questionnaire (owner, 2026-10-24: "a detailed questionnaire process (can and should be as many questions as you
 * deem necessary) ... the exact correct visual for each question, to show exactly how the choices change ... a
 * combination of simple visual and text only cards as the options, or even large sliders, toggles"). The data the flow
 * (theme-setup.tsx) walks: chapters in the order a design system is built, and every question in them.
 *
 * A question says what is being decided in the person's words, what it changes and where (`description`), and which parts
 * of the product screen it changes (`focus`, pointed at on the stage). Its control is one of:
 *
 *   cards     choices as cards, each the question's close-up of the screen (`visual`) under that choice and its name;
 *             what the choice is for shows once under them. `fine` folds a bar under them for the exact value.
 *   slider    one large bar over an ordered setting, its marks named; the stage is its picture
 *   toggle    on or off, with a bar for how much when on
 *   accent, tint, pills   the three that need their own: swatches and any hue; several shapes at once
 *   page      a mode's page as one exact colour (2026-10-27): Area's Color picker over the colours Area paints, with
 *             Neutral, Cool and Warm as starting points
 *
 * Every choice writes Inspector settings (`set`), so an answer reads there at once. A question is asked only while it can
 * change something (`when`), in the mode it belongs to (`mode`); Essentials asks the ones marked `essential`.
 */
import type { CanvasAxes } from "../studio.tsx";
import { greysTinted } from "../gallery/controls.ts";
import { pickTinted, type ColoursState } from "../colours.ts";
import type { Hold, Region } from "../setup-screen.tsx";

export type Axis = keyof CanvasAxes;
export type Mode = "light" | "dark";
export type Values = Readonly<CanvasAxes>;

export interface Choice {
  label: string;
  /** What this choice is for, in a line. */
  caption: string;
  /** The settings it writes. */
  set: Partial<Record<Axis, string>>;
}

/** How a question's choices are pictured: a close-up of one region of the screen at one zoom for every choice, or a
 * picture of its own (a switch moving at the speed, the curve). */
export type Visual =
  | { kind: "crop"; region: Region; zoom: number; hold?: Hold[]; fidelity?: "shapes" | "bars" | "real" }
  | { kind: "motion" }
  | { kind: "easing" }
  | { kind: "press" };

export type Control =
  | { kind: "cards"; choices: Choice[]; visual: Visual; fine?: Axis }
  | { kind: "slider"; axis: Axis; also?: Axis[]; low: string; high: string; marks?: Array<{ value: string; label: string }> }
  | { kind: "toggle"; axis: Axis; also?: Axis[]; label: string; off: string; on: string; low: string; high: string; visual?: Visual }
  | { kind: "accent"; visual: Visual }
  | { kind: "tint"; visual: Visual }
  | { kind: "page"; mode: Mode }
  | { kind: "pills" };

export type ChapterId = "colours" | "page" | "accent" | "size" | "shape" | "lines" | "depth" | "states" | "motion" | "access" | "dark";
export interface Chapter {
  id: ChapterId;
  title: string;
  /** What the chapter decides and why it comes here, on its opening card. */
  lede: string;
  /** The parts the chapter changes, pointed at while its opening card shows. */
  focus: Region[];
}

export interface Question {
  id: string;
  chapter: ChapterId;
  /** Its name in the outline and the review. */
  name: string;
  /** What the person is deciding. */
  question: string;
  /** What it changes and where, and what to weigh. */
  description: string;
  /** A short aside under the choices: a rule of thumb, or what the system holds for you. */
  note?: string;
  axes: Axis[];
  control: Control;
  /** The parts of the screen it changes under the answers so far; none means the whole screen. */
  focus: Region[] | ((values: Values) => Region[]);
  /** States the stage holds while it is asked (the menu open, a field focused). */
  hold?: Hold[];
  /** Real text where the text's colour is the question. */
  fidelity?: "bars" | "real";
  essential?: boolean;
  /** A setting elsewhere that changes what this question shows, said under it with a way to undo it, or null. */
  context?: (values: Values) => { note: string; action: string; set: Partial<Record<Axis, string>> } | null;
  mode?: Mode;
  /** `colours`: the exact page colours picked (src/colours.ts), which stand in for a mode's page settings. */
  when?: (values: Values, colours: ColoursState) => boolean;
}

export const CHAPTERS: readonly Chapter[] = [
  // Colours first (owner, 2026-10-27, the exact colours plan: "Every later question applies these colours; the dark page
  // pick moves up from the Dark mode chapter").
  { id: "colours", title: "Colours", focus: [],
    lede: "Your page in light and in dark, and your accent: the colours every later answer applies." },
  { id: "page", title: "Page", focus: ["sidebar", "stats", "list"],
    lede: "How text and layers sit on your page." },
  { id: "accent", title: "Accent", focus: ["primary", "checks", "switch", "tabs"],
    lede: "Where your accent appears, and how vivid and deep it is." },
  { id: "size", title: "Text and room", focus: ["text", "sidebar", "list"],
    lede: "How large text is and how much room controls get." },
  { id: "shape", title: "Shape", focus: ["stats", "field", "primary"],
    lede: "How round corners are, and which parts go fully round." },
  { id: "lines", title: "Lines", focus: ["stats", "list", "form"],
    lede: "How thick outlines are and how strong edges are." },
  { id: "depth", title: "Depth", focus: ["menu", "stats", "field"],
    lede: "How far menus, cards and fields lift, and the shadow's character." },
  { id: "states", title: "Interaction", focus: ["nav-hover", "button", "field"],
    lede: "How things answer the pointer and the keyboard." },
  { id: "motion", title: "Motion", focus: ["switch"],
    lede: "How fast things move, how they settle, and how controls answer a press." },
  { id: "access", title: "Accessibility", focus: ["list", "form"],
    lede: "How far contrast goes beyond the guidelines." },
  { id: "dark", title: "Dark mode", focus: ["sidebar", "stats", "action"],
    lede: "Your answers carry over; dark decides a few things for itself." },
];

/** A close-up: drawn as shapes alone by default (no word bars), so a card shows the change and little else. */
const crop = (region: Region, zoom: number, extra: { hold?: Hold[]; fidelity?: "shapes" | "bars" | "real" } = {}): Visual => ({ kind: "crop", region, zoom, ...extra });
const one = (axis: Axis) => (value: string, label: string, caption: string): Choice => ({ label, caption, set: { [axis]: value } });
const accentShows = (values: Values) => values.action === "accent" || values.selection === "accent";
/** Where the accent paints under the answers so far: the primary buttons (Action), the selection marks (Selection). */
const accentParts = (values: Values): Region[] => [
  ...(values.action === "accent" ? ["primary", "action"] as Region[] : []),
  ...(values.selection === "accent" ? ["checks", "switch", "segmented", "tabs", "slider"] as Region[] : []),
];
/** The accent's fills sit at a chosen shade, so they no longer match the swatch picked (owner, 2026-10-24: "doesnt make the
    accent color the blue that i picked at 100% saturation, it looks dark"). */
const fillShade = (values: Values) => values["solid-light"] === "auto" ? null
  : { note: `Accent fills are set to a fixed shade (${Number(values["solid-light"]) >= 650 ? "deep" : Number(values["solid-light"]) <= 500 ? "light" : "medium"}), so they look different from the swatch.`, action: "Match the swatch", set: { "solid-light": "auto" } };
/** The parts an accent solid fills: accent buttons, checked boxes and switches. */
const solidParts = (values: Values): Region[] => [...(values.action === "accent" ? ["primary", "action"] as Region[] : []), ...(values.selection === "accent" ? ["checks", "switch"] as Region[] : [])];

const solid = one("solid-light"), darkSolid = one("solid-dark");
/**
 * The Page chapter's lightness settings are sliders over every position (owner, 2026-10-26: "a slider that adjusts to every
 * possible percentage ... rather than larger buckets of lighter, darker, neutral"); the stage is the picture, and the
 * names the cards had are marks to start from. Card shade's Auto is a mark off the bar.
 */
const LAYER_MARKS = [{ value: "0", label: "Flat" }, { value: "25", label: "Subtle" }, { value: "50", label: "Clear" }, { value: "75", label: "Strong" }, { value: "100", label: "Bold" }];
const CARD_MARKS = [{ value: "auto", label: "Auto" }, { value: "-50", label: "Darker" }, { value: "0", label: "Match" }, { value: "50", label: "Lighter" }];
const type = one("type"), density = one("density"), radius = one("radius"), surface = one("surface"), elevation = one("elevation");
const resting = one("shadow-resting"), strokeHover = one("stroke-hover"), hoverLift = one("shadow-hover");
const selectedEdge = one("selected-stroke"), selectedTint = one("selected-tint");
const focusRing = one("focus-ring"), danger = one("danger-hover"), motion = one("motion"), easing = one("easing"), contrast = one("contrast");
const feedback = one("feedback");
const shadowColour = one("shadow-color"), status = one("status-colours");

export const QUESTIONS: readonly Question[] = [
  // ——— Colours ———
  // Each page is one exact colour (2026-10-27): its brightness, the greys' hue and how far they lean, all in one pick, so
  // the Page brightness slider, Greys, Tint colour and Grey strength questions folded into it.
  {
    id: "light-page", chapter: "colours", name: "Light page", essential: true, mode: "light", axes: ["ground-light", "neutral", "tint-hue", "tint-light"], focus: [],
    question: "What colour is your page?",
    description: "Every grey, edge and text colour is worked out from it.",
    note: "Only colours Area can paint are offered: a page's colour fades out toward white.",
    control: { kind: "page", mode: "light" },
  },
  {
    id: "dark-page", chapter: "colours", name: "Dark page", essential: true, mode: "dark", axes: ["ground-dark", "neutral", "tint-hue-dark", "tint-dark"], focus: [],
    question: "What colour is your page in dark mode?",
    description: "True black, a near black or a coloured dark.",
    note: "Only colours Area can paint are offered: a page's colour fades out toward black.",
    control: { kind: "page", mode: "dark" },
  },
  // The accent's own pick follows (phase 4); until then the palette's accents and any hue.
  {
    id: "accent", chapter: "colours", name: "Accent", essential: true, axes: ["accent"], focus: accentParts, context: fillShade,
    question: "Which colour is your accent?",
    description: "The colour for actions, selection and focus.",
    note: "Contrast is solved for every hue.",
    control: { kind: "accent", visual: crop("form", 0.5) },
  },
  // ——— Page ———
  {
    id: "text-tint", chapter: "page", name: "Text tint", axes: ["ink-tint"], focus: ["text", "list"], fidelity: "real",
    when: (values, colours) => greysTinted(values, "light") || pickTinted(colours.light),
    question: "Should text be tinted too?",
    description: "Your greys lean toward a colour; body and muted text can lean the same way, or stay plain grey.",
    control: { kind: "slider", axis: "ink-tint", low: "Plain grey", high: "As tinted as the greys",
      marks: [{ value: "0", label: "Plain" }, { value: "50", label: "Tinted" }, { value: "100", label: "Full" }] },
  },
  {
    id: "layers", chapter: "page", name: "Layers", essential: true, mode: "light", axes: ["layers-light"], focus: ["sidebar", "stats", "form"],
    question: "How clearly should regions separate?",
    description: "How far sidebars, cards and fills step from the page.",
    control: { kind: "slider", axis: "layers-light", low: "One plane", high: "Most contrast", marks: LAYER_MARKS },
  },
  {
    id: "cards", chapter: "page", name: "Card shade", mode: "light", axes: ["card-tone-light"], focus: ["stats", "list", "form"],
    question: "Should cards match the page?",
    description: "A card's fill against the page.",
    control: { kind: "slider", axis: "card-tone-light", low: "Darker", high: "Lighter", marks: CARD_MARKS },
  },
  // ——— Accent ———
  {
    id: "where", chapter: "accent", name: "Accent use", essential: true, axes: ["action", "selection"], focus: ["primary", "action", "checks", "switch", "segmented", "tabs"],
    question: "Where should the accent appear?",
    description: "Buttons and selection can each take it or stay neutral.",
    control: { kind: "cards", visual: crop("form", 0.5), choices: [
      { label: "Nowhere", caption: "Monochrome; colour only for status.", set: { action: "neutral", selection: "neutral" } },
      { label: "Selection", caption: "Checks and switches in colour.", set: { action: "neutral", selection: "accent" } },
      { label: "Buttons", caption: "Primary buttons in colour.", set: { action: "accent", selection: "neutral" } },
      { label: "Both", caption: "Buttons and selection in colour.", set: { action: "accent", selection: "accent" } },
    ] },
  },
  {
    id: "saturation", chapter: "accent", name: "Saturation", essential: true, axes: ["accent-strength"], focus: accentParts, context: fillShade,
    when: accentShows,
    question: "How vivid should the accent be?",
    description: "How much colour the accent keeps.",
    control: { kind: "slider", axis: "accent-strength", low: "Muted", high: "Vivid",
      marks: [{ value: "30", label: "Dusty" }, { value: "50", label: "Soft" }, { value: "70", label: "Calm" }, { value: "100", label: "Vivid" }] },
  },
  {
    id: "button-shade", chapter: "accent", name: "Fill shade", mode: "light", axes: ["solid-light"], focus: solidParts,
    when: accentShows,
    question: "How light or deep should accent fills be?",
    description: "The shade of buttons, checks and switches.",
    control: { kind: "cards", fine: "solid-light", visual: crop("form", 0.7), choices: [
      solid("auto", "Auto", "The shade that reads best on your page."),
      solid("450", "Light", "Bright and friendly."),
      solid("600", "Medium", "The palette's middle."),
      solid("750", "Deep", "Serious and grounded."),
      solid("850", "Deepest", "Nearly ink."),
    ] },
  },
  {
    id: "label-tint", chapter: "accent", name: "Label tint", axes: ["label-tint"], focus: ["action"], fidelity: "real",
    when: values => values.action === "accent",
    question: "Should button labels take a little colour?",
    description: "Labels on accent buttons can lean toward the button's hue.",
    control: { kind: "toggle", axis: "label-tint", label: "Tint button labels", off: "0", on: "50", low: "A little", high: "Fully",
      visual: crop("action", 1.5, { fidelity: "real" }) },
  },
  {
    id: "status", chapter: "accent", name: "Status colours", axes: ["status-colours"], focus: ["badges", "list"],
    when: values => values["accent-strength"] !== "100",
    question: "Should status colours quiet down too?",
    description: "Red, amber and green can stay vivid or quiet down too.",
    control: { kind: "cards", visual: crop("status", 1.6), choices: [
      status("fixed", "Vivid", "Warnings always stand out."),
      status("match", "Quiet", "One calm palette."),
    ] },
  },
  // ——— Text and room ———
  {
    id: "type", chapter: "size", name: "Text size", essential: true, axes: ["type"], focus: [],
    question: "How large should text be?",
    description: "Every control grows with it.",
    control: { kind: "cards", visual: crop("text", 0.75, { fidelity: "bars" }), choices: [
      type("12", "12", "Dense dashboards and pro tools."),
      type("13", "13", "Compact, like a code editor."),
      type("14", "14", "Right for most apps."),
      type("15", "15", "Roomy and easy to read."),
      type("16", "16", "Reading-first products and touch."),
    ] },
  },
  {
    id: "room", chapter: "size", name: "Room", essential: true, axes: ["density"], focus: ["sidebar", "list", "form"],
    question: "How much room should controls get?",
    description: "The height of rows, buttons and fields.",
    control: { kind: "cards", visual: crop("nav-current", 0.9), choices: [
      density("28", "Compact", "Tight rows; more on screen."),
      density("32", "Regular", "Room and reach in balance."),
      density("36", "Comfy", "Larger targets, made for touch."),
    ] },
  },
  // ——— Shape ———
  {
    id: "corners", chapter: "shape", name: "Corners", essential: true, axes: ["radius"], focus: ["stats", "form", "primary"],
    question: "How round should corners be?",
    description: "Every corner scales from this one.",
    control: { kind: "cards", fine: "radius", visual: crop("form", 0.7), choices: [
      radius("0", "Square", "Precise and architectural."),
      radius("4", "Sharp", "A crisp, technical edge."),
      radius("8", "Soft", "Friendly but exact."),
      radius("12", "Round", "Approachable and soft."),
      radius("pill", "Pill", "Buttons and fields fully round."),
    ] },
  },
  {
    id: "pills", chapter: "shape", name: "Pills", axes: ["pills"], focus: ["primary", "field", "segmented", "chips", "badges", "count", "switch", "avatar"],
    question: "Which parts should be fully round?",
    description: "As many as you like; the rest follow Corners.",
    control: { kind: "pills" },
  },
  // ——— Lines ———
  {
    id: "outline", chapter: "lines", name: "Outline", axes: ["surface"], focus: ["stats", "list", "form", "sidebar"],
    question: "How thick should outlines be?",
    description: "The line round cards and panels.",
    control: { kind: "cards", visual: crop("stat", 1.1), choices: [
      surface("0", "None", "No outline; fills and shadows separate."),
      surface("0.5", "Hairline", "Half a pixel, barely there."),
      surface("1", "Standard", "A single pixel."),
      surface("1.5", "Medium", "A firmer frame."),
      surface("2", "Bold", "Graphic and deliberate."),
    ] },
  },
  {
    id: "edges", chapter: "lines", name: "Edge strength", essential: true, axes: ["stroke"], focus: ["stats", "list", "form", "field"],
    question: "How strong should edges be?",
    description: "How dark every edge and divider is.",
    control: { kind: "slider", axis: "stroke", low: "Faint", high: "Strong",
      marks: [{ value: "0", label: "None" }, { value: "2", label: "Faint" }, { value: "4", label: "Medium" }, { value: "6", label: "Firm" }, { value: "8", label: "Strong" }] },
  },
  {
    id: "soft-edge", chapter: "lines", name: "Soft edge", axes: ["shadow-rest"], focus: ["stats", "list", "form"],
    question: "Should surfaces have a soft edge?",
    description: "A faint shadow round cards and panels.",
    control: { kind: "toggle", axis: "shadow-rest", label: "Soft edge", off: "0", on: "3", low: "Faint", high: "Clear",
      visual: crop("stat", 1.1) },
  },
  // ——— Depth ———
  {
    id: "lift", chapter: "depth", name: "Menu lift", essential: true, axes: ["elevation"], focus: ["menu"], hold: ["menu"],
    question: "How far should menus and dialogs float?",
    description: "The shadow under menus, popovers and dialogs.",
    control: { kind: "cards", fine: "elevation", visual: crop("menu", 0.6, { hold: ["menu"] }), choices: [
      elevation("0", "Flat", "An edge alone; no shadow."),
      elevation("2", "Low", "A close, quiet shadow."),
      elevation("3", "Medium", "A measured float."),
      elevation("5", "High", "Clearly above the page."),
      elevation("8", "Highest", "A deep, dramatic float."),
    ] },
  },
  {
    id: "card-lift", chapter: "depth", name: "Card lift", axes: ["shadow-resting"], focus: ["stats", "list", "form"],
    question: "How much should cards lift off the page?",
    description: "A resting shadow under cards and panels.",
    control: { kind: "cards", fine: "shadow-resting", visual: crop("stats", 0.75), choices: [
      resting("0", "None", "Flat, like print."),
      resting("3", "Light", "A gentle lift."),
      resting("5", "Raised", "Cards read as objects."),
      resting("8", "Floating", "Strong, layered depth."),
    ] },
  },
  {
    id: "field-lift", chapter: "depth", name: "Field lift", axes: ["shadow-field"], focus: ["field", "button"],
    question: "Should fields lift a little?",
    description: "A small shadow under fields and outline buttons.",
    control: { kind: "toggle", axis: "shadow-field", label: "Lift fields", off: "0", on: "3", low: "Faint", high: "Clear",
      visual: crop("field", 1.4) },
  },
  {
    id: "reach", chapter: "depth", name: "Shadow reach", axes: ["shadow-size"], focus: ["menu"], hold: ["menu"],
    when: values => values.elevation !== "0",
    question: "How far should shadows reach?",
    description: "How far every shadow spreads.",
    control: { kind: "slider", axis: "shadow-size", low: "Tight", high: "Wide",
      marks: [{ value: "0", label: "Tight" }, { value: "4", label: "Medium" }, { value: "8", label: "Wide" }] },
  },
  {
    id: "softness", chapter: "depth", name: "Shadow softness", axes: ["shadow-softness"], focus: ["menu"], hold: ["menu"],
    when: values => values.elevation !== "0",
    question: "How soft should shadows be?",
    description: "One crisp layer, or several soft ones.",
    control: { kind: "slider", axis: "shadow-softness", low: "Crisp", high: "Soft",
      marks: [{ value: "0", label: "Crisp" }, { value: "2", label: "Medium" }, { value: "8", label: "Soft" }] },
  },
  {
    id: "light", chapter: "depth", name: "Edge light", axes: ["shadow-light"], focus: ["menu"], hold: ["menu"],
    when: values => values.elevation !== "0",
    question: "Should light catch raised edges?",
    description: "A highlight along the top of lifted surfaces.",
    control: { kind: "toggle", axis: "shadow-light", label: "Edge light", off: "0", on: "2", low: "Faint", high: "Bright",
      visual: crop("menu", 0.6, { hold: ["menu"] }) },
  },
  {
    id: "shadow-colour", chapter: "depth", name: "Shadow colour", mode: "light", axes: ["shadow-color"], focus: ["menu", "stats"], hold: ["menu"],
    when: values => values.elevation !== "0" || values["shadow-resting"] !== "0",
    question: "What colour should shadows be?",
    description: "Dark mode's shadows stay black.",
    control: { kind: "cards", visual: crop("menu", 0.6, { hold: ["menu"] }), choices: [
      shadowColour("black", "Black", "Neutral, works with everything."),
      shadowColour("warm", "Warm", "A brown cast for warm pages."),
      shadowColour("cool", "Cool", "A blue cast for cool pages."),
    ] },
  },
  // ——— Interaction ———
  {
    id: "hover", chapter: "states", name: "Hover", axes: ["fill-hover"], focus: ["nav-hover", "menu-row"], hold: ["hover", "menu"],
    question: "How strong should hover be?",
    description: "The plate under a row the pointer is over.",
    control: { kind: "slider", axis: "fill-hover", low: "Faint", high: "Strong",
      marks: [{ value: "25", label: "Faint" }, { value: "50", label: "Medium" }, { value: "75", label: "Firm" }, { value: "100", label: "Strong" }] },
  },
  {
    id: "hover-edge", chapter: "states", name: "Hover edge", axes: ["stroke-hover"], focus: ["field"], hold: ["hover-edge"],
    when: values => values.stroke !== "0",
    question: "Should a field's edge darken on hover?",
    description: "A field's edge under the pointer.",
    control: { kind: "cards", visual: crop("field", 1.4, { hold: ["hover-edge"] }), choices: [
      strokeHover("0", "Stays", "The edge rests; nothing changes."),
      strokeHover("2", "Darkens", "A clear step."),
      strokeHover("4", "Strongly", "The edge goes nearly solid."),
    ] },
  },
  {
    id: "hover-lift", chapter: "states", name: "Hover lift", axes: ["shadow-hover"], focus: ["stat-hover"], hold: ["lift"],
    question: "Should a card lift when hovered?",
    description: "Clickable cards can rise under the pointer.",
    control: { kind: "cards", visual: crop("stat-hover", 1, { hold: ["lift"] }), choices: [
      hoverLift("0", "No lift", "Cards stay put."),
      hoverLift("3", "Light", "A gentle rise."),
      hoverLift("5", "Clear", "An obvious rise."),
      hoverLift("8", "High", "Cards jump forward."),
    ] },
  },
  {
    id: "selected", chapter: "states", name: "Selected row", axes: ["fill-selected"], focus: ["nav-current"],
    question: "How firm should the current row be?",
    description: "The plate under the current page or row.",
    control: { kind: "slider", axis: "fill-selected", low: "As hover", high: "Firmest",
      marks: [{ value: "0", label: "As hover" }, { value: "25", label: "Firmer" }, { value: "50", label: "Firm" }, { value: "100", label: "Firmest" }] },
  },
  {
    id: "selected-edge", chapter: "states", name: "Selected edge", axes: ["selected-stroke"], focus: ["stat-selected"], hold: ["selected"],
    question: "How thick should a selected card's edge be?",
    description: "The edge that marks a chosen card.",
    control: { kind: "cards", visual: crop("stat-selected", 1.1, { hold: ["selected"] }), choices: [
      selectedEdge("1", "1px", "A fine, precise mark."),
      selectedEdge("2", "2px", "Reads at a glance."),
      selectedEdge("3", "3px", "Reads from across the room."),
    ] },
  },
  {
    id: "selected-fill", chapter: "states", name: "Selected fill", axes: ["selected-tint"], focus: ["stat-selected"], hold: ["selected"],
    question: "Should a selected card also fill?",
    description: "A faint fill under the selected edge.",
    control: { kind: "cards", visual: crop("stat-selected", 1.1, { hold: ["selected"] }), choices: [
      selectedTint("none", "Edge only", "The stroke alone marks it."),
      selectedTint("tint", "Accent tint", "A faint wash of the accent."),
      selectedTint("neutral", "Grey fill", "The selected row's grey."),
    ] },
  },
  {
    id: "pressed", chapter: "states", name: "Press", axes: ["fill-pressed"], focus: ["button"], hold: ["press"],
    question: "How firm should a press be?",
    description: "How far a button darkens while held.",
    control: { kind: "slider", axis: "fill-pressed", low: "Light", high: "Firmest",
      marks: [{ value: "25", label: "Light" }, { value: "50", label: "Medium" }, { value: "75", label: "Firm" }, { value: "100", label: "Firmest" }] },
  },
  {
    id: "focus", chapter: "states", name: "Focus ring", axes: ["focus-ring"], focus: ["field"], hold: ["focus"],
    question: "How should keyboard focus look?",
    description: "The ring that shows where the keyboard is.",
    control: { kind: "cards", visual: crop("field", 1.4, { hold: ["focus"] }), choices: [
      focusRing("hug", "Hug", "Hugs each control."),
      focusRing("gap", "Gap", "Sits 2px off everything."),
      focusRing("halo", "Halo", "Fields glow in the ring's colour."),
      focusRing("inset", "Inset", "Drawn inside; nothing outside moves."),
      focusRing("bold", "Bold", "A 3px ring for keyboard-first products."),
    ] },
  },
  {
    id: "danger", chapter: "states", name: "Danger hover", axes: ["danger-hover"], focus: ["menu-danger"], hold: ["danger"],
    question: "Should a destructive row hover red?",
    description: "The hover on Delete and other destructive rows.",
    control: { kind: "cards", visual: crop("menu-danger", 1.3, { hold: ["danger"] }), choices: [
      danger("tint", "Red", "A red plate warns before the click."),
      danger("neutral", "Grey", "The red label is warning enough."),
    ] },
  },
  // ——— Motion ———
  {
    id: "speed", chapter: "motion", name: "Speed", essential: true, axes: ["motion"], focus: ["switch"],
    question: "How fast should things move?",
    description: "Every transition scales from this.",
    note: "Reduced motion always means Off.",
    control: { kind: "cards", fine: "motion", visual: { kind: "motion" }, choices: [
      motion("0", "Off", "Instant; nothing animates."),
      motion("120", "Quick", "Brisk, for tools used all day."),
      motion("210", "Steady", "A measured pace."),
      motion("300", "Relaxed", "Smooth and unhurried."),
    ] },
  },
  {
    id: "easing", chapter: "motion", name: "Easing", axes: ["easing"], focus: ["switch"],
    when: values => values.motion !== "0",
    question: "How should motion start and settle?",
    description: "The curve every transition follows.",
    control: { kind: "cards", visual: { kind: "easing" }, choices: [
      easing("subtle", "Subtle", "Eases into place; nothing snaps."),
      easing("standard", "Standard", "A quick start that settles."),
      easing("snappy", "Snappy", "Gets there sooner, stops harder."),
      easing("gentle", "Gentle", "Eases in and out evenly."),
      easing("spring", "Spring", "Passes its mark and settles back."),
    ] },
  },
  {
    id: "feedback", chapter: "motion", name: "Feedback", essential: true, axes: ["feedback"], focus: ["button", "primary", "action"],
    when: values => values.motion !== "0",
    question: "How should controls answer a press?",
    description: "Hover can fade in and a press can give a little.",
    control: { kind: "cards", visual: { kind: "press" }, choices: [
      feedback("off", "Off", "Still; colour changes alone."),
      feedback("subtle", "Subtle", "A soft fade and a slight give."),
      feedback("pronounced", "Pronounced", "A fuller give you can feel."),
    ] },
  },
  // ——— Accessibility ———
  {
    id: "contrast", chapter: "access", name: "Contrast", axes: ["contrast"], focus: ["list", "form", "field"],
    question: "How much extra contrast?",
    description: "Firmer edges, focus and states, beyond the guidelines Area already meets.",
    control: { kind: "cards", fine: "contrast", visual: crop("form", 0.7, { hold: ["focus"] }), choices: [
      contrast("system", "Follow the system", "Follows each person's OS setting."),
      contrast("0", "Standard", "Area's contrast, always."),
      contrast("4", "More", "Firmer edges and states for everyone."),
      contrast("8", "Most", "The strongest edges, focus and states."),
    ] },
  },
  // ——— Dark mode ———
  {
    id: "dark-layers", chapter: "dark", name: "Dark layers", mode: "dark", axes: ["layers-dark"], focus: ["sidebar", "stats", "form"],
    question: "How clearly should regions separate in dark mode?",
    description: "Dark pages often need a bigger step.",
    control: { kind: "slider", axis: "layers-dark", low: "One plane", high: "Most contrast", marks: LAYER_MARKS },
  },
  {
    id: "dark-cards", chapter: "dark", name: "Dark card shade", mode: "dark", axes: ["card-tone-dark"], focus: ["stats", "list", "form"],
    question: "In dark mode, should cards match the page?",
    description: "A card's fill against the dark page.",
    control: { kind: "slider", axis: "card-tone-dark", low: "Darker", high: "Lighter", marks: CARD_MARKS },
  },
  {
    id: "dark-fill-shade", chapter: "dark", name: "Dark fill shade", mode: "dark", axes: ["solid-dark"], focus: solidParts,
    when: accentShows,
    question: "In dark mode, how light or deep should accent fills be?",
    description: "Lighter glows on a dark page; deeper recedes.",
    control: { kind: "cards", fine: "solid-dark", visual: crop("form", 0.7), choices: [
      darkSolid("auto", "Auto", "The shade that reads best on your page."),
      darkSolid("450", "Light", "Bright on the dark page."),
      darkSolid("600", "Medium", "The palette's middle."),
      darkSolid("750", "Deep", "Recedes into the page."),
    ] },
  },
];

/** About how long a path takes: a question every 12 seconds or so. */
export const minutesFor = (count: number) => Math.max(1, Math.round(count / 5));
