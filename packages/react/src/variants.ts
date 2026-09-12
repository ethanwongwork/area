/**
 * Class-name construction, generated from the component manifests.
 *
 * This is the join between the two implementations. `@area/styles` owns appearance and
 * `@area/react` owns the API, and both are derived from the same manifest object -- so a
 * variant cannot exist in one and not the other. The parity script checks the CSS against
 * that manifest; this file checks the React side against it by construction, because the
 * class names are computed from it rather than typed out.
 *
 * These are plain functions with no React dependency, which is deliberate: the docs site
 * uses them to render framework-free HTML previews from exactly the same source as the
 * React snippets, so a preview and its code sample cannot disagree.
 */
import { type ComponentManifest, MANIFESTS } from "@area/styles/manifest";

export type { ComponentManifest };
export { MANIFESTS };

/**
 * Input to a class-name builder: variant values and boolean flags, loosely typed.
 *
 * Deliberately permissive. The real type safety lives on each component's own props
 * interface, where `variant?: "solid" | "soft" | ...` is declared and checked; making the
 * builder generic as well produced an intersection of a mapped type and an index
 * signature that rejected the very booleans it was meant to accept.
 */
export type VariantProps = Record<string, string | boolean | undefined>;

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

/**
 * Build the class list for a component.
 *
 * Modifier classes carry only the *value*, not the group -- `area-button--outline`, not
 * `area-button--variant-outline`. That keeps selectors short, and it is why the manifest
 * forbids two groups on one component sharing a value.
 */
export function classesFor(
  manifest: ComponentManifest,
  props: VariantProps = {},
  className?: string,
): string {
  const parts: string[] = [manifest.block];
  const resolved: Record<string, unknown> = { ...manifest.defaults, ...stripUndefined(props) };

  for (const group of Object.keys(manifest.variants)) {
    const value = resolved[group];
    if (typeof value === "string" && manifest.variants[group]!.includes(value)) {
      parts.push(`${manifest.block}--${value}`);
    }
  }

  for (const flag of manifest.booleans ?? []) {
    // Booleans are kebab-case in CSS and camelCase in the React API.
    if (props[camel(flag)] === true || props[flag] === true) {
      parts.push(`${manifest.block}--${flag}`);
    }
  }

  return cx(...parts, className);
}

/** A bound class-name builder for one component. */
export function createVariants<M extends ComponentManifest>(manifest: M) {
  const fn = (props?: VariantProps, className?: string) => classesFor(manifest, props, className);
  fn.manifest = manifest;
  fn.element = (name: string) => `${manifest.block}__${name}`;
  return fn;
}

/** Turn declared states into the data attributes the CSS selects on. */
export function stateAttributes(
  manifest: ComponentManifest,
  state: Record<string, boolean | undefined> = {},
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const name of manifest.states ?? []) {
    if (state[camel(name)] === true || state[name] === true) out[`data-${name}`] = "";
  }
  return out;
}

function stripUndefined(props: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(Object.entries(props).filter(([, v]) => v !== undefined));
}

function camel(kebab: string): string {
  return kebab.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());
}

export const buttonVariants = createVariants(MANIFESTS.button!);
export const inputVariants = createVariants(MANIFESTS.input!);
export const badgeVariants = createVariants(MANIFESTS.badge!);
export const alertVariants = createVariants(MANIFESTS.alert!);
export const avatarVariants = createVariants(MANIFESTS.avatar!);
export const selectVariants = createVariants(MANIFESTS.select!);
export const textareaVariants = createVariants(MANIFESTS.textarea!);
export const checkboxVariants = createVariants(MANIFESTS.checkbox!);
export const radioVariants = createVariants(MANIFESTS.radio!);
export const switchVariants = createVariants(MANIFESTS.switch!);
export const spinnerVariants = createVariants(MANIFESTS.spinner!);
export const skeletonVariants = createVariants(MANIFESTS.skeleton!);
export const separatorVariants = createVariants(MANIFESTS.separator!);
export const tableVariants = createVariants(MANIFESTS.table!);
