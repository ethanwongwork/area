/**
 * The Inspector's Canvas settings: the system-wide settings the Canvas previews, from the gallery's
 * own control list (src/gallery/controls.ts), grouped by what they shape under their own headings
 * (owner, 2026-10-14: "separated by larger titles"): Color (neutral, accent, the Layers' light and dark ground
 * and layer contrast, action, selection, contrast), Size (type size, density), Shape (the radius, and which components draw a pill
 * instead) and Effects (surface, elevation, motion). A tab shows only the settings that change its
 * specimens, and its own display settings follow in a Display section (Typography's sample text).
 * They write data-area-* on the Canvas only, so the app's own chrome stays compact. Where every setting shows (Components,
 * Examples), Material follows: a bundle, then each lever, its switches shown while it is on (src/material.ts).
 */
import type { ReactNode } from "react";
import { CustomSelect, Field, PanelSection, Segmented, Select } from "@area/react";
import { MATERIAL_BUNDLES, MATERIAL_LEVERS, MATERIAL_STROKE_STYLES, MATERIAL_SWITCHES } from "@area/tokens/config";
import { GALLERY_CONTROLS } from "./gallery/controls.ts";
import { materialValue } from "./material.ts";
import { useStudio, type CanvasAxes } from "./studio.tsx";

type Axis = keyof CanvasAxes;
// Headings never repeat a row's label (a Radius heading over a Radius row read twice).
const GROUPS: ReadonlyArray<{ heading: string; axes: readonly Axis[] }> = [
  { heading: "Color", axes: ["neutral", "accent", "ground-light", "ground-dark", "layers-light", "layers-dark", "action", "selection", "contrast"] },
  { heading: "Size", axes: ["type", "density"] },
  { heading: "Shape", axes: ["radius", "pills"] },
  { heading: "Effects", axes: ["surface", "elevation", "motion"] },
];

export function CanvasSettings({ material, axes = ["neutral", "accent", "ground-light", "ground-dark", "layers-light", "layers-dark", "action", "selection", "contrast", "type", "density", "radius", "surface", "elevation", "motion", "pills"], children }: { axes?: readonly Axis[]; material?: boolean; children?: ReactNode }) {
  // Material shows with every setting: a tab that narrows its settings shows no surfaces a material paints.
  const showMaterial = material ?? axes.length === GALLERY_CONTROLS.length - 1;
  return (
    <>
      {GROUPS.map(group => {
        const shown = group.axes.filter(axis => axes.includes(axis));
        return shown.length ? (
          <PanelSection key={group.heading} heading={group.heading}>
            {shown.map(axis => <Setting key={axis} axis={axis} />)}
          </PanelSection>
        ) : null;
      })}
      {showMaterial ? <MaterialSettings /> : null}
      {children ? <PanelSection heading="Display">{children}</PanelSection> : null}
    </>
  );
}

/** One setting, its label beside its control (owner, 2026-10-11); fields are soft, as Figma's. */
function Setting({ axis }: { axis: Axis }) {
  const { canvas, setCanvas } = useStudio();
  const control = GALLERY_CONTROLS.find(entry => entry.axis === axis)!;
  const value = canvas[axis];
  return (
    <Field label={control.label} orientation="horizontal">
      {control.kind === "chips" ? (
        // A set (several on at once) is a multi-select dropdown (owner, 2026-10-14; was a group of
        // toggle Chips): its rows toggle and the list stays open.
        <CustomSelect multiple size="sm" variant="soft" fullWidth aria-label={control.label} placeholder="None"
          items={control.items.map(item => ({ value: item.value, label: item.label }))}
          values={value.split(" ").filter(Boolean)} onValuesChange={next => setCanvas(axis, next.join(" "))} />
      ) : control.kind === "select" ? (
        <Select size="sm" variant="soft" fullWidth value={value} onChange={event => setCanvas(axis, event.currentTarget.value)}>
          {control.items.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}
        </Select>
      ) : (
        <Segmented size="sm" fullWidth items={[...control.items]} value={value} onValueChange={next => setCanvas(axis, next)} />
      )}
    </Field>
  );
}

/**
 * Material (@area/tokens axes/material.ts): load a bundle, then move any lever from it. Each lever is a number, 0 (Off)
 * to 8, as Elevation; the bundle's own value carries its name, as a setting's default carries "(Default)". A lever's
 * switches show while it is on, so None is one row and a bundle shows only what it uses.
 */
function MaterialSettings() {
  const { material, setMaterialBundle, setMaterialValue } = useStudio();
  const bundle = MATERIAL_BUNDLES[material.bundle]!;
  const named = (key: string, value: string, label: string) =>
    material.bundle !== "none" && String(bundle.levers[key] ?? 0) === value && value !== "0" ? `${label} (${bundle.label})` : label;
  return (
    <PanelSection heading="Material">
      <Field label="Material" orientation="horizontal">
        <Select size="sm" variant="soft" fullWidth value={material.bundle} onChange={event => setMaterialBundle(event.currentTarget.value)}>
          {Object.entries(MATERIAL_BUNDLES).map(([id, entry]) => <option key={id} value={id}>{id === "none" ? "None (Default)" : entry.label}</option>)}
        </Select>
      </Field>
      {MATERIAL_LEVERS.map(lever => {
        const value = materialValue(material, lever.id);
        const on = value !== "0";
        return [
          <Field key={lever.id} label={lever.label} orientation="horizontal">
            <Select size="sm" variant="soft" fullWidth value={value} onChange={event => setMaterialValue(lever.id, event.currentTarget.value)}>
              {lever.steps.map(step => {
                const text = lever.id === "angle" ? `${step}°${step === 0 ? " (Top)" : ""}` : step === 0 ? "0 (Off)" : String(step);
                return <option key={step} value={String(step)}>{named(lever.id, String(step), text)}</option>;
              })}
            </Select>
          </Field>,
          ...(on && lever.id !== "angle" ? MATERIAL_SWITCHES.filter(toggle => toggle.lever === lever.id).map(toggle => (
            <Field key={toggle.id} label={toggle.label} orientation="horizontal">
              {toggle.options.length === 2 ? (
                <Segmented size="sm" fullWidth items={toggle.options.map(o => ({ value: o.value, label: o.label }))}
                  value={materialValue(material, toggle.id)} onValueChange={next => setMaterialValue(toggle.id, next)} />
              ) : (
                <Select size="sm" variant="soft" fullWidth value={materialValue(material, toggle.id)} onChange={event => setMaterialValue(toggle.id, event.currentTarget.value)}>
                  {toggle.options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </Select>
              )}
            </Field>
          )) : []),
          ...(on && lever.id === "stroke" ? [
            <Field key="stroke-style" label="Stroke style" orientation="horizontal">
              <CustomSelect multiple size="sm" variant="soft" fullWidth aria-label="Stroke style" placeholder="None"
                items={MATERIAL_STROKE_STYLES.map(style => ({ value: style.id, label: style.label }))}
                values={materialValue(material, "stroke-style").split(" ").filter(Boolean)}
                onValuesChange={next => setMaterialValue("stroke-style", MATERIAL_STROKE_STYLES.map(style => style.id).filter(id => next.includes(id)).join(" "))} />
            </Field>,
          ] : []),
        ];
      })}
    </PanelSection>
  );
}
