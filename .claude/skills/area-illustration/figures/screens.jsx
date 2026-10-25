/* App screens for the Theme setup review page, built only from Area's React components and rendered to static HTML.
   Layouts follow measured product references (docs/research/app-screens-2026-10-21.md). Every desktop screen is one of
   two shells, so navigation reads the same everywhere:
   - App: a 208 sidebar (workspace row, primary nav, one group, account row at the foot) and a page header (title or
     breadcrumb, actions, then tabs on a rule).
   - Site: one 52 top bar (mark, horizontal nav, search, icon buttons).
   Desktop is 1024 × 576 (16:9). Mobile is an iPhone at 390 × 844 in a device frame: 54 status bar, a 44 header (or a
   large title), an 83 tab bar, and the home indicator. Media are blank shapes (CardMedia, soft Surface). Copy follows
   docs/DESIGN_SYSTEM.md, Example copy; the person is David Tee, others are teams.
   data-st marks what the page holds in a state: hover, press, focus, selected, lift, and a hidden menu. Every text node
   is wrapped in span.tx so the page can draw a screen abstract, semi-abstract or real. */
import { renderToStaticMarkup } from "react-dom/server";
import {
  Accordion, AccordionItem, AlignmentPicker, Avatar, AvatarGroup, Badge, BadgeGroup, Breadcrumb, Calendar, CardOverlay, CommandPalette, Field, MenuLabel, MenuSeparator, Toast, ToolbarSeparator, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage,
  BreadcrumbSeparator, Button, Card, CardCarousel, CardContent, CardDescription, CardFooter, CardHeader, CardMedia, CardTitle, CardValue, Checkbox,
  Chip, CodeBlock, ColorSwatchPicker, Composer, Count, DescriptionList, DescriptionListItem, FileTile, Indicator, Input, Kbd, Link, MenuItem, Message, Meter, ModelPicker, Nav, NavGroup, NavItem,
  NumberField, Pagination, Plan, Progress, PromptSuggestions, Radio, RadioGroup, Reasoning, SearchField, SectionHeading, Segmented, Select, Separator, Slider, Spinner, Surface, Switch, Table, Tabs,
  Tag, Timestamp, Toolbar, ToolbarItem, ToggleGroup, ToggleGroupItem, TreeView,
} from "@area/react";
import {
  AddIcon, ArchiveIcon, BoldIcon, ChevronDownIcon, ColumnsIcon, DismissIcon, ExpandIcon, FrameIcon, HashIcon, ItalicIcon, MinimizeIcon, RedoIcon, RowsIcon, TextAlignCenterIcon, TextAlignLeftIcon, TextAlignRightIcon, UndoIcon, ArrowUpIcon, BellIcon, BookmarkIcon, CalendarIcon, ChatIcon, ChevronLeftIcon, ChevronRightIcon,
  CircleDashedIcon, ClockIcon, CodeIcon, CopyIcon, CreditCardIcon, DocumentIcon, FileCodeIcon, FilterIcon, FlagIcon,
  FolderIcon, GitBranchIcon, GlobeIcon, GridIcon, HeartIcon, HomeIcon, InboxIcon, LayersIcon, MenuIcon, MicIcon,
  MoreHorizontalIcon, PanelLeftIcon, PencilIcon, PlayFilledIcon, RefreshIcon, ReplyIcon, SearchIcon, SendIcon, SettingsIcon,
  ShareIcon, ShoppingBagIcon, ShuffleIcon, SkipBackIcon, SkipForwardIcon, SortIcon, SparkleIcon, StarIcon, TerminalIcon,
  ThumbsDownIcon, ThumbsUpIcon, TrashIcon, VolumeIcon, WalletIcon,
} from "@area/icons";
import { GalleryPanelFigma, GalleryKbdInMenu, GalleryPopoverField, GalleryCommandPalette, GalleryCalendar, GalleryTabs, GallerySegmented } from "../../../../apps/desktop/src/content/demos/gallery.tsx";
import { CardMediaOverlay, CardTemplateMusic, CardTemplatePlan, GalleryCardCarousel } from "../../../../apps/desktop/src/content/demos/card.tsx";
import { BadgeVariants, BadgeGroupWrap } from "../../../../apps/desktop/src/content/demos/badge.tsx";
import { ChipVariants, FieldDefault, SelectField, CheckboxDefault, SliderDefault, SliderSizes, SliderWithLabel, SliderStepMarks, SliderRangeWithInputs, SliderTones } from "../../../../apps/desktop/src/content/demos/form.tsx";
import { GalleryToastNeutral } from "../../../../apps/desktop/src/content/demos/gallery-variants.tsx";

const Row = ({ children, gap = 8, className = "", style, ...rest }) => <div className={`sx-row ${className}`} style={{ gap, ...style }} {...rest}>{children}</div>;
const Col = ({ children, gap = 8, className = "", style, ...rest }) => <div className={`sx-col ${className}`} style={{ gap, ...style }} {...rest}>{children}</div>;
const T = ({ children, k = "body", className = "", style }) => <span className={`sx-t sx-t--${k} ${className}`} style={style}>{children}</span>;
const Media = ({ className = "", style }) => <Surface variant="soft" className={`sx-media ${className}`} style={style} aria-hidden="true" />;
const Icon = ({ label, icon, variant = "ghost", size = "sm", st, pill }) => <Button size={size} variant={variant} iconOnly pill={pill} aria-label={label} icon={icon} data-st={st} />;
const Menu = ({ style }) => (
  <div className="area-menu sx-menu" role="menu" aria-label="Menu" data-st="menu" style={style}>
    <MenuItem data-highlighted="">Item one</MenuItem><MenuItem>Item two</MenuItem><MenuItem>Item three</MenuItem>
  </div>
);
const ITEMS = ["Item one", "Item two", "Item three", "Item four", "Item five", "Item six"];

/* ================================ Desktop shells ================================ */
const Window = ({ children, className = "" }) => (
  <Surface className={`sx-desk ${className}`}>
    <div className="sx-desk__bar"><span className="sx-lights"><i /><i /><i /></span><T k="sm" className="sx-desk__title">Title</T><span /></div>
    <div className="sx-desk__body">{children}</div>
  </Surface>
);
/* The one sidebar every app screen uses. `body` replaces the group when a product puts something else there (a file
   tree, a library). */
const Sidebar = ({ ws = "Team one", wsShort = "T1", primary, current = -1, hover = -1, group = "Label", groupItems = ITEMS.slice(0, 4), groupIcons, groupCurrent = -1, body, top }) => (
  <aside className="sx-sb">
    <div className="sx-sb__ws"><Avatar size="sm" shape="square" fallback={wsShort} aria-label={ws} /><T k="strong" className="sx-grow">{ws}</T><Icon label="Sidebar" icon={<PanelLeftIcon />} /></div>
    {top}
    <Nav aria-label="Primary">{primary.map(([I, t, trailing], i) => (
      <NavItem key={t} href="#" icon={<I />} current={i === current} trailing={trailing} data-st={i === hover ? "hover" : undefined}>{t}</NavItem>))}</Nav>
    {body || <Nav aria-label="Group"><NavGroup label={group}>{groupItems.map((t, i) => {
      const I = groupIcons ? groupIcons[i % groupIcons.length] : null;
      return <NavItem key={t + i} href="#" icon={I ? <I /> : undefined} current={i === groupCurrent}>{t}</NavItem>; })}</NavGroup></Nav>}
    <span className="sx-grow" />
    <div className="sx-sb__foot"><Avatar size="sm" fallback="DT" aria-label="David Tee" /><Col gap={0} className="sx-grow"><T k="strong">David Tee</T><T k="sm">Label</T></Col><Icon label="Settings" icon={<SettingsIcon />} /></div>
  </aside>
);
const Crumbs = ({ items = ["Item one", "Item two"] }) => (
  <Breadcrumb><BreadcrumbList>{items.map((t, i) => (i < items.length - 1
    ? [<BreadcrumbItem key={t}><BreadcrumbLink href="#">{t}</BreadcrumbLink></BreadcrumbItem>, <BreadcrumbSeparator key={t + "s"} />]
    : <BreadcrumbItem key={t}><BreadcrumbPage>{t}</BreadcrumbPage></BreadcrumbItem>))}</BreadcrumbList></Breadcrumb>
);
/* The one page header: a left (title or breadcrumb), actions, and tabs on a rule when the page has views. */
const PageHeader = ({ left, actions, tabs, tabValue = "one" }) => (
  <header className={`sx-ph ${tabs ? "sx-ph--tabs" : ""}`}>
    <div className="sx-ph__row">{left}<Row gap={4}>{actions}</Row></div>
    {tabs ? <Tabs size="sm" aria-label="Views" defaultValue={tabValue} items={tabs.map((t, i) => ({ id: ["one", "two", "three", "four"][i], label: t }))} /> : null}
  </header>
);
const Title = ({ children = "Title" }) => <T k="title">{children}</T>;
const App = ({ sidebar, children, className = "" }) => (
  <Window className={`sx-app ${className}`}>{sidebar}<main className="sx-appmain">{children}</main></Window>
);
const TopBar = ({ hover = 2 }) => (
  <div className="sx-tb">
    <Row gap={8}><Avatar size="sm" shape="square" fallback={<ShoppingBagIcon />} aria-label="Mark" /><T k="strong">Title</T></Row>
    <Nav orientation="horizontal" aria-label="Sections">{ITEMS.slice(0, 4).map((t, i) => <NavItem key={t} href="#" current={i === 0} data-st={i === hover ? "hover" : undefined}>{t}</NavItem>)}</Nav>
    <Row gap={4}><SearchField placeholder="Placeholder" aria-label="Search" style={{ width: 170 }} data-st="focus" /><Icon label="Saved" icon={<HeartIcon />} /><Icon label="Bag" icon={<ShoppingBagIcon />} /><Avatar size="sm" fallback="DT" aria-label="David Tee" /></Row>
  </div>
);
const Site = ({ children, className = "" }) => (
  <Window className={`sx-site ${className}`}><TopBar /><main className="sx-sitemain">{children}</main></Window>
);

/* ================================ Desktop screens ================================ */
const CHAT_PRIMARY = [[PencilIcon, "Item one"], [SearchIcon, "Item two"], [LayersIcon, "Item three"]];
const chatSide = current => <Sidebar ws="Title" wsShort={<SparkleIcon />} primary={CHAT_PRIMARY} hover={0} group="Label" groupItems={ITEMS} groupCurrent={current} />;
const ChatActions = () => <><Button size="sm" variant="ghost" icon={<ShareIcon />} data-st="press">Action</Button><Icon label="More" icon={<MoreHorizontalIcon />} /></>;
const ModelLeft = () => <ModelPicker label="Model" size="sm" defaultValue="one" items={[{ value: "one", label: "Option one" }, { value: "two", label: "Option two" }]} />;
const ChatHome = () => (
  <App sidebar={chatSide(-1)}>
    <PageHeader left={<ModelLeft />} actions={<ChatActions />} />
    <div className="sx-center">
      <T k="greeting">Title</T>
      <div className="sx-col560"><Composer placeholder="Placeholder" label="Message" data-st="focus" /></div>
      <div className="sx-col560"><PromptSuggestions label="Suggestions" items={[{ id: "a", label: "Item one", icon: <SparkleIcon /> }, { id: "b", label: "Item two", icon: <DocumentIcon /> }, { id: "c", label: "Item three", icon: <GlobeIcon /> }]} /></div>
    </div>
    <Menu style={{ left: 16, top: 44, width: 190 }} />
  </App>
);
const ChatThread = () => (
  <App sidebar={chatSide(1)}>
    <PageHeader left={<ModelLeft />} actions={<ChatActions />} />
    <div className="sx-thread">
      <Message author="user">Body text, a short question.</Message>
      <Reasoning seconds={4} />
      <Message author="assistant">
        <h3 className="sx-h3">Title</h3>
        <p>Body text, a description that runs across the column so the answer reads as prose before the code.</p>
        <CodeBlock title="Label" language="ts" code={"const value = 1;\nexport function item(one: number) {\n  return one + value;\n}"} />
      </Message>
      <Row gap={0}>{[[CopyIcon, "Copy"], [ThumbsUpIcon, "Good"], [ThumbsDownIcon, "Bad"], [RefreshIcon, "Again"]].map(([I, t]) => <Icon key={t} label={t} icon={<I />} />)}</Row>
    </div>
    <div className="sx-dock"><Composer placeholder="Placeholder" label="Message" data-st="focus" /></div>
    <Menu style={{ right: 16, top: 44, width: 190 }} />
  </App>
);
const SetRow = ({ title, desc = true, children }) => (
  <div className="sx-setrow"><Col gap={2}><T k="strong">{title}</T>{desc ? <T k="sm">Description</T> : null}</Col><div>{children}</div></div>
);
const Settings = () => (
  <App sidebar={<Sidebar ws="Title" wsShort={<SettingsIcon />} primary={[[SettingsIcon, "Item one"], [SparkleIcon, "Item two"], [BellIcon, "Item three"], [CreditCardIcon, "Item four"], [GlobeIcon, "Item five"]]} current={0} hover={2} body={<span />} />}>
    <PageHeader left={<Title />} actions={<Button size="sm" variant="outline" data-st="press">Secondary</Button>} />
    <div className="sx-scroll sx-colwrap"><div className="sx-col560 sx-stack" style={{ paddingTop: 16 }}>
      <T k="strong">Label</T>
      <Card className="sx-setcard"><CardContent>
        <SetRow title="Label" desc={false}><Select size="sm" aria-label="Label" defaultValue="one" style={{ width: 140 }}><option value="one">Option one</option></Select></SetRow>
        <SetRow title="Label"><span className="sx-mover" data-pop="selection"><Switch aria-label="Label" defaultChecked /></span></SetRow>
        <SetRow title="Label"><Segmented aria-label="Label" size="sm" defaultValue="one" items={[{ value: "one", label: "One" }, { value: "two", label: "Two" }, { value: "three", label: "Three" }]} /></SetRow>
      </CardContent></Card>
      <T k="strong">Label</T>
      <Card className="sx-setcard" data-st="selected"><CardContent>
        <SetRow title="Label"><span className="sx-mover sx-mover--on"><Switch aria-label="Label" /></span></SetRow>
        <SetRow title="Label"><Input size="sm" placeholder="Placeholder" style={{ width: 180 }} data-st="focus" /></SetRow>
      </CardContent></Card>
    </div></div>
    <Menu style={{ right: 20, top: 44, width: 190 }} />
  </App>
);
const NOTION_PRIMARY = [[SearchIcon, "Item one"], [HomeIcon, "Item two"], [InboxIcon, "Item three"]];
const notionSide = current => <Sidebar ws="Team one" wsShort="T1" primary={NOTION_PRIMARY} hover={2} group="Label" groupItems={ITEMS.slice(0, 5)} groupIcons={[DocumentIcon, LayersIcon, CalendarIcon, BookmarkIcon, FolderIcon]} groupCurrent={current} />;
const NotionActions = () => <><Button size="sm" variant="ghost" data-st="press">Action</Button><Icon label="Star" icon={<StarIcon />} /><Icon label="More" icon={<MoreHorizontalIcon />} /></>;
const Prop = ({ icon, label, children }) => <div className="sx-prop"><span className="sx-prop__k">{icon}<T k="sm">{label}</T></span><div>{children}</div></div>;
const Doc = () => (
  <App sidebar={notionSide(0)}>
    <PageHeader left={<Crumbs />} actions={<NotionActions />} />
    <div className="sx-scroll sx-colwrap"><div className="sx-col560 sx-stack" style={{ paddingTop: 20 }}>
      <Avatar size="lg" shape="square" fallback={<DocumentIcon />} aria-label="Page" />
      <T k="page">Title</T>
      <DescriptionList layout="columns" className="sx-props">
        <DescriptionListItem term="Label" icon={<CircleDashedIcon />}><Tag size="sm">Label</Tag></DescriptionListItem>
        <DescriptionListItem term="Label" icon={<CalendarIcon />}><Timestamp dateTime="2026-10-21">Value</Timestamp></DescriptionListItem>
        <DescriptionListItem term="Label" icon={<FlagIcon />}><AvatarGroup size="sm"><Avatar fallback="DT" aria-label="David Tee" /><Avatar fallback="T1" aria-label="Team one" /></AvatarGroup></DescriptionListItem>
      </DescriptionList>
      <Separator />
      <T k="h2">Title</T>
      <T>Body text, a description that runs across the page column so it reads as a paragraph of prose.</T>
      <Col gap={6} data-pop="selection"><Checkbox label="Item one" defaultChecked /><Checkbox label="Item two" /><Checkbox label="Item three" data-st="focus" /></Col>
      <Surface variant="soft" className="sx-callout" data-st="selected"><Row gap={10} style={{ alignItems: "flex-start" }}><SparkleIcon /><T>Description of a note that stands apart from the text.</T></Row></Surface>
      <T>Body text, a second paragraph with a <Link href="#">Label</Link> that continues down the page.</T>
    </div></div>
    <Menu style={{ right: 16, top: 44, width: 190 }} />
  </App>
);
/* Neutral status tags; colour is kept for meaning (Done) and the accent's pops. */
const STATUS = [["Label", "gray"], ["Label", "neutral"], ["Label", "success"]];
const DbActions = () => <><Icon label="Filter" icon={<FilterIcon />} /><Icon label="Sort" icon={<SortIcon />} /><Icon label="Search" icon={<SearchIcon />} /><span data-pop="action"><Button size="sm" data-st="press">Action</Button></span></>;
const Database = () => (
  <App sidebar={notionSide(1)}>
    <PageHeader left={<Title />} actions={<DbActions />} tabs={["One", "Two", "Three"]} />
    <div className="sx-scroll sx-pad">
      <Table size="sm">
        <thead><tr><th>Label</th><th>Label</th><th>Label</th><th>Label</th><th /></tr></thead>
        <tbody>{ITEMS.concat(["Item seven", "Item eight"]).map((t, i) => (
          <tr key={t}><td>{t}</td><td><Tag tone={STATUS[i % 3][1]} size="sm">{STATUS[i % 3][0]}</Tag></td>
            <td><Row gap={6}><Avatar size="sm" fallback={i % 2 ? `T${(i % 3) + 1}` : "DT"} aria-label="Person" /><T>{i % 2 ? `Team ${["one", "two", "three"][i % 3]}` : "David Tee"}</T></Row></td>
            <td>Value</td><td><Checkbox aria-label={t} defaultChecked={i === 2} /></td></tr>))}</tbody>
      </Table>
      <Row className="sx-between" style={{ marginTop: 10 }}><T k="sm">Value</T><Pagination pageCount={4} defaultPage={1} /></Row>
    </div>
    <Menu style={{ right: 16, top: 70, width: 190 }} />
  </App>
);
const Board = () => (
  <App sidebar={notionSide(2)}>
    <PageHeader left={<Title />} actions={<DbActions />} tabs={["One", "Two", "Three"]} tabValue="two" />
    <div className="sx-board">{STATUS.map(([l, tone], c) => (
      <Surface key={c} variant="soft" className="sx-boardcol">
        <Row gap={6}><Tag tone={tone} size="sm">{l}</Tag><Count count={[4, 3, 2][c]} /><span className="sx-grow" /><Icon label="Add" icon={<AddIcon />} /></Row>
        {[0, 1, 2, 3].slice(0, [4, 3, 2][c]).map(i => (
          <Card key={i} size="sm" data-st={c === 1 && i === 0 ? "lift" : c === 0 && i === 1 ? "selected" : undefined}><CardContent>
            <CardTitle>{ITEMS[i]}</CardTitle>
            <Row gap={4} style={{ marginTop: 6 }}><Tag size="sm">Label</Tag><span className="sx-grow" />{i % 2 === 0 ? <AvatarGroup size="sm"><Avatar fallback="DT" aria-label="David Tee" /><Avatar fallback="T1" aria-label="Team one" /></AvatarGroup> : <Timestamp dateTime="2026-10-21">Value</Timestamp>}</Row>
          </CardContent></Card>))}
      </Surface>))}</div>
    <Menu style={{ right: 16, top: 70, width: 190 }} />
  </App>
);
const FILES = [
  { id: "src", label: "src", icon: <FolderIcon />, children: [
    { id: "a", label: "index.ts", icon: <FileCodeIcon /> }, { id: "b", label: "item.ts", icon: <FileCodeIcon /> }, { id: "c", label: "value.ts", icon: <FileCodeIcon /> }] },
  { id: "docs", label: "docs", icon: <FolderIcon />, children: [{ id: "d", label: "readme.md", icon: <DocumentIcon /> }] },
  { id: "e", label: "package.json", icon: <CodeIcon /> },
];
const Editor = () => (
  <App className="sx-editor" sidebar={<Sidebar ws="Title" wsShort={<CodeIcon />} primary={[[FolderIcon, "Item one"], [SearchIcon, "Item two"], [GitBranchIcon, "Item three"]]} current={0} hover={1}
    body={<Col gap={4}><T k="label">Label</T><TreeView aria-label="Files" items={FILES} defaultExpandedIds={["src", "docs"]} defaultSelectedIds={["b"]} /></Col>} />}>
    <PageHeader left={<Crumbs items={["src", "item.ts"]} />} actions={<><Icon label="Run" icon={<PlayFilledIcon />} st="press" /><Icon label="More" icon={<MoreHorizontalIcon />} /></>} tabs={["index.ts", "item.ts", "value.ts"]} tabValue="two" />
    <div className="sx-editor__body">
      <CodeBlock language="ts" code={"import { value } from \"./value\";\n\nexport interface Item {\n  one: number;\n  two: string;\n}\n\nexport function item(one: number): Item {\n  return { one: one + value, two: \"Label\" };\n}\n\nexport const items = [1, 2, 3].map(item);"} />
      <aside className="sx-agent">
        <Message author="user">Body text, a short request.</Message>
        <Plan title="Title" items={[{ id: "1", label: "Item one", status: "done" }, { id: "2", label: "Item two", status: "current" }, { id: "3", label: "Item three", status: "pending" }]} defaultOpen />
        <span className="sx-grow" />
        <Row gap={6}><T k="sm">Label</T><Kbd keys={["⌘", "L"]} size="sm" /></Row>
        <Composer placeholder="Placeholder" label="Message" data-st="focus" />
      </aside>
    </div>
    <footer className="sx-status"><Row gap={8}><GitBranchIcon /><T k="sm">Label</T><Spinner size="sm" label="Label" /></Row><Row gap={10}><T k="sm">Value</T><TerminalIcon /></Row></footer>
    <Menu style={{ right: 16, top: 70, width: 190 }} />
  </App>
);
const Issue = ({ id, title, tag, who, st }) => (
  <div className="sx-issue" data-st={st}>
    <Checkbox aria-label={title} /><T k="sm" className="sx-issue__id">{id}</T><CircleDashedIcon /><T className="sx-grow">{title}</T>
    {tag ? <Tag size="sm">Label</Tag> : null}<Avatar size="sm" fallback={who} aria-label="Assignee" /><T k="sm">Value</T>
  </div>
);
const Issues = () => (
  <App sidebar={<Sidebar primary={[[InboxIcon, "Item one", <Count key="c" count={4} />], [CircleDashedIcon, "Item two"]]} hover={1} group="Label" groupItems={ITEMS.slice(2, 5)} groupIcons={[LayersIcon, FolderIcon, GridIcon]} groupCurrent={0} />}>
    <PageHeader left={<Crumbs items={["Team one", "Item three"]} />} actions={<><Button size="sm" variant="ghost" icon={<FilterIcon />} data-st="press">Action</Button><Button size="sm" variant="outline" icon={<SortIcon />}>Secondary</Button></>} tabs={["One", "Two", "Three"]} />
    <div className="sx-scroll">
      {[["Label", 3, [["ID-12", "Item one", "info", "DT"], ["ID-14", "Item two", null, "T1", "selected"], ["ID-15", "Item three", "warning", "T2"]]],
        ["Label", 5, [["ID-08", "Item four", "success", "DT"], ["ID-09", "Item five", null, "T3"], ["ID-10", "Item six", "info", "T1"], ["ID-11", "Item seven", null, "DT"], ["ID-13", "Item eight", "warning", "T2"]]]].map(([g, n, rows], gi) => (
        <div key={gi}>
          <div className="sx-group"><CircleDashedIcon /><T k="strong">{g}</T><Count count={n} /><span className="sx-grow" /><Icon label="Add" icon={<AddIcon />} /></div>
          {rows.map(([id, t, tag, who, st]) => <Issue key={id} id={id} title={t} tag={tag} who={who} st={st} />)}
        </div>))}
    </div>
    <Menu style={{ right: 16, top: 70, width: 190 }} />
  </App>
);
const Mail = () => (
  <App className="sx-mail" sidebar={<Sidebar top={<span data-pop="action"><Button size="sm" fullWidth icon={<PencilIcon />} data-st="press">Action</Button></span>}
    primary={[[InboxIcon, "Item one", <Count key="a" count={3} />], [StarIcon, "Item two"], [SendIcon, "Item three"], [DocumentIcon, "Item four", <Count key="b" count={1} />], [ArchiveIcon, "Item five"]]} current={0} hover={3}
    group="Label" groupItems={["Team one", "Team two"]} groupIcons={[FolderIcon]} />}>
    <div className="sx-mail__split">
      <section className="sx-mail__list">
        <PageHeader left={<Title />} actions={<Segmented aria-label="Show" size="sm" defaultValue="one" items={[{ value: "one", label: "One" }, { value: "two", label: "Two" }]} />} />
        <div className="sx-pad sx-stack" style={{ gap: 6, paddingTop: 0 }}>
          <SearchField placeholder="Placeholder" aria-label="Search" data-st="focus" />
          {[["David Tee", "DT"], ["Team one", "T1"], ["Team two", "T2"], ["Team three", "T3"], ["David Tee", "DT"], ["Team one", "T1"]].map(([n, a], i) => (
            <Card key={i} size="sm" data-st={i === 0 ? "selected" : i === 2 ? "lift" : undefined}><CardContent>
              <Row gap={10} style={{ alignItems: "flex-start" }}><Avatar size="sm" fallback={a} aria-label={n} />
                <Col gap={1} className="sx-grow"><Row className="sx-between"><Row gap={6}>{i < 2 ? <Indicator kind="dot" tone="neutral" label="Unread" /> : null}<T k={i < 2 ? "strong" : "body"}>{n}</T></Row><Timestamp dateTime="2026-10-21T09:41">Value</Timestamp></Row><T k="sm">Description of the message in one line.</T></Col></Row>
            </CardContent></Card>))}
        </div>
      </section>
      <section className="sx-mail__read">
        <PageHeader left={<Toolbar aria-label="Message">{[[ArchiveIcon, "Archive"], [TrashIcon, "Delete"], [FolderIcon, "Move"]].map(([I, t]) => <ToolbarItem key={t}><Button size="sm" variant="ghost" iconOnly aria-label={t} icon={<I />} /></ToolbarItem>)}</Toolbar>} actions={<><Icon label="Reply" icon={<ReplyIcon />} /><Icon label="More" icon={<MoreHorizontalIcon />} /></>} />
        <div className="sx-pad sx-stack sx-grow">
          <T k="h2">Title</T>
          <Row gap={10}><Avatar fallback="DT" aria-label="David Tee" /><Col gap={0}><T k="strong">David Tee</T><T k="sm">Label</T></Col><span className="sx-grow" /><Timestamp dateTime="2026-10-21T09:41">Value</Timestamp></Row>
          <T>Body text, a description that runs across the message so it reads as a short letter of a few lines in the reading pane.</T>
          <T>Description of the next step, then a sign-off.</T>
          <Row gap={8}>{["Label", "Label"].map((l, i) => <FileTile key={i} size="md" name={l} meta="Value" figure="PDF" />)}</Row>
          <span className="sx-grow" />
          <Composer placeholder="Placeholder" label="Reply" />
        </div>
      </section>
    </div>
    <Menu style={{ right: 16, top: 44, width: 190 }} />
  </App>
);
const Stat = ({ value, tone }) => (
  <Card size="sm"><CardContent><Row className="sx-between"><CardDescription>Label</CardDescription><Badge size="sm">Badge</Badge></Row><CardValue>{value}</CardValue><Meter value={60} label="Label" valueText={null} size="sm" /></CardContent></Card>
);
const Dashboard = () => (
  <App sidebar={<Sidebar primary={[[HomeIcon, "Item one"], [InboxIcon, "Item two"], [WalletIcon, "Item three"], [CreditCardIcon, "Item four"]]} current={0} hover={2} group="Label" groupItems={["Team one", "Team two", "Team three"]} groupIcons={[FolderIcon]} />}>
    <PageHeader left={<Title />} actions={<><Segmented aria-label="Range" size="sm" defaultValue="one" items={[{ value: "one", label: "One" }, { value: "two", label: "Two" }, { value: "three", label: "Three" }]} /><Button size="sm" variant="outline" data-st="press">Secondary</Button><span data-pop="action"><Button size="sm">Action</Button></span></>} tabs={["One", "Two", "Three"]} />
    <div className="sx-scroll sx-pad sx-stack">
      <div className="sx-grid4"><Stat value="1,000" tone="success" /><Stat value="2,000" /><Stat value="3,000" tone="warning" /><Stat value="4,000" /></div>
      <Card data-st="selected" className="sx-grow"><CardContent>
        <CardHeader action={<SearchField placeholder="Placeholder" aria-label="Search" style={{ width: 200 }} data-st="focus" />}><CardTitle>Title</CardTitle></CardHeader>
        <Table size="sm"><thead><tr><th>Label</th><th>Label</th><th>Label</th><th>Label</th><th>Value</th></tr></thead>
          <tbody>{[["Item one", "success"], ["Item two", "neutral"], ["Item three", "neutral"], ["Item four", "success"], ["Item five", "warning"]].map(([t, tone], i) => (
            <tr key={t}><td><Row gap={8}><Checkbox aria-label={t} defaultChecked={i === 1} /><T>{t}</T></Row></td><td>Description</td><td><Badge tone={tone} dot size="sm">Badge</Badge></td><td><Progress value={(i + 2) * 15} label="Label" /></td><td>{(i + 1) * 10}</td></tr>))}</tbody></Table>
      </CardContent></Card>
    </div>
    <Menu style={{ right: 100, top: 44, width: 190 }} />
  </App>
);
const Album = () => (
  <App className="sx-album" sidebar={<Sidebar ws="Title" wsShort={<PlayFilledIcon />} primary={[[HomeIcon, "Item one"], [SearchIcon, "Item two"], [LayersIcon, "Item three"]]} current={2} hover={1}
    body={<Col gap={6}><T k="label">Label</T>{ITEMS.slice(0, 4).map((t, i) => <Row key={t} gap={10} className="sx-librow"><Avatar shape="square" fallback={<LayersIcon />} aria-label={t} /><Col gap={0}><T k="strong">{t}</T><T k="sm">Description</T></Col></Row>)}</Col>} />}>
    <PageHeader left={<Crumbs items={["Item three", "Title"]} />} actions={<><Icon label="Share" icon={<ShareIcon />} /><Icon label="More" icon={<MoreHorizontalIcon />} /></>} />
    <div className="sx-scroll sx-pad sx-stack">
      <div className="sx-album__head"><Media className="sx-cover" /><Col gap={6}><T k="sm">Label</T><T k="hero">Title</T><Row gap={6}><Avatar size="sm" fallback="DT" aria-label="David Tee" /><T k="strong">David Tee</T><T k="sm">Value</T></Row></Col></div>
      <Row gap={8}><span data-pop="action"><Button iconOnly pill aria-label="Play" icon={<PlayFilledIcon />} data-st="press" /></span><Icon label="Save" icon={<HeartIcon />} /><Icon label="More" icon={<MoreHorizontalIcon />} /></Row>
      <Table size="sm">
        <thead><tr><th>#</th><th>Label</th><th><ClockIcon /></th></tr></thead>
        <tbody>{ITEMS.slice(0, 4).map((t, i) => <tr key={t}><td>{i + 1}</td><td><Row gap={6}><T k="strong">{t}</T>{i === 1 ? <Badge size="sm">Badge</Badge> : null}</Row></td><td>Value</td></tr>)}</tbody>
      </Table>
    </div>
    <footer className="sx-player">
      <Row gap={10}><Media className="sx-libcover" /><Col gap={0}><T k="strong">Item two</T><T k="sm">David Tee</T></Col></Row>
      <Col gap={2} style={{ alignItems: "center" }}><Row gap={2}><Icon label="Shuffle" icon={<ShuffleIcon />} /><Icon label="Back" icon={<SkipBackIcon />} /><Icon label="Play" icon={<PlayFilledIcon />} variant="solid" pill /><Icon label="Next" icon={<SkipForwardIcon />} /></Row><Slider aria-label="Position" defaultValue={40} style={{ width: 260 }} /></Col>
      <Row gap={6}><VolumeIcon /><Slider aria-label="Volume" defaultValue={70} style={{ width: 90 }} data-st="focus" /></Row>
    </footer>
    <Menu style={{ right: 16, top: 44, width: 190 }} />
  </App>
);
const Product = ({ st, n }) => (
  <Card size="sm" data-st={st}><CardMedia aria-hidden="true" className="sx-square" /><CardContent>
    {n === 0 ? <Row><Badge size="sm">Badge</Badge></Row> : null}<CardTitle>Title</CardTitle><CardDescription>Description</CardDescription><T k="strong">{`${(n + 1) * 100}`}</T>
  </CardContent></Card>
);
/* Product colours: neutrals and the chosen accent. */
const SWATCHES = [{ value: "#1d1d1f", label: "One" }, { value: "#f2f2f2", label: "Two" }, { value: "#8a8f98", label: "Three" }, { value: "#c9c9cc", label: "Four" }, { value: "var(--area-accent-solid)", label: "Five" }];
const Listing = () => (
  <Site>
    <PageHeader left={<Row gap={8}><T k="title">Title</T><Count count={24} /></Row>} actions={<><Button size="sm" variant="ghost" icon={<FilterIcon />} data-st="press">Action</Button><Select size="sm" aria-label="Sort" defaultValue="one" style={{ width: 130 }}><option value="one">Option one</option></Select></>} />
    <div className="sx-listing">
      <aside className="sx-filters">
        <Row className="sx-between"><T k="strong">Label</T><span className="sx-mover"><Switch aria-label="Label" /></span></Row>
        <Nav aria-label="Categories">{ITEMS.slice(0, 3).map((t, i) => <NavItem key={t} href="#" current={i === 0}>{t}</NavItem>)}</Nav>
        <Accordion defaultValue={["a", "b"]} multiple>
          <AccordionItem value="a" heading="Label"><Col gap={6}><Checkbox label="Option one" defaultChecked /><Checkbox label="Option two" /><Checkbox label="Option three" /></Col></AccordionItem>
          <AccordionItem value="b" heading="Label"><ColorSwatchPicker label="Colour" items={SWATCHES} defaultValue="#1d1d1f" size="sm" /></AccordionItem>
        </Accordion>
      </aside>
      <div className="sx-grid3">{[0, 1, 2, 3, 4, 5].map(i => <Product key={i} n={i} st={i === 1 ? "lift" : i === 3 ? "selected" : undefined} />)}</div>
    </div>
    <Menu style={{ right: 24, top: 90, width: 190 }} />
  </Site>
);
const Detail = () => (
  <Site>
    <div className="sx-pdp">
      <div className="sx-pdp__rail">{[0, 1, 2, 3, 4].map(i => <Card key={i} size="sm" data-st={i === 0 ? "selected" : undefined}><CardMedia aria-hidden="true" className="sx-square" /></Card>)}</div>
      <div className="sx-pdp__hero"><Media className="sx-fill" /><Row gap={6} className="sx-pdp__nav"><Icon label="Previous" icon={<ChevronLeftIcon />} variant="soft" pill /><Icon label="Next" icon={<ChevronRightIcon />} variant="soft" pill /></Row></div>
      <Col gap={12} className="sx-pdp__info">
        <Col gap={2}><Crumbs items={["Item one", "Item two"]} /><T k="h2">Title</T><T k="sm">Description</T><T k="strong">1,000</T></Col>
        <ColorSwatchPicker label="Colour" items={SWATCHES} defaultValue="#1d1d1f" size="sm" />
        <Row className="sx-between"><T k="strong">Label</T><Button variant="ghost" size="sm">Secondary</Button></Row>
        <ToggleGroup selectionMode="single" variant="outline" size="sm" defaultValue={["b"]} aria-label="Size" className="sx-sizes">{["a", "b", "c", "d", "e", "f"].map((v, i) => <ToggleGroupItem key={v} value={v}>{`${7 + i * 0.5}`}</ToggleGroupItem>)}</ToggleGroup>
        <Button fullWidth pill data-st="press">Action</Button>
        <Button fullWidth pill variant="outline" icon={<HeartIcon />} data-st="focus">Secondary</Button>
        <Accordion><AccordionItem value="a" heading="Label">Body text.</AccordionItem><AccordionItem value="b" heading="Label">Body text.</AccordionItem></Accordion>
      </Col>
    </div>
    <Menu style={{ right: 24, top: 60, width: 190 }} />
  </Site>
);
const Booking = () => (
  <Site>
    <PageHeader left={<T k="title">Title</T>} actions={<><Button variant="ghost" size="sm" icon={<ShareIcon />}>Action</Button><Button variant="ghost" size="sm" icon={<HeartIcon />} data-st="press">Secondary</Button></>} />
    <div className="sx-booking">
      <div className="sx-photos"><Media className="sx-photo--hero" /><Media /><Media /><Media /><Media /></div>
      <div className="sx-booking__cols">
        <Col gap={10}>
          <Col gap={2}><T k="h2">Title</T><T k="sm">Description · Value · Value</T></Col>
          <Separator />
          <Row gap={12}><Avatar fallback="DT" aria-label="David Tee" /><Col gap={0}><T k="strong">David Tee</T><T k="sm">Description</T></Col></Row>
          <Separator />
          <DescriptionList layout="justified"><DescriptionListItem term="Label" icon={<StarIcon />}>Value</DescriptionListItem><DescriptionListItem term="Label" icon={<CalendarIcon />}>Value</DescriptionListItem><DescriptionListItem term="Label" icon={<GlobeIcon />}>Value</DescriptionListItem></DescriptionList>
        </Col>
        <Card className="sx-reserve" data-st="lift"><CardContent>
          <Row gap={4}><T k="h2">1,000</T><T k="sm">Label</T></Row>
          <div className="sx-reserve__grid"><Input size="sm" placeholder="Placeholder" /><Input size="sm" placeholder="Placeholder" /><NumberField size="sm" aria-label="Label" defaultValue={2} min={1} className="sx-span2" /></div>
          <span data-pop="action"><Button fullWidth>Action</Button></span>
          <CardFooter><T k="sm">Description</T><Link href="#">Label</Link></CardFooter>
        </CardContent></Card>
      </div>
    </div>
    <Menu style={{ right: 30, top: 50, width: 190 }} />
  </Site>
);

/* ================================ Mobile ================================ */
/* An iPhone (390 × 844) in its device frame, laid out to Apple's HIG: a 54 status bar (time, Dynamic Island, signal,
   Wi-Fi, battery), a 44 navigation bar or a 34pt large title, content at 20 margins, and a floating tab bar pill with a
   separate search button (iOS 26's shape, painted with Area's surface roles instead of glass) over the home indicator.
   Mobile screens run at Area's touch sizes (type 16, Comfortable): 17pt-class body, 40 icon buttons, 48 primary controls. */
const StatusGlyphs = () => (
  <span className="sx-sysglyphs" aria-hidden="true">
    <svg viewBox="0 0 18 12" width="18" height="12"><rect x="0" y="8" width="3" height="4" rx="1" /><rect x="5" y="5.5" width="3" height="6.5" rx="1" /><rect x="10" y="3" width="3" height="9" rx="1" /><rect x="15" y="0" width="3" height="12" rx="1" /></svg>
    <svg viewBox="0 0 16 12" width="16" height="12"><path d="M8 11.5 5.6 9a3.4 3.4 0 0 1 4.8 0Z" /><path d="M3.4 6.8a6.5 6.5 0 0 1 9.2 0l-1.5 1.5a4.4 4.4 0 0 0-6.2 0Z" /><path d="M1.1 4.5a9.7 9.7 0 0 1 13.8 0l-1.5 1.5a7.6 7.6 0 0 0-10.8 0Z" /></svg>
    <svg viewBox="0 0 27 13" width="27" height="13"><rect x="0.5" y="0.5" width="23" height="12" rx="3.5" fill="none" strokeWidth="1" className="sx-batt" /><rect x="2" y="2" width="18" height="9" rx="2" /><rect x="25" y="4.5" width="1.6" height="4" rx="0.8" /></svg>
  </span>
);
const Phone = ({ children, className = "", tabs }) => (
  <div className="sx-iphone">
    <Surface className={`sx-phone ${tabs != null ? "sx-phone--tabs" : ""} ${className}`}>
      <div className="sx-phone__status"><span className="sx-clock">9:41</span><i className="sx-island" /><StatusGlyphs /></div>
      <div className="sx-phone__body">{children}</div>
      {tabs != null ? <TabBar current={tabs} /> : null}
      <i className="sx-phone__home" />
    </Surface>
  </div>
);
const NavBtn = ({ label, icon: I, st }) => <Button variant="soft" pill iconOnly aria-label={label} icon={<I size={20} />} data-st={st} />;
/* The one navigation bar: a button, a centred title, a button; or a 34pt large title under it. */
const MHeader = ({ title = "Title", large, left = <NavBtn label="Back" icon={ChevronLeftIcon} />, right = <NavBtn label="Share" icon={ShareIcon} st="press" /> }) => (
  <header className="sx-mh"><div className="sx-mh__row">{left}{large ? <span /> : <T k="navtitle">{title}</T>}{right}</div>{large ? <T k="large" className="sx-mh__large">{title}</T> : null}</header>
);
const TABS = [[HomeIcon, "One"], [LayersIcon, "Two"], [ChatIcon, "Three"], [SettingsIcon, "Four"]];
/* The floating tab bar: a pill of tabs (24 glyph over a 10pt label) with the current tab on a plate, and a round search
   button beside it. */
const TabBar = ({ current = 0, hover = 2 }) => (
  <nav className="sx-tabdock" aria-label="Tabs">
    <Surface className="sx-tabpill">{TABS.map(([I, t], i) => {
      const inner = <><I size={26} /><span className="sx-tablabel">{t}</span></>;
      return i === current
        ? <span key={t} data-pop="selection" className="sx-tabcell"><Surface variant="soft" className="sx-tabitem sx-tabitem--on" aria-current="page">{inner}</Surface></span>
        : <span key={t} className="sx-tabitem" data-st={i === hover ? "tabhover" : undefined}>{inner}</span>; })}</Surface>
    <Surface className="sx-tabsearch" aria-label="Search"><SearchIcon size={26} /></Surface>
  </nav>
);
const MChat = () => (
  <Phone>
    <MHeader />
    <div className="sx-mbody" style={{ gap: 20 }}>
      <Message author="user">Body text</Message>
      <Message author="assistant" actions={<Row gap={0}><Icon label="Good" icon={<ThumbsUpIcon />} size="md" /><Icon label="Bad" icon={<ThumbsDownIcon />} size="md" /></Row>}><p>Body text, a description that runs across the screen as prose.</p></Message>
      <Message author="user">Body text</Message>
      <Message author="assistant" actions={<Row gap={0}><Icon label="Good" icon={<ThumbsUpIcon />} size="md" /><Icon label="Bad" icon={<ThumbsDownIcon />} size="md" /></Row>}><p>Description of the next step, in a few more words.</p></Message>
    </div>
    <div className="sx-mdock"><Button variant="soft" pill iconOnly aria-label="Add" icon={<AddIcon size={22} />} /><Input size="lg" placeholder="Placeholder" className="sx-grow" data-st="focus" /><Button variant="ghost" pill iconOnly aria-label="Voice" icon={<MicIcon size={22} />} /></div>
    <Menu style={{ right: 16, top: 50, width: 220 }} />
  </Phone>
);
const MMenu = () => (
  <Phone tabs={3}>
    <MHeader large left={<NavBtn label="Back" icon={ChevronLeftIcon} />} right={<NavBtn label="Search" icon={SearchIcon} />} />
    <div className="sx-mbody">
      <Card><CardContent className="sx-mlist">
        {[[HomeIcon, "Item one"], [WalletIcon, "Item two"], [StarIcon, "Item three"], [CreditCardIcon, "Item four"]].map(([I, t], i) => (
          <div key={t} className="sx-mrow" data-st={i === 2 ? "hover" : undefined}><Row gap={12}><Avatar shape="square" size="sm" fallback={<I />} aria-label={t} /><T>{t}</T></Row><ChevronRightIcon size={18} /></div>))}
      </CardContent></Card>
      <Card data-st="selected"><CardContent className="sx-mlist">
        <div className="sx-mrow"><T>Label</T><span className="sx-mover"><Switch aria-label="Label" defaultChecked /></span></div>
        <div className="sx-mrow"><T>Label</T><Segmented aria-label="Label" defaultValue="one" items={[{ value: "one", label: "One" }, { value: "two", label: "Two" }]} /></div>
      </CardContent></Card>
      <Button size="lg" variant="ghost" fullWidth data-st="press">Action</Button>
    </div>
    <Menu style={{ right: 16, top: 50, width: 220 }} />
  </Phone>
);
const MPlan = () => (
  <Phone>
    <MHeader large left={<NavBtn label="Close" icon={ChevronLeftIcon} />} right={<span />} />
    <div className="sx-mbody">
      <Segmented aria-label="Billing" size="lg" fullWidth defaultValue="one" items={[{ value: "one", label: "One" }, { value: "two", label: "Two" }]} />
      <RadioGroup name="plan" defaultValue="b" aria-label="Plan" className="sx-plans">
        {[["a", "Option one", "Value"], ["b", "Option two", "1,000"], ["c", "Option three", "2,000"]].map(([v, l, p]) => (
          <Radio key={v} value={v} variant="card" layout="row" size="lg" label={<Row gap={8}><T k="strong">{l}</T>{v === "b" ? <Badge variant="solid" tone="inverse">Badge</Badge> : null}</Row>} description={`${p} · Description of the option in a line or two.`} data-st={v === "c" ? "focus" : undefined} />))}
      </RadioGroup>
      <span className="sx-grow" />
      <span data-pop="action"><Button size="lg" fullWidth pill data-st="press">Action</Button></span>
      <Button size="lg" variant="ghost" fullWidth>Secondary</Button>
    </div>
    <Menu style={{ right: 16, top: 120, width: 220 }} />
  </Phone>
);
const MTeam = () => (
  <Phone tabs={0}>
    <MHeader title="David Tee" left={<NavBtn label="Menu" icon={MenuIcon} />} right={<NavBtn label="Alerts" icon={BellIcon} st="press" />} />
    <div className="sx-mbody">
      <div className="sx-widgets">
        <Card className="sx-widget--tall" data-st="lift"><CardContent className="sx-widget"><CardTitle>Title</CardTitle><span className="sx-grow" /><Row gap={6}><LayersIcon size={20} /><CardValue>2</CardValue></Row><T k="sm">Label</T></CardContent></Card>
        <Card><CardContent className="sx-widget"><CardTitle>Title</CardTitle><Row gap={6}><ChatIcon size={20} /><CardValue>4</CardValue></Row></CardContent></Card>
        <Card data-st="selected"><CardContent className="sx-widget"><Row className="sx-between"><CardTitle>Title</CardTitle><Avatar size="sm" fallback="T1" aria-label="Team one" /></Row><Row gap={6}><CalendarIcon size={20} /><CardValue>1</CardValue></Row></CardContent></Card>
      </div>
      <Card><CardContent><Col gap={10}><CardTitle>Title</CardTitle><CardDescription>Description of the next step for the team.</CardDescription><Row><Button size="lg">Action</Button></Row></Col></CardContent></Card>
      <Card><CardContent><Row className="sx-between"><Col gap={2}><CardTitle>Title</CardTitle><CardDescription>Description</CardDescription></Col><Progress value={60} label="Label" style={{ width: 100 }} /></Row></CardContent></Card>
    </div>
    <Menu style={{ right: 16, top: 50, width: 220 }} />
  </Phone>
);
const MDetail = () => (
  <Phone>
    <MHeader title="Title" right={<NavBtn label="Bag" icon={ShoppingBagIcon} st="press" />} />
    <Media className="sx-mhero" />
    <div className="sx-mbody">
      <Col gap={2}><T k="h2">Title</T><T k="sm">Description</T><T k="strong">1,000</T></Col>
      <CardCarousel aria-label="Colours" className="sx-mcarousel">{[0, 1, 2, 3].map(i => <li key={i}><Card size="sm" data-st={i === 0 ? "selected" : undefined}><CardMedia aria-hidden="true" /></Card></li>)}</CardCarousel>
      <ToggleGroup selectionMode="single" variant="outline" size="lg" defaultValue={["b"]} aria-label="Size" className="sx-sizes">{["a", "b", "c", "d"].map((v, i) => <ToggleGroupItem key={v} value={v} data-st={v === "c" ? "focus" : undefined}>{`${8 + i * 0.5}`}</ToggleGroupItem>)}</ToggleGroup>
      <span className="sx-grow" />
      <Button size="lg" fullWidth pill>Action</Button>
    </div>
    <Menu style={{ right: 16, top: 50, width: 220 }} />
  </Phone>
);
const MFinance = () => (
  <Phone tabs={0}>
    <MHeader title="Title" left={<Avatar fallback="DT" aria-label="David Tee" />} right={<NavBtn label="Alerts" icon={BellIcon} />} />
    <div className="sx-mbody">
      <Col gap={4} style={{ alignItems: "center", paddingBlock: 6 }}><T k="sm">Label</T><T k="balance">1,000</T></Col>
      <div className="sx-mactions">{[[AddIcon, "Label"], [ArrowUpIcon, "Label"], [CreditCardIcon, "Label"], [MoreHorizontalIcon, "Label"]].map(([I, t], i) => (
        <Col key={i} gap={6} style={{ alignItems: "center" }} data-pop={i === 0 ? "action" : undefined}><Button size="lg" variant={i === 0 ? "solid" : "soft"} pill iconOnly aria-label={t} icon={<I size={22} />} data-st={i === 1 ? "press" : undefined} /><T k="sm">{t}</T></Col>))}</div>
      <Card data-st="selected"><CardContent className="sx-mlist">
        <Row className="sx-between"><CardTitle>Title</CardTitle><Button variant="ghost">Action</Button></Row>
        {[["Team one", "T1", "-10"], ["David Tee", "DT", "+20"], ["Team two", "T2", "-30"]].map(([n, a, v], i) => (
          <div key={i} className="sx-mrow"><Row gap={12}><Avatar fallback={a} aria-label={n} /><Col gap={0}><T k="strong">{n}</T><T k="sm">Value</T></Col></Row><T k="strong">{v}</T></div>))}
      </CardContent></Card>
      <SearchField placeholder="Placeholder" aria-label="Search" style={{ width: "100%" }} data-st="focus" />
    </div>
    <Menu style={{ right: 16, top: 50, width: 220 }} />
  </Phone>
);

/* ================================ Isolated components ================================ */
/* One component or a small cluster, centred in a 4:3 frame about 1.5× its own size, so it reads smaller than a close-up.
   Wherever the app has an owner-reviewed demo of the subject (apps/desktop/src/content/demos), the view renders that
   demo itself, so its spacing and type are exactly the gallery's. */
const Iso = ({ children, w, h, align = "center" }) => <div className={`sx-iso sx-iso--${align}`} style={{ width: w, height: h }}>{children}</div>;
const IsoMenu = () => (
  <Iso w={480} h={360} align="top">
    <Col gap={6} style={{ alignItems: "flex-end" }}>
      <Button variant="soft" iconOnly aria-label="More" icon={<MoreHorizontalIcon />} data-st="press" />
      <GalleryKbdInMenu />
    </Col>
  </Iso>
);
const IsoPopover = () => <Iso w={480} h={360}><div data-pop="action"><GalleryPopoverField /></div></Iso>;
const IsoSidebar = () => (
  <Iso w={400} h={300} align="corner">
    <Surface className="sx-cropwin">
      <div className="sx-cropwin__in">
        <Row gap={10}><Avatar fallback="DT" aria-label="David Tee" /><Col gap={0}><T k="strong">David Tee</T><Row gap={6}><T k="sm">Label</T><Badge size="sm">Badge</Badge></Row></Col></Row>
        <SearchField placeholder="Placeholder" aria-label="Search" data-st="focus" />
        <Nav aria-label="Pages">
          <NavItem href="#" icon={<HomeIcon />} data-st="hover">Item one</NavItem>
          <NavItem href="#" icon={<SettingsIcon />} current trailing={<ChevronRightIcon />}>Item two</NavItem>
          <NavItem href="#" icon={<BellIcon />}>Item three</NavItem>
          <NavItem href="#" icon={<FolderIcon />}>Item four</NavItem>
          <NavItem href="#" icon={<StarIcon />}>Item five</NavItem>
        </Nav>
      </div>
    </Surface>
  </Iso>
);
const IsoCard = () => <Iso w={480} h={360}><div data-st="lift"><CardMediaOverlay /></div></Iso>;
const IsoMusic = () => <Iso w={520} h={390}><div data-pop="action"><CardTemplateMusic /></div></Iso>;
const IsoPlan = () => <Iso w={480} h={360}><div data-pop="action"><CardTemplatePlan /></div></Iso>;
const IsoCarousel = () => <Iso w={680} h={510}><GalleryCardCarousel /></Iso>;
const IsoBadges = () => (
  <Iso w={480} h={360}>
    {/* A full grid, every cell filled and the same size, spaced out (owner, 2026-10-24). */}
    <div className="sx-vgrid sx-vgrid--full">
      <Badge>Badge</Badge><Badge variant="solid">Badge</Badge><Badge variant="outline">Badge</Badge><Badge variant="color" tone="info">Badge</Badge>
      <Badge dot tone="success">Badge</Badge><Badge variant="color" tone="danger">Badge</Badge><Tag size="sm">Tag</Tag><Count count={12} variant="soft" />
      <Chip>Chip</Chip><Chip defaultSelected>Chip</Chip><Kbd keys={["cmd", "K"]} /><AvatarGroup size="sm"><Avatar fallback="DT" aria-label="David Tee" /><Avatar fallback="T1" aria-label="Team one" /><Avatar fallback="T2" aria-label="Team two" /></AvatarGroup>
    </div>
  </Iso>
);
const IsoInspector = () => <Iso w={440} h={330} align="top"><GalleryPanelFigma /></Iso>;
const IsoToolbar = () => (
  <Iso w={480} h={360}>
    <Toolbar aria-label="Format" variant="surface">
      <ToolbarItem><Button variant="ghost" iconOnly aria-label="Undo" icon={<UndoIcon />} /></ToolbarItem>
      <ToolbarItem><Button variant="ghost" iconOnly aria-label="Redo" icon={<RedoIcon />} /></ToolbarItem>
      <ToolbarSeparator />
      <ToolbarItem><Button variant="soft" data-st="press">123</Button></ToolbarItem>
      <ToolbarItem><Button variant="ghost" iconOnly aria-label="Bold" icon={<BoldIcon />} /></ToolbarItem>
      <ToolbarItem><Button variant="ghost" iconOnly aria-label="Italic" icon={<ItalicIcon />} /></ToolbarItem>
      <ToolbarSeparator />
      <Segmented aria-label="Align" defaultValue="l" items={[{ value: "l", label: <TextAlignLeftIcon />, "aria-label": "Left" }, { value: "c", label: <TextAlignCenterIcon />, "aria-label": "Centre" }, { value: "r", label: <TextAlignRightIcon />, "aria-label": "Right" }]} />
      <ToolbarSeparator />
      <ToolbarItem><span data-pop="action"><Button iconOnly aria-label="Generate" icon={<SparkleIcon />} data-st="focus" /></span></ToolbarItem>
    </Toolbar>
  </Iso>
);
const IsoForm = () => (
  <Iso w={480} h={360}>
    <Card style={{ width: 300 }}><CardContent>
      <Col gap={14}>
        <FieldDefault />
        <SelectField />
        <div data-pop="selection"><CheckboxDefault /></div>
        <Row gap={8} className="sx-end"><Button variant="outline">Cancel</Button><span data-pop="action"><Button data-st="press">Action</Button></span></Row>
      </Col>
    </CardContent></Card>
  </Iso>
);
/* One column, so every part shares its edges: tabs on a rule, the page's rows, pagination centred under them (owner,
   2026-10-24: tabs, segmented and pagination stacked read misaligned). */
const IsoTabs = () => (
  <Iso w={480} h={360}>
    <Surface className="sx-tabpage">
      <Tabs aria-label="Label" items={[{ id: "one", label: "Item one", content: "" }, { id: "two", label: "Item two", content: "" }, { id: "three", label: "Item three", content: "" }]} />
      <div className="sx-tabpage__rows">{ITEMS.slice(0, 4).map((i) => <div key={i} className="sx-tabpage__row"><T>{i}</T><T k="sm">Value</T></div>)}</div>
      <div className="sx-tabpage__foot"><Pagination pageCount={5} defaultPage={2} /></div>
    </Surface>
  </Iso>
);
const IsoCommand = () => <Iso w={640} h={480}><GalleryCommandPalette /></Iso>;
const IsoToast = () => <Iso w={480} h={360}><Col gap={10} style={{ width: 340 }}><GalleryToastNeutral /><Toast title="Title" icon={<BellIcon />} action={<Button size="sm" variant="outline">Action</Button>}>Description of the update.</Toast></Col></Iso>;
const IsoSliders = () => (
  <Iso w={480} h={360}>
    <Col gap={18} style={{ width: 300 }}><SliderWithLabel /><SliderDefault /><SliderTones /></Col>
  </Iso>
);
const IsoCalendar = () => <Iso w={480} h={360}><div data-pop="selection"><GalleryCalendar /></div></Iso>;
export const ISOLATED = {
  menu: ["Menu", IsoMenu], popover: ["Popover", IsoPopover], sidebar: ["Sidebar corner", IsoSidebar], card: ["Card", IsoCard],
  music: ["Music card", IsoMusic], plan: ["Plan card", IsoPlan], carousel: ["Carousel", IsoCarousel], badges: ["Badges and chips", IsoBadges],
  inspector: ["Inspector", IsoInspector], toolbar: ["Toolbar", IsoToolbar], form: ["Form", IsoForm], tabs: ["Tabs and pages", IsoTabs],
  command: ["Command palette", IsoCommand], toast: ["Toasts", IsoToast], calendar: ["Calendar", IsoCalendar], sliders: ["Sliders", IsoSliders],
};

export const DESKTOP = {
  "chat-home": ["Chat home", ChatHome], chat: ["Conversation", ChatThread], settings: ["Settings", Settings],
  doc: ["Document", Doc], database: ["Database", Database], board: ["Board", Board], editor: ["Code editor", Editor],
  issues: ["Issue list", Issues], mail: ["Mail", Mail], dashboard: ["Dashboard", Dashboard], album: ["Album", Album],
  listing: ["Product listing", Listing], detail: ["Product detail", Detail], booking: ["Booking", Booking],
};
export const MOBILE = {
  chat: ["Chat", MChat], menu: ["Menu", MMenu], plan: ["Plan picker", MPlan], team: ["Team home", MTeam],
  detail: ["Product detail", MDetail], finance: ["Finance home", MFinance],
};

/* Wrap every visible text node so the page can turn text into bars (semi-abstract) or remove it (abstract). */
function wrapText(html) {
  const skip = /^(option|textarea|style|script|title)$/i;
  let depth = 0;
  return html.split(/(<[^>]+>)/).map(part => {
    if (part.startsWith("<")) {
      const m = part.match(/^<(\/?)([a-zA-Z0-9-]+)/);
      if (m && skip.test(m[2])) depth += m[1] ? -1 : (part.endsWith("/>") ? 0 : 1);
      return part;
    }
    return depth === 0 && /\S/.test(part) ? `<span class="tx">${part}</span>` : part;
  }).join("");
}
export function render() {
  const out = { desktop: {}, mobile: {}, errors: [] };
  out.isolated = {};
  for (const [set, map] of [["desktop", DESKTOP], ["mobile", MOBILE], ["isolated", ISOLATED]]) {
    for (const [id, [label, C]] of Object.entries(map)) {
      try { const html = wrapText(renderToStaticMarkup(<C />)); const m = html.match(/width:(\d+)px;height:(\d+)px/); out[set][id] = { label, html, ...(set === "isolated" && m ? { w: +m[1], h: +m[2] } : {}) }; }
      catch (e) { out.errors.push(`${set}/${id}: ${String(e.message).slice(0, 240)}`); }
    }
  }
  return out;
}
