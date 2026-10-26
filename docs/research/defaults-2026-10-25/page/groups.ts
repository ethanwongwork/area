/**
 * The defaults review's groups (owner, 2026-10-25: "choose Area's default design-system settings"): every Inspector
 * setting in one of twelve groups, picked one group at a time, each with the parts of the Workspace screen it changes held
 * still, and a recommendation per setting from the measured references (docs/research/BASELINE.md) and the system's own
 * rules (docs/THEMING.md, the research each setting cites).
 */
import type { Hold, Region } from "../../../../apps/desktop/src/setup-screen.tsx";

export interface Recommendation {
  value: string;
  why: string;
}

export interface Group {
  id: string;
  title: string;
  /** What the group decides, in a line. */
  lede: string;
  /** The rows the group shows (the Greys row stands for neutral and the tint settings). */
  rows: readonly string[];
  /** Every setting the group decides, the Greys row's included. */
  axes: readonly string[];
  hold: readonly Hold[];
  /** The close-up's centre. */
  focus: Region;
  recommend: Readonly<Record<string, Recommendation>>;
}

const keep = (value: string, why: string): Recommendation => ({ value, why });

export const GROUPS: readonly Group[] = [
  {
    id: "page", title: "Page and greys", lede: "The page in each mode, the grey every surface and text is drawn in, and how far cards, menus and sidebars sit from the page.",
    rows: ["theme", "ground-light", "ground-dark", "neutral", "ink-tint", "layers-light", "layers-dark", "card-tone-light", "card-tone-dark"],
    axes: ["theme", "ground-light", "ground-dark", "neutral", "tint-hue", "tint-light", "tint-dark", "ink-tint", "layers-light", "layers-dark", "card-tone-light", "card-tone-dark"],
    hold: [], focus: "stats",
    recommend: {
      theme: keep("light", "A library's root default, not a product's: ChatGPT, Notion and Figma all open in light and follow the OS when asked. Products set dark on their own root."),
      "ground-light": keep("100", "White, as all three references paint the page (ChatGPT #fff, Notion #fff, Figma's panels #fff). Grey pages (90–99) stay a choice."),
      "ground-dark": keep("8", "#020202: as close to black as you asked for, while the recessed sidebar and wells still have a step below the page. At 0 (pure black) there is no darker step left, so recessed regions merge with the page."),
      neutral: keep("neutral", "Pure greys: ChatGPT's inks are rgb(13) / rgb(93) / rgb(143) and Figma's are black at 90% / 50%. Notion's warm cast (rgb(55,53,47)) is the Warm option. No tint by default: the accent carries the colour."),
      "tint-hue": keep("auto", "Follows Grey: no extra hue."),
      "tint-light": keep("auto", "Follows Grey: no extra tint."),
      "tint-dark": keep("auto", "Follows Grey: no extra tint."),
      "ink-tint": keep("2", "Changes nothing while the greys are untinted. At 2 a tinted page's body text takes half the tint, so text stays readable on every hue."),
      "layers-light": keep("4", "Area's light theme as measured: cards, menus and the sidebar sit one clear step from a white page without a frame needing to do all the work."),
      "layers-dark": keep("4", "The same step in dark, which keeps a raised card visible on the near-black page."),
      "card-tone-light": keep("auto", "Each container keeps its own tone: a Card is raised, an Asset card recessed. A fixed shade would flatten that difference."),
      "card-tone-dark": keep("auto", "The same as light."),
    },
  },
  {
    id: "accent", title: "Accent", lede: "The accent colour, how much colour it keeps, how deep its buttons and checked marks sit, and the statuses beside it.",
    rows: ["accent", "accent-strength", "solid-light", "solid-dark", "label-tint", "status-colours"],
    axes: ["accent", "accent-strength", "solid-light", "solid-dark", "label-tint", "status-colours"],
    hold: ["selected"], focus: "form",
    recommend: {
      accent: keep("blue", "All three references' accent is a blue: ChatGPT's switch rgb(58,131,247), Notion's Invite button, Figma's selection #0d99ff."),
      "accent-strength": keep("100", "The palette's own colour. Lower strengths are for dusty brands; at 30 the selected plate comes within ΔE 0.004 of hover."),
      "solid-light": keep("auto", "Auto is the solver's own step: the lightest blue whose white label clears 4.6:1, so buttons and checked marks match the swatch. Your saved 750 (navy) is why the swatches looked dark; it stays a choice."),
      "solid-dark": keep("auto", "The solver's step for the near-black page. A navy fill measures 1.66:1 against it."),
      "label-tint": keep("0", "White labels, as all three references draw them on a blue fill."),
      "status-colours": keep("fixed", "Statuses keep their full colour at every accent, so red still reads as danger beside a quiet palette."),
    },
  },
  {
    id: "emphasis", title: "Buttons and Selection", lede: "Whether primary buttons, and whether checked, selected and current states, paint the accent.",
    rows: ["action", "selection"], axes: ["action", "selection"],
    hold: ["selected"], focus: "form",
    recommend: {
      action: keep("neutral", "ChatGPT's primary actions are near-black solids (send, Log in). Notion's and Figma's are blue, but a neutral primary keeps the accent meaningful: it marks state, not every button."),
      selection: keep("accent", "Checked, on and selected states in the accent (ChatGPT's blue switch, Figma's blue selection), so a selected card and the mark inside it are one colour (2026-10-22)."),
    },
  },
  {
    id: "contrast", title: "Contrast", lede: "The accessibility layer: stronger edges, focus and state. System follows the OS's Increase contrast.",
    rows: ["contrast"], axes: ["contrast"],
    hold: ["focus", "hover-edge"], focus: "form",
    recommend: {
      contrast: keep("system", "Follow the OS, as the platforms' own increased-contrast settings intend. A fixed level would ignore a person who has turned it on, or force strong edges on everyone else."),
    },
  },
  {
    id: "size", title: "Type and Density", lede: "The base UI text size, and the room around it: control heights, rows, gaps and insets. The app's own UI is drawn at these too (it was measured at 13, Compact).",
    rows: ["type", "density"], axes: ["type", "density"],
    hold: [], focus: "list",
    recommend: {
      type: keep("14", "ChatGPT's UI body is 14/20 and Notion's 14/21. Figma's 11 is an inspector's size, which 12 and 13 cover."),
      density: keep("32", "A 32 medium Button at 14: Notion's Share button is 32, ChatGPT's controls 36 (Comfortable). Compact (28) suits dense tools such as this app's own UI."),
    },
  },
  {
    id: "radius", title: "Radius", lede: "The medium Button's corner; every other corner derives from it.",
    rows: ["radius"], axes: ["radius"],
    hold: ["menu"], focus: "form",
    recommend: {
      radius: keep("8", "ChatGPT's ghost buttons and rows are 8, Notion's buttons 6 and Figma's controls 5. 8 is the most-used measured value, with surfaces derived larger (ChatGPT's menu 16, cards 16)."),
    },
  },
  {
    id: "surface", title: "Surface", lede: "The line round cards, panels and floating surfaces, and how dark every edge is.",
    rows: ["surface", "stroke"], axes: ["surface", "stroke"],
    hold: [], focus: "stats",
    recommend: {
      surface: keep("1", "1px: ChatGPT's settings cards are 1px black at 10% and Figma's selects a 1px rgb(230) border. Notion's 0.56px hairline is the 0.5 option."),
      stroke: keep("4", "The middle of the scale: an edge about as dark as ChatGPT's black 10% and Figma's rgb(230) on white."),
    },
  },
  {
    id: "depth", title: "Depth and shadows", lede: "Shadows on menus and dialogs, cards at rest, fields and hovered cards, and how far, soft, lit and coloured they are.",
    rows: ["elevation", "shadow-resting", "shadow-hover", "shadow-field", "shadow-rest", "shadow-size", "shadow-softness", "shadow-light", "shadow-color"],
    axes: ["elevation", "shadow-resting", "shadow-hover", "shadow-field", "shadow-rest", "shadow-size", "shadow-softness", "shadow-light", "shadow-color"],
    hold: ["menu", "lift"], focus: "menu",
    recommend: {
      elevation: keep("3", "ChatGPT's menu: a 0.5px ring and 0 8px 16px −4px black at 12%. Notion's popover is softer (5% and 2.7%), Figma's picker stronger (15% and 12%); 3 sits with ChatGPT's."),
      "shadow-resting": keep("3", "One tight layer, 0 1px 2px −1px at 8%: ChatGPT's switch thumb and its sm shadow."),
      "shadow-hover": keep("3", "0 2px 4px −1px at 8% (ChatGPT's md): a hovered card lifts without a halo."),
      "shadow-field": keep("0", "Fields stay flat: none of the three references shadows a field or select."),
      "shadow-rest": keep("0", "No soft edge: the 1px line already draws the edge."),
      "shadow-size": keep("4", "The reach the measured shadows have at their own size."),
      "shadow-softness": keep("2", "Two layers, as Notion's and Figma's popovers have."),
      "shadow-light": keep("0", "No lip or highlight: none of the references lights an edge."),
      "shadow-color": keep("black", "Neutral shadows on a neutral page. Notion's are a warm grey (rgb(25,25,25)), close to black."),
    },
  },
  {
    id: "states", title: "State fills", lede: "Hover, selected and pressed plates and edges, the focus ring, and a destructive row's hover.",
    rows: ["fill-hover", "stroke-hover", "fill-selected", "selected-stroke", "selected-tint", "fill-pressed", "focus-ring", "danger-hover"],
    axes: ["fill-hover", "stroke-hover", "fill-selected", "selected-stroke", "selected-tint", "fill-pressed", "focus-ring", "danger-hover"],
    hold: ["hover", "press", "selected", "danger", "focus"], focus: "sidebar",
    recommend: {
      "fill-hover": keep("2", "Black at about 5%: ChatGPT's and Figma's hover on rows, menu items and icon buttons. Notion's is 8% warm (3)."),
      "stroke-hover": keep("2", "An outline control's edge darkens a visible step under the pointer, while the fill stays the same."),
      "fill-selected": keep("1", "One step past hover. ChatGPT paints the current row the same as hover (0), but then a hovered row and the current one can't be told apart."),
      "selected-stroke": keep("2", "A 2px selected edge inside a card, which still reads at type 12 and in dark."),
      "selected-tint": keep("none", "The edge alone marks a selected card, so cards keep one fill."),
      "fill-pressed": keep("4", "The firmest press, 12% toward the ink in light (ChatGPT's), so a click always shows."),
      "focus-ring": keep("hug", "ChatGPT's focus, as measured on 2026-10-21: a 2px ring hugging controls and 2px off cards and text."),
      "danger-hover": keep("tint", "A destructive row's hover turns red at the same lightness, so Delete is clear before the click."),
    },
  },
  {
    id: "motion", title: "Motion and Easing", lede: "How fast menus open (every duration derives from it), the curve of every transition, and how controls answer the pointer.",
    rows: ["motion", "easing", "feedback"], axes: ["motion", "easing", "feedback"],
    hold: [], focus: "form",
    recommend: {
      motion: keep("210", "A 210ms menu open, close to ChatGPT's popover (220) and between Radix's 150 and Figma's dropdown (250). Every other duration is a third-multiple of it (docs/MOTION.md)."),
      easing: keep("subtle", "Your pick on 2026-10-24: a gentler start than Standard, (0.22, 1, 0.36, 1)."),
      feedback: keep("subtle", "Your pick on 2026-10-24: hover fades in over about 91ms, and a press gives 0.96–0.985."),
    },
  },
  {
    id: "pills", title: "Pills", lede: "Which shapes draw a pill instead of following Radius.",
    rows: ["pills"], axes: ["pills"],
    hold: [], focus: "form",
    recommend: {
      pills: keep("chip badge count switch avatar", "Chips, badges, counts, switches and avatars are pills in all three references (ChatGPT's NEW badge, Notion's status pill). Buttons and fields follow Radius. ChatGPT's pill buttons are the Button option."),
    },
  },
  {
    id: "material", title: "Material", lede: "A surface treatment (glass, tactile, soft…) painted over every layer.",
    rows: ["material"], axes: ["material"],
    hold: ["menu"], focus: "stats",
    recommend: {
      material: keep("none", "Plain surfaces, as all three references draw. The bundles are named looks, which you asked not to package, so none is the default."),
    },
  },
];
