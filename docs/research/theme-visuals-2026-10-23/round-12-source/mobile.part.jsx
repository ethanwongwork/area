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
const NavBtn = ({ label, icon: I, st }) => <Button variant="ghost" pill iconOnly aria-label={label} icon={<I size={22} />} data-st={st} />;
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
      const inner = <><I size={24} /><span className="sx-tablabel">{t}</span></>;
      return i === current
        ? <Surface key={t} variant="soft" className="sx-tabitem sx-tabitem--on" aria-current="page">{inner}</Surface>
        : <span key={t} className="sx-tabitem" data-st={i === hover ? "tabhover" : undefined}>{inner}</span>; })}</Surface>
    <Surface className="sx-tabsearch" aria-label="Search"><SearchIcon size={24} /></Surface>
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
      <Button size="lg" fullWidth pill data-st="press">Action</Button>
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
      <ColorSwatchPicker label="Colour" items={SWATCHES.slice(0, 4)} defaultValue="#1d1d1f" />
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
        <Col key={i} gap={6} style={{ alignItems: "center" }}><Button size="lg" variant={i === 0 ? "solid" : "soft"} pill iconOnly aria-label={t} icon={<I size={22} />} data-st={i === 1 ? "press" : undefined} /><T k="sm">{t}</T></Col>))}</div>
      <Card data-st="selected"><CardContent className="sx-mlist">
        <Row className="sx-between"><CardTitle>Title</CardTitle><Button variant="ghost">Action</Button></Row>
        {[["Team one", "T1", "-10"], ["David Tee", "DT", "+20"], ["Team two", "T2", "-30"]].map(([n, a, v], i) => (
          <div key={i} className="sx-mrow"><Row gap={12}><Avatar fallback={a} aria-label={n} /><Col gap={0}><T k="strong">{n}</T><T k="sm">Value</T></Col></Row><T k="strong">{v}</T></div>))}
      </CardContent></Card>
      <Input size="lg" placeholder="Placeholder" leadingIcon={<SearchIcon />} data-st="focus" />
    </div>
    <Menu style={{ right: 16, top: 50, width: 220 }} />
  </Phone>
);

