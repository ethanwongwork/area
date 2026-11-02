/**
 * Properties for every family (the IA and playground review's step 3, 2026-10-31: "Properties promised, mostly missing";
 * 10 of 118 families had a playground). A family without a hand-made playground (src/content/playgrounds.tsx) gets one
 * derived from its manifest: each variant axis a choice and each boolean or state a switch, at the manifest's defaults,
 * offered only where the component's Props declare it (or it is a native prop, Disabled and Read only), so a control can
 * never offer a value the component does not take. Interaction states the CSS draws (hover, focus-visible, dragging) are
 * not props and are left out.
 *
 * The Stage keeps the tile's demo as written until a property changes; then it renders that demo again with the changed
 * props set on every element of the family's component in it (`Overridden`), and the code is the demo's own snippet with
 * those attributes rewritten (`overriddenCode`). So a tile keeps its frame, items and icons, and only what the Properties
 * say changes. A tile whose snippet does not draw the component (a composition of other parts) shows no Properties.
 */
import { Children, cloneElement, isValidElement, type ComponentType, type ReactNode } from "react";
import * as AreaReact from "@area/react";
import { MANIFESTS } from "@area/styles/manifest";
import SOURCES from "virtual:component-sources";
import { DEMOS } from "./registry.tsx";
import type { Config, Playground, PlaygroundControl, PropValue } from "./playgrounds.tsx";

type Manifest = { variants: Record<string, readonly string[]>; booleans?: readonly string[]; states?: readonly string[]; defaults: Record<string, string> };

const camel = (name: string) => name.replace(/-([a-z])/g, (_, letter: string) => letter.toUpperCase());
const pascal = (name: string) => name[0]!.toUpperCase() + name.slice(1);
const sentence = (name: string) => { const words = name.replace(/([a-z])([A-Z])/g, "$1 $2").toLowerCase(); return words[0]!.toUpperCase() + words.slice(1); };
/** Native props every control takes from its element, which a Props interface inherits rather than declares. */
const NATIVE = new Set(["disabled", "readOnly"]);
/** A manifest state's prop name: read-only and readonly are React's readOnly. */
const propOf = (state: string) => state === "readonly" || state === "read-only" ? "readOnly" : camel(state);

/** The text of a component's Props interface (`interface ButtonProps … }`), from the React sources, or "". */
function propsText(name: string): string {
  const head = new RegExp(`(?:interface|type) ${name}Props\\b`);
  for (const text of Object.values(SOURCES.react)) {
    const at = text.search(head);
    if (at < 0) continue;
    const end = text.indexOf("\n}", at);
    return text.slice(at, end < 0 ? undefined : end);
  }
  return "";
}

/** The playground a manifest offers, or null when it offers nothing the component takes. */
export function derivedPlayground(manifestKey: string): Playground | null {
  const manifest = (MANIFESTS as unknown as Record<string, Manifest>)[manifestKey];
  // The export the manifest names, whatever its capitals (otpField is OTPField).
  const exports = AreaReact as unknown as Record<string, ComponentType<Record<string, unknown>>>;
  const name = Object.keys(exports).find(key => key.toLowerCase() === manifestKey.toLowerCase()) ?? pascal(manifestKey);
  const component = exports[name];
  if (!manifest || !component) return null;
  const declared = propsText(name);
  const takes = (prop: string) => NATIVE.has(prop) || new RegExp(`\\b${prop}\\??\\s*:`).test(declared);
  const choices: PlaygroundControl[] = Object.entries(manifest.variants)
    .filter(([axis, options]) => options.length > 1 && takes(axis))
    .map(([axis, options]) => {
      const fallback = manifest.defaults[axis] ?? options[0]!;
      return { prop: axis, label: sentence(axis), kind: "choice", options, initial: fallback, fallback };
    });
  const seen = new Set<string>();
  const switches: PlaygroundControl[] = [...(manifest.booleans ?? []), ...(manifest.states ?? [])]
    .map(propOf)
    .filter(prop => !seen.has(prop) && seen.add(prop) && takes(prop))
    .map(prop => ({ prop, label: sentence(prop), kind: "boolean", initial: false, fallback: false }));
  const controls = [...choices, ...switches];
  return controls.length ? { name, component, controls } : null;
}

/** The opening tags of `<Name` in a snippet, as [start, end] (end after the `>`), braces and quotes respected. */
function openingTags(code: string, name: string): Array<[number, number]> {
  const tags: Array<[number, number]> = [];
  const head = new RegExp(`<${name}(?=[\\s/>])`, "g");
  for (let match = head.exec(code); match; match = head.exec(code)) {
    let depth = 0, quote = "";
    for (let at = match.index + name.length + 1; at < code.length; at++) {
      const character = code[at]!;
      if (quote) { if (character === quote) quote = ""; continue; }
      if (character === '"' || character === "'" || character === "`") quote = character;
      else if (character === "{") depth++;
      else if (character === "}") depth--;
      else if (character === ">" && depth === 0) { tags.push([match.index, at + 1]); break; }
    }
  }
  return tags;
}

/** An attribute's simple form in an opening tag: `prop`, `prop="value"`, `prop={value}` with no nested braces. */
const attribute = (prop: string) => new RegExp(`\\s${prop}(?:=(?:"([^"]*)"|\\{([^{}]*)\\}))?(?=[\\s/>])`);

/** Whether a tile's snippet draws the component: its Properties then reach it. */
export const drawsComponent = (playground: Playground, code: string | undefined) => Boolean(code && openingTags(code, playground.name).length);

/** What the tile's demo sets, read from its first `<Name …>`: the Properties start there (defaultChecked counts as checked). */
export function snippetConfig(playground: Playground, code: string): Config {
  const config: Config = Object.fromEntries(playground.controls.map(control => [control.prop, control.initial]));
  const [tag] = openingTags(code, playground.name);
  if (!tag) return config;
  const text = code.slice(...tag);
  for (const control of playground.controls) {
    const match = text.match(attribute(control.prop)) ?? (control.kind === "boolean" ? text.match(attribute(`default${pascal(control.prop)}`)) : null);
    if (!match) continue;
    const value = match[1] ?? match[2];
    if (control.kind === "boolean") config[control.prop] = value === undefined || value.trim() === "true";
    else if (value !== undefined && control.options?.includes(value.replace(/^"|"$/g, ""))) config[control.prop] = value.replace(/^"|"$/g, "");
  }
  return config;
}

/** The props an edit changed from where the tile started. */
const changes = (from: Config, to: Config) => Object.entries(to).filter(([prop, value]) => from[prop] !== value);

/** The tile's snippet with the changed attributes rewritten on every `<Name …>`: set, or left out at the default. */
export function overriddenCode(playground: Playground, code: string, from: Config, to: Config): string {
  const changed = changes(from, to);
  const tags = openingTags(code, playground.name);
  let out = code;
  for (const [start, end] of [...tags].reverse()) {
    let tag = out.slice(start, end);
    for (const [prop, value] of changed) {
      const control = playground.controls.find(entry => entry.prop === prop)!;
      tag = tag.replace(attribute(prop), "").replace(attribute(`default${pascal(prop)}`), "");
      const written = value === control.fallback ? "" : value === true ? ` ${prop}` : value === false ? ` ${prop}={false}` : ` ${prop}="${value}"`;
      tag = tag.replace(`<${playground.name}`, `<${playground.name}${written}`);
    }
    out = out.slice(0, start) + tag + out.slice(end);
  }
  return out;
}

/** Sets the changed props on every element of `component` in a tree, through children and fragments. */
function apply(node: ReactNode, component: unknown, props: Record<string, PropValue>): ReactNode {
  if (Array.isArray(node)) return Children.map(node, child => apply(child, component, props));
  if (!isValidElement<{ children?: ReactNode }>(node)) return node;
  const children = node.props.children === undefined ? undefined : apply(node.props.children, component, props);
  const own = node.type === component ? props : {};
  return children === undefined ? cloneElement(node, own) : cloneElement(node, own, children);
}

/**
 * The tile's demo with the Properties' changes set on the component's elements. The demo is called here, so its own hooks
 * are this component's: keyed by demo where it is used, it always calls the same one.
 */
export function Overridden({ playground, demo, from, to }: { playground: Playground; demo: string; from: Config; to: Config }) {
  const element = (DEMOS[demo] as () => ReactNode)();
  return <>{apply(element, playground.component, Object.fromEntries(changes(from, to)))}</>;
}
