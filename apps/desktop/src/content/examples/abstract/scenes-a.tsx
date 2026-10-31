/**
 * Scenes 01–09 of the abstract board (abstract/scene.tsx explains the method). Readings are in each reference's 1400px
 * reading copy; `b(...)` turns them into CSS px at the scene's zoom.
 */
import type { ReactNode } from "react";
import {
  Avatar, AvatarGroup, Badge, Button, ButtonGroup, Card, CardContent, CardDescription, CardFooter, CardMedia, CardOverlay,
  CardTitle, Checkbox, ColorSwatch, CustomSelect, DatePicker, Field, Folder, Input, InputGroup, InputGroupText, Nav, NavGroup,
  NavItem, NumberField, Radio, SearchField, Segmented, Select, Stack, Surface, Switch,
} from "@area/react";
import {
  AddIcon, ArrowLeftIcon, ArrowLeftRightIcon, ArrowRightIcon, ArrowUpDownIcon, AsteriskIcon, BinocularsIcon, BookIcon,
  CalendarIcon, ChevronLeftIcon, ChevronRightIcon, ChevronUpIcon, ClockIcon, CodeIcon, CornersIcon, DistributeHorizontalIcon,
  DistributeVerticalIcon, FlowFreeIcon, FlowIcon, FlowVerticalIcon, FlowWrapIcon, FolderIcon, LinkIcon, LinkOffIcon,
  ListBulletIcon, MinusIcon, NavigationIcon, PaddingSideIcon, PenToolIcon, PencilIcon, PersonCircleIcon, PlugIcon,
  RepeatIcon, RotateCcwIcon, SearchIcon, ShareNodesIcon, SparkleIcon, StrikethroughIcon, TextAlignCenterIcon,
  TextAlignJustifyIcon, TextAlignLeftIcon, TextAlignRightIcon, UnderlineIcon, AppWindowIcon,
  CalendarFilledIcon, ClockFilledIcon, NavigationFilledIcon, PersonCircleFilledIcon, VideoFilledIcon,
} from "@area/icons";
import { box, Scene } from "./scene.tsx";

const ghost = (label: string, icon: ReactNode, selected?: boolean) =>
  <Button size="sm" variant="ghost" tone="neutral" iconOnly selected={selected} aria-label={label} icon={icon} />;

/* 01 Typography panel, dark (1400×1050 reading, zoom 2.625 → 533×400). A dark grey page (Dark ground 24), the panel a
   recessed layer below it with the floating shadow; Inter / 12 px, Regular / colour, 16 / 0 px / case, then the text
   tools with the first one selected in the accent (Selection: Accent). Rows 32 high, 8 apart, in 16 of padding. */
export const S01 = () => {
  const b = box(2.625);
  return (
    <Scene view={[1400, 1050]} zoom={2.625} scope={{ "data-area-theme": "dark", "data-area-ground-dark": "24", "data-area-selection": "accent" }} bg="var(--area-bg-page)">
      {/* The panel is darker than its page: its own, deeper Dark ground (12), painted as that ground's page. */}
      <div className="sc-panel" data-area-ground-dark="12" style={b(322, 255, 755, 542)}>
        <div className="sc-row sc-between"><span className="sc-title">Typography</span>{ghost("Reset", <RotateCcwIcon />)}</div>
        <div className="sc-grid" style={{ gridTemplateColumns: "168px 80px" }}>
          <Select variant="soft" aria-label="Font" defaultValue="inter"><option value="inter">Inter</option></Select>
          <NumberField variant="soft" fullWidth aria-label="Size" defaultValue={12} unit="px" />
          <Select variant="soft" aria-label="Weight" defaultValue="regular"><option value="regular">Regular</option></Select>
          <div className="sc-field" aria-label="Color"><ColorSwatch color="#8a8a8a" aria-hidden="true" className="sc-swatch-bar" /></div>
        </div>
        <div className="sc-grid" style={{ gridTemplateColumns: "80px 80px 80px" }}>
          <NumberField variant="soft" fullWidth aria-label="Line height" defaultValue={16} scrub={<ArrowUpDownIcon />} />
          <NumberField variant="soft" fullWidth aria-label="Letter spacing" defaultValue={0} unit="px" scrub={<ArrowLeftRightIcon />} />
          <div className="sc-field sc-mono sc-case" aria-label="Case"><span>AA</span><span>Aa</span><span>aa</span></div>
        </div>
        <div className="sc-row sc-between sc-tools">
          {ghost("Align left", <TextAlignLeftIcon />, true)}{ghost("Align centre", <TextAlignCenterIcon />)}{ghost("Align right", <TextAlignRightIcon />)}
          {ghost("Justify", <TextAlignJustifyIcon />)}{ghost("Underline", <UnderlineIcon />)}{ghost("Strikethrough", <StrikethroughIcon />)}
          {ghost("Link", <LinkIcon />)}{ghost("Unlink", <LinkOffIcon />)}{ghost("List", <ListBulletIcon />)}
        </div>
      </div>
    </Scene>
  );
};

/* 02 Chat app sidebar (1232×1400, zoom 2.6 → 474×538). A light grey page (Light ground 95) and the app's white window
   from the left edge in: a 49 header with the mark and the product tabs (Chat current), a rule, then the 249 sidebar:
   search, New chat on its plate, three places, Workspaces and four folders, rows on a 40 pitch (Density 36). */
export const S02 = () => {
  const b = box(2.6);
  return (
    <Scene view={[1232, 1400]} zoom={2.6} scope={{ "data-area-ground-light": "95", "data-area-density": "36" }} bg="var(--area-bg-page)">
      <div className="sc-window" data-area-ground="raised" style={b(258, 171, 1100, 1400)}>
        <div className="sc-row sc-appbar" style={{ height: 127 / 2.6 }}>
          <span className="sc-mark"><AsteriskIcon /></span>
          <Nav aria-label="Products" orientation="horizontal">
            <NavItem href="#chat" current icon={<SparkleIcon />}>Chat</NavItem>
            <NavItem href="#code" icon={<CodeIcon />}>Code</NavItem>
            <NavItem href="#solutions" icon={<PenToolIcon />}>Solutions</NavItem>
            <NavItem href="#cowork" icon={<AppWindowIcon />}>Cowork</NavItem>
          </Nav>
        </div>
        <div className="sc-sidebar" style={{ width: 647 / 2.6 }}>
          <SearchField aria-label="Search" placeholder="Search" />
          <Nav aria-label="Chat">
            <NavItem href="#new" current icon={<AddIcon />}>New Chat</NavItem>
            <NavItem href="#explore" icon={<BinocularsIcon />}>Explore</NavItem>
            <NavItem href="#plugins" icon={<PlugIcon />}>Plugins</NavItem>
            <NavItem href="#library" icon={<BookIcon />}>Library</NavItem>
            <NavGroup label="Workspaces">
              <NavItem href="#image" icon={<FolderIcon />}>Image</NavItem>
              <NavItem href="#presentation" icon={<FolderIcon />}>Presentation</NavItem>
              <NavItem href="#react" icon={<FolderIcon />}>React</NavItem>
              <NavItem href="#portfolio" icon={<FolderIcon />}>Portfolio</NavItem>
            </NavGroup>
          </Nav>
        </div>
      </div>
    </Scene>
  );
};

/* 03 Figma auto layout (1400×1400, zoom 2.8 → 500×500). A near-white page (Light ground 97); the white panel 295
   wide with a 6 inset: flow (four icons), W 360 Fill · the clip toggle (accent) · H 48 Hug, a rule, then the
   alignment grid beside two Auto selects and the padding box beside its four sides. Controls 28 (sm), 7 apart. */
export const S03 = () => {
  const b = box(2.8);
  const side = (label: string, value: number) => <NumberField size="sm" variant="soft" fullWidth aria-label={label} defaultValue={value} scrub={<PaddingSideIcon />} />;
  return (
    <Scene view={[1400, 1400]} zoom={2.8} scope={{ "data-area-ground-light": "97", "data-area-selection": "accent", "data-area-pills": "segmented switch" }} bg="var(--area-bg-page)">
      {/* Surface and Stack (owner, 2026-10-19): the panel holds two wells, so it sets them at its media inset (6 at sm, the
          shot's 6); each well's corner is the panel's less that inset; the gaps are the related role. */}
      <Surface size="sm" style={b(287, 297, 825)}>
        <Stack gap="related">
          <Segmented size="sm" iconOnly fullWidth aria-label="Flow" defaultValue="grid" items={[
            { value: "free", label: "Freeform", icon: <FlowFreeIcon /> }, { value: "grid", label: "Grid", icon: <FlowWrapIcon /> },
            { value: "vertical", label: "Vertical", icon: <FlowVerticalIcon /> }, { value: "horizontal", label: "Horizontal", icon: <FlowIcon /> },
          ]} />
          <div className="sc-grid" style={{ gridTemplateColumns: "minmax(0, 1fr) 28px minmax(0, 1fr)" }}>
            <InputGroup size="sm" variant="soft" aria-label="Width"><InputGroupText aria-hidden="true">W</InputGroupText><Input aria-label="Width" defaultValue="360" /><InputGroupText aria-hidden="true">Fill</InputGroupText></InputGroup>
            <Button size="sm" variant="soft" tone="neutral" iconOnly selected aria-label="Clip content" icon={<CornersIcon />} />
            <InputGroup size="sm" variant="soft" aria-label="Height"><InputGroupText aria-hidden="true">H</InputGroupText><Input aria-label="Height" defaultValue="48" /><InputGroupText aria-hidden="true">Hug</InputGroupText></InputGroup>
          </div>
          <hr className="sc-rule" />
          <Stack orientation="horizontal" gap="related" align="start">
            <Surface variant="soft" size="sm" className="sc-half" aria-label="Alignment">
              <div className="sc-align">{[0, 1, 2, 3, 4, 5, 6, 7, 8].map(cell => <i key={cell} data-on={cell === 4 ? "" : undefined} data-bar={[1, 7].includes(cell) ? "h" : [3, 5].includes(cell) ? "v" : undefined} />)}</div>
            </Surface>
            <Stack gap="related" className="sc-half">
              <CustomSelect size="sm" variant="soft" fullWidth aria-label="Vertical gap" defaultValue="auto" items={[{ value: "auto", label: "Auto", icon: <DistributeVerticalIcon /> }]} />
              <CustomSelect size="sm" variant="soft" fullWidth aria-label="Horizontal gap" defaultValue="auto" items={[{ value: "auto", label: "Auto", icon: <DistributeHorizontalIcon /> }]} />
            </Stack>
          </Stack>
          <Stack orientation="horizontal" gap="related" align="start">
            <Surface variant="soft" size="sm" className="sc-half" aria-label="Padding">
              <div className="sc-pad">
                <div className="sc-pad__box"><div className="sc-pad__content"><AddIcon /></div></div>
                <Badge variant="solid" tone="info" className="sc-pad__t">24</Badge><Badge variant="solid" tone="info" className="sc-pad__b">24</Badge>
                <Badge variant="solid" tone="info" className="sc-pad__l">24</Badge><Badge variant="solid" tone="info" className="sc-pad__r">8</Badge>
              </div>
            </Surface>
            <Stack gap="related" className="sc-half">{side("Top", 24)}{side("Bottom", 24)}{side("Left", 24)}{side("Right", 8)}</Stack>
          </Stack>
        </Stack>
      </Surface>
    </Scene>
  );
};

/* 04 Delivery card (1400×1400, zoom 2.4 → 583×583). A pale grey page (Light ground 93); a white bezel round the card
   (10 inset), the card's media a grey field with a box on a conveyor and the dark clock button in its corner, then
   the title, the description, a rule, View Status and the note. */
export const S04 = () => {
  const b = box(2.4);
  return (
    <Scene view={[1400, 1400]} zoom={2.4} scope={{ "data-area-ground-light": "93", "data-area-accent": "lime", "data-area-type": "13" }} bg="var(--area-bg-page)">
      {/* The bezel is a Surface (white on the grey page: its own Light ground, 100) holding Area's Card, so the card sits
          at the bezel's media inset with the bezel's corner less that inset (Surface and Stack, owner 2026-10-19). */}
      <Surface size="md" data-area-ground-light="100" style={b(208, 165, 984)}>
        <Card>
          <CardMedia bleed className="sc-delivery__media" aria-hidden="true">
            <Conveyor />
            <CardOverlay placement="top-end"><Button variant="solid" tone="neutral" iconOnly aria-label="History" icon={<ClockIcon />} /></CardOverlay>
          </CardMedia>
          <CardContent>
            <CardTitle>Track Your Delivery</CardTitle>
            <CardDescription>Monitor your shipment status in real-time. Stay informed about your delivery's progress every step of the way.</CardDescription>
          </CardContent>
          <CardFooter>
            <Stack orientation="horizontal" spread className="sc-grow">
              <Button size="lg" variant="outline" tone="neutral">View Status</Button>
              <span className="sc-note"><CalendarIcon /> Your delivery is on its way!</span>
            </Stack>
          </CardFooter>
        </Card>
      </Surface>
    </Scene>
  );
};
/** The media's drawing: a parcel with a band in the accent on an isometric conveyor, in Area's 1px strokes. Drawn at
    the reference's proportions: the belt runs from 9% to 94% across and 43% to 88% down, the parcel 23% wide. */
const Conveyor = () => (
  <svg className="sc-conveyor" viewBox="0 0 400 210" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
    <path d="M30 98 L330 168 L350 160 L50 92 Z" className="sc-conveyor__top" />
    <path d="M30 98 L330 168 L330 176 L30 106 Z" className="sc-conveyor__side" />
    <path d="M330 168 L350 160 L350 168 L330 176 Z" className="sc-conveyor__side" />
    {Array.from({ length: 12 }, (_, i) => <path key={i} d={`M${70 + i * 22} ${101 + i * 5.1} L${90 + i * 22} ${95 + i * 5.1}`} className="sc-conveyor__slat" />)}
    <path d="M30 106 V210 M330 176 V210 M350 168 V210" className="sc-conveyor__leg" />
    <g transform="translate(58 6) scale(0.98)">
      <path d="M0 22 L44 36 L44 82 L0 68 Z" className="sc-box__side" />
      <path d="M44 36 L92 22 L92 68 L44 82 Z" className="sc-box__front" />
      <path d="M0 22 L48 8 L92 22 L44 36 Z" className="sc-box__top" />
      <path d="M58 32 L68 29 L68 75 L58 78 Z M24 15 L34 12 L78 26 L68 29 Z" className="sc-box__band" />
    </g>
  </svg>
);

/* 05 Event chips (1400×1400, zoom 6 → 233×233). The shot is a close crop of Area-sized badges: six tinted badges with
   their icons in three centred rows, 5 apart (the info, warning, success, info, danger and discovery tones). */
export const S05 = () => (
  <Scene view={[1400, 1400]} zoom={5.6} bg="var(--area-bg-surface)">
    <div className="sc-chips">
      <div className="sc-row sc-center"><Badge tone="info" icon={<CalendarFilledIcon />}>March 09 — 16</Badge><Badge tone="warning" icon={<RepeatIcon />}>Weekly</Badge></div>
      <div className="sc-row sc-center"><Badge tone="success" icon={<VideoFilledIcon />}>Zoom</Badge><Badge tone="info" icon={<NavigationFilledIcon />}>Herengracht 133, Amst…</Badge></div>
      <div className="sc-row sc-center"><Badge tone="danger" icon={<PersonCircleFilledIcon />}>Participants</Badge><Badge tone="discovery" icon={<ClockFilledIcon />}>12:00 — 13:00</Badge></div>
    </div>
  </Scene>
);

/* 06 Document cards (1400×1101, zoom 2.9 → 483×380; the Share button's 93 = Area's 32). A grey page (Light ground 95) and a white container running in
   from the left: search and Categories, then two document cards on the subtle ground, each a folder, a count with
   three people, the title and description, Share (solid) and Edit. */
export const S06 = () => {
  const b = box(2.9);
  const card = (title: string, text: string, count: string, left: number, width: number) => (
    <div className="sc-doc" data-area-ground="recessed" style={b(left, 308, width, 602)}>
      <div className="sc-row sc-between sc-top"><Folder size="md" /><span className="sc-row sc-people"><span className="sc-muted">{count}</span>
        <AvatarGroup max={3} size="sm" aria-label="David Tee and 2 teams"><Avatar size="sm" src="images/david-tee.jpg" fallback="DT" alt="David Tee" /><Avatar size="sm" fallback="DE" alt="Design" /><Avatar size="sm" fallback="PR" alt="Product" /></AvatarGroup></span></div>
      <div className="sc-doc__text"><h3 className="sc-h3 sc-h3--sm">{title}</h3><p className="sc-p">{text}</p></div>
      <div className="sc-row sc-between"><Button icon={<ShareNodesIcon />} className="sc-grow">Share</Button><Button variant="ghost" tone="neutral" icon={<PencilIcon />}>Edit</Button></div>
    </div>
  );
  return (
    <Scene view={[1400, 1101]} zoom={2.9} scope={{ "data-area-ground-light": "95", "data-area-type": "13" }} bg="var(--area-bg-page)">
      <div className="sc-window sc-window--round" data-area-ground="raised" style={b(-60, 150, 1295, 802)} />
      <div className="sc-row" style={b(413, 190, 782, 74)}><SearchField size="sm" aria-label="Search" placeholder="Search" className="sc-grow" /><Button size="sm" variant="outline" tone="neutral" icon={<ListBulletIcon />}>Categories</Button></div>
      {card("Onboarding Guide", "A comprehensive guide to help new users start", "89+", -245, 700)}
      {card("Privacy Policy", "Details on how we handle user data and privacy", "350+", 495, 700)}
    </Scene>
  );
};

/* 07 Form controls (1400×1400, zoom 2.5 → 560×560). A warm off-white page (Neutral warm, Light ground 99); two
   columns 130 wide, 13 apart: Checkbox / Radio, Toggle / a − 0 + counter, Name / Email, Job title / Birthday. Type 12
   and Density 28, as the shot is compact. */
export const S07 = () => {
  const b = box(2.5);
  return (
    <Scene view={[1400, 1400]} zoom={2.5} scope={{ "data-area-neutral": "warm", "data-area-ground-light": "99", "data-area-type": "12", "data-area-density": "28" }} bg="var(--area-bg-page)">
      <div className="sc-form" style={b(358, 462, 683, 450)}>
        <Checkbox label="Checkbox" defaultChecked />
        <Radio name="sc07" value="a" label="Radio" />
        <Switch label="Toggle" defaultChecked />
        <div className="sc-field sc-counter"><Button size="sm" variant="ghost" tone="neutral" iconOnly aria-label="Decrease" icon={<MinusIcon />} /><span>0</span><Button size="sm" variant="ghost" tone="neutral" iconOnly aria-label="Increase" icon={<AddIcon />} /></div>
        <Field label="Name"><Input placeholder="Your name" /></Field>
        <Field label="Email"><Input placeholder="email@example.com" /></Field>
        <Field label="Job title"><Select defaultValue="designer"><option value="designer">Designer</option></Select></Field>
        <Field label="Birthday"><DatePicker aria-label="Birthday" defaultValue="2099-09-08" /></Field>
      </div>
    </Scene>
  );
};

/* 08 Table footer (1400×1050, zoom 2.56 → 547×410). A cool grey page (Neutral cool, Light ground 92); one bar on the
   subtle ground: Show 30 ⌃, the range, and a joined group of 1 / 24 and its two steps. Type 13, Density 28. */
export const S08 = () => {
  const b = box(2.56);
  return (
    <Scene view={[1400, 1050]} zoom={2.56} scope={{ "data-area-neutral": "cool", "data-area-ground-light": "92", "data-area-type": "12", "data-area-density": "28" }} bg="var(--area-bg-page)">
      <div className="sc-bar sc-row" data-area-ground="recessed" style={b(295, 480, 810, 90)}>
        <Button size="sm" variant="outline" tone="neutral" trailingIcon={<ChevronUpIcon />}>Show 30</Button>
        <span className="sc-muted sc-grow">Item 1 to 30</span>
        <ButtonGroup aria-label="Pages">
          <Button size="sm" variant="outline" tone="neutral" className="sc-status">1 / 24</Button>
          <Button size="sm" variant="outline" tone="neutral" iconOnly aria-label="Previous page" icon={<ChevronLeftIcon />} />
          <Button size="sm" variant="outline" tone="neutral" iconOnly aria-label="Next page" icon={<ChevronRightIcon />} />
        </ButtonGroup>
      </div>
    </Scene>
  );
};

/* 09 Four pagination layouts (1400×1396, zoom 1.86 → 753×751). Four white cards, 11 apart; in each, a pill track on
   the component fill holding pill buttons (Pills: Button): numbered, a count with arrows, page sizes beside a count,
   and a total with arrows. The current page and the back step are raised (outline), the next step solid. Type 12,
   Density 28. */
export const S09 = () => {
  const b = box(1.86);
  const step = (label: string, icon: ReactNode, solid?: boolean) =>
    <Button variant={solid ? "solid" : "outline"} tone="neutral" iconOnly aria-label={label} icon={icon} />;
  return (
    <Scene view={[1400, 1396]} zoom={1.86} scope={{ "data-area-type": "12", "data-area-density": "32", "data-area-pills": "button segmented" }} bg="var(--area-bg-surface)">
      {[[15, 15], [710, 15], [15, 708], [710, 708]].map(([left, top], index) => <div key={index} className="sc-pagecard" style={b(left!, top!, 675, 673)} />)}
      <div className="sc-track sc-row" style={b(80, 318)}>
        <Button variant="outline" tone="neutral">Previous</Button>
        <Button variant="ghost" tone="neutral">1</Button><Button variant="outline" tone="neutral">2</Button><Button variant="ghost" tone="neutral">3</Button>
        <span className="sc-ellipsis">…</span><Button variant="ghost" tone="neutral">17</Button><Button>Next</Button>
      </div>
      <div className="sc-track sc-row" style={b(893, 318)}>{step("Previous page", <ArrowLeftIcon />)}<span className="sc-count">2 of 17</span>{step("Next page", <ArrowRightIcon />, true)}</div>
      <div className="sc-row" style={b(66, 1010)}>
        <Segmented aria-label="Page size" defaultValue="10" items={[{ value: "10", label: "10 Items" }, { value: "25", label: "25" }, { value: "50", label: "50" }]} />
      </div>
      <div className="sc-track sc-row" style={b(397, 1010)}>{step("Previous page", <ChevronLeftIcon />)}<span className="sc-count">2 of 17</span>{step("Next page", <ChevronRightIcon />, true)}</div>
      <div className="sc-track sc-row" style={b(860, 1010)}><span className="sc-count">Showing 10/100</span>{step("Previous page", <ArrowLeftIcon />)}{step("Next page", <ArrowRightIcon />, true)}</div>
    </Scene>
  );
};
