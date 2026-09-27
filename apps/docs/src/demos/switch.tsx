import type { CSSProperties } from "react";
import { Switch } from "@area/react";

export const SwitchDefault = () => <Switch label="Label" />;
export const SwitchSizeSm = () => <Switch size="sm" label="Label" />;
export const SwitchSizeMd = () => <Switch size="md" label="Label" />;
export const SwitchSizeLg = () => <Switch size="lg" label="Label" />;
export const SwitchChecked = () => <Switch label="Label" defaultChecked />;
export const SwitchAccent = () => <Switch label="Label" tone="accent" defaultChecked />;
export const SwitchCustom = () => <Switch label="Custom" tone="custom" defaultChecked style={{ "--area-switch-color": "var(--area-green-500)", "--area-switch-color-hover": "var(--area-green-550)" } as CSSProperties} />;
export const SwitchLong = () => <Switch label="Label" track="long" defaultChecked />;
export const SwitchHover = () => <Switch label="Label" data-hover="" />;
export const SwitchActive = () => <Switch label="Label" data-active="" />;
export const SwitchFocus = () => <Switch label="Label" data-focus-visible="" />;
export const SwitchDisabled = () => <Switch label="Label" disabled />;
export const SwitchDisabledChecked = () => <Switch label="Label" disabled defaultChecked />;
export const SwitchReadOnly = () => <Switch label="Label" readOnly defaultChecked />;
export const SwitchLoading = () => <Switch label="Label" loading defaultChecked />;
export const SwitchLabelEnd = () => <Switch labelPosition="end" label="Label" />;
export const SwitchLabelStart = () => <Switch labelPosition="start" label="Label" />;
export const SwitchDescription = () => <Switch label="Label" description="Description" />;
export const SwitchHiddenLabel = () => <Switch aria-label="Label" />;
export const SwitchSettingsRow = () => <Switch label="Label" description="Description" fullWidth labelPosition="start" />;

export const SwitchList = () => (
  <div role="group" aria-label="Label" style={{ display: "grid", inlineSize: "100%", gap: "var(--area-space-16)", fontSize: "var(--area-ui-size)", lineHeight: "var(--area-ui-leading)" }}>
    <strong>Label</strong>
    <Switch label="Item one" fullWidth labelPosition="start" defaultChecked />
    <Switch label="Item two" fullWidth labelPosition="start" defaultChecked />
    <Switch label="Item three" fullWidth labelPosition="start" />
  </div>
);

export const SwitchSizes = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "var(--area-space-24)" }}>
    <Switch size="sm" label="Label" />
    <Switch size="md" label="Label" />
    <Switch size="lg" label="Label" />
  </div>
);
