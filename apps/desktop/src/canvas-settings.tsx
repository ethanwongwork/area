/**
 * The Inspector's Canvas section: the system-wide settings the Canvas previews (density, radius,
 * pills), one row each, from the gallery's own control list (src/gallery/controls.ts).
 * They write data-area-* on the Canvas only, so the app's own chrome stays compact.
 */
import { Chip, ChipGroup, Field, PanelSection, Segmented, Select } from "@area/react";
import { GALLERY_CONTROLS } from "./gallery/controls.ts";
import { useStudio, type CanvasAxes } from "./studio.tsx";

export function CanvasSettings({ axes = ["ui", "radius", "pills"] }: { axes?: ReadonlyArray<keyof CanvasAxes> }) {
  const { canvas, setCanvas } = useStudio();
  return (
    <PanelSection heading="Canvas">
      {GALLERY_CONTROLS.filter(control => (axes as readonly string[]).includes(control.axis)).map(control => {
        const axis = control.axis as keyof CanvasAxes;
        const value = canvas[axis];
        return (
          // One row per setting, the label beside its control (owner, 2026-10-11); a set of chips
          // wraps, so it keeps its label above.
          <Field key={axis} label={control.label} orientation={control.kind === "chips" ? "vertical" : "horizontal"}>
            {control.kind === "chips" ? (
              <ChipGroup aria-label={control.label}>
                {control.items.map(item => {
                  const on = value.split(" ").includes(item.value);
                  const next = (selected: boolean) => control.items.map(other => other.value)
                    .filter(name => name === item.value ? selected : value.split(" ").includes(name)).join(" ");
                  return <Chip key={item.value} size="sm" selected={on} onSelectedChange={selected => setCanvas(axis, next(selected))}>{item.label}</Chip>;
                })}
              </ChipGroup>
            ) : control.kind === "select" ? (
              <Select size="sm" fullWidth value={value} onChange={event => setCanvas(axis, event.currentTarget.value)}>
                {control.items.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}
              </Select>
            ) : (
              <Segmented size="sm" fullWidth items={[...control.items]} value={value} onValueChange={next => setCanvas(axis, next)} />
            )}
          </Field>
        );
      })}
    </PanelSection>
  );
}
