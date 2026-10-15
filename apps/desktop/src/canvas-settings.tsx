/**
 * The Inspector's Canvas settings: the system-wide settings the Canvas previews, from the gallery's
 * own control list (src/gallery/controls.ts), grouped by what they shape under their own headings
 * (owner, 2026-10-14: "separated by larger titles"): Color (neutral, accent, action, selection),
 * Size (type size, density), Shape (the radius, and which components draw a pill instead) and
 * Effects (surface, elevation, motion). A tab shows only the settings that change its specimens,
 * and its own display settings follow in a Display section (Typography's sample text).
 * They write data-area-* on the Canvas only, so the app's own chrome stays compact.
 */
import type { ReactNode } from "react";
import { CustomSelect, Field, PanelSection, Segmented, Select } from "@area/react";
import { GALLERY_CONTROLS } from "./gallery/controls.ts";
import { useStudio, type CanvasAxes } from "./studio.tsx";

type Axis = keyof CanvasAxes;
// Headings never repeat a row's label (a Radius heading over a Radius row read twice).
const GROUPS: ReadonlyArray<{ heading: string; axes: readonly Axis[] }> = [
  { heading: "Color", axes: ["neutral", "accent", "action", "selection"] },
  { heading: "Size", axes: ["type", "density"] },
  { heading: "Shape", axes: ["radius", "pills"] },
  { heading: "Effects", axes: ["surface", "elevation", "motion"] },
];

export function CanvasSettings({ axes = ["neutral", "accent", "action", "selection", "type", "density", "radius", "surface", "elevation", "motion", "pills"], children }: { axes?: readonly Axis[]; children?: ReactNode }) {
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
