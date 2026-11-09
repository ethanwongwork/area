/** Setting row and Settings group gallery specimens: one variant per tile. docs/specs/setting-row.md. */
import { useState } from "react";
import { Segmented, Select, SettingRow, SettingsGroup, Switch, Textarea, Toggletip } from "@area/react";

/* A settings page's reading column, and a narrow pane for the row that drops its control under its text. */
const page = { inlineSize: "calc(var(--area-space-96) * 6)", maxInlineSize: "100%" };
const narrow = { inlineSize: "calc(var(--area-space-96) * 3 + var(--area-space-32))", maxInlineSize: "100%" };
const options = [{ value: "one", label: "One" }, { value: "two", label: "Two" }, { value: "three", label: "Three" }];

export const GallerySettingRow = () => (
  <SettingRow style={page} label="Label" description="Description"><Switch /></SettingRow>
);
export const GallerySettingRowSelect = () => (
  <SettingRow style={page} label="Label" description="Description">
    <Select size="sm" variant="soft" defaultValue="one"><option value="one">Option one</option><option value="two">Option two</option></Select>
  </SettingRow>
);
/* Modified: the dot after the name and Reset on hover or focus, which puts the default back. */
export const GallerySettingRowModified = () => {
  const [value, setValue] = useState("two");
  const modified = value !== "one";
  return (
    <SettingRow style={page} label="Label" description="Description" modified={modified} onReset={() => setValue("one")}>
      <Segmented size="sm" value={value} onValueChange={setValue} items={options} />
    </SettingRow>
  );
};
export const GallerySettingRowHelp = () => (
  <SettingRow style={page} label="Label" description="Description" labelAction={<Toggletip size="sm" content="Body text" />}><Switch defaultChecked /></SettingRow>
);
export const GallerySettingRowVertical = () => (
  <SettingRow style={page} orientation="vertical" label="Label" description="Description"><Textarea placeholder="Placeholder" rows={3} /></SettingRow>
);
/* Narrower than the text and the control side by side: the control drops under the text. */
export const GallerySettingRowNarrow = () => (
  <SettingRow style={narrow} label="Label" description="Description">
    <Segmented size="sm" defaultValue="one" items={options} />
  </SettingRow>
);
export const GallerySettingRowDisabled = () => (
  <SettingRow style={page} disabled label="Label" description="Description"><Switch /></SettingRow>
);
export const GallerySettingsGroup = () => (
  <SettingsGroup style={page} heading="Title" description="Description">
    <SettingRow label="Label" description="Description"><Switch defaultChecked /></SettingRow>
    <SettingRow label="Label" description="Description">
      <Select size="sm" variant="soft" defaultValue="one"><option value="one">Option one</option><option value="two">Option two</option></Select>
    </SettingRow>
    <SettingRow label="Label" description="Description"><Segmented size="sm" defaultValue="one" items={options} /></SettingRow>
  </SettingsGroup>
);
export const GallerySettingsGroupFramed = () => (
  <SettingsGroup style={page} framed heading="Title">
    <SettingRow label="Label" description="Description"><Switch defaultChecked /></SettingRow>
    <SettingRow label="Label" description="Description"><Switch /></SettingRow>
    <SettingRow label="Label" description="Description"><Segmented size="sm" defaultValue="one" items={options} /></SettingRow>
  </SettingsGroup>
);
