/**
 * Language: the system-wide settings Area is built from, the Inspector's own list (src/gallery/controls.ts: mode,
 * neutral, accent, ground, layers, action, selection, contrast, type, density, radius, surface, elevation, motion,
 * pills), one per Sidebar row. The Canvas
 * shows each axis as a row of its presets, every preset a tile scoped to it (data-area-<axis>)
 * holding the same abstract illustration (src/abstract.tsx), so a setting is seen by what it does.
 * The Inspector shows the preset chosen on the Canvas (its sample and attribute to copy), else the
 * Sidebar's setting (what it controls, its attribute, presets and default), else every setting.
 */
import { useEffect, useState } from "react";
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
import { AXES } from "../tokens.ts";
import { GALLERY_CONTROLS } from "../gallery/controls.ts";

/* Attributes each preset tile carries beyond its own axis, so the setting has something to show:
   an accent only reaches a component through action and selection set to accent. */
const ALSO: Record<string, Record<string, string>> = {
  accent: { "data-area-action": "accent", "data-area-selection": "accent" },
};

/*
 * Light and dark (owner, 2026-10-19: "dark mode should be automatic? or handled separately but more cohesively ... show
 * that we also have dark mode but keep everything here just for light mode"): the page previews one theme, Light by
 * default, with Dark one switch away in the Canvas bar; every setting's tiles follow it, the accents included. The
 * settings that exist once per theme (the ground and the layers) show the previewed theme's own, so Light shows Light
 * ground and Light layers, Dark their dark pair. The Theme setting's tiles always show both.
 */
type Mode = "light" | "dark";
/** A preset's least card width (owner, 2026-10-19: "the minimum size of the containers can be smaller"; was 280). */
const MIN = 200; /* pick */
const PER_THEME = /-(light|dark)$/;
const inMode = (id: string, mode: Mode) => !PER_THEME.test(id) || id.endsWith(`-${mode}`);
/** The same setting in the other theme ("ground-dark" for "ground-light"). */
const pairOf = (id: string, mode: Mode) => PER_THEME.test(id) ? id.replace(PER_THEME, `-${mode}`) : id;

/*
 * The settings: the Inspector's own list (src/gallery/controls.ts), its labels, options, order and defaults, so Language
 * always shows what the Inspector sets (owner, 2026-10-19: "make sure everything in language reflects the updated axises
 * and controls"); the registry's sentence where an axis has one. Contrast and Pills are scoped settings outside the
 * registry; Pills is a set, one tile per shape, the shapes on by default marked so.
 */
interface Setting { id: string; label: string; description: string; presets: Array<{ id: string; label: string }>; defaults: string[] }
const DESCRIBED: Record<string, string> = {
  theme: "Light or dark.",
  contrast: "How strong edges, focus and state are: System follows the OS; Medium and More strengthen them, More to 3:1.",
  pills: "Which components draw a pill instead of the Radius corner.",
};
const SETTINGS: Setting[] = GALLERY_CONTROLS.map(control => ({
  id: control.axis,
  // The page previews one theme, so its ground and layers are just Ground and Layers (owner, 2026-10-19: "just say
  // layers and ground not light"); the Inspector, which sets both themes, keeps Light and Dark.
  label: control.label.replace(/^(Light|Dark) (\w)/, (_, __, first: string) => first.toUpperCase()),
  description: DESCRIBED[control.axis] ?? AXES.find(axis => axis.id === control.axis)?.description ?? control.hint ?? "",
  presets: control.items.map(item => ({ id: item.value, label: item.label })),
  defaults: control.kind === "chips" ? control.defaultValue.split(" ") : [control.defaultValue],
}));
const isDefault = (setting: Setting, preset: string) => setting.defaults.includes(preset);
/** The default preset's name, without the "(Default)" its label carries in a list. */
const defaultLabel = (setting: Setting) => setting.id === "pills"
  ? setting.presets.filter(entry => isDefault(setting, entry.id)).map(entry => entry.label).join(", ")
  : setting.presets.find(entry => isDefault(setting, entry.id))?.label.replace(" (Default)", "") ?? "—";
/** What a preset's tile is scoped to: its attribute (System contrast writes none), and what the setting needs to show. */
const scopeOf = (setting: Setting, preset: string): Record<string, string> =>
  setting.id === "contrast" && preset === "system" ? {} : { [`data-area-${setting.id}`]: preset, ...ALSO[setting.id] };
const attributeOf = (setting: Setting, preset?: string) => setting.id === "contrast" && preset === "system"
  ? "no attribute (the OS decides)" : `data-area-${setting.id}${preset ? `="${preset}"` : ""}`;

export function LanguagePage() {
  const { query, item, select } = useStudio();
  const [mode, setMode] = useViewOption<Mode>("language-theme", "light", ["light", "dark"]);
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
  const [layout, setLayout] = useViewOption<ViewMode>("language", "grid", ["grid", "list"]);
  const [presets, setPresets] = useViewOption<"all" | "default">("language-presets", "all", ["all", "default"]);
  const presetsOf = (entry: Setting) => presets === "default" ? entry.presets.filter(preset => isDefault(entry, preset.id)) : entry.presets;
  /** One preset's tile: the drawing alone takes the preset; the card stays the same plate for every setting (owner,
      2026-10-19: "the containers should [not] change with each axis it shows either"; Medium and More contrast drew
      darker card edges, and Mode's dark card was black). */
  const tile = (entry: Setting, preset: { id: string; label: string }, label: string, value?: string) => (
    <Tile key={`${entry.id}-${preset.id}`} span="wide" stage="center" inert label={label} value={value}
      selected={selected === `${entry.id}:${preset.id}`} onSelect={() => setSelected(`${entry.id}:${preset.id}`)}
      scope={{}} stageScope={scopeOf(entry, preset.id)}>
      <Abstract axis={entry.id} preset={preset.id} />
    </Tile>
  );
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
      canvasScope={{ "data-area-theme": mode }}
      canvasActions={
        <ViewControls>
          <ViewFilter label="Presets" value={presets} onChange={setPresets} options={[{ value: "all", label: "All presets" }, { value: "default", label: "Defaults only" }]} />
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
          <Table size="md" interactive flush aria-label="Settings">
            <thead><tr><th scope="col">Setting</th><th scope="col">Preset</th><th scope="col">Attribute</th><th scope="col">Default</th></tr></thead>
            <tbody>
              {onCanvas.flatMap(entry => presetsOf(entry).map(preset => (
                <tr key={`${entry.id}-${preset.id}`} data-selected={selected === `${entry.id}:${preset.id}` ? "" : undefined}>
                  <td><TableLink href={`#language/${entry.id}`} onClick={event => { event.preventDefault(); setSelected(`${entry.id}:${preset.id}`); }}>{entry.label}</TableLink></td>
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
            return tile(entry, preset, entry.label, defaultLabel(entry));
          })}
        </TileGrid>
      ) : (
        <div className="studio-sections">
          {onCanvas.map(entry => (
            <CanvasSection key={entry.id} id={`axis-${entry.id}`} title={entry.label} lede={entry.description}>
              {/* Every preset a wide tile of one size, holding the same sample, so only the setting
                  differs (Polaris, Geist). The tile is the setting's scope, painting its own ground;
                  the sample is inert, since tabbing through dozens of them would not help. */}
              <TileGrid span="wide" cards min={MIN}>
                {/* A number setting's label already says "(Default)" (owner, 2026-10-14); others get it here. */}
                {presetsOf(entry).map(preset => tile(entry, preset, preset.label,
                  isDefault(entry, preset.id) && !preset.label.includes("Default") ? "Default" : undefined))}
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
          <Selection preview={<Preview shape="landscape" label={`${axis.label}: ${preset.label}`} scope={{ "data-area-theme": mode, ...scopeOf(axis, preset.id) }}><Abstract axis={axis.id} preset={preset.id} /></Preview>}>
            <CopyButton label="Copy attribute" icon={<CopyIcon />} fullWidth value={() => attributeOf(axis, preset.id)} />
          </Selection>
        ) : null}
        {axis ? (
          <PanelSection heading={preset ? "Preset" : "Setting"}>
            <Facts label={preset ? "Preset" : "Setting"} items={preset ? [
              ["Attribute", <Code>{attributeOf(axis, preset.id)}</Code>],
              ["Setting", axis.label],
              ["Default", isDefault(axis, preset.id) ? "Yes" : `No, ${defaultLabel(axis)}`],
              ["Controls", axis.description],
            ] : [
              ["Attribute", <Code>{attributeOf(axis)}</Code>],
              ["Presets", axis.presets.map(entry => entry.label).join(", ")],
              ["Default", defaultLabel(axis)],
              ["Controls", axis.description],
            ]} />
          </PanelSection>
        ) : (
          <PanelSection heading="Settings">
            <Facts label="Settings" items={[
              ["Attribute", <Code>data-area-&lt;setting&gt;</Code>],
              ["Settings", SETTINGS.length],
              ["Presets", SETTINGS.reduce((sum, entry) => sum + entry.presets.length, 0)],
              ["Scope", "Any element; what it holds takes the nearest setting."],
            ]} />
          </PanelSection>
        )}
        </>,
      }}
    />
  );
}
