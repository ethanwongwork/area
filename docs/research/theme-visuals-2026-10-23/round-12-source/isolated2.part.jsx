/* ================================ Isolated components ================================ */
/* One component or a small cluster, centred in a 4:3 frame about 1.5× its own size, so it reads smaller than a close-up.
   Wherever the app has an owner-reviewed demo of the subject (apps/desktop/src/content/demos), the view renders that
   demo itself, so its spacing and type are exactly the gallery's. */
import { GalleryPanelFigma, GalleryKbdInMenu, GalleryPopoverField, GalleryCommandPalette, GalleryCalendar, GalleryTabs, GallerySegmented } from "../../../../apps/desktop/src/content/demos/gallery.tsx";
import { CardMediaOverlay, CardTemplateMusic, CardTemplatePlan, GalleryCardCarousel } from "../../../../apps/desktop/src/content/demos/card.tsx";
import { BadgeVariants, BadgeGroupWrap } from "../../../../apps/desktop/src/content/demos/badge.tsx";
import { ChipVariants, FieldDefault, SelectField, CheckboxDefault } from "../../../../apps/desktop/src/content/demos/form.tsx";
import { GalleryToastNeutral } from "../../../../apps/desktop/src/content/demos/gallery-variants.tsx";
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
const IsoMusic = () => <Iso w={600} h={450}><div data-pop="action"><CardTemplateMusic /></div></Iso>;
const IsoPlan = () => <Iso w={480} h={360}><div data-pop="action"><CardTemplatePlan /></div></Iso>;
const IsoCarousel = () => <Iso w={800} h={600}><GalleryCardCarousel /></Iso>;
const IsoBadges = () => (
  <Iso w={480} h={360}>
    <Col gap={16} style={{ alignItems: "flex-start" }}><BadgeVariants /><ChipVariants /><Row gap={10}><AvatarGroup size="sm"><Avatar fallback="DT" aria-label="David Tee" /><Avatar fallback="T1" aria-label="Team one" /><Avatar fallback="T2" aria-label="Team two" /></AvatarGroup><Count count={12} /><Kbd keys={["cmd", "K"]} /></Row></Col>
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
        <div data-st="focus-wrap"><FieldDefault /></div>
        <SelectField />
        <div data-pop="selection"><CheckboxDefault /></div>
        <Row gap={8} className="sx-end"><Button variant="outline">Cancel</Button><span data-pop="action"><Button data-st="press">Action</Button></span></Row>
      </Col>
    </CardContent></Card>
  </Iso>
);
const IsoTabs = () => <Iso w={480} h={360}><Col gap={20} style={{ alignItems: "flex-start" }}><GalleryTabs /><GallerySegmented /><Pagination pageCount={5} defaultPage={2} /></Col></Iso>;
const IsoCommand = () => <Iso w={640} h={480}><GalleryCommandPalette /></Iso>;
const IsoToast = () => <Iso w={480} h={360}><Col gap={10} style={{ width: 340 }}><GalleryToastNeutral /><Toast title="Title" icon={<BellIcon />} action={<Button size="sm" variant="outline">Action</Button>}>Description of the update.</Toast></Col></Iso>;
const IsoCalendar = () => <Iso w={480} h={360}><div data-pop="selection"><GalleryCalendar /></div></Iso>;
export const ISOLATED = {
  menu: ["Menu", IsoMenu], popover: ["Popover", IsoPopover], sidebar: ["Sidebar corner", IsoSidebar], card: ["Card", IsoCard],
  music: ["Music card", IsoMusic], plan: ["Plan card", IsoPlan], carousel: ["Carousel", IsoCarousel], badges: ["Badges and chips", IsoBadges],
  inspector: ["Inspector", IsoInspector], toolbar: ["Toolbar", IsoToolbar], form: ["Form", IsoForm], tabs: ["Tabs and pages", IsoTabs],
  command: ["Command palette", IsoCommand], toast: ["Toasts", IsoToast], calendar: ["Calendar", IsoCalendar],
};

