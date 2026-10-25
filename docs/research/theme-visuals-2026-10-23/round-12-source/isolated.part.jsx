/* ================================ Isolated components ================================ */
/* One component, or one small cluster, centred in its own 4:3 frame and drawn larger: menus that float, a cropped corner
   of a sidebar, a single card, a carousel, a button group with a popover, badges, an inspector, a toolbar, a player,
   a form, a tabs header, a command palette, a toast, a calendar. Each frame's size sets how large its subject reads. */
const Iso = ({ children, w, h, align = "center" }) => <div className={`sx-iso sx-iso--${align}`} style={{ width: w, height: h }}>{children}</div>;
const IsoMenu = () => (
  <Iso w={380} h={285} align="top">
    <Col gap={8} style={{ alignItems: "flex-end", width: 300 }}>
      <Button variant="soft" iconOnly aria-label="More" icon={<MoreHorizontalIcon />} data-st="press" />
      <div className="area-menu sx-isomenu" role="menu" aria-label="Menu">
        <MenuLabel>Label</MenuLabel>
        <div className="sx-isomenu__choices" data-pop="selection">
          <RadioGroup name="disp" defaultValue="one" aria-label="Label" className="sx-isochoices">
            {["One", "Two", "Three"].map((t, i) => <Radio key={t} value={["one", "two", "three"][i]} variant="card" layout="preview" label={t} data-st={i === 0 ? "selected" : undefined}
              leadingVisual={<span className={`sx-mini sx-mini--${i}`}><i /><b /></span>} />)}
          </RadioGroup>
        </div>
        <MenuSeparator />
        <MenuItem icon={<AddIcon />} data-highlighted="">Item one</MenuItem>
        <MenuItem icon={<DismissIcon />}>Item two</MenuItem>
        <MenuItem icon={<TrashIcon />} tone="danger">Item three</MenuItem>
      </div>
    </Col>
  </Iso>
);
const IsoSidebar = () => (
  <Iso w={300} h={225} align="corner">
    <Surface className="sx-cropwin">
      <div className="sx-cropwin__in">
        <Row gap={12}><Avatar size="lg" fallback="DT" aria-label="David Tee" /><Col gap={2}><T k="title">David Tee</T><Row gap={6}><T k="sm">Label</T><Badge size="sm">Badge</Badge></Row></Col></Row>
        <Separator />
        <SearchField placeholder="Placeholder" aria-label="Search" data-st="focus" />
        <Nav aria-label="Pages">
          <NavItem href="#" icon={<HomeIcon />} data-st="hover">Item one</NavItem>
          <NavItem href="#" icon={<SettingsIcon />} current trailing={<ChevronRightIcon />}>Item two</NavItem>
          <NavItem href="#" icon={<BellIcon />}>Item three</NavItem>
          <NavItem href="#" icon={<FolderIcon />}>Item four</NavItem>
        </Nav>
      </div>
    </Surface>
  </Iso>
);
const IsoCard = () => (
  <Iso w={340} h={255}>
    <Card style={{ width: 232 }} data-st="lift">
      <CardMedia aria-hidden="true"><CardOverlay placement="top-end"><Button size="sm" variant="soft" pill iconOnly aria-label="Collapse" icon={<MinimizeIcon />} data-st="press" /></CardOverlay></CardMedia>
      <CardContent><CardTitle>Title</CardTitle><CardDescription>Description of the item in a line or two.</CardDescription></CardContent>
    </Card>
  </Iso>
);
const IsoCarousel = () => (
  <Iso w={480} h={360}>
    <Card style={{ width: 420 }} data-st="selected"><CardContent>
      <CardHeader action={<><Button size="sm" variant="ghost" iconOnly aria-label="Previous" icon={<ChevronLeftIcon />} disabled /><Button size="sm" variant="ghost" iconOnly aria-label="Next" icon={<ChevronRightIcon />} /></>}><CardTitle>Title</CardTitle></CardHeader>
      <CardCarousel aria-label="Items">{["one", "two", "three", "four"].map(t => <li key={t}><CardMedia aria-hidden="true" /><CardContent><CardTitle>{`Item ${t}`}</CardTitle><CardDescription>Description</CardDescription></CardContent></li>)}</CardCarousel>
      <CardFooter className="sx-center-row"><Button size="sm" variant="outline" data-st="hover">Action</Button></CardFooter>
    </CardContent></Card>
  </Iso>
);
const IsoButtons = () => (
  <Iso w={400} h={300}>
    <Col gap={10} style={{ alignItems: "flex-start" }}>
      <Row gap={8}>
        <Button variant="outline" icon={<AddIcon />}>Action</Button>
        <Toolbar aria-label="Options" variant="surface">
          <ToolbarItem><Button variant="ghost" icon={<GridIcon />}>Label</Button></ToolbarItem>
          <ToolbarItem><Button variant="soft" trailingIcon={<ChevronDownIcon />} data-st="press">50</Button></ToolbarItem>
          <ToolbarSeparator />
          <ToolbarItem><Button variant="ghost" iconOnly aria-label="More" icon={<MoreHorizontalIcon />} /></ToolbarItem>
        </Toolbar>
      </Row>
      <Card className="sx-float" style={{ width: 330 }}><CardContent>
        <T k="strong">Label</T>
        <div data-pop="selection" style={{ marginTop: 10 }}><Slider aria-label="Label" defaultValue={40} data-st="focus" /></div>
        <Row className="sx-between" style={{ marginTop: 6 }}><T k="sm">Label</T><T k="sm">Label</T></Row>
      </CardContent></Card>
    </Col>
  </Iso>
);
const IsoBadges = () => (
  <Iso w={340} h={255}>
    <Col gap={14} style={{ alignItems: "flex-start" }}>
      <BadgeGroup><Badge>Badge</Badge><Badge variant="outline">Badge</Badge><Badge variant="solid">Badge</Badge><Badge dot tone="success">Badge</Badge></BadgeGroup>
      <Row gap={6}><Chip selected data-st="selected">Chip</Chip><Chip>Chip</Chip><Chip icon={<StarIcon />}>Chip</Chip></Row>
      <Row gap={6}><Tag icon={<HashIcon />}>Label</Tag><Tag>Label</Tag><Tag tone="gray">Label</Tag></Row>
      <Row gap={10}><AvatarGroup size="sm"><Avatar fallback="DT" aria-label="David Tee" /><Avatar fallback="T1" aria-label="Team one" /><Avatar fallback="T2" aria-label="Team two" /></AvatarGroup><Count count={12} /><Kbd keys={["⌘", "K"]} /></Row>
    </Col>
  </Iso>
);
const IsoInspector = () => (
  <Iso w={440} h={330}>
    <Card style={{ width: 380 }}><CardContent>
      <Col gap={10}>
        <Segmented aria-label="Layout" fullWidth defaultValue="two" items={[{ value: "one", label: <FrameIcon />, "aria-label": "One" }, { value: "two", label: <GridIcon />, "aria-label": "Two" }, { value: "three", label: <ColumnsIcon />, "aria-label": "Three" }, { value: "four", label: <RowsIcon />, "aria-label": "Four" }]} />
        <Row gap={8}><NumberField size="sm" aria-label="Width" defaultValue={360} className="sx-grow" data-st="focus" /><Button size="sm" variant="soft" iconOnly aria-label="Link" icon={<ExpandIcon />} data-pop="action" /><NumberField size="sm" aria-label="Height" defaultValue={48} className="sx-grow" /></Row>
        <Separator />
        <div className="sx-insgrid">
          <AlignmentPicker label="Alignment" defaultValue="center" variant="surface" />
          <Col gap={8}>
            <Select size="sm" aria-label="Label" defaultValue="one"><option value="one">Option one</option></Select>
            <Select size="sm" aria-label="Label" defaultValue="one"><option value="one">Option one</option></Select>
            <NumberField size="sm" aria-label="Gap" defaultValue={24} />
          </Col>
        </div>
      </Col>
    </CardContent></Card>
  </Iso>
);
const IsoToolbar = () => (
  <Iso w={520} h={390}>
    <Toolbar aria-label="Format" variant="surface" className="sx-fmtbar">
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
const IsoPlayer = () => (
  <Iso w={420} h={315}>
    <Card style={{ width: 360 }} data-st="lift"><CardContent>
      <Row gap={12}><Avatar size="lg" shape="square" fallback={<PlayFilledIcon />} aria-label="Cover" /><Col gap={0} className="sx-grow"><T k="strong">Title</T><T k="sm">David Tee</T></Col><Icon label="Save" icon={<HeartIcon />} /></Row>
      <div data-pop="selection" style={{ marginTop: 12 }}><Slider aria-label="Position" defaultValue={35} /></div>
      <Row className="sx-between"><T k="sm">Value</T><T k="sm">Value</T></Row>
      <Row gap={6} className="sx-center-row" style={{ marginTop: 6 }}><Icon label="Shuffle" icon={<ShuffleIcon />} /><Icon label="Back" icon={<SkipBackIcon />} /><span data-pop="action"><Button pill iconOnly aria-label="Play" icon={<PlayFilledIcon />} data-st="press" /></span><Icon label="Next" icon={<SkipForwardIcon />} /><Icon label="Volume" icon={<VolumeIcon />} /></Row>
    </CardContent></Card>
  </Iso>
);
const IsoForm = () => (
  <Iso w={380} h={285}>
    <Card style={{ width: 320 }}><CardContent>
      <Col gap={12}>
        <Field label="Label" description="Description"><Input placeholder="Placeholder" data-st="focus" /></Field>
        <Field label="Label"><Select aria-label="Label" defaultValue="one"><option value="one">Option one</option></Select></Field>
        <Row gap={8}><span data-pop="selection"><Checkbox label="Option one" defaultChecked /></span></Row>
        <Row gap={8} className="sx-end"><Button variant="outline">Cancel</Button><span data-pop="action"><Button data-st="press">Action</Button></span></Row>
      </Col>
    </CardContent></Card>
  </Iso>
);
const IsoTabs = () => (
  <Iso w={440} h={330}>
    <Card style={{ width: 400 }}><CardContent>
      <Col gap={12}>
        <Row className="sx-between"><Crumbs /><Row gap={4}><Icon label="Share" icon={<ShareIcon />} /><span data-pop="action"><Button size="sm" data-st="press">Action</Button></span></Row></Row>
        <Tabs aria-label="Views" defaultValue="one" items={[{ id: "one", label: "One" }, { id: "two", label: "Two" }, { id: "three", label: "Three" }]} />
        <Segmented aria-label="Range" fullWidth defaultValue="two" items={[{ value: "one", label: "One" }, { value: "two", label: "Two" }, { value: "three", label: "Three" }]} />
        <Pagination pageCount={5} defaultPage={2} />
      </Col>
    </CardContent></Card>
  </Iso>
);
const IsoCommand = () => (
  <Iso w={480} h={360}>
    <div style={{ width: 420 }}>
      <CommandPalette inline placeholder="Placeholder" items={[
        { id: "a", label: "Item one", icon: <DocumentIcon />, group: "Label", shortcut: ["cmd", "1"] },
        { id: "b", label: "Item two", icon: <FolderIcon />, group: "Label", description: "Description" },
        { id: "c", label: "Item three", icon: <SettingsIcon />, group: "Label", shortcut: ["cmd", ","] },
        { id: "d", label: "Item four", icon: <StarIcon />, group: "Label" },
      ]} />
    </div>
  </Iso>
);
const IsoToast = () => (
  <Iso w={380} h={285}>
    <Col gap={10} style={{ width: 320 }}>
      <Toast title="Title" icon={<BellIcon />} action={<Button size="sm" variant="outline">Action</Button>}>Description of the update.</Toast>
      <Toast title="Title" tone="success">Description of the update.</Toast>
    </Col>
  </Iso>
);
const IsoCalendar = () => (
  <Iso w={400} h={300}>
    <div data-pop="selection"><Calendar aria-label="Dates" variant="surface" defaultValue={new Date(2026, 9, 21)} /></div>
  </Iso>
);
export const ISOLATED = {
  menu: ["Menu", IsoMenu], sidebar: ["Sidebar corner", IsoSidebar], card: ["Card", IsoCard], carousel: ["Carousel", IsoCarousel],
  buttons: ["Buttons and popover", IsoButtons], badges: ["Badges and chips", IsoBadges], inspector: ["Inspector", IsoInspector],
  toolbar: ["Toolbar", IsoToolbar], player: ["Player", IsoPlayer], form: ["Form", IsoForm], tabs: ["Tabs header", IsoTabs],
  command: ["Command palette", IsoCommand], toast: ["Toasts", IsoToast], calendar: ["Calendar", IsoCalendar],
};

