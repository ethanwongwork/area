/* Compositions: a grid of 4 to 6 similarly sized components that together show one theme setting, to be used as that
   setting's visual (owner, 2026-10-24: "grid compositions with 4 to 6 similarly sized components that show a specific
   thing, like for accent color ... or for strokes"; then: no containers, keep the Status one's shape). Each is two
   columns of parts the same width (200), no cells or frames around them, in the vignette frame (480 × 360); the
   page's controls (Theme, Neutral, Accent) reach every one. Copy follows the placeholder vocabulary. */
import { Alert, Badge, Button, Checkbox, Input, Progress, Radio, RadioGroup, Segmented, Select, Slider, Switch } from "@area/react";
import { AddIcon, CheckIcon, InfoIcon, WarningIcon } from "@area/icons";

const W = 200;
const Frame = ({ children }) => <div className="sx-iso" style={{ width: 480, height: 360 }}><div className="sx-comp">{children}</div></div>;
const Line = ({ children }) => <div className="sx-comp__line">{children}</div>;
const Accent = ({ children }) => <div data-area-action="accent" style={{ display: "contents" }}>{children}</div>;
const three = [{ value: "one", label: "One" }, { value: "two", label: "Two" }, { value: "three", label: "Three" }];
const Radios = ({ value }) => <RadioGroup aria-label="Label" defaultValue={value} orientation="horizontal"><Radio value="one" label="Item one" /><Radio value="two" label="Item two" /></RadioGroup>;
const Checks = ({ on }) => <Line><Checkbox label="Item one" defaultChecked={on} /><Checkbox label="Item two" defaultChecked={on} /></Line>;

/* Accent: every part it paints, the accent action, a switch, checks, a radio, a slider and progress. */
const AccentSet = () => (
  <Frame>
    <Accent><Button icon={<AddIcon />} fullWidth>Button</Button></Accent>
    <Line><span>Label</span><Switch aria-label="Label" defaultChecked /></Line>
    <Checks on />
    <Radios value="one" />
    <Slider aria-label="Label" defaultValue={60} style={{ width: W }} />
    <Progress value={60} aria-label="Label" style={{ width: W }} />
  </Frame>
);
/* Strokes (Stroke strength, Stroke width): what a stroke draws, fields, an outline button, outline badges, empty checks and radios. */
const StrokeSet = () => (
  <Frame>
    <Input placeholder="Placeholder" style={{ width: W }} />
    <Select aria-label="Label" defaultValue="one" style={{ width: W }}><option value="one">Item one</option></Select>
    <Button variant="outline" fullWidth>Button</Button>
    <Line><Badge variant="outline">Badge</Badge><Badge variant="outline">Badge</Badge><Badge variant="outline">Badge</Badge></Line>
    <Checks on={false} />
    <Radios value="" />
  </Frame>
);
/* Corners (Radius): the shapes it rounds, a button, a field, a select and a segmented control. */
const CornerSet = () => (
  <Frame>
    <Button variant="outline" fullWidth>Button</Button>
    <Input placeholder="Placeholder" style={{ width: W }} />
    <Segmented aria-label="Label" defaultValue="one" items={three} style={{ width: W }} fullWidth />
    <Select aria-label="Label" defaultValue="one" style={{ width: W }}><option value="one">Item one</option></Select>
  </Frame>
);
/* States (hover, press, focus): one button through rest, hover, pressed and focus, a focused field, and disabled. */
const StateSet = () => (
  <Frame>
    <Button variant="outline" fullWidth>Button</Button>
    <Button variant="outline" fullWidth className="st-hover" data-af-pointer="">Button</Button>
    <Button variant="outline" fullWidth className="st-press" data-af-pointer="">Button</Button>
    <Button variant="outline" fullWidth className="st-focus">Button</Button>
    <Input placeholder="Placeholder" className="st-focus-field" style={{ width: W }} />
    <Button variant="outline" fullWidth disabled>Button</Button>
  </Frame>
);
/* Status colours: information, success, warning, danger, on one component. */
const StatusSet = () => (
  <Frame>
    <Alert icon={<InfoIcon />} title="Title" style={{ width: W }}>Body text</Alert>
    <Alert tone="success" icon={<CheckIcon />} title="Title" style={{ width: W }}>Body text</Alert>
    <Alert tone="warning" icon={<WarningIcon />} title="Title" style={{ width: W }}>Body text</Alert>
    <Alert tone="danger" icon={<WarningIcon />} title="Title" style={{ width: W }}>Body text</Alert>
  </Frame>
);

export const COMPOSITIONS = {
  accent: ["Accent", "Every part the accent paints.", AccentSet],
  strokes: ["Strokes", "What Stroke strength and width draw.", StrokeSet],
  corners: ["Corners", "What Radius rounds.", CornerSet],
  states: ["States", "Rest, hover, pressed, focus, disabled.", StateSet],
  status: ["Status", "Information, success, warning, danger.", StatusSet],
};
