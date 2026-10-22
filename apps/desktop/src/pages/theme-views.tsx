/**
 * The Theme tab's Setup views (owner, 2026-10-20: "toggle through a few different views for each axis choice, which can
 * range from abstract ui, to isolated components, to bento gallery components, to ui examples"; 2026-10-21: "we need to
 * improve the visuals that are used to make these choices, the bento, individual components, the sample ui (both
 * desktop and mobile)"). The stage draws one of them under the option shown, over the picks made so far:
 *
 *   bento        product cards after the owner's references (a schedule, a day's tasks, a format panel, choices as
 *                cards, settings, steps, a person), each a real composition at true scale
 *   desktop      a whole desktop screen, the Testing tab's analytics dashboard
 *   mobile       a phone's Today screen at 390 (content/examples/mobile.tsx)
 *   abstract     a choice's close-up: the setting alone (src/abstract.tsx), not a stage view
 *
 * Each view is laid out at its own size and scaled whole to its frame (abstract.tsx, Scaled), never past true scale.
 * Every drawing is shown, not used: it is inert and hidden from assistive tech.
 */
import type { ReactNode } from "react";
import {
  Avatar, Badge, Button, Card, CardContent, CardDescription, CardTitle, Checkbox, Chip, ColorSwatchPicker, Count, Field,
  Input, Kbd, MenuItem, NumberField, Progress, Radio, RadioGroup, Segmented, Select, Slider, SliderRange, Stepper,
  StepperStep, Switch, Tag, Timeline, TimelineItem, ToggleGroup, ToggleGroupItem,
} from "@area/react";
import { MoreHorizontalIcon } from "@area/icons";
import { Abstract, FILL, LoopingSwitch, Scaled } from "../abstract.tsx";
import { AnalyticsDashboard } from "../content/examples/analytics.tsx";
import { MobileScreen } from "../content/examples/mobile.tsx";

export type SetupView = "abstract" | "bento" | "desktop" | "mobile";
/**
 * The stage's views (owner, 2026-10-21, after a product finder's flow: one large stage that answers each pick, the
 * choices under it): the stage draws one of these with the option under the pointer, or the pick.
 */
export const SETUP_VIEWS: ReadonlyArray<{ value: Exclude<SetupView, "abstract">; label: string }> = [
  { value: "bento", label: "Bento" },
  { value: "desktop", label: "Desktop" },
  { value: "mobile", label: "Mobile" },
];

const three = [{ value: "one", label: "One" }, { value: "two", label: "Two" }, { value: "three", label: "Three" }];
const seven = ["One", "Two", "Three", "Four", "Five", "Six", "Seven"];
const swatches = [
  { value: "#171717", label: "Black" }, { value: "#2563EB", label: "Blue" }, { value: "#16A34A", label: "Green" },
  { value: "#DC2626", label: "Red" }, { value: "#F59E0B", label: "Amber" }, { value: "#7C3AED", label: "Purple" },
];

/** A switch that flips by itself on the motion steps, so a duration or a curve plays; still everywhere else. */
const MaybeLooping = ({ moving }: { moving: boolean }) => moving ? <LoopingSwitch /> : <Switch label="Label" defaultChecked />;

/**
 * Small product cards after the owner's references, each a real composition at true scale, three columns so the bento
 * fills the visual's tall frame beside the panel.
 */
function Bento({ moving }: { moving: boolean }) {
  return (
    <div className="setup-bento">
      {/* A schedule: days as toggles, a range of hours (the Work Time reference). */}
      <Card size="sm" className="setup-bento__cell setup-bento__cell--wide"><CardContent>
        <CardTitle>Title</CardTitle>
        <ToggleGroup aria-label="Label" defaultValue={["2", "3", "5"]}>{["1", "2", "3", "4", "5", "6", "7"].map(day => <ToggleGroupItem key={day} value={day}>{day}</ToggleGroupItem>)}</ToggleGroup>
        <SliderRange defaultValue={[30, 80]} inputs={false} minLabel="Label start" maxLabel="Label end" />
      </CardContent></Card>
      {/* A person and their actions. */}
      <Card size="sm" className="setup-bento__cell"><CardContent>
        <div className="setup-row setup-row--start"><Avatar fallback="DT" alt="David Tee" /><span className="setup-strong">David Tee</span></div>
        <div className="setup-row setup-row--start"><Badge>Badge</Badge><Chip>Chip</Chip></div>
        <Button size="sm">Action</Button>
      </CardContent></Card>
      {/* A format panel: options, colours and a number (the Format reference). */}
      <Card size="sm" className="setup-bento__cell"><CardContent>
        <Segmented aria-label="Label" size="sm" defaultValue="one" items={three} />
        <ColorSwatchPicker label="Label" size="sm" layout="row" defaultValue="#2563EB" items={swatches} />
        <NumberField size="sm" aria-label="Label" defaultValue={12} />
      </CardContent></Card>
      {/* A day's tasks on a timeline (the Today reference). */}
      <Card size="sm" className="setup-bento__cell"><CardContent>
        <Timeline aria-label="Label">
          <TimelineItem title="Item one" meta="David Tee" time="10m ago" dateTime="2026-10-21T10:00" />
          <TimelineItem title="Item two" meta="David Tee" time="2h ago" dateTime="2026-10-21T08:00" />
        </Timeline>
        <Checkbox label="Option one" defaultChecked />
      </CardContent></Card>
      {/* Choices as cards (the Presets and Select Interface references). */}
      <div className="setup-bento__cell setup-bento__cell--bare">
        <RadioGroup label="Label" name="setup-bento-radio" defaultValue="one" className="setup-bento__radios">
          <Radio variant="card" value="one" label="Option one" caption="Description" />
          <Radio variant="card" value="two" label="Option two" caption="Description" />
        </RadioGroup>
      </div>
      {/* Settings: switches and a field. */}
      <Card size="sm" className="setup-bento__cell"><CardContent>
        <MaybeLooping moving={moving} />
        <Switch label="Option two" />
        <Input size="sm" fullWidth aria-label="Label" placeholder="Placeholder" />
      </CardContent></Card>
      {/* Steps (the Assembly steps reference). */}
      <Card size="sm" className="setup-bento__cell"><CardContent>
        <Stepper current={1} orientation="vertical" aria-label="Label">
          <StepperStep title="Item one" />
          <StepperStep title="Item two" />
          <StepperStep title="Item three" />
        </Stepper>
      </CardContent></Card>
    </div>
  );
}

/** One option's drawing in a view. `axis` and `preset` reach the abstract drawing, which shows the setting alone. */
export function SetupDrawing({ view, axis, preset }: { view: SetupView; axis: string; preset: string }): ReactNode {
  const moving = axis === "motion" || axis === "easing";
  switch (view) {
    // The stage's views at true scale where they fit (owner: read at true scale), shrunk only to fit the stage.
    case "bento": return <Scaled fill={FILL.window} max={1} group="setup-bento"><Bento moving={moving} /></Scaled>;
    case "desktop": return <Scaled fill={0.94} max={1} group="setup-desktop"><div className="setup-example"><AnalyticsDashboard /></div></Scaled>;
    case "mobile": return <Scaled fill={0.94} max={1} group="setup-mobile"><MobileScreen /></Scaled>;
    default: return <Abstract axis={axis} preset={preset} />;
  }
}
