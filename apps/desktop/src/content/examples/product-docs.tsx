/**
 * Product screen, documents: a document app's main window at true size, 1440 × 900 (it grows with the page), built only
 * from Area components and tokens as a stress test of the system. Three regions:
 *   sidebar   a docked Panel: the workspace row, Search, Home and Inbox, Favorites, two trees of nested pages (Tree view),
 *             Settings and Trash pinned in its footer
 *   top bar   a plain Titlebar: the page's path, when it was edited, Share, comments, favorite, more
 *   page      a 708 reading column: icon, title, properties (Description list), prose blocks, then an inline database
 *             (Tabs, icon Buttons, Split button, Table)
 * Values marked measured come from docs/research/ui-patterns-2026-10-22/notion.md and area-ui-compose's references.
 * Where Area has no component for a part (a quote, a to-do's struck text, a page icon, a table's footer) the nearest
 * honest component stands in; styles/product-docs.css lays the regions out and paints nothing.
 * Copy: David Tee as the one person, teams for the others, no product names (DESIGN_SYSTEM.md, Example copy).
 */
import type { ReactNode } from "react";
import {
  AccordionItem, Accordion, Alert, Avatar, Badge, Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,
  Button, Checkbox, Count, DescriptionList, DescriptionListItem, Link, Mention, MenuItem, Nav, NavGroup, NavItem, Panel, SectionHeading, Separator,
  SplitButton, Table, TableCell, TableHeaderCell, Tabs, Tag, Titlebar, TreeView,
  type TreeViewNode,
} from "@area/react";
import {
  AddIcon, BookIcon, CalendarIcon, ChatIcon, ChevronsUpDownIcon, CircleProgressIcon, ClockIcon, DocumentIcon, FilterIcon, FlagIcon, HashIcon, HomeIcon,
  InboxIcon, KanbanIcon, LightbulbIcon, MoreHorizontalIcon, NotebookIcon, PanelLeftIcon, PencilIcon, PeopleIcon, PersonIcon, RocketIcon, SearchIcon,
  SettingsIcon, SortIcon, StarFilledIcon, TableIcon, TagIcon, TargetIcon, TextIcon, TimelineIcon, TrashIcon,
} from "@area/icons";

type Tone = "neutral" | "info" | "success" | "warning" | "danger";
const PEOPLE: Record<string, string> = { DT: "David Tee", DE: "Design team", PL: "Platform team" };

const TEAMSPACES: TreeViewNode[] = [
  { id: "product", label: "Product", icon: <TargetIcon />, children: [
    { id: "roadmap", label: "Roadmap", icon: <TimelineIcon /> },
    { id: "launches", label: "Launches", icon: <RocketIcon />, children: [
      { id: "q4", label: "Q4 launch plan", icon: <RocketIcon /> },
      { id: "q3", label: "Q3 launch review", icon: <DocumentIcon /> },
      { id: "checklist", label: "Launch checklist", icon: <DocumentIcon /> },
    ] },
    { id: "research", label: "Research notes", icon: <NotebookIcon /> },
  ] },
  { id: "design", label: "Design", icon: <PencilIcon />, children: [
    { id: "reviews", label: "Design reviews", icon: <DocumentIcon /> },
    { id: "guidelines", label: "Guidelines", icon: <BookIcon /> },
  ] },
  { id: "platform", label: "Platform", icon: <HashIcon />, children: [
    { id: "incidents", label: "Incident log", icon: <DocumentIcon /> },
  ] },
];
const PRIVATE: TreeViewNode[] = [
  { id: "notes", label: "Meeting notes", icon: <NotebookIcon />, children: [
    { id: "weekly", label: "Weekly sync", icon: <DocumentIcon /> },
  ] },
  { id: "reading", label: "Reading list", icon: <BookIcon /> },
  { id: "drafts", label: "Drafts", icon: <DocumentIcon /> },
];

const TASKS: ReadonlyArray<{ name: string; status: string; tone: Tone; who: string; due: string; iso: string; points: number }> = [
  { name: "Finalize pricing page", status: "Done", tone: "success", who: "DT", due: "Nov 3", iso: "2026-11-03", points: 3 },
  { name: "Write release notes", status: "In progress", tone: "info", who: "DT", due: "Nov 12", iso: "2026-11-12", points: 2 },
  { name: "Update onboarding flow", status: "In progress", tone: "info", who: "DE", due: "Nov 14", iso: "2026-11-14", points: 8 },
  { name: "Load test the import service", status: "Blocked", tone: "danger", who: "PL", due: "Nov 17", iso: "2026-11-17", points: 5 },
  { name: "Record the walkthrough video", status: "Not started", tone: "neutral", who: "DE", due: "Nov 19", iso: "2026-11-19", points: 3 },
  { name: "Send the announcement email", status: "Not started", tone: "neutral", who: "DT", due: "Nov 24", iso: "2026-11-24", points: 1 },
];

const iconButton = (label: string, glyph: ReactNode, extra: Record<string, unknown> = {}) =>
  <Button size="sm" variant="ghost" tone="neutral" iconOnly aria-label={label} icon={glyph} {...extra} />;
/** A person in a value: the avatar, then the name (a table cell, a property's value). */
const person = (who: string) => (
  <span className="px-docs__person"><Avatar size="xs" fallback={who} aria-hidden="true" />{PEOPLE[who]}</span>
);
/** A column's heading: its kind's icon, then its name. */
const column = (glyph: ReactNode, name: string) => <span className="px-docs__column">{glyph}{name}</span>;

export function ProductDocsScreen() {
  return (
    <div className="px-docs">
      <Panel className="px-docs__side" data-area-chrome="" data-area-ground="recessed" flush windowBar bareBar bareFooter aria-label="Sidebar"
        action={<>
          <span className="px-docs__grow" />
          {iconButton("Close sidebar", <PanelLeftIcon />)}
          {iconButton("New page", <PencilIcon />)}
        </>}
        footer={
          <Nav aria-label="Workspace tools">
            <NavItem href="#" icon={<SettingsIcon />}>Settings</NavItem>
            <NavItem href="#" icon={<TrashIcon />}>Trash</NavItem>
          </Nav>
        }>
        <div className="px-docs__groups">
          <Nav aria-label="Workspace">
            <NavItem href="#" icon={<Avatar size="xs" shape="square" fallback="D" aria-hidden="true" />} trailing={<ChevronsUpDownIcon />}>David Tee’s workspace</NavItem>
          </Nav>
          <Nav aria-label="Primary">
            <NavItem href="#" icon={<SearchIcon />}>Search</NavItem>
            <NavItem href="#" icon={<HomeIcon />}>Home</NavItem>
            <NavItem href="#" icon={<InboxIcon />} trailing={<Count count={4} variant="soft" label="unread" />}>Inbox</NavItem>
          </Nav>
          <Nav aria-label="Favorites">
            <NavGroup label="Favorites">
              <NavItem href="#" icon={<TimelineIcon />}>Roadmap</NavItem>
              <NavItem href="#" icon={<NotebookIcon />}>Weekly sync</NavItem>
              <NavItem href="#" icon={<BookIcon />}>Guidelines</NavItem>
            </NavGroup>
          </Nav>
          <Nav aria-label="Teamspaces">
            <NavGroup label="Teamspaces" actions={iconButton("New teamspace page", <AddIcon />)}>
              <TreeView aria-label="Teamspaces" size="sm" items={TEAMSPACES} defaultExpandedIds={["product", "launches"]} currentId="q4" />
            </NavGroup>
          </Nav>
          <Nav aria-label="Private">
            <NavGroup label="Private" actions={iconButton("New private page", <AddIcon />)}>
              <TreeView aria-label="Private" size="sm" items={PRIVATE} defaultExpandedIds={["notes"]} />
            </NavGroup>
          </Nav>
        </div>
      </Panel>

      <main className="px-docs__main">
        <Titlebar variant="plain"
          end={<>
            <span className="px-docs__edited">Edited 2h ago</span>
            <Button size="sm" variant="ghost" tone="neutral">Share</Button>
            {iconButton("Comments", <ChatIcon />)}
            {iconButton("Remove from favorites", <StarFilledIcon />, { selected: true })}
            {iconButton("More", <MoreHorizontalIcon />)}
          </>}>
          <Breadcrumb nowrap>
            <BreadcrumbList>
              <BreadcrumbItem><BreadcrumbLink href="#">Product</BreadcrumbLink></BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem><BreadcrumbLink href="#">Launches</BreadcrumbLink></BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem><BreadcrumbPage>Q4 launch plan</BreadcrumbPage></BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </Titlebar>

        <div className="px-docs__body">
          <article className="px-docs__page">
            <header className="px-docs__head">
              <Avatar size="lg" shape="square" icon={<RocketIcon />} aria-hidden="true" />
              <h1 className="px-docs__title">Q4 launch plan</h1>
              <DescriptionList className="px-docs__props" layout="columns">
                <DescriptionListItem term="Status" icon={<CircleProgressIcon />}><Badge tone="info" dot>In progress</Badge></DescriptionListItem>
                <DescriptionListItem term="Owner" icon={<PersonIcon />}>{person("DT")}</DescriptionListItem>
                <DescriptionListItem term="Due date" icon={<CalendarIcon />}><time dateTime="2026-11-24">November 24, 2026</time></DescriptionListItem>
                <DescriptionListItem term="Tags" icon={<TagIcon />}>
                  <span className="px-docs__tags"><Tag color="blue">Launch</Tag><Tag color="purple">Q4</Tag><Tag color="orange">Marketing</Tag></span>
                </DescriptionListItem>
              </DescriptionList>
            </header>

            <div className="px-docs__blocks">
              <p className="px-docs__text">
                This plan covers everything that ships in the fourth quarter and who owns each part. It follows
                the <Link href="#">launch checklist</Link> and replaces the draft from the last planning cycle.
              </p>
              <p className="px-docs__text">
                <Mention kind="person" href="#">David Tee</Mention> runs the weekly review. The next one is
                on <Mention kind="date" dateTime="2026-11-12">November 12</Mention>, and every open task needs an owner before then.
              </p>

              <h2 className="px-docs__h2">Before launch</h2>
              <div className="px-docs__todos" role="group" aria-label="Before launch">
                <Checkbox label="Confirm the launch date with every team" defaultChecked />
                <Checkbox label="Freeze the pricing page copy" defaultChecked />
                <Checkbox label="Finish the onboarding flow review" />
                <Checkbox label="Run the load test on the import service" />
                <Checkbox label="Schedule the announcement email" />
              </div>

              <Alert layout="multiline" icon={<LightbulbIcon />}>
                Changes after November 17 need a sign-off from the Platform team. Add them to the task list below so nothing ships unreviewed.
              </Alert>

              <Accordion multiple defaultValue={["scope"]}>
                <AccordionItem value="scope" heading="What is in scope">
                  The new onboarding flow, the import service and the updated pricing page. Each one has a task in the list below.
                </AccordionItem>
                <AccordionItem value="later" heading="What moves to next quarter">
                  Shared templates and the mobile editor.
                </AccordionItem>
              </Accordion>

              <div className="px-docs__quote">
                <Separator orientation="vertical" decorative />
                <blockquote className="px-docs__text">Ship the smallest thing that answers the question, then read what people do with it.</blockquote>
              </div>

              <Separator />

              <section className="px-docs__database" aria-labelledby="px-docs-tasks">
                <SectionHeading titleId="px-docs-tasks" title="Launch tasks" />
                <div className="px-docs__views">
                  <Tabs size="sm" selection="plate" aria-label="Task views" defaultValue="table" items={[
                    { value: "table", label: "Table", icon: <TableIcon /> },
                    { value: "board", label: "Board", icon: <KanbanIcon /> },
                    { value: "timeline", label: "Timeline", icon: <TimelineIcon /> },
                  ]} />
                  <span className="px-docs__grow" />
                  <div className="px-docs__tools">
                    <Button size="sm" variant="ghost" tone="neutral" icon={<FilterIcon />}>Filter</Button>
                    <Button size="sm" variant="ghost" tone="neutral" icon={<SortIcon />}>Sort</Button>
                    {iconButton("Search tasks", <SearchIcon />)}
                  </div>
                  <SplitButton size="sm" menuLabel="More ways to add" menu={<>
                    <MenuItem icon={<DocumentIcon />}>Empty page</MenuItem>
                    <MenuItem icon={<FlagIcon />}>From a template</MenuItem>
                  </>}>New</SplitButton>
                </div>
                <Table flush columnDividers interactive aria-label="Launch tasks">
                  <thead>
                    <tr>
                      <TableHeaderCell>{column(<TextIcon />, "Task")}</TableHeaderCell>
                      <TableHeaderCell fit>{column(<CircleProgressIcon />, "Status")}</TableHeaderCell>
                      <TableHeaderCell fit>{column(<PeopleIcon />, "Owner")}</TableHeaderCell>
                      <TableHeaderCell fit>{column(<ClockIcon />, "Due")}</TableHeaderCell>
                      <TableHeaderCell numeric fit>Points</TableHeaderCell>
                    </tr>
                  </thead>
                  <tbody>
                    {TASKS.map(task => (
                      <tr key={task.name}>
                        <TableCell><span className="px-docs__column"><DocumentIcon />{task.name}</span></TableCell>
                        <TableCell fit><Badge tone={task.tone} dot>{task.status}</Badge></TableCell>
                        <TableCell fit>{person(task.who)}</TableCell>
                        <TableCell fit><time dateTime={task.iso}>{task.due}</time></TableCell>
                        <TableCell numeric fit>{task.points}</TableCell>
                      </tr>
                    ))}
                    <tr>
                      <TableCell colSpan={5}><Button size="sm" variant="ghost" tone="neutral" icon={<AddIcon />}>New</Button></TableCell>
                    </tr>
                  </tbody>
                </Table>
                <div className="px-docs__count">
                  <span>Count <strong>{TASKS.length}</strong></span>
                  <span>Sum <strong>{TASKS.reduce((sum, task) => sum + task.points, 0)}</strong></span>
                </div>
              </section>
            </div>
          </article>
        </div>
      </main>
    </div>
  );
}
