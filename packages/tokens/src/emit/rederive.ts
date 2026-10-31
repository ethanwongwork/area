/**
 * Re-derivation, split by what each setting feeds (2026-10-25: a setting change restyled the app for 350ms, half of it
 * restating every derived token on every element that carries a setting).
 *
 * A derived token resolves where it is declared, so an element that sets an axis restates the derivations (css.ts). It
 * restated all of them, 503 tokens and 155KB of declarations, wherever any one axis was set: the app's chrome sets type
 * and density on 261 elements and each gallery card four colour and depth axes, so one change recomputed every colour and
 * shadow hundreds of times over. A derivation needs restating only where an input it reads (directly or through another
 * derivation) can differ from its parent's, which is where an axis that sets one of those inputs is declared. So each
 * derived token is restated by the attributes whose axes set one of its inputs, and by no other; every element still
 * gets the same values. A token's rule lists all of its attributes, so an element restates each token at most once.
 *
 * Inputs a stylesheet or a host can set outside the axes (Layers' grounds, a component's own fills, a public size hook)
 * break that reasoning: below such an element the old rule restated the derivation against the overridden input at every
 * axis. A derived token that reads one, or is one, is still restated by every axis attribute, as before. OVERRIDABLE lists
 * them; rederive.test.ts fails when a stylesheet or a React inline style sets a token the list does not name.
 */
import { type TokenMap } from "../axes/schema.ts";

/** Tokens set outside the axes: by component and app stylesheets (Layers' grounds above all) and by inline styles. */
export const OVERRIDABLE: readonly string[] = [
  "--area-accent-solid-full", "--area-action-solid", "--area-action-solid-hover", "--area-asset-card-corner",
  "--area-asset-card-name-inset", "--area-asset-card-size", "--area-asset-grid-gap", "--area-bg-component",
  "--area-bg-component-active", "--area-bg-component-hover", "--area-bg-component-pressed", "--area-bg-surface",
  "--area-border", "--area-border-card", "--area-border-decorative", "--area-border-divider", "--area-border-faint",
  "--area-border-float", "--area-border-hover", "--area-border-subtle", "--area-border-width", "--area-button-text",
  "--area-choice-min", "--area-choice-ratio", "--area-chrome-bg", "--area-chrome-fill", "--area-composer-edge",
  "--area-composer-focus-color", "--area-edge-control", "--area-edge-control-hover", "--area-edge-control-strong", "--area-edge-regions",
  "--area-edge-selected", "--area-edge-shift-dark", "--area-edge-shift-light", "--area-fg-default",
  "--area-fg-muted", "--area-fg-on-action", "--area-fg-on-neutral", "--area-file-tile-figure", "--area-fill-toggle",
  "--area-fill-toggle-hover", "--area-fill-track", "--area-fill-track-hover", "--area-folder-size",
  "--area-font-sans", "--area-frame-width", "--area-indicator-anchor-offset", "--area-input-bg-disabled",
  "--area-input-bg-soft", "--area-input-edge", "--area-input-edge-hover", "--area-input-edge-soft",
  "--area-input-inline-size", "--area-list-box-item", "--area-material-frost", "--area-material-transparency",
  "--area-menu-min-inline-size", "--area-nav-inline-size", "--area-neutral-solid", "--area-panel-inline-size",
  "--area-popover-corner", "--area-popover-inline-size", "--area-popover-inset", "--area-radius-control",
  "--area-radius-list", "--area-radius-list-row", "--area-select-edge", "--area-select-edge-hover",
  "--area-select-inline-size", "--area-selection-band", "--area-selection-band-hover", "--area-selection-edge",
  "--area-selection-surface", "--area-selection-surface-hover", "--area-switch-color", "--area-switch-color-hover",
  "--area-textarea-edge", "--area-textarea-edge-hover", "--area-textarea-edge-soft", "--area-token-edge",
  "--area-type-icon-line", "--area-weight-icon",
];

/** The `--area-*` tokens a value reads. */
const reads = (value: string) => [...value.matchAll(/var\((--area-[a-z0-9-]+)/g)].map(match => match[1]!);

/**
 * The re-derivation rules: each a selector list (the attributes that restate its tokens) and its tokens. `triggers` maps
 * every axis-bearing attribute to the tokens its rules set; `overridable` adds tokens set by other generated rules.
 */
export function rederivationRules(derived: TokenMap, triggers: ReadonlyArray<readonly [string, ReadonlySet<string>]>, overridable: Iterable<string> = []): Array<[string[], Record<string, string>]> {
  const outside = new Set([...OVERRIDABLE, ...overridable]);
  const inputs = new Map<string, Set<string>>();
  const inputsOf = (name: string): Set<string> => {
    const known = inputs.get(name);
    if (known) return known;
    const set = new Set<string>();
    inputs.set(name, set);
    for (const ref of reads(derived[name]!)) {
      set.add(ref);
      if (ref in derived) for (const deeper of inputsOf(ref)) set.add(deeper);
    }
    return set;
  };
  const groups = new Map<string, [string[], Record<string, string>]>();
  for (const [name, value] of Object.entries(derived)) {
    const own = inputsOf(name);
    const always = outside.has(name) || [...own].some(input => outside.has(input));
    const selectors = triggers.filter(([, keys]) => always || [...own].some(input => keys.has(input))).map(([attribute]) => `[${attribute}]`);
    // Reads nothing an axis or a stylesheet sets: the root's value holds everywhere.
    if (!selectors.length) continue;
    const key = selectors.join(",");
    if (!groups.has(key)) groups.set(key, [selectors, {}]);
    groups.get(key)![1][name] = value;
  }
  return [...groups.values()];
}
