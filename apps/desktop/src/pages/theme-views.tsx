/**
 * The Theme tab's Setup views (owner, 2026-10-20: "toggle through a few different views for each axis choice, which can
 * range from abstract ui, to isolated components, to bento gallery components, to ui examples"). Every option's card
 * draws one of them under that option's scope, over the picks made so far (the Canvas carries them):
 *
 *   abstract     the setting's own drawing (src/abstract.tsx), the one thing it moves, the others held still
 *   components   one sheet of the common controls, the same on every step, so each setting is seen on them all
 *   bento        a bento of small product cards (a profile, settings, a menu, a form, a list), each a real composition
 *   example      a whole screen, the Testing tab's analytics dashboard
 *
 * Each view is laid out at its own size and scaled whole to its card (abstract.tsx, Scaled), one zoom per view, so the
 * options of a step compare. Every drawing is shown, not used: the card is inert and hidden from assistive tech.
 */
import type { ReactNode } from "react";
import {
  Avatar, Badge, Button, Card, CardContent, CardDescription, CardTitle, Checkbox, Chip, Count, Field, Input, MenuItem,
  Nav, NavItem, Segmented, Switch,
} from "@area/react";
import { FolderIcon, HomeIcon, StarIcon } from "@area/icons";
import { Abstract, FILL, LoopingSwitch, Scaled } from "../abstract.tsx";
import { AnalyticsDashboard } from "../content/examples/analytics.tsx";

export type SetupView = "abstract" | "components" | "bento" | "example";
export const SETUP_VIEWS: ReadonlyArray<{ value: SetupView; label: string; min: number }> = [
  // A card's least width per view: the abstract drawings at the Browse view's 200; the larger views wider, so a sheet,
  // a bento and a whole screen stay readable (two or three cards a row in the Canvas).
  { value: "abstract", label: "Abstract", min: 200 }, /* pick */
  { value: "components", label: "Components", min: 280 }, /* pick */
  { value: "bento", label: "Bento", min: 300 }, /* pick */
  { value: "example", label: "Example", min: 320 }, /* pick */
];

const three = [{ value: "one", label: "One" }, { value: "two", label: "Two" }, { value: "three", label: "Three" }];

/** A menu's surface, drawn open: it floats, so Floating shadow and its levers show on it. */
const OpenMenu = () => (
  <div className="area-menu setup-menu" role="menu" aria-label="Menu">
    <MenuItem>Item one</MenuItem>
    <MenuItem>Item two</MenuItem>
    <MenuItem>Item three</MenuItem>
  </div>
);

/** A switch that flips by itself on the motion steps, so a duration or a curve plays; still everywhere else. */
const MaybeLooping = ({ moving }: { moving: boolean }) => moving ? <LoopingSwitch /> : <Switch label="Label" defaultChecked />;

/** The common controls on one sheet: actions, a field, choices, small marks, a card and a menu. */
function ComponentsSheet({ moving }: { moving: boolean }) {
  return (
    <div className="setup-sheet">
      <div className="setup-sheet__col">
        <div className="setup-row"><Button>Action</Button><Button variant="outline" tone="neutral">Cancel</Button></div>
        <Input aria-label="Label" placeholder="Placeholder" />
        <Segmented aria-label="Label" defaultValue="one" items={three} />
        <div className="setup-row"><Checkbox label="Option one" defaultChecked /><MaybeLooping moving={moving} /></div>
        <div className="setup-row"><Chip>Chip</Chip><Badge>Badge</Badge><Count count={8} /><Avatar fallback="DT" alt="David Tee" /></div>
      </div>
      <div className="setup-sheet__col">
        <Card size="sm" className="setup-card"><CardContent>
          <CardTitle>Title</CardTitle>
          <CardDescription>Description</CardDescription>
        </CardContent></Card>
        <OpenMenu />
      </div>
    </div>
  );
}

/** Small product cards in a bento: a person, settings, a menu, a form, a list, choices. */
function Bento({ moving }: { moving: boolean }) {
  return (
    <div className="setup-bento">
      <Card size="sm" className="setup-bento__cell"><CardContent>
        <div className="setup-row setup-row--start"><Avatar fallback="DT" alt="David Tee" /><span className="setup-strong">David Tee</span></div>
        <div className="setup-row setup-row--start"><Badge>Badge</Badge><Chip>Chip</Chip></div>
        <Button size="sm">Action</Button>
      </CardContent></Card>
      <Card size="sm" className="setup-bento__cell setup-bento__cell--tall"><CardContent>
        <CardTitle>Title</CardTitle>
        <Switch label="Option one" defaultChecked />
        <MaybeLooping moving={moving} />
        <Switch label="Option three" />
        <Checkbox label="Option four" defaultChecked />
      </CardContent></Card>
      <div className="setup-bento__cell setup-bento__cell--bare"><OpenMenu /></div>
      <Card size="sm" className="setup-bento__cell setup-bento__cell--wide"><CardContent>
        <Field label="Label"><Input fullWidth placeholder="Placeholder" /></Field>
        <div className="setup-row setup-row--end"><Button variant="outline" tone="neutral" size="sm">Cancel</Button><Button size="sm">Action</Button></div>
      </CardContent></Card>
      <Card size="sm" className="setup-bento__cell"><CardContent>
        <Nav aria-label="Items" className="setup-nav">
          <NavItem href="#one" current icon={<HomeIcon />}>Item one</NavItem>
          <NavItem href="#two" icon={<FolderIcon />}>Item two</NavItem>
          <NavItem href="#three" icon={<StarIcon />}>Item three</NavItem>
        </Nav>
      </CardContent></Card>
      <Card size="sm" className="setup-bento__cell setup-bento__cell--wide"><CardContent>
        <CardTitle>Title</CardTitle>
        <Segmented aria-label="Label" defaultValue="one" items={three} />
        <CardDescription>Description</CardDescription>
      </CardContent></Card>
    </div>
  );
}

/** One option's drawing in a view. `axis` and `preset` reach the abstract drawing, which shows the setting alone. */
export function SetupDrawing({ view, axis, preset }: { view: SetupView; axis: string; preset: string }): ReactNode {
  const moving = axis === "motion" || axis === "easing";
  switch (view) {
    case "components": return <Scaled fill={FILL.window} group="setup-components"><ComponentsSheet moving={moving} /></Scaled>;
    case "bento": return <Scaled fill={FILL.window} group="setup-bento"><Bento moving={moving} /></Scaled>;
    case "example": return <Scaled fill={0.94} group="setup-example"><div className="setup-example"><AnalyticsDashboard /></div></Scaled>;
    default: return <Abstract axis={axis} preset={preset} />;
  }
}
