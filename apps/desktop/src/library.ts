/**
 * A system's library, its inventory and structure (docs/research/system-inventory-2026-11-08; BRIEF "Customization model",
 * layers 2 and 3): the rules over the plain data in src/systems.ts (`SystemLibrary`). Pure, so the code generator and the
 * tests read it as the app does.
 *
 *   Inventory  which families, and which values of each family's axes (variant, tone, size, layout …) and states, a
 *              system includes, and its default on each axis. Values are only the manifest's; nothing new is invented.
 *   Structure  an anatomy axis whose values are alternatives for one role (STRUCTURES). Its data is the inventory's: the
 *              system's default on that axis, and which alternatives stay on offer. One question may reach several
 *              families (Fields: every text field's shell).
 *
 * Rules: an axis that has a default always keeps one value; leaving out the default moves it to the first value still in;
 * a default equal to the manifest's, an empty list and an empty family are dropped, so the library stays a list of
 * differences. States a family cannot work without (KEPT_STATES) are never offered to leave out.
 */
import { EMPTY_LIBRARY, STATE_AXIS, type FamilyChoice, type SystemLibrary } from "./systems.ts";

/** What the library reads of a manifest (packages/styles/src/manifest.ts). */
export interface ManifestShape {
  variants: Record<string, readonly string[]>;
  defaults: Record<string, string>;
  states?: readonly string[];
}

/** States a family is not itself without (a tab is selected, a checkbox checked): always included. */
export const KEPT_STATES: ReadonlySet<string> = new Set(["selected", "checked", "indeterminate", "open", "expanded", "current", "pressed", "active", "preview"]);

/**
 * The structure questions (BRIEF layer 3): an anatomy axis per family, its alternatives drawn on the real component. Only
 * alternatives already in the CSS are offered; missing ones (underlined fields, a dialog's close at the start) are built
 * as values first (area-component-build), then listed here.
 *   base      the value an axis has with no modifier, where the manifest lists none (Tabs' underline is `marker`, the
 *             React default; the manifest's `selection` axis is only ["plate"]). It is offered and may be left out.
 *   reaches   every family the question sets, by slug, each on the same axis.
 */
export interface Structure {
  id: string;
  label: string;
  /** The question, as Setup would ask it. */
  question: string;
  axis: string;
  base?: string;
  reaches: readonly string[];
  alternatives: ReadonlyArray<{ value: string; label: string; description: string }>;
}
export const STRUCTURES: readonly Structure[] = [
  {
    id: "tabs-selection", label: "Selected tab", question: "How is the selected tab marked?", axis: "selection", base: "marker",
    reaches: ["tabs"],
    alternatives: [
      { value: "marker", label: "Underline", description: "A rounded line under the selected tab; labels align with the panel." },
      { value: "plate", label: "Plate", description: "A soft plate behind the selected tab; plain muted labels." },
    ],
  },
  {
    id: "field-shell", label: "Field shell", question: "How are text fields drawn?", axis: "variant",
    reaches: ["input", "select", "textarea", "input-group", "number-field"],
    alternatives: [
      { value: "outline", label: "Outlined", description: "An edge around the field on the page's ground." },
      { value: "soft", label: "Soft", description: "A tinted fill with no edge until focus." },
    ],
  },
  {
    id: "field-label", label: "Labels", question: "Where do field labels sit?", axis: "orientation",
    reaches: ["field"],
    alternatives: [
      { value: "vertical", label: "Above", description: "The label over its control, the description under it." },
      { value: "horizontal", label: "Beside", description: "The label in a column at the start, the control after it." },
      { value: "auto", label: "By width", description: "Beside where there is room, above where there is not." },
    ],
  },
];
/** The structure question a family's axis answers, if any. */
export const structureOf = (slug: string, axis?: string) => STRUCTURES.find(entry => entry.reaches.includes(slug) && (axis === undefined || entry.axis === axis));

/** One value of an axis as the system has it. */
export interface ResolvedValue { value: string; included: boolean; isDefault: boolean }
export interface ResolvedAxis {
  axis: string;
  values: ResolvedValue[];
  /** The system's default, or undefined for an axis with none (a modifier a use adds). */
  default?: string;
  /** Whether the axis is a structure question's. */
  structure?: Structure;
}
/** A family as a system has it: what the code generator emits. */
export interface ResolvedFamily {
  included: boolean;
  axes: ResolvedAxis[];
  /** Every state, those left out marked; kept states are always included. */
  states: Array<{ value: string; included: boolean; kept: boolean }>;
}

/** An axis's values, its structure base first. */
function valuesOf(slug: string, axis: string, manifest: ManifestShape): string[] {
  const base = structureOf(slug, axis)?.base;
  const listed = manifest.variants[axis] ?? [];
  return base && !listed.includes(base) ? [base, ...listed] : [...listed];
}
/** An axis's manifest default: its own, else the structure's base. */
const baseDefault = (slug: string, axis: string, manifest: ManifestShape) => manifest.defaults[axis] ?? structureOf(slug, axis)?.base;

export function resolveFamily(slug: string, choice: FamilyChoice | undefined, manifest: ManifestShape): ResolvedFamily {
  const axes = Object.keys(manifest.variants).map(axis => {
    const values = valuesOf(slug, axis, manifest);
    const out = new Set(choice?.leftOut?.[axis] ?? []);
    const fallback = baseDefault(slug, axis, manifest);
    const wanted = choice?.defaults?.[axis] ?? fallback;
    const included = values.filter(value => !out.has(value));
    const chosen = wanted !== undefined && included.includes(wanted) ? wanted : fallback !== undefined ? included[0] : undefined;
    return {
      axis, default: chosen, structure: structureOf(slug, axis),
      values: values.map(value => ({ value, included: !out.has(value), isDefault: value === chosen })),
    };
  });
  const outStates = new Set(choice?.leftOut?.[STATE_AXIS] ?? []);
  const states = (manifest.states ?? []).map(value => {
    const kept = KEPT_STATES.has(value);
    return { value, kept, included: kept || !outStates.has(value) };
  });
  return { included: choice?.included !== false, axes, states };
}

/** Whether the library leaves anything of a family out or moves a default. */
export const isChanged = (library: SystemLibrary, slug: string) => Boolean(library.families[slug]);

/** The library with one family's choice replaced, cleaned (empty lists, manifest defaults and empty families dropped). */
function withFamily(library: SystemLibrary, slug: string, manifest: ManifestShape, change: (choice: FamilyChoice) => FamilyChoice): SystemLibrary {
  const next = change({ ...(library.families[slug] ?? {}) });
  const clean: FamilyChoice = {};
  if (next.included === false) clean.included = false;
  const leftOut = Object.fromEntries(Object.entries(next.leftOut ?? {}).filter(([, values]) => values.length));
  if (Object.keys(leftOut).length) clean.leftOut = leftOut;
  const defaults = Object.fromEntries(Object.entries(next.defaults ?? {}).filter(([axis, value]) => value !== baseDefault(slug, axis, manifest)));
  if (Object.keys(defaults).length) clean.defaults = defaults;
  const families = { ...library.families };
  if (Object.keys(clean).length) families[slug] = clean; else delete families[slug];
  return { families };
}

/** The library with a family left out, or included again (its own choices kept). */
export function setFamilyIncluded(library: SystemLibrary, slug: string, manifest: ManifestShape, included: boolean): SystemLibrary {
  return withFamily(library, slug, manifest, choice => {
    const { included: _, ...rest } = choice;
    return included ? rest : { ...rest, included: false };
  });
}

/**
 * The library with one value of an axis left out or included again. An axis with a default keeps one value (leaving out
 * its last does nothing); leaving out the default moves it to the first value still in. A kept state never leaves.
 */
export function setValueIncluded(library: SystemLibrary, slug: string, manifest: ManifestShape, axis: string, value: string, included: boolean): SystemLibrary {
  if (axis === STATE_AXIS && KEPT_STATES.has(value)) return library;
  const order = axis === STATE_AXIS ? [...(manifest.states ?? [])] : valuesOf(slug, axis, manifest);
  if (!order.includes(value)) return library;
  const resolved = resolveFamily(slug, library.families[slug], manifest).axes.find(entry => entry.axis === axis);
  const stillIn = resolved?.values.filter(entry => entry.included && entry.value !== value) ?? [];
  if (!included && resolved?.default !== undefined && !stillIn.length) return library;
  return withFamily(library, slug, manifest, choice => {
    const out = new Set(choice.leftOut?.[axis] ?? []);
    if (included) out.delete(value); else out.add(value);
    const leftOut = { ...choice.leftOut, [axis]: order.filter(entry => out.has(entry)) };
    const defaults = { ...choice.defaults };
    if (!included && resolved?.default === value) defaults[axis] = stillIn[0]!.value;
    return { ...choice, leftOut, defaults };
  });
}

/** The library with an axis's default set (and the value included, if it was left out). */
export function setDefault(library: SystemLibrary, slug: string, manifest: ManifestShape, axis: string, value: string): SystemLibrary {
  if (!valuesOf(slug, axis, manifest).includes(value)) return library;
  return withFamily(library, slug, manifest, choice => {
    const leftOut = { ...choice.leftOut, [axis]: (choice.leftOut?.[axis] ?? []).filter(entry => entry !== value) };
    return { ...choice, leftOut, defaults: { ...choice.defaults, [axis]: value } };
  });
}

/** A structure answered: the default on its axis in every family it reaches. */
export function chooseStructure(library: SystemLibrary, structure: Structure, value: string, manifests: (slug: string) => ManifestShape | undefined): SystemLibrary {
  return structure.reaches.reduce((next, slug) => {
    const manifest = manifests(slug);
    return manifest ? setDefault(next, slug, manifest, structure.axis, value) : next;
  }, library);
}
/** A structure's alternative kept on offer or left out, in every family it reaches. */
export function offerStructure(library: SystemLibrary, structure: Structure, value: string, offered: boolean, manifests: (slug: string) => ManifestShape | undefined): SystemLibrary {
  return structure.reaches.reduce((next, slug) => {
    const manifest = manifests(slug);
    return manifest ? setValueIncluded(next, slug, manifest, structure.axis, value, offered) : next;
  }, library);
}

/** A family's choices set back to Area's (the family's row's Reset). */
export function resetFamily(library: SystemLibrary, slug: string): SystemLibrary {
  if (!library.families[slug]) return library;
  const families = { ...library.families };
  delete families[slug];
  return Object.keys(families).length ? { families } : EMPTY_LIBRARY;
}

/**
 * Which of a family's choices a gallery tile shows, read from its specimen name (src/content/specimen-names.mjs):
 * "size-sm" → size sm, "outline-danger" → variant outline and tone danger, "state-loading" → state loading,
 * "selection-plate" → selection plate. A part the manifest doesn't know (a composition, content) shows nothing.
 */
export function tileChoices(name: string, manifest: ManifestShape): Array<{ axis: string; value: string }> {
  const kebab = (text: string) => text.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
  const [head = "", ...rest] = name.split("-");
  const value = kebab(rest.join("-"));
  if (head === "state" && value) return (manifest.states ?? []).includes(value) ? [{ axis: STATE_AXIS, value }] : [];
  if (head in manifest.variants && value) return manifest.variants[head]!.includes(value) ? [{ axis: head, value }] : [];
  return name.split("-").flatMap(part => {
    const token = kebab(part);
    const axis = Object.keys(manifest.variants).find(key => manifest.variants[key]!.includes(token));
    return axis ? [{ axis, value: token }] : [];
  });
}
/** Whether a tile shows something the system leaves out. */
export function tileLeftOut(name: string, resolved: ResolvedFamily, manifest: ManifestShape): boolean {
  return tileChoices(name, manifest).some(({ axis, value }) => axis === STATE_AXIS
    ? resolved.states.some(state => state.value === value && !state.included)
    : resolved.axes.some(entry => entry.axis === axis && entry.values.some(item => item.value === value && !item.included)));
}

/**
 * The library's defaults as @area/react's SystemDefaults takes them: per manifest name ("inputGroup"), the axes whose
 * default the system moved. Only defaults; what is left out is the gallery's and the generator's, never a use's.
 */
export function systemDefaults(library: SystemLibrary, manifestName: (slug: string) => string | undefined): Record<string, Record<string, string>> {
  const out: Record<string, Record<string, string>> = {};
  for (const [slug, choice] of Object.entries(library.families)) {
    const name = manifestName(slug);
    if (name && choice.defaults && Object.keys(choice.defaults).length) out[name] = { ...choice.defaults };
  }
  return out;
}

/** An axis's name in the Inspector: "variant" → "Variants", "state" → "States". */
export function axisLabel(axis: string): string {
  const named: Record<string, string> = { variant: "Variants", tone: "Tones", size: "Sizes", state: "States", layout: "Layouts", orientation: "Orientation", selection: "Selection" };
  return named[axis] ?? axis.charAt(0).toUpperCase() + axis.slice(1).replace(/-/g, " ");
}
/** A value in words: "sm" → "Small", "single-line" → "Single line", "marker" on its structure → its alternative's name. */
export function valueLabel(slug: string, axis: string, value: string): string {
  const alternative = structureOf(slug, axis)?.alternatives.find(entry => entry.value === value);
  if (alternative) return alternative.label;
  const sizes: Record<string, string> = { xs: "Extra small", sm: "Small", md: "Medium", lg: "Large", xl: "Extra large" };
  if (sizes[value]) return sizes[value]!;
  const words = value.replace(/-/g, " ");
  return words.charAt(0).toUpperCase() + words.slice(1);
}

/** What the library leaves out of a family, in words, for the List view: "Outline; Danger; Loading". */
export function leftOutSummary(slug: string, resolved: ResolvedFamily): string[] {
  return [
    ...resolved.axes.flatMap(axis => axis.values.filter(value => !value.included).map(value => valueLabel(slug, axis.axis, value.value))),
    ...resolved.states.filter(state => !state.included).map(state => valueLabel(slug, STATE_AXIS, state.value)),
  ];
}

/**
 * How many times a screen's source uses something a release leaves out (the project notice's "3 layers here use it"):
 * each `<Component` tag; with `axis` and `value`, each such tag that sets `axis="value"` (or `axis={"value"}`); with `axis`
 * alone (a state's boolean prop), each that writes it. Only
 * written uses count: a use that leans on a default the release moves is not a use of the value left out.
 */
export function usesIn(code: string, component: string, axis?: string, value?: string): number {
  const tags = code.match(new RegExp(`<${component}(?![A-Za-z0-9_])[^>]*>`, "g")) ?? [];
  if (axis === undefined) return tags.length;
  // A state is a boolean prop: written at all (`loading`, `loading={busy}`) is a use.
  if (value === undefined) return tags.filter(tag => new RegExp(`\\s${axis}(?=[\\s=/>])`).test(tag)).length;
  const set = new RegExp(`\\b${axis}=(?:"${value}"|\\{"${value}"\\}|\\{'${value}'\\})`);
  return tags.filter(tag => set.test(tag)).length;
}
