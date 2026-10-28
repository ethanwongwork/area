/**
 * The Inspector's Canvas settings: the system-wide settings the Canvas previews, from the gallery's
 * own control list (src/gallery/controls.ts), grouped by what they shape under their own headings
 * (owner, 2026-10-14: "separated by larger titles"): Color (neutral, accent, the Layers' light and dark ground
 * and layer contrast, action, selection, contrast), Size (type size, density), Shape (the radius, and which components draw a pill
 * instead), Stroke (width, strength), Shadow (floating, resting, fields, size, softness, light, colour) and Effects
 * (motion). A tab shows only the settings that change its
 * specimens, and its own display settings follow in a Display section (Typography's sample text).
 * They write data-area-* on the Canvas only, so the app's own chrome stays compact. Where every setting shows (Components,
 * Examples), Material follows: a bundle, then each lever, its switches shown while it is on (src/material.ts).
 */
import { createContext, useContext, useState, type ReactNode } from "react";
import { CustomSelect, Field, PanelSection, Segmented } from "@area/react";
import { GridIcon, ListIcon } from "@area/icons";
import { MATERIAL_BUNDLES, MATERIAL_LEVERS, MATERIAL_STROKE_STYLES, MATERIAL_SWITCHES, SETTING_GROUPS } from "@area/tokens/config";
import { DEPTH_LEVER_AXES, GALLERY_CONTROLS } from "./gallery/controls.ts";
import { materialValue, type MaterialState } from "./material.ts";
import { choiceFigure, FIGURED } from "./choice-figures.tsx";
import { materialMark } from "./option-marks.tsx";
import { BrandSettings } from "./brand-settings.tsx";
import { brandStyle } from "./brand.ts";
import { ROW_OF, SettingRow, type RowContext } from "./inspector-rows.tsx";
import { readStored, writeStored } from "./storage.ts";
import { inMode } from "./pages/theme-settings.ts";
import { useStudio, type CanvasAxes } from "./studio.tsx";

type Axis = keyof CanvasAxes;
// Headings and their settings are the registry's (@area/tokens axes/registry.ts SETTING_GROUPS; owner, 2026-10-19: "i
// want the axises to be the source of truth"), shared with the Theme tab. Headings never repeat a row's label: a
// setting under its heading drops the heading's word (src/gallery/controls.ts). Edge and Depth's controls (axes/depth.ts)
// sit under Stroke (Width, Strength, Rest shadow) and Shadow (Floating, Resting, Field, Size, Softness, Light, Colour).
const GROUPS = SETTING_GROUPS;

/**
 * How the setting lists open (owner, 2026-10-23; docs/research/theme-visuals-2026-10-23): as a grid of figures by
 * default, or as rows. One preference for every list, remembered, switched in the first section's heading, so the
 * Inspector never changes shape from list to list. The switch lives in the panel, not in the open list: a select-only
 * combobox keeps focus on its trigger, so a button inside the list could not be reached from the keyboard.
 */
type View = "grid" | "list";
const ViewContext = createContext<View>("grid");
/** Colours open as a grid of swatches at any length; other settings as figures when they have one and fit four rows. */
const SWATCHES = new Set<string>(["accent", "tint-hue", "tint-hue-dark"]);
const GRID_MOST = 12;
const layoutOf = (view: View, axis: string, count: number) =>
  view === "grid" && (SWATCHES.has(axis) || (FIGURED.has(axis) && count <= GRID_MOST)) ? "grid" as const : "list" as const;
function ViewSwitch({ view, onChange }: { view: View; onChange: (view: View) => void }) {
  return <Segmented size="sm" iconOnly aria-label="Show setting lists as" value={view} onValueChange={next => onChange(next as View)}
    items={[{ value: "grid", label: "Grid", icon: <GridIcon /> }, { value: "list", label: "List", icon: <ListIcon /> }]} />;
}

export function CanvasSettings({ material, axes = ["neutral", "tint-hue", "tint-hue-dark", "tint-light", "tint-dark", "ink-tint", "accent", "accent-strength", "solid-light", "solid-dark", "label-tint", "status-colours", "ground-light", "ground-dark", "layers-light", "layers-dark", "card-tone-light", "card-tone-dark", "action", "selection", "contrast", "type", "density", "radius", "surface", "shadow-rest", "elevation", ...DEPTH_LEVER_AXES, "motion", "easing", "feedback", "pills"], children }: { axes?: readonly Axis[]; material?: boolean; children?: ReactNode }) {
  // Material shows with every setting: a tab that narrows its settings shows no surfaces a material paints.
  const showMaterial = material ?? axes.length === GALLERY_CONTROLS.length - 1;
  // Ground, Layers, Tint strength and Card tone exist once per theme; the Inspector sets the mode the app is in (owner, 2026-10-22: "separate the
  // dark mode choice from the light mode, i shouldnt be choosing both at the same time"), the Titlebar's switch choosing
  // which, so light's pair shows in Light and dark's in Dark.
  const { theme } = useStudio();
  const inTheme = (axis: Axis) => inMode(axis, theme);
  const [view, setViewState] = useState<View>(() => readStored<View>("inspector-list-view", "grid"));
  const setView = (next: View) => { setViewState(next); writeStored("inspector-list-view", next); };
  // Brand sits before Accent wherever the accent shows (brand-settings.tsx): the palette or your own colours, then the
  // accent's Shade and Saturation, which apply to either.
  const showBrand = axes.includes("accent");
  const first = GROUPS.find(group => (group.settings as readonly Axis[]).some(axis => axes.includes(axis) && inTheme(axis)))?.heading;
  return (
    <ViewContext.Provider value={view}>
      {GROUPS.map(group => {
        const shown = (group.settings as readonly Axis[]).filter(axis => axes.includes(axis) && inTheme(axis));
        return shown.length ? [
          showBrand && group.heading === "Accent" ? <BrandSettings key="brand" /> : null,
          <PanelSection key={group.heading} heading={group.heading} actions={group.heading === first ? <ViewSwitch view={view} onChange={setView} /> : undefined}>
            {(drawn => shown.map(axis => <Setting key={axis} axis={axis} drawn={drawn} />))(new Set<string>())}
          </PanelSection>,
        ] : null;
      })}
      {showMaterial ? <MaterialSettings /> : null}
      {children ? <PanelSection heading="Display">{children}</PanelSection> : null}
    </ViewContext.Provider>
  );
}

/**
 * One setting's row (src/inspector-rows.tsx): its control chosen for what it sets, the Canvas following as it moves, and a
 * list's option previewing while the pointer or the arrows are on it (owner, 2026-10-18). A combined row (Greys) draws once,
 * at the first setting it stands for.
 */
function Setting({ axis, drawn }: { axis: Axis; drawn: Set<string> }) {
  const { canvas, material, setCanvas, previewCanvas, theme, brand } = useStudio();
  const view = useContext(ViewContext);
  const row = ROW_OF[axis];
  if (row) { if (drawn.has(row)) return null; drawn.add(row); }
  const context: RowContext = {
    values: canvas, mode: theme, brand: brandStyle(brand),
    set: changes => { for (const [name, value] of Object.entries(changes)) setCanvas(name as Axis, value); },
    preview: (name, value) => previewCanvas(name as Axis, value),
    layout: (name, count) => layoutOf(view, name, count),
    figure: (name, value) => choiceFigure(name as Axis, value, canvas, material),
  };
  return <SettingRow axis={axis} context={context} />;
}

/**
 * Material (@area/tokens axes/material.ts): load a bundle, then move any lever from it. Each lever is a number, 0 (Off)
 * to 8, as Elevation; the bundle's own value carries its name ("3 (Glass)"); None, the default, carries no mark (owner, 2026-10-20). A lever's
 * switches show while it is on, so None is one row and a bundle shows only what it uses.
 */
function MaterialSettings() {
  const { canvas, material, setMaterialBundle, setMaterialValue, previewCanvas, previewMaterial } = useStudio();
  const view = useContext(ViewContext);
  const bundleLayout = layoutOf(view, "material", Object.keys(MATERIAL_BUNDLES).length);
  // A highlighted bundle previews with the Layers it is drawn for (Soft's gray, flat page), as choosing it applies them.
  const previewBundle = (next: string | null) => {
    for (const axis of ["ground-light", "ground-dark", "layers-light", "layers-dark"] as const) {
      previewCanvas(axis, next === null ? null : MATERIAL_BUNDLES[next]?.layers[axis] ?? null);
    }
    previewMaterial(next === null ? null : { bundle: next, overrides: {} });
  };
  const previewValue = (key: string) => (next: string | null) =>
    previewMaterial(next === null ? null : { ...material, overrides: { ...material.overrides, [key]: next } } satisfies MaterialState);
  const bundle = MATERIAL_BUNDLES[material.bundle]!;
  const named = (key: string, value: string, label: string) =>
    material.bundle !== "none" && String(bundle.levers[key] ?? 0) === value && value !== "0" ? `${label} (${bundle.label})` : label;
  return (
    <PanelSection heading="Material">
      <Field label="Material" orientation="horizontal">
        <CustomSelect size="sm" variant="soft" fullWidth layout={bundleLayout} aria-label="Material" value={material.bundle}
          items={Object.entries(MATERIAL_BUNDLES).map(([id, entry]) => ({ value: id, label: entry.label, icon: materialMark("bundle", id),
            preview: bundleLayout === "grid" ? choiceFigure("material", id, canvas, material) : undefined }))}
          onValueChange={setMaterialBundle} onHighlightChange={previewBundle} />
      </Field>
      {MATERIAL_LEVERS.map(lever => {
        const value = materialValue(material, lever.id);
        const on = value !== "0";
        return [
          <Field key={lever.id} label={lever.label} orientation="horizontal">
            <CustomSelect size="sm" variant="soft" fullWidth aria-label={lever.label} title={lever.hint} value={value}
              items={lever.steps.map(step => {
                const text = lever.id === "angle" ? `${step}°${step === 0 ? " (Top)" : ""}` : step === 0 ? "0 (Off)" : String(step);
                return { value: String(step), label: named(lever.id, String(step), text), icon: materialMark(lever.id, String(step)) };
              })}
              onValueChange={next => setMaterialValue(lever.id, next)} onHighlightChange={previewValue(lever.id)} />
          </Field>,
          ...(on && lever.id !== "angle" ? MATERIAL_SWITCHES.filter(toggle => toggle.lever === lever.id).map(toggle => (
            <Field key={toggle.id} label={toggle.label} orientation="horizontal">
              {toggle.options.length === 2 ? (
                <Segmented size="sm" fullWidth items={toggle.options.map(o => ({ value: o.value, label: o.label }))}
                  value={materialValue(material, toggle.id)} onValueChange={next => setMaterialValue(toggle.id, next)} />
              ) : (
                <CustomSelect size="sm" variant="soft" fullWidth aria-label={toggle.label} value={materialValue(material, toggle.id)}
                  items={toggle.options.map(o => ({ value: o.value, label: o.label }))}
                  onValueChange={next => setMaterialValue(toggle.id, next)} onHighlightChange={previewValue(toggle.id)} />
              )}
            </Field>
          )) : []),
          ...(on && lever.id === "stroke" ? [
            <Field key="stroke-style" label="Stroke style" orientation="horizontal">
              <CustomSelect multiple size="sm" variant="soft" fullWidth aria-label="Stroke style" placeholder="None"
                items={MATERIAL_STROKE_STYLES.map(style => ({ value: style.id, label: style.label }))}
                values={materialValue(material, "stroke-style").split(" ").filter(Boolean)}
                onHighlightChange={part => {
                  if (part === null) return previewMaterial(null);
                  const on = materialValue(material, "stroke-style").split(" ").filter(Boolean);
                  const toggled = on.includes(part) ? on.filter(id => id !== part) : [...on, part];
                  previewValue("stroke-style")(MATERIAL_STROKE_STYLES.map(style => style.id).filter(id => toggled.includes(id)).join(" "));
                }}
                onValuesChange={next => setMaterialValue("stroke-style", MATERIAL_STROKE_STYLES.map(style => style.id).filter(id => next.includes(id)).join(" "))} />
            </Field>,
          ] : []),
        ];
      })}
    </PanelSection>
  );
}
