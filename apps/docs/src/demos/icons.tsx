import { cloneElement, type CSSProperties, type ReactElement, type ReactNode } from "react";
import { PILOT_ICONS } from "../pilot-icons.tsx";
import { EXPLORE } from "../pilot-explore.tsx";
import { AlignLeftIcon, BellIcon, CheckIcon, ChevronIcon, DismissIcon, InfoIcon, MoreIcon, PlusIcon, PresenceAvailableIcon, SearchIcon, SettingsIcon, FluentEyeIcon, FluentAlignLeftFilledIcon, FluentBellFilledIcon, FluentCheckCircleFilledIcon, FluentEyeFilledIcon, FluentInfoFilledIcon, FluentSettingsFilledIcon, AlertIcon, ArrowUpIcon, DocumentIcon, FolderIcon, TrashIcon, FluentCopyIcon, FluentCopyFilledIcon, FluentDocumentFilledIcon, FluentFolderFilledIcon, FluentTrashFilledIcon, FluentWarningFilledIcon } from "../icons.tsx";

/* Icon pilot (docs/specs/icons.md): each icon beside a 14/20 regular label, the UI text it
   pairs with. One tile per stroke weight, plus the Fluent icons Area uses today. */

const LABELS: Record<string, string> = {
  "add": "Add", "align-left": "Align left", "bell": "Notifications", "check": "Check",
  "chevron-down": "Expand", "dismiss": "Close", "eye": "Show", "info": "Info",
  "more-horizontal": "More", "search": "Search", "settings": "Settings", "status-available": "Available",
  "arrow-up": "Send", "copy": "Copy", "document": "Document", "folder": "Folder", "trash": "Delete", "warning": "Warning",
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
    {PILOT_ICONS.map(({ name, Icon }) => <Row key={name} icon={<Icon weight={weight} />} label={LABELS[name] ?? name} />)}
  </div>
);

export const GalleryIconPilotWeight100 = () => <PilotGrid weight={1} />;
export const GalleryIconPilotWeight1125 = () => <PilotGrid weight={1.125} />;
export const GalleryIconPilotWeight125 = () => <PilotGrid weight={1.25} />;

const FLUENT: [string, () => ReactElement][] = [
  ["add", PlusIcon], ["align-left", AlignLeftIcon], ["bell", BellIcon], ["check", CheckIcon],
  ["chevron-down", ChevronIcon], ["dismiss", DismissIcon], ["eye", FluentEyeIcon], ["info", InfoIcon],
  ["more-horizontal", MoreIcon], ["search", SearchIcon], ["settings", SettingsIcon], ["status-available", PresenceAvailableIcon],
  ["arrow-up", ArrowUpIcon], ["copy", FluentCopyIcon], ["document", DocumentIcon], ["folder", FolderIcon], ["trash", TrashIcon], ["warning", AlertIcon],
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
    {PILOT_ICONS.map(({ name, keyline, Icon }) => {
      const Fluent = fluentFor(name)!;
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
      <div key={"as" + size} style={{ ...strip, gap: `var(--area-space-${size / 2})` }}>{PILOT_ICONS.map(({ name, Icon }) => <span key={name}>{at(<Icon weight={1.125} />, size)}</span>)}</div>,
      <span key={"f" + size}>Fluent {size}</span>,
      <div key={"fs" + size} style={{ ...strip, gap: `var(--area-space-${size / 2})` }}>{PILOT_ICONS.map(({ name }) => { const Fluent = fluentFor(name)!; return <span key={name}>{at(Fluent(), size)}</span>; })}</div>,
    ])}
  </div>
);

/* Filled (docs/specs/icons.md, "Filled"): the variants derived from each shape's role
   (solid, knockout, hole), beside the outline and Fluent's filled cut. Line glyphs (add,
   check, close, chevron, more) have no filled variant. */
const FLUENT_FILLED: Record<string, () => ReactElement> = {
  "align-left": FluentAlignLeftFilledIcon, bell: FluentBellFilledIcon, eye: FluentEyeFilledIcon,
  info: FluentInfoFilledIcon, settings: FluentSettingsFilledIcon, "status-available": FluentCheckCircleFilledIcon,
  copy: FluentCopyFilledIcon, document: FluentDocumentFilledIcon, folder: FluentFolderFilledIcon, trash: FluentTrashFilledIcon, warning: FluentWarningFilledIcon,
};
export const GalleryIconPilotFilled = () => (
  <div style={compareGrid}>
    <span>Icon</span><span>Outline</span><span>Filled</span><span>Fluent filled</span><span>Area filled 4×</span><span>Fluent filled 4×</span>
    {PILOT_ICONS.filter(({ Filled }) => Filled).map(({ name, keyline, Icon, Filled }) => {
      const Area = Filled!, Fluent = FLUENT_FILLED[name]!;
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
  <div style={{ ...exploreCell, gap: "var(--area-space-32)" }}>
    {[...new Set(EXPLORE.map(candidate => candidate.group))].map(group => (
      <div key={group} style={exploreCell}><span style={muted}>{group}</span><ExploreGroup group={group} /></div>
    ))}
  </div>
);

/* Sizes (docs/specs/icons.md, "Sizes"): the 16px drawings in 12px and 20px slots, two ways.
   Scaled: the whole drawing scales, line and gaps together (Cursor: one 16px set used from
   12 to 20px). Constant: the line stays 1.125 screen px while the geometry scales, so gaps
   shrink at 12px and open at 20px. Each strip sits beside the text size that slot pairs with. */
const SIZE_TEXT: Record<number, string> = { 12: "xs", 16: "sm", 20: "md" };
const px = (value: number) => Math.round(value * 100) / 100;
const SizeStrip = ({ size, constant }: { size: number; constant: boolean }) => {
  const scale = size / 16, weight = constant ? 1.125 / scale : 1.125, line = weight * scale;
  const text = SIZE_TEXT[size];
  return (
    <div style={exploreCell}>
      <span style={muted}>{size}px, {constant ? "constant line" : "scaled"}: line {px(line)}, standard gap {px(3 * scale - line)}, tight gap {px(2.5 * scale - line)}</span>
      <div style={{ ...strip, gap: "var(--area-space-12)", font: `var(--area-weight-regular) var(--area-text-${text}-size)/var(--area-text-${text}-leading) var(--area-font-sans)` }}>
        {PILOT_ICONS.map(({ name, Icon }) => <span key={name}>{at(<Icon weight={weight} />, size)}</span>)}
        <span>Settings</span>
      </div>
    </div>
  );
};
export const GalleryIconPilotSizes = () => (
  <div style={{ ...exploreCell, gap: "var(--area-space-24)" }}>
    <SizeStrip size={12} constant={false} />
    <SizeStrip size={12} constant />
    <SizeStrip size={16} constant={false} />
    <SizeStrip size={20} constant={false} />
    <SizeStrip size={20} constant />
  </div>
);
const SizeRaster = ({ size, constant, scale }: { size: number; constant: boolean; scale: number }) => (
  <div style={exploreCell}>
    <span style={muted}>{size}px {constant ? "constant" : "scaled"}, {scale}×</span>
    <div style={{ ...strip, gap: "var(--area-space-8)" }}>
      {PILOT_ICONS.map(({ name, Icon }) => (
        <Pixels key={name}><Icon weight={constant ? 1.125 * 16 / size : 1.125} data-scale={String(scale)} data-size={String(size)} /></Pixels>
      ))}
    </div>
  </div>
);
export const GalleryIconPilotSizesRaster = () => (
  <div style={{ ...exploreCell, gap: "var(--area-space-16)" }}>
    <SizeRaster size={12} constant={false} scale={1} />
    <SizeRaster size={12} constant scale={1} />
    <SizeRaster size={12} constant={false} scale={2} />
    <SizeRaster size={12} constant scale={2} />
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
    {PILOT_ICONS.map(({ name, Icon }) => {
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
