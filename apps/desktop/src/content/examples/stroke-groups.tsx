/**
 * Stroke groups (2026-10-30): every stroke group of axes/stroke-groups.ts in one cell each, real components at the
 * Canvas's settings, so each group's amount can be judged across the system at once (Testing › Stroke groups), and one
 * group's cell alone is its Foundations picture (`only`). Built from the review scene of the same day
 * (docs/research/control-edges-2026-10-27, "Groups by role"); the review's prototype rules are gone now the groups are
 * settings.
 */
import { createContext, useContext, type CSSProperties, type ReactNode } from "react";
import { AccordionItem, Alert, Avatar, Badge, Button, ButtonGroup, Card, CardContent, CardDescription, CardHeader, CardTitle, Checkbox, Chip, CodeBlock, ColorSwatch, Count, DescriptionList, DescriptionListItem, Dialog, Field, Input, Kbd, Menu, MenuItem, Meter, NumberField, Panel, PanelSection, Popover, PopoverDescription, PopoverHeader, PopoverTitle, Progress, Radio, RadioGroup, Segmented, Select, Separator, Slider, Switch, Table, Tag, Textarea, Toast, ToggleGroup, ToggleGroupItem } from "@area/react";
import { AddIcon, AlignCenterIcon, AlignLeftIcon, AlignRightIcon, CheckIcon, InfoIcon, MoreHorizontalIcon, SearchIcon, TokenIcon } from "@area/icons";

const row: CSSProperties = { display: "flex", flexWrap: "wrap", gap: "var(--area-space-8)", alignItems: "center" };
const nameStyle: CSSProperties = { font: "inherit", fontSize: "var(--area-text-xs-size, 11px)", color: "var(--area-fg-muted)", fontWeight: 500 };
const fit: CSSProperties = { inlineSize: "100%", maxInlineSize: "100%", minInlineSize: 0 };
const cell: CSSProperties = { display: "grid", gap: "var(--area-space-8)", alignContent: "start", minInlineSize: 0 };

/** The one group a sample shows (Foundations' picture of a group's setting), or every group. */
const Only = createContext<string | null>(null);

function Group({ id, name, children }: { id: string; name: string; children: ReactNode }) {
  const only = useContext(Only);
  if (only) return only === id ? <div style={cell}>{children}</div> : null;
  return (
    <div style={cell} data-group={id}>
      <span style={nameStyle}>{name}</span>
      {children}
    </div>
  );
}

export function StrokeLab({ style, only }: { style?: CSSProperties; only?: string }) {
  if (only) return <Only.Provider value={only}><div className="stroke-lab" style={{ inlineSize: "calc(var(--area-space-96) * 3)", maxInlineSize: "100%", ...style }}><LabCells /></div></Only.Provider>;
  const three: CSSProperties = { display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "var(--area-space-24) var(--area-space-20)", alignItems: "start", padding: "var(--area-space-32)", background: "var(--area-bg-page)", color: "var(--area-fg-default)" };
  return (
    <div className="stroke-lab" style={{ ...three, ...style }}>
      <LabCells />
    </div>
  );
}

/** Every group's cell, in the scene's order (a filler keeps Regions and Dividers under their columns). */
function LabCells() {
  const only = useContext(Only);
  return (
    <>
      <Group id="cards" name="Cards">
        <Card><CardHeader><CardTitle>Title</CardTitle><CardDescription>Description</CardDescription></CardHeader><CardContent><span className="area-text-muted">Body text</span></CardContent></Card>
      </Group>
      <Group id="fields" name="Fields">
        <Input variant="soft" placeholder="Placeholder" fullWidth />
        <Select variant="soft" aria-label="Label" defaultValue="one" fullWidth><option value="one">Item one</option><option value="two">Item two</option></Select>
        <NumberField variant="soft" aria-label="Label" defaultValue={240} unit="px" />
        <Textarea variant="soft" aria-label="Label" placeholder="Placeholder" rows={2} />
      </Group>
      <Group id="tags" name="Tags">
        <div style={row}><Badge variant="soft">Label</Badge><Count variant="soft" count={12} /><Kbd keys={["cmd", "K"]} /><Tag>Label</Tag></div>
      </Group>
      <Group id="blocks" name="Blocks">
        <CodeBlock size="sm" lineNumbers={false} code={"const title = \"Title\";"} />
        <Table aria-label="Items"><thead><tr><th>Name</th><th>Status</th></tr></thead><tbody><tr><td>Item one</td><td>Value</td></tr><tr><td>Item two</td><td>Value</td></tr></tbody></Table>
      </Group>
      <Group id="buttons" name="Buttons and toggles">
        <div style={row}><Button variant="soft" tone="neutral">Button</Button><Button variant="soft" tone="neutral" iconOnly icon={<MoreHorizontalIcon />} aria-label="More" /></div>
        <ButtonGroup variant="soft" aria-label="Items"><Button variant="soft" tone="neutral">Item one</Button><Button variant="soft" tone="neutral">Item two</Button></ButtonGroup>
        <Segmented defaultValue="a" items={[{ value: "a", label: "Item one" }, { value: "b", label: "Item two" }, { value: "c", label: "Item three" }]} />
        <ToggleGroup aria-label="Alignment" defaultValue={["left"]}><ToggleGroupItem value="left" iconOnly icon={<AlignLeftIcon />}>Left</ToggleGroupItem><ToggleGroupItem value="center" iconOnly icon={<AlignCenterIcon />}>Centre</ToggleGroupItem><ToggleGroupItem value="right" iconOnly icon={<AlignRightIcon />}>Right</ToggleGroupItem></ToggleGroup>
      </Group>
      <Group id="media" name="Media">
        <div style={row}><Avatar src="images/david-tee.jpg" fallback="DT" alt="David Tee" /><Avatar fallback="DT" alt="David Tee" /><ColorSwatch color="#ffffff" aria-label="White" /><ColorSwatch color="#f4f4f4" aria-label="Grey" /></div>
      </Group>
      <Group id="callouts" name="Callouts">
        <Alert icon={<InfoIcon />} title="Title" style={fit}>Body text</Alert>
      </Group>
      <Group id="options" name="Option rows and cards">
        <RadioGroup label={<span className="area-sr-only">Label</span>} defaultValue="one">
          <Radio variant="soft" layout="list" value="one" label="Option one" meta="Value" />
          <Radio variant="soft" layout="list" value="two" label="Option two" meta="Value" />
        </RadioGroup>
      </Group>
      <Group id="fixed" name="Never customizable">
        <div style={row}><Button variant="outline" tone="neutral">Outline</Button><Button>Solid</Button><Badge variant="outline">Label</Badge><Chip>Item one</Chip></div>
        <div style={row}><Checkbox label="Label" /><Checkbox label="Label" defaultChecked /></div>
      </Group>
      <Group id="floating" name="Floating">
        <Menu>
          <MenuItem icon={<SearchIcon />} shortcut={<Kbd keys={["cmd", "K"]} size="sm" />}>Item one</MenuItem>
          <MenuItem icon={<AddIcon />}>Item two</MenuItem>
          <div className="area-menu__separator" />
          <MenuItem icon={<TokenIcon />}>Item three</MenuItem>
        </Menu>
        <Toast tone="success" icon={<CheckIcon />} style={fit}>Body text</Toast>
        <Dialog role="group" aria-modal={undefined} showCloseButton={false} title="Title" description="Description" footer={<><Button variant="ghost">Cancel</Button><Button>Action</Button></>} style={fit} />
      </Group>
      <Group id="tracks" name="Tracks">
        <Slider aria-label="Label" min={0} max={100} defaultValue={40} />
        <div style={row}><Switch label="Label" /><Switch label="Label" defaultChecked /></div>
        <Progress value={62} label="Label" />
        <Meter value={40} label="Label" />
      </Group>
      {only ? null : <span />}
      <Group id="regions" name="Regions">
        <Panel size="sm" title="Label"><PanelSection heading="Section"><Field label="Label" orientation="auto"><Input size="sm" variant="soft" defaultValue="Value" /></Field></PanelSection></Panel>
      </Group>
      <Group id="dividers" name="Dividers">
        <DescriptionList aria-label="Items"><DescriptionListItem term="Label">Value</DescriptionListItem><DescriptionListItem term="Label">Value</DescriptionListItem></DescriptionList>
        <Separator />
        <div><AccordionItem heading="Title" defaultOpen>Body text</AccordionItem><AccordionItem heading="Title">Body text</AccordionItem></div>
      </Group>
    </>
  );
}

export function StrokeGroupsScreen() {
  return <StrokeLab />;
}
