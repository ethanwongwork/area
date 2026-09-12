import { Checkbox, Field, Input, Radio, Select, Switch, Textarea } from "@area/react";
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
