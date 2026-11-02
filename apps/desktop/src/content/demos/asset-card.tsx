/** Asset card gallery specimens: one kind per tile. docs/specs/asset-card.md. Example people are David Tee. The card is
 * square: a head with the name and a More button, then the frame with the asset, 4 in (round 55's designs). */
import { AssetCard, AssetGrid, AssetGridItem, Badge, Button, Card, CardContent, CardDescription, CardTitle, CopyButton } from "@area/react";
import { EllipseIcon, MoreHorizontalIcon, SearchIcon, StatusAvailableFilledIcon } from "@area/icons";

const card = { inlineSize: 224 } as const;
/* The head's end holds controls only (round 58): More for what is managed (an image, a group), Copy for what is used (a
   component's code, a colour's value, a type role, an icon's name). */
const more = (name: string) => <Button variant="ghost" tone="neutral" size="sm" iconOnly icon={<MoreHorizontalIcon />} aria-label={`More for ${name}`} />;
const copy = (value: string, name: string) => <CopyButton value={value} label={`Copy ${name}`} />;
/* A type role as an asset: its sample in the role's size and weight over its face, weight, size and leading, as Figma's
   text styles show one ("Ag" over the face). */
const typeSample = (
  <span style={{ display: "grid", justifyItems: "center", gap: "var(--area-space-4)" }}>
    <span style={{ fontSize: "var(--area-title-lg-size)", lineHeight: "var(--area-title-lg-leading)", fontWeight: "var(--area-weight-strong)" }}>Aa</span>
    <span style={{ color: "var(--area-fg-muted)", fontSize: "var(--area-text-xs-size)", lineHeight: "var(--area-text-xs-leading)" }}>Geist · Medium · 24 / 32</span>
  </span>
);
/* A setting's option as an asset: what it sets, drawn in the frame under the option's own scope, so the frame is that
   option's ground (round 57: "the background can be changed for dark mode, it doesnt always have to be white"). */
const darkPreview = <Card size="sm" style={{ inlineSize: 120 }}><CardContent><CardTitle>Title</CardTitle><CardDescription>Description</CardDescription></CardContent></Card>;

/* Image: the image covers the frame, cropped, inside the frame's edge (the image design). */
export const GalleryAssetCard = () => <AssetCard style={card} media="images/david-tee.jpg" name="David Tee" actions={more("David Tee")} />;
/* Group: its first four assets as a 2 × 2 mosaic, 4 apart, every cell at the frame's corner (the group design). A
   component or design in a cell is a scaled-down image of it, not the live thing at full size. */
export const GalleryAssetCardGroup = () => (
  <AssetCard style={card} name="Group one" actions={more("Group one")}
    group={["images/david-tee.jpg", "images/chip-filter.png", <Button>Button</Button>, darkPreview]} />
);
/* A group of fewer than four leaves its other cells as the card's ground. */
export const GalleryAssetCardGroupFew = () => <AssetCard style={card} name="Group two" actions={more("Group two")} group={["images/david-tee.jpg", "images/chip-pixels.png"]} />;
/* Component: the component as it ships, centred on the frame's surface (the component design). */
export const GalleryAssetCardComponent = () => <AssetCard style={card} media={<Button>Button</Button>} name="Button" actions={copy("<Button>Button</Button>", "Button code")} />;
/* Colour: the colour paints the frame, outlined by the swatch ring; its token in the head, its value behind Copy. */
export const GalleryAssetCardColor = () => <AssetCard style={card} color="#2563EB" name="blue/500" actions={copy("#2563EB", "#2563EB")} />;
/* Type: a role's sample over its face, weight, size and leading. */
export const GalleryAssetCardType = () => <AssetCard style={card} media={typeSample} name="Title" actions={copy("title-lg", "Title role")} />;
/* Icon: the glyph at its native 24. */
export const GalleryAssetCardIcon = () => <AssetCard style={card} media={<SearchIcon width={24} height={24} />} name="Search" actions={copy("SearchIcon", "SearchIcon")} />;
/* A setting (the Theme tab): the option drawn under its own scope; its name as the Inspector writes it. */
// The option's scope on the whole card, so the card and its frame change together (owner, 2026-10-21: "the frame color
// and card color dont seem to always update together. the default is a white bg frame on a light gray card").
export const GalleryAssetCardSetting = () => <AssetCard style={card} media={darkPreview} name="Dark (Default)" data-area-theme="dark" />;
/* Selected: the card's edge in the selection colour. */
export const GalleryAssetCardSelected = () => <AssetCard style={card} selected media="images/david-tee.jpg" name="David Tee" actions={more("David Tee")} />;
/* Interactive: a card that is its own control outside a grid (the app's gallery tiles): hover lifts it, Tab rings it. */
export const GalleryAssetCardInteractive = () => (
  <AssetCard style={card} interactive role="button" tabIndex={0} aria-pressed={false} media={typeSample} name="Title" />
);
/* The grid: a ListBox grid of cards of every kind; arrows move, Space selects, Enter or a double click opens. */
export const GalleryAssetGrid = () => (
  <AssetGrid aria-label="Assets" defaultValue="portrait" style={{ inlineSize: 720, maxInlineSize: "100%", "--area-asset-card-size": "160px" } as never}>
    <AssetGridItem value="portrait" name="David Tee" media="images/david-tee.jpg" />
    <AssetGridItem value="group" name="Group one" group={["images/david-tee.jpg", "images/chip-filter.png", <Button>Button</Button>, darkPreview]} />
    <AssetGridItem value="button" name="Button" media={<Button>Button</Button>} />
    <AssetGridItem value="blue" name="blue/500" color="#2563EB" />
    <AssetGridItem value="title" name="Title" media={typeSample} />
    <AssetGridItem value="search" name="Search" media={<SearchIcon width={24} height={24} />} />
  </AssetGrid>
);
/* Containerless: a component on the page's own ground, the frame's box kept and its edge clear until hover or selection. */
export const GalleryAssetCardContainerless = () => (
  <AssetCard style={card} container="containerless" interactive role="button" tabIndex={0} aria-pressed={false} media={<Button>Button</Button>} name="Button" />
);
/* A containerless image: the image is the surface, its name and detail under it. */
export const GalleryAssetCardContainerlessImage = () => <AssetCard style={card} container="containerless" media="images/david-tee.jpg" name="David Tee" />;
/* A containerless group: its four cells close together, so they read as one thing. */
export const GalleryAssetCardGroupContainerless = () => (
  <AssetCard style={card} container="containerless" name="Group one"
    group={["images/david-tee.jpg", "images/chip-filter.png", <Button size="sm">Button</Button>, typeSample]} />
);
/* Containerless and selected: a component's frame shows the selected edge. */
export const GalleryAssetCardContainerlessSelected = () => <AssetCard style={card} container="containerless" selected media={<Button>Button</Button>} name="Button" />;
/* A selected containerless image: a ring in the selection colour round the image. */
export const GalleryAssetCardContainerlessImageSelected = () => (
  <AssetCard style={card} container="containerless" selected media="images/david-tee.jpg" name="David Tee" />
);
/* Landscape: the frame 5:4 instead of square, as the Components gallery shows four across. */
/* Wide: a 2:1 frame, for a colour or a banner. */
export const GalleryAssetCardWide = () => <AssetCard style={card} aspect="wide" color="#2563EB" name="blue/500" actions={copy("#2563EB", "#2563EB")} />;
/* Checker: the frame on a transparency checker, the colour over it so its alpha shows. */
export const GalleryAssetCardChecker = () => <AssetCard style={card} fill="checker" color="rgb(37 99 235 / 0.4)" name="blue/500 at 40%" actions={copy("rgb(37 99 235 / 0.4)", "blue/500 at 40%")} />;
/* The frame alone (Preview frame, folded in): containerless with no name or controls, filling its column, as an
   inspector's preview of the selection; named for assistive technology by aria-label. */
export const GalleryAssetCardFrame = () => <AssetCard style={card} container="containerless" media={<SearchIcon width={48} height={48} />} role="img" aria-label="Search" />;
/* Screen: a 16:9 frame, a product screen's 1920 × 1080. */
export const GalleryAssetCardScreen = () => <AssetCard style={card} aspect="screen" media={<Button>Button</Button>} name="Button" />;
/* Fit cover: the image cropped to the card's aspect (here 16:9) instead of its own ratio. */
export const GalleryAssetCardFitCover = () => <AssetCard style={card} aspect="screen" fit="cover" media="images/david-tee.jpg" mediaRatio={1} name="David Tee" />;
/* Fit contain: the whole image at its own ratio, centred in the card's square footprint (Are.na's grid). */
export const GalleryAssetCardFitContain = () => <AssetCard style={card} container="basic" fit="contain" media="images/chip-filter.png" mediaRatio={1} name="Filter" />;
/* Mosaic strip: a group's assets in one row at their own ratios, the frame's height, running on past the card's end. */
export const GalleryAssetCardMosaicStrip = () => (
  <AssetCard style={{ inlineSize: 448 }} aspect="wide" mosaic="strip" name="Group one" actions={more("Group one")}
    group={["images/david-tee.jpg", "images/chip-filter.png", "images/chip-pixels.png", "images/david-tee.jpg"]} />
);
export const GalleryAssetCardLandscape = () => <AssetCard style={card} aspect="landscape" media={<Button>Button</Button>} name="Button" />;
/* Name below: the head under the frame, the card's inset above it. */
export const GalleryAssetCardCaptionBelow = () => <AssetCard style={card} caption="below" media={<Button>Button</Button>} name="Button" />;
/* Outside: the card is its frame alone, the asset 8 in all round; the name and controls 4 under the card. */
export const GalleryAssetCardCaptionOutside = () => <AssetCard style={card} caption="outside" media="images/david-tee.jpg" fit="cover" name="David Tee" actions={more("David Tee")} />;
/* Basic: one surface, the head and the asset on the card's fill, no frame of its own. */
export const GalleryAssetCardBasic = () => <AssetCard style={card} container="basic" media={<Button>Button</Button>} name="Button" />;
/* Raised: the card in the surface, white in light. */
export const GalleryAssetCardRaised = () => <AssetCard style={card} container="basic" fill="raised" media={<Button>Button</Button>} name="Button" />;
/* Borderless: no edge at rest. */
export const GalleryAssetCardBorderless = () => <AssetCard style={card} container="basic" borderless media={<Button>Button</Button>} name="Button" />;
/* Hug: the frame as tall as its asset, here a component, instead of square. */
export const GalleryAssetCardHug = () => <AssetCard style={card} aspect="hug" media={<Button>Button</Button>} name="Button" />;
/* A waterfall: each card hugs its asset and drops into the shortest column, in reading order. */
export const GalleryAssetGridWaterfall = () => (
  <AssetGrid aria-label="Assets" layout="waterfall" defaultValue="portrait" style={{ inlineSize: 720, "--area-asset-card-size": "200px" } as never}>
    <AssetGridItem value="portrait" name="David Tee" media="images/david-tee.jpg" mediaRatio={1} />
    <AssetGridItem value="button" name="Button" media={<Button>Button</Button>} />
    <AssetGridItem value="title" name="Title" media={typeSample} />
    <AssetGridItem value="filter" name="Filter" media="images/chip-filter.png" mediaRatio={1} />
    <AssetGridItem value="group" name="Group one" group={["images/david-tee.jpg", "images/chip-filter.png", "images/chip-pixels.png", typeSample]} />
  </AssetGrid>
);
/* A containerless waterfall: Brand's assets as Pinterest lays a board out. */
export const GalleryAssetGridWaterfallContainerless = () => (
  <AssetGrid aria-label="Assets" layout="waterfall" container="containerless" defaultValue="portrait" style={{ inlineSize: 720, "--area-asset-card-size": "200px" } as never}>
    <AssetGridItem value="portrait" name="David Tee" media="images/david-tee.jpg" mediaRatio={1} />
    <AssetGridItem value="title" name="Title" media={typeSample} />
    <AssetGridItem value="pixels" name="Pixels" media="images/chip-pixels.png" mediaRatio={1} />
    <AssetGridItem value="filter" name="Filter" media="images/chip-filter.png" mediaRatio={1} />
    <AssetGridItem value="group" name="Group one" group={["images/david-tee.jpg", "images/chip-filter.png", "images/chip-pixels.png", typeSample]} />
  </AssetGrid>
);

/** A status laid on the picture (2026-11-01): a plain Badge on the frame's top-start plate, at rest. */
export const GalleryAssetCardBadge = () => (
  <AssetCard style={card} aspect="screen" fit="cover" media="images/david-tee.jpg" mediaRatio={1} name="David Tee"
    badge={<Badge variant="plain" tone="success" icon={<StatusAvailableFilledIcon size={12} />}>Published</Badge>} />
);
/** The mark alone, on a round plate: its word is its name. */
export const GalleryAssetCardBadgeMark = () => (
  <AssetCard style={card} aspect="screen" fit="cover" caption="overlay" media="images/david-tee.jpg" mediaRatio={1} name="David Tee"
    badge={<Badge variant="plain" iconOnly tone="caution" icon={<EllipseIcon size={12} />} aria-label="Draft" />} />
);
