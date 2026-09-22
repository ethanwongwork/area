import type { CSSProperties } from "react";
import { Switch } from "@area/react";

export const SwitchDefault = () => <Switch label="Label" />;
export const SwitchSizeSm = () => <Switch size="sm" label="Label" />;
export const SwitchSizeMd = () => <Switch size="md" label="Label" />;
export const SwitchSizeLg = () => <Switch size="lg" label="Label" />;
export const SwitchChecked = () => <Switch label="Label" defaultChecked />;
export const SwitchAccent = () => <Switch label="Label" tone="accent" defaultChecked />;
export const SwitchCustom = () => <Switch label="Custom" tone="custom" defaultChecked style={{ "--area-switch-color": "var(--area-success-solid)", "--area-switch-color-hover": "var(--area-success-solid-hover)" } as CSSProperties} />;
export const SwitchLong = () => <Switch label="Label" track="long" defaultChecked />;
export const SwitchHover = () => <Switch label="Label" data-hover="" />;
export const SwitchActive = () => <Switch label="Label" data-active="" />;
export const SwitchFocus = () => <Switch label="Label" data-focus-visible="" />;
export const SwitchDisabled = () => <Switch label="Label" disabled />;
export const SwitchDisabledChecked = () => <Switch label="Label" disabled defaultChecked />;
export const SwitchReadOnly = () => <Switch label="Label" readOnly defaultChecked />;
export const SwitchLoading = () => <Switch label="Label" loading defaultChecked />;
export const SwitchLabelEnd = () => <Switch labelPosition="label-end" label="Label" />;
export const SwitchLabelStart = () => <Switch labelPosition="label-start" label="Label" />;
export const SwitchDescription = () => <Switch label="Label" description="Supporting description goes here." />;
export const SwitchHiddenLabel = () => <Switch aria-label="Label" />;
export const SwitchSettingsRow = () => <Switch label="Label" description="Supporting description." fullWidth labelPosition="label-start" />;

export const SwitchList = () => (
  <div role="group" aria-label="Section title" style={{ display: "grid", inlineSize: "100%", gap: "var(--area-space-16)", fontSize: "var(--area-ui-size)", lineHeight: "var(--area-ui-leading)" }}>
    <strong>Section title</strong>
    <Switch label="Item one" fullWidth labelPosition="label-start" defaultChecked />
    <Switch label="Item two" fullWidth labelPosition="label-start" defaultChecked />
    <Switch label="Item three" fullWidth labelPosition="label-start" />
  </div>
);

export const SwitchSizes = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "var(--area-space-24)" }}>
    <Switch size="sm" label="Label" />
    <Switch size="md" label="Label" />
    <Switch size="lg" label="Label" />
  </div>
);
