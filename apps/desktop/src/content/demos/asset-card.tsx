/** Asset card gallery specimens: one variant per tile. docs/specs/asset-card.md. Example people are David Tee. */
import { AssetCard, AssetGrid, AssetGridItem, Button } from "@area/react";
import { CopyIcon } from "@area/icons";

const card = { inlineSize: 224 } as const;
/* A type style as an asset: its sample, as the Typography tab shows a role. */
const typeSample = <span style={{ fontSize: "var(--area-text-2xl-size)", lineHeight: "var(--area-text-2xl-leading)", fontWeight: "var(--area-weight-strong)" }}>Aa</span>;

/* An image: contained in the frame, never cropped, with the container corner. */
export const GalleryAssetCard = () => <AssetCard style={card} media="images/david-tee.jpg" name="David Tee" meta="JPG · 1200 × 1200" />;
/* A component: any element, centred. */
export const GalleryAssetCardComponent = () => <AssetCard style={card} media={<Button>Button</Button>} name="Button" meta="Component" />;
/* A type style. */
export const GalleryAssetCardType = () => <AssetCard style={card} media={typeSample} name="Title" meta="Type · 24 / 32" />;
/* A group: its first four assets as a 2 × 2 mosaic, each cropped to its cell with the small corner. */
export const GalleryAssetCardGroup = () => (
  <AssetCard style={card} name="Brand" meta="4 assets"
    group={["images/david-tee.jpg", "images/chip-filter.png", <Button size="sm">Button</Button>, typeSample]} />
);
/* A group of fewer than four leaves its other cells empty. */
export const GalleryAssetCardGroupFew = () => <AssetCard style={card} name="Portraits" meta="2 assets" group={["images/david-tee.jpg", "images/chip-pixels.png"]} />;
/* Controls under the frame, at the end of the name's line. */
export const GalleryAssetCardActions = () => (
  <AssetCard style={card} media={<Button>Button</Button>} name="Button" meta="Component"
    actions={<Button variant="ghost" tone="neutral" size="sm" iconOnly icon={<CopyIcon />} aria-label="Copy Button code" />} />
);
/* Selected: the frame's edge in the selection colour. */
export const GalleryAssetCardSelected = () => <AssetCard style={card} selected media="images/david-tee.jpg" name="David Tee" meta="JPG · 1200 × 1200" />;
/* Interactive: a card that is its own control outside a grid (the app's gallery tiles): hover lifts the frame, Tab rings it. */
export const GalleryAssetCardInteractive = () => (
  <AssetCard style={card} interactive role="button" tabIndex={0} aria-pressed={false} media={typeSample} name="Title" meta="Type · 24 / 32" />
);
/* The grid: a ListBox grid of cards; arrows move, Space selects, Enter or a double click opens. */
export const GalleryAssetGrid = () => (
  <AssetGrid aria-label="Assets" defaultValue="portrait" style={{ inlineSize: 720, "--area-asset-card-size": "200px" } as never}>
    <AssetGridItem value="brand" name="Brand" meta="4 assets" group={["images/david-tee.jpg", "images/chip-filter.png", <Button size="sm">Button</Button>, typeSample]} />
    <AssetGridItem value="portrait" name="David Tee" meta="JPG · 1200 × 1200" media="images/david-tee.jpg" />
    <AssetGridItem value="button" name="Button" meta="Component" media={<Button>Button</Button>} />
  </AssetGrid>
);
/* Containerless: a component on the page's own ground, the frame's box kept and its edge clear until hover or selection. */
export const GalleryAssetCardContainerless = () => (
  <AssetCard style={card} container="containerless" interactive role="button" tabIndex={0} aria-pressed={false} media={<Button>Button</Button>} name="Button" meta="Component" />
);
/* A containerless image: the image is the surface, its name and detail under it. */
export const GalleryAssetCardContainerlessImage = () => <AssetCard style={card} container="containerless" caption="below" media="images/david-tee.jpg" name="David Tee" meta="JPG · 1200 × 1200" />;
/* A containerless group: its four cells close together, so they read as one thing. */
export const GalleryAssetCardGroupContainerless = () => (
  <AssetCard style={card} container="containerless" caption="below" name="Brand" meta="4 assets"
    group={["images/david-tee.jpg", "images/chip-filter.png", <Button size="sm">Button</Button>, typeSample]} />
);
/* Containerless and selected: a component's frame shows the selected edge. */
export const GalleryAssetCardContainerlessSelected = () => <AssetCard style={card} container="containerless" selected media={<Button>Button</Button>} name="Button" meta="Component" />;
/* A selected containerless image: a ring in the selection colour round the image. */
export const GalleryAssetCardContainerlessImageSelected = () => (
  <AssetCard style={card} container="containerless" caption="below" selected media="images/david-tee.jpg" name="David Tee" meta="JPG · 1200 × 1200" />
);
/* Hug: the frame as tall as its asset, here a component, instead of square. */
export const GalleryAssetCardHug = () => <AssetCard style={card} aspect="hug" media={<Button>Button</Button>} name="Button" meta="Component" />;
/* A waterfall: each card hugs its asset and drops into the shortest column, in reading order. */
export const GalleryAssetGridWaterfall = () => (
  <AssetGrid aria-label="Assets" layout="waterfall" defaultValue="portrait" style={{ inlineSize: 720, "--area-asset-card-size": "200px" } as never}>
    <AssetGridItem value="portrait" name="David Tee" meta="JPG · 1200 × 1200" media="images/david-tee.jpg" mediaRatio={1} />
    <AssetGridItem value="button" name="Button" meta="Component" media={<Button>Button</Button>} />
    <AssetGridItem value="title" name="Title" meta="Type · 24 / 32" media={typeSample} />
    <AssetGridItem value="filter" name="Filter" meta="PNG · 1254 × 1254" media="images/chip-filter.png" mediaRatio={1} />
    <AssetGridItem value="brand" name="Brand" meta="4 assets" group={["images/david-tee.jpg", "images/chip-filter.png", "images/chip-pixels.png", typeSample]} />
  </AssetGrid>
);
/* A containerless waterfall: Brand's assets as Pinterest lays a board out. */
export const GalleryAssetGridWaterfallContainerless = () => (
  <AssetGrid aria-label="Assets" layout="waterfall" container="containerless" defaultValue="portrait" style={{ inlineSize: 720, "--area-asset-card-size": "200px" } as never}>
    <AssetGridItem caption="below" value="portrait" name="David Tee" meta="JPG · 1200 × 1200" media="images/david-tee.jpg" mediaRatio={1} />
    <AssetGridItem caption="below" value="title" name="Title" meta="Type · 24 / 32" media={typeSample} />
    <AssetGridItem caption="below" value="pixels" name="Pixels" meta="PNG · 1080 × 1080" media="images/chip-pixels.png" mediaRatio={1} />
    <AssetGridItem caption="below" value="filter" name="Filter" meta="PNG · 1254 × 1254" media="images/chip-filter.png" mediaRatio={1} />
    <AssetGridItem caption="below" value="brand" name="Brand" meta="4 assets" group={["images/david-tee.jpg", "images/chip-filter.png", "images/chip-pixels.png", typeSample]} />
  </AssetGrid>
);
