import type { CSSProperties, ReactNode } from "react";
import { PILOT_ICONS } from "../pilot-icons.tsx";
import { AlignLeftIcon, BellIcon, CheckIcon, ChevronIcon, DismissIcon, InfoIcon, MoreIcon, PlusIcon, PresenceAvailableIcon, SearchIcon, SettingsIcon, FluentEyeIcon } from "../icons.tsx";

/* Icon pilot (docs/specs/icons.md): each icon beside a 14/20 regular label, the UI text it
   pairs with. One tile per stroke weight, plus the Fluent icons Area uses today. */

const LABELS: Record<string, string> = {
  "add": "Add", "align-left": "Align left", "bell": "Notifications", "check": "Check",
  "chevron-down": "Expand", "dismiss": "Close", "eye": "Show", "info": "Info",
  "more-horizontal": "More", "search": "Search", "settings": "Settings", "status-available": "Available",
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

const FLUENT: [string, () => ReactNode][] = [
  ["add", PlusIcon], ["align-left", AlignLeftIcon], ["bell", BellIcon], ["check", CheckIcon],
  ["chevron-down", ChevronIcon], ["dismiss", DismissIcon], ["eye", FluentEyeIcon], ["info", InfoIcon],
  ["more-horizontal", MoreIcon], ["search", SearchIcon], ["settings", SettingsIcon], ["status-available", PresenceAvailableIcon],
];
export const GalleryIconPilotFluent = () => (
  <div style={grid}>
    {FLUENT.map(([name, Icon]) => <Row key={name} icon={<Icon />} label={LABELS[name] ?? name} />)}
  </div>
);

/* Pixel check: the browser rasterises each icon into 16px (1×) and 32px (2×) canvases,
   shown enlarged with hard pixel edges (public/pixel-preview.js). Chosen weight 1.125px. */
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
      const Fluent = FLUENT.find(([key]) => key === name)?.[1];
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
