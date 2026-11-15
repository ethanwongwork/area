import { useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { Avatar, Badge, Indicator, IndicatorAnchor, BadgeGroup, Button, Table, Theme } from "@area/react";
import { AddIcon, ArrowRightIcon, BellIcon, CheckIcon, DismissIcon, InfoIcon, LinkIcon } from "@area/icons";

export const BadgeDefault = () => <Badge>Badge</Badge>;
/** Follows the radius setting instead of a pill (2026-10-03). */
export const BadgeRounded = () => <Badge pill={false}>Badge</Badge>;
export const BadgeVariants = () => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "start", gap: "var(--area-space-24)" }}>
    <Badge variant="soft">Soft</Badge>
    <Badge variant="solid">Solid</Badge>
    <Badge variant="color">Color</Badge>
    <Badge variant="modern">Modern</Badge>
    <Badge variant="outline">Outline</Badge>
    <Badge variant="plain" tone="discovery" icon={<CheckIcon size={12} />}>Plain</Badge>
  </div>
);
export const BadgeSizes = () => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "start", gap: "var(--area-space-24)" }}>
    {(["sm", "md", "lg"] as const).map(size => <Badge key={size} size={size}>{size}</Badge>)}
  </div>
);
export const BadgeToneMatrix = () => (
  <div aria-label="Badge variant by tone matrix" style={{ display: "flex", flexDirection: "column", gap: "var(--area-space-24)", maxWidth: "100%" }}>
    {(["soft", "solid", "outline", "color", "modern", "plain"] as const).map(variant => (
      <section key={variant} aria-label={variant}>
        <p>{variant}</p>
        <BadgeGroup>
          {(["neutral", "info", "success", "warning", "caution", "danger", "discovery", "inverse"] as const).map(tone => false
            ? <Badge key={tone} as="a" href="#api" variant={variant} tone={tone}>{galleryName(tone)}</Badge>
            : <Badge key={tone} variant={variant} tone={tone} dot={variant === "modern" || variant === "plain"}>{galleryName(tone)}</Badge>)}
        </BadgeGroup>
      </section>
    ))}
  </div>
);
export const BadgeTones = () => (
  <BadgeGroup>{(["neutral", "info", "success", "warning", "caution", "danger", "discovery", "inverse"] as const).map(tone => <Badge key={tone} tone={tone}>{galleryName(tone)}</Badge>)}</BadgeGroup>
);
export const BadgeLeadingIcon = () => <Badge icon={<CheckIcon size={12} />}>Badge</Badge>;
export const BadgeTrailingIcon = () => <Badge trailingIcon={<InfoIcon size={12} />}>Badge</Badge>;
export const BadgeIconOnly = () => <Badge iconOnly icon={<CheckIcon size={12} />} aria-label="Badge" />;
export const BadgeDotSoft = () => <Badge dot tone="success">Badge</Badge>;
export const BadgeDotOutline = () => <Badge dot variant="outline" tone="warning">Badge</Badge>;
export const BadgeDotOnly = () => <Badge dotOnly tone="success" aria-label="Available" />;
export const BadgeDotMatrix = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "var(--area-space-24)" }}>
    {(["soft", "outline"] as const).map(variant => <BadgeGroup key={variant}>{(["neutral", "info", "success", "warning", "caution", "danger", "discovery", "inverse"] as const).map(tone => <Badge key={tone} dot variant={variant} tone={tone}>{galleryName(tone)}</Badge>)}</BadgeGroup>)}
  </div>
);
export const BadgeStateLabels = () => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "start", gap: "var(--area-space-24)" }}>
    <Badge pill variant="solid" tone="success" icon={<AddIcon size={12} />}>Open</Badge>
    <Badge pill variant="solid" tone="discovery" icon={<CheckIcon size={12} />}>Done</Badge>
    <Badge pill variant="solid" tone="danger" icon={<DismissIcon size={12} />}>Closed</Badge>
    <Badge pill variant="solid" icon={<InfoIcon size={12} />}>Draft</Badge>
    <Badge pill variant="solid" tone="info" icon={<InfoIcon size={12} />}>Queued</Badge>
  </div>
);
export const BadgeTruncation = () => <Badge truncate title="Badge text that overflows the available space">Badge text that overflows the available space</Badge>;
export const BadgeLink = () => <Badge as="a" href="#api" trailingIcon={<LinkIcon size={12} />}>Link</Badge>;
export const BadgeAnchorButton = () => (
  <IndicatorAnchor indicator={<Indicator count={3} />}>
    <Button aria-label="Button, 3">Button</Button>
  </IndicatorAnchor>
);
export const BadgeAnchorIconButton = () => (
  <IndicatorAnchor indicator={<Indicator />}>
    <Button variant="ghost" tone="neutral" iconOnly icon={<BellIcon />} aria-label="Notifications, new activity" />
  </IndicatorAnchor>
);
export const BadgeAnchorAvatar = () => (
  <IndicatorAnchor placement="bottom-end" overlap="circular" indicator={<Indicator status="available" size="sm" />}>
    <Avatar fallback="D" role="img" aria-label="David Tee, available" />
  </IndicatorAnchor>
);
export const BadgeAnchorTab = () => (
  <div className="area-tabs"><div className="area-tabs__list" role="tablist" aria-label="Label">
    <IndicatorAnchor indicator={<Indicator count={2} />}><button type="button" className="area-tabs__tab" role="tab" aria-selected="true" aria-label="Label, 2"><span className="area-tabs__label"><span className="area-tabs__text">Item one</span></span></button></IndicatorAnchor>
  </div></div>
);
export const BadgeAnchorPlacements = () => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "start", gap: "var(--area-space-32)" }}>
    {(["top-end", "top-start", "bottom-end", "bottom-start"] as const).map(placement => <IndicatorAnchor key={placement} placement={placement} indicator={<Indicator count={3} />}><Button aria-label="Button, 3">Button</Button></IndicatorAnchor>)}
  </div>
);
export const BadgeAnchorVisibility = () => {
  const [invisible, setInvisible] = useState(false);
  return <IndicatorAnchor invisible={invisible} indicator={<Indicator count={3} />}><Button onClick={() => setInvisible(value => !value)} aria-label={invisible ? "Button" : "Button, 3"}>Button</Button></IndicatorAnchor>;
};
/* In a 160 column, so the group wraps onto a second row as its name says (it sat on one row; F3.3). */
export const BadgeGroupWrap = () => (
  <BadgeGroup style={{ inlineSize: "calc(var(--area-space-80) * 2)" }}><Badge>Neutral</Badge><Badge tone="info">Info</Badge><Badge tone="discovery">Discovery</Badge><Badge tone="success">Success</Badge></BadgeGroup>
);
export const BadgeGroupInline = () => (
  <BadgeGroup visibleCount={2} overflow="inline"><Badge>Neutral</Badge><Badge tone="info">Info</Badge><Badge tone="discovery">Discovery</Badge><Badge tone="success">Success</Badge><Badge tone="warning">Warning</Badge></BadgeGroup>
);
export const BadgeGroupOverlay = () => (
  <BadgeGroup visibleCount={2} overflow="overlay"><Badge>Neutral</Badge><Badge tone="info">Info</Badge><Badge tone="discovery">Discovery</Badge><Badge tone="success">Success</Badge><Badge tone="warning">Warning</Badge></BadgeGroup>
);
export const BadgeGroupAuto = () => (
  <div style={{ width: "calc(var(--area-space-80) * 3)", maxWidth: "100%", resize: "horizontal", overflow: "auto", padding: "var(--area-space-8)", border: "var(--area-border-width) dashed var(--area-edge-regions)", borderRadius: "var(--area-radius-container)" }}>
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
    <Badge truncate icon={<InfoIcon size={12} />}>Produktionsbereitstellungsbestätigung ausstehend</Badge>
    <Badge as="a" href="#api" trailingIcon={<ArrowRightIcon size={12} />}>تفاصيل الإصدار</Badge>
    <div style={{ zoom: 2, maxWidth: "100%" }}><Badge truncate>Badge text that overflows the available space</Badge></div>
  </div>
);
export const BadgeAuditControls = () => {
  const [theme, setTheme] = useState("light");
  const [density, setDensity] = useState("32");
  const [radius, setRadius] = useState("8");
  const [type, setType] = useState("geist");
  const [motion, setMotion] = useState("210");
  const [contrast, setContrast] = useState("standard");
  const [direction, setDirection] = useState<"ltr" | "rtl">("ltr");
  return <div style={{ display: "grid", gap: "var(--area-space-24)", maxWidth: "100%" }}>
    <label>Audit theme <select className="area-select area-select--sm" value={theme} onChange={event => setTheme(event.target.value)}><option>light</option><option>dark</option></select></label>
    <label>Audit density <select className="area-select area-select--sm" value={density} onChange={event => setDensity(event.target.value)}><option>28</option><option>32</option><option>36</option></select></label>
    <label>Audit radius <select className="area-select area-select--sm" value={radius} onChange={event => setRadius(event.target.value)}>{["0", "2", "4", "6", "8", "10", "12", "14", "pill"].map(value => <option key={value}>{value}</option>)}</select></label>
    <label>Audit font <select className="area-select area-select--sm" value={type} onChange={event => setType(event.target.value)}><option>geist</option><option>system</option></select></label>
    <label>Audit motion <select className="area-select area-select--sm" value={motion} onChange={event => setMotion(event.target.value)}><option>0</option><option>210</option></select></label>
    <label>Audit contrast <select className="area-select area-select--sm" value={contrast} onChange={event => setContrast(event.target.value)}><option>standard</option><option>more</option></select></label>
    <label>Audit direction <select className="area-select area-select--sm" value={direction} onChange={event => setDirection(event.target.value as "ltr" | "rtl")}><option>ltr</option><option>rtl</option></select></label>
    <div data-badge-audit="" data-area-theme={theme} data-area-density={density} data-area-radius={radius} data-area-contrast={contrast} data-area-motion={motion} dir={direction} style={{ ...(type === "system" ? { "--area-font-sans": "system-ui" } : {}), background: "var(--area-bg-surface)", color: "var(--area-fg-default)", padding: "var(--area-space-24)", display: "grid", gap: "var(--area-space-24)" } as CSSProperties}>
      {(["sm", "md", "lg"] as const).map(size => <div key={size}><Badge size={size} icon={<InfoIcon size={12} />} trailingIcon={<ArrowRightIcon size={12} />}>Badge</Badge></div>)}
      <BadgeToneMatrix />
      <BadgeAnchorPlacements />
      <BadgeGroupAuto />
    </div>
  </div>;
};

const galleryTones = ["neutral", "info", "success", "warning", "caution", "danger", "discovery", "inverse"] as const;
const galleryVariants = ["soft", "solid", "outline", "color", "modern", "plain"] as const;
const galleryName = (value: string) => value[0]!.toUpperCase() + value.slice(1);
// Modern and plain colour only their add-on (a dot or an icon), so their tone tiles carry the dot; without it all eight
// read as the same plate (owner, round 76: approved) or the same muted word (plain, 2026-11-01).
const galleryBadge = (variant: typeof galleryVariants[number], tone: typeof galleryTones[number]) => () => false
  ? <Badge as="a" href="#api" variant={variant} tone={tone}>{galleryName(tone)}</Badge>
  : <Badge variant={variant} tone={tone} dot={variant === "modern" || variant === "plain"}>{galleryName(tone)}</Badge>;
const galleryDotBadge = (variant: "soft" | "outline", tone: typeof galleryTones[number]) => () => <Badge dot variant={variant} tone={tone}>{galleryName(tone)}</Badge>;
const galleryPlacement = (placement: "top-end" | "top-start" | "bottom-end" | "bottom-start") => () => <IndicatorAnchor placement={placement} indicator={<Indicator count={3} />}><Button aria-label={`${placement}, 3 unread`}>{placement}</Button></IndicatorAnchor>;

export const BADGE_GALLERY_DEMOS: Record<string, () => ReactNode> = Object.fromEntries([
  ...(["available", "away", "busy", "do-not-disturb", "blocked", "offline", "out-of-office", "unknown"] as const).map(status => [`GalleryBadgePresence${galleryName(status).replaceAll("-", "")}`, () => <Indicator status={status} />]),
  ...(["sm", "md", "lg"] as const).map(size => [`GalleryBadgePresenceSize${galleryName(size)}`, () => <Indicator status="available" size={size} />]),
  ...(["available", "away", "busy", "do-not-disturb", "offline"] as const).map(status => [`GalleryBadgePresenceOutside${galleryName(status).replaceAll("-", "")}`, () => <Indicator status={status} outOfOffice />]),
  ...[0, 3, 24, 125].map(count => [`GalleryBadgeCount${count}`, () => <Indicator count={count} />]),
  ["GalleryBadgeActivity", () => <Indicator tone="info" />],
  ["GalleryBadgeProcessing", () => <Indicator tone="info" processing />],
  ["GalleryBadgeBorder", () => <Indicator tone="success" bordered />],
  ["GalleryBadgeCountNeutral", () => <Indicator count={8} tone="neutral" />],
  ...(["sm", "md", "lg"] as const).map(size => [`GalleryBadgeSize${galleryName(size)}`, () => <Badge size={size}>{galleryName(size)}</Badge>]),
  ...galleryVariants.flatMap(variant => galleryTones.map(tone => [`GalleryBadge${galleryName(variant)}${galleryName(tone)}`, galleryBadge(variant, tone)])),
  ...(["soft", "outline"] as const).flatMap(variant => galleryTones.map(tone => [`GalleryBadgeDot${galleryName(variant)}${galleryName(tone)}`, galleryDotBadge(variant, tone)])),
  ...(["top-end", "top-start", "bottom-end", "bottom-start"] as const).map(placement => [`GalleryBadgeAnchor${galleryName(placement).replace("-", "")}`, galleryPlacement(placement)]),
  ["GalleryBadgeStateOpen", () => <Badge variant="solid" tone="success" icon={<AddIcon size={12} />}>Open</Badge>],
  ["GalleryBadgeStateDone", () => <Badge variant="solid" tone="discovery" icon={<CheckIcon size={12} />}>Done</Badge>],
  ["GalleryBadgeStateClosed", () => <Badge variant="solid" tone="danger" icon={<DismissIcon size={12} />}>Closed</Badge>],
  ["GalleryBadgeStateDraft", () => <Badge variant="solid" icon={<InfoIcon size={12} />}>Draft</Badge>],
  ["GalleryBadgeStateQueued", () => <Badge variant="solid" tone="info" icon={<InfoIcon size={12} />}>Queued</Badge>],
  ["GalleryBadgeThemeLight", () => <Theme value={{ theme: "light" }}><div style={{ background: "var(--area-bg-surface)", padding: "var(--area-space-16)" }}><Badge tone="success" dot>Badge</Badge></div></Theme>],
  ["GalleryBadgeThemeDark", () => <Theme value={{ theme: "dark" }}><div style={{ background: "var(--area-bg-surface)", padding: "var(--area-space-16)" }}><Badge tone="success" dot>Badge</Badge></div></Theme>],
  ["GalleryBadgeStressLong", () => <div style={{ width: "calc(var(--area-space-80) * 3)", maxWidth: "100%" }}><Badge truncate icon={<InfoIcon size={12} />}>Produktionsbereitstellungsbestätigung ausstehend</Badge></div>],
  ["GalleryBadgeStressRtl", () => <div dir="rtl"><Badge as="a" href="#api" trailingIcon={<ArrowRightIcon size={12} />}>تفاصيل الإصدار</Badge></div>],
  ["GalleryBadgeStressZoom", () => <div style={{ zoom: 2, maxWidth: "100%" }}><Badge truncate>Badge text that overflows the available space</Badge></div>],
  ["GalleryBadgeTableDeployed", () => <Table><thead><tr><th>Name</th><th>Status</th></tr></thead><tbody><tr><td>Item one</td><td><Badge dot tone="success">Status</Badge></td></tr></tbody></Table>],
  ["GalleryBadgeTableBuilding", () => <Table><thead><tr><th>Name</th><th>Status</th></tr></thead><tbody><tr><td>Item two</td><td><Badge dot tone="warning">Status</Badge></td></tr></tbody></Table>],
]);

export const BadgeAvatar = () => <Badge avatar={<Avatar fallback="D" />}>David Tee</Badge>;
export const BadgeFlag = () => <Badge flag={<svg viewBox="0 0 16 16"><rect width="16" height="16" fill="white" /><circle cx="8" cy="8" r="4" fill="#BC002D" /></svg>}>Japan</Badge>;
export const BadgeDismissible = () => {
  const [visible, setVisible] = useState(true);
  return visible ? <Badge dismissLabel="Remove badge" onDismiss={() => setVisible(false)}>Badge</Badge> : <Button size="sm" variant="ghost" onClick={() => setVisible(true)}>Restore badge</Button>;
};

export const BadgeIndicatorZero = () => {
  const [show, setShow] = useState(true);
  return <div style={{display: "flex", gap: "var(--area-space-16)", alignItems: "center"}}><IndicatorAnchor indicator={<Indicator count={0} showZero={show} />}><Button aria-label={show ? "Button, 0" : "Button"}>Button</Button></IndicatorAnchor><Button size="sm" variant="soft" onClick={() => setShow(!show)}>{show ? "Hide zero" : "Show zero"}</Button></div>;
};

/* On a coloured ground: the ground's own ink, a plate of the ink's opposite and a line of the ink (Code's onColor). */
const ground = (background: string, color: string): CSSProperties => ({ alignSelf: "stretch", blockSize: "100%", boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center", inlineSize: "100%", background, borderRadius: "var(--area-radius-container)", color, padding: "var(--area-space-24)" });
export const BadgeOnColor = () => <div style={ground("var(--area-accent-solid)", "var(--area-fg-on-accent)")}><Badge onColor>AA · 4.61</Badge></div>;
/* A light step with black ink, as the Color tab's cards: the ink line is the chip's only edge, on light steps as on dark. */
export const BadgeOnColorLight = () => <div style={ground("var(--area-yellow-300)", "#000")}><Badge onColor>AAA · 12.90</Badge></div>;
