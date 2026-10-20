/**
 * Scenes 19–27 of the abstract board (abstract/scene.tsx explains the method; 22 is not an interface piece). Readings
 * are in each reference's reading copy; `b(...)` turns them into CSS px at the scene's zoom.
 */
import type { CSSProperties, ReactNode } from "react";
import {
  Badge, Button, CustomSelect, Kbd, MenuItem, MenuSeparator, Nav, NavGroup, NavItem, Segmented, Switch, Table,
} from "@area/react";
import {
  AddIcon, ArchiveIcon, ArrowUpIcon, ArrowUpRightIcon, BlocksIcon, ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon,
  ChevronUpIcon, CubeFilledIcon, DatabaseIcon, DismissIcon, DocumentIcon, DotsFourIcon, FlaskIcon, FolderIcon,
  HistoryIcon, HomeIcon, ImageIcon, ImageOffIcon, LayersIcon, LayoutDashboardIcon, ListFilterIcon, LockFilledIcon,
  MonitorCogIcon, MoreHorizontalIcon, PanelLeftIcon, PenIcon, PenToolIcon, PersonCircleIcon, RectangleIcon, SearchIcon,
  SparkleIcon, UploadIcon, WrenchIcon, ChevronsUpDownIcon,
} from "@area/icons";
import { box, Scene } from "./scene.tsx";

/* 19 Comment composer and tools, close (1400×1050, zoom 3 → 467×350; the keycaps' 64 = Area's 20 Kbd). A white page;
   the composer's corner on its well (a soft grey field, radius 25) with ⌘ ↵ "to leave a comment" and the send
   action (solid info, a pill), the resize grip in its corner; below, the tool pill: shape, arrow and pen as soft round
   buttons, and Add raised on its own (outline) at the end. */
export const S19 = () => {
  const b = box(3);
  // A tool by its centre in the reference; the pill starts at (-120, 655) and a 40 button is 120 reference px.
  const at = (centre: number) => b(centre - 60 + 120, 766 - 60 - 655);
  const tool = (label: string, icon: ReactNode, centre: number) =>
    <Button size="lg" variant="soft" tone="neutral" iconOnly pill aria-label={label} icon={icon} style={at(centre)} />;
  return (
    <Scene view={[1400, 1050]} zoom={3} scope={{ "data-area-ground-light": "100", "data-area-type": "13" }} bg="var(--area-bg-page)">
      <div className="sc-composer" style={b(-80, -80, 1205, 660)}>
        <span className="sc-composer__hint" style={b(75, 535)}><Kbd keys={["cmd"]} /><Kbd keys={["enter"]} /><span>to leave a comment</span></span>
        <Button size="lg" variant="solid" tone="info" iconOnly pill aria-label="Comment" icon={<ArrowUpIcon />} className="sc-composer__send" style={b(995 - 60 + 80, 450 - 60 + 80)} />
        <svg className="sc-composer__grip" style={b(1040 + 80, 494 + 80, 58, 58)} viewBox="0 0 58 58" aria-hidden="true"><path d="M52 4 A48 48 0 0 1 4 52" /></svg>
      </div>
      <div className="sc-tools-pill" role="toolbar" aria-label="Tools" style={b(-120, 655, 966, 222)}>
        {tool("Shape", <RectangleIcon />, 2)}{tool("Arrow", <ArrowUpRightIcon />, 133)}{tool("Pen", <PenToolIcon />, 264)}
        <Button size="lg" variant="outline" tone="neutral" iconOnly pill aria-label="Add" icon={<AddIcon />} className="sc-tools-pill__add" style={at(735)} />
      </div>
    </Scene>
  );
};

/* 20 Dock magnification (1400×1046, zoom 1.75 → 800×598; Slow Motion's 48 = Area's 28 button). A white page; two
   dock bars (white, the floating shadow) of grey tiles that grow toward the pointer, the first by proximity (the
   neighbours grow too), the second by direct scaling (only the hovered tile); each named below in muted text, and the
   Slow Motion toggle. Tiles are drawn: a dock is not a component Area has. */
export const S20 = () => {
  const b = box(1.75);
  const tile = (x: number, y: number, w: number, h: number, ink: number) => <i key={x} className="sc-dock__tile" style={{ ...b(x, y, w, h), "--_ink": `${ink}%` } as CSSProperties} />;
  return (
    <Scene view={[1400, 1046]} zoom={1.75} scope={{ "data-area-ground-light": "99", "data-area-type": "12" }} bg="var(--area-bg-page)">
      <div className="sc-dock" style={b(395, 180, 616, 117)} />
      {tile(405, 194, 91, 92, 5)}{tile(509, 181, 105, 105, 11)}{tile(625, 150, 137, 137, 21)}{tile(773, 165, 121, 121, 16)}{tile(906, 192, 96, 94, 7)}
      <Cursor style={b(733, 215)} />
      <span className="sc-dock__label" style={b(703, 355)}>Using Proximity</span>
      <div className="sc-dock" style={b(395, 535, 616, 117)} />
      <div className="sc-dock--clip" style={b(395, 535, 616, 117)}>
        {[322, 427, 530, 784, 888, 993].map(x => <i key={x} className="sc-dock__tile" style={{ ...b(x - 395, 549 - 535, 91, 90), "--_ink": "6%" } as CSSProperties} />)}
      </div>
      {tile(634, 501, 138, 138, 21)}
      <Cursor style={b(733, 569)} />
      <span className="sc-dock__label" style={b(703, 708)}>Direct Scaling</span>
      <Button size="sm" variant="soft" tone="neutral" style={b(632, 872)} className="sc-abs">Slow Motion</Button>
    </Scene>
  );
};
const Cursor = ({ style }: { style: CSSProperties }) => (
  <svg className="sc-pointer" style={style} viewBox="0 0 14 21" aria-hidden="true"><path d="M1 1v16.2l3.9-3.8 2.6 6.1 2.9-1.2-2.6-6h5.5Z" /></svg>
);

/* 21 Page style sheet (787×1400, zoom 2.5 → 315×560; Immersive / Faded's 84 = Area's 32 Segmented). A marble page and
   the document behind; the sheet: Page Style and its close, a rule, then three sections under small caps labels:
   Presets (a card with stacked artwork), Cover image (two picture choices, No Cover chosen in the accent), Background
   (four tiles, Image chosen and raised), the Immersive / Faded segmented control, and two rows: Image with its
   thumbnail, Blur Image with a switch. */
export const S21 = () => {
  const b = box(2.5);
  const p = (x: number, y: number, w?: number, h?: number) => b(x - 28, y - 198, w, h);
  const bgTile = (label: string, icon: ReactNode, x: number, selected?: boolean) => (
    <label className="sc-bgtile" style={p(x, 907, 158, 138)}><input type="radio" name="sc21-bg" defaultChecked={selected} />{icon}<span>{label}</span></label>
  );
  return (
    <Scene view={[787, 1400]} zoom={2.5} scope={{ "data-area-ground-light": "98", "data-area-type": "12" }} className="sc-marble">
      <div className="sc-doccard" style={b(30, 95, 727, 400)}><h3>Design showcase</h3></div>
      <div className="sc-sheet" role="dialog" aria-label="Page Style" style={b(28, 198, 732, 1260)}>
        <h3 className="sc-sheet__title" style={p(68, 251)}>Page Style</h3>
        <Button size="sm" variant="soft" tone="neutral" iconOnly pill aria-label="Close" icon={<DismissIcon />} className="sc-abs sc-mid" style={p(697, 251)} />
        <hr className="sc-sheet__rule" style={p(68, 304, 652)} />
        <span className="sc-eyebrow" style={p(68, 348)}>Presets</span>
        <div className="sc-presets" style={p(68, 391, 652, 146)}>
          <b>Presets</b><span>Browse &amp; Pick Presets</span>
          <i className="sc-presets__water" /><i className="sc-presets__window"><i /><i /><i /><i /></i>
        </div>
        <span className="sc-eyebrow" style={p(68, 600)}>Cover image</span><ChevronDownIcon className="sc-abs sc-mid sc-chev" style={p(705, 600)} />
        <div role="radiogroup" aria-label="Cover image">
          <label className="sc-cover" style={p(68, 643, 318, 149)}><input type="radio" name="sc21-cover" defaultChecked /><i className="sc-cover__page" /><span>No Cover</span></label>
          <label className="sc-cover" style={p(404, 643, 316, 149)}><input type="radio" name="sc21-cover" /><i className="sc-cover__page sc-cover__page--image" /><span>Cover Image</span></label>
        </div>
        <span className="sc-eyebrow" style={p(68, 856)}>Background</span><ChevronDownIcon className="sc-abs sc-mid sc-chev" style={p(705, 856)} />
        <div className="sc-bgtiles" role="radiogroup" aria-label="Background" style={p(68, 898, 652, 154)} />
        {bgTile("None", <ImageOffIcon />, 75)}{bgTile("Solid", <i className="sc-swatch sc-swatch--solid" />, 236)}
        {bgTile("Gradient", <i className="sc-swatch sc-swatch--gradient" />, 396)}{bgTile("Image", <ImageIcon />, 556, true)}
        <div className="sc-abs" style={p(68, 1071, 652)}><Segmented fullWidth aria-label="Background style" defaultValue="immersive" items={[{ value: "immersive", label: "Immersive" }, { value: "faded", label: "Faded" }]} /></div>
        <span className="sc-abs sc-mid-y sc-sheet__row" style={p(68, 1218)}>Image</span>
        <i className="sc-thumb" style={p(620, 1185, 100, 66)} />
        <div className="sc-abs sc-mid-y" style={p(68, 1311, 652)}><Switch size="lg" labelPosition="start" fullWidth label={<span className="sc-sheet__row">Blur Image</span>} /></div>
      </div>
    </Scene>
  );
};

/* 23 Layout picker (1400×787, zoom 1.75 → 800×450). A near-white page; four layout cards, the first chosen (the accent
   edge and its halo, Accent teal), each holding a browser frame drawn as a wireframe: a sidebar, panels, text lines and
   a floating bar, in Area's fills and edges. */
export const S23 = () => {
  const b = box(1.75);
  const lines = (n: number, seed: number) => Array.from({ length: n }, (_, i) => <i key={i} style={{ inlineSize: `${42 + ((i * 37 + seed * 13) % 50)}%` }} />);
  const card = (x: number, y: number, chosen: boolean, label: string, children: ReactNode) => (
    <label className="sc-layout" style={b(x, y, x === 255 ? 419 : 418, 314)}>
      <input type="radio" name="sc23-layout" defaultChecked={chosen} aria-label={label} />
      <span className="sc-layout__frame">{children}</span>
    </label>
  );
  const url = <span className="sc-layout__url"><LockFilledIcon />localhost:3000</span>;
  return (
    <Scene view={[1400, 787]} zoom={1.75} scope={{ "data-area-ground-light": "98", "data-area-accent": "teal", "data-area-type": "12" }} bg="var(--area-bg-page)">
      <div role="radiogroup" aria-label="Layout">
        {card(255, 53, true, "Sidebar, preview and code", <>
          <i className="sc-layout__side" />
          <span className="sc-layout__pane" style={{ inlineSize: 123 / 1.75 }}>{url}<i className="sc-layout__block" style={{ blockSize: 47 / 1.75 }} /><i className="sc-layout__block sc-grow" /></span>
          <span className="sc-layout__pane sc-layout__text">{lines(26, 1)}</span>
        </>)}
        {card(728, 53, false, "Preview and code", <>
          <span className="sc-layout__pane" style={{ inlineSize: 158 / 1.75 }}>{url}<i className="sc-layout__block" style={{ blockSize: 47 / 1.75 }} /><span className="sc-layout__split"><i className="sc-layout__block" /><i className="sc-layout__block" /></span></span>
          <span className="sc-layout__pane sc-layout__text">{lines(26, 2)}</span>
          <i className="sc-layout__float" style={b(885 - 728 - 42 - 7, 281 - 53 - 42 - 7, 103, 29)} />
        </>)}
        {card(255, 420, false, "Preview", <>
          <span className="sc-layout__pane sc-grow">{url}<i className="sc-layout__block" style={{ blockSize: 47 / 1.75 }} /><span className="sc-layout__split sc-layout__split--wide"><i className="sc-layout__block" /><i className="sc-layout__block" /></span></span>
          <i className="sc-layout__float" style={b(412 - 255 - 42 - 7, 647 - 420 - 42 - 7, 103, 30)} />
        </>)}
        {card(728, 420, false, "Code", <>
          <span className="sc-layout__pane sc-layout__text sc-grow">{lines(26, 3)}</span>
          <i className="sc-layout__float" style={b(885 - 728 - 42 - 7, 647 - 420 - 42 - 7, 103, 30)} />
        </>)}
      </div>
    </Scene>
  );
};

/* 24 Product sidebar, close (1225×1400, zoom 2.375 → 516×589; Home's 76 plate = Area's 32 row). A near-white page; the
   app's grey bezel and white window from the corner; the sidebar 255 wide: the wordmark and the collapse action, the
   workspace select (outline, its mark), Home current, then Build, Evaluate and Integrations with their places, Tests
   carrying an Alpha badge. Type 14, Density 32 (the shot's 85 pitch sits between Area's 32 and 36 rows; 32 keeps the select and Home plate exact). */
export const S24 = () => {
  const b = box(2.375);
  return (
    <Scene view={[1225, 1400]} zoom={2.375} scope={{ "data-area-ground-light": "98", "data-area-type": "14", "data-area-density": "32" }} bg="var(--area-bg-page)">
      <div className="sc-bezel2" style={b(105, 105, 1300, 1400)} />
      <div className="sc-appwin" data-area-ground="raised" style={b(140, 140, 1200, 1400)}>
        <div className="sc-side24">
          <div className="sc-row sc-between sc-side24__head"><span className="sc-wordmark">IIElevenLabs</span><Button size="sm" variant="ghost" tone="neutral" iconOnly aria-label="Collapse sidebar" icon={<PanelLeftIcon />} /></div>
          <CustomSelect variant="outline" fullWidth aria-label="Workspace" defaultValue="agents" items={[{ value: "agents", label: "Agents Platform", icon: <span className="sc-orb" /> }]} />
          <Nav aria-label="Platform">
            <NavItem href="#home" current icon={<HomeIcon />}>Home</NavItem>
            <NavGroup label="Build">
              <NavItem href="#agents" icon={<PersonCircleIcon />}>Agents</NavItem>
              <NavItem href="#kb" icon={<ArchiveIcon />}>Knowledge Base</NavItem>
              <NavItem href="#tools" icon={<WrenchIcon />}>Tools</NavItem>
              <NavItem href="#voices" icon={<DotsFourIcon />}>Voices</NavItem>
            </NavGroup>
            <NavGroup label="Evaluate">
              <NavItem href="#conversations" icon={<HistoryIcon />}>Conversations</NavItem>
              <NavItem href="#tests" icon={<FlaskIcon />} trailing={<Badge size="lg">Alpha</Badge>}>Tests</NavItem>
            </NavGroup>
            <NavGroup label="Integrations">
              <NavItem href="#integrations" icon={<BlocksIcon />}>Integrations</NavItem>
            </NavGroup>
          </Nav>
        </div>
      </div>
    </Scene>
  );
};

/* 25 Spreadsheet app (1239×1400, zoom 1.63 → 760×859; the grid's 46 rows = Area's 28 small table row). A grey page;
   the window from the corner with its lights and three toolbar plates; the sidebar: the workspace, six places, a rule,
   Recent chats (Yearly revenue targets current, two with unread dots); the sheet: Reports and Weekly Report tabs, a
   back / folder row, the cell reference and fx bar, then the grid with its row numbers and A–C columns. Type 13,
   Density 32. */
const SHEET: Record<number, [string, string]> = {
  2: ["Global", "Jan-21"], 5: ["Retainer", "1"], 6: ["Brands", "1"], 7: ["BSM Payroll", "1"], 10: ["Sales Management", "1"],
  11: ["BP Payroll", "7979"], 12: ["Risk Payroll", "67876"], 13: ["Retainer Paywoll", "975987"], 14: ["Brand Marketing", "978598"],
  15: ["Design Efforts", "98"], 16: ["Trade Shows", "98765"], 17: ["First App Order", "64"], 18: ["Landing Page Design", "857"],
};
const CHATS = ["Quarterly sales projections", "Yearly revenue targets", "Product launch timelines", "Market expansion strategies", "Brand awareness metrics", "Quarterly sales projections", "Product development", "Operational efficiency", "Profit margin analyses", "Customer satisfaction ratings", "Supply chain optimization plans"];
export const S25 = () => {
  const b = box(1.63);
  return (
    <Scene view={[1239, 1400]} zoom={1.63} scope={{ "data-area-ground-light": "95", "data-area-type": "13", "data-area-density": "32" }} bg="var(--area-bg-page)">
      <div className="sc-sheetapp" data-area-ground="recessed" style={b(90, 90, 1300, 1400)}>
        <span className="sc-lights-sm" style={b(117 - 90, 123 - 90)}><i data-tone="danger" /><i data-tone="caution" /><i data-tone="success" /></span>
        <span className="sc-plate" style={b(250 - 90, 105 - 90, 90, 58)}><PanelLeftIcon /><ChevronDownIcon className="sc-plate__small" /></span>
        <span className="sc-plate" style={b(362 - 90, 105 - 90, 102, 58)}><ChevronLeftIcon /><i className="sc-plate__sep" /><ChevronRightIcon className="sc-quiet" /></span>
        <span className="sc-plate" style={b(1012 - 90, 105 - 90, 400, 58)}><MonitorCogIcon className="sc-quiet" /></span>
        <div className="sc-side25" style={b(108 - 90, 200 - 90, 370, 1300)}>
          <div className="sc-row sc-between sc-side25__head"><span className="sc-row"><span className="sc-orb sc-orb--dark" /><b>Dovetail</b></span><span className="sc-row"><Button size="sm" variant="ghost" tone="neutral" iconOnly aria-label="Collapse sidebar" icon={<PanelLeftIcon />} /><Button size="sm" variant="outline" tone="neutral" iconOnly aria-label="Ask" icon={<SparkleIcon />} /></span></div>
          <Nav aria-label="Dovetail">
            <NavItem href="#new" icon={<PenIcon />}>New Chat</NavItem>
            <NavItem href="#search" icon={<SearchIcon />}>Search</NavItem>
            <NavItem href="#reports" icon={<DocumentIcon />}>Reports</NavItem>
            <NavItem href="#dashboards" icon={<LayoutDashboardIcon />}>Dashboards</NavItem>
            <NavItem href="#data" icon={<DatabaseIcon />}>Data</NavItem>
            <NavItem href="#playbooks" icon={<LayersIcon />}>Playbooks</NavItem>
          </Nav>
          <hr className="sc-rule" />
          <span className="sc-recent">Recent chats <ChevronDownIcon /></span>
          <Nav aria-label="Recent chats">
            {CHATS.map((chat, index) => (
              <NavItem key={index} href={`#chat-${index}`} current={index === 1}
                trailing={index === 1 ? <MoreHorizontalIcon /> : index === 0 ? <i className="sc-unread sc-unread--read" /> : index === 5 ? <i className="sc-unread" /> : undefined}>{chat}</NavItem>
            ))}
          </Nav>
        </div>
        <div className="sc-sheetmain" data-area-ground="raised" style={b(495 - 90, 195 - 90, 900, 1400)}>
          <div className="sc-row sc-sheettabs"><span className="sc-tab sc-tab--on"><DocumentIcon />Reports</span><span className="sc-tab"><FolderIcon />Weekly Report</span></div>
          <div className="sc-row sc-sheettools"><Button size="sm" variant="ghost" tone="neutral" iconOnly aria-label="Back" icon={<ChevronLeftIcon />} /><Button size="sm" variant="ghost" tone="neutral" iconOnly aria-label="Folder" icon={<FolderIcon />} /></div>
          <div className="sc-row sc-fx"><span className="sc-fx__ref">A1<ChevronsUpDownIcon /></span><i className="sc-fx__f">fx</i></div>
          <Table size="sm" columnDividers aria-label="Report" className="sc-grid25">
            <colgroup><col style={{ inlineSize: 48 / 1.63 }} /><col style={{ inlineSize: 141 / 1.63 }} /><col style={{ inlineSize: 408 / 1.63 }} /><col /></colgroup>
            <thead><tr><th scope="col" aria-label="All" /><th scope="col">A</th><th scope="col">B</th><th scope="col">C</th></tr></thead>
            <tbody>{Array.from({ length: 21 }, (_, i) => i + 1).map(row => (
              <tr key={row}><th scope="row">{row}</th><td /><td>{SHEET[row]?.[0]}</td><td className="sc-num">{SHEET[row]?.[1]}</td></tr>
            ))}</tbody>
          </Table>
        </div>
      </div>
    </Scene>
  );
};

/* 26 Create menu (1400×922, zoom 2.06 → 680×448; Create's 66 = Area's 32 button). A mint wash (sampled from the shot); the app's frosted window from the left: search and the Create action (solid, a pill, its menu open), a rule,
   filter and more, a rule; the menu below Create: three commands (the first highlighted), a separator, Upload Bulk CSV
   with its icon. Type 14, Density 32. */
export const S26 = () => {
  const b = box(2.06);
  return (
    <Scene view={[1400, 922]} zoom={2.06} scope={{ "data-area-ground-light": "100", "data-area-type": "14", "data-area-density": "32" }} className="sc-mint">
      <div className="sc-frost" style={b(-60, 238, 915, 800)}>
        <hr className="sc-frost__rule" style={{ top: 100 / 2.06 }} /><hr className="sc-frost__rule" style={{ top: 187 / 2.06 }} />
      </div>
      <Button variant="ghost" tone="neutral" iconOnly aria-label="Search" icon={<SearchIcon />} className="sc-abs sc-mid" style={b(551, 288)} />
      <Button pill icon={<AddIcon />} trailingIcon={<ChevronUpIcon />} aria-expanded="true" aria-haspopup="menu" className="sc-abs sc-mid" style={b(712, 289)}>Create</Button>
      <Button variant="ghost" tone="neutral" iconOnly aria-label="Filter" icon={<ListFilterIcon />} className="sc-abs sc-mid" style={b(338, 383)} />
      <Button variant="ghost" tone="neutral" iconOnly aria-label="More" icon={<MoreHorizontalIcon />} className="sc-abs sc-mid" style={b(410, 383)} />
      <div className="area-menu sc-menu26" role="menu" aria-label="Create" style={b(470, 336, 461)}>
        <MenuItem data-highlighted="">Create Campaign</MenuItem>
        <MenuItem>Create Ad Group</MenuItem>
        <MenuItem>Create Ad</MenuItem>
        <MenuSeparator />
        <MenuItem icon={<UploadIcon />}>Upload Bulk CSV</MenuItem>
      </div>
    </Scene>
  );
};

/* 27 Copy and Build, close (1400×1400, zoom 2.575 → 544×544; the buttons' 103 = Area's 40). A blue wash (sampled from the shot); the panel's corner with its pale frame; Copy (soft) and Build (solid, the cube) at its top end, a rule,
   then a line of body text running out of the frame. Type 16. */
export const S27 = () => {
  const b = box(2.575);
  return (
    <Scene view={[1400, 1400]} zoom={2.575} scope={{ "data-area-ground-light": "100", "data-area-type": "16" }} className="sc-bluewash">
      <div className="sc-frame27" style={b(-80, 668, 1035, 900)}><div className="sc-frame27__inner" /></div>
      {/* Anchored by their end edges, as the shot sets them against the panel's end. */}
      <Button size="lg" variant="soft" tone="neutral" className="sc-abs" style={{ right: (1400 - 556) / 2.575, top: 737 / 2.575 }}>Copy</Button>
      <Button size="lg" icon={<CubeFilledIcon />} className="sc-abs" style={{ right: (1400 - 886) / 2.575, top: 737 / 2.575 }}>Build</Button>
      <hr className="sc-rule sc-abs" style={b(-80, 1068, 887)} />
      <p className="sc-line27" style={{ right: (1400 - 742) / 2.575 - 9, top: 1258 / 2.575 - 4 }}>A command pattern used for Linear, Notion,</p>
    </Scene>
  );
};
