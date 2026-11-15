/** Filter bar gallery specimens: one variant per tile. docs/specs/filter-bar.md. */
import { useState } from "react";
import { Checkbox, FilterBar, FilterBarAdd, FilterBarItem, Menu, MenuItem, Popover } from "@area/react";

/* A view's width: the bar sits under the view's tabs, over its rows. It holds it (a tile scales it whole): with a 100%
   cap it gave way to its content and the default tile scrolled inside itself (system evaluation F3.2). */
const view = { inlineSize: "calc(var(--area-space-96) * 6)" };
const add = <Menu trigger={<FilterBarAdd />}><MenuItem>Option one</MenuItem><MenuItem>Option two</MenuItem><MenuItem>Option three</MenuItem></Menu>;
const editor = <div style={{ display: "grid", gap: "var(--area-space-8)" }}><Checkbox label="Option one" defaultChecked /><Checkbox label="Option two" /></div>;

export const GalleryFilterBar = () => (
  <FilterBar style={view} add={add}>
    <Popover side="bottom" align="start" trigger={<FilterBarItem label="Label" value="Value" />}>{editor}</Popover>
    <Popover side="bottom" align="start" trigger={<FilterBarItem label="Label" value="Option one, Option two" />}>{editor}</Popover>
  </FilterBar>
);
/* Changed since the view was saved: the changed filter's dot, and Reset at the bar's end. */
export const GalleryFilterBarDirty = () => (
  <FilterBar style={view} add={add} dirty onReset={() => {}}>
    <Popover side="bottom" align="start" trigger={<FilterBarItem label="Label" value="Value" dirty />}>{editor}</Popover>
    <Popover side="bottom" align="start" trigger={<FilterBarItem label="Label" value="Value" />}>{editor}</Popover>
  </FilterBar>
);
/* A filter just added, waiting for its value: the plain chip, its name alone. */
export const GalleryFilterBarEmpty = () => (
  <FilterBar style={view} add={add}>
    <Popover side="bottom" align="start" trigger={<FilterBarItem label="Label" />}>{editor}</Popover>
  </FilterBar>
);
/* Behavior: choosing in a filter's editor changes its value and marks it unsaved; Reset puts the saved view back. */
export const GalleryFilterBarEdit = () => {
  const saved = ["Option one"];
  const [chosen, setChosen] = useState<string[]>(saved);
  const dirty = chosen.join() !== saved.join();
  const options = ["Option one", "Option two", "Option three"];
  const toggle = (option: string) => setChosen(now => options.filter(entry => entry === option ? !now.includes(entry) : now.includes(entry)));
  const value = chosen.length > 2 ? `${chosen.length} selected` : chosen.join(", ");
  return (
    <FilterBar style={view} add={add} dirty={dirty} onReset={() => setChosen(saved)}>
      <Popover side="bottom" align="start" trigger={<FilterBarItem label="Label" value={value || undefined} dirty={dirty} />}>
        <div style={{ display: "grid", gap: "var(--area-space-8)" }}>
          {options.map(option => <Checkbox key={option} label={option} checked={chosen.includes(option)} onChange={() => toggle(option)} />)}
        </div>
      </Popover>
    </FilterBar>
  );
};
