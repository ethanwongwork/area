import { cloneElement, type CSSProperties, type ReactElement, type ReactNode } from "react";
import { Badge, Button, Nav, NavItem } from "@area/react";
import { PILOT_BATCHES, PILOT_ICONS } from "../pilot-icons.tsx";
import { EXPLORE } from "../pilot-explore.tsx";

/* The Iconography sheets compare base drawings; rotations appear on the per-icon review page. */
const BASE_ICONS = PILOT_ICONS.filter(icon => !icon.derivedFrom);
import { AlignLeftIcon, BellIcon, CheckIcon, ChevronIcon, DismissIcon, InfoIcon, MoreIcon, PlusIcon, PresenceAvailableIcon, SearchIcon, SettingsIcon, FluentEyeIcon, FluentAlignLeftFilledIcon, FluentBellFilledIcon, FluentCheckCircleFilledIcon, FluentEyeFilledIcon, FluentInfoFilledIcon, FluentSettingsFilledIcon, AlertIcon, ArrowUpIcon, ArrowIcon, LinkIcon, OpenIcon, PersonSmallIcon, FluentResetIcon, FluentChevronLeftIcon, FluentChevronRightIcon, FluentChevronUpIcon, FluentArrowLeftIcon, FluentArrowDownIcon, FluentAlignRightIcon, FluentAlignCenterIcon, AlignTopIcon, AlignMiddleIcon, AlignBottomIcon, FluentExpandIcon, FluentExpandFilledIcon, FluentPanelLeftIcon, FluentPanelLeftFilledIcon, FluentPanelRightIcon, FluentPanelRightFilledIcon, FluentBookIcon, FluentBookFilledIcon, FluentOptionsIcon, FluentOptionsFilledIcon, FluentColorIcon, FluentColorFilledIcon, FluentTextIcon, FluentTextFilledIcon, FluentShapesIcon, FluentShapesFilledIcon, FluentListIcon, FluentListFilledIcon, FluentSquareDashedIcon, FluentSquareDashedFilledIcon, FluentLayersIcon, FluentLayersFilledIcon, FluentFlashIcon, FluentFlashFilledIcon, DocumentIcon, FolderIcon, TrashIcon, FluentCopyIcon, FluentCopyFilledIcon, FluentDocumentFilledIcon, FluentFolderFilledIcon, FluentTrashFilledIcon, FluentWarningFilledIcon } from "../icons.tsx";

/* Icon pilot (docs/specs/icons.md): each icon beside a 14/20 regular label, the UI text it
   pairs with. One tile per stroke weight, plus the Fluent icons Area uses today. */

const LABELS: Record<string, string> = {
  "add": "Add", "align-left": "Align left", "bell": "Notifications", "check": "Check",
  "chevron-down": "Expand", "dismiss": "Close", "eye": "Show", "info": "Info",
  "more-horizontal": "More", "search": "Search", "settings": "Settings", "status-available": "Available",
  "arrow-up": "Send", "arrow-right": "Next", "arrow-down": "Down", "arrow-left": "Back", "chevron-left": "Previous", "chevron-right": "Open", "chevron-up": "Collapse", "link": "Link", "open": "Open in new tab", "person": "Profile", "reset": "Reset", "align-right": "Align right", "align-center": "Align center", "align-top": "Align top", "align-middle": "Align middle", "align-bottom": "Align bottom", "angle": "Angle", "aspect-ratio": "Ratio", "auto-layout": "Auto layout", "corner": "Radius", "corner-top-right": "Top right", "corner-bottom-left": "Bottom left", "corner-bottom-right": "Bottom right", "corners": "Corners", "dots-four": "Components", "eye-off": "Hide", "flip": "Flip", "flip-vertical": "Flip vertical", "flow": "Horizontal", "flow-vertical": "Vertical", "flow-wrap": "Wrap", "flow-free": "Freeform", "gap": "Gap", "gap-vertical": "Row gap", "opacity": "Opacity", "padding": "Padding", "padding-sides": "Side padding", "padding-ends": "End padding", "token": "Token", "sliders": "Adjust", "rotate": "Rotate", "expand": "Expand", "panel-left": "Sidebar", "panel-right": "Inspector", "book": "Docs", "options": "Options", "color": "Color", "text": "Text", "shapes": "Shapes", "list": "List", "square-dashed": "Placeholder", "layers": "Layers", "flash": "Motion", "copy": "Copy", "document": "Document", "folder": "Folder", "trash": "Delete", "warning": "Warning",
};

const grid: CSSProperties = {
  display: "grid", gridTemplateColumns: "repeat(2, max-content)", columnGap: "var(--area-space-32)",
  rowGap: "var(--area-space-12)", color: "var(--area-fg-default)",
  font: "var(--area-weight-regular) var(--area-text-sm-size)/var(--area-text-sm-leading) var(--area-font-sans)",
};
const row: CSSProperties = { display: "flex", alignItems: "center", gap: "var(--area-space-8)" };

const Row = ({ icon, label }: { icon: ReactNode; label: string }) => (
  <div style={row}>{icon}<span>{label}</span></div>
);

const PilotGrid = ({ weight }: { weight: number }) => (
  <div style={grid}>
    {BASE_ICONS.map(({ name, Icon }) => <Row key={name} icon={<Icon weight={weight} />} label={LABELS[name] ?? name} />)}
  </div>
);

export const GalleryIconPilotWeight100 = () => <PilotGrid weight={1} />;
export const GalleryIconPilotWeight1125 = () => <PilotGrid weight={1.125} />;
export const GalleryIconPilotWeight125 = () => <PilotGrid weight={1.25} />;

const FLUENT: [string, () => ReactElement][] = [
  ["add", PlusIcon], ["align-left", AlignLeftIcon], ["bell", BellIcon], ["check", CheckIcon],
  ["chevron-down", ChevronIcon], ["dismiss", DismissIcon], ["eye", FluentEyeIcon], ["info", InfoIcon],
  ["more-horizontal", MoreIcon], ["search", SearchIcon], ["settings", SettingsIcon], ["status-available", PresenceAvailableIcon],
  ["arrow-up", ArrowUpIcon], ["arrow-right", ArrowIcon], ["copy", FluentCopyIcon], ["link", LinkIcon], ["open", OpenIcon], ["person", PersonSmallIcon], ["reset", FluentResetIcon], ["chevron-left", FluentChevronLeftIcon], ["chevron-right", FluentChevronRightIcon], ["chevron-up", FluentChevronUpIcon], ["arrow-left", FluentArrowLeftIcon], ["arrow-down", FluentArrowDownIcon], ["align-right", FluentAlignRightIcon], ["align-center", AlignMiddleIcon], ["align-top", AlignTopIcon], ["align-middle", FluentAlignCenterIcon], ["align-bottom", AlignBottomIcon], ["expand", FluentExpandIcon], ["panel-left", FluentPanelLeftIcon], ["panel-right", FluentPanelRightIcon], ["book", FluentBookIcon], ["options", FluentOptionsIcon], ["color", FluentColorIcon], ["text", FluentTextIcon], ["shapes", FluentShapesIcon], ["list", FluentListIcon], ["square-dashed", FluentSquareDashedIcon], ["layers", FluentLayersIcon], ["flash", FluentFlashIcon], ["document", DocumentIcon], ["folder", FolderIcon], ["trash", TrashIcon], ["warning", AlertIcon],
];
export const GalleryIconPilotFluent = () => (
  <div style={grid}>
    {FLUENT.map(([name, Icon]) => <Row key={name} icon={<Icon />} label={LABELS[name] ?? name} />)}
  </div>
);

/* Side by side (docs/specs/icons.md, "Construction system"): each pilot icon beside its
   Fluent equivalent at 16px, then both at 4× on the 16px pixel grid with the icon's
   optical keyline (Cursor's four shapes, as ink boxes), then Area drawn over Fluent. */
const fluentFor = (name: string) => FLUENT.find(([key]) => key === name)?.[1];
const KEYLINE_SHAPES: Record<string, ReactNode> = {
  square: <rect x="1.5" y="1.5" width="13" height="13" />,
  circle: <circle cx="8" cy="8" r="7" />,
  horizontal: <rect x="1" y="2.5" width="14" height="11" />,
  vertical: <rect x="2.5" y="1" width="11" height="14" />,
};
const ENLARGED = 64;
const plate: CSSProperties = {
  position: "relative", inlineSize: "var(--area-space-64)", blockSize: "var(--area-space-64)",
  backgroundImage: "linear-gradient(var(--area-border-subtle) var(--area-border-width), transparent var(--area-border-width)), linear-gradient(to right, var(--area-border-subtle) var(--area-border-width), transparent var(--area-border-width))",
  backgroundSize: "var(--area-space-4) var(--area-space-4)", boxShadow: "0 0 0 var(--area-border-width) var(--area-border-decorative)",
};
const layer: CSSProperties = { position: "absolute", inset: 0 };
const Keyline = ({ shape }: { shape: string }) => (
  <svg viewBox="0 0 16 16" width={ENLARGED} height={ENLARGED} style={{ ...layer, color: "var(--area-fg-accent)" }} aria-hidden="true"
    fill="currentColor" fillOpacity={0.06} stroke="currentColor" strokeWidth={0.25}>
    {KEYLINE_SHAPES[shape]}
  </svg>
);
const big = (element: ReactElement, style?: CSSProperties) => cloneElement(element as ReactElement<Record<string, unknown>>, { width: ENLARGED, height: ENLARGED, style: { ...layer, ...style } });
const compareGrid: CSSProperties = {
  display: "grid", gridTemplateColumns: "repeat(6, max-content)", alignItems: "center",
  columnGap: "var(--area-space-16)", rowGap: "var(--area-space-12)", color: "var(--area-fg-default)",
  font: "var(--area-weight-regular) var(--area-text-xs-size)/var(--area-text-xs-leading) var(--area-font-sans)",
};
export const GalleryIconPilotCompare = () => (
  <div style={compareGrid}>
    <span>Icon</span><span>Fluent</span><span>Area</span><span>Fluent 4×</span><span>Area 4×</span><span>Area over Fluent</span>
    {BASE_ICONS.map(({ name, keyline, Icon }) => {
      const Fluent = fluentFor(name) ?? (() => <span />);
      return [
        <span key={name + "-label"}>{LABELS[name]}<br /><span style={{ color: "var(--area-fg-muted)" }}>{keyline}</span></span>,
        <Fluent key={name + "-f"} />,
        <Icon key={name + "-a"} weight={1.125} />,
        <div key={name + "-f4"} style={plate}><Keyline shape={keyline} />{big(Fluent())}</div>,
        <div key={name + "-a4"} style={plate}><Keyline shape={keyline} />{big(<Icon weight={1.125} />)}</div>,
        <div key={name + "-o4"} style={plate}>{big(Fluent(), { color: "var(--area-fg-accent)", opacity: 0.45 })}{big(<Icon weight={1.125} />)}</div>,
      ];
    })}
  </div>
);

/* Optical balance: the whole set in one line at 16px and at 2×, Area above Fluent, so an
   icon that reads larger, smaller, heavier or lighter than its neighbours stands out. */
const strip: CSSProperties = { display: "flex", flexWrap: "wrap", alignItems: "center", gap: "var(--area-space-12)", color: "var(--area-fg-default)" };
const balanceGrid: CSSProperties = {
  display: "grid", gridTemplateColumns: "max-content max-content", alignItems: "center",
  columnGap: "var(--area-space-16)", rowGap: "var(--area-space-16)", color: "var(--area-fg-default)",
  font: "var(--area-weight-regular) var(--area-text-xs-size)/var(--area-text-xs-leading) var(--area-font-sans)",
};
const at = (element: ReactElement, size: number) => cloneElement(element as ReactElement<Record<string, unknown>>, { width: size, height: size });
export const GalleryIconPilotBalance = () => (
  <div style={balanceGrid}>
    {[16, 32].flatMap(size => [
      <span key={"a" + size}>Area {size}</span>,
      <div key={"as" + size} style={{ ...strip, gap: `var(--area-space-${size / 2})` }}>{BASE_ICONS.map(({ name, Icon }) => <span key={name}>{at(<Icon weight={1.125} />, size)}</span>)}</div>,
      <span key={"f" + size}>Fluent {size}</span>,
      <div key={"fs" + size} style={{ ...strip, gap: `var(--area-space-${size / 2})` }}>{BASE_ICONS.map(({ name }) => { const Fluent = fluentFor(name); return <span key={name}>{Fluent ? at(Fluent(), size) : null}</span>; })}</div>,
    ])}
  </div>
);

/* Filled (docs/specs/icons.md, "Filled"): the variants derived from each shape's role
   (solid, knockout, hole), beside the outline and Fluent's filled cut. Line glyphs (add,
   check, close, chevron, more) have no filled variant. */
const FLUENT_FILLED: Record<string, () => ReactElement> = {
  "align-left": FluentAlignLeftFilledIcon, bell: FluentBellFilledIcon, eye: FluentEyeFilledIcon,
  info: FluentInfoFilledIcon, settings: FluentSettingsFilledIcon, "status-available": FluentCheckCircleFilledIcon,
  "expand": FluentExpandFilledIcon, "panel-left": FluentPanelLeftFilledIcon, "panel-right": FluentPanelRightFilledIcon, "book": FluentBookFilledIcon, "options": FluentOptionsFilledIcon, "color": FluentColorFilledIcon, "text": FluentTextFilledIcon, "shapes": FluentShapesFilledIcon, "list": FluentListFilledIcon, "square-dashed": FluentSquareDashedFilledIcon, "layers": FluentLayersFilledIcon, "flash": FluentFlashFilledIcon,
  copy: FluentCopyFilledIcon, document: FluentDocumentFilledIcon, folder: FluentFolderFilledIcon, trash: FluentTrashFilledIcon, warning: FluentWarningFilledIcon,
};
export const GalleryIconPilotFilled = () => (
  <div style={compareGrid}>
    <span>Icon</span><span>Outline</span><span>Filled</span><span>Fluent filled</span><span>Area filled 4×</span><span>Fluent filled 4×</span>
    {BASE_ICONS.filter(({ Filled }) => Filled).map(({ name, keyline, Icon, Filled }) => {
      const Area = Filled!, Fluent = FLUENT_FILLED[name] ?? (() => <svg viewBox="0 0 16 16" />);
      return [
        <span key={name + "-label"}>{LABELS[name]}</span>,
        <Icon key={name + "-o"} weight={1.125} />,
        <Area key={name + "-a"} weight={1.125} />,
        <Fluent key={name + "-f"} />,
        <div key={name + "-a4"} style={plate}><Keyline shape={keyline} />{big(<Area weight={1.125} />)}</div>,
        <div key={name + "-f4"} style={plate}><Keyline shape={keyline} />{big(Fluent())}</div>,
      ];
    })}
  </div>
);

/* Exploration (docs/specs/icons.md): candidates under review, one group per question, each
   at 16px beside text, at 32px and at 4× with its keyline, with the lint's measurements.
   A candidate the rules reject shows why. */
const exploreGroup: CSSProperties = {
  display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(calc(var(--area-space-64) * 2), max-content))",
  columnGap: "var(--area-space-24)", rowGap: "var(--area-space-16)", color: "var(--area-fg-default)",
  font: "var(--area-weight-regular) var(--area-text-xs-size)/var(--area-text-xs-leading) var(--area-font-sans)",
};
const exploreCell: CSSProperties = { display: "flex", flexDirection: "column", gap: "var(--area-space-8)" };
const muted: CSSProperties = { color: "var(--area-fg-muted)" };
const ExploreGroup = ({ group }: { group: string }) => (
  <div style={exploreGroup}>
    {EXPLORE.filter(candidate => candidate.group === group).map(({ label, Icon, gaps, counters, notes }) => (
      <div key={label} style={exploreCell}>
        <span>{label}</span>
        <div style={{ ...row, font: "var(--area-weight-regular) var(--area-text-sm-size)/var(--area-text-sm-leading) var(--area-font-sans)" }}><Icon weight={1.125} /><span>{group}</span></div>
        <div style={plate}>{big(<Icon weight={1.125} />)}</div>
        <span style={muted}>gaps {gaps.join(", ") || "none"}<br />counters {counters.join(", ")}</span>
        {notes.map(note => <span key={note} style={{ color: "var(--area-fg-caution)" }}>{note}</span>)}
      </div>
    ))}
  </div>
);
/* Renders nothing when there are no candidates; the build then omits the section. */
export const GalleryIconPilotExplore = () => (
  <div style={{ ...exploreCell, gap: "var(--area-space-32)", inlineSize: "100%", alignSelf: "start" }}>
    {[...new Set(EXPLORE.map(candidate => candidate.group))].map(group => (
      <div key={group} style={exploreCell}><span style={muted}>{group}</span><ExploreGroup group={group} /></div>
    ))}
  </div>
);

/* Sizes (docs/specs/icons.md, "Sizes"): the 16px drawings at every slot size on the size
   curve (the line grows with size^0.45, Cursor's 1.25 → 1.5px from 16 to 24px), each strip
   beside the text size the slot pairs with, and the old uniform scaling for comparison. */
const SIZE_TEXT: Record<number, string> = { 12: "xs", 16: "sm", 20: "md", 24: "md" };
const px = (value: number) => Math.round(value * 100) / 100;
const curveLine = (size: number) => 1.125 * Math.pow(size / 16, 0.45);
const SizeStrip = ({ size, uniform = false }: { size: number; uniform?: boolean }) => {
  const line = uniform ? 1.125 * size / 16 : curveLine(size), scale = size / 16;
  const text = SIZE_TEXT[size];
  return (
    <div style={exploreCell}>
      <span style={muted}>{size}px{uniform ? ", uniform scaling (previous)" : ""}: line {px(line)}, standard gap {px(3 * scale - line)}, tight gap {px(2.5 * scale - line)}</span>
      <div style={{ ...strip, gap: "var(--area-space-12)", font: `var(--area-weight-regular) var(--area-text-${text}-size)/var(--area-text-${text}-leading) var(--area-font-sans)` }}>
        {BASE_ICONS.map(({ name, Icon }) => <span key={name}>{uniform ? at(<Icon weight={1.125} />, size) : <Icon size={size} />}</span>)}
        <span>Settings</span>
      </div>
    </div>
  );
};
export const GalleryIconPilotSizes = () => (
  <div style={{ ...exploreCell, gap: "var(--area-space-24)", font: "var(--area-weight-regular) var(--area-text-xs-size)/var(--area-text-xs-leading) var(--area-font-sans)" }}>
    {[12, 16, 20, 24].map(size => <SizeStrip key={size} size={size} />)}
    <SizeStrip size={24} uniform />
  </div>
);
const SizeRaster = ({ size, scale }: { size: number; scale: number }) => (
  <div style={exploreCell}>
    <span style={muted}>{size}px on the curve, {scale}×</span>
    <div style={{ ...strip, gap: "var(--area-space-8)" }}>
      {BASE_ICONS.map(({ name, Icon }) => (
        <Pixels key={name}><Icon weight={1.125} size={size} data-scale={String(scale)} data-size={String(size)} /></Pixels>
      ))}
    </div>
  </div>
);
export const GalleryIconPilotSizesRaster = () => (
  <div style={{ ...exploreCell, gap: "var(--area-space-16)" }}>
    <SizeRaster size={12} scale={1} />
    <SizeRaster size={12} scale={2} />
    <SizeRaster size={20} scale={1} />
  </div>
);

/* Pixel check: the browser rasterises each icon into 16px (1×) and 32px (2×) canvases,
   shown enlarged with hard pixel edges (public/pixel-preview.js). Chosen weight 1.125px.
   Snapping to 1px on 1× screens was measured and gains nothing (docs/specs/icons.md). */
const pixelGrid: CSSProperties = {
  display: "grid", gridTemplateColumns: "repeat(5, max-content)", alignItems: "center",
  columnGap: "var(--area-space-16)", rowGap: "var(--area-space-8)", color: "var(--area-fg-default)",
  font: "var(--area-weight-regular) var(--area-text-xs-size)/var(--area-text-xs-leading) var(--area-font-sans)",
};
const Pixels = ({ children }: { children: ReactNode }) => (
  <span data-pixel-preview="">{children}</span>
);
export const GalleryIconPilotPixels = () => (
  <div style={pixelGrid}>
    <span>Icon</span><span>Area 1×</span><span>Area 2×</span><span>Fluent 1×</span><span>Fluent 2×</span>
    {BASE_ICONS.map(({ name, Icon }) => {
      const Fluent = fluentFor(name);
      return [
        <span key={name + "-label"}>{LABELS[name] ?? name}</span>,
        <Pixels key={name + "-1x"}><Icon weight={1.125} data-scale="1" /></Pixels>,
        <Pixels key={name + "-2x"}><Icon weight={1.125} data-scale="2" /></Pixels>,
        <Pixels key={name + "-f1x"}>{Fluent ? <span data-scale="1"><Fluent /></span> : null}</Pixels>,
        <Pixels key={name + "-f2x"}>{Fluent ? <span data-scale="2"><Fluent /></span> : null}</Pixels>,
      ];
    })}
  </div>
);

/* Icon review (gallery-icons.html): one tile per pilot icon. The icon alone at every slot
   size, beside Fluent at 4× on the pixel grid, then inside real components, first with the
   Area icon and then with Fluent's, so each drawing is judged where it will live. Cursor's
   icons are proprietary and are not stored in the repository; compare against the product. */
const reviewTile: CSSProperties = {
  display: "grid", gap: "var(--area-space-12)", alignContent: "start", inlineSize: "100%", color: "var(--area-fg-default)",
  font: "var(--area-weight-regular) var(--area-text-xs-size)/var(--area-text-xs-leading) var(--area-font-sans)",
};
const reviewRow: CSSProperties = { display: "flex", flexWrap: "wrap", alignItems: "flex-end", gap: "var(--area-space-12)" };
const sizeCell: CSSProperties = { display: "grid", justifyItems: "center", gap: "var(--area-space-4)" };
const SIZES = [12, 16, 20, 24, 32];
/* 3× plates: small enough for two review columns, still one screen pixel per grid unit ×3. */
const PLATE = 48;
const plateSm: CSSProperties = { ...plate, inlineSize: "var(--area-space-48)", blockSize: "var(--area-space-48)", backgroundSize: "calc(var(--area-space-48) / 16) calc(var(--area-space-48) / 16)" };
const mid = (element: ReactElement, style?: CSSProperties) => cloneElement(element as ReactElement<Record<string, unknown>>, { width: PLATE, height: PLATE, style: { ...layer, ...style } });
const KeylineSm = ({ shape }: { shape: string }) => (
  <svg viewBox="0 0 16 16" width={PLATE} height={PLATE} style={{ ...layer, color: "var(--area-fg-accent)" }} aria-hidden="true"
    fill="currentColor" fillOpacity={0.06} stroke="currentColor" strokeWidth={0.3}>
    {KEYLINE_SHAPES[shape]}
  </svg>
);
/* Contexts that fit a one-cell tile at any column count: a button, an icon button and a
   badge on one line, then the current Nav item (filled icon). The Nav item stands in for
   the menu row, which uses the same 16px slot. */
const Context = ({ icon, filled, label }: { icon: () => ReactElement; filled: () => ReactElement; label: string }) => (
  <div style={{ display: "grid", gap: "var(--area-space-8)", justifyItems: "start" }}>
    <div style={{ ...reviewRow, alignItems: "center", gap: "var(--area-space-8)" }}>
      <Button variant="outline" size="sm" icon={icon()}>{label}</Button>
      <Button variant="ghost" size="sm" iconOnly icon={icon()} aria-label={label} />
      <Badge icon={icon()}>{label}</Badge>
    </div>
    <Nav aria-label={label} style={{ inlineSize: "calc(var(--area-space-64) * 2)" }}>
      <NavItem href="#" current icon={filled()}>{label}</NavItem>
    </Nav>
  </div>
);
const IconReview = ({ name }: { name: string }) => {
  const entry = PILOT_ICONS.find(icon => icon.name === name)!;
  const { Icon, Filled, keyline, fill } = entry;
  const Fluent = fluentFor(name);
  const FluentFilled = FLUENT_FILLED[name];
  const label = LABELS[name] ?? name;
  return (
    <div style={{ ...reviewTile, gap: "var(--area-space-8)" }}>
      <span style={muted}>{keyline} · filled by {fill === "solid" ? "solid shapes and cut-outs" : "a 1.5px line"}{entry.derivedFrom ? ` · from ${entry.derivedFrom}` : ""}</span>
      <div style={reviewRow}>
        {SIZES.map(size => <div key={size} style={sizeCell}><Icon size={size} /><span style={muted}>{size}</span></div>)}
        <div style={sizeCell}><Filled size={16} /><span style={muted}>filled</span></div>
      </div>
      <div style={{ ...reviewRow, gap: "var(--area-space-8)" }}>
        <div style={sizeCell}><div style={plateSm}><KeylineSm shape={keyline} />{mid(<Icon weight={1.125} />)}</div><span style={muted}>Area</span></div>
        {Fluent ? <div style={sizeCell}><div style={plateSm}><KeylineSm shape={keyline} />{mid(Fluent())}</div><span style={muted}>Fluent</span></div> : null}
        {Fluent ? <div style={sizeCell}><div style={plateSm}>{mid(Fluent(), { color: "var(--area-fg-accent)", opacity: 0.45 })}{mid(<Icon weight={1.125} />)}</div><span style={muted}>over</span></div> : null}
        <div style={sizeCell}><div style={plateSm}><KeylineSm shape={keyline} />{mid(<Filled weight={1.125} />)}</div><span style={muted}>filled</span></div>
      </div>
      <Context icon={() => <Icon />} filled={() => <Filled />} label={label} />
      {Fluent ? <span style={muted}>Fluent</span> : null}
      {Fluent ? <Context icon={Fluent} filled={FluentFilled ?? Fluent} label={label} /> : null}
    </div>
  );
};
const pascal = (name: string) => name.replace(/(^|-)([a-z0-9])/g, (_, __, c: string) => c.toUpperCase());
/** One review demo per pilot icon, named GalleryIconReview<Name>; the build lays them out. */
export const ICON_REVIEW_DEMOS: Record<string, () => ReactElement> = Object.fromEntries(
  PILOT_ICONS.map(({ name }) => [`GalleryIconReview${pascal(name)}`, () => <IconReview name={name} />]),
);

/* Whole set at the top of each batch: one labelled row per batch up to this one, the new
   batch last, every icon at 16px in a fixed cell so columns line up from row to row.
   Rotations and mirrors follow their base icon. */
const withDerived = (names: readonly string[]) => names.flatMap(name => [
  ...PILOT_ICONS.filter(icon => icon.name === name),
  ...PILOT_ICONS.filter(icon => icon.derivedFrom === name),
]);
const setGrid: CSSProperties = {
  display: "grid", gridTemplateColumns: "calc(var(--area-space-64) * 2) 1fr", alignItems: "start",
  columnGap: "var(--area-space-16)", rowGap: "var(--area-space-12)", inlineSize: "100%", color: "var(--area-fg-default)",
  font: "var(--area-weight-regular) var(--area-text-xs-size)/var(--area-text-xs-leading) var(--area-font-sans)",
};
const setCells: CSSProperties = {
  display: "grid", gridTemplateColumns: "repeat(auto-fill, var(--area-space-24))", gridAutoRows: "var(--area-space-24)",
  placeItems: "center", gap: "var(--area-space-4)",
};
const BatchSet = ({ index }: { index: number }) => (
  <div style={setGrid}>
    {PILOT_BATCHES.slice(0, index + 1).flatMap(batch => {
      const icons = withDerived(Object.keys(batch.icons));
      return [
        <span key={batch.id + "-label"} style={{ ...muted, paddingBlockStart: "var(--area-space-4)" }}>{batch.title}<br />{icons.length} icons</span>,
        <div key={batch.id} style={setCells}>{icons.map(({ name, Icon }) => <span key={name} title={name}><Icon size={16} /></span>)}</div>,
      ];
    })}
  </div>
);
/** One whole-set strip per batch, named GalleryIconBatchSet<index>; the build places each at the top of its batch. */
export const ICON_BATCH_DEMOS: Record<string, () => ReactElement> = Object.fromEntries(
  PILOT_BATCHES.map((_, index) => [`GalleryIconBatchSet${index + 1}`, () => <BatchSet index={index} />]),
);
