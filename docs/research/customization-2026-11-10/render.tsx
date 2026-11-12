// Server-renders the real Area components the review page shows. Bundled and run by build-page.mjs:
// the output is a map of named HTML fragments, styled by packages/styles/dist/area.css in the page.
import { renderToStaticMarkup } from "react-dom/server";
import type { ReactNode } from "react";
import {
  Approval, Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, CardValue, Chart, Checkbox, Chip, Composer,
  Dialog, Input, Menu, MenuItem, MenuLabel, MenuSeparator, Message, Nav, NavGroup, NavItem, Popover, PopoverBody, PopoverHeader, PopoverTitle,
  Progress, Radio, RadioGroup, Segmented, Select, Slider, Switch, Table, TableCell, TableHeaderCell, Tag, Toolbar, ToolbarGroup, ToolbarItem, ToolbarSeparator, Toast,
} from "@area/react";
import { AddCircleIcon, ArrowRightIcon, ArrowUpIcon, ChatIcon, DismissIcon, LinkIcon, ListIcon, ExpandIcon, GlobeIcon, MinusIcon, PencilIcon, BellIcon, CalendarIcon, ChartIcon, DownloadIcon, FilterIcon, FolderIcon, HomeIcon, InboxIcon, MoreHorizontalIcon, SearchIcon, SettingsIcon, StarIcon } from "@area/icons";

const out: Record<string, string> = {};
const put = (name: string, node: ReactNode) => { out[name] = renderToStaticMarkup(<>{node}</>); };
const noop = () => {};

/* ---------- Close-ups: one family group each ---------- */
const buttonsPrimary = <div className="row"><Button>Save changes</Button><Button iconOnly aria-label="Favorite" icon={<StarIcon />} /><Button size="sm">Publish</Button></div>;
const buttonsSecondary = <div className="row"><Button variant="outline">Cancel</Button><Button variant="soft">Duplicate</Button><Button variant="ghost">Skip</Button></div>;
const fields = <div className="col"><Input placeholder="Search projects" leadingIcon={<SearchIcon />} aria-label="Search projects" /><Input defaultValue="David Tee" aria-label="Name" /><Select aria-label="Role" defaultValue="editor"><option value="editor">Editor</option><option value="viewer">Viewer</option></Select></div>;
const toggles = <div className="col">
  <div className="row"><Switch label="Notifications" defaultChecked /><Switch label="Digest" /></div>
  <div className="row"><Checkbox label="Remember" defaultChecked /><Checkbox label="Share" /><RadioGroup aria-label="Size" defaultValue="a" orientation="horizontal"><Radio value="a" label="Fit" /><Radio value="b" label="Fill" /></RadioGroup></div>
  <Slider aria-label="Volume" defaultValue={60} />
  <Segmented aria-label="View" defaultValue="list" items={[{ value: "list", label: "List" }, { value: "board", label: "Board" }, { value: "table", label: "Table" }]} />
  <Progress value={64} label="Storage" />
</div>;
const badges = <div className="row wrap"><Badge variant="solid">New</Badge><Badge variant="solid" tone="info">Beta</Badge><Badge variant="solid" tone="success">Live</Badge><Badge variant="solid" tone="danger">Failed</Badge><Badge>Draft</Badge><Badge tone="success">Paid</Badge><Tag color="blue">Design</Tag><Tag color="green">Research</Tag><Chip selected>Mine</Chip><Chip>Shared</Chip></div>;
const card = <Card><CardHeader><CardTitle>Storage</CardTitle><CardDescription>Team plan</CardDescription></CardHeader><CardContent><CardValue>64%</CardValue><Progress value={64} label="Storage used" /></CardContent></Card>;
const menu = <Menu aria-label="Project actions"><MenuLabel>Project</MenuLabel><MenuItem icon={<StarIcon />}>Add to favorites</MenuItem><MenuItem icon={<DownloadIcon />} shortcut="⌘E">Export</MenuItem><MenuItem checked>Show archived</MenuItem><MenuSeparator /><MenuItem tone="danger">Delete project</MenuItem></Menu>;
const popover = <Popover aria-label="Share"><PopoverHeader><PopoverTitle>Share this project</PopoverTitle></PopoverHeader><PopoverBody><Input defaultValue="david@example.com" aria-label="Email" /><div className="row end"><Button variant="outline" size="sm">Copy link</Button><Button size="sm">Invite</Button></div></PopoverBody></Popover>;
const toolbar = <Toolbar variant="surface" aria-label="Formatting"><ToolbarGroup><ToolbarItem><Button variant="ghost" iconOnly aria-label="Filter" icon={<FilterIcon />} /></ToolbarItem><ToolbarItem><Button variant="ghost" iconOnly aria-label="Calendar" icon={<CalendarIcon />} /></ToolbarItem></ToolbarGroup><ToolbarSeparator /><ToolbarItem><Button variant="ghost">Sort</Button></ToolbarItem><ToolbarItem><Button variant="ghost" iconOnly aria-label="More" icon={<MoreHorizontalIcon />} /></ToolbarItem></Toolbar>;
const rows = [["Onboarding flow", "Design", "Live", "Nov 4", "1,204"], ["Pricing page", "Research", "Draft", "Nov 2", "318"], ["Checkout", "Design", "Live", "Oct 30", "2,910"], ["Release notes", "Research", "Failed", "Oct 28", "76"]] as const;
const table = <Table interactive aria-label="Projects"><thead><tr><TableHeaderCell>Name</TableHeaderCell><TableHeaderCell>Team</TableHeaderCell><TableHeaderCell>Status</TableHeaderCell><TableHeaderCell>Updated</TableHeaderCell><TableHeaderCell numeric>Views</TableHeaderCell></tr></thead>
  <tbody>{rows.map((r, i) => <tr key={r[0]} aria-selected={i === 1 ? true : undefined} data-selected={i === 1 ? "" : undefined}><TableCell>{r[0]}</TableCell><TableCell><Tag color={r[1] === "Design" ? "blue" : "green"}>{r[1]}</Tag></TableCell><TableCell><Badge tone={r[2] === "Live" ? "success" : r[2] === "Failed" ? "danger" : "neutral"}>{r[2]}</Badge></TableCell><TableCell>{r[3]}</TableCell><TableCell numeric>{r[4]}</TableCell></tr>)}</tbody></Table>;
const nav = <Nav aria-label="Workspace"><NavGroup><NavItem href="#" icon={<HomeIcon />}>Home</NavItem><NavItem href="#" icon={<InboxIcon />} trailing={<Badge>4</Badge>}>Inbox</NavItem><NavItem href="#" icon={<FolderIcon />} current>Projects</NavItem><NavItem href="#" icon={<ChartIcon />}>Reports</NavItem><NavItem href="#" icon={<SettingsIcon />}>Settings</NavItem></NavGroup></Nav>;
const chartData = [{ m: "Jun", a: 32, b: 18 }, { m: "Jul", a: 41, b: 22 }, { m: "Aug", a: 38, b: 27 }, { m: "Sep", a: 52, b: 31 }, { m: "Oct", a: 61, b: 36 }];
const chart = <Chart kind="bar" size="sm" label="Views by month" x="m" data={chartData} series={[{ key: "a", label: "Design" }, { key: "b", label: "Research" }]} />;
const prose = <div className="prose"><h3>Release notes</h3><p>The onboarding flow now saves progress between steps, so people can leave and come back. <a className="area-link" href="#">Read the full notes</a>.</p><p>Exports finish about twice as fast for projects over 500 pages.</p></div>;

put("buttons-primary", buttonsPrimary); put("buttons-secondary", buttonsSecondary); put("fields", fields); put("toggles", toggles); put("badges", badges);
put("card", card); put("menu", menu); put("popover", popover); put("toolbar", toolbar); put("table", table); put("nav", nav); put("chart", chart); put("prose", prose);
put("toast", <Toast title="Export ready" description="Onboarding flow, 24 pages" />);
put("dialog", <Dialog open title="Delete project?" description="This removes 24 pages for everyone on the team." footer={<><Button variant="outline">Cancel</Button><Button tone="danger">Delete</Button></>} />);

/* ---------- The composed screen ---------- */
put("screen", <div className="scr">
  <aside className="scr__side" data-mx="chrome"><div className="scr__brand">Workspace</div>{nav}</aside>
  <div className="scr__main">
    <header className="scr__bar" data-mx="chrome"><strong>Projects</strong><span className="grow" /><Input size="sm" placeholder="Search" leadingIcon={<SearchIcon />} aria-label="Search" /><Button variant="ghost" iconOnly aria-label="Notifications" icon={<BellIcon />} /><Button variant="outline" size="sm">Share</Button><Button size="sm">New project</Button></header>
    <div className="scr__body">
      <div className="scr__cards">
        <Card><CardHeader><CardTitle>Views</CardTitle><CardDescription>Last 5 months</CardDescription></CardHeader><CardContent>{chart}</CardContent></Card>
        <Card><CardHeader><CardTitle>Publishing</CardTitle><CardDescription>Who sees new pages</CardDescription></CardHeader><CardContent><div className="col">
          <Segmented aria-label="Audience" defaultValue="team" fullWidth items={[{ value: "me", label: "Only me" }, { value: "team", label: "Team" }, { value: "all", label: "Anyone" }]} />
          <Input defaultValue="Onboarding flow" aria-label="Title" />
          <Switch label="Email the team" defaultChecked /><Checkbox label="Include drafts" defaultChecked />
          <Slider aria-label="Image quality" defaultValue={70} />
          <div className="row end"><Button variant="outline">Cancel</Button><Button>Publish</Button></div>
        </div></CardContent></Card>
      </div>
      <div className="scr__chips">{badges}</div>
      {table}
      {prose}
    </div>
    <div className="scr__menu">{menu}</div>
  </div>
</div>);

/* ---------- Part 3: the question card kinds, from Approval, Slider, Segmented, Input, Composer ---------- */
const pic = (kind: string) => <span className={`pg pg--${kind}`} aria-hidden="true"><i /><i /><i /><i /></span>;
const Q = (name: string, node: ReactNode) => put("q-" + name, node);
Q("ab", <Approval layout="grid" title="Which feels closer?" description="Two takes on the same screen. Pick one and we refine from there." onChoose={noop} onDismiss={noop} dismissLabel="Skip" onInstead={noop} insteadPlaceholder="Something else"
  items={[{ value: "a", label: "A · Quiet", description: "Flat page, fine lines", visual: pic("quiet") }, { value: "b", label: "B · Layered", description: "Tinted panels, soft lift", visual: pic("layered") }]} />);
Q("pick", <Approval title="How round are the corners?" description="Buttons, fields, cards and menus follow together." onChoose={noop} onDismiss={noop} dismissLabel="Skip" onInstead={noop} insteadPlaceholder="A number, 0 to 14" value="10"
  items={[{ value: "4", label: "Crisp", description: "4" }, { value: "10", label: "Soft", description: "10 · Recommended" }, { value: "14", label: "Round", description: "14" }, { value: "pill", label: "Pill", description: "Fully round controls" }]} />);
Q("multi", <Approval title="Where does the accent show?" description="Pick any. Unpicked parts stay neutral." onChoose={noop} onDismiss={noop} dismissLabel="Skip"
  items={[{ value: "buttons", label: "Primary buttons" }, { value: "selection", label: "Selected rows and switches" }, { value: "links", label: "Links" }, { value: "focus", label: "Focus ring" }]} footer={<Button size="sm">Continue</Button>} />);
Q("slider", <Approval title="How much lift do menus get?" description="Drag and watch the menu. Light page only: on a near-black page the shadow hides and the edge does the work." onDismiss={noop} dismissLabel="Skip" items={[]} footer={<><Button size="sm" variant="outline">Use default</Button><Button size="sm">Continue</Button></>}>
  <Slider variant="bar" labelPosition="inside" label="Lift" aria-label="Lift" defaultValue={5} min={0} max={8} step={1} stepMarks startLabel="Flat" endLabel="High" readout />
</Approval>);
Q("typed", <Approval title="What is the accent color?" description="A hex value, a color name, or pick below." onDismiss={noop} dismissLabel="Skip" items={[]} footer={<Button size="sm">Continue</Button>}>
  <div className="row wrap"><Input monospace defaultValue="#0B6BFF" aria-label="Accent hex" prefix="Hex" /><Segmented aria-label="Source" defaultValue="hex" items={[{ value: "hex", label: "Hex" }, { value: "name", label: "Name" }, { value: "pick", label: "Picker" }]} /></div>
</Approval>);
Q("keep", <Approval variant="plain" title="Corners set to Soft (10)" description="Applied to the theme. Nothing is published until you publish." onChoose={noop} items={[{ value: "keep", label: "Keep" }, { value: "undo", label: "Undo" }, { value: "tweak", label: "Adjust" }]} />);
put("composer", <Composer placeholder="Describe a change, or answer in your own words" label="Message" onSubmit={noop} />);
put("msg-user", <Message author="user">Soft (10)</Message>);
put("msg-asst", <Message author="assistant">Corners are 10 everywhere now. Next, how much the page layers.</Message>);

/* ---------- A compact kit for the style recipes: panel, bar, form card, menu, table rows ---------- */
put("kit", <div className="kit">
  <aside className="kit__side" data-mx="panel">{nav}</aside>
  <div className="kit__main">
    <div className="kit__bar" data-mx="bar"><Segmented size="sm" aria-label="View" defaultValue="list" items={[{ value: "list", label: "List" }, { value: "board", label: "Board" }]} /><span className="grow" /><Button variant="outline" size="sm">Cancel</Button><Button size="sm">Save</Button></div>
    <div className="kit__cols">
      <Card><CardHeader><CardTitle>Publishing</CardTitle><CardDescription>Who sees new pages</CardDescription></CardHeader><CardContent><div className="col">
        <Input defaultValue="Onboarding flow" aria-label="Title" />
        <div className="row"><Switch label="Email the team" defaultChecked /><Checkbox label="Drafts" defaultChecked /></div>
        <Slider aria-label="Image quality" defaultValue={60} />
        <div className="row wrap"><Badge variant="solid">New</Badge><Badge variant="solid" tone="success">Live</Badge><Badge>Draft</Badge><Tag color="blue">Design</Tag></div>
      </div></CardContent></Card>
      <div className="kit__menu">{menu}</div>
    </div>
  </div>
</div>);

/* ---------- The playground's controls: real Slider and Segmented ---------- */
const LEVERS = [["curve", "Curve", 50], ["edge", "Edge light", 50], ["well", "Well depth", 50], ["glass", "Glass", 50], ["glow", "Glow", 0], ["grain", "Grain", 0], ["contact", "Contact", 0]] as const;
for (const [id, label, value] of LEVERS) put("lever-" + id, <Slider variant="bar" labelPosition="inside" label={label} aria-label={label} defaultValue={value} min={0} max={100} step={5} readout />);
const seg = (name: string, label: string, items: [string, string][], value: string) => put("seg-" + name, <Segmented size="sm" aria-label={label} defaultValue={value} items={items.map(([v, l]) => ({ value: v, label: l }))} />);
seg("theme", "Mode", [["light", "Light"], ["dark", "Dark"]], "light");
seg("compare", "Compare", [["after", "With material"], ["before", "Without"]], "after");
seg("action", "Buttons", [["neutral", "Neutral"], ["accent", "Accent"]], "neutral");
seg("layers", "Page", [["0", "Flat page"], ["60", "Layered page"]], "0");

/* ---------- The ten-question run ---------- */
const sw = (c: string) => <span className="sw" style={{ background: c }} aria-hidden="true" />;
const R = (name: string, node: ReactNode) => put("run-" + name, node);
const foot = { onDismiss: noop, dismissLabel: "Skip" } as const;
R("1", <Approval title="What are you making?" description="This picks the screen you judge on and the starting size." onChoose={noop} {...foot} onInstead={noop} insteadPlaceholder="Something else"
  items={[{ value: "workspace", label: "A tool people work in all day", description: "Recommended start: compact" }, { value: "dashboard", label: "A dashboard" }, { value: "site", label: "A content site" }, { value: "phone", label: "A phone app" }]} />);
R("2", <Approval layout="grid" title="Which is closer?" description="Same screen, two ways to separate things. Hover to preview." onChoose={noop} {...foot}
  items={[{ value: "quiet", label: "Quiet", description: "Flat page, fine lines", visual: pic("quiet") }, { value: "layered", label: "Layered", description: "Tinted panels, soft lift", visual: pic("layered") }]} />);
R("3a", <Approval title="How visible are the lines?" description="You picked Quiet, so lines do the separating. Drag and watch the cards and the table." {...foot} items={[]} footer={<><Button size="sm" variant="outline">Use default</Button><Button size="sm">Continue</Button></>}>
  <Slider variant="bar" labelPosition="inside" label="Lines" aria-label="Lines" defaultValue={4} min={0} max={8} step={0.5} startLabel="Faint" endLabel="Strong" readout />
</Approval>);
R("3b", <Approval title="How far apart are the layers?" description="You picked Layered, so tone does the separating. Drag and watch the side panel and cards." {...foot} items={[]} footer={<><Button size="sm" variant="outline">Use default</Button><Button size="sm">Continue</Button></>}>
  <Slider variant="bar" labelPosition="inside" label="Layers" aria-label="Layers" defaultValue={60} min={0} max={100} step={20} startLabel="Close" endLabel="Apart" readout />
</Approval>);
R("4", <Approval title="What is the accent color?" description="Pick one, or type a hex value or a color name." onChoose={noop} {...foot} onInstead={noop} insteadPlaceholder="#0B6BFF, or a name"
  items={[{ value: "blue", label: "Blue", visual: sw("#0b6bff") }, { value: "green", label: "Green", visual: sw("#12a150") }, { value: "purple", label: "Purple", visual: sw("#7c4dff") }, { value: "orange", label: "Orange", visual: sw("#f26b1d") }, { value: "none", label: "No accent", description: "Everything stays neutral", visual: sw("#222") }]} />);
R("5", <Approval title="Where does the accent show?" description="Pick any. The rest stays neutral, and the focus ring and links always take it." {...foot}
  items={[{ value: "action", label: "Primary buttons" }, { value: "selection", label: "Selected rows, switches and ticks" }]} footer={<Button size="sm">Continue</Button>} />);
R("6", <Approval layout="grid" title="How round are the corners?" description="Buttons, fields, cards and menus follow together." onChoose={noop} {...foot} onInstead={noop} insteadPlaceholder="A number, 0 to 14"
  items={[{ value: "4", label: "Crisp", visual: pic("c4") }, { value: "10", label: "Soft", description: "Recommended", visual: pic("c10") }, { value: "14", label: "Round", visual: pic("c14") }, { value: "pill", label: "Pill", visual: pic("cpill") }]} />);
R("7", <Approval title="How much room?" description="Row and control height. Type size follows." onChoose={noop} {...foot}
  items={[{ value: "28", label: "Compact", description: "Recommended for a tool people work in all day" }, { value: "32", label: "Default" }, { value: "36", label: "Roomy" }]} />);
R("8", <Approval title="How much lift do menus get?" description="Drag and watch the open menu." {...foot} items={[]} footer={<><Button size="sm" variant="outline">Use default</Button><Button size="sm">Continue</Button></>}>
  <Slider variant="bar" labelPosition="inside" label="Lift" aria-label="Lift" defaultValue={5} min={0} max={8} step={1} stepMarks startLabel="Flat" endLabel="High" readout />
</Approval>);
R("9", <Approval layout="grid" title="Do controls catch light?" description="Flat paint, or a curve and a lit edge on buttons with fields set in." onChoose={noop} {...foot}
  items={[{ value: "flat", label: "Flat", description: "Paint only", visual: pic("flat") }, { value: "lit", label: "Lit", description: "Curve, edge light, wells", visual: pic("lit") }]} />);
R("10", <Approval title="Here it is in dark. Keep it?" description="Same choices on the near-black page. Name it to save." onChoose={noop} items={[{ value: "save", label: "Save theme" }, { value: "adjust", label: "Adjust something" }]}>
  <Input defaultValue="Workspace theme" aria-label="Theme name" prefix="Name" />
</Approval>);
put("btn-undo", <Button variant="ghost" size="sm">Undo</Button>);
put("btn-restart", <Button variant="outline" size="sm">Start over</Button>);

/* ---------- Proof of concept: the reference elements, on Button markup ---------- */
const pocIcon: Record<string, ReactNode> = { pencil: <PencilIcon />, add: <AddCircleIcon />, globe: <GlobeIcon />, up: <ArrowUpIcon />, dismiss: <DismissIcon />, minus: <MinusIcon />, expand: <ExpandIcon /> };
// Untouched Area Buttons: default size, corner, room and type. Only a class for the paint.
for (const [id, label, icon] of [["accept", "Accept"], ["cancel", "Cancel"], ["benefits", "Benefits"], ["edit", "Edit", "pencil"], ["gel", "OK"], ["details", "Details"], ["today", "Today"], ["create", "Create", "add"], ["search", "Search", "globe"], ["glass", "Create"]] as const)
  put("poc-" + id, <Button className={"poc-" + id} icon={icon ? pocIcon[icon] : undefined}>{label}</Button>);
for (const [id, cls, icon, name] of [["up", "up", <ArrowUpIcon />, "Send"], ["red", "red", <DismissIcon />, "Close"], ["yellow", "yellow", <MinusIcon />, "Minimize"], ["green", "green", <ExpandIcon />, "Expand"], ["tile1", "tile", <ChatIcon />, "Message"], ["tile2", "tile", <LinkIcon />, "Link"]] as const)
  put("poc-" + id, <Button className={"poc-" + cls} iconOnly aria-label={name} icon={icon} />);
put("poc-frame", <Button className="poc-frame">Select style</Button>);
put("poc-frameblue", <Button className="poc-frameblue">Select style</Button>);
put("poc-lets", <Button className="poc-lets">Let's talk</Button>);
put("poc-send", <Button className="poc-send">Send</Button>);
put("poc-getit", <Button className="poc-getit" trailingIcon={<ArrowRightIcon />}>Get it now</Button>);
put("poc-seg", <Segmented className="poc-seg" aria-label="View" defaultValue="list" items={[{ value: "list", label: "List" }, { value: "board", label: "Board" }]} />);
put("poc-plain", <Button icon={<GlobeIcon />}>Button</Button>);
for (const id of ["glass", "up", "getit", "lets", "tile", "send", "darkthumb", "yellow", "frame", "accept", "cancel", "benefits", "edit", "gel", "details", "today", "create", "search"]) put("one-" + id, <Button className={"one one-" + id} icon={<GlobeIcon />}>Button</Button>);

process.stdout.write(JSON.stringify(out));
