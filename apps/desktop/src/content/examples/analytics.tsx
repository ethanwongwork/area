/**
 * Analytics: a product analytics dashboard built only from Area, the first of the Examples (owner, 2026-10-17: "test
 * this with a sample ui dashboard built entirely from this design system, i will start with the defaults then move on
 * to materials and other axis of customization"). It renders on the Canvas, inside the Canvas's settings, so every
 * Inspector setting reaches it.
 *
 * Everything is an Area component except the chart: Area has no chart yet, so it is an SVG drawn in Area's tokens
 * (accent, edges, muted ink), a gap recorded in docs/COMPONENTS.md. People: David Tee, and teams for the rest.
 */
import { useState } from "react";
import {
  Alert, Avatar, Badge, Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,
  Button, Card, CardContent, CardDescription, CardHeader, CardTitle, CardValue, Checkbox, DateRangePicker, Dialog, Field,
  Input, Menu, MenuItem, MenuSeparator, Meter, Nav, NavGroup, NavItem, Pagination, SearchField, SectionHeading, Segmented,
  Select, Switch, Table, TableCell, TableHeaderCell, TableLink, Tabs, Timeline, TimelineItem, Titlebar, Toaster, Tooltip,
  useToaster,
} from "@area/react";
import {
  ActivityIcon, AddIcon, BarChartIcon, BellIcon, CalendarIcon, ChevronDownIcon, DocumentIcon, DownloadIcon,
  FileExportIcon, HomeIcon, InfoIcon, LayersIcon, MoreHorizontalIcon, PeopleIcon, RepeatIcon, SettingsIcon, TargetIcon,
  TrendingDownIcon, TrendingUpIcon,
} from "@area/icons";

/* Thirty days of active users (thousands), for the chart. */
export const DAILY = [18.2, 18.9, 19.4, 18.7, 17.1, 16.4, 19.8, 20.6, 21.1, 20.4, 21.9, 19.3, 18.8, 22.4, 23.1, 22.7, 23.8, 24.6, 21.9, 20.8, 24.9, 25.7, 26.2, 25.1, 26.8, 23.7, 22.9, 27.1, 27.9, 28.4];
export const PRIOR = [16.1, 16.4, 16.9, 16.2, 15.0, 14.6, 17.1, 17.8, 18.0, 17.6, 18.4, 16.8, 16.2, 18.9, 19.3, 19.0, 19.7, 20.2, 18.4, 17.6, 20.5, 21.0, 21.4, 20.7, 21.8, 19.9, 19.2, 22.0, 22.5, 22.9];

export const KPIS = [
  { title: "Active users", value: "24,318", change: "+12.4%", up: true, note: "vs. 21,640 last period" },
  { title: "New sign-ups", value: "1,204", change: "+8.1%", up: true, note: "vs. 1,114 last period" },
  { title: "Conversion", value: "3.8%", change: "−0.4 pt", up: false, note: "vs. 4.2% last period" },
  { title: "Revenue", value: "$48.2k", change: "+15.9%", up: true, note: "vs. $41.6k last period" },
];
export const CHANNELS = [
  { label: "Organic search", value: 42, text: "10,214 users" },
  { label: "Direct", value: 28, text: "6,809 users" },
  { label: "Referral", value: 18, text: "4,377 users" },
  { label: "Social", value: 12, text: "2,918 users" },
];
const PAGES = [
  { path: "/pricing", views: "18,420", visitors: "9,912", bounce: "32%", trend: "+18%", up: true },
  { path: "/docs/getting-started", views: "14,107", visitors: "8,256", bounce: "21%", trend: "+9%", up: true },
  { path: "/blog/launch-week", views: "11,893", visitors: "7,402", bounce: "47%", trend: "−6%", up: false },
  { path: "/integrations", views: "8,316", visitors: "5,180", bounce: "38%", trend: "+3%", up: true },
  { path: "/changelog", views: "6,054", visitors: "3,977", bounce: "29%", trend: "+12%", up: true },
];

export function Chart({ series, prior }: { series: number[]; prior: number[] }) {
  const w = 640, h = 200, pad = { t: 8, r: 8, b: 22, l: 34 };
  const max = 30, min = 10;
  const x = (i: number) => pad.l + (i / (series.length - 1)) * (w - pad.l - pad.r);
  const y = (v: number) => pad.t + (1 - (v - min) / (max - min)) * (h - pad.t - pad.b);
  const line = (data: number[]) => data.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(" ");
  const area = `${line(series)} L${x(series.length - 1).toFixed(1)} ${y(min)} L${x(0)} ${y(min)} Z`;
  return (
    <svg className="ex-chart" viewBox={`0 0 ${w} ${h}`} role="img" aria-label="Active users per day over 30 days, rising from 18,200 to 28,400, above the previous period throughout">
      {[10, 15, 20, 25, 30].map(v => (
        <g key={v}><line className="ex-chart__grid" x1={pad.l} x2={w - pad.r} y1={y(v)} y2={y(v)} /><text className="ex-chart__label" x={pad.l - 8} y={y(v)} dy="0.35em" textAnchor="end">{v}k</text></g>
      ))}
      {[0, 7, 14, 21, 29].map(i => <text key={i} className="ex-chart__label" x={x(i)} y={h - 4} textAnchor={i === 0 ? "start" : i === series.length - 1 ? "end" : "middle"}>{new Date(2026, 8, 18 + i).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</text>)}
      <path className="ex-chart__area" d={area} />
      <path className="ex-chart__prior" d={line(prior)} />
      <path className="ex-chart__line" d={line(series)} />
      <circle className="ex-chart__dot" cx={x(series.length - 1)} cy={y(series[series.length - 1]!)} r="3.5" />
    </svg>
  );
}

function Actions() {
  const toaster = useToaster();
  return (
    <>
      <Button variant="outline" icon={<DownloadIcon />} onClick={() => toaster.show({ tone: "success", message: "Export started. We'll email David Tee when it's ready." })}>Export</Button>
      <Dialog
        trigger={<Button icon={<AddIcon />}>New report</Button>}
        title="New report"
        description="Reports collect charts and tables you want to share."
        footer={<><Button variant="outline">Cancel</Button><Button>Create report</Button></>}
      >
        <div className="ex-form">
          <Field label="Name"><Input defaultValue="Weekly growth" /></Field>
          <Field label="Data source"><Select defaultValue="web"><option value="web">Web app</option><option value="ios">iOS</option><option value="android">Android</option></Select></Field>
          <Switch label="Email it to the Growth team every Monday" defaultChecked />
          <Checkbox label="Include the previous period" defaultChecked />
        </div>
      </Dialog>
    </>
  );
}

export function AnalyticsDashboard() {
  const [range, setRange] = useState("30d");
  const [metric, setMetric] = useState("users");
  return (
    <Toaster>
      <div className="ex-app">
        <aside className="ex-side" data-area-ground="recessed" data-area-chrome="">
          <div className="ex-brand"><Avatar size="sm" fallback="P" aria-hidden="true" /><span>Pulse</span></div>
          <Nav aria-label="Analytics" style={{ ["--area-nav-inline-size" as string]: "100%" }}>
            <NavGroup label="Analytics">
              <NavItem href="#overview" current icon={<HomeIcon />} onClick={e => e.preventDefault()}>Overview</NavItem>
              <NavItem href="#funnels" icon={<TargetIcon />} onClick={e => e.preventDefault()}>Funnels</NavItem>
              <NavItem href="#retention" icon={<RepeatIcon />} onClick={e => e.preventDefault()}>Retention</NavItem>
              <NavItem href="#users" icon={<PeopleIcon />} onClick={e => e.preventDefault()}>Users</NavItem>
              <NavItem href="#events" icon={<ActivityIcon />} onClick={e => e.preventDefault()}>Events</NavItem>
            </NavGroup>
            <NavGroup label="Reports">
              <NavItem href="#weekly" icon={<DocumentIcon />} onClick={e => e.preventDefault()}>Weekly growth</NavItem>
              <NavItem href="#exports" icon={<FileExportIcon />} onClick={e => e.preventDefault()}>Exports</NavItem>
            </NavGroup>
          </Nav>
          <div className="ex-side__foot">
            <Meter label="Events this month" description="7.4M of 10M" value={74} />
            <Nav aria-label="Workspace" style={{ ["--area-nav-inline-size" as string]: "100%" }}><NavItem href="#settings" icon={<SettingsIcon />} onClick={e => e.preventDefault()}>Settings</NavItem></Nav>
          </div>
        </aside>

        <div className="ex-body">
          <Titlebar variant="plain" end={<>
            <SearchField size="sm" variant="soft" aria-label="Search" placeholder="Search events" />
            <Tooltip trigger={<Button variant="ghost" tone="neutral" size="sm" iconOnly icon={<BellIcon />} aria-label="Notifications" />} describes={false}>Notifications</Tooltip>
            <Avatar size="sm" fallback="DT" aria-label="David Tee" />
          </>}>
            <Breadcrumb><BreadcrumbList>
              <BreadcrumbItem><BreadcrumbLink href="#workspace" onClick={e => e.preventDefault()}>Acme</BreadcrumbLink></BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem><BreadcrumbPage>Overview</BreadcrumbPage></BreadcrumbItem>
            </BreadcrumbList></Breadcrumb>
          </Titlebar>

          <main className="ex-main">
            <div className="ex-head">
              <SectionHeading level={2} title="Overview" lede="Web app · last 30 days, compared with the 30 days before" />
              <div className="ex-head__actions"><Actions /></div>
            </div>

            <div className="ex-filters">
              <Segmented aria-label="Period" value={range} onValueChange={setRange} items={[{ value: "7d", label: "7 days" }, { value: "30d", label: "30 days" }, { value: "90d", label: "90 days" }]} />
              <DateRangePicker aria-label="Dates" icon={<CalendarIcon />} today="2026-10-17" defaultValue={{ start: "2026-09-18", end: "2026-10-17" }} />
              <Select aria-label="Platform" defaultValue="web"><option value="all">All platforms</option><option value="web">Web app</option><option value="ios">iOS</option><option value="android">Android</option></Select>
              <Menu trigger={<Button variant="ghost" iconOnly icon={<MoreHorizontalIcon />} aria-label="More filters" />} align="end">
                <MenuItem>Compare with last year</MenuItem>
                <MenuItem>Exclude internal traffic</MenuItem>
                <MenuSeparator />
                <MenuItem>Reset filters</MenuItem>
              </Menu>
            </div>

            <Alert icon={<InfoIcon />} title="Yesterday's data is still processing">Numbers for Oct 16 may change for up to 6 hours.</Alert>

            <div className="ex-kpis">
              {KPIS.map(k => (
                <Card key={k.title}>
                  <CardContent>
                    <CardHeader action={k.up ? <TrendingUpIcon /> : <TrendingDownIcon />}><CardTitle>{k.title}</CardTitle></CardHeader>
                    <CardValue>{k.value}</CardValue>
                    <CardDescription><Badge tone={k.up ? "success" : "danger"} variant="soft">{k.change}</Badge> {k.note}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="ex-split">
              <Card>
                <CardContent>
                  <CardHeader action={<Segmented size="sm" aria-label="Metric" value={metric} onValueChange={setMetric} items={[{ value: "users", label: "Users" }, { value: "sessions", label: "Sessions" }]} />}>
                    <CardTitle>Active users</CardTitle>
                  </CardHeader>
                  <Chart series={DAILY} prior={PRIOR} />
                  <div className="ex-legend"><span className="ex-legend__now">This period</span><span className="ex-legend__prior">Previous period</span></div>
                </CardContent>
              </Card>
              <Card>
                <CardContent>
                  <CardHeader action={<BarChartIcon />}><CardTitle>Top channels</CardTitle></CardHeader>
                  <div className="ex-meters">{CHANNELS.map(c => <Meter key={c.label} label={c.label} description={c.text} value={c.value} valueText={`${c.value}%`} />)}</div>
                </CardContent>
              </Card>
            </div>

            <div className="ex-split ex-split--wide">
              <Card>
                <CardContent>
                  <CardHeader><CardTitle>Top pages</CardTitle></CardHeader>
                  <Tabs aria-label="Page views" defaultValue="views" items={[{ id: "views", label: "Views" }, { id: "entries", label: "Entries" }, { id: "exits", label: "Exits" }]} />
                  <Table aria-label="Top pages" interactive flush>
                    <thead><tr><th scope="col">Page</th><TableHeaderCell numeric>Views</TableHeaderCell><TableHeaderCell numeric>Visitors</TableHeaderCell><TableHeaderCell numeric>Bounce</TableHeaderCell><th scope="col">Trend</th></tr></thead>
                    <tbody>
                      {PAGES.map(p => (
                        <tr key={p.path}>
                          <td><TableLink href={`#${p.path}`} onClick={e => e.preventDefault()}>{p.path}</TableLink></td>
                          <TableCell numeric>{p.views}</TableCell>
                          <TableCell numeric>{p.visitors}</TableCell>
                          <TableCell numeric>{p.bounce}</TableCell>
                          <td><Badge tone={p.up ? "success" : "danger"} variant="soft">{p.trend}</Badge></td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                  <div className="ex-pager"><Pagination pageCount={8} defaultPage={1} /></div>
                </CardContent>
              </Card>
              <Card>
                <CardContent>
                  <CardHeader action={<Button variant="ghost" size="sm" trailingIcon={<ChevronDownIcon />}>All</Button>}><CardTitle>Recent activity</CardTitle></CardHeader>
                  <Timeline aria-label="Recent activity">
                    <TimelineItem title="Exported “Q3 funnel”" meta="David Tee" time="12m ago" dateTime="2026-10-17T09:48" />
                    <TimelineItem title="Created the Weekly growth report" meta="Growth team" time="2h ago" dateTime="2026-10-17T08:00" />
                    <TimelineItem title="Added the Pricing page goal" meta="Design team" time="Yesterday" dateTime="2026-10-16" />
                    <TimelineItem title="Connected the iOS app" meta="Platform team" time="Oct 14" dateTime="2026-10-14" />
                  </Timeline>
                  <Button variant="soft" fullWidth icon={<LayersIcon />}>View all activity</Button>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </Toaster>
  );
}
