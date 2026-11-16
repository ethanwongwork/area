/**
 * What each public token is for, and the rules that bind it, as data (plan F7, RD8: "Token rules are prose, not
 * data"). `tokens.json` carries one entry per public token under `usage`, so `area check`, `area mcp` and agents can
 * read "a divider reads edge-dividers" without parsing the docs.
 *
 * Usage is one sentence. Rules are quoted from docs/DESIGN_SYSTEM.md, docs/CONTRAST.md and docs/THEMING.md, each
 * with the section it comes from; none is written here first. A rule changes in the doc, then here (usage.test.ts
 * checks every quote is still in its doc, word for word).
 *
 * Entries come from an ordered list of patterns: the first that matches a name wins. Every public token matches one
 * (usage.test.ts), so a new token without a usage fails the test rather than shipping unexplained.
 */

export type TokenKind =
  /** A palette rung or a numbered ramp step: read by roles, never by components. */
  | "primitive"
  /** A semantic role components consume. */
  | "role"
  /** A component's own public hook. */
  | "component"
  /** A setting's level as a number, which derivations read. */
  | "setting"
  /** An input to a derivation in emit/base.ts or a solved step; not for components. */
  | "derivation";

export interface TokenRule {
  /** Its key in `tokenRules`: the source's file and the rule's first words, "contrast-small-labels-placeholders-and". */
  id: string;
  /** Quoted from the source, word for word (Markdown code ticks kept, line breaks folded to spaces). */
  rule: string;
  /** The doc and section, `docs/FILE.md#anchor`. */
  source: string;
}

/** One token's entry. In tokens.json `rules` holds rule ids, each quoted once in `tokenRules`. */
export interface TokenUsage<Rule = TokenRule> {
  kind: TokenKind;
  usage: string;
  rules?: Rule[];
}

const DS = (anchor: string) => `docs/DESIGN_SYSTEM.md#${anchor}`;
const CONTRAST = (anchor: string) => `docs/CONTRAST.md#${anchor}`;
const THEMING = (anchor: string) => `docs/THEMING.md#${anchor}`;

const REGISTRY = new Map<string, TokenRule>();
/** A quote, its line breaks folded to spaces (the docs wrap at 120), registered once under a readable id. */
function r(text: string, source: string): TokenRule {
  const rule = text.replace(/\s+/g, " ").trim();
  const held = [...REGISTRY.values()].find(entry => entry.rule === rule && entry.source === source);
  if (held) return held;
  const file = source.replace(/^docs\//, "").replace(/\.md#.*$/, "").toLowerCase().replace(/_/g, "-");
  const words = rule.replace(/[`*]/g, "").toLowerCase().replace(/[^a-z0-9 ]+/g, " ").trim().split(/\s+/).slice(0, 5).join("-");
  let id = `${file}-${words}`;
  for (let n = 2; REGISTRY.has(id); n++) id = `${file}-${words}-${n}`;
  const entry = { id, rule, source };
  REGISTRY.set(id, entry);
  return entry;
}

/* --- Rules, quoted ---------------------------------------------------------------------------------------------- */

const PRIMITIVE = r("Components never read numbered palette rungs", DS("tokens"));
const ROLES = r("Components consume these", DS("tokens"));
const COMPONENT_ROLE = r("Need a fallback, a consumer and a check", DS("tokens"));
const DEFINED = r("**Every `var(--area-*)` names a defined token**, or carries a fallback when it is a public\n  hook", DS("tokens"));
const NOT_REGISTERED = r("**Derived tokens and light/dark pairs are never registered with `@property`.**", DS("settings"));
const TEXT_45 = r("Small labels, placeholders and code are normal text and must meet 4.5:1.", CONTRAST("text-and-indicators"));
const FG_FIXED = r("Keep foregrounds unchanged on hover.", CONTRAST("roles"));
const TONE_FLOOR = r("Its default, 4.5, is AA and is what every other check here assumes.", CONTRAST("tone-contrast-the-one-deliberate-exception"));
const TONE_FLOOR_BELOW = r("Below it, down to 2.5,\na theme is **below WCAG AA for those words**, by the owner's choice", CONTRAST("tone-contrast-the-one-deliberate-exception"));
const TONE_NEVER_MOVES = r("**What never moves:** the accent's ink (links, selection), every neutral ink, words on a solid fill, the vivid inks,\n  edges, focus and indicators.", CONTRAST("tone-contrast-the-one-deliberate-exception"));
const DECORATIVE = r("never the only control or state cue.", CONTRAST("roles"));
const EDGE_ROLES = r("**Control and state edges read the `edge-*` roles**, which strengthen under increased\n  contrast, never the raw `border-*` rungs.", DS("strokes"));
const RULE_INSIDE = r("**A rule inside a container is never darker than the container's edge.**", DS("strokes"));
const NO_1PX = r("Never write a literal `1px` for a\nline", DS("strokes"));
const STROKE_WIDTH = r("`stroke-width` never moves with the Stroke width setting. It draws every line that\n  carries meaning or stands alone", DS("strokes"));
const BORDER_WIDTH = r("`border-width` follows Stroke width, and is 1px again under increased contrast.", DS("strokes"));
const REQUIRED_EDGE = r("removing a container frame must not erase\n  a control or focus indicator", CONTRAST("roles"));
const GROUP_REQUIRED = r("A required boundary never rides a group", CONTRAST("roles"));
const DIVIDER_LIGHTEST = r("**A divider is the lightest line**", DS("strokes"));
const RAILS = r("Rails are fills, not strokes", CONTRAST("roles"));
const TRANSLUCENT_LINES = r("**Translucent lines are only for content Area cannot know.**", DS("strokes"));
const TRANSLUCENT_FILLS = r("Use the translucent twins on grounds a component cannot know (a segmented track, a swatch\ncell) and for controls nested on a row.", DS("shared-state-paint"));
const SAME_ROLE = r("The same role paints the same way in every family.", DS("shared-state-paint"));
const SHADOW_ROLE = r("A component never picks a shadow. It names the role it plays", DS("elevation"));
const SHADOW_NONE = r("**Never `none`.** Step 0 is transparent layers, never `none`.", DS("elevation"));
const SHADOW_CONTRAST = r("**Contrast never strengthens a shadow.**", DS("elevation"));
const FOCUS = r("Use `focus-color`, `focus-width` and `focus-offset` for control focus and `focus-gap` off containers and text", CONTRAST("focus"));
const FOCUS_GEOMETRY = r("Required focus geometry is independent of elevation.", CONTRAST("focus"));
const FIELD_FOCUS = r("Editable fields use `field-focus-*` roles", CONTRAST("focus"));
const FOCUS_SOLID = r("**A ring never sits flush on a solid fill**", CONTRAST("focus"));
const FOCUS_MORE = r("**Focus answers Contrast More**", CONTRAST("focus"));
const SYNTAX = r("Syntax colors are measured against the actual code background, including dark-mode APCA.", CONTRAST("roles"));
const CONTROLS_RADIUS = r("**Controls read `radius-control-*`.** A component with its own height writes the same\n  expression on it.", DS("size-and-shape"));
const HEIGHTS = r("never copy a table into a component", DS("size-and-shape"));
const LIST_ROWS = r("**Rows in floating lists** (Menu, Context menu, Command palette) use\n  `radius-list-row`", DS("size-and-shape"));
const STANDALONE_ROWS = r("Standalone rows (Nav, Tree view)\n  use `radius-row`.", DS("size-and-shape"));
const IMAGE_ALONE = r("An image that stands alone (Figure, an Asset card's image, a viewer) takes\n    `radius-container`.", DS("size-and-shape"));
const THUMBNAIL = r("A thumbnail (File tile, Asset row, a mosaic cell, a list row) takes `radius-small`.", DS("size-and-shape"));
const PAGE_TITLE = r("`title-xl` is 2.5 times the base, 32/40 at 13 (30/38 to 40/48 across\n  Type 12 to 16): a document's own title, the one step between the interface titles (26) and display (52).", DS("size-and-shape"));
const HEADING_WEIGHT = r("`weight-heading` is 600: titles from `title-sm` up, a page's own title and a document's title and headings, where\n  `weight-strong` (500) sits too close to body text to read as a level. `title-xs` headings, labels, titles of surfaces\n  and controls keep strong.", DS("size-and-shape"));
const PAGE_ROLES = r("A screen has three levels (plan A9.1): page > section > item, told apart by size and weight", DS("size-and-shape"));
const TOKEN_ONCE = r("A value a token already holds is read from the token, never written out again", THEMING("settings"));
const SETTINGS_SCOPE = r("**Settings are not variants.**", DS("settings"));

/* --- Patterns --------------------------------------------------------------------------------------------------- */

const TONES = "accent|danger|warning|caution|success|info|discovery|pink|brown|gray|secondary|tertiary";
const PALETTE = "neutral|cool|warm|blue|sky|cyan|teal|mint|green|lime|chartreuse|yellow|orange|red|pink|purple|violet|indigo|brown";

/** Words for a tone name. */
const toneWords = (tone: string) => tone === "accent" ? "the accent" : tone === "secondary" || tone === "tertiary" ? `the brand's ${tone} color` : `the ${tone} tone`;

type Entry = [RegExp, (match: RegExpMatchArray) => TokenUsage];

const SHADOW_USE: Record<string, string> = {
  control: "Switch, Slider and Segmented thumbs; soft Toggle group selection; Badge modern",
  resting: "Card, Panel, Board card, Composer",
  field: "Outline fields and select triggers; outline and soft Buttons",
  tooltip: "Tooltip, Toggletip",
  lift: "A linked Card or an app tile under the pointer",
  float: "Menu and everything that opens one, Popover and everything built on it, Select picker, Toast, Calendar and Color picker surfaces, floating Toolbar and Selection bar, Board card actions, Scroll to latest",
  modal: "Dialog, Confirm dialog, Drawer, Command palette",
  edge: "Listed first by every framed surface",
};

const STROKE_GROUP_USE: Record<string, string> = {
  cards: "The frame round cards, asset cards, file tiles, attachments, board cards and surfaces",
  blocks: "The frame round code blocks, tables and preview frames in a page",
  callouts: "The frame round an alert or notice in the flow",
  floating: "The rim of menus, popovers, hover cards, toasts, dialogs, drawers and pickers",
  regions: "The seams between panels and the app's regions",
  dividers: "The rules between rows and sections: separators, table, list and accordion rows",
  fields: "The edge of soft fields: inputs, selects, number fields, text areas, pickers",
  buttons: "The edge of soft buttons, button groups, toggle groups and the Segmented track",
  options: "The edge of soft choice rows and choice cards",
  tracks: "The edge of slider, switch, progress and meter troughs",
  tags: "The edge of soft badges, counts, tags and keys",
  media: "A hairline round avatars, swatches and pictures",
};

const RUNG_USE: Record<string, string> = {
  "border-decorative": "Seams inside a container (Panel, Code block and Command palette rules, Menu and Toolbar separators) and the edges of filled shapes; Input group's frame and seams.",
  "border-float": "A Material's frame (`material.css`); floating frames read the Floating group.",
  "border-card": "Board card's ring under increased contrast.",
  "border-divider": "Rules that stand on their own (Separator, Tabs track, Table rows and frame).",
  "border-faint": "Disabled field edges (Input, Textarea, Number field, Select, Custom select, Date picker, Tag picker, OTP field, Composer, Input group).",
  "border-subtle": "Supplementary visual definition: Box model's margin line.",
  border: "Supplementary visual definition.",
  "border-hover": "Supplementary visual definition under the pointer.",
};

const PLATE_USE: Record<string, string> = {
  "": "The rest fill of a component plate on the page",
  "-hover": "Hover: the plate under the pointer (rows and item plates)",
  "-active": "Selected, current: one step firmer than hover, so selection survives hover",
};

const ENTRIES: Entry[] = [
  // Primitives: palette rungs, alphas and each family's contrast foreground.
  [new RegExp(`^(${PALETTE})-(a?\\d+)$`), m => ({ kind: "primitive", usage: `The ${m[1]} palette's ${m[2]!.startsWith("a") ? `translucent step ${m[2]!.slice(1)}` : `step ${m[2]}`}, for roles to read.`, rules: [PRIMITIVE] })],
  [new RegExp(`^(${PALETTE})-contrast$`), m => ({ kind: "primitive", usage: `The readable ink on the ${m[1]} palette's solid step.`, rules: [PRIMITIVE] })],
  [/^(space|size|leading|wght|radius)-(\d+)$/, m => ({ kind: "primitive", usage: `The ${{ space: "space", size: "type size", leading: "line height", wght: "font weight", radius: "corner" }[m[1]!]} ramp's ${m[2]} step.`, rules: [m[1] === "space" ? TOKEN_ONCE : ROLES] })],
  [/^accent-(a?\d+)$/, m => ({ kind: "primitive", usage: `The accent's ${m[1]!.startsWith("a") ? `translucent step ${m[1]!.slice(1)}` : `step ${m[1]}`}: the chosen accent family's rung, for roles to read.`, rules: [PRIMITIVE] })],
  [/^accent-contrast$/, () => ({ kind: "primitive", usage: "The readable ink on the accent's solid step.", rules: [PRIMITIVE] })],
  [/^accent-(hue|room-black|room-white)$/, () => ({ kind: "derivation", usage: "An input to the accent's generated scale (color/generate.ts).", rules: [NOT_REGISTERED] })],
  [/^(white|black)$/,m => ({ kind: "primitive", usage: `Pure ${m[1]}, for derivations that mix toward it.`, rules: [PRIMITIVE] })],
  [/^z-(\w+)$/, m => ({ kind: "role", usage: `The stacking layer for ${m[1]} content.` })],

  // Derivation inputs and solved intermediate steps: emit/base.ts reads them; components read the roles they make.
  [/^(?!bg-page$).*(?:-(?:rung|full|pick)(?:-|$)|-t\d+(?:-|$)|-f\d+(?:-|$)|-page$|-step$|-auto$|-own$)/,() => ({ kind: "derivation", usage: "A step emit/base.ts solves on the way to a public role; read the role, not this.", rules: [NOT_REGISTERED] })],
  [/^shadow-(slot-\d-[agt]|tint-[chl]|lip|highlight-(light|dark)|size|tightness|color)$/, () => ({ kind: "derivation", usage: "A layer input to the shadow roles; components read a shadow role.", rules: [SHADOW_ROLE] })],
  [/^(cast|tint|neutral)-(hue|chroma|room|dark|light)/, () => ({ kind: "derivation", usage: "An input to the neutral's tint and cast (axes/tint.ts, color/layers.ts).", rules: [NOT_REGISTERED] })],
  [/^layer-(light|dark)-/, () => ({ kind: "derivation", usage: "A Layers input: a ground's or layer's step in one mode (color/layers.ts).", rules: [NOT_REGISTERED] })],
  [/^tone-(floor|tint)-/, () => ({ kind: "derivation", usage: "A Tone contrast or Tone tint input the tone inks and tints are solved from.", rules: [TONE_FLOOR] })],
  [/^solid-(light|dark)-\d+$/, () => ({ kind: "derivation", usage: "A candidate Solid step for the accent's fill in one mode (axes/accent.ts).", rules: [NOT_REGISTERED] })],
  [/^stroke-\w+-step$|^stroke-strength$/, () => ({ kind: "derivation", usage: "A stroke group's amount, which its `edge-<group>` role reads.", rules: [NOT_REGISTERED] })],
  [/^(type|ui|density)-(level|dense|gap-step|base|box|icon|icon-line|icon-xs|icon-xs-cut|leading|level-max|level-min|reading-leading|small-leading)$/, m => ({ kind: "derivation", usage: `A type or density input (${m[0]}) the size ramps are computed from.`, rules: [HEIGHTS] })],

  // Settings as numbers.
  [/^(contrast-more|elevation|status-match|strength-accent|action-accent|selected-tint-(accent|neutral)|label-tint|ink-tint|ground-(light|dark)|layers-(light|dark)|card-tone-(light|dark)|overlay-scale|device-pixel|loaded|edge-shift-(light|dark)|row-danger-tint|fill-(hover|selected|pressed)-step)$/, m => ({ kind: "setting", usage: `A setting's value as a number (${m[0]}), which derivations mix by.`, rules: [SETTINGS_SCOPE, NOT_REGISTERED] })],

  // Ink roles.
  [/^fg-default$/, () => ({ kind: "role", usage: "The ink for what is read: text, values, titles.", rules: [TEXT_45, FG_FIXED, TONE_NEVER_MOVES] })],
  [/^fg-muted$/, () => ({ kind: "role", usage: "The ink for what explains: descriptions, header cells, secondary text.", rules: [TEXT_45, FG_FIXED, TONE_NEVER_MOVES] })],
  [/^fg-quiet$/, () => ({ kind: "role", usage: "Ghost controls' icons and quiet marks.", rules: [FG_FIXED] })],
  [/^fg-subtle$/, () => ({ kind: "role", usage: "The ink for meta quieter than a description: a shortcut, a timestamp, line numbers.", rules: [TEXT_45, FG_FIXED, TONE_NEVER_MOVES] })],
  [/^fg-placeholder$/, () => ({ kind: "role", usage: "A field's placeholder, the subtle ink.", rules: [TEXT_45] })],
  [/^fg-disabled$/, () => ({ kind: "role", usage: "Text and icons of a disabled control, a share of the way from its ground to the muted ink." })],
  [/^fg-selection$|^fg-on-selection$/, m => ({ kind: "role", usage: m[0] === "fg-selection" ? "The ink of selected text and the selection's mark." : "Words on the selection's fill.", rules: [TONE_NEVER_MOVES] })],
  [/^fg-action$|^fg-on-action$/, m => ({ kind: "role", usage: m[0] === "fg-action" ? "The Action role's ink: what a primary control's words read off the page." : "Words on the Action fill (a solid Button).", rules: [TONE_NEVER_MOVES] })],
  [/^fg-on-(inverse|neutral|brand-ground)$/, m => ({ kind: "role", usage: `Words on the ${m[1] === "brand-ground" ? "brand's ground" : `${m[1]} fill`}.`, rules: [TEXT_45, TONE_NEVER_MOVES] })],
  [/^fg-change-(added|deleted|modified|renamed|untracked)$/, m => ({ kind: "role", usage: `The ink of a ${m[1]} change's count or letter (Edit summary, Changes).`, rules: [TEXT_45] })],
  [new RegExp(`^fg-on-(${TONES})$`), m => ({ kind: "role", usage: `Words on ${toneWords(m[1]!)}'s solid fill.`, rules: [TEXT_45, TONE_NEVER_MOVES] })],
  [new RegExp(`^fg-(${TONES})-vivid$`), m => ({ kind: "role", usage: `${cap(toneWords(m[1]!))}'s vivid ink, its most vivid readable rung: Field and Choice messages.`, rules: [TONE_NEVER_MOVES] })],
  [new RegExp(`^fg-(${TONES})-strong$`), m => ({ kind: "role", usage: `${cap(toneWords(m[1]!))}'s strong ink, a step past its words (750 in light, 100 in dark).`, rules: [TEXT_45] })],
  [new RegExp(`^fg-(${TONES})-mark$`), m => ({ kind: "role", usage: `${cap(toneWords(m[1]!))}'s mark ink: the icon a status surface leads with (Alert, Toast).` })],
  [/^fg-accent$/, () => ({ kind: "role", usage: "The accent's ink: links and selection words.", rules: [TEXT_45, TONE_NEVER_MOVES] })],
  [new RegExp(`^fg-(${TONES})$`), m => ({ kind: "role", usage: `${cap(toneWords(m[1]!))}'s words on its tints, the page, the surface and the subtle ground.`, rules: [TONE_FLOOR, TONE_FLOOR_BELOW] })],

  // Tone fills and strokes.
  [new RegExp(`^(${TONES})-surface(-hover|-active)?$`), m => ({ kind: "role", usage: `${cap(toneWords(m[1]!))}'s tinted fill${m[2] === "-hover" ? " under the pointer" : m[2] === "-active" ? ", pressed or selected" : ""} (a soft Badge, an Alert, a Tag).`, rules: [SAME_ROLE] })],
  [new RegExp(`^(${TONES})-border(-subtle|-strong)?$`), m => ({ kind: "role", usage: `${cap(toneWords(m[1]!))}'s ${m[2] ? m[2].slice(1) : "standard"} stroke: an outline Badge or an Alert's frame.`, rules: [r("Tonal supplementary\nborders are measured blends of existing readable ink and canonical surface; their design\nfloors do not replace required-indicator checks.", CONTRAST("roles"))] })],
  [new RegExp(`^(${TONES}|neutral)-solid(-hover)?$`), m => ({ kind: "role", usage: `${cap(m[1] === "neutral" ? "the neutral" : toneWords(m[1]!))}'s solid fill${m[2] ? " under the pointer" : ""}, under its \`fg-on-\` words.` })],
  [new RegExp(`^(${TONES})-indicator$`), m => ({ kind: "role", usage: `${cap(toneWords(m[1]!))}'s indicator: a ring, a check or a selected mark at 3:1.`, rules: [r("`focus-color` and `stroke-selected` are the accent's\nlightest step from 500 that keeps WCAG 3:1 and APCA 45 on every neutral ground and fill", CONTRAST("focus"))] })],

  // Grounds and plates.
  [/^bg-page$/, () => ({ kind: "role", usage: "The page: the window's ground under everything.", rules: [ROLES] })],
  [/^bg-surface$/, () => ({ kind: "role", usage: "A raised surface on the page (a card, a floating list).", rules: [ROLES] })],
  [/^bg-subtle$/, () => ({ kind: "role", usage: "A recessed or quiet ground inside a surface (a well, a code block's head).", rules: [ROLES] })],
  [/^bg-(card|tile|frame|frame-raised|well|stripe|code|inverse|overlay|brand-page|brand-ground)$/, m => ({ kind: "role", usage: `The ${m[1]!.replaceAll("-", " ")} ground.`, rules: [ROLES] })],
  [/^shadow-tooltip-rim$/, () => ({ kind: "derivation", usage: "Tooltip's dark edge strength, the rim its Shadow role would draw: Tooltip's one inset edge takes it.", rules: [NOT_REGISTERED] })],
  [/^bg-float$/, () => ({ kind: "role", usage: "The floating ground: menus, popovers, toasts, dialogs and drawers, a step above the page in dark.", rules: [ROLES] })],
  [/^bg-plate$/, () => ({ kind: "role", usage: "A media placeholder's plate, one step off the card in both themes.", rules: [ROLES] })],
  [/^action-solid(-hover)?$/, m => ({ kind: "role", usage: `The Action fill${m[1] ? " under the pointer" : ""}: a solid Button, neutral by default or the accent when Action is accent.`, rules: [SAME_ROLE] })],
  [/^selection-(accent|band|edge|highlight|solid|solid-hover|surface)(?:-(card|frame|frame-raised|raised|recessed|tile|well|float|page))?(-hover)?$/, m => ({ kind: "role", usage: `The selection's ${m[1]!.replace("-", " ")}${m[2] ? ` on the ${m[2].replace("-", " ")} ground` : ""}${m[3] ? " under the pointer" : ""} (the Selection setting).`, rules: [SAME_ROLE] })],
  [/^hue-(\w+)-(text|icon|border|bg|bg-hover|bg-active|accent|on-accent|bg-translucent|border-translucent)$/, m => ({ kind: "role", usage: `The ${m[1]} label color's ${m[2]!.replace("bg", "fill").replace("-", " ")} (Tag, Board and label colors).` })],
  [/^bg-component(-(?:card|frame|frame-raised|raised|recessed|tile|well|float|page))?(-hover|-active)?$/, m => ({ kind: "role", usage: `${PLATE_USE[m[2] ?? ""]}${m[1] ? `, on the ${m[1].slice(1).replaceAll("-", " ")} ground` : ""}.`, rules: [SAME_ROLE] })],
  [/^bg-(hover|active|pressed)$/, m => ({ kind: "role", usage: `The translucent twin of the ${m[1] === "active" ? "selected" : m[1]} plate, for grounds a component cannot know.`, rules: [TRANSLUCENT_FILLS] })],
  [/^bg-mark(-hover|-pressed)?$/, m => ({ kind: "role", usage: `A translucent fill behind a mark${m[1] === "-hover" ? " under the pointer" : m[1] === "-pressed" ? " while it is pressed (Chip input)" : ""}.`, rules: [r("**Translucent fills follow the same rule.**", DS("strokes"))] })],
  [/^bg-change-(added|deleted)$/, m => ({ kind: "role", usage: `The plate of a ${m[1]} line in a Diff or a Code block.` })],
  [/^wash-pressed-(light|dark)$/, m => ({ kind: "derivation", usage: `The pressed wash's strength in ${m[1]} as a number, for the press on a control fill (bg-pressed-track).` })],
  [/^scrim$/, () => ({ kind: "role", usage: "The shade behind a modal surface (Dialog, Drawer, Command palette)." })],
  [/^gray-surface(-hover|-active)?$/, m => ({ kind: "role", usage: `The gray tag tint${m[1] ? (m[1] === "-hover" ? " under the pointer" : ", pressed") : ""}.` })],

  // Strokes and edges.
  [/^border-width$/, () => ({ kind: "role", usage: "The width of decorative lines: frames of shadowed surfaces and their seams.", rules: [BORDER_WIDTH, REQUIRED_EDGE, NO_1PX] })],
  [/^stroke-width$/, () => ({ kind: "role", usage: "The width of every required line: control, field and state edges, standalone dividers.", rules: [STROKE_WIDTH, NO_1PX] })],
  [/^frame-width$/, () => ({ kind: "role", usage: "The Surface setting's frame width, which `border-width` reads.", rules: [BORDER_WIDTH] })],
  [/^selected-width$/, () => ({ kind: "role", usage: "The width of a selected edge (a chosen card's stroke)." })],
  [/^(border-decorative|border-float|border-card|border-divider|border-faint|border-subtle|border|border-hover)$/, m => ({ kind: "role", usage: RUNG_USE[m[1]!]!, rules: m[1] === "border-decorative" ? [DECORATIVE, RULE_INSIDE] : m[1] === "border-divider" ? [RULE_INSIDE] : [EDGE_ROLES] })],
  [/^stroke-(control|control-hover|selected)$/, m => ({ kind: "role", usage: `A strong endpoint for control identification and selection${m[1] === "control-hover" ? ", under the pointer" : m[1] === "selected" ? ": the selected edge" : " (3:1)"}.`, rules: [r("`stroke-control`, `stroke-control-hover`, `stroke-selected`: strong endpoints for\n  control identification and selection.", CONTRAST("roles"))] })],
  [/^edge-(control|control-hover|control-strong|selected|accent)$/, m => ({ kind: "role", usage: `The ${m[1]!.replaceAll("-", " ")} edge: quiet at standard contrast, the strong stroke under increased contrast.`, rules: [EDGE_ROLES, r("presentation roles selecting quiet or strong endpoints according to contrast preference.", CONTRAST("roles"))] })],
  [/^edge-(cards|blocks|callouts|floating|regions|dividers|fields|buttons|options|tracks|tags|media)$/, m => ({ kind: "role", usage: `${STROKE_GROUP_USE[m[1]!]} (the ${cap(m[1]!)} stroke group).`, rules: m[1] === "dividers" ? [DIVIDER_LIGHTEST, GROUP_REQUIRED] : [GROUP_REQUIRED] })],
  [/^fill-(track|toggle)(-hover)?$/, m => ({ kind: "role", usage: `The ${m[1] === "track" ? "rail of Progress, Meter, Slider and the off Switch" : "fill of an off toggle"}${m[2] ? " under the pointer" : ""}.`, rules: [RAILS] })],
  [/^token-(swatch-ring|bg|bg-subtle|edge|text)$/, m => ({ kind: "component", usage: m[1] === "swatch-ring" ? "The 10% ring round a swatch, a color area or an image well." : `Token row's ${m[1]!.replace("bg", "fill").replace("-", " ")}.`, rules: m[1] === "swatch-ring" ? [TRANSLUCENT_LINES] : [COMPONENT_ROLE] })],

  // Focus.
  [/^focus-(color|width|offset|gap)$/, m => ({ kind: "role", usage: `The focus ring's ${m[1]}${m[1] === "gap" ? ", off containers and text" : ""}.`, rules: [FOCUS, FOCUS_GEOMETRY] })],
  [/^focus-ring-(width|offset|inside-solid)$/, m => ({ kind: "setting", usage: `The Focus ring setting's ${m[1]!.replace("-", " ")}, which the focus roles derive from.`, rules: [SETTINGS_SCOPE, FOCUS_MORE] })],
  [/^focus-solid-(offset|inside)$/, m => ({ kind: "role", usage: m[1] === "offset" ? "The focus ring's offset on a solid fill: off it by the gap, or inside it under Inset." : "Whether a solid fill's ring runs inside it in the fill's own ink (1 under Inset, else 0).", rules: [FOCUS_SOLID] })],
  [/^field-(focus-\w[\w-]*|error-color)$/, m => ({ kind: "role", usage: `An editable field's ${m[1]!.replaceAll("-", " ")}.`, rules: m[1]!.startsWith("focus") ? [FIELD_FOCUS] : [r("Invalid inputs retain their danger edge/context.", CONTRAST("focus"))] })],
  [/^composer-(edge|focus-color)$/, m => ({ kind: "component", usage: `Composer's ${m[1] === "edge" ? "frame" : "focus edge"}.`, rules: [m[1] === "edge" ? r("`composer-edge`\n  (Composer's frame: the card edge, or the strong stroke) follow the same switch", CONTRAST("roles")) : r("Composer keeps the quiet neutral edge (`composer-focus-color`).", CONTRAST("focus"))] })],
  [/^selected-tint$/, () => ({ kind: "role", usage: "The tint a selected plate or card takes.", rules: [SAME_ROLE] })],

  // Shadows.
  [/^shadow-(control|resting|field|tooltip|lift|float|modal|edge)$/, m => ({ kind: "role", usage: `${SHADOW_USE[m[1]!]}.`, rules: [SHADOW_ROLE, SHADOW_NONE, SHADOW_CONTRAST] })],
  [/^shadow-edge-filter$/, () => ({ kind: "role", usage: "The Rest shadow's edge as a filter, for a surface that cannot list a box shadow.", rules: [SHADOW_CONTRAST] })],
  [/^shadow-[1-4]$/, m => ({ kind: "role", usage: `The elevation ramp's step ${m[0].slice(-1)}; read a shadow role where one fits.`, rules: [SHADOW_ROLE] })],

  // Component hooks.
  [/^(input|textarea|select)-(.+)$/, m => ({ kind: "component", usage: `${cap(m[1]!)}'s ${m[2]!.replaceAll("-", " ")}.`, rules: [COMPONENT_ROLE, DEFINED] })],
  [/^badge-max-width$/, () => ({ kind: "component", usage: "The widest a Badge grows before its words truncate.", rules: [COMPONENT_ROLE, DEFINED] })],
  [/^syntax-(keyword|tag|attr|string)$/, m => ({ kind: "role", usage: `Code's ${m[1] === "attr" ? "attribute" : m[1]} color.`, rules: [SYNTAX] })],
  [/^data-(success|warning|danger)$/, m => ({ kind: "role", usage: `A data view's ${m[1]} mark.` })],
  [/^series-(\d)(-area|-fill|-ink|-ramp-\d)?$/, m => ({ kind: "role", usage: `Data series ${m[1]}'s ${m[2] ? m[2].slice(1).replace("-", " step ") : "mark"}.`, rules: [r("Data colours never follow Saturation", THEMING("settings"))] })],

  // Size, type and shape roles.
  [/^control-(xs|sm|md|lg|xl)$/, m => ({ kind: "role", usage: `The ${m[1]} control's height: its text line plus twice its room.`, rules: [HEIGHTS] })],
  [/^control-(xs|sm|md|lg|xl)-(text|leading)$/, m => ({ kind: "role", usage: `The ${m[1]} control's ${m[2] === "text" ? "type size" : "line height"}.`, rules: [HEIGHTS] })],
  [/^icon-(xs|sm|md|lg|xl)$/, m => ({ kind: "role", usage: `The ${m[1]} icon box (a square).` })],
  [/^mark-(sm|md|lg|box|toggle|label-sm|label-md|label-lg)$/, m => ({ kind: "role", usage: `A mark's ${m[1]!.replace("label-", "label at ")} size (Badge, Count, Tag, Kbd, a check box or toggle).` })],
  [/^gap-(xs|sm|md|lg|xl|row|section)$/, m => ({ kind: "role", usage: m[1] === "row" ? "A group's gap: the items of a set (Stack's group, fields, a card's blocks)." : m[1] === "section" ? "A section's gap: sections of a page or a panel, two groups apart (Stack's section)." : `The ${m[1]} gap between related parts.`, rules: [TOKEN_ONCE] })],
  [/^ui-(size|leading|row|row-inset|row-gap|stack|cluster)$/, m => ({ kind: "role", usage: `The UI line's ${m[1]!.replaceAll("-", " ")}.`, rules: [TOKEN_ONCE] })],
  [/^inset-surface-(sm|md)$/, m => ({ kind: "role", usage: `A surface's ${m[1]} inset: its padding.` })],
  [/^inset-page$/, () => ({ kind: "role", usage: "A page's inset: its edge to its sections (the feed's margin)." })],
  [/^(text|title|display)-(xs|sm|base|lg|md)-(size|leading|tracking|prose-leading|prose-gap|code-leading)$/, m => ({ kind: "role", usage: `\`${m[1]}-${m[2]}\`'s ${m[3]!.replace("-", " ")}.` })],
  [/^underline-offset$/, () => ({ kind: "role", usage: "How far an underline sits under its text (0.08em): Link, Mention, Chip, Code and every underlined word." })],
  [/^title-xl-(size|leading|tracking)$/, m => ({ kind: "role", usage: `\`title-xl\`'s ${m[1]}, a document's own title.`, rules: [PAGE_TITLE, PAGE_ROLES] })],
  [/^weight-heading$/, () => ({ kind: "role", usage: "The heading text weight (600): titles from title-sm up, a page's own title and a document's title and headings.", rules: [HEADING_WEIGHT, PAGE_ROLES] })],
  [/^weight-(regular|strong|icon)$/, m => ({ kind: "role", usage: m[1] === "icon" ? "The icon stroke's weight at the type size." : m[1] === "regular" ? "The regular text weight: the Regular weight setting, 400 by default." : "The strong text weight (500)." })],
  [/^font-(sans|mono|keyboard|feature-settings)$/, m => ({ kind: "role", usage: `The ${m[1]!.replace("-", " ")} face.` })],
  [/^keyboard-gap$/, () => ({ kind: "role", usage: "The gap between keys in a shortcut." })],
  [/^radius-control(-(xs|sm|md|lg|xl))?$/, m => ({ kind: "role", usage: `A control's corner${m[2] ? ` at ${m[2]}` : ""}.`, rules: [CONTROLS_RADIUS] })],
  [/^radius-(container|surface)$/, m => ({ kind: "role", usage: m[1] === "container" ? "A surface's corner on the container ladder; an image that stands alone." : "The surface corner the container ladder starts from.", rules: m[1] === "container" ? [IMAGE_ALONE] : [] })],
  [/^radius-small$/, () => ({ kind: "role", usage: "A thumbnail's corner.", rules: [THUMBNAIL] })],
  [/^radius-list-row$|^radius-list$/, m => ({ kind: "role", usage: m[0] === "radius-list" ? "A floating list's corner: its rows' plus its inset." : "A row's corner in a floating list.", rules: [LIST_ROWS] })],
  [/^radius-row$/, () => ({ kind: "role", usage: "A standalone row's corner (Nav, Tree view).", rules: [STANDALONE_ROWS] })],
  [/^radius-(step|floor|min|factor|full|concentric)$/, m => ({ kind: "derivation", usage: `The corner rule's ${m[1]} (axes/radius.ts), which the corner roles read.`, rules: [CONTROLS_RADIUS] })],

  // Motion and state feedback.
  [/^duration-(instant|quick|fast|base|moderate|slow|loop)$/, m => ({ kind: "role", usage: `The ${m[1]} duration.` })],
  [/^ease-(in|out|in-out|linear|spring|drawer|effects|exit)$/, m => ({ kind: "role", usage: `The ${m[1]} easing curve.` })],
  [/^fade-(fast|base|moderate|slow)$/, m => ({ kind: "role", usage: `A fade at the ${m[1]} duration.` })],
  [/^transition$/, () => ({ kind: "role", usage: "The leave of every state: colors and shadows over `duration-quick` on `ease-effects`, a press's scale over `duration-fast` on `ease-out`." })],
  [/^(hover-in|press-in)$/, m => ({ kind: "role", usage: `How a ${m[1] === "hover-in" ? "hover" : "press"} arrives (the Feedback setting).` })],
  [/^feedback-(hover|press|scale|scale-sm|scale-lg|scale-wide)$/, m => ({ kind: "role", usage: `The Feedback setting's ${m[1]!.replace("-", " at ")}.` })],
  [/^opacity-disabled$/, () => ({ kind: "role", usage: "The opacity of a disabled control's parts." })],
];

function cap(text: string): string {
  return text[0]!.toUpperCase() + text.slice(1);
}

/** The usage of one token (with or without its `--area-` prefix); undefined when no pattern covers it. */
export function usageOf(name: string): TokenUsage | undefined {
  const bare = name.replace(/^--area-/, "");
  for (const [pattern, make] of ENTRIES) {
    const match = bare.match(pattern);
    if (match) {
      const entry = make(match);
      return entry.rules?.length ? entry : { kind: entry.kind, usage: entry.usage };
    }
  }
  return undefined;
}

/** Every rule quoted so far, by id; a pattern's inline quotes register when a name it covers is first looked up, so call
 * after `buildUsage` (usage.test.ts holds each to its doc). */
export function quotedRules(): TokenRule[] {
  return [...REGISTRY.values()];
}

/** The usage of every name given, keyed without the prefix; names no pattern covers are left out (the test lists them). */
export function buildUsage(names: Iterable<string>): { usage: Record<string, TokenUsage<string>>; rules: Record<string, Omit<TokenRule, "id">> } {
  const usage: Record<string, TokenUsage<string>> = {};
  const used = new Set<string>();
  for (const name of [...names].map(n => n.replace(/^--area-/, "")).sort()) {
    const entry = usageOf(name);
    if (!entry) continue;
    usage[name] = entry.rules ? { kind: entry.kind, usage: entry.usage, rules: entry.rules.map(rule => rule.id) } : { kind: entry.kind, usage: entry.usage };
    for (const rule of entry.rules ?? []) used.add(rule.id);
  }
  const rules = Object.fromEntries([...REGISTRY.values()].filter(rule => used.has(rule.id)).sort((a, b) => a.id.localeCompare(b.id)).map(({ id, rule, source }) => [id, { rule, source }]));
  return { usage, rules };
}
