import { useState } from "react";
import { Avatar, Checkbox, CheckboxGroup, Chip, ChipGroup, ChipLink, Field, Input, InputAction, NumberField, Panel, PanelSection, Radio, RadioGroup, Select, Slider, Textarea } from "@area/react";
import { CheckIcon, CornerRadiusIcon, DismissIcon, OpacityIcon, OpenIcon, RotateIcon, SearchIcon, TrashIcon } from "../icons.tsx";
import { SliderRangeComposition } from "./slider-range.tsx";

export const InputDefault = () => <Input aria-label="Label" placeholder="Placeholder" />;

export const InputLeadingVisual = () => <Input leadingIcon={<SearchIcon />} placeholder="Placeholder" aria-label="Label" />;

export const InputTrailingVisual = () => <Input trailingIcon={<CheckIcon />} defaultValue="Value" aria-label="Label" />;

export const InputWithAffix = () => <Input aria-label="Label" prefix="$" suffix="USD" placeholder="0.00" />;

export const InputSizes = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "var(--area-space-24)", inlineSize: "var(--area-input-inline-size)" }}>
    <Input size="sm" placeholder="Small" aria-label="Label" />
    <Input size="md" placeholder="Medium" aria-label="Label" />
    <Input size="lg" placeholder="Large" aria-label="Label" />
  </div>
);

export const InputInvalid = () => <Input aria-label="Label" validationStatus="error" defaultValue="Invalid value" />;

export const InputSuccess = () => <Input aria-label="Label" validationStatus="success" defaultValue="Value" />;

export const InputWarning = () => <Input aria-label="Label" validationStatus="warning" defaultValue="Value" />;

export const InputOutline = () => <Input variant="outline" placeholder="Outline" aria-label="Label" />;

export const InputSoft = () => <Input variant="soft" placeholder="Soft" aria-label="Label" />;

export const InputReadOnly = () => <Input readOnly defaultValue="Value" aria-label="Label" />;

export const InputDisabled = () => <Input disabled placeholder="Disabled" aria-label="Label" />;

export const InputLoading = () => <Input loading loadingText="Loading" defaultValue="Value" aria-label="Label" />;

export const InputLoadingLeading = () => <Input leadingIcon={<SearchIcon />} loading loaderPosition="leading" loadingText="Loading" placeholder="Placeholder" aria-label="Label" />;

export const InputTrailingAction = () => <Input defaultValue="Value" aria-label="Label" trailingAction={<InputAction icon={<DismissIcon />} tooltip="Clear" />} />;

export const InputFullWidth = () => <div style={{ inlineSize: 320 }}><Input fullWidth placeholder="Placeholder" aria-label="Label" /></div>;

export const InputMonospace = () => <Input monospace defaultValue="Value" aria-label="Label" />;

export const InputFile = () => <Input type="file" aria-label="Label" />;

export const InputRtl = () => (
  <div dir="rtl" style={{ inlineSize: "var(--area-input-inline-size)" }}>
    <Input
      leadingIcon={<SearchIcon />}
      trailingIcon={<CheckIcon />}
      defaultValue="اسم مساحة عمل طويل لاختبار الاتجاه"
      aria-label="Label"
    />
  </div>
);

export const NumberFieldDefault = () => <Field label="Width"><NumberField defaultValue={240} unit="px" /></Field>;
export const NumberFieldSteppers = () => <Field label="Opacity"><NumberField defaultValue={80} min={0} max={100} step={1} unit="%" steppers /></Field>;
export const NumberFieldScrub = () => <NumberField aria-label="Rotation" defaultValue={15} min={-360} max={360} unit="°" scrub={<RotateIcon />} />;
export const NumberFieldDecimal = () => <Field label="Scale"><NumberField defaultValue={1.25} min={0} step={0.05} fractionDigits={2} /></Field>;
export const NumberFieldExpression = () => <Field label="Position"><NumberField defaultValue={24} unit="px" scrub steppers /></Field>;
export const NumberFieldMixed = () => {
  const [mixed, setMixed] = useState(true);
  return <Field label="Spacing"><NumberField mixed={mixed} defaultValue={8} onValueChange={() => setMixed(false)} unit="px" steppers /></Field>;
};
export const NumberFieldSoft = () => <Field label="Height"><NumberField variant="soft" defaultValue={120} unit="px" /></Field>;
export const NumberFieldReadOnly = () => <Field label="Locked"><NumberField defaultValue={48} unit="px" readOnly /></Field>;
export const NumberFieldDisabled = () => <Field label="Unavailable"><NumberField defaultValue={48} unit="px" disabled /></Field>;
export const NumberFieldSizes = () => <div style={{ display: "grid", gap: "var(--area-space-16)", inlineSize: "var(--area-input-inline-size)" }}><NumberField size="sm" aria-label="Small" defaultValue={8} unit="px" /><NumberField size="md" aria-label="Medium" defaultValue={16} unit="px" /><NumberField size="lg" aria-label="Large" defaultValue={24} unit="px" /></div>;
export const NumberFieldSizeSm = () => (
  <NumberField size="sm" aria-label="Width" defaultValue={16} unit="px" />
);
export const NumberFieldSizeMd = () => (
  <NumberField size="md" aria-label="Width" defaultValue={16} unit="px" />
);
export const NumberFieldSizeLg = () => (
  <NumberField size="lg" aria-label="Width" defaultValue={16} unit="px" />
);
/* Figma's inspector: soft fields whose letter or icon is the scrub handle, no px, no label row. */
export const NumberFieldInspector = () => {
  const pair = { display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "var(--area-space-8)" };
  return <Panel size="sm" title="Frame" aria-label="Frame properties">
    <PanelSection heading="Position"><div style={pair}>
      <NumberField variant="soft" fullWidth aria-label="X position" defaultValue={24} scrub="X" />
      <NumberField variant="soft" fullWidth aria-label="Y position" defaultValue={48} scrub="Y" />
      <NumberField variant="soft" fullWidth aria-label="Rotation" defaultValue={0} unit="°" scrub={<RotateIcon />} />
    </div></PanelSection>
    <PanelSection heading="Size"><div style={pair}>
      <NumberField variant="soft" fullWidth aria-label="Width" defaultValue={320} min={0} scrub="W" />
      <NumberField variant="soft" fullWidth aria-label="Height" defaultValue={240} min={0} scrub="H" />
    </div></PanelSection>
    <PanelSection heading="Appearance"><div style={pair}>
      <NumberField variant="soft" fullWidth aria-label="Opacity" defaultValue={100} min={0} max={100} unit="%" scrub={<OpacityIcon />} />
      <NumberField variant="soft" fullWidth aria-label="Corner radius" defaultValue={8} min={0} scrub={<CornerRadiusIcon />} />
    </div></PanelSection>
  </Panel>;
};

export const FieldDefault = () => (
  <Field label="Label">
    <Input type="email" placeholder="Placeholder" />
  </Field>
);

export const FieldError = () => (
  <Field
    label="Label"
    description="Description"
    error="Error message"
    required
  >
    <Input defaultValue="Invalid value" />
  </Field>
);

export const FieldDisabled = () => (
  <Field label="Label" description="Description" disabled>
    <Input defaultValue="Value" />
  </Field>
);

export const FieldHiddenLabel = () => (
  <Field label="Label" visuallyHiddenLabel>
    <Input icon={<SearchIcon />} placeholder="Placeholder" />
  </Field>
);

export const FieldHorizontal = () => (
  <Field orientation="horizontal" label="Label">
    <Input placeholder="Placeholder" />
  </Field>
);

export const FieldSizes = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "var(--area-space-24)", inlineSize: "var(--area-input-inline-size)" }}>
    <Field label="Small"><Input size="sm" placeholder="Small" /></Field>
    <Field label="Medium"><Input size="md" placeholder="Medium" /></Field>
    <Field label="Large"><Input size="lg" placeholder="Large" /></Field>
  </div>
);

export const FieldRequired = () => <Field label="Label" required><Input type="email" placeholder="Placeholder" /></Field>;

export const FieldCaption = () => <Field label="Label" description="Description"><Input type="email" placeholder="Placeholder" /></Field>;

export const FieldValidation = () => <Field label="Label" error="Error message" required><Input defaultValue="Invalid value" /></Field>;

export const FieldSuccess = () => <Field label="Label" validation="Success message" validationStatus="success"><Input defaultValue="Value" /></Field>;

export const FieldWarning = () => <Field label="Label" validation="Warning message" validationStatus="warning"><Input defaultValue="Value" /></Field>;

export const TextareaDefault = () => <Textarea aria-label="Label" placeholder="Placeholder" />;

export const TextareaOutline = () => <Textarea variant="outline" aria-label="Label" placeholder="Outline" />;

export const TextareaSoft = () => <Textarea variant="soft" aria-label="Label" placeholder="Soft" />;

export const TextareaSizes = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "var(--area-space-24)", inlineSize: "var(--area-textarea-inline-size)" }}>
    <Textarea size="sm" rows={3} aria-label="Label" placeholder="Small" />
    <Textarea size="md" rows={3} aria-label="Label" placeholder="Medium" />
    <Textarea size="lg" rows={3} aria-label="Label" placeholder="Large" />
  </div>
);

export const TextareaInvalid = () => <Textarea invalid aria-label="Label" defaultValue="Invalid value" />;

export const TextareaSuccess = () => <Textarea validationStatus="success" aria-label="Label" defaultValue="Value" />;

export const TextareaWarning = () => <Textarea validationStatus="warning" aria-label="Label" defaultValue="Value" />;

export const TextareaReadOnly = () => <Textarea readOnly aria-label="Label" defaultValue="Value" />;

export const TextareaDisabled = () => <Textarea disabled aria-label="Label" placeholder="Disabled" />;

export const TextareaFullWidth = () => (
  <div style={{ inlineSize: 320 }}>
    <Textarea fullWidth rows={3} aria-label="Label" placeholder="Placeholder" />
  </div>
);

export const TextareaRows = () => <Textarea rows={2} aria-label="Label" placeholder="Placeholder" />;

export const TextareaField = () => (
  <Field label="Label" description="Description">
    <Textarea placeholder="Placeholder" />
  </Field>
);

export const TextareaResizeNone = () => <Textarea resize="none" rows={3} aria-label="Label" placeholder="Placeholder" />;

export const SelectDefault = () => (
  <Select aria-label="Label" defaultValue="one">
    <option value="one">Option one</option>
    <option value="two">Option two</option>
    <option value="three">Option three</option>
  </Select>
);

export const SelectSoft = () => (
  <Select variant="soft" aria-label="Label" defaultValue="one">
    <option value="one">Option one</option>
    <option value="two">Option two</option>
    <option value="three">Option three</option>
  </Select>
);

export const SelectSizes = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "var(--area-space-24)", inlineSize: "var(--area-select-inline-size)" }}>
    <Select size="sm" aria-label="Label" defaultValue="sm"><option value="sm">Small</option></Select>
    <Select size="md" aria-label="Label" defaultValue="md"><option value="md">Medium</option></Select>
    <Select size="lg" aria-label="Label" defaultValue="lg"><option value="lg">Large</option></Select>
  </div>
);

export const SelectField = () => (
  <Field label="Label" description="Description" required>
    <Select defaultValue="one"><option value="one">Option one</option><option value="two">Option two</option><option value="three">Option three</option></Select>
  </Field>
);

export const SelectInvalid = () => (
  <Field label="Label" error="Error message" required>
    <Select defaultValue=""><option value="">Placeholder</option><option value="one">Option one</option><option value="two">Option two</option></Select>
  </Field>
);

export const SelectValidation = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "var(--area-space-16)" }}>
    <Select validationStatus="success" aria-label="Label" defaultValue="one"><option value="one">Option one</option></Select>
    <Select validationStatus="warning" aria-label="Label" defaultValue="one"><option value="one">Option one</option></Select>
  </div>
);

export const SelectDisabled = () => <Select disabled aria-label="Label" defaultValue="one"><option value="one">Option one</option></Select>;

export const SelectFullWidth = () => <div style={{ inlineSize: 320 }}><Select fullWidth aria-label="Label" defaultValue="one"><option value="one">Option one</option><option value="two">Option two</option></Select></div>;

export const SelectGroups = () => (
  <Select aria-label="Label" defaultValue="one">
    <optgroup label="Group one"><option value="one">Option one</option><option value="two">Option two</option></optgroup>
    <optgroup label="Group two"><option value="three">Option three</option><option value="four">Option four</option></optgroup>
  </Select>
);

export const CheckboxDefault = () => <Checkbox label="Label" defaultChecked />;

export const CheckboxDescription = () => (
  <Checkbox
    label="Label"
    caption="Description"
    defaultChecked
  />
);

export const CheckboxLeadingVisual = () => (
  <Checkbox label="Label" leadingVisual={<CheckIcon />} />
);

export const CheckboxCard = () => (
  <Checkbox
    variant="card"
    label="Label"
    caption="Description"
    leadingVisual={<CheckIcon />}
  />
);

export const CheckboxInvalid = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "var(--area-space-16)" }}>
    <Checkbox label="Label" invalid />
    <Checkbox label="Label" defaultChecked invalid />
  </div>
);

export const CheckboxGroupDefault = () => (
  <CheckboxGroup label="Label" description="Description">
    <Checkbox name="notifications" value="one" label="Option one" defaultChecked />
    <Checkbox name="notifications" value="two" label="Option two" />
    <Checkbox name="notifications" value="three" label="Option three" />
  </CheckboxGroup>
);

export const CheckboxGroupInvalid = () => (
  <CheckboxGroup label="Label" error="Error message">
    <Checkbox name="desktop-items" value="one" label="Option one" />
    <Checkbox name="desktop-items" value="two" label="Option two" />
  </CheckboxGroup>
);

export const CheckboxGroupHorizontal = () => (
  <CheckboxGroup label="Label" orientation="horizontal">
    <Checkbox name="channels" value="one" label="Option one" />
    <Checkbox name="channels" value="two" label="Option two" />
    <Checkbox name="channels" value="three" label="Option three" />
  </CheckboxGroup>
);

export const CheckboxGroupSuccess = () => (
  <CheckboxGroup label="Label" validation="Success message" validationStatus="success">
    <Checkbox name="release-notes" value="one" label="Option one" defaultChecked />
    <Checkbox name="release-notes" value="two" label="Option two" defaultChecked />
  </CheckboxGroup>
);

export const CheckboxIndeterminate = () => <Checkbox label="Label" indeterminate />;

export const RadioDefault = () => (
  <RadioGroup label="Label" name="plan" defaultValue="one">
    <Radio value="one" label="Option one" />
    <Radio value="two" label="Option two" />
  </RadioGroup>
);

export const RadioHorizontal = () => (
  <RadioGroup label="Label" name="billing" defaultValue="one" orientation="horizontal">
    <Radio value="one" label="Option one" />
    <Radio value="two" label="Option two" />
  </RadioGroup>
);

export const RadioDescription = () => (
  <RadioGroup label="Label" name="visibility" defaultValue="one" description="Description">
    <Radio value="one" label="Option one" description="Description" />
    <Radio value="two" label="Option two" description="Description" />
  </RadioGroup>
);

export const RadioInvalid = () => (
  <RadioGroup label="Label" name="contact" error="Error message">
    <Radio value="one" label="Option one" />
    <Radio value="two" label="Option two" />
  </RadioGroup>
);



export const SliderDefault = () => <Slider aria-label="Label" min={0} max={12} defaultValue={8} readout />;

export const SliderSizes = () => (
  <>
    <Slider aria-label="Label" size="sm" min={0} max={100} defaultValue={25} readout={value => `${value}%`} />
    <Slider aria-label="Label" size="md" min={0} max={100} defaultValue={50} readout={value => `${value}%`} />
    <Slider aria-label="Label" size="lg" min={0} max={100} defaultValue={75} readout={value => `${value}%`} />
  </>
);

export const SliderTones = () => (
  <>
    <Slider aria-label="Label" tone="neutral" defaultValue={40} readout={value => `${value}%`} />
    <Slider aria-label="Label" tone="accent" defaultValue={70} readout={value => `${value}%`} />
  </>
);

export const SliderSteps = () => <Slider aria-label="Label" min={0.5} max={2} step={0.25} defaultValue={1} readout={value => `${value}×`} />;

export const SliderWithLabel = () => <Slider label="Label" labelPosition="top" defaultValue={50} readout={value => `${value}%`} />;

export const SliderLabelOnly = () => <Slider label="Label" labelPosition="top" defaultValue={50} />;

export const SliderStepMarks = () => <Slider aria-label="Label" min={0} max={5} step={1} defaultValue={1} stepMarks />;

export const SliderRangeWithInputs = () => <SliderRangeComposition />;

export const SliderVertical = () => <Slider aria-label="Label" orientation="vertical" defaultValue={50} style={{ ["--_vertical-length" as string]: "100%" }} />;

export const SliderDisabled = () => <Slider aria-label="Label" defaultValue={60} readout={value => `${value}%`} disabled />;

export const SliderBare = () => <Slider aria-label="Label" min={0} max={100} defaultValue={40} />;

export const ChipDefault = () => (
  <ChipGroup>
    <Chip defaultSelected>Item one</Chip>
    <Chip>Item two</Chip>
    <Chip>Item three</Chip>
    <Chip>Item four</Chip>
  </ChipGroup>
);

export const ChipControlled = () => {
  const [selected, setSelected] = useState(false);
  return <Chip selected={selected} onSelectedChange={setSelected}>Chip</Chip>;
};

export const ChipDisabled = () => <Chip disabled>Chip</Chip>;

export const ChipSwatches = () => (
  <ChipGroup>
    <Chip swatch="var(--area-red-500)">Red</Chip>
    <Chip swatch="var(--area-green-600)">Green</Chip>
    <Chip swatch="var(--area-indigo-500)">Indigo</Chip>
    <Chip swatch="var(--area-purple-500)">Purple</Chip>
  </ChipGroup>
);

export const ChipSizes = () => (
  <ChipGroup>
    <Chip size="sm">Small</Chip>
    <Chip size="md">Medium</Chip>
    <Chip size="lg">Large</Chip>
  </ChipGroup>
);

export const ChipVariants = () => (
  <ChipGroup>
    <Chip kind="assist" icon={<SearchIcon />}>Assist</Chip>
    <Chip icon={<CheckIcon />}>Filter</Chip>
    <Chip kind="input">Input</Chip>
    <Chip kind="suggestion">Suggestion</Chip>
  </ChipGroup>
);

export const ChipDeletable = () => {
  const [chips, setChips] = useState(["Item one", "Item two", "Item three"]);
  return <ChipGroup>{chips.map(chip => <Chip key={chip} kind="input" onRemove={() => setChips(current => current.filter(item => item !== chip))}>{chip}</Chip>)}</ChipGroup>;
};

export const ChipClickableDeletable = () => <Chip kind="input" clickable onClick={() => {}} onRemove={() => {}}>Chip</Chip>;

export const ChipLinkUnderline = () => <ChipLink href="#chip-api">Link</ChipLink>;

export const ChipLinkIcon = () => <ChipLink href="#chip-api" treatment="icon" trailingIcon={<OpenIcon />}>Link out</ChipLink>;

export const ChipCustomDelete = () => <Chip kind="input" onRemove={() => {}} removeIcon={<TrashIcon />} removeLabel="Delete">Chip</Chip>;

export const ChipAvatars = () => (
  <ChipGroup>
    <Chip avatar={<Avatar fallback="AV" alt="Avatar" />}>Avatar</Chip>
    <Chip avatar={<Avatar src="/images/chip-avatar.png" alt="Avatar" />}>Avatar</Chip>
  </ChipGroup>
);

export const ChipImageFilter = () => <Chip image="/images/chip-pixels.png" imageAlt="">Image</Chip>;

export const ChipInvalidInput = () => <Chip kind="input" invalid onRemove={() => {}}>Chip</Chip>;

export const CheckboxSizes = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "var(--area-space-16)" }}>
    {(["sm", "md", "lg"] as const).map((size) => (
      <Checkbox key={size} size={size} label={size} />
    ))}
  </div>
);

export const CheckboxStates = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "var(--area-space-16)" }}>
    <Checkbox label="Label" defaultChecked />
    <Checkbox label="Label" disabled />
    <Checkbox label="Label" defaultChecked disabled />
    <Checkbox label="Label" indeterminate disabled />
  </div>
);

export const RadioSizes = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "var(--area-space-16)" }}>
    {([["sm", "Small"], ["md", "Medium"], ["lg", "Large"]] as const).map(([size, label]) => (
      <Radio key={size} size={size} name={`radio-size-${size}`} value={size} label={label} />
    ))}
  </div>
);

export const RadioChecked = () => <Radio name="radio-state-checked" value="selected" label="Label" defaultChecked />;

export const RadioDisabled = () => <Radio name="radio-state-disabled" value="disabled" label="Label" disabled />;
