import { Checkbox, Chip, ChipGroup, Field, Input, InputAction, Radio, Select, Slider, Switch, Textarea } from "@area/react";
import { CheckIcon, DismissIcon, SearchIcon } from "../icons.tsx";

export const InputDefault = () => <Input aria-label="Email" placeholder="Email" />;

export const InputLeadingVisual = () => <Input leadingIcon={<SearchIcon />} placeholder="Search" aria-label="Search" />;

export const InputTrailingVisual = () => <Input trailingIcon={<CheckIcon />} defaultValue="area.design" aria-label="Verified domain" />;

export const InputWithAffix = () => <Input aria-label="Amount" prefix="$" suffix="USD" placeholder="0.00" />;

export const InputSizes = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "var(--area-space-24)", inlineSize: "var(--area-input-inline-size)" }}>
    <Input size="xs" placeholder="Extra small" aria-label="Extra small input" />
    <Input size="sm" placeholder="Small" aria-label="Small input" />
    <Input size="md" placeholder="Medium" aria-label="Medium input" />
    <Input size="lg" placeholder="Large" aria-label="Large input" />
    <Input size="xl" placeholder="Extra large" aria-label="Extra large input" />
  </div>
);

export const InputInvalid = () => <Input aria-label="Email" invalid defaultValue="not-an-email" />;

export const InputSuccess = () => <Input aria-label="Workspace name" validationStatus="success" defaultValue="area-design" />;

export const InputWarning = () => <Input aria-label="Workspace name" validationStatus="warning" defaultValue="area-design" />;

export const InputOutline = () => <Input variant="outline" placeholder="Outline" aria-label="Outline input" />;

export const InputSoft = () => <Input variant="soft" placeholder="Soft" aria-label="Soft input" />;

export const InputReadOnly = () => <Input readOnly defaultValue="Read-only value" aria-label="Read-only input" />;

export const InputDisabled = () => <Input disabled placeholder="Disabled" aria-label="Disabled input" />;

export const InputLoading = () => <Input loading loadingText="Checking availability" defaultValue="area.design" aria-label="Loading input" />;

export const InputLoadingLeading = () => <Input leadingIcon={<SearchIcon />} loading loaderPosition="leading" loadingText="Searching" placeholder="Search" aria-label="Searching" />;

export const InputTrailingAction = () => <Input defaultValue="area.design" aria-label="Domain" trailingAction={<InputAction icon={<DismissIcon />} tooltip="Clear domain" />} />;

export const InputFullWidth = () => <div style={{ inlineSize: 320 }}><Input fullWidth placeholder="Full width when requested" aria-label="Full-width input" /></div>;

export const InputMonospace = () => <Input monospace defaultValue="sk-area-1234" aria-label="API key" />;

export const InputFile = () => <Input type="file" aria-label="Upload file" />;

export const InputRtl = () => (
  <div dir="rtl" style={{ inlineSize: "var(--area-input-inline-size)" }}>
    <Input
      leadingIcon={<SearchIcon />}
      trailingIcon={<CheckIcon />}
      defaultValue="اسم مساحة عمل طويل لاختبار الاتجاه"
      aria-label="Verified domain in right-to-left layout"
    />
  </div>
);

export const FieldDefault = () => (
  <Field label="Email">
    <Input type="email" placeholder="you@example.com" />
  </Field>
);

export const FieldError = () => (
  <Field
    label="Email"
    description="Use the address associated with your workspace."
    error="Enter a valid email address."
    required
  >
    <Input defaultValue="not-an-email" />
  </Field>
);

export const FieldDisabled = () => (
  <Field label="Workspace" description="Managed by your organization." disabled>
    <Input defaultValue="Area design" />
  </Field>
);

export const FieldHiddenLabel = () => (
  <Field label="Search components" visuallyHiddenLabel>
    <Input icon={<SearchIcon />} placeholder="Search components" />
  </Field>
);

export const FieldHorizontal = () => (
  <Field orientation="horizontal" label="Account name">
    <Input placeholder="area-design" />
  </Field>
);

export const FieldSizes = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "var(--area-space-24)", inlineSize: "var(--area-input-inline-size)" }}>
    <Field label="Small field"><Input size="sm" placeholder="Small control" /></Field>
    <Field label="Medium field"><Input size="md" placeholder="Medium control" /></Field>
    <Field label="Large field"><Input size="lg" placeholder="Large control" /></Field>
  </div>
);

export const FieldRequired = () => <Field label="Email" required><Input type="email" placeholder="you@example.com" /></Field>;

export const FieldCaption = () => <Field label="Email" description="Use the address associated with your workspace."><Input type="email" placeholder="you@example.com" /></Field>;

export const FieldValidation = () => <Field label="Email" error="Enter a valid email address." required><Input defaultValue="not-an-email" /></Field>;

export const FieldSuccess = () => <Field label="Workspace" validation="This name is available." validationStatus="success"><Input defaultValue="area-design" /></Field>;

export const FieldWarning = () => <Field label="Workspace" validation="This name is visible to everyone in your organization." validationStatus="warning"><Input defaultValue="area-design" /></Field>;

export const TextareaDefault = () => <Textarea aria-label="Message" placeholder="Write a message" />;

export const TextareaOutline = () => <Textarea variant="outline" aria-label="Outline message" placeholder="Outline" />;

export const TextareaSoft = () => <Textarea variant="soft" aria-label="Soft message" placeholder="Soft" />;

export const TextareaSizes = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "var(--area-space-24)", inlineSize: "var(--area-textarea-inline-size)" }}>
    <Textarea size="sm" rows={3} aria-label="Small textarea" placeholder="Small" />
    <Textarea size="md" rows={3} aria-label="Medium textarea" placeholder="Medium" />
    <Textarea size="lg" rows={3} aria-label="Large textarea" placeholder="Large" />
  </div>
);

export const TextareaInvalid = () => <Textarea invalid aria-label="Invalid message" defaultValue="Too short" />;

export const TextareaSuccess = () => <Textarea validationStatus="success" aria-label="Accepted message" defaultValue="This response is ready." />;

export const TextareaWarning = () => <Textarea validationStatus="warning" aria-label="Message with warning" defaultValue="This response will be visible to everyone." />;

export const TextareaReadOnly = () => <Textarea readOnly aria-label="Read-only message" defaultValue="This note may be selected and copied." />;

export const TextareaDisabled = () => <Textarea disabled aria-label="Disabled message" placeholder="Disabled" />;

export const TextareaFullWidth = () => (
  <div style={{ inlineSize: 320 }}>
    <Textarea fullWidth rows={3} aria-label="Full-width message" placeholder="Full width when requested" />
  </div>
);

export const TextareaRows = () => <Textarea rows={2} aria-label="Short message" placeholder="Two visible rows" />;

export const TextareaField = () => (
  <Field label="Release notes" description="Summarize the user-visible changes.">
    <Textarea placeholder="Added keyboard navigation" />
  </Field>
);

export const TextareaResizeNone = () => <Textarea resize="none" rows={3} aria-label="Fixed message area" placeholder="Resize disabled" />;

export const SelectDefault = () => (
  <Select aria-label="Control size" defaultValue="md">
    <option value="sm">Small</option>
    <option value="md">Medium</option>
    <option value="lg">Large</option>
  </Select>
);

export const SelectSizes = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "var(--area-space-24)", inlineSize: "var(--area-select-inline-size)" }}>
    <Select size="xs" aria-label="Extra small size" defaultValue="xs"><option value="xs">Extra small</option></Select>
    <Select size="sm" aria-label="Small size" defaultValue="sm"><option value="sm">Small</option></Select>
    <Select size="md" aria-label="Medium size" defaultValue="md"><option value="md">Medium</option></Select>
    <Select size="lg" aria-label="Large size" defaultValue="lg"><option value="lg">Large</option></Select>
    <Select size="xl" aria-label="Extra large size" defaultValue="xl"><option value="xl">Extra large</option></Select>
  </div>
);

export const SelectField = () => (
  <Field label="Region" description="This determines the default data location." required>
    <Select defaultValue="us"><option value="us">United States</option><option value="eu">European Union</option><option value="apac">Asia Pacific</option></Select>
  </Field>
);

export const SelectInvalid = () => (
  <Field label="Framework" error="Select a framework." required>
    <Select defaultValue=""><option value="">Select a framework</option><option value="react">React</option><option value="vue">Vue</option></Select>
  </Field>
);

export const SelectValidation = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "var(--area-space-16)" }}>
    <Select validationStatus="success" aria-label="Verified region" defaultValue="us"><option value="us">United States</option></Select>
    <Select validationStatus="warning" aria-label="Region with warning" defaultValue="us"><option value="us">United States</option></Select>
  </div>
);

export const SelectDisabled = () => <Select disabled aria-label="Managed plan" defaultValue="enterprise"><option value="enterprise">Enterprise</option></Select>;

export const SelectFullWidth = () => <div style={{ inlineSize: 320 }}><Select fullWidth aria-label="Full-width region" defaultValue="us"><option value="us">United States</option><option value="eu">European Union</option></Select></div>;

export const SelectGroups = () => (
  <Select aria-label="Deployment region" defaultValue="us-west">
    <optgroup label="North America"><option value="us-west">US West</option><option value="us-east">US East</option></optgroup>
    <optgroup label="Europe"><option value="eu-west">EU West</option><option value="eu-central">EU Central</option></optgroup>
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
