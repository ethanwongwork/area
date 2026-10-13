/**
 * Sorting, grouping and pinning: how a tab's things are ordered and gathered on the Sidebar and
 * the Canvas. One "Sort and group" menu in the Canvas bar (Notion's view options, Figma's asset
 * panel sort), radio rows under a label for each choice, so the whole arrangement is set in one
 * place and read back at a glance. Each tab keeps its own arrangement across launches.
 *
 * Pinned things (Notion's favourites, Cursor's pinned chats) gather in a Pinned group at the top
 * of the Sidebar; a row's context menu and the Inspector pin and unpin.
 */
import { useState, type MouseEvent, type ReactNode } from "react";
import { Button, ContextMenu, Menu, MenuItem, MenuLabel, MenuSeparator } from "@area/react";
import { PushpinFilledIcon, PushpinIcon, SortIcon } from "@area/icons";
import { readStored, writeStored } from "./storage.ts";
import { ChromeButton } from "./studio.tsx";

export interface Choice<T extends string> { value: T; label: string }

/** A tab's arrangement: what it is sorted by, in which direction, and how it is grouped. */
export interface Arrangement<S extends string, G extends string> {
  sort: S;
  descending: boolean;
  group: G;
}

/** The saved arrangement, each part checked against the tab's own choices. */
export function useArrangement<S extends string, G extends string>(
  key: string,
  initial: Arrangement<S, G>,
  sorts: ReadonlyArray<Choice<S>>,
  groups: ReadonlyArray<Choice<G>>,
) {
  const [value, setValue] = useState<Arrangement<S, G>>(() => {
    const saved = readStored<Partial<Arrangement<S, G>>>(`arrange:${key}`, {});
    return {
      sort: sorts.some(choice => choice.value === saved.sort) ? saved.sort! : initial.sort,
      descending: typeof saved.descending === "boolean" ? saved.descending : initial.descending,
      group: groups.some(choice => choice.value === saved.group) ? saved.group! : initial.group,
    };
  });
  const change = (next: Partial<Arrangement<S, G>>) => setValue(current => {
    const merged = { ...current, ...next };
    writeStored(`arrange:${key}`, merged);
    return merged;
  });
  const isDefault = value.sort === initial.sort && value.descending === initial.descending && value.group === initial.group;
  return { ...value, change, reset: () => change(initial), isDefault };
}

/** Sorts a copy by a key, keeping the given order for ties (Array.prototype.sort is stable). */
export function sortBy<T>(list: readonly T[], key: (item: T) => string | number, descending = false) {
  const sign = descending ? -1 : 1;
  return [...list].sort((a, b) => {
    const x = key(a), y = key(b);
    return sign * (typeof x === "number" && typeof y === "number" ? x - y : String(x).localeCompare(String(y)));
  });
}

/** Splits a sorted list into labelled runs in the order the labels first appear (or `order`). */
export function groupBy<T>(list: readonly T[], label: (item: T) => string, order?: readonly string[]) {
  const runs = new Map<string, T[]>();
  for (const name of order ?? []) runs.set(name, []);
  for (const item of list) {
    const name = label(item);
    if (!runs.has(name)) runs.set(name, []);
    runs.get(name)!.push(item);
  }
  return [...runs].filter(([, items]) => items.length);
}

/**
 * The Canvas bar's "Sort and group" menu: a ghost icon Button (the bar's quiet controls) opening
 * an Area Menu. Its radio rows keep it open (`keepOpen`), as Notion's view options do, so the
 * Canvas rearranges behind it and several choices take one visit; Reset appears once the arrangement
 * differs from the tab's default, and the button's Area Tooltip names the current order.
 */
export function ArrangeMenu<S extends string, G extends string>({ arrangement, sorts, groups, directions = ["Ascending", "Descending"] }: {
  arrangement: ReturnType<typeof useArrangement<S, G>>;
  sorts: ReadonlyArray<Choice<S>>;
  groups?: ReadonlyArray<Choice<G>>;
  /** The direction rows' labels, in the sort's own words ("A to Z", "Smallest first"). */
  directions?: readonly [string, string];
}) {
  const sortLabel = sorts.find(choice => choice.value === arrangement.sort)?.label ?? "";
  const summary = `${sortLabel}, ${directions[arrangement.descending ? 1 : 0]}`;
  return (
    <Menu aria-label="Sort and group" align="end" tooltip={<>Sort and group · {summary}</>}
      trigger={<Button variant="ghost" tone="neutral" size="sm" iconOnly className="studio-bar-icon" icon={<SortIcon />} aria-label="Sort and group" />}>
      <MenuLabel>Sort by</MenuLabel>
      {sorts.map(choice => (
        <MenuItem key={choice.value} keepOpen radio checked={arrangement.sort === choice.value} onClick={() => arrangement.change({ sort: choice.value })}>{choice.label}</MenuItem>
      ))}
      <MenuSeparator />
      <MenuLabel>Order</MenuLabel>
      {directions.map((label, index) => (
        <MenuItem key={label} keepOpen radio checked={arrangement.descending === (index === 1)} onClick={() => arrangement.change({ descending: index === 1 })}>{label}</MenuItem>
      ))}
      {groups?.length ? <>
        <MenuSeparator />
        <MenuLabel>Group by</MenuLabel>
        {groups.map(choice => (
          <MenuItem key={choice.value} keepOpen radio checked={arrangement.group === choice.value} onClick={() => arrangement.change({ group: choice.value })}>{choice.label}</MenuItem>
        ))}
      </> : null}
      {arrangement.isDefault ? null : <>
        <MenuSeparator />
        <MenuItem onClick={arrangement.reset}>Reset to default</MenuItem>
      </>}
    </Menu>
  );
}

/** A tab's pinned keys, in the order they were pinned, kept across launches. */
export function usePins(key: string) {
  const [pins, setPins] = useState<string[]>(() => {
    const saved = readStored<unknown>(`pins:${key}`, []);
    return Array.isArray(saved) ? saved.filter((entry): entry is string => typeof entry === "string") : [];
  });
  const toggle = (name: string) => setPins(current => {
    const next = current.includes(name) ? current.filter(entry => entry !== name) : [...current, name];
    writeStored(`pins:${key}`, next);
    return next;
  });
  return { pins, has: (name: string) => pins.includes(name), toggle };
}

/**
 * The Inspector's pin, at the end of a section heading (PanelSection's actions): a ghost icon
 * Button drawn filled while pinned, as the Titlebar's panel toggles draw a shown panel.
 */
export function PinButton({ pinned, onToggle, name }: { pinned: boolean; onToggle: () => void; name: string }) {
  return <ChromeButton label={`Pin ${name}`} pressed={pinned} icon={pinned ? <PushpinFilledIcon /> : <PushpinIcon />} onClick={onToggle} />;
}

/**
 * A context menu to pin or unpin: right-click (or Shift+F10 on) a Sidebar row or a Canvas item.
 * Pinnable things name themselves with `data-key` and `data-name`; anywhere else the browser's
 * own menu stays closed and nothing opens.
 */
export function PinMenu({ pins, children, label = "Sidebar" }: { pins: ReturnType<typeof usePins>; children: ReactNode; label?: string }) {
  const [target, setTarget] = useState<{ key: string; name: string } | null>(null);
  const onContextMenu = (event: MouseEvent<HTMLDivElement>) => {
    const row = (event.target as HTMLElement).closest<HTMLElement>("[data-key]");
    if (!row) { event.preventDefault(); setTarget(null); return; }
    setTarget({ key: row.dataset.key!, name: row.dataset.name ?? row.dataset.key! });
  };
  return (
    <ContextMenu menuLabel={`${label} actions`} onContextMenu={onContextMenu} 
      menu={target ? (
        <MenuItem icon={<PushpinIcon />} onClick={() => pins.toggle(target.key)}>
          {pins.has(target.key) ? `Unpin ${target.name}` : `Pin ${target.name}`}
        </MenuItem>
      ) : null}>
      {children}
    </ContextMenu>
  );
}
