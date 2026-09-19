import { useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { Avatar, Badge, BadgeAnchor, BadgeGroup, Button, Card, CardDescription, CardTitle, Nav, NavItem, Table, Theme } from "@area/react";
import { ArrowIcon, CheckIcon, DismissIcon, InfoIcon, PlusIcon } from "../icons.tsx";

export const BadgeDefault = () => <Badge>Draft</Badge>;
export const BadgeVariants = () => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "start", gap: "var(--area-space-24)" }}>
    <Badge variant="soft">Soft</Badge>
    <Badge variant="solid">Solid</Badge>
    <Badge variant="outline">Outline</Badge>
    <Badge variant="ghost">Ghost</Badge>
    <Badge as="a" href="#api" variant="plain">Plain link</Badge>
  </div>
);
export const BadgeSizes = () => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "start", gap: "var(--area-space-24)" }}>
    {(["sm", "md", "lg"] as const).map(size => <Badge key={size} size={size}>{size}</Badge>)}
  </div>
);
export const BadgeToneMatrix = () => (
  <div aria-label="Badge variant by tone matrix" style={{ display: "flex", flexDirection: "column", gap: "var(--area-space-24)", maxWidth: "100%" }}>
    {(["soft", "solid", "outline", "ghost", "plain"] as const).map(variant => (
      <section key={variant} aria-label={variant}>
        <p>{variant}</p>
        <BadgeGroup>
          {(["neutral", "accent", "info", "success", "warning", "caution", "danger", "discovery", "inverted", "custom"] as const).map(tone => variant === "plain"
            ? <Badge key={tone} as="a" href="#api" variant={variant} tone={tone}>{tone}</Badge>
            : <Badge key={tone} variant={variant} tone={tone}>{tone}</Badge>)}
        </BadgeGroup>
      </section>
    ))}
  </div>
);
export const BadgeTones = () => (
  <BadgeGroup>{(["neutral", "accent", "info", "success", "warning", "caution", "danger", "discovery", "inverted", "custom"] as const).map(tone => <Badge key={tone} tone={tone}>{tone}</Badge>)}</BadgeGroup>
);
export const BadgeLeadingIcon = () => <Badge tone="success" icon={<CheckIcon />}>Deployed</Badge>;
export const BadgeTrailingIcon = () => <Badge trailingIcon={<InfoIcon />}>Queued</Badge>;
export const BadgeIconOnly = () => <Badge iconOnly icon={<CheckIcon />} tone="success" aria-label="Deployed" />;
export const BadgeIconCircle = () => <Badge pill iconOnly icon={<CheckIcon />} tone="success" aria-label="Deployed" />;
export const BadgeNumber = () => <Badge pill>12</Badge>;
export const BadgeDotSoft = () => <Badge dot tone="success">Ready</Badge>;
export const BadgeDotOutline = () => <Badge dot variant="outline" tone="warning">Building</Badge>;
export const BadgeDotOnly = () => <Badge dotOnly tone="success" aria-label="Available" />;
export const BadgeDotMatrix = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "var(--area-space-24)" }}>
    {(["soft", "outline"] as const).map(variant => <BadgeGroup key={variant}>{(["neutral", "accent", "info", "success", "warning", "caution", "danger", "discovery", "inverted", "custom"] as const).map(tone => <Badge key={tone} dot variant={variant} tone={tone}>{tone}</Badge>)}</BadgeGroup>)}
  </div>
);
export const BadgeStateLabels = () => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "start", gap: "var(--area-space-24)" }}>
    <Badge pill variant="solid" tone="success" icon={<PlusIcon />}>Open</Badge>
    <Badge pill variant="solid" tone="discovery" icon={<CheckIcon />}>Merged</Badge>
    <Badge pill variant="solid" tone="danger" icon={<DismissIcon />}>Closed</Badge>
    <Badge pill variant="solid" icon={<InfoIcon />}>Draft</Badge>
    <Badge pill variant="solid" tone="info" icon={<InfoIcon />}>Queued</Badge>
  </div>
);
export const BadgeTruncation = () => <Badge truncate title="Awaiting production deployment approval">Awaiting production deployment approval</Badge>;
export const BadgeUppercase = () => <Badge uppercase>Early access</Badge>;
export const BadgeLink = () => <Badge as="a" href="#api" variant="plain" tone="info" trailingIcon={<ArrowIcon />}>Release notes</Badge>;
export const BadgeLinkSoft = () => <Badge as="a" href="#api" tone="discovery">Preview details</Badge>;
export const BadgeAnchorButton = () => (
  <BadgeAnchor badge={<Badge size="sm" variant="solid" tone="danger">3</Badge>}>
    <Button aria-label="Notifications, 3 unread">Notifications</Button>
  </BadgeAnchor>
);
export const BadgeAnchorAvatar = () => (
  <BadgeAnchor placement="bottom-end" overlap="circular" badge={<Badge size="sm" dotOnly tone="success" aria-label="Available" />}>
    <Avatar fallback="MO" role="img" aria-label="Mira Okafor, available" />
  </BadgeAnchor>
);
export const BadgeAnchorTab = () => (
  <div className="area-tabs"><div className="area-tabs__list" role="tablist" aria-label="Project activity">
    <BadgeAnchor badge={<Badge size="sm" variant="solid" tone="info">2</Badge>}><button type="button" className="area-tabs__tab" role="tab" aria-selected="true" aria-label="Activity, 2 new events">Activity</button></BadgeAnchor>
  </div></div>
);
export const BadgeAnchorPlacements = () => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "start", gap: "var(--area-space-32)" }}>
    {(["top-end", "top-start", "bottom-end", "bottom-start"] as const).map(placement => <BadgeAnchor key={placement} placement={placement} badge={<Badge size="sm" variant="solid">3</Badge>}><Button aria-label={`${placement}, 3 unread`}>{placement}</Button></BadgeAnchor>)}
  </div>
);
export const BadgeAnchorVisibility = () => {
  const [invisible, setInvisible] = useState(false);
  return <BadgeAnchor invisible={invisible} badge={<Badge size="sm" variant="solid" tone="danger">3</Badge>}><Button onClick={() => setInvisible(value => !value)} aria-label={invisible ? "Show unread badge" : "Hide badge, 3 unread"}>Toggle badge</Button></BadgeAnchor>;
};
export const BadgeGroupWrap = () => (
  <BadgeGroup><Badge>Draft</Badge><Badge tone="info">Internal</Badge><Badge tone="discovery">Preview</Badge><Badge tone="success">Reviewed</Badge></BadgeGroup>
);
export const BadgeGroupInline = () => (
  <BadgeGroup visibleCount={2} overflow="inline"><Badge>Draft</Badge><Badge tone="info">Internal</Badge><Badge tone="discovery">Preview</Badge><Badge tone="success">Reviewed</Badge><Badge tone="warning">Pending</Badge></BadgeGroup>
);
export const BadgeGroupOverlay = () => (
  <BadgeGroup visibleCount={2} overflow="overlay"><Badge>Draft</Badge><Badge tone="info">Internal</Badge><Badge tone="discovery">Preview</Badge><Badge tone="success">Reviewed</Badge><Badge tone="warning">Pending</Badge></BadgeGroup>
);
export const BadgeGroupAuto = () => (
  <div style={{ width: "calc(var(--area-space-80) * 3)", maxWidth: "100%", resize: "horizontal", overflow: "auto", padding: "var(--area-space-8)" }}>
    <BadgeGroup visibleCount="auto" overflow="overlay"><Badge>Draft</Badge><Badge tone="info">Internal</Badge><Badge tone="discovery">Preview</Badge><Badge tone="success">Reviewed</Badge><Badge tone="warning">Pending</Badge></BadgeGroup>
  </div>
);
export const BadgeCustomBrand = () => (
  <Badge tone="custom" style={{ "--area-badge-bg": "linear-gradient(135deg, var(--area-discovery-solid), var(--area-discovery-solid-hover))", "--area-badge-fg": "var(--area-fg-on-discovery)" } as CSSProperties}>Pro</Badge>
);
export const BadgeTableStatus = () => (
  <Table><thead><tr><th>Project</th><th>Status</th></tr></thead><tbody><tr><td>Website</td><td><Badge dot tone="success">Deployed</Badge></td></tr><tr><td>Brand kit</td><td><Badge dot tone="warning">Building</Badge></td></tr></tbody></Table>
);
export const BadgeNavNew = () => (
  <Nav aria-label="Workspace"><NavItem href="#api" trailing={<Badge tone="discovery">New</Badge>}>Activity</NavItem></Nav>
);
export const BadgeCardHeading = () => (
  <Card style={{ inlineSize: "min(100%, calc(var(--area-space-80) * 3))" }}>
    <CardTitle><span style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "var(--area-space-12)" }}><span>Deployments</span><Badge tone="discovery">Beta</Badge></span></CardTitle>
    <CardDescription>Track releases across every environment.</CardDescription>
  </Card>
);
export const BadgeBothThemes = () => (
  <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--area-space-24)" }}>
    {(["light", "dark"] as const).map(theme => <Theme key={theme} value={{ theme }}><div style={{ background: "var(--area-bg-surface)", padding: "var(--area-space-16)" }}><Badge tone="success" dot>Deployed</Badge></div></Theme>)}
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
      {(["sm", "md", "lg"] as const).map(size => <div key={size}><Badge size={size} icon={<InfoIcon />} trailingIcon={<ArrowIcon />}>Review</Badge></div>)}
      <BadgeToneMatrix />
      <BadgeAnchorPlacements />
      <BadgeGroupAuto />
    </div>
  </div>;
};

const galleryTones = ["neutral", "accent", "info", "success", "warning", "caution", "danger", "discovery", "inverted", "custom"] as const;
const galleryVariants = ["soft", "solid", "outline", "ghost", "plain"] as const;
const galleryName = (value: string) => value[0]!.toUpperCase() + value.slice(1);
const galleryBadge = (variant: typeof galleryVariants[number], tone: typeof galleryTones[number]) => () => variant === "plain"
  ? <Badge as="a" href="#api" variant={variant} tone={tone}>{tone}</Badge>
  : <Badge variant={variant} tone={tone}>{tone}</Badge>;
const galleryDotBadge = (variant: "soft" | "outline", tone: typeof galleryTones[number]) => () => <Badge dot variant={variant} tone={tone}>{tone}</Badge>;
const galleryPlacement = (placement: "top-end" | "top-start" | "bottom-end" | "bottom-start") => () => <BadgeAnchor placement={placement} badge={<Badge size="sm" variant="solid">3</Badge>}><Button aria-label={`${placement}, 3 unread`}>{placement}</Button></BadgeAnchor>;

export const BADGE_GALLERY_DEMOS: Record<string, () => ReactNode> = Object.fromEntries([
  ...(["sm", "md", "lg"] as const).map(size => [`GalleryBadgeSize${galleryName(size)}`, () => <Badge size={size}>{galleryName(size)}</Badge>]),
  ...galleryVariants.flatMap(variant => galleryTones.map(tone => [`GalleryBadge${galleryName(variant)}${galleryName(tone)}`, galleryBadge(variant, tone)])),
  ...(["soft", "outline"] as const).flatMap(variant => galleryTones.map(tone => [`GalleryBadgeDot${galleryName(variant)}${galleryName(tone)}`, galleryDotBadge(variant, tone)])),
  ...(["top-end", "top-start", "bottom-end", "bottom-start"] as const).map(placement => [`GalleryBadgeAnchor${galleryName(placement).replace("-", "")}`, galleryPlacement(placement)]),
  ["GalleryBadgeStateOpen", () => <Badge variant="solid" tone="success" icon={<PlusIcon />}>Open</Badge>],
  ["GalleryBadgeStateMerged", () => <Badge variant="solid" tone="discovery" icon={<CheckIcon />}>Merged</Badge>],
  ["GalleryBadgeStateClosed", () => <Badge variant="solid" tone="danger" icon={<DismissIcon />}>Closed</Badge>],
  ["GalleryBadgeStateDraft", () => <Badge variant="solid" icon={<InfoIcon />}>Draft</Badge>],
  ["GalleryBadgeStateQueued", () => <Badge variant="solid" tone="info" icon={<InfoIcon />}>Queued</Badge>],
  ["GalleryBadgeThemeLight", () => <Theme value={{ theme: "light" }}><div style={{ background: "var(--area-bg-surface)", padding: "var(--area-space-16)" }}><Badge tone="success" dot>Deployed</Badge></div></Theme>],
  ["GalleryBadgeThemeDark", () => <Theme value={{ theme: "dark" }}><div style={{ background: "var(--area-bg-surface)", padding: "var(--area-space-16)" }}><Badge tone="success" dot>Deployed</Badge></div></Theme>],
  ["GalleryBadgeStressLong", () => <div style={{ width: "calc(var(--area-space-80) * 3)", maxWidth: "100%" }}><Badge truncate icon={<InfoIcon />}>Produktionsbereitstellungsbestätigung ausstehend</Badge></div>],
  ["GalleryBadgeStressRtl", () => <div dir="rtl"><Badge as="a" href="#api" trailingIcon={<ArrowIcon />}>تفاصيل الإصدار</Badge></div>],
  ["GalleryBadgeStressZoom", () => <div style={{ zoom: 2, maxWidth: "100%" }}><Badge truncate>Awaiting deployment approval</Badge></div>],
  ["GalleryBadgeTableDeployed", () => <Table><thead><tr><th>Project</th><th>Status</th></tr></thead><tbody><tr><td>Website</td><td><Badge dot tone="success">Deployed</Badge></td></tr></tbody></Table>],
  ["GalleryBadgeTableBuilding", () => <Table><thead><tr><th>Project</th><th>Status</th></tr></thead><tbody><tr><td>Brand kit</td><td><Badge dot tone="warning">Building</Badge></td></tr></tbody></Table>],
]);
