/**
 * Area: the desktop app itself as a sample screen (owner, 2026-10-30: "for the sample ui, can you make it a variation of the
 * area electron app itself?"), so Settings › Theme's preview shows a theme on the app it is made in. Its three regions,
 * each with its own header, as the app draws them (src/studio.tsx): the Sidebar on the recessed ground (the window's
 * lights, its toggle, search, back and forward; a back row, a filter, the overview and its groups; the profile at its
 * foot), the Canvas (the tabs, References and light / dark; a breadcrumb over sections of component tiles) and the
 * Inspector (its views and toggle; Theme's rows). Built only from Area's components; the frame's settings paint it.
 * People: David Tee.
 */
import {
  Avatar, Badge, Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator, Button, Card, CardContent,
  Checkbox, Field, Input, Nav, NavGroup, NavItem, Panel, PanelSection, SearchField, Segmented, Select, Slider, Switch, Titlebar,
} from "@area/react";
import {
  AddIcon, ArrowLeftIcon, ArrowRightIcon, BookmarkIcon, GridIcon, HomeIcon, ListIcon, MoonIcon, PanelLeftFilledIcon, SystemIcon,
  PanelRightFilledIcon, SearchIcon, SettingsIcon,
} from "@area/icons";
import type { ReactNode } from "react";

const icon = (label: string, glyph: ReactNode) => <Button size="sm" variant="ghost" tone="neutral" iconOnly aria-label={label} icon={glyph} />;
const IN_REVIEW: ReadonlyArray<[string, number]> = [["Approval", 6], ["Badge", 77], ["Field", 14], ["Panel", 12]];
const COMPONENTS: ReadonlyArray<[string, number]> = [["Accordion", 10], ["Alert", 14], ["Avatar", 14], ["Button", 24], ["Card", 18]];

/** A component tile: the specimen centred on its card, its name under it, as the Canvas's tiles. */
function Tile({ name, children }: { name: string; children: ReactNode }) {
  return (
    <div className="ex-area__tile">
      <Card size="sm"><CardContent><div className="ex-area__stage">{children}</div></CardContent></Card>
      <span className="ex-area__name">{name}</span>
    </div>
  );
}

export function AreaAppScreen() {
  return (
    <div className="ex-area" data-region="screen">
      <Panel flush windowBar resizable="end" width={240} aria-label="Sidebar" data-area-ground="recessed" className="ex-area__side"
        action={<>
          <span className="ex-area__group"><span className="ex-area__lights" aria-hidden="true"><i /><i /><i /></span>{icon("Hide sidebar", <PanelLeftFilledIcon />)}{icon("Search", <SearchIcon />)}</span>
          <span className="ex-area__group">{icon("Back", <ArrowLeftIcon />)}{icon("Forward", <ArrowRightIcon />)}</span>
        </>}
        bareFooter footer={<div className="ex-area__profile"><Avatar size="sm" fallback="DT" aria-label="David Tee" /><span className="ex-area__grow">David Tee</span>{icon("Settings", <SettingsIcon />)}</div>}>
        <div className="ex-area__list">
          <Nav aria-label="Back"><NavItem href="#" icon={<ArrowLeftIcon />}>Area</NavItem></Nav>
          <SearchField size="sm" variant="soft" fullWidth placeholder="Filter components" aria-label="Filter components" />
          <Nav aria-label="Components">
            <NavItem href="#" current trailing={<span className="ex-area__count">118</span>}>All</NavItem>
            <NavGroup label="In review">
              {IN_REVIEW.map(([name, count]) => <NavItem key={name} href="#" trailing={<span className="ex-area__count">{count}</span>}>{name}</NavItem>)}
            </NavGroup>
            <NavGroup label="Components">
              {COMPONENTS.map(([name, count]) => <NavItem key={name} href="#" trailing={<span className="ex-area__count">{count}</span>}>{name}</NavItem>)}
            </NavGroup>
          </Nav>
        </div>
      </Panel>
      <main className="ex-area__canvas">
        <Titlebar variant="plain" size="sm" end={<>{icon("References", <BookmarkIcon />)}{icon("Dark mode", <MoonIcon />)}</>}>
          <Nav orientation="horizontal" aria-label="Open tabs">
            <NavItem href="#" icon={<HomeIcon />} aria-label="Home" />
            <NavItem href="#" icon={<SystemIcon />} current>Area</NavItem>
          </Nav>
          {icon("New tab", <AddIcon />)}
        </Titlebar>
        <div className="ex-area__bar">
          <Breadcrumb><BreadcrumbList>
            <BreadcrumbItem><BreadcrumbLink href="#">Components</BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbPage>Overview</BreadcrumbPage></BreadcrumbItem>
          </BreadcrumbList></Breadcrumb>
          <span className="ex-area__grow" />
          <Segmented size="sm" iconOnly aria-label="Show as" defaultValue="grid" items={[{ value: "grid", label: "Grid", icon: <GridIcon /> }, { value: "list", label: "List", icon: <ListIcon /> }]} />
        </div>
        <div className="ex-area__body">
          <section className="ex-area__section">
            <span className="ex-area__heading">Button <span className="ex-area__count">24</span> <Badge size="sm" variant="soft" tone="success">Live</Badge></span>
            <div className="ex-area__tiles">
              <Tile name="Primary"><Button size="sm">Save changes</Button></Tile>
              <Tile name="Outline"><Button size="sm" variant="outline" tone="neutral">Cancel</Button></Tile>
              <Tile name="Soft"><Button size="sm" variant="soft" tone="neutral" icon={<AddIcon />}>New project</Button></Tile>
            </div>
          </section>
          <section className="ex-area__section">
            <span className="ex-area__heading">Field <span className="ex-area__count">14</span> <Badge size="sm" variant="soft" tone="warning">In review</Badge></span>
            <div className="ex-area__tiles">
              <Tile name="Input"><Input size="sm" fullWidth placeholder="Placeholder" aria-label="Placeholder" /></Tile>
              <Tile name="Choices"><span className="ex-area__pair"><Checkbox aria-label="Option one" defaultChecked /><Switch aria-label="Option two" defaultChecked /></span></Tile>
              <Tile name="Status"><span className="ex-area__pair"><Badge size="sm" variant="soft" tone="info">Draft</Badge><Badge size="sm" variant="soft" tone="danger">Blocked</Badge></span></Tile>
            </div>
          </section>
        </div>
      </main>
      <Panel flush bareBar windowBar resizable="start" width={248} aria-label="Inspector" className="ex-area__inspector"
        action={<>
          <Nav orientation="horizontal" aria-label="Inspector views">
            <NavItem href="#" current>Theme</NavItem>
            <NavItem href="#">Design</NavItem>
            <NavItem href="#">Code</NavItem>
          </Nav>
          <span className="ex-area__group">{icon("Hide inspector", <PanelRightFilledIcon />)}</span>
        </>}>
        <PanelSection heading="Page">
          <Field label="Page color" orientation="horizontal"><Segmented size="sm" fullWidth aria-label="Page color" defaultValue="adjust" items={[{ value: "adjust", label: "Adjust" }, { value: "exact", label: "Exact" }]} /></Field>
          <Field label="Lightness" orientation="horizontal"><Slider size="sm" aria-label="Lightness" defaultValue={100} /></Field>
        </PanelSection>
        <PanelSection heading="Accent">
          <Field label="Accent" orientation="horizontal"><Select size="sm" variant="soft" fullWidth aria-label="Accent" defaultValue="blue"><option value="blue">Blue</option></Select></Field>
          <Field label="Saturation" orientation="horizontal"><Slider size="sm" aria-label="Saturation" defaultValue={100} /></Field>
        </PanelSection>
        <PanelSection heading="Emphasis">
          <Field label="Buttons" orientation="horizontal"><Segmented size="sm" fullWidth aria-label="Buttons" defaultValue="neutral" items={[{ value: "neutral", label: "Neutral" }, { value: "accent", label: "Accent" }]} /></Field>
          <Field label="Selection" orientation="horizontal"><Segmented size="sm" fullWidth aria-label="Selection" defaultValue="neutral" items={[{ value: "neutral", label: "Neutral" }, { value: "accent", label: "Accent" }]} /></Field>
        </PanelSection>
      </Panel>
    </div>
  );
}
