/**
 * The Canvas bar's view controls (owner, 2026-10-11: "different viewing modes for each tab, like
 * grid vs list views or even filters"): a grid / list switch and filters, at the end of the bar as
 * Notion and Figma put a view's options. Each tab keeps its own choices.
 */
import { useState, type ReactNode } from "react";
import { Segmented, Select } from "@area/react";
import { PilotGridIcon, PilotListIcon } from "../../docs/src/pilot-icons.tsx";
import { readStored, writeStored } from "./storage.ts";

export type ViewMode = "grid" | "list";

/** A tab's saved choice: its view mode or a filter's value. */
export function useViewOption<T extends string>(key: string, initial: T, allowed: readonly T[]) {
  const [value, setValue] = useState<T>(() => {
    const saved = readStored<string>(`view:${key}`, initial);
    return (allowed as readonly string[]).includes(saved) ? (saved as T) : initial;
  });
  const change = (next: T) => { setValue(next); writeStored(`view:${key}`, next); };
  return [value, change] as const;
}

export function ViewSwitch({ value, onChange }: { value: ViewMode; onChange: (mode: ViewMode) => void }) {
  return (
    <Segmented size="sm" iconOnly aria-label="View" value={value} onValueChange={next => onChange(next as ViewMode)}
      items={[{ value: "grid", label: "Grid", icon: <PilotGridIcon /> }, { value: "list", label: "List", icon: <PilotListIcon /> }]} />
  );
}

/** One filter: a small Select whose options name what they show ("All statuses", "In review"). */
export function ViewFilter<T extends string>({ label, value, onChange, options }: { label: string; value: T; onChange: (value: T) => void; options: ReadonlyArray<{ value: T; label: string }> }) {
  return (
    <Select size="sm" aria-label={label} title={label} value={value} onChange={event => onChange(event.currentTarget.value as T)}>
      {options.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
    </Select>
  );
}

/** The bar's end: filters, then the view switch. */
export function ViewControls({ children }: { children: ReactNode }) {
  return <div className="studio-canvas__actions" data-area-ui="compact">{children}</div>;
}
