/** Date range picker gallery specimens: one variant per tile. docs/specs/date-range-picker.md. */
import type { CSSProperties } from "react";
import { DateRangePicker } from "@area/react";
import { PilotCalendarIcon } from "../../../../docs/src/pilot-icons.tsx";

/* A fixed today, so the specimens render the same month every day (as Date picker's and Calendar's tiles). */
const today = "2026-10-10";
const frame: CSSProperties = { inlineSize: 240 };
const presets = [
  { label: "Today", value: { start: today, end: today } },
  { label: "Last 7 days", value: { start: "2026-10-04", end: today } },
  { label: "Last 30 days", value: { start: "2026-09-11", end: today } },
];
const week = { start: "2026-10-04", end: "2026-10-10" };

export const GalleryDateRangePicker = () => (
  <div style={frame}><DateRangePicker fullWidth aria-label="Dates" icon={<PilotCalendarIcon />} today={today} defaultValue={week} /></div>
);
export const GalleryDateRangePickerPlaceholder = () => (
  <div style={frame}><DateRangePicker fullWidth aria-label="Dates" icon={<PilotCalendarIcon />} today={today} /></div>
);
/* Notion's search date filter: preset rows above the month. */
export const GalleryDateRangePickerPresets = () => (
  <div style={frame}><DateRangePicker fullWidth aria-label="Last edited" icon={<PilotCalendarIcon />} today={today} presets={presets} defaultValue={week} /></div>
);
/* Two months side by side, for ranges across a month's end. */
export const GalleryDateRangePickerTwoMonths = () => (
  <div style={frame}><DateRangePicker fullWidth aria-label="Trip dates" icon={<PilotCalendarIcon />} today={today} visibleMonths={2} defaultValue={{ start: "2026-10-28", end: "2026-11-03" }} /></div>
);
/* A property value: plain text until hovered (Date picker's ghost). */
export const GalleryDateRangePickerGhost = () => (
  <DateRangePicker variant="ghost" aria-label="Dates" today={today} defaultValue={week} />
);
export const GalleryDateRangePickerDisabled = () => (
  <div style={frame}><DateRangePicker fullWidth aria-label="Dates" icon={<PilotCalendarIcon />} today={today} disabled defaultValue={week} /></div>
);
