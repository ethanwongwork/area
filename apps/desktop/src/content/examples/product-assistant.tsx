/**
 * Product screen: an assistant's desktop window, 1440 × 900, a conversation with its artifact open beside it. A stress
 * test of Area: every control, surface, text style and colour is an Area component or token; the classes
 * (`px-assistant*`, styles/product-assistant.css) only lay the regions out.
 *
 * Three regions, each with its own header on the window's top line:
 *   sidebar   a docked Panel, 288 wide (measured: docs/research/claude-code-ui-audit-2026-10-31.md): the toggle, the
 *             places, Starred and Recents, the person at its foot
 *   main      the chat's title as a menu and Share; the thread in a 768 column that keeps 12 a side and no other side
 *             padding beside an open artifact (measured: docs/research/chat-kit-2026-11-02/live.md); the composer
 *             docked at the column's foot
 *   artifact  a docked Panel, 45% of the window (pick: the brief's proportion; the thread keeps over 352 beside it,
 *             area-ui-compose shell.md): title, Preview / Code, version, copy, download, close; the artifact itself,
 *             a small dashboard; a footer line
 *
 * Settings on the root: Grey = Warm (`data-area-neutral="warm"`), the nearest Area has to the product's warm page.
 * No product or company names; the person is David Tee.
 */
import {
  Avatar, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Chart, ChartNumber, Composer, ComposerAttach, ComposerNote,
  CopyButton, Menu, MenuItem, MenuSeparator, Message, MessageActions, ModelPicker, Nav, NavGroup, NavItem, Panel, Reasoning, ScrollArea, SectionHeading,
  Segmented, Step, Table, Titlebar,
} from "@area/react";
import {
  ChatAddIcon, ChatIcon, ChevronDownIcon, ChevronsUpDownIcon, ClockIcon, CodeIcon, DismissIcon, DownloadIcon, EyeIcon, FolderIcon,
  PanelLeftIcon, RefreshIcon, SearchIcon, ShapesIcon, ShareIcon, SlidersIcon, ThumbsDownIcon, ThumbsUpIcon,
} from "@area/icons";

const CURRENT = "Q3 retention dashboard";
const STARRED = ["Weekly metrics review", "Pricing page copy"];
const RECENTS = [
  CURRENT,
  "Onboarding email sequence",
  "Rewrite the release notes",
  "Interview questions for a designer",
  "Fix a flaky date test",
  "Compare two vendor contracts",
  "Plan a team offsite in Lisbon",
  "Summarize the churn survey",
  "SQL for monthly active users",
  "Ideas for the changelog page",
  "Explain cohort analysis simply",
  "Draft a reply to the supplier",
];

const MODELS = [
  { value: "model-5", label: "Model 5", description: "Best for everyday work" },
  { value: "model-5-mini", label: "Model 5 Mini", description: "Fastest answers" },
];

const COHORT = [
  { week: "W1", free: 61, plus: 74, team: 82 },
  { week: "W2", free: 47, plus: 66, team: 77 },
  { week: "W3", free: 36, plus: 58, team: 71 },
  { week: "W4", free: 29, plus: 52, team: 67 },
  { week: "W5", free: 26, plus: 49, team: 65 },
  { week: "W6", free: 24, plus: 47, team: 64 },
  { week: "W7", free: 23, plus: 46, team: 63 },
  { week: "W8", free: 22, plus: 45, team: 63 },
];
const PLANS = [{ key: "free", label: "Free" }, { key: "plus", label: "Plus" }, { key: "team", label: "Team" }];
const BY_PLAN = [
  { plan: "Free", accounts: "8,420", week1: "61%", week4: "29%", change: "−1.2 pts" },
  { plan: "Plus", accounts: "3,150", week1: "74%", week4: "52%", change: "+3.1 pts" },
  { plan: "Team", accounts: "1,204", week1: "82%", week4: "67%", change: "+2.4 pts" },
];
const percent = (value: number) => `${value}%`;

const REPLY = "I built a small dashboard from the Q3 export. Week-4 retention is 41.8% overall, and the drop is steepest on the Free plan between weeks 1 and 3.";

const ghost = (label: string, glyph: React.ReactNode) => <Button size="sm" variant="ghost" tone="neutral" iconOnly aria-label={label} icon={glyph} />;

export function ProductAssistantScreen() {
  return (
    <div className="px-assistant" data-area-neutral="warm">
      {/* Sidebar */}
      <Panel className="px-assistant__side" data-area-chrome="" data-area-ground="recessed" flush windowBar bareBar aria-label="Sidebar"
        action={<>{ghost("Close sidebar", <PanelLeftIcon />)}<span className="px-assistant__grow" />{ghost("Search", <SearchIcon />)}</>}
        footer={
          <div className="px-assistant__account">
            <Avatar size="sm" fallback="DT" aria-hidden="true" />
            <span className="px-assistant__person">
              <span className="px-assistant__name">David Tee</span>
              <span className="px-assistant__plan">Pro plan</span>
            </span>
            {ghost("Account", <ChevronsUpDownIcon />)}
          </div>
        }>
        <div className="px-assistant__groups">
          <Nav aria-label="Places">
            <NavItem href="#" icon={<ChatAddIcon />}>New chat</NavItem>
            <NavItem href="#" icon={<ChatIcon />}>Chats</NavItem>
            <NavItem href="#" icon={<FolderIcon />}>Projects</NavItem>
            <NavItem href="#" icon={<ShapesIcon />}>Artifacts</NavItem>
          </Nav>
          <Nav aria-label="Starred">
            <NavGroup label="Starred">
              {STARRED.map(name => <NavItem key={name} href="#">{name}</NavItem>)}
            </NavGroup>
          </Nav>
          <Nav aria-label="Recents">
            <NavGroup label="Recents">
              {RECENTS.map(name => <NavItem key={name} href="#" current={name === CURRENT}>{name}</NavItem>)}
            </NavGroup>
          </Nav>
        </div>
      </Panel>

      {/* Conversation */}
      <main className="px-assistant__main">
        <Titlebar variant="plain" size="sm"
          end={<Button size="sm" variant="outline" tone="neutral" icon={<ShareIcon />}>Share</Button>}>
          <Menu aria-label="Chat" align="start"
            trigger={<Button size="sm" variant="ghost" tone="neutral" trailingIcon={<ChevronDownIcon />}>{CURRENT}</Button>}>
            <MenuItem>Star</MenuItem>
            <MenuItem>Rename</MenuItem>
            <MenuItem>Add to project</MenuItem>
            <MenuSeparator />
            <MenuItem tone="danger">Delete</MenuItem>
          </Menu>
        </Titlebar>

        <ScrollArea className="px-assistant__thread" viewportProps={{ "aria-label": "Conversation" }}>
          <div className="px-assistant__column">
            <div className="px-assistant__turns">
              <Message author="user">
                Can you turn the Q3 retention export into a small dashboard? I mostly need to see where week-4 retention drops, by plan.
              </Message>

              <Message authorName="Assistant"
                actions={
                  <MessageActions>
                    <CopyButton size="sm" variant="ghost" tone="neutral" value={REPLY} label="Copy" />
                    {ghost("Good response", <ThumbsUpIcon />)}
                    {ghost("Bad response", <ThumbsDownIcon />)}
                    {ghost("Retry", <RefreshIcon />)}
                  </MessageActions>
                }>
                <Reasoning seconds={12}>
                  Read the export's columns, grouped accounts into weekly cohorts by signup date, and checked the plan field for gaps before charting.
                </Reasoning>
                <p>{REPLY}</p>
                <p>Three things stand out:</p>
                <ol>
                  <li><strong>Free loses most of its accounts early.</strong> Retention falls from 61% in week 1 to 29% by week 4, then flattens.</li>
                  <li><strong>Plus holds the middle.</strong> It keeps 52% at week 4, up 3.1 points on last quarter.</li>
                  <li><strong>Team barely moves after week 4.</strong> It settles at 63%, so the first month decides almost everything.</li>
                </ol>
                <p>The dashboard has the three headline numbers, the cohort curve for each plan and a table you can sort.</p>
                {/* The reference card: Card has no leading-icon slot, and its thumbnail (84) is far larger than a file mark, so
                    the card carries its words and Open alone (gap: a compact reference row with a 32 icon tile). */}
                <Card size="sm">
                  <CardHeader action={<Button size="sm" variant="outline" tone="neutral">Open</Button>}>
                    <CardTitle>Retention dashboard</CardTitle>
                    <CardDescription>Interactive document, version 2</CardDescription>
                  </CardHeader>
                </Card>
              </Message>

              <Message author="user">
                Nice. Can you add a row for annual plans and make the chart weekly instead of monthly?
              </Message>

              <Message authorName="Assistant" streaming>
                <Step verb="Editing" detail="Retention dashboard" status="running" />
                <p>The chart is already weekly, so I&rsquo;m keeping it as it is and adding the annual split. Annual accounts are a subset of Plus and Team, so the new row</p>
              </Message>
            </div>
          </div>
        </ScrollArea>

        <div className="px-assistant__dock">
          <div className="px-assistant__column">
            <Composer layout="stacked" placeholder="Reply…" label="Reply" loading onStop={() => undefined}
              leadingActions={<>
                <ComposerAttach label="Add files" />
                <Button variant="ghost" tone="neutral" iconOnly aria-label="Tools" icon={<SlidersIcon />} />
                <Button variant="ghost" tone="neutral" iconOnly defaultSelected aria-label="Extended thinking" icon={<ClockIcon />} />
              </>}
              trailingActions={<ModelPicker items={MODELS} defaultValue="model-5" />}
              footer={<ComposerNote>Answers can contain mistakes. Check important details.</ComposerNote>} />
          </div>
        </div>
      </main>

      {/* Artifact */}
      <Panel className="px-assistant__artifact" flush windowBar bareBar title="Retention dashboard" titleLevel={2}
        resizable="start" defaultWidth={648 /* pick: 45% of 1440 */} minWidth={320 /* measured: shell.md, side panel floor */} maxWidth={800 /* main less the thread's 352 */}
        action={<>
          <Segmented size="sm" aria-label="View" defaultValue="preview"
            items={[{ value: "preview", label: "Preview", icon: <EyeIcon /> }, { value: "code", label: "Code", icon: <CodeIcon /> }]} />
          <Menu aria-label="Version" align="end"
            trigger={<Button size="sm" variant="ghost" tone="neutral" trailingIcon={<ChevronDownIcon />}>Version 2</Button>}>
            <MenuItem radio checked description="Just now">Version 2</MenuItem>
            <MenuItem radio checked={false} description="4 minutes ago">Version 1</MenuItem>
          </Menu>
          <CopyButton size="sm" variant="ghost" tone="neutral" value="Retention dashboard" label="Copy" />
          {ghost("Download", <DownloadIcon />)}
          {ghost("Close", <DismissIcon />)}
        </>}
        footer={
          <div className="px-assistant__foot">
            <span>Version 2 of 2 · Edited just now</span>
            <Button size="sm" variant="soft" tone="neutral">Publish</Button>
          </div>
        }>
        <div className="px-assistant__artifact-body">
          <SectionHeading level={3} title="Q3 retention" lede="Accounts that signed up from July to September, by plan." />
          <div className="px-assistant__kpis">
            <Card size="sm"><CardContent><ChartNumber label="Week-4 retention" value="41.8%" change="2.3 pts" direction="up" tone="success" /></CardContent></Card>
            <Card size="sm"><CardContent><ChartNumber label="Week-1 retention" value="68.2%" change="0.9 pts" direction="up" tone="success" /></CardContent></Card>
            <Card size="sm"><CardContent><ChartNumber label="Churned accounts" value="312" change="8.1%" direction="down" tone="success" /></CardContent></Card>
          </div>
          <Card>
            <CardContent>
              <CardHeader><CardTitle>Retention by week since signup</CardTitle></CardHeader>
              <Chart kind="line" size="md" label="Retention by week since signup" xLabel="Week" x="week" data={COHORT} series={PLANS} formatValue={percent} />
            </CardContent>
          </Card>
          <Table size="sm" aria-label="Retention by plan">
            <thead><tr><th>Plan</th><th>Accounts</th><th>Week 1</th><th>Week 4</th><th>Change</th></tr></thead>
            <tbody>
              {BY_PLAN.map(row => (
                <tr key={row.plan}><td>{row.plan}</td><td>{row.accounts}</td><td>{row.week1}</td><td>{row.week4}</td><td>{row.change}</td></tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Panel>
    </div>
  );
}
