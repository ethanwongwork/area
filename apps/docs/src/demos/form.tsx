import { Checkbox, Chip, ChipGroup, Field, Input, Radio, Select, Slider, Switch, Textarea } from "@area/react";
import { SearchIcon } from "../icons.tsx";

export const InputDefault = () => <Input placeholder="Email" />;

export const InputWithIcon = () => <Input icon={<SearchIcon />} placeholder="Search" />;

export const InputWithAffix = () => <Input prefix="$" suffix="USD" placeholder="0.00" />;

export const InputSizes = () => (
  <>
    <Input size="sm" placeholder="Small" />
    <Input size="md" placeholder="Medium" />
    <Input size="lg" placeholder="Large" />
  </>
);

export const InputInvalid = () => <Input invalid defaultValue="not-an-email" />;

export const FieldDefault = () => (
  <Field label="Email" description="We only use this to sign you in." htmlFor="email">
    <Input id="email" type="email" placeholder="you@example.com" />
  </Field>
);

export const FieldError = () => (
  <Field label="Email" error="Enter a valid email address." required htmlFor="email-error">
    <Input id="email-error" invalid defaultValue="not-an-email" />
  </Field>
);

export const TextareaDefault = () => <Textarea placeholder="Write a message" rows={3} />;

export const SelectDefault = () => (
  <Select defaultValue="md">
    <option value="sm">Small</option>
    <option value="md">Medium</option>
    <option value="lg">Large</option>
  </Select>
);

export const CheckboxDefault = () => <Checkbox label="Accept terms" defaultChecked />;

export const CheckboxDescription = () => (
  <Checkbox
    label="Email notifications"
    description="Get notified when someone mentions you."
    defaultChecked
  />
);

export const RadioDefault = () => (
  <>
    <Radio name="plan" label="Starter" defaultChecked />
    <Radio name="plan" label="Pro" />
  </>
);

export const SwitchDefault = () => <Switch label="Airplane mode" defaultChecked />;

export const SliderDefault = () => <Slider min={0} max={12} defaultValue={8} readout="8" />;

export const SliderSizes = () => (
  <>
    <Slider size="xs" min={0} max={100} defaultValue={25} readout="25" />
    <Slider size="sm" min={0} max={100} defaultValue={50} readout="50" />
    <Slider size="md" min={0} max={100} defaultValue={75} readout="75" />
  </>
);

export const SliderBare = () => <Slider min={0} max={100} defaultValue={40} />;

export const ChipDefault = () => (
  <ChipGroup>
    <Chip selected>All</Chip>
    <Chip>Components</Chip>
    <Chip>Foundations</Chip>
    <Chip>Patterns</Chip>
  </ChipGroup>
);

export const ChipSwatches = () => (
  <ChipGroup>
    <Chip swatch="var(--area-red-500)">Red</Chip>
    <Chip swatch="var(--area-green-600)">Green</Chip>
    <Chip selected swatch="var(--area-indigo-500)">
      Indigo
    </Chip>
    <Chip swatch="var(--area-purple-500)">Purple</Chip>
  </ChipGroup>
);

export const ChipSizes = () => (
  <ChipGroup>
    <Chip size="xs">Extra small</Chip>
    <Chip size="sm">Small</Chip>
    <Chip size="md">Medium</Chip>
  </ChipGroup>
);

export const FieldInline = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "var(--area-space-12)", inlineSize: 280 }}>
    <Field inline label="Density" htmlFor="inline-density">
      <Select size="xs" id="inline-density" defaultValue="default">
        <option value="compact">Compact</option>
        <option value="default">Default</option>
      </Select>
    </Field>
    <Field inline label="Radius" htmlFor="inline-radius">
      <Slider size="xs" id="inline-radius" min={0} max={12} defaultValue={8} readout="8" />
    </Field>
    <Field inline label="Reduce motion" htmlFor="inline-motion">
      <Switch size="xs" id="inline-motion" />
    </Field>
  </div>
);

export const CheckboxSizes = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "var(--area-space-16)" }}>
    {(["xs", "sm", "md", "lg", "xl"] as const).map((size) => (
      <div key={size} data-choice-size={size} style={{ display: "flex", alignItems: "center", gap: "var(--area-space-24)" }}>
        <Checkbox size={size} label={`${size} off`} />
        <Checkbox size={size} label={`${size} on`} defaultChecked />
      </div>
    ))}
  </div>
);

export const RadioSizes = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "var(--area-space-16)" }}>
    {(["xs", "sm", "md", "lg", "xl"] as const).map((size) => (
      <div key={size} data-choice-size={size} style={{ display: "flex", alignItems: "center", gap: "var(--area-space-24)" }}>
        <Radio size={size} name={`size-${size}`} value="off" label={`${size} off`} />
        <Radio size={size} name={`size-${size}`} value="on" label={`${size} on`} defaultChecked />
      </div>
    ))}
  </div>
);

export const SwitchSizes = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "var(--area-space-16)" }}>
    {(["xs", "sm", "md", "lg", "xl"] as const).map((size) => (
      <div key={size} data-choice-size={size} style={{ display: "flex", alignItems: "center", gap: "var(--area-space-24)" }}>
        <Switch size={size} label={`${size} off`} />
        <Switch size={size} label={`${size} on`} defaultChecked />
      </div>
    ))}
  </div>
);
