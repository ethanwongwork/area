import { createContext, useContext, type ReactNode } from "react";
import type { MANIFESTS } from "../variants.ts";

/**
 * A design system's own defaults (docs/research/system-inventory-2026-11-08): per family, by its manifest name ("tabs",
 * "inputGroup"), the value each axis takes when a use gives none. A system whose fields are soft, or whose tabs mark the
 * selected tab with a plate, says so once here instead of on every use, as a theme's default props do. A use's own prop
 * always wins. A value the family doesn't have is ignored, so a stale system never breaks a component.
 *
 *   <SystemDefaults value={{ input: { variant: "soft" }, tabs: { selection: "plate" } }}>…</SystemDefaults>
 *
 * Read by the families with a structure choice (Tabs, Input, Select, Textarea, Input group, Number field, Field) and by
 * Button, Button group, Toggle group, Segmented, Badge, Count, Tag, Avatar, Switch, Checkbox, Radio, Card, Surface,
 * Alert, Accordion item, Custom select and Link. Where a family inherits from a parent (an Accordion's items, a
 * toolbar's Segmented and Toggle group), the order is the use's own prop, then the parent's, then the system's.
 */
export type SystemDefaultsValue = Readonly<Record<string, Readonly<Record<string, string>>>>;

const SystemDefaultsContext = /* @__PURE__ */ createContext<SystemDefaultsValue>({});

export interface SystemDefaultsProps {
  value: SystemDefaultsValue;
  children?: ReactNode;
}

export function SystemDefaults({ value, children }: SystemDefaultsProps) {
  return <SystemDefaultsContext.Provider value={value}>{children}</SystemDefaultsContext.Provider>;
}

/**
 * The prop a component uses: its own, else the system's default for that family and axis when the family has the value
 * (`values`: the family's own values for the axis, from its manifest, as `buttonVariants.manifest.variants.size`, or a
 * prop's own values where they are not the manifest's, as Tabs' selection "marker" | "plate"), else undefined, so the
 * component's own default applies. Each family passes its own values so that importing one component never pulls in
 * every family's manifest (tests/consumer/imports.mjs, "unused components are removed").
 */
export function useSystemDefault<T extends string>(family: keyof typeof MANIFESTS, axis: string, own: T | undefined, values: readonly string[]): T | undefined {
  const value = useContext(SystemDefaultsContext)[family]?.[axis];
  if (own !== undefined || value === undefined) return own;
  return values.includes(value) ? value as T : undefined;
}
