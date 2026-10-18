/**
 * The Stage's playgrounds: families whose Stage can render a configured instance that the
 * Inspector's Properties edit (owner, 2026-10-12: "Inspector: what is rendered"; the Figma and
 * Storybook model, docs/research/component-stage-2026-10-12.md).
 *
 * The controls come from the component's manifest (packages/styles/src/manifest.ts): its variant
 * axes are choices, its booleans and states switches, with the manifest's defaults. A playground
 * only names which of them the Stage offers and its text, so a control can never offer a value the
 * CSS does not draw. Code is generated from the same props, so the snippet is the source of what
 * the Stage renders.
 *
 * A tile whose specimen is exactly a prop combination (size-sm, solid-info, state-loading) opens as
 * that configuration; any other tile (an icon, a shortcut, context around the component) is a
 * composition and the Stage shows its demo as written.
 */
import type { ComponentType, CSSProperties, ReactNode } from "react";
import { AccordionItem, Badge, Button, Checkbox, Chip, Count, Input, Spinner, Switch, Tag } from "@area/react";
import { MANIFESTS } from "@area/styles/manifest";

export type PropValue = string | boolean;
export type Config = Record<string, PropValue>;

export interface PlaygroundControl {
  prop: string;
  label: string;
  kind: "choice" | "boolean" | "text";
  /** A text control that holds a number (Count's count): rendered and printed as one. */
  numeric?: boolean;
  options?: readonly string[];
  /** Where the playground starts, and what Reset returns to. */
  initial: PropValue;
  /** The component's own default: the value the code leaves out. Text has none, so it always prints. */
  fallback?: PropValue;
  /**
   * A state the reader also changes on the Stage (an accordion opened by its trigger): the Stage
   * renders it controlled and this event writes it back, so the switch follows the click.
   */
  event?: string;
  /** The prop the code names instead (`defaultOpen`: the code shows the uncontrolled start). */
  codeName?: string;
}

export interface Playground {
  /** The JSX name, as the code shows it. */
  name: string;
  component: ComponentType<Record<string, unknown>>;
  controls: PlaygroundControl[];
  /** Tiles named like a prop combination that render more than it (context, slots). */
  compositions?: readonly string[];
  /** Tiles whose configuration their name does not say (state-closed: the default, shut). */
  tiles?: Record<string, Config>;
  /** The Stage's frame round the instance, the demo's own (not part of the code). */
  frame?: CSSProperties;
  /** Props every instance carries, printed first (an Input's aria-label). */
  fixed?: Record<string, string>;
}

type Manifest = { variants: Record<string, readonly string[]>; booleans?: readonly string[]; states?: readonly string[]; defaults: Record<string, string> };
interface Offer {
  /** Axes, by name, or with the value the playground starts on when its default tile is not the manifest's default. */
  choices: Array<string | { axis: string; initial: string }>;
  switches: Array<string | { prop: string; initial?: boolean; event?: string; codeName?: string }>;
  /** Text props and where they start: `children` is the content; a number is a numeric field. */
  text?: Record<string, string | number>;
}

const camel = (name: string) => name.replace(/-([a-z])/g, (_, letter: string) => letter.toUpperCase());
const sentence = (name: string) => { const words = name.replace(/([a-z])([A-Z])/g, "$1 $2").toLowerCase(); return words[0]!.toUpperCase() + words.slice(1); };

/** The manifest's axes, booleans and states that the Stage offers, in the manifest's order. */
function controlsOf(manifest: Manifest, offer: Offer): PlaygroundControl[] {
  const choices = offer.choices.map(entry => {
    const { axis, initial } = typeof entry === "string" ? { axis: entry, initial: undefined } : entry;
    const options = manifest.variants[axis];
    if (!options) throw new Error(`The manifest has no axis "${axis}"`);
    if (initial !== undefined && !options.includes(initial)) throw new Error(`"${initial}" is not a value of "${axis}"`);
    const fallback = manifest.defaults[axis] ?? options[0]!;
    return { prop: axis, label: sentence(axis), kind: "choice" as const, options, initial: initial ?? fallback, fallback };
  });
  const declared = [...(manifest.booleans ?? []), ...(manifest.states ?? [])].map(camel);
  const switches = offer.switches.map(entry => {
    const { prop, initial = false, event, codeName } = typeof entry === "string" ? { prop: entry } : entry;
    if (!declared.includes(prop)) throw new Error(`The manifest declares no boolean or state "${prop}"`);
    return { prop, label: sentence(prop), kind: "boolean" as const, initial, fallback: false, event, codeName };
  });
  const text = Object.entries(offer.text ?? {}).map(([prop, initial]) => ({
    prop, label: prop === "children" ? "Content" : sentence(prop), kind: "text" as const, initial: String(initial), numeric: typeof initial === "number",
  }));
  return [...choices, ...text, ...switches];
}

export const PLAYGROUNDS: Record<string, Playground> = {
  // Accordion: one item, the default tile (GalleryAccordion). Open is the item's state, so the trigger
  // and the switch move together; the code shows the uncontrolled start, `defaultOpen`, as the demo
  // does. The stack (Accordion: divided, multiple, nested) stays a composition.
  accordion: {
    name: "AccordionItem",
    component: AccordionItem as unknown as ComponentType<Record<string, unknown>>,
    controls: controlsOf(MANIFESTS.accordionItem, {
      choices: ["variant", "size"],
      text: { heading: "Title", children: "Body text" },
      switches: [{ prop: "open", initial: true, event: "onOpenChange", codeName: "defaultOpen" }, "disabled"],
    }),
    compositions: ["variant-divided", "variant-dividedMd", "behavior-multipleOpen", "composition-nested", "content-longTitle"],
    tiles: { "state-closed": { open: false }, "state-disabled": { open: false, disabled: true } },
    frame: { inlineSize: 240 }, // spec: demos/accordion.tsx `frame`
  },
  badge: {
    name: "Badge",
    component: Badge as ComponentType<Record<string, unknown>>,
    controls: controlsOf(MANIFESTS.badge, { choices: ["variant", "tone", "size"], switches: ["dot", "pill"], text: { children: "Badge" } }),
  },
  button: {
    name: "Button",
    component: Button as ComponentType<Record<string, unknown>>,
    controls: controlsOf(MANIFESTS.button, { choices: ["variant", "tone", "size"], switches: ["pill", "fullWidth", "selected", "loading", "disabled"], text: { children: "Button" } }),
    // Full width stretches to its tile's frame, and align pulls an unfilled button back to the text
    // above it: both read only in their tile's context.
    compositions: ["align-start", "align-end", "fullWidth"],
    tiles: { "state-selected": { selected: true, variant: "ghost", children: "Selected" } },
  },
  // Checkbox: one box and its label. Checked is its state (the box and the switch move together);
  // the default tile starts checked. Cards and groups stay compositions.
  checkbox: {
    name: "Checkbox",
    component: Checkbox as unknown as ComponentType<Record<string, unknown>>,
    controls: controlsOf(MANIFESTS.checkbox, {
      choices: ["size"],
      text: { label: "Label" },
      switches: [{ prop: "checked", initial: true, event: "onCheckedChange", codeName: "defaultChecked" }, "indeterminate", "invalid", "disabled"],
    }),
    tiles: {
      "state-selected": { checked: true },
      partialSelection: { checked: false, indeterminate: true },
      "state-invalid": { checked: false, invalid: true },
      "state-invalidSelected": { invalid: true },
      "state-disabled": { checked: false, disabled: true },
      "state-disabledSelected": { disabled: true },
      "state-disabledIndeterminate": { checked: false, indeterminate: true, disabled: true },
    },
    compositions: ["size-md", "size-lg"],
  },
  // Chip: a filter chip. Selected is its state, toggled by a click as well as the switch.
  chip: {
    name: "Chip",
    component: Chip as unknown as ComponentType<Record<string, unknown>>,
    controls: controlsOf(MANIFESTS.chip, {
      choices: ["kind", "size"],
      text: { children: "Chip" },
      switches: [{ prop: "selected", event: "onSelectedChange", codeName: "defaultSelected" }, "disabled"],
    }),
    tiles: { "behavior-input": { kind: "input", children: "Input" }, "behavior-suggestion": { kind: "suggestion", children: "Suggestion" } },
  },
  count: {
    name: "Count",
    component: Count as unknown as ComponentType<Record<string, unknown>>,
    controls: controlsOf(MANIFESTS.count, { choices: ["variant", "size"], text: { count: 12 }, switches: [] }),
    tiles: { "content-singleDigit": { variant: "soft", count: "3" }, "content-overflow": { variant: "soft", count: "125" } },
  },
  input: {
    name: "Input",
    component: Input as unknown as ComponentType<Record<string, unknown>>,
    fixed: { "aria-label": "Label" },
    controls: controlsOf(MANIFESTS.input, {
      choices: ["variant", "size"],
      text: { placeholder: "Placeholder" },
      switches: ["fullWidth", "monospace", "disabled"],
    }),
    tiles: {
      "variant-outline": { placeholder: "Outline" }, "variant-soft": { variant: "soft", placeholder: "Soft" },
      "size-sm": { size: "sm", placeholder: "Small" }, "size-md": { placeholder: "Medium" }, "size-lg": { size: "lg", placeholder: "Large" },
      "state-disabled": { disabled: true, placeholder: "Disabled" },
    },
    compositions: ["layout-fullWidth", "monospace"],
  },
  spinner: {
    name: "Spinner",
    component: Spinner as unknown as ComponentType<Record<string, unknown>>,
    controls: controlsOf(MANIFESTS.spinner, { choices: ["size"], switches: [] }),
  },
  // Switch: Checked is its state (the track and the switch move together). Hover, press and focus
  // tiles force their look with data-* hooks and stay compositions.
  switch: {
    name: "Switch",
    component: Switch as unknown as ComponentType<Record<string, unknown>>,
    controls: controlsOf(MANIFESTS.switch, {
      choices: ["size", "labelPosition", "track"],
      text: { label: "Label" },
      switches: [{ prop: "checked", event: "onCheckedChange", codeName: "defaultChecked" }, "loading", "readOnly", "disabled"],
    }),
    tiles: {
      long: { track: "long", checked: true },
      labelEnd: {}, labelStart: { labelPosition: "start" },
      "state-disabledChecked": { disabled: true, checked: true },
      "state-readOnly": { readOnly: true, checked: true },
      "state-loading": { loading: true, checked: true },
    },
  },
  // Tag: the default tile is an info tag; each tone's tile names its tone.
  tag: {
    name: "Tag",
    component: Tag as unknown as ComponentType<Record<string, unknown>>,
    controls: controlsOf(MANIFESTS.tag, { choices: [{ axis: "tone", initial: "info" }, "size"], text: { children: "Tag" }, switches: [] }),
    tiles: {
      "tone-neutral": { tone: "neutral", children: "Neutral" }, "tone-info": { children: "Info" }, "tone-success": { tone: "success", children: "Success" },
      "tone-warning": { tone: "warning", children: "Warning" }, "tone-caution": { tone: "caution", children: "Caution" },
      "tone-danger": { tone: "danger", children: "Danger" }, "tone-discovery": { tone: "discovery", children: "Discovery" },
      "tone-gray": { tone: "gray", children: "Gray" }, "tone-brown": { tone: "brown", children: "Brown" },
      "tone-pink": { tone: "pink", children: "Pink" },
    },
  },
};

/** Every control at its initial value. */
export const initialConfig = (playground: Playground): Config =>
  Object.fromEntries(playground.controls.map(control => [control.prop, control.initial]));

/**
 * The configuration a tile's specimen name stands for, or null when it is a composition: the
 * playground's own list first, then default, <axis>-<value> (size-sm), <value>-<value> across two
 * axes (solid-info), state-<flag> (state-loading) and a bare flag (pill, fullWidth).
 */
export function tileConfig(playground: Playground, name: string): Config | null {
  if (playground.compositions?.includes(name)) return null;
  const base = initialConfig(playground);
  const own = playground.tiles?.[name];
  if (own) return { ...base, ...own };
  if (name === "default") return base;
  const choices = playground.controls.filter(control => control.kind === "choice");
  const flags = playground.controls.filter(control => control.kind === "boolean").map(control => control.prop);
  const [head = "", ...rest] = name.split("-");
  const value = rest.join("-");
  if (!value && flags.includes(head)) return { ...base, [head]: true };
  if (head === "state" && flags.includes(value)) return { ...base, [value]: true };
  const axis = choices.find(control => control.prop === head);
  if (axis && axis.options!.includes(value)) return { ...base, [head]: value };
  const first = choices.find(control => control.options!.includes(head));
  const second = choices.find(control => control !== first && control.options!.includes(value));
  if (first && second) return { ...base, [first.prop]: head, [second.prop]: value };
  return null;
}

/** The props that differ from the component's own defaults: what the code prints. Text always prints. */
function changedProps(playground: Playground, config: Config) {
  return playground.controls
    .filter(control => control.prop !== "children" && (control.kind === "text" || config[control.prop] !== control.fallback))
    .map(control => [control, config[control.prop]!] as const);
}

export const sameConfig = (a: Config, b: Config) =>
  Object.keys({ ...a, ...b }).every(key => a[key] === b[key]);

/** The instance on the Stage. A state the reader changes there is controlled and written back. */
export function renderConfig(playground: Playground, config: Config, onChange: (prop: string, value: PropValue) => void): ReactNode {
  const Component = playground.component;
  const props: Record<string, unknown> = {
    ...playground.fixed,
    ...Object.fromEntries(changedProps(playground, config).map(([control, value]) => [control.prop, control.numeric ? Number(value) : value])),
  };
  for (const control of playground.controls) {
    if (!control.event) continue;
    props[control.prop] = config[control.prop];
    props[control.event] = (value: PropValue) => onChange(control.prop, value);
  }
  const instance = "children" in config ? <Component {...props}>{config.children as string}</Component> : <Component {...props} />;
  return playground.frame ? <div style={playground.frame}>{instance}</div> : instance;
}

/** The configured instance as code: its import, then the JSX with only non-default props. */
export function configCode(playground: Playground, config: Config): string {
  const fixed = Object.entries(playground.fixed ?? {}).map(([name, value]) => ` ${name}="${value}"`).join("");
  const props = changedProps(playground, config)
    .map(([control, value]) => {
      const name = control.codeName ?? control.prop;
      if (control.numeric) return ` ${name}={${Number(value)}}`;
      return value === true ? ` ${name}` : value === false ? ` ${name}={false}` : String(value).includes('"') ? ` ${name}={${JSON.stringify(value)}}` : ` ${name}="${value}"`;
    })
    .join("");
  const open = `<${playground.name}${fixed}${props}`;
  const element = "children" in config
    ? `${open}>${String(config.children).replace(/[{}<>]/g, character => `{"${character}"}`)}</${playground.name}>`
    : `${open} />`;
  return `import { ${playground.name} } from "@area/react";\n\n${element}`;
}
