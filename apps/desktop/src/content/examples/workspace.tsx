/**
 * The Workspace (owner, 2026-10-30: "the northwind ui looks terrible. it looks fake. the scale looks too big ... make it a
 * 1920x1080 screen and scale it down ... maybe just make it a generic app ui"; "dont name it anything, just use generic
 * copy"; then "refine and fix the sample ui more ... maybe move the composer component to the bottom middle ... dont put a
 * name at all for the greeting ... refine the right panel controls, make it more full, consistent sections"): a desktop
 * app at true size, 1920 × 1080, drawn in the theme and scaled down wherever it shows, as a screenshot is.
 *
 * Three regions, each with its own header on the window's top line, as the Area app's (PRODUCT_UI.md, "The app's layout"):
 *   sidebar   a docked Panel: its bar holds the window's lights, the toggle and back and forward; nav, team spaces and
 *             recents, groups apart by space; a feature announcement Popover over the person, both pinned in its footer
 *             (owner 2026-10-31: "instead of the free plan thing on the bottom, add an upsell card popover", then "a
 *             generic upsell of a feature rather than upgrading"; the column's callout, between the actions and the
 *             tasks, went)
 *   main      a header as tall as the panels' bars (the page's name, then Share, New task and More at its end); a 720
 *             column of a notice, a greeting, quick actions, the tasks and recent files; the composer docked at the
 *             column's foot, the main region's only dock
 *   details   a docked Panel titled Details, drawn as the Area Inspector's Theme panel (owner 2026-10-31: "more sliders,
 *             more inputs, no checkboxes, the toggles are okay"): sections of label and control rows, each control in
 *             the value column: fields, dropdowns, Segmented, a bar with its value in a field beside it (the Inspector's
 *             `studio-bar`), a number with its unit, a colour's hex; switch rows for on and off. Sections fill the panel to its footer at the defaults (Properties, Progress,
 *             Appearance, Labels, Notifications, Sharing). Save changes pinned in
 *             its footer
 * The More menu opens 4 under its button, its end on the button's end (area-ui-compose › shell.md, Menu); the toast, when
 * held, sits at the main region's end, 12 above the composer (the showcase leaves it out: the menu shows the floating
 * layer, and a toast nothing asked for read as noise, owner 2026-10-31).
 *
 * No product, workspace or project name and no name in the greeting: generic app words, David Tee as the one person
 * (DESIGN_SYSTEM.md, Example copy; teams for the others). Every theme setting changes something here (setup-screen.tsx
 * `SHOWCASE`), and each part Setup's questions point at is marked as a region (`data-region`, setup-screen.tsx `Region`);
 * `hold` keeps a state still (a hovered row, a pressed button, a focused field, the menu, the toast).
 */
import type { ReactNode } from "react";
import {
  Alert, Avatar, Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Checkbox, Chip, ColorField, Composer, Count, Field, Input, Kbd,
  MenuItem, MenuSeparator, Nav, NavGroup, NavItem, NumberField, Panel, PanelSection, Popover, PopoverBody, PopoverClose, PopoverDescription, PopoverFooter,
  PopoverHeader, PopoverMedia, PopoverTitle, SectionHeading, Segmented, Select, Slider, Switch, Table, Tabs, Toast,
} from "@area/react";
import {
  AddIcon, ArrowLeftIcon, ArrowRightIcon, AttachIcon, CheckIcon, CopyIcon, DocumentIcon, FolderIcon, HomeIcon, ImageIcon, InboxIcon, InfoIcon,
  MoreHorizontalIcon, PanelLeftIcon, PanelRightIcon, PencilIcon, SearchIcon, SettingsIcon, ShareIcon, SparkleIcon, TrashIcon,
} from "@area/icons";
import type { Hold, Region } from "../../setup-screen.tsx";

const TEAMS: Record<string, string> = { DT: "David Tee", DE: "Design team", EN: "Engineering team", MK: "Marketing team" };
const TASKS: ReadonlyArray<{ name: string; status: string; tone: "success" | "warning" | "danger" | "info"; who: string; due: string; done?: boolean }> = [
  { name: "Update the sidebar structure", status: "Done", tone: "success", who: "DT", due: "Today", done: true },
  { name: "Fix spacing on cards", status: "In review", tone: "warning", who: "DE", due: "Today" },
  { name: "Improve search results", status: "Blocked", tone: "danger", who: "EN", due: "Tomorrow" },
  { name: "Write the onboarding copy", status: "Planned", tone: "info", who: "MK", due: "Friday" },
  { name: "Review the settings page", status: "Planned", tone: "info", who: "DT", due: "Next week" },
];
const FILES = [
  { icon: <DocumentIcon />, name: "Brief", meta: "Edited today" },
  { icon: <ImageIcon />, name: "Moodboard", meta: "Edited yesterday" },
  { icon: <DocumentIcon />, name: "Research notes", meta: "Edited Monday" },
  { icon: <FolderIcon />, name: "Assets", meta: "24 files" },
];
const RECENTS = ["Fix spacing on cards", "Update the sidebar structure", "Improve search results", "Write the onboarding copy", "Review the settings page"];
const ACTIONS = [
  { icon: <PencilIcon />, title: "Create", body: "Tasks, docs and images" },
  { icon: <SearchIcon />, title: "Find", body: "Answers and files" },
  { icon: <SparkleIcon />, title: "Automate", body: "Repeat work on a schedule" },
];
const priority = [{ value: "low", label: "Low" }, { value: "medium", label: "Medium" }, { value: "high", label: "High" }];
const notify = [{ value: "all", label: "All" }, { value: "mentions", label: "Mentions" }];

/** A region round a component whose own attributes reach its input, not its box (Switch, Slider, a pair of Chips). */
const R = ({ id, children, inline }: { id: Region; children: ReactNode; inline?: boolean }) =>
  <div data-region={id} className={inline ? "ss-region ss-region--inline" : "ss-region"}>{children}</div>;
const icon = (label: string, glyph: ReactNode, extra: Record<string, unknown> = {}) =>
  <Button size="sm" variant="ghost" tone="neutral" iconOnly aria-label={label} icon={glyph} {...extra} />;
/** A label and its control, the control in the panel's value column (the Inspector's rows). */
const row = (label: string, control: ReactNode) => <Field label={label} orientation="horizontal">{control}</Field>;
/** A bar and its value in a soft field beside it, as the Inspector's setting bars (inspector-rows.tsx `BarRow`). */
const bar = (label: string, value: number, shown: string, props: { min?: number; max?: number; stepMarks?: boolean } = {}) => (
  <div className="studio-bar" style={{ ["--_value-ch" as string]: 5 }}>
    <Slider size="sm" labelPosition="inside" readout={false} aria-label={label} defaultValue={value} {...props} />
    <Input className="studio-bar__field studio-bar__field--sm" size="sm" variant="soft" aria-label={`${label} value`} defaultValue={shown} />
  </div>
);

export function WorkspaceScreen({ hold = new Set() }: { hold?: ReadonlySet<Hold> }) {
  const on = (state: Hold) => hold.has(state);
  const pointer = (state: Hold) => on(state) ? { "data-af-pointer": "" } : {};
  return (
    <div className="ws-window" data-region="screen">
      <Panel className="ws-side" flush windowBar bareBar resizable="end" aria-label="Sidebar" data-region="sidebar"
        action={<>
          <span className="ss-lights" aria-hidden="true"><i /><i /><i /></span>
          <span className="ss-grow" />
          {icon("Sidebar", <PanelLeftIcon />)}
          {icon("Back", <ArrowLeftIcon />)}
          {icon("Forward", <ArrowRightIcon />)}
        </>}
        footer={
          <div className="ws-side__foot">
            {/* A feature announcement, a Popover over the person (the owner's references; owner 2026-10-31: "a generic
                upsell of a feature rather than upgrading"), composed as Area's own image popover (gallery.tsx
                GalleryPopoverImage): the header first, its title and the line under it joined and the close at the
                popover's corner, concentric with it; then the feature itself, a real card in the media well; then
                the one action. */}
            <Popover className="ws-upsell" role="dialog">
              <PopoverHeader>
                <PopoverTitle level={3}>Automations <Badge size="sm" tone="info">New</Badge></PopoverTitle>
                <PopoverDescription>Set work to run on a schedule, like a summary every Monday.</PopoverDescription>
                <PopoverClose aria-label="Dismiss" />
              </PopoverHeader>
              <PopoverBody>
                <PopoverMedia aria-hidden="true">
                  <span className="ws-upsell__feature">
                    <Card size="sm"><CardHeader action={<Switch aria-label="On" defaultChecked />}>
                      <CardTitle>Weekly summary</CardTitle>
                      <CardDescription>Mondays at 9:00</CardDescription>
                    </CardHeader></Card>
                  </span>
                </PopoverMedia>
              </PopoverBody>
              <PopoverFooter><Button size="sm" variant="soft" tone="neutral" fullWidth>Try it</Button></PopoverFooter>
            </Popover>
            <div className="ws-person">
              <Avatar size="sm" fallback="DT" aria-label="David Tee" />
              <span className="ss-grow">David Tee</span>
              {icon("Settings", <SettingsIcon />)}
            </div>
          </div>
        }>
        <div className="ws-side__groups">
          <Nav aria-label="Primary">
            <NavItem href="#" icon={<AddIcon />}>New task</NavItem>
            <NavItem href="#" icon={<SearchIcon />} trailing={<Kbd keys={["cmd", "K"]} size="sm" />}>Search</NavItem>
            <NavItem href="#" icon={<HomeIcon />} current data-region="nav-current">Home</NavItem>
            <NavItem href="#" icon={<InboxIcon />} className={on("hover") ? "st-hover" : undefined} {...pointer("hover")} data-region="nav-hover"
              trailing={<Count count={3} variant="soft" data-region="count" />}>Inbox</NavItem>
            <NavItem href="#" icon={<DocumentIcon />}>Files</NavItem>
          </Nav>
          <Nav aria-label="Teams">
            <NavGroup label="Teams">
              <NavItem href="#" icon={<FolderIcon />}>Design</NavItem>
              <NavItem href="#" icon={<FolderIcon />}>Engineering</NavItem>
              <NavItem href="#" icon={<FolderIcon />}>Marketing</NavItem>
            </NavGroup>
          </Nav>
          <Nav aria-label="Recents">
            <NavGroup label="Recents">
              {RECENTS.map(name => <NavItem key={name} href="#">{name}</NavItem>)}
            </NavGroup>
          </Nav>
        </div>
      </Panel>

      <main className="ws-main">
        <header className="ws-head" data-region="header">
          <span className="ws-head__title">Home</span>
          <span className="ss-grow" />
          <Button size="sm" variant="outline" tone="neutral" icon={<ShareIcon />} className={on("press") ? "st-press" : undefined} {...pointer("press")} data-region="button">Share</Button>
          <Button size="sm" icon={<AddIcon />} data-region="primary">New task</Button>
          {icon("More", <MoreHorizontalIcon />, { "data-region": "more", "aria-expanded": on("menu") || on("danger") ? true : undefined })}
        </header>
        <div className="ws-body">
          <div className="ws-column">
            {/* A notice about the whole page, first on it, over the greeting (owner 2026-10-31: "add the banner back, maybe
                at the top? above the greeting"): between the actions and the tasks it broke the column's flow. */}
            <Alert tone="info" icon={<InfoIcon />} title="Connect your tools" actions={<Button size="sm" variant="soft" tone="neutral">Connect</Button>}
              onDismiss={() => undefined} dismissLabel="Dismiss">Bring in your files and calendars for better answers.</Alert>
            <div className="ws-intro" data-region="text">
              <span className="ws-title">Good afternoon</span>
              <span className="ws-lede">Pick up where you left off, or start something new.</span>
            </div>
            <div className="ws-cards" data-region="stats">
              {ACTIONS.map((entry, at) => (
                <Card key={entry.title} size="sm" selected={at === 1 && on("selected")} className={at === 2 && on("lift") ? "st-lift" : undefined} {...(at === 2 ? pointer("lift") : {})}
                  data-region={at === 1 ? "stat-selected" : at === 2 ? "stat-hover" : "stat"}><CardContent>
                  <span className="ws-card-icon">{entry.icon}</span>
                  <CardTitle>{entry.title}</CardTitle>
                  <CardDescription>{entry.body}</CardDescription>
                </CardContent></Card>
              ))}
            </div>
            <section className="ws-section" aria-labelledby="ws-tasks">
              <SectionHeading titleId="ws-tasks" title="Tasks" />
              {/* The views over the table they switch, as a database's (Notion): on the heading's line their underline's
                  room set the title off their text's baseline by 3 to 5, whichever way the line aligned. */}
              <div className="ws-views">
                <Tabs data-region="tabs" size="sm" aria-label="Task views" defaultValue="all" items={[{ id: "all", label: "All" }, { id: "active", label: "Active" }, { id: "done", label: "Done" }]} />
                <Table size="sm" baseline aria-label="Tasks" data-region="list">
                <thead><tr><th className="ss-cell-fit"><span className="area-sr-only">Done</span></th><th>Task</th><th>Status</th><th>Owner</th><th>Due</th></tr></thead>
                <tbody>
                  {TASKS.map(task => (
                    <tr key={task.name}>
                      <td className="ss-cell-fit"><span className="ss-cell" data-region={task.done ? "checks" : undefined}><Checkbox aria-label={task.name} defaultChecked={task.done} /></span></td>
                      <td>{task.name}</td>
                      <td className="ss-cell-fit"><Badge tone={task.tone} data-region={task.done ? "badges status" : "status"}>{task.status}</Badge></td>
                      <td className="ss-cell-fit"><span className="ws-owner"><Avatar size="sm" fallback={task.who} aria-label={TEAMS[task.who]} data-region={task.done ? "avatar" : undefined} />{TEAMS[task.who]}</span></td>
                      <td className="ss-cell-fit ws-muted">{task.due}</td>
                    </tr>
                  ))}
                </tbody>
                </Table>
              </div>
            </section>
            <section className="ws-section" aria-labelledby="ws-files">
              <SectionHeading titleId="ws-files" title="Recent files" />
              <div className="ws-files">
                {FILES.map(file => (
                  <Card key={file.name} size="sm"><CardContent>
                    <span className="ws-card-icon">{file.icon}</span>
                    <CardTitle>{file.name}</CardTitle>
                    <CardDescription>{file.meta}</CardDescription>
                  </CardContent></Card>
                ))}
              </div>
            </section>
          </div>
        </div>
        {/* The composer, docked at the column's foot (ChatGPT's and the owner's references). */}
        <div className="ws-dock">
          <div className="ws-dock__column"><Composer placeholder="Ask anything…" aria-label="Ask anything"
            // The composer's actions at its own action size (control md), as its send and its demos, so they share the
            // text line's centre (a small button sat 2 low: the row aligns to its foot).
            leadingActions={<><Button variant="ghost" tone="neutral" iconOnly aria-label="Add" icon={<AddIcon />} /><Button variant="ghost" tone="neutral" iconOnly aria-label="Attach" icon={<AttachIcon />} /></>} /></div>
          {/* The toast after New task: the region's end, 12 above the composer, so it never covers it. */}
          {on("toast") ? <div className="ws-toast"><Toast tone="success" icon={<CheckIcon />}>Task created</Toast></div> : null}
        </div>
        {/* The More menu, open when held (the showcase holds it): 4 under its button, ends aligned. */}
        {on("menu") || on("danger") ? (
          <div className="ws-menu" data-region="menu">
            <div className="area-menu" role="menu" aria-label="More">
              <MenuItem icon={<CopyIcon />} data-region="menu-row" data-highlighted={on("menu") && !on("danger") ? "" : undefined}>Duplicate</MenuItem>
              <MenuItem icon={<PencilIcon />}>Rename</MenuItem>
              <MenuItem icon={<ShareIcon />}>Move to…</MenuItem>
              <MenuSeparator />
              <MenuItem icon={<TrashIcon />} tone="danger" data-region="menu-danger" data-highlighted={on("danger") ? "" : undefined} {...pointer("danger")}>Delete</MenuItem>
            </div>
          </div>
        ) : null}
      </main>

      {/* The details of the task in view: its properties, labels, tools and how its team hears about it. */}
      <Panel className="ws-details" flush windowBar bareBar resizable="start" title="Details" titleLevel={2} aria-label="Details" data-region="form"
        action={icon("Details", <PanelRightIcon />)}
        footer={<Button size="sm" fullWidth data-region="action">Save changes</Button>}>
        <PanelSection heading="Properties">
          {row("Title", <Input size="sm" variant="soft" fullWidth defaultValue="Fix spacing on cards" data-region="field"
            className={on("focus") ? "st-focus-field" : on("hover-edge") ? "st-hover-field" : undefined} {...pointer("hover-edge")} />)}
          {row("Status", <Select size="sm" variant="soft" fullWidth defaultValue="review"><option value="review">In review</option><option value="done">Done</option></Select>)}
          {row("Assignee", <Select size="sm" variant="soft" fullWidth defaultValue="de"><option value="de">Design team</option><option value="dt">David Tee</option></Select>)}
          {row("Priority", <Segmented size="sm" fullWidth aria-label="Priority" defaultValue="medium" items={priority} data-region="segmented" />)}
          {row("Due", <Select size="sm" variant="soft" fullWidth defaultValue="today"><option value="today">Today</option><option value="week">This week</option></Select>)}
        </PanelSection>
        <PanelSection heading="Progress">
          {row("Progress", <R id="slider">{bar("Progress", 50, "50%")}</R>)}
          {row("Effort", bar("Effort", 3, "3 pts", { min: 1, max: 8, stepMarks: true }))}
          {row("Estimate", <NumberField size="sm" variant="soft" fullWidth aria-label="Estimate" defaultValue={6} min={0} unit="h" />)}
        </PanelSection>
        <PanelSection heading="Appearance">
          {row("Color", <ColorField size="sm" variant="soft" fullWidth aria-label="Color" defaultValue="#4B5563" />)}
          {row("Opacity", bar("Opacity", 80, "80%"))}
          {row("Cover", <Segmented size="sm" fullWidth aria-label="Cover" defaultValue="none" items={[{ value: "none", label: "None" }, { value: "color", label: "Color" }, { value: "image", label: "Image" }]} />)}
        </PanelSection>
        <PanelSection heading="Labels" count={2} actions={icon("Add label", <AddIcon />)}>
          <R id="chips" inline><Chip size="sm">Design</Chip><Chip size="sm">Web</Chip></R>
        </PanelSection>
        <PanelSection heading="Notifications">
          {row("Notify me", <Segmented size="sm" fullWidth aria-label="Notify me" defaultValue="all" items={notify} />)}
          {row("Remind", <Select size="sm" variant="soft" fullWidth defaultValue="day"><option value="day">A day before</option><option value="hour">An hour before</option></Select>)}
          <R id="switch"><Switch label="Email" labelPosition="start" fullWidth defaultChecked /></R>
          <Switch label="Push" labelPosition="start" fullWidth defaultChecked />
          <Switch label="Daily summary" labelPosition="start" fullWidth />
        </PanelSection>
        <PanelSection heading="Sharing">
          {row("Visibility", <Select size="sm" variant="soft" fullWidth defaultValue="team"><option value="team">Design team</option><option value="private">Only me</option></Select>)}
          {row("Link access", <Select size="sm" variant="soft" fullWidth defaultValue="view"><option value="view">Can view</option><option value="edit">Can edit</option></Select>)}
        </PanelSection>
      </Panel>
    </div>
  );
}
