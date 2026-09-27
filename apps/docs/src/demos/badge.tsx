import { useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { Avatar, Badge, Presence, Indicator, IndicatorAnchor, BadgeGroup, Button, Card, CardContent, CardDescription, CardTitle, Nav, NavItem, Table, Theme } from "@area/react";
import { ArrowIcon, BellIcon, CheckIcon, DismissIcon, InfoIcon, LinkIcon, PlusIcon } from "../icons.tsx";

export const BadgeDefault = () => <Badge>Badge</Badge>;
export const BadgeVariants = () => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "start", gap: "var(--area-space-24)" }}>
    <Badge variant="soft">Soft</Badge>
    <Badge variant="solid">Solid</Badge>
    <Badge variant="color">Color</Badge>
    <Badge variant="modern">Modern</Badge>
    <Badge variant="outline">Outline</Badge>
    <Badge as="a" href="#api" variant="soft">Plain</Badge>
  </div>
);
export const BadgeSizes = () => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "start", gap: "var(--area-space-24)" }}>
    {(["sm", "md", "lg"] as const).map(size => <Badge key={size} size={size}>{size}</Badge>)}
  </div>
);
export const BadgeToneMatrix = () => (
  <div aria-label="Badge variant by tone matrix" style={{ display: "flex", flexDirection: "column", gap: "var(--area-space-24)", maxWidth: "100%" }}>
    {(["soft", "solid", "outline", "color", "modern"] as const).map(variant => (
      <section key={variant} aria-label={variant}>
        <p>{variant}</p>
        <BadgeGroup>
          {(["neutral", "accent", "info", "success", "warning", "caution", "danger", "discovery", "inverted"] as const).map(tone => false
            ? <Badge key={tone} as="a" href="#api" variant={variant} tone={tone}>{tone}</Badge>
            : <Badge key={tone} variant={variant} tone={tone}>{tone}</Badge>)}
        </BadgeGroup>
      </section>
    ))}
  </div>
);
export const BadgeTones = () => (
  <BadgeGroup>{(["neutral", "accent", "info", "success", "warning", "caution", "danger", "discovery", "inverted"] as const).map(tone => <Badge key={tone} tone={tone}>{tone}</Badge>)}</BadgeGroup>
);
export const BadgeLeadingIcon = () => <Badge icon={<CheckIcon />}>Badge</Badge>;
export const BadgeTrailingIcon = () => <Badge trailingIcon={<InfoIcon />}>Badge</Badge>;
export const BadgeIconOnly = () => <Badge iconOnly icon={<CheckIcon />} aria-label="Badge" />;
export const BadgeDotSoft = () => <Badge dot tone="success">Badge</Badge>;
export const BadgeDotOutline = () => <Badge dot variant="outline" tone="warning">Badge</Badge>;
export const BadgeDotOnly = () => <Badge dotOnly tone="success" aria-label="Available" />;
export const BadgeDotMatrix = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "var(--area-space-24)" }}>
    {(["soft", "outline"] as const).map(variant => <BadgeGroup key={variant}>{(["neutral", "accent", "info", "success", "warning", "caution", "danger", "discovery", "inverted"] as const).map(tone => <Badge key={tone} dot variant={variant} tone={tone}>{tone}</Badge>)}</BadgeGroup>)}
  </div>
);
export const BadgeStateLabels = () => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "start", gap: "var(--area-space-24)" }}>
    <Badge pill variant="solid" tone="success" icon={<PlusIcon />}>Open</Badge>
    <Badge pill variant="solid" tone="discovery" icon={<CheckIcon />}>Done</Badge>
    <Badge pill variant="solid" tone="danger" icon={<DismissIcon />}>Closed</Badge>
    <Badge pill variant="solid" icon={<InfoIcon />}>Draft</Badge>
    <Badge pill variant="solid" tone="info" icon={<InfoIcon />}>Queued</Badge>
  </div>
);
export const BadgeTruncation = () => <Badge truncate title="Badge text that overflows the available space">Badge text that overflows the available space</Badge>;
export const BadgeLink = () => <Badge as="a" href="#api" trailingIcon={<LinkIcon />}>Link</Badge>;
export const BadgeAnchorButton = () => (
  <IndicatorAnchor indicator={<Indicator count={3} />}>
    <Button aria-label="Label, 3">Button</Button>
  </IndicatorAnchor>
);
export const BadgeAnchorIconButton = () => (
  <IndicatorAnchor indicator={<Indicator />}>
    <Button variant="ghost" tone="neutral" iconOnly icon={<BellIcon />} aria-label="Notifications, new activity" />
  </IndicatorAnchor>
);
export const BadgeAnchorAvatar = () => (
  <IndicatorAnchor placement="bottom-end" overlap="circular" indicator={<Indicator status="available" size="sm" />}>
    <Avatar fallback="A" role="img" aria-label="Avatar, available" />
  </IndicatorAnchor>
);
export const BadgeAnchorTab = () => (
  <div className="area-tabs"><div className="area-tabs__list" role="tablist" aria-label="Label">
    <IndicatorAnchor indicator={<Indicator count={2} />}><button type="button" className="area-tabs__tab" role="tab" aria-selected="true" aria-label="Label, 2">Item one</button></IndicatorAnchor>
  </div></div>
);
export const BadgeAnchorPlacements = () => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "start", gap: "var(--area-space-32)" }}>
    {(["top-end", "top-start", "bottom-end", "bottom-start"] as const).map(placement => <IndicatorAnchor key={placement} placement={placement} indicator={<Indicator count={3} />}><Button aria-label="Label, 3">Button</Button></IndicatorAnchor>)}
  </div>
);
export const BadgeAnchorVisibility = () => {
  const [invisible, setInvisible] = useState(false);
  return <IndicatorAnchor invisible={invisible} indicator={<Indicator count={3} />}><Button onClick={() => setInvisible(value => !value)} aria-label={invisible ? "Label" : "Label, 3"}>Button</Button></IndicatorAnchor>;
};
export const BadgeGroupWrap = () => (
  <BadgeGroup><Badge>Neutral</Badge><Badge tone="info">Info</Badge><Badge tone="discovery">Discovery</Badge><Badge tone="success">Success</Badge></BadgeGroup>
);
export const BadgeGroupInline = () => (
  <BadgeGroup visibleCount={2} overflow="inline"><Badge>Neutral</Badge><Badge tone="info">Info</Badge><Badge tone="discovery">Discovery</Badge><Badge tone="success">Success</Badge><Badge tone="warning">Warning</Badge></BadgeGroup>
);
export const BadgeGroupOverlay = () => (
  <BadgeGroup visibleCount={2} overflow="overlay"><Badge>Neutral</Badge><Badge tone="info">Info</Badge><Badge tone="discovery">Discovery</Badge><Badge tone="success">Success</Badge><Badge tone="warning">Warning</Badge></BadgeGroup>
);
export const BadgeGroupAuto = () => (
  <div style={{ width: "calc(var(--area-space-80) * 3)", maxWidth: "100%", resize: "horizontal", overflow: "auto", padding: "var(--area-space-8)" }}>
    <BadgeGroup visibleCount="auto" overflow="overlay"><Badge>Neutral</Badge><Badge tone="info">Info</Badge><Badge tone="discovery">Discovery</Badge><Badge tone="success">Success</Badge><Badge tone="warning">Warning</Badge></BadgeGroup>
  </div>
);
export const BadgeTableStatus = () => (
  <Table><thead><tr><th>Name</th><th>Status</th></tr></thead><tbody><tr><td>Item one</td><td><Badge dot tone="success">Status</Badge></td></tr><tr><td>Item two</td><td><Badge dot tone="warning">Status</Badge></td></tr></tbody></Table>
);
export const BadgeBothThemes = () => (
  <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--area-space-24)" }}>
    {(["light", "dark"] as const).map(theme => <Theme key={theme} value={{ theme }}><div style={{ background: "var(--area-bg-surface)", padding: "var(--area-space-16)" }}><Badge tone="success" dot>Badge</Badge></div></Theme>)}
  </div>
);
export const BadgeStress = () => (
  <div dir="rtl" style={{ width: "calc(var(--area-space-80) * 3)", maxWidth: "100%", display: "flex", flexDirection: "column", alignItems: "start", gap: "var(--area-space-24)" }}>
    <Badge truncate icon={<InfoIcon />}>Produktionsbereitstellungsbestätigung ausstehend</Badge>
    <Badge as="a" href="#api" trailingIcon={<ArrowIcon />}>تفاصيل الإصدار</Badge>
    <div style={{ zoom: 2, maxWidth: "100%" }}><Badge truncate>Awaiting deployment approval</Badge></div>
  </div>
);
export const BadgeAuditControls = () => {
  const [theme, setTheme] = useState("light");
  const [density, setDensity] = useState("default");
  const [radius, setRadius] = useState("standard");
  const [type, setType] = useState("geist");
  const [motion, setMotion] = useState("subtle");
  const [contrast, setContrast] = useState("standard");
  const [direction, setDirection] = useState<"ltr" | "rtl">("ltr");
  return <div style={{ display: "grid", gap: "var(--area-space-24)", maxWidth: "100%" }}>
    <label>Audit theme <select className="area-select area-select--sm" value={theme} onChange={event => setTheme(event.target.value)}><option>light</option><option>dark</option></select></label>
    <label>Audit density <select className="area-select area-select--sm" value={density} onChange={event => setDensity(event.target.value)}><option>default</option><option>compact</option></select></label>
    <label>Audit radius <select className="area-select area-select--sm" value={radius} onChange={event => setRadius(event.target.value)}>{["sharp", "subtle", "soft", "standard", "round", "rotund", "pill"].map(value => <option key={value}>{value}</option>)}</select></label>
    <label>Audit font <select className="area-select area-select--sm" value={type} onChange={event => setType(event.target.value)}><option>geist</option><option>system</option></select></label>
    <label>Audit motion <select className="area-select area-select--sm" value={motion} onChange={event => setMotion(event.target.value)}><option>none</option><option>subtle</option></select></label>
    <label>Audit contrast <select className="area-select area-select--sm" value={contrast} onChange={event => setContrast(event.target.value)}><option>standard</option><option>more</option></select></label>
    <label>Audit direction <select className="area-select area-select--sm" value={direction} onChange={event => setDirection(event.target.value as "ltr" | "rtl")}><option>ltr</option><option>rtl</option></select></label>
    <div data-badge-audit="" data-area-theme={theme} data-area-ui={density} data-area-radius={radius} data-area-contrast={contrast} data-area-motion={motion} dir={direction} style={{ ...(type === "system" ? { "--area-font-sans": "system-ui" } : {}), background: "var(--area-bg-surface)", color: "var(--area-fg-default)", padding: "var(--area-space-24)", display: "grid", gap: "var(--area-space-24)" } as CSSProperties}>
      {(["sm", "md", "lg"] as const).map(size => <div key={size}><Badge size={size} icon={<InfoIcon />} trailingIcon={<ArrowIcon />}>Badge</Badge></div>)}
      <BadgeToneMatrix />
      <BadgeAnchorPlacements />
      <BadgeGroupAuto />
    </div>
  </div>;
};

const galleryTones = ["neutral", "accent", "info", "success", "warning", "caution", "danger", "discovery", "inverted"] as const;
const galleryVariants = ["soft", "solid", "outline", "color", "modern"] as const;
const galleryName = (value: string) => value[0]!.toUpperCase() + value.slice(1);
const galleryBadge = (variant: typeof galleryVariants[number], tone: typeof galleryTones[number]) => () => false
  ? <Badge as="a" href="#api" variant={variant} tone={tone}>{tone}</Badge>
  : <Badge variant={variant} tone={tone}>{tone}</Badge>;
const galleryDotBadge = (variant: "soft" | "outline", tone: typeof galleryTones[number]) => () => <Badge dot variant={variant} tone={tone}>{tone}</Badge>;
const galleryPlacement = (placement: "top-end" | "top-start" | "bottom-end" | "bottom-start") => () => <IndicatorAnchor placement={placement} indicator={<Indicator count={3} />}><Button aria-label={`${placement}, 3 unread`}>{placement}</Button></IndicatorAnchor>;

export const BADGE_GALLERY_DEMOS: Record<string, () => ReactNode> = Object.fromEntries([
  ...(["available", "away", "busy", "do-not-disturb", "blocked", "offline", "out-of-office", "unknown"] as const).map(status => [`GalleryBadgePresence${galleryName(status).replaceAll("-", "")}`, () => <Indicator status={status} />]),
  ...(["xs", "sm", "md", "lg"] as const).map(size => [`GalleryBadgePresenceSize${galleryName(size)}`, () => <Indicator status="available" size={size} />]),
  ...(["available", "away", "busy", "do-not-disturb", "offline"] as const).map(status => [`GalleryBadgePresenceOutside${galleryName(status).replaceAll("-", "")}`, () => <Indicator status={status} outOfOffice />]),
  ...[0, 3, 24, 125].map(count => [`GalleryBadgeCount${count}`, () => <Indicator count={count} />]),
  ["GalleryBadgeActivity", () => <Indicator tone="accent" />],
  ["GalleryBadgeProcessing", () => <Indicator tone="info" processing />],
  ["GalleryBadgeBorder", () => <Indicator tone="success" withBorder />],
  ["GalleryBadgeCountNeutral", () => <Indicator count={8} tone="neutral" />],
  ...(["sm", "md", "lg"] as const).map(size => [`GalleryBadgeSize${galleryName(size)}`, () => <Badge size={size}>{galleryName(size)}</Badge>]),
  ...galleryVariants.flatMap(variant => galleryTones.map(tone => [`GalleryBadge${galleryName(variant)}${galleryName(tone)}`, galleryBadge(variant, tone)])),
  ...(["soft", "outline"] as const).flatMap(variant => galleryTones.map(tone => [`GalleryBadgeDot${galleryName(variant)}${galleryName(tone)}`, galleryDotBadge(variant, tone)])),
  ...(["top-end", "top-start", "bottom-end", "bottom-start"] as const).map(placement => [`GalleryBadgeAnchor${galleryName(placement).replace("-", "")}`, galleryPlacement(placement)]),
  ["GalleryBadgeStateOpen", () => <Badge variant="solid" tone="success" icon={<PlusIcon />}>Open</Badge>],
  ["GalleryBadgeStateDone", () => <Badge variant="solid" tone="discovery" icon={<CheckIcon />}>Done</Badge>],
  ["GalleryBadgeStateClosed", () => <Badge variant="solid" tone="danger" icon={<DismissIcon />}>Closed</Badge>],
  ["GalleryBadgeStateDraft", () => <Badge variant="solid" icon={<InfoIcon />}>Draft</Badge>],
  ["GalleryBadgeStateQueued", () => <Badge variant="solid" tone="info" icon={<InfoIcon />}>Queued</Badge>],
  ["GalleryBadgeThemeLight", () => <Theme value={{ theme: "light" }}><div style={{ background: "var(--area-bg-surface)", padding: "var(--area-space-16)" }}><Badge tone="success" dot>Badge</Badge></div></Theme>],
  ["GalleryBadgeThemeDark", () => <Theme value={{ theme: "dark" }}><div style={{ background: "var(--area-bg-surface)", padding: "var(--area-space-16)" }}><Badge tone="success" dot>Badge</Badge></div></Theme>],
  ["GalleryBadgeStressLong", () => <div style={{ width: "calc(var(--area-space-80) * 3)", maxWidth: "100%" }}><Badge truncate icon={<InfoIcon />}>Produktionsbereitstellungsbestätigung ausstehend</Badge></div>],
  ["GalleryBadgeStressRtl", () => <div dir="rtl"><Badge as="a" href="#api" trailingIcon={<ArrowIcon />}>تفاصيل الإصدار</Badge></div>],
  ["GalleryBadgeStressZoom", () => <div style={{ zoom: 2, maxWidth: "100%" }}><Badge truncate>Awaiting deployment approval</Badge></div>],
  ["GalleryBadgeTableDeployed", () => <Table><thead><tr><th>Name</th><th>Status</th></tr></thead><tbody><tr><td>Item one</td><td><Badge dot tone="success">Status</Badge></td></tr></tbody></Table>],
  ["GalleryBadgeTableBuilding", () => <Table><thead><tr><th>Name</th><th>Status</th></tr></thead><tbody><tr><td>Item two</td><td><Badge dot tone="warning">Status</Badge></td></tr></tbody></Table>],
]);

export const BadgeAvatar = () => <Badge variant="modern" avatar={<Avatar fallback="A" />}>Alex Morgan</Badge>;
export const BadgeFlag = () => <Badge variant="color" flag={<svg viewBox="0 0 16 16"><rect width="16" height="16" fill="white" /><circle cx="8" cy="8" r="4" fill="#BC002D" /></svg>}>Japan</Badge>;
export const BadgeDismissible = () => {
  const [visible, setVisible] = useState(true);
  return visible ? <Badge variant="color" tone="discovery" dismissLabel="Remove design label" onDismiss={() => setVisible(false)}>Design</Badge> : <Button size="sm" variant="ghost" onClick={() => setVisible(true)}>Restore badge</Button>;
};

export const BadgePresenceIndicators = () => (
  <div style={{display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "var(--area-space-16)"}}>
    {(["available", "away", "busy", "do-not-disturb", "blocked", "offline", "out-of-office", "unknown"] as const).map(status => <span key={status} style={{display: "inline-flex", gap: "var(--area-space-8)", alignItems: "center"}}><Presence status={status} aria-hidden="true" />{status.replaceAll("-", " ")}</span>)}
  </div>
);
export const BadgePresenceSizes = () => <div style={{display: "flex", gap: "var(--area-space-16)", alignItems: "center"}}>{(["xs", "sm", "md", "lg"] as const).map(size => <Presence key={size} size={size} aria-label={`Available, ${size}`} />)}</div>;
export const BadgePresenceOutside = () => <div style={{display: "flex", flexWrap: "wrap", gap: "var(--area-space-16)"}}>{(["available", "away", "busy", "do-not-disturb", "offline"] as const).map(status => <Presence key={status} status={status} outOfOffice />)}</div>;
export const BadgeCountIndicators = () => (
  <div style={{display: "flex", gap: "var(--area-space-16)"}}><Indicator count={0} /><Indicator count={3} /><Indicator count={24} /><Indicator count={125} /></div>
);
export const BadgeIndicatorActivity = () => <div style={{display: "flex", gap: "var(--area-space-24)", alignItems: "center"}}><Indicator tone="accent" /><Indicator tone="info" processing /><Indicator tone="success" withBorder /><Indicator count={8} tone="neutral" /></div>;
export const BadgeIndicatorZero = () => {
  const [show, setShow] = useState(true);
  return <div style={{display: "flex", gap: "var(--area-space-16)", alignItems: "center"}}><IndicatorAnchor indicator={<Indicator count={0} showZero={show} />}><Button aria-label={show ? "Inbox, 0 notifications" : "Inbox"}>Inbox</Button></IndicatorAnchor><Button size="sm" variant="soft" onClick={() => setShow(!show)}>{show ? "Hide zero" : "Show zero"}</Button></div>;
};

/*
 * Pass review (2026-09-25, docs/specs/badge.md). Each row isolates one change. "Before"
 * rebuilds the previous values on the current component through its private properties,
 * so both columns render the same code; nothing here is a public API.
 */
const previous = {
  sm: { "--_text": "var(--area-control-xs-text)", "--_leading": "var(--area-control-xs-leading)" },
  lg: { "--_height": "calc(var(--area-space-24) + var(--area-space-4))", "--_gutter": "var(--area-space-12)" },
  ink: { "--_tone-fg": "var(--area-fg-default)" },
} as Record<string, CSSProperties>;
const reviewSentence: CSSProperties = { margin: 0, fontSize: "var(--area-control-md-text)", lineHeight: "var(--area-control-md-leading)", boxShadow: "inset 0 -1px 0 var(--area-border-decorative)" };
// Pass-1 label: centred by the shell and padded by inset.css, carrying no baseline.
const previousLabel: CSSProperties = { alignSelf: "auto", paddingBlock: "0.25em" };

/* Badge group pass review (2026-09-25, docs/specs/badge-group.md). */
const reviewRow: CSSProperties = { display: "flex", alignItems: "center", gap: "var(--area-space-4)", boxShadow: "0 0 0 var(--area-border-width) var(--area-border-decorative)" };
// An array, not a fragment: BadgeGroup counts its direct children.
