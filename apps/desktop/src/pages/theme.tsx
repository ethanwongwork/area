/**
 * Terms (owner, 2026-10-19: "language is the overall umbrella, and the axis are below it? what about below axis?"):
 * Theme (Language 2026-10-19 to 20) → Category (Color, Size, Shape, Stroke, Shadow, Effects) → Setting (an axis in code, `data-area-<id>`) →
 * Value (a preset in code). The page says Category, Setting and Value; the code keeps axis and preset.
 *
 * Theme: the system's settings, the registry's axes (@area/tokens axes/registry.ts) and its two scoped settings,
 * under the headings the Inspector shows them (Color, Size,
 * Shape, Stroke, Shadow, Effects; SETTING_GROUPS), each named as the registry names it (owner, 2026-10-19: "i want the
 * axises to be the source of truth and to show each of those visually"). One setting per Sidebar row. The Canvas
 * shows each axis as a row of its presets, every preset a tile scoped to it (data-area-<axis>)
 * holding the same abstract illustration (src/abstract.tsx), so a setting is seen by what it does.
 * The Inspector shows the preset chosen on the Canvas (its sample and attribute to copy), else the
 * Sidebar's setting (what it controls, its attribute, presets and default), else every setting.
 */
import { useEffect, useState, type ReactNode } from "react";
import { CopyIcon, MoonIcon, SunIcon } from "@area/icons";
import { CopyButton } from "../copy.tsx";
import { Code, Count, EmptyState, Nav, NavGroup, NavItem, PanelSection, Segmented, Table, TableLink } from "@area/react";
import { SidebarAll, SidebarList, useStudio, Workspace } from "../studio.tsx";
import { CanvasSection, Tile, TileGrid } from "../tile.tsx";
import { useViewOption, ViewControls, ViewFilter, ViewSwitch, type ViewMode } from "../view-controls.tsx";
import { Facts } from "../facts.tsx";
import { Preview, Selection } from "../inspector.tsx";
import { Abstract } from "../abstract.tsx";
import { CanvasSettings } from "../canvas-settings.tsx";
import { matches } from "../search.ts";
import { SETTING_GROUPS } from "@area/tokens/config";
import {
  attributeOf, defaultLabel, HELD, inMode, isDefault, MIN, pairOf, SETTINGS, scopeOf, themeOf, tileLabel, writes, type Mode, type Setting,
} from "./theme-settings.ts";
import { ThemeSetup } from "./theme-setup.tsx";

/**
 * Two ways through the settings, chosen first in the Canvas header (owner, 2026-10-20): Setup, one question per setting
 * with every option drawn (theme-setup.tsx), and Browse, every setting's values side by side. Setup is the default.
 * The previewed theme is shared, so Setup's Mode step is Browse's Light / Dark switch.
 */
type Flow = "setup" | "browse";
export function ThemePage() {
  const [flow, setFlow] = useViewOption<Flow>("theme-flow", "setup", ["setup", "browse"]);
  const [mode, setMode] = useViewOption<Mode>("theme-mode", "light", ["light", "dark"]);
  const flowSwitch = (
    <Segmented size="sm" aria-label="Theme view" value={flow} onValueChange={next => setFlow(next as Flow)}
      items={[{ value: "setup", label: "Setup" }, { value: "browse", label: "Browse" }]} />
  );
  return flow === "setup"
    ? <ThemeSetup mode={mode} setMode={setMode} flowSwitch={flowSwitch} />
    : <ThemeBrowse mode={mode} setMode={setMode} flowSwitch={flowSwitch} />;
}

function ThemeBrowse({ mode, setMode, flowSwitch }: { mode: Mode; setMode: (mode: Mode) => void; flowSwitch: ReactNode }) {
  const { query, item, select } = useStudio();
  const shown = SETTINGS.filter(setting => inMode(setting.id, mode) && matches(query, setting.label, setting.id, setting.description));
  // The Sidebar's choice (All, or one setting) and the Inspector's: one preset of one setting
  // ("<axis>:<preset>"), chosen on the Canvas, until the Sidebar's choice changes. A setting of the other theme
  // (an old link to Dark ground while previewing Light) shows its pair.
  const view = SETTINGS.find(entry => entry.id === (item ? pairOf(item, mode) : item));
  const [selected, setSelected] = useState<string>();
  useEffect(() => setSelected(undefined), [item]);
  const [selectedAxis, selectedPreset] = selected?.split(":") ?? [];
  const axis = SETTINGS.find(entry => entry.id === selectedAxis) ?? view;
  const preset = axis?.presets.find(entry => entry.id === selectedPreset);
  const onCanvas = view ? [view] : shown;
  const [layout, setLayout] = useViewOption<ViewMode>("theme", "grid", ["grid", "list"]);
  const [presets, setPresets] = useViewOption<"all" | "default">("theme-presets", "all", ["all", "default"]);
  const presetsOf = (entry: Setting) => presets === "default" ? entry.presets.filter(preset => isDefault(entry, preset.id)) : entry.presets;
  /** One preset's tile: the drawing alone takes the preset; the card stays the same plate for every setting (owner,
      2026-10-19: "the containers should [not] change with each axis it shows either"; Medium and More contrast drew
      darker card edges, and Mode's dark card was black). */
  const tile = (entry: Setting, preset: { id: string; label: string }, label: string, value?: string) => (
    // The detail joins the name in brackets ("Light (Default)", "0 (None, Default)"): an Asset card's head holds the
    // name and controls only (owner, round 58), so a tile's value would not show.
    <Tile key={`${entry.id}-${preset.id}`} span="wide" stage="center" inert label={tileLabel(label, value)}
      selected={selected === `${entry.id}:${preset.id}`} onSelect={() => setSelected(`${entry.id}:${preset.id}`)}
      scope={{}} stageScope={{ "data-area-theme": themeOf(entry.id, mode), ...scopeOf(entry, preset.id) }}>
      <Abstract axis={entry.id} preset={preset.id} />
    </Tile>
  );
  return (
    <Workspace
      sidebar={<SidebarList>{
        <Nav aria-label="Settings">
          <SidebarAll tab="theme" count={shown.length} current={!view} />
          {SETTING_GROUPS.map(group => {
            const rows = shown.filter(entry => entry.heading === group.heading);
            return rows.length ? (
              <NavGroup key={group.heading} label={group.heading}>
                {rows.map(entry => (
                  <NavItem key={entry.id} href={`#theme/${entry.id}`} current={entry.id === view?.id}
                    onClick={event => { event.preventDefault(); select(entry.id); }}
                    trailing={<Count count={entry.presets.length} />}>
                    {entry.label}
                  </NavItem>
                ))}
              </NavGroup>
            ) : null;
          })}
        </Nav>
      }</SidebarList>}
      canvasTitle={view ? view.title : "All settings"}
      // The page's own cards and words stay at the app's defaults; each drawing takes its preset in the previewed theme.
      canvasPicks={false}
      canvasActions={
        <ViewControls>
          {flowSwitch}
          <ViewFilter label="Values" value={presets} onChange={setPresets} options={[{ value: "all", label: "All values" }, { value: "default", label: "Defaults only" }]} />
          <Segmented size="sm" aria-label="Preview theme" value={mode} onValueChange={next => setMode(next as Mode)}
            items={[{ value: "light", label: "Light", icon: <SunIcon /> }, { value: "dark", label: "Dark", icon: <MoonIcon /> }]} />
          <ViewSwitch value={layout} onChange={setLayout} />
        </ViewControls>
      }
      canvas={!onCanvas.length ? (
        // No matches: the Sidebar keeps All, and the Canvas says so (product UI rule 10).
        <EmptyState title="No settings" description={`Nothing matches “${query}”.`} />
      ) : layout === "list" ? (
        // List: one row per preset, its attribute and whether it is the default.
          <Table size="md" interactive aria-label="Settings">
            <thead><tr><th scope="col">Setting</th><th scope="col">Value</th><th scope="col">Attribute</th><th scope="col">Default</th></tr></thead>
            <tbody>
              {onCanvas.flatMap(entry => presetsOf(entry).map(preset => (
                <tr key={`${entry.id}-${preset.id}`} data-selected={selected === `${entry.id}:${preset.id}` ? "" : undefined}>
                  <td><TableLink href={`#theme/${entry.id}`} onClick={event => { event.preventDefault(); setSelected(`${entry.id}:${preset.id}`); }}>{entry.title}</TableLink></td>
                  <td>{preset.label}</td>
                  <td><Code>{attributeOf(entry, preset.id)}</Code></td>
                  <td>{isDefault(entry, preset.id) ? "Default" : <span className="studio-muted">—</span>}</td>
                </tr>
              )))}
            </tbody>
          </Table>
      ) : presets === "default" && !view ? (
        // Defaults only: the system as it ships, one tile per setting in one grid.
        <TileGrid span="wide" cards min={MIN}>
          {onCanvas.map(entry => {
            const preset = entry.presets.find(item => isDefault(entry, item.id)) ?? entry.presets[0]!;
            return tile(entry, preset, entry.title, defaultLabel(entry));
          })}
        </TileGrid>
      ) : (
        <div className="studio-sections">
          {onCanvas.map(entry => (
            <CanvasSection key={entry.id} id={`axis-${entry.id}`} title={entry.title} count={presetsOf(entry).length} lede={entry.description}>
              {/* Every preset a wide tile of one size, holding the same sample, so only the setting
                  differs (Polaris, Geist). The tile is the setting's scope, painting its own ground;
                  the sample is inert, since tabbing through dozens of them would not help. */}
              <TileGrid span="wide" cards min={MIN}>
                {/* The Theme tab alone marks the default (owner, 2026-10-20: the Inspector's options carry no "(Default)"). */}
                {presetsOf(entry).map(preset => tile(entry, preset, preset.label,
                  isDefault(entry, preset.id) ? "Default" : undefined))}
              </TileGrid>
            </CanvasSection>
          ))}
        </div>
      )}
      inspector={{
        // Theme: the settings that size the tiles; Design: the chosen setting or preset (the Inspector's views).
        theme: <CanvasSettings axes={["type", "density", "radius"]} />,
        design: <>
        {axis && preset ? (
          <Selection preview={<Preview shape="landscape" label={`${axis.title}: ${preset.label}`} scope={{ "data-area-theme": mode, ...scopeOf(axis, preset.id) }}><Abstract axis={axis.id} preset={preset.id} whole /></Preview>}>
            <CopyButton label="Copy attribute" icon={<CopyIcon />} fullWidth value={() => attributeOf(axis, preset.id)} />
          </Selection>
        ) : null}
        {axis ? (
          <PanelSection heading={preset ? "Value" : "Setting"}>
            <Facts label={preset ? "Value" : "Setting"} items={preset ? [
              ["Attribute", <Code>{attributeOf(axis, preset.id)}</Code>],
              ["Setting", `${axis.heading} · ${axis.label}`],
              ["Default", isDefault(axis, preset.id) ? "Yes" : `No, ${defaultLabel(axis)}`],
              ["Controls", axis.description],
              writes(axis, preset.id).length ? ["Writes", <Writes tokens={writes(axis, preset.id)} />] : null,
              HELD[axis.id] ? ["Preview", HELD[axis.id]] : null,
            ] : [
              ["Attribute", <Code>{attributeOf(axis)}</Code>],
              ["Category", axis.heading],
              ["Values", axis.presets.map(entry => entry.label).join(", ")],
              ["Default", defaultLabel(axis)],
              ["Controls", axis.description],
              writes(axis).length ? ["Writes", <Writes tokens={writes(axis)} names />] : null,
              HELD[axis.id] ? ["Preview", HELD[axis.id]] : null,
            ]} />
          </PanelSection>
        ) : (
          <PanelSection heading="Settings">
            <Facts label="Settings" items={[
              ["Attribute", <Code>data-area-&lt;setting&gt;</Code>],
              ["Settings", SETTINGS.length],
              ["Values", SETTINGS.reduce((sum, entry) => sum + entry.presets.length, 0)],
              ["Scope", "Any element; what it holds takes the nearest setting."],
            ]} />
          </PanelSection>
        )}
        </>,
      }}
    />
  );
}

/** The custom properties a preset writes: the first few with their values (or names alone), then how many more. */
function Writes({ tokens, names }: { tokens: Array<[string, string]>; names?: boolean }) {
  const SHOWN = 4;
  return (
    <span className="studio-writes">
      {tokens.slice(0, SHOWN).map(([name, value]) => <Code key={name}>{names ? name : `${name}: ${value}`}</Code>)}
      {tokens.length > SHOWN ? <span className="studio-muted">and {tokens.length - SHOWN} more</span> : null}
    </span>
  );
}
