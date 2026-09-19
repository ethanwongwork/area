/** Public, React-free class helpers derived from literal component manifests. */
import { type ComponentManifest, MANIFESTS } from "@area/styles/manifest";
export type { ComponentManifest };
export { MANIFESTS };
import * as manifests from "@area/styles/manifest";

type Camel<S extends string> = S extends `${infer Head}-${infer Tail}` ? `${Head}${Capitalize<Camel<Tail>>}` : S;
type Flags<M> = M extends { booleans: readonly (infer B extends string)[] } ? B : never;
export type VariantProps<M extends ComponentManifest> = {
  [K in keyof M["variants"]]?: M["variants"][K][number];
} & { [K in Flags<M> as Camel<K>]?: boolean };
type Elements<M> = M extends { elements: readonly (infer E extends string)[] } ? E : never;
type States<M> = M extends { states: readonly (infer S extends string)[] } ? S : never;

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}
const camel = (value: string) => value.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());

export function classesFor<M extends ComponentManifest>(manifest: M, props: VariantProps<M> = {}, className?: string): string {
  const flags = new Map((manifest.booleans ?? []).map(flag => [camel(flag), flag]));
  for (const [key, value] of Object.entries(props)) {
    if (!Object.hasOwn(manifest.variants, key) && !flags.has(key)) throw new RangeError(`${manifest.block}: unknown option ${key}`);
    if (value === undefined) continue;
    if (flags.has(key)) {
      if (typeof value !== 'boolean') throw new TypeError(`${manifest.block}: ${key} must be boolean`);
    } else if (!manifest.variants[key]!.includes(value as string)) {
      throw new RangeError(`${manifest.block}: invalid ${key}=${String(value)}`);
    }
  }
  const resolved = { ...manifest.defaults, ...Object.fromEntries(Object.entries(props).filter(([,v])=>v !== undefined)) };
  const parts = [manifest.block];
  for (const key of Object.keys(manifest.variants)) {
    if (resolved[key] !== undefined) parts.push(`${manifest.block}--${resolved[key]}`);
  }
  for (const [key, flag] of flags) if ((props as Record<string, unknown>)[key]) parts.push(`${manifest.block}--${flag}`);
  return cx(...parts, className);
}

export function createVariants<const M extends ComponentManifest>(manifest: M) {
  const fn = (props?: VariantProps<M>, className?: string) => classesFor(manifest, props, className);
  fn.manifest = manifest;
  fn.element = (name: Elements<M>) => {
    if (!manifest.elements?.includes(name)) throw new RangeError(`${manifest.block}: unknown element ${name}`);
    return `${manifest.block}__${name}`;
  };
  return fn;
}

/** Data-state adapter for plain HTML; React may use native or ARIA state instead. */
export function stateAttributes<M extends ComponentManifest>(manifest: M, state: Partial<Record<States<M>, boolean>> = {}): Record<string, string | true> {
  const out: Record<string, string | true> = {};
  for (const [name,value] of Object.entries(state)) {
    if (!manifest.states?.includes(name)) throw new RangeError(`${manifest.block}: unknown state ${name}`);
    if (value !== undefined && typeof value !== 'boolean') throw new TypeError(`${manifest.block}: ${name} must be boolean`);
    const attribute = manifest.stateAttributes?.[name] ?? `data-${name}`;
    if (value) out[attribute] = attribute.startsWith("aria-") ? "true" : attribute.startsWith("data-") ? "" : true;
  }
  return out;
}
export const buttonVariants = /* @__PURE__ */ createVariants(manifests.button);
export const fieldVariants = /* @__PURE__ */ createVariants(manifests.field);
export const inputVariants = /* @__PURE__ */ createVariants(manifests.input);
export const badgeAnchorVariants = /* @__PURE__ */ createVariants(manifests.badgeAnchor);
export const badgeGroupVariants = /* @__PURE__ */ createVariants(manifests.badgeGroup);
export const badgeVariants = /* @__PURE__ */ createVariants(manifests.badge);
export const alertVariants = /* @__PURE__ */ createVariants(manifests.alert);
export const avatarVariants = /* @__PURE__ */ createVariants(manifests.avatar);
export const selectVariants = /* @__PURE__ */ createVariants(manifests.select);
export const textareaVariants = /* @__PURE__ */ createVariants(manifests.textarea);
export const checkboxVariants = /* @__PURE__ */ createVariants(manifests.checkbox);
export const checkboxGroupVariants = /* @__PURE__ */ createVariants(manifests.checkboxGroup);
export const radioVariants = /* @__PURE__ */ createVariants(manifests.radio);
export const radioGroupVariants = /* @__PURE__ */ createVariants(manifests.radioGroup);
export const switchVariants = /* @__PURE__ */ createVariants(manifests.switchControl);
export const spinnerVariants = /* @__PURE__ */ createVariants(manifests.spinner);
export const skeletonVariants = /* @__PURE__ */ createVariants(manifests.skeleton);
export const separatorVariants = /* @__PURE__ */ createVariants(manifests.separator);
export const tableVariants = /* @__PURE__ */ createVariants(manifests.table);
export const segmentedVariants = /* @__PURE__ */ createVariants(manifests.segmented);
export const sliderVariants = /* @__PURE__ */ createVariants(manifests.slider);
export const chipVariants = /* @__PURE__ */ createVariants(manifests.chip);
export const panelVariants = /* @__PURE__ */ createVariants(manifests.panel);
export const navVariants = /* @__PURE__ */ createVariants(manifests.nav);
export const toastVariants = /* @__PURE__ */ createVariants(manifests.toast);
export const menuVariants = /* @__PURE__ */ createVariants(manifests.menu);
