
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
  <div className="sx-fit" style={{ "--fit": 0.375 }}>
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
  <Card size="sm" className="sx-grow"><CardContent><CardDescription>Label</CardDescription><div className="sx-value">{value}</div><CardDescription>Description</CardDescription></CardContent></Card>
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
    <Card className="sx-flush"><Table size="sm">
      <thead><tr><th>Label</th><th>Label</th><th>Value</th><th>Value</th></tr></thead>
      <tbody>{[1, 2, 3, 4, 5, 6].map(n => <tr key={n}><td>Item {["one", "two", "three", "four", "five", "six"][n - 1]}</td><td>Description</td><td className={n === 2 ? "sx-cell-on" : ""}>{n}</td><td>{n * 10}</td></tr>)}</tbody>
    </Table></Card>
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
