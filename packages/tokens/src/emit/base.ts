/**
 * Tokens that belong to no axis: the spacing ramp, z-layers, and the cross-axis
 * derivations.
 *
 * Spacing primitives are deliberately fixed. Compact density means components reach for
 * smaller steps, not that 12px quietly becomes 10px -- a scale that moves under you is a
 * scale you cannot reason about.
 *
 * They are also named by their pixel value. `--area-space-12` needs no lookup table; a
 * t-shirt ladder of 3xs/2xs/xs/2s/s/2m/m does, and invites exactly the kind of renumbering
 * that silently shifts every consumer.
 */
import { PREFIX } from "../axes/schema.ts";

/** 4px base with 2px, 6px and 10px half-steps for tight control interiors. */
export const SPACE_RAMP = [0, 2, 4, 6, 8, 10, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96] as const;

/**
 * Type primitives.
 *
 * The same two-tier shape colour uses: a fixed ramp of raw stops, and a semantic layer
 * that points at them. A composite such as `--area-text-md-size` resolves to
 * `var(--area-size-16)` rather than to a literal, so the typography axis picks different
 * stops rather than multiplying arbitrary numbers -- which is what keeps every derived
 * size on the ramp instead of landing on 12.25px.
 */
export const SIZE_RAMP = [
  10, 11, 12, 13, 14, 16, 18, 20, 24, 28, 32, 40, 48, 56, 64, 72, 96, 128,
] as const;

export const LEADING_RAMP = [
  12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 36, 40, 44, 48, 56, 64, 72, 80, 96, 112, 136,
] as const;

/**
 * Weight stops, named by their OpenType `wght` value. The half-steps exist because Geist
 * is variable: 450 and 550 are reachable in it and not in a platform font.
 */
export const WGHT_RAMP = [100, 200, 300, 400, 450, 500, 550, 600, 700, 800, 900] as const;

/** Every radius the system can express. Components use the semantic radius tokens instead. */
export const RADIUS_RAMP = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 24, 32] as const;

export const Z_LAYERS = {
  base: 0,
  raised: 10,
  sticky: 20,
  overlay: 30,
  dropdown: 40,
  modal: 50,
  popover: 60,
  toast: 70,
  tooltip: 80,
} as const;

export function baseTokens(): Record<string, string> {
  const out: Record<string, string> = { "--area-contrast-more": "0", "--area-focus-width": "2px", "--area-focus-offset": "2px", "--area-stroke-width": "1px", "--area-input-inline-size": "16rem" };
  // Keyboard legends use the same native UI face for letters and modifier symbols.
  // Keep this separate from the creative typography axis: a custom text font may lack
  // keyboard glyphs, causing individual characters to fall back at different metrics.
  out["--area-font-keyboard"] = 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  out["--area-keyboard-gap"] = "0.25ch";

  // Pure black and white. Named because they are real answers, not placeholders: every
  // `fg-on-*` token resolves to one of these two after the scale measures which is
  // readable on its own solid fill.
  out[`${PREFIX}white`] = "#ffffff";
  out[`${PREFIX}black`] = "#000000";

  for (const step of SPACE_RAMP) out[`${PREFIX}space-${step}`] = `${step}px`;
  for (const step of SIZE_RAMP) out[`${PREFIX}size-${step}`] = `${step}px`;
  for (const step of LEADING_RAMP) out[`${PREFIX}leading-${step}`] = `${step}px`;
  for (const step of WGHT_RAMP) out[`${PREFIX}wght-${step}`] = String(step);
  for (const step of RADIUS_RAMP) out[`${PREFIX}radius-${step}`] = `${step}px`;
  out[`${PREFIX}radius-full`] = "9999px";

  for (const [name, value] of Object.entries(Z_LAYERS)) out[`${PREFIX}z-${name}`] = String(value);

  // The one disabled dimming, for controls that dim rather than repaint (audit S21b; was 0.5
  // written in 17 rules). Text fields repaint instead (DESIGN_SYSTEM "Shared state paint").
  out[`${PREFIX}opacity-disabled`] = "0.5";

  // Read by AreaProvider in development to detect a missing stylesheet, which otherwise
  // presents as "the components render but look unstyled" with no error anywhere.
  out[`${PREFIX}loaded`] = "1";

  return out;
}

/** Role tokens: `name: color-mix(neutral endpoint, accent endpoint by the switch)`. */
function role(_id: string, switchName: string, map: Record<string, [string, string]>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [name, [neutral, accent]] of Object.entries(map)) {
    out[`${PREFIX}${name}`] =
      `color-mix(in srgb, var(${PREFIX}${neutral}), var(${PREFIX}${accent}) calc(var(${PREFIX}${switchName}) * 100%))`;
  }
  return out;
}

/**
 * Cross-axis derivations.
 *
 * These are the only places two axes meet, and they are expressed as live calc() rather
 * than baked pixels for two reasons: baking would require a block per density-times-radius
 * combination, and custom properties inherit -- so a live calc() is what lets
 * `<aside data-area-ui="compact">` correctly re-derive its own corner radius.
 */
export function derivedTokens(): Record<string, string> {
  return {
    // Presentation aliases choose existing palette endpoints. A preference is not a color
    // axis: it changes emphasis while all eight creative axes keep their own namespaces.
    [`${PREFIX}edge-control`]: `color-mix(in srgb, var(${PREFIX}border-faint), var(${PREFIX}stroke-control) calc(var(${PREFIX}contrast-more) * 100%))`,
    [`${PREFIX}edge-control-hover`]: `color-mix(in srgb, var(${PREFIX}border-subtle), var(${PREFIX}stroke-control-hover) calc(var(${PREFIX}contrast-more) * 100%))`,
    [`${PREFIX}edge-selected`]: `color-mix(in srgb, var(${PREFIX}border-faint), var(${PREFIX}stroke-control) calc(var(${PREFIX}contrast-more) * 100%))`,
    [`${PREFIX}edge-accent`]: `color-mix(in srgb, var(${PREFIX}accent-border), var(${PREFIX}stroke-selected) calc(var(${PREFIX}contrast-more) * 100%))`,
    [`${PREFIX}fill-toggle`]: `color-mix(in srgb, var(${PREFIX}border-subtle), var(${PREFIX}stroke-control) calc(var(${PREFIX}contrast-more) * 100%))`,
    [`${PREFIX}fill-toggle-hover`]: `color-mix(in srgb, var(${PREFIX}border), var(${PREFIX}stroke-control-hover) calc(var(${PREFIX}contrast-more) * 100%))`,
    // Editable fields keep their 1px edge and colour it with the focus role, plus a halo of
    // the same colour at the tone halos' 14% (audit S1, ChatGPT's 1px focus edge). Increased
    // contrast adds the regular 2px outline and expands the halo by that same width.
    [`${PREFIX}field-focus-color`]: `var(${PREFIX}focus-color)`,
    [`${PREFIX}field-focus-halo-color`]:
      `color-mix(in srgb, var(${PREFIX}field-focus-color) 14%, transparent)`,
    // Composer is a surface that holds a field; it keeps the quiet neutral focus edge.
    [`${PREFIX}composer-focus-color`]:
      `color-mix(in srgb, var(${PREFIX}border-subtle), var(${PREFIX}focus-color) calc(var(${PREFIX}contrast-more) * 100%))`,
    [`${PREFIX}field-focus-outline-width`]:
      `calc(var(${PREFIX}focus-width) * var(${PREFIX}contrast-more))`,
    [`${PREFIX}field-focus-halo-width`]:
      `calc(var(${PREFIX}space-2) + var(${PREFIX}focus-width) * var(${PREFIX}contrast-more))`,
    // Emphasis roles (axes/emphasis.ts). Each role is its neutral endpoint mixed toward the
    // accent by the role's 0/1 switch, so the default renders exactly the neutral paint and
    // a subtree that changes theme, neutral or accent re-derives the role here.
    ...role("action", "action-accent", {
      "action-solid": ["neutral-solid", "accent-solid"],
      "action-solid-hover": ["neutral-solid-hover", "accent-solid-hover"],
      "fg-on-action": ["fg-on-neutral", "fg-on-accent"],
      "fg-action": ["fg-default", "fg-accent"],
    }),
    ...role("selection", "selection-accent", {
      "selection-solid": ["neutral-solid", "accent-solid"],
      "selection-solid-hover": ["neutral-solid-hover", "accent-solid-hover"],
      "fg-on-selection": ["fg-on-neutral", "fg-on-accent"],
      "fg-selection": ["fg-default", "fg-accent"],
      "selection-surface": ["bg-component-active", "accent-surface"],
      "selection-surface-hover": ["bg-component-active", "accent-surface-hover"],
      "selection-band": ["bg-component-hover", "accent-surface"],
      "selection-band-hover": ["bg-component-active", "accent-surface-hover"],
      "selection-edge": ["edge-control-hover", "edge-accent"],
    }),
    // Badge's public width hook. (badge-bg, badge-fg and badge-tracking-wide were pruned in
    // audit S21b: Badge paints from its tone slots and never read them.)
    [`${PREFIX}badge-max-width`]: `calc(var(${PREFIX}space-40) * 5)`,
    // Input aliases are public theming seams. They preserve the shared defaults while
    // allowing one product to tune editable fields without repointing every control.
    [`${PREFIX}input-bg`]: `var(${PREFIX}bg-surface)`,
    [`${PREFIX}input-bg-soft`]: `var(${PREFIX}bg-component)`,
    [`${PREFIX}input-bg-disabled`]: `var(${PREFIX}bg-component)`,
    [`${PREFIX}input-edge`]: `var(${PREFIX}edge-control)`,
    [`${PREFIX}input-edge-hover`]: `var(${PREFIX}edge-control-hover)`,
    [`${PREFIX}input-text`]: `var(${PREFIX}fg-default)`,
    [`${PREFIX}input-placeholder`]: `var(${PREFIX}fg-placeholder)`,
    [`${PREFIX}input-icon`]: `var(${PREFIX}fg-muted)`,
    // The invalid edge uses the most saturated readable danger endpoint. Its halo is the
    // same context colour at low alpha rather than an unrelated neutral shadow.
    [`${PREFIX}input-invalid-color`]: `var(${PREFIX}fg-danger-vivid)`,
    [`${PREFIX}input-invalid-halo-color`]:
      `color-mix(in srgb, var(${PREFIX}input-invalid-color) 14%, transparent)`,
    [`${PREFIX}input-success-color`]: `var(${PREFIX}fg-success-vivid)`,
    [`${PREFIX}input-success-halo-color`]:
      `color-mix(in srgb, var(${PREFIX}input-success-color) 14%, transparent)`,
    [`${PREFIX}input-warning-color`]: `var(${PREFIX}fg-warning-vivid)`,
    [`${PREFIX}input-warning-halo-color`]:
      `color-mix(in srgb, var(${PREFIX}input-warning-color) 14%, transparent)`,
    // Textarea aliases share Input's editable-control defaults but remain independent
    // theming seams for products whose multiline fields need a different surface or width.
    [`${PREFIX}textarea-bg`]: `var(${PREFIX}input-bg)`,
    [`${PREFIX}textarea-bg-soft`]: `var(${PREFIX}input-bg-soft)`,
    [`${PREFIX}textarea-bg-disabled`]: `var(${PREFIX}input-bg-disabled)`,
    [`${PREFIX}textarea-edge`]: `var(${PREFIX}input-edge)`,
    [`${PREFIX}textarea-edge-hover`]: `var(${PREFIX}input-edge-hover)`,
    [`${PREFIX}textarea-text`]: `var(${PREFIX}input-text)`,
    [`${PREFIX}textarea-placeholder`]: `var(${PREFIX}input-placeholder)`,
    [`${PREFIX}textarea-invalid-color`]: `var(${PREFIX}input-invalid-color)`,
    [`${PREFIX}textarea-invalid-halo-color`]: `var(${PREFIX}input-invalid-halo-color)`,
    [`${PREFIX}textarea-success-color`]: `var(${PREFIX}input-success-color)`,
    [`${PREFIX}textarea-success-halo-color`]: `var(${PREFIX}input-success-halo-color)`,
    [`${PREFIX}textarea-warning-color`]: `var(${PREFIX}input-warning-color)`,
    [`${PREFIX}textarea-warning-halo-color`]: `var(${PREFIX}input-warning-halo-color)`,
    [`${PREFIX}textarea-inline-size`]: `var(${PREFIX}input-inline-size)`,
    // Select is a native, single-value editable control. These aliases keep its visual
    // contract independently themeable while sharing the established Input endpoints.
    [`${PREFIX}select-bg`]: `var(${PREFIX}input-bg)`,
    [`${PREFIX}select-bg-disabled`]: `var(${PREFIX}input-bg-disabled)`,
    [`${PREFIX}select-edge`]: `var(${PREFIX}input-edge)`,
    [`${PREFIX}select-edge-hover`]: `var(${PREFIX}input-edge-hover)`,
    [`${PREFIX}select-text`]: `var(${PREFIX}input-text)`,
    [`${PREFIX}select-invalid-color`]: `var(${PREFIX}input-invalid-color)`,
    [`${PREFIX}select-invalid-halo-color`]: `var(${PREFIX}input-invalid-halo-color)`,
    [`${PREFIX}select-success-color`]: `var(${PREFIX}input-success-color)`,
    [`${PREFIX}select-success-halo-color`]: `var(${PREFIX}input-success-halo-color)`,
    [`${PREFIX}select-warning-color`]: `var(${PREFIX}input-warning-color)`,
    [`${PREFIX}select-warning-halo-color`]: `var(${PREFIX}input-warning-halo-color)`,
    [`${PREFIX}select-inline-size`]: `var(${PREFIX}input-inline-size)`,
    [`${PREFIX}field-error-color`]: `var(${PREFIX}fg-danger-vivid)`,
    // Syntax roles (audit G-5 B): code colours alias today's vivid rungs under their own names, so
    // a keyword stops borrowing danger and a string the accent, and syntax can be tuned alone.
    [`${PREFIX}syntax-keyword`]: `var(${PREFIX}fg-danger-vivid)`,
    [`${PREFIX}syntax-tag`]: `var(${PREFIX}fg-discovery-vivid)`,
    [`${PREFIX}syntax-attr`]: `var(${PREFIX}fg-info-vivid)`,
    [`${PREFIX}syntax-string`]: `var(${PREFIX}fg-accent-vivid)`,
    // Token is a static design-token reference, not a selectable tag or metadata badge.
    // These aliases let a documentation surface tune that reference without changing Code,
    // Badge, or Chip. The on-color values intentionally stay local: they must derive from
    // the surrounding foreground rather than from a global page colour.
    // The 25 rung, as inline Code: the code block's ground became the page (2026-09-28).
    [`${PREFIX}token-bg`]: `var(${PREFIX}bg-stripe)`,
    // Quieter than the default: no fill, the edge alone, in both themes (audit G-4 A; bg-subtle
    // was darker than the default in light and equal to it in dark).
    [`${PREFIX}token-bg-subtle`]: "transparent",
    // Dark `border-decorative` equals the stripe fill, so dark takes the faint edge (audit G-3).
    [`${PREFIX}token-edge`]: `light-dark(var(${PREFIX}border-decorative), var(${PREFIX}border-faint))`,
    [`${PREFIX}token-text`]: `var(${PREFIX}fg-default)`,
    // ColorSwatch's solid, very light edge (audit F-30 A; was 15% of the token ink).
    [`${PREFIX}token-swatch-ring`]: `var(${PREFIX}bg-component)`,
    // (radius-nested was pruned in audit S21b: concentric corners use radius-concentric, S3.)
    // Corners follow painted height (compact pass, owner 2026-10-01): the radius setting gives a
    // corner per pixel and the UI scale the heights. A live calc, so a `data-area-ui` or
    // `data-area-radius` subtree re-derives its own corners.
    ...radiusDerivations(),

    // Standard transition for interactive chrome. Only properties that actually change.
    [`${PREFIX}transition`]:
      `background-color var(${PREFIX}duration-fast) var(${PREFIX}ease-out), border-color var(${PREFIX}duration-fast) var(${PREFIX}ease-out), color var(${PREFIX}duration-fast) var(${PREFIX}ease-out), box-shadow var(${PREFIX}duration-fast) var(${PREFIX}ease-out)`,
  };
}

function radiusDerivations(): Record<string, string> {
  // One corner setting (axes/radius.ts). A shape on the height ladder takes the setting's corner
  // per pixel of height, rounded down to even pixels, never under radius-min (2, or 0 at Sharp):
  // 8 gives 20 -> 4, 24 -> 6, 28 -> 6, 32 -> 8, 40 -> 10, 48 -> 12, and Pill gives half of every
  // height. Live calc on the control heights, so a `data-area-ui` subtree re-derives its corners.
  // Components with their own height write the same expression on it (DESIGN_SYSTEM.md, Radius).
  const corner = (height: string) =>
    `max(var(${PREFIX}radius-min), round(down, calc(${height} * var(${PREFIX}radius-factor)), 2px))`;
  const out: Record<string, string> = {};
  for (const tier of ["xs", "sm", "md", "lg", "xl"]) out[`${PREFIX}radius-control-${tier}`] = corner(`var(${PREFIX}control-${tier})`);
  out[`${PREFIX}radius-control`] = `var(${PREFIX}radius-control-md)`;
  // Surfaces hold at both densities (radius audit D1) on their own 4px ladder.
  out[`${PREFIX}radius-container`] = `var(${PREFIX}radius-surface)`;
  // Small nested shapes (code, disclosure plates): the smallest control's corner, 6 (compact 4).
  out[`${PREFIX}radius-small`] = `var(${PREFIX}radius-control-xs)`;
  // A full-width row's plate: the row's own height, 8 (compact 6).
  out[`${PREFIX}radius-row`] = corner(`var(${PREFIX}ui-row)`);
  // The setting itself, the medium Button's corner at the default height (0 ... 14, Pill 16).
  out[`${PREFIX}radius-step`] = corner("32px");
  // The sharpest corner a nested shape takes (an item in a track, a row in a menu): 4, or the
  // setting where it is smaller (2), so only Sharp is square anywhere.
  out[`${PREFIX}radius-floor`] = `min(4px, var(${PREFIX}radius-step))`;
  // Rows in a floating list (Menu, Combobox, Command palette, Select's picker) and the list itself
  // (owner, 2026-10-04: "menu rows wait for pill"). A row is the surface less its 4px padding (8 at
  // both densities), floored, no rounder than the medium Button, and 2px short of a pill until
  // Pill (the min() term is 0 only when the factor is 0.5). The list stops at its rows plus the
  // padding, so it stays concentric: 12 at the default, 14 / 16 / 18 at 10 / 12 / 14, 20 at Pill.
  out[`${PREFIX}radius-list-row`] =
    `min(max(var(${PREFIX}radius-floor), calc(var(${PREFIX}radius-container) - 4px)), var(${PREFIX}radius-step), calc(var(${PREFIX}ui-row) / 2 - min(2px, (0.5 - var(${PREFIX}radius-factor)) * 1000px)))`;
  out[`${PREFIX}radius-list`] = `min(var(${PREFIX}radius-container), calc(var(${PREFIX}radius-list-row) + 4px))`;
  return out;
}

/**
 * The handful of properties worth registering with `@property`: the ones that are
 * interpolated, plus those where a missing unit should be a parse error rather than a
 * silently broken calc().
 *
 * Deliberately a short list, and it contains only *leaf* tokens. Derived tokens must never
 * be registered: a registered `<length>` computes at its declaration site, so
 * `--area-radius-control` would freeze at the value it had on `:root` and stop responding
 * to a nested `data-area-ui`. That silently breaks subtree scoping -- the height
 * changes, the corner radius does not -- and it is invisible in source. Verified in a real
 * browser by the axis fixture check.
 *
 * Registration is also document-global and unconditional, so a consumer registering the
 * same name with a different syntax silently wins; and a registered property falls back to
 * its initial value rather than to `unset`, turning an obviously-broken chain into a
 * plausible-looking wrong number. Both are reasons to register sparingly.
 */
export const REGISTERED_PROPERTIES = [
  // The leaves of the radius derivation; the public radius tokens are derived and unregistered.
  { name: `${PREFIX}radius-surface`, syntax: "<length>", initial: "12px" },
  { name: `${PREFIX}radius-min`, syntax: "<length>", initial: "2px" },
  { name: `${PREFIX}radius-factor`, syntax: "<number>", initial: "0.25" },
  { name: `${PREFIX}focus-width`, syntax: "<length>", initial: "2px" },
  { name: `${PREFIX}focus-offset`, syntax: "<length>", initial: "2px" },
  { name: `${PREFIX}border-width`, syntax: "<length>", initial: "1px" },
  { name: `${PREFIX}control-md`, syntax: "<length>", initial: "32px" },
  { name: `${PREFIX}duration-fast`, syntax: "<time>", initial: "100ms" },
  { name: `${PREFIX}duration-base`, syntax: "<time>", initial: "150ms" },
] as const;
