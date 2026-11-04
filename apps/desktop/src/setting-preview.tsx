/**
 * The Playground's tiles (src/pages/themes.tsx; owner, 2026-10-30: "its still not very clear sometimes what im actually
 * changing ... a small ui, a card, or something that is zoomed in"; then "the 1x 2x zoom level of detail of real components
 * that i would get from the component review artifacts. maybe its just 1 component, maybe its a few but they are each in
 * their own container like a bento style"). Per setting, the components it changes, one per tile (its name over its own
 * canvas on the theme's page), at 1× or 2× as the component review page shows them: the specimen is zoomed, not its tile,
 * so text and half-pixel lines are drawn at the zoom. Real components, usable; a state a tile cannot hold (hover, focus,
 * press) is painted on, as the Theme illustrations paint it (src/abstract.tsx).
 */
import type { ReactNode } from "react";
import {
  Alert, Avatar, Badge, Button, ButtonGroup, Card, CardContent, CardDescription, CardHeader, CardTitle, Checkbox, Chip, CodeBlock,
  ColorSwatch, Count, Input, Kbd, Menu, MenuItem, Meter, Nav, NavItem, Progress, Radio, RadioGroup, Segmented, Select,
  Slider, Switch, Table, Tag, Textarea, Toast, ToggleGroup, ToggleGroupItem,
} from "@area/react";
import { AddIcon, AlignCenterIcon, AlignLeftIcon, AlignRightIcon, CheckIcon, FolderIcon, HomeIcon, InfoIcon, SearchIcon, StarIcon } from "@area/icons";
import { GALLERY_CONTROLS } from "./gallery/controls.ts";
import { SettingSubject } from "./abstract.tsx";

/** Names for the rows that stand for several settings. */
const NAMES: Record<string, string> = { neutral: "Greys", material: "Material", "ground-light": "Page color", "ground-dark": "Page color" };
export const settingName = (setting: string) => NAMES[setting] ?? GALLERY_CONTROLS.find(entry => entry.axis === setting)?.label ?? setting;

/*
 * The tiles: each one component (or one component in its states) with the placeholder copy. `wide` spans two columns at 1×.
 */
interface Tile { name: string; node: () => ReactNode; width?: number; wide?: boolean }
/** A tile; `width` is the specimen's width where the component fills its container (a card, a menu, a track), which also
 *  makes the tile span the row at 1×. */
const tile = (name: string, node: () => ReactNode, width?: number): Tile => ({ name, node, width });
const T = {
  button: tile("Button", () => <Button>Button</Button>),
  soft: tile("Soft button", () => <Button variant="soft" tone="neutral">Button</Button>),
  outline: tile("Outline button", () => <Button variant="outline" tone="neutral">Button</Button>),
  group: tile("Button group", () => <ButtonGroup variant="soft" aria-label="Items"><Button variant="soft" tone="neutral">Item one</Button><Button variant="soft" tone="neutral">Item two</Button></ButtonGroup>),
  input: tile("Input", () => <Input aria-label="Label" placeholder="Placeholder" />),
  softInput: tile("Soft input", () => <Input variant="soft" aria-label="Label" placeholder="Placeholder" />),
  select: tile("Select", () => <Select variant="soft" aria-label="Label" defaultValue="one"><option value="one">Item one</option><option value="two">Item two</option></Select>),
  textarea: tile("Text area", () => <Textarea variant="soft" aria-label="Label" placeholder="Placeholder" rows={2} />),
  card: tile("Card", () => <Card><CardHeader><CardTitle>Title</CardTitle><CardDescription>Description</CardDescription></CardHeader><CardContent>Body text</CardContent></Card>, 192),
  menu: tile("Menu", () => (
    <Menu>
      <MenuItem icon={<SearchIcon />} shortcut={<Kbd keys={["cmd", "K"]} size="sm" />}>Item one</MenuItem>
      <MenuItem icon={<AddIcon />}>Item two</MenuItem>
      <MenuItem icon={<StarIcon />}>Item three</MenuItem>
    </Menu>
  ), 192),
  nav: tile("Nav", () => (
    <Nav aria-label="Items">
      <NavItem href="#one" current icon={<HomeIcon />}>Item one</NavItem>
      <NavItem href="#two" icon={<FolderIcon />}>Item two</NavItem>
    </Nav>
  ), 176),
  options: tile("Option rows", () => (
    <RadioGroup label={<span className="area-sr-only">Label</span>} defaultValue="one">
      <Radio variant="soft" layout="list" value="one" label="Option one" meta="Value" />
      <Radio variant="soft" layout="list" value="two" label="Option two" meta="Value" />
    </RadioGroup>
  ), 192),
  checkbox: tile("Checkbox", () => <Checkbox label="Label" defaultChecked />),
  switch: tile("Switch", () => <Switch label="Label" defaultChecked />),
  segmented: tile("Segmented", () => <Segmented aria-label="Label" defaultValue="one" items={[{ value: "one", label: "Item one" }, { value: "two", label: "Item two" }]} />),
  toggles: tile("Toggle group", () => <ToggleGroup aria-label="Alignment" defaultValue={["left"]}><ToggleGroupItem value="left" iconOnly icon={<AlignLeftIcon />}>Left</ToggleGroupItem><ToggleGroupItem value="center" iconOnly icon={<AlignCenterIcon />}>Centre</ToggleGroupItem><ToggleGroupItem value="right" iconOnly icon={<AlignRightIcon />}>Right</ToggleGroupItem></ToggleGroup>),
  slider: tile("Slider", () => <Slider aria-label="Label" min={0} max={100} defaultValue={40} />, 160),
  progress: tile("Progress", () => <Progress value={62} label="Label" />, 160),
  meter: tile("Meter", () => <Meter value={40} label="Label" />, 160),
  meterParts: tile("Stacked meter", () => <Meter label="Label" segments={[{ label: "Label", value: 6 }, { label: "Label", value: 4 }, { label: "Label", value: 3 }, { label: "Label", value: 2 }]} />, 200),
  badge: tile("Badge", () => <Badge variant="soft">Label</Badge>),
  status: tile("Status badges", () => <div className="studio-preview__row"><Badge tone="danger" variant="solid">Failed</Badge><Badge tone="warning" variant="solid">Due</Badge><Badge tone="success" variant="solid">Done</Badge></div>),
  tones: tile("Tone badges", () => <div className="studio-preview__row"><Badge tone="caution">Pending</Badge><Badge tone="warning">Due</Badge><Badge tone="success">Done</Badge></div>),
  chip: tile("Chip", () => <Chip>Item one</Chip>),
  count: tile("Count", () => <Count count={12} />),
  kbd: tile("Keys", () => <Kbd keys={["cmd", "K"]} />),
  tag: tile("Tag", () => <Tag>Label</Tag>),
  avatar: tile("Avatar", () => <Avatar fallback="DT" alt="David Tee" />),
  swatch: tile("Swatch", () => <div className="studio-preview__row"><ColorSwatch color="#ffffff" aria-label="White" /><ColorSwatch color="#f4f4f4" aria-label="Grey" /></div>),
  alert: tile("Alert", () => <Alert icon={<InfoIcon />} title="Title">Body text</Alert>, 192),
  toast: tile("Toast", () => <Toast tone="success" icon={<CheckIcon />}>Body text</Toast>, 192),
  code: tile("Code block", () => <CodeBlock size="sm" lineNumbers={false} code={"const title = \"Title\";"} />, 192),
  table: tile("Table", () => <Table aria-label="Items"><thead><tr><th>Name</th><th>Status</th></tr></thead><tbody><tr><td>Item one</td><td>Value</td></tr><tr><td>Item two</td><td>Value</td></tr></tbody></Table>, 192),
} satisfies Record<string, Tile>;
/** A setting's own Theme illustration as one tile (a window's layers, the type ramp, a state painted on). */
const drawn = (name: string, axis: string, wide = true): Tile => ({ ...tile(name, () => <SettingSubject axis={axis} />), wide });

const PAGE = [drawn("Window", "neutral"), T.card, T.softInput, T.nav];
const SHADOWED = [T.menu, T.toast, T.card];
const TILES: Record<string, Tile[]> = {
  theme: PAGE, neutral: PAGE, "tint-hue": PAGE, "tint-hue-dark": PAGE, "tint-light": PAGE, "tint-dark": PAGE, "ground-light": PAGE, "ground-dark": PAGE, "layers-light": PAGE, "layers-dark": PAGE,
  "card-tone-light": [T.card, drawn("Window", "neutral")], "card-tone-dark": [T.card, drawn("Window", "neutral")],
  "ink-tint": [T.card, T.nav, T.input],
  accent: [T.button, T.checkbox, T.switch, T.slider, T.progress, T.options],
  "accent-strength": [T.button, T.checkbox, T.switch, T.progress],
  "solid-light": [T.button, T.checkbox, T.switch], "solid-dark": [T.button, T.checkbox, T.switch], "label-tint": [T.button],
  action: [T.button, T.soft, T.outline],
  selection: [T.checkbox, T.switch, T.options, T.segmented, T.nav],
  "status-colours": [T.status, T.alert, T.toast],
  "tone-tint": [T.tones, T.alert],
  "tone-contrast": [T.tones, T.alert],
  "series-lightness": [T.meterParts],
  contrast: [T.input, T.checkbox, T.outline, T.card],
  type: [drawn("Type", "type"), T.button, T.input, T.menu],
  density: [T.menu, T.nav, T.button, T.input, T.options],
  radius: [T.button, T.input, T.segmented, T.badge, T.card, T.options],
  pills: [T.button, T.chip, T.badge, T.count, T.switch, T.avatar],
  surface: [T.card, T.input, T.menu],
  stroke: [T.card, T.softInput, T.soft, T.options, T.table],
  "stroke-cards": [T.card], "stroke-blocks": [T.code, T.table], "stroke-callouts": [T.alert],
  "stroke-floating": [T.menu, T.toast], "stroke-regions": [drawn("Window", "neutral")], "stroke-dividers": [T.table, T.menu],
  "stroke-fields": [T.softInput, T.select, T.textarea], "stroke-buttons": [T.soft, T.group, T.segmented, T.toggles],
  "stroke-options": [T.options], "stroke-tracks": [T.slider, T.switch, T.progress, T.meter],
  "stroke-tags": [T.badge, T.count, T.kbd, T.tag], "stroke-media": [T.avatar, T.swatch],
  elevation: SHADOWED, "shadow-size": SHADOWED, "shadow-softness": SHADOWED, "shadow-light": SHADOWED, "shadow-color": SHADOWED,
  "shadow-rest": [T.card, T.outline], "shadow-resting": [T.card, T.soft], "shadow-field": [T.input, T.select],
  "stroke-hover": [drawn("Field, at rest and hovered", "stroke-hover")],
  "selected-stroke": [drawn("Selected card", "selected-stroke"), T.options], "selected-tint": [drawn("Selected card", "selected-tint"), T.options],
  "focus-ring": [drawn("Focused", "focus-ring")], "shadow-hover": [drawn("Hovered card", "shadow-hover")],
  "fill-hover": [drawn("Menu rows hovered, selected, pressed", "fill-hover"), T.nav],
  "fill-selected": [drawn("Menu rows hovered, selected, pressed", "fill-selected"), T.nav, T.segmented],
  "fill-pressed": [drawn("Menu rows hovered, selected, pressed", "fill-pressed"), T.button],
  "danger-hover": [drawn("Delete, hovered", "danger-hover")],
  motion: [drawn("Switch", "motion", false), T.segmented, T.checkbox], easing: [drawn("Switch", "easing", false), T.segmented],
  feedback: [drawn("Press", "feedback", false), T.button],
  material: [T.card, T.menu],
};

/** The component a setting is pictured by on a choice card (src/choice-visuals.tsx): its first tile. */
export function SettingSpecimen({ setting }: { setting: string }) {
  const first = (TILES[setting] ?? [T.button])[0]!;
  return <div className="studio-preview__specimen" style={first.width ? { inlineSize: first.width } : undefined}>{first.node()}</div>;
}

/** A setting's hint, as its row says it. */
export const settingHint = (setting: string) => GALLERY_CONTROLS.find(entry => entry.axis === setting)?.hint;

/** The bento: `setting`'s tiles in `scope` at `zoom` (the whole screen is the Playground's showcase, src/pages/themes.tsx). */
export function Playground({ setting, zoom, scope, values }: {
  setting: string; zoom: "1" | "2"; scope: Record<string, string | undefined>; values: Readonly<Record<string, string>>;
}) {
  const tiles = TILES[setting] ?? [T.button];
  return (
    <div className="studio-preview" data-zoom={zoom} {...scope}>
      {tiles.map(entry => (
        <figure key={entry.name} className="studio-preview__tile" data-wide={entry.wide || (entry.width ?? 0) >= 192 ? "" : undefined}>
          <figcaption className="studio-preview__name">{entry.name}</figcaption>
          <div className="studio-preview__canvas">
            <div className="studio-preview__specimen" style={entry.width ? { inlineSize: entry.width } : undefined}>
              {entry.name === "Type" ? <SettingSubject axis="type" preset={values.type} /> : entry.node()}
            </div>
          </div>
        </figure>
      ))}
    </div>
  );
}
