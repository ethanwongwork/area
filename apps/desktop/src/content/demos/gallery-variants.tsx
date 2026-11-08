/** Gallery specimens that complete each family's variant coverage: one per missing manifest value. */
import { Alert, Badge, Button, Checkbox, CheckboxGroup, Chip, CodeBlock, Indicator, Input, InputGroup, InputGroupText, NumberField, Separator, Table, TableCell, TableHeaderCell, TableLink, Tabs, Toast } from "@area/react";
// @ts-expect-error — the docs' own highlighter is authored in JavaScript.
import { highlight } from "../highlight.mjs";
import { InfoIcon, SparkleIcon, WarningIcon } from "@area/icons";

const tableRows = ["Item one", "Item two", "Item three"];

export const GalleryTabsLarge = () => <Tabs size="lg" items={[{ value: "one", label: "Item one", content: "Body text" }, { value: "two", label: "Item two", content: "Body text" }]} />;

export const GalleryToastNeutral = () => <Toast icon={<InfoIcon />}>Body text</Toast>;

export const GalleryAlertInfo = () => <Alert tone="info" icon={<InfoIcon />} title="Title">Body text</Alert>;
export const GalleryAlertWarning = () => <Alert tone="warning" icon={<WarningIcon />} title="Title">Body text</Alert>;
/* Caution and discovery, Button's and Badge's seven tones (components audit 2026-11-07, O4). */
export const GalleryAlertCaution = () => <Alert tone="caution" icon={<WarningIcon />} title="Title">Body text</Alert>;
export const GalleryAlertDiscovery = () => <Alert tone="discovery" icon={<SparkleIcon />} title="Title">Body text</Alert>;
export const GalleryToastCaution = () => <Toast tone="caution" icon={<WarningIcon />}>Body text</Toast>;
export const GalleryToastDiscovery = () => <Toast tone="discovery" icon={<SparkleIcon />}>Body text</Toast>;

/* Figma's inspector fields: a letter in the leading slot that also drags the value. */
export const GalleryNumberFieldPrefix = () => (
  <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "var(--area-space-8)", inlineSize: "calc(var(--area-space-96) * 2 + var(--area-space-16))" }}>
    <NumberField fullWidth variant="soft" scrub="X" aria-label="X" defaultValue={24} />
    <NumberField fullWidth variant="soft" scrub="Y" aria-label="Y" defaultValue={48} />
  </div>
);

export const GalleryInputGroupSizeSm = () => (
  <InputGroup size="sm" aria-label="Label"><InputGroupText aria-hidden="true">$</InputGroupText><Input aria-label="Value" defaultValue="24.00" inputMode="decimal" /></InputGroup>
);
export const GalleryInputGroupSizeMd = () => (
  <InputGroup size="md" aria-label="Label"><InputGroupText aria-hidden="true">$</InputGroupText><Input aria-label="Value" defaultValue="24.00" inputMode="decimal" /></InputGroup>
);
export const GalleryInputGroupSizeLg = () => (
  <InputGroup size="lg" aria-label="Label"><InputGroupText aria-hidden="true">$</InputGroupText><Input aria-label="Value" defaultValue="24.00" inputMode="decimal" /></InputGroup>
);


const tableBody = (interactive = false) => (
  <tbody>{tableRows.map((name, index) => <tr key={name}><td>{interactive ? <TableLink href="#gallery-section-table">{name}</TableLink> : name}</td><td><Badge dot tone="success">Status</Badge></td><TableCell numeric>{index + 1}</TableCell></tr>)}</tbody>
);
const tableHead = <thead><tr><th scope="col">Name</th><th scope="col">Status</th><TableHeaderCell numeric>Value</TableHeaderCell></tr></thead>;
export const GalleryTableLarge = () => <Table size="lg" aria-label="Table">{tableHead}{tableBody()}</Table>;
export const GalleryTableInteractive = () => <Table interactive aria-label="Table">{tableHead}{tableBody(true)}</Table>;
// Fixed: term / value rows whose first column is the label column, so tables stacked in one feed line up.
export const GalleryTableFixed = () => (
  <Table layout="fixed" aria-label="Table">
    <tbody>
      <tr><td>Name</td><td>Item one</td></tr>
      <tr><td>Status</td><td><Badge dot tone="success">Status</Badge></td></tr>
      <tr><td>Value</td><td>1</td></tr>
    </tbody>
  </Table>
);

export const GallerySeparatorSpacing = () => (
  <div style={{ inlineSize: "calc(var(--area-space-96) * 2)" }}>
    <p style={{ margin: 0 }}>Body text</p>
    <Separator spacing="normal" />
    <p style={{ margin: 0 }}>Body text</p>
  </div>
);

export const GalleryIndicatorWarning = () => <Indicator count={3} tone="warning" />;
export const GalleryIndicatorCaution = () => <Indicator count={3} tone="caution" />;
export const GalleryIndicatorDiscovery = () => <Indicator count={3} tone="discovery" />;

export const GalleryChipSwatchOnly = () => <Chip swatchOnly swatch="var(--area-indigo-500)" aria-label="Indigo" />;

export const GalleryCheckboxGroupHorizontal = () => (
  <CheckboxGroup label="Label" orientation="horizontal">
    <Checkbox name="gallery-horizontal" value="one" label="Option one" defaultChecked />
    <Checkbox name="gallery-horizontal" value="two" label="Option two" />
    <Checkbox name="gallery-horizontal" value="three" label="Option three" />
  </CheckboxGroup>
);

/* Flush: source under a rendered preview; the container owns the edge and radius. */
export const GalleryCodeBlockFlush = () => (
  <div style={{ inlineSize: "100%", overflow: "hidden", border: "var(--area-border-width) solid var(--area-border-decorative)", borderRadius: "var(--area-radius-container)", background: "var(--area-bg-surface)" }}>
    <div style={{ display: "flex", justifyContent: "center", padding: "var(--area-space-24)" }}><Button>Button</Button></div>
    <CodeBlock flush style={{ inlineSize: "100%" }} html={highlight('<Button>Button</Button>')} />
  </div>
);
