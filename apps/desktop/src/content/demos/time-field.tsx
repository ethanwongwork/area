/** Time field gallery specimens: one variant per tile. docs/specs/time-field.md. */
import { useState } from "react";
import { Field, TimeField } from "@area/react";

export const GalleryTimeField = () => <TimeField aria-label="Time" hourCycle={12} />;
export const GalleryTimeFieldFilled = () => <TimeField aria-label="Time" hourCycle={12} defaultValue="09:30" />;
export const GalleryTimeField24 = () => <TimeField aria-label="Time" hourCycle={24} defaultValue="17:45" />;
export const GalleryTimeFieldSeconds = () => <TimeField aria-label="Time" hourCycle={24} granularity="second" defaultValue="17:45:20" />;
export const GalleryTimeFieldIcon = () => <TimeField aria-label="Time" hourCycle={12} icon defaultValue="09:30" />;
/* ChatGPT's task schedule: a list of times 15 minutes apart, the current one checked. */
export const GalleryTimeFieldList = () => <TimeField aria-label="Time" hourCycle={12} step={15} defaultValue="09:00" />;
export const GalleryTimeFieldSoft = () => <TimeField variant="soft" aria-label="Time" hourCycle={12} defaultValue="09:30" />;
export const GalleryTimeFieldSm = () => <TimeField size="sm" aria-label="Time" hourCycle={12} defaultValue="09:30" />;
export const GalleryTimeFieldMd = () => <TimeField size="md" aria-label="Time" hourCycle={12} defaultValue="09:30" />;
export const GalleryTimeFieldLg = () => <TimeField size="lg" aria-label="Time" hourCycle={12} defaultValue="09:30" />;
export const GalleryTimeFieldInvalid = () => <TimeField aria-label="Time" hourCycle={12} defaultValue="23:30" invalid />;
export const GalleryTimeFieldDisabled = () => <TimeField aria-label="Time" hourCycle={12} defaultValue="09:30" disabled />;
/* Labelled by a Field, controlled; the value is 24-hour. */
export const GalleryTimeFieldControlled = () => {
  const [time, setTime] = useState<string | null>("14:00");
  return (
    <Field label="Label" description={time ? `Value: ${time}` : "Value: none yet"}>
      <TimeField hourCycle={12} step={30} value={time} onValueChange={setTime} />
    </Field>
  );
};
