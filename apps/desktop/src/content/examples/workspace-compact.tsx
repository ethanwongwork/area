/**
 * The Workspace at a small window's width (owner, 2026-11-07, Settings › Appearance's Mode pictures: "using real components
 * and ui, scaled down, but not quite as abstract ... a smaller responsive version ... not 1920x1080 but like 720 width,
 * while still showing most if not all of the original content"): the same app (workspace.tsx) laid out as it would be
 * in a 720 × 540 window, with real components at true size, so a picture scaled to a choice card shows the parts
 * about three times as large as the full screen does.
 *
 * The sidebar and the page, Details closed, so the page keeps its notice, the cards' lines and the table's owners (owner
 * 2026-11-07 picked this of four layouts: all three regions narrowed, an icon rail, a lifted window). Settings draws it
 * with words as bars ("B as bars"), so it reads as a picture of the app rather than small text.
 *
 * Generic copy, David Tee as the one person (DESIGN_SYSTEM.md, Example copy). Shown, not used.
 */
import type { ReactNode } from "react";
import {
  Alert, Avatar, Badge, Button, Card, CardContent, CardDescription, CardTitle, Checkbox, Composer, Count, Kbd, Nav, NavGroup, NavItem, Panel,
  SectionHeading, Table,
} from "@area/react";
import {
  AddIcon, DocumentIcon, FolderIcon, HomeIcon, InboxIcon, InfoIcon, MoreHorizontalIcon, PanelLeftIcon, PencilIcon, SearchIcon, SettingsIcon, ShareIcon,
  SparkleIcon,
} from "@area/icons";

const TEAMS: Record<string, string> = { DT: "David Tee", DE: "Design team", EN: "Engineering team" };
const TASKS = [
  { name: "Update the sidebar", status: "Done", tone: "success", who: "DT", done: true },
  { name: "Fix spacing on cards", status: "In review", tone: "warning", who: "DE" },
  { name: "Improve search", status: "Blocked", tone: "danger", who: "EN" },
  { name: "Write onboarding copy", status: "Planned", tone: "info", who: "DT" },
] as const;
const ACTIONS = [
  { icon: <PencilIcon />, title: "Create", body: "Tasks and docs" },
  { icon: <SearchIcon />, title: "Find", body: "Answers and files" },
  { icon: <SparkleIcon />, title: "Plan", body: "Work on a schedule" },
];

const icon = (label: string, glyph: ReactNode, extra: Record<string, unknown> = {}) =>
  <Button size="sm" variant="ghost" tone="neutral" iconOnly aria-label={label} icon={glyph} {...extra} />;
const lights = <span className="ss-lights" aria-hidden="true"><i /><i /><i /></span>;

function Sidebar() {
  return (
    <Panel className="cw-side" flush windowBar bareBar aria-label="Sidebar"
      action={<>{lights}<span className="ss-grow" />{icon("Sidebar", <PanelLeftIcon />)}</>}
      footer={<div className="cw-person"><Avatar size="sm" fallback="DT" aria-label="David Tee" /><span className="ss-grow">David Tee</span>{icon("Settings", <SettingsIcon />)}</div>}>
      <div className="cw-side__groups">
        <Nav aria-label="Primary">
          <NavItem href="#" icon={<AddIcon />}>New task</NavItem>
          <NavItem href="#" icon={<SearchIcon />} trailing={<Kbd keys={["cmd", "K"]} size="sm" />}>Search</NavItem>
          <NavItem href="#" icon={<HomeIcon />} current>Home</NavItem>
          <NavItem href="#" icon={<InboxIcon />} trailing={<Count count={3} variant="soft" />}>Inbox</NavItem>
          <NavItem href="#" icon={<DocumentIcon />}>Files</NavItem>
        </Nav>
        <Nav aria-label="Teams">
          <NavGroup label="Teams">
            <NavItem href="#" icon={<FolderIcon />}>Design</NavItem>
            <NavItem href="#" icon={<FolderIcon />}>Engineering</NavItem>
            <NavItem href="#" icon={<FolderIcon />}>Marketing</NavItem>
          </NavGroup>
        </Nav>
      </div>
    </Panel>
  );
}

function Page() {
  return (
    <main className="cw-main">
      <header className="cw-head">
        <span className="cw-head__title">Home</span>
        <span className="ss-grow" />
        <Button size="sm" variant="outline" tone="neutral" icon={<ShareIcon />}>Share</Button>
        <Button size="sm" icon={<AddIcon />}>New task</Button>
        {icon("More", <MoreHorizontalIcon />)}
      </header>
      <div className="cw-body">
        <Alert tone="info" icon={<InfoIcon />} title="Connect your tools" action={<Button size="sm" variant="soft" tone="neutral">Connect</Button>}>Bring in your files and calendars.</Alert>
        <div className="cw-intro">
          <span className="cw-title">Good afternoon</span>
          <span className="cw-lede">Pick up where you left off.</span>
        </div>
        <div className="cw-cards">
          {ACTIONS.map(entry => (
            <Card key={entry.title} size="sm"><CardContent>
              <span className="cw-card-icon">{entry.icon}</span>
              <CardTitle>{entry.title}</CardTitle>
              <CardDescription>{entry.body}</CardDescription>
            </CardContent></Card>
          ))}
        </div>
        <section className="cw-section" aria-label="Tasks">
          <SectionHeading title="Tasks" />
          <Table size="sm" baseline aria-label="Tasks">
            <tbody>
              {TASKS.slice(0, 3).map(task => (
                <tr key={task.name}>
                  <td className="ss-cell-fit"><span className="ss-cell"><Checkbox aria-label={task.name} defaultChecked={"done" in task} /></span></td>
                  <td className="cw-cell-name">{task.name}</td>
                  <td className="ss-cell-fit"><Badge tone={task.tone}>{task.status}</Badge></td>
                  <td className="ss-cell-fit"><Avatar size="sm" fallback={task.who} aria-label={TEAMS[task.who]} /></td>
                </tr>
              ))}
            </tbody>
          </Table>
        </section>
      </div>
      <div className="cw-dock"><Composer placeholder="Ask anything…" aria-label="Ask anything"
        leadingActions={<Button variant="ghost" tone="neutral" iconOnly aria-label="Add" icon={<AddIcon />} />} /></div>
    </main>
  );
}

export function CompactWorkspace() {
  return <div className="cw-window"><Sidebar /><Page /></div>;
}
