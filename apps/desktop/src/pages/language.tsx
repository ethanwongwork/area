/**
 * Language: the system-wide settings Area is built from (the axes in @area/tokens: theme, neutral,
 * accent, action, selection, UI scale, radius, surface, motion), one per Sidebar row. The Canvas
 * shows each axis as a row of its presets, every preset a tile scoped to it (data-area-<axis>)
 * holding the same abstract illustration (src/abstract.tsx), so a setting is seen by what it does.
 * The Inspector names the selected axis: what it controls, its attribute, presets and default.
 */
import { useState } from "react";
import { Code, Count, EmptyState, Nav, NavGroup, NavItem, PanelSection, Table, TableLink } from "@area/react";
import { SidebarAll, SidebarList, useStudio, Workspace } from "../studio.tsx";
import { CanvasSection, Tile, TileGrid } from "../tile.tsx";
import { useViewOption, ViewControls, ViewFilter, ViewSwitch, type ViewMode } from "../view-controls.tsx";
import { Facts } from "../facts.tsx";
import { Abstract } from "../abstract.tsx";
import { CanvasSettings } from "../canvas-settings.tsx";
import { matches } from "../search.ts";
import { AXES } from "../tokens.ts";

/* Attributes each preset tile carries beyond its own axis, so the setting has something to show:
   an accent only reaches a component through action and selection set to accent. */
const ALSO: Record<string, Record<string, string>> = {
  accent: { "data-area-action": "accent", "data-area-selection": "accent" },
};

export function LanguagePage() {
  const { query, item, select } = useStudio();
  const shown = AXES.filter(axis => matches(query, axis.label, axis.id, axis.description));
  // The Sidebar's choice (All, or one setting) and the Inspector's (the setting clicked on the
  // Canvas; with one setting on the Canvas, that setting).
  const view = AXES.find(entry => entry.id === item);
  // The selection is one preset of one setting ("<axis>:<preset>"); the Inspector names both.
  const [selected, setSelected] = useState(`${AXES[0]!.id}:${AXES[0]!.defaultPreset}`);
  const [selectedAxis, selectedPreset] = selected.split(":");
  const axis = view ?? AXES.find(entry => entry.id === selectedAxis) ?? AXES[0]!;
  const preset = axis.presets.find(entry => entry.id === (axis.id === selectedAxis ? selectedPreset : axis.defaultPreset));
  const onCanvas = view ? [view] : shown;
  const [mode, setMode] = useViewOption<ViewMode>("language", "grid", ["grid", "list"]);
  const [presets, setPresets] = useViewOption<"all" | "default">("language-presets", "all", ["all", "default"]);
  const presetsOf = (entry: (typeof AXES)[number]) => presets === "default" ? entry.presets.filter(preset => preset.id === entry.defaultPreset) : entry.presets;
  return (
    <Workspace
      sidebar={<SidebarList>{
        <Nav aria-label="Settings">
          <SidebarAll tab="language" count={shown.length} current={!view} />
          <NavGroup label="Settings">
            {shown.map(entry => (
              <NavItem key={entry.id} href={`#language/${entry.id}`} current={entry.id === view?.id}
                onClick={event => { event.preventDefault(); select(entry.id); }}
                trailing={<Count count={entry.presets.length} />}>
                {entry.label}
              </NavItem>
            ))}
          </NavGroup>
        </Nav>
      }</SidebarList>}
      canvasTitle={view ? view.label : "All settings"}
      canvasMeta={<span className="studio-muted studio-tabular">{view ? view.presets.length : shown.length}</span>}
      canvasActions={
        <ViewControls>
          <ViewFilter label="Presets" value={presets} onChange={setPresets} options={[{ value: "all", label: "All presets" }, { value: "default", label: "Defaults only" }]} />
          <ViewSwitch value={mode} onChange={setMode} />
        </ViewControls>
      }
      canvas={!onCanvas.length ? (
        // No matches: the Sidebar keeps All, and the Canvas says so (product UI rule 10).
        <EmptyState title="No settings" description={`Nothing matches “${query}”.`} />
      ) : mode === "list" ? (
        // List: one row per preset, its attribute and whether it is the default.
          <Table size="md" interactive flush aria-label="Settings">
            <thead><tr><th scope="col">Setting</th><th scope="col">Preset</th><th scope="col">Attribute</th><th scope="col">Default</th></tr></thead>
            <tbody>
              {onCanvas.flatMap(entry => presetsOf(entry).map(preset => (
                <tr key={`${entry.id}-${preset.id}`} data-selected={selected === `${entry.id}:${preset.id}` ? "" : undefined}>
                  <td><TableLink href={`#language/${entry.id}`} onClick={event => { event.preventDefault(); setSelected(`${entry.id}:${preset.id}`); }}>{entry.label}</TableLink></td>
                  <td>{preset.label}</td>
                  <td><Code>data-area-{entry.id}="{preset.id}"</Code></td>
                  <td>{preset.id === entry.defaultPreset ? "Default" : <span className="studio-muted">—</span>}</td>
                </tr>
              )))}
            </tbody>
          </Table>
      ) : presets === "default" && !view ? (
        // Defaults only: the system as it ships, one tile per setting in one grid.
        <TileGrid span="wide">
          {onCanvas.map(entry => {
            const preset = entry.presets.find(item => item.id === entry.defaultPreset) ?? entry.presets[0]!;
            return (
              <Tile key={entry.id} span="wide" stage="center" inert label={entry.label} value={preset.label}
                selected={selected === `${entry.id}:${preset.id}`} onSelect={() => setSelected(`${entry.id}:${preset.id}`)}
                scope={{ [`data-area-${entry.id}`]: preset.id, ...ALSO[entry.id] }}>
                <Abstract axis={entry.id} />
              </Tile>
            );
          })}
        </TileGrid>
      ) : (
        <div className="studio-sections">
          {onCanvas.map(entry => (
            <CanvasSection key={entry.id} id={`axis-${entry.id}`} title={entry.label} lede={entry.description}>
              {/* Every preset a wide tile of one size, holding the same sample, so only the setting
                  differs (Polaris, Geist). The tile is the setting's scope, painting its own ground;
                  the sample is inert, since tabbing through dozens of them would not help. */}
              <TileGrid span="wide">
                {presetsOf(entry).map(preset => (
                  <Tile key={preset.id} span="wide" stage="center" inert label={preset.label}
                    value={preset.id === entry.defaultPreset ? "Default" : undefined}
                    selected={selected === `${entry.id}:${preset.id}`} onSelect={() => setSelected(`${entry.id}:${preset.id}`)}
                    scope={{ [`data-area-${entry.id}`]: preset.id, ...ALSO[entry.id] }}>
                    <Abstract axis={entry.id} />
                  </Tile>
                ))}
              </TileGrid>
            </CanvasSection>
          ))}
        </div>
      )}
      inspectorTitle={axis.label}
      inspector={
        <>
        <CanvasSettings axes={["ui", "radius"]} />
        <PanelSection heading="Setting">
          <Facts label="Setting" items={[
            ["Controls", axis.description],
            ["Attribute", <Code>data-area-{axis.id}</Code>],
            ["Presets", axis.presets.map(preset => preset.label).join(", ")],
            ["Default", axis.presets.find(preset => preset.id === axis.defaultPreset)?.label ?? "—"],
            preset ? ["Selected", preset.label] : null,
          ]} />
        </PanelSection>
        </>
      }
    />
  );
}
