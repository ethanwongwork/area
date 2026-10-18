/** Date picker gallery specimens: one variant per tile. docs/specs/date-picker.md. */
import type { CSSProperties } from "react";
import { DatePicker } from "@area/react";
import { CalendarIcon } from "@area/icons";

/* A fixed today, so the specimens render the same month every day (as the Calendar tiles). */
const today = "2026-10-05";
const frame: CSSProperties = { inlineSize: 240 };

export const GalleryDatePicker = () => (
  <div style={frame}><DatePicker fullWidth aria-label="Date" icon={<CalendarIcon />} today={today} defaultValue="2026-10-14" /></div>
);
export const GalleryDatePickerPlaceholder = () => (
  <div style={frame}><DatePicker fullWidth aria-label="Date" icon={<CalendarIcon />} today={today} /></div>
);
export const GalleryDatePickerNoIcon = () => (
  <div style={frame}><DatePicker fullWidth aria-label="Date" today={today} defaultValue="2026-10-14" /></div>
);
export const GalleryDatePickerSoft = () => (
  <div style={frame}><DatePicker fullWidth variant="soft" aria-label="Date" icon={<CalendarIcon />} today={today} defaultValue="2026-10-14" /></div>
);
/* Notion's property value: plain text until the pointer is on it. */
export const GalleryDatePickerGhost = () => (
  <DatePicker variant="ghost" size="sm" aria-label="Date" placeholder="Placeholder" today={today} />
);
export const GalleryDatePickerSm = () => (
  <div style={frame}><DatePicker fullWidth size="sm" aria-label="Date" icon={<CalendarIcon />} today={today} defaultValue="2026-10-14" /></div>
);
export const GalleryDatePickerMd = () => (
  <div style={frame}><DatePicker fullWidth size="md" aria-label="Date" icon={<CalendarIcon />} today={today} defaultValue="2026-10-14" /></div>
);
export const GalleryDatePickerLg = () => (
  <div style={frame}><DatePicker fullWidth size="lg" aria-label="Date" icon={<CalendarIcon />} today={today} defaultValue="2026-10-14" /></div>
);
export const GalleryDatePickerLimits = () => (
  <div style={frame}><DatePicker fullWidth aria-label="Date" icon={<CalendarIcon />} today={today} min="2026-10-05" max="2026-10-30"
    isDateUnavailable={date => [0, 6].includes(new Date(`${date}T12:00`).getDay())} /></div>
);
export const GalleryDatePickerDisabled = () => (
  <div style={frame}><DatePicker fullWidth disabled aria-label="Date" icon={<CalendarIcon />} today={today} defaultValue="2026-10-14" /></div>
);
export const GalleryDatePickerInvalid = () => (
  <div style={frame}><DatePicker fullWidth invalid aria-label="Date" icon={<CalendarIcon />} today={today} /></div>
);
