/* Choice scenes for the Theme setup review page, built from Area's real React components and rendered to static HTML.
   Every scene is drawn for the same 300 × 225 box at true scale, so one zoom gives every card the same scale.
   Copy follows docs/DESIGN_SYSTEM.md, Example copy. Forced states use st-* classes defined on the page. */
import { renderToStaticMarkup } from "react-dom/server";
import {
  Avatar, Badge, Button, Card, CardCarousel, CardContent, CardDescription, CardFooter, CardHeader, CardMedia, CardTitle, CardValue, Checkbox, Chip, Count, Field, Input,
  Kbd, MenuItem, MenuLabel, MenuSeparator, Nav, NavItem, Radio, RadioGroup, Segmented, Select, Surface, Switch, Table,
  Tabs,
} from "@area/react";
import { BellIcon, CalendarIcon, ChevronLeftIcon, ChevronRightIcon, FolderIcon, HomeIcon, InboxIcon, SearchIcon, SettingsIcon, StarIcon } from "@area/icons";

const Box = ({ children, className = "" }) => <div className={`sx-box ${className}`}>{children}</div>;
const Col = ({ children, gap = 8, className = "", style }) => <div className={`sx-col ${className}`} style={{ gap, ...style }}>{children}</div>;
const Row = ({ children, gap = 8, className = "", style }) => <div className={`sx-row ${className}`} style={{ gap, ...style }}>{children}</div>;
const Pointer = ({ x, y }) => (
  <svg className="sx-pointer" style={{ left: x, top: y }} viewBox="0 0 11 17" aria-hidden="true"><path d="M.5.5v13.2l3.3-3.1 2.3 5.2 2.1-.9-2.3-5.1h4.6Z" /></svg>
);
const StaticMenu = ({ children, style, className = "" }) => <div className={`area-menu sx-menu ${className}`} role="menu" aria-label="Menu" style={style}>{children}</div>;
const Note = ({ title = "Title", text = "Description", className = "" }) => (
  <Card size="sm" className={`sx-note ${className}`}><CardContent>
    <Row gap={10}><Avatar shape="square" fallback={<BellIcon />} aria-label="Label" /><Col gap={2}><CardTitle>{title}</CardTitle><CardDescription>{text}</CardDescription></Col></Row>
  </CardContent></Card>
);

/* A picture for media slots: a flat landscape in fixed colours (content, like a photo, not the theme's paint). */
const SCENERY = [["#cdd9e3", "#7d8e9e", "#3d4b57"], ["#e6dccd", "#9a8670", "#4e4235"], ["#d4e1d0", "#6d8768", "#34442f"], ["#dcd6e8", "#7a7096", "#3e3854"]];
const Picture = ({ i = 0 }) => { const [sky, hill, ground] = SCENERY[i % SCENERY.length]; return (
  <svg className="sx-photo" viewBox="0 0 160 90" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <rect width="160" height="90" fill={sky} /><path d="M0 66 38 34l18 14 28-26 30 28 16-10 30 24V90H0Z" fill={hill} />
    <path d="m84 22-9 9 6-1 3 4 3-5 6 3Z" fill="#fff" /><path d="M0 78c42-10 86 6 160-6v18H0Z" fill={ground} />
  </svg>); };

/* ---- Shared compositions ---- */
/* A whole app window at its real size (640 × 400), shrunk to fit as one picture, so its proportions are a window's. */
const Window = () => (
  <div className="sx-fit" style={{ "--fit": 0.45 }}>
    <Surface className="sx-window">
      <div className="sx-side">
        <div className="sx-lights"><i /><i /><i /></div>
        <Nav aria-label="Pages">
          <NavItem href="#" current icon={<HomeIcon />}>Item one</NavItem>
          <NavItem href="#" icon={<InboxIcon />}>Item two</NavItem>
          <NavItem href="#" icon={<CalendarIcon />}>Item three</NavItem>
          <NavItem href="#" icon={<FolderIcon />}>Item four</NavItem>
          <NavItem href="#" icon={<StarIcon />}>Item five</NavItem>
        </Nav>
      </div>
      <div className="sx-main">
        <Row className="sx-between"><div className="sx-heading">Title</div>
          <Row gap={8}><Input placeholder="Placeholder" leadingIcon={<SearchIcon />} style={{ width: 200 }} /><Button>Action</Button></Row></Row>
        <Row gap={12} style={{ alignItems: "stretch" }}>
          {[0, 1, 2].map(i => <Card key={i} size="sm" className="sx-grow"><CardMedia aria-hidden="true"><Picture i={i} /></CardMedia><CardContent><CardTitle>Title</CardTitle><CardDescription>Description</CardDescription></CardContent></Card>)}
        </Row>
        <Table size="sm">
          <thead><tr><th>Label</th><th>Label</th><th>Value</th></tr></thead>
          <tbody><tr><td>Item one</td><td>Description</td><td>1</td></tr><tr><td>Item two</td><td>Description</td><td>2</td></tr></tbody>
        </Table>
      </div>
    </Surface>
  </div>
);
const SettingsSheet = () => (
  <Card className="sx-w260"><CardContent>
    <CardTitle>Title</CardTitle>
    <Col gap={10} style={{ marginTop: 10 }}>
      <Row className="sx-between"><span className="sx-label">Label</span><Switch aria-label="Label" defaultChecked /></Row>
      <Row className="sx-between"><span className="sx-label">Label</span><Segmented aria-label="Label" size="sm" defaultValue="one" items={[{ value: "one", label: "One" }, { value: "two", label: "Two" }]} /></Row>
      <Row className="sx-between"><span className="sx-label">Label</span><Checkbox aria-label="Label" defaultChecked /></Row>
    </Col>
  </CardContent></Card>
);
const Board = () => (
  <Col gap={10} className="sx-w280">
    <div className="sx-heading">Title</div>
    <Row gap={10}>
      <Card size="sm" className="sx-grow"><CardContent><CardTitle>Title</CardTitle><CardDescription>Description</CardDescription></CardContent></Card>
      <Card size="sm" className="sx-grow"><CardContent><CardTitle>Title</CardTitle><CardDescription>Description</CardDescription></CardContent></Card>
    </Row>
    <Row gap={6}><Button>Action</Button><Button variant="outline">Secondary</Button></Row>
  </Col>
);
const LayerStack = () => (
  <div className="sx-layers">
    <div className="sx-layer sx-layer--page"><span className="sx-cap">Page</span></div>
    <Surface variant="soft" className="sx-layer sx-layer--soft"><span className="sx-cap">Recessed</span></Surface>
    <Card size="sm" className="sx-layer sx-layer--card"><CardContent><span className="sx-cap">Raised</span></CardContent></Card>
    <StaticMenu className="sx-layer sx-layer--float"><MenuItem data-highlighted="">Floating</MenuItem></StaticMenu>
  </div>
);
const Form = ({ focus }) => (
  <Card className="sx-w260"><CardContent>
    <Col gap={10}>
      <Field label="Label"><Input placeholder="Placeholder" className={focus ? "st-focus-field" : ""} /></Field>
      <Checkbox label="Option one" defaultChecked />
      <Row gap={6} className="sx-end"><Button variant="outline">Cancel</Button><Button>Action</Button></Row>
    </Col>
  </CardContent></Card>
);
const DataTable = () => (
  <div className="sx-w280"><Table size="sm">
    <thead><tr><th>Label</th><th>Value</th></tr></thead>
    <tbody><tr><td>Item one</td><td>1</td></tr><tr><td>Item two</td><td>2</td></tr><tr><td>Item three</td><td>3</td></tr></tbody>
  </Table></div>
);
const MenuOver = ({ rows = ["Item one", "Item two", "Item three"], state = "hover" }) => (
  <div className="sx-rel" style={{ width: 260, height: 190 }}>
    <Card size="sm" style={{ width: 200 }}><CardContent><CardTitle>Title</CardTitle><CardDescription>Description</CardDescription>
      <Row gap={6} style={{ marginTop: 10 }}><Button variant="outline" trailingIcon={<svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M4.5 6.5 8 10l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" /></svg>}>Option one</Button></Row>
    </CardContent></Card>
    <StaticMenu style={{ position: "absolute", left: 60, top: 92, width: 180 }}>
      {rows.map((r, i) => <MenuItem key={r} data-highlighted={state === "hover" && i === 0 ? "" : undefined} data-selected={state === "selected" && i === 0 ? "" : undefined} className={state === "pressed" && i === 0 ? "st-press" : ""}>{r}</MenuItem>)}
    </StaticMenu>
  </div>
);
const StateList = ({ state }) => (
  <div className="sx-rel">
    <StaticMenu style={{ width: 220 }}>
      <MenuLabel>Label</MenuLabel>
      <MenuItem>Item one</MenuItem>
      <MenuItem data-highlighted={state === "hover" ? "" : undefined} data-selected={state === "selected" ? "" : undefined} className={state === "pressed" ? "st-press" : ""}>Item two</MenuItem>
      <MenuItem>Item three</MenuItem>
    </StaticMenu>
    {state !== "selected" ? <Pointer x={150} y={66} /> : null}
  </div>
);
const PresetTiles = ({ tint }) => (
  <RadioGroup name={`preset-${tint ? "t" : "s"}`} defaultValue="two" aria-label="Options" className="sx-presets">
    {["one", "two", "three"].map((v, i) => (
      <Radio key={v} value={v} variant="card" layout="preview" label={["One", "Two", "Three"][i]}
        leadingVisual={<span className="sx-preset-art"><i /><i /><i /></span>} />
    ))}
  </RadioGroup>
);
const CardPair = ({ lift }) => (
  <div className="sx-rel">
    <Row gap={14}>
      <Card size="sm" className="sx-w120"><CardContent><CardTitle>Title</CardTitle><CardDescription>Rest</CardDescription></CardContent></Card>
      <Card size="sm" className={`sx-w120 ${lift ? "st-lift" : ""}`}><CardContent><CardTitle>Title</CardTitle><CardDescription>{lift ? "Hover" : "Rest"}</CardDescription></CardContent></Card>
    </Row>
    {lift ? <Pointer x={210} y={46} /> : null}
  </div>
);
/* A card carousel (Card + CardCarousel, as the Card family's carousel demo), its pictures flat colour scenes. */
const Carousel = () => (
  <Card role="region" aria-label="Title" aria-roledescription="carousel" style={{ width: 350 }}><CardContent>
    <CardHeader action={<><Button size="sm" variant="ghost" iconOnly aria-label="Previous items" icon={<ChevronLeftIcon />} disabled /><Button size="sm" variant="ghost" iconOnly aria-label="Next items" icon={<ChevronRightIcon />} /></>}>
      <CardTitle>Title</CardTitle>
    </CardHeader>
    <CardCarousel aria-label="Items">
      {["one", "two", "three", "four"].map((item, i) => (
        <li key={item}><CardMedia aria-hidden="true"><Picture i={i} /></CardMedia><CardContent><CardTitle>Item {item}</CardTitle><CardDescription>Description</CardDescription></CardContent></li>
      ))}
    </CardCarousel>
  </CardContent></Card>
);
/* A simple media card: a picture over a title and a description. */
const MediaCard = ({ children, width = 230, layout }) => (
  <Card layout={layout} style={{ width }}><CardMedia aria-hidden="true"><Picture i={0} /></CardMedia><CardContent>
    <CardTitle>Title</CardTitle><CardDescription>Description</CardDescription>{children}
  </CardContent></Card>
);
const CardTrio = Carousel;

/* ---- Two visuals per setting ---- */
export const SCENES = {
  theme: { A: ["Window", () => <Window />], B: ["Settings", () => <SettingsSheet />] },
  neutral: { A: ["Window", () => <Window />], B: ["Settings", () => <SettingsSheet />] },
  accent: {
    A: ["Media card", () => (
      <div data-area-action="accent" data-area-selection="accent"><MediaCard layout="thumbnail" width={300}>
        <Row gap={6} style={{ marginTop: 8 }}><Chip selected>One</Chip><Chip>Two</Chip></Row>
        <CardFooter><Button>Action</Button></CardFooter>
      </MediaCard></div>)],
    B: ["Accent in use", () => (
      <Card className="sx-w260" data-area-action="accent" data-area-selection="accent"><CardContent>
        <Col gap={10}>
          <Row className="sx-between"><CardTitle>Title</CardTitle><Switch aria-label="Label" defaultChecked /></Row>
          <Segmented aria-label="Label" size="sm" defaultValue="one" items={[{ value: "one", label: "One" }, { value: "two", label: "Two" }, { value: "three", label: "Three" }]} />
          <Checkbox label="Option one" defaultChecked />
          <Row gap={6} className="sx-end"><Button variant="outline">Cancel</Button><Button>Action</Button></Row>
        </Col>
      </CardContent></Card>)],
  },
  "ground-light": { A: ["Window", () => <Window />], B: ["Board", () => <Board />] },
  "ground-dark": { A: ["Window", () => <Window />], B: ["Board", () => <Board />] },
  "layers-light": { A: ["Window", () => <Window />], B: ["Layer stack", () => <LayerStack />] },
  "layers-dark": { A: ["Window", () => <Window />], B: ["Layer stack", () => <LayerStack />] },
  action: {
    A: ["Dialog", () => (
      <Card className="sx-w260"><CardContent>
        <CardTitle>Title</CardTitle><CardDescription>Description</CardDescription>
        <CardFooter className="sx-footer"><Button variant="outline">Cancel</Button><Button>Action</Button></CardFooter>
      </CardContent></Card>)],
    B: ["Search bar", () => (
      <Col gap={10} className="sx-w260">
        <Row gap={6}><Input placeholder="Placeholder" leadingIcon={<SearchIcon />} className="sx-grow" /><Button>Action</Button></Row>
        <Row gap={6}><Button variant="outline">Secondary</Button><Button variant="ghost">Cancel</Button></Row>
      </Col>)],
  },
  selection: {
    A: ["List", () => (
      <StaticMenu style={{ width: 220 }}><MenuItem>Item one</MenuItem><MenuItem data-selected="">Item two</MenuItem><MenuItem>Item three</MenuItem></StaticMenu>)],
    B: ["Controls", () => (
      <Col gap={12} style={{ alignItems: "flex-start" }}>
        <Segmented aria-label="Label" defaultValue="one" items={[{ value: "one", label: "One" }, { value: "two", label: "Two" }, { value: "three", label: "Three" }]} />
        <Checkbox label="Option one" defaultChecked />
        <RadioGroup name="sel-b" defaultValue="one" aria-label="Options" className="sx-row" style={{ gap: 14 }}><Radio value="one" label="One" /><Radio value="two" label="Two" /></RadioGroup>
      </Col>)],
  },
  contrast: { A: ["Form", () => <Form />], B: ["Table", () => <DataTable />] },
  type: {
    A: ["Card", () => (
      <Card className="sx-w260"><CardContent>
        <CardTitle>Title</CardTitle><CardDescription>Description</CardDescription>
        <p className="sx-body">Body text</p>
        <Row gap={6} style={{ marginTop: 8 }}><Button>Action</Button><Button variant="outline">Secondary</Button></Row>
      </CardContent></Card>)],
    B: ["Menu", () => (
      <StaticMenu style={{ width: 220 }}>
        <MenuItem icon={<SearchIcon />} shortcut="⌘K">Item one</MenuItem>
        <MenuItem icon={<StarIcon />}>Item two</MenuItem>
        <MenuSeparator />
        <MenuItem icon={<SettingsIcon />}>Item three</MenuItem>
      </StaticMenu>)],
  },
  density: {
    A: ["List", () => (
      <StaticMenu style={{ width: 220 }}><MenuItem icon={<InboxIcon />}>Item one</MenuItem><MenuItem icon={<CalendarIcon />} data-highlighted="">Item two</MenuItem><MenuItem icon={<FolderIcon />}>Item three</MenuItem></StaticMenu>)],
    B: ["Controls", () => (
      <Col gap={8} className="sx-w220">
        <Input placeholder="Placeholder" />
        <Select aria-label="Label" defaultValue="one"><option value="one">Option one</option></Select>
        <Row gap={6}><Button>Action</Button><Button variant="outline">Secondary</Button></Row>
      </Col>)],
  },
  radius: {
    A: ["Card", () => (
      <Card className="sx-w260"><CardContent><CardTitle>Title</CardTitle><CardDescription>Description</CardDescription>
        <Row gap={6} style={{ marginTop: 10 }}><Input placeholder="Placeholder" className="sx-grow" /><Button>Action</Button></Row>
      </CardContent></Card>)],
    B: ["Nested", () => (
      <Card className="sx-w260"><CardContent><Col gap={10}>
        <Segmented aria-label="Label" size="sm" defaultValue="one" items={[{ value: "one", label: "One" }, { value: "two", label: "Two" }]} />
        <Row gap={6}><Chip>Chip</Chip><Badge>Badge</Badge><Avatar fallback="DT" aria-label="David Tee" /></Row>
        <Surface variant="soft" className="sx-pad"><span className="sx-label">Body text</span></Surface>
      </Col></CardContent></Card>)],
  },
  surface: { A: ["Media card", () => <MediaCard />], B: ["Carousel", () => <Carousel />] },
  stroke: { A: ["Form", () => <Form />], B: ["Table", () => <DataTable />] },
  "stroke-hover": {
    A: ["Fields", () => (
      <div className="sx-rel"><Col gap={10} className="sx-w220"><Input placeholder="Rest" /><Input placeholder="Hover" className="st-hover" /></Col><Pointer x={170} y={56} /></div>)],
    B: ["Buttons", () => (
      <div className="sx-rel"><Row gap={10}><Button variant="outline">Rest</Button><Button variant="outline" className="st-hover">Hover</Button></Row><Pointer x={120} y={20} /></div>)],
  },
  "selected-stroke": {
    A: ["Choice cards", () => <PresetTiles />],
    B: ["Card", () => (
      <Row gap={10}>
        <Card size="sm" className="sx-w120"><CardContent><CardTitle>Title</CardTitle><CardDescription>Rest</CardDescription></CardContent></Card>
        <Card size="sm" selected className="sx-w120"><CardContent><CardTitle>Title</CardTitle><CardDescription>Selected</CardDescription></CardContent></Card>
      </Row>)],
  },
  "focus-ring": {
    A: ["Field and button", () => (
      <Col gap={14} className="sx-w220"><Input placeholder="Placeholder" className="st-focus-field" /><Row><Button variant="outline" className="st-focus">Action</Button></Row></Col>)],
    B: ["Card and choices", () => (
      <Col gap={14}><Note className="st-focus-gap" /><Checkbox label="Option one" defaultChecked className="st-focus-control" /></Col>)],
  },
  "shadow-rest": {
    A: ["Toolbar", () => (
      <Col gap={10} style={{ alignItems: "center" }}><Row gap={6}><Button variant="outline">One</Button><Button variant="outline">Two</Button><Button variant="outline">Three</Button></Row>
        <Segmented aria-label="Label" defaultValue="one" items={[{ value: "one", label: "One" }, { value: "two", label: "Two" }]} /></Col>)],
    B: ["Form", () => <Form />],
  },
  elevation: { A: ["Menu", () => <MenuOver />], B: ["Notifications", () => <Col gap={8}><Note /><Note /></Col>] },
  "shadow-resting": { A: ["Carousel", () => <Carousel />], B: ["Card pair", () => <CardPair />] },
  "shadow-hover": { A: ["Card pair", () => <CardPair lift />], B: ["Notification", () => <div className="sx-rel"><Note className="st-lift" /><Pointer x={170} y={36} /></div>] },
  "shadow-field": {
    A: ["Form", () => <Form />],
    B: ["Search", () => (
      <Col gap={8} className="sx-w240"><Input placeholder="Placeholder" leadingIcon={<SearchIcon />} /><Select aria-label="Label" defaultValue="one"><option value="one">Option one</option></Select></Col>)],
  },
  "shadow-size": { A: ["Menu", () => <MenuOver />], B: ["Carousel", () => <Carousel />] },
  "shadow-softness": { A: ["Menu", () => <MenuOver />], B: ["Carousel", () => <Carousel />] },
  "shadow-light": { A: ["Menu", () => <MenuOver />], B: ["Controls", () => <Col gap={10} style={{ alignItems: "center" }}><Row gap={6}><Button>Action</Button><Button variant="outline">Secondary</Button></Row><Segmented aria-label="Label" defaultValue="one" items={[{ value: "one", label: "One" }, { value: "two", label: "Two" }]} /></Col>] },
  "shadow-color": { A: ["Menu", () => <MenuOver />], B: ["Carousel", () => <Carousel />] },
  "fill-hover": { A: ["Menu", () => <StateList state="hover" />], B: ["Sidebar", () => (
    <div className="sx-rel"><Surface variant="soft" className="sx-sidebar"><Nav aria-label="Pages">
      <NavItem href="#" current icon={<HomeIcon />}>Item one</NavItem><NavItem href="#" icon={<InboxIcon />} className="st-nav-hover">Item two</NavItem><NavItem href="#" icon={<FolderIcon />}>Item three</NavItem>
    </Nav></Surface><Pointer x={130} y={62} /></div>)] },
  "fill-selected": { A: ["Menu", () => <StateList state="selected" />], B: ["Sidebar", () => (
    <Surface variant="soft" className="sx-sidebar"><Nav aria-label="Pages">
      <NavItem href="#" icon={<HomeIcon />}>Item one</NavItem><NavItem href="#" current icon={<InboxIcon />}>Item two</NavItem><NavItem href="#" icon={<FolderIcon />}>Item three</NavItem>
    </Nav></Surface>)] },
  "fill-pressed": { A: ["Menu", () => <StateList state="pressed" />], B: ["Buttons", () => (
    <div className="sx-rel"><Row gap={10}><Button variant="outline">Rest</Button><Button variant="outline" className="st-press">Pressed</Button></Row><Pointer x={120} y={20} /></div>)] },
  "selected-tint": { A: ["Choice cards", () => <PresetTiles tint />], B: ["Card", () => (
    <Row gap={10}>
      <Card size="sm" className="sx-w120"><CardContent><CardTitle>Title</CardTitle><CardDescription>Rest</CardDescription></CardContent></Card>
      <Card size="sm" selected className="sx-w120"><CardContent><CardTitle>Title</CardTitle><CardDescription>Selected</CardDescription></CardContent></Card>
    </Row>)] },
  motion: {
    B: ["Switches", () => (
      <Card className="sx-w240"><CardContent><Col gap={10}>
        <Row className="sx-between"><span className="sx-label">Label</span><span className="sx-mover"><Switch aria-label="Label" /></span></Row>
        <Row className="sx-between"><span className="sx-label">Label</span><span className="sx-mover sx-mover--on"><Switch aria-label="Label" defaultChecked /></span></Row>
      </Col></CardContent></Card>)],
    A: ["Trail", () => <div className="sx-trail" data-trail="motion"><i /><i /><i /><i /><i /><b /></div>],
  },
  easing: {
    A: ["Curve", () => <svg className="sx-curve" viewBox="0 0 200 130" data-curve aria-hidden="true" />],
    B: ["Spacing", () => <div className="sx-trail sx-trail--ease" data-trail="ease"><i /><i /><i /><i /><i /><i /><i /><b /></div>],
  },
};

/* Pills: each component, at the control radius then as a pill. */
const PILL_PARTS = {
  button: () => <Button variant="outline">Button</Button>,
  field: () => <Input placeholder="Field" style={{ width: 110 }} />,
  segmented: () => <Segmented aria-label="Label" size="sm" defaultValue="one" items={[{ value: "one", label: "One" }, { value: "two", label: "Two" }]} />,
  chip: () => <Chip>Chip</Chip>,
  badge: () => <Badge>Badge</Badge>,
  count: () => <Count count={1} />,
  switch: () => <Switch aria-label="Label" defaultChecked />,
  avatar: () => <Avatar fallback="DT" aria-label="David Tee" />,
};

/* ---- Screens: whole app screens laid flat (after the owner's references: a finance dashboard, a settings page, a
   board, a chat home and a sheet), drawn at a real 800 × 500 and shrunk to fit as one picture. ---- */
const Side = ({ current = 0, hover = -1 }) => (
  <div className="sx-screen__side">
    <Nav aria-label="Pages">
      {[[HomeIcon, "Item one"], [InboxIcon, "Item two"], [CalendarIcon, "Item three"], [FolderIcon, "Item four"], [StarIcon, "Item five"]].map(([I, t], i) => (
        <NavItem key={t} href="#" current={i === current} icon={<I />} className={i === hover ? "st-nav-hover" : ""}>{t}</NavItem>
      ))}
    </Nav>
  </div>
);
const Frame = ({ children, side = true, sideProps, pointer }) => (
  <div className="sx-fit" style={{ "--fit": 0.45 }}>
    <Surface className="sx-screen">
      <div className="sx-screen__bar"><div className="sx-lights"><i /><i /><i /></div><span className="sx-screen__title">Title</span><span /></div>
      <div className={`sx-screen__body ${side ? "" : "sx-screen__body--full"}`}>
        {side ? <Side {...sideProps} /> : null}
        <div className="sx-screen__main">{children}</div>
      </div>
      {pointer ? <Pointer x={pointer[0]} y={pointer[1]} /> : null}
    </Surface>
  </div>
);
const Stat = ({ value }) => (
  <Card size="sm" className="sx-grow"><CardContent><CardDescription>Label</CardDescription><CardValue>{value}</CardValue><CardDescription>Description</CardDescription></CardContent></Card>
);
const Chart = () => (
  <svg className="sx-chart" viewBox="0 0 520 120" preserveAspectRatio="none" aria-hidden="true">
    <path className="sx-chart__grid" d="M0 20H520M0 60H520M0 100H520" />
    <path className="sx-chart__b" d="M0 80C60 70 100 50 160 64S260 96 320 72 420 30 520 44" />
    <path className="sx-chart__a" d="M0 96C70 92 110 60 170 40S270 30 330 62 430 96 520 70" />
  </svg>
);
const DashboardScreen = ({ sideProps, pointer, primary = true }) => (
  <Frame sideProps={sideProps} pointer={pointer}>
    <Row className="sx-between"><div className="sx-heading">Title</div><Row gap={8}><Input placeholder="Placeholder" leadingIcon={<SearchIcon />} style={{ width: 200 }} />{primary ? <Button>Action</Button> : null}</Row></Row>
    <Row gap={12} style={{ alignItems: "stretch" }}><Stat value="1,000" /><Stat value="2,000" /><Stat value="3,000" /></Row>
    <Card><CardContent>
      <Row className="sx-between"><CardTitle>Title</CardTitle><Segmented aria-label="Label" size="sm" defaultValue="one" items={[{ value: "one", label: "One" }, { value: "two", label: "Two" }]} /></Row>
      <Chart />
    </CardContent></Card>
  </Frame>
);
const SettingRow = ({ title, children }) => (
  <div className="sx-setrow"><div className="sx-setrow__t"><span className="sx-label">{title}</span><span className="sx-desc">Description</span></div><div className="sx-setrow__c">{children}</div></div>
);
const SettingsScreen = ({ hoverField, focusField, pointer, pills }) => (
  <Frame side={false} pointer={pointer}>
    <Tabs aria-label="Sections" defaultValue="one" items={[{ id: "one", label: "One" }, { id: "two", label: "Two" }, { id: "three", label: "Three" }, { id: "four", label: "Four" }]} />
    <Col gap={2}><div className="sx-heading">Title</div><span className="sx-desc">Description</span></Col>
    <Card className="sx-setcard"><CardContent>
      <SettingRow title="Label"><RadioGroup name="s1" defaultValue="one" aria-label="Label" className="sx-inline"><Radio value="one" label="One" /><Radio value="two" label="Two" /><Radio value="three" label="Three" /></RadioGroup></SettingRow>
      <SettingRow title="Label"><RadioGroup name="s2" defaultValue="two" aria-label="Label" className="sx-inline"><Radio value="one" label="One" /><Radio value="two" label="Two" /><Radio value="three" label="Three" /></RadioGroup></SettingRow>
      <SettingRow title="Label"><span className="sx-mover"><Switch aria-label="Label" defaultChecked /></span></SettingRow>
      <SettingRow title="Label"><Input placeholder="Placeholder" style={{ width: 220 }} className={hoverField ? "st-hover" : focusField ? "st-focus-field" : ""} /></SettingRow>
      {pills ? <SettingRow title="Label"><Row gap={8}><Segmented aria-label="Label" size="sm" defaultValue="one" items={[{ value: "one", label: "One" }, { value: "two", label: "Two" }]} /><Chip>Chip</Chip><Badge>Badge</Badge><Count count={1} /><Avatar fallback="DT" aria-label="David Tee" /></Row></SettingRow>
        : <SettingRow title="Label"><Segmented aria-label="Label" size="sm" defaultValue="one" items={[{ value: "one", label: "One" }, { value: "two", label: "Two" }, { value: "three", label: "Three" }]} /></SettingRow>}
    </CardContent></Card>
    <Row gap={8} className="sx-end"><Button variant="outline">Cancel</Button><Button>Action</Button></Row>
  </Frame>
);
const BoardCard = ({ selected, lift, chip = "Chip" }) => (
  <Card size="sm" selected={selected} className={lift ? "st-lift" : ""}><CardContent>
    <CardTitle>Title</CardTitle><CardDescription>Description</CardDescription>
    <Row gap={6} style={{ marginTop: 8 }}><Chip>{chip}</Chip></Row>
  </CardContent></Card>
);
const BoardScreen = ({ selected, lift, menu, pointer }) => (
  <Frame sideProps={{ current: 1 }} pointer={pointer}>
    <Row className="sx-between"><div className="sx-heading">Title</div><Button variant="outline">Action</Button></Row>
    <div className="sx-columns">
      {["Title", "Title", "Title"].map((t, c) => (
        <div key={c} className="sx-column">
          <Row gap={6}><span className="sx-label sx-strong">{t}</span><Count count={c + 2} /></Row>
          <BoardCard selected={selected && c === 1} lift={lift && c === 1} />
          <BoardCard chip="Chip" />
          {c === 0 ? <BoardCard /> : null}
        </div>
      ))}
    </div>
    {menu ? <StaticMenu style={{ position: "absolute", left: 300, top: 150, width: 200 }}><MenuItem data-highlighted="">Item one</MenuItem><MenuItem>Item two</MenuItem><MenuItem>Item three</MenuItem></StaticMenu> : null}
  </Frame>
);
const ChatScreen = ({ focus, sideProps, pointer }) => (
  <Frame sideProps={sideProps} pointer={pointer}>
    <div className="sx-chat">
      <div className="sx-chat__title">Title</div>
      <Row gap={8} className="sx-chat__composer"><Input placeholder="Placeholder" className={`sx-grow ${focus ? "st-focus-field" : ""}`} /><Button>Action</Button></Row>
      <div className="area-menu sx-menu sx-chat__list" role="menu" aria-label="Menu" style={{ width: 380 }}>
        <MenuItem icon={<SearchIcon />}>Item one</MenuItem><MenuItem icon={<StarIcon />}>Item two</MenuItem><MenuItem icon={<SettingsIcon />}>Item three</MenuItem>
      </div>
    </div>
  </Frame>
);
const SheetScreen = ({ menu, pressed, pointer }) => (
  <Frame side={false} pointer={pointer}>
    <Row gap={6}>
      <Button variant="outline">One</Button><Button variant="outline" className={pressed ? "st-press" : ""}>Two</Button><Button variant="outline">Three</Button>
      <Segmented aria-label="Label" size="sm" defaultValue="one" items={[{ value: "one", label: "One" }, { value: "two", label: "Two" }]} />
      <span className="sx-grow" /><Button>Action</Button>
    </Row>
    <Table size="sm">
      <thead><tr><th>Label</th><th>Label</th><th>Value</th><th>Value</th></tr></thead>
      <tbody>{[1, 2, 3, 4, 5, 6].map(n => <tr key={n}><td>Item {["one", "two", "three", "four", "five", "six"][n - 1]}</td><td>Description</td><td>{n}</td><td>{n * 10}</td></tr>)}</tbody>
    </Table>
    {menu ? <StaticMenu style={{ position: "absolute", left: 220, top: 130, width: 200 }}><MenuItem data-highlighted="">Item one</MenuItem><MenuItem>Item two</MenuItem><MenuItem>Item three</MenuItem></StaticMenu> : null}
  </Frame>
);

/* One screen per setting: the screen where that setting shows most. */
export const SCREENS = {
  theme: () => <DashboardScreen />, neutral: () => <DashboardScreen />, accent: () => <div data-area-action="accent" data-area-selection="accent"><DashboardScreen /></div>,
  "ground-light": () => <DashboardScreen />, "ground-dark": () => <DashboardScreen />, "layers-light": () => <DashboardScreen />, "layers-dark": () => <DashboardScreen />,
  action: () => <ChatScreen />, selection: () => <SettingsScreen />, contrast: () => <SheetScreen />,
  type: () => <BoardScreen />, density: () => <SettingsScreen />, radius: () => <BoardScreen />,
  surface: () => <BoardScreen />, stroke: () => <SheetScreen />, "stroke-hover": () => <SettingsScreen hoverField pointer={[560, 236]} />,
  "selected-stroke": () => <BoardScreen selected />, "focus-ring": () => <ChatScreen focus />, "shadow-rest": () => <SheetScreen />,
  elevation: () => <SheetScreen menu />, "shadow-resting": () => <BoardScreen />, "shadow-hover": () => <BoardScreen lift pointer={[470, 170]} />,
  "shadow-field": () => <ChatScreen />, "shadow-size": () => <BoardScreen menu />, "shadow-softness": () => <BoardScreen menu />,
  "shadow-light": () => <BoardScreen menu />, "shadow-color": () => <BoardScreen menu />,
  "fill-hover": () => <DashboardScreen sideProps={{ current: 0, hover: 2 }} pointer={[120, 140]} />, "fill-selected": () => <DashboardScreen sideProps={{ current: 2 }} />,
  "fill-pressed": () => <SheetScreen pressed pointer={[120, 56]} />, "selected-tint": () => <BoardScreen selected />,
  motion: () => <SettingsScreen />, easing: () => <SettingsScreen />,
};
export const PILL_SCREEN = () => <SettingsScreen pills />;

export function render() {
  const out = {};
  for (const [axis, v] of Object.entries(SCENES)) {
    out[axis] = {};
    for (const [k, [label, C]] of Object.entries(v)) {
      try { out[axis][k] = { label, html: renderToStaticMarkup(<Box><C /></Box>) }; }
      catch (e) { out[axis][k] = { label, html: "", error: String(e.message).slice(0, 200) }; }
    }
  }
  out.pills = {};
  for (const [id, P] of Object.entries(PILL_PARTS)) {
    out.pills[id] = {
      A: { label: "Before and after", html: renderToStaticMarkup(<Box><Row gap={14}><div style={{ [`--area-pill-${id}`]: 0 }}><P /></div><span className="sx-arrow">→</span><div><P /></div></Row></Box>) },
      B: { label: "In a row", html: renderToStaticMarkup(<Box><Card size="sm"><CardContent><Row gap={8}><P /><span className="sx-label">Label</span></Row></CardContent></Card></Box>) },
    };
  }
  out.screens = {};
  for (const [axis, C] of Object.entries(SCREENS)) {
    try { out.screens[axis] = renderToStaticMarkup(<Box><C /></Box>); } catch (e) { out.screens[axis] = ""; out.screens[`${axis}-error`] = String(e.message).slice(0, 200); }
  }
  out.screens.pills = renderToStaticMarkup(<Box><PILL_SCREEN /></Box>);
  return out;
}
