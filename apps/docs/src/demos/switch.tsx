import { Panel, PanelSection, PanelStack, Switch } from "@area/react";

export const SwitchDefault = () => <Switch label="Airplane mode" />;
export const SwitchSizeSm = () => <Switch size="sm" label="Small" />;
export const SwitchSizeMd = () => <Switch size="md" label="Medium" />;
export const SwitchSizeLg = () => <Switch size="lg" label="Large" />;
export const SwitchChecked = () => <Switch label="Automatic updates" defaultChecked />;
export const SwitchHover = () => <Switch label="Automatic updates" data-hover="" />;
export const SwitchActive = () => <Switch label="Automatic updates" data-active="" />;
export const SwitchFocus = () => <Switch label="Automatic updates" data-focus-visible="" />;
export const SwitchDisabled = () => <Switch label="Automatic updates" disabled />;
export const SwitchDisabledChecked = () => <Switch label="Automatic updates" disabled defaultChecked />;
export const SwitchReadOnly = () => <Switch label="Automatic updates" readOnly defaultChecked />;
export const SwitchLoading = () => <Switch label="Saving preference" loading defaultChecked />;
export const SwitchLabelEnd = () => <Switch labelPosition="label-end" label="Automatic updates" />;
export const SwitchLabelStart = () => <Switch labelPosition="label-start" label="Automatic updates" />;
export const SwitchDescription = () => <Switch label="Automatically install updates" description="Your device restarts only when you are not using it." />;
export const SwitchHiddenLabel = () => <Switch aria-label="Automatic updates" />;
export const SwitchSettingsRow = () => <Switch label="Email notifications" description="Receive a weekly summary." fullWidth labelPosition="label-start" />;

export const SwitchList = () => (
  <Panel title="Notifications" size="sm">
    <PanelSection>
      <PanelStack role="group" aria-label="Notification channels">
        <Switch label="Email" fullWidth labelPosition="label-start" defaultChecked />
        <Switch label="Push" fullWidth labelPosition="label-start" defaultChecked />
        <Switch label="SMS" fullWidth labelPosition="label-start" />
        <Switch label="Weekly summary" fullWidth labelPosition="label-start" />
      </PanelStack>
    </PanelSection>
  </Panel>
);

export const SwitchSizes = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "var(--area-space-24)" }}>
    <Switch size="sm" label="Small" />
    <Switch size="md" label="Medium" />
    <Switch size="lg" label="Large" />
  </div>
);
