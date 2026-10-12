/** Gallery specimens that complete each family's variant coverage: one per missing manifest value. */
import { Alert, Badge, Button, Checkbox, CheckboxGroup, Chip, CodeBlock, Indicator, Input, InputGroup, InputGroupText, NumberField, Separator, Table, TableLink, Tabs, Toast } from "@area/react";
import { InfoIcon, AlertIcon } from "../../../../docs/src/icons.tsx";
// @ts-expect-error — the docs' own highlighter is authored in JavaScript.
import { highlight } from "../highlight.mjs";

const tableRows = ["Item one", "Item two", "Item three"];

export const GalleryTabsLarge = () => <Tabs size="lg" items={[{ id: "one", label: "Item one", content: "Body text" }, { id: "two", label: "Item two", content: "Body text" }]} />;

export const GalleryToastNeutral = () => <Toast icon={<InfoIcon />}>Body text</Toast>;

export const GalleryAlertInfo = () => <Alert tone="info" icon={<InfoIcon />} title="Title">Body text</Alert>;
export const GalleryAlertWarning = () => <Alert tone="warning" icon={<AlertIcon />} title="Title">Body text</Alert>;

/* Figma's inspector fields: a letter in the leading slot that also drags the value. */
export const GalleryNumberFieldPrefix = () => (
  <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "var(--area-space-8)", inlineSize: "calc(var(--area-space-96) * 2 + var(--area-space-16))" }}>
    <NumberField fullWidth variant="soft" scrub="X" aria-label="X" defaultValue={24} />
    <NumberField fullWidth variant="soft" scrub="Y" aria-label="Y" defaultValue={48} />
  </div>
);

export const GalleryInputGroupSizeSm = () => (
  <InputGroup size="sm" aria-label="Price"><InputGroupText aria-hidden="true">$</InputGroupText><Input aria-label="Amount" defaultValue="24.00" inputMode="decimal" /></InputGroup>
);
export const GalleryInputGroupSizeMd = () => (
  <InputGroup size="md" aria-label="Price"><InputGroupText aria-hidden="true">$</InputGroupText><Input aria-label="Amount" defaultValue="24.00" inputMode="decimal" /></InputGroup>
);
export const GalleryInputGroupSizeLg = () => (
  <InputGroup size="lg" aria-label="Price"><InputGroupText aria-hidden="true">$</InputGroupText><Input aria-label="Amount" defaultValue="24.00" inputMode="decimal" /></InputGroup>
);


const tableBody = (interactive = false) => (
  <tbody>{tableRows.map((name, index) => <tr key={name}><td>{interactive ? <TableLink href="#gallery-section-table">{name}</TableLink> : name}</td><td><Badge dot tone="success">Status</Badge></td><td className="area-table__cell--numeric">{index + 1}</td></tr>)}</tbody>
);
const tableHead = <thead><tr><th scope="col">Name</th><th scope="col">Status</th><th scope="col" className="area-table__cell--numeric">Value</th></tr></thead>;
export const GalleryTableLarge = () => <Table size="lg" aria-label="Table">{tableHead}{tableBody()}</Table>;
export const GalleryTableInteractive = () => <Table interactive aria-label="Table">{tableHead}{tableBody(true)}</Table>;

export const GallerySeparatorSpacing = () => (
  <div style={{ inlineSize: "calc(var(--area-space-96) * 2)" }}>
    <p style={{ margin: 0 }}>Body text</p>
    <Separator spacing="normal" />
    <p style={{ margin: 0 }}>Body text</p>
  </div>
);

export const GalleryIndicatorWarning = () => <Indicator count={3} tone="warning" />;

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
