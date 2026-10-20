/**
 * Terms (owner, 2026-10-19: "language is the overall umbrella, and the axis are below it? what about below axis?"):
 * Language → Category (Color, Size, Shape, Stroke, Shadow, Effects) → Setting (an axis in code, `data-area-<id>`) →
 * Value (a preset in code). The page says Category, Setting and Value; the code keeps axis and preset.
 *
 * Language: the system's settings, the registry's axes (@area/tokens axes/registry.ts) and its two scoped settings,
 * under the headings the Inspector shows them (Color, Size,
 * Shape, Stroke, Shadow, Effects; SETTING_GROUPS), each named as the registry names it (owner, 2026-10-19: "i want the
 * axises to be the source of truth and to show each of those visually"). One setting per Sidebar row. The Canvas
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
import { SETTING_GROUPS, SETTINGS as REGISTRY } from "@area/tokens/config";

/*
 * Attributes each preset tile carries beyond its own axis, so the setting shows and nothing else does (owner,
 * 2026-10-19: "fix the visuals for stroke and shadow to be more custom tailored to each axis/variable that is changed
 * and make sure its visible"): an accent only reaches a component through action and selection set to accent; a stroke
 * or shadow setting turns off the other strokes and shadows on its surface, and the shared shadow settings (size,
 * softness, light, colour) draw on the Floating shadow at its strongest, 8, where their change is large enough to see.
 */
const NO_SHADOW = { "data-area-shadow-rest": "0", "data-area-shadow-resting": "0", "data-area-shadow-field": "0" };
const SHARED_SHADOW = { "data-area-elevation": "8" };
const ALSO: Record<string, Record<string, string>> = {
  accent: { "data-area-action": "accent", "data-area-selection": "accent" },
  neutral: { "data-area-layers-light": "8", "data-area-layers-dark": "8" },
  surface: NO_SHADOW,
  stroke: NO_SHADOW,
  // A preset's own attribute is written last (scopeOf), so it wins over NO_SHADOW's 0.
  "shadow-rest": { ...NO_SHADOW, "data-area-surface": "0" },
  "shadow-resting": { ...NO_SHADOW, "data-area-surface": "0" },
  "shadow-field": { "data-area-shadow-rest": "0", "data-area-shadow-resting": "0" },
  "shadow-size": SHARED_SHADOW,
  "shadow-softness": SHARED_SHADOW,
  "shadow-light": SHARED_SHADOW,
  "shadow-color": SHARED_SHADOW,
  easing: { "data-area-motion": "300" },
};
/** What a preview is set to besides its own setting, said in the Inspector so a tile is never mistaken for the default. */
const HELD: Record<string, string> = {
  easing: "Motion at 300, so the curve has time to show.",
  neutral: "Layers at 8, so the greys are large enough for the tint to show.",
  surface: "Shadows off, so only the line shows.",
  stroke: "Shadows off, so only the strokes show.",
  "shadow-rest": "Stroke width 0 and the other shadows off, so only this shadow shows.",
  "shadow-resting": "Stroke width 0 and the other shadows off, so only this shadow shows.",
  "shadow-field": "The surface's own shadows off, so only the field's shows.",
  "shadow-size": "Drawn on the Floating shadow at 8, where the change is large enough to see.",
  "shadow-softness": "Drawn on the Floating shadow at 8, where the change is large enough to see.",
  "shadow-light": "Drawn on the Floating shadow at 8, where the change is large enough to see.",
  "shadow-color": "Drawn on the Floating shadow at 8, where the change is large enough to see.",
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
// Ground and Layers exist once per theme; Shadow light's "-light" is not a theme (it hid in Dark until 2026-10-19).
const PER_THEME = /^(ground|layers)-(light|dark)$/;
const inMode = (id: string, mode: Mode) => !PER_THEME.test(id) || id.endsWith(`-${mode}`);
/** The same setting in the other theme ("ground-dark" for "ground-light"). */
const pairOf = (id: string, mode: Mode) => PER_THEME.test(id) ? id.replace(/-(light|dark)$/, `-${mode}`) : id;

/*
 * The settings: the Inspector's own list (src/gallery/controls.ts), its labels, options, order and defaults, so Language
 * always shows what the Inspector sets (owner, 2026-10-19: "make sure everything in language reflects the updated axises
 * and controls"); the registry's sentence where an axis has one. Contrast and Pills are scoped settings outside the
 * registry; Pills is a set, one tile per shape, the shapes on by default marked so.
 */
interface Setting {
  id: string;
  /** The heading it sits under, as in the Inspector. */
  heading: string;
  /** Its name under the heading (the Sidebar's row, the Inspector's), and its whole name (the Canvas section's title). */
  label: string;
  title: string;
  description: string;
  presets: Array<{ id: string; label: string }>;
  defaults: string[];
}
// The page previews one theme, so its ground and layers are just Ground and Layers (owner, 2026-10-19: "just say
// layers and ground not light"); the Inspector, which sets both themes, keeps Light and Dark.
const oneTheme = (label: string) => label.replace(/^(Light|Dark) (\w)/, (_, __, first: string) => first.toUpperCase());
const SETTINGS: Setting[] = SETTING_GROUPS.flatMap(group => group.settings.map(id => {
  const control = GALLERY_CONTROLS.find(entry => entry.axis === id)!;
  return {
    id,
    heading: group.heading,
    label: oneTheme(control.label),
    title: oneTheme(REGISTRY[id]?.label ?? control.label),
    description: REGISTRY[id]?.description ?? control.hint ?? "",
    presets: control.items.map(item => ({ id: item.value, label: item.label })),
    defaults: control.kind === "chips" ? control.defaultValue.split(" ") : [control.defaultValue],
  };
}));
/** The custom properties a preset writes (the registry's tokens); Contrast and Pills are scoped settings with none. */
const writes = (setting: Setting, preset?: string) => {
  const axis = AXES.find(entry => entry.id === setting.id);
  const tokens = axis?.presets.find(entry => entry.id === (preset ?? axis.defaultPreset))?.tokens ?? {};
  return Object.entries(tokens);
};
const isDefault = (setting: Setting, preset: string) => setting.defaults.includes(preset);
/** The default preset's name, without the "(Default)" its label carries in a list. */
const defaultLabel = (setting: Setting) => setting.id === "pills"
  ? setting.presets.filter(entry => isDefault(setting, entry.id)).map(entry => entry.label).join(", ")
  : setting.presets.find(entry => isDefault(setting, entry.id))?.label.replace(" (Default)", "") ?? "—";
/** What a preset's tile is scoped to: its attribute (System contrast writes none), and what the setting needs to show. */
const scopeOf = (setting: Setting, preset: string): Record<string, string> =>
  setting.id === "contrast" && preset === "system" ? {} : { ...ALSO[setting.id], [`data-area-${setting.id}`]: preset };
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
          {SETTING_GROUPS.map(group => {
            const rows = shown.filter(entry => entry.heading === group.heading);
            return rows.length ? (
              <NavGroup key={group.heading} label={group.heading}>
                {rows.map(entry => (
                  <NavItem key={entry.id} href={`#language/${entry.id}`} current={entry.id === view?.id}
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
      canvasScope={{ "data-area-theme": mode }}
      canvasActions={
        <ViewControls>
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
          <Table size="md" interactive flush aria-label="Settings">
            <thead><tr><th scope="col">Setting</th><th scope="col">Value</th><th scope="col">Attribute</th><th scope="col">Default</th></tr></thead>
            <tbody>
              {onCanvas.flatMap(entry => presetsOf(entry).map(preset => (
                <tr key={`${entry.id}-${preset.id}`} data-selected={selected === `${entry.id}:${preset.id}` ? "" : undefined}>
                  <td><TableLink href={`#language/${entry.id}`} onClick={event => { event.preventDefault(); setSelected(`${entry.id}:${preset.id}`); }}>{entry.title}</TableLink></td>
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
            <CanvasSection key={entry.id} id={`axis-${entry.id}`} title={entry.title} lede={entry.description}>
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
