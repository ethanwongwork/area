import type { VariantProps } from "../variants.ts";
import { MANIFESTS } from "../variants.ts";
import { forwardRef } from "react";
import type { HTMLAttributes } from "react";
import { cx } from "../variants.ts";
/* --- Kbd ------------------------------------------------------------------ */

/** Symbols for the modifier keys, so callers write names rather than glyphs. */
const KEY_GLYPHS: Record<string, string> = {
  cmd: "⌘",
  meta: "⌘",
  shift: "⇧",
  alt: "⌥",
  option: "⌥",
  ctrl: "⌃",
  control: "⌃",
  enter: "⏎",
  return: "⏎",
  backspace: "⌫",
  delete: "⌦",
  // Written out, as ChatGPT and Notion do (audit S12b).
  escape: "Esc",
  esc: "Esc",
  tab: "⇥",
  space: "␣",
  up: "↑",
  down: "↓",
  left: "←",
  right: "→",
};

/** Spoken names, since a screen reader reads "⌘" as nothing useful. */
const KEY_LABELS: Record<string, string> = {
  "⌘": "Command",
  "⇧": "Shift",
  "⌥": "Option",
  "⌃": "Control",
  "⏎": "Enter",
  "⌫": "Backspace",
  "⌦": "Delete",
  "⎋": "Escape",
  Esc: "Escape",
  "⇥": "Tab",
  "␣": "Space",
  "↑": "Up arrow",
  "↓": "Down arrow",
  "←": "Left arrow",
  "→": "Right arrow",
};

export interface KbdProps extends HTMLAttributes<HTMLElement> {
  /** Key names, in order. Modifiers, arrows and common special keys become native legends. */
  keys: string[];
  /**
   * `md` (18px at the default type) suits standalone hints; `sm` (14px) fits compact control chrome. `"small"` and `"normal"` are
   * deprecated aliases.
   */
  size?: VariantProps<typeof MANIFESTS.kbd>["size"] | "small" | "normal";
  /**
   * `"default"`, the keycap everywhere, or `"on-color"` on a colored background. `"quiet"` is deprecated and renders
   * the keycap; `"on-emphasis"` is a deprecated alias of `"on-color"`. A Tooltip, a Button and a destructive menu row
   * adapt the keycap on their own.
   */
  variant?: VariantProps<typeof MANIFESTS.kbd>["variant"] | "on-emphasis";
  /** @deprecated Use `variant`. */
  appearance?: VariantProps<typeof MANIFESTS.kbd>["variant"] | "on-emphasis";
}

/**
 * Marks a keyboard shortcut.
 *
 * Renders one flat chord with one semantic element per key. The chord provides its own
 * spoken label because bare modifier glyphs are not announced usefully.
 */
export const Kbd = /* @__PURE__ */ forwardRef<HTMLElement, KbdProps>(function Kbd(
  { keys, size = "md", variant, appearance, className, ...rest },
  ref,
) {
  const tier = size === "small" ? "sm" : size === "normal" ? "md" : size;
  const rendered = keys.map((key) => KEY_GLYPHS[key.toLowerCase()] ?? key.toUpperCase());
  const spoken = rendered.map((glyph) => KEY_LABELS[glyph] ?? glyph).join(" plus ");
  const chosen = variant ?? appearance ?? "default";
  const resolvedAppearance = chosen === "on-emphasis" ? "on-color" : chosen === "quiet" ? "default" : chosen;

  return (
    <span
      ref={ref}
      className={cx("area-kbd", `area-kbd--${tier}`, `area-kbd--${resolvedAppearance}`, className)}
      {...rest}
    >
      {/* A span has no role, so an aria-label on it is not reliably announced; the spoken chord
          is visually hidden text instead, and the glyphs are hidden from assistive technology. */}
      <span className="area-sr-only">{spoken}</span>
      {rendered.map((glyph, i) => (
        <kbd key={i} className="area-kbd__key" aria-hidden="true">
          {glyph}
        </kbd>
      ))}
    </span>
  );
});

export interface KbdGroupProps extends HTMLAttributes<HTMLSpanElement> {}

/** Groups separate chord hints that are pressed in sequence. */
export const KbdGroup = /* @__PURE__ */ forwardRef<HTMLSpanElement, KbdGroupProps>(function KbdGroup(
  { className, ...rest },
  ref,
) {
  return <span ref={ref} className={cx("area-kbd-group", className)} {...rest} />;
});

