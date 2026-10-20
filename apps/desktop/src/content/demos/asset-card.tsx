/** Asset card gallery specimens: one kind per tile. docs/specs/asset-card.md. Example people are David Tee. The card is
 * square: a head with the name and a More button, then the frame with the asset, 4 in (round 55's designs). */
import { AssetCard, AssetGrid, AssetGridItem, Button, Card, CardContent, CardDescription, CardTitle, CopyButton } from "@area/react";
import { MoreHorizontalIcon, SearchIcon } from "@area/icons";

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
/* A setting (the Language tab): the option drawn under its own scope; its name as the Inspector writes it. */
export const GalleryAssetCardSetting = () => <AssetCard style={card} media={darkPreview} name="Dark (Default)" frameProps={{ "data-area-theme": "dark" }} />;
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
