/**
 * The Canvas's view controls (owner, 2026-10-11: "different viewing modes for each tab, like
 * grid vs list views or even filters"): filters, then a grid / list switch, at the end of the
 * Canvas's header as Notion and Figma put a view's options. Each tab keeps its own choices.
 */
import { useState, type ReactNode } from "react";
import { Button, Menu, MenuItem, Segmented } from "@area/react";
import { ChevronDownIcon, GridIcon, LayoutDashboardIcon, ListIcon } from "@area/icons";
import { readStored, writeStored } from "./storage.ts";
import { appScale } from "./app-scale.ts";

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

/**
 * The grid / list switch. With `waterfall` (Brand's assets, owner 2026-10-19) a third segment between them lays the
 * cards out as a waterfall, each hugging its asset.
 */
export function ViewSwitch<M extends string = ViewMode>({ value, onChange, waterfall }: { value: M; onChange: (mode: M) => void; waterfall?: boolean }) {
  return (
    <Segmented size="sm" iconOnly aria-label="View" value={value} onValueChange={next => onChange(next as M)}
      items={[
        { value: "grid", label: "Grid", icon: <GridIcon /> },
        ...(waterfall ? [{ value: "waterfall", label: "Waterfall", icon: <LayoutDashboardIcon /> }] : []),
        { value: "list", label: "List", icon: <ListIcon /> },
      ]} />
  );
}

/**
 * One filter: a ghost menu button that reads its choice ("All statuses", "In review") and opens its options (owner,
 * 2026-10-25: "make them more consistent, clean them up"). It was a soft Select, the header's one filled box beside ghost
 * controls, and a long choice ran under its chevron. Now every control in the header is ghost: the filters' text
 * buttons, the icon menus, the zoom stepper; the grid / list switch alone has a track.
 */
export function ViewFilter<T extends string>({ label, value, onChange, options }: { label: string; value: T; onChange: (value: T) => void; options: ReadonlyArray<{ value: T; label: string }> }) {
  const current = options.find(option => option.value === value)?.label ?? "";
  return (
    <Menu aria-label={label} align="end" tooltip={label}
      trigger={<Button variant="ghost" tone="neutral" size="sm" trailingIcon={<ChevronDownIcon />} aria-label={`${label}: ${current}`}>{current}</Button>}>
      {options.map(option => (
        <MenuItem key={option.value} radio checked={option.value === value} onClick={() => onChange(option.value)}>{option.label}</MenuItem>
      ))}
    </Menu>
  );
}

/** The header's end: filters, then the view switch. */
export function ViewControls({ children }: { children: ReactNode }) {
  return <div role="group" aria-label="View" className="studio-canvas__actions" {...appScale()}>{children}</div>;
}
