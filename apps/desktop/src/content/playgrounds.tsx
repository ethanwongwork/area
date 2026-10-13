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
import { AccordionItem, Badge, Button } from "@area/react";
import { MANIFESTS } from "@area/styles/manifest";

export type PropValue = string | boolean;
export type Config = Record<string, PropValue>;

export interface PlaygroundControl {
  prop: string;
  label: string;
  kind: "choice" | "boolean" | "text";
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
}

type Manifest = { variants: Record<string, readonly string[]>; booleans?: readonly string[]; states?: readonly string[]; defaults: Record<string, string> };
interface Offer {
  choices: string[];
  switches: Array<string | { prop: string; initial?: boolean; event?: string; codeName?: string }>;
  /** Text props and where they start: `children` is the content. */
  text?: Record<string, string>;
}

const camel = (name: string) => name.replace(/-([a-z])/g, (_, letter: string) => letter.toUpperCase());
const sentence = (name: string) => { const words = name.replace(/([a-z])([A-Z])/g, "$1 $2").toLowerCase(); return words[0]!.toUpperCase() + words.slice(1); };

/** The manifest's axes, booleans and states that the Stage offers, in the manifest's order. */
function controlsOf(manifest: Manifest, offer: Offer): PlaygroundControl[] {
  const choices = offer.choices.map(axis => {
    const options = manifest.variants[axis];
    if (!options) throw new Error(`The manifest has no axis "${axis}"`);
    const fallback = manifest.defaults[axis] ?? options[0]!;
    return { prop: axis, label: sentence(axis), kind: "choice" as const, options, initial: fallback, fallback };
  });
  const declared = [...(manifest.booleans ?? []), ...(manifest.states ?? [])].map(camel);
  const switches = offer.switches.map(entry => {
    const { prop, initial = false, event, codeName } = typeof entry === "string" ? { prop: entry } : entry;
    if (!declared.includes(prop)) throw new Error(`The manifest declares no boolean or state "${prop}"`);
    return { prop, label: sentence(prop), kind: "boolean" as const, initial, fallback: false, event, codeName };
  });
  const text = Object.entries(offer.text ?? {}).map(([prop, initial]) => ({ prop, label: prop === "children" ? "Content" : sentence(prop), kind: "text" as const, initial }));
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
  button: {
    name: "Button",
    component: Button as ComponentType<Record<string, unknown>>,
    // align pulls an unfilled button back to the text above it: shown in its tile's context only.
    controls: controlsOf(MANIFESTS.button, { choices: ["variant", "tone", "size"], switches: ["pill", "fullWidth", "selected", "loading", "disabled"], text: { children: "Button" } }),
    compositions: ["align-start", "align-end"],
  },
  badge: {
    name: "Badge",
    component: Badge as ComponentType<Record<string, unknown>>,
    controls: controlsOf(MANIFESTS.badge, { choices: ["variant", "tone", "size"], switches: ["dot", "pill"], text: { children: "Badge" } }),
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
  const props: Record<string, unknown> = Object.fromEntries(changedProps(playground, config).map(([control, value]) => [control.prop, value]));
  for (const control of playground.controls) {
    if (!control.event) continue;
    props[control.prop] = config[control.prop];
    props[control.event] = (value: PropValue) => onChange(control.prop, value);
  }
  const instance = <Component {...props}>{config.children as string}</Component>;
  return playground.frame ? <div style={playground.frame}>{instance}</div> : instance;
}

/** The configured instance as code: its import, then the JSX with only non-default props. */
export function configCode(playground: Playground, config: Config): string {
  const props = changedProps(playground, config)
    .map(([control, value]) => {
      const name = control.codeName ?? control.prop;
      return value === true ? ` ${name}` : value === false ? ` ${name}={false}` : String(value).includes('"') ? ` ${name}={${JSON.stringify(value)}}` : ` ${name}="${value}"`;
    })
    .join("");
  const content = String(config.children ?? "").replace(/[{}<>]/g, character => `{"${character}"}`);
  return `import { ${playground.name} } from "@area/react";\n\n<${playground.name}${props}>${content}</${playground.name}>`;
}
