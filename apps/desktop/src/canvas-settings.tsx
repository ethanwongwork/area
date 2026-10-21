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
import type { ReactNode } from "react";
import { CustomSelect, Field, PanelSection, Segmented } from "@area/react";
import { MATERIAL_BUNDLES, MATERIAL_LEVERS, MATERIAL_STROKE_STYLES, MATERIAL_SWITCHES, SETTING_GROUPS } from "@area/tokens/config";
import { DEPTH_LEVER_AXES, GALLERY_CONTROLS } from "./gallery/controls.ts";
import { materialValue, type MaterialState } from "./material.ts";
import { optionMark } from "./option-marks.tsx";
import { useStudio, type CanvasAxes } from "./studio.tsx";

type Axis = keyof CanvasAxes;
// Headings and their settings are the registry's (@area/tokens axes/registry.ts SETTING_GROUPS; owner, 2026-10-19: "i
// want the axises to be the source of truth"), shared with the Theme tab. Headings never repeat a row's label: a
// setting under its heading drops the heading's word (src/gallery/controls.ts). Edge and Depth's controls (axes/depth.ts)
// sit under Stroke (Width, Strength, Rest shadow) and Shadow (Floating, Resting, Field, Size, Softness, Light, Colour).
const GROUPS = SETTING_GROUPS;

export function CanvasSettings({ material, axes = ["neutral", "accent", "ground-light", "ground-dark", "layers-light", "layers-dark", "action", "selection", "contrast", "type", "density", "radius", "surface", "shadow-rest", "elevation", ...DEPTH_LEVER_AXES, "motion", "easing", "pills"], children }: { axes?: readonly Axis[]; material?: boolean; children?: ReactNode }) {
  // Material shows with every setting: a tab that narrows its settings shows no surfaces a material paints.
  const showMaterial = material ?? axes.length === GALLERY_CONTROLS.length - 1;
  return (
    <>
      {GROUPS.map(group => {
        const shown = (group.settings as readonly Axis[]).filter(axis => axes.includes(axis));
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

/**
 * One setting, its label beside its control (owner, 2026-10-11); fields are soft, as Figma's. A list's options draw what
 * they set (src/option-marks.tsx), and the option the pointer or the arrows are on previews on the Canvas until the list
 * closes (owner, 2026-10-18; docs/research/settings-pickers-2026-10-18). A set previews the highlighted part toggled.
 */
function Setting({ axis }: { axis: Axis }) {
  const { canvas, setCanvas, previewCanvas } = useStudio();
  const control = GALLERY_CONTROLS.find(entry => entry.axis === axis)!;
  const value = canvas[axis];
  const items = control.items.map(item => ({ value: item.value, label: item.label, icon: optionMark(axis, item.value, canvas) ?? undefined }));
  return (
    <Field label={control.label} orientation="horizontal">
      {control.kind === "chips" ? (
        // A set (several on at once) is a multi-select dropdown (owner, 2026-10-14; was a group of
        // toggle Chips): its rows toggle and the list stays open.
        <CustomSelect multiple size="sm" variant="soft" fullWidth aria-label={control.label} placeholder="None"
          items={items} values={value.split(" ").filter(Boolean)} onValuesChange={next => setCanvas(axis, next.join(" "))}
          onHighlightChange={part => {
            if (part === null) return previewCanvas(axis, null);
            const on = value.split(" ").filter(Boolean);
            const toggled = on.includes(part) ? on.filter(name => name !== part) : [...on, part];
            previewCanvas(axis, control.items.map(item => item.value).filter(name => toggled.includes(name)).join(" "));
          }} />
      ) : control.kind === "select" ? (
        <CustomSelect size="sm" variant="soft" fullWidth aria-label={control.label} title={control.hint}
          items={items} value={value} onValueChange={next => setCanvas(axis, next)} onHighlightChange={next => previewCanvas(axis, next)} />
      ) : (
        // Two or three words in a 256 Inspector: a swatch would truncate them, so segments stay text.
        <Segmented size="sm" fullWidth items={[...control.items]} value={value} onValueChange={next => setCanvas(axis, next)} />
      )}
    </Field>
  );
}

/**
 * Material (@area/tokens axes/material.ts): load a bundle, then move any lever from it. Each lever is a number, 0 (Off)
 * to 8, as Elevation; the bundle's own value carries its name ("3 (Glass)"); None, the default, carries no mark (owner, 2026-10-20). A lever's
 * switches show while it is on, so None is one row and a bundle shows only what it uses.
 */
function MaterialSettings() {
  const { material, setMaterialBundle, setMaterialValue, previewCanvas, previewMaterial } = useStudio();
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
        <CustomSelect size="sm" variant="soft" fullWidth aria-label="Material" value={material.bundle}
          items={Object.entries(MATERIAL_BUNDLES).map(([id, entry]) => ({ value: id, label: entry.label }))}
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
                return { value: String(step), label: named(lever.id, String(step), text) };
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
